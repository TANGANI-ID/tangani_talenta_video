/* Scene pack j2611221020182: story scenes for MODE CERITA ("motion": {"mode": "cerita"}). Layout prefix j2611221020182_.
   Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front)
   plus base extras: f.rating {x, y, label, lit (stars lit at start, default 5), fall:[cue..] (a star drops per cue), backCue (all come back), at|cue (appear)}
   and its own set piece:
     _tabel   giant spreadsheet wall: rows scroll (f.sheet.scroll), the LIVING header row (face) scrolls away and says goodbye,
              "?" over the columns, then gets frozen in ice (freezeCue) and stays on top; rows get ticked (checks)      f.sheet
     _bungee  sky: the hero hangs on a bungee cord between the floating header row (top) and row 300 (bottom), hop counter,
              dizzy stars, the row number scrambles to ???                                                                f.jump
     _ramal   imagination: the hero turns fortune teller (wizard hat, glowing crystal ball with the promise, purple world);
              the ball cracks and shatters                                                                                f.ball
     _bintang trust board: 5 big stars above a waiting customer drop one by one and crack; sun crosses the sky; tumbleweed f.rating, f.sun, f.weedCue
     _pipa    pneumatic tube from the shop counter to a warehouse cut-away bubble: capsule shoots up, worker answers, comes back  f.tube
     _bunga   "bunga" pun: the unpaid rest of a credit card bill is planted in a pot and grows flowers with % faces / giant vines;
              paying in full withers them; bill sheet, credit card, big pay button                                   f.garden, f.bill, f.card, f.pay
     _mobil   family car: decision suitcases drop onto the roof rack, the car sags and smokes; the partner joins, one bag
              is postponed, one gets a tick, the car lifts and cruises                                                    f.car
     _lompat  platform path of day tiles in the sky: the hero hops along, leaps one missing tile, falls through two missing
              tiles into the "kebiasaan baru" pit; tiles light up on landing; day counter                                 f.track, f.path
     _sofa    living sofa with lazy eyes whispers and stretches an arm to pull the hero in; danger flash                 f.sofa */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, drawToon, prop, infoCard, titleStamp, layer, bubble, G, TAU, easeIO } = TT;
  const P = "j2611221020182_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", TEAL = "#2F6F73", PURPLE = "#6B4BA8", ICE = "#BFE6F5", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const eIn = x => x * x * x;
  const eEl = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -9 * p) * Math.sin((p * 9 - .75) * (TAU / 3)) + 1;
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const pop = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 16)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) size = fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; return size; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function star5(ctx, x, y, R, rot){ ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5 + (rot || 0), r = k % 2 ? R * .45 : R; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .94); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  // screen chip (HUD) that pops in
  function chip(ctx, txt, x, y, k, bg, fg, size, iconName){ if (k <= 0) return; const sc = eBack(clamp(k / .35, 0, 1)); size = size || 42; font(ctx, 900, size, FAM);
    const iw = iconName ? size * 1.1 : 0, w = ctx.measureText(txt).width + size * 1.2 + iw, h = size * 1.6;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = "rgba(43,26,18,.3)"; rr(ctx, -w / 2 + 6, -h / 2 + 8, w, h, h / 2); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.stroke();
    if (iconName) icon(ctx, iconName, -w / 2 + size * .55, -size * .45, size * .9, fg, 2.6);
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, iw / 2, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function lines2(ctx, txt, maxW, size, weight){ const ws = String(txt).split(" "); let L = [txt];
    font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width > maxW && ws.length > 1){ let best = null; for (let i = 1; i < ws.length; i++){ const a = ws.slice(0, i).join(" "), b = ws.slice(i).join(" "), m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width); if (!best || m < best[0]) best = [m, [a, b]]; } L = best[1]; }
    while (Math.max(...L.map(l => ctx.measureText(l).width)) > maxW && size > 14){ size -= 2; font(ctx, weight || 800, size, FAM); }
    return { L, size }; }
  // toon-local point (units of size/92, y up from the feet) -> world
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const headOf = st => { const h = toonHead(st); return [h[0], h[1], st.size * 20.5 / 92]; };
  // little cartoon eyes (used on living objects)
  function eyes(ctx, x, y, r, gap, t, o){ o = o || {}; const blink = (Math.sin(t * 1.3 + (o.seed || 0)) > .985) ? .15 : 1, lid = o.lid || 0;
    [-1, 1].forEach(d => { const ex = x + d * gap / 2; ctx.beginPath(); ctx.ellipse(ex, y, r, r * 1.15 * blink, 0, 0, TAU); ctx.fillStyle = o.white || "#FFFFFF"; ctx.fill(); ol(ctx, r * .28);
      if (blink > .5){ ctx.beginPath(); ctx.arc(ex + (o.lx || 0) * r * .35, y + (o.ly || 0) * r * .35, r * .5, 0, TAU); ctx.fillStyle = o.pupil || OUT; ctx.fill();
        ctx.beginPath(); ctx.arc(ex + (o.lx || 0) * r * .35 - r * .18, y + (o.ly || 0) * r * .35 - r * .2, r * .17, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); }
      if (lid > 0){ ctx.save(); ctx.beginPath(); ctx.ellipse(ex, y, r * 1.05, r * 1.2, 0, 0, TAU); ctx.clip(); ctx.fillStyle = o.lidCol || "#E8A55B"; ctx.fillRect(ex - r * 1.2, y - r * 1.3, r * 2.4, r * 2.5 * lid); ctx.restore();
        ctx.beginPath(); ctx.moveTo(ex - r * 1.05, y - r * 1.2 + r * 2.5 * lid); ctx.lineTo(ex + r * 1.05, y - r * 1.2 + r * 2.5 * lid); ol(ctx, r * .24); } }); }
  function rain(ctx, x, y, w, h, t, a){ ctx.save(); ctx.globalAlpha *= a ?? 1; ctx.strokeStyle = "rgba(160,200,235,.85)"; ctx.lineWidth = 5; ctx.lineCap = "round";
    for (let i = 0; i < 18; i++){ const px = x + rnd(i * 3.1) * w, sp = 900 + rnd(i) * 400, py = y + ((t * sp + rnd(i + 9) * h) % h); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 8, py + 34); ctx.stroke(); } ctx.restore(); }
  function cloudBlob(ctx, x, y, s, col){ ctx.fillStyle = col; ctx.beginPath(); [[-60, 10, 52], [-10, -18, 66], [50, 0, 56], [90, 18, 40], [-100, 22, 36]].forEach(([dx, dy, r]) => { ctx.moveTo(x + dx * s + r * s, y + dy * s); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); }); ctx.fill(); }

  /* ---------- rating board (trust stars) : base extra ---------- */
  function ratingBoard(ctx, s, t, R, idx){
    if (!R) return; const T0 = tOf(s, R.at != null || R.cue ? R : { at: 0 }, .2, idx), k0 = t - T0; if (k0 < 0) return;
    const x = R.x ?? 540, y = R.y ?? 420, n = 5, lit = R.lit ?? 5, w = R.w || 640, h = 210, sp = (w - 80) / n;
    const falls = (R.fall || []).map((c, j) => T(s, c, .3 + j * .15, idx)), tB = T(s, R.backCue, .4, idx), sc = eBack(clamp(k0 / .45, 0, 1));
    const shake = falls.reduce((a, f) => a + (t > f && t < f + .4 ? Math.sin((t - f) * 60) * 10 * (1 - (t - f) / .4) : 0), 0);
    ctx.save(); ctx.translate(x + shake, y + Math.sin(t * 1.6) * 6); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 1.1) * .015);
    // hanging ropes
    ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-w / 2 + 60, -h / 2); ctx.lineTo(-w / 2 + 120, -h / 2 - 400); ctx.moveTo(w / 2 - 60, -h / 2); ctx.lineTo(w / 2 - 120, -h / 2 - 400); ctx.stroke();
    ctx.fillStyle = "rgba(43,26,18,.28)"; rr(ctx, -w / 2 + 8, -h / 2 + 12, w, h, 28); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 28); ctx.fillStyle = "#FFF8EC"; ctx.fill(); ol(ctx, 7); rr(ctx, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 20); ctx.strokeStyle = hexA(ORANGE, .5); ctx.lineWidth = 4; ctx.stroke();
    // tag
    font(ctx, 900, 30, FAM); const lab = String(R.label || "KEPERCAYAAN").toUpperCase(), lw2 = ctx.measureText(lab).width + 46;
    rr(ctx, -lw2 / 2, -h / 2 - 26, lw2, 52, 26); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(lab, 0, -h / 2 + 11); ctx.textAlign = "left";
    const cy = 16;
    for (let i = 0; i < n; i++){ const sx = -w / 2 + 40 + sp * (i + .5);
      star5(ctx, sx, cy, 52); ctx.setLineDash([10, 9]); ctx.strokeStyle = "rgba(59,36,24,.35)"; ctx.lineWidth = 5; ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
    // stars (world space, independent of the board scale once falling)
    for (let i = 0; i < n; i++){
      const sx = x + shake + (-w / 2 + 40 + sp * (i + .5)) * sc, sy = y + Math.sin(t * 1.6) * 6 + cy * sc;
      const fallIdx = n - 1 - i, tf = fallIdx < falls.length ? falls[fallIdx] : 1e9; // rightmost star falls first
      const startsLit = i < lit; let px = sx, py = sy, rot = Math.sin(t * 2 + i) * .06, col = GOLD, a = 1, crack = 0, size = 52 * sc;
      if (!startsLit && t < tB){ continue; }
      if (startsLit && t >= tf && t < tB){ const k = t - tf, floorY = R.floor ?? 1600, dx = (i - 2) * 60;
        const g = 2600, vy0 = -500; let yy = sy + vy0 * k + .5 * g * k * k, landed = false;
        if (yy > floorY){ landed = true; const tl = (-vy0 + Math.sqrt(vy0 * vy0 + 2 * g * (floorY - sy))) / g, kb = k - tl; yy = floorY - Math.max(0, 300 * kb - 1800 * kb * kb); if (kb > .17) yy = floorY; }
        px = sx + dx * Math.min(1, k * 1.5); py = yy; rot = k * 6 * (i % 2 ? 1 : -1); if (landed){ rot = (i % 2 ? .4 : -.3); crack = clamp((k - .55) / .2, 0, 1); col = mixHex(GOLD, "#8A8278", crack); } }
      if (t >= tB){ const k = t - tB - i * .12; if (k < 0 && !startsLit) continue;
        if (k >= 0){ const q = eBack(clamp(k / .6, 0, 1)), fromY = R.floor ?? 1600; px = lerp(sx + (i - 2) * 60, sx, q); py = lerp(fromY, sy, q) - Math.sin(clamp(k / .6, 0, 1) * Math.PI) * 140; rot = (1 - q) * 4; col = GOLD;
          if (k > .6 && k < 1.5) burstFx(ctx, sx, sy, k - .6, GOLD, 8, 110); }
        else if (t >= tf){ px = sx + (i - 2) * 60; py = R.floor ?? 1600; col = "#8A8278"; crack = 1; rot = .3; } }
      ctx.save(); ctx.translate(px, py); ctx.rotate(rot); ctx.globalAlpha *= a;
      if (col === GOLD) glowAt(ctx, 0, 0, size * 1.6, GOLD, .35 + .15 * Math.sin(t * 4 + i));
      star5(ctx, 0, 0, size); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
      star5(ctx, -size * .08, -size * .1, size * .5); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fill();
      if (crack > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-size * .1, -size * .8); ctx.lineTo(size * .1, -size * .25 * crack); ctx.lineTo(-size * .15, size * .1 * crack); ctx.lineTo(size * .08, size * .5 * crack); ctx.stroke(); }
      ctx.restore(); }
  }
  function ratingSfx(s, f, i, add){ const R = f.rating; if (!R) return; (R.fall || []).forEach((c, j) => { const t0 = cueT(s, c, .3 + j * .15, i); add(t0, "whoosh"); add(t0 + .45, "pop"); }); if (R.backCue) add(cueT(s, R.backCue, .4, i) + .5, "chime"); }

  /* ---------- shared base (same data as the generic "cerita" layout + hooks) ---------- */
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    if (H.adjust) H.adjust(sts);
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || H.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    if (H.envAfter) H.envAfter(ctx, c, sts);
    const R = {};
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (f.rating) layer(ctx, c, 1, () => ratingBoard(ctx, s, t, f.rating, idx));
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => { if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R)); R[j] = toon(ctx, c, a, s, t, { st: sts[j] }); if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
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
    ratingSfx(s, f, i, add);
  }
  const reg = (name, label, draw, sfx) => TT.scene(P + name, label, draw, (s, f, i, add) => { sfxBase(s, f, i, add); if (sfx) sfx(s, f, i, add); });

  /* ================= _tabel: giant sheet wall with a living header row ================= */
  const ITEMS = ["Kabel USB", "Mouse", "Keyboard", "Headset", "Flashdisk", "Charger", "Webcam", "Router", "Printer", "Speaker", "Monitor", "Tinta"];
  const cell = (r, j) => j === 0 ? String(r) : j === 1 ? ITEMS[(r * 7 + 3) % ITEMS.length] : j === 2 ? String(25 + Math.floor(rnd(r * 1.7) * 30) * 5) : String(20 + Math.floor(rnd(r * 3.3 + 4) * 180));
  function sheetModel(s, t, S, idx){
    const SK = (S.scroll || []).map((k, j) => ({ T: tOf(s, k, .3 + j * .1, idx), to: k.to, d: k.dur ?? 1.6 })).sort((a, b) => a.T - b.T);
    const offAt = tt => { let seg = null; for (const k of SK){ if (tt < k.T) break; const cur = seg ? lerp(seg.f, seg.to, easeIO(clamp((k.T - seg.T) / seg.d, 0, 1))) : (S.start || 0); seg = { f: cur, to: k.to, T: k.T, d: k.d }; }
      return seg ? lerp(seg.f, seg.to, easeIO(clamp((tt - seg.T) / seg.d, 0, 1))) : (S.start || 0); };
    return offAt;
  }
  reg("tabel", "Cerita: tabel raksasa + baris judul hidup", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, S = Object.assign({ x0: 110, y0: 330, rh: 76, n: 11, total: 500 }, f.sheet || {});
    const cols = S.cols || [["No", 130], ["Barang", 290], ["Harga", 220], ["Stok", 220]], W = cols.reduce((a, q) => a + q[1], 0);
    const offAt = sheetModel(s, t, S, idx), off = offAt(t), speed = (offAt(t) - offAt(t - .05)) / .05;
    const tF = S.frozen ? -1 : T(s, S.freezeCue, .4, idx), tL = T(s, S.lostCue, .4, idx), tH = S.hl ? T(s, S.hl.cue, .3, idx) : 1e9, tC = S.checks ? T(s, S.checks.cue, .3, idx) : 1e9;
    const x0 = S.x0, y0 = S.y0, rh = S.rh, H = rh * (S.n + 1);
    const hyFree = o => y0 - o * rh;
    let hy = hyFree(off), fq = 0;
    if (t >= tF){ fq = clamp((t - tF) / .7, 0, 1); const from = tF < 0 ? y0 : Math.max(hyFree(offAt(tF)), y0 - 420); hy = lerp(from, y0, eBack(fq)); }
    const say = (S.says || []).map((q, j) => ({ T: tOf(s, q, .3, idx), text: q.text, d: q.dur || 2.2 })).filter(q => t >= q.T && t < q.T + q.d).pop();
    let faceScr = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false, plant: false },
      spots: { row: () => [x0 + W / 2, y0 + (S.hl ? S.hl.row - off : 4) * rh + rh / 2, 1.25], head: [x0 + W / 2, y0 + rh, 1.2], sheet: [x0 + W / 2, y0 + H / 2 + 60, 1] },
      back: (ctx2, c) => {
        // bezel
        ctx.fillStyle = "rgba(43,26,18,.3)"; rr(ctx, x0 - 22, y0 - 92, W + 60, H + 132, 34); ctx.fill();
        rr(ctx, x0 - 30, y0 - 100, W + 60, H + 130, 34); ctx.fillStyle = "#2B2238"; ctx.fill(); ol(ctx, 7);
        textC(ctx, S.file || "stok_gudang.xlsx", x0 + 170, y0 - 36, 34, "#CFC6E0", 700);
        ctx.fillStyle = "#E0503A"; [0, 1, 2].forEach(k => { ctx.fillStyle = ["#E0503A", "#F2B33D", "#3E9B5A"][k]; ctx.beginPath(); ctx.arc(x0 + W - 80 + k * 32, y0 - 48, 10, 0, TAU); ctx.fill(); });
        // screen
        ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, W, H); ctx.clip(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x0, y0, W, H);
        const r0 = Math.max(1, Math.floor(off)), r1 = Math.floor(off) + S.n + 2;
        for (let r = r0; r <= r1; r++){ const y = y0 + (r - off) * rh; let x = x0;
          const isHL = S.hl && r === S.hl.row && t >= tH;
          ctx.fillStyle = isHL ? hexA(HL, .28 + .1 * Math.sin(t * 6)) : (r % 2 ? "#FFFFFF" : "#F1F5FA"); ctx.fillRect(x0, y, W, rh);
          cols.forEach((cq, j) => { ctx.strokeStyle = "#C9D3E0"; ctx.lineWidth = 2; ctx.strokeRect(x, y, cq[1], rh);
            const tx = cell(r, j); font(ctx, j === 0 ? 700 : 600, 34, FAM); ctx.fillStyle = j === 0 ? "#7A86A0" : "#2B2238"; ctx.textAlign = j >= 2 ? "right" : "left"; ctx.fillText(tx, j >= 2 ? x + cq[1] - 22 : x + 20, y + rh * .64); ctx.textAlign = "left"; x += cq[1]; });
          if (isHL){ ctx.strokeStyle = ORANGE; ctx.lineWidth = 8; ctx.strokeRect(x0 + 4, y + 4, W - 8, rh - 8); }
          if (t >= tC){ const from = Math.round(offAt(tC)) + 1, up = off + 6.5; if (r >= from && r <= up + 1){ const q = eBack(clamp((up - r) * 1.4, 0, 1)); if (q > 0){ const cx = x0 + W - 34, cy = y + rh / 2;
            ctx.save(); ctx.translate(cx, cy); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-3, 8); ctx.lineTo(11, -8); ctx.stroke(); ctx.restore(); } } }
        }
        // speed streaks
        const sp = Math.abs(speed); if (sp > 6){ ctx.save(); ctx.globalAlpha = Math.min(.55, sp / 160); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x0, y0, W, H); ctx.globalAlpha = Math.min(.7, sp / 100); ctx.strokeStyle = "#9FB0CC"; ctx.lineWidth = 6;
          for (let i = 0; i < 14; i++){ const xx = x0 + 40 + rnd(i) * (W - 80), yy = y0 + ((rnd(i + 5) * H + t * 2400) % H), L = 80 + rnd(i + 2) * 160; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy - L); ctx.stroke(); } ctx.restore(); }
        // header row
        if (hy > y0 - rh * 1.2){ let x = x0; ctx.fillStyle = TEAL; ctx.fillRect(x0, hy, W, rh); cols.forEach(cq => { ctx.strokeStyle = "#1F4E52"; ctx.lineWidth = 3; ctx.strokeRect(x, hy, cq[1], rh); textC(ctx, cq[0], x + cq[1] / 2, hy + rh * .66, 38, CREAM, 900); x += cq[1]; });
          if (fq > 0){ ctx.save(); ctx.globalAlpha = .78 * clamp(fq * 2, 0, 1); ctx.fillStyle = ICE; ctx.beginPath(); ctx.moveTo(x0, hy - 6); ctx.lineTo(x0 + W, hy - 6); ctx.lineTo(x0 + W, hy + rh + 4);
            for (let k = 0; k <= 20; k++){ const xx = x0 + W - k * W / 20; ctx.lineTo(xx, hy + rh + 4 + (k % 2 ? 18 + rnd(k) * 16 : 0)); } ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
            ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); const sh = (t * 260) % (W + 400) - 200; ctx.moveTo(x0 + sh, hy); ctx.lineTo(x0 + sh + 60, hy); ctx.lineTo(x0 + sh - 10, hy + rh); ctx.lineTo(x0 + sh - 70, hy + rh); ctx.fill();
            let x2 = x0; cols.forEach(cq => { textC(ctx, cq[0], x2 + cq[1] / 2, hy + rh * .66, 38, "#1F4E52", 900); x2 += cq[1]; }); ctx.restore(); }
          // shadow under a frozen header
          if (fq > 0){ ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.fillRect(x0, hy + rh + 4, W, 14); } }
        ctx.restore();
        // scrollbar
        ctx.fillStyle = "#4A4060"; rr(ctx, x0 + W + 8, y0 + 6, 14, H - 12, 7); ctx.fill(); const th2 = Math.max(40, H * .08), ty = y0 + 6 + (H - 12 - th2) * clamp(off / S.total, 0, 1); ctx.fillStyle = HL; rr(ctx, x0 + W + 8, ty, 14, th2, 7); ctx.fill();
        // row indicator
        font(ctx, 900, 32, FAM); const lab = "Baris " + (Math.round(off) + 1); const lw2 = ctx.measureText(lab).width + 36; rr(ctx, x0 + W - 150 - lw2, y0 - 72, lw2, 48, 24); ctx.fillStyle = ORANGE; ctx.fill(); ctx.fillStyle = CREAM; ctx.fillText(lab, x0 + W - 150 - lw2 + 18, y0 - 37);
        // living header face (sticker on the left end of the header)
        if (hy > y0 - rh * .6){ const fx = x0 - 6, fy = hy + rh / 2, bob = Math.sin(t * 5) * 4, sc = clamp((hy - (y0 - rh * .6)) / (rh * .6), 0, 1);
          ctx.save(); ctx.translate(fx, fy + bob); ctx.scale(sc, sc); ctx.beginPath(); ctx.arc(0, 0, 48, 0, TAU); ctx.fillStyle = fq > 0 ? "#DFF3FB" : "#FFE2B8"; ctx.fill(); ol(ctx, 6);
          eyes(ctx, 0, -8, 11, 34, t, { seed: 2, lx: .6, ly: fq > 0 ? 0 : -.2 }); ctx.beginPath(); if (t > tL && fq <= 0) ctx.arc(0, 26, 10, Math.PI * 1.1, Math.PI * 1.9); else ctx.arc(0, 14, 13, .2, Math.PI - .2); ol(ctx, 5);
          if (fq > 0){ ctx.fillStyle = hexA("#F7A3A3", .7); ctx.beginPath(); ctx.arc(-26, 10, 8, 0, TAU); ctx.arc(26, 10, 8, 0, TAU); ctx.fill(); }
          // waving hand
          const wv = Math.sin(t * 10) * .5; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-40, 18); ctx.lineTo(-70 + wv * 10, -18 + wv * 14); ctx.stroke(); ctx.beginPath(); ctx.arc(-72 + wv * 10, -22 + wv * 14, 11, 0, TAU); ctx.fillStyle = "#FFE2B8"; ctx.fill(); ol(ctx, 4);
          ctx.restore(); faceScr = c.toScreen(fx, fy - 40); }
        // lost: "?" over the column titles
        if (t >= tL && t < tF){ [2, 3].forEach((j, n) => { const cx = x0 + cols.slice(0, j).reduce((a, q) => a + q[1], 0) + cols[j][1] / 2, k = t - tL - n * .25; if (k < 0) return; const q = eBack(clamp(k / .4, 0, 1));
          ctx.save(); ctx.translate(cx, y0 - 40 + Math.sin(t * 5 + n) * 10); ctx.scale(q, q); ctx.rotate(Math.sin(t * 3 + n) * .12); ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fillStyle = HL; ctx.fill(); ol(ctx, 6); textC(ctx, "?", 0, 30, 84, CREAM, 900); ctx.restore(); }); }
        // freeze burst + snow
        if (t >= tF && tF >= 0){ const k = t - tF; burstFx(ctx, x0 + W / 2, y0 + rh / 2, k - .2, "#7CC8E8", 14, 300);
          if (k < 3){ ctx.save(); ctx.globalAlpha = clamp(1 - (k - 2) , 0, 1); for (let i = 0; i < 26; i++){ const sx = x0 - 60 + rnd(i) * (W + 120), sy = y0 - 120 + ((k * (120 + rnd(i + 3) * 100) + rnd(i + 7) * 200) % 520); ctx.fillStyle = "#FFFFFF"; sparkle(ctx, sx + Math.sin(t * 2 + i) * 14, sy, 12 + rnd(i + 1) * 8, i % 3 ? "#FFFFFF" : "#BFE6F5"); } ctx.restore(); } }
      },
      over: (ctx2) => { if (say && faceScr){ bubble(ctx, say.text, faceScr[0] + 60, faceScr[1], t - say.T, { size: 44, maxW: 460, t }); } }
    });
  }, (s, f, i, add) => { const S = f.sheet || {}; (S.scroll || []).forEach((k, j) => add(tOf(s, k, .3 + j * .1, i), "whoosh")); if (S.freezeCue) add(cueT(s, S.freezeCue, .4, i) + .2, "chime"); if (S.lostCue) add(cueT(s, S.lostCue, .4, i), "ping");
    if (S.hl) add(cueT(s, S.hl.cue, .3, i), "pop"); if (S.checks) add(cueT(s, S.checks.cue, .3, i) + .5, "chime"); (S.says || []).forEach(q => add(tOf(s, q, .3, i), "pop")); });

  /* ================= _bungee: hero bounces between the header row and row 300 ================= */
  function floatBar(ctx, x, y, w, h, cells, col, txtCol, t, o){ o = o || {};
    ctx.save(); ctx.translate(x, y);
    // cloud cushion under the bar
    cloudBlob(ctx, -w * .3, h + 14, 1.0, "rgba(255,255,255,.95)"); cloudBlob(ctx, w * .32, h + 18, .9, "rgba(255,255,255,.95)");
    ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -w / 2 + 8, 10, w, h, 18); ctx.fill(); rr(ctx, -w / 2, 0, w, h, 18); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    let xx = -w / 2; const cw = w / cells.length;
    cells.forEach((c, j) => { if (j) { ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xx, 8); ctx.lineTo(xx, h - 8); ctx.stroke(); }
      const hl = o.hl === j && o.hlOn; if (hl){ ctx.fillStyle = hexA(GOLD, .55 + .2 * Math.sin(t * 8)); rr(ctx, xx + 6, 6, cw - 12, h - 12, 12); ctx.fill(); }
      const txt = typeof c === "function" ? c(t) : c; textC(ctx, txt, xx + cw / 2, h * .66, 46, txtCol, 900, cw - 20); xx += cw; });
    ctx.restore(); }
  reg("bungee", "Cerita: bungee naik-turun tabel", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, J = Object.assign({ yTop: 360, yBot: 1500, start: "bot", hero: 0 }, f.jump || {});
    const hops = (J.hops || []).map((h, j) => ({ T: tOf(s, h, .3, idx), to: h.to })).sort((a, b) => a.T - b.T);
    const tD = T(s, J.dizzyCue, .5, idx), tFg = T(s, J.forgetCue, .5, idx);
    const hero = (f.toons || [])[J.hero] || {}, size = hero.size || 560;
    const footTop = J.yTop + 92 + 30 + size * 20.5 / 92 + size * 72 / 92, footBot = J.yBot;
    const posY = name => name === "top" ? footTop : footBot;
    let cur = posY(J.start), from = cur, T0 = -9, n = 0;
    hops.forEach(h => { if (t >= h.T){ from = cur; cur = posY(h.to); T0 = h.T; n++; } });
    const q = clamp((t - T0) / .75, 0, 1), y = T0 < -1 ? cur : lerp(from, cur, eEl(q));
    const sway = t > tD ? Math.sin(t * 3.2) * 46 * clamp((t - tD) / .5, 0, 1) : Math.sin(t * 1.4) * 10;
    const atTop = Math.abs(y - footTop) < 60, atBot = Math.abs(y - footBot) < 60;
    const anchor = [540, J.yTop + 92];
    base(ctx, s, t, { env: "sky",
      adjust: sts => { const st = sts[J.hero]; if (st){ st.y = y; st.x = (hero.x ?? 540) + sway; } },
      spots: { top: [540, J.yTop + 300, 1.05], bot: [540, J.yBot - 300, 1.05], mid: [540, (J.yTop + J.yBot) / 2, .95] },
      envAfter: (ctx2, c) => layer(ctx, c, .6, () => { // drifting faded rows (clouds of data)
        for (let i = 0; i < 6; i++){ const yy = 300 + i * 230, xx = ((i % 2 ? 1 : -1) * t * (40 + i * 8) + i * 300) % 1600 - 300; ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = "#FFFFFF"; rr(ctx, xx, yy, 520, 70, 14); ctx.fill();
          ctx.strokeStyle = "rgba(120,150,190,.6)"; ctx.lineWidth = 3; for (let k = 1; k < 4; k++){ ctx.beginPath(); ctx.moveTo(xx + k * 130, yy + 8); ctx.lineTo(xx + k * 130, yy + 62); ctx.stroke(); } ctx.restore(); } }),
      back: (ctx2, c, sts) => {
        const bob1 = Math.sin(t * 1.5) * 8, bob2 = Math.sin(t * 1.3 + 1) * 8;
        floatBar(ctx, 540, J.yTop + bob1, 900, 96, J.head || ["No", "Barang", "Harga", "Stok"], TEAL, CREAM, t, { hl: 2, hlOn: atTop });
        // header face
        ctx.save(); ctx.translate(540 - 450 + 10, J.yTop + bob1 - 30); ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fillStyle = "#FFE2B8"; ctx.fill(); ol(ctx, 6); eyes(ctx, 0, -6, 10, 32, t, { lx: atTop ? .5 : 0, ly: .6 }); ctx.beginPath(); ctx.arc(0, 14, 12, .2, Math.PI - .2); ol(ctx, 5); ctx.restore();
        const rowCells = (J.row || ["300", "Router", "85", "120"]).map((c, j) => j === 0 ? (tt => tt > tFg ? ["3??", "?0?", "??0", "4??"][Math.floor(tt * 6) % 4] : c) : c);
        const shake = t > tFg ? Math.sin(t * 30) * 6 : 0;
        floatBar(ctx, 540 + shake, J.yBot + bob2, 900, 96, rowCells, PAPER, BROWN, t, { hl: J.hlCol ?? 3, hlOn: atBot && t < tFg });
        // cord
        const st = sts[J.hero]; if (st){ const wx = st.x, wy = st.y - st.size * .4, d = Math.hypot(wx - anchor[0], wy - anchor[1]), slack = clamp(1 - d / 900, 0, 1);
          ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(anchor[0], anchor[1]);
          const N = 26; for (let i = 1; i <= N; i++){ const u = i / N, px = lerp(anchor[0], wx, u) + Math.sin(u * Math.PI * 9) * 26 * slack, py = lerp(anchor[1], wy, u) + Math.sin(u * Math.PI) * 120 * slack; ctx.lineTo(px, py); } ctx.stroke();
          ctx.strokeStyle = ORANGE; ctx.lineWidth = 9; ctx.stroke();
          ctx.beginPath(); ctx.arc(anchor[0], anchor[1] + 6, 18, 0, TAU); ctx.fillStyle = "#8A8278"; ctx.fill(); ol(ctx, 5); }
      },
      over1: (ctx2, c, sts, j) => { if (j !== J.hero || t < tD) return; const [hx, hy, r] = headOf(sts[j]); // dizzy stars
        for (let i = 0; i < 4; i++){ const a = t * 4 + i * TAU / 4; ctx.fillStyle = i % 2 ? GOLD : HL; sparkle(ctx, hx + Math.cos(a) * r * 1.2, hy - r * 1.05 + Math.sin(a) * r * .3, 22, ctx.fillStyle); } },
      over: () => { chip(ctx, "NAIK-TURUN ×" + n, 540, 235, n > 0 ? 1 : 0, n >= 3 ? RED : ORANGE, CREAM, 40, "chart"); }
    });
  }, (s, f, i, add) => { const J = f.jump || {}; (J.hops || []).forEach(h => add(tOf(s, h, .3, i), "whoosh")); if (J.dizzyCue) add(cueT(s, J.dizzyCue, .5, i), "ping"); if (J.forgetCue) add(cueT(s, J.forgetCue, .5, i), "pop"); });

  /* ================= _ramal: fortune-teller imagination + crystal ball ================= */
  function wizardHat(ctx, hx, hy, r, q, t){ if (q <= 0) return; const drop = (1 - eOut(clamp(q, 0, 1))) * -r * 3, sq = q < 1.2 ? 0 : 0;
    ctx.save(); ctx.translate(hx, hy - r * .78 + drop); ctx.rotate(-.12 + Math.sin(t * 2) * .04); ctx.scale(1 + sq, 1 - sq);
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.25, r * .28, 0, 0, TAU); ctx.fillStyle = "#4B3480"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(-r * .78, -r * .05); ctx.quadraticCurveTo(-r * .2, -r * 1.2, r * .55 + Math.sin(t * 3) * r * .08, -r * 1.75); ctx.quadraticCurveTo(r * .2, -r * .9, r * .78, -r * .05); ctx.closePath(); ctx.fillStyle = PURPLE; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = GOLD; star5(ctx, -r * .1, -r * .55, r * .17, t * .5); ctx.fill(); star5(ctx, r * .3, -r * 1.0, r * .1, 0); ctx.fill(); ctx.beginPath(); ctx.arc(-r * .35, -r * .25, r * .07, 0, TAU); ctx.fill();
    ctx.fillStyle = GOLD; ctx.fillRect(-r * .78, -r * .2, r * 1.56, r * .14); ctx.restore(); }
  reg("ramal", "Cerita: peramal bola kristal", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ on: 0 }, f.ball || {});
    const tIn = B.at != null ? B.at : T(s, B.cue, .2, idx), tHat = B.hatCue ? T(s, B.hatCue, .2, idx) : tIn, tTx = B.textAt != null ? B.textAt : T(s, B.textCue, .4, idx), tCr = T(s, B.crackCue, .5, idx), tSm = B.smashCue ? T(s, B.smashCue, .6, idx) : tCr + 1.1;
    const magic = clamp((t - tIn) / .6, 0, 1) * (t > tSm ? clamp(1 - (t - tSm) / .6, 0, 1) : 1);
    let ballP = null;
    base(ctx, s, t, { env: "office",
      spots: { ball: () => ballP ? [ballP[0], ballP[1] + 40, 1.35] : [540, 1000, 1.2] },
      over1: (ctx2, c, sts, j) => { if (j !== B.on) return; const st = sts[j], [hx, hy, r] = headOf(st);
        if (B.hat !== false) wizardHat(ctx, hx, hy, r, t >= tHat ? clamp((t - tHat) / .45, 0, 1.0) : 0, t);
        if (t < tIn) return; const kk = st.size / 92, [bx, by] = lp(st, 40, -58), R0 = 15 * kk, q = eBack(clamp((t - tIn) / .45, 0, 1)), float = Math.sin(t * 2.4) * 6;
        ballP = [bx, by];
        if (t < tSm){
          // stand
          ctx.fillStyle = "#8A5A34"; ctx.beginPath(); ctx.moveTo(bx - R0 * .55, by + R0 * .95); ctx.lineTo(bx + R0 * .55, by + R0 * .95); ctx.lineTo(bx + R0 * .4, by + R0 * .7); ctx.lineTo(bx - R0 * .4, by + R0 * .7); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          ctx.save(); ctx.translate(bx, by + float); ctx.scale(q, q);
          glowAt(ctx, 0, 0, R0 * 2.4, "#C9A6FF", .45 + .15 * Math.sin(t * 5));
          const g = ctx.createRadialGradient(-R0 * .3, -R0 * .35, R0 * .1, 0, 0, R0); g.addColorStop(0, "#F3E8FF"); g.addColorStop(.55, "#A884E6"); g.addColorStop(1, "#5A3C9A");
          ctx.beginPath(); ctx.arc(0, 0, R0, 0, TAU); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
          ctx.save(); ctx.beginPath(); ctx.arc(0, 0, R0 - 4, 0, TAU); ctx.clip();
          for (let i = 0; i < 3; i++){ ctx.strokeStyle = hexA("#FFFFFF", .35); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, R0 * (.3 + i * .22), t * (1.5 + i) + i, t * (1.5 + i) + i + 2.2); ctx.stroke(); }
          if (t >= tTx){ const kt = clamp((t - tTx) / .4, 0, 1), L = String(B.text || "").split("\n"); ctx.globalAlpha = kt; let sz = R0 * .36; L.forEach(l => { sz = Math.min(sz, fit(ctx, l, R0 * 1.6, sz, 900)); });
            L.forEach((l, i) => { font(ctx, 900, sz, FAM); ctx.textAlign = "center"; ctx.lineWidth = 8; ctx.strokeStyle = "#4B3480"; ctx.strokeText(l, 0, (i - (L.length - 1) / 2) * sz * 1.1 + sz * .36); ctx.fillStyle = "#FFFFFF"; ctx.fillText(l, 0, (i - (L.length - 1) / 2) * sz * 1.1 + sz * .36); }); ctx.textAlign = "left"; ctx.globalAlpha = 1; }
          ctx.restore();
          ctx.beginPath(); ctx.ellipse(-R0 * .38, -R0 * .45, R0 * .22, R0 * .12, -.6, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fill();
          if (t >= tCr){ const kc = clamp((t - tCr) / .5, 0, 1); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); const seg = [[0, -R0], [R0 * .15, -R0 * .45], [-R0 * .12, -R0 * .1], [R0 * .2, R0 * .3], [-R0 * .05, R0 * .75]]; seg.slice(0, 1 + Math.ceil(kc * 4)).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
            ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); if (kc >= 1){ ctx.beginPath(); ctx.moveTo(R0 * .15, -R0 * .45); ctx.lineTo(R0 * .7, -R0 * .55); ctx.moveTo(-R0 * .12, -R0 * .1); ctx.lineTo(-R0 * .75, R0 * .1); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.stroke(); } }
          // orbiting sparkles
          for (let i = 0; i < 5; i++){ const a = t * 2 + i * TAU / 5; sparkle(ctx, Math.cos(a) * R0 * 1.45, Math.sin(a) * R0 * .5 - R0 * .2, 12 + 4 * Math.sin(t * 6 + i), i % 2 ? GOLD : "#E9D8FF"); }
          ctx.restore();
        } else { // shards
          const k = t - tSm; for (let i = 0; i < 14; i++){ const a = i / 14 * TAU + rnd(i) * .4, v = 420 + rnd(i + 3) * 420, px = bx + Math.cos(a) * v * k, py = by + Math.sin(a) * v * k * .6 + 1400 * k * k;
            if (py > GROUND + 40) continue; ctx.save(); ctx.translate(px, py); ctx.rotate(k * 8 * (i % 2 ? 1 : -1)); ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(14, 10); ctx.lineTo(-12, 12); ctx.closePath(); ctx.fillStyle = i % 2 ? "#C9A6FF" : "#F3E8FF"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
          burstFx(ctx, bx, by, k, "#A884E6", 12, 220);
          if (k < 1.4){ ctx.save(); ctx.globalAlpha = 1 - k / 1.4; for (let i = 0; i < 6; i++){ ctx.fillStyle = "rgba(200,190,215,.8)"; ctx.beginPath(); ctx.arc(bx + Math.cos(i) * 60 * (1 + k), by - 40 * k - i * 8, 40 + k * 40, 0, TAU); ctx.fill(); } ctx.restore(); } }
      },
      post: () => { if (magic <= 0) return; ctx.globalAlpha = .22 * magic; ctx.fillStyle = "#5B3A8C"; ctx.fillRect(0, 0, 1080, 1920); ctx.globalAlpha = 1;
        for (let i = 0; i < 18; i++){ const x = rnd(i) * 1080, y = 200 + rnd(i + 8) * 1200 + Math.sin(t + i) * 20, a = .5 + .5 * Math.sin(t * 4 + i * 2); ctx.globalAlpha = a * magic; sparkle(ctx, x, y, 10 + rnd(i + 2) * 10, i % 2 ? GOLD : "#E9D8FF"); } ctx.globalAlpha = 1; }
    });
  }, (s, f, i, add) => { const B = f.ball || {}; if (B.cue) add(cueT(s, B.cue, .2, i), "chime"); if (B.hatCue) add(cueT(s, B.hatCue, .2, i) + .2, "pop"); if (B.textCue) add(cueT(s, B.textCue, .4, i), "ping");
    if (B.crackCue){ const tc = cueT(s, B.crackCue, .5, i); add(tc, "pop"); add(B.smashCue ? cueT(s, B.smashCue, .6, i) : tc + 1.1, "whoosh"); } });

  /* ================= _bintang: waiting customer + trust stars falling ================= */
  reg("bintang", "Cerita: papan bintang kepercayaan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, dur = TT.sceneDur ? TT.sceneDur() : 10, sun = f.sun || {}, tW = T(s, f.weedCue, .5, idx);
    base(ctx, s, t, { env: "street",
      envAfter: (ctx2, c) => { if (sun.off) return; layer(ctx, c, .25, () => { const p = clamp(t / Math.max(3, dur), 0, 1), sx = lerp(sun.x0 ?? 120, sun.x1 ?? 900, p), sy = lerp(sun.y0 ?? 760, sun.y1 ?? 300, eOut(p));
        glowAt(ctx, sx, sy, 200, "#FFE7A8", .6); ctx.beginPath(); ctx.arc(sx, sy, 62, 0, TAU); ctx.fillStyle = "#FFD36B"; ctx.fill();
        ctx.strokeStyle = "#FFD36B"; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 10; i++){ const a = i / 10 * TAU + t * .4; ctx.beginPath(); ctx.moveTo(sx + Math.cos(a) * 82, sy + Math.sin(a) * 82); ctx.lineTo(sx + Math.cos(a) * 104, sy + Math.sin(a) * 104); ctx.stroke(); } }); },
      front: () => { if (t < tW) return; const k = t - tW, x = -150 + k * 520, y = GROUND - 60 - Math.abs(Math.sin(k * 5)) * 70; if (x > 1300) return;
        ctx.save(); ctx.translate(x, y); ctx.rotate(k * 6); ctx.strokeStyle = "#A07A4A"; ctx.lineWidth = 6; for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.arc(rnd(i) * 20 - 10, rnd(i + 4) * 20 - 10, 30 + rnd(i + 2) * 28, rnd(i) * 6, rnd(i) * 6 + 3.5); ctx.stroke(); } ctx.restore(); }
    });
  }, (s, f, i, add) => { if (f.weedCue) add(cueT(s, f.weedCue, .5, i), "whoosh"); });

  /* ================= _pipa: pneumatic tube to the warehouse bubble ================= */
  function capsule(ctx, x, y, rot, label, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rr(ctx, -46, -78, 92, 156, 40); ctx.fillStyle = "rgba(220,240,250,.9)"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = col || ORANGE; rr(ctx, -46, -78, 92, 34, 16); ctx.fill(); rr(ctx, -46, 44, 92, 34, 16); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; rr(ctx, -46, -78, 92, 156, 40); ctx.stroke();
    ctx.fillStyle = PAPER; ctx.save(); ctx.rotate(Math.PI / 2); rr(ctx, -34, -28, 68, 56, 6); ctx.fill(); ctx.strokeStyle = "#C9B79C"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); ctx.restore(); }
  reg("pipa", "Cerita: pipa kapsul ke gudang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, U = Object.assign({ start: [170, 1330], bx: 730, by: 520, br: 250 }, f.tube || {});
    const tG = T(s, U.bubbleCue, .1, idx), tS = T(s, U.sendCue, .3, idx), tB = T(s, U.backCue, .4, idx), tR = U.readCue ? T(s, U.readCue, .5, idx) : tS + 1.3;
    // tube path (world): up from the counter, across, into the bubble
    const pts = [U.start, [U.start[0], U.by + 60], [U.start[0] + 60, U.by - 10], [U.bx - U.br - 40, U.by - 10], [U.bx - U.br * .3, U.by - 10]];
    const segL = []; let L = 0; for (let i = 1; i < pts.length; i++){ const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segL.push(d); L += d; }
    const at = u => { let d = clamp(u, 0, 1) * L; for (let i = 0; i < segL.length; i++){ if (d <= segL[i]){ const q = d / segL[i]; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q), Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])]; } d -= segL[i]; } const p = pts[pts.length - 1]; return [p[0], p[1], 0]; };
    let u = -1; if (t >= tS && t < tB){ u = eIn(clamp((t - tS) / .8, 0, 1)) * .6 + clamp((t - tS) / .8, 0, 1) * .4; } if (t >= tB){ u = 1 - clamp((t - tB) / .8, 0, 1); if (t - tB > .8) u = -2; }
    const capP = u >= 0 ? at(u) : null, bq = pop(t, tG, .5);
    const koko = U.worker ? Object.assign({ x: U.bx + 60, y: U.by + U.br * .95, size: 330, face: -1 }, U.worker) : null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      spots: { bubble: [U.bx, U.by + 80, 1.25], cap: () => capP ? [capP[0], capP[1], 1.1] : [540, 1000, 1] },
      front: (ctx2) => {
        // tube
        ctx.lineCap = "round"; ctx.lineJoin = "round"; const tube = (w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); };
        if (bq > 0){ ctx.save(); ctx.globalAlpha = clamp(bq, 0, 1); tube(118, OUT); tube(104, "rgba(214,238,248,.95)"); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 12; ctx.setLineDash([60, 90]); ctx.lineDashOffset = -t * 120; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0] - 26, p[1] - 26) : ctx.moveTo(p[0] - 26, p[1])); ctx.stroke(); ctx.setLineDash([]);
          // mouth at the counter
          ctx.fillStyle = "#8A8278"; rr(ctx, U.start[0] - 74, U.start[1] - 20, 148, 60, 14); ctx.fill(); ol(ctx, 5); ctx.restore(); }
        if (capP){ capsule(ctx, capP[0], capP[1], capP[2] + Math.PI / 2, "", ORANGE); for (let i = 1; i < 6; i++){ const pb = at(Math.max(0, u - (t < tB ? i * .03 : -i * .03))); ctx.globalAlpha = .25 / i * 3; ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(pb[0], pb[1], 30, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; } }
        // warehouse bubble
        if (bq > 0){ ctx.save(); ctx.translate(U.bx, U.by); ctx.scale(bq, bq);
          ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.arc(10, 14, U.br, 0, TAU); ctx.fill();
          ctx.save(); ctx.beginPath(); ctx.arc(0, 0, U.br, 0, TAU); ctx.clip();
          ctx.fillStyle = "#6B4A33"; ctx.fillRect(-U.br, -U.br, U.br * 2, U.br * 2);
          for (let r = 0; r < 3; r++){ const sy = -U.br + 120 + r * 150; ctx.fillStyle = "#3E2A1C"; ctx.fillRect(-U.br, sy, U.br * 2, 16);
            for (let b = 0; b < 6; b++){ const bw = 70 + rnd(b + r * 6) * 40, bh = 70 + rnd(b + r * 3) * 50, bx2 = -U.br + 20 + b * 95; ctx.fillStyle = ["#D9A066", "#C98B4E", "#E8B97A"][(b + r) % 3]; ctx.fillRect(bx2, sy - bh, bw, bh); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(bx2, sy - bh, bw, bh); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(bx2 + bw / 2 - 6, sy - bh, 12, bh); } }
          ctx.restore();
          ctx.restore();
          if (koko){ const kst = toonState(koko, s, t); ctx.save(); ctx.beginPath(); ctx.arc(U.bx, U.by, U.br * bq, 0, TAU); ctx.clip(); drawToon(ctx, koko, kst, t);
            if (t > tR && t < tB + .2){ const [hx, hy] = toonHead(kst); ctx.fillStyle = PAPER; ctx.save(); ctx.translate(hx - 90, hy + 110); ctx.rotate(-.2 + Math.sin(t * 9) * .05); rr(ctx, -40, -30, 80, 60, 6); ctx.fill(); ol(ctx, 3); ctx.restore(); }
            ctx.restore(); }
          ctx.save(); ctx.translate(U.bx, U.by); ctx.scale(bq, bq); ctx.beginPath(); ctx.arc(0, 0, U.br, 0, TAU); ctx.lineWidth = 16; ctx.strokeStyle = CREAM; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.arc(0, 0, U.br + 9, 0, TAU); ctx.stroke();
          font(ctx, 900, 34, FAM); const lab = U.label || "GUDANG", lw2 = ctx.measureText(lab).width + 44; rr(ctx, -lw2 / 2, -U.br - 30, lw2, 56, 28); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(lab, 0, -U.br + 10); ctx.textAlign = "left"; ctx.restore();
          if (t > tS + .8 && t < tS + 1.6) burstFx(ctx, U.bx - U.br * .3, U.by, t - tS - .8, HL, 10, 120); }
        if (t > tB + .8 && t < tB + 1.7) burstFx(ctx, U.start[0], U.start[1] - 40, t - tB - .8, GOLD, 10, 160);
      }
    });
  }, (s, f, i, add) => { const U = f.tube || {}; if (U.bubbleCue) add(cueT(s, U.bubbleCue, .1, i), "pop"); if (U.sendCue){ add(cueT(s, U.sendCue, .3, i), "whoosh"); add(cueT(s, U.sendCue, .3, i) + .8, "pop"); } if (U.backCue){ add(cueT(s, U.backCue, .4, i), "whoosh"); add(cueT(s, U.backCue, .4, i) + .8, "chime"); } });

  /* ================= _bunga: interest literally grows as flowers ================= */
  function flower(ctx, x, y, r, t, i, wither, faceOn){ const droop = wither * 1.2, col = mixHex(["#F08C2E", "#E8607A", "#F6C343", "#D9483B"][i % 4], "#7A5A3A", wither);
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2 + i) * .12 + droop * (i % 2 ? 1 : -1)); ctx.scale(1, 1 - wither * .3);
    for (let p = 0; p < 6; p++){ const a = p / 6 * TAU + t * .3; ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * .72, Math.sin(a) * r * .72, r * .55, r * .36, a, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, Math.max(3, r * .07)); }
    ctx.beginPath(); ctx.arc(0, 0, r * .55, 0, TAU); ctx.fillStyle = mixHex(CREAM, "#9A8A70", wither); ctx.fill(); ol(ctx, Math.max(3, r * .07));
    if (faceOn){ textC(ctx, "%", 0, r * .12, r * .52, mixHex(RED, "#5A4A3A", wither), 900); const ey = -r * .28; ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-r * .2, ey, r * .07, 0, TAU); ctx.arc(r * .2, ey, r * .07, 0, TAU); ctx.fill();
      ctx.beginPath(); if (wither > .3) ctx.arc(0, r * .42, r * .12, Math.PI * 1.15, Math.PI * 1.85); else ctx.arc(0, r * .28, r * .14, .3, Math.PI - .3); ol(ctx, Math.max(2, r * .05)); }
    ctx.restore(); }
  function garden(ctx, s, t, Gd, idx){
    const x = Gd.x ?? 780, y = Gd.y ?? GROUND - 10, S = Gd.scale || 1, tPot = Gd.potCue ? T(s, Gd.potCue, .2, idx) : (Gd.potAt ?? 0), tSeed = T(s, Gd.seedCue, .4, idx), tW = T(s, Gd.witherCue, .4, idx);
    const lv = (Gd.grow || []).map((g, j) => ({ T: tOf(s, g, .3 + j * .1, idx), g: g.g })).sort((a, b) => a.T - b.T); let gl = Gd.g0 || 0, prev = gl, gT = -9;
    lv.forEach(L => { if (t >= L.T){ prev = gl; gl = L.g; gT = L.T; } }); const G = gT < -1 ? gl : lerp(prev, gl, eBack(clamp((t - gT) / .9, 0, 1)));
    const W = t >= tW ? clamp((t - tW) / 1.4, 0, 1) : 0, fade = t >= tW ? clamp((t - tW - 1.2) / .6, 0, 1) : 0;
    const pq = pop(t, tPot, .45); if (pq <= 0 && G <= 0) return { top: [x, y - 160 * S] };
    ctx.save(); ctx.translate(x, y); ctx.scale(S, S);
    // stems + flowers
    if (G > 0 && fade < 1){ ctx.save(); ctx.globalAlpha *= 1 - fade; const N = Gd.stems || 5;
      for (let i = 0; i < N; i++){ const gi = clamp(G - i * .35, 0, 1.6); if (gi <= 0) continue; const ang = (i - (N - 1) / 2) * .38 + Math.sin(t * 1.2 + i) * .05, len = (260 + rnd(i) * 200) * gi * (Gd.reach || 1);
        const tipx = Math.sin(ang) * len + Math.sin(t + i) * 10, tipy = -150 - Math.cos(ang) * len * (1 - W * .4) + W * len * .25, mx = Math.sin(ang) * len * .3 + (i % 2 ? 60 : -60), my = -150 - len * .55;
        ctx.strokeStyle = mixHex("#3E7D4F", "#7A5A3A", W); ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -150); ctx.quadraticCurveTo(mx, my, tipx, tipy); ctx.stroke();
        ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
        for (let l = 1; l < 4; l++){ const u = l / 4, lx = (1 - u) * (1 - u) * 0 + 2 * (1 - u) * u * mx + u * u * tipx, ly = (1 - u) * (1 - u) * -150 + 2 * (1 - u) * u * my + u * u * tipy;
          ctx.save(); ctx.translate(lx, ly); ctx.rotate((l % 2 ? -1 : 1) * (.9 + W * .8) + Math.sin(t * 2 + l + i) * .1); ctx.beginPath(); ctx.ellipse(28, 0, 30 * Math.min(1, gi * 1.4), 13, 0, 0, TAU); ctx.fillStyle = mixHex("#5FA85F", "#8A6A40", W); ctx.fill(); ol(ctx, 3); ctx.restore(); }
        const fr = 34 + 46 * clamp(gi - .3, 0, 1); if (gi > .3) flower(ctx, tipx, tipy, fr, t, i, W, true); }
      // falling petals while withering
      if (W > 0) for (let i = 0; i < 14; i++){ const k = (t - tW) * (.6 + rnd(i) * .5); const px = (rnd(i + 3) - .5) * 600 + Math.sin(k * 4 + i) * 40, py = -500 + rnd(i + 6) * 300 + k * 360; ctx.fillStyle = hexA("#B07A50", .8); ctx.beginPath(); ctx.ellipse(px, py, 14, 7, k * 4 + i, 0, TAU); ctx.fill(); }
      ctx.restore(); }
    // pot
    if (pq > 0){ ctx.save(); ctx.scale(pq, pq); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 170, 26, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-140, -150); ctx.lineTo(140, -150); ctx.lineTo(110, 0); ctx.lineTo(-110, 0); ctx.closePath(); ctx.fillStyle = "#C8673A"; ctx.fill(); ol(ctx, 6);
      rr(ctx, -160, -190, 320, 56, 14); ctx.fillStyle = "#D97B48"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#5A3A2A"; ctx.beginPath(); ctx.ellipse(0, -190, 140, 18, 0, 0, TAU); ctx.fill();
      textC(ctx, Gd.label || "SISA TAGIHAN", 0, -60, 34, CREAM, 900, 220);
      // seed
      if (t >= tSeed && G < .2){ const k = t - tSeed, yy = Math.min(-200, -620 + 1600 * k * k), bounce = k > .62 && k < 1 ? Math.sin((k - .62) / .38 * Math.PI) * 30 : 0; ctx.save(); ctx.translate(0, yy - bounce); ctx.rotate(k * 5);
        ctx.beginPath(); ctx.ellipse(0, 0, 34, 26, 0, 0, TAU); ctx.fillStyle = "#8A5A34"; ctx.fill(); ol(ctx, 5); textC(ctx, "%", 0, 12, 34, GOLD, 900); ctx.restore(); if (k > .6 && k < 1.5) burstFx(ctx, 0, -200, k - .6, HL, 8, 90); }
      ctx.restore(); }
    ctx.restore();
    return { top: [x, y - 160 * S] };
  }
  function billSheet(ctx, s, t, B, idx){ const tA = B.cue ? T(s, B.cue, .2, idx) : (B.at ?? 0), q = pop(t, tA, .5); if (q <= 0) return;
    const tM = T(s, B.minCue, .4, idx), tSw = T(s, B.swellCue, .4, idx), tP = T(s, B.paidCue, .4, idx), sw = t >= tSw ? eBack(clamp((t - tSw) / .8, 0, 1)) : 0;
    const x = B.x ?? 300, y = B.y ?? 600, w = 400, h = 500, wob = sw > 0 ? Math.sin(t * 9) * .03 * sw : 0;
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.7) * 8); ctx.rotate((B.rot ?? -.05) + Math.sin(t * 1.1) * .02 + wob); ctx.scale(q * (1 + sw * .18), q * (1 + sw * .12));
    ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -w / 2 + 12, -h / 2 + 14, w, h, 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2, h / 2); for (let k = 0; k <= 10; k++) ctx.lineTo(w / 2 - k * w / 10, h / 2 + (k % 2 ? 16 : 0)); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = ORANGE; rr(ctx, -w / 2 + 24, -h / 2 + 24, w - 48, 70, 12); ctx.fill(); textC(ctx, B.title || "TAGIHAN", 0, -h / 2 + 72, 40, CREAM, 900, w - 80);
    font(ctx, 600, 26, FAM); ctx.fillStyle = "#8A7A68"; ctx.fillText("Kartu kredit", -w / 2 + 34, -h / 2 + 140);
    for (let k = 0; k < 3; k++){ ctx.fillStyle = "#E6DCCB"; rr(ctx, -w / 2 + 34, -h / 2 + 170 + k * 34, w - 68 - k * 50, 14, 7); ctx.fill(); }
    textC(ctx, "TOTAL", 0, 40, 30, "#8A7A68", 800); textC(ctx, sw > 0 ? (B.amount2 || B.amount) : (B.amount || "Rp2.000.000"), 0, 100, 54, sw > 0 ? RED : BROWN, 900, w - 60);
    // minimum line
    ctx.fillStyle = "#F4EBDD"; rr(ctx, -w / 2 + 30, 140, w - 60, 64, 12); ctx.fill(); font(ctx, 700, 28, FAM); ctx.fillStyle = BROWN; ctx.fillText(B.minLabel || "Bayar minimum", -w / 2 + 48, 182);
    if (t >= tM){ const k = clamp((t - tM) / .6, 0, 1); ctx.strokeStyle = HL; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, 172, (w - 30) / 2 + 10, 50, -.03, -.5, -.5 + TAU * k); ctx.stroke(); if (k >= 1){ sparkle(ctx, w / 2 - 10, 120, 18 + 6 * Math.sin(t * 8), GOLD); } }
    if (sw > 0){ ctx.save(); ctx.translate(w / 2 - 20, -20); ctx.rotate(.2); chipLocal(ctx, B.swellTag || "+ BUNGA", sw, RED); ctx.restore(); }
    if (t >= tP) stampBox(ctx, B.paidText || "LUNAS", 0, 30, t - tP, GREEN, 70, -.2);
    ctx.restore(); }
  function chipLocal(ctx, txt, q, col){ font(ctx, 900, 36, FAM); const w = ctx.measureText(txt).width + 40; ctx.save(); ctx.scale(q, q); rr(ctx, -w / 2, -30, w, 60, 30); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(txt, 0, 13); ctx.textAlign = "left"; ctx.restore(); }
  function creditCard(ctx, x, y, w, rot, q, t){ if (q <= 0) return; const h = w * .63; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(q, q);
    ctx.fillStyle = "rgba(43,26,18,.3)"; rr(ctx, -w / 2 + 8, -h / 2 + 10, w, h, 22); ctx.fill();
    const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, "#E8853A"); g.addColorStop(1, "#8E3F14"); rr(ctx, -w / 2, -h / 2, w, h, 22); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.moveTo(-w / 2 + ((t * 200) % (w * 2)) - w * .4, -h / 2); ctx.lineTo(-w / 2 + ((t * 200) % (w * 2)) - w * .2, -h / 2); ctx.lineTo(-w / 2 + ((t * 200) % (w * 2)) - w * .5, h / 2); ctx.lineTo(-w / 2 + ((t * 200) % (w * 2)) - w * .7, h / 2); ctx.fill();
    rr(ctx, -w / 2 + w * .1, -h * .18, w * .17, h * .26, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3);
    font(ctx, 700, w * .07, FAM); ctx.fillStyle = CREAM; ctx.fillText("•••• •••• •••• 2026", -w / 2 + w * .1, h * .26); font(ctx, 900, w * .075, FAM); ctx.fillText("KARTU KREDIT", -w / 2 + w * .1, -h * .3);
    ctx.restore(); }
  reg("bunga", "Cerita: bunga tagihan tumbuh", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gd = f.garden || {}, B = f.bill, Cd = f.card, Py = f.pay;
    let potTop = null;
    base(ctx, s, t, { env: "home",
      spots: { pot: () => potTop ? [potTop[0], potTop[1] - 120, 1.2] : [540, 1000, 1], bill: () => B ? [B.x ?? 300, B.y ?? 600, 1.25] : [540, 900, 1] },
      back: () => { if (Gd.behind !== false){ const r = garden(ctx, s, t, Gd, idx); potTop = r.top; } },
      front: () => { if (Gd.behind === false){ const r = garden(ctx, s, t, Gd, idx); potTop = r.top; }
        if (B) billSheet(ctx, s, t, B, idx);
        if (Cd){ const tc = T(s, Cd.cue, .2, idx), k = t - tc; if (k >= 0){ const q = eBack(clamp(k / .5, 0, 1)), fly = 1 - eOut(clamp(k / .6, 0, 1)); creditCard(ctx, (Cd.x ?? 760) + fly * 500, (Cd.y ?? 640) - fly * 300 + Math.sin(t * 2) * 10, Cd.w || 360, (Cd.rot ?? .12) + fly * 3 + Math.sin(t * 1.5) * .04, q, t); } }
        if (Py){ const tp = T(s, Py.cue, .2, idx), tPr = T(s, Py.pressCue, .4, idx), q = pop(t, tp, .45); if (q > 0){ const x = Py.x ?? 760, y = Py.y ?? 760, pr = t >= tPr ? Math.max(0, 1 - (t - tPr) / .25) * (t - tPr < .12 ? (t - tPr) / .12 : 1) : 0, down = t >= tPr ? 1 : 0;
          ctx.save(); ctx.translate(x, y); ctx.scale(q, q); glowAt(ctx, 0, 0, 260, down ? GREEN : HL, .35 + .15 * Math.sin(t * 5));
          ctx.fillStyle = "#5A3A2A"; rr(ctx, -190, -40, 380, 120, 50); ctx.fill(); ol(ctx, 6);
          const dy = down ? 18 : 6 * Math.sin(t * 4) * 0; rr(ctx, -180, -78 + dy, 360, 120, 50); ctx.fillStyle = down ? GREEN : ORANGE; ctx.fill(); ol(ctx, 6);
          textC(ctx, Py.text || "BAYAR PENUH", 0, -6 + dy, 44, CREAM, 900, 320); ctx.restore(); if (t >= tPr) burstFx(ctx, x, y - 20, t - tPr, GREEN, 12, 240); } }
      }
    });
  }, (s, f, i, add) => { const Gd = f.garden || {}; if (Gd.potCue) add(cueT(s, Gd.potCue, .2, i), "pop"); if (Gd.seedCue) add(cueT(s, Gd.seedCue, .4, i) + .6, "pop"); (Gd.grow || []).forEach((g, j) => add(tOf(s, g, .3 + j * .1, i), "whoosh"));
    if (Gd.witherCue) add(cueT(s, Gd.witherCue, .4, i), "whoosh"); const B = f.bill; if (B){ if (B.cue) add(cueT(s, B.cue, .2, i), "whoosh"); if (B.minCue) add(cueT(s, B.minCue, .4, i), "ping"); if (B.swellCue) add(cueT(s, B.swellCue, .4, i), "pop"); if (B.paidCue) add(cueT(s, B.paidCue, .4, i) + .15, "chime"); }
    if (f.card) add(cueT(s, f.card.cue, .2, i), "whoosh"); if (f.pay){ add(cueT(s, f.pay.cue, .2, i), "pop"); if (f.pay.pressCue) add(cueT(s, f.pay.pressCue, .4, i), "chime"); } });

  /* ================= _mobil: family car with decision luggage ================= */
  reg("mobil", "Cerita: mobil keluarga + koper keputusan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, C = Object.assign({ x: 560, col: TEAL, speed: 420 }, f.car || {});
    const bags = (C.bags || []).map((b, j) => Object.assign({ T: tOf(s, b, .3 + j * .1, idx), j }, b));
    const tJ = T(s, C.joinCue, .3, idx), tDrop = C.drop ? T(s, C.drop.cue, .4, idx) : 1e9, tChk = C.check ? T(s, C.check.cue, .4, idx) : 1e9, tLift = T(s, C.liftCue, .5, idx);
    const onRoof = bags.filter(b => t >= b.T && !(C.drop && C.drop.i === b.j && t >= tDrop + .9)).length;
    const lift = t >= tLift ? eBack(clamp((t - tLift) / .8, 0, 1)) : 0;
    const sagT = Math.min(70, onRoof * 22) * (1 - lift), struggle = sagT > 30 ? 1 : 0;
    const bounce = Math.sin(t * (struggle ? 7 : 11)) * (struggle ? 3 : 5) + (lift > 0 ? Math.abs(Math.sin(t * 5)) * -8 : 0);
    const cx = C.x, gy = GROUND, sag = sagT + bounce, yB = gy - 330 + sag, yR = gy - 720 + sag;
    const speed = C.speed * (struggle ? .45 : 1) * (1 + lift * .6);
    base(ctx, s, t, { env: "night",
      adjust: sts => sts.forEach(st => { st.y += sag; }),
      spots: { roof: [cx, yR - 160, 1.0], car: [cx, gy - 520, 1.0] },
      envAfter: (ctx2, c) => layer(ctx, c, .85, () => { // passing lamp posts
        for (let i = 0; i < 4; i++){ const x = ((i * 520 - t * speed * .85) % 2080 + 2080) % 2080 - 500; ctx.fillStyle = "#3A3248"; ctx.fillRect(x, gy - 860, 18, 760); ctx.fillRect(x - 60, gy - 860, 80, 14); glowAt(ctx, x - 50, gy - 830, 150, "#FFD9A0", .45); ctx.fillStyle = "#FFE7B8"; ctx.beginPath(); ctx.arc(x - 50, gy - 838, 16, 0, TAU); ctx.fill(); } }),
      back: () => { // road + car interior
        ctx.fillStyle = "#3A3446"; ctx.fillRect(-2000, gy - 40, 5000, 400); ctx.fillStyle = "#F6E2C4"; for (let i = 0; i < 9; i++){ const x = ((i * 260 - t * speed) % 2340 + 2340) % 2340 - 600; rr(ctx, x, gy + 70, 140, 16, 8); ctx.fill(); }
        // interior
        ctx.fillStyle = "#1E1A2A"; ctx.beginPath(); ctx.moveTo(cx - 300, yB); ctx.lineTo(cx - 290, yR + 40); ctx.quadraticCurveTo(cx - 280, yR + 10, cx - 240, yR + 10); ctx.lineTo(cx + 150, yR + 10); ctx.quadraticCurveTo(cx + 200, yR + 14, cx + 230, yR + 60); ctx.lineTo(cx + 320, yB); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#5A3A2A"; [[cx - 250, 180], [cx + 40, 170]].forEach(([sx, w]) => { rr(ctx, sx, yR + 120, 60, yB - yR - 80, 26); ctx.fill(); });
      },
      front: () => {
        // body with windows cut out
        ctx.save(); ctx.beginPath();
        ctx.moveTo(cx - 470, gy - 90 + sag); ctx.lineTo(cx - 470, yB + 20); ctx.quadraticCurveTo(cx - 460, yB - 20, cx - 340, yB - 30); ctx.lineTo(cx - 320, yR + 30); ctx.quadraticCurveTo(cx - 310, yR - 10, cx - 250, yR - 10);
        ctx.lineTo(cx + 160, yR - 10); ctx.quadraticCurveTo(cx + 220, yR - 6, cx + 260, yR + 50); ctx.lineTo(cx + 350, yB - 30); ctx.quadraticCurveTo(cx + 470, yB - 20, cx + 480, yB + 40); ctx.lineTo(cx + 480, gy - 90 + sag); ctx.closePath();
        // windows (holes)
        ctx.moveTo(cx - 285, yB - 10); ctx.lineTo(cx - 280, yR + 45); ctx.quadraticCurveTo(cx - 276, yR + 22, cx - 245, yR + 22); ctx.lineTo(cx - 40, yR + 22); ctx.lineTo(cx - 40, yB - 10); ctx.closePath();
        ctx.moveTo(cx - 10, yB - 10); ctx.lineTo(cx - 10, yR + 22); ctx.lineTo(cx + 150, yR + 22); ctx.quadraticCurveTo(cx + 200, yR + 26, cx + 225, yR + 70); ctx.lineTo(cx + 300, yB - 10); ctx.closePath();
        ctx.fillStyle = C.col; ctx.fill("evenodd"); ctx.lineWidth = 7; ctx.strokeStyle = OUT; ctx.stroke(); ctx.restore();
        // glass shine
        ctx.fillStyle = "rgba(200,230,255,.13)"; ctx.beginPath(); ctx.moveTo(cx + 60, yR + 22); ctx.lineTo(cx + 120, yR + 22); ctx.lineTo(cx + 40, yB - 10); ctx.lineTo(cx - 20, yB - 10); ctx.fill();
        // stripe, door lines, handle, lights
        ctx.fillStyle = hexA(CREAM, .85); ctx.fillRect(cx - 465, yB + 70, 940, 20); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 25, yB - 10); ctx.lineTo(cx - 25, gy - 100 + sag); ctx.stroke();
        ctx.fillStyle = OUT; rr(ctx, cx + 60, yB + 30, 70, 14, 7); ctx.fill(); rr(ctx, cx - 230, yB + 30, 70, 14, 7); ctx.fill();
        ctx.fillStyle = "#FFE7A8"; rr(ctx, cx + 440, yB + 10, 40, 50, 12); ctx.fill(); ol(ctx, 4); glowAt(ctx, cx + 560, yB + 40, 220, "#FFE7A8", .4);
        ctx.fillStyle = RED; rr(ctx, cx - 474, yB + 10, 26, 50, 10); ctx.fill(); ol(ctx, 4);
        // wheels
        [cx - 270, cx + 290].forEach(wx => { const wy = gy - 78, sq = 1 - sagT / 500; ctx.save(); ctx.translate(wx, wy + (1 - sq) * 40); ctx.scale(1, sq); ctx.beginPath(); ctx.arc(0, 0, 82, 0, TAU); ctx.fillStyle = "#1E1A2A"; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.arc(0, 0, 42, 0, TAU); ctx.fillStyle = "#C9C2B4"; ctx.fill(); ol(ctx, 4); ctx.rotate(t * speed / 82); ctx.strokeStyle = "#6A6274"; ctx.lineWidth = 7; for (let k = 0; k < 5; k++){ ctx.rotate(TAU / 5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 36); ctx.stroke(); } ctx.restore(); });
        // roof rack
        ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx - 250, yR - 10); ctx.lineTo(cx - 250, yR - 40); ctx.lineTo(cx + 150, yR - 40); ctx.lineTo(cx + 150, yR - 10); ctx.stroke();
        // bags
        let stackY = yR - 40; const tilt = struggle ? Math.sin(t * 3) * .05 * onRoof : 0;
        bags.forEach((b, n) => { if (t < b.T) return; const k = t - b.T, w = b.w || 330 - n * 30, h = b.h || 120, dropping = C.drop && C.drop.i === b.j && t >= tDrop;
          let bx = cx - 50 + (n % 2 ? 22 : -22), by = stackY - h, rot = tilt * (n + 1) + (n % 2 ? .04 : -.04);
          const fall = k < .5 ? (1 - eOut(k / .5)) : 0; by -= fall * 700; const sqb = k > .5 && k < .8 ? Math.sin((k - .5) / .3 * Math.PI) * .15 : 0;
          if (dropping){ const d = t - tDrop; bx += -d * 900; by += -500 * d + 1100 * d * d; rot += -d * 6; if (d > 1.2) return; }
          else stackY -= h - 6;
          ctx.save(); ctx.translate(bx, by + h / 2); ctx.rotate(rot); ctx.scale(1 + sqb, 1 - sqb);
          rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = b.col || ["#C2691F", "#7FA563", "#5B7DB1", "#E8A55B"][n % 4]; ctx.fill(); ol(ctx, 6);
          ctx.strokeStyle = hexA(OUT, .55); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w / 2 + 40, -h / 2); ctx.lineTo(-w / 2 + 40, h / 2); ctx.moveTo(w / 2 - 40, -h / 2); ctx.lineTo(w / 2 - 40, h / 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-30, -h / 2); ctx.quadraticCurveTo(0, -h / 2 - 34, 30, -h / 2); ol(ctx, 8);
          textC(ctx, String(b.label || "").toUpperCase(), 0, 15, 44, CREAM, 900, w - 100);
          if (C.check && C.check.i === b.j && t >= tChk){ const q = eBack(clamp((t - tChk) / .4, 0, 1)); ctx.save(); ctx.translate(w / 2 - 10, -h / 2 + 4); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5);
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(16, -11); ctx.stroke(); ctx.restore(); }
          if (dropping && C.drop.tag){ ctx.rotate(-rot); chipLocal(ctx, C.drop.tag, clamp((t - tDrop) / .3, 0, 1), ORANGE); }
          ctx.restore(); if (k > .45 && k < 1.2) burstFx(ctx, bx, by + h, k - .45, HL, 8, 120); });
        // exhaust smoke
        for (let i = 0; i < 7; i++){ const k = ((t * (struggle ? 1.4 : .9) + i / 7) % 1), px = cx - 500 - k * 300, py = gy - 110 + sag - k * 120; ctx.globalAlpha = (1 - k) * (struggle ? .8 : .35); ctx.fillStyle = struggle ? "#6A6274" : "#D8D2E0"; ctx.beginPath(); ctx.arc(px, py, 26 + k * 60 * (struggle ? 1.3 : .8), 0, TAU); ctx.fill(); }
        ctx.globalAlpha = 1;
        // sweat drops from the car when struggling / hearts when light
        if (struggle) for (let i = 0; i < 3; i++){ const k = (t * 1.2 + i / 3) % 1; ctx.globalAlpha = 1 - k; ctx.fillStyle = "#9FD3E8"; ctx.beginPath(); const px = cx + 330 + i * 40, py = yR + 40 + k * 140; ctx.moveTo(px, py - 22); ctx.quadraticCurveTo(px + 16, py, px, py + 10); ctx.quadraticCurveTo(px - 16, py, px, py - 22); ctx.fill(); ctx.globalAlpha = 1; }
        if (lift > 0){ for (let i = 0; i < 6; i++){ const k = ((t - tLift) * .6 + i / 6) % 1; ctx.globalAlpha = (1 - k) * lift; ctx.strokeStyle = CREAM; ctx.lineWidth = 8; ctx.lineCap = "round"; const yy = gy - 600 + i * 80; ctx.beginPath(); ctx.moveTo(cx - 520 - k * 200, yy); ctx.lineTo(cx - 640 - k * 260, yy); ctx.stroke(); } ctx.globalAlpha = 1;
          if (t - tLift < 1.1) burstFx(ctx, cx, yR - 120, t - tLift, GOLD, 12, 320); }
      }
    });
  }, (s, f, i, add) => { const C = f.car || {}; (C.bags || []).forEach((b, j) => add(tOf(s, b, .3 + j * .1, i) + .45, "pop")); if (C.joinCue) add(cueT(s, C.joinCue, .3, i), "whoosh"); if (C.drop) add(cueT(s, C.drop.cue, .4, i), "whoosh"); if (C.check) add(cueT(s, C.check.cue, .4, i), "chime"); if (C.liftCue) add(cueT(s, C.liftCue, .5, i), "chime"); });

  /* ================= _lompat: day-tile path in the sky ================= */
  reg("lompat", "Cerita: lompat petak hari", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x0: 200, sp: 250, y: 1180, w: 214, hero: 0 }, f.track || {});
    const tiles = K.tiles || [], X = i => K.x0 + i * K.sp;
    const path = (f.path || []).map((p, j) => Object.assign({ T: tOf(s, p, .3, idx) }, p)).sort((a, b) => a.T - b.T);
    // hero schedule
    let tile = K.start ?? 0, from = tile, segT = -9, how = "stand", dur = 0;
    path.forEach(p => { if (t >= p.T){ from = tile; tile = p.tile; segT = p.T; how = p.how || "run"; dur = p.dur || (how === "run" ? Math.max(.45, Math.abs(p.tile - from) * .38) : how === "leap" ? .9 : 1.2); } });
    const k = segT < -1 ? 1 : clamp((t - segT) / dur, 0, 1);
    let hx = X(tile), hy = K.y, moving = false, falling = false, fallK = 0;
    if (segT > -1 && k < 1 || how === "fall"){
      if (how === "run"){ const n = Math.abs(tile - from) || 1, u = k * n, sub = u - Math.floor(u); hx = lerp(X(from), X(tile), k); hy = K.y - Math.sin(sub * Math.PI) * 70; moving = k < 1; }
      else if (how === "leap"){ hx = lerp(X(from), X(tile), easeIO(k)); hy = K.y - Math.sin(k * Math.PI) * 300; moving = k < 1; }
      else if (how === "fall"){ const kk = t - segT; const edge = Math.min(1, kk / .5); hx = lerp(X(from), X(tile), edge); if (kk < .5) hy = K.y - Math.sin(edge * Math.PI) * 90; else { fallK = kk - .5; hy = Math.min(K.y + 1300 * fallK * fallK + 100 * fallK, K.y + (K.pitY ?? 680)); falling = true; } }
    }
    const landedOn = i => { // first time the hero stands on tile i
      let T0 = 1e9; let cur = K.start ?? 0; if (cur === i) T0 = -1; path.forEach(p => { if (p.how === "fall") return; const lo = Math.min(cur, p.tile), hi = Math.max(cur, p.tile); if (i >= lo && i <= hi && i !== cur){ const d = p.dur || ((p.how || "run") === "run" ? Math.max(.45, Math.abs(p.tile - cur) * .38) : .9); const fr = p.how === "leap" ? 1 : Math.abs(i - cur) / Math.max(1, Math.abs(p.tile - cur)); T0 = Math.min(T0, p.T + d * fr); } cur = p.tile; }); return T0; };
    const curDay = tiles[Math.round((hx - K.x0) / K.sp)] ? tiles[Math.round((hx - K.x0) / K.sp)].d : null;
    const tFall = path.find(p => p.how === "fall"); const fT = tFall ? tFall.T + .5 : 1e9;
    base(ctx, s, t, { env: f.env || "sky",
      adjust: sts => { const st = sts[K.hero]; if (st){ st.x = hx; st.y = hy; if (moving){ st.moving = true; st.run = true; st.moveT = t - segT; } } },
      spots: { hero: () => [hx + (K.lead ?? 140), Math.min(hy, K.y) - (K.camDy ?? 200), K.zoom || 1.0], pit: () => [hx + 150, K.y + 480, .85] },
      back: () => {
        // pit sign under gaps (appears when falling)
        if (t >= fT && tFall){ const px = X(tFall.tile), q = eBack(clamp((t - fT) / .6, 0, 1)), py = K.y + (K.pitY ?? 680);
          ctx.save(); ctx.translate(px, py + 40); ctx.scale(q, q); cloudBlob(ctx, 0, 30, 2.6, "#7C7590"); cloudBlob(ctx, 90, 60, 2.0, "#8E87A3"); cloudBlob(ctx, -120, 60, 1.8, "#8E87A3"); ctx.restore();
          ctx.save(); ctx.translate(px + 330, K.y + 420); ctx.scale(q, q); ctx.rotate(.06 + Math.sin(t * 2) * .04);
          ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 50); ctx.lineTo(0, 300); ctx.stroke();
          rr(ctx, -230, -70, 460, 130, 24); ctx.fillStyle = "#4B3F5E"; ctx.fill(); ol(ctx, 6); const L = String(K.pitText || "KEBIASAAN BARU").split(" ");
          L.forEach((l, i) => textC(ctx, l, 0, -12 + i * 52 - (L.length - 2) * 26, 46, i ? HL : CREAM, 900, 420)); ctx.restore(); }
        tiles.forEach((tl, i) => { const x = X(i), top = K.y + Math.sin(t * 1.5 + i) * 5, w = K.w;
          if (tl.miss){ ctx.save(); ctx.setLineDash([16, 14]); ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.lineWidth = 5; rr(ctx, x - w / 2, top, w, 120, 18); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
            textC(ctx, "H" + tl.d, x, top + 78, 40, "rgba(255,255,255,.7)", 900);
            if (tl.rain){ const cy = top - 380; cloudBlob(ctx, x, cy, 1.1, "#8E8AA0"); rain(ctx, x - 120, cy + 30, 240, 320, t, .9); }
            if (tl.bridgeCue){ const tb = T(s, tl.bridgeCue, .3, idx); if (t >= tb){ const q = clamp((t - tb) / .7, 0, 1), xa = x - K.sp / 2 - 20, xb = lerp(xa, x + K.sp / 2 + 20, q), y = top + 50 + Math.sin(t * 3) * 4;
              for (let xx = xa; xx < xb; xx += 30){ ctx.strokeStyle = GOLD; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(xx, y + Math.sin((xx - xa) / (K.sp + 40) * Math.PI) * 26, 22, 13, 0, 0, TAU); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.stroke(); }
              if (t - tb > .7 && t - tb < 1.6) burstFx(ctx, x, y, t - tb - .7, GOLD, 12, 200); } }
            return; }
          const T0 = tl.done ? -1 : landedOn(i), lit = t >= T0, q = lit ? eBack(clamp((t - T0) / .4, 0, 1)) : 0;
          ctx.fillStyle = "rgba(43,26,18,.2)"; rr(ctx, x - w / 2 + 8, top + 14, w, 130, 20); ctx.fill();
          rr(ctx, x - w / 2, top, w, 130, 20); ctx.fillStyle = lit ? "#F3D9B5" : "rgba(255,255,255,.55)"; ctx.fill(); ol(ctx, 6);
          rr(ctx, x - w / 2, top, w, 36, 18); ctx.fillStyle = lit ? (tl.hl ? GREEN : ORANGE) : "rgba(255,255,255,.7)"; ctx.fill(); ol(ctx, 5);
          textC(ctx, "H" + tl.d, x, top + 106, 44, lit ? BROWN : "rgba(59,36,24,.45)", 900);
          if (lit && !tl.done && t - T0 < 1) burstFx(ctx, x, top + 10, t - T0, tl.hl ? GREEN : HL, 10, 150);
          if (lit && q > 0){ ctx.save(); ctx.translate(x + w / 2 - 30, top - 6); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-3, 8); ctx.lineTo(11, -8); ctx.stroke(); ctx.restore(); }
          cloudBlob(ctx, x - 40, top + 150, .7, "rgba(255,255,255,.9)"); });
        // chain links between consecutive lit tiles
        for (let i = 0; i < tiles.length - 1; i++){ const a = tiles[i], b = tiles[i + 1]; if (a.miss || b.miss) continue; const T1 = Math.max(a.done ? -1 : landedOn(i), b.done ? -1 : landedOn(i + 1)); if (t < T1) continue;
          const x = X(i) + K.sp / 2, y = K.y + 64; ctx.strokeStyle = GOLD; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(x - 12, y, 22, 14, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(x + 12, y, 22, 14, 0, 0, TAU); ctx.stroke(); }
      },
      over: () => { if (K.hud === false) return; const red = t >= fT; chip(ctx, red ? (K.brokeText || "JALUR PUTUS!") : ((K.hudText || "HARI ") + (curDay ?? "")), 540, 240, 1, red ? RED : ORANGE, CREAM, 44, red ? "alert" : "star"); }
    });
  }, (s, f, i, add) => { (f.path || []).forEach(p => { const t0 = tOf(s, p, .3, i); add(t0, p.how === "fall" ? "whoosh" : p.how === "leap" ? "whoosh" : "pop"); if (p.how === "fall") add(t0 + 1.0, "ping"); }); ((f.track || {}).tiles || []).forEach(tl => { if (tl.bridgeCue) add(cueT(s, tl.bridgeCue, .3, i) + .7, "chime"); }); });

  /* ================= _sofa: the living sofa ================= */
  reg("sofa", "Cerita: sofa hidup membujuk", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, O = Object.assign({ x: 720, w: 600 }, f.sofa || {});
    const tWake = T(s, O.wakeCue, .1, idx), tArm = T(s, O.armCue, .3, idx), tDanger = T(s, O.dangerCue, .5, idx), tFree = T(s, O.freeCue, .6, idx), tCalm = T(s, O.calmCue, .6, idx);
    const says = (O.says || []).map(q => ({ T: tOf(s, q, .3, idx), text: q.text, d: q.dur || 2.2 }));
    const sayNow = says.filter(q => t >= q.T && t < q.T + q.d).pop();
    const awake = clamp((t - tWake) / .5, 0, 1), danger = t >= tDanger ? clamp((t - tDanger) / .4, 0, 1) * (t >= tCalm ? clamp(1 - (t - tCalm) / .6, 0, 1) : 1) : 0, sulk = t >= tFree ? clamp((t - tFree) / .5, 0, 1) : 0;
    let mouthScr = null;
    const sx = O.x, sy = GROUND, W = O.w, breathe = Math.sin(t * 2.2) * .02;
    const hero = (f.toons || [])[O.hero ?? 0];
    base(ctx, s, t, { env: "home", envOpt: Object.assign({ time: "day", lampX: 760 }, f.envOpt || {}),
      spots: { sofa: [sx, sy - 330, 1.15] },
      back: (ctx2, c, sts) => {
        ctx.save(); ctx.translate(sx, sy); ctx.scale(1 + breathe, 1 - breathe);
        const col = mixHex("#B4532A", "#7A1F1F", danger), dark = mixHex("#8E3F1E", "#4A1010", danger);
        ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.ellipse(0, 6, W * .6, 30, 0, 0, TAU); ctx.fill();
        // legs
        ctx.fillStyle = "#3E2213"; [-W / 2 + 40, W / 2 - 60].forEach(lx => { rr(ctx, lx, -30, 24, 34, 6); ctx.fill(); });
        // backrest
        rr(ctx, -W / 2 + 30, -480, W - 60, 330, 70); ctx.fillStyle = col; ctx.fill(); ol(ctx, 7);
        // eyes on backrest
        const lid = lerp(.55, .25, awake) * (1 - danger) + sulk * .3, ex = 0, ey = -360;
        if (danger > .1){ glowAt(ctx, ex - 70, ey, 90, "#FF3B2F", .5 * danger); glowAt(ctx, ex + 70, ey, 90, "#FF3B2F", .5 * danger); }
        const lookX = hero ? clamp(((sts[O.hero ?? 0] || {}).x - sx) / 400, -1, 1) : -.6;
        eyes(ctx, ex, ey, 40, 140, t, { lid: awake > 0 ? lid : .9, lidCol: dark, lx: lookX, ly: .2, pupil: danger > .5 ? "#7A0F0F" : OUT, white: danger > .5 ? "#FFE0DA" : "#FFFFFF", seed: 5 });
        // brows
        ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; const bt = danger > .3 ? .35 : sulk > .2 ? -.3 : -.1; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(ex + d * 30, ey - 60 + d * bt * -30 * d); ctx.lineTo(ex + d * 110, ey - 70 - bt * 30); ctx.stroke(); });
        // seat cushions with a mouth seam between them
        const lv = sayNow ? TT.voLevel(((typeof TL !== "undefined" && TL.scenes[idx]) ? TL.scenes[idx].start : 0) + t) : 0, mo = sayNow ? 14 + lv * 50 : (danger > .3 ? 30 : 4);
        rr(ctx, -W / 2 + 40, -200, W / 2 - 46, 120, 40); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
        rr(ctx, 6, -200, W / 2 - 46, 120, 40); ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.ellipse(0, -205, 150, mo, 0, 0, Math.PI); ctx.fillStyle = "#3A0F0F"; ctx.fill(); ol(ctx, 5);
        if (danger > .3){ ctx.fillStyle = "#FFFFFF"; for (let k = -3; k <= 3; k++){ ctx.beginPath(); ctx.moveTo(k * 40 - 14, -205); ctx.lineTo(k * 40 + 14, -205); ctx.lineTo(k * 40, -205 + 24); ctx.closePath(); ctx.fill(); } }
        // base
        rr(ctx, -W / 2 + 20, -100, W - 40, 90, 26); ctx.fillStyle = dark; ctx.fill(); ol(ctx, 6);
        // armrests (left one becomes an arm)
        rr(ctx, W / 2 - 90, -300, 100, 290, 46); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
        rr(ctx, -W / 2 - 10, -300, 100, 290, 46); ctx.fill(); ol(ctx, 6);
        // blanket + pillow
        ctx.fillStyle = "#7FA563"; ctx.beginPath(); ctx.moveTo(W / 2 - 260, -200); ctx.quadraticCurveTo(W / 2 - 150, -260, W / 2 - 60, -230); ctx.lineTo(W / 2 - 40, -40); ctx.quadraticCurveTo(W / 2 - 150, -10 + Math.sin(t * 2) * 6, W / 2 - 230, -60); ctx.closePath(); ctx.fill(); ol(ctx, 5);
        ctx.save(); ctx.translate(-W / 2 + 140, -230); ctx.rotate(-.25 + Math.sin(t * 1.4) * .05); rr(ctx, -70, -50, 140, 90, 34); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.restore();
        ctx.restore();
        mouthScr = c.toScreen(sx, sy - 220);
        // zzz
        if (awake < 1) for (let i = 0; i < 3; i++){ const k = (t * .5 + i / 3) % 1; ctx.globalAlpha = 1 - k; textC(ctx, "z", sx + 140 + k * 120, sy - 520 - k * 200, 50 + i * 10, CREAM, 900); ctx.globalAlpha = 1; }
      },
      front: (ctx2, c, sts) => { // stretchy arm reaching for the hero
        if (t < tArm) return; const st = sts[O.hero ?? 0]; if (!st) return; const k = clamp((t - tArm) / .7, 0, 1), back = t >= tFree ? clamp((t - tFree) / .5, 0, 1) : 0, reach = eOut(k) * (1 - back);
        const ax = sx - W / 2 + 40, ay = sy - 260, [tx, ty] = lp(st, 0, -33), hx = lerp(ax, tx + 40, reach), hy2 = lerp(ay, ty, reach) + Math.sin(t * 6) * 10;
        ctx.strokeStyle = OUT; ctx.lineWidth = 64; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo((ax + hx) / 2, Math.min(ay, hy2) - 120 * reach, hx, hy2); ctx.stroke();
        ctx.strokeStyle = mixHex("#B4532A", "#7A1F1F", danger); ctx.lineWidth = 50; ctx.stroke();
        ctx.save(); ctx.translate(hx, hy2); ctx.rotate(Math.sin(t * 7) * .3); rr(ctx, -50, -40, 100, 80, 34); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.restore();
      },
      post: () => { if (danger <= 0) return; ctx.globalAlpha = .28 * danger; const g = ctx.createRadialGradient(540, 960, 300, 540, 960, 1100); g.addColorStop(0, "rgba(120,0,0,0)"); g.addColorStop(1, "rgba(150,10,10,1)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); ctx.globalAlpha = 1;
        if (t - tDanger < 1.6){ const q = eBack(clamp((t - tDanger) / .35, 0, 1)); ctx.save(); ctx.translate(540, 330); ctx.scale(q, q); ctx.rotate(Math.sin(t * 20) * .05); ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(120, 90); ctx.lineTo(-120, 90); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 9); textC(ctx, "!", 0, 70, 130, OUT, 900); ctx.restore(); } },
      over: () => { if (sayNow && mouthScr) bubble(ctx, sayNow.text, mouthScr[0] - 40, mouthScr[1] - 300, t - sayNow.T, { size: 46, maxW: 560, kind: "think", t }); }
    });
  }, (s, f, i, add) => { const O = f.sofa || {}; if (O.wakeCue) add(cueT(s, O.wakeCue, .1, i), "pop"); if (O.armCue) add(cueT(s, O.armCue, .3, i), "whoosh"); if (O.dangerCue) add(cueT(s, O.dangerCue, .5, i), "ping"); if (O.freeCue) add(cueT(s, O.freeCue, .6, i), "whoosh"); (O.says || []).forEach(q => add(tOf(s, q, .3, i), "pop")); });
})();
