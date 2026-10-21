const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (_) { ({ chromium } = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright'))); }
const { start } = require('../scripts/preview.cjs');
const E = require('../app/src/main/assets/engine.js');
const output = path.resolve(__dirname, '../test-results');

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const server = await start(0), url = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
      args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    await page.screenshot({ path: path.join(output, '01-home.png'), fullPage: true });
    assert.equal(await page.locator('.hero-head h1').innerText(), 'Верни городу\nсвет.');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('lumen-city-v1')));
    const finish = async level => {
      const active = (await stored()).active;
      for (let i = 0; i < level.initial.length; i++) {
        const turns = E.turnDistance(active.masks[i], level.solution[i]);
        for (let n = 0; n < turns; n++) await page.locator(`[data-tile="${i}"]`).click();
      }
      await page.locator('.win').waitFor();
    };
    await page.locator('[data-level="1"]').click();
    await page.screenshot({ path: path.join(output, '02-level-one.png'), fullPage: true });
    await finish(E.campaignLevel(1));
    assert.deepEqual((await stored()).completed['1'], { moves: 2, stars: 3 });
    await page.screenshot({ path: path.join(output, '03-first-win.png') });
    // First four levels can be played in sequence and earn the bakery exactly once.
    for (let id = 2; id <= 4; id++) {
      await page.locator('[data-action="next-level"]').click();
      await finish(E.campaignLevel(id));
    }
    await page.locator('.win [data-nav="city"]').click();
    await page.locator('[data-build="bakery"]').click();
    assert.deepEqual((await stored()).buildings, ['bakery']);
    await page.locator('[data-action="close-modal"]').click();
    await page.screenshot({ path: path.join(output, '04-city-restored.png'), fullPage: true });
    // A partially completed level survives a full document reload.
    await page.locator('[data-nav="levels"]').click();
    await page.locator('[data-level="5"]').click();
    const before = await stored(), level5 = E.campaignLevel(5);
    const cell = level5.locked.findIndex(v => !v);
    await page.locator(`[data-tile="${cell}"]`).click();
    const after = (await stored()).active;
    assert.equal(after.moves, before.active.moves + 1);
    await page.reload();
    await page.locator('[data-level="5"]').click();
    assert.deepEqual((await stored()).active.masks, after.masks);
    assert.equal(await page.locator('#move-count').innerText(), String(after.moves));
    await page.locator('[data-action="undo"]').click();
    assert.deepEqual((await stored()).active.masks, before.active.masks);
    await page.locator('[data-action="hint"]').click();
    assert.equal((await stored()).active.hints, 1);
    // Modal keyboard focus, language switching and native Back entry point.
    await page.locator('[data-action="settings"]').click();
    await page.locator('[data-action="language"]').click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.locator('[data-setting="sound"]').click();
    assert.equal((await stored()).settings.sound, false);
    await page.evaluate(() => window.lumenBack());
    assert.equal(await page.locator('.modal').count(), 0);
    await page.evaluate(() => window.lumenBack());
    assert.equal(await page.locator('.hero-head h1').innerText(), 'Bring the city\nback to light.');
    await page.locator('.navbar [data-nav="daily"]').click();
    await page.locator('[data-action="start-daily"]').click();
    const daily = E.dailyLevel((await stored()).active.id);
    await page.screenshot({ path: path.join(output, '05-daily-puzzle.png'), fullPage: true });
    await finish(daily);
    assert.equal(Object.keys((await stored()).completed).length, 4);
    assert.equal(Object.keys((await stored()).daily).length, 1);
    await page.locator('.win [data-nav="daily"]').click();
    // Confirm reset is cancellable; resizing never causes horizontal overflow.
    await page.locator('[data-action="settings"]').click();
    await page.locator('[data-action="reset-progress"]').click();
    await page.locator('[data-action="settings"]').click();
    assert.equal(Object.keys((await stored()).completed).length, 4);
    await page.locator('[data-action="close-modal"]').click();
    for (const [width, height] of [[320, 568], [360, 640], [412, 915], [768, 1024]]) {
      await page.setViewportSize({ width, height });
      for (const name of ['home', 'levels', 'daily']) {
        await page.locator(`.navbar [data-nav="${name}"]`).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `Overflow on ${name} at ${width}`);
      }
    }
    // Board 6x6 on a small screen, reached using a valid sequential saved campaign.
    const late = E.newProgress();
    for (let id = 1; id < 40; id++) E.recordWin(late, E.campaignLevel(id), 50, 0);
    await page.evaluate(p => localStorage.setItem('lumen-city-v1', JSON.stringify(p)), late);
    await page.setViewportSize({ width: 360, height: 800 }); await page.reload();
    await page.locator('[data-level="40"]').click();
    assert.equal(await page.locator('[data-tile]').count(), 36);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.screenshot({ path: path.join(output, '06-level-forty.png'), fullPage: true });
    await finish(E.campaignLevel(40));
    assert.equal(Object.keys((await stored()).completed).length, 40);
    assert.deepEqual(errors, []);
    console.log('UI PASS: first four levels, landmark, resume/undo/hint, language, daily, reset cancellation, four viewports and level 40; no JS errors.');
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
