/* Scene pack j2611221020124: story scenes for MODE CERITA ("motion": {"mode": "cerita"}). Layout prefix j2611221020124_.
   Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], props[], cards[], stamp, front)
   plus its own set piece:
     _makhluk    a living "new habit" buddy pops up, stretches with the hero, then fades grey and wanders off (f.buddy, f.days)
     _manik      routine necklace: big beads on a string; a loose new bead snaps in after an old one; a light pulse runs the chain (f.chain)
     _aroma      tea steam curls into a beckoning finger that taps the hero; the habit buddy returns (f.aroma, f.buddy)
     _pameran    expo booth: screens and lamps black out, visitors leave, thought cloud of the forgotten cable reel (f.expo)
     _jaring     tightrope walk carrying stacked tasks; a small box falls, a safety net springs up and catches the next one (f.rope)
     _bagasi     living items hop into a car boot while a checklist ticks; boot slams, stamp (f.boot)
     _popcorn    meeting pot pops topic-popcorn that fills the room (f.pop)
     _bowling    bowling lane: the talk ball rolls into the gutter; agenda bumpers rise; bounce -> strike (f.lane)
     _mejaputar  lazy-susan meeting table: three topic dishes rotate to the front and get decided; agenda sheet (f.tray)
     _gulungan   a giant paper roll of rows spills out of the laptop and runs across the floor (f.roll)
     _ayakan     a giant sieve: data strips pour in, non-matching ones fall through as ghosts, matches glow (f.sieve)
     _urut       xylophone of sales bars: bars hop into sorted order, glissando, the top bar is crowned (f.xylo)
     _toko       electronics shop with counter: complaint chips cut off (f.rant) or a tangled knot that unravels while listened to (f.knot)
     _gununges   sea world: tip of an iceberg, the camera dives to reveal the labelled hidden part (f.berg) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, G, TAU } = TT;
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", TEAL = "#2F6F73", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const eIn = x => x * x * x;
  const cl01 = x => clamp(x, 0, 1);
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.stroke(); };
  const ico = (ctx, name, cx, cy, size, col, lw) => icon(ctx, name, cx - size / 2, cy - size / 2, size, col, lw || 2.4);
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 16)) return size; size -= 2; } }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = cl01(k / .3), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= cl01(q * 2); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .94); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function textC(ctx, txt, x, y, size, col, weight){ font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  // rounded label pill centred at x, y (text fitted to maxW)
  function tagPill(ctx, txt, x, y, size, bg, fg, maxW, k){
    const q = k == null ? 1 : eBack(cl01(k / .4)); if (q <= 0) return; size = fit(ctx, txt, (maxW || 600) - size, size, 900);
    const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    ctx.save(); ctx.translate(x, y); ctx.scale(q, q); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, Math.max(4, size * .12));
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function lines2(ctx, txt, maxW, size, weight){ const ws = String(txt).split(" "); let L = [txt];
    font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width > maxW && ws.length > 1){ let best = null; for (let i = 1; i < ws.length; i++){ const a = ws.slice(0, i).join(" "), b = ws.slice(i).join(" "), m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width); if (!best || m < best[0]) best = [m, [a, b]]; } L = best[1]; }
    while (Math.max(...L.map(l => ctx.measureText(l).width)) > maxW && size > 14){ size -= 2; font(ctx, weight || 800, size, FAM); }
    return { L, size }; }
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const headOf = st => { const h = toonHead(st); return [h[0], h[1], st.size * 20.5 / 92]; };
  function confetti(ctx, x, y, k, n){ if (k < 0 || k > 2.2) return; for (let i = 0; i < (n || 26); i++){ const a = -Math.PI / 2 + (rnd(i) - .5) * 2.4, v = 600 + rnd(i + 9) * 700;
      const px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 900 * k * k; ctx.save(); ctx.globalAlpha *= cl01(1 - (k - 1.4) / .8); ctx.translate(px, py); ctx.rotate(k * 8 + i);
      ctx.fillStyle = [HL, GOLD, GREEN, "#5B7DB1", RED, CREAM][i % 6]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } }

  /* ---------- shared base (same data as the generic "cerita" layout + hooks) ---------- */
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = (f.toons || []).concat(H.extra || []), idx = G.scene;
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
    if (H.envDraw) H.envDraw(ctx, c, eo); else env(ctx, E, t, c, eo);
    const R = {};
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(cl01(q / .35)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => { if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R)); R[j] = toon(ctx, c, P[j].a, s, P[j].t, { st: sts[j] }); if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (R[0] && R[0].screen) TT.CS.focus = R[0].screen.head;
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (!H.envDraw && f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    if (H.over) TT.CS.ov.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R };
  }
  function sfxBase(s, f, i, add){
    const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
    (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
    (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
    (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
    (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
  }

  /* ---------- the habit buddy: a living gummy blob ---------- */
  // o: {alpha, sx, sy, arms 0 (down)..1 (up), gray 0..1, label, mood: "happy"|"lost", face}
  function buddy(ctx, x, y, h, t, o){
    o = o || {}; const a = o.alpha ?? 1; if (a <= .01) return;
    const g = o.gray || 0, col = g > 0 ? lerpCol("#F08C2E", "#B9B2A8", g) : (o.col || "#F08C2E"), w = h * .78;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(o.sx || 1, o.sy || 1);
    // shadow
    ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.beginPath(); ctx.ellipse(0, 4, w * .55, 14, 0, 0, TAU); ctx.fill();
    // legs
    ctx.lineCap = "round"; [-1, 1].forEach(d => { const lift = o.walk ? Math.max(0, Math.sin(t * 12 + (d > 0 ? Math.PI : 0))) * 16 : 0;
      ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(d * w * .2, -h * .14); ctx.lineTo(d * w * .22, -12 - lift); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = 15; ctx.stroke(); ctx.fillStyle = BROWN; ctx.beginPath(); ctx.ellipse(d * w * .25, -8 - lift, 26, 13, 0, 0, TAU); ctx.fill(); });
    // arms
    const ar = o.arms || 0; [-1, 1].forEach(d => { const ang = lerp(.5, -1.25, ar) + Math.sin(t * 6 + d) * .12 * (o.wave ? 2 : 1), sx0 = d * w * .44, sy0 = -h * .52, L = h * .36;
      const ex = sx0 + d * Math.cos(ang) * L, ey = sy0 + Math.sin(ang) * L;
      ctx.strokeStyle = OUT; ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(sx0, sy0); ctx.lineTo(ex, ey); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 13; ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 17, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); });
    // body
    ctx.beginPath(); ctx.moveTo(-w * .46, -h * .16); ctx.bezierCurveTo(-w * .62, -h * .7, -w * .3, -h, 0, -h); ctx.bezierCurveTo(w * .3, -h, w * .62, -h * .7, w * .46, -h * .16);
    ctx.quadraticCurveTo(0, -h * .04, -w * .46, -h * .16); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.setLineDash(o.dash ? [18, 14] : []); ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.clip(); ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.ellipse(-w * .2, -h * .78, w * .14, h * .08, -.5, 0, TAU); ctx.fill();
    ctx.fillStyle = g > .5 ? "#DCD6CE" : CREAM; ctx.fillRect(-w, -h * .86, w * 2, h * .08); ctx.restore();
    // face
    const fx = (o.face || 0) * w * .08, ey = -h * .56, blink = ((t * .8 + x * .001) % 3) < .12;
    [-1, 1].forEach(d => { if (blink){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(fx + d * w * .17 - 16, ey); ctx.lineTo(fx + d * w * .17 + 16, ey); ctx.stroke(); return; }
      ctx.beginPath(); ctx.ellipse(fx + d * w * .17, ey, 22, 28, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
      ctx.beginPath(); ctx.arc(fx + d * w * .17 + (o.face || 0) * 6, ey + 4, 11, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath();
    if (o.mood === "lost"){ ctx.moveTo(fx - 22, -h * .36); ctx.quadraticCurveTo(fx, -h * .42, fx + 22, -h * .36); }
    else { ctx.arc(fx, -h * .42, 24, .15 * Math.PI, .85 * Math.PI); }
    ctx.stroke();
    if (o.mood !== "lost"){ ctx.fillStyle = "rgba(217,72,59,.35)"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(fx + d * w * .3, -h * .43, 18, 10, 0, 0, TAU); ctx.fill(); }); }
    ctx.restore();
    if (o.label){ ctx.save(); ctx.globalAlpha *= a; tagPill(ctx, o.label, x, y + 46, 34, g > .5 ? "#DCD6CE" : CREAM, BROWN, 420); ctx.restore(); }
  }
  function lerpCol(c1, c2, q){ const p = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)], A = p(c1), B = p(c2);
    return "#" + A.map((v, i) => Math.round(lerp(v, B[i], cl01(q))).toString(16).padStart(2, "0")).join(""); }
  // buddy state over time: {inCue|inAt, joinCue, fadeCue, x, h, label, exitX}
  function buddyAt(ctx, s, t, B, idx){
    const tIn = tOf(s, B.inAt != null ? { at: B.inAt } : { cue: B.inCue }, .2, idx), tJ = T(s, B.joinCue, .4, idx), tF = T(s, B.fadeCue, .7, idx);
    const k = t - tIn; if (k < 0) return null;
    const pop = eBack(cl01(k / .45)), fade = cl01((t - tF) / 1.4);
    let x = B.x ?? 760, y = B.y ?? GROUND, h = B.h ?? 320, sy = pop, sx = pop, arms = .15, wave = false;
    if (k < .6){ const q = k / .6; sy *= 1 + .25 * Math.sin(q * Math.PI * 2) * (1 - q); sx *= 1 - .15 * Math.sin(q * Math.PI * 2) * (1 - q); y -= Math.sin(q * Math.PI) * 120; }
    const bob = Math.sin(t * 4.2) * .03; sy *= 1 + bob; sx *= 1 - bob;
    if (t > tJ && fade < 1){ const st = Math.sin((t - tJ) * 5.5); arms = .55 + .45 * Math.max(0, st); sy *= 1 + .12 * Math.max(0, st); sx *= 1 - .07 * Math.max(0, st); }
    else if (t < tJ) { arms = .25 + .2 * Math.sin(t * 3); wave = true; }
    let walk = false; if (fade > 0){ x += eIn(fade) * (B.exitX ?? 260) + (t - tF) * 30; walk = true; arms = .1; }
    buddy(ctx, x, y, h, t, { alpha: 1 - fade * .82, sx, sy, arms, wave, gray: fade * 1.2, dash: fade > .3, mood: fade > .1 ? "lost" : "happy", label: B.label, walk, face: fade > .1 ? 1 : (B.face ?? -1) });
    if (k < .9) burstFx(ctx, x, y - h * .5, k - .1, HL, 10, 220);
    return [x, y - h];
  }

  /* ================= _makhluk: habit buddy appears, stretches, fades ================= */
  // f.buddy: {x, h, label, inCue, joinCue, fadeCue, exitX}; f.days: [{cue|at, text}] sticker badge at the top
  TT.scene("j2611221020124_makhluk", "Cerita: makhluk kebiasaan baru", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = f.buddy || {}, tF = T(s, B.fadeCue, .7, idx);
    let bTop = null;
    base(ctx, s, t, { env: "home", envOpt: { time: "day" },
      spots: { buddy: () => [B.x ?? 760, GROUND - (B.h ?? 320) * .6, 1.3] },
      back: () => { if (B.cabinet == null) return; const cy = (B.y ?? 1400) + 22; ctx.fillStyle = "#A0623A"; ctx.fillRect(B.cabinet, cy, 1400, GROUND - cy); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(B.cabinet, cy, 1400, GROUND - cy);
        rr(ctx, B.cabinet - 20, cy - 24, 1440, 34, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6); for (let i = 0; i < 4; i++){ const dx = B.cabinet + 30 + i * 200; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(dx, cy + 30, 170, GROUND - cy - 60); ctx.beginPath(); ctx.arc(dx + 85, cy + 70, 9, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.stroke(); } },
      mid: () => { bTop = buddyAt(ctx, s, t, B, idx);
        if (bTop && t > tF + .5){ const k = t - tF - .5; for (let i = 0; i < 3; i++){ const q = ((k * .8 + i / 3) % 1); ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .8; textC(ctx, "?", bTop[0] + 40 + i * 30, bTop[1] - 20 - q * 120, 60 + i * 8, "#8C8478", 900); ctx.restore(); } } },
      over: () => {
        const D = (f.days || []).map((d, j) => Object.assign({ T: tOf(s, d, .2 + j * .3, idx) }, d)).filter(d => t >= d.T); if (!D.length) return;
        const d = D[D.length - 1], k = t - d.T, flip = cl01(k / .35), sc = eBack(flip);
        ctx.save(); ctx.translate(820, 300 + Math.sin(t * 2) * 6); ctx.rotate(.06); ctx.scale(sc, Math.max(.05, sc * Math.abs(Math.cos((1 - flip) * Math.PI / 2))));
        rr(ctx, -150, -70, 300, 140, 26); ctx.fillStyle = D.length > 1 ? "#E9E2D6" : CREAM; ctx.fill(); ol(ctx, 7);
        ctx.fillStyle = D.length > 1 ? "#8C8478" : ORANGE; rr(ctx, -150, -70, 300, 42, [26, 26, 0, 0]); ctx.fill();
        fit(ctx, d.text, 250, 64, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(d.text, 0, 50); ctx.textAlign = "left"; ctx.restore();
        if (k < .8) burstFx(ctx, 820, 300, k - .05, D.length > 1 ? "#8C8478" : HL, 8, 170); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const B = f.buddy || {}; if (B.inCue || B.inAt != null) add(tOf(s, B.inAt != null ? { at: B.inAt } : { cue: B.inCue }, .2, i), "pop");
    if (B.joinCue) add(cueT(s, B.joinCue, .4, i), "chime"); if (B.fadeCue) add(cueT(s, B.fadeCue, .7, i), "whoosh"); (f.days || []).forEach((d, j) => add(tOf(s, d, .2 + j * .3, i), "pop")); });

  /* ================= _manik: routine necklace ================= */
  // f.chain: {beads:[{text}], fresh:{text}, slot (index the new bead takes), snapCue, pulseCue, nos:[{cue, text}], y0=560, sag=260}
  TT.scene("j2611221020124_manik", "Cerita: kalung manik rutinitas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, C = Object.assign({ y0: 430, sag: 330, slot: 2 }, f.chain || {}), old = C.beads || [], n = old.length;
    const tS = T(s, C.snapCue, .3, idx), tP = T(s, C.pulseCue, .3, idx), snap = eOut(cl01((t - tS) / .7));
    const PT = u => { const th = Math.PI * (1.08 - 1.16 * u); return [540 + 390 * Math.cos(th), C.y0 + C.sag * Math.sin(th)]; };
    const u0 = j => .5 + (j - (n - 1) / 2) * (1 / (n + .9)), u1 = j => .5 + (j - n / 2) * (1 / (n + 1.1));
    const R = 104, cols = ["#FFF4E6", "#F3D9B5", "#E8C9A0", "#F7E2C6", "#EED3B0"];
    let freshPos = null;
    function bead(x, y, r, txt, col, glow, k){
      if (glow > 0) glowAt(ctx, x, y, r * 2.3, GOLD, .55 * glow);
      ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 7);
      ctx.beginPath(); ctx.arc(-r * .35, -r * .38, r * .22, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fill();
      const { L, size } = lines2(ctx, String(txt).toUpperCase(), r * 1.6, 36, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center";
      L.forEach((l, i) => ctx.fillText(l, 0, (i - (L.length - 1) / 2) * size * 1.1 + size * .36)); ctx.textAlign = "left"; ctx.restore(); }
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: () => {
        // string
        ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(40, 120); for (let i = 0; i <= 60; i++){ const p = PT(i / 60); ctx.lineTo(p[0], p[1] + Math.sin(t * 1.4 + i * .2) * 4); } ctx.lineTo(1040, 120);
        ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = "#C9A27A"; ctx.lineWidth = 8; ctx.stroke();
        // pulse light
        const pk = t - tP; const pu = pk > 0 && pk < 3.2 ? (pk % 1.6) / 1.6 : -1;
        if (pu >= 0){ const p = PT(pu); glowAt(ctx, p[0], p[1], 120, "#FFE7A3", .9); sparkle(ctx, p[0], p[1], 26, "#FFFFFF"); }
        // old beads
        const order = []; let jj = 0;
        for (let j = 0; j < n; j++){ if (j === C.slot) jj++; order.push([j, jj]); jj++; }
        order.forEach(([j, slot]) => { const u = lerp(u0(j), u1(slot), snap) + Math.sin(t * .9 + j) * .004, p = PT(u), sw = Math.sin(t * 1.4 + u * 12) * 4;
          const lit = pu >= 0 && Math.abs(pu - u) < .07 ? 1 - Math.abs(pu - u) / .07 : 0;
          bead(p[0], p[1] + sw, R * (1 + lit * .08), (old[j] || {}).text || "", cols[j % cols.length], lit, 1); });
        // fresh bead
        const fr = C.fresh || { text: "BARU" }, uS = u1(C.slot), pS = PT(uS);
        const fx = 540 + Math.sin(t * 1.3) * 180, fy = 420 + Math.sin(t * 2.1) * 40;
        let x = fx, y = fy, sc = 1;
        if (t > tS){ const q = cl01((t - tS) / .7), e = eIn(q) * .4 + q * .6; x = lerp(fx, pS[0], e); y = lerp(fy, pS[1], e) - Math.sin(q * Math.PI) * 160; if (q >= 1){ x = pS[0]; y = pS[1] + Math.sin(t * 1.4 + uS * 12) * 4; }
          const kq = t - tS - .7; if (kq > 0 && kq < .4) sc = 1 + .18 * Math.sin(kq / .4 * Math.PI) * (1 - kq / .4); }
        else { // dashed wandering trail
          ctx.save(); ctx.setLineDash([14, 16]); ctx.strokeStyle = hexA(CREAM, .6); ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i < 14; i++){ const tt = t - i * .07; ctx.lineTo(540 + Math.sin(tt * 1.3) * 180, 420 + Math.sin(tt * 2.1) * 40); } ctx.stroke(); ctx.restore(); }
        const litF = pu >= 0 && Math.abs(pu - uS) < .07 ? 1 - Math.abs(pu - uS) / .07 : 0;
        bead(x, y, R * 1.08 * sc, fr.text, HL, (t > tS ? .5 + .3 * Math.sin(t * 4) : .25) + litF, 1);
        freshPos = [x, y];
        if (t > tS + .55 && t < tS + 1.5) burstFx(ctx, pS[0], pS[1], t - tS - .6, GOLD, 14, 260);
        // "no" chips
        (C.nos || []).forEach((no, j) => { const k = t - tOf(s, no, .3, idx); if (k < 0) return; const x0 = j % 2 ? 860 : 220, y0 = 1060 + Math.sin(t * 2 + j) * 8;
          tagPill(ctx, String(no.text).toUpperCase(), x0, y0, 44, CREAM, BROWN, 360, k);
          const sq = cl01((k - .35) / .3); if (sq > 0){ ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0 - 130, y0 + 30); ctx.lineTo(x0 - 130 + 260 * sq, y0 + 30 - 60 * sq); ctx.stroke(); ctx.restore(); } });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const C = f.chain || {}; if (C.snapCue){ const a = cueT(s, C.snapCue, .3, i); add(a, "whoosh"); add(a + .65, "chime"); }
    if (C.pulseCue){ const a = cueT(s, C.pulseCue, .3, i); add(a, "ping"); add(a + 1.6, "ping"); } (C.nos || []).forEach(no => { const a = tOf(s, no, .3, i); add(a, "pop"); add(a + .4, "whoosh"); }); });

  /* ================= _aroma: steam beckons ================= */
  // f.aroma: {x (table), callCue, callDur=2.6, hero (toon index)}; f.buddy (returns, see _makhluk)
  function mugTable(ctx, x, t, noPlate){
    const y = 1330;
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(x - 12, y, 24, GROUND - y - 10); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(x - 12, y, 24, GROUND - y - 10);
    ctx.beginPath(); ctx.ellipse(x, GROUND - 8, 90, 16, 0, 0, TAU); ctx.fillStyle = "#6B3A22"; ctx.fill(); ol(ctx, 5);
    rr(ctx, x - 170, y - 22, 340, 40, 14); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
    // teapot-less: big mug with tea + teabag tag
    const mx = x + 30, my = y - 22;
    ctx.beginPath(); ctx.arc(mx + 78, my - 70, 34, -Math.PI / 2, Math.PI / 2); ctx.strokeStyle = OUT; ctx.lineWidth = 20; ctx.stroke(); ctx.strokeStyle = CREAM; ctx.lineWidth = 10; ctx.stroke();
    rr(ctx, mx - 75, my - 150, 150, 150, 22); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = ORANGE; ctx.fillRect(mx - 75, my - 96, 150, 24);
    ctx.beginPath(); ctx.ellipse(mx, my - 150, 75, 16, 0, 0, TAU); ctx.fillStyle = "#9A5A2A"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx + 30, my - 150); ctx.lineTo(mx + 62, my - 60); ctx.stroke();
    ctx.save(); ctx.translate(mx + 64, my - 50); ctx.rotate(Math.sin(t * 2) * .12); rr(ctx, -16, 0, 32, 34, 4); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 3); ctx.restore();
    // small plate of biscuits
    if (noPlate) return [mx, my - 160];
    ctx.beginPath(); ctx.ellipse(x - 100, y - 24, 60, 12, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(x - 128 + i * 28, y - 34, 16, 0, TAU); ctx.fillStyle = "#E0A458"; ctx.fill(); ol(ctx, 3); }
    return [mx, my - 160];
  }
  TT.scene("j2611221020124_aroma", "Cerita: uap teh memanggil", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, A = Object.assign({ x: 820, hero: 0, callDur: 2.8 }, f.aroma || {}), tC = T(s, A.callCue, .3, idx);
    let mug = [A.x + 30, 1150];
    base(ctx, s, t, { env: "home", envOpt: { time: "day" },
      spots: { mug: () => [mug[0], mug[1] + 60, 1.35] },
      back: () => { mug = mugTable(ctx, A.x, t, !!f.buddy); },
      front: (ctx2, c, sts) => {
        const [mx, my] = mug;
        // regular steam
        for (let i = 0; i < 3; i++){ const q = (t * .45 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .75; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 12; ctx.lineCap = "round";
          ctx.beginPath(); for (let k = 0; k <= 10; k++){ const yy = my - q * 220 - k * 16; ctx.lineTo(mx - 30 + i * 30 + Math.sin(k * .7 + t * 3 + i) * 16, yy); } ctx.stroke(); ctx.restore(); }
        // beckoning steam finger
        const k = t - tC; if (k < 0 || k > A.callDur + .6) return; const st = sts[A.hero]; if (!st) return;
        const h = toonHead(st), grow = eOut(cl01(k / .9)), fade = 1 - cl01((k - A.callDur) / .6);
        const ex = lerp(mx, h[0] + 150, grow), ey = lerp(my - 60, h[1] - 40, grow) + Math.sin(t * 6) * 10, cx1 = mx + 40, cy1 = my - 420;
        ctx.save(); ctx.globalAlpha = .9 * fade; ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(mx, my); ctx.quadraticCurveTo(cx1, cy1, ex, ey); ctx.stroke();
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 24; ctx.stroke();
        // curling fingertip
        const curl = Math.sin(k * 7) * .5 + .5; ctx.beginPath(); ctx.arc(ex - 30, ey - 10 - curl * 14, 34, -.3, Math.PI * (1.1 + curl * .6)); ctx.lineWidth = 22; ctx.stroke();
        for (let i = 0; i < 6; i++){ const q = ((t * .9 + i / 6) % 1); sparkle(ctx, lerp(mx, ex, q) + Math.sin(i * 3 + t * 4) * 30, lerp(my, ey, q) - Math.sin(q * Math.PI) * 220, 12, "#FFF0C8"); }
        ctx.restore();
        if (k > .7 && k < 2.4){ ctx.save(); ctx.globalAlpha = fade; font(ctx, 900, 54, FAM); ctx.translate(ex - 40, ey - 90); ctx.rotate(-.1 + Math.sin(t * 5) * .05); const q2 = eBack(cl01((k - .7) / .35)); ctx.scale(q2, q2);
          ctx.lineWidth = 12; ctx.strokeStyle = OUT; ctx.lineJoin = "round"; ctx.textAlign = "center"; ctx.strokeText("psst!", 0, 0); ctx.fillStyle = "#FFFFFF"; ctx.fillText("psst!", 0, 0); ctx.textAlign = "left"; ctx.restore(); }
      },
      mid: () => { if (f.buddy) buddyAt(ctx, s, t, f.buddy, idx); }, midZ: 1 });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.aroma || {}; if (A.callCue){ const a = cueT(s, A.callCue, .3, i); add(a, "whoosh"); add(a + .8, "pop"); }
    const B = f.buddy; if (B){ if (B.inCue || B.inAt != null) add(tOf(s, B.inAt != null ? { at: B.inAt } : { cue: B.inCue }, .2, i), "pop"); if (B.joinCue) add(cueT(s, B.joinCue, .4, i), "chime"); } });

  /* ================= _pameran: expo booth blackout ================= */
  // f.expo: {offCue, forgotCue, brand="STAN KAMI"}
  TT.scene("j2611221020124_pameran", "Cerita: stan pameran padam", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, X = Object.assign({ brand: "STAN KAMI" }, f.expo || {}), tO = T(s, X.offCue, .4, idx), tF = T(s, X.forgotCue, .3, idx);
    const k0 = t - tO, flick = k0 > 0 && k0 < .5 ? (Math.sin(k0 * 70) > 0 ? 1 : 0) : (k0 >= .5 ? 0 : 1), off = cl01(k0 / .5);
    const visitors = [
      { z: -1, x: -260, y: 1600, size: 560, hair: "long", shirt: "#7FA563", skin: "b", keys: [{ at: 0, x: 540, speed: 170 }, { at: tO + .3, face: -1, expr: "confused" }, { at: tO + 1.0, x: -300, speed: 260 }] },
      { z: -1, x: 1350, y: 1600, size: 570, hair: "short", hat: "cap", hatColor: "#5B7DB1", shirt: "#E8A55B", skin: "c", face: -1, keys: [{ at: .4, x: 860, speed: 150 }, { at: tO + .2, expr: "shock" }, { at: tO + 1.2, x: 1400, speed: 280 }] }];
    base(ctx, s, t, { extra: visitors,
      envDraw: (ctx2, c) => {
        layer(ctx, c, .35, () => { const g = ctx.createLinearGradient(0, -200, 0, 1500); g.addColorStop(0, "#5E6E86"); g.addColorStop(1, "#AFC0D2"); ctx.fillStyle = g; ctx.fillRect(-900, -900, 2900, 2500);
          ctx.strokeStyle = "#3A4458"; ctx.lineWidth = 10; for (let i = -6; i < 16; i++){ ctx.beginPath(); ctx.moveTo(i * 160, 120); ctx.lineTo(i * 160 + 80, 220); ctx.lineTo(i * 160 + 160, 120); ctx.stroke(); }
          ctx.fillStyle = "#3A4458"; ctx.fillRect(-900, 110, 2900, 14); ctx.fillRect(-900, 214, 2900, 14);
          // far booths
          [[-420, "#7FA563"], [-60, "#5B7DB1"], [1120, "#D9483B"], [1480, "#E8A55B"]].forEach(([x, col]) => { ctx.fillStyle = col; ctx.fillRect(x, 520, 300, 700); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(x + 30, 560, 240, 60); });
        });
        layer(ctx, c, 1, () => { // floor
          ctx.fillStyle = "#D9D2C6"; ctx.fillRect(-900, 1450, 2900, 900); ctx.strokeStyle = "rgba(43,26,18,.14)"; ctx.lineWidth = 4;
          for (let i = -10; i <= 20; i++){ ctx.beginPath(); ctx.moveTo(540 + (i - 5) * 60, 1450); ctx.lineTo(540 + (i - 5) * 260, 2300); ctx.stroke(); }
          for (let r = 0; r < 6; r++){ const y = 1450 + Math.pow(r / 6, 1.6) * 800; ctx.beginPath(); ctx.moveTo(-900, y); ctx.lineTo(2000, y); ctx.stroke(); }
          // our booth
          ctx.fillStyle = "#F3E3C8"; ctx.fillRect(120, 560, 840, 900); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.strokeRect(120, 560, 840, 900);
          ctx.fillStyle = ORANGE; ctx.fillRect(120, 560, 840, 120); ctx.strokeRect(120, 560, 840, 120);
          textC(ctx, X.brand, 540, 645, fit(ctx, X.brand, 700, 66, 900), CREAM, 900);
          // screens
          [[330, 900], [750, 900]].forEach(([x, y], j) => { ctx.fillStyle = "#2B2B33"; ctx.fillRect(x - 8, y + 110, 16, 140); rr(ctx, x - 170, y - 115, 340, 225, 14); ctx.fillStyle = "#1F1F26"; ctx.fill(); ol(ctx, 7);
            ctx.save(); rr(ctx, x - 155, y - 100, 310, 195, 8); ctx.clip();
            if (flick){ const g2 = ctx.createLinearGradient(x - 155, y - 100, x + 155, y + 95); g2.addColorStop(0, j ? "#2F6F73" : "#C2691F"); g2.addColorStop(1, j ? "#7FC8C0" : "#F6C343"); ctx.fillStyle = g2; ctx.fillRect(x - 160, y - 105, 320, 205);
              if (j === 0){ ctx.save(); ctx.translate(x - 60, y); ctx.rotate(t * 1.5); ctx.fillStyle = CREAM; ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = i / 10 * TAU, r = i % 2 ? 22 : 56; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore();
                for (let b = 0; b < 3; b++){ const hh = 40 + 50 * (.5 + .5 * Math.sin(t * 3 + b)); ctx.fillStyle = CREAM; ctx.fillRect(x + 30 + b * 38, y + 70 - hh, 26, hh); } }
              else { textC(ctx, "PROMO", x, y - 20 + Math.sin(t * 4) * 6, 54, CREAM, 900); textC(ctx, "HARI INI", x, y + 45, 40, BROWN, 900); } }
            else { ctx.fillStyle = "#0E0E12"; ctx.fillRect(x - 160, y - 105, 320, 205); ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(x - 120, y + 100); ctx.lineTo(x + 20, y - 100); ctx.stroke(); }
            ctx.restore(); });
          // power strip with empty slot
          ctx.fillStyle = "#E9E2D6"; rr(ctx, 470, 1588, 150, 36, 8); ctx.fill(); ol(ctx, 5); for (let i = 0; i < 3; i++){ ctx.fillStyle = OUT; ctx.fillRect(492 + i * 44, 1600, 8, 12); ctx.fillRect(506 + i * 44, 1600, 8, 12); }
          // counter
          ctx.fillStyle = "#FFFDF6"; ctx.fillRect(640, 1380, 320, 260); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(640, 1380, 320, 260); ctx.fillStyle = ORANGE; ctx.fillRect(640, 1380, 320, 40); ctx.strokeRect(640, 1380, 320, 40);
          for (let i = 0; i < 4; i++){ ctx.save(); ctx.translate(800 + i * 6, 1374 - i * 10); ctx.rotate(-.05 + i * .03); ctx.fillStyle = i % 2 ? CREAM : "#F3D9B5"; rr(ctx, -70, -8, 140, 14, 3); ctx.fill(); ol(ctx, 3); ctx.restore(); }
        });
      },
      back: () => {
        // lamp cones over the booth
        for (let i = 0; i < 3; i++){ const x = 260 + i * 280, a = (1 - off) * (.28 + .05 * Math.sin(t * 3 + i)); if (a <= .01) continue;
          ctx.save(); ctx.globalAlpha = a; const g = ctx.createLinearGradient(0, 240, 0, 1450); g.addColorStop(0, "#FFF2C0"); g.addColorStop(1, "rgba(255,242,192,0)"); ctx.fillStyle = g;
          ctx.beginPath(); ctx.moveTo(x - 30, 240); ctx.lineTo(x + 30, 240); ctx.lineTo(x + 200, 1450); ctx.lineTo(x - 200, 1450); ctx.closePath(); ctx.fill(); ctx.restore(); }
        for (let i = 0; i < 3; i++){ const x = 260 + i * 280; ctx.fillStyle = "#3A4458"; ctx.fillRect(x - 4, 150, 8, 80); ctx.beginPath(); ctx.arc(x, 240, 30, Math.PI, 0); ctx.fillStyle = flick ? "#FFE7A3" : "#555A66"; ctx.fill(); ol(ctx, 5); }
      },
      front: () => { if (k0 > 0 && k0 < 1){ burstFx(ctx, 545, 1600, k0, "#FFE7A3", 10, 160); } },
      post: () => { if (off > 0){ ctx.globalAlpha = off * .38; ctx.fillStyle = "#101826"; ctx.fillRect(0, 0, 1080, 1920); ctx.globalAlpha = 1; } },
      over: (ctx2, c, sts) => {
        const k = t - tF; if (k < 0) return; const st = sts[0]; if (!st) return; const h = c.toScreen(...toonHead(st)), q = eBack(cl01(k / .45)), cx = 700, cy = 420;
        ctx.save(); for (let i = 0; i < 3; i++){ const qq = cl01((k - i * .08) / .3); const px = lerp(h[0] + 60, cx - 200, (i + 1) / 4), py = lerp(h[1] - 140, cy + 150, (i + 1) / 4); ctx.globalAlpha = qq; ctx.beginPath(); ctx.arc(px, py, 14 + i * 9, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); }
        ctx.globalAlpha = 1; ctx.translate(cx, cy); ctx.scale(q, q); ctx.rotate(Math.sin(t * 2) * .02);
        ctx.beginPath(); for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.ellipse(Math.cos(a) * 220, Math.sin(a) * 120, 80, 70, 0, 0, TAU); } ctx.fillStyle = CREAM; ctx.fill();
        ctx.beginPath(); ctx.ellipse(0, 0, 260, 160, 0, 0, TAU); ctx.fill(); ol(ctx, 6); ctx.beginPath(); for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.ellipse(Math.cos(a) * 220, Math.sin(a) * 120, 80, 70, 0, 0, TAU); } ctx.fillStyle = CREAM; ctx.fill();
        // desk + cable reel
        ctx.fillStyle = "#C47A48"; rr(ctx, -200, 60, 400, 30, 8); ctx.fill(); ol(ctx, 5);
        const wob = Math.sin(t * 9) * .1; ctx.save(); ctx.translate(-40, -10); ctx.rotate(wob);
        ctx.beginPath(); ctx.arc(0, 0, 68, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fillStyle = "#2B2B33"; ctx.fill();
        ctx.strokeStyle = "#555A66"; ctx.lineWidth = 4; for (let r = 18; r < 50; r += 9){ ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); }
        ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); ctx.restore();
        ctx.strokeStyle = "#2B2B33"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(20, 40); ctx.quadraticCurveTo(80, 70, 110, 20); ctx.stroke(); rr(ctx, 100, -6, 40, 34, 6); ctx.fillStyle = "#2B2B33"; ctx.fill();
        textC(ctx, "!", 150, -40 + Math.sin(t * 8) * 6, 90, RED, 900);
        textC(ctx, "DI KANTOR", 0, -95, 40, BROWN, 900);
        ctx.restore();
        if (k < .9) burstFx(ctx, cx, cy, k - .1, HL, 10, 280); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const X = f.expo || {}; if (X.offCue){ const a = cueT(s, X.offCue, .4, i); add(a, "ping"); add(a + .3, "pop"); } if (X.forgotCue) add(cueT(s, X.forgotCue, .3, i), "pop"); });

  /* ================= _jaring: tightrope + safety net ================= */
  // f.rope: {hero=0, items:[{text}] (bottom -> top), skipCue (top item falls), netCue, catchCue (next item falls into the net), netLabel, y=1200}
  TT.scene("j2611221020124_jaring", "Cerita: tali akrobat + jaring pengaman", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rp = Object.assign({ hero: 0, y: 1200, netLabel: "CHECKLIST" }, f.rope || {}), items = Rp.items || [];
    const tSk = T(s, Rp.skipCue, .3, idx), tN = T(s, Rp.netCue, .4, idx), tCa = T(s, Rp.catchCue, .5, idx), NY = Rp.y + 300;
    let heroX = 400;
    const ropeY = x => Rp.y + 40 * Math.exp(-Math.pow((x - heroX) / 260, 2)) + 30 * (1 - Math.pow((x - 540) / 700, 2));
    const netQ = eBack(cl01((t - tN) / .6));
    const BW = Rp.widths || [230, 160];
    function box(x, y, w, txt, rot, col){ const h = w * .5; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = col || "#E0A458"; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = "rgba(43,26,18,.15)"; ctx.fillRect(-w / 2 + 6, -h * .55, w - 12, 10); fit(ctx, txt, w - 30, 30, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(txt, 0, -h * .2); ctx.textAlign = "left"; ctx.restore(); }
    base(ctx, s, t, { env: "sky", envOpt: { time: "day" },
      prep: (a, j) => { if (j !== Rp.hero) return null; const st0 = toonState(a, s, t); heroX = st0.x; return { a: Object.assign({}, a, { y: ropeY(st0.x) - 4 }), t }; },
      back: () => {
        // posts + platforms
        [[-40, 1], [1120, -1]].forEach(([x]) => { ctx.fillStyle = "#8E4E2E"; ctx.fillRect(x - 22, Rp.y - 60, 44, 1400); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(x - 22, Rp.y - 60, 44, 1400); ctx.beginPath(); ctx.arc(x, Rp.y - 64, 26, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); });
        // net
        if (netQ > 0){ const rise = (1 - netQ) * 500, ny = NY + rise; let dip = 0; const kc = t - tCa - .55; if (kc > 0) dip = 70 * Math.exp(-kc * 3) * Math.cos(kc * 12) + 20;
          ctx.save(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; const L = 40, R2 = 1040;
          const nyAt = (x, d) => ny + d * Math.sin((x - L) / (R2 - L) * Math.PI) * (1 + dip / 60) * 50;
          for (let d = 0; d <= 4; d++){ ctx.beginPath(); for (let x = L; x <= R2; x += 20) ctx.lineTo(x, nyAt(x, d / 4) + d * 22); ctx.stroke(); }
          for (let x = L; x <= R2; x += 60){ ctx.beginPath(); ctx.moveTo(x, nyAt(x, 0)); ctx.lineTo(x + 20, nyAt(x + 20, 1) + 88); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 40, nyAt(x + 40, 0)); ctx.lineTo(x + 20, nyAt(x + 20, 1) + 88); ctx.stroke(); }
          ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); for (let x = L; x <= R2; x += 20) ctx.lineTo(x, nyAt(x, 0)); ctx.stroke(); ctx.restore();
          tagPill(ctx, Rp.netLabel, 250, ny - 40, 46, CREAM, ORANGE, 420, t - tN - .2); }
        // rope
        ctx.beginPath(); for (let x = -60; x <= 1140; x += 20) ctx.lineTo(x, ropeY(x)); ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.stroke(); ctx.strokeStyle = "#E9D3A8"; ctx.lineWidth = 7; ctx.stroke();
      },
      over1: (ctx2, c, sts, j) => { if (j !== Rp.hero) return; const st = sts[j]; const [hx, hy, r] = headOf(st), tilt = Math.sin(t * 1.7) * .1;
        // balance pole
        const hand = lp(st, 0, -50); ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(tilt); ctx.fillStyle = "#B07A4A"; rr(ctx, -360, -9, 720, 18, 9); ctx.fill(); ol(ctx, 5);
        [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 360, 0, 22, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); }); ctx.restore();
        // stacked boxes on the head
        let y = hy - r * 1.05; const n = items.length;
        items.forEach((it, i) => { const w = BW[i] ?? 140, fallT = i === n - 1 ? tSk : (i === n - 2 ? tCa : 1e9), sway = Math.sin(t * 1.7 + i * .4) * (8 + i * 6);
          const bx = hx + sway, by = y; y -= w * .5 + 4;
          if (t < fallT){ box(bx, by, w, it.text, tilt * (1 + i * .3), i === n - 1 ? "#F7B7A3" : "#E0A458"); return; }
          const k = t - fallT;
          if (i === n - 1){ const px = bx + 220 * k, py = by + 900 * k * k; if (py < 2600) box(px, py, w, it.text, k * 5, "#F7B7A3");
            if (k < 1.2){ ctx.save(); ctx.globalAlpha = 1 - k / 1.2; ctx.strokeStyle = CREAM; ctx.lineWidth = 6; for (let l = 0; l < 3; l++){ ctx.beginPath(); ctx.moveTo(px - 40 + l * 40, py - 120 - l * 10); ctx.lineTo(px - 40 + l * 40, py - 220 - l * 10); ctx.stroke(); } ctx.restore(); } }
          else { const fallD = .55, landY = NY + 30; let py, rot;
            if (k < fallD){ const q = k / fallD; py = lerp(by, landY, q * q); rot = q * 2; } else { const kk = k - fallD; py = landY + 40 * Math.exp(-kk * 3) * Math.sin(kk * 12); rot = 2 * Math.exp(-kk * 4); }
            box(bx - 60 * cl01(k / fallD), py, w, it.text, rot, "#E0A458");
            if (k > fallD){ burstFx(ctx, bx - 60, landY - 80, k - fallD, GREEN, 12, 220); stampBox(ctx, "AMAN ✓", bx + 200, landY - 200, k - fallD - .1, GREEN, 56, .08); } } }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const R2 = f.rope || {}; if (R2.skipCue) add(cueT(s, R2.skipCue, .3, i), "whoosh"); if (R2.netCue) add(cueT(s, R2.netCue, .4, i), "pop"); if (R2.catchCue){ const a = cueT(s, R2.catchCue, .5, i); add(a, "whoosh"); add(a + .55, "chime"); } });

  /* ================= _bagasi: items hop into the car boot ================= */
  // f.boot: {items:[{text, kind: tube|paper|laptop|reel, cue}], listTitle, closeCue, litCue, litText, carX=720}
  function itemShape(ctx, kind, s0, t, scared){
    ctx.save(); ctx.scale(s0, s0);
    if (kind === "tube"){ rr(ctx, -40, -170, 80, 170, 30); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); ctx.fillStyle = CREAM; ctx.fillRect(-40, -120, 80, 18); }
    else if (kind === "paper"){ for (let i = 0; i < 4; i++){ rr(ctx, -62 + i * 2, -26 - i * 22, 124, 26, 4); ctx.fillStyle = i % 2 ? "#F3D9B5" : PAPER; ctx.fill(); ol(ctx, 4); } }
    else if (kind === "laptop"){ rr(ctx, -80, -90, 160, 84, 10); ctx.fillStyle = "#9AA3AF"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -48, 12, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0, -70, 70, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -70, 50, 0, TAU); ctx.fillStyle = "#2B2B33"; ctx.fill();
      ctx.strokeStyle = "#555A66"; ctx.lineWidth = 4; for (let r = 20; r < 50; r += 9){ ctx.beginPath(); ctx.arc(0, -70, r, 0, TAU); ctx.stroke(); } ctx.beginPath(); ctx.arc(0, -70, 16, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); }
    // eyes
    const ey = kind === "tube" ? -70 : kind === "paper" ? -60 : kind === "laptop" ? -100 : -150, lk = scared ? Math.sin(t * 6) * 6 : 0, blink = ((t * .7 + ey) % 2.6) < .1;
    [-1, 1].forEach(d => { if (blink){ ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(d * 20 - 10, ey); ctx.lineTo(d * 20 + 10, ey); ctx.stroke(); return; }
      ctx.beginPath(); ctx.ellipse(d * 20, ey, 13, 16, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(d * 20 + lk, ey + 3, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    if (scared){ ctx.fillStyle = "#9FD3E8"; ctx.beginPath(); ctx.ellipse(44, ey - 20, 8, 12, 0, 0, TAU); ctx.fill(); }
    ctx.restore(); }
  TT.scene("j2611221020124_bagasi", "Cerita: barang melompat ke bagasi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bt = Object.assign({ carX: 700, listTitle: "CHECKLIST", litText: "STAN MENYALA!" }, f.boot || {}), its = (Bt.items || []).map((it, j) => Object.assign({ T: tOf(s, it, .2 + j * .15, idx), j }, it));
    const tCl = T(s, Bt.closeCue, .4, idx), tLit = T(s, Bt.litCue, .4, idx), cx = Bt.carX, trunk = [cx + 260, 1460];
    const lid = t < tCl ? 1 : 1 - eBack(cl01((t - tCl) / .45)), kcl = t - tCl, carSq = kcl > .35 && kcl < .9 ? Math.sin((kcl - .35) / .55 * Math.PI * 3) * .03 * (1 - (kcl - .35) / .55) : 0;
    const slotX = j => cx - 300 + j * 160;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { car: [cx + 120, 1300, 1.15] },
      back: () => {
        // car (side view, nose left, boot right)
        const bob = Math.sin(t * 9) * 1.5; ctx.save(); ctx.translate(cx, 1600 + bob); ctx.scale(1 + carSq, 1 - carSq);
        ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 40, 360, 22, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-330, -40); ctx.lineTo(-330, -150); ctx.quadraticCurveTo(-320, -190, -260, -200); ctx.lineTo(-170, -205); ctx.quadraticCurveTo(-110, -330, -20, -335); ctx.lineTo(200, -335); ctx.quadraticCurveTo(270, -330, 300, -250); ctx.lineTo(320, -190); ctx.lineTo(320, -40); ctx.closePath();
        ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 7);
        ctx.beginPath(); ctx.moveTo(-150, -210); ctx.quadraticCurveTo(-100, -305, -20, -308); ctx.lineTo(60, -308); ctx.lineTo(60, -210); ctx.closePath(); ctx.fillStyle = "#CFE6F2"; ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.moveTo(85, -210); ctx.lineTo(85, -308); ctx.lineTo(190, -308); ctx.quadraticCurveTo(250, -300, 270, -210); ctx.closePath(); ctx.fillStyle = "#CFE6F2"; ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = GOLD; rr(ctx, -335, -150, 26, 30, 6); ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; rr(ctx, 300, -170, 22, 40, 6); ctx.fill(); ol(ctx, 4);
        // boot opening
        ctx.fillStyle = "#2B1A12"; rr(ctx, 200, -230, 120, 150, 10); ctx.fill();
        [-210, 210].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -30, 70, 0, TAU); ctx.fillStyle = "#2B2B33"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(wx, -30, 30, 0, TAU); ctx.fillStyle = "#C9CED6"; ctx.fill(); ol(ctx, 4);
          ctx.save(); ctx.translate(wx, -30); ctx.rotate(t * .5); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.stroke(); ctx.restore(); });
        // lid
        ctx.save(); ctx.translate(320, -240); ctx.rotate(-lid * 1.9); ctx.fillStyle = "#5B7DB1"; rr(ctx, -10, 0, 22, 170, 8); ctx.fill(); ol(ctx, 6); ctx.restore();
        ctx.restore();
        // exhaust puffs after close
        if (kcl > 0){ for (let i = 0; i < 5; i++){ const q = ((kcl * .9 + i / 5) % 1); ctx.save(); ctx.globalAlpha = (1 - q) * .6; ctx.beginPath(); ctx.arc(cx + 350 + q * 160, 1570 - q * 60, 20 + q * 40, 0, TAU); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ctx.restore(); } }
      },
      front: () => {
        its.forEach(it => { const k = t - it.T, x0 = slotX(it.j), y0 = 1640, sc = .9; const waiting = k < 0;
          if (k > .75) return;
          if (waiting){ const hop = Math.abs(Math.sin(t * 5 + it.j)) * 16; ctx.save(); ctx.translate(x0, y0 - hop); itemShape(ctx, it.kind, sc, t, it.kind === "reel" && t > its[0].T); ctx.restore();
            tagPill(ctx, String(it.text).toUpperCase(), x0, y0 + 40, 28, CREAM, BROWN, 200); return; }
          const q = cl01(k / .75), x = lerp(x0, trunk[0], q), y = lerp(y0, trunk[1], q) - Math.sin(q * Math.PI) * 380, sq = k < .12 ? .25 * Math.sin(k / .12 * Math.PI) : 0;
          ctx.save(); ctx.translate(x, y); ctx.rotate(q * TAU * .5); ctx.scale(1 + sq, 1 - sq); itemShape(ctx, it.kind, sc * (1 - q * .35), t, false); ctx.restore();
          if (q > .85) burstFx(ctx, trunk[0], trunk[1] - 60, (k - .64) * 2, HL, 8, 150); });
        if (t > tLit){ const k = t - tLit; glowAt(ctx, cx, 1300, 500 * cl01(k / .5), GOLD, .4); }
      },
      over: () => {
        // checklist sheet
        const k0 = t - (Bt.sheetCue ? T(s, Bt.sheetCue, .3, idx) : (its[0] ? its[0].T - .6 : 0)); if (k0 < 0) return; const q = eBack(cl01(k0 / .5)), H = 110 + its.length * 74, W = 520;
        ctx.save(); ctx.translate(Bt.sheetX ?? 640, 250 + H / 2 + Math.sin(t * 1.6) * 5); ctx.rotate(-.025); ctx.scale(q, q);
        ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -W / 2 + 12, -H / 2 + 14, W, H, 18); ctx.fill(); rr(ctx, -W / 2, -H / 2, W, H, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = ORANGE; rr(ctx, -W / 2, -H / 2, W, 84, [18, 18, 0, 0]); ctx.fill(); ol(ctx, 6);
        textC(ctx, Bt.listTitle, 0, -H / 2 + 58, fit(ctx, Bt.listTitle, W - 60, 46, 900), CREAM, 900);
        its.forEach((it, j) => { const y = -H / 2 + 136 + j * 74, kk = t - it.T - .2; rr(ctx, -W / 2 + 40, y - 26, 48, 48, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
          font(ctx, 800, 42, FAM); ctx.fillStyle = kk > 0 ? hexA(BROWN, .55) : BROWN; ctx.fillText(it.text, -W / 2 + 116, y + 15);
          if (kk > 0){ const p = cl01(kk / .3); ctx.save(); ctx.strokeStyle = GREEN; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-W / 2 + 48, y);
            ctx.lineTo(-W / 2 + 48 + 14 * cl01(p * 2), y + 16 * cl01(p * 2)); if (p > .5) ctx.lineTo(-W / 2 + 62 + 34 * cl01((p - .5) * 2), y + 16 - 44 * cl01((p - .5) * 2)); ctx.stroke(); ctx.restore();
            const sw = ctx.measureText(it.text).width; ctx.fillStyle = hexA(GREEN, .7); ctx.fillRect(-W / 2 + 116, y + 2, sw * cl01(kk / .4), 6); } });
        ctx.restore();
        if (t > tLit) stampBox(ctx, Bt.litText, 690, 800, t - tLit, GREEN, 66, -.08);
        if (t > tLit) confetti(ctx, 540, 900, t - tLit, 30); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bt = f.boot || {}; (Bt.items || []).forEach((it, j) => { const a = tOf(s, it, .2 + j * .15, i); add(a, "whoosh"); add(a + .7, "pop"); add(a + .25, "ping"); });
    if (Bt.closeCue) add(cueT(s, Bt.closeCue, .4, i) + .3, "pop"); if (Bt.litCue) add(cueT(s, Bt.litCue, .4, i), "chime"); });

  /* ================= _popcorn: topics pop out of the meeting pot ================= */
  // f.pop: {topics:[{text, cue, x, y}], spreadCue (small popcorn fountain + rising pile), potLabel="RAPAT", tableY=1460}
  function popcornBlob(ctx, x, y, r, rot, seed){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
    for (let i = 0; i < 7; i++){ const a = i / 7 * TAU + rnd(seed + i) * .4, rr0 = r * (.55 + rnd(seed + i * 3) * .25); ctx.moveTo(Math.cos(a) * rr0 + r * .45, Math.sin(a) * rr0); ctx.arc(Math.cos(a) * rr0, Math.sin(a) * rr0, r * .45, 0, TAU); }
    ctx.fillStyle = "#FFF7E0"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(3, r * .08); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * .62, 0, TAU); ctx.fillStyle = "#FFF7E0"; ctx.fill();
    ctx.fillStyle = "rgba(246,195,67,.55)"; ctx.beginPath(); ctx.arc(r * .2, r * .25, r * .3, 0, TAU); ctx.fill(); ctx.restore(); }
  TT.scene("j2611221020124_popcorn", "Cerita: topik meletup seperti popcorn", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Pp = Object.assign({ potLabel: "RAPAT", tableY: 1460 }, f.pop || {}), tSp = T(s, Pp.spreadCue, .3, idx), TY = Pp.tableY;
    const tps = (Pp.topics || []).map((o, j) => Object.assign({ T: tOf(s, o, .2 + j * .2, idx), j }, o));
    const potX = 540, potY = TY - 10, rattle = tps.some(o => t > o.T - .5) ? Math.sin(t * 40) * 4 : Math.sin(t * 20) * 1;
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      back: () => { if (t <= tSp) return; const k = t - tSp;
          for (let i = 0; i < 26; i++){ const life = 1.3, q = ((k + rnd(i) * life) % life) / life, born = k - q * life; if (born < 0) continue;
            const a = -Math.PI / 2 + (rnd(i + 5) - .5) * 2.4, v = 900 + rnd(i + 2) * 500, x = potX + Math.cos(a) * v * q * life, y = potY - 190 + Math.sin(a) * v * q * life + 1100 * Math.pow(q * life, 2);
            popcornBlob(ctx, x, y, 26 + rnd(i) * 14, q * 6 + i, i * 7); }
      },
      front: () => {
        // table
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(-600, TY + 40, 2300, 30); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-600, TY + 30, 2300, 500); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-600, TY + 30, 2300, 500);
        ctx.fillStyle = "#C47A48"; rr(ctx, -620, TY - 14, 2340, 52, 14); ctx.fill(); ol(ctx, 6);
        [[200, -1], [880, 1]].forEach(([x], i) => { ctx.save(); ctx.translate(x, TY - 12); ctx.rotate(Math.sin(i * 2.3) * .08); ctx.fillStyle = PAPER; rr(ctx, -80, -12, 160, 16, 3); ctx.fill(); ol(ctx, 4); ctx.restore(); });
        // pot
        ctx.save(); ctx.translate(potX, potY); ctx.fillStyle = "#555A66"; rr(ctx, -170, -170, 340, 170, 30); ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#6E7480"; ctx.fillRect(-170, -150, 340, 26);
        [-1, 1].forEach(d => { rr(ctx, d * 170 - (d > 0 ? 0 : 50), -130, 50, 26, 10); ctx.fillStyle = OUT; ctx.fill(); });
        textC(ctx, Pp.potLabel, 0, -50, fit(ctx, Pp.potLabel, 280, 50, 900), CREAM, 900);
        // lid
        const lidUp = t > tps[0]?.T - .3 ? 40 + Math.abs(Math.sin(t * 13)) * 30 : Math.abs(rattle) * 2; ctx.save(); ctx.translate(rattle * 3, -170 - lidUp); ctx.rotate(rattle * .04 + (lidUp > 30 ? -.25 : 0));
        ctx.beginPath(); ctx.ellipse(0, 0, 180, 30, 0, Math.PI, 0); ctx.fillStyle = "#6E7480"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -32, 18, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.restore();
        ctx.restore();
        // fountain + pile of small popcorn
        if (t > tSp){ const k = t - tSp;
          const lvl = Math.min(150, k * 60);
          for (let i = 0; i < 46; i++){ const x = -100 + (i % 23) * 56 + (i > 22 ? 28 : 0), y = TY + 40 - lvl + (i > 22 ? 40 : 0) + Math.sin(t * 3 + i) * 5 + rnd(i) * 30; popcornBlob(ctx, x, y, 34, i, i * 3); } }
        // labelled topic popcorns
        tps.forEach(o => { const k = t - o.T; if (k < 0) return; const q = cl01(k / .7), tx = o.x ?? 540, ty = o.y ?? 600;
          const x = lerp(potX, tx, eOut(q)) + Math.sin(t * 1.5 + o.j) * 14, y = lerp(potY - 200, ty, eOut(q)) - Math.sin(q * Math.PI) * 260 + Math.sin(t * 2.2 + o.j * 2) * 12, r = 132 * eBack(cl01(k / .5));
          popcornBlob(ctx, x, y, r, Math.sin(t + o.j) * .1, 40 + o.j * 11);
          const { L, size } = lines2(ctx, String(o.text).toUpperCase(), r * 1.5, 46, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center";
          L.forEach((l, i) => ctx.fillText(l, x, y + (i - (L.length - 1) / 2) * size * 1.08 + size * .36)); ctx.textAlign = "left";
          if (k < .9) burstFx(ctx, potX, potY - 200, k, HL, 8, 160); });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Pp = f.pop || {}; (Pp.topics || []).forEach((o, j) => add(tOf(s, o, .2 + j * .2, i), "pop")); if (Pp.spreadCue){ const a = cueT(s, Pp.spreadCue, .3, i); for (let k = 0; k < 5; k++) add(a + k * .3, "pop"); } });

  /* ================= _bowling: agenda bumpers ================= */
  // f.lane: {roll1 (at, default .3), roll1Dur=2.6, bumperCue, roll2Cue, hitCue, ballText="OBROLAN", pinText="SASARAN", bumperText="AGENDA", gutterText, hitText}
  TT.scene("j2611221020124_bowling", "Cerita: jalur bowling + pembatas agenda", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Ln = Object.assign({ roll1: .3, roll1Dur: 2.6, ballText: "OBROLAN", pinText: "SASARAN", bumperText: "AGENDA", hitText: "STRIKE!" }, f.lane || {});
    const tB = T(s, Ln.bumperCue, .4, idx), tR2 = T(s, Ln.roll2Cue, .55, idx), tH = T(s, Ln.hitCue, .85, idx) + .15, bq = eBack(cl01((t - tB) / .5));
    const yD = d => 1720 - 1080 * d, wD = d => 300 * (1 - .68 * d), rD = d => 78 * (1 - .6 * d);
    const P = (d, l) => [540 + l * wD(d), yD(d)];
    // ball state
    let ball = null;
    const k1 = t - Ln.roll1; if (k1 > 0 && k1 < Ln.roll1Dur + .3){ const q = cl01(k1 / Ln.roll1Dur), d = q, l = q < .55 ? .1 - q * .6 : -.23 - (q - .55) * 2.6; ball = { d, l: Math.max(-1.18, l), spin: k1 * 8, a: 1 - cl01((k1 - Ln.roll1Dur) / .3) }; }
    if (t > tR2 && tH > tR2){ const q = cl01((t - tR2) / (tH - tR2)); if (q < 1){ const z = Math.abs(((q * 3.2 + .25) % 2) - 1) * 2 - 1; ball = { d: q, l: z * .86 * (1 - q * .9), spin: (t - tR2) * 9, a: 1 }; } }
    const hit = t - tH;
    base(ctx, s, t, {
      envDraw: (ctx2, c) => {
        layer(ctx, c, .3, () => { const g = ctx.createLinearGradient(0, -400, 0, 1400); g.addColorStop(0, "#1E1633"); g.addColorStop(1, "#3B2A5A"); ctx.fillStyle = g; ctx.fillRect(-900, -900, 2900, 2600);
          for (let i = 0; i < 7; i++){ const x = -200 + i * 240; ctx.fillStyle = hexA(i % 2 ? "#F08C2E" : "#7FC8C0", .25 + .1 * Math.sin(t * 2 + i)); ctx.fillRect(x, 300, 18, 900); }
          ctx.save(); ctx.shadowColor = HL; ctx.shadowBlur = 30; textC(ctx, Ln.pinText, 540, 380, fit(ctx, Ln.pinText, 520, 80, 900), "#FFD9A8", 900); ctx.restore(); });
        layer(ctx, c, 1, () => {
          ctx.fillStyle = "#2B2140"; ctx.fillRect(-900, 560, 2900, 1700);
          // gutters
          ctx.beginPath(); ctx.moveTo(P(1, -1)[0] - 30, yD(1)); ctx.lineTo(P(1, 1)[0] + 30, yD(1)); ctx.lineTo(P(0, 1)[0] + 90, yD(0) + 400); ctx.lineTo(P(0, -1)[0] - 90, yD(0) + 400); ctx.closePath(); ctx.fillStyle = "#4A4A58"; ctx.fill();
          // lane
          ctx.beginPath(); ctx.moveTo(...P(1, -1)); ctx.lineTo(...P(1, 1)); ctx.lineTo(P(-.37, 1)[0], yD(-.37)); ctx.lineTo(P(-.37, -1)[0], yD(-.37)); ctx.closePath();
          const g = ctx.createLinearGradient(0, yD(1), 0, yD(0)); g.addColorStop(0, "#C9925A"); g.addColorStop(1, "#E8B77F"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
          ctx.strokeStyle = "rgba(43,26,18,.15)"; ctx.lineWidth = 3; for (let i = -6; i <= 6; i++){ ctx.beginPath(); ctx.moveTo(...P(1, i / 6.5)); ctx.lineTo(P(-.37, i / 6.5)[0], yD(-.37)); ctx.stroke(); }
          for (let i = -2; i <= 2; i++){ const p = P(.3, i * .3); ctx.beginPath(); ctx.moveTo(p[0], p[1] - 24); ctx.lineTo(p[0] - 12, p[1] + 10); ctx.lineTo(p[0] + 12, p[1] + 10); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); }
          // pins
          const pins = []; for (let r = 3; r >= 0; r--) for (let i = 0; i <= r; i++) pins.push([(i - r / 2) * .32, 1.02 + r * .025]);
          pins.forEach(([l, d], j) => { let [x, y] = P(Math.min(d, 1.08), l); const sc = 1 - .6 * Math.min(d, 1); let rot = 0, a = 1;
            if (hit > 0){ const q = hit, dir = (rnd(j) - .5) * 2; x += dir * 500 * q; y += -700 * q + 1300 * q * q; rot = dir * q * 9; a = cl01(1 - (q - .8) / .5); }
            if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc * 1.5, sc * 1.5);
            ctx.beginPath(); ctx.moveTo(0, -60); ctx.bezierCurveTo(16, -60, 14, -36, 8, -30); ctx.bezierCurveTo(26, -10, 22, 10, 12, 16); ctx.lineTo(-12, 16); ctx.bezierCurveTo(-22, 10, -26, -10, -8, -30); ctx.bezierCurveTo(-14, -36, -16, -60, 0, -60); ctx.closePath();
            ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.fillRect(-9, -34, 18, 6); ctx.restore(); });
          // bumpers
          if (bq > 0){ [-1, 1].forEach(sd => { ctx.beginPath(); const hb = 34 * bq; ctx.moveTo(P(1, sd * 1.02)[0], yD(1)); ctx.lineTo(P(1, sd * 1.02)[0], yD(1) - hb * .4); ctx.lineTo(P(-.2, sd * 1.06)[0], yD(-.2) - hb * 1.3); ctx.lineTo(P(-.2, sd * 1.06)[0], yD(-.2)); ctx.closePath();
            ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5);
            for (let i = 0; i < 4; i++){ const d = .08 + i * .22, p = P(d, sd * 1.04); ctx.save(); ctx.globalAlpha = bq; ctx.translate(p[0], p[1] - hb * (1.2 - d * .8) * .55); ctx.rotate(sd * (.55 - d * .3)); font(ctx, 900, 30 * (1 - .55 * d), FAM); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(Ln.bumperText, 0, 10); ctx.textAlign = "left"; ctx.restore(); } }); }
          // ball
          if (ball){ const [x, y] = P(ball.d, ball.l), r = rD(ball.d); ctx.save(); ctx.globalAlpha = ball.a; ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(x, y + r * .9, r * .9, r * .25, 0, 0, TAU); ctx.fill();
            ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = HL; ctx.fill(); ol(ctx, 6); ctx.save(); ctx.clip(); ctx.rotate(ball.spin);
            ctx.fillStyle = OUT; [[-.3, -.3], [.1, -.4], [-.05, .05]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a * r, b * r, r * .12, 0, TAU); ctx.fill(); }); ctx.restore();
            ctx.beginPath(); ctx.arc(-r * .35, -r * .4, r * .2, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fill(); ctx.restore();
            if (ball.d < .5) tagPill(ctx, Ln.ballText, x, y - r - 40, 34 * (1 - ball.d * .5), CREAM, BROWN, 320);
            for (let i = 1; i < 5; i++){ ctx.save(); ctx.globalAlpha = .15 * (5 - i); ctx.beginPath(); ctx.arc(x, y + i * 30, r * (1 - i * .1), 0, TAU); ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } }
        });
      },
      front: () => { if (hit > 0 && hit < 1) burstFx(ctx, 540, yD(1) - 40, hit, GOLD, 16, 280); },
      over: (ctx2, c) => { const k1g = t - Ln.roll1 - Ln.roll1Dur * .85; if (Ln.gutterText && k1g > 0 && t < tB) stampBox(ctx, Ln.gutterText, 300, 560, k1g, RED, 58, -.14);
        if (hit > 0){ stampBox(ctx, Ln.hitText, 540, 520, hit, GREEN, 76, -.08); confetti(ctx, 540, 700, hit, 34); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Ln = Object.assign({ roll1: .3, roll1Dur: 2.6 }, f.lane || {}); add(Ln.roll1, "whoosh"); add(Ln.roll1 + Ln.roll1Dur * .85, "ping");
    if (Ln.bumperCue) add(cueT(s, Ln.bumperCue, .4, i), "pop"); if (Ln.roll2Cue){ const a = cueT(s, Ln.roll2Cue, .55, i); add(a, "whoosh"); add(a + .5, "pop"); add(a + 1, "pop"); } if (Ln.hitCue){ add(cueT(s, Ln.hitCue, .85, i) + .15, "pop"); add(cueT(s, Ln.hitCue, .85, i) + .3, "chime"); } });

  /* ================= _mejaputar: lazy-susan agenda ================= */
  // f.tray: {topics:[{text, min}], sendCue (agenda sheet), topicsCue (dishes appear), minCue (minute chips), doneCue (first rotation), endCue (last decided), title="AGENDA"}
  TT.scene("j2611221020124_mejaputar", "Cerita: meja putar agenda", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Tr = Object.assign({ title: "AGENDA" }, f.tray || {}), tp = Tr.topics || [], n = tp.length || 3;
    const tSend = T(s, Tr.sendCue, .3, idx), tTop = T(s, Tr.topicsCue, .5, idx), tMin = T(s, Tr.minCue, .65, idx), tD0 = T(s, Tr.doneCue, .75, idx), tD1 = T(s, Tr.endCue, .95, idx);
    const step = Math.max(.6, (tD1 - tD0) / Math.max(1, n - 1)), doneAt = j => tD0 + j * step;
    // rotation: dish j comes to the front at doneAt(j)
    let A = 0; for (let j = 1; j < n; j++){ const a0 = doneAt(j) - .55; A += -(TAU / n) * eBack(cl01((t - a0) / .55)); }
    A += Math.sin(t * .8) * .03;
    const CX = 540, CY = 1400;
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      front: () => {
        // table
        ctx.fillStyle = "#6B3A22"; ctx.fillRect(CX - 520, CY, 1040, 400); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(CX - 520, CY, 1040, 400);
        ctx.beginPath(); ctx.ellipse(CX, CY, 520, 150, 0, 0, TAU); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 7);
        ctx.beginPath(); ctx.ellipse(CX, CY - 12, 340, 96, 0, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fill(); ol(ctx, 5);
        ctx.save(); ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 3; for (let i = 0; i < 8; i++){ const a = A * 1 + i / 8 * TAU; ctx.beginPath(); ctx.moveTo(CX, CY - 12); ctx.lineTo(CX + Math.sin(a) * 340, CY - 12 + Math.cos(a) * 96); ctx.stroke(); } ctx.restore();
        // dishes, back to front
        const D = tp.map((o, j) => { const a = A + j * TAU / n; return { o, j, a, x: CX + Math.sin(a) * 250, y: CY - 14 + Math.cos(a) * 66, z: Math.cos(a) }; }).sort((p, q) => p.z - q.z);
        D.forEach(({ o, j, x, y, z }) => { const k = t - tTop - j * .25; if (k < 0) return; const sc = (.72 + .28 * (z + 1) / 2) * eBack(cl01(k / .4)), kd = t - doneAt(j);
          ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
          ctx.beginPath(); ctx.ellipse(0, 0, 130, 34, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
          // revealed medal
          if (kd > 0){ const q = eBack(cl01((kd - .15) / .4)); ctx.save(); ctx.translate(0, -70); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 6);
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-26, 2); ctx.lineTo(-6, 22); ctx.lineTo(28, -20); ctx.stroke(); ctx.restore(); }
          // cover
          const lift = kd > 0 ? eOut(cl01(kd / .5)) : 0; ctx.save(); ctx.translate(lift * 160, -lift * 260); ctx.rotate(lift * .7); ctx.globalAlpha *= 1 - cl01((kd - .6) / .4);
          ctx.beginPath(); ctx.ellipse(0, -4, 110, 100, 0, Math.PI, 0); ctx.closePath(); ctx.fillStyle = "#D6DCE4"; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.arc(0, -108, 14, 0, TAU); ctx.fillStyle = "#AEB6C2"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.beginPath(); ctx.ellipse(-46, -54, 14, 30, -.4, 0, TAU); ctx.fill();
          textC(ctx, String(j + 1), 0, -28, 64, BROWN, 900); ctx.restore();
          ctx.restore();
          // minute chip
          const km = t - tMin - j * .15; if (km > 0 && kd < .4) tagPill(ctx, (o.min || 15) + "'", x + 110 * sc, y - 150 * sc, 34, ORANGE, CREAM, 160, km);
          if (kd > 0 && kd < 1) burstFx(ctx, x, y - 70, kd - .1, GREEN, 10, 170); });
      },
      over: () => {
        const k0 = t - tSend; if (k0 < 0) return; const fly = eOut(cl01(k0 / .6)), W = 640, H = 120 + n * 70;
        ctx.save(); ctx.translate(lerp(-400, 540, fly), lerp(120, 240 + H / 2, fly) + Math.sin(t * 1.5) * 5); ctx.rotate(lerp(-.6, -.03, fly));
        ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -W / 2 + 12, -H / 2 + 14, W, H, 16); ctx.fill(); rr(ctx, -W / 2, -H / 2, W, H, 16); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
        textC(ctx, Tr.title, 0, -H / 2 + 66, 52, ORANGE, 900); ctx.fillStyle = ORANGE; ctx.fillRect(-W / 2 + 40, -H / 2 + 86, W - 80, 5);
        tp.forEach((o, j) => { const y = -H / 2 + 146 + j * 70, kr = t - tSend - .45 - j * .3; if (kr < 0) return; ctx.save(); ctx.globalAlpha *= cl01(kr / .3);
          ctx.beginPath(); ctx.arc(-W / 2 + 64, y - 14, 24, 0, TAU); ctx.fillStyle = t > doneAt(j) + .2 ? GREEN : ORANGE; ctx.fill(); textC(ctx, t > doneAt(j) + .2 ? "✓" : String(j + 1), -W / 2 + 64, y - 2, 30, CREAM, 900);
          fit(ctx, o.text, W - 260, 40, 800); ctx.fillStyle = BROWN; ctx.fillText(o.text, -W / 2 + 108, y); font(ctx, 900, 36, FAM); ctx.fillStyle = ORANGE; ctx.textAlign = "right"; ctx.fillText((o.min || 15) + " mnt", W / 2 - 36, y); ctx.textAlign = "left"; ctx.restore(); });
        ctx.restore();
        if (k0 < .9) burstFx(ctx, 540, 240 + H / 2, k0 - .4, HL, 8, 260); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Tr = f.tray || {}, n = (Tr.topics || []).length || 3; if (Tr.sendCue) add(cueT(s, Tr.sendCue, .3, i), "whoosh");
    if (Tr.topicsCue) for (let j = 0; j < n; j++) add(cueT(s, Tr.topicsCue, .5, i) + j * .25, "pop"); if (Tr.minCue) add(cueT(s, Tr.minCue, .65, i), "ping");
    if (Tr.doneCue){ const a = cueT(s, Tr.doneCue, .75, i), b = cueT(s, Tr.endCue, .95, i), st = Math.max(.6, (b - a) / Math.max(1, n - 1)); for (let j = 0; j < n; j++){ add(a + j * st, "chime"); if (j) add(a + j * st - .55, "whoosh"); } } });

  /* ================= _gulungan: endless paper roll of rows ================= */
  // f.roll: {startCue, fastCue, countCue, countText="3.000 BARIS", deskX=800}
  let ROLL = null;
  function rollPath(dx){ if (ROLL && ROLL.dx === dx) return ROLL;
    const ctrl = [[0, 1210], [-10, 820], [60, 600], [200, 600], [260, 820], [250, 1450], [180, 1650], [-150, 1665], [-600, 1668], [-1500, 1670]].map(p => [p[0] + dx, p[1]]);
    const pts = []; for (let i = 0; i < ctrl.length - 1; i++){ const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
      for (let k = 0; k < 16; k++){ const u = k / 16, u2 = u * u, u3 = u2 * u; pts.push([0, 1].map(d => .5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * u3))); } }
    pts.push(ctrl[ctrl.length - 1]); const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    ROLL = { dx, pts, L }; return ROLL; }
  TT.scene("j2611221020124_gulungan", "Cerita: gulungan kertas data", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Ro = Object.assign({ deskX: 800, countText: "3.000 BARIS" }, f.roll || {}), tS = T(s, Ro.startCue, .5, idx), tFa = T(s, Ro.fastCue, .8, idx), tCn = T(s, Ro.countCue, .6, idx);
    const DX = Ro.deskX, path = rollPath(DX - 5);
    const len = t < tS ? 0 : (Math.min(t, tFa) - tS) * 700 + Math.max(0, t - tFa) * 1300, scroll = t < tS ? 0 : (t - tS) * 260 + Math.max(0, t - tFa) * 500;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 120 },
      spots: { roll: [DX + 60, 900, .85] },
      back: () => {
        // desk + laptop
        ctx.fillStyle = "#8E4E2E"; ctx.fillRect(DX - 190, 1400, 22, 240); ctx.fillRect(DX + 168, 1400, 22, 240); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(DX - 190, 1400, 22, 240); ctx.strokeRect(DX + 168, 1400, 22, 240);
        rr(ctx, DX - 220, 1370, 440, 40, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
        ctx.save(); ctx.translate(DX, 1370); rr(ctx, -130, -14, 260, 16, 6); ctx.fillStyle = "#9AA3AF"; ctx.fill(); ol(ctx, 5);
        rr(ctx, -110, -170, 220, 156, 10); ctx.fillStyle = "#555A66"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = t > tS - .4 ? "#E9F4EC" : "#CFE6F2"; ctx.fillRect(-96, -156, 192, 128);
        ctx.fillStyle = "rgba(62,155,90,.35)"; for (let r = 0; r < 6; r++) ctx.fillRect(-90, -150 + r * 20 - (scroll % 20), 180, 2); ctx.restore();
      },
      mid: () => {
        if (len <= 0) return; const { pts, L } = path, W = 170;
        // build ribbon polygon
        const left = [], right = [], ns = [];
        for (let i = 0; i < pts.length && L[i] <= len; i++){ const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m;
          const w = W / 2 * (i === 0 ? .9 : 1); left.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); right.push([pts[i][0] - nx * w, pts[i][1] - ny * w]); ns.push([nx, ny, L[i]]); }
        if (left.length < 2) return;
        ctx.beginPath(); left.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]); ctx.closePath();
        ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
        ctx.save(); ctx.clip();
        // rows
        for (let i = 1; i < left.length; i++){ const L0 = ns[i - 1][2], L1 = ns[i][2], off = scroll % 44; for (let rl = Math.ceil((L0 - off) / 44) * 44 + off; rl < L1; rl += 44){ const q = (rl - L0) / (L1 - L0 || 1);
          const lx = lerp(left[i - 1][0], left[i][0], q), ly = lerp(left[i - 1][1], left[i][1], q), rx = lerp(right[i - 1][0], right[i][0], q), ry = lerp(right[i - 1][1], right[i][1], q);
          ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke();
          const rn = Math.floor((rl - scroll) / 44); ctx.strokeStyle = (Math.abs(rn) % 7 === 3) ? hexA(ORANGE, .7) : "rgba(43,26,18,.35)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(lerp(lx, rx, .12), lerp(ly, ry, .12) + 0); ctx.lineTo(lerp(lx, rx, .4), lerp(ly, ry, .4)); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(lerp(lx, rx, .55), lerp(ly, ry, .55)); ctx.lineTo(lerp(lx, rx, .88), lerp(ly, ry, .88)); ctx.stroke(); } }
        ctx.restore();
        // curl at the head of the paper
        const e = left.length - 1, hx = (left[e][0] + right[e][0]) / 2, hy = (left[e][1] + right[e][1]) / 2;
        ctx.beginPath(); ctx.arc(hx, hy, 36 + Math.sin(t * 9) * 4, 0, TAU); ctx.fillStyle = "#F3EDE0"; ctx.fill(); ol(ctx, 5);
        // speed lines when fast
        if (t > tFa){ ctx.save(); ctx.strokeStyle = hexA(CREAM, .8); ctx.lineWidth = 7; ctx.lineCap = "round"; for (let i = 0; i < 8; i++){ const q = (t * 2 + i / 8) % 1, p = pts[Math.min(pts.length - 1, 4 + Math.floor(q * 40))]; ctx.globalAlpha = Math.sin(q * Math.PI) * .8; ctx.beginPath(); ctx.moveTo(p[0] + 110, p[1] - 30 + i * 6); ctx.lineTo(p[0] + 180, p[1] - 30 + i * 6); ctx.stroke(); } ctx.restore(); }
      }, midZ: 1,
      over: (ctx2, c) => { const k = t - tCn; if (k < 0) return; const p = c.toScreen(DX + 120, 560); tagPill(ctx, Ro.countText, clamp(p[0], 300, 780), clamp(p[1] - 40, 260, 900) + Math.sin(t * 3) * 6, 56, ORANGE, CREAM, 520, k);
        if (k < .9) burstFx(ctx, clamp(p[0], 300, 780), clamp(p[1] - 40, 260, 900), k - .1, GOLD, 10, 220); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Ro = f.roll || {}; if (Ro.startCue) add(cueT(s, Ro.startCue, .5, i), "whoosh"); if (Ro.fastCue){ const a = cueT(s, Ro.fastCue, .8, i); add(a, "whoosh"); add(a + .6, "whoosh"); } if (Ro.countCue) add(cueT(s, Ro.countCue, .6, i), "pop"); });

  /* ================= _ayakan: data sieve ================= */
  // f.sieve: {rows:[{text, keep: 0 (falls at cue1) | 1 (falls at cue2) | 2 (stays)}] or auto, cue1, cue2, keepCue, tag1, tag2, counts:[3000, 240, 12], unit="BARIS", y=880}
  TT.scene("j2611221020124_ayakan", "Cerita: ayakan data (filter)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sv = Object.assign({ y: 860, unit: "BARIS", counts: [3000, 240, 12], tag1: "CABANG: MEDAN", tag2: "BULAN: OKT" }, f.sieve || {});
    const t1 = T(s, Sv.cue1, .3, idx), t2 = T(s, Sv.cue2, .45, idx), tK = T(s, Sv.keepCue, .8, idx), SX = 540, SY = Sv.y;
    const rows = Sv.rows || [];
    const shake = (t > t1 && t < t1 + .9 ? Math.sin(t * 50) * 14 * (1 - (t - t1) / .9) : 0) + (t > t2 && t < t2 + .9 ? Math.sin(t * 50) * 14 * (1 - (t - t2) / .9) : 0);
    const nKeep = rows.filter(r => r.keep === 2).length;
    function strip(x, y, txt, rot, col, a, sc){ ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale((sc || 1) * 1.25, (sc || 1) * 1.25); rr(ctx, -84, -24, 168, 48, 8); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; if (a < .5) ctx.setLineDash([8, 8]); ctx.stroke(); ctx.setLineDash([]);
      font(ctx, 800, 26, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(txt, 0, 9); ctx.textAlign = "left"; ctx.restore(); }
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      spots: { sieve: [SX, SY - 40, 1.2] },
      back: () => {
        // ghosts pile (rows hidden for a while)
        rows.forEach((r, j) => { if (r.keep === 2) return; const tf = (r.keep ? t2 : t1) + j * .04, k = t - tf; if (k < 0) return;
          const rx = SX + (rnd(j) - .5) * 520, ry = SY - 20 + (rnd(j + 3) - .5) * 90, gx = SX - 260 + (j % 6) * 104 + (rnd(j) - .5) * 30, gy = 1230 + Math.floor(j / 6) * 60 + rnd(j + 1) * 20;
          const q = cl01(k / .8), x = lerp(rx, gx, q), y = lerp(ry, gy, q * q), a = lerp(1, .28, cl01((k - .5) / .5));
          strip(x, y + Math.sin(t * 2 + j) * (q >= 1 ? 4 : 0), r.text, (rnd(j + 7) - .5) * .5 + q * (rnd(j) - .5) * 2, a < .6 ? "#C9CED6" : CREAM, a); });
      },
      mid: () => {
        ctx.save(); ctx.translate(shake, 0);
        // bowl
        ctx.beginPath(); ctx.ellipse(SX, SY, 400, 120, 0, 0, Math.PI); ctx.lineTo(SX - 400, SY); ctx.closePath();
        ctx.beginPath(); ctx.moveTo(SX - 400, SY); ctx.bezierCurveTo(SX - 380, SY + 230, SX + 380, SY + 230, SX + 400, SY); ctx.ellipse(SX, SY, 400, 120, 0, 0, Math.PI, true); ctx.closePath();
        ctx.fillStyle = "rgba(233,226,214,.35)"; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 3; for (let g = -420; g <= 420; g += 26){ ctx.beginPath(); ctx.moveTo(SX + g, SY - 140); ctx.lineTo(SX + g * .8, SY + 200); ctx.stroke(); } for (let g = 0; g < 10; g++){ ctx.beginPath(); ctx.ellipse(SX, SY + g * 18, 400 - g * 30, 120 - g * 4, 0, 0, Math.PI); ctx.stroke(); } ctx.restore();
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        // rows inside
        rows.forEach((r, j) => { const tin = .25 + j * .07, k = t - tin; if (k < 0) return; const tf = r.keep === 2 ? 1e9 : (r.keep ? t2 : t1) + j * .04; if (t > tf) return;
          const rx = SX + (rnd(j) - .5) * 520, ry = SY - 20 + (rnd(j + 3) - .5) * 90, q = cl01(k / .55), x = lerp(rx + (rnd(j + 4) - .5) * 300, rx, q), y = lerp(-200, ry, q * q);
          let xx = x, yy = y, sc = 1, col = r.keep === 2 && t > t2 + .5 ? "#FFD9A8" : CREAM, rot = (rnd(j + 7) - .5) * .5;
          if (r.keep === 2 && t > tK){ const kq = eBack(cl01((t - tK - j * .03) / .6)), ki = rows.filter((r2, i2) => r2.keep === 2 && i2 < j).length; xx = lerp(x, SX + (ki - (nKeep - 1) / 2) * 232, kq); yy = lerp(y, SY - 330 + Math.sin(t * 3 + ki) * 8, kq); sc = 1 + .08 * kq; rot *= 1 - kq; col = "#FFD9A8"; glowAt(ctx, xx, yy, 140 * kq, GOLD, .5); }
          strip(xx, yy, r.text, rot, col, 1, sc); });
        // rim
        ctx.beginPath(); ctx.ellipse(SX, SY, 400, 120, 0, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.stroke(); ctx.strokeStyle = "#B07A4A"; ctx.lineWidth = 22; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(SX, SY, 400, 120, 0, Math.PI, TAU); ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 6; ctx.stroke();
        // tags
        [[Sv.tag1, t1, SX - 300, -1], [Sv.tag2, t2, SX + 300, 1]].forEach(([txt, tt, x, d]) => { const k = t - tt; if (k < 0) return; const q = eBack(cl01(k / .4)); ctx.save(); ctx.translate(x, SY + 130); ctx.rotate(d * .08 + Math.sin(t * 3 + d) * .04); ctx.scale(q, q);
          ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, -16); ctx.stroke(); fit(ctx, txt, 300, 36, 900); const w = ctx.measureText(txt).width + 44; rr(ctx, -w / 2, -16, w, 64, 14); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(txt, 0, 29); ctx.textAlign = "left"; ctx.restore(); if (k < .8) burstFx(ctx, x, SY + 160, k - .05, HL, 8, 150); });
        ctx.restore();
        if (t > tK && t < tK + 1) burstFx(ctx, SX, SY - 330, t - tK - .2, GOLD, 14, 320);
      }, midZ: 1,
      over: () => {
        const C = Sv.counts, v = t < t1 ? C[0] : t < t2 ? lerp(C[0], C[1], eOut(cl01((t - t1) / .9))) : lerp(C[1], C[2], eOut(cl01((t - t2) / .9)));
        const txt = Math.round(v).toLocaleString("id-ID") + " " + Sv.unit, hot = t > t2 + .6; const q = eBack(cl01((t - .2) / .5));
        ctx.save(); ctx.translate(540, 300); ctx.scale(q, q); tagPill(ctx, txt, 0, 0, 60, hot ? ORANGE : CREAM, hot ? CREAM : BROWN, 600); ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Sv = f.sieve || {}; add(.3, "whoosh"); if (Sv.cue1){ const a = cueT(s, Sv.cue1, .3, i); add(a, "pop"); add(a + .2, "whoosh"); } if (Sv.cue2){ const a = cueT(s, Sv.cue2, .45, i); add(a, "pop"); add(a + .2, "whoosh"); } if (Sv.keepCue) add(cueT(s, Sv.keepCue, .8, i), "chime"); });

  /* ================= _urut: xylophone sort ================= */
  // f.xylo: {bars:[{text, v}], sortCue, playCue (glissando), winCue (crown), winText="TERLARIS", top=520}
  TT.scene("j2611221020124_urut", "Cerita: xilofon data diurutkan (sort)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, X = Object.assign({ top: 500, winText: "TERLARIS" }, f.xylo || {}), bars = X.bars || [], n = bars.length;
    const tS = T(s, X.sortCue, .3, idx), tPl = T(s, X.playCue, .5, idx), tW = T(s, X.winCue, .7, idx);
    const order = bars.map((b, j) => j).sort((a, b) => bars[b].v - bars[a].v), rank = []; order.forEach((j, r) => rank[j] = r);
    const vmax = Math.max(...bars.map(b => b.v)), gap = Math.min(150, 860 / n), x0 = 540 - gap * (n - 1) / 2;
    const COLS = ["#F08C2E", "#F6C343", "#7FA563", "#2F9C95", "#5B7DB1", "#9C6ADE", "#D9483B"];
    base(ctx, s, t, { env: "night",
      spots: { top: [x0 + 260, X.top + 260, 1.1] },
      back: () => {
        // frame rails
        ctx.fillStyle = "#6B3A22"; [X.top + 60, X.top + 470].forEach((y, i) => { ctx.save(); ctx.translate(540, y); ctx.rotate(i ? .04 : -.02); rr(ctx, -500, -14, 1000, 28, 12); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); });
        bars.forEach((b, j) => { const r = rank[j], q = cl01((t - tS - j * .12) / .65), e = eOut(q), xs = x0 + j * gap, xe = x0 + r * gap;
          const x = lerp(xs, xe, e), hop = Math.sin(q * Math.PI) * (90 + (j % 3) * 40), L = 200 + 300 * b.v / vmax;
          const gl = t > tPl ? Math.max(0, 1 - Math.abs((t - tPl) * 5 - r) * .8) : 0, win = t > tW && r === 0 ? 1 : 0;
          let land = 0; const kl = t - tS - j * .12 - .65; if (kl > 0 && kl < .35) land = Math.sin(kl / .35 * Math.PI) * .1 * (1 - kl / .35);
          const w = gap * .74, yy = X.top - hop - gl * 26;
          if (win) glowAt(ctx, x, yy + L / 2, 330, GOLD, .55 + .15 * Math.sin(t * 5));
          ctx.save(); ctx.translate(x, yy); ctx.scale(1 + land, 1 - land); rr(ctx, -w / 2, 0, w, L, 14); ctx.fillStyle = t > tS + 1.2 ? COLS[r % COLS.length] : COLS[j % COLS.length]; ctx.fill(); ol(ctx, 6);
          ctx.fillStyle = "rgba(255,255,255,.3)"; rr(ctx, -w / 2 + 8, 8, w * .25, L - 16, 8); ctx.fill();
          [36, L - 36].forEach(yy2 => { ctx.beginPath(); ctx.arc(0, yy2, 9, 0, TAU); ctx.fillStyle = "#D6DCE4"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); });
          fit(ctx, b.text, w - 12, 30, 900); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.strokeText(b.text, 0, 100); ctx.fillText(b.text, 0, 100);
          fit(ctx, String(b.v), w - 12, 34, 900); ctx.strokeText(String(b.v), 0, L - 64); ctx.fillText(String(b.v), 0, L - 64); ctx.textAlign = "left"; ctx.restore();
          if (gl > .6){ const q2 = ((t * 2 + j) % 1); ctx.save(); ctx.globalAlpha = 1 - q2; textC(ctx, j % 2 ? "♪" : "♫", x + 30, yy - 30 - q2 * 140, 64, j % 2 ? GOLD : CREAM, 900); ctx.restore(); }
          if (win){ const kq = t - tW, cq = eBack(cl01(kq / .45)); ctx.save(); ctx.translate(x, yy - 70 + Math.sin(t * 3) * 6); ctx.scale(cq, cq);
            ctx.beginPath(); ctx.moveTo(-70, 30); ctx.lineTo(-70, -30); ctx.lineTo(-35, 0); ctx.lineTo(0, -45); ctx.lineTo(35, 0); ctx.lineTo(70, -30); ctx.lineTo(70, 30); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6);
            [-70, 0, 70].forEach((cx2, i) => { ctx.beginPath(); ctx.arc(cx2, i === 1 ? -50 : -34, 10, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); }); ctx.restore();
            if (kq < .9) burstFx(ctx, x, yy - 60, kq - .1, GOLD, 14, 260); } });
      },
      over: (ctx2, c) => { if (t > tW){ const p = c.toScreen(x0, X.top); tagPill(ctx, X.winText, clamp(p[0] + 230, 260, 820), clamp(p[1] - 170, 240, 900), 54, GOLD, BROWN, 520, t - tW - .25); }
        if (t > tS && t < tS + 1.2){ const q = (t - tS) / 1.2; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .9; TT.outlineWords(ctx, [{ w: "URUTKAN!", hl: true }], 540, 300, 110, { sw: 26 }); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const X = f.xylo || {}, n = (X.bars || []).length; if (X.sortCue){ const a = cueT(s, X.sortCue, .3, i); add(a, "whoosh"); for (let j = 0; j < n; j += 2) add(a + j * .12 + .65, "pop"); }
    if (X.playCue){ const a = cueT(s, X.playCue, .5, i); for (let j = 0; j < n; j++) add(a + j * .2, "ping"); } if (X.winCue) add(cueT(s, X.winCue, .7, i), "chime"); });

  /* ================= _toko: electronics shop, rant cut off / knot untangles ================= */
  // f.rant: {cue (chips start), cutCue, chips:["...", ...], from (toon index, default 1), to (default 0)}
  // f.knot: {on (toon index with the knot, default 1), listener (default 0), cue (appear), loosenCue, doneCue, doneText="LEGA"}
  function shopEnv(ctx, c, t){
    layer(ctx, c, .6, () => { ctx.fillStyle = "#F3E3C8"; ctx.fillRect(-900, -900, 2900, 2700); ctx.fillStyle = "#EAD5B3"; for (let i = -6; i < 16; i++) ctx.fillRect(i * 120, -900, 60, 2700);
      // sign
      ctx.save(); ctx.translate(540, 330); ctx.rotate(Math.sin(t * .8) * .01); rr(ctx, -380, -70, 760, 140, 20); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 7); textC(ctx, "TOKO ELEKTRONIK", 0, 22, 62, CREAM, 900); ctx.restore();
      // shelves with appliances
      [600, 860, 1120].forEach((y, r) => { ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-300, y, 1680, 26); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-300, y, 1680, 26);
        for (let i = 0; i < 7; i++){ const x = -180 + i * 230 + r * 60, kind = (i + r) % 4; ctx.save(); ctx.translate(x, y);
          if (kind === 0){ rr(ctx, -60, -110, 120, 110, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#E8A55B"; ctx.fillRect(-60, -70, 120, 16); ctx.beginPath(); ctx.ellipse(0, -110, 50, 14, 0, 0, TAU); ctx.fillStyle = "#D6DCE4"; ctx.fill(); ol(ctx, 4); }
          else if (kind === 1){ ctx.fillStyle = "#555A66"; ctx.fillRect(-6, -90, 12, 90); ctx.beginPath(); ctx.arc(0, -150, 60, 0, TAU); ctx.fillStyle = "#CFE6F2"; ctx.fill(); ol(ctx, 5); ctx.save(); ctx.translate(0, -150); ctx.rotate(t * 4 + i); for (let b = 0; b < 3; b++){ ctx.rotate(TAU / 3); ctx.beginPath(); ctx.ellipse(0, -28, 14, 28, 0, 0, TAU); ctx.fillStyle = "#5B7DB1"; ctx.fill(); } ctx.restore(); }
          else if (kind === 2){ rr(ctx, -80, -120, 160, 110, 8); ctx.fillStyle = "#2B2B33"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#7FC8C0", .6 + .2 * Math.sin(t * 3 + i)); ctx.fillRect(-68, -108, 136, 86); ctx.fillStyle = "#555A66"; ctx.fillRect(-20, -10, 40, 10); }
          else { rr(ctx, -50, -90, 100, 90, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#2B2B33"; ctx.fillRect(-34, -90, 18, 10); ctx.fillRect(14, -90, 18, 10); }
          ctx.restore(); } }); });
    layer(ctx, c, 1, () => { ctx.fillStyle = "#D9C6A6"; ctx.fillRect(-900, 1560, 2900, 900); ctx.strokeStyle = "rgba(43,26,18,.15)"; ctx.lineWidth = 4; for (let i = -10; i < 20; i++){ ctx.beginPath(); ctx.moveTo(i * 120, 1560); ctx.lineTo(i * 120 - 200, 2400); ctx.stroke(); } });
  }
  function counter(ctx, t){ ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(-300, 1650, 880, 30); ctx.fillStyle = "#B8693A"; ctx.fillRect(-300, 1390, 820, 280); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-300, 1390, 820, 280);
    rr(ctx, -320, 1360, 860, 44, 12); ctx.fillStyle = "#E0A458"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = CREAM; rr(ctx, 200, 1460, 260, 80, 14); ctx.fill(); ol(ctx, 5); textC(ctx, "LAYANAN", 330, 1514, 40, ORANGE, 900);
    ctx.save(); ctx.translate(40, 1360); rr(ctx, -80, -100, 160, 100, 12); ctx.fillStyle = "#555A66"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#7FC8C0"; ctx.fillRect(-60, -84, 120, 40); textC(ctx, "LUNAS", 0, -54, 26, BROWN, 900); ctx.restore(); }
  TT.scene("j2611221020124_toko", "Cerita: toko elektronik (keluhan dipotong / simpul terurai)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Ra = f.rant, Kn = f.knot ? Object.assign({ on: 1, listener: 0, doneText: "LEGA" }, f.knot) : null;
    base(ctx, s, t, {
      envDraw: (ctx2, c) => shopEnv(ctx, c, t),
      front: (ctx2, c, sts) => { counter(ctx, t);
        if (Ra){ const from = sts[Ra.from ?? 1], to = sts[Ra.to ?? 0]; if (!from || !to) return; const hf = toonHead(from), ht = toonHead(to), tc = T(s, Ra.cue, .25, idx), tCut = T(s, Ra.cutCue, .45, idx), chips = Ra.chips || ["..."];
          if (t < tc) return; const n = Math.min(chips.length * 3, Math.floor((Math.min(t, tCut) - tc) * 2.4) + 1);
          for (let i = 0; i < n; i++){ const born = tc + i / 2.4, k = Math.min(t, tCut) - born, q = cl01(k / 2.2), x = lerp(hf[0] - 120, ht[0] + 160, q), y = hf[1] - 230 - Math.sin(q * Math.PI) * 120 + (i % 2) * 70;
            let xx = x, yy = y, rot = Math.sin(t * 3 + i) * .06, a = 1, col = CREAM;
            if (t > tCut){ const kk = t - tCut; xx = x + (rnd(i) - .5) * 200 * kk; yy = y + 900 * kk * kk; rot += kk * 6 * (rnd(i) - .5); col = "#C9CED6"; a = cl01(1 - (kk - .8) / .4); if (a <= 0) continue; }
            ctx.save(); ctx.globalAlpha = a * cl01((Math.min(t, tCut) - born) / .2); ctx.translate(xx, yy); ctx.rotate(rot); const txt = chips[i % chips.length]; fit(ctx, txt, 300, 34, 800); const w = ctx.measureText(txt).width + 40;
            rr(ctx, -w / 2, -32, w, 64, 26); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(txt, 0, 12); ctx.textAlign = "left"; ctx.restore(); }
          const kc = t - tCut; if (kc > 0 && kc < .6){ ctx.save(); ctx.globalAlpha = 1 - kc / .6; ctx.strokeStyle = RED; ctx.lineWidth = 22; ctx.lineCap = "round"; const mx = (hf[0] + ht[0]) / 2, my = hf[1] - 260; ctx.beginPath(); ctx.moveTo(mx - 160, my - 160 + kc * 40); ctx.lineTo(mx + 160, my + 160); ctx.stroke(); ctx.restore(); } }
        if (Kn){ const st = sts[Kn.on], ls = sts[Kn.listener]; if (!st) return; const [hx, hy, r] = headOf(st), tc = T(s, Kn.cue, .2, idx), tL = T(s, Kn.loosenCue, .3, idx), tD = T(s, Kn.doneCue, .7, idx);
          const k = t - tc; if (k < 0) return; const pop = eBack(cl01(k / .5)), p = t < tL ? 0 : cl01((t - tL) / Math.max(.5, tD - tL)), pe = p * p * (3 - 2 * p), done = cl01((t - tD) / .5);
          const cx = clamp(hx - 20, 300, 760), cy = hy - r * 2.25 + Math.sin(t * 2) * 8, col = lerpCol("#D9483B", "#3E9B5A", pe);
          if (ls){ // listening waves from the speaker to the listener's ear
            const hl = toonHead(ls); for (let i = 0; i < 4; i++){ const q = ((t * .7 + i / 4) % 1); ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .7 * (1 - done); ctx.strokeStyle = "#7FC8C0"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(lerp(hx - r, hl[0] + r * 1.2, q), lerp(hy, hl[1], q), 30 + q * 30, Math.PI * .7, Math.PI * 1.3); ctx.stroke(); ctx.restore(); }
            const ep = [hl[0] - r * 1.05, hl[1] - r * .2]; ctx.save(); ctx.translate(ep[0], ep[1]); const pul = 1 + .12 * Math.sin(t * 6); ctx.scale(pul, pul); ctx.beginPath(); ctx.arc(0, 0, 48, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); ico(ctx, "ear", 0, 0, 56, ORANGE, 2.6); ctx.restore(); }
          ctx.save(); ctx.translate(cx, cy); ctx.scale(pop, pop); ctx.lineCap = "round"; ctx.lineJoin = "round";
          const N = 160, path = []; for (let i = 0; i <= N; i++){ const u = i / N, a = u * TAU * 3.0;
            const tx = Math.sin(a * 1.7 + 1.3) * 120 + Math.sin(a * 3.1) * 40, ty = Math.sin(a * 2.3) * 85 + Math.cos(a * 1.1) * 30, lx = (u - .5) * 520, ly = Math.sin(u * TAU * 1.5 + t * 2) * 18 * (1 - done) ;
            path.push([lerp(tx, lx, pe), lerp(ty, ly, pe)]); }
          ctx.beginPath(); path.forEach((pp, i) => i ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1])); ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 15; ctx.stroke();
          if (pe < .3){ ctx.save(); ctx.globalAlpha = 1 - pe / .3; for (let i = 0; i < 3; i++) textC(ctx, ["#", "@", "!"][i], -150 + i * 150 + Math.sin(t * 9 + i) * 8, -120, 54, RED, 900); ctx.restore(); }
          ctx.restore();
          if (done > 0){ tagPill(ctx, Kn.doneText, cx, cy - 120, 50, GREEN, CREAM, 360, t - tD); if (t - tD < .9) burstFx(ctx, cx, cy, t - tD, GREEN, 12, 300); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); if (f.rant){ const a = cueT(s, f.rant.cue, .25, i), b = cueT(s, f.rant.cutCue, .45, i); for (let k = a; k < b; k += .42) add(k, "pop"); add(b, "whoosh"); }
    if (f.knot){ add(cueT(s, f.knot.cue, .2, i), "pop"); add(cueT(s, f.knot.loosenCue, .3, i), "whoosh"); add(cueT(s, f.knot.doneCue, .7, i), "chime"); } });

  /* ================= _gununges: iceberg reveal ================= */
  // f.berg: {tipText="KABEL?", tipCue, diveCue, labels:[{text, icon, cue, y}], sea=1000}
  TT.scene("j2611221020124_gununges", "Cerita: puncak gunung es", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bg = Object.assign({ tipText: "KABEL?", sea: 1000 }, f.berg || {}), SEA = Bg.sea, tTip = T(s, Bg.tipCue, .2, idx), tDv = T(s, Bg.diveCue, .4, idx);
    const wave = (x, k) => SEA + Math.sin(x * .012 + t * 2 + k) * 10 + Math.sin(x * .03 - t * 3) * 4;
    base(ctx, s, t, {
      envDraw: (ctx2, c) => {
        layer(ctx, c, .25, () => { const g = ctx.createLinearGradient(0, -300, 0, SEA); g.addColorStop(0, "#8FC9E8"); g.addColorStop(1, "#E3F3FA"); ctx.fillStyle = g; ctx.fillRect(-1200, -1200, 3500, SEA + 1300);
          glowAt(ctx, 860, 220, 200, "#FFF3C4", .9); ctx.beginPath(); ctx.arc(860, 220, 70, 0, TAU); ctx.fillStyle = "#FFE7A3"; ctx.fill();
          for (let i = 0; i < 4; i++){ const x = ((i * 380 + t * 18) % 1800) - 400, y = 180 + i * 70; ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.ellipse(x, y, 110, 34, 0, 0, TAU); ctx.ellipse(x + 60, y - 20, 70, 34, 0, 0, TAU); ctx.fill(); } });
        layer(ctx, c, 1, () => {
          // underwater
          const g = ctx.createLinearGradient(0, SEA, 0, 2700); g.addColorStop(0, "#3C9BC6"); g.addColorStop(.5, "#1D5E8C"); g.addColorStop(1, "#0B2A4A"); ctx.fillStyle = g; ctx.fillRect(-1200, SEA, 3500, 2400);
          ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 7; i++){ const x = -200 + i * 230 + Math.sin(t * .6 + i) * 40; ctx.beginPath(); ctx.moveTo(x, SEA); ctx.lineTo(x + 90, SEA); ctx.lineTo(x + 340, 2600); ctx.lineTo(x + 180, 2600); ctx.closePath(); ctx.fill(); } ctx.restore();
          // iceberg body (under water, translucent) + tip
          ctx.beginPath(); ctx.moveTo(420, SEA); ctx.lineTo(300, 1180); ctx.lineTo(140, 1420); ctx.lineTo(90, 1760); ctx.lineTo(180, 2060); ctx.lineTo(380, 2280); ctx.lineTo(700, 2300); ctx.lineTo(930, 2080); ctx.lineTo(1000, 1700); ctx.lineTo(920, 1380); ctx.lineTo(780, 1150); ctx.lineTo(680, SEA); ctx.closePath();
          ctx.fillStyle = "rgba(205,236,247,.82)"; ctx.fill(); ctx.strokeStyle = "#E9F8FF"; ctx.lineWidth = 8; ctx.stroke();
          ctx.save(); ctx.clip(); ctx.fillStyle = "rgba(120,180,210,.35)"; ctx.beginPath(); ctx.moveTo(540, SEA); ctx.lineTo(1000, 1700); ctx.lineTo(700, 2300); ctx.lineTo(560, 1500); ctx.closePath(); ctx.fill(); ctx.restore();
          ctx.beginPath(); ctx.moveTo(430, SEA + 6); ctx.lineTo(500, 860); ctx.lineTo(545, 780); ctx.lineTo(600, 850); ctx.lineTo(670, SEA + 6); ctx.closePath(); ctx.fillStyle = "#F5FCFF"; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.moveTo(545, 780); ctx.lineTo(600, 850); ctx.lineTo(670, SEA + 6); ctx.lineTo(560, SEA + 6); ctx.closePath(); ctx.fillStyle = "#CFE9F5"; ctx.fill();
          // flag on the tip
          const kt = t - tTip; if (kt > 0){ const q = eBack(cl01(kt / .4)); ctx.save(); ctx.translate(548, 790); ctx.scale(q, q); ctx.fillStyle = OUT; ctx.fillRect(-4, -170, 8, 170);
            const wv = Math.sin(t * 6) * 8; ctx.beginPath(); ctx.moveTo(4, -170); ctx.quadraticCurveTo(120, -160 + wv, 230, -150); ctx.lineTo(230, -90); ctx.quadraticCurveTo(120, -100 - wv, 4, -100); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
            fit(ctx, Bg.tipText, 200, 40, 900); ctx.fillStyle = CREAM; ctx.fillText(Bg.tipText, 20, -122); ctx.restore(); }
          // bubbles + fish
          for (let i = 0; i < 18; i++){ const q = ((t * .25 + rnd(i)) % 1), x = 100 + rnd(i + 3) * 880 + Math.sin(t * 2 + i) * 14, y = 2400 - q * (2400 - SEA - 20); ctx.beginPath(); ctx.arc(x, y, 6 + rnd(i) * 12, 0, TAU); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 3; ctx.stroke(); }
          for (let i = 0; i < 4; i++){ const dir = i % 2 ? 1 : -1, x = ((t * 60 * dir + i * 400) % 1600 + 1600) % 1600 - 260, y = 1250 + i * 260; ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = i % 2 ? "#F6C343" : "#F08C2E";
            ctx.beginPath(); ctx.ellipse(0, 0, 44, 22, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-72, -20 + Math.sin(t * 10) * 6); ctx.lineTo(-72, 20 + Math.sin(t * 10) * 6); ctx.closePath(); ctx.fill(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(22, -4, 5, 0, TAU); ctx.fill(); ctx.restore(); }
          // surface waves
          ctx.beginPath(); ctx.moveTo(-1200, wave(-1200, 0)); for (let x = -1200; x <= 2300; x += 30) ctx.lineTo(x, wave(x, 0)); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.stroke();
          // ice floe for the toon
          ctx.beginPath(); ctx.ellipse(190, SEA + 6 + Math.sin(t * 2) * 5, 170, 30, 0, 0, TAU); ctx.fillStyle = "#F5FCFF"; ctx.fill(); ol(ctx, 5);
        });
      },
      prep: (a, j) => j === 0 ? { a: Object.assign({}, a, { y: SEA - 6 + Math.sin(t * 2) * 5 }), t } : null,
      front: () => {
        (Bg.labels || []).forEach((L, j) => { const k = t - tOf(s, L, .3 + j * .2, idx); if (k < 0) return; const y = L.y ?? (1320 + j * 280), x = 540 + Math.sin(t * 1.3 + j) * 10, q = eBack(cl01(k / .45));
          ctx.save(); ctx.translate(x, y); ctx.scale(q, q); fit(ctx, L.text, 620, 50, 900); const w = ctx.measureText(L.text).width + 140; rr(ctx, -w / 2, -48, w, 96, 30); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.arc(-w / 2 + 52, 0, 32, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ico(ctx, L.icon || "alert", -w / 2 + 52, 0, 40, CREAM, 2.6);
          ctx.fillStyle = BROWN; ctx.fillText(L.text, -w / 2 + 100, 17); ctx.restore(); if (k < .9) burstFx(ctx, x, y, k - .1, "#7FC8C0", 10, 260); });
      },
      post: () => { const k = t - tDv; if (k > 0 && k < .5){ ctx.globalAlpha = (1 - k / .5) * .4; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, 1080, 1920); ctx.globalAlpha = 1; } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bg = f.berg || {}; if (Bg.tipCue) add(cueT(s, Bg.tipCue, .2, i), "pop"); if (Bg.diveCue) add(cueT(s, Bg.diveCue, .4, i), "whoosh"); (Bg.labels || []).forEach((L, j) => add(tOf(s, L, .3 + j * .2, i), "pop")); });
})();
