/* Scene pack ceritaf: story scenes for MODE CERITA ("motion": {"mode": "cerita"}). Layout prefix cf_.
   Every cf_ scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front)
   plus shared extras handled by base():
     rain {at|cue, out|outCue}        rain + dark sky over the scene           grey {at|cue, out|outCue}   world loses its colour
     load {on, r0, r1, label, tags:[{text, cue}], shrink:{cue}}   a boulder of burdens balanced on a toon's head, grows with every tag
     list {at|cue, outCue, tag, y, w, items:[{text, icon, glyph, cue, done, mark}]}   cream memo card, rows pop in, ticks, circled rows
     ring {on, at|cue, dur}           phone ring waves next to a toon         confetti {at|cue}            paper confetti
     props[].drop: true               the prop falls from the sky and bounces
   Set pieces:
     cf_adegan   generic story shot with the extras above
     cf_map      giant standing folder: files cram in and bulge it, burst out, or fly into an ARSIP box; big red delete button with a glass cover (f.map)
     cf_split    split screen, two worlds side by side (own env, toons, camera, rain), header tag + result stamp per side (f.sides)
     cf_mundur   VHS rewind flashback: present shot, rewind glitch, then memory moments with their own env/toons + tape label (f.moments)
     cf_teropong binocular view: dark mask with two lenses scanning flags on hills, locks on one, opens to reveal the toon (f.bino, f.targets)
     cf_gunting  budget garland: price tags on a rope, giant scissors snip them (drop) or trim them (shrink + HEMAT), marker circles (f.rope, f.tags)
     cf_beban    the load scene: toon under a growing boulder, ground cracks, heavy dust (uses f.load)
     cf_pintu    facade with doors that swing open, warm light pours out, a helper waves from inside (f.wall, f.doors)
   Camera keys may use on:"<spot>" for set pieces (folder, box, button, t0/t1/t2 targets, door0/door1, load). */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, G, TAU, CS } = TT;
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const T = (s, cue, fr, i) => cueT(s, cue, fr, i);
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr, i) : (o.T ?? 1e9)));
  const outOf = (s, o, i) => o == null ? 1e9 : (o.outCue ? cueT(s, o.outCue, .9, i) : (o.out ?? 1e9));
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.stroke(); };
  const ico = (ctx, name, cx, cy, size, col, lw) => icon(ctx, name, cx - size / 2, cy - size / 2, size, col, lw || 2.4);
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 18)) return size; size -= 2; } }
  function wrap(ctx, txt, maxW){ const ws = String(txt).split(" "), L = []; let cur = "";
    ws.forEach(w => { const n = cur ? cur + " " + w : w; if (ctx.measureText(n).width > maxW && cur){ L.push(cur); cur = w; } else cur = n; }); if (cur) L.push(cur); return L; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : "#F6D36B"); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampTxt(ctx, txt, x, y, k, col, size, rot, maxW){ if (k < 0) return; const q = clamp(k / .32, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.1); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); if (maxW) size = fit(ctx, txt, maxW - size * .9, size, 900, 26); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function lerpCol(a, b, q){ const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), m = (s2) => Math.round(lerp(pa >> s2 & 255, pb >> s2 & 255, q)); return `rgb(${m(16)},${m(8)},${m(0)})`; }
  // small drawn glyphs for things the icon set lacks
  function glyph(ctx, name, x, y, s, col){
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 9;
    if (name === "cup"){ ctx.beginPath(); ctx.moveTo(-34, -20); ctx.lineTo(30, -20); ctx.lineTo(22, 34); ctx.lineTo(-26, 34); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(36, 4, 14, -1.3, 1.3); ctx.stroke();
      [-14, 4].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx, -34); ctx.quadraticCurveTo(dx - 8, -44, dx, -54); ctx.stroke(); }); }
    else if (name === "bowl"){ ctx.beginPath(); ctx.moveTo(-44, -2); ctx.lineTo(44, -2); ctx.quadraticCurveTo(40, 36, 0, 36); ctx.quadraticCurveTo(-40, 36, -44, -2); ctx.stroke(); ctx.beginPath(); ctx.arc(-12, -12, 12, Math.PI, 0); ctx.arc(10, -14, 14, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(20, -40); ctx.lineTo(44, -14); ctx.stroke(); }
    else if (name === "music"){ ctx.beginPath(); ctx.moveTo(-10, 24); ctx.lineTo(-10, -36); ctx.lineTo(30, -46); ctx.lineTo(30, 14); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-22, 26, 14, 10, -.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(18, 16, 14, 10, -.3, 0, TAU); ctx.fill(); }
    else if (name === "home"){ ctx.beginPath(); ctx.moveTo(-42, -2); ctx.lineTo(0, -40); ctx.lineTo(42, -2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-30, -10); ctx.lineTo(-30, 36); ctx.lineTo(30, 36); ctx.lineTo(30, -10); ctx.stroke(); ctx.strokeRect(-10, 12, 20, 24); }
    else if (name === "sun"){ ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.stroke(); for (let k = 0; k < 8; k++){ const a = k * TAU / 8; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 32, Math.sin(a) * 32); ctx.lineTo(Math.cos(a) * 44, Math.sin(a) * 44); ctx.stroke(); } }
    else if (name === "q"){ font(ctx, 900, 92, FAM); ctx.textAlign = "center"; ctx.fillText("?", 0, 32); ctx.textAlign = "left"; }
    else if (name === "x"){ ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-26, -26); ctx.lineTo(26, 26); ctx.moveTo(26, -26); ctx.lineTo(-26, 26); ctx.stroke(); }
    else if (name === "arrow"){ ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(30, 0); ctx.moveTo(10, -22); ctx.lineTo(32, 0); ctx.lineTo(10, 22); ctx.stroke(); }
    else if (name === "folder"){ ctx.beginPath(); ctx.moveTo(-44, 32); ctx.lineTo(-44, -30); ctx.lineTo(-12, -30); ctx.lineTo(-2, -18); ctx.lineTo(44, -18); ctx.lineTo(44, 32); ctx.closePath(); ctx.stroke(); }
    else if (name === "box"){ ctx.strokeRect(-38, -16, 76, 50); ctx.beginPath(); ctx.moveTo(-44, -16); ctx.lineTo(-30, -38); ctx.lineTo(30, -38); ctx.lineTo(44, -16); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-14, 2); ctx.lineTo(14, 2); ctx.stroke(); }
    else icon(ctx, name, -40, -40, 80, col, 2.6);
    ctx.restore(); }
  const drawG = (ctx, it, x, y, s, col) => { if (it.glyph) glyph(ctx, it.glyph, x, y, s, col); else if (it.icon) ico(ctx, it.icon, x, y, s * .8, col, 2.6); };

  /* ---------------- shared extras ---------------- */
  function loadDraw(ctx, s, t, L, st, idx){
    const tags = (L.tags || []).map((g, j) => Object.assign({}, g, { T: tOf(s, g, .15 + j * .2, idx) }));
    const nOn = tags.reduce((a, g) => a + clamp((t - g.T) / .5, 0, 1), 0), r0 = L.r0 ?? 120, r1 = L.r1 ?? 250;
    let R = tags.length ? lerp(r0, r1, nOn / tags.length) : (L.r ?? r1);
    if (L.grow){ const gk = t - tOf(s, L.grow, .5, idx); if (gk > 0) R = lerp(R, L.grow.r ?? R * 1.3, eBack(clamp(gk / .8, 0, 1))); }
    if (L.appear){ const ak = t - tOf(s, L.appear, .2, idx); R *= ak <= 0 ? 0 : eBack(clamp(ak / .5, 0, 1)); }
    const tS = L.shrink ? tOf(s, L.shrink, .5, idx) : 1e9, sk = t - tS; if (sk > 0) R *= Math.max(0, 1 - eOut(clamp(sk / .9, 0, 1)));
    const u = st.size / 92, hp = toonHead(st), bob = st.moving ? Math.abs(Math.sin(st.moveT * 9)) * 8 : 0;
    const cx = hp[0] + Math.sin(t * 2.3) * 6 * (R / 250), cy = st.y - 88 * u - R * .84 + bob + (sk > 0 ? 0 : Math.sin(t * 3.1) * 3);
    if (R > 4){
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.sin(t * 1.7) * .05);
      ctx.beginPath(); for (let k = 0; k <= 14; k++){ const a = k / 14 * TAU, rr2 = R * (1 + .07 * Math.sin(k * 2.3 + 1) + .04 * Math.cos(k * 3.7)); k ? ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2 * .9) : ctx.moveTo(Math.cos(a) * rr2, Math.sin(a) * rr2 * .9); } ctx.closePath();
      ctx.fillStyle = L.color || "#8A8F98"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.ellipse(-R * .35, -R * .4, R * .5, R * .32, -.4, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(20,20,30,.18)"; ctx.beginPath(); ctx.ellipse(R * .3, R * .45, R * .8, R * .4, 0, 0, TAU); ctx.fill(); ctx.restore(); ol(ctx, 8);
      ctx.strokeStyle = "rgba(43,26,18,.45)"; ctx.lineWidth = 4; [[-.4, .1, .3], [.3, -.2, .25], [.1, .5, .2]].forEach(([a, b, l]) => { ctx.beginPath(); ctx.moveTo(R * a, R * b); ctx.lineTo(R * (a + l), R * (b + l * .4)); ctx.lineTo(R * (a + l * 1.3), R * (b - l * .2)); ctx.stroke(); });
      if (L.label){ const sz = fit(ctx, L.label, R * 1.5, Math.min(70, R * .42), 900, 20); ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = sz * .22; ctx.strokeText(L.label, 0, sz * .2); ctx.fillStyle = CREAM; ctx.fillText(L.label, 0, sz * .2); ctx.textAlign = "left"; }
      // stuck-on tags
      tags.forEach((g, j) => { const k = t - g.T; if (k < 0) return; const q = eBack(clamp(k / .4, 0, 1)), a = -2.5 + j * 1.55, px = Math.cos(a) * R * .78, py = Math.sin(a) * R * .62 + (j % 2 ? R * .2 : 0);
        ctx.save(); ctx.translate(px, py); ctx.rotate((j % 2 ? .12 : -.1)); ctx.scale(q, q); const sz = 34; font(ctx, 800, sz, FAM); const w = ctx.measureText(g.text).width + 44;
        rr(ctx, -w / 2, -30, w, 60, 12); ctx.fillStyle = j % 2 ? "#F6D36B" : PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(g.text, 0, 12); ctx.textAlign = "left"; ctx.restore();
        if (k < .5){ ctx.save(); ctx.globalAlpha = 1 - k / .5; ctx.strokeStyle = OUT; ctx.lineWidth = 5; for (let m = 0; m < 3; m++){ const aa = a + (m - 1) * .4; ctx.beginPath(); ctx.moveTo(px + Math.cos(aa) * 60, py + Math.sin(aa) * 60); ctx.lineTo(px + Math.cos(aa) * (90 + k * 60), py + Math.sin(aa) * (90 + k * 60)); ctx.stroke(); } ctx.restore(); } });
      ctx.restore();
      // weight lines + sweat drops
      if (R > 150 && sk < 0){ ctx.strokeStyle = hexA(OUT, .55); ctx.lineWidth = 6; ctx.lineCap = "round"; [-1, 1].forEach(d => { for (let m = 0; m < 2; m++){ const yy = cy + R * .5 + m * 40 + ((t * 120) % 40); ctx.beginPath(); ctx.moveTo(cx + d * (R * .95 + 20), yy); ctx.lineTo(cx + d * (R * .95 + 20), yy + 34); ctx.stroke(); } }); }
    }
    if (sk > 0) burstFx(ctx, cx, cy, sk - .2, HL, 12, 220);
    // ground cracks under the feet
    if (R > 170 && sk < .3){ const a = clamp((R - 170) / 80, 0, 1) * (sk > 0 ? 1 - sk / .3 : 1); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineCap = "round";
      [[-1, .3], [1, -.2], [-1, -.5], [1, .6]].forEach(([d, b], k) => { ctx.beginPath(); let x = st.x + d * 40, y = st.y + 6; ctx.moveTo(x, y); for (let m = 1; m < 4; m++){ x += d * (40 + rnd(k * 5 + m) * 30); y += (rnd(k * 7 + m) - .5) * 26 + b * 6; ctx.lineTo(x, y); } ctx.stroke(); }); ctx.restore();
      for (let i = 0; i < 6; i++){ const q = ((t * .8 + i / 6) % 1); ctx.fillStyle = hexA("#CDBBA6", .55 * (1 - q)); ctx.beginPath(); ctx.arc(st.x + (i % 2 ? 1 : -1) * (60 + q * 120), st.y - q * 50, 14 + q * 20, 0, TAU); ctx.fill(); } }
    return [cx, cy, R];
  }
  function rainFx(ctx, t, k, out){
    const a = clamp(k / .5, 0, 1) * (1 - clamp(out / .5, 0, 1)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "rgba(26,36,58,.38)"; ctx.fillRect(0, 0, 1080, 1920);
    ctx.strokeStyle = "rgba(210,228,245,.75)"; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < 150; i++){ const sp = 1500 + rnd(i) * 700, x0 = rnd(i + 11) * 1400 - 160, y = ((t * sp + rnd(i + 3) * 2200) % 2200) - 140, x = x0 - (y * .18);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 70); ctx.stroke(); }
    for (let i = 0; i < 14; i++){ const q = ((t * 1.6 + rnd(i + 50)) % 1), x = rnd(i + 70) * 1080, y = 1560 + rnd(i + 90) * 260; ctx.strokeStyle = `rgba(220,235,250,${.6 * (1 - q)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, 10 + q * 46, 4 + q * 12, 0, 0, TAU); ctx.stroke(); }
    if (Math.sin(t * 1.3) > .985){ ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(0, 0, 1080, 1920); }
    ctx.restore(); }
  function greyFx(ctx, q){ if (q <= 0) return; ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = `rgba(128,128,128,${clamp(q, 0, 1)})`; ctx.fillRect(0, 0, 1080, 1920);
    ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = `rgba(40,40,46,${.18 * q})`; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
  function confettiFx(ctx, t, k){ if (k < 0 || k > 3.2) return; ctx.save(); ctx.globalAlpha = 1 - clamp((k - 2.6) / .6, 0, 1);
    const C = [HL, "#F6D36B", "#FFFFFF", "#3E9B5A", "#E8604C", ORANGE];
    for (let i = 0; i < 70; i++){ const x = rnd(i) * 1080 + Math.sin(k * 3 + i) * 40, y = -60 + (k * (500 + rnd(i + 7) * 500)) - rnd(i + 3) * 500; if (y < -40 || y > 1960) continue;
      ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i) * 4) + i); ctx.scale(1, Math.abs(Math.sin(k * 6 + i)) + .2); ctx.fillStyle = C[i % C.length]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); }
    ctx.restore(); }
  function ringFx(ctx, x, y, k, face){ if (k < 0) return; ctx.save(); ctx.strokeStyle = HL; ctx.lineCap = "round";
    for (let r = 0; r < 3; r++){ const q = ((k * 1.4 + r / 3) % 1); ctx.globalAlpha = 1 - q; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x, y, 50 + q * 110, face > 0 ? -.7 : Math.PI - .7, face > 0 ? .7 : Math.PI + .7); ctx.stroke(); }
    ctx.restore(); }
  // cream memo card (screen space, after grading)
  function listCard(ctx, s, t, L, idx){
    const T0 = tOf(s, L.at != null || L.cue ? L : { at: .3 }, .1, idx), Tout = outOf(s, L, idx); if (t < T0 || t > Tout + .4) return;
    CS.ov.push(() => {
      const its = L.items || [], w = L.w || 820, x0 = 540 - w / 2, y0 = L.y ?? 250, rh = L.rowH || 104, hasTag = !!L.tag, h = (hasTag ? 78 : 26) + its.length * rh + 24;
      const k = t - T0, inQ = eBack(clamp(k / .45, 0, 1)), outQ = clamp((t - Tout) / .35, 0, 1);
      ctx.save(); ctx.globalAlpha *= clamp(k / .12, 0, 1) * (1 - outQ); ctx.translate(540, y0 + h / 2); ctx.rotate(((L.rot ?? -1.2) + (1 - clamp(k / .5, 0, 1)) * -6) * Math.PI / 180); const sc = (.55 + .45 * inQ) * (1 - .2 * outQ); ctx.scale(sc, sc); ctx.translate(-540, -(y0 + h / 2));
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 16; rr(ctx, x0, y0, w, h, 28); ctx.fillStyle = L.style === "navy" ? "#13223D" : CREAM; ctx.fill(); ctx.restore();
      rr(ctx, x0, y0, w, h, 28); ctx.strokeStyle = L.style === "navy" ? "#2E4670" : "#E3C9A6"; ctx.lineWidth = 5; ctx.stroke();
      const ink = L.style === "navy" ? "#FFFFFF" : BROWN;
      if (hasTag){ font(ctx, 800, 30, FAM); spacing(ctx, 2); const TT2 = L.tag.toUpperCase(), tw = ctx.measureText(TT2).width + 40; rr(ctx, x0 + 40, y0 + 26, tw, 50, 8); ctx.fillStyle = ORANGE; ctx.fill(); ctx.fillStyle = CREAM; ctx.fillText(TT2, x0 + 60, y0 + 62); spacing(ctx, 0); }
      its.forEach((it, j) => { const ti = tOf(s, it.at != null || it.cue ? it : { at: T0 + .3 + j * .3 }, .2 + j * .2, idx), kk = t - ti; if (kk < 0) return;
        const y = y0 + (hasTag ? 92 : 30) + j * rh, q = eBack(clamp(kk / .35, 0, 1)); ctx.save(); ctx.globalAlpha *= clamp(kk / .15, 0, 1); ctx.translate((1 - q) * 60, 0);
        const cy = y + rh / 2 - 6; ctx.beginPath(); ctx.arc(x0 + 82, cy, 36, 0, TAU); ctx.fillStyle = it.color || ORANGE; ctx.fill(); drawG(ctx, it.glyph || it.icon ? it : { glyph: "q" }, x0 + 82, cy, 46, "#FFFFFF");
        const sz = fit(ctx, it.text, w - 250, L.size || 44, 800, 24); ctx.fillStyle = ink; ctx.fillText(it.text, x0 + 140, cy + sz * .36);
        const dT = it.done === true ? ti + .5 : (it.done ? T(s, it.done, .7, idx) : 1e9), dk = t - dT;
        if (dk >= 0){ const dq = eBack(clamp(dk / .3, 0, 1)); ctx.save(); ctx.translate(x0 + w - 66, cy); ctx.scale(dq, dq); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ico(ctx, "check", 0, 0, 40, "#FFFFFF", 3.4); ctx.restore(); burstFx(ctx, x0 + w - 66, cy, dk, GREEN, 8, 90); }
        if (it.mark){ const mT = it.mark === true ? ti + .4 : T(s, it.mark, .6, idx), mq = clamp((t - mT) / .5, 0, 1); if (mq > 0){ ctx.strokeStyle = hexA(RED, .9); ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(x0 + w / 2 + 10, cy - 2, w * .47, rh * .46, -.02, -Math.PI * .6, -Math.PI * .6 + TAU * 1.03 * eOut(mq)); ctx.stroke(); } }
        if (j < its.length - 1){ ctx.strokeStyle = hexA(ink, .12); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 40, y + rh - 4); ctx.lineTo(x0 + w - 40, y + rh - 4); ctx.stroke(); }
        ctx.restore(); });
      ctx.restore();
    }); }
  function sfxList(s, L, i, add){ if (!L) return; add(tOf(s, L.at != null || L.cue ? L : { at: .3 }, .1, i), "whoosh"); const T0 = tOf(s, L.at != null || L.cue ? L : { at: .3 }, .1, i);
    (L.items || []).forEach((it, j) => { const ti = tOf(s, it.at != null || it.cue ? it : { at: T0 + .3 + j * .3 }, .2 + j * .2, i); add(ti, "pop"); if (it.done) add(it.done === true ? ti + .5 : T(s, it.done, .7, i), "chime"); if (it.mark && it.mark !== true) add(T(s, it.mark, .6, i), "whoosh"); }); }

  /* ---------------- shared base: generic cerita data + hooks ---------------- */
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    const spots = Object.assign({}, H.spots || {});
    let loadPos = null;
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    if (f.load){ const st = sts[f.load.on || 0]; if (st){ const u = st.size / 92; spots.load = [st.x, st.y - 120 * u, .95]; } }
    const c = cam(s, t, f.cam || H.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    if (H.camMod) H.camMod(c);
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q; };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach((p, j) => { const k = propOn(p); if (k < 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1);
      let dy = 0, sx = 1, sy = 1; if (p.drop){ if (k < .45){ dy = -1300 * (1 - (k / .45) * (k / .45)); } else if (k < .75){ const b = (k - .45) / .3; dy = -70 * Math.sin(b * Math.PI); sy = b < .2 ? .8 : 1; sx = b < .2 ? 1.15 : 1; } }
      else { const q = eBack(clamp(k / .35, 0, 1)); sx = sy = q; }
      ctx.translate(p.x ?? 540, (p.y ?? GROUND) + dy); ctx.scale(sx, sy); ctx.rotate(p.rot || 0); if (p.type === "bag") bagDraw(ctx, p, t); else if (p.type === "bowl") bowlDraw(ctx, p, t); else prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      if (f.load && (f.load.on || 0) === j && sts[j]) layer(ctx, c, 1, () => { loadPos = loadDraw(ctx, s, t, f.load, sts[j], idx); });
      if (f.glow && (f.glow.on || 0) === j && sts[j]){ const k = t - tOf(s, f.glow, .5, idx); if (k > 0) layer(ctx, c, 1, () => { const hp = toonHead(sts[j]); glowAt(ctx, hp[0], hp[1] + 80, 520 * eOut(clamp(k / .6, 0, 1)) * (1 + .06 * Math.sin(t * 4)), "#FFC27A", .55); }); }
      toon(ctx, c, a, s, t, { st: sts[j] }); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (f.ring){ const st = sts[f.ring.on || 0], k = t - tOf(s, f.ring, .3, idx), dur = f.ring.dur ?? 2.2; if (st && k > 0 && k < dur){ const hp = toonHead(st), p = c.toScreen(hp[0] + st.face * st.size * .2, hp[1] + st.size * .02); ringFx(ctx, p[0], p[1], k, st.face); } }
    if (f.rain) rainFx(ctx, t, t - tOf(s, f.rain, .2, idx), t - outOf(s, f.rain, idx));
    if (f.grey){ const g0 = tOf(s, f.grey, .2, idx), g1 = outOf(s, f.grey, idx); greyFx(ctx, clamp((t - g0) / .8, 0, 1) * (1 - clamp((t - g1) / .35, 0, 1))); if (t > g1 && t < g1 + .4){ ctx.save(); ctx.globalAlpha = .6 * (1 - (t - g1) / .4); ctx.fillStyle = "#FFF4E6"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } }
    if (H.screen) H.screen(ctx, c, sts);
    if (f.confetti){ const k = t - tOf(s, f.confetti, .6, idx); CS.ov.push(() => confettiFx(ctx, t, k)); }
    if (f.list) (Array.isArray(f.list) ? f.list : [f.list]).forEach(L => listCard(ctx, s, t, L, idx));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    if (H.over) CS.ov.push(() => H.over(ctx, c, sts));
    return { c, sts, loadPos };
  }
  function sfxBase(s, f, i, add){
    const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
    (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
    (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
    (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
    (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i) + (p.drop ? .45 : 0), "pop"); });
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
    if (f.rain) add(tOf(s, f.rain, .2, i), "whoosh");
    if (f.grey){ add(tOf(s, f.grey, .2, i), "whoosh"); if (f.grey.outCue || f.grey.out != null) add(outOf(s, f.grey, i), "chime"); }
    if (f.confetti) add(tOf(s, f.confetti, .6, i), "chime");
    if (f.ring) add(tOf(s, f.ring, .3, i), "ping");
    if (f.load){ (f.load.tags || []).forEach((g, j) => add(tOf(s, g, .15 + j * .2, i), "pop")); if (f.load.shrink) add(tOf(s, f.load.shrink, .5, i), "chime"); }
    if (f.list) (Array.isArray(f.list) ? f.list : [f.list]).forEach(L => sfxList(s, L, i, add));
  }
  function bagDraw(ctx, p, t){ const col = p.color || ORANGE; ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 4, 110, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, -190, 50, Math.PI, 0); ctx.stroke();
    rr(ctx, -95, -190, 190, 190, 14); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .85); ctx.beginPath(); ctx.arc(0, -95, 38, 0, TAU); ctx.fill(); ico(ctx, p.icon || "cart", 0, -95, 44, col, 2.6); }
  function bowlDraw(ctx, p, t){ ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-90, -80); ctx.lineTo(90, -80); ctx.quadraticCurveTo(80, 0, 0, 0); ctx.quadraticCurveTo(-80, 0, -90, -80); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#FFFDF0"; ctx.beginPath(); ctx.ellipse(0, -84, 86, 28, 0, Math.PI, 0); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#F3D9A0"; [[-40, -110], [30, -116], [0, -100]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 30, 16, .2, 0, TAU); ctx.fill(); ol(ctx, 3); });
    for (let k = 0; k < 2; k++){ const q = ((t * .6 + k / 2) % 1); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-20 + k * 40, -130 - q * 60); ctx.quadraticCurveTo(-34 + k * 40, -150 - q * 60, -18 + k * 40, -170 - q * 60); ctx.stroke(); } ctx.globalAlpha = 1; }

  /* ================= cf_adegan ================= */
  TT.scene("cf_adegan", "Cerita: adegan + efek (hujan, abu-abu, beban, memo)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= cf_beban ================= */
  TT.scene("cf_beban", "Cerita: beban batu di kepala", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene;
    base(ctx, s, t, { screen: () => { const L = f.load || {}; const n = (L.tags || []).filter((g, j) => t >= tOf(s, g, .15 + j * .2, idx)).length; const heavy = n / Math.max(1, (L.tags || []).length);
      if (heavy > 0){ ctx.save(); const g = ctx.createRadialGradient(540, 960, 300, 540, 960, 1150); g.addColorStop(0, "rgba(20,14,30,0)"); g.addColorStop(1, `rgba(20,14,30,${.45 * heavy * (.85 + .15 * Math.sin(t * 3))})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } } });
  }, sfxBase);

  /* ================= cf_map: giant folder ================= */
  function paper(ctx, it, w, h, col){
    rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, w, 62); ctx.restore();
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 62); ctx.lineTo(w / 2, -h / 2 + 62); ctx.stroke();
    glyph(ctx, it.glyph || "file", -w / 2 + 36, -h / 2 + 31, 44, "#FFFFFF");
    const sz = fit(ctx, it.text || "", w - 90, 32, 800, 18); ctx.fillStyle = "#FFFFFF"; ctx.fillText(it.text || "", -w / 2 + 66, -h / 2 + 31 + sz * .36);
    ctx.fillStyle = "#E3D6C4"; for (let k = 0; k < 6; k++) ctx.fillRect(-w / 2 + 30, -h / 2 + 96 + k * 34, (w - 60) * (k % 3 === 2 ? .6 : .9), 12);
    if (it.done){ ctx.save(); ctx.translate(w / 2 - 80, h / 2 - 70); ctx.rotate(-.2); rr(ctx, -70, -26, 140, 52, 8); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.stroke(); font(ctx, 900, 26, FAM); ctx.fillStyle = GREEN; ctx.textAlign = "center"; ctx.fillText("SELESAI", 0, 9); ctx.textAlign = "left"; ctx.restore(); }
  }
  const PCOL = ["#2F6F73", ORANGE, "#5E7FA8", "#7A9A5B", "#B5643C", "#8E5AA8"];
  TT.scene("cf_map", "Cerita: folder raksasa + kotak arsip", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, F = Object.assign({ x: 720, w: 500, h: 600, label: "AKTIF", files: [] }, f.map || {});
    const x0 = F.x - F.w / 2, yb = GROUND - F.h, fillAt = F.fillAt ?? .2, gap = F.fillGap ?? .2;
    const files = (F.files || []).map((it, j) => Object.assign({}, it, { T: it.cue || it.at != null ? tOf(s, it, .1, idx) : (F.preset ? -1 : fillAt + j * gap) }));
    const tB = F.burstCue ? T(s, F.burstCue, .7, idx) : (F.burstAt ?? 1e9);
    const B = F.box ? Object.assign({ x: 260, label: "ARSIP" }, F.box) : null, tBox = B ? tOf(s, B, .2, idx) : 1e9, tClose = B && (B.closeCue || B.closeAt != null) ? (B.closeCue ? T(s, B.closeCue, .8, idx) : B.closeAt) : 1e9;
    const tA = F.archiveCue ? T(s, F.archiveCue, .4, idx) : 1e9, gapA = F.archiveGap ?? .3;
    let aj = 0; files.forEach(it => { it.A = it.done ? tA + (aj++) * gapA : 1e9; });
    const nIn = files.filter(it => t >= it.T && !(t >= it.A + .55)).length, nBox = files.filter(it => t >= it.A + .55).length;
    const Bt = F.button ? Object.assign({ x: 620, text: "HAPUS SEMUA", h: 420 }, F.button) : null, tBt = Bt ? tOf(s, Bt, .1, idx) : 1e9, tCov = Bt && Bt.coverCue ? T(s, Bt.coverCue, .7, idx) : 1e9;
    const spots = { folder: [F.x, yb + F.h * .25, 1.35], folderTop: [F.x, yb - 60, 1.6] }; if (B) spots.box = [B.x, GROUND - 260, 1.5]; if (Bt) spots.button = [Bt.x, GROUND - Bt.h - 40, 1.6];
    const showF = !F.hide, nOnFolder = Math.max(0, files.filter(it => t >= it.T && t < it.A).length);
    const bulge = Math.min(70, Math.max(0, nOnFolder - 3) * 9) * (t < tB ? 1 : 0), trem = t < tB && t > tB - .8 ? Math.sin(t * 60) * 6 * (1 - (tB - t) / .8) : 0;
    const fileXY = (it, j) => { const lift = 30 + j * 30, sd = (j % 2 ? 1 : -1) * (14 + (j % 3) * 14); return [F.x + sd, GROUND - 30 - (F.h - 40) / 2 - lift, (j % 2 ? 1 : -1) * (.03 + (j % 3) * .025)]; };
    base(ctx, s, t, { env: "office", spots,
      back: () => {
        // floor pile (already scattered files)
        for (let i = 0; i < (F.pile || 0); i++){ ctx.save(); ctx.translate(F.pileX0 ?? 120 + i * 95, GROUND - 14 - (i % 3) * 8); ctx.rotate((rnd(i) - .5) * 1.2 + Math.PI / 2 * 0); ctx.scale(.42, .42); paper(ctx, { text: "file_" + (i + 1), glyph: "file" }, 300, 200, PCOL[i % PCOL.length]); ctx.restore(); }
        if (B){ const k = t - tBox; if (k >= 0){ const q = eBack(clamp(k / .45, 0, 1)), cl = eOut(clamp((t - tClose) / .4, 0, 1)), jig = files.some(it => t > it.A + .5 && t < it.A + .8) ? Math.sin(t * 50) * 4 : 0;
          ctx.save(); ctx.translate(B.x, GROUND); ctx.scale(q, q * (1 + jig * .01)); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 200, 18, 0, 0, TAU); ctx.fill();
          // back flaps
          ctx.fillStyle = "#B98252"; ctx.beginPath(); ctx.moveTo(-170, -300); ctx.lineTo(-150 + cl * 20, -380 + cl * 80); ctx.lineTo(150 - cl * 20, -380 + cl * 80); ctx.lineTo(170, -300); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = "#5A3A2A"; ctx.fillRect(-160, -306, 320, 20);
          ctx.restore(); } }
        if (Bt){ const k = t - tBt; if (k >= 0){ const q = eBack(clamp(k / .45, 0, 1)); ctx.save(); ctx.translate(Bt.x, GROUND); ctx.scale(q, q);
          ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.ellipse(0, 4, 150, 18, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = "#3B3631"; rr(ctx, -80, -Bt.h + 40, 160, Bt.h - 40, 12); ctx.fill(); ol(ctx, 6);
          ctx.save(); rr(ctx, -80, -Bt.h + 40, 160, Bt.h - 40, 12); ctx.clip(); ctx.fillStyle = "#E8B23A"; for (let m = -6; m < 10; m++){ ctx.beginPath(); ctx.moveTo(-80, -140 + m * 50); ctx.lineTo(80, -200 + m * 50); ctx.lineTo(80, -175 + m * 50); ctx.lineTo(-80, -115 + m * 50); ctx.closePath(); ctx.fill(); } ctx.restore();
          rr(ctx, -120, -Bt.h + 10, 240, 44, 12); ctx.fillStyle = "#2A2623"; ctx.fill(); ol(ctx, 6);
          const press = Bt.pressCue && t > T(s, Bt.pressCue, .5, idx) && t < tCov ? 8 + Math.sin(t * 30) * 3 : 0, blink = t < tCov ? .6 + .4 * Math.abs(Math.sin(t * 5)) : .5;
          if (t < tCov) glowAt(ctx, 0, -Bt.h - 10, 220, "#FF4A3A", .35 * blink);
          ctx.fillStyle = "#8E1F16"; ctx.beginPath(); ctx.ellipse(0, -Bt.h + 12, 92, 24, 0, 0, TAU); ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = lerpCol("#B8281D", "#FF5A45", blink); ctx.beginPath(); ctx.ellipse(0, -Bt.h + 4 + press, 80, 22, 0, 0, Math.PI); ctx.lineTo(-80, -Bt.h - 36 + press); ctx.ellipse(0, -Bt.h - 36 + press, 80, 34, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill(); ol(ctx, 6);
          ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(-24, -Bt.h - 44 + press, 30, 12, -.2, 0, TAU); ctx.fill();
          // label plate
          font(ctx, 900, 30, FAM); const lw = Math.max(200, ctx.measureText(Bt.text).width + 40); ctx.save(); ctx.translate(0, -Bt.h + 150); ctx.rotate(-.04); rr(ctx, -lw / 2, -30, lw, 60, 10); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(Bt.text, 0, 11); ctx.textAlign = "left"; ctx.restore();
          ctx.restore(); } }
      },
      mid: () => {
        if (!showF) return;
        ctx.save(); ctx.translate(trem, 0);
        ctx.fillStyle = "rgba(43,26,18,.28)"; ctx.beginPath(); ctx.ellipse(F.x, GROUND + 6, F.w * .62 + bulge, 26, 0, 0, TAU); ctx.fill();
        // back panel + tab
        ctx.fillStyle = "#D9A44E"; rr(ctx, x0 + 24, yb - 64, 230, 90, [20, 20, 0, 0]); ctx.fill(); ol(ctx, 6); rr(ctx, x0, yb, F.w, F.h, 16); ctx.fill(); ol(ctx, 7);
        font(ctx, 900, 40, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; fit(ctx, F.label, 200, 40, 900, 22); ctx.fillText(F.label, x0 + 139, yb - 14); ctx.textAlign = "left";
        // papers inside
        let j = 0; files.forEach(it => { if (t < it.T || t >= it.A) { if (t >= it.T) j++; return; } const k = t - it.T, [px, py, rot] = fileXY(it, j); j++; if (t >= tB) return;
          const q = clamp(k / .35, 0, 1), dy = (1 - eOut(q)) * -500, sq = q < 1 ? 1 + .1 * Math.sin(q * Math.PI) : 1, jig = t > tB - .8 ? Math.sin(t * 40 + j) * 5 : Math.sin(t * 2 + j) * 2;
          ctx.save(); ctx.translate(px + jig, py + dy); ctx.rotate(rot + (t > tB - .8 ? Math.sin(t * 30 + j) * .03 : 0)); ctx.scale(1 / sq, sq); paper(ctx, it, F.w - 70, F.h - 40, PCOL[j % PCOL.length]); ctx.restore(); });
        // front panel with bulge
        const fy = yb + F.h * .4;
        ctx.beginPath(); ctx.moveTo(x0 - 6, fy); ctx.lineTo(x0 + F.w + 6, fy); ctx.quadraticCurveTo(x0 + F.w + 6 + bulge * 1.3, (fy + GROUND) / 2, x0 + F.w + 6, GROUND); ctx.lineTo(x0 - 6, GROUND); ctx.quadraticCurveTo(x0 - 6 - bulge * 1.3, (fy + GROUND) / 2, x0 - 6, fy); ctx.closePath();
        ctx.fillStyle = "#EDBE63"; ctx.fill(); ol(ctx, 7);
        ctx.fillStyle = "rgba(255,255,255,.22)"; rr(ctx, x0 + 20, fy + 150, F.w - 40, 16, 8); ctx.fill();
        font(ctx, 900, 64, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; fit(ctx, "FOLDER " + F.label, F.w - 60, 54, 900, 26); ctx.fillText("FOLDER " + F.label, F.x, fy + 112); ctx.textAlign = "left";
        // file counter
        const cnt = nIn; ctx.save(); ctx.translate(F.x, fy + 8); const cw = 230; rr(ctx, -cw / 2, -42, cw, 84, 42); ctx.fillStyle = cnt > (F.okMax ?? 8) ? RED : GREEN; ctx.fill(); ol(ctx, 5);
        font(ctx, 900, 44, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(cnt + " file", 0, 15); ctx.textAlign = "left"; ctx.restore();
        if (F.okCue){ const k = t - T(s, F.okCue, .8, idx); if (k >= 0){ glowAt(ctx, F.x, yb + F.h / 2, 420, "#FFE1A0", .4 * clamp(k / .4, 0, 1)); burstFx(ctx, F.x, yb + 40, k, GREEN, 12, 260); } }
        ctx.restore();
        // burst: papers fly out
        if (t >= tB){ const k = t - tB; files.forEach((it, j2) => { if (t < it.T) return; const [px, py, rot] = fileXY(it, j2), vx = (rnd(j2 + 3) - .5) * 1500, vy = -900 - rnd(j2 + 9) * 700, land = GROUND - 30 - (j2 % 4) * 6;
          let x = px + vx * k, y = py + vy * k + 1900 * k * k, r = rot + k * (4 + rnd(j2) * 5) * (j2 % 2 ? 1 : -1); if (y > land){ const tl = (-vy - Math.sqrt(Math.max(0, vy * vy - 4 * 1900 * (py - land)))) / (2 * 1900) || k; x = px + vx * Math.max(0, tl); y = land; r = (j2 % 2 ? 1 : -1) * (1.4 + rnd(j2) * .3); }
          ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(.62, .62); paper(ctx, it, F.w - 70, F.h - 40, PCOL[j2 % PCOL.length]); ctx.restore(); });
          if (k < .6){ ctx.save(); ctx.globalAlpha = 1 - k / .6; for (let i = 0; i < 10; i++){ const a = i / 10 * TAU; ctx.fillStyle = "#E9DCC8"; ctx.beginPath(); ctx.arc(F.x + Math.cos(a) * (100 + k * 500), yb + 200 + Math.sin(a) * (60 + k * 300), 40 + k * 60, 0, TAU); ctx.fill(); } ctx.restore(); }
          burstFx(ctx, F.x, yb + 150, k, HL, 14, 340); }
      },
      midZ: F.midZ ?? -.5,
      front: () => {
        // archive flight: done files arc into the box
        if (B) files.forEach((it, j) => { const k = t - it.A; if (k < 0 || k > .6) return; const q = eOut(clamp(k / .55, 0, 1)), [px, py, rot] = fileXY(it, j), ex = B.x, ey = GROUND - 330;
          const x = lerp(px, ex, q), y = lerp(py, ey, q) - Math.sin(q * Math.PI) * (F.arc ?? 600), sc = lerp(1, .32, q);
          ctx.save(); ctx.translate(x, y); ctx.rotate(rot + q * TAU * (j % 2 ? 1 : -1) * .5); ctx.scale(sc, sc); paper(ctx, it, F.w - 70, F.h - 40, PCOL[j % PCOL.length]); ctx.restore();
          for (let m = 1; m < 4; m++){ const qq = Math.max(0, q - m * .07), xx = lerp(px, ex, qq), yy = lerp(py, ey, qq) - Math.sin(qq * Math.PI) * (F.arc ?? 600); ctx.fillStyle = hexA("#FFF4E6", .5 - m * .12); ctx.beginPath(); ctx.arc(xx, yy, 30 - m * 6, 0, TAU); ctx.fill(); } });
        if (B){ const k = t - tBox; if (k >= 0){ const q = eBack(clamp(k / .45, 0, 1)), cl = eOut(clamp((t - tClose) / .4, 0, 1));
          ctx.save(); ctx.translate(B.x, GROUND); ctx.scale(q, q);
          ctx.fillStyle = "#C99460"; rr(ctx, -180, -300, 360, 300, 10); ctx.fill(); ol(ctx, 7);
          ctx.fillStyle = "#B98252"; ctx.beginPath(); ctx.moveTo(-180, -300); ctx.lineTo(-180 - 70 * (1 - cl), -300 - 90 * (1 - cl) + cl * 0); ctx.lineTo(-40 * cl - 10 * (1 - cl), -300 - 110 * (1 - cl)); ctx.lineTo(0, -300); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          ctx.beginPath(); ctx.moveTo(180, -300); ctx.lineTo(180 + 70 * (1 - cl), -300 - 90 * (1 - cl)); ctx.lineTo(40 * cl + 10 * (1 - cl), -300 - 110 * (1 - cl)); ctx.lineTo(0, -300); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          rr(ctx, -130, -210, 260, 110, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); font(ctx, 900, 54, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; fit(ctx, B.label, 230, 54, 900, 24); ctx.fillText(B.label, 0, -136); ctx.textAlign = "left";
          if (nBox > 0){ ctx.save(); ctx.translate(140, -300); rr(ctx, -70, -36, 140, 72, 36); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); font(ctx, 900, 38, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText("+" + nBox, 0, 13); ctx.textAlign = "left"; ctx.restore(); }
          ctx.restore();
          files.forEach(it => { const kk = t - it.A - .55; if (kk >= 0 && kk < .5){ ctx.save(); ctx.globalAlpha = 1 - kk / .5; for (let m = 0; m < 6; m++){ const a = -Math.PI / 2 + (m - 2.5) * .35; sparkle(ctx, B.x + Math.cos(a) * (60 + kk * 200), GROUND - 330 + Math.sin(a) * (40 + kk * 160), 16, m % 2 ? HL : "#F6D36B"); } ctx.restore(); } });
          if (tClose < 1e9) burstFx(ctx, B.x, GROUND - 320, t - tClose, HL, 12, 240); } }
        if (Bt && t >= tCov){ const k = t - tCov, q = clamp(k / .35, 0, 1), dy = (1 - q * q) * -600, sq = k > .35 && k < .55 ? .9 : 1;
          ctx.save(); ctx.translate(Bt.x, GROUND - Bt.h + 14 + dy); ctx.scale(1 / sq, sq); ctx.beginPath(); ctx.ellipse(0, 0, 116, 30, 0, 0, Math.PI); ctx.lineTo(-116, -120); ctx.ellipse(0, -120, 116, 110, 0, Math.PI, 0); ctx.closePath();
          ctx.fillStyle = "rgba(190,230,245,.35)"; ctx.fill(); ctx.strokeStyle = "#E8F6FB"; ctx.lineWidth = 7; ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(-50, -140, 50, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke(); ctx.restore();
          if (k > .3) burstFx(ctx, Bt.x, GROUND - Bt.h - 60, k - .3, "#9FD3E8", 10, 220); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const F = f.map || {};
    (F.files || []).forEach((it, j) => { if (it.cue || it.at != null) add(tOf(s, it, .1, i), "pop"); else if (!F.preset && j % 2 === 0) add((F.fillAt ?? .2) + j * (F.fillGap ?? .2), "pop"); });
    if (F.burstCue || F.burstAt != null){ const tb = F.burstCue ? T(s, F.burstCue, .7, i) : F.burstAt; add(tb, "whoosh"); add(tb + .05, "ping"); }
    if (F.box){ add(tOf(s, F.box, .2, i), "pop"); if (F.box.closeCue) add(T(s, F.box.closeCue, .8, i), "chime"); }
    if (F.archiveCue){ const tA = T(s, F.archiveCue, .4, i); (F.files || []).filter(it => it.done).forEach((it, j) => { add(tA + j * (F.archiveGap ?? .3), "whoosh"); add(tA + j * (F.archiveGap ?? .3) + .55, "pop"); }); }
    if (F.button){ add(tOf(s, F.button, .1, i), "pop"); if (F.button.pressCue) add(T(s, F.button.pressCue, .5, i), "ping"); if (F.button.coverCue) add(T(s, F.button.coverCue, .7, i) + .35, "pop"); }
    if (F.okCue) add(T(s, F.okCue, .8, i), "chime"); });

  /* ================= cf_split: two worlds side by side ================= */
  TT.scene("cf_split", "Cerita: layar terbelah dua", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, sides = f.sides || [], tilt = 26, inQ = eOut(clamp((t - (f.splitAt ?? 0)) / .5, 0, 1));
    const mx = 540 + (1 - inQ) * 600;
    sides.slice(0, 2).forEach((S, k) => {
      ctx.save(); ctx.beginPath(); if (k === 0){ ctx.moveTo(-10, -10); ctx.lineTo(mx + tilt, -10); ctx.lineTo(mx - tilt, 1930); ctx.lineTo(-10, 1930); } else { ctx.moveTo(mx + tilt, -10); ctx.lineTo(1090, -10); ctx.lineTo(1090, 1930); ctx.lineTo(mx - tilt, 1930); } ctx.closePath(); ctx.clip();
      const sh = (k === 0 ? -1 : 1) * 270, s2 = Object.assign({}, s, { f: Object.assign({ cam: [{ at: 0, x: 540, y: 1000, zoom: .98 }, { at: .3, x: 540, y: 980, zoom: 1.04, dur: 4 }] }, S, { stamp: null, cards: S.cards || [] }) });
      if (k === 1) ctx.translate((1 - inQ) * 400, 0);
      const r = base(ctx, s2, t, { camMod: c => { c.x -= sh / c.zoom; } });
      if (S.rain) rainFx(ctx, t, t - tOf(s, S.rain, .1, idx), -1);
      if (S.sun){ const k2 = t - tOf(s, S.sun, .1, idx); if (k2 > 0){ ctx.save(); ctx.globalAlpha = clamp(k2 / .5, 0, 1); const cx = k === 0 ? 120 : 960; for (let m = 0; m < 10; m++){ const a = m / 10 * TAU + t * .3; ctx.fillStyle = "rgba(255,224,150,.18)"; ctx.beginPath(); ctx.moveTo(cx, 300); ctx.arc(cx, 300, 900, a, a + .14); ctx.closePath(); ctx.fill(); } ctx.restore(); } }
      ctx.restore();
    });
    // divider
    ctx.save(); ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(mx + tilt, -20); ctx.lineTo(mx - tilt, 1940); ctx.stroke(); ctx.strokeStyle = CREAM; ctx.lineWidth = 12; ctx.stroke(); ctx.restore();
    // headers + stamps (screen space, after grade)
    const tHide = Math.min(...(f.cards || []).map((cd, j) => cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? 1e9)), f.list ? tOf(s, f.list, .1, idx) : 1e9), hideA = 1 - clamp((t - tHide + .1) / .3, 0, 1);
    if (hideA > 0) CS.ov.push(() => { ctx.save(); ctx.globalAlpha *= hideA; sides.slice(0, 2).forEach((S, k) => {
      const cx = k === 0 ? 275 : 805, hT = tOf(s, S.head || { at: .25 }, .1, idx), hk = t - hT;
      if (S.tag && hk >= 0){ const q = eBack(clamp(hk / .4, 0, 1)); ctx.save(); ctx.translate(cx, 250); ctx.rotate(k ? .04 : -.04); ctx.scale(q, q); font(ctx, 900, 44, FAM); spacing(ctx, 2); const w = Math.min(440, ctx.measureText(S.tag).width + 60);
        rr(ctx, -w / 2, -36, w, 72, 14); ctx.fillStyle = S.tagColor || (k ? GREEN : ORANGE); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; fit(ctx, S.tag, w - 40, 44, 900, 24); ctx.fillText(S.tag, 0, 15); ctx.textAlign = "left"; spacing(ctx, 0); ctx.restore();
        if (S.label){ const q2 = eBack(clamp((hk - .15) / .4, 0, 1)); if (q2 > 0){ ctx.save(); ctx.translate(cx, 345); ctx.scale(q2, q2); const sz = fit(ctx, S.label, 450, 46, 800, 24); ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1E120B"; ctx.lineWidth = sz * .24; ctx.strokeText(S.label, 0, sz * .35); ctx.fillStyle = "#FFFFFF"; ctx.fillText(S.label, 0, sz * .35); ctx.textAlign = "left"; ctx.restore(); } } }
      (S.stamps || []).forEach((st, j) => { const k2 = t - tOf(s, st, .5, idx); if (k2 < 0) return; stampTxt(ctx, st.text, cx, st.y ?? (470 + j * 130), k2, st.color === "red" ? RED : st.color === "orange" ? ORANGE : GREEN, st.size || 56, (k ? .08 : -.08), 470); burstFx(ctx, cx, st.y ?? (470 + j * 130), k2 - .2, st.color === "red" ? RED : GREEN, 8, 180); });

    }); ctx.restore(); });
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.list) listCard(ctx, s, t, f.list, idx);
  }, (s, f, i, add) => { add(f.splitAt ?? 0, "whoosh"); (f.sides || []).forEach(S => { sfxBase(s, S, i, add); add(tOf(s, S.head || { at: .25 }, .1, i), "pop"); (S.stamps || []).forEach(st => add(tOf(s, st, .5, i), "pop")); if (S.rain) add(tOf(s, S.rain, .1, i), "whoosh"); }); (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop")); sfxList(s, f.list, i, add); });

  /* ================= cf_mundur: VHS rewind flashback ================= */
  TT.scene("cf_mundur", "Cerita: kilas balik putar ulang (VHS)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = (f.moments || []).map((m, j) => Object.assign({}, m, { T: j === 0 ? 0 : tOf(s, m, .3 + j * .2, idx) }));
    let mi = 0; M.forEach((m, j) => { if (t >= m.T) mi = j; }); const m = M[mi] || {};
    const next = M[mi + 1], tw = next ? next.T - t : 9, past = mi >= 1, k = t - m.T;
    const s2 = Object.assign({}, s, { f: Object.assign({}, f, m, { stamp: mi === 0 ? f.stamp : null, cards: m.cards || [] }) });
    const jitter = (tw < .6 ? (1 - tw / .6) : 0) + (past && k < .3 ? 1 - k / .3 : 0);
    ctx.save(); if (jitter > 0) ctx.translate(Math.sin(t * 90) * 24 * jitter, 0);
    base(ctx, s2, t, { screen: () => {
      if (past){ ctx.save(); ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = "rgba(60,130,160,.55)"; ctx.fillRect(0, 0, 1080, 1920); ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = "rgba(20,40,60,.12)"; ctx.fillRect(0, 0, 1080, 1920);
        ctx.fillStyle = "rgba(0,0,0,.10)"; for (let y = 0; y < 1920; y += 8) ctx.fillRect(0, y, 1080, 3);
        const by = ((t * 260) % 2300) - 200; ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.fillRect(0, by, 1080, 90); ctx.restore(); }
    } });
    ctx.restore();
    // rewind glitch overlay (screen space before grade)
    if (jitter > 0){ ctx.save(); for (let i = 0; i < 16; i++){ const y = rnd(i + Math.floor(t * 24)) * 1920, h = 10 + rnd(i + 7 + Math.floor(t * 30)) * 60; ctx.fillStyle = i % 3 ? `rgba(255,255,255,${.25 * jitter})` : `rgba(80,200,255,${.3 * jitter})`; ctx.fillRect(0, y, 1080, h); }
      ctx.fillStyle = `rgba(10,20,40,${.25 * jitter})`; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
    // VHS labels (after grade)
    CS.ov.push(() => {
      const rew = jitter > .05 && tw < .6;
      ctx.save(); font(ctx, 900, 52, FAM); ctx.lineJoin = "round"; ctx.lineWidth = 12; ctx.strokeStyle = "rgba(10,10,20,.8)"; ctx.fillStyle = "#FFFFFF";
      if (rew){ ctx.save(); ctx.translate(540, 560); const sc = 1 + .08 * Math.sin(t * 20); ctx.scale(sc, sc); ctx.globalAlpha = .9; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 10 + 40 * (d > 0 ? 1 : 0) - 40, 0); });
        for (let a = 0; a < 2; a++){ ctx.beginPath(); ctx.moveTo(-10 - a * 110 + 60, -80); ctx.lineTo(-110 - a * 110 + 60, 0); ctx.lineTo(-10 - a * 110 + 60, 80); ctx.closePath(); ctx.strokeStyle = "rgba(10,10,20,.8)"; ctx.lineWidth = 14; ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); } ctx.restore(); }
      if (past || rew){ const txt = rew ? "◀◀ PUTAR ULANG" : "▶ KILAS BALIK"; ctx.strokeText(txt, 80, 240); ctx.fillText(txt, 80, 240);
        if (!rew && Math.floor(t * 2) % 2){ ctx.fillStyle = "#E0503A"; ctx.beginPath(); ctx.arc(1000, 222, 16, 0, TAU); ctx.fill(); } }
      ctx.restore();
      if (past && m.label){ const q = eBack(clamp((k - .15) / .4, 0, 1)), lo = m.labelOut ? T(s, m.labelOut, .6, idx) : 1e9, oq = Math.max(next ? clamp((t - (next.T - .35)) / .3, 0, 1) : 0, clamp((t - lo) / .3, 0, 1)); if (q > 0){ ctx.save(); ctx.translate(540, m.labelY ?? 380); ctx.rotate(-.03); ctx.scale(q * (1 - oq * .3), q * (1 - oq * .3)); ctx.globalAlpha *= 1 - oq;
        font(ctx, 900, 70, FAM); const sub = m.sub || "", lw = ctx.measureText(m.label).width; font(ctx, 700, 40, FAM); const sw = ctx.measureText(sub).width, w = Math.min(900, Math.max(lw, sw) + 120), h = sub ? 190 : 120;
        rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = "#F7F1E4"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); ctx.fillStyle = ORANGE; ctx.fillRect(-w / 2 + 7, -h / 2 + 7, w - 14, 18);
        ctx.textAlign = "center"; font(ctx, 900, 70, FAM); fit(ctx, m.label, w - 60, 70, 900, 30); ctx.fillStyle = BROWN; ctx.fillText(m.label, 0, sub ? -h / 2 + 100 : 28); if (sub){ fit(ctx, sub, w - 60, 40, 700, 22); ctx.fillStyle = "#8A5A3E"; ctx.fillText(sub, 0, h / 2 - 30); } ctx.textAlign = "left"; ctx.restore(); } }
    });
  }, (s, f, i, add) => { const M = f.moments || []; M.forEach((m, j) => { const ff = Object.assign({}, f, m); if (j === 0) sfxBase(s, ff, i, add); else { sfxBase(s, Object.assign({}, m, { stamp: null }), i, add); const tm = tOf(s, m, .3 + j * .2, i); add(tm - .55, "whoosh"); add(tm, "pop"); if (m.label) add(tm + .2, "pop"); } }); });

  /* ================= cf_teropong: binocular view ================= */
  function flag(ctx, g, t, lock, k){
    const x = g.x, y = g.y, H2 = g.h || 300, col = lock ? ORANGE : (g.color || "#5E7FA8"), sc = lock ? 1 + .12 * eBack(clamp(k / .4, 0, 1)) : 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 60, 12, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#5A3A2A"; rr(ctx, -7, -H2, 14, H2, 6); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(7, -H2 + 6); for (let m = 0; m <= 10; m++){ const q = m / 10; ctx.lineTo(7 + q * 190, -H2 + 6 + Math.sin(t * 5 - q * 4 + x) * 12 * q); } for (let m = 10; m >= 0; m--){ const q = m / 10; ctx.lineTo(7 + q * 190, -H2 + 116 + Math.sin(t * 5 - q * 4 + x) * 12 * q); } ctx.closePath(); ctx.fill(); ol(ctx, 5);
    drawG(ctx, g, 100, -H2 + 62, 64, "#FFFFFF");
    font(ctx, 900, 44, FAM); const w = ctx.measureText(g.label).width + 50; ctx.save(); ctx.translate(0, -H2 * .38); ctx.rotate(-.03); rr(ctx, -w / 2, -38, w, 76, 14); ctx.fillStyle = lock ? "#FFF1C9" : PAPER; ctx.fill(); ol(ctx, 6); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(g.label, 0, 15); ctx.textAlign = "left"; ctx.restore();
    if (lock){ for (let r = 0; r < 3; r++){ const q = ((k * .8 + r / 3) % 1); ctx.strokeStyle = hexA(HL, .7 * (1 - q)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, -H2 * .5, 120 + q * 220, 0, TAU); ctx.stroke(); } }
    ctx.restore(); }
  function binoProp(ctx, x, y, s, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
    [-1, 1].forEach(d => { rr(ctx, d * 46 - 38, -56, 76, 112, 22); ctx.fillStyle = "#2A2623"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(d * 46, -56, 36, 14, 0, 0, TAU); ctx.fillStyle = "#7FB7CF"; ctx.fill(); ol(ctx, 4); });
    rr(ctx, -18, -30, 36, 40, 8); ctx.fillStyle = "#4A4440"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
  let MASK = null;
  TT.scene("cf_teropong", "Cerita: pandangan teropong", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ at: .1 }, f.bino || {}), tIn = tOf(s, B, .05, idx), tOut = outOf(s, B, idx);
    const tg = (f.targets || []).map((g, j) => Object.assign({}, g, { L: g.lockCue ? T(s, g.lockCue, .6, idx) : 1e9 }));
    const spots = {}; tg.forEach((g, j) => { const z = g.zoom || 1.9; spots["t" + j] = [g.x + 50, g.y - (g.h || 300) * .5 + 140 / z, z]; });
    const hero = (f.toons || [])[f.binoOn || 0];
    base(ctx, s, t, { env: "sunset", spots,
      back: () => tg.forEach(g => flag(ctx, g, t, t >= g.L, t - g.L)),
      front: (c2, c, sts) => { const st = sts[f.binoOn || 0]; if (!st || f.binoHand === false) return; const u = st.size / 92, up = t < tOut + .3; const hx = st.x + st.face * 17 * u, hy = st.y - (up ? 70 : 46) * u; binoProp(ctx, hx, hy, u / 8.2 * 1.1, st.face * .1); },
      screen: () => {
        if (t < tIn) return; const k = t - tIn, o = t > tOut ? eOut(clamp((t - tOut) / .7, 0, 1)) : 0, iq = eOut(clamp(k / .4, 0, 1));
        const r = 300 * (2.2 - 1.2 * iq) * (1 + o * 3.5), cy = 820, dx = 175 * (1 + o * 2); if (o >= 1) return;
        if (!MASK){ MASK = document.createElement("canvas"); MASK.width = 1080; MASK.height = 1920; }
        const mx = MASK.getContext("2d"); mx.setTransform(1, 0, 0, 1, 0, 0); mx.globalCompositeOperation = "source-over"; mx.clearRect(0, 0, 1080, 1920); mx.fillStyle = "rgba(12,8,6,.97)"; mx.fillRect(0, 0, 1080, 1920);
        mx.globalCompositeOperation = "destination-out"; mx.fillStyle = "#000"; [-1, 1].forEach(d => { mx.beginPath(); mx.arc(540 + d * dx, cy, r, 0, TAU); mx.fill(); }); mx.globalCompositeOperation = "source-over";
        ctx.save(); ctx.drawImage(MASK, 0, 0);
        ctx.strokeStyle = "#3A3532"; ctx.lineWidth = 22; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(540 + d * dx, cy, r, d < 0 ? Math.acos(dx / r) : Math.PI + Math.acos(dx / r), d < 0 ? TAU - Math.acos(dx / r) : Math.PI - Math.acos(dx / r) + TAU); ctx.stroke(); });
        ctx.globalCompositeOperation = "source-atop"; ctx.restore();
        // lens glare + reticle
        ctx.save(); ctx.globalAlpha = 1 - o; ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(540 - 90, cy); ctx.lineTo(540 + 90, cy); ctx.moveTo(540, cy - 90); ctx.lineTo(540, cy + 90); ctx.stroke();
        for (let m = -3; m <= 3; m++){ if (!m) continue; ctx.beginPath(); ctx.moveTo(540 + m * 28, cy - 10); ctx.lineTo(540 + m * 28, cy + 10); ctx.stroke(); }
        const lk = tg.find(g => t >= g.L && t < g.L + 1.2); if (lk){ const q = clamp((t - lk.L) / .3, 0, 1); ctx.strokeStyle = HL; ctx.lineWidth = 8; const s2 = 160 - 60 * eOut(q); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(540 + a * s2, cy + b * (s2 - 40)); ctx.lineTo(540 + a * s2, cy + b * s2); ctx.lineTo(540 + a * (s2 - 40), cy + b * s2); ctx.stroke(); }); }
        ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.ellipse(540 - dx - r * .35, cy - r * .45, r * .3, r * .12, -.5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(540 + dx - r * .35, cy - r * .45, r * .3, r * .12, -.5, 0, TAU); ctx.fill();
        ctx.restore();
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = Object.assign({ at: .1 }, f.bino || {}); add(tOf(s, B, .05, i), "whoosh"); if (B.outCue || B.out != null) add(outOf(s, B, i), "whoosh");
    (f.targets || []).forEach(g => { if (g.lockCue) { add(T(s, g.lockCue, .6, i), "ping"); add(T(s, g.lockCue, .6, i) + .25, "chime"); } }); });

  /* ================= cf_gunting: budget tags + scissors ================= */
  function tagCard(ctx, it, col, grey){ const w = 190, h = 230; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 40); ctx.lineTo(0, -h / 2); ctx.lineTo(w / 2, -h / 2 + 40); ctx.lineTo(w / 2, h / 2 - 16); ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - 16, h / 2); ctx.lineTo(-w / 2 + 16, h / 2); ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - 16); ctx.closePath();
    ctx.fillStyle = grey ? "#B9B3AC" : col; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -h / 2 + 34, 12, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(0, -16, 48, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", grey ? .5 : .92); ctx.fill(); drawG(ctx, it, 0, -16, 66, grey ? "#8A847E" : col);
    font(ctx, 800, 30, FAM); let L = wrap(ctx, it.text, w - 26); if (L.length > 2){ font(ctx, 800, 24, FAM); L = wrap(ctx, it.text, w - 20).slice(0, 2); } ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 5;
    L.forEach((l, i) => { const y = 64 + (i - (L.length - 1) / 2) * 32 + (L.length > 1 ? 4 : 0); ctx.strokeText(l, 0, y); ctx.fillText(l, 0, y); }); ctx.textAlign = "left"; }
  function scissors(ctx, x, y, open, rot, s){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    [-1, 1].forEach(d => { ctx.save(); ctx.rotate(d * open * .5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-70, d * 22, -190, d * 4); ctx.lineTo(-190, d * -4); ctx.quadraticCurveTo(-80, 0, 0, d * -10); ctx.closePath(); ctx.fillStyle = "#D7DEE4"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.ellipse(70, d * 36, 46, 30, d * .3, 0, TAU); ctx.lineWidth = 20; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = ORANGE; ctx.stroke(); ctx.restore(); });
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fillStyle = "#8C8C8C"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  const TCOL = ["#C2691F", "#2F6F73", "#8E5AA8", "#5E7FA8", "#7A9A5B", "#B5643C"];
  TT.scene("cf_gunting", "Cerita: gunting pos pengeluaran", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rp = Object.assign({ y: 620, x0: 110, x1: 970 }, f.rope || {}), tags = f.tags || [], n = tags.length, sp = (Rp.x1 - Rp.x0) / (n + 1);
    const tAt = tOf(s, f.ropeIn || { at: .1 }, .05, idx), TS = f.tagScale || 1;
    const tg = tags.map((g, j) => Object.assign({}, g, { j, x: Rp.x0 + sp * (j + 1), C: g.cut ? tOf(s, g.cut, .3 + j * .15, idx) + (g.cut.dt || 0) : 1e9, M: g.mark ? tOf(s, g.mark, .4, idx) : 1e9, In: tAt + .1 + j * .12 }));
    const cuts = tg.filter(g => g.C < 1e9).sort((a, b) => a.C - b.C), keepT = f.keepCue ? T(s, f.keepCue, .6, idx) : 1e9;
    const tagPos = (g) => { const sw = Math.sin(t * 1.6 + g.j * 1.3) * .07, sag = Math.sin(clamp((g.x - Rp.x0) / (Rp.x1 - Rp.x0), 0, 1) * Math.PI) * 50; const ry = Rp.y + sag; return [g.x, ry, sw]; };
    base(ctx, s, t, { env: "home", spots: Object.assign({ rope: [540, Rp.y + 200, 1.15] }, ...tg.map(g => ({ ["tag" + g.j]: [g.x, Rp.y + 220, 1.7] }))),
      back: () => {},
      mid: () => {
        const q = eOut(clamp((t - tAt) / .5, 0, 1)); if (q <= 0) return;
        // rope
        ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 9; ctx.beginPath(); const xe = lerp(Rp.x0, Rp.x1, q); ctx.moveTo(Rp.x0 - 60, Rp.y - 20); for (let x = Rp.x0; x <= xe; x += 20){ const sag = Math.sin(clamp((x - Rp.x0) / (Rp.x1 - Rp.x0), 0, 1) * Math.PI) * 50; ctx.lineTo(x, Rp.y + sag); } ctx.stroke();
        [Rp.x0 - 60, Rp.x1 + 60].forEach(px => { ctx.fillStyle = "#5A3A2A"; ctx.beginPath(); ctx.arc(px, Rp.y - 20, 16, 0, TAU); ctx.fill(); ol(ctx, 4); });
        tg.forEach(g => { const k = t - g.In; if (k < 0) return; const [x, ry, sw] = tagPos(g), pq = eBack(clamp(k / .4, 0, 1)), kc = t - g.C, col = g.color || TCOL[g.j % TCOL.length];
          const mode = g.mode || "drop";
          if (mode === "drop" && kc >= 0){ // falling tag
            const fall = 1900 * kc * kc, land = GROUND - 80 * TS - (ry + 60 + 115 * TS), tl = Math.sqrt(Math.max(0, land) / 1900), yy = Math.min(fall, land), landed = fall >= land, dd = g.j % 2 ? 1 : -1;
            const rot = landed ? dd * (Math.PI / 2) + Math.sin(Math.min(1, (kc - tl) / .3) * Math.PI) * .2 * (1 - Math.min(1, (kc - tl) / .3)) : sw + kc / tl * dd * Math.PI / 2;
            ctx.save(); ctx.translate(x + Math.min(kc, tl) * 160 * dd, ry + 60 + 115 * TS + yy); ctx.rotate(rot); ctx.scale(.9 * TS, .9 * TS); tagCard(ctx, g, col, kc > .5); ctx.restore();
            ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + 4, ry + 24); ctx.stroke();
            if (kc < .5){ ctx.save(); ctx.globalAlpha = 1 - kc / .5; font(ctx, 900, 56, FAM); ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.textAlign = "center"; ctx.translate(x, ry - 40 - kc * 80); ctx.rotate(-.15); ctx.strokeText("KRES!", 0, 0); ctx.fillStyle = "#FFFFFF"; ctx.fillText("KRES!", 0, 0); ctx.textAlign = "left"; ctx.restore(); }
            return; }
          const trim = mode === "trim" && kc >= 0 ? eBack(clamp(kc / .4, 0, 1)) : 0, keep = t >= keepT && !(g.C < 1e9) ? Math.abs(Math.sin((t - keepT) * 6)) * clamp(1 - (t - keepT) / 1.6, 0, 1) : 0;
          ctx.save(); ctx.translate(x, ry); ctx.rotate(sw + (kc >= 0 && kc < .4 && mode === "trim" ? Math.sin(kc * 40) * .1 : 0));
          ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
          ctx.translate(0, 60 + 115 * TS - keep * 30); const sc = pq * (1 - .3 * trim) * TS; ctx.scale(sc, sc); tagCard(ctx, g, col, false);
          if (trim > 0){ ctx.save(); ctx.translate(0, 150); ctx.scale(trim / (1 - .3 * trim), trim / (1 - .3 * trim)); font(ctx, 900, 34, FAM); const w = ctx.measureText(g.trimText || "HEMAT").width + 40; rr(ctx, -w / 2, -26, w, 52, 26); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(g.trimText || "HEMAT", 0, 12); ctx.textAlign = "left"; ctx.restore(); }
          ctx.restore();
          if (keep > 0){ for (let m = 0; m < 3; m++) sparkle(ctx, x + Math.cos(t * 3 + m * 2) * 110, ry + 170 + Math.sin(t * 3 + m * 2) * 120, 16, m % 2 ? "#F6D36B" : HL); }
          if (t >= g.M){ const mq = clamp((t - g.M) / .5, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(x, ry + 60 + 115 * TS, 135 * TS, 170 * TS, .08, -Math.PI * .7, -Math.PI * .7 + TAU * 1.05 * eOut(mq)); ctx.stroke(); }
          if (mode === "trim" && kc >= 0) burstFx(ctx, x, ry + 175, kc - .1, GREEN, 10, 200); });
      },
      midZ: f.ropeZ ?? -1,
      over: (cx2, c) => {
        if (!cuts.length) return; const t0 = cuts[0].C - .55; if (t < t0) return;
        let px, py, open = .9, j = 0; while (j < cuts.length - 1 && t >= cuts[j].C + .15) j++;
        const target = g => { const [x, ry] = tagPos(g); return c.toScreen(x + 10, ry + 34); };
        const cur = cuts[j], prev = j > 0 ? cuts[j - 1] : null, a = prev ? target(prev) : [1250, 300], b = target(cur), st0 = prev ? prev.C + .15 : t0, q = eOut(clamp((t - st0) / Math.max(.15, cur.C - .08 - st0), 0, 1));
        px = lerp(a[0], b[0], q); py = lerp(a[1], b[1], q) - Math.sin(q * Math.PI) * 120; const dk = t - cur.C; open = dk < -.12 ? .9 + .1 * Math.sin(t * 12) : (dk < .05 ? lerp(.9, 0, clamp((dk + .12) / .17, 0, 1)) : clamp((dk - .05) / .3, 0, .9));
        const last = j === cuts.length - 1 && t > cur.C + .4; if (last){ const lq = clamp((t - cur.C - .4) / .6, 0, 1); px = lerp(b[0], 1300, eOut(lq)); py = lerp(b[1], 200, eOut(lq)); }
        scissors(ctx, px + 150, py, open, .12 + Math.sin(t * 3) * .04, 1.0);
        if (dk >= 0 && dk < .35){ ctx.save(); ctx.globalAlpha = 1 - dk / .35; for (let m = 0; m < 8; m++){ const an = m / 8 * TAU; ctx.strokeStyle = m % 2 ? HL : "#FFFFFF"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(b[0] + Math.cos(an) * (20 + dk * 100), b[1] + Math.sin(an) * (20 + dk * 100)); ctx.lineTo(b[0] + Math.cos(an) * (50 + dk * 180), b[1] + Math.sin(an) * (50 + dk * 180)); ctx.stroke(); } ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const tAt = tOf(s, f.ropeIn || { at: .1 }, .05, i); add(tAt, "whoosh");
    (f.tags || []).forEach((g, j) => { if (j % 2 === 0) add(tAt + .1 + j * .12, "pop"); if (g.cut){ const c = tOf(s, g.cut, .3 + j * .15, i) + (g.cut.dt || 0); add(c, "ping"); add(c + .05, (g.mode || "drop") === "trim" ? "chime" : "whoosh"); } if (g.mark) add(tOf(s, g.mark, .4, i), "whoosh"); });
    if (f.keepCue) add(T(s, f.keepCue, .6, i), "chime"); });

  /* ================= cf_pintu: doors with warm light ================= */
  TT.scene("cf_pintu", "Cerita: pintu bantuan bercahaya", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Wl = Object.assign({ x0: 20, x1: 1060, h: 820, color: "#EFE3CF" }, f.wall || {}), top = GROUND - Wl.h;
    const doors = (f.doors || []).map((d, j) => Object.assign({ w: 290, h: 540, icon: "users", color: j ? "#2F6F73" : ORANGE }, d, { O: d.openCue ? T(s, d.openCue, .4, idx) : (d.openAt ?? 1e9), S: tOf(s, d.sign || { at: .2 + j * .25 }, .1, idx) }));
    const spots = {}; doors.forEach((d, j) => { spots["door" + j] = [d.x, GROUND - d.h * .65, 1.35]; });
    const openQ = d => eBack(clamp((t - d.O) / .7, 0, 1));
    base(ctx, s, t, { env: "street", spots,
      back: () => {
        ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.fillRect(Wl.x0, GROUND - 10, Wl.x1 - Wl.x0, 26);
        rr(ctx, Wl.x0, top, Wl.x1 - Wl.x0, Wl.h, 8); ctx.fillStyle = Wl.color; ctx.fill(); ol(ctx, 7);
        ctx.fillStyle = hexA("#C9B08E", .35); for (let y = top + 60; y < GROUND - 20; y += 70) ctx.fillRect(Wl.x0 + 6, y, Wl.x1 - Wl.x0 - 12, 4);
        ctx.fillStyle = "#A9643B"; rr(ctx, Wl.x0 - 20, top - 40, Wl.x1 - Wl.x0 + 40, 56, 10); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#C47A48"; rr(ctx, Wl.x0, GROUND - 40, Wl.x1 - Wl.x0, 40, 4); ctx.fill(); ol(ctx, 5);
        doors.forEach(d => { const x0 = d.x - d.w / 2, y0 = GROUND - d.h, o = clamp(openQ(d), 0, 1.2);
          // interior (warm room) once opening
          ctx.save(); rr(ctx, x0, y0, d.w, d.h, [20, 20, 0, 0]); ctx.clip(); ctx.fillStyle = o > 0 ? lerpCol("#3B2B22", "#FFD99A", clamp(o, 0, 1)) : "#3B2B22"; ctx.fillRect(x0, y0, d.w, d.h);
          if (o > 0){ glowAt(ctx, d.x, y0 + d.h * .45, d.w * 1.1, "#FFF3D6", .8 * clamp(o, 0, 1)); ctx.fillStyle = hexA("#E8B98A", .7); ctx.fillRect(x0, GROUND - 80, d.w, 80); ctx.fillStyle = hexA("#7FA563", .8); ctx.beginPath(); ctx.ellipse(x0 + d.w - 50, GROUND - 120, 30, 70, 0, 0, TAU); ctx.fill(); }
          ctx.restore(); });
      },
      mid: () => {
        doors.forEach((d, j) => { const x0 = d.x - d.w / 2, y0 = GROUND - d.h, o = clamp(openQ(d), 0, 1.15);
          // frame
          ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.fillStyle = "#7A4A2E"; rr(ctx, x0 - 26, y0 - 26, d.w + 52, 26, [16, 16, 0, 0]); ctx.fill(); ctx.stroke(); rr(ctx, x0 - 26, y0, 26, d.h, 0); ctx.fill(); ctx.stroke(); rr(ctx, x0 + d.w, y0, 26, d.h, 0); ctx.fill(); ctx.stroke();
          // leaf, hinged on the left
          const lw = d.w * Math.cos(o * 1.35), skew = Math.sin(o * 1.35) * 40; if (lw > 2){ ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + lw, y0 - skew); ctx.lineTo(x0 + lw, GROUND + skew * .3); ctx.lineTo(x0, GROUND); ctx.closePath(); ctx.fillStyle = d.leaf || "#B5643C"; ctx.fill(); ol(ctx, 6);
            ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 4; rr(ctx, x0 + lw * .15, y0 + 50, lw * .7, d.h * .35, 10); ctx.stroke(); rr(ctx, x0 + lw * .15, y0 + d.h * .5, lw * .7, d.h * .38, 10); ctx.stroke();
            ctx.fillStyle = "#E8B23A"; ctx.beginPath(); ctx.arc(x0 + lw * .86, GROUND - d.h * .48, 14, 0, TAU); ctx.fill(); ol(ctx, 4); }
          // light rays on the floor
          if (o > 0){ ctx.save(); ctx.globalAlpha = .45 * clamp(o, 0, 1); ctx.fillStyle = "#FFE6B0"; ctx.beginPath(); ctx.moveTo(x0, GROUND); ctx.lineTo(x0 + d.w, GROUND); ctx.lineTo(x0 + d.w + 160, GROUND + 260); ctx.lineTo(x0 - 160, GROUND + 260); ctx.closePath(); ctx.fill(); ctx.restore();
            for (let m = 0; m < 6; m++){ const q = ((t * .5 + m / 6) % 1); sparkle(ctx, x0 + 30 + rnd(m + j * 9) * (d.w - 60), GROUND - 60 - q * d.h * .9, 12 * Math.sin(q * Math.PI), "#FFF4D0"); }
            burstFx(ctx, d.x, y0 + d.h * .4, t - d.O - .2, HL, 10, 240); }
          // sign
          const k = t - d.S; if (k >= 0){ const q = eBack(clamp(k / .45, 0, 1)); font(ctx, 900, 40, FAM); const L = String(d.label).split("\n"), tw = Math.max(...L.map(l => ctx.measureText(l).width)), w = Math.max(280, tw + 120), h = 50 + L.length * 46;
            ctx.save(); ctx.translate(d.x, y0 - 110 - (L.length - 1) * 20); ctx.rotate(Math.sin(t * 1.5 + j) * .02); ctx.scale(q, q); rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
            ctx.beginPath(); ctx.arc(-w / 2 + 50, 0, 30, 0, TAU); ctx.fillStyle = d.color; ctx.fill(); ico(ctx, d.icon, -w / 2 + 50, 0, 38, "#FFFFFF", 2.6);
            ctx.fillStyle = BROWN; ctx.textAlign = "center"; L.forEach((l, i) => ctx.fillText(l, 30, 14 + (i - (L.length - 1) / 2) * 46)); ctx.textAlign = "left"; ctx.restore(); } });
      },
      midZ: -.5 });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.doors || []).forEach((d, j) => { add(tOf(s, d.sign || { at: .2 + j * .25 }, .1, i), "pop"); if (d.openCue || d.openAt != null){ const o = d.openCue ? T(s, d.openCue, .4, i) : d.openAt; add(o, "whoosh"); add(o + .25, "chime"); } }); });
})();
