/* Scene pack j2611221200501: MODE CERITA story scenes for SB34, SP34, RN34, KD34, JS34. Layout prefix j2611221200501_.
   Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front)
   plus pack extras handled by base():
     shots [{at|cue, env, envOpt, toons, cam, items, pops, piece:false}]   hard cut (cream flash) to a new shot inside one scene
     hold  [{on, kind, at|cue, outCue, s, dx, dy}]   object in a toon's hand: paper, phone, loupe, scanner, staff, ricestack, tape ...
     items [{kind, x, y, at|cue, outCue, drop, front, s, r}]   world objects: cabinet, stickynote, deskphone, ricestack, ...
     pops [{at|cue, text, x, y, size}]  big outlined words      confetti {at|cue}      rain {at|cue, outCue}  rain over the screen
     keys [{at|cue, outCue, keys:["Ctrl","C"], label, x, y, s}]   keyboard keycap combo pressed on screen
     toon.ride = true (+ y raised, bag, rideCol)   the toon rides a scooter
   Set pieces (layout suffix):
     _adegan   generic story shot with the extras above
     _mogok    rainy street: pushing a scooter with a flat tyre, a car splashes a puddle (BYUR), a MOOD face drops    f.mogok
     _sortir   loading dock: parcels tossed into two trucks (MEDAN / MAKASSAR) without checking labels, wrong truck, trucks
               drive off, phone rings, PAKET TERTUKAR swap card                                                        f.sort
     _kokpit   cockpit: grumpy pilot, rain + wiper on the windshield, checklist toggles light green, take-off           f.kokpit
     _rompi    loading dock: work vest flies on, three checks (loupe / scanner beam BIP / photo flash), clouds part, MOOD face rises   f.rompi
     _cecer    office: requests from chat / email / desk phone / hallway get slapped onto the toon as notes; one falls and slides
               under the cabinet (spotlight TERSELIP)                                                                  f.cecer
     _domba    imagination: shepherd + tagged sheep entering from every direction, one wanders off; a pen with ONE gate, sheep
               pass one by one, counter n/5                                                                            f.domba
     _rel      office: one form slot prints numbered request tickets that slide onto a ticket rail; ticket done + tick  f.rel
     _nasi     seminar hall stage: everyone carries a stack of lunch boxes, a 300-box tower; empty banner frame + mic "?"   f.nasi
     _perahu   top-down rowing boat on a lake: all paddles on one side = spinning; one side each = straight with a wake   f.perahu
     _topi     meeting room: the leader throws role hats (chef / headphones / beret / pin) onto heads, role board fills   f.topi
     _seminar  D-day stage: banner rolls down, speaker pumps, lunch boxes pop in, -1 JAM card; toons wear their role hats   f.booth
     _layar    desk + big monitor: right-click copy/paste cycle with giant cursor and context menu, click + row counters (mode
               "klik"); a paragraph deleted, letters blast out, Ctrl+Z pulls them back (mode "urung")             f.layar
     _tombol   giant keycaps on the floor (Ctrl C V Z): toons stomp combos, a copied row flies between two documents,
               Ctrl flips to Cmd                                                                                       f.tombol
     _jahit    tailor shop counter: slam (BRAK), shouting gusts, paper scraps swirl, the clash (mode "marah"); breathing ring,
               scraps float back down (mode "tenang")                                                                   f.laundry
     _telinga  red earmuffs "KESAL" on the angry customer: explanation cards crumple into paper balls at his feet; they fly off
               when he feels heard                                                                                      f.telinga
     _ekspres  tailor shop at night: needle + thread stitch the suit's seams, RAPI; shots: scooter delivery at dawn, wedding   f.ekspres
   Camera keys may use on:"<spot>" for named spots of a set piece. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221200501_";
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

  const EXTRA = {};   // extra item kinds (filled by later files): EXTRA[kind](ctx, t, o), origin = hand / floor point
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
    else if (EXTRA[kind]){ EXTRA[kind](ctx, t, o); }
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
    const { F: f, T0: shotT } = shotOf(s, t), idx = G.scene, toons = H.toons ? H.toons(f.toons || [], f) : (f.toons || []);
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
    const drawItems = front => (f.items || []).filter(p => !!p.front === front).forEach((p, j) => { const T0 = p.cue || p.at != null ? tOf(s, p, .3, idx) : -1, O = p.outCue ? T(s, p.outCue, .5, idx) : (p.out ?? 1e9);
      if (t < T0 || t > O + .3) return; const q = (T0 < 0 ? 1 : (p.drop ? 1 : eBack(clamp((t - T0) / .4, 0, 1)))) * (t > O ? 1 - (t - O) / .3 : 1);
      const dy = p.drop && T0 >= 0 ? -900 * Math.pow(1 - clamp((t - T0) / .5, 0, 1), 2) : 0;
      layer(ctx, c, p.depth ?? 1, () => { ctx.save(); ctx.translate(p.x ?? 540, (p.y ?? GY) + dy); ctx.scale(q * (p.s || 1) * (p.flip ? -1 : 1), q * (p.s || 1)); ctx.rotate(p.rot || 0);
        if (EXTRA[p.kind]) EXTRA[p.kind](ctx, t, Object.assign({ k: t - T0 }, p)); else drawItem(ctx, p.kind, 0, 0, t, p); ctx.restore(); }); });
    drawItems(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j]; if (a.chair){ layer(ctx, c, 1, () => chairAt(ctx, a.chairX ?? st.x, st.y, st.size, st.face || 1, st.moving && a.chairX == null ? (t - st.moveT) * 9 : 0)); }
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st }); if (a.ride) layer(ctx, c, 1, () => rideOver(ctx, st, a, t));
      holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1), dirt: h.dirt, lines: h.lines, spin: h.spin }); }));
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true); drawItems(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    if (f.rain){ const r0 = tOf(s, f.rain, .1, idx), r1 = f.rain.outCue ? T(s, f.rain.outCue, .5, idx) : (f.rain.out ?? 1e9); const a = clamp((t - r0) / .5, 0, 1) * (1 - clamp((t - r1) / 1.2, 0, 1)); if (a > 0) rainFx(ctx, t, a, f.rain.n || 90); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    (f.keys || []).forEach((kk, j) => { const k0 = tOf(s, kk, .3 + j * .1, idx), k1 = kk.outCue ? T(s, kk.outCue, .5, idx) : (kk.out ?? 1e9); if (t >= k0 && t < k1 + .3) ovs.push(() => keyCombo(ctx, kk, t - k0, t > k1 ? (t - k1) / .3 : 0, t)); });
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f };
  }
  /* rain streaks over the whole screen */
  function rainFx(ctx, t, a, n){ ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "rgba(40,52,70,.22)"; ctx.fillRect(0, 0, 1080, 1920);
    ctx.strokeStyle = "rgba(225,236,245,.75)"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath();
    for (let i = 0; i < n; i++){ const sp = 1500 + rnd(i) * 700, x0 = rnd(i + 3) * 1300 - 100, y = ((t * sp + rnd(i + 7) * 2200) % 2200) - 140, x = x0 - (y + 140) * .18; ctx.moveTo(x, y); ctx.lineTo(x - 11, y + 60); }
    ctx.stroke(); ctx.restore(); }
  /* keyboard key combo (screen): o {keys:["Ctrl","C"], label, x, y, s, press (s after appear), mac:"Cmd"} */
  function keycap(ctx, txt, x, y, w, h, dn, col){ const d = dn * 12; ctx.save(); ctx.translate(x, y);
    rr(ctx, -w / 2, -h / 2 + 14, w, h, 22); ctx.fillStyle = "#1E1A18"; ctx.fill();
    rr(ctx, -w / 2, -h / 2 + d, w, h - 4, 22); ctx.fillStyle = col || "#FDFBF6"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    rr(ctx, -w / 2 + 14, -h / 2 + d + 10, w - 28, h - 34, 16); ctx.fillStyle = hexA("#FFFFFF", .55); ctx.fill();
    fit(ctx, txt, w - 30, h * .42, 900); ctx.fillStyle = col && col !== "#FDFBF6" ? "#FFFFFF" : BROWN; ctx.textAlign = "center"; ctx.fillText(txt, 0, d + h * .1); ctx.textAlign = "left"; ctx.restore(); }
  function keyCombo(ctx, o, k, out, t){ const s0 = o.s || 1, q = eBack(clamp(k / .4, 0, 1)) * (1 - eOut(clamp(out, 0, 1))); if (q <= 0) return;
    const keys = o.keys || ["Ctrl", "C"], H = 150, ws = keys.map(kk => kk.length > 2 ? 230 : 160), gap = 80, tot = ws.reduce((a, b) => a + b, 0) + gap * (keys.length - 1);
    ctx.save(); ctx.translate(o.x ?? 540, o.y ?? 420); ctx.scale(q * s0, q * s0); ctx.rotate((o.rot ?? -2) * Math.PI / 180);
    if (o.label){ rr(ctx, -tot / 2 - 40, -H / 2 - 40, tot + 80, H + 140, 34); ctx.fillStyle = hexA(o.dark ? "#13223D" : CREAM, .94); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); }
    let x = -tot / 2; const pr = o.press ?? .55;
    keys.forEach((kk, j) => { const pk = k - pr - j * .12, dn = pk > 0 && pk < .5 ? Math.sin(clamp(pk / .5, 0, 1) * Math.PI) : 0;
      keycap(ctx, kk, x + ws[j] / 2, 0, ws[j], H, dn, j === keys.length - 1 && pk > 0 ? ORANGE : null); x += ws[j];
      if (j < keys.length - 1){ font(ctx, 900, 70, FAM); ctx.fillStyle = o.dark ? CREAM : BROWN; ctx.textAlign = "center"; ctx.fillText("+", x + gap / 2, 26); ctx.textAlign = "left"; x += gap; } });
    if (o.label){ textC(ctx, o.label, 0, H / 2 + 72, 50, o.dark ? CREAM : BROWN, 900, tot + 40); }
    if (k > pr + .1 && k < pr + .9) burstFx(ctx, tot / 2 - ws[ws.length - 1] / 2, 0, k - pr - .1, HL, 10, 160);
    ctx.restore(); }
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
    (f0.keys || []).forEach((kk, j) => { const k0 = tOf(s, kk, .3 + j * .1, i); add(k0, "pop"); add(k0 + (kk.press ?? .55), "ping"); });
    if (f0.rain) add(tOf(s, f0.rain, .1, i), "whoosh");
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= shared: mood face (screen) ================= */
  function moodFace(ctx, x, y, r, sm, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    const col = sm < 0 ? "#9FB2C8" : GOLD; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 7);
    ctx.fillStyle = hexA("#FFFFFF", .45); ctx.beginPath(); ctx.ellipse(-r * .38, -r * .45, r * .22, r * .13, -.6, 0, TAU); ctx.fill();
    ctx.fillStyle = OUT; const ey = -r * .18, blink = Math.sin(t * 1.7) > .97 ? .2 : 1;
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * r * .32, ey + (sm < 0 ? r * .05 : 0), r * .09, r * .13 * blink, 0, 0, TAU); ctx.fill(); });
    if (sm < 0){ ctx.strokeStyle = OUT; ctx.lineWidth = r * .07; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * r * .48, ey - r * .2); ctx.lineTo(d * r * .18, ey - r * .3 - sm * r * .1); ctx.stroke(); }); }
    ctx.strokeStyle = OUT; ctx.lineWidth = r * .09; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-r * .4, r * .38 - sm * r * .1); ctx.quadraticCurveTo(0, r * .38 + sm * r * .38, r * .4, r * .38 - sm * r * .1); ctx.stroke();
    if (sm < -.5){ ctx.fillStyle = "#6FB7E8"; ctx.beginPath(); ctx.ellipse(r * .36, ey + r * .3 + ((t * 1.2) % 1) * r * .5, r * .07, r * .11, 0, 0, TAU); ctx.fill(); }
    if (o.tag) { ctx.rotate(-(o.rot || 0)); chip(ctx, o.tag, 0, r + 52, sm < 0 ? "#3B4A6B" : ORANGE, "#FFFFFF", 34); }
    ctx.restore(); }
  function dropPath(k){ // falling with bounces: 0..1 progress -> 0..1 y fraction
    if (k < .45) return Math.pow(k / .45, 2); const b = (k - .45) / .55; return 1 - Math.abs(Math.sin(b * Math.PI * 2)) * .18 * (1 - b); }

  /* ================= _mogok: flat-tyre scooter pushed through the rain, car splash ================= */
  function scooter(ctx, x, y, t, o){ o = o || {}; const f = o.face || 1, s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(f * s, s);
    const body = o.col || "#2F6F73";
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(10, 4, 260, 18, 0, 0, TAU); ctx.fill();
    const wheel = (cx, flat) => { ctx.save(); ctx.translate(cx, flat ? -40 : -60);
      if (flat){ ctx.beginPath(); ctx.ellipse(0, 4, 72, 44, 0, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.fillStyle = "#1E1A18"; ctx.fillRect(-74, 4, 148, 40); }
      else { ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = "#B9B9C2"; ctx.fill(); ol(ctx, 4);
      ctx.save(); ctx.rotate((o.roll || 0) / 60); ctx.strokeStyle = OUT; ctx.lineWidth = 5; for (let k = 0; k < 3; k++){ ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, 0); ctx.stroke(); } ctx.restore(); ctx.restore(); };
    wheel(-160, o.flat); wheel(175, false);
    // rear body + seat
    ctx.beginPath(); ctx.moveTo(-250, -110); ctx.quadraticCurveTo(-260, -250, -120, -265); ctx.lineTo(10, -255); ctx.quadraticCurveTo(40, -170, 20, -110); ctx.closePath(); ctx.fillStyle = body; ctx.fill(); ol(ctx, 6);
    rr(ctx, -215, -300, 210, 46, 22); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = RED; rr(ctx, -268, -190, 26, 34, 8); ctx.fill(); ol(ctx, 3);
    // floorboard + front shield
    rr(ctx, -10, -120, 140, 26, 10); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(110, -100); ctx.lineTo(130, -330); ctx.quadraticCurveTo(180, -350, 210, -300); ctx.lineTo(200, -120); ctx.closePath(); ctx.fillStyle = body; ctx.fill(); ol(ctx, 6);
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(170, -110); ctx.lineTo(178, -60); ctx.stroke();
    // handlebar + mirror + lamp
    ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(150, -350); ctx.lineTo(95, -385); ctx.stroke(); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 9; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(160, -350); ctx.lineTo(175, -420); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.ellipse(180, -432, 18, 12, -.3, 0, TAU); ctx.fillStyle = "#CFE7EE"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(205, -285, 16, 24, 0, 0, TAU); ctx.fillStyle = "#FFF4C8"; ctx.fill(); ol(ctx, 4);
    if (o.lamp) glowAt(ctx, 240, -285, 160, "#FFE3A8", .35 + .1 * Math.sin(t * 9));
    ctx.restore(); }
  function carSide(ctx, x, y, col, t){ ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 6, 300, 20, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-290, -40); ctx.lineTo(-280, -140); ctx.lineTo(-150, -150); ctx.lineTo(-90, -250); ctx.lineTo(120, -250); ctx.lineTo(200, -150); ctx.lineTo(290, -130); ctx.lineTo(300, -40); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#CFE7EE"; ctx.beginPath(); ctx.moveTo(-130, -155); ctx.lineTo(-82, -232); ctx.lineTo(10, -232); ctx.lineTo(10, -155); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(30, -155); ctx.lineTo(30, -232); ctx.lineTo(110, -232); ctx.lineTo(170, -155); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#FFF4C8"; rr(ctx, 270, -120, 26, 30, 8); ctx.fill(); ol(ctx, 3);
    [-180, 180].forEach(dx => { ctx.beginPath(); ctx.arc(dx, -30, 52, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.beginPath(); ctx.arc(dx, -30, 22, 0, TAU); ctx.fillStyle = "#B9B9C2"; ctx.fill();
      ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(dx, -30); ctx.lineTo(dx + Math.cos(t * 30) * 22, -30 + Math.sin(t * 30) * 22); ctx.stroke(); });
    ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(-330 - i * 40, -60 - i * 40); ctx.lineTo(-450 - i * 60, -60 - i * 40); ctx.stroke(); }
    ctx.restore(); }
  TT.scene(PX + "mogok", "Cerita: dorong motor ban bocor di bawah hujan, dicipratin mobil", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ puddleX: 660, dx: 40 }, f.mogok || {});
    const tCar = T(s, M.carCue, .55, idx), tSplash = T(s, M.splashCue, .65, idx), tDrop = T(s, M.dropCue, .85, idx), tKm = T(s, M.kmCue, .3, idx);
    let scX = 0;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { face: () => [scX - 40, GY - 560, 1.25] },
      back: () => { // puddle on the pavement
        ctx.save(); ctx.fillStyle = hexA("#7FA9C9", .75); ctx.beginPath(); ctx.ellipse(M.puddleX, GY + 30, 190, 30, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++){ const q = ((t * .9 + i / 3) % 1); ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.ellipse(M.puddleX - 80 + i * 70, GY + 30, 20 + q * 50, 4 + q * 9, 0, 0, TAU); ctx.stroke(); } ctx.restore(); },
      front: (ctx2, c, sts) => { const st = sts[0]; if (!st) return; scX = st.x + M.dx * (st.face || 1);
        const roll = st.x * 1.0; scooter(ctx, scX, GY + 10, t, { flat: true, face: st.face || 1, roll, s: .95 });
        // hiss from the flat tyre
        const hx = scX - 160 * (st.face || 1) * .95; ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 4; for (let i = 0; i < 3; i++){ const q = ((t * 1.4 + i / 3) % 1); ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.arc(hx - 60 - q * 70, GY - 40 - q * 30, 8 + q * 16, 0, TAU); ctx.stroke(); } ctx.restore();
        // passing car + splash
        const kc = t - tCar; if (kc > -.2 && kc < 1.6){ const cx = lerp(-700, 1900, clamp((kc + .2) / 1.6, 0, 1)); carSide(ctx, cx, GY + 200, "#D9483B", t); }
        const ks = t - tSplash; if (ks > 0 && ks < 2.2){ ctx.save(); for (let i = 0; i < 46; i++){ const a = -Math.PI / 2 - .9 + rnd(i) * 1.3, v = 900 + rnd(i + 4) * 700, tt = ks - rnd(i + 9) * .12; if (tt < 0) continue;
            const x = M.puddleX - 60 + Math.cos(a) * v * tt, y = GY + 20 + Math.sin(a) * v * tt + 1500 * tt * tt; if (y > GY + 60) continue;
            ctx.globalAlpha = clamp(1.6 - tt, 0, 1); ctx.fillStyle = i % 3 ? "#8EC3E6" : "#FFFFFF"; ctx.beginPath(); ctx.ellipse(x, y, 10 + rnd(i) * 12, 16 + rnd(i) * 10, a, 0, TAU); ctx.fill(); }
          // water sheet
          const q = clamp(ks / .35, 0, 1), fade = clamp(1 - (ks - .35) / .5, 0, 1); if (fade > 0){ ctx.globalAlpha = fade * .8; ctx.fillStyle = "#8EC3E6"; ctx.beginPath(); ctx.moveTo(M.puddleX + 120, GY + 30);
            ctx.quadraticCurveTo(M.puddleX - 40, GY - 700 * q, M.puddleX - 380 * q, GY - 380 * q); ctx.quadraticCurveTo(M.puddleX - 60, GY - 300 * q, M.puddleX - 40, GY + 30); ctx.fill(); }
          ctx.restore(); }
        if (t > tSplash + .2){ ctx.save(); ctx.fillStyle = "#8EC3E6"; for (let i = 0; i < 8; i++){ const q = ((t * 1.3 + rnd(i)) % 1), x = st.x - 80 + rnd(i + 2) * 160, y = GY - 620 + rnd(i + 5) * 400 + q * 160; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.ellipse(x, y, 7, 12, 0, 0, TAU); ctx.fill(); } ctx.restore(); } },
      over: (ctx2, c) => {
        if (t >= tKm) popChip(ctx, M.kmText || "1 KM", 820, 470, t - tKm, CREAM, BROWN, 46, .06);
        if (t >= tSplash){ const p = c.toScreen(M.puddleX - 120, GY - 520); popWord(ctx, M.splashText || "BYUR!", 760, 470, t - tSplash, { size: 120, rot: -10, hold: 1.2, col: "#6FB7E8" }); }
        if (t >= tDrop){ const k = t - tDrop, q = dropPath(clamp(k / 1.1, 0, 1)); moodFace(ctx, 790, lerp(150, 560, q), 105, lerp(.6, -1, clamp(k / .8, 0, 1)), t, { rot: Math.sin(k * 6) * .12 * Math.max(0, 1 - k), tag: "MOOD" });
          if (k > .5 && k < 1.2) burstFx(ctx, 790, 650, k - .5, "#9FB2C8", 10, 150); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.mogok || {}; if (M.carCue) add(cueT(s, M.carCue, .55, i), "whoosh"); if (M.splashCue){ add(cueT(s, M.splashCue, .65, i), "pop"); }
    if (M.dropCue){ const t0 = cueT(s, M.dropCue, .85, i); add(t0 + .5, "pop"); add(t0 + .05, "whoosh"); } if (M.kmCue) add(cueT(s, M.kmCue, .3, i), "pop"); });

  /* ================= _sortir: tossing parcels into two trucks without checking labels ================= */
  function truckBack(ctx, x, y, w, label, col, t, o){ o = o || {}; const s = o.s ?? 1; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const h = w * 1.45, top = -h - 120;
    ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.ellipse(0, 6, w * .62, 18, 0, 0, TAU); ctx.fill();
    [-w * .36, w * .36].forEach(dx => { rr(ctx, dx - 40, -110, 80, 110, 18); ctx.fillStyle = "#1E1A18"; ctx.fill(); });
    rr(ctx, -w / 2 - 8, -150, w + 16, 46, 8); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = RED; rr(ctx, -w / 2 + 6, -142, 34, 28, 6); ctx.fill(); rr(ctx, w / 2 - 40, -142, 34, 28, 6); ctx.fill();
    if (o.puff){ ctx.save(); for (let i = 0; i < 4; i++){ const q = ((t * 1.6 + i / 4) % 1); ctx.globalAlpha = (1 - q) * .55; ctx.fillStyle = "#B9B9C2"; ctx.beginPath(); ctx.arc(-w * .3 - q * 80, -60 - q * 60, 18 + q * 40, 0, TAU); ctx.fill(); } ctx.restore(); }
    rr(ctx, -w / 2, top, w, h, 14); ctx.fillStyle = "#F3EBDD"; ctx.fill(); ol(ctx, 6);
    const op = clamp(o.open ?? 1, 0, 1), iw = w - 40;
    rr(ctx, -iw / 2, top + 24, iw, h - 44, 8); ctx.fillStyle = "#2C2433"; ctx.fill();
    // cargo inside (boxes already loaded)
    for (let i = 0; i < (o.load || 0); i++){ const bx = -iw / 2 + 30 + (i % 3) * (iw - 60) / 3, by = top + h - 70 - Math.floor(i / 3) * 70; rr(ctx, bx, by, (iw - 80) / 3, 60, 5); ctx.fillStyle = "#C9925E"; ctx.fill(); ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 3; ctx.stroke(); }
    // doors
    const dw = iw / 2 * (1 - op * .85); ctx.fillStyle = col; [-1, 1].forEach(d => { const x0 = d < 0 ? -iw / 2 : iw / 2 - dw; rr(ctx, x0, top + 24, dw, h - 44, 6); ctx.fill(); ol(ctx, 4); });
    // sign
    const sw = w * .9; rr(ctx, -sw / 2, top - 92, sw, 78, 14); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); textC(ctx, label, 0, top - 38, 44, "#FFFFFF", 900, sw - 30);
    ctx.restore(); return { open: [x, y + (top + h / 2) * s] }; }
  function parcel(ctx, x, y, w, tag, tagCol, rot, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); const h = w * .72;
    rr(ctx, -w / 2, -h, w, h, 8); ctx.fillStyle = "#C9925E"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#E3B680"; ctx.fillRect(-w * .1, -h, w * .2, h);
    if (tag){ rr(ctx, -w * .38, -h * .62, w * .5, h * .38, 5); ctx.fillStyle = tagCol || ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); textC(ctx, tag, -w * .13, -h * .34, w * .17, "#FFFFFF", 900, w * .46); }
    if (o.glow){ ctx.strokeStyle = o.glow; ctx.lineWidth = 9; rr(ctx, -w / 2 - 10, -h - 10, w + 20, h + 20, 12); ctx.stroke(); }
    if (o.ok > 0){ const q = eBack(clamp(o.ok / .3, 0, 1)); ctx.save(); ctx.translate(w * .32, -h * .9); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-3, 12); ctx.lineTo(16, -12); ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "sortir", "Cerita: paket dilempar ke dua truk tanpa cek label, satu tertukar", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, S = Object.assign({ trucks: [{ x: 640, label: "MEDAN", col: ORANGE, tag: "MDN" }, { x: 930, label: "MAKASSAR", col: TEAL, tag: "MKS" }], w: 270, pileX: 390 }, f.sort || {});
    const tosses = (S.tosses || []).map((o, j) => Object.assign({ T: T(s, o.cue, .3 + j * .1, idx) }, o)), tGo = T(s, S.goCue, .4, idx), tRing = T(s, S.ringCue, .4, idx), tSwap = T(s, S.swapCue, .5, idx);
    const goQ = eIn2(clamp((t - tGo) / 2.2, 0, 1));
    let opens = [];
    base(ctx, s, t, { env: "street", envOpt: { time: t > tGo + .6 ? "dusk" : "day" },
      spots: { t0: [S.trucks[0].x, GY - 480, 1.25], t1: [S.trucks[1].x, GY - 480, 1.25] },
      back: () => { opens = S.trucks.map((tr, j) => { const load = 3 + tosses.filter(o => o.to === j && t > o.T + .6).length;
          return truckBack(ctx, tr.x + (tr.x - 540) * goQ * .2, GY - 260 * goQ, S.w, tr.label, tr.col, t, { s: 1 - .62 * goQ, open: 1 - clamp((t - tGo + .5) / .4, 0, 1), load, puff: t > tGo - .3 }); }); },
      front: (ctx2, c, sts) => { const st = sts[0];
        // pallet with remaining parcels
        const left = tosses.filter(o => t < o.T).length; ctx.fillStyle = "#9B6A3C"; rr(ctx, S.pileX - 110, GY - 40, 220, 40, 6); ctx.fill(); ol(ctx, 4);
        for (let i = 0; i < left; i++){ const o = tosses[tosses.length - 1 - i]; parcel(ctx, S.pileX - 50 + (i % 2) * 100, GY - 40 - Math.floor(i / 2) * 88, 110, o.tag || S.trucks[o.label ?? o.to].tag, S.trucks[o.label ?? o.to].col, (rnd(i) - .5) * .1); }
        // parcels in flight
        tosses.forEach((o, j) => { const k = t - o.T; if (k < 0 || k > .75 || !st) return; const q = k / .75, from = handOf(st), to = opens[o.to] ? opens[o.to].open : [S.trucks[o.to].x, GY - 450];
          const x = lerp(from[0], to[0], q), y = lerp(from[1], to[1], q) - Math.sin(q * Math.PI) * 300; const L = S.trucks[o.label ?? o.to];
          parcel(ctx, x, y + 40, 110 * (1 - q * .35), L.tag, L.col, q * 7 * (j % 2 ? 1 : -1), { glow: o.wrong ? RED : null }); });
        if (st && st.pose !== "phone") { /* nothing */ } },
      over: (ctx2, c, sts) => {
        tosses.forEach(o => { if (!o.wrong || t < o.T + .7) return; const p = c.toScreen(S.trucks[o.to].x, GY - 700); popChip(ctx, o.chip || "SALAH TRUK?!", p[0] - 60, p[1] - 40, t - o.T - .7, RED, "#FFFFFF", 36, -.06); });
        if (t >= tRing && sts[0]){ const h = toonHead(sts[0]), p = c.toScreen(h[0] + 150, h[1] - 60); const rk = t - tRing; ctx.save(); ctx.strokeStyle = GOLD; ctx.lineCap = "round";
          for (let r = 0; r < 3; r++){ const w = (rk * 1.6 + r / 3) % 1; ctx.globalAlpha = 1 - w; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(p[0], p[1], 50 + w * 90, -1.2, 1.2); ctx.stroke(); } ctx.restore();
          if (rk < 1.4) popWord(ctx, "KRING!", p[0] + 40, p[1] - 150, rk, { size: 80, rot: 8, hold: 1.3 }); }
        if (t >= tSwap){ const k = t - tSwap, q = eBack(clamp(k / .4, 0, 1)), sw = easeIO(clamp((k - .4) / .8, 0, 1));
          ctx.save(); ctx.translate(540, 380); ctx.scale(q, q); rr(ctx, -380, -150, 760, 300, 30); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ol(ctx, 6);
          parcel(ctx, lerp(-210, 210, sw), 40 - Math.sin(sw * Math.PI) * 60, 130, "MDN", ORANGE, 0); parcel(ctx, lerp(210, -210, sw), 40 + Math.sin(sw * Math.PI) * 40, 130, "MKS", TEAL, 0);
          textC(ctx, "MAKASSAR", -210, 110, 30, TEAL, 900); textC(ctx, "MEDAN", 210, 110, 30, ORANGE, 900);
          if (k > 1.2){ const z = eBack(clamp((k - 1.2) / .3, 0, 1)); ctx.save(); ctx.scale(z, z); ctx.strokeStyle = RED; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-90, -90); ctx.lineTo(90, 50); ctx.moveTo(90, -90); ctx.lineTo(-90, 50); ctx.stroke(); ctx.restore(); }
          ctx.restore(); popChip(ctx, S.swapText || "TERTUKAR!", 540, 560, k - .3, RED, "#FFFFFF", 44, -.04); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.sort || {}; (S.tosses || []).forEach((o, j) => { const t0 = cueT(s, o.cue, .3 + j * .1, i); add(t0, "whoosh"); add(t0 + .75, o.wrong ? "ping" : "pop"); });
    if (S.goCue) add(cueT(s, S.goCue, .4, i), "whoosh"); if (S.ringCue){ const t0 = cueT(s, S.ringCue, .4, i); add(t0, "ping"); add(t0 + .3, "ping"); } if (S.swapCue) add(cueT(s, S.swapCue, .5, i), "pop"); });
  function eIn2(x){ return x * x; }

  /* ================= _kokpit: the grumpy pilot still runs the pre-flight checklist ================= */
  TT.scene(PX + "kokpit", "Cerita: pilot kesal tetap menjalankan daftar periksa, lalu lepas landas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ checks: [] }, f.kokpit || {});
    const checks = K.checks.map((o, j) => Object.assign({ T: T(s, o.cue, .3 + j * .1, idx) }, o)), tUp = T(s, K.upCue, .4, idx);
    const up = clamp((t - tUp) / 2.5, 0, 1), panelTop = GY - 300, WX0 = 420, WX1 = 1160, WY0 = 560, WY1 = panelTop - 10;
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: true }, envFront: false,
      spots: { panel: [760, panelTop - 40, 1.2] },
      back: () => {
        // runway / clouds rushing past the windshield
        ctx.save(); ctx.beginPath(); ctx.moveTo(WX0, WY0 + 40); ctx.lineTo(WX1, WY0); ctx.lineTo(WX1, WY1); ctx.lineTo(WX0 + 30, WY1); ctx.closePath(); ctx.clip();
        const hz = WY1 - 120 + up * 520; ctx.fillStyle = "#8C9A7A"; ctx.fillRect(WX0 - 50, hz, 900, 800); ctx.fillStyle = "#5E5A55"; ctx.beginPath(); ctx.moveTo(760, hz); ctx.lineTo(560, hz + 800); ctx.lineTo(960, hz + 800); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 6; i++){ const q = ((t * (up > 0 ? 1.4 : .25) + i / 6) % 1); ctx.fillRect(752, hz + q * q * 700, 16, 30 + q * 50); }
        if (up > 0){ for (let i = 0; i < 7; i++){ const q = ((t * 1.1 + i / 7) % 1); ctx.globalAlpha = .85; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(WX0 + rnd(i) * 700, WY0 - 100 + q * 900, 120, 50, 0, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
        // rain on the glass + wiper (before take-off)
        const rain = 1 - clamp((t - tUp) / 1, 0, 1);
        if (rain > 0){ ctx.globalAlpha = rain; ctx.fillStyle = hexA("#DDEFF5", .75); for (let i = 0; i < 40; i++){ const x = WX0 + rnd(i) * 720, y = WY0 + ((rnd(i + 2) * 700 + t * (40 + rnd(i) * 80)) % 700); ctx.beginPath(); ctx.ellipse(x, y, 5, 9, 0, 0, TAU); ctx.fill(); }
          const wa = Math.sin(t * 3.2) * .9; ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(790, WY1 + 10); ctx.lineTo(790 + Math.sin(wa) * 520, WY1 + 10 - Math.cos(wa) * 520); ctx.stroke(); }
        ctx.restore();
        // cockpit walls with the windshield hole
        ctx.save(); ctx.beginPath(); ctx.rect(-600, 0, 2400, 2400); ctx.moveTo(WX0, WY0 + 40); ctx.lineTo(WX0 + 30, WY1); ctx.lineTo(WX1, WY1); ctx.lineTo(WX1, WY0); ctx.closePath();
        ctx.fillStyle = "#3A4458"; ctx.fill("evenodd"); ctx.restore();
        ctx.strokeStyle = "#232A38"; ctx.lineWidth = 34; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(WX0, WY0 + 40); ctx.lineTo(WX1, WY0); ctx.lineTo(WX1, WY1); ctx.lineTo(WX0 + 30, WY1); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(790, WY0 + 20); ctx.lineTo(790, WY1); ctx.lineWidth = 26; ctx.stroke();
        rr(ctx, 120, GY - 760, 190, 640, 60); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6); rr(ctx, 140, GY - 740, 150, 600, 50); ctx.fillStyle = "#7A4A2E"; ctx.fill();
        ctx.fillStyle = "#4E5A72"; for (let i = 0; i < 10; i++){ ctx.beginPath(); ctx.arc(80 + i * 34, 500 + (i % 2) * 18, 6, 0, TAU); ctx.fill(); }
        // overhead switches blinking
        rr(ctx, -40, 360, 300, 120, 14); ctx.fillStyle = "#2C3446"; ctx.fill(); ol(ctx, 4);
        for (let i = 0; i < 8; i++){ ctx.fillStyle = Math.sin(t * 3 + i * 1.7) > .3 ? "#7CE38B" : "#4A5468"; ctx.beginPath(); ctx.arc(-10 + (i % 4) * 70, 395 + Math.floor(i / 4) * 50, 11, 0, TAU); ctx.fill(); } },
      front: () => {
        ctx.save(); ctx.translate(0, 0); rr(ctx, 380, panelTop, 900, 360, 30); ctx.fillStyle = "#2C3446"; ctx.fill(); ol(ctx, 6);
        rr(ctx, 380, panelTop, 900, 34, 16); ctx.fillStyle = "#1E2433"; ctx.fill();
        // gauges
        [[520, 70], [660, 70], [940, 70]].forEach(([gx, gy], j) => { ctx.beginPath(); ctx.arc(gx, panelTop + gy + 40, 52, 0, TAU); ctx.fillStyle = "#11151F"; ctx.fill(); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 6; ctx.stroke();
          const a = -2.3 + (j === 1 ? up * 3 : .6 + Math.sin(t * 2 + j) * .25 + up * 1.4); ctx.strokeStyle = j === 1 ? ORANGE : "#7CE38B"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(gx, panelTop + gy + 40); ctx.lineTo(gx + Math.cos(a) * 40, panelTop + gy + 40 + Math.sin(a) * 40); ctx.stroke(); });
        // checklist toggles
        const n = Math.max(1, checks.length); checks.forEach((o, j) => { const x = 500 + j * (560 / n) + 30, y = panelTop + 210, k = t - o.T, on = k >= 0, sw = on ? eBack(clamp(k / .25, 0, 1)) : 0;
          rr(ctx, x - 34, y - 50, 68, 100, 12); ctx.fillStyle = "#11151F"; ctx.fill();
          ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(.6, -.6, sw)); rr(ctx, -9, -60, 18, 60, 8); ctx.fillStyle = "#D9D9DE"; ctx.fill(); ol(ctx, 3); ctx.restore();
          ctx.beginPath(); ctx.arc(x, y + 72, 13, 0, TAU); ctx.fillStyle = on ? "#7CE38B" : RED; ctx.fill(); if (on) glowAt(ctx, x, y + 72, 50, "#7CE38B", .5); });
        ctx.restore(); },
      over: (ctx2, c) => { const n = Math.max(1, checks.length);
        checks.forEach((o, j) => { if (t < o.T) return; const p = c.toScreen(500 + j * (560 / n) + 30, panelTop - 70 - (j % 2) * 70); popChip(ctx, o.text + " ✓", p[0], p[1], t - o.T, GREEN, "#FFFFFF", 30, (j % 2 ? .05 : -.05)); });
        if (t >= tUp) popWord(ctx, K.upText || "LEPAS LANDAS!", 540, 470, t - tUp, { size: 96, rot: -6, hold: 1.6 }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kokpit || {}; (K.checks || []).forEach((o, j) => add(cueT(s, o.cue, .3 + j * .1, i), "ping")); if (K.upCue){ const t0 = cueT(s, K.upCue, .4, i); add(t0, "whoosh"); add(t0 + .2, "chime"); } });

  /* ================= _rompi: vest on, three standard checks, the mood rises ================= */
  EXTRA.scanner = (ctx, t, o) => { ctx.rotate(-.3); rr(ctx, -20, -10, 40, 90, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); rr(ctx, -46, -50, 92, 50, 14); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = RED; rr(ctx, 36, -40, 14, 30, 4); ctx.fill(); };
  EXTRA.loupe = (ctx, t, o) => { ctx.rotate(-.5); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 80); ctx.stroke(); ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 10; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -50, 50, 0, TAU); ctx.fillStyle = hexA("#CFE7EE", .6); ctx.fill(); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 12; ctx.stroke(); ol(ctx, 3); };
  TT.scene(PX + "rompi", "Cerita: pakai rompi kerja, tiga cek standar pada paket, mood naik", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, R0 = Object.assign({ tableX: 760, vest: "#F08C2E" }, f.rompi || {});
    const tVest = T(s, R0.vestCue, .2, idx), tAll = T(s, R0.allCue, .6, idx), tUp = T(s, R0.upCue, .7, idx);
    const steps = (R0.steps || []).map((o, j) => Object.assign({ T: T(s, o.cue, .3 + j * .1, idx) }, o));
    const sun = clamp((t - tUp + .4) / 1.4, 0, 1), deskTop = GY - 250;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      toons: (ts) => ts.map((a, j) => j === 0 && t >= tVest + .45 ? Object.assign({}, a, { jacket: R0.vest, idcard: "#2F6F73" }) : a),
      spots: { table: [R0.tableX, deskTop - 120, 1.2] },
      back: () => {
        // gloomy sky that clears up
        ctx.save(); ctx.globalAlpha = .5 * (1 - sun); ctx.fillStyle = "#6E7C8E"; ctx.fillRect(-800, -200, 2700, GY - 120); ctx.restore();
        if (sun > 0){ ctx.save(); ctx.globalAlpha = sun; glowAt(ctx, 880, 520, 420, "#FFE08A", .8); ctx.translate(880, 520); ctx.rotate(t * .25); ctx.fillStyle = hexA("#FFE9A8", .35);
          for (let i = 0; i < 10; i++){ ctx.rotate(TAU / 10); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(900, -70); ctx.lineTo(900, 70); ctx.closePath(); ctx.fill(); }
          ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore(); }
        // dark clouds sliding away
        ctx.save(); ctx.fillStyle = "#5F6B7C"; for (let i = 0; i < 5; i++){ const x = -100 + i * 280 + (i % 2 ? 1 : -1) * sun * 900 + Math.sin(t * .6 + i) * 20; ctx.beginPath(); ctx.ellipse(x, 330 + (i % 2) * 70, 220, 80, 0, 0, TAU); ctx.ellipse(x + 90, 290 + (i % 2) * 70, 140, 70, 0, 0, TAU); ctx.fill(); } ctx.restore();
        truckBack(ctx, 150, GY - 120, 240, "MEDAN", ORANGE, t, { s: .6, open: 1, load: 3 }); truckBack(ctx, 960, GY - 120, 240, "MAKASSAR", TEAL, t, { s: .6, open: 1, load: 3 }); },
      front: () => { ctx.fillStyle = "#9B6A3C"; rr(ctx, R0.tableX - 230, deskTop, 460, 34, 10); ctx.fill(); ol(ctx, 5); rr(ctx, R0.tableX - 210, deskTop + 30, 26, GY - deskTop - 30, 6); ctx.fill(); ol(ctx, 4); rr(ctx, R0.tableX + 184, deskTop + 30, 26, GY - deskTop - 30, 6); ctx.fill(); ol(ctx, 4);
        steps.forEach((o, j) => { const px = R0.tableX - 150 + j * 150, ok = t - o.T - .5, hop = t > tAll + j * .15 ? Math.abs(Math.sin((t - tAll - j * .15) * 7)) * 30 * Math.max(0, 1 - (t - tAll) / 1.5) : 0;
          parcel(ctx, px, deskTop - hop, 130, o.tag || "MDN", o.col || ORANGE, (rnd(j) - .5) * .08, { ok: ok, glow: t >= o.T && t < o.T + .5 ? GOLD : null });
          if (o.kind === "scan" && t > o.T && t < o.T + .8){ ctx.save(); ctx.globalAlpha = .8 * Math.sin(clamp((t - o.T) / .8, 0, 1) * Math.PI); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px - 70, deskTop - 50 + Math.sin(t * 20) * 26); ctx.lineTo(px + 70, deskTop - 50 + Math.sin(t * 20) * 26); ctx.stroke(); ctx.restore(); } }); },
      over: (ctx2, c, sts) => {
        if (t >= tVest - .5 && t < tVest + .5 && sts[0]){ const q = clamp((t - tVest + .5) / .95, 0, 1), h = toonHead(sts[0]), tg = c.toScreen(sts[0].x, h[1] + sts[0].size * .3), x = lerp(-150, tg[0], eOut(q)), y = lerp(200, tg[1], eOut(q)) - Math.sin(q * Math.PI) * 180;
          ctx.save(); ctx.translate(x, y); ctx.rotate((1 - q) * 6); ctx.scale(c.zoom, c.zoom); ctx.fillStyle = R0.vest; ctx.beginPath(); ctx.moveTo(-90, -110); ctx.lineTo(-30, -110); ctx.lineTo(0, -40); ctx.lineTo(30, -110); ctx.lineTo(90, -110); ctx.lineTo(100, 110); ctx.lineTo(-100, 110); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = "#E9E9EE"; ctx.fillRect(-98, 20, 196, 18); ctx.fillRect(-98, 60, 196, 18); ctx.restore(); }
        if (t >= tVest + .45 && t < tVest + 1.3 && sts[0]){ const h = toonHead(sts[0]), p = c.toScreen(sts[0].x, h[1] + sts[0].size * .3); burstFx(ctx, p[0], p[1], t - tVest - .45, HL, 12, 200); }
        steps.forEach((o, j) => { if (t < o.T) return; const p = c.toScreen(R0.tableX - 150 + j * 150, deskTop - 330 - (j % 2) * 60);
          popChip(ctx, (j + 1) + ". " + o.text, p[0], p[1], t - o.T, j === 2 ? ORANGE : TEAL, "#FFFFFF", 34, (j - 1) * .05);
          if (o.kind === "photo" && t - o.T > .25 && t - o.T < .6){ ctx.save(); ctx.globalAlpha = 1 - (t - o.T - .25) / .35; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
          if (o.kind === "scan" && t - o.T > .4 && t - o.T < 1.4){ const q = c.toScreen(R0.tableX - 150 + j * 150, deskTop - 160); popWord(ctx, "BIP!", q[0] + 40, q[1], t - o.T - .4, { size: 70, rot: 8, hold: 1 }); } });
        if (t >= tAll) popChip(ctx, R0.allText || "SEMUA BENAR ✓", 540, 380, t - tAll, GREEN, "#FFFFFF", 46, -.04);
        if (t >= tUp){ const k = t - tUp, q = eOut(clamp(k / 1.4, 0, 1)); moodFace(ctx, 860, lerp(1000, 560, q), 95, lerp(-.8, 1, clamp(k / 1, 0, 1)), t, { rot: Math.sin(t * 3) * .08, tag: "MOOD" });
          if (k > 1 && k < 1.9) burstFx(ctx, 860, 560, k - 1, GOLD, 12, 170); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const R0 = f.rompi || {}; if (R0.vestCue){ const t0 = cueT(s, R0.vestCue, .2, i); add(t0 - .4, "whoosh"); add(t0 + .45, "pop"); }
    (R0.steps || []).forEach((o, j) => { const t0 = cueT(s, o.cue, .3 + j * .1, i); add(t0, o.kind === "scan" ? "ping" : "pop"); add(t0 + .5, "chime"); });
    if (R0.allCue) add(cueT(s, R0.allCue, .6, i), "chime"); if (R0.upCue) add(cueT(s, R0.upCue, .7, i) + 1, "chime"); });

  /* ================= SP34 shared objects ================= */
  const NOTE_COL = { chat: "#BFE2EA", mail: "#FFFDF6", call: "#F3D9B5", hall: "#FFE27A" };
  const NOTE_ICON = { chat: "chat", mail: "file", call: "phone", hall: "pin" };
  function note(ctx, x, y, w, kind, text, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); const h = w * .72;
    ctx.fillStyle = "rgba(43,26,18,.18)"; rr(ctx, -w / 2 + 6, -h / 2 + 8, w, h, 6); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = NOTE_COL[kind] || "#FFE27A"; ctx.fill(); ol(ctx, 4);
    if (kind === "hall"){ ctx.fillStyle = hexA("#FFFFFF", .4); ctx.fillRect(-w / 2, -h / 2, w, h * .2); }
    icon(ctx, NOTE_ICON[kind] || "pin", -w / 2 + w * .18, -h / 2 + h * .26, w * .17, BROWN, 3);
    const { L, size } = lines2(ctx, text, w * .86, w * .15, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center";
    L.forEach((l, i) => { font(ctx, 900, size, FAM); ctx.fillText(l, 0, h * .12 + i * size * 1.1 - (L.length - 1) * size * .3); }); ctx.textAlign = "left"; ctx.restore(); }
  EXTRA.cabinet = (ctx, t, o) => { const w = o.w || 300, h = o.h || 560; ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 4, w * .6, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#5A3A2A"; rr(ctx, -w / 2 + 14, -40, 22, 40, 4); ctx.fill(); rr(ctx, w / 2 - 36, -40, 22, 40, 4); ctx.fill();
    rr(ctx, -w / 2, -h - 40, w, h, 12); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6);
    for (let i = 0; i < 3; i++){ const y = -h - 40 + 20 + i * (h - 40) / 3; rr(ctx, -w / 2 + 18, y, w - 36, (h - 40) / 3 - 14, 8); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 4); rr(ctx, -30, y + 24, 60, 14, 7); ctx.fillStyle = OUT; ctx.fill(); }
    if (o.dust){ ctx.fillStyle = hexA("#B9A58E", .7); for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.arc(-w / 2 + 30 + rnd(i) * (w - 60), -10 + Math.sin(t * 2 + i) * 3, 6 + rnd(i + 3) * 8, 0, TAU); ctx.fill(); } } };
  EXTRA.stickynote = (ctx, t, o) => { note(ctx, 0, 0, o.w || 150, o.nk || "hall", o.text || "", o.r || 0); };
  EXTRA.deskphone = (ctx, t, o) => { const k = o.ring != null && o.ring >= 0 && o.ring < 1.2 ? Math.sin(o.ring * 50) * 4 : 0; ctx.translate(k, 0);
    rr(ctx, -70, -60, 140, 60, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); rr(ctx, -80, -92, 160, 34, 16); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); };
  EXTRA.staff = (ctx, t, o) => { ctx.rotate(.15); ctx.strokeStyle = OUT; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(0, -200); ctx.arc(-40, -200, 40, 0, Math.PI, true); ctx.stroke();
    ctx.strokeStyle = "#9B6A3C"; ctx.lineWidth = 11; ctx.stroke(); };

  /* ================= _cecer: requests from every channel get slapped onto Dina, one falls under the cabinet ================= */
  TT.scene(PX + "cecer", "Cerita: permintaan dari semua jalur menempel di badan, satu jatuh terselip", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, C = Object.assign({ deskX: 760, cabX: 1060, notes: [] }, f.cecer || {});
    const notes = C.notes.map((o, j) => Object.assign({ T: T(s, o.cue, .3 + j * .08, idx) }, o)), tFall = T(s, C.fallCue, .4, idx), tHide = T(s, C.hideCue, .5, idx);
    const SPOT = { chat: [C.deskX + 120, GY - 360], mail: [C.deskX - 40, GY - 470], call: [C.deskX - 200, GY - 330], hall: null };
    const fallN = notes.find(o => o.fall);
    let anchor = null;
    const notePos = (st, o) => { const h = toonHead(st), k = st.size / 92, off = o.off || [0, 0]; return [h[0] + off[0] * k, h[1] + off[1] * k]; };
    const fallPath = (st) => { const p0 = notePos(st, fallN), k = t - tFall; if (k < 0) return null; const d = 2.4, q = clamp(k / d, 0, 1);
      if (q < .7){ const r = q / .7; return [lerp(p0[0], C.cabX - 60, r) + Math.sin(r * 10) * 70, lerp(p0[1], GY - 10, r * r), Math.sin(r * 12) * .7]; }
      const r = (q - .7) / .3; return [lerp(C.cabX - 60, C.cabX + 10, eOut(r)), GY - 10, 0]; };
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 90 },
      spots: { cab: [C.cabX - 80, GY - 150, 1.7] },
      back: () => { prop(ctx, "desk", C.deskX, GY - 40, { s: .9, laptop: true, papers: true, lx: -40 }, t);
        ctx.save(); ctx.translate(C.deskX - 200, GY - 290); EXTRA.deskphone(ctx, t, { ring: (notes.find(o => o.kind === "call") ? t - notes.find(o => o.kind === "call").T + .6 : -1) }); ctx.restore();
        ctx.save(); ctx.translate(C.cabX, GY); EXTRA.cabinet(ctx, t, {}); ctx.restore();
        ctx.save(); ctx.translate(C.deskX + 130, GY - 300); prop(ctx, "phone", 0, 0, { s: .45, notif: true }, t); ctx.restore(); },
      over1: (ctx2, c, sts, j) => { if (j !== (C.on ?? 0)) return; const st = sts[j]; anchor = st;
        notes.forEach((o, n) => { const k = t - o.T; if (k < 0) return; if (o.fall && t >= tFall) return;
          const end = notePos(st, o); let src = SPOT[o.kind]; if (!src){ const h2 = sts[o.from ?? 1]; src = h2 ? handOf(h2) : [1300, GY - 600]; }
          const q = clamp(k / .45, 0, 1), x = lerp(src[0], end[0], eOut(q)), y = lerp(src[1], end[1], eOut(q)) - Math.sin(q * Math.PI) * 160, sq = q >= 1 ? 1 + .25 * Math.exp(-(k - .45) * 9) * Math.sin((k - .45) * 30) : 1;
          ctx.save(); ctx.translate(x, y); ctx.scale(sq, 2 - sq); note(ctx, 0, 0, o.w || 150, o.kind, o.text, (o.rot ?? (rnd(n) - .5) * .5) * q + (1 - q) * 4); ctx.restore(); }); },
      post: (ctx2, c) => { const p = fallN && anchor && t >= tFall ? fallPath(anchor) : null;
        if (p){ ctx.save(); c.apply(ctx, 1); note(ctx, p[0], p[1], fallN.w || 150, fallN.kind, fallN.text, p[2]); ctx.restore(); }
        // cabinet in front of the slid note
        if (p){ ctx.save(); c.apply(ctx, 1); ctx.translate(C.cabX, GY); EXTRA.cabinet(ctx, t, {}); ctx.restore(); } },
      over: (ctx2, c) => {
        notes.forEach((o, n) => { if (o.kind !== "call" || t < o.T - .6 || t > o.T + .6) return; const p = c.toScreen(C.deskX - 200, GY - 380); popWord(ctx, "KRING!", p[0], p[1] - 40, t - o.T + .6, { size: 64, rot: -8, hold: 1 }); });
        if (t >= tHide){ const p = c.toScreen(C.cabX - 40, GY - 40), k = t - tHide; ctx.save(); ctx.globalAlpha = .55 * clamp(k / .4, 0, 1); ctx.fillStyle = "#000";
          ctx.beginPath(); ctx.rect(0, 0, 1080, 1920); ctx.arc(p[0], p[1], 220 * c.zoom, 0, TAU, true); ctx.fill("evenodd"); ctx.restore();
          popChip(ctx, C.hideText || "TERSELIP!", Math.min(860, p[0] - 120), p[1] - 300 * c.zoom / 1.5, k - .2, RED, "#FFFFFF", 46, -.06); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const C = f.cecer || {}; (C.notes || []).forEach((o, j) => { const t0 = cueT(s, o.cue, .3 + j * .08, i); add(t0, "whoosh"); add(t0 + .45, "pop"); if (o.kind === "call") add(t0 - .5, "ping"); });
    if (C.fallCue) add(cueT(s, C.fallCue, .4, i), "whoosh"); if (C.hideCue) add(cueT(s, C.hideCue, .5, i), "ping"); });

  /* ================= _domba: sheep from every direction vs. a pen with one gate ================= */
  function sheep(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.face || 1), s); const hop = o.walk ? Math.abs(Math.sin(t * 9 + (o.ph || 0))) * 14 : 0;
    ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(0, 4, 110, 16, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.lineCap = "round"; [-60, -25, 30, 65].forEach((lx, i) => { const sw = o.walk ? Math.sin(t * 9 + i * 1.6 + (o.ph || 0)) * 14 : 0; ctx.beginPath(); ctx.moveTo(lx, -60 - hop); ctx.lineTo(lx + sw, 0); ctx.stroke(); });
    ctx.translate(0, -hop); ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); for (let i = 0; i < 9; i++){ const a = i / 9 * TAU; ctx.moveTo(Math.cos(a) * 80 + 34, -110 + Math.sin(a) * 42); ctx.arc(Math.cos(a) * 80, -110 + Math.sin(a) * 42, 34, 0, TAU); } ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -110, 100, 58, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 4; ctx.stroke();
    ctx.save(); ctx.translate(100, -130 + Math.sin(t * 3 + (o.ph || 0)) * 4); ctx.fillStyle = "#2C2433"; ctx.beginPath(); ctx.ellipse(0, 0, 36, 46, .3, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-28, -26, 22, 10, -.6, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(10, -8, 9, 0, TAU); ctx.fill(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(13, -8, 4.5, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); ctx.arc(70, -165, 26, 0, TAU); ctx.fill();
    if (o.tag){ ctx.scale(o.face || 1, 1); rr(ctx, -70, -128, 140, 44, 10); ctx.fillStyle = o.tagCol || ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); textC(ctx, o.tag, 0, -96, 26, "#FFFFFF", 900, 126); }
    ctx.restore(); }
  TT.scene(PX + "domba", "Cerita: gembala, domba masuk dari segala arah vs kandang satu pintu", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Dm = Object.assign({ sheep: [], gateX: 600, penX0: 640, penX1: 1060 }, f.domba || {});
    const tIn = T(s, Dm.inCue, .1, idx), tLost = T(s, Dm.lostCue, .4, idx), tPen = T(s, Dm.penCue, .55, idx), tCount = T(s, Dm.countCue, .8, idx);
    const n = Dm.sheep.length, penY = GY - 40;
    const pos = (j) => { const o = Dm.sheep[j], k = t - tIn - j * .25, home = [180 + (j % 3) * 260 + (j > 2 ? 130 : 0), GY - 260 + (j > 2 ? 150 : 0) + (j % 2) * 40];
      const from = [[-300, GY - 300], [1400, GY - 200], [700, GY - 420], [-300, GY - 40], [1400, GY - 10]][j % 5];
      let x = k < 0 ? from[0] : lerp(from[0], home[0], eOut(clamp(k / 1.4, 0, 1))), y = k < 0 ? from[1] : lerp(from[1], home[1], eOut(clamp(k / 1.4, 0, 1))), sc = .62 + (y - (GY - 300)) / 1300, walk = k > 0 && k < 1.4, face = from[0] < home[0] ? 1 : -1;
      if (k > 1.4){ x += Math.sin(t * .9 + j * 2) * 40; walk = true; face = Math.cos(t * .9 + j * 2) > 0 ? 1 : -1; }
      if (o.lost && t > tLost && t < tPen){ const q = clamp((t - tLost) / 2.2, 0, 1); x = lerp(home[0], 1250, q); y = lerp(home[1], GY - 360, q); sc = .62 - q * .25; face = 1; walk = true; }
      if (t > tPen){ const order = j, tg = tPen + .8 + order * .45, q = clamp((t - tPen) / .8, 0, 1);
        const qx = Dm.gateX - 250 - order * 200, qy = penY; x = lerp(x, qx, easeIO(q)); y = lerp(y, qy, easeIO(q)); sc = lerp(sc, .62 + 260 / 1300, q); face = 1; walk = q < 1;
        const g = t - tg; if (g > 0){ const slot = [Dm.penX0 + 120 + (order % 3) * 140, penY - 120 + Math.floor(order / 3) * 90]; const r = clamp(g / .7, 0, 1);
          const gx = Math.min(Dm.gateX, qx + (t - tPen - .8) * 330); x = r < .5 ? lerp(gx, Dm.gateX + 40, r * 2) : lerp(Dm.gateX + 40, slot[0], (r - .5) * 2); y = r < .5 ? penY : lerp(penY, slot[1], (r - .5) * 2); walk = r < 1; sc = .7; }
        else { x = Math.min(x + Math.max(0, (t - tPen - .8)) * 330, Dm.gateX - 170 - (order - Math.floor(Math.max(0, t - tPen - .8) / .45)) * 200); } }
      return { x, y, sc, walk, face }; };
    const passed = t > tPen ? Dm.sheep.filter((o, j) => t > tPen + .8 + j * .45 + .35).length : 0;
    const fenceQ = t < tPen ? 0 : eBack(clamp((t - tPen) / .5, 0, 1));
    base(ctx, s, t, { env: "park", envOpt: { bench: false, treeX: 980 },
      spots: { gate: [Dm.gateX + 80, GY - 260, 1.12] },
      back: () => { if (fenceQ <= 0) return; ctx.save(); ctx.translate(0, (1 - fenceQ) * 300); ctx.strokeStyle = "#7A4A2E"; ctx.lineCap = "round";
        const post = (x, y) => { ctx.fillStyle = "#9B6A3C"; rr(ctx, x - 14, y - 170, 28, 180, 6); ctx.fill(); ol(ctx, 4); };
        for (let x = Dm.penX0; x <= Dm.penX1; x += 105) post(x, GY - 280);
        ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(Dm.penX0, GY - 400); ctx.lineTo(Dm.penX1, GY - 400); ctx.moveTo(Dm.penX0, GY - 330); ctx.lineTo(Dm.penX1, GY - 330); ctx.stroke();
        ctx.restore(); },
      front: (ctx2, c, sts) => { // sheep (sorted by depth) + front fence with the single gate
        const order = Dm.sheep.map((o, j) => [j, pos(j)]).sort((a, b) => a[1].y - b[1].y);
        order.forEach(([j, p]) => { if (p.y > penY - 10 || t < tPen) sheep(ctx, p.x, p.y, p.sc * 1.3, t, { walk: p.walk, face: p.face, ph: j, tag: Dm.sheep[j].tag, tagCol: Dm.sheep[j].col }); });
        if (fenceQ > 0){ ctx.save(); ctx.translate(0, (1 - fenceQ) * 300);
          const post = (x) => { ctx.fillStyle = "#9B6A3C"; rr(ctx, x - 16, GY - 210, 32, 220, 6); ctx.fill(); ol(ctx, 4); };
          ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(Dm.gateX + 140, GY - 170); ctx.lineTo(Dm.penX1 + 60, GY - 170); ctx.moveTo(Dm.gateX + 140, GY - 90); ctx.lineTo(Dm.penX1 + 60, GY - 90); ctx.stroke();
          ctx.strokeStyle = "#B5793D"; ctx.lineWidth = 14; ctx.stroke(); [Dm.gateX + 140, Dm.gateX + 300, Dm.gateX + 460, Dm.penX1 + 60].forEach(post);
          // side fence from gate post up to the back row
          ctx.strokeStyle = "#B5793D"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(Dm.penX0, GY - 400); ctx.lineTo(Dm.gateX - 10, GY - 190); ctx.stroke();
          post(Dm.gateX - 20);
          // the gate: arch + sign
          ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(Dm.gateX - 20, GY - 200); ctx.quadraticCurveTo(Dm.gateX + 60, GY - 330, Dm.gateX + 140, GY - 200); ctx.stroke();
          ctx.strokeStyle = GOLD; ctx.lineWidth = 9; ctx.stroke();
          chip(ctx, Dm.gateText || "SATU PINTU", Dm.gateX + 60, GY - 330, ORANGE, "#FFFFFF", 30);
          ctx.restore(); }
        order.forEach(([j, p]) => { if (t >= tPen && p.y <= penY - 10) sheep(ctx, p.x, p.y, p.sc * 1.3, t, { walk: p.walk, face: p.face, ph: j, tag: Dm.sheep[j].tag, tagCol: Dm.sheep[j].col }); }); },
      over: (ctx2, c) => {
        if (t >= tLost && t < tPen){ const lost = Dm.sheep.findIndex(o => o.lost), p = pos(lost), sp = c.toScreen(Math.min(p.x, 1000), p.y - 260); popChip(ctx, "HILANG?", sp[0] - 60, sp[1], t - tLost - .8, RED, "#FFFFFF", 40, .06); }
        if (t >= tPen){ const q = eBack(clamp((t - tPen - .5) / .35, 0, 1)); ctx.save(); ctx.translate(880, 330); ctx.scale(q, q); ctx.rotate(.04);
          rr(ctx, -150, -90, 300, 180, 30); ctx.fillStyle = hexA(NAVY, .92); ctx.fill(); ol(ctx, 6); textC(ctx, "HITUNG", 0, -42, 30, GOLD, 900);
          const pk = Dm.sheep.map((o, j) => t - (tPen + .8 + j * .45 + .35)).filter(v => v > 0).sort((a, b) => a - b)[0] ?? 9, bump = pk < .25 ? 1 + .25 * Math.sin(pk / .25 * Math.PI) : 1;
          ctx.scale(bump, bump); textC(ctx, passed + " / " + n, 0, 48, 84, "#FFFFFF", 900); ctx.restore(); }
        if (t >= tCount) popChip(ctx, Dm.okText || "LENGKAP ✓", 880, 470, t - tCount, GREEN, "#FFFFFF", 40, -.05); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Dm = f.domba || {}; if (Dm.inCue) add(cueT(s, Dm.inCue, .1, i), "whoosh"); if (Dm.lostCue) add(cueT(s, Dm.lostCue, .4, i) + .8, "ping");
    if (Dm.penCue){ const t0 = cueT(s, Dm.penCue, .55, i); add(t0, "pop"); (Dm.sheep || []).forEach((o, j) => add(t0 + .8 + j * .45 + .35, "pop")); } if (Dm.countCue) add(cueT(s, Dm.countCue, .8, i), "chime"); });

  /* ================= _rel: every request prints from ONE form slot and hangs on a numbered ticket rail ================= */
  TT.scene(PX + "rel", "Cerita: satu formulir, tiket permintaan bernomor di rel atas meja", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rl = Object.assign({ tickets: [], railY: 760, x0: 150, x1: 1010, deskX: 640 }, f.rel || {});
    const tForm = T(s, Rl.formCue, .2, idx), tDone = T(s, Rl.doneCue, .6, idx), tMorning = T(s, Rl.morningCue, .5, idx), tZero = T(s, Rl.zeroCue, .8, idx);
    const tk = Rl.tickets.map((o, j) => Object.assign({ T: T(s, o.cue, .3 + j * .1, idx) }, o)), prX = Rl.x0 + 70, prY = Rl.railY + 70;
    const slotX = j => Rl.x1 - 110 - j * 190;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1000 },
      spots: { rail: [560, Rl.railY + 110, 1.1], printer: [prX + 150, prY + 60, 1.3] },
      back: () => { prop(ctx, "desk", Rl.deskX, GY - 40, { s: .95, laptop: true, mug: true, lx: 60 }, t);
        // rail
        ctx.fillStyle = "#9AA6B2"; rr(ctx, Rl.x0, Rl.railY - 14, Rl.x1 - Rl.x0, 28, 14); ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#FFFFFF", .6); ctx.fillRect(Rl.x0 + 20, Rl.railY - 8, Rl.x1 - Rl.x0 - 40, 6);
        [Rl.x0 + 30, Rl.x1 - 30].forEach(x => { ctx.fillStyle = "#4A4A52"; rr(ctx, x - 10, Rl.railY - 60, 20, 60, 5); ctx.fill(); });
        // printer: the single entrance
        rr(ctx, prX - 90, prY - 60, 180, 120, 18); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); rr(ctx, prX - 60, prY + 40, 120, 14, 6); ctx.fillStyle = OUT; ctx.fill();
        textC(ctx, Rl.slot || "FORMULIR", prX, prY - 10, 26, "#FFFFFF", 900, 160); ctx.fillStyle = t % 1 < .5 ? "#7CE38B" : "#3E9B5A"; ctx.beginPath(); ctx.arc(prX + 66, prY - 40, 8, 0, TAU); ctx.fill();
        // tickets
        tk.forEach((o, j) => { const k = t - o.T; if (k < 0) return; const pr = clamp(k / .6, 0, 1), sl = easeIO(clamp((k - .6) / .7, 0, 1)), dk = o.doneCue ? t - T(s, o.doneCue, .5, idx) : -1;
          let x = lerp(prX, slotX(j), sl), y = sl > 0 ? Rl.railY + 24 : prY + 50, sw = Math.sin(t * 3 + j) * .03 + (sl > 0 && sl < 1 ? -.15 : 0);
          const h = sl > 0 ? 210 : 210 * pr; if (dk > .5){ const q = clamp((dk - .5) / .6, 0, 1); y += q * q * 900; sw += q * 2; }
          ctx.save(); ctx.translate(x, y); ctx.rotate(sw); if (sl <= 0){ ctx.beginPath(); ctx.rect(-90, 0, 180, 260); ctx.clip(); }
          ctx.fillStyle = "#4A4A52"; rr(ctx, -24, -14, 48, 26, 6); ctx.fill();
          rr(ctx, -80, 0, 160, h, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = o.col || ORANGE; ctx.fillRect(-80, 0, 160, Math.min(h, 52));
          if (h > 50) textC(ctx, "#" + String(j + 1).padStart(2, "0"), 0, 38, 32, "#FFFFFF", 900);
          if (h > 120){ const { L, size } = lines2(ctx, o.text, 140, 28, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center"; L.forEach((l, i) => { font(ctx, 900, size, FAM); ctx.fillText(l, 0, 92 + i * size * 1.1); }); ctx.textAlign = "left"; }
          if (h > 190 && o.due){ rr(ctx, -64, 160, 128, 36, 18); ctx.fillStyle = hexA(RED, .15); ctx.fill(); textC(ctx, o.due, 0, 188, 24, RED, 900, 120); }
          if (dk > 0){ const q = eBack(clamp(dk / .3, 0, 1)); ctx.save(); ctx.translate(30, 110); ctx.rotate(-.3); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4);
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-4, 15); ctx.lineTo(20, -15); ctx.stroke(); ctx.restore(); }
          ctx.restore(); }); },
      over: (ctx2, c) => {
        if (t >= tForm && t < tForm + 2.2){ const k = t - tForm, q = eBack(clamp(k / .35, 0, 1)), sh = clamp((k - 1.6) / .5, 0, 1), p = c.toScreen(prX, prY);
          ctx.save(); ctx.translate(lerp(540, p[0], eIn2(sh)), lerp(470, p[1], eIn2(sh))); ctx.scale(q * (1 - sh * .9), q * (1 - sh * .9)); ctx.rotate(-.03);
          rr(ctx, -300, -190, 600, 380, 26); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); rr(ctx, -300, -190, 600, 80, 26); ctx.fillStyle = TEAL; ctx.fill(); ctx.fillRect(-300, -140, 600, 30);
          textC(ctx, "FORMULIR PERMINTAAN", 0, -135, 36, "#FFFFFF", 900, 560);
          ["Apa yang diminta?", "Untuk kapan?", "Dari siapa?"].forEach((l, i) => { textL(ctx, l, -260, -40 + i * 82, 30, BROWN, 800); rr(ctx, -260, -26 + i * 82, 520, 30, 8); ctx.fillStyle = "#E3ECEF"; ctx.fill(); });
          ctx.restore(); }
        if (t >= tMorning){ const p = c.toScreen(Rl.deskX + 180, GY - 520); popChip(ctx, Rl.morningText || "CEK TIAP PAGI 08.00", p[0], p[1], t - tMorning, NAVY, "#FFFFFF", 34, .05); }
        if (t >= tZero) popWord(ctx, Rl.zeroText || "0 TERCECER", 540, 250, t - tZero, { size: 88, rot: -4, hold: 2.2, col: "#7CE38B" }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rl = f.rel || {}; if (Rl.formCue){ const t0 = cueT(s, Rl.formCue, .2, i); add(t0, "pop"); add(t0 + 1.6, "whoosh"); }
    (Rl.tickets || []).forEach((o, j) => { const t0 = cueT(s, o.cue, .3 + j * .1, i); add(t0, "ping"); add(t0 + .6, "whoosh"); if (o.doneCue) add(cueT(s, o.doneCue, .5, i), "chime"); });
    if (Rl.morningCue) add(cueT(s, Rl.morningCue, .5, i), "pop"); if (Rl.zeroCue) add(cueT(s, Rl.zeroCue, .8, i), "chime"); });

  /* ================= RN34 shared: exhibition booth ================= */
  function riceBox(ctx, x, y, w){ const h = w * .42; rr(ctx, x - w / 2, y - h, w, h, 6); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.fillStyle = ORANGE; ctx.fillRect(x - w / 2 + 3, y - h * .62, w - 6, h * .22); ctx.fillStyle = hexA(OUT, .5); ctx.fillRect(x - 3, y - h, 6, h); }
  EXTRA.ricestack = (ctx, t, o) => { const n = o.n || 6, w = 120; for (let i = 0; i < n; i++){ const sw = Math.sin(t * 3 + i * .5) * i * 1.6; riceBox(ctx, sw, 20 - i * w * .42, w); } };
  function booth(ctx, x, t, o){ o = o || {}; const W = 820, top = GY - 1020, x0 = x - W / 2;
    // seminar hall: wall, wall lamps, carpet
    ctx.fillStyle = "#6E3B3B"; ctx.fillRect(-1200, -600, 3500, GY + 600); ctx.fillStyle = "#5A2F31"; for (let i = -8; i < 20; i++) ctx.fillRect(i * 140, -600, 60, GY + 600);
    for (let i = -2; i < 6; i++){ const lx = i * 420 + 120; if (Math.abs(lx - x) < W / 2 + 40) continue; glowAt(ctx, lx, top + 260, 160, "#FFD08A", .45 + .05 * Math.sin(t * 3 + i)); ctx.fillStyle = "#FFE3A8"; rr(ctx, lx - 22, top + 230, 44, 60, 12); ctx.fill(); ol(ctx, 3); }
    ctx.fillStyle = "#8E3B3B"; ctx.fillRect(-1200, GY - 20, 3500, 900);
    // backdrop panel + truss with spotlights
    ctx.fillStyle = "#13223D"; rr(ctx, x0 + 10, top + 120, W - 20, GY - top - 220, 12); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA(GOLD, .35); ctx.lineWidth = 3; for (let i = 1; i < 6; i++){ ctx.beginPath(); ctx.moveTo(x0 + 10 + i * (W - 20) / 6, top + 400); ctx.lineTo(x0 + 10 + i * (W - 20) / 6, GY - 110); ctx.stroke(); }
    ctx.fillStyle = "#9AA6B2"; rr(ctx, x0 - 40, top + 40, W + 80, 34, 10); ctx.fill(); ol(ctx, 4);
    for (let i = 0; i < 3; i++){ const sx2 = x0 + 140 + i * (W - 280) / 2, sw = Math.sin(t * 1.3 + i * 2) * .25; ctx.save(); ctx.translate(sx2, top + 74); ctx.rotate(sw);
      ctx.fillStyle = hexA("#FFF4C8", o.lights ? .16 : .07); ctx.beginPath(); ctx.moveTo(-20, 30); ctx.lineTo(-150, 900); ctx.lineTo(150, 900); ctx.lineTo(20, 30); ctx.closePath(); ctx.fill();
      rr(ctx, -26, 0, 52, 46, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    // stage platform
    ctx.fillStyle = "#9B6A3C"; rr(ctx, x0 - 60, GY - 120, W + 120, 120, 8); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 3; for (let i = 1; i < 8; i++){ ctx.beginPath(); ctx.moveTo(x0 - 60 + i * (W + 120) / 8, GY - 118); ctx.lineTo(x0 - 60 + i * (W + 120) / 8, GY - 2); ctx.stroke(); }
    // banner frame (empty or rolled down)
    const bw = 600, bx = x - bw / 2, by = top + 190, bq = clamp(o.banner ?? 0, 0, 1);
    ctx.save(); ctx.setLineDash([18, 12]); ctx.strokeStyle = hexA(OUT, .45); ctx.lineWidth = 5; rr(ctx, bx, by, bw, 190, 10); ctx.stroke(); ctx.restore();
    if (bq > 0){ const h = 190 * bq; ctx.save(); rr(ctx, bx, by, bw, h, 10); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.rect(bx, by, bw, h); ctx.clip();
        textC(ctx, o.bannerText || "SELAMAT DATANG", x, by + 88, 56, "#FFFFFF", 900, bw - 40); textC(ctx, o.bannerSub || "Seminar Pelanggan", x, by + 150, 34, CREAM, 800, bw - 40); ctx.restore();
      ctx.fillStyle = "#7A4A2E"; rr(ctx, bx - 14, by + h - 12, bw + 28, 24, 12); ctx.fill(); ol(ctx, 4); }
    else if (o.empty){ const b = 1 + .08 * Math.sin(t * 5); ctx.save(); ctx.translate(x, by + 95); ctx.scale(b, b); textC(ctx, "?", 0, 40, 130, hexA(RED, .8), 900); ctx.restore(); }
    // sound system: speaker + mic stand (on the stage)
    const sx = x0 + 120, sq = clamp(o.sound ?? 0, 0, 1); ctx.save(); ctx.translate(0, -120);
    ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0 + W - 130, GY - 10); ctx.lineTo(x0 + W - 130, GY - 520); ctx.lineTo(x0 + W - 180, GY - 600); ctx.stroke();
    if (sq > 0){ ctx.save(); ctx.translate(x0 + W - 180, GY - 610); ctx.rotate(-.5); rr(ctx, -20, -40, 40, 70, 18); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    else if (o.empty){ textC(ctx, "?", x0 + W - 180, GY - 640, 90, hexA(RED, .8), 900); }
    if (sq > 0){ ctx.save(); ctx.translate(sx, GY); ctx.scale(sq, sq); rr(ctx, -80, -330, 160, 330, 16); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
      const pump = o.playing ? 1 + .06 * Math.sin(t * 18) : 1; [[-240, 52], [-90, 36]].forEach(([y, r]) => { ctx.beginPath(); ctx.arc(0, y, r * pump, 0, TAU); ctx.fillStyle = "#4A4A52"; ctx.fill(); ctx.beginPath(); ctx.arc(0, y, r * .4, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); });
      if (o.playing){ ctx.strokeStyle = GOLD; ctx.lineWidth = 7; for (let r = 0; r < 3; r++){ const w = (t * 1.5 + r / 3) % 1; ctx.globalAlpha = 1 - w; ctx.beginPath(); ctx.arc(60, -240, 60 + w * 140, -.8, .8); ctx.stroke(); } ctx.globalAlpha = 1;
        for (let i = 0; i < 3; i++){ const q = ((t * .7 + i / 3) % 1); ctx.globalAlpha = 1 - q; textC(ctx, "♪", 120 + q * 120 + i * 20, -300 - q * 200, 60, ORANGE, 900); } ctx.globalAlpha = 1; }
      ctx.restore(); }
    ctx.restore(); return { banner: [x, by + 95], mic: [x0 + W - 180, GY - 720] }; }
  function boothTable(ctx, x, t, o){ o = o || {}; const w = 560, top = GY - 230;
    ctx.fillStyle = "#FFFDF6"; rr(ctx, x - w / 2, top, w, 230, 10); ctx.fill(); ol(ctx, 5); ctx.fillStyle = o.cloth || ORANGE; rr(ctx, x - w / 2, top, w, 60, 10); ctx.fill(); ol(ctx, 4);
    for (let i = 0; i < 7; i++){ ctx.beginPath(); ctx.arc(x - w / 2 + 40 + i * 80, top + 60, 20, 0, Math.PI); ctx.fillStyle = o.cloth || ORANGE; ctx.fill(); }
    return top; }

  /* ================= _nasi: everyone brought the lunch boxes, nobody brought the speaker or banner ================= */
  TT.scene(PX + "nasi", "Cerita: panggung seminar, semua bawa nasi kotak, pengeras suara & spanduk kosong", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, N = Object.assign({ x: 540, carriers: [] }, f.nasi || {});
    const tPile = T(s, N.pileCue, .5, idx), tMic = T(s, N.micCue, .7, idx), tBan = T(s, N.banCue, .8, idx);
    const pile = Math.round(clamp((t - tPile) / .8, 0, 1) * 18);
    let spots = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { mic: [N.x + 230, GY - 560, 1.35], banner: [N.x, GY - 700, 1.25] },
      back: () => { spots = booth(ctx, N.x, t, { empty: true }); },
      front: (ctx2, c, sts) => { const top = boothTable(ctx, N.x, t, {});
        // stacked tower on the table
        for (let i = 0; i < pile; i++){ const col = i % 3, row = Math.floor(i / 3), wob = Math.sin(t * 2.4 + row) * row * 1.5; riceBox(ctx, N.x - 130 + col * 130 + wob, top - row * 50, 124); }
        if (pile >= 18 && t - tPile < 2.4){ ctx.save(); ctx.globalAlpha = .9; ctx.fillStyle = hexA("#FFFFFF", .8); for (let i = 0; i < 3; i++){ const q = ((t * .8 + i / 3) % 1); ctx.beginPath(); ctx.arc(N.x - 80 + i * 80, top - 320 - q * 120, 14 + q * 20, 0, TAU); ctx.fill(); } ctx.restore(); } },
      over: (ctx2, c) => {
        if (t >= tPile){ popChip(ctx, N.pileText || "300 KOTAK!", 540, 470, t - tPile - .3, RED, "#FFFFFF", 54, -.05); }
        if (t >= tMic && spots){ const p = c.toScreen(spots.mic[0], spots.mic[1] - 140); popChip(ctx, "PENGERAS SUARA?", Math.min(820, p[0]), p[1], t - tMic, NAVY, "#FFFFFF", 32, .06); }
        if (t >= tBan && spots){ const p = c.toScreen(spots.banner[0], spots.banner[1] - 170); popChip(ctx, "SPANDUK?", p[0], p[1], t - tBan, NAVY, "#FFFFFF", 36, -.05);
          popWord(ctx, "KRIK... KRIK...", 540, 620, t - tBan - .7, { size: 64, rot: 4, hold: 1.8, col: "#9FB2C8" }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const N = f.nasi || {}; if (N.pileCue){ const t0 = cueT(s, N.pileCue, .5, i); add(t0, "whoosh"); add(t0 + .3, "pop"); add(t0 + .8, "pop"); }
    if (N.micCue) add(cueT(s, N.micCue, .7, i), "ping"); if (N.banCue) add(cueT(s, N.banCue, .8, i), "ping"); });

  /* ================= _perahu: top-down rowing boat — all paddles on one side = spinning; one side each = straight ================= */
  function rowerTop(ctx, x, y, a, o, side, stroke){ ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    const ex = side * 230 * Math.cos(Math.sin(stroke) * .45), ey = -230 * Math.sin(Math.sin(stroke) * .45);
    ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke(); ctx.strokeStyle = "#B5793D"; ctx.lineWidth = 9; ctx.stroke();
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(Math.atan2(ey, ex)); ctx.beginPath(); ctx.ellipse(0, 0, 46, 22, 0, 0, TAU); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 4); ctx.restore();
    // splash at the blade
    if (Math.cos(stroke) > .7){ ctx.fillStyle = hexA("#FFFFFF", .8); for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(ex + (rnd(i) - .5) * 60, ey + (rnd(i + 2) - .5) * 60, 8, 0, TAU); ctx.fill(); } }
    // shoulders + arms + head
    ctx.beginPath(); ctx.ellipse(0, 6, 52, 30, 0, 0, TAU); ctx.fillStyle = o.shirt || ORANGE; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = o.skinCol || "#C98B62"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(side * 30, 4); ctx.lineTo(ex * .32, ey * .32); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = o.hijab || o.hairColor || "#2B1A12"; ctx.fill(); ol(ctx, 4);
    if (o.hat){ ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = o.hatColor || "#2C2433"; ctx.fill(); }
    ctx.restore(); }
  TT.scene(PX + "perahu", "Cerita: perahu dayung dari atas, semua di satu sisi berputar, lalu tiap sisi melaju", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ rowers: [] }, f.perahu || {});
    const tSpin = T(s, B.spinCue, .3, idx), tFix = T(s, B.fixCue, .7, idx), tGo = T(s, B.goCue, .9, idx);
    const spin = t >= tSpin && t < tFix, fixQ = easeIO(clamp((t - tFix) / 1.2, 0, 1));
    let ang = 0; { const a1 = Math.max(0, Math.min(t, tFix) - tSpin); ang = a1 * a1 * .35 + (a1 > 2 ? 0 : 0); if (t > tFix){ const tgt = Math.ceil(ang / TAU) * TAU; ang = lerp(ang, tgt, fixQ); } }
    const flow = t > tFix ? (t - tFix) * 420 * Math.min(1, (t - tFix)) : 0;
    const bx = 540 + (spin ? Math.sin(ang) * 40 : 0), by = 1020;
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], { resolve: () => [bx, by, null] });
    // water (screen space with camera scale)
    ctx.save(); ctx.fillStyle = "#3F8FB0"; ctx.fillRect(0, 0, 1080, 1920);
    c.apply(ctx, 1);
    ctx.strokeStyle = hexA("#FFFFFF", .25); ctx.lineWidth = 6; ctx.lineCap = "round";
    for (let i = 0; i < 46; i++){ const x = rnd(i) * 1500 - 200, y = ((rnd(i + 5) * 2400 + flow + t * 30) % 2400) - 240; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 30, y - 14 + Math.sin(t * 2 + i) * 6, x + 60, y); ctx.quadraticCurveTo(x + 90, y + 14, x + 120, y); ctx.stroke(); }
    // lily pads / reeds as landmarks
    for (let i = 0; i < 6; i++){ const x = [90, 980, 140, 1010, 60, 940][i], y = ((i * 420 + flow) % 2400) - 240; ctx.beginPath(); ctx.arc(x, y, 50, .3, TAU - .3); ctx.lineTo(x, y); ctx.fillStyle = "#6FAE5B"; ctx.fill(); ol(ctx, 3); }
    // swirl rings while spinning
    if (spin){ for (let r = 0; r < 3; r++){ const w = (t * .8 + r / 3) % 1; ctx.strokeStyle = hexA("#FFFFFF", .5 * (1 - w)); ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(bx, by, 330 + w * 260, ang + r, ang + r + 2.4); ctx.stroke(); } }
    // wake while going straight
    if (t > tFix){ ctx.fillStyle = hexA("#FFFFFF", .35); for (let i = 0; i < 14; i++){ const q = ((t * 1.2 + i / 14) % 1); ctx.beginPath(); ctx.ellipse(bx + (i % 2 ? 1 : -1) * (40 + q * 160), by + 330 + q * 600, 30 + q * 30, 14, 0, 0, TAU); ctx.fill(); } }
    // the boat
    ctx.save(); ctx.translate(bx, by); ctx.rotate(ang);
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(14, 20, 150, 400, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -420); ctx.bezierCurveTo(170, -300, 170, 300, 90, 380); ctx.lineTo(-90, 380); ctx.bezierCurveTo(-170, 300, -170, -300, 0, -420); ctx.closePath(); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 7);
    ctx.beginPath(); ctx.moveTo(0, -380); ctx.bezierCurveTo(135, -280, 135, 280, 70, 350); ctx.lineTo(-70, 350); ctx.bezierCurveTo(-135, 280, -135, -280, 0, -380); ctx.closePath(); ctx.fillStyle = "#E3B680"; ctx.fill();
    for (let i = 0; i < 4; i++){ ctx.fillStyle = "#9B6A3C"; ctx.fillRect(-120, -250 + i * 165, 240, 22); }
    const n = B.rowers.length;
    B.rowers.forEach((o, j) => { const sideA = -1, sideB = j % 2 ? 1 : -1, side = fixQ > .5 ? sideB : sideA, st = t * (t > tFix ? 5.2 : 4.2) + (t > tFix ? 0 : j * .7);
      rowerTop(ctx, 0, -280 + j * 165, 0, o, side, st); });
    ctx.restore();
    ctx.restore();
    // dizzy stars
    const ov = [];
    if (spin && t - tSpin > 1) ov.push(() => { for (let i = 0; i < 5; i++){ const a = t * 3 + i / 5 * TAU; sparkle(ctx, 540 + Math.cos(a) * 200, 520 + Math.sin(a) * 50, 22, GOLD); } });
    const tSpinW = T(s, B.spinWordCue, .5, idx);
    if (t >= tSpinW && t < tFix) ov.push(() => popChip(ctx, B.spinText || "BERPUTAR!", 540, 420, t - tSpinW, RED, "#FFFFFF", 52, -.05));
    if (t >= tGo) ov.push(() => popChip(ctx, B.goText || "LURUS!", 540, 420, t - tGo, GREEN, "#FFFFFF", 56, -.04));
    if (ov.length) TT.CS.ov.push(() => ov.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
  }, (s, f, i, add) => { const B = f.perahu || {}; if (B.spinCue) add(cueT(s, B.spinCue, .3, i), "whoosh"); if (B.spinWordCue) add(cueT(s, B.spinWordCue, .5, i), "ping");
    if (B.fixCue) add(cueT(s, B.fixCue, .7, i), "whoosh"); if (B.goCue) add(cueT(s, B.goCue, .9, i), "chime"); (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop")); });

  /* ================= _topi: the leader hands out role hats that fly onto each head ================= */
  function roleHat(ctx, kind, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (kind === "chef"){ rr(ctx, -60, -40, 120, 50, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(-40, -60, 38, 0, TAU); ctx.arc(0, -80, 44, 0, TAU); ctx.arc(40, -60, 38, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); rr(ctx, -60, -40, 120, 50, 8); ctx.fill(); }
    else if (kind === "phones"){ ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(0, 40, 110, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.strokeStyle = TEAL; ctx.lineWidth = 14; ctx.stroke();
      [-1, 1].forEach(d => { rr(ctx, d * 108 - 26, 10, 52, 80, 20); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); }); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-110, 80); ctx.quadraticCurveTo(-120, 150, -60, 170); ctx.stroke(); ctx.beginPath(); ctx.arc(-54, 172, 10, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }
    else if (kind === "beret"){ ctx.beginPath(); ctx.ellipse(0, -10, 95, 36, -.12, 0, TAU); ctx.fillStyle = "#7A4A8E"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -46, 9, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
      ctx.save(); ctx.translate(80, -40); ctx.rotate(.7 + Math.sin(t * 3) * .1); ctx.fillStyle = "#B5793D"; rr(ctx, -6, -70, 12, 80, 5); ctx.fill(); ol(ctx, 3); ctx.fillStyle = RED; rr(ctx, -9, -96, 18, 30, 8); ctx.fill(); ol(ctx, 3); ctx.restore(); }
    else if (kind === "pin"){ ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); icon(ctx, "star", -26, -26, 52, BROWN, 3); }
    ctx.restore(); }
  TT.scene(PX + "topi", "Cerita: pemimpin membagi topi peran yang terbang ke kepala tiap anggota", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Tp = Object.assign({ roles: [] }, f.topi || {});
    const roles = Tp.roles.map((o, j) => Object.assign({ T: T(s, o.cue, .3 + j * .1, idx) }, o));
    let heads = [];
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1010, rugX: 600 },
      spots: { team: [640, GY - 600, 1.0] },
      back: () => { // whiteboard with role table filling in
        const x0 = 150, y0 = 520, w = 780, h = 330; ctx.fillStyle = "#9AA6B2"; rr(ctx, x0 - 14, y0 - 14, w + 28, h + 28, 14); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; rr(ctx, x0, y0, w, h, 8); ctx.fill();
        textL(ctx, Tp.boardTitle || "PEMBAGIAN PERAN", x0 + 30, y0 + 52, 36, TEAL, 900);
        roles.forEach((o, j) => { const y = y0 + 110 + j * 56; if (t < o.T + 1){ ctx.save(); ctx.globalAlpha = .35 + .15 * Math.sin(t * 4 + j); textL(ctx, "? → ?", x0 + 40, y, 36, "#9AA6B2", 900); ctx.restore(); } });
        roles.forEach((o, j) => { const k = t - o.T - .5; if (k < 0) return; const n = clamp(k / .5, 0, 1), y = y0 + 110 + j * 56; const txt = o.name + " → " + o.label; ctx.save(); ctx.beginPath(); ctx.rect(x0 + 30, y - 40, (w - 60) * n, 56); ctx.clip();
          textL(ctx, txt, x0 + 40, y, 38, BROWN, 900, w - 80); ctx.restore(); }); },
      over1: (ctx2, c, sts, j) => { const st = sts[j]; const h = toonHead(st); heads[j] = [h[0], h[1] - st.size * .19 + (st.pose === "sit" ? 13 * st.size / 92 : 0), st.size]; },
      front: (ctx2, c, sts) => {
        roles.forEach((o, j) => { const k = t - o.T; if (k < 0 || !heads[o.who]) return; const giver = sts[Tp.giver ?? 0], from = giver ? handOf(giver) : [100, 900], to = heads[o.who], q = clamp(k / .6, 0, 1);
          const x = lerp(from[0], to[0], eOut(q)), y = lerp(from[1], to[1], q) - Math.sin(q * Math.PI) * 260 + (o.dy || 0) * q, sq = q >= 1 ? 1 + .3 * Math.exp(-(k - .6) * 8) * Math.sin((k - .6) * 26) : 1;
          ctx.save(); ctx.translate(x, y); ctx.rotate((1 - q) * 5); ctx.scale(sq, 2 - sq); roleHat(ctx, o.kind, 0, 0, to[2] / 720 * (o.s || 1), t); ctx.restore(); }); },
      over: (ctx2, c) => { roles.forEach((o, j) => { if (t < o.T + .6 || !heads[o.who]) return; const p = c.toScreen(heads[o.who][0], heads[o.who][1] - heads[o.who][2] * .2);
          popChip(ctx, o.label, p[0], p[1] - (o.chipDy || 0), t - o.T - .6, o.col || ORANGE, "#FFFFFF", 32, (j % 2 ? .06 : -.06)); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); ((f.topi || {}).roles || []).forEach((o, j) => { const t0 = cueT(s, o.cue, .3 + j * .1, i); add(t0, "whoosh"); add(t0 + .6, "pop"); }); });

  /* ================= _booth: D-day — everybody arrives with their own part, the booth builds itself ================= */
  TT.scene(PX + "seminar", "Cerita: hari H seminar, tiap orang membawa bagiannya, panggung siap cepat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bt = Object.assign({ x: 540 }, f.booth || {});
    const tBan = T(s, Bt.banCue, .4, idx), tSnd = T(s, Bt.soundCue, .55, idx), tFood = T(s, Bt.foodCue, .7, idx), tDone = T(s, Bt.doneCue, .85, idx);
    const banner = eOut(clamp((t - tBan) / .9, 0, 1)), sound = t < tSnd ? 0 : eBack(clamp((t - tSnd) / .4, 0, 1)), food = t >= tFood;
    let sp = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { banner: [Bt.x, GY - 700, 1.2], sound: [Bt.x - 220, GY - 540, 1.25] },
      over1: (ctx2, c, sts, j) => { const a = (f.toons || [])[j], st = sts[j]; if (!a || !a.role || !st) return; const h = toonHead(st); roleHat(ctx, a.role, h[0], h[1] - st.size * .19 + (a.roleDy || 0), st.size / 720 * (a.roleS || 1), t); },
      back: () => { sp = booth(ctx, Bt.x, t, { banner, sound, playing: t > tSnd + .4, lights: t > tDone, bannerText: Bt.bannerText, bannerSub: Bt.bannerSub });
        if (t > tDone){ for (let i = 0; i < 10; i++){ const x = Bt.x - 400 + i * 89, y = GY - 1030 + Math.sin(i * 1.3) * 10; ctx.fillStyle = [GOLD, TEAL, RED, CREAM][i % 4]; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 44, y); ctx.lineTo(x + 22, y + 60 + Math.sin(t * 4 + i) * 6); ctx.closePath(); ctx.fill(); ol(ctx, 3); } } },
      front: () => { const top = boothTable(ctx, Bt.x, t, { cloth: TEAL });
        if (food){ const k = t - tFood; for (let i = 0; i < 6; i++){ const kk = k - i * .08; if (kk < 0) continue; const q = eBack(clamp(kk / .3, 0, 1)); ctx.save(); ctx.translate(Bt.x - 130 + (i % 3) * 130, top - Math.floor(i / 3) * 50); ctx.scale(q, q); riceBox(ctx, 0, 0, 124); ctx.restore(); } } },
      over: (ctx2, c) => {
        if (t >= tBan && sp) { const p = c.toScreen(sp.banner[0] + 260, sp.banner[1] - 150); popChip(ctx, "SPANDUK ✓", Math.min(860, p[0]), p[1], t - tBan - .8, GREEN, "#FFFFFF", 34, .06); }
        if (t >= tSnd){ popWord(ctx, "TES, SATU, DUA!", 360, 700, t - tSnd - .3, { size: 62, rot: -4, hold: 1.4 }); }
        if (t >= tFood){ const p = c.toScreen(Bt.x, GY - 480); popChip(ctx, "KONSUMSI PAS ✓", p[0], p[1], t - tFood - .4, GREEN, "#FFFFFF", 34, -.05); }
        if (t >= tDone){ const k = t - tDone, q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(540, 360); ctx.scale(q, q); ctx.rotate(-.04); rr(ctx, -330, -95, 660, 190, 30); ctx.fillStyle = hexA(NAVY, .94); ctx.fill(); ol(ctx, 6);
          ctx.save(); ctx.translate(-230, 0); ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.lineCap = "round"; const a = -Math.PI / 2 - k * 9;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 44, Math.sin(a) * 44); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a / 12) * 28, Math.sin(a / 12) * 28); ctx.stroke(); ctx.restore();
          textC(ctx, Bt.doneBig || "-1 JAM", 70, 18, 80, GOLD, 900, 380); textC(ctx, Bt.doneSub || "lebih cepat berdiri", 70, 70, 30, CREAM, 800, 380); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bt = f.booth || {}; if (Bt.banCue){ const t0 = cueT(s, Bt.banCue, .4, i); add(t0, "whoosh"); add(t0 + .8, "pop"); }
    if (Bt.soundCue){ const t0 = cueT(s, Bt.soundCue, .55, i); add(t0, "pop"); add(t0 + .4, "ping"); } if (Bt.foodCue) add(cueT(s, Bt.foodCue, .7, i), "pop"); if (Bt.doneCue) add(cueT(s, Bt.doneCue, .85, i), "chime"); });

  /* ================= KD34 shared ================= */
  function cursorArrow(ctx, x, y, s, click){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 64); ctx.lineTo(16, 50); ctx.lineTo(28, 76); ctx.lineTo(40, 70); ctx.lineTo(28, 45); ctx.lineTo(48, 45); ctx.closePath();
    ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.stroke();
    if (click > 0 && click < 1){ ctx.strokeStyle = hexA(ORANGE, 1 - click); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 20 + click * 50, 0, TAU); ctx.stroke(); }
    ctx.restore(); }
  function ctxMenu(ctx, x, y, items, hi, q){ if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); const w = 210, h = 54;
    rr(ctx, 6, 8, w, h * items.length + 12, 10); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fill();
    rr(ctx, 0, 0, w, h * items.length + 12, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    items.forEach((it, i) => { if (i === hi){ ctx.fillStyle = hexA(ORANGE, .9); rr(ctx, 6, 6 + i * h, w - 12, h, 8); ctx.fill(); } textL(ctx, it, 22, 6 + i * h + 37, 28, i === hi ? "#FFFFFF" : BROWN, 800); });
    ctx.restore(); }
  function deskSet(ctx, x, t, o){ o = o || {}; const top = GY - 250;
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, 400, 20, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8E4E2E"; rr(ctx, x - 340, top + 20, 26, 230, 6); ctx.fill(); ol(ctx, 4); rr(ctx, x + 320, top + 20, 26, 230, 6); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#C47A48"; rr(ctx, x - 380, top, 760, 32, 10); ctx.fill(); ol(ctx, 5);
    // keyboard + mouse
    rr(ctx, x - 260, top - 22, 330, 26, 8); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#D9D9DE"; for (let i = 0; i < 13; i++){ const lift = o.typing && Math.sin(t * 29 + i * 2.1) > .7 ? 4 : 0; ctx.fillRect(x - 250 + i * 24, top - 18 - lift, 18, 9); }
    const mc = o.mouseClick > 0 && o.mouseClick < .2 ? 3 : 0; rr(ctx, x + 120, top - 30 + mc, 54, 34, 16); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 4);
    return top; }
  function screenBox(ctx, x, top, t, draw){ const W = 620, H = 430, x0 = x - W / 2, y1 = top - 46, y0 = y1 - H;
    ctx.fillStyle = "#3B3A3F"; rr(ctx, x - 22, y1, 44, 46, 6); ctx.fill(); rr(ctx, x - 100, top - 12, 200, 14, 6); ctx.fill();
    glowAt(ctx, x, y0 + H / 2, 520, "#CFE7EE", .25);
    rr(ctx, x0 - 18, y0 - 18, W + 36, H + 36, 22); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6);
    ctx.save(); rr(ctx, x0, y0, W, H, 8); ctx.clip(); ctx.fillStyle = "#F7FBFC"; ctx.fillRect(x0, y0, W, H); draw(x0, y0, W, H); ctx.restore();
    return { x0, y0, W, H }; }
  function wallClock(ctx, x, y, t, speed){ ctx.beginPath(); ctx.arc(x, y, 70, 0, TAU); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 6);
    for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.fillStyle = OUT; ctx.fillRect(x + Math.cos(a) * 56 - 3, y + Math.sin(a) * 56 - 3, 6, 6); }
    const m = -Math.PI / 2 + t * (speed || .1), h = -Math.PI / 2 + t * (speed || .1) / 12; ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(m) * 50, y + Math.sin(m) * 50); ctx.stroke(); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(h) * 32, y + Math.sin(h) * 32); ctx.stroke(); }

  /* ================= _layar: copy-paste with right clicks (mode "klik") or delete + undo (mode "urung") ================= */
  TT.scene(PX + "layar", "Cerita: monitor besar, salin-tempel klik kanan satu per satu / paragraf terhapus lalu Ctrl+Z", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, L = Object.assign({ mode: "klik", x: 700, rows: 30 }, f.layar || {}), klik = L.mode === "klik";
    const tStart = T(s, L.startCue, .1, idx), tFast = T(s, L.fastCue, .55, idx), tHour = T(s, L.hourCue, .85, idx), tDel = T(s, L.delCue, .3, idx), tUndo = T(s, L.undoCue, .75, idx);
    // klik cycle
    const cyc = (tt) => { if (tt < tStart) return { n: 0, ph: -1 }; const P1 = 2.1, P2 = .55; let n, ph;
      if (tt < tFast){ const u = (tt - tStart) / P1; n = Math.floor(u); ph = u - n; } else { const n0 = (tFast - tStart) / P1, u = (tt - tFast) / P2; n = Math.floor(n0 + u); ph = (n0 + u) % 1; }
      return { n, ph }; };
    const C = klik ? cyc(t) : { n: 0, ph: -1 }, rowsDone = Math.min(L.rows, C.n), clicks = Math.min(L.rows * 4, C.n * 4 + (C.ph > .15 ? 1 : 0) + (C.ph > .3 ? 1 : 0) + (C.ph > .55 ? 1 : 0) + (C.ph > .7 ? 1 : 0));
    let scr = null, deskTop = GY - 250;
    const delK = t - tDel, undoK = t - tUndo;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, time: L.night ? "night" : "day", plantX: 1010 },
      spots: { screen: [L.x, GY - 520, 1.35] },
      back: () => { wallClock(ctx, 190, 640, t, t > tHour ? 14 : .15);
        deskTop = deskSet(ctx, L.x, t, { typing: !klik && t < tDel, mouseClick: klik && C.ph >= 0 ? Math.min(Math.abs(C.ph - .15), Math.abs(C.ph - .55)) : -1 });
        scr = screenBox(ctx, L.x, deskTop, t, (x0, y0, W, H) => {
          if (klik){ const pw = W / 2 - 12;
            [[x0 + 8, "EMAIL", TEAL], [x0 + W / 2 + 4, "LAPORAN", ORANGE]].forEach(([px, ttl, col]) => { ctx.fillStyle = col; ctx.fillRect(px, y0 + 8, pw, 46); textL(ctx, ttl, px + 14, y0 + 42, 26, "#FFFFFF", 900); });
            for (let i = 0; i < 7; i++){ const y = y0 + 70 + i * 50, act = C.ph >= 0 && i === rowsDone % 7;
              ctx.fillStyle = act && C.ph > .1 && C.ph < .7 ? hexA(GOLD, .5) : "#E3ECEF"; rr(ctx, x0 + 18, y, pw - 20, 36, 6); ctx.fill();
              textL(ctx, "Rp " + (120 + i * 35) + ".000", x0 + 30, y + 27, 22, BROWN, 800);
              ctx.fillStyle = "#E3ECEF"; rr(ctx, x0 + W / 2 + 14, y, pw - 20, 36, 6); ctx.fill();
              if (i < Math.min(7, rowsDone)) textL(ctx, "Rp " + (120 + i * 35) + ".000", x0 + W / 2 + 26, y + 27, 22, GREEN, 800); }
          } else {
            ctx.fillStyle = TEAL; ctx.fillRect(x0, y0, W, 50); textL(ctx, L.docTitle || "LAPORAN BULANAN.docx", x0 + 18, y0 + 35, 26, "#FFFFFF", 900, W - 40);
            for (let i = 0; i < 3; i++){ ctx.fillStyle = "#C9CED6"; rr(ctx, x0 + 30, y0 + 74 + i * 30, W - 60 - (i === 2 ? 200 : 0), 14, 6); ctx.fill(); }
            // the important paragraph
            const gone = delK > .25 && (undoK < .8), back = undoK > .8;
            if (delK > 0 && delK < .4 && !(undoK > 0)){ ctx.fillStyle = hexA("#7FB6E8", .55); ctx.fillRect(x0 + 20, y0 + 176, W - 40, 150); }
            if (!gone){ for (let i = 0; i < 5; i++){ ctx.fillStyle = back ? hexA(GREEN, .55) : BROWN; rr(ctx, x0 + 30, y0 + 186 + i * 28, W - 60 - (i === 4 ? 240 : 0), 14, 6); ctx.fill(); }
              if (back) glowAt(ctx, L.x, y0 + 250, 300, "#7CE38B", .35 * Math.max(0, 1 - (undoK - .8) / 1.5)); }
            else { ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = hexA(RED, .6); ctx.lineWidth = 4; rr(ctx, x0 + 24, y0 + 176, W - 48, 150, 8); ctx.stroke(); ctx.restore(); }
            for (let i = 0; i < 2; i++){ ctx.fillStyle = "#C9CED6"; rr(ctx, x0 + 30, y0 + 350 + i * 30, W - 60 - i * 160, 14, 6); ctx.fill(); }
          } });
        // flying letters (urung)
        if (!klik && scr && delK > .25){ const outQ = clamp((delK - .25) / .7, 0, 1), inQ = undoK > 0 ? clamp(undoK / .8, 0, 1) : 0, q = eOut(outQ) * (1 - easeIO(inQ));
          if (q > 0.01){ for (let i = 0; i < 40; i++){ const sx = scr.x0 + 40 + (i % 10) * 54, sy = scr.y0 + 192 + Math.floor(i / 10) * 28, a = rnd(i) * TAU, d = 300 + rnd(i + 3) * 500;
            const x = sx + Math.cos(a) * d * q, y = sy + Math.sin(a) * d * q * .8 - Math.sin(q * Math.PI) * 120, ch = "ABCDEFGHIJKLMNOPRSTUW"[i % 21];
            ctx.save(); ctx.translate(x, y); ctx.rotate(q * (rnd(i + 7) - .5) * 8); rr(ctx, -22, -26, 44, 52, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); textC(ctx, ch, 0, 14, 34, BROWN, 900); ctx.restore(); } } }
        // giant cursor + context menu (klik)
        if (klik && scr && C.ph >= 0 && rowsDone < L.rows){ const i = rowsDone % 7, ly = scr.y0 + 88 + i * 50, lx = scr.x0 + 150, rx = scr.x0 + scr.W / 2 + 150, ph = C.ph;
          let cx, cy; if (ph < .15){ cx = lerp(rx, lx, easeIO(ph / .15)); cy = lerp(ly - 50, ly, easeIO(ph / .15)); } else if (ph < .3){ cx = lx; cy = ly; } else if (ph < .55){ const q = easeIO((ph - .3) / .25); cx = lerp(lx, rx, q); cy = ly; } else { cx = rx; cy = ly; }
          if (ph > .15 && ph < .32) ctxMenu(ctx, lx + 10, ly + 10, ["Salin", "Tempel", "Hapus"], ph > .22 ? 0 : -1, eBack(clamp((ph - .15) / .05, 0, 1)));
          if (ph > .55 && ph < .72) ctxMenu(ctx, rx + 10, ly + 10, ["Salin", "Tempel", "Hapus"], ph > .62 ? 1 : -1, eBack(clamp((ph - .55) / .05, 0, 1)));
          const ck = Math.min(...[.15, .22, .55, .62].map(v => ph >= v ? (ph - v) * 6 : 9)); cursorArrow(ctx, cx, cy, 1.2, ck); } },
      over: (ctx2, c) => {
        if (klik && t >= tStart){ const p = c.toScreen(L.x, GY - 860); popChip(ctx, "BARIS " + Math.min(L.rows, rowsDone + 1) + " / " + L.rows, 330, 360, t - tStart, NAVY, "#FFFFFF", 36, -.03);
          popChip(ctx, "KLIK: " + clicks, 770, 360, t - tStart, ORANGE, "#FFFFFF", 36, .04); }
        if (klik && t >= tHour){ const p = c.toScreen(190, 640); popChip(ctx, L.hourText || "1 JAM HABIS!", 540, 470, t - tHour, RED, "#FFFFFF", 40, -.06); }
        if (!klik && delK > .25 && !(undoK > 0)) popWord(ctx, L.delText || "HILANG!", 540, 450, delK - .25, { size: 110, rot: -8, hold: 1.6, col: RED });
        if (!klik && undoK > 0){ const q = clamp(undoK / .8, 0, 1); if (q < 1){ ctx.save(); ctx.translate(540, 560); ctx.rotate(-q * TAU); ctx.strokeStyle = GREEN; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 0, 130, .4, TAU - .6); ctx.stroke();
            ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(130 * Math.cos(.4) + 30, 130 * Math.sin(.4) - 10); ctx.lineTo(130 * Math.cos(.4) - 40, 130 * Math.sin(.4) - 30); ctx.lineTo(130 * Math.cos(.4) - 10, 130 * Math.sin(.4) + 45); ctx.closePath(); ctx.fill(); ctx.restore(); }
          if (undoK > .8) popChip(ctx, L.backText || "KEMBALI ✓", 540, 640, undoK - .8, GREEN, "#FFFFFF", 50, -.05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const L = f.layar || {};
    if (L.mode === "klik"){ const t0 = cueT(s, L.startCue, .1, i), tf = cueT(s, L.fastCue, .55, i), end = (TL.scenes[i] ? TL.scenes[i].end - TL.scenes[i].start : 10); let tt = t0, n = 0;
      while (tt < end && n < 40){ add(tt + (tt < tf ? 2.1 * .15 : .55 * .15), "pop"); tt += tt < tf ? 2.1 : .55 * 2; n++; } if (L.hourCue) add(cueT(s, L.hourCue, .85, i), "ping"); }
    else { if (L.delCue){ const t0 = cueT(s, L.delCue, .3, i); add(t0, "pop"); add(t0 + .25, "whoosh"); } if (L.undoCue){ const t0 = cueT(s, L.undoCue, .75, i); add(t0, "whoosh"); add(t0 + .8, "chime"); } } });

  /* ================= _tombol: giant keycaps on the floor — stomp Ctrl + C to copy, Ctrl + V to paste ================= */
  TT.scene(PX + "tombol", "Cerita: tombol keyboard raksasa di lantai diinjak: Ctrl+C menyalin, Ctrl+V menempel, Cmd di Mac", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Kb = Object.assign({ keys: [{ k: "Ctrl", x: 250, w: 330 }, { k: "C", x: 560, w: 190 }, { k: "V", x: 770, w: 190 }, { k: "Z", x: 960, w: 160 }] }, f.tombol || {});
    const tC = T(s, Kb.copyCue, .3, idx), tV = T(s, Kb.pasteCue, .6, idx), tMac = T(s, Kb.macCue, .85, idx), tIn = T(s, Kb.inCue, .1, idx);
    const docA = Kb.docA || [220, 560], docB = Kb.docB || [860, 560], DS = Kb.docS || .62;
    let sts0 = null;
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540, horizon: 1240 },
      spots: { keys: [600, GY - 300, 1.0], docs: [560, 760, 1.05] },
      back: (ctx2, c, sts) => { sts0 = sts;
        // floating documents
        [[docA, "EMAIL", TEAL], [docB, "LAPORAN", ORANGE]].forEach(([p, ttl, col], j) => { const bob = Math.sin(t * 2 + j) * 10, q = t < tIn ? 0 : eBack(clamp((t - tIn) / .5, 0, 1)); if (q <= 0) return;
          ctx.save(); ctx.translate(p[0], p[1] + bob); ctx.scale(q * DS, q * DS); ctx.rotate(j ? .04 : -.04); rr(ctx, -170, -190, 340, 380, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = col; rr(ctx, -170, -190, 340, 60, 14); ctx.fill(); ctx.fillRect(-170, -150, 340, 20);
          textC(ctx, ttl, 0, -148, 30, "#FFFFFF", 900);
          for (let i = 0; i < 5; i++){ const hi = j === 0 && i === 1 && t > tC - .3; ctx.fillStyle = hi ? hexA(GOLD, .6) : "#E3ECEF"; rr(ctx, -140, -100 + i * 56, 280, 38, 6); ctx.fill();
            if (j === 0 || i < 1 || (i === 1 && t > tV + .6)) textL(ctx, i === 1 ? "Rp 245.000" : "Rp " + (100 + i * 30) + ".000", -126, -72 + i * 56, 24, i === 1 && j === 1 ? GREEN : BROWN, 800); }
          ctx.restore(); });
        // floor keys (3D blocks)
        Kb.keys.forEach((K0, j) => { const st = (sts || []).find(q => Math.abs(q.x - K0.x) < K0.w / 2 && !(q.jumpT > -9 && t - q.jumpT < q.jumpD)); const on = !!st, x0 = K0.x - K0.w / 2, d = on ? 14 : 0, lit = on && ((j === 1 && t > tC) || (j === 2 && t > tV) || j === 0);
          ctx.fillStyle = "#11151F"; rr(ctx, x0 - 8, GY - 110, K0.w + 16, 130, 22); ctx.fill();
          rr(ctx, x0, GY - 150 + d, K0.w, 140, 20); ctx.fillStyle = lit ? ORANGE : "#D9D2C4"; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.ellipse(K0.x, GY - 150 + d, K0.w / 2, 52, 0, 0, TAU); ctx.fillStyle = lit ? HL : "#FDFBF6"; ctx.fill(); ol(ctx, 6);
          let lab = K0.k; if (j === 0 && t > tMac){ const fl = clamp((t - tMac) / .5, 0, 1); lab = fl < .5 ? "Ctrl" : "Cmd"; ctx.save(); ctx.translate(K0.x, GY - 92 + d); ctx.scale(1, Math.abs(Math.cos(fl * Math.PI))); textC(ctx, lab, 0, 22, 66, lit ? "#FFFFFF" : BROWN, 900, K0.w - 30); ctx.restore(); }
          else textC(ctx, lab, K0.x, GY - 70 + d, 66, lit ? "#FFFFFF" : (j === 3 ? "#9AA6B2" : BROWN), 900, K0.w - 30);
          if (lit) glowAt(ctx, K0.x, GY - 120, 200, "#F08C2E", .25 + .1 * Math.sin(t * 8)); }); },
      front: () => {
        // copy ghost: highlighted row lifts out of doc A on C, flies into doc B on V
        if (t > tC){ const k = t - tC, lift = eBack(clamp(k / .4, 0, 1)), fly = t > tV ? easeIO(clamp((t - tV) / .6, 0, 1)) : 0;
          const x = lerp(docA[0], docB[0], fly), y = lerp(docA[1] + (-44 - lift * 150) * DS, docB[1] - 44 * DS, fly) - Math.sin(fly * Math.PI) * 120;
          if (fly < 1){ ctx.save(); ctx.translate(x, y); ctx.scale(DS * 1.2, DS * 1.2); ctx.rotate(Math.sin(t * 4) * .05); rr(ctx, -150, -24, 300, 48, 8); ctx.fillStyle = hexA(GOLD, .95); ctx.fill(); ol(ctx, 4); textC(ctx, "Rp 245.000", 0, 10, 26, BROWN, 900); ctx.restore(); } } },
      over: (ctx2, c) => {
        if (t > tC && t < tV){ const p = c.toScreen(docA[0], docA[1] + 230 * DS); popChip(ctx, "TERSALIN", p[0], p[1], t - tC - .4, TEAL, "#FFFFFF", 32, -.05); }
        if (t > tV + .6){ const p = c.toScreen(docB[0], docB[1] + 230 * DS); popChip(ctx, "TERTEMPEL ✓", p[0], p[1], t - tV - .6, GREEN, "#FFFFFF", 32, .05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Kb = f.tombol || {}; if (Kb.copyCue) add(cueT(s, Kb.copyCue, .3, i) + .4, "pop"); if (Kb.pasteCue){ const t0 = cueT(s, Kb.pasteCue, .6, i); add(t0, "whoosh"); add(t0 + .6, "chime"); }
    if (Kb.macCue) add(cueT(s, Kb.macCue, .85, i), "whoosh"); if (Kb.inCue) add(cueT(s, Kb.inCue, .1, i), "pop"); });

  /* ================= JS34 shared: laundry shop ================= */
  function garment(ctx, x, y, col, sw, bag){ ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
    ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -8, 12, Math.PI, 0); ctx.moveTo(0, 4); ctx.lineTo(-60, 40); ctx.lineTo(60, 40); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-58, 40); ctx.lineTo(-70, 250); ctx.lineTo(70, 250); ctx.lineTo(58, 40); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(-20, 40); ctx.lineTo(0, 110); ctx.lineTo(20, 40); ctx.fillStyle = "#FFFFFF"; ctx.fill();
    if (bag){ rr(ctx, -78, 30, 156, 232, 10); ctx.fillStyle = hexA("#DDEFF5", .35); ctx.fill(); ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 3; ctx.stroke(); }
    ctx.restore(); }
  function dressForm(ctx, x, y, t, col){ ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#4A4A52"; rr(ctx, -6, -330, 12, 330, 5); ctx.fill(); rr(ctx, -70, -12, 140, 14, 6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-70, -560); ctx.quadraticCurveTo(-90, -470, -60, -330); ctx.lineTo(60, -330); ctx.quadraticCurveTo(90, -470, 70, -560); ctx.quadraticCurveTo(0, -600, -70, -560); ctx.fillStyle = col || "#E9D8C0"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(0, -590, 16, 0, TAU); ctx.fillStyle = "#4A4A52"; ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-60, -560); ctx.quadraticCurveTo(0, -500 + Math.sin(t * 2) * 6, 60, -560); ctx.lineTo(50, -430 + Math.sin(t * 2.3) * 8); ctx.stroke(); ctx.restore(); }
  function laundryBack(ctx, t, o){ o = o || {}; const wind = o.wind || 0, slow = o.slow ?? 1;
    ctx.save(); ctx.translate(0, o.dy ?? 270);
    // shelves with fabric rolls
    ctx.fillStyle = "#C47A48"; rr(ctx, 60, 520, 330, 22, 6); ctx.fill(); ol(ctx, 4); rr(ctx, 60, 700, 330, 22, 6); ctx.fill(); ol(ctx, 4);
    const cols = ["#BFE2EA", "#C2691F", "#7A4A8E", "#7FA563", "#2F6F73", "#B5532E", "#F3D9B5", "#3B4A6B"];
    for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++){ const cx = 92 + i * 62, cy = 520 + r * 180 - 70; ctx.fillStyle = cols[(i + r * 3) % 8]; rr(ctx, cx - 28, cy - 40, 56, 110, 10); ctx.fill(); ol(ctx, 3);
      ctx.beginPath(); ctx.ellipse(cx, cy - 40, 28, 12, 0, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fill(); ol(ctx, 3); }
    // sign
    rr(ctx, 450, 380, 360, 90, 16); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); textC(ctx, o.sign || "PENJAHIT RAPI", 630, 440, 40, "#FFFFFF", 900, 320);
    // rail with jackets in progress (chalk marks, pins)
    ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(440, 560); ctx.lineTo(1060, 560); ctx.stroke();
    ["#3B4A6B", "#5A3A2A", "#2F6F73", "#7A4A8E", "#2C2433"].forEach((c2, i) => { const sw = Math.sin(t * (2 + i * .3) + i) * .04 + wind * (Math.sin(t * 9 + i) * .25 + .15); garment(ctx, 490 + i * 125, 566, c2, sw, false);
      ctx.save(); ctx.translate(490 + i * 125, 566); ctx.rotate(sw); ctx.setLineDash([10, 8]); ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-50, 150); ctx.lineTo(50, 150); ctx.stroke(); ctx.restore(); });
    ctx.restore();
    // dress forms + sewing machine table
    dressForm(ctx, 120, GY, t, "#E9D8C0"); dressForm(ctx, 300, GY, t + 1, "#D9C2A8"); }
  function counter(ctx, x, t, o){ o = o || {}; const top = GY - 270, w = o.w || 560, j = o.jolt || 0;
    ctx.save(); ctx.translate(0, -j * 18);
    rr(ctx, x - w / 2, top, w, 270, 14); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); rr(ctx, x - w / 2 - 20, top - 30, w + 40, 40, 12); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5);
    rr(ctx, x - 120, top + 50, 240, 100, 12); ctx.fillStyle = "#8E4E2E"; ctx.fill(); textC(ctx, o.label || "KASIR", x, top + 118, 40, CREAM, 900);
    // bell + receipt
    const bj = j * 40; ctx.save(); ctx.translate(x + 180, top - 30 - bj); rr(ctx, -40, -8, 80, 12, 4); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(0, -8, 32, Math.PI, 0); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.restore(); return top; }

  /* ================= _laundry: angry customer at the counter (mode "marah": shouting gusts clash) / (mode "tenang": everything settles) ================= */
  TT.scene(PX + "jahit", "Cerita: pelanggan marah di kasir toko jahit — angin teriakan beradu / suasana mereda", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Ld = Object.assign({ mode: "marah", x: 560, a: 1, b: 0 }, f.laundry || {}), marah = Ld.mode === "marah";
    const tSlam = T(s, Ld.slamCue, .1, idx), tShout = T(s, Ld.shoutCue, .3, idx), tBack = T(s, Ld.backCue, .6, idx), tHot = T(s, Ld.hotCue, .85, idx);
    const tBreath = T(s, Ld.breathCue, .1, idx), tCalm = T(s, Ld.calmCue, .45, idx), tDrop = T(s, Ld.dropCue, .8, idx);
    const jolt = marah && t > tSlam && t < tSlam + .5 ? Math.sin((t - tSlam) / .5 * Math.PI) : 0;
    const gustA = marah ? (t > tShout ? 1 : 0) : clamp(1 - (t - tCalm) / 1.5, 0, 1) * .5, gustB = marah && t > tBack ? 1 : 0, clash = marah && t > tBack;
    const wind = Math.max(gustA, gustB) * (marah ? 1 : 1);
    const papers = 12;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false, time: Ld.night ? "night" : "day" },
      spots: { mid: [Ld.x, GY - 700, 1.15] },
      back: () => { laundryBack(ctx, t, { wind, slow: marah ? 1 : 1 - .7 * clamp((t - tCalm) / 2, 0, 1) }); },
      front: (ctx2, c, sts) => { const top = counter(ctx, Ld.x, t, { jolt });
        // papers / receipts: on the counter, blown into a swirl, then floating down (tenang)
        for (let i = 0; i < papers; i++){ const hx = Ld.x - 200 + rnd(i) * 400, hy = top - 40; let x = hx, y = hy, r = (rnd(i + 2) - .5) * .4;
          if (marah && t > tShout){ const k = t - tShout, sw = clash ? 1 : .5, a = t * (clash ? 4 : 2) + i / papers * TAU, R = (clash ? 140 : 260) + rnd(i + 5) * 120;
            const q = clamp(k / .6, 0, 1); x = lerp(hx, Ld.x + Math.cos(a) * R * (clash ? 1 : .8) + (clash ? 0 : 200), q); y = lerp(hy, GY - 820 + Math.sin(a) * R * .45 * sw, q); r = a * 2; }
          if (!marah){ const k = t - tCalm, q = clamp(k / 2.6, 0, 1); const a = (t * .6) + i / papers * TAU; x = lerp(Ld.x + Math.cos(a) * 240, hx, easeIO(q)); y = lerp(GY - 820 + Math.sin(a) * 100, hy, easeIO(q)) + Math.sin(t * 3 + i) * 20 * (1 - q); r = (1 - q) * Math.sin(t * 2 + i) + q * r; }
          ctx.save(); ctx.translate(x, y); ctx.rotate(r); rr(ctx, -34, -22, 68, 44, 4); ctx.fillStyle = i % 3 ? PAPER : "#FFE27A"; ctx.fill(); ctx.strokeStyle = hexA(OUT, .7); ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
        // shout gust lines from a mouth toward the other side
        const gust = (who, dir, amt) => { const st = sts[who]; if (!st || amt <= 0) return; const h = toonHead(st); ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .85 * amt); ctx.lineCap = "round";
          for (let i = 0; i < 9; i++){ const q = ((t * 2.2 + i / 9) % 1), y = h[1] + 20 + (rnd(i) - .5) * 260, x = h[0] + dir * (80 + q * 520); ctx.lineWidth = 10 * (1 - q) + 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dir * 120, y + Math.sin(t * 6 + i) * 20); ctx.stroke(); }
          ctx.restore(); };
        if (marah){ gust(Ld.a, sts[Ld.a] && sts[Ld.b] && sts[Ld.a].x < sts[Ld.b].x ? 1 : -1, gustA * (clash ? .8 : 1)); gust(Ld.b, sts[Ld.a] && sts[Ld.b] && sts[Ld.a].x < sts[Ld.b].x ? -1 : 1, gustB); }
        // clash: zigzag sparks in the middle
        if (clash){ const k = t - tBack, cx = Ld.x, cy = GY - 860; ctx.save(); ctx.strokeStyle = GOLD; ctx.lineWidth = 9; ctx.lineJoin = "round"; for (let i = 0; i < 4; i++){ if (Math.sin(t * 13 + i * 2) < 0) continue; const a = i / 4 * TAU + t;
            ctx.beginPath(); ctx.moveTo(cx, cy); for (let j = 1; j < 5; j++) ctx.lineTo(cx + Math.cos(a) * j * 45 + (j % 2 ? 20 : -20), cy + Math.sin(a) * j * 35); ctx.stroke(); } ctx.restore();
          burstFx(ctx, cx, cy, ((k * 1.2) % 1.2), RED, 10, 180); }
        // breathing ring (tenang)
        if (!marah && t > tBreath){ const st = sts[Ld.b]; if (st){ const h = toonHead(st), k = t - tBreath, br = .5 - .5 * Math.cos(k * 2.2); ctx.save(); ctx.globalAlpha = clamp(1.5 - Math.max(0, k - 3) * .5, 0, 1) * .8;
          ctx.strokeStyle = "#8EC3E6"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(h[0], h[1] + 60, st.size * (.32 + br * .14), 0, TAU); ctx.stroke(); ctx.restore(); } } },
      over: (ctx2, c, sts) => {
        if (marah && t >= tSlam){ const p = c.toScreen(Ld.x - 200, GY - 420); popWord(ctx, Ld.slamText || "BRAK!", p[0], p[1], t - tSlam, { size: 110, rot: -8, hold: 1 }); }
        if (marah && t >= tHot){ popChip(ctx, Ld.hotText || "MAKIN PANAS!", 540, 470, t - tHot, RED, "#FFFFFF", 50, -.05); }
        if (!marah && t >= tBreath && t < tCalm + .3){ popChip(ctx, "TARIK NAPAS...", 540, 450, t - tBreath, "#3B6E8F", "#FFFFFF", 44, -.03); }
        if (!marah && t >= tDrop){ popChip(ctx, Ld.dropText || "MULAI REDA", 540, 450, t - tDrop, GREEN, "#FFFFFF", 46, -.04); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Ld = f.laundry || {}; if (Ld.slamCue){ const t0 = cueT(s, Ld.slamCue, .1, i); add(t0, "pop"); add(t0 + .05, "pop"); }
    if (Ld.shoutCue) add(cueT(s, Ld.shoutCue, .3, i), "whoosh"); if (Ld.backCue){ const t0 = cueT(s, Ld.backCue, .6, i); add(t0, "whoosh"); add(t0 + .2, "ping"); } if (Ld.hotCue) add(cueT(s, Ld.hotCue, .85, i), "pop");
    if (Ld.breathCue) add(cueT(s, Ld.breathCue, .1, i), "whoosh"); if (Ld.dropCue) add(cueT(s, Ld.dropCue, .8, i), "chime"); });

  /* ================= _telinga: big earmuffs "KESAL" — explanations bounce off; acknowledging opens them ================= */
  TT.scene(PX + "telinga", "Cerita: penutup telinga raksasa, kartu alasan remuk jadi bola kertas, didengar dulu", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Tl = Object.assign({ on: 0, from: 1, words: [] }, f.telinga || {});
    const tOn = T(s, Tl.onCue, .1, idx), tOff = T(s, Tl.offCue, .8, idx);
    const words = Tl.words.map((o, j) => Object.assign({ T: T(s, o.cue, .3 + j * .1, idx) }, o));
    base(ctx, s, t, { env: Tl.env || "info", envOpt: { spotX: 600 },
      over1: (ctx2, c, sts, j) => { if (j !== Tl.on) return; const st = sts[j], h = toonHead(st), r = st.size * .2;
        const inQ = t < tOn ? 0 : eBack(clamp((t - tOn) / .45, 0, 1)), offK = t - tOff, off = offK > 0 ? clamp(offK / .7, 0, 1) : 0; if (inQ <= 0) return;
        ctx.save(); ctx.translate(h[0], h[1] - (1 - inQ) * 500 - eOut(off) * 700); ctx.rotate(off * 1.2); ctx.globalAlpha = 1 - off * .3;
        ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(0, 0, r * 1.18, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 22; ctx.stroke();
        [-1, 1].forEach(d => { const pulse = 1 + .04 * Math.sin(t * 6); ctx.save(); ctx.translate(d * r * 1.12, r * .1); ctx.scale(pulse, pulse); ctx.beginPath(); ctx.ellipse(0, 0, r * .42, r * .55, 0, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.ellipse(0, 0, r * .3, r * .42, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore(); });
        ctx.restore();
        if (inQ >= 1 && off <= 0){ const p = [h[0], h[1] - r * 1.5]; ctx.save(); ctx.translate(p[0], p[1]); chip(ctx, Tl.tag || "KESAL", 0, 0, RED, "#FFFFFF", 40); ctx.restore(); } },
      front: (ctx2, c, sts) => { const A = sts[Tl.on], B = sts[Tl.from]; if (!A || !B) return; const hA = toonHead(A), hB = toonHead(B), r = A.size * .2, dir = Math.sign(hA[0] - hB[0]) || -1;
        words.forEach((o, j) => { const k = t - o.T; if (k < 0 || k > 2.2) return; const ear = [hA[0] - dir * r * 1.3, hA[1] + r * .1], from = [hB[0] + dir * 60, hB[1] + 40];
          const pile = [hA[0] - dir * (120 + j * 70), GY - 30 - (j % 2) * 30];
          if (k < .6){ const q = k / .6, x = lerp(from[0], ear[0], q), y = lerp(from[1], ear[1], q) - Math.sin(q * Math.PI) * 120;
            ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(q * 6) * .1); const w = fit(ctx, o.text, 400, 40, 900); font(ctx, 900, w, FAM); const tw = ctx.measureText(o.text).width + 50;
            rr(ctx, -tw / 2, -40, tw, 74, 16); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, o.text, 0, 12, w, BROWN, 900); ctx.restore(); }
          else { const q = clamp((k - .6) / .8, 0, 1), x = lerp(ear[0], pile[0], q), y = lerp(ear[1], pile[1], q * q), sq = lerp(1, 0, clamp((k - .6) / .2, 0, 1));
            ctx.save(); ctx.translate(x, y); ctx.rotate(k * 5); if (sq > 0){ ctx.scale(sq, sq); rr(ctx, -110, -36, 220, 72, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); }
            else { ctx.beginPath(); for (let i = 0; i < 9; i++){ const a = i / 9 * TAU, r2 = 34 + (i % 2) * 12; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); } ctx.restore(); }
          if (k > .55 && k < 1){ const p = ear; burstFx(ctx, p[0], p[1], k - .55, "#9AA6B2", 8, 110); } });
        // crumpled balls that already landed stay in a pile
        words.forEach((o, j) => { const k = t - o.T; if (k <= 2.2) return; const x = hA[0] - dir * (120 + j * 70), y = GY - 30 - (j % 2) * 30; ctx.save(); ctx.translate(x, y); ctx.rotate(j);
          ctx.beginPath(); for (let i = 0; i < 9; i++){ const a = i / 9 * TAU, r2 = 34 + (i % 2) * 12; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.restore(); }); },
      over: (ctx2, c, sts) => { words.forEach((o, j) => { const k = t - o.T - .6; if (k < 0 || k > 1) return; const A = sts[Tl.on]; if (!A) return; const h = toonHead(A), p = c.toScreen(h[0], h[1] - A.size * .44); popChip(ctx, "TIDAK MASUK", p[0] + (j % 2 ? 170 : -170), p[1], k, "#3B4A6B", "#FFFFFF", 30, j % 2 ? .08 : -.08); });
        if (t >= tOff) popChip(ctx, Tl.offText || "DIDENGAR DULU", 540, 470, t - tOff - .3, GREEN, "#FFFFFF", 46, -.04); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Tl = f.telinga || {}; if (Tl.onCue) add(cueT(s, Tl.onCue, .1, i), "pop");
    (Tl.words || []).forEach((o, j) => { const t0 = cueT(s, o.cue, .3 + j * .1, i); add(t0, "whoosh"); add(t0 + .6, "ping"); }); if (Tl.offCue){ const t0 = cueT(s, Tl.offCue, .8, i); add(t0, "whoosh"); add(t0 + .3, "chime"); } });

  /* ================= _ekspres: the solution — night steaming of the suit, dawn delivery by scooter, proud customer ================= */
  EXTRA.tape = (ctx, t, o) => { ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(30, 10); ctx.quadraticCurveTo(80, 60 + Math.sin(t * 5) * 20, 140, 30); ctx.stroke(); };
  TT.scene(PX + "ekspres", "Cerita: solusi — jas dijahit rampung malam itu, diantar subuh naik motor, pelanggan berangkat rapi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, E = Object.assign({ suitX: 740, suit: "#2C2433" }, f.ekspres || {});
    const tSteam = T(s, E.steamCue, .2, idx), tDone = T(s, E.doneCue, .45, idx);
    const smooth = clamp((t - tSteam) / 2.2, 0, 1);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false, time: "night" },
      spots: { suit: [E.suitX, GY - 760, 1.25] },
      back: () => { laundryBack(ctx, t, { slow: .4, sign: E.sign });
        // garment stand with the suit
        const x = E.suitX; ctx.fillStyle = "#4A4A52"; rr(ctx, x - 8, GY - 1000, 16, 1000, 6); ctx.fill(); rr(ctx, x - 90, GY - 10, 180, 18, 8); ctx.fill(); rr(ctx, x - 110, GY - 1010, 220, 16, 8); ctx.fill();
        ctx.save(); ctx.translate(x, GY - 990); const sw = Math.sin(t * 2) * .03; ctx.rotate(sw);
        ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 0, 14, Math.PI, 0); ctx.moveTo(0, 12); ctx.lineTo(-110, 70); ctx.lineTo(110, 70); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-105, 70); ctx.lineTo(-125, 520); ctx.lineTo(125, 520); ctx.lineTo(105, 70); ctx.closePath(); ctx.fillStyle = E.suit; ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.moveTo(-40, 70); ctx.lineTo(0, 240); ctx.lineTo(40, 70); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.moveTo(-8, 80); ctx.lineTo(0, 220); ctx.lineTo(8, 80); ctx.fillStyle = RED; ctx.fill();
        ctx.strokeStyle = hexA("#000000", .5); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-40, 70); ctx.lineTo(-10, 330); ctx.moveTo(40, 70); ctx.lineTo(10, 330); ctx.stroke();
        // seams: dashed chalk lines become stitched
        [[-100, 120, -110, 500], [100, 120, 110, 500], [-60, 330, 60, 330]].forEach(([x1, y1, x2, y2], i) => { const q = clamp(smooth * 3 - i, 0, 1);
          ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          if (q > 0){ ctx.setLineDash([]); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, q), lerp(y1, y2, q)); ctx.stroke(); } ctx.restore(); });
        if (t > tDone){ const k = t - tDone; rr(ctx, -140, 50, 280, 490, 16); ctx.fillStyle = hexA("#DDEFF5", .3 * clamp(k / .4, 0, 1)); ctx.fill(); ctx.strokeStyle = hexA("#FFFFFF", .8 * clamp(k / .4, 0, 1)); ctx.lineWidth = 4; ctx.stroke();
          sparkle(ctx, 70 + Math.sin(t * 3) * 20, 160, 22 * (.6 + .4 * Math.sin(t * 6)), "#FFFFFF"); sparkle(ctx, -60, 380, 16 * (.6 + .4 * Math.cos(t * 5)), "#FFFFFF"); }
        ctx.restore();
        // flying needle + thread stitching the seams
        if (t > tSteam && t < tDone + .4){ const q = (t - tSteam) * 1.3, nx = x + Math.sin(q * 3) * 110, ny = GY - 900 + ((q * 160) % 420);
          ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 140, GY - 1000); ctx.quadraticCurveTo(x - 200, ny - 80, nx, ny); ctx.stroke();
          ctx.translate(nx, ny); ctx.rotate(q * 6); ctx.fillStyle = "#D9D9DE"; rr(ctx, -4, -40, 8, 80, 4); ctx.fill(); ol(ctx, 2); ctx.restore();
          for (let i = 0; i < 4; i++) sparkle(ctx, x - 100 + rnd(i + Math.floor(t * 4)) * 200, GY - 900 + rnd(i + 9 + Math.floor(t * 4)) * 420, 14, i % 2 ? GOLD : "#FFFFFF"); }
        // spool on the floor
        ctx.save(); ctx.translate(x - 160, GY - 30); ctx.rotate(t > tSteam && t < tDone ? t * 8 : 0); rr(ctx, -36, -30, 72, 60, 10); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#B5793D"; ctx.fillRect(-40, -34, 80, 10); ctx.fillRect(-40, 24, 80, 10); ctx.restore();
        // wall clock
        wallClock(ctx, 980, 560, t, t > tSteam ? 3 : .2); },
      over: (ctx2, c) => { if (t >= tDone){ const p = c.toScreen(E.suitX, GY - 1080); popChip(ctx, E.doneText || "RAPI ✓", p[0], Math.max(330, p[1]), t - tDone, GREEN, "#FFFFFF", 44, -.05); } },
    });
    // shots after the steaming (delivery / wedding) use the generic extras; the ride is drawn below
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const E = f.ekspres || {}; if (E.steamCue){ const t0 = cueT(s, E.steamCue, .2, i); add(t0, "whoosh"); add(t0 + 1, "whoosh"); } if (E.doneCue) add(cueT(s, E.doneCue, .45, i), "chime"); });

  /* rider on a scooter (any scene: toon a.ride = true, y raised to the seat) */
  function rideOver(ctx, st, a, t){ const fx = st.face || 1;
    scooter(ctx, st.x + (a.rideDx ?? 40) * fx, GY + 8, t, { face: fx, roll: st.x * 1.2, lamp: true, col: a.rideCol || ORANGE, s: .95 });
    if (st.moving){ ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 5; i++){ const y = GY - 80 - i * 70, q = (t * 3 + i * .3) % 1; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.moveTo(st.x - fx * (300 + q * 80), y); ctx.lineTo(st.x - fx * (420 + q * 80), y); ctx.stroke(); } ctx.restore(); }
    if (a.bag){ ctx.save(); ctx.translate(st.x - fx * 330, GY - 470); garment(ctx, 0, 0, a.bag, Math.sin(t * 5) * .1 - fx * .2, true); ctx.restore(); } }
})();
