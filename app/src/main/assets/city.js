/* Original vector city artwork. No downloaded or third-party image assets. */
(function () {
  'use strict';
  function cityScene(built, completed, large = false) {
    const isBuilt = id => built.includes(id);
    const iso = (x, y, z = 0) => [240 + (x - y) * 1.05, 95 + (x + y) * 0.52 - z];
    const points = coords => coords.map(p => iso(...p).join(',')).join(' ');
    const poly = (coords, fill, stroke = 'none') => `<polygon points="${points(coords)}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
    let svg = `<svg class="city-art ${large ? 'large' : ''}" viewBox="0 0 480 355" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lumen City ${built.length}/5">
      <defs><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#182f3e"/><stop offset="1" stop-color="#101d2a"/></linearGradient>
      <radialGradient id="halo"><stop stop-color="#f5ce7c" stop-opacity=".28"/><stop offset="1" stop-color="#f5ce7c" stop-opacity="0"/></radialGradient>
      <linearGradient id="beam"><stop stop-color="#f8d48b" stop-opacity=".3"/><stop offset="1" stop-color="#f8d48b" stop-opacity="0"/></linearGradient></defs>
      <ellipse cx="240" cy="263" rx="228" ry="78" fill="url(#sea)"/>
      <g stroke="#69a7af" stroke-opacity=".15" stroke-linecap="round"><path d="M23 240h31m-3 28h34m-61 8h18m45 27h33m196-4h35m39-38h48m-71 57h38m-239 5h40m-13-23h27m185-25h22"/></g>
      <circle cx="397" cy="47" r="14" fill="#efd6a0" opacity=".9"/><circle cx="403" cy="42" r="13" fill="#101d2a"/>
      <g fill="#90a5ad" opacity=".5"><circle cx="61" cy="75" r="1.4"/><circle cx="124" cy="34" r="1"/><circle cx="332" cy="30" r="1.4"/><circle cx="427" cy="113" r="1"/><circle cx="276" cy="14" r="1"/></g>`;
    svg += poly([[0, 0, -12], [190, 0, -12], [190, 180, -12], [0, 180, -12]], '#182d38');
    svg += poly([[0, 180, 0], [190, 180, 0], [190, 180, -12], [0, 180, -12]], '#263b46');
    svg += poly([[190, 0, 0], [190, 180, 0], [190, 180, -12], [190, 0, -12]], '#1d323e');
    svg += poly([[0, 0, 0], [190, 0, 0], [190, 180, 0], [0, 180, 0]], '#30454a', '#57706c');
    // A cross of cobbled streets with painted lane markings.
    svg += poly([[80, 0, 1], [99, 0, 1], [99, 180, 1], [80, 180, 1]], '#1c313b');
    svg += poly([[0, 85, 1], [190, 85, 1], [190, 103, 1], [0, 103, 1]], '#1c313b');
    for (let i = 8; i < 180; i += 18) {
      svg += poly([[89, i, 2], [90, i, 2], [90, i + 7, 2], [89, i + 7, 2]], '#67807b');
      svg += poly([[i, 94, 2], [i + 7, 94, 2], [i + 7, 95, 2], [i, 95, 2]], '#67807b');
    }
    function building(x, y, w, d, h, on, palette, style = '') {
      const c = on ? palette : ['#344750', '#273b46', '#516069'];
      let out = poly([[x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, h], [x, y + d, h]], c[0], '#1d303b');
      out += poly([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h]], c[1], '#1d303b');
      out += poly([[x, y, h], [x + w, y, h], [x + w, y + d, h], [x, y + d, h]], c[2], '#788782');
      if (on) {
        const [gx, gy] = iso(x + w / 2, y + d / 2, 15);
        out += `<ellipse cx="${gx}" cy="${gy}" rx="55" ry="35" fill="url(#halo)"/>`;
      }
      for (let z = 10; z < h - 6; z += 14) {
        for (let a = x + 7; a < x + w - 4; a += 11) out += poly([[a, y + d + .1, z], [a + 5, y + d + .1, z], [a + 5, y + d + .1, z + 7], [a, y + d + .1, z + 7]], on ? '#f5d391' : '#182e3b');
        for (let a = y + 6; a < y + d - 4; a += 11) out += poly([[x + w + .1, a, z], [x + w + .1, a + 5, z], [x + w + .1, a + 5, z + 7], [x + w + .1, a, z + 7]], on ? '#d9b46f' : '#182e3b');
      }
      if (style === 'roof') {
        out += poly([[x - 3, y - 2, h], [x + w / 2, y - 2, h + 14], [x + w / 2, y + d + 3, h + 14], [x - 3, y + d + 3, h]], on ? '#be7766' : '#536068');
        out += poly([[x + w / 2, y - 2, h + 14], [x + w + 3, y - 2, h], [x + w + 3, y + d + 3, h], [x + w / 2, y + d + 3, h + 14]], on ? '#805349' : '#344650');
      }
      return out;
    }
    function tree(x, y, on) {
      const [sx, sy] = iso(x, y, 0);
      return `<path d="M${sx} ${sy}v-15" stroke="#778477" stroke-width="2"/><ellipse cx="${sx}" cy="${sy - 19}" rx="8" ry="13" fill="${on ? '#6b9d88' : '#314e50'}"/><ellipse cx="${sx - 2}" cy="${sy - 22}" rx="5" ry="8" fill="${on ? '#89b59a' : '#40605e'}"/>`;
    }
    svg += building(13, 12, 27, 30, 38, completed >= 2, ['#a3ac9a', '#788d83', '#bdc3ae'], 'roof');
    svg += building(48, 16, 23, 25, 50, completed >= 8, ['#7b999c', '#527783', '#a5b7b1']);
    svg += building(115, 13, 35, 32, 47, isBuilt('observatory'), ['#aaa993', '#7b8b7e', '#c6c0a1']);
    const [ox, oy] = iso(132, 29, 47);
    svg += `<path d="M${ox - 17} ${oy}a17 18 0 0 1 34 0z" fill="${isBuilt('observatory') ? '#79aaa6' : '#46606b'}" stroke="#8ba5a4"/><path d="M${ox} ${oy - 18}v18" stroke="#adbfaf" opacity=".5"/>`;
    svg += building(153, 55, 23, 22, 27, completed >= 25, ['#ccad7e', '#9d845f', '#dad0af'], 'roof');
    svg += building(12, 53, 50, 24, 29, isBuilt('bakery'), ['#c3a389', '#947363', '#e4c2a0'], 'roof');
    if (isBuilt('bakery')) {
      const [sx, sy] = iso(30, 79, 13);
      svg += `<path d="M${sx - 15} ${sy - 5}l26 13v7l-26-13z" fill="#80b6ac"/><text x="${sx - 1}" y="${sy + 3}" font-size="4" fill="#18313c" transform="rotate(26 ${sx} ${sy})">BAKERY</text>`;
    }
    // The park grows once restored.
    svg += poly([[14, 114, 1], [73, 114, 1], [73, 167, 1], [14, 167, 1]], isBuilt('garden') ? '#507166' : '#374e4c');
    for (const [x, y] of [[20, 118], [60, 122], [25, 150], [58, 158]]) svg += tree(x, y, isBuilt('garden'));
    const [fx, fy] = iso(44, 140, 2);
    svg += `<ellipse cx="${fx}" cy="${fy}" rx="17" ry="9" fill="#92a8a0"/><ellipse cx="${fx}" cy="${fy - 2}" rx="13" ry="6" fill="${isBuilt('garden') ? '#82b9bc' : '#314954'}"/>`;
    if (isBuilt('garden')) svg += `<path d="M${fx} ${fy - 1}v-13m0 5q-8-9-10 1m10-1q8-9 10 1" fill="none" stroke="#bbdcd0" stroke-width="1.5"/>`;
    svg += building(112, 113, 45, 24, 25, isBuilt('station'), ['#aa9c88', '#817360', '#c9b89d']);
    const [tx, ty] = iso(130, 142, 4);
    svg += `<path d="M${tx - 21} ${ty - 10}l50 25m-53-21l50 25" stroke="#748788" stroke-width="1.5"/>`;
    if (isBuilt('station')) svg += building(118, 146, 26, 11, 14, true, ['#8ac4b7', '#4e938f', '#d8ddc6']);
    // Pier and the final lighthouse.
    svg += poly([[178, 127, 0], [218, 127, 0], [218, 153, 0], [178, 153, 0]], '#6b6457');
    svg += building(191, 131, 16, 16, 57, isBuilt('lighthouse'), ['#d7c9a2', '#a39372', '#e8d8ae']);
    svg += building(189, 129, 20, 20, 5, isBuilt('lighthouse'), ['#848b77', '#63756d', '#a3ae93']);
    const [lx, ly] = iso(199, 139, 60);
    svg += `<path d="M${lx - 12} ${ly}l12-8 12 8-12 7z" fill="#728e89"/><path d="M${lx - 7} ${ly}v-10l7-4 7 4v10l-7 4z" fill="${isBuilt('lighthouse') ? '#ffe0a1' : '#3a515f'}"/><path d="M${lx - 11} ${ly - 10}l11-8 11 8-11 5z" fill="#b0866d"/>`;
    if (isBuilt('lighthouse')) svg += `<path d="M${lx} ${ly - 9}L480 ${ly - 60}V${ly + 20}z" fill="url(#beam)"/><circle cx="${lx}" cy="${ly - 9}" r="40" fill="url(#halo)"/>`;
    for (const [x, y] of [[77, 48], [105, 80], [79, 112], [173, 106]]) {
      const [sx, sy] = iso(x, y, 0), on = completed >= (x % 11);
      svg += `<path d="M${sx} ${sy}v-19h5" fill="none" stroke="#91a49b" stroke-width="1.5"/><circle cx="${sx + 5}" cy="${sy - 19}" r="2" fill="${on ? '#f2d28f' : '#6d817e'}"/>`;
      if (on) svg += `<circle cx="${sx + 5}" cy="${sy - 19}" r="16" fill="url(#halo)"/>`;
    }
    svg += `<path d="M53 264l25 12 17-9-26-12z" fill="#75958e"/><path d="M74 267v-23l15 23z" fill="#c3b79a"/><path d="M74 246l-10 16h10z" fill="#8ba5a0"/>
      <g opacity=".4" stroke="#9eb2ac"><path d="M164 335h38m22 0h11m45-7h47"/></g></svg>`;
    return svg;
  }
  window.cityScene = cityScene;
})();
