/* Scene pack j2611221200511: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for MS36, SB37, SP37, RN37, KD37.
   Layout prefix j2611221200511_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots [{at|cue, env, envOpt, toons, cam, props, cards, hold, piece}]  hard cut (cream flash) to a new shot inside one scene
     hold  [{on, kind, at|cue, out|outCue}]  object in a toon's hand (cake, keys, paper, phone, ...)   pops [{at|cue, text, x, y}] big outlined words
     confetti {at|cue}     wh {..}  warehouse shelves behind the toons (racks of boxes, roller door, hanging lamps)
   Set pieces (layout suffix):
     _adegan   generic story shot with the extras above
     _padam    blackout at home: lights flicker off, a phone flashlight beam finds the feverish child on the sofa, a giant thermometer climbs   f.padam
     _lewat    street: the hero dashes past the neighbour's house again and again (speed lines, afterimages, time chips) while the
               neighbour waves in vain; the name plate on the gate turns into "???"                                                       f.lewat
     _ketuk    dark living room seen from inside: the front door shakes with knocks, swings open to the neighbour with a lantern;
               car headlights flood the room                                                                                             f.ketuk
     _jarak    dusk valley: a long winding road to a tiny relatives' house on a far hill (spinning clock) vs two houses next door;
               the hero crosses in one giant step (footprint), a glowing ring joins the neighbours                                       f.jarak
     _kantung  office: the hero's eye bags hang down to his knees and swing; they turn into shopping bags with handles                  f.bags
     _lampu    a marquee habit board on the wall: one row of bulbs per night lights up, the times write themselves in                    f.board
     _rasi     night sky over the city: one star per night, the brightest join into a briefcase constellation "SETELAH LEMBUR"         f.rasi
     _ski      the sleep-time line chart as a ski slope: the phone docks into a charger post, the hero skis down the falling line       f.ski
     _burung   promises are little birds with tags that fly in and settle in a nest on the hero's head                                   f.birds
     _lobi     the phone rings, the birds scatter; cut to the lobby where the client waits, cups pile up, a tagged bird flies off       f.lobi
     _sarang   a birdhouse calendar on a tree: each promise bird flies into its own day/time hole                                       f.sarang
     _kicau    a cuckoo bird springs out of the desk phone as a reminder; then the meeting starts on time                                f.kicau
     _gedung   cut-away office building (sales / finance / warehouse floors): a promise slip drops down the chute to the warehouse      f.gedung
     _tuding   blame carousel: three pointing arrows spin between the toons, an angry customer bubble                                    f.tuding
     _tur      warehouse tour: the hero in a hard hat follows the warehouse chief past four working stations                             f.tur
     _gigi     three division gears grind with sparks, then slide together and turn smoothly; parcels ride over them                    f.gigi
     _banjir   chat-bubble flood: replies pour out of the phone, the room fills, the hero floats                                          f.banjir
     _kusut    tangled yarn between name tags and replies; duplicates flagged; grey "?" silhouettes of the non-responders               f.kusut
     _gerbang  the online form is a gate: colleagues walk through, fields fill, an empty required field buzzes red                      f.gerbang
     _kaos     a sheet panel fills itself, T-shirts fly into S/M/L/XL piles with counters, the clock shows "before lunch"             f.kaos */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221200511_";
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
    if (f.wh) layer(ctx, c, 1, () => warehouseBg(ctx, t, f.wh === true ? {} : f.wh));
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
    if (piece && H.items) H.items(sts, R, c).forEach((o, n) => items.push(Object.assign({ j: 50 + n }, o)));
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

  /* ---------- shared drawing helpers of this pack ---------- */
  const SAT = (t, T0, d) => t < T0 ? 0 : clamp((t - T0) / (d || .4), 0, 1);
  const segs = (s, list, fr) => (list || []).map((cu, j) => typeof cu === "number" ? cu : T(s, cu, (fr ?? .3) + j * .02, G.scene));
  // warehouse back wall: steel racks with boxes, roller door, hanging lamps (world, ground = GY)
  function warehouseBg(ctx, t, o){
    const x0 = o.x0 ?? -1200, x1 = o.x1 ?? 3400, top = GY - 1300, fy = GY - 190;
    ctx.fillStyle = "#D9CBB5"; ctx.fillRect(x0, top - 2000, x1 - x0, fy - top + 2000);
    ctx.fillStyle = "#CDBEA6"; for (let x = x0; x < x1; x += 160) ctx.fillRect(x, top - 2000, 10, fy - top + 2000);
    ctx.fillStyle = "#BBA98E"; ctx.fillRect(x0, fy - 26, x1 - x0, 26);
    ctx.fillStyle = "#A9967B"; ctx.fillRect(x0, fy, x1 - x0, 400); ctx.strokeStyle = "rgba(59,36,24,.15)"; ctx.lineWidth = 3;
    for (let x = x0; x < x1; x += 140){ ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x - 60, fy + 400); ctx.stroke(); }
    ctx.fillStyle = "#F6C343"; for (let x = x0; x < x1; x += 120) ctx.fillRect(x, fy + 120, 60, 12);
    const racks = o.racks || [-700, -150, 1500, 2050, 2600];
    racks.forEach((rx, ri) => { const w = 470, h = 900, by = fy - 10;
      ctx.fillStyle = "#3B4A6B"; [0, w - 18].forEach(d => { rr(ctx, rx + d, by - h, 18, h, 4); ctx.fill(); });
      for (let l = 0; l < 4; l++){ const ly = by - 30 - l * 230; ctx.fillStyle = "#E8A55B"; ctx.fillRect(rx, ly, w, 16); ol(ctx, 3);
        for (let b = 0; b < 3; b++){ if (rnd(ri * 13 + l * 5 + b) < .18) continue; const bw = 110 + rnd(ri + l * 3 + b * 7) * 30, bh = 100 + rnd(ri * 3 + l + b) * 70, bx = rx + 22 + b * 145;
          ctx.fillStyle = rnd(ri + l + b * 2) > .5 ? "#C98F55" : "#B97D45"; rr(ctx, bx, ly - bh, bw, bh, 5); ctx.fill(); ol(ctx, 3);
          ctx.fillStyle = "rgba(255,244,230,.55)"; ctx.fillRect(bx + bw / 2 - 9, ly - bh, 18, bh); } } });
    // roller door
    const dx = o.doorX ?? 700; ctx.fillStyle = "#8C97A3"; rr(ctx, dx - 260, fy - 620, 520, 620, 6); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 4; for (let y = fy - 600; y < fy; y += 34){ ctx.beginPath(); ctx.moveTo(dx - 250, y); ctx.lineTo(dx + 250, y); ctx.stroke(); }
    ctx.fillStyle = "#F6C343"; rr(ctx, dx - 150, fy - 700, 300, 60, 8); ctx.fill(); ol(ctx, 4); textC(ctx, o.sign || "GUDANG", dx, fy - 657, 38, BROWN, 900);
    // hanging lamps
    for (let x = x0 + 200; x < x1; x += 620){ const sw = Math.sin(t * 1.3 + x) * .04; ctx.save(); ctx.translate(x, top - 300); ctx.rotate(sw);
      ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -800); ctx.lineTo(0, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-60, 40); ctx.lineTo(60, 40); ctx.lineTo(24, 0); ctx.lineTo(-24, 0); ctx.closePath(); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 3);
      glowAt(ctx, 0, 60, 260, "#FFE7B0", .35); ctx.restore(); }
  }
  // simple house facade (world): x = centre, gy = ground. o: {w, h, wall, roof, door, lit, plate, plateK}
  function house(ctx, x, gy, o, t){
    o = o || {}; const w = o.w || 480, h = o.h || 520, x0 = x - w / 2, top = gy - h;
    ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(x, gy + 4, w * .55, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = o.wall || "#F3D9B5"; rr(ctx, x0, top, w, h, 4); ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(x0 - 50, top + 10); ctx.lineTo(x, top - h * .45); ctx.lineTo(x0 + w + 50, top + 10); ctx.closePath(); ctx.fillStyle = o.roof || "#B5512F"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 3; for (let i = 1; i < 5; i++){ const yy = top + 10 - h * .45 * i / 5; ctx.beginPath(); ctx.moveTo(x - (x - x0 + 50) * (1 - i / 5), yy); ctx.lineTo(x + (x - x0 + 50) * (1 - i / 5), yy); ctx.stroke(); }
    const dw = w * .26, dh = h * .55, dx = x + (o.doorDx ?? w * .12); ctx.fillStyle = o.door || "#7A4A2E"; rr(ctx, dx - dw / 2, gy - dh, dw, dh, [10, 10, 0, 0]); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(dx + dw * .3, gy - dh * .45, 7, 0, TAU); ctx.fill();
    const wx = x - w * .28, wy = top + h * .25, ww = w * .3, wh = h * .3; ctx.fillStyle = o.lit ? "#FFD98A" : "#BFE2EA"; rr(ctx, wx - ww / 2, wy, ww, wh, 6); ctx.fill(); ol(ctx, 4);
    if (o.lit) glowAt(ctx, wx, wy + wh / 2, 200, "#FFD98A", .35 + .05 * Math.sin(t * 3));
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, wy + wh); ctx.moveTo(wx - ww / 2, wy + wh / 2); ctx.lineTo(wx + ww / 2, wy + wh / 2); ctx.stroke();
    return { door: [dx, gy - dh / 2], top, dw, dh };
  }
  // a little round bird (world). o: {col, flap (0..1 wing), face, tag, open (beak), look}
  function bird(ctx, x, y, s, t, o){
    o = o || {}; const col = o.col || "#5B7DB1", f = o.face || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-34, 4); ctx.lineTo(-62, -10); ctx.lineTo(-58, 14); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(0, 0, 42, 36, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(8, 12, 24, 18, 0, 0, TAU); ctx.fillStyle = "#FFF4E6"; ctx.fill();
    const fl = o.flap ?? 0, wa = -.3 - fl * 1.6; ctx.save(); ctx.translate(-6, -4); ctx.rotate(wa); ctx.beginPath(); ctx.ellipse(-16, 0, 26, 14, 0, 0, TAU); ctx.fillStyle = mix(col); ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(18, -12, 11, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(21 + (o.look || 0) * 3, -12, 5, 0, TAU); ctx.fill();
    const op = o.open ? 6 : 0; ctx.fillStyle = "#F6A623"; ctx.beginPath(); ctx.moveTo(34, -8 - op * .5); ctx.lineTo(56, -2); ctx.lineTo(34, 2); ctx.closePath(); ctx.fill(); ol(ctx, 3);
    if (op){ ctx.beginPath(); ctx.moveTo(34, 2); ctx.lineTo(52, 6 + op); ctx.lineTo(34, 8); ctx.closePath(); ctx.fill(); ol(ctx, 3); }
    ctx.strokeStyle = "#F6A623"; ctx.lineWidth = 5; ctx.lineCap = "round"; [-8, 10].forEach(d => { ctx.beginPath(); ctx.moveTo(d, 34); ctx.lineTo(d, 46); ctx.stroke(); });
    ctx.restore();
    if (o.tag){ ctx.save(); ctx.translate(x, y + 70 * s); const sz = Math.max(22, 30 * s); font(ctx, 900, sz, FAM); const tw = ctx.measureText(o.tag).width + 26;
      ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -30 * s); ctx.lineTo(0, -6); ctx.stroke();
      rr(ctx, -tw / 2, -6, tw, sz * 1.45, 8); ctx.fillStyle = o.tagBg || PAPER; ctx.fill(); ol(ctx, 3); textC(ctx, o.tag, 0, -6 + sz * 1.06, sz, o.tagFg || BROWN, 900); ctx.restore(); }
  }
  function mix(col){ const n = parseInt(col.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, k = .78; return "rgb(" + [r * k, g * k, b * k].map(Math.round).join(",") + ")"; }
  // gear (world): R outer radius, n teeth, rot radians
  function gear(ctx, x, y, R, n, rot, col, label, sub){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
    for (let i = 0; i < n; i++){ const a0 = i / n * TAU, a1 = a0 + TAU / n * .22, a2 = a0 + TAU / n * .5, a3 = a0 + TAU / n * .72;
      ctx.lineTo(Math.cos(a0) * (R - 26), Math.sin(a0) * (R - 26)); ctx.lineTo(Math.cos(a1) * R, Math.sin(a1) * R); ctx.lineTo(Math.cos(a2) * R, Math.sin(a2) * R); ctx.lineTo(Math.cos(a3) * (R - 26), Math.sin(a3) * (R - 26)); }
    ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(0, 0, R * .62, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .18); ctx.fill();
    for (let i = 0; i < 4; i++){ ctx.save(); ctx.rotate(i * TAU / 4 + .4); ctx.beginPath(); ctx.ellipse(R * .4, 0, R * .1, R * .07, 0, 0, TAU); ctx.fillStyle = hexA(OUT, .25); ctx.fill(); ctx.restore(); }
    ctx.restore();
    ctx.beginPath(); ctx.arc(x, y, R * .36, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
    if (label){ fit(ctx, label, R * .66, 34, 900, 16); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(label, x, y + (sub ? 2 : 12)); ctx.textAlign = "left"; if (sub) textC(ctx, sub, x, y + 34, 22, ORANGE, 800, R * .6); }
  }
  function speedLines(ctx, x, y, dir, h, k, col){ ctx.save(); ctx.strokeStyle = col || hexA(OUT, .5); ctx.lineCap = "round";
    for (let i = 0; i < 7; i++){ const yy = y - h / 2 + i * h / 6, len = 120 + rnd(i) * 160, off = ((k * 6 + rnd(i + 3)) % 1) * 80; ctx.lineWidth = 6 + (i % 3) * 2;
      ctx.beginPath(); ctx.moveTo(x - dir * (60 + off), yy); ctx.lineTo(x - dir * (60 + off + len), yy); ctx.stroke(); } ctx.restore(); }
  // full-screen darkness with a soft hole (screen coords)
  let DK = null;
  function darkness(ctx, a, holes){ if (a <= 0) return; ctx.save();
    if (!DK){ DK = document.createElement("canvas"); DK.width = 540; DK.height = 960; } const cv = DK, g = cv.getContext("2d"); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, 540, 960);
    g.fillStyle = "rgba(8,10,26," + a + ")"; g.fillRect(0, 0, 540, 960); g.globalCompositeOperation = "destination-out";
    (holes || []).forEach(h => { const rg = g.createRadialGradient(h[0] / 2, h[1] / 2, 0, h[0] / 2, h[1] / 2, h[2] / 2); rg.addColorStop(0, "rgba(0,0,0," + (h[3] ?? 1) + ")"); rg.addColorStop(.55, "rgba(0,0,0," + (h[3] ?? 1) * .75 + ")"); rg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = rg; g.fillRect(0, 0, 540, 960); });
    ctx.drawImage(cv, 0, 0, 1080, 1920); ctx.restore(); }
  function toonOn(st, a){ return st; }
  function thermo(ctx, x, y, p, t, label){ const h = 300, w = 60;
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * .04);
    rr(ctx, -w / 2, -h, w, h, w / 2); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(0, 10, 52, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
    const fh = (h - 40) * p; rr(ctx, -14, 10 - 40 - fh, 28, fh + 40, 14); ctx.fillStyle = RED; ctx.fill();
    for (let i = 0; i < 6; i++){ ctx.fillStyle = OUT; ctx.fillRect(w / 2 - 22, -60 - i * 40, 14, 4); }
    ctx.fillStyle = hexA("#FFFFFF", .7); ctx.beginPath(); ctx.ellipse(-16, -6, 10, 16, -.5, 0, TAU); ctx.fill();
    ctx.restore();
    if (label && p > .2){ const q = SAT(p, .5, .5); popChip(ctx, label, x + 120, y - 80 - fh * .6, q * .4, RED, "#FFFFFF", 46, .08); }
  }

  /* ================= MS36: _padam (blackout, flashlight, fever) ================= */
  TT.scene(PX + "padam", "Cerita: listrik padam, senter ponsel, anak demam", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, P = Object.assign({ on: 0, kid: 1, label: "39°C" }, f.padam || {});
    const tDark = T(s, P.darkCue, .45, idx), tFever = T(s, P.feverCue, .5, idx);
    let darkA = 0; if (t >= tDark - .55){ const q = t - (tDark - .55); darkA = q < .55 ? ((Math.floor(q * 14) % 3 === 0) ? .78 : .15) : .8; }
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 560 },
      post: (ctx2, c, sts) => {
        if (darkA <= 0) return;
        const kid = sts[P.kid], hero = sts[P.on]; const kh = toonHead(kid), ks = c.toScreen(kh[0], kh[1] + (kid.pose === "sit" ? 13 * kid.size / 92 : 0));
        const hp = handOf(hero), hs = c.toScreen(hp[0], hp[1]);
        const sw = Math.sin(t * 2.1) * 30 + Math.sin(t * 7) * 8, tx = ks[0] + sw, ty = ks[1] + 40;
        darkness(ctx, darkA, t >= tDark ? [[tx, ty, 420 * c.zoom], [hs[0], hs[1], 200]] : []);
        if (t >= tDark){ ctx.save(); ctx.globalCompositeOperation = "lighter"; const a = Math.atan2(ty - hs[1], tx - hs[0]), d = Math.hypot(tx - hs[0], ty - hs[1]) + 200;
          const g = ctx.createLinearGradient(hs[0], hs[1], hs[0] + Math.cos(a) * d, hs[1] + Math.sin(a) * d); g.addColorStop(0, "rgba(255,240,200,.38)"); g.addColorStop(1, "rgba(255,240,200,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hs[0], hs[1]); ctx.lineTo(hs[0] + Math.cos(a - .26) * d, hs[1] + Math.sin(a - .26) * d); ctx.lineTo(hs[0] + Math.cos(a + .26) * d, hs[1] + Math.sin(a + .26) * d); ctx.closePath(); ctx.fill();
          for (let i = 0; i < 14; i++){ const u = (t * .12 + rnd(i)) % 1, v = (rnd(i + 7) - .5) * .4, dd = u * d; ctx.fillStyle = "rgba(255,236,190," + (.5 * Math.sin(u * Math.PI)) + ")"; ctx.beginPath(); ctx.arc(hs[0] + Math.cos(a + v) * dd, hs[1] + Math.sin(a + v) * dd, 4, 0, TAU); ctx.fill(); }
          glowAt(ctx, hs[0], hs[1], 90, "#FFF6DA", .9); ctx.restore(); }
        if (t >= tDark - .55 && t < tDark + .2) popWord(ctx, "PET!", 540, 560, t - tDark + .3, { size: 120, rot: -8, hold: .8, col: GOLD });
      },
      over: (ctx2, c, sts) => {
        if (t < tFever) return; const kid = sts[P.kid], kh = toonHead(kid), sd = kid.pose === "sit" ? 13 * kid.size / 92 : 0;
        const p = eOut(SAT(t, tFever, 1.6)), sc = c.toScreen(kh[0] + kid.size * .36, kh[1] + sd + 120), q = eBack(SAT(t, tFever, .35));
        ctx.save(); ctx.translate(sc[0], sc[1]); ctx.scale(q * c.zoom * .9, q * c.zoom * .9); thermo(ctx, 0, 0, .25 + .7 * p, t, null); ctx.restore();
        if (p > .6) popChip(ctx, P.label, sc[0] - 10, sc[1] - 380 * c.zoom * .9, (t - tFever - 1.0), RED, "#FFFFFF", 54, .06);
        const hs = c.toScreen(kh[0], kh[1] + sd - kid.size * .3); ctx.save(); ctx.strokeStyle = hexA("#FF8A5B", .7); ctx.lineWidth = 7; ctx.lineCap = "round";
        for (let i = 0; i < 3; i++){ const xx = hs[0] - 70 + i * 70, ph = (t * 1.4 + i * .3) % 1; ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.beginPath();
          for (let k = 0; k <= 8; k++){ const yy = hs[1] - ph * 90 - k * 12; ctx.lineTo(xx + Math.sin(k * .9 + t * 6) * 10, yy); } ctx.stroke(); } ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P = f.padam || {}; if (P.darkCue){ const t0 = cueT(s, P.darkCue, .45, i); add(t0 - .5, "pop"); add(t0, "whoosh"); } if (P.feverCue) add(cueT(s, P.feverCue, .5, i), "ping"); });

  /* ================= MS36: _lewat (dashing past the neighbour) ================= */
  function broom(ctx, x, y, s, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = "#9B6A3C"; rr(ctx, -7, -60, 14, 300, 7); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(-14, 230); ctx.lineTo(14, 230); ctx.lineTo(60, 360); ctx.lineTo(-60, 360); ctx.closePath(); ctx.fillStyle = "#E3C27A"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = "#B8933F"; ctx.lineWidth = 3; for (let i = -4; i <= 4; i++){ ctx.beginPath(); ctx.moveTo(i * 3, 240); ctx.lineTo(i * 13, 356); ctx.stroke(); } ctx.restore(); }
  TT.scene(PX + "lewat", "Cerita: tokoh melesat lewat depan rumah tetangga berkali-kali, papan nama ???", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, L = Object.assign({ houseX: 800, dur: 1.0, stopX: 300, sweeper: 0 }, f.lewat || {});
    const passes = (L.passes || []).map((p, j) => Object.assign({ T: T(s, p.cue, .2 + j * .02, idx) }, p)), tName = T(s, L.nameCue, .4, idx), tStop = T(s, L.stopCue, .3, idx);
    const gyH = GY - 150, plate = [L.houseX - 350, gyH - 400];
    base(ctx, s, t, { env: "street", envOpt: { time: L.time || "day" },
      back: () => { house(ctx, L.houseX, gyH, { w: 600, h: 560, wall: "#DCE8C8", roof: "#C2691F", door: "#5A3A2A", doorDx: 60 }, t);
        // gate pillar + plate
        ctx.fillStyle = "#E9DCC8"; rr(ctx, plate[0] - 40, gyH - 340, 80, 340, 6); ctx.fill(); ol(ctx, 4);
        ctx.fillStyle = "#B9A58E"; ctx.fillRect(plate[0] + 40, gyH - 120, L.houseX - 300 - plate[0] - 40 - 40, 18); ctx.fillRect(plate[0] + 40, gyH - 70, L.houseX - 300 - plate[0] - 40 - 40, 18);
        const sh = t >= tName ? Math.sin((t - tName) * 30) * 6 * Math.max(0, 1 - (t - tName) / .8) : 0;
        ctx.save(); ctx.translate(plate[0] + sh, plate[1]); ctx.rotate(-.03); ctx.scale(1.35, 1.35); rr(ctx, -120, -50, 240, 100, 10); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 5); rr(ctx, -106, -36, 212, 72, 6); ctx.fillStyle = "#F3E6D2"; ctx.fill();
        if (t >= tName){ const q = eBack(SAT(t, tName, .35)); ctx.scale(q, q); textC(ctx, "???", 0, 22, 62, RED, 900); }
        else { ctx.fillStyle = hexA(BROWN, .25); rr(ctx, -80, -8, 160, 16, 8); ctx.fill(); }
        ctx.restore();
        if (t >= tName) for (let i = 0; i < 3; i++){ const ph = ((t - tName) * .7 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); textC(ctx, "?", plate[0] - 90 + i * 90, plate[1] - 80 - ph * 140, 64 + i * 8, i === 1 ? ORANGE : BROWN, 900); ctx.restore(); } },
      over1: (ctx2, c, sts, j) => { if (j !== L.sweeper) return; const st = sts[j]; if (st.pose === "wave") return; const h = handOf(st); broom(ctx, h[0], h[1] - 20, st.size / 760, .25 * (st.face || 1) + Math.sin(t * 5) * .22);
        if (Math.sin(t * 5) > .6) for (let i = 0; i < 4; i++){ ctx.fillStyle = hexA("#C9B08A", .5); ctx.beginPath(); ctx.arc(h[0] + 60 + rnd(i + Math.floor(t * 5)) * 120, GY - 10 - rnd(i * 3) * 40, 10, 0, TAU); ctx.fill(); } },
      items: (sts, R0, c) => { const A = L.runner; if (!A) return [];
        return [{ z: 2, draw: () => {
          const cur = passes.filter(p => t >= p.T && t < p.T + L.dur).pop(); let x = null, run = true, dir = 1;
          if (cur){ const u = (t - cur.T) / L.dur; x = lerp(-320, 1420, u); }
          else if (t >= tStop){ const u = SAT(t, tStop, .9); x = lerp(-320, L.stopX, eOut(u)); run = u < 1; }
          if (x == null) return; const st = toonState(A, s, t); st.x = x; st.face = dir; if (run){ st.moving = true; st.run = true; st.moveT = t; st.vx = 1700; } else { st.moving = false; st.run = false; }
          if (cur){ for (let g = 3; g >= 1; g--){ ctx.save(); ctx.globalAlpha = .16 * (4 - g) / 3; const sg = Object.assign({}, st, { x: x - g * 110 }); toon(ctx, (c), Object.assign({}, A, { shadow: false }), s, t, { st: sg }); ctx.restore(); }
            layer(ctx, c, 1, () => { speedLines(ctx, x - 60, GY - st.size * .5, 1, st.size * .8, t, hexA(OUT, .45)); for (let i = 0; i < 5; i++){ const q = ((t - cur.T) * 3 + i / 5) % 1; ctx.fillStyle = hexA("#C9B08A", .6 * (1 - q)); ctx.beginPath(); ctx.arc(x - 120 - q * 260, GY - 20 - q * 50 * rnd(i), 18 + q * 30, 0, TAU); ctx.fill(); } }); }
          toon(ctx, c, A, s, t, { st }); } }]; },
      over: () => { const cur = passes.filter(p => t >= p.T).pop(); if (cur && cur.label) popChip(ctx, cur.label, 540, 300, t - cur.T, cur.night ? NAVY : ORANGE, "#FFFFFF", 46, -.04); },
      spots: { plate: [plate[0] + 100, plate[1] + 60, 1.25] } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const L = f.lewat || {}; (L.passes || []).forEach((p, j) => add(cueT(s, p.cue, .2 + j * .02, i), "whoosh")); if (L.nameCue) add(cueT(s, L.nameCue, .4, i), "ping"); if (L.stopCue) add(cueT(s, L.stopCue, .3, i), "whoosh"); });

  /* ================= MS36: _ketuk (knock, door opens, headlights) ================= */
  function smallCar(ctx, x, y, s, col, lights, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = col; rr(ctx, -200, -40, 400, 90, 30); ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-120, -40); ctx.lineTo(-70, -110); ctx.lineTo(80, -110); ctx.lineTo(130, -40); ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = lights ? "#FFE9A8" : "#7C8FA8"; ctx.beginPath(); ctx.moveTo(-100, -44); ctx.lineTo(-62, -98); ctx.lineTo(70, -98); ctx.lineTo(108, -44); ctx.closePath(); ctx.fill();
    [-120, 120].forEach(dx => { ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(dx, 48, 38, 0, TAU); ctx.fill(); ctx.fillStyle = "#B8AE9D"; ctx.beginPath(); ctx.arc(dx, 48, 15, 0, TAU); ctx.fill(); });
    ctx.fillStyle = lights ? "#FFF6C8" : "#D9D2C2"; ctx.beginPath(); ctx.ellipse(-192, 0, 12, 18, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(192, 0, 12, 18, 0, 0, TAU); ctx.fill();
    if (lights){ glowAt(ctx, -230, 0, 220, "#FFF2B8", .7); glowAt(ctx, 230, 0, 220, "#FFF2B8", .7); }
    ctx.restore(); }
  TT.scene(PX + "ketuk", "Cerita: pintu diketuk, terbuka, tetangga + lampu mobil", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ doorX: 760, w: 420, h: 610, on: 0 }, f.ketuk || {});
    const tKnock = T(s, K.knockCue, .2, idx), tOpen = T(s, K.openCue, .2, idx), tCar = T(s, K.carCue, .3, idx);
    const fy = GY - 190, dx0 = K.doorX - K.w / 2, top = fy - K.h, open = eOut(SAT(t, tOpen, .8)), lights = t >= tCar;
    const knockK = [tKnock, tKnock + .45, tKnock + .9].map(k => t - k).filter(k => k >= 0 && k < .35);
    const shake = knockK.length ? Math.sin(knockK[0] * 60) * 9 * (1 - knockK[0] / .35) : 0;
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 330 },
      back: () => {
        ctx.fillStyle = "#4E2A17"; rr(ctx, dx0 - 30, top - 30, K.w + 60, K.h + 30, 8); ctx.fill(); ol(ctx, 5);
        ctx.save(); rr(ctx, dx0, top, K.w, K.h, 4); ctx.clip();
        const g = ctx.createLinearGradient(0, top, 0, fy); g.addColorStop(0, "#141B38"); g.addColorStop(1, "#3A3150"); ctx.fillStyle = g; ctx.fillRect(dx0, top, K.w, K.h);
        for (let i = 0; i < 14; i++){ ctx.globalAlpha = .5 + .5 * Math.abs(Math.sin(t * 2 + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(dx0 + rnd(i) * K.w, top + rnd(i + 4) * K.h * .45, 2.6, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
        ctx.fillStyle = "#2A2440"; ctx.fillRect(dx0, fy - 170, K.w, 170); ctx.fillStyle = "#5B4A4A"; ctx.fillRect(dx0, fy - 40, K.w, 40);
        smallCar(ctx, K.doorX + 150, fy - 110, .55, "#2F6F73", lights, t);
        if (lights) glowAt(ctx, K.doorX, fy - 120, 420, "#FFE7A8", .28 + .04 * Math.sin(t * 9));
        ctx.restore(); },
      midZ: -.5,
      mid: () => { // the door leaf, hinge on the left
        const w = K.w * Math.max(.06, Math.cos(open * 1.35)), x = dx0 + shake;
        ctx.save(); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + w, top - 40 * open); ctx.lineTo(x + w, fy + 40 * open); ctx.lineTo(x, fy); ctx.closePath(); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5);
        if (w > 120){ ctx.strokeStyle = hexA(OUT, .45); ctx.lineWidth = 4; [[.12, .08, .76, .38], [.12, .54, .76, .38]].forEach(([a, b, c2, d]) => { ctx.strokeRect(x + w * a, top + K.h * b, w * c2, K.h * d); }); }
        ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(x + w * .86, top + K.h * .5, 10, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); },
      post: (ctx2, c, sts) => {
        const hero = sts[K.on], hp = handOf(hero), hs = c.toScreen(hp[0], hp[1]), ds = c.toScreen(K.doorX, top + K.h * .45);
        const a = lights ? .35 : (open > 0 ? .62 - .1 * open : .66), holes = [[hs[0], hs[1], 420], [540, 820, 900, .35]];
        if (open > 0) holes.push([ds[0], ds[1], 1000 * open * c.zoom]);
        darkness(ctx, a, holes);
        if (lights){ ctx.save(); ctx.globalCompositeOperation = "lighter"; const q = SAT(t, tCar, .5), fl = c.toScreen(K.doorX, fy - 80);
          const g = ctx.createRadialGradient(fl[0], fl[1], 0, fl[0], fl[1], 900); g.addColorStop(0, "rgba(255,236,170," + (.4 * q) + ")"); g.addColorStop(1, "rgba(255,236,170,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(fl[0] - 120, fl[1] - 160); ctx.lineTo(fl[0] + 120, fl[1] - 160); ctx.lineTo(fl[0] + 700, 1920); ctx.lineTo(fl[0] - 900, 1920); ctx.closePath(); ctx.fill(); ctx.restore(); } },
      over: (ctx2, c) => { const ds = c.toScreen(K.doorX, top + 150);
        [tKnock, tKnock + .45].forEach((k, j) => { if (t >= k) { popWord(ctx, "TOK!", ds[0] + (j ? 120 : -120), ds[1] - 40 - j * 60, t - k, { size: 100, rot: j ? 8 : -8, hold: 1.0, col: GOLD });
          const q = t - k; if (q < .6){ ctx.save(); ctx.strokeStyle = hexA(GOLD, 1 - q / .6); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(ds[0], ds[1] + 120, 60 + q * 300, 0, TAU); ctx.stroke(); ctx.restore(); } } });
        if (lights){ const cs = c.toScreen(K.doorX + 150, fy - 200); popWord(ctx, "BRRMM!", cs[0] + 60, cs[1] - 120, t - tCar, { size: 84, rot: -6, hold: 1.4, col: HL });
          for (let i = 0; i < 4; i++){ const q = ((t - tCar) * 1.2 + i / 4) % 1; ctx.save(); ctx.globalAlpha = .5 * (1 - q); ctx.fillStyle = "#D9D2C2"; ctx.beginPath(); ctx.arc(cs[0] + 160 + q * 80, cs[1] + 150 - q * 60, 16 + q * 30, 0, TAU); ctx.fill(); ctx.restore(); } } },
      spots: { door: [K.doorX, top + 260, 1.2] } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.ketuk || {}; if (K.knockCue){ const t0 = cueT(s, K.knockCue, .2, i); add(t0, "pop"); add(t0 + .45, "pop"); } if (K.openCue) add(cueT(s, K.openCue, .2, i), "whoosh"); if (K.carCue) add(cueT(s, K.carCue, .3, i), "chime"); });

  /* ================= MS36: _jarak (far relatives vs neighbour next door) ================= */
  function clockFace(ctx, x, y, r, t, spin){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
    for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.fillStyle = OUT; ctx.fillRect(x + Math.cos(a) * r * .78 - 3, y + Math.sin(a) * r * .78 - 3, 6, 6); }
    const a1 = t * spin, a2 = t * spin / 12; ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a2 - 1.57) * r * .45, y + Math.sin(a2 - 1.57) * r * .45); ctx.stroke();
    ctx.lineWidth = 5; ctx.strokeStyle = RED; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a1 - 1.57) * r * .7, y + Math.sin(a1 - 1.57) * r * .7); ctx.stroke(); }
  TT.scene(PX + "jarak", "Cerita: rumah saudara jauh di bukit vs rumah tetangga selangkah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, J = Object.assign({ farX: -1150, farY: 1020, homeX: 300, nbX: 820, hy: 1540 }, f.jarak || {});
    const tFar = T(s, J.farCue, .2, idx), tStep = T(s, J.stepCue, .4, idx), tHelp = T(s, J.helpCue, .3, idx);
    base(ctx, s, t, { env: "sky", envOpt: { time: J.time || "dusk", hills: true },
      back: () => {
        // far hill + road
        ctx.fillStyle = "#8FAE6B"; ctx.beginPath(); ctx.ellipse(J.farX, J.farY + 250, 520, 260, 0, Math.PI, 0); ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = "#7FA563"; ctx.fillRect(-2600, J.hy - 60, 4400, 1000);
        ctx.strokeStyle = "#E9D3A8"; ctx.lineCap = "round"; ctx.lineJoin = "round";
        const road = [[J.homeX - 80, J.hy + 40], [-250, J.hy - 10], [-700, J.hy - 60], [-300, J.farY + 300], [-900, J.farY + 200], [-600, J.farY + 120], [J.farX + 40, J.farY + 40]];
        [[90, "#C9A877"], [70, "#E9D3A8"]].forEach(([w, col]) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(road[0][0], road[0][1]);
          for (let i = 1; i < road.length - 1; i++){ const m = [(road[i][0] + road[i + 1][0]) / 2, (road[i][1] + road[i + 1][1]) / 2]; ctx.quadraticCurveTo(road[i][0], road[i][1], m[0], m[1]); } ctx.lineTo(road[road.length - 1][0], road[road.length - 1][1]); ctx.stroke(); });
        ctx.save(); ctx.setLineDash([26, 26]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(road[0][0], road[0][1]);
        for (let i = 1; i < road.length - 1; i++){ const m = [(road[i][0] + road[i + 1][0]) / 2, (road[i][1] + road[i + 1][1]) / 2]; ctx.quadraticCurveTo(road[i][0], road[i][1], m[0], m[1]); } ctx.stroke(); ctx.restore();
        ctx.save(); ctx.translate(J.farX, J.farY); ctx.scale(.32, .32); house(ctx, 0, 0, { w: 420, h: 380, wall: "#F3D9B5", roof: "#8E4E2E", lit: true }, t); ctx.restore();
        // near houses
        house(ctx, J.homeX, J.hy, { w: 460, h: 470, wall: "#F6E3C6", roof: "#2F6F73", lit: true, doorDx: 70 }, t);
        house(ctx, J.nbX, J.hy, { w: 460, h: 470, wall: "#DCE8C8", roof: "#C2691F", lit: true, doorDx: -70 }, t);
        // step arc + footprint
        if (t >= tStep){ const q = eOut(SAT(t, tStep, .7)); ctx.save(); ctx.setLineDash([22, 18]); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.beginPath();
          const a0 = J.homeX + 70, a1 = J.nbX - 70; ctx.moveTo(a0, J.hy - 300); ctx.quadraticCurveTo((a0 + a1) / 2, J.hy - 700, lerp(a0, a1, q), J.hy - 300 - 4 * 400 * q * (1 - q) * .5 * 0); ctx.stroke(); ctx.restore(); }
        if (t >= tHelp){ const q = eBack(SAT(t, tHelp, .6)), pul = 1 + .03 * Math.sin(t * 5); ctx.save(); ctx.translate((J.homeX + J.nbX) / 2, J.hy - 160); ctx.scale(q * pul, q * pul);
          ctx.strokeStyle = GOLD; ctx.lineWidth = 14; ctx.shadowColor = GOLD; ctx.shadowBlur = 30; ctx.beginPath(); ctx.ellipse(0, 0, 560, 420, 0, 0, TAU); ctx.stroke(); ctx.restore(); } },
      over: (ctx2, c) => {
        if (t >= tFar){ const p = c.toScreen(J.farX, J.farY - 200); const q = eBack(SAT(t, tFar, .4)); ctx.save(); ctx.translate(p[0] + 170, p[1] - 40); ctx.scale(q, q); clockFace(ctx, 0, 0, 70, t, 9); ctx.restore();
          popChip(ctx, "SAUDARA", p[0] - 60, p[1] - 40, t - tFar, PAPER, BROWN, 40, -.05); popChip(ctx, "± 2 JAM", p[0] + 170, p[1] + 70, t - tFar - .4, RED, "#FFFFFF", 40, .05); }
        if (t >= tStep){ const p = c.toScreen((J.homeX + J.nbX) / 2, J.hy - 820); popChip(ctx, "1 LANGKAH", p[0], p[1], t - tStep - .3, ORANGE, "#FFFFFF", 50, -.05);
          const fp = c.toScreen((J.homeX + J.nbX) / 2, J.hy - 690), q = eBack(SAT(t, tStep + .1, .35)); if (q > 0){ ctx.save(); ctx.translate(fp[0], fp[1]); ctx.scale(q * c.zoom, q * c.zoom); ctx.rotate(.3);
            ctx.fillStyle = hexA(BROWN, .85); ctx.beginPath(); ctx.ellipse(0, 20, 34, 56, 0, 0, TAU); ctx.fill(); [[-26, -52, 12], [-6, -62, 13], [14, -58, 12], [30, -46, 10]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }); ctx.restore(); } }
        if (t >= tHelp){ const p = c.toScreen((J.homeX + J.nbX) / 2, J.hy - 160); for (let i = 0; i < 6; i++){ const ph = ((t - tHelp) * .5 + i / 6) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.translate(p[0] + (rnd(i) - .5) * 700, p[1] - ph * 420);
            ctx.fillStyle = i % 2 ? RED : HL; ctx.beginPath(); ctx.moveTo(0, 14); ctx.bezierCurveTo(-34, -10, -16, -36, 0, -18); ctx.bezierCurveTo(16, -36, 34, -10, 0, 14); ctx.fill(); ctx.restore(); }
          popChip(ctx, J.helpTag || "ORANG TERDEKAT", 540, 330, t - tHelp - .2, GOLD, BROWN, 50, -.04); } },
      spots: { far: [J.farX - 50, J.farY - 80, 1.15], near: [(J.homeX + J.nbX) / 2, 1080, 1] } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const J = f.jarak || {}; if (J.farCue) add(cueT(s, J.farCue, .2, i), "pop"); if (J.stepCue) add(cueT(s, J.stepCue, .4, i) + .3, "pop"); if (J.helpCue) add(cueT(s, J.helpCue, .3, i), "chime"); });

  /* ================= SB37: _kantung (giant eye bags) ================= */
  TT.scene(PX + "kantung", "Cerita: kantung mata raksasa jadi tas belanja", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ on: 0, len0: 120, len1: 330 }, f.bags || {});
    const tGrow = T(s, B.growCue, .3, idx), tShop = T(s, B.shopCue, .4, idx);
    base(ctx, s, t, { env: "office", envOpt: Object.assign({ deskX: 860, plantX: 120 }, f.envOpt || {}),
      over1: (ctx2, c, sts, j, R) => { if (j !== B.on || !R[j]) return; const a = R[j], st = sts[j], k = a.k, fc = a.face || 1;
        const L = lerp(B.len0, B.len1, eBack(SAT(t, tGrow, .7))) * st.size / 760, shop = SAT(t, tShop, .35), sw0 = st.moving ? Math.sin(t * 9) * .18 : 0;
        [-1, 1].forEach((d, n) => { const ex = a.headX + fc * (2.6 + d * 7.3) * k, ey = a.headY + 3 * k, sw = Math.sin(t * 3.1 + n) * .1 + sw0 + d * .04;
          ctx.save(); ctx.translate(ex, ey); ctx.rotate(sw); const w = 6.4 * k * (1 + .1 * Math.sin(t * 2 + n));
          ctx.beginPath(); ctx.moveTo(-w * .8, 0); ctx.bezierCurveTo(-w * 1.6, L * .5, -w * 1.9, L, 0, L + w * .4); ctx.bezierCurveTo(w * 1.9, L, w * 1.6, L * .5, w * .8, 0); ctx.closePath();
          ctx.fillStyle = shop > 0 ? (n ? "#E8A55B" : "#5B7DB1") : "#9C88B8"; ctx.fill(); ol(ctx, 5);
          ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 3; for (let i = 1; i < 4; i++){ ctx.beginPath(); ctx.arc(0, L * i / 4.2, w * (.6 + i * .25), .35 * Math.PI, .65 * Math.PI); ctx.stroke(); }
          if (shop > 0){ const q = eBack(shop); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, L * .32, w * .9 * q, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
            ctx.fillStyle = PAPER; rr(ctx, -w * 1.1, L * .55, w * 2.2, L * .22, 6); ctx.fill(); ol(ctx, 3); textC(ctx, n ? "XXL" : "SALE", 0, L * .55 + L * .17, Math.max(18, L * .13), n ? ORANGE : TEAL, 900, w * 2); }
          ctx.restore(); }); },
      over: (ctx2, c, sts, R) => { if (t >= tShop && R[B.on]){ const a = R[B.on], p = c.toScreen(a.headX + 260, a.headY + 120); popWord(ctx, "TAS BELANJA?!", p[0], p[1] - 330, t - tShop, { size: 76, rot: 6, hold: 1.5 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.bags || {}; if (B.growCue) add(cueT(s, B.growCue, .3, i), "whoosh"); if (B.shopCue) add(cueT(s, B.shopCue, .4, i), "pop"); });

  /* ================= SB37: _lampu (marquee habit board) ================= */
  TT.scene(PX + "lampu", "Cerita: papan lampu catatan tiap malam", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bd = Object.assign({ x: 690, y: 520, w: 600, rows: [] }, f.board || {});
    const t0 = T(s, Bd.startCue, .2, idx), t1 = T(s, Bd.endCue, .8, idx), n = Bd.rows.length, rowH = 64, H0 = 110 + n * rowH + 24;
    const act = j => t0 + (t1 - t0) * j / n;
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 300 },
      back: () => { if (t < t0 - .3) return; const q = eBack(SAT(t, t0 - .3, .5)), x0 = Bd.x - Bd.w / 2;
        ctx.save(); ctx.translate(Bd.x, Bd.y); ctx.scale(q, q); ctx.translate(-Bd.x, -Bd.y);
        ctx.fillStyle = "rgba(0,0,0,.25)"; rr(ctx, x0 + 14, Bd.y + 16, Bd.w, H0, 18); ctx.fill();
        rr(ctx, x0, Bd.y, Bd.w, H0, 18); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 7);
        for (let i = 0; i < 22; i++){ const on = Math.sin(t * 6 + i * .7) > 0; const px = x0 + 20 + i * (Bd.w - 40) / 21; ctx.fillStyle = on ? GOLD : "#6B5A3A"; ctx.beginPath(); ctx.arc(px, Bd.y + 18, 7, 0, TAU); ctx.fill(); }
        textL(ctx, Bd.title || "CATATAN MALAM", x0 + 26, Bd.y + 76, 40, "#FFFFFF", 900, Bd.w * .62);
        const cur = clamp(Math.floor((t - t0) / ((t1 - t0) / n)) + 1, 0, n); popChip(ctx, "MALAM " + cur + "/" + n, x0 + Bd.w - 120, Bd.y + 62, 1, ORANGE, "#FFFFFF", 26);
        Bd.rows.forEach((r, j) => { const ta = act(j), y = Bd.y + 110 + j * rowH, lit = t >= ta, nb = 8, on = Math.round(r.v * nb), pr = SAT(t, ta, .6);
          textL(ctx, r.d, x0 + 24, y + 42, 32, lit ? "#FFFFFF" : "#6A7899", 900);
          for (let b = 0; b < nb; b++){ const bx = x0 + 120 + b * 34, bOn = lit && b < on && pr * nb >= b; if (bOn) glowAt(ctx, bx, y + 30, 30, r.hl ? RED : GOLD, .55);
            ctx.beginPath(); ctx.arc(bx, y + 30, 12, 0, TAU); ctx.fillStyle = bOn ? (r.hl ? "#FF7A5C" : GOLD) : "#2A3A5C"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); }
          if (lit){ const txt = r.time, m = Math.round(txt.length * SAT(t, ta + .1, .6)); textL(ctx, txt.slice(0, m), x0 + 410, y + 42, 28, r.hl ? "#FFB49C" : "#FFF4E6", 800, Bd.w - 430);
            if (j === cur - 1 && t < t1) { const cx = x0 + 410 + Math.min(Bd.w - 440, m * 15); if (Math.sin(t * 10) > 0){ ctx.fillStyle = "#FFFFFF"; ctx.fillRect(cx, y + 14, 4, 34); } } } });
        ctx.restore(); },
      over: (ctx2, c) => { const k = t - t1; if (k > 0 && Bd.doneText){ const p = c.toScreen(Bd.x, Bd.y + H0 + 50); popChip(ctx, Bd.doneText, p[0], p[1], k, ORANGE, "#FFFFFF", 40, -.04); } },
      spots: { board: [Bd.x - 60, Bd.y + H0 / 2 + 120, 1.12] } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bd = f.board || {}; if (Bd.startCue){ const t0 = cueT(s, Bd.startCue, .2, i), t1 = cueT(s, Bd.endCue, .8, i), n = (Bd.rows || []).length;
    for (let j = 0; j < n; j++) add(t0 + (t1 - t0) * j / n, "ping"); } });

  /* ================= SB37: _lahap (phone monster gobbles hour-cookies night by night) ================= */
  function star5(ctx, x, y, r, col){ ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
  function cookie(ctx, x, y, r, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#E8B06A"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = BROWN; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * .6); ctx.moveTo(0, 0); ctx.lineTo(r * .45, 0); ctx.stroke();
    ctx.fillStyle = "#6B3E1F"; [[-.5, .4], [.45, .5], [-.3, -.5]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a * r, b * r, r * .1, 0, TAU); ctx.fill(); }); ctx.restore(); }
  function phoneMon(ctx, x, y, s, t, open, sq){ ctx.save(); ctx.translate(x, y); ctx.scale(s * (sq || 1), s / (sq || 1));
    ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round"; [-30, 30].forEach((d, i) => { ctx.beginPath(); ctx.moveTo(d, -10); ctx.lineTo(d + Math.sin(t * 12 + i * 3) * 8, 0); ctx.stroke(); });
    rr(ctx, -80, -250, 160, 240, 30); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6); rr(ctx, -64, -232, 128, 200, 18); ctx.fillStyle = "#BFE2EA"; ctx.fill();
    glowAt(ctx, 0, -140, 160, "#BFE2EA", .25);
    [-28, 28].forEach(d => { ctx.beginPath(); ctx.arc(d, -175, 20, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(d + 4, -172, 9, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-52, -206); ctx.lineTo(-14, -196); ctx.moveTo(52, -206); ctx.lineTo(14, -196); ctx.stroke();
    const oy = 8 + 40 * (open || 0); ctx.beginPath(); ctx.ellipse(0, -100, 44, oy, 0, 0, TAU); ctx.fillStyle = "#7A1F1F"; ctx.fill(); ol(ctx, 4);
    if (open > .2){ ctx.fillStyle = "#FFFFFF"; for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.moveTo(k * 15 - 6, -100 - oy + 2); ctx.lineTo(k * 15 + 6, -100 - oy + 2); ctx.lineTo(k * 15, -100 - oy + 14); ctx.closePath(); ctx.fill(); } }
    ctx.restore(); }
  TT.scene(PX + "lahap", "Cerita: monster ponsel melahap kue-jam tiap malam, lahap di malam lembur", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Lh = Object.assign({ plates: [], step: .55, tableY: 1180, x0: 240, dx: 132 }, f.lahap || {});
    const t0 = T(s, Lh.startCue, .2, idx), tHl = T(s, Lh.hlCue, .3, idx), tTag = T(s, Lh.tagCue, .3, idx), n = Lh.plates.length;
    const tj = j => t0 + j * Lh.step, px = j => Lh.x0 + j * Lh.dx, ty = Lh.tableY;
    const cur = clamp(Math.floor((t - t0) / Lh.step), -1, n - 1), eatenHL = Lh.plates.filter((p, j) => p.hl && t > tj(j) + .35).length, eaten = Math.max(0, cur + 1);
    base(ctx, s, t, { env: "night",
      front: () => {
        ctx.fillStyle = "#8E4E2E"; rr(ctx, Lh.x0 - 110, ty, n * Lh.dx + 130, 34, 10); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#6B3A22"; ctx.fillRect(Lh.x0 - 95, ty + 34, n * Lh.dx + 100, GY - ty); ol(ctx, 4);
        Lh.plates.forEach((p, j) => { const x = px(j), hl = p.hl && t >= tHl; if (hl) glowAt(ctx, x, ty - 40, 170, HL, .5 + .15 * Math.sin(t * 6));
          ctx.beginPath(); ctx.ellipse(x, ty - 4, 48, 14, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3);
          const gone = t > tj(j) + .25 ? clamp((t - tj(j) - .25) / (Lh.step * .7), 0, 1) : 0, left = Math.ceil(p.n * (1 - gone));
          for (let k = 0; k < left; k++) cookie(ctx, x + (k % 2 ? 10 : -10), ty - 28 - k * 32, 28, k * .7 + j);
          textC(ctx, p.d, x, ty + 82, 32, hl ? GOLD : "#FFF4E6", 900);
          if (hl) popChip(ctx, p.tag || "LEMBUR", x, ty - 70 - p.n * 34 - 40, t - tHl, RED, "#FFFFFF", 26, -.06);
          if (gone > 0 && gone < 1) for (let c = 0; c < 6; c++){ const q = (gone * 2 + c / 6) % 1; ctx.fillStyle = hexA("#C98B4A", 1 - q); ctx.beginPath(); ctx.arc(x + (rnd(c + j * 7) - .5) * 160 * q, ty - 60 - 80 * Math.sin(q * Math.PI), 6, 0, TAU); ctx.fill(); } });
        if (t >= t0 - .4){ let x, y = ty, open = 0, sq = 1; const j = Math.max(0, cur);
          if (cur < 0){ x = lerp(1300, px(0), eOut(SAT(t, t0 - .4, .4))); }
          else { const u = clamp((t - tj(j)) / Lh.step, 0, 1); const hop = j > 0 && u < .3; x = hop ? lerp(px(j - 1), px(j), eOut(u / .3)) : px(j); y = ty - (hop ? Math.sin(u / .3 * Math.PI) * 90 : 0);
            open = !hop && cur < n ? Math.abs(Math.sin((t - tj(j)) * 14)) : 0; sq = hop ? 1.08 : 1 + .05 * Math.sin(t * 14); if (t > tj(n - 1) + Lh.step){ open = 0; sq = 1 + .03 * Math.sin(t * 3); } }
          phoneMon(ctx, x - 58, y, .8 + .04 * eaten + .14 * eatenHL, t, open, sq); } },
      over: () => { if (t >= tTag && Lh.tag) popChip(ctx, Lh.tag, 540, 330, t - tTag, ORANGE, "#FFFFFF", 46, -.04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Lh = f.lahap || {}; if (Lh.startCue){ const t0 = cueT(s, Lh.startCue, .2, i); (Lh.plates || []).forEach((p, j) => add(t0 + j * (Lh.step || .55) + .25, p.hl ? "pop" : "ping")); }
    if (Lh.hlCue) add(cueT(s, Lh.hlCue, .3, i), "chime"); });


  /* ================= SB37: _ski (ski down the falling sleep-time chart) ================= */
  TT.scene(PX + "ski", "Cerita: grafik jam tidur jadi lereng ski, ponsel dicas di tiang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sk = Object.assign({ pts: [], postX: 130, startX: 300 }, f.ski || {});
    const tPlug = T(s, Sk.plugCue, .3, idx), tGo = T(s, Sk.goCue, .3, idx), tLand = T(s, Sk.landCue, .5, idx);
    const P = Sk.pts, lineY = x => { if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]){ const u = (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return lerp(P[i - 1][1], P[i][1], u); } return P[P.length - 1][1]; };
    const endX = P[P.length - 1][0] - 60, u = t < tGo ? 0 : clamp((t - tGo) / Math.max(1, tLand - tGo), 0, 1), bx = lerp(Sk.startX, endX, u < 1 ? u * u * (3 - 2 * u) * .3 + u * .7 : 1), by = lineY(bx);
    const slope = Math.atan2(lineY(bx + 40) - lineY(bx - 40), 80), moving = t >= tGo && u < 1;
    const hero = Sk.hero, postTop = lineY(Sk.postX) - 330;
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: true },
      spots: { ski: () => [bx + 140, by - 260, 1], top: [Sk.postX + 300, P[0][1] - 120, 1] },
      back: () => {
        ctx.beginPath(); ctx.moveTo(P[0][0] - 400, P[0][1]); P.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(P[P.length - 1][0] + 900, P[P.length - 1][1]); ctx.lineTo(P[P.length - 1][0] + 900, 2400); ctx.lineTo(P[0][0] - 400, 2400); ctx.closePath();
        const g = ctx.createLinearGradient(0, P[0][1], 0, 1900); g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, "#D6E9F2"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 12; ctx.lineJoin = "round"; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
        ctx.strokeStyle = hexA("#9DB7C8", .5); ctx.lineWidth = 3; for (let i = 0; i < 18; i++){ const x = P[0][0] + i * 120, y = lineY(x) + 60 + rnd(i) * 160; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60, y + 10); ctx.stroke(); }
        P.forEach((p, i) => { ctx.beginPath(); ctx.arc(p[0], p[1], 14, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); if (p[2]) textC(ctx, p[2], p[0], p[1] + 62, 30, BROWN, 900); });
        ctx.strokeStyle = hexA("#9DB7C8", .6); ctx.lineWidth = 4; ctx.setLineDash([12, 12]); P.forEach(p => { ctx.beginPath(); ctx.moveTo(p[0], p[1] + 90); ctx.lineTo(p[0], 1900); ctx.stroke(); }); ctx.setLineDash([]);
        [[-120, 1500, 1.1], [1100, 1600, .9], [2100, 1560, 1.2]].forEach(([x, y, k]) => { ctx.fillStyle = "#3E7D4F"; for (let l = 0; l < 3; l++){ ctx.beginPath(); ctx.moveTo(x - (90 - l * 20) * k, y - l * 70 * k); ctx.lineTo(x, y - (150 + l * 70) * k); ctx.lineTo(x + (90 - l * 20) * k, y - l * 70 * k); ctx.closePath(); ctx.fill(); ol(ctx, 4); } ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(x - 30 * k, y - 250 * k); ctx.lineTo(x, y - 290 * k); ctx.lineTo(x + 30 * k, y - 250 * k); ctx.closePath(); ctx.fill(); });
        // charger post
        const px = Sk.postX, py = lineY(px); ctx.fillStyle = "#7A4A2E"; rr(ctx, px - 10, postTop, 20, py - postTop, 6); ctx.fill(); ol(ctx, 4);
        rr(ctx, px - 70, postTop - 30, 140, 150, 16); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); rr(ctx, px - 44, postTop - 8, 88, 108, 10); ctx.fillStyle = "#16383A"; ctx.fill();
        if (Sk.postLabel){ ctx.save(); ctx.translate(px, postTop + 170); ctx.rotate(-.04); chip(ctx, Sk.postLabel, 0, 0, GOLD, BROWN, 26); ctx.restore(); }
        if (t >= tPlug + .6){ prop(ctx, "phone", px, postTop + 98, { s: .42, screen: "#BFE2EA" }, t); const blink = .6 + .4 * Math.sin(t * 6);
          ctx.save(); ctx.globalAlpha = blink; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(px + 6, postTop - 90); ctx.lineTo(px - 22, postTop - 40); ctx.lineTo(px, postTop - 40); ctx.lineTo(px - 8, postTop - 4); ctx.lineTo(px + 24, postTop - 56); ctx.lineTo(px + 2, postTop - 56); ctx.closePath(); ctx.fill(); ol(ctx, 3); ctx.restore(); } },
      items: (sts, R0, c) => [{ z: 1, draw: () => {
        const st = toonState(hero, s, t); st.x = bx; st.y = by; st.face = 1; st.moving = false;
        if (t < tPlug){ const h = handOf(st); layer(ctx, c, 1, () => prop(ctx, "phone", h[0] + 10, h[1], { s: .42 }, t)); }
        const fs = c.toScreen(bx, by); ctx.save(); ctx.translate(fs[0], fs[1]); ctx.rotate(slope * .7); ctx.translate(-fs[0], -fs[1]);
        layer(ctx, c, 1, () => { const k = st.size / 92; [-1, 1].forEach(d => { ctx.save(); ctx.translate(bx + d * 6 * k, by + 2); rr(ctx, -34 * k, -3 * k, 68 * k, 6 * k, 3 * k); ctx.fillStyle = d > 0 ? RED : ORANGE; ctx.fill(); ol(ctx, 3);
          ctx.beginPath(); ctx.arc(34 * k, -6 * k, 4 * k, -1.2, 1.3); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }); });
        toon(ctx, c, Object.assign({}, hero, { shadow: false }), s, t, { st }); ctx.restore();
        if (moving) layer(ctx, c, 1, () => { for (let i = 0; i < 14; i++){ const q = ((t - tGo) * 3 + i / 14) % 1; ctx.fillStyle = hexA("#FFFFFF", .9 * (1 - q)); ctx.beginPath(); ctx.arc(bx - 60 - q * 260, by - 20 - q * 160 * rnd(i) - 40 * Math.sin(q * 3), 10 + q * 26, 0, TAU); ctx.fill(); }
          speedLines(ctx, bx - 120, by - st.size * .5, 1, st.size * .6, t, hexA("#7FA6BF", .55)); });
        // phone flying to the post
        if (t >= tPlug && t < tPlug + .6){ const q = (t - tPlug) / .6, h = handOf(st), x = lerp(h[0], Sk.postX, eOut(q)), y = lerp(h[1], postTop + 98, eOut(q)) - Math.sin(q * Math.PI) * 160;
          layer(ctx, c, 1, () => { ctx.save(); ctx.translate(x, y); ctx.rotate(q * 6); prop(ctx, "phone", 0, 0, { s: .42 }, t); ctx.restore(); }); } } }],
      over: (ctx2, c) => { if (Sk.hiLabel && t < tGo + .3) popChip(ctx, Sk.hiLabel, 540, 330, t - .3, RED, "#FFFFFF", 44, -.04); if (Sk.loLabel && t >= tLand) popChip(ctx, Sk.loLabel, 540, 330, t - tLand - .4, GREEN, "#FFFFFF", 44, .04);
        if (t >= tLand){ stampBox(ctx, Sk.stamp || "1 JAM LEBIH AWAL", 540, 560, t - tLand, GREEN, 66, -.08); burstFx(ctx, 540, 560, t - tLand - .1, GREEN, 12, 300); }
        if (t >= tPlug + .6 && Sk.plugPop){ const p = c.toScreen(Sk.postX, postTop - 140); popWord(ctx, Sk.plugPop, p[0] + 80, p[1], t - tPlug - .6, { size: 70, rot: -6, hold: 1.4, col: GREEN }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Sk = f.ski || {}; if (Sk.plugCue) { add(cueT(s, Sk.plugCue, .3, i), "whoosh"); add(cueT(s, Sk.plugCue, .3, i) + .6, "ping"); } if (Sk.goCue) add(cueT(s, Sk.goCue, .3, i), "whoosh"); if (Sk.landCue) add(cueT(s, Sk.landCue, .5, i), "chime"); });

  /* ================= SP37: _burung (promise birds settle in a nest on the head) ================= */
  function tagChip(ctx, txt, x, y, s, bg, fg){ const sz = Math.max(22, 30 * s); font(ctx, 900, sz, FAM); const tw = ctx.measureText(txt).width + 26;
    rr(ctx, x - tw / 2, y - sz * .72, tw, sz * 1.45, 8); ctx.fillStyle = bg || PAPER; ctx.fill(); ol(ctx, 3); textC(ctx, txt, x, y + sz * .34, sz, fg || BROWN, 900); }
  function nestAt(ctx, x, y, w, q){ if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    ctx.beginPath(); ctx.ellipse(0, 0, w / 2, w * .2, 0, 0, Math.PI); ctx.fillStyle = "#8E5A2E"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "#C9935A"; ctx.lineWidth = 5; ctx.lineCap = "round"; for (let i = 0; i < 9; i++){ const a = -w / 2 + i * w / 8; ctx.beginPath(); ctx.moveTo(a, -4 + (i % 2) * 6); ctx.quadraticCurveTo(a + 30, w * .12, a + 60 * (i % 2 ? 1 : -1), w * .05); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(0, 0, w / 2, w * .07, 0, 0, TAU); ctx.fillStyle = "#6B4426"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
  function birdHead(sts, R, on){ const a = R[on]; if (a) return [a.headX, a.headY, a.r]; const h = toonHead(sts[on]); return [h[0], h[1], sts[on].size * 20.5 / 92]; }
  TT.scene(PX + "burung", "Cerita: burung-burung janji hinggap lalu bersarang di kepala", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bb = Object.assign({ on: 0, list: [] }, f.birds || {});
    const tNest = T(s, Bb.nestCue, .3, idx), n = Bb.list.length;
    base(ctx, s, t, { env: "office", envOpt: Object.assign({ deskX: 900, plantX: 130 }, f.envOpt || {}),
      over1: (ctx2, c, sts, j, R) => { if (j !== Bb.on) return; const [hx, hy, r] = birdHead(sts, R, j), bs = sts[j].size / 640 * 1.55, nq = eBack(SAT(t, tNest, .45));
        if (nq > 0) nestAt(ctx, hx, hy - r * .9, r * 2.7, nq);
        Bb.list.forEach((b, i) => { const ta = T(s, b.cue, .25, idx); if (t < ta) return;
          const slot = [[-1.45, -1.15], [0, -1.95], [1.45, -1.15]][i % 3], sx = hx + slot[0] * r, sy = hy + slot[1] * r, nx = hx + (i - (n - 1) / 2) * r * .8, ny = hy - r * 1.2;
          const fq = SAT(t, ta, .9), dir = i % 2 ? 1 : -1, fx0 = sx + dir * 900, fy0 = sy - 600; let x, y, flap, tag = null, open = false;
          if (fq < 1){ const e = eOut(fq); x = lerp(fx0, sx, e); y = lerp(fy0, sy, e) - Math.sin(fq * Math.PI) * 160; flap = Math.abs(Math.sin(t * 26)); }
          else { x = sx; y = sy + Math.sin(t * 4 + i) * 6; flap = Math.max(0, Math.sin(t * 3 + i * 2)) * .4; tag = b.tag; open = Math.sin(t * 5 + i * 3) > .7; }
          if (t >= tNest){ const hq = SAT(t, tNest + .15 + i * .12, .45), e = eOut(hq); x = lerp(sx, nx, e); y = lerp(sy, ny, e) - Math.sin(hq * Math.PI) * 120 + (hq >= 1 ? Math.sin(t * 5 + i) * 4 : 0); tag = hq > 0 ? null : tag; flap = hq < 1 ? Math.abs(Math.sin(t * 22)) : flap; }
          bird(ctx, x, y, bs * (t >= tNest ? .85 : 1), t, { col: b.col, flap, face: x > hx ? -1 : 1, open });
          if (tag){ tagChip(ctx, tag, x, y - 92 * bs, bs, b.tagBg, b.tagFg); }
          if (open && fq >= 1) { ctx.save(); ctx.globalAlpha = .9; textC(ctx, "♪", x + (x > hx ? -70 : 70) * bs, y - 50 * bs, 44 * bs, BROWN, 900); ctx.restore(); } }); },
      over: (ctx2, c, sts, R) => { if (t >= tNest && Bb.nestTag){ const [hx, hy, r] = birdHead(sts, R, Bb.on), p = c.toScreen(hx, hy - r * 2.2); popChip(ctx, Bb.nestTag, p[0], Math.max(300, p[1] - 30), t - tNest - .5, ORANGE, "#FFFFFF", 44, -.05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bb = f.birds || {}; (Bb.list || []).forEach(b => { const t0 = cueT(s, b.cue, .25, i); add(t0, "whoosh"); add(t0 + .9, "ping"); }); if (Bb.nestCue) add(cueT(s, Bb.nestCue, .3, i), "chime"); });

  /* ================= SP37: _lobi (phone rings, birds scatter; client waits in the lobby) ================= */
  TT.scene(PX + "lobi", "Cerita: telepon mendesak, burung buyar; klien menunggu di lobi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Lb = Object.assign({ on: 0, cols: ["#5B7DB1", "#E8A55B", "#7FA563"], tableX: 900 }, f.lobi || {});
    const tRing = T(s, Lb.ringCue, .3, idx), tCut = T(s, Lb.cutCue, .2, idx), tLate = T(s, Lb.lateCue, .3, idx), tWait = T(s, Lb.waitCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { deskX: 880, plantX: 120 },
      back: () => { if (t < tCut) return;
        // wall clock spinning + side table with paper cups piling up
        ctx.fillStyle = "#E9DCC8"; ctx.fillRect(-600, 520, 2300, 18); clockFace(ctx, 760, 690, 95, t, t >= tWait ? 14 : 2);
        const tx = Lb.tableX; ctx.fillStyle = "#8E4E2E"; rr(ctx, tx - 110, GY - 260, 220, 26, 8); ctx.fill(); ol(ctx, 4); ctx.fillRect(tx - 12, GY - 240, 24, 240); ol(ctx, 3); rr(ctx, tx - 70, GY - 16, 140, 16, 6); ctx.fill(); ol(ctx, 3);
        const cups = Math.min(7, 1 + Math.floor(Math.max(0, t - tWait) * 1.6));
        for (let i = 0; i < cups; i++){ const cx = tx - 70 + (i % 3) * 70, cy = GY - 262 - Math.floor(i / 3) * 70; ctx.beginPath(); ctx.moveTo(cx - 24, cy - 66); ctx.lineTo(cx + 24, cy - 66); ctx.lineTo(cx + 18, cy); ctx.lineTo(cx - 18, cy); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); ctx.fillStyle = ORANGE; ctx.fillRect(cx - 21, cy - 46, 42, 14); } },
      over1: (ctx2, c, sts, j, R) => { if (t >= tCut || j !== Lb.on) return; const [hx, hy, r] = birdHead(sts, R, j), bs = sts[j].size / 640 * 1.3;
        const hp = handOf(sts[j]); if (t >= tRing){ const k = t - tRing; ctx.save(); ctx.strokeStyle = RED; ctx.lineCap = "round"; for (let w = 0; w < 3; w++){ const q = (k * 1.6 + w / 3) % 1; ctx.globalAlpha = 1 - q; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(hp[0], hp[1], 50 + q * 120, -1.2, .2); ctx.stroke(); } ctx.restore(); }
        nestAt(ctx, hx, hy - r * .9, r * 2.7, 1);
        Lb.cols.forEach((col, i) => { const nx = hx + (i - 1) * r * .8, ny = hy - r * 1.2; let x = nx, y = ny + Math.sin(t * 5 + i) * 4, flap = .2, face = i ? -1 : 1;
          if (t >= tRing + .35){ const q = SAT(t, tRing + .35 + i * .1, 1.2), a = [-2.4, -1.57, -.6][i], d = q * 1400; x = nx + Math.cos(a) * d; y = ny + Math.sin(a) * d * .7 - Math.sin(q * 3) * 80; flap = Math.abs(Math.sin(t * 30)); face = Math.cos(a) > 0 ? 1 : -1;
            for (let p = 0; p < 3; p++){ const fq = SAT(t, tRing + .4 + p * .15 + i * .1, 2.4); if (fq <= 0 || fq >= 1) continue; ctx.save(); ctx.translate(nx + (rnd(i * 5 + p) - .5) * 260 + Math.sin(fq * 9) * 40, ny + fq * 700); ctx.rotate(Math.sin(fq * 7) * .8); ctx.globalAlpha = 1 - fq;
              ctx.beginPath(); ctx.ellipse(0, 0, 12, 30, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 2); ctx.restore(); } }
          bird(ctx, x, y, bs * .85, t, { col, flap, face, open: t >= tRing + .35 }); }); },
      over: (ctx2, c) => { if (t >= tRing && t < tCut) popWord(ctx, "KRIIING!", 600, 470, t - tRing, { size: 96, rot: -8, hold: 1.2, col: RED });
        if (t >= tRing + .35 && t < tCut){ ctx.save(); const k = t - tRing - .35; for (let i = 0; i < 3; i++) popWord(ctx, "!", 300 + i * 240, 700 - i * 30, k - i * .08, { size: 90, rot: (i - 1) * 10, hold: .8, col: GOLD }); ctx.restore(); }
        if (t >= tLate){ const q = SAT(t, tLate, 1.8), x = lerp(1180, -160, q), y = 520 - Math.sin(q * Math.PI) * 120; bird(ctx, x, y, 1.1, t, { col: "#D9483B", flap: Math.abs(Math.sin(t * 24)), face: -1, open: true }); if (q < .7) tagChip(ctx, Lb.lateTag || "LAPORAN JUMAT", x, y + 100, 1.1, PAPER, BROWN);
          if (t >= tLate + 1.2) stampBox(ctx, Lb.lateStamp || "TERLEWAT", 540, 640, t - tLate - 1.2, RED, 64, -.1); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Lb = f.lobi || {}; if (Lb.ringCue){ const t0 = cueT(s, Lb.ringCue, .3, i); add(t0, "ping"); add(t0 + .25, "ping"); add(t0 + .4, "whoosh"); }
    if (Lb.cutCue) add(cueT(s, Lb.cutCue, .2, i), "whoosh"); if (Lb.lateCue){ const t0 = cueT(s, Lb.lateCue, .3, i); add(t0, "whoosh"); add(t0 + 1.2, "pop"); } });

  /* ================= SP37: _sarang (birdhouse calendar on a tree) ================= */
  TT.scene(PX + "sarang", "Cerita: kalender rumah burung, tiap janji masuk lubang hari & jamnya", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sr = Object.assign({ x: 700, y: 560, w: 640, on: 0, cols: ["SEN", "SEL", "RAB", "KAM", "JUM"], birds: [] }, f.sarang || {});
    const tIn = T(s, Sr.inCue, .3, idx), tCal = T(s, Sr.calCue, .3, idx), x0 = Sr.x - Sr.w / 2, nC = Sr.cols.length, cw = Sr.w / nC, hy = Sr.y + 190;
    const holeXY = ci => [x0 + cw * (ci + .5), hy];
    base(ctx, s, t, { env: "park", envOpt: { time: "day", treeX: Sr.x + 40 }, front: false,
      spots: { cal: [Sr.x - 60, Sr.y + 230, 1.15] },
      back: () => { const q = eBack(SAT(t, tIn, .55)); if (q <= 0) return; ctx.save(); ctx.translate(Sr.x, GY); ctx.scale(1, q); ctx.translate(-Sr.x, -GY);
        ctx.fillStyle = "#7A4A2E"; rr(ctx, Sr.x - 22, Sr.y + 330, 44, GY - Sr.y - 330, 8); ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.moveTo(x0 - 60, Sr.y + 20); ctx.lineTo(Sr.x, Sr.y - 150); ctx.lineTo(x0 + Sr.w + 60, Sr.y + 20); ctx.closePath(); ctx.fillStyle = "#B5512F"; ctx.fill(); ol(ctx, 6);
        rr(ctx, x0, Sr.y, Sr.w, 350, 14); ctx.fillStyle = "#E8C08A"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = TEAL; rr(ctx, Sr.x - 170, Sr.y - 70, 340, 62, 12); ctx.fill(); ol(ctx, 4); textC(ctx, Sr.title || "KALENDER", Sr.x, Sr.y - 26, 40, "#FFFFFF", 900);
        Sr.cols.forEach((d, ci) => { const [hx2, hy2] = holeXY(ci); textC(ctx, d, hx2, Sr.y + 72, 34, BROWN, 900);
          if (ci) { ctx.fillStyle = hexA(OUT, .2); ctx.fillRect(x0 + cw * ci - 2, Sr.y + 20, 4, 310); }
          ctx.beginPath(); ctx.arc(hx2, hy2, 46, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#7A4A2E"; rr(ctx, hx2 - 30, hy2 + 62, 60, 12, 6); ctx.fill(); });
        ctx.restore(); },
      over1: (ctx2, c, sts, j, R) => { if (j !== Sr.on) return; const [hx, hy2, r] = birdHead(sts, R, j), bs = sts[j].size / 640;
        // a dizzy bird circling the head before the calendar arrives
        if (t < tIn + .2){ const a = t * 3.2; bird(ctx, hx + Math.cos(a) * r * 1.5, hy2 - r * 1.2 + Math.sin(a) * r * .35, bs * .8, t, { col: "#7FA563", flap: Math.abs(Math.sin(t * 20)), face: Math.sin(a) > 0 ? 1 : -1, open: true }); } } ,
      front: () => { Sr.birds.forEach((b, i) => { const ta = T(s, b.cue, .3, idx); if (t < ta) return; const [hx2, hy2] = holeXY(b.col), q = SAT(t, ta, 1.0), e = eOut(q);
          const sx = Sr.fromX ?? 260, sy = Sr.fromY ?? 760, x = lerp(sx, hx2, e), y = lerp(sy, hy2 - 10, e) - Math.sin(q * Math.PI) * 260;
          if (q < 1) bird(ctx, x, y, .9, t, { col: b.colr, flap: Math.abs(Math.sin(t * 24)), face: hx2 > sx ? 1 : -1 });
          else { ctx.save(); ctx.beginPath(); ctx.arc(hx2, hy2, 46, 0, TAU); ctx.clip(); bird(ctx, hx2, hy2 + 22 + Math.sin(t * 4 + i) * 4, .72, t, { col: b.colr, face: -1, open: Math.sin(t * 5 + i) > .6 }); ctx.restore();
            const gq = SAT(t, ta + 1.0, .4); glowAt(ctx, hx2, hy2, 110, GOLD, .5 * (1 - gq * .5)); popChip(ctx, b.when, hx2, hy2 + 120, t - ta - 1.0, b.hl ? ORANGE : PAPER, b.hl ? "#FFFFFF" : BROWN, 32, (i % 2 ? .06 : -.06)); }
          if (q < .85) tagChip(ctx, b.tag, x, y - 70, .9, PAPER, BROWN); });
        if (t >= tCal){ const q = SAT(t, tCal, .6); glowAt(ctx, Sr.x, Sr.y + 190, 520, GOLD, .25 * Math.sin(q * Math.PI)); } },
      over: (ctx2, c) => { if (t >= tCal && Sr.calTag) popChip(ctx, Sr.calTag, 540, 330, t - tCal, ORANGE, "#FFFFFF", 46, -.04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Sr = f.sarang || {}; if (Sr.inCue) add(cueT(s, Sr.inCue, .3, i), "whoosh"); (Sr.birds || []).forEach(b => { const t0 = cueT(s, b.cue, .3, i); add(t0, "whoosh"); add(t0 + 1.0, "ping"); }); if (Sr.calCue) add(cueT(s, Sr.calCue, .3, i), "chime"); });

  /* ================= SP37: _kicau (cuckoo reminder from the phone) ================= */
  TT.scene(PX + "kicau", "Cerita: burung pengingat melompat dari ponsel di meja", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Kc = Object.assign({ deskX: 780, phoneDx: -170 }, f.kicau || {});
    const tAl = T(s, Kc.alarmCue, .3, idx), top = GY - 300, px = Kc.deskX + Kc.phoneDx, py = top - 8;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 110 },
      spots: { phone: [px + 60, py - 220, 1.25] },
      back: () => { prop(ctx, "desk", Kc.deskX, GY, { s: 1, laptop: true, lx: 60, mug: true }, t); },
      front: () => { const k = t - tAl, buzz = k >= 0 && k < 3 ? Math.sin(t * 70) * 5 : 0;
        ctx.save(); ctx.translate(px + buzz, py); rr(ctx, -70, -16, 140, 22, 8); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = k >= 0 ? "#BFE2EA" : "#3B4A6B"; rr(ctx, -60, -13, 120, 14, 4); ctx.fill(); ctx.restore();
        if (k >= 0){ glowAt(ctx, px, py - 20, 200, "#BFE2EA", .5); const sp = eBack(SAT(t, tAl, .4)), h = 230 * sp, sw = Math.sin(t * 9) * 14 * Math.max(.2, 1 - k / 3);
          ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i <= 24; i++){ const u = i / 24; ctx.lineTo(px + Math.sin(u * 30) * 16 + sw * u, py - 14 - u * h); } ctx.stroke();
          bird(ctx, px + sw, py - 40 - h, 1.05, t, { col: "#F6C343", flap: Math.abs(Math.sin(t * 14)), face: 1, open: Math.sin(t * 12) > 0 }); } },
      over: (ctx2, c) => { if (t < tAl) return; const p = c.toScreen(px, py - 300); [0, .5].forEach((d, j) => popWord(ctx, "CIT!", p[0] + (j ? 170 : -150), p[1] - 40 - j * 50, t - tAl - d, { size: 84, rot: j ? 10 : -10, hold: .9, col: GOLD }));
        if (Kc.note) popChip(ctx, Kc.note, 540, 330, t - tAl - .3, NAVY, "#FFFFFF", 40, -.03); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Kc = f.kicau || {}; if (Kc.alarmCue){ const t0 = cueT(s, Kc.alarmCue, .3, i); add(t0, "ping"); add(t0 + .5, "ping"); add(t0 + .1, "pop"); } });

  /* ================= RN37: _gedung (cut-away building, promise slip drops to the warehouse) ================= */
  function boxAt(ctx, x, y, w, h, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); rr(ctx, -w / 2, -h, w, h, 6); ctx.fillStyle = o.col || "#C98F55"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "rgba(255,244,230,.55)"; ctx.fillRect(-10, -h, 20, h); if (o.label) textC(ctx, o.label, 0, -h / 2 + 10, Math.min(30, h * .3), BROWN, 900, w - 16); ctx.restore(); }
  TT.scene(PX + "gedung", "Cerita: gedung potong-lintang tiga lantai, slip janji jatuh ke gudang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gd = Object.assign({ x0: 100, x1: 980, fh: 480, chuteX: 890, floors: [] }, f.gedung || {});
    const tSlip = T(s, Gd.slipCue, .3, idx), tDrop = T(s, Gd.dropCue, .2, idx), fl = i => GY - (Gd.floors.length - 1 - i) * Gd.fh;
    const top = fl(0) - Gd.fh, nF = Gd.floors.length;
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: true },
      back: () => {
        ctx.fillStyle = "#E9DCC8"; rr(ctx, Gd.x0 - 30, top - 40, Gd.x1 - Gd.x0 + 60, GY - top + 40, 14); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#3B2418"; rr(ctx, Gd.x0 - 50, top - 70, Gd.x1 - Gd.x0 + 100, 40, 10); ctx.fill();
        Gd.floors.forEach((F, i) => { const fy = fl(i), y0 = fy - Gd.fh + 30;
          ctx.fillStyle = F.wall || "#FFF3E4"; ctx.fillRect(Gd.x0, y0, Gd.x1 - Gd.x0, Gd.fh - 30);
          ctx.fillStyle = hexA(OUT, .06); for (let x = Gd.x0; x < Gd.x1; x += 70) ctx.fillRect(x, y0, 4, Gd.fh - 30);
          ctx.fillStyle = "#8E4E2E"; ctx.fillRect(Gd.x0 - 30, fy, Gd.x1 - Gd.x0 + 60, 30); ol(ctx, 4);
          ctx.save(); ctx.translate(Gd.x0 + 40, y0 + 30); rr(ctx, 0, 0, 300, 58, 10); ctx.fillStyle = F.col || TEAL; ctx.fill(); ol(ctx, 4); textL(ctx, F.label, 18, 41, 32, "#FFFFFF", 900, 264); ctx.restore();
          if (F.kind === "sales"){ prop(ctx, "desk", 640, fy, { s: .62, laptop: true, mug: true }, t); }
          if (F.kind === "finance"){ prop(ctx, "desk", 640, fy, { s: .62, papers: true }, t); for (let k = 0; k < 4; k++){ ctx.fillStyle = PAPER; rr(ctx, 560 + k * 8, fy - 210 - k * 10, 90, 12, 3); ctx.fill(); ol(ctx, 2); } }
          if (F.kind === "warehouse"){ [[640, 0, 120, 100], [760, 0, 110, 120], [700, -100, 100, 90], [820, -120, 90, 80], [600, -100, 90, 80]].forEach(([x, dy, w, h], k) => boxAt(ctx, x, fy + dy, w, h, { col: k % 2 ? "#B97D45" : "#C98F55" })); } });
        // glass chute
        ctx.fillStyle = hexA("#BFE2EA", .55); rr(ctx, Gd.chuteX - 36, fl(0) - 260, 72, GY - fl(0) + 140, 30); ctx.fill(); ctx.strokeStyle = hexA(OUT, .7); ctx.lineWidth = 5; ctx.stroke();
        ctx.fillStyle = hexA("#FFFFFF", .5); ctx.fillRect(Gd.chuteX - 22, fl(0) - 240, 10, GY - fl(0) + 100); },
      front: () => { if (t < tSlip) return; const k = t - tSlip, top0 = fl(0) - 260;
        let x, y, rot = 0; const p0 = [520, fl(0) - 260];
        if (t < tDrop){ const q = SAT(t, tSlip + .5, .9); x = lerp(p0[0], Gd.chuteX, eOut(q)); y = lerp(p0[1], top0, eOut(q)) - Math.sin(q * Math.PI) * 120; rot = q * 6; if (q >= 1){ y = top0 + Math.sin(t * 6) * 6; } }
        else { const q = SAT(t, tDrop, 1.1); x = Gd.chuteX + Math.sin(q * 20) * 10; y = lerp(top0, GY - 160, q * q); rot = Math.sin(t * 15) * .3;
          if (q >= 1){ const q2 = SAT(t, tDrop + 1.1, .5); x = lerp(Gd.chuteX, 700, eOut(q2)); y = lerp(GY - 160, GY - 250, eOut(q2)) - Math.sin(q2 * Math.PI) * 80; rot = (1 - q2) * 3 - .08; } }
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rr(ctx, -70, -44, 140, 88, 8); ctx.fillStyle = "#FFF6C8"; ctx.fill(); ol(ctx, 4); textC(ctx, Gd.slipText || "BESOK!", 0, 12, 30, RED, 900); ctx.restore();
        if (t >= tDrop && t < tDrop + 1.1) speedLines(ctx, x, y - 120, 0, 60, t, hexA(OUT, .3)); },
      over: (ctx2, c, sts) => { if (t >= tSlip && Gd.say){ const p = c.toScreen(520, fl(0) - 360); popWord(ctx, Gd.say, p[0], Math.max(380, p[1]), t - tSlip, { size: 92, rot: -6, hold: 1.6, col: GOLD }); }
        if (t >= tDrop + 1.6 && Gd.alarm){ const p = c.toScreen(560, GY - 420); popWord(ctx, Gd.alarm, p[0], Math.max(380, p[1]), t - tDrop - 1.6, { size: 100, rot: 6, hold: 1.6, col: RED }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gd = f.gedung || {}; if (Gd.slipCue) add(cueT(s, Gd.slipCue, .3, i), "chime"); if (Gd.dropCue){ const t0 = cueT(s, Gd.dropCue, .2, i); add(t0, "whoosh"); add(t0 + 1.1, "pop"); add(t0 + 1.6, "ping"); } });

  /* ================= RN37: _tuding (blame carousel) ================= */
  function arrowShape(ctx, len, w, col){ ctx.beginPath(); ctx.moveTo(-len / 2, -w / 2); ctx.lineTo(len / 2 - w, -w / 2); ctx.lineTo(len / 2 - w, -w); ctx.lineTo(len / 2 + 10, 0); ctx.lineTo(len / 2 - w, w); ctx.lineTo(len / 2 - w, w / 2); ctx.lineTo(-len / 2, w / 2); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); }
  TT.scene(PX + "tuding", "Cerita: korsel saling menyalahkan + pelanggan kesal", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Td = Object.assign({ cx: 540, cy: 640, R: 250, labels: [] }, f.tuding || {});
    const tSpin = T(s, Td.spinCue, .3, idx), tAng = T(s, Td.angryCue, .2, idx);
    base(ctx, s, t, { env: "office", envOpt: { deskX: 900, plantX: 120 },
      over: (ctx2, c) => {
        if (t >= tAng){ const q = eBack(SAT(t, tAng, .4)), sh = Math.sin(t * 30) * 4 * Math.max(0, 1 - (t - tAng) / 1.5); ctx.save(); ctx.translate(250 + sh, 330); ctx.scale(q, q);
          rr(ctx, -170, -95, 340, 190, 28); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(60, 90); ctx.lineTo(110, 150); ctx.lineTo(100, 88); ctx.fill(); ol(ctx, 5);
          ctx.beginPath(); ctx.arc(-95, -10, 58, 0, TAU); ctx.fillStyle = "#F08C5E"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-115, -14, 7, 0, TAU); ctx.arc(-75, -14, 7, 0, TAU); ctx.fill();
          ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-132, -34); ctx.lineTo(-104, -26); ctx.moveTo(-58, -34); ctx.lineTo(-86, -26); ctx.stroke(); ctx.beginPath(); ctx.arc(-95, 26, 18, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
          textL(ctx, Td.who || "PELANGGAN", -20, -32, 28, BROWN, 900, 180); for (let k = 0; k < 5; k++) star5(ctx, 0 + k * 34, 20, 15, k < 1 ? GOLD : "#D8CBB6"); ctx.restore(); }
        if (t < tSpin) return; const q = eBack(SAT(t, tSpin, .5)), a0 = (t - tSpin) * 2.4, p = c.toScreen(Td.cx, Td.cy), R2 = Td.R * c.zoom * q;
        ctx.save(); ctx.globalAlpha = .25; ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.setLineDash([20, 18]); ctx.beginPath(); ctx.arc(p[0], p[1], R2, 0, TAU); ctx.stroke(); ctx.restore();
        Td.labels.forEach((lb, k) => { const a = a0 + k * TAU / 3, x = p[0] + Math.cos(a) * R2, y = p[1] + Math.sin(a) * R2 * .55; ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); ctx.scale(q, q); arrowShape(ctx, 190, 54, RED); ctx.restore();
          popChip(ctx, lb, x, y - 70, t - tSpin - .2 - k * .15, PAPER, RED, 32, Math.sin(t * 3 + k) * .06); });
        for (let i = 0; i < 3; i++) popWord(ctx, "!", p[0] - 200 + i * 200, p[1] + 300 - (i % 2) * 40, ((t - tSpin) % 1.2) - i * .1, { size: 80, rot: (i - 1) * 12, hold: .8, col: GOLD }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Td = f.tuding || {}; if (Td.spinCue) add(cueT(s, Td.spinCue, .3, i), "whoosh"); if (Td.angryCue) add(cueT(s, Td.angryCue, .2, i), "ping"); });

  /* ================= RN37: _paket (the hero rides inside a parcel box through the warehouse) ================= */
  function scooter(ctx, x, y, s, t, run){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const b = run ? Math.sin(t * 20) * 3 : 0; ctx.translate(0, b);
    [[-130, 0], [130, 0]].forEach(([dx]) => { ctx.beginPath(); ctx.arc(dx, -50, 50, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.arc(dx, -50, 20, 0, TAU); ctx.fillStyle = "#B8AE9D"; ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(-180, -80); ctx.quadraticCurveTo(-170, -170, -60, -160); ctx.lineTo(60, -110); ctx.lineTo(130, -110); ctx.lineTo(170, -60); ctx.lineTo(-180, -60); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(120, -100); ctx.lineTo(150, -250); ctx.lineTo(110, -260); ctx.stroke();
    ctx.fillStyle = "#7A4A2E"; rr(ctx, -210, -170, 170, 16, 4); ctx.fill(); ol(ctx, 3); ctx.restore(); }
  TT.scene(PX + "paket", "Cerita: tokoh ikut di dalam kardus paket melewati pos gudang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Pk = Object.assign({ st: [] }, f.paket || {});
    const fy = GY - 190, S = Pk.st, ts = S.map(x => T(s, x.cue, .3, idx)), tDone = T(s, Pk.doneCue, .3, idx), BW = 170, BH = 140;
    const spots = [[S[0].x + 40, fy - 270], [S[0].x + 225, GY - 142], [S[1].x, GY - 260], [S[2].x, GY - 260], [S[3].x + 8, GY - 153]];
    let k = 0; for (let i = 0; i < 4; i++) if (t >= ts[i]) k = i + 1;
    let bx, by; if (k === 0){ [bx, by] = spots[0]; } else { const q = SAT(t, ts[k - 1], .6), a = spots[k - 1], b = spots[k]; bx = lerp(a[0], b[0], eOut(q)); by = lerp(a[1], b[1], eOut(q)) - Math.sin(q * Math.PI) * 140; }
    const tGo = ts[3] + 1.3, scX = S[3].x + 120 + (t > tGo ? (t - tGo) ** 2 * 160 : 0); if (k === 4 && t > tGo){ bx = spots[4][0] + (scX - S[3].x - 120); by = spots[4][1]; }
    const kq = t - ts[2], closed = k >= 3 && kq > .55 && kq < 1.45, pop = k >= 3 && kq >= 1.45 ? eBack(SAT(t, ts[2] + 1.45, .35)) : 1;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false }, envFront: false,
      spots: { box: () => [bx + 90, by - 250, 1.28], wide: [bx + 60, 1000, 1] },
      back: () => { warehouseBg(ctx, t, { x0: -800, x1: 4200, racks: [-600, 3400], doorX: 3800, sign: Pk.sign || "GUDANG" });
        S.forEach((St, i) => { const x = St.x, u = t - ts[i];
          ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 80, 300); ctx.lineTo(x - 80, 560); ctx.moveTo(x + 80, 300); ctx.lineTo(x + 80, 560); ctx.stroke();
          const sw = Math.sin(t * 1.4 + i) * .03 + (u >= 0 && u < 1 ? Math.sin(u * 14) * .08 * (1 - u) : 0); ctx.save(); ctx.translate(x, 560); ctx.rotate(sw);
          rr(ctx, -150, 0, 300, 100, 16); ctx.fillStyle = u >= 0 ? ORANGE : "#FFF4E6"; ctx.fill(); ol(ctx, 5); textC(ctx, (i + 1) + ". " + St.label, 0, 66, 42, u >= 0 ? "#FFFFFF" : BROWN, 900, 270); ctx.restore();
          if (St.kind === "ambil"){ ctx.fillStyle = "#3B4A6B"; [-160, 140].forEach(d => { rr(ctx, x + d, fy - 520, 18, 520, 4); ctx.fill(); }); [fy - 270, fy - 500].forEach(ly => { ctx.fillStyle = "#E8A55B"; ctx.fillRect(x - 160, ly, 318, 16); ol(ctx, 3); });
            boxAt(ctx, x - 60, fy - 500, 110, 110); boxAt(ctx, x - 90, fy - 270, 100, 120); boxAt(ctx, x + 60, fy - 500, 100, 90, { col: "#B97D45" });
            ctx.fillStyle = "#9AA6B2"; rr(ctx, x + 130, GY - 142, 190, 22, 6); ctx.fill(); ol(ctx, 3); [x + 150, x + 300].forEach(wx => { ctx.beginPath(); ctx.arc(wx, GY - 100, 20, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
            ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x + 320, GY - 132); ctx.lineTo(x + 360, GY - 330); ctx.stroke(); }
          if (St.kind === "cek" || St.kind === "kemas"){ ctx.fillStyle = "#8E4E2E"; rr(ctx, x - 170, GY - 260, 340, 24, 6); ctx.fill(); ol(ctx, 4); ctx.fillRect(x - 150, GY - 236, 20, 236); ctx.fillRect(x + 130, GY - 236, 20, 236); }
          if (St.kind === "cek"){ ctx.fillStyle = "#3B4A6B"; rr(ctx, x + 150, GY - 620, 26, 360, 6); ctx.fill(); ol(ctx, 3); rr(ctx, x + 40, GY - 640, 150, 50, 12); ctx.fill(); ol(ctx, 3); }
          if (St.kind === "kurir") scooter(ctx, i === 3 ? scX : x + 120, GY, .9, t, t > tGo); }); },
      front: () => {
        // hero inside the box
        const A = Pk.hero; if (A && !closed){ const st = toonState(A, s, t); st.x = bx; st.y = by - 20 + (1 - pop) * 60; st.face = 1; st.moving = false; TT.drawToon(ctx, A, st, t); }
        ctx.save(); ctx.translate(bx, by); rr(ctx, -BW / 2, -BH, BW, BH, 6); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "rgba(255,244,230,.6)"; ctx.fillRect(-14, -BH, 28, BH);
        textC(ctx, Pk.label || "PESANAN", 0, -50, 26, BROWN, 900, BW - 20);
        const fq = k >= 3 ? (closed ? eOut(clamp((kq - .25) / .3, 0, 1)) : (kq >= 1.45 ? 1 - eOut(SAT(t, ts[2] + 1.45, .3)) : eOut(clamp((kq - .25) / .3, 0, 1)))) : 0;
        [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * BW / 2, -BH); ctx.rotate(d * (1 - fq) * 2.4 - d * Math.PI * (1 - fq) * 0 ); rr(ctx, d > 0 ? -BW / 2 : 0, -10, BW / 2, 20, 4); ctx.fillStyle = "#C98F55"; ctx.fill(); ol(ctx, 3); ctx.restore(); });
        if (closed && kq > .8){ ctx.fillStyle = hexA(GOLD, .95); ctx.fillRect(-BW / 2, -BH - 12, BW * clamp((kq - .8) / .4, 0, 1), 24); }
        ctx.restore();
        if (k >= 2 && t - ts[1] > .6 && t - ts[1] < 2.2){ const u = t - ts[1] - .6, yy = by - 360 + (Math.sin(u * 7) * .5 + .5) * 360; ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.shadowColor = RED; ctx.shadowBlur = 18; ctx.beginPath(); ctx.moveTo(bx - 120, yy); ctx.lineTo(bx + 120, yy); ctx.stroke(); ctx.restore(); }
        if (k >= 2 && t - ts[1] > 1.8){ const q = eBack(SAT(t, ts[1] + 1.8, .35)); ctx.save(); ctx.translate(bx + 150, by - 300); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-4, 14); ctx.lineTo(20, -14); ctx.stroke(); ctx.restore(); } },
      over: (ctx2, c) => { if (closed){ const p = c.toScreen(bx, by - 200); popWord(ctx, "HEI!", p[0] + 60, p[1], kq - .9, { size: 80, rot: 8, hold: .6, col: GOLD }); }
        if (k >= 4 && t >= ts[3] + 1.0) popChip(ctx, Pk.tag || "KURIR 16.00", 540, 330, t - ts[3] - 1.0, NAVY, "#FFFFFF", 42, -.04);
        if (t >= tDone){ stampBox(ctx, Pk.stamp || "2 HARI", 540, 640, t - tDone, ORANGE, 80, -.08); burstFx(ctx, 540, 640, t - tDone - .1, HL, 12, 260); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Pk = f.paket || {}; (Pk.st || []).forEach((S, j) => { const t0 = cueT(s, S.cue, .3, i); add(t0, "whoosh"); add(t0 + .6, "pop"); }); if (Pk.doneCue) add(cueT(s, Pk.doneCue, .3, i), "chime"); });


  /* ================= RN37: _gigi (division gears grind, then mesh) ================= */
  TT.scene(PX + "gigi", "Cerita: tiga roda gigi divisi bergesekan lalu menyatu, paket mengalir", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gg = Object.assign({ gears: [] }, f.gigi || {});
    const tMesh = T(s, Gg.meshCue, .3, idx), tFlow = T(s, Gg.flowCue, .3, idx), tHappy = T(s, Gg.happyCue, .3, idx), m = eBack(SAT(t, tMesh, .8));
    const GP = [[250, 640, 160, 14], [521, 700, 140, 12], [792, 640, 160, 14]], AP = [[150, 560], [540, 820], [930, 560]];
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: () => {
        // conveyor rail under the gears
        const ry = 930; ctx.fillStyle = "#3B4A6B"; rr(ctx, 40, ry, 1000, 26, 12); ctx.fill(); ol(ctx, 4); ctx.save(); ctx.setLineDash([24, 18]); ctx.lineDashOffset = t >= tFlow ? -t * 160 : 0; ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(60, ry + 13); ctx.lineTo(1020, ry + 13); ctx.stroke(); ctx.restore();
        Gg.gears.forEach((g, k) => { const [mx, my, R, n] = GP[k], [ax, ay] = AP[k], jit = m < 1 ? Math.sin(t * 23 + k * 2) * 8 * (1 - m) : 0, x = lerp(ax, mx, m) + jit, y = lerp(ay, my, m);
          const ratio = GP[0][2] / R, dir = k % 2 ? -1 : 1, rot = m >= 1 ? dir * (t - tMesh) * 1.3 * ratio + (k === 1 ? Math.PI / n : 0) : Math.sin(t * 5 + k) * .25 + Math.round(Math.sin(t * 3 + k)) * .1;
          gear(ctx, x, y, R, n, rot, g.col, g.label, g.sub); });
        if (m < 1){ [[385, 690], [655, 690]].forEach(([sx, sy], k) => { if (t < .2) return; for (let i = 0; i < 9; i++){ const q = ((t * 3 + i / 9 + k * .5) % 1), a = -1.6 + (rnd(i + k * 9) - .5) * 2.4; ctx.strokeStyle = i % 2 ? GOLD : "#FF7A3C"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.globalAlpha = 1 - q;
            ctx.beginPath(); ctx.moveTo(sx + Math.cos(a) * q * 140, sy + Math.sin(a) * q * 140); ctx.lineTo(sx + Math.cos(a) * (q * 140 + 30), sy + Math.sin(a) * (q * 140 + 30)); ctx.stroke(); } ctx.globalAlpha = 1;
            for (let i = 0; i < 3; i++){ const q = (t * .8 + i / 3) % 1; ctx.fillStyle = hexA("#9AA6B2", .5 * (1 - q)); ctx.beginPath(); ctx.arc(sx + Math.sin(i + t) * 30, sy - 60 - q * 200, 26 + q * 40, 0, TAU); ctx.fill(); } }); }
        if (t >= tFlow) for (let i = 0; i < 4; i++){ const q = ((t - tFlow) * .32 + i / 4) % 1, x = lerp(20, 1060, q), hop = Math.abs(Math.sin(q * 40)) * 6; boxAt(ctx, x, ry - hop, 100, 84, { col: i % 2 ? "#C98F55" : "#D9A066", rot: Math.sin(t * 6 + i) * .04 }); } },
      over: () => { if (t >= tMesh) popChip(ctx, Gg.meshTag || "KLIK!", 540, 330, t - tMesh - .3, GREEN, "#FFFFFF", 46, -.04);
        if (t >= tHappy){ const q = eBack(SAT(t, tHappy, .4)); ctx.save(); ctx.translate(540, 250); ctx.scale(q, q); rr(ctx, -260, -54, 520, 108, 54); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
          for (let k = 0; k < 5; k++){ const kq = SAT(t, tHappy + .2 + k * .12, .3); star5(ctx, -180 + k * 90, 0, 34 * (.6 + .4 * eBack(kq)), kq > 0 ? GOLD : "#D8CBB6"); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); } ctx.restore(); burstFx(ctx, 540, 250, t - tHappy - .8, GOLD, 12, 300); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gg = f.gigi || {}; if (Gg.meshCue) add(cueT(s, Gg.meshCue, .3, i) + .5, "pop"); if (Gg.flowCue) add(cueT(s, Gg.flowCue, .3, i), "whoosh"); if (Gg.happyCue) add(cueT(s, Gg.happyCue, .3, i), "chime"); });

  /* ================= KD37: _banjir (chat-bubble flood) ================= */
  function chatBub(ctx, x, y, txt, s, col, me){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (txt === ":)"){ ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-15, -10, 6, 0, TAU); ctx.arc(15, -10, 6, 0, TAU); ctx.fill();
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 4, 22, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); ctx.restore(); return; }
    if (txt === "<3"){ ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -30, -60, 0, -26); ctx.bezierCurveTo(30, -60, 60, -10, 0, 30); ctx.fill(); ol(ctx, 4); ctx.restore(); return; }
    font(ctx, 800, 34, FAM); const w = Math.max(80, ctx.measureText(txt).width + 40), h = 62;
    rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = col || (me ? "#DCF4C8" : "#FFFFFF"); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(me ? w / 2 - 20 : -w / 2 + 20, h / 2 - 2); ctx.lineTo(me ? w / 2 - 4 : -w / 2 + 4, h / 2 + 16); ctx.lineTo(me ? w / 2 - 40 : -w / 2 + 40, h / 2 - 2); ctx.fill();
    textC(ctx, txt, 0, 12, 34, BROWN, 800); ctx.restore(); }
  TT.scene(PX + "banjir", "Cerita: banjir balon chat memenuhi ruangan, tokoh mengapung", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bj = Object.assign({ on: 0, top: 1180, dur: 5, words: ["L", "XL ya", "M", "aku L", ":)", "sama kayak atas", "XXL!", "wkwk", "S", "<3", "L dong", "M aja"] }, f.banjir || {});
    const tS = T(s, Bj.startCue, .3, idx), lv = t < tS ? GY + 40 : lerp(GY + 40, Bj.top, eOut(SAT(t, tS, Bj.dur))) + Math.sin(t * 1.6) * 10, W = Bj.words;
    base(ctx, s, t, { env: "office", envOpt: { deskX: 880, plantX: 120 },
      back: (ctx2, c, sts) => { const st = sts[Bj.on]; if (st && lv < GY - 60){ st.y = Math.min(GY, lv + st.size * .52) + Math.sin(t * 2.2) * 12; } },
      front: (ctx2, c, sts) => {
        // stream out of the phone
        const st = sts[Bj.on]; if (st && t >= tS){ const h = handOf(st); for (let i = 0; i < 6; i++){ const q = ((t - tS) * .9 + i / 6) % 1, k = Math.floor((t - tS) * .9 + i / 6) * 6 + i;
          const x = h[0] + (rnd(k) - .3) * 900 * q, y = h[1] - 220 * Math.sin(q * Math.PI) - 40 + q * 200; chatBub(ctx, x, y, W[k % W.length], .6 + .5 * Math.min(1, q * 3), null, k % 3 === 0); } }
        if (lv > GY + 20) return;
        // the sea of bubbles
        ctx.save(); ctx.beginPath(); ctx.rect(-1200, lv - 50, 3500, 1200); ctx.clip();
        ctx.fillStyle = hexA("#BFE2EA", .55); ctx.fillRect(-1200, lv, 3500, 1200);
        for (let r = 0; r < 6; r++) for (let cI = -2; cI < 9; cI++){ const k = r * 13 + cI + 40, x = cI * 150 + (r % 2) * 75 + Math.sin(t * 1.3 + k) * 14, y = lv + 20 + r * 95 + Math.sin(t * 2 + k * .7) * 8;
          chatBub(ctx, x, y, W[k % W.length], .75, k % 4 === 0 ? "#DCF4C8" : k % 4 === 1 ? "#FFF4E6" : null, k % 2 === 0); }
        ctx.restore();
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.beginPath(); for (let x = -1200; x <= 2300; x += 40) ctx.lineTo(x, lv - 6 + Math.sin(x * .02 + t * 3) * 8); ctx.stroke(); },
      over: () => { if (t >= tS && Bj.pop) popWord(ctx, Bj.pop, 540, 520, t - tS - .4, { size: 96, rot: -6, hold: 1.4, col: GREEN }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bj = f.banjir || {}; if (Bj.startCue){ const t0 = cueT(s, Bj.startCue, .3, i); for (let k = 0; k < 8; k++) add(t0 + k * .45, k % 2 ? "pop" : "ping"); } });

  /* ================= KD37: _kusut (tangled yarn of replies) ================= */
  function silhouette(ctx, x, y, s, hijab, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = "#8C8FA3";
    ctx.beginPath(); ctx.ellipse(0, 120, 110, 90, 0, Math.PI, 0); ctx.fill(); ol(ctx, 4);
    if (hijab){ ctx.beginPath(); ctx.moveTo(-80, 110); ctx.quadraticCurveTo(-96, -20, 0, -70); ctx.quadraticCurveTo(96, -20, 80, 110); ctx.closePath(); ctx.fillStyle = "#7A7D92"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(0, 10, 52, 58, 0, 0, TAU); ctx.fillStyle = "#A6A9BA"; ctx.fill(); ol(ctx, 3); }
    else { ctx.beginPath(); ctx.arc(0, 0, 66, 0, TAU); ctx.fillStyle = "#A6A9BA"; ctx.fill(); ol(ctx, 4); }
    textC(ctx, "?", 0, 30 + Math.sin(t * 4 + x) * 4, 84, "#FFFFFF", 900); ctx.restore(); }
  TT.scene(PX + "kusut", "Cerita: benang kusut antara nama dan jawaban, siluet yang belum menjawab", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Ks = Object.assign({ on: 0, tags: [], ball: [520, 1330], ghosts: [] }, f.kusut || {});
    const tWho = T(s, Ks.whoCue, .3, idx), fade = 1 - SAT(t, tWho, .5), on = Ks.tags.filter(g => t >= T(s, g.cue, .3, idx)).length;
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 820 },
      front: () => { const [bx, by] = Ks.ball, br = 40 + on * 12;
        if (fade > 0){ ctx.save(); ctx.globalAlpha = fade;
          Ks.tags.forEach((g, j) => { const ta = T(s, g.cue, .3, idx); if (t < ta) return; const q = SAT(t, ta, .6);
            ctx.strokeStyle = j % 2 ? "#D9483B" : "#E8A55B"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx, by);
            const ex = lerp(bx, g.x, q), ey = lerp(by, g.y, q); for (let k = 1; k <= 3; k++){ const u = k / 3, cx = lerp(bx, ex, u) + Math.sin(k * 2.3 + j) * 160, cy = lerp(by, ey, u) + Math.cos(k * 1.7 + j) * 120 + Math.sin(t * 2 + k) * 10;
              ctx.quadraticCurveTo(cx + 80, cy - 90, lerp(bx, ex, u), lerp(by, ey, u)); } ctx.stroke(); });
          Ks.tags.forEach((g, j) => { const ta = T(s, g.cue, .3, idx); if (t < ta) return; const q = eBack(SAT(t, ta, .4)); ctx.save(); ctx.translate(g.x, g.y + Math.sin(t * 2 + j) * 8); ctx.scale(q, q); ctx.rotate((j % 2 ? .05 : -.05));
            chatBub(ctx, 0, 0, g.text, 1.35, g.flag ? "#FFE0D6" : null, j % 2 === 1);
            if (g.flag){ const fq = eBack(SAT(t, ta + .5, .35)); ctx.save(); ctx.translate(140, -50); ctx.scale(fq, fq); ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, g.flag, 0, 12, 32, "#FFFFFF", 900); ctx.restore(); }
            ctx.restore(); });
          ctx.restore(); }
        // the yarn ball
        ctx.save(); ctx.translate(bx, by); ctx.rotate(t * .8); ctx.beginPath(); ctx.arc(0, 0, br, 0, TAU); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 5);
        ctx.strokeStyle = "#C2691F"; ctx.lineWidth = 4; for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.ellipse(0, 0, br * .9, br * (.2 + k * .12), k * .9, 0, TAU); ctx.stroke(); } ctx.restore();
        if (t >= tWho) Ks.ghosts.forEach((g, j) => { const q = eBack(SAT(t, tWho + j * .15, .45)); if (q <= 0) return; silhouette(ctx, g[0], g[1] + (1 - q) * 300, .9 * q + .1, g[2], t); }); },
      over: () => { if (t >= tWho && Ks.whoTag) popChip(ctx, Ks.whoTag, 540, 330, t - tWho - .4, RED, "#FFFFFF", 44, -.04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Ks = f.kusut || {}; (Ks.tags || []).forEach(g => { add(cueT(s, g.cue, .3, i), "pop"); if (g.flag) add(cueT(s, g.cue, .3, i) + .5, "ping"); }); if (Ks.whoCue) add(cueT(s, Ks.whoCue, .3, i), "whoosh"); });

  /* ================= KD37: _gerbang (the online form is a gate) ================= */
  TT.scene(PX + "gerbang", "Cerita: formulir online sebagai gerbang, kolom wajib menyala merah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gb = Object.assign({ x: 620, w: 760, fields: ["NAMA", "UKURAN", "ALERGI"], passes: [], hl: [] }, f.gerbang || {});
    const tIn = T(s, Gb.inCue, .3, idx), px0 = Gb.x - Gb.w / 2, pTop = 360, rowH = 112, gq = eBack(SAT(t, tIn, .6));
    const P2 = Gb.passes.map(p => Object.assign({ T: T(s, p.cue, .3, idx) + .7, F: p.fixCue ? T(s, p.fixCue, .3, idx) : null, G: p.goCue ? T(s, p.goCue, .3, idx) : 1e9 }, p));
    const cur = P2.filter(p => t >= p.T).pop(), done = P2.filter(p => t >= p.G).length;
    const pillarX = [Gb.x - 230, Gb.x + 230];
    base(ctx, s, t, { env: "info", envOpt: { spotX: Gb.x },
      back: () => { if (gq <= 0) return; ctx.save(); ctx.translate(Gb.x, GY); ctx.scale(1, gq); ctx.translate(-Gb.x, -GY);
        // arch beam + panel
        ctx.fillStyle = "#2F6F73"; rr(ctx, pillarX[0] - 50, pTop + 70 + Gb.fields.length * rowH, pillarX[1] - pillarX[0] + 100, 50, 14); ctx.fill(); ol(ctx, 5);
        rr(ctx, px0, pTop - 90, Gb.w, 110 + Gb.fields.length * rowH + 40, 22); ctx.fillStyle = "#FFFDF6"; ctx.fill();
        const st = !cur ? "idle" : (!cur.ok && (cur.F == null || t < cur.F + .6)) ? "bad" : (t >= cur.T + .9 ? "ok" : "typing");
        ctx.strokeStyle = st === "bad" ? (Math.sin(t * 16) > 0 ? RED : "#FFB49C") : st === "ok" ? GREEN : OUT; ctx.lineWidth = 9; ctx.stroke();
        rr(ctx, px0, pTop - 90, Gb.w, 80, [22, 22, 0, 0]); ctx.fillStyle = ORANGE; ctx.fill(); textL(ctx, Gb.title || "FORMULIR", px0 + 28, pTop - 36, 38, "#FFFFFF", 900, Gb.w - 220);
        popChip(ctx, done + " MASUK", px0 + Gb.w - 105, pTop - 50, 1, GREEN, "#FFFFFF", 26);
        Gb.fields.forEach((fl, i) => { const y = pTop + 20 + i * rowH, hlT = Gb.hl[i] ? T(s, Gb.hl[i], .3, idx) : 1e9, hk = t - hlT, pulse = hk >= 0 && hk < 1 ? 1 + .08 * Math.sin(hk * Math.PI) : 1;
          ctx.save(); ctx.translate(px0 + 30, y + 30); ctx.scale(pulse, pulse); textL(ctx, fl + " *", 0, 14, 36, hk >= 0 && hk < 1 ? ORANGE : BROWN, 900, 190); ctx.restore();
          const bx = px0 + 250, bw = Gb.w - 280; rr(ctx, bx, y, bw, 76, 12); let val = cur ? cur.vals[i] : "";
          if (cur && !cur.ok && !val && cur.F != null && t >= cur.F) val = cur.fix || "-";
          const empty = cur && !val && st === "bad"; ctx.fillStyle = empty ? hexA(RED, .2 + .15 * Math.sin(t * 16)) : "#EEF3F4"; ctx.fill(); ctx.strokeStyle = empty ? RED : hexA(OUT, .5); ctx.lineWidth = 4; ctx.stroke();
          if (cur && val){ const tt0 = (val === cur.fix ? cur.F : cur.T) + i * .2, m = Math.round(val.length * SAT(t, tt0, .4)); textL(ctx, val.slice(0, m), bx + 22, y + 52, 40, BROWN, 800, bw - 40); }
          if (empty) textL(ctx, "WAJIB DIISI", bx + 22, y + 52, 34, RED, 900, bw - 40); });
        ctx.restore(); },
      front: () => { if (gq <= 0) return; pillarX.forEach(x => { ctx.save(); ctx.translate(x, GY); ctx.scale(1, gq); rr(ctx, -40, -(GY - pTop - 120 - Gb.fields.length * rowH), 80, GY - pTop - 120 - Gb.fields.length * rowH, 14); ctx.fillStyle = "#3E8A8E"; ctx.fill(); ol(ctx, 5);
          for (let k = 0; k < 5; k++){ const on = cur && Math.floor(t * 6 + k) % 5 === 0; ctx.fillStyle = on ? GOLD : "#245457"; ctx.beginPath(); ctx.arc(0, -120 - k * 110, 12, 0, TAU); ctx.fill(); } ctx.restore(); });
        P2.forEach(p => { const k = t - p.G; if (k >= -.1 && k < .9){ burstFx(ctx, Gb.x, GY - 420, k, GREEN, 12, 260); } }); },
      over: (ctx2, c) => { if (cur && !cur.ok && t >= cur.T && (cur.F == null || t < cur.F)){ const p = c.toScreen(Gb.x, pTop - 160); popWord(ctx, "TOLAK!", p[0], p[1], ((t - cur.T) % 1.4), { size: 80, rot: -6, hold: 1.2, col: RED }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gb = f.gerbang || {}; if (Gb.inCue) add(cueT(s, Gb.inCue, .3, i), "whoosh"); (Gb.hl || []).forEach(c => c && add(cueT(s, c, .3, i), "pop"));
    (Gb.passes || []).forEach(p => { const t0 = cueT(s, p.cue, .3, i) + .7; if (!p.ok) add(t0 + .2, "ping"); if (p.goCue) add(cueT(s, p.goCue, .3, i), "chime"); }); });

  /* ================= KD37: _kaos (sheet fills itself, T-shirts fly into size piles) ================= */
  function tshirt(ctx, x, y, s, rot, col, folded){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
    if (folded){ rr(ctx, -70, -22, 140, 44, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -22, 18, 0, Math.PI); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); return; }
    ctx.beginPath(); ctx.moveTo(-30, -60); ctx.lineTo(-80, -40); ctx.lineTo(-100, 0); ctx.lineTo(-62, 14); ctx.lineTo(-56, 70); ctx.lineTo(56, 70); ctx.lineTo(62, 14); ctx.lineTo(100, 0); ctx.lineTo(80, -40); ctx.lineTo(30, -60); ctx.quadraticCurveTo(0, -30, -30, -60); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  TT.scene(PX + "kaos", "Cerita: tabel terisi sendiri, kaos terbang ke tumpukan ukuran", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Ka = Object.assign({ sizes: [], rows: [], tableX: 680 }, f.kaos || {});
    const tSheet = T(s, Ka.sheetCue, .3, idx), tPile = T(s, Ka.pileCue, .3, idx), tDone = T(s, Ka.doneCue, .4, idx);
    const sx = 560, sy = 330, sw = 820, tabTop = GY - 420, cols = ["#C2691F", "#2F6F73", "#5B7DB1", "#D9483B"];
    const nRows = Math.min(80, Math.floor(Math.max(0, t - tSheet) * 26));
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1000 },
      back: () => {
        // floating sheet
        const q = eBack(SAT(t, tSheet - .3, .5)); if (q > 0){ ctx.save(); ctx.translate(sx, sy + 200); ctx.scale(q, q); ctx.translate(-sx, -sy - 200);
          rr(ctx, sx - sw / 2, sy, sw, 420, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); rr(ctx, sx - sw / 2, sy, sw, 64, [18, 18, 0, 0]); ctx.fillStyle = GREEN; ctx.fill();
          ["NAMA", "UKURAN", "ALERGI"].forEach((h, i) => textL(ctx, h, sx - sw / 2 + 24 + i * 270, sy + 44, 28, "#FFFFFF", 900));
          ctx.save(); rr(ctx, sx - sw / 2, sy + 64, sw, 356, 0); ctx.clip(); const off = Math.max(0, nRows - 5) * 64 + ((t * 26) % 1) * (nRows > 5 && nRows < 80 ? 64 : 0);
          for (let r = Math.max(0, nRows - 7); r < nRows; r++){ const y = sy + 64 + r * 64 - off + 14; const R0 = Ka.rows[r % Ka.rows.length] || ["-", "-", "-"];
            ctx.fillStyle = r % 2 ? "#F3F7F7" : "#FFFFFF"; ctx.fillRect(sx - sw / 2, y - 14, sw, 64); R0.forEach((v, i) => textL(ctx, v, sx - sw / 2 + 24 + i * 270, y + 30, 30, BROWN, 700, 240)); }
          ctx.restore(); popChip(ctx, nRows + "/80", sx + sw / 2 - 90, sy + 32, 1, PAPER, GREEN, 28); ctx.restore(); }
        // table with piles
        ctx.fillStyle = "#8E4E2E"; rr(ctx, Ka.tableX - 330, tabTop, 660, 30, 8); ctx.fill(); ol(ctx, 5); ctx.fillRect(Ka.tableX - 300, tabTop + 30, 24, GY - tabTop - 30); ctx.fillRect(Ka.tableX + 276, tabTop + 30, 24, GY - tabTop - 30);
        Ka.sizes.forEach((z, i) => { const x = Ka.tableX - 240 + i * 160, k = Math.min(z.h || 6, Math.floor(Math.max(0, t - tPile - i * .15) * 5)); for (let j = 0; j < k; j++) tshirt(ctx, x + (rnd(i * 7 + j) - .5) * 10, tabTop - 22 - j * 40, .9, 0, cols[i], true);
          if (t >= tPile){ popChip(ctx, z.s, x, tabTop + 80, t - tPile, PAPER, BROWN, 34); popChip(ctx, String(z.n), x, tabTop - 70 - k * 40, t - tPile - .9 - i * .1, cols[i], "#FFFFFF", 34); } });
        if (t >= tPile) for (let i = 0; i < 8; i++){ const q = ((t - tPile) * 1.2 + i / 8) % 1, zi = i % Math.max(1, Ka.sizes.length), tx = Ka.tableX - 240 + zi * 160; if (t - tPile > 3) break;
          tshirt(ctx, lerp(sx + (rnd(i) - .5) * 400, tx, q), lerp(sy + 420, tabTop - 200, q) - Math.sin(q * Math.PI) * 220, .8, q * 6, cols[zi], false); }
        // clock
        const cx = 110, cy = 850; clockFace(ctx, cx, cy, 62, t, 1.2); },
      over: () => { if (t >= tDone){ stampBox(ctx, Ka.stamp || "BERES 11.30", 540, 860, t - tDone, GREEN, 66, -.08); burstFx(ctx, 540, 860, t - tDone - .1, GREEN, 12, 280); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Ka = f.kaos || {}; if (Ka.sheetCue) add(cueT(s, Ka.sheetCue, .3, i), "whoosh"); if (Ka.pileCue){ const t0 = cueT(s, Ka.pileCue, .3, i); for (let k = 0; k < 5; k++) add(t0 + k * .4, "pop"); } if (Ka.doneCue) add(cueT(s, Ka.doneCue, .4, i), "chime"); });

})();
