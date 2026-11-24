/* Scene pack j2611221200512: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for JS37, SC37, MS37, SB38, SP38.
   Layout prefix j2611221200512_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, hold, tint, piece:false}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, out|outCue, s, text}]   object in a toon's hand: thesis, note, galon, mangoes, mango, cocoa, card, envelope,
            money, wand, rosette, dandelion, knife, phone, paper
     pops   [{at|cue, text, x, y, size, rot, col}]      big outlined pop words (screen)
     tint   {at|cue, outCue, col, a, label}             imagination tint + wobbling dream frame (screen)
     crack  {at|cue, x, y}                              the screen cracks like glass
     heart  [{on, at|cue, fill:[{at|cue, v}], label}]   warm heart badge beside a toon that fills up (0..1)
     confetti {at|cue}     toon.yKeys [{at|cue, y, dur}] (toon moves up/down smoothly)     toon.chair / chairX (rolling chair)
   Set pieces (layout suffix):
     _adegan     generic story shot with the extras above
     _fotokopi   copy & binding kiosk on a rainy evening: rain window + lightning, copier light bar sweeping, pages shooting out   f.shop
     _halaman    a thesis on a book stand: pages riffle, one page is upside down, it spins right side up; a sticky note slides in   f.book
     _dandelion  hills + town: a giant dandelion is blown, seeds with tiny hearts drift to the houses whose windows light up    f.dand
     _kios       kiosk service window: customers queue, each parcel leaves with a small extra (note / quick message / help)    f.kios
     _angkringan night street food cart: swinging lantern with moths, kettle steam, tea glasses, a money fan pops            f.cart
     _sobek      the savings note with a perforated "siap direlakan" strip: torn off, flies away, maybe comes back late        f.note
     _amplop     table on a porch: five money bundles counted, one into an envelope, four into the school tin, date noted   f.amp
     _galon      neighbour's house with steps: a water gallon sloshes on a shoulder, carried up the steps, door, mango bag   f.galon
     _lampu      dusk alley with string lights that switch on bulb by bulb behind a walking toon, warm glow, hearts         f.lights
     _mangga     porch at night: mangoes are sliced on a low table and slices fly to the kids                               f.mango
     _keranjang  night, front door: a name tag is written, flies onto a woven basket on a stool, small gifts drop in   f.bask
     _angka      a giant extruded numeral block: mode "berat" (drops, its shadow swallows the toon) / mode "rayakan" (small block
                 grows 3 -> 6 -> 9 with party hat and star sticker)                                                         f.num
     _redup      the "semangat" desk lamp flickers and dims, a giant hole puncher punches holes in the week strip           f.lamp
     _otak       a jelly brain receives reward tokens, lights up and powers a big SEMANGAT bulb                             f.brain
     _pita       office: sticky note on the monitor, a rosette ribbon pinned on, small reward chips orbit                    f.pita
     _siput      a giant snail carries the request folder as its shell, day counter ticks                                   f.snail
     _spageti    paper floor plan: the document's path between stations tangles into spaghetti; turbo printer             f.plan
     _deteksi    value detector: step cards hover in a row, a wand beeps green or red siren                                 f.det
     _cacah      a big paper shredder eats the red steps; day counter 5 -> 1; the rest zoom by                               f.shred
     _engklek    chalk hopscotch of work steps on the pavement: drawn, one crossed out, the toon hops to SELESAI           f.hop */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221200512_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47],
    scratch: [21, -76], cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = (st) => { const h = HANDS[st.pose] || HANDS.idle; return lp(st, h[0] + 2, h[1]); };
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function textL(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.fillText(txt, x, y); }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); fit(ctx, txt, 820, size, 900, 30); const sz = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
    const w = ctx.measureText(txt).width + sz * .9, h = sz * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, sz * .36); ctx.textAlign = "left"; ctx.restore(); }
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; const hold = o.hold || 1.1; if (k < 0 || k > hold) return; const a = 1 - clamp((k - hold + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 110; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function lines2(ctx, txt, maxW, size, weight){ const ws = String(txt).split(" "); let L = [txt];
    font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width > maxW && ws.length > 1){ let best = null; for (let i = 1; i < ws.length; i++){ const a = ws.slice(0, i).join(" "), b = ws.slice(i).join(" "), m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width); if (!best || m < best[0]) best = [m, [a, b]]; } L = best[1]; }
    while (Math.max(...L.map(l => ctx.measureText(l).width)) > maxW && size > 14){ size -= 2; font(ctx, weight || 800, size, FAM); }
    return { L, size }; }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; if (maxW) size = fit(ctx, txt, maxW, size, 800); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function sign(ctx, txt, x, y, w, k, col, wob){ // sign board on a post, y = ground
    if (k <= 0) return; const q = eBack(clamp(k / .45, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate((wob || 0) + (1 - q) * .4); ctx.scale(1, q);
    ctx.fillStyle = "#7A4A2E"; ctx.fillRect(-7, -190, 14, 190); ol(ctx, 4);
    const { L, size } = lines2(ctx, txt, w - 30, 34, 900); const h = L.length * size * 1.15 + 26;
    rr(ctx, -w / 2, -190 - h, w, h, 10); ctx.fillStyle = col || PAPER; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = BROWN; ctx.textAlign = "center"; L.forEach((l, i) => { font(ctx, 900, size, FAM); ctx.fillText(l, 0, -190 - h + 13 + size * .95 + i * size * 1.15); }); ctx.textAlign = "left"; ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function heartPath(ctx, r){ ctx.beginPath(); ctx.moveTo(0, r * .95); ctx.bezierCurveTo(-r * 1.25, r * .1, -r * 1.05, -r * 1.05, 0, -r * .45); ctx.bezierCurveTo(r * 1.05, -r * 1.05, r * 1.25, r * .1, 0, r * .95); ctx.closePath(); }
  function bill(ctx, w, h, col, txt){ rr(ctx, -w / 2, -h / 2, w, h, 8); ctx.fillStyle = col || "#7FB77E"; ctx.fill(); ol(ctx, 4);
    rr(ctx, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 5); ctx.strokeStyle = hexA("#FFFFFF", .55); ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, h * .28, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .4); ctx.fill();
    if (txt) textC(ctx, txt, 0, h * .14, h * .36, "#1F4A2A", 900, w - 24); }
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "thesis"){ ctx.rotate(-.06); rr(ctx, -95, -130, 190, 250, 10); ctx.fillStyle = o.col || "#2F5E8C"; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = "#FFFDF6"; ctx.fillRect(86, -118, 12, 230); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 2; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(88, -110 + i * 38); ctx.lineTo(96, -110 + i * 38); ctx.stroke(); }
      rr(ctx, -70, -100, 140, 44, 6); ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, "SKRIPSI", 0, -70, 30, GOLD, 900, 128);
      ctx.fillStyle = hexA(GOLD, .8); ctx.fillRect(-50, 0, 100, 8); ctx.fillRect(-36, 20, 72, 8);
      if (o.note){ ctx.save(); ctx.translate(40, -150); ctx.rotate(.18 + Math.sin(t * 3) * .05); rr(ctx, -40, -30, 80, 66, 6); ctx.fillStyle = "#FFE680"; ctx.fill(); ol(ctx, 3); ctx.restore(); } }
    else if (kind === "note"){ ctx.rotate(-.1 + Math.sin(t * 2.6) * .05); const w = o.w || 170, h = o.h || 140; rr(ctx, -w / 2, -h / 2, w, h, 8); ctx.fillStyle = o.col || "#FFE680"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = hexA(ORANGE, .35); ctx.fillRect(-w / 2, -h / 2, w, 18);
      if (o.text){ const { L, size } = lines2(ctx, o.text, w - 24, 28, 800); L.forEach((l, i) => textC(ctx, l, 0, -h / 2 + 50 + i * size * 1.2, size, BROWN, 800)); }
      else { ctx.fillStyle = hexA(BROWN, .5); for (let i = 0; i < 3; i++) rr(ctx, -w / 2 + 18, -h / 2 + 36 + i * 26, w - 36 - i * 30, 9, 4), ctx.fill(); }
      ctx.strokeStyle = BROWN; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(w / 2 - 30, h / 2 - 30, 12, .2, Math.PI - .2); ctx.stroke(); }
    else if (kind === "galon"){ const lvl = o.level ?? .8, sl = Math.sin(t * (o.slosh || 5)) * 14;
      ctx.beginPath(); ctx.moveTo(-70, -110); ctx.quadraticCurveTo(-70, -150, -30, -160); ctx.lineTo(-24, -190); ctx.lineTo(24, -190); ctx.lineTo(30, -160); ctx.quadraticCurveTo(70, -150, 70, -110); ctx.lineTo(70, 110); ctx.quadraticCurveTo(70, 130, 50, 130); ctx.lineTo(-50, 130); ctx.quadraticCurveTo(-70, 130, -70, 110); ctx.closePath();
      ctx.fillStyle = hexA("#BFE2F5", .75); ctx.fill(); ctx.save(); ctx.clip(); const wy = 130 - 290 * lvl; ctx.beginPath(); ctx.moveTo(-80, wy + sl); ctx.quadraticCurveTo(0, wy - sl * .6, 80, wy - sl); ctx.lineTo(80, 140); ctx.lineTo(-80, 140); ctx.closePath(); ctx.fillStyle = hexA("#4FA3D9", .8); ctx.fill();
      for (let i = 0; i < 5; i++){ const q = ((t * .7 + i * .21) % 1); ctx.beginPath(); ctx.arc(-40 + i * 20, 120 - q * 200, 6 + i % 2 * 3, 0, TAU); ctx.strokeStyle = hexA("#FFFFFF", .8 * (1 - q)); ctx.lineWidth = 3; ctx.stroke(); } ctx.restore();
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); [-40, 40].forEach(dy => { ctx.strokeStyle = hexA("#5B8DB5", .7); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-70, dy); ctx.lineTo(70, dy); ctx.stroke(); });
      rr(ctx, -30, -205, 60, 26, 6); ctx.fillStyle = "#2F6FB5"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#FFFFFF", .5); rr(ctx, -55, -100, 16, 150, 8); ctx.fill(); }
    else if (kind === "mangoes"){ ctx.rotate(Math.sin(t * 3) * .06); ctx.strokeStyle = hexA("#FFFFFF", .9); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-30, -70, 26, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(30, -70, 26, Math.PI, 0); ctx.stroke();
      [[-40, 10], [30, 0], [-5, -30], [10, 40]].forEach(([mx, my], i) => drawMango(ctx, mx, my, 1, t, i));
      ctx.beginPath(); ctx.moveTo(-90, -70); ctx.lineTo(90, -70); ctx.lineTo(80, 90); ctx.quadraticCurveTo(0, 110, -80, 90); ctx.closePath(); ctx.fillStyle = hexA("#FFFFFF", .45); ctx.fill(); ctx.strokeStyle = hexA(OUT, .7); ctx.lineWidth = 4; ctx.stroke(); }
    else if (kind === "mango"){ drawMango(ctx, 0, 0, 1.3, t, 0); }
    else if (kind === "cocoa"){ rr(ctx, -45, -70, 90, 100, 14); ctx.fillStyle = o.col || "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(48, -20, 22, -1.3, 1.3); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -66, 40, 10, 0, 0, TAU); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ctx.fillStyle = RED; heartMini(ctx, 0, -20, 14);
      for (let k = 0; k < 3; k++){ const q = (t * .6 + k / 3) % 1; ctx.globalAlpha = .7 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-20 + k * 20, -80 - q * 90); ctx.quadraticCurveTo(-34 + k * 20, -110 - q * 90, -18 + k * 20, -140 - q * 90); ctx.stroke(); } ctx.globalAlpha = 1; }
    else if (kind === "card"){ ctx.rotate(-.08); rr(ctx, -120, -75, 240, 150, 14); ctx.fillStyle = o.col || "#FFF4E6"; ctx.fill(); ol(ctx, 5); rr(ctx, -120, -75, 240, 36, 14); ctx.fillStyle = ORANGE; ctx.fill();
      textC(ctx, o.tag || "BATAS IKHLAS", 0, -48, 22, "#FFFFFF", 900, 220); textC(ctx, o.text || "Rp1 JUTA", 0, 30, 44, BROWN, 900, 220); }
    else if (kind === "envelope"){ ctx.rotate(-.05); rr(ctx, -110, -70, 220, 140, 8); ctx.fillStyle = "#E8C38E"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-110, -70); ctx.lineTo(0, 10); ctx.lineTo(110, -70); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
      if (o.text) textC(ctx, o.text, 0, 50, 24, BROWN, 900, 200); }
    else if (kind === "money"){ for (let i = 0; i < 3; i++){ ctx.save(); ctx.translate(i * 4, -i * 6); bill(ctx, 190, 90, "#7FB77E", i === 2 ? (o.text || "Rp1 jt") : ""); ctx.restore(); } ctx.fillStyle = hexA("#FFFFFF", .9); ctx.fillRect(-14, -58, 28, 98); }
    else if (kind === "wand"){ ctx.rotate((o.wrot ?? -.95) + Math.sin(t * 5) * .15); rr(ctx, -12, -10, 24, 120, 8); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#4A4A52"; ctx.fillRect(-6, -150, 12, 140);
      ctx.beginPath(); ctx.ellipse(0, -190, 60, 46, 0, 0, TAU); ctx.lineWidth = 14; ctx.strokeStyle = "#2C2433"; ctx.stroke(); const lc = o.state === "red" ? RED : o.state === "green" ? GREEN : GOLD;
      glowAt(ctx, 0, 30, 60, lc, .6); ctx.beginPath(); ctx.arc(0, 30, 12, 0, TAU); ctx.fillStyle = lc; ctx.fill(); }
    else if (kind === "rosette"){ ctx.rotate(Math.sin(t * 3) * .1); [[-26, RED], [26, RED]].forEach(([dx, col]) => { ctx.beginPath(); ctx.moveTo(dx * .4, 20); ctx.lineTo(dx * 1.4, 150); ctx.lineTo(dx * .6, 130); ctx.lineTo(dx * .1, 150); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); });
      ctx.beginPath(); for (let i = 0; i < 24; i++){ const a = i / 24 * TAU, r = i % 2 ? 62 : 76; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); sparkle(ctx, 0, 0, 30, ORANGE); }
    else if (kind === "dandelion"){ const gone = o.gone || 0; ctx.strokeStyle = "#5E9C4E"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(20, -150, Math.sin(t * 1.5) * 10, -300); ctx.stroke();
      ctx.save(); ctx.translate(Math.sin(t * 1.5) * 10, -300); ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fillStyle = "#C9B27A"; ctx.fill();
      for (let i = 0; i < 40; i++){ if (rnd(i + 3) < gone) continue; const a = i / 40 * TAU + rnd(i) * .1, r = 92 + Math.sin(t * 3 + i) * 3; ctx.strokeStyle = hexA("#FFFFFF", .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 16, Math.sin(a) * 16); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke();
        ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 9, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .85); ctx.fill(); } ctx.restore(); }
    else if (kind === "knife"){ ctx.rotate(-.4 + (o.chop ? Math.abs(Math.sin(t * 9)) * .7 : 0)); rr(ctx, -10, -10, 20, 70, 6); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(-12, -120); ctx.quadraticCurveTo(10, -110, 12, -10); ctx.closePath(); ctx.fillStyle = "#D6DDE4"; ctx.fill(); ol(ctx, 3); }
    else if (kind === "laptop"){ ctx.rotate(-.05); if (o.closed){ rr(ctx, -130, -18, 260, 30, 8); ctx.fillStyle = "#544E42"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA(ORANGE, .9); ctx.beginPath(); ctx.arc(0, -3, 8, 0, TAU); ctx.fill(); }
      else { ctx.beginPath(); ctx.moveTo(-120, -190); ctx.lineTo(120, -190); ctx.lineTo(126, -10); ctx.lineTo(-126, -10); ctx.closePath(); ctx.fillStyle = "#544E42"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#BFE2EA"; ctx.fillRect(-104, -176, 208, 150);
        ctx.fillStyle = TEAL; ctx.fillRect(-104, -176, 208, 30); for (let i = 0; i < 12; i++){ ctx.fillStyle = i < (o.done ?? 3) ? GREEN : "#FFFFFF"; ctx.fillRect(-94 + (i % 6) * 33, -136 + Math.floor(i / 6) * 50, 26, 40); }
        rr(ctx, -140, -12, 280, 22, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); } }
    else if (kind === "chalk"){ ctx.rotate(-.6); rr(ctx, -10, -50, 20, 100, 8); ctx.fillStyle = o.col || "#FFFFFF"; ctx.fill(); ol(ctx, 3); }
    else if (kind === "paper"){ ctx.rotate(-.08); rr(ctx, -90, -120, 180, 240, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      const n = o.lines ?? 5; for (let i = 0; i < n; i++){ ctx.fillStyle = i === 0 ? ORANGE : "#B9A58E"; rr(ctx, -66, -92 + i * 40, i === 0 ? 132 : 70 + rnd(i) * 60, 14, 6); ctx.fill(); } }
    else if (kind === "phone"){ prop(ctx, "phone", 0, 0, { s: .6, screen: o.screen || "#BFE2EA" }, t); }
    ctx.restore(); }
  function heartMini(ctx, x, y, r){ ctx.save(); ctx.translate(x, y); heartPath(ctx, r); ctx.fill(); ctx.restore(); }
  function drawMango(ctx, x, y, s, t, i){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.5 + rnd(i) * .5);
    ctx.beginPath(); ctx.ellipse(0, 0, 44, 32, 0, 0, TAU); const g = ctx.createLinearGradient(-40, -30, 40, 30); g.addColorStop(0, "#F6C343"); g.addColorStop(.6, "#F08C2E"); g.addColorStop(1, "#D9603B"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#5E9C4E"; ctx.beginPath(); ctx.ellipse(-34, -24, 18, 8, -.6, 0, TAU); ctx.fill(); ol(ctx, 2.5); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.ellipse(10, -14, 14, 6, -.3, 0, TAU); ctx.fill(); ctx.restore(); }

  /* rolling office chair (world), seat at the hip of a sitting toon of size sz */
  function chairAt(ctx, x, y, sz, face, spin){ const k = sz / 92, sy = y - 11 * k; ctx.save();
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, y + 2, 20 * k, 3 * k, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 2.4 * k; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 15 * k, y - 2.5 * k); ctx.lineTo(x + 15 * k, y - 2.5 * k); ctx.moveTo(x, y - 2.5 * k); ctx.lineTo(x, sy + 2 * k); ctx.stroke();
    [-15, 0, 15].forEach(d => { ctx.beginPath(); ctx.arc(x + d * k, y - 1.6 * k, 1.8 * k, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); });
    const bx = x - face * 12 * k * Math.cos(spin || 0), bw = 5 * k * (.4 + .6 * Math.abs(Math.cos(spin || 0)));
    rr(ctx, bx - bw / 2, sy - 30 * k, bw, 28 * k, 2.5 * k); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, .7 * k);
    rr(ctx, x - 14 * k - face * 2 * k, sy - 2 * k, 28 * k, 5 * k, 2.4 * k); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, .7 * k); ctx.restore(); }


  function heartBadge(ctx, st, h, s, t, idx){ const T0 = h.cue || h.at != null ? tOf(s, h, .2, idx) : -1; if (t < T0) return; const q = eBack(clamp((t - T0) / .4, 0, 1));
    let v = h.v0 ?? 0; (h.fill || []).forEach((k, j) => { const tk = tOf(s, k, .3 + j * .1, idx); if (t >= tk) v = lerp(v, k.v, easeIO(clamp((t - tk) / (k.dur || .9), 0, 1))); });
    const k = st.size / 760, p = lp(st, (h.dx ?? 34), (h.dy ?? -64)), r = 70 * k * (h.s || 1) * (1 + .05 * Math.sin(t * (3 + v * 5)));
    ctx.save(); ctx.translate(p[0], p[1] + Math.sin(t * 2) * 6); ctx.scale(q, q); if (v > .5) glowAt(ctx, 0, 0, r * 3, GOLD, (v - .5) * .9);
    heartPath(ctx, r); ctx.fillStyle = hexA("#FFFFFF", .7); ctx.fill(); ctx.save(); heartPath(ctx, r); ctx.clip(); const wy = r * .95 - v * r * 2.1;
    ctx.beginPath(); ctx.moveTo(-r * 1.4, wy); for (let xx = -r * 1.4; xx <= r * 1.4; xx += 8) ctx.lineTo(xx, wy + Math.sin(xx * .08 + t * 5) * 5); ctx.lineTo(r * 1.4, r * 1.2); ctx.lineTo(-r * 1.4, r * 1.2); ctx.closePath();
    const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, "#F6C343"); g.addColorStop(1, "#E0533B"); ctx.fillStyle = g; ctx.fill(); ctx.restore();
    heartPath(ctx, r); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.setLineDash(v < .05 ? [14, 10] : []); ctx.stroke(); ctx.setLineDash([]);
    if (h.label) chip(ctx, h.label, 0, r * 1.45, v > .5 ? ORANGE : "#8A8A8A", "#FFFFFF", 26);
    ctx.restore(); }
  function tintFx(ctx, t, T1, T2, o){ const a = clamp((t - T1) / .35, 0, 1) * (1 - clamp((t - T2) / .3, 0, 1)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = hexA(o.col || "#5B3C8C", o.a ?? .28); ctx.fillRect(0, 0, 1080, 1920);
    for (let i = 0; i < 26; i++){ const u = i / 26, wob = Math.sin(t * 2 + i) * 14, r = 90 + rnd(i) * 50 + wob;
      const pts = [[u * 1080, -20], [1100, u * 1920], [1080 - u * 1080, 1940], [-20, 1920 - u * 1920]];
      pts.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = hexA("#EADCF7", .55); ctx.fill(); }); }
    if (o.label){ ctx.translate(540, 230); ctx.rotate(-.04); chip(ctx, o.label, 0, 0, "#5B3C8C", "#FFFFFF", 40); }
    ctx.restore(); }
  function crackFx(ctx, k, o){ if (k < 0) return; const q = clamp(k / .18, 0, 1), cx = o.x ?? 560, cy = o.y ?? 760;
    ctx.save(); if (k < .25){ ctx.fillStyle = hexA("#FFFFFF", .5 * (1 - k / .25)); ctx.fillRect(0, 0, 1080, 1920); }
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (let i = 0; i < 11; i++){ const a0 = i / 11 * TAU + rnd(i) * .4, L = (380 + rnd(i + 7) * 420) * q; let x = cx, y = cy, a = a0; const pts = [[x, y]];
      for (let sgm = 0; sgm < 5; sgm++){ a += (rnd(i * 9 + sgm) - .5) * .7; x += Math.cos(a) * L / 5; y += Math.sin(a) * L / 5; pts.push([x, y]); }
      [[9, hexA(OUT, .55)], [4, "#FFFFFF"]].forEach(([w, col]) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, j) => j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }); }
    for (let r = 1; r <= 2; r++){ ctx.beginPath(); for (let i = 0; i <= 11; i++){ const a = i / 11 * TAU, rr0 = (60 * r + rnd(i + r * 5) * 30) * q; ctx.lineTo(cx + Math.cos(a) * rr0, cy + Math.sin(a) * rr0); } ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh, j) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons0 = f.toons || [], idx = G.scene;
    const yAt = a => { let y = a.y ?? GY; (a.yKeys || []).map((k, j) => Object.assign({ T: tOf(s, k, .3 + j * .1, idx) }, k)).sort((p, q) => p.T - q.T).forEach(k => { if (t >= k.T) y = lerp(y, k.y, easeIO(clamp((t - k.T) / (k.dur || .5), 0, 1))); }); return y; };
    const toons = toons0.map(a => a.yKeys ? Object.assign({}, a, { y: yAt(a) }) : a);
    const sts = toons.map(a => toonState(a, s, t));
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + sitD + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    const piece = f.piece !== false;
    env(ctx, E, t, c, eo);
    const R = { c, f, piece, shotT };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const holds = (f.hold || []).map((h, j) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j]; if (a.chair){ layer(ctx, c, 1, () => chairAt(ctx, a.chairX ?? st.x, st.y, st.size, st.face || 1, st.moving && a.chairX == null ? (t - st.moveT) * 9 : 0)); }
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
      (f.heart || []).filter(h => (h.on ?? 0) === j).forEach(h => layer(ctx, c, 1, () => heartBadge(ctx, st, h, s, t, idx)));
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    if (f.tint){ const T1 = tOf(s, f.tint, .2, idx), T2 = f.tint.outCue ? T(s, f.tint.outCue, .3, idx) : (f.tint.out ?? 1e9); ovs.push(() => tintFx(ctx, t, T1, T2, f.tint)); }
    if (f.crack){ const tk = tOf(s, f.crack, .4, idx); ovs.push(() => crackFx(ctx, t - tk, f.crack)); }
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f };
  }
  function sfxBase(s, f0, i, add){
    const all = [f0].concat(f0.shots || []);
    all.forEach((f, n) => {
      const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
      if (n > 0) add(tOf(s, f, .2, i), "whoosh");
      (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
      (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
      if (n === 0 || f.cards !== f0.cards) (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
      (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
      (f.hold || []).forEach(h => { if (h.cue) add(tOf(s, h, .2, i), "pop"); });
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.crack) add(tOf(s, f0.crack, .4, i), "pop");
    (f0.heart || []).forEach(h => (h.fill || []).forEach((k, j) => add(tOf(s, k, .3 + j * .1, i), "chime")));
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= JS37: copy & binding kiosk ================= */
  function rainFx(ctx, x0, y0, w, h, t, n){ ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip(); ctx.strokeStyle = hexA("#FFFFFF", .55); ctx.lineWidth = 3; ctx.lineCap = "round";
    for (let i = 0; i < (n || 40); i++){ const x = x0 + rnd(i) * w, sp = 900 + rnd(i + 4) * 500, y = y0 + ((t * sp + rnd(i + 9) * h) % (h + 80)) - 40; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 44); ctx.stroke(); } ctx.restore(); }
  function shopBack(ctx, t, o){
    ctx.fillStyle = "#E9DCC6"; ctx.fillRect(-700, -400, 2500, GY + 400); ctx.fillStyle = "#DCC9AB"; ctx.fillRect(-700, GY - 240, 2500, 240);
    ctx.fillStyle = "#B9A58E"; ctx.fillRect(-700, GY, 2500, 700); ctx.strokeStyle = hexA(OUT, .15); ctx.lineWidth = 4;
    for (let x = -700; x < 1800; x += 120){ ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x - 60, GY + 600); ctx.stroke(); } for (let y = GY + 70; y < GY + 600; y += 90){ ctx.beginPath(); ctx.moveTo(-700, y); ctx.lineTo(1800, y); ctx.stroke(); }
    // sign
    rr(ctx, 150, 520, 780, 130, 22); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, o.sign || "FOTOKOPI & JILID", 540, 608, 64, "#FFFFFF", 900, 720);
    // rain window
    const wx = o.winX ?? -40, fl = o.flashK != null && o.flashK >= 0 && o.flashK < .5 ? (o.flashK < .08 || (o.flashK > .16 && o.flashK < .24) ? 1 : 0) : 0;
    rr(ctx, wx, 720, 380, 460, 14); ctx.fillStyle = fl ? "#EAF4FF" : "#4E6A86"; ctx.fill(); rainFx(ctx, wx, 720, 380, 460, t, 34);
    if (fl){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx + 230, 720); ctx.lineTo(wx + 190, 860); ctx.lineTo(wx + 240, 880); ctx.lineTo(wx + 180, 1040); ctx.stroke(); }
    rr(ctx, wx, 720, 380, 460, 14); ol(ctx, 8); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(wx + 184, 720, 12, 460); ctx.fillRect(wx, 942, 380, 12);
    // paper shelf (right, high)
    ctx.fillStyle = "#8E4E2E"; rr(ctx, 1000, 980, 520, 24, 6); ctx.fill(); ol(ctx, 4);
    ["#FFFFFF", "#F6D36B", "#BFE2EA", "#F4A85C", "#FFFFFF"].forEach((col, i) => { for (let k = 0; k < 4; k++){ rr(ctx, 1020 + i * 98, 980 - 28 - k * 30, 84, 28, 4); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3); } });
    // copier
    const cx = o.copyX ?? 900, top = GY - 400; ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(cx, GY + 4, 200, 18, 0, 0, TAU); ctx.fill();
    rr(ctx, cx - 170, top, 340, 400, 18); ctx.fillStyle = "#D8DCE0"; ctx.fill(); ol(ctx, 6); rr(ctx, cx - 150, top + 140, 300, 90, 10); ctx.fillStyle = "#B8BEC5"; ctx.fill(); ol(ctx, 4);
    rr(ctx, cx - 150, top + 250, 300, 120, 10); ctx.fillStyle = "#B8BEC5"; ctx.fill(); ol(ctx, 4);
    rr(ctx, cx - 180, top - 40, 360, 44, 10); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 5);
    const sw = (Math.sin(t * 3.2) + 1) / 2; glowAt(ctx, cx - 160 + sw * 320, top - 2, 90, "#9FF5C8", .7); ctx.fillStyle = hexA("#C9FFE0", .9); ctx.fillRect(cx - 170 + sw * 320, top - 6, 18, 10);
    ctx.beginPath(); ctx.arc(cx + 120, top + 60, 11, 0, TAU); ctx.fillStyle = Math.sin(t * 6) > 0 ? GREEN : "#2E6B40"; ctx.fill(); rr(ctx, cx - 130, top + 40, 150, 50, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 3);
    // output tray + flying pages
    rr(ctx, cx - 260, top + 150, 100, 18, 4); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 3);
    const ck = o.copyK ?? -1; if (ck >= 0){ const n = Math.min(14, Math.floor(ck * 6)); for (let i = 0; i < n; i++){ ctx.fillStyle = "#FFFFFF"; ctx.fillRect(cx - 254, top + 146 - i * 4, 88, 4); }
      for (let i = 0; i < 3; i++){ const q = ((ck * 2.2 + i / 3) % 1); const x = cx - 170 - q * 80, y = top + 120 + q * 20 - Math.sin(q * Math.PI) * 50; ctx.save(); ctx.translate(x, y); ctx.rotate(-q * .5); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-44, -4, 88, 8); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.strokeRect(-44, -4, 88, 8); ctx.restore(); } } }
  function shopCounter(ctx, x, w, t){ const top = GY - 330; ctx.fillStyle = "#A9643B"; rr(ctx, x - w / 2, top, w, GY - top, 12); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#8E4E2E"; const n = Math.max(2, Math.round(w / 140)); for (let i = 0; i < n; i++) rr(ctx, x - w / 2 + 20 + i * (w - 40) / n, top + 60, (w - 40) / n - 16, 230, 10), ctx.fill();
    rr(ctx, x - w / 2 - 20, top - 30, w + 40, 40, 12); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6); }

  TT.scene(PX + "fotokopi", "Cerita: kios fotokopi & jilid saat hujan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ cx: 640, w: 420, copyX: 930 }, f.shop || {});
    const tCopy = T(s, K.copyCue, .3, idx), tFlash = K.flashCue ? T(s, K.flashCue, .2, idx) : (K.flashAt ?? 1e9), tDrop = T(s, K.dropCue, .5, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { copier: [K.copyX, 1150, 1.15], counter: [K.cx, 1200, 1.1] },
      back: () => shopBack(ctx, t, { sign: K.sign, flashK: t - tFlash, copyK: t >= tCopy ? t - tCopy : -1, copyX: K.copyX }),
      front: () => { shopCounter(ctx, K.cx, K.w, t);
        if (t >= tDrop){ const q = clamp((t - tDrop) / .45, 0, 1), y = lerp(GY - 520, GY - 360, eBack(q)); drawItem(ctx, "thesis", K.cx - 90, y, t, { s: .9, rot: -.3 * (1 - q) });
          drawItem(ctx, "thesis", K.cx - 70, y - 30, t, { s: .9, col: "#7A2E3B", rot: .05 }); } },
      over: (ctx2, c) => { if (t >= tFlash && t - tFlash < .3){ ctx.fillStyle = hexA("#FFFFFF", .35 * (1 - (t - tFlash) / .3)); ctx.fillRect(0, 0, 1080, 1920); }
        if (t >= tFlash){ const p = c.toScreen((K.winX ?? -40) + 260, 760); popWord(ctx, "JDERR!", Math.max(250, p[0]), Math.max(380, p[1]), t - tFlash, { size: 84, rot: -8, hold: .9, col: GOLD }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.shop || {}; if (K.copyCue) add(cueT(s, K.copyCue, .3, i), "whoosh"); if (K.flashCue) add(cueT(s, K.flashCue, .2, i), "pop"); if (K.dropCue) add(cueT(s, K.dropCue, .5, i) + .3, "pop"); });

  /* the thesis on a book stand */
  function pageLines(ctx, x, y, w, h, upside, num, seed){ ctx.save(); ctx.translate(x + w / 2, y + h / 2); if (upside) ctx.rotate(Math.PI);
    ctx.fillStyle = BROWN; rr(ctx, -w / 2 + 30, -h / 2 + 34, w * .55, 16, 6); ctx.fill(); ctx.fillStyle = "#B9A58E";
    for (let i = 0; i < 9; i++){ rr(ctx, -w / 2 + 30, -h / 2 + 72 + i * 30, (w - 60) * (i % 4 === 3 ? .6 : .9 + rnd(i + seed) * .1), 10, 5); ctx.fill(); }
    textC(ctx, String(num), 0, h / 2 - 22, 24, BROWN, 800); ctx.restore(); }
  TT.scene(PX + "halaman", "Cerita: halaman skripsi terbalik diputar + catatan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ x: 690, y: 1290, pw: 300, ph: 420, num: 41, noteText: "Semoga sidangnya lancar, Kak! :)" }, f.book || {});
    const tFlip = T(s, B.flipCue, .2, idx), tFind = T(s, B.findCue, .4, idx), tFix = T(s, B.fixCue, .3, idx), tNote = T(s, B.noteCue, .3, idx);
    const L = B.x - B.pw, top = B.y - B.ph;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { book: [B.x, B.y - B.ph / 2, 1.25], page: [B.x + B.pw / 2, B.y - B.ph / 2, 1.5] },
      back: () => shopBack(ctx, t, { sign: B.sign, copyK: t >= tFix ? t - tFix : -1, copyX: 1250, winX: -380 }),
      front: () => { shopCounter(ctx, 640, 1100, t);
        // stand + cover
        ctx.fillStyle = "#5A3A2A"; ctx.beginPath(); ctx.moveTo(B.x - 60, B.y + 10); ctx.lineTo(B.x, B.y - 80); ctx.lineTo(B.x + 60, B.y + 10); ctx.closePath(); ctx.fill(); ol(ctx, 4);
        rr(ctx, L - 18, top - 14, B.pw * 2 + 36, B.ph + 30, 12); ctx.fillStyle = "#2F5E8C"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = PAPER; ctx.fillRect(L, top, B.pw, B.ph); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(L, top, B.pw, B.ph); pageLines(ctx, L, top, B.pw, B.ph, false, B.num - 1, 3);
        // right page: riffling, upside down, fixed
        const riff = t >= tFlip && t < tFind ? (t - tFlip) * 5 : -1, upside = t >= tFlip && t < tFix + .9, fixK = t - tFix;
        const drawRight = (sx, num, up) => { ctx.save(); ctx.translate(B.x, 0); ctx.scale(sx, 1); ctx.fillStyle = sx < 0 ? "#F1E7D4" : PAPER; ctx.fillRect(0, top, B.pw, B.ph); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(0, top, B.pw, B.ph);
          if (sx > .15) pageLines(ctx, 0, top, B.pw, B.ph, up, num, num); ctx.restore(); };
        if (fixK >= 0 && fixK < .9){ drawRight(1, B.num, false); ctx.save(); ctx.globalAlpha = 1 - clamp(fixK / .9, 0, 1); ctx.translate(B.x + B.pw / 2 + fixK * 700, B.y - B.ph / 2 - fixK * 300); ctx.rotate(fixK * 3);
          ctx.fillStyle = PAPER; ctx.fillRect(-B.pw / 2, -B.ph / 2, B.pw, B.ph); pageLines(ctx, -B.pw / 2, -B.ph / 2, B.pw, B.ph, true, B.num, B.num); ctx.restore(); }
        else if (fixK >= .9){ const q = clamp((fixK - .9) / .6, 0, 1); drawRight(1, B.num, false); if (q < 1){ ctx.save(); ctx.translate(B.x + B.pw / 2 + (1 - eOut(q)) * 600, B.y - B.ph / 2); ctx.rotate((1 - q) * -.6); ctx.fillStyle = PAPER; ctx.fillRect(-B.pw / 2, -B.ph / 2, B.pw, B.ph); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-B.pw / 2, -B.ph / 2, B.pw, B.ph); pageLines(ctx, -B.pw / 2, -B.ph / 2, B.pw, B.ph, false, B.num, B.num); ctx.restore(); }
          if (q >= 1) { glowAt(ctx, B.x + B.pw / 2, B.y - B.ph / 2, 260, GOLD, .25 + .1 * Math.sin(t * 5)); } burstFx(ctx, B.x + B.pw / 2, B.y - B.ph / 2, fixK - 1.4, GREEN, 12, 300); }
        else if (riff >= 0){ const ph = riff % 1, n = Math.floor(riff); drawRight(1, B.num + 1, false); drawRight(Math.cos(ph * Math.PI), B.num - 8 + n, false); }
        else drawRight(1, upside ? B.num : B.num - 10, upside);
        if (t >= tFind && t < tFix){ const k = t - tFind, q = clamp(k / .5, 0, 1); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath();
          for (let a = 0; a <= q * TAU * 1.1; a += .1) ctx.lineTo(B.x + B.pw / 2 + Math.cos(a - 1) * (B.pw * .62 + Math.sin(a * 3) * 8), B.y - B.ph / 2 + Math.sin(a - 1) * (B.ph * .56)); ctx.stroke(); ctx.restore(); }
        if (t >= tNote){ const q = clamp((t - tNote) / .55, 0, 1); drawItem(ctx, "note", L + B.pw / 2 + (1 - eBack(q)) * -500, top + 150 - (1 - q) * 300, t, { s: 1.45, text: B.noteText, w: 230, h: 190 });
          for (let i = 0; i < 4; i++){ const k = (t - tNote - .5 - i * .3); if (k < 0) continue; const qq = (k % 1.6) / 1.6; ctx.save(); ctx.globalAlpha = 1 - qq; ctx.fillStyle = RED; heartMini(ctx, L + 60 + i * 60, top + 20 - qq * 160, 16); ctx.restore(); } } },
      over: (ctx2, c) => { if (t >= tFind && t < tFix + .2){ const p = c.toScreen(B.x + B.pw / 2, top - 70); popWord(ctx, B.findText || "TERBALIK!", p[0], Math.max(330, p[1]), t - tFind, { size: 92, rot: 7, hold: 1.8, col: RED }); }
        if (t >= tFix + 1.4){ const p = c.toScreen(B.x + B.pw / 2, top - 70); popWord(ctx, "BERES!", p[0], Math.max(330, p[1]), t - tFix - 1.4, { size: 92, rot: -6, hold: 1.2, col: GREEN }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.book || {}; if (B.flipCue) for (let k = 0; k < 6; k++) add(cueT(s, B.flipCue, .2, i) + k * .2, "whoosh");
    if (B.findCue) add(cueT(s, B.findCue, .4, i), "ping"); if (B.fixCue){ add(cueT(s, B.fixCue, .3, i), "whoosh"); add(cueT(s, B.fixCue, .3, i) + 1.4, "chime"); } if (B.noteCue) add(cueT(s, B.noteCue, .3, i) + .4, "pop"); });

  /* ================= _dandelion: word of mouth ================= */
  function townHouse(ctx, x, y, w, col, lit, t, j){ const h = w * .8; ctx.save(); ctx.translate(x, y);
    rr(ctx, -w / 2, -h, w, h, 6); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-w / 2 - 20, -h); ctx.lineTo(0, -h - w * .5); ctx.lineTo(w / 2 + 20, -h); ctx.closePath(); ctx.fillStyle = "#B5532E"; ctx.fill(); ol(ctx, 5);
    [[-.25, -.62], [.25, -.62]].forEach(([fx, fy], i) => { const wx = fx * w, wy = fy * h; rr(ctx, wx - w * .14, wy - w * .12, w * .28, w * .24, 4); ctx.fillStyle = lit > 0 ? "#FFE58A" : "#5B6E86"; ctx.fill(); ol(ctx, 3);
      if (lit > 0) glowAt(ctx, wx, wy, w * .5, GOLD, .5 * Math.min(1, lit)); });
    rr(ctx, -w * .1, -h * .38, w * .2, h * .38, 4); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 3);
    if (lit > 0 && lit < 1.4){ ctx.save(); ctx.globalAlpha = 1 - lit / 1.4; ctx.fillStyle = RED; heartMini(ctx, 0, -h - w * .6 - lit * 80, 22); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "dandelion", "Cerita: dandelion ditiup, benih cerita ke rumah-rumah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, D0 = Object.assign({ on: 0, houses: [[700, 1420, 170], [930, 1380, 200], [1160, 1440, 180], [1380, 1390, 210], [1600, 1430, 170], [820, 1180, 130], [1060, 1160, 140], [1290, 1180, 130], [1510, 1170, 140]] }, f.dand || {});
    const tBlow = T(s, D0.blowCue, .3, idx), N = 36; let puff = null;
    base(ctx, s, t, { env: "sky", envOpt: { hills: true },
      spots: { town: [1150, 1250, 1.0] },
      back: () => { ctx.fillStyle = "#8CC47A"; ctx.beginPath(); ctx.moveTo(500, 1700); ctx.quadraticCurveTo(900, 1050, 1800, 1150); ctx.lineTo(1800, 1700); ctx.closePath(); ctx.fill();
        D0.houses.forEach(([x, y, w], j) => { const arr = tBlow + 1.4 + (j % D0.houses.length) * .22; townHouse(ctx, x, y, w, ["#F3D9B5", "#BFE2EA", "#F6D36B", "#E8C7E8"][j % 4], t >= arr ? t - arr : -1, t, j); }); },
      over1: (ctx2, c, sts, j) => { if (j !== D0.on) return; const st = sts[j], p = handOf(st), gone = clamp((t - tBlow) / .8, 0, .95);
        const dk = (D0.s || 1.35) * st.size / 760; drawItem(ctx, "dandelion", p[0], p[1], t, { s: dk, gone }); puff = [p[0], p[1] - 300 * dk]; },
      front: () => { if (!puff || t < tBlow) return; for (let i = 0; i < N; i++){ const st0 = tBlow + i * .04, k = (t - st0) / (1.4 + (i % 9) * .22); if (k < 0) continue;
        const h = D0.houses[i % D0.houses.length], q = clamp(k, 0, 1.6), tx = h[0], ty = h[1] - h[2] * 1.1;
        const x = lerp(puff[0], tx, eOut(Math.min(q, 1))) + Math.sin(t * 3 + i) * 30, y = lerp(puff[1], ty, Math.min(q, 1)) - Math.sin(Math.min(q, 1) * Math.PI) * (200 + rnd(i) * 200) + (q > 1 ? (q - 1) * 60 : 0);
        ctx.save(); ctx.globalAlpha = q > 1 ? Math.max(0, 1 - (q - 1) * 2) : 1; ctx.translate(x, y); ctx.rotate(Math.sin(t * 4 + i) * .3);
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2.5; for (let a = 0; a < 7; a++){ const an = -Math.PI / 2 + (a - 3) * .3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an) * 34, Math.sin(an) * 34); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 26); ctx.stroke(); ctx.fillStyle = i % 3 ? "#FFFFFF" : RED; if (i % 3) { ctx.beginPath(); ctx.arc(0, 30, 6, 0, TAU); ctx.fill(); } else heartMini(ctx, 0, 32, 11); ctx.restore(); } },
      over: (ctx2, c) => { if (t >= tBlow){ const p = c.toScreen(puff ? puff[0] + 60 : 400, puff ? puff[1] - 60 : 800); popWord(ctx, "FUUH~", Math.max(240, p[0]), Math.max(360, p[1]), t - tBlow, { size: 80, rot: -10, hold: 1 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const D0 = f.dand || {}; if (D0.blowCue){ add(cueT(s, D0.blowCue, .3, i), "whoosh"); for (let k = 0; k < 5; k++) add(cueT(s, D0.blowCue, .3, i) + 1.5 + k * .45, "ping"); } });

  /* ================= _kios: service window with small extras ================= */
  TT.scene(PX + "kios", "Cerita: jendela layanan kios, tiap paket diberi sedikit lebih", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ wx: 330, gifts: [] }, f.kios || {});
    const gs = K.gifts.map((g, j) => Object.assign({ T: tOf(s, g, .2, idx) }, g));
    base(ctx, s, t, { env: "street", envOpt: { time: "day" }, midZ: 0,
      spots: { window: [K.wx + 100, 1150, 1.1] },
      back: () => { ctx.fillStyle = "#2C2433"; ctx.fillRect(K.wx - 260, GY - 720, 520, 520); ctx.fillStyle = "#4A3C52"; ctx.fillRect(K.wx - 260, GY - 720, 520, 60);
        for (let i = 0; i < 4; i++){ rr(ctx, K.wx - 230 + i * 120, GY - 640, 90, 120, 6); ctx.fillStyle = ["#F6D36B", "#BFE2EA", "#FFFFFF", "#F4A85C"][i]; ctx.fill(); } },
      mid: () => { // facade with window hole + awning + sign
        ctx.save(); ctx.beginPath(); ctx.rect(K.wx - 520, GY - 1060, 1040, 1060); ctx.rect(K.wx + 260, GY - 720, -520, 520); ctx.fillStyle = "#F3E3C8"; ctx.fill("evenodd"); ctx.restore();
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(K.wx - 260, GY - 720, 520, 520); ctx.strokeRect(K.wx - 520, GY - 1060, 1040, 1060);
        rr(ctx, K.wx - 300, GY - 220, 600, 40, 8); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#A9643B"; ctx.fillRect(K.wx - 280, GY - 180, 560, 180); ctx.strokeRect(K.wx - 280, GY - 180, 560, 180);
        for (let i = 0; i < 8; i++){ ctx.beginPath(); const x0 = K.wx - 340 + i * 85, sw = Math.sin(t * 2 + i) * 4; ctx.moveTo(x0, GY - 860); ctx.lineTo(x0 + 85, GY - 860); ctx.lineTo(x0 + 85, GY - 790 + sw); ctx.quadraticCurveTo(x0 + 42, GY - 760 + sw, x0, GY - 790 + sw); ctx.closePath(); ctx.fillStyle = i % 2 ? CREAM : ORANGE; ctx.fill(); ol(ctx, 4); }
        rr(ctx, K.wx - 280, GY - 1020, 560, 120, 18); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, K.sign || "FOTOKOPI & JILID", K.wx, GY - 940, 48, "#FFFFFF", 900, 520);
        gs.forEach((g, j) => { if (t < g.T) return; const k = t - g.T, q = clamp(k / .8, 0, 1), x = lerp(K.wx + 60, g.toX ?? (K.wx + 330 + j * 40), eOut(q)), y = lerp(GY - 300, GY - 560, q) - Math.sin(q * Math.PI) * 120;
          if (k < 1.6){ drawItem(ctx, g.item || "thesis", x, y, t, { s: .8, text: g.itemText, rot: (1 - q) * -.4 }); if (q >= 1) drawItem(ctx, "note", x + 70, y - 70, t, { s: .55 }); } }); },
      over: (ctx2, c) => { gs.forEach((g, j) => { if (t < g.T) return; const k = t - g.T, q = eBack(clamp(k / .4, 0, 1)), y = 330 + j * 95;
          ctx.save(); ctx.translate((K.chipX ?? 790) + Math.sin(t * 2 + j) * 6, y); ctx.scale(q, q); chip(ctx, (j + 1) + ". " + g.text, 0, 0, j === gs.length - 1 && k > 0 ? ORANGE : BROWN, CREAM, 36, K.chipW ?? 500); ctx.restore();
          if (k > 0 && k < 1) burstFx(ctx, K.chipX ?? 790, y, k, GOLD, 10, 200); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); ((f.kios || {}).gifts || []).forEach((g, j) => { add(tOf(s, g, .2, i), "pop"); add(tOf(s, g, .2, i) + .8, "chime"); }); });

  /* ================= SC37: street food cart at night ================= */
  function lincak(ctx, x, w, seatY){ ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, w / 2, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#C9A45C"; [-w / 2 + 30, w / 2 - 40].forEach(dx => { rr(ctx, x + dx, seatY, 16, GY - seatY, 6); ctx.fill(); ol(ctx, 3); });
    for (let i = 0; i < 4; i++){ rr(ctx, x - w / 2, seatY - 10 + i * 7, w, 9, 4); ctx.fillStyle = i % 2 ? "#D9B46A" : "#C9A45C"; ctx.fill(); } rr(ctx, x - w / 2, seatY - 12, w, 34, 6); ol(ctx, 4); }
  function cart(ctx, x, t, o){ const top = GY - 420;
    // roof poles + tarp
    ctx.fillStyle = "#7A4A2E"; [-250, 240].forEach(dx => { ctx.fillRect(x + dx, GY - 880, 14, 880 - 140); });
    for (let i = 0; i < 7; i++){ const x0 = x - 300 + i * 88, sw = Math.sin(t * 1.6 + i) * 5; ctx.beginPath(); ctx.moveTo(x0, GY - 900); ctx.lineTo(x0 + 88, GY - 900); ctx.lineTo(x0 + 88, GY - 830 + sw); ctx.quadraticCurveTo(x0 + 44, GY - 800 + sw, x0, GY - 830 + sw); ctx.closePath(); ctx.fillStyle = i % 2 ? "#2F6FB5" : "#F3E3C8"; ctx.fill(); ol(ctx, 4); }
    // lantern swinging
    const la = Math.sin(t * 1.9) * .18; ctx.save(); ctx.translate(x - 20, GY - 820); ctx.rotate(la); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
    glowAt(ctx, 0, 110, 330, "#FFD27A", .55 + .08 * Math.sin(t * 13)); rr(ctx, -34, 60, 68, 20, 6); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.ellipse(0, 112, 34, 40, 0, 0, TAU); ctx.fillStyle = "#FFF2B0"; ctx.fill(); ol(ctx, 4);
    rr(ctx, -26, 150, 52, 22, 6); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 3); ctx.restore();
    for (let i = 0; i < 4; i++){ const a = t * (3 + i) + i * 2, mx = x - 20 + Math.cos(a) * (70 + i * 14), my = GY - 700 + Math.sin(a * 1.3) * 50; ctx.fillStyle = hexA("#FFFFFF", .8); ctx.beginPath(); ctx.ellipse(mx - 5, my, 7, 4 + Math.abs(Math.sin(t * 30 + i)) * 4, .4, 0, TAU); ctx.ellipse(mx + 5, my, 7, 4 + Math.abs(Math.sin(t * 30 + i)) * 4, -.4, 0, TAU); ctx.fill(); }
    // cart body
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(x, GY + 6, 330, 20, 0, 0, TAU); ctx.fill();
    rr(ctx, x - 300, top, 600, 300, 12); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#8E4E2E"; for (let i = 0; i < 3; i++) rr(ctx, x - 280 + i * 190, top + 70, 170, 200, 10), ctx.fill();
    textC(ctx, o.sign || "ANGKRINGAN", x, top + 190, 46, "#FFE58A", 900, 520);
    [-210, 210].forEach(dx => { ctx.beginPath(); ctx.arc(x + dx, GY - 70, 66, 0, TAU); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 5); ctx.save(); ctx.translate(x + dx, GY - 70); ctx.rotate(t * .2); ctx.strokeStyle = "#C9A45C"; ctx.lineWidth = 6; for (let k = 0; k < 4; k++){ ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.stroke(); } ctx.restore(); });
    rr(ctx, x - 320, top - 24, 640, 30, 8); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5);
    // kettle + steam, rice packets, glasses
    const kx = x + 190, ky = top - 24; ctx.beginPath(); ctx.ellipse(kx, ky - 60, 70, 60, 0, Math.PI, 0); ctx.lineTo(kx + 70, ky); ctx.lineTo(kx - 70, ky); ctx.closePath(); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(kx - 60, ky - 40); ctx.lineTo(kx - 120, ky - 90); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 6; ctx.stroke();
    for (let k = 0; k < 4; k++){ const q = (t * .5 + k / 4) % 1; ctx.save(); ctx.globalAlpha = .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(kx - 124, ky - 96 - q * 120); ctx.quadraticCurveTo(kx - 150 + Math.sin(t * 2 + k) * 20, ky - 140 - q * 120, kx - 120, ky - 180 - q * 120); ctx.stroke(); ctx.restore(); }
    for (let i = 0; i < 5; i++){ const px = x - 260 + i * 62; ctx.save(); ctx.translate(px, ky); ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(0, -46); ctx.lineTo(26, 0); ctx.closePath(); ctx.fillStyle = "#C2A15A"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    for (let i = 0; i < 4; i++){ ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 10 + i * 18, ky - 4); ctx.lineTo(x + 30 + i * 18, ky - 90); ctx.stroke(); ctx.fillStyle = "#8E4E2E"; for (let j = 0; j < 3; j++){ ctx.beginPath(); ctx.arc(x + 4 + i * 18 + j * 8, ky - 30 - j * 18, 8, 0, TAU); ctx.fill(); } } }
  function teaGlass(ctx, x, y, t){ rr(ctx, x - 26, y - 70, 52, 70, 6); ctx.fillStyle = hexA("#FFFFFF", .6); ctx.fill(); ctx.fillStyle = "#B5532E"; ctx.fillRect(x - 22, y - 52, 44, 48); rr(ctx, x - 26, y - 70, 52, 70, 6); ol(ctx, 3);
    for (let k = 0; k < 2; k++){ const q = (t * .6 + k / 2) % 1; ctx.save(); ctx.globalAlpha = .55 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 6 + k * 12, y - 80 - q * 70); ctx.quadraticCurveTo(x - 20 + k * 12, y - 100 - q * 70, x - 4 + k * 12, y - 124 - q * 70); ctx.stroke(); ctx.restore(); } }
  TT.scene(PX + "angkringan", "Cerita: angkringan malam, sahabat minta pinjaman", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 560, benchX: 540, benchW: 900 }, f.cart || {});
    const tMoney = T(s, K.moneyCue, .2, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "night" },
      spots: { cart: [K.x, 1150, 1.0] },
      back: () => cart(ctx, K.x, t, { sign: K.sign }),
      under: (ctx2, c, sts, j) => { if (j === 0) { lincak(ctx, K.benchX, K.benchW, GY - 88); teaGlass(ctx, K.benchX - 40, GY - 100, t); teaGlass(ctx, K.benchX + 50, GY - 100, t + 1); } },
      over: (ctx2, c) => { if (K.moneyCue && t >= tMoney){ const k = t - tMoney, q = eBack(clamp(k / .5, 0, 1)), p = c.toScreen(K.moneyX ?? 760, K.moneyY ?? 720); ctx.save(); ctx.translate(Math.min(860, p[0]), Math.max(380, p[1])); ctx.scale(q, q);
          for (let i = 0; i < 5; i++){ ctx.save(); ctx.rotate((i - 2) * .22 + Math.sin(t * 2) * .03); ctx.translate(0, -40); bill(ctx, 230, 110, "#E06C6C", i === 4 ? "Rp1 jt" : ""); ctx.restore(); }
          ctx.restore(); popWord(ctx, K.moneyText || "Rp5 JUTA", Math.min(860, p[0]), Math.max(380, p[1]) + 140, k - .3, { size: 84, rot: 5, hold: 2.2, col: GOLD }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.cart || {}; if (K.moneyCue) add(cueT(s, K.moneyCue, .2, i), "chime"); });

  /* ================= _sobek: the savings note with a tear-off strip ================= */
  TT.scene(PX + "sobek", "Cerita: tabungan dengan sobekan 'siap direlakan'", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, N = Object.assign({ x: 650, y: 560, w: 600, strip: 190, rows: [{ text: "SEKOLAH ALYA", sub: "Rp3 jt", col: "#5B7DB1" }, { text: "DAPUR & CICILAN", sub: "Rp1 jt", col: "#7FA563" }], stripText: "SIAP DIRELAKAN", stripSub: "Rp1 jt" }, f.note || {});
    const tIn = N.inCue ? T(s, N.inCue, .2, idx) : .15, tGlow = T(s, N.glowCue, .2, idx), tTear = T(s, N.tearCue, .4, idx), tFly = T(s, N.flyCue, .3, idx), tGone = T(s, N.goneCue, .3, idx), tSafe = T(s, N.safeCue, .4, idx);
    const H0 = N.strip + N.rows.length * 230 + 40;
    base(ctx, s, t, { env: "info", envOpt: { spotX: N.x },
      spots: { note: [N.x, N.y + H0 / 2, 1.0], strip: [N.x, N.y + 120, 1.25] },
      mid: () => { const q = eBack(clamp((t - tIn) / .6, 0, 1)); if (q <= 0) return; ctx.save(); ctx.translate(N.x, N.y + H0 / 2 + Math.sin(t * 1.3) * 8); ctx.scale(q, q); ctx.rotate(Math.sin(t * .9) * .015); ctx.translate(0, -H0 / 2);
        const w = N.w, top0 = N.strip; // lower body
        rr(ctx, -w / 2, top0, w, H0 - top0, 18); ctx.fillStyle = "#EAF2DE"; ctx.fill(); ol(ctx, 7);
        N.rows.forEach((r, i) => { const y = top0 + 30 + i * 230; rr(ctx, -w / 2 + 30, y, w - 60, 200, 14); ctx.fillStyle = r.col; ctx.fill(); ol(ctx, 5);
          textC(ctx, r.text, -20, y + 92, 44, "#FFFFFF", 900, w - 200); textC(ctx, r.sub, -20, y + 156, 40, hexA("#FFFFFF", .85), 800);
          ctx.save(); ctx.translate(w / 2 - 90, y + 100); const sh = t >= tSafe ? 1 : 0; rr(ctx, -34, -10, 68, 56, 10); ctx.fillStyle = sh ? GOLD : "#F3D9B5"; ctx.fill(); ol(ctx, 4);
          ctx.beginPath(); ctx.arc(0, -10, 22, Math.PI, 0); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke(); ctx.restore(); });
        if (t >= tSafe){ glowAt(ctx, 0, H0 / 2 + 100, 520, GREEN, .25 + .1 * Math.sin(t * 4)); }
        // strip
        const tk = t - tTear, fk = t - tFly, gk = t - tGone; let sx = 0, sy = 0, sr = 0, ss = 1, sa = 1;
        if (tk > 0){ sy = -eOut(clamp(tk / .5, 0, 1)) * 80; sr = -clamp(tk / .5, 0, 1) * .12 + Math.sin(t * 3) * .03; }
        if (fk > 0){ const q2 = clamp(fk / 1.4, 0, 1); sx = eOut(q2) * 520; sy += -Math.sin(q2 * Math.PI) * 120 + q2 * -60; sr += q2 * .5; ss = 1 - q2 * .35; }
        if (gk > 0){ const q3 = clamp(gk / 1.2, 0, 1); sx = 520 + q3 * 500; sy -= q3 * 400; ss = .65 * (1 - q3); sa = 1 - q3; }
        ctx.save(); ctx.globalAlpha *= sa; ctx.translate(sx, sy + top0 / 2); ctx.rotate(sr); ctx.scale(ss, ss);
        ctx.beginPath(); ctx.moveTo(-w / 2, -top0 / 2 + 18); ctx.quadraticCurveTo(-w / 2, -top0 / 2, -w / 2 + 18, -top0 / 2); ctx.lineTo(w / 2 - 18, -top0 / 2); ctx.quadraticCurveTo(w / 2, -top0 / 2, w / 2, -top0 / 2 + 18); ctx.lineTo(w / 2, top0 / 2);
        for (let i = 0; i <= 24; i++) ctx.lineTo(w / 2 - i * w / 24, top0 / 2 + (tk > 0 ? (i % 2 ? 10 : -4) : 0)); ctx.closePath();
        ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 6); textC(ctx, N.stripText, 0, -6, 46, "#FFFFFF", 900, w - 60); textC(ctx, N.stripSub, 0, 52, 40, "#FFE58A", 900);
        ctx.restore();
        // perforation
        if (tk <= .3){ ctx.save(); const glow = t >= tGlow ? .5 + .5 * Math.sin(t * 10) : 0; ctx.setLineDash([22, 14]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = glow ? GOLD : OUT; ctx.lineWidth = glow ? 10 : 6; ctx.beginPath(); ctx.moveTo(-w / 2, top0); ctx.lineTo(w / 2, top0); ctx.stroke(); ctx.restore(); }
        else { ctx.save(); ctx.beginPath(); for (let i = 0; i <= 24; i++) ctx.lineTo(-w / 2 + i * w / 24, top0 + (i % 2 ? 10 : -4)); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
        ctx.restore(); },
      front: () => { const k = t - tTear; if (k > 0 && k < 1) burstFx(ctx, N.x, N.y + N.strip, k, GOLD, 12, 340); },
      over: (ctx2, c) => { if (t >= tFly && t < tGone + 1){ const p = c.toScreen(Math.min(N.x + 380, 1000), N.y - 40); popChip(ctx, N.lateText || "PULANG TERLAMBAT?", Math.min(760, p[0]), Math.max(320, p[1]), t - tFly - .5, ORANGE, "#FFFFFF", 46, -.05); }
        if (t >= tGone){ const p = c.toScreen(N.x + 200, N.y + 40); popChip(ctx, N.goneText || "TIDAK PULANG?", Math.min(760, p[0]), Math.max(410, p[1] + 70), t - tGone - .3, RED, "#FFFFFF", 46, .04); }
        if (t >= tSafe){ const p = c.toScreen(N.x, N.y + H0 + 90); popWord(ctx, N.safeText || "TETAP AMAN", p[0], Math.min(1230, p[1]), t - tSafe, { size: 88, rot: -4, hold: 9, col: GREEN }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const N = f.note || {}; add(N.inCue ? cueT(s, N.inCue, .2, i) : .15, "pop"); if (N.glowCue) add(cueT(s, N.glowCue, .2, i), "ping"); if (N.tearCue) add(cueT(s, N.tearCue, .4, i), "whoosh");
    if (N.flyCue) add(cueT(s, N.flyCue, .3, i), "whoosh"); if (N.goneCue) add(cueT(s, N.goneCue, .3, i), "whoosh"); if (N.safeCue) add(cueT(s, N.safeCue, .4, i), "chime"); });

  /* ================= _amplop: counting on the porch table ================= */
  TT.scene(PX + "amplop", "Cerita: lima ikat uang dihitung, satu ke amplop, empat ke kaleng sekolah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, A = Object.assign({ x: 560, w: 520, n: 5, give: 1, tinLabel: "BIAYA SEKOLAH", envText: "Fajar", noteText: "12/11 · Fajar · Rp1 jt" }, f.amp || {});
    const tCount = T(s, A.countCue, .2, idx), tLend = T(s, A.lendCue, .4, idx), tNote = T(s, A.noteCue, .3, idx), tSafe = T(s, A.safeCue, .3, idx), tPass = T(s, A.passCue, .3, idx);
    const top = GY - 300, bx = i => A.x - 170 + i * 85;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { table: [A.x, top - 120, 1.25] },
      front: () => { // table
        ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(A.x, GY + 6, A.w / 2 + 30, 18, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#7A4A2E"; [-A.w / 2 + 20, A.w / 2 - 40].forEach(dx => { rr(ctx, A.x + dx, top, 20, GY - top, 6); ctx.fill(); ol(ctx, 4); });
        rr(ctx, A.x - A.w / 2 - 20, top - 26, A.w + 40, 34, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5);
        // tin
        const tx = A.x + A.w / 2 - 40, lid = t >= tSafe + 1.3 ? 1 : 0; rr(ctx, tx - 100, top - 250, 200, 224, 16); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5);
        textC(ctx, "BIAYA", tx, top - 150, 34, "#FFFFFF", 900, 180); textC(ctx, "SEKOLAH", tx, top - 105, 34, "#FFFFFF", 900, 180);
        ctx.save(); ctx.translate(tx - 110, top - 256); ctx.rotate(lid ? 0 : -.5); rr(ctx, 0, -18, 220, 30, 8); ctx.fillStyle = "#3B5B8C"; ctx.fill(); ol(ctx, 4); ctx.restore();
        if (lid){ glowAt(ctx, tx, top - 120, 200, GREEN, .3 + .1 * Math.sin(t * 5)); }
        // envelope (left)
        const ex = A.x - A.w / 2 + 60, pk = t - tPass; if (pk < 0) drawItem(ctx, "envelope", ex, top - 80, t, { s: .95, text: A.envText });
        else if (pk < .9){ const q = eOut(pk / .9); drawItem(ctx, "envelope", lerp(ex, A.passX ?? 900, q), top - 70 - Math.sin(q * Math.PI) * 220 - q * 120, t, { s: .7, text: A.envText, rot: q * .6 }); }
        // bundles
        for (let i = 0; i < A.n; i++){ let x = bx(i) + 60, y = top - 50, sc = .72, vis = true;
          if (t < tCount + i * .3) { y += 0; }
          const toEnv = i < A.give, T1 = toEnv ? tLend + i * .25 : tSafe + (i - A.give) * .28;
          if (t >= T1){ const q = clamp((t - T1) / .55, 0, 1), dx = toEnv ? ex : tx, dy = toEnv ? top - 70 : top - 160; x = lerp(x, dx, eOut(q)); y = lerp(y, dy, q) - Math.sin(q * Math.PI) * 180; sc = .72 * (1 - q * .4); if (q >= 1) vis = false; }
          const pop = t >= tCount + i * .3 && t < tCount + i * .3 + .3 ? 1 + .25 * Math.sin((t - tCount - i * .3) / .3 * Math.PI) : 1;
          if (vis){ ctx.save(); ctx.translate(x, y); ctx.scale(sc * pop, sc * pop); drawItem(ctx, "money", 0, 0, t, { text: "Rp1 jt" }); ctx.restore(); } }
        if (t >= tNote){ const q = eBack(clamp((t - tNote) / .4, 0, 1)); ctx.save(); ctx.translate(A.x - 40, top - 10); ctx.scale(q * 1.25, q * 1.25); ctx.rotate(.05); rr(ctx, -140, -110, 280, 100, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
          const wq = clamp((t - tNote - .3) / 1.2, 0, 1); ctx.save(); ctx.beginPath(); ctx.rect(-130, -110, 260 * wq, 100); ctx.clip(); textC(ctx, A.noteText, 0, -48, 26, BROWN, 800, 250); ctx.restore(); ctx.restore(); } },
      over: (ctx2, c) => { for (let i = 0; i < A.n; i++){ const k = t - tCount - i * .3; if (k < 0 || k > 1.2) continue; const p = c.toScreen(bx(i) + 60, top - 150); popWord(ctx, String(i + 1), p[0], p[1], k, { size: 70, rot: 0, hold: 1.1, col: GOLD }); }
        if (t >= tSafe + 1.3){ const p = c.toScreen(A.x + A.w / 2 - 60, top - 330); popChip(ctx, A.safeText || "AMAN!", p[0], Math.max(330, p[1]), t - tSafe - 1.3, GREEN, "#FFFFFF", 40, -.05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.amp || {}; if (A.countCue) for (let k = 0; k < (A.n || 5); k++) add(cueT(s, A.countCue, .2, i) + k * .3, "pop");
    if (A.lendCue) add(cueT(s, A.lendCue, .4, i), "whoosh"); if (A.noteCue) add(cueT(s, A.noteCue, .3, i), "pop"); if (A.safeCue){ add(cueT(s, A.safeCue, .3, i), "whoosh"); add(cueT(s, A.safeCue, .3, i) + 1.3, "chime"); } if (A.passCue) add(cueT(s, A.passCue, .3, i), "whoosh"); });

  /* ================= MS37: neighbour's house with steps + water gallon ================= */
  function nbHouse(ctx, hx, t, doorQ){ const pf = GY - 120, wl = hx - 220, wr = hx + 420;
    ctx.fillStyle = "#F0E2C4"; ctx.fillRect(wl, pf - 760, wr - wl, 760); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(wl, pf - 760, wr - wl, 760);
    ctx.beginPath(); ctx.moveTo(wl - 80, pf - 740); ctx.lineTo((wl + wr) / 2, pf - 1000); ctx.lineTo(wr + 80, pf - 740); ctx.closePath(); ctx.fillStyle = "#B5532E"; ctx.fill(); ol(ctx, 6);
    for (let i = 0; i < 6; i++){ ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wl - 60 + i * 40, pf - 740 - i * 40); ctx.lineTo(wr + 60 - i * 40, pf - 740 - i * 40); ctx.stroke(); }
    // window with curtains
    rr(ctx, hx + 160, pf - 560, 200, 200, 8); ctx.fillStyle = "#FFE9B0"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#7FA563"; ctx.fillRect(hx + 166, pf - 554, 50 + Math.sin(t * 1.4) * 6, 188); ctx.fillRect(hx + 304 - Math.sin(t * 1.4) * 6, pf - 554, 50 + Math.sin(t * 1.4) * 6, 188);
    // door
    rr(ctx, hx - 120, pf - 420, 200, 420, 8); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFD98A"; ctx.fillRect(hx - 112, pf - 412, 184, 412);
    ctx.save(); ctx.translate(hx - 120, pf - 420); ctx.scale(1 - doorQ * .8, 1); rr(ctx, 0, 0, 200, 420, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); rr(ctx, 30, 40, 140, 150, 6); ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 4; ctx.stroke(); rr(ctx, 30, 230, 140, 150, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(170, 220, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore();
    // porch + steps
    ctx.fillStyle = "#C9B8A0"; ctx.fillRect(hx - 220, pf, wr - hx + 220, 120); ctx.strokeRect(hx - 220, pf, wr - hx + 220, 120);
    for (let i = 0; i < 3; i++){ const sx = hx - 220 - (3 - i) * 70; ctx.fillStyle = i % 2 ? "#BBA98F" : "#C9B8A0"; ctx.fillRect(sx, GY - 40 * (i + 1), 70 * (3 - i) + 0, 40 * (i + 1)); ctx.strokeRect(sx, GY - 40 * (i + 1), 70, 40 * (i + 1)); }
    // potted plants
    [hx + 110, wr - 40].forEach((px, j) => { prop(ctx, "plant", px, pf, { s: .6 }, t + j); }); }
  TT.scene(PX + "galon", "Cerita: galon dibawakan menaiki tangga rumah tetangga", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gn = Object.assign({ hx: 760, gx: 470, on: 0 }, f.galon || {});
    const tLift = T(s, Gn.liftCue, .2, idx), tIn = T(s, Gn.inCue, .5, idx), tDoor = T(s, Gn.doorCue, .1, idx), tOut = T(s, Gn.outCue, .2, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { door: [Gn.hx, 1150, 1.1] },
      back: () => nbHouse(ctx, Gn.hx, t, clamp((t - tDoor) / .5, 0, 1)),
      under: (ctx2, c, sts, j) => { if (j === 0 && t < tLift){ const wob = Math.sin(t * 9) * .05; drawItem(ctx, "galon", Gn.gx, GY - 130 * .9, t, { s: .9, rot: wob, slosh: 7 }); } },
      over1: (ctx2, c, sts, j) => { if (j !== Gn.on || t < tLift || t >= tIn) return; const st = sts[j], hp = toonHead(st), k = st.size / 760, q = eBack(clamp((t - tLift) / .45, 0, 1));
        const x = lerp(Gn.gx, hp[0] + 40 * k * (st.face || 1), q), y = lerp(GY - 120, hp[1] - 20 * k, q) + Math.sin(t * 8) * 4; drawItem(ctx, "galon", x, y, t, { s: .82 * k, rot: (st.face || 1) * .25, slosh: 9 }); },
      over: (ctx2, c) => { if (t >= tLift && t < tLift + 1.2){ const p = c.toScreen(Gn.gx, 900); popWord(ctx, "HUP!", p[0], Math.max(360, p[1]), t - tLift, { size: 96, rot: -8, hold: 1 }); }
        if (Gn.outCue && t >= tOut){ const p = c.toScreen(Gn.hx + 120, 860); popChip(ctx, Gn.outText || "MANGGA UNTUK FITRI", Math.min(800, p[0]), Math.max(340, p[1]), t - tOut - .3, ORANGE, "#FFFFFF", 36, -.04); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gn = f.galon || {}; if (Gn.liftCue) add(cueT(s, Gn.liftCue, .2, i), "whoosh"); if (Gn.doorCue) add(cueT(s, Gn.doorCue, .1, i), "pop"); if (Gn.outCue) add(cueT(s, Gn.outCue, .2, i) + .3, "chime"); });

  /* ================= _lampu: string lights switch on behind a walking toon ================= */
  TT.scene(PX + "lampu", "Cerita: lampu untai menyala satu per satu di gang senja", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Lg = Object.assign({ poles: [-160, 380, 920, 1460, 2000], on: 0, sag: 120, top: 760 }, f.lights || {});
    const tStart = Lg.startCue ? T(s, Lg.startCue, .1, idx) : (Lg.startAt ?? 0), tAll = T(s, Lg.allCue, .3, idx);
    let heroX = -1e9;
    const bulbs = []; for (let p = 0; p < Lg.poles.length - 1; p++){ const a = Lg.poles[p], b = Lg.poles[p + 1]; for (let i = 1; i < 8; i++){ const u = i / 8, x = lerp(a, b, u), y = Lg.top + 40 + Math.sin(u * Math.PI) * Lg.sag; bulbs.push([x, y, p * 8 + i]); } }
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      back: (ctx2, c, sts) => { heroX = sts[Lg.on] ? sts[Lg.on].x : -1e9;
        Lg.poles.forEach(x => { ctx.fillStyle = "#5A3A2A"; rr(ctx, x - 10, Lg.top, 20, GY - Lg.top, 6); ctx.fill(); ol(ctx, 4); });
        for (let p = 0; p < Lg.poles.length - 1; p++){ const a = Lg.poles[p], b = Lg.poles[p + 1]; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(a, Lg.top + 40); ctx.quadraticCurveTo((a + b) / 2, Lg.top + 40 + Lg.sag * 2, b, Lg.top + 40); ctx.stroke(); }
        bulbs.forEach(([x, y, j]) => { const sw = Math.sin(t * 2 + j) * 3, lit = t >= tAll + j * .02 || (t >= tStart && heroX + 80 > x) ? 1 : 0, col = [GOLD, "#F08C2E", "#E86FA0", "#7FD1E0"][j % 4];
          if (lit){ glowAt(ctx, x + sw, y + 30, 70, col, .55 + .2 * Math.sin(t * 6 + j)); }
          ctx.fillStyle = OUT; ctx.fillRect(x - 5 + sw, y, 10, 12); ctx.beginPath(); ctx.ellipse(x + sw, y + 30, 14, 20, 0, 0, TAU); ctx.fillStyle = lit ? col : "#6B6070"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); }); },
      over1: (ctx2, c, sts, j) => { if (j !== Lg.on || !Lg.bag) return; const st = sts[j], p = handOf(st); drawItem(ctx, "mangoes", p[0], p[1] + 40 * st.size / 760, t, { s: .8 * st.size / 760 }); },
      front: (ctx2, c, sts) => { const st = sts[Lg.on]; if (!st || t < tAll) return; const hp = toonHead(st);
        for (let i = 0; i < 8; i++){ const k = ((t - tAll) * .6 + i / 8) % 1; ctx.save(); ctx.globalAlpha = Math.sin(k * Math.PI); ctx.fillStyle = i % 2 ? RED : "#F08C2E"; heartMini(ctx, hp[0] + Math.sin(i * 2.3 + t) * 160, hp[1] - 60 - k * 360, 18 + (i % 3) * 6); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Lg = f.lights || {}; if (Lg.startCue) for (let k = 0; k < 6; k++) add(cueT(s, Lg.startCue, .1, i) + .6 + k * .8, "ping"); if (Lg.allCue) add(cueT(s, Lg.allCue, .3, i), "chime"); });

  /* ================= _mangga: mango slices fly to the kids ================= */
  TT.scene(PX + "mangga", "Cerita: mangga dipotong di teras, potongan terbang ke anak-anak", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ x: 470, slices: [] }, f.mango || {});
    const tChop = T(s, M.chopCue, .2, idx), top = GY - 190;
    const sl = M.slices.map((q, j) => Object.assign({ T: tOf(s, q, .2 + j * .25, idx) }, q));
    base(ctx, s, t, { env: "home", envOpt: { lampX: 900 },
      spots: { table: [M.x, top - 100, 1.25] },
      front: (ctx2, c, sts) => { ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(M.x, GY + 4, 260, 16, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#7A4A2E"; [-200, 180].forEach(dx => { rr(ctx, M.x + dx, top, 20, GY - top, 5); ctx.fill(); ol(ctx, 3); }); rr(ctx, M.x - 240, top - 24, 480, 30, 8); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.ellipse(M.x, top - 30, 170, 34, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
        const left = Math.max(0, 4 - sl.filter(q => t >= q.T).length); for (let i = 0; i < Math.min(left, 4); i++) drawMango(ctx, M.x - 90 + i * 60, top - 54 - (i % 2) * 14, .95, t, i);
        if (t >= tChop){ for (let i = 0; i < 6; i++){ const k = t - tChop - i * .15; if (k < 0 || k > .6) continue; ctx.save(); ctx.globalAlpha = 1 - k / .6; ctx.fillStyle = "#FFD27A"; ctx.beginPath(); ctx.arc(M.x - 40 + Math.cos(i * 1.7) * 160 * k, top - 80 - 200 * k + 300 * k * k, 8, 0, TAU); ctx.fill(); ctx.restore(); } }
        sl.forEach((q, j) => { const k = t - q.T; if (k < 0) return; const st = sts[q.to]; if (!st) return; const hp = handOf(st), d = .7, u = clamp(k / d, 0, 1);
          const x = lerp(M.x - 60 + j * 40, hp[0], eOut(u)), y = lerp(top - 70, hp[1], u) - Math.sin(u * Math.PI) * 300;
          ctx.save(); ctx.translate(x, y); ctx.rotate(u < 1 ? k * 12 : Math.sin(t * 3 + j) * .2); ctx.scale(u < 1 ? 1 : 1, 1);
          ctx.beginPath(); ctx.moveTo(-36, 10); ctx.quadraticCurveTo(0, -40, 36, 10); ctx.closePath(); ctx.fillStyle = "#F6B33B"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#FFD27A";
          for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) ctx.fillRect(-20 + a * 14, -14 + b * 12, 10, 9); ctx.restore(); }); },
      over: (ctx2, c, sts) => { (M.laughs || []).forEach((w, j) => { const k = t - tOf(s, w, .3 + j * .2, idx); const st = sts[w.on]; if (!st) return; const hp = toonHead(st), p = c.toScreen(hp[0], hp[1] - st.size * .3);
        popWord(ctx, w.text || "HAHA!", clamp(p[0], 200, 880), Math.max(330, p[1]), k, { size: 72, rot: j % 2 ? 8 : -8, hold: 1.4, col: j % 2 ? GOLD : HL }); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.mango || {}; if (M.chopCue) for (let k = 0; k < 4; k++) add(cueT(s, M.chopCue, .2, i) + k * .18, "pop"); (M.slices || []).forEach((q, j) => add(tOf(s, q, .2 + j * .25, i), "whoosh")); (M.laughs || []).forEach((w, j) => add(tOf(s, w, .3 + j * .2, i), "pop")); });

  /* ================= _keranjang: a basket at the door gets a name tag and small gifts ================= */
  function basket(ctx, x, y, t, glow){ ctx.save(); ctx.translate(x, y); if (glow > 0) glowAt(ctx, 0, -90, 320, GOLD, .45 * glow);
    ctx.strokeStyle = "#8E5A2E"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, -150, 150, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-190, -160); ctx.lineTo(190, -160); ctx.lineTo(150, 0); ctx.lineTo(-150, 0); ctx.closePath(); ctx.fillStyle = "#C9A45C"; ctx.fill(); ctx.save(); ctx.clip();
    ctx.strokeStyle = "#A87F3E"; ctx.lineWidth = 7; for (let i = -12; i < 12; i++){ ctx.beginPath(); ctx.moveTo(i * 30, -170); ctx.lineTo(i * 30 + 40, 10); ctx.stroke(); } for (let k = 0; k < 5; k++){ ctx.beginPath(); ctx.moveTo(-200, -140 + k * 32); ctx.lineTo(200, -140 + k * 32); ctx.stroke(); } ctx.restore();
    ctx.beginPath(); ctx.moveTo(-190, -160); ctx.lineTo(190, -160); ctx.lineTo(150, 0); ctx.lineTo(-150, 0); ctx.closePath(); ol(ctx, 6); rr(ctx, -200, -176, 400, 26, 12); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
  function veg(ctx, kind, x, y, s, t, i){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 2 + i) * .06);
    if (kind === "carrot"){ ctx.beginPath(); ctx.moveTo(-18, -60); ctx.lineTo(18, -60); ctx.lineTo(0, 60); ctx.closePath(); ctx.fillStyle = "#F08C2E"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#5E9C4E"; for (let k = -1; k <= 1; k++){ ctx.beginPath(); ctx.ellipse(k * 10, -78, 7, 22, k * .4, 0, TAU); ctx.fill(); } }
    else if (kind === "leaf"){ ctx.fillStyle = "#5E9C4E"; for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.ellipse(k * 16, -40, 18, 54, k * .25, 0, TAU); ctx.fill(); ol(ctx, 3); } ctx.fillStyle = "#EAF2DE"; rr(ctx, -16, -10, 32, 50, 8); ctx.fill(); ol(ctx, 3); }
    else drawMango(ctx, 0, 0, 1.2, t, i); ctx.restore(); }
  TT.scene(PX + "keranjang", "Cerita: keranjang bantuan di depan pintu diberi label nama", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bk = Object.assign({ x: 700, doorX: 930, on: 0, name: "Bu Tini", help: "antar sayur", items: [] }, f.bask || {});
    const tW = T(s, Bk.writeCue, .2, idx), tTie = T(s, Bk.tieCue, .3, idx), tDone = T(s, Bk.doneCue, .3, idx);
    const its = Bk.items.map((q, j) => Object.assign({ T: tOf(s, q, .3 + j * .15, idx) }, q));
    const stoolTop = GY - 230, bY = stoolTop;
    let paper = null;
    base(ctx, s, t, { env: "night", envOpt: {},
      spots: { basket: [Bk.x, bY - 120, 1.25] },
      back: () => { // house front: wall, door, lamp
        ctx.fillStyle = "#6B4A3A"; ctx.fillRect(Bk.doorX - 330, GY - 980, 900, 980); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(Bk.doorX - 330, GY - 980, 900, 980);
        for (let i = 0; i < 9; i++){ ctx.strokeStyle = hexA(OUT, .2); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(Bk.doorX - 330, GY - 980 + i * 110); ctx.lineTo(Bk.doorX + 570, GY - 980 + i * 110); ctx.stroke(); }
        rr(ctx, Bk.doorX - 110, GY - 560, 220, 560, 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); rr(ctx, Bk.doorX - 80, GY - 520, 160, 200, 6); ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 4; ctx.stroke(); rr(ctx, Bk.doorX - 80, GY - 280, 160, 230, 6); ctx.stroke();
        ctx.beginPath(); ctx.arc(Bk.doorX + 80, GY - 280, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
        const lx = Bk.doorX - 190, ly = GY - 640; glowAt(ctx, lx, ly, 360, "#FFD27A", .5 + .06 * Math.sin(t * 11)); rr(ctx, lx - 24, ly - 40, 48, 70, 8); ctx.fillStyle = "#FFF2B0"; ctx.fill(); ol(ctx, 4); rr(ctx, lx - 30, ly - 52, 60, 16, 4); ctx.fillStyle = "#2C2433"; ctx.fill();
        for (let i = 0; i < 3; i++){ const a = t * (3 + i) + i * 2, mx = lx + Math.cos(a) * (60 + i * 12), my = ly + Math.sin(a * 1.3) * 40; ctx.fillStyle = hexA("#FFFFFF", .8); ctx.beginPath(); ctx.ellipse(mx, my, 6, 3 + Math.abs(Math.sin(t * 30 + i)) * 4, .4, 0, TAU); ctx.fill(); }
        // doormat
        rr(ctx, Bk.doorX - 150, GY - 14, 300, 28, 10); ctx.fillStyle = "#B5532E"; ctx.fill(); ol(ctx, 4); },
      mid: () => { // stool + basket + items + tag
        ctx.fillStyle = "#7A4A2E"; [-90, 70].forEach(dx => { rr(ctx, Bk.x + dx, stoolTop, 20, GY - stoolTop, 5); ctx.fill(); ol(ctx, 3); }); rr(ctx, Bk.x - 120, stoolTop - 10, 240, 26, 8); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 4);
        const glow = t >= tDone ? clamp((t - tDone) / .5, 0, 1) : 0;
        its.forEach((q, j) => { const k = t - q.T; if (k < 0) return; const u = clamp(k / .55, 0, 1), x = Bk.x - 100 + j * 100, y0 = bY - 560, y1 = bY - 150 - (j % 2) * 20;
          const y = u < 1 ? lerp(y0, y1, u * u) : y1 - Math.abs(Math.sin((k - .55) * 9)) * 30 * Math.exp(-(k - .55) * 5); veg(ctx, q.kind, x, y, 1, t, j); });
        basket(ctx, Bk.x, bY, t, glow);
        if (t >= tTie + .6){ const k = t - tTie - .6, sw = Math.sin(k * 5) * .4 * Math.exp(-k * .9) + Math.sin(t * 2) * .05; ctx.save(); ctx.translate(Bk.x + 120, bY - 290); ctx.rotate(sw);
          ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 50); ctx.stroke(); rr(ctx, -110, 50, 220, 120, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
          textC(ctx, Bk.name, 0, 100, 36, BROWN, 900, 200); textC(ctx, Bk.help, 0, 145, 28, ORANGE, 800, 200); ctx.restore(); } },
      over1: (ctx2, c, sts, j) => { if (j !== Bk.on) return; const st = sts[j], hp = handOf(st), k = st.size / 760;
        if (t >= tW && t < tTie + .6){ const wq = clamp((t - tW) / 1.3, 0, 1), fly = clamp((t - tTie) / .6, 0, 1), from = [hp[0] + 40 * k, hp[1] - 40 * k], to = [Bk.x + 120, bY - 230];
          const x = lerp(from[0], to[0], easeIO(fly)), y = lerp(from[1], to[1], easeIO(fly)) - Math.sin(fly * Math.PI) * 160; ctx.save(); ctx.translate(x, y); ctx.rotate(-.06 + fly * 6.28);
          rr(ctx, -110 * k, -70 * k, 220 * k, 130 * k, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.rect(-100 * k, -70 * k, 200 * k * wq, 130 * k); ctx.save(); ctx.clip();
          textC(ctx, Bk.name, 0, -12 * k, 34 * k, BROWN, 900); textC(ctx, Bk.help, 0, 34 * k, 26 * k, ORANGE, 800); ctx.restore(); ctx.restore(); } },
      front: () => { const k = t - tDone; if (k > 0 && k < 1) burstFx(ctx, Bk.x, bY - 120, k, HL, 14, 300);
        if (t >= tDone){ for (let i = 0; i < 6; i++){ const q = ((t - tDone) * .5 + i / 6) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.fillStyle = i % 2 ? RED : "#F08C2E"; heartMini(ctx, Bk.x - 150 + i * 60, bY - 300 - q * 300, 16 + (i % 3) * 5); ctx.restore(); } } },
      over: (ctx2, c) => { if (t >= tDone){ const p = c.toScreen(Bk.x, bY - 560); popChip(ctx, Bk.doneText || "SIAP MINGGU DEPAN", clamp(p[0], 300, 780), Math.max(360, p[1]), t - tDone - .2, GREEN, "#FFFFFF", 40, -.04); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bk = f.bask || {}; if (Bk.writeCue) add(cueT(s, Bk.writeCue, .2, i), "pop"); if (Bk.tieCue) { add(cueT(s, Bk.tieCue, .3, i), "whoosh"); add(cueT(s, Bk.tieCue, .3, i) + .6, "pop"); }
    (Bk.items || []).forEach((q, j) => add(tOf(s, q, .3 + j * .15, i) + .55, "pop")); if (Bk.doneCue) add(cueT(s, Bk.doneCue, .3, i), "chime"); });

  /* ================= SB38: giant numeral blocks ================= */
  function numBlock(ctx, txt, x, y, size, col, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(o.sx || 1, o.sy || 1); font(ctx, 900, size, FAM); ctx.textAlign = "center"; ctx.lineJoin = "round";
    const d = size * .12; for (let i = Math.round(d); i > 0; i -= 3){ ctx.fillStyle = o.side || "#8E4E2E"; ctx.fillText(txt, i * .7, -i * .5); }
    ctx.lineWidth = size * .035; ctx.strokeStyle = OUT; ctx.strokeText(txt, 0, 0); ctx.fillStyle = col; ctx.fillText(txt, 0, 0);
    ctx.fillStyle = hexA("#FFFFFF", .25); ctx.fillText(txt, -size * .012, -size * .012); ctx.fillStyle = col; ctx.fillText(txt, 0, size * .012 > 3 ? 3 : 0);
    if (o.hat){ const w = ctx.measureText(txt).width; ctx.save(); ctx.translate(w * .05, -size * .78); ctx.rotate(.15 + Math.sin(t * 3) * .08); ctx.beginPath(); ctx.moveTo(-size * .14, 0); ctx.lineTo(0, -size * .34); ctx.lineTo(size * .14, 0); ctx.closePath();
      ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(0, -size * .34, size * .04, 0, TAU); ctx.fill(); ctx.restore(); }
    if (o.star){ ctx.save(); ctx.translate(size * .12, -size * .38); ctx.rotate(-.2); ctx.scale(o.star, o.star); ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? size * .05 : size * .12; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    ctx.textAlign = "left"; ctx.restore(); }
  TT.scene(PX + "angka", "Cerita: balok angka raksasa (berat / dirayakan)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, N = Object.assign({ mode: "berat", big: "12", small: "3", x: 720, on: 0, seq: [] }, f.num || {});
    const tDrop = T(s, N.dropCue, .3, idx), tShadow = T(s, N.shadowCue, .3, idx), tSlam = T(s, N.slamCue, .4, idx), tStar = T(s, N.starCue, .3, idx);
    const seq = N.seq.map((q, j) => Object.assign({ T: tOf(s, q, .3, idx) }, q));
    const ra = N.mode === "rayakan";
    base(ctx, s, t, { env: N.env || (ra ? "park" : "home"), envOpt: Object.assign(ra ? { time: "day", bench: false } : { lampX: 900 }, N.envOpt || {}),
      spots: { big: [N.x, 1050, 1.0] },
      back: (ctx2, c, sts) => { if (ra){ // far, friendly 12 on a hill with a flag
          ctx.fillStyle = "#7FB86A"; ctx.beginPath(); ctx.ellipse(N.farX ?? 1180, GY - 40, 420, 160, 0, Math.PI, 0); ctx.fill(); numBlock(ctx, N.big, N.farX ?? 1180, GY - 170, 220, "#F3D9B5", t, {});
          ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo((N.farX ?? 1180) + 120, GY - 330); ctx.lineTo((N.farX ?? 1180) + 120, GY - 480); ctx.stroke(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo((N.farX ?? 1180) + 120, GY - 480); ctx.lineTo((N.farX ?? 1180) + 210, GY - 455 + Math.sin(t * 5) * 8); ctx.lineTo((N.farX ?? 1180) + 120, GY - 430); ctx.closePath(); ctx.fill(); ol(ctx, 3); return; }
        if (t < tDrop) return; const q = clamp((t - tDrop) / .5, 0, 1), y = lerp(-700, GY - 30, q * q), land = t - tDrop - .5, sq = land > 0 && land < .5 ? Math.sin(land / .5 * Math.PI) * .12 : 0;
        numBlock(ctx, N.big, N.x, y, N.bigSize || 900, "#E9DCC6", t, { sx: 1 + sq, sy: 1 - sq, side: "#6B5A4A" });
        if (land > 0 && land < 1){ for (let i = 0; i < 10; i++){ const a = Math.PI + i / 9 * Math.PI, r = 120 + land * 420; ctx.save(); ctx.globalAlpha = 1 - land; ctx.fillStyle = "#D9C7A8"; ctx.beginPath(); ctx.arc(N.x + Math.cos(a) * r, GY - 20 + Math.sin(a) * r * .25, 40 * (1 - land) + 10, 0, TAU); ctx.fill(); ctx.restore(); } } },
      front: (ctx2, c, sts) => { const st = sts[N.on];
        if (!ra){ if (t >= tShadow){ const q = clamp((t - tShadow) / 1.2, 0, 1); ctx.save(); ctx.globalAlpha = .5 * q; ctx.fillStyle = "#1B1230"; ctx.beginPath(); ctx.moveTo(N.x - 300, GY + 40); ctx.lineTo(N.x - 300 - 900 * q, GY + 40); ctx.lineTo(N.x - 300 - 900 * q, GY - 1100); ctx.lineTo(N.x - 300, GY - 800); ctx.closePath(); ctx.fill(); ctx.restore(); }
          if (st){ const hop = Math.abs(Math.sin(t * 3)) * 16; numBlock(ctx, N.small, st.x + 190, GY - 10 - hop, 170, "#F6D36B", t, { side: "#B5793D" }); } }
        else { let cur = N.small, size = 260, k0 = -9; seq.forEach(q => { if (t >= q.T){ cur = q.n; size = q.size || size + 90; k0 = t - q.T; } });
          const pop = k0 >= 0 && k0 < .5 ? 1 + .3 * Math.sin(k0 / .5 * Math.PI) : 1, hop = Math.abs(Math.sin(t * 4)) * 20;
          numBlock(ctx, cur, N.x, GY - 10 - hop, size * pop, "#F6D36B", t, { side: "#B5793D", hat: seq.length && t >= seq[0].T, star: t >= tStar ? eBack(clamp((t - tStar) / .35, 0, 1)) : 0 });
          if (k0 >= 0 && k0 < 1) burstFx(ctx, N.x, GY - size * .45, k0, HL, 14, size * 1.3); } },
      over: (ctx2, c) => { if (!ra && t >= tDrop + .5){ const p = c.toScreen(N.x, GY - (N.bigSize || 900) * .85); popWord(ctx, "BUUM!", p[0], Math.max(360, p[1]), t - tDrop - .5, { size: 110, rot: -7, hold: 1 }); }
        if (!ra && N.slamCue && t >= tSlam){ const p = c.toScreen(N.slamX ?? 460, GY - 600); popWord(ctx, "BRAK!", p[0], Math.max(360, p[1]), t - tSlam, { size: 90, rot: 8, hold: 1.1, col: RED }); }
        if (ra) seq.forEach((q, j) => { if (t >= q.T && j) { const p = c.toScreen(N.x, GY - (q.size || 400) * 1.1); popWord(ctx, q.n + " MODUL!", p[0] + (j % 2 ? -120 : 120), Math.max(380, p[1]), t - q.T, { size: 84, rot: j % 2 ? 6 : -6, hold: .9, col: GOLD }); } }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const N = f.num || {}; if (N.dropCue){ add(cueT(s, N.dropCue, .3, i), "whoosh"); add(cueT(s, N.dropCue, .3, i) + .5, "pop"); } if (N.slamCue) add(cueT(s, N.slamCue, .4, i), "pop");
    if (N.shadowCue) add(cueT(s, N.shadowCue, .3, i), "whoosh"); if (N.starCue) add(cueT(s, N.starCue, .3, i), "pop"); (N.seq || []).forEach(q => add(tOf(s, q, .3, i), "chime")); });

  /* ================= _redup: the motivation lamp dims, hole puncher punches the week ================= */
  TT.scene(PX + "redup", "Cerita: lampu semangat meredup, pelubang kertas melubangi jadwal", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, L = Object.assign({ lampX: 560, deskX: 760, days: ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"], punches: [], sx: 140, sy: 640, poster: "TARGET\n12 MODUL", posterX: 990 }, f.lamp || {});
    const tDim = T(s, L.dimCue, .3, idx), tStare = T(s, L.stareCue, .3, idx);
    const pc = L.punches.map((p, j) => Object.assign({ T: tOf(s, p, .3 + j * .1, idx) }, p));
    let bri = 1; if (t >= tDim) bri = lerp(1, L.minB ?? .2, clamp((t - tDim) / 2.4, 0, 1)); const fl = t >= tDim - .6 && (Math.sin(t * 37) > .6 || Math.sin(t * 23) > .85) ? .45 : 0; bri = Math.max(0, bri - fl * bri);
    const bw = 102, dx = i => L.sx + i * (bw + 8);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { lamp: [L.lampX, 1100, 1.2], week: [540, L.sy + 60, 1.2] },
      back: () => { // week strip
        rr(ctx, L.sx - 20, L.sy - 20, 7 * (bw + 8) + 32, 150, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
        L.days.forEach((d, i) => { const x = dx(i); rr(ctx, x, L.sy, bw, 110, 8); ctx.fillStyle = "#F3E6D2"; ctx.fill(); ol(ctx, 3); textC(ctx, d, x + bw / 2, L.sy + 40, 26, BROWN, 900);
          const hole = pc.find(p => p.day === i && t >= p.T + .25); if (hole){ ctx.beginPath(); ctx.arc(x + bw / 2, L.sy + 76, 26, 0, TAU); ctx.fillStyle = "#6B5A4A"; ctx.fill(); ol(ctx, 3); }
          else if ((L.done || []).includes(i)){ ctx.strokeStyle = GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 28, L.sy + 76); ctx.lineTo(x + 46, L.sy + 94); ctx.lineTo(x + 76, L.sy + 58); ctx.stroke(); } });
        // poster
        const pq = t >= tStare ? 1 + .06 * Math.sin(t * 6) : 1; ctx.save(); ctx.translate(L.posterX, 1010); ctx.scale(pq, pq); ctx.rotate(.04); rr(ctx, -150, -150, 300, 300, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
        textC(ctx, "TARGET", 0, -78, 40, ORANGE, 900); numBlock(ctx, "12", 0, 70, 150, "#F6D36B", t, { side: "#B5793D" }); textC(ctx, "MODUL", 0, 120, 30, BROWN, 900); ctx.restore();
        if (t >= tStare){ glowAt(ctx, L.posterX, 1010, 260, RED, .2 + .1 * Math.sin(t * 6)); } },
      mid: () => { prop(ctx, "desk", L.deskX, GY, { laptop: true, lx: 60, papers: 4 }, t);
        // lamp on the desk
        const bx = L.lampX, by = GY - 290; ctx.fillStyle = "#3B4A6B"; rr(ctx, bx - 60, by - 24, 120, 24, 8); ctx.fill(); ol(ctx, 4); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(bx, by - 20); ctx.lineTo(bx - 40, by - 220); ctx.lineTo(bx + 60, by - 330); ctx.stroke(); ctx.strokeStyle = "#5B7DB1"; ctx.lineWidth = 9; ctx.stroke();
        ctx.save(); ctx.translate(bx + 60, by - 330); ctx.rotate(.5); ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(70, 0); ctx.lineTo(40, -70); ctx.lineTo(-40, -70); ctx.closePath(); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.ellipse(0, 4, 40, 18, 0, 0, TAU); ctx.fillStyle = bri > .1 ? hexA("#FFF6C8", .4 + .6 * bri) : "#7A7466"; ctx.fill(); ol(ctx, 3); ctx.restore();
        ctx.save(); ctx.globalAlpha = .45 * bri; ctx.fillStyle = "#FFF2B0"; ctx.beginPath(); ctx.moveTo(bx + 40, by - 300); ctx.lineTo(bx + 100, by - 360); ctx.lineTo(bx + 460, by); ctx.lineTo(bx - 120, by); ctx.closePath(); ctx.fill(); ctx.restore();
        chip(ctx, L.lampLabel || "SEMANGAT", bx, by + 30, bri > .5 ? ORANGE : "#8A8A8A", "#FFFFFF", 26); },
      front: () => { ctx.save(); ctx.fillStyle = hexA("#1B1230", .5 * (1 - bri)); ctx.fillRect(-600, -400, 2400, 2600); ctx.restore();
        pc.forEach((p, j) => { const k = t - p.T; if (k < -0.5 || k > 1.4) return; const x = dx(p.day) + bw / 2, down = k < 0 ? -1 + (k + .5) * 2 * .7 : (k < .25 ? lerp(-.3, 0, k / .25) : (k < .6 ? 0 : -(k - .6) * 1.6));
          const py = L.sy + 10 + down * 300; ctx.save(); ctx.translate(x, py); // giant hole puncher
          rr(ctx, -110, -200, 220, 60, 20); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); rr(ctx, -40, -150, 80, 150, 10); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5); rr(ctx, -30, -10, 60, 20, 6); ctx.fillStyle = "#4A4A52"; ctx.fill(); ctx.restore();
          if (k > .25 && k < 1.4){ const q = (k - .25) / 1.15; ctx.save(); ctx.globalAlpha = 1 - q; ctx.fillStyle = "#F3E6D2"; ctx.beginPath(); ctx.arc(x + q * 60, L.sy + 76 + q * q * 700, 24, 0, TAU); ctx.fill(); ol(ctx, 2); ctx.restore(); } }); },
      over: (ctx2, c) => { pc.forEach((p, j) => { const k = t - p.T - .25; if (k < 0) return; const pt = c.toScreen(dx(p.day) + bw / 2, L.sy - 70); popWord(ctx, p.text || "BOLONG!", pt[0], Math.max(330, pt[1]), k, { size: 66, rot: j % 2 ? 8 : -8, hold: .9, col: RED }); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const L = f.lamp || {}; if (L.dimCue) add(cueT(s, L.dimCue, .3, i), "whoosh"); if (L.stareCue) add(cueT(s, L.stareCue, .3, i), "ping"); (L.punches || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i) + .25, "pop")); });

  /* ================= _otak: reward tokens light up the brain ================= */
  function brainShape(ctx, r, t, wob){ ctx.beginPath(); for (let i = 0; i <= 40; i++){ const a = i / 40 * TAU, rr0 = r * (1 + .06 * Math.sin(a * 7 + t * 2) * wob + .04 * Math.sin(a * 3)); ctx.lineTo(Math.cos(a) * rr0 * 1.18, Math.sin(a) * rr0 * .9); } ctx.closePath(); }
  TT.scene(PX + "otak", "Cerita: otak menerima tanda hadiah lalu menyalakan bohlam semangat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bn = Object.assign({ x: 620, y: 960, r: 230, bulbX: 860, bulbY: 600, tokens: [], from: 0 }, f.brain || {});
    const tIn = Bn.inCue ? T(s, Bn.inCue, .2, idx) : .1, tLight = T(s, Bn.lightCue, .3, idx), tFar = T(s, Bn.farCue, .3, idx);
    const tks = Bn.tokens.map((q, j) => Object.assign({ T: tOf(s, q, .3 + j * .15, idx) }, q));
    const hits = tks.filter(q => t >= q.T + .7).length, lastHit = tks.filter(q => t >= q.T + .7).map(q => t - q.T - .7).pop() ?? 9;
    base(ctx, s, t, { env: "info", envOpt: { spotX: Bn.x },
      spots: { brain: [Bn.x, Bn.y, 1.15], bulb: [Bn.bulbX, Bn.bulbY + 80, 1.3] },
      mid: (ctx2, c, sts) => { const q = eBack(clamp((t - tIn) / .6, 0, 1)); if (q <= 0) return; const lit = t >= tLight ? clamp((t - tLight) / .5, 0, 1) : 0;
        // cable to bulb
        ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(Bn.x + Bn.r * .9, Bn.y - Bn.r * .4); ctx.bezierCurveTo(Bn.x + Bn.r * 1.4, Bn.y - Bn.r, Bn.bulbX - 60, Bn.bulbY + 300, Bn.bulbX, Bn.bulbY + 140); ctx.stroke();
        if (lit > 0){ for (let i = 0; i < 4; i++){ const u = ((t * 1.5 + i / 4) % 1); const x = (1 - u) ** 3 * (Bn.x + Bn.r * .9) + 3 * (1 - u) ** 2 * u * (Bn.x + Bn.r * 1.4) + 3 * (1 - u) * u * u * (Bn.bulbX - 60) + u ** 3 * Bn.bulbX;
          const y = (1 - u) ** 3 * (Bn.y - Bn.r * .4) + 3 * (1 - u) ** 2 * u * (Bn.y - Bn.r) + 3 * (1 - u) * u * u * (Bn.bulbY + 300) + u ** 3 * (Bn.bulbY + 140); glowAt(ctx, x, y, 40, GOLD, .8); } }
        // bulb
        ctx.save(); ctx.translate(Bn.bulbX, Bn.bulbY); if (lit > 0){ glowAt(ctx, 0, 0, 330, GOLD, .55 * lit + .1 * Math.sin(t * 6)); ctx.strokeStyle = hexA(GOLD, lit); ctx.lineWidth = 10; ctx.lineCap = "round";
          for (let i = 0; i < 10; i++){ const a = i / 10 * TAU + t * .3, r0 = 150 + 10 * Math.sin(t * 8 + i); ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); ctx.lineTo(Math.cos(a) * (r0 + 50), Math.sin(a) * (r0 + 50)); ctx.stroke(); } }
        ctx.beginPath(); ctx.arc(0, -10, 110, Math.PI * .8, Math.PI * 2.2); ctx.lineTo(45, 110); ctx.lineTo(-45, 110); ctx.closePath(); ctx.fillStyle = lit > 0 ? hexA("#FFF2B0", .6 + .4 * lit) : "#D8D2C4"; ctx.fill(); ol(ctx, 6);
        rr(ctx, -50, 110, 100, 60, 10); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5); textC(ctx, Bn.bulbLabel || "SEMANGAT", 0, 8, 30, lit > 0 ? ORANGE : "#8A8296", 900, 180); ctx.restore();
        // brain
        const pulse = lastHit < .5 ? Math.sin(lastHit / .5 * Math.PI) * .12 : 0; ctx.save(); ctx.translate(Bn.x, Bn.y + Math.sin(t * 1.6) * 10); ctx.scale(q * (1 + pulse), q * (1 - pulse * .6));
        const glow = Math.min(1, hits / Math.max(1, tks.length)); if (glow > 0) glowAt(ctx, 0, 0, Bn.r * 2.2, "#FF9BC0", .3 * glow);
        brainShape(ctx, Bn.r, t, 1); ctx.fillStyle = glow > 0 ? "#F7A8C4" : "#D9A3B5"; ctx.fill(); ol(ctx, 7);
        ctx.strokeStyle = hexA("#B5577A", .7); ctx.lineWidth = 7; ctx.lineCap = "round"; for (let i = 0; i < 6; i++){ ctx.beginPath(); const y0 = -Bn.r * .55 + i * Bn.r * .2; ctx.moveTo(-Bn.r * .9, y0); for (let x = -Bn.r * .9; x < Bn.r * .9; x += 20) ctx.lineTo(x, y0 + Math.sin(x * .05 + i + t) * 14); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(0, -Bn.r * .85); ctx.quadraticCurveTo(14, 0, 0, Bn.r * .8); ctx.stroke();
        // face
        const happy = hits > 0; [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * Bn.r * .32, Bn.r * .05); if (happy){ ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, 10, 26, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
          else { ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 6, 14, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#D9A3B5"; ctx.fillRect(-34, -34, 68, 30 + Math.max(0, Math.sin(t * .8)) * 4); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-32, -4); ctx.lineTo(32, -4); ctx.stroke(); } ctx.restore(); });
        ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); if (happy) ctx.arc(0, Bn.r * .3, 40, .15 * Math.PI, .85 * Math.PI); else { ctx.moveTo(-26, Bn.r * .42); ctx.lineTo(26, Bn.r * .42); } ctx.stroke();
        ctx.restore();
        // tokens
        tks.forEach((tk, j) => { const k = t - tk.T; if (k < 0 || k > .75) return; const st = sts[Bn.from], from = st ? handOf(st) : [120, 1100], u = clamp(k / .7, 0, 1);
          const x = lerp(from[0], Bn.x, easeIO(u)), y = lerp(from[1], Bn.y, u) - Math.sin(u * Math.PI) * 260; ctx.save(); ctx.translate(x, y); ctx.rotate(u * 4); tokenIcon(ctx, tk.kind, 1.1); ctx.restore(); }); },
      over: (ctx2, c) => { tks.forEach((tk, j) => { const k = t - tk.T - .7; if (k < 0) return; const p = c.toScreen(Bn.x + (j - 1) * 220, Bn.y - Bn.r - 120); popChip(ctx, tk.label, clamp(p[0], 220, 860), Math.max(330, p[1] - j * 0), k, [GREEN, "#7A4A2E", ORANGE][j % 3], "#FFFFFF", 36, (j - 1) * .06); });
        if (t >= tLight){ const p = c.toScreen(Bn.bulbX, Bn.bulbY - 230); popWord(ctx, "MENYALA!", clamp(p[0], 260, 820), Math.max(330, p[1]), t - tLight, { size: 92, rot: -6, hold: 1.5, col: GOLD }); }
        if (Bn.farCue && t >= tFar){ popChip(ctx, Bn.farText || "TUJUAN MASIH JAUH? TETAP JALAN", 540, 1220, t - tFar, NAVY, "#FFE58A", 34, 0); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bn = f.brain || {}; add(Bn.inCue ? cueT(s, Bn.inCue, .2, i) : .1, "pop"); (Bn.tokens || []).forEach((q, j) => { add(tOf(s, q, .3 + j * .15, i), "whoosh"); add(tOf(s, q, .3 + j * .15, i) + .7, "ping"); });
    if (Bn.lightCue) add(cueT(s, Bn.lightCue, .3, i), "chime"); if (Bn.farCue) add(cueT(s, Bn.farCue, .3, i), "pop"); });
  function tokenIcon(ctx, kind, s){ ctx.save(); ctx.scale(s, s); ctx.beginPath(); ctx.arc(0, 0, 56, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    if (kind === "check"){ ctx.strokeStyle = GREEN; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-24, 2); ctx.lineTo(-6, 22); ctx.lineTo(26, -20); ctx.stroke(); }
    else if (kind === "cocoa"){ drawItem(ctx, "cocoa", 0, 22, 0, { s: .55 }); }
    else { ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 16 : 38; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); }
    ctx.restore(); }

  /* ================= _pita: sticky note + self-awarded rosette ================= */
  TT.scene(PX + "pita", "Cerita: catat kemajuan kecil di monitor, sematkan pita penghargaan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, P = Object.assign({ deskX: 720, on: 0, noteText: "Modul 9 SELESAI!", rewards: [] }, f.pita || {});
    const tNote = T(s, P.noteCue, .3, idx), tPin = T(s, P.pinCue, .3, idx);
    const rw = P.rewards.map((q, j) => Object.assign({ T: tOf(s, q, .3 + j * .2, idx) }, q));
    base(ctx, s, t, { env: "office", envOpt: Object.assign({ desk: false, plant: true, plantX: 1000 }, P.envOpt || {}),
      spots: { monitor: [P.deskX, 1150, 1.2] },
      mid: () => { prop(ctx, "desk", P.deskX, GY, { mug: true, papers: 3 }, t);
        // monitor
        const mx = P.deskX - 20, my = GY - 290; ctx.fillStyle = "#4A4A52"; rr(ctx, mx - 20, my - 90, 40, 90, 6); ctx.fill(); ol(ctx, 4); rr(ctx, mx - 80, my - 14, 160, 16, 6); ctx.fill(); ol(ctx, 4);
        rr(ctx, mx - 230, my - 370, 460, 290, 16); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#BFE2EA"; ctx.fillRect(mx - 210, my - 350, 420, 250);
        ctx.fillStyle = TEAL; ctx.fillRect(mx - 210, my - 350, 420, 44); textC(ctx, "ENGLISH COURSE", mx, my - 318, 26, "#FFFFFF", 900);
        for (let i = 0; i < 12; i++){ const done = i < (P.done ?? 9); rr(ctx, mx - 190 + (i % 6) * 66, my - 290 + Math.floor(i / 6) * 90, 54, 70, 8); ctx.fillStyle = done ? (i === (P.done ?? 9) - 1 ? GOLD : GREEN) : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
          textC(ctx, String(i + 1), mx - 163 + (i % 6) * 66, my - 244 + Math.floor(i / 6) * 90, 26, done ? "#FFFFFF" : BROWN, 900); }
        if (t >= tNote){ const q = clamp((t - tNote) / .5, 0, 1); drawItem(ctx, "note", lerp(mx + 700, mx + (P.noteDX ?? 190), eBack(q)), lerp(my - 600, my - 300, q), t, { s: 1.25, text: P.noteText, w: 200, h: 160, rot: (1 - q) * 2 }); } },
      over1: (ctx2, c, sts, j) => { if (j !== P.on || t < tPin) return; const st = sts[j], p = lp(st, 8, -54), q = clamp((t - tPin) / .5, 0, 1);
        drawItem(ctx, "rosette", lerp(p[0] + 300, p[0], eBack(q)), lerp(p[1] - 400, p[1], eOut(q)), t, { s: .55 * st.size / 760 * (1 + (1 - q)) });
        if (q >= 1){ for (let i = 0; i < 5; i++){ const a = t * 2 + i * TAU / 5; sparkle(ctx, p[0] + Math.cos(a) * 90, p[1] + Math.sin(a) * 60, 10 + 5 * Math.sin(t * 6 + i), GOLD); } } },
      over: (ctx2, c, sts) => { const st = sts[P.on]; if (!st) return; const hp = toonHead(st), sc = c.toScreen(hp[0], hp[1]);
        rw.forEach((q, j) => { const k = t - q.T; if (k < 0) return; const a = t * .8 + j * TAU / Math.max(1, rw.length), rx = 300, ry = 90, x = clamp(sc[0] + Math.cos(a) * rx * Math.min(1, k * 2), 220, 860), y = Math.max(330, sc[1] - 300 + Math.sin(a) * ry);
          popChip(ctx, q.text, x, y, k, [ORANGE, TEAL, "#7A4A2E"][j % 3], "#FFFFFF", 34, Math.sin(a) * .08); });
        if (t >= tPin + .5){ popWord(ctx, P.pinText || "HEBAT!", clamp(sc[0] + 220, 240, 840), Math.max(340, sc[1] - 160), t - tPin - .5, { size: 90, rot: 8, hold: 1.3, col: GOLD }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P = f.pita || {}; if (P.noteCue) add(cueT(s, P.noteCue, .3, i) + .3, "pop"); if (P.pinCue){ add(cueT(s, P.pinCue, .3, i), "whoosh"); add(cueT(s, P.pinCue, .3, i) + .5, "chime"); } (P.rewards || []).forEach((q, j) => add(tOf(s, q, .3 + j * .2, i), "pop")); });

  /* ================= SP38: request snail ================= */
  function folderShell(ctx, w, h, label, col){ ctx.beginPath(); ctx.moveTo(-w / 2, -h + 30); ctx.lineTo(-w / 2 + 90, -h + 30); ctx.lineTo(-w / 2 + 110, -h); ctx.lineTo(-w / 2 + 200, -h); ctx.lineTo(-w / 2 + 220, -h + 30); ctx.lineTo(w / 2, -h + 30); ctx.lineTo(w / 2, 0); ctx.lineTo(-w / 2, 0); ctx.closePath();
    ctx.fillStyle = col || "#F0C27A"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = PAPER; ctx.fillRect(-w / 2 + 20, -h + 44, w - 40, 26); rr(ctx, -w / 2 + 30, -h * .55, w - 60, 66, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); textC(ctx, label, 0, -h * .55 + 46, 34, BROWN, 900, w - 80); }
  function snail(ctx, x, t, o){ const k = o.s || 1, crawl = Math.sin(t * 3); ctx.save(); ctx.translate(x, GY); ctx.scale(k, k);
    ctx.fillStyle = hexA("#BFE2EA", .5); ctx.fillRect(-900, -6, 900 - 120, 10);
    ctx.beginPath(); ctx.moveTo(-170, 0); ctx.quadraticCurveTo(-180, -60, -120, -60); ctx.lineTo(150, -60 + crawl * 4); ctx.quadraticCurveTo(250, -70, 260, -150); ctx.quadraticCurveTo(300, -200, 330, -150); ctx.quadraticCurveTo(340, -40, 260 + crawl * 8, 0); ctx.closePath();
    ctx.fillStyle = "#9FC48A"; ctx.fill(); ol(ctx, 6);
    [[-1, 270], [1, 310]].forEach(([d, ex]) => { const ey = -260 + Math.sin(t * 4 + d) * 10, bx = ex + Math.sin(t * 3 + d) * 12; ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(ex - 10, -170); ctx.lineTo(bx, ey); ctx.stroke(); ctx.strokeStyle = "#9FC48A"; ctx.lineWidth = 6; ctx.stroke();
      ctx.beginPath(); ctx.arc(bx, ey, 20, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(bx + 5, ey + 2, 9, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#9FC48A"; ctx.fillRect(bx - 22, ey - 22, 44, 14 + (o.sleepy ? 8 : 0)); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(300, -125, 16, .2, Math.PI - .2); ctx.stroke();
    ctx.save(); ctx.translate(-10, -50); ctx.rotate(-.04 + crawl * .02); folderShell(ctx, 330, 250, o.label || "PENGAJUAN"); ctx.restore(); ctx.restore(); }
  TT.scene(PX + "siput", "Cerita: siput pengajuan merayap, hari bertambah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sn = Object.assign({ x0: -120, x1: 520, days: 5, dayDur: 4.5 }, f.snail || {});
    const tPr = T(s, Sn.printerCue, .3, idx), dur = (s.d || 9); const x = lerp(Sn.x0, Sn.x1, clamp(t / (Sn.crawlDur || 9), 0, 1));
    const day = Math.min(Sn.days, 1 + Math.floor(t / Sn.dayDur * (Sn.days - 1)));
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 1000 },
      spots: { snail: [x + 100, 1350, 1.2] },
      mid: () => { snail(ctx, x, t, { s: Sn.s || .9, label: Sn.label });
        if (Sn.printerCue && t >= tPr){ const q = clamp((t - tPr) / .5, 0, 1), y = lerp(500, GY - 20, q * q), land = t - tPr - .5, sq = land > 0 && land < .4 ? Math.sin(land / .4 * Math.PI) * .15 : 0; ctx.save(); ctx.translate(Sn.prX ?? 1000, y); ctx.scale(1 + sq, 1 - sq);
          rr(ctx, -150, -230, 300, 230, 18); ctx.fillStyle = "#E8ECF0"; ctx.fill(); ol(ctx, 6); rr(ctx, -120, -270, 240, 50, 8); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 5); rr(ctx, -110, -150, 220, 30, 6); ctx.fillStyle = "#2C2433"; ctx.fill();
          textC(ctx, "TURBO", 0, -60, 46, RED, 900); for (let i = 0; i < 3; i++){ const fl = Math.sin(t * 20 + i) * 10; ctx.beginPath(); ctx.moveTo(150, -180 + i * 50); ctx.lineTo(220 + fl, -165 + i * 50); ctx.lineTo(150, -150 + i * 50); ctx.fillStyle = i % 2 ? GOLD : ORANGE; ctx.fill(); } ctx.restore(); } },
      over: (ctx2, c) => { if (t < (Sn.chipAt ?? 0)) return; const q = 1 + .08 * Math.max(0, Math.sin((t % Sn.dayDur) * 8)); ctx.save(); ctx.translate(540, 300); ctx.scale(q, q); chip(ctx, "HARI KE-" + day, 0, 0, day >= Sn.days ? RED : BROWN, "#FFFFFF", 46); ctx.restore();
        if (Sn.printerCue && t >= tPr + .5){ const p = c.toScreen(Sn.prX ?? 1000, GY - 420); popWord(ctx, Sn.prText || "PRINTER BARU!", clamp(p[0], 300, 800), Math.max(400, p[1]), t - tPr - .5, { size: 76, rot: 6, hold: 1.4, col: GOLD }); }
        if (Sn.otCue){ const k = t - T(s, Sn.otCue, .3, idx); popWord(ctx, "LEMBUR!", 300, 520, k, { size: 84, rot: -8, hold: 1.4, col: RED }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Sn = f.snail || {}; if (Sn.printerCue){ add(cueT(s, Sn.printerCue, .3, i), "whoosh"); add(cueT(s, Sn.printerCue, .3, i) + .5, "pop"); } if (Sn.otCue) add(cueT(s, Sn.otCue, .3, i), "pop"); });

  /* ================= _spageti: spaghetti diagram on a paper floor plan ================= */
  TT.scene(PX + "spageti", "Cerita: diagram spageti jalur dokumen di denah kantor", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Pn = Object.assign({ st: [], legs: [], start: 0 }, f.plan || {});
    const legs = Pn.legs.map((l, j) => Object.assign({ T: tOf(s, l, .2, idx) }, l)).sort((p, q) => p.T - q.T);
    const tTurbo = T(s, Pn.turboCue, .3, idx), tRed = T(s, Pn.redCue, .3, idx), tFork = T(s, Pn.forkCue, .5, idx), tDays = T(s, Pn.daysCue, .3, idx);
    const P = i => Pn.st[i]; const pathPts = []; let cur = Pn.start, pos = [P(cur).x, P(cur).y];
    legs.forEach((l, j) => { if (t < l.T) return; const a = P(cur), b = P(l.to), q = clamp((t - l.T) / (l.dur || .7), 0, 1), n = 14;
      for (let i = 0; i <= n * q; i++){ const u = i / n, wob = Math.sin(u * Math.PI) * (j % 2 ? 90 : -90) * (1 + (j % 3) * .4); const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
        pathPts.push([lerp(a.x, b.x, u) - dy / L * wob, lerp(a.y, b.y, u) + dx / L * wob]); }
      pos = pathPts[pathPts.length - 1]; if (q >= 1) cur = l.to; });
    base(ctx, s, t, { env: "info", front: false,
      back: () => { ctx.fillStyle = "#F4EBD8"; ctx.fillRect(-600, -400, 2400, 2800); ctx.strokeStyle = hexA("#5B7DB1", .18); ctx.lineWidth = 2; for (let x = -600; x < 1800; x += 60){ ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x, 2400); ctx.stroke(); } for (let y = -400; y < 2400; y += 60){ ctx.beginPath(); ctx.moveTo(-600, y); ctx.lineTo(1800, y); ctx.stroke(); }
        const bh = Pn.boxH || 900, wy = 420 + bh * .5; ctx.strokeStyle = "#3B4A6B"; ctx.lineWidth = 14; ctx.strokeRect(70, 420, 940, bh); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(540, 420); ctx.lineTo(540, wy - 90); ctx.moveTo(70, wy); ctx.lineTo(380, wy); ctx.moveTo(700, wy); ctx.lineTo(1010, wy); ctx.stroke();
        textC(ctx, Pn.title || "DENAH KANTOR", 540, 400, 30, "#3B4A6B", 900);
        Pn.st.forEach((S0, i) => { const turbo = S0.turbo && t >= tTurbo; ctx.save(); ctx.translate(S0.x, S0.y); if (turbo) ctx.translate(Math.sin(t * 40) * 4, 0);
          const hl = (Pn.hl || []).find(h => h.st === i && t >= tOf(s, h, .3, idx)); if (hl){ glowAt(ctx, 0, 0, 140, ORANGE, .5); }
          rr(ctx, -95, -60, 190, 120, 14); ctx.fillStyle = turbo ? "#FFD9C2" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hl ? ORANGE : "#3B4A6B"; ctx.lineWidth = hl ? 8 : 5; ctx.stroke();
          icon(ctx, S0.icon || "file", 0, -14, 52, "#3B4A6B", 5); textC(ctx, S0.label, 0, 44, 24, BROWN, 900, 176);
          if (turbo){ for (let k = 0; k < 3; k++){ const fl = Math.sin(t * 22 + k) * 12; ctx.beginPath(); ctx.moveTo(95, -40 + k * 35); ctx.lineTo(150 + fl, -28 + k * 35); ctx.lineTo(95, -16 + k * 35); ctx.fillStyle = k % 2 ? GOLD : RED; ctx.fill(); } chip(ctx, "TURBO", 0, -92, RED, "#FFFFFF", 22); }
          ctx.restore(); }); },
      mid: () => { if (pathPts.length > 1){ const red = t >= tRed; [[24, OUT], [16, red ? (Math.sin(t * 10) > 0 ? RED : "#F08C2E") : "#F2B84B"]].forEach(([w, col]) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); pathPts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }); }
        // document token
        ctx.save(); ctx.translate(pos[0], pos[1] - 10 + Math.sin(t * 8) * 6); ctx.rotate(Math.sin(t * 5) * .2); rr(ctx, -40, -52, 80, 104, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = ORANGE; ctx.fillRect(-26, -36, 52, 10); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 3; i++) ctx.fillRect(-26, -14 + i * 18, 52 - i * 10, 8); ctx.restore();
        if (t >= tFork){ const k = t - tFork, q = clamp(k / .6, 0, 1), fx = Pn.forkX ?? 540, fy = lerp(200, Pn.forkY ?? 700, eOut(q)); ctx.save(); ctx.translate(fx, fy); ctx.rotate(k > .6 ? (k - .6) * 6 : 0);
          ctx.fillStyle = "#C9D1D9"; rr(ctx, -14, -420, 28, 300, 12); ctx.fill(); ol(ctx, 4); rr(ctx, -60, -140, 120, 50, 14); ctx.fill(); ol(ctx, 4); for (let i = 0; i < 4; i++){ rr(ctx, -54 + i * 32, -100, 16, 110, 6); ctx.fill(); ol(ctx, 3); } ctx.restore(); } },
      over: (ctx2, c) => { if (t >= tDays){ const q = eBack(clamp((t - tDays) / .4, 0, 1)); ctx.save(); ctx.translate(540, Pn.daysY ?? 1180); ctx.scale(q, q); chip(ctx, Pn.daysText || "TETAP 5 HARI", 0, 0, RED, "#FFFFFF", 48); ctx.restore(); }
        if (t >= tRed){ popWord(ctx, Pn.redText || "JALURNYA!", 540, 560, t - tRed, { size: 104, rot: -5, hold: 1.6, col: RED }); }
        if (t >= tFork + .6){ popWord(ctx, "SPAGETI!", 760, 520, t - tFork - .6, { size: 90, rot: 7, hold: 1.4, col: GOLD }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Pn = f.plan || {}; (Pn.legs || []).forEach(l => add(tOf(s, l, .2, i), "whoosh")); if (Pn.turboCue) add(cueT(s, Pn.turboCue, .3, i), "pop"); if (Pn.redCue) add(cueT(s, Pn.redCue, .3, i), "ping");
    if (Pn.forkCue) add(cueT(s, Pn.forkCue, .5, i) + .6, "chime"); if (Pn.daysCue) add(cueT(s, Pn.daysCue, .3, i), "pop"); (Pn.hl || []).forEach(h => add(tOf(s, h, .3, i), "pop")); });

  /* ================= _deteksi: value detector over step cards ================= */
  TT.scene(PX + "deteksi", "Cerita: alat pendeteksi nilai menyapu kartu langkah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Dt = Object.assign({ y: 1180, x0: 130, gap: 164, w: 150, cards: [], on: 0 }, f.det || {});
    const cs = Dt.cards.map((cd, j) => Object.assign({ T: cd.cue || cd.at != null ? tOf(s, cd, .3, idx) : 1e9, x: Dt.x0 + j * Dt.gap }, cd));
    const tIn = Dt.inCue ? T(s, Dt.inCue, .2, idx) : .1, tOld = T(s, Dt.oldCue, .3, idx);
    const last = cs.filter(c0 => t >= c0.T).sort((p, q) => p.T - q.T).pop(), wandState = last && t - last.T < 1.2 ? (last.ok ? "green" : "red") : "idle";
    const wandFx = (sts) => { const st = sts[Dt.on]; if (!st) return; const p = handOf(st); drawItem(ctx, "wand", p[0], p[1], t, { s: 1.1 * st.size / 760, state: wandState, flip: st.face < 0 ? -1 : 1, wrot: Dt.wrot ?? 1.2 });
        if (wandState !== "idle"){ const k = t - last.T; for (let i = 0; i < 3; i++){ const q = ((k * 1.5 + i / 3) % 1); ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = wandState === "red" ? RED : GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(p[0] + 180 * st.face * st.size / 760, p[1] - 70 * st.size / 760, 40 + q * 120, 0, TAU); ctx.stroke(); ctx.restore(); } } };
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      spots: { row: [540, Dt.y - 120, 1.0] },
      front: (ctx2, c, sts) => { cs.forEach((cd, j) => { const q = eBack(clamp((t - tIn - j * .12) / .45, 0, 1)); if (q <= 0) return; const ev = t >= cd.T, k = t - cd.T, bad = ev && !cd.ok;
          const bob = Math.sin(t * 2.4 + j) * 10, drop = bad ? eOut(clamp(k / .6, 0, 1)) * 60 : 0, shake = bad && k < .8 ? Math.sin(k * 60) * 8 : 0;
          ctx.save(); ctx.translate(cd.x + shake, Dt.y + bob + drop); ctx.rotate(bad ? .08 * (j % 2 ? 1 : -1) : 0); ctx.scale(q, q);
          if (ev && cd.ok) glowAt(ctx, 0, 0, 150, GREEN, .35); if (bad) glowAt(ctx, 0, -40, 170, RED, .35 + .25 * Math.sin(t * 14));
          rr(ctx, -Dt.w / 2, -90, Dt.w, 180, 14); ctx.fillStyle = bad ? "#FFD9D2" : ev ? "#DDF3E2" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = bad ? RED : ev ? GREEN : OUT; ctx.lineWidth = 6; ctx.stroke();
          textC(ctx, String(j + 1), 0, -52, 30, ORANGE, 900); const { L, size } = lines2(ctx, cd.text, Dt.w - 20, 26, 900); L.forEach((l, i) => textC(ctx, l, 0, -8 + i * size * 1.15 + (L.length === 1 ? 14 : 0), size, BROWN, 900));
          if (ev && cd.ok){ ctx.strokeStyle = GREEN; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-22, 58); ctx.lineTo(-6, 72); ctx.lineTo(24, 44); ctx.stroke(); }
          if (bad){ ctx.save(); ctx.translate(0, -112); rr(ctx, -26, -10, 52, 18, 4); ctx.fillStyle = "#4A4A52"; ctx.fill(); ctx.beginPath(); ctx.arc(0, -10, 24, Math.PI, 0); ctx.fillStyle = Math.sin(t * 16) > 0 ? RED : "#FF8A7A"; ctx.fill(); ol(ctx, 3); ctx.restore();
            ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-20, 44); ctx.lineTo(20, 76); ctx.moveTo(20, 44); ctx.lineTo(-20, 76); ctx.stroke(); }
          if (bad && t >= tOld){ ctx.save(); ctx.rotate(-.25); const sq = eBack(clamp((t - tOld - j * .05) / .3, 0, 1)); ctx.scale(sq, sq); rr(ctx, -78, -22, 156, 44, 8); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.stroke(); textC(ctx, "TAK BERNILAI", 0, 9, 20, RED, 900, 146); ctx.restore(); }
          ctx.restore(); }); wandFx(sts); },
      over: (ctx2, c) => { cs.forEach((cd, j) => { const k = t - cd.T; if (k < 0 || k > 1) return; const p = c.toScreen(cd.x, Dt.y - (Dt.popUp ?? 520)); popWord(ctx, cd.ok ? "TING!" : "TIIT!", clamp(p[0], 200, 880), Math.max(340, p[1]), k, { size: 64, rot: j % 2 ? 7 : -7, hold: .9, col: cd.ok ? GREEN : RED }); });
        if (Dt.qCue){ const k = t - T(s, Dt.qCue, .2, idx); if (k >= 0 && k < 3.2){ const q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.globalAlpha = 1 - clamp((k - 2.9) / .3, 0, 1); ctx.translate(540, 330); ctx.scale(q, q); chip(ctx, Dt.qText || "MEMBERI NILAI UNTUK SIAPA?", 0, 0, NAVY, "#FFE58A", 40, 900); ctx.restore(); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Dt = f.det || {}; add(Dt.inCue ? cueT(s, Dt.inCue, .2, i) : .1, "pop"); (Dt.cards || []).forEach(cd => { if (cd.cue || cd.at != null) add(tOf(s, cd, .3, i), cd.ok ? "chime" : "ping"); }); if (Dt.oldCue) add(cueT(s, Dt.oldCue, .3, i), "pop"); });

  /* ================= _cacah: shredder eats the useless steps ================= */
  TT.scene(PX + "cacah", "Cerita: mesin penghancur kertas memakan langkah sia-sia", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sh = Object.assign({ x: 560, cards: [], keep: [], from: 180 }, f.shred || {});
    const cs = Sh.cards.map((cd, j) => Object.assign({ T: tOf(s, cd, .3 + j * .25, idx) }, cd));
    const tDay = T(s, Sh.dayCue, .4, idx), tSpeed = T(s, Sh.speedCue, .3, idx), top = GY - 470;
    const eaten = cs.filter(cd => t >= cd.T + 1).length, lastE = cs.map(cd => t - cd.T).filter(k => k >= .6 && k < 1.6).pop();
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 80 },
      spots: { shred: [Sh.x, 1150, 1.15] },
      mid: () => { const jit = lastE != null ? Math.sin(t * 60) * 5 : 0; ctx.save(); ctx.translate(Sh.x + jit, 0);
        ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, GY + 4, 220, 18, 0, 0, TAU); ctx.fill();
        rr(ctx, -190, top + 120, 380, GY - top - 120, 16); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 6); rr(ctx, -150, top + 170, 300, GY - top - 220, 12); ctx.fillStyle = hexA("#BFE2EA", .5); ctx.fill(); ol(ctx, 4);
        ctx.save(); ctx.beginPath(); ctx.rect(-150, top + 170, 300, GY - top - 220); ctx.clip(); const pile = eaten * 70 + (lastE != null ? (lastE - .6) * 70 : 0);
        for (let i = 0; i < pile / 4; i++){ ctx.strokeStyle = ["#FFD9D2", "#FFFFFF", "#F6D36B"][i % 3]; ctx.lineWidth = 7; ctx.beginPath(); const x = -140 + rnd(i) * 280, y = GY - 60 - rnd(i + 3) * pile; ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 20, y - 20, x + 10, y - 40); ctx.stroke(); }
        if (lastE != null){ for (let i = 0; i < 8; i++){ const x = -120 + i * 34, y = top + 180 + ((t * 600 + i * 50) % 300); ctx.strokeStyle = "#FFD9D2"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(t * 20 + i) * 8, y + 60); ctx.stroke(); } }
        ctx.restore();
        rr(ctx, -210, top, 420, 140, 22); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6); rr(ctx, -150, top + 20, 300, 22, 8); ctx.fillStyle = "#0E0A10"; ctx.fill();
        ctx.beginPath(); ctx.arc(150, top + 90, 14, 0, TAU); ctx.fillStyle = lastE != null ? (Math.sin(t * 20) > 0 ? RED : GOLD) : GREEN; ctx.fill(); textC(ctx, Sh.label || "PENGHANCUR", -30, top + 104, 30, "#FFFFFF", 900, 280);
        ctx.restore();
        // cards: waiting stack -> hop -> shredded
        cs.forEach((cd, j) => { const k = t - cd.T; if (k >= 1.6) return; let x = Sh.from - j * 14, y = GY - 420 - j * 16, rot = -.05 * j, clipY = null;
          if (k >= 0){ const q = clamp(k / .6, 0, 1); x = lerp(x, Sh.x, eOut(q)); y = lerp(y, top - 120, q) - Math.sin(q * Math.PI) * 250; rot = q * .0; if (k >= .6){ y = top - 120 + (k - .6) * 260; clipY = top + 30; } }
          ctx.save(); if (clipY != null){ ctx.beginPath(); ctx.rect(-600, -400, 2400, clipY + 400); ctx.clip(); } ctx.translate(x, y); ctx.rotate(rot);
          rr(ctx, -120, -80, 240, 160, 14); ctx.fillStyle = "#FFD9D2"; ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.stroke(); const { L, size } = lines2(ctx, cd.text, 210, 34, 900); L.forEach((l, i) => textC(ctx, l, 0, (L.length === 1 ? 12 : -10) + i * size * 1.15, size, BROWN, 900)); ctx.restore(); });
        // zooming kept steps
        if (t >= tSpeed){ Sh.keep.forEach((txt, j) => { const k = t - tSpeed - j * .4; if (k < 0) return; const u = (k * .9) % 1.4, x = -200 + u * 1400, y = Sh.ky ?? 760;
          ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .9); ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(x - 140 - i * 40, y - 30 + i * 20); ctx.lineTo(x - 260 - i * 60, y - 30 + i * 20); ctx.stroke(); }
          rr(ctx, x - 120, y - 60, 240, 120, 14); ctx.fillStyle = "#DDF3E2"; ctx.fill(); ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.stroke(); textC(ctx, txt, x, y + 12, 30, BROWN, 900, 210); ctx.restore(); }); } },
      over: (ctx2, c) => { cs.forEach((cd, j) => { const k = t - cd.T - .6; if (k < 0) return; const p = c.toScreen(Sh.x + 160, top - 60); popWord(ctx, "KRAUK!", clamp(p[0], 240, 840), Math.max(360, p[1]), k, { size: 76, rot: j % 2 ? 8 : -8, hold: .9, col: RED }); });
        const dq = t >= tDay ? clamp((t - tDay) / .5, 0, 1) : 0; ctx.save(); ctx.translate(540, 300); ctx.scale(1 + .2 * Math.sin(dq * Math.PI), Math.abs(Math.cos(dq * Math.PI)) * .9 + .1);
        chip(ctx, dq < .5 ? (Sh.before || "5 HARI") : (Sh.after || "1 HARI"), 0, 0, dq < .5 ? RED : GREEN, "#FFFFFF", 56); ctx.restore();
        if (t >= tDay + .5) burstFx(ctx, 540, 300, t - tDay - .5, GOLD, 12, 260); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Sh = f.shred || {}; (Sh.cards || []).forEach((cd, j) => { add(tOf(s, cd, .3 + j * .25, i), "whoosh"); add(tOf(s, cd, .3 + j * .25, i) + .6, "pop"); });
    if (Sh.dayCue) add(cueT(s, Sh.dayCue, .4, i) + .3, "chime"); if (Sh.speedCue) add(cueT(s, Sh.speedCue, .3, i), "whoosh"); });

  /* ================= _engklek: chalk hopscotch of steps ================= */
  TT.scene(PX + "engklek", "Cerita: engklek kapur berisi langkah kerja, satu dicoret", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Hp = Object.assign({ x0: 300, gap: 300, boxes: [], cross: 2 }, f.hop || {});
    const tDraw = T(s, Hp.drawCue, .2, idx), tX = T(s, Hp.crossCue, .3, idx), tDone = T(s, Hp.doneCue, .5, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      back: () => { ctx.fillStyle = "#B9B2A8"; ctx.fillRect(-600, GY - 10, 2800, 220); ctx.strokeStyle = hexA(OUT, .15); ctx.lineWidth = 3; for (let x = -600; x < 2200; x += 160){ ctx.beginPath(); ctx.moveTo(x, GY - 10); ctx.lineTo(x - 40, GY + 210); ctx.stroke(); }
        Hp.boxes.forEach((txt, j) => { const q = clamp((t - tDraw - j * .35) / .45, 0, 1); if (q <= 0) return; const x = Hp.x0 + j * Hp.gap, y = GY + 20, w = 250, h = 130, sk = 40, last = j === Hp.boxes.length - 1;
          const pts = [[x - w / 2 + sk, y], [x + w / 2 + sk, y], [x + w / 2 - sk, y + h], [x - w / 2 - sk, y + h], [x - w / 2 + sk, y]]; const per = 4 * q; ctx.strokeStyle = last && t >= tDone ? GOLD : "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i <= 4; i++){ const u = clamp(per - (i - 1), 0, 1); if (u <= 0) break; ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)); } ctx.stroke();
          if (q >= 1){ ctx.save(); ctx.translate(x, y + h / 2); ctx.transform(1, 0, -.3, 1, 0, 0); const { L, size } = lines2(ctx, txt, w - 40, 34, 900); L.forEach((l, i) => textC(ctx, l, 0, (L.length === 1 ? 12 : -8) + i * size * 1.1, size, last && t >= tDone ? GOLD : "#FFFFFF", 900)); ctx.restore(); }
          if (j === Hp.cross && t >= tX){ const k = clamp((t - tX) / .5, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x - w / 2, y + 10); ctx.lineTo(lerp(x - w / 2, x + w / 2, k), lerp(y + 10, y + h - 10, k)); ctx.stroke();
            if (k >= .5){ const k2 = clamp((k - .5) * 2, 0, 1); ctx.beginPath(); ctx.moveTo(x + w / 2, y + 10); ctx.lineTo(lerp(x + w / 2, x - w / 2, k2), lerp(y + 10, y + h - 10, k2)); ctx.stroke(); }
            const dk = t - tX; if (dk < 1){ for (let i = 0; i < 10; i++){ ctx.save(); ctx.globalAlpha = 1 - dk; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + Math.cos(i) * 120 * dk, y + 60 - Math.abs(Math.sin(i * 2)) * 160 * dk, 8, 0, TAU); ctx.fill(); ctx.restore(); } } } }); },
      front: () => { if (t >= tDone){ const x = Hp.x0 + (Hp.boxes.length - 1) * Hp.gap; for (let i = 0; i < 6; i++){ const a = t * 1.5 + i; sparkle(ctx, x + Math.cos(a) * 200, GY - 300 + Math.sin(a * 1.3) * 120, 14 + 6 * Math.sin(t * 5 + i), GOLD); } } },
      over: (ctx2, c) => { if (t >= tX){ const x = Hp.x0 + Hp.cross * Hp.gap, p = c.toScreen(x, GY - 560); popWord(ctx, Hp.crossText || "CORET!", clamp(p[0], 240, 840), Math.max(360, p[1]), t - tX, { size: 92, rot: -8, hold: 1.3, col: RED }); }
        if (t >= tDone){ popWord(ctx, Hp.doneText || "LEBIH RINGKAS!", 540, 440, t - tDone, { size: 84, rot: 4, hold: 2.5, col: GREEN }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Hp = f.hop || {}; if (Hp.drawCue) (Hp.boxes || []).forEach((b, j) => add(cueT(s, Hp.drawCue, .2, i) + j * .35, "pop")); if (Hp.crossCue) add(cueT(s, Hp.crossCue, .3, i), "whoosh"); if (Hp.doneCue) add(cueT(s, Hp.doneCue, .5, i), "chime"); });

})();
