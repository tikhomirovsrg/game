(function () {
  'use strict';
  const E = window.Lumen, KEY = 'lumen-city-v1';
  const $ = selector => document.querySelector(selector);
  const paths = {
    bolt: '<path d="m13 2-8 12h6l-1 8 9-12h-6l1-8Z"/>',
    city: '<path d="M3 21V9l5-3 5 3v12M13 21V3h7v18M1 21h22M6 11h3m-3 4h3m7-8h1m-1 4h1m-1 4h1"/>',
    levels: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back: '<path d="m14 6-6 6 6 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
    settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="15" cy="17" r="3" fill="currentColor"/>',
    home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M10 21v-7h4v7"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
    undo: '<path d="M8 4 3 9l5 5M3 9h10a7 7 0 0 1 0 14" transform="translate(0 -2)"/>',
    reset: '<path d="M3 4v6h6M3 10a9 9 0 1 1 1 8"/>',
    hint: '<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0l-1 2H9l-1-2Z"/>',
    check: '<path d="m5 12 4 4L20 5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3l-1 1v1m0 3h.01"/>',
    leaf: '<path d="M20 3c-9-1-17 3-16 10s13 7 16-10ZM4 21 15 9"/>',
    train: '<rect x="5" y="3" width="14" height="15" rx="4"/><path d="M5 10h14M8 21l2-3m6 3-2-3M8 14h1m6 0h1M12 3v7"/>',
    moon: '<path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z"/>',
    tower: '<path d="M8 21 9 8h6l1 13M7 21h10M8 8h8l-4-5-4 5Zm-4 0H2m18 0h2M5 3 3 1m16 2 2-2M9 15h6"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 11 6-4M9 13l6 4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>'
  };
  const icon = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.bolt}</svg>`;
  const copy = {
    ru: {
      home: 'Город', levels: 'Уровни', daily: 'Задача дня', settings: 'Настройки',
      eyebrow: 'Маленькие решения. Большой свет.', title: 'Верни городу<br><em>свет.</em>',
      intro: 'Соединяй линии. Зажигай окна.<br>Пусть жизнь вернётся в тихую гавань.',
      harbor: 'Тихая гавань', restored: 'восстановлено', play: 'Зажечь следующий квартал',
      continue: 'Продолжить уровень', level: 'Уровень', of: 'из', dailySub: 'Одна схема для всех. Твой лучший маршрут.',
      new: 'СЕГОДНЯ', chapter: 'ГЛАВА', levelsTitle: 'Карта света', levelsIntro: 'Каждое решение приближает утро.',
      cityTitle: 'Город оживает', buildings: 'объектов', sparks: 'искры', solved: 'уровней',
      build: 'Восстановить', need: 'Нужно', nextBuilding: 'Сначала предыдущий объект',
      cityNote: 'Искра выдаётся за первое прохождение каждого уровня. Восстанавливай объекты по порядку — все 40 искр можно получить в игре.',
      allDone: 'Маяк снова светит', allDoneSub: 'Гавань восстановлена. Улучши результаты или реши задачу дня.',
      replay: 'Вернуться к уровням', moves: 'Повороты', homes: 'Дома со светом', goal: 'Соедини все линии без открытых концов',
      undo: 'Ход назад', reset: 'Заново', hint: 'Подсказка', mentor: 'МИРА · ГОРОДСКОЙ ИНЖЕНЕР',
      tip1: 'Нажимай на тёмные участки, чтобы повернуть их. Соедини все линии с золотым генератором. Осталось всего два поворота!',
      tip2: 'Свет идёт только между соединёнными концами. Зажги каждый дом и замкни всю сеть.',
      tipLock: 'Участки с замком закреплены. Используй их как ориентиры при сборке сети.',
      tip: 'Начни с краёв поля: провода не должны смотреть наружу. Затем двигайся к генератору.',
      noTimer: 'Без таймера · Без потери жизней', help: 'Как вернуть свет',
      helpItems: ['Нажми на участок — он повернётся на 90° по часовой стрелке.', 'Соедини все участки с золотым генератором. Открытых концов остаться не должно.', 'Генератор и участки с замком не вращаются.', 'Три звезды — за экономное решение без подсказок. Отмена не возвращает потраченные повороты.', 'Подсказка бесплатно ставит один участок в верное положение. За такое решение можно получить до двух звёзд.'],
      understood: 'Понятно, зажигаем', lightOn: 'И стало светлее', winText: 'Ещё несколько окон снова ждут своих жителей.',
      energyEarned: 'искра для города', record: 'Лучший результат сохранён', next: 'Следующий уровень', toCity: 'Вернуться в город',
      dailyTitle: 'Один день.<br>Одна новая схема.', dailyText: 'У всех игроков с одинаковой датой на устройстве одна задача. Решай её экономнее и сравнивай результат с друзьями.',
      dailyRule1: 'Новая схема каждый день, работает офлайн', dailyRule2: 'Без таймера. Считаются повороты и подсказки', dailyRule3: 'Личный рекорд и отправка результата друзьям',
      dailyPlay: 'Принять вызов', dailyAgain: 'Улучшить результат', dailyRecord: 'Твой рекорд', dailyWin: 'Задача дня решена',
      dailyNote: 'Общего онлайн-рейтинга в этой версии нет. Ежедневные задачи не дают искр для строительства.',
      share: 'Поделиться результатом', shareText: 'Lumen City · Задача {date}\nМой результат: {moves} поворотов, {stars}/3 звезды. Сможешь лучше?\nhttps://github.com/tikhomirovsrg/game',
      sound: 'Звук', haptics: 'Вибрация', language: 'Язык', privacy: 'Игра работает без интернета и рекламы. Прогресс и последние 300 игровых событий хранятся только на этом устройстве. Данные никуда автоматически не отправляются.',
      export: 'Поделиться отчётом теста', version: 'Версия 0.1.0 · Первый игровой тест',
      resetProgress: 'Сбросить прогресс', resetConfirm: 'Начать сначала?', resetWarning: 'Уровни, построенные объекты, рекорды и незаконченная игра будут удалены с этого устройства.',
      cancel: 'Отмена', resetYes: 'Да, начать сначала', resetLevel: 'Начать уровень заново?', resetLevelText: 'Текущие повороты и подсказки будут сброшены. Лучший результат сохранится.',
      hintUsed: 'Один участок восстановлен. Подсказки бесплатны.', fixed: 'Этот участок закреплён', savedError: 'Не удалось сохранить прогресс. Проверь свободное место.',
      corrupt: 'Сохранение повреждено. Создан новый прогресс.', copied: 'Результат скопирован', shareFallback: 'Скопируй этот текст', noHint: 'Вся сеть уже соединена',
      saveReady: 'Прогресс сохранён', reportTitle: 'Отчёт игрового теста Lumen City',
      chapters: ['Первый свет', 'Улица встреч', 'Новые маршруты', 'Выше крыш', 'Огни гавани'],
      names: ['Пекарня', 'Сад у воды', 'Трамвайная станция', 'Обсерватория', 'Маяк'],
      descriptions: ['Запах тёплого хлеба по утрам', 'Место для неспешных встреч', 'Город снова в движении', 'Ночь, полная открытий', 'Путь домой для каждого'],
      stories: ['Мира включает вывеску пекарни. Хозяин достаёт из печи первую партию хлеба: «Значит, завтра мы снова откроемся». Гавань пахнет корицей.',
        'Вода зашумела в старом фонтане. Садовник оставил на скамейке две чашки чая. Кажется, сегодня ему будет с кем поговорить.',
        'Первый трамвай звенит на повороте. Мира машет водителю. На табло загорается знакомое слово: «Домой».',
        'Купол обсерватории медленно открывается. Астроном замечает у горизонта огонёк корабля. Осталось зажечь маяк — его ждут.',
        'Луч маяка скользит по воде. Из темноты отвечает корабль. Город снова встречает своих. Спасибо — этот свет появился благодаря тебе.']
    },
    en: {
      home: 'City', levels: 'Levels', daily: 'Daily puzzle', settings: 'Settings',
      eyebrow: 'Small solutions. A brighter world.', title: 'Bring the city<br><em>back to light.</em>',
      intro: 'Connect the lines. Light the windows.<br>Bring life back to a quiet harbor.',
      harbor: 'Quiet Harbor', restored: 'restored', play: 'Light the next block', continue: 'Continue puzzle',
      level: 'Level', of: 'of', dailySub: 'One puzzle for everyone. Your best solution.', new: 'TODAY',
      chapter: 'CHAPTER', levelsTitle: 'A map of light', levelsIntro: 'Every solution brings the dawn closer.',
      cityTitle: 'A city awakening', buildings: 'landmarks', sparks: 'sparks', solved: 'levels', build: 'Restore', need: 'Need',
      nextBuilding: 'Restore the previous landmark first', cityNote: 'Earn one spark for the first completion of each level. Restore landmarks in order. All 40 sparks are earned by playing.',
      allDone: 'The lighthouse shines again', allDoneSub: 'The harbor is restored. Improve your scores or try the daily puzzle.', replay: 'Explore the levels',
      moves: 'Rotations', homes: 'Homes with light', goal: 'Connect every line with no open ends', undo: 'Undo', reset: 'Restart', hint: 'Hint',
      mentor: 'MIRA · CITY ENGINEER', tip1: 'Tap the dark tiles to rotate them. Connect every line to the golden generator. Just two rotations to go!',
      tip2: 'Power flows through matching ends. Light every home and connect the whole network.', tipLock: 'Tiles with a lock are fixed. Use them as anchors to solve the network.',
      tip: 'Start at the edges: wires should never point off the board. Then work towards the generator.', noTimer: 'No timer · No lost lives',
      help: 'Bring back the light', helpItems: ['Tap a tile to rotate it 90° clockwise.', 'Connect every tile to the golden generator. Leave no open ends.', 'The generator and tiles with a lock cannot rotate.', 'Earn three stars with an efficient solution and no hints. Undo does not refund rotations.', 'A free hint puts one tile in its correct orientation. A solution using hints earns at most two stars.'],
      understood: 'Got it. Let’s light up', lightOn: 'A little brighter', winText: 'A few more windows are ready to welcome their people home.', energyEarned: 'spark for the city',
      record: 'Personal best saved', next: 'Next level', toCity: 'Back to the city', dailyTitle: 'One day.<br>One new puzzle.',
      dailyText: 'Everyone with the same device date gets the same puzzle. Find an efficient solution and compare your score with friends.',
      dailyRule1: 'A new puzzle every day, available offline', dailyRule2: 'No timer. Rotations and hints count', dailyRule3: 'Personal bests and shareable results',
      dailyPlay: 'Take the challenge', dailyAgain: 'Beat your best', dailyRecord: 'Your best', dailyWin: 'Daily puzzle complete',
      dailyNote: 'This version has no global online leaderboard. Daily puzzles do not earn building sparks.', share: 'Share your result',
      shareText: 'Lumen City · Daily puzzle {date}\nMy score: {moves} rotations, {stars}/3 stars. Can you do better?\nhttps://github.com/tikhomirovsrg/game',
      sound: 'Sound', haptics: 'Haptics', language: 'Language', privacy: 'Offline, with no ads. Progress and the last 300 gameplay events stay on this device. Nothing is sent automatically.',
      export: 'Share test report', version: 'Version 0.1.0 · First playtest', resetProgress: 'Reset progress', resetConfirm: 'Start over?',
      resetWarning: 'Levels, restored landmarks, records and your unfinished puzzle will be deleted from this device.', cancel: 'Cancel', resetYes: 'Yes, start over',
      resetLevel: 'Restart this puzzle?', resetLevelText: 'Current rotations and hints will reset. Your best score will be kept.', hintUsed: 'One tile restored. Hints are always free.',
      fixed: 'This tile is fixed', savedError: 'Could not save progress. Check available storage.', corrupt: 'Save data was damaged. New progress created.',
      copied: 'Result copied', shareFallback: 'Copy this text', noHint: 'The network is already connected', saveReady: 'Progress saved', reportTitle: 'Lumen City playtest report',
      chapters: ['First light', 'Meeting street', 'New connections', 'Above the rooftops', 'Harbor lights'],
      names: ['The bakery', 'Waterside garden', 'Tram station', 'Observatory', 'Lighthouse'],
      descriptions: ['The smell of fresh bread at dawn', 'A place to slow down together', 'The city is moving again', 'A night full of discoveries', 'A way home for everyone'],
      stories: ['Mira switches on the bakery sign. The baker takes the first loaves from the oven. “Then we’re opening tomorrow.” The harbor smells of cinnamon.',
        'Water splashes in the old fountain. The gardener has left two cups of tea on a bench. Today, perhaps, someone will stay for a conversation.',
        'The first tram rings its bell around the corner. Mira waves to the driver. A familiar word appears on the destination board: “Home.”',
        'The observatory dome slowly opens. The astronomer spots a ship on the horizon. Just the lighthouse remains. Someone is waiting for it.',
        'The lighthouse beam sweeps across the water. A ship answers from the dark. The city welcomes its people again. Thank you. You brought back this light.']
    }
  };
  let saveWarning = '';
  function readProgress() {
    try { return E.sanitizeProgress(JSON.parse(localStorage.getItem(KEY))); }
    catch (_) { saveWarning = 'corrupt'; return E.newProgress(); }
  }
  let progress = readProgress(), page = 'home', game = null, toastTimer, winTimer, audio;
  const t = key => copy[progress.settings.lang][key];
  const esc = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); }
    catch (_) { toast(t('savedError')); }
  }
  function track(name, details = {}) {
    progress.events.push({ name, at: new Date().toISOString(), ...details });
    progress.events = progress.events.slice(-300); persist();
  }
  function saveGame() {
    if (game && !game.finished) {
      progress.active = { id: game.level.id, mode: game.level.mode, masks: game.masks.slice(),
        moves: game.moves, hints: game.hints, history: game.history.slice(-500) };
    }
    persist();
  }
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
  }
  function tone(win = false) {
    if (!progress.settings.sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      audio.resume();
      const now = audio.currentTime;
      (win ? [523, 659, 784] : [330]).forEach((f, i) => {
        const oscillator = audio.createOscillator(), gain = audio.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, now + i * .1);
        gain.gain.exponentialRampToValueAtTime(.045, now + i * .1 + .015);
        gain.gain.exponentialRampToValueAtTime(.0001, now + i * .1 + .22);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(now + i * .1); oscillator.stop(now + i * .1 + .24);
      });
    } catch (_) { /* Sound is optional on older WebViews. */ }
  }
  function haptic() {
    if (progress.settings.haptics && window.Android?.haptic) window.Android.haptic();
  }
  function stars(n) { return `<span class="stars" aria-label="${n}/3">${[1, 2, 3].map(i => icon('star', i <= n ? 'on' : '')).join('')}</span>`; }
  function nav() {
    return `<nav class="navbar" aria-label="Navigation">${[['home', 'city'], ['levels', 'levels'], ['daily', 'sun']].map(([id, glyph]) => `<button class="nav-item ${page === id || page === 'city' && id === 'home' ? 'active' : ''}" data-nav="${id}" ${page === id ? 'aria-current="page"' : ''}>${icon(glyph)}${t(id)}</button>`).join('')}</nav>`;
  }
  function topbar() {
    return `<header class="topbar"><div class="brand">${icon('city', 'logo')} LUMEN CITY</div><div class="top-actions"><span class="pill" title="${t('sparks')}">${icon('bolt')} ${E.energy(progress)}</span><button class="icon-btn" data-action="settings" aria-label="${t('settings')}">${icon('settings')}</button></div></header>`;
  }
  function home() {
    const count = Object.keys(progress.completed).length, current = E.unlocked(progress);
    const active = progress.active?.mode === 'campaign';
    return `${topbar()}<section class="hero-head"><div class="eyebrow">${t('eyebrow')}</div><h1>${t('title')}</h1><p class="intro">${count === 40 ? t('allDoneSub') : t('intro')}</p></section>
      <div class="hero-art">${window.cityScene(progress.buildings, count)}</div>
      <button class="city-caption" style="width:100%;background:none;padding:0;text-align:left" data-nav="city"><h2>${t('harbor')} ${icon('arrow', 'inline-arrow')}</h2><span class="micro">${progress.buildings.length}/5 ${t('restored')}</span></button>
      <div class="progress-line"><span style="width:${count / 40 * 100}%"></span></div>
      <button class="primary" ${count === 40 && !active ? 'data-nav="levels"' : `data-level="${active ? progress.active.id : current}"`}><span><small>${t('level').toUpperCase()} ${String(active ? progress.active.id : current).padStart(2, '0')} / 40</small>${count === 40 && !active ? t('replay') : t(active ? 'continue' : 'play')}</span>${icon('arrow')}</button>
      <button class="daily-card" data-nav="daily"><span class="daily-symbol">${icon('sun')}</span><span><strong>${t('daily')}</strong><span class="micro">${t('dailySub')}</span></span><span class="end">${icon('arrow')}</span></button>${nav()}`;
  }
  function levels() {
    const current = E.unlocked(progress);
    return `${topbar()}<div class="section-head"><div><span class="eyebrow">40 ${t('solved')}</span><h1>${t('levelsTitle')}</h1><p>${t('levelsIntro')}</p></div><span class="pill">${icon('star')}${Object.values(progress.completed).reduce((a, b) => a + b.stars, 0)}/120</span></div>
      ${[0, 1, 2, 3, 4].map(chapter => `<section class="chapter"><div class="chapter-head"><span class="chapter-num">0${chapter + 1}</span><h2>${t('chapters')[chapter]}</h2><span class="micro">${chapter * 8 + 1}–${chapter * 8 + 8}</span></div><div class="levels-grid">${Array.from({ length: 8 }, (_, i) => {
        const id = chapter * 8 + i + 1, score = progress.completed[id], locked = id > current;
        return `<button class="level ${locked ? 'locked' : score ? 'done' : 'current'}" data-level="${id}" ${locked ? 'disabled' : ''} aria-label="${t('level')} ${id}${score ? ', ' + score.stars + '/3' : ''}"><span class="number">${String(id).padStart(2, '0')}</span>${locked ? icon('lock') : stars(score?.stars || 0)}</button>`;
      }).join('')}</div></section>`).join('')}${nav()}`;
  }
  function city() {
    const count = Object.keys(progress.completed).length, next = E.BUILDINGS.find(b => !progress.buildings.includes(b.id));
    return `${topbar()}<div class="section-head"><div><span class="eyebrow">${t('harbor')}</span><h1>${t(count === 40 && progress.buildings.length === 5 ? 'allDone' : 'cityTitle')}</h1></div></div>
      <div class="hero-art">${window.cityScene(progress.buildings, count, true)}</div>
      <div class="district-stats"><div class="stat"><strong>${count}/40</strong><span>${t('solved')}</span></div><div class="stat"><strong>${progress.buildings.length}/5</strong><span>${t('buildings')}</span></div><div class="stat"><strong>${E.energy(progress)}</strong><span>${t('sparks')}</span></div></div>
      <div class="building-list">${E.BUILDINGS.map((b, i) => {
        const done = progress.buildings.includes(b.id), available = next?.id === b.id && E.energy(progress) >= b.cost;
        return `<article class="building-card ${done ? 'restored' : ''}"><div class="building-icon">${icon(['home', 'leaf', 'train', 'moon', 'tower'][i])}</div><div><h3>${t('names')[i]}</h3><p class="description">${t('descriptions')[i]}</p></div><div class="building-action">${done ? `<span class="status-check">${icon('check')}</span>` : available ? `<button class="small-primary" data-build="${b.id}">${t('build')}<br>ϟ ${b.cost}</button>` : `<span class="micro">${t('need')}<br>ϟ ${b.cost}</span>`}</div></article>`;
      }).join('')}</div><p class="story-note">${t('cityNote')}</p>${nav()}`;
  }
  function daily() {
    const date = today(), record = progress.daily[date];
    return `${topbar()}<section class="daily-intro"><div class="daily-symbol">${icon('sun')}</div><div class="daily-date">${date}</div><h1>${t('dailyTitle')}</h1><p>${t('dailyText')}</p>
      ${record ? `<div class="stat"><strong>${record.moves}</strong><span>${t('dailyRecord')} · ${t('moves').toLowerCase()}</span>${stars(record.stars)}</div>` : ''}
      <div class="daily-rules">${['sun', 'clock', 'share'].map((glyph, i) => `<div class="daily-rule">${icon(glyph)}${t('dailyRule' + (i + 1))}</div>`).join('')}</div>
      <button class="primary center" data-action="start-daily">${t(record ? 'dailyAgain' : 'dailyPlay')}${icon('arrow')}</button><p class="support-note">${t('dailyNote')}</p></section>${nav()}`;
  }
  function tileSvg(mask, index, powered) {
    let wires = '';
    for (const [bit, x, y] of [[1, 32, 0], [2, 64, 32], [4, 32, 64], [8, 0, 32]]) if (mask & bit) wires += `<path class="wire" d="M32 32L${x} ${y}"/>`;
    if (index === game.level.source) wires += '<circle cx="32" cy="32" r="15" fill="#ead09a"/><path d="m34 20-12 15h9l-1 10 12-15h-9z" fill="#29434c"/>';
    else if (game.level.homes.includes(index)) wires += '<path class="home" d="m20 29 12-10 12 10v15H20Z"/><path d="M29 33h6v8h-6z" fill="currentColor"/>';
    else wires += '<circle cx="32" cy="32" r="4" fill="currentColor"/>';
    if (game.level.locked[index] && index !== game.level.source) wires += '<rect class="lock-mark" x="48" y="48" width="9" height="8" rx="2"/><path d="M50 48v-3a2.5 2.5 0 0 1 5 0v3" fill="none" stroke="#a1b6b8" stroke-width="1.7"/>';
    return `<svg viewBox="0 0 64 64" aria-hidden="true">${wires}</svg>`;
  }
  function gameView() {
    const level = game.level, chapter = Math.floor((Number(level.id) - 1) / 8);
    const dailyMode = level.mode === 'daily';
    return `<header class="game-header"><button class="icon-btn" data-action="leave-game" aria-label="${t('toCity')}">${icon('back')}</button><div class="game-title"><div class="eyebrow">${dailyMode ? t('daily') : t('chapters')[chapter]}</div><h1>${dailyMode ? level.id : t('level') + ' ' + String(level.id).padStart(2, '0')}</h1></div><button class="icon-btn" data-action="help" aria-label="${t('help')}">${icon('help')}</button><button class="icon-btn" data-action="settings" aria-label="${t('settings')}">${icon('settings')}</button></header>
      <div class="game-info"><div class="info-box power"><span class="label">${icon('home')}${t('homes')}</span><strong id="home-count"></strong></div><div class="info-box"><span class="label">${icon('reset')}${t('moves')}</span><strong id="move-count">${game.moves}</strong></div></div>
      <div class="board-wrap"><div class="board" style="--size:${level.size}" role="group" aria-label="${t('help')}">${game.masks.map((_, i) => `<button class="tile" data-tile="${i}" aria-label="${progress.settings.lang === 'ru' ? 'Участок' : 'Tile'} ${Math.floor(i / level.size) + 1}, ${i % level.size + 1}"></button>`).join('')}</div></div>
      <p class="board-caption">${icon('bolt')}<span id="goal-text">${t('goal')}</span></p>
      <div class="game-tools"><button class="tool" data-action="undo">${icon('undo')}${t('undo')}</button><button class="tool" data-action="reset-level">${icon('reset')}${t('reset')}</button><button class="tool hint" data-action="hint">${icon('hint')}${t('hint')}</button></div>
      <aside class="mentor"><div class="mentor-avatar">M</div><div><strong>${t('mentor')}</strong><p>${t(!dailyMode && level.id === 1 ? 'tip1' : !dailyMode && level.id <= 4 ? 'tip2' : !dailyMode && level.id <= 12 ? 'tipLock' : 'tip')}</p></div></aside><p class="game-foot">${t('noTimer')}</p>`;
  }
  function render() {
    document.documentElement.lang = progress.settings.lang;
    $('#app').innerHTML = ({ home, levels, city, daily, game: gameView })[page]();
    if (page === 'game') updateBoard();
  }
  function navigate(destination) {
    if (page === 'game') saveGame();
    clearTimeout(winTimer); closeModal(); page = destination;
    render(); window.scrollTo(0, 0);
  }
  function startLevel(level, forceNew = false) {
    if (game && page === 'game') saveGame();
    if (level.mode === 'campaign' && level.id > E.unlocked(progress)) return;
    clearTimeout(winTimer);
    const saved = forceNew ? null : E.resume(level, progress.active);
    game = { level, masks: saved?.masks || level.initial.slice(), moves: saved?.moves || 0,
      hints: saved?.hints || 0, history: saved?.history || [], finished: false };
    page = 'game'; closeModal(); saveGame(); render(); window.scrollTo(0, 0);
    track(saved ? 'level_resume' : 'level_start', { mode: level.mode, level: level.id });
    // Recover an interruption between the last rotation and the victory handler.
    if (E.analyze(level, game.masks).solved) complete();
  }
  function updateBoard() {
    if (!game || page !== 'game') return;
    const state = E.analyze(game.level, game.masks);
    $('#home-count').innerHTML = `${state.litHomes}<small> / ${state.totalHomes}</small>`;
    $('#move-count').textContent = game.moves;
    game.masks.forEach((mask, i) => {
      const tile = $(`[data-tile="${i}"]`), powered = state.powered.has(i);
      tile.className = `tile ${powered ? 'powered' : ''} ${game.level.locked[i] ? 'fixed' : ''} ${i === game.level.source ? 'source' : ''}`;
      tile.innerHTML = tileSvg(mask, i, powered);
      tile.setAttribute('aria-disabled', String(game.level.locked[i] || game.finished));
    });
    $('[data-action="undo"]').disabled = !game.history.length || game.finished;
    $('[data-action="hint"]').disabled = game.finished;
  }
  function rotateTile(index) {
    if (!game || game.finished) return;
    if (game.level.locked[index]) { toast(t('fixed')); return; }
    game.history.push({ index, before: game.masks[index] });
    game.masks[index] = E.rotate(game.masks[index]); game.moves++;
    tone(); haptic(); saveGame(); updateBoard();
    if (E.analyze(game.level, game.masks).solved) complete();
  }
  function undo() {
    if (!game || game.finished || !game.history.length) return;
    const last = game.history.pop(); game.masks[last.index] = last.before;
    saveGame(); updateBoard();
  }
  function hint() {
    if (!game || game.finished) return;
    const index = game.masks.findIndex((mask, i) => mask !== game.level.solution[i] && !game.level.locked[i]);
    if (index < 0) { toast(t('noHint')); return; }
    game.history.push({ index, before: game.masks[index] });
    game.moves += E.turnDistance(game.masks[index], game.level.solution[index]);
    game.masks[index] = game.level.solution[index]; game.hints++;
    track('hint_used', { level: game.level.id, mode: game.level.mode });
    saveGame(); updateBoard(); tone(); $(`[data-tile="${index}"]`).classList.add('suggest');
    if (E.analyze(game.level, game.masks).solved) complete(); else toast(t('hintUsed'));
  }
  function complete() {
    if (game.finished) return;
    game.finished = true;
    const result = E.recordWin(progress, game.level, game.moves, game.hints);
    track('level_complete', { mode: game.level.mode, level: game.level.id, moves: game.moves, hints: game.hints, stars: result.stars });
    persist(); updateBoard(); tone(true);
    winTimer = setTimeout(() => showWin(result), 380);
  }
  function modal(content) {
    $('#modal-root').innerHTML = `<div class="modal-overlay"><section class="modal" role="dialog" aria-modal="true" aria-label="Lumen City">${content}</section></div>`;
    $('#modal-root button')?.focus({ preventScroll: true });
  }
  function closeModal() { $('#modal-root').innerHTML = ''; }
  function modalHead(title) { return `<div class="modal-top"><h2>${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="${t('cancel')}">${icon('close')}</button></div>`; }
  function showWin(result) {
    const dailyMode = game.level.mode === 'daily';
    const nextBuilding = E.BUILDINGS.find(b => !progress.buildings.includes(b.id));
    const canBuild = nextBuilding && E.energy(progress) >= nextBuilding.cost;
    modal(`<div class="win"><div class="win-icon">${icon(dailyMode ? 'sun' : 'home')}</div><span class="eyebrow">${dailyMode ? game.level.id : t('harbor')}</span><h2 style="margin-top:9px">${t(dailyMode ? 'dailyWin' : 'lightOn')}</h2><p>${t('winText')}</p>${stars(result.stars)}<div class="win-stats"><div><strong>${game.moves}</strong><small>${t('moves')}</small></div><div><strong>${result.energy ? '+1 ϟ' : '✓'}</strong><small>${t(result.energy ? 'energyEarned' : 'record')}</small></div></div>
      <button class="primary center" ${dailyMode ? 'data-action="share-result"' : canBuild || game.level.id === 40 ? 'data-nav="city"' : 'data-action="next-level"'}>${t(dailyMode ? 'share' : canBuild ? 'build' : game.level.id === 40 ? 'toCity' : 'next')}${icon(dailyMode ? 'share' : 'arrow')}</button>
      <button class="secondary" ${dailyMode ? 'data-nav="daily"' : canBuild && game.level.id < 40 ? 'data-action="next-level"' : 'data-nav="city"'}>${t(dailyMode ? 'daily' : canBuild && game.level.id < 40 ? 'next' : 'toCity')}</button></div>`);
  }
  function showHelp() { modal(`${modalHead(t('help'))}<ol class="help-list">${t('helpItems').map(text => `<li>${text}</li>`).join('')}</ol><button class="primary center" data-action="close-modal">${t('understood')}</button>`); }
  function showSettings() {
    modal(`${modalHead(t('settings'))}${['sound', 'haptics'].map(key => `<div class="setting-row"><span>${t(key)}</span><button class="toggle" role="switch" aria-label="${t(key)}" aria-checked="${progress.settings[key]}" data-setting="${key}"></button></div>`).join('')}<div class="setting-row"><span>${t('language')}</span><button class="language-button" data-action="language">${progress.settings.lang === 'ru' ? 'RU → EN' : 'EN → RU'}</button></div><p class="settings-info">${t('privacy')}</p><button class="secondary" data-action="export">${t('export')}</button><button class="secondary danger" data-action="reset-progress">${t('resetProgress')}</button><p class="micro" style="margin-bottom:0">${t('version')}</p>`);
  }
  async function share(text) {
    if (window.Android?.shareText) { window.Android.shareText(text); return; }
    if (navigator.share) { try { await navigator.share({ text }); return; } catch (_) { return; } }
    try { await navigator.clipboard.writeText(text); toast(t('copied')); }
    catch (_) { modal(`${modalHead(t('shareFallback'))}<p style="white-space:pre-wrap;user-select:text">${esc(text)}</p>`); }
  }
  function shareResult() {
    const text = t('shareText').replace('{date}', game.level.id).replace('{moves}', game.moves).replace('{stars}', E.stars(game.level, game.moves, game.hints));
    share(text);
  }
  function build(id) {
    if (!E.build(progress, id)) return;
    track('landmark_restored', { id }); persist(); tone(true); render();
    const i = E.BUILDINGS.findIndex(b => b.id === id);
    modal(`<div class="win"><div class="win-icon">${icon(['home', 'leaf', 'train', 'moon', 'tower'][i])}</div><span class="eyebrow">${t('harbor')}</span><h2 style="margin-top:10px">${t('names')[i]}</h2><p>${t('stories')[i]}</p><button class="primary center" data-action="close-modal">${t(i === 4 ? 'toCity' : 'understood')}</button></div>`);
  }
  const actions = {
    settings: showSettings, help: showHelp, 'close-modal': closeModal,
    'leave-game': () => navigate('home'), 'start-daily': () => startLevel(E.dailyLevel(today())),
    'next-level': () => startLevel(E.campaignLevel(Math.min(40, Number(game.level.id) + 1))),
    undo, hint, 'share-result': shareResult,
    'reset-level': () => modal(`${modalHead(t('resetLevel'))}<p>${t('resetLevelText')}</p><button class="primary center" data-action="confirm-level-reset">${t('reset')}</button><button class="secondary" data-action="close-modal">${t('cancel')}</button>`),
    'confirm-level-reset': () => { track('level_restart', { level: game.level.id, mode: game.level.mode }); startLevel(game.level, true); },
    language: () => { progress.settings.lang = progress.settings.lang === 'ru' ? 'en' : 'ru'; persist(); render(); showSettings(); },
    export: () => share(JSON.stringify({ app: 'Lumen City', version: '0.1.0', exportedAt: new Date().toISOString(), completed: progress.completed, buildings: progress.buildings, daily: progress.daily, events: progress.events }, null, 2)),
    'reset-progress': () => modal(`${modalHead(t('resetConfirm'))}<p>${t('resetWarning')}</p><button class="primary center" data-action="confirm-reset">${t('resetYes')}</button><button class="secondary" data-action="settings">${t('cancel')}</button>`),
    'confirm-reset': () => { const settings = progress.settings; progress = E.newProgress(); progress.settings = settings; game = null; persist(); navigate('home'); }
  };
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button || button.disabled) return;
    if (button.dataset.nav) navigate(button.dataset.nav);
    else if (button.dataset.level) startLevel(E.campaignLevel(Number(button.dataset.level)));
    else if (button.dataset.tile !== undefined) rotateTile(Number(button.dataset.tile));
    else if (button.dataset.action && actions[button.dataset.action]) actions[button.dataset.action]();
    else if (button.dataset.build) build(button.dataset.build);
    else if (button.dataset.setting) {
      const key = button.dataset.setting; progress.settings[key] = !progress.settings[key]; persist(); showSettings();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') window.lumenBack();
    if (event.key === 'Tab' && $('#modal-root .modal')) {
      const buttons = Array.from($('#modal-root').querySelectorAll('button:not(:disabled)'));
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.lumenBack = function () {
    if ($('#modal-root').children.length) { closeModal(); return true; }
    if (page !== 'home') { navigate('home'); return true; }
    return false;
  };
  window.lumenPause = function () { saveGame(); if (audio?.state === 'running') audio.suspend(); };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.lumenPause();
    else if (page === 'daily') render();
  });
  window.addEventListener('pagehide', saveGame);
  render(); track('session_start');
  if (saveWarning) toast(t(saveWarning));
})();
