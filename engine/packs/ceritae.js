/* Scene pack ceritae: MODE CERITA story scenes (prefix ce_) for SC24, MS24, SB25, SP25, RN25.
   Every scene = full-screen environment + toons (f.toons, actor format of layout "cerita"; extra: sizes:[{cue|at, size, dur}] = grow/shrink)
   + camera (f.cam, on:<toon index|id|"obj">) + cards (f.cards) + pop words (f.words) + title stamp (f.stamp) + one story object:
     ce_tagihan  bill monsters (paper sheets with eyes + legs) chase the hero (mode kejar) or come back and get paid, turning happy (mode jinak)
                 f.mode, f.mons [{cue, label, col}], f.chest {x, fillCue, payCue}
     ce_dompet   the hero shakes an empty wallet: coins drop, a moth flutters out, dust            f.wallet {openCue, shakeCue}
     ce_kincir   night fair ferris wheel with 12 month cabins; the JUL cabin carries the bill monsters and comes back every turn   f.wheel {cue, yearTag}, f.glowCue
     ce_kue      giant cake "Rp12 juta" sliced into 12 month slices; one slice flies to the hero   f.cake {label, cutCue, sliceCue, sliceTag}
     ce_hakim    a mini judge (the inner critic) on the hero's shoulder bangs a gavel: words hit, the hero shrinks (mode hakim);
                 or turns into a kind friend and the hero grows back (mode sahabat)          f.judge {inCue, hits:[{cue, word}], turnCue, say:[{cue, text}]}
     ce_telepon  diagonal split screen phone call: friend on a night balcony | hero at home     f.left {env, toons, cam}, f.right {...}, f.splitAt
     ce_kata     words as objects: soft pillows land on the mini friend, heavy stones fall on the mini self   f.softCue, f.hardCue, f.soft, f.hard
     ce_lampion  rooftop night: the hero writes a kind line on a paper lantern and releases it   f.lantern {text, writeCue, flyCue}
     ce_raksasa  colleagues grow into giants with badges while the hero shrinks (toon sizes)   f.badges [{toon, cue, kind: medal|mic, text}]
     ce_lomba    street race: different start gates far apart, camera pans between them       f.gates [{x, label, sub}], f.track
     ce_tv       retro CRT TV plays a sepia VHS memory of the past self (rewind)               f.tv {onCue, rewindCue, label, past (actor)}
     ce_ukur     growth marks on a tree trunk: the hero grows, old/new marks with tags           f.marks [{cue, size, text, old, swapCue}], f.upCue
     ce_botol    beach: a note rolls into a bottle and joins a row of bottles on a rock          f.note {text, writeCue, rollCue}, f.row {cue, labels}
     ce_kotak    "?" boxes (small decisions) drop on the hero's head; each bonk knocks an energy coin off   f.boxes [{cue, label}], f.coins
     ce_buntu    office: big PROYEK box, loading spinner over the hero, tumbleweed, melting hero  f.big {cue, label}, f.loadCue, f.weedCue, f.meltCue
     ce_autopilot the hero rides a self-driving "RUTINITAS" cart; road boxes get auto-checked; coins stay full   f.cart {label}, f.boxes [{label}], f.saveCue
     ce_lemari   wardrobe with outfits per weekday, breakfast plate, 3 priority notes; night turns to morning   f.days [{cue}], f.plateCue, f.notesCue, f.morningCue
     ce_kunci    a "?" box is caught, wound up with a key and walks by itself as a routine toy   f.box {label, dropCue, windCue, walkCue}
     ce_truk     delivery truck breaks down; a late package lands in the hero's arms; three portraits pop   f.truck {stopCue}, f.pkgCue, f.faces [{cue, label, actor}]
     ce_gaya     quick-change spin: the hero's outfit changes per listener while the same package stays in her arms
                 f.looks [{cue, look, tag}], f.pkg, f.pan (long two-room world: f.rooms), f.coupon {cue}, f.chips [{cue, text}]
     ce_trio     three versions of the hero hold the same package: link lines, cover gag, inflate gag, JUJUR stamp   f.linkCue, f.coverCue, f.inflateCue, f.stampCue
     ce_batu     park pond: the hero hops across two stepping stones with question signs to the "KIRIM" flag   f.stones [{cue, label}], f.flag {cue, label} */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, drawToon, prop, infoCard, titleStamp, bubble, outlineWords, CS, TAU } = TT;
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", RED = "#D9483B", GREEN = "#4E9A4E", GOLD = "#F2B33D", FAM = "Poppins", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const ol = (ctx, w) => { ctx.strokeStyle = OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const popQ = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  const fitFont = (ctx, txt, w, size, min, weight) => { let z = size; font(ctx, weight || 800, z, FAM); while (ctx.measureText(txt).width > w && z > (min || 18)){ z -= 2; font(ctx, weight || 800, z, FAM); } return z; };
  const over = fn => { if (CS && CS.active) CS.ov.push(fn); else fn(); };
  const ctext = (ctx, txt, x, y, w, size, col, weight) => { fitFont(ctx, txt, w, size, 16, weight); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; };
  function starP(ctx, x, y, s){ ctx.beginPath(); for (let i = 0; i < 8; i++){ const r = i % 2 ? s * .38 : s, a = i * Math.PI / 4; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); }
  function sparkles(ctx, x, y, dt, n, R0, col){ if (dt < 0 || dt > .9) return; const q = eOut(dt / .9);
    for (let k = 0; k < n; k++){ const a = k / n * TAU + .4; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.fillStyle = col || (k % 2 ? HL : "#FFE9B8"); starP(ctx, x + Math.cos(a) * (R0 * .3 + q * R0), y + Math.sin(a) * (R0 * .3 + q * R0), 16 * (1 - q * .5)); ctx.restore(); } }
  function impact(ctx, x, y, dt, R0, col){ if (dt < 0 || dt > .45) return; const q = dt / .45; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.strokeStyle = col || CREAM; ctx.lineWidth = 10 * (1 - q) + 2; ctx.lineCap = "round";
    for (let k = 0; k < 9; k++){ const a = k / 9 * TAU + .2, r0 = R0 * (.4 + q * .6), r1 = R0 * (.75 + q * .9); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); } ctx.restore(); }
  function dust(ctx, x, y, dt, n, R0){ if (dt < 0 || dt > .8) return; const q = eOut(dt / .8);
    for (let k = 0; k < n; k++){ const d = k % 2 ? 1 : -1, xx = x + d * (20 + q * R0 * (.6 + rnd(k) * .6)), yy = y - q * 40 * rnd(k + 3); ctx.save(); ctx.globalAlpha *= (1 - q) * .8; ctx.fillStyle = "#F3E2C8"; ctx.beginPath(); ctx.arc(xx, yy, 14 + q * 26 * rnd(k + 5), 0, TAU); ctx.fill(); ctx.restore(); } }
  // big outlined pop word (screen space, after grading)
  function popWord(ctx, text, x, y, T, t, o){
    o = o || {}; const q = t - T, out = o.out ?? 1e9; if (q < 0 || t > out + .3) return;
    over(() => { const s = eBack(clamp(q / .32, 0, 1)) * (1 - .3 * clamp((t - out) / .3, 0, 1)), a = 1 - clamp((t - out) / .3, 0, 1);
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate((o.rot ?? -4) * Math.PI / 180 + Math.sin(t * 3) * .015); ctx.scale(s, s);
      const U = String(text).toUpperCase(); let size = o.size || 96; font(ctx, 800, size, FAM); while (ctx.measureText(U).width > (o.maxW || 860) && size > 40){ size -= 4; font(ctx, 800, size, FAM); }
      outlineWords(ctx, U.split(" ").map(w => ({ w, hl: !!o.hl })), 0, 0, size, { sw: size * .24, hl: o.color || HL }); ctx.restore(); });
  }
  // pill tag (world or screen): rounded label
  function pillTag(ctx, text, x, y, q, o){
    if (q <= 0) return; o = o || {}; const size = o.size || 40; font(ctx, 800, size, FAM); const U = o.raw ? text : String(text).toUpperCase(); let z = size; while (ctx.measureText(U).width > (o.maxW || 700) && z > 18){ z -= 2; font(ctx, 800, z, FAM); }
    const w = ctx.measureText(U).width + z * 1.3, h = z * 1.7; ctx.save(); ctx.translate(x, y); ctx.rotate((o.rot || 0) * Math.PI / 180); ctx.scale(q, q);
    rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = o.bg || ORANGE; ctx.fill(); ol(ctx, o.lw || 5); ctx.fillStyle = o.fg || CREAM; ctx.textAlign = "center"; ctx.fillText(U, 0, z * .36); ctx.textAlign = "left"; ctx.restore();
  }
  function coin(ctx, x, y, r, spin, bolt){
    const sx = Math.max(.15, Math.abs(Math.cos(spin || 0))); ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, Math.max(3, r * .14)); ctx.beginPath(); ctx.arc(0, 0, r * .7, 0, TAU); ctx.strokeStyle = "#C98A1E"; ctx.lineWidth = r * .1; ctx.stroke();
    if (bolt){ ctx.fillStyle = "#FFF6D8"; ctx.beginPath(); ctx.moveTo(r * .12, -r * .55); ctx.lineTo(-r * .3, r * .08); ctx.lineTo(-r * .02, r * .08); ctx.lineTo(-r * .14, r * .55); ctx.lineTo(r * .32, -r * .1); ctx.lineTo(r * .04, -r * .1); ctx.closePath(); ctx.fill(); }
    else { font(ctx, 800, r * .8, FAM); ctx.fillStyle = "#8A5A10"; ctx.textAlign = "center"; ctx.fillText("Rp", 0, r * .28); ctx.textAlign = "left"; }
    ctx.restore();
  }
  // package box with a sticker
  function pkg(ctx, x, y, s, lines, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * (o.sx || 1), s * (o.sy || 1));
    ctx.fillStyle = "rgba(43,26,18,.2)"; rr(ctx, -118, -78, 244, 168, 10); ctx.fill();
    ctx.fillStyle = "#D9A066"; rr(ctx, -120, -90, 240, 170, 10); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#C48A52"; ctx.fillRect(-18, -90, 36, 170); ctx.strokeStyle = "rgba(43,26,18,.4)"; ctx.lineWidth = 3; ctx.strokeRect(-18, -90, 36, 170);
    if (lines){ rr(ctx, -96, -58, 192, 104, 10); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.stroke();
      lines.forEach((l, i) => ctext(ctx, l, 0, -18 + i * 44 + (lines.length === 1 ? 22 : 0), 170, i ? 40 : 30, i ? RED : BROWN)); }
    ctx.restore();
  }
  // a "?" decision box
  function qbox(ctx, x, y, s, label, rot, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s * (o.sx || 1), s * (o.sy || 1));
    rr(ctx, -95, -95, 190, 190, 18); ctx.fillStyle = o.col || "#F2B33D"; ctx.fill(); ol(ctx, 7);
    rr(ctx, -80, -80, 160, 160, 12); ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 5; ctx.stroke();
    font(ctx, 800, 110, FAM); ctx.fillStyle = "#FFFDF8"; ctx.textAlign = "center"; ctx.lineWidth = 8; ctx.strokeStyle = OUT; ctx.strokeText(o.mark || "?", 0, 30); ctx.fillText(o.mark || "?", 0, 30);
    if (label){ fitFont(ctx, label, 300, 40, 20); const w = ctx.measureText(label).width + 36; rr(ctx, -w / 2, 104, w, 56, 12); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = BROWN; ctx.fillText(label, 0, 145); }
    ctx.textAlign = "left"; ctx.restore();
  }
  // animated size keys: sizes [{cue|at, size, dur}]
  function sizeAt(a, s, t){
    if (!a.sizes) return a.size || 760;
    const K = a.sizes.map((k, j) => ({ T: k.at != null ? k.at : at(s, k.cue, .3 + j * .2), size: k.size, dur: k.dur || .55 })).sort((p, q) => p.T - q.T);
    let from = a.size || 760, to = from, T0 = -1e9, D = .01;
    for (const k of K){ if (t < k.T) break; from = lerp(from, to, eBack(clamp((k.T - T0) / D, 0, 1))); to = k.size; T0 = k.T; D = k.dur; }
    return lerp(from, to, eBack(clamp((t - T0) / D, 0, 1)));
  }
  const sized = (a, s, t) => a.sizes ? Object.assign({}, a, { size: sizeAt(a, s, t), seed: a.seed ?? 3.1 }) : a;

  /* ---------- shared scene base ---------- */
  function base(ctx, s, t, o){
    const f = s.f || {}, idx = TT.G.scene, toons = (f.toons || []).map(a => sized(a, s, t));
    if (o.mod) o.mod(toons);
    const sts = toons.map(a => toonState(a, s, t)), anchors = [];
    if (o.pre) o.pre(sts, toons);
    const resolve = (on, tt, k) => {
      if (on === "obj" && o.target) return o.target(k, sts);
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? (1080 * k.fit) / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || o.cam || [{ at: 0, x: 540, y: 960, zoom: 1.04 }], Object.assign({ resolve }, f.camOpt || {}));
    const kind = f.env || o.env || "office", eo = Object.assign({}, o.envOpt || {}, f.envOpt || {});
    if (o.envDraw) o.envDraw(c, kind, eo); else env(ctx, kind, t, c, eo);
    const W = fn => { ctx.save(); c.apply(ctx); try { fn(); } finally { ctx.restore(); } };
    if (o.back) W(() => o.back(c, sts, toons));
    let midDone = false;
    toons.map((a, j) => [a, j]).sort((p, q) => (p[0].z || 0) - (q[0].z || 0)).forEach(([a, j]) => {
      if (o.mid && (a.z || 0) >= 0 && !midDone){ midDone = true; W(() => o.mid(c, sts, toons)); }
      if (o.drawToon && o.drawToon(j, a, sts[j], c)) return;
      anchors[j] = toon(ctx, c, a, s, t, { st: sts[j] }); });
    if (o.mid && !midDone) W(() => o.mid(c, sts, toons));
    if (o.front) W(() => o.front(c, sts, toons, anchors));
    if (f.front !== false && !o.noFront) envFront(ctx, kind, t, c, eo);
    if (o.screen) o.screen(c, sts, toons, anchors);
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? at(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? at(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    (f.words || []).forEach((w, j) => popWord(ctx, w.text, w.x ?? 540, w.y ?? 330, w.cue ? at(s, w.cue, .3 + j * .2) : (w.at ?? .3), t, { out: w.outCue ? at(s, w.outCue, .9) : w.out, hl: w.hl, rot: w.rot, size: w.size, color: w.color }));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? at(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, anchors, f, toons };
  }
  function sfxBase(s, f, i, add){
    const kt = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
    (f.cam || []).forEach((k, j) => { if (k.shake) add(kt(k, j), "pop"); if (k.cut && kt(k, j) > .2) add(kt(k, j), "whoosh"); });
    (f.toons || []).forEach(a => { (a.keys || []).forEach((k, j) => { const T = kt(k, j); if (k.say != null) add(T, "pop"); if (k.jump) add(T + .13, "whoosh"); if (k.expr === "shock") add(T, "ping"); if (k.emote === "idea" || k.emote === "check") add(T, "chime"); });
      (a.sizes || []).forEach((k, j) => add(k.at != null ? k.at : cueT(s, k.cue, .3 + j * .2, i), "whoosh")); });
    (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
    (f.words || []).forEach((w, j) => add(w.cue ? cueT(s, w.cue, .3 + j * .2, i) : (w.at ?? .3), "pop"));
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
  }
  const reg = (name, label, draw, sfx) => TT.scene(name, label, draw, (s, f, i, add) => { sfxBase(s, f, i, add); if (sfx) sfx(s, f, i, add); });
  const T_ = (s, o, key, fr) => o && o[key] ? at(s, o[key], fr) : 1e9;
  const hand = (st, dx, dy) => { const k = st.size / 92; return [st.x + (dx ?? 21) * k * (st.face || 1), st.y + (dy ?? -47) * k, k]; };

  /* =================================================================== SC24 */
  /* ---------- bill monster ---------- */
  function monster(ctx, x, y, s, m, t, o){
    // o: {mood: angry|happy, look: -1|1, run: bool, ph}
    const happy = o.mood === "happy", ph = o.ph || 0, hop = o.hop || 0, sq = o.sq || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 90 * (1 - hop * .004), 14, 0, 0, TAU); ctx.fill();
    ctx.translate(0, -hop); ctx.scale(1 + sq, 1 - sq);
    // legs
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round";
    [-1, 1].forEach((d, k) => { const sw = o.run ? Math.sin(ph * 14 + k * Math.PI) * 22 : 0; ctx.beginPath(); ctx.moveTo(d * 40, -52); ctx.lineTo(d * 40 + sw, -8); ctx.stroke();
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(d * 40 + sw + 10 * (o.look || 1), -6, 20, 10, 0, 0, TAU); ctx.fill(); });
    // arms
    ctx.lineWidth = 10; [-1, 1].forEach((d, k) => { const wv = happy ? Math.sin(t * 9 + k) * .6 : Math.sin(t * 12 + k * 2) * .35; ctx.save(); ctx.translate(d * 96, -170); ctx.rotate(d * (happy ? -1.9 : -.9) + wv * d);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 58); ctx.stroke(); ctx.fillStyle = "#FFFDF8"; ctx.beginPath(); ctx.arc(0, 64, 12, 0, TAU); ctx.fill(); ol(ctx, 5); ctx.restore(); });
    // body: paper sheet with folded corner
    const w = 200, h = 250, x0 = -100, y0 = -60 - h;
    ctx.beginPath(); ctx.moveTo(x0, y0 + 14); ctx.quadraticCurveTo(x0, y0, x0 + 14, y0); ctx.lineTo(x0 + w - 46, y0); ctx.lineTo(x0 + w, y0 + 46); ctx.lineTo(x0 + w, y0 + h - 14); ctx.quadraticCurveTo(x0 + w, y0 + h, x0 + w - 14, y0 + h); ctx.lineTo(x0 + 14, y0 + h); ctx.quadraticCurveTo(x0, y0 + h, x0, y0 + h - 14); ctx.closePath();
    ctx.fillStyle = "#FFFDF8"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = m.col || ORANGE; ctx.fillRect(x0, y0, w, 64); ctx.fillStyle = "rgba(59,36,24,.12)"; for (let i = 0; i < 3; i++) ctx.fillRect(x0 + 26, y0 + 196 + i * 0, 0, 0); ctx.restore(); ol(ctx, 7);
    ctx.beginPath(); ctx.moveTo(x0 + w - 46, y0); ctx.lineTo(x0 + w - 46, y0 + 46); ctx.lineTo(x0 + w, y0 + 46); ctx.closePath(); ctx.fillStyle = "#E8D8C0"; ctx.fill(); ol(ctx, 5);
    ctext(ctx, m.label || "", x0 + (w - 30) / 2 + 2, y0 + 46, w - 56, 34, "#FFFFFF");
    // face
    const ey = y0 + 120, lk = (o.look || 1) * 6;
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 40, ey, 30, 34, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
      if (happy){ ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(d * 40, ey + 8, 15, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
      else { ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(d * 40 + lk, ey + 6, 13, 0, TAU); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(d * 40 + lk + 4, ey + 1, 4, 0, TAU); ctx.fill();
        ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(d * 70, ey - 44); ctx.lineTo(d * 14, ey - 30); ctx.stroke(); } });
    const my = y0 + 190;
    if (happy){ ctx.beginPath(); ctx.arc(0, my - 12, 30, .15 * Math.PI, .85 * Math.PI); ctx.fillStyle = "#8E2E22"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "rgba(233,120,100,.5)"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 72, ey + 40, 18, 10, 0, 0, TAU); ctx.fill(); }); }
    else { ctx.beginPath(); ctx.ellipse(0, my, 44, 22 + Math.sin(t * 14) * 5, 0, 0, TAU); ctx.fillStyle = "#8E2E22"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF";
      for (let i = -2; i <= 2; i++){ ctx.beginPath(); ctx.moveTo(i * 16 - 7, my - 18); ctx.lineTo(i * 16 + 7, my - 18); ctx.lineTo(i * 16, my - 4); ctx.closePath(); ctx.fill(); } }
    ctx.restore();
  }
  // money bag
  function bag(ctx, x, y, s, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-26, -70); ctx.quadraticCurveTo(-70, 0, -50, 40); ctx.quadraticCurveTo(0, 62, 50, 40); ctx.quadraticCurveTo(70, 0, 26, -70); ctx.closePath(); ctx.fillStyle = "#C9A46A"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(-30, -70); ctx.lineTo(30, -70); ctx.lineTo(18, -90); ctx.lineTo(-18, -90); ctx.closePath(); ctx.fillStyle = "#B08A52"; ctx.fill(); ol(ctx, 4);
    font(ctx, 800, 40, FAM); ctx.fillStyle = "#6E4A1E"; ctx.textAlign = "center"; ctx.fillText("Rp", 0, 18); ctx.textAlign = "left"; ctx.restore(); }

  reg("ce_tagihan", "Cerita: monster tagihan", (ctx, th, s, t) => {
    const f = s.f || {}, mons = f.mons || [], jinak = f.mode === "jinak", TM = mons.map((m, k) => m.cue ? at(s, m.cue, .2 + k * .15) : (m.at ?? .5 + k * .6));
    const ch = f.chest || {}, tFill = ch.fillCue ? at(s, ch.fillCue, .3) : 1e9, tPay = ch.payCue ? at(s, ch.payCue, .8) : 1e9;
    const mpos = [];
    base(ctx, s, t, { env: jinak ? "park" : "street",
      target: k => [k.x ?? 540, k.y ?? 1100, k.zoom || 1],
      pre: sts => {
        const h = sts[0]; if (!h) return;
        mons.forEach((m, k) => { const T = TM[k], q = t - T; if (q < 0){ mpos[k] = null; return; }
          let x, y = GY, look = 1, run = true, mood = "angry", sq = 0;
          if (!jinak){ const tx = h.x - 340 - k * 235 + Math.sin(t * 2 + k) * 20, sx = h.x - 1000 - k * 160; x = lerp(sx, tx, eOut(clamp(q / 1.1, 0, 1))); }
          else { const tx = 650 + k * 160, sx = -350 - k * 150; x = lerp(sx, tx, eOut(clamp(q / 1.3, 0, 1))); look = -1; run = q < 1.3;
            if (t > tPay + k * .35){ mood = "happy"; const pq = t - tPay - k * .35; run = false; if (pq > 1.6){ x += Math.pow(pq - 1.6, 2) * 500; run = true; look = 1; } } }
          const hopPh = (t * 3.2 + k * .37) % 1, hop = run ? Math.sin(hopPh * Math.PI) * 60 : Math.abs(Math.sin(t * 5 + k)) * (mood === "happy" ? 30 : 8);
          sq = run ? (hopPh < .12 ? .12 * (1 - hopPh / .12) : -.05 * Math.sin(hopPh * Math.PI)) : 0;
          mpos[k] = { x, y, look, run, mood, hop, sq, q, s: m.s || (jinak ? 1.05 : 1.25) }; });
      },
      back: (c, sts) => {
        if (jinak && ch.x != null){ // treasure chest "POS TAHUNAN"
          const x = ch.x, y = GY - 10, lid = t > tPay ? eOut(clamp((t - tPay) / .4, 0, 1)) : 0;
          ctx.save(); ctx.translate(x, y); ctx.scale(ch.s || 1.25, ch.s || 1.25); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 150, 16, 0, 0, TAU); ctx.fill();
          rr(ctx, -130, -150, 260, 150, 14); ctx.fillStyle = "#9A5A34"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = GOLD; ctx.fillRect(-130, -100, 260, 16); ctx.fillRect(-14, -150, 28, 150);
          ctx.save(); ctx.translate(0, -150); ctx.rotate(-1.9 * lid); rr(ctx, -130, -60, 260, 60, [30, 30, 6, 6]); ctx.fillStyle = "#B06A3E"; ctx.fill(); ol(ctx, 6); ctx.restore();
          if (lid > 0){ glow(ctx, 0, -170, 240, "#FFE7A6", .6 * lid); }
          // coins dropping in while saving
          const dq = t - tFill; if (dq > 0 && dq < 2.4){ for (let i = 0; i < 6; i++){ const qq = (dq - i * .3) / .5; if (qq < 0 || qq > 1) continue; coin(ctx, Math.sin(i * 2.1) * 40, -620 + qq * qq * 470, 34, t * 8 + i); } }
          ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(0, -300); ctx.stroke(); rr(ctx, -140, -370, 280, 76, 12); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); ctext(ctx, ch.label || "POS TAHUNAN", 0, -320, 250, 40, BROWN);
          ctx.restore();
        }
      },
      mid: () => {},
      front: (c, sts) => {
        mons.forEach((m, k) => { const p = mpos[k]; if (!p) return; monster(ctx, p.x, p.y, p.s, m, t, { mood: p.mood, look: p.look, run: p.run, ph: t + k, hop: p.hop, sq: p.sq });
          if (p.q < .5){ dust(ctx, p.x, p.y, p.q, 6, 120); }
          if (jinak){ const pq = t - tPay - k * .35; // bag flies from chest to monster, hearts
            if (pq > -.5 && pq < 0 && ch.x != null){ const q = (pq + .5) / .5, bx = lerp(ch.x, p.x, q), by = lerp(GY - 200, p.y - 330, q) - Math.sin(q * Math.PI) * 260; bag(ctx, bx, by, .9, q * 6); }
            if (pq >= 0 && pq < 1.8){ bag(ctx, p.x + 70 * p.s, p.y - 150 * p.s - p.hop, .8, Math.sin(t * 6) * .2); sparkles(ctx, p.x, p.y - 260, pq, 8, 160);
              for (let h = 0; h < 3; h++){ const hq = (pq * .8 + h * .3) % 1; ctx.save(); ctx.globalAlpha *= 1 - hq; ctx.fillStyle = "#E06A6A"; ctx.translate(p.x + (h - 1) * 50, p.y - 360 - hq * 160); ctx.scale(1.4, 1.4); ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-14, -6, -8, -18, 0, -10); ctx.bezierCurveTo(8, -18, 14, -6, 0, 6); ctx.fill(); ctx.restore(); } } }
        });
      }
    });
  }, (s, f, i, add) => { (f.mons || []).forEach((m, k) => add(m.cue ? cueT(s, m.cue, .2 + k * .15, i) : (m.at ?? .5 + k * .6), "whoosh"));
    const ch = f.chest || {}; if (ch.fillCue) add(cueT(s, ch.fillCue, .3, i), "chime"); if (ch.payCue){ const T = cueT(s, ch.payCue, .8, i); (f.mons || []).forEach((m, k) => add(T + k * .35, "pop")); add(T + .1, "chime"); } });
  function glow(ctx, x, y, r, col, a){ const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }

  /* ---------- ce_dompet: empty wallet ---------- */
  reg("ce_dompet", "Cerita: dompet kosong", (ctx, th, s, t) => {
    const f = s.f || {}, w = f.wallet || {}, tO = w.openCue ? at(s, w.openCue, .3) : .6, tS = w.shakeCue ? at(s, w.shakeCue, .4) : tO + .8;
    let wp = null;
    base(ctx, s, t, { env: "home", envOpt: { lampX: 560 },
      target: k => wp ? [wp[0] + (k.dx || 0), wp[1] + (k.dy ?? 120), k.zoom || 1.5] : [540, 960, 1],
      front: (c, sts) => {
        const h = sts[0]; if (!h) return; const [hx, hy, k] = hand(h, 22, -50);
        const sh = t > tS && t < tS + 2.2 ? Math.sin((t - tS) * 30) * .35 * (1 - (t - tS) / 2.2) : 0, flip = t > tS ? eOut(clamp((t - tS) / .3, 0, 1)) : 0;
        const x = hx + 150, y = hy + 10 - flip * 120, open = t > tO ? eBack(clamp((t - tO) / .4, 0, 1)) : 0; wp = [x, y];
        ctx.save(); ctx.translate(x, y); ctx.rotate(sh + flip * Math.PI); const S = 1.25;
        ctx.scale(S, S);
        // wallet: two halves hinged at the bottom
        ctx.save(); ctx.rotate(-open * .5); rr(ctx, -110, -80, 120, 140, 14); ctx.fillStyle = "#7A4A2B"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#6A3E22"; rr(ctx, -96, -60, 92, 20, 6); ctx.fill(); ctx.restore();
        ctx.save(); ctx.rotate(open * .5); rr(ctx, -10, -80, 120, 140, 14); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(80, -10, 12, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore();
        ctx.restore();
        if (t > tS){ const d = t - tS; // falling coins (2) + moth + dust
          for (let i = 0; i < 2; i++){ const q = d - .15 - i * .25; if (q < 0) continue; const yy = Math.min(GY - 20, y + 60 + 900 * q * q), bounce = yy >= GY - 20 ? Math.abs(Math.sin((q - .5) * 9)) * 30 * Math.exp(-(q - .5) * 3) : 0; coin(ctx, x + (i ? 60 : -40) + q * (i ? 80 : -60), yy - bounce, 28, q * 12, false); }
          dust(ctx, x, y + 80, d - .1, 8, 140);
          const mq = d - .3; if (mq > 0){ const mx = x + Math.sin(mq * 3) * 120 + mq * 40, my = y + 40 - mq * 160, fl = Math.abs(Math.sin(mq * 26));
            ctx.save(); ctx.translate(mx, my); ctx.fillStyle = "#B9A58F"; [-1, 1].forEach(dd => { ctx.beginPath(); ctx.ellipse(dd * 22 * fl, -6, 22 * fl + 3, 30, dd * .5, 0, TAU); ctx.fill(); ol(ctx, 3); });
            ctx.beginPath(); ctx.ellipse(0, 0, 9, 22, 0, 0, TAU); ctx.fillStyle = "#6E5A4A"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
        }
      }
    });
  }, (s, f, i, add) => { const w = f.wallet || {}; if (w.openCue) add(cueT(s, w.openCue, .3, i), "pop"); if (w.shakeCue){ const T = cueT(s, w.shakeCue, .4, i); add(T, "whoosh"); add(T + .5, "ping"); } });

  /* ---------- ce_kincir: ferris wheel of months ---------- */
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
  reg("ce_kincir", "Cerita: kincir bulan", (ctx, th, s, t) => {
    const f = s.f || {}, wh = Object.assign({ x: 470, y: 760, r: 390, hot: 6, period: 4.4 }, f.wheel || {}), tC = wh.cue ? at(s, wh.cue, .5) : 3, tG = f.glowCue ? at(s, f.glowCue, .8) : 1e9;
    const om = TAU / wh.period, base0 = Math.PI / 2 - wh.hot * TAU / 12; // angle where the hot cabin is at the bottom at tC
    const ang = t2 => base0 + om * (t2 - tC);
    let hotPos = [wh.x, wh.y + wh.r];
    base(ctx, s, t, { env: "night",
      target: k => [hotPos[0] + (k.dx || 0), hotPos[1] + (k.dy || 0), k.zoom || 1.4],
      back: () => {
        const { x, y, r } = wh, a0 = ang(t);
        // supports
        ctx.strokeStyle = "#5A4858"; ctx.lineWidth = 26; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d * 260, GY - 120); ctx.stroke(); });
        ctx.strokeStyle = OUT; ctx.lineWidth = 4; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d * 260, GY - 120); ctx.stroke(); });
        // rim + spokes
        glow(ctx, x, y, r * 1.25, "#F4A85C", .18);
        ctx.strokeStyle = "#E8DCC8"; ctx.lineWidth = 6; for (let i = 0; i < 12; i++){ const a = a0 + i * TAU / 12; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.stroke(); }
        ctx.lineWidth = 14; ctx.strokeStyle = "#E8DCC8"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.arc(x, y, r + 8, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r - 8, 0, TAU); ctx.stroke();
        ctx.lineWidth = 8; ctx.strokeStyle = "#E8DCC8"; ctx.beginPath(); ctx.arc(x, y, r * .55, 0, TAU); ctx.stroke();
        for (let i = 0; i < 36; i++){ const a = a0 + i * TAU / 36, on = Math.sin(t * 6 + i * 1.3) > -.2; ctx.fillStyle = on ? (i % 3 ? "#FFE3A8" : HL) : "#7A5A40"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 7, 0, TAU); ctx.fill(); }
        ctx.beginPath(); ctx.arc(x, y, 40, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
        // cabins (always hanging down)
        for (let i = 0; i < 12; i++){ const a = a0 + i * TAU / 12, cx = x + Math.cos(a) * r, cy = y + Math.sin(a) * r, hot = i === wh.hot, sw = Math.sin(t * 2 + i) * .06;
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.stroke();
          const w = hot ? 150 : 104, h = hot ? 112 : 78; if (hot){ hotPos = [cx, cy + 70]; const gq = t > tG ? .6 + .4 * Math.sin((t - tG) * 8) : .35; glow(ctx, 0, 70, 220, "#FFD08A", gq); }
          rr(ctx, -w / 2, 22, w, h, 16); ctx.fillStyle = hot ? RED : ["#2F6F73", "#C2691F", "#7FA563", "#5B7DB1"][i % 4]; ctx.fill(); ol(ctx, 5);
          if (hot){ // three tiny bill monsters peeking
            for (let m = 0; m < 3; m++) monster(ctx, -42 + m * 42, 22 + 40, .26, { label: "", col: [ORANGE, "#2F6F73", "#7FA563"][m] }, t, { mood: "angry", look: m - 1, hop: Math.abs(Math.sin(t * 6 + m)) * 14 });
            rr(ctx, -w / 2, 64, w, h - 42, 10); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); }
          else { rr(ctx, -w / 2 + 12, 32, w - 24, 26, 8); ctx.fillStyle = "rgba(255,240,210,.5)"; ctx.fill(); }
          ctext(ctx, MONTHS[i], 0, 22 + h - (hot ? 16 : 12), w - 16, hot ? 40 : 28, "#FFFFFF");
          ctx.restore(); }
      },
      screen: (c) => {
        // year counter: each time the hot cabin passes the bottom
        if (wh.yearTag){ const n = Math.floor((t - tC) / wh.period + 1e-6) + 1; if (t > tC - .2){ const ph = (t - tC) - (n - 1) * wh.period, q = popQ(ph, 0, .35); const p = c.toScreen(hotPos[0], hotPos[1] + 120);
            over(() => pillTag(ctx, (wh.yearTag || "TAHUN") + " " + Math.max(1, n), clamp(p[0], 220, 860), Math.min(1250, p[1]), Math.max(.01, q), { bg: GOLD, fg: BROWN, size: 40 })); } }
      }
    });
  }, (s, f, i, add) => { const wh = Object.assign({ period: 4.4 }, f.wheel || {}), T = wh.cue ? cueT(s, wh.cue, .5, i) : 3; for (let k = -2; k < 4; k++){ const tt = T + k * wh.period; if (tt > .2) add(tt, "ping"); } if (f.glowCue) add(cueT(s, f.glowCue, .8, i), "chime"); });

  /* ---------- ce_kue: giant cake sliced into 12 ---------- */
  reg("ce_kue", "Cerita: kue dibagi 12", (ctx, th, s, t) => {
    const f = s.f || {}, ck = Object.assign({ x: 640, y: 1130, rx: 300, ry: 105, h: 190, label: "Rp12 JUTA" }, f.cake || {});
    const tCut = ck.cutCue ? at(s, ck.cutCue, .4) : 2, tSl = ck.sliceCue ? at(s, ck.sliceCue, .7) : 1e9, tIn = ck.inCue ? at(s, ck.inCue, .1) : .2;
    let slicePos = null;
    base(ctx, s, t, { env: "info", envOpt: { spotX: ck.x },
      target: k => [ck.x + (k.dx || 0), ck.y - 80 + (k.dy || 0), k.zoom || 1.25],
      back: (c, sts) => {
        const q = popQ(t, tIn, .5); if (q <= 0) return;
        const { x, rx, ry, h } = ck, y = ck.y - (1 - q) * 500;
        ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.translate(-x, -y);
        // stand
        ctx.fillStyle = "#E8DCC8"; ctx.beginPath(); ctx.ellipse(x, y + 18, rx + 50, ry + 22, 0, 0, TAU); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#CFC0A8"; ctx.fillRect(x - 30, y + 30, 60, 230); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(x - 30, y + 30, 60, 230);
        ctx.beginPath(); ctx.ellipse(x, y + 270, 140, 34, 0, 0, TAU); ctx.fillStyle = "#E8DCC8"; ctx.fill(); ol(ctx, 6);
        // cylinder side (sponge + cream layers)
        ctx.beginPath(); ctx.moveTo(x - rx, y - h); ctx.lineTo(x - rx, y); ctx.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(x + rx, y - h); ctx.closePath(); ctx.fillStyle = "#C47A48"; ctx.fill();
        ctx.save(); ctx.clip(); ctx.fillStyle = "#FFF1DC"; [-.66, -.33].forEach(fr => { ctx.beginPath(); ctx.ellipse(x, y + h * fr, rx, ry, 0, 0, Math.PI); ctx.lineTo(x - rx, y + h * fr - 22); ctx.ellipse(x, y + h * fr - 22, rx, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill(); }); ctx.restore();
        ctx.beginPath(); ctx.moveTo(x - rx, y - h); ctx.lineTo(x - rx, y); ctx.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(x + rx, y - h); ol(ctx, 6);
        // top: 12 sectors
        const n = 12, cutN = t < tCut ? 0 : Math.min(6, Math.floor((t - tCut) / .16) + 1), taken = t > tSl ? 9 : -1; // sector 9 ~ front (angle ~ pi/2)
        for (let i = 0; i < n; i++){ const a0 = i * TAU / n - Math.PI / 2 - Math.PI / 12 + Math.PI / 12, a1 = a0 + TAU / n;
          ctx.beginPath(); ctx.moveTo(x, y - h); ctx.ellipse(x, y - h, rx, ry, 0, a0, a1); ctx.closePath();
          ctx.fillStyle = i === taken ? "#7A4A2B" : (i % 2 ? "#FFF6E6" : "#FFEBD2"); ctx.fill(); }
        ctx.beginPath(); ctx.ellipse(x, y - h, rx, ry, 0, 0, TAU); ol(ctx, 6);
        // drips
        ctx.fillStyle = "#FFF6E6"; for (let i = 0; i < 9; i++){ const a = Math.PI * (i + .5) / 9, dx = x + Math.cos(a) * rx * .98 * -1, dy = y - h + Math.sin(a) * ry; ctx.beginPath(); ctx.ellipse(dx, dy + 10, 16, 26 + (i % 3) * 8, 0, 0, TAU); ctx.fill(); }
        // cut lines
        ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 5; for (let k = 0; k < cutN; k++){ const a = k * TAU / n - Math.PI / 2; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * rx, y - h - Math.sin(a) * ry); ctx.lineTo(x + Math.cos(a) * rx, y - h + Math.sin(a) * ry); ctx.stroke(); }
        // month letters on the slices
        if (cutN >= 6){ const lq = clamp((t - tCut - 1) / .5, 0, 1); for (let i = 0; i < n; i++){ if (i === taken) continue; const a = (i + .5) * TAU / n - Math.PI / 2, lx = x + Math.cos(a) * rx * .7, ly = y - h + Math.sin(a) * ry * .7 + 10;
          ctx.save(); ctx.globalAlpha *= lq; ctext(ctx, MONTHS[(i + 3) % 12].slice(0, 3), lx, ly, 70, 24, BROWN); ctx.restore(); } }
        // cherries
        for (let i = 0; i < 6; i++){ const a = i * TAU / 6 + .3, cx2 = x + Math.cos(a) * rx * .38, cy2 = y - h + Math.sin(a) * ry * .38 - 12; ctx.beginPath(); ctx.arc(cx2, cy2, 14, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); }
        // flag
        const fx = x - 60, fy = y - h - 30; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - 250); ctx.stroke();
        const wv = Math.sin(t * 4) * 8; ctx.beginPath(); ctx.moveTo(fx, fy - 250); ctx.quadraticCurveTo(fx + 130, fy - 250 + wv, fx + 260, fy - 240); ctx.lineTo(fx + 260, fy - 160); ctx.quadraticCurveTo(fx + 130, fy - 170 - wv, fx, fy - 170); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5);
        ctext(ctx, ck.label, fx + 130, fy - 194, 230, 46, CREAM);
        ctx.restore();
        // knife sweeping during the cut
        if (t > tCut - .3 && t < tCut + 1.1){ const kq = (t - tCut) / .16, k = clamp(Math.floor(kq), 0, 5), ph = kq - Math.floor(kq), a = k * TAU / 12 - Math.PI / 2;
          const kx = x + Math.cos(a) * rx * (ph * 2 - 1), ky = y - h + Math.sin(a) * ry * (ph * 2 - 1) - 160 + Math.abs(ph - .5) * 120;
          ctx.save(); ctx.translate(kx, ky); ctx.rotate(-.5); rr(ctx, -16, -10, 40, 210, 8); ctx.fillStyle = "#D8DDE2"; ctx.fill(); ol(ctx, 5); rr(ctx, -12, -120, 32, 110, 10); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 5); ctx.restore(); }
        // flying slice to the hero's hands
        if (t > tSl && sts[0]){ const q = eOut(clamp((t - tSl) / .7, 0, 1)), [hx, hy] = hand(sts[0], 22, -50), sx2 = x, sy2 = y - h + ry * .6;
          const px = lerp(sx2, hx + 30, q), py = lerp(sy2, hy - 40, q) - Math.sin(q * Math.PI) * 220; slicePos = [px, py];
          ctx.save(); ctx.translate(px, py); ctx.rotate((1 - q) * 3); const S2 = 1 + .1 * Math.sin(t * 5);
          ctx.scale(S2, S2); ctx.beginPath(); ctx.moveTo(-60, -40); ctx.lineTo(60, -40); ctx.lineTo(0, -110); ctx.closePath(); ctx.fillStyle = "#FFF6E6"; ctx.fill(); ol(ctx, 5);
          rr(ctx, -60, -40, 120, 80, 6); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFF1DC"; ctx.fillRect(-58, -12, 116, 14);
          ctx.beginPath(); ctx.arc(0, -70, 12, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.restore(); }
      },
      screen: (c) => { if (t > tSl + .5 && slicePos && ck.sliceTag){ const p = c.toScreen(slicePos[0] + 120, slicePos[1] - 330); over(() => pillTag(ctx, ck.sliceTag, clamp(p[0], 250, 830), Math.max(250, p[1]), popQ(t, tSl + .5, .35), { size: 44, rot: -4 })); }
        if (t > tCut && t < tCut + 1.1){ const p = c.toScreen(ck.x, ck.y - ck.h); over(() => impact(ctx, p[0], p[1], (t - tCut) % .16 * 2, 220, CREAM)); } }
    });
  }, (s, f, i, add) => { const ck = f.cake || {}; if (ck.inCue) add(cueT(s, ck.inCue, .1, i), "pop"); if (ck.cutCue){ const T = cueT(s, ck.cutCue, .4, i); for (let k = 0; k < 6; k++) add(T + k * .16, k % 2 ? "pop" : "whoosh"); add(T + 1.1, "chime"); } if (ck.sliceCue) add(cueT(s, ck.sliceCue, .7, i), "whoosh"); });
  /* =================================================================== MS24 */
  // gavel in world coords: pivot (x,y), angle a (0 = pointing right), length L
  function gavel(ctx, x, y, a, L){ ctx.save(); ctx.translate(x, y); ctx.rotate(a); rr(ctx, -6, -L * .05, L, L * .1, L * .05); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 4);
    ctx.save(); ctx.translate(L, 0); rr(ctx, -L * .16, -L * .34, L * .32, L * .68, L * .08); ctx.fillStyle = "#6A3E22"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = GOLD; ctx.fillRect(-L * .16, -L * .22, L * .32, L * .08); ctx.fillRect(-L * .16, L * .14, L * .32, L * .08); ctx.restore(); ctx.restore(); }
  reg("ce_hakim", "Cerita: hakim kecil di bahu", (ctx, th, s, t) => {
    const f = s.f || {}, J = f.judge || {}, tIn = J.inCue ? at(s, J.inCue, .2) : (J.at ?? .3), hits = (J.hits || []).map((h, k) => Object.assign({ T: at(s, h.cue, .3 + k * .2) }, h)), tTurn = J.turnCue ? at(s, J.turnCue, .4) : 1e9;
    const says = (J.say || []).map((h, k) => Object.assign({ T: at(s, h.cue, .5 + k * .2) }, h));
    let mini = null, hitPt = [540, 700], miniTop = [540, 600];
    base(ctx, s, t, { env: "street",
      target: k => mini ? [mini.x + (k.dx || 0), mini.y - mini.size * .6 + (k.dy || 0), k.zoom || 1.6] : [540, 960, 1],
      front: (c, sts) => {
        const h = sts[0]; if (!h || t < tIn) return; const kH = h.size / 92, hp = toonHead(h), face = h.face || 1, r = 20.5 * kH;
        const qi = eBack(clamp((t - tIn) / .45, 0, 1)), turned = t >= tTurn, msize = Math.max(200, h.size * .36) * qi;
        const bob = Math.sin(t * 3.1) * 10, x = h.x - face * (r + msize * .2), y = h.y - 50 * kH + bob - (1 - qi) * 200;
        const look = Object.assign({}, J.look || {}, turned ? (J.kind || {}) : (J.judgeLook || { hair: "curly", hairColor: "#F2EEE6", jacket: "#1E1A18", shirt: "#FFFDF8", tie: null, idcard: null, collar: true }));
        let expr = turned ? "happy" : "angry", pose = turned ? "wave" : "point";
        if (turned && t - tTurn > 1.2) pose = (Math.floor((t - tTurn) / 1.6) % 2) ? "clap" : "wave";
        hits.forEach(hh => { if (!turned && t > hh.T - .3 && t < hh.T + .5) pose = "pointUp"; });
        const a = Object.assign({ size: Math.max(1, msize), x, y, face, expr, pose, shadow: false, seed: 7 }, look);
        const st = toonState(a, s, t); st.size = Math.max(1, msize); st.x = x; st.y = y; st.face = face; st.expr = expr; st.pose = pose; st.exprT = turned ? tTurn : -9;
        mini = { x, y, size: msize };
        if (msize > 5) drawToon(ctx, a, st, t);
        const mk = msize / 92, hx = x + 20 * mk * face, hy = y - 60 * mk; miniTop = [x, y - msize * 1.05];
        if (!turned && msize > 5){ // gavel: wind-up and strike on each hit
          let ang = -1.1 + Math.sin(t * 4) * .08; hits.forEach(hh => { const d = t - hh.T; if (d > -.3 && d < 0) ang = lerp(-1.1, -2.2, eOut((d + .3) / .3)); else if (d >= 0 && d < .12) ang = lerp(-2.2, .55, eIn2(d / .12)); else if (d >= .12 && d < .5) ang = lerp(.55, -1.1, eOut((d - .12) / .38)); });
          const A = face > 0 ? ang : Math.PI - ang; gavel(ctx, hx, hy, A, msize * .55);
          hitPt = [hp[0] - face * r * .35, hp[1] - r * .95]; }
        if (turned && msize > 5){ // heart in the friend's hand
          ctx.save(); ctx.translate(hx + face * 10 * mk, hy - 30 * mk + Math.sin(t * 5) * 6); const hs = mk * 1.6 * (1 + .1 * Math.sin(t * 6)); ctx.scale(hs, hs); ctx.fillStyle = "#E06A6A"; ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-16, -6, -9, -20, 0, -11); ctx.bezierCurveTo(9, -20, 16, -6, 0, 8); ctx.fill(); ol(ctx, 2); ctx.restore(); }
        // transform puff
        const pq = t - tTurn; if (pq > -.1 && pq < .8){ const q = clamp(pq / .8, 0, 1); ctx.save(); ctx.globalAlpha *= 1 - q; ctx.fillStyle = "#F3E6D2"; for (let i = 0; i < 9; i++){ const an = i / 9 * TAU; ctx.beginPath(); ctx.arc(x + Math.cos(an) * (40 + q * 140), y - msize * .5 + Math.sin(an) * (40 + q * 120), 40 * (1 - q * .5), 0, TAU); ctx.fill(); } ctx.restore(); }
      },
      screen: (c) => {
        hits.forEach((hh, k) => { const d = t - hh.T; if (d < 0) return; const p = c.toScreen(hitPt[0], hitPt[1]); over(() => impact(ctx, p[0], p[1], d, 120, "#FFE3A8"));
          const nxt = hits[k + 1] ? hits[k + 1].T - .1 : (hh.out ? at(s, hh.out, .9) : hh.T + 2.4);
          popWord(ctx, hh.word, clamp(p[0] + (k % 2 ? 120 : -60), 300, 780), Math.max(300, p[1] - 120 - k * 30), hh.T, t, { out: nxt, hl: true, color: "#FF7A5C", size: 92, rot: k % 2 ? 6 : -6 }); });
        if (mini) says.forEach(sy => { const k = t - sy.T; if (k < 0 || k > (sy.dur || 2.6)) return; const p = c.toScreen(miniTop[0], miniTop[1]); over(() => bubble(ctx, sy.text, p[0], p[1] - 10, k, { kind: sy.kind || "say", size: 46, t })); });
        if (t > tTurn && t < tTurn + .9 && mini){ const p = c.toScreen(mini.x, mini.y - mini.size * .6); over(() => sparkles(ctx, p[0], p[1], t - tTurn, 10, 200)); }
      }
    });
  }, (s, f, i, add) => { const J = f.judge || {}; if (J.inCue) add(cueT(s, J.inCue, .2, i), "whoosh"); (J.hits || []).forEach((h, k) => { const T = cueT(s, h.cue, .3 + k * .2, i); add(T - .25, "whoosh"); add(T, "pop"); add(T + .05, "ping"); });
    if (J.turnCue){ const T = cueT(s, J.turnCue, .4, i); add(T, "whoosh"); add(T + .1, "chime"); } (J.say || []).forEach((h, k) => add(cueT(s, h.cue, .5 + k * .2, i), "pop")); });
  const eIn2 = x => x * x;

  /* ---------- ce_telepon: diagonal split phone call ---------- */
  reg("ce_telepon", "Cerita: telepon layar terbelah", (ctx, th, s, t) => {
    const f = s.f || {}, tSp = f.splitCue ? at(s, f.splitCue, .2) : (f.splitAt ?? .1), sp = eOut(clamp((t - tSp) / .55, 0, 1));
    const off = (1 - sp) * -820, xT = 640 + off, xB = 440 + off;
    const panel = (P, clipFn) => { if (!P) return; const toons = (P.toons || []).map(a => sized(a, s, t)), sts = toons.map(a => toonState(a, s, t));
      const resolve = (on, tt, k) => { const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0) return null; const st = sts[j], hp = toonHead(st), z = k.fit ? (1080 * k.fit) / (st.size * 42 / 92) : null; return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
      ctx.save(); clipFn(); ctx.clip();
      const c = cam(s, t, P.cam || [{ at: 0, x: 540, y: 980, zoom: 1 }], { resolve }); env(ctx, P.env || "home", t, c, P.envOpt || {});
      toons.forEach((a, j) => toon(ctx, c, a, s, t, { st: sts[j] })); envFront(ctx, P.env || "home", t, c, P.envOpt || {});
      ctx.restore(); return c; };
    panel(f.right, () => { ctx.beginPath(); ctx.moveTo(xT, -10); ctx.lineTo(1100, -10); ctx.lineTo(1100, 1930); ctx.lineTo(xB, 1930); ctx.closePath(); });
    if (sp > 0) panel(f.left, () => { ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(xT, -10); ctx.lineTo(xB, 1930); ctx.lineTo(-20, 1930); ctx.closePath(); });
    if (sp > 0){ // divider + phone signal
      ctx.save(); ctx.lineCap = "butt"; ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(xT, -10); ctx.lineTo(xB, 1930); ctx.stroke(); ctx.strokeStyle = CREAM; ctx.lineWidth = 16; ctx.stroke();
      const my = 760, mx = lerp(xT, xB, (my + 10) / 1940); for (let k = 0; k < 3; k++){ const w = ((t * .9 + k / 3) % 1); ctx.strokeStyle = hexA(HL, .8 * (1 - w)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(mx, my, 70 + w * 120, 0, TAU); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(mx, my, 62, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); icon(ctx, "phone", mx - 34, my - 34, 68, "#FFFFFF", 2.4); ctx.restore(); }
  }, (s, f, i, add) => { add(f.splitCue ? cueT(s, f.splitCue, .2, i) : (f.splitAt ?? .1), "whoosh"); [f.left, f.right].forEach(P => P && (P.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const T = k.at != null ? k.at : cueT(s, k.cue, .1 + j * .12, i); if (k.say != null) add(T, "pop"); if (k.jump) add(T + .13, "whoosh"); if (k.emote === "idea" || k.emote === "heart") add(T, "chime"); }))); });

  /* ---------- ce_kata: soft words vs heavy words ---------- */
  function pillow(ctx, x, y, s, txt, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); font(ctx, 800, 34, FAM); const w = Math.max(200, ctx.measureText(txt).width + 70), h = 92;
    ctx.beginPath(); ctx.moveTo(-w / 2 + 20, -h / 2); ctx.quadraticCurveTo(0, -h / 2 - 16, w / 2 - 20, -h / 2); ctx.quadraticCurveTo(w / 2 + 14, 0, w / 2 - 20, h / 2); ctx.quadraticCurveTo(0, h / 2 + 16, -w / 2 + 20, h / 2); ctx.quadraticCurveTo(-w / 2 - 14, 0, -w / 2 + 20, -h / 2); ctx.closePath();
    ctx.fillStyle = "#FFF1F0"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#E7A6A0"; [[-w / 2 + 18, -h / 2 + 4], [w / 2 - 18, -h / 2 + 4], [-w / 2 + 18, h / 2 - 4], [w / 2 - 18, h / 2 - 4]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 7, 0, TAU); ctx.fill(); });
    ctext(ctx, txt, 0, 12, w - 40, 34, "#A0483E"); ctx.restore(); }
  function stone(ctx, x, y, s, txt, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); const P = [[-120, -40], [-70, -78], [40, -84], [116, -46], [124, 30], [70, 72], [-60, 76], [-126, 30]];
    ctx.beginPath(); P.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.fillStyle = "#8A8580"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.ellipse(-40, -40, 50, 18, -.2, 0, TAU); ctx.fill();
    ctext(ctx, txt, 0, 14, 210, 44, "#FFFFFF"); ctx.restore(); }
  reg("ce_kata", "Cerita: kata lembut vs kata keras", (ctx, th, s, t) => {
    const f = s.f || {}, tS = f.softCue ? at(s, f.softCue, .3) : 1, tH = f.hardCue ? at(s, f.hardCue, .6) : 3, soft = f.soft || ["Wajar kok"], hard = f.hard || ["PAYAH"];
    const FX = 210, SX = 870, PY = 1220, msz = 330;
    base(ctx, s, t, { env: "info",
      target: k => [k.side ? SX : FX, PY - 200, k.zoom || 1.35],
      back: () => { const mq0 = f.minisCue ? clamp((t - at(s, f.minisCue, .1) - .3) / .3, 0, 1) : 1; if (mq0 <= 0) return; [[FX, "#7FA563"], [SX, "#C9675A"]].forEach(([x, col], k) => { glow(ctx, x, PY, 230, col, .35); ctx.fillStyle = hexA(col, .5); ctx.beginPath(); ctx.ellipse(x, PY + 6, 150, 34, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = hexA(col, .9); ctx.lineWidth = 5; ctx.stroke(); }); },
      front: (c, sts) => {
        const h = sts[0]; const hp = h ? toonHead(h) : [540, 1000];
        // mini friend + mini self
        const fr = Object.assign({ size: msz, x: FX, y: PY, face: 1, seed: 2 }, f.friend || {}), me = Object.assign({ size: msz, x: SX, y: PY, face: -1, seed: 5 }, f.self || {});
        const fst = toonState(fr, s, t), mst = toonState(me, s, t); fst.size = msz; mst.size = msz;
        if (t > tS + .5){ fst.expr = "happy"; fst.exprT = tS + .5; } if (t > tS + 1.4){ fst.expr = "laugh"; fst.exprT = tS + 1.4; fst.emote = "heart"; fst.emoteT = tS + 1.4; }
        let squash = 0; if (t > tH){ mst.expr = "sad"; mst.exprT = tH; const d = t - tH; squash = clamp(d * 6, 0, 1) * .16 + .05 * Math.sin(d * 18) * Math.exp(-d * 4); }
        const mq = f.minisCue ? popQ(t, at(s, f.minisCue, .1) + .3, .45) : 1; if (mq > 0){
        ctx.save(); ctx.translate(FX, PY); ctx.scale(mq, mq); ctx.translate(-FX, -PY); drawToon(ctx, fr, fst, t); ctx.restore();
        ctx.save(); ctx.translate(SX, PY); ctx.scale(mq * (1 + squash * .5), mq * (1 - squash)); ctx.translate(-SX, -PY); drawToon(ctx, me, mst, t); ctx.restore(); }
        // soft pillows: from the hero's mouth to the friend
        soft.forEach((w, k) => { const T = tS + k * .55, q = (t - T) / .9; if (q < 0) return; const qq = clamp(q, 0, 1), e = eOut(qq);
          const x = lerp(hp[0] - 60, FX + (k ? 30 : -20), e), y = lerp(hp[1] + 40, PY - msz * 1.05 - 50 - k * 82, e) - Math.sin(qq * Math.PI) * 180 + (q > 1 ? Math.sin(t * 2 + k) * 6 : 0);
          pillow(ctx, x, y, .55 + .45 * e, w, (1 - e) * -.6 + Math.sin(t * 1.5 + k) * .04); });
        // heavy stones: fall on the mini self
        hard.forEach((w, k) => { const T = tH + k * .5, q = t - T + .45; if (q < 0) return; const topY = PY - msz * 1.05 * (1 - squash) - 70 - k * 120;
          const y = Math.min(topY, -200 + 2400 * q * q), rot = (k ? .12 : -.1); stone(ctx, SX + (k ? 20 : -10), y, 1, w, rot);
          if (y >= topY) dust(ctx, SX, topY + 70, t - T, 8, 170); });
      },
      screen: (c) => {
        [[FX, f.softTag || "KE SAHABAT", "#5E9A4E", tS - .4], [SX, f.hardTag || "KE DIRI SENDIRI", RED, tH - .4]].forEach(([x, txt, col, T]) => { const p = c.toScreen(x, PY + 60); over(() => pillTag(ctx, txt, clamp(p[0], 200, 880), Math.min(1250, p[1]), popQ(t, T, .35), { bg: col, size: 34, maxW: 360 })); });
        hard.forEach((w, k) => { const d = t - tH - k * .5; if (d > 0 && d < .5){ const p = c.toScreen(SX, PY - msz); over(() => impact(ctx, p[0], p[1], d, 150, "#FFE3A8")); } });
      }
    });
  }, (s, f, i, add) => { const tS = f.softCue ? cueT(s, f.softCue, .3, i) : 1, tH = f.hardCue ? cueT(s, f.hardCue, .6, i) : 3; (f.soft || [1]).forEach((w, k) => add(tS + k * .55, "pop")); add(tS + 1.4, "chime"); (f.hard || [1]).forEach((w, k) => { add(tH + k * .5 - .3, "whoosh"); add(tH + k * .5, "pop"); }); });

  /* ---------- ce_lampion: write a kind line on a paper lantern, release it ---------- */
  function lantern(ctx, x, y, s, t, txt, chars){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    glow(ctx, 0, -10, 260, "#FFC46B", .55); const w = 200, h = 250;
    ctx.beginPath(); ctx.moveTo(-w * .38, -h / 2); ctx.bezierCurveTo(-w * .62, -h * .3, -w * .62, h * .3, -w * .4, h / 2); ctx.lineTo(w * .4, h / 2); ctx.bezierCurveTo(w * .62, h * .3, w * .62, -h * .3, w * .38, -h / 2); ctx.closePath();
    const g = ctx.createRadialGradient(0, 30, 10, 0, 0, 170); g.addColorStop(0, "#FFF3D0"); g.addColorStop(1, "#F4A85C"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "rgba(160,80,30,.35)"; ctx.lineWidth = 3; [-.33, 0, .33].forEach(fr => { ctx.beginPath(); ctx.moveTo(fr * w * .9, -h / 2); ctx.quadraticCurveTo(fr * w * 1.5, 0, fr * w * .9, h / 2); ctx.stroke(); });
    rr(ctx, -w * .4, -h / 2 - 16, w * .8, 20, 6); ctx.fillStyle = "#A0522D"; ctx.fill(); ol(ctx, 4); rr(ctx, -w * .42, h / 2 - 4, w * .84, 18, 6); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#FFE7A6"; ctx.beginPath(); ctx.ellipse(0, h / 2 + 22, 14, 20 + Math.sin(t * 18) * 3, 0, 0, TAU); ctx.fill();
    if (txt){ const shown = txt.slice(0, Math.max(0, Math.floor(chars))); font(ctx, 800, 30, FAM); const L = wrapRich(ctx, txt, "", w * .78).map(l => l.map(z => z.w).join(" ")).slice(0, 4);
      let n = shown.length; ctx.fillStyle = "#7A2E1A"; ctx.textAlign = "center"; L.forEach((l, i) => { const part = l.slice(0, Math.max(0, n)); n -= l.length + 1; ctx.fillText(part, 0, -h * .16 + (i - (L.length - 1) / 2) * 38 + 20); }); ctx.textAlign = "left"; }
    ctx.restore(); }
  reg("ce_lampion", "Cerita: lampion kalimat lembut", (ctx, th, s, t) => {
    const f = s.f || {}, L = f.lantern || {}, tW = L.writeCue ? at(s, L.writeCue, .3) : 1, tF = L.flyCue ? at(s, L.flyCue, .8) : 1e9, txt = L.text || "";
    let lp = [540, 900];
    base(ctx, s, t, { env: "night",
      target: k => [lp[0] + (k.dx || 0), lp[1] + (k.dy || 0), k.zoom || 1.3],
      back: (c) => { // other lanterns rising far away
        const n = t > tF ? 16 : 9; for (let i = 0; i < n; i++){ const sp = 60 + rnd(i) * 50, y = 1500 - ((t + (i >= 9 ? -(tF - 0) : 0)) * sp + rnd(i + 4) * 1400) % 1700, x = rnd(i + 9) * 1300 - 110 + Math.sin(t * .8 + i) * 30, sc = .22 + rnd(i + 2) * .2;
          if (i >= 9 && t - tF < 0) continue; lantern(ctx, x, y, sc, t + i, null, 0); } },
      front: (c, sts) => {
        const h = sts[0]; if (!h) return; const [hx, hy] = hand(h, 30, -47); let x = hx + 60, y = hy - 125;
        if (t > tF){ const d = t - tF; y -= Math.pow(d, 1.35) * 230; x += Math.sin(d * 1.6) * 40 + d * 20; }
        lp = [x, y]; lantern(ctx, x, y, 1, t, txt, (t - tW) * 14);
      },
      screen: (c) => { if (t > tW && t < tW + 1.8){ const p = c.toScreen(lp[0], lp[1]); over(() => sparkles(ctx, p[0] + 60, p[1], (t - tW) % .9, 6, 110)); } if (t > tF && t < tF + .9){ const p = c.toScreen(lp[0], lp[1]); over(() => sparkles(ctx, p[0], p[1], t - tF, 12, 240)); } }
    });
  }, (s, f, i, add) => { const L = f.lantern || {}; if (L.writeCue) add(cueT(s, L.writeCue, .3, i), "pop"); if (L.flyCue){ const T = cueT(s, L.flyCue, .8, i); add(T, "whoosh"); add(T + .3, "chime"); } });
  /* =================================================================== SB25 */
  function medal(ctx, x, y, r, t, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2.4) * .08);
    ctx.fillStyle = "#2F6F73"; ctx.beginPath(); ctx.moveTo(-r * .55, -r * 2.1); ctx.lineTo(-r * .1, -r * .7); ctx.lineTo(r * .1, -r * .7); ctx.lineTo(r * .55, -r * 2.1); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = col || GOLD; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFF3C4"; starP(ctx, 0, 0, r * .6); ctx.restore(); }
  reg("ce_raksasa", "Cerita: rekan jadi raksasa", (ctx, th, s, t) => {
    const f = s.f || {}, B = (f.badges || []).map((b, k) => Object.assign({ T: at(s, b.cue, .3 + k * .2) }, b));
    let tops = [];
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rugX: 540 },
      mid: (c, sts) => { B.forEach(b => { if (b.kind !== "spot" || t < b.T) return; const st = sts[b.toon]; if (!st) return; const q = clamp((t - b.T) / .4, 0, 1);
        ctx.save(); ctx.globalAlpha *= q * (.75 + .1 * Math.sin(t * 5)); const g = ctx.createLinearGradient(0, -300, 0, GY); g.addColorStop(0, "rgba(255,236,190,.0)"); g.addColorStop(1, "rgba(255,236,190,.55)"); ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(st.x - 90, -400); ctx.lineTo(st.x + 90, -400); ctx.lineTo(st.x + 420, GY + 40); ctx.lineTo(st.x - 420, GY + 40); ctx.closePath(); ctx.fill(); ctx.restore(); }); },
      front: (c, sts) => { tops = sts.map(st => { const hp = toonHead(st); return [hp[0], hp[1] - st.size * .25]; });
        B.forEach(b => { const st = sts[b.toon]; if (!st || t < b.T) return; const k = st.size / 92, q = popQ(t, b.T + .3, .4); if (q <= 0) return;
          if (b.kind !== "spot") medal(ctx, st.x + 5 * k * (st.face || 1), st.y - 40 * k, 6.5 * k * q, t, GOLD);
          else { ctx.save(); ctx.translate(st.x + 22 * k * (st.face || 1), st.y - 52 * k); ctx.rotate(-.5 * (st.face || 1)); ctx.scale(q, q); rr(ctx, -5 * k, 0, 10 * k, 26 * k, 4 * k); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -2 * k, 8 * k, 0, TAU); ctx.fillStyle = "#8A8580"; ctx.fill(); ol(ctx, 4); ctx.restore(); } }); },
      screen: (c, sts) => { B.forEach(b => { const tp = tops[b.toon]; if (!tp || t < b.T + .3) return; const p = c.toScreen(tp[0], tp[1]);
        over(() => pillTag(ctx, b.text, clamp(p[0], 230, 850), clamp(p[1], 250, 1150), popQ(t, b.T + .3, .4), { bg: b.kind === "spot" ? "#2F6F73" : ORANGE, size: 40, rot: b.toon % 2 ? 4 : -4 }));
        if (t - b.T < .9){ const pp = c.toScreen(sts[b.toon].x, sts[b.toon].y - sts[b.toon].size * .5); over(() => sparkles(ctx, pp[0], pp[1], t - b.T - .3, 10, 260)); } }); }
    });
  }, (s, f, i, add) => { (f.badges || []).forEach((b, k) => { const T = cueT(s, b.cue, .3 + k * .2, i); add(T, "whoosh"); add(T + .35, "chime"); }); });

  /* ---------- ce_lomba: different start gates ---------- */
  reg("ce_lomba", "Cerita: garis start berbeda", (ctx, th, s, t) => {
    const f = s.f || {}, G2 = f.gates || [{ x: 300, label: "START", sub: "" }], tGap = f.gapCue ? at(s, f.gapCue, .5) : 1e9;
    base(ctx, s, t, { env: "street",
      target: k => [k.x ?? 540, k.y ?? 1000, k.zoom || 1],
      back: () => {
        // start lines on the road + gates
        G2.forEach((g, j) => { const x = g.x; for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++){ ctx.fillStyle = (i + r) % 2 ? "#FFFFFF" : "#2B1A12"; ctx.fillRect(x - 20 + r * 20, GY - 150 + i * 36, 20, 36); }
          const by = GY - 760, wv = Math.sin(t * 3 + j) * 6; [-1, 1].forEach(d => { rr(ctx, x + d * 250 - 12, by, 24, 760 - 140, 8); ctx.fillStyle = "#8A8580"; ctx.fill(); ol(ctx, 4); });
          ctx.beginPath(); ctx.moveTo(x - 270, by + wv); ctx.quadraticCurveTo(x, by - 20 - wv, x + 270, by + wv); ctx.lineTo(x + 270, by + 150 + wv); ctx.quadraticCurveTo(x, by + 130 - wv, x - 270, by + 150 + wv); ctx.closePath(); ctx.fillStyle = j ? "#2F6F73" : ORANGE; ctx.fill(); ol(ctx, 6);
          ctext(ctx, g.label || "START", x, by + 66, 480, 58, "#FFFFFF"); if (g.sub) ctext(ctx, g.sub, x, by + 116, 460, 34, "#FFE7C8", 700);
          for (let i = 0; i < 9; i++){ ctx.fillStyle = [ORANGE, GOLD, "#2F6F73", CREAM][i % 4]; const fx = x - 240 + i * 60; ctx.beginPath(); ctx.moveTo(fx, by - 40); ctx.lineTo(fx + 40, by - 40); ctx.lineTo(fx + 20, by - 6 + Math.sin(t * 4 + i) * 4); ctx.closePath(); ctx.fill(); } });
        if (G2.length > 1 && t > tGap){ const q = eOut(clamp((t - tGap) / .8, 0, 1)), x0 = G2[0].x + 280, x1 = lerp(x0, G2[1].x - 280, q), y = GY - 960;
          ctx.strokeStyle = CREAM; ctx.lineWidth = 16; ctx.setLineDash([40, 26]); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(x1 + 50, y); ctx.lineTo(x1 - 10, y - 40); ctx.lineTo(x1 - 10, y + 40); ctx.closePath(); ctx.fill(); ol(ctx, 4);
          if (q > .6 && f.gapText) pillTag(ctx, f.gapText, (x0 + x1) / 2, y - 90, popQ(t, tGap + .5, .4), { bg: RED, size: 64 }); }
      }
    });
  }, (s, f, i, add) => { if (f.gapCue){ const T = cueT(s, f.gapCue, .5, i); add(T, "whoosh"); add(T + .5, "pop"); } });

  /* ---------- ce_tv: retro TV plays the past self ---------- */
  reg("ce_tv", "Cerita: TV kilas balik VHS", (ctx, th, s, t) => {
    const f = s.f || {}, V = Object.assign({ x: 690, y: 1330, w: 560, h: 420 }, f.tv || {}), tOn = V.onCue ? at(s, V.onCue, .4) : .5, tRw = V.rewindCue ? at(s, V.rewindCue, .7) : 1e9;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 980 },
      target: k => [V.x + (k.dx || 0), V.y - V.h * .55 + (k.dy || 0), k.zoom || 1.5],
      back: () => {
        const { x, y, w, h } = V, x0 = x - w / 2 - 40, y0 = y - h - 70;
        // cabinet
        rr(ctx, x - w / 2 - 60, y, w + 120, GY - y + 10, 12); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#A9643B"; rr(ctx, x - w / 2 - 40, y + 30, w / 2, GY - y - 60, 8); ctx.fill(); rr(ctx, x + 20, y + 30, w / 2, GY - y - 60, 8); ctx.fill();
        // antenna
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x - 120, y0 - 170 + Math.sin(t * 2) * 6); ctx.moveTo(x, y0); ctx.lineTo(x + 110, y0 - 180); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y0, 22, Math.PI, 0); ctx.fillStyle = "#5A4A42"; ctx.fill(); ol(ctx, 4);
        // body
        rr(ctx, x0, y0, w + 140, h + 70, 40); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "rgba(255,255,255,.12)"; rr(ctx, x0 + 14, y0 + 12, w + 110, 26, 12); ctx.fill();
        const sx = x - w / 2 - 10, sy = y0 + 35, sw = w - 20, sh = h;
        [0, 1].forEach(i => { ctx.beginPath(); ctx.arc(x + w / 2 + 60, y0 + 110 + i * 90, 26, 0, TAU); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + w / 2 + 60, y0 + 110 + i * 90); ctx.lineTo(x + w / 2 + 60 + Math.cos(t + i) * 20, y0 + 110 + i * 90 + Math.sin(t + i) * 20); ctx.stroke(); });
        ctx.save(); rr(ctx, sx, sy, sw, sh, 46); ctx.clip();
        const on = clamp((t - tOn) / .35, 0, 1);
        ctx.fillStyle = "#1E2A2A"; ctx.fillRect(sx, sy, sw, sh);
        if (on > 0){
          ctx.save(); ctx.translate(sx + sw / 2, sy + sh / 2); ctx.scale(1, Math.max(.01, on)); ctx.translate(-(sx + sw / 2), -(sy + sh / 2));
          ctx.filter = "sepia(0.85) saturate(0.9) contrast(1.05)";
          ctx.fillStyle = "#E8D2B0"; ctx.fillRect(sx, sy, sw, sh); ctx.fillStyle = "#C9A57E"; ctx.fillRect(sx, sy + sh * .72, sw, sh);
          // past desk + paper pile + past self
          const rw = t > tRw && t < tRw + 1.3, jx = rw ? Math.sin(t * 70) * 6 : 0;
          ctx.fillStyle = "#8E5A34"; rr(ctx, sx + sw * .52 + jx, sy + sh * .62, sw * .42, 22, 6); ctx.fill(); ctx.fillRect(sx + sw * .55 + jx, sy + sh * .62, 14, sh * .4); ctx.fillRect(sx + sw * .9 + jx, sy + sh * .62, 14, sh * .4);
          for (let i = 0; i < 9; i++){ ctx.fillStyle = i % 2 ? "#FFFDF8" : "#EADCC6"; ctx.fillRect(sx + sw * .6 + Math.sin(i * 1.7) * 6 + jx, sy + sh * .62 - 14 - i * 14, 120, 14); }
          if (V.past){ const pa = Object.assign({ size: 340, x: sx + sw * .3 + jx, y: sy + sh + 40, face: 1, seed: 4 }, V.past), pst = toonState(pa, s, t); pst.x = sx + sw * .3 + jx; pst.y = sy + sh + 40; pst.size = 340; drawToon(ctx, pa, pst, t); }
          ctx.filter = "none"; ctx.restore();
          // VHS overlay
          ctx.fillStyle = "rgba(0,0,0,.16)"; for (let yy = sy; yy < sy + sh; yy += 6) ctx.fillRect(sx, yy, sw, 2);
          const band = (t * 120) % (sh + 80); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(sx, sy + band - 40, sw, 30);
          if (t > tRw && t < tRw + 1.3){ for (let i = 0; i < 5; i++){ const yy = sy + ((t * 900 + i * 97) % sh); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(sx, yy, sw, 6 + i % 3 * 4); } }
          font(ctx, 800, 34, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText(t > tRw && t < tRw + 1.3 ? "◀◀ REW" : "▶ PLAY", sx + 50, sy + 60);
          if (Math.sin(t * 6) > 0){ ctx.fillStyle = "#FF5A4A"; ctx.beginPath(); ctx.arc(sx + sw - 120, sy + 48, 11, 0, TAU); ctx.fill(); } ctx.fillStyle = "#FFFFFF"; ctx.fillText("REC", sx + sw - 100, sy + 60);
          if (t > tRw + .9 && V.label){ font(ctx, 800, 40, FAM); ctx.fillStyle = "rgba(0,0,0,.45)"; const lw = ctx.measureText(V.label).width + 30; ctx.fillRect(sx + sw / 2 - lw / 2, sy + sh - 78, lw, 54); ctx.fillStyle = "#FFF1C9"; ctx.textAlign = "center"; ctx.fillText(V.label, sx + sw / 2, sy + sh - 38); ctx.textAlign = "left"; }
          if (on < 1){ ctx.fillStyle = "#FFFFFF"; ctx.fillRect(sx, sy + sh / 2 - 4, sw, 8); }
        } else { ctx.fillStyle = "rgba(255,255,255,.1)"; ctx.beginPath(); ctx.ellipse(sx + sw * .3, sy + sh * .3, 120, 60, -.4, 0, TAU); ctx.fill(); }
        ctx.restore(); rr(ctx, sx, sy, sw, sh, 46); ol(ctx, 8);
      }
    });
  }, (s, f, i, add) => { const V = f.tv || {}; if (V.onCue) add(cueT(s, V.onCue, .4, i), "ping"); if (V.rewindCue) add(cueT(s, V.rewindCue, .7, i), "whoosh"); });

  /* ---------- ce_ukur: growth marks on a tree trunk ---------- */
  reg("ce_ukur", "Cerita: tanda tinggi di batang pohon", (ctx, th, s, t) => {
    const f = s.f || {}, TR = Object.assign({ x: 600 }, f.trunk || {}), M = (f.marks || []).map((m, k) => Object.assign({ T: at(s, m.cue, .3 + k * .1), O: m.outCue ? at(s, m.outCue, .2) : 1e9 }, m)), tUp = f.upCue ? at(s, f.upCue, .3) : 1e9;
    const yOf = sz => GY - sz * 1.02;
    base(ctx, s, t, { env: "park", envOpt: { bench: false, treeX: -500 },
      target: k => [k.x ?? 520, k.y ?? 950, k.zoom || 1],
      back: () => {
        const x = TR.x; ctx.fillStyle = "#7A5236"; ctx.beginPath(); ctx.moveTo(x - 110, GY + 10); ctx.quadraticCurveTo(x - 80, GY - 600, x - 85, -200); ctx.lineTo(x + 85, -200); ctx.quadraticCurveTo(x + 80, GY - 600, x + 110, GY + 10); ctx.closePath(); ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 5; for (let i = 0; i < 9; i++){ const yy = 200 + i * 160; ctx.beginPath(); ctx.moveTo(x - 50 + (i % 2) * 30, yy); ctx.quadraticCurveTo(x - 30, yy + 50, x - 44 + (i % 3) * 20, yy + 110); ctx.stroke(); }
        // painted ruler
        rr(ctx, x - 26, GY - 1150, 52, 1000, 8); ctx.fillStyle = "#FFF1DC"; ctx.fill(); ol(ctx, 4);
        ctx.strokeStyle = BROWN; ctx.lineWidth = 3; for (let i = 0; i <= 40; i++){ const yy = GY - 160 - i * 24.5; ctx.beginPath(); ctx.moveTo(x - 26, yy); ctx.lineTo(x - 26 + (i % 5 ? 14 : 30), yy); ctx.stroke(); }
        // crown peeking at the top
        ctx.fillStyle = "#5F8F4E"; [[-260, -40, 230], [0, -140, 300], [260, -40, 230]].forEach(([dx, dy, r], i) => { ctx.beginPath(); ctx.arc(x + dx + Math.sin(t + i) * 8, dy, r, 0, TAU); ctx.fill(); });
        // marks + tags
        M.forEach((m, k) => { if (t < m.T) return; const q = clamp((t - m.T) / .35, 0, 1), y = yOf(m.size), col = m.old ? "#8A8580" : RED;
          ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 90, y); ctx.lineTo(x - 90 + 180 * q, y); ctx.stroke();
          const tq = popQ(t, m.T + .15, .4) * (1 - clamp((t - m.O) / .3, 0, 1)); if (tq <= 0) return;
          ctx.save(); ctx.translate(x - 330, y); ctx.scale(tq, tq); ctx.rotate(m.old ? .03 : -.03); font(ctx, 800, 40, FAM); let z = fitFont(ctx, m.text, 360, 42, 22); const w = ctx.measureText(m.text).width + 40;
          rr(ctx, -w / 2, -36, w, 72, 12); ctx.fillStyle = m.old ? "#E8E2D8" : CREAM; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = m.old ? "#6E6A66" : RED; ctx.textAlign = "center"; ctx.fillText(m.text, 0, z * .36); ctx.textAlign = "left";
          if (m.tag){ font(ctx, 800, 22, FAM); const tw = ctx.measureText(m.tag).width + 20; rr(ctx, -w / 2 + 10, -60, tw, 30, 8); ctx.fillStyle = col; ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(m.tag, -w / 2 + 20, -38); }
          ctx.restore(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(x - 330 + 190 * tq, y); ctx.lineTo(x - 90, y); ctx.stroke(); ctx.setLineDash([]); });
        if (t > tUp && M.length){ const ys = M.map(m => yOf(m.size)), y0 = Math.max(...ys), y1 = Math.min(...ys), q = eOut(clamp((t - tUp) / .6, 0, 1)), yy = lerp(y0, y1 - 40, q), x2 = x + 140;
          ctx.strokeStyle = GREEN; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x2, y0); ctx.lineTo(x2, yy); ctx.stroke(); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(x2, yy - 40); ctx.lineTo(x2 - 34, yy + 10); ctx.lineTo(x2 + 34, yy + 10); ctx.closePath(); ctx.fill(); ol(ctx, 4); }
      },
      screen: c => { M.forEach(m => { const d = t - m.T; if (d > 0 && d < .9 && !m.old){ const p = c.toScreen(TR.x, yOf(m.size)); over(() => sparkles(ctx, p[0], p[1], d, 8, 130)); } }); }
    });
  }, (s, f, i, add) => { (f.marks || []).forEach((m, k) => add(cueT(s, m.cue, .3 + k * .1, i), m.old ? "pop" : "chime")); if (f.upCue) add(cueT(s, f.upCue, .3, i), "whoosh"); });

  /* ---------- ce_botol: note into a bottle, row of bottles on a rock ---------- */
  function bottle(ctx, x, y, s, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (o.ghost){ ctx.setLineDash([12, 10]); }
    ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-50, -150); ctx.quadraticCurveTo(-50, -190, -22, -205); ctx.lineTo(-22, -250); ctx.lineTo(22, -250); ctx.lineTo(22, -205); ctx.quadraticCurveTo(50, -190, 50, -150); ctx.lineTo(50, 0); ctx.closePath();
    if (!o.ghost){ ctx.fillStyle = "rgba(170,220,215,.55)"; ctx.fill(); } ctx.strokeStyle = o.ghost ? "#FFF4E6" : OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.setLineDash([]);
    if (!o.ghost){ ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(-36, -140, 10, 110); if (o.note){ ctx.save(); ctx.rotate(.1); rr(ctx, -22, -150, 44, 130, 18); ctx.fillStyle = "#FFF6E0"; ctx.fill(); ctx.strokeStyle = "#C9A57E"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
      rr(ctx, -16, -272, 32, 34, 6); ctx.fillStyle = "#B07A4A"; ctx.fill(); ol(ctx, 4); }
    else { font(ctx, 800, 90, FAM); ctx.fillStyle = "#FFF4E6"; ctx.textAlign = "center"; ctx.fillText("?", 0, -80); ctx.textAlign = "left"; }
    ctx.restore(); }
  reg("ce_botol", "Cerita: catatan dalam botol", (ctx, th, s, t) => {
    const f = s.f || {}, N = f.note || {}, R = Object.assign({ x: 760, top: GY - 330, labels: ["BULAN INI", "BULAN DEPAN"] }, f.row || {}), tW = N.writeCue ? at(s, N.writeCue, .2) : .5, tR = N.rollCue ? at(s, N.rollCue, .3) : 1e9, tRow = R.cue ? at(s, R.cue, .4) : 1e9;
    let notePos = null; const slots = [R.x - 110, R.x + 110];
    base(ctx, s, t, { env: "beach", envOpt: { palmX: 1060 },
      target: k => [k.x ?? R.x, k.y ?? R.top - 160, k.zoom || 1.3],
      back: () => { // rock
        const x = R.x, y = R.top; ctx.beginPath(); ctx.moveTo(x - 300, GY + 20); ctx.quadraticCurveTo(x - 320, y + 40, x - 220, y); ctx.lineTo(x + 230, y - 6); ctx.quadraticCurveTo(x + 330, y + 60, x + 310, GY + 20); ctx.closePath(); ctx.fillStyle = "#8A7D70"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.beginPath(); ctx.ellipse(x - 60, y + 50, 150, 30, -.05, 0, TAU); ctx.fill(); ctx.fillStyle = "#6E9A58"; ctx.beginPath(); ctx.ellipse(x + 200, y + 20, 60, 20, .3, 0, TAU); ctx.fill(); },
      front: (c, sts) => {
        const h = sts[0]; if (!h) return; const [hx, hy] = hand(h, 26, -50);
        // the note in the hands, typed text, then rolled into the bottle
        if (t > tW){ const q = popQ(t, tW, .4), roll = clamp((t - tR) / .5, 0, 1), fly = clamp((t - tR - .5) / .8, 0, 1);
          const nx = hx + 90, ny = hy - 130;
          if (roll < 1){ ctx.save(); ctx.translate(nx, ny); ctx.scale(q, q * (1 - roll * .85)); ctx.rotate(-.05); rr(ctx, -150, -100, 300, 200, 10); ctx.fillStyle = "#FFF6E0"; ctx.fill(); ol(ctx, 5);
            ctx.strokeStyle = "rgba(194,105,31,.25)"; ctx.lineWidth = 3; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(-130, -40 + i * 42); ctx.lineTo(130, -40 + i * 42); ctx.stroke(); }
            const txt = N.text || "", n = Math.floor((t - tW - .3) * 16); font(ctx, 700, 32, FAM); const L = wrapRich(ctx, txt, "", 250).map(l => l.map(z => z.w).join(" ")).slice(0, 3); let left = n; ctx.fillStyle = "#7A2E1A";
            L.forEach((l, i) => { if (left > 0) ctx.fillText(l.slice(0, left), -125, -52 + i * 42); left -= l.length + 1; }); ctx.restore(); }
          const bx = lerp(nx, slots[0], eOut(fly)), by = lerp(ny + 120, R.top, eOut(fly)) - Math.sin(fly * Math.PI) * 200; notePos = [bx, by];
          if (t > tR + .25) bottle(ctx, bx, by, .9 * popQ(t, tR + .25, .35), { note: roll >= 1 }); }
        // second (ghost) bottle for next month
        if (t > tRow) bottle(ctx, slots[1], R.top, .9 * popQ(t, tRow, .4), { ghost: true });
      },
      screen: c => {
        R.labels.forEach((l, k) => { const T = k ? tRow + .2 : tR + 1.3; if (t < T) return; const p = c.toScreen(slots[k], R.top - 300 - k * 80); over(() => pillTag(ctx, l, clamp(p[0], 170, 910), Math.max(260, p[1]), popQ(t, T, .35), { bg: k ? "#2F6F73" : ORANGE, size: 40, maxW: 250 })); });
        if (t > tR + 1.3 && t < tR + 2.2){ const p = c.toScreen(slots[0], R.top - 120); over(() => sparkles(ctx, p[0], p[1], t - tR - 1.3, 10, 160)); }
      }
    });
  }, (s, f, i, add) => { const N = f.note || {}, R = f.row || {}; if (N.writeCue) add(cueT(s, N.writeCue, .2, i), "pop"); if (N.rollCue){ const T = cueT(s, N.rollCue, .3, i); add(T + .3, "whoosh"); add(T + 1.3, "chime"); } if (R.cue) add(cueT(s, R.cue, .4, i), "pop"); });
  /* =================================================================== SP25 */
  // energy panel (screen): f.coins {total, start, lose:[cue], gain:[cue], y, label}
  function coinCount(s, C, t){ const L = (C.lose || []).map((c, k) => at(s, c, .3 + k * .1)), G = (C.gain || []).map((c, k) => at(s, c, .5 + k * .1));
    let n = C.start ?? C.total ?? 5; const ev = L.map(T => [T, -1]).concat(G.map(T => [T, +1 * (C.gainN || C.total || 5)])).sort((a, b) => a[0] - b[0]); const hist = [];
    ev.forEach(([T, d]) => { if (t >= T){ const before = n; n = clamp(n + d, 0, C.total || 5); hist.push({ T, d, before, after: n }); } }); return { n, hist }; }
  function energyPanel(ctx, s, f, t){
    const C = f.coins; if (!C) return; const total = C.total || 5, { n, hist } = coinCount(s, C, t), y = C.y ?? 215, inQ = popQ(t, C.at ?? .15, .4);
    over(() => { ctx.save(); ctx.translate(540, y); ctx.scale(inQ, inQ); const w = 150 + total * 84; rr(ctx, -w / 2, -52, w, 104, 52); ctx.fillStyle = "rgba(30,18,11,.72)"; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.stroke();
      font(ctx, 800, 30, FAM); ctx.fillStyle = "#FFE7A6"; ctx.fillText(C.label || "ENERGI", -w / 2 + 30, 11);
      const low = n <= 1 && hist.length; for (let i = 0; i < total; i++){ const cx = -w / 2 + 210 + i * 84, on = i < n; const last = hist.filter(hh => (hh.d < 0 && i === hh.after) || (hh.d > 0 && i >= hh.before && i < hh.after)).pop();
        let sc = 1; if (last){ const d = t - last.T; if (last.d > 0) sc = eBack(clamp((d - (i - last.before) * .08) / .35, 0, 1)); else if (d < .3) sc = 1 + .4 * Math.sin(d / .3 * Math.PI); }
        if (on){ ctx.save(); ctx.translate(cx, 0); ctx.scale(sc, sc); coin(ctx, 0, 0, 32, t * 2 + i, true); ctx.restore(); }
        else { ctx.beginPath(); ctx.arc(cx, 0, 30, 0, TAU); ctx.strokeStyle = low && Math.sin(t * 10) > 0 ? RED : "rgba(255,231,166,.35)"; ctx.lineWidth = 4; ctx.setLineDash([8, 7]); ctx.stroke(); ctx.setLineDash([]); } }
      ctx.restore(); });
  }
  function flyCoin(ctx, c, x, y, T, t, dir){ const d = t - T; if (d < 0 || d > 1.2) return; const p = c.toScreen(x, y);
    over(() => { const xx = p[0] + (dir || 1) * d * 420, yy = p[1] - d * 700 + d * d * 500; ctx.save(); ctx.globalAlpha *= 1 - d / 1.2; coin(ctx, xx, yy, 34, d * 14, true); ctx.restore(); sparkles(ctx, p[0], p[1], d, 8, 120); }); }

  reg("ce_kotak", "Cerita: kotak keputusan menimpa kepala", (ctx, th, s, t) => {
    const f = s.f || {}, BX = (f.boxes || []).map((b, k) => Object.assign({ T: at(s, b.cue, .35 + k * .15) }, b)); let headTop = [540, 800], c0 = null;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 900 },
      target: k => [k.x ?? 540, k.y ?? 1000, k.zoom || 1],
      front: (c, sts) => { c0 = c; const h = sts[0]; if (!h) return; const hp = toonHead(h), r = 20.5 * h.size / 92; headTop = [hp[0], hp[1] - r * 1.05];
        BX.forEach((b, k) => { const d = t - b.T; if (d < -.5) return; const side = k % 2 ? 1 : -1, land = [h.x + side * (260 + Math.floor(k / 2) * 120), GY - 80];
          let x, y, rot, sq = 0;
          if (d < 0){ const q = (d + .5) / .5; x = headTop[0] + side * 20; y = lerp(-400, headTop[1] - 75, q * q); rot = side * .2 * (1 - q); }
          else if (d < .7){ const q = d / .7; x = lerp(headTop[0], land[0], q); y = lerp(headTop[1] - 75, land[1], q) - Math.sin(q * Math.PI) * 260; rot = side * q * 4; sq = d < .1 ? .2 * (1 - d / .1) : 0; }
          else { x = land[0]; y = land[1]; rot = side * (Math.PI * 1.27) + Math.sin(Math.max(0, 1.2 - d) * 20) * .05 * Math.max(0, 1.2 - d); if (d < .9) sq = .15 * Math.sin((d - .7) / .2 * Math.PI); }
          qbox(ctx, x, y, .8, d < .7 ? b.label : null, rot, { sx: 1 + sq, sy: 1 - sq });
          });
      },
      screen: (c) => { BX.forEach((b, k) => { const p = c.toScreen(headTop[0], headTop[1]); over(() => impact(ctx, p[0], p[1], t - b.T, 140, "#FFE3A8")); flyCoin(ctx, c, headTop[0], headTop[1], b.T, t, k % 2 ? -1 : 1); }); energyPanel(ctx, s, f, t); }
    });
  }, (s, f, i, add) => { (f.boxes || []).forEach((b, k) => { const T = cueT(s, b.cue, .35 + k * .15, i); add(T - .45, "whoosh"); add(T, "pop"); add(T + .15, "ping"); }); });

  reg("ce_buntu", "Cerita: kepala buntu, energi habis", (ctx, th, s, t) => {
    const f = s.f || {}, Bg = f.big || {}, tBig = Bg.cue ? at(s, Bg.cue, .3) : 1e9, tLoad = f.loadCue ? at(s, f.loadCue, .3) : 1e9, tWeed = f.weedCue ? at(s, f.weedCue, .2) : 1e9, tMelt = f.meltCue ? at(s, f.meltCue, .4) : 1e9;
    let headTop = [400, 800];
    base(ctx, s, t, { env: "office", envOpt: { deskX: 860, rugX: 480 },
      target: k => [k.x ?? 600, k.y ?? 800, k.zoom || 1.2],
      drawToon: (j, a, st, c) => { if (j !== 0 || t < tMelt) return false; const m = eOut(clamp((t - tMelt) / .9, 0, 1)) * (1 + .04 * Math.sin(t * 6));
        ctx.save(); c.apply(ctx); ctx.translate(st.x, st.y); ctx.scale(1 + m * .22, 1 - m * .3); ctx.translate(-st.x, -st.y); drawToon(ctx, a, st, t);
        ctx.fillStyle = hexA("#7FA563", .0); ctx.restore(); // puddle
        ctx.save(); c.apply(ctx); ctx.globalAlpha *= m; ctx.fillStyle = "rgba(127,165,99,.5)"; ctx.beginPath(); ctx.ellipse(st.x, st.y + 6, 220 * m, 26 * m, 0, 0, TAU); ctx.fill(); ctx.restore(); return true; },
      front: (c, sts) => { const h = sts[0]; if (h){ const hp = toonHead(h), r = 20.5 * h.size / 92, m = t > tMelt ? eOut(clamp((t - tMelt) / .9, 0, 1)) * .3 : 0; headTop = [hp[0], h.y - (h.y - hp[1] + r * 1.05) * (1 - m)]; }
        if (t > tBig){ const q = popQ(t, tBig, .5), x = Bg.x ?? 700, y = (Bg.y ?? 640) + Math.sin(t * 2) * 14; glow(ctx, x, y, 320, "#FFD08A", .5 * q); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.6) * .06); qbox(ctx, 0, 0, 1.25 * q, Bg.label, 0, { mark: "!", col: ORANGE }); ctx.restore(); }
        if (t > tLoad){ const q = popQ(t, tLoad, .3), x = headTop[0], y = headTop[1] - 110; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 78, 0, TAU); ctx.fillStyle = "rgba(255,253,248,.92)"; ctx.fill(); ol(ctx, 5);
          for (let i = 0; i < 8; i++){ const a = i / 8 * TAU + t * 5, al = ((i / 8 + t * .8) % 1); ctx.fillStyle = hexA(BROWN, .2 + .8 * al); ctx.beginPath(); ctx.arc(Math.cos(a) * 48, Math.sin(a) * 48, 11, 0, TAU); ctx.fill(); } ctx.restore(); }
        if (t > tWeed){ const d = t - tWeed, x = -300 + d * 520, y = GY - 70 - Math.abs(Math.sin(d * 5)) * 70; ctx.save(); ctx.translate(x, y); ctx.rotate(d * 6); ctx.strokeStyle = "#A07A4A"; ctx.lineWidth = 6;
          for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.ellipse(0, 0, 70, 30 + i * 4, i * .7, 0, TAU); ctx.stroke(); } ctx.restore(); }
      },
      screen: (c) => { if (t > tWeed){ const d = t - tWeed; ["krik...", "krik..."].forEach((w, k) => { const q = d - k * .6; if (q < 0 || q > 1.6) return; over(() => { ctx.save(); ctx.globalAlpha *= 1 - q / 1.6; font(ctx, 700, 44, FAM); ctx.fillStyle = "#FFFDF8"; ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.strokeText(w, 180 + k * 420, 1200 - q * 60); ctx.fillText(w, 180 + k * 420, 1200 - q * 60); ctx.restore(); }); }); }
        energyPanel(ctx, s, f, t); }
    });
  }, (s, f, i, add) => { const Bg = f.big || {}; if (Bg.cue) add(cueT(s, Bg.cue, .3, i), "chime"); if (f.loadCue) add(cueT(s, f.loadCue, .3, i), "ping"); if (f.weedCue) add(cueT(s, f.weedCue, .2, i), "whoosh"); if (f.meltCue) add(cueT(s, f.meltCue, .4, i), "whoosh"); });

  reg("ce_autopilot", "Cerita: kereta rutinitas otomatis", (ctx, th, s, t) => {
    const f = s.f || {}, Cc = Object.assign({ x0: -200, v: 230, label: "RUTINITAS", inCue: null }, f.cart || {}), tIn = Cc.inCue ? at(s, Cc.inCue, .2) : (Cc.at ?? .3), BXS = f.boxes || [], tSave = f.saveCue ? at(s, f.saveCue, .5) : 1e9, Gl = f.goal || {}, tGoal = Gl.cue ? at(s, Gl.cue, .5) : 1e9;
    const d0 = Math.max(0, t - tIn), cx = Cc.x0 + (d0 < 1 ? Cc.v * d0 * d0 / 2 : Cc.v * (d0 - .5)), bxX = BXS.map((b, k) => b.x ?? (Cc.x0 + 900 + k * 620)), goalX = Gl.x ?? (bxX.length ? bxX[bxX.length - 1] + 750 : 1500);
    const size = f.size || 640, kk = size / 92, floorY = GY - 100;
    base(ctx, s, t, { env: "street",
      mod: toons => { if (toons[0]){ toons[0] = Object.assign({}, toons[0], { x: cx + 10, y: floorY, size, pose: "sit" }); } },
      pre: sts => { if (sts[0]){ sts[0].x = cx + 10; sts[0].y = floorY; sts[0].pose = "sit"; sts[0].moving = false; } },
      target: k => [cx + (k.dx ?? 200), k.y ?? 1080, k.zoom || 1],
      back: () => {
        BXS.forEach((b, k) => { const x = bxX[k], done = cx + 260 > x, dq = done ? clamp((cx + 260 - x) / 160, 0, 1) : 0; qbox(ctx, x, GY - 90 - Math.abs(Math.sin(t * 3 + k)) * (done ? 0 : 12), .75, b.label, 0, { col: done ? GREEN : GOLD, mark: dq > .5 ? "✓" : "?" }); });
        if (t > tGoal - .2){ const q = popQ(t, tGoal, .5), x = goalX, y = GY - 520 + Math.sin(t * 2) * 10; ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x, GY - 60); ctx.lineTo(x, y); ctx.stroke(); glow(ctx, x, y, 300, "#FFD08A", .6 * q);
          ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.fillStyle = GOLD; starP(ctx, 0, 0, 150); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctext(ctx, Gl.label || "PENTING", 0, 16, 190, 40, BROWN); ctx.restore(); }
      },
      mid: () => {},
      front: (c, sts) => { // cart over the hero's legs
        const x = cx, y = GY; ctx.save(); ctx.translate(x, y);
        ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 280, 18, 0, 0, TAU); ctx.fill();
        rr(ctx, -40 * kk / 7.6 - 230, -330, 70, 250, 20); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.moveTo(-260, -60); ctx.lineTo(-250, -200); ctx.lineTo(150, -200); ctx.quadraticCurveTo(290, -190, 300, -60); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
        ctext(ctx, Cc.label, 10, -112, 380, 50, CREAM);
        const blink = Math.sin(t * 8) > 0; ctx.beginPath(); ctx.arc(250, -150, 22, 0, TAU); ctx.fillStyle = blink ? "#7FE07F" : "#3E7D4F"; ctx.fill(); ol(ctx, 4); font(ctx, 800, 22, FAM); ctx.fillStyle = "#fff"; ctx.fillText("AUTO", 200, -190);
        ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(150, -200); ctx.lineTo(120, -290); ctx.stroke(); ctx.save(); ctx.translate(120, -300); ctx.rotate(Math.sin(t * 2.4) * .6); ctx.beginPath(); ctx.ellipse(0, 0, 44, 16, 0, 0, TAU); ctx.lineWidth = 9; ctx.stroke(); ctx.restore();
        [-170, 190].forEach(dx => { ctx.save(); ctx.translate(dx, -55); ctx.rotate(cx / 55); ctx.beginPath(); ctx.arc(0, 0, 56, 0, TAU); ctx.fillStyle = "#2B1A12"; ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = "#B8AE9D"; ctx.fill(); ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(24, 0); ctx.stroke(); ctx.restore(); });
        if (d0 > 0) for (let i = 0; i < 4; i++){ const q = ((t * 2 + i / 4) % 1); ctx.save(); ctx.globalAlpha *= (1 - q) * .6; ctx.fillStyle = "#F3E2C8"; ctx.beginPath(); ctx.arc(-300 - q * 160, -40 - q * 30, 16 + q * 26, 0, TAU); ctx.fill(); ctx.restore(); }
        ctx.restore(); },
      screen: (c) => { BXS.forEach((b, k) => { const x = bxX[k], T0 = tIn + 0; const passT = (() => { // when cart+260 reached x
            const need = x - 260 - Cc.x0; if (need <= 0) return tIn; const dd = need <= Cc.v / 2 ? Math.sqrt(2 * need / Cc.v) : need / Cc.v + .5; return tIn + dd; })();
          if (t > passT){ const p = c.toScreen(x, GY - 330); over(() => pillTag(ctx, "OTOMATIS", clamp(p[0], 200, 880), Math.max(300, p[1]), popQ(t, passT, .35) * (1 - clamp((t - passT - 1.6) / .3, 0, 1)), { bg: GREEN, size: 34 })); over(() => sparkles(ctx, p[0], p[1] + 200, t - passT, 8, 140)); } });
        if (t > tSave && t < tSave + 1){ over(() => sparkles(ctx, 540, f.coins && f.coins.y || 215, t - tSave, 14, 360)); }
        energyPanel(ctx, s, f, t); }
    });
  }, (s, f, i, add) => { if (f.saveCue) add(cueT(s, f.saveCue, .5, i), "chime"); const Gl = f.goal || {}; if (Gl.cue) add(cueT(s, Gl.cue, .5, i), "chime"); add(.4, "whoosh"); });

  reg("ce_lemari", "Cerita: lemari baju seminggu", (ctx, th, s, t) => {
    const f = s.f || {}, Wd = Object.assign({ x: 770, w: 440, h: 840 }, f.wardrobe || {}), DY = (f.days || []).map((d, k) => Object.assign({ T: at(s, d.cue, .2 + k * .12) }, d)), tOpen = DY.length ? DY[0].T - .3 : 1, tPlate = f.plateCue ? at(s, f.plateCue, .3) : 1e9, tNotes = f.notesCue ? at(s, f.notesCue, .3) : 1e9, tMorn = f.morningCue ? at(s, f.morningCue, .2) : 1e9;
    const COLS = ["#5B7DB1", "#7FA563", "#E8A55B", "#2F6F73", "#C2691F"];
    let plateP = null;
    base(ctx, s, t, { env: "home",
      envDraw: (c, kind, eo) => { const m = clamp((t - tMorn) / .8, 0, 1); env(ctx, "home", t, c, Object.assign({}, eo, { time: "night" })); if (m > 0){ ctx.save(); ctx.globalAlpha = m; env(ctx, "home", t, c, Object.assign({}, eo, { time: "day" })); ctx.restore(); } },
      target: k => [Wd.x + (k.dx || 0), GY - Wd.h * .55 + (k.dy || 0), k.zoom || 1.2],
      back: () => {
        const x0 = Wd.x - Wd.w / 2, y0 = GY - 40 - Wd.h, open = eOut(clamp((t - tOpen) / .5, 0, 1));
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(Wd.x, GY - 30, Wd.w * .6, 20, 0, 0, TAU); ctx.fill();
        rr(ctx, x0 - 16, y0 - 26, Wd.w + 32, Wd.h + 40, 14); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6);
        rr(ctx, x0, y0, Wd.w, Wd.h - 10, 8); ctx.fillStyle = "#4A2D1B"; ctx.fill();
        ctx.strokeStyle = "#B8AE9D"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0 + 10, y0 + 70); ctx.lineTo(x0 + Wd.w - 10, y0 + 70); ctx.stroke();
        DY.forEach((d, k) => { if (t < d.T) return; const q = popQ(t, d.T, .4), hx = x0 + 52 + k * ((Wd.w - 104) / 4), sw = Math.sin(t * 2.2 + k) * .06 * (1 + 2 * Math.max(0, 1 - (t - d.T)));
          ctx.save(); ctx.translate(hx, y0 + 70); ctx.rotate(sw); ctx.scale(q, q); ctx.strokeStyle = "#B8AE9D"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.moveTo(-36, 34); ctx.lineTo(0, 16); ctx.lineTo(36, 34); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-40, 32); ctx.lineTo(-48, 70); ctx.lineTo(-36, 72); ctx.lineTo(-34, 220); ctx.lineTo(34, 220); ctx.lineTo(36, 72); ctx.lineTo(48, 70); ctx.lineTo(40, 32); ctx.lineTo(10, 28); ctx.lineTo(0, 44); ctx.lineTo(-10, 28); ctx.closePath(); ctx.fillStyle = COLS[k % 5]; ctx.fill(); ol(ctx, 4);
          rr(ctx, -34, 236, 68, 44, 8); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 3); ctext(ctx, d.label || "", 0, 268, 60, 26, BROWN); ctx.restore(); });
        // doors swinging open
        [-1, 1].forEach(dd => { const w = Wd.w / 2 * (1 - open * .82); const x = dd < 0 ? x0 : x0 + Wd.w - w; rr(ctx, x, y0, w, Wd.h - 10, 8); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5); if (open < .5){ ctx.beginPath(); ctx.arc(dd < 0 ? x + w - 24 : x + 24, y0 + Wd.h / 2, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); } });
        // three priority notes on the wall
        for (let i = 0; i < 3; i++){ const T = tNotes + i * .25; if (t < T) continue; const q = popQ(t, T, .35), nx = 150 + i * 130, ny = 560 + (i % 2) * 30; ctx.save(); ctx.translate(nx, ny); ctx.rotate((i - 1) * .08 + Math.sin(t * 2 + i) * .02); ctx.scale(q, q);
          ctx.fillStyle = ["#F6D36B", "#F4A85C", "#9CC58A"][i]; ctx.fillRect(-52, -52, 104, 104); ol(ctx, 0); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-52, -52, 104, 104); ctext(ctx, String(i + 1), 0, 22, 80, 64, BROWN); ctx.restore(); }
      },
      front: (c, sts) => { const h = sts[0]; if (!h || t < tPlate || t > tNotes) { if (t > tNotes) plateP = null; return; } const [hx, hy] = hand(h, 24, -48), q = popQ(t, tPlate, .4); plateP = [hx + 40, hy - 30];
        ctx.save(); ctx.translate(hx + 40, hy - 26); ctx.scale(q, q); ctx.beginPath(); ctx.ellipse(0, 0, 110, 32, 0, 0, TAU); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(-26, -14, 46, 24, 0, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#FFF4D0"; ctx.beginPath(); ctx.ellipse(40, -12, 34, 20, 0, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(40, -14, 11, 0, TAU); ctx.fill();
        for (let i = 0; i < 3; i++){ const qq = ((t * .6 + i / 3) % 1); ctx.globalAlpha = .6 * Math.sin(qq * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30 + i * 24, -40 - qq * 70); ctx.quadraticCurveTo(-40 + i * 24, -60 - qq * 70, -26 + i * 24, -84 - qq * 70); ctx.stroke(); } ctx.restore(); },
      screen: c => { if (plateP && t > tPlate + .3 && f.plateTag){ const p = c.toScreen(plateP[0], plateP[1] - 110); over(() => pillTag(ctx, f.plateTag, clamp(p[0], 200, 880), Math.max(260, p[1]), popQ(t, tPlate + .3, .35), { bg: "#2F6F73", size: 34 })); }
        if (t > tMorn && t < tMorn + 1.2) over(() => { ctx.save(); ctx.globalAlpha *= Math.sin(clamp((t - tMorn) / 1.2, 0, 1) * Math.PI) * .45; ctx.fillStyle = "#FFF1C9"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
        energyPanel(ctx, s, f, t); }
    });
  }, (s, f, i, add) => { (f.days || []).forEach((d, k) => add(cueT(s, d.cue, .2 + k * .12, i), "pop")); if (f.plateCue) add(cueT(s, f.plateCue, .3, i), "pop"); if (f.notesCue){ const T = cueT(s, f.notesCue, .3, i); [0, 1, 2].forEach(k => add(T + k * .25, "pop")); } if (f.morningCue){ const T = cueT(s, f.morningCue, .2, i); add(T, "whoosh"); add(T + .4, "chime"); } });

  reg("ce_kunci", "Cerita: kotak jadi mainan otomatis", (ctx, th, s, t) => {
    const f = s.f || {}, Bx = f.box || {}, tDrop = Bx.dropCue ? at(s, Bx.dropCue, .2) : .6, tWind = Bx.windCue ? at(s, Bx.windCue, .3) : 1e9, tWalk = Bx.walkCue ? at(s, Bx.walkCue, .5) : 1e9;
    let bp = [700, 1200];
    base(ctx, s, t, { env: "park", envOpt: { benchX: 900 },
      target: k => [bp[0] + (k.dx || 0), bp[1] + (k.dy || 0), k.zoom || 1.3],
      front: (c, sts) => { const h = sts[0]; if (!h) return; const [hx, hy] = hand(h, 24, -48);
        let x, y, rot = 0, sq = 0, legs = false, walkPh = 0;
        const handP = [hx + 60, hy - 90];
        if (t < tDrop){ x = handP[0]; y = lerp(-400, handP[1], clamp((t - tDrop + .5) / .5, 0, 1) ** 2); if (t < tDrop - .5) return; }
        else if (t < tWalk){ x = handP[0]; y = handP[1]; const d = t - tDrop; if (d < .25) sq = .18 * Math.sin(d / .25 * Math.PI); }
        else { const d = t - tWalk, gx = h.x + 330; if (d < .5){ const q = d / .5; x = lerp(handP[0], gx, q); y = lerp(handP[1], GY - 150, q) - Math.sin(q * Math.PI) * 120; }
          else { legs = true; walkPh = d; x = gx + Math.sin((d - .5) * .9) * 160; y = GY - 150 - Math.abs(Math.sin(d * 9)) * 14; rot = Math.sin(d * 9) * .08; } }
        bp = [x, y];
        const done = t > tWalk + .2;
        if (legs){ ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; [-1, 1].forEach((dd, k) => { const sw = Math.sin(walkPh * 9 + k * Math.PI) * 26; ctx.beginPath(); ctx.moveTo(x + dd * 40, y + 60); ctx.lineTo(x + dd * 40 + sw, GY - 10); ctx.stroke(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(x + dd * 40 + sw + 10, GY - 8, 20, 10, 0, 0, TAU); ctx.fill(); }); }
        // wind-up key on the side
        if (t > tWind){ const kq = popQ(t, tWind, .3), spin = t < tWalk ? (t - tWind) * 7 : (t - tWind) * 3; ctx.save(); ctx.translate(x - 95, y); ctx.scale(kq, kq); ctx.fillStyle = "#B8AE9D"; ctx.fillRect(-50, -8, 50, 16); ctx.strokeRect(-50, -8, 50, 16);
          ctx.translate(-50, 0); ctx.scale(Math.max(.15, Math.abs(Math.cos(spin))), 1); ctx.fillStyle = "#D8DDE2"; [-1, 1].forEach(dd => { ctx.beginPath(); ctx.ellipse(0, dd * 40, 22, 40, 0, 0, TAU); ctx.fill(); ol(ctx, 5); }); ctx.restore(); }
        qbox(ctx, x, y, .85, done ? (Bx.doneLabel || "RUTIN") : Bx.label, rot, { sx: 1 + sq, sy: 1 - sq, col: done ? GREEN : GOLD, mark: done ? "✓" : "?" });
      },
      screen: c => { if (t > tWalk + .2 && t < tWalk + 1.2){ const p = c.toScreen(bp[0], bp[1]); over(() => sparkles(ctx, p[0], p[1], t - tWalk - .2, 12, 200)); } if (t > tWind && t < tWalk){ const p = c.toScreen(bp[0] - 150, bp[1]); over(() => { font(ctx, 800, 40, FAM); ctx.fillStyle = "#FFFDF8"; ctx.strokeStyle = OUT; ctx.lineWidth = 8; const w = "krek krek"; const kx = clamp(p[0] + 200, 120, 800); ctx.strokeText(w, kx, p[1] - 150 + Math.sin(t * 20) * 4); ctx.fillText(w, kx, p[1] - 150 + Math.sin(t * 20) * 4); }); }
        energyPanel(ctx, s, f, t); }
    });
  }, (s, f, i, add) => { const Bx = f.box || {}; if (Bx.dropCue){ const T = cueT(s, Bx.dropCue, .2, i); add(T - .4, "whoosh"); add(T, "pop"); } if (Bx.windCue){ const T = cueT(s, Bx.windCue, .3, i); [0, .3, .6, .9].forEach(d => add(T + d, "pop")); } if (Bx.walkCue){ const T = cueT(s, Bx.walkCue, .5, i); add(T + .2, "chime"); } });
  /* =================================================================== RN25 */
  function truck(ctx, x, y, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y + (o.shake || 0)); ctx.scale(o.s || 1, o.s || 1);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 6, 420, 22, 0, 0, TAU); ctx.fill();
    rr(ctx, -400, -470, 560, 380, 16); ctx.fillStyle = "#FFF4E6"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = ORANGE; ctx.fillRect(-400, -200, 560, 40); ctx.strokeRect(-400, -200, 560, 40);
    ctext(ctx, o.label || "PENGIRIMAN", -120, -300, 480, 62, ORANGE);
    ctx.beginPath(); ctx.moveTo(170, -90); ctx.lineTo(170, -360); ctx.lineTo(300, -360); ctx.quadraticCurveTo(380, -330, 400, -220); ctx.lineTo(410, -90); ctx.closePath(); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 7);
    ctx.beginPath(); ctx.moveTo(200, -230); ctx.lineTo(200, -330); ctx.lineTo(290, -330); ctx.quadraticCurveTo(350, -300, 370, -230); ctx.closePath(); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -420, -100, 850, 40, 10); ctx.fillStyle = "#5A4A42"; ctx.fill(); ol(ctx, 5);
    [-270, -110, 300].forEach(dx => { ctx.save(); ctx.translate(dx, -50); ctx.rotate(o.roll || 0); ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fillStyle = "#2B1A12"; ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = "#B8AE9D"; ctx.fill(); ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(24, 0); ctx.stroke(); ctx.restore(); });
    ctx.fillStyle = "#FFE3A8"; ctx.beginPath(); ctx.ellipse(408, -150, 10, 18, 0, 0, TAU); ctx.fill();
    ctx.restore(); }
  reg("ce_truk", "Cerita: truk pengiriman mogok", (ctx, th, s, t) => {
    const f = s.f || {}, Tk = Object.assign({ x: 640 }, f.truck || {}), tStop = Tk.stopCue ? at(s, Tk.stopCue, .4) : 2, tPkg = f.pkgCue ? at(s, f.pkgCue, .4) : 1e9, FC = (f.faces || []).map((fc, k) => Object.assign({ T: at(s, fc.cue, .3 + k * .15) }, fc));
    const dIn = 1.6, q = clamp((t - (tStop - dIn)) / dIn, 0, 1), tx = lerp(-1100, Tk.x, eOut(q)), stopped = t > tStop, shake = stopped ? Math.sin(t * 40) * 4 * Math.max(.3, 1 - (t - tStop) / 2) : (q > 0 && q < 1 ? Math.sin(t * 30) * 2 : 0);
    let pkgP = null;
    base(ctx, s, t, { env: "street",
      target: k => [Tk.x + (k.dx || 0), (k.y ?? 1250), k.zoom || 1.1],
      back: () => { truck(ctx, tx, GY - 10, t, { shake, roll: tx / 58, label: Tk.label, s: Tk.s || 1.25 });
        if (stopped){ for (let i = 0; i < 7; i++){ const qq = ((t - tStop) * .7 + i / 7) % 1; ctx.save(); ctx.globalAlpha *= (1 - qq) * .85; ctx.fillStyle = i % 2 ? "#5A5450" : "#7A7470"; ctx.beginPath(); ctx.arc(tx + 470 + Math.sin(i * 2 + t) * 30 + qq * 60, GY - 470 - qq * 420, 40 + qq * 70, 0, TAU); ctx.fill(); ctx.restore(); } } },
      front: (c, sts) => { const h = sts[0]; if (!h || t < tPkg - .6) return; const [hx, hy] = hand(h, 22, -48), d = t - tPkg + .6, qq = clamp(d / .6, 0, 1);
        const sx = tx - 470, sy = GY - 380, ex = hx + 50, ey = hy - 30, x = lerp(sx, ex, eOut(qq)), y = lerp(sy, ey, eOut(qq)) - Math.sin(qq * Math.PI) * 260; pkgP = [x, y];
        pkg(ctx, x, y, .95, f.pkgLines || ["TERLAMBAT", "2 HARI"], { rot: (1 - qq) * 4 }); },
      screen: c => {
        if (stopped && t < tStop + .5){ const p = c.toScreen(tx + 470, GY - 470); over(() => impact(ctx, p[0], p[1], t - tStop, 160, "#FFE3A8")); }
        FC.forEach((fc, k) => { if (t < fc.T) return; const qq = popQ(t, fc.T, .45), cx = 200 + k * 340, cy = 360 + Math.sin(t * 2 + k) * 6;
          over(() => { ctx.save(); ctx.translate(cx, cy); ctx.scale(qq, qq); ctx.beginPath(); ctx.arc(0, 0, 118, 0, TAU); ctx.fillStyle = ["#F4DEC1", "#D7E8D0", "#D6E1F0"][k % 3]; ctx.fill(); ctx.save(); ctx.clip();
            const a = Object.assign({ size: 540, x: 0, y: 0, face: k === 2 ? -1 : 1, seed: k + 1 }, fc.actor || {}), st = toonState(a, s, t); st.size = 540; st.x = 0; st.y = 0; const hp = toonHead(st); ctx.translate(-hp[0], -hp[1] + 30); drawToon(ctx, a, st, t); ctx.restore();
            ctx.beginPath(); ctx.arc(0, 0, 118, 0, TAU); ol(ctx, 8); ctx.restore(); pillTag(ctx, fc.label, cx, cy + 150, qq, { size: 32, bg: [ORANGE, "#4E8A4E", "#2F6F73"][k % 3] }); }); });
      }
    });
  }, (s, f, i, add) => { const Tk = f.truck || {}; const T = Tk.stopCue ? cueT(s, Tk.stopCue, .4, i) : 2; add(T - 1.2, "whoosh"); add(T, "pop"); add(T + .1, "ping"); if (f.pkgCue) add(cueT(s, f.pkgCue, .4, i), "whoosh"); (f.faces || []).forEach((fc, k) => add(cueT(s, fc.cue, .3 + k * .15, i), "pop")); });

  /* ---------- ce_gaya: quick-change spin, same package ---------- */
  function warehouse(ctx, x0, x1, t){ // shelves with boxes (world)
    ctx.fillStyle = "#CDB79A"; ctx.fillRect(x0, 280, x1 - x0, GY - 470); ctx.fillStyle = "rgba(59,36,24,.12)"; for (let x = x0; x < x1; x += 90) ctx.fillRect(x, 280, 6, GY - 470);
    for (let sx = x0 + 60; sx < x1 - 300; sx += 420){ [0, 1, 2].forEach(r => { const y = 640 + r * 260; ctx.fillStyle = "#6A4A32"; ctx.fillRect(sx, y, 360, 18); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(sx, y, 360, 18);
      for (let b = 0; b < 3; b++){ const bw = 90 + ((sx + r * 7 + b * 13) % 30), bh = 80 + ((sx + b * 5 + r) % 50); ctx.fillStyle = b % 2 ? "#D9A066" : "#C48A52"; ctx.fillRect(sx + 20 + b * 112, y - bh, bw, bh); ctx.strokeRect(sx + 20 + b * 112, y - bh, bw, bh); } });
      ctx.fillStyle = "#6A4A32"; ctx.fillRect(sx, 520, 16, GY - 560); ctx.fillRect(sx + 344, 520, 16, GY - 560); } }
  reg("ce_gaya", "Cerita: ganti gaya, isi sama", (ctx, th, s, t) => {
    const f = s.f || {}, LK = (f.looks || []).map((l, k) => Object.assign({ T: l.cue ? at(s, l.cue, .1) : (l.at ?? -1) }, l)), Cp = f.coupon || {}, tCp = Cp.cue ? at(s, Cp.cue, .4) : 1e9, CH = (f.chips || []).map((ch, k) => Object.assign({ T: at(s, ch.cue, .2) }, ch));
    let cur = 0; LK.forEach((l, k) => { if (t >= l.T + .3) cur = k; }); const spin = LK.find(l => l.T > 0 && t >= l.T && t < l.T + .6);
    let mira = null;
    base(ctx, s, t, { env: "office", envOpt: Object.assign({ desk: f.rooms ? false : undefined }, f.envOpt || {}),
      mod: toons => { if (toons[0] && LK.length) toons[0] = Object.assign({}, toons[0], LK[cur].look || {}); },
      target: k => [k.x ?? 540, k.y ?? 1000, k.zoom || 1],
      back: () => { if (f.rooms){ const R2 = f.rooms; warehouse(ctx, R2.whX0 ?? -1400, R2.wallX ?? 420, t);
          const wx = R2.wallX ?? 420; ctx.fillStyle = "#EBD5BB"; ctx.fillRect(wx - 40, -200, 80, GY - 140); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(wx - 40, -200, 80, GY - 140);
          pillTag(ctx, R2.leftLabel || "GUDANG", wx - 420, 560, 1, { bg: "#7A5236", size: 44 }); pillTag(ctx, R2.rightLabel || "RUANG ATASAN", wx + 720, 560, 1, { bg: "#2F6F73", size: 44 });
          if (R2.deskX != null) prop(ctx, "desk", R2.deskX, GY - 40, { laptop: true, mug: true, papers: true }, t); } },
      drawToon: (j, a, st, c) => { if (j !== 0) return false; mira = st; if (!spin) return false; const q = (t - spin.T) / .6, sx = Math.max(.06, Math.abs(Math.cos(q * Math.PI * 3)));
        const a2 = q < .5 && LK[LK.indexOf(spin) - 1] ? Object.assign({}, a, LK[LK.indexOf(spin) - 1].look || {}) : a;
        ctx.save(); c.apply(ctx); ctx.translate(st.x, st.y - Math.sin(q * Math.PI) * 60); ctx.scale(sx, 1); ctx.translate(-st.x, -st.y); drawToon(ctx, a2, st, t); ctx.restore(); return true; },
      front: (c, sts) => { const h = sts[0]; if (!h) return; const [hx, hy] = hand(h, 22, -47); const sq = spin ? Math.max(.06, Math.abs(Math.cos((t - spin.T) / .6 * Math.PI * 3))) : 1;
        pkg(ctx, h.x + (hx - h.x) * sq + 40 * (h.face || 1) * sq, hy - 20 - (spin ? Math.sin((t - spin.T) / .6 * Math.PI) * 60 : 0), .8, f.pkgLines || ["TERLAMBAT", "2 HARI"], { sx: sq });
        if (t > tCp){ const q = popQ(t, tCp, .45), x = Cp.x ?? 650, y = (Cp.y ?? 820) + Math.sin(t * 2) * 10; ctx.save(); ctx.translate(x, y); ctx.rotate(-.08 + Math.sin(t * 1.5) * .04); ctx.scale(q, q);
          rr(ctx, -170, -60, 340, 120, 14); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ctx.setLineDash([12, 8]); ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.stroke(); ctx.setLineDash([]); ol(ctx, 0);
          ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -170, -60, 340, 120, 14); ctx.stroke(); ctext(ctx, Cp.text || "ONGKIR GRATIS", 0, 16, 300, 44, ORANGE); ctx.restore(); } },
      screen: c => {
        if (mira && LK.length){ const l = LK[cur]; if (l.tag && t > l.T + .3){ const hp = toonHead(mira), r = 20.5 * mira.size / 92, p = c.toScreen(hp[0], hp[1] - r * 1.25); over(() => pillTag(ctx, l.tag, clamp(p[0], 200, 880), Math.max(260, p[1] - 20), popQ(t, l.T + .3, .4) * (l.out && t > at(s, l.out, .9) ? 0 : 1), { bg: l.col || "#2F6F73", size: 36 })); } }
        if (spin){ const p = c.toScreen(mira ? mira.x : 540, mira ? mira.y - mira.size * .5 : 1100); over(() => { sparkles(ctx, p[0], p[1], t - spin.T, 12, 260); const q = (t - spin.T) / .6; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.strokeStyle = CREAM; ctx.lineWidth = 8; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.ellipse(p[0], p[1] - 100 + i * 140, 200 + q * 60, 40, 0, q * 6 + i, q * 6 + i + 2.5); ctx.stroke(); } ctx.restore(); }); }
        CH.forEach((ch, k) => { if (t < ch.T) return; over(() => pillTag(ctx, ch.text, 200 + k * 340, 300 + (k % 2) * 34, popQ(t, ch.T, .4), { bg: [RED, ORANGE, GREEN][k % 3], size: 38, maxW: 280, rot: k % 2 ? 3 : -3 })); });
        if (t > tCp && t < tCp + .9){ const p = c.toScreen(Cp.x ?? 650, Cp.y ?? 820); over(() => sparkles(ctx, p[0], p[1], t - tCp, 10, 220)); }
      }
    });
  }, (s, f, i, add) => { (f.looks || []).forEach((l, k) => { if (l.cue){ const T = cueT(s, l.cue, .1, i); add(T, "whoosh"); add(T + .35, "chime"); } }); if (f.coupon && f.coupon.cue) add(cueT(s, f.coupon.cue, .4, i), "chime"); (f.chips || []).forEach(ch => add(cueT(s, ch.cue, .2, i), "pop")); });

  /* ---------- ce_trio: three styles, the same package ---------- */
  reg("ce_trio", "Cerita: tiga gaya, satu isi", (ctx, th, s, t) => {
    const f = s.f || {}, tL = f.linkCue ? at(s, f.linkCue, .3) : 1e9, tC = f.coverCue ? at(s, f.coverCue, .3) : 1e9, tI = f.inflateCue ? at(s, f.inflateCue, .3) : 1e9, tS = f.stampCue ? at(s, f.stampCue, .4) : 1e9;
    let P = [];
    base(ctx, s, t, { env: "info",
      target: k => [P[k.box || 1] ? P[k.box || 1][0] : 540, P[k.box || 1] ? P[k.box || 1][1] - 40 : 1000, k.zoom || 1.4],
      front: (c, sts) => { P = sts.map(st => { const [hx, hy] = hand(st, 22, -47); return [st.x + (hx - st.x) * .6 + 30 * (st.face || 1), hy - 10]; });
        if (t > tL && P.length > 1){ const q = eOut(clamp((t - tL) / .6, 0, 1)); ctx.save(); ctx.strokeStyle = hexA("#FFD08A", .85); ctx.lineWidth = 12; ctx.setLineDash([26, 18]); ctx.lineDashOffset = -t * 80; ctx.beginPath();
          ctx.moveTo(P[0][0], P[0][1] - 140); for (let k = 1; k < P.length; k++){ const x = lerp(P[k - 1][0], P[k][0], k === P.length - 1 ? q : 1); ctx.quadraticCurveTo((P[k - 1][0] + x) / 2, P[0][1] - 280, x, P[k][1] - 140); } ctx.stroke(); ctx.restore(); }
        P.forEach((p, k) => { let s2 = .72, sq = 0; if (k === 2 && t > tI){ const d = t - tI; s2 *= d < 1 ? 1 + .9 * eOut(clamp(d / .5, 0, 1)) + .06 * Math.sin(d * 30) : 1 + .9 * Math.max(0, 1 - (d - 1) / .15); }
          if (t > tL && t < tL + 1.2) sq = .06 * Math.sin((t - tL) * 12 + k);
          pkg(ctx, p[0], p[1] - (s2 - .72) * 120, s2, f.pkgLines || ["TERLAMBAT", "2 HARI"], { sx: 1 + sq, sy: 1 - sq });
          if (k === 2 && t > tI + 1 && t < tI + 1.6){ dust(ctx, p[0], p[1] - 60, t - tI - 1, 8, 180); } });
        // cover gag on the middle package: a cloth drops, then gets yanked away
        if (P[1] && t > tC - .3){ const d = t - tC; let y, a = 1, rot = 0; if (d < 0) y = lerp(P[1][1] - 600, P[1][1] - 110, (d + .3) / .3); else if (d < .8) y = P[1][1] - 110; else { const q = (d - .8) / .5; y = P[1][1] - 110 - q * 700; rot = q * 2; a = 1 - q; }
          if (a > 0){ ctx.save(); ctx.globalAlpha *= a; ctx.translate(P[1][0], y); ctx.rotate(rot); ctx.beginPath(); ctx.moveTo(-150, -20); ctx.quadraticCurveTo(0, -70, 150, -20); ctx.lineTo(170, 170); ctx.quadraticCurveTo(80, 150, 40, 180); ctx.quadraticCurveTo(-40, 150, -100, 180); ctx.lineTo(-170, 170); ctx.closePath(); ctx.fillStyle = "#4A3A48"; ctx.fill(); ol(ctx, 6); ctx.restore(); } }
      },
      screen: c => {
        [[tC + .2, 1], [tI + .3, 2]].forEach(([T, k]) => { if (!P[k] || t < T || t > T + 1.6) return; const p = c.toScreen(P[k][0], P[k][1] - 260); over(() => { const q = popQ(t, T, .3); ctx.save(); ctx.translate(p[0], Math.max(320, p[1])); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#fff"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-22, -22); ctx.lineTo(22, 22); ctx.moveTo(22, -22); ctx.lineTo(-22, 22); ctx.stroke(); ctx.restore(); }); });
        if (t > tS){ const q = t - tS; over(() => { const sc = q < .25 ? 2.4 - 1.4 * eOut(q / .25) : 1 + .02 * Math.sin(q * 4); ctx.save(); ctx.translate(540, f.stampY ?? 330); ctx.rotate(-.08); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 5, 0, 1) * (t > (f.stampOut ? at(s, f.stampOut, .5) : 1e9) ? 0 : 1);
          rr(ctx, -250, -78, 500, 156, 22); ctx.fillStyle = "rgba(255,253,248,.95)"; ctx.fill(); ctx.strokeStyle = GREEN; ctx.lineWidth = 12; ctx.stroke(); font(ctx, 800, 96, FAM); ctx.fillStyle = GREEN; ctx.textAlign = "center"; ctx.fillText(f.stampText || "JUJUR ✓", 0, 34); ctx.textAlign = "left"; ctx.restore(); }); }
      }
    });
  }, (s, f, i, add) => { if (f.linkCue) add(cueT(s, f.linkCue, .3, i), "chime"); if (f.coverCue){ const T = cueT(s, f.coverCue, .3, i); add(T - .3, "whoosh"); add(T + .8, "whoosh"); add(T + .2, "ping"); } if (f.inflateCue){ const T = cueT(s, f.inflateCue, .3, i); add(T, "whoosh"); add(T + 1, "pop"); add(T + .3, "ping"); } if (f.stampCue) add(cueT(s, f.stampCue, .4, i) + .1, "pop"); });

  /* ---------- ce_batu: stepping stones across a pond ---------- */
  reg("ce_batu", "Cerita: batu loncatan pertanyaan", (ctx, th, s, t) => {
    const f = s.f || {}, ST = (f.stones || []).map((st, k) => Object.assign({ T: at(s, st.cue, .3 + k * .2) }, st)), Fl = f.flag || {}, tF = Fl.cue ? at(s, Fl.cue, .6) : 1e9, pond = Object.assign({ x: 560, rx: 380, ry: 80 }, f.pond || {});
    base(ctx, s, t, { env: "park", envOpt: { bench: false, treeX: -500, bushes: false },
      target: k => [k.x ?? 540, k.y ?? 1100, k.zoom || 1],
      back: () => { const { x, rx, ry } = pond, y = GY - 10;
        ctx.beginPath(); ctx.ellipse(x, y, rx + 30, ry + 16, 0, 0, TAU); ctx.fillStyle = "#B49A62"; ctx.fill();
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fillStyle = "#4E9DB1"; ctx.fill(); ol(ctx, 5);
        ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.clip(); ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 4; for (let i = 0; i < 8; i++){ const xx = x - rx + ((t * 30 + i * 110) % (rx * 2)), yy = y - ry + 20 + (i % 4) * 36; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.quadraticCurveTo(xx + 20, yy - 6, xx + 40, yy); ctx.stroke(); } ctx.restore();
        [[x - rx + 70, y + 20], [x + rx - 90, y - 30]].forEach(([lx, ly], i) => { ctx.fillStyle = "#6E9A58"; ctx.beginPath(); ctx.ellipse(lx, ly, 40, 14, 0, .3, TAU - .3); ctx.lineTo(lx, ly); ctx.closePath(); ctx.fill(); });
        ST.forEach((st, k) => { const sx = st.x, landT = st.T + .68, d = t - landT, dip = d > 0 && d < .6 ? Math.sin(d / .6 * Math.PI) * 10 : 0, sy = y + Math.sin(t * 2 + k) * 4 + dip;
          if (d > 0 && d < 1.2){ for (let r = 0; r < 2; r++){ const q = clamp((d - r * .2) / 1, 0, 1); ctx.strokeStyle = hexA("#FFFFFF", .7 * (1 - q)); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(sx, sy + 6, 100 + q * 120, 22 + q * 26, 0, 0, TAU); ctx.stroke(); } }
          ctx.beginPath(); ctx.ellipse(sx, sy, 100, 30, 0, 0, TAU); ctx.fillStyle = "#9A8F84"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.beginPath(); ctx.ellipse(sx - 20, sy - 8, 50, 10, 0, 0, TAU); ctx.fill();
          // sign on a stick
          const sq = popQ(t, st.T - .4, .4); if (sq > 0){ const by = GY - 430; ctx.save(); ctx.translate(sx + (k ? 70 : -70), GY - 20); ctx.rotate(Math.sin(t * 1.8 + k) * .03); ctx.scale(sq, sq); ctx.fillStyle = "#7A5236"; ctx.fillRect(-8, -410, 16, 410); ctx.strokeRect(-8, -410, 16, 410);
            rr(ctx, -130, -500, 260, 110, 14); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); ctext(ctx, st.label, 0, -430, 230, 50, BROWN);
            if (d > .1){ const cq = popQ(t, landT + .1, .35); ctx.save(); ctx.translate(110, -500); ctx.scale(cq, cq); ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#fff"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-3, 12); ctx.lineTo(16, -12); ctx.stroke(); ctx.restore(); }
            ctx.restore(); } });
        // flag on the far bank
        if (Fl.x != null){ const q = popQ(t, Fl.at ?? .2, .4), x2 = Fl.x, wv = Math.sin(t * 4) * 10, up = t > tF ? eOut(clamp((t - tF) / .6, 0, 1)) : 0; ctx.save(); ctx.translate(x2, GY - 20); ctx.scale(q, q); ctx.fillStyle = OUT; ctx.fillRect(-7, -620, 14, 620);
          const fy = -600 + (1 - up) * 300; ctx.beginPath(); ctx.moveTo(7, fy); ctx.quadraticCurveTo(110, fy - 14 + wv, 220, fy + 10); ctx.lineTo(220, fy + 120); ctx.quadraticCurveTo(110, fy + 100 - wv, 7, fy + 120); ctx.closePath(); ctx.fillStyle = up > 0 ? GREEN : ORANGE; ctx.fill(); ol(ctx, 5);
          ctext(ctx, up > .5 ? (Fl.done || "KIRIM ✓") : (Fl.label || "KIRIM"), 114, fy + 76, 190, 44, "#FFFFFF"); ctx.restore(); } },
      screen: c => { ST.forEach(st => { const d = t - st.T - .68; if (d > 0 && d < .9){ const p = c.toScreen(st.x, GY - 10); over(() => { for (let i = 0; i < 8; i++){ const a = -Math.PI * (i + .5) / 8, q = d / .9; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.fillStyle = "#BFE6F0"; ctx.beginPath(); ctx.arc(p[0] + Math.cos(a) * (60 + q * 120), p[1] + Math.sin(a) * (40 + q * 160) + q * q * 200, 10, 0, TAU); ctx.fill(); ctx.restore(); } }); } });
        if (t > tF && t < tF + .9 && Fl.x != null){ const p = c.toScreen(Fl.x + 110, GY - 560); over(() => sparkles(ctx, p[0], p[1], t - tF, 12, 220)); } }
    });
  }, (s, f, i, add) => { (f.stones || []).forEach((st, k) => { const T = cueT(s, st.cue, .3 + k * .2, i); add(T - .4, "pop"); add(T + .7, "pop"); add(T + .8, "chime"); }); const Fl = f.flag || {}; if (Fl.cue) add(cueT(s, Fl.cue, .6, i), "chime"); });
})();
