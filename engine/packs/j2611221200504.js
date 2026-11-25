/* Scene pack j2611221200504: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SP36, RN36, KD36, JS36, SC36.
   Layout prefix j2611221200504_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots [{at|cue, env, envOpt, toons, cam, props, cards, chips, piece:false}]  hard cut (cream flash) to a new shot inside one scene
     hold  [{on, kind, at|cue, out|outCue, s}]  object in a toon's hand: net, book, notepad, wallet, tea, trumpet, palm (ink on the hand), paper, phone ...
     chips [{at|cue, outCue, text, x, y, dark|bg|fg, size}]  screen chips      pops [{cue, text}] big outlined words      confetti {cue}
     toon.motor {col, parkCue, parkX}   the toon rides a scooter (use pose "sit" + y = 1640 - 20*size/92), parks it at parkCue
     halte {x, busCue, seat}            bus stop shelter with bench, a bus passes      dust {x, label}   untouched dusty report with cobweb on a desk
   Set pieces (layout suffix):
     _kupu     idea butterflies (bulb bodies, labels) pop out of a toon's head and fly away (mode "kabur"), or a net swings and they are
               caught into one open pocket book whose lines write themselves (mode "tangkap")                   f.kupu
     _angkot   thought bubble: the head is a crowded minibus; task passengers squeeze in, luggage labels pile on the roof, two get thrown out  f.angkot
     _cecer    home: tissue on a side table, ink on the palm, a receipt, a fridge sticky note; each scrap pops up big, the ink smears  f.cecer
     _sekat    cubicle partition: the checker pops up from behind it at different spots asking "Sudah sampai mana?", counter CEK KE-n  f.sekat
     _kartu    focus = a tower of slide cards on the desk: collapses at every check (mode "runtuh") or grows to the top (mode "tinggi")  f.kartu
     _rapat    full-screen video meeting 2x2: tiles with toons, names and mic icons; a rooster crows in one tile's window  f.rapat
     _tv       the host in her office in front of a wall screen: camera-off tiles, strange display names type in, "?" + time runs  f.tv
     _bising   home: blender, kid's trumpet and a passing motorbike send sound ribbons into the laptop's open mic  f.bising
     _mik      giant mic button on a pedestal: slapped to mute (noise critters sucked in), on for one's turn; the display name is retyped  f.mik
     _bengkel  warm motorbike workshop: arrival with squeaky brake + "KUNJUNGAN KE-5" (datang), a key tag written and hung on the
               customer key board (kunci), hearts + glowing tag at a warm welcome (sambut)                       f.bengkel
     _sayap    payday night: GAJI envelope, banknotes grow wings and fly into the night sky, SALDO counter to zero, date flips  f.sayap
     _gurun    desert: the toon chases a shimmering "BALIK MODAL" oasis that keeps receding; items blow away; it vanishes  f.gurun
     _adegan   generic story shot with the extras above */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221200504_";
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

  /* ---------- extra hand-held items of this pack (origin = hand) ---------- */
  const ITEMS = {
    net(ctx, t, o){ ctx.rotate(-.5 + (o.swing || 0)); ctx.fillStyle = "#9B6A3C"; rr(ctx, -8, -40, 16, 260, 7); ctx.fill(); ol(ctx, 4);
      ctx.translate(0, -40); ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(0, -80, 62, 80, 0, 0, TAU); ctx.stroke();
      ctx.save(); ctx.beginPath(); const sag = 40 + Math.sin(t * 3) * 8; ctx.moveTo(-62, -80); ctx.quadraticCurveTo(-70 + (o.swing || 0) * 60, 40 + sag, 0, 60 + sag); ctx.quadraticCurveTo(70, 40 + sag, 62, -80); ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fill(); ctx.clip(); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 2.5;
      for (let i = -6; i <= 6; i++){ ctx.beginPath(); ctx.moveTo(i * 16 - 80, -160); ctx.lineTo(i * 16 + 80, 160); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i * 16 + 80, -160); ctx.lineTo(i * 16 - 80, 160); ctx.stroke(); }
      ctx.restore(); },
    book(ctx, t, o){ const w = o.w || 120, h = o.h || 160; ctx.rotate(-.06); rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = o.col || ORANGE; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = CREAM; rr(ctx, -w / 2 + 14, -h + 20, w - 28, 34, 6); ctx.fill(); ctx.fillStyle = "#2C2433"; ctx.fillRect(w / 2 - 22, -h, 10, h); },
    notepad(ctx, t, o){ ctx.rotate(-.1); rr(ctx, -60, -80, 120, 150, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#9AA6B2"; for (let i = 0; i < 5; i++) ctx.fillRect(-46 + i * 22, -88, 8, 16);
      ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++) ctx.fillRect(-44, -50 + i * 26, 60 + rnd(i) * 30, 8); },
    wallet(ctx, t, o){ rr(ctx, -70, -50, 140, 96, 14); ctx.fillStyle = "#6B3F25"; ctx.fill(); ol(ctx, 5); rr(ctx, 10, -22, 70, 40, 10); ctx.fillStyle = "#8E5A36"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(52, -2, 8, 0, TAU); ctx.fill(); if (o.cash !== false){ ctx.fillStyle = "#7FBF7F"; rr(ctx, -56, -70, 90, 34, 4); ctx.fill(); ol(ctx, 3); } },
    tea(ctx, t, o){ rr(ctx, -30, -60, 60, 62, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(32, -32, 14, -1.3, 1.3); ctx.stroke();
      for (let k = 0; k < 3; k++){ const q = ((t * .5 + k / 3) % 1); ctx.globalAlpha = .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-10 + k * 10, -70 - q * 70); ctx.quadraticCurveTo(0 + k * 10, -90 - q * 70, -10 + k * 10, -110 - q * 70); ctx.stroke(); } ctx.globalAlpha = 1; },
    trumpet(ctx, t, o){ ctx.rotate(-.35 + Math.sin(t * 9) * .05); ctx.fillStyle = GOLD; rr(ctx, -10, -12, 150, 24, 10); ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.moveTo(130, -14); ctx.lineTo(200, -50); ctx.lineTo(200, 50); ctx.lineTo(130, 14); ctx.closePath(); ctx.fillStyle = "#F08C2E"; ctx.fill(); ol(ctx, 4); },
    palm(ctx, t, o){ ctx.rotate(-.3); ctx.beginPath(); ctx.ellipse(0, -40, 60, 74, 0, 0, TAU); ctx.fillStyle = o.skin || "#E2A77C"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = hexA("#2F4F9E", .75); ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-34, -70 + i * 26); for (let j = 0; j < 6; j++) ctx.lineTo(-34 + j * 13, -70 + i * 26 + (j % 2 ? -8 : 6)); ctx.stroke(); } },
  };
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (ITEMS[kind]) ITEMS[kind](ctx, t, o);
    else if (kind === "shovel"){ ctx.fillStyle = "#9B6A3C"; rr(ctx, -9, -150, 18, 300, 8); ctx.fill(); ol(ctx, 4); rr(ctx, -34, -176, 68, 30, 10); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.moveTo(-48, 140); ctx.lineTo(48, 140); ctx.lineTo(38, 230); ctx.quadraticCurveTo(0, 268, -38, 230); ctx.closePath(); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5);
      if (o.dirt){ ctx.fillStyle = "#6B4426"; ctx.beginPath(); ctx.ellipse(0, 175, 40, 22, 0, 0, TAU); ctx.fill(); } }
    else if (kind === "ball"){ const r = 62; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
      ctx.save(); ctx.clip(); ctx.rotate(t * (o.spin || 0)); ctx.fillStyle = RED; ctx.fillRect(-r, -r, r, r * 2); ctx.fillStyle = GOLD; ctx.fillRect(0, -r, r, r); ctx.restore(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ol(ctx, 5); }
    else if (kind === "cake"){ rr(ctx, -90, -20, 180, 24, 8); ctx.fillStyle = "#C9CED6"; ctx.fill(); ol(ctx, 4); rr(ctx, -74, -100, 148, 82, 14); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = "#8E4E2E"; rr(ctx, -74, -100, 148, 26, 12); ctx.fill(); for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.arc(-56 + i * 28, -104, 9, 0, TAU); ctx.fillStyle = i % 2 ? RED : CREAM; ctx.fill(); } }
    else if (kind === "baby"){ ctx.beginPath(); ctx.ellipse(0, 0, 80, 54, -.2, 0, TAU); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.arc(-46, -26, 40, 0, TAU); ctx.fillStyle = "#F0C29A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-58, -30, 4.5, 0, TAU); ctx.arc(-38, -30, 4.5, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(-48, -14, 7, 0, Math.PI); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); }
    else if (kind === "keys"){ ctx.rotate(Math.sin(t * 6) * .3); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.stroke();
      rr(ctx, -18, 20, 36, 70, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, 44, 8, 0, TAU); ctx.fill(); }
    else if (kind === "frame"){ const w = o.w || 300, h = o.h || 230; rr(ctx, -w / 2, -h / 2, w, h, 10); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = "#DDEFF5"; ctx.fillRect(-w / 2 + 24, -h / 2 + 24, w - 48, h - 48);
      const fam = [["#E2A77C", "#2B1A12", -.32, 1], ["#C98B62", TEAL, -.05, 1.15], ["#F0C29A", ORANGE, .2, .75], ["#B5774F", RED, .36, .7]];
      fam.forEach(([sk, sh, fx, sc], i) => { const cx = fx * w, by = h / 2 - 24; ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(cx, by, 30 * sc, 46 * sc, 0, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, by - 62 * sc, 24 * sc, 0, TAU); ctx.fillStyle = sk; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, by - 58 * sc, 10 * sc, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); });
      ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-w / 2 + 40, -h / 2 + 70); ctx.lineTo(-w / 2 + 90, -h / 2 + 30); ctx.stroke(); }
    else if (kind === "hooks"){ rr(ctx, -80, -110, 160, 200, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); rr(ctx, -80, -110, 160, 50, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5);
      textC(ctx, "TEMPEL", 0, -74, 26, "#FFFFFF", 900);
      [-36, 36].forEach(dx => { ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(dx, -20); ctx.lineTo(dx, 30); ctx.arc(dx + 16, 30, 16, Math.PI, 0, true); ctx.stroke();
        rr(ctx, dx - 22, -40, 44, 30, 6); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 3); }); }
    else if (kind === "paper"){ ctx.rotate(-.08); rr(ctx, -90, -120, 180, 240, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      const n = o.lines ?? 5; for (let i = 0; i < n; i++){ ctx.fillStyle = i === 0 ? ORANGE : "#B9A58E"; rr(ctx, -66, -92 + i * 40, i === 0 ? 132 : 70 + rnd(i) * 60, 14, 6); ctx.fill(); } }
    else if (kind === "phone"){ prop(ctx, "phone", 0, 0, { s: .6, screen: o.screen || "#BFE2EA" }, t); }
    else if (kind === "drill"){ ctx.rotate(-.1); rr(ctx, -110, -40, 190, 80, 30); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); rr(ctx, -70, 20, 50, 120, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
      rr(ctx, 80, -16, 70, 32, 6); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4); }
    ctx.restore(); }

  /* rolling office chair (world), seat at the hip of a sitting toon of size sz */
  function chairAt(ctx, x, y, sz, face, spin){ const k = sz / 92, sy = y - 11 * k; ctx.save();
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, y + 2, 20 * k, 3 * k, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 2.4 * k; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 15 * k, y - 2.5 * k); ctx.lineTo(x + 15 * k, y - 2.5 * k); ctx.moveTo(x, y - 2.5 * k); ctx.lineTo(x, sy + 2 * k); ctx.stroke();
    [-15, 0, 15].forEach(d => { ctx.beginPath(); ctx.arc(x + d * k, y - 1.6 * k, 1.8 * k, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); });
    const bx = x - face * 12 * k * Math.cos(spin || 0), bw = 5 * k * (.4 + .6 * Math.abs(Math.cos(spin || 0)));
    rr(ctx, bx - bw / 2, sy - 30 * k, bw, 28 * k, 2.5 * k); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, .7 * k);
    rr(ctx, x - 14 * k - face * 2 * k, sy - 2 * k, 28 * k, 5 * k, 2.4 * k); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, .7 * k); ctx.restore(); }


  /* ---------- scooter under a toon: a.motor {col, parkCue, parkX} ---------- */
  function motorPos(a, st, s, t){ const M = a.motor === true ? {} : a.motor, idx = G.scene; let x = st.x + 13 * st.size / 92 * (st.face || 1), moving = st.moving;
    if (M.parkCue && t >= T(s, M.parkCue, .5, idx)) { x = M.parkX ?? x; moving = false; }
    return { x, y: st.y, k: st.size / 92, face: M.face || st.face || 1, moving, col: M.col || RED, dist: x, on: M.engine !== false }; }
  function scooter(ctx, m, t, front){ const k = m.k * 1.05, f = m.face; ctx.save(); ctx.translate(m.x, m.y); ctx.scale(f, 1); ctx.lineJoin = "round";
    const W = (wx) => { ctx.save(); ctx.translate(wx * k, -8.5 * k); ctx.rotate(m.dist / (8.5 * k) * f); ctx.beginPath(); ctx.arc(0, 0, 8.5 * k, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(0, 0, 4.4 * k, 0, TAU); ctx.fillStyle = "#C9CED6"; ctx.fill(); ol(ctx, 3); ctx.strokeStyle = "#7D8792"; ctx.lineWidth = 4; for (let i = 0; i < 3; i++){ ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(4 * k, 0); ctx.stroke(); } ctx.restore(); };
    if (!front){ const bob = m.on ? Math.sin(t * 40) * .25 * k : 0;
      ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(2 * k, 0, 34 * k, 3 * k, 0, 0, TAU); ctx.fill();
      W(-22); W(26);
      ctx.translate(0, bob);
      ctx.beginPath(); ctx.moveTo(-32 * k, -12 * k); ctx.quadraticCurveTo(-34 * k, -24 * k, -20 * k, -25 * k); ctx.lineTo(6 * k, -18 * k); ctx.lineTo(18 * k, -14 * k); ctx.lineTo(16 * k, -8 * k); ctx.lineTo(-30 * k, -8 * k); ctx.closePath();
      ctx.fillStyle = m.col; ctx.fill(); ol(ctx, 5);
      rr(ctx, -27 * k, -30 * k, 24 * k, 6 * k, 3 * k); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 3);
      ctx.fillStyle = "#9AA6B2"; rr(ctx, -40 * k, -12 * k, 10 * k, 3.4 * k, 1.5 * k); ctx.fill(); ol(ctx, 2.5);
      if (m.on || m.moving) for (let i = 0; i < 4; i++){ const q = ((t * (m.moving ? 2.4 : 1.1)) + i / 4) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * .55; ctx.fillStyle = "#D8D2C8"; ctx.beginPath(); ctx.arc(-44 * k - q * 26 * k, -10 * k - q * 8 * k + Math.sin(q * 9 + i) * k, (1.5 + q * 4) * k, 0, TAU); ctx.fill(); ctx.restore(); }
    } else { const bob = m.on ? Math.sin(t * 40) * .25 * k : 0; ctx.translate(0, bob);
      ctx.beginPath(); ctx.moveTo(14 * k, -10 * k); ctx.lineTo(20 * k, -40 * k); ctx.quadraticCurveTo(26 * k, -44 * k, 28 * k, -36 * k); ctx.lineTo(28 * k, -18 * k); ctx.quadraticCurveTo(30 * k, -12 * k, 24 * k, -8 * k); ctx.closePath();
      ctx.fillStyle = m.col; ctx.fill(); ol(ctx, 5);
      ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 2.4 * k; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(14 * k, -45 * k); ctx.lineTo(25 * k, -42 * k); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(27 * k, -32 * k, 2.6 * k, 3.6 * k, 0, 0, TAU); ctx.fillStyle = "#FFF1B8"; ctx.fill(); ol(ctx, 3);
      if (m.on) glowAt(ctx, 32 * k, -32 * k, 18 * k, "#FFE9A6", .35); }
    ctx.restore(); }
  /* ---------- bus stop: f.halte {x, busCue} ---------- */
  function halteAt(ctx, s, t, H, idx){ const x = H.x ?? 540, top = GY - 780;
    if (H.busCue){ const tb = T(s, H.busCue, .3, idx), q = (t - tb) / 2.6; if (q > 0 && q < 1){ const bx = 1700 - q * 2600; ctx.save(); ctx.translate(bx, GY - 60);
      rr(ctx, -330, -420, 660, 380, 40); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#BFE2EA"; for (let i = 0; i < 4; i++){ rr(ctx, -290 + i * 150, -380, 120, 120, 14); ctx.fill(); ol(ctx, 4); }
      ctx.fillStyle = GOLD; rr(ctx, -330, -200, 660, 30, 4); ctx.fill(); [-200, 200].forEach(d => { ctx.beginPath(); ctx.arc(d, -40, 56, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); });
      ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 8; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(360 + i * 30, -300 + i * 70); ctx.lineTo(480 + i * 30, -300 + i * 70); ctx.stroke(); } ctx.restore(); } }
    ctx.fillStyle = "#5A6B7A"; [x - 380, x + 380].forEach(px => { ctx.fillRect(px - 10, top, 20, GY - top); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(px - 10, top, 20, GY - top); });
    ctx.fillStyle = hexA("#BFE2EA", .35); ctx.fillRect(x - 370, top + 40, 740, 420); ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 300, top + 80); ctx.lineTo(x - 220, top + 160); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 440, top + 10); ctx.lineTo(x + 440, top + 10); ctx.lineTo(x + 400, top - 50); ctx.lineTo(x - 400, top - 50); ctx.closePath(); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x - 120, top - 130, 240, 70, 14); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 5); textC(ctx, "HALTE", x, top - 82, 44, "#FFFFFF", 900);
    const sh = H.seat ?? 84; ctx.fillStyle = "#5A6B7A"; [x - 280, x + 260].forEach(px => { ctx.fillRect(px, GY - sh, 20, sh); }); rr(ctx, x - 330, GY - sh - 18, 660, 26, 8); ctx.fillStyle = "#B5643C"; ctx.fill(); ol(ctx, 5); }
  /* ---------- an untouched dusty report on a desk: f.dust {x, y (desk top), label} ---------- */
  function dustDesk(ctx, t, D){ const x = D.x ?? 700, y = D.y ?? GY - 290; ctx.save(); ctx.translate(x, y);
    rr(ctx, -150, -40, 300, 40, 8); ctx.fillStyle = "#E8B98A"; ctx.fill(); ol(ctx, 5); rr(ctx, -140, -60, 280, 26, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
    textC(ctx, D.label || "LAPORAN", 0, -9, 26, BROWN, 900);
    ctx.fillStyle = hexA("#B9A58E", .5); for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-130 + i * 32, -62, 5 + rnd(i) * 4, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = hexA("#FFFFFF", .85); ctx.lineWidth = 2.2; const cx = 150, cy = -60; for (let i = 0; i < 6; i++){ const a = Math.PI / 2 + i * .28; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 130, cy - Math.sin(a) * 130); ctx.stroke(); }
    for (let r = 30; r <= 120; r += 30){ ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = Math.PI / 2 + i * .28; const px = cx + Math.cos(a) * r, py = cy - Math.sin(a) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    for (let i = 0; i < 10; i++){ const q = ((t * .12 + rnd(i + 4)) % 1); ctx.fillStyle = hexA("#FFF4E6", .7 * Math.sin(q * Math.PI)); ctx.beginPath(); ctx.arc(-120 + rnd(i) * 260 + Math.sin(t + i) * 12, -90 - q * 220, 4, 0, TAU); ctx.fill(); }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh, j) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
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
    const holds = (f.hold || []).map((h, j) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    if (f.halte) layer(ctx, c, 1, () => halteAt(ctx, s, t, f.halte, idx));
    drawProps(false);
    if (f.dust) layer(ctx, c, 1, () => dustDesk(ctx, t, f.dust));
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j]; if (a.chair){ layer(ctx, c, 1, () => chairAt(ctx, a.chairX ?? st.x, st.y, st.size, st.face || 1, st.moving && a.chairX == null ? (t - st.moveT) * 9 : 0)); }
      const mo = a.motor ? motorPos(a, st, s, t) : null; if (mo) layer(ctx, c, 1, () => scooter(ctx, mo, t, 0));
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st }); if (mo) layer(ctx, c, 1, () => scooter(ctx, mo, t, 1));
      holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1), dirt: h.dirt, lines: h.lines, spin: h.spin, col: h.col, skin: h.skin, cash: h.cash, swing: h.swingCue ? Math.sin(clamp(t - T(s, h.swingCue, .5, idx), 0, 1) * 9) * (1 - clamp(t - T(s, h.swingCue, .5, idx), 0, 1)) * 1.2 : 0 }); }));
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
    (f.chips || []).forEach((cp, j) => { const T0 = tOf(s, cp, .3 + j * .1, idx), O = cp.outCue ? T(s, cp.outCue, .5, idx) : 1e9; if (t < T0 || t > O + .3) return;
      ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - clamp((t - O) / .3, 0, 1); popChip(ctx, cp.text, cp.x ?? 540, (cp.y ?? 300) + Math.sin(t * 2 + j) * 4, t - T0, cp.bg || (cp.dark ? NAVY : PAPER), cp.fg || (cp.dark ? "#FFFFFF" : BROWN), cp.size || 40, cp.rot ?? (j % 2 ? .04 : -.04)); ctx.restore(); }); });
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
    (f0.chips || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.halte && f0.halte.busCue) add(cueT(s, f0.halte.busCue, .3, i), "whoosh");
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }


  /* ================= SP36 _kupu: idea butterflies (fly away / caught into one pocket book) ================= */
  function bflyAt(ctx, x, y, t, sc, col, seed, a){ if (sc <= 0) return; const fl = .3 + .7 * Math.abs(Math.sin(t * 13 + seed)); ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 3 + seed) * .18 + (a || 0));
    glowAt(ctx, 0, 0, 110, GOLD, .35);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.save(); ctx.scale(sx * fl, 1); ctx.beginPath(); ctx.ellipse(46, sy * (sy < 0 ? 34 : 24), sy < 0 ? 50 : 34, sy < 0 ? 40 : 28, sy * .5, 0, TAU);
      ctx.fillStyle = sy < 0 ? col : mixA(col); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(54, sy * 30, 9, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .8); ctx.fill(); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(0, 6, 13, 34, 0, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 3);
    ctx.beginPath(); ctx.arc(0, -30, 19, 0, TAU); ctx.fillStyle = "#FFE680"; ctx.fill(); ol(ctx, 3.5); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-6, -32, 3.4, 0, TAU); ctx.arc(6, -32, 3.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-6, -46); ctx.quadraticCurveTo(-14, -70, -26, -72); ctx.moveTo(6, -46); ctx.quadraticCurveTo(14, -70, 26, -72); ctx.stroke();
    ctx.restore(); }
  const mixA = c => hexA(c, .75);
  const SLOTS = [[-250, -300], [30, -420], [280, -290], [-150, -520], [210, -540]];
  TT.scene(PX + "kupu", "Cerita: kupu-kupu ide (terbang kabur / ditangkap ke satu buku saku)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ from: 0, mode: "kabur", env: "street" }, f.kupu || {});
    const cols = [ORANGE, TEAL, "#7A4A8E", GREEN, RED];
    const its = (K.items || []).map((it, j) => Object.assign({ col: cols[j % 5] }, it, { T: T(s, it.cue, .3 + j * .04, idx), C: it.catchCue ? T(s, it.catchCue, .4, idx) : 1e9, slot: SLOTS[it.slot ?? j] }));
    const tFly = T(s, K.flyCue, .3, idx), tBook = T(s, K.bookCue, .3, idx), tLega = T(s, K.legaCue, .4, idx);
    let pos = [];
    const where = (it, j, hp, book) => { const k = t - it.T; if (k < 0) return null; const e = eOut(clamp(k / .7, 0, 1));
      let x = lerp(hp[0], hp[0] + it.slot[0], e) + Math.sin(t * 1.7 + j * 2) * 26, y = lerp(hp[1] - 120, hp[1] + it.slot[1], e) + Math.sin(t * 2.3 + j) * 22, sc = .35 + .65 * e, lab = e;
      if (K.mode === "kabur" && t > tFly + j * .3){ const p = (t - tFly - j * .3) / 2.2, dir = it.slot[0] < 0 ? -1 : 1; x += dir * Math.pow(p, 1.4) * 1300 + Math.sin(p * 12 + j) * 70; y -= p * 950; lab = 1 - clamp(p * 4, 0, 1); if (p > 1.2) return null; }
      if (K.mode === "tangkap" && t > it.C && book){ const p = clamp((t - it.C) / .7, 0, 1), q = eIO(p); x = lerp(x, book[0], q); y = lerp(y, book[1], q) - Math.sin(p * Math.PI) * 160; sc *= 1 - .85 * q; lab = 1 - clamp(p * 3, 0, 1); if (p >= 1) return null; }
      return { x, y, sc, lab }; };
    const caught = its.filter(it => t > it.C + .7);
    base(ctx, s, t, { env: K.env, spots: { bugs: () => { const st = pos.hp || [540, 900]; return [st[0] + 20, st[1] - 330, 1.0]; } },
      over1: (ctx2, c, sts, j) => {
        if (K.netOn === j){ const st = sts[j], hp = handOf(st), lc = its.filter(it => t >= it.C).pop(), sw = lc ? Math.sin(clamp(t - lc.C, 0, .8) * 12) * (1 - clamp((t - lc.C) / .8, 0, 1)) * .9 : 0;
          drawItem(ctx, "net", hp[0], hp[1], t, { s: st.size / 760, flip: -(st.face || 1), swing: sw + Math.sin(t * 2) * .05 }); }
        if (K.bookOn === j && t >= tBook){ const st = sts[j], hp = handOf(st), q = eBack(clamp((t - tBook) / .4, 0, 1)); pos.book = [hp[0] + 40 * (st.face || 1), hp[1] - 150];
          ctx.save(); ctx.translate(hp[0] + 40 * (st.face || 1), hp[1] - 40); ctx.scale(q, q); ctx.rotate(-.05 * (st.face || 1));
          rr(ctx, -170, -230, 340, 240, 16); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
          [-1, 1].forEach(d => { rr(ctx, d < 0 ? -160 : 4, -220, 156, 216, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); });
          ctx.fillStyle = hexA(OUT, .3); ctx.fillRect(-3, -220, 6, 216);
          textC(ctx, K.bookTitle || "CATATAN", -82, -188, 22, ORANGE, 900);
          caught.forEach((it, i) => { const k = t - it.C - .7, side = i < 3 ? -1 : 1, row = i % 3, x0 = side < 0 ? -148 : 16, yy = (side < 0 ? -150 : -186) + row * 56;
            ctx.save(); ctx.globalAlpha = clamp(k / .25, 0, 1); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x0 + 10, yy - 8, 8, 0, TAU); ctx.fill();
            textL(ctx, typed(it.short || it.text, k, 26), x0 + 24, yy, 22, BROWN, 800, 112); ctx.restore(); burstFx(ctx, (side < 0 ? -80 : 82), yy - 10, k, GOLD, 8, 90); });
          ctx.restore(); }
      },
      front: (ctx2, c, sts) => { const st = sts[K.from]; if (!st) return; const hp = toonHead(st); pos.hp = hp;
        its.forEach((it, j) => { const p = where(it, j, hp, pos.book); if (!p) return; bflyAt(ctx, p.x, p.y, t, p.sc * (K.bs || 1), it.col, j * 1.7);
          if (p.lab > .02){ ctx.save(); ctx.globalAlpha = p.lab; chip(ctx, it.text, p.x, p.y + 86, PAPER, BROWN, 32); ctx.restore(); } });
        if (t > tLega) { for (let i = 0; i < 10; i++){ const q = ((t - tLega) * .7 + i / 10) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * clamp((t - tLega) * 2, 0, 1); sparkle(ctx, hp[0] + Math.cos(i * 2.4) * (140 + q * 120), hp[1] - 60 + Math.sin(i * 2.4) * (120 + q * 80) - q * 80, 16, i % 2 ? GOLD : "#FFFFFF"); ctx.restore(); } }
      },
      over: (ctx2, c, sts) => { if (K.mode === "kabur" && t > tFly + 1.4){ const st = sts[K.from]; if (!st) return; const h = c.toScreen(...toonHead(st)); popWord(ctx, K.lostText || "HILANG!", 540, Math.max(330, h[1] - 330), t - tFly - 1.4, { size: 100, hold: 2.2, rot: -6 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kupu || {}; (K.items || []).forEach((it, j) => { add(cueT(s, it.cue, .3 + j * .04, i), "pop"); if (it.catchCue) { add(cueT(s, it.catchCue, .4, i), "whoosh"); add(cueT(s, it.catchCue, .4, i) + .7, "chime"); } });
    if (K.flyCue) add(cueT(s, K.flyCue, .3, i), "whoosh"); if (K.bookCue) add(cueT(s, K.bookCue, .3, i), "pop"); if (K.legaCue) add(cueT(s, K.legaCue, .4, i), "chime"); });
  const eIO = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  function typed(txt, k, cps){ if (k < 0) return ""; const n = Math.floor(k * (cps || 22)); return String(txt).slice(0, n); }

  /* ================= SP36 _angkot: the full head is a crowded minibus ================= */
  TT.scene(PX + "angkot", "Cerita: kepala penuh = angkot berdesakan, tugas terlempar keluar", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, A = Object.assign({ on: 0, bx: 680, by: 610, w: 640, h: 470 }, f.angkot || {});
    const P = (A.riders || []).map((r, j) => Object.assign({ T: T(s, r.cue, .3 + j * .03, idx), col: r.col || [ORANGE, TEAL, "#7A4A8E", GREEN, RED, "#5B7DB1"][j % 6] }, r));
    const tBub = T(s, A.bubbleCue, .2, idx), tEj = T(s, A.ejectCue, .35, idx), nIn = P.filter(r => t >= r.T).length, lastIn = P.filter(r => t >= r.T).pop();
    const ejected = r => r.eject && t > tEj;
    base(ctx, s, t, { env: "office", envOpt: { deskX: 900 }, spots: { bus: [A.bx, A.by + 40, 1.05] },
      front: (ctx2, c, sts) => { const st = sts[A.on]; if (!st || t < tBub) return; const hp = toonHead(st), q = eBack(clamp((t - tBub) / .5, 0, 1));
        // thought trail
        [[.25, 30], [.5, 46], [.75, 62]].forEach(([u, r], i) => { const x = lerp(hp[0] + 90, A.bx - A.w * .3, u), y = lerp(hp[1] - st.size * .25, A.by + A.h * .42, u);
          ctx.beginPath(); ctx.arc(x, y, r * clamp(q * 3 - i * .5, 0, 1), 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); });
        ctx.save(); ctx.translate(A.bx, A.by); ctx.scale(q * (1 + Math.sin(t * 2) * .012 + nIn * .012), q * (1 + Math.cos(t * 2.2) * .012 + nIn * .01));
        ctx.beginPath(); for (let i = 0; i < 14; i++){ const a = i / 14 * TAU, a2 = (i + 1) / 14 * TAU, r = 1;
          const x1 = Math.cos(a) * A.w / 2, y1 = Math.sin(a) * A.h / 2, x2 = Math.cos(a2) * A.w / 2, y2 = Math.sin(a2) * A.h / 2, mx = Math.cos((a + a2) / 2) * A.w * .6, my = Math.sin((a + a2) / 2) * A.h * .6;
          if (!i) ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); }
        ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 7);
        // the minibus
        const sq = lastIn ? Math.sin(clamp(t - lastIn.T, 0, .5) * 25) * (1 - clamp((t - lastIn.T) / .5, 0, 1)) : 0, sag = Math.min(nIn, 6) * 3.5, jig = Math.sin(t * 22) * 1.5;
        ctx.translate(0, 70 + sag + jig); ctx.scale(1 + sq * .05, 1 - sq * .07);
        const W2 = 420, H2 = 170;
        for (let i = 0; i < 4; i++){ const q2 = ((t * 1.3) + i / 4) % 1; ctx.save(); ctx.globalAlpha = (1 - q2) * .5; ctx.fillStyle = "#C9C2B8"; ctx.beginPath(); ctx.arc(-W2 / 2 - 20 - q2 * 60, 40 - q2 * 20, 8 + q2 * 18, 0, TAU); ctx.fill(); ctx.restore(); }
        [-W2 * .3, W2 * .3].forEach(d => { ctx.beginPath(); ctx.arc(d, 60 - sag * .6, 34, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(d, 60 - sag * .6, 14, 0, TAU); ctx.fillStyle = "#C9CED6"; ctx.fill(); });
        rr(ctx, -W2 / 2, -H2 + 30, W2, H2, 26); ctx.fillStyle = "#3E8FA0"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = GOLD; ctx.fillRect(-W2 / 2 + 6, 20, W2 - 12, 14);
        // roof rack luggage = task labels
        const onRoof = P.filter(r => t >= r.T && !ejected(r));
        // windows with squeezed faces
        const nWin = 4, ww = (W2 - 60) / nWin;
        for (let i = 0; i < nWin; i++){ const wx = -W2 / 2 + 20 + i * (ww + 7); rr(ctx, wx, -H2 + 48, ww, 70, 10); ctx.fillStyle = "#CFE8EE"; ctx.fill(); ol(ctx, 4); }
        ctx.save(); rr(ctx, -W2 / 2 + 20, -H2 + 48, W2 - 40, 70, 10); ctx.clip();
        P.forEach((r, j) => { if (t < r.T || ejected(r)) return; const k = t - r.T, e = eOut(clamp(k / .45, 0, 1)), n = nIn, sp = (W2 - 70) / Math.max(4, n), x = lerp(-W2 / 2 - 60, -W2 / 2 + 50 + j * sp, e), y = -H2 + 100;
          const sqz = n > 4 ? .62 + .38 * 4 / n : 1; ctx.save(); ctx.translate(x, y + Math.sin(t * 7 + j) * 2); ctx.scale(sqz, 1);
          ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = r.col; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(-9, -6, 7, 0, TAU); ctx.arc(9, -6, 7, 0, TAU); ctx.fill();
          ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-8, -5, 3, 0, TAU); ctx.arc(10, -5, 3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, 12, 6, 0, Math.PI); ctx.fill(); ctx.restore(); });
        ctx.restore();
        ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(W2 / 2 - 10, -H2 + 50); ctx.lineTo(W2 / 2 - 10, 10); ctx.stroke();
        ctx.beginPath(); ctx.arc(W2 / 2 - 8, -10, 10, 0, TAU); ctx.fillStyle = "#FFF1B8"; ctx.fill(); ol(ctx, 3);
        ctx.fillStyle = "#2C2433"; rr(ctx, -W2 / 2 + 30, -H2 + 18, W2 - 60, 12, 4); ctx.fill();
        onRoof.forEach((r, j) => { const k = t - r.T, e = eBack(clamp(k / .4, 0, 1)), y = -H2 + 2 - j * 50 + (1 - e) * -90, wob = Math.sin(t * 3 + j) * .03 * (1 + j * .3);
          ctx.save(); ctx.translate((j % 2 ? 22 : -18), y); ctx.rotate(wob); ctx.scale(e, e); chip(ctx, r.text, 0, 0, PAPER, BROWN, 28); ctx.restore(); });
        ctx.restore();
        // ejected riders tumble out of the bubble
        P.filter(ejected).forEach((r, j) => { const p = (t - tEj - j * .25); if (p < 0 || p > 2.2) return; const x = A.bx + A.w * .35 + p * 380, y = A.by - 60 - p * 360 + p * p * 260, rot = p * 6;
          ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = r.col; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(-10, -6, 9, 0, TAU); ctx.arc(10, -6, 9, 0, TAU); ctx.fill(); ctx.restore();
          ctx.save(); ctx.translate(x, y - 70); ctx.rotate(-rot * .1); chip(ctx, r.text, 0, 0, RED, "#FFFFFF", 28); ctx.restore(); });
      },
      over: (ctx2, c) => { if (t > tEj) { const p = c.toScreen(A.bx + A.w * .2, A.by - A.h * .45); popWord(ctx, A.ejText || "KELUAR!", Math.min(820, p[0]), Math.max(300, p[1]), t - tEj, { size: 84, hold: 1.4, rot: 8 }); }
        if (lastIn && t - lastIn.T < .6 && nIn > 3){ const p = c.toScreen(A.bx - A.w * .3, A.by - A.h * .3); popWord(ctx, "SESAK!", p[0], Math.max(300, p[1]), t - lastIn.T, { size: 70, hold: .6, rot: -10 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.angkot || {}; (A.riders || []).forEach((r, j) => add(cueT(s, r.cue, .3 + j * .03, i), "pop"));
    if (A.bubbleCue) add(cueT(s, A.bubbleCue, .2, i), "whoosh"); if (A.ejectCue) add(cueT(s, A.ejectCue, .35, i), "whoosh"); });

  /* ================= SP36 _cecer: notes scattered around the house (tissue, palm, receipt, fridge) ================= */
  function fridge(ctx, x, t, note){ const top = GY - 620; ctx.save(); ctx.translate(x, 0);
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, GY + 4, 170, 16, 0, 0, TAU); ctx.fill();
    rr(ctx, -150, top, 300, 620, 26); ctx.fillStyle = "#DDEFF0"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-150, top + 220); ctx.lineTo(150, top + 220); ctx.stroke();
    ctx.fillStyle = "#9AA6B2"; rr(ctx, 104, top + 60, 18, 110, 8); ctx.fill(); ol(ctx, 3); rr(ctx, 104, top + 260, 18, 140, 8); ctx.fill(); ol(ctx, 3);
    [[-90, top + 300, RED], [40, top + 440, GREEN], [-40, top + 70, "#5B7DB1"]].forEach(([mx, my, mc]) => { ctx.beginPath(); ctx.arc(mx, my, 16, 0, TAU); ctx.fillStyle = mc; ctx.fill(); ol(ctx, 3); });
    if (note){ ctx.save(); ctx.translate(-30, top + 330); ctx.rotate(-.08 + Math.sin(t * 3) * .03); rr(ctx, -70, -60, 140, 130, 4); ctx.fillStyle = "#FFE680"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = hexA("#2F4F9E", .6); ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-50, -30 + i * 30); ctx.lineTo(40 - i * 12, -30 + i * 30); ctx.stroke(); } ctx.restore(); }
    ctx.restore(); }
  function sideTable(ctx, x, t, tissue){ ctx.save(); ctx.translate(x, GY); ctx.fillStyle = "#8E4E2E"; [-110, 96].forEach(d => { rr(ctx, d, -300, 18, 300, 5); ctx.fill(); ol(ctx, 4); });
    rr(ctx, -150, -320, 300, 34, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5);
    if (tissue){ ctx.translate(30, -330); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = i / 10 * TAU, r = 40 + (i % 2 ? 12 : -4); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .6); } ctx.closePath(); ctx.fill(); ol(ctx, 4); }
    ctx.restore(); }
  function scrap(ctx, kind, txt, x, y, k, smear, rot){ if (k < 0) return; const q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(q, q);
    const w = 210, h = kind === "struk" ? 250 : 190;
    if (kind === "tisu"){ ctx.beginPath(); for (let i = 0; i < 16; i++){ const a = i / 16 * TAU, r = 108 + (i % 2 ? 10 : -6); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .85); } ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); }
    else if (kind === "telapak"){ ctx.beginPath(); ctx.ellipse(0, 10, 90, 100, 0, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); ol(ctx, 5); [-60, -22, 16, 54].forEach((d, i) => { rr(ctx, d - 15, -150 + Math.abs(i - 1.5) * 16, 30, 90, 14); ctx.fill(); ol(ctx, 4); }); }
    else if (kind === "struk"){ ctx.beginPath(); ctx.moveTo(-90, -h / 2); for (let i = 0; i <= 9; i++) ctx.lineTo(-90 + i * 20, -h / 2 + (i % 2 ? 10 : 0)); ctx.lineTo(90, h / 2); for (let i = 9; i >= 0; i--) ctx.lineTo(-90 + i * 20, h / 2 + (i % 2 ? -10 : 0)); ctx.closePath(); ctx.fillStyle = "#FBF7EE"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++) ctx.fillRect(-66, -90 + i * 22, 100 + rnd(i) * 30, 8); }
    else { rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = "#FFE680"; ctx.fill(); ol(ctx, 5); }
    font(ctx, 800, 30, FAM); const ty = kind === "struk" ? 40 : 14; ctx.save(); ctx.globalAlpha = 1 - smear * .55; ctx.filter = smear > 0 ? `blur(${(smear * 5).toFixed(1)}px)` : "none";
    textC(ctx, txt, 0, ty, 32, "#2F4F9E", 800, 170); ctx.restore();
    if (smear > 0){ ctx.strokeStyle = hexA("#2F4F9E", .35 * smear); ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-70, ty - 10); ctx.quadraticCurveTo(0, ty + 30 * smear, 70, ty + 10); ctx.stroke(); }
    ctx.restore(); }
  TT.scene(PX + "cecer", "Cerita: catatan tercecer di rumah (tisu, telapak tangan, struk, kulkas)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, C = Object.assign({ tableX: 170, fridgeX: 930 }, f.cecer || {});
    const kinds = ["tisu", "telapak", "struk", "kulkas"], tSm = T(s, C.smearCue, .3, idx), tAll = T(s, C.allCue, .3, idx);
    const found = (C.notes || []).map((n, j) => Object.assign({ T: T(s, n.cue, .4, idx), kind: n.kind || kinds[j] }, n));
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 560 },
      back: () => { const tis = found.find(n => n.kind === "tisu"), kul = found.find(n => n.kind === "kulkas");
        sideTable(ctx, C.tableX, t, !(tis && t > tis.T)); fridge(ctx, C.fridgeX, t, !(kul && t > kul.T)); },
      over: () => { const n = found.length; found.forEach((nt, j) => { if (t < nt.T) return; const k = t - nt.T, shake = t > tAll ? Math.sin(t * 30 + j) * 4 * clamp(1 - (t - tAll) / .6, 0, 1) : 0;
          const x = 145 + j * (790 / Math.max(1, n - 1)), y = 380 + (j % 2 ? 40 : 0) + Math.sin(t * 1.6 + j) * 6;
          scrap(ctx, nt.kind, nt.text, x + shake, y, k, nt.smear !== false ? clamp((t - tSm) / 1.2, 0, 1) : 0, (j % 2 ? .07 : -.07)); });
        if (t > tSm + .6) stampBox(ctx, C.stamp || "LUNTUR!", 540, 600, t - tSm - .6, RED, 76, -.1); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const C = f.cecer || {}; (C.notes || []).forEach(n => add(cueT(s, n.cue, .4, i), "pop")); if (C.smearCue) add(cueT(s, C.smearCue, .3, i) + .6, "pop"); if (C.allCue) add(cueT(s, C.allCue, .3, i), "whoosh"); });

  /* ================= RN36 _sekat: the checker keeps popping up over the cubicle partition ================= */
  function partition(ctx, x0, x1, top, t){ ctx.save();
    rr(ctx, x0, top, x1 - x0, GY - top + 40, 18); ctx.fillStyle = "#6F8597"; ctx.fill(); ol(ctx, 7);
    ctx.fillStyle = "#7F95A7"; for (let x = x0 + 30; x < x1 - 20; x += 46) ctx.fillRect(x, top + 30, 3, GY - top);
    rr(ctx, x0 - 6, top - 14, x1 - x0 + 12, 30, 12); ctx.fillStyle = "#B8C3CC"; ctx.fill(); ol(ctx, 5);
    [[x0 + 120, top + 90, -.06, PAPER], [x0 + 300, top + 70, .05, "#FFE680"], [x1 - 170, top + 100, -.04, "#BFE2EA"]].forEach(([px, py, r, c], i) => { ctx.save(); ctx.translate(px, py); ctx.rotate(r + Math.sin(t * 1.4 + i) * .015);
      rr(ctx, -60, 0, 120, 140, 4); ctx.fillStyle = c; ctx.fill(); ol(ctx, 3.5); ctx.fillStyle = "#B9A58E"; for (let k = 0; k < 4; k++) ctx.fillRect(-42, 26 + k * 26, 64 + rnd(k + i) * 20, 7);
      ctx.beginPath(); ctx.arc(0, 4, 8, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.restore(); });
    ctx.restore(); }
  function deskTop(ctx, x, top, w, t, o){ o = o || {}; ctx.save(); ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, w * .55, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8E4E2E"; [-w / 2 + 20, w / 2 - 44].forEach(d => { rr(ctx, x + d, top, 24, GY - top, 6); ctx.fill(); ol(ctx, 4); });
    rr(ctx, x - w / 2, top - 30, w, 34, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
    if (o.laptop){ ctx.save(); ctx.translate(x + (o.lx || 0), top - 30); ctx.scale(o.lf || 1, 1); ctx.fillStyle = "#544E42"; rr(ctx, -100, -140, 200, 140, 12); ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = hexA(ORANGE, .9); ctx.beginPath(); ctx.arc(0, -70, 14, 0, TAU); ctx.fill(); ctx.fillStyle = "#3B2418"; rr(ctx, -120, -6, 240, 12, 5); ctx.fill(); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "sekat", "Cerita: kepala pengecek muncul terus dari balik sekat kubikel", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, S = Object.assign({ top: 900, x0: 30, x1: 1050, deskX: 760, count0: 4 }, f.sekat || {});
    const pops = (S.pops || []).map((p, j) => Object.assign({ T: T(s, p.cue, .3, idx) }, p));
    const cur = pops.filter(p => t >= p.T), last = cur[cur.length - 1], next = last ? pops[pops.indexOf(last) + 1] : null;
    const tCount = T(s, S.countCue, .4, idx);
    let rise = 0, hx = 540, k0 = 0;
    if (last){ k0 = t - last.T; const end = Math.min(next ? next.T - .3 : 1e9, last.T + (last.hold || 2.2)); rise = eBack(clamp(k0 / .35, 0, 1)) * (1 - eIO(clamp((t - end) / .3, 0, 1))); hx = last.x; }
    const count = S.count0 + cur.length + (t >= tCount ? 0 : 0);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1000 }, spots: { pop: () => [hx, S.top - 160, 1.05] },
      back: (ctx2, c) => { if (last && rise > .01 && S.hendra){ const a = Object.assign({}, S.hendra, { keys: [] }), st = toonState(a, s, t);
          st.x = hx; st.y = GY + 70 - 380 * rise; st.face = last.face || (hx > 540 ? -1 : 1); st.expr = last.expr || "happy"; st.pose = last.pose || "wave"; st.talk = k0 < 1.6;
          ctx.save(); ctx.rotate(0); TT.drawToon(ctx, a, st, t); ctx.restore(); }
        partition(ctx, S.x0, S.x1, S.top, t); deskTop(ctx, S.deskX, GY - 300, 420, t, { laptop: true, lx: 20, lf: -1 });
        if (S.clock) prop(ctx, "clock", S.clock.x, S.clock.y, { s: .7, fast: true }, t); },
      over: (ctx2, c) => { if (last && rise > .5 && k0 < 1.8){ const p = c.toScreen(hx + 40 * (hx > 540 ? -1 : 1), GY + 70 - 380 * rise - 760 * .99); TT.bubble(ctx, last.say || "Sudah sampai mana?", p[0], Math.max(320, p[1] - 10), k0, { kind: "shout", size: 44 }); }
        if (cur.length){ const k = t - last.T, bump = k < .3 ? 1 + Math.sin(k / .3 * Math.PI) * .25 : 1; ctx.save(); ctx.translate(880, 250); ctx.scale(bump, bump); chip(ctx, "CEK KE-" + count, 0, 0, RED, "#FFFFFF", 40); ctx.restore(); }
        if (t > tCount) stampBox(ctx, (S.count0 + pops.length) + "x PAGI INI", 540, 470, t - tCount, RED, 72, -.08); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.sekat || {}; (S.pops || []).forEach(p => { add(cueT(s, p.cue, .3, i), "whoosh"); add(cueT(s, p.cue, .3, i) + .3, "pop"); }); if (S.countCue) add(cueT(s, S.countCue, .4, i), "ping"); });

  /* ================= RN36 _kartu: focus = a tower of slide cards (collapses at every check / grows to the top) ================= */
  function cardList(levels){ const L = []; for (let lv = 0; lv < levels; lv++){ const n = levels - lv, w = 112, y0 = -lv * 150;
      for (let i = 0; i < n; i++){ const cx = (i - (n - 1) / 2) * w; L.push({ x: cx - 24, y: y0, r: .3 }); L.push({ x: cx + 24, y: y0, r: -.3 }); }
      if (lv < levels - 1) for (let i = 0; i < n - 1; i++) L.push({ x: (i - (n - 2) / 2) * w, y: y0 - 136, r: Math.PI / 2, flat: 1 }); }
    return L; }
  function slideCard(ctx, x, y, r, j, a){ ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.globalAlpha *= a ?? 1; rr(ctx, -30, -132, 60, 132, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3.5);
    ctx.fillStyle = [ORANGE, TEAL, "#7A4A8E", GREEN][j % 4]; rr(ctx, -22, -122, 44, 22, 4); ctx.fill(); ctx.fillStyle = "#D9C9B4"; for (let k = 0; k < 3; k++) ctx.fillRect(-20, -88 + k * 22, 40 - k * 8, 8);
    ctx.fillStyle = [ORANGE, TEAL][j % 2]; ctx.fillRect(-18, -26, 9, 16); ctx.fillRect(-4, -34, 9, 24); ctx.fillRect(10, -20, 9, 10); ctx.restore(); }
  TT.scene(PX + "kartu", "Cerita: menara kartu slide = fokus (runtuh tiap dicek / tumbuh sampai puncak)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Kt = Object.assign({ x: 640, levels: 4, mode: "runtuh", rate: 7 }, f.kartu || {});
    const L = cardList(Kt.levels), N = L.length, top = GY - 300;
    const hits = (Kt.hits || []).map(c => T(s, c, .35, idx)), past = hits.filter(h => t >= h), lastHit = past.length ? past[past.length - 1] : -9;
    const tB = Kt.buildCue ? T(s, Kt.buildCue, .2, idx) : 0, tD = T(s, Kt.doneCue, .5, idx);
    let placed;
    if (Kt.mode === "runtuh") placed = Math.min(N, Math.floor(Math.max(0, t - Math.max(0, lastHit + .9)) * Kt.rate) + (lastHit > 0 ? 0 : (Kt.start || 0)));
    else placed = t < tB ? 0 : Math.min(N, Math.floor((t - tB) / Math.max(.4, (tD - tB)) * N) + 1);
    const prevPlaced = lastHit > 0 ? Math.min(N, Math.floor(Math.max(0, lastHit - Math.max(0, (past.length > 1 ? past[past.length - 2] + .9 : 0))) * Kt.rate) + (past.length > 1 ? 0 : (Kt.start || 0))) : 0;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 90, time: Kt.time }, spots: { tower: [Kt.x, top - Kt.levels * 90, 1.15] },
      back: () => { deskTop(ctx, Kt.x - 40, top, 640, t, Kt.laptop ? { laptop: true, lx: 220 } : {});
        ctx.save(); ctx.translate(Kt.x, top - 30); const sway = Math.sin(t * 2.2) * .006 * placed / N;
        ctx.rotate(sway);
        for (let j = 0; j < placed; j++){ const cd = L[j], k = j === placed - 1 ? clamp((t * Kt.rate) % 1 * 3, 0, 1) : 1; slideCard(ctx, cd.x, cd.y - (1 - eOut(k)) * 90, cd.r, j, clamp(k * 2, 0, 1)); }
        ctx.restore();
        // collapse debris of the last check
        const kc = t - lastHit; if (kc >= 0 && kc < 1.6){ ctx.save(); ctx.translate(Kt.x, top - 30);
          for (let j = 0; j < Math.max(prevPlaced, 6); j++){ const cd = L[j % N], vx = (rnd(j + 3) - .5) * 900, vy = -300 - rnd(j + 7) * 500, x = cd.x + vx * kc, y = Math.min(0, cd.y + vy * kc + 1100 * kc * kc);
            slideCard(ctx, x, y, cd.r + kc * (rnd(j) - .5) * 14, j, 1 - clamp((kc - 1.1) / .5, 0, 1)); } ctx.restore(); }
        if (Kt.mode !== "runtuh" && t > tD){ glowAt(ctx, Kt.x, top - Kt.levels * 80, 420, GOLD, .35 * (0.7 + .3 * Math.sin(t * 4))); }
      },
      over: (ctx2, c) => { const kc = t - lastHit; if (kc >= 0 && kc < 1.3){ popWord(ctx, Kt.hitText || "SUDAH?", 760, 420, kc, { size: 96, hold: 1.2, rot: 8 }); }
        if (kc >= 0 && kc < .5){ ctx.save(); ctx.globalAlpha = (1 - kc / .5) * .28; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
        if (Kt.mode !== "runtuh" && t > tD){ const p = c.toScreen(Kt.x, top - Kt.levels * 150 - 60); popChip(ctx, Kt.doneText || "MATERI SIAP!", p[0], Math.max(300, p[1]), t - tD, GREEN, "#FFFFFF", 44, -.05); burstFx(ctx, p[0], Math.max(300, p[1]) + 60, t - tD, GOLD, 12, 240); }
        if (Kt.resetText && past.length){ popChip(ctx, Kt.resetText + " ×" + past.length, 250, 300, t - past[0], RED, "#FFFFFF", 36, -.05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Kt = f.kartu || {}; (Kt.hits || []).forEach(c => { add(cueT(s, c, .35, i), "pop"); add(cueT(s, c, .35, i) + .1, "whoosh"); }); if (Kt.doneCue) add(cueT(s, Kt.doneCue, .5, i), "chime"); });

  /* ================= KD36 shared: video-call tiles, mic glyph, rooster ================= */
  function micGlyph(ctx, x, y, r, on, t){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = on ? GREEN : RED; ctx.fill(); ol(ctx, Math.max(2, r * .12));
    ctx.fillStyle = "#FFFFFF"; rr(ctx, -r * .22, -r * .58, r * .44, r * .7, r * .22); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * .1; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(0, -r * .1, r * .38, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, r * .28); ctx.lineTo(0, r * .5); ctx.stroke();
    if (!on){ ctx.lineWidth = r * .14; ctx.beginPath(); ctx.moveTo(-r * .55, -r * .55); ctx.lineTo(r * .55, r * .55); ctx.stroke(); }
    ctx.restore(); }
  function rooster(ctx, x, y, s, t, crow){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(crow ? -.25 + Math.sin(t * 30) * .05 : Math.sin(t * 2) * .05);
    [[-70, -20, RED], [-80, 0, "#2F6F73"], [-75, 20, GOLD]].forEach(([dx, dy, c], i) => { ctx.save(); ctx.translate(-40, 10); ctx.rotate(-.6 + i * .35); ctx.beginPath(); ctx.ellipse(-50, 0, 60, 18, 0, 0, TAU); ctx.fillStyle = c; ctx.fill(); ol(ctx, 3); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(0, 30, 70, 56, 0, 0, TAU); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(40, -40, 34, 42, 0, 0, TAU); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = RED; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(26 + i * 14, -84 + Math.abs(i - 1) * 6, 12, 0, TAU); ctx.fill(); } ctx.beginPath(); ctx.ellipse(66, -20, 8, 14, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(70, -50); ctx.lineTo(102, crow ? -60 : -44); ctx.lineTo(72, -40); ctx.closePath(); ctx.fill(); ol(ctx, 3);
    if (crow){ ctx.beginPath(); ctx.moveTo(72, -38); ctx.lineTo(100, -26); ctx.lineTo(70, -30); ctx.closePath(); ctx.fill(); ol(ctx, 3); }
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(52, -50, 5, 0, TAU); ctx.fill(); ctx.restore(); }
  function waves(ctx, x, y, t, col, n, R){ ctx.save(); ctx.strokeStyle = col; ctx.lineCap = "round"; for (let r = 0; r < (n || 3); r++){ const w = (t * 1.6 + r / (n || 3)) % 1; ctx.globalAlpha = 1 - w; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.arc(x, y, (R || 60) + w * (R || 60) * 1.6, -.7, .7); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, (R || 60) + w * (R || 60) * 1.6, Math.PI - .7, Math.PI + .7); ctx.stroke(); } ctx.restore(); }
  function tileToon(ctx, a, s, t, cx, bot, sc){ const A = Object.assign({}, a, { x: 0, y: 0 }), st = toonState(A, s, t); ctx.save(); ctx.translate(cx, bot); ctx.scale(sc, sc); TT.drawToon(ctx, A, st, t); ctx.restore(); }
  /* _rapat: the meeting grid seen full screen */
  TT.scene(PX + "rapat", "Cerita: layar rapat online 2x2 (ayam berkokok dari kotak peserta)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, R0 = Object.assign({ title: "Rapat Target", tiles: [] }, f.rapat || {});
    const tCrow = T(s, R0.crowCue, .3, idx), tAll = T(s, R0.allCue, .3, idx);
    const X0 = 60, Y0 = 300, W0 = 960, H0 = 820, g = 14, tw = (W0 - 40 - g) / 2, tH = (H0 - 110 - g) / 2;
    const act = (R0.active || []).filter(a => t >= tOf(s, a, .2, idx)).pop();
    const spotOf = i => [X0 + 20 + (i % 2) * (tw + g) + tw / 2, Y0 + 80 + Math.floor(i / 2) * (tH + g) + tH / 2];
    base(ctx, s, t, { env: "office", envOpt: { desk: false }, spots: { t0: () => [...spotOf(0), 1.6], t1: () => [...spotOf(1), 1.6], t2: () => [...spotOf(2), 1.6], t3: () => [...spotOf(3), 1.6], grid: [540, 760, 1.0] },
      back: () => { ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(540, Y0 + H0 + 40, 440, 26, 0, 0, TAU); ctx.fill();
        rr(ctx, X0 - 18, Y0 - 18, W0 + 36, H0 + 36, 30); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 7); rr(ctx, X0, Y0, W0, H0, 16); ctx.fillStyle = "#1B2333"; ctx.fill();
        textL(ctx, R0.title, X0 + 28, Y0 + 50, 34, "#FFFFFF", 800); const sec = Math.floor(t + (R0.sec0 || 3)); textL(ctx, "00:" + String(sec).padStart(2, "0"), X0 + W0 - 130, Y0 + 50, 32, "#BFE2EA", 700);
        ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(X0 + W0 - 150, Y0 + 40, 9 + Math.sin(t * 5) * 2, 0, TAU); ctx.fill();
        R0.tiles.forEach((tl, i) => { const x = X0 + 20 + (i % 2) * (tw + g), y = Y0 + 80 + Math.floor(i / 2) * (tH + g), crowK = t - tCrow, isB = tl.rooster && crowK >= 0;
          const shake = isB && crowK < 1.5 ? Math.sin(t * 60) * 6 * (1 - crowK / 1.5) : 0;
          ctx.save(); ctx.translate(shake, 0); rr(ctx, x, y, tw, tH, 14); ctx.fillStyle = tl.bg || "#E9D8C0"; ctx.fill(); ctx.save(); ctx.clip();
          if (tl.window){ rr(ctx, x + tw * .55, y + 30, tw * .36, tH * .45, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4); if (isB){ const q = eBack(clamp(crowK / .4, 0, 1)); rooster(ctx, x + tw * .73, y + 30 + tH * .45 - 40 * q + 60 * (1 - q), .55 * q, t, crowK < 2.2); } }
          if (tl.shelf){ ctx.fillStyle = "#8E4E2E"; ctx.fillRect(x + 20, y + 60, 120, 10); [ORANGE, TEAL, GOLD].forEach((c, k) => { ctx.fillStyle = c; ctx.fillRect(x + 30 + k * 30, y + 10, 22, 50); }); }
          if (tl.plant) prop(ctx, "plant", x + tw - 60, y + tH, { s: .55 }, t);
          tileToon(ctx, tl.toon, s, t, x + tw * (tl.tx ?? .42), y + tH + (tl.dy ?? 150), tl.sc || .52);
          ctx.restore();
          if (act && act.tile === i){ rr(ctx, x - 3, y - 3, tw + 6, tH + 6, 16); ctx.strokeStyle = HL; ctx.lineWidth = 9; ctx.stroke(); }
          font(ctx, 800, 26, FAM); const nw = ctx.measureText(tl.name).width; rr(ctx, x + 12, y + tH - 54, nw + 74, 42, 12); ctx.fillStyle = "rgba(20,24,36,.8)"; ctx.fill();
          micGlyph(ctx, x + 34, y + tH - 33, 15, tl.mic !== false || (tl.micOnCue && t >= T(s, tl.micOnCue, .3, idx)), t); textL(ctx, tl.name, x + 56, y + tH - 24, 26, "#FFFFFF", 800);
          ctx.restore();
          if (isB && crowK < 3) waves(ctx, x + tw / 2, y + tH / 2, t, GOLD, 3, 120); });
        // controls bar
        const cy = Y0 + H0 - 2; [[-110, "mic"], [0, "end"], [110, "cam"]].forEach(([dx, k]) => { ctx.beginPath(); ctx.arc(540 + dx, cy - 6, 0, 0, TAU); });
      },
      over: (ctx2, c) => { const k = t - tCrow; if (k >= 0 && k < 2.4){ const p = c.toScreen(...spotOf(R0.tiles.findIndex(x => x.rooster))); popWord(ctx, R0.crowText || "KUKURUYUK!", 540, clamp(p[1] - 280, 300, 640), k, { size: 108, hold: 2.3, rot: -6 }); }
        if (t > tAll) popChip(ctx, R0.allText || "SEMUA KAGET!", 540, 300, t - tAll, RED, "#FFFFFF", 44, .04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const R0 = f.rapat || {}; if (R0.crowCue){ const t0 = cueT(s, R0.crowCue, .3, i); add(t0, "ping"); add(t0 + .2, "ping"); add(t0 + .4, "pop"); } if (R0.allCue) add(cueT(s, R0.allCue, .3, i), "pop"); });

  /* _tv: the host in her office in front of a wall screen full of strange display names */
  TT.scene(PX + "tv", "Cerita: layar dinding rapat dengan nama tampilan aneh", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, V = Object.assign({ x0: 380, y0: 330, w: 680, h: 620, names: [] }, f.tv || {});
    const tW = T(s, V.timeCue, .3, idx), tQ = T(s, V.qCue, .3, idx);
    const cols = 2, rows = 3, g = 12, tw = (V.w - 40 - g) / cols, tH = (V.h - 90 - 2 * g) / rows;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1010 }, spots: { tv: [V.x0 + V.w / 2, V.y0 + V.h / 2 + 60, 1.05] },
      back: () => { rr(ctx, V.x0 - 16, V.y0 - 16, V.w + 32, V.h + 32, 22); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 7); rr(ctx, V.x0, V.y0, V.w, V.h, 12); ctx.fillStyle = "#1B2333"; ctx.fill();
        ctx.fillStyle = "#2C2433"; ctx.fillRect(V.x0 + V.w / 2 - 14, V.y0 + V.h + 16, 28, 60);
        const sp = t > tW ? (t - tW) * 9 : 0, sec = Math.floor(t * 1 + sp + (V.sec0 || 40)), mm = 12 + Math.floor(sec / 60);
        textL(ctx, "Rapat Target", V.x0 + 22, V.y0 + 46, 30, "#FFFFFF", 800); const tc = t > tW ? (Math.sin(t * 14) > 0 ? RED : "#FFFFFF") : "#BFE2EA";
        textL(ctx, mm + ":" + String(sec % 60).padStart(2, "0"), V.x0 + V.w - 110, V.y0 + 46, 30, tc, 800);
        V.names.forEach((n, i) => { const x = V.x0 + 20 + (i % cols) * (tw + g), y = V.y0 + 70 + Math.floor(i / cols) * (tH + g), T0 = n.cue ? T(s, n.cue, .2, idx) : -1, k = t - T0;
          rr(ctx, x, y, tw, tH, 10); ctx.fillStyle = "#2B3650"; ctx.fill(); if (n.odd && k >= 0){ rr(ctx, x, y, tw, tH, 10); ctx.strokeStyle = hexA(HL, .6 + .4 * Math.sin(t * 6)); ctx.lineWidth = 6; ctx.stroke(); }
          ctx.beginPath(); ctx.arc(x + tw / 2, y + tH * .42, 40, 0, TAU); ctx.fillStyle = n.col || "#5B7DB1"; ctx.fill(); textC(ctx, n.ini || "?", x + tw / 2, y + tH * .42 + 14, 38, "#FFFFFF", 900);
          micGlyph(ctx, x + 24, y + tH - 24, 13, false, t);
          const txt = n.cue ? typed(n.text, k, 18) : n.text; textL(ctx, txt, x + 44, y + tH - 14, 28, "#FFFFFF", 800, tw - 54);
          if (n.odd && k > .6){ const q = eBack(clamp((k - .6) / .3, 0, 1)); ctx.save(); ctx.translate(x + tw - 34, y + 34 + Math.sin(t * 5 + i) * 6); ctx.scale(q, q); textC(ctx, "?", 0, 18, 64, GOLD, 900); ctx.restore(); } });
      },
      over: (ctx2, c) => { if (t > tQ) popWord(ctx, V.qText || "INI SIAPA?", 540, 300, t - tQ, { size: 96, hold: 1.6, rot: -5 });
        if (t > tW){ const p = c.toScreen(V.x0 + V.w - 60, V.y0 - 40); popChip(ctx, V.timeText || "WAKTU HABIS", Math.min(880, p[0]), Math.max(300, p[1]), t - tW, RED, "#FFFFFF", 38, .05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const V = f.tv || {}; (V.names || []).forEach(n => { if (n.cue) add(cueT(s, n.cue, .2, i), "pop"); }); if (V.qCue) add(cueT(s, V.qCue, .3, i), "ping"); if (V.timeCue) add(cueT(s, V.timeCue, .3, i), "whoosh"); });

  /* ================= KD36 _bising: home noises flow into the laptop's open mic ================= */
  function blender(ctx, x, y, t, on){ ctx.save(); ctx.translate(x + (on ? Math.sin(t * 70) * 4 : 0), y); rr(ctx, -50, -50, 100, 50, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(-44, -50); ctx.lineTo(-56, -200); ctx.lineTo(56, -200); ctx.lineTo(44, -50); ctx.closePath(); ctx.fillStyle = hexA("#BFE2EA", .75); ctx.fill(); ol(ctx, 4);
    ctx.save(); ctx.clip(); ctx.fillStyle = "#E86F5A"; ctx.beginPath(); ctx.moveTo(-60, -110 + (on ? Math.sin(t * 20) * 14 : 0)); ctx.quadraticCurveTo(0, -150 + (on ? Math.cos(t * 25) * 20 : 0), 60, -110); ctx.lineTo(60, -40); ctx.lineTo(-60, -40); ctx.fill(); ctx.restore();
    rr(ctx, -60, -222, 120, 26, 8); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  function laptopFront(ctx, x, top, t, micOn, hot){ ctx.save(); ctx.translate(x + (hot ? Math.sin(t * 50) * 3 : 0), top);
    ctx.fillStyle = "#544E42"; ctx.beginPath(); ctx.moveTo(-140, -210); ctx.lineTo(140, -210); ctx.lineTo(150, -14); ctx.lineTo(-150, -14); ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = "#1B2333"; ctx.fillRect(-124, -196, 248, 166); const tw = 116, th2 = 76; for (let i = 0; i < 4; i++){ ctx.fillStyle = ["#E9D8C0", "#D8E6D2", "#E6D2DA", "#D2DCE6"][i]; ctx.fillRect(-120 + (i % 2) * (tw + 8), -192 + Math.floor(i / 2) * (th2 + 6), tw, th2); }
    ctx.fillStyle = "#3B2418"; rr(ctx, -170, -16, 340, 18, 7); ctx.fill(); ol(ctx, 3);
    if (micOn) glowAt(ctx, 0, -110, 150, hot ? RED : GREEN, .35 + .15 * Math.sin(t * 8));
    micGlyph(ctx, 0, -110, 40 + (micOn ? Math.sin(t * 8) * 3 : 0), micOn, t); ctx.restore(); }
  TT.scene(PX + "bising", "Cerita: suara rumah (blender, terompet, motor) masuk ke mikrofon laptop", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ deskX: 560, counterX: 950 }, f.bising || {}), top = GY - 300;
    const tMic = T(s, B.micCue, .3, idx), tBl = T(s, B.blendCue, .3, idx), tTr = T(s, B.trumpetCue, .3, idx), tMo = T(s, B.motorCue, .3, idx), tIn = T(s, B.inCue, .3, idx);
    const src = []; let lap = null;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 2000 }, spots: { lap: [B.deskX, top - 120, 1.35], win: [560, 760, 1.1] },
      back: () => { // window with a passing motorbike
        const wx = 560, wy = 560; rr(ctx, wx - 200, wy, 400, 300, 12); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 6); ctx.save(); rr(ctx, wx - 200, wy, 400, 300, 12); ctx.clip();
        ctx.fillStyle = "#9FC8A0"; ctx.fillRect(wx - 200, wy + 200, 400, 100); const mq = (t - tMo) / 2.2; if (mq > 0 && mq < 1){ const mx = wx - 320 + mq * 640; scooter(ctx, { x: mx, y: wy + 285, k: 2.6, face: 1, moving: true, col: "#5B7DB1", dist: mx, on: true }, t, 0); scooter(ctx, { x: mx, y: wy + 285, k: 2.6, face: 1, moving: true, col: "#5B7DB1", dist: mx, on: true }, t, 1);
          ctx.beginPath(); ctx.arc(mx - 20, wy + 160, 30, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); src.push([mx, wy + 150, "motor"]); }
        ctx.restore(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, wy + 300); ctx.stroke();
        // kitchen counter + blender
        const cx = B.counterX; rr(ctx, cx - 150, GY - 330, 330, 330, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); rr(ctx, cx - 170, GY - 350, 370, 30, 8); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 5);
        blender(ctx, cx - 60, GY - 350, t, t > tBl); if (t > tBl) src.push([cx - 60, GY - 480, "blend"]);
        deskTop(ctx, B.deskX, top, 380, t, {}); },
      front: (ctx2, c, sts) => { lap = [B.deskX + 30, top - 30]; laptopFront(ctx, lap[0], lap[1], t, t > (B.micOn0 ? -1 : tMic), t > tIn);
        if (t > tTr && B.kid != null && sts[B.kid]){ const h = handOf(sts[B.kid]); src.push([h[0] + 120, h[1] - 50, "tr"]); }
        // flowing sound ribbons into the mic
        src.forEach(([x, y], i) => { const tx = lap[0], ty = lap[1] - 110; ctx.save(); ctx.strokeStyle = hexA(i % 2 ? HL : GOLD, .85); ctx.lineWidth = 8; ctx.setLineDash([22, 18]); ctx.lineDashOffset = -t * 160; ctx.lineCap = "round";
          ctx.beginPath(); for (let k = 0; k <= 24; k++){ const u = k / 24, px = lerp(x, tx, u), py = lerp(y, ty, u) - Math.sin(u * Math.PI) * 120 + Math.sin(u * 14 + t * 8) * 16; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore();
          waves(ctx, x, y, t + i, i % 2 ? HL : GOLD, 2, 40); }); },
      over: (ctx2, c, sts) => { const pw = (T0, txt, wx, wy, rot) => { const k = t - T0; if (k < 0 || k > 2.2) return; const p = c.toScreen(wx, wy); popWord(ctx, txt, clamp(p[0], 220, 860), clamp(p[1], 300, 1150), k, { size: 80, hold: 2.1, rot }); };
        pw(tBl, "BRRRR!", B.counterX - 60, GY - 640, 6); if (B.kid != null && sts[B.kid]){ const h = handOf(sts[B.kid]); pw(tTr, "TOET! TOET!", h[0] + 140, h[1] - 230, -8); } pw(tMo, "NGEEENG!", 560, 520, 4);
        if (t > tMic && t < tBl - .2 && lap){ const p = c.toScreen(lap[0], lap[1] - 260); popChip(ctx, "MIC MENYALA", clamp(p[0], 260, 820), Math.max(300, p[1]), t - tMic, GREEN, "#FFFFFF", 40, -.05); }
        if (t > tIn) popChip(ctx, B.inText || "SEMUA MASUK RAPAT!", 540, 300, t - tIn, RED, "#FFFFFF", 42, .04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.bising || {}; ["micCue", "blendCue", "trumpetCue", "motorCue", "inCue"].forEach((k, j) => { if (B[k]) add(cueT(s, B[k], .3, i), j === 0 ? "ping" : j === 4 ? "whoosh" : "pop"); }); });

  /* ================= KD36 _mik: a giant mute button + the display name gets retyped ================= */
  TT.scene(PX + "mik", "Cerita: tombol mikrofon raksasa ditepuk + nama tampilan diketik ulang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ x: 760, oldName: "Kamar Atas", newName: "Bayu · Keuangan", critters: ["BRRR", "TOET", "KUKU"] }, f.mik || {});
    const tOff = T(s, M.offCue, .3, idx), tOn = T(s, M.onCue, .3, idx), tOff2 = T(s, M.off2Cue, .3, idx), tName = T(s, M.nameCue, .2, idx), tType = T(s, M.typeCue, .1, idx), tOk = T(s, M.okCue, .3, idx);
    const on = t < tOff || (t >= tOn && t < tOff2), lastPress = [tOff, tOn, tOff2].filter(x => t >= x).pop() ?? -9, pk = t - lastPress, press = pk >= 0 && pk < .4 ? Math.sin(pk / .4 * Math.PI) : 0;
    const by = GY - 430;
    base(ctx, s, t, { env: "info", envOpt: { spotX: M.x }, spots: { btn: [M.x, by - 40, 1.15] },
      back: () => { ctx.save(); ctx.translate(M.x, 0);
        ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(0, GY + 4, 220, 26, 0, 0, TAU); ctx.fill();
        rr(ctx, -150, by + 40, 300, GY - by - 40, 20); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#4B5C80"; ctx.fillRect(-120, by + 70, 30, GY - by - 90);
        rr(ctx, -200, by + 10, 400, 50, 20); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6);
        const h = 110 * (1 - press * .55); ctx.beginPath(); ctx.ellipse(0, by + 10, 170, 50, 0, 0, TAU); ctx.fillStyle = on ? "#2E7D46" : "#A8382E"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = on ? GREEN : RED; ctx.beginPath(); ctx.ellipse(0, by + 10 - h, 170, 50, 0, 0, TAU); ctx.fill(); ctx.fillRect(-170, by + 10 - h, 340, h); ctx.beginPath(); ctx.ellipse(0, by + 10, 170, 50, 0, 0, Math.PI); ctx.fill();
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-170, by + 10 - h); ctx.lineTo(-170, by + 10); ctx.moveTo(170, by + 10 - h); ctx.lineTo(170, by + 10); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, by + 10, 170, 50, 0, 0, Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, by + 10 - h, 170, 50, 0, 0, TAU); ctx.fillStyle = on ? "#4FB36B" : "#E8604F"; ctx.fill(); ol(ctx, 6);
        ctx.save(); ctx.translate(0, by + 10 - h); ctx.scale(1, .32); micGlyph(ctx, 0, 0, 110, on, t); ctx.restore();
        if (on) glowAt(ctx, 0, by - 60, 300, GREEN, .25 + .1 * Math.sin(t * 6));
        ctx.restore(); },
      front: () => { // noise critters orbit while the mic is on, sucked in at the first press
        M.critters.forEach((nm, i) => { const a = t * 1.6 + i * TAU / M.critters.length, r = 260; let x = M.x + Math.cos(a) * r, y = by - 260 + Math.sin(a) * 110, sc = 1;
          if (t > tOff){ const q = clamp((t - tOff) / .6, 0, 1); x = lerp(x, M.x, eIO(q)); y = lerp(y, by - 80, eIO(q)); sc = 1 - q; if (q >= 1) return; }
          ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 5 + i) * .2); ctx.beginPath(); for (let k = 0; k < 12; k++){ const aa = k / 12 * TAU, rr2 = 52 + (k % 2 ? 12 : 0); ctx.lineTo(Math.cos(aa) * rr2, Math.sin(aa) * rr2); } ctx.closePath();
          ctx.fillStyle = [GOLD, HL, "#E86F5A"][i % 3]; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-14, -10, 6, 0, TAU); ctx.arc(14, -10, 6, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 14, 12, 9, 0, 0, TAU); ctx.fill();
          ctx.restore(); textC(ctx, nm, x, y + 84 * sc, 30 * Math.max(.3, sc), "#FFFFFF", 900); });
        if (t > tOff && t - tOff < .9) burstFx(ctx, M.x, by - 80, t - tOff, GOLD, 12, 240); },
      over: (ctx2, c) => { const p = c.toScreen(M.x, by - 260);
        if (pk >= 0 && pk < 1.6 && lastPress > 0) popChip(ctx, on ? "GILIRANMU: NYALA" : "MIC MATI", clamp(p[0], 280, 800), Math.max(300, p[1] - 160), pk, on ? GREEN : RED, "#FFFFFF", 40, -.04);
        if (t > tName){ const q = eBack(clamp((t - tName) / .4, 0, 1)), k = t - tType; let txt = M.oldName; if (k > 0){ const del = Math.floor(k * 24); txt = del < M.oldName.length ? M.oldName.slice(0, M.oldName.length - del) : M.newName.slice(0, Math.floor((k - M.oldName.length / 24) * 16)); }
          ctx.save(); ctx.translate(540, 380); ctx.scale(q, q); rr(ctx, -360, -60, 720, 120, 22); ctx.fillStyle = "rgba(20,24,36,.92)"; ctx.fill(); ctx.strokeStyle = t > tOk ? GREEN : HL; ctx.lineWidth = 6; ctx.stroke();
          micGlyph(ctx, -300, 0, 32, on, t); textL(ctx, txt + (Math.sin(t * 10) > 0 && t < tOk ? "|" : ""), -250, 18, 50, "#FFFFFF", 800, 560);
          textL(ctx, "NAMA TAMPILAN", -340, -74, 26, "#BFE2EA", 800); ctx.restore();
          if (t > tOk){ popChip(ctx, "JELAS!", 830, 300, t - tOk, GREEN, "#FFFFFF", 40, .08); burstFx(ctx, 540, 380, t - tOk, GOLD, 12, 330); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.mik || {}; ["offCue", "onCue", "off2Cue"].forEach(k => { if (M[k]) { add(cueT(s, M[k], .3, i), "pop"); } }); if (M.offCue) add(cueT(s, M.offCue, .3, i) + .2, "whoosh");
    if (M.nameCue) add(cueT(s, M.nameCue, .2, i), "pop"); if (M.okCue) add(cueT(s, M.okCue, .3, i), "chime"); });

  /* ================= JS36 _bengkel: a small motorbike workshop (arrival / key-tag board / warm welcome) ================= */
  function garage(ctx, t, G2){ const L = -700, Rr = 1800, top = -400;
    ctx.fillStyle = "#F0D49A"; ctx.fillRect(L, top, Rr - L, GY - top + 10);
    ctx.fillStyle = "#E8C483"; for (let x = L; x < Rr; x += 90) ctx.fillRect(x, top, 6, GY - top);
    ctx.fillStyle = "#B5643C"; ctx.fillRect(L, GY - 260, Rr - L, 260); ctx.strokeStyle = "#9A5030"; ctx.lineWidth = 4;
    for (let r = 0; r < 5; r++){ const y = GY - 260 + r * 52; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(Rr, y); ctx.stroke(); for (let x = L + (r % 2) * 60; x < Rr; x += 120){ ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 52); ctx.stroke(); } }
    ctx.fillStyle = "#7A4A2E"; ctx.fillRect(L, GY - 272, Rr - L, 16);
    // roof beam + lamps
    ctx.fillStyle = "#7A4A2E"; ctx.fillRect(L, 280, Rr - L, 50); [120, 960].forEach((lx, i) => { ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx, 330); ctx.lineTo(lx, 400); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lx - 60, 460); ctx.lineTo(lx + 60, 460); ctx.lineTo(lx + 24, 400); ctx.lineTo(lx - 24, 400); ctx.closePath(); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 4); glowAt(ctx, lx, 480, 260, "#FFE3A8", .32 + .04 * Math.sin(t * 3 + i)); });
    // sign
    ctx.save(); ctx.translate(G2.signX ?? 540, 500); ctx.rotate(Math.sin(t * 1.2) * .01); rr(ctx, -260, -55, 520, 100, 16); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); textC(ctx, G2.sign || "BENGKEL ILHAM", 0, 16, 50, "#FFFFFF", 900); ctx.restore();
    // tyre stack + oil drums (left), tool cabinet (right)
    for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.ellipse(-80, GY - 50 - i * 76, 120, 40, 0, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(-80, GY - 60 - i * 76, 50, 16, 0, 0, TAU); ctx.fillStyle = "#4B4550"; ctx.fill(); }
    [[1120, "#3E9B5A"], [1250, "#C2691F"]].forEach(([dx, c]) => { rr(ctx, dx - 60, GY - 230, 120, 230, 12); ctx.fillStyle = c; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 4; [70, 150].forEach(y => { ctx.beginPath(); ctx.moveTo(dx - 60, GY - y); ctx.lineTo(dx + 60, GY - y); ctx.stroke(); }); textC(ctx, "OLI", dx, GY - 100, 34, "#FFFFFF", 900); });
    if (G2.calendar !== false){ ctx.save(); ctx.translate(G2.calX ?? 230, 620); rr(ctx, -80, -70, 160, 170, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.fillRect(-80, -70, 160, 40); ctx.strokeStyle = OUT; ctx.strokeRect(-80, -70, 160, 40);
      ctx.fillStyle = "#B9A58E"; for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 5; c2++) ctx.fillRect(-64 + c2 * 28, -16 + r * 26, 16, 14); ctx.restore(); }
    // concrete floor with an oil stain
    ctx.fillStyle = "#C9B8A0"; ctx.fillRect(L, GY, Rr - L, 700); ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.beginPath(); ctx.ellipse(700, GY + 90, 160, 30, 0, 0, TAU); ctx.fill(); }
  function keyBoard(ctx, x, y, t, tags, glowName){ ctx.save(); ctx.translate(x, y); rr(ctx, -250, -40, 500, 330, 14); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 6);
    textC(ctx, "KUNCI PELANGGAN", 0, 4, 30, "#FFFFFF", 900);
    tags.forEach((tg, i) => { const hx = -180 + (i % 4) * 120, hy = 60 + Math.floor(i / 4) * 130, sw = Math.sin(t * 2 + i * 1.7) * .08 + (tg.swing || 0);
      ctx.fillStyle = "#9AA6B2"; ctx.beginPath(); ctx.arc(hx, hy, 8, 0, TAU); ctx.fill(); ol(ctx, 3); if (!tg.show) return;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(sw); ctx.strokeStyle = "#7D8792"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 18, 12, 0, TAU); ctx.stroke(); rr(ctx, -6, 28, 12, 30, 4); ctx.fillStyle = "#7D8792"; ctx.fill();
      if (glowName && tg.name === glowName) glowAt(ctx, 0, 70, 90, GOLD, .5 + .2 * Math.sin(t * 5));
      rr(ctx, -50, 40, 100, 58, 8); ctx.fillStyle = tg.col || PAPER; ctx.fill(); ol(ctx, 3); textC(ctx, tg.name, 0, 76, 22, BROWN, 800, 88); ctx.restore(); });
    ctx.restore(); }
  TT.scene(PX + "bengkel", "Cerita: bengkel motor (datang + rem berdecit / papan label kunci / sambutan hangat)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ mode: "datang", boardX: 770, boardY: 560, tags: ["Pak Joko", "Mbak Sari", "Pak Budi", "Bu Ani", "Mas Eko"] }, f.bengkel || {});
    const tBr = T(s, B.brakeCue, .5, idx), tSt = T(s, B.stampCue, .4, idx), tHang = T(s, B.hangCue, .3, idx), tHeart = T(s, B.heartCue, .3, idx), tCard = T(s, B.cardCue, .2, idx);
    const lines = (B.lines || []).map((l, j) => Object.assign({ T: T(s, l.cue, .3, idx) }, l));
    const tags = B.tags.map(n => ({ name: n, show: true })); if (B.newTag) tags.push({ name: B.newTag, show: B.mode !== "kunci" || t > tHang + .7, col: "#FFE680", swing: B.mode === "kunci" && t > tHang + .7 ? Math.sin((t - tHang) * 9) * .5 * Math.max(0, 1 - (t - tHang - .7) / 1.5) : 0 });
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 3000 }, spots: { board: [B.boardX, B.boardY + 140, 1.2], wheel: () => [380, GY - 160, 1.1] },
      back: () => { garage(ctx, t, B); if (B.board !== false) keyBoard(ctx, B.boardX, B.boardY, t, tags, B.glowTag && t > tHeart ? B.glowTag : null); },
      front: (ctx2, c, sts) => { const k = t - tBr; if (k > 0 && k < 1.2 && B.rider != null && sts[B.rider]){ const st = sts[B.rider], kk = st.size / 92, wx = st.x - 10 * kk;
          ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .9 * (1 - k / 1.2)); ctx.lineWidth = 7; ctx.lineCap = "round"; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(wx - 40 - i * 40, GY - 20 - i * 12); ctx.lineTo(wx - 120 - i * 60, GY - 30 - i * 16); ctx.stroke(); } ctx.restore();
          for (let i = 0; i < 6; i++){ const q = (k * 1.5 + i / 6) % 1; ctx.fillStyle = hexA("#D8D2C8", (1 - q) * .7); ctx.beginPath(); ctx.arc(wx - q * 160, GY - 10 - q * 60, 10 + q * 26, 0, TAU); ctx.fill(); } }
        if (t > tHeart && B.heartOn != null && sts[B.heartOn]){ const h = toonHead(sts[B.heartOn]); for (let i = 0; i < 8; i++){ const q = ((t - tHeart) * .6 + i / 8) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * clamp((t - tHeart) * 3, 0, 1);
            ctx.translate(h[0] + Math.sin(i * 2.1 + t) * 160, h[1] - 120 - q * 320); ctx.scale(.8 + rnd(i) * .5, .8 + rnd(i) * .5); ctx.fillStyle = i % 2 ? RED : "#E86FA0"; ctx.beginPath(); ctx.moveTo(0, 14); ctx.bezierCurveTo(-30, -8, -16, -34, 0, -16); ctx.bezierCurveTo(16, -34, 30, -8, 0, 14); ctx.fill(); ol(ctx, 3); ctx.restore(); } } },
      over: (ctx2, c, sts) => { const k = t - tBr; if (k > 0 && k < 1.3 && B.rider != null && sts[B.rider]){ const p = c.toScreen(sts[B.rider].x - 200, GY - 330); popWord(ctx, B.brakeText || "CIIIT!", clamp(p[0], 240, 840), clamp(p[1], 320, 1150), k, { size: 92, hold: 1.2, rot: -8 }); }
        if (t > tSt) stampBox(ctx, B.stampText || "KUNJUNGAN KE-5", 540, 420, t - tSt, RED, 66, -.08);
        if (B.mode === "kunci" && t > tCard){ const q = eBack(clamp((t - tCard) / .4, 0, 1)), h = clamp((t - tHang) / .7, 0, 1), hb = c.toScreen(B.boardX - 180 + (tags.length - 1) % 4 * 120, B.boardY + 60 + Math.floor((tags.length - 1) / 4) * 130 + 70);
          if (h < 1){ const x = lerp(540, hb[0], eIO(h)), y = lerp(400, hb[1], eIO(h)), sc = q * lerp(1, .18 * c.zoom, eIO(h));
            ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-.04 + Math.sin(t * 2) * .015 + h * .5);
            ctx.beginPath(); ctx.moveTo(-300, -150); ctx.lineTo(240, -150); ctx.lineTo(300, -90); ctx.lineTo(300, 90); ctx.lineTo(240, 150); ctx.lineTo(-300, 150); ctx.closePath(); ctx.fillStyle = "#FFE680"; ctx.fill(); ol(ctx, 7);
            ctx.beginPath(); ctx.arc(240, 0, 22, 0, TAU); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#B9A58E"; ctx.lineWidth = 3;
            lines.forEach((l, j) => { const yy = -78 + j * 84; ctx.beginPath(); ctx.moveTo(-270, yy + 26); ctx.lineTo(190, yy + 26); ctx.stroke(); if (t >= l.T){ textL(ctx, (l.label ? l.label + " " : ""), -270, yy, 26, "#8E6A4A", 700); const lw = l.label ? (font(ctx, 700, 26, FAM), ctx.measureText(l.label + " ").width) : 0;
              textL(ctx, typed(l.text, t - l.T, 20), -270 + lw, yy + 6, j === 0 ? 50 : 40, j === 2 ? RED : "#2F4F9E", 900, 440 - lw); } });
            ctx.restore(); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.bengkel || {}; if (B.brakeCue){ const t0 = cueT(s, B.brakeCue, .5, i); add(t0, "ping"); add(t0 + .15, "ping"); }
    if (B.stampCue) add(cueT(s, B.stampCue, .4, i), "pop"); (B.lines || []).forEach(l => add(cueT(s, l.cue, .3, i), "pop")); if (B.hangCue) { add(cueT(s, B.hangCue, .3, i), "whoosh"); add(cueT(s, B.hangCue, .3, i) + .7, "chime"); }
    if (B.cardCue) add(cueT(s, B.cardCue, .2, i), "pop"); if (B.heartCue) add(cueT(s, B.heartCue, .3, i), "chime"); });

  /* ================= SC36 _sayap: payday night, banknotes grow wings and fly off ================= */
  const rupiah = n => "Rp" + Math.max(0, Math.round(n / 1000) * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  function bankNote(ctx, x, y, t, sc, seed, wing){ ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 4 + seed) * .25);
    if (wing){ const fl = .25 + .75 * Math.abs(Math.sin(t * 12 + seed)); [-1, 1].forEach(d => { ctx.save(); ctx.scale(d, 1); ctx.translate(40, -10); ctx.scale(1, fl);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(40, -70, 100, -60); ctx.quadraticCurveTo(80, -40, 90, -24); ctx.quadraticCurveTo(60, -20, 64, -4); ctx.quadraticCurveTo(30, -6, 0, 0); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3.5); ctx.restore(); }); }
    rr(ctx, -70, -34, 140, 68, 8); ctx.fillStyle = "#8CC79A"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = "#BFE3C6"; ctx.fill(); ol(ctx, 2.5);
    textC(ctx, "Rp", 0, 9, 24, "#2E6B3E", 900); ctx.restore(); }
  TT.scene(PX + "sayap", "Cerita: gaji di amplop, uang bersayap terbang ke langit malam", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, W2 = Object.assign({ x: 560, y: 1080, amount: 4000000, n: 26 }, f.sayap || {});
    const tPay = T(s, W2.payCue, .3, idx), tFly = T(s, W2.flyCue, .4, idx), tZero = T(s, W2.zeroCue, .5, idx), tDay = T(s, W2.dayCue, .2, idx);
    const prog = clamp((t - tFly) / Math.max(.5, tZero - tFly), 0, 1), left = Math.round(W2.n * (1 - prog));
    base(ctx, s, t, { env: "night", envOpt: {}, spots: { env: [W2.x, W2.y - 100, 1.15] },
      front: () => { if (t < tPay) return; const q = eBack(clamp((t - tPay) / .45, 0, 1)), emp = t > tZero; ctx.save(); ctx.translate(W2.x, W2.y + Math.sin(t * 2) * 10); ctx.scale(q, q); ctx.rotate(-.06 + (emp ? Math.sin(t * 3) * .05 : 0));
          rr(ctx, -150, -95, 300, 190, 14); ctx.fillStyle = "#F3E3C2"; ctx.fill(); ol(ctx, 6);
          for (let i = 0; i < Math.min(5, left); i++){ ctx.save(); ctx.translate(-60 + i * 30, -100 - i * 4); ctx.rotate(-.2 + i * .1); rr(ctx, -40, -40, 80, 60, 6); ctx.fillStyle = "#8CC79A"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
          ctx.beginPath(); ctx.moveTo(-150, -95); ctx.lineTo(0, 10); ctx.lineTo(150, -95); ctx.fillStyle = "#E8D2A8"; ctx.fill(); ol(ctx, 5);
          textC(ctx, "GAJI", 0, 66, 54, ORANGE, 900); ctx.restore();
          if (t < tPay + .9) burstFx(ctx, W2.x, W2.y, t - tPay, GOLD, 12, 260);
          // winged notes
          for (let i = 0; i < W2.n; i++){ const t0 = tFly + i * (tZero - tFly) / W2.n, k = t - t0; if (k < 0 || k > 3.2) continue;
            const dir = rnd(i) > .5 ? 1 : -1, x = W2.x + Math.sin(k * 3 + i) * 60 + dir * k * (120 + rnd(i + 2) * 200), y = W2.y - 120 - k * (260 + rnd(i + 5) * 160);
            bankNote(ctx, x, y, t, .9 * (1 - k * .15), i * 1.3, true); } },
      over: () => { if (t > tPay){ const shown = t < tFly ? W2.amount : W2.amount * (1 - prog), q = eBack(clamp((t - tPay) / .4, 0, 1)), red = t > tZero;
          ctx.save(); ctx.translate(540, 300); ctx.scale(q, q); rr(ctx, -290, -70, 580, 140, 24); ctx.fillStyle = red ? RED : NAVY; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.stroke();
          textC(ctx, "SALDO", 0, -20, 30, hexA("#FFFFFF", .8), 800); textC(ctx, rupiah(shown), 0, 42, 62, "#FFFFFF", 900, 520); ctx.restore(); }
        const day = t > tDay ? (W2.day2 || "27") : (W2.day1 || "25"), fk = t - tDay, sy = fk > 0 && fk < .4 ? Math.abs(Math.cos(fk / .4 * Math.PI)) : 1;
        ctx.save(); ctx.translate(140, 470); ctx.rotate(-.06); ctx.scale(1, sy); rr(ctx, -80, -80, 160, 170, 12); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = RED; rr(ctx, -80, -80, 160, 46, 12); ctx.fill(); ol(ctx, 5);
        textC(ctx, "TGL", 0, -46, 26, "#FFFFFF", 900); textC(ctx, day, 0, 52, 74, BROWN, 900); ctx.restore();
        if (t > tZero) stampBox(ctx, W2.zeroText || "TINGGAL NOL", 540, 520, t - tZero, RED, 70, -.08); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const W2 = f.sayap || {}; if (W2.payCue) add(cueT(s, W2.payCue, .3, i), "chime"); if (W2.flyCue){ const a = cueT(s, W2.flyCue, .4, i), b = cueT(s, W2.zeroCue, .5, i); for (let k = 0; k < 4; k++) add(a + (b - a) * k / 4, "whoosh"); }
    if (W2.zeroCue) add(cueT(s, W2.zeroCue, .5, i), "pop"); if (W2.dayCue) add(cueT(s, W2.dayCue, .2, i), "pop"); });

  /* ================= SC36 _gurun: chasing a mirage in the desert ================= */
  function palm(ctx, x, y, h, t, a){ ctx.save(); ctx.translate(x, y); ctx.strokeStyle = "#8E5A36"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-20, -h * .5, 10, -h); ctx.stroke();
    ctx.translate(10, -h); for (let i = 0; i < 6; i++){ ctx.save(); ctx.rotate(-2.6 + i * .85 + Math.sin(t * 1.5 + i) * .06); ctx.beginPath(); ctx.ellipse(55, 0, 60, 16, 0, 0, TAU); ctx.fillStyle = i % 2 ? "#3E9B5A" : "#4FB36B"; ctx.fill(); ol(ctx, 3); ctx.restore(); } ctx.restore(); }
  TT.scene(PX + "gurun", "Cerita: mengejar fatamorgana di gurun (oasis BALIK MODAL makin jauh)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gm = Object.assign({ on: 0, d0: 700, grow: 700 }, f.gurun || {});
    const tM = T(s, Gm.mirageCue, .3, idx), tC = T(s, Gm.chaseCue, .3, idx), tEnd = T(s, Gm.endCue, .5, idx);
    const drops = (Gm.drops || []).map((d, j) => Object.assign({ T: T(s, d.cue, .4, idx) }, d));
    let ax = 540;
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: false }, envFront: false, spots: { oasis: () => [ax + Gm.d0, 1150, .9] },
      back: (ctx2, c, sts) => { const st = sts[Gm.on]; ax = st ? st.x : 540; const L = c.x - 1400, R = c.x + 1400;
        const g = ctx.createLinearGradient(0, 0, 0, GY); g.addColorStop(0, "#F6B25A"); g.addColorStop(.6, "#FBD58A"); g.addColorStop(1, "#FFE9B8"); ctx.fillStyle = g; ctx.fillRect(L, -600, R - L, GY + 700);
        ctx.save(); ctx.translate(c.x * .7 + 300, 520); glowAt(ctx, 0, 0, 380, "#FFF1B8", .7); ctx.beginPath(); ctx.arc(0, 0, 120, 0, TAU); ctx.fillStyle = "#FFF6D8"; ctx.fill(); ctx.restore();
        // far dunes (slow), near dunes
        [[.55, 1230, "#E9B46A", 260], [.8, 1400, "#E2A457", 200], [1, 1560, "#D99448", 160]].forEach(([dp, base0, col, amp], li) => { ctx.beginPath(); const off = c.x * (1 - dp);
          ctx.moveTo(L, GY + 600); for (let x = L; x <= R; x += 40){ const xx = x - off; ctx.lineTo(x, base0 - amp * .5 * (1 + Math.sin(xx / (300 + li * 90) + li))); } ctx.lineTo(R, GY + 600); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); });
        ctx.fillStyle = "#EDB870"; ctx.fillRect(L, GY - 10, R - L, 700);
        for (let i = 0; i < 14; i++){ const sx = Math.floor((L + i * 200) / 200) * 200 + (rnd(i) * 120); ctx.fillStyle = hexA("#C98840", .5); ctx.beginPath(); ctx.ellipse(sx, GY + 30 + rnd(i + 3) * 120, 40, 8, 0, 0, TAU); ctx.fill(); }
        // the mirage oasis
        if (t > tM){ const p = clamp((t - tC) / Math.max(1, tEnd - tC), 0, 1), dist = Gm.d0 + Gm.grow * p, ox = ax + dist, vis = clamp((t - tM) / .8, 0, 1) * (1 - clamp((t - tEnd) / .6, 0, 1)), sc = 1.25 * (1 - .5 * p);
          if (vis > 0){ ctx.save(); ctx.globalAlpha = vis * (.75 + .2 * Math.sin(t * 7)); ctx.translate(ox, 1330); ctx.scale(sc * (1 + Math.sin(t * 5) * .02), sc * (1 + Math.cos(t * 6) * .04));
            ctx.beginPath(); ctx.ellipse(0, 40, 300, 60, 0, 0, TAU); ctx.fillStyle = "#6EC6E0"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-200 + i * 120 + Math.sin(t * 3 + i) * 20, 40 + i * 8); ctx.lineTo(-140 + i * 120 + Math.sin(t * 3 + i) * 20, 40 + i * 8); ctx.stroke(); }
            palm(ctx, -230, 30, 300, t, 1); palm(ctx, 220, 30, 260, t, 1);
            for (let i = 0; i < 7; i++){ ctx.beginPath(); ctx.ellipse(-60 + (i % 4) * 38, 10 - Math.floor(i / 4) * 22, 26, 10, 0, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); }
            ctx.fillStyle = "#7A4A2E"; ctx.fillRect(80, -230, 14, 240); rr(ctx, -10, -330, 200, 110, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, "BALIK", 90, -285, 40, ORANGE, 900); textC(ctx, "MODAL", 90, -240, 40, ORANGE, 900);
            glowAt(ctx, 0, -60, 340, GOLD, .25); ctx.restore(); }
          if (t > tEnd && t - tEnd < 1) burstFx(ctx, ox, 1150, t - tEnd, "#FFFFFF", 10, 260); }
        // heat haze lines
        ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .35); ctx.lineWidth = 4; for (let i = 0; i < 8; i++){ const y = 1000 + i * 70, x0 = c.x - 500 + rnd(i) * 900; ctx.beginPath(); for (let k = 0; k < 10; k++) ctx.lineTo(x0 + k * 22, y + Math.sin(k * 1.3 + t * 6 + i) * 8); ctx.stroke(); } ctx.restore();
        // dropped items sinking in the sand behind
        drops.forEach((d, j) => { if (t < d.T) return; const k = t - d.T; if (d.x0 == null) d.x0 = null; const st2 = sts[Gm.on]; if (!st2) return;
          const xd = toonState(f.toons[Gm.on], s, d.T).x - 40 - k * 170, y = GY - 820 - k * 140 + Math.sin(k * 5) * 30, sink = clamp((k - 1.2) / 1.2, 0, 1); if (sink >= 1) return;
          ctx.save(); ctx.translate(xd, y); ctx.rotate(Math.min(k * 6, 1.2) * (j % 2 ? 1 : -1) * .3); ctx.globalAlpha = 1 - sink * .6; chip(ctx, d.text, 0, 0, d.col || PAPER, BROWN, 34); ctx.restore(); }); },
      over: (ctx2, c) => { if (t > tEnd) popWord(ctx, Gm.endText || "FATAMORGANA", 540, 420, t - tEnd, { size: 90, hold: 2.4, rot: -5 }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gm = f.gurun || {}; if (Gm.mirageCue) add(cueT(s, Gm.mirageCue, .3, i), "chime"); if (Gm.chaseCue) add(cueT(s, Gm.chaseCue, .3, i), "whoosh");
    if (Gm.endCue) add(cueT(s, Gm.endCue, .5, i), "pop"); (Gm.drops || []).forEach(d => add(cueT(s, d.cue, .4, i), "pop")); });

  /* ================= _adegan: generic story shot with the extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, motor, halte, debu, chip, kata pop, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);
})();
