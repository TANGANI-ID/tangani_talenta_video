/* Scene pack j2611221104032: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for RN33, KD33, JS33, SC33, MS33.
   Layout prefix j2611221104032_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, hold, piece:false}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, out|outCue, s, text}]   object in a toon's hand: shovel, ball, cake, baby, keys, frame, hooks, paper, phone, drill
     pops   [{at|cue, text, x, y, size, rot, col}]      big outlined pop words (screen)
     confetti {at|cue}                                   paper confetti     toon.chair / toon.chairX   rolling office chair under a toon
   Set pieces (layout suffix):
     _adegan    generic story shot with the extras above
     _alih      office desk + big monitor with a sales report: the senior shoves the junior's chair away and types it done himself
                (mode "ambil"), or coaches from a chair beside her while her hands stay on the keyboard (mode "kuat")      f.alih
     _bel       two desks at night: every "TING!" of the junior's service bell makes the senior sprint over; his own paper pile grows   f.bel
     _sepeda    park: helping = teaching to ride a bike. The helper pedals with the junior on the back seat (she never learns),
                then runs behind holding the saddle rod and lets go; she rides on alone                                   f.ride
     _undangan  a giant calendar invite card flies out of the laptop: empty rows get red "?" (mode "kosong"), it flips into a
                boarding pass whose fields morph JAM->WAKTU, GERBANG->TAUTAN, TUJUAN->AGENDA (mode "tiket"), or rows type in (mode "isi")  f.inv
     _pinball   the meeting as a pinball table: face-balls ricochet between "RUANG 3?" / "LINK?" bumpers, one waits alone in the
                RUANG RAPAT pocket, a "WAKTU TERBUANG" counter runs up, TILT                                               f.pin
     _perkakas  hardware shop: pegboard of swinging tools, paint shelf, counter, door bell; a giant drill with a big price tag
                descends in a spotlight, or a small hook pack with a tiny price tag is handed over                         f.toko
     _bawang    the request is an onion: the outer skin "BOR BESAR" peels off and flies apart, the glowing core is the real need   f.onion
     _lubang    soil cross-section: debt holes with sign posts; the hero digs a new (bigger) hole and shovels the dirt into the old one;
                mode "pit": the hero stands at the bottom of a deep pit, throws the shovel out and the floor rises layer by layer   f.lubang
     _pintu     a house with a revolving front door: visitors spin out of it with requests that push the rest blocks out of the
                Sunday time bar (mode "ramai"), or one visitor gets a polite refusal and the door slows down (mode "santun")  f.door, f.day
     _roti      the polite refusal sandwich: bottom bun TERIMA KASIH, filling TIDAK BISA, top bun TAWARAN LAIN drop and squash, flag   f.roti */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221104032_";
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
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "shovel"){ ctx.fillStyle = "#9B6A3C"; rr(ctx, -9, -150, 18, 300, 8); ctx.fill(); ol(ctx, 4); rr(ctx, -34, -176, 68, 30, 10); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 4);
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
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1), dirt: h.dirt, lines: h.lines, spin: h.spin }); }));
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

  /* ================= RN33 ================= */
  function deskAt(ctx, X, top, w){ w = w || 560; const x0 = X - w * .55;
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(X - 30, GY + 4, w * .55, 20, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8E4E2E"; rr(ctx, x0 + 20, top + 10, 26, GY - top - 10, 6); ctx.fill(); ol(ctx, 4); rr(ctx, x0 + w - 46, top + 10, 26, GY - top - 10, 6); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#A9643B"; rr(ctx, x0 + w - 230, top + 20, 180, 150, 10); ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; rr(ctx, x0 + w - 160, top + 80, 40, 10, 5); ctx.fill();
    ctx.fillStyle = "#C47A48"; rr(ctx, x0, top, w, 30, 10); ctx.fill(); ol(ctx, 5); }
  function monitor(ctx, X, deskTop, t, o){
    const W = 470, Hh = 330, x0 = X - W / 2, y1 = deskTop - 46, y0 = y1 - Hh, p = clamp(o.p, 0, 1);
    ctx.fillStyle = "#3B3A3F"; rr(ctx, X - 20, y1, 40, 46, 6); ctx.fill(); rr(ctx, X - 90, deskTop - 12, 180, 14, 6); ctx.fill();
    glowAt(ctx, X, y0 + Hh / 2, 420, "#CFE7EE", .28 + (o.fast ? .12 * Math.sin(t * 20) : 0));
    rr(ctx, x0 - 16, y0 - 16, W + 32, Hh + 32, 20); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6);
    ctx.save(); rr(ctx, x0, y0, W, Hh, 8); ctx.clip(); ctx.fillStyle = "#F7FBFC"; ctx.fillRect(x0, y0, W, Hh);
    ctx.fillStyle = TEAL; ctx.fillRect(x0, y0, W, 54); textL(ctx, o.title, x0 + 18, y0 + 37, 28, "#FFFFFF", 900, W - 36);
    const rows = o.rows || ["JAN", "FEB", "MAR", "APR"], n = rows.length, wv = [.72, .48, .86, .62];
    rows.forEach((lb, i) => { const y = y0 + 68 + i * 50; textL(ctx, lb, x0 + 18, y + 30, 24, BROWN, 800);
      ctx.fillStyle = "#E3ECEF"; rr(ctx, x0 + 96, y + 10, W - 120, 30, 8); ctx.fill();
      const fl = clamp(p * n - i, 0, 1); if (fl > 0){ ctx.fillStyle = i === n - 1 ? ORANGE : "#E8A55B"; rr(ctx, x0 + 96, y + 10, Math.max(14, (W - 120) * wv[i % 4] * fl), 30, 8); ctx.fill(); }
      if (fl > 0 && fl < 1 && Math.sin(t * 12) > -.2){ ctx.fillStyle = OUT; ctx.fillRect(x0 + 100 + (W - 120) * wv[i % 4] * fl, y + 6, 4, 38); }
      if (o.ex > 0 && i === 1){ const q = eBack(clamp(o.ex / .4, 0, 1)); ctx.save(); ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = ORANGE; ctx.lineWidth = 6;
        rr(ctx, x0 + 8, y + 2, (W - 16) * q, 46, 10); ctx.stroke(); ctx.restore(); } });
    const py = y0 + Hh - 40; ctx.fillStyle = "#E3ECEF"; rr(ctx, x0 + 18, py, W - 120, 24, 12); ctx.fill();
    ctx.fillStyle = p >= 1 ? GREEN : ORANGE; rr(ctx, x0 + 18, py, Math.max(24, (W - 120) * p), 24, 12); ctx.fill();
    textL(ctx, Math.round(p * 100) + "%", x0 + W - 92, py + 22, 26, p >= 1 ? GREEN : BROWN, 900);
    if (o.stuck){ const b = .5 + .5 * Math.sin(t * 7); ctx.fillStyle = hexA(RED, .12 + .1 * b); ctx.fillRect(x0, y0 + 54, W, Hh - 54);
      ctx.save(); ctx.translate(X + 120, y0 + 150); ctx.rotate(Math.sin(t * 9) * .12); ctx.scale(1 + .08 * b, 1 + .08 * b); ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "?", 0, 26, 76, "#FFFFFF", 900); ctx.restore(); }
    ctx.restore();
    // keyboard on the desk
    rr(ctx, X - 230, deskTop - 20, 300, 24, 8); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#D9D9DE"; for (let i = 0; i < 12; i++){ const lift = o.typing && Math.sin(t * 31 + i * 2.3) > .6 ? 4 : 0; ctx.fillRect(X - 220 + i * 24, deskTop - 16 - lift, 18, 9); }
    if (o.typing){ const rate = o.fast ? 5 : 1.8; for (let i = 0; i < (o.fast ? 9 : 4); i++){ const q = (t * rate + i / (o.fast ? 9 : 4)) % 1, xx = X - 210 + rnd(i * 7 + Math.floor(t * rate + i / 9)) * 260;
      ctx.save(); ctx.globalAlpha = 1 - q; textC(ctx, "abcdefghij"[i % 10], xx, deskTop - 30 - q * 110, 34, o.fast ? ORANGE : TEAL, 900); ctx.restore(); }
      if (o.fast){ ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 5; ctx.lineCap = "round"; for (let i = 0; i < 4; i++){ const yy = deskTop - 40 - i * 22, a = (t * 9 + i) % 1; ctx.beginPath(); ctx.moveTo(X - 300 - a * 40, yy); ctx.lineTo(X - 250 - a * 40, yy); ctx.stroke(); } } }
    return { cx: X, cy: y0 + Hh / 2 };
  }
  TT.scene(PX + "alih", "Cerita: kursi digeser, pekerjaan diambil alih / dibimbing", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, A = Object.assign({ x: 760, mode: "ambil", title: "LAPORAN PENJUALAN", p0: .2, stamp: "BERES!" }, f.alih || {});
    const tType = T(s, A.typeCue, .5, idx), tDone = T(s, A.doneCue, .6, idx), tEx = T(s, A.exCue, .5, idx), tGrab = T(s, A.grabCue, .3, idx), tStuck = A.stuckCue ? T(s, A.stuckCue, .3, idx) : .2;
    const deskTop = GY - 230, amb = A.mode === "ambil";
    let p = A.p0; if (amb) p = t < tType ? A.p0 : lerp(A.p0, 1, eOut(ramp(t, tType, Math.min(tDone - .1, tType + 2.4))));
    else { p = lerp(A.p0, .6, ramp(t, tType, tType + 3.2)); if (t > tDone - 1.6) p = lerp(.6, 1, ramp(t, tDone - 1.6, tDone)); }
    const typing = amb ? (t >= tType && t < tDone + .2) : (t >= tType && p < 1), stuck = t >= tStuck && t < (amb ? tGrab : tType);
    let mon = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 110 },
      spots: { screen: [A.x - 40, deskTop - 230, 1.3], desk: [A.x - 200, deskTop - 120, 1.05] },
      back: () => { deskAt(ctx, A.x, deskTop, 600); mon = monitor(ctx, A.x, deskTop, t, { title: A.title, p, stuck, typing, fast: amb && typing, ex: t - tEx }); },
      over: (ctx2, c) => { if (!mon) return; const sc = c.toScreen(mon.cx, mon.cy);
        if (A.exTag && t >= tEx) popChip(ctx, A.exTag, sc[0] - 60, sc[1] - 150 * c.zoom, t - tEx, ORANGE, "#FFFFFF", 34, -.06);
        if (t >= tDone) { stampBox(ctx, A.stamp, sc[0], sc[1], t - tDone, amb ? ORANGE : GREEN, 70, -.1); burstFx(ctx, sc[0], sc[1], t - tDone - .1, amb ? HL : GREEN, 12, 260); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.alih || {}; if (A.grabCue) add(cueT(s, A.grabCue, .3, i), "whoosh"); if (A.typeCue) add(cueT(s, A.typeCue, .5, i), "whoosh");
    if (A.exCue) add(cueT(s, A.exCue, .5, i), "pop"); if (A.doneCue) add(cueT(s, A.doneCue, .6, i) + .05, "chime"); });

  /* ================= _bel: service bell summons ================= */
  TT.scene(PX + "bel", "Cerita: bel panggilan, tumpukan kerja senior", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ L: 270, R: 830, ds: .8 }, f.bel || {});
    const rings = (B.rings || []).map((cu, j) => T(s, cu, .3 + j * .05, idx)), nR = rings.filter(r => t >= r).length, lastR = rings.filter(r => t >= r).pop() ?? -9;
    const tPile = T(s, B.pileCue, .3, idx), tPaper = T(s, B.paperCue, .4, idx), tNo = T(s, B.noCue, .5, idx);
    const top = GY - 290 * B.ds, bellX = B.L + 140, pileX = B.R - (B.pileDx ?? 190);
    const sheets = Math.round(4 + nR * 5 + 16 * eOut(ramp(t, tPile, tPile + 1.6)));
    base(ctx, s, t, { env: "office", envOpt: { desk: false, time: "night", plantX: 990 },
      spots: { bell: [bellX, top - 120, 1.25], pile: [pileX, top - 260, 1.1] },
      front: () => {
        prop(ctx, "desk", B.L, GY, { s: B.ds, laptop: true, lx: -60 }, t); prop(ctx, "desk", B.R, GY, { s: B.ds, laptop: true, lx: 60 }, t);
        // incoming report sheet
        if (t >= tPaper - .7){ const q = clamp((t - tPaper + .7) / .7, 0, 1), e = eOut(q), x = lerp(-200, B.L - 90, e), y = lerp(500, top - 14, e) - Math.sin(q * Math.PI) * 180;
          ctx.save(); ctx.translate(x, y); ctx.rotate((1 - q) * 3); rr(ctx, -70, -12, 140, 20, 4); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.restore();
          if (q >= 1) popChip(ctx, "LAPORAN", B.L - 90, top - 60, t - tPaper, PAPER, BROWN, 28, -.05); }
        // bell
        const rk = t - lastR, bq = rk >= 0 && rk < .5 ? Math.sin(rk * 40) * (1 - rk / .5) : 0;
        ctx.save(); ctx.translate(bellX, top - 6); ctx.scale(1 + bq * .06, 1 - bq * .08);
        rr(ctx, -64, -14, 128, 18, 6); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.arc(0, -14, 52, Math.PI, 0); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = hexA("#FFFFFF", .6); ctx.beginPath(); ctx.ellipse(-20, -40, 10, 18, -.5, 0, TAU); ctx.fill();
        ctx.fillStyle = "#9AA6B2"; rr(ctx, -8, -86 + (rk >= 0 && rk < .15 ? 12 : 0), 16, 22, 5); ctx.fill(); ol(ctx, 3); ctx.restore();
        if (rk >= 0 && rk < .9){ ctx.save(); ctx.strokeStyle = GOLD; ctx.lineCap = "round"; for (let r = 0; r < 3; r++){ const w = (rk * 1.8 + r / 3) % 1; ctx.globalAlpha = 1 - w; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(bellX, top - 50, 80 + w * 90, -2.6, -.55); ctx.stroke(); } ctx.restore(); }
        if (nR > 0) popChip(ctx, "×" + nR, bellX + 95, top - 120, t - lastR, RED, "#FFFFFF", 40, .1);
        // paper pile on the senior's desk
        const sway = Math.sin(t * 2.6) * Math.min(.06, sheets * .0016);
        ctx.save(); ctx.translate(pileX, top - 8); ctx.rotate(sway);
        for (let i = 0; i < sheets; i++){ const dx = (rnd(i + 2) - .5) * 26, dropK = 1; ctx.fillStyle = i % 2 ? PAPER : "#F3E6D2"; rr(ctx, -80 + dx, -14 - i * 13, 160, 13, 3); ctx.fill(); ctx.strokeStyle = hexA(OUT, .55); ctx.lineWidth = 2.5; ctx.stroke(); }
        const ph = -14 - sheets * 13; if (B.pileTag){ ctx.translate(0, ph - 40); ctx.rotate(-sway * 2); chip(ctx, B.pileTag, 0, 0, ORANGE, "#FFFFFF", 28); }
        ctx.restore();
        if (t > tPile){ for (let i = 0; i < 4; i++){ const q = ((t - tPile) * .9 + i / 4) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * .8; ctx.translate(pileX + (rnd(i) - .5) * 160, top - 30 - sheets * 13 - 80 - q * 200); ctx.rotate(q * 4 + i);
          rr(ctx, -40, -8, 80, 16, 3); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); ctx.restore(); } }
      },
      over: (ctx2, c, sts) => { const rk = t - lastR; if (rk >= 0 && rk < .9){ const p = c.toScreen(bellX, top - 150); popWord(ctx, "TING!", p[0], p[1], rk, { size: 84, rot: -8, hold: .9 }); }
        if (t >= tNo && sts[B.no ?? 0]){ const h = toonHead(sts[B.no ?? 0]), p = c.toScreen(h[0], h[1] - sts[B.no ?? 0].size * .32 + 100); popChip(ctx, B.noText || "BELUM BISA", p[0], p[1], t - tNo, RED, "#FFFFFF", 40, -.06); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.bel || {}; (B.rings || []).forEach((cu, j) => { const t0 = cueT(s, cu, .3 + j * .05, i); add(t0, "ping"); add(t0 + .18, "ping"); });
    if (B.paperCue) add(cueT(s, B.paperCue, .4, i), "whoosh"); if (B.noCue) add(cueT(s, B.noCue, .5, i), "pop"); if (B.pileCue) add(cueT(s, B.pileCue, .3, i), "whoosh"); });

  /* ================= _sepeda: teaching to ride a bike ================= */
  function bike(ctx, x, y, t, o){ o = o || {}; const r = 92, wb = 175, rot = o.rot || 0, dist = o.dist || 0, a = dist / r;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    const wheel = cx => { ctx.save(); ctx.translate(cx, -r); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = "#4A4A52"; ctx.lineWidth = 9; ctx.stroke();
      ctx.rotate(a); ctx.strokeStyle = "#B9B9C2"; ctx.lineWidth = 3; for (let k = 0; k < 8; k++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(k * TAU / 8) * (r - 8), Math.sin(k * TAU / 8) * (r - 8)); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fillStyle = "#4A4A52"; ctx.fill(); ctx.restore(); };
    wheel(-wb); wheel(wb);
    const col = o.col || RED, P = (px, py) => [px, py];
    const rearH = P(-wb, -r), crank = P(-10, -r + 6), seatP = P(-70, -r - 150), headP = P(wb - 40, -r - 175), frontH = P(wb, -r);
    ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const tube = (pts, w) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(q => ctx.lineTo(q[0], q[1])); ctx.strokeStyle = OUT; ctx.lineWidth = w + 8; ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); };
    tube([rearH, crank, seatP, rearH], 16); tube([crank, headP, seatP], 16); tube([headP, frontH], 14);
    // rear carrier
    if (o.carrier !== false) tube([P(-wb - 20, -r - 108), P(-100, -r - 108)], 12);
    // handlebar
    tube([headP, P(wb - 70, -r - 235), P(wb - 20, -r - 240)], 12);
    // saddle
    rr(ctx, seatP[0] - 58, seatP[1] - 22, 110, 26, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4);
    // pedal crank
    const ca = a * 1.6; ctx.save(); ctx.translate(crank[0], crank[1]); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(Math.cos(ca) * -46, Math.sin(ca) * -46); ctx.lineTo(Math.cos(ca) * 46, Math.sin(ca) * 46); ctx.stroke(); ctx.restore();
    // push rod for learning
    if (o.rod) tube([seatP, P(seatP[0] - 70, seatP[1] - 60), P(seatP[0] - 150, seatP[1] - 70)], 10);
    ctx.restore();
    return { seat: [x + seatP[0], y + seatP[1]], rodEnd: [x + seatP[0] - 150, y + seatP[1] - 70], carrier: [x - 140, y - r - 108] }; }
  TT.scene(PX + "sepeda", "Cerita: mengajari naik sepeda (bonceng / pegang sadel lalu lepas)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rd = Object.assign({ p1: [-150, 900], p2: [-100, 500, 1300], size: 600 }, f.ride || {});
    const tHold = T(s, Rd.holdCue, .2, idx), tLet = T(s, Rd.letCue, .35, idx), tEnd = (TL.scenes[idx] ? TL.scenes[idx].end - TL.scenes[idx].start : 12);
    const ph2 = t >= tHold;
    const bx = !ph2 ? lerp(Rd.p1[0], Rd.p1[1], easeIO(ramp(t, .1, tHold - .1)))
      : (t < tLet ? lerp(Rd.p2[0], Rd.p2[1], easeIO(ramp(t, tHold, tLet))) : lerp(Rd.p2[1], Rd.p2[2], ramp(t, tLet, tEnd + .5)));
    const dist = !ph2 ? bx - Rd.p1[0] : bx - Rd.p2[0] + 3000;
    const wob = ph2 && t < tLet ? Math.sin(t * 6.5) * .05 + Math.sin(t * 2.3) * .03 : (ph2 ? Math.sin(t * 2) * .006 * Math.max(0, 1 - (t - tLet)) : 0);
    const A = Rd.helper || {}, Bq = Rd.learner || {}, sz = Rd.size, k = sz / 92;
    // camera follows the bike
    const camKeys = (f.cam || []).length ? f.cam : [{ at: 0, x: 540, y: 1180, zoom: 1 }];
    const c = cam(s, t, camKeys, { resolve: (on, tt, kk) => on === "bike" ? [bx + (kk.dx || 0), 1180 + (kk.dy || 0), kk.zoom ?? null] : null });
    const followX = ph2 && t >= tLet ? lerp(Rd.p2[1] - 80, bx - 140, clamp((t - tLet) / 1.2, 0, 1)) : bx - (ph2 ? 90 : 0) + 20;
    const C = Object.assign(Object.create(Object.getPrototypeOf(c)), c); C.x = followX + (c.x - 540); C.zoom = c.zoom;
    env(ctx, "park", t, C, Object.assign({ treeX: 150 }, f.envOpt || {}));
    const gy = GY;
    let geo = null;
    // draw bike (rotated about its contact point)
    layer(ctx, C, 1, () => { ctx.save(); ctx.translate(bx, gy); ctx.rotate(wob); ctx.translate(-bx, -gy); geo = bike(ctx, bx, gy, t, { dist, rod: ph2, col: Rd.col || RED }); ctx.restore(); });
    const rot = (x, y) => { const dx = x - bx, dy = y - gy, cs = Math.cos(wob), sn = Math.sin(wob); return [bx + dx * cs - dy * sn, gy + dx * sn + dy * cs]; };
    const seat = rot(geo.seat[0], geo.seat[1]), carr = rot(geo.carrier[0], geo.carrier[1]), rodE = rot(geo.rodEnd[0], geo.rodEnd[1]);
    const strip = a => Object.assign({}, a, { keys: (a.keys || []).filter(kk => kk.x == null) });
    const draw = (a, x, y, extra) => toon(ctx, C, Object.assign(strip(a), { x, y, size: sz, shadow: false }, extra || {}), s, t);
    if (!ph2){
      draw(Bq, carr[0] + 2 * k, carr[1] + 13 * k, { pose: "sit", face: 1, keys: (Bq.keys1 || []) });
      draw(A, seat[0] + 4 * k, seat[1] + 13 * k, { pose: "sit", face: 1, keys: (A.keys1 || []) });
    } else {
      const rx = t < tLet ? rodE[0] - 22 * k : Rd.p2[1] - 190;
      const runner = Object.assign(strip(A), { size: sz * 1.12, face: 1, keys: [{ at: 0, pose: "hold" }].concat(A.keys2 || []) });
      const stR = toonState(Object.assign({}, runner, { x: rx }), s, t);
      if (t < tLet){ stR.moving = true; stR.run = true; stR.moveT = t - tHold; }
      toon(ctx, C, Object.assign({}, runner, { x: rx }), s, t, { st: Object.assign(stR, { x: rx, size: sz * 1.12 }) });
      layer(ctx, C, 1, () => { if (t < tLet){ const hp = lp(stR, 23, -47); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hp[0], hp[1]); ctx.lineTo(rodE[0], rodE[1]); ctx.stroke(); } });
      draw(Bq, seat[0] + 4 * k, seat[1] + 13 * k, { pose: "sit", face: 1, keys: (Bq.keys2 || []) });
      if (t >= tLet) layer(ctx, C, 1, () => { for (let i = 0; i < 5; i++){ const q = ((t - tLet) * 1.4 + i / 5) % 1; ctx.save(); ctx.globalAlpha = .6 * (1 - q); ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(bx - 300 - q * 160, gy - 120 - i * 40); ctx.lineTo(bx - 220 - q * 160, gy - 120 - i * 40); ctx.stroke(); ctx.restore(); } });
    }
    envFront(ctx, "park", t, C, { front: false });
    if (ph2 && t - tHold < .35){ TT.CS.ov.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - tHold) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }); }
    TT.CS.ov.push(() => { (f.pops || []).forEach((p, j) => popWord(ctx, p.text, p.x ?? 540, p.y ?? 560, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.4, col: p.col }));
      if (Rd.wobText && ph2 && t < tLet){ const sc = C.toScreen(seat[0], seat[1] - 520); popChip(ctx, Rd.wobText, sc[0], sc[1], t - tHold - .3, GOLD, BROWN, 36, Math.sin(t * 6.5) * .06); }
      if (Rd.noText && !ph2){ const tn = T(s, Rd.noCue, .4, idx), sc = C.toScreen(carr[0], carr[1] - 560); if (t >= tn) popChip(ctx, Rd.noText, sc[0], sc[1], t - tn, RED, "#FFFFFF", 36, -.06); } });
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
  }, (s, f, i, add) => { const Rd = f.ride || {}; add(.2, "whoosh"); if (Rd.holdCue) add(cueT(s, Rd.holdCue, .2, i), "whoosh"); if (Rd.letCue) add(cueT(s, Rd.letCue, .35, i), "chime");
    (f.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop")); (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
    [Rd.helper, Rd.learner].forEach(a => a && [].concat(a.keys1 || [], a.keys2 || []).forEach((k, j) => { const t0 = k.at != null ? k.at : cueT(s, k.cue, .1 + j * .12, i); if (k.say) add(t0, "pop"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "sparkle") add(t0, "chime"); })); });

  /* ================= KD33: calendar invite card / boarding pass ================= */
  function calGlyph(ctx, x, y, s){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -30, -26, 60, 56, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = RED; rr(ctx, -30, -26, 60, 18, 8); ctx.fill(); ctx.fillStyle = OUT; ctx.fillRect(-16, -34, 6, 14); ctx.fillRect(10, -34, 6, 14); textC(ctx, "33", 0, 22, 26, BROWN, 900); ctx.restore(); }
  function planeGlyph(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col || "#FFFFFF"; ctx.beginPath();
    ctx.moveTo(-40, 4); ctx.lineTo(30, 4); ctx.quadraticCurveTo(46, 0, 30, -4); ctx.lineTo(-40, -4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(-22, -34); ctx.lineTo(-10, -34); ctx.lineTo(14, 0); ctx.lineTo(-10, 34); ctx.lineTo(-22, 34); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(-46, -16); ctx.lineTo(-40, -16); ctx.lineTo(-28, 0); ctx.lineTo(-40, 16); ctx.lineTo(-46, 16); ctx.closePath(); ctx.fill(); ctx.restore(); }
  const ROWICON = { waktu: "clock", tautan: "link", agenda: "book", bahan: "file" };
  function typed(txt, k, cps){ if (k < 0) return ""; const n = Math.floor(k * (cps || 22)); return String(txt).slice(0, n); }
  function invCard(ctx, cx, cy, t, o){ // o: title, titleK, rows [{key,label,val,k (typed since), miss (k since ?)}], w
    const W = o.w || 620, rowH = 104, Hh = 140 + o.rows.length * rowH, x0 = cx - W / 2, y0 = cy - Hh / 2;
    ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, x0 + 12, y0 + 16, W, Hh, 26); ctx.fill();
    rr(ctx, x0, y0, W, Hh, 26); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
    ctx.save(); rr(ctx, x0, y0, W, 112, 26); ctx.clip(); ctx.fillStyle = ORANGE; ctx.fillRect(x0, y0, W, 112); ctx.restore(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y0 + 112); ctx.lineTo(x0 + W, y0 + 112); ctx.stroke();
    calGlyph(ctx, x0 + 62, y0 + 58, 1.1);
    const tt = typed(o.title, o.titleK ?? 9, 14); textL(ctx, tt + ((o.titleK ?? 9) < 1.2 && Math.sin(t * 12) > 0 ? "|" : ""), x0 + 118, y0 + 74, 50, "#FFFFFF", 900, W - 150);
    o.rows.forEach((r, i) => { const y = y0 + 130 + i * rowH, shake = r.miss != null && r.miss >= 0 && r.miss < .6 ? Math.sin(r.miss * 50) * 8 * (1 - r.miss / .6) : 0;
      ctx.save(); ctx.translate(shake, 0);
      ctx.beginPath(); ctx.arc(x0 + 62, y + 46, 34, 0, TAU); ctx.fillStyle = r.ok ? hexA(GREEN, .18) : "#F1E6D6"; ctx.fill();
      icon(ctx, ROWICON[r.key] || "clock", x0 + 62 - 20, y + 26, 40, r.ok ? GREEN : BROWN, 2.4);
      textL(ctx, r.label, x0 + 116, y + 30, 24, "#9A7B62", 800);
      const v = r.k != null ? typed(r.val, r.k, 20) : (r.val || "");
      if (v){ textL(ctx, v + (r.k != null && r.k < r.val.length / 20 + .2 && Math.sin(t * 12) > 0 ? "|" : ""), x0 + 116, y + 74, 38, BROWN, 900, W - 150); }
      else { ctx.save(); ctx.setLineDash([16, 12]); ctx.strokeStyle = "#C9B59C"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0 + 116, y + 66); ctx.lineTo(x0 + W - 120, y + 66); ctx.stroke(); ctx.restore(); }
      if (r.miss != null && r.miss >= 0){ const q = eBack(clamp(r.miss / .35, 0, 1)), b = 1 + .06 * Math.sin(t * 8 + i); ctx.save(); ctx.translate(x0 + W - 66, y + 46); ctx.scale(q * b, q * b); ctx.rotate(Math.sin(t * 5 + i) * .12);
        ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "?", 0, 20, 54, "#FFFFFF", 900); ctx.restore(); }
      if (r.ok){ ctx.save(); ctx.translate(x0 + W - 66, y + 46); const q = eBack(clamp(r.okK / .35, 0, 1)); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5);
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-3, 12); ctx.lineTo(16, -12); ctx.stroke(); ctx.restore(); }
      if (i < o.rows.length - 1){ ctx.strokeStyle = "#EFE3D2"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + 30, y + rowH - 6); ctx.lineTo(x0 + W - 30, y + rowH - 6); ctx.stroke(); }
      ctx.restore(); });
    return { x0, y0, W, Hh }; }
  function ticket(ctx, cx, cy, t, o){ // o: rows [{trav:{label,val,k}, mt:{label,val,k}}], head
    const W = 820, Hh = 470, x0 = cx - W / 2, y0 = cy - Hh / 2, stubX = x0 + W - 190;
    ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, x0 + 12, y0 + 16, W, Hh, 24); ctx.fill();
    ctx.save(); ctx.beginPath(); rr(ctx, x0, y0, W, Hh, 24); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
    ctx.save(); rr(ctx, x0, y0, W, 100, 24); ctx.clip(); ctx.fillStyle = TEAL; ctx.fillRect(x0, y0, W, 100); ctx.restore();
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y0 + 100); ctx.lineTo(x0 + W, y0 + 100); ctx.stroke();
    planeGlyph(ctx, x0 + 64, y0 + 52, 1.05, "#FFFFFF"); textL(ctx, o.head || "TIKET RAPAT", x0 + 124, y0 + 68, 46, "#FFFFFF", 900, 460);
    // perforation + stub
    ctx.save(); ctx.setLineDash([10, 12]); ctx.strokeStyle = "#B9A58E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(stubX, y0 + 110); ctx.lineTo(stubX, y0 + Hh - 10); ctx.stroke(); ctx.restore();
    [y0 + 100, y0 + Hh].forEach(yy => { ctx.beginPath(); ctx.arc(stubX, yy, 18, 0, TAU); ctx.fillStyle = hexA("#000000", .18); ctx.fill(); });
    for (let i = 0; i < 16; i++){ ctx.fillStyle = BROWN; ctx.fillRect(stubX + 32 + i * 8, y0 + 300, (i * 7 % 3) + 3, 120); }
    textC(ctx, o.stub || "KURSI 7A", stubX + 95, y0 + 180, 32, BROWN, 900, 160); textC(ctx, "BOARDING", stubX + 95, y0 + 240, 24, "#9A7B62", 800, 160);
    o.rows.forEach((r, i) => { const y = y0 + 118 + i * 116, m = r.mt && r.mt.k != null && r.mt.k >= 0, q = m ? clamp(r.mt.k / .45, 0, 1) : 0;
      const cur = q > .5 ? r.mt : r.trav, fl = Math.abs(Math.cos(q * Math.PI));
      if (!cur || cur.k == null || cur.k < 0) { ctx.fillStyle = "#EFE3D2"; rr(ctx, x0 + 34, y + 20, stubX - x0 - 70, 72, 12); ctx.fill(); return; }
      ctx.save(); ctx.translate(0, y + 56); ctx.scale(1, m ? Math.max(.06, fl) : eBack(clamp(cur.k / .35, 0, 1))); ctx.translate(0, -(y + 56));
      rr(ctx, x0 + 34, y + 12, stubX - x0 - 70, 92, 12); ctx.fillStyle = m && q > .5 ? hexA(ORANGE, .14) : "#F6EEE2"; ctx.fill(); ctx.strokeStyle = m && q > .5 ? ORANGE : "#E3D3BD"; ctx.lineWidth = 4; ctx.stroke();
      if (m && q > .5) icon(ctx, ROWICON[r.key] || "clock", x0 + 52, y + 36, 44, ORANGE, 2.6); else planeGlyph(ctx, x0 + 76, y + 58, .5, TEAL);
      textL(ctx, cur.label, x0 + 120, y + 44, 24, m && q > .5 ? ORANGE : "#9A7B62", 900);
      textL(ctx, cur.val, x0 + 120, y + 88, 38, BROWN, 900, stubX - x0 - 170);
      ctx.restore(); });
    ctx.restore(); return { x0, y0, W, Hh }; }
  TT.scene(PX + "undangan", "Cerita: undangan kalender (kosong / tiket / diisi)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, I = Object.assign({ mode: "kosong", x: 690, y: 760, title: "Rapat" }, f.inv || {});
    const tSend = I.sendCue ? T(s, I.sendCue, .4, idx) : -1, tTitle = I.titleCue ? T(s, I.titleCue, .1, idx) : tSend + .5, tFlip = T(s, I.flipCue, .2, idx);
    const rows = (I.rows || []).map((r, j) => { const o = Object.assign({}, r); if (r.cue) o.k = t - T(s, r.cue, .15, idx); else if (r.val) o.k = null;
      if (r.missCue) o.miss = t - T(s, r.missCue, .3, idx); if (r.okCue){ const tk = T(s, r.okCue, .6, idx); o.ok = t >= tk; o.okK = t - tk; } if (o.miss != null && o.ok) o.miss = null; return o; });
    const trows = (I.trows || []).map(r => ({ key: r.key, trav: { label: r.trav[0], val: r.trav[1], k: t - T(s, r.travCue, .2, idx) }, mt: { label: r.mt[0], val: r.mt[1], k: t - T(s, r.mtCue, .2, idx) } }));
    let box = null, cardPos = [I.x, I.y], cardS = 1, cardRot = 0;
    base(ctx, s, t, { env: "office", spots: { card: () => [I.x, I.y, 1.12] },
      front: (ctx2, c, sts) => {
        if (I.plane){ const q = ((t * .09) % 1), px = lerp(-200, 1300, q), py = I.plane - Math.sin(q * 3) * 40; ctx.save(); ctx.globalAlpha = .9;
          ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(px - 60, py); ctx.lineTo(px - 420, py + 30); ctx.stroke(); planeGlyph(ctx, px, py, 1.6, "#FFFFFF"); ctx.restore(); }
        if (tSend >= 0 && t < tSend) return;
        if (tSend >= 0){ const q = clamp((t - tSend) / .7, 0, 1), e = eOut(q), st = sts[I.from ?? 0], h = st ? handOf(st) : [200, 1300];
          cardPos = [lerp(h[0], I.x, e), lerp(h[1], I.y, e) - Math.sin(q * Math.PI) * 260]; cardS = .12 + .88 * eBack(q); cardRot = (1 - e) * -1.4; }
        cardPos[1] += Math.sin(t * 1.6) * 8; cardRot += Math.sin(t * 1.1) * .015;
        if (t - tSend > .5 && t - tSend < 1.4 && tSend >= 0) burstFx(ctx, I.x, I.y, t - tSend - .5, HL, 10, 360);
        ctx.save(); ctx.translate(cardPos[0], cardPos[1]); ctx.rotate(cardRot);
        if (I.mode === "tiket" && t >= tFlip){ const q = clamp((t - tFlip) / .55, 0, 1), sx = Math.abs(Math.cos(q * Math.PI));
          ctx.scale(cardS * Math.max(.02, sx) * (q > .5 ? 1 : 1), cardS);
          if (q < .5) box = invCard(ctx, 0, 0, t, { title: I.title, rows, w: I.w });
          else box = ticket(ctx, 0, 0, t, { rows: trows, head: I.head, stub: I.stub });
          if (q > .2 && q < .8) { ctx.globalAlpha = .5; glowAt(ctx, 0, 0, 500, "#FFFFFF", .6); } }
        else { ctx.scale(cardS, cardS); box = invCard(ctx, 0, 0, t, { title: I.title, titleK: t - tTitle, rows, w: I.w }); }
        ctx.restore(); },
      over: (ctx2, c) => { if (I.stampCue){ const ts = T(s, I.stampCue, .6, idx); if (t >= ts){ const p = c.toScreen(cardPos[0], cardPos[1] + (box ? box.Hh / 2 - 30 : 200)); stampBox(ctx, I.stampText || "LENGKAP", p[0] + 140, p[1], t - ts, I.stampCol === "red" ? RED : GREEN, 60, -.12); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const I = f.inv || {}; if (I.sendCue) add(cueT(s, I.sendCue, .4, i), "whoosh"); if (I.flipCue) add(cueT(s, I.flipCue, .2, i), "whoosh");
    (I.rows || []).forEach(r => { if (r.missCue) add(cueT(s, r.missCue, .3, i), "ping"); if (r.cue) add(cueT(s, r.cue, .15, i), "pop"); if (r.okCue) add(cueT(s, r.okCue, .6, i), "chime"); });
    (I.trows || []).forEach(r => { if (r.travCue) add(cueT(s, r.travCue, .2, i), "pop"); if (r.mtCue) add(cueT(s, r.mtCue, .2, i), "chime"); }); if (I.stampCue) add(cueT(s, I.stampCue, .6, i) + .1, "pop"); });

  /* ================= _pinball: the meeting as a pinball table ================= */
  const TB = { x0: 110, x1: 970, y0: 250, y1: 1200 };
  function pathPos(pts, d){ for (let i = 1; i < pts.length; i++){ const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= L) { const q = L ? d / L : 0; return [lerp(a[0], b[0], q), lerp(a[1], b[1], q), b[0] - a[0], b[1] - a[1], i]; } d -= L; }
    const z = pts[pts.length - 1]; return [z[0], z[1], 0, 0, pts.length]; }
  function chaosPath(seed, bumps){ const pts = [[930, 1150], [930, 420], [860, 320]]; let last = -1;
    for (let i = 0; i < 46; i++){ const r = rnd(seed * 31 + i * 7.3); let p;
      if (r < .62){ let j = Math.floor(rnd(seed * 13 + i * 3.1) * bumps.length); if (j === last) j = (j + 1) % bumps.length; last = j; const b = bumps[j], a = rnd(seed + i) * TAU; p = [b.x + Math.cos(a) * 95, b.y + Math.sin(a) * 95]; }
      else if (r < .81) p = [r < .72 ? 160 : 840, 420 + rnd(seed * 5 + i) * 620]; else p = [260 + rnd(seed * 9 + i) * 560, 1040 + rnd(i + seed) * 50];
      pts.push(p); } return pts; }
  function faceBall(ctx, x, y, r, o, t){ ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(6, r * .9, r * .8, r * .25, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = o.skin; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = o.hair; if (o.hijab){ ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.arc(0, r * .12, r * .66, 0, TAU, true); ctx.fill(); } else { ctx.beginPath(); ctx.ellipse(0, -r * .7, r * 1.05, r * .62, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = hexA("#FFFFFF", .35); ctx.beginPath(); ctx.ellipse(-r * .4, -r * .45, r * .25, r * .14, -.6, 0, TAU); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ol(ctx, 5);
    const lx = (o.lx || 0) * r * .12, ly = (o.ly || 0) * r * .12;
    if (o.sleep){ ctx.strokeStyle = OUT; ctx.lineWidth = 4; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * r * .3, r * .08, r * .13, .1 * Math.PI, .9 * Math.PI); ctx.stroke(); }); }
    else [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * r * .3, r * .02, r * .17, r * .21, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(d * r * .3 + lx, r * .04 + ly, r * (o.dizzy ? .05 : .09), 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.beginPath(); if (o.mouth === "O"){ ctx.ellipse(0, r * .45, r * .12, r * .15, 0, 0, TAU); ctx.fillStyle = "#7A2E22"; ctx.fill(); } else if (o.mouth === "smile"){ ctx.arc(0, r * .3, r * .22, .15 * Math.PI, .85 * Math.PI); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); }
    else { ctx.moveTo(-r * .18, r * .46); ctx.lineTo(r * .18, r * .42); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); }
    ctx.restore();
    if (o.name){ font(ctx, 900, 26, FAM); const w = ctx.measureText(o.name).width + 24; rr(ctx, x - w / 2, y - r - 46, w, 36, 18); ctx.fillStyle = o.tag || ORANGE; ctx.fill(); ol(ctx, 3); textC(ctx, o.name, x, y - r - 19, 26, "#FFFFFF", 900); } }
  TT.scene(PX + "pinball", "Cerita: meja pinball rapat (bola wajah tersesat)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Pn = Object.assign({}, f.pin || {});
    const bumps = Pn.bumpers || [{ x: 380, y: 620, label: "R. 3?" }, { x: 700, y: 560, label: "LINK?" }, { x: 560, y: 860, label: "JAM?" }, { x: 330, y: 1000, label: "AGENDA?" }, { x: 780, y: 940, label: "ZOOM?" }];
    const pocket = Object.assign({ x: 250, y: 500, label: "RUANG RAPAT" }, Pn.pocket || {});
    const tCnt = T(s, Pn.countCue, .2, idx), tFast = T(s, Pn.fastCue, .1, idx), tTilt = T(s, Pn.tiltCue, .4, idx), tAlone = T(s, Pn.aloneCue, .4, idx);
    const minutes = Math.round(t < tCnt ? 0 : (t < tFast ? lerp(0, 7, ramp(t, tCnt, tFast)) : lerp(7, Pn.to || 15, eOut(ramp(t, tFast, tFast + 1.2)))));
    const balls = (Pn.balls || []).map((b, j) => { const T0 = T(s, b.cue, .3, idx), pts = b.pocket ? [[930, 1150], [930, 420], [700, 300], [pocket.x + 60, pocket.y + 10], [pocket.x, pocket.y + 30]] : chaosPath(j + 3, bumps);
      const d = Math.max(0, t - T0) * (b.pocket ? 1100 : 1250), P = pathPos(pts, d); return Object.assign({ T0, P, done: b.pocket && P[4] >= pts.length }, b); });
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 820, zoom: 1.02 }], { shake: Pn.tiltCue ? [{ cue: Pn.tiltCue, amp: 22, sdur: .8 }] : [] });
    env(ctx, "info", t, c, { spotX: 540 });
    layer(ctx, c, 1, () => {
      const { x0, x1, y0, y1 } = TB;
      // cabinet
      rr(ctx, x0 - 46, y0 - 70, x1 - x0 + 92, y1 - y0 + 130, 60); ctx.fillStyle = "#7A3E1E"; ctx.fill(); ol(ctx, 8);
      rr(ctx, x0 - 30, y0 - 56, x1 - x0 + 60, y1 - y0 + 100, 52); ctx.fillStyle = ORANGE; ctx.fill();
      const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, "#1C2E52"); g.addColorStop(1, "#0D1A33");
      ctx.save(); rr(ctx, x0, y0, x1 - x0, y1 - y0, 40); ctx.fillStyle = g; ctx.fill(); ctx.clip();
      for (let yy = y0 + 30; yy < y1; yy += 60) for (let xx = x0 + 30; xx < x1; xx += 60){ ctx.fillStyle = hexA("#7FB7FF", .08 + .06 * Math.sin(t * 2 + xx * .02 + yy * .03)); ctx.beginPath(); ctx.arc(xx, yy, 4, 0, TAU); ctx.fill(); }
      // launch lane
      ctx.strokeStyle = hexA("#FFFFFF", .35); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(885, 1190); ctx.lineTo(885, 470); ctx.quadraticCurveTo(885, 290, 700, 280); ctx.stroke();
      for (let i = 0; i < 5; i++){ const q = (t * .8 + i / 5) % 1; ctx.fillStyle = hexA(GOLD, .7 * (1 - q)); ctx.beginPath(); ctx.moveTo(930, 1120 - i * 140 - 20); ctx.lineTo(950, 1120 - i * 140); ctx.lineTo(910, 1120 - i * 140); ctx.fill(); }
      ctx.restore();
      ctx.save(); rr(ctx, x0, y0, x1 - x0, y1 - y0, 40); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
      // pocket
      const pk = t - tAlone; rr(ctx, pocket.x - 110, pocket.y - 40, 220, 120, 30); ctx.fillStyle = "#081226"; ctx.fill(); ctx.strokeStyle = pk > 0 ? GOLD : "#7FB7FF"; ctx.lineWidth = 6; ctx.stroke();
      chip(ctx, pocket.label, pocket.x, pocket.y + 120, TEAL, "#FFFFFF", 28);
      // bumpers
      bumps.forEach((b, j) => { let hit = 0; balls.forEach(bl => { if (t >= bl.T0 && !bl.done){ const dd = Math.hypot(bl.P[0] - b.x, bl.P[1] - b.y); if (dd < 150) hit = Math.max(hit, 1 - dd / 150); } });
        const pul = .5 + .5 * Math.sin(t * 3 + j); glowAt(ctx, b.x, b.y, 150 + hit * 60, j % 2 ? "#FF7A59" : "#59C3FF", .25 + .5 * hit);
        ctx.save(); ctx.translate(b.x, b.y); ctx.scale(1 + hit * .18, 1 + hit * .18);
        ctx.beginPath(); ctx.arc(0, 0, 74, 0, TAU); ctx.fillStyle = j % 2 ? RED : "#2F8FD8"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.arc(0, 0, 56, 0, TAU); ctx.fillStyle = hit > .3 ? "#FFFFFF" : CREAM; ctx.fill(); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; ctx.stroke();
        textC(ctx, b.label, 0, 10, 30, BROWN, 900, 100); ctx.restore();
        if (hit > .75) { for (let k = 0; k < 6; k++){ const a = k / 6 * TAU + t * 4; ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(b.x + Math.cos(a) * 92, b.y + Math.sin(a) * 92); ctx.lineTo(b.x + Math.cos(a) * 118, b.y + Math.sin(a) * 118); ctx.stroke(); } } });
      // flippers
      [[350, 1110, 1], [730, 1110, -1]].forEach(([fx, fy, d], j) => { const kick = Math.max(0, Math.sin(t * 4.2 + j * 1.7)) ** 6; ctx.save(); ctx.translate(fx, fy); ctx.rotate(d * (.42 - kick * .75));
        rr(ctx, d > 0 ? -16 : -170, -18, 186, 36, 18); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); ctx.restore(); });
      // score panel
      rr(ctx, 330, y0 + 20, 520, 104, 18); ctx.fillStyle = "#081226"; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.stroke();
      const clk = (Pn.clock0 ?? 600) + minutes, hh = Math.floor(clk / 60), mm = clk % 60;
      textL(ctx, (hh < 10 ? "0" : "") + hh + "." + (mm < 10 ? "0" : "") + mm, 356, y0 + 92, 52, GOLD, 900);
      textL(ctx, (Pn.label || "TERBUANG"), 560, y0 + 62, 24, "#7FB7FF", 900); textL(ctx, minutes + " MENIT", 560, y0 + 104, 40, minutes >= (Pn.to || 15) ? RED : "#FFFFFF", 900, 270);
      // balls
      balls.forEach((b, j) => { if (t < b.T0) return; let [x, y, vx, vy] = b.P; const sp = Math.hypot(vx, vy) || 1;
        if (b.done){ y += Math.sin(t * 2) * 3; }
        for (let k = 1; k <= 4 && !b.done; k++){ const Q = pathPos(b.pocket ? [[930, 1150], [930, 420], [700, 300], [pocket.x + 60, pocket.y + 10], [pocket.x, pocket.y + 30]] : chaosPath(j + 3, bumps), Math.max(0, (t - b.T0) * (b.pocket ? 1100 : 1250) - k * 34));
          ctx.fillStyle = hexA(b.skin, .18 * (5 - k) / 4); ctx.beginPath(); ctx.arc(Q[0], Q[1], 50 - k * 6, 0, TAU); ctx.fill(); }
        faceBall(ctx, x, y, 60, { skin: b.skin, hair: b.hair, hijab: b.hijab, lx: b.done ? 0 : vx / sp * 1.5, ly: b.done ? 1 : vy / sp * 1.5, mouth: b.done ? (t > tAlone ? "flat" : "smile") : "O", sleep: b.done && t > tAlone + 1.2,
          dizzy: !b.done && b.dizzy, rot: b.done ? Math.sin(t * 2) * .1 : (t - b.T0) * 6, name: b.name, tag: b.tag }, t);
        if (b.done && t > tAlone) { for (let k = 0; k < 3; k++){ const q = ((t - tAlone) * .6 + k / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - q; textC(ctx, "z", x + 50 + q * 40, y - 60 - q * 90, 30 + k * 6, "#BFD8FF", 900); ctx.restore(); } } });
    });
    if (Pn.tiltCue && t >= tTilt){ TT.CS.ov.push(() => { const k = t - tTilt, on = Math.floor(k * 5) % 2 === 0 || k > 1.2; if (!on) return; const p = c.toScreen(540, 760);
      ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-.1); ctx.scale(eBack(clamp(k / .3, 0, 1)), eBack(clamp(k / .3, 0, 1))); rr(ctx, -250, -95, 500, 190, 30); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 12; ctx.stroke();
      textC(ctx, Pn.tiltText || "TILT!", 0, 52, 140, "#FFFFFF", 900); ctx.restore(); }); }
    TT.CS.ov.push(() => {
      balls.forEach(b => { if (!b.say) return; const ts = T(s, b.say.cue, .3, idx), k = t - ts; if (k < 0 || k > (b.say.dur || 2.4)) return; const p = c.toScreen(b.P[0], b.P[1] - 60); TT.bubble(ctx, b.say.text, p[0], p[1], k, { kind: b.say.kind || "say", size: 46 }); });
      (Pn.chips || []).forEach(cp => { const ts = T(s, cp.cue, .3, idx); if (t < ts) return; const p = c.toScreen(cp.x, cp.y); popChip(ctx, cp.text, p[0], p[1], t - ts, cp.red ? RED : GOLD, cp.red ? "#FFFFFF" : BROWN, 38, cp.rot ?? -.06); });
      (f.pops || []).forEach((p, j) => popWord(ctx, p.text, p.x ?? 540, p.y ?? 560, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3 })); });
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
  }, (s, f, i, add) => { const Pn = f.pin || {}; add(.2, "whoosh"); (Pn.balls || []).forEach(b => { const t0 = cueT(s, b.cue, .3, i); add(t0, "whoosh"); if (!b.pocket) for (let k = 1; k < 7; k++) add(t0 + k * .55, "ping"); else add(t0 + 1.4, "pop"); if (b.say) add(cueT(s, b.say.cue, .3, i), "pop"); });
    (Pn.chips || []).forEach(cp => add(cueT(s, cp.cue, .3, i), "pop")); if (Pn.tiltCue) { add(cueT(s, Pn.tiltCue, .4, i), "pop"); add(cueT(s, Pn.tiltCue, .4, i) + .4, "ping"); } (f.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop")); });

  /* ================= JS33: hardware shop ================= */
  function tool(ctx, kind, x, y, t, j){ ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.8 + j * 1.3) * .07);
    ctx.strokeStyle = "#6B6B6B"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -14, 7, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill();
    if (kind === 0){ rr(ctx, -8, 0, 16, 130, 6); ctx.fillStyle = "#9B6A3C"; ctx.fill(); ol(ctx, 4); rr(ctx, -44, 0, 88, 34, 8); ctx.fillStyle = "#6B6B76"; ctx.fill(); ol(ctx, 4); }
    else if (kind === 1){ ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.lineTo(26, 150); ctx.lineTo(-40, 150); ctx.closePath(); ctx.fillStyle = "#C9D1D9"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 9; i++){ ctx.lineTo(-40 + i * 7, 150 + (i % 2) * 8); } ctx.stroke(); rr(ctx, -28, -6, 56, 40, 12); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); }
    else if (kind === 2){ rr(ctx, -10, 0, 20, 120, 8); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 0, 26, .3, Math.PI * 2 - .3 + Math.PI); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4); }
    else if (kind === 3){ rr(ctx, -16, 0, 32, 70, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); rr(ctx, -5, 70, 10, 70, 3); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 3); }
    else { ctx.beginPath(); ctx.arc(0, 40, 40, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 40, 14, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); }
    ctx.restore(); }
  function shopBack(ctx, t, o){ // world: wall, pegboard, shelves, sign, door
    ctx.fillStyle = "#F4E2C4"; ctx.fillRect(-600, -400, 2300, GY + 400); ctx.fillStyle = "#E9D2AE"; ctx.fillRect(-600, GY - 260, 2300, 260);
    ctx.fillStyle = "#C9A57A"; ctx.fillRect(-600, GY, 2300, 600); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 4; for (let x = -600; x < 1700; x += 140){ ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x - 80, GY + 300); ctx.stroke(); }
    // sign
    rr(ctx, 170, 330, 740, 120, 20); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, o.sign || "TOKO BANGUNAN", 540, 410, 60, "#FFFFFF", 900, 680);
    // pegboard
    rr(ctx, 470, 500, 600, 520, 14); ctx.fillStyle = "#B8875A"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA(OUT, .25);
    for (let yy = 530; yy < 1000; yy += 40) for (let xx = 500; xx < 1050; xx += 40){ ctx.beginPath(); ctx.arc(xx, yy, 5, 0, TAU); ctx.fill(); }
    [[560, 560, 0], [680, 560, 1], [820, 560, 2], [940, 560, 3], [600, 800, 4], [760, 800, 0], [900, 800, 2]].forEach(([x, y, k], j) => tool(ctx, k, x, y, t, j));
    // paint shelf (left)
    [[-140, 900], [-140, 1180]].forEach(([sx, sy]) => { ctx.fillStyle = "#8E4E2E"; rr(ctx, sx, sy, 520, 26, 6); ctx.fill(); ol(ctx, 4); });
    const cans = [RED, TEAL, GOLD, GREEN, ORANGE, "#5B7DB1"]; for (let i = 0; i < 6; i++){ const cx = -90 + (i % 3) * 140, cy = (i < 3 ? 900 : 1180); rr(ctx, cx - 50, cy - 130, 100, 130, 14); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 4);
      rr(ctx, cx - 50, cy - 100, 100, 50, 6); ctx.fillStyle = cans[i]; ctx.fill(); ctx.strokeStyle = "#6B6B6B"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy - 130, 34, Math.PI, 0); ctx.stroke(); }
    // door (far left) with bell
    if (o.door !== false){ const dx = o.doorX ?? -260; rr(ctx, dx - 130, GY - 600, 260, 600, 12); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 6); rr(ctx, dx - 100, GY - 560, 200, 300, 10); ctx.fillStyle = "#CFE7EE"; ctx.fill(); ol(ctx, 4);
      const rk = o.bellK ?? -1, sw = rk >= 0 && rk < 1.2 ? Math.sin(rk * 22) * .5 * (1 - rk / 1.2) : Math.sin(t * 2) * .03;
      ctx.save(); ctx.translate(dx + 150, GY - 610); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-22, 60); ctx.quadraticCurveTo(0, 14, 22, 60); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.restore(); } }
  function counter(ctx, x, t, o){ const top = GY - 330, w = 560; ctx.fillStyle = "#A9643B"; rr(ctx, x - w / 2, top, w, GY - top, 12); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#8E4E2E"; for (let i = 0; i < 4; i++) rr(ctx, x - w / 2 + 20 + i * 135, top + 60, 120, 230, 10), ctx.fill();
    rr(ctx, x - w / 2 - 20, top - 30, w + 40, 40, 12); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
    // cash register
    const rx = x + 170; rr(ctx, rx - 80, top - 150, 160, 120, 14); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5); rr(ctx, rx - 60, top - 136, 120, 40, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill();
    textC(ctx, o.reg || "0", rx, top - 106, 26, BROWN, 900, 110); }
  function bigDrill(ctx, x, y, t, s, spin){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.12 + Math.sin(t * 2) * .04);
    rr(ctx, -260, -90, 420, 180, 70); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 8); rr(ctx, -200, -60, 120, 40, 20); ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fill();
    rr(ctx, -170, 60, 120, 270, 40); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 8); rr(ctx, -190, 300, 160, 70, 18); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6);
    rr(ctx, 150, -50, 110, 100, 20); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.translate(260, 0); rr(ctx, 0, -18, 230, 36, 8); ctx.fillStyle = "#C9D1D9"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.rect(0, -18, 230, 36); ctx.clip();
    ctx.strokeStyle = "#6B6B76"; ctx.lineWidth = 6; for (let i = -2; i < 14; i++){ const xx = i * 22 + (spin * 220 % 22); ctx.beginPath(); ctx.moveTo(xx, -18); ctx.lineTo(xx + 14, 18); ctx.stroke(); } ctx.restore();
    ctx.restore(); }
  function priceTag(ctx, x, y, txt, t, k, col){ if (k < 0) return; const q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2.4) * .14 - .1); ctx.scale(q, q);
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 0); ctx.stroke();
    font(ctx, 900, 52, FAM); const w = ctx.measureText(txt).width + 80; ctx.beginPath(); ctx.moveTo(-w / 2 + 30, 0); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2, 90); ctx.lineTo(-w / 2 + 30, 90); ctx.lineTo(-w / 2, 45); ctx.closePath();
    ctx.fillStyle = col || GOLD; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(-w / 2 + 34, 45, 9, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); textC(ctx, txt, 18, 64, 52, BROWN, 900); ctx.restore(); }
  TT.scene(PX + "perkakas", "Cerita: toko bangunan (bor raksasa / gantungan tempel)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ cx: 820 }, f.toko || {});
    const bells = (K.bellCues || []).map(cu => T(s, cu, .1, idx)).concat(K.bellAt != null ? [K.bellAt] : []), lastB = bells.filter(b => t >= b).pop() ?? -9;
    const tDrill = T(s, K.drillCue, .3, idx), tPrice = T(s, K.priceCue, .3, idx), tHook = T(s, K.hookCue, .3, idx), tHookP = T(s, K.hookPriceCue, .3, idx);
    const reg = t >= tHookP ? (K.hookPrice || "Rp15.000") : (t >= tPrice ? (K.price || "Rp1.250.000") : "0");
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { drill: [K.drillX ?? 620, 820, 1.0], counter: [K.cx, 1180, 1.1] },
      back: () => shopBack(ctx, t, { sign: K.sign, bellK: t - lastB, doorX: K.doorX }),
      front: (ctx2, c, sts) => {
        counter(ctx, K.cx, t, { reg });
        if (K.drillCue && t >= tDrill){ const q = clamp((t - tDrill) / .7, 0, 1), y = lerp(-300, K.drillY ?? 700, eBack(q)), x = K.drillX ?? 620;
          ctx.save(); ctx.globalAlpha = .35 * q; ctx.fillStyle = "#FFF2B0"; ctx.beginPath(); ctx.moveTo(x - 80, -400); ctx.lineTo(x + 80, -400); ctx.lineTo(x + 420, GY - 300); ctx.lineTo(x - 420, GY - 300); ctx.closePath(); ctx.fill(); ctx.restore();
          glowAt(ctx, x, y, 420, GOLD, .35); for (let i = 0; i < 6; i++){ const a = t * .8 + i; sparkle(ctx, x + Math.cos(a) * 330, y + Math.sin(a * 1.3) * 200, 16 + 8 * Math.sin(t * 5 + i), GOLD); }
          bigDrill(ctx, x - 40, y, t, K.drillS ?? .72, t - tDrill); priceTag(ctx, x - 220, y + 120, K.price || "Rp1.250.000", t, t - tPrice, GOLD); }
        if (K.hookCue && t >= tHook) priceTag(ctx, K.hookX ?? (K.cx - 80), K.hookY ?? (GY - 560), K.hookPrice || "Rp15.000", t, t - tHookP, "#BFE8C8"); },
      over: (ctx2, c) => { if (K.drillCue && t >= tPrice){ const p = c.toScreen(K.drillX ?? 620, 380); popWord(ctx, K.ching || "KA-CHING!", p[0], p[1], t - tPrice, { size: 92, rot: -8, hold: 1.3 }); }
        if (K.hookCue && t >= tHookP){ const p = c.toScreen(K.hookX ?? (K.cx - 80), (K.hookY ?? (GY - 560)) - 180); popWord(ctx, K.cheap || "MURAH!", p[0], p[1], t - tHookP, { size: 84, rot: 6, hold: 1.2, col: GREEN }); }
        const rk = t - lastB; if (rk >= 0 && rk < .9){ const p = c.toScreen((K.doorX ?? -260) + 150, GY - 700); popWord(ctx, "KLINING!", Math.max(220, p[0]), p[1], rk, { size: 64, rot: -10, hold: .9 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.toko || {}; (K.bellCues || []).forEach(cu => { const t0 = cueT(s, cu, .1, i); add(t0, "ping"); add(t0 + .15, "ping"); }); if (K.bellAt != null){ add(K.bellAt, "ping"); add(K.bellAt + .15, "ping"); }
    if (K.drillCue) add(cueT(s, K.drillCue, .3, i), "whoosh"); if (K.priceCue) add(cueT(s, K.priceCue, .3, i), "chime"); if (K.hookCue) add(cueT(s, K.hookCue, .3, i), "pop"); if (K.hookPriceCue) add(cueT(s, K.hookPriceCue, .3, i), "chime"); });

  /* ================= _bawang: the request onion ================= */
  TT.scene(PX + "bawang", "Cerita: bawang permintaan dikupas, inti kebutuhan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, O = Object.assign({ x: 680, y: 900, r: 300, outer: "BOR BESAR", core: "FOTO TERPAJANG" }, f.onion || {});
    const tIn = O.inCue ? T(s, O.inCue, .2, idx) : .1, tGlow = T(s, O.glowCue, .4, idx), tPeel = T(s, O.peelCue, .3, idx), tCore = T(s, O.coreCue, .4, idx), tNo = T(s, O.noCue, .3, idx), tOk = T(s, O.okCue, .5, idx);
    let onionPos = [O.x, O.y];
    base(ctx, s, t, { env: "info", envOpt: { spotX: O.x },
      spots: { onion: [O.x, O.y, 1.1], core: () => [O.x, O.y - 40, 1.3] },
      mid: () => {
        const q = clamp((t - tIn) / .6, 0, 1); if (q <= 0) return; const sc = eBack(q), x = O.x, y = O.y + Math.sin(t * 1.4) * 10, r = O.r;
        ctx.save(); ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(x, GY - 170, r * .9 * sc, 40 * sc, 0, 0, TAU); ctx.fill(); ctx.restore();
        ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc * (1 + Math.sin(t * 2.2) * .015));
        const onionShape = (rr0, sq) => { ctx.beginPath(); ctx.moveTo(0, -rr0 * 1.25); ctx.bezierCurveTo(rr0 * .25, -rr0 * .95, rr0 * 1.05, -rr0 * .55, rr0 * .98, rr0 * .12);
          ctx.bezierCurveTo(rr0 * .92, rr0 * .78, rr0 * .45, rr0 * (1 + sq), 0, rr0 * (1 + sq)); ctx.bezierCurveTo(-rr0 * .45, rr0 * (1 + sq), -rr0 * .92, rr0 * .78, -rr0 * .98, rr0 * .12);
          ctx.bezierCurveTo(-rr0 * 1.05, -rr0 * .55, -rr0 * .25, -rr0 * .95, 0, -rr0 * 1.25); ctx.closePath(); };
        // roots
        ctx.strokeStyle = "#C9A57A"; ctx.lineWidth = 5; for (let i = -3; i <= 3; i++){ ctx.beginPath(); ctx.moveTo(i * 14, r * .98); ctx.quadraticCurveTo(i * 30, r * 1.15, i * 40 + Math.sin(t * 2 + i) * 8, r * 1.25); ctx.stroke(); }
        // core (inner layer)
        const coreQ = clamp((t - tPeel) / .6, 0, 1);
        onionShape(r * .78, .02); const g = ctx.createRadialGradient(0, -r * .2, 10, 0, 0, r); g.addColorStop(0, "#FFF7E8"); g.addColorStop(1, "#E8C7E8"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 7);
        ctx.strokeStyle = hexA("#B37BB3", .6); ctx.lineWidth = 4; for (let i = -2; i <= 2; i++){ ctx.beginPath(); ctx.moveTo(i * r * .16, -r * .92); ctx.quadraticCurveTo(i * r * .34, 0, i * r * .14, r * .76); ctx.stroke(); }
        if (t >= tCore){ const k = t - tCore; glowAt(ctx, 0, -r * .1, r * 1.3, GOLD, .55 + .15 * Math.sin(t * 4)); ctx.save(); ctx.translate(0, -r * .12); const fq = eBack(clamp(k / .5, 0, 1)), tilt = t >= tOk ? Math.sin((t - tOk) * 10) * .25 * Math.exp(-(t - tOk) * 2.5) : -.12;
          ctx.scale(fq, fq); ctx.rotate(tilt); drawItem(ctx, "frame", 0, 0, t, { s: 1.15 }); ctx.restore();
          for (let i = 0; i < 6; i++){ const a = t * 1.2 + i * TAU / 6; sparkle(ctx, Math.cos(a) * r * .85, -r * .1 + Math.sin(a) * r * .7, 14 + 6 * Math.sin(t * 6 + i), i % 2 ? GOLD : "#FFFFFF"); } }
        // outer skin: two halves peel away
        const halves = [-1, 1];
        halves.forEach(d => { const pk = clamp((t - tPeel) / 1.1, 0, 1); if (pk >= 1) return; ctx.save();
          const ex = d * (eOut(pk) * 520), ey = pk * pk * 700, rot = d * pk * 1.4; ctx.translate(ex, ey); ctx.rotate(rot); ctx.globalAlpha *= 1 - clamp((pk - .7) / .3, 0, 1);
          ctx.beginPath(); ctx.rect(d < 0 ? -r * 1.3 : 0, -r * 1.4, r * 1.3, r * 2.8); ctx.clip(); onionShape(r, .04);
          const gg = ctx.createLinearGradient(-r, -r, r, r); gg.addColorStop(0, "#C77D4E"); gg.addColorStop(1, "#8E4E2E"); ctx.fillStyle = gg; ctx.fill();
          ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 5; for (let i = -3; i <= 3; i++){ ctx.beginPath(); ctx.moveTo(i * r * .1, -r * 1.2); ctx.quadraticCurveTo(i * r * .42, 0, i * r * .2, r); ctx.stroke(); }
          onionShape(r, .04); ol(ctx, 8);
          if (t >= tGlow && t < tPeel){ ctx.save(); ctx.globalAlpha = .4 + .3 * Math.sin(t * 8); onionShape(r, .04); ctx.strokeStyle = GOLD; ctx.lineWidth = 18; ctx.stroke(); ctx.restore(); }
          ctx.restore(); });
        // tear drops when peeling
        ctx.restore();
        onionPos = [x, y]; },
      front: (ctx2, c, sts) => { const pk = t - tPeel; if (pk > 0 && pk < 1.4){ burstFx(ctx, O.x, O.y, pk, HL, 12, 420); } },
      over: (ctx2, c) => { const p = c.toScreen(O.x, O.y - O.r * 1.25 - 40), pc = c.toScreen(O.x, O.y + O.r * .55);
        if (t >= tIn + .3 && t < tPeel + .3){ ctx.save(); const q = eBack(clamp((t - tIn - .3) / .4, 0, 1)), a = 1 - clamp((t - tPeel) / .3, 0, 1); ctx.globalAlpha = a; ctx.translate(p[0], p[1]); ctx.scale(q, q);
          chip(ctx, (O.outerTag || "PERMINTAAN") + ": " + O.outer, 0, 0, BROWN, CREAM, 40, 820); ctx.restore(); }
        if (t >= tCore){ const q = eBack(clamp((t - tCore - .3) / .4, 0, 1)); ctx.save(); ctx.translate(pc[0], pc[1] + 40); ctx.scale(q, q); chip(ctx, (O.coreTag || "KEBUTUHAN") + ": " + O.core, 0, 0, GREEN, "#FFFFFF", 40, 820); ctx.restore(); }
        if (O.noCue && t >= tNo){ const k = t - tNo, sp = c.toScreen(O.x + 230, O.y - 390); ctx.save(); ctx.translate(sp[0], sp[1]); const q = eBack(clamp(k / .4, 0, 1)); ctx.scale(q * .8, q * .8);
          drawItem(ctx, "drill", 0, 0, t, { s: 1.2 }); ctx.strokeStyle = RED; ctx.lineWidth = 22; ctx.lineCap = "round"; const xq = clamp((k - .25) / .3, 0, 1);
          ctx.beginPath(); ctx.moveTo(-120, -110); ctx.lineTo(-120 + 240 * xq, -110 + 220 * xq); ctx.stroke(); if (xq >= 1){ const q2 = clamp((k - .55) / .3, 0, 1); ctx.beginPath(); ctx.moveTo(120, -110); ctx.lineTo(120 - 240 * q2, -110 + 220 * q2); ctx.stroke(); } ctx.restore(); }
        if (O.okCue && t >= tOk){ const p2 = c.toScreen(O.x + 120, O.y - 330); popWord(ctx, O.okText || "RAPI!", p2[0], p2[1], t - tOk, { size: 96, rot: 8, hold: 1.6, col: GREEN }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const O = f.onion || {}; add(O.inCue ? cueT(s, O.inCue, .2, i) : .1, "pop"); if (O.glowCue) add(cueT(s, O.glowCue, .4, i), "ping");
    if (O.peelCue) add(cueT(s, O.peelCue, .3, i), "whoosh"); if (O.coreCue) add(cueT(s, O.coreCue, .4, i), "chime"); if (O.noCue) add(cueT(s, O.noCue, .3, i) + .3, "pop"); if (O.okCue) add(cueT(s, O.okCue, .5, i), "chime"); });

  /* ================= SC33: digging holes to fill holes (soil cross-section) ================= */
  function keyVal(s, t, keys, prop0, idx){ // keys [{at|cue, <prop>, dur}] -> eased value
    let v = null, from = null, T0 = 0, D = 0;
    (keys || []).map((k, j) => Object.assign({ T: tOf(s, k, .25, idx) }, k)).sort((a, b) => a.T - b.T).forEach(k => { if (t < k.T || k[prop0] == null) return;
      const cur = v == null ? k[prop0] : (from == null ? v : lerp(from, v, easeIO(ramp(k.T, T0, T0 + D)))); from = cur; v = k[prop0]; T0 = k.T; D = k.dur ?? .8; });
    if (v == null) return 0; if (from == null) return v; return lerp(from, v, easeIO(ramp(t, T0, T0 + D))); }
  function soil(ctx, surf, t){ const g = ctx.createLinearGradient(0, surf, 0, surf + 1100); g.addColorStop(0, "#9A6A43"); g.addColorStop(.5, "#7A5032"); g.addColorStop(1, "#5A3A22");
    ctx.fillStyle = g; ctx.fillRect(-900, surf + 18, 2900, 1600);
    ctx.fillStyle = hexA("#3B2418", .18); for (let i = 0; i < 70; i++){ ctx.beginPath(); ctx.ellipse(-700 + rnd(i) * 2500, surf + 60 + rnd(i + 4) * 1000, 10 + rnd(i + 2) * 22, 7 + rnd(i + 7) * 10, rnd(i) * 3, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = hexA("#3B2418", .25); ctx.lineWidth = 5; [260, 560, 880].forEach((dy, j) => { ctx.beginPath(); for (let x = -900; x < 2000; x += 60) ctx.lineTo(x, surf + dy + Math.sin(x * .01 + j) * 14); ctx.stroke(); });
    ctx.fillStyle = "#5E9B4A"; ctx.fillRect(-900, surf - 4, 2900, 26); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-900, surf + 22); ctx.lineTo(2000, surf + 22); ctx.stroke(); }
  function holeAt(ctx, x, surf, w, d, t){ if (w < 4 || d < 2) return; const bw = w * .62;
    ctx.save(); ctx.beginPath(); ctx.moveTo(x - w / 2, surf - 2); ctx.lineTo(x - bw / 2, surf + d); ctx.quadraticCurveTo(x, surf + d + 26, x + bw / 2, surf + d); ctx.lineTo(x + w / 2, surf - 2); ctx.closePath();
    const g = ctx.createLinearGradient(0, surf, 0, surf + d); g.addColorStop(0, "#2B1A12"); g.addColorStop(1, "#140C08"); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "#4A2C1C"; ctx.lineWidth = 8; ctx.stroke();
    ctx.clip(); ctx.strokeStyle = hexA("#C9A57A", .35); ctx.lineWidth = 3; for (let i = 0; i < 5; i++){ const yy = surf + 30 + i * d / 5; ctx.beginPath(); ctx.moveTo(x - w / 2, yy); ctx.quadraticCurveTo(x - w * .3, yy + 20, x - w * .2, yy + 10); ctx.stroke(); }
    ctx.restore(); }
  function mound(ctx, x, surf, h, w){ if (h < 3) return; ctx.beginPath(); ctx.moveTo(x - w / 2, surf + 4); ctx.quadraticCurveTo(x - w * .2, surf - h * 1.3, x, surf - h); ctx.quadraticCurveTo(x + w * .25, surf - h * 1.2, x + w / 2, surf + 4); ctx.closePath();
    ctx.fillStyle = "#8A5A36"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#3B2418", .3); for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.arc(x - w * .3 + rnd(i) * w * .6, surf - rnd(i + 3) * h * .7, 7, 0, TAU); ctx.fill(); } }
  function digShovel(ctx, st, t, digging, side){ const k = st.size / 92, f = st.face || 1, hp = lp(st, 20, -44), a = digging ? Math.sin(t * 9) : 0;
    ctx.save(); ctx.translate(hp[0], hp[1]); ctx.rotate(f * (.55 + a * .45)); drawItem(ctx, "shovel", 0, 40, t, { s: st.size / 760 * 1.05, dirt: digging && a > 0 }); ctx.restore(); }
  TT.scene(PX + "lubang", "Cerita: gali lubang tutup lubang (penampang tanah)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, L = Object.assign({ surf: 1250, mode: "gali", hero: 0 }, f0.lubang || {}), SURF = L.surf;
    const holes = (L.holes || []).map((h, j) => ({ h, j, w: keyVal(s, t, h.keys, "w", idx) || h.w || 0, d: keyVal(s, t, h.keys, "d", idx), sT: h.signCue ? T(s, h.signCue, .3, idx) : -1 }));
    // pit mode: a deep pit, floor rises
    let floor = 0, P = L.pit || null;
    if (P){ const rises = (P.rises || []).map((r, j) => Object.assign({ T: T(s, r.cue, .35, idx) }, r)); floor = P.depth;
      rises.forEach(r => { floor -= r.h * eOut(ramp(t, r.T, r.T + .9)); }); }
    const toons = (f0.toons || []).map((a, j) => j === L.hero && P ? Object.assign({}, a, { y: SURF + Math.max(0, floor) }) : Object.assign({ y: SURF }, a));
    const s2 = Object.assign({}, s, { f: Object.assign({}, f0, { toons }) });
    const digs = (L.digs || []).map(d => ({ T: T(s, d.cue, .2, idx), D: d.dur || 1.4 })), digging = digs.some(d => t >= d.T && t < d.T + d.D);
    const flows = (L.flows || []).map(fl => Object.assign({ T: T(s, fl.cue, .25, idx), D: fl.dur || 1.4 }, fl));
    const tThrow = P ? T(s, P.throwCue, .35, idx) : 1e9, tCrack = T(s, L.crackCue, .4, idx), tSun = P ? T(s, P.sunCue, .4, idx) : 1e9;
    const heroSt = toons[L.hero] ? toonState(toons[L.hero], s2, t) : null;
    base(ctx, s2, t, { env: L.env || "park", envOpt: Object.assign({ ground: SURF + 20 }, L.envOpt || {}), envFront: false,
      spots: { hero: () => { const st = heroSt; return st ? [st.x, st.y - st.size * .62, null] : [540, SURF - 400, null]; }, pit: [L.pitX ?? 540, SURF + 200, .8] },
      back: () => { soil(ctx, SURF, t);
        if (P){ const pw = P.w || 760, px = L.pitX ?? 540; holeAt(ctx, px, SURF, pw, P.depth + 20, t);
          // risen layers
          const rises = (P.rises || []).map((r, j) => Object.assign({ T: T(s, r.cue, .35, idx), j }, r)); let base0 = SURF + P.depth + 10;
          rises.forEach(r => { const q = eOut(ramp(t, r.T, r.T + .9)); if (q <= 0) return; const hh = r.h * q, top = base0 - hh, wTop = pw * (.62 + .38 * (SURF + P.depth - top) / P.depth);
            ctx.save(); ctx.beginPath(); ctx.rect(px - pw / 2, top, pw, hh + 2); ctx.clip(); holeAt(ctx, px, SURF, pw, P.depth + 20, t); ctx.restore();
            ctx.fillStyle = ["#B07A4C", "#C68B57", "#D19B66", "#A9744A"][r.j % 4]; ctx.beginPath(); ctx.rect(px - wTop / 2 + 6, top, wTop - 12, hh); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(px - wTop / 2 + 6, top); ctx.lineTo(px + wTop / 2 - 6, top); ctx.stroke();
            if (r.label && hh > 40){ ctx.save(); ctx.translate(px, top + hh / 2); chip(ctx, r.label, 0, 0, GREEN, "#FFFFFF", 40, wTop * .8); ctx.restore(); }
            base0 = top; }); }
        holes.forEach(o => { holeAt(ctx, o.h.x, SURF, o.w, o.d, t); if (o.h.mound) mound(ctx, o.h.x + o.h.mound * (o.w / 2 + 80), SURF, Math.min(140, o.d * .4), 180); });
        if (L.crackCue && t >= tCrack){ const q = eOut(ramp(t, tCrack, tCrack + .6)); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineJoin = "round";
          (L.cracks || [[700, 1], [300, -1]]).forEach(([cx, d], j) => { ctx.beginPath(); ctx.moveTo(cx, SURF + 10); for (let i = 1; i <= 6; i++) ctx.lineTo(cx + d * i * 50 * q, SURF + 10 + (i % 2 ? 30 : 0) * q + i * 40 * q); ctx.stroke(); }); } },
      over1: (ctx2, c, sts, j) => { if (j !== L.hero) return; const st = sts[j]; if (L.shovel !== false && t < tThrow) digShovel(ctx, st, t, digging);
        if (t >= tThrow && t < tThrow + 1.6){ const q = (t - tThrow) / 1.6, hp = lp(st, 20, -44); ctx.save(); ctx.translate(hp[0] + q * 700, hp[1] - Math.sin(q * Math.PI) * 900 - q * 300); ctx.rotate(q * 12); drawItem(ctx, "shovel", 0, 0, t, { s: .9 }); ctx.restore(); } },
      front: () => {
        holes.forEach(o => { if (!o.h.label) return; const k = o.sT < 0 ? 1 : t - o.sT, lx = o.h.x + (o.h.labelDx ?? 0), ly = SURF - (o.h.labelDy ?? 70) + Math.sin(t * 2 + o.j) * 5;
          if (k > 0) popChip(ctx, o.h.label, lx, ly, k, o.h.labelCol || PAPER, BROWN, 38, Math.sin(t * 1.7 + o.j) * .04);
          (o.h.tags || []).forEach((tg, j) => { const tt0 = T(s, tg.cue, .4, idx); if (t >= tt0) popChip(ctx, tg.text, lx + (tg.dx ?? 0), ly - 70 - (tg.dy ?? 0) - j * 64, t - tt0, tg.red === false ? GOLD : RED, tg.red === false ? BROWN : "#FFFFFF", 34, (j % 2 ? .06 : -.06)); }); });
        flows.forEach(fl => { if (t < fl.T || t > fl.T + fl.D + .6) return; const A = holes[fl.from], B = holes[fl.to]; if (!A || !B) return;
          for (let i = 0; i < 14; i++){ const q = ((t - fl.T) * 1.6 + i / 14) % 1, live = t - fl.T + (1 - i / 14) * .2 < fl.D + .3; if (!live) continue;
            const x = lerp(A.h.x, B.h.x, q), y = lerp(SURF - 20, SURF + 10, q) - Math.sin(q * Math.PI) * 330; ctx.fillStyle = i % 2 ? "#8A5A36" : "#6B4426"; ctx.beginPath(); ctx.arc(x + (rnd(i) - .5) * 40, y, 12 + rnd(i + 2) * 12, 0, TAU); ctx.fill(); ol(ctx, 3); } });
        if (P && t >= tSun){ glowAt(ctx, L.pitX ?? 540, SURF - 300, 700, GOLD, .35 * eOut(ramp(t, tSun, tSun + .8))); } },
      over: (ctx2, c, sts) => {
        (L.chips || []).forEach(cp => { const ts = T(s, cp.cue, .35, idx); if (t < ts || (cp.outCue && t > T(s, cp.outCue, .5, idx))) return; const p = cp.screen ? [cp.x, cp.y] : c.toScreen(cp.x, cp.y); popChip(ctx, cp.text, p[0], p[1], t - ts, cp.red ? RED : (cp.green ? GREEN : GOLD), cp.red || cp.green ? "#FFFFFF" : BROWN, cp.size || 38, cp.rot ?? -.05); });
        if (P && P.stopCue){ const ts = T(s, P.stopCue, .4, idx); if (t >= ts && t < ts + 2.2) stampBox(ctx, P.stopText || "STOP MENGGALI", 540, 420, t - ts, RED, 66, -.1); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const L = f.lubang || {}; (L.digs || []).forEach(d => { const t0 = cueT(s, d.cue, .2, i); for (let k = 0; k < Math.round((d.dur || 1.4) / .35); k++) add(t0 + k * .35, "pop"); });
    (L.flows || []).forEach(fl => add(cueT(s, fl.cue, .25, i), "whoosh")); (L.holes || []).forEach(h => { if (h.signCue) add(cueT(s, h.signCue, .3, i), "pop"); (h.tags || []).forEach(tg => add(cueT(s, tg.cue, .4, i), "ping")); });
    (L.chips || []).forEach(cp => add(cueT(s, cp.cue, .35, i), "pop")); if (L.crackCue) add(cueT(s, L.crackCue, .4, i), "whoosh");
    const P = L.pit; if (P){ if (P.throwCue) add(cueT(s, P.throwCue, .35, i), "whoosh"); if (P.stopCue) add(cueT(s, P.stopCue, .4, i) + .1, "pop"); (P.rises || []).forEach(r => add(cueT(s, r.cue, .35, i), "chime")); if (P.sunCue) add(cueT(s, P.sunCue, .4, i), "chime"); } });

  /* ================= MS33: the revolving front door ================= */
  function houseFront(ctx, t, o){ const L = 90, R = 990, top = 760;
    ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.fillRect(L + 10, top + 20, R - L, GY - top - 20);
    ctx.fillStyle = "#FBE6D0"; ctx.fillRect(L, top, R - L, GY - top); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(L, top, R - L, GY - top);
    ctx.strokeStyle = hexA("#C9A57A", .45); ctx.lineWidth = 3; for (let y = top + 60; y < GY; y += 60){ ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(L - 70, top + 10); ctx.lineTo(540, top - 260); ctx.lineTo(R + 70, top + 10); ctx.closePath(); ctx.fillStyle = "#B5532E"; ctx.fill(); ol(ctx, 7);
    ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 4; for (let i = 1; i < 6; i++){ const q = i / 6; ctx.beginPath(); ctx.moveTo(lerp(L - 70, 540, q), lerp(top + 10, top - 260, q)); ctx.lineTo(lerp(R + 70, 540, q), lerp(top + 10, top - 260, q)); ctx.stroke(); }
    [[230, 980], [850, 980]].forEach(([wx, wy], j) => { rr(ctx, wx - 95, wy - 110, 190, 200, 12); ctx.fillStyle = "#CFE7EE"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(wx, wy - 110); ctx.lineTo(wx, wy + 90); ctx.moveTo(wx - 95, wy - 10); ctx.lineTo(wx + 95, wy - 10); ctx.stroke();
      rr(ctx, wx - 110, wy + 90, 220, 40, 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); for (let i = 0; i < 5; i++){ const fx = wx - 80 + i * 40; ctx.beginPath(); ctx.arc(fx, wy + 84 + Math.sin(t * 2 + i) * 2, 13, 0, TAU); ctx.fillStyle = [RED, GOLD, "#E86FA0", GOLD, RED][i]; ctx.fill(); ol(ctx, 3); } });
    if (o.plate){ rr(ctx, 380, 800, 320, 70, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); textC(ctx, o.plate, 540, 848, 36, "#FFFFFF", 900, 290); } }
  function revDoor(ctx, cx, t, th, spinK, layerPart){ const top = GY - 560, R = 170;
    if (layerPart === "back"){ rr(ctx, cx - R - 30, top - 50, 2 * R + 60, 610, 20); ctx.fillStyle = "#6E4A33"; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = "#2B2430"; ctx.fillRect(cx - R, top, 2 * R, 560); glowAt(ctx, cx, top + 280, 280, "#FFD9A0", .35); }
    const wings = []; for (let k = 0; k < 4; k++){ const a = th + k * Math.PI / 2; wings.push({ a, x: Math.sin(a) * R, z: Math.cos(a) }); }
    wings.filter(w => layerPart === "back" ? w.z < 0 : w.z >= 0).sort((p, q) => p.z - q.z).forEach(w => { ctx.save(); ctx.globalAlpha *= layerPart === "back" ? .55 : .8;
      ctx.beginPath(); ctx.moveTo(cx, top + 8); ctx.lineTo(cx + w.x, top + 8); ctx.lineTo(cx + w.x, GY - 6); ctx.lineTo(cx, GY - 6); ctx.closePath();
      ctx.fillStyle = hexA("#BFE2EA", .35 + .25 * Math.abs(w.z)); ctx.fill(); ctx.strokeStyle = "#C9D1D9"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx + w.x, top + 8); ctx.lineTo(cx + w.x, GY - 6); ctx.stroke(); ctx.restore(); });
    if (layerPart === "front"){ ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx, GY); ctx.stroke();
      rr(ctx, cx - R - 50, top - 90, 2 * R + 100, 70, 24); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
      if (spinK > .05){ ctx.save(); ctx.globalAlpha = Math.min(1, spinK); ctx.strokeStyle = CREAM; ctx.lineWidth = 7; ctx.lineCap = "round"; for (let i = 0; i < 6; i++){ const yy = top + 80 + i * 80, ph = (t * 4 + i * .3) % 1; ctx.beginPath(); ctx.arc(cx, yy, R + 30 + ph * 20, -.5 - ph, .5 - ph); ctx.stroke(); } ctx.restore(); } } }
  function dayBar(ctx, t, s, D, idx){ // screen overlay: the Sunday time bar
    const x0 = 100, x1 = 980, y = D.y || 250, h = 112, H0 = D.from || 7, H1 = D.to || 21, hx = h0 => lerp(x0 + 20, x1 - 20, (h0 - H0) / (H1 - H0));
    const tIn = D.at ?? .2, q = eBack(clamp((t - tIn) / .5, 0, 1)); if (q <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(q, q); ctx.translate(-540, -y);
    rr(ctx, x0 - 10, y - 70, x1 - x0 + 20, h + 96, 24); ctx.fillStyle = hexA(NAVY, .88); ctx.fill(); ol(ctx, 5);
    textL(ctx, D.title || "MINGGU RATIH", x0 + 16, y - 26, 38, GOLD, 900, 520);
    rr(ctx, x0 + 10, y, x1 - x0 - 20, h - 10, 16); ctx.fillStyle = hexA("#FFFFFF", .12); ctx.fill();
    for (let h0 = H0; h0 <= H1; h0 += 2){ if (hx(h0) > x0 + 400) textC(ctx, String(h0).padStart(2, "0"), hx(h0), y - 26, 26, hexA("#FFFFFF", .75), 800); }
    (D.blocks || []).forEach((b, j) => { const T0 = b.cue ? cueT(s, b.cue, .3, idx) : (b.at ?? 0), kOut = b.outCue ? t - cueT(s, b.outCue, .3, idx) : -1, kB = b.bounceCue ? t - cueT(s, b.bounceCue, .4, idx) : -1, kOk = b.okCue ? t - cueT(s, b.okCue, .4, idx) : -1;
      if (t < T0) return; const k = t - T0; let bx = hx(b.h0), bw = hx(b.h1) - hx(b.h0) - 6, by = y + 4, rot = 0, a = 1;
      const qin = clamp(k / .45, 0, 1); by -= (1 - eBack(qin)) * 140;
      if (b.bounceCue){ if (kB < 0){ by = y + 4 + 150 + Math.sin(t * 5) * 6; } else { const qb = clamp(kB / .9, 0, 1); by = y + 4 + 150 - qb * 60 + qb * qb * 500; bx += qb * 260; rot = qb * 1.4; a = 1 - clamp((qb - .6) / .4, 0, 1); } }
      if (kOut >= 0){ const qo = clamp(kOut / .9, 0, 1); by += qo * qo * 900; bx += (j % 2 ? 1 : -1) * qo * 120; rot = (j % 2 ? 1 : -1) * qo * 1.2; a = 1 - clamp((qo - .7) / .3, 0, 1); }
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(bx + bw / 2, by + (h - 18) / 2); ctx.rotate(rot); rr(ctx, -bw / 2, -(h - 18) / 2, bw, h - 18, 12); ctx.fillStyle = b.green ? GREEN : (b.col || ORANGE); ctx.fill(); ol(ctx, 4);
      textC(ctx, b.text, 0, 14, 38, "#FFFFFF", 900, bw - 16);
      if (kOk >= 0){ ctx.strokeStyle = GOLD; ctx.lineWidth = 6 + 4 * Math.sin(t * 8); rr(ctx, -bw / 2 - 6, -(h - 18) / 2 - 6, bw + 12, h - 6, 14); ctx.stroke(); }
      if (kB >= 0 && kB < .6){ ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-30, -24); ctx.lineTo(30, 24); ctx.moveTo(30, -24); ctx.lineTo(-30, 24); ctx.stroke(); }
      ctx.restore(); });
    ctx.restore(); }
  TT.scene(PX + "pintu", "Cerita: pintu putar rumah (permintaan berdatangan / ditolak sopan)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Dr = Object.assign({ x: 540, base: .5 }, f.door || {});
    const spins = (Dr.spinCues || []).map((cu, j) => T(s, cu, .25 + j * .02, idx)), tStart = T(s, Dr.startCue, .3, idx);
    let th0 = t * Dr.base + (t > tStart ? (t - tStart) * (Dr.fast || 2.2) : 0), spinK = t > tStart && Dr.fast ? .6 : 0;
    spins.forEach(T0 => { const q = ramp(t, T0, T0 + 1); th0 += Math.PI * eOut(q); if (t >= T0 && t < T0 + 1) spinK = Math.max(spinK, 1 - (t - T0)); });
    base(ctx, s, t, { env: "street", envOpt: Object.assign({ time: "day" }, f.envOpt || {}),
      spots: { door: [Dr.x, GY - 330, 1.1] },
      back: () => { houseFront(ctx, t, { plate: Dr.plate }); revDoor(ctx, Dr.x, t, th0, spinK, "back"); },
      mid: () => { revDoor(ctx, Dr.x, t, th0, spinK, "front"); spins.forEach(T0 => { const k = t - T0; if (k > 0 && k < .8){ for (let i = 0; i < 10; i++){ const a = i / 10 * TAU, r = 120 + k * 260; ctx.save(); ctx.globalAlpha = 1 - k / .8; ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(Dr.x + Math.cos(a) * r, GY - 300 + Math.sin(a) * r * .8, 26 * (1 - k), 0, TAU); ctx.fill(); ctx.restore(); } } }); },
      midZ: Dr.midZ ?? -.5,
      over: (ctx2, c) => { if (f.day) dayBar(ctx, t, s, f.day, idx); spins.forEach((T0, j) => { const p = c.toScreen(Dr.x, GY - 700); if (Dr.whoosh !== false) popWord(ctx, Dr.word || "WUSH!", p[0] + (j % 2 ? 120 : -120), p[1], t - T0, { size: 70, rot: j % 2 ? 8 : -8, hold: .8 }); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Dr = f.door || {}; (Dr.spinCues || []).forEach((cu, j) => add(cueT(s, cu, .25 + j * .02, i), "whoosh")); if (Dr.startCue) add(cueT(s, Dr.startCue, .3, i), "whoosh");
    const D = f.day; if (D) (D.blocks || []).forEach(b => { if (b.cue) add(cueT(s, b.cue, .3, i), "pop"); if (b.outCue) add(cueT(s, b.outCue, .3, i) + .2, "ping"); if (b.bounceCue) add(cueT(s, b.bounceCue, .4, i), "pop"); if (b.okCue) add(cueT(s, b.okCue, .4, i), "chime"); }); });

  /* ================= _roti: the polite refusal sandwich ================= */
  function bun(ctx, w, h, top, t){ ctx.beginPath(); if (top){ ctx.moveTo(-w / 2, 0); ctx.bezierCurveTo(-w / 2, -h * 1.3, w / 2, -h * 1.3, w / 2, 0); ctx.closePath(); }
    else { rr(ctx, -w / 2, -h, w, h, h * .45); }
    const g = ctx.createLinearGradient(0, -h, 0, 0); g.addColorStop(0, "#E9A75A"); g.addColorStop(1, "#C77D3A"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
    if (top){ ctx.fillStyle = "#FFF4D6"; for (let i = 0; i < 12; i++){ const sx = (rnd(i) - .5) * w * .8, sy = -h * (.35 + rnd(i + 5) * .5); ctx.beginPath(); ctx.ellipse(sx, sy, 7, 4, rnd(i) * 3, 0, TAU); ctx.fill(); } } }
  function filling(ctx, w, h, t){ ctx.beginPath(); ctx.moveTo(-w / 2 - 20, -h * .2); for (let i = 0; i <= 12; i++){ const x = -w / 2 - 20 + (w + 40) * i / 12; ctx.lineTo(x, -h * .2 + (i % 2 ? 22 : -8) + Math.sin(t * 3 + i) * 3); } ctx.lineTo(w / 2 + 20, -h * .55); ctx.lineTo(-w / 2 - 20, -h * .55); ctx.closePath(); ctx.fillStyle = "#6DBE4B"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -w / 2 + 10, -h, w - 20, h * .5, 10); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(-w / 2 - 6, -h * 1.02); ctx.lineTo(w / 2 + 6, -h * 1.02); ctx.lineTo(w / 2 - 20, -h * .62); ctx.lineTo(-w / 2 + 50, -h * .58); ctx.lineTo(-w / 2 + 30, -h * .3); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); }
  TT.scene(PX + "roti", "Cerita: resep roti lapis penolakan sopan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rt = Object.assign({ x: 700, top: GY - 430, w: 470 }, f.roti || {});
    const lay = (Rt.layers || []).map((l, j) => Object.assign({ T: T(s, l.cue, .3, idx), j }, l)), tFlag = T(s, Rt.flagCue, .5, idx), tPlate = Rt.plateCue ? T(s, Rt.plateCue, .3, idx) : .2;
    const HS = [80, 92, 112];
    base(ctx, s, t, { env: Rt.env || "home", envOpt: Object.assign({ time: "day", lampX: 140 }, f.envOpt || {}),
      spots: { roti: [Rt.x, Rt.top - 160, 1.15] },
      back: () => { // kitchen counter
        const x0 = Rt.x - 360, x1 = Rt.x + 420; ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(x0 + 14, Rt.top + 20, x1 - x0, GY - Rt.top);
        rr(ctx, x0, Rt.top + 16, x1 - x0, GY - Rt.top - 16, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6);
        for (let i = 0; i < 3; i++){ rr(ctx, x0 + 30 + i * 250, Rt.top + 70, 220, 300, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 4); }
        rr(ctx, x0 - 20, Rt.top - 10, x1 - x0 + 40, 36, 10); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 6);
        // plate
        const pq = eBack(clamp((t - tPlate) / .4, 0, 1)); if (pq > 0){ ctx.save(); ctx.translate(Rt.x, Rt.top - 8); ctx.scale(pq, pq); ctx.beginPath(); ctx.ellipse(0, 0, Rt.w * .7, 34, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.ellipse(0, -4, Rt.w * .52, 20, 0, 0, TAU); ctx.strokeStyle = "#D6DCE3"; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } },
      mid: () => {
        const SC = Rt.sc || 1.3; ctx.save(); ctx.translate(Rt.x, Rt.top - 22); ctx.scale(SC, SC); ctx.translate(-Rt.x, -(Rt.top - 22));
        let y = Rt.top - 22; const stackTop = [];
        lay.forEach((l, j) => { if (t < l.T - .5) return; const h = HS[j] || 90, k = t - l.T; const fall = k < 0 ? clamp((k + .5) / .5, 0, 1) : 1;
          const yy = y - (1 - fall * fall) * 900, sq = k >= 0 && k < .4 ? Math.sin(k / .4 * Math.PI) * .22 * (1 - k / .4) : 0;
          ctx.save(); ctx.translate(Rt.x, yy); ctx.scale(1 + sq, 1 - sq);
          if (j === 0) bun(ctx, Rt.w, h, false, t); else if (j === 1) filling(ctx, Rt.w, h, t); else bun(ctx, Rt.w + 20, h, true, t);
          if (fall >= 1){ const lbl = l.text; const ty = j === 2 ? -h * .52 : (j === 1 ? -h * .78 : -h * .36); textC(ctx, lbl, 0, ty + 15, 44, j === 1 ? BROWN : "#FFFFFF", 900, Rt.w - 50);
            ctx.beginPath(); ctx.arc(-Rt.w / 2 - 50, -h / 2, 30, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); textC(ctx, String(j + 1), -Rt.w / 2 - 50, -h / 2 + 13, 36, "#FFFFFF", 900); }
          ctx.restore();
          if (k >= 0 && k < .7){ for (let i = 0; i < 8; i++){ const a = Math.PI + i / 7 * Math.PI, r = 60 + k * 300; ctx.save(); ctx.globalAlpha = 1 - k / .7; ctx.fillStyle = "#F3D9B5"; ctx.beginPath(); ctx.arc(Rt.x + Math.cos(a) * (Rt.w / 2 + r * .3), y + Math.sin(a) * r * .3 - 20, 10, 0, TAU); ctx.fill(); ctx.restore(); } }
          y -= h * (j === 2 ? 1.1 : 1) - 4; stackTop.push(y); });
        if (t >= tFlag){ const q = eBack(clamp((t - tFlag) / .45, 0, 1)), fy = y - 20; ctx.save(); ctx.translate(Rt.x + 30, fy - (1 - q) * 400); ctx.rotate(.08 + Math.sin(t * 3) * .04);
          ctx.strokeStyle = "#C9A57A"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 120); ctx.lineTo(0, -140); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, -140); ctx.lineTo(170, -110 + Math.sin(t * 6) * 8); ctx.lineTo(0, -70); ctx.closePath(); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); textC(ctx, Rt.flagText || "SOPAN", 70, -96, 30, "#FFFFFF", 900, 120); ctx.restore();
          glowAt(ctx, Rt.x, y + 60, 360, GOLD, .25 * q); for (let i = 0; i < 6; i++){ const a = t * 1.3 + i * TAU / 6; sparkle(ctx, Rt.x + Math.cos(a) * 300, y + 120 + Math.sin(a) * 140, 14 + 5 * Math.sin(t * 5 + i), i % 2 ? GOLD : "#FFFFFF"); } }
        ctx.restore(); },
      midZ: Rt.midZ ?? .5 });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rt = f.roti || {}; (Rt.layers || []).forEach(l => { const t0 = cueT(s, l.cue, .3, i); add(t0 - .4, "whoosh"); add(t0, "pop"); }); if (Rt.flagCue) add(cueT(s, Rt.flagCue, .5, i), "chime"); if (Rt.plateCue) add(cueT(s, Rt.plateCue, .3, i), "pop"); });
})();
