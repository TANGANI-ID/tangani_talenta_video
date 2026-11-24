/* Scene pack j2611221020181: MODE CERITA story scenes for SC29, MS29, SB30, SP30, RN30. Layout prefix j2611221020181_.
   Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front)
   plus its own set piece (camera keys may use on:"<spot>" for named spots):
     _rantai    a ball and chain locks onto the toon's ankle: drops from the sky, drags behind, gets bill/fine stickers and swells, breaks free
                f.chain {on, attachCue, label, swap:{cue, from}, stickers:[{cue, text, red}], grow:[{cue, s}], payCue, r}, f.btn {cue, pressCue, label, x, y}, f.parcel {cue, x}
     _rapor     a big "RAPOR KREDIT" ring book pops in and its cover flips open: credit history months on the right page; a red stamp slams on the late month; a scooter with a "?" tag
                f.book {x, y, w, cue|at, title, sub, rows:[{label, ok}], stampCue, stampText}, f.motor {cue, x, qCue}
     _gelembung soap bubbles carry a child's little stories (pictures); they bounce off the phone and pop, or float up and merge into one big glowing story bubble
                f.bub {from, to, mode: pantul|alir|sepi, list:[{cue, pic, s}], phoneOn, catchCue, darkCue}, f.day [{cue, text}]
     _benda     sitcom desk: living desk objects with faces buzz, hop and talk, then hop to the drawer / walk to the kitchen / pop up in front
                f.objs [{kind: phone|chips|bottle|todo|plant|mug, x, cue, wake, say:[{cue, text}], go:{cue, to: drawer|right|left|x}, tempt:[cue..]}], f.desk {y, drawerCue}, f.count {cue, to}
     _jangkau   imagination world: a glowing reach ring around the toon; objects inside get grabbed, outside ones stay far; they swap places
                f.reach {r, cue, swapCue, items:[{kind, side: in|out, swap: in|out, label}], grabCue}
     _laporan   a big report page builds from typed blocks; wipe = eraser sweeps it back to zero (week counter); template mode = only numbers fill
                f.doc {x, y, mode: manual|template, blocks:[{cue, label}], wipeCue, week:{cue, n}, fill:[{cue}], doneCue, timer:{cue, text}}
     _roda      a giant hamster wheel: the toon runs inside, week flags flip, sweat, then the wheel stops and the toon steps out
                f.wheel {x, label, runCue, stopCue, weeks:[{cue, text}]}
     _cetak     kitchen counter: dough sheet, a TEMPLATE cookie cutter stamps report-shaped cookies; each cookie gets its own topping number
                f.cutter {label, cue, stamps:[{cue}], fillCue}
     _rapat     meeting table (side view), seated toons, idea bulbs pop over heads, nods; table props
                f.table {x, w}, f.bulbs [{cue, on, outCue}], f.leaveCue
     _kentang   a steaming hot potato task is tossed back and forth over the heads; it lands in a NANTI box, cools, sprouts and gathers cobwebs
                f.potato {label, tosses:[{cue, to}], dropCue, webCue}
     _mesin     decision machine: a lever is pulled, three reels SIAPA | APA | KAPAN spin and lock, a ticket prints and flies to a toon
                f.machine {x, y, pulls:[{cue, who, what, when, to}], doneCue} */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, G, TAU } = TT;
  const PX = "j2611221020181_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", GROUND = 1640, TEAL = "#2F6F73", SKY = "#9FD3E8";
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const eIn = x => x * x * x;
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .3, i) : 1e9;
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const pop = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .35), 0, 1));
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.stroke(); };
  const ico = (ctx, name, cx, cy, size, col, lw) => icon(ctx, name, cx - size / 2, cy - size / 2, size, col, lw || 2.4);
  function fitFont(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 16)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) size = fitFont(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; return size; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function dust(ctx, x, y, k, n, s){ if (k < 0 || k > .8) return; n = n || 7; s = s || 1; ctx.save(); ctx.globalAlpha *= .7 * (1 - k / .8);
    for (let i = 0; i < n; i++){ const d = (i / (n - 1) - .5) * 2, r = (18 + rnd(i + 4) * 22) * s * (.6 + k), xx = x + d * (60 + k * 160) * s, yy = y - 10 - Math.abs(d) * 10 - k * 40 * s;
      ctx.beginPath(); ctx.arc(xx, yy, r, 0, TAU); ctx.fillStyle = "#EADBC6"; ctx.fill(); } ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .94); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  // cartoon face for living objects: centre (x, y), eye spacing r; mood: smile|grin|O|frown|wavy|sleep|wink|sly
  function oface(ctx, x, y, r, mood, t, look, seed){
    const blink = ((t + (seed || 0) * 1.7) % 3.1) < .12 || mood === "sleep", lx = (look ? look[0] : 0) * r * .12, ly = (look ? look[1] : 0) * r * .12;
    ctx.save(); ctx.translate(x, y); ctx.lineCap = "round"; ctx.lineJoin = "round";
    [-1, 1].forEach(d => { const ex = d * r * .42;
      if (blink || (mood === "wink" && d > 0)){ ctx.strokeStyle = OUT; ctx.lineWidth = r * .09; ctx.beginPath(); ctx.arc(ex, -r * .05, r * .16, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); return; }
      ctx.beginPath(); ctx.ellipse(ex, -r * .08, r * .2, r * .26, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, r * .07);
      ctx.beginPath(); ctx.arc(ex + lx, -r * .04 + ly, r * .11, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
      ctx.beginPath(); ctx.arc(ex + lx + r * .04, -r * .09 + ly, r * .04, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill();
      if (mood === "sly" || mood === "frown"){ ctx.strokeStyle = OUT; ctx.lineWidth = r * .08; ctx.beginPath(); ctx.moveTo(ex - r * .22, -r * .42 + (mood === "sly" ? d * r * .06 : -d * r * .06)); ctx.lineTo(ex + r * .22, -r * .42 - (mood === "sly" ? d * r * .06 : -d * r * .06)); ctx.stroke(); } });
    ctx.strokeStyle = OUT; ctx.lineWidth = r * .08; const my = r * .36;
    if (mood === "grin" || mood === "sly"){ ctx.beginPath(); ctx.moveTo(-r * .3, my - r * .05); ctx.quadraticCurveTo(0, my + r * .32, r * .3, my - r * .05); ctx.closePath(); ctx.fillStyle = "#7A2E1E"; ctx.fill(); ctx.stroke(); }
    else if (mood === "O"){ ctx.beginPath(); ctx.ellipse(0, my + r * .05, r * .12, r * .16 + Math.sin(t * 9) * r * .02, 0, 0, TAU); ctx.fillStyle = "#7A2E1E"; ctx.fill(); ctx.stroke(); }
    else if (mood === "frown"){ ctx.beginPath(); ctx.arc(0, my + r * .2, r * .2, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
    else if (mood === "wavy"){ ctx.beginPath(); ctx.moveTo(-r * .22, my); ctx.quadraticCurveTo(-r * .11, my - r * .08, 0, my); ctx.quadraticCurveTo(r * .11, my + r * .08, r * .22, my); ctx.stroke(); }
    else if (mood === "sleep"){ ctx.beginPath(); ctx.moveTo(-r * .1, my); ctx.lineTo(r * .1, my); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(0, my - r * .1, r * .22, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); }
    if (mood !== "frown" && mood !== "sleep"){ ctx.fillStyle = hexA("#F08C7A", .45); [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * r * .62, r * .22, r * .12, r * .07, 0, 0, TAU); ctx.fill(); }); }
    ctx.restore(); }
  function zzz(ctx, x, y, t, s){ s = s || 1; for (let k = 0; k < 3; k++){ const q = ((t * .5 + k / 3) % 1); ctx.save(); ctx.globalAlpha *= Math.sin(q * Math.PI); font(ctx, 900, (26 + k * 6) * s, FAM); ctx.fillStyle = CREAM; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeText("z", x + q * 50 * s, y - q * 90 * s); ctx.fillText("z", x + q * 50 * s, y - q * 90 * s); ctx.restore(); } }
  function speedLines(ctx, x, y, dir, t, n, L){ ctx.save(); ctx.strokeStyle = hexA(CREAM, .8); ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < (n || 4); i++){ const yy = y + (i - 1.5) * 26, off = (t * 900 + i * 37) % 60; ctx.beginPath(); ctx.moveTo(x - dir * (20 + off), yy); ctx.lineTo(x - dir * (20 + off + (L || 70)), yy); ctx.stroke(); } ctx.restore(); }
  // toon-local point (units of size/92, y up from the feet) -> world
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = st => lp(st, 20, -47);

  /* ---------- shared base: same data as the generic "cerita" layout + hooks ---------- */
  // H: {env, envOpt, spots, cam, prep(a, j) -> {a, t}, envDraw, back/mid/front(ctx, c, sts, R), under/over1(ctx, c, sts, j, R), midZ, after, post (screen, before grade), over (screen, after grade)}
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const PP = toons.map((a, j) => { const r = H.prep ? H.prep(a, j) : null; return r || { a, t }; });
    const sts = PP.map(p => toonState(p.a, s, p.t));
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const co = Object.assign({ resolve }, f.camOpt || {}); if (H.shake) co.shake = (co.shake || []).concat(H.shake);
    const c = cam(s, t, H.cam || f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], co);
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    if (H.envDraw) H.envDraw(ctx, c, E, eo); else env(ctx, E, t, c, eo);
    const R = { c, t };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => { if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R)); R[j] = toon(ctx, c, PP[j].a, s, PP[j].t, { st: sts[j] }); if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (H.after) H.after(ctx, c, sts, R);
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    if (H.over) TT.CS.ov.push(() => H.over(ctx, c, sts, R));
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
  const S = (name, label, draw, sfx) => TT.scene(PX + name, label, draw, (s, f, i, add) => { sfxBase(s, f, i, add); if (sfx) sfx(s, f, i, add); });

  /* ================= _rantai: ball and chain of debt ================= */
  function sneaker(ctx, x, y, s, col, rot){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-70, -48); ctx.quadraticCurveTo(-60, -62, -40, -58); ctx.lineTo(-8, -40); ctx.quadraticCurveTo(40, -34, 66, -14); ctx.quadraticCurveTo(76, -4, 72, 0); ctx.closePath();
    ctx.fillStyle = col || ORANGE; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#FFFFFF"; rr(ctx, -76, -6, 152, 18, 8); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = CREAM; ctx.lineWidth = 5; ctx.beginPath(); for (let k = 0; k < 3; k++){ ctx.moveTo(-34 + k * 12, -50 + k * 4); ctx.lineTo(-22 + k * 12, -40 + k * 4); } ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-50, -20); ctx.quadraticCurveTo(-10, -30, 30, -16); ctx.stroke();
    ctx.restore(); }
  function ironBall(ctx, x, y, r, rot, label, flip, t){
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.ellipse(0, r * .98, r * .95, r * .18, 0, 0, TAU); ctx.fill();
    const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r); g.addColorStop(0, "#77716B"); g.addColorStop(.55, "#45403C"); g.addColorStop(1, "#24201E");
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = g; ctx.fill(); ol(ctx, Math.max(4, r * .07));
    ctx.save(); ctx.rotate(rot); ctx.fillStyle = "rgba(255,255,255,.12)"; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.arc(Math.cos(k * 1.7) * r * .55, Math.sin(k * 1.7) * r * .55, r * .08, 0, TAU); ctx.fill(); } ctx.restore();
    ctx.beginPath(); ctx.ellipse(-r * .38, -r * .42, r * .22, r * .12, -.6, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fill();
    if (label){ const fy = flip == null ? 1 : Math.abs(Math.cos(flip * Math.PI)); ctx.save(); ctx.translate(0, r * .3); ctx.scale(1, Math.max(.02, fy)); const size = fitFont(ctx, label, r * 1.55, r * .42, 900); const w = Math.min(r * 1.9, ctx.measureText(label).width + size * .8), h = size * 1.35;
      rr(ctx, -w / 2, -h / 2, w, h, h * .3); ctx.fillStyle = label === label.toUpperCase() && /UTANG|DENDA/.test(label) ? RED : CREAM; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = /UTANG|DENDA/.test(label) ? "#FFFFFF" : BROWN; ctx.textAlign = "center"; ctx.fillText(label, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
    ctx.restore(); }
  function chainLinks(ctx, x0, y0, x1, y1, sag, n, lw, broken){
    for (let i = 0; i <= n; i++){ const q = i / n, x = lerp(x0, x1, q), y = lerp(y0, y1, q) + Math.sin(q * Math.PI) * sag, q2 = Math.min(1, q + .02);
      const a = Math.atan2((lerp(y0, y1, q2) + Math.sin(q2 * Math.PI) * sag) - y, lerp(x0, x1, q2) - x + .001);
      let bx = x, by = y, ba = a; if (broken){ const b = broken(i); bx += b[0]; by += b[1]; ba += b[2]; }
      ctx.save(); ctx.translate(bx, by); ctx.rotate(ba + (i % 2 ? Math.PI / 2 * .0 : 0)); ctx.beginPath(); ctx.ellipse(0, 0, lw * 1.5, i % 2 ? lw * .45 : lw * .85, 0, 0, TAU);
      ctx.strokeStyle = OUT; ctx.lineWidth = lw * .75; ctx.stroke(); ctx.strokeStyle = i % 2 ? "#8A847E" : "#A7A19A"; ctx.lineWidth = lw * .42; ctx.stroke(); ctx.restore(); } }
  S("rantai", "Cerita: bola dan rantai utang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, ch = f.chain || {}, hj = ch.on ?? 0, toons = f.toons || [];
    const tA = ch.attachCue ? T(s, ch.attachCue, .3, idx) + (ch.attachDelay || 0) : (ch.attachAt ?? -9), tPay = T(s, ch.payCue, .4, idx), tSw = ch.swap ? T(s, ch.swap.cue, .3, idx) : 1e9;
    const stk = (ch.stickers || []).map((k, j) => Object.assign({ T: T(s, k.cue, .3 + j * .05, idx), j }, k));
    const grows = (ch.grow || []).map(k => Object.assign({ T: T(s, k.cue, .3, idx) }, k)).sort((a, b) => a.T - b.T);
    let gs = ch.s0 || 1, gPrev = gs, gT = -9; grows.forEach(g => { if (t >= g.T){ gPrev = gs; gs = g.s; gT = g.T; } });
    const sNow = lerp(gPrev, gs, eBack(clamp((t - gT) / .5, 0, 1)));
    const r0 = ch.r || 118, btn = f.btn, tB = btn ? tOf(s, btn, .2, idx) : 1e9, tP = btn ? T(s, btn.pressCue, .2, idx) : 1e9, parcel = f.parcel, tPc = parcel ? tOf(s, parcel, .3, idx) : 1e9;
    let ball = null;
    const B = base(ctx, s, t, {
      shake: tA > 0 ? [{ at: tA + .45, amp: 26 }] : null,
      spots: { ball: () => ball ? [ball.x, ball.y - 60, null] : [540, 1500, null], btn: () => btn ? [btn.x ?? 760, btn.y ?? 900, null] : [540, 960, null] },
      under: (ctx2, c, sts, j) => {
        if (j !== hj || !toons[hj]) return; const st = sts[hj], k = st.size / 92;
        // ball position follows the toon with a delay (drag)
        const lag = .35, sp = toonState(toons[hj], s, Math.max(0, t - lag)), side = ch.side ?? -(toons[hj].face || 1), face = -side;
        const L = (r0 * sNow) + 60;
        let bx = sp.x + side * (L + 40), by = GROUND - r0 * sNow;
        const fall = tA > -1 ? clamp((t - tA) / .45, 0, 1) : 1; if (t < tA) return;
        let sq = 0; if (fall < 1){ by = lerp(-500, by, eIn(fall)); } else { const q = t - tA - .45; if (q < .4) sq = Math.sin(q / .4 * Math.PI) * .18 * (1 - q / .4); }
        const rot = (bx / (r0 * sNow)) * .9;
        ball = { x: bx, y: by };
        let jl = 0; { const jq = t - st.jumpT - .13; if (jq > 0 && jq < st.jumpD){ const q = jq / st.jumpD; jl = st.jumpH * 4 * q * (1 - q); } }
        const ank = [st.x + side * 4 * k, st.y - 4 * k - jl], r = r0 * sNow;
        const payK = t - tPay;
        if (payK < 0){
          // chain
          chainLinks(ctx2, ank[0], ank[1], bx + face * r * .85, by - r * .1, 30 + 20 * Math.sin(t * 2), 9, 12 * Math.max(1, sNow * .8));
          // cuff
          if (fall >= 1) { ctx2.beginPath(); ctx2.ellipse(ank[0], ank[1] - 2 * k, 6.5 * k, 3 * k, 0, 0, TAU); ctx2.strokeStyle = OUT; ctx2.lineWidth = 4.6 * k; ctx2.stroke(); ctx2.strokeStyle = "#9A948E"; ctx2.lineWidth = 2.6 * k; ctx2.stroke(); }
          ctx2.save(); ctx2.translate(bx, by + r); ctx2.scale(1 + sq, 1 - sq); ctx2.translate(-bx, -(by + r));
          const lab = t < tSw ? (ch.swap ? ch.swap.from : ch.label) : ch.label, flip = ch.swap ? clamp((t - tSw) / .4, 0, 1) : null;
          ironBall(ctx2, bx, by, r, rot, lab || "UTANG", flip != null && flip > 0 && flip < 1 ? (flip < .5 ? flip : flip) : null, t);
          // stickers (bills / fines) slap on the ball
          stk.forEach(o => { const q = t - o.T; if (q < 0) return; const sc = q < .25 ? 2 - eOut(q / .25) : 1, ang = [2.45, .7, -2.75, -.35, 1.57][o.j % 5], px = bx + Math.cos(ang) * r * .6, py = by + Math.sin(ang) * r * .6;
            ctx2.save(); ctx2.translate(px, py); ctx2.rotate((rnd(o.j + 2) - .5) * .5); ctx2.scale(sc, sc); const size = fitFont(ctx2, o.text, 230, 44, 900), w = ctx2.measureText(o.text).width + 34;
            rr(ctx2, -w / 2, -34, w, 68, 8); ctx2.fillStyle = o.red ? RED : PAPER; ctx2.fill(); ol(ctx2, 5); ctx2.fillStyle = o.red ? "#FFFFFF" : BROWN; ctx2.textAlign = "center"; ctx2.fillText(o.text, 0, size * .36); ctx2.textAlign = "left"; ctx2.restore();
            if (q < .5) burstFx(ctx2, px, py, q, o.red ? RED : HL, 8, 110); });
          ctx2.restore();
          if (fall >= 1 && t - tA - .45 < .8) dust(ctx2, bx, GROUND, t - tA - .45, 9, 1.4);
          if (fall >= 1 && t - tA - .45 < .6) burstFx(ctx2, ank[0], ank[1] - 20, t - tA - .45, GOLD, 8, 90);
          if (Math.abs(st.vx) > 30) dust(ctx2, bx - face * r * .6, GROUND, (t * 2.2) % .8, 4, .8);
          if (gT > 0 && t - gT < .5) burstFx(ctx2, bx, by, t - gT, RED, 12, r * 1.4);
        } else {
          // break free: ball cracks, shrinks, links scatter
          const q = clamp(payK / .6, 0, 1);
          if (q < 1){ ctx2.save(); ctx2.translate(bx, by); ctx2.scale(1 - eIn(q), 1 - eIn(q)); ironBall(ctx2, 0, 0, r, rot, ch.label || "UTANG", null, t);
            ctx2.strokeStyle = CREAM; ctx2.lineWidth = 6; ctx2.beginPath(); ctx2.moveTo(-r * .1, -r); ctx2.lineTo(r * .1, -r * .3); ctx2.lineTo(-r * .2, r * .1); ctx2.lineTo(r * .15, r * .6); ctx2.stroke(); ctx2.restore(); }
          chainLinks(ctx2, ank[0], ank[1], bx + face * r * .85, by - r * .1, 30, 9, 12, i => { const vx = (rnd(i + 7) - .5) * 900, vy = -400 - rnd(i + 2) * 600, d = payK; return [vx * d, Math.min(GROUND - 20 - ank[1], vy * d + 1400 * d * d), d * 8 * (rnd(i) - .5)]; });
          burstFx(ctx2, bx, by, payK, GOLD, 14, r * 1.8); burstFx(ctx2, ank[0], ank[1] - 20, payK - .1, HL, 10, 120);
        }
      },
      back: (ctx2) => {
        if (parcel && t >= tPc){ const q = pop(t, tPc, .4), x = parcel.x ?? 820, y = GROUND; ctx2.save(); ctx2.translate(x, y); ctx2.scale(q, q);
          ctx2.fillStyle = "#D9A066"; rr(ctx2, -110, -150, 220, 150, 10); ctx2.fill(); ol(ctx2, 6); ctx2.fillStyle = "#C58B52"; rr(ctx2, -120, -170, 240, 40, 8); ctx2.fill(); ol(ctx2, 6);
          ctx2.fillStyle = ORANGE; ctx2.fillRect(-14, -170, 28, 170); ctx2.strokeStyle = OUT; ctx2.lineWidth = 4; ctx2.strokeRect(-14, -170, 28, 170);
          const k2 = t - tPc; sneaker(ctx2, 0, -190 - Math.max(0, Math.sin(Math.min(k2, 1.2) * 2.6)) * 120 - Math.sin(t * 3) * 6, .95, ORANGE, Math.sin(t * 2) * .08);
          ctx2.restore(); if (k2 < .9) burstFx(ctx2, x, y - 200, k2, HL, 12, 170); }
      },
      front: (ctx2) => {
        if (!btn || t < tB) return; const x = btn.x ?? 760, y = btn.y ?? 900, a = clamp(1 - (t - tP - 1.4) / .5, 0, 1); if (a <= 0) return;
        const q = pop(t, tB, .45), press = t >= tP ? 1 - .14 * Math.exp(-(t - tP) * 6) * Math.sin(Math.min(1, (t - tP) / .12) * Math.PI / 2 + .0) : 1, bob = Math.sin(t * 2.4) * 10;
        ctx2.save(); ctx2.globalAlpha *= a; ctx2.translate(x, y + bob); ctx2.scale(q * press, q * press);
        glowAt(ctx2, 0, 0, 330, HL, .35 + .15 * Math.sin(t * 5));
        const label = btn.label || "BAYAR NANTI"; const size = fitFont(ctx2, label, 380, 62, 900), w = ctx2.measureText(label).width + 110, h = 132;
        rr(ctx2, -w / 2, -h / 2 + 14, w, h, h / 2); ctx2.fillStyle = "#8E4A12"; ctx2.fill(); ol(ctx2, 7);
        rr(ctx2, -w / 2, -h / 2, w, h, h / 2); ctx2.fillStyle = ORANGE; ctx2.fill(); ol(ctx2, 7);
        ctx2.fillStyle = "rgba(255,255,255,.25)"; rr(ctx2, -w / 2 + 24, -h / 2 + 12, w - 48, 30, 15); ctx2.fill();
        ctx2.fillStyle = CREAM; ctx2.textAlign = "center"; ctx2.fillText(label, 0, size * .36); ctx2.textAlign = "left";
        for (let k = 0; k < 5; k++){ const a2 = t * 1.3 + k * 1.26, rx = w / 2 + 40, ry = 110; sparkle(ctx2, Math.cos(a2) * rx, Math.sin(a2) * ry, 12 + 6 * Math.sin(t * 6 + k), k % 2 ? GOLD : CREAM); }
        ctx2.restore();
        if (t >= tP){ const k = t - tP; for (let r2 = 0; r2 < 3; r2++){ const q2 = k * 1.6 - r2 * .18; if (q2 < 0 || q2 > 1) continue; ctx2.save(); ctx2.globalAlpha *= (1 - q2) * a; ctx2.strokeStyle = GOLD; ctx2.lineWidth = 10; ctx2.beginPath(); ctx2.ellipse(x, y + bob, 220 + q2 * 260, 90 + q2 * 120, 0, 0, TAU); ctx2.stroke(); ctx2.restore(); }
          if (k < .9) burstFx(ctx2, x, y + bob, k, GOLD, 14, 260); }
      },
    });
  }, (s, f, i, add) => {
    const ch = f.chain || {};
    if (ch.attachCue) { const t0 = cueT(s, ch.attachCue, .3, i) + (ch.attachDelay || 0); add(t0, "whoosh"); add(t0 + .45, "pop"); add(t0 + .5, "ping"); }
    (ch.stickers || []).forEach((k, j) => add(cueT(s, k.cue, .3 + j * .05, i), "pop"));
    (ch.grow || []).forEach(k => add(cueT(s, k.cue, .3, i), "whoosh"));
    if (ch.swap) add(cueT(s, ch.swap.cue, .3, i), "ping");
    if (ch.payCue) { const t0 = cueT(s, ch.payCue, .4, i); add(t0, "pop"); add(t0 + .1, "chime"); }
    if (f.btn) { add(tOf(s, f.btn, .2, i), "pop"); if (f.btn.pressCue) { add(cueT(s, f.btn.pressCue, .2, i), "ping"); add(cueT(s, f.btn.pressCue, .2, i) + .05, "chime"); } }
    if (f.parcel) add(tOf(s, f.parcel, .3, i), "pop");
  });

  /* ================= _gulung: credit history scroll ================= */
  function scooter(ctx, x, y, s, t, col){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 230, 18, 0, 0, TAU); ctx.fill();
    [[-150, -62], [150, -62]].forEach(([wx, wy]) => { ctx.beginPath(); ctx.arc(wx, wy, 62, 0, TAU); ctx.fillStyle = "#2B2523"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(wx, wy, 26, 0, TAU); ctx.fillStyle = "#BDB6AE"; ctx.fill(); ol(ctx, 4); });
    ctx.beginPath(); ctx.moveTo(-210, -100); ctx.quadraticCurveTo(-200, -190, -90, -200); ctx.lineTo(60, -200); ctx.lineTo(90, -110); ctx.lineTo(160, -110); ctx.lineTo(120, -60); ctx.lineTo(-100, -60); ctx.quadraticCurveTo(-140, -110, -210, -100); ctx.closePath(); ctx.fillStyle = col || TEAL; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = BROWN; rr(ctx, -170, -232, 170, 40, 18); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(150, -62); ctx.lineTo(110, -300); ctx.stroke(); ctx.strokeStyle = "#BDB6AE"; ctx.lineWidth = 6; ctx.stroke();
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(80, -300); ctx.lineTo(150, -310); ctx.stroke();
    ctx.beginPath(); ctx.arc(140, -250, 20, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); glowAt(ctx, 140, -250, 70, GOLD, .3 + .2 * Math.sin(t * 4));
    ctx.restore(); }
  S("rapor", "Cerita: buku rapor riwayat kredit", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, sc = f.book || {}, x = sc.x ?? 540, y0 = sc.y ?? 280, w = sc.w ?? 880, rows = sc.rows || [];
    const tU = tOf(s, sc, .1, idx), tS = T(s, sc.stampCue, .3, idx), rowH = sc.rowH ?? 88, top = 40, H = top + rows.length * rowH + 40, pw = w / 2;
    const mo = f.motor, tM = mo ? tOf(s, mo, .3, idx) : 1e9, tQ = mo ? T(s, mo.qCue, .3, idx) : 1e9;
    base(ctx, s, t, {
      spots: { book: [x, y0 + H / 2, null], stamp: () => { const j = rows.findIndex(r => !r.ok); return [x + pw / 2, y0 + top + (j + .5) * rowH, null]; }, motor: [mo ? mo.x ?? 760 : 540, 1400, null] },
      back: (ctx2) => {
        if (t < tU) return; const qin = pop(t, tU, .45), q = eOut(clamp((t - tU - .45) / 1.0, 0, 1)), sway = Math.sin(t * 1.3) * .01, bob = Math.sin(t * 1.7) * 8;
        ctx2.save(); ctx2.translate(x, y0 + H / 2 + bob); ctx2.rotate(sway); ctx2.scale(qin, qin); ctx2.translate(0, -H / 2);
        glowAt(ctx2, 0, H / 2, w * .8, GOLD, .15 + .05 * Math.sin(t * 3));
        // back cover + right page
        ctx2.fillStyle = "rgba(0,0,0,.25)"; rr(ctx2, -pw + 18, 18, w, H, 18); ctx2.fill();
        rr(ctx2, -pw - 14, -14, w + 28, H + 28, 20); ctx2.fillStyle = TEAL; ctx2.fill(); ol(ctx2, 7);
        ctx2.fillStyle = PAPER; rr(ctx2, 0, 0, pw, H, 10); ctx2.fill(); ol(ctx2, 5);
        rows.forEach((r, j) => { const ry = top + j * rowH; ctx2.strokeStyle = hexA(BROWN, .2); ctx2.lineWidth = 3; ctx2.beginPath(); ctx2.moveTo(24, ry + rowH - 6); ctx2.lineTo(pw - 24, ry + rowH - 6); ctx2.stroke();
          const late = !r.ok, on = t > tS || !late; if (late && t > tS){ ctx2.fillStyle = hexA(RED, .12 + .06 * Math.sin(t * 6)); ctx2.fillRect(4, ry, pw - 8, rowH - 6); }
          const sz = fitFont(ctx2, r.label, pw - 140, 38, 800); ctx2.fillStyle = BROWN; ctx2.fillText(r.label, 30, ry + rowH * .6);
          const bx = pw - 60, by = ry + rowH * .45; ctx2.beginPath(); ctx2.arc(bx, by, 28, 0, TAU); ctx2.fillStyle = late ? (on ? RED : "#E8DCCB") : GREEN; ctx2.fill(); ol(ctx2, 5);
          if (!late) ico(ctx2, "check", bx, by, 38, "#FFFFFF", 3.4); else if (on){ ctx2.strokeStyle = "#FFFFFF"; ctx2.lineWidth = 8; ctx2.lineCap = "round"; ctx2.beginPath(); ctx2.moveTo(bx - 11, by - 11); ctx2.lineTo(bx + 11, by + 11); ctx2.moveTo(bx + 11, by - 11); ctx2.lineTo(bx - 11, by + 11); ctx2.stroke(); } });
        // left page (inside of the cover once it has flipped)
        if (q > .5){ ctx2.fillStyle = PAPER; rr(ctx2, -pw, 0, pw, H, 10); ctx2.fill(); ol(ctx2, 5);
          ico(ctx2, "shield", -pw / 2, H * .3, 110, TEAL, 3); textC(ctx2, sc.title || "RIWAYAT KREDIT", -pw / 2, H * .3 + 120, 40, BROWN, 900, pw - 50); textC(ctx2, sc.sub || "SLIK OJK", -pw / 2, H * .3 + 170, 34, ORANGE, 800, pw - 50); }
        // flipping cover
        const cx2 = Math.cos(q * Math.PI); if (Math.abs(cx2) > .02 && q < 1){ ctx2.save(); ctx2.scale(cx2, 1); rr(ctx2, 0, -14, pw + 14, H + 28, 20); ctx2.fillStyle = cx2 > 0 ? "#3A8A8F" : "#E9DCC6"; ctx2.fill(); ol(ctx2, 7);
            if (cx2 > 0){ textC(ctx2, "RAPOR", pw / 2, H * .42, 56, CREAM, 900, pw - 60); textC(ctx2, "KREDIT", pw / 2, H * .42 + 64, 56, GOLD, 900, pw - 60); } ctx2.restore(); }
        // spine rings
        for (let k = 0; k < 5; k++){ ctx2.beginPath(); ctx2.ellipse(0, 40 + k * (H - 80) / 4, 16, 10, 0, 0, TAU); ctx2.strokeStyle = OUT; ctx2.lineWidth = 6; ctx2.stroke(); }
        ctx2.restore();
        const j = rows.findIndex(r => !r.ok);
        if (j >= 0 && t >= tS){ const k = t - tS, sy = y0 + top + (j + .5) * rowH + bob; stampBox(ctx2, sc.stampText || "TELAT BAYAR", x + pw / 2 - 20, sy, k, RED, 50, -.14); if (k < .9) burstFx(ctx2, x + pw / 2, sy, k, RED, 12, 240); }
      },
      mid: (ctx2) => {
        if (!mo || t < tM) return; const q = pop(t, tM, .45), mx = mo.x ?? 760; ctx2.save(); ctx2.translate(mx, GROUND); ctx2.scale(q, q); scooter(ctx2, 0, 0, mo.s ?? .95, t, mo.col); ctx2.restore();
        if (t >= tQ){ const k = t - tQ, qq = pop(t, tQ, .4), bob = Math.sin(t * 3) * 10; ctx2.save(); ctx2.translate(mx + 40, GROUND - 420 + bob); ctx2.scale(qq, qq); ctx2.rotate(Math.sin(t * 2.2) * .08);
          ctx2.beginPath(); ctx2.arc(0, 0, 66, 0, TAU); ctx2.fillStyle = GOLD; ctx2.fill(); ol(ctx2, 7); textC(ctx2, "?", 0, 30, 90, BROWN, 900); ctx2.restore(); if (k < .8) burstFx(ctx2, mx + 40, GROUND - 420, k, GOLD, 10, 150); }
      },
      midZ: mo && mo.z != null ? mo.z : .5,
    });
  }, (s, f, i, add) => { const sc = f.book || {}; add(tOf(s, sc, .1, i), "pop"); add(tOf(s, sc, .1, i) + .5, "whoosh"); if (sc.stampCue) { add(cueT(s, sc.stampCue, .3, i), "pop"); add(cueT(s, sc.stampCue, .3, i) + .05, "ping"); }
    if (f.motor) { add(tOf(s, f.motor, .3, i), "pop"); if (f.motor.qCue) add(cueT(s, f.motor.qCue, .3, i), "ping"); } });

  /* ================= _gelembung: story bubbles ================= */
  function pic(ctx, kind, R, t){
    ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round"; const lw = Math.max(3, R * .07);
    if (kind === "ball"){ ctx.beginPath(); ctx.arc(0, 0, R * .55, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, lw); ctx.fillStyle = OUT; ctx.beginPath(); for (let k = 0; k < 5; k++){ const a = k / 5 * TAU - Math.PI / 2; ctx.lineTo(Math.cos(a) * R * .2, Math.sin(a) * R * .2); } ctx.closePath(); ctx.fill();
      for (let k = 0; k < 5; k++){ const a = k / 5 * TAU - Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * .2, Math.sin(a) * R * .2); ctx.lineTo(Math.cos(a) * R * .48, Math.sin(a) * R * .48); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .7; ctx.stroke(); } }
    else if (kind === "star"){ ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = k / 10 * TAU - Math.PI / 2, r = k % 2 ? R * .25 : R * .58; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, lw); }
    else if (kind === "heart"){ ctx.beginPath(); ctx.moveTo(0, R * .45); ctx.bezierCurveTo(-R * .7, -R * .05, -R * .35, -R * .6, 0, -R * .22); ctx.bezierCurveTo(R * .35, -R * .6, R * .7, -R * .05, 0, R * .45); ctx.fillStyle = "#E0503A"; ctx.fill(); ol(ctx, lw); }
    else if (kind === "cat"){ ctx.beginPath(); ctx.moveTo(-R * .45, -R * .1); ctx.lineTo(-R * .4, -R * .55); ctx.lineTo(-R * .12, -R * .3); ctx.lineTo(R * .12, -R * .3); ctx.lineTo(R * .4, -R * .55); ctx.lineTo(R * .45, -R * .1); ctx.quadraticCurveTo(R * .5, R * .45, 0, R * .45); ctx.quadraticCurveTo(-R * .5, R * .45, -R * .45, -R * .1); ctx.fillStyle = "#F4A85C"; ctx.fill(); ol(ctx, lw);
      ctx.fillStyle = OUT; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * R * .17, 0, R * .06, 0, TAU); ctx.fill(); }); ctx.beginPath(); ctx.moveTo(-R * .07, R * .14); ctx.quadraticCurveTo(0, R * .22, R * .07, R * .14); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .7; ctx.stroke(); }
    else if (kind === "smile"){ ctx.beginPath(); ctx.arc(0, 0, R * .55, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, lw); ctx.fillStyle = OUT; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * R * .2, -R * .12, R * .07, 0, TAU); ctx.fill(); }); ctx.beginPath(); ctx.arc(0, R * .02, R * .3, .15 * Math.PI, .85 * Math.PI); ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke(); }
    else if (kind === "book"){ ctx.save(); ctx.rotate(-.15); ctx.fillStyle = TEAL; rr(ctx, -R * .5, -R * .35, R * .48, R * .7, 4); ctx.fill(); ol(ctx, lw); ctx.fillStyle = ORANGE; rr(ctx, R * .02, -R * .35, R * .48, R * .7, 4); ctx.fill(); ol(ctx, lw); ctx.restore(); }
    else if (kind === "sun"){ ctx.strokeStyle = GOLD; ctx.lineWidth = lw * 1.2; for (let k = 0; k < 8; k++){ const a = k / 8 * TAU + t; ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * .38, Math.sin(a) * R * .38); ctx.lineTo(Math.cos(a) * R * .6, Math.sin(a) * R * .6); ctx.stroke(); } ctx.beginPath(); ctx.arc(0, 0, R * .3, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, lw); }
    else if (kind === "cloud"){ ctx.fillStyle = "#8C8F99"; [[-R * .2, 0, R * .26], [R * .12, -R * .1, R * .3], [R * .35, R * .06, R * .2], [-R * .4, R * .08, R * .18]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
      ctx.strokeStyle = SKY; ctx.lineWidth = lw; for (let k = 0; k < 3; k++){ const q = (t * 1.5 + k / 3) % 1; ctx.beginPath(); ctx.moveTo(-R * .25 + k * R * .25, R * .3 + q * R * .3); ctx.lineTo(-R * .3 + k * R * .25, R * .42 + q * R * .3); ctx.stroke(); } }
    else if (kind === "flower"){ for (let k = 0; k < 5; k++){ const a = k / 5 * TAU + t * .5; ctx.beginPath(); ctx.arc(Math.cos(a) * R * .25, Math.sin(a) * R * .25, R * .2, 0, TAU); ctx.fillStyle = "#F7B7A3"; ctx.fill(); ol(ctx, lw * .7); } ctx.beginPath(); ctx.arc(0, 0, R * .15, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, lw * .7); }
    ctx.restore(); }
  function soap(ctx, x, y, R, kind, t, a, dark){
    if (R <= 1) return; ctx.save(); ctx.globalAlpha *= a ?? 1; ctx.translate(x, y); const wob = Math.sin(t * 5 + x * .01) * .04; ctx.scale(1 + wob, 1 - wob);
    const g = ctx.createRadialGradient(-R * .3, -R * .3, R * .1, 0, 0, R); g.addColorStop(0, dark ? "rgba(120,124,136,.55)" : "rgba(255,255,255,.18)"); g.addColorStop(.8, dark ? "rgba(90,94,106,.55)" : "rgba(190,230,245,.3)"); g.addColorStop(1, dark ? "rgba(70,72,84,.8)" : "rgba(255,210,235,.65)");
    ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = Math.max(3, R * .06); ctx.strokeStyle = dark ? "rgba(60,62,72,.9)" : "rgba(255,255,255,.95)"; ctx.stroke();
    ctx.strokeStyle = dark ? "rgba(150,150,170,.6)" : "rgba(150,210,240,.7)"; ctx.lineWidth = Math.max(2, R * .035); ctx.beginPath(); ctx.arc(0, 0, R * .9, .2 * Math.PI, .8 * Math.PI); ctx.stroke();
    if (kind) pic(ctx, kind, R, t);
    ctx.beginPath(); ctx.ellipse(-R * .42, -R * .45, R * .2, R * .1, -.7, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fill();
    ctx.restore(); }
  function popFx(ctx, x, y, R, k){ if (k < 0 || k > .45) return; const q = k / .45; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.lineCap = "round";
    for (let i = 0; i < 10; i++){ const a = i / 10 * TAU, r0 = R * (.6 + q * .8), r1 = r0 + 18; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < 8; i++){ const a = i / 8 * TAU + .3; ctx.beginPath(); ctx.arc(x + Math.cos(a) * R * (.5 + q * 1.2), y + Math.sin(a) * R * (.5 + q * 1.2) + q * q * 60, 5, 0, TAU); ctx.fillStyle = "rgba(190,230,245,.9)"; ctx.fill(); } ctx.restore(); }
  S("gelembung", "Cerita: gelembung cerita anak", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, b = f.bub || {}, mode = b.mode || "pantul", from = b.from ?? 1, to = b.to ?? 0;
    const list = (b.list || []).map((o, j) => Object.assign({ T: tOf(s, o, .2 + j * .12, idx), j }, o));
    const tDark = T(s, b.darkCue, .6, idx), tDrop = b.drop ? T(s, b.drop.cue, .3, idx) : 1e9, pouf = f.pouf, tPf = pouf ? tOf(s, pouf, .3, idx) : 1e9;
    let shot = null;
    base(ctx, s, t, {
      spots: { mid: () => shot || [540, 960, null] },
      back: (ctx2, c, sts) => {
        if (pouf && t >= tPf){ const q = pop(t, tPf, .4); ctx2.save(); ctx2.translate(pouf.x ?? 360, GROUND); ctx2.scale(q, q); ctx2.fillStyle = "rgba(43,26,18,.25)"; ctx2.beginPath(); ctx2.ellipse(0, 4, 120, 16, 0, 0, TAU); ctx2.fill();
          rr(ctx2, -110, -120, 220, 120, 40); ctx2.fillStyle = pouf.col || "#C2691F"; ctx2.fill(); ol(ctx2, 6); ctx2.strokeStyle = hexA(CREAM, .5); ctx2.lineWidth = 5; ctx2.beginPath(); ctx2.moveTo(-80, -70); ctx2.lineTo(80, -70); ctx2.stroke(); ctx2.restore(); }
        if (b.drop){ const d = b.drop, x1 = d.x ?? 860, y1 = d.y ?? 1360; // little table / basket for the phone
          ctx2.save(); ctx2.translate(x1, GROUND); ctx2.fillStyle = "#8E4E2E"; rr(ctx2, -90, -(GROUND - y1) - 10, 180, 26, 8); ctx2.fill(); ol(ctx2, 5); ctx2.fillRect(-12, -(GROUND - y1) + 10, 24, GROUND - y1 - 10); ctx2.strokeStyle = OUT; ctx2.lineWidth = 4; ctx2.strokeRect(-12, -(GROUND - y1) + 10, 24, GROUND - y1 - 10); rr(ctx2, -60, -8, 120, 12, 6); ctx2.fill(); ctx2.restore(); }
      },
      after: (ctx2, c, sts) => {
        const A = sts[from], B = sts[to]; if (!A) return; const ha = toonHead(A), mouth = [ha[0] + (A.face || 1) * A.size * .14, ha[1] + A.size * .07];
        const hb = B ? toonHead(B) : [mouth[0] - 400, mouth[1]], shield = B ? [hb[0] + (B.face || 1) * B.size * .17, hb[1] + B.size * .1] : hb;
        shot = [(mouth[0] + hb[0]) / 2, (mouth[1] + hb[1]) / 2 - 60, null]; const M = [(mouth[0] + hb[0]) / 2 + (b.mdx || 0), Math.min(mouth[1], hb[1]) - (b.mUp ?? 260)];
        layer(ctx2, c, 1, () => {
          // phone glow shield in front of the listener
          if (B && mode === "pantul" && b.phoneOn !== false && t < tDrop){ const pulse = .25 + .15 * Math.sin(t * 6); glowAt(ctx2, shield[0], shield[1] + 40, B.size * .2, SKY, pulse); }
          // phone flying from hand to the table
          if (b.drop && B){ const d = b.drop, q = clamp((t - tDrop) / .7, 0, 1); if (t >= tDrop){ const h0 = handOf(B), x1 = d.x ?? 860, y1 = (d.y ?? 1360) - 20, x = lerp(h0[0], x1, q), y = lerp(h0[1], y1, q) - Math.sin(q * Math.PI) * 220;
              ctx2.save(); ctx2.translate(x, y); ctx2.rotate(q < 1 ? q * 7 : Math.PI / 2); ctx2.fillStyle = "#1E1A18"; rr(ctx2, -34, -60, 68, 120, 12); ctx2.fill(); ol(ctx2, 5); ctx2.fillStyle = q < 1 ? SKY : "#3A3533"; rr(ctx2, -26, -50, 52, 100, 8); ctx2.fill(); ctx2.restore();
              if (q >= 1) { dust(ctx2, x1, y1 + 20, t - tDrop - .7, 5, .5); if (t - tDrop - .7 < 2.5) zzz(ctx2, x1 + 30, y1 - 40, t, .9); } } }
          list.forEach(o => { const k = t - o.T; if (k < 0) return; const R = (o.s || 1) * (b.r || 92), fly = b.fly || 1.1;
            if (mode === "sepi"){ // bubbles drift up from the child, smaller, and pop alone
              const q = k / 2.2; if (q > 1.2) return; const x = mouth[0] + Math.sin(k * 2 + o.j) * 40 + (o.dx || 0), y = mouth[1] - 40 - k * 170; if (q < 1) soap(ctx2, x, y, R * (.6 + .4 * eOut(clamp(k / .3, 0, 1))), o.pic, t, 1); else popFx(ctx2, x, y, R, (q - 1) * 2.2); return; }
            const q = clamp(k / fly, 0, 1), arc = -Math.sin(q * Math.PI) * 160, R0 = R * (.35 + .65 * eOut(clamp(k / .35, 0, 1)));
            if (mode === "pantul"){ const tx = shield[0], ty = shield[1] - 10;
              if (q < 1){ soap(ctx2, lerp(mouth[0], tx, eIn(q) * .3 + q * .7), lerp(mouth[1] - 30, ty, q) + arc, R0, o.pic, t); }
              else { const kb = k - fly; if (kb < .45){ const x = tx - (B.face || 1) * -1 * 0 + (A.face || 1) * -1 * 0 + (mouth[0] > tx ? 1 : -1) * kb * 300, y = ty - kb * 180 + kb * kb * 700; soap(ctx2, x, y, R0 * (1 + kb * .3), o.pic, t, 1); if (kb < .15) burstFx(ctx2, tx, ty, kb * 2, SKY, 8, R0 * 1.4); }
                else popFx(ctx2, (mouth[0] > tx ? 1 : -1) * 135 + tx, ty - 50, R0, kb - .45); }
            } else { // alir: flows up between the two and merges into one big story bubble
              const ox = M[0], oy = M[1];
              const dark = !!o.dark, x = lerp(mouth[0], ox, eOut(q)), y = lerp(mouth[1] - 30, oy, eOut(q)) + arc * (1 - q);
              if (dark && b.catch){ const h0 = handOf(B), qq = clamp((k - .2) / 1.4, 0, 1), xx = lerp(mouth[0], h0[0], eOut(qq)), yy = lerp(mouth[1], h0[1] - R0 * .9, eOut(qq)) - Math.sin(qq * Math.PI) * 120; soap(ctx2, xx, yy, R0 * 1.15, o.pic, t, 1, true); if (qq >= 1) glowAt(ctx2, xx, yy, R0 * 2, "#F4A85C", .25 + .1 * Math.sin(t * 4)); return; }
              if (q < 1) soap(ctx2, x, y, R0 * (1 - .4 * q), o.pic, t, 1, dark); }
          });
          // the big merged story bubble (alir)
          if (mode === "alir"){ const got = list.filter(o => !(o.dark && b.catch) && t - o.T >= (b.fly || 1.1)); if (got.length){ const n = got.length, last = got[n - 1], kk = t - last.T - (b.fly || 1.1), wob = kk < .5 ? Math.sin(kk / .5 * Math.PI * 2) * .08 * (1 - kk / .5) : 0;
              const Rb = (b.r || 92) * (1.1 + .38 * n) * (1 + wob); glowAt(ctx2, M[0], M[1], Rb * 1.6, GOLD, .22 + .06 * Math.sin(t * 3)); soap(ctx2, M[0], M[1], Rb, null, t, 1);
              got.forEach((o, j) => { const a = t * .5 + j / n * TAU, rr2 = n > 1 ? Rb * .45 : 0; ctx2.save(); ctx2.translate(M[0] + Math.cos(a) * rr2, M[1] + Math.sin(a) * rr2 * .8); pic(ctx2, o.pic, Rb * (n > 1 ? .5 : .9), t); ctx2.restore(); });
              if (kk < .6) burstFx(ctx2, M[0], M[1], kk, GOLD, 10, Rb * 1.2); } }
          // dark bubble trapped in the quiet child (sepi)
          if (mode === "sepi" && t >= tDark){ const q = eBack(clamp((t - tDark) / .6, 0, 1)), cx = A.x + (A.face || 1) * A.size * .02, cy = A.y - A.size * .45; soap(ctx2, cx, cy, A.size * .2 * q, "cloud", t, .95, true);
            ctx2.save(); ctx2.globalAlpha *= q; ctx2.strokeStyle = hexA("#3A3D48", .8); ctx2.lineWidth = 8; ctx2.setLineDash([16, 14]); ctx2.lineDashOffset = -t * 30; ctx2.beginPath(); ctx2.arc(cx, cy, A.size * .26, 0, TAU); ctx2.stroke(); ctx2.restore(); }
        });
      },
      over: (ctx2) => { (f.day || []).forEach((d, j) => { const T0 = tOf(s, d, .3, idx), T1 = j + 1 < f.day.length ? tOf(s, f.day[j + 1], .3, idx) : 1e9; if (t < T0 || t > T1) return; stampBox(ctx2, d.text, 540, 330, t - T0, ORANGE, 70, j % 2 ? .08 : -.08); }); },
    });
  }, (s, f, i, add) => { const b = f.bub || {}, fly = b.fly || 1.1; (b.list || []).forEach((o, j) => { const t0 = tOf(s, o, .2 + j * .12, i); add(t0, "pop"); if (b.mode === "pantul") add(t0 + fly + .45, "ping"); if (b.mode === "alir") add(t0 + fly, "chime"); });
    (f.day || []).forEach(d => add(tOf(s, d, .3, i), "pop")); if (b.darkCue) add(cueT(s, b.darkCue, .6, i), "whoosh"); if (b.drop) { add(cueT(s, b.drop.cue, .3, i), "whoosh"); add(cueT(s, b.drop.cue, .3, i) + .7, "pop"); }
    if (f.pouf) add(tOf(s, f.pouf, .3, i), "pop"); });

  /* ================= _benda: living desk objects ================= */
  function objDraw(ctx, kind, t, mood, s, seed, buzz){
    ctx.save(); ctx.scale(s, s); ctx.lineJoin = "round"; let fy = -110, fr = 70;
    if (buzz) ctx.translate(Math.sin(t * 70) * 5, 0);
    if (kind === "phone"){ ctx.fillStyle = "#1E1A18"; rr(ctx, -72, -280, 144, 280, 24); ctx.fill(); ol(ctx, 7); ctx.fillStyle = buzz ? "#CFEFFA" : SKY; rr(ctx, -60, -266, 120, 252, 14); ctx.fill(); fy = -150; fr = 80;
      if (buzz){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineCap = "round"; [-1, 1].forEach(d => { for (let k = 0; k < 2; k++){ ctx.beginPath(); ctx.arc(0, -140, 110 + k * 26, d > 0 ? -.5 : Math.PI - .5, d > 0 ? .5 : Math.PI + .5); ctx.stroke(); } });
        ctx.fillStyle = "#E0503A"; ctx.beginPath(); ctx.arc(58, -272, 26, 0, TAU); ctx.fill(); ol(ctx, 5); textC(ctx, "9+", 58, -262, 26, "#FFFFFF", 900); } }
    else if (kind === "chips"){ ctx.fillStyle = "rgba(255,255,255,.55)"; rr(ctx, -95, -240, 190, 240, 30); ctx.fill(); ol(ctx, 7);
      ctx.save(); rr(ctx, -88, -170, 176, 166, 24); ctx.clip(); for (let k = 0; k < 14; k++){ ctx.fillStyle = k % 2 ? "#F2B84B" : "#E9A23B"; ctx.beginPath(); ctx.ellipse(-70 + (k % 5) * 36, -20 - Math.floor(k / 5) * 40, 30, 18, k, 0, TAU); ctx.fill(); ctx.strokeStyle = "#B97A22"; ctx.lineWidth = 3; ctx.stroke(); } ctx.restore();
      ctx.fillStyle = RED; rr(ctx, -105, -270, 210, 44, 14); ctx.fill(); ol(ctx, 7); ctx.fillStyle = CREAM; rr(ctx, -60, -150, 120, 50, 10); ctx.fill(); ol(ctx, 4); textC(ctx, "KERIPIK", 0, -115, 26, RED, 900); fy = -200; fr = 64; }
    else if (kind === "bottle"){ ctx.fillStyle = "#5BA8D6"; rr(ctx, -60, -260, 120, 260, 30); ctx.fill(); ol(ctx, 7); ctx.fillStyle = "rgba(255,255,255,.35)"; rr(ctx, -40, -240, 22, 200, 11); ctx.fill();
      ctx.fillStyle = TEAL; rr(ctx, -40, -310, 80, 56, 12); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "rgba(255,255,255,.4)"; for (let k = 0; k < 4; k++){ const q = (t * .6 + k / 4) % 1; ctx.beginPath(); ctx.arc(-20 + k * 14, -30 - q * 180, 6 + k, 0, TAU); ctx.fill(); } fy = -130; fr = 64; }
    else if (kind === "todo"){ ctx.save(); ctx.rotate(-.04); ctx.fillStyle = "#F6D36B"; rr(ctx, -110, -270, 220, 260, 10); ctx.fill(); ol(ctx, 7); ctx.fillStyle = hexA(BROWN, .15); ctx.fillRect(-110, -270, 220, 36);
      font(ctx, 900, 30, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText("TUGAS", 0, -244); ctx.textAlign = "left";
      for (let k = 0; k < 3; k++){ ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-86, -96 + k * 34 - 84, 22, 22); ctx.fillStyle = hexA(BROWN, .5); ctx.fillRect(-52, -88 + k * 34 - 84, 120 - k * 20, 8); } ctx.restore(); fy = -60; fr = 58; }
    else if (kind === "plant"){ ctx.fillStyle = "#3E7D4F"; for (let k = 0; k < 6; k++){ ctx.save(); ctx.translate(0, -120); ctx.rotate(-1 + k * .4 + Math.sin(t * 1.3 + k) * .06); ctx.beginPath(); ctx.ellipse(0, -70, 22, 70, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore(); }
      ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-70, -130); ctx.lineTo(70, -130); ctx.lineTo(54, 0); ctx.lineTo(-54, 0); ctx.closePath(); ctx.fill(); ol(ctx, 7); fy = -66; fr = 56; }
    ctx.restore();
    return { fy: fy * s, fr: fr * s };
  }
  S("benda", "Cerita: benda meja hidup", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, dk = f.desk || {}, dy = dk.y ?? 1190, dX = dk.drawerX ?? 250;
    const objs = (f.objs || []).map((o, j) => Object.assign({ j, T: o.cue ? T(s, o.cue, .2, idx) : -9, tw: T(s, o.wake, .2, idx), tg: o.go ? T(s, o.go.cue, .3, idx) : 1e9, ts: (o.say || []).map(z => Object.assign({ T: tOf(s, z, .2, idx) }, z)), tt: (o.tempt || []).map(c => T(s, c, .3, idx)) }, o));
    const drawerOpen = () => { let v = 0; objs.forEach(o => { if (o.go && o.go.to === "drawer"){ const k = t - o.tg + .25; if (k > 0) v = Math.max(v, k < .35 ? eOut(k / .35) : k < 1.25 ? 1 : 1 - eOut(clamp((k - 1.25) / .3, 0, 1))); } }); return v; };
    const pos = o => { let x = o.x, y = dy, sc = o.s || 1, rot = 0, hide = false; const k = t - o.tg;
      if (o.go && k > 0){ const to = o.go.to, q = clamp(k / (to === "drawer" ? .7 : to === "right" || to === "left" ? 1.6 : .7), 0, 1);
        if (to === "drawer"){ x = lerp(o.x, dX, eOut(q)); y = lerp(dy, dy + 170, eIn(q)) - Math.sin(q * Math.PI) * 260; sc *= 1 - .45 * q; rot = q * -1.2; hide = q >= 1; }
        else if (to === "right" || to === "left"){ const dir = to === "right" ? 1 : -1; x = o.x + dir * q * 900; y = dy - Math.abs(Math.sin(k * 9)) * 50; rot = Math.sin(k * 9) * .12 * dir; }
        else { x = lerp(o.x, +to, eOut(q)); y = dy - Math.sin(q * Math.PI) * 240; rot = Math.sin(q * Math.PI) * .3; } }
      return { x, y, sc, rot, hide }; };
    const moodOf = o => { const k = t - o.tg; if (o.go && k > 0) return o.go.mood || (o.go.to === "drawer" || o.go.to === "right" || o.go.to === "left" ? "frown" : "grin");
      if (t < o.tw && o.wake) return "sleep"; let m = o.mood || "smile"; if (o.tt.some(T0 => t > T0 && t < T0 + 1.6)) m = o.temptMood || "sly"; if (o.ts.some(z => t > z.T && t < z.T + 2)) m = z_m(o); return m; };
    const z_m = o => o.talkMood || (o.kind === "phone" || o.kind === "chips" ? "grin" : "smile");
    base(ctx, s, t, {
      spots: { desk: [540, dy - 200, null] },
      front: (ctx2, c, sts) => {
        // desk top + front panel
        ctx2.fillStyle = "rgba(43,26,18,.25)"; ctx2.fillRect(-400, dy - 6, 1880, 22);
        ctx2.fillStyle = "#A9643B"; ctx2.fillRect(-400, dy + 34, 1880, 900); ctx2.strokeStyle = OUT; ctx2.lineWidth = 7; ctx2.strokeRect(-400, dy + 34, 1880, 900);
        ctx2.fillStyle = "#C47A48"; rr(ctx2, -420, dy, 1920, 46, 12); ctx2.fill(); ol(ctx2, 7);
        ctx2.strokeStyle = hexA(OUT, .25); ctx2.lineWidth = 4; for (let k = 0; k < 6; k++){ ctx2.beginPath(); ctx2.moveTo(-400, dy + 120 + k * 70); ctx2.quadraticCurveTo(540, dy + 100 + k * 70 + Math.sin(k) * 20, 1480, dy + 130 + k * 70); ctx2.stroke(); }
        // drawer
        const dv = drawerOpen(); ctx2.save(); ctx2.translate(dX, dy + 160); const sc2 = 1 + dv * .25; ctx2.scale(sc2, sc2); ctx2.translate(0, dv * 40);
        if (dv > 0){ ctx2.fillStyle = "#5A3A2A"; rr(ctx2, -150, -95, 300, 50, 6); ctx2.fill(); }
        ctx2.fillStyle = "#B86E40"; rr(ctx2, -160, -70, 320, 140, 12); ctx2.fill(); ol(ctx2, 6); ctx2.fillStyle = CREAM; rr(ctx2, -50, -14, 100, 28, 14); ctx2.fill(); ol(ctx2, 5); ctx2.restore();
        // objects
        objs.forEach(o => { if (t < o.T) return; const p = pos(o); if (p.hide) return; const q = o.T > 0 ? pop(t, o.T, .4) : 1, buzz = o.tt.some(T0 => t > T0 && t < T0 + 1.2) && o.kind === "phone";
          const hopT = o.tt.find(T0 => t > T0 && t < T0 + 1.2), hopY = hopT != null ? -Math.abs(Math.sin((t - hopT) * 9)) * 50 : 0, breathe = 1 + Math.sin(t * 2.6 + o.j) * .02, wig = o.tt.some(T0 => t > T0 && t < T0 + 1.6) ? Math.sin(t * 14) * .08 : Math.sin(t * 1.7 + o.j) * .02;
          ctx2.save(); ctx2.translate(p.x, p.y + hopY); ctx2.rotate(p.rot + wig); ctx2.scale(q * breathe, q / breathe);
          ctx2.fillStyle = "rgba(43,26,18,.25)"; ctx2.beginPath(); ctx2.ellipse(0, 4, 110 * p.sc, 14 * p.sc, 0, 0, TAU); ctx2.fill();
          if (o.go && (o.go.to === "right" || o.go.to === "left") && t > o.tg){ ctx2.strokeStyle = OUT; ctx2.lineWidth = 9; ctx2.lineCap = "round"; [-1, 1].forEach(d => { const ph = Math.sin(t * 18 + d) * 18; ctx2.beginPath(); ctx2.moveTo(d * 40 * p.sc, -4); ctx2.lineTo(d * 40 * p.sc + ph, 30); ctx2.stroke(); }); }
          const m = objDraw(ctx2, o.kind, t, null, p.sc, o.j, buzz);
          oface(ctx2, 0, m.fy, m.fr, moodOf(o), t + o.j, o.look ? o.look : [Math.sin(t * .7 + o.j) * .5, 0], o.j);
          if (moodOf(o) === "sleep") zzz(ctx2, 40 * p.sc, m.fy - m.fr, t, .9);
          ctx2.restore();
          if (o.go && t > o.tg && t - o.tg < .6 && o.go.to !== "drawer" && o.go.to !== "right" && o.go.to !== "left") burstFx(ctx2, p.x, p.y - 150, t - o.tg - .3, GOLD, 10, 160);
          if (o.go && o.go.to === "drawer" && t - o.tg > .7 && t - o.tg < 1.3) dust(ctx2, dX, dy + 120, t - o.tg - .7, 6, .7);
          // tempt: the object jumps up and down calling for attention
          o.tt.forEach(T0 => { const k = t - T0; if (k < 0 || k > 1.2) return; burstFx(ctx2, p.x, p.y - 160 * p.sc, k * .8, o.kind === "phone" ? SKY : GOLD, 8, 150); });
          // speech bubbles (screen space, after grade)
          o.ts.forEach(z => { const k = t - z.T; if (k < 0 || k > (z.dur || 2.2)) return; const sp = c.toScreen(p.x, p.y - 290 * p.sc); TT.CS.ov.push(() => TT.bubble(ctx, z.text, sp[0], sp[1], k, { kind: z.kind || "say", size: 46, maxW: 420, t })); });
        });
      },
    });
  }, (s, f, i, add) => { (f.objs || []).forEach(o => { if (o.cue) add(cueT(s, o.cue, .2, i), "pop"); if (o.wake) add(cueT(s, o.wake, .2, i), "ping"); (o.say || []).forEach(z => add(tOf(s, z, .2, i), "pop")); (o.tempt || []).forEach(c => add(cueT(s, c, .3, i), "whoosh"));
    if (o.go) { const t0 = cueT(s, o.go.cue, .3, i); add(t0, "whoosh"); add(t0 + .7, o.go.to === "drawer" ? "pop" : "chime"); } }); });

  /* ================= _jangkau: reach ring ================= */
  S("jangkau", "Cerita: lingkar jangkauan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, rc = f.reach || {}, R0 = rc.r ?? 360, tR = tOf(s, rc, .1, idx), tS = T(s, rc.swapCue, .4, idx), tG = T(s, rc.grabCue, .3, idx);
    const items = (rc.items || []).map((o, j) => Object.assign({ j, T: o.cue ? T(s, o.cue, .3, idx) : -9 }, o));
    base(ctx, s, t, {
      spots: { ring: () => [540, 1150, null] },
      after: (ctx2, c, sts) => {
        const st = sts[0]; if (!st) return; const cx = st.x, cy = st.y - st.size * .5;
        layer(ctx2, c, 1, () => {
          if (t >= tR){ const q = eBack(clamp((t - tR) / .6, 0, 1)), r = R0 * q;
            glowAt(ctx2, cx, cy, r * 1.1, GOLD, .18 + .06 * Math.sin(t * 3));
            ctx2.save(); ctx2.strokeStyle = GOLD; ctx2.lineWidth = 12; ctx2.setLineDash([30, 18]); ctx2.lineDashOffset = -t * 60; ctx2.beginPath(); ctx2.arc(cx, cy, r, 0, TAU); ctx2.stroke(); ctx2.restore();
            ctx2.save(); ctx2.globalAlpha *= q; ctx2.translate(cx, cy - r - 10); font(ctx2, 900, 40, FAM); const lab = rc.label || "JANGKAUAN TANGAN", w = ctx2.measureText(lab).width + 50; rr(ctx2, -w / 2, -34, w, 64, 32); ctx2.fillStyle = ORANGE; ctx2.fill(); ol(ctx2, 6); ctx2.fillStyle = CREAM; ctx2.textAlign = "center"; ctx2.fillText(lab, 0, 14); ctx2.textAlign = "left"; ctx2.restore(); }
          const ins = items.filter(o => (t < tS ? o.side : (o.swap || o.side)) === "in"), outs = items.filter(o => (t < tS ? o.side : (o.swap || o.side)) !== "in");
          const slotOf = o => { const inside = (t < tS ? o.side : (o.swap || o.side)) === "in", L = inside ? ins : outs, j = L.indexOf(o), n = L.length;
            if (inside){ const a = Math.PI * (n === 1 ? .5 : .2 + .6 * j / Math.max(1, n - 1)); const hand = j % 2 ? -1 : 1; return [cx + (j % 2 ? -1 : 1) * R0 * .66, cy - 170 + Math.sin(t * 2 + j) * 12, 1.0]; }
            return [j % 2 ? 880 : 200, 450 + Math.floor(j / 2) * 250 + Math.sin(t * 1.4 + j) * 14, .78]; };
          items.forEach(o => { if (t < o.T) return; let [x, y, sc] = slotOf(o);
            if (t >= tS && t < tS + .9 && o.swap && o.swap !== o.side){ const q = eOut(clamp((t - tS) / .9, 0, 1)), saveS = tS; const prev = (() => { const L = items.filter(z => z.side === (o.side)); const j = L.indexOf(o), n = L.length;
                return o.side === "in" ? [cx + (j % 2 ? -1 : 1) * R0 * .66, cy - 170, 1.0] : [j % 2 ? 880 : 200, 450 + Math.floor(j / 2) * 250, .78]; })();
              x = lerp(prev[0], x, q); y = lerp(prev[1], y, q) - Math.sin(q * Math.PI) * 200; sc = lerp(prev[2], sc, q); speedLines(ctx2, x, y - 100, x > prev[0] ? 1 : -1, t, 3, 50); }
            const q = o.T > 0 ? pop(t, o.T, .4) : 1, inside = (t < tS ? o.side : (o.swap || o.side)) === "in", grab = inside && t > tG && t < tS ? Math.sin(t * 6 + o.j) * .1 : 0;
            ctx2.save(); ctx2.translate(x, y + 140 * sc); ctx2.scale(q, q); ctx2.rotate(grab + Math.sin(t * 1.5 + o.j) * .04);
            if (!inside){ ctx2.save(); ctx2.globalAlpha *= .8; ctx2.fillStyle = hexA("#FFFFFF", .4); ctx2.beginPath(); ctx2.ellipse(0, 6, 120 * sc, 18 * sc, 0, 0, TAU); ctx2.fill(); ctx2.restore(); }
            const m = objDraw(ctx2, o.kind, t, null, sc, o.j, inside && o.kind === "phone" && t < tS && Math.sin(t * 3) > .6);
            const mood = inside ? (o.good ? "grin" : "sly") : (o.good ? "frown" : "sleep"); oface(ctx2, 0, m.fy, m.fr, mood, t + o.j, null, o.j);
            if (mood === "sleep") zzz(ctx2, 40 * sc, m.fy - m.fr, t, .8);
            ctx2.restore();
            if (!inside && o.label){ ctx2.save(); ctx2.globalAlpha *= q; font(ctx2, 900, 30, FAM); const w = ctx2.measureText(o.label).width + 30; ctx2.translate(x, y + 175); rr(ctx2, -w / 2, -24, w, 44, 22); ctx2.fillStyle = hexA(BROWN, .85); ctx2.fill(); ctx2.fillStyle = CREAM; ctx2.textAlign = "center"; ctx2.fillText(o.label, 0, 10); ctx2.textAlign = "left"; ctx2.restore(); }
          });
          if (t >= tS && t < tS + 1.2) burstFx(ctx2, cx, cy, t - tS - .5, GOLD, 14, R0);
        });
      },
    });
  }, (s, f, i, add) => { const rc = f.reach || {}; add(tOf(s, rc, .1, i), "chime"); (rc.items || []).forEach(o => { if (o.cue) add(cueT(s, o.cue, .3, i), "pop"); }); if (rc.swapCue) { add(cueT(s, rc.swapCue, .4, i), "whoosh"); add(cueT(s, rc.swapCue, .4, i) + .9, "chime"); } });

  /* ================= _laporan: report page typed from zero / template ================= */
  function dayStamps(ctx, s, t, idx, list, y){ (list || []).forEach((d, j) => { const T0 = tOf(s, d, .3, idx), T1 = j + 1 < list.length ? tOf(s, list[j + 1], .3, idx) : (d.outCue ? T(s, d.outCue, .9, idx) : 1e9); if (t < T0 || t > T1) return; stampBox(ctx, d.text, 540, y || 330, t - T0, d.col || ORANGE, 66, j % 2 ? .08 : -.08); }); }
  S("laporan", "Cerita: halaman laporan dari nol / template", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, d = f.doc || {}, x = d.x ?? 760, y = d.y ?? 380, w = d.w ?? 440, h = d.h ?? 560, tmpl = d.mode === "template";
    const blocks = (d.blocks || []).map((b, j) => Object.assign({ j, T: tOf(s, b, .2 + j * .15, idx) }, b));
    const fills = (d.fill || []).map((b, j) => Object.assign({ j, T: tOf(s, b, .3 + j * .1, idx) }, b));
    const tW = T(s, d.wipeCue, .7, idx), tD = T(s, d.doneCue, .8, idx), tIn = d.cue ? T(s, d.cue, .1, idx) - .25 : (d.at ?? .1);
    base(ctx, s, t, {
      spots: { doc: [x, y + h / 2, null] },
      mid: (ctx2) => {
        const q = pop(t, tIn, .5), bob = Math.sin(t * 1.6) * 8, rot = Math.sin(t * 1.1) * .015 - .02;
        ctx2.save(); ctx2.translate(x, y + h / 2 + bob); ctx2.rotate(rot); ctx2.scale(q, q); ctx2.translate(-w / 2, -h / 2);
        glowAt(ctx2, w / 2, h / 2, w, tmpl ? GOLD : SKY, .18);
        ctx2.fillStyle = "rgba(0,0,0,.22)"; rr(ctx2, 14, 16, w, h, 14); ctx2.fill();
        ctx2.fillStyle = PAPER; rr(ctx2, 0, 0, w, h, 14); ctx2.fill(); ol(ctx2, 6);
        // wipe: eraser sweeps the page clean
        const wq = clamp((t - tW) / .9, 0, 1), wiped = t >= tW ? eIn(wq) : 0;
        ctx2.save(); rr(ctx2, 0, 0, w, h, 14); ctx2.clip();
        const lineW = (frac) => (w - 70) * frac;
        if (tmpl){ // ready structure (template): title bar + table grid + text lines in place
          ctx2.fillStyle = TEAL; ctx2.fillRect(0, 0, w, 74); textC(ctx2, d.title || "LAPORAN MINGGUAN", w / 2, 50, 34, CREAM, 900, w - 40);
          ctx2.strokeStyle = hexA(BROWN, .5); ctx2.lineWidth = 4; const gy = 110, rows = 4, rh = 58; for (let r = 0; r <= rows; r++){ ctx2.beginPath(); ctx2.moveTo(30, gy + r * rh); ctx2.lineTo(w - 30, gy + r * rh); ctx2.stroke(); } [30, w * .55, w - 30].forEach(cx => { ctx2.beginPath(); ctx2.moveTo(cx, gy); ctx2.lineTo(cx, gy + rows * rh); ctx2.stroke(); });
          ["Target", "Capaian", "Kendala", "Rencana"].forEach((l, r) => { font(ctx2, 700, 26, FAM); ctx2.fillStyle = BROWN; ctx2.fillText(l, 44, gy + r * rh + 38); });
          for (let r = 0; r < 4; r++){ ctx2.fillStyle = hexA(BROWN, .25); rr(ctx2, 40, 380 + r * 34, lineW(r % 2 ? .7 : .9), 12, 6); ctx2.fill(); }
          fills.forEach((o, j) => { const k = t - o.T; if (k < 0 || j > 3) { if (j <= 3){ ctx2.save(); ctx2.setLineDash([10, 8]); ctx2.strokeStyle = hexA(ORANGE, .6 + .3 * Math.sin(t * 5)); ctx2.lineWidth = 4; ctx2.strokeRect(w * .55 + 12, 110 + j * 58 + 10, w * .45 - 54, 38); ctx2.restore(); } return; }
            const sc = 1 + .5 * Math.exp(-k * 8); ctx2.save(); ctx2.translate(w * .78 - 6, 110 + j * 58 + 40); ctx2.scale(sc, sc); textC(ctx2, o.text || "✓", 0, 0, 32, ORANGE, 900, w * .4); ctx2.restore(); if (k < .5) burstFx(ctx2, w * .78, 110 + j * 58 + 29, k, HL, 6, 60); });
        } else {
          ctx2.globalAlpha *= 1 - (wq > 0 ? clamp(wq * 1.2, 0, 1) : 0) * 0;
          blocks.forEach(b => { const k = t - b.T; if (k < 0) return; const p = clamp(k / 1.1, 0, 1), by = b.y ?? (30 + b.j * 128);
            ctx2.save(); if (t >= tW){ ctx2.beginPath(); ctx2.rect(w * wiped, 0, w, h); ctx2.clip(); }
            if (b.kind === "title"){ ctx2.fillStyle = TEAL; ctx2.fillRect(0, by - 30, w * p, 74); if (p > .3){ ctx2.save(); ctx2.beginPath(); ctx2.rect(0, by - 30, w * p, 74); ctx2.clip(); textC(ctx2, b.label, w / 2, by + 20, 34, CREAM, 900, w - 40); ctx2.restore(); } }
            else if (b.kind === "table"){ ctx2.strokeStyle = hexA(BROWN, .6); ctx2.lineWidth = 4; const n = 3; for (let r = 0; r <= n; r++){ ctx2.beginPath(); ctx2.moveTo(30, by + r * 34); ctx2.lineTo(30 + (w - 60) * clamp(p * 1.6 - r * .15, 0, 1), by + r * 34); ctx2.stroke(); } }
            else { for (let r = 0; r < 3; r++){ const pr = clamp(p * 3 - r, 0, 1); if (pr <= 0) continue; ctx2.fillStyle = hexA(BROWN, .55); rr(ctx2, 40, by + r * 30, lineW(r === 2 ? .55 : .9) * pr, 12, 6); ctx2.fill(); } }
            // label tag of what is being typed
            if (k < 1.6 && t < tW){ const qq = pop(t, b.T, .3); ctx2.save(); ctx2.translate(w - 40, by - 20); ctx2.scale(qq, qq); ctx2.rotate(.06); font(ctx2, 900, 26, FAM); const tw = ctx2.measureText(b.tag || "").width + 26; if (b.tag){ rr(ctx2, -tw, -22, tw, 40, 20); ctx2.fillStyle = ORANGE; ctx2.fill(); ol(ctx2, 4); ctx2.fillStyle = CREAM; ctx2.textAlign = "right"; ctx2.fillText(b.tag, -13, 8); ctx2.textAlign = "left"; } ctx2.restore(); }
            ctx2.restore(); });
          // blinking caret
          const last = blocks.filter(b => t >= b.T).pop(); if (last && t < tW && Math.sin(t * 9) > 0){ const by = last.y ?? (30 + last.j * 128); ctx2.fillStyle = ORANGE; ctx2.fillRect(w - 50, by - 6, 8, 40); }
        }
        ctx2.restore();
        if (t >= tW && wq < 1){ const ex = w * wiped, ey = h * .5 + Math.sin(t * 30) * 60; ctx2.save(); ctx2.translate(ex, ey); ctx2.rotate(-.5); rr(ctx2, -60, -110, 120, 220, 18); ctx2.fillStyle = "#F7B7A3"; ctx2.fill(); ol(ctx2, 6); rr(ctx2, -60, 30, 120, 80, 18); ctx2.fillStyle = TEAL; ctx2.fill(); ol(ctx2, 6); ctx2.restore();
          dust(ctx2, ex, h * .8, (t * 2) % .8, 5, .6); }
        if (tmpl && t >= tD){ const k = t - tD; stampBox(ctx2, d.doneText || "SELESAI", w / 2, h * .62, k, GREEN, 60, -.12); if (k < .9) burstFx(ctx2, w / 2, h * .5, k, GOLD, 14, w * .7); }
        ctx2.restore();
      },
      midZ: 2,
      over: (ctx2) => { dayStamps(ctx2, s, t, idx, d.week, d.weekY || 1480); },
    });
  }, (s, f, i, add) => { const d = f.doc || {}; add(d.at ?? .1, "whoosh"); (d.blocks || []).forEach((b, j) => add(tOf(s, b, .2 + j * .15, i), "pop")); (d.fill || []).forEach((b, j) => add(tOf(s, b, .3 + j * .1, i), "pop"));
    if (d.wipeCue) add(cueT(s, d.wipeCue, .7, i), "whoosh"); if (d.doneCue) { add(cueT(s, d.doneCue, .8, i), "pop"); add(cueT(s, d.doneCue, .8, i) + .1, "chime"); } (d.week || []).forEach(w => add(tOf(s, w, .3, i), "pop")); });

  /* ================= _roda: hamster wheel ================= */
  S("roda", "Cerita: roda hamster", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, wh = f.wheel || {}, hj = wh.on ?? 0, R = wh.R ?? 400, cx = wh.x ?? 540, cy = GROUND - R - 40;
    const tRun = wh.runCue ? T(s, wh.runCue, .1, idx) : (wh.runAt ?? 0), tStop = T(s, wh.stopCue, .7, idx);
    const angAt = tt => { if (tt < tRun) return 0; const run = Math.min(tt, tStop) - tRun, after = Math.max(0, tt - tStop); return -(run * 2.6 + (1 - Math.exp(-after * 2)) * 1.3); };
    base(ctx, s, t, {
      spots: { wheel: [cx, cy, null], top: [cx, cy - R * .4, null] },
      prep: (a, j) => { if (j !== hj) return null; const b = Object.assign({}, a, { x: cx, y: GROUND - 40 - 24, keys: [{ at: tRun, x: cx + 2, run: true, dur: Math.max(.4, tStop - tRun) }].concat(a.keys || []) }); return { a: b, t }; },
      back: (ctx2) => {
        const ang = angAt(t);
        // stand
        ctx2.strokeStyle = OUT; ctx2.lineWidth = 34; ctx2.lineCap = "round"; [-1, 1].forEach(d => { ctx2.beginPath(); ctx2.moveTo(cx, cy); ctx2.lineTo(cx + d * R * .62, GROUND); ctx2.stroke(); });
        ctx2.strokeStyle = "#8A847E"; ctx2.lineWidth = 20; [-1, 1].forEach(d => { ctx2.beginPath(); ctx2.moveTo(cx, cy); ctx2.lineTo(cx + d * R * .62, GROUND); ctx2.stroke(); });
        // back rim + spokes
        ctx2.save(); ctx2.translate(cx, cy); ctx2.rotate(ang);
        ctx2.strokeStyle = hexA("#BDB6AE", .9); ctx2.lineWidth = 10; for (let k = 0; k < 12; k++){ const a = k / 12 * TAU; ctx2.beginPath(); ctx2.moveTo(0, 0); ctx2.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx2.stroke(); }
        ctx2.beginPath(); ctx2.arc(0, 0, R, 0, TAU); ctx2.strokeStyle = OUT; ctx2.lineWidth = 52; ctx2.stroke(); ctx2.strokeStyle = ORANGE; ctx2.lineWidth = 38; ctx2.stroke();
        // rungs + rim text
        const lab = (wh.label || "MULAI DARI NOL") + " • "; font(ctx2, 900, 26, FAM); ctx2.fillStyle = CREAM; ctx2.textAlign = "center";
        const per = 18 / R; let a0 = 0; for (let rep = 0; rep < 3; rep++){ for (const ch of lab){ const a = a0; ctx2.save(); ctx2.rotate(a); ctx2.translate(0, -R + 9); ctx2.fillText(ch, 0, 0); ctx2.restore(); a0 += (ctx2.measureText(ch).width + 2) / R; } a0 += .3; }
        ctx2.textAlign = "left";
        // start marker on the rim
        ctx2.save(); ctx2.rotate(Math.PI / 2); ctx2.translate(0, -R); ctx2.fillStyle = GOLD; ctx2.beginPath(); ctx2.arc(0, 0, 30, 0, TAU); ctx2.fill(); ol(ctx2, 6); ctx2.restore();
        ctx2.restore();
        ctx2.beginPath(); ctx2.arc(cx, cy, 40, 0, TAU); ctx2.fillStyle = "#8A847E"; ctx2.fill(); ol(ctx2, 6);
        // START flag at the bottom: the marker keeps coming back to it
        ctx2.save(); ctx2.translate(cx + 40, GROUND - 10); ctx2.fillStyle = BROWN; ctx2.fillRect(-4, -150, 8, 150); ctx2.beginPath(); ctx2.moveTo(4, -150); ctx2.lineTo(110, -122 + Math.sin(t * 6) * 6); ctx2.lineTo(4, -94); ctx2.closePath(); ctx2.fillStyle = RED; ctx2.fill(); ol(ctx2, 4);
        font(ctx2, 900, 22, FAM); ctx2.fillStyle = "#FFFFFF"; ctx2.fillText("NOL", 18, -114); ctx2.restore();
        const lap = Math.floor((-ang + Math.PI * 0) / TAU); if (-ang > .1){ const ph = ((-ang) % TAU) / TAU; if (ph < .12) burstFx(ctx2, cx, GROUND - 60, ph * 7, GOLD, 8, 120); }
      },
      front: (ctx2, c, sts) => {
        const ang = angAt(t); ctx2.save(); ctx2.translate(cx, cy); ctx2.rotate(ang); ctx2.strokeStyle = hexA(OUT, .55); ctx2.lineWidth = 8; for (let k = 0; k < 6; k++){ const a = k / 6 * TAU + .26; ctx2.beginPath(); ctx2.moveTo(Math.cos(a) * R * .18, Math.sin(a) * R * .18); ctx2.lineTo(Math.cos(a) * R * .96, Math.sin(a) * R * .96); ctx2.stroke(); } ctx2.restore();
        const st = sts[hj]; if (st && t > tRun && t < tStop){ const h = toonHead(st); for (let k = 0; k < 3; k++){ const q = (t * 1.6 + k / 3) % 1; ctx2.save(); ctx2.globalAlpha *= 1 - q; ctx2.fillStyle = SKY; ctx2.beginPath(); ctx2.ellipse(h[0] - 120 - q * 80 + k * 30, h[1] - 60 + q * 160, 12, 18, 0, 0, TAU); ctx2.fill(); ol(ctx2, 3); ctx2.restore(); }
          speedLines(ctx2, st.x - 140, st.y - st.size * .45, 1, t, 4, 90); }
        if (t >= tStop && t - tStop < .8) burstFx(ctx2, cx, cy, t - tStop, GOLD, 14, R * .8);
      },
      over: (ctx2) => { dayStamps(ctx2, s, t, idx, wh.weeks, wh.weekY || 300); },
    });
  }, (s, f, i, add) => { const wh = f.wheel || {}; if (wh.stopCue) { add(cueT(s, wh.stopCue, .7, i), "pop"); add(cueT(s, wh.stopCue, .7, i) + .05, "ping"); } (wh.weeks || []).forEach(w => add(tOf(s, w, .3, i), "pop")); add(wh.runCue ? cueT(s, wh.runCue, .1, i) : (wh.runAt ?? 0) + .05, "whoosh"); });

  /* ================= _cetak: cookie cutter template ================= */
  function cookie(ctx, w, h, t, face, num){
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - 34, -h / 2); ctx.lineTo(w / 2, -h / 2 + 34); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath();
    ctx.fillStyle = "#E3A859"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#B97A22", .5); ctx.beginPath(); ctx.moveTo(w / 2 - 34, -h / 2); ctx.lineTo(w / 2 - 34, -h / 2 + 34); ctx.lineTo(w / 2, -h / 2 + 34); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#C98A3E"; rr(ctx, -w / 2 + 16, -h / 2 + 18, w * .5, 16, 8); ctx.fill(); for (let k = 0; k < 2; k++){ rr(ctx, -w / 2 + 16, -h / 2 + 46 + k * 22, w - 50, 10, 5); ctx.fill(); }
    if (face) oface(ctx, 0, h * .16, w * .3, "smile", t, null, w);
    if (num){ ctx.save(); ctx.translate(w * .1, h * .3); ctx.rotate(-.1); const sc = 1 + .4 * Math.sin(t * 3) * .1; ctx.scale(sc, sc); rr(ctx, -40, -26, 80, 46, 14); ctx.fillStyle = num.col || "#F7B7A3"; ctx.fill(); ol(ctx, 4); textC(ctx, num.text, 0, 10, 28, BROWN, 900, 70); ctx.restore(); }
  }
  S("cetak", "Cerita: cetakan kue template", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, cu = f.cutter || {}, cy = cu.y ?? 1260, slots = cu.slots || [400, 560, 720], cw = cu.w ?? 140, ch = cu.h ?? 176;
    const tIn = tOf(s, cu, .1, idx), stamps = (cu.stamps || []).map((o, j) => Object.assign({ j, T: tOf(s, o, .2 + j * .2, idx) }, o)), tF = T(s, cu.fillCue, .5, idx), nums = cu.nums || [{ text: "12" }, { text: "15" }, { text: "9" }];
    base(ctx, s, t, {
      spots: { counter: [560, cy - 150, null] },
      front: (ctx2) => {
        // counter
        ctx2.fillStyle = "rgba(43,26,18,.25)"; ctx2.fillRect(-400, cy - 6, 1880, 22);
        ctx2.fillStyle = "#6F8F9E"; ctx2.fillRect(-400, cy + 34, 1880, 900); ctx2.strokeStyle = OUT; ctx2.lineWidth = 7; ctx2.strokeRect(-400, cy + 34, 1880, 900);
        for (let k = -2; k < 8; k++){ ctx2.strokeStyle = hexA(OUT, .35); ctx2.lineWidth = 5; ctx2.strokeRect(-100 + k * 220, cy + 80, 200, 300); }
        ctx2.fillStyle = "#F3E6D2"; rr(ctx2, -420, cy, 1920, 46, 12); ctx2.fill(); ol(ctx2, 7);
        // dough sheet
        if (t >= tIn){ const q = eOut(clamp((t - tIn) / .7, 0, 1)), dw = (slots[slots.length - 1] - slots[0] + cw + 80) * q; ctx2.fillStyle = "#F6DDB0"; rr(ctx2, (slots[0] + slots[slots.length - 1]) / 2 - dw / 2, cy - 22, dw, 30, 14); ctx2.fill(); ol(ctx2, 5); }
        // cookies (cut ones)
        stamps.forEach((o, j) => { const k = t - o.T - .35; if (k < 0) return; const x = slots[j % slots.length], hop = k < .5 ? Math.sin(k / .5 * Math.PI) * 60 : 0, sq = k < .5 ? 0 : Math.sin(Math.min(1, (k - .5) / .3) * Math.PI) * .08;
          ctx2.save(); ctx2.translate(x, cy - ch / 2 - 8 - hop); ctx2.scale(1 + sq, 1 - sq); ctx2.rotate(Math.sin(t * 2 + j) * .03); cookie(ctx2, cw, ch, t + j, true, t >= tF + j * .25 ? nums[j % nums.length] : null); ctx2.restore();
          if (t >= tF + j * .25 && t - tF - j * .25 < .6) burstFx(ctx2, x, cy - ch / 2, t - tF - j * .25, HL, 8, 120); });
        // cutter
        if (t >= tIn){ let x = slots[0], y = cy - ch - 300, sq = 0; const cur = stamps.filter(o => t >= o.T - .3).pop();
          if (cur){ const k = t - cur.T, xp = slots[cur.j % slots.length], prev = cur.j > 0 ? slots[(cur.j - 1) % slots.length] : slots[0];
            x = lerp(prev, xp, eOut(clamp((k + .3) / .3, 0, 1))); const down = k < 0 ? 0 : k < .18 ? eIn(k / .18) : k < .4 ? 1 : 1 - eOut(clamp((k - .4) / .35, 0, 1)); y = lerp(cy - ch - 300, cy - ch - 10, down); sq = k > .16 && k < .4 ? .1 : 0; }
          y += Math.sin(t * 3) * 10 * (cur ? 0 : 1); const q = pop(t, tIn, .4);
          ctx2.save(); ctx2.translate(x, y); ctx2.scale(q * (1 + sq), q * (1 - sq));
          ctx2.lineJoin = "round"; ctx2.beginPath(); ctx2.moveTo(-cw / 2 - 10, 0); ctx2.lineTo(cw / 2 - 26, 0); ctx2.lineTo(cw / 2 + 10, 36); ctx2.lineTo(cw / 2 + 10, ch + 10); ctx2.lineTo(-cw / 2 - 10, ch + 10); ctx2.closePath();
          ctx2.strokeStyle = OUT; ctx2.lineWidth = 26; ctx2.stroke(); ctx2.strokeStyle = "#C9D3D8"; ctx2.lineWidth = 15; ctx2.stroke();
          rr(ctx2, -cw / 2 - 30, -86, cw + 60, 78, 22); ctx2.fillStyle = ORANGE; ctx2.fill(); ol(ctx2, 6); textC(ctx2, cu.label || "TEMPLATE", 0, -36, 34, CREAM, 900, cw + 30);
          ctx2.restore();
          if (cur){ const k = t - cur.T - .18; if (k > 0 && k < .6){ dust(ctx2, x, cy, k, 7, .9); burstFx(ctx2, x, cy - ch / 2, k, GOLD, 10, 150); } } }
      },
    });
  }, (s, f, i, add) => { const cu = f.cutter || {}; add(tOf(s, cu, .1, i), "whoosh"); (cu.stamps || []).forEach((o, j) => { const t0 = tOf(s, o, .2 + j * .2, i); add(t0 + .18, "pop"); add(t0 + .45, "chime"); }); if (cu.fillCue) [0, 1, 2].forEach(j => add(cueT(s, cu.fillCue, .5, i) + j * .25, "pop")); });

  /* ================= _rapat: meeting table with idea bulbs ================= */
  function bulb(ctx, x, y, s, t, on, a){
    ctx.save(); ctx.globalAlpha *= a ?? 1; ctx.translate(x, y); ctx.scale(s, s); if (on) glowAt(ctx, 0, -10, 130, GOLD, .45 + .15 * Math.sin(t * 6));
    ctx.beginPath(); ctx.arc(0, -20, 46, Math.PI * .8, Math.PI * 2.2); ctx.lineTo(18, 30); ctx.lineTo(-18, 30); ctx.closePath(); ctx.fillStyle = on ? "#FFE58A" : "#D8D2C8"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#8A847E"; rr(ctx, -20, 30, 40, 26, 6); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = on ? ORANGE : "#9A948E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-12, 8); ctx.lineTo(-6, -14); ctx.lineTo(0, 4); ctx.lineTo(6, -14); ctx.lineTo(12, 8); ctx.stroke();
    if (on){ ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.lineCap = "round"; for (let k = 0; k < 5; k++){ const an = -Math.PI / 2 + (k - 2) * .5, r0 = 64 + Math.sin(t * 8 + k) * 4; ctx.beginPath(); ctx.moveTo(Math.cos(an) * r0, -20 + Math.sin(an) * r0); ctx.lineTo(Math.cos(an) * (r0 + 22), -20 + Math.sin(an) * (r0 + 22)); ctx.stroke(); } }
    ctx.restore(); }
  function meetTable(ctx, x, w, ty, t){
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(x - w / 2, ty + 10, w, 20);
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(x - w / 2 + 30, ty + 30, w - 60, 700); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.strokeRect(x - w / 2 + 30, ty + 30, w - 60, 700);
    ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 4; for (let k = 1; k < 4; k++){ ctx.beginPath(); ctx.moveTo(x - w / 2 + 30 + k * (w - 60) / 4, ty + 40); ctx.lineTo(x - w / 2 + 30 + k * (w - 60) / 4, ty + 700); ctx.stroke(); }
    ctx.fillStyle = "#C47A48"; rr(ctx, x - w / 2, ty, w, 44, 14); ctx.fill(); ol(ctx, 7); }
  S("rapat", "Cerita: meja rapat + bola lampu ide", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, tb = f.table || {}, tx = tb.x ?? 540, tw = tb.w ?? 1200, ty = tb.y ?? 1330;
    const bulbs = (f.bulbs || []).map((b, j) => Object.assign({ j, T: tOf(s, b, .2 + j * .1, idx), O: T(s, b.outCue, .8, idx) }, b));
    base(ctx, s, t, {
      spots: { table: [tx, ty - 200, null] },
      front: (ctx2, c, sts) => {
        meetTable(ctx2, tx, tw, ty, t);
        (tb.props || []).forEach(p => { ctx2.save(); ctx2.translate(p.x, ty + 4); if (p.kind === "mug"){ ctx2.fillStyle = p.col || CREAM; rr(ctx2, -26, -60, 52, 60, 8); ctx2.fill(); ol(ctx2, 5); ctx2.strokeStyle = OUT; ctx2.lineWidth = 5; ctx2.beginPath(); ctx2.arc(28, -32, 13, -1.3, 1.3); ctx2.stroke();
            for (let k = 0; k < 2; k++){ const q = ((t * .5 + k / 2) % 1); ctx2.save(); ctx2.globalAlpha *= .5 * Math.sin(q * Math.PI); ctx2.strokeStyle = "#FFFFFF"; ctx2.lineWidth = 6; ctx2.beginPath(); ctx2.moveTo(-6 + k * 10, -70 - q * 60); ctx2.quadraticCurveTo(-16 + k * 10, -90 - q * 60, -4 + k * 10, -110 - q * 60); ctx2.stroke(); ctx2.restore(); } }
            else if (p.kind === "papers"){ for (let k = 0; k < 4; k++){ ctx2.fillStyle = k % 2 ? PAPER : "#F3E6D2"; ctx2.save(); ctx2.rotate((rnd(k + p.x) - .5) * .15); rr(ctx2, -70, -8 - k * 8, 140, 10, 2); ctx2.fill(); ctx2.restore(); } }
            else if (p.kind === "laptop"){ ctx2.fillStyle = "#544E42"; rr(ctx2, -90, -120, 180, 120, 10); ctx2.fill(); ol(ctx2, 5); ctx2.fillStyle = ORANGE; ctx2.beginPath(); ctx2.arc(0, -60, 12, 0, TAU); ctx2.fill(); }
            ctx2.restore(); });
        bulbs.forEach(b => { const k = t - b.T; if (k < 0) return; const st = sts[b.on ?? 0]; if (!st) return; const h = toonHead(st), q = pop(t, b.T, .4), ko = t - b.O;
          let x = h[0] + (b.dx || 0), y = h[1] - st.size * .42 + Math.sin(t * 2.4 + b.j) * 10; let a = 1, on = true;
          if (ko > 0){ on = false; y -= ko * 260; x += Math.sin(ko * 4 + b.j) * 40; a = clamp(1 - ko / 1.6, 0, 1); }
          if (a > 0) bulb(ctx2, x, y, q * (b.s || .9), t, on, a); if (k < .6) burstFx(ctx2, x, y, k, GOLD, 10, 120);
          if (ko > 0 && ko < 1.6){ ctx2.save(); ctx2.globalAlpha *= a * .6; for (let i = 0; i < 4; i++){ ctx2.beginPath(); ctx2.arc(x + Math.sin(t * 3 + i) * 30, y + 60 + i * 30, 10 + i * 4, 0, TAU); ctx2.fillStyle = "#D8D2C8"; ctx2.fill(); } ctx2.restore(); } });
      },
    });
  }, (s, f, i, add) => { (f.bulbs || []).forEach((b, j) => { add(tOf(s, b, .2 + j * .1, i), "ping"); }); const outs = [...new Set((f.bulbs || []).map(b => b.outCue).filter(Boolean))]; outs.forEach(o => add(cueT(s, o, .8, i), "whoosh")); });

  /* ================= _kentang: hot potato task ================= */
  S("kentang", "Cerita: kentang panas tugas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, pt = f.potato || {}, toons = f.toons || [];
    const tosses = (pt.tosses || []).map((o, j) => Object.assign({ j, T: tOf(s, o, .2 + j * .2, idx) }, o)), tDrop = T(s, pt.dropCue, .5, idx), tWeb = T(s, pt.webCue, .7, idx), tIn = pt.at ?? .3, dropX = pt.dropX ?? 540;
    let P = [540, 900];
    base(ctx, s, t, {
      spots: { potato: () => [dropX, GROUND - 300, null] },
      after: (ctx2, c, sts) => {
        // where is the potato?
        const handP = j => { const st = sts[j]; if (!st) return [540, 1000]; const h = toonHead(st); return [h[0] + (st.face || 1) * st.size * .04, h[1] - st.size * .36]; };
        let holder = pt.start ?? 0, x, y, rot = 0, flying = false, hot = 1;
        const cur = tosses.filter(o => t >= o.T).pop(), prevHolder = cur ? (cur.j > 0 ? tosses[cur.j - 1].to : (pt.start ?? 0)) : (pt.start ?? 0);
        if (t < tIn + .6){ const q = clamp((t - tIn) / .6, 0, 1), h = handP(holder); x = h[0]; y = lerp(-300, h[1], eIn(q)); rot = q * 6; }
        else if (cur && t < cur.T + .7 && t < tDrop){ const q = clamp((t - cur.T) / .7, 0, 1), a = handP(prevHolder), b = handP(cur.to); x = lerp(a[0], b[0], q); y = lerp(a[1], b[1], q) - Math.sin(q * Math.PI) * 340; rot = q * 9; flying = true; }
        else { holder = cur ? cur.to : (pt.start ?? 0); const h = handP(holder); x = h[0] + Math.sin(t * 22) * 8; y = h[1] - Math.abs(Math.sin(t * 11)) * 30; rot = Math.sin(t * 13) * .2; }
        if (t >= tDrop){ const from = [x, y], q = clamp((t - tDrop) / .6, 0, 1), k = t - tDrop - .6; x = lerp(from[0], dropX, q); y = q < 1 ? lerp(from[1], GROUND - 175, eIn(q)) - Math.sin(q * Math.PI) * 220 : GROUND - 175 + (k < .3 ? -Math.abs(Math.sin(k / .3 * Math.PI)) * 30 : 0); rot = q < 1 ? q * 5 : 0; hot = clamp(1 - (t - tDrop) / 1.6, 0, 1); }
        P = [x, y];
        layer(ctx2, c, 1, () => {
          if (t < tIn) return;
          const boxQ = pop(t, tDrop - .2, .4), bw = 330, bh = 190;
          if (t >= tDrop - .2){ ctx2.save(); ctx2.translate(dropX, GROUND); ctx2.scale(boxQ, boxQ); ctx2.fillStyle = "#B98A55"; ctx2.beginPath(); ctx2.moveTo(-bw / 2, -bh); ctx2.lineTo(-bw / 2 - 60, -bh - 70); ctx2.lineTo(-bw / 2 + 40, -bh - 80); ctx2.lineTo(-bw / 2 + 60, -bh); ctx2.closePath(); ctx2.fill(); ol(ctx2, 5);
            ctx2.beginPath(); ctx2.moveTo(bw / 2, -bh); ctx2.lineTo(bw / 2 + 60, -bh - 70); ctx2.lineTo(bw / 2 - 40, -bh - 80); ctx2.lineTo(bw / 2 - 60, -bh); ctx2.closePath(); ctx2.fill(); ol(ctx2, 5); ctx2.fillStyle = "#7A5530"; ctx2.fillRect(-bw / 2, -bh - 6, bw, 20); ctx2.restore(); }
          // sprouts: a week passes and the forgotten potato starts to sprout
          if (t >= tWeb){ const q = eOut(clamp((t - tWeb) / 1.4, 0, 1)); ctx2.save(); ctx2.lineCap = "round"; [[-40, -1], [10, .4], [50, 1]].forEach(([dx, d], i) => { const L = (90 + i * 30) * q, sw = Math.sin(t * 1.5 + i) * 10;
              ctx2.strokeStyle = OUT; ctx2.lineWidth = 16; ctx2.beginPath(); ctx2.moveTo(x + dx, y - 50); ctx2.quadraticCurveTo(x + dx + d * 40 + sw, y - 50 - L * .6, x + dx + d * 20 + sw, y - 50 - L); ctx2.stroke(); ctx2.strokeStyle = "#7FA563"; ctx2.lineWidth = 9; ctx2.stroke();
              if (q > .5){ ctx2.save(); ctx2.translate(x + dx + d * 20 + sw, y - 50 - L); ctx2.rotate(d * .6); ctx2.scale((q - .5) * 2, (q - .5) * 2); ctx2.beginPath(); ctx2.ellipse(14, 0, 22, 11, 0, 0, TAU); ctx2.fillStyle = "#7FA563"; ctx2.fill(); ol(ctx2, 4); ctx2.restore(); } }); ctx2.restore(); }
          ctx2.save(); ctx2.translate(x, y); ctx2.rotate(rot * .3); ctx2.scale(.95, .95);
          ctx2.fillStyle = "rgba(43,26,18,.2)"; if (t >= tDrop + .6){ ctx2.beginPath(); ctx2.ellipse(0, 66, 110, 16, 0, 0, TAU); ctx2.fill(); }
          if (hot > 0) glowAt(ctx2, 0, 0, 200, RED, .3 * hot + .1 * Math.sin(t * 9) * hot);
          ctx2.beginPath(); ctx2.ellipse(0, 0, 110, 76, .15, 0, TAU); ctx2.fillStyle = hot > .3 ? "#D99A4E" : lerpHex("#B88A5A", "#9A8C7E", 1 - hot); ctx2.fill(); ol(ctx2, 7);
          ctx2.fillStyle = hexA("#8E4E2E", .5); [[-50, -30], [40, 30], [60, -24], [-20, 40]].forEach(([a, b]) => { ctx2.beginPath(); ctx2.arc(a, b, 7, 0, TAU); ctx2.fill(); });
          if (hot > .3){ ctx2.fillStyle = hexA(RED, .35 * hot); ctx2.beginPath(); ctx2.ellipse(0, 0, 110, 76, .15, 0, TAU); ctx2.fill(); }
          oface(ctx2, -6, -6, 56, t >= tDrop + .6 ? (t > tWeb ? "sleep" : "frown") : flying ? "O" : "wavy", t, null, 3);
          // tag
          ctx2.save(); ctx2.translate(20, -78); ctx2.rotate(-.08); font(ctx2, 900, 30, FAM); const lab = pt.label || "PESAN TEMPAT", w = ctx2.measureText(lab).width + 30; rr(ctx2, -w / 2, -24, w, 46, 10); ctx2.fillStyle = PAPER; ctx2.fill(); ol(ctx2, 5); ctx2.fillStyle = BROWN; ctx2.textAlign = "center"; ctx2.fillText(lab, 0, 10); ctx2.textAlign = "left"; ctx2.restore();
          ctx2.restore();
          // steam
          if (hot > 0) for (let k = 0; k < 4; k++){ const q = ((t * .9 + k / 4) % 1); ctx2.save(); ctx2.globalAlpha *= .7 * Math.sin(q * Math.PI) * hot; ctx2.strokeStyle = "#FFFFFF"; ctx2.lineWidth = 10; ctx2.lineCap = "round"; ctx2.beginPath(); ctx2.moveTo(x - 50 + k * 34, y - 110 - q * 120); ctx2.quadraticCurveTo(x - 70 + k * 34 + Math.sin(q * 7) * 20, y - 150 - q * 120, x - 46 + k * 34, y - 190 - q * 120); ctx2.stroke(); ctx2.restore(); }
          if (flying) speedLines(ctx2, x, y, 1, t, 3, 60);
          if (t >= tDrop - .2){ ctx2.save(); ctx2.translate(dropX, GROUND); ctx2.scale(boxQ, boxQ); ctx2.fillStyle = "rgba(43,26,18,.25)"; ctx2.beginPath(); ctx2.ellipse(0, 4, bw * .6, 16, 0, 0, TAU); ctx2.fill();
            rr(ctx2, -bw / 2, -bh, bw, bh, 8); ctx2.fillStyle = "#D9A066"; ctx2.fill(); ol(ctx2, 6); ctx2.save(); ctx2.rotate(-.05); rr(ctx2, -110, -bh + 22, 220, 68, 10); ctx2.fillStyle = PAPER; ctx2.fill(); ol(ctx2, 5); textC(ctx2, pt.box || "NANTI", 0, -bh + 70, 44, RED, 900, 200); ctx2.restore(); ctx2.restore(); }
          if (t >= tDrop + .6 && t < tDrop + 1.4) dust(ctx2, dropX, GROUND, t - tDrop - .6, 8, 1);
          // cobwebs grow
          if (t >= tWeb){ const q = eOut(clamp((t - tWeb) / 1.2, 0, 1)); ctx2.save(); ctx2.globalAlpha *= .85; ctx2.strokeStyle = "#FFFFFF"; ctx2.lineWidth = 4;
            [[dropX - 165, GROUND - 190, 1], [dropX + 165, GROUND - 190, -1]].forEach(([wx, wy, d]) => { const R2 = 150 * q; for (let k = 0; k < 6; k++){ const a = (d > 0 ? 0 : Math.PI / 2) + k / 5 * Math.PI / 2; ctx2.beginPath(); ctx2.moveTo(wx, wy); ctx2.lineTo(wx + Math.cos(a) * R2 * d, wy + Math.sin(a) * R2); ctx2.stroke(); }
              for (let r = 1; r <= 3; r++){ ctx2.beginPath(); for (let k = 0; k < 6; k++){ const a = (d > 0 ? 0 : Math.PI / 2) + k / 5 * Math.PI / 2, rr2 = R2 * r / 3; const px = wx + Math.cos(a) * rr2 * d, py = wy + Math.sin(a) * rr2; k ? ctx2.lineTo(px, py) : ctx2.moveTo(px, py); } ctx2.stroke(); } });
            ctx2.restore(); for (let k = 0; k < 6; k++){ const q2 = ((t * .3 + k / 6) % 1); ctx2.save(); ctx2.globalAlpha *= .5 * Math.sin(q2 * Math.PI); ctx2.fillStyle = "#EADBC6"; ctx2.beginPath(); ctx2.arc(dropX - 200 + k * 80, GROUND - 260 + q2 * 200, 6, 0, TAU); ctx2.fill(); ctx2.restore(); } }
        });
      },
      over: (ctx2) => { dayStamps(ctx2, s, t, idx, f.day, 330); },
    });
  }, (s, f, i, add) => { const pt = f.potato || {}; add((pt.at ?? .3) + .6, "pop"); (pt.tosses || []).forEach((o, j) => add(tOf(s, o, .2 + j * .2, i), "whoosh")); if (pt.dropCue) { add(cueT(s, pt.dropCue, .5, i) + .6, "pop"); } if (pt.webCue) add(cueT(s, pt.webCue, .7, i), "ping"); (f.day || []).forEach(d => add(tOf(s, d, .3, i), "pop")); });
  function lerpHex(a, b, q){ const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(q, 0, 1))).toString(16).padStart(2, "0")).join(""); }

  /* ================= _mesin: decision machine ================= */
  S("mesin", "Cerita: mesin keputusan siapa-apa-kapan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, m = f.machine || {}, mx = m.x ?? 540, my = m.y ?? 300, mw = m.w ?? 760, mh = m.h ?? 560, tIn = m.at ?? .1;
    const pulls = (m.pulls || []).map((o, j) => Object.assign({ j, T: tOf(s, o, .2 + j * .3, idx) }, o)), tDone = T(s, m.doneCue, .8, idx), cols = m.cols || ["SIAPA", "APA", "KAPAN"];
    base(ctx, s, t, {
      spots: { machine: [mx, my + mh / 2, null], reels: [mx, my + mh * .45, null] },
      back: (ctx2, c, sts) => {
        const q = pop(t, tIn, .5), cur = pulls.filter(o => t >= o.T).pop(), k = cur ? t - cur.T : -1;
        ctx2.save(); ctx2.translate(mx, my + mh); ctx2.scale(q, q); ctx2.translate(-mx, -(my + mh));
        // lever
        const lv = k >= 0 && k < .5 ? Math.sin(k / .5 * Math.PI) : 0, lx = mx + mw / 2 + 50, ly = my + mh * .45;
        ctx2.strokeStyle = OUT; ctx2.lineWidth = 26; ctx2.lineCap = "round"; ctx2.beginPath(); ctx2.moveTo(lx - 50, ly); ctx2.lineTo(lx, ly); ctx2.lineTo(lx + 10, ly - 220 + lv * 300); ctx2.stroke(); ctx2.strokeStyle = "#BDB6AE"; ctx2.lineWidth = 14; ctx2.stroke();
        ctx2.beginPath(); ctx2.arc(lx + 10, ly - 220 + lv * 300, 40, 0, TAU); ctx2.fillStyle = RED; ctx2.fill(); ol(ctx2, 6);
        // body
        glowAt(ctx2, mx, my + mh / 2, mw * .8, GOLD, cur && k < 2 ? .3 : .12);
        rr(ctx2, mx - mw / 2, my, mw, mh, 50); ctx2.fillStyle = TEAL; ctx2.fill(); ol(ctx2, 8);
        rr(ctx2, mx - mw / 2 + 30, my - 70, mw - 60, 110, 40); ctx2.fillStyle = ORANGE; ctx2.fill(); ol(ctx2, 7); textC(ctx2, m.title || "KEPUTUSAN RAPAT", mx, my + 4, 46, CREAM, 900, mw - 120);
        // lights around the title
        for (let i = 0; i < 12; i++){ const lit = (Math.floor(t * 8) + i) % 3 === 0; ctx2.beginPath(); ctx2.arc(mx - mw / 2 + 60 + i * (mw - 120) / 11, my + 52, 9, 0, TAU); ctx2.fillStyle = lit ? GOLD : "#2B5458"; ctx2.fill(); }
        // reels
        const rw = (mw - 100) / 3, rh = 250, ry = my + 120;
        cols.forEach((cn, ci) => { const rx = mx - mw / 2 + 50 + ci * rw;
          textC(ctx2, cn, rx + rw / 2, ry - 12 + 4, 28, GOLD, 900, rw - 10);
          rr(ctx2, rx + 8, ry + 8, rw - 16, rh, 18); ctx2.fillStyle = PAPER; ctx2.fill(); ol(ctx2, 6);
          ctx2.save(); rr(ctx2, rx + 8, ry + 8, rw - 16, rh, 18); ctx2.clip();
          const stopT = cur ? cur.T + .7 + ci * .35 : -1, spinning = cur && t < stopT, val = cur ? [cur.who, cur.what, cur.when][ci] : "?";
          if (spinning){ const off = (t * 1400) % 90; const junk = ["?", "...", "nanti", "?", "siapa ya"]; for (let r = -1; r < 4; r++){ ctx2.save(); ctx2.globalAlpha *= .7; textC(ctx2, junk[(r + Math.floor(t * 15)) % junk.length], rx + rw / 2, ry + 8 + r * 90 + off, 34, hexA(BROWN, .7), 800, rw - 30); ctx2.restore(); }
            ctx2.fillStyle = hexA(BROWN, .15); ctx2.fillRect(rx, ry, rw, rh + 16); }
          else { const ks = cur ? t - stopT : 9, b = ks < .4 ? Math.sin(ks / .4 * Math.PI) * 20 * (1 - ks / .4) : 0; const lines = String(val).split("\n");
            lines.forEach((ln, li) => textC(ctx2, ln, rx + rw / 2, ry + 8 + rh / 2 + 16 + b + (li - (lines.length - 1) / 2) * 50, cur ? 44 : 80, cur ? BROWN : hexA(BROWN, .35), 900, rw - 34));
            if (cur && ks < .5) burstFx(ctx2, rx + rw / 2, ry + rh / 2, ks, GOLD, 8, 120); }
          ctx2.restore(); });
        // win line
        if (cur && t > cur.T + 1.4){ ctx2.save(); ctx2.globalAlpha *= .6 + .4 * Math.sin(t * 8); ctx2.strokeStyle = RED; ctx2.lineWidth = 8; ctx2.beginPath(); ctx2.moveTo(mx - mw / 2 + 40, ry + 8 + rh / 2); ctx2.lineTo(mx + mw / 2 - 40, ry + 8 + rh / 2); ctx2.stroke(); ctx2.restore(); }
        // slot for tickets
        rr(ctx2, mx - 160, my + mh - 70, 320, 30, 15); ctx2.fillStyle = OUT; ctx2.fill();
        ctx2.restore();
      },
      after: (ctx2, c, sts) => {
        layer(ctx2, c, 1, () => {
          pulls.forEach(o => { const k = t - o.T - 1.6; if (k < 0) return; const st = sts[o.to]; if (!st) return; const h = handOf(st), q = eOut(clamp(k / .8, 0, 1)), sx = mx, sy = my + mh - 40;
            const x = lerp(sx, h[0], q), y = lerp(sy + 60 * clamp(k / .3, 0, 1), h[1] - 40, q) - Math.sin(q * Math.PI) * 260;
            ctx2.save(); ctx2.translate(x, y); ctx2.rotate((1 - q) * 6 * (o.to % 2 ? 1 : -1) + Math.sin(t * 3) * .05); const sc = .7 + .3 * q; ctx2.scale(sc, sc);
            rr(ctx2, -130, -60, 260, 120, 10); ctx2.fillStyle = PAPER; ctx2.fill(); ol(ctx2, 6); ctx2.fillStyle = ORANGE; ctx2.fillRect(-130, -60, 260, 30); ctx2.strokeRect(-130, -60, 260, 30);
            textC(ctx2, String(o.what).replace(/\n/g, " "), 0, 10, 30, BROWN, 900, 230); textC(ctx2, o.when, 0, 46, 26, RED, 800, 230);
            if (t >= tDone){ const kk = t - tDone; ctx2.save(); ctx2.translate(80, 20); ctx2.scale(pop(t, tDone + o.j * .2, .3), pop(t, tDone + o.j * .2, .3)); ctx2.beginPath(); ctx2.arc(0, 0, 36, 0, TAU); ctx2.fillStyle = GREEN; ctx2.fill(); ol(ctx2, 5); ico(ctx2, "check", 0, 0, 44, "#FFFFFF", 3.4); ctx2.restore(); }
            ctx2.restore(); if (q < 1) speedLines(ctx2, x, y, h[0] > sx ? 1 : -1, t, 3, 50); });
          if (t >= tDone){ const k = t - tDone; for (let i = 0; i < 40; i++){ const x0 = rnd(i) * 1080, y0 = -100 + ((k * (260 + rnd(i + 5) * 200) + rnd(i + 9) * 900) % 1500) + 200; ctx2.save(); ctx2.translate(x0 + Math.sin(k * 3 + i) * 30, y0); ctx2.rotate(k * 5 + i); ctx2.fillStyle = [ORANGE, GOLD, CREAM, TEAL, RED][i % 5]; ctx2.fillRect(-10, -6, 20, 12); ctx2.restore(); } }
        });
      },
    });
  }, (s, f, i, add) => { const m = f.machine || {}; add((m.at ?? .1) + .1, "pop"); (m.pulls || []).forEach((o, j) => { const t0 = tOf(s, o, .2 + j * .3, i); add(t0, "whoosh"); [0, 1, 2].forEach(c => add(t0 + .7 + c * .35, "pop")); add(t0 + 1.5, "chime"); add(t0 + 1.7, "whoosh"); }); if (m.doneCue) { add(cueT(s, m.doneCue, .8, i), "chime"); } });

})();
