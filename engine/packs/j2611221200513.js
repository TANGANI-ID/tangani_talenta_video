/* Scene pack j2611221200513: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for RN38, KD38, JS38, SC38, MS38.
   Layout prefix j2611221200513_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, piece:false}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, out|outCue, s, dx, dy, rot, text}]  object in a toon's hand:
            tray, flag, box, phone, marker, cup, scoop, glove, paper, shot (screenshot print), book, toy
     pops   [{at|cue, text, x, y, size, rot, col, hold}]  big outlined pop words (screen)
     keys   {at|cue, outCue, y, caps:[[..], [..]]}         keyboard key caps popping in rows (screen)
     steps  [{at|cue, text, icon}] + stepsY                numbered step chips stacked (screen)
     confetti {at|cue}
   Set pieces (layout suffix):
     _adegan   generic story shot with the extras above
     _kantin   office canteen at lunch: laughing seated groups, the new hire alone at a corner table with a tray, day chips,
               a job-vacancy chip on his phone                                                              f.kantin
     _kardus   the new hire's desk + his cardboard box of personal things; mode "kemas": mug/frame/cactus hop back into the box
               while a green EXIT door glows; mode "betah": things hop out, nameplate + welcome note appear      f.kardus
     _tur      office corridor tour: a guide flag, door signs pop (PANTRY / PRINTER / TIM IT ...) at each stop     f.tur
     _jelajah  the screenshot as a giant world: the IT guy walks tiny on the taskbar between huge windows, icons, chats;
               the real error is a speck far away                                                          f.layar
     _mondar   two desks far apart: the IT guy walks back and forth, worn footprint path, trip counter, racing clock  f.mondar
     _tandai   screenshot on a floating board: crop handles close in, a giant red marker circles the error, arrow, note,
               card flies off "TERKIRIM"                                                                   f.tandai
     _kedai    coffee shop counter: chalk menu, espresso machine steam, queue, wrong-cup moment, queue timer      f.kedai
     _alarm    cafe kitchen: a beeping smoke alarm on the ceiling; the hand that wants to pull its battery; smoke trails
               down to small smouldering pans labelled with the complaint's sources, put out one by one        f.alarm
     _gelas    counter close-up: a giant marker writes names on cups, cups slide to the right owners, queue timer drops  f.gelas
     _bocor    cut-away rowboat at sea with leaks of different strength (interest); the hero bails and half-patches,
               water rises; mode "tambal" patches the biggest leak                                          f.bocor
     _samsak   boxing gym: three hanging debt sandbags with HP bars that refill (+BUNGA); spread punches vs focus, KO -> LUNAS  f.samsak
     _kulkas   kitchen fridge with a hand-drawn payoff chart: month boxes coloured in, gold LUNAS star, freed amount
               arrow rolls to the next row                                                                  f.kulkas
     _rekam    yard: the child's tantrum with a floating REC viewfinder above him replaying the mother's shout pose   f.rekam
     _kepala   giant child head cut-away: words enter the ear and evaporate out of the top, pictures fly into the eye and land on a film strip   f.kepala
     _napas    terrace: a breathing ring grows/shrinks (TARIK / HEMBUS) around the mother, kids copy with small rings   f.napas */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221200513_";
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
  function chipW(ctx, txt, x, y, bg, fg, size){ // world chip, no clamping
    size = size || 34; font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot, world){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1));
    if (!world){ size = size || 34; font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1; if (w > 896){ size = Math.floor(size * 896 / w); } font(ctx, 800, size, FAM); const w2 = ctx.measureText(txt).width + size * 1.1; x = clamp(x, 92 + w2 / 2, 988 - w2 / 2); }
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); (world ? chipW : chip)(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function smoke(ctx, x, y, t, k, o){ o = o || {}; const n = o.n || 7, h = o.h || 260, col = o.col || "#8C8C94", sz = o.s || 1;
    for (let i = 0; i < n; i++){ const q = ((t * (o.speed || .55)) + i / n) % 1, a = (1 - q) * .55 * k; if (a <= 0) continue;
      ctx.fillStyle = hexA(col, a); ctx.beginPath(); ctx.arc(x + Math.sin(q * 6 + i) * 26 * sz + (o.drift || 0) * q, y - q * h, (18 + q * 46) * sz, 0, TAU); ctx.fill(); } }
  function arrowLine(ctx, x0, y0, x1, y1, col, w, p){ p = p ?? 1; if (p <= 0) return; const x = lerp(x0, x1, p), y = lerp(y0, y1, p), a = Math.atan2(y1 - y0, x1 - x0);
    ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = w + 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(w * 1.6, 0); ctx.lineTo(-w * 1.6, -w * 1.8); ctx.lineTo(-w * 1.6, w * 1.8); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore(); }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function mug(ctx, col){ rr(ctx, -26, -60, 52, 60, 9); ctx.fillStyle = col || CREAM; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(28, -32, 14, -1.3, 1.3); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = ORANGE; ctx.fillRect(-22, -42, 44, 10); }
  function photoFrame(ctx){ rr(ctx, -46, -96, 92, 96, 8); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#DDEFF5"; ctx.fillRect(-34, -84, 68, 70);
    ctx.fillStyle = "#E2A77C"; ctx.beginPath(); ctx.arc(-12, -56, 12, 0, TAU); ctx.arc(14, -52, 10, 0, TAU); ctx.fill(); ctx.fillStyle = TEAL; ctx.fillRect(-26, -42, 26, 28); ctx.fillStyle = ORANGE; ctx.fillRect(4, -40, 22, 26); }
  function cactus(ctx, t){ ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-30, -44); ctx.lineTo(30, -44); ctx.lineTo(22, 0); ctx.lineTo(-22, 0); ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.translate(0, -44); ctx.rotate(Math.sin((t || 0) * 2) * .04); rr(ctx, -16, -86, 32, 90, 16); ctx.fillStyle = "#4E9A5E"; ctx.fill(); ol(ctx, 5); rr(ctx, 12, -60, 26, 16, 8); ctx.fill(); ol(ctx, 4); rr(ctx, 26, -84, 14, 36, 7); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#F28DB2"; ctx.beginPath(); ctx.arc(0, -90, 9, 0, TAU); ctx.fill(); ctx.restore(); }
  function cupC(ctx, name, col, o){ o = o || {}; ctx.beginPath(); ctx.moveTo(-40, -130); ctx.lineTo(40, -130); ctx.lineTo(30, 0); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fillStyle = col || "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -46, -150, 92, 22, 8); ctx.fillStyle = "#6B4426"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#C98B62"; ctx.fillRect(-36, -92, 72, 34);
    if (name){ const p = o.p ?? 1; ctx.save(); ctx.beginPath(); ctx.rect(-40, -100, 80 * p, 60); ctx.clip(); textC(ctx, name, 0, -66, 24, OUT, 900, 70); ctx.restore(); } }
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "tray"){ rr(ctx, -120, -14, 240, 24, 10); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.ellipse(-40, -24, 60, 22, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#F3E6D2"; ctx.beginPath(); ctx.arc(-40, -34, 30, Math.PI, 0); ctx.fill(); ol(ctx, 3);
      ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.arc(-16, -36, 12, 0, TAU); ctx.fill(); ctx.fillStyle = "#4E9A5E"; ctx.beginPath(); ctx.arc(-58, -40, 10, 0, TAU); ctx.fill();
      ctx.save(); ctx.translate(60, -14); mug(ctx, "#FFFFFF"); ctx.restore(); for (let k = 0; k < 2; k++){ const q = ((t || 0) * .6 + k / 2) % 1; ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(56 + k * 10, -84 - q * 50); ctx.quadraticCurveTo(46 + k * 10, -100 - q * 50, 58 + k * 10, -118 - q * 50); ctx.stroke(); } ctx.globalAlpha = 1; }
    else if (kind === "flag"){ ctx.fillStyle = "#7A4A2E"; rr(ctx, -6, -330, 12, 380, 6); ctx.fill(); ol(ctx, 4); const w = Math.sin((t || 0) * 5) * 10;
      ctx.beginPath(); ctx.moveTo(6, -330); ctx.quadraticCurveTo(80, -350 + w, 160, -320); ctx.lineTo(160, -230); ctx.quadraticCurveTo(80, -250 - w, 6, -230); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5);
      textC(ctx, o.text || "TUR", 82, -268, 34, "#FFFFFF", 900, 130); }
    else if (kind === "box"){ rr(ctx, -110, -90, 220, 150, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-110, -50); ctx.lineTo(110, -50); ctx.stroke();
      ctx.save(); ctx.translate(-50, -96); cactus(ctx, t); ctx.restore(); ctx.save(); ctx.translate(40, -86); ctx.scale(.8, .8); photoFrame(ctx); ctx.restore(); }
    else if (kind === "phone"){ prop(ctx, "phone", 0, 0, { s: .6, screen: o.screen || "#BFE2EA", notif: o.notif }, t); }
    else if (kind === "marker"){ ctx.rotate(-.5); rr(ctx, -22, -150, 44, 190, 14); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 5); rr(ctx, -22, -150, 44, 60, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.moveTo(-14, 40); ctx.lineTo(14, 40); ctx.lineTo(4, 74); ctx.lineTo(-4, 74); ctx.closePath(); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 4); }
    else if (kind === "cup"){ ctx.scale(.9, .9); ctx.translate(0, 40); cupC(ctx, o.text, "#FFFFFF"); }
    else if (kind === "scoop"){ ctx.rotate(-.3 + Math.sin((t || 0) * 7) * .5); ctx.fillStyle = "#3E7DB5"; rr(ctx, -6, -130, 14, 150, 6); ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.moveTo(-50, 10); ctx.lineTo(56, 10); ctx.lineTo(46, 80); ctx.quadraticCurveTo(0, 96, -40, 80); ctx.closePath(); ctx.fill(); ol(ctx, 5); }
    else if (kind === "glove"){ ctx.beginPath(); ctx.ellipse(0, 0, 54, 48, 0, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(-30, 10, 20, 26, .4, 0, TAU); ctx.fill(); ol(ctx, 4);
      rr(ctx, -40, 34, 70, 32, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.ellipse(10, -20, 18, 10, -.5, 0, TAU); ctx.fill(); }
    else if (kind === "paper"){ ctx.rotate(-.08); rr(ctx, -90, -120, 180, 240, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      const n = o.lines ?? 5; for (let i = 0; i < n; i++){ ctx.fillStyle = i === 0 ? ORANGE : "#B9A58E"; rr(ctx, -66, -92 + i * 40, i === 0 ? 132 : 70 + rnd(i) * 60, 14, 6); ctx.fill(); } }
    else if (kind === "shot"){ ctx.rotate(-.06); miniShot(ctx, -150, -100, 300, 200, t, {}); }
    else if (kind === "book"){ ctx.rotate(-.1); rr(ctx, -100, -70, 200, 130, 8); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); ctx.fillStyle = PAPER; rr(ctx, -90, -62, 86, 114, 4); ctx.fill(); rr(ctx, 4, -62, 86, 114, 4); ctx.fill();
      ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++){ ctx.fillRect(-80, -44 + i * 24, 64, 7); ctx.fillRect(14, -44 + i * 24, 64, 7); } }
    else if (kind === "toy"){ ctx.rotate(Math.sin((t || 0) * 4) * .15); rr(ctx, -60, -40, 120, 60, 16); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); rr(ctx, -30, -70, 60, 34, 10); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4);
      [-34, 34].forEach(dx => { ctx.beginPath(); ctx.arc(dx, 24, 18, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); }); }
    ctx.restore(); }

  /* mini desktop screenshot (shared by KD scenes); o: {err: error dialog visible, errS scale of error, dim: [x,y,w,h] keep-rect} */
  function miniShot(ctx, x, y, w, h, t, o){ o = o || {}; const k = w / 1000;
    ctx.save(); rr(ctx, x, y, w, h, 10 * k + 2); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, Math.max(3, 8 * k)); ctx.clip();
    ctx.fillStyle = (() => { const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, "#4A7FB0"); g.addColorStop(1, "#E8A55B"); return g; })(); ctx.fillRect(x, y, w, h);
    const win = (wx, wy, ww, wh, col, title, fn) => { rr(ctx, x + wx * k, y + wy * k, ww * k, wh * k, 8 * k); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3 * k + 1);
      ctx.fillStyle = col; rr(ctx, x + wx * k, y + wy * k, ww * k, 40 * k, 8 * k); ctx.fill(); if (title) textL(ctx, title, x + (wx + 14) * k, y + (wy + 28) * k, 22 * k, "#FFFFFF", 800); if (fn) fn(x + wx * k, y + (wy + 40) * k, ww * k, (wh - 40) * k); };
    win(40, 40, 520, 380, TEAL, "Toko Online", (X, Y, W2, H2) => { for (let i = 0; i < 6; i++){ const cx = X + 20 * k + (i % 3) * 165 * k, cy = Y + 20 * k + Math.floor(i / 3) * 160 * k; rr(ctx, cx, cy, 150 * k, 140 * k, 8 * k); ctx.fillStyle = ["#F3D9B5", "#BFE2EA", "#F28DB2", "#E8A55B", "#C9E4B8", "#F3D9B5"][i]; ctx.fill(); }
      rr(ctx, X + 60 * k, Y + 120 * k, 120 * k, 40 * k, 8 * k); ctx.fillStyle = RED; ctx.fill(); textC(ctx, "DISKON", X + 120 * k, Y + 150 * k, 22 * k, "#FFFFFF", 900); });
    win(600, 60, 360, 460, "#4E9A5E", "Chat Grup", (X, Y, W2, H2) => { for (let i = 0; i < 6; i++){ const r = i % 2, bw = (140 + rnd(i) * 120) * k; rr(ctx, r ? X + W2 - bw - 14 * k : X + 14 * k, Y + 16 * k + i * 66 * k, bw, 48 * k, 16 * k); ctx.fillStyle = r ? "#D7F5C9" : "#EFEFEF"; ctx.fill(); } });
    win(120, 460, 480, 300, "#3E7DB5", "Laporan.xlsx", (X, Y, W2, H2) => { ctx.strokeStyle = "#C9D3DD"; ctx.lineWidth = 2 * k + .5; for (let i = 0; i <= 6; i++){ ctx.beginPath(); ctx.moveTo(X, Y + i * 40 * k); ctx.lineTo(X + W2, Y + i * 40 * k); ctx.stroke(); } for (let j = 1; j < 5; j++){ ctx.beginPath(); ctx.moveTo(X + j * W2 / 5, Y); ctx.lineTo(X + j * W2 / 5, Y + H2); ctx.stroke(); } });
    [[650, 570], [760, 570], [870, 570], [650, 680], [760, 680]].forEach(([ix, iy], i) => { rr(ctx, x + ix * k, y + iy * k, 80 * k, 80 * k, 14 * k); ctx.fillStyle = ["#F6C343", "#D9483B", "#3E9B5A", "#5B7DB1", "#E8A55B"][i]; ctx.fill(); ol(ctx, 2 * k + 1); });
    // taskbar
    ctx.fillStyle = "#1E1A18"; ctx.fillRect(x, y + h - 50 * k, w, 50 * k); for (let i = 0; i < 8; i++){ rr(ctx, x + (20 + i * 60) * k, y + h - 42 * k, 40 * k, 34 * k, 6 * k); ctx.fillStyle = ["#5B7DB1", "#E8A55B", "#4E9A5E", "#D9483B"][i % 4]; ctx.fill(); }
    textL(ctx, "09.41", x + w - 90 * k, y + h - 16 * k, 22 * k, "#FFFFFF", 800);
    // the actual error (small dialog near the bottom right of the report window)
    if (o.err !== false){ const ex = x + (o.ex ?? 470) * k, ey = y + (o.ey ?? 700) * k, es = (o.errS || 1) * k;
      ctx.save(); ctx.translate(ex, ey); ctx.scale(es, es); rr(ctx, -70, -26, 140, 52, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(-46, 0, 14, 0, TAU); ctx.fill();
      textC(ctx, "!", -46, 8, 22, "#FFFFFF", 900); textL(ctx, "Gagal simpan", -26, 6, 15, OUT, 800); ctx.restore(); }
    if (o.dim){ const [dx, dy, dw, dh] = o.dim, a = o.dimA ?? .6; ctx.fillStyle = hexA("#0A1222", a); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.rect(x + dx * k + dw * k, y + dy * k, -dw * k, dh * k); ctx.fill("evenodd"); }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function keycap(ctx, txt, x, y, k, hl){ if (k < 0) return 0; const q = eBack(clamp(k / .3, 0, 1)), press = k > .35 && k < .55 ? 8 : 0; fit(ctx, txt, 260, 50, 900); const w = Math.max(110, ctx.measureText(txt).width + 60);
    ctx.save(); ctx.translate(x, y + press); ctx.scale(q, q); rr(ctx, -w / 2, -50, w, 112, 18); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2 + 8, -48 - (8 - press), w - 16, 94, 14); ctx.fillStyle = hl ? ORANGE : "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = hl ? "#FFFFFF" : OUT; ctx.textAlign = "center"; ctx.fillText(txt, 0, 12 - (8 - press)); ctx.textAlign = "left"; ctx.restore(); return w; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
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
    const holds = (f.hold || []).map((h) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1), text: h.text, lines: h.lines, notif: h.notif, screen: h.screen, col: h.col }); }));
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
    if (f.keys){ const K = f.keys, T0 = tOf(s, K, .3, idx), O = K.outCue ? T(s, K.outCue, .9, idx) : (K.out ?? 1e9);
      if (t >= T0 && t < O + .3) ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1);
        (K.caps || []).forEach((row, r) => { const y = (K.y || 300) + r * 170, gap = 70; font(ctx, 900, 50, FAM); const ws = row.map(x => Math.max(110, ctx.measureText(x).width + 60)), tot = ws.reduce((a, b) => a + b, 0) + gap * (row.length - 1);
          let x = 540 - tot / 2; if (K.label && K.label[r]){ popChip(ctx, K.label[r], 540, y - 92, t - T0 - r * .6, NAVY, "#FFFFFF", 28); }
          row.forEach((cap, i) => { const kk = t - T0 - r * .6 - i * .18; keycap(ctx, cap, x + ws[i] / 2, y, kk, i === row.length - 1); if (i < row.length - 1 && kk > .1){ ctx.save(); ctx.globalAlpha *= clamp(kk * 3, 0, 1); outlineWords(ctx, [{ w: "+" }], x + ws[i] + gap / 2, y + 24, 60, { sw: 12 }); ctx.restore(); } x += ws[i] + gap; }); });
        ctx.restore(); }); }
    if (f.steps){ const y0 = f.stepsY || 250; f.steps.forEach((st, j) => { const T0 = tOf(s, st, .3, idx); if (t < T0) return; ovs.push(() => { const q = eBack(clamp((t - T0) / .4, 0, 1)), y = y0 + j * 104;
        ctx.save(); ctx.translate(540 + (1 - q) * -700, y); ctx.rotate(-.015 + j * .012); fit(ctx, st.text, 640, 46, 900); const w = Math.min(860, ctx.measureText(st.text).width + 170);
        rr(ctx, -w / 2, -42, w, 84, 42); ctx.fillStyle = j === f.steps.length - 1 ? ORANGE : CREAM; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.arc(-w / 2 + 44, 0, 30, 0, TAU); ctx.fillStyle = j === f.steps.length - 1 ? CREAM : ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, String(j + 1), -w / 2 + 44, 15, 38, j === f.steps.length - 1 ? ORANGE : "#FFFFFF", 900);
        fit(ctx, st.text, 640, 46, 900); ctx.fillStyle = j === f.steps.length - 1 ? "#FFFFFF" : BROWN; ctx.textAlign = "center"; ctx.fillText(st.text, 40, 16); ctx.textAlign = "left"; ctx.restore(); }); }); }
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
    (f0.steps || []).forEach(p => add(tOf(s, p, .3, i), "whoosh"));
    if (f0.keys) (f0.keys.caps || []).forEach((row, r) => row.forEach((c2, j) => add(tOf(s, f0.keys, .3, i) + r * .6 + j * .18, "pop")));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, tombol, langkah, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= RN38: _kantin (lonely lunch) ================= */
  function tableAt(ctx, x, w, top, col){ ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, w * .55, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#6B4426"; rr(ctx, x - w / 2 + 30, top + 20, 22, GY - top - 20, 6); ctx.fill(); ol(ctx, 4); rr(ctx, x + w / 2 - 52, top + 20, 22, GY - top - 20, 6); ctx.fill(); ol(ctx, 4);
    rr(ctx, x - w / 2, top, w, 34, 10); ctx.fillStyle = col || "#E8A55B"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#FFFFFF", .25); rr(ctx, x - w / 2 + 14, top + 5, w - 28, 8, 4); ctx.fill(); }
  function stool(ctx, x, top){ ctx.fillStyle = "#3B4A6B"; rr(ctx, x - 50, top, 100, 22, 10); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#2C2433"; ctx.fillRect(x - 6, top + 22, 12, GY - top - 22); rr(ctx, x - 40, GY - 10, 80, 12, 6); ctx.fill(); }
  TT.scene(PX + "kantin", "Cerita: kantin kantor, makan sendirian di pojok", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ tables: [{ x: 60, w: 520 }, { x: 1440, w: 520 }], lone: { x: 760, w: 380 }, plates: true }, f.kantin || {});
    const days = (K.days || []).map((d, j) => Object.assign({ T: T(s, d.cue, .3, idx) }, d)), dayOn = days.filter(d => t >= d.T), lastD = dayOn.length ? dayOn[dayOn.length - 1] : null;
    const tPh = T(s, K.phoneCue, .4, idx), top = GY - 250;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { lone: [K.lone.x, top - 300, 1.15] },
      back: (ctx2, c) => {
        // canteen wall over the office backdrop
        ctx.fillStyle = "#F2E3C9"; ctx.fillRect(-2600, -1200, 6400, GY - 190 + 1200);
        ctx.fillStyle = "#CFE3D6"; ctx.fillRect(-2600, GY - 720, 6400, 530); ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 3;
        for (let x = -2600; x < 3800; x += 70){ ctx.beginPath(); ctx.moveTo(x, GY - 720); ctx.lineTo(x, GY - 190); ctx.stroke(); } for (let y = GY - 720; y < GY - 190; y += 70){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
        ctx.fillStyle = "#9A5A34"; ctx.fillRect(-2600, GY - 730, 6400, 14);
        // banner + menu board
        rr(ctx, 160, 520, 560, 120, 20); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7); textC(ctx, K.banner || "KANTIN", 440, 605, 72, "#FFFFFF", 900);
        rr(ctx, -560, 520, 440, 360, 16); ctx.fillStyle = "#2E3B33"; ctx.fill(); ol(ctx, 7); ["NASI AYAM", "SOTO", "ES TEH"].forEach((m, i) => textL(ctx, m, -520, 610 + i * 90, 46, "#F3E6D2", 800));
        // windows with daylight
        [[1180, 470], [1620, 470]].forEach(([x, y]) => { rr(ctx, x, y, 320, 380, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.moveTo(x + 40, y + 340); ctx.lineTo(x + 200, y + 40); ctx.lineTo(x + 250, y + 40); ctx.lineTo(x + 90, y + 340); ctx.fill(); });
        // wall clock spins fast on a day change
        const cx = 920, cy = 640, sp = lastD && t - lastD.T < 1.2 ? 14 : .4; ctx.beginPath(); ctx.arc(cx, cy, 74, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); ol(ctx, 9);
        ctx.strokeStyle = BROWN; ctx.lineCap = "round"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t * sp) * 54, cy - Math.cos(t * sp) * 54); ctx.stroke();
        ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t * sp / 12 + 3) * 32, cy - Math.cos(t * sp / 12 + 3) * 32); ctx.stroke();
        // stools behind the tables
        K.tables.forEach(tb => { for (let k = -1; k <= 1; k++) stool(ctx, tb.x + k * tb.w * .33, top + 70); }); stool(ctx, K.lone.x + 120, top + 70);
      },
      mid: () => {
        K.tables.forEach((tb, j) => { tableAt(ctx, tb.x, tb.w, top, "#E8A55B");
          if (K.plates) for (let k = -1; k <= 1; k++){ const px = tb.x + k * tb.w * .3; ctx.beginPath(); ctx.ellipse(px, top + 2, 46, 14, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = k ? "#E8A55B" : "#4E9A5E"; ctx.beginPath(); ctx.arc(px, top - 6, 16, Math.PI, 0); ctx.fill(); }
          // laughter notes over the groups
          for (let i = 0; i < 3; i++){ const q = (t * .45 + i / 3 + j * .5) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .9; textC(ctx, i % 2 ? "HAHA" : "HIHI", tb.x + (i - 1) * 150, top - 560 - q * 160, 40, ORANGE, 900); ctx.restore(); } });
        tableAt(ctx, K.lone.x, K.lone.w, top, "#C9D3DD");
        ctx.save(); ctx.translate(K.lone.x - 40, top + 4); drawItem(ctx, "tray", 0, 0, t, { s: .9 }); ctx.restore();
        // a cold, untouched drink sweat drop
        if (lastD){ const q = ((t - lastD.T) * .8) % 1; ctx.fillStyle = hexA("#7FB7D6", 1 - q); ctx.beginPath(); ctx.arc(K.lone.x + 22, top - 70 + q * 50, 6, 0, TAU); ctx.fill(); }
      }, midZ: .5,
      over: (ctx2, c, sts) => {
        if (lastD){ const k = t - lastD.T; ctx.save(); const q = eBack(clamp(k / .4, 0, 1)); ctx.translate(540, 300); ctx.rotate(-.04); ctx.scale(q, q);
          chip(ctx, lastD.label, 0, 0, NAVY, "#FFFFFF", 56); ctx.restore(); if (k < .5){ ctx.save(); ctx.globalAlpha = .5 * (1 - k / .5); ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } }
        if (t >= tPh && sts[K.phoneOn ?? 0]){ const st = sts[K.phoneOn ?? 0], h = handOf(st), p = c.toScreen(h[0], h[1] - st.size * .28); popChip(ctx, K.phoneText || "LOWONGAN KERJA", p[0] + 40, p[1], t - tPh, GREEN, "#FFFFFF", 40, -.06);
          burstFx(ctx, p[0] + 40, p[1], t - tPh, GREEN, 10, 150); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kantin || {}; (K.days || []).forEach(d => add(cueT(s, d.cue, .3, i), "whoosh")); if (K.phoneCue) add(cueT(s, K.phoneCue, .4, i), "ping"); });

  /* ================= RN38: _kardus (box of personal things) ================= */
  function exitDoor(ctx, x, t, glowK, open){ const top = GY - 760, w = 300;
    glowAt(ctx, x, top + 380, 420 + 80 * glowK, "#9BE3A8", .25 + .35 * glowK);
    rr(ctx, x - w / 2 - 20, top - 20, w + 40, 760, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#FFF6D9"; ctx.fillRect(x - w / 2, top, w, 740);
    // light rays through the door gap
    ctx.save(); ctx.globalAlpha = .35 + .3 * glowK; ctx.fillStyle = "#FFF3C4"; ctx.beginPath(); ctx.moveTo(x - w / 2, GY - 20); ctx.lineTo(x - w / 2 - 260, GY + 60); ctx.lineTo(x + w / 2 - open * w, GY + 60); ctx.lineTo(x + w / 2 - open * w, GY - 20); ctx.fill(); ctx.restore();
    // door leaf swinging open
    ctx.save(); ctx.translate(x + w / 2, top); ctx.scale(1 - open * .7, 1); rr(ctx, -w, 0, w, 740, 6); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -w + 40, 60, w - 80, 260, 8); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 4; ctx.stroke(); rr(ctx, -w + 40, 380, w - 80, 300, 8); ctx.stroke(); ctx.beginPath(); ctx.arc(-w + 40, 400, 14, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore();
    // green sign
    const b = .5 + .5 * Math.sin(t * 6); rr(ctx, x - 130, top - 140, 260, 90, 12); ctx.fillStyle = mixHex("#2E8B57", "#7CF0A0", glowK * b * .6); ctx.fill(); ol(ctx, 5); textC(ctx, "KELUAR", x - 10, top - 78, 46, "#FFFFFF", 900);
    ctx.save(); ctx.translate(x + 92, top - 96); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(8, 0); ctx.lineTo(-14, 14); ctx.closePath(); ctx.fill(); ctx.restore(); }
  TT.scene(PX + "kardus", "Cerita: kardus barang pribadi (kemas lagi / dibongkar)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 640, mode: "kemas", exitX: -420, ds: .95, name: "TEGAR" }, f.kardus || {}), betah = K.mode === "betah";
    const deskTop = GY - 290 * K.ds, boxX = K.x + 175 * K.ds, boxTop = deskTop - 120;
    const items = (K.items || [{ kind: "mug" }, { kind: "frame" }, { kind: "cactus" }]).map((it, j) => Object.assign({ T: T(s, it.cue, .3 + j * .1, idx), dx: [-230, -120, -20][j % 3] }, it));
    const tExit = T(s, K.exitCue, .4, idx), tName = T(s, K.nameCue, .4, idx), tNote = T(s, K.noteCue, .4, idx);
    base(ctx, s, t, { env: "office", envOpt: Object.assign({ desk: false, plantX: betah ? 1000 : 1040 }, K.envOpt || {}),
      spots: { desk: [K.x, deskTop - 160, 1.2], exit: [K.exitX + 200, GY - 560, .95], box: [boxX, boxTop - 60, 1.3] },
      back: () => { if (!betah) exitDoor(ctx, K.exitX, t, ramp(t, tExit, tExit + .6), .25 + .25 * ramp(t, tExit, tExit + 1.2)); },
      mid: () => {
        prop(ctx, "desk", K.x, GY, { s: K.ds, laptop: betah, lx: -140 }, t);
        // the box
        ctx.save(); ctx.translate(boxX, deskTop); rr(ctx, -110, -150, 220, 150, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-110, -110); ctx.lineTo(110, -110); ctx.stroke(); textC(ctx, "BARANG", 0, -50, 30, "#8E4E2E", 900);
        // flaps
        const flap = betah ? 1 : 1 - ramp(t, items.length ? items[items.length - 1].T + .5 : 1e9, (items.length ? items[items.length - 1].T : 1e9) + 1);
        ctx.fillStyle = "#C98B52"; ctx.save(); ctx.translate(-110, -150); ctx.rotate(-1.9 * flap); rr(ctx, 0, -10, 110, 20, 4); ctx.fill(); ol(ctx, 4); ctx.restore();
        ctx.save(); ctx.translate(110, -150); ctx.rotate(1.9 * flap); rr(ctx, -110, -10, 110, 20, 4); ctx.fill(); ol(ctx, 4); ctx.restore(); ctx.restore();
        // items: kemas = from desk into the box; betah = from box to desk
        items.forEach((it, j) => { const q = eOut(ramp(t, it.T, it.T + .55)), p = betah ? q : 1 - q;
          const dX = K.x + it.dx * K.ds, bX = boxX - 50 + j * 50, x = lerp(bX, dX, p), y = lerp(deskTop - 70, deskTop, p) - Math.sin(q * Math.PI) * 220, inBox = p < .05;
          if (inBox && !betah && t > it.T + .55) return; // hidden inside the box
          ctx.save(); ctx.translate(x, y); ctx.rotate((1 - Math.abs(p * 2 - 1)) * (j % 2 ? .6 : -.6) * (q > 0 && q < 1 ? 1 : 0)); ctx.scale(.95, .95);
          if (it.kind === "mug") mug(ctx, "#FFFFFF"); else if (it.kind === "frame") photoFrame(ctx); else cactus(ctx, t); ctx.restore();
          if (betah && t >= it.T + .5 && t < it.T + 1.3) burstFx(ctx, dX, deskTop - 60, t - it.T - .5, HL, 8, 90); });
        if (betah && t >= tName){ const q = eBack(clamp((t - tName) / .4, 0, 1)); ctx.save(); ctx.translate(K.x - 20, deskTop + 60); ctx.scale(q, q); rr(ctx, -130, -36, 260, 72, 10); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 5); textC(ctx, K.name, 0, 16, 44, GOLD, 900, 230); ctx.restore(); }
        if (betah && t >= tNote){ const q = eBack(clamp((t - tNote) / .4, 0, 1)); ctx.save(); ctx.translate(K.x - 140 * K.ds + 80, deskTop - 300); ctx.rotate(.08); ctx.scale(q, q); rr(ctx, -95, -70, 190, 140, 6); ctx.fillStyle = "#FFE58A"; ctx.fill(); ol(ctx, 4);
          textC(ctx, K.note || "Selamat", 0, -14, 32, BROWN, 900, 170); textC(ctx, K.note2 || "datang!", 0, 30, 32, ORANGE, 900, 170); ctx.restore(); }
      }, midZ: .5 });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kardus || {}; (K.items || []).forEach((it, j) => { if (it.cue) add(cueT(s, it.cue, .3 + j * .1, i), K.mode === "betah" ? "pop" : "whoosh"); });
    if (K.exitCue) add(cueT(s, K.exitCue, .4, i), "ping"); if (K.nameCue) add(cueT(s, K.nameCue, .4, i), "chime"); if (K.noteCue) add(cueT(s, K.noteCue, .4, i), "pop"); });

  /* ================= RN38: _tur (office tour with a guide flag) ================= */
  TT.scene(PX + "tur", "Cerita: tur kantor, papan pintu muncul tiap berhenti", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, U = Object.assign({ stops: [] }, f.tur || {});
    const stops = U.stops.map((st, j) => Object.assign({ T: T(s, st.cue, .3, idx) }, st)), x0 = U.x0 ?? -200, xe = (stops.length ? stops[stops.length - 1].x : 1000) + 700;
    const cols = ["#F3D9B5", "#CFE3D6", "#F6D6C8", "#D9E2F1", "#F3E6B5"];
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      back: (ctx2, c, sts) => {
        stops.forEach((st, j) => { const a = j ? (stops[j - 1].x + st.x) / 2 : x0 - 2000, b = j < stops.length - 1 ? (st.x + stops[j + 1].x) / 2 : xe + 2000; ctx.fillStyle = cols[j % cols.length]; ctx.fillRect(a, -1200, b - a, GY - 190 + 1200);
          ctx.fillStyle = hexA(OUT, .12); ctx.fillRect(b - 8, -1200, 16, GY - 190 + 1200); });
        ctx.fillStyle = "#9A5A34"; ctx.fillRect(-4000, GY - 330, 9000, 22);
        stops.forEach((st, j) => { const dx = st.x + (st.doorDx ?? 230), top = GY - 820, on = t >= st.T, q = popQ(t, st.T, .45);
          rr(ctx, dx - 150, top, 300, 640, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); rr(ctx, dx - 130, top + 20, 260, 600, 6); ctx.fillStyle = on ? "#B5793D" : "#A06A38"; ctx.fill(); ol(ctx, 4);
          ctx.beginPath(); ctx.arc(dx + 100, top + 330, 13, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3);
          if (st.icon){ ctx.save(); ctx.translate(dx, top + 200); icon(ctx, st.icon, 0, 0, 120, hexA(CREAM, .85), 10); ctx.restore(); }
          // sign board swings down on cue
          if (q > 0){ ctx.save(); ctx.translate(dx, top - 30); ctx.rotate(Math.sin((t - st.T) * 7) * .2 * Math.exp(-(t - st.T) * 2.2)); ctx.scale(q, q);
            ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-90, -150); ctx.lineTo(-60, -100); ctx.moveTo(90, -150); ctx.lineTo(60, -100); ctx.stroke();
            font(ctx, 900, 52, FAM); const w = Math.min(560, Math.max(280, ctx.measureText(st.label).width + 80)); rr(ctx, -w / 2, -110, w, 110, 16); ctx.fillStyle = j % 2 ? TEAL : ORANGE; ctx.fill(); ol(ctx, 6);
            textC(ctx, st.label, 0, -38, 52, "#FFFFFF", 900, w - 40); ctx.restore(); }
          if (on && t - st.T < 1) burstFx(ctx, dx, top - 90, t - st.T - .1, HL, 10, 200); });
        // dotted walking trail up to the guide
        const gx = sts[U.guide ?? 0] ? sts[U.guide ?? 0].x : x0; ctx.save(); ctx.setLineDash([26, 22]); ctx.strokeStyle = hexA(ORANGE, .8); ctx.lineWidth = 12; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x0, GY + 30); ctx.lineTo(gx, GY + 30); ctx.stroke(); ctx.restore();
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); ((f.tur || {}).stops || []).forEach(st => { if (st.cue){ add(cueT(s, st.cue, .3, i), "whoosh"); add(cueT(s, st.cue, .3, i) + .3, "ping"); } }); });

  /* ================= KD38: _jelajah (the screenshot as a giant world) ================= */
  function cursorAt(ctx, x, y, s){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 120); ctx.lineTo(30, 92); ctx.lineTo(52, 140); ctx.lineTo(72, 130); ctx.lineTo(50, 84); ctx.lineTo(90, 84); ctx.closePath();
    ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 8); ctx.restore(); }
  TT.scene(PX + "jelajah", "Cerita: tangkapan layar sebagai dunia raksasa, tokoh mungil mencari error", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, L = Object.assign({ w: 3600, errX: 930, errY: 470, errS: .32 }, f.layar || {});
    const k = L.w / 1000, h = 800 * k, x0 = L.x0 ?? -1260, y0 = GY + 50 * k - h;
    const tHint = T(s, L.hintCue, .4, idx), errW = [x0 + L.errX * k, y0 + L.errY * k];
    base(ctx, s, t, { env: "info", envOpt: {},
      spots: { err: [errW[0], errW[1], 1.1], all: [x0 + L.w / 2, y0 + h / 2, 1080 / (L.w + 300)] },
      back: () => {
        ctx.fillStyle = "#14101A"; ctx.fillRect(x0 - 3000, GY + 50 * k, L.w + 6000, 2000);
        miniShot(ctx, x0, y0, L.w, h, t, { ex: L.errX, ey: L.errY, errS: L.errS });
        // scroll of chat bubbles and a wandering giant cursor keep the world alive
        const cx = x0 + (560 + Math.sin(t * .7) * 180) * k, cy = y0 + (330 + Math.cos(t * .5) * 120) * k; cursorAt(ctx, cx, cy, k * .9);
        for (let i = 0; i < 3; i++){ const q = (t * .25 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); rr(ctx, x0 + 640 * k, y0 + (500 - q * 380) * k, 200 * k, 44 * k, 16 * k); ctx.fillStyle = "#D7F5C9"; ctx.fill(); ol(ctx, 6); ctx.restore(); }
        if (t >= tHint){ const b = .5 + .5 * Math.sin((t - tHint) * 8); ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.globalAlpha = .6 + .4 * b; ctx.beginPath(); ctx.arc(errW[0], errW[1], 160 + 30 * b, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
      },
      over: (ctx2, c) => { if (t >= tHint){ const p = c.toScreen(errW[0], errW[1] - 220); popChip(ctx, L.hintText || "SEKECIL INI?!", p[0], Math.max(260, p[1]), t - tHint, RED, "#FFFFFF", 44, -.05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const L = f.layar || {}; if (L.hintCue) add(cueT(s, L.hintCue, .4, i), "ping"); });

  /* ================= KD38: _mondar (walking back and forth) ================= */
  TT.scene(PX + "mondar", "Cerita: bolak-balik antar meja, jejak kaki, penghitung", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ L: 160, R: 1300, ds: .85, label: "BOLAK-BALIK" }, f.mondar || {});
    const trips = (M.trips || []).map((cu, j) => T(s, cu, .3 + j * .03, idx)), n = trips.filter(x => t >= x).length, lastT = trips.filter(x => t >= x).pop() ?? -9;
    const tClock = T(s, M.clockCue, .4, idx), deskTop = GY - 290 * M.ds;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { mid: [(M.L + M.R) / 2, 1000, .78], clock: [(M.L + M.R) / 2, 560, 1.1] },
      back: () => {
        // big wall clock between the desks
        const cx = (M.L + M.R) / 2, cy = 560, sp = t >= tClock ? 9 : 2.2;
        ctx.beginPath(); ctx.arc(cx, cy, 130, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); ol(ctx, 12);
        for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.fillStyle = BROWN; ctx.beginPath(); ctx.arc(cx + Math.sin(a) * 104, cy - Math.cos(a) * 104, 7, 0, TAU); ctx.fill(); }
        ctx.strokeStyle = BROWN; ctx.lineCap = "round"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t * sp) * 96, cy - Math.cos(t * sp) * 96); ctx.stroke();
        ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t * sp / 12 + 1) * 60, cy - Math.cos(t * sp / 12 + 1) * 60); ctx.stroke();
        if (t >= tClock){ for (let r = 0; r < 3; r++){ const w = ((t - tClock) * 1.4 + r / 3) % 1; ctx.strokeStyle = hexA(RED, .6 * (1 - w)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, 140 + w * 90, 0, TAU); ctx.stroke(); } }
        // worn path + footprints
        const wear = clamp(n / Math.max(1, trips.length), 0, 1); ctx.fillStyle = hexA("#7A4A2E", .12 + .35 * wear); ctx.beginPath(); ctx.ellipse((M.L + M.R) / 2, GY + 30, (M.R - M.L) / 2 - 60, 36 + 20 * wear, 0, 0, TAU); ctx.fill();
        const prints = Math.round(n * 6); for (let i = 0; i < prints; i++){ const u = rnd(i * 3 + 1), x = lerp(M.L + 180, M.R - 180, u), y = GY + 30 + (i % 2 ? 14 : -14) + (rnd(i + 7) - .5) * 30;
          ctx.save(); ctx.translate(x, y); ctx.rotate(i % 3 ? 0 : Math.PI); ctx.fillStyle = hexA(OUT, .35); ctx.beginPath(); ctx.ellipse(0, 0, 20, 9, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(24, 0, 7, 0, TAU); ctx.fill(); ctx.restore(); }
      },
      mid: () => { prop(ctx, "desk", M.L, GY, { s: M.ds, laptop: true, lx: 40, papers: true }, t); prop(ctx, "desk", M.R, GY, { s: M.ds, laptop: true, lx: -40, mug: true }, t);
        // dust puffs where the walker turns around
        trips.forEach((x, j) => { const k = t - x; if (k < 0 || k > .7) return; const px = j % 2 ? M.L + 230 : M.R - 230; for (let i = 0; i < 5; i++){ ctx.fillStyle = hexA("#D9C3A5", .7 * (1 - k / .7)); ctx.beginPath(); ctx.arc(px + (i - 2) * 30 * (1 + k), GY + 10 - k * 40 * rnd(i), 16 + k * 26, 0, TAU); ctx.fill(); } }); }, midZ: .5,
      over: () => { if (n > 0){ const txt = M.label + " ×" + n; ctx.save(); const q = eBack(clamp((t - lastT) / .35, 0, 1)); ctx.translate(540, 300); ctx.rotate(-.03); ctx.scale(.7 + .3 * q, .7 + .3 * q); chip(ctx, txt, 0, 0, RED, "#FFFFFF", 50); ctx.restore(); }
        if (t >= tClock && M.clockText) popChip(ctx, M.clockText, 540, 420, t - tClock, NAVY, "#FFFFFF", 44, .04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.mondar || {}; (M.trips || []).forEach((cu, j) => add(cueT(s, cu, .3 + j * .03, i), "whoosh")); if (M.clockCue) add(cueT(s, M.clockCue, .4, i), "ping"); });

  /* ================= KD38: _tandai (crop, circle, arrow, note) ================= */
  TT.scene(PX + "tandai", "Cerita: tangkapan layar dipotong, dilingkari spidol, diberi keterangan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, D = Object.assign({ x: 620, y: 780, w: 700, region: [290, 540, 400, 320], ex: 470, ey: 700, note: "Klik SIMPAN, lalu muncul ini" }, f.tandai || {});
    const tCrop = T(s, D.cropCue, .3, idx), tCirc = T(s, D.circleCue, .3, idx), tArr = T(s, D.arrowCue, .3, idx), tNote = T(s, D.noteCue, .2, idx), tSend = T(s, D.sendCue, .4, idx), tDone = T(s, D.doneCue, .5, idx);
    const bw = D.w, bh = D.w * .8;
    let board = null;
    base(ctx, s, t, { env: "info", envOpt: { spotX: D.x },
      spots: { board: [D.x, D.y, 1.12] },
      front: () => {
        const fly = eOut(ramp(t, tSend, tSend + .7)), bx = D.x + fly * 900, by = D.y - fly * 260 - Math.sin(t * 1.4) * 8, sc = 1 - fly * .6;
        ctx.save(); ctx.translate(bx, by); ctx.rotate(-.02 + fly * .3); ctx.scale(sc, sc);
        // board frame
        rr(ctx, -bw / 2 - 26, -bh / 2 - 26, bw + 52, bh + 52, 24); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 8);
        ctx.save(); rr(ctx, -bw / 2, -bh / 2, bw, bh, 12); ctx.clip();
        const [rx, ry, rw, rh] = D.region, zq = easeIO(ramp(t, tCrop + .9, tCrop + 1.5)), z = lerp(1, 1000 / rw, zq), ox = lerp(0, rx, zq), oy = lerp(0, ry, zq), k = bw / 1000;
        const map = (sx, sy) => [-bw / 2 + (sx - ox) * z * k, -bh / 2 + (sy - oy) * z * k];
        ctx.save(); ctx.translate(-bw / 2, -bh / 2); ctx.scale(z, z); ctx.translate(-ox * k, -oy * k);
        const dimA = t >= tCrop ? .62 * ramp(t, tCrop + .3, tCrop + .7) * (1 - zq) : 0;
        miniShot(ctx, 0, 0, bw, bh, t, { ex: D.ex, ey: D.ey, errS: 1, dim: dimA > 0 ? D.region : null, dimA });
        ctx.restore();
        // crop handles closing in
        if (t >= tCrop && zq < 1){ const q = easeIO(ramp(t, tCrop, tCrop + .7)), a = map(lerp(0, rx, q), lerp(0, ry, q)), b = map(lerp(1000, rx + rw, q), lerp(800, ry + rh, q));
          ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.setLineDash([16, 10]); ctx.lineDashOffset = -t * 40; ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.setLineDash([]);
          ctx.strokeStyle = ORANGE; ctx.lineWidth = 14; ctx.lineCap = "square"; const L = 46;
          [[a[0], a[1], 1, 1], [b[0], a[1], -1, 1], [a[0], b[1], 1, -1], [b[0], b[1], -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x + sx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * L); ctx.stroke(); }); }
        // red marker circle around the error
        const E = map(D.ex, D.ey), cp = ramp(t, tCirc, tCirc + .9);
        if (cp > 0){ const rx2 = 92 * z * k * 1.1, ry2 = 44 * z * k * 1.3; ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath();
          for (let a = 0; a <= cp * TAU * 1.08; a += .08){ const wob = 1 + .05 * Math.sin(a * 3); const px = E[0] + Math.cos(a - 2.4) * rx2 * wob, py = E[1] + Math.sin(a - 2.4) * ry2 * wob; a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
          if (cp < 1){ const a = cp * TAU * 1.08 - 2.4; board = [E[0] + Math.cos(a) * rx2, E[1] + Math.sin(a) * ry2]; } }
        // arrow
        const ap = easeIO(ramp(t, tArr, tArr + .5)); if (ap > 0) arrowLine(ctx, E[0] - 300, E[1] - 230, E[0] - 110, E[1] - 60, GOLD, 16, ap);
        ctx.restore();
        // pen sprite while drawing
        if (board) drawItem(ctx, "marker", board[0] + 20, board[1] - 60, t, { s: 1.1, rot: .2 });
        // note strip under the board, typed in
        if (t >= tNote){ const q = eBack(clamp((t - tNote) / .35, 0, 1)), nch = Math.floor(clamp((t - tNote - .2) * 22, 0, D.note.length)); ctx.save(); ctx.translate(0, bh / 2 + 70); ctx.rotate(.02); ctx.scale(q, q);
          rr(ctx, -bw / 2 + 20, -48, bw - 40, 96, 16); ctx.fillStyle = "#FFE58A"; ctx.fill(); ol(ctx, 6); fit(ctx, D.note, bw - 100, 44, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(D.note.slice(0, nch), 0, 15); ctx.textAlign = "left"; ctx.restore(); }
        ctx.restore();
      },
      over: (ctx2, c) => { if (t >= tSend){ popChip(ctx, D.sendText || "TERKIRIM ✓", 760, 330, t - tSend - .3, GREEN, "#FFFFFF", 50, -.04); }
        if (t >= tDone){ stampBox(ctx, D.doneText || "BERES 5 MENIT", 540, 780, t - tDone, GREEN, 70, -.08); burstFx(ctx, 540, 780, t - tDone - .1, GREEN, 14, 300); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const D = f.tandai || {}; if (D.cropCue) add(cueT(s, D.cropCue, .3, i), "whoosh"); if (D.circleCue) add(cueT(s, D.circleCue, .3, i), "pop");
    if (D.arrowCue) add(cueT(s, D.arrowCue, .3, i), "pop"); if (D.noteCue) add(cueT(s, D.noteCue, .2, i), "pop"); if (D.sendCue) add(cueT(s, D.sendCue, .4, i), "whoosh"); if (D.doneCue) add(cueT(s, D.doneCue, .5, i) + .05, "chime"); });

  /* ================= JS38: coffee shop pieces ================= */
  function cafeBack(ctx, t, o){ o = o || {};
    ctx.fillStyle = o.wall || "#2F4A3E"; ctx.fillRect(-3000, -1400, 7000, GY - 190 + 1400);
    // brick hints
    ctx.fillStyle = hexA("#000000", .08); for (let r = 0; r < 26; r++) for (let c = 0; c < 30; c++){ if (rnd(r * 31 + c) > .35) continue; rr(ctx, -1500 + c * 150 + (r % 2) * 75, -300 + r * 70, 130, 54, 6); ctx.fill(); }
    // chalk menu
    const mx = o.menuX ?? 120; rr(ctx, mx - 260, 330, 520, 420, 16); ctx.fillStyle = "#1E2A24"; ctx.fill(); ctx.strokeStyle = "#9A5A34"; ctx.lineWidth = 18; ctx.stroke();
    textC(ctx, "MENU", mx, 410, 56, "#F3E6D2", 900); ["KOPI SUSU   18", "AMERICANO  15", "TEH TARIK   12"].forEach((m, i) => textC(ctx, m, mx, 490 + i * 72, 38, "#F3E6D2", 700));
    // shelf with jars
    const sx = o.shelfX ?? 760; ctx.fillStyle = "#9A5A34"; rr(ctx, sx - 260, 640, 520, 22, 6); ctx.fill(); ol(ctx, 4);
    for (let i = 0; i < 5; i++){ const x = sx - 210 + i * 104; rr(ctx, x - 36, 540, 72, 100, 14); ctx.fillStyle = hexA("#FFFFFF", .55); ctx.fill(); ol(ctx, 4); ctx.fillStyle = ["#6B4426", "#8E4E2E", "#3B2418", "#C98B62", "#6B4426"][i]; rr(ctx, x - 30, 580, 60, 56, 10); ctx.fill(); rr(ctx, x - 30, 528, 60, 18, 6); ctx.fillStyle = ORANGE; ctx.fill(); }
    // pendant lamps
    [o.lampA ?? 300, o.lampB ?? 900].forEach((lx, i) => { const sw = Math.sin(t * 1.1 + i * 2) * .05; ctx.save(); ctx.translate(lx, -600); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 820); ctx.stroke();
      glowAt(ctx, 0, 900, 300, "#FFD9A0", .35); ctx.beginPath(); ctx.arc(0, 860, 70, Math.PI, 0); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.restore(); });
    // floor
    ctx.fillStyle = "#6B4426"; ctx.fillRect(-3000, GY - 190, 7000, 1400); ctx.fillStyle = hexA("#000000", .15); for (let x = -3000; x < 4000; x += 120){ ctx.fillRect(x, GY - 190, 6, 1400); } }
  function counterAt(ctx, x0, x1, top, t, o){ o = o || {};
    if (!o.onlyReg){ rr(ctx, x0, top + 30, x1 - x0, GY - top, 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = hexA("#000000", .12); for (let x = x0 + 60; x < x1; x += 120) ctx.fillRect(x, top + 50, 10, GY - top - 60);
    rr(ctx, x0 - 20, top, x1 - x0 + 40, 40, 10); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 6); }
    if (o.machX != null){ const mx = o.machX; rr(ctx, mx - 120, top - 230, 240, 230, 16); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 6); rr(ctx, mx - 100, top - 210, 200, 70, 10); ctx.fillStyle = "#2C2433"; ctx.fill();
      ctx.beginPath(); ctx.arc(mx - 40, top - 176, 12, 0, TAU); ctx.fillStyle = Math.sin(t * 5) > 0 ? GREEN : "#2F5E3E"; ctx.fill(); ctx.fillStyle = "#4A4A52"; rr(ctx, mx - 30, top - 130, 60, 40, 6); ctx.fill();
      smoke(ctx, mx + 60, top - 240, t, 1, { n: 6, h: 220, col: "#FFFFFF", s: .7, speed: .8 }); }
    if (o.regX != null){ const rx = o.regX; rr(ctx, rx - 90, top - 130, 180, 130, 14); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 6); rr(ctx, rx - 70, top - 112, 140, 50, 6); ctx.fillStyle = "#BFE2EA"; ctx.fill();
      textC(ctx, o.regText || "KASIR", rx, top - 76, 26, NAVY, 900, 130); } }
  TT.scene(PX + "kedai", "Cerita: kedai kopi, antrean panjang, pesanan tertukar", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x0: -200, x1: 900, machX: 40, regX: 640, cupX: 560 }, f.kedai || {});
    const top = GY - 330, tWrong = T(s, K.wrongCue, .3, idx), tTimer = T(s, K.timerCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { cup: [K.cupX, top - 120, 1.3], queue: [K.queueX ?? 1100, 1050, .85] },
      back: () => cafeBack(ctx, t, K.back),
      mid: () => { counterAt(ctx, K.x0, K.x1, top, t, { machX: K.machX, regX: K.regX });
        // the wrong cup slides onto the counter
        if (t >= tWrong - .4){ const q = eOut(ramp(t, tWrong - .4, tWrong)); ctx.save(); ctx.translate(lerp(K.machX, K.cupX, q), top); ctx.rotate(Math.sin((t - tWrong) * 18) * .08 * Math.exp(-Math.max(0, t - tWrong) * 3)); cupC(ctx, K.cupName || "BUDI", "#FFFFFF"); ctx.restore();
          if (t >= tWrong){ ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = "round"; const p = ramp(t, tWrong, tWrong + .4); ctx.beginPath(); ctx.moveTo(K.cupX - 50, top - 120); ctx.lineTo(K.cupX - 50 + 100 * p, top - 120 + 70 * p); ctx.stroke(); } } }, midZ: .5,
      over: (ctx2, c) => {
        if (t >= tWrong){ const p = c.toScreen(K.cupX, top - 260); popChip(ctx, K.wrongText || "PESANAN TERTUKAR", p[0], 430, t - tWrong, RED, "#FFFFFF", 46, -.05); }
        if (t >= tTimer){ const q = clamp((t - tTimer) / 1.4, 0, 1), m = Math.round(lerp(1, K.mins || 20, eOut(q))); ctx.save(); const k = eBack(clamp((t - tTimer) / .35, 0, 1)); ctx.translate(540, 300); ctx.scale(k, k); ctx.rotate(.03);
          const w = chip(ctx, "ANTRE " + m + " MENIT", 40, 0, NAVY, "#FFFFFF", 50); ctx.beginPath(); ctx.arc(40 - w / 2 - 30, 0, 44, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5);
          ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(40 - w / 2 - 30, 0); ctx.lineTo(40 - w / 2 - 30 + Math.sin(t * 8) * 30, -Math.cos(t * 8) * 30); ctx.stroke(); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kedai || {}; if (K.wrongCue) add(cueT(s, K.wrongCue, .3, i), "ping"); if (K.timerCue) add(cueT(s, K.timerCue, .3, i), "pop"); });

  /* ================= JS38: _alarm (smoke alarm = complaint) ================= */
  function pan(ctx, x, top, t, k, dir){ dir = dir || 1; glowAt(ctx, x, top - 10, 120, "#FF9A3C", .35 * k); for (let i = 0; i < 5; i++){ const h = (24 + 18 * Math.abs(Math.sin(t * 9 + i))) * k; ctx.fillStyle = i % 2 ? "#FF9A3C" : GOLD; ctx.beginPath(); ctx.moveTo(x - 50 + i * 25, top); ctx.quadraticCurveTo(x - 60 + i * 25, top - h, x - 50 + i * 25 + 6, top - h - 10); ctx.quadraticCurveTo(x - 38 + i * 25, top - h * .5, x - 36 + i * 25, top); ctx.fill(); }
    ctx.fillStyle = "#2C2433"; ctx.beginPath(); ctx.moveTo(x - 110, top - 20); ctx.lineTo(x + 110, top - 20); ctx.lineTo(x + 90, top - 90); ctx.lineTo(x - 90, top - 90); ctx.closePath(); ctx.fill(); ol(ctx, 5); rr(ctx, dir > 0 ? x + 100 : x - 240, top - 80, 140, 20, 8); ctx.fill(); ol(ctx, 4); }
  TT.scene(PX + "alarm", "Cerita: alarm asap di dapur kedai, asap ditelusuri ke sumbernya", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, A = Object.assign({ x: 540, srcs: [] }, f.alarm || {}), top = GY - 330, ceil = 240;
    const srcs = A.srcs.map((p, j) => Object.assign({ T: T(s, p.cue, .3, idx), F: T(s, p.fixCue, .4, idx) }, p)), tBeep = A.beepCue ? T(s, A.beepCue, .1, idx) : 0, tHand = T(s, A.handCue, .3, idx);
    const tStop = srcs.length ? Math.max(...srcs.map(p => p.F)) : 1e9, beeping = t >= tBeep && t < tStop;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { alarm: [A.x, ceil + 160, 1.35], pans: [(srcs[0] ? srcs[0].x : 540) / 2 + (srcs[1] ? srcs[1].x : 540) / 2, top - 260, 1.0] },
      back: () => {
        ctx.fillStyle = "#F4F1EA"; ctx.fillRect(-3000, -1400, 7000, GY - 190 + 1400); ctx.strokeStyle = "#D9D3C7"; ctx.lineWidth = 3;
        for (let x = -3000; x < 4000; x += 90){ ctx.beginPath(); ctx.moveTo(x, ceil); ctx.lineTo(x, GY - 190); ctx.stroke(); } for (let y = ceil; y < GY - 190; y += 90){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(4000, y); ctx.stroke(); }
        ctx.fillStyle = "#E3D6C2"; ctx.fillRect(-3000, -1400, 7000, ceil + 1400); ctx.fillStyle = "#9A5A34"; ctx.fillRect(-3000, ceil - 14, 7000, 18);
        ctx.fillStyle = "#6B4426"; ctx.fillRect(-3000, GY - 190, 7000, 1400);
        // smoke columns from the pans up to the ceiling
        srcs.forEach((p, j) => { const on = t >= p.T ? (1 - ramp(t, p.F, p.F + .8)) * ramp(t, p.T, p.T + .6) : 0; if (on > 0) smoke(ctx, p.x, top - 90, t + j, on, { n: 10, h: top - 90 - ceil, s: 1.3, col: "#7C7C86", speed: .35, drift: (A.x - p.x) * .8 }); });
        // smoke alarm on the ceiling
        const shake = beeping ? Math.sin(t * 60) * 3 : 0; ctx.save(); ctx.translate(A.x + shake, ceil + 6);
        ctx.beginPath(); ctx.ellipse(0, 0, 130, 46, 0, 0, Math.PI); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#E9E4DA"; rr(ctx, -90, 10, 180, 18, 8); ctx.fill();
        const led = beeping && Math.sin(t * 14) > 0; ctx.beginPath(); ctx.arc(70, 22, 10, 0, TAU); ctx.fillStyle = led ? RED : "#7A2A22"; ctx.fill(); if (led) glowAt(ctx, 70, 22, 70, RED, .6); ctx.restore();
        if (beeping) for (let r = 0; r < 3; r++){ const w = ((t - tBeep) * 1.8 + r / 3) % 1; ctx.strokeStyle = hexA(RED, .7 * (1 - w)); ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(A.x, ceil + 30, 150 + w * 200, .25, Math.PI - .25); ctx.stroke(); }
        if (t >= tStop && t < tStop + 1) burstFx(ctx, A.x, ceil + 60, t - tStop, GREEN, 10, 200);
      },
      mid: () => { counterAt(ctx, -400, 1500, top, t, {}); srcs.forEach((p, j) => { const fx = ramp(t, p.F, p.F + .8); pan(ctx, p.x, top, t + j, 1 - fx * .7, p.x > A.x ? -1 : 1);
          // lid drops on fix
          if (t >= p.F - .3){ const q = eOut(ramp(t, p.F - .3, p.F)); ctx.save(); ctx.translate(p.x, lerp(top - 400, top - 92, q)); ctx.beginPath(); ctx.ellipse(0, 0, 100, 26, 0, Math.PI, 0); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -30, 14, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ctx.restore();
            if (t >= p.F && t < p.F + .9) burstFx(ctx, p.x, top - 130, t - p.F, GREEN, 8, 120); } }); }, midZ: .5,
      over: (ctx2, c) => {
        if (beeping){ const p = c.toScreen(A.x, ceil + 230); const ph = ((t - tBeep) * 1.6) % 1; if (ph < .6) popWord(ctx, "BIP! BIP!", clamp(p[0], 300, 780), clamp(p[1], 300, 1200), ph, { size: 84, hold: .6, rot: -4 }); }
        srcs.forEach((p, j) => { if (t < p.T) return; const sp = c.toScreen(p.x, top - 330); const done = t >= p.F; popChip(ctx, (done ? "✓ " : "") + p.label, sp[0], clamp(sp[1], 280, 1220), t - p.T, done ? GREEN : RED, "#FFFFFF", 38, j % 2 ? .05 : -.05); });
        if (t >= tHand && A.handText){ popChip(ctx, A.handText, 540, 300, t - tHand, ORANGE, "#FFFFFF", 46, -.04); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.alarm || {}; const tb = A.beepCue ? cueT(s, A.beepCue, .1, i) : 0; for (let k = 0; k < 4; k++) add(tb + k * .62, "ping");
    (A.srcs || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); if (p.fixCue) add(cueT(s, p.fixCue, .4, i), "chime"); }); if (A.handCue) add(cueT(s, A.handCue, .3, i), "pop"); });

  /* ================= JS38: _gelas (names on cups, faster queue) ================= */
  TT.scene(PX + "gelas", "Cerita: nama ditulis di gelas, antrean makin cepat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gl = Object.assign({ x0: -300, x1: 1400, cups: [], from: 20, to: 7, reg2X: 1000 }, f.gelas || {}), top = GY - 330;
    const cups = Gl.cups.map((cu, j) => Object.assign({ T: T(s, cu.cue, .25 + j * .05, idx) }, cu)), tSlide = T(s, Gl.slideCue, .3, idx), tTimer = T(s, Gl.timerCue, .3, idx), tReg = T(s, Gl.regCue, .3, idx);
    let pen = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { cups: [cups.length ? (cups[0].x + cups[cups.length - 1].x) / 2 : 540, top - 160, 1.15], reg2: [Gl.reg2X, top - 200, 1.0] },
      back: () => cafeBack(ctx, t, Object.assign({ wall: "#3C5A6B", menuX: -340, shelfX: 1300 }, Gl.back || {})),
      mid: () => { counterAt(ctx, Gl.x0, Gl.x1, top, t, { regX: Gl.reg1X ?? 160 });
        if (t >= tReg - .2){ const q = eBack(clamp((t - tReg + .2) / .45, 0, 1)); ctx.save(); ctx.translate(Gl.reg2X, top); ctx.scale(q, q); ctx.translate(-Gl.reg2X, -top); counterAt(ctx, 0, 0, top, t, { onlyReg: true, regX: Gl.reg2X, regText: "KASIR 2" }); ctx.restore();
          if (t >= tReg && t < tReg + 1) burstFx(ctx, Gl.reg2X, top - 80, t - tReg, HL, 10, 160); }
        cups.forEach((cu, j) => { const wp = ramp(t, cu.T, cu.T + .7), sl = eOut(ramp(t, tSlide + j * .15, tSlide + j * .15 + .6)), x = cu.x + sl * (cu.dx ?? 260);
          ctx.save(); ctx.translate(x, top - sl * 40); ctx.rotate(sl > 0 && sl < 1 ? Math.sin(sl * Math.PI) * .12 : 0); ctx.scale(1.4, 1.4); cupC(ctx, cu.name, "#FFFFFF", { p: wp }); ctx.restore();
          if (wp > 0 && wp < 1) pen = [x - 56 + 112 * wp, top - 110]; if (wp >= 1 && t - cu.T < 1.4) burstFx(ctx, x, top - 110, t - cu.T - .7, HL, 8, 110); });
        if (pen) drawItem(ctx, "marker", pen[0] + 10, pen[1] - 70, t, { s: 1, col: "#2C2433" }); }, midZ: .5,
      over: () => { if (t >= tTimer){ const q = ramp(t, tTimer, tTimer + 1.6), m = Math.round(lerp(Gl.from, Gl.to, eOut(q))); ctx.save(); const k = eBack(clamp((t - tTimer) / .35, 0, 1)); ctx.translate(540, 300); ctx.scale(k, k); ctx.rotate(-.03);
          chip(ctx, "ANTRE " + m + " MENIT", 0, 0, q >= 1 ? GREEN : NAVY, "#FFFFFF", 54); ctx.restore(); if (q >= 1 && t - tTimer - 1.6 < 1) burstFx(ctx, 540, 300, t - tTimer - 1.6, GREEN, 12, 260); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gl = f.gelas || {}; (Gl.cups || []).forEach((cu, j) => { if (cu.cue) add(cueT(s, cu.cue, .25 + j * .05, i), "pop"); });
    if (Gl.slideCue) add(cueT(s, Gl.slideCue, .3, i), "whoosh"); if (Gl.timerCue) add(cueT(s, Gl.timerCue, .3, i) + 1.6, "chime"); if (Gl.regCue) add(cueT(s, Gl.regCue, .3, i), "ping"); });

  /* ================= SC38: _bocor (leaking boat = interest) ================= */
  TT.scene(PX + "bocor", "Cerita: perahu bocor, lubang bunga, menimba, menambal", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ x: 540, wl: 1350, w: 980, leaks: [], lv0: .15 }, f.bocor || {});
    const leaks = B.leaks.map((l, j) => Object.assign({ T: l.cue ? T(s, l.cue, .3, idx) : 0, P: T(s, l.patchCue, .4, idx), H: T(s, l.tapeCue, .4, idx) }, l));
    const tBail = T(s, B.bailCue, .3, idx), floorY = B.wl + 90, hullTop = B.wl - 150, hullBot = B.wl + 140, x0 = B.x - B.w / 2, x1 = B.x + B.w / 2;
    // water level 0..1 inside the boat: integrates the open leak flow minus bailing
    const flowAt = tt => leaks.reduce((a, l) => a + (tt >= l.T ? (tt >= l.P ? 0 : (tt >= l.H ? .55 : 1) * (l.rate || 1)) : 0), 0);
    let lv = B.lv0; for (let tt = 0; tt < t; tt += .1){ lv += (flowAt(tt) * .006 - (tt >= tBail ? .012 : 0)) ; lv = clamp(lv, .08, .9); }
    const wy = lerp(floorY + 30, hullTop + 40, lv);
    base(ctx, s, t, { env: "sky", envOpt: { time: B.time || "day", hills: false },
      spots: { boat: [B.x, B.wl - 260, 1.0] },
      back: () => {
        // sea
        ctx.fillStyle = "#3E7DB5"; ctx.fillRect(-3000, B.wl - 60, 7000, 2000); ctx.fillStyle = hexA("#FFFFFF", .25);
        for (let r = 0; r < 4; r++) for (let i = -20; i < 30; i++){ const x = i * 160 + ((t * (30 + r * 12)) % 160) - r * 40, y = B.wl - 40 + r * 70; ctx.beginPath(); ctx.ellipse(x, y, 50, 6, 0, 0, TAU); ctx.fill(); }
        // boat back wall (cut-away interior)
        ctx.save(); ctx.translate(0, Math.sin(t * 1.6) * 6); ctx.beginPath(); ctx.moveTo(x0 - 60, hullTop); ctx.lineTo(x1 + 60, hullTop); ctx.quadraticCurveTo(x1 + 20, hullBot, x1 - 120, hullBot); ctx.lineTo(x0 + 120, hullBot); ctx.quadraticCurveTo(x0 - 20, hullBot, x0 - 60, hullTop); ctx.closePath();
        ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 7); ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 4; for (let y = hullTop + 50; y < hullBot; y += 50){ ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
        // signs above each leak
        leaks.forEach((l, j) => { if (t < l.T) return; const done = t >= l.P, q = popQ(t, l.T, .4); ctx.save(); ctx.translate(l.x, hullTop - 80); ctx.scale(q, q); chipW(ctx, (done ? "✓ " : "") + l.label, 0, 0, done ? GREEN : (l.rate >= 2.5 ? RED : ORANGE), "#FFFFFF", l.size || 32); ctx.restore(); });
        ctx.restore();
      },
      front: () => {
        ctx.save(); ctx.translate(0, Math.sin(t * 1.6) * 6);
        // water inside (semi transparent, wavy top)
        ctx.save(); ctx.beginPath(); ctx.moveTo(x0 - 40, hullTop); ctx.lineTo(x1 + 40, hullTop); ctx.quadraticCurveTo(x1 + 10, hullBot - 10, x1 - 120, hullBot - 10); ctx.lineTo(x0 + 120, hullBot - 10); ctx.quadraticCurveTo(x0 - 10, hullBot - 10, x0 - 40, hullTop); ctx.clip();
        ctx.fillStyle = hexA("#5FA8D9", .78); ctx.beginPath(); ctx.moveTo(x0 - 100, hullBot + 40); for (let x = x0 - 100; x <= x1 + 100; x += 20) ctx.lineTo(x, wy + Math.sin(x * .02 + t * 4) * 8); ctx.lineTo(x1 + 100, hullBot + 40); ctx.closePath(); ctx.fill(); ctx.restore();
        // leaks: jets spraying in
        leaks.forEach((l, j) => { if (t < l.T) return; const ly = hullBot - 40 - (l.dy || 0), str = t >= l.P ? 0 : (t >= l.H ? .45 : 1) * (l.rate || 1);
          ctx.beginPath(); ctx.arc(l.x, ly, 16 + 6 * (l.rate || 1), 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill();
          if (str > 0){ const hgt = 90 + 90 * str; for (let i = 0; i < 6; i++){ const q = (t * 2.4 + i / 6) % 1, dx = (i - 2.5) * 12 * str, x = l.x + dx * q * 2, y = ly - Math.sin(q * Math.PI) * hgt - q * 20; ctx.fillStyle = hexA("#BFE2EA", .9 * (1 - q * .5)); ctx.beginPath(); ctx.arc(x, y, 9 + 5 * str, 0, TAU); ctx.fill(); }
            ctx.strokeStyle = hexA("#E6F6FB", .9); ctx.lineWidth = 8 + 6 * str; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(l.x, ly); ctx.quadraticCurveTo(l.x + 10, ly - hgt * 1.1, l.x + 30 * str, ly - hgt * .2); ctx.stroke(); }
          // half tape
          if (t >= l.H && t < l.P){ ctx.save(); ctx.translate(l.x, ly); ctx.rotate(-.5 + Math.sin(t * 7) * .1); ctx.fillStyle = "#D9C39A"; ctx.fillRect(-40, -12, 80, 24); ol(ctx, 3); ctx.restore(); }
          // full patch
          if (t >= l.P - .25){ const q = eBack(clamp((t - l.P + .25) / .35, 0, 1)); ctx.save(); ctx.translate(l.x, ly); ctx.scale(q, q); rr(ctx, -60, -46, 120, 92, 10); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 5);
            ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-50, -38); ctx.lineTo(50, 38); ctx.moveTo(50, -38); ctx.lineTo(-50, 38); ctx.stroke(); ctx.restore(); if (t >= l.P && t < l.P + .9) burstFx(ctx, l.x, ly, t - l.P, GREEN, 8, 130); } });
        // hull front outline only (cut-away)
        ctx.beginPath(); ctx.moveTo(x0 - 60, hullTop); ctx.quadraticCurveTo(x0 - 20, hullBot, x0 + 120, hullBot); ctx.lineTo(x1 - 120, hullBot); ctx.quadraticCurveTo(x1 + 20, hullBot, x1 + 60, hullTop); ctx.strokeStyle = "#5A3A22"; ctx.lineWidth = 26; ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        rr(ctx, x0 - 80, hullTop - 18, B.w + 160, 30, 12); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5);
        // bailing splashes over the side
        if (t >= tBail){ for (let i = 0; i < 4; i++){ const q = ((t - tBail) * 1.4 + i / 4) % 1, x = lerp(B.bailX ?? B.x + 100, x1 + 200, q), y = hullTop - 120 - Math.sin(q * Math.PI) * 200; ctx.fillStyle = hexA("#BFE2EA", 1 - q); ctx.beginPath(); ctx.arc(x, y, 18 - q * 8, 0, TAU); ctx.fill(); } }
        ctx.restore();
        // sea in front
        ctx.fillStyle = "#2F6A9E"; ctx.beginPath(); ctx.moveTo(-3000, 3000); for (let x = -3000; x <= 4000; x += 40) ctx.lineTo(x, hullBot - 30 + Math.sin(x * .012 + t * 2.2) * 14); ctx.lineTo(4000, 3000); ctx.closePath(); ctx.fill();
      },
      over: () => { if (B.meter !== false){ const q = clamp(lv, 0, 1); ctx.save(); ctx.translate(930, 520); rr(ctx, -38, -170, 76, 340, 38); ctx.fillStyle = hexA(CREAM, .92); ctx.fill(); ol(ctx, 6);
          ctx.save(); rr(ctx, -26, -158, 52, 316, 26); ctx.clip(); ctx.fillStyle = q > .6 ? RED : "#3E7DB5"; ctx.fillRect(-26, 158 - 316 * q, 52, 316 * q); ctx.restore(); textC(ctx, "AIR", 0, 220, 34, "#FFFFFF", 900); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.bocor || {}; (B.leaks || []).forEach(l => { if (l.cue) add(cueT(s, l.cue, .3, i), "ping"); if (l.tapeCue) add(cueT(s, l.tapeCue, .4, i), "pop"); if (l.patchCue) add(cueT(s, l.patchCue, .4, i), "chime"); });
    if (B.bailCue) add(cueT(s, B.bailCue, .3, i), "whoosh"); });

  /* ================= SC38: _samsak (debt punching bags) ================= */
  TT.scene(PX + "samsak", "Cerita: samsak utang dengan bar nyawa, bunga menambal, fokus sampai LUNAS", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sm = Object.assign({ bags: [], hits: [], marks: [] }, f.samsak || {});
    const hits = Sm.hits.map((h, j) => Object.assign({ T: T(s, h.cue, .3 + (h.k || 0) * .12, idx) }, h)).sort((a, b) => a.T - b.T), marks = Sm.marks.map(m => Object.assign({ T: T(s, m.cue, .3, idx) }, m));
    const st = Sm.bags.map((b, j) => { let hp = b.hp, last = b.T0 || 0, ko = -1, lastHit = -9; for (const h of hits){ if (h.bag !== j || h.T > t) continue; hp = Math.min(b.hp, hp + (b.regen || 0) * (h.T - last)); hp -= h.dmg || 1; last = h.T; lastHit = h.T; if (hp <= 0 && ko < 0){ ko = h.T; hp = 0; break; } }
      if (ko < 0) hp = Math.min(b.hp, hp + (b.regen || 0) * Math.max(0, t - last)); return { hp, ko, lastHit, regenOn: ko < 0 && hp < b.hp - .01 && (b.regen || 0) > 0 }; });
    const beamY = Sm.beamY || 380;
    base(ctx, s, t, { env: "info", envOpt: { horizon: 1300 },
      spots: Object.fromEntries(Sm.bags.map((b, j) => ["bag" + j, [b.x, 780, 1.15]])),
      back: () => {
        // gym wall + ring ropes
        ctx.fillStyle = "#2B2433"; ctx.fillRect(-3000, -1400, 7000, GY - 190 + 1400); ctx.fillStyle = "#3A3145"; for (let x = -3000; x < 4000; x += 300) ctx.fillRect(x, -1400, 150, GY - 190 + 1400);
        ctx.fillStyle = "#4A3A2A"; ctx.fillRect(-3000, GY - 190, 7000, 1400); ctx.fillStyle = hexA("#FFFFFF", .06); for (let x = -3000; x < 4000; x += 140) ctx.fillRect(x, GY - 190, 8, 1400);
        ctx.fillStyle = "#1E1A18"; rr(ctx, -600, beamY - 30, 2300, 44, 12); ctx.fill(); ol(ctx, 5);
        [-500, 1600].forEach(x => { glowAt(ctx, x < 540 ? 200 : 880, 100, 500, "#FFE7B0", .18); });
        Sm.bags.forEach((b, j) => { const S = st[j], drop = S.ko >= 0 ? eOut(ramp(t, S.ko + .25, S.ko + .9)) : 0, hk = t - S.lastHit, sw = hk >= 0 && hk < 1.2 ? Math.sin(hk * 10) * .25 * Math.exp(-hk * 3) : Math.sin(t * 1.3 + j) * .02;
          ctx.save(); ctx.translate(b.x, beamY + 10);
          if (drop < .05){ ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.rotate(sw); ctx.lineTo(0, 200); ctx.stroke(); } else ctx.rotate(sw);
          ctx.translate(0, drop * (GY - beamY - 760) ); ctx.rotate(drop * (j % 2 ? .5 : -.5));
          const bw = b.w || 210, bh = b.h || 560; rr(ctx, -bw / 2, 200, bw, bh, bw / 2.4); ctx.fillStyle = b.col || RED; ctx.fill(); ol(ctx, 7);
          ctx.fillStyle = hexA("#FFFFFF", .18); rr(ctx, -bw / 2 + 24, 230, 36, bh - 80, 18); ctx.fill(); ctx.fillStyle = "#1E1A18"; rr(ctx, -bw / 2 - 6, 330, bw + 12, 26, 8); ctx.fill(); rr(ctx, -bw / 2 - 6, 200 + bh - 140, bw + 12, 26, 8); ctx.fill();
          const lab = lines2(ctx, b.label, bw - 30, 38, 900); lab.L.forEach((l, i) => textC(ctx, l, 0, 470 + i * lab.size * 1.1, lab.size, "#FFFFFF", 900)); ctx.restore();
          // HP bar
          if (drop < .5){ const q = clamp(S.hp / b.hp, 0, 1), bx = b.x - 150, by = beamY - 140; rr(ctx, bx, by, 300, 44, 22); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5);
            if (q > 0){ rr(ctx, bx + 6, by + 6, Math.max(20, 288 * q), 32, 16); ctx.fillStyle = q > .5 ? "#E0503A" : GOLD; ctx.fill(); }
            if (S.regenOn){ for (let i = 0; i < 2; i++){ const qq = (t * .9 + i / 2 + j * .3) % 1; ctx.save(); ctx.globalAlpha = 1 - qq; textC(ctx, "+BUNGA", b.x + 120, by - 20 - qq * 90, 30, "#7CF0A0", 900); ctx.restore(); } } }
          if (S.ko >= 0 && t >= S.ko + .6) stampBox(ctx, "LUNAS!", b.x, 900, t - S.ko - .6, GREEN, 64, -.1);
          if (S.ko >= 0 && t >= S.ko + .6 && t < S.ko + 1.6) burstFx(ctx, b.x, 900, t - S.ko - .6, GREEN, 14, 240);
          if (hk >= 0 && hk < .6){ const h = hits.filter(x => x.bag === j && x.T <= t).pop(); popWord(ctx, "-" + (h ? h.dmg || 1 : 1), b.x + 120, beamY + 390, hk, { size: 70, hold: .6, rot: 8 }); burstFx(ctx, b.x - 60, beamY + 450, hk, GOLD, 8, 110); } });
        marks.forEach(m => { if (t < m.T) return; const b = Sm.bags[m.bag], k = t - m.T, pul = .5 + .5 * Math.sin(k * 6); ctx.strokeStyle = hexA(GOLD, .5 + .5 * pul); ctx.lineWidth = 12; ctx.setLineDash([24, 16]); ctx.lineDashOffset = -k * 60;
          rr(ctx, b.x - (b.w || 210) / 2 - 30, beamY + 180, (b.w || 210) + 60, (b.h || 560) + 60, 60); ctx.stroke(); ctx.setLineDash([]); });
      },
      over: (ctx2, c) => { marks.forEach((m, j) => { if (t < m.T || (m.outCue && t > T(s, m.outCue, .5, idx))) return; const b = Sm.bags[m.bag], p = c.toScreen(b.x, 1040); popChip(ctx, m.text, p[0], clamp(p[1], 300, 1220), t - m.T, NAVY, GOLD, 38, j % 2 ? .05 : -.05); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Sm = f.samsak || {}; (Sm.hits || []).forEach(h => add(cueT(s, h.cue, .3 + (h.k || 0) * .12, i), "pop")); (Sm.marks || []).forEach(m => add(cueT(s, m.cue, .3, i), "ping")); });

  /* ================= SC38: _kulkas (payoff chart on the fridge) ================= */
  TT.scene(PX + "kulkas", "Cerita: bagan pelunasan di pintu kulkas, kotak diwarnai, bintang LUNAS", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 640, rows: [], rate: 1.6 }, f.kulkas || {});
    const fw = 540, fTop = GY - 1120, cx = K.x, chartX = cx - 250, chartY = fTop + 110, cw = 500, ch = 560, rowH = 150;
    const tFill = T(s, K.fillCue, .3, idx), tStar = T(s, K.starCue, .4, idx), tMove = T(s, K.moveCue, .3, idx);
    // boxes coloured: row 0 fills from tFill at K.rate per s; after tMove the next row fills faster (two at a time)
    const filled = K.rows.map((r, j) => { if (j === 0) return Math.min(r.n, Math.floor(Math.max(0, t - tFill) * K.rate) + (t >= tFill ? 1 : 0));
      const base0 = t >= tFill ? Math.min(r.pre || 0, Math.floor((t - tFill) * K.rate * .5)) : 0; return Math.min(r.n, base0 + (t >= tMove + .6 ? Math.floor((t - tMove - .6) * K.rate * 1.5) * (j === 1 ? 2 : 0) : 0)); });
    let penAt = null;
    base(ctx, s, t, { env: "home", envOpt: Object.assign({ time: "day", lampX: 160 }, K.envOpt || {}),
      spots: { chart: [cx, chartY + ch / 2 + 40, 1.45] },
      back: () => {
        // fridge
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(cx, GY + 6, fw * .6, 22, 0, 0, TAU); ctx.fill();
        rr(ctx, cx - fw / 2, fTop, fw, GY - fTop, 40); ctx.fillStyle = "#E9F1F4"; ctx.fill(); ol(ctx, 8); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx - fw / 2, fTop + 760); ctx.lineTo(cx + fw / 2, fTop + 760); ctx.stroke();
        rr(ctx, cx + fw / 2 - 50, fTop + 120, 20, 260, 10); ctx.fillStyle = "#9AA6B2"; ctx.fill(); rr(ctx, cx + fw / 2 - 50, fTop + 820, 20, 180, 10); ctx.fill();
        [[cx - 180, fTop + 830, ORANGE], [cx + 60, fTop + 900, GREEN], [cx - 40, fTop + 1000, GOLD]].forEach(([x, y, col], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t + i) * .05); ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore(); });
        // chart paper with tape
        ctx.save(); ctx.translate(chartX + cw / 2, chartY + ch / 2); ctx.rotate(-.015); ctx.translate(-cw / 2, -ch / 2);
        rr(ctx, 0, 0, cw, ch, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#E8D8A8", .85); ctx.save(); ctx.translate(cw / 2, -6); ctx.rotate(.05); ctx.fillRect(-60, -16, 120, 32); ctx.restore();
        textC(ctx, K.title || "RENCANA LUNAS", cw / 2, 60, 40, BROWN, 900, cw - 40);
        K.rows.forEach((r, j) => { const y = 110 + j * rowH, n = r.n, bw = Math.min(48, (cw - 40) / Math.min(n, 6) - 8), per = Math.min(n, 6), lab = lines2(ctx, r.label, cw - 40, 30, 900);
          textL(ctx, r.label, 20, y + 30, lab.size, j === 0 ? ORANGE : BROWN, 900);
          for (let i = 0; i < n; i++){ const bx = 20 + (i % per) * (bw + 8), by = y + 48 + Math.floor(i / per) * (bw * .55 + 8), bh2 = n > 6 ? bw * .55 : bw; rr(ctx, bx, by, bw, bh2, 6); ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 3; ctx.stroke();
            if (i < filled[j]){ ctx.fillStyle = j === 0 ? GREEN : ORANGE; rr(ctx, bx + 4, by + 4, bw - 8, bh2 - 8, 4); ctx.fill(); if (i === filled[j] - 1) penAt = [chartX + bx + bw / 2, chartY + by + bh2 / 2]; } }
          if (r.amt){ textL(ctx, r.amt, cw - 150, y + 30, 26, hexA(BROWN, .8), 800, 130); } });
        // arrow moving the freed amount to the next row
        const mp = easeIO(ramp(t, tMove, tMove + .6)); if (mp > 0) arrowLine(ctx, cw - 70, 150, cw - 70, 110 + rowH + 40, ORANGE, 12, mp);
        ctx.restore();
        if (t >= tStar){ const q = eBack(clamp((t - tStar) / .45, 0, 1)); ctx.save(); ctx.translate(chartX + cw - 60, chartY + 150); ctx.rotate(-.2 + (1 - q) * 2); ctx.scale(q, q); ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 40 : 92; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); textC(ctx, "LUNAS", 0, 12, 28, BROWN, 900); ctx.restore();
          if (t < tStar + 1) burstFx(ctx, chartX + cw - 60, chartY + 150, t - tStar, GOLD, 12, 200); }
      },
      over: (ctx2, c) => { if (t >= tMove && K.moveText){ const p = c.toScreen(chartX + cw + 40, chartY + 230); popChip(ctx, K.moveText, p[0], clamp(p[1], 280, 1200), t - tMove, ORANGE, "#FFFFFF", 40, .05); }
        if (K.months && t >= tFill){ const m = Math.min(K.months, 1 + Math.floor((t - tFill) * K.rate * .5)); chip(ctx, "BULAN KE-" + m, 540, 300, NAVY, "#FFFFFF", 46); } } });
    void penAt;
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kulkas || {}; if (K.fillCue){ const a = cueT(s, K.fillCue, .3, i); for (let k = 0; k < 3; k++) add(a + k / (K.rate || 1.6), "pop"); }
    if (K.starCue) add(cueT(s, K.starCue, .4, i), "chime"); if (K.moveCue) add(cueT(s, K.moveCue, .3, i), "whoosh"); });

  /* ================= MS38: _rekam (REC viewfinder replays the mother) ================= */
  TT.scene(PX + "rekam", "Cerita: jendela REC di atas anak memutar ulang gaya ibunya", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rk = Object.assign({ on: 0, x: 400, y: 470, w: 470, h: 340, label: "REKAMAN KEMARIN" }, f.rekam || {});
    const tRec = T(s, Rk.recCue, .3, idx), tCopy = T(s, Rk.copyCue, .4, idx), tOut = T(s, Rk.outCue, .8, idx);
    base(ctx, s, t, { env: "park", envOpt: Object.assign({ bench: false }, Rk.envOpt || {}),
      over: (ctx2, c, sts, R) => {
        if (t < tRec || t > tOut + .4) return; const k = t - tRec, q = eBack(clamp(k / .45, 0, 1)) * (1 - clamp((t - tOut) / .4, 0, 1)), st = sts[Rk.on];
        const { x, y, w, h } = Rk;
        // dotted link to the child's head
        if (st && R[Rk.on]){ const hd = R[Rk.on].screen.top; ctx.save(); ctx.globalAlpha *= q; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 50; ctx.strokeStyle = CREAM; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(hd[0], hd[1] - 20); ctx.stroke(); ctx.restore(); }
        ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.rotate(-.03);
        rr(ctx, -w / 2 - 14, -h / 2 - 14, w + 28, h + 28, 22); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6);
        ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 12); ctx.clip();
        // replay: mini kitchen + the mother in the same pose
        ctx.fillStyle = "#7A4528"; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = "#4E2A17"; ctx.fillRect(-w / 2, h / 2 - 60, w, 60);
        ctx.fillStyle = "#BFE2EA"; rr(ctx, w / 2 - 150, -h / 2 + 30, 110, 120, 8); ctx.fill(); ol(ctx, 4);
        if (Rk.replay){ const a = Object.assign({ x: 0, size: 520, y: 0 }, Rk.replay), mst = toonState(a, s, t); mst.x = -30; mst.y = h / 2 + 250; mst.size = a.size;
          TT.drawToon(ctx, a, mst, t); }
        // VHS lines
        ctx.fillStyle = hexA("#FFFFFF", .06); for (let yy = -h / 2; yy < h / 2; yy += 8) ctx.fillRect(-w / 2, yy, w, 3);
        const band = ((t * .4) % 1) * h - h / 2; ctx.fillStyle = hexA("#FFFFFF", .12); ctx.fillRect(-w / 2, band, w, 18);
        ctx.restore();
        // corners + REC
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; const L = 34;
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const cx = sx * (w / 2 - 18), cy = sy * (h / 2 - 18); ctx.beginPath(); ctx.moveTo(cx, cy - sy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx - sx * L, cy); ctx.stroke(); });
        if (Math.sin(t * 6) > -.3){ ctx.beginPath(); ctx.arc(-w / 2 + 50, -h / 2 + 46, 13, 0, TAU); ctx.fillStyle = RED; ctx.fill(); } textL(ctx, "REC", -w / 2 + 72, -h / 2 + 58, 34, "#FFFFFF", 900);
        textL(ctx, "▶ " + Rk.label, -w / 2 + 30, h / 2 - 26, 26, "#FFFFFF", 800, w - 60);
        ctx.restore();
        if (t >= tCopy){ popWord(ctx, Rk.copyText || "PERSIS!", x + 60, y + h / 2 + 90, t - tCopy, { size: 100, hold: 1.6, rot: -7 }); if (t - tCopy < .3){ ctx.save(); ctx.globalAlpha = .45 * (1 - (t - tCopy) / .3); ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rk = f.rekam || {}; if (Rk.recCue){ add(cueT(s, Rk.recCue, .3, i), "ping"); add(cueT(s, Rk.recCue, .3, i) + .1, "whoosh"); } if (Rk.copyCue) add(cueT(s, Rk.copyCue, .4, i), "chime"); });

  /* ================= MS38: _kepala (ear vs eye inside a child's head) ================= */
  function framePic(ctx, kind, t){ rr(ctx, -80, -70, 160, 140, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.save(); rr(ctx, -68, -58, 136, 100, 4); ctx.clip();
    ctx.fillStyle = kind === "calm" ? "#CFE7D6" : "#F6C9B8"; ctx.fillRect(-68, -58, 136, 100);
    ctx.fillStyle = "#E2A77C"; ctx.beginPath(); ctx.arc(0, -6, 26, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.fillStyle = kind === "calm" ? TEAL : "#7A3B8F"; ctx.beginPath(); ctx.arc(0, -10, 30, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(28, 30); ctx.lineTo(-28, 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#E2A77C"; ctx.beginPath(); ctx.arc(0, -2, 19, 0, TAU); ctx.fill(); ctx.fillStyle = OUT;
    if (kind === "calm"){ ctx.beginPath(); ctx.arc(0, 4, 8, 0, Math.PI); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(44, -36, 10, 0, TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.ellipse(0, 8, 7, 9, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 4; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(30 + i * 8, -30 + i * 14); ctx.lineTo(50 + i * 8, -36 + i * 14); ctx.stroke(); } }
    ctx.restore(); }
  TT.scene(PX + "kepala", "Cerita: kepala anak: nasihat masuk telinga lalu menguap, contoh masuk lewat mata dan tersimpan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Kp = Object.assign({ x: 640, y: 820, r: 330, words: [], pics: [], src: [130, 1180] }, f.kepala || {});
    const words = Kp.words.map((w, j) => Object.assign({ T: T(s, w.cue, .3, idx) }, w)), pics = Kp.pics.map((p, j) => Object.assign({ T: T(s, p.cue, .3, idx) }, p));
    const ear = [Kp.x - Kp.r * .45, Kp.y + 30], eye = [Kp.x + Kp.r * .55, Kp.y - 40], strip = j => [Kp.x - 150 + j * 165, Kp.y - 120];
    base(ctx, s, t, { env: "info", envOpt: { spotX: Kp.x },
      spots: { head: [Kp.x, Kp.y, 1.0], ear: [ear[0], ear[1], 1.4], eye: [eye[0], eye[1], 1.4] },
      back: () => {
        const R0 = Kp.r, br = 1 + Math.sin(t * 2) * .01; ctx.save(); ctx.translate(Kp.x, Kp.y); ctx.scale(br, br);
        // head profile facing right
        glowAt(ctx, 0, 0, R0 * 1.5, "#FFE2B4", .18);
        ctx.beginPath(); ctx.arc(0, 0, R0, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); ol(ctx, 8);
        ctx.beginPath(); ctx.ellipse(R0 * .93, R0 * .05, 46, 60, 0, 0, TAU); ctx.fill(); ol(ctx, 7); ctx.beginPath(); ctx.arc(0, 0, R0 - 4, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill();
        // hair
        ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.arc(0, 0, R0 + 4, Math.PI * .92, Math.PI * 1.9); ctx.quadraticCurveTo(R0 * .3, -R0 * .55, -R0 * .2, -R0 * .45); ctx.quadraticCurveTo(-R0 * .7, -R0 * .2, -R0 * .9, R0 * .3); ctx.closePath(); ctx.fill();
        // cut-away window (mind)
        ctx.save(); ctx.beginPath(); ctx.ellipse(-70, -120, R0 * .6, R0 * .34, 0, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.stroke(); ctx.restore();
        textC(ctx, Kp.mindLabel || "INGATAN", -70, -120 - R0 * .34 - 18, 30, BROWN, 900);
        // eye + brow + mouth
        const blink = (t % 3.4) < .12 ? .15 : 1; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(R0 * .55, -40, 40, 48 * blink, 0, 0, TAU); ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(R0 * .6, -36, 20, 24 * blink, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(R0 * .42, -112); ctx.lineTo(R0 * .72, -104); ctx.stroke();
        ctx.beginPath(); ctx.arc(R0 * .66, 110, 34, .2, Math.PI * .8); ctx.stroke();
        // ear
        ctx.beginPath(); ctx.ellipse(-R0 * .45, 30, 52, 74, 0, 0, TAU); ctx.fillStyle = "#D98F62"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(-R0 * .45, 30, 24, 40, 0, 0, TAU); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 5; ctx.stroke();
        ctx.restore();
        // pictures already filed on the strip inside the head
        pics.forEach((p, j) => { const q = ramp(t, p.T, p.T + 1.2); if (q <= 0) return; const sp = strip(j), e = easeIO(q), mid = [eye[0] + 60, eye[1] - 20];
          let x, y, sc; if (q < .45){ const u = q / .45; x = lerp(1250, mid[0], u); y = lerp(220, mid[1], u) - Math.sin(u * Math.PI) * 80; sc = 1.4 - .4 * u; } else { const u = (q - .45) / .55; x = lerp(mid[0], sp[0], easeIO(u)); y = lerp(mid[1], sp[1], easeIO(u)); sc = 1 - .2 * u; }
          ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate((j % 2 ? .06 : -.06) * e); framePic(ctx, p.kind, t); ctx.restore();
          if (q >= 1 && t - p.T - 1.2 < .8) burstFx(ctx, sp[0], sp[1], t - p.T - 1.2, HL, 8, 120); });
      },
      over: (ctx2, c) => {
        words.forEach((w, j) => { const k = t - w.T; if (k < 0 || k > 2.4) return; const e = c.toScreen(ear[0] - 40, ear[1]), sx = c.toScreen(Kp.src[0], Kp.src[1]);
          let x, y, a = 1, rot = 0; if (k < .8){ const u = eOut(k / .8); x = lerp(sx[0] + 40, e[0] - 60, u); y = lerp(sx[1] - 80, e[1], u) - Math.sin(u * Math.PI) * 120; }
          else { const u = (k - .8) / 1.6, tp = c.toScreen(Kp.x - Kp.r * .2, Kp.y - Kp.r * 1.15); x = lerp(e[0] + 20, tp[0] + Math.sin(u * 9) * 30, eOut(u)); y = lerp(e[1], tp[1] - 60, eOut(u)); rot = Math.sin(u * 7) * .2; a = 1 - u; ctx.save(); ctx.globalAlpha *= (1 - u) * .8; smoke(ctx, x, y + 50, t, 1, { n: 4, h: 80, s: .5, col: "#C9D3DD" }); ctx.restore(); }
          const sc = k < .8 ? 1 : 1 - .5 * (k - .8) / 1.6; ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); ctx.translate(x, y); ctx.rotate(rot - .05); ctx.scale(sc, sc); chip(ctx, w.text, 0, 0, CREAM, BROWN, 36); ctx.restore();
          if (k > .78 && k < 1.3){ const p = c.toScreen(Kp.x - Kp.r * .2, Kp.y - Kp.r * 1.1); popWord(ctx, "PUFF", p[0] + 90, p[1], k - .78, { size: 48, hold: .5, rot: 8 }); } });
        if (Kp.earTag && t >= T(s, Kp.earTagCue, .3, idx)){ const p = c.toScreen(ear[0] - 40, ear[1] + 150); popChip(ctx, Kp.earTag, p[0], p[1], t - T(s, Kp.earTagCue, .3, idx), NAVY, "#FFFFFF", 36, -.05); }
        if (Kp.eyeTag && t >= T(s, Kp.eyeTagCue, .3, idx)){ const p = c.toScreen(eye[0] + 40, eye[1] - 150); popChip(ctx, Kp.eyeTag, p[0], p[1], t - T(s, Kp.eyeTagCue, .3, idx), ORANGE, "#FFFFFF", 40, .05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Kp = f.kepala || {}; (Kp.words || []).forEach(w => { add(cueT(s, w.cue, .3, i), "whoosh"); add(cueT(s, w.cue, .3, i) + .8, "pop"); });
    (Kp.pics || []).forEach(p => { add(cueT(s, p.cue, .3, i), "whoosh"); add(cueT(s, p.cue, .3, i) + 1.2, "chime"); }); if (Kp.eyeTagCue) add(cueT(s, Kp.eyeTagCue, .3, i), "pop"); if (Kp.earTagCue) add(cueT(s, Kp.earTagCue, .3, i), "pop"); });

  /* ================= MS38: _napas (breathing rings) ================= */
  TT.scene(PX + "napas", "Cerita: lingkar napas tarik/hembus, anak ikut meniru", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, N = Object.assign({ rings: [{ on: 0, r: 260, d: 0 }], period: 4 }, F0.napas || {});
    const t0 = T(s, N.startCue, .3, idx), tEnd = N.endCue ? T(s, N.endCue, .6, idx) : 1e9;
    const br = d => { const tt = t - t0 - d; if (tt < 0 || t > tEnd) return 0; const ph = (tt % N.period) / N.period; return ph < .5 ? easeIO(ph / .5) : 1 - easeIO((ph - .5) / .5); };
    const phase = () => { const tt = t - t0; if (tt < 0 || t > tEnd) return null; return ((tt % N.period) / N.period) < .5 ? "TARIK..." : "HEMBUS..."; };
    base(ctx, s, t, { env: "sunset", envOpt: {},
      under: (ctx2, c, sts, j) => { (N.rings || []).filter(r => r.on === j).forEach(r => { const st = sts[j]; if (!st) return; const hd = toonHead(st), b = br(r.d || 0), R0 = (r.r || 240) * (st.size / 700) * (1 + .35 * b), a = t >= t0 && t <= tEnd ? 1 : 0;
          if (!a) return; glowAt(ctx, hd[0], hd[1] + st.size * .15, R0 * 1.6, "#FFE2B4", .25 + .25 * b); ctx.beginPath(); ctx.arc(hd[0], hd[1] + st.size * .15, R0, 0, TAU); ctx.strokeStyle = hexA(CREAM, .5 + .4 * b); ctx.lineWidth = 10 + 6 * b; ctx.stroke();
          for (let i = 0; i < 8; i++){ const an = i / 8 * TAU + t * .4; sparkle(ctx, hd[0] + Math.cos(an) * R0, hd[1] + st.size * .15 + Math.sin(an) * R0, 10 + 6 * b, i % 2 ? GOLD : CREAM); } }); },
      over: () => { const p = phase(); if (p && N.label !== false){ const b = br(0); ctx.save(); ctx.translate(540, 300); ctx.scale(.9 + .2 * b, .9 + .2 * b); chip(ctx, p, 0, 0, p[0] === "T" ? TEAL : ORANGE, "#FFFFFF", 54); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const N = f.napas || {}; if (N.startCue){ const a = cueT(s, N.startCue, .3, i); for (let k = 0; k < 3; k++) add(a + k * (N.period || 4), "chime"); } });
})();
