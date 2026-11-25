/* Scene pack j2611221020123: MODE CERITA story scenes for RN28, KD28, JS28, SC28, MS28. Layout prefix j2611221020123_.
   Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front)
   plus pack extras handled by base():
     shots [{at|cue, env, envOpt, toons, cam, props, cards, held, ring, qs, piece:false}]   hard cuts to new shots inside one scene (cream flash)
     held [{on, type: suitcase|paper|bowl|drawing, at|cue, out|outCue, text}]                 objects held by / standing next to a toon
     ring {on, at|cue, outCue}   phone ring waves at a toon's hand      qs {on, at|cue, outCue}   question marks orbit a toon's head
     confetti {at|cue}           paper confetti
   Set pieces (layout suffix):
     adegan     generic story shot with the extras above
     kelereng   spoken hand-over: info marbles fly from one head and orbit the listener's head; half drop, bounce and roll into the gutter (f.kel)
     rantang    a three-tier enamel food carrier: oral notes blow off a plate, then tiers STATUS / KENDALA / LANGKAH drop and lock (f.rantang)
     struk      printing calculator: the paper tape grows over the desk and piles up, or wraps the hero, flags an error and rewinds (f.struk)
     rumus      three magic tools fly out of a laptop (=SUM hand vacuum, =AVERAGE rolling pin, =COUNT tally clicker), or work a data column under a formula bar (f.rumus)
     toko       bakery: the shop freezes over (icicles, frost, breath) when nobody greets, melts with a smile + flowers (f.toko)
     karpet     "first seconds" stage: 1-2-3 beats, smile + greeting badges, a red welcome carpet rolls out (f.karpet)
     jemuran    salary clothesline: installments (motor, phone, fridge) are pinned on and the rope sags, snaps; or a healthy 30/70 line (f.jemur)
     pulau      family members on separate floating islands with glowing screens; islands drift apart or merge around one table (f.pulau)
     makan      family dinner table: steaming dishes, swinging lamp, chat orbs float up, a child raises her prize drawing (f.makan)
   Camera keys may use on:"<spot>" for named spots of a set piece. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, G, TAU, CS } = TT;
  const PX = "j2611221020123_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", TEAL = "#2F6F73", NAVY = "#13223D", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const eIn = x => x * x * x;
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i ?? G.scene) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .3, i ?? G.scene) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ico = (ctx, name, cx, cy, size, col, lw) => icon(ctx, name, cx - size / 2, cy - size / 2, size, col, lw || 2.4);
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 16)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW, stroke){ if (maxW) fit(ctx, txt, maxW, size, weight || 800); else font(ctx, weight || 800, size, FAM); ctx.textAlign = "center";
    if (stroke){ ctx.lineJoin = "round"; ctx.strokeStyle = stroke; ctx.lineWidth = 8; ctx.strokeText(txt, x, y); } ctx.fillStyle = col; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function pill(ctx, txt, x, y, q, bg, fg, size){ if (q <= 0) return; size = size || 40; font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    ctx.save(); ctx.translate(x, y); ctx.scale(q, q); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg || ORANGE; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = fg || CREAM; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function dust(ctx, x, y, k, n, R){ if (k < 0 || k > 1) return; ctx.save(); ctx.globalAlpha *= (1 - k) * .8; for (let i = 0; i < (n || 7); i++){ const a = Math.PI + i / ((n || 7) - 1) * Math.PI, r = (R || 120) * eOut(k);
    ctx.fillStyle = i % 2 ? "#E9D9C2" : "#D8C2A2"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 1.4, y + Math.sin(a) * r * .5, 26 + 30 * k, 0, TAU); ctx.fill(); } ctx.restore(); }
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };

  /* ---------- held objects ---------- */
  function drawHeld(ctx, st, h, q, t){
    const k = st.size / 760 * (h.s || 1), f = st.face || 1;
    if (h.type === "suitcase"){ const [x, y] = [st.x + f * 210 * k, st.y]; ctx.save(); ctx.translate(x, y); ctx.scale(k * q, k * q);
      ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 110, 16, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-20, -330); ctx.lineTo(-20, -420); ctx.lineTo(20, -420); ctx.lineTo(20, -330); ctx.stroke();
      rr(ctx, -95, -330, 190, 310, 26); ctx.fillStyle = h.col || "#D9483B"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "rgba(255,255,255,.25)"; [-45, 0, 45].forEach(dx => { rr(ctx, dx - 8, -310, 16, 270, 8); ctx.fill(); });
      [-60, 60].forEach(dx => { ctx.beginPath(); ctx.arc(dx, -10, 16, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }); ctx.restore(); return; }
    const [hx, hy] = lp(st, 20, -47);
    ctx.save(); ctx.translate(hx, hy); ctx.scale(k * q, k * q);
    if (h.type === "paper"){ ctx.rotate(-.08 + Math.sin(t * 2) * .03); rr(ctx, -95, -250, 190, 250, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = ORANGE; ctx.fillRect(-70, -222, 140, 18); ctx.fillStyle = "#C9B79E"; for (let i = 0; i < 6; i++) ctx.fillRect(-70, -186 + i * 28, 140 - (i % 3) * 30, 10);
      [[-70, -186], [-70, -130], [-70, -74]].forEach(([x, y], i) => { ctx.fillStyle = [TEAL, ORANGE, GREEN][i]; ctx.fillRect(x - 16, y - 2, 12, 14); }); }
    else if (h.type === "bowl"){ ctx.translate(0, -30);
      for (let i = 0; i < 3; i++){ const qq = (t * .6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = .55 * Math.sin(qq * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-40 + i * 40, -50 - qq * 160); ctx.quadraticCurveTo(-60 + i * 40 + Math.sin(qq * 7) * 20, -100 - qq * 160, -36 + i * 40, -150 - qq * 160); ctx.stroke(); ctx.restore(); }
      ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(30, -40); ctx.lineTo(140, -170); ctx.moveTo(50, -36); ctx.lineTo(165, -150); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -30, 130, 34, 0, 0, TAU); ctx.fillStyle = "#F3C56B"; ctx.fill(); ctx.strokeStyle = "#D99A3A"; ctx.lineWidth = 6; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(-100 + i * 36, -34); ctx.quadraticCurveTo(-82 + i * 36, -10, -64 + i * 36, -34); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(-135, -30); ctx.quadraticCurveTo(-120, 70, 0, 72); ctx.quadraticCurveTo(120, 70, 135, -30); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 7);
      ctx.fillStyle = CREAM; ctx.fillRect(-100, 6, 200, 12); }
    else if (h.type === "drawing"){ const up = (h.raise ?? 1) * 260; ctx.translate(0, -up); ctx.rotate(Math.sin(t * 3) * .05);
      rr(ctx, -150, -230, 300, 230, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
      ctx.fillStyle = "#9FD3E8"; ctx.fillRect(-134, -214, 268, 120); ctx.fillStyle = "#7FBF6A"; ctx.fillRect(-134, -94, 268, 78);
      ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(90, -170, 30, 0, TAU); ctx.fill();
      ctx.fillStyle = "#E07A4F"; ctx.fillRect(-90, -130, 110, 80); ctx.beginPath(); ctx.moveTo(-104, -130); ctx.lineTo(-35, -190); ctx.lineTo(34, -130); ctx.closePath(); ctx.fillStyle = RED; ctx.fill();
      ctx.fillStyle = BROWN; ctx.fillRect(-50, -90, 30, 40);
      // ribbon
      ctx.save(); ctx.translate(120, -40); ctx.rotate(.2); ctx.fillStyle = "#2F6F73"; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(-40, 90); ctx.lineTo(-14, 70); ctx.lineTo(0, 96); ctx.lineTo(10, 10); ctx.fill();
      ctx.beginPath(); ctx.arc(-12, 0, 46, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); textC(ctx, "JUARA", -12, -4, 22, BROWN, 900); textC(ctx, "1", -12, 26, 30, BROWN, 900); ctx.restore(); }
    ctx.restore();
  }
  function ringFx(ctx, st, t, k){ if (k < 0) return; const [x, y] = lp(st, 16, -60), sc = st.size / 760;
    ctx.save(); ctx.lineCap = "round"; for (let i = 0; i < 3; i++){ const q = ((t * 1.6 + i / 3) % 1); ctx.globalAlpha = (1 - q) * .9; ctx.strokeStyle = i % 2 ? ORANGE : RED; ctx.lineWidth = 9 * sc;
      [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(x, y, (60 + q * 150) * sc, d > 0 ? -.7 : Math.PI - .7, d > 0 ? .7 : Math.PI + .7); ctx.stroke(); }); }
    ctx.restore(); const bz = Math.sin(t * 60) * 6 * sc; ctx.save(); ctx.translate(x + bz, y - 190 * sc); const q = popQ(t, t - (k % .8), .2);
    ctx.scale(sc * (.8 + .2 * q), sc * (.8 + .2 * q)); ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "!", 0, 17, 50, "#FFFFFF", 900); ctx.restore(); }
  function qsFx(ctx, st, t, k){ if (k < 0) return; const h = toonHead(st), r = st.size * .3;
    for (let i = 0; i < 3; i++){ const a = t * 1.8 + i * TAU / 3, x = h[0] + Math.cos(a) * r * 1.1, y = h[1] - r * .9 + Math.sin(a) * r * .35, q = popQ(k, i * .15, .35);
      ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.rotate(Math.sin(t * 3 + i) * .2); textC(ctx, "?", 0, 26, 86 * st.size / 760, i === 1 ? ORANGE : CREAM, 900, 0, OUT); ctx.restore(); } }
  function confettiFx(ctx, k){ if (k < 0 || k > 3) return; const cols = [ORANGE, GOLD, TEAL, RED, CREAM, GREEN];
    for (let i = 0; i < 70; i++){ const x = rnd(i) * 1180 - 50 + Math.sin(k * 3 + i) * 30, y = -80 + (k * (380 + rnd(i + 9) * 380)) + rnd(i + 3) * -500;
      if (y < -40 || y > 1900) continue; ctx.save(); ctx.globalAlpha = clamp((3 - k) / .6, 0, 1); ctx.translate(x, y); ctx.rotate(k * (4 + rnd(i) * 6)); ctx.scale(1, Math.cos(k * 8 + i)); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); } }

  /* ---------- shared base ---------- */
  function shotOf(s, t, f){
    const S = f.shots; if (!S || !S.length) return { F: f, k: -1, T0: 0 };
    let k = -1, T0 = 0; S.forEach((sh, j) => { const tt = tOf(s, sh, .5); if (t >= tt){ k = j; T0 = tt; } });
    if (k < 0) return { F: f, k: -1, T0: 0 };
    const F = Object.assign({}, f, S[k]); delete F.shots; if (!("stamp" in S[k])) delete F.stamp; return { F, k, T0 };
  }
  // H (object or function(F, shot) -> object): {env, envOpt, spots, prep(a, j), back/mid/front/after(ctx, c, sts, R), midZ, post, over, cam}
  function base(ctx, s, t, Hf){
    const sh = shotOf(s, t, s.f || {}), f = sh.F, piece = f.piece !== false;
    const H = piece ? (typeof Hf === "function" ? Hf(f, sh) : (Hf || {})) : {};
    const toons = f.toons || [], idx = G.scene;
    const P = toons.map((a, j) => { const r = H.prep ? H.prep(a, j) : null; return r || { a, t }; });
    const sts = P.map(p => toonState(p.a, s, p.t));
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || H.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const R = { f, shot: sh.k };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const held = f.held || [];
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      held.filter(h => h.on === j && h.type === "suitcase").forEach(h => { const T0 = tOf(s, h, .3), q = h.at == null && !h.cue ? 1 : popQ(t, T0, .35), TO = h.outCue ? T(s, h.outCue, .9) : (h.out ?? 1e9); if (q > 0 && t < TO) layer(ctx, c, 1, () => drawHeld(ctx, sts[j], h, q, t)); });
      R[j] = toon(ctx, c, P[j].a, s, P[j].t, { st: sts[j] });
      held.filter(h => h.on === j && h.type !== "suitcase").forEach(h => { const T0 = h.at == null && !h.cue ? -1 : tOf(s, h, .3), TO = h.outCue ? T(s, h.outCue, .9) : (h.out ?? 1e9); const q = T0 < 0 ? 1 : popQ(t, T0, .35);
        if (q > 0 && t < TO) layer(ctx, c, 1, () => drawHeld(ctx, sts[j], Object.assign({}, h, { raise: h.raiseCue ? eBack(clamp((t - T(s, h.raiseCue, .3)) / .5, 0, 1)) : (h.raise ?? 0) }), q, t)); });
      if (f.ring && f.ring.on === j){ const T0 = tOf(s, f.ring, .3), TO = f.ring.outCue ? T(s, f.ring.outCue, .9) : (f.ring.out ?? 1e9); if (t >= T0 && t < TO) layer(ctx, c, 1, () => ringFx(ctx, sts[j], t, t - T0)); }
      if (f.qs && f.qs.on === j){ const T0 = tOf(s, f.qs, .3), TO = f.qs.outCue ? T(s, f.qs.outCue, .9) : (f.qs.out ?? 1e9); if (t >= T0 && t < TO) layer(ctx, c, 1, () => qsFx(ctx, sts[j], t, t - T0)); }
      if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (H.after) H.after(ctx, c, sts, R);
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.post){ ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    if (f.confetti){ const k = t - tOf(s, f.confetti, .5); if (k >= 0) CS.ov.push(() => confettiFx(ctx, k)); }
    if (H.over) CS.ov.push(() => H.over(ctx, c, sts, R));
    if (sh.k >= 0 && t - sh.T0 < .3){ const q = (t - sh.T0) / .3; CS.ov.push(() => { ctx.save(); ctx.globalAlpha = (1 - q) * .85; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }); }
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R };
  }
  function sfxBase(s, f0, i, add){
    const one = f => {
      const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
      (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
      (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
      (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
      (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
      (f.held || []).forEach(h => { if (h.cue) add(cueT(s, h.cue, .3, i), "pop"); if (h.raiseCue) add(cueT(s, h.raiseCue, .3, i), "chime"); });
      if (f.ring) add(tOf(s, f.ring, .3, i), "ping");
      if (f.confetti) add(tOf(s, f.confetti, .5, i), "chime");
    };
    one(f0); (f0.shots || []).forEach(sh => { one(sh); add(tOf(s, sh, .5, i), "whoosh"); });
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + shot (cut), benda dipegang, dering, tanda tanya, confetti", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= kelereng: spoken hand-over = info marbles orbit a head, half of them drop and roll into the gutter ================= */
  function marble(ctx, x, y, R, col, txt, rot){
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(R * .1, R * 1.05, R * .8, R * .16, 0, 0, TAU); ctx.fill();
    const g = ctx.createRadialGradient(-R * .35, -R * .4, R * .1, 0, 0, R); g.addColorStop(0, "#FFFFFF"); g.addColorStop(.3, mixHex(col, "#FFFFFF", .3)); g.addColorStop(1, mixHex(col, "#000000", .3));
    ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fillStyle = g; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.rotate(rot || 0); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = R * .14; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 0, R * .62, .4, 1.7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, R * .62, 3.5, 4.4); ctx.stroke(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.ellipse(-R * .4, -R * .45, R * .2, R * .12, -.6, 0, TAU); ctx.fill();
    const sz = fit(ctx, txt, R * 2.3, 32, 900, 16); ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.strokeText(txt, 0, sz * .36); ctx.fillStyle = "#FFFFFF"; ctx.fillText(txt, 0, sz * .36); ctx.textAlign = "left";
    ctx.restore();
  }
  const MCOL = ["#E0503A", "#2F8F8A", "#E8A13A", "#6B4A8E", "#3E7BC2", "#3E9B5A"];
  function kelState(s, f, i){
    const B = Object.assign({ from: 0, to: 1, items: [], R: 60, drainX: 900 }, f.kel || {}), tSp = T(s, B.spillCue, .5, i);
    const items = B.items.map((it, j) => Object.assign({ T: tOf(s, it, .2 + j * .15, i), j }, it));
    let o = 0; items.forEach(it => { it.sT = it.drop === false ? 1e9 : tSp + (o++) * .22; });
    return { B, items, tSp };
  }
  TT.scene(PX + "kelereng", "Cerita: serah terima lisan = kelereng info yang jatuh ke selokan", (ctx, th, s, t) => {
    const f = s.f || {}, { B, items } = kelState(s, f);
    base(ctx, s, t, { env: "street", spots: { head: () => [B.headX ?? 760, 920, 1.06], drain: [B.drainX - 120, 1300, 1.15] },
      back: () => { const x = B.drainX; ctx.fillStyle = "#3A3430"; rr(ctx, x - 80, GROUND - 14, 160, 36, 6); ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#8C8178"; ctx.lineWidth = 6; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(x - 66 + i * 26, GROUND - 10); ctx.lineTo(x - 66 + i * 26, GROUND + 18); ctx.stroke(); } },
      front: (ctx2, c, sts) => {
        const A = sts[B.from], Y = sts[B.to]; if (!A || !Y) return; const hA = toonHead(A), hY = toonHead(Y), n = items.length, R = B.R;
        const src = [hA[0] + (A.face || 1) * A.size * .12, hA[1] + A.size * .08];
        const slot = (j, tt) => { const a = -Math.PI / 2 - .22 + (j - (n - 1) / 2) * .6 + Math.sin(tt * 1.3 + j) * .05, r = Y.size * .4; return [hY[0] + Math.cos(a) * r * .95, hY[1] - 30 + Math.sin(a) * r * .8 + Math.sin(tt * 2.2 + j * 1.4) * 8]; };
        items.forEach(it => { const k = t - it.T; if (k < 0) return; const col = it.col || MCOL[it.j % MCOL.length];
          let [x, y] = slot(it.j, t), rot = t * .8 + it.j;
          if (k < .6){ const q = eOut(k / .6); x = lerp(src[0], x, q); y = lerp(src[1], y, q) - Math.sin(q * Math.PI) * 220; rot = k * 10; }
          if (t >= it.sT){ // simple physics: fall, bounce, roll to the drain
            let [px, py] = slot(it.j, it.sT), vx = Math.sign(B.drainX - px) * (180 + rnd(it.j) * 160), vy = -260, gone = 0, drop = 0;
            const steps = Math.min(240, Math.floor((t - it.sT) * 60)), floor = GROUND - R;
            for (let q = 0; q < steps; q++){ const dt = 1 / 60;
              if (drop){ py += 900 * dt; gone += dt; continue; }
              vy += 2400 * dt; px += vx * dt; py += vy * dt; if (py > floor){ py = floor; vy = Math.abs(vy) > 220 ? -Math.abs(vy) * .45 : 0; vx *= .96; }
              if (py >= floor - 1 && Math.abs(px - B.drainX) < 55){ drop = 1; px = B.drainX + (px - B.drainX) * .5; } }
            x = px; y = py; rot = (px - slot(it.j, it.sT)[0]) / R; if (gone > .5) return;
            if (drop){ ctx.save(); ctx.beginPath(); ctx.rect(x - 300, -400, 600, GROUND - 14 + 400); ctx.clip(); marble(ctx, x, y, R, col, String(it.text).toUpperCase(), rot); ctx.restore(); return; }
          }
          marble(ctx, x, y, R * (k < .6 ? .5 + .5 * eBack(clamp(k / .6, 0, 1)) : 1), col, String(it.text).toUpperCase(), rot);
          if (k > .6 && k < 1.3 && t < it.sT) burstFx(ctx, x, y, k - .6, HL, 8, R * 1.6); });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const { items } = kelState(s, f, i); items.forEach((it, j) => { add(it.T, j ? "pop" : "whoosh"); if (it.sT < 1e8){ add(it.sT + .3, "pop"); } }); });

  /* ================= rantang: three-tier carrier ================= */
  function tier(ctx, x, yb, w, h, col, label, iconName, sq, top){
    ctx.save(); ctx.translate(x, yb); ctx.scale(1 + sq, 1 - sq);
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, "#EFE3CF"); g.addColorStop(.35, "#FFFBF2"); g.addColorStop(1, "#D9C7AA");
    ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(-w / 2, -18); ctx.quadraticCurveTo(-w / 2, 0, -w / 2 + 30, 0); ctx.lineTo(w / 2 - 30, 0); ctx.quadraticCurveTo(w / 2, 0, w / 2, -18); ctx.lineTo(w / 2, -h); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
    rr(ctx, -w / 2 + 3, -h * .78, w - 6, h * .56, 4); ctx.fillStyle = col; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.75)"; for (let i = 0; i < 9; i++){ const xx = -w / 2 + 26 + i * (w - 52) / 8; ctx.beginPath(); ctx.arc(xx, -h * .82, 5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(xx, -h * .18, 5, 0, TAU); ctx.fill(); }
    if (iconName){ ctx.beginPath(); ctx.arc(-w / 2 + 52, -h * .5, 30, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ico(ctx, iconName, -w / 2 + 52, -h * .5, 38, col, 2.6); }
    const sz = fit(ctx, label, w - (iconName ? 130 : 50), 46, 900, 22); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(label, iconName ? 30 : 0, -h * .5 + sz * .36); ctx.textAlign = "left";
    if (top){ ctx.beginPath(); ctx.ellipse(0, -h, w / 2, 26, 0, 0, TAU); ctx.fillStyle = "#E9DCC6"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(0, -h + 4, w / 2 - 22, 16, 0, 0, TAU); ctx.fillStyle = "#6B4A30"; ctx.fill(); }
    ctx.restore();
  }
  TT.scene(PX + "rantang", "Cerita: rantang serah terima (status, kendala, langkah)", (ctx, th, s, t) => {
    const f = s.f || {}, Rn = Object.assign({ x: 720, y: 1250, w: 430, h: 150, tiers: [], notes: ["Vendor", "Poster", "Gudang", "Anggaran"] }, f.rantang || {});
    const tLost = T(s, Rn.lostCue, .4), TT0 = Rn.tiers.map((ti, j) => tOf(s, ti, .3 + j * .1)), tFirst = Math.min(...TT0, 1e9), tLid = T(s, Rn.lidCue, .6);
    const nOn = TT0.filter(x => t >= x).length;
    base(ctx, s, t, { env: "park", envOpt: { bench: false },
      spots: { rantang: () => [Rn.x - 130, Rn.y - 230 - nOn * 40, 1.05], wide: [560, 960, 1] },
      back: () => {
        // picnic table
        const x = Rn.x; ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, GROUND + 4, 330, 24, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#8E4E2E"; [[-250, .12], [230, -.12]].forEach(([dx, a]) => { ctx.save(); ctx.translate(x + dx, Rn.y + 20); ctx.rotate(a); rr(ctx, -14, 0, 28, GROUND - Rn.y - 16, 6); ctx.fill(); ol(ctx, 5); ctx.restore(); });
        rr(ctx, x - 330, Rn.y - 6, 660, 44, 10); ctx.fillStyle = "#B5643C"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#C8352E"; ctx.beginPath(); ctx.moveTo(x - 300, Rn.y - 4); ctx.lineTo(x + 300, Rn.y - 4); ctx.lineTo(x + 280, Rn.y + 60); ctx.lineTo(x - 280, Rn.y + 60); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 10; i++) for (let r = 0; r < 2; r++) if ((i + r) % 2) ctx.fillRect(x - 300 + i * 60, Rn.y - 4 + r * 32, 60, 32);
      },
      mid: () => {
        const x = Rn.x, w = Rn.w, h = Rn.h;
        // the oral plate with loose notes
        const plateOut = clamp((t - tFirst + .3) / .3, 0, 1);
        if (plateOut < 1){ ctx.save(); ctx.globalAlpha *= 1 - plateOut; const wob = t > tLost ? Math.sin((t - tLost) * 14) * .1 * Math.exp(-(t - tLost) * 2) : 0;
          ctx.translate(x, Rn.y - 8); ctx.rotate(wob); ctx.beginPath(); ctx.ellipse(0, 0, 200, 44, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(0, -4, 140, 26, 0, 0, TAU); ctx.strokeStyle = "#D9C7AA"; ctx.lineWidth = 4; ctx.stroke();
          ctx.restore();
          Rn.notes.forEach((n, j) => { let nx = x - 120 + j * 80, ny = Rn.y - 50 - (j % 2) * 30, rot = (j - 1.5) * .2;
            if (t > tLost){ const d = t - tLost - j * .12; if (d > 0){ nx += d * 900 + Math.sin(d * 6 + j) * 60; ny -= d * 520 - d * d * 120 + Math.cos(d * 5 + j) * 50; rot += d * (6 + j); } }
            if (nx > 1500) return; ctx.save(); ctx.globalAlpha *= 1 - plateOut; ctx.translate(nx, ny); ctx.rotate(rot + Math.sin(t * 5 + j) * .06); rr(ctx, -70, -44, 140, 88, 6); ctx.fillStyle = ["#F6D36B", "#F4A85C", "#BFE3B4", "#9FD3E8"][j % 4]; ctx.fill(); ol(ctx, 4);
            textC(ctx, n.toUpperCase(), 0, 12, 26, BROWN, 900, 120); ctx.restore(); });
          if (t > tLost && t < tLost + 1.4){ ctx.save(); ctx.globalAlpha = .6 * (1 - (t - tLost) / 1.4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round";
            for (let i = 0; i < 6; i++){ const yy = 700 + i * 100, xx = ((t - tLost) * 1600 + i * 230) % 1600 - 300; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.quadraticCurveTo(xx + 120, yy - 30, xx + 240, yy); ctx.stroke(); } ctx.restore(); }
          if (t > tFirst - .3 && plateOut < 1){ dust(ctx, x, Rn.y - 20, plateOut, 7, 140); }
        }
        // tiers
        Rn.tiers.forEach((ti, j) => { const k = t - TT0[j]; if (k < 0) return; let yb = Rn.y - 4 - j * h, sq = 0;
          if (k < .35){ yb -= (1 - eIn(k / .35)) * 900; } else if (k < .75){ const q = (k - .35) / .4; sq = .14 * Math.sin(q * Math.PI * 2) * (1 - q); }
          tier(ctx, x, yb, w, h, ti.col || [TEAL, ORANGE, "#6B4A8E"][j % 3], String(ti.label || "").toUpperCase(), ti.icon, sq, j === nOn - 1 && t < tLid + .3);
          if (k > .35 && k < 1.2) burstFx(ctx, x, yb - h * .5, k - .35, HL, 10, w * .55); });
        // lid + rods + handle + tag
        const kl = t - tLid; if (kl >= 0 && nOn){ const topY = Rn.y - 4 - nOn * h; let ly = topY, sq = 0; if (kl < .3) ly -= (1 - eIn(kl / .3)) * 700; else if (kl < .7) sq = .12 * Math.sin((kl - .3) / .4 * Math.PI * 2) * (1 - (kl - .3) / .4);
          ctx.save(); ctx.translate(x, ly); ctx.scale(1 + sq, 1 - sq); ctx.beginPath(); ctx.ellipse(0, 0, w / 2 + 8, 28, 0, 0, TAU); ctx.fillStyle = "#E9DCC6"; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.moveTo(-w / 2 + 20, -4); ctx.quadraticCurveTo(0, -110, w / 2 - 20, -4); ctx.closePath(); ctx.fillStyle = "#FFFBF2"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.ellipse(0, -64, 34, 16, 0, 0, TAU); ctx.fill(); ol(ctx, 5); ctx.restore();
          const kr = clamp((kl - .45) / .45, 0, 1); if (kr > 0){ const top = ly - 90 - 120 * eOut(kr);
            [-1, 1].forEach(d => { ctx.fillStyle = "#9AA3AD"; rr(ctx, x + d * (w / 2 + 18) - 9, top, 18, Rn.y - top - 20, 8); ctx.fill(); ol(ctx, 4); });
            ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - w / 2 - 18, top + 10); ctx.quadraticCurveTo(x, top - 140, x + w / 2 + 18, top + 10); ctx.stroke();
            ctx.strokeStyle = "#B8C0C8"; ctx.lineWidth = 12; ctx.stroke();
            if (Rn.tag){ const sw = Math.sin((kl - .45) * 6) * .25 * Math.exp(-(kl - .45) * 1.2) + Math.sin(t * 2) * .03; ctx.save(); ctx.translate(x + w * .18, top - 50); ctx.rotate(sw); ctx.strokeStyle = BROWN; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 50); ctx.stroke();
              fit(ctx, Rn.tag, 300, 38, 900); const tw = ctx.measureText(Rn.tag).width + 90; ctx.translate(0, 50); rr(ctx, -tw / 2, 0, tw, 70, 12); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ico(ctx, "clock", -tw / 2 + 38, 35, 34, BROWN, 2.6); ctx.fillStyle = BROWN; ctx.fillText(Rn.tag, -tw / 2 + 64, 48); ctx.restore(); }
            if (kl > .9 && kl < 1.8) burstFx(ctx, x, ly - 200, kl - .9, GOLD, 14, 300); }
          glowAt(ctx, x, Rn.y - nOn * h * .5, 420, "#FFE3A0", .18 + .08 * Math.sin(t * 3)); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rn = f.rantang || {}; if (Rn.lostCue) add(cueT(s, Rn.lostCue, .4, i), "whoosh"); (Rn.tiers || []).forEach((ti, j) => add(tOf(s, ti, .3 + j * .1, i) + .33, "pop")); if (Rn.lidCue){ const a = cueT(s, Rn.lidCue, .6, i); add(a + .3, "pop"); add(a + .9, "chime"); } });

  /* ================= struk: printing calculator tape ================= */
  function calc(ctx, x, yb, sc, t, disp, busy){
    ctx.save(); ctx.translate(x, yb); ctx.scale(sc, sc);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 170, 18, 0, 0, TAU); ctx.fill();
    rr(ctx, -150, -360, 300, 360, 30); ctx.fillStyle = "#4A4F57"; ctx.fill(); ol(ctx, 7);
    rr(ctx, -110, -372, 220, 30, 10); ctx.fillStyle = "#2B2E33"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -120, -330, 240, 80, 12); ctx.fillStyle = "#B9C9A8"; ctx.fill(); ol(ctx, 5);
    fit(ctx, disp, 210, 52, 800); ctx.fillStyle = "#2B3A26"; ctx.textAlign = "right"; ctx.fillText(disp, 108, -272); ctx.textAlign = "left";
    const hot = busy ? Math.floor(t * 7) % 16 : -1;
    for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++){ const k = r * 4 + q, bx = -118 + q * 62, by = -232 + r * 56, down = k === hot ? 5 : 0;
      rr(ctx, bx, by + down, 50, 44, 10); ctx.fillStyle = q === 3 ? ORANGE : (k === hot ? "#FFE3A0" : CREAM); ctx.fill(); ol(ctx, 4); }
    ctx.restore();
  }
  function tapeAlong(ctx, pts, L, t, errAt){
    // pts: polyline; draw tape of length L from pts[0]
    let acc = 0; ctx.save(); ctx.lineCap = "butt"; ctx.lineJoin = "round";
    const path = []; for (let i = 1; i < pts.length; i++){ const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], d = Math.hypot(x1 - x0, y1 - y0); if (acc + d >= L){ const q = (L - acc) / d; path.push([x0, y0], [lerp(x0, x1, q), lerp(y0, y1, q)]); acc = L; break; } path.push([x0, y0]); acc += d; if (i === pts.length - 1) path.push([x1, y1]); }
    if (path.length < 2){ ctx.restore(); return acc; }
    ctx.beginPath(); path.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.strokeStyle = OUT; ctx.lineWidth = 62; ctx.stroke(); ctx.strokeStyle = PAPER; ctx.lineWidth = 52; ctx.stroke();
    // printed rows
    let a2 = 0; for (let i = 1; i < path.length; i++){ const [x0, y0] = path[i - 1], [x1, y1] = path[i], d = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
      for (let s0 = Math.ceil(a2 / 34) * 34; s0 < a2 + d; s0 += 34){ const q = (s0 - a2) / d, px = lerp(x0, x1, q), py = lerp(y0, y1, q), row = Math.round(s0 / 34);
        ctx.save(); ctx.translate(px, py); ctx.rotate(ang + Math.PI / 2); const err = errAt != null && row === errAt;
        if (err){ ctx.fillStyle = RED; ctx.fillRect(-24, -12, 48, 24); } else { ctx.fillStyle = "#9C8C78"; ctx.fillRect(-18, -3, 10 + (row * 7) % 22, 6); ctx.fillRect(10, -3, 8, 6); }
        ctx.restore(); }
      a2 += d; }
    ctx.restore(); return acc;
  }
  TT.scene(PX + "struk", "Cerita: kalkulator struk (kertas memanjang / melilit / digulung balik)", (ctx, th, s, t) => {
    const f = s.f || {}, S = Object.assign({ mode: "desk", x: 640, deskX: 720, speed: 230, fast: 620 }, f.struk || {});
    const t0 = tOf(s, { cue: S.startCue, at: S.startAt ?? .1 }, .1), tFast = T(s, S.fastCue, .3), tErr = T(s, S.errCue, .3), tRew = T(s, S.rewindCue, .3);
    const L = t < t0 ? 120 : 120 + Math.min(t, tFast) * 0 + (Math.min(t, tFast) - t0) * S.speed + Math.max(0, t - tFast) * S.fast;
    const vals = ["125.000", "87.500", "240.000", "56.000", "310.000", "99.000"];
    if (S.mode === "desk"){
      const cx = S.x, calcTop = 1350 - 360;
      base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 80 }, spots: { calc: [cx - 40, 920, 1.08], tape: [cx + 80, 1080, .95] },
        back: () => { prop(ctx, "desk", S.deskX, GROUND, { papers: 4, mug: false }, t); },
        mid: () => {
          const busy = t > t0 && t < (S.stopAt ?? 1e9);
          const total = Math.floor(Math.max(0, t - t0) * 3.1) * 41500 + 125000;
          calc(ctx, cx, 1350, 1, t, busy ? total.toLocaleString("id-ID") : "0", busy);
          const pts = [[cx, calcTop - 10], [cx, 650]]; for (let a = Math.PI; a >= 0; a -= .2) pts.push([cx + 150 + Math.cos(a) * 150, 650 - Math.sin(a) * 150]);
          pts.push([cx + 300, 650], [cx + 300, 1560]);
          // floor coils
          for (let i = 0; i < 14; i++){ const r = 90 + (i % 3) * 22, cy = 1560 + 30 - i * 2; for (let a = 0; a <= TAU + .01; a += .35) pts.push([cx + 300 + Math.sin(a) * r * (i % 2 ? -1 : 1) - 40 + (i % 4) * 14, cy + (1 - Math.cos(a)) * 26 - i * 22]); }
          tapeAlong(ctx, pts, L, t, null);
          if (busy) for (let k = 0; k < 4; k++){ const ph = ((t - t0) * 1.6 + k / 4) % 1, x = cx - 80 + (k % 2) * 60, y = calcTop - 40 - ph * 260;
            ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); textC(ctx, "+" + vals[(k + Math.floor((t - t0) * 1.6)) % vals.length], x, y, 40, ORANGE, 900, 0, CREAM); ctx.restore(); }
        } });
    } else {
      // tangle mode (imagination): loops around the hero, error mark, rewind into a small calculator
      const hero = (f.toons || [])[S.hero ?? 0] || { x: 540 }, hx = hero.x ?? 540, kx = 900, ky = 1180;
      const rq = t < tRew ? 0 : clamp((t - tRew) / .9, 0, 1), sc = 1 - eIn(rq);
      const loops = [[900, 300, 46, 1], [1060, 340, 52, -1], [1200, 290, 44, 1]];
      const loop = (half) => { loops.forEach(([y, rx, ry, d], j) => { if (sc <= .02) return; const cxl = lerp(hx, kx, eIn(rq)), cyl = lerp(y, ky, eIn(rq)), RX = rx * sc, RY = ry * sc;
        ctx.save(); ctx.beginPath(); const a0 = half ? 0 : Math.PI, a1 = half ? Math.PI : TAU; ctx.ellipse(cxl, cyl, RX, RY, Math.sin(t + j) * .06, a0, a1); ctx.strokeStyle = OUT; ctx.lineWidth = 50 * sc + 2; ctx.stroke(); ctx.strokeStyle = PAPER; ctx.lineWidth = 42 * sc; ctx.stroke();
        ctx.setLineDash([10, 24]); ctx.lineDashOffset = -t * 90 * d; ctx.strokeStyle = "#9C8C78"; ctx.lineWidth = 8 * sc; ctx.stroke(); ctx.setLineDash([]);
        if (half && j === 1 && t > tErr){ const q = popQ(t, tErr, .3); ctx.beginPath(); ctx.ellipse(cxl, cyl, RX, RY, 0, 1.2, 1.9); ctx.strokeStyle = hexA(RED, .9); ctx.lineWidth = 44 * sc * q; ctx.stroke(); }
        ctx.restore(); }); };
      base(ctx, s, t, { env: "info", envOpt: { spotX: hx }, spots: { err: [hx + 60, 1000, 1.15], calc: [kx - 140, 1000, 1.05] },
        back: () => {
          // ribbons of tape in the air
          if (sc > .02) for (let r = 0; r < 3; r++){ ctx.save(); ctx.globalAlpha = sc; ctx.beginPath(); for (let x = -200; x <= 1300; x += 40){ const y = 520 + r * 150 + Math.sin(x * .006 + t * 1.5 + r * 2) * 70; const xx = lerp(x, kx, eIn(rq)), yy = lerp(y, ky, eIn(rq)); x === -200 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); }
            ctx.strokeStyle = OUT; ctx.lineWidth = 46; ctx.stroke(); ctx.strokeStyle = PAPER; ctx.lineWidth = 38; ctx.stroke(); ctx.setLineDash([12, 22]); ctx.lineDashOffset = -t * 120; ctx.strokeStyle = "#9C8C78"; ctx.lineWidth = 7; ctx.stroke(); ctx.restore(); }
          loop(false);
          calc(ctx, kx, ky + 160, .55, t, t > tRew + .9 ? "0" : "1.237.500", false);
          if (rq > 0 && rq < 1){ ctx.save(); ctx.strokeStyle = hexA(CREAM, .8); ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 10; i++){ const a = i / 10 * TAU + t * 3, r0 = 80 + (1 - rq) * 300; ctx.beginPath(); ctx.moveTo(kx + Math.cos(a) * r0, ky + Math.sin(a) * r0); ctx.lineTo(kx + Math.cos(a) * (r0 + 90), ky + Math.sin(a) * (r0 + 90)); ctx.stroke(); } ctx.restore(); }
        },
        front: () => { loop(true); },
        over: () => { if (t > tErr && t < tRew + .2) stampBox(ctx, S.errText || "SALAH KETIK!", 540, 470, t - tErr, RED, 70, -.08); if (t > tRew + .3 && t < tRew + 2.0) stampBox(ctx, "ULANG DARI 0", 700, 640, t - tRew - .3, ORANGE, 54, .06); } });
    }
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.struk || {}; if (S.errCue) add(cueT(s, S.errCue, .3, i), "ping"); if (S.rewindCue){ add(cueT(s, S.rewindCue, .3, i), "whoosh"); add(cueT(s, S.rewindCue, .3, i) + .9, "pop"); }
    if (S.fastCue) add(cueT(s, S.fastCue, .3, i), "whoosh"); if ((S.mode || "desk") === "desk"){ const a = tOf(s, { cue: S.startCue, at: S.startAt ?? .1 }, .1, i); for (let k = 0; k < 5; k++) add(a + .3 + k * .9, "pop"); } });

  /* ================= rumus: three magic tools (=SUM vacuum, =AVERAGE rolling pin, =COUNT clicker) ================= */
  const RCOL = { SUM: "#D9732B", AVERAGE: "#2F8F8A", COUNT: "#7A5BB5" };
  // x, y = centre of the tool; o: {rot, act (0..1 working), n (count shown), face (-1 = nozzle left)}
  function tool(ctx, kind, x, y, t, o){
    o = o || {}; const col = RCOL[kind] || ORANGE, act = o.act || 0;
    ctx.save(); ctx.translate(x + (kind === "SUM" ? Math.sin(t * 60) * 3 * act : 0), y); ctx.rotate(o.rot || 0);
    if (kind === "SUM"){ const d = o.face || -1;
      ctx.save(); ctx.scale(d < 0 ? 1 : -1, 1);
      ctx.beginPath(); ctx.moveTo(-60, -34); ctx.lineTo(-150, -64); ctx.lineTo(-150, 30); ctx.lineTo(-60, 22); ctx.closePath(); ctx.fillStyle = "#8C949E"; ctx.fill(); ol(ctx, 6);
      ctx.beginPath(); ctx.ellipse(-150, -17, 16, 47, 0, 0, TAU); ctx.fillStyle = "#2B2E33"; ctx.fill(); ol(ctx, 4);
      rr(ctx, -70, -70, 190, 110, 50); ctx.fillStyle = col; ctx.fill(); ol(ctx, 7); rr(ctx, -40, -56, 120, 18, 9); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fill();
      ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(40, -66); ctx.quadraticCurveTo(90, -140, 130, -40); ctx.stroke(); ctx.strokeStyle = "#3B4048"; ctx.lineWidth = 12; ctx.stroke();
      ctx.beginPath(); ctx.arc(70, -14, 22, 0, TAU); ctx.fillStyle = act > 0 ? (Math.floor(t * 8) % 2 ? GOLD : "#FFFFFF") : "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      if (act > 0){ ctx.strokeStyle = hexA(CREAM, .8 * act); ctx.lineWidth = 6; for (let i = 0; i < 4; i++){ const q = (t * 3 + i / 4) % 1, r = 160 + (1 - q) * 160; ctx.beginPath(); ctx.moveTo(-150 - r, -17 + (i - 1.5) * 40 * (1 - q)); ctx.lineTo(-150 - r + 60, -17 + (i - 1.5) * 30 * (1 - q)); ctx.stroke(); } }
      ctx.restore(); }
    else if (kind === "AVERAGE"){ const sp = o.spin || 0;
      [-1, 1].forEach(d => { rr(ctx, d > 0 ? 110 : -170, -18, 60, 36, 16); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); });
      rr(ctx, -125, -42, 250, 84, 30); const g = ctx.createLinearGradient(0, -42, 0, 42); g.addColorStop(0, "#F2C98E"); g.addColorStop(.5, "#E0A660"); g.addColorStop(1, "#B97A3C"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
      ctx.save(); rr(ctx, -125, -42, 250, 84, 30); ctx.clip(); ctx.strokeStyle = "rgba(142,78,46,.5)"; ctx.lineWidth = 4; for (let i = 0; i < 6; i++){ const xx = ((i * 50 + sp * 80) % 300) - 150; ctx.beginPath(); ctx.moveTo(xx, -40); ctx.quadraticCurveTo(xx + 14, 0, xx, 40); ctx.stroke(); } ctx.restore(); }
    else { // COUNT clicker
      ctx.strokeStyle = "#8C949E"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 96, 40, 0, TAU); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 96, 47, 0, TAU); ctx.stroke();
      const press = o.press || 0; rr(ctx, -22, -104 + press * 14, 44, 40, 10); ctx.fillStyle = "#B8C0C8"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.arc(0, 0, 82, 0, TAU); const g = ctx.createRadialGradient(-26, -30, 10, 0, 0, 82); g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, "#8C949E"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
      ctx.beginPath(); ctx.arc(0, 0, 66, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4);
      rr(ctx, -54, -24, 108, 48, 8); ctx.fillStyle = "#1E1A18"; ctx.fill(); const digits = String(o.n || 0).padStart(4, "0"); font(ctx, 800, 38, "monospace"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(digits, 0, 13); ctx.textAlign = "left"; }
    ctx.restore();
    if (o.tag !== false){ const ty = y - (kind === "COUNT" ? 150 : kind === "SUM" ? 120 : 90); pill(ctx, "=" + kind, x, ty, o.tagQ ?? 1, col, "#FFFFFF", 34); }
  }
  TT.scene(PX + "rumus", "Cerita: tiga alat rumus (=SUM penyedot, =AVERAGE penggilas, =COUNT penghitung)", (ctx, th, s, t) => {
    const f = s.f || {}, Rm = Object.assign({ mode: "intro", names: ["SUM", "AVERAGE", "COUNT"] }, f.rumus || {});
    const TS = (Rm.items || []).map((it, j) => tOf(s, it, .2 + j * .25));
    if (Rm.mode === "intro"){
      const lx = 540, ly = GROUND - 290 - 90, slots = [[290, 760], [540, 690], [790, 760]];
      base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 990 }, spots: { tools: [540, 860, 1.05] },
        back: () => { prop(ctx, "desk", 540, GROUND, { laptop: true, lx: 0, mug: true }, t);
          const g0 = Math.min(...TS, 1e9); if (t > g0 - .3) glowAt(ctx, lx, ly, 360, "#BFE2EA", .5 + .2 * Math.sin(t * 6)); },
        mid: () => { (Rm.items || []).forEach((it, j) => { const k = t - TS[j]; if (k < 0) return; const [tx, ty] = it.slot || slots[j]; let x, y, rot = 0;
          if (k < .6){ const q = k / .6; x = lerp(lx, tx, q); y = lerp(ly, ty, q) - Math.sin(q * Math.PI) * 300; rot = (1 - eOut(q)) * (j - 1 || 1) * 4; }
          else { x = tx; y = ty + Math.sin(t * 2.2 + j * 1.3) * 14; rot = Math.sin(t * 1.6 + j) * .08 + (k < 1.2 ? Math.sin((k - .6) * 20) * .2 * (1.2 - k) : 0); }
          const nm = it.name || Rm.names[j]; glowAt(ctx, x, y, 200, GOLD, k > .6 ? .25 + .1 * Math.sin(t * 4 + j) : 0);
          tool(ctx, nm, x, y, t, { rot, n: Math.floor(t * 3) % 10, spin: t, press: nm === "COUNT" ? Math.abs(Math.sin(t * 4)) : 0, act: nm === "SUM" ? .3 : 0, tagQ: popQ(t, TS[j] + .5, .35) });
          if (k > .6 && k < 1.5) burstFx(ctx, tx, ty, k - .6, GOLD, 10, 170); }); } });
    } else {
      // inside the spreadsheet: data column, formula bar, tools working
      const vals = Rm.vals || [150, 320, 210, 180, 250, 140], n = vals.length, cx0 = 100, cw = 300, cy0 = 590, ch = 92, colX = cx0 + cw;
      const mx = Math.max(...vals), avg = vals.reduce((a, b) => a + b, 0) / n;
      const res = Rm.results || [String(vals.reduce((a, b) => a + b, 0)), avg.toFixed(1).replace(".", ","), String(n)];
      const park = (j) => [680, 690 + j * 240];
      const act = j => t - TS[j];
      let cur = -1; TS.forEach((x, j) => { if (t >= x) cur = j; });
      const tDone = T(s, Rm.doneCue, .5);
      const lev = i => cur < 1 ? 0 : (cur > 1 ? 1 : eOut(clamp((act(1) - .75 - i * .2) / .25, 0, 1)));
      base(ctx, s, t, { env: "info", envOpt: { spotX: 760 }, spots: { col: [400, 900, 1.05], bar: [540, 700, 1] },
        back: () => {
          ctx.save(); ctx.strokeStyle = hexA("#5D7BB0", .35); ctx.lineWidth = 2; for (let x = -200; x < 1300; x += 92){ ctx.beginPath(); ctx.moveTo(x, 420); ctx.lineTo(x, 1700); ctx.stroke(); } for (let y = 420; y < 1700; y += 92){ ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(1300, y); ctx.stroke(); } ctx.restore();
          rr(ctx, cx0, cy0 - ch - 6, cw, ch, 12); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); textC(ctx, Rm.head || "PENJUALAN", cx0 + cw / 2, cy0 - ch / 2 + 6, 38, CREAM, 900, cw - 30);
          vals.forEach((v, i) => { const y = cy0 + i * ch; let glow = 0;
            if (cur === 0){ const k = act(0) - .7 - i * .12; if (k > 0 && k < .6) glow = 1 - k / .6; }
            rr(ctx, cx0, y, cw, ch - 8, 10); ctx.fillStyle = glow > 0 ? mixHex("#1E3358", GOLD, glow * .6) : "#1E3358"; ctx.fill(); ctx.strokeStyle = "#5D7BB0"; ctx.lineWidth = 3; ctx.stroke();
            const bv = lerp(v / mx, avg / mx, lev(i));
            rr(ctx, cx0 + 16, y + 20, 120 * bv, ch - 48, 6); ctx.fillStyle = lev(i) > .5 ? "#5FC4BC" : hexA(HL, .85); ctx.fill();
            font(ctx, 800, 44, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "right"; ctx.fillText(String(v), cx0 + cw - 20, y + 58); ctx.textAlign = "left";
            if (cur >= 2){ const k = act(2) - .7 - i * .2; if (k > 0){ const q = popQ(k, 0, .3); ctx.save(); ctx.translate(colX + 40, y + 42); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fillStyle = RCOL.COUNT; ctx.fill(); ol(ctx, 4); textC(ctx, String(i + 1), 0, 13, 34, "#FFFFFF", 900); ctx.restore(); } } });
          if (cur >= 1 && act(1) > .7){ const q = clamp((act(1) - .7) / .8, 0, 1), xx = cx0 + 16 + 120 * avg / mx; ctx.save(); ctx.globalAlpha = q; ctx.setLineDash([14, 10]); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(xx, cy0 - 10); ctx.lineTo(xx, cy0 + n * ch); ctx.stroke(); ctx.restore(); }
        },
        mid: () => {
          (Rm.items || []).forEach((it, j) => { const nm = it.name || Rm.names[j], [px, py] = park(j), k = act(j);
            let wx = colX + 230, wy = cy0 + 200; if (nm === "AVERAGE"){ wx = cx0 + 90; wy = cy0 + 10 + clamp((k - .5) / 1.4, 0, 1) * (n * ch - 40); } if (nm === "COUNT"){ wx = colX + 200; wy = cy0 + 300; }
            let x = px, y = py + Math.sin(t * 2.2 + j) * 10, rot = Math.sin(t * 1.5 + j) * .05, a = 0;
            if (k >= 0 && k < .5){ const q = k / .5, sx = nm === "AVERAGE" ? cx0 + 90 : wx, sy = nm === "AVERAGE" ? cy0 + 10 : wy; x = lerp(px, sx, q); y = lerp(py, sy, q) - Math.sin(q * Math.PI) * 220; rot = q * TAU * (nm === "AVERAGE" ? 0 : 1); }
            else if (k >= .5 && k < 2.1){ x = wx; y = wy; a = 1; rot = nm === "AVERAGE" ? 0 : Math.sin(t * 9) * .04; }
            else if (k >= 2.1 && k < 2.6){ const q = (k - 2.1) / .5; x = lerp(wx, px, q); y = lerp(wy, py, q) - Math.sin(q * Math.PI) * 200; }
            if (nm === "SUM" && k > .55 && k < 1.9) vals.forEach((v, i) => { const kk = (k - .6 - i * .12) / .5; if (kk < 0 || kk > 1) return; const sx = cx0 + cw - 60, sy = cy0 + i * ch + 42;
              ctx.save(); ctx.globalAlpha = 1 - kk * .6; textC(ctx, String(v), lerp(sx, x - 150, eIn(kk)), lerp(sy, y - 17, eIn(kk)) + 16, 44 * (1 - kk * .5), GOLD, 900, 0, OUT); ctx.restore(); });
            const clicks = nm === "COUNT" ? (k < .5 ? 0 : clamp(Math.floor((k - .7) / .2) + 1, 0, n)) : 0, press = nm === "COUNT" && k > .5 && k < 2 ? Math.max(0, Math.sin(((k - .7) / .2) * Math.PI)) : 0;
            tool(ctx, nm, x, y, t, { rot, act: a, spin: nm === "AVERAGE" && a ? (k - .5) * 4 : 0, n: k >= 2 ? n : clicks, press, face: -1 });
            if (k > 2.4){ const q = popQ(t, TS[j] + 2.4, .35), glow = t > tDone ? .5 + .5 * Math.sin(t * 8 + j) : 0; if (glow) glowAt(ctx, px + 200, py, 150, GOLD, .45 * glow);
              
              pill(ctx, res[j], px + 205, py + (nm === "COUNT" ? 0 : 10), q, "#FFFFFF", RCOL[nm], 44); }
          });
        },
        over: () => {
          const y0 = 210, h = 104; rr(ctx, 90, y0, 900, h, 22); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6, "#2E4670");
          rr(ctx, 104, y0 + 14, 110, h - 28, 14); ctx.fillStyle = ORANGE; ctx.fill(); textC(ctx, "fx", 159, y0 + 70, 46, "#FFFFFF", 900);
          if (cur >= 0){ const nm = (Rm.items[cur].name || Rm.names[cur]), fm = Rm.items[cur].formula || ("=" + nm + "(B2:B" + (n + 1) + ")"), k = t - TS[cur], nC = Math.floor(clamp(k / .5, 0, 1) * fm.length);
            fit(ctx, fm, 720, 58, 800); ctx.fillStyle = RCOL[nm] || BROWN; ctx.fillText(fm.slice(0, nC), 240, y0 + 74); if (Math.floor(t * 3) % 2){ const w = ctx.measureText(fm.slice(0, nC)).width; ctx.fillStyle = BROWN; ctx.fillRect(244 + w, y0 + 24, 5, 58); } }
          else { font(ctx, 600, 44, FAM); ctx.fillStyle = "#9AA6B8"; ctx.fillText("ketik rumus...", 240, y0 + 72); }
          if (t > tDone) stampBox(ctx, Rm.doneText || "BERES!", 560, 420, t - tDone, ORANGE, 62, -.06);
        } });
    }
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rm = f.rumus || {}; (Rm.items || []).forEach((it, j) => { const a = tOf(s, it, .2 + j * .25, i); add(a, (Rm.mode || "intro") === "intro" ? "pop" : "whoosh"); if (Rm.mode === "aksi"){ add(a + .6, "pop"); add(a + 2.4, "chime"); } }); if (Rm.doneCue) add(cueT(s, Rm.doneCue, .5, i), "chime"); });

  /* ================= toko: bakery freezes / melts ================= */
  function loaf(ctx, x, y, kind, j){
    ctx.save(); ctx.translate(x, y);
    if (kind === 0){ ctx.beginPath(); ctx.ellipse(0, -34, 62, 36, 0, Math.PI, TAU); ctx.lineTo(62, 0); ctx.lineTo(-62, 0); ctx.closePath(); ctx.fillStyle = "#C98A4B"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#8E5A2E"; ctx.lineWidth = 5; for (let i = -1; i <= 1; i++){ ctx.beginPath(); ctx.moveTo(i * 26 - 10, -50); ctx.lineTo(i * 26 + 10, -30); ctx.stroke(); } }
    else if (kind === 1){ ctx.beginPath(); ctx.moveTo(-60, -6); ctx.quadraticCurveTo(0, -80, 60, -6); ctx.quadraticCurveTo(0, -30, -60, -6); ctx.fillStyle = "#E0A24F"; ctx.fill(); ol(ctx, 5); }
    else { [-34, 0, 34].forEach((dx, i) => { ctx.beginPath(); ctx.arc(dx, -28 - (i === 1 ? 8 : 0), 28, 0, TAU); ctx.fillStyle = i === 1 ? "#D9A066" : "#C98A4B"; ctx.fill(); ol(ctx, 4); }); }
    ctx.restore();
  }
  function icicles(ctx, x0, x1, y, len, t){ if (len <= 1) return; ctx.save(); ctx.fillStyle = "rgba(220,240,255,.92)"; ctx.strokeStyle = "rgba(120,170,210,.9)"; ctx.lineWidth = 3;
    for (let x = x0 + 10; x < x1 - 10; x += 34){ const l = len * (.5 + rnd(x) * .7); ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x, y + l); ctx.lineTo(x + 12, y); ctx.closePath(); ctx.fill(); ctx.stroke(); } ctx.restore(); }
  TT.scene(PX + "toko", "Cerita: toko roti membeku / mencair", (ctx, th, s, t) => {
    const f = s.f || {}, K = Object.assign({ mode: "beku", door: true }, f.toko || {});
    const tF = T(s, K.freezeCue, .5), tW = T(s, K.warmCue, .5), tFl = T(s, K.flowerCue, .7), tBell = tOf(s, K.bell, .1);
    let fr = K.mode === "beku" ? eOut(clamp((t - tF) / 1.6, 0, 1)) : (K.frost0 ?? .8) * (1 - eOut(clamp((t - tW) / 1.8, 0, 1)));
    const warm = K.mode === "cair" ? clamp((t - tW) / 1.2, 0, 1) : 0;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false }, envFront: false,
      spots: { kasir: [340, 980, 1.2], pintu: [660, 980, 1.02] },
      back: () => {
        ctx.fillStyle = "#F3D7B4"; ctx.fillRect(-700, -200, 2500, GROUND + 200); ctx.fillStyle = "#E5BF92"; ctx.fillRect(-700, 1180, 2500, GROUND - 1180);
        ctx.fillStyle = "#C98A5A"; ctx.fillRect(-700, 1170, 2500, 14);
        ctx.fillStyle = "#D9B48C"; for (let x = -700; x < 1800; x += 120) for (let y = GROUND; y < 2100; y += 60) if (((x / 120 | 0) + (y / 60 | 0)) % 2) ctx.fillRect(x, y, 120, 60);
        // sign
        const sw = Math.sin(t * 1.3) * .02; ctx.save(); ctx.translate(430, 330); ctx.rotate(sw); ctx.strokeStyle = BROWN; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-200, -120); ctx.lineTo(-200, -40); ctx.moveTo(200, -120); ctx.lineTo(200, -40); ctx.stroke();
        rr(ctx, -270, -50, 540, 120, 24); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); textC(ctx, K.sign || "TOKO ROTI", 0, 34, 66, CREAM, 900, 480); icicles(ctx, -260, 260, 68, fr * 70, t); ctx.restore();
        // shelves
        [[60, 620, 820], [60, 620, 1040]].forEach(([x0, x1, y], r) => { ctx.fillStyle = "#A9643B"; rr(ctx, x0, y, x1 - x0, 22, 6); ctx.fill(); ol(ctx, 4);
          for (let i = 0; i < 4; i++) loaf(ctx, x0 + 75 + i * 135, y, (i + r) % 3, i);
          icicles(ctx, x0, x1, y + 22, fr * 60, t); });
        // door
        if (K.door){ const dx = 820; rr(ctx, dx, 720, 240, GROUND - 720, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); rr(ctx, dx + 30, 760, 180, 360, 8); ctx.fillStyle = "#CFE7EE"; ctx.fill(); ol(ctx, 4);
          ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.beginPath(); ctx.moveTo(dx + 60, 780); ctx.lineTo(dx + 110, 780); ctx.lineTo(dx + 60, 900); ctx.closePath(); ctx.fill();
          const bk = t - tBell, bs = bk >= 0 && bk < 1.5 ? Math.sin(bk * 18) * .5 * (1 - bk / 1.5) : 0; ctx.save(); ctx.translate(dx + 120, 690); ctx.rotate(bs); ctx.strokeStyle = BROWN; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 0); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-26, 50); ctx.quadraticCurveTo(-24, 0, 0, 0); ctx.quadraticCurveTo(24, 0, 26, 50); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.restore();
          if (bk >= 0 && bk < 1){ ctx.save(); ctx.globalAlpha = 1 - bk; ctx.strokeStyle = GOLD; ctx.lineWidth = 6; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(dx + 120, 720, 50 + bk * 60, d > 0 ? -.6 : Math.PI - .6, d > 0 ? .6 : Math.PI + .6); ctx.stroke(); }); ctx.restore(); } }
        if (warm > 0) glowAt(ctx, 330, 950, 700, "#FFD27A", .35 * warm);
      },
      midZ: .5,
      mid: () => {
        // glass counter
        const x0 = 20, x1 = 640, y = 1260; rr(ctx, x0, y, x1 - x0, GROUND - y + 10, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6);
        rr(ctx, x0 + 24, y + 24, x1 - x0 - 48, 230, 8); ctx.fillStyle = "#D8EEF2"; ctx.fill(); ol(ctx, 4);
        for (let i = 0; i < 4; i++){ const cx = x0 + 100 + i * 140; ctx.fillStyle = ["#F7B7A3", "#FFF4E6", "#8E4E2E", "#F6D36B"][i]; rr(ctx, cx - 50, y + 150, 100, 80, 14); ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(cx, y + 142, 10, 0, TAU); ctx.fill(); }
        ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.beginPath(); ctx.moveTo(x0 + 60, y + 30); ctx.lineTo(x0 + 140, y + 30); ctx.lineTo(x0 + 80, y + 250); ctx.lineTo(x0 + 30, y + 250); ctx.closePath(); ctx.fill();
        rr(ctx, x0 - 10, y - 18, x1 - x0 + 20, 30, 8); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5);
        // register
        ctx.save(); ctx.translate(520, y - 18); rr(ctx, -70, -110, 140, 110, 12); ctx.fillStyle = "#544E42"; ctx.fill(); ol(ctx, 5); rr(ctx, -52, -96, 104, 40, 6); ctx.fillStyle = "#B9C9A8"; ctx.fill(); ctx.restore();
        icicles(ctx, x0 - 10, x1 + 10, y + 12, fr * 90, t);
        // flowers
        if (t > tFl){ [140, 250, 360].forEach((fx, i) => { const q = popQ(t, tFl + i * .18, .45); if (q <= 0) return; ctx.save(); ctx.translate(fx, y - 18); ctx.scale(q, q); ctx.strokeStyle = GREEN; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(Math.sin(t * 2 + i) * 10, -50, 0, -90); ctx.stroke();
          for (let p = 0; p < 5; p++){ const a = p / 5 * TAU + t * .5; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 18, -90 + Math.sin(a) * 18, 16, 10, a, 0, TAU); ctx.fillStyle = [RED, GOLD, "#F7B7A3"][i]; ctx.fill(); }
          ctx.beginPath(); ctx.arc(0, -90, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore(); }); }
      },
      front: (ctx2, c, sts) => {
        // breath puffs from a cold customer
        if (fr > .3 && K.breath != null && sts[K.breath]){ const st = sts[K.breath], h = toonHead(st); for (let i = 0; i < 2; i++){ const q = ((t * .8 + i * .5) % 1); ctx.save(); ctx.globalAlpha = fr * .7 * Math.sin(q * Math.PI); ctx.fillStyle = "#FFFFFF";
          ctx.beginPath(); ctx.arc(h[0] + (st.face || 1) * (st.size * .16 + q * 90), h[1] + st.size * .06 - q * 40, 22 + q * 30, 0, TAU); ctx.fill(); ctx.restore(); } }
        // melting drips
        if (K.mode === "cair" && t > tW && fr > .02) for (let i = 0; i < 14; i++){ const x = 60 + rnd(i) * 600, y0 = [840, 1060, 1290][i % 3], q = ((t - tW) * 1.3 + rnd(i + 5)) % 1; ctx.fillStyle = "rgba(160,210,240,.85)"; ctx.beginPath(); ctx.arc(x, y0 + q * 260, 7, 0, TAU); ctx.fill(); }
        if (warm > 0 && K.hearts != null && sts[K.hearts]){ const h = toonHead(sts[K.hearts]); for (let i = 0; i < 4; i++){ const q = ((t * .5 + i / 4) % 1); ctx.save(); ctx.globalAlpha = warm * Math.sin(q * Math.PI); ctx.translate(h[0] - 120 + i * 80, h[1] - 200 - q * 200); ctx.scale(.9, .9); ctx.fillStyle = RED;
          ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-30, -10, -16, -36, 0, -18); ctx.bezierCurveTo(16, -36, 30, -10, 0, 12); ctx.fill(); ctx.restore(); } }
      },
      post: () => {
        if (fr <= .01) return;
        ctx.save(); ctx.globalAlpha = .5 * fr; ctx.fillStyle = "#8FC8FF"; ctx.globalCompositeOperation = "soft-light"; ctx.fillRect(0, 0, 1080, 1920); ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = .16 * fr; ctx.fillStyle = "#BFE0FF"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
        ctx.save(); const g = ctx.createRadialGradient(540, 960, 300, 540, 960, 1050); g.addColorStop(0, "rgba(230,245,255,0)"); g.addColorStop(1, `rgba(230,245,255,${.85 * fr})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
        ctx.strokeStyle = `rgba(255,255,255,${.9 * fr})`; ctx.lineWidth = 6; ctx.lineCap = "round";
        [[0, 160, 1], [1080, 160, -1], [0, 1820, 1], [1080, 1820, -1]].forEach(([x, y, d], ci) => { for (let b = 0; b < 5; b++){ const a = (b / 4) * Math.PI / 2 * d + (ci > 1 ? -Math.PI / 2 * d : 0) * 0, L = 300 * fr * (.6 + rnd(b + ci) * .6);
          const ang = (ci < 2 ? Math.PI / 2 : -Math.PI / 2) + (d > 0 ? -1 : 1) * (ci < 2 ? -1 : 1) * (b / 4) * Math.PI / 2 * -1;
          const ex = x + Math.cos(ang) * L, ey = y + Math.sin(ang) * L; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); for (let s2 = 1; s2 < 3; s2++){ const px = lerp(x, ex, s2 / 3), py = lerp(y, ey, s2 / 3); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang + .6) * 40 * fr, py + Math.sin(ang + .6) * 40 * fr); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang - .6) * 40 * fr, py + Math.sin(ang - .6) * 40 * fr); } ctx.stroke(); } });
        for (let i = 0; i < 40; i++){ const x = (rnd(i) * 1080 + Math.sin(t + i) * 40), y = ((rnd(i + 7) * 1920 + t * (60 + rnd(i) * 80)) % 1920); ctx.globalAlpha = fr * .9; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, 4 + rnd(i + 2) * 6, 0, TAU); ctx.fill(); }
        ctx.restore();
      },
      over: () => { if (K.mode === "beku" && t > tF + .3 && K.coldText) stampBox(ctx, K.coldText, 560, 560, t - tF - .3, "#3A78B5", 60, -.08);
        if (K.mode === "cair" && t > tW + .2 && K.warmText) stampBox(ctx, K.warmText, 560, 560, t - tW - .2, ORANGE, 60, .06); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.toko || {}; if (K.bell) add(tOf(s, K.bell, .1, i), "ping"); if (K.freezeCue){ add(cueT(s, K.freezeCue, .5, i), "whoosh"); if (K.coldText) add(cueT(s, K.freezeCue, .5, i) + .3, "pop"); }
    if (K.warmCue){ add(cueT(s, K.warmCue, .5, i), "chime"); if (K.warmText) add(cueT(s, K.warmCue, .5, i) + .2, "pop"); } if (K.flowerCue) [0, 1, 2].forEach(k => add(cueT(s, K.flowerCue, .7, i) + k * .18, "pop")); });

  /* ================= karpet: first seconds stage + welcome carpet ================= */
  TT.scene(PX + "karpet", "Cerita: detik pertama, senyum + salam, karpet sambutan", (ctx, th, s, t) => {
    const f = s.f || {}, Kp = Object.assign({ x0: 330, x1: 1250, y: 1640 }, f.karpet || {});
    const tC = T(s, Kp.countCue, .3), tS = T(s, Kp.smileCue, .4), tG = T(s, Kp.salamCue, .4), tR = T(s, Kp.rollCue, .3);
    const rq = clamp((t - tR) / 1.4, 0, 1), xr = lerp(Kp.x0, Kp.x1, eOut(rq));
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 }, spots: { badges: [540, 900, 1.05], carpet: [700, 1150, .95] },
      back: () => {
        if (rq > 0){ const y = Kp.y; ctx.save(); ctx.beginPath(); ctx.moveTo(Kp.x0 - 30, y - 50); ctx.lineTo(xr, y - 50); ctx.lineTo(xr + 40, y + 70); ctx.lineTo(Kp.x0 - 90, y + 70); ctx.closePath(); ctx.fillStyle = "#C8352E"; ctx.fill(); ol(ctx, 5);
          ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(Kp.x0 - 20, y - 38); ctx.lineTo(xr, y - 38); ctx.moveTo(Kp.x0 - 80, y + 58); ctx.lineTo(xr + 30, y + 58); ctx.stroke(); ctx.restore();
          const r = lerp(70, 26, rq); if (rq < 1){ ctx.save(); ctx.translate(xr + 10, y + 10 - r * .2); ctx.rotate(t * 8); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#A82A24"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.beginPath(); for (let a = 0; a < 10; a += .3) ctx.lineTo(Math.cos(a) * a / 10 * r, Math.sin(a) * a / 10 * r); ctx.stroke(); ctx.restore(); }
          for (let i = 0; i < 8; i++){ const x = Kp.x0 + (xr - Kp.x0) * rnd(i + 3), y2 = y - 70 - ((t * 60 + i * 40) % 200); ctx.save(); ctx.globalAlpha = .8 * rq; sparkle(ctx, x, y2, 14 + 6 * Math.sin(t * 6 + i), GOLD); ctx.restore(); }
          // spotlights
          ctx.save(); ctx.globalAlpha = .18 * rq; ctx.fillStyle = "#FFE9B0"; [-1, 1].forEach(d => { const sx = 540 + d * 420, tx = 700 + Math.sin(t * 1.2 + d) * 160; ctx.beginPath(); ctx.moveTo(sx - 20, 300); ctx.lineTo(sx + 20, 300); ctx.lineTo(tx + 160, y); ctx.lineTo(tx - 160, y); ctx.closePath(); ctx.fill(); }); ctx.restore(); }
      },
      over: () => {
        // beats 1-2-3
        const out = clamp((t - tS + .1) / .35, 0, 1);
        if (t > tC && out < 1){ ctx.save(); ctx.globalAlpha = 1 - out; textC(ctx, Kp.beatLabel || "DETIK PERTAMA", 540, 300, 44, CREAM, 900, 700, OUT);
          [0, 1, 2].forEach(i => { const q = popQ(t, tC + i * .5, .3), on = t > tC + i * .5 && t < tC + i * .5 + .5; if (q <= 0) return; ctx.save(); ctx.translate(320 + i * 220, 430); ctx.scale(q * (on ? 1.15 : 1), q * (on ? 1.15 : 1));
            ctx.beginPath(); ctx.arc(0, 0, 76, 0, TAU); ctx.fillStyle = on ? ORANGE : NAVY; ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 7; ctx.stroke(); textC(ctx, String(i + 1), 0, 30, 90, CREAM, 900); ctx.restore(); });
          ctx.restore(); }
        // smile badge
        const qs = popQ(t, tS, .45); if (qs > 0){ ctx.save(); ctx.translate(310, 430 + Math.sin(t * 2.2) * 8); ctx.scale(qs, qs); ctx.rotate(Math.sin(t * 1.7) * .08); glowAt(ctx, 0, 0, 200, GOLD, .35);
          ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 7); [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 38, -26, 13, 20, 0, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
          ctx.beginPath(); ctx.arc(0, 4, 62, .25, Math.PI - .25); ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.stroke(); textC(ctx, "SENYUM", 0, 170, 44, CREAM, 900, 0, OUT); ctx.restore(); }
        const qg = popQ(t, tG, .45); if (qg > 0){ ctx.save(); ctx.translate(770, 420 + Math.cos(t * 2) * 8); ctx.scale(qg, qg); ctx.rotate(.05);
          rr(ctx, -190, -90, 380, 160, 40); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 7); ctx.beginPath(); ctx.moveTo(-60, 68); ctx.lineTo(-100, 130); ctx.lineTo(0, 68); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 7); rr(ctx, -188, -88, 376, 156, 38); ctx.fill();
          textC(ctx, Kp.salamText || "Selamat pagi!", 20, 6, 50, BROWN, 900, 300); ctx.save(); ctx.translate(-150, -60); ctx.rotate(Math.sin(t * 10) * .4); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); ico(ctx, "heart", 0, 0, 36, "#FFFFFF", 2.6); ctx.restore();
          textC(ctx, "SALAM", 0, 150, 44, CREAM, 900, 0, OUT); ctx.restore(); }
        if (t > tR + .4 && Kp.rollText) stampBox(ctx, Kp.rollText, 540, 740, t - tR - .4, ORANGE, 56, -.05);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Kp = f.karpet || {}; if (Kp.countCue){ const a = cueT(s, Kp.countCue, .3, i); [0, 1, 2].forEach(k => add(a + k * .5, "ping")); } if (Kp.smileCue) add(cueT(s, Kp.smileCue, .4, i), "chime"); if (Kp.salamCue) add(cueT(s, Kp.salamCue, .4, i), "pop"); if (Kp.rollCue){ add(cueT(s, Kp.rollCue, .3, i), "whoosh"); if (Kp.rollText) add(cueT(s, Kp.rollCue, .3, i) + .4, "chime"); } });

  /* ================= jemuran: salary clothesline ================= */
  function hangItem(ctx, it, x, y, t, j){
    // x, y = pin point on the rope
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2.1 + j) * .05 + (it.rot || 0)); ctx.scale(it.s || 1, it.s || 1);
    const pins = (dx) => dx.forEach(d => { rr(ctx, d - 9, -22, 18, 44, 5); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 4); });
    const k = it.kind;
    if (k === "motor"){ ctx.translate(0, 10); ctx.fillStyle = it.col || RED; ctx.beginPath(); ctx.moveTo(-120, 70); ctx.quadraticCurveTo(-130, 10, -60, 10); ctx.lineTo(40, 10); ctx.lineTo(70, -10); ctx.lineTo(90, 0); ctx.lineTo(70, 90); ctx.lineTo(-100, 110); ctx.closePath(); ctx.fill(); ol(ctx, 6);
      rr(ctx, -110, -6, 120, 26, 12); ctx.fillStyle = OUT; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(70, -10); ctx.lineTo(95, -60); ctx.lineTo(125, -60); ctx.stroke();
      [[-80, 120], [90, 120]].forEach(([wx, wy]) => { ctx.beginPath(); ctx.arc(wx, wy, 42, 0, TAU); ctx.fillStyle = "#2B2E33"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(wx, wy, 16, 0, TAU); ctx.fillStyle = "#B8C0C8"; ctx.fill(); });
      ctx.translate(0, -10); pins([-60, 0]); }
    else if (k === "ponsel"){ rr(ctx, -62, 0, 124, 220, 22); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6); rr(ctx, -50, 14, 100, 180, 12); ctx.fillStyle = "#BFE2EA"; ctx.fill();
      ctx.fillStyle = hexA(ORANGE, .8); for (let i = 0; i < 4; i++) ctx.fillRect(-36, 34 + i * 34, 56 + (i * 23 % 20), 14); pins([0]); }
    else if (k === "kulkas"){ rr(ctx, -105, 0, 210, 330, 18); ctx.fillStyle = it.col || "#E9EEF2"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 330); ctx.stroke();
      ctx.fillStyle = "#9AA3AD"; rr(ctx, -24, 120, 10, 70, 5); ctx.fill(); rr(ctx, 14, 120, 10, 70, 5); ctx.fill(); pins([-60, 60]); }
    else { // baju / handuk with label
      const w = it.w || 190, h = it.h || 170, col = it.col || TEAL; ctx.beginPath();
      if (k === "baju"){ ctx.moveTo(-w * .3, 0); ctx.lineTo(-w / 2, 20); ctx.lineTo(-w / 2 - 20, 70); ctx.lineTo(-w * .33, 80); ctx.lineTo(-w * .33, h); ctx.lineTo(w * .33, h); ctx.lineTo(w * .33, 80); ctx.lineTo(w / 2 + 20, 70); ctx.lineTo(w / 2, 20); ctx.lineTo(w * .3, 0); ctx.quadraticCurveTo(0, 36, -w * .3, 0); }
      else { ctx.rect(-w / 2, 0, w, h); }
      ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
      if (k !== "baju"){ ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(-w / 2 + 4, h - 34, w - 8, 12); ctx.fillRect(-w / 2 + 4, 20, w - 8, 10); }
      if (it.label){ const L = String(it.label).toUpperCase().split("\n"); let sz = 34; L.forEach(l => sz = Math.min(sz, fit(ctx, l, w * (k === "baju" ? .62 : .86), 34, 900, 16))); font(ctx, 900, sz, FAM); ctx.textAlign = "center"; ctx.fillStyle = "#FFFFFF";
        L.forEach((l, i) => ctx.fillText(l, 0, h * .58 + (i - (L.length - 1) / 2) * sz * 1.1 + sz * .35)); ctx.textAlign = "left"; }
      pins(k === "baju" ? [-w * .3, w * .3] : [-w * .35, w * .35]); }
    ctx.restore();
  }
  TT.scene(PX + "jemuran", "Cerita: tali jemuran gaji (cicilan digantung, melendut, putus / sehat 30-70)", (ctx, th, s, t) => {
    const f = s.f || {}, J = Object.assign({ x0: 90, x1: 1000, y: 650, items: [], tags: [], base: 24 }, f.jemur || {});
    const its = J.items.map((it, j) => Object.assign({ T: it.cue || it.at != null ? tOf(s, it, .3 + j * .1) : -1, j }, it));
    const tSnap = T(s, J.snapCue, .5), tTag = J.tags.map((g, j) => tOf(s, g, .3 + j * .1));
    let sag = J.base, wob = 0; its.forEach(it => { const k = t - it.T; if (k < 0) return; const w = it.weight ?? 60; sag += w * eOut(clamp((k - .3) / .4, 0, 1)); if (k > .3) wob += w * .6 * Math.exp(-(k - .3) * 3) * Math.sin((k - .3) * 12); });
    sag += wob + (J.mode === "sehat" ? Math.sin(t * 1.4) * 5 : Math.sin(t * 2) * 3);
    const strain = clamp((sag - 120) / 160, 0, 1);
    const ropeY = x => { const u = clamp((x - J.x0) / (J.x1 - J.x0), 0, 1); return J.y + sag * 4 * u * (1 - u); };
    const ks = t - tSnap, snapped = ks >= 0;
    base(ctx, s, t, { env: J.env || "street", spots: { rope: [560, J.y + 200, 1.02], tag: [200, J.y + 120, 1.2] },
      back: () => {
        // poles
        const tilt = J.mode === "sehat" ? 0 : strain * .06 + (snapped ? .02 : 0);
        [[J.x0, 1], [J.x1, -1]].forEach(([x, d]) => { ctx.save(); ctx.translate(x, GROUND); ctx.rotate(d * tilt); rr(ctx, -14, J.y - GROUND - (J.sign ? 230 : 40), 28, GROUND - J.y + (J.sign ? 230 : 40), 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5);
          rr(ctx, -50, J.y - GROUND - 46, 100, 20, 8); ctx.fill(); ol(ctx, 4); ctx.restore(); });
        if (strain > .5 && !snapped && J.mode !== "sehat"){ ctx.save(); ctx.globalAlpha = (strain - .5) * 2; [J.x0, J.x1].forEach((x, i) => { ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const a = -1.2 + k * .5 + (i ? Math.PI * .3 : 0); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 50, J.y - 40 + Math.sin(a) * 50); ctx.lineTo(x + Math.cos(a) * 80, J.y - 40 + Math.sin(a) * 80); ctx.stroke(); } }); ctx.restore(); }
        // banner above the rope
        if (J.sign){ const by = J.y - 190, sw = Math.sin(t * 1.4) * 6; ctx.strokeStyle = BROWN; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(J.x0, by - 20); ctx.quadraticCurveTo((J.x0 + J.x1) / 2, by + 10, J.x1, by - 20); ctx.stroke();
          const sz = fit(ctx, J.sign, 520, 56, 900); const w = ctx.measureText(J.sign).width + 80, cx = (J.x0 + J.x1) / 2;
          ctx.save(); ctx.translate(cx, by + sw * .3); ctx.beginPath(); ctx.moveTo(-w / 2, -10); ctx.lineTo(w / 2, -10); ctx.lineTo(w / 2 - 10, 80 + sw); ctx.lineTo(-w / 2 + 10, 80 - sw); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(J.sign, 0, 35 + sz * .36); ctx.textAlign = "left"; ctx.restore(); }
      },
      mid: () => {
        // rope
        const seg = (xa, xb, col, lw) => { ctx.beginPath(); for (let x = xa; x <= xb + .1; x += 20) x === xa ? ctx.moveTo(x, ropeY(x)) : ctx.lineTo(x, ropeY(x)); ctx.strokeStyle = OUT; ctx.lineWidth = lw + 6; ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); };
        if (!snapped){
          if (J.split){ const xm = lerp(J.x0, J.x1, J.split); seg(J.x0, xm, ORANGE, 12); seg(xm, J.x1, TEAL, 12);
            const q = popQ(t, tOf(s, { cue: J.splitCue, at: J.splitCue ? null : .2 }, .3), .4); if (q > 0){ ctx.save(); ctx.translate(xm, ropeY(xm)); ctx.scale(q, q); ctx.strokeStyle = BROWN; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -110); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(130, -85 + Math.sin(t * 4) * 6); ctx.lineTo(0, -55); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, J.splitLabel || "30%", 48, -72, 30, "#FFFFFF", 900, 90); ctx.restore(); } }
          else seg(J.x0, J.x1, strain > .4 ? mixHex(CREAM, RED, (strain - .4) * 1.2) : CREAM, 10);
          if (strain > .6 && J.mode !== "sehat"){ const xm = (J.x0 + J.x1) / 2 + 40; ctx.save(); ctx.globalAlpha = (strain - .6) * 2.5; for (let i = 0; i < 5; i++){ const a = i * 1.3 + t * 2; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xm, ropeY(xm)); ctx.lineTo(xm + Math.cos(a) * 22, ropeY(xm) + Math.sin(a) * 22); ctx.stroke(); } ctx.restore(); }
        } else {
          const xm = (J.x0 + J.x1) / 2 + 40, q = eOut(clamp(ks / .6, 0, 1));
          [[J.x0, -1], [J.x1, 1]].forEach(([xa, d]) => { ctx.beginPath(); ctx.moveTo(xa, J.y); const L = Math.abs(xm - xa), ex = lerp(xm, xa + d * 20, q), ey = lerp(ropeY(xm), J.y + L * .95, q); ctx.quadraticCurveTo(lerp((xa + xm) / 2, xa, q), lerp(J.y + sag, J.y + L * .5, q), ex, ey); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = CREAM; ctx.lineWidth = 10; ctx.stroke(); });
          if (ks < .9) burstFx(ctx, xm, ropeY(xm), ks, RED, 10, 160); }
        // items
        its.forEach(it => { const k = t - it.T; if (k < 0) return; const x = it.x; let y = ropeY(x);
          if (k < .35) y -= (1 - eIn(k / .35)) * 900;
          let rot = 0;
          if (snapped){ const d = ks - it.j * .05; if (d > 0){ const g = Math.min(d, .55), yy = y + 1800 * g * g, floor = GROUND - (it.kind === "kulkas" ? 330 : it.kind === "motor" ? 170 : 200) * (it.s || 1); y = Math.min(yy, floor); rot = clamp(d * 2, 0, 1) * (it.j % 2 ? .3 : -.25); if (yy >= floor && d < 1.2) dust(ctx, x, GROUND, (d - .5) / .7, 7, 150); } }
          hangItem(ctx, Object.assign({}, it, { rot }), x, y, t, it.j);
          // tags
          J.tags.forEach((g, gj) => { if ((g.item ?? gj) !== it.j) return; const q = popQ(t, tTag[gj], .3); if (q <= 0) return; ctx.save(); ctx.translate(x + 10, y + (it.kind === "kulkas" ? 200 : it.kind === "motor" ? 80 : 120) * (it.s || 1)); ctx.scale(q * (2 - q), q * (2 - q)); ctx.rotate(-.12 + gj * .1);
            const sz = fit(ctx, g.text, 200, 30, 900); const w = ctx.measureText(g.text).width + 40; rr(ctx, -w / 2, -32, w, 64, 10); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(g.text, 0, sz * .36); ctx.textAlign = "left"; ctx.restore(); });
          if (k > .3 && k < 1.1 && !snapped) burstFx(ctx, x, y + 60, k - .3, HL, 8, 120); });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const J = f.jemur || {}; (J.items || []).forEach((it, j) => { if (it.cue || it.at != null) add(tOf(s, it, .3 + j * .1, i) + .3, "pop"); }); (J.tags || []).forEach((g, j) => add(tOf(s, g, .3 + j * .1, i), "ping")); if (J.snapCue){ add(cueT(s, J.snapCue, .5, i), "whoosh"); add(cueT(s, J.snapCue, .5, i) + .5, "pop"); } });

  /* ================= pulau: floating family islands ================= */
  function island(ctx, x, y, w, t, j, warm){
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(-w * .4, w * .35, -w * .1, w * .55); ctx.lineTo(0, w * .62); ctx.lineTo(w * .12, w * .5); ctx.quadraticCurveTo(w * .42, w * .32, w / 2, 0); ctx.closePath(); ctx.fillStyle = "#7A5236"; ctx.fill(); ol(ctx, 6);
    ctx.strokeStyle = "rgba(43,26,18,.35)"; ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-w * .36 + i * w * .1, w * .1 + i * 30); ctx.lineTo(w * .3 - i * w * .08, w * .14 + i * 34); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(0, 0, w / 2 + 6, 34, 0, 0, TAU); ctx.fillStyle = warm ? "#8CC56B" : "#5E9E58"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#4D8A48"; for (let i = 0; i < 6; i++){ const gx = -w * .42 + i * w * .17; ctx.beginPath(); ctx.moveTo(gx - 10, 22); ctx.lineTo(gx, 4 + Math.sin(t * 2 + i + j) * 3); ctx.lineTo(gx + 10, 22); ctx.fill(); }
    ctx.restore();
  }
  function furn(ctx, kind, x, y, s, t){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (kind === "bed"){ rr(ctx, -150, -110, 300, 90, 16); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); rr(ctx, -150, -180, 40, 170, 10); ctx.fill(); ol(ctx, 6); rr(ctx, -110, -150, 260, 60, 20); ctx.fillStyle = "#9FD3E8"; ctx.fill(); ol(ctx, 5); rr(ctx, -104, -176, 80, 40, 16); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); }
    else if (kind === "sofa") prop(ctx, "sofa", 0, 0, { color: "#B85C38", s: .55 }, t);
    else if (kind === "desk") prop(ctx, "desk", 0, 0, { laptop: true, s: .55 }, t);
    else if (kind === "tv"){ rr(ctx, -120, -110, 240, 110, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); rr(ctx, -150, -310, 300, 190, 14); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6);
      const fl = .6 + .4 * Math.abs(Math.sin(t * 7)); ctx.fillStyle = `rgba(120,200,255,${fl})`; rr(ctx, -132, -294, 264, 156, 8); ctx.fill(); }
    else if (kind === "table"){ ctx.fillStyle = "#8E4E2E"; [-170, 150].forEach(dx => { rr(ctx, dx, -120, 22, 120, 6); ctx.fill(); ol(ctx, 4); }); rr(ctx, -210, -150, 420, 40, 10); ctx.fillStyle = "#B5643C"; ctx.fill(); ol(ctx, 6);
      [[-120, "#FFFFFF"], [0, "#7FA563"], [120, "#E0A24F"]].forEach(([dx, c2]) => { ctx.beginPath(); ctx.ellipse(dx, -160, 50, 16, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(dx, -168, 34, 14, 0, Math.PI, TAU); ctx.fillStyle = c2; ctx.fill(); });
      for (let i = 0; i < 3; i++){ const q = (t * .5 + i / 3) % 1; ctx.save(); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-120 + i * 120, -190 - q * 90); ctx.quadraticCurveTo(-135 + i * 120, -215 - q * 90, -118 + i * 120, -240 - q * 90); ctx.stroke(); ctx.restore(); } }
    ctx.restore();
  }
  TT.scene(PX + "pulau", "Cerita: keluarga di pulau terapung masing-masing / merapat jadi satu", (ctx, th, s, t) => {
    const f = s.f || {}, Pu = Object.assign({ mode: "pisah", isl: [], w: 400, spread: 1.25, cx: 540, cy: 1000 }, f.pulau || {});
    const tD = T(s, Pu.driftCue, .5), tTab = T(s, Pu.tableCue, .4), tBas = T(s, Pu.basketCue, .4), tM = T(s, Pu.mergeCue, .4);
    const spreadK = Pu.mode === "pisah" ? 1 + (Pu.spread - 1) * eOut(clamp((t - tD) / 2.2, 0, 1)) : Pu.spread;
    const mq = Pu.mode === "satu" ? eOut(clamp((t - tM) / 1.6, 0, 1)) : 0;
    const big = { x: Pu.bigX ?? 540, y: Pu.bigY ?? 1250, w: 900 };
    const pos = (I, j) => { const bx = Pu.cx + (I.x - Pu.cx) * spreadK, by = Pu.cy + (I.y - Pu.cy) * spreadK + Math.sin(t * 1.2 + j * 1.7) * 12;
      const sx = big.x + (I.mx ?? (j - 1.5) * 190), sy = big.y; return [lerp(bx, sx, mq), lerp(by, sy, mq)]; };
    const tsz = (a) => lerp(a.size || 380, Pu.bigSize || 470, mq);
    base(ctx, s, t, { env: "sky", envOpt: { time: Pu.time || "night", hills: false }, envFront: false,
      spots: { center: [540, 980, .95], big: [540, 1020, 1.0] },
      prep: (a, j) => { const I = Pu.isl.find(q => q.toon === j); if (!I) return null; const [x, y] = pos(I, Pu.isl.indexOf(I)); return { a: Object.assign({}, a, { x: x + (I.tx || 0) * (1 - mq), y, size: tsz(a) }), t }; },
      back: (ctx2, c, sts) => {
        // big island + table
        const qb = popQ(t, tTab, .6); if (qb > 0){ ctx.save(); ctx.translate(big.x, big.y + (1 - qb) * 200); ctx.scale(qb, qb); glowAt(ctx, 0, -200, 600, "#FFD27A", .35 + .1 * Math.sin(t * 2)); island(ctx, 0, 0, big.w, t, 9, true);
          furn(ctx, "table", 0, 0, 1, t); ctx.restore();
          // basket
          const qk = popQ(t, tBas - .3, .4); if (qk > 0){ ctx.save(); ctx.translate(big.x + 330, big.y - 4); ctx.scale(qk, qk); rr(ctx, -70, -80, 140, 80, 14); ctx.fillStyle = "#C98A4B"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#8E5A2E"; ctx.lineWidth = 4; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(-60 + i * 40, -78); ctx.lineTo(-60 + i * 40, -4); ctx.stroke(); }
            ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -80, 60, Math.PI, TAU); ctx.stroke(); ctx.restore(); } }
        // small islands
        Pu.isl.forEach((I, j) => { const [x, y] = pos(I, j), fade = 1 - clamp((mq - .6) / .4, 0, 1); if (fade <= 0) return; ctx.save(); ctx.globalAlpha *= fade; const w = Pu.w * (1 - mq * .5);
          island(ctx, x, y, w, t, j, false); if (I.kind) furn(ctx, I.kind, x + (I.fx ?? 90), y + 6, .7 * (1 - mq * .6), t); ctx.restore(); });
      },
      after: (ctx2, c, sts) => {
        // phone glows + flying phones
        Pu.isl.forEach((I, j) => { const st = sts[I.toon]; if (!st) return; const [hx, hy] = lp(st, 16, -45);
          layer(ctx, c, 1, () => { if (t < tBas) glowAt(ctx, hx, hy - 20, 120 * st.size / 380, "#8FD3FF", .45 + .15 * Math.sin(t * 5 + j));
            const k = t - tBas - j * .15; if (k > 0 && k < .8){ const q = eOut(k / .8), bx = big.x + 330, by = big.y - 90, x = lerp(hx, bx, q), y = lerp(hy, by, q) - Math.sin(q * Math.PI) * 260;
              ctx.save(); ctx.translate(x, y); ctx.rotate(q * 8); rr(ctx, -18, -32, 36, 64, 8); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#BFE2EA"; rr(ctx, -12, -24, 24, 46, 4); ctx.fill(); ctx.restore(); } }); });
        // labels
        Pu.isl.forEach((I, j) => { if (!I.label) return; const st = sts[I.toon], T0 = tOf(s, I, .2 + j * .15), out = Pu.mode === "satu" ? clamp((t - tTab) / .3, 0, 1) : 0; if (!st || t < T0 || out >= 1) return;
          const h = toonHead(st), [px, py] = c.toScreen(h[0], h[1] - st.size * .42); CS.ov.push(() => { ctx.save(); ctx.globalAlpha = 1 - out; pill(ctx, I.label, px, py, popQ(t, T0, .35), I.col || ORANGE, "#FFFFFF", 34); ctx.restore(); }); });
        if (mq > 0 && mq < 1) layer(ctx, c, 1, () => burstFx(ctx, big.x, big.y - 300, (t - tM) * .6, GOLD, 16, 420));
        if (mq >= 1) layer(ctx, c, 1, () => { for (let i = 0; i < 5; i++){ const q = ((t * .4 + i / 5) % 1); ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .9; ctx.translate(big.x - 300 + i * 150, big.y - 500 - q * 300); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 14); ctx.bezierCurveTo(-34, -10, -18, -40, 0, -20); ctx.bezierCurveTo(18, -40, 34, -10, 0, 14); ctx.fill(); ctx.restore(); } });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Pu = f.pulau || {}; (Pu.isl || []).forEach((I, j) => { if (I.cue || I.at != null) add(tOf(s, I, .2 + j * .15, i), "pop"); }); if (Pu.driftCue) add(cueT(s, Pu.driftCue, .5, i), "whoosh");
    if (Pu.tableCue) add(cueT(s, Pu.tableCue, .4, i), "pop"); if (Pu.basketCue){ const a = cueT(s, Pu.basketCue, .4, i); [0, 1, 2, 3].forEach(k => add(a + .6 + k * .15, "pop")); } if (Pu.mergeCue){ add(cueT(s, Pu.mergeCue, .4, i), "whoosh"); add(cueT(s, Pu.mergeCue, .4, i) + 1.5, "chime"); } });

  /* ================= makan: family dinner table ================= */
  TT.scene(PX + "makan", "Cerita: meja makan keluarga (uap, lampu, obrolan melayang, gambar juara)", (ctx, th, s, t) => {
    const f = s.f || {}, M = Object.assign({ x: 540, y: 1300, w: 860 }, f.makan || {});
    const tFlow = T(s, M.flowCue, .3), tGlow = T(s, M.glowCue, .5);
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 980 },
      spots: { table: [540, 1060, 1.0], kids: [540, 980, 1.18] },
      back: () => {
        const sw = Math.sin(t * 1.1) * .05; ctx.save(); ctx.translate(M.x, 140); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(0, 260); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-110, 360); ctx.lineTo(110, 360); ctx.lineTo(50, 250); ctx.lineTo(-50, 250); ctx.closePath(); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 5); glowAt(ctx, 0, 380, 520, "#FFD9A0", .45 + (t > tGlow ? .15 * Math.sin(t * 4) : 0)); ctx.restore();
        ctx.save(); ctx.globalAlpha = .16; ctx.fillStyle = "#FFE3A0"; ctx.beginPath(); ctx.moveTo(M.x - 100 + sw * 300, 500); ctx.lineTo(M.x + 100 + sw * 300, 500); ctx.lineTo(M.x + 520, M.y); ctx.lineTo(M.x - 520, M.y); ctx.closePath(); ctx.fill(); ctx.restore();
      },
      midZ: .5,
      mid: () => {
        const x0 = M.x - M.w / 2, x1 = M.x + M.w / 2, y = M.y;
        ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.ellipse(M.x, GROUND + 6, M.w * .55, 26, 0, 0, TAU); ctx.fill();
        rr(ctx, x0, y, M.w, GROUND - y, 10); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "rgba(255,244,230,.35)"; for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.arc(x0 + 60 + i * 95, y + 90, 22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x0 + 100 + i * 95, y + 190, 14, 0, TAU); ctx.fill(); }
        rr(ctx, x0 - 20, y - 26, M.w + 40, 40, 12); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6);
        // dishes
        const D = M.dishes || [["rice", -280], ["veg", -90], ["tempe", 110], ["tea", 300]];
        D.forEach(([k, dx], i) => { const x = M.x + dx, yy = y - 26; ctx.save(); ctx.translate(x, yy);
          if (k === "tea"){ rr(ctx, -34, -90, 68, 90, 12); ctx.fillStyle = "#FFF4E6"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#B5643C"; ctx.fillRect(-28, -60, 56, 14); }
          else { ctx.beginPath(); ctx.ellipse(0, -6, 96, 26, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
            if (k === "rice"){ ctx.beginPath(); ctx.ellipse(0, -22, 66, 46, 0, Math.PI, TAU); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 4); }
            else if (k === "veg"){ ctx.beginPath(); ctx.ellipse(0, -16, 70, 20, 0, 0, TAU); ctx.fillStyle = "#7FA563"; ctx.fill(); for (let j = 0; j < 4; j++){ ctx.fillStyle = j % 2 ? "#E07A4F" : "#4D8A48"; ctx.beginPath(); ctx.arc(-40 + j * 26, -20 + (j % 2) * 6, 10, 0, TAU); ctx.fill(); } }
            else { for (let j = 0; j < 3; j++){ rr(ctx, -64 + j * 44, -38 + (j % 2) * 6, 40, 28, 6); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 3); } } }
          if (k !== "tea") for (let j = 0; j < 2; j++){ const q = (t * .55 + j / 2 + i * .2) % 1; ctx.save(); ctx.globalAlpha = .55 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-20 + j * 40, -60 - q * 140); ctx.quadraticCurveTo(-40 + j * 40 + Math.sin(q * 6) * 14, -100 - q * 140, -18 + j * 40, -140 - q * 140); ctx.stroke(); ctx.restore(); }
          ctx.restore(); });
      },
      front: (ctx2, c, sts) => {
        if (t > tFlow){ const icons = M.icons || ["chat", "heart", "star", "sparkles", "chat", "heart"];
          for (let i = 0; i < 6; i++){ const q = ((t - tFlow) * .32 + i / 6) % 1, src = sts[(i % Math.max(1, sts.length))]; if (!src) continue; const h = toonHead(src);
            const x = h[0] + Math.sin(q * 5 + i) * 60, y = h[1] - src.size * .3 - q * 420; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * clamp((t - tFlow) / .5, 0, 1); ctx.translate(x, y); const sc = .8 + .3 * Math.sin(q * Math.PI);
            ctx.scale(sc, sc); glowAt(ctx, 0, 0, 80, "#FFD27A", .5); rr(ctx, -44, -34, 88, 68, 24); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); ico(ctx, icons[i], 0, 0, 40, ORANGE, 2.6); ctx.restore(); } }
      },
      over: () => { if (t > tGlow && M.glowText) stampBox(ctx, M.glowText, 540, 520, t - tGlow, ORANGE, 52, -.05); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.makan || {}; if (M.flowCue) add(cueT(s, M.flowCue, .3, i), "chime"); if (M.glowCue) add(cueT(s, M.glowCue, .5, i), "chime"); });
})();
