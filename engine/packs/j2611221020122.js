/* Scene pack j2611221020122: story scenes for MODE CERITA ("motion": {"mode": "cerita"}). Layout prefix j2611221020122_.
   Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], props[], cards[], stamp, front)
   plus its own set piece:
     _kilat    lightning-fast service: the server dashes with afterimages + speed lines, tooth gleam, box handed over; a crumpled report is tossed backwards onto a colleague (f.zip, f.toss)
     _kertas   a tall wall of boxes turns out to be printed on a sheet of paper: it flutters down, five real boxes remain (f.sheet)
     _mahkota  a golden crown descends on a colleague's head; a chain of crowned customer badges (f.crown, f.chain)
     _pelayan  waiter service: a toon carries a cloche tray; the dome flies off and a neat report rises with ticked rows (f.tray)
     _rayap    a salary beam carried by a toon is gnawed by labelled termites; monthly refill cycles + ageing items (f.beam, f.bugs, f.months, f.items)
     _oven     a business oven bakes cakes that turn into coins: one stream pays the instalment tag, the rest fills a jar (f.oven)
     _bumerang a productive-debt boomerang loops back carrying coins; a lifestyle-debt boomerang flies off and never returns (f.throws)
     _pudar    phone glow at home: feed icons, the father's mind is sucked into the phone and his body fades (f.phone, f.ghost)
     _gambar   a child's crayon drawing is drawn part by part on a big sheet (dad with a phone for a face) (f.paper)
     _parkir   the phone hops onto a wall shelf, drives (wheels, headlights) into a tiny "P" garage, the door rolls down, it sleeps; the room warms, crayons on the floor, laughter (f.rack, f.warm, f.laugh, f.floor)
     _palang   high-jump bar: level/label changes, auto jumps when the hero crosses, day loops montage (f.bar, f.loop)
     _lilin    a motivation candle floats over the hero and melts per day, alarm clock rings, blanket, flame goes out (f.candle, f.alarm, f.blanket, f.sore)
     _bagan    an SOP flowchart poster rolls down from the ceiling; a red marker draws a shortcut arrow past one step (f.chart)
     _sungai   SOP as numbered stones over a river: hops, a jungle-vine swing over the skipped step, cloning boxes, budget sack bursts,
               living suggestion box approves, plank bridge (f.river, f.stones, f.hops, f.carry, f.clone, f.bag, f.sbox, f.bridge)
   Camera keys may use on:"<spot>" for named spots of the set piece. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, G, TAU } = TT;
  const PX = "j2611221020122_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#1F2A44", CYAN = "#7FE3F0", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const c01 = x => clamp(x, 0, 1);
  const eIn = x => x * x * x;
  const eio = q => q < .5 ? 2 * q * q : 1 - 2 * (1 - q) * (1 - q);
  const popK = (k, d) => k <= 0 ? 0 : eBack(c01(k / (d || .4)));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .3, i) : 1e9;
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.stroke(); };
  const ico = (ctx, name, cx, cy, size, col, lw) => icon(ctx, name, cx - size / 2, cy - size / 2, size, col, lw || 2.4);
  function fitFont(ctx, txt, maxW, size, weight, min){ for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 16)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) size = fitFont(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; return size; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function dust(ctx, x, y, k, n, spread, col){ if (k < 0 || k > 1.1) return; n = n || 7; spread = spread || 160; const q = eOut(c01(k / 1.1));
    ctx.save(); ctx.globalAlpha *= (1 - q) * .85; for (let i = 0; i < n; i++){ const d = (i / (n - 1) - .5) * 2, px = x + d * spread * (.4 + q * .9), py = y - 20 - q * (30 + rnd(i) * 50), r = 26 + q * 34 + rnd(i + 4) * 14;
      ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fillStyle = col || "#EADBC4"; ctx.fill(); } ctx.restore(); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = c01(k / .3), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); font(ctx, 900, size, FAM); let w = ctx.measureText(txt).width + size * .9; if (w > 860){ size = size * 860 / w; font(ctx, 900, size, FAM); w = ctx.measureText(txt).width + size * .9; }
    const h = size * 1.45; x = clamp(x, 90 + w / 2, 990 - w / 2); ctx.translate(x, y); ctx.rotate(rot ?? -.1); ctx.scale(sc, sc); ctx.globalAlpha *= c01(q * 2);
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function pill(ctx, txt, x, y, size, bg, fg, k, screen){ if (k <= 0) return; const s = popK(k, .35); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    if (screen) x = clamp(x, 90 + w / 2, 990 - w / 2);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function coin(ctx, x, y, r, spin){ const sx = Math.max(.15, Math.abs(Math.cos(spin || 0)));
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(3, r * .14); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * .68, 0, TAU); ctx.strokeStyle = "#C9962A"; ctx.lineWidth = r * .1; ctx.stroke();
    if (sx > .5){ font(ctx, 900, r * .8, FAM); ctx.fillStyle = "#8A5A12"; ctx.textAlign = "center"; ctx.fillText("Rp", 0, r * .28); ctx.textAlign = "left"; } ctx.restore(); }
  function checkMark(ctx, x, y, r, k, col){ if (k <= 0) return; const s = popK(k, .3); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = col || GREEN; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * .24; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-r * .45, 0); ctx.lineTo(-r * .1, r * .35); ctx.lineTo(r * .5, -r * .38); ctx.stroke(); ctx.restore(); }
  function box3(ctx, x, y, w, h, col, label){ // cardboard box, bottom-centre (x, y)
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(0, 2, w * .55, 10, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = col || "#D9A066"; rr(ctx, -w / 2, -h, w, h, 6); ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = "rgba(255,244,230,.55)"; ctx.fillRect(-w * .08, -h, w * .16, h * .42); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 2, -h * .58); ctx.lineTo(w / 2, -h * .58); ctx.stroke();
    if (label){ textC(ctx, label, 0, -h * .22, Math.min(30, h * .26), BROWN, 900, w * .85); } ctx.restore(); }
  // toon-local point (units of size/92, y up from the feet) -> world
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const headOf = st => { const h = toonHead(st); return [h[0], h[1] + (st.pose === "sit" ? 13 * st.size / 92 : 0), st.size * 20.5 / 92]; };

  /* ---------- auto keys: hops/jumps computed from the toon path ---------- */
  const PATHC = new Map();
  function crossTimes(a, s, x0, idx){
    const key = idx + "|" + x0 + "|" + JSON.stringify(a.keys || []).length + "|" + (a.x || 0);
    if (PATHC.has(key)) return PATHC.get(key);
    const out = []; let prev = toonState(a, s, 0).x;
    for (let t = .02; t < 32; t += .02){ const x = toonState(a, s, t).x; if (Math.abs(x - prev) < 120 && (prev - x0) * (x - x0) < 0) out.push(t); prev = x; }
    PATHC.set(key, out); return out;
  }

  /* ---------- shared base: same data as the generic "cerita" layout + hooks ---------- */
  // H: {env, envOpt, spots, prep(a, j) -> {a, t}, alpha(j) -> 0..1, back/mid/front(ctx, c, sts, R), under/over1(ctx, c, sts, j, R), post (screen, before grade), over (screen, after grade)}
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const P = toons.map((a, j) => { const r = H.prep ? H.prep(a, j) : null; return r || { a, t }; });
    const sts = P.map(p => toonState(p.a, s, p.t));
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = toonState(P[j].a, s, tt), hp = headOf(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, H.cam || f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const R = {};
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(c01(q / .35)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      const al = H.alpha ? H.alpha(j) : 1; ctx.save(); ctx.globalAlpha *= al; R[j] = toon(ctx, c, P[j].a, s, P[j].t, { st: sts[j] }); ctx.restore();
      if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.post){ ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
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
  const reg = (name, label, draw, sfx) => TT.scene(PX + name, label, draw, (s, f, i, add) => { sfxBase(s, f, i, add); if (sfx) sfx(s, f || {}, i, add); });

  /* ================= _kilat: lightning-fast service for the buyer, report tossed to a colleague ================= */
  // f.zip {on, box:{cue, giveCue, to}, gleam:{cue}}, f.toss {cue|at, from, to, dur, pages:[txt]}
  reg("kilat", "Cerita: layanan kilat untuk pembeli, laporan dilempar ke rekan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, zp = f.zip || {}, zj = zp.on ?? 0, tw = f.toss || {}, tT = tOf(s, tw, .5, idx), D = tw.dur || .8;
    const bx = zp.box || {}, tBox = T(s, bx.cue, .3, idx), tGive = T(s, bx.giveCue, .3, idx);
    base(ctx, s, t, { env: "street",
      under: (ctx2, c, sts, j) => { if (j !== zj) return; const a = (f.toons || [])[j], st = sts[j]; if (!st.moving) return;
        const ga = Object.assign({}, a, { keys: (a.keys || []).map(k => { const o = Object.assign({}, k); delete o.say; delete o.emote; return o; }) });
        for (let g = 3; g >= 1; g--){ const tg = t - g * .055, sg = toonState(ga, s, tg); ctx.save(); ctx.globalAlpha *= .3 * (1 - g / 4); TT.drawToon(ctx, ga, sg, tg); ctx.restore(); }
        const d = Math.sign(st.vx) || 1, k = st.size / 92; ctx.save(); ctx.strokeStyle = hexA(CREAM, .85); ctx.lineCap = "round"; for (let i = 0; i < 6; i++){ const y = st.y - (12 + i * 12) * k, L = 120 + (i % 3) * 70; ctx.lineWidth = 8 - (i % 2) * 3; ctx.beginPath(); ctx.moveTo(st.x - d * (30 * k), y); ctx.lineTo(st.x - d * (30 * k + L), y); ctx.stroke(); } ctx.restore();
        if (Math.abs(st.vx) > 900) dust(ctx, st.x - d * 60, GROUND, (t * 3) % 1, 5, 80); },
      front: (ctx2, c, sts, R) => {
        const gl = zp.gleam; if (gl){ const k = t - T(s, gl.cue, .3, idx), r0 = R[zj]; if (k > 0 && k < 1.3 && r0){ const sz = 46 * Math.sin(c01(k / 1.3) * Math.PI), fc = sts[zj].face || 1; sparkle(ctx, r0.headX + 46 * fc, r0.mouthY - 6, sz, "#FFFFFF"); sparkle(ctx, r0.headX + 80 * fc, r0.mouthY - 60, sz * .55, GOLD); glowAt(ctx, r0.headX + 46 * fc, r0.mouthY, 120 * sz / 46, "#FFFFFF", .5); } }
        // the box: in the server's hands after the dash, then handed to the buyer
        if (t > tBox){ const A = sts[zj], B = sts[bx.to ?? 1]; const pa = lp(A, 25, -46), pb = B ? lp(B, 25, -46) : pa, q = c01((t - tGive) / .35), p = t < tGive ? pa : [lerp(pa[0], pb[0], eOut(q)), lerp(pa[1], pb[1], q) - Math.sin(q * Math.PI) * 80];
          box3(ctx, p[0], p[1] + 60, 150, 120, "#D9A066", bx.label || "PESANAN"); if (t > tGive + .35 && t < tGive + 1.3) burstFx(ctx, pb[0], pb[1] - 40, t - tGive - .35, GOLD, 10, 150);
          if (t > tGive + .35){ for (let i = 0; i < 3; i++){ const qq = ((t - tGive) * .7 + i / 3) % 1, hb = headOf(B); ctx.save(); ctx.globalAlpha = Math.sin(qq * Math.PI); ctx.translate(hb[0] + (i - 1) * 70, hb[1] - hb[2] * 1.3 - qq * 120); ctx.fillStyle = "#FF8A7A"; ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-26, -8, -14, -28, 0, -14); ctx.bezierCurveTo(14, -28, 26, -8, 0, 12); ctx.fill(); ol(ctx, 3); ctx.restore(); } } }
        if (t < tT) return;
        const A = sts[tw.from ?? 0], B = sts[tw.to ?? 2]; if (!A || !B) return;
        const p0 = lp(A, -16, -64), hb = headOf(B), p1 = [hb[0], hb[1] - hb[2] * .2], q = (t - tT) / D;
        const ball = (x, y, rot, sc) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.beginPath(); for (let i = 0; i < 11; i++){ const a = i / 11 * TAU, r = 44 * (.78 + rnd(i + 2) * .3); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath();
          ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#B9A68C"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-26, -8); ctx.lineTo(4, 6); ctx.lineTo(22, -14); ctx.moveTo(-10, 20); ctx.lineTo(14, 12); ctx.stroke(); ctx.restore(); };
        if (q < 1){ const x = lerp(p0[0], p1[0], q), y = lerp(p0[1], p1[1], q) - Math.sin(q * Math.PI) * 420;
          for (let i = 1; i < 5; i++){ const qq = Math.max(0, q - i * .05); ctx.globalAlpha = .25 * (1 - i / 5); ctx.beginPath(); ctx.arc(lerp(p0[0], p1[0], qq), lerp(p0[1], p1[1], qq) - Math.sin(qq * Math.PI) * 420, 30, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); }
          ctx.globalAlpha = 1; ball(x, y, t * 12, 1); }
        else { const k = t - tT - D, bxx = p1[0] - 260 * k * Math.sign(p0[0] - p1[0] || 1) * -1, by = Math.min(GROUND - 40, p1[1] - 420 * k + 1600 * k * k);
          ball(bxx, by, t * 6, 1);
          if (k < 2.2){ for (let i = 0; i < 4; i++){ const a = t * 5 + i * TAU / 4; sparkle(ctx, hb[0] + Math.cos(a) * hb[2] * 1.1, hb[1] - hb[2] * 1.05 + Math.sin(a) * hb[2] * .25, 22, i % 2 ? GOLD : "#FFFFFF"); } }
          burstFx(ctx, p1[0], p1[1], k, HL, 10, 150);
          (tw.pages || ["TELAT", "SALAH?", "???"]).forEach((txt, i) => { const kk = k - i * .08; if (kk < 0) return; const px = p1[0] + (i - 1) * 170 + Math.sin(kk * 3 + i) * 70, py = Math.min(GROUND - 30, p1[1] - 80 + kk * 200);
            ctx.save(); ctx.translate(px, py); ctx.rotate(py >= GROUND - 31 ? (i - 1) * .3 : Math.sin(kk * 4 + i) * .6); ctx.fillStyle = PAPER; rr(ctx, -60, -76, 120, 152, 6); ctx.fill(); ol(ctx, 4);
            ctx.strokeStyle = "#C9B79E"; ctx.lineWidth = 5; for (let l = 0; l < 4; l++){ ctx.beginPath(); ctx.moveTo(-42, -40 + l * 26); ctx.lineTo(30 - (l % 2) * 26, -40 + l * 26); ctx.stroke(); }
            textC(ctx, txt, 0, 8, 30, RED, 900, 108); ctx.restore(); }); }
      } });
  }, (s, f, i, add) => { const zp = f.zip || {}, tw = f.toss || {}, tT = tOf(s, tw, .5, i);
    if (zp.gleam) add(T(s, zp.gleam.cue, .3, i), "chime"); if (zp.box){ add(T(s, zp.box.cue, .3, i), "whoosh"); add(T(s, zp.box.giveCue, .3, i) + .35, "chime"); }
    if (tT < 1e8){ add(tT, "whoosh"); add(tT + (tw.dur || .8), "pop"); add(tT + (tw.dur || .8) + .05, "ping"); } });

  /* ================= _kertas: wall of boxes printed on a sheet of paper ================= */
  // f.sheet {x, w, h, cue|at (boxes appear), fallCue, label:"50 KARDUS", real:5, realLabel:"STOK: 5", back:"LAPORAN STOK"}
  reg("kertas", "Cerita: stok kardus ternyata cuma di atas kertas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, sh = f.sheet || {}, X = sh.x ?? 560, W = sh.w ?? 440, Hh = sh.h ?? 560;
    const tA = tOf(s, sh, .1, idx), tF = T(s, sh.fallCue, .6, idx), real = sh.real ?? 5;
    base(ctx, s, t, { env: "office", spots: { sheet: [X, GROUND - Hh * .55, 1.05], real: [X + 60, GROUND - 260, 1.25] },
      back: () => {
        if (t < tA) return;
        // real boxes behind the sheet
        const RB = [[-120, 0], [0, 0], [120, 0], [-60, -118], [60, -118], [0, -236]].slice(0, real);
        RB.forEach(([dx, dy], j) => box3(ctx, X + dx, GROUND + dy, 116, 118, "#D9A066"));
        const kR = t - tF - 1.7; if (kR > 0){ glowAt(ctx, X, GROUND - 160, 260, GOLD, .25 * (1 + Math.sin(t * 5)) / 2); }
        // the sheet
        const k = t - tF; let ang = 0, cx = X, cy = GROUND - Hh / 2, rot = 0, bend = 0;
        if (k > 0){ if (k < .5){ rot = Math.sin(k * 30) * .03 * (1 - k * 2); bend = Math.sin(k / .5 * Math.PI) * 30; }
          else { const q = c01((k - .5) / 1.3); ang = q * Math.PI * 1.46; cx = X + 200 * Math.sin(q * Math.PI * .9) + 60 * q; cy = lerp(GROUND - Hh / 2, GROUND - 12, eIn(q) * .6 + q * .4); rot = Math.sin(q * Math.PI * 2.4) * .35 * (1 - q); } }
        const sy = Math.cos(ang), n = Math.min(20, Math.floor(c01((t - tA) / 1.3) * 20 + (t > tA ? 1 : 0)));
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(1, sy === 0 ? .01 : (Math.abs(sy) < .06 ? .06 * Math.sign(sy || 1) : sy));
        ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.fillRect(-W / 2 + 14, -Hh / 2 + 14, W, Hh);
        ctx.beginPath(); ctx.moveTo(-W / 2, -Hh / 2); ctx.quadraticCurveTo(0, -Hh / 2 - bend, W / 2, -Hh / 2); ctx.lineTo(W / 2, Hh / 2); ctx.lineTo(-W / 2, Hh / 2); ctx.closePath();
        ctx.fillStyle = sy >= 0 ? PAPER : "#F3E6D2"; ctx.fill(); ol(ctx, 6);
        if (sy >= 0){
          const cols = 4, rows = 5, bw = (W - 50) / cols, bh = (Hh - 140) / rows;
          for (let i = 0; i < n; i++){ const r = Math.floor(i / cols), cI = i % cols, kk = t - tA - i * .065, sc = popK(kk, .25);
            if (sc <= 0) continue; ctx.save(); ctx.translate(-W / 2 + 25 + bw * (cI + .5), Hh / 2 - 15 - bh * r); ctx.scale(sc, sc); box3(ctx, 0, 0, bw - 10, bh - 8, "#E3B07A"); ctx.restore(); }
          if (t > tA + .9){ const kk = t - tA - .9; ctx.save(); ctx.translate(0, -Hh / 2 + 56); ctx.scale(popK(kk, .3), popK(kk, .3)); rr(ctx, -W / 2 + 30, -40, W - 60, 80, 14); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5);
            textC(ctx, (sh.label || "50 KARDUS") + " ✓", 0, 16, 44, "#FFFFFF", 900, W - 90); ctx.restore(); }
          ctx.fillStyle = "rgba(43,26,18,.12)"; ctx.beginPath(); ctx.moveTo(W / 2 - 50, Hh / 2); ctx.lineTo(W / 2, Hh / 2 - 50); ctx.lineTo(W / 2, Hh / 2); ctx.closePath(); ctx.fill();
        } else {
          ctx.scale(1, -1); textC(ctx, sh.back || "LAPORAN STOK", 0, -Hh / 2 + 80, 40, BROWN, 900, W - 60);
          ctx.strokeStyle = "#C9B79E"; ctx.lineWidth = 8; for (let l = 0; l < 6; l++){ ctx.beginPath(); ctx.moveTo(-W / 2 + 50, -Hh / 2 + 150 + l * 55); ctx.lineTo(W / 2 - 60 - (l % 3) * 40, -Hh / 2 + 150 + l * 55); ctx.stroke(); }
          textC(ctx, "50?", 60, 120, 80, RED, 900);
        }
        ctx.restore();
        if (k > 1.75) dust(ctx, X + 200, GROUND, k - 1.75, 9, 300);
        if (kR > 0) pill(ctx, sh.realLabel || ("STOK: " + real), X, GROUND - 420, 46, RED, "#FFFFFF", kR);
      } });
  }, (s, f, i, add) => { const sh = f.sheet || {}, tA = tOf(s, sh, .1, i), tF = T(s, sh.fallCue, .6, i);
    if (tA < 1e8){ for (let k = 0; k < 20; k += 4) add(tA + k * .065, "pop"); add(tA + .9, "chime"); }
    if (tF < 1e8){ add(tF + .5, "whoosh"); add(tF + 1.75, "pop"); add(tF + 1.7, "ping"); } });

  /* ================= _mahkota: crown + chain of customers ================= */
  // f.crown {on, cue|at}, f.chain {cue|at, y, items:[{icon, label, crownCue}]}
  function crown(ctx, x, y, w, t){ ctx.save(); ctx.translate(x, y); const h = w * .62;
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h * .7); ctx.lineTo(-w * .25, -h * .35); ctx.lineTo(0, -h); ctx.lineTo(w * .25, -h * .35); ctx.lineTo(w / 2, -h * .7); ctx.lineTo(w / 2, 0); ctx.closePath();
    ctx.fillStyle = GOLD; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(3, w * .045); ctx.stroke();
    ctx.fillStyle = "#E0A82E"; ctx.fillRect(-w / 2, -h * .2, w, h * .2); ctx.strokeRect(-w / 2, -h * .2, w, h * .2);
    [[-w / 2, -h * .7], [0, -h], [w / 2, -h * .7]].forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px, py, w * .07, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.stroke(); });
    [[-w * .28, RED], [0, "#2F6F73"], [w * .28, RED]].forEach(([px, col]) => { ctx.beginPath(); ctx.arc(px, -h * .1, w * .055, 0, TAU); ctx.fillStyle = col; ctx.fill(); });
    sparkle(ctx, w * .3 * Math.sin(t * 2), -h * .55, w * .08 * (1 + Math.sin(t * 6)) / 2, "#FFFFFF"); ctx.restore(); }
  reg("mahkota", "Cerita: mahkota untuk rekan (pelanggan internal)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, cr = f.crown || {}, tK = tOf(s, cr, .3, idx), ch = f.chain, tCh = ch ? tOf(s, ch, .4, idx) : 1e9;
    base(ctx, s, t, { env: "info",
      back: (ctx2, c, sts) => { const st = sts[cr.on ?? 1]; if (!st || t < tK - .2) return; const hb = headOf(st), k = t - tK;
        ctx.save(); ctx.globalAlpha = .35 * c01(k / .4) * (.8 + .2 * Math.sin(t * 3)); const g = ctx.createLinearGradient(0, hb[1] - 1400, 0, hb[1] + 300); g.addColorStop(0, hexA(GOLD, .9)); g.addColorStop(1, hexA(GOLD, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hb[0] - 120, hb[1] - 1400); ctx.lineTo(hb[0] + 120, hb[1] - 1400); ctx.lineTo(hb[0] + 330, GROUND); ctx.lineTo(hb[0] - 330, GROUND); ctx.closePath(); ctx.fill(); ctx.restore(); },
      front: (ctx2, c, sts) => { const st = sts[cr.on ?? 1]; if (!st || t < tK) return; const hb = headOf(st), k = t - tK, q = c01(k / .8), yT = hb[1] - hb[2] * .88;
        const y = q < 1 ? lerp(yT - 700, yT, eOut(q)) - Math.sin(q * Math.PI) * 30 : yT, sq = q >= 1 ? 1 + .12 * Math.exp(-(k - .8) * 6) * Math.sin((k - .8) * 20) : 1;
        ctx.save(); ctx.translate(hb[0], y); ctx.rotate(Math.sin(t * 2) * .04 + (1 - q) * .5); ctx.scale(1 / sq, sq); crown(ctx, 0, 0, hb[2] * 1.15, t); ctx.restore();
        if (k > .8) burstFx(ctx, hb[0], yT - 40, k - .8, GOLD, 12, 180);
        for (let i = 0; i < 6; i++){ const a = t * 1.5 + i; sparkle(ctx, hb[0] + Math.cos(a) * hb[2] * 1.6, yT - 60 + Math.sin(a * 1.3) * 90, 10 + 6 * Math.sin(t * 5 + i), i % 2 ? GOLD : "#FFFFFF"); } },
      over: () => { if (!ch || t < tCh) return; const items = ch.items || [], n = items.length, y = ch.y ?? 330, gap = 860 / n;
        items.forEach((it, j) => { const k = t - tCh - j * .45, x = 540 + (j - (n - 1) / 2) * gap; if (k <= 0) return; const sc = popK(k, .4);
          if (j > 0 && k > 0){ const xa = x - gap + 95, xb = x - 95, q = c01(k / .4); ctx.save(); ctx.strokeStyle = CREAM; ctx.lineWidth = 10; ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 60; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(lerp(xa, xb, q), y); ctx.stroke(); ctx.setLineDash([]);
            if (q >= 1){ ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(xb + 6, y); ctx.lineTo(xb - 22, y - 18); ctx.lineTo(xb - 22, y + 18); ctx.closePath(); ctx.fill(); } ctx.restore(); }
          ctx.save(); ctx.translate(x, y + Math.sin(t * 2 + j) * 5); ctx.scale(sc, sc); ctx.beginPath(); ctx.arc(0, 0, 82, 0, TAU); ctx.fillStyle = j === 0 ? CREAM : (j === 1 ? ORANGE : "#2F6F73"); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
          ico(ctx, it.icon || "user", 0, 0, 84, j === 0 ? BROWN : "#FFFFFF", 2.6);
          const kc = it.crownCue ? t - T(s, it.crownCue, .5, idx) : -1; if (kc > 0){ const qq = popK(kc, .4); ctx.save(); ctx.translate(0, -78 - (1 - c01(kc / .3)) * 60); ctx.scale(qq, qq); crown(ctx, 0, 0, 92, t); ctx.restore(); }
          ctx.restore();
          pill(ctx, it.label, x, y + 125, 30, CREAM, BROWN, k - .1, true); });
      } });
  }, (s, f, i, add) => { const cr = f.crown || {}, tK = tOf(s, cr, .3, i); if (tK < 1e8){ add(tK, "whoosh"); add(tK + .8, "chime"); }
    const ch = f.chain; if (ch){ const t0 = tOf(s, ch, .4, i); (ch.items || []).forEach((it, j) => { add(t0 + j * .45, "pop"); if (it.crownCue) add(T(s, it.crownCue, .5, i), "chime"); }); } });

  /* ================= _pelayan: cloche tray service ================= */
  // f.tray {on, openCue, title, rows:[{cue, label, icon}], doneCue}
  reg("pelayan", "Cerita: melayani rekan seperti tamu restoran (tudung saji)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, tr = f.tray || {}, tO = T(s, tr.openCue, .4, idx), rows = tr.rows || [];
    let trayScr = [540, 900];
    base(ctx, s, t, { env: "office",
      over1: (ctx2, c, sts, j) => { if (j !== (tr.on ?? 0)) return; const st = sts[j], k = st.size / 92, f1 = st.face || 1;
        // bow tie + napkin
        const nk = lp(st, 0, -55); ctx.save(); ctx.translate(nk[0], nk[1]); ctx.fillStyle = OUT; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-3.6 * k, -2.4 * k); ctx.lineTo(-3.6 * k, 2.4 * k); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(3.6 * k, -2.4 * k); ctx.lineTo(3.6 * k, 2.4 * k); ctx.closePath(); ctx.fill(); ctx.restore();
        const hp = lp(st, 25, -48), tx = hp[0] + 8 * k * f1, ty = hp[1] - 1.5 * k;
        trayScr = c.toScreen(tx, ty - 10 * k);
        ctx.save(); ctx.translate(tx, ty); ctx.fillStyle = "#C9CED6"; ctx.beginPath(); ctx.ellipse(0, 0, 15 * k, 2.8 * k, 0, 0, TAU); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#EEF1F5"; ctx.beginPath(); ctx.ellipse(0, -1, 12 * k, 1.8 * k, 0, 0, TAU); ctx.fill();
        const kk = t - tO; let dx = 0, dy = 0, rot = 0, al = 1;
        if (kk > 0){ dy = -kk * 900 + 300 * kk * kk; dx = kk * 420 * f1; rot = kk * 4; al = c01(1 - (kk - .6) / .4); }
        if (al > 0){ ctx.save(); ctx.globalAlpha *= al; ctx.translate(dx, -1.4 * k + dy); ctx.rotate(rot); ctx.beginPath(); ctx.arc(0, 0, 11 * k, Math.PI, 0); ctx.closePath(); ctx.fillStyle = "#D9DEE6"; ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = "#FFFFFF"; ctx.globalAlpha *= .6; ctx.beginPath(); ctx.ellipse(-5 * k, -6 * k, 2.2 * k, 3.6 * k, -.6, 0, TAU); ctx.fill(); ctx.globalAlpha /= .6; ctx.beginPath(); ctx.arc(0, -11.6 * k, 1.8 * k, 0, TAU); ctx.fillStyle = "#C9CED6"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
        if (kk < 0){ for (let i = 0; i < 3; i++){ const q = ((t * .7 + i / 3) % 1); ctx.save(); ctx.globalAlpha = .45 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-5 * k + i * 5 * k, -13 * k - q * 90); ctx.quadraticCurveTo(-8 * k + i * 5 * k, -16 * k - q * 90, -5 * k + i * 5 * k, -20 * k - q * 90); ctx.stroke(); ctx.restore(); } }
        else { glowAt(ctx, 0, -6 * k, 26 * k * c01(kk / .3), GOLD, .5); }
        ctx.restore(); },
      over: () => { const kk = t - tO; if (kk < 0) return; burstFx(ctx, trayScr[0], trayScr[1] - 40, kk, GOLD, 12, 160);
        const q = eOut(c01((kk - .15) / .6)); if (q <= 0) return; const W = 700, Hh = 140 + rows.length * 104, cx = lerp(trayScr[0], 540, q), cy = lerp(trayScr[1], 250 + Hh / 2, q), sc = lerp(.15, 1, q);
        ctx.save(); ctx.translate(cx, cy); ctx.rotate((1 - q) * .3 + Math.sin(t * 1.6) * .008); ctx.scale(sc, sc);
        ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -W / 2 + 14, -Hh / 2 + 16, W, Hh, 20); ctx.fill(); rr(ctx, -W / 2, -Hh / 2, W, Hh, 20); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
        rr(ctx, -W / 2, -Hh / 2, W, 100, 20); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7); textC(ctx, tr.title || "LAPORAN STOK", 0, -Hh / 2 + 66, 46, "#FFFFFF", 900, W - 80);
        rows.forEach((r, j) => { const y = -Hh / 2 + 160 + j * 104, kr = t - T(s, r.cue, .3, idx);
          ctx.globalAlpha = .35 + .65 * c01(kr / .2); ctx.beginPath(); ctx.arc(-W / 2 + 70, y, 36, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); ico(ctx, r.icon || "check", -W / 2 + 70, y, 44, BROWN, 2.6);
          font(ctx, 800, 40, FAM); ctx.fillStyle = BROWN; const lab = r.label; fitFont(ctx, lab, W - 280, 40, 800); ctx.fillText(lab, -W / 2 + 130, y + 14); ctx.globalAlpha = 1;
          checkMark(ctx, W / 2 - 70, y, 36, kr); if (r.double) checkMark(ctx, W / 2 - 120, y, 36, kr - .25);
          if (j < rows.length - 1){ ctx.strokeStyle = "#EADBC4"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-W / 2 + 30, y + 52); ctx.lineTo(W / 2 - 30, y + 52); ctx.stroke(); } });
        ctx.restore(); } });
  }, (s, f, i, add) => { const tr = f.tray || {}; const tO = T(s, tr.openCue, .4, i); if (tO < 1e8){ add(tO, "whoosh"); add(tO + .1, "chime"); } (tr.rows || []).forEach(r => add(T(s, r.cue, .3, i), "pop")); });

  /* ================= _rayap: termites gnaw the salary beam ================= */
  // f.beam {on, label, len, keep, months:[{cue|at, label}] (refill), countCue, countTo}, f.bugs [{cue|at, label, color}], f.items [{kind: phone|shoe|photo, cue, tag}], f.itemsAt
  function termite(ctx, x, y, s, t, col, munch, walk){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const b = Math.sin(t * (walk ? 18 : 10)) * (walk ? 3 : 1.5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineCap = "round";
    for (let i = 0; i < 3; i++){ const lx = -30 + i * 26, sw = Math.sin(t * 18 + i * 2) * (walk ? 8 : 2); ctx.beginPath(); ctx.moveTo(lx, 6); ctx.lineTo(lx - 10 + sw, 30); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(-30, b * .3, 34, 26, 0, 0, TAU); ctx.fillStyle = col || "#E9C79A"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(-4, b * .3, 20, 18, 0, 0, TAU); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "rgba(43,26,18,.35)"; ctx.lineWidth = 3; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-50 + i * 14, -18 + b * .3); ctx.lineTo(-50 + i * 14, 18 + b * .3); ctx.stroke(); }
    const hy = -6 + b; ctx.beginPath(); ctx.arc(26, hy, 24, 0, TAU); ctx.fillStyle = "#B8834F"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(30, hy - 22); ctx.quadraticCurveTo(40, hy - 50, 56, hy - 54 + Math.sin(t * 7) * 4); ctx.moveTo(20, hy - 22); ctx.quadraticCurveTo(22, hy - 52, 36, hy - 62 + Math.cos(t * 6) * 4); ctx.stroke();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(32, hy - 6, 8, 0, TAU); ctx.fill(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(34, hy - 5, 4, 0, TAU); ctx.fill();
    const m = munch ? Math.abs(Math.sin(t * 16)) * .5 : .15; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(44, hy + 8); ctx.lineTo(60, hy + 2 - m * 16); ctx.moveTo(44, hy + 12); ctx.lineTo(60, hy + 18 + m * 16); ctx.stroke();
    ctx.restore(); }
  function itemBadge(ctx, kind, x, y, r, age, t, tag){ ctx.save(); ctx.translate(x, y + Math.sin(t * 2 + x) * 4);
    const sh = age > 0 && age < .5 ? Math.sin(age * 60) * 8 * (1 - age * 2) : 0; ctx.translate(sh, 0);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = age > 0 ? "#E6DCCB" : CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
    const a = c01(age / .5);
    if (kind === "phone"){ rr(ctx, -34, -58, 68, 116, 12); ctx.fillStyle = "#1E1A18"; ctx.fill(); rr(ctx, -27, -48, 54, 92, 6); ctx.fillStyle = a > 0 ? "#8FA7AD" : "#BFE2EA"; ctx.fill();
      if (a > 0){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-20, -40); ctx.lineTo(-2, -10 * a); ctx.lineTo(-14, 10 * a); ctx.lineTo(8, 36 * a); ctx.moveTo(-2, -10 * a); ctx.lineTo(18, -26 * a); ctx.stroke(); } }
    else if (kind === "shoe"){ ctx.fillStyle = a > 0 ? "#B9A68C" : ORANGE; ctx.beginPath(); ctx.moveTo(-58, 26); ctx.lineTo(-58, -26); ctx.quadraticCurveTo(-30, -36, -14, -20); ctx.quadraticCurveTo(20, -8, 56, 6); ctx.quadraticCurveTo(64, 26, 50, 30); ctx.closePath(); ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-58, 18, 112, 10); if (a > 0){ ctx.beginPath(); ctx.arc(20, 6, 10 * a, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); dust(ctx, 0, 40, (age % 1.2), 4, 60, "#CDBFA8"); } }
    else { ctx.save(); ctx.rotate(-.08); rr(ctx, -56, -44, 112, 88, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#7FC4E0"; ctx.fillRect(-46, -34, 92, 44); ctx.fillStyle = "#E8C98A"; ctx.fillRect(-46, 10, 92, 24);
      ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(26, -20, 10, 0, TAU); ctx.fill(); ctx.fillStyle = "#3E9B5A"; ctx.fillRect(-30, -14, 6, 26); ctx.beginPath(); ctx.ellipse(-27, -16, 18, 7, 0, 0, TAU); ctx.fill();
      if (a > 0){ ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = hexA("#808080", a); ctx.fillRect(-56, -44, 112, 88); ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = hexA("#C9A46A", .35 * a); ctx.fillRect(-56, -44, 112, 88); } ctx.restore(); }
    ctx.restore(); if (tag && age > 0) pill(ctx, tag, x, y + r + 34, 30, RED, "#FFFFFF", age - .15); }
  reg("rayap", "Cerita: cicilan seperti rayap menggerogoti gaji", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, bm = f.beam || {}, bugs = (f.bugs || []).map((b, j) => Object.assign({ T: tOf(s, b, .2 + j * .15, idx), j }, b));
    const L0 = bm.len ?? 640, keep = bm.keep ?? .5, months = (bm.months || []).map((m, j) => Object.assign({ T: tOf(s, m, .1, idx) }, m)).sort((a, b) => a.T - b.T);
    // length: chewed by each active bug; refilled at month marks
    let lastRefill = -1e9; months.forEach(m => { if (t >= m.T) lastRefill = m.T; });
    const per = (1 - keep) * L0 / Math.max(1, bugs.length);
    let L = L0; bugs.forEach(b => { const t0 = Math.max(b.T + .7, lastRefill + .5); if (t > t0) L -= per * eOut(c01((t - t0) / (lastRefill > -1e8 ? 1.2 : 1.8))); });
    const refK = t - lastRefill;
    base(ctx, s, t, { env: "office", envOpt: { desk: false }, spots: { beam: () => [540, 1150, 1.1] },
      over1: (ctx2, c, sts, j, R) => { if (j !== (bm.on ?? 0)) return; const st = sts[j], f1 = st.face || 1, hp = lp(st, 16, -47), H = 140;
        const x0 = hp[0] - 70 * f1, xe = hp[0] + L * f1, y = hp[1] - 6 + Math.sin(t * 3) * 3, gr = refK >= 0 && refK < .5 ? eBack(c01(refK / .5)) : 1;
        const xEnd = x0 + (xe - x0) * gr;
        ctx.save(); ctx.fillStyle = "#B5764A"; ctx.beginPath(); ctx.moveTo(x0, y - H / 2);
        const teeth = 7; ctx.lineTo(xEnd - 16 * f1, y - H / 2); for (let i = 0; i <= teeth; i++){ const yy = y - H / 2 + H * i / teeth; ctx.lineTo(xEnd - (i % 2 ? 0 : 22) * f1, yy); } ctx.lineTo(x0, y + H / 2); ctx.closePath(); ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 4; for (let l = 0; l < 3; l++){ ctx.beginPath(); ctx.moveTo(x0 + 20 * f1, y - 30 + l * 30); ctx.lineTo(xEnd - 40 * f1, y - 30 + l * 30 + (l - 1) * 4); ctx.stroke(); }
        ctx.beginPath(); ctx.ellipse(x0, y, 20, H / 2, 0, 0, TAU); ctx.fillStyle = "#E3B98A"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#B5764A"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x0, y, 10, H / 4, 0, 0, TAU); ctx.stroke();
        const mid = (x0 + xEnd) / 2, lab = bm.label || "GAJI"; ctx.save(); ctx.beginPath(); ctx.rect(Math.min(x0, xEnd), y - H / 2, Math.abs(xEnd - x0), H); ctx.clip(); textC(ctx, lab, mid, y + 30, 88, CREAM, 900); ctx.restore();
        ctx.restore();
        // wood chips
        bugs.forEach(b => { const kk = t - b.T - .7; if (kk < 0 || L <= L0 * keep + 2 && t - Math.max(b.T + .7, lastRefill + .5) > 2.2) return;
          for (let i = 0; i < 4; i++){ const ph = ((t * 1.8 + i / 4 + b.j * .3) % 1); ctx.save(); ctx.globalAlpha = 1 - ph; ctx.fillStyle = i % 2 ? "#E3B98A" : "#B5764A"; ctx.translate(xEnd + (30 + ph * 120) * f1 * (i % 2 ? 1 : .6), y - 30 + b.j * 30 - 120 * ph + 260 * ph * ph); ctx.rotate(ph * 8); ctx.fillRect(-8, -5, 16, 10); ctx.restore(); } });
        // bugs
        const slots = [[-40, -H / 2 - 34, 1.45], [40, -6, 1.35], [-190, -H / 2 - 30, 1.3], [-90, H / 2 + 10, 1.2]];
        bugs.forEach(b => { const kk = t - b.T; if (kk < 0) return; const sl = slots[b.j % slots.length], tx = xEnd + sl[0] * f1, ty = y + sl[1], q = c01(kk / .7);
          const x = lerp(tx + 700 * f1, tx, eOut(q)), yy = ty - Math.abs(Math.sin(q * Math.PI * 3)) * 30 * (1 - q);
          ctx.save(); ctx.translate(x, yy); ctx.scale(-f1, 1); termite(ctx, 0, 0, sl[2], t + b.j, b.color, q >= 1, q < 1); ctx.restore();
          if (b.label){ const tagY = ty - 170 - (b.j % 2) * 70; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, yy - 20); ctx.lineTo(x, tagY + 20); ctx.stroke(); pill(ctx, b.label, x, tagY, 38, b.color || CREAM, BROWN, kk - .1); } });
      },
      over: () => {
        if (months.length){ const cur = months.filter(m => t >= m.T).pop(); if (cur){ const k = t - cur.T; pill(ctx, cur.label, 860, 250, 40, ORANGE, "#FFFFFF", k + .5, true); if (k < .6) burstFx(ctx, 860, 250, k, GOLD, 8, 120); } }
        if (bm.countCue){ const t0 = T(s, bm.countCue, .2, idx); if (t > t0){ const n = Math.min(bm.countTo || 12, (bm.countFrom || 4) + Math.floor((t - t0) * 6)); pill(ctx, "BULAN " + n, 860, 250, 40, RED, "#FFFFFF", 1, true); } }
        const its = f.items || []; its.forEach((it, j) => { const kIn = t - (it.inAt != null ? it.inAt : (f.itemsAt != null ? f.itemsAt : .2) + j * .2); if (kIn <= 0) return; const sc = popK(kIn, .4), x = 230 + j * 230, y = f.itemsY ?? 420;
          ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); itemBadge(ctx, it.kind, 0, 0, 92, it.cue ? t - T(s, it.cue, .4, idx) : -1, t, it.tag); ctx.restore(); });
      } });
  }, (s, f, i, add) => { (f.bugs || []).forEach((b, j) => { const t0 = tOf(s, b, .2 + j * .15, i); add(t0, "whoosh"); add(t0 + .7, "pop"); });
    ((f.beam || {}).months || []).forEach(m => add(tOf(s, m, .1, i), "chime")); (f.items || []).forEach(it => { if (it.cue) add(T(s, it.cue, .4, i), "ping"); }); });

  /* ================= _oven: the oven that earns ================= */
  // f.oven {x, inCue, bakeCue, payCue, restCue, tag, on (jar holder)}
  function cake(ctx, x, y, s, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
    ctx.fillStyle = "#C98B4A"; rr(ctx, -46, -40, 92, 46, 10); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#F7B7A3"; ctx.beginPath(); ctx.moveTo(-48, -36); ctx.quadraticCurveTo(0, -64, 48, -36); ctx.lineTo(48, -26); ctx.quadraticCurveTo(30, -14, 20, -26); ctx.quadraticCurveTo(0, -12, -16, -26); ctx.quadraticCurveTo(-34, -12, -48, -26); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(0, -56, 9, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); ctx.restore(); }
  reg("oven", "Cerita: oven usaha yang menghasilkan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, ov = f.oven || {}, X = ov.x ?? 780, tIn = T(s, ov.inCue, .1, idx), tB = T(s, ov.bakeCue, .3, idx), tP = T(s, ov.payCue, .3, idx), tR = T(s, ov.restCue, .3, idx);
    const W = 390, Hh = 420, top = GROUND - Hh - 30;
    let jarW = null, tagW = [X + W / 2 - 10, top - 10];
    base(ctx, s, t, { env: "home", spots: { oven: [X, GROUND - 300, 1.15] },
      back: () => { const k = t - tIn; if (k < 0) return; const sc = popK(k, .45), sq = k < .6 ? 1 + .12 * Math.sin(k / .6 * Math.PI * 2) * (1 - k / .6) : 1;
        const bake = t > tB, wob = bake ? Math.sin(t * 22) * 2 : 0;
        ctx.save(); ctx.translate(X + wob, GROUND); ctx.scale(sc / sq, sc * sq);
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, W * .55, 16, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = OUT; ctx.fillRect(-W / 2 + 30, -30, 24, 30); ctx.fillRect(W / 2 - 54, -30, 24, 30);
        rr(ctx, -W / 2, -Hh - 30, W, Hh, 34); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7);
        rr(ctx, -W / 2 + 24, -Hh - 6, W - 48, 70, 16); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5);
        for (let i = 0; i < 3; i++){ ctx.save(); ctx.translate(-W / 2 + 80 + i * 80, -Hh + 28); ctx.rotate(t * (bake ? 3 : 0) + i); ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fillStyle = BROWN; ctx.fill(); ctx.fillStyle = CREAM; ctx.fillRect(-3, -18, 6, 14); ctx.restore(); }
        ctx.beginPath(); ctx.arc(W / 2 - 60, -Hh + 28, 12, 0, TAU); ctx.fillStyle = bake && Math.sin(t * 8) > 0 ? "#FF5A3A" : "#7A2E1A"; ctx.fill();
        // door
        const dq = bake ? c01((t - tB) / .4) : 0, dh = 250, dy0 = -Hh + 80;
        ctx.save(); ctx.translate(0, dy0 + dh); ctx.scale(1, Math.cos(dq * Math.PI * .5) * (1 - .25 * dq) || .02); ctx.translate(0, -dh);
        rr(ctx, -W / 2 + 30, 0, W - 60, dh, 22); ctx.fillStyle = "#A9531A"; ctx.fill(); ol(ctx, 6); rr(ctx, -W / 2 + 64, 36, W - 128, dh - 90, 16); ctx.fillStyle = bake ? "#FFC46B" : "#5A3A2A"; ctx.fill(); ol(ctx, 4);
        ctx.fillStyle = "#E9E2D6"; rr(ctx, -80, dh - 40, 160, 18, 9); ctx.fill(); ol(ctx, 3); ctx.restore();
        if (bake){ glowAt(ctx, 0, dy0 + dh / 2, 320, "#FFB347", .5 * dq); ctx.fillStyle = hexA("#FFD27A", .9 * dq); rr(ctx, -W / 2 + 40, dy0 + 10, W - 80, dh - 20, 14); ctx.fill(); }
        ctx.restore();
        // price tag on a string
        const tk = t - tIn - .4; if (tk > 0){ const sw = Math.sin(t * 2.2) * .12, tx = X + W / 2 - 40, ty = top - 4; tagW = [tx + Math.sin(sw) * 120, ty + 100];
          ctx.save(); ctx.translate(tx, ty); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
          const sc2 = popK(tk, .4); ctx.translate(0, 100); ctx.scale(sc2, sc2); ctx.rotate(-.1); rr(ctx, -95, -40, 190, 80, 12); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); textC(ctx, ov.tag || "CICILAN", 0, 14, 36, BROWN, 900, 160);
          if (t > tP + .8) checkMark(ctx, 82, -36, 28, t - tP - .8); ctx.restore(); } },
      over1: (ctx2, c, sts, j) => { if (j !== (ov.on ?? 0)) return; const st = sts[j], k = st.size / 92, hp = lp(st, 25, -45);
        jarW = [hp[0] + 6 * k * (st.face || 1), hp[1]]; const jx = jarW[0], jy = jarW[1], fill = c01((t - tR - .4) / 2.2);
        ctx.save(); ctx.translate(jx, jy); rr(ctx, -9 * k, -20 * k, 18 * k, 22 * k, 4 * k); ctx.fillStyle = "rgba(220,240,245,.55)"; ctx.fill(); ol(ctx, 5);
        if (fill > 0){ ctx.save(); rr(ctx, -9 * k, -20 * k, 18 * k, 22 * k, 4 * k); ctx.clip(); for (let i = 0; i < Math.floor(fill * 14); i++){ coin(ctx, -5 * k + (i % 3) * 5 * k, 0 - Math.floor(i / 3) * 4 * k - 2 * k, 2.6 * k, i); } ctx.restore(); }
        ctx.fillStyle = "#8E4E2E"; rr(ctx, -10 * k, -23 * k, 20 * k, 4 * k, 2 * k); ctx.fill(); ol(ctx, 4); ctx.restore(); },
      front: () => {
        // cakes pop out and stack on top of the oven
        if (t > tB + .3){ const n = Math.min(5, Math.floor((t - tB - .3) / .45) + 1);
          for (let i = 0; i < n; i++){ const k = t - tB - .3 - i * .45, q = c01(k / .55), sx = X, sy = GROUND - 250, tx = X - 120 + (i % 3) * 120, ty = top - 30 - Math.floor(i / 3) * 52;
            const x = lerp(sx, tx, q), y = lerp(sy, ty, q) - Math.sin(q * Math.PI) * 260; cake(ctx, x, y, .9, (1 - q) * 6);
            if (q >= 1 && k < 1) burstFx(ctx, tx, ty - 30, k - .55, GOLD, 6, 70); } }
        // coins: pay the tag, then the jar
        const stream = (t0, dur, to, n) => { if (t < t0) return; for (let i = 0; i < n; i++){ const k = t - t0 - i * dur / n; if (k < 0 || k > .8) continue; const q = k / .8, fx = X - 60 + (i % 3) * 60, fy = top - 60;
          coin(ctx, lerp(fx, to[0], q), lerp(fy, to[1], q) - Math.sin(q * Math.PI) * 200, 26, t * 8 + i); } };
        stream(tP, 1.4, tagW, 6); if (jarW) stream(tR, 2.2, [jarW[0], jarW[1] - 80], 14);
        if (jarW && t > tR + .5){ for (let i = 0; i < 3; i++){ const k = ((t - tR - .5) * .8 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - k; textC(ctx, "+Rp", jarW[0] + (i - 1) * 60, jarW[1] - 200 - k * 140, 44, GREEN, 900); ctx.restore(); } }
        if (t > tB){ for (let i = 0; i < 4; i++){ const q = ((t - tB) * .6 + i / 4) % 1; ctx.save(); ctx.globalAlpha = .4 * Math.sin(q * Math.PI); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(X - 100 + i * 60 + Math.sin(q * 6 + i) * 20, top - 60 - q * 260, 24 + q * 20, 0, TAU); ctx.fill(); ctx.restore(); } }
      } });
  }, (s, f, i, add) => { const ov = f.oven || {}; const tIn = T(s, ov.inCue, .1, i), tB = T(s, ov.bakeCue, .3, i), tP = T(s, ov.payCue, .3, i), tR = T(s, ov.restCue, .3, i);
    if (tIn < 1e8){ add(tIn, "pop"); add(tIn + .4, "pop"); } if (tB < 1e8){ add(tB, "whoosh"); for (let k = 0; k < 5; k++) add(tB + .3 + k * .45 + .5, "pop"); }
    if (tP < 1e8){ add(tP, "ping"); add(tP + .8, "chime"); } if (tR < 1e8){ add(tR, "ping"); add(tR + 1.2, "chime"); } });

  /* ================= _bumerang: productive debt comes back, consumptive debt does not ================= */
  // f.throws [{on, cue, label, ret, rx, ry, dur, stamp, col, waitCue}]
  function boomer(ctx, x, y, sc, rot, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.beginPath(); ctx.moveTo(-70, 30); ctx.quadraticCurveTo(-40, -30, 0, -40); ctx.quadraticCurveTo(40, -30, 70, 30); ctx.quadraticCurveTo(76, 44, 60, 44); ctx.quadraticCurveTo(36, 0, 0, -10); ctx.quadraticCurveTo(-36, 0, -60, 44); ctx.quadraticCurveTo(-76, 44, -70, 30); ctx.closePath();
    ctx.fillStyle = col || ORANGE; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-54, 24); ctx.quadraticCurveTo(-30, -18, 0, -26); ctx.stroke(); ctx.restore(); }
  reg("bumerang", "Cerita: bumerang utang (kembali membawa uang / hilang)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, ths = (f.throws || []).map((b, j) => Object.assign({ T: T(s, b.cue, .3, idx), j }, b));
    base(ctx, s, t, { env: "beach",
      front: (ctx2, c, sts) => { ths.forEach(b => { const st = sts[b.on]; if (!st) return; const f1 = st.face || 1, hp = lp(st, 22, -70), k = t - b.T, D = b.dur || 2.0;
        if (b.label) pill(ctx, b.label, st.x, st.y - st.size * 1.12, 30, b.col || CREAM, b.col ? "#FFFFFF" : BROWN, t - (b.labelAt ?? .2));
        if (k < 0){ boomer(ctx, hp[0], hp[1], .9, Math.sin(t * 3) * .1 - .4 * f1, b.col); return; }
        if (b.ret){ const q = c01(k / D), th2 = q * TAU, Rx = b.rx ?? 200, Ry = b.ry ?? 420;
          if (q < 1){ const x = hp[0] + f1 * Rx * (1 - Math.cos(th2)), y = hp[1] - Ry * Math.sin(th2) * (th2 < Math.PI ? 1 : .35), sc = 1 - .45 * Math.sin(th2 / 2);
            for (let i = 1; i < 6; i++){ const qq = Math.max(0, q - i * .02), tt = qq * TAU; ctx.save(); ctx.globalAlpha = .18 * (1 - i / 6); boomer(ctx, hp[0] + f1 * Rx * (1 - Math.cos(tt)), hp[1] - Ry * Math.sin(tt) * (tt < Math.PI ? 1 : .35), sc, (t - i * .02) * 16, b.col); ctx.restore(); }
            boomer(ctx, x, y, sc, t * 16, b.col);
            if (th2 > Math.PI * .9){ for (let i = 0; i < 4; i++){ coin(ctx, x - f1 * (40 + i * 46) * Math.cos(th2 / 2 + 1), y + 50 + Math.sin(t * 8 + i) * 14 + i * 10, 22 * sc + 4, t * 7 + i); } } }
          else { const kk = k - D; boomer(ctx, hp[0], hp[1], .9, -.4 * f1 + Math.sin(t * 3) * .05, b.col); burstFx(ctx, hp[0], hp[1], kk, GOLD, 12, 180);
            for (let i = 0; i < 8; i++){ const k2 = kk - i * .04; if (k2 < 0 || k2 > 1.4) continue; const vx = (rnd(i) - .5) * 500, vy = -520 - rnd(i + 5) * 300; coin(ctx, hp[0] + vx * k2, Math.min(GROUND - 24, hp[1] + vy * k2 + 1300 * k2 * k2), 26, t * 9 + i); }
            for (let i = 0; i < 3; i++){ const z = ((kk * .7 + i / 3) % 1); ctx.save(); ctx.globalAlpha = Math.sin(z * Math.PI); textC(ctx, "+Rp", hp[0] + (i - 1) * 90, hp[1] - 220 - z * 160, 50, GREEN, 900); ctx.restore(); } } }
        else { const q = c01(k / 1.1); if (q < 1){ const x = hp[0] + f1 * 1300 * eIn(q) + f1 * 200 * q, y = hp[1] - 520 * q, sc = 1 - .8 * q; boomer(ctx, x, y, sc, t * 16, b.col); ctx.save(); ctx.strokeStyle = hexA(CREAM, .7); ctx.lineWidth = 6; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(hp[0], hp[1]); ctx.quadraticCurveTo((hp[0] + x) / 2, hp[1] - 300 * q, x, y); ctx.stroke(); ctx.restore(); }
          const kw = b.waitCue ? t - T(s, b.waitCue, .3, idx) : k - 1.6; if (kw > 0){ const hb = headOf(st); for (let i = 0; i < 3; i++){ ctx.save(); ctx.globalAlpha = c01((kw - i * .3) / .2); ctx.beginPath(); ctx.arc(hb[0] + f1 * (hb[2] * 1.3 + i * 40), hb[1] - hb[2] * 1.4 - i * 30, 12 + i * 4, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 3); ctx.restore(); }
            // empty hand + money flies away from the pocket
            for (let i = 0; i < 5; i++){ const z = ((kw * .6 + i / 5) % 1), px = st.x - f1 * 30, py = st.y - st.size * .35; ctx.save(); ctx.globalAlpha = Math.sin(z * Math.PI) * .9; coin(ctx, px - f1 * z * 120 + Math.sin(z * 9 + i) * 30, py + z * 260, 22, t * 6 + i); ctx.restore(); } } } }); },
      over: (ctx2, c, sts) => { ths.forEach(b => { const st = sts[b.on]; if (!st || !b.stamp) return; const kS = t - (b.stampCue ? T(s, b.stampCue, .3, idx) : b.T + (b.ret ? (b.dur || 2) : 1.4)); if (kS <= 0) return; const p = c.toScreen(st.x, st.y - st.size * 1.25); stampBox(ctx, b.stamp, p[0], Math.max(250, Math.min(520, p[1])), kS, b.ret ? GREEN : RED, 46, b.ret ? -.06 : .06); }); } });
  }, (s, f, i, add) => { (f.throws || []).forEach(b => { const t0 = T(s, b.cue, .3, i); add(t0, "whoosh"); if (b.ret){ add(t0 + (b.dur || 2) * .5, "whoosh"); add(t0 + (b.dur || 2), "chime"); } else add(t0 + 1.6, "ping"); }); });

  /* ================= _pudar: the phone takes the father's mind ================= */
  // f.phone {on, cue|at}, f.ghost {on, cue, amt}, f.feed true
  reg("pudar", "Cerita: hadir tapi tak hadir (pikiran tersedot ponsel)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, ph = f.phone || {}, tP = tOf(s, ph, .05, idx), gh = f.ghost, tG = gh ? T(s, gh.cue, .3, idx) : 1e9, on = ph.on ?? 0;
    let phoneW = null, headW = null;
    base(ctx, s, t, { env: "home", envOpt: { time: "night" },
      alpha: j => j === (gh ? gh.on : -1) ? lerp(1, gh.amt ?? .38, c01((t - tG - .6) / 1.2)) : 1,
      under: (ctx2, c, sts, j) => { if (j !== on) return; const st = sts[j], k = st.size / 92; phoneW = lp(st, 18, -32); headW = headOf(st);
        if (t > tP){ const q = c01((t - tP) / .5); ctx.save(); ctx.globalAlpha = .55 * q * (.85 + .15 * Math.sin(t * 9)); const g = ctx.createLinearGradient(phoneW[0], phoneW[1], headW[0], headW[1]); g.addColorStop(0, hexA("#9FE3FF", .9)); g.addColorStop(1, hexA("#9FE3FF", .15));
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(phoneW[0] - 6 * k, phoneW[1]); ctx.lineTo(headW[0] - headW[2] * .9, headW[1] - headW[2] * .4); ctx.lineTo(headW[0] + headW[2] * .9, headW[1] + headW[2] * .3); ctx.lineTo(phoneW[0] + 6 * k, phoneW[1]); ctx.closePath(); ctx.fill(); ctx.restore(); } },
      over1: (ctx2, c, sts, j) => { if (j !== on) return; const st = sts[j], k = st.size / 92, f1 = st.face || 1;
        ctx.save(); ctx.translate(phoneW[0], phoneW[1]); ctx.rotate(-.35 * f1); rr(ctx, -5 * k, -8 * k, 10 * k, 16 * k, 1.8 * k); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 4); rr(ctx, -4 * k, -7 * k, 8 * k, 13 * k, 1.2 * k); ctx.fillStyle = t > tP ? "#BFF0FF" : "#5A6A74"; ctx.fill();
        if (t > tG + .4 && gh){ ctx.save(); ctx.translate(0, -1 * k); ctx.rotate(t * 6); ctx.strokeStyle = "#5BA9D6"; ctx.lineWidth = 3; ctx.beginPath(); for (let a = 0; a < 14; a += .4) ctx.lineTo(Math.cos(a) * a * .25 * k, Math.sin(a) * a * .25 * k); ctx.stroke(); ctx.restore(); }
        ctx.restore(); glowAt(ctx, phoneW[0], phoneW[1], 34 * k, "#9FE3FF", t > tP ? .5 : 0);
        if (f.feed && t > tP){ const icons = ["heart", "chat", "star", "rocket", "heart", "chart"]; for (let i = 0; i < 6; i++){ const q = ((t - tP) * .45 + i / 6) % 1, x = phoneW[0] + f1 * (24 + q * 110) + Math.sin(q * 5 + i) * 22, y = phoneW[1] - 40 - q * 380;
          ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .95; const r = 30; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = i % 2 ? "#FFFFFF" : "#BFF0FF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ico(ctx, icons[i], x, y, 34, i % 3 ? RED : "#2F6F73", 2.6); ctx.restore(); } }
        // ghost mind: rises from the head and spirals into the phone
        if (gh && t > tG){ const k2 = t - tG, hb = headOf(st), q = c01((k2 - .5) / 1.6), r = hb[2] * .55 * lerp(1, .12, eIn(q)), a = q * TAU * 1.5;
          const up = c01(k2 / .5), sx = hb[0], sy = hb[1] - hb[2] * 1.4 * eOut(up), x = lerp(sx, phoneW[0], eIn(q)) + Math.cos(a) * 80 * (1 - q), y = lerp(sy, phoneW[1], eIn(q)) + Math.sin(a) * 50 * (1 - q);
          if (q < 1){ ctx.save(); ctx.globalAlpha = .85; ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); for (let i = 0; i <= 6; i++) ctx.lineTo(r - i * r / 3, r * 1.1 + (i % 2 ? -r * .3 : 0) + Math.sin(t * 10 + i) * r * .08); ctx.closePath();
            ctx.fillStyle = "#E8F7FF"; ctx.fill(); ctx.strokeStyle = "#5BA9D6"; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-r * .3, -r * .1, r * .12, 0, TAU); ctx.arc(r * .3, -r * .1, r * .12, 0, TAU); ctx.fill(); ctx.restore();
            for (let i = 1; i < 6; i++){ const qq = Math.max(0, q - i * .04), xx = lerp(sx, phoneW[0], eIn(qq)) + Math.cos(qq * TAU * 1.5) * 80 * (1 - qq), yy = lerp(sy, phoneW[1], eIn(qq)) + Math.sin(qq * TAU * 1.5) * 50 * (1 - qq); ctx.save(); ctx.globalAlpha = .3 * (1 - i / 6); ctx.beginPath(); ctx.arc(xx, yy, r * .5, 0, TAU); ctx.fillStyle = "#E8F7FF"; ctx.fill(); ctx.restore(); } }
          else if (k2 - 2.1 < .9) burstFx(ctx, phoneW[0], phoneW[1], k2 - 2.1, "#9FE3FF", 8, 110);
          if (k2 > 1.2){ for (let i = 0; i < 3; i++){ const q2 = ((t * .6 + i / 3) % 1); ctx.save(); ctx.globalAlpha = .5 * Math.sin(q2 * Math.PI); ctx.strokeStyle = "#BFE3F5"; ctx.lineWidth = 4; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.ellipse(st.x, st.y - st.size * .45, st.size * .22 + q2 * 40, st.size * .5 + q2 * 40, 0, 0, TAU); ctx.stroke(); ctx.restore(); } } }
      },
      post: () => { if (t > tP) { ctx.save(); ctx.globalAlpha = .16 * c01((t - tP) / 1) + (gh && t > tG ? .1 * c01((t - tG) / 1.5) : 0); ctx.fillStyle = "#3A5A9A"; ctx.globalCompositeOperation = "multiply"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } } });
  }, (s, f, i, add) => { const ph = f.phone || {}; const tP = tOf(s, ph, .05, i); if (tP > .1 && tP < 1e8) add(tP, "ping"); if (f.ghost){ const tG = T(s, f.ghost.cue, .3, i); add(tG, "whoosh"); add(tG + 2.1, "pop"); } });

  /* ================= _gambar: child's crayon drawing ================= */
  // f.paper {x, y, w, h, cue|at, title, parts:[{kind: house|mom|kid|dad|sun, cue}], dad: "phone"|"smile", markCue}
  function crayon(ctx, pts, col, w, jit){ ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round"; for (let p = 0; p < 2; p++){ ctx.beginPath(); pts.forEach((q, i) => { const jx = (rnd(i * 3 + p * 7) - .5) * (jit || 4), jy = (rnd(i * 5 + p * 11) - .5) * (jit || 4); i ? ctx.lineTo(q[0] + jx, q[1] + jy) : ctx.moveTo(q[0] + jx, q[1] + jy); }); ctx.globalAlpha = p ? .55 : 1; ctx.stroke(); } ctx.globalAlpha = 1; }
  function circPts(cx, cy, r, n){ const o = []; for (let i = 0; i <= (n || 18); i++){ const a = i / (n || 18) * TAU; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return o; }
  function figure(ctx, x, y, h, col, opt, t){ opt = opt || {}; const hr = h * .16, hy = y - h + hr;
    if (opt.phone){ ctx.save(); ctx.translate(x, hy); ctx.rotate(Math.sin(t * 3) * .04); ctx.scale(1.5, 1.5); rr(ctx, -hr * .85, -hr * 1.15, hr * 1.7, hr * 2.3, 10); ctx.fillStyle = "#2B2B33"; ctx.fill(); rr(ctx, -hr * .65, -hr * .95, hr * 1.3, hr * 1.8, 6); ctx.fillStyle = "#8FD8F0"; ctx.fill(); glowAt(ctx, 0, 0, hr * 1.6, "#8FD8F0", .35 + .15 * Math.sin(t * 5)); ctx.beginPath(); ctx.arc(hr * .8, -hr * 1.1, hr * .3, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.restore(); }
    else { crayon(ctx, circPts(x, hy, hr), col, 7); if (opt.hijab){ crayon(ctx, [[x - hr * 1.1, hy + hr * 1.1], [x - hr * 1.2, hy - hr * .2], [x, hy - hr * 1.3], [x + hr * 1.2, hy - hr * .2], [x + hr * 1.1, hy + hr * 1.1]], opt.hijab, 9); }
      if (opt.tails){ crayon(ctx, [[x - hr, hy - hr * .3], [x - hr * 1.8, hy + hr * .4]], col, 9); crayon(ctx, [[x + hr, hy - hr * .3], [x + hr * 1.8, hy + hr * .4]], col, 9); }
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(x - hr * .35, hy - hr * .1, 4, 0, TAU); ctx.arc(x + hr * .35, hy - hr * .1, 4, 0, TAU); ctx.fill(); crayon(ctx, [[x - hr * .45, hy + hr * .35], [x, hy + hr * .6], [x + hr * .45, hy + hr * .35]], RED, 5, 2); }
    const ny = hy + hr * (opt.phone ? 1.7 : 1); crayon(ctx, [[x, ny], [x - h * .22, y - h * .2], [x + h * .22, y - h * .2], [x, ny]], col, 7);
    crayon(ctx, [[x - h * .1, y - h * .2], [x - h * .14, y]], col, 7); crayon(ctx, [[x + h * .1, y - h * .2], [x + h * .14, y]], col, 7);
    crayon(ctx, [[x - h * .08, ny + h * .1], [x - h * .3, ny + h * .22]], col, 7); crayon(ctx, [[x + h * .08, ny + h * .1], [x + h * .3, ny + h * .22]], col, 7); }
  function drawPart(ctx, kind, opt, t){
    if (kind === "house"){ crayon(ctx, [[150, -10], [150, 180], [330, 180], [330, -10], [150, -10]], ORANGE, 8); crayon(ctx, [[130, -10], [240, -120], [350, -10]], RED, 8); crayon(ctx, [[220, 180], [220, 100], [260, 100], [260, 180]], BROWN, 6); crayon(ctx, [[175, 30], [205, 30], [205, 60], [175, 60], [175, 30]], "#5B9BD5", 6); }
    else if (kind === "mom") figure(ctx, -220, 190, 250, "#2F6F73", { hijab: "#7FA563" }, t);
    else if (kind === "kid") figure(ctx, -80, 190, 170, "#D9483B", { tails: true }, t);
    else if (kind === "dad") figure(ctx, 50, 190, 260, "#5B7DB1", { phone: opt.dad !== "smile" }, t);
    else if (kind === "sun"){ crayon(ctx, circPts(-300, -170, 40), GOLD, 9); for (let i = 0; i < 8; i++){ const a = i / 8 * TAU + Math.sin(t) * .05; crayon(ctx, [[-300 + Math.cos(a) * 55, -170 + Math.sin(a) * 55], [-300 + Math.cos(a) * 80, -170 + Math.sin(a) * 80]], GOLD, 6, 2); } }
    else if (kind === "heart"){ crayon(ctx, [[-10, -120], [-40, -150], [-60, -120], [-10, -70], [40, -120], [20, -150], [-10, -120]], RED, 7); } }
  const PART_C = { house: [240, 40], mom: [-220, 60], kid: [-80, 110], dad: [50, 60], sun: [-300, -170], heart: [-10, -110] };
  function paperSheet(ctx, pp, t, s, idx, scaleIn){ const W = pp.w ?? 760, Hh = pp.h ?? 560;
    ctx.save(); ctx.translate(pp.x ?? 540, pp.y ?? 820); ctx.rotate(Math.sin(t * 1.3) * .015 + (pp.rot || 0)); ctx.scale(scaleIn, scaleIn);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(-W / 2 + 16, -Hh / 2 + 18, W, Hh); ctx.fillStyle = PAPER; ctx.fillRect(-W / 2, -Hh / 2, W, Hh); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-W / 2, -Hh / 2, W, Hh);
    ctx.fillStyle = hexA(GOLD, .6); ctx.save(); ctx.translate(-W / 2 + 40, -Hh / 2 + 6); ctx.rotate(-.5); ctx.fillRect(-50, -14, 100, 28); ctx.restore(); ctx.save(); ctx.translate(W / 2 - 40, -Hh / 2 + 6); ctx.rotate(.5); ctx.fillRect(-50, -14, 100, 28); ctx.restore();
    ctx.fillStyle = "#7FA563"; ctx.fillRect(-W / 2 + 6, 190, W - 12, Hh / 2 - 196);
    if (pp.title){ const kt = t - (pp.titleAt ?? 0); if (kt > 0){ ctx.save(); ctx.globalAlpha = c01(kt / .4); ctx.rotate(-.03); textC(ctx, pp.title, 40, -Hh / 2 + 70, 52, ORANGE, 900, W - 200); ctx.restore(); } }
    let tip = null;
    (pp.parts || []).forEach((p, j) => { const k = t - (p.T ?? 0); if (k <= 0) return; const q = c01(k / .9), cc = PART_C[p.kind] || [0, 0];
      ctx.save(); if (q < 1){ ctx.beginPath(); ctx.arc(cc[0], cc[1], 30 + q * 230, 0, TAU); ctx.clip(); const a = q * TAU * 2.2; tip = [cc[0] + Math.cos(a) * (20 + q * 120), cc[1] + Math.sin(a) * (20 + q * 100), p.kind]; }
      drawPart(ctx, p.kind, pp, t); ctx.restore(); });
    if (pp.markT != null && t > pp.markT){ const k = t - pp.markT, q = c01(k / .6), cc = PART_C.dad; ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.globalAlpha = .9; ctx.beginPath(); ctx.ellipse(cc[0], cc[1] - 70, 95 + Math.sin(t * 6) * 4, 80, -.2, -1, -1 + q * TAU * 1.05); ctx.stroke(); ctx.restore(); }
    if (tip){ ctx.save(); ctx.translate(tip[0], tip[1]); ctx.rotate(-.7); rr(ctx, -10, -80, 20, 80, 4); ctx.fillStyle = tip[2] === "dad" ? "#5B7DB1" : tip[2] === "mom" ? "#7FA563" : tip[2] === "house" ? ORANGE : RED; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(0, 18); ctx.lineTo(10, 0); ctx.closePath(); ctx.fill(); ol(ctx, 3); ctx.restore(); }
    ctx.restore(); }
  reg("gambar", "Cerita: gambar krayon anak (ayah berwajah ponsel)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, pp = Object.assign({}, f.paper || {}), tA = tOf(s, pp, .05, idx);
    pp.parts = (pp.parts || []).map((p, j) => Object.assign({}, p, { T: tOf(s, p, .2 + j * .1, idx) })); pp.titleAt = tA + .3; if (pp.markCue) pp.markT = T(s, pp.markCue, .4, idx);
    base(ctx, s, t, { env: "info", spots: { paper: () => [pp.x ?? 540, pp.y ?? 820, 1.2], dad: () => [(pp.x ?? 540) + 50, (pp.y ?? 820) - 40, 1.8] },
      back: () => { const k = t - tA; if (k <= 0) return; const sc = popK(k, .5); paperSheet(ctx, pp, t, s, idx, sc); } });
  }, (s, f, i, add) => { const pp = f.paper || {}; add(tOf(s, pp, .05, i), "whoosh"); (pp.parts || []).forEach((p, j) => add(tOf(s, p, .2 + j * .1, i), "pop")); if (pp.markCue) add(T(s, pp.markCue, .4, i), "ping"); });

  /* ================= _parkir: phone parking by the door ================= */
  // f.rack {x, y, cue (toss), from (toon idx), label}, f.warm {cue}, f.laugh {cue, on:[idx]}, f.floor {x, cue, dad:"smile"}, f.cushions [x...]
  reg("parkir", "Cerita: parkir ponsel di rak dekat pintu, rumah jadi hangat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, rk = f.rack || {}, RX = rk.x ?? 300, RY = rk.y ?? 1160, tT = T(s, rk.cue, .3, idx), D = 2.1, tW = f.warm ? T(s, f.warm.cue, .3, idx) : 1e9, tL = f.laugh ? T(s, f.laugh.cue, .3, idx) : 1e9;
    let from = null;
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 900 }, spots: { rack: [RX, RY - 60, 1.5] },
      back: () => {
        // door
        const DX = rk.doorX ?? 110; ctx.fillStyle = "#6B3E26"; rr(ctx, DX - 120, GROUND - 560, 240, 560, 10); ctx.fill(); ol(ctx, 7); rr(ctx, DX - 90, GROUND - 520, 180, 220, 8); ctx.strokeStyle = "#4A2A18"; ctx.lineWidth = 5; ctx.stroke(); rr(ctx, DX - 90, GROUND - 270, 180, 230, 8); ctx.stroke();
        ctx.beginPath(); ctx.arc(DX + 80, GROUND - 290, 13, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
        // shelf + tiny garage with a P sign
        const GX = RX + 60, GW = 150, GH = 120, GY = RY - 20, kT = t - tT, door = c01((kT - 1.6) / .5);
        ctx.fillStyle = "#A9643B"; rr(ctx, RX - 170, RY - 20, 340, 30, 8); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#8E4E2E"; [-150, 130].forEach(dx => { ctx.beginPath(); ctx.moveTo(RX + dx, RY + 10); ctx.lineTo(RX + dx + 20, RY + 10); ctx.lineTo(RX + dx + 10, RY + 60); ctx.closePath(); ctx.fill(); ol(ctx, 4); });
        ctx.fillStyle = "#E9E2D6"; rr(ctx, GX - GW / 2, GY - GH, GW, GH, 6); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#C8323C"; ctx.beginPath(); ctx.moveTo(GX - GW / 2 - 16, GY - GH + 4); ctx.lineTo(GX, GY - GH - 60); ctx.lineTo(GX + GW / 2 + 16, GY - GH + 4); ctx.closePath(); ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = "#2B2430"; rr(ctx, GX - GW / 2 + 16, GY - GH + 26, GW - 32, GH - 26, 4); ctx.fill();
        if (kT >= 1.6){ rr(ctx, GX - 56, GY - 77, 112, 56, 12); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5); rr(ctx, GX - 48, GY - 71, 96, 44, 6); ctx.fillStyle = "#3A4A5A"; ctx.fill(); }
        if (door > 0){ ctx.fillStyle = "#9AA3AE"; ctx.fillRect(GX - GW / 2 + 16, GY - GH + 26, GW - 32, (GH - 26) * door); ctx.strokeStyle = "#6C7480"; ctx.lineWidth = 3; for (let yy = GY - GH + 40; yy < GY - GH + 26 + (GH - 26) * door; yy += 16){ ctx.beginPath(); ctx.moveTo(GX - GW / 2 + 16, yy); ctx.lineTo(GX + GW / 2 - 16, yy); ctx.stroke(); } }
        const sw = Math.sin(t * 2) * .04; ctx.save(); ctx.translate(GX, GY - GH - 140); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 50); ctx.lineTo(0, 80); ctx.stroke(); rr(ctx, -52, -52, 104, 104, 16); ctx.fillStyle = "#2F64B5"; ctx.fill(); ol(ctx, 6); rr(ctx, -42, -42, 84, 84, 10); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke();
        textC(ctx, "P", 0, 28, 76, "#FFFFFF", 900); ctx.restore();
        const lit = t > tT + D; if (lit){ glowAt(ctx, GX, GY - GH - 140, 160, "#8FD8F0", .35 + .1 * Math.sin(t * 4)); for (let i = 0; i < 3; i++){ const z = ((t * .5 + i / 3) % 1); ctx.save(); ctx.globalAlpha = Math.sin(z * Math.PI); textC(ctx, "z", GX + 70 + z * 50, GY - GH - 20 - z * 90, 34 + z * 16, "#BFE3F5", 900); ctx.restore(); } }
        if (rk.label) pill(ctx, rk.label, RX, RY + 70, 28, CREAM, BROWN, t - tT - D);
        // floor paper + cushions
        (f.cushions || []).forEach(cx => { ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.ellipse(cx, GROUND - 22, 120, 34, 0, 0, TAU); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.ellipse(cx, GROUND - 34, 96, 20, 0, 0, TAU); ctx.fill(); });
        const fl = f.floor; if (fl){ const k = t - T(s, fl.cue, .3, idx); if (k > 0){ const X = fl.x ?? 760; ctx.save(); ctx.translate(X, GROUND + 10); ctx.scale(1, .32); ctx.rotate(-.06); ctx.fillStyle = PAPER; ctx.fillRect(-180, -130, 360, 260); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.strokeRect(-180, -130, 360, 260);
          const n = Math.min(6, Math.floor(k * 2) + 1); for (let i = 0; i < n; i++){ ctx.strokeStyle = [RED, GOLD, "#2F6F73", ORANGE, "#5B7DB1", "#7FA563"][i]; ctx.lineWidth = 16; ctx.beginPath(); for (let z = 0; z < 6; z++) ctx.lineTo(-140 + i * 48 + (z % 2) * 30, -100 + z * 40); ctx.stroke(); } ctx.restore();
          [[-60, RED], [40, GOLD], [120, "#2F6F73"]].forEach(([dx, col], i) => { ctx.save(); ctx.translate(X + dx, GROUND + 20 + i * 6); ctx.rotate(.4 + i * .6); rr(ctx, -8, -40, 16, 80, 4); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3); ctx.restore(); }); } }
      },
      under: (ctx2, c, sts, j) => { if (j === (rk.from ?? 0)) from = lp(sts[j], 18, -44); },
      front: () => { if (t < tT || !from) return; const k = t - tT, GX = RX + 60, sy = RY - 20, x0 = RX - 130;
        const car = (x, y, rot, wheels, lights, scr) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rr(ctx, -56, -62, 112, 56, 12); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5); rr(ctx, -48, -56, 96, 44, 6); ctx.fillStyle = scr; ctx.fill();
          if (wheels > 0){ [-32, 32].forEach(dx => { ctx.save(); ctx.translate(dx, -6); ctx.scale(wheels, wheels); ctx.rotate(t * 14); ctx.beginPath(); ctx.arc(0, 0, 15, 0, TAU); ctx.fillStyle = "#2B2430"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#C9CED6"; ctx.fillRect(-3, -12, 6, 24); ctx.restore(); }); }
          if (lights){ ctx.beginPath(); ctx.arc(54, -30, 8, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = "#FFF1B0"; ctx.beginPath(); ctx.moveTo(56, -30); ctx.lineTo(180, -70); ctx.lineTo(180, 10); ctx.closePath(); ctx.fill(); ctx.restore(); } ctx.restore(); };
        if (k < .6){ const q = k / .6; car(lerp(from[0], x0, eOut(q)), lerp(from[1], sy, q) - Math.sin(q * Math.PI) * 260, (1 - q) * 6, 0, false, "#BFF0FF"); }
        else if (k < 1.6){ const q = (k - .6) / 1, wq = c01((k - .6) / .25), x = lerp(x0, GX, Math.max(0, (q - .2) / .8) ** 1.2), bump = Math.abs(Math.sin(k * 18)) * 4;
          car(x, sy - 15 - bump, 0, eBack(wq), true, "#BFF0FF"); if (k < .9) burstFx(ctx, x0, sy - 40, k - .6, "#8FD8F0", 8, 90);
          ctx.save(); ctx.globalAlpha = Math.sin(c01((k - .7) / .8) * Math.PI); textC(ctx, "BIP BIP!", x, sy - 120, 36, ORANGE, 900); ctx.restore(); }
        if (k > 2.1) burstFx(ctx, GX, sy - 80, k - 2.1, "#8FD8F0", 8, 130); },
      over1: (ctx2, c, sts, j, R) => { if (t < tL || !f.laugh || !(f.laugh.on || [0, 1]).includes(j)) return; const hb = headOf(sts[j]);
        for (let i = 0; i < 3; i++){ const q = ((t - tL) * .8 + i / 3 + j * .17) % 1, side = (i + j) % 2 ? 1 : -1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.translate(hb[0] + side * (hb[2] * 1.2 + q * 60), hb[1] - hb[2] * .6 - q * 120); ctx.rotate(side * .2); textC(ctx, "HA", 0, 0, 44 + q * 10, i % 2 ? ORANGE : GOLD, 900); ctx.restore(); } },
      post: () => {
        if (t < tW){ ctx.save(); ctx.globalAlpha = .16; ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "#3A5A9A"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
        else { const q = c01((t - tW) / 1.2); ctx.save(); ctx.globalAlpha = .16 * (1 - q); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "#3A5A9A"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
          ctx.save(); ctx.globalCompositeOperation = "soft-light"; ctx.globalAlpha = .45 * q; const g = ctx.createRadialGradient(560, 1000, 50, 560, 1000, 900); g.addColorStop(0, "#FFB347"); g.addColorStop(1, "#C2691F"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
          for (let i = 0; i < 14; i++){ const z = ((t - tW) * .12 + rnd(i)) % 1, x = 80 + rnd(i + 9) * 920 + Math.sin(t + i) * 20, y = 1350 - z * 1000; ctx.save(); ctx.globalAlpha = q * Math.sin(z * Math.PI) * .8; if (i % 3 === 0){ ctx.translate(x, y); ctx.fillStyle = "#FF8A7A"; ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-22, -8, -10, -24, 0, -12); ctx.bezierCurveTo(10, -24, 22, -8, 0, 8); ctx.fill(); }
            else glowAt(ctx, x, y, 22, GOLD, .9); ctx.restore(); }
          if (t - tW < .9) burstFx(ctx, 540, 900, t - tW, GOLD, 12, 260); } } });
  }, (s, f, i, add) => { const rk = f.rack || {}; const tT = T(s, rk.cue, .3, i); if (tT < 1e8){ add(tT, "whoosh"); add(tT + .6, "pop"); add(tT + 1.0, "ping"); add(tT + 1.6, "whoosh"); add(tT + 2.1, "chime"); } if (f.warm) add(T(s, f.warm.cue, .3, i), "chime"); if (f.laugh) add(T(s, f.laugh.cue, .3, i), "pop"); if (f.floor) add(T(s, f.floor.cue, .3, i), "pop"); });

  /* ================= _palang: the high-jump bar ================= */
  // f.bar {x, w, h, label, levels:[{cue|at, h, label}], hero, mat}, f.loop {cue, endCue, hero, n, days:[], hs:[], labels:[], xFrom, xTo, last}
  function barState(s, f, t, idx){ const b = f.bar || {}; let h = b.h ?? 120, lab = b.label || "", prevH = h, tC = -9;
    (b.levels || []).forEach(L => { const t0 = tOf(s, L, .3, idx); if (t >= t0){ prevH = h; h = L.h; lab = L.label ?? lab; tC = t0; } });
    const lp2 = f.loop; let day = null; if (lp2){ const tA = T(s, lp2.cue, .1, idx), tB = T(s, lp2.endCue, .3, idx), n = lp2.n || (lp2.hs || []).length, dt = (tB - tA) / n;
      for (let i = 0; i < n; i++){ const tL = tA + i * dt; if (t >= tL){ prevH = h; h = lp2.hs[i]; lab = lp2.labels[i]; tC = tL; day = lp2.days ? lp2.days[i] : null; } } }
    const q = c01((t - tC) / .6); return { h: lerp(prevH, h, eBack(q)), lab, tC, day, moving: q < 1 && Math.abs(prevH - h) > 2 }; }
  reg("palang", "Cerita: palang lompat tinggi (target kebiasaan)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, b = f.bar || {}, X = b.x ?? 620, Wd = b.w ?? 520, hero = b.hero ?? 0, lp2 = f.loop;
    const bs = barState(s, f, t, idx);
    base(ctx, s, t, { env: "street", spots: { bar: () => [X, GROUND - bs.h - 100, 1] },
      prep: (a, j) => { if (j !== hero) return null; let keys = (a.keys || []).slice();
        if (lp2){ const tA = T(s, lp2.cue, .1, idx), tB = T(s, lp2.endCue, .3, idx), n = lp2.n || lp2.hs.length, dt = (tB - tA) / n;
          for (let i = 0; i < n; i++){ const tL = tA + i * dt, last = i === n - 1; keys.push({ at: tL, x: lp2.xFrom ?? -260, dur: .02 }); keys.push({ at: tL + .04, x: last ? (lp2.last ?? 860) : (lp2.xTo ?? 1340), run: true, dur: last ? dt * .6 : dt - .1 }); } }
        const a1 = Object.assign({}, a, { keys }), ct = crossTimes(a1, s, X, idx);
        ct.forEach(tc => { const bh = barState(s, f, tc, idx).h, jd = .45 + bh / 900; keys.push({ at: tc - .13 - jd / 2, jump: bh + 70, jumpDur: jd }); });
        return { a: Object.assign({}, a, { keys }), t }; },
      back: () => { const hmax = Math.max(b.postH || 0, bs.h + 140), sh = bs.moving ? Math.sin(t * 40) * 4 : 0;
        if (b.mat !== false){ ctx.fillStyle = "#2F64B5"; rr(ctx, X + Wd / 2 + 40, GROUND - 80, 360, 90, 18); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#5B8FD9"; rr(ctx, X + Wd / 2 + 60, GROUND - 70, 320, 26, 10); ctx.fill(); }
        [-1, 1].forEach(d => { const px = X + d * Wd / 2; ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(px, GROUND + 4, 60, 12, 0, 0, TAU); ctx.fill(); ctx.fillStyle = BROWN; rr(ctx, px - 50, GROUND - 22, 100, 24, 8); ctx.fill(); ol(ctx, 4);
          for (let y = 0; y < hmax; y += 60){ ctx.fillStyle = (y / 60) % 2 ? "#FFFFFF" : RED; ctx.fillRect(px - 12, GROUND - 20 - y - 60, 24, 60); } ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(px - 12, GROUND - 20 - hmax, 24, hmax); });
        const by = GROUND - bs.h + sh; ctx.fillStyle = GOLD; rr(ctx, X - Wd / 2 - 20, by - 12, Wd + 40, 24, 12); ctx.fill(); ol(ctx, 5);
        [-1, 1].forEach(d => { ctx.fillStyle = "#8E4E2E"; rr(ctx, X + d * Wd / 2 - 24, by + 8, 48, 18, 6); ctx.fill(); ol(ctx, 3); });
        if (bs.lab){ const k = t - bs.tC, sc = popK(k + .05, .35), sw = Math.sin(t * 2.4) * .05; font(ctx, 900, 44, FAM); const w = Math.min(460, ctx.measureText(bs.lab).width + 60);
          const off = Math.min(-80, GROUND - 330 - by); ctx.save(); ctx.translate(X, by - 12); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 3, 0); ctx.lineTo(-w / 3, off + 40); ctx.moveTo(w / 3, 0); ctx.lineTo(w / 3, off + 40); ctx.stroke();
          ctx.translate(0, off); ctx.scale(sc, sc); rr(ctx, -w / 2, -42, w, 84, 14); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); textC(ctx, bs.lab, 0, 16, 44, BROWN, 900, w - 40); ctx.restore(); }
        if (bs.moving && bs.h > 300) dust(ctx, X, GROUND, t - bs.tC, 8, Wd / 2);
      },
      over: () => { if (bs.day == null) return; const k = t - bs.tC; pill(ctx, "HARI " + bs.day, 540, 260, 54, ORANGE, "#FFFFFF", k + .02, true); if (k < .7) burstFx(ctx, 540, 260, k, GOLD, 8, 150); } });
  }, (s, f, i, add) => { (f.bar && f.bar.levels || []).forEach(L => { const t0 = tOf(s, L, .3, i); add(t0, L.h > 300 ? "whoosh" : "pop"); });
    const lp2 = f.loop; if (lp2){ const tA = T(s, lp2.cue, .1, i), tB = T(s, lp2.endCue, .3, i), n = lp2.n || lp2.hs.length; for (let k = 0; k < n; k++) add(tA + k * (tB - tA) / n, k === n - 1 ? "chime" : "pop"); } });

  /* ================= _lilin: motivation candle ================= */
  // f.candle {on, h0, label, levels:[{cue, h}], outCue}, f.alarm {x, y, cue, dur}, f.blanket {on, cue}, f.sore {on, cue}
  reg("lilin", "Cerita: lilin semangat yang meleleh lalu padam", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, cd = f.candle || {}, tO = T(s, cd.outCue, .4, idx);
    let h = cd.h0 ?? 260, prev = h, tc = -9; (cd.levels || []).forEach(L => { const t0 = T(s, L.cue, .3, idx); if (t >= t0){ prev = h; h = L.h; tc = t0; } });
    const hNow = lerp(prev, h, eOut(c01((t - tc) / 1.2)));
    base(ctx, s, t, { env: "home", envOpt: { time: "day" },
      back: () => { const al = f.alarm; if (!al) return; const X = al.x ?? 900, Y = al.y ?? GROUND, k = t - T(s, al.cue, .2, idx), ring = k > 0 && k < (al.dur || 2.6);
        ctx.fillStyle = "#8E4E2E"; rr(ctx, X - 90, Y - 230, 180, 26, 8); ctx.fill(); ol(ctx, 5); ctx.fillRect(X - 70, Y - 205, 20, 205); ctx.fillRect(X + 50, Y - 205, 20, 205); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(X - 70, Y - 205, 20, 205); ctx.strokeRect(X + 50, Y - 205, 20, 205);
        const sh = ring ? Math.sin(t * 60) * 8 : 0, jump = ring ? Math.abs(Math.sin(t * 30)) * 10 : 0; ctx.save(); ctx.translate(X + sh, Y - 230 - 70 - jump); ctx.rotate(ring ? Math.sin(t * 50) * .1 : 0);
        [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 44, -62, 26, Math.PI, 0); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); });
        ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 3);
        ctx.strokeStyle = BROWN; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -38); ctx.moveTo(0, 0); ctx.lineTo(26, 10); ctx.stroke(); ctx.restore();
        if (ring){ for (let i = 0; i < 3; i++){ const q = ((t * 2 + i / 3) % 1); ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(X, Y - 300, 90 + q * 80, -2.4, -.7); ctx.stroke(); ctx.restore(); }
          ctx.save(); ctx.translate(X - 20, Y - 470 + Math.sin(t * 20) * 6); ctx.rotate(-.12); textC(ctx, "KRING!", 0, 0, 58, RED, 900); ctx.restore(); } },
      front: (ctx2, c, sts) => {
        const bl = f.blanket; if (bl){ const k = t - T(s, bl.cue, .3, idx); if (k > 0){ const st = sts[bl.on ?? 0], kk = st.size / 92, q = eOut(c01(k / .7)), top = lerp(st.y, st.y - 40 * kk, q);
          ctx.save(); ctx.beginPath(); ctx.moveTo(st.x - 34 * kk, st.y + 4); ctx.quadraticCurveTo(st.x - 40 * kk, top, st.x - 10 * kk, top - 4 * kk); ctx.quadraticCurveTo(st.x + 10 * kk, top - 8 * kk + Math.sin(t * 3) * 4, st.x + 34 * kk, top); ctx.quadraticCurveTo(st.x + 44 * kk, st.y - 20 * kk, st.x + 40 * kk, st.y + 4); ctx.closePath();
            ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 6); ctx.clip(); ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 10; for (let i = -6; i < 8; i++){ ctx.beginPath(); ctx.moveTo(st.x + i * 60, st.y - 600); ctx.lineTo(st.x + i * 60 + 300, st.y + 50); ctx.stroke(); } ctx.restore(); } }
        const so = f.sore; if (so){ const k = t - T(s, so.cue, .3, idx); if (k > 0 && k < 2.6){ const st = sts[so.on ?? 0]; [-6, 6].forEach((dx, i) => { const p = lp(st, dx, -14); ctx.save(); ctx.globalAlpha = .6 + .4 * Math.sin(t * 12 + i); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.lineCap = "round";
          for (let r = 0; r < 3; r++){ const a = -Math.PI / 2 + (r - 1) * .7; ctx.beginPath(); ctx.moveTo(p[0] + Math.cos(a) * 40, p[1] + Math.sin(a) * 40); ctx.lineTo(p[0] + Math.cos(a) * (64 + 8 * Math.sin(t * 10)), p[1] + Math.sin(a) * (64 + 8 * Math.sin(t * 10))); ctx.stroke(); } ctx.restore(); }); } }
        // candle above the head
        const st = sts[cd.on ?? 0]; if (!st) return; const hb = headOf(st), x = hb[0] + Math.sin(t * 1.4) * 10, base0 = hb[1] - hb[2] - 70 + Math.sin(t * 2) * 8, W = 64, hh = Math.max(16, hNow);
        ctx.save(); ctx.fillStyle = "#C9CED6"; ctx.beginPath(); ctx.ellipse(x, base0, 66, 16, 0, 0, TAU); ctx.fill(); ol(ctx, 5);
        rr(ctx, x - W / 2, base0 - hh, W, hh, 10); ctx.fillStyle = "#FFF1D6"; ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = "#FFF1D6"; for (let d = 0; d < 3; d++){ const dl = 20 + 30 * ((d * .37 + (cd.h0 ?? 260) - hh) / 100 % 1); ctx.beginPath(); ctx.ellipse(x - 20 + d * 20, base0 - hh + dl / 2, 8, dl / 2 + 6, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); }
        if (cd.label) { ctx.save(); ctx.translate(x, base0 - hh / 2); ctx.rotate(-Math.PI / 2); if (hh > 120) textC(ctx, cd.label, 0, 10, 26, ORANGE, 900, hh - 24); ctx.restore(); }
        ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, base0 - hh); ctx.lineTo(x, base0 - hh - 18); ctx.stroke();
        const k = t - tO, fs = (k > 0 ? c01(1 - k / .35) : 1) * lerp(.55, 1.1, c01(hh / (cd.h0 ?? 260)));
        if (fs > 0){ const fy = base0 - hh - 18, fl = Math.sin(t * 17) * .08; glowAt(ctx, x, fy - 40, 190 * fs, "#FFB347", .55); ctx.save(); ctx.translate(x, fy); ctx.rotate(fl); ctx.scale(fs, fs * (1 + Math.sin(t * 13) * .06));
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-36, -20, -24, -70, 0, -110); ctx.bezierCurveTo(24, -70, 36, -20, 0, 0); ctx.fillStyle = "#FF9A2E"; ctx.fill(); ol(ctx, 4);
          ctx.beginPath(); ctx.moveTo(0, -6); ctx.bezierCurveTo(-16, -20, -10, -50, 0, -70); ctx.bezierCurveTo(10, -50, 16, -20, 0, -6); ctx.fillStyle = "#FFE27A"; ctx.fill(); ctx.restore(); }
        if (k > 0 && k < 3){ for (let i = 0; i < 5; i++){ const q = c01((k - i * .12) / 2.2); if (q <= 0) continue; ctx.save(); ctx.globalAlpha = (1 - q) * .7; ctx.strokeStyle = "#9A9A9A"; ctx.lineWidth = 14 - i * 2; ctx.lineCap = "round"; ctx.beginPath();
          const yy = base0 - hh - 30 - q * 320; ctx.moveTo(x + Math.sin(q * 8 + i) * 30, yy); ctx.quadraticCurveTo(x + Math.sin(q * 8 + i + 1) * 60, yy - 40, x + Math.sin(q * 8 + i + 2) * 30, yy - 80); ctx.stroke(); ctx.restore(); } }
        ctx.restore();
        if (cd.tag && k < 0){ pill(ctx, cd.tag, x + 120, base0 - hh / 2, 28, ORANGE, "#FFFFFF", t - .3); }
      },
      post: () => { const k = t - tO; if (k > 0){ ctx.save(); ctx.globalAlpha = .28 * c01(k / .8); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "#56607A"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } } });
  }, (s, f, i, add) => { const cd = f.candle || {}; (cd.levels || []).forEach(L => add(T(s, L.cue, .3, i), "pop")); if (cd.outCue) add(T(s, cd.outCue, .4, i), "whoosh"); if (f.alarm) add(T(s, f.alarm.cue, .2, i), "ping"); if (f.blanket) add(T(s, f.blanket.cue, .3, i), "whoosh"); });

  /* ================= _bagan: SOP flowchart poster rolls down, a red marker draws a shortcut ================= */
  // f.chart {x, top, w, cue|at (roll down), title, steps:[txt], page:{cue, text}, mark:{cue, from, to, label}}
  reg("bagan", "Cerita: bagan alur SOP turun dari langit-langit + spidol jalan pintas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, ch = f.chart || {}, X = ch.x ?? 720, TOP = ch.top ?? 520, W = ch.w ?? 500, steps = ch.steps || [], n = steps.length;
    const tD = tOf(s, ch, .05, idx), mk = ch.mark || {}, tM = T(s, mk.cue, .3, idx), rowH = 112, Hh = 150 + n * rowH;
    const boxY = i => TOP + 130 + i * rowH;
    base(ctx, s, t, { env: "office", spots: { chart: [X, TOP + Hh / 2, 1.0], mark: () => [X + 60, (boxY(mk.from ?? 1) + boxY(mk.to ?? 3)) / 2, 1.3] },
      back: () => { const q = eOut(c01((t - tD) / .9)); if (t < tD) return; const h = Hh * q, sw = Math.sin(t * 1.7) * .006;
        ctx.save(); ctx.translate(X, TOP); ctx.rotate(sw); ctx.translate(-X, -TOP);
        ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.fillRect(X - W / 2 + 16, TOP + 14, W, h);
        ctx.save(); ctx.beginPath(); ctx.rect(X - W / 2 - 10, TOP, W + 20, h); ctx.clip();
        ctx.fillStyle = PAPER; ctx.fillRect(X - W / 2, TOP, W, Hh); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(X - W / 2, TOP, W, Hh);
        ctx.fillStyle = ORANGE; ctx.fillRect(X - W / 2, TOP, W, 96); ctx.strokeRect(X - W / 2, TOP, W, 96); textC(ctx, ch.title || "SOP PEMESANAN", X, TOP + 64, 42, "#FFFFFF", 900, W - 60);
        steps.forEach((st, i) => { const y = boxY(i) + 30, k = t - tD - .5 - i * .12; if (k < 0) return; const pulse = i === mk.skip && t > tM ? 1 + .04 * Math.sin(t * 8) : 1;
          ctx.save(); ctx.translate(X - 30, y); ctx.scale(pulse, pulse); rr(ctx, -W / 2 + 50, -38, W - 140, 76, 14); ctx.fillStyle = i === mk.skip && t > tM ? "#FCE3DE" : CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
          ctx.beginPath(); ctx.arc(-W / 2 + 92, 0, 26, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, String(i + 1), -W / 2 + 92, 12, 32, "#FFFFFF", 900);
          font(ctx, 800, 30, FAM); fitFont(ctx, st, W - 240, 30, 800); ctx.fillStyle = BROWN; ctx.fillText(st, -W / 2 + 132, 11); ctx.restore();
          if (i < n - 1){ ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(X - 30, y + 40); ctx.lineTo(X - 30, y + rowH - 40); ctx.stroke(); ctx.fillStyle = BROWN; ctx.beginPath(); ctx.moveTo(X - 42, y + rowH - 50); ctx.lineTo(X - 18, y + rowH - 50); ctx.lineTo(X - 30, y + rowH - 36); ctx.closePath(); ctx.fill(); } });
        // red marker shortcut arrow
        if (t > tM){ const a = mk.from ?? 1, b = mk.to ?? 3, ya = boxY(a) + 30, yb = boxY(b) + 30, xr = X + W / 2 - 40, q2 = c01((t - tM) / .9), N = 30;
          ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); let last = null;
          for (let i = 0; i <= N * q2; i++){ const u = i / N, x = lerp(xr - 60, xr - 60, u) + Math.sin(u * Math.PI) * 120, y = lerp(ya, yb, u); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); last = [x, y, u]; } ctx.stroke();
          if (q2 >= 1){ ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(xr - 90, yb - 6); ctx.lineTo(xr - 50, yb - 34); ctx.lineTo(xr - 46, yb + 18); ctx.closePath(); ctx.fill(); }
          if (q2 < 1 && last){ ctx.save(); ctx.translate(last[0], last[1]); ctx.rotate(-.7); rr(ctx, -14, -120, 28, 120, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); rr(ctx, -14, -150, 28, 36, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.restore(); } }
        ctx.restore();
        // roller bar
        ctx.fillStyle = "#8E4E2E"; rr(ctx, X - W / 2 - 30, TOP - 22, W + 60, 30, 14); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X - W / 2 + 20, TOP - 22); ctx.lineTo(X - W / 2 + 20, TOP - 400); ctx.moveTo(X + W / 2 - 20, TOP - 22); ctx.lineTo(X + W / 2 - 20, TOP - 400); ctx.stroke();
        ctx.fillStyle = "#6B3E26"; rr(ctx, X - W / 2 - 10, TOP + h - 12, W + 20, 26, 12); ctx.fill(); ol(ctx, 5);
        ctx.restore();
        if (t > tM + .9 && mk.label) pill(ctx, mk.label, X + W / 2 - 10, (boxY(mk.from ?? 1) + boxY(mk.to ?? 3)) / 2 + 30, 34, RED, "#FFFFFF", t - tM - .9);
        if (q < 1 && t > tD) dust(ctx, X, TOP + h, (t - tD) % 1, 4, W / 2, "#F3E6D2");
      },
      over: () => { const pg = ch.page; if (!pg) return; const k = t - T(s, pg.cue, .3, idx); if (k > 0) pill(ctx, pg.text, 300, 300, 40, CREAM, BROWN, k, true); } });
  }, (s, f, i, add) => { const ch = f.chart || {}; const tD = tOf(s, ch, .05, i); if (tD < 1e8){ add(tD, "whoosh"); (ch.steps || []).forEach((x, j) => add(tD + .5 + j * .12, "pop")); }
    if (ch.mark) add(T(s, ch.mark.cue, .3, i), "whoosh"); if (ch.page) add(T(s, ch.page.cue, .3, i), "pop"); });

  /* ================= _sungai: SOP stepping stones over a river ================= */
  // f.river {x0, x1}, f.stones [{x, n, pebble, tag, slow}], f.hops [{cue|at, to: index|"bank", big, dur}], f.carry {on, label, throwCue}, f.skip {stone, cue},
  // f.clone {x, cues:[...]}, f.bag {x, cue, label}, f.sbox {x, eatCue, okCue, label}, f.bridge {cue, a, b}, f.checks {cue}, f.slow {cue}, f.hero
  reg("sungai", "Cerita: SOP sebagai batu loncatan di sungai", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, rv = f.river || {}, x0 = rv.x0 ?? 140, x1 = rv.x1 ?? 1280, stones = f.stones || [], hero = f.hero ?? 0, bankX = rv.bankX ?? (x1 + 140);
    const sx = to => to === "bank" ? bankX : to === "start" ? x0 - 90 : (stones[to] || {}).x;
    const hops = (f.hops || []).map((h, j) => Object.assign({ T: tOf(s, h, .2, idx) + (h.dt || 0) }, h)).sort((a, b) => a.T - b.T);
    let curStone = -1; hops.forEach(h => { if (t >= h.T + (h.dur || .45)) curStone = h.to; });
    const visited = new Set(); hops.forEach(h => { if (t >= h.T + (h.dur || .45) && typeof h.to === "number") visited.add(h.to); });
    const tBr = f.bridge ? T(s, f.bridge.cue, .5, idx) : 1e9, tSk = f.skip ? T(s, f.skip.cue, .3, idx) : 1e9, tCh = f.checks ? T(s, f.checks.cue, .2, idx) : 1e9, tSl = f.slow ? T(s, f.slow.cue, .3, idx) : 1e9;
    let carryP = null, SW = null;
    if (f.swing){ const sw = f.swing, A = stones[sw.from], B = stones[sw.to], hs = ((f.toons || [])[hero] || {}).size || 760, kz = hs / 92; if (A && B){ const px = (A.x + B.x) / 2, py = sw.pivotY ?? GROUND - 1000, dx = (A.x - B.x) / 2, dy = GROUND - 76 * kz - py;
      SW = { T: T(s, sw.cue, .3, idx), dur: sw.dur || .9, px, py, a0: Math.atan2(dx, dy), L: Math.hypot(dx, dy) }; } }
    base(ctx, s, t, { env: "park", spots: { mid: [ (x0 + x1) / 2, 1200, .82 ], bank: [bankX + 120, 1180, 1.0], box: () => [(f.sbox || {}).x ?? bankX + 200, 1240, 1.25] },
      prep: (a, j) => { if (j !== hero) return null; const keys = (a.keys || []).slice(); hops.forEach(h => { const d = h.dur || (h.big ? .65 : .45); keys.push({ at: h.T, x: sx(h.to), dur: d }); keys.push({ at: h.T - .1, jump: h.big ? 190 : (h.small ? 40 : 90), jumpDur: d }); });
        if (SW){ const k = (a.size || 760) / 92, n = 16; keys.push({ at: SW.T - .15, pose: "cheer" }); for (let i = 0; i <= n; i++){ const q = i / n, ang = lerp(SW.a0, -SW.a0, eio(q)); keys.push({ at: SW.T + q * SW.dur, x: SW.px + SW.L * Math.sin(ang), y: SW.py + SW.L * Math.cos(ang) + 76 * k - 150 * Math.sin(q * Math.PI), dur: SW.dur / n }); }
          keys.push({ at: SW.T + SW.dur + .02, y: GROUND }); }
        return { a: Object.assign({}, a, { keys }), t }; },
      back: (ctx2, c, sts) => {
        if (SW){ const px = SW.px, py = SW.py; ctx.strokeStyle = "#6B4A2A"; ctx.lineWidth = 34; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(px - 900, py - 200); ctx.quadraticCurveTo(px - 300, py - 40, px + 160, py - 10); ctx.stroke(); ol(ctx, 4);
          [[-60, -40, 90], [60, -30, 80], [0, -80, 100], [160, -40, 70], [-200, -90, 90]].forEach(([dx, dy, r], i) => { ctx.beginPath(); ctx.arc(px + dx + Math.sin(t * 1.5 + i) * 4, py + dy, r, 0, TAU); ctx.fillStyle = i % 2 ? "#3E7D4F" : "#5A9A5E"; ctx.fill(); ol(ctx, 4); });
          let ex, ey; const st = sts[hero], kk = t - SW.T;
          if (kk >= 0 && kk <= SW.dur && st){ const hp = lp(st, 0, -76); ex = hp[0]; ey = hp[1]; }
          else { const after = kk > SW.dur, d = after ? kk - SW.dur : 0, ang = after ? -SW.a0 * Math.cos(d * 3.2) * Math.exp(-d * .7) : SW.a0 * .25 * Math.sin(t * 1.6), Lh = SW.L * .82; ex = px + Lh * Math.sin(ang); ey = py + Lh * Math.cos(ang); }
          ctx.strokeStyle = "#3E7D4F"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo((px + ex) / 2 + 20, (py + ey) / 2, ex, ey); ctx.stroke(); ctx.strokeStyle = "#2B5A36"; ctx.lineWidth = 4; ctx.stroke();
          for (let i = 1; i < 4; i++){ const u = i / 4, lx = lerp(px, ex, u), ly = lerp(py, ey, u); ctx.save(); ctx.translate(lx, ly); ctx.rotate(i % 2 ? .8 : -.8); ctx.beginPath(); ctx.ellipse(14, 0, 18, 8, 0, 0, TAU); ctx.fillStyle = "#5A9A5E"; ctx.fill(); ctx.restore(); }
          if (kk > SW.dur * .3 && kk < SW.dur * .7){ for (let i = 0; i < 6; i++){ const ph = rnd(i) * TAU; ctx.save(); ctx.globalAlpha = .7; ctx.fillStyle = "#BFE8F5"; ctx.beginPath(); ctx.arc(SW.px + Math.cos(ph) * 60 * (kk / SW.dur), GROUND - 30 - Math.abs(Math.sin(ph)) * 120 * (kk / SW.dur), 10, 0, TAU); ctx.fill(); ctx.restore(); } } }
        // water
        ctx.save(); ctx.beginPath(); ctx.moveTo(x0, GROUND - 14); for (let x = x0; x <= x1; x += 40) ctx.lineTo(x, GROUND - 14 + Math.sin(x * .03 + t * 3) * 6); ctx.lineTo(x1, GROUND + 900); ctx.lineTo(x0, GROUND + 900); ctx.closePath();
        const g = ctx.createLinearGradient(0, GROUND - 20, 0, GROUND + 300); g.addColorStop(0, "#6FC3DF"); g.addColorStop(1, "#2F7FA8"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 5); ctx.clip();
        ctx.strokeStyle = hexA("#FFFFFF", .55); ctx.lineWidth = 5; ctx.lineCap = "round"; for (let i = 0; i < 14; i++){ const xx = x0 + ((i * 97 + t * 90) % (x1 - x0)), yy = GROUND + 20 + (i % 4) * 34; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.quadraticCurveTo(xx + 20, yy - 8, xx + 44, yy); ctx.stroke(); }
        ctx.restore();
        // banks edges
        [[x0, -1], [x1, 1]].forEach(([bx, d]) => { ctx.fillStyle = "#8BBE5B"; ctx.beginPath(); ctx.ellipse(bx - d * 10, GROUND - 6, 40, 18, 0, 0, TAU); ctx.fill(); });
        // bridge plank over slow pebbles
        if (f.bridge && t > tBr){ const A = stones[f.bridge.a], B = stones[f.bridge.b], q = eBack(c01((t - tBr) / .6)); if (A && B){ const xa = A.x, xb = lerp(A.x, B.x, q); ctx.fillStyle = "#C47A48"; rr(ctx, xa - 20, GROUND - 40, xb - xa + 40, 30, 8); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 3; for (let xx = xa + 40; xx < xb; xx += 60){ ctx.beginPath(); ctx.moveTo(xx, GROUND - 40); ctx.lineTo(xx, GROUND - 10); ctx.stroke(); }
          if (q >= 1) pill(ctx, f.bridge.label || "LEBIH CEPAT", (xa + xb) / 2, GROUND - 120, 30, GREEN, "#FFFFFF", t - tBr - .6); } }
        // stones
        stones.forEach((st, j) => { const bob = Math.sin(t * 2.2 + j) * 3, x = st.x, r = st.pebble ? 34 : 70, landed = curStone === j && t - (hops.filter(h => h.to === j).pop() || { T: -9 }).T < .9;
          const skipped = f.skip && f.skip.stone === j && t > tSk; const sq = landed ? 1 - .1 * Math.sin((t * 8) % Math.PI) : 1;
          if (f.bridge && t > tBr + .3 && st.pebble) return;
          ctx.save(); ctx.translate(x, GROUND - 6 + bob); ctx.scale(1 / sq, sq); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .36, 0, 0, TAU); ctx.fillStyle = skipped ? (Math.sin(t * 10) > 0 ? "#E07A6E" : "#B8B0A4") : "#B8B0A4"; ctx.fill(); ol(ctx, 5);
          ctx.beginPath(); ctx.ellipse(-r * .2, -r * .08, r * .5, r * .14, 0, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fill();
          if (st.n != null) textC(ctx, String(st.n), 0, 12, 40, OUT, 900); ctx.restore();
          if (st.tag){ const ty = GROUND - 260; ctx.strokeStyle = BROWN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 50, GROUND - 20); ctx.lineTo(x + 50, ty + 30); ctx.stroke(); pill(ctx, st.tag, x + 50, ty, 28, skipped ? RED : CREAM, skipped ? "#FFFFFF" : BROWN, 1); }
          if (skipped && t - tSk < 2.5) stampBox(ctx, "DILEWATI!", x, GROUND - 380, t - tSk, RED, 40, -.08);
          if ((visited.has(j) && f.stepChecks) || (t > tCh + j * .2 && !st.pebble && f.checks)) checkMark(ctx, x, GROUND - 90, 30, f.stepChecks && visited.has(j) ? 1 : t - tCh - j * .2);
          if (st.slow && t > tSl && !(t > tBr)){ const k = t - tSl; ctx.save(); ctx.translate(x - 10, GROUND - 22 + bob); ctx.scale(popK(k, .4), popK(k, .4)); ctx.fillStyle = "#E8C98A"; ctx.beginPath(); ctx.ellipse(-6, 0, 36, 12, 0, 0, TAU); ctx.fill(); ol(ctx, 4);
            ctx.beginPath(); ctx.arc(0, -22, 22, 0, TAU); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 3; ctx.beginPath(); for (let a = 0; a < 9; a += .4) ctx.lineTo(Math.cos(a) * a * 2.2, -22 + Math.sin(a) * a * 2.2); ctx.stroke(); ctx.restore();
            pill(ctx, "LAMBAT?", x, GROUND - 160, 28, GOLD, BROWN, k - .2); } });
        // clones on the far bank
        const cl = f.clone; if (cl){ const cx = cl.x ?? bankX + 160; const ts = (cl.cues || []).map(c2 => T(s, c2, .3, idx)); const lv = ts.filter(z => t >= z).length; if (lv > 0){ const n = Math.pow(2, lv - 1) * (cl.base || 2); const kL = t - ts[lv - 1];
          for (let i = 0; i < n; i++){ const col = i % 4, row = Math.floor(i / 4), bx = cx + (col - 1.5) * 150 + (row % 2) * 24, by = GROUND - row * 128, pk = c01((kL - (i >= n / 2 ? .1 : 0)) / .35), sc = i < n / 2 && lv > 1 ? 1 : eBack(pk);
            if (sc <= 0) continue; ctx.save(); ctx.translate(bx, by); ctx.scale(sc, sc); box3(ctx, 0, 0, 140, 124, "#D9A066", cl.label || "x2"); ctx.restore(); }
          if (kL < .6) burstFx(ctx, cx, GROUND - 150, kL, GOLD, 8, 200); } }
        // budget sack
        const bg = f.bag; if (bg){ const tB = T(s, bg.cue, .3, idx), k = t - tB, X = bg.x ?? bankX + 520, inK = t - (bg.inCue ? T(s, bg.inCue, .3, idx) : 0); if (inK > 0){ const sc = popK(inK, .4), torn = k > 0, sw = torn ? Math.sin(k * 30) * .05 * Math.max(0, 1 - k) : Math.sin(t * 2) * .02;
          ctx.save(); ctx.translate(X, GROUND); ctx.rotate(sw); ctx.scale(sc, sc * (torn ? lerp(1, .55, c01(k / .8)) : 1)); ctx.beginPath(); ctx.moveTo(-110, 0); ctx.quadraticCurveTo(-150, -150, -60, -230); ctx.lineTo(60, -230); ctx.quadraticCurveTo(150, -150, 110, 0); ctx.closePath(); ctx.fillStyle = "#C9A46A"; ctx.fill(); ol(ctx, 6);
          ctx.fillStyle = BROWN; rr(ctx, -70, -262, 140, 34, 12); ctx.fill(); ol(ctx, 4); textC(ctx, bg.label || "ANGGARAN", 0, -100, 34, BROWN, 900, 200);
          if (torn){ ctx.fillStyle = OUT; ctx.beginPath(); ctx.moveTo(-30, -20); ctx.lineTo(-10, -60); ctx.lineTo(6, -24); ctx.lineTo(26, -70); ctx.lineTo(40, -10); ctx.closePath(); ctx.fill(); } ctx.restore();
          if (torn){ for (let i = 0; i < 10; i++){ const kk = k - i * .05; if (kk < 0 || kk > 1.6) continue; const vx = (rnd(i) - .5) * 700, vy = -500 - rnd(i + 3) * 400; coin(ctx, X + vx * kk, Math.min(GROUND - 20, GROUND - 60 + vy * kk + 1400 * kk * kk), 24, t * 9 + i); } } } }
        // living suggestion box
        const sb = f.sbox; if (sb){ const X = sb.x ?? bankX + 200, tE = T(s, sb.eatCue, .3, idx), tK = T(s, sb.okCue, .3, idx), kE = t - tE, kK = t - tK, inK = t - (sb.inAt ?? 0);
          if (inK > 0){ const chew = kE > .6 && kE < 1.8 ? Math.abs(Math.sin(kE * 14)) : 0, hop = kK > 0 && kK < 1 ? Math.abs(Math.sin(kK * 9)) * 30 * (1 - kK) : 0, sc = popK(inK, .4);
            ctx.save(); ctx.translate(X, GROUND - hop); ctx.scale(sc * (1 + chew * .06), sc * (1 - chew * .06)); ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(0, 4 + hop, 120, 16, 0, 0, TAU); ctx.fill();
            ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-14, -150, 28, 150); rr(ctx, -130, -380, 260, 240, 20); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
            rr(ctx, -100, -350, 200, 50, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, sb.label || "USULAN", 0, -313, 30, BROWN, 900, 180);
            const happy = kK > 0; [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * 50, -255); if (happy){ ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 8, 18, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
              else { ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(-d * 4 + Math.sin(t * 2) * 4, 3, 11, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); } ctx.restore(); });
            const mo = kE > .6 && kE < 1.8 ? 10 + chew * 26 : (happy ? 22 : 8); rr(ctx, -70, -200 - mo / 2, 140, mo, mo / 2); ctx.fillStyle = OUT; ctx.fill();
            if (happy){ ctx.fillStyle = "#FF8A7A"; ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(-95, -215, 16, 0, TAU); ctx.arc(95, -215, 16, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
            ctx.restore();
            if (happy && kK < 2.8) for (let i = 0; i < 5; i++){ const q = ((kK * .8 + i / 5) % 1); ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.translate(X + (i - 2) * 60, GROUND - 420 - q * 160); ctx.fillStyle = "#FF8A7A"; ctx.beginPath(); ctx.moveTo(0, 10); ctx.bezierCurveTo(-24, -8, -12, -26, 0, -12); ctx.bezierCurveTo(12, -26, 24, -8, 0, 10); ctx.fill(); ctx.restore(); }
            // the note flies in
            if (kE > 0 && kE < .7 && carryP){ const q = kE / .7; ctx.save(); ctx.translate(lerp(carryP[0], X, q), lerp(carryP[1], GROUND - 200, q) - Math.sin(q * Math.PI) * 220); ctx.rotate(q * 9); ctx.fillStyle = "#FFF6B8"; ctx.fillRect(-36, -26, 72, 52); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-36, -26, 72, 52); ctx.restore(); } } }
      },
      over1: (ctx2, c, sts, j) => { if (j !== hero) return; const st = sts[j]; carryP = lp(st, 24, -46); const cr = f.carry; if (!cr) return; const tTh = T(s, cr.throwCue, .3, idx), k = t - tTh;
        let x = carryP[0], y = carryP[1] - 30, sc = 1; if (k > 0){ const q = c01(k / .7); x = lerp(carryP[0], carryP[0] + 1100, eIn(q)); y = carryP[1] - 30 - Math.sin(q * Math.PI) * 200; sc = 1 - q * .4;
          if (q < 1){ ctx.save(); ctx.strokeStyle = hexA(CREAM, .8); ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(x - 90 - i * 30, y - 80 + i * 30); ctx.lineTo(x - 200 - i * 30, y - 80 + i * 30); ctx.stroke(); } ctx.restore(); } }
        if (k < .7){ ctx.save(); ctx.translate(x, y + 60); ctx.rotate(k > 0 ? k * 6 : Math.sin(t * 3) * .03); ctx.scale(sc, sc); box3(ctx, 0, 0, 150, 120, "#D9A066", cr.label || "PESANAN"); ctx.restore(); } },
      over: () => { const cr = f.carry; if (cr){ const k = t - T(s, cr.throwCue, .3, idx) - .5; if (k > 0 && k < 2.4) stampBox(ctx, cr.stamp || "TERKIRIM!", 700, 330, k, GREEN, 54, -.08); }
        const cl = f.clone; if (cl && cl.stampCue){ const k = t - T(s, cl.stampCue, .3, idx); if (k > 0) stampBox(ctx, cl.stamp || "GUDANG PENUH", 540, 380, k, RED, 52, .06); }
        const sb = f.sbox; if (sb){ const k = t - T(s, sb.okCue, .3, idx); if (k > 0) stampBox(ctx, sb.stamp || "DISETUJUI", 540, 330, k, GREEN, 60, -.08); } } });
  }, (s, f, i, add) => { (f.hops || []).forEach(h => add(tOf(s, h, .2, i) + (h.dt || 0) + (h.dur || (h.big ? .65 : .45)) - .05, "pop")); if (f.skip) add(T(s, f.skip.cue, .3, i), "ping");
    if (f.carry){ const t0 = T(s, f.carry.throwCue, .3, i); add(t0, "whoosh"); add(t0 + .5, "chime"); } if (f.clone){ (f.clone.cues || []).forEach(c2 => add(T(s, c2, .3, i), "pop")); if (f.clone.stampCue) add(T(s, f.clone.stampCue, .3, i), "ping"); }
    if (f.bag){ add(T(s, f.bag.cue, .3, i), "pop"); add(T(s, f.bag.cue, .3, i) + .05, "ping"); } if (f.sbox){ add(T(s, f.sbox.eatCue, .3, i), "whoosh"); add(T(s, f.sbox.okCue, .3, i), "chime"); }
    if (f.swing){ const t0 = T(s, f.swing.cue, .3, i); add(t0, "whoosh"); add(t0 + (f.swing.dur || .9) * .5, "whoosh"); add(t0 + (f.swing.dur || .9), "pop"); }
    if (f.bridge) add(T(s, f.bridge.cue, .5, i), "pop"); if (f.checks) add(T(s, f.checks.cue, .2, i), "chime"); if (f.slow) add(T(s, f.slow.cue, .3, i), "ping"); });
})();
