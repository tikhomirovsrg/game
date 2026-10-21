/* Lumen City — deterministic puzzle rules, independent of the renderer. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Lumen = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const LEVEL_COUNT = 40;
  const DIRS = [{ bit: 1, opposite: 4, dx: 0, dy: -1 },
    { bit: 2, opposite: 8, dx: 1, dy: 0 },
    { bit: 4, opposite: 1, dx: 0, dy: 1 },
    { bit: 8, opposite: 2, dx: -1, dy: 0 }];
  const BUILDINGS = [
    { id: 'bakery', cost: 4, level: 4 },
    { id: 'garden', cost: 6, level: 10 },
    { id: 'station', cost: 8, level: 18 },
    { id: 'observatory', cost: 10, level: 28 },
    { id: 'lighthouse', cost: 12, level: 40 }
  ];
  function rng(seed) {
    let state = seed >>> 0;
    return () => {
      state += 0x6D2B79F5;
      let t = Math.imul(state ^ state >>> 15, 1 | state);
      t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hash(text) {
    let result = 2166136261;
    for (const char of String(text)) result = Math.imul(result ^ char.charCodeAt(0), 16777619);
    return result >>> 0;
  }
  function rotate(mask, turns = 1) {
    const n = ((turns % 4) + 4) % 4;
    return ((mask << n) | (mask >> (4 - n))) & 15;
  }
  function degree(mask) { return DIRS.filter(d => mask & d.bit).length; }
  function neighbor(index, direction, size) {
    const x = index % size + direction.dx, y = Math.floor(index / size) + direction.dy;
    return x < 0 || y < 0 || x >= size || y >= size ? -1 : y * size + x;
  }
  function shuffle(array, random) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  function turnDistance(from, to) {
    for (let k = 0; k < 4; k++) if (rotate(from, k) === to) return k;
    throw new Error('Incompatible tile masks');
  }
  function generate(seed, difficulty = 1) {
    const rank = Math.max(1, Math.min(40, difficulty));
    const size = rank <= 4 ? 3 : rank <= 16 ? 4 : rank <= 32 ? 5 : 6;
    const random = rng(seed), count = size * size;
    const source = Math.floor(size / 2) * size + Math.floor(size / 2);
    const solution = Array(count).fill(0), seen = new Set([source]), frontier = [source];
    while (seen.size < count) {
      const slot = Math.floor(random() * frontier.length), index = frontier[slot];
      const choices = DIRS.map(d => ({ d, next: neighbor(index, d, size) }))
        .filter(v => v.next >= 0 && !seen.has(v.next));
      if (!choices.length) { frontier.splice(slot, 1); continue; }
      const { d, next } = choices[Math.floor(random() * choices.length)];
      solution[index] |= d.bit;
      solution[next] |= d.opposite;
      seen.add(next); frontier.push(next);
    }
    const locked = Array(count).fill(false);
    locked[source] = true;
    const eligible = shuffle(solution.map((_, i) => i).filter(i => i !== source), random);
    if (rank >= 9) eligible.slice(0, Math.floor(size / 2)).forEach(i => { locked[i] = true; });
    const initial = solution.slice();
    const movable = eligible.filter(i => !locked[i] && solution[i] !== 15);
    const changes = rank === 1 ? 2 : rank === 2 ? 3 : Math.max(4, Math.floor(movable.length * (0.4 + rank / 90)));
    movable.slice(0, changes).forEach(i => {
      const distinct = [1, 2, 3].filter(k => rotate(solution[i], k) !== solution[i]);
      initial[i] = rotate(solution[i], distinct[Math.floor(random() * distinct.length)]);
    });
    // A nearly completed board keeps the very first interaction approachable.
    if (rank <= 2) movable.slice(0, changes).forEach(i => { initial[i] = rotate(solution[i], 3); });
    const homes = solution.map((mask, i) => degree(mask) === 1 && i !== source ? i : -1).filter(i => i >= 0);
    const par = initial.reduce((sum, mask, i) => sum + turnDistance(mask, solution[i]), 0);
    return { seed, difficulty: rank, size, source, solution, initial, locked, homes, par };
  }
  function campaignLevel(number) {
    if (!Number.isInteger(number) || number < 1 || number > LEVEL_COUNT) throw new RangeError('Invalid campaign level');
    return { ...generate(hash('lumen-campaign-v1-' + number), number), id: number, mode: 'campaign' };
  }
  function dailyLevel(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Invalid daily date');
    return { ...generate(hash('lumen-daily-v1-' + date), 22), id: date, mode: 'daily' };
  }
  function analyze(level, masks) {
    if (!Array.isArray(masks) || masks.length !== level.solution.length) throw new Error('Invalid board');
    const powered = new Set([level.source]), queue = [level.source];
    let leaks = 0;
    for (let at = 0; at < queue.length; at++) {
      const index = queue[at];
      for (const direction of DIRS) {
        if (!(masks[index] & direction.bit)) continue;
        const next = neighbor(index, direction, level.size);
        if (next < 0 || !(masks[next] & direction.opposite)) { leaks++; continue; }
        if (!powered.has(next)) { powered.add(next); queue.push(next); }
      }
    }
    const litHomes = level.homes.filter(i => powered.has(i)).length;
    return { powered, leaks, litHomes, totalHomes: level.homes.length,
      solved: powered.size === masks.length && leaks === 0 };
  }
  function stars(level, moves, hints = 0) {
    const perfect = level.par + Math.max(2, Math.floor(level.par * 0.15));
    if (!hints && moves <= perfect) return 3;
    return moves <= Math.ceil(perfect * 1.8) && hints <= 2 ? 2 : 1;
  }
  function newProgress() {
    return { version: 1, completed: {}, buildings: [], daily: {}, active: null,
      settings: { sound: true, haptics: true, lang: 'ru' }, events: [] };
  }
  function sanitizeProgress(input) {
    const clean = newProgress();
    if (!input || input.version !== 1) return clean;
    for (const [key, value] of Object.entries(input.completed || {})) {
      const id = Number(key);
      if (Number.isInteger(id) && id >= 1 && id <= LEVEL_COUNT && value &&
          Number.isInteger(value.stars) && value.stars >= 1 && value.stars <= 3) {
        clean.completed[id] = { stars: value.stars, moves: Math.max(0, Number(value.moves) || 0) };
      }
    }
    // Keep campaign progression contiguous even when a damaged save contains gaps.
    let gap = false;
    for (let id = 1; id <= LEVEL_COUNT; id++) {
      if (!clean.completed[id]) gap = true;
      if (gap) delete clean.completed[id];
    }
    const earned = Object.keys(clean.completed).length;
    let spent = 0;
    for (const building of BUILDINGS) {
      if (Array.isArray(input.buildings) && input.buildings.includes(building.id) && spent + building.cost <= earned) {
        clean.buildings.push(building.id); spent += building.cost;
      } else break;
    }
    const settings = input.settings || {};
    clean.settings = { sound: settings.sound !== false, haptics: settings.haptics !== false,
      lang: settings.lang === 'en' ? 'en' : 'ru' };
    for (const key of Object.keys(input.daily || {}).sort().slice(-60)) {
      const value = input.daily[key];
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && value && Number.isInteger(value.moves) && value.moves >= 0) {
        clean.daily[key] = { moves: value.moves, stars: Math.min(3, Math.max(1, Number(value.stars) || 1)) };
      }
    }
    if (input.active && typeof input.active === 'object') clean.active = input.active;
    clean.events = Array.isArray(input.events) ? input.events.slice(-300).filter(e => e && typeof e.name === 'string') : [];
    return clean;
  }
  function unlocked(progress) { return Math.min(LEVEL_COUNT, Object.keys(progress.completed).length + 1); }
  function energy(progress) {
    return Object.keys(progress.completed).length - BUILDINGS.filter(b => progress.buildings.includes(b.id)).reduce((n, b) => n + b.cost, 0);
  }
  function recordWin(progress, level, moves, hints) {
    const result = { moves, stars: stars(level, moves, hints) };
    const bucket = level.mode === 'daily' ? progress.daily : progress.completed;
    if (level.mode !== 'daily' && level.id > unlocked(progress)) throw new Error('Level is locked');
    const old = bucket[level.id], first = !old;
    bucket[level.id] = { stars: Math.max(result.stars, old?.stars || 0), moves: Math.min(result.moves, old?.moves ?? Infinity) };
    progress.active = null;
    return { ...result, first, energy: first && level.mode === 'campaign' ? 1 : 0 };
  }
  function build(progress, id) {
    const next = BUILDINGS.find(b => !progress.buildings.includes(b.id));
    if (!next || next.id !== id || energy(progress) < next.cost) return false;
    progress.buildings.push(id); return true;
  }
  function resume(level, active) {
    if (!active || active.id !== level.id || active.mode !== level.mode) return null;
    const masks = active.masks;
    if (!Array.isArray(masks) || masks.length !== level.initial.length ||
        !masks.every((mask, i) => Number.isInteger(mask) && [0, 1, 2, 3].some(k => rotate(level.solution[i], k) === mask) &&
          (!level.locked[i] || mask === level.solution[i]))) return null;
    if (!Number.isInteger(active.moves) || active.moves < 0 || !Number.isInteger(active.hints) || active.hints < 0) return null;
    // Undo history is optional; discard malformed entries on recovery.
    const history = Array.isArray(active.history) ? active.history : [];
    const validHistory = history.every(item => item && Number.isInteger(item.index) && item.index >= 0 && item.index < masks.length &&
      !level.locked[item.index] && Number.isInteger(item.before) && [0, 1, 2, 3].some(k => rotate(item.before, k) === level.solution[item.index]));
    return { masks: masks.slice(), moves: active.moves, hints: active.hints, history: validHistory ? history.slice(-500) : [] };
  }
  return { LEVEL_COUNT, BUILDINGS, DIRS, hash, rotate, degree, neighbor, turnDistance,
    campaignLevel, dailyLevel, analyze, stars, newProgress, sanitizeProgress, unlocked, energy, recordWin, build, resume };
});
