/* Scene pack j2611221200502: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SC34, MS34, SB35, SP35, RN35.
   Layout prefix j2611221200502_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, hold, piece:false}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, out|outCue, s, dx, dy, ...}]  object in a toon's hand: wand, drawing, sign, phone, brush, wrench, mop, note, ball, pen
     pops   [{at|cue, text, x, y, size, rot, col}]      big outlined pop words (screen)      confetti {at|cue}      toon.chair (rolling chair)
   Set pieces (layout suffix):
     _adegan    generic story shot with the extras above
     _sulap     theatre stage: a magician taps a top hat, banknotes fountain out, marquee UNTUNG PASTI, audience silhouettes cheer (mode "show");
                mode "bongkar": curtains open on a glass money pipe from SETORAN ANGGOTA BARU to UNTUNG ANGGOTA LAMA, flow stops, magician
                vanishes in smoke and the hat drops                                                                       f.show
     _hidung    every promise makes the promoter's nose grow longer (elastic), a leaf sprouts, a bird lands on it; greedy coins orbit
                the listener, a glowing TRANSFER button                                                                   f.nose
     _simpai    circus ring with two hoops LEGAL / LOGIS: a greedy money-sack creature bounces off the first and gets stuck in the second   f.hoops
     _anjing    "urusan kantor" as a laptop-dog (screen face, keyboard body, cable tail, notification badge) that follows the hero home
                (mode "jalan"), jumps on the dinner table and barks TING (mode "rumah"), or is tucked into a basket on the office desk
                with a BESOK note and goes to sleep (mode "titip")                                                       f.dog
     _ubah      the living room morphs into an office piece by piece: lamp, family photo -> whiteboard, window -> monitor, sofa -> office
                chair, dining table -> meeting table, neon KANTOR 24 JAM                                                  f.morph
     _rajut     knitting scarves: one knitter unravels at every flaw, the other keeps knitting rough rows with a day counter; a scarf
                long enough to run around the office (path)                                                               f.knit
     _gigi      bathroom: two tooth characters, scrubbed 3 hours once a month (foam, still holes) vs 2 minutes daily (sparkles, AMPUH)  f.gigi
     _bengkel   machine workshop: digging through a tool pile (flying tools, search timer, cable trip) or a tidy labelled tool board,
                week ticks and a 5-second find                                                                            f.ws
     _ringkas   R1 red tags fly unneeded items into a SINGKIRKAN box, R2 tools snap into labelled silhouettes on a board   f.sort
     _resik     the mop pass wipes grime off the workshop, the hidden oil leak appears, a KONDISI IDEAL photo + checklist   f.resik
     _benteng   a cardboard-box fort is built around a silent worker (typing sounds, JANGAN GANGGU) or knocked on and collapses to
                reveal the 80% progress                                                                                   f.fort
     _orkestra  the team is an orchestra frozen mid-pose waiting days for the conductor; the conductor brings a 3-line score
                (SUDAH / BERIKUTNYA / BUTUH), taps the baton and the music bursts out                                     f.ork */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221200502_";
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
  const elast = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (TAU / 3)) + 1;
  const PURPLE = "#5B3B7A", SKY = "#BFE2EA", MAROON = "#8E2F3C";

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "wand"){ ctx.rotate(-.6 + Math.sin(t * 5) * .15); rr(ctx, -9, -150, 18, 170, 8); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 4); rr(ctx, -10, -160, 20, 34, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      for (let i = 0; i < 4; i++){ const a = t * 3 + i * TAU / 4, r = 34 + 8 * Math.sin(t * 7 + i); sparkle(ctx, Math.cos(a) * r, -150 + Math.sin(a) * r, 11, i % 2 ? GOLD : CREAM); } }
    else if (kind === "drawing"){ ctx.rotate(-.06 + Math.sin(t * 2) * .03); rr(ctx, -120, -170, 240, 180, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(76, -134, 22, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#3E9B5A"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-110, -20); ctx.quadraticCurveTo(0, -36, 110, -20); ctx.stroke();
      ctx.fillStyle = "#D9483B"; ctx.beginPath(); ctx.moveTo(-90, -80); ctx.lineTo(-50, -120); ctx.lineTo(-10, -80); ctx.fill(); ctx.fillStyle = "#E8A55B"; ctx.fillRect(-84, -80, 68, 56);
      [[20, "#2F6F73"], [52, "#C2691F"], [80, "#E26D8E"]].forEach(([cx, col], i) => { const h = i === 2 ? 30 : 46; ctx.fillStyle = col; ctx.fillRect(cx - 9, -24 - h, 18, h); ctx.beginPath(); ctx.arc(cx, -32 - h, 11, 0, TAU); ctx.fillStyle = "#F0C29A"; ctx.fill(); }); }
    else if (kind === "sign"){ const w = o.w || 300, txt = o.text || ""; ctx.rotate(Math.sin(t * 2.2) * .05); ctx.fillStyle = "#9B6A3C"; rr(ctx, -8, -40, 16, 150, 6); ctx.fill(); ol(ctx, 4);
      const { L, size } = lines2(ctx, txt, w - 40, o.size || 58, 900); const h = L.length * size * 1.1 + 36; rr(ctx, -w / 2, -40 - h, w, h, 14); ctx.fillStyle = o.col || PAPER; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = o.ink || BROWN; ctx.textAlign = "center"; L.forEach((l, i) => { font(ctx, 900, size, FAM); ctx.fillText(l, 0, -40 - h + 18 + size * .9 + i * size * 1.1); }); ctx.textAlign = "left"; }
    else if (kind === "phone"){ prop(ctx, "phone", 0, 0, { s: .6, screen: o.screen || SKY }, t); }
    else if (kind === "brush"){ ctx.rotate(-.9 + Math.sin(t * (o.fast ? 30 : 8)) * (o.fast ? .25 : .1)); rr(ctx, -10, -150, 20, 190, 9); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 4);
      rr(ctx, -16, -196, 32, 50, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#8FD0EE"; for (let i = 0; i < 4; i++) ctx.fillRect(-12 + i * 7, -194, 4, 44); }
    else if (kind === "wrench"){ ctx.rotate(-.5 + Math.sin(t * 3) * .1); ctx.fillStyle = "#AEB8C2"; rr(ctx, -12, -120, 24, 200, 10); ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(0, -130, 34, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.fillStyle = o.bg || "#3B4A6B"; ctx.beginPath(); ctx.moveTo(-12, -170); ctx.lineTo(12, -170); ctx.lineTo(10, -132); ctx.lineTo(-10, -132); ctx.fill();
      ctx.fillStyle = ORANGE; rr(ctx, -15, 20, 30, 70, 10); ctx.fill(); ol(ctx, 4); }
    else if (kind === "mop"){ ctx.rotate(.18 + Math.sin(t * (o.fast ? 9 : 3)) * .12); ctx.fillStyle = "#C9A47A"; rr(ctx, -7, -60, 14, 330, 6); ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = "#2F6F73"; rr(ctx, -70, 262, 140, 22, 8); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#E9E4DA"; for (let i = 0; i < 9; i++){ rr(ctx, -66 + i * 15, 282, 10, 34 + Math.sin(t * 9 + i) * 5, 5); ctx.fill(); } }
    else if (kind === "note"){ ctx.rotate(.05 + Math.sin(t * 2) * .04); rr(ctx, -95, -190, 190, 190, 6); ctx.fillStyle = "#F6D36B"; ctx.fill(); ol(ctx, 5);
      textC(ctx, o.text || "BESOK", 0, -142, 30, BROWN, 900, 160); for (let i = 0; i < 3; i++){ ctx.fillStyle = "#B9893A"; rr(ctx, -66, -112 + i * 32, 22, 16, 4); ctx.fill(); rr(ctx, -36, -110 + i * 32, 90 - i * 14, 12, 6); ctx.fill(); } }
    else if (kind === "ball"){ const r = 64; ctx.rotate(t * (o.spin || 0)); for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, i * TAU / 6, (i + 1) * TAU / 6); ctx.closePath(); ctx.fillStyle = [RED, "#FFFFFF", GOLD, "#FFFFFF", TEAL, "#FFFFFF"][i]; ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ol(ctx, 5); }
    else if (kind === "pen"){ ctx.rotate(-.8 + Math.sin(t * 14) * .18); rr(ctx, -7, -110, 14, 120, 6); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 3); ctx.fillStyle = OUT; ctx.beginPath(); ctx.moveTo(-7, 10); ctx.lineTo(7, 10); ctx.lineTo(0, 30); ctx.fill(); }
    ctx.restore(); }

  /* rolling office chair (world), seat at the hip of a sitting toon of size sz */
  function chairAt(ctx, x, y, sz, face, spin){ const k = sz / 92, sy = y - 11 * k; ctx.save();
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, y + 2, 20 * k, 3 * k, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 2.4 * k; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 15 * k, y - 2.5 * k); ctx.lineTo(x + 15 * k, y - 2.5 * k); ctx.moveTo(x, y - 2.5 * k); ctx.lineTo(x, sy + 2 * k); ctx.stroke();
    [-15, 0, 15].forEach(d => { ctx.beginPath(); ctx.arc(x + d * k, y - 1.6 * k, 1.8 * k, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); });
    const bx = x - face * 12 * k * Math.cos(spin || 0), bw = 5 * k * (.4 + .6 * Math.abs(Math.cos(spin || 0)));
    rr(ctx, bx - bw / 2, sy - 30 * k, bw, 28 * k, 2.5 * k); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, .7 * k);
    rr(ctx, x - 14 * k - face * 2 * k, sy - 2 * k, 28 * k, 5 * k, 2.4 * k); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, .7 * k); ctx.restore(); }

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
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j]; if (a.chair){ layer(ctx, c, 1, () => chairAt(ctx, a.chairX ?? st.x, st.y, st.size, st.face || 1, st.moving && a.chairX == null ? (t - st.moveT) * 9 : 0)); }
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
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
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= SC34 ================= */
  function noteBill(ctx, x, y, rot, s, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); rr(ctx, -46, -24, 92, 48, 6); ctx.fillStyle = col || "#7FBF7A"; ctx.fill(); ol(ctx, 3.5);
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .7); ctx.fill(); textC(ctx, "Rp", 0, 7, 16, "#2E6B3A", 900); ctx.restore(); }
  function coin(ctx, x, y, r, t, i){ const w = Math.abs(Math.cos(t * 4 + i)); ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(.2, w), 1); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3.5);
    if (w > .5) textC(ctx, "Rp", 0, r * .35, r * .9, "#9A6A12", 900); ctx.restore(); }
  /* greedy coins orbiting a head (world) */
  function greed(ctx, st, t, k){ if (k < 0) return; const h = toonHead(st), q = eBack(clamp(k / .5, 0, 1)), R = st.size * .2;
    for (let i = 0; i < 5; i++){ const a = t * 2.2 + i * TAU / 5; coin(ctx, h[0] + Math.cos(a) * R * 1.3 * q, h[1] - st.size * .05 + Math.sin(a) * R * .45 * q, 22 * q, t, i); } }
  /* theatre stage (world): back wall, curtains, platform; o.dark 0..1 */
  const SY = 1380;
  function stage(ctx, t, o){ const dark = o.dark || 0;
    const g = ctx.createLinearGradient(0, 150, 0, SY); g.addColorStop(0, "#2A1838"); g.addColorStop(1, "#4A2B55"); ctx.fillStyle = g; ctx.fillRect(-400, 100, 1880, SY - 100);
    ctx.fillStyle = hexA("#FFFFFF", .05); for (let i = 0; i < 14; i++) ctx.fillRect(-380 + i * 140, 120, 6, SY - 120);
    // platform
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-400, SY, 1880, 40); ctx.fillStyle = "#6B3A22"; ctx.fillRect(-400, SY + 40, 1880, GY - SY - 40);
    ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 4; for (let i = 0; i < 16; i++){ ctx.beginPath(); ctx.moveTo(-400 + i * 130, SY + 40); ctx.lineTo(-400 + i * 130, GY); ctx.stroke(); }
    ctx.fillStyle = GOLD; ctx.fillRect(-400, SY + 34, 1880, 8);
    // curtains
    const cur = (x0, x1, open) => { const w = x1 - x0; ctx.save(); ctx.beginPath(); for (let i = 0; i <= 8; i++){ const xx = x0 + w * i / 8; ctx.lineTo(xx + Math.sin(t * 1.3 + i) * 6, 150); } ctx.lineTo(x1, SY + 20); ctx.lineTo(x0, SY + 20); ctx.closePath();
      ctx.fillStyle = "#A3263A"; ctx.fill(); ol(ctx, 5); for (let i = 1; i < 8; i++){ const xx = x0 + w * i / 8 + Math.sin(t * 1.3 + i) * 6; ctx.strokeStyle = hexA("#5C0F1D", .7); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(xx, 160); ctx.quadraticCurveTo(xx + 14, (160 + SY) / 2, xx - 4, SY + 18); ctx.stroke(); } ctx.restore(); };
    const op = o.open || 0; cur(-400, 150 - 160 * op, op); cur(930 + 160 * op, 1480, op);
    ctx.fillStyle = "#8B1E30"; ctx.beginPath(); ctx.moveTo(-400, 100); ctx.lineTo(1480, 100); ctx.lineTo(1480, 230); for (let i = 0; i <= 12; i++){ const xx = 1480 - i * 1880 / 12; ctx.quadraticCurveTo(xx - 78, 300, xx - 156, 230); } ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = GOLD; for (let i = 0; i < 12; i++){ ctx.beginPath(); ctx.arc(-400 + 78 + i * 156, 296, 10, 0, TAU); ctx.fill(); }
    if (dark > 0){ ctx.fillStyle = hexA("#0B0712", .55 * dark); ctx.fillRect(-400, 100, 1880, GY - 100); } }
  function spotCone(ctx, x0, y0, x1, y1, w, a){ ctx.save(); const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, hexA("#FFF2C4", a)); g.addColorStop(1, hexA("#FFF2C4", a * .25));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - 20, y0); ctx.lineTo(x0 + 20, y0); ctx.lineTo(x1 + w, y1); ctx.lineTo(x1 - w, y1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x1, y1, w, w * .18, 0, 0, TAU); ctx.fillStyle = hexA("#FFF2C4", a * .8); ctx.fill(); ctx.restore(); }
  function marquee(ctx, cx, cy, w, h, t, k, o){ if (k < 0) return; const q = elast(clamp(k / .9, 0, 1)); o = o || {};
    ctx.save(); ctx.translate(cx, cy - (1 - q) * 500); ctx.rotate(o.tilt || 0);
    ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w * .35, -h / 2); ctx.lineTo(-w * .35, -h / 2 - 260); ctx.moveTo(w * .35, -h / 2); ctx.lineTo(w * .35, -h / 2 - 260); ctx.stroke();
    rr(ctx, -w / 2, -h / 2, w, h, 22); ctx.fillStyle = o.off ? "#3A2A3E" : "#2C1A33"; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 10; ctx.stroke();
    const n = 26; for (let i = 0; i < n; i++){ const u = i / n, per = 2 * (w + h); let d = u * per, bx, by; if (d < w){ bx = -w / 2 + d; by = -h / 2; } else if ((d -= w) < h){ bx = w / 2; by = -h / 2 + d; } else if ((d -= h) < w){ bx = w / 2 - d; by = h / 2; } else { d -= w; bx = -w / 2; by = h / 2 - d; }
      const on = o.off ? (i === 5 && Math.sin(t * 13) > .6) : ((i + Math.floor(t * 8)) % 3 === 0); ctx.beginPath(); ctx.arc(bx, by, 11, 0, TAU); ctx.fillStyle = on ? "#FFE9A0" : (o.off ? "#5A4A3E" : "#B58A2E"); ctx.fill(); if (on) glowAt(ctx, bx, by, 30, "#FFE08A", .5); }
    textC(ctx, o.title || "UNTUNG PASTI", 0, -6, 78, o.off ? "#7A6A78" : GOLD, 900, w - 70); textC(ctx, o.sub || "50% / BULAN", 0, h / 2 - 30, 46, o.off ? "#6A5A68" : "#FFFFFF", 900, w - 80); ctx.restore(); }
  function hatTable(ctx, x, y, t, o){ // y = stage floor; returns hat opening point
    ctx.fillStyle = "#2C2433"; rr(ctx, x - 12, y - 240, 24, 240, 6); ctx.fill(); rr(ctx, x - 70, y - 14, 140, 16, 6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 130, y - 240); ctx.lineTo(x + 130, y - 240); ctx.lineTo(x + 112, y - 120 + Math.sin(t * 2) * 4); ctx.lineTo(x - 112, y - 120 - Math.sin(t * 2) * 4); ctx.closePath(); ctx.fillStyle = PURPLE; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = GOLD; for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.arc(x - 106 + i * 26.5, y - 118 + Math.sin(t * 2 + i) * 3, 7, 0, TAU); ctx.fill(); }
    if (o.hat === false) return [x, y - 240];
    const hy = y - 240 - (o.hop || 0); ctx.save(); ctx.translate(x, hy); ctx.rotate(o.hatRot || 0);
    ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.ellipse(0, -2, 92, 18, 0, 0, TAU); ctx.fill(); ol(ctx, 4); rr(ctx, -66, -150, 132, 150, 8); ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = RED; ctx.fillRect(-66, -46, 132, 26); ctx.beginPath(); ctx.ellipse(0, -150, 66, 16, 0, 0, TAU); ctx.fillStyle = "#0B0A0A"; ctx.fill(); ol(ctx, 4); ctx.restore();
    return [x, hy - 150]; }
  function smokePuff(ctx, x, y, k, R, col){ if (k < 0 || k > 1.4) return; const q = eOut(clamp(k / 1.4, 0, 1)); ctx.save(); ctx.globalAlpha *= 1 - q;
    for (let i = 0; i < 9; i++){ const a = i / 9 * TAU + rnd(i) * .5, r = R * (.25 + q * .9); ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * .7 - q * 60, R * (.32 + .2 * rnd(i + 3)) * (1 + q * .4), 0, TAU); ctx.fillStyle = col || "#EDE6F2"; ctx.fill(); }
    ctx.restore(); }
  function audience(ctx, t, cheer, xs){ // silhouettes seen from behind, world y below the stage edge
    (xs || [[-120, 0], [80, 1], [300, 0], [520, 1], [760, 0], [990, 1], [1190, 0]]).forEach(([x, hij], i) => { const b = cheer > 0 ? Math.abs(Math.sin(t * 9 + i)) * 22 * clamp(cheer, 0, 1) : Math.sin(t * 2 + i) * 3, y = 1730 - b;
      ctx.fillStyle = "#1B1220"; ctx.beginPath(); ctx.ellipse(x, y + 150, 150, 120, 0, Math.PI, 0); ctx.fill();
      if (hij){ ctx.beginPath(); ctx.moveTo(x - 96, y + 120); ctx.quadraticCurveTo(x - 100, y - 92, x, y - 96); ctx.quadraticCurveTo(x + 100, y - 92, x + 96, y + 120); ctx.closePath(); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(x, y, 78, 0, TAU); ctx.fill(); }
      if (cheer > 0 && i % 2 === 0){ ctx.strokeStyle = "#1B1220"; ctx.lineWidth = 26; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 70, y + 60); ctx.lineTo(x + 110, y - 90 - b); ctx.stroke(); } }); }

  /* ---- _sulap: magic show "money from the hat" (mode show) / backstage reveal (mode bongkar) ---- */
  TT.scene(PX + "sulap", "Cerita: panggung sulap uang (pertunjukan / dibongkar)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ mode: "show", x: 820, hero: 1, mag: 0 }, f.show || {}), show = M.mode === "show";
    const tBan = T(s, M.bannerCue, .2, idx), tTap = T(s, M.tapCue, .3, idx), tMoney = T(s, M.moneyCue, .2, idx), tPasti = T(s, M.pastiCue, .1, idx), tGreed = T(s, M.greedCue, .3, idx);
    const tRev = T(s, M.revealCue, .2, idx), tStop = T(s, M.stopCue, .3, idx), tGone = T(s, M.goneCue, .5, idx), tMacet = M.macetCue ? T(s, M.macetCue, .3, idx) : tStop;
    let hatPt = null;
    base(ctx, s, t, { env: "night", envFront: false,
      spots: { hat: [M.x, SY - 300, 1.25], banner: [560, 520, 1.1], pipe: [540, 760, 1.05] },
      back: (c2, c, sts) => {
        const open = show ? 0 : eOut(ramp(t, tRev, tRev + 1.2));
        stage(ctx, t, { dark: show ? 0 : .6 + .3 * ramp(t, tStop, tStop + 1), open });
        if (!show){ // backstage money pipe behind the stage
          const run = t < tStop ? 1 : 1 - ramp(t, tStop, tStop + 1.6), y0 = 640;
          ctx.save(); ctx.globalAlpha *= open;
          rr(ctx, 170, y0 - 46, 780, 92, 46); ctx.fillStyle = hexA("#DDEFF5", .35); ctx.fill(); ol(ctx, 6, "#9AA6B2");
          ctx.beginPath(); ctx.moveTo(870, 420); ctx.lineTo(1050, 420); ctx.lineTo(960, y0); ctx.lineTo(880, y0); ctx.closePath(); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 6);
          rr(ctx, 150, y0 - 20, 70, 170, 14); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5);
          for (let i = 0; i < 12; i++){ const u = ((t * .5 + i / 12) % 1), xx = 920 - u * 730; if (rnd(i) > run) continue; coin(ctx, xx, y0 + Math.sin(u * 20 + i) * 10, 24, t, i); }
          for (let i = 0; i < 6; i++){ const u = ((t * 1.1 + i / 6) % 1); if (rnd(i + 20) > run) continue; coin(ctx, 185, y0 + 170 + u * 560, 20, t, i); }
          for (let i = 0; i < 5; i++){ const u = ((t * .9 + i / 5) % 1); if (rnd(i + 40) > run) continue; coin(ctx, 960 + Math.sin(i * 2) * 40, 220 + u * 200, 22, t, i + 3); }
          ctx.fillStyle = GOLD; for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.ellipse(160 + (i % 3) * 30 - 30, SY - 10 - Math.floor(i / 3) * 16, 30, 11, 0, 0, TAU); ctx.fill(); ol(ctx, 3); }
          if (t > tStop){ const b = .5 + .5 * Math.sin(t * 10); glowAt(ctx, 560, 560, 240, RED, .35 * b); ctx.beginPath(); ctx.arc(560, 540, 30, 0, TAU); ctx.fillStyle = b > .5 ? RED : "#7A1E1E"; ctx.fill(); ol(ctx, 5); }
          ctx.restore(); }
        if (show){ const sw = Math.sin(t * 1.4) * 90; spotCone(ctx, 200, 120, sts[M.mag] ? sts[M.mag].x + sw * .3 : 560, SY, 170, .25 + .1 * Math.sin(t * 3)); spotCone(ctx, 1000, 120, M.x - sw * .4, SY, 150, .2); }
        const hop = show && t > tTap && t < tTap + .5 ? Math.sin((t - tTap) / .5 * Math.PI) * 40 : 0;
        const gone = !show && t > tGone, hk = t - tGone;
        hatPt = hatTable(ctx, M.x, SY, t, { hop: gone ? Math.max(-60, 140 * Math.sin(Math.min(hk, 1.2) * 2.6) - hk * 30) : hop, hatRot: gone ? Math.min(hk, 1.2) * 4.2 : 0 });
        if (show) marquee(ctx, 560, 520, 640, 230, t, t - tBan, {});
      },
      over1: (c2, c, sts, j) => { if (j === M.hero && sts[j]) greed(ctx, sts[j], t, t - tGreed); },
      front: (c2, c, sts) => {
        if (show && hatPt){ const k = t - tMoney; if (k > 0){ for (let i = 0; i < 26; i++){ const st0 = (i / 26) * 2.6, q = k - st0; if (q < 0 || q > 2.4) continue;
              const vx = (rnd(i) - .5) * 900, vy = -900 - rnd(i + 5) * 500, x = hatPt[0] + vx * q, y = hatPt[1] + vy * q + 900 * q * q; noteBill(ctx, x, y, q * 6 + i, 1.3, i % 4 ? "#7FBF7A" : "#E8C26B"); } }
          smokePuff(ctx, hatPt[0], hatPt[1] - 40, t - tTap, 90, "#F2E9FF"); }
        if (!show) smokePuff(ctx, sts[M.mag] ? sts[M.mag].x : 560, sts[M.mag] ? toonHead(sts[M.mag])[1] + 120 : 1000, t - tGone, 260, "#E6E0EA");
        audience(ctx, t, show ? ramp(t, tPasti, tPasti + .3) * (1 - ramp(t, tPasti + 3, tPasti + 3.5)) : 0, M.aud); },
      over: (c2, c) => {
        if (show && hatPt && t > tMoney){ const sc = c.toScreen(hatPt[0], hatPt[1] - 200), q = ramp(t, tMoney + .3, tMoney + 2.2), v = lerp(5, 7.5, eOut(q));
          popChip(ctx, "Rp" + v.toFixed(1).replace(".", ",").replace(",0", "") + " JT", clamp(sc[0], 250, 830), Math.max(330, sc[1]), t - tMoney, q >= 1 ? GREEN : ORANGE, "#FFFFFF", 54, -.05); }
        if (show && t > tPasti){ stampBox(ctx, M.stamp || "DIJAMIN PASTI!", 540, 700, t - tPasti, RED, 84, -.12); burstFx(ctx, 540, 700, t - tPasti - .05, GOLD, 14, 320); }
        if (!show && t > tRev + .6){ const a = c.toScreen(960, 330), b = c.toScreen(330, 545), k = t - tRev - .6;
          popChip(ctx, M.inLabel || "SETORAN ANGGOTA BARU", clamp(a[0], 330, 750), Math.max(300, a[1]), k, CREAM, BROWN, 32, .04);
          popChip(ctx, M.outLabel || "UNTUNG ANGGOTA LAMA", clamp(b[0], 290, 750), b[1], k - .4, GOLD, BROWN, 32, -.04); }
        if (!show && t > tMacet && t < tRev + .6) popChip(ctx, M.stopText || "PEMBAYARAN MACET", 540, 360, t - tMacet, RED, "#FFFFFF", 44, -.04);
        if (!show && t > tGone + .4) stampBox(ctx, M.goneText || "MENGHILANG!", 540, 720, t - tGone - .4, RED, 80, .1); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.show || {}; [["bannerCue", "whoosh", .2], ["tapCue", "pop", .3], ["moneyCue", "chime", .2], ["pastiCue", "pop", .1], ["greedCue", "ping", .3], ["revealCue", "whoosh", .2], ["stopCue", "ping", .3], ["macetCue", "pop", .3], ["goneCue", "whoosh", .5]]
    .forEach(([k, snd, fr]) => { if (M[k]) add(cueT(s, M[k], fr, i), snd); }); });

  /* ---- _hidung: every promise makes the promoter's nose grow longer ---- */
  function noseAt(ctx, st, L, t, o){ const h = toonHead(st), k = st.size / 92, fc = st.face || 1, r0 = 4.2 * k, x0 = h[0] + fc * 9 * k, y0 = h[1] + 4 * k + Math.sin(t * 2.3) * .4 * k;
    if (L <= 2) return null; const x1 = x0 + fc * L, dy = Math.sin(t * 3) * L * .015;
    ctx.save(); ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x0, y0 - r0); ctx.quadraticCurveTo((x0 + x1) / 2, y0 - r0 * .9 + dy, x1, y0 - r0 * .55 + dy); ctx.arc(x1, y0 + dy, r0 * .55, -Math.PI / 2, Math.PI / 2, fc < 0);
    ctx.quadraticCurveTo((x0 + x1) / 2, y0 + r0 * .9 + dy, x0, y0 + r0); ctx.closePath(); ctx.fillStyle = o.skin || "#E2A77C"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA("#FFFFFF", .45); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0 + fc * 20, y0 - r0 * .5); ctx.lineTo(x1 - fc * 30, y0 - r0 * .3 + dy); ctx.stroke();
    if (o.leaf > 0){ const q = eBack(clamp(o.leaf / .5, 0, 1)), lx = x0 + fc * L * .6, ly = y0 - r0 * .85 + dy; ctx.save(); ctx.translate(lx, ly); ctx.scale(q, q); ctx.rotate(-.4 * fc + Math.sin(t * 3) * .15);
      ctx.strokeStyle = "#3E7A3A"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -40); ctx.stroke(); ctx.beginPath(); ctx.ellipse(fc * 22, -46, 26, 13, -.5 * fc, 0, TAU); ctx.fillStyle = "#6DBE5A"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    if (o.bird > 0){ const q = clamp(o.bird / .8, 0, 1), bx = x0 + fc * L * .82, by = y0 - r0 * .6 + dy - (1 - eOut(q)) * 400, flap = q < 1 ? Math.sin(t * 30) : Math.sin(t * 3) * .2;
      ctx.save(); ctx.translate(bx + (1 - q) * fc * 300, by); ctx.scale(-fc, 1); ctx.beginPath(); ctx.ellipse(0, -30, 34, 26, 0, 0, TAU); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(-26, -52, 18, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-30, -56, 3.5, 0, TAU); ctx.fill();
      ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(-42, -52); ctx.lineTo(-58, -48); ctx.lineTo(-42, -44); ctx.fill(); ctx.beginPath(); ctx.ellipse(8, -36 - flap * 18, 26, 12, -.6 - flap * .5, 0, TAU); ctx.fillStyle = "#3B5A8E"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    ctx.restore(); return [x1, y0]; }
  TT.scene(PX + "hidung", "Cerita: janji manis, hidung makin panjang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, N = Object.assign({ on: 0, hero: 1, steps: [150, 290, 400] }, f.nose || {});
    const ps = (N.promises || []).map((p, j) => Object.assign({ T: T(s, p.cue, .2, idx) }, p));
    const tLeaf = T(s, N.leafCue, .3, idx), tBird = T(s, N.birdCue, .3, idx), tGreed = T(s, N.greedCue, .3, idx), tBtn = T(s, N.btnCue, .2, idx);
    let L = 0; ps.forEach((p, j) => { if (t >= p.T){ const prev = j ? N.steps[j - 1] : 0; L = prev + (N.steps[j] - prev) * elast(clamp((t - p.T) / .9, 0, 1)); } });
    let tip = null;
    base(ctx, s, t, { env: "street", spots: { nose: () => [540, 880, 1.15] },
      over1: (c2, c, sts, j) => { if (j === N.on && sts[j]) tip = noseAt(ctx, sts[j], L, t, { skin: N.skin, leaf: t - tLeaf, bird: t - tBird });
        if (j === N.hero && sts[j]) greed(ctx, sts[j], t, t - tGreed); },
      over: (c2, c, sts) => {
        ps.forEach((p, j) => { if (t < p.T) return; const k = t - p.T, x = [300, 760, 470][j % 3], y = [400, 500, 610][j % 3]; popChip(ctx, p.text, x, y + Math.sin(t * 2 + j) * 6, k, j === ps.length - 1 ? ORANGE : PAPER, j === ps.length - 1 ? "#FFFFFF" : BROWN, 40, (j % 2 ? .05 : -.05)); });
        if (t > tBtn && sts[N.hero]){ const h = c.toScreen(...toonHead(sts[N.hero])), q = eBack(clamp((t - tBtn) / .4, 0, 1)), b = 1 + .06 * Math.sin(t * 8);
          ctx.save(); ctx.translate(clamp(h[0] + 10, 260, 820), Math.max(720, h[1] - 330)); ctx.scale(q * b, q * b); glowAt(ctx, 0, 0, 260, GOLD, .5);
          rr(ctx, -210, -62, 420, 124, 62); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 7); textC(ctx, N.btn || "TRANSFER Rp5 JT", 0, 16, 46, "#FFFFFF", 900, 360); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const N = f.nose || {}; (N.promises || []).forEach(p => add(cueT(s, p.cue, .2, i), "whoosh"));
    if (N.birdCue) add(cueT(s, N.birdCue, .3, i) + .6, "pop"); if (N.btnCue) add(cueT(s, N.btnCue, .2, i), "ping"); if (N.greedCue) add(cueT(s, N.greedCue, .3, i), "chime"); });

  /* ---- _simpai: circus hoops LEGAL and LOGIS; the money-sack offer fails both ---- */
  function ring(ctx, cx, rx, t){ ctx.save(); ctx.beginPath(); ctx.ellipse(cx, GY + 10, rx, rx * .17, 0, 0, TAU); ctx.fillStyle = "#E9D9B8"; ctx.fill();
    ctx.lineWidth = 34; ctx.setLineDash([60, 40]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = RED; ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.stroke(); ctx.restore(); }
  function hoop(ctx, x, y, r, label, t, o){ // y = hoop centre (world)
    ctx.fillStyle = "#6B6F7A"; rr(ctx, x - 12, y + r - 10, 24, GY - y - r + 10, 6); ctx.fill(); ol(ctx, 4); rr(ctx, x - 70, GY - 20, 140, 26, 10); ctx.fill(); ol(ctx, 4);
    const lit = o.lit || 0, bad = o.bad || 0, col = bad > 0 && Math.sin(t * 18) > -.3 ? RED : (lit > 0 ? GOLD : "#C9A24B");
    if (lit > 0 || bad > 0) glowAt(ctx, x, y, r * 1.8, bad > 0 ? RED : GOLD, .35);
    ctx.save(); ctx.translate(x, y); ctx.scale(o.sx || 1, o.sy || 1); ctx.lineWidth = 30; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.ellipse(0, 0, r, r * 1.05, 0, 0, TAU); ctx.stroke();
    ctx.lineWidth = 20; ctx.setLineDash([26, 18]); ctx.lineDashOffset = -t * 60 * (lit > 0 ? 1 : .2); ctx.strokeStyle = col; ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    const q = eBack(clamp((o.labK ?? 9) / .4, 0, 1)); ctx.save(); ctx.translate(x, y - r - 76); ctx.scale(q, q); ctx.rotate(Math.sin(t * 2 + x) * .04); chip(ctx, label, 0, 0, lit > 0 ? ORANGE : NAVY, "#FFFFFF", 50); ctx.restore(); }
  function sack(ctx, x, y, s, t, o){ // y = ground under the sack
    o = o || {}; const sq = o.sq || 0, k = s; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(k * (1 + sq), k * (1 - sq));
    const walk = o.walk ? Math.sin(t * 16) : 0; ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-28, -20); ctx.lineTo(-34 + walk * 10, 0); ctx.moveTo(28, -20); ctx.lineTo(34 - walk * 10, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-40, -210); ctx.quadraticCurveTo(-120, -150, -104, -70); ctx.quadraticCurveTo(-96, -10, 0, -14); ctx.quadraticCurveTo(96, -10, 104, -70); ctx.quadraticCurveTo(120, -150, 40, -210); ctx.closePath();
    ctx.fillStyle = o.flat ? "#B8A06A" : "#E8C26B"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(-40, -210); ctx.lineTo(-60, -250); ctx.lineTo(-16, -232); ctx.lineTo(0, -262); ctx.lineTo(16, -232); ctx.lineTo(60, -250); ctx.lineTo(40, -210); ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-44, -208); ctx.lineTo(44, -208); ctx.stroke();
    // face
    ctx.fillStyle = OUT; const e = o.dizzy ? 0 : 1; if (e){ ctx.beginPath(); ctx.ellipse(-30, -118, 9, 12, 0, 0, TAU); ctx.ellipse(30, -118, 9, 12, 0, 0, TAU); ctx.fill(); }
    else { ctx.lineWidth = 5; ctx.strokeStyle = OUT; [-30, 30].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx - 9, -127); ctx.lineTo(dx + 9, -109); ctx.moveTo(dx + 9, -127); ctx.lineTo(dx - 9, -109); ctx.stroke(); }); }
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); if (o.sad) ctx.arc(0, -64, 22, 1.15 * Math.PI, 1.85 * Math.PI); else ctx.arc(0, -96, 26, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-50, -150); ctx.lineTo(-14, -140); ctx.moveTo(50, -150); ctx.lineTo(14, -140); ctx.stroke();
    // tag
    ctx.save(); ctx.translate(76, -196); ctx.rotate(.3 + Math.sin(t * 4) * .15); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -6); ctx.lineTo(0, 0); ctx.stroke();
    rr(ctx, 0, -10, 130 * (o.tagS || 1), 56 * (o.tagS || 1), 8); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, o.tag || "50%/BLN", 65 * (o.tagS || 1), 30 * (o.tagS || 1), 26 * (o.tagS || 1), "#FFFFFF", 900, 116 * (o.tagS || 1)); ctx.restore();
    ctx.restore(); }
  TT.scene(PX + "simpai", "Cerita: simpai sirkus LEGAL & LOGIS, kantong janji gagal lolos", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, H = Object.assign({ x1: 500, x2: 800, y: 1080, r: 130, x0: 320 }, f.hoops || {});
    const t1 = T(s, H.legalCue, .2, idx), t2 = T(s, H.logisCue, .2, idx), tFail1 = T(s, H.fail1Cue, .5, idx), tPop = T(s, H.popCue, .5, idx);
    // sack path
    let sx = H.x0, sy = GY, sq = 0, rot = 0, flat = false, dizzy = false, sad = false, scale = .95, tagS = 1, walk = false;
    const jumpTo = (a, b, k, d, h) => { const q = clamp(k / d, 0, 1); return [lerp(a[0], b[0], q), lerp(a[1], b[1], q) - h * 4 * q * (1 - q)]; };
    if (t >= t1){ const k = t - t1 - .4; if (k > 0 && k < 1.2){ const p = jumpTo([H.x0, GY], [H.x1 - 40, H.y + 60], k, 1.2, 160); sx = p[0]; sy = p[1]; rot = .2 * Math.sin(k * 6); }
      else if (k >= 1.2){ const k2 = k - 1.2; if (k2 < .9){ const p = jumpTo([H.x1 - 40, H.y + 60], [H.x0 + 30, GY], k2, .9, 120); sx = p[0]; sy = p[1]; rot = -k2 * 5; sq = k2 < .1 ? .3 : 0; }
        else { sx = H.x0 + 30; sy = GY; dizzy = t < t2; sq = Math.exp(-(k2 - .9) * 6) * .25 * Math.sin((k2 - .9) * 20); } } }
    if (t >= t2){ const k = t - t2; dizzy = false; tagS = 1 + .3 * eOut(ramp(t, t2 + .2, t2 + 1.4)); scale = .95 + .45 * eOut(ramp(t, t2 + .2, t2 + 1.4)); walk = k < 1.2;
      if (k < 1.2){ sx = lerp(H.x0 + 30, H.x2 - 250, eOut(k / 1.2)); sy = GY; }
      else if (t < tPop){ const k2 = k - 1.2, p = jumpTo([H.x2 - 250, GY], [H.x2 - 60, H.y + 150], k2, .8, 140); sx = p[0]; sy = p[1]; if (k2 > .8){ sq = .22 + .05 * Math.sin(t * 16); rot = Math.sin(t * 9) * .05; } }
      else { const k3 = t - tPop; scale = lerp(1.4, .8, eOut(clamp(k3 / .5, 0, 1))); tagS = lerp(1.3, 1, clamp(k3 / .5, 0, 1)); const p = jumpTo([H.x2 - 60, H.y + 150], [H.x2 - 330, GY], k3, 1, 220); sx = p[0]; sy = p[1]; rot = -k3 * 9 * (k3 < 1 ? 1 : 0); flat = k3 > 1; sad = true; } }
    const stuck = t >= t2 + 2 && t < tPop;
    base(ctx, s, t, { env: "info", envOpt: { spotX: 620 }, spots: { h1: [H.x1, H.y + 40, 1.2], h2: [H.x2, H.y + 40, 1.2] },
      back: () => { ring(ctx, 580, 560, t); hoop(ctx, H.x1, H.y, H.r, H.l1 || "LEGAL", t, { lit: t > t1 && t < t2 ? 1 : 0, bad: t > t1 + 1.4 && t < t1 + 2.6 ? 1 : 0, labK: t - t1 + .6 }); },
      mid: () => { hoop(ctx, H.x2, H.y, H.r * .78, H.l2 || "LOGIS", t, { lit: t > t2 ? 1 : 0, bad: stuck ? 1 : 0, labK: t - t2 + .6, sx: stuck ? 1.08 + .03 * Math.sin(t * 20) : 1, sy: stuck ? .95 : 1 });
        sack(ctx, sx, sy, scale, t, { sq, rot, flat, dizzy, sad, tagS, walk, tag: H.tag });
        if (dizzy) for (let i = 0; i < 3; i++){ const a = t * 5 + i * TAU / 3; sparkle(ctx, sx + Math.cos(a) * 80, sy - 280 + Math.sin(a) * 20, 14, GOLD); } }, midZ: .5,
      over: (c2, c) => { if (t > t1 + 1.4 && t < t2){ const p = c.toScreen(H.x1, H.y); popChip(ctx, H.bad1 || "IZIN OJK? TIDAK ADA", p[0], p[1] - 300 * c.zoom, t - t1 - 1.4, RED, "#FFFFFF", 36, -.05); }
        if (stuck){ const p = c.toScreen(H.x2, H.y); popChip(ctx, H.bad2 || "TERLALU MUSTAHIL", p[0] - 40, p[1] - 300 * c.zoom, t - t2 - 2, RED, "#FFFFFF", 36, .05); }
        if (t > tPop){ const p = c.toScreen(H.x2 - 30, H.y + 100); burstFx(ctx, p[0], p[1], t - tPop, RED, 12, 220); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const H = f.hoops || {}; if (H.legalCue){ const a = cueT(s, H.legalCue, .2, i); add(a + .4, "whoosh"); add(a + 1.6, "ping"); }
    if (H.logisCue){ const a = cueT(s, H.logisCue, .2, i); add(a + 1.2, "whoosh"); add(a + 2, "pop"); } if (H.popCue) add(cueT(s, H.popCue, .5, i), "pop"); });

  /* ================= MS34 ================= */
  /* laptop-dog "URUSAN KANTOR": open laptop with a face on the screen, keyboard body, 4 legs, cable tail */
  function laptopDog(ctx, x, y, sc, t, o){
    o = o || {}; const fc = o.face || 1, walk = o.walk ? Math.sin(t * 18) : 0, bark = o.bark ?? -9, bk = bark >= 0 && bark < .5 ? Math.sin(bark / .5 * Math.PI) : 0, sl = clamp(o.sleep || 0, 0, 1);
    const bob = o.walk ? Math.abs(Math.sin(t * 18)) * 8 : Math.sin(t * 3) * 2;
    ctx.save(); ctx.translate(x, y - (o.lift || 0)); ctx.scale(sc, sc);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 130, 16, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.scale(fc, 1);
    ctx.strokeStyle = "#3B3A3F"; ctx.lineWidth = 16; ctx.lineCap = "round";
    [[-80, 1], [-44, -1], [44, 1], [80, -1]].forEach(([lx, ph]) => { ctx.beginPath(); ctx.moveTo(lx, -46 - bob); ctx.lineTo(lx + walk * 16 * ph, -4); ctx.stroke(); });
    ctx.translate(0, -bob);
    // tail cable
    const wag = Math.sin(t * (o.walk || bk ? 16 : 6)) * (sl > .5 ? 4 : 22); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-118, -70); ctx.bezierCurveTo(-170, -70, -150, -150, -190 + wag * .4, -170 + wag); ctx.stroke();
    ctx.save(); ctx.translate(-190 + wag * .4, -170 + wag); ctx.rotate(-.6); rr(ctx, -14, -26, 28, 36, 6); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-8, -40, 5, 16); ctx.fillRect(3, -40, 5, 16); ctx.restore();
    // body (keyboard)
    rr(ctx, -124, -96, 248, 58, 14); ctx.fillStyle = "#AEB8C2"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#5E6470"; for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++){ const lift = (o.walk || bk) && Math.sin(t * 25 + i * 1.7 + r) > .7 ? 3 : 0; ctx.fillRect(-104 + i * 23, -86 + r * 20 - lift, 17, 12); }
    // lid / head
    const lidH = 210 * (1 - .86 * eOut(sl)), tilt = (bk * -.08) + Math.sin(t * 2.2) * .02;
    ctx.save(); ctx.translate(0, -96); ctx.rotate(tilt);
    [[-1], [1]].forEach(([d]) => { const flap = Math.sin(t * 5 + d) * .15 + bk * .5 * d; ctx.save(); ctx.translate(d * 84, -lidH + 6); ctx.rotate(d * (.5 + flap)); ctx.beginPath(); ctx.ellipse(d * 10, 24, 26, 46, 0, 0, TAU); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 5); ctx.restore(); });
    rr(ctx, -112, -lidH, 224, lidH, 18); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6);
    if (lidH > 60){ const sy0 = -lidH + 14, sh = lidH - 28; rr(ctx, -98, sy0, 196, sh, 10); const g = ctx.createLinearGradient(0, sy0, 0, sy0 + sh); g.addColorStop(0, o.angry ? "#F7C6C0" : "#D6F0F6"); g.addColorStop(1, o.angry ? "#E89A90" : "#A9D9E6"); ctx.fillStyle = g; ctx.fill();
      const ey = sy0 + sh * .38, lk = o.look || 0;
      if (sl > .4){ ctx.strokeStyle = OUT; ctx.lineWidth = 7; [-42, 42].forEach(ex => { ctx.beginPath(); ctx.arc(ex, ey, 18, .1 * Math.PI, .9 * Math.PI); ctx.stroke(); }); }
      else { const bl = Math.abs(Math.sin(t * .9)) > .985 ? .1 : 1; [-42, 42].forEach(ex => { ctx.beginPath(); ctx.ellipse(ex, ey, 24, 28 * bl * (1 + bk * .2), 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
          ctx.beginPath(); ctx.arc(ex + 8 + lk * 6, ey + 4, 12 * bl, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.arc(ex + 11, ey - 2, 4 * bl, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); }); }
      const my = sy0 + sh * .74; ctx.fillStyle = OUT; ctx.beginPath();
      if (bk > .05){ ctx.ellipse(10, my, 26, 10 + 26 * bk, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(10, my + 12 * bk, 14, 8 * bk, 0, 0, TAU); ctx.fillStyle = "#E26D6D"; ctx.fill(); }
      else if (sl > .4){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(10, my - 10, 14, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); }
      else { ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(10, my - 18, 22, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); } }
    ctx.restore();
    // collar
    ctx.fillStyle = RED; rr(ctx, -116, -104, 232, 16, 8); ctx.fill(); ol(ctx, 4);
    ctx.restore(); // un-flip for texts
    ctx.translate(0, -bob);
    ctx.save(); ctx.translate(fc * 40, -88); ctx.rotate(Math.sin(t * 4) * .2); ctx.beginPath(); ctx.arc(0, 18, 26, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, o.tag || "KANTOR", 0, 25, 13, BROWN, 900, 46); ctx.restore();
    const n = o.badge || 0; if (n > 0 && sl < .5){ const lidH2 = 210, bq = 1 + .25 * bk; ctx.save(); ctx.translate(fc * 104, -96 - lidH2 + 4); ctx.scale(bq, bq); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, n > 99 ? "99+" : String(n), 0, 13, 34, "#FFFFFF", 900, 56); ctx.restore(); }
    if (sl > .6) for (let k = 0; k < 3; k++){ const q = ((t * .45) + k / 3) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(q * Math.PI); textC(ctx, "Z", fc * (60 + q * 60 + k * 10), -150 - q * 140, 40 + k * 10, CREAM, 900); ctx.restore(); }
    ctx.restore(); }
  function envIcon(ctx, x, y, s, kind){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -34, -26, 68, 52, 10); ctx.fillStyle = kind ? "#FFFFFF" : PAPER; ctx.fill(); ol(ctx, 4);
    if (kind){ ctx.fillStyle = TEAL; rr(ctx, -22, -12, 44, 8, 4); ctx.fill(); rr(ctx, -22, 4, 30, 8, 4); ctx.fill(); }
    else { ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-34, -24); ctx.lineTo(0, 4); ctx.lineTo(34, -24); ctx.stroke(); } ctx.restore(); }
  function houseFront(ctx, x, t){ // world, door centred at x
    ctx.fillStyle = "#E8C9A0"; ctx.fillRect(x - 260, 860, 760, GY - 860); ol(ctx, 6); ctx.fillStyle = "#A9643B"; ctx.beginPath(); ctx.moveTo(x - 320, 880); ctx.lineTo(x + 120, 640); ctx.lineTo(x + 560, 880); ctx.closePath(); ctx.fill(); ol(ctx, 6);
    rr(ctx, x - 90, 1250, 180, 390, 12); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(x + 55, 1450, 11, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
    glowAt(ctx, x + 170, 1220, 160, "#FFE08A", .5 + .1 * Math.sin(t * 3)); ctx.beginPath(); ctx.arc(x + 170, 1220, 22, 0, TAU); ctx.fillStyle = "#FFE9A0"; ctx.fill(); ol(ctx, 4);
    rr(ctx, x + 230, 1040, 200, 170, 10); ctx.fillStyle = "#FFE6A8"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = OUT; ctx.fillRect(x + 326, 1040, 8, 170); ctx.fillRect(x + 230, 1122, 200, 8);
    rr(ctx, x - 110, GY - 18, 220, 26, 8); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 4); textC(ctx, "RUMAH", x, GY + 2, 22, "#FFFFFF", 900); }
  function diningTable(ctx, x, w, t, o){ o = o || {}; const top = GY - 300;
    ctx.fillStyle = "#7A4A2E"; rr(ctx, x - w / 2 + 30, top + 20, 26, 280, 6); ctx.fill(); ol(ctx, 4); rr(ctx, x + w / 2 - 56, top + 20, 26, 280, 6); ctx.fill(); ol(ctx, 4);
    rr(ctx, x - w / 2, top - 10, w, 40, 10); ctx.fillStyle = o.meeting ? "#B9C2CC" : "#C47A48"; ctx.fill(); ol(ctx, 6);
    if (!o.meeting){ ctx.fillStyle = "#F4EFE6"; ctx.beginPath(); ctx.moveTo(x - w / 2 + 20, top + 30); for (let i = 0; i <= 10; i++) ctx.lineTo(x - w / 2 + 20 + (w - 40) * i / 10, top + 60 + (i % 2) * 14); ctx.lineTo(x + w / 2 - 20, top + 30); ctx.fill(); }
    return top - 10; }
  function dishes(ctx, x, top, t){ [[-200, "#FFFFFF"], [180, "#FFFFFF"]].forEach(([dx, c]) => { ctx.beginPath(); ctx.ellipse(x + dx, top - 6, 70, 16, 0, 0, TAU); ctx.fillStyle = c; ctx.fill(); ol(ctx, 4); });
    ctx.beginPath(); ctx.ellipse(x - 200, top - 18, 40, 22, 0, Math.PI, 0); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(x + 180, top - 16, 50, 16, 0, 0, TAU); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 4);
    for (let i = 0; i < 3; i++){ const q = (t * .5 + i / 3) % 1; ctx.save(); ctx.globalAlpha *= .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 200 + (i - 1) * 18, top - 40 - q * 60); ctx.quadraticCurveTo(x - 190 + (i - 1) * 18, top - 60 - q * 60, x - 200 + (i - 1) * 18, top - 80 - q * 60); ctx.stroke(); ctx.restore(); } }
  function hangLamp(ctx, x, y, t, cold){ const sw = Math.sin(t * 1.4) * .06; ctx.save(); ctx.translate(x, 0); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, y); ctx.stroke();
    if (cold){ const fl = Math.sin(t * 37) > .85 ? .3 : 1; glowAt(ctx, 0, y + 20, 360, "#DDF2FF", .35 * fl); rr(ctx, -170, y, 340, 30, 12); ctx.fillStyle = "#F2FAFF"; ctx.fill(); ol(ctx, 4); }
    else { glowAt(ctx, 0, y + 60, 360, "#FFD27A", .45); ctx.beginPath(); ctx.moveTo(-90, y + 70); ctx.lineTo(-40, y); ctx.lineTo(40, y); ctx.lineTo(90, y + 70); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); }
    ctx.restore(); }

  TT.scene(PX + "anjing", "Cerita: urusan kantor = anjing-laptop yang membuntuti (jalan / rumah / dititip)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Dg = Object.assign({ mode: "jalan", s: 1, dx: 280, lag: .55, y: GY, badge0: 1 }, f.dog || {}), toons = f.toons || [];
    const barks = (Dg.barks || []).map((b, j) => Object.assign({ T: T(s, b.cue, .3 + j * .05, idx) }, b)), lastB = barks.filter(b => t >= b.T).pop();
    const tJump = T(s, Dg.jumpCue, .3, idx), tRun = T(s, Dg.runCue, .3, idx), tSleep = T(s, Dg.sleepCue, .4, idx), tNote = T(s, Dg.noteCue, .3, idx), tTag = T(s, Dg.tagCue, .3, idx);
    let x = Dg.x ?? 300, y = Dg.y, face = Dg.face || 1, walk = false, lift = 0, alpha = 1;
    if (Dg.follow != null && toons[Dg.follow]){ const a = toons[Dg.follow], s1 = toonState(a, s, t - Dg.lag), s0 = toonState(a, s, t - Dg.lag - .1); const sd = Dg.side ?? -(s1.face || 1); x = s1.x + sd * Dg.dx; face = Math.abs(s1.x - s0.x) > 2 ? Math.sign(s1.x - s0.x) : (Dg.face || -sd); walk = Math.abs(s1.x - s0.x) > 2; }
    if (t >= tJump && Dg.jumpTo){ const k = clamp((t - tJump) / .7, 0, 1), from = [Dg.x ?? x, Dg.y]; x = lerp(from[0], Dg.jumpTo[0], k); y = lerp(from[1], Dg.jumpTo[1], eOut(k)); lift = 260 * 4 * k * (1 - k); walk = k < 1; }
    if (t >= tRun && Dg.runTo != null){ const k = clamp((t - tRun) / 1.0, 0, 1); x = lerp(x, Dg.runTo, easeIO(k)); walk = k < 1; face = Math.sign(Dg.runTo - x) || face; alpha = 1 - ramp(t, tRun + .8, tRun + 1.2); }
    const badge = Dg.badge0 + barks.filter(b => t >= b.T).reduce((a, b) => a + (b.add || 3), 0), bark = lastB ? t - lastB.T : -9;
    const sleep = ramp(t, tSleep, tSleep + 1.4);
    let dogTop = null;
    const drawDog = () => { if (alpha <= 0) return; ctx.save(); ctx.globalAlpha *= alpha; laptopDog(ctx, x, y, Dg.s, t, { face, walk, bark, sleep, lift, badge, tag: Dg.tag }); ctx.restore();
      dogTop = [x, y - lift - 330 * Dg.s];
      barks.forEach((b, j) => { const k = t - b.T; if (k < 0 || k > 1.6) return; for (let i = 0; i < 3; i++){ const q = clamp((k - i * .12) / 1.2, 0, 1); if (q <= 0 || q >= 1) continue;
          ctx.save(); ctx.globalAlpha *= 1 - q; envIcon(ctx, x + (i - 1) * 120 * q + face * 40, y - lift - 300 * Dg.s - q * 260, .9 + q * .4, (i + j) % 2); ctx.restore(); } }); };
    const M = Dg.mode;
    const H = { env: M === "jalan" ? "street" : M === "rumah" ? "home" : "office", envOpt: M === "jalan" ? { time: "dusk" } : M === "rumah" ? { time: "night", lampX: 1400 } : { time: "night", desk: false, plantX: 1000 },
      spots: { dog: () => [x, y - lift - 160 * Dg.s, 1.2] } };
    if (M === "jalan"){ H.back = () => { if (Dg.door != null) houseFront(ctx, Dg.door, t); }; H.mid = drawDog; H.midZ = -.5; }
    if (M === "rumah"){ H.back = () => hangLamp(ctx, Dg.tableX ?? 500, 720, t, false);
      H.front = () => { const top = diningTable(ctx, Dg.tableX ?? 500, Dg.tableW ?? 700, t); dishes(ctx, Dg.tableX ?? 500, top, t); drawDog(); }; }
    if (M === "titip"){ const dkX = Dg.deskX ?? 720;
      H.back = () => { ctx.fillStyle = "#C9D3DC"; rr(ctx, dkX - 380, 760, 760, 560, 16); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#B4C0CB"; rr(ctx, dkX - 360, 780, 720, 520, 12); ctx.fill();
        if (t > tNote){ const q = eBack(clamp((t - tNote) / .4, 0, 1)); ctx.save(); ctx.translate(dkX - 150, 820); ctx.scale(q, q); ctx.rotate(-.05 + Math.sin(t * 2) * .02);
          rr(ctx, -150, 0, 300, 300, 8); ctx.fillStyle = "#F6D36B"; ctx.fill(); ol(ctx, 6); textC(ctx, Dg.noteTitle || "BESOK", 0, 56, 44, BROWN, 900, 260);
          (Dg.noteItems || ["Revisi laporan", "Telepon klien", "Rapat 10.00"]).forEach((it, i) => { const k2 = t - tNote - .5 - i * .45; if (k2 < 0) return; textL(ctx, (i + 1) + ". " + it.slice(0, Math.floor(k2 * 30)), -126, 112 + i * 62, 30, BROWN, 800, 260); });
          ctx.restore(); }
        if (t > tTag){ const q = eBack(clamp((t - tTag) / .45, 0, 1)); ctx.save(); ctx.translate(dkX + 190, 830); ctx.rotate(Math.sin(t * 2.6) * .08); ctx.scale(q, q); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(0, 0); ctx.stroke();
          rr(ctx, -150, 0, 300, 140, 16); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, Dg.tagTop || "SAMPAI BESOK", 0, 56, 38, "#FFFFFF", 900, 270); textC(ctx, Dg.tagTime || "08.00", 0, 112, 46, GOLD, 900, 260); ctx.restore(); } };
      H.front = () => { ctx.fillStyle = "#8E4E2E"; rr(ctx, dkX - 330, GY - 300, 26, 300, 6); ctx.fill(); ol(ctx, 4); rr(ctx, dkX + 304, GY - 300, 26, 300, 6); ctx.fill(); ol(ctx, 4);
        rr(ctx, dkX - 360, GY - 320, 720, 36, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.ellipse(x, GY - 300, 170, 30, 0, 0, TAU); ctx.fillStyle = "#7A4A6B"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(x, GY - 312, 140, 18, 0, 0, TAU); ctx.fillStyle = "#B57AA0"; ctx.fill();
        drawDog();
        if (sleep > 0){ ctx.save(); ctx.globalAlpha *= sleep; ctx.beginPath(); ctx.moveTo(x - 150, GY - 330); ctx.quadraticCurveTo(x, GY - 330 - 120 * Dg.s * (1 - sleep * .4), x + 150, GY - 330); ctx.lineTo(x + 140, GY - 300); ctx.lineTo(x - 140, GY - 300); ctx.closePath(); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 5); ctx.restore(); } }; }
    H.over = (c2, c) => { if (!dogTop || alpha <= .2) return; barks.forEach((b) => { const k = t - b.T; if (k < 0 || k > 1.2) return; const p = c.toScreen(dogTop[0], dogTop[1]);
        popWord(ctx, b.text || "TING!", clamp(p[0] + face * 60, 200, 880), Math.max(380, p[1] - 40), k, { size: 84, hold: 1.1, rot: face * -8 }); }); };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Dg = f.dog || {}; (Dg.barks || []).forEach((b, j) => add(cueT(s, b.cue, .3 + j * .05, i), "ping"));
    if (Dg.jumpCue) add(cueT(s, Dg.jumpCue, .3, i), "whoosh"); if (Dg.runCue) add(cueT(s, Dg.runCue, .3, i), "whoosh"); if (Dg.noteCue) add(cueT(s, Dg.noteCue, .3, i), "pop");
    if (Dg.tagCue) add(cueT(s, Dg.tagCue, .3, i), "chime"); if (Dg.sleepCue) add(cueT(s, Dg.sleepCue, .4, i), "pop"); });

  /* ---- _ubah: the living room morphs into an office, piece by piece ---- */
  function morphDraw(ctx, t, T0, x, y, A, B){ const k = t - T0;
    if (k < 0){ A(); return; } const q = clamp(k / .7, 0, 1);
    if (q < .45){ const a = 1 - q / .45; ctx.save(); ctx.translate(x, y); ctx.rotate((1 - a) * .6); ctx.scale(a, a); ctx.translate(-x, -y); A(); ctx.restore(); }
    else { const b = elast((q - .45) / .55); ctx.save(); ctx.translate(x, y); ctx.scale(b, b); ctx.translate(-x, -y); B(); ctx.restore(); }
    smokePuff(ctx, x, y, k - .2, 130, "#FFFFFF"); }
  function familyFrame(ctx, x, y){ rr(ctx, x - 130, y - 100, 260, 200, 10); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#FBE3C4"; ctx.fillRect(x - 108, y - 78, 216, 156);
    [[-50, TEAL, 1], [0, MAROON, .95], [46, "#E26D8E", .7]].forEach(([dx, c, sc]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x + dx, y + 78, 26 * sc, 44 * sc, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(x + dx, y + 20 - 30 * (1 - sc), 20 * sc, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); });
    ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(x + 84, y - 50); ctx.bezierCurveTo(x + 70, y - 64, x + 66, y - 40, x + 84, y - 30); ctx.bezierCurveTo(x + 102, y - 40, x + 98, y - 64, x + 84, y - 50); ctx.fill(); }
  function whiteboard(ctx, x, y, t){ rr(ctx, x - 190, y - 130, 380, 260, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
    [.4, .7, .55, .9].forEach((v, i) => { ctx.fillStyle = i === 3 ? RED : TEAL; rr(ctx, x - 150 + i * 62, y + 90 - 150 * v, 40, 150 * v, 4); ctx.fill(); });
    textC(ctx, "TARGET!", x + 100, y - 80, 34, RED, 900); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 170, y - 50); ctx.lineTo(x + 170, y - 50); ctx.stroke(); }
  function nightWindow(ctx, x, y, t){ rr(ctx, x - 160, y - 140, 320, 280, 12); ctx.fillStyle = "#24345A"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#FFF4C9"; ctx.beginPath(); ctx.arc(x + 60, y - 60, 36, 0, TAU); ctx.fill();
    for (let i = 0; i < 6; i++) sparkle(ctx, x - 120 + rnd(i) * 220, y - 110 + rnd(i + 4) * 200, 6 + 3 * Math.sin(t * 3 + i), CREAM);
    ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.moveTo(x - 170, y - 150); ctx.quadraticCurveTo(x - 100, y, x - 150, y + 150); ctx.lineTo(x - 170, y + 150); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 170, y - 150); ctx.quadraticCurveTo(x + 100, y, x + 150, y + 150); ctx.lineTo(x + 170, y + 150); ctx.fill(); }
  function bigMonitor(ctx, x, y, t){ rr(ctx, x - 200, y - 140, 400, 280, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#EAF6FA"; ctx.fillRect(x - 180, y - 120, 360, 240);
    ctx.fillStyle = TEAL; ctx.fillRect(x - 180, y - 120, 360, 40); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++){ ctx.fillStyle = (r + c + Math.floor(t * 3)) % 5 === 0 ? "#F6D36B" : "#C9DCE3"; ctx.fillRect(x - 170 + c * 88, y - 70 + r * 46, 80, 36); }
    ctx.beginPath(); ctx.arc(x + 180, y - 130, 40 + 4 * Math.sin(t * 8), 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "99+", x + 180, y - 118, 32, "#FFFFFF", 900); }
  function officeChair(ctx, x, t){ ctx.fillStyle = "#3B4A6B"; rr(ctx, x - 150, GY - 560, 300, 330, 40); ctx.fill(); ol(ctx, 6); rr(ctx, x - 190, GY - 260, 380, 70, 26); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#2C2433"; rr(ctx, x - 14, GY - 200, 28, 150, 6); ctx.fill(); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x - 160, GY - 40); ctx.lineTo(x + 160, GY - 40); ctx.stroke();
    [-150, 0, 150].forEach(d => { ctx.beginPath(); ctx.arc(x + d, GY - 18, 18, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); }); }
  function meetingTable(ctx, x, t){ const top = diningTable(ctx, x, 560, t, { meeting: true });
    [[-170, "AGENDA"], [40, "NOTULEN"]].forEach(([dx, l], i) => { ctx.save(); ctx.translate(x + dx, top - 8); ctx.rotate(-.06 + i * .1); rr(ctx, -70, -14, 140, 18, 4); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); ctx.restore(); });
    rr(ctx, x + 120, top - 70, 120, 66, 8); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#BFE2EA"; ctx.fillRect(x + 130, top - 62, 100, 46);
    ctx.save(); ctx.translate(x - 120, top - 30); ctx.beginPath(); ctx.moveTo(-80, 30); ctx.lineTo(0, -40); ctx.lineTo(80, 30); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.restore();
    textC(ctx, "RAPAT", x - 120, top - 18, 28, RED, 900, 120); }
  TT.scene(PX + "ubah", "Cerita: ruang keluarga berubah jadi kantor", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, U = Object.assign({ frameX: 300, winX: 790, sofaX: 760, tableX: 280 }, f.morph || {});
    const tTint = T(s, U.tintCue, .3, idx), tFrame = T(s, U.frameCue, .3, idx), tSofa = T(s, U.sofaCue, .3, idx), tTable = T(s, U.tableCue, .3, idx), tWin = T(s, U.winCue, .3, idx), tNeon = T(s, U.neonCue, .3, idx);
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 1500 },
      spots: { sofa: [U.sofaX, 1200, 1.1], neon: [540, 700, 1.05] },
      back: () => { const tq = ramp(t, tTint, tTint + 1.5); if (tq > 0){ ctx.fillStyle = hexA("#8FA2B8", .55 * tq); ctx.fillRect(-500, -200, 2100, GY + 200); ctx.strokeStyle = hexA("#FFFFFF", .25 * tq); ctx.lineWidth = 3; for (let i = 0; i < 14; i++){ ctx.beginPath(); ctx.moveTo(-500 + i * 160, -200); ctx.lineTo(-500 + i * 160, GY); ctx.stroke(); } }
        morphDraw(ctx, t, tTint, 540, 0, () => hangLamp(ctx, 540, 520, t, false), () => hangLamp(ctx, 540, 520, t, true));
        morphDraw(ctx, t, tFrame, U.frameX, 760, () => familyFrame(ctx, U.frameX, 760), () => whiteboard(ctx, U.frameX, 760, t));
        morphDraw(ctx, t, tWin, U.winX, 720, () => nightWindow(ctx, U.winX, 720, t), () => bigMonitor(ctx, U.winX, 720, t));
        morphDraw(ctx, t, tSofa, U.sofaX, GY - 200, () => prop(ctx, "sofa", U.sofaX, GY, { color: "#8E4E2E", s: 1.2 }, t), () => officeChair(ctx, U.sofaX, t));
        if (t > tNeon){ const k = t - tNeon, fl = k < .8 ? (Math.sin(k * 60) > 0 ? 1 : .2) : (Math.sin(t * 23) > .95 ? .5 : 1); ctx.save(); ctx.translate(540, 420); ctx.scale(eBack(clamp(k / .4, 0, 1)), eBack(clamp(k / .4, 0, 1)));
          glowAt(ctx, 0, 0, 340, "#FF5B5B", .35 * fl); rr(ctx, -250, -60, 500, 120, 30); ctx.fillStyle = "#2C1A22"; ctx.fill(); ctx.strokeStyle = hexA("#FF6B6B", fl); ctx.lineWidth = 10; ctx.stroke(); textC(ctx, U.neon || "KANTOR 24 JAM", 0, 22, 60, hexA("#FFB3B3", fl), 900, 450); ctx.restore(); } },
      front: () => { morphDraw(ctx, t, tTable, U.tableX, GY - 200, () => { const top = diningTable(ctx, U.tableX, 440, t); dishes(ctx, U.tableX, top, t); }, () => meetingTable(ctx, U.tableX, t)); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const U = f.morph || {}; ["tintCue", "frameCue", "sofaCue", "tableCue", "winCue"].forEach(k => { if (U[k]) add(cueT(s, U[k], .3, i) + .3, "pop"); }); if (U.neonCue) add(cueT(s, U.neonCue, .3, i), "ping"); });

  /* ================= SB35 ================= */
  function samplePath(pts, d){ for (let i = 1; i < pts.length; i++){ const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= L || i === pts.length - 1){ const q = L ? clamp(d / L, 0, 1) : 0; return [lerp(a[0], b[0], q), lerp(a[1], b[1], q), (b[0] - a[0]) / (L || 1), (b[1] - a[1]) / (L || 1)]; } d -= L; } return [pts[0][0], pts[0][1], 0, 1]; }
  function scarf(ctx, pts, len, w, cols, t, o){ o = o || {}; if (len < 4) return; const step = 8, L = [], R = [];
    for (let d = 0; d <= len; d += step){ const p = samplePath(pts, d), j = o.rough ? (rnd(Math.floor(d / 22)) - .5) * w * .28 : 0, ww = w / 2 + j, wav = Math.sin(d * .02 + t * 2) * (o.wave || 4);
      L.push([p[0] - p[3] * ww + p[2] * 0 + p[3] * 0, p[1] + p[2] * ww]); R.push([p[0] + p[3] * ww, p[1] - p[2] * ww]); L[L.length - 1][0] += wav * p[3]; R[R.length - 1][0] += wav * p[3]; }
    ctx.save(); ctx.beginPath(); L.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]); ctx.closePath();
    ctx.fillStyle = cols[0]; ctx.fill(); ctx.save(); ctx.clip();
    for (let i = 0; i < L.length; i++){ const band = Math.floor(i * step / 30); if (band % 2){ ctx.strokeStyle = cols[1]; ctx.lineWidth = step + 1; ctx.beginPath(); ctx.moveTo(L[i][0], L[i][1]); ctx.lineTo(R[i][0], R[i][1]); ctx.stroke(); } }
    ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 2; for (let i = 0; i < L.length; i += 2){ const m = [(L[i][0] + R[i][0]) / 2, (L[i][1] + R[i][1]) / 2]; ctx.beginPath(); ctx.moveTo(L[i][0], L[i][1]); ctx.lineTo(m[0], m[1] + 4); ctx.lineTo(R[i][0], R[i][1]); ctx.stroke(); }
    ctx.restore(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.stroke();
    if (o.fringe){ const e = L.length - 1; for (let k = 0; k <= 5; k++){ const x = lerp(L[e][0], R[e][0], k / 5), y = lerp(L[e][1], R[e][1], k / 5), p = samplePath(pts, len); ctx.strokeStyle = cols[1]; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + p[2] * 26 + Math.sin(t * 4 + k) * 4, y + p[3] * 26); ctx.stroke(); } }
    ctx.restore(); }
  function needles(ctx, x, y, t, act){ const a = act ? Math.sin(t * 14) * .25 : Math.sin(t * 2) * .05; ctx.save(); ctx.translate(x, y); ctx.lineCap = "round";
    [[-.5 + a, "#C9A47A"], [.5 - a, "#B5793D"]].forEach(([r, c]) => { ctx.save(); ctx.rotate(r - Math.PI / 2); ctx.strokeStyle = OUT; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(90, 0); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 7; ctx.stroke();
      ctx.beginPath(); ctx.arc(-92, 0, 11, 0, TAU); ctx.fillStyle = c; ctx.fill(); ol(ctx, 3); ctx.restore(); }); ctx.restore(); }
  function yarnBall(ctx, x, y, r, rot, col){ ctx.save(); ctx.translate(x, y - r); ctx.rotate(rot); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 4; for (let i = -2; i <= 2; i++){ ctx.beginPath(); ctx.ellipse(0, 0, r * .9, r * .35, i * .6, 0, TAU); ctx.stroke(); } ctx.restore(); }
  function valAt(s, t, keys, idx, v0){ let v = v0 || 0, from = v, T0 = -9, D = 1, to = v; (keys || []).forEach((k, j) => { const tk = k.at != null ? k.at : cueT(s, k.cue, k.fr ?? .3, idx); if (t >= tk){ from = lerp(from, to, clamp((tk - T0) / D, 0, 1)); to = k.v; T0 = tk; D = k.dur || 1; } });
    return lerp(from, to, easeIO(clamp((t - T0) / D, 0, 1))); }
  TT.scene(PX + "rajut", "Cerita: merajut syal (bongkar tiap salah / terus walau belum rapi / syal panjang)", (ctx, th, s, t) => {
    const idx = G.scene, { F } = shotOf(s, t), K = F.knit || [];
    const st0 = {}; const ends = [];
    base(ctx, s, t, { env: (F.env || "park"), spots: { scarf: () => K[0] && ends[0] ? [ends[0][0], ends[0][1] - 150, 1.0] : [540, 1000, 1] },
      over1: (c2, c, sts, j) => { K.forEach((k, n) => { if ((k.on ?? 0) !== j || !sts[j]) return; const st = sts[j], hp = handOf(st), fc = st.face || 1;
          const L = valAt(s, t, k.L, idx, k.L0 || 0), Lp = valAt(s, t - .1, k.L, idx, k.L0 || 0), grow = L > Lp + .5, undo = L < Lp - .5;
          const pts = k.path ? [[hp[0], hp[1] + 30]].concat(k.path) : [[hp[0], hp[1] + 30], [hp[0] + fc * 10, GY - 20], [hp[0] + (k.dir || fc) * 1400, GY - 20]];
          if (k.ball !== false){ const bx = k.ballX ?? (st.x - fc * 170); yarnBall(ctx, bx, GY, 48, L * .03, k.cols[1]); ctx.strokeStyle = k.cols[1]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx, GY - 60); ctx.quadraticCurveTo((bx + hp[0]) / 2, GY - 40 + Math.sin(t * 3) * 20, hp[0], hp[1] + 10); ctx.stroke(); }
          scarf(ctx, pts, L, k.w || 120, k.cols, t, { rough: k.rough, fringe: k.fringe, wave: grow ? 6 : 2 }); ends[n] = samplePath(pts, L);
          if (k.flawCue){ const tf = T(s, k.flawCue, .3, idx); if (t > tf && L > 30){ const p = samplePath(pts, Math.min(L, 60)), b = .5 + .5 * Math.sin(t * 12); ctx.beginPath(); ctx.arc(p[0], p[1], 46 + 6 * b, 0, TAU); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.stroke(); } }
          if (undo){ for (let i = 0; i < 6; i++){ const q = ((t * 2.4 + i / 6) % 1), ang = i * 1.3 + t * 3, px = hp[0] + Math.cos(ang) * 80 * q, py = hp[1] + 40 - q * 220; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.strokeStyle = k.cols[0]; ctx.lineWidth = 6; ctx.beginPath();
              for (let a = 0; a < 10; a++){ const u = a / 9; ctx.lineTo(px + Math.cos(u * 12 + i) * 18 * (1 - u) + u * 40, py + Math.sin(u * 12 + i) * 18 * (1 - u) - u * 30); } ctx.stroke(); ctx.restore(); } }
          if (k.perfect && L > 4){ sparkle(ctx, hp[0] + 40, hp[1] + 50, 16 + 6 * Math.sin(t * 6), GOLD); sparkle(ctx, hp[0] - 50, hp[1] + 80, 12 + 5 * Math.sin(t * 5 + 1), CREAM); }
          needles(ctx, hp[0], hp[1] + 10, t, grow || undo);
          st0[n] = st; }); },
      over: (c2, c, sts) => { K.forEach((k, n) => { const st = st0[n]; if (!st) return; const h = c.toScreen(...toonHead(st));
          if (k.counter){ const C = k.counter, a = T(s, C.cue, .2, idx), b = C.endCue ? T(s, C.endCue, .6, idx) : a + 3; if (t > a){ const v = Math.round(lerp(C.from ?? 1, C.to ?? 30, clamp((t - a) / Math.max(.1, b - a), 0, 1)));
              popChip(ctx, (C.label || "HARI") + " " + v, clamp(h[0], 200, 880), Math.max(330, h[1] - 300 * c.zoom), t - a, C.col || GREEN, "#FFFFFF", 44, .03); } }
          (k.chips || []).forEach((cp, j) => { const a = T(s, cp.cue, .3 + j * .1, idx), o = cp.outCue ? T(s, cp.outCue, .5, idx) : 1e9; if (t < a || t > o) return;
            popChip(ctx, cp.text, clamp(h[0] + (cp.dx || 0), 220, 860), Math.max(330, h[1] - (cp.dy ?? 300) * c.zoom), t - a, cp.col || RED, "#FFFFFF", cp.size || 40, cp.rot ?? -.06); }); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const all = [f].concat(f.shots || []); all.forEach(F => (F.knit || []).forEach(k => { if (k.flawCue) add(cueT(s, k.flawCue, .3, i), "ping");
      (k.L || []).forEach(q => { if (q.cue && q.v === 0) add(cueT(s, q.cue, q.fr ?? .3, i), "whoosh"); }); (k.chips || []).forEach((c, j) => add(cueT(s, c.cue, .3 + j * .1, i), "pop")); if (k.counter) add(cueT(s, k.counter.cue, .2, i), "pop"); })); });

  /* ---- _gigi: two tooth characters: brushed 3 hours once a month vs 2 minutes every day ---- */
  function tooth(ctx, x, y, s, t, o){ o = o || {}; const hop = o.hop || 0; ctx.save(); ctx.translate(x, y - hop); ctx.scale(s * (1 + (o.sq || 0)), s * (1 - (o.sq || 0)));
    const yel = clamp(o.yellow || 0, 0, 1), col = yel > 0 ? "rgb(" + Math.round(lerp(255, 236, yel)) + "," + Math.round(lerp(255, 206, yel)) + "," + Math.round(lerp(250, 120, yel)) + ")" : "#FFFFFF";
    ctx.beginPath(); ctx.moveTo(-130, -300); ctx.quadraticCurveTo(-90, -350, -45, -318); ctx.quadraticCurveTo(0, -350, 45, -318); ctx.quadraticCurveTo(90, -350, 130, -300);
    ctx.quadraticCurveTo(160, -200, 120, -110); ctx.quadraticCurveTo(110, -10, 80, 0); ctx.quadraticCurveTo(50, 6, 36, -70); ctx.quadraticCurveTo(0, -96, -36, -70); ctx.quadraticCurveTo(-50, 6, -80, 0); ctx.quadraticCurveTo(-110, -10, -120, -110); ctx.quadraticCurveTo(-160, -200, -130, -300); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ol(ctx, 7); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-96, -270); ctx.quadraticCurveTo(-112, -220, -100, -180); ctx.stroke();
    (o.holes || []).forEach(([hx, hy, r], i) => { const q = clamp(o.holeK - i * .3, 0, 1); if (q <= 0) return; ctx.beginPath(); ctx.ellipse(hx, hy, r * q, r * .8 * q, .3, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); });
    const m = o.mood || "happy"; ctx.fillStyle = OUT; ctx.strokeStyle = OUT; ctx.lineWidth = 7;
    if (m === "tired" || m === "proud"){ [-44, 44].forEach(ex => { ctx.beginPath(); ctx.arc(ex, -196, 18, m === "proud" ? 1.1 * Math.PI : .1 * Math.PI, m === "proud" ? 1.9 * Math.PI : .9 * Math.PI); ctx.stroke(); }); }
    else { const bl = Math.abs(Math.sin(t * .8 + x)) > .985 ? .15 : 1; [-44, 44].forEach(ex => { ctx.beginPath(); ctx.ellipse(ex, -196, 15, 20 * bl, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(ex + 4, -203, 5 * bl, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.fillStyle = OUT; }); }
    ctx.beginPath(); if (m === "sad" || m === "tired") ctx.arc(0, -118, 30, 1.15 * Math.PI, 1.85 * Math.PI); else ctx.arc(0, -160, 36, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    ctx.fillStyle = hexA("#F49A9A", .55); ctx.beginPath(); ctx.ellipse(-84, -158, 20, 12, 0, 0, TAU); ctx.ellipse(84, -158, 20, 12, 0, 0, TAU); ctx.fill();
    if (m === "tired"){ ctx.fillStyle = "#8FD0EE"; ctx.beginPath(); ctx.ellipse(110, -250 + (t * 60) % 60, 10, 15, 0, 0, TAU); ctx.fill(); }
    ctx.restore(); }
  function foam(ctx, x, y, amt, t){ if (amt <= 0) return; for (let i = 0; i < 26; i++){ const a = rnd(i) * TAU, r = (40 + rnd(i + 3) * 180) * amt, bx = x + Math.cos(a) * r * 1.1, by = y + Math.sin(a) * r * .9 - 20 * Math.sin(t * 3 + i);
      ctx.beginPath(); ctx.arc(bx, by, (18 + rnd(i + 7) * 34) * Math.min(1, amt * 1.5), 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA("#8FD0EE", .9); ctx.lineWidth = 4; ctx.stroke(); } }
  function bathroom(ctx, t){ ctx.fillStyle = "#CFE8EE"; ctx.fillRect(-500, -200, 2100, GY + 200); ctx.strokeStyle = "#A9CFD8"; ctx.lineWidth = 5;
    for (let i = 0; i < 24; i++){ ctx.beginPath(); ctx.moveTo(-500 + i * 100, -200); ctx.lineTo(-500 + i * 100, GY); ctx.stroke(); } for (let j = 0; j < 20; j++){ ctx.beginPath(); ctx.moveTo(-500, -200 + j * 100); ctx.lineTo(1600, -200 + j * 100); ctx.stroke(); }
    ctx.fillStyle = "#F0E6D8"; ctx.fillRect(-500, GY - 10, 2100, 400); ctx.fillStyle = "#5B7DB1"; ctx.fillRect(-500, 1180, 2100, 30);
    for (let i = 0; i < 5; i++){ const q = (t * .25 + i / 5) % 1; ctx.save(); ctx.globalAlpha *= .6 * Math.sin(q * Math.PI); ctx.beginPath(); ctx.arc(100 + i * 220 + Math.sin(t + i) * 30, 1150 - q * 500, 18 + i * 4, 0, TAU); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); } }
  TT.scene(PX + "gigi", "Cerita: gigi digosok 3 jam sebulan sekali vs 2 menit tiap hari", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gg = Object.assign({ ax: 290, bx: 790, s: 1.55 }, f.gigi || {});
    const tA = T(s, Gg.aCue, .2, idx), tFail = T(s, Gg.failCue, .5, idx), tB = T(s, Gg.bCue, .2, idx), tWin = T(s, Gg.winCue, .5, idx);
    const yel = Math.min(.8, .8 * ramp(t, 0, tA)) - .35 * ramp(t, tFail - .3, tFail + .3), scrub = t > tA && t < tFail, foamA = scrub ? ramp(t, tA, tA + 1) : Math.max(0, 1 - (t - tFail) * 2) * (t > tFail ? 1 : 0);
    const nB = t > tB ? Math.floor((t - tB) / .5) : -1, kB = t > tB && t < tWin ? ((t - tB) % .5) : 9;
    base(ctx, s, t, { env: "home", envOpt: { time: "day" }, spots: { a: [Gg.ax + 60, 1250, 1.08], b: [Gg.bx - 60, 1250, 1.08] },
      back: () => { bathroom(ctx, t);
        const hopA = scrub ? Math.abs(Math.sin(t * 20)) * 10 : 0;
        tooth(ctx, Gg.ax, GY, Gg.s, t, { yellow: yel, holes: [[-60, -260, 22], [70, -120, 18]], holeK: ramp(t, tA - 1, tA - .2) * 2, mood: t > tFail ? "tired" : (scrub ? "sad" : (yel > .4 ? "sad" : "happy")), hop: hopA, sq: scrub ? .03 * Math.sin(t * 30) : 0 });
        foam(ctx, Gg.ax, GY - 220 * Gg.s, foamA, t);
        if (scrub || (t > tA - .3 && t < tFail + .3)) drawItem(ctx, "brush", Gg.ax + 200 + Math.sin(t * 30) * 70, GY - 300, t, { s: 2.2, fast: true, col: MAROON });
        const win = t > tWin, hopB = kB < .3 ? Math.sin(kB / .3 * Math.PI) * 30 : (win ? Math.abs(Math.sin(t * 6)) * 24 : 0);
        tooth(ctx, Gg.bx, GY, Gg.s, t, { yellow: 0, mood: win ? "proud" : "happy", hop: hopB });
        if (kB < .35) drawItem(ctx, "brush", Gg.bx + 200 + Math.sin(t * 40) * 50, GY - 330, t, { s: 2.0, fast: true, col: TEAL });
        if (t > tB){ for (let i = 0; i < 4; i++){ const a = t * 2 + i * TAU / 4; sparkle(ctx, Gg.bx + Math.cos(a) * 260, GY - 330 + Math.sin(a) * 220, 14 + 6 * Math.sin(t * 7 + i), i % 2 ? GOLD : "#FFFFFF"); } } },
      over: (c2, c) => { const pa = c.toScreen(Gg.ax, GY - 420 * Gg.s), pb = c.toScreen(Gg.bx, GY - 420 * Gg.s);
        chip(ctx, Gg.aLabel || "3 JAM · SEBULAN SEKALI", clamp(pa[0], 200, 400), pa[1] - 40, scrub || t > tFail ? MAROON : "#7A6A60", "#FFFFFF", 27);
        chip(ctx, Gg.bLabel || "2 MENIT · TIAP HARI", clamp(pb[0], 700, 880), pb[1] - 40 + (t > tB ? Math.sin(t * 4) * 4 : 0), t > tB ? GREEN : "#7A6A60", "#FFFFFF", 27);
        if (t < tA){ const v = Math.round(lerp(1, 30, ramp(t, 0, tA))); popChip(ctx, "HARI " + v, clamp(pa[0], 220, 560), pa[1] + 30, t, "#9A8A7E", "#FFFFFF", 30, -.04); }
        if (scrub) popChip(ctx, "GOSOK 3 JAM!", clamp(pa[0], 220, 560), pa[1] + 40, t - tA, ORANGE, "#FFFFFF", 36, -.05);
        if (t > tFail) stampBox(ctx, Gg.failText || "TETAP BOLONG", clamp(pa[0], 250, 520), pa[1] + 330 * c.zoom, t - tFail, RED, 54, -.12);
        if (t > tB) popChip(ctx, "HARI " + Math.min(30, nB + 1), clamp(pb[0], 520, 850), pb[1] + 30, t - tB, GREEN, "#FFFFFF", 34, .04);
        if (t > tWin){ stampBox(ctx, Gg.winText || "AMPUH!", clamp(pb[0], 560, 830), pb[1] + 330 * c.zoom, t - tWin, GREEN, 60, .1); burstFx(ctx, pb[0], pb[1] + 300 * c.zoom, t - tWin, GOLD, 12, 260); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gg = f.gigi || {}; if (Gg.aCue) add(cueT(s, Gg.aCue, .2, i), "whoosh"); if (Gg.failCue) add(cueT(s, Gg.failCue, .5, i), "ping");
    if (Gg.bCue){ const a = cueT(s, Gg.bCue, .2, i); for (let k = 0; k < 5; k++) add(a + k * .5, "pop"); } if (Gg.winCue) add(cueT(s, Gg.winCue, .5, i), "chime"); });

  /* ================= SP35 ================= */
  function toolG(ctx, kind, x, y, s, rot, t){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); ctx.lineJoin = "round";
    if (kind === "wrench"){ ctx.fillStyle = "#AEB8C2"; rr(ctx, -12, -70, 24, 140, 10); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -80, 30, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#4A4A52"; ctx.fillRect(-10, -112, 20, 32); }
    else if (kind === "hammer"){ ctx.fillStyle = "#B5793D"; rr(ctx, -10, -50, 20, 130, 8); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#6B6F7A"; rr(ctx, -50, -82, 100, 40, 8); ctx.fill(); ol(ctx, 4); }
    else if (kind === "driver"){ ctx.fillStyle = RED; rr(ctx, -16, 0, 32, 70, 12); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#AEB8C2"; ctx.fillRect(-5, -80, 10, 80); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(-5, -80, 10, 80); }
    else if (kind === "pliers"){ ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-24, 70); ctx.lineTo(6, -20); ctx.moveTo(24, 70); ctx.lineTo(-6, -20); ctx.stroke(); ctx.strokeStyle = "#E8A55B"; ctx.lineWidth = 14; ctx.stroke(); ctx.fillStyle = "#AEB8C2"; ctx.beginPath(); ctx.moveTo(-14, -20); ctx.lineTo(0, -80); ctx.lineTo(14, -20); ctx.fill(); ol(ctx, 4); }
    else if (kind === "tape"){ ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); }
    else if (kind === "can"){ rr(ctx, -40, -60, 80, 120, 8); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#C9D3DC"; ctx.fillRect(-40, -20, 80, 40); }
    else if (kind === "rag"){ ctx.beginPath(); ctx.moveTo(-60, -20); ctx.quadraticCurveTo(-10, -60, 50, -30); ctx.quadraticCurveTo(70, 20, 20, 40); ctx.quadraticCurveTo(-50, 50, -60, -20); ctx.fillStyle = "#C9A47A"; ctx.fill(); ol(ctx, 4); }
    else if (kind === "box"){ rr(ctx, -60, -50, 120, 100, 6); ctx.fillStyle = "#C9935A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#E8C08A"; ctx.fillRect(-10, -50, 20, 100); }
    else if (kind === "calendar"){ rr(ctx, -55, -60, 110, 120, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.fillRect(-55, -60, 110, 30); textC(ctx, "2019", 0, 30, 30, BROWN, 900); }
    else if (kind === "drill"){ rr(ctx, -70, -30, 120, 56, 22); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 4); rr(ctx, -50, 10, 34, 80, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30, -40); ctx.lineTo(0, 10); ctx.lineTo(20, -30); ctx.stroke(); }
    else if (kind === "bottle"){ rr(ctx, -26, -60, 52, 110, 10); ctx.fillStyle = "#8FD0EE"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = TEAL; ctx.fillRect(-12, -80, 24, 22); }
    ctx.restore(); }
  /* workshop backdrop (world) */
  function bengkel(ctx, t, o){ o = o || {}; const clean = o.clean || 0;
    const g = ctx.createLinearGradient(0, 0, 0, GY); g.addColorStop(0, "#6F8597"); g.addColorStop(1, "#9DB0BE"); ctx.fillStyle = g; ctx.fillRect(-500, -300, 2100, GY + 300);
    ctx.strokeStyle = hexA("#FFFFFF", .15); ctx.lineWidth = 4; for (let i = 0; i < 12; i++){ ctx.beginPath(); ctx.moveTo(-500 + i * 200, -300); ctx.lineTo(-500 + i * 200, GY); ctx.stroke(); }
    for (let i = 0; i < 5; i++){ rr(ctx, -260 + i * 380, 300, 260, 150, 8); ctx.fillStyle = "#DCEFF6"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = OUT; ctx.fillRect(-134 + i * 380, 300, 6, 150); }
    for (let i = 0; i < 40; i++){ ctx.fillStyle = i % 2 ? "#2C2433" : GOLD; ctx.beginPath(); ctx.moveTo(-500 + i * 60, GY - 90); ctx.lineTo(-470 + i * 60, GY - 90); ctx.lineTo(-500 + i * 60, GY - 60); ctx.lineTo(-530 + i * 60, GY - 60); ctx.fill(); }
    ctx.fillStyle = "#8A8F96"; ctx.fillRect(-500, GY - 10, 2100, 400);
    if (clean > 0){ ctx.save(); ctx.globalAlpha *= clean; ctx.fillStyle = GOLD; ctx.fillRect(-500, GY + 30, 2100, 14); ctx.restore(); }
    // machine
    const mx = o.mx ?? 120, run = o.run || 0, jam = o.jam || 0;
    ctx.fillStyle = "#2F6F73"; rr(ctx, mx - 170, 820, 340, GY - 820, 18); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#245A5E"; rr(ctx, mx - 130, 700, 260, 140, 14); ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.translate(mx - 60, 1000); ctx.rotate(run ? t * 3 : (jam ? Math.sin(t * 30) * .05 : 0)); ctx.beginPath(); for (let i = 0; i < 16; i++){ const a = i / 16 * TAU, r = i % 2 ? 62 : 48; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = "#C9D3DC"; ctx.fill(); ol(ctx, 5); ctx.restore();
    ctx.beginPath(); ctx.arc(mx + 70, 990, 46, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.save(); ctx.translate(mx + 70, 990); ctx.rotate(jam ? .9 + Math.sin(t * 25) * .2 : -.6 + Math.sin(t * 2) * .2); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -36); ctx.stroke(); ctx.restore();
    const lc = jam ? (Math.sin(t * 10) > 0 ? RED : "#6A1E1E") : GREEN; glowAt(ctx, mx, 680, 120, lc, .45); ctx.beginPath(); ctx.arc(mx, 680, 26, 0, TAU); ctx.fillStyle = lc; ctx.fill(); ol(ctx, 5);
    if (jam) smokePuff(ctx, mx + 40, 640, (t * .9) % 1.4, 70, "#5A5A62");
    ctx.fillStyle = "#1E1A18"; rr(ctx, mx - 170, GY - 40, 340, 40, 8); ctx.fill(); }
  function pile(ctx, x, t, n){ const kinds = ["wrench", "hammer", "box", "can", "rag", "driver", "calendar", "pliers", "drill", "tape", "bottle", "box", "rag", "can"];
    for (let i = 0; i < n; i++){ const k = kinds[i % kinds.length], row = Math.floor(i / 5), px = x - 230 + (i % 5) * 115 + row * 40 + (rnd(i) - .5) * 40, py = GY - 60 - row * 85 + (rnd(i + 3) - .5) * 20;
      toolG(ctx, k, px, py + Math.sin(t * 2 + i) * 2, 1.1, (rnd(i + 7) - .5) * 1.6, t); } }
  function cableFloor(ctx, x0, x1, t, hot){ ctx.save(); ctx.strokeStyle = OUT; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, GY - 8); for (let i = 1; i <= 10; i++){ const x = lerp(x0, x1, i / 10); ctx.lineTo(x, GY - 8 - (i % 2 ? 26 : 0)); } ctx.stroke();
    ctx.strokeStyle = hot ? (Math.sin(t * 14) > 0 ? RED : "#E8A55B") : "#2C2433"; ctx.lineWidth = 10; ctx.stroke(); ctx.restore(); }
  /* tidy rack: board with tool silhouettes + labels, bins */
  const RACK = [["wrench", "KUNCI PAS"], ["hammer", "PALU"], ["driver", "OBENG"], ["pliers", "TANG"], ["tape", "METERAN"]];
  function rackBoard(ctx, cx, cy, w, t, o){ o = o || {}; const h = 330, x0 = cx - w / 2, q = o.inK == null ? 1 : eBack(clamp(o.inK / .5, 0, 1)); if (q <= 0) return [];
    ctx.save(); ctx.translate(cx, cy); ctx.scale(q, q); ctx.translate(-cx, -cy);
    rr(ctx, x0, cy - h / 2, w, h, 16); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#D8CFC0"; for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++){ ctx.beginPath(); ctx.arc(x0 + 30 + i * (w - 60) / 8, cy - h / 2 + 34 + j * 80, 5, 0, TAU); ctx.fill(); }
    const slots = RACK.map(([k, lab], i) => { const sx = x0 + w * (i + .5) / RACK.length, sy = cy - 20; ctx.save(); ctx.globalAlpha *= .9; ctx.filter = "none"; toolSil(ctx, k, sx, sy); ctx.restore();
      const lk = o.labK == null ? 1 : clamp((o.labK - i * .15) / .3, 0, 1); if (lk > 0){ ctx.save(); ctx.translate(sx, cy + h / 2 - 40); ctx.scale(lk, lk); rr(ctx, -w / RACK.length / 2 + 8, -20, w / RACK.length - 16, 40, 8); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 3); textC(ctx, lab, 0, 11, 24, "#FFFFFF", 900, w / RACK.length - 30); ctx.restore(); }
      return [sx, sy, k]; });
    ctx.restore(); return slots; }
  function toolSil(ctx, k, x, y){ ctx.save(); ctx.translate(x, y); ctx.scale(1.15, 1.15); ctx.fillStyle = "#3B2418"; ctx.globalAlpha *= .22;
    if (k === "wrench"){ rr(ctx, -14, -72, 28, 144, 10); ctx.fill(); ctx.beginPath(); ctx.arc(0, -80, 34, 0, TAU); ctx.fill(); } else if (k === "hammer"){ rr(ctx, -12, -50, 24, 132, 8); ctx.fill(); rr(ctx, -54, -86, 108, 46, 8); ctx.fill(); }
    else if (k === "driver"){ rr(ctx, -18, -82, 36, 154, 12); ctx.fill(); } else if (k === "pliers"){ rr(ctx, -34, -82, 68, 160, 20); ctx.fill(); } else { ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fill(); } ctx.restore(); }

  TT.scene(PX + "bengkel", "Cerita: bengkel (tumpukan alat dikacak + kabel / rak rapi, ambil 5 detik)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ mode: "kacau", pileX: 720, rackX: 720, rackY: 900 }, f.ws || {}), messy = B.mode === "kacau";
    const tDig = T(s, B.digCue, .2, idx), tTrip = T(s, B.tripCue, .3, idx), tFind = T(s, B.findCue, .4, idx), tTimer = T(s, B.timerCue, .2, idx), tTimerEnd = T(s, B.timerEndCue, .6, idx), tDays = T(s, B.daysCue, .2, idx), tSweep = T(s, B.sweepCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: -900 }, envFront: false, spots: { pile: [B.pileX, 1300, 1.15], rack: [B.rackX, B.rackY + 100, 1.1] },
      back: () => { bengkel(ctx, t, { jam: messy ? 1 : 0, run: messy ? 0 : 1, clean: messy ? 0 : 1, mx: B.mx ?? 120 });
        if (!messy){ const slots = rackBoard(ctx, B.rackX, B.rackY, 560, t, {});
          slots.forEach(([x, y, k], i) => { const taken = k === "wrench" && t > tFind - .3; if (!taken) toolG(ctx, k, x, y + Math.sin(t * 2 + i) * 2, 1.1, 0, t); });
          if (t > tFind - .3 && t < tFind + .4){ const p = slots[0]; glowAt(ctx, p[0], p[1], 160, GOLD, .6); }
          ctx.strokeStyle = GOLD; ctx.lineWidth = 10; ctx.setLineDash([40, 30]); ctx.beginPath(); ctx.moveTo(-500, GY + 60); ctx.lineTo(1600, GY + 60); ctx.stroke(); ctx.setLineDash([]);
          rr(ctx, -500, GY - 40, 2100, 26, 6); ctx.fillStyle = "#4A4A52"; ctx.fill(); }
        else { cableFloor(ctx, (B.mx ?? 120) + 170, 1300, t, t > tTrip - .2 && t < tTrip + 1.2); } },
      front: () => { if (messy){ const n = 14; pile(ctx, B.pileX, t, n);
          if (t > tDig){ for (let i = 0; i < 20; i++){ const t0 = tDig + i * .38, q = t - t0; if (q < 0 || q > 1.1) continue; const k = ["box", "can", "rag", "calendar", "bottle", "hammer", "drill", "tape"][i % 8], dir = i % 2 ? 1 : -1;
              toolG(ctx, k, B.pileX - 60 + dir * 520 * q, GY - 200 - 900 * q + 900 * q * q, 1.1, q * 9 * dir, t); } } }
        if (!messy && t > tSweep){ for (let i = 0; i < 10; i++){ const q = ((t - tSweep) * .8 + i / 10) % 1; ctx.save(); ctx.globalAlpha *= (1 - q) * .7; ctx.beginPath(); ctx.arc(200 + i * 90 + q * 60, GY - 20 - q * 80, 10 + q * 14, 0, TAU); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ctx.restore(); } } },
      over: (c2, c) => {
        if (t > tTimer){ const k = t - tTimer, q = clamp(k / Math.max(.5, tTimerEnd - tTimer), 0, 1), tot = messy ? 15 * 60 * eOut(q) : 5 * q, mm = Math.floor(tot / 60), ss = Math.floor(tot % 60);
          const txt = messy ? (B.timerLabel || "MENCARI") + " " + String(mm).padStart(2, "0") + ":" + String(ss).padStart(2, "0") : (B.timerLabel || "KETEMU") + " " + Math.max(1, Math.ceil(tot)) + " DETIK";
          popChip(ctx, txt, 540, 340, k, messy ? (q >= 1 ? RED : ORANGE) : GREEN, "#FFFFFF", 48, -.03); }
        if (messy && t > tTrip) { stampBox(ctx, B.tripText || "AWAS KABEL!", 540, 520, t - tTrip, RED, 64, -.1); }
        if (!messy && t > tDays){ (B.days || ["SEN", "SEL", "RAB", "KAM", "JUM"]).forEach((d, i) => { const k = t - tDays - i * .3; if (k < 0) return; popChip(ctx, d + " ✓", 170 + i * 185, 470, k, i === 4 ? GREEN : PAPER, i === 4 ? "#FFFFFF" : BROWN, 34, (i % 2 ? .05 : -.05)); }); }
        if (!messy && t > tFind) burstFx(ctx, 540, 700, t - tFind, GOLD, 12, 240); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.ws || {}; if (B.digCue){ const a = cueT(s, B.digCue, .2, i); for (let k = 0; k < 5; k++) add(a + k * .76, "whoosh"); }
    if (B.tripCue) add(cueT(s, B.tripCue, .3, i), "ping"); if (B.findCue) add(cueT(s, B.findCue, .4, i), "chime"); if (B.timerCue) add(cueT(s, B.timerCue, .2, i), "pop");
    if (B.daysCue){ const a = cueT(s, B.daysCue, .2, i); for (let k = 0; k < 5; k++) add(a + k * .3, "pop"); } });

  /* ---- _ringkas: R1 Ringkas (red tags -> box) + R2 Rapi (tools fly onto a labelled board) ---- */
  TT.scene(PX + "ringkas", "Cerita: label merah singkirkan + alat terbang ke papan berlabel", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, R = Object.assign({ boardX: 560, boardY: 760, boxX: 900 }, f.sort || {});
    const tR1 = T(s, R.r1Cue, .2, idx), tTag = T(s, R.tagCue, .2, idx), tOut = T(s, R.outCue, .3, idx), tR2 = T(s, R.r2Cue, .2, idx), tSlot = T(s, R.slotCue, .2, idx), tLab = T(s, R.labelCue, .2, idx);
    const junk = [["calendar", 380, 1170], ["can", 540, 1240], ["drill", 700, 1160], ["rag", 450, 1330], ["bottle", 800, 1300]];
    const keep = [["wrench", 350, 1060], ["hammer", 620, 1310], ["driver", 900, 1110], ["pliers", 770, 1240], ["tape", 540, 1060]];
    let slots = [];
    base(ctx, s, t, { env: "info", envOpt: { spotX: 560 }, spots: { board: [R.boardX, R.boardY + 140, 1.05], box: [R.boxX - 120, 1300, 1.1] },
      back: () => { const ink = t > tR2 - .3 ? t - tR2 + .3 : -1; slots = rackBoard(ctx, R.boardX, R.boardY, 600, t, { inK: ink, labK: t - tLab });
        // the SINGKIRKAN box
        const bq = eBack(clamp((t - tTag) / .4, 0, 1)); if (bq > 0){ ctx.save(); ctx.translate(R.boxX, GY); ctx.scale(bq, bq); rr(ctx, -130, -200, 260, 200, 10); ctx.fillStyle = "#C9935A"; ctx.fill(); ol(ctx, 6);
          ctx.fillStyle = "#A9763F"; ctx.beginPath(); ctx.moveTo(-130, -200); ctx.lineTo(-170, -250); ctx.lineTo(-90, -250); ctx.lineTo(-60, -200); ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(130, -200); ctx.lineTo(170, -250); ctx.lineTo(90, -250); ctx.lineTo(60, -200); ctx.fill(); ol(ctx, 5);
          rr(ctx, -110, -130, 220, 50, 8); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, R.boxLabel || "SINGKIRKAN", 0, -95, 30, "#FFFFFF", 900, 200); ctx.restore(); } },
      front: () => {
        junk.forEach(([k, x, y], i) => { const t0 = tOut + i * .22, q = clamp((t - t0) / .7, 0, 1); if (q >= 1) return; const fx = lerp(x, R.boxX, q), fy = lerp(y, GY - 160, q) - 300 * 4 * q * (1 - q);
          const bob = Math.sin(t * 2.2 + i) * 14; toolG(ctx, k, fx, fy + (q ? 0 : bob), 1.25 * (1 - q * .5), q * 8 + Math.sin(t + i) * .1, t);
          const tk = t - tTag - i * .18; if (tk > 0){ const tq = eBack(clamp(tk / .3, 0, 1)); ctx.save(); ctx.translate(fx + 40, fy - 60 + (q ? 0 : bob)); ctx.rotate(.3 + Math.sin(t * 5 + i) * .2); ctx.scale(tq, tq);
            ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(0, 0); ctx.stroke(); rr(ctx, 0, -18, 64, 36, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); textC(ctx, "X", 32, 10, 26, "#FFFFFF", 900); ctx.restore(); } });
        keep.forEach(([k, x, y], i) => { const sl = slots.find(z => z[2] === k), t0 = tSlot + i * .3, q = sl ? clamp((t - t0) / .6, 0, 1) : 0, bob = Math.sin(t * 2 + i * 1.3) * 14;
          const fx = sl ? lerp(x, sl[0], eOut(q)) : x, fy = sl ? lerp(y + bob, sl[1], eOut(q)) - 120 * Math.sin(q * Math.PI) : y + bob;
          if (q > 0 && q < 1.2 && sl && t - t0 > .6 && t - t0 < 1) glowAt(ctx, sl[0], sl[1], 120, GOLD, .5 * (1 - (t - t0 - .6) / .4));
          toolG(ctx, k, fx, fy, 1.1 + .15 * (1 - q), (1 - q) * (Math.sin(t * 1.5 + i) * .6 + .4), t); }); },
      over: () => { if (t > tR1) popChip(ctx, R.r1 || "R1 · RINGKAS", 540, 340, t - tR1, RED, "#FFFFFF", 52, -.04);
        if (t > tR2) popChip(ctx, R.r2 || "R2 · RAPI", 540, 440, t - tR2, TEAL, "#FFFFFF", 52, .04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const R = f.sort || {}; [["r1Cue", "pop"], ["tagCue", "pop"], ["outCue", "whoosh"], ["r2Cue", "pop"], ["slotCue", "whoosh"], ["labelCue", "chime"]].forEach(([k, snd]) => { if (R[k]) add(cueT(s, R[k], .2, i), snd); }); });

  /* ---- _resik: a mop wipe line reveals the clean floor, hidden oil leak shows up; standard photo pinned ---- */
  TT.scene(PX + "resik", "Cerita: lap pel menyapu kotoran, kebocoran oli terlihat, foto standar ditempel", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rs = Object.assign({ mopper: 0, leakX: 250 }, f.resik || {}), toons = f.toons || [];
    const tR3 = T(s, Rs.r3Cue, .2, idx), tLeak = T(s, Rs.leakCue, .3, idx), tR4 = T(s, Rs.r4Cue, .2, idx), tPhoto = T(s, Rs.photoCue, .3, idx), checks = (Rs.checks || []).map((c, j) => T(s, c, .3 + j * .1, idx));
    let wipeX = -400;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: -900 }, envFront: false, spots: { leak: [Rs.leakX + 60, 1300, 1.2], photo: [740, 900, 1.05] },
      back: (c2, c, sts) => { bengkel(ctx, t, { clean: 1, run: t > tLeak + 1.5 ? 1 : 0, mx: 120 });
        const ms = sts[Rs.mopper]; if (ms) wipeX = ms.x + (ms.face || 1) * 130; if (t > T(s, Rs.doneCue, .2, idx)) wipeX = 9999;
        // oil drip under the machine
        const lx = Rs.leakX; for (let i = 0; i < 3; i++){ const q = ((t * .9 + i / 3) % 1); ctx.beginPath(); ctx.ellipse(lx, 1380 + q * 240, 8, 12, 0, 0, TAU); ctx.fillStyle = "#2B2418"; ctx.fill(); }
        ctx.beginPath(); ctx.ellipse(lx + 20, GY + 6, 110, 18, 0, 0, TAU); ctx.fillStyle = "#3B3028"; ctx.fill();
        // grime on the uncleaned side
        ctx.save(); ctx.beginPath(); ctx.rect(wipeX, -300, 2400, GY + 700); ctx.clip(); ctx.fillStyle = hexA("#4A3B2A", .45); ctx.fillRect(-500, -300, 2100, GY + 700);
        for (let i = 0; i < 40; i++){ ctx.beginPath(); ctx.ellipse(-300 + rnd(i) * 1700, 300 + rnd(i + 5) * 1500, 40 + rnd(i + 9) * 90, 20 + rnd(i + 2) * 50, rnd(i) * 3, 0, TAU); ctx.fillStyle = hexA("#3B2A1C", .35); ctx.fill(); }
        for (let i = 0; i < 18; i++){ const q = (t * .2 + i / 18) % 1; ctx.beginPath(); ctx.arc(-200 + rnd(i + 30) * 1500, 400 + rnd(i + 40) * 1200 - q * 120, 6, 0, TAU); ctx.fillStyle = hexA("#E9E4DA", .5 * Math.sin(q * Math.PI)); ctx.fill(); }
        ctx.restore();
        if (wipeX > -300 && wipeX < 1500){ for (let i = 0; i < 6; i++){ const a = t * 4 + i; sparkle(ctx, wipeX - 60 - (i % 3) * 60, 900 + i * 120 + Math.sin(a) * 30, 14 + 6 * Math.sin(a * 2), i % 2 ? "#FFFFFF" : GOLD); } }
        // standard photo + checklist on the wall
        const pq = eBack(clamp((t - tPhoto) / .5, 0, 1)); if (pq > 0){ ctx.save(); ctx.translate(720, 760); ctx.rotate(-.05 + Math.sin(t * 2) * .02); ctx.scale(pq, pq);
          rr(ctx, -170, -170, 340, 340, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#9DB0BE"; ctx.fillRect(-145, -145, 290, 220);
          ctx.fillStyle = "#E9E4DA"; ctx.fillRect(-110, -120, 220, 110); RACK.forEach(([k], i) => toolG(ctx, k, -88 + i * 44, -66, .35, 0, t)); ctx.fillStyle = GOLD; ctx.fillRect(-145, 40, 290, 10);
          textC(ctx, Rs.photoLabel || "KONDISI IDEAL", 0, 128, 34, BROWN, 900, 300); ctx.beginPath(); ctx.arc(0, -178, 16, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); ctx.restore(); }
        (Rs.checkText || ["RINGKAS", "RAPI", "RESIK"]).forEach((tx, i) => { const k = t - (checks[i] ?? 1e9); if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(720, 990 + i * 70); ctx.scale(q, q);
          rr(ctx, -170, -28, 340, 56, 12); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(-136, 0, 18, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 3);
          ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-144, 0); ctx.lineTo(-137, 8); ctx.lineTo(-126, -8); ctx.stroke(); textL(ctx, tx, -104, 12, 32, BROWN, 900, 260); ctx.restore(); }); },
      over: (c2, c) => { if (t > tR3) popChip(ctx, Rs.r3 || "R3 · RESIK", 540, 340, t - tR3, TEAL, "#FFFFFF", 52, -.04);
        if (t > tLeak){ const p = c.toScreen(Rs.leakX, 1480), b = .5 + .5 * Math.sin(t * 9); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(p[0], p[1], 120 * c.zoom + 8 * b, 160 * c.zoom + 8 * b, 0, 0, TAU); ctx.stroke(); ctx.restore();
          if (t < tR4) popChip(ctx, Rs.leakText || "BOCOR OLI!", clamp(p[0] + 120, 260, 820), 520, t - tLeak, RED, "#FFFFFF", 46, .05); }
        if (t > tR4) popChip(ctx, Rs.r4 || "R4 · RAWAT", 540, 440, t - tR4, ORANGE, "#FFFFFF", 52, .04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const R = f.resik || {}; [["r3Cue", "pop"], ["leakCue", "ping"], ["r4Cue", "pop"], ["photoCue", "chime"]].forEach(([k, snd]) => { if (R[k]) add(cueT(s, R[k], .2, i), snd); });
    (R.checks || []).forEach((c, j) => add(cueT(s, c, .3 + j * .1, i), "pop")); });

  /* ================= RN35 ================= */
  function cardBox(ctx, x, y, w, h, i, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = i % 3 === 1 ? "#C48A50" : "#D29B5E"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA("#F3D9B5", .7); ctx.fillRect(-w / 2 + 6, -8, w - 12, 16); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 2 + 14, -h / 2 + 16); ctx.lineTo(-w / 2 + 40, -h / 2 + 16); ctx.stroke();
    if (i % 4 === 2){ ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w / 2 - 40, h / 2 - 30); ctx.lineTo(w / 2 - 20, h / 2 - 16); ctx.moveTo(w / 2 - 20, h / 2 - 30); ctx.lineTo(w / 2 - 40, h / 2 - 16); ctx.stroke(); } ctx.restore(); }
  function bigLaptop(ctx, x, y, t, p, o){ o = o || {}; // y = desk top
    ctx.fillStyle = "#2C2433"; rr(ctx, x - 170, y - 230, 340, 220, 14); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#EAF6FA"; ctx.fillRect(x - 150, y - 212, 300, 186);
    textL(ctx, o.title || "PENAWARAN VENDOR", x - 136, y - 176, 24, TEAL, 900, 270); for (let i = 0; i < 3; i++){ ctx.fillStyle = "#C9DCE3"; rr(ctx, x - 136, y - 156 + i * 30, 200 + rnd(i) * 60, 14, 6); ctx.fill(); }
    ctx.fillStyle = "#D9E3E8"; rr(ctx, x - 136, y - 64, 220, 26, 13); ctx.fill(); ctx.fillStyle = p >= .8 ? GREEN : ORANGE; rr(ctx, x - 136, y - 64, Math.max(26, 220 * p), 26, 13); ctx.fill();
    textL(ctx, Math.round(p * 100) + "%", x + 94, y - 42, 28, BROWN, 900); rr(ctx, x - 200, y - 14, 400, 18, 6); ctx.fillStyle = "#5E6470"; ctx.fill(); ol(ctx, 4); }
  TT.scene(PX + "benteng", "Cerita: benteng kardus di meja (dibangun / diketuk lalu runtuh)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Fo = Object.assign({ x: 600, mode: "tutup", rows: 4, cols: 5, bw: 140, bh: 115, pct: .8 }, f.fort || {}), open0 = Fo.mode === "buka";
    const tBuild = T(s, Fo.buildCue, .2, idx), tKnock = T(s, Fo.knockCue, .3, idx), tOpen = T(s, Fo.openCue, .2, idx), tPct = T(s, Fo.pctCue, .3, idx);
    const W = Fo.cols * Fo.bw, x0 = Fo.x - W / 2, deskTop = GY - 300;
    const boxes = []; for (let r = 0; r < Fo.rows; r++) for (let c = 0; c < Fo.cols; c++){ if (r === 1 && c === 2) continue; if (r === Fo.rows - 1 && c % 2 === 1) continue; boxes.push([r, c]); }
    const p = open0 ? (t < tPct ? .8 * ramp(t, tOpen, tOpen + .8) : .8) : clamp(.15 + t * .02, 0, .5);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1010 }, spots: { laptop: [Fo.x + 110, deskTop - 160, 1.25], fort: [Fo.x, GY - 300, 1.0] },
      back: () => { ctx.fillStyle = "#8E4E2E"; rr(ctx, Fo.x - 40, deskTop + 20, 22, 280, 6); ctx.fill(); ol(ctx, 4); rr(ctx, Fo.x + 280, deskTop + 20, 22, 280, 6); ctx.fill(); ol(ctx, 4);
        rr(ctx, Fo.x - 70, deskTop, 400, 30, 8); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5); bigLaptop(ctx, Fo.x + 120, deskTop, t, p, {}); },
      front: () => {
        const knock = t > tKnock && t < tOpen ? Math.exp(-((t - tKnock) % .5) * 8) * 6 : 0;
        boxes.forEach(([r, c], i) => { let bx = x0 + Fo.bw * (c + .5), by = GY - Fo.bh * (r + .5), rot = Math.sin(t * 9 + i) * .01 * knock;
          if (!open0){ const t0 = tBuild + i * .09, q = clamp((t - t0) / .35, 0, 1); if (t < t0) return; by -= (1 - eOut(q)) * 900; if (q >= 1) by += Math.sin(clamp((t - t0 - .35) / .3, 0, 1) * Math.PI) * 6; }
          else if (t > tOpen){ const k = clamp((t - tOpen - (Fo.rows - 1 - r) * .08 - Math.abs(c - 2) * .04) / .8, 0, 1), dir = c < 2 ? -1 : c > 2 ? 1 : (r % 2 ? 1 : -1);
            bx += dir * (180 + rnd(i) * 220) * eOut(k); const yf = GY - Fo.bh / 2 + 60 + rnd(i + 3) * 50; by = lerp(by, yf, k) - 160 * Math.sin(k * Math.PI) * (r + 1) * .4; rot = dir * k * (1.2 + rnd(i) * 1.4); }
          cardBox(ctx, bx + knock * Math.sin(t * 40 + i), by, Fo.bw - 6, Fo.bh - 6, i, rot); });
        const built = open0 ? (t < tOpen) : t > tBuild + boxes.length * .09 + .3;
        if (built){ // window glow + sign + flag
          const wx = x0 + Fo.bw * 2.5, wy = GY - Fo.bh * 1.5; glowAt(ctx, wx, wy, 150, "#BFE8FF", .45 + .15 * Math.sin(t * 7));
          ctx.save(); ctx.translate(x0 + Fo.bw * 1.1, GY - Fo.bh * 2.5); ctx.rotate(-.08); rr(ctx, -110, -40, 220, 80, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#C9D3DC", .8); ctx.fillRect(-120, -48, 40, 16); ctx.fillRect(80, 32, 40, 16);
          textC(ctx, Fo.sign || "JANGAN", 0, -6, 30, RED, 900, 200); textC(ctx, Fo.sign2 || "GANGGU!", 0, 28, 30, RED, 900, 200); ctx.restore();
          const fx = x0 + Fo.bw * 4.5, fy = GY - Fo.bh * Fo.rows; ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - 170); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(fx, fy - 170); ctx.quadraticCurveTo(fx + 60, fy - 150 + Math.sin(t * 6) * 10, fx + 110, fy - 140); ctx.lineTo(fx, fy - 110); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
          for (let i = 0; i < 4; i++){ const q = (t * 1.2 + i / 4) % 1; ctx.save(); ctx.globalAlpha *= 1 - q; textC(ctx, i % 2 ? "tik" : "tak", wx + (i - 1.5) * 50 + Math.sin(q * 6 + i) * 20, wy - 70 - q * 200, 34, "#FFFFFF", 900); ctx.restore(); }
          smokePuff(ctx, Fo.x - 120, GY - Fo.bh * Fo.rows - 60, (t * .7) % 1.4, 60, "#FFFFFF"); } },
      over: (c2, c) => {
        if (open0 && t > tKnock && t < tOpen + .2){ const p2 = c.toScreen(x0 + 40, GY - Fo.bh * 2.5); popWord(ctx, "TOK TOK!", clamp(p2[0] + 60, 260, 820), Math.max(420, p2[1] - 120), t - tKnock, { size: 84, hold: tOpen - tKnock + .2, rot: -8 }); }
        if (open0 && t > tPct){ const p3 = c.toScreen(Fo.x + 120, deskTop - 300); stampBox(ctx, Math.round(Fo.pct * 100) + "% BERES!", clamp(p3[0], 330, 760), Math.max(400, p3[1] - 60), t - tPct, GREEN, 72, -.08); burstFx(ctx, clamp(p3[0], 330, 760), Math.max(400, p3[1] - 60), t - tPct, GOLD, 12, 280); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Fo = f.fort || {}; if (Fo.buildCue){ const a = cueT(s, Fo.buildCue, .2, i); for (let k = 0; k < 6; k++) add(a + k * .28, "pop"); }
    if (Fo.knockCue){ const a = cueT(s, Fo.knockCue, .3, i); add(a, "pop"); add(a + .25, "pop"); } if (Fo.openCue) add(cueT(s, Fo.openCue, .2, i), "whoosh"); if (Fo.pctCue) add(cueT(s, Fo.pctCue, .3, i), "chime"); });

  /* ---- _orkestra: the team is an orchestra frozen mid-pose, waiting days for the conductor / the conductor brings a 3-line score ---- */
  function tuba(ctx, x, y, s, t, o){ o = o || {}; const vib = o.play ? Math.sin(t * 40) * 3 : 0; ctx.save(); ctx.translate(x + vib, y); ctx.scale(s, s); ctx.rotate(-.15);
    ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(0, 40, 70, 90, 0, 0, TAU); ctx.stroke(); ctx.strokeStyle = GOLD; ctx.lineWidth = 22; ctx.stroke();
    ctx.strokeStyle = OUT; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(40, -40); ctx.lineTo(70, -150); ctx.stroke(); ctx.strokeStyle = GOLD; ctx.lineWidth = 18; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, -150); ctx.quadraticCurveTo(70, -170, 120, -260); ctx.lineTo(10, -270); ctx.quadraticCurveTo(50, -180, 30, -150); ctx.fillStyle = "#F2C14E"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(65, -265, 58, 16, -.05, 0, TAU); ctx.fillStyle = "#B8862A"; ctx.fill(); ol(ctx, 5);
    if (o.dust > 0){ ctx.fillStyle = hexA("#9A9286", .6 * o.dust); ctx.beginPath(); ctx.ellipse(65, -268, 54, 12, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#AEB8C2"; [-20, 0, 20].forEach(d => { rr(ctx, -40 + d, -30, 12, 34, 4); ctx.fill(); ol(ctx, 2); }); ctx.restore(); }
  function violin(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.9);
    ctx.fillStyle = "#A0522D"; ctx.beginPath(); ctx.ellipse(0, 40, 46, 52, 0, 0, TAU); ctx.ellipse(0, -30, 38, 42, 0, 0, TAU); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#2C2433"; rr(ctx, -9, -170, 18, 140, 6); ctx.fill(); ol(ctx, 3); ctx.strokeStyle = "#FFF4E6"; ctx.lineWidth = 2; for (let i = -1; i <= 1; i++){ ctx.beginPath(); ctx.moveTo(i * 5, -165); ctx.lineTo(i * 5, 70); ctx.stroke(); }
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(-16, 10, 4, 14, 0, 0, TAU); ctx.ellipse(16, 10, 4, 14, 0, 0, TAU); ctx.fill(); ctx.restore();
    const bow = o.play ? Math.sin(t * 14) * 60 : 0; ctx.save(); ctx.translate(x + 40 + bow, y + 30); ctx.rotate(.5); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(150, 0); ctx.stroke(); ctx.strokeStyle = "#E9E4DA"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  function podium(ctx, x, t){ ctx.fillStyle = "#7A3B2E"; rr(ctx, x - 150, GY - 90, 300, 90, 8); ctx.fill(); ol(ctx, 5); ctx.fillStyle = GOLD; ctx.fillRect(x - 150, GY - 90, 300, 10);
    ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x + 190, GY); ctx.lineTo(x + 190, GY - 330); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 150, GY); ctx.lineTo(x + 190, GY - 60); ctx.lineTo(x + 230, GY); ctx.stroke();
    ctx.save(); ctx.translate(x + 190, GY - 340); ctx.rotate(-.12); rr(ctx, -80, -50, 160, 100, 6); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  function scoreBoard(ctx, cx, cy, t, o){ const w = 820, h = 330, q = o.inK == null ? 1 : eBack(clamp(o.inK / .5, 0, 1)); if (q <= 0) return; ctx.save(); ctx.translate(cx, cy - (1 - q) * 300); ctx.rotate(Math.sin(t * 1.2) * .015);
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * .35, -h / 2); ctx.lineTo(-w * .35, -h / 2 - 400); ctx.moveTo(w * .35, -h / 2); ctx.lineTo(w * .35, -h / 2 - 400); ctx.stroke();
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7); rr(ctx, -w / 2, -h / 2, w, 56, 16); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 7);
    textC(ctx, o.title || "PARTITUR KABAR", 0, -h / 2 + 40, 34, GOLD, 900, w - 60);
    for (let r = 0; r < 3; r++){ const yy = -h / 2 + 100 + r * 82; ctx.strokeStyle = hexA(OUT, .18); ctx.lineWidth = 2; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(-w / 2 + 20, yy - 24 + k * 14); ctx.lineTo(w / 2 - 20, yy - 24 + k * 14); ctx.stroke(); }
      const ln = (o.lines || [])[r]; if (!ln || ln.k < 0){ if (o.blank) textC(ctx, "? ? ?", 0, yy + 14, 40, hexA(OUT, .3), 900); continue; }
      const lq = eBack(clamp(ln.k / .35, 0, 1)); ctx.save(); ctx.translate(-w / 2 + 120, yy); ctx.scale(lq, lq); chip(ctx, ln.label, 0, 0, [GREEN, TEAL, ORANGE][r], "#FFFFFF", 27); ctx.restore();
      textL(ctx, ln.text.slice(0, Math.floor(ln.k * 36)), -w / 2 + 240, yy + 14, 42, BROWN, 800, w - 280); }
    ctx.restore(); }
  TT.scene(PX + "orkestra", "Cerita: orkestra membeku menunggu dirigen / partitur kabar 3 baris lalu musik meledak", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Ok = Object.assign({ mode: "tunggu", podX: 540, dayLen: 2.2, tubaOn: 0, vioOn: 1 }, f.ork || {}), play0 = Ok.mode === "main";
    const tDay = Ok.dayCue ? T(s, Ok.dayCue, .2, idx) : 0, tBird = T(s, Ok.birdCue, .3, idx), tBoard = T(s, Ok.boardCue, .2, idx), tTap = T(s, Ok.tapCue, .3, idx), tPlay = T(s, Ok.playCue, .3, idx);
    const lines = (Ok.lines || []).map(l => Object.assign({}, l, { k: t - T(s, l.cue, .3, idx) })), playing = play0 && t > tPlay;
    const day = !play0 && t > tDay ? (t - tDay) / Ok.dayLen : 0, dust = clamp(day / 3, 0, 1);
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 }, spots: { board: [540, 820, 1.0], pod: [Ok.podX, 1150, 1.05] },
      back: () => { if (!play0 && (day % 1) > .5){ ctx.fillStyle = hexA("#0B1020", .35 * Math.sin(((day % 1) - .5) * 2 * Math.PI)); ctx.fillRect(-600, -400, 2300, GY + 500); }
        podium(ctx, Ok.podX, t);
        scoreBoard(ctx, 520, 590, t, { inK: play0 ? t - tBoard : 9, lines, blank: !play0 }); },
      over1: (c2, c, sts, j) => { const st = sts[j]; if (!st) return; const hp = handOf(st), fc = st.face || 1;
        if (j === Ok.tubaOn) tuba(ctx, st.x + fc * 120, GY - 330, 1.1, t, { play: playing, dust });
        if (j === Ok.vioOn) violin(ctx, st.x + fc * 150, GY - 430, 1.0, t, { play: playing });
        if (play0 && j === Ok.cond && t > tBoard - .5){ ctx.save(); ctx.translate(hp[0], hp[1]); ctx.rotate(-1.1 + (t > tTap ? Math.sin(t * 9) * .4 : 0)); ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -170); ctx.stroke(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); } },
      front: (c2, c, sts) => {
        if (!play0){ for (let i = 0; i < 16; i++){ const q = (t * .12 + i / 16) % 1; ctx.beginPath(); ctx.arc(100 + rnd(i) * 900, 500 + q * 900, 5 + rnd(i + 2) * 5, 0, TAU); ctx.fillStyle = hexA("#E9E4DA", .5 * Math.sin(q * Math.PI)); ctx.fill(); }
          const bi = Ok.birdOn ?? 0; if (t > tBird && sts[bi]){ const h = toonHead(sts[bi]), k = clamp((t - tBird) / .9, 0, 1), bxx = lerp(h[0] + 500, h[0] + 10, eOut(k)), byy = lerp(h[1] - 500, h[1] - sts[bi].size * .2, eOut(k)), flap = k < 1 ? Math.sin(t * 30) : Math.sin(t * 2) * .2;
            ctx.save(); ctx.translate(bxx, byy); ctx.beginPath(); ctx.ellipse(0, -26, 30, 22, 0, 0, TAU); ctx.fillStyle = "#8A8F96"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(-22, -46, 16, 0, TAU); ctx.fill(); ol(ctx, 4);
            ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-26, -50, 3.5, 0, TAU); ctx.fill(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(-36, -46); ctx.lineTo(-52, -42); ctx.lineTo(-36, -38); ctx.fill();
            ctx.beginPath(); ctx.ellipse(8, -30 - flap * 16, 24, 10, -.5 - flap * .5, 0, TAU); ctx.fillStyle = "#6B6F7A"; ctx.fill(); ol(ctx, 3); ctx.restore(); } }
        if (playing){ for (let i = 0; i < 14; i++){ const q = ((t - tPlay) * .6 + i / 14) % 1, sx = [200, 860, 540][i % 3], x = sx + Math.sin(q * 8 + i) * 80 + (i % 2 ? 1 : -1) * q * 200, y = 1100 - q * 700;
            ctx.save(); ctx.globalAlpha *= Math.sin(q * Math.PI); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3 + i) * .3); ctx.fillStyle = [ORANGE, GOLD, "#FFFFFF", TEAL][i % 4]; ctx.beginPath(); ctx.ellipse(0, 0, 22, 16, -.4, 0, TAU); ctx.fill(); ol(ctx, 3);
            ctx.fillRect(16, -70, 7, 70); if (i % 2){ ctx.fillRect(16, -70, 40, 10); } ctx.restore(); } } },
      over: () => { if (!play0 && day > 0){ const n = Math.min(Ok.maxDay || 9, 1 + Math.floor(day)); popChip(ctx, (Ok.dayLabel || "MENUNGGU DIRIGEN · HARI") + " " + n, 540, 340, t - tDay, (day % 1) > .5 ? NAVY : ORANGE, "#FFFFFF", 42, -.03); }
        if (play0 && t > tTap && t < tPlay + .2) popWord(ctx, "TUK TUK!", 540, 330, t - tTap, { size: 80, hold: Math.max(.8, tPlay - tTap + .2), rot: -6 });
        if (playing) popWord(ctx, Ok.goText || "AYO JALAN!", 540, 330, t - tPlay, { size: 96, hold: 2 }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Ok = f.ork || {}; if (Ok.boardCue) add(cueT(s, Ok.boardCue, .2, i), "whoosh"); if (Ok.tapCue){ const a = cueT(s, Ok.tapCue, .3, i); add(a, "pop"); add(a + .2, "pop"); }
    if (Ok.playCue) add(cueT(s, Ok.playCue, .3, i), "chime"); (Ok.lines || []).forEach(l => add(cueT(s, l.cue, .3, i), "pop")); if (Ok.birdCue) add(cueT(s, Ok.birdCue, .3, i) + .8, "pop"); });
})();
