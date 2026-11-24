/* Scene pack j2611221104031: MODE CERITA story scenes for JS32, SC32, MS32, SB33, SP33. Layout prefix j2611221104031_.
   Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front)
   plus pack extras handled by base(): toon a.sizeKeys [{at|cue, size, dur}] (toon grows / shrinks), f.held [{on, kind: medal|phone|note, at|cue, outCue}],
   f.confetti {at|cue}. Camera keys may use on:"<spot>" for named spots of a set piece. Set pieces (layout suffix):
     adegan     generic story shot with the extras above
     kode       jargon words leave a toon's mouth as dark code blocks that bonk and orbit the listener's head; "?" swirl     f.code {from, to, tiles:[{cue, text}], qCue, counter}
     asing      imagination: the city fades into outer space, the speaker turns into a green alien with antennae and glyph speech,
                the listener floats in an astronaut helmet; later a phone call counter                                      f.alien {on, who, spaceCue, glyphCues:[..], callCues:[..]}
     kamus      a living pocket dictionary hops in and opens: jargon blocks fly into the left page, plain words write out on the right  f.kamus {inCue, pairs:[{cue, from, to}], doneCue}
     izin       a giant floating permission dialog (KONTAK / GALERI, IZINKAN / TOLAK); broken scooter smoke; mode "tolak": a big
                pointer hand presses TOLAK, the dialog shatters, the app icon is deleted                                  f.izin {mode, inCue, rowCues:[..], pressCue, delCue}, f.motor {x, smokeCue}
     capit      claw machine full of the toon's contacts and photos: a floating IZINKAN button, the claw drops, grabs the data and lifts it
                out; the contacts fly off with ringing phones and TAGIH! tags                                             f.claw {btnCue, freezeCue, dropCue, spreadCue}
     camilan    a floating snack jar labelled CAMILAN: camera, microphone and location cookies hop in; contact book and photo bounce off with a red X   f.snack {jarCue, items:[{cue, kind, label}], bad:[{cue, kind, label}], wordCue}
     susut      cafe at night: friends laugh, HAHA letters hit the hero, she shrinks with every laugh (sizeKeys)                 f.haha [{from, cue}], f.table {x}
     trampolin  two friends hold a stretchy cloth; the hero bounces higher with every cheer toward a 5 KM banner           f.tramp {a, b, rider, bounces:[{cue, h}], goal:{text, y}}
     cincin     a glowing ring on the floor around the hero; gift orbs fly from friends into her and she grows              f.ring {on, cue, gifts:[{cue, from, text, icon}]}
     rimba      the messy desk as a jungle: vines, paper bushes, cable snakes, old coffee cups with flies; explorer search, file found   f.jungle {growCue, cableCue, paperCue, cupCue, fileCue, desk:{x}}
     reset      evening 5-minute reset: cup flies to the pantry sign, papers into the tray, cable coils, file into a folder, sticky note   f.reset {x, steps:{cup, paper, cable, file, note}, noteText, timerCue}
     pagi       next morning at the tidy desk: sun beams, sticky note zooms in, typing sparks, progress bar, clock chip                f.pagi {x, noteCue, workCue, noteText, clock}
     gawang     football field: mode "gaib" = invisible / moving goal, labelled balls miss, revision counter; mode "jelas" = chalk-drawn goal
                with criteria pennants, GOL! + net bulge                                                                f.goal {mode, x, kicks:[{cue, label}], revCues:[..], ghostCue, drawCue, golCue, flags:[..]}
     bayang     hologram projector on the desk: two different BERES tags over two heads, then a glowing outline of the expected result
                with three checkpoints                                                                                  f.holo {beda:{cueA, cueB}, onCue, items:[{cue, text, icon}]}
*/
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, easeIO, G, TAU, star } = TT;
  const PX = "j2611221104031_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", GOLD2 = "#D99A1E", TEAL = "#2F6F73", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) + (o.delay || 0) : 1e9));
  const rq = (t, T0, d) => clamp((t - T0) / (d || .4), 0, 1);
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const HAND = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47], scratch: [21, -76],
    cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  function fitFont(ctx, txt, maxW, size, weight, min){ for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 16)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) size = fitFont(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; return size; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function dust(ctx, x, y, k, n, col, spread){ if (k < 0 || k > .8) return; const q = eOut(k / .8); spread = spread || 160; ctx.save(); ctx.globalAlpha *= (1 - k / .8) * .8;
    for (let i = 0; i < (n || 8); i++){ const a = Math.PI + (i / ((n || 8) - 1)) * Math.PI, r = spread * q * (.6 + rnd(i + 3) * .5); ctx.fillStyle = col || "#E9D8C2"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * .45, 16 + 18 * (1 - q) * rnd(i), 0, TAU); ctx.fill(); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .94); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function chip(ctx, txt, x, y, k, o){ if (k < 0) return; o = o || {}; const q = eBack(clamp(k / .35, 0, 1)), size = o.size || 40; font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1 + (o.icon ? size * 1.1 : 0), h = size * 1.6;
    ctx.save(); ctx.translate(x, y + Math.sin((o.t ?? k) * 3 + x) * 3); ctx.scale(q, q); ctx.rotate(o.rot ?? -.03);
    rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = o.fill || CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    let tx = -w / 2 + size * .55; if (o.icon){ const r = size * .48; ctx.beginPath(); ctx.arc(tx + r, 0, r, 0, TAU); ctx.fillStyle = o.iconBg || ORANGE; ctx.fill(); icon(ctx, o.icon, tx + r - r * .6, -r * .6, r * 1.2, "#FFFFFF", 2.4); tx += size * 1.1; }
    ctx.fillStyle = o.ink || BROWN; ctx.fillText(txt, tx, size * .36); ctx.restore(); }
  function bigWord(ctx, words, x, y, size, k){ if (k < 0) return; const q = clamp(k / .25, 0, 1), s2 = 1.5 - .5 * eOut(q); ctx.save(); ctx.globalAlpha *= q; ctx.translate(x, y); ctx.scale(s2, s2); outlineWords(ctx, words, 0, 0, size, { sw: size * .22 }); ctx.restore(); }
  function confettiFx(ctx, k){ if (k < 0 || k > 3) return; ctx.save(); for (let i = 0; i < 46; i++){ const x = rnd(i + 5) * 1080, v = 380 + rnd(i + 9) * 420, y = -40 + k * v + 30 * Math.sin(k * 4 + i), a = k * (3 + rnd(i) * 5) + i;
    ctx.globalAlpha = clamp(3 - k, 0, 1); ctx.save(); ctx.translate(x + Math.sin(k * 2 + i) * 40, y); ctx.rotate(a); ctx.fillStyle = [ORANGE, GOLD, CREAM, HL, TEAL][i % 5]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); } ctx.restore(); }
  function ringWaves(ctx, x, y, t, k, col, r0){ for (let j = 0; j < 3; j++){ const q = ((t * 1.6 + j / 3) % 1); ctx.save(); ctx.globalAlpha *= (1 - q) * k; ctx.strokeStyle = col || HL; ctx.lineWidth = 8; ctx.lineCap = "round";
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(x, y, (r0 || 60) + q * 70, d > 0 ? -.6 : Math.PI - .6, d > 0 ? .6 : Math.PI + .6); ctx.stroke(); }); ctx.restore(); } }
  // small glyphs
  function camGlyph(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; rr(ctx, -30, -18, 60, 40, 8); ctx.fill(); rr(ctx, -12, -26, 24, 10, 3); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 2, 13, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.arc(0, 2, 7, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function micGlyph(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; rr(ctx, -11, -30, 22, 38, 11); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(0, -6, 19, .15, Math.PI - .15); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 13); ctx.lineTo(0, 24); ctx.moveTo(-11, 25); ctx.lineTo(11, 25); ctx.stroke(); ctx.restore(); }
  function photoGlyph(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; rr(ctx, -28, -22, 56, 44, 7); ctx.fill(); ctx.fillStyle = "#FFFFFF";
    ctx.beginPath(); ctx.moveTo(-20, 14); ctx.lineTo(-6, -4); ctx.lineTo(4, 8); ctx.lineTo(10, 2); ctx.lineTo(20, 14); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(11, -9, 5, 0, TAU); ctx.fill(); ctx.restore(); }
  function glyphOf(kind){ return { camera: camGlyph, mic: micGlyph, photo: photoGlyph }[kind]; }
  function iconAny(ctx, kind, x, y, size, col){ const g = glyphOf(kind); if (g) g(ctx, x, y, size / 64, col); else icon(ctx, kind, x - size * .45, y - size * .45, size * .9, col, 2.6); }
  function avatarBall(ctx, x, y, r, col, label, t, ringing){
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.arc(x + 5, y + 8, r, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y - r * .22, r * .3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + r * .48, r * .5, r * .32, 0, Math.PI, TAU); ctx.fill();
    if (label){ font(ctx, 800, Math.max(20, r * .42), FAM); const w = ctx.measureText(label).width + 22; rr(ctx, x - w / 2, y + r * .72, w, r * .62, 10); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
      textC(ctx, label, x, y + r * .72 + r * .47, Math.max(20, r * .42), BROWN, 800); }
    if (ringing) ringWaves(ctx, x, y, t, ringing, RED, r * 1.1);
  }

  /* ---------- shared base ---------- */
  function sizeAt(a, s, t){ let z = a.size || 760; const K = (a.sizeKeys || []).map(k => ({ T: (k.at != null ? +k.at : cueT(s, k.cue, .3, G.scene)) + (k.delay || 0), size: k.size, dur: k.dur || .5 })).sort((p, q) => p.T - q.T);
    let prev = z; for (const k of K){ if (t < k.T) break; z = prev + (k.size - prev) * eBack(clamp((t - k.T) / k.dur, 0, 1)); prev = k.size; } return z; }
  function heldDraw(ctx, s, t, st, j, f){
    (f.held || []).filter(h => (h.on ?? 0) === j).forEach(h => {
      const T0 = tOf(s, h, .3), T1 = h.outCue ? cueT(s, h.outCue, .8, G.scene) : (h.out ?? 1e9); if (t < T0 || t > T1 + .3) return;
      const q = popQ(t, T0, .35) * (1 - rq(t, T1, .3)), k = st.size / 92; if (q <= 0) return;
      if (h.kind === "medal"){ const a = lp(st, -7, -54), b = lp(st, 7, -54), m = lp(st, 0, -36 + Math.sin(t * 3) * .6);
        ctx.save(); ctx.globalAlpha *= clamp(q, 0, 1); ctx.lineWidth = 3.2 * k; ctx.strokeStyle = ORANGE; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(m[0], m[1] - 4 * k); ctx.lineTo(b[0], b[1]); ctx.stroke();
        ctx.translate(m[0], m[1]); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 7 * k, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = .9 * k; ctx.stroke();
        ctx.fillStyle = GOLD2; sparkle(ctx, 0, 0, 4.4 * k, GOLD2); ctx.globalAlpha *= .6 + .4 * Math.sin(t * 5); sparkle(ctx, 6 * k, -6 * k, 2.5 * k, "#FFFFFF"); ctx.restore(); return; }
      const hd = HAND[st.pose] || HAND.idle, p = lp(st, hd[0], hd[1]);
      ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(q, q);
      if (h.kind === "phone"){ ctx.rotate(-.15 * (st.face || 1)); rr(ctx, -4 * k, -13 * k, 8 * k, 14 * k, 1.5 * k); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = .7 * k; ctx.stroke();
        rr(ctx, -3.2 * k, -12 * k, 6.4 * k, 11.5 * k, 1 * k); ctx.fillStyle = "#FFE8C8"; ctx.fill(); }
      else if (h.kind === "note"){ ctx.rotate(.1); ctx.fillStyle = GOLD; ctx.fillRect(-7 * k, -16 * k, 14 * k, 14 * k); ctx.strokeStyle = OUT; ctx.lineWidth = .6 * k; ctx.strokeRect(-7 * k, -16 * k, 14 * k, 14 * k);
        ctx.fillStyle = BROWN; ctx.fillRect(-5 * k, -13 * k, 9 * k, 1.2 * k); ctx.fillRect(-5 * k, -10 * k, 7 * k, 1.2 * k); }
      ctx.restore(); });
  }
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const P = toons.map((a, j) => { const a2 = a.sizeKeys ? Object.assign({}, a, { size: sizeAt(a, s, t) }) : a; return (H.prep && H.prep(a2, j)) || { a: a2, t }; });
    const sts = P.map(p => toonState(p.a, s, p.t));
    if (H.adj) H.adj(sts);
    const spots = H.spots || {};
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !sts[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || H.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const R = {};
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => { if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R)); R[j] = toon(ctx, c, P[j].a, s, P[j].t, { st: sts[j] });
      layer(ctx, c, 1, () => { heldDraw(ctx, s, t, sts[j], j, f); if (H.over1) H.over1(ctx, c, sts, j, R); }); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.post){ ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    if (H.over) TT.CS.ov.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    if (f.confetti){ const T0 = tOf(s, f.confetti, .3); TT.CS.ov.push(() => confettiFx(ctx, t - T0)); }
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
    (f.held || []).forEach(h => { if (h.cue) add(cueT(s, h.cue, .3, i), "pop"); });
    if (f.confetti) add(tOf(s, f.confetti, .3, i), "chime");
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
  }
  const reg = (name, label, draw, sfx) => TT.scene(PX + name, label, draw, (s, f, i, add) => { sfxBase(s, f, i, add); if (sfx) sfx(s, f, i, add); });

  /* ================= adegan: generic shot with extras ================= */
  reg("adegan", "Cerita: adegan umum (+ medali, ponsel, konfeti)", (ctx, th, s, t) => { base(ctx, s, t, {}); });

  /* ================= kode: jargon blocks orbit the listener ================= */
  function codeTile(ctx, txt, x, y, sc, rot, t){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); font(ctx, 900, 50, FAM); const w = Math.max(110, ctx.measureText(txt).width + 54), h = 84;
    ctx.fillStyle = "rgba(20,14,10,.35)"; rr(ctx, -w / 2 + 6, -h / 2 + 9, w, h, 14); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = "#2C3440"; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.08)"; rr(ctx, -w / 2 + 8, -h / 2 + 8, w - 16, h * .38, 8); ctx.fill();
    textC(ctx, txt, 0, 17, 50, "#9FE3B0", 900); ctx.restore(); }
  reg("kode", "Cerita: istilah internal jadi balok kode", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.code || {}, from = o.from ?? 0, to = o.to ?? 1, tiles = o.tiles || [], tQ = T(s, o.qCue, .4, i), cn = o.counter || { x0: -60, x1: 600, y: 1330 };
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 990 },
      front: (ctx) => {   // service desk in front of the speaker with a laptop under repair
        const { x0, x1, y } = cn; ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(x0 + 12, y + 16, x1 - x0, GROUND - y);
        ctx.fillStyle = "#A9643B"; ctx.fillRect(x0, y + 30, x1 - x0, GROUND - y); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(x0, y + 30, x1 - x0, GROUND - y);
        ctx.fillStyle = "rgba(59,36,24,.25)"; for (let x = x0 + 60; x < x1 - 30; x += 110) ctx.fillRect(x, y + 60, 8, GROUND - y - 80);
        rr(ctx, x0 - 20, y, x1 - x0 + 40, 40, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ctx.stroke();
        const lx = x1 - 140; ctx.save(); ctx.translate(lx, y); ctx.fillStyle = "#544E42"; ctx.beginPath(); ctx.moveTo(-90, -130); ctx.lineTo(90, -130); ctx.lineTo(100, -6); ctx.lineTo(-100, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#BFE2EA"; ctx.fillRect(-76, -118, 152, 100); ctx.fillStyle = hexA(ORANGE, .85); rr(ctx, -50, -84, 100, 34, 8); ctx.fill(); textC(ctx, "SERVIS", 0, -58, 24, "#FFFFFF", 800);
        ctx.fillStyle = BROWN; rr(ctx, -112, -8, 224, 14, 6); ctx.fill(); ctx.restore(); },
      over: (ctx, c, sts, R) => {
        const A = R[from], B = R[to]; if (!A || !B) return;
        const m = A.screen.top, hb = c.toScreen(B.headX, B.top), sc = c.scale(1);
        const cx = hb[0], cy = hb[1] - 170 * Math.min(1.2, sc), n = Math.max(1, tiles.length);
        tiles.forEach((tl, j) => { const T0 = T(s, tl.cue, .25 + j * .1, i); if (t < T0) return; const q = clamp((t - T0) / .8, 0, 1), e = easeIO(q);
          const ang = (t - T0) * (t > tQ ? 2.6 : 1.3) + j / n * TAU, ox = cx + Math.cos(ang) * 230, oy = cy + Math.sin(ang) * 40 - (j % 2) * 100;
          const px = lerp(m[0], ox, e), py = lerp(m[1], oy, e) - Math.sin(e * Math.PI) * 260, s2 = (.35 + .65 * eBack(Math.min(1, q * 1.4))) * (.85 + .15 * Math.sin(ang));
          codeTile(ctx, tl.text, px, py, s2, Math.sin(t * 3 + j) * .12 + (q < 1 ? (1 - q) * 1.2 : 0), t);
          if (q >= 1) burstFx(ctx, ox, oy, t - T0 - .8, HL, 8, 90); });
        if (t > tQ){ const k = popQ(t, tQ, .4); for (let j = 0; j < 3; j++){ const a = t * 2.2 + j * TAU / 3, x = hb[0] + Math.cos(a) * 170, y = hb[1] - 40 + Math.sin(a) * 40;
          ctx.save(); ctx.translate(x, y); ctx.scale(k, k); outlineWords(ctx, [{ w: "?", hl: true }], 0, 0, 92, { sw: 18 }); ctx.restore(); } } } });
  }, (s, f, i, add) => { const o = f.code || {}; (o.tiles || []).forEach((tl, j) => { add(T(s, tl.cue, .25 + j * .1, i), "whoosh"); add(T(s, tl.cue, .25 + j * .1, i) + .8, "pop"); }); if (o.qCue) add(T(s, o.qCue, .4, i), "ping"); });

  /* ================= asing: alien world imagination ================= */
  reg("asing", "Cerita: bahasa planet lain", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.alien || {}, on = o.on ?? 0, who = o.who ?? 1, tS = T(s, o.spaceCue, .2, i), sq = rq(t, tS, .9);
    const calls = (o.callCues || []).map((c, j) => T(s, c, .3 + j * .1, i)), nCall = calls.filter(x => t >= x).length;
    base(ctx, s, t, { env: "night",
      prep: (a, j) => j === on && t > tS + .3 ? { a: Object.assign({}, a, { skin: "#8CC46A" }), t } : null,
      adj: (sts) => { [on, who].forEach((j, n) => { if (sts[j]) sts[j].y -= sq * (120 + Math.sin(t * 1.6 + n * 2) * 26); }); },
      back: (ctx) => { if (sq <= 0) return; ctx.save(); ctx.globalAlpha = sq * .96;
        const g = ctx.createLinearGradient(0, -400, 0, 2400); g.addColorStop(0, "#1B0F3A"); g.addColorStop(.6, "#3A1E5C"); g.addColorStop(1, "#130A26"); ctx.fillStyle = g; ctx.fillRect(-2000, -1000, 5080, 4000);
        for (let k = 0; k < 90; k++){ const x = rnd(k) * 1800 - 360, y = rnd(k + 50) * 1900 - 100, tw = .5 + .5 * Math.sin(t * (1 + rnd(k + 9) * 3) + k); ctx.fillStyle = hexA("#FFF4E6", .4 + tw * .6); ctx.beginPath(); ctx.arc(x, y, 2 + rnd(k + 3) * 4, 0, TAU); ctx.fill(); }
        const px = 860 + Math.sin(t * .3) * 20, py = 420; glowAt(ctx, px, py, 260, "#F08C2E", .35); ctx.beginPath(); ctx.arc(px, py, 120, 0, TAU); ctx.fillStyle = "#E08A3C"; ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.arc(px - 30, py - 30, 70, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#F6D36B"; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(px, py, 210, 46, -.3, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.arc(170, 300 + Math.sin(t) * 10, 55, 0, TAU); ctx.fillStyle = "#7FB2C9"; ctx.fill();
        const sx = ((t * 260) % 2400) - 600; ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx, 200 + sx * .2); ctx.lineTo(sx - 120, 176 + sx * .2); ctx.stroke();
        ctx.restore(); },
      over1: (ctx, c, sts, j, R) => {
        const r = R[j]; if (!r) return;
        if (j === on && t > tS + .3){ const g = popQ(t, tS + .3, .5); [-1, 1].forEach((d, n) => { const bx = r.headX + d * r.r * .45, by = r.top + 4, sw = Math.sin(t * 4 + n) * .25, L = r.r * 1.1 * g;
          const ex = bx + Math.sin(d * .5 + sw) * L, ey = by - Math.cos(d * .5 + sw) * L; ctx.strokeStyle = OUT; ctx.lineWidth = r.k * 2.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + d * 10, by - L * .6, ex, ey); ctx.stroke();
          ctx.strokeStyle = "#8CC46A"; ctx.lineWidth = r.k * 1.3; ctx.stroke(); ctx.beginPath(); ctx.arc(ex, ey, r.k * 4.5 * g, 0, TAU); ctx.fillStyle = "#F6D36B"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = r.k; ctx.stroke(); }); }
        if (j === who && sq > 0){ ctx.save(); ctx.globalAlpha *= sq; const R2 = r.r * 1.45, hy = r.headY - r.k * 2;
          ctx.beginPath(); ctx.arc(r.headX, hy, R2, 0, TAU); ctx.fillStyle = "rgba(190,225,240,.22)"; ctx.fill(); ctx.strokeStyle = "#E9F2F6"; ctx.lineWidth = r.k * 2.4; ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = r.k * 2; ctx.beginPath(); ctx.arc(r.headX, hy, R2 * .8, -2.5, -1.7); ctx.stroke();
          ctx.fillStyle = "#D8DEE4"; rr(ctx, r.headX - R2 * .75, hy + R2 * .82, R2 * 1.5, r.k * 7, r.k * 3); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = r.k * .8; ctx.stroke(); ctx.restore(); }
        if (j === who && nCall){ const hp = lp(sts[j], 17, -43), k0 = t - calls[nCall - 1]; ringWaves(ctx, hp[0], hp[1] - 40, t, 1, HL, 50);
        } },
      over: (ctx, c, sts, R) => {   // glyph speech
        const Bw = R[who]; if (Bw && nCall){ const k0 = t - calls[nCall - 1], rs = 20.5 * Bw.screen.scale, hs2 = Bw.screen.head, bx = clamp(hs2[0] - Bw.face * rs * 1.75, 120, 960), by = hs2[1] - rs * 1.35;
          ctx.save(); ctx.translate(bx, by); const sc = 1 + .3 * Math.max(0, 1 - k0 * 3); ctx.scale(sc, sc); ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 7; ctx.stroke(); textC(ctx, nCall + "x", 0, 18, 50, "#FFFFFF", 900); ctx.restore(); }
        const A = R[on]; if (!A) return; const hs = A.screen.top;
        (o.glyphCues || []).forEach((g, j) => { const T0 = T(s, g, .3, i), k = t - T0; if (k < 0 || k > 1.9) return; const q = eBack(clamp(k / .3, 0, 1)) * (1 - clamp((k - 1.6) / .3, 0, 1));
          const bx = clamp(hs[0] + 120 + j * 30, 300, 780), by = hs[1] - 120 - (j % 2) * 40; ctx.save(); ctx.translate(bx, by); ctx.scale(q, q); ctx.rotate(Math.sin(k * 6) * .04);
          rr(ctx, -230, -80, 460, 160, 60); ctx.fillStyle = "#E9F7D8"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-120, 70); ctx.lineTo(-190, 140); ctx.lineTo(-60, 78); ctx.fillStyle = "#E9F7D8"; ctx.fill(); ctx.stroke();
          ctx.strokeStyle = "#3B6E2A"; ctx.fillStyle = "#3B6E2A"; ctx.lineWidth = 8; ctx.lineCap = "round";
          for (let n = 0; n < 6; n++){ const gx = -175 + n * 70, sd = rnd(n + j * 7), wob = Math.sin(t * 8 + n) * 4; ctx.save(); ctx.translate(gx, wob);
            if (sd < .25){ ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fill(); }
            else if (sd < .5){ ctx.beginPath(); ctx.moveTo(-20, 20); ctx.lineTo(0, -22); ctx.lineTo(20, 20); ctx.closePath(); ctx.stroke(); }
            else if (sd < .75){ ctx.beginPath(); ctx.moveTo(-22, 0); for (let z = 0; z < 4; z++) ctx.lineTo(-22 + (z + 1) * 11, z % 2 ? 0 : -18); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 16, 5, 0, TAU); ctx.fill(); }
            else { ctx.beginPath(); ctx.moveTo(-18, -18); ctx.lineTo(18, 18); ctx.moveTo(18, -18); ctx.lineTo(-18, 18); ctx.stroke(); }
            ctx.restore(); }
          ctx.restore(); }); } });
  }, (s, f, i, add) => { const o = f.alien || {}; if (o.spaceCue) add(T(s, o.spaceCue, .2, i), "whoosh"); (o.glyphCues || []).forEach(g => add(T(s, g, .3, i), "pop")); (o.callCues || []).forEach((c, j) => add(T(s, c, .3 + j * .1, i), "ping")); });

  /* ================= kamus: living dictionary translates ================= */
  reg("kamus", "Cerita: kamus hidup menerjemahkan istilah", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.kamus || {}, from = o.from ?? 0, to = o.to ?? 1, tIn = T(s, o.inCue, .2, i), tD = T(s, o.doneCue, .4, i), pairs = o.pairs || [];
    const bx = o.x ?? 540, by = o.y ?? 640, W2 = 380, H2 = 330;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1000 },
      spots: { book: [bx, by + 120, 1.0] },
      over: (ctx, c, sts, R) => {
        if (t < tIn) return; const k = t - tIn, hop = k < .7 ? -Math.sin(k / .7 * Math.PI) * 160 : 0, sc0 = eBack(clamp(k / .45, 0, 1)), open = easeIO(clamp((k - .55) / .5, 0, 1));
        const dance = t > tD ? Math.sin((t - tD) * 9) * .05 * Math.max(0, 1 - (t - tD) * .4) : 0, hb = Math.sin(t * 2.2) * 8;
        const p = c.toScreen(bx, by), zs = c.scale(1); ctx.save(); ctx.translate(p[0], p[1] + hop + hb); ctx.scale(zs * sc0, zs * sc0); ctx.rotate(dance + (1 - open) * -.1);
        ctx.fillStyle = "rgba(20,12,8,.28)"; ctx.beginPath(); ctx.ellipse(0, H2 / 2 + 46, W2 * (.5 + .5 * open), 24, 0, 0, TAU); ctx.fill();
        // back cover
        const wOpen = lerp(W2 * .55, W2, open); rr(ctx, -wOpen - 14, -H2 / 2 - 14, wOpen * 2 + 28, H2 + 28, 22); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
        if (open > .02){ // pages
          ctx.fillStyle = PAPER; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(0, -H2 / 2 + 6); ctx.quadraticCurveTo(d * wOpen * .5, -H2 / 2 - 14, d * wOpen, -H2 / 2); ctx.lineTo(d * wOpen, H2 / 2); ctx.quadraticCurveTo(d * wOpen * .5, H2 / 2 - 14, 0, H2 / 2 + 6); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); });
          ctx.globalAlpha *= open; textC(ctx, "ISTILAH", -wOpen / 2, -H2 / 2 + 44, 28, "#8A5A3E", 800); textC(ctx, "BAHASA PELANGGAN", wOpen / 2, -H2 / 2 + 44, 28, ORANGE, 800, wOpen - 50);
          pairs.forEach((pr, j) => { const T0 = T(s, pr.cue, .2, i), yy = -H2 / 2 + 110 + j * 82; if (t < T0) return; const a = popQ(t, T0, .35), b = clamp((t - T0 - .55) / .6, 0, 1);
            ctx.save(); ctx.translate(-wOpen / 2, yy); ctx.scale(a, a); font(ctx, 900, 36, FAM); const w = ctx.measureText(pr.from).width + 34; rr(ctx, -w / 2, -26, w, 52, 10); ctx.fillStyle = "#2C3440"; ctx.fill(); textC(ctx, pr.from, 0, 13, 36, "#9FE3B0", 900); ctx.restore();
            if (b > 0){ const sz = fitFont(ctx, pr.to, wOpen - 40, 36, 800); font(ctx, 800, sz, FAM); const full = pr.to, n = Math.ceil(full.length * b); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(full.slice(0, n), wOpen / 2, yy + 13); ctx.textAlign = "left";
              ctx.strokeStyle = hexA(ORANGE, .8); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(wOpen / 2 - ctx.measureText(full).width / 2 * Math.min(1, b), yy + 26); ctx.lineTo(wOpen / 2 + ctx.measureText(full).width / 2 * Math.min(1, b), yy + 26); ctx.stroke();
              if (b < 1){ const ax = wOpen / 2 - ctx.measureText(full).width / 2 + ctx.measureText(full.slice(0, n)).width; sparkle(ctx, wOpen / 2 - 0 + (ax - wOpen / 2), yy - 6, 14, GOLD); } }
            // arrow between pages
            if (b > 0){ ctx.save(); ctx.globalAlpha *= b; ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-14, yy - 12); ctx.lineTo(10, yy); ctx.lineTo(-14, yy + 12); ctx.closePath(); ctx.fill(); ctx.restore(); } });
          ctx.globalAlpha = 1; }
        // front cover flipping open (left half) with face
        if (open < 1){ const cw = W2 * .55 * (1 - open * 2); if (cw > 4 || open < .5){ ctx.save(); const sx = open < .5 ? 1 - open * 2 : 0; ctx.scale(Math.max(.02, sx), 1);
          rr(ctx, -W2 * .55, -H2 / 2 - 8, W2 * 1.1, H2 + 16, 20); ctx.fillStyle = "#D87A2E"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
          textC(ctx, "KAMUS", 0, -60, 64, CREAM, 900); const bl = Math.sin(t * 2.3) > .96 ? .15 : 1;
          [-55, 55].forEach(dx => { ctx.beginPath(); ctx.ellipse(dx, 20, 26, 30 * bl, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.arc(dx + 6, 24, 11 * bl, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
          ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 70, 34, .2, Math.PI - .2); ctx.stroke(); ctx.restore(); } }
        // face on top edge once open (living book)
        if (open >= 1){ const bl = Math.sin(t * 2.3) > .96 ? .15 : 1, happy = t > tD; ctx.save(); ctx.translate(0, -H2 / 2 - 52); rr(ctx, -70, -34, 140, 68, 30); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
          [-30, 30].forEach(dx => { if (happy){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(dx, 2, 12, Math.PI + .3, -.3); ctx.stroke(); } else { ctx.beginPath(); ctx.ellipse(dx, -2, 12, 14 * bl, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.arc(dx + 3, 0, 6 * bl, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); } });
          ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 10, happy ? 16 : 10, .2, Math.PI - .2); ctx.stroke(); ctx.restore(); }
        ctx.restore();
        // flying jargon tiles from the speaker into the left page
        const A = R[from]; if (A) pairs.forEach((pr, j) => { const T0 = T(s, pr.cue, .2, i) - .45, k2 = (t - T0) / .45; if (k2 < 0 || k2 > 1) return; const m = c.toScreen(A.headX + A.face * A.r * .7, A.mouthY), tg = c.toScreen(bx - W2 / 2, by - H2 / 2 + 110 + j * 82);
          codeTile(ctx, pr.from, lerp(m[0], tg[0], easeIO(k2)), lerp(m[1], tg[1], easeIO(k2)) - Math.sin(k2 * Math.PI) * 120, .5 + .3 * k2, (1 - k2) * 2, t); });
        if (t > tD){ const B = R[to]; if (B){ const hs = B.screen.head; burstFx(ctx, hs[0], hs[1] - 40, t - tD, GOLD, 12, 190); } burstFx(ctx, p[0], p[1] - 60, t - tD - .1, HL, 10, 260); } } });
  }, (s, f, i, add) => { const o = f.kamus || {}; if (o.inCue) { add(T(s, o.inCue, .2, i), "whoosh"); add(T(s, o.inCue, .2, i) + .6, "pop"); } (o.pairs || []).forEach(pr => { add(T(s, pr.cue, .2, i), "pop"); add(T(s, pr.cue, .2, i) + .6, "ping"); }); if (o.doneCue) add(T(s, o.doneCue, .4, i), "chime"); });

  /* ================= izin: giant permission dialog ================= */
  function scooter(ctx, x, y, t, smoke){
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 230, 18, 0, 0, TAU); ctx.fill();
    [-150, 150].forEach(dx => { ctx.beginPath(); ctx.arc(dx, -62, 62, 0, TAU); ctx.fillStyle = "#2B1A12"; ctx.fill(); ctx.beginPath(); ctx.arc(dx, -62, 26, 0, TAU); ctx.fillStyle = "#B8AE9D"; ctx.fill(); });
    ctx.fillStyle = TEAL; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-210, -110); ctx.quadraticCurveTo(-200, -230, -60, -220); ctx.lineTo(60, -150); ctx.lineTo(130, -150); ctx.lineTo(150, -100); ctx.lineTo(-210, -100); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(120, -150); ctx.lineTo(170, -330); ctx.lineWidth = 16; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = "#5B6770"; ctx.stroke();
    ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.fillStyle = BROWN; rr(ctx, 130, -350, 110, 24, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#2C2433"; rr(ctx, -200, -250, 190, 46, 20); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FFE3A8"; ctx.beginPath(); ctx.ellipse(190, -300, 22, 16, 0, 0, TAU); ctx.fill(); ctx.stroke();
    if (smoke > 0) for (let k = 0; k < 6; k++){ const q = ((t * .55 + k / 6) % 1); ctx.save(); ctx.globalAlpha = (1 - q) * .75 * Math.min(1, smoke); ctx.fillStyle = "#8C8C8C"; ctx.beginPath(); ctx.arc(-20 + Math.sin(q * 6 + k) * 30, -220 - q * 360, 30 + q * 60, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.restore(); }
  function dialogBox(ctx, x, y, sc, o, t, st){
    // st: {rows:[q..], press: 0..1 (TOLAK pressed), glowAllow, crack 0..1}
    const W = 600, H = 600; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 1.4) * .012);
    ctx.fillStyle = "rgba(20,12,8,.3)"; rr(ctx, -W / 2 + 14, -H / 2 + 20, W, H, 40); ctx.fill();
    rr(ctx, -W / 2, -H / 2, W, H, 40); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke();
    // app icon + name (no brand)
    rr(ctx, -W / 2 + 40, -H / 2 + 36, 96, 96, 24); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); textC(ctx, "Rp", -W / 2 + 88, -H / 2 + 98, 44, "#FFFFFF", 900);
    font(ctx, 800, 34, FAM); ctx.fillStyle = "#8A5A3E"; ctx.fillText(o.app || "Aplikasi Pinjaman", -W / 2 + 156, -H / 2 + 78); font(ctx, 900, 46, FAM); ctx.fillStyle = BROWN; ctx.fillText(o.title || "Izinkan akses?", -W / 2 + 156, -H / 2 + 128);
    const rows = [{ kind: "users", label: "KONTAK", sub: "Semua nomor" }, { kind: "photo", label: "GALERI", sub: "Semua foto" }];
    rows.forEach((r, j) => { const q = (st.rows || [])[j] || 0; if (q <= 0) return; const yy = -H / 2 + 200 + j * 118; ctx.save(); ctx.translate(0, yy); ctx.scale(q, q);
      rr(ctx, -W / 2 + 36, -48, W - 72, 96, 22); ctx.fillStyle = "#FBEDE9"; ctx.fill(); ctx.strokeStyle = hexA(RED, .7 + .3 * Math.sin(t * 6)); ctx.lineWidth = 5; ctx.stroke();
      ctx.beginPath(); ctx.arc(-W / 2 + 96, 0, 34, 0, TAU); ctx.fillStyle = RED; ctx.fill(); iconAny(ctx, r.kind, -W / 2 + 96, 0, 46, "#FFFFFF");
      font(ctx, 900, 40, FAM); ctx.fillStyle = BROWN; ctx.fillText(r.label, -W / 2 + 150, 2); font(ctx, 700, 26, FAM); ctx.fillStyle = "#8A5A3E"; ctx.fillText(r.sub, -W / 2 + 150, 34);
      textC(ctx, "!", W / 2 - 80, 18, 54, RED, 900); ctx.restore(); });
    // buttons
    const by = H / 2 - 80, pr = st.press || 0, pz = 1 - .12 * Math.sin(Math.min(1, pr * 3) * Math.PI);
    ctx.save(); ctx.translate(-W / 4 + 4, by); ctx.scale(pz, pz); rr(ctx, -128, -46, 256, 92, 46); ctx.fillStyle = pr > 0 ? "#3E9B5A" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); textC(ctx, "TOLAK", 0, 15, 42, pr > 0 ? "#FFFFFF" : BROWN, 900); ctx.restore();
    const ga = st.glowAllow || 0; ctx.save(); ctx.translate(W / 4 - 4, by); const gp = 1 + ga * .05 * Math.sin(t * 7); ctx.scale(gp, gp); if (ga > 0) glowAt(ctx, 0, 0, 220, "#F6C343", .45 * ga);
    rr(ctx, -128, -46, 256, 92, 46); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); textC(ctx, "IZINKAN", 0, 15, 42, "#FFFFFF", 900); ctx.restore();
    if (st.crack > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); const L = st.crack; ctx.moveTo(-W / 4, by - 40); ctx.lineTo(-W / 4 + 60 * L, by - 160 * L); ctx.lineTo(-20 * L, -60 * L); ctx.lineTo(80 * L, -220 * L); ctx.lineTo(40 * L, -H / 2 * L); ctx.moveTo(-20 * L, -60 * L); ctx.lineTo(W / 2 * L, -10 * L); ctx.stroke(); }
    ctx.restore(); }
  function handPointer(ctx, x, y, sc, press){
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-.35); const pz = 1 - .1 * press; ctx.scale(pz, pz);
    ctx.fillStyle = "rgba(20,12,8,.3)"; rr(ctx, -30, 70, 120, 150, 40); ctx.fill();
    ctx.fillStyle = "#E7B08A"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -20, -10, 46, 130, 23); ctx.fill(); ctx.stroke();
    rr(ctx, -40, 70, 150, 150, 46); ctx.fill(); ctx.stroke(); [0, 1, 2].forEach(n => { rr(ctx, 30 + n * 0, 60 + n * 0, 1, 1, 1); });
    ctx.fillStyle = "#2F6F73"; rr(ctx, -46, 200, 162, 80, 16); ctx.fill(); ctx.stroke(); ctx.restore(); }
  reg("izin", "Cerita: dialog izin raksasa", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.izin || {}, mode = o.mode || "minta", mo = f.motor;
    const tIn = mode === "tolak" ? -1 : T(s, o.inCue, .2, i), rowsT = (o.rowCues || []).map((c, j) => T(s, c, .3, i)), tP = T(s, o.pressCue, .3, i), tDel = T(s, o.delCue, .3, i);
    const dx = o.x ?? 620, dy = o.y ?? 640;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { dialog: [dx, dy + 120, 1.0] },
      back: (ctx) => { if (mo) scooter(ctx, mo.x ?? 820, GROUND - 10, t, mo.smokeCue ? rq(t, T(s, mo.smokeCue, .2, i), .6) : 1); },
      over: (ctx, c, sts, R) => {
        const p = c.toScreen(dx, dy), zs = c.scale(1);
        const shatter = mode === "tolak" ? clamp((t - tP - .45) / .9, 0, 1) : 0;
        if (t >= tIn && shatter < 1){
          const k = t - tIn, sc = (mode === "tolak" ? 1 : eBack(clamp(k / .5, 0, 1))) * zs, rows = rowsT.map(x => mode === "tolak" ? 1 : popQ(t, x, .4));
          const press = mode === "tolak" ? clamp((t - tP) / .3, 0, 1) : 0, crack = mode === "tolak" ? clamp((t - tP - .15) / .3, 0, 1) : 0;
          if (shatter <= 0) dialogBox(ctx, p[0], p[1], sc * .92, o, t, { rows, press, crack, glowAllow: mode === "minta" ? clamp(rows[rows.length - 1] || 0, 0, 1) : 0 });
          else { for (let n = 0; n < 9; n++){ const gx = (n % 3 - 1) * 200, gy = (Math.floor(n / 3) - 1) * 200, vx = gx * 1.4 + (rnd(n) - .5) * 300, vy = -200 + rnd(n + 4) * 100;
            ctx.save(); ctx.globalAlpha = 1 - shatter; ctx.translate(p[0] + (gx + vx * shatter) * zs * .92, p[1] + (gy + vy * shatter + 1400 * shatter * shatter) * zs * .92); ctx.rotate((rnd(n + 8) - .5) * 6 * shatter);
              ctx.beginPath(); ctx.moveTo(-100, -100); ctx.lineTo(100, -80 + rnd(n) * 40); ctx.lineTo(90, 100); ctx.lineTo(-90 + rnd(n + 1) * 40, 90); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
              if (n === 7){ ctx.fillStyle = ORANGE; rr(ctx, -80, -40, 160, 70, 30); ctx.fill(); } ctx.restore(); } burstFx(ctx, p[0], p[1], t - tP - .45, HL, 14, 300); }
          if (mode === "tolak" && t < tP + .6){ const a = clamp(t / Math.max(.3, tP), 0, 1), hx = lerp(p[0] + 330, p[0] - 150 * zs, easeIO(a)), hy = lerp(p[1] + 600, p[1] + 270 * zs, easeIO(a)); handPointer(ctx, hx, hy, zs * 1.1, clamp((t - tP) / .2, 0, 1)); }
          if (mode === "minta"){ const k2 = clamp((t - (rowsT[rowsT.length - 1] || 0) - .6) / 1.2, 0, 1); if (k2 > 0) handPointer(ctx, p[0] + 330 - 180 * easeIO(k2) * zs, p[1] + 560 - 230 * easeIO(k2) * zs, zs * 1.1, 0); } }
        if (mode === "tolak" && t > tDel - .2){ // app icon gets deleted
          const k = t - tDel, ax = p[0], ay = p[1] - 30, q = popQ(t, tDel - .2, .4), gone = clamp((k - 1.1) / .4, 0, 1);
          if (gone < 1){ ctx.save(); ctx.translate(ax + (k > .2 && k < 1.1 ? Math.sin(k * 40) * 8 : 0), ay); ctx.scale(q * (1 - gone), q * (1 - gone)); ctx.rotate(Math.sin(t * 3) * .05);
            rr(ctx, -130, -130, 260, 260, 60); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke(); textC(ctx, "Rp", 0, -10, 90, "#FFFFFF", 900);
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 80, 34, Math.PI + .5, -.5); ctx.stroke();
            ctx.beginPath(); ctx.arc(120, -120, 46, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(104, -136); ctx.lineTo(136, -104); ctx.moveTo(136, -136); ctx.lineTo(104, -104); ctx.stroke(); ctx.restore(); }
          dust(ctx, ax, ay + 60, k - 1.1, 12, "#E9D8C2", 260); if (k > 1.2 && k < 3.4){ ctx.save(); ctx.globalAlpha *= 1 - clamp((k - 3.0) / .4, 0, 1); stampBox(ctx, "DIHAPUS", ax, ay, k - 1.2, RED, 70, -.1); ctx.restore(); } } } });
  }, (s, f, i, add) => { const o = f.izin || {}; if (o.inCue) add(T(s, o.inCue, .2, i), "whoosh"); (o.rowCues || []).forEach(c => add(T(s, c, .3, i), "pop")); if (o.pressCue){ add(T(s, o.pressCue, .3, i), "pop"); add(T(s, o.pressCue, .3, i) + .45, "whoosh"); }
    if (o.delCue){ add(T(s, o.delCue, .3, i) + 1.1, "pop"); add(T(s, o.delCue, .3, i) + 1.2, "chime"); } });

  /* ================= capit: claw machine steals the contacts ================= */
  reg("capit", "Cerita: mesin capit menyedot kontak dan foto", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.claw || {}, mx = o.x ?? 720, top = o.top ?? 560, W = 520, gl0 = top + 170, gl1 = GROUND - 250;
    const tB = T(s, o.btnCue, .1, i), tF = T(s, o.freezeCue, .3, i), tDr = T(s, o.dropCue, .3, i), tSp = T(s, o.spreadCue, .3, i);
    const items = o.items || [{ label: "IBU", col: "#E07A5F" }, { label: "BOS", col: "#5B7DB1" }, { label: "TEMAN", col: "#7FA563" }, { photo: 1 }, { label: "ADIK", col: "#C98BB9" }, { photo: 1 }];
    // claw timeline: 0 idle at top, drop 0..1.0, grab 1.0..1.4, rise 1.4..2.6 (out of the top)
    const kd = t - tDr, drop = kd < 0 ? 0 : kd < 1 ? easeIO(kd) : kd < 1.4 ? 1 : 1 - easeIO(clamp((kd - 1.4) / 1.2, 0, 1)) * 1.9, close = clamp((kd - .95) / .35, 0, 1);
    const clawY = lerp(gl0 + 20, gl1 - 150, drop), clawX = mx + Math.sin(t * 1.2) * (kd < 0 ? 120 : 0);
    const spots = { machine: [mx, top + 520, .95], btn: [430, 820, 1.25] };
    base(ctx, s, t, { env: "night", spots,
      back: (ctx) => {
        ctx.save(); ctx.translate(mx, 0);
        ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(-W / 2 + 14, top + 14, W, GROUND - top);
        ctx.fillStyle = "#C2691F"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; rr(ctx, -W / 2, top, W, GROUND - top, 26); ctx.fill(); ctx.stroke();
        rr(ctx, -W / 2 - 16, top - 20, W + 32, 120, 30); ctx.fillStyle = "#8E3F17"; ctx.fill(); ctx.stroke();
        for (let k = 0; k < 9; k++){ const on = Math.sin(t * 6 + k) > 0; ctx.beginPath(); ctx.arc(-W / 2 + 30 + k * (W - 60) / 8, top - 6, 9, 0, TAU); ctx.fillStyle = on ? GOLD : "#5A2A12"; ctx.fill(); }
        textC(ctx, o.title || "DATA DARTO", 0, top + 66, 50, CREAM, 900, W - 60);
        ctx.fillStyle = "#1F2540"; rr(ctx, -W / 2 + 26, gl0 - 40, W - 52, gl1 - gl0 + 40, 14); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#3A2C3E"; rr(ctx, -W / 2 + 26, gl1 + 20, W - 52, 200, 14); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#111"; rr(ctx, W / 2 - 170, gl1 + 60, 120, 110, 12); ctx.fill(); textC(ctx, "AMBIL", W / 2 - 110, gl1 + 200, 24, CREAM, 800);
        ctx.beginPath(); ctx.arc(-W / 2 + 110, gl1 + 110, 34, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#2B1A12"; ctx.fillRect(-W / 2 + 180, gl1 + 60, 14, 60); ctx.beginPath(); ctx.arc(-W / 2 + 187, gl1 + 56, 22, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.stroke();
        ctx.restore();
        // gantry rail + cable + claw
        ctx.strokeStyle = "#B8AE9D"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(mx - W / 2 + 40, gl0 - 20); ctx.lineTo(mx + W / 2 - 40, gl0 - 20); ctx.stroke();
        ctx.strokeStyle = "#D8DEE4"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(clawX, gl0 - 20); ctx.lineTo(clawX, clawY); ctx.stroke();
        ctx.save(); ctx.translate(clawX, clawY); ctx.fillStyle = "#9AA4AE"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -46, -30, 92, 54, 14); ctx.fill(); ctx.stroke();
        ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -4, 10, 0, TAU); ctx.fill();
        [-1, 0, 1].forEach(d => { const a = d * (.75 - close * .55) + (d === 0 ? 0 : 0); ctx.save(); ctx.translate(d * 26, 20); ctx.rotate(a); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 80); ctx.lineTo(-d * 30, 120); ctx.stroke(); ctx.strokeStyle = "#C9D0D6"; ctx.lineWidth = 9; ctx.stroke(); ctx.restore(); });
        ctx.restore(); },
      mid: (ctx) => {   // prizes in the glass (drawn above the cabinet)
        items.forEach((it, j) => { const col = j % 3, row = Math.floor(j / 3), hx = mx - 150 + col * 150 + (row ? 70 : 0), hy = gl1 - 80 - row * 140, grab = j < (o.grabN ?? 4);
          let x = hx, y = hy + Math.sin(t * 2 + j) * 4, ring = 0, show = 1;
          if (grab && kd > 1.0){ const q = clamp((kd - 1.0) / .3, 0, 1); x = lerp(hx, clawX + (j - 1.5) * 34, q); y = lerp(hy, clawY + 140 + (j % 2) * 30, q); }
          if (grab && t > tSp){ const q = easeIO(clamp((t - tSp - j * .12) / .8, 0, 1)), tx = 140 + j * 230, ty = 300 + (j % 2) * 150; x = lerp(x, tx, q); y = lerp(y, ty, q) - Math.sin(q * Math.PI) * 140; ring = q; }
          if (!grab && kd > 1.4) show = 1;
          if (show <= 0) return;
          if (it.photo){ ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2 + j) * .1); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -64, -54, 128, 108, 8); ctx.fill(); ctx.stroke(); photoGlyph(ctx, 0, -2, 1.65, "#5B7DB1"); ctx.restore();
            if (ring > .9) ringWaves(ctx, x, y, t, 1, RED, 70); }
          else avatarBall(ctx, x, y, 64, it.col, it.label, t, ring > .9 ? 1 : 0);
          if (ring > .95 && it.label){ const k = t - tSp - j * .12 - .8; ctx.save(); ctx.translate(x + 60, y - 60); const q = popQ(k, 0, .3); ctx.scale(q, q); ctx.rotate(.1); rr(ctx, -70, -26, 140, 52, 12); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, "TAGIH!", 0, 12, 32, "#FFFFFF", 900); ctx.restore(); } }); },
      midZ: -.5,
      over: (ctx, c, sts, R) => {   // floating IZINKAN button near the hero's finger
        if (t < tB) return; const fr = t > tF, p = c.toScreen(o.btnX ?? 430, o.btnY ?? 800), zs = c.scale(1), q = popQ(t, tB, .4) * (1 - clamp((t - tDr) / .4, 0, 1));
        if (q <= 0) return; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(q * zs, q * zs); glowAt(ctx, 0, 0, 200, "#F6C343", fr ? .2 : .5); if (fr) ctx.rotate(Math.sin(t * 30) * .02);
        rr(ctx, -140, -50, 280, 100, 50); ctx.fillStyle = fr ? "#9AA4AE" : ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); textC(ctx, "IZINKAN", 0, 17, 46, "#FFFFFF", 900);
        if (fr){ ctx.beginPath(); ctx.arc(140, -50, 36, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.stroke(); textC(ctx, "!", 140, -34, 50, "#FFFFFF", 900); } ctx.restore(); } });
  }, (s, f, i, add) => { const o = f.claw || {}; if (o.btnCue) add(T(s, o.btnCue, .1, i), "pop"); if (o.freezeCue) add(T(s, o.freezeCue, .3, i), "ping"); if (o.dropCue){ const d = T(s, o.dropCue, .3, i); add(d, "whoosh"); add(d + 1.0, "pop"); add(d + 1.4, "whoosh"); }
    if (o.spreadCue){ add(T(s, o.spreadCue, .3, i), "whoosh"); add(T(s, o.spreadCue, .3, i) + .9, "ping"); } });

  /* ================= camilan: snack jar of allowed permissions ================= */
  function cookie(ctx, x, y, r, kind, label, t, bad){
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.arc(4, 7, r, 0, TAU); ctx.fill();
    ctx.beginPath(); for (let k = 0; k < 16; k++){ const a = k / 16 * TAU, rr2 = r * (k % 2 ? .93 : 1); ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = bad ? "#B9B0A6" : "#E8B46A"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = bad ? "#8C847C" : "#B9772E"; [[-.5, -.45], [.55, -.3], [-.45, .5], [.4, .55]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a * r, b * r, r * .09, 0, TAU); ctx.fill(); });
    ctx.beginPath(); ctx.arc(0, 0, r * .52, 0, TAU); ctx.fillStyle = bad ? "#6E655E" : ORANGE; ctx.fill(); iconAny(ctx, kind, 0, 0, r * .6, "#FFFFFF");
    if (label){ font(ctx, 800, 30, FAM); const w = ctx.measureText(label).width + 26; rr(ctx, -w / 2, r + 8, w, 44, 12); ctx.fillStyle = bad ? "#6E655E" : CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, label, 0, r + 41, 30, bad ? "#FFFFFF" : BROWN, 800); }
    ctx.restore(); }
  reg("camilan", "Cerita: toples camilan izin aplikasi", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.snack || {}, jx = o.x ?? 560, jy = o.y ?? 660, tJ = T(s, o.jarCue, .1, i), tW = T(s, o.wordCue, .3, i), items = o.items || [], bad = o.bad || [];
    const JW = o.w ?? 640, JH = o.h ?? 440;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 980 }, spots: { jar: [jx, jy + 160, 1.15] },
      over: (ctx, c, sts, R) => {
        if (t < tJ) return; const p = c.toScreen(jx, jy), zs = c.scale(1), q = popQ(t, tJ, .5), wob = Math.sin(t * 2) * .015;
        ctx.save(); ctx.translate(p[0], p[1] + Math.sin(t * 1.6) * 6); ctx.scale(q * zs, q * zs); ctx.rotate(wob);
        glowAt(ctx, 0, 0, 380, "#FFE3A8", .35);
        // jar back
        rr(ctx, -JW / 2, -JH / 2, JW, JH, 60); ctx.fillStyle = "rgba(255,248,235,.62)"; ctx.fill();
        // cookies inside
        items.forEach((it, j) => { const T0 = T(s, it.cue, .3, i); if (t < T0) return; const k = t - T0, fall = clamp(k / .55, 0, 1), tx = -JW / 2 + 120 + j * ((JW - 240) / Math.max(1, items.length - 1)), ty = JH / 2 - 130;
          const x = lerp(tx + (j - 1) * 260, tx, fall), y = lerp(-JH / 2 - 380, ty, eOut(fall)) - (fall >= 1 ? Math.abs(Math.sin((k - .55) * 9)) * 30 * Math.max(0, 1 - (k - .55) * 2) : 0);
          cookie(ctx, x, y, 70, it.kind, fall >= 1 ? it.label : "", t, false); if (fall >= 1) burstFx(ctx, tx, ty, k - .55, GOLD, 8, 110); });
        // glass front + lid + label
        rr(ctx, -JW / 2, -JH / 2, JW, JH, 60); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-JW / 2 + 34, -JH / 2 + 80); ctx.lineTo(-JW / 2 + 34, JH / 2 - 120); ctx.stroke();
        const lidB = bad.some(b => { const k = t - T(s, b.cue, .3, i); return k > .5 && k < .8; }) ? Math.sin(t * 50) * 6 : 0;
        ctx.save(); ctx.translate(0, lidB); rr(ctx, -JW / 2 + 20, -JH / 2 - 56, JW - 40, 62, 20); ctx.fillStyle = TEAL; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); ctx.restore();
        // label word CAMILAN with highlighted letters CA MI L
        const wq = popQ(t, tW, .4); if (wq > 0){ ctx.save(); ctx.translate(0, -JH / 2 + 70); ctx.scale(wq, wq); rr(ctx, -200, -48, 400, 96, 20); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
          font(ctx, 900, 66, FAM); const parts = [["CA", 1], ["MI", 1], ["L", 1], ["AN", 0]]; let tw = parts.reduce((a, p) => a + ctx.measureText(p[0]).width, 0), x = -tw / 2;
          parts.forEach(([w, hl], n) => { const lit = hl && t > tW + .5 + n * .35; ctx.fillStyle = lit ? ORANGE : BROWN; ctx.fillText(w, x, 24); if (lit){ ctx.fillRect(x, 34, ctx.measureText(w).width - 4, 6); } x += ctx.measureText(w).width; }); ctx.restore(); }
        ctx.restore();
        // bad cookies bounce off the lid with a red X
        bad.forEach((b, j) => { const T0 = T(s, b.cue, .3, i), k = t - T0; if (k < 0 || k > 2.4) return; const side = j % 2 ? 1 : -1;
          let x, y; if (k < .55){ const q = k / .55; x = lerp(side * 420, side * 90, q); y = lerp(-JH / 2 - 420, -JH / 2 - 110, eOut(q)); } else { const q = (k - .55) / 1.85; x = side * (90 + q * 620); y = -JH / 2 - 110 - Math.sin(Math.min(1, q * 2) * Math.PI) * 160 + q * q * 900; }
          const P2 = [p[0] + x * zs, p[1] + y * zs]; ctx.save(); ctx.translate(P2[0], P2[1]); ctx.rotate(k > .55 ? (k - .55) * 6 * side : 0); cookie(ctx, 0, 0, 58 * zs, b.kind, b.label, t, true);
          if (k > .5){ const xq = popQ(k, .5, .3); ctx.scale(xq, xq); ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(50, 50); ctx.moveTo(50, -50); ctx.lineTo(-50, 50); ctx.stroke(); } ctx.restore(); }); } });
  }, (s, f, i, add) => { const o = f.snack || {}; if (o.jarCue) add(T(s, o.jarCue, .1, i), "whoosh"); (o.items || []).forEach(it => add(T(s, it.cue, .3, i) + .55, "pop")); (o.bad || []).forEach(b => add(T(s, b.cue, .3, i) + .5, "ping")); if (o.wordCue) add(T(s, o.wordCue, .3, i), "chime"); });

  /* ================= susut: friends laugh, the hero shrinks ================= */
  reg("susut", "Cerita: ditertawakan sampai mengecil", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, tb = f.table || {}, haha = f.haha || [];
    base(ctx, s, t, { env: "night",
      back: (ctx) => { // string lights + cafe awning
        for (let k = 0; k < 14; k++){ const x = -120 + k * 100, y = 480 + Math.sin(k * .9) * 30 + Math.sin(t * 1.5 + k) * 3; ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 3; if (k){ ctx.beginPath(); ctx.moveTo(x - 100, 480 + Math.sin((k - 1) * .9) * 30); ctx.quadraticCurveTo(x - 50, y + 40, x, y); ctx.stroke(); }
          const on = .6 + .4 * Math.sin(t * 3 + k * 1.7); glowAt(ctx, x, y + 14, 50, "#FFD08A", .5 * on); ctx.beginPath(); ctx.arc(x, y + 14, 11, 0, TAU); ctx.fillStyle = hexA("#FFE3A8", .7 + .3 * on); ctx.fill(); }
        ctx.save(); ctx.translate(540, 300); for (let k = -8; k < 8; k++){ ctx.fillStyle = k % 2 ? CREAM : ORANGE; ctx.beginPath(); ctx.moveTo(k * 90, 0); ctx.lineTo(k * 90 + 90, 0); ctx.lineTo(k * 90 + 90, 70); ctx.quadraticCurveTo(k * 90 + 45, 110, k * 90, 70); ctx.closePath(); ctx.fill(); } ctx.restore();
        textC(ctx, "KAFE", 540, 250, 60, "#FFE3A8", 900); },
      front: (ctx) => { const x = tb.x ?? 600, y = GROUND - 330; ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(x, GROUND, 200, 20, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#5A3A2A"; ctx.fillRect(x - 12, y, 24, 330); ctx.fillRect(x - 90, GROUND - 16, 180, 16); ctx.beginPath(); ctx.ellipse(x, y, 190, 34, 0, 0, TAU); ctx.fillStyle = "#C47A48"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        [[-80, "#FFF4E6"], [70, "#F6D36B"]].forEach(([dx, col], n) => { ctx.fillStyle = col; rr(ctx, x + dx - 26, y - 76, 52, 70, 10); ctx.fill(); ctx.stroke();
          for (let k = 0; k < 2; k++){ const q = ((t * .5 + k / 2 + n * .3) % 1); ctx.save(); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + dx, y - 86 - q * 70); ctx.quadraticCurveTo(x + dx + 14, y - 110 - q * 70, x + dx, y - 130 - q * 70); ctx.stroke(); ctx.restore(); } }); },
      over: (ctx, c, sts, R) => {
        haha.forEach((h, j) => { const A = R[h.from], B = R[h.to ?? 0]; if (!A || !B) return; const T0 = T(s, h.cue, .2 + j * .1, i), k = t - T0; if (k < 0 || k > 1.6) return;
          const m = A.screen.head, tg = B.screen.head, q = clamp(k / .7, 0, 1), sz = (h.size || 90) * (1 + j * .15);
          for (let n = 0; n < 2; n++){ const qq = clamp(q - n * .15, 0, 1), x = lerp(m[0] - 40 * A.face, tg[0] + 60, easeIO(qq)), y = lerp(m[1] - 120, tg[1] - 200, easeIO(qq)) - Math.sin(qq * Math.PI) * 180 + n * 80;
            ctx.save(); ctx.globalAlpha = 1 - clamp((k - 1.2) / .4, 0, 1); ctx.translate(x, y); ctx.rotate(Math.sin(t * 14 + n) * .15); const sc = .5 + .5 * eBack(clamp(qq * 2, 0, 1)); ctx.scale(sc, sc);
            outlineWords(ctx, [{ w: "HA", hl: n === 0 }, { w: "HA", hl: n === 1 }], 0, 0, sz, { sw: sz * .2 }); ctx.restore(); }
          if (q >= 1) burstFx(ctx, tg[0] + 60, tg[1] - 160, k - .7, "#9AA4AE", 8, 120); }); } });
  }, (s, f, i, add) => { (f.haha || []).forEach((h, j) => { const T0 = T(s, h.cue, .2 + j * .1, i); add(T0, "whoosh"); add(T0 + .7, "pop"); }); });

  /* ================= trampolin: friends bounce the hero up ================= */
  reg("trampolin", "Cerita: kain pantul teman", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.tramp || {}, A = o.a ?? 0, B = o.b ?? 1, RD = o.rider ?? 2, goal = o.goal || {};
    const bounces = (o.bounces || []).map((b, j) => ({ T: T(s, b.cue, .2, i), h: b.h || 400, dur: b.dur || 1.15 })).sort((p, q) => p.T - q.T);
    let lift = 0, sag = 0, air = false, last = -9;
    bounces.forEach(b => { const k = t - b.T; if (k < 0) return; last = b.T;
      if (k < .2) { sag = Math.max(sag, Math.sin(k / .2 * Math.PI / 2) * 60); }
      else if (k < .2 + b.dur){ const q = (k - .2) / b.dur; lift = 4 * q * (1 - q) * b.h; air = true; }
      else if (k < .2 + b.dur + .5){ const q = (k - .2 - b.dur) / .5; sag = Math.max(sag, Math.sin(q * Math.PI) * 50 * (1 - q)); } });
    const holdY = o.clothY ?? 1290, touch = goal.y != null && bounces.length && t > bounces[bounces.length - 1].T + .2 + bounces[bounces.length - 1].dur / 2 - .1;
    base(ctx, s, t, { env: "park", envOpt: { time: "day" },
      adj: (sts) => { const r = sts[RD]; if (r){ r.y = holdY + sag - lift; if (air){ r.pose = "cheer"; } } },
      back: (ctx) => { if (goal.text){ const gy = goal.y ?? 300, sw = Math.sin(t * 1.3) * .03, lit = touch ? 1 : 0; ctx.save(); ctx.translate(540, gy); ctx.rotate(sw);
        ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-300, -260); ctx.lineTo(-200, -40); ctx.moveTo(300, -260); ctx.lineTo(200, -40); ctx.stroke();
        if (lit) glowAt(ctx, 0, 0, 360, "#F6C343", .55);
        rr(ctx, -230, -70, 460, 140, 26); ctx.fillStyle = lit ? GOLD : CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); textC(ctx, goal.text, 0, 30, 84, lit ? BROWN : ORANGE, 900);
        sparkle(ctx, -260, -60 + Math.sin(t * 3) * 10, 22, GOLD); sparkle(ctx, 260, 40 + Math.cos(t * 3) * 10, 18, GOLD); ctx.restore(); } },
      mid: (ctx, c, sts) => { const a = sts[A], b = sts[B]; if (!a || !b) return; const pa = lp(a, 21, -47), pb = lp(b, 21, -47), r = sts[RD], mx = r ? r.x : (pa[0] + pb[0]) / 2;
        const y0 = holdY, dip = sag + (air ? -Math.min(30, lift * .04) : 0);
        ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.beginPath(); ctx.ellipse(mx, GROUND, 120 * (1 - Math.min(.6, lift / 1200)), 16, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.quadraticCurveTo(mx, y0 + dip * 2, pb[0], pb[1]); ctx.lineTo(pb[0], pb[1] + 26); ctx.quadraticCurveTo(mx, y0 + dip * 2 + 30, pa[0], pa[1] + 26); ctx.closePath();
        ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        ctx.strokeStyle = hexA(CREAM, .8); ctx.lineWidth = 6; ctx.setLineDash([22, 18]); ctx.beginPath(); ctx.moveTo(pa[0] + 10, pa[1] + 13); ctx.quadraticCurveTo(mx, y0 + dip * 2 + 15, pb[0] - 10, pb[1] + 13); ctx.stroke(); ctx.setLineDash([]);
        if (air && lift < 160){ for (let n = 0; n < 5; n++){ ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 6; const x = mx - 80 + n * 40; ctx.beginPath(); ctx.moveTo(x, y0 - lift - 20); ctx.lineTo(x, y0 - lift + 50); ctx.stroke(); } } },
      midZ: 2,
      over: (ctx, c, sts, R) => { bounces.forEach(b => { const r = R[RD]; if (!r) return; const hs = r.screen.head; const k = t - b.T - .2; if (k > 0 && k < .6) burstFx(ctx, hs[0], hs[1] + 250, k, GOLD, 10, 160); });
        if (touch){ const lb = bounces[bounces.length - 1], tt = lb.T + .2 + lb.dur / 2 - .1, p = c.toScreen(540, goal.y ?? 300); burstFx(ctx, p[0], p[1], t - tt, GOLD, 16, 320); } } });
  }, (s, f, i, add) => { const o = f.tramp || {}; (o.bounces || []).forEach(b => { const T0 = T(s, b.cue, .2, i); add(T0, "pop"); add(T0 + .2, "whoosh"); }); const lb = (o.bounces || []).slice(-1)[0]; if (lb && o.goal) add(T(s, lb.cue, .2, i) + .2 + (lb.dur || 1.15) / 2, "chime"); });

  /* ================= cincin: glowing ring of friends, the hero grows ================= */
  reg("cincin", "Cerita: lingkaran yang menumbuhkan", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.ring || {}, on = o.on ?? 0, tR = T(s, o.cue, .2, i), gifts = o.gifts || [];
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      under: (ctx, c, sts, j) => { if (j !== on || t < tR) return; const st = sts[on], q = popQ(t, tR, .6), rx = 330 * q, ry = 70 * q;
        ctx.save(); ctx.translate(st.x, GROUND - 6); glowAt(ctx, 0, 0, 380 * q, "#F08C2E", .35);
        ctx.strokeStyle = hexA(GOLD, .9); ctx.lineWidth = 14; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.stroke(); ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.stroke();
        for (let k = 0; k < 16; k++){ const a = k / 16 * TAU + t * .5, qq = ((t * .6 + rnd(k)) % 1); ctx.globalAlpha = (1 - qq) * q; sparkle(ctx, Math.cos(a) * rx, Math.sin(a) * ry - qq * 520, 10 + rnd(k + 1) * 8, k % 2 ? GOLD : HL); }
        ctx.restore(); },
      over: (ctx, c, sts, R) => {
        const H0 = R[on]; if (!H0) return; const tgt = c.toScreen(sts[on].x, sts[on].y - sts[on].size * .45);
        gifts.forEach((g, j) => { const T0 = T(s, g.cue, .2, i), k = t - T0; if (k < 0) return; const S0 = R[g.from ?? (j % 2 ? 2 : 1)]; const src = S0 ? S0.screen.head : [540, 400];
          const q = clamp(k / .9, 0, 1); if (q < 1){ const x = lerp(src[0], tgt[0], easeIO(q)), y = lerp(src[1] - 160, tgt[1], easeIO(q)) - Math.sin(q * Math.PI) * 220;
            for (let n = 1; n < 6; n++){ const qq = Math.max(0, q - n * .04); ctx.save(); ctx.globalAlpha = .4 * (1 - n / 6); ctx.beginPath(); ctx.arc(lerp(src[0], tgt[0], easeIO(qq)), lerp(src[1] - 160, tgt[1], easeIO(qq)) - Math.sin(qq * Math.PI) * 220, 40 - n * 5, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore(); }
            ctx.save(); ctx.translate(x, y); ctx.scale(.6 + .4 * eBack(Math.min(1, q * 3)), .6 + .4 * eBack(Math.min(1, q * 3))); glowAt(ctx, 0, 0, 100, "#F6C343", .6); ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.stroke(); iconAny(ctx, g.icon || "heart", 0, 0, 56, "#FFFFFF"); ctx.restore(); }
          else burstFx(ctx, tgt[0], tgt[1], k - .9, GOLD, 12, 230);
          // label chip stacked at the top
          chip(ctx, g.text, 540, 290 + j * 118, k - .2, { icon: g.chipIcon || (glyphOf(g.icon) ? "sparkles" : g.icon), size: 50, t }); }); } });
  }, (s, f, i, add) => { const o = f.ring || {}; if (o.cue) add(T(s, o.cue, .2, i), "chime"); (o.gifts || []).forEach(g => { add(T(s, g.cue, .2, i), "whoosh"); add(T(s, g.cue, .2, i) + .9, "pop"); }); });

  /* ================= desk helpers (rimba / reset / pagi) ================= */
  function deskTop(ctx, x, y, w){ // y = tabletop
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, GROUND + 4, w / 2 + 20, 22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8E4E2E"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; [-w / 2 + 30, w / 2 - 56].forEach(dx => { rr(ctx, x + dx, y + 20, 26, GROUND - y - 20, 6); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = "#A9643B"; rr(ctx, x - w / 2 + 70, y + 30, w * .42, 150, 10); ctx.fill(); ctx.stroke(); ctx.fillStyle = OUT; ctx.fillRect(x - w / 2 + 70 + w * .21 - 30, y + 96, 60, 10);
    ctx.fillStyle = "#C47A48"; rr(ctx, x - w / 2, y - 6, w, 40, 10); ctx.fill(); ctx.stroke(); }
  function laptop(ctx, x, y, t, note, glow){
    ctx.save(); ctx.translate(x, y); if (glow) glowAt(ctx, 0, -100, 240, "#CFE7EE", .35 * glow);
    ctx.fillStyle = "#544E42"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-120, -180); ctx.lineTo(120, -180); ctx.lineTo(130, -12); ctx.lineTo(-130, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#BFE2EA"; ctx.fillRect(-104, -164, 208, 138); ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 4; k++) ctx.fillRect(-88, -148 + k * 30, 70 + ((k * 37 + Math.floor(t * 2)) % 80), 12);
    ctx.fillStyle = BROWN; rr(ctx, -146, -12, 292, 16, 6); ctx.fill();
    if (note){ ctx.save(); ctx.translate(note.x ?? 90, note.y ?? -150); ctx.rotate(.1 + Math.sin(t * 2) * .03); ctx.scale(note.s || 1, note.s || 1); ctx.fillStyle = GOLD; ctx.fillRect(-46, -46, 92, 92); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-46, -46, 92, 92);
      ctx.fillStyle = BROWN; ctx.fillRect(-32, -20, 64, 6); ctx.fillRect(-32, -4, 50, 6); ctx.fillRect(-32, 12, 58, 6); ctx.restore(); }
    ctx.restore(); }
  function paperPile(ctx, x, y, n, t, seed, tilt){ for (let k = 0; k < n; k++){ ctx.save(); ctx.translate(x + Math.sin(k * 2.3 + seed) * 14, y - k * 13); ctx.rotate((rnd(k + seed) - .5) * (tilt ?? .5));
    ctx.fillStyle = k % 3 === 2 ? "#F3E3C8" : PAPER; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.fillRect(-70, -10, 140, 16); ctx.strokeRect(-70, -10, 140, 16); ctx.restore(); } }
  function cup(ctx, x, y, t, old){ ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#FFF4E6"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -30, -70, 60, 70, 8); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(32, -36, 15, -1.3, 1.3); ctx.stroke();
    ctx.fillStyle = ORANGE; ctx.fillRect(-30, -48, 60, 14);
    if (old){ for (let k = 0; k < 3; k++){ const a = t * (5 + k) + k * 2, fx = Math.cos(a) * 46, fy = -100 + Math.sin(a * 1.3) * 26; ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(fx, fy, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(fx - 5, fy - 6, 6, 3, Math.sin(t * 40) * .6, 0, TAU); ctx.stroke(); } }
    ctx.restore(); }
  function folderObj(ctx, x, y, label, open, sc){ ctx.save(); ctx.translate(x, y); ctx.scale(sc || 1, sc || 1); ctx.fillStyle = "#E8A55B"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -80, -120, 160, 120, 10); ctx.fill(); ctx.stroke(); rr(ctx, -80, -136, 70, 24, 6); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.translate(-80, 0); ctx.rotate(-(open || 0) * .5); ctx.fillStyle = "#F4C07F"; rr(ctx, 0, -110, 160, 110, 10); ctx.fill(); ctx.stroke(); ctx.restore();
    if (label) textC(ctx, label, 0, -40, 28, BROWN, 900, 140); ctx.restore(); }
  function tray(ctx, x, y, n){ ctx.save(); ctx.translate(x, y); paperPile(ctx, 0, -14, n, 0, 3, .05); ctx.fillStyle = "#5B6770"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-100, -40); ctx.lineTo(100, -40); ctx.lineTo(90, 0); ctx.lineTo(-90, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); textC(ctx, "BAKI", 0, -12, 22, "#FFFFFF", 800); ctx.restore(); }
  function cableMess(ctx, x, y, t, tidy){ ctx.save(); ctx.translate(x, y); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 9; ctx.lineCap = "round";
    if (tidy < 1){ ctx.globalAlpha = 1 - tidy; ctx.beginPath(); ctx.moveTo(-120, 0); for (let k = 0; k < 9; k++){ const a = k * 1.7 + Math.sin(t * 2 + k) * .2; ctx.quadraticCurveTo(-90 + k * 28 + Math.cos(a) * 50, -40 + Math.sin(a) * 40, -80 + k * 26, -10 + Math.sin(k) * 20); } ctx.stroke(); ctx.globalAlpha = 1; }
    if (tidy > 0){ ctx.save(); ctx.scale(tidy, tidy); for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.ellipse(0, -30, 40 - k * 8, 26 - k * 5, 0, 0, TAU); ctx.stroke(); } ctx.fillStyle = ORANGE; ctx.fillRect(-8, -60, 16, 60); ctx.restore(); }
    ctx.restore(); }

  /* ================= rimba: messy desk as a jungle ================= */
  reg("rimba", "Cerita: meja jadi hutan", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.jungle || {}, dx = (o.desk || {}).x ?? 640, dTop = 1250;
    const tG = T(s, o.growCue, .2, i), tCa = T(s, o.cableCue, .3, i), tPa = T(s, o.paperCue, .3, i), tCu = T(s, o.cupCue, .3, i), tFi = T(s, o.fileCue, .4, i);
    const g = rq(t, tG, .9);
    base(ctx, s, t, { env: "park", envOpt: { time: "day", treeX: -200 }, front: false,
      spots: { desk: [dx, dTop - 100, 1.15], file: [dx + 160, dTop - 200, 1.3] },
      back: (ctx) => {
        // big jungle leaves behind the desk
        for (let k = 0; k < 7; k++){ const lx = dx - 420 + k * 140, ly = dTop - 40, L = (260 + rnd(k) * 200) * g, a = -1.9 + k * .35 + Math.sin(t * 1.3 + k) * .05; if (L <= 0) continue;
          ctx.save(); ctx.translate(lx, ly); ctx.rotate(a); ctx.fillStyle = k % 2 ? "#3E8A4A" : "#2F7A3E"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * .5, -L * .35, L, 0); ctx.quadraticCurveTo(L * .5, L * .35, 0, 0); ctx.fill(); ctx.strokeStyle = "#1F5A2C"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L * .95, 0); ctx.stroke(); ctx.restore(); }
        deskTop(ctx, dx, dTop, 600); laptop(ctx, dx - 60, dTop - 6, t, null, 1);
        // papers pile into bushes
        const pq = rq(t, tPa, .8); paperPile(ctx, dx + 170, dTop - 10, Math.round(3 + pq * 11), t, 1); paperPile(ctx, dx - 230, dTop - 10, Math.round(2 + pq * 8), t, 7);
        if (pq > 0 && pq < 1) for (let k = 0; k < 4; k++){ const fx = dx + 120 + k * 40, fy = dTop - 260 - ((t * 300 + k * 90) % 300); ctx.save(); ctx.translate(fx, fy); ctx.rotate(t * 3 + k); ctx.fillStyle = PAPER; ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.fillRect(-30, -20, 60, 40); ctx.strokeRect(-30, -20, 60, 40); ctx.restore(); }
        // old coffee cups with flies
        if (t > tCu){ const q = popQ(t, tCu, .4); ctx.save(); ctx.translate(dx + 280, dTop - 6); ctx.scale(q, q); cup(ctx, 0, 0, t, true); ctx.restore(); ctx.save(); ctx.translate(dx - 120, dTop - 6); ctx.scale(q * .85, q * .85); cup(ctx, 0, 0, t + 1, true); ctx.restore(); }
        // found file
        if (t > tFi){ const k = t - tFi, up = eBack(clamp(k / .5, 0, 1)); glowAt(ctx, dx + 170, dTop - 200 - 120 * up, 200, "#F6C343", .6 * up); folderObj(ctx, dx + 170, dTop - 130 - 160 * up, "FILE", 0, 1 + .05 * Math.sin(t * 6)); burstFx(ctx, dx + 170, dTop - 280, k - .2, GOLD, 12, 170); } },
      front: (ctx) => {
        // cable vines wrapping the desk legs and snaking on the floor
        if (t > tCa){ const q = rq(t, tCa, 1.0); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 12; ctx.lineCap = "round";
          for (let n = 0; n < 3; n++){ ctx.beginPath(); const x0 = dx - 300 + n * 260; ctx.moveTo(x0, GROUND - 10); for (let k = 0; k < 14 * q; k++){ ctx.lineTo(x0 + Math.sin(k * .9 + t * 2 + n) * 46, GROUND - 10 - k * 24); } ctx.stroke();
            ctx.fillStyle = "#2C2433"; const ty = GROUND - 10 - 14 * q * 24; ctx.fillRect(x0 - 12 + Math.sin(14 * q * .9 + t * 2 + n) * 46, ty - 20, 24, 26); } }
        // hanging vines from the top (world)
        for (let k = 0; k < 6; k++){ const vx = -80 + k * 230 + (k % 2) * 60, L = (380 + rnd(k + 20) * 380) * g, sw = Math.sin(t * 1.2 + k) * 24; if (L <= 4) continue;
          ctx.strokeStyle = "#2F7A3E"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(vx, 200); ctx.quadraticCurveTo(vx + sw, 200 + L * .5, vx + sw * 1.6, 200 + L); ctx.stroke();
          for (let n = 1; n < 5; n++){ const q = n / 5; if (q * L < 40) continue; const lx = vx + sw * 1.6 * q * q, ly = 200 + L * q; ctx.save(); ctx.translate(lx, ly); ctx.rotate((n % 2 ? .7 : -.7) + sw * .01); ctx.fillStyle = n % 2 ? "#4FA05A" : "#3E8A4A"; ctx.beginPath(); ctx.ellipse(n % 2 ? 26 : -26, 0, 32, 14, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
        // foreground ferns
        [[-40, 1], [1120, -1]].forEach(([fx, d], n) => { ctx.save(); ctx.translate(fx, GROUND + 40); ctx.scale(d * g, g); for (let k = 0; k < 6; k++){ ctx.save(); ctx.rotate(-1.4 + k * .28 + Math.sin(t * 1.5 + k + n) * .04); ctx.fillStyle = k % 2 ? "#2F7A3E" : "#3E8A4A"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(160, -60, 360, 0); ctx.quadraticCurveTo(160, 40, 0, 0); ctx.fill(); ctx.restore(); } ctx.restore(); }); } });
  }, (s, f, i, add) => { const o = f.jungle || {}; if (o.growCue) add(T(s, o.growCue, .2, i), "whoosh"); ["cableCue", "paperCue", "cupCue"].forEach(k => { if (o[k]) add(T(s, o[k], .3, i), "pop"); }); if (o.fileCue) add(T(s, o.fileCue, .4, i), "chime"); });

  /* ================= reset: evening 5-minute tidy-up ================= */
  reg("reset", "Cerita: reset meja lima menit", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.reset || {}, dx = o.x ?? 660, dTop = 1250, st = o.steps || {};
    const tCup = T(s, st.cup, .3, i), tPap = T(s, st.paper, .3, i), tCab = T(s, st.cable, .3, i), tFil = T(s, st.file, .3, i), tNote = T(s, st.note, .4, i), tTim = T(s, o.timerCue, .1, i);
    const fly = (T0, d) => clamp((t - T0) / (d || .7), 0, 1);
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: false, plantX: -200 },
      spots: { desk: [dx, dTop - 120, 1.12] },
      back: (ctx) => {
        // pantry sign on the wall
        ctx.save(); ctx.translate(dx + 170, 880); ctx.rotate(Math.sin(t * 1.4) * .02); ctx.fillStyle = TEAL; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-110, -40); ctx.lineTo(80, -40); ctx.lineTo(120, 0); ctx.lineTo(80, 40); ctx.lineTo(-110, 40); ctx.closePath(); ctx.fill(); ctx.stroke(); textC(ctx, "PANTRI", -10, 14, 36, "#FFFFFF", 900); ctx.restore();
        deskTop(ctx, dx, dTop, 620);
        const nq = t > tNote ? popQ(t, tNote + .5, .4) : 0; laptop(ctx, dx - 40, dTop - 6, t, nq > 0 ? { s: nq } : null, 1);
        tray(ctx, dx + 220, dTop - 6, Math.round(fly(tPap, .9) * 8));
        // papers: messy pile flies into the tray
        const pq = fly(tPap, .9); if (pq < 1) for (let k = 0; k < 8; k++){ const qq = clamp(pq * 1.6 - k * .08, 0, 1), sx = dx - 230 + Math.sin(k) * 20, sy = dTop - 16 - k * 14, ex = dx + 220, ey = dTop - 20 - k * 13;
          if (qq >= 1) continue; ctx.save(); ctx.translate(lerp(sx, ex, easeIO(qq)), lerp(sy, ey, easeIO(qq)) - Math.sin(qq * Math.PI) * 180); ctx.rotate((rnd(k) - .5) * (1 - qq) + qq * 6.28); ctx.fillStyle = PAPER; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.fillRect(-70, -8, 140, 16); ctx.strokeRect(-70, -8, 140, 16); ctx.restore(); }
        cableMess(ctx, dx + 90, dTop - 6, t, easeIO(fly(tCab, .8)));
        // folder for the file
        const fq = fly(tFil, .8); folderObj(ctx, dx - 250, dTop - 6, "PROYEK", fq > 0 && fq < 1 ? Math.sin(fq * Math.PI) : 0, .9);
        if (fq < 1){ const x = lerp(dx + 20, dx - 250, easeIO(fq)), y = lerp(dTop - 220, dTop - 60, easeIO(fq)) - Math.sin(fq * Math.PI) * 200; ctx.save(); ctx.translate(x, y); ctx.scale(1 - fq * .5, 1 - fq * .5); ctx.rotate(fq * 3);
          ctx.fillStyle = PAPER; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -50, -64, 100, 128, 8); ctx.fill(); ctx.stroke(); ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 4; k++) ctx.fillRect(-34, -44 + k * 24, 60, 8); ctx.restore(); }
        if (fq >= 1) burstFx(ctx, dx - 250, dTop - 80, t - tFil - .8, GOLD, 8, 100);
        // cup flies away to the pantry
        const cq = fly(tCup, .9); if (cq < 1){ const x = lerp(dx + 110, dx + 200, easeIO(cq)), y = lerp(dTop - 6, 900, easeIO(cq)) - Math.sin(cq * Math.PI) * 220; ctx.save(); ctx.translate(x, y); ctx.rotate(cq * 2); ctx.scale(1 - cq * .6, 1 - cq * .6); cup(ctx, 0, 0, t, cq === 0); ctx.restore(); }
        else burstFx(ctx, dx + 180, 880, t - tCup - .9, HL, 8, 90);
        // speed lines on each move
        [tCup, tPap, tCab, tFil].forEach(T0 => { const k = t - T0; if (k > 0 && k < .5){ ctx.save(); ctx.globalAlpha = 1 - k / .5; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; for (let n = 0; n < 4; n++){ ctx.beginPath(); ctx.moveTo(dx - 200 + n * 130, dTop - 300 - n * 30); ctx.lineTo(dx - 140 + n * 130, dTop - 330 - n * 30); ctx.stroke(); } ctx.restore(); } }); },
      over: (ctx, c, sts, R) => {
        if (t > tTim){ const k = t - tTim, q = popQ(t, tTim, .4), x = 900, y = 330, done = clamp((t - tTim) / Math.max(1, tNote + 1 - tTim), 0, 1); ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
          ctx.beginPath(); ctx.arc(0, 0, 96, 0, TAU); ctx.fillStyle = "#13223D"; ctx.fill(); ctx.strokeStyle = "#2E4670"; ctx.lineWidth = 8; ctx.stroke();
          ctx.strokeStyle = HL; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 0, 76, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - done)); ctx.stroke();
          textC(ctx, String(Math.max(0, Math.ceil(5 * (1 - done)))), 0, 14, 64, "#FFFFFF", 900); textC(ctx, "MENIT", 0, 56, 22, "#A9BCDD", 800); ctx.restore(); }
        if (t > tNote){ const k = t - tNote, p = c.toScreen(dx - 40 + 90, dTop - 160), q = clamp(k / .5, 0, 1), out = clamp((k - 2.2) / .5, 0, 1);
          if (out < 1){ const big = 1 - out; ctx.save(); ctx.translate(lerp(540, p[0], out), lerp(560, p[1], out)); ctx.scale(eBack(q) * (.3 + .7 * big), eBack(q) * (.3 + .7 * big)); ctx.rotate(-.04);
            ctx.fillStyle = "rgba(20,12,8,.3)"; ctx.fillRect(-196, -166, 400, 340); ctx.fillStyle = GOLD; ctx.fillRect(-200, -170, 400, 340); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.strokeRect(-200, -170, 400, 340);
            textC(ctx, "BESOK:", 0, -80, 52, BROWN, 900); const txt = o.noteText || "1. Presentasi", n = Math.ceil(txt.length * clamp((k - .3) / .9, 0, 1)); font(ctx, 800, fitFont(ctx, txt, 340, 56, 800), FAM); ctx.fillStyle = ORANGE; ctx.textAlign = "center"; ctx.fillText(txt.slice(0, n), 0, 30); ctx.textAlign = "left";
            ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-150, 70); ctx.lineTo(150, 70); ctx.stroke(); ctx.restore(); } } } });
  }, (s, f, i, add) => { const o = f.reset || {}, st = o.steps || {}; ["cup", "paper", "cable", "file"].forEach(k => { if (st[k]) add(T(s, st[k], .3, i), "whoosh"); }); if (st.file) add(T(s, st.file, .3, i) + .8, "pop"); if (st.note){ add(T(s, st.note, .4, i), "pop"); add(T(s, st.note, .4, i) + 2.3, "chime"); } if (o.timerCue) add(T(s, o.timerCue, .1, i), "ping"); });

  /* ================= pagi: next morning at the tidy desk ================= */
  reg("pagi", "Cerita: pagi di meja rapi", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.pagi || {}, dx = o.x ?? 680, dTop = 1250, tN = T(s, o.noteCue, .3, i), tW = T(s, o.workCue, .3, i), tB = T(s, o.boomCue, .5, i);
    base(ctx, s, t, { env: "office", envOpt: { time: "day", desk: false, plantX: 1010 },
      spots: { desk: [dx, dTop - 120, 1.12] },
      back: (ctx) => {
        // morning sun beams
        ctx.save(); ctx.globalAlpha = .35 + .1 * Math.sin(t * 1.5); for (let k = 0; k < 4; k++){ ctx.fillStyle = "rgba(255,230,170,.5)"; ctx.beginPath(); ctx.moveTo(150 + k * 120, 360); ctx.lineTo(230 + k * 120, 360); ctx.lineTo(760 + k * 200, GROUND); ctx.lineTo(560 + k * 200, GROUND); ctx.closePath(); ctx.fill(); } ctx.restore();
        for (let k = 0; k < 14; k++){ const x = 300 + rnd(k) * 700, y = 500 + ((t * 30 + rnd(k + 9) * 900) % 900); ctx.fillStyle = hexA("#FFF4E6", .6); ctx.beginPath(); ctx.arc(x + Math.sin(t + k) * 20, y, 3 + rnd(k + 2) * 3, 0, TAU); ctx.fill(); }
        deskTop(ctx, dx, dTop, 620); tray(ctx, dx + 220, dTop - 6, 8); cableMess(ctx, dx + 90, dTop - 6, t, 1); folderObj(ctx, dx - 250, dTop - 6, "PROYEK", 0, .9);
        const nq = t > tN ? 0 : 1; laptop(ctx, dx - 40, dTop - 6, t, nq ? { s: 1 } : null, t > tW ? 1 + .3 * Math.sin(t * 8) : .6);
        if (t > tW){ for (let k = 0; k < 6; k++){ const q = ((t - tW) * 1.5 + k / 6) % 1; ctx.save(); ctx.globalAlpha = 1 - q; sparkle(ctx, dx - 40 + (rnd(k) - .5) * 220, dTop - 120 - q * 260, 14, k % 2 ? GOLD : HL); ctx.restore(); } } },
      over: (ctx, c, sts, R) => {
        if (t > tN){ const k = t - tN, p = c.toScreen(dx + 50, dTop - 160), q = clamp(k / .45, 0, 1), out = clamp((k - 1.8) / .45, 0, 1);
          if (out < 1){ ctx.save(); ctx.translate(lerp(p[0], 540, eOut(q)) * (1 - out) + p[0] * out, lerp(p[1], 560, eOut(q)) * (1 - out) + (560 - 400) * out); const sc = lerp(.25, 1, eOut(q)) * (1 - out * .8); ctx.scale(sc, sc); ctx.rotate(.04 - out * .5); ctx.globalAlpha = 1 - out;
            ctx.fillStyle = GOLD; ctx.fillRect(-200, -170, 400, 340); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.strokeRect(-200, -170, 400, 340); textC(ctx, "BESOK:", 0, -80, 52, BROWN, 900); textC(ctx, o.noteText || "1. Presentasi", 0, 30, 56, ORANGE, 800, 340); ctx.restore(); } }
        if (t > tW){ const k = t - tW, q = popQ(t, tW, .4), p = clamp(k / 2.2, 0, 1); ctx.save(); ctx.translate(540, 300); ctx.scale(q, q); rr(ctx, -330, -60, 660, 120, 30); ctx.fillStyle = "#13223D"; ctx.fill(); ctx.strokeStyle = "#2E4670"; ctx.lineWidth = 6; ctx.stroke();
          font(ctx, 800, 34, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText(o.barLabel || "PRESENTASI", -300, -10); rr(ctx, -300, 12, 600, 30, 15); ctx.fillStyle = "#2E4670"; ctx.fill(); rr(ctx, -300, 12, 600 * p, 30, 15); ctx.fillStyle = HL; ctx.fill();
          font(ctx, 900, 34, FAM); ctx.fillStyle = HL; ctx.textAlign = "right"; ctx.fillText(Math.round(p * 100) + "%", 300, -10); ctx.textAlign = "left"; ctx.restore(); if (p >= 1) burstFx(ctx, 540, 300, k - 2.2, GOLD, 12, 260); }
        if (t > tB) stampBox(ctx, o.boomText || "SIAP KERJA", 540, 520, t - tB, GREEN, 70, -.08); } });
  }, (s, f, i, add) => { const o = f.pagi || {}; if (o.noteCue) add(T(s, o.noteCue, .3, i), "whoosh"); if (o.workCue){ add(T(s, o.workCue, .3, i), "pop"); add(T(s, o.workCue, .3, i) + 2.2, "chime"); } if (o.boomCue) add(T(s, o.boomCue, .5, i), "pop"); });

  /* ================= gawang: invisible goal vs clear goal ================= */
  function ball(ctx, x, y, r, rot, label){ ctx.save(); ctx.translate(x, y); ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.save(); ctx.rotate(rot); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = OUT; ctx.beginPath(); for (let k = 0; k < 5; k++){ const a = k / 5 * TAU - Math.PI / 2; ctx.lineTo(Math.cos(a) * r * .38, Math.sin(a) * r * .38); } ctx.closePath(); ctx.fill();
    for (let k = 0; k < 5; k++){ const a = k / 5 * TAU - Math.PI / 2; ctx.beginPath(); ctx.arc(Math.cos(a) * r * .86, Math.sin(a) * r * .86, r * .2, 0, TAU); ctx.fill(); } ctx.restore();
    if (label){ font(ctx, 800, 38, FAM); const w = ctx.measureText(label).width + 30; rr(ctx, -w / 2, -r - 70, w, 56, 14); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); textC(ctx, label, 0, -r - 28, 38, "#FFFFFF", 800); }
    ctx.restore(); }
  function goalFrame(ctx, x, w, h, o){ // o: {alpha, dashed, draw (0..1), net, bulge, flags:[..], t}
    const y0 = GROUND, top = y0 - h; ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (o.net){ ctx.save(); ctx.globalAlpha *= o.net; ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 3; const b = o.bulge || 0;
      for (let k = 0; k <= 10; k++){ const xx = x - w / 2 + k / 10 * w; ctx.beginPath(); ctx.moveTo(xx, top); ctx.quadraticCurveTo(xx + b * 40 * Math.sin(k / 10 * Math.PI), top + h / 2, xx, y0); ctx.stroke(); }
      for (let k = 0; k <= 8; k++){ const yy = top + k / 8 * h; ctx.beginPath(); ctx.moveTo(x - w / 2, yy); ctx.quadraticCurveTo(x + b * 60 * Math.sin(k / 8 * Math.PI), yy + b * 30, x + w / 2, yy); ctx.stroke(); } ctx.restore(); }
    const path = [[x - w / 2, y0], [x - w / 2, top], [x + w / 2, top], [x + w / 2, y0]], L = h * 2 + w, d = (o.draw ?? 1) * L;
    if (o.dashed) ctx.setLineDash([30, 26]);
    [[OUT, 26], [o.dashed ? "#FFFFFF" : "#FFFFFF", 16]].forEach(([col, lw]) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); let rem = d; ctx.moveTo(path[0][0], path[0][1]);
      for (let k = 1; k < 4 && rem > 0; k++){ const [ax, ay] = path[k - 1], [bx, by] = path[k], seg = Math.hypot(bx - ax, by - ay), q = Math.min(1, rem / seg); ctx.lineTo(lerp(ax, bx, q), lerp(ay, by, q)); rem -= seg; } ctx.stroke(); });
    ctx.setLineDash([]);
    (o.flags || []).forEach((fl, k) => { const q = fl.q || 0; if (q <= 0) return; const fx = x - w / 2 + (k + .5) / (o.flags.length) * w; ctx.save(); ctx.translate(fx, top); ctx.scale(q, q); ctx.rotate(Math.sin((o.t || 0) * 3 + k) * .05);
      font(ctx, 800, 34, FAM); const tw = Math.max(130, ctx.measureText(fl.text).width + 26); ctx.fillStyle = k % 2 ? TEAL : ORANGE; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-tw / 2, 10); ctx.lineTo(tw / 2, 10); ctx.lineTo(tw / 2, 60); ctx.lineTo(0, 84); ctx.lineTo(-tw / 2, 60); ctx.closePath(); ctx.fill(); ctx.stroke();
      textC(ctx, fl.text, 0, 48, 34, "#FFFFFF", 800, tw - 14); ctx.restore(); });
    ctx.restore(); }
  reg("gawang", "Cerita: gawang tak terlihat / gawang jelas", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.goal || {}, mode = o.mode || "gaib", kickerI = o.kicker ?? 0, gw = o.w ?? 460, gh = o.h ?? 600;
    const kicks = (o.kicks || []).map((k, j) => ({ T: T(s, k.cue, .2, i), label: k.label, gx: k.gx ?? (o.x ?? 840) })).sort((a, b) => a.T - b.T);
    const tGh = T(s, o.ghostCue, .4, i), tDraw = T(s, o.drawCue, .2, i), tGol = T(s, o.golCue, .3, i), revs = (o.revCues || []).map((c, j) => T(s, c, .3 + j * .1, i)), nRev = revs.filter(x => t >= x).length;
    let gx = o.x ?? 840; if (mode === "gaib"){ const ks = kicks.filter(k => t > k.T + .35); if (ks.length) gx = ks[ks.length - 1].gx; }
    base(ctx, s, t, { env: "park", envOpt: { time: "day", treeX: -300 }, front: false,
      spots: { goal: [gx, GROUND - gh / 2 - 60, 1.05] },
      back: (ctx, c, sts) => {
        // field lines
        ctx.strokeStyle = hexA("#FFFFFF", .55); ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(gx - 40, GROUND + 30, 520, 60, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
        if (mode === "gaib"){ const shimmer = t > tGh ? popQ(t, tGh, .5) * (.45 + .25 * Math.sin(t * 9)) : 0; if (shimmer > 0) goalFrame(ctx, gx + Math.sin(t * 2.2) * 40, gw, gh, { alpha: shimmer, dashed: true }); }
        else { const d = clamp((t - tDraw) / 1.1, 0, 1), bul = t > tGol ? Math.max(0, Math.sin(clamp((t - tGol) / .8, 0, 1) * Math.PI)) * (1 - clamp((t - tGol - .8) / 1, 0, 1)) : 0;
          goalFrame(ctx, gx, gw, gh, { draw: d, net: clamp((t - tDraw - 1.0) / .5, 0, 1), bulge: bul, t, flags: (o.flags || []).map((tx, k) => ({ text: tx, q: popQ(t, tDraw + 1.2 + k * .35, .4) })) });
          if (d > 0 && d < 1){ const L = gh * 2 + gw, dd = d * L; let px, py; if (dd < gh){ px = gx - gw / 2; py = GROUND - dd; } else if (dd < gh + gw){ px = gx - gw / 2 + dd - gh; py = GROUND - gh; } else { px = gx + gw / 2; py = GROUND - gh + (dd - gh - gw); }
            sparkle(ctx, px, py, 26, GOLD); dust(ctx, px, py, (t * 3) % .8, 6, "#FFFFFF", 60); } }
        // balls
        const st = sts[kickerI]; const foot = st ? [st.x + 70 * (st.face || 1), GROUND - 34] : [360, GROUND - 34];
        kicks.forEach((k, j) => { const kk = t - k.T; if (kk < -0.6) return; const nextT = kicks[j + 1] ? kicks[j + 1].T : 1e9; if (t > nextT - .6) return;
          if (kk < 0){ const q = popQ(t, k.T - .6, .3); ball(ctx, foot[0] + 40, foot[1] - 10, 46 * q, 0, null); return; }
          const fl = Math.min(1, kk / .75), tx = mode === "gaib" ? k.gx + (j % 2 ? 1 : -1) * 20 : gx, ty = GROUND - gh * .55;
          let x, y, rot = kk * 14;
          if (mode === "gaib"){ if (fl < 1){ x = lerp(foot[0] + 40, tx, fl); y = lerp(foot[1], ty, fl) - Math.sin(fl * Math.PI) * 260; } else { const r2 = kk - .75; x = tx + r2 * 420; y = ty + Math.min(1, r2 * 1.8) * (GROUND - 34 - ty) - Math.abs(Math.sin(r2 * 7)) * 120 * Math.max(0, 1 - r2); } }
          else { if (fl < 1){ x = lerp(foot[0] + 40, tx, fl); y = lerp(foot[1], ty, fl) - Math.sin(fl * Math.PI) * 220; } else { x = tx + 20; y = ty + Math.min(1, (kk - .75) * 2) * (GROUND - 34 - ty); rot = 0; } }
          for (let n = 1; n < 5 && fl < 1; n++){ ctx.save(); ctx.globalAlpha = .25 * (1 - n / 5); ctx.beginPath(); ctx.arc(x - n * 30, y + n * 8, 46, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore(); }
          ball(ctx, x, y, 46, rot, fl < 1 || mode === "gaib" ? k.label : null);
          if (mode === "gaib" && fl >= 1 && kk < 1.6){ ctx.save(); const q = popQ(kk, .75, .3); ctx.translate(tx, ty - 120); ctx.scale(q, q); outlineWords(ctx, [{ w: "?", hl: true }], 0, 0, 120, { sw: 22 }); ctx.restore(); } }); },
      over: (ctx, c, sts) => {
        if (nRev){ const k = t - revs[nRev - 1]; stampBox(ctx, "REVISI " + nRev, 760, 330, k > .5 ? 1 : k, RED, 64, -.1); }
        if (mode === "jelas" && t > tGol){ bigWord(ctx, [{ w: "GOL!", hl: true }], 540, 400, 170, t - tGol); }
        if (mode === "jelas" && o.zeroCue){ const tz = T(s, o.zeroCue, .3, i); if (t > tz) stampBox(ctx, "REVISI 0", 400, 560, t - tz, GREEN, 60, .06); } } });
  }, (s, f, i, add) => { const o = f.goal || {}; (o.kicks || []).forEach(k => { const T0 = T(s, k.cue, .2, i); add(T0, "whoosh"); if ((o.mode || "gaib") === "gaib") add(T0 + .8, "ping"); }); (o.revCues || []).forEach((c, j) => add(T(s, c, .3 + j * .1, i), "pop"));
    if (o.drawCue) add(T(s, o.drawCue, .2, i), "whoosh"); if (o.golCue){ add(T(s, o.golCue, .3, i), "pop"); add(T(s, o.golCue, .3, i) + .1, "chime"); } if (o.zeroCue) add(T(s, o.zeroCue, .3, i), "pop"); });

  /* ================= bayang: hologram of the expected result ================= */
  reg("bayang", "Cerita: hologram hasil yang diharapkan", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.holo || {}, be = o.beda || {}, tA = T(s, be.cueA, .3, i), tB = T(s, be.cueB, .3, i), tOn = T(s, o.onCue, .2, i), items = o.items || [];
    const px = o.x ?? 560, pTop = 1250, hx = px, hy = o.y ?? 640, HW = 620, HH = 500;
    base(ctx, s, t, { env: "office", envOpt: { time: "day", desk: false, plantX: 1010 },
      spots: { holo: [hx, hy + 150, 1.0] },
      back: (ctx) => { deskTop(ctx, px, pTop, 560);
        // projector puck
        ctx.save(); ctx.translate(px, pTop - 6); ctx.fillStyle = "#3A4250"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -90, -44, 180, 44, 18); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, -44, 60, 14, 0, 0, TAU); ctx.fillStyle = t > tOn ? "#F6C343" : "#8A93A0"; ctx.fill(); ctx.stroke(); ctx.restore();
        if (t > tOn){ const q = rq(t, tOn, .6); ctx.save(); ctx.globalAlpha = .28 * q; ctx.fillStyle = "#F6C343"; ctx.beginPath(); ctx.moveTo(px - 60, pTop - 50); ctx.lineTo(px + 60, pTop - 50); ctx.lineTo(hx + HW / 2, hy + HH / 2); ctx.lineTo(hx - HW / 2, hy + HH / 2); ctx.closePath(); ctx.fill(); ctx.restore(); } },
      over: (ctx, c, sts, R) => {
        // two different "BERES" tags
        const off = clamp((t - tOn) / .4, 0, 1);
        [[0, tA, "1 halaman", "file"], [1, tB, "warna-warni", "sparkles"]].forEach(([j, T0, sub, ic]) => { const r = R[j]; if (!r || t < T0 || off >= 1) return; const hs = r.screen.top, q = popQ(t, T0, .4) * (1 - off);
          ctx.save(); ctx.translate(hs[0], hs[1] - 120 + Math.sin(t * 3 + j) * 6); ctx.scale(q, q); ctx.rotate(j ? .05 : -.05); rr(ctx, -190, -86, 380, 172, 30); ctx.fillStyle = j ? TEAL : ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
          textC(ctx, "BERES", 0, -8, 66, "#FFFFFF", 900); textC(ctx, sub, 0, 54, 40, CREAM, 800, 340); ctx.restore(); });
        if (t > tB && off < 1){ const q = popQ(t, tB + .4, .4) * (1 - off); ctx.save(); ctx.translate(540, 760); ctx.scale(q, q); outlineWords(ctx, [{ w: "≠", hl: true }], 0, 0, 160, { sw: 26 }); ctx.restore(); }
        if (t < tOn) return; const p = c.toScreen(hx, hy), zs = c.scale(1), q = rq(t, tOn, .6), fl = .85 + .15 * Math.sin(t * 13) * (q < 1 ? 1 : .3);
        ctx.save(); ctx.translate(p[0], p[1] + Math.sin(t * 1.5) * 6); ctx.scale(zs, zs * q); ctx.globalAlpha = fl;
        glowAt(ctx, 0, 0, 380, "#F6C343", .25); rr(ctx, -HW / 2, -HH / 2, HW, HH, 24); ctx.fillStyle = "rgba(40,26,18,.72)"; ctx.fill(); ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.stroke(); ctx.setLineDash([]);
        for (let y = -HH / 2 + 10; y < HH / 2; y += 14){ ctx.fillStyle = "rgba(255,240,200,.08)"; ctx.fillRect(-HW / 2 + 6, y + ((t * 40) % 14), HW - 12, 3); }
        textC(ctx, "HASIL BERES", 0, -HH / 2 + 62, 50, "#FFE9B8", 900);
        items.forEach((it, j) => { const T0 = T(s, it.cue, .2, i), yy = -HH / 2 + 150 + j * 116; const a = popQ(t, T0, .4); ctx.save(); ctx.translate(0, yy);
          rr(ctx, -HW / 2 + 28, -48, HW - 56, 96, 20); ctx.fillStyle = a > 0 ? "rgba(255,244,230,.92)" : "rgba(255,228,160,.15)"; ctx.fill(); ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 4; ctx.stroke();
          if (a > 0){ ctx.save(); ctx.scale(a, a); ctx.beginPath(); ctx.arc(-HW / 2 + 84, 0, 34, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); icon(ctx, "check", -HW / 2 + 84 - 22, -22, 44, "#FFFFFF", 3); ctx.restore();
            const sz = fitFont(ctx, it.text, HW - 180, 46, 800); font(ctx, 800, sz, FAM); ctx.fillStyle = BROWN; ctx.fillText(it.text, -HW / 2 + 136, 16); }
          ctx.restore(); burstFx(ctx, p[0] - HW / 2 * zs + 84 * zs, p[1] + yy * zs, t - T0 - .2, GOLD, 8, 80); });
        ctx.restore(); } });
  }, (s, f, i, add) => { const o = f.holo || {}, be = o.beda || {}; if (be.cueA) add(T(s, be.cueA, .3, i), "pop"); if (be.cueB){ add(T(s, be.cueB, .3, i), "pop"); add(T(s, be.cueB, .3, i) + .4, "ping"); } if (o.onCue) add(T(s, o.onCue, .2, i), "whoosh"); (o.items || []).forEach(it => add(T(s, it.cue, .2, i), "chime")); });
})();
