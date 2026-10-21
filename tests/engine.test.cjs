const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../app/src/main/assets/engine.js');

test('rotation preserves degree, is reversible and respects each direction', () => {
  assert.equal(E.rotate(1), 2); assert.equal(E.rotate(8), 1);
  for (let mask = 1; mask < 16; mask++) {
    assert.equal(E.rotate(mask, 4), mask);
    assert.equal(E.rotate(E.rotate(mask), -1), mask);
    assert.equal(E.degree(mask), E.degree(E.rotate(mask)));
  }
});
test('all 40 campaign puzzles start unsolved and have complete, leak-free solutions', () => {
  const signatures = new Set();
  for (let id = 1; id <= 40; id++) {
    const level = E.campaignLevel(id), initial = E.analyze(level, level.initial), final = E.analyze(level, level.solution);
    assert.equal(initial.solved, false, `Level ${id} starts solved`);
    assert.equal(final.solved, true, `Level ${id} cannot be completed`);
    assert.equal(final.powered.size, level.size ** 2);
    assert.equal(final.leaks, 0);
    assert.ok(level.homes.length > 0);
    assert.ok(level.par > 0);
    assert.deepEqual(E.campaignLevel(id), level);
    signatures.add(JSON.stringify(level.initial));
    const masks = level.initial.slice();
    for (let i = 0; i < masks.length; i++) {
      if (level.locked[i]) assert.equal(masks[i], level.solution[i]);
      masks[i] = E.rotate(masks[i], E.turnDistance(masks[i], level.solution[i]));
    }
    assert.equal(E.analyze(level, masks).solved, true);
  }
  assert.equal(signatures.size, 40);
  assert.equal(E.campaignLevel(1).par, 2);
});
test('open ends and disconnected tiles prevent victory even if houses receive power', () => {
  const level = { size: 2, source: 0, homes: [1], solution: [6, 8, 3, 8] };
  assert.equal(E.analyze(level, level.solution).solved, true);
  const broken = [2, 8, 3, 8];
  const result = E.analyze(level, broken);
  assert.equal(result.litHomes, 1);
  assert.equal(result.solved, false);
  assert.equal(E.analyze(level, [3, 8, 3, 8]).leaks, 1);
});
test('365 daily puzzles are deterministic, solvable and initially unsolved', () => {
  for (let i = 0; i < 365; i++) {
    const date = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
    const level = E.dailyLevel(date);
    assert.deepEqual(level, E.dailyLevel(date));
    assert.equal(E.analyze(level, level.solution).solved, true);
    assert.equal(E.analyze(level, level.initial).solved, false);
  }
  assert.notDeepEqual(E.dailyLevel('2026-10-21').initial, E.dailyLevel('2026-10-22').initial);
});
test('40 unique wins finance exactly all five landmarks; replays and dailies never farm currency', () => {
  const p = E.newProgress();
  assert.equal(E.build(p, 'bakery'), false);
  assert.throws(() => E.recordWin(p, E.campaignLevel(4), 10, 0));
  for (let id = 1; id <= 40; id++) {
    const level = E.campaignLevel(id);
    const won = E.recordWin(p, level, level.par, 0);
    assert.equal(won.energy, 1);
    assert.equal(E.recordWin(p, level, level.par + 1, 0).energy, 0);
    const next = E.BUILDINGS.find(b => !p.buildings.includes(b.id));
    if (next && E.energy(p) >= next.cost) {
      assert.equal(E.build(p, next.id), true);
      assert.equal(E.build(p, next.id), false);
    }
  }
  assert.equal(p.buildings.length, 5);
  assert.equal(E.energy(p), 0);
  const daily = E.dailyLevel('2026-10-21');
  assert.equal(E.recordWin(p, daily, daily.par, 0).energy, 0);
  assert.equal(E.energy(p), 0);
  assert.deepEqual(E.sanitizeProgress(JSON.parse(JSON.stringify(p))), p);
});
test('hints limit stars and a worse replay never replaces best achievement', () => {
  const p = E.newProgress(), level = E.campaignLevel(1);
  assert.equal(E.stars(level, level.par, 0), 3);
  assert.equal(E.stars(level, level.par, 1), 2);
  assert.equal(E.stars(level, level.par, 3), 1);
  E.recordWin(p, level, 2, 0); E.recordWin(p, level, 20, 3);
  assert.deepEqual(p.completed[1], { stars: 3, moves: 2 });
});
test('damaged saves cannot skip levels or award unaffordable landmarks', () => {
  const p = E.sanitizeProgress({ version: 1, completed: { 1: { stars: 3 }, 3: { stars: 3 }, 90: { stars: 3 } }, buildings: ['lighthouse'], settings: { lang: 'bad' } });
  assert.equal(E.unlocked(p), 2);
  assert.deepEqual(Object.keys(p.completed), ['1']);
  assert.deepEqual(p.buildings, []);
  assert.equal(p.settings.lang, 'ru');
  assert.deepEqual(E.sanitizeProgress(null), E.newProgress());
});
test('mid-level save restores the board and refuses incompatible masks and fixed tile tampering', () => {
  const level = E.campaignLevel(10);
  const active = { id: level.id, mode: level.mode, masks: level.initial.slice(), moves: 3, hints: 0, history: [] };
  assert.ok(E.resume(level, active));
  active.masks[0] = 0;
  assert.equal(E.resume(level, active), null);
  active.masks = level.initial.slice();
  active.masks[level.source] = 0;
  assert.equal(E.resume(level, active), null);
  assert.equal(E.resume(E.campaignLevel(11), active), null);
});
