/* Scene pack j2611221020121: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for MS26, SB27, SP27, RN27, KD27.
   Layout prefix j2611221020121_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras (handled by base()):
     hold    [{on, kind: book|can|whistle|phone, at|cue, outCue}]      an object in a toon's hands (can pours water drops)
     glow    [{on, at|cue, outCue, col}]                                 cold screen light on a toon's face
     floaters [{on, at|cue, outCue, items:[play|news|chat|heart|bell]}] content icons stream up out of a toon's phone
     confetti {at|cue}                                                   paper confetti burst
   Set pieces:
     ..._adegan   story shot with the extras only
     ..._tali     a phone-puppeteer on a wooden cross hangs above a toon; notification tugs jerk the strings; strings snap and the
                  phone tumbles into a basket by the door                 f.puppet {on, lenUp, tugs:[{cue, part}], snap:{cue}, basket:{x}}
     ..._globe    giant snow globe = the mind: notification flakes swirl, shaking makes it murky, then they settle and it clears
                  f.globe {x, y, r, shakes:[{cue}], settle:{cue}, clear:{cue}}
     ..._roller   roller coaster "MOTIVASI": day flags along the track, the cart crests and plunges, the book flies out
                  f.ride {keys:[{at|cue, u, dur, ease}], flags:[{u, label}], rider (actor), bookOut:{cue}}
     ..._lomba    race: a hopping rabbit (MOTIVASI, wave trail) dashes off and falls asleep; a tortoise (KEBIASAAN, straight trail)
                  keeps walking and passes it          f.race {rabbit:{hopUntil:{cue}, dash:{cue}, sleep:{cue}, sleepX}, turtle:{x0, speed}, pass:{cue}}
     ..._xray     courier scooter with a parcel bumps along; x-ray inset shows the glass cracking; photo card + an idea locked in a head
                  f.ride {x0, x1, t0, out:{cue}, bumps:[{cue}], crack:{cue}}, f.photo {cue, outCue}, f.idea {on, cue, text}
     ..._cetak    the SOP as a mould: a clay block "SOP" drops in, the expert's best parcel is pressed into it (glowing imprint),
                  then the mould prints identical parcels that fly to the others + checks   f.mould {x, y, drop, from, press, to:[idx], print, check}
     ..._kemas    packing table: bubble wrap, filler, fragile sticker, X tape, step chips, UTUH stamp
                  f.pack {x, steps:[{cue, kind: wrap|fill|label|tape, text}], done:{cue}}
     ..._tunjuk   "I thought you did it": curved arrows head to head form a spinning loop; an angry phone rings; a dusty untouched envelope
                  f.loop {pairs:[{from, to, cue}], spin:{cue}, phone:{cue, x, y}, env:{cue, label}}
     ..._voli     volleyball: task balls fly in arcs, either drop in the gap between players (BUK!) or get caught by the named owner
                  f.net {x}, f.balls [{cue, from:[x,y]|idx, to:[x,y]|idx, label, tag, dur, peak}]
     ..._sel      one spreadsheet cell crammed with three things, date creatures in three formats, a formula block that refuses
                  f.cell {x, y, items:[{cue, text}], label}, f.dates [{cue, text, x}], f.formula {in:{cue}, no:{cue}, x}
     ..._barisan  data parade: sign-holding data people run from chaos into a formation (row = one data, column = one kind);
                  row / column highlights; a formula block sums the JUMLAH column into a total banner
                  f.form {cols:[{label, col}], rows:[[..]], mode: rapi|hitung, gather:{cue}, row:{cue}, col:{cue}, hl:[{cue, c}], sum:{cue, c}, total:{cue, text}}
   Camera keys may use on:"<spot>" for named spots of the set piece. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, drawToon, prop, infoCard, titleStamp, bubble, layer, G, TAU, star } = TT;
  const easeIO = TT.easeIO || (x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const PX = "j2611221020121_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", BLUE = "#5B7DB1", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const eIn = x => x * x * x;
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ico = (ctx, name, cx, cy, size, col, lw) => icon(ctx, name, cx - size / 2, cy - size / 2, size, col, lw || 2.4);
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 16)) return size; size -= 2; } }
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
  function textC(ctx, txt, x, y, size, col, weight){ font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function textO(ctx, txt, x, y, size, fill, sw){ font(ctx, 900, size, FAM); ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = sw || size * .22; ctx.strokeText(txt, x, y); ctx.fillStyle = fill; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  // pill chip with text (screen or world), centred at x,y
  function chip(ctx, txt, x, y, size, bg, fg, rot){ font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); return w; }
  // toon-local point (units of size/92, y up negative from the feet) -> world
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const headOf = st => { const h = toonHead(st); return [h[0], h[1], st.size * 20.5 / 92]; };
  function confettiFx(ctx, x, y, k, n){ if (k < 0 || k > 2.6) return; n = n || 40; const cols = [ORANGE, GOLD, "#F7B7A3", "#9FD3E8", "#BFE3B4", CREAM];
    ctx.save(); ctx.globalAlpha *= clamp((2.6 - k) / .6, 0, 1); for (let i = 0; i < n; i++){ const a = -Math.PI / 2 + (rnd(i) - .5) * 2.6, v = 700 + rnd(i + 9) * 700, px = x + Math.cos(a) * v * k * .8 + Math.sin(k * 6 + i) * 20, py = y + Math.sin(a) * v * k + 900 * k * k;
      ctx.save(); ctx.translate(px, py); ctx.rotate(k * (4 + rnd(i) * 6) + i); ctx.scale(1, Math.cos(k * 9 + i)); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); }
    ctx.restore(); }

  /* ---------- small objects ---------- */
  function bookShape(ctx, w, h, col, title){ rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = col || ORANGE; ctx.fill(); ol(ctx, 5); ctx.fillStyle = PAPER; ctx.fillRect(w / 2 - 8, -h / 2 + 6, 6, h - 12);
    ctx.fillStyle = hexA(CREAM, .85); ctx.fillRect(-w / 2 + 10, -h / 2 + 14, w - 30, 8); ctx.fillRect(-w / 2 + 10, -h / 2 + 28, (w - 30) * .6, 6); if (title){ textC(ctx, title, -4, h * .2, Math.min(28, h * .32), CREAM, 900); } }
  function canShape(ctx, k, tilt){ ctx.save(); ctx.rotate(tilt); rr(ctx, -40, -40, 80, 70, 14); ctx.fillStyle = "#7FA563"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(36, -20); ctx.lineTo(92, -54); ctx.lineTo(98, -44); ctx.lineTo(40, -2); ctx.closePath(); ctx.fillStyle = "#6C9455"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(98, -50, 10, 14, -.6, 0, TAU); ctx.fillStyle = "#6C9455"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(-38, -14, 22, Math.PI * .5, Math.PI * 1.5); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); ctx.restore(); }
  function whistleShape(ctx){ rr(ctx, -26, -14, 44, 28, 12); ctx.fillStyle = "#E8B23A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-6, 0, 6, 0, TAU); ctx.fill(); }
  function phoneSmall(ctx, w, h, lit, badge){ rr(ctx, -w / 2, -h / 2, w, h, w * .18); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -w / 2 + 7, -h / 2 + 10, w - 14, h - 20, w * .1); ctx.fillStyle = lit ? "#BFE2EA" : "#2C2A33"; ctx.fill();
    if (lit){ ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 3; k++) ctx.fillRect(-w / 2 + 16, -h / 2 + 22 + k * h * .2, (w - 32) * (.5 + .5 * rnd(k + w)), h * .08); }
    if (badge){ ctx.beginPath(); ctx.arc(w / 2 - 2, -h / 2 + 2, 22, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, String(badge), w / 2 - 2, -h / 2 + 12, 26, "#FFFFFF", 900); } }
  const FL_IC = { play: "#E0503A", news: "#5B7DB1", chat: "#3E9B5A", heart: "#E06A8A", bell: "#E8B23A" };
  function contentIcon(ctx, kind, s){ ctx.save(); ctx.scale(s, s); rr(ctx, -34, -34, 68, 68, 18); ctx.fillStyle = FL_IC[kind] || ORANGE; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFFFFF";
    if (kind === "play"){ ctx.beginPath(); ctx.moveTo(-10, -16); ctx.lineTo(16, 0); ctx.lineTo(-10, 16); ctx.closePath(); ctx.fill(); }
    else if (kind === "news"){ ctx.fillRect(-18, -16, 36, 8); ctx.fillRect(-18, -2, 24, 6); ctx.fillRect(-18, 10, 30, 6); }
    else if (kind === "chat"){ rr(ctx, -18, -14, 36, 24, 8); ctx.fill(); ctx.beginPath(); ctx.moveTo(-8, 8); ctx.lineTo(-14, 18); ctx.lineTo(2, 9); ctx.fill(); }
    else if (kind === "heart"){ ctx.beginPath(); ctx.moveTo(0, 16); ctx.bezierCurveTo(-26, -2, -12, -24, 0, -8); ctx.bezierCurveTo(12, -24, 26, -2, 0, 16); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-14, 10); ctx.quadraticCurveTo(-14, -16, 0, -16); ctx.quadraticCurveTo(14, -16, 14, 10); ctx.closePath(); ctx.fill(); ctx.fillRect(-18, 8, 36, 5); ctx.beginPath(); ctx.arc(0, 16, 4, 0, TAU); ctx.fill(); }
    ctx.restore(); }

  /* ---------- shared extras drawn in world space after the toons ---------- */
  function extras(ctx, c, sts, s, t, f, idx){
    const span = (o, j) => { const T0 = tOf(s, o, .2 + j * .1, idx), T1 = o.outCue ? cueT(s, o.outCue, .9, idx) : (o.out ?? 1e9); return [T0, T1]; };
    (f.glow || []).forEach((g, j) => { const st = sts[g.on ?? 0]; if (!st) return; const [T0, T1] = span(g, j); if (t < T0 || t > T1 + .4) return;
      const a = clamp((t - T0) / .4, 0, 1) * (1 - clamp((t - T1) / .4, 0, 1)), h = headOf(st), p = lp(st, 16, -44);
      glowAt(ctx, h[0] + 20 * (st.face || 1), h[1] + 40, h[2] * 2.2, g.col || "#9FD3E8", (.35 + .08 * Math.sin(t * 9)) * a); glowAt(ctx, p[0], p[1], h[2] * 1.2, g.col || "#CFEFFF", .55 * a); });
    (f.hold || []).forEach((o, j) => { const st = sts[o.on ?? 0]; if (!st) return; const [T0, T1] = span(Object.assign({ at: 0 }, o), j); if (t < T0 || t > T1) return;
      const q = popQ(t, T0, .35), p = lp(st, o.lx ?? 19, o.ly ?? -46), k = st.size / 760; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(q * k * (st.face || 1), q * k);
      if (o.kind === "book"){ ctx.rotate(-.15 + Math.sin(t * 2) * .03); bookShape(ctx, 150, 110, o.col || "#2F6F73", o.title); }
      else if (o.kind === "can"){ const pour = o.pourCue ? clamp((t - cueT(s, o.pourCue, .5, idx)) / .4, 0, 1) : 1; canShape(ctx, k, pour * .55);
        if (pour > 0) for (let i = 0; i < 9; i++){ const w = (t * 1.6 + i / 9) % 1; ctx.fillStyle = hexA("#7FC8E8", .9 * (1 - w)); ctx.beginPath(); ctx.ellipse(120 + w * 60 + Math.sin(i) * 8, -20 + w * 260, 7, 11, 0, 0, TAU); ctx.fill(); } }
      else if (o.kind === "whistle"){ whistleShape(ctx); }
      else if (o.kind === "phone"){ ctx.rotate(-.2); phoneSmall(ctx, 70, 120, true); }
      ctx.restore(); });
    (f.floaters || []).forEach((o, j) => { const st = sts[o.on ?? 0]; if (!st) return; const [T0, T1] = span(o, j); if (t < T0) return; const items = o.items || ["play", "news", "chat", "heart"];
      const p = lp(st, 18, -46), n = 7, fade = 1 - clamp((t - T1) / .5, 0, 1); if (fade <= 0) return;
      for (let i = 0; i < n; i++){ const per = 2.2, w = ((t - T0) / per + i / n) % 1; if ((t - T0) < i / n * per) continue; const side = i % 2 ? 1 : -1;
        const hh = headOf(st), x = hh[0] + side * (hh[2] * 1.45 + w * 160) + Math.sin(w * 7 + i) * 24, y = p[1] - 20 - w * 700, sc = (.5 + .7 * eOut(Math.min(1, w * 4))) * (st.size / 760) * 1.3;
        ctx.save(); ctx.globalAlpha *= Math.sin(w * Math.PI) * fade; ctx.translate(x, y); ctx.rotate(Math.sin(t * 2 + i) * .2); contentIcon(ctx, items[i % items.length], sc); ctx.restore(); } });
  }
  function extrasOver(ctx, s, t, f, idx){ if (f.confetti){ const k = t - tOf(s, f.confetti, .5, idx); if (k >= 0) confettiFx(ctx, 540, 700, k, 46); } }

  /* ---------- shared base: same data as the generic "cerita" layout + hooks ---------- */
  // H: {env, envOpt, spots:{name:[x,y,zoom]|fn}, prep(a, j) -> {a, t}, back/mid/front(ctx, c, sts, R), midZ, post (screen, before grade), over (screen, after grade)}
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const P = toons.map((a, j) => { const r = H.prep ? H.prep(a, j) : null; return r || { a, t }; });
    const sts = P.map(p => toonState(p.a, s, p.t));
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, H.cam || f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const R = {};
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => { if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R)); R[j] = toon(ctx, c, P[j].a, s, P[j].t, { st: sts[j] }); if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    layer(ctx, c, 1, () => extras(ctx, c, sts, s, t, f, idx));
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    TT.CS.ov.push(() => { extrasOver(ctx, s, t, f, idx); if (H.over) H.over(ctx, c, sts, R); });
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
    (f.floaters || []).forEach((o, j) => add(tOf(s, o, .2 + j * .1, i), "whoosh"));
    (f.hold || []).forEach((o, j) => { if (o.cue) add(tOf(s, o, .2 + j * .1, i), "pop"); });
    if (f.confetti) add(tOf(s, f.confetti, .5, i), "chime");
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= adegan: story shot with extras ================= */
  TT.scene("j2611221020121_adegan", "Cerita: adegan + efek (cahaya layar, ikon konten, benda di tangan)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= tali: phone puppeteer ================= */
  TT.scene("j2611221020121_tali", "Cerita: tali notifikasi (tokoh jadi boneka ponsel)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Pp = Object.assign({ on: 0, lenUp: 560, n0: 3 }, f.puppet || {});
    const tIn = tOf(s, Pp.in || { at: .05 }, .1, idx), tugs = (Pp.tugs || []).map((g, j) => ({ T: tOf(s, g, .2 + j * .1, idx), part: g.part || "head" }));
    const tSnap = tOf(s, Pp.snap, .5, idx), B = Pp.basket;
    const ctrlPos = (st) => { const h = toonHead(st); let tug = 0, part = null; tugs.forEach(g => { const k = t - g.T; if (k >= 0 && k < .7){ const v = Math.sin(Math.min(1, k / .25) * Math.PI / 2) * Math.exp(-Math.max(0, k - .25) * 5); if (v > tug){ tug = v; part = g.part; } } });
      const ap = eBack(clamp((t - tIn) / .7, 0, 1)); return { x: h[0] + Math.sin(t * 1.3) * 30, y: h[1] - Pp.lenUp - (1 - ap) * 900 - tug * 90, rot: Math.sin(t * 1.7) * .07 + (part === "hand" ? -tug * .3 : tug * .18), tug, ap }; };
    base(ctx, s, t, { env: "home",
      spots: { ctrl: () => { const st = toonState((f.toons || [])[Pp.on] || {}, s, t), p = ctrlPos(st); return [p.x, p.y + 260, 1]; } },
      back: (ctx2, c, sts) => { if (!B) return; const bx = B.x ?? 900;
        // door + basket
        ctx.fillStyle = "#6E3E22"; rr(ctx, bx - 40, GROUND - 640, 300, 640, 10); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#8E5432"; rr(ctx, bx - 14, GROUND - 610, 248, 270, 8); ctx.fill(); rr(ctx, bx - 14, GROUND - 320, 248, 290, 8); ctx.fill();
        ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(bx + 210, GROUND - 330, 13, 0, TAU); ctx.fill(); ol(ctx, 4); },
      front: (ctx2, c, sts) => {
        const st = sts[Pp.on]; if (!st) return; const P0 = ctrlPos(st), ks = t - tSnap, h = headOf(st);
        const tugN = tugs.filter(g => t >= g.T).length, badge = Pp.n0 + tugN * 3;
        // controller position after snap: tumbles into the basket
        let cx = P0.x, cy = P0.y, crot = P0.rot, lit = true;
        const bx = B ? (B.x ?? 900) + 110 : cx, by = GROUND - 120;
        if (ks > 0){ const q = clamp(ks / .8, 0, 1), e = eIn(q) * .6 + q * .4; cx = lerp(P0.x, bx, e); cy = lerp(P0.y, by, e) - Math.sin(q * Math.PI) * 260; crot = P0.rot + q * 7; if (q >= 1){ crot = .15 + Math.sin(ks * 3) * .02 * Math.exp(-ks); cy = by + Math.sin((ks - .8) * 14) * 16 * Math.exp(-(ks - .8) * 5); } lit = q < 1; }
        const ca = Math.cos(crot), sa = Math.sin(crot), barW = 170;
        const ends = [[-barW, 0], [0, 40], [barW, 0]].map(([dx, dy]) => [cx + dx * ca - dy * sa, cy + dx * sa + dy * ca]);
        const tops = [lp(st, -10, -42), [h[0], h[1] - h[2] * .95], lp(st, 18, -46)];
        // strings
        ctx.lineCap = "round";
        tops.forEach((pt, j) => { const e = ends[j];
          if (ks <= 0){ const sag = 30 + 20 * Math.sin(t * 2 + j) - P0.tug * 30, vib = P0.tug * Math.sin(t * 60 + j) * 12, mx = (e[0] + pt[0]) / 2 + sag * .3 + vib, my = (e[1] + pt[1]) / 2;
            ctx.strokeStyle = P0.tug > .2 ? HL : "#F3E2C8"; ctx.lineWidth = 5 + P0.tug * 4; ctx.globalAlpha = P0.ap; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.quadraticCurveTo(mx, my, pt[0], pt[1]); ctx.stroke(); ctx.globalAlpha = 1; }
          else if (ks < 1.4){ const a = 1 - clamp((ks - .6) / .8, 0, 1), d = ks; ctx.globalAlpha = a; ctx.strokeStyle = "#F3E2C8"; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.moveTo(pt[0], pt[1]); ctx.quadraticCurveTo(pt[0] + Math.sin(d * 9 + j) * 40, pt[1] - 120 + d * 160, pt[0] + (j - 1) * 50 * d, pt[1] - 200 + d * 420); ctx.stroke(); ctx.globalAlpha = 1;
            if (ks < .35) burstFx(ctx, pt[0], pt[1] - 140, ks, GOLD, 6, 90); } });
        // controller: wooden cross + phone
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(crot); const sc = .9 + P0.tug * .12; ctx.scale(sc, sc);
        ctx.fillStyle = "#A9643B"; rr(ctx, -barW - 20, -14, barW * 2 + 40, 28, 12); ctx.fill(); ol(ctx, 5); rr(ctx, -14, -90, 28, 150, 12); ctx.fill(); ol(ctx, 5);
        [-barW, 0, barW].forEach((dx, j) => { ctx.beginPath(); ctx.arc(dx, j === 1 ? 40 : 0, 9, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); });
        if (lit){ glowAt(ctx, 0, -30, 200, "#BFE2EA", .35 + P0.tug * .3); for (let r = 0; r < 2; r++){ const w = (t * .9 + r / 2) % 1; ctx.strokeStyle = hexA(HL, (1 - w) * (.4 + P0.tug * .6)); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -30, 90 + w * 120, 0, TAU); ctx.stroke(); } }
        ctx.save(); ctx.translate(0, -30); ctx.rotate(Math.sin(t * 30) * .06 * P0.tug); phoneSmall(ctx, 100, 170, lit, lit ? badge : 0);
        if (lit){ ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-18, -16, 7, 0, TAU); ctx.arc(18, -16, 7, 0, TAU); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.arc(0, 4, 18, .2, Math.PI - .2); ctx.stroke(); }
        else { ctx.strokeStyle = "#8B87A0"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-26, -14); ctx.lineTo(-8, -14); ctx.moveTo(8, -14); ctx.lineTo(26, -14); ctx.stroke(); }
        ctx.restore(); ctx.restore();
        // TING! on each tug
        tugs.forEach((g, j) => { const k = t - g.T; if (k < 0 || k > .8 || ks > 0) return; ctx.save(); ctx.globalAlpha = 1 - k / .8; ctx.translate(P0.x + (j % 2 ? 210 : -210), P0.y - 70 - k * 80); ctx.rotate(j % 2 ? .15 : -.15); ctx.scale(eBack(clamp(k / .25, 0, 1)), eBack(clamp(k / .25, 0, 1))); textO(ctx, "TING!", 0, 0, 64, GOLD); ctx.restore(); });
        // basket in front of the door
        if (B){ const bxx = (B.x ?? 900) + 110, land = ks > .8 ? Math.sin((ks - .8) * 14) * Math.exp(-(ks - .8) * 4) : 0;
          ctx.save(); ctx.translate(bxx, GROUND); ctx.scale(1 + land * .08, 1 - land * .08);
          ctx.beginPath(); ctx.moveTo(-130, -150); ctx.lineTo(130, -150); ctx.lineTo(105, 0); ctx.lineTo(-105, 0); ctx.closePath(); ctx.fillStyle = "#C98E4E"; ctx.fill(); ol(ctx, 6);
          ctx.strokeStyle = "#9A6532"; ctx.lineWidth = 5; for (let yy = -125; yy < 0; yy += 28){ ctx.beginPath(); ctx.moveTo(-125 + (yy + 150) * .17, yy); ctx.lineTo(125 - (yy + 150) * .17, yy); ctx.stroke(); }
          ctx.fillStyle = "#B57A3E"; rr(ctx, -140, -168, 280, 30, 12); ctx.fill(); ol(ctx, 5);
          ctx.beginPath(); ctx.arc(0, -168, 110, Math.PI * 1.08, Math.PI * 1.92); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = "#B57A3E"; ctx.lineWidth = 9; ctx.stroke(); ctx.restore();
          if (ks > 1.2){ for (let i = 0; i < 3; i++){ const w = ((ks - 1.2) * .5 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(w * Math.PI); textO(ctx, "z", bxx + 40 + w * 60 + i * 10, GROUND - 200 - w * 160, 40 + i * 10, "#BFE2EA"); ctx.restore(); } } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Pp = f.puppet || {}; (Pp.tugs || []).forEach((g, j) => add(tOf(s, g, .2 + j * .1, i), "ping")); if (Pp.snap){ const T0 = tOf(s, Pp.snap, .5, i); add(T0, "whoosh"); add(T0 + .8, "pop"); } add(tOf(s, Pp.in || { at: .05 }, .1, i) + .1, "whoosh"); });

  /* ================= globe: the mind as a snow globe ================= */
  TT.scene("j2611221020121_globe", "Cerita: bola kaca bersalju (pikiran keruh lalu jernih)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Gb = Object.assign({ x: 620, y: 1300, r: 290 }, f.globe || {});
    const shakes = (Gb.shakes || []).map((o, j) => tOf(s, o, .2 + j * .2, idx)), tS = tOf(s, Gb.settle, .6, idx), tC = tOf(s, Gb.clear, .85, idx);
    let shake = 0; shakes.forEach(T0 => { const k = t - T0; if (k >= 0 && k < 1.1) shake = Math.max(shake, Math.sin(Math.min(1, k / .15) * Math.PI / 2) * (1 - k / 1.1)); });
    const turb = t < tS ? .75 + .25 * shake : Math.max(shake, .75 * Math.exp(-(t - tS) * 1.1)), S = t < tS ? 0 : clamp(1 - Math.exp(-(t - tS) * 1.1), 0, 1), clear = clamp((t - tC) / .6, 0, 1);
    const cx0 = Gb.x, cy0 = Gb.y - 110 - Gb.r * .86, R = Gb.r;
    base(ctx, s, t, { env: "info",
      spots: { globe: [cx0, cy0, 1.25] },
      mid: (ctx2, c, sts) => {
        const dx = Math.sin(t * 38) * 22 * shake, dy = Math.cos(t * 31) * 10 * shake, rot = Math.sin(t * 24) * .06 * shake, cx = cx0, cy = cy0;
        ctx.save(); ctx.translate(cx0, Gb.y); ctx.rotate(rot); ctx.translate(-cx0 + dx, -Gb.y + dy);
        // shadow + pedestal
        ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(cx, Gb.y + 6, R * .95, 26, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx - R * .78, Gb.y - 110); ctx.lineTo(cx + R * .78, Gb.y - 110); ctx.lineTo(cx + R * .95, Gb.y); ctx.lineTo(cx - R * .95, Gb.y); ctx.closePath(); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 7);
        ctx.fillStyle = "#A9643B"; rr(ctx, cx - R * .85, Gb.y - 130, R * 1.7, 34, 14); ctx.fill(); ol(ctx, 6);

        // inside
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
        const sky = ctx.createLinearGradient(0, cy - R, 0, cy + R); sky.addColorStop(0, mixHex("#22305A", "#3C5A9A", clear)); sky.addColorStop(1, mixHex("#5B4A78", "#E8A86A", clear * .7)); ctx.fillStyle = sky; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        for (let i = 0; i < 14; i++){ ctx.globalAlpha = (.3 + .7 * clear) * (.5 + .5 * Math.sin(t * 2 + i)); sparkle(ctx, cx - R * .8 + rnd(i + 40) * R * 1.6, cy - R * .85 + rnd(i + 60) * R * .9, 6 + rnd(i) * 6, "#FFF4D6"); } ctx.globalAlpha = 1;
        glowAt(ctx, cx + R * .42, cy - R * .45, 120 + clear * 80, "#FFE9B0", .35 + clear * .45); ctx.beginPath(); ctx.arc(cx + R * .42, cy - R * .45, 44, 0, TAU); ctx.fillStyle = "#FFF1C8"; ctx.fill();
        // little house + tree on a hill
        ctx.fillStyle = "#E9E4F2"; ctx.beginPath(); ctx.ellipse(cx, cy + R * .95, R * 1.1, R * .5, 0, 0, TAU); ctx.fill();
        ctx.save(); ctx.translate(cx - 30, cy + R * .5); ctx.fillStyle = "#C47A48"; ctx.fillRect(-70, -90, 140, 90); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-90, -86); ctx.lineTo(0, -160); ctx.lineTo(90, -86); ctx.closePath(); ctx.fillStyle = "#8E3B2E"; ctx.fill(); ol(ctx, 5);
        glowAt(ctx, 30, -50, 70, "#FFD27A", .4 + clear * .4); ctx.fillStyle = "#FFD27A"; ctx.fillRect(14, -66, 34, 32); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(14, -66, 34, 32); ctx.fillStyle = "#5A3A2A"; ctx.fillRect(-46, -56, 30, 56); ctx.restore();
        ctx.save(); ctx.translate(cx + 140, cy + R * .52); ctx.fillStyle = "#3E7D4F"; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.moveTo(-50 + k * 8, -k * 46); ctx.lineTo(0, -80 - k * 46); ctx.lineTo(50 - k * 8, -k * 46); ctx.closePath(); ctx.fill(); ol(ctx, 4); } ctx.restore();
        // flakes: notification bits
        const N = 80;
        for (let i = 0; i < N; i++){ const a0 = rnd(i) * TAU, rr0 = R * (.12 + .78 * rnd(i + 7)), dir = i % 3 ? 1 : -1, sp = (.5 + rnd(i + 3)) * (.4 + 2.2 * turb);
          const ang = a0 + t * sp * dir, swx = cx + Math.cos(ang) * rr0, swy = cy + Math.sin(ang) * rr0 * .9 + Math.sin(t * 3 + i) * 20 * turb;
          const rx = cx + (rnd(i + 11) - .5) * R * 1.5, ry = cy + R * (.62 + .2 * rnd(i + 13)) - (Math.abs(rx - cx) < R * .4 ? 0 : 0);
          const ee = S * S * (3 - 2 * S), x = lerp(swx, rx, ee), y = lerp(swy, ry, ee) + (1 - ee) * 0;
          const kind = i % 5, sz = 9 + rnd(i + 5) * 9;
          ctx.save(); ctx.translate(x, y); ctx.rotate(ang * 2 * (1 - ee));
          if (kind === 0){ ctx.beginPath(); ctx.arc(0, 0, sz, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillRect(-2, -6, 4, 8); }
          else if (kind === 1){ rr(ctx, -sz * 1.3, -sz * .8, sz * 2.6, sz * 1.6, 5); ctx.fillStyle = "#BFE3B4"; ctx.fill(); }
          else if (kind === 2){ rr(ctx, -sz, -sz, sz * 2, sz * 2, 5); ctx.fillStyle = "#9FD3E8"; ctx.fill(); }
          else { ctx.beginPath(); ctx.arc(0, 0, sz * .7, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); }
          ctx.restore(); }
        // murk
        ctx.fillStyle = `rgba(96,86,110,${(.55 * turb * (1 - clear)).toFixed(3)})`; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        ctx.restore();
        // glass
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = hexA("#DDF2FF", .7); ctx.lineWidth = 5; ctx.stroke();
        ctx.save(); ctx.globalAlpha = .55; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(cx, cy, R * .82, Math.PI * 1.1, Math.PI * 1.38); ctx.stroke(); ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(cx, cy, R * .82, Math.PI * 1.45, Math.PI * 1.52); ctx.stroke(); ctx.restore();
        chip(ctx, "PIKIRAN", cx, cy - R - 34, 38, ORANGE, CREAM, -.03);
        if (shake > .05){ ctx.strokeStyle = hexA(CREAM, shake); ctx.lineWidth = 8; ctx.lineCap = "round"; [-1, 1].forEach(d => { for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(cx, cy, R + 30 + k * 26, d > 0 ? -.5 + k * .1 : Math.PI - .5 + k * .1, d > 0 ? .1 + k * .1 : Math.PI + .1 + k * .1); ctx.stroke(); } }); }
        ctx.restore();
        if (clear > 0 && t - tC < 1) burstFx(ctx, cx0, cy0 - R * .2, t - tC, GOLD, 12, R * 1.1);
        if (clear > 0) for (let i = 0; i < 8; i++){ const a = t * .7 + i / 8 * TAU; ctx.globalAlpha = clear * (.5 + .5 * Math.sin(t * 3 + i)); sparkle(ctx, cx0 + Math.cos(a) * (R + 50), cy0 + Math.sin(a) * (R + 50), 14, i % 2 ? GOLD : CREAM); ctx.globalAlpha = 1; }
      }, midZ: .5 });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gb = f.globe || {}; (Gb.shakes || []).forEach((o, j) => add(tOf(s, o, .2 + j * .2, i), "whoosh")); if (Gb.settle) add(tOf(s, Gb.settle, .6, i), "whoosh"); if (Gb.clear) add(tOf(s, Gb.clear, .85, i), "chime"); });

  /* ================= roller: motivation roller coaster ================= */
  const TRACK = (() => { const C = [[-500, 1500], [-100, 1460], [250, 1300], [560, 1020], [850, 800], [1060, 740], [1220, 830], [1420, 1180], [1620, 1470], [1860, 1560], [2200, 1580], [2600, 1580], [3000, 1580]];
    const cr = (p0, p1, p2, p3, q) => { const q2 = q * q, q3 = q2 * q; return .5 * ((2 * p1) + (-p0 + p2) * q + (2 * p0 - 5 * p1 + 4 * p2 - p3) * q2 + (-p0 + 3 * p1 - 3 * p2 + p3) * q3); };
    const pts = []; for (let i = 0; i < C.length - 1; i++){ const p0 = C[Math.max(0, i - 1)], p1 = C[i], p2 = C[i + 1], p3 = C[Math.min(C.length - 1, i + 2)]; for (let k = 0; k < 24; k++){ const q = k / 24; pts.push([cr(p0[0], p1[0], p2[0], p3[0], q), cr(p0[1], p1[1], p2[1], p3[1], q)]); } }
    pts.push(C[C.length - 1]); const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1];
    const at = u => { const d = clamp(u, 0, 1) * tot; let i = 1; while (i < L.length - 1 && L[i] < d) i++; const q = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]), a = pts[i - 1], b = pts[i];
      return { x: lerp(a[0], b[0], q), y: lerp(a[1], b[1], q), ang: Math.atan2(b[1] - a[1], b[0] - a[0]) }; };
    return { pts, at }; })();
  TT.scene("j2611221020121_roller", "Cerita: roller coaster motivasi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rd = Object.assign({ flags: [] }, f.ride || {});
    const K = (Rd.keys || [{ at: 0, u: .4 }]).map((k, j) => Object.assign({ T: tOf(s, k, .2 + j * .1, idx) }, k)).sort((a, b) => a.T - b.T);
    let u = K[0].u;
    // rebuild proper chain (u of previous key = where it ended)
    let cur = K[0].u; for (let j = 1; j < K.length; j++){ const k = K[j]; if (t < k.T) break; const d = k.dur ?? .9, q = clamp((t - k.T) / d, 0, 1), e = k.ease === "in" ? q * q * q : k.ease === "lin" ? q : easeIO(q); cur = lerp(cur, k.u, e); if (q < 1) break; cur = k.u; }
    u = cur;
    const crt = TRACK.at(u), crt2 = TRACK.at(u + .004), speed = Math.hypot(crt2.x - crt.x, crt2.y - crt.y);
    const tBook = tOf(s, Rd.bookOut, .6, idx), rider = Object.assign({ size: 400, hair: "short" }, Rd.rider || {});
    const fast = clamp((crt.ang - .4) / .5, 0, 1);
    base(ctx, s, t, { env: "sky", envOpt: { hills: true },
      spots: { cart: () => [crt.x, crt.y - 180, null] },
      back: (ctx2, c) => {
        // supports
        ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 12; for (let x = -480; x < 2800; x += 130){ let best = TRACK.pts[0]; for (const p of TRACK.pts) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
          ctx.beginPath(); ctx.moveTo(best[0], best[1] + 10); ctx.lineTo(best[0], 1800); ctx.stroke(); }
        ctx.lineWidth = 6; ctx.strokeStyle = "#A9643B"; for (let x = -480; x < 2700; x += 130){ ctx.beginPath(); ctx.moveTo(x, 1800); ctx.lineTo(x + 130, Math.max(TRACK.at(clamp((x + 600) / 3600, 0, 1)).y, 1300)); ctx.stroke(); }
        // rails
        ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.beginPath(); TRACK.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
        ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.stroke(); ctx.strokeStyle = "#D9483B"; ctx.lineWidth = 22; ctx.stroke(); ctx.strokeStyle = "#F4A85C"; ctx.lineWidth = 6; ctx.stroke();
        for (let i = 0; i < TRACK.pts.length; i += 3){ const p = TRACK.pts[i]; ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, TAU); ctx.fill(); }
        // day flags
        (Rd.flags || []).forEach((fl, j) => { const p = TRACK.at(fl.u), bx = p.x, by = p.y - 30; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - 210); ctx.stroke();
          const wv = Math.sin(t * 5 + j) * 10; ctx.beginPath(); ctx.moveTo(bx, by - 210); ctx.quadraticCurveTo(bx + 70, by - 200 + wv, bx + 150, by - 175 + wv); ctx.lineTo(bx, by - 130); ctx.closePath(); ctx.fillStyle = fl.hl ? ORANGE : (j % 2 ? GOLD : "#9FD3E8"); ctx.fill(); ol(ctx, 5);
          font(ctx, 900, 34, FAM); ctx.fillStyle = fl.hl ? CREAM : BROWN; ctx.fillText(fl.label, bx + 10, by - 160); });
      },
      mid: (ctx2, c, sts) => {
        const a = crt.ang * .9, x = crt.x, y = crt.y;
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        // rider
        const st = toonState(Object.assign({}, rider, { x: 0, y: -40 }), s, t); st.x = 0; st.y = -40 + Math.sin(t * 20) * 3 * fast;
        drawToon(ctx, rider, st, t);
        // book in hands until it flies out
        if (t < tBook){ const p = lp(st, 18, -50); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-.2 + Math.sin(t * 9) * .1 * fast); ctx.scale(.7, .7); bookShape(ctx, 150, 110, "#2F6F73", "BUKU"); ctx.restore(); }
        // cart
        ctx.fillStyle = "rgba(0,0,0,.2)"; rr(ctx, -150, -60, 300, 30, 10); ctx.fill();
        rr(ctx, -160, -120, 320, 110, 30); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7); rr(ctx, -140, -104, 280, 22, 10); ctx.fillStyle = hexA(CREAM, .35); ctx.fill();
        font(ctx, 900, 40, FAM); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText("MOTIVASI", 0, -42); ctx.textAlign = "left";
        [-100, 100].forEach(dx => { ctx.beginPath(); ctx.arc(dx, -4, 26, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; const sp = t * 12 * (.3 + fast); ctx.beginPath(); ctx.moveTo(dx + Math.cos(sp) * 16, -4 + Math.sin(sp) * 16); ctx.lineTo(dx - Math.cos(sp) * 16, -4 - Math.sin(sp) * 16); ctx.stroke(); });
        ctx.restore();
        // speed lines while plunging
        if (fast > .05){ ctx.save(); ctx.globalAlpha = fast * .8; ctx.strokeStyle = CREAM; ctx.lineCap = "round"; for (let i = 0; i < 9; i++){ const w = (t * 3 + i / 9) % 1, ox = (rnd(i) - .5) * 260, oy = -260 - rnd(i + 3) * 200; ctx.lineWidth = 6 + rnd(i) * 6;
          ctx.beginPath(); ctx.moveTo(x + ox - Math.cos(crt.ang) * (60 + w * 300), y + oy - Math.sin(crt.ang) * (60 + w * 300)); ctx.lineTo(x + ox - Math.cos(crt.ang) * (180 + w * 300), y + oy - Math.sin(crt.ang) * (180 + w * 300)); ctx.stroke(); } ctx.restore(); }
        // the book flying off
        if (t >= tBook && t < tBook + 3){ const k = t - tBook, bp = TRACK.at(clamp(u, 0, 1)); const bx0 = bp.x, by0 = bp.y - 200, bx = bx0 + 300 * Math.min(k, 1.1), by = Math.min(1640 - 30, by0 - 420 * k + 900 * k * k);
          ctx.save(); ctx.translate(bx, by); ctx.rotate(k < 1.1 ? k * 9 : 9.9); bookShape(ctx, 150, 110, "#2F6F73", "BUKU"); ctx.restore(); if (by >= 1609 && k < 2) burstFx(ctx, bx, 1620, k - (Math.sqrt((1609 - by0) / 900 + .1)), "#E8D2B0", 8, 120); }
        // screams / bubble
        if (rider.keys){ const st2 = toonState(Object.assign({}, rider, { x: x, y: y - 40 }), s, t); if (st2.say){ const sp = c.toScreen(x, y - rider.size * .95); const txt = st2.say, kk = t - st2.sayT; TT.CS.ov.push(() => bubble(ctx, txt, sp[0], sp[1], kk, { kind: st2.sayKind, t })); } }
      }, midZ: .5 });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rd = f.ride || {}; (Rd.keys || []).forEach((k, j) => { if (j) add(tOf(s, k, .2 + j * .1, i), k.ease === "in" ? "whoosh" : "pop"); }); if (Rd.bookOut) { add(tOf(s, Rd.bookOut, .6, i), "whoosh"); add(tOf(s, Rd.bookOut, .6, i) + .9, "pop"); }
    ((Rd.rider || {}).keys || []).forEach((k, j) => { if (k.say) add(tOf(s, k, .1, i), "pop"); if (k.expr === "shock") add(tOf(s, k, .1, i), "ping"); }); });

  /* ================= lomba: rabbit vs tortoise ================= */
  function rabbit(ctx, x, y, s, mode, t, ph){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 90, 14, 0, 0, TAU); ctx.fill();
    if (mode === "sleep"){
      ctx.beginPath(); ctx.ellipse(0, -40, 95, 45, 0, 0, TAU); ctx.fillStyle = "#FFF8EE"; ctx.fill(); ol(ctx, 6);
      ctx.beginPath(); ctx.ellipse(-80, -40, 20, 18, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.arc(85, -50, 42, 0, TAU); ctx.fillStyle = "#FFF8EE"; ctx.fill(); ol(ctx, 6);
      [-1, 1].forEach(d => { ctx.save(); ctx.translate(70 + d * 12, -78); ctx.rotate(-1.6 + d * .2 + Math.sin(t * 1.2 + d) * .04); ctx.beginPath(); ctx.ellipse(0, -40, 16, 46, 0, 0, TAU); ctx.fillStyle = "#FFF8EE"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(0, -40, 7, 32, 0, 0, TAU); ctx.fillStyle = "#F7B7A3"; ctx.fill(); ctx.restore(); });
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(98, -54, 10, .2, Math.PI - .2); ctx.stroke(); ctx.fillStyle = "#F08C9A"; ctx.beginPath(); ctx.arc(126, -46, 7, 0, TAU); ctx.fill();
      const br = 1 + Math.sin(t * 2.4) * .04; ctx.restore(); return br; }
    const hop = Math.abs(Math.sin(ph)), sq = 1 + (hop < .2 ? -.12 : .08 * hop);
    ctx.scale(1 / sq, sq);
    ctx.beginPath(); ctx.ellipse(-70, -70, 22, 20, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(-10, -70, 75, 55, -.2, 0, TAU); ctx.fillStyle = "#FFF8EE"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#FFF8EE"; [[-50, -10], [30, -10]].forEach(([lx, ly], j) => { ctx.beginPath(); ctx.ellipse(lx + Math.sin(ph + j * 2) * 18, ly, 26, 14, 0, 0, TAU); ctx.fill(); ol(ctx, 5); });
    ctx.beginPath(); ctx.arc(65, -125, 44, 0, TAU); ctx.fillStyle = "#FFF8EE"; ctx.fill(); ol(ctx, 6);
    [-1, 1].forEach(d => { ctx.save(); ctx.translate(52 + d * 16, -160); ctx.rotate(-.35 + d * .18 - Math.sin(ph) * .25); ctx.beginPath(); ctx.ellipse(0, -48, 17, 52, 0, 0, TAU); ctx.fillStyle = "#FFF8EE"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(0, -48, 8, 36, 0, 0, TAU); ctx.fillStyle = "#F7B7A3"; ctx.fill(); ctx.restore(); });
    ctx.beginPath(); ctx.arc(80, -132, 9, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(83, -136, 3, 0, TAU); ctx.fill();
    ctx.fillStyle = "#F08C9A"; ctx.beginPath(); ctx.arc(106, -118, 8, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(94, -106, 9, .3, Math.PI - .5); ctx.stroke();
    ctx.restore(); return 1; }
  function turtle(ctx, x, y, s, t, ph){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 130, 16, 0, 0, TAU); ctx.fill();
    [[-70, 0], [60, Math.PI], [-30, Math.PI], [90, 0]].forEach(([lx, o], j) => { const st = Math.sin(ph + o) * 14; ctx.beginPath(); ctx.ellipse(lx + st, -14 - Math.max(0, Math.cos(ph + o)) * 8, 24, 20, 0, 0, TAU); ctx.fillStyle = j > 1 ? "#6FA05A" : "#7FB26A"; ctx.fill(); ol(ctx, 5); });
    const nb = Math.sin(ph * 2) * 4;
    ctx.beginPath(); ctx.ellipse(150, -62 + nb, 44, 36, .1, 0, TAU); ctx.fillStyle = "#7FB26A"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(164, -72 + nb, 8, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(167, -75 + nb, 3, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(170, -56 + nb, 12, .2, Math.PI - .6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-130, -26); ctx.quadraticCurveTo(-120, -150, 0, -152); ctx.quadraticCurveTo(120, -150, 130, -26); ctx.closePath(); ctx.fillStyle = "#3E8A55"; ctx.fill(); ol(ctx, 7);
    ctx.save(); ctx.clip(); ctx.strokeStyle = "#2E6B40"; ctx.lineWidth = 6; for (let i = -2; i <= 2; i++){ ctx.beginPath(); const hx = i * 56, hy = -88 + (i % 2 ? 22 : 0); for (let k = 0; k <= 6; k++){ const a = k / 6 * TAU; ctx.lineTo(hx + Math.cos(a) * 30, hy + Math.sin(a) * 30); } ctx.stroke(); } ctx.restore();
    rr(ctx, -136, -36, 272, 20, 10); ctx.fillStyle = "#C9A66B"; ctx.fill(); ol(ctx, 5);
    ctx.restore(); }
  TT.scene("j2611221020121_lomba", "Cerita: lomba kelinci motivasi vs kura-kura kebiasaan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rc = f.race || {}, Rb = Object.assign({ x0: 260, sleepX: 1500 }, Rc.rabbit || {}), Tu = Object.assign({ x0: -60, speed: 150 }, Rc.turtle || {});
    const tDash = tOf(s, Rb.dash, .3, idx), tSleep = tOf(s, Rb.sleep, .45, idx), tPass = tOf(s, Rc.pass, .85, idx);
    const RY = 1520, TY = GROUND + 10;
    // rabbit state
    let rx = Rb.x0, ry = RY, rmode = "hop", rph = t * 8;
    if (t < tDash){ ry = RY - Math.abs(Math.sin(t * 3.2)) * 260; rph = t * 3.2; }
    else { const k = t - tDash, D = 1.3, q = clamp(k / D, 0, 1); rx = lerp(Rb.x0, Rb.sleepX, easeIO(q)); ry = RY - Math.abs(Math.sin(k * 11)) * 70 * (1 - q); rph = k * 11; if (t > tSleep) rmode = "sleep"; }
    const tx = Tu.x0 + Tu.speed * t, tph = t * 6;
    const trailR = [], trailT = [];
    for (let k = 0; k <= 60; k++){ const tt = t * k / 60; let x, y; if (tt < tDash){ x = Rb.x0 - (tDash - tt) * 0; x = Rb.x0 - 200 + tt / Math.max(.1, tDash) * 200; y = RY - Math.abs(Math.sin(tt * 3.2)) * 260; } else { const q = clamp((tt - tDash) / 1.3, 0, 1); x = lerp(Rb.x0, Rb.sleepX, easeIO(q)); y = RY - Math.abs(Math.sin((tt - tDash) * 11)) * 70 * (1 - q); } trailR.push([x, y - 150]); }
    base(ctx, s, t, { env: "park",
      spots: { rabbit: () => [rx + 60, 1280, null], turtle: () => [tx + 160, 1320, null], both: () => [(tx + Rb.sleepX) / 2 + 100, 1280, null] },
      back: (ctx2, c, sts) => {
        // race track lanes
        ctx.fillStyle = "#D9B98A"; ctx.fillRect(-1000, RY - 20, 4000, 60); ctx.fillStyle = "#E3C79B"; ctx.fillRect(-1000, TY - 40, 4000, 70);
        ctx.strokeStyle = hexA(PAPER, .8); ctx.lineWidth = 6; ctx.setLineDash([40, 30]); ctx.beginPath(); ctx.moveTo(-1000, RY + 40); ctx.lineTo(3000, RY + 40); ctx.stroke(); ctx.setLineDash([]);
        // start line
        ctx.fillStyle = PAPER; for (let k = 0; k < 6; k++){ ctx.fillStyle = k % 2 ? OUT : PAPER; ctx.fillRect(140, RY - 20 + k * 30, 24, 30); }
        // rabbit wave trail (naik turun)
        ctx.save(); ctx.globalAlpha = .9; ctx.strokeStyle = HL; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.setLineDash([2, 22]); ctx.beginPath(); trailR.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
        // turtle straight trail + day chips
        ctx.strokeStyle = hexA(GREEN, .9); ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(Tu.x0 - 200, TY - 130); ctx.lineTo(tx - 200, TY - 130); ctx.stroke();
        for (let d = 1; d < 12; d++){ const xx = Tu.x0 - 200 + d * 180; if (xx > tx - 220) break; const k = (tx - 220 - xx) / 180; ctx.save(); ctx.translate(xx, TY - 130); const sc = eBack(clamp(k * 3, 0, 1)); ctx.scale(sc, sc);
          ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); textC(ctx, "H" + d, 0, 12, 34, "#FFFFFF", 900); ctx.restore(); }
      },
      mid: (ctx2, c, sts) => {
        const RS = 1.75, TS = 1.6; const rs = rabbit(ctx, rx, ry, RS, rmode, t, rph);
        if (rmode === "sleep"){ for (let i = 0; i < 3; i++){ const w = ((t - tSleep) * .6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(w * Math.PI); textO(ctx, "Z", rx + 120 + w * 80 + i * 14, RY - 170 - w * 220, 46 + i * 14, CREAM); ctx.restore(); } }
        if (t > tDash && t < tDash + 1.3){ ctx.save(); ctx.globalAlpha = .7; for (let i = 0; i < 5; i++){ ctx.fillStyle = "#E8D2B0"; ctx.beginPath(); ctx.arc(rx - 130 - i * 40 - ((t * 400) % 40), RY - 10 - rnd(i) * 30, 18 + i * 4, 0, TAU); ctx.fill(); } ctx.restore(); }
        turtle(ctx, tx, TY, TS, t, tph);
        // name tags
        const tagR = rmode === "sleep" ? [rx + 20, RY - 300] : [rx + 80, ry - 500], tagT = [tx + 30, TY - 330];
        chip(ctx, "MOTIVASI", tagR[0], tagR[1], 40, ORANGE, CREAM, -.04); chip(ctx, "KEBIASAAN", tagT[0], tagT[1], 40, GREEN, "#FFFFFF", .03);
        const kp = t - tPass; if (kp > 0 && kp < 1) burstFx(ctx, tx + 200, TY - 260, kp, GOLD, 12, 260);
      }, midZ: .5 });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rc = f.race || {}, Rb = Rc.rabbit || {}; add(.3, "whoosh"); if (Rb.dash) add(tOf(s, Rb.dash, .3, i), "whoosh"); if (Rb.sleep) add(tOf(s, Rb.sleep, .45, i), "pop"); if (Rc.pass) add(tOf(s, Rc.pass, .85, i), "chime"); });

  /* ================= xray: courier ride with x-ray inset ================= */
  function scooter(ctx, x, y, t, bounce){
    ctx.save(); ctx.translate(x, y);
    [-150, 150].forEach(dx => { ctx.beginPath(); ctx.arc(dx, -50, 50, 0, TAU); ctx.fillStyle = "#2B1A12"; ctx.fill(); ctx.beginPath(); ctx.arc(dx, -50, 24, 0, TAU); ctx.fillStyle = "#9A9AA8"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = OUT; ctx.lineWidth = 4; const a = t * 14; ctx.beginPath(); ctx.moveTo(dx + Math.cos(a) * 22, -50 + Math.sin(a) * 22); ctx.lineTo(dx - Math.cos(a) * 22, -50 - Math.sin(a) * 22); ctx.stroke(); });
    ctx.translate(0, -bounce);
    ctx.beginPath(); ctx.moveTo(-190, -70); ctx.quadraticCurveTo(-200, -150, -120, -160); ctx.lineTo(60, -160); ctx.lineTo(120, -110); ctx.lineTo(170, -230); ctx.lineTo(200, -230); ctx.lineTo(190, -80); ctx.quadraticCurveTo(100, -60, -190, -70); ctx.closePath(); ctx.fillStyle = "#D9483B"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -150, -190, 170, 32, 14); ctx.fillStyle = "#2B1A12"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(185, -230); ctx.lineTo(150, -300); ctx.stroke(); rr(ctx, 120, -318, 70, 18, 8); ctx.fillStyle = "#2B1A12"; ctx.fill();
    ctx.beginPath(); ctx.arc(205, -170, 16, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
    ctx.restore(); }
  function parcel(ctx, w, h, label){ rr(ctx, -w / 2, -h, w, h, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#C88E54"; ctx.fillRect(-w / 2 + 6, -h + 8, w - 12, 18); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -h); ctx.lineTo(0, -h + 40); ctx.stroke();
    if (label){ rr(ctx, -w * .32, -h * .55, w * .64, h * .3, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); fit(ctx, label, w * .56, 26, 900); ctx.fillStyle = RED; ctx.textAlign = "center"; ctx.fillText(label, 0, -h * .55 + h * .2); ctx.textAlign = "left"; } }
  function glassShape(ctx, w, h, crack, k){ ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w * .38, 0); ctx.lineTo(-w * .38, 0); ctx.closePath(); ctx.fillStyle = "rgba(190,230,245,.55)"; ctx.fill(); ctx.strokeStyle = "#DDF6FF"; ctx.lineWidth = 6; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w * .3, -h * .85); ctx.lineTo(-w * .24, -h * .2); ctx.stroke();
    if (crack > 0){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); const L = crack; ctx.moveTo(0, -h * .6); [[-.3, -.85], [.25, -.9], [-.35, -.3], [.3, -.25], [.05, -.05]].forEach(([dx, dy], j) => { if (j / 5 > L) return; ctx.moveTo(0, -h * .6); ctx.lineTo(dx * w * .5, dy * h + Math.sin(j * 3) * 10); ctx.lineTo(dx * w, dy * h * .9); }); ctx.stroke(); } }
  TT.scene("j2611221020121_xray", "Cerita: kurir + sinar-X isi kardus", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rd = Object.assign({ x0: -350, x1: 1500, t0: .1 }, f.ride || {});
    const tOut = tOf(s, Rd.out, .45, idx), bumps = (Rd.bumps || []).map((b, j) => tOf(s, b, .15 + j * .12, idx)), tCr = tOf(s, Rd.crack, .4, idx);
    const tPh = tOf(s, f.photo, .5, idx), tPhOut = f.photo && f.photo.outCue ? cueT(s, f.photo.outCue, .7, idx) : 1e9, Id = f.idea || {}, tId = tOf(s, Id, .8, idx);
    const q = clamp((t - Rd.t0) / Math.max(.5, tOut - Rd.t0), 0, 1), bx = lerp(Rd.x0, Rd.x1, q);
    let bnc = 0, boxJ = 0, boxR = 0; bumps.forEach(T0 => { const k = t - T0; if (k >= 0 && k < .8){ bnc += Math.sin(k / .8 * Math.PI * 3) * 30 * (1 - k / .8); boxJ += Math.max(0, Math.sin(k / .5 * Math.PI)) * 120 * (k < .5 ? 1 : 0); boxR += Math.sin(k * 14) * .25 * (1 - k / .8); } });
    bnc += Math.sin(t * 22) * 3;
    const courier = Object.assign({ hair: "short", hat: "helmet", hatColor: "#2F6F73", shirt: "#3E9B5A", skin: "a", size: 470, collar: false }, Rd.courier || {});
    base(ctx, s, t, { env: "street",
      spots: { bike: () => [bx + 60, 1200, null] },
      mid: (ctx2, c, sts) => {
        // potholes
        (Rd.holes || [380, 820]).forEach(hx => { ctx.fillStyle = "#4A3A30"; ctx.beginPath(); ctx.ellipse(hx, GROUND + 14, 70, 14, 0, 0, TAU); ctx.fill(); });
        if (t < tOut + 1){
          const y0 = GROUND + 8;
          // courier
          const st = toonState(Object.assign({}, courier, { x: bx + 20, y: y0 - 160 - bnc, pose: "hold", expr: t > tCr ? "shock" : "happy" }), s, t);
          st.x = bx + 20; st.y = y0 - 160 - bnc; drawToon(ctx, courier, st, t);
          scooter(ctx, bx, y0, t, bnc);
          ctx.save(); ctx.translate(bx - 170, y0 - 190 - bnc - boxJ); ctx.rotate(boxR); parcel(ctx, 170, 150, ""); ctx.restore();
          bumps.forEach(T0 => { const k = t - T0; if (k >= 0 && k < .7){ ctx.save(); ctx.globalAlpha = 1 - k / .7; ctx.translate(bx - 170, y0 - 400 - k * 120); textO(ctx, "DUK!", 0, 0, 56, GOLD); ctx.restore();
            for (let i = 0; i < 5; i++){ ctx.fillStyle = hexA("#E8D2B0", .7 * (1 - k / .7)); ctx.beginPath(); ctx.arc(bx - 150 - i * 30 - k * 120, y0 - 10 - rnd(i) * 30, 14 + i * 3 + k * 20, 0, TAU); ctx.fill(); } } });
        }
      }, midZ: 1.5,
      over: (ctx2, c, sts) => {
        // x-ray inset
        const t1 = bumps.length ? bumps[0] - .2 : 1e9, k = t - t1, kO = t - tOut; if (k > 0 && kO < .4){
          const a = clamp(k / .3, 0, 1) * (1 - clamp(kO / .4, 0, 1)), sc = .6 + .4 * eBack(clamp(k / .4, 0, 1)), X = 700, Y = 470, Rr = 230;
          ctx.save(); ctx.globalAlpha = a; ctx.translate(X, Y); ctx.scale(sc, sc);
          ctx.beginPath(); ctx.arc(0, 0, Rr, 0, TAU); ctx.fillStyle = "#0E2A44"; ctx.fill(); ctx.save(); ctx.clip();
          ctx.strokeStyle = "rgba(120,200,255,.15)"; ctx.lineWidth = 2; for (let gx = -Rr; gx < Rr; gx += 30){ ctx.beginPath(); ctx.moveTo(gx, -Rr); ctx.lineTo(gx, Rr); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-Rr, gx); ctx.lineTo(Rr, gx); ctx.stroke(); }
          ctx.strokeStyle = "#7FD3FF"; ctx.lineWidth = 6; ctx.setLineDash([16, 10]); ctx.strokeRect(-150, -110, 300, 230); ctx.setLineDash([]);
          const jig = bnc * .8, cr = clamp((t - tCr) / .5, 0, 1);
          [[-60, 0], [62, 1]].forEach(([gx, j]) => { ctx.save(); ctx.translate(gx + Math.sin(t * 30 + j) * jig * .2, 100 - Math.abs(jig) * .6 * (j ? 1 : .6)); ctx.rotate(Math.sin(t * 25 + j * 2) * jig * .006); glassShape(ctx, 90, 150, j ? cr : cr * .6, t);
            ctx.strokeStyle = "rgba(200,200,200,.6)"; ctx.lineWidth = 3; for (let l = 0; l < 3; l++){ ctx.beginPath(); ctx.moveTo(-50, -120 + l * 40); ctx.lineTo(-30 + l * 10, -110 + l * 40); ctx.stroke(); } ctx.restore(); });
          if (t > tCr && t < tCr + .9){ const kk = t - tCr; ctx.save(); ctx.globalAlpha *= 1 - kk / .9; ctx.translate(0, -30); ctx.rotate(-.12); ctx.scale(eBack(clamp(kk / .25, 0, 1)), eBack(clamp(kk / .25, 0, 1))); textO(ctx, "KRAK!", 0, 0, 92, RED); ctx.restore(); }
          ctx.restore(); ctx.beginPath(); ctx.arc(0, 0, Rr, 0, TAU); ctx.strokeStyle = CREAM; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
          chip(ctx, "ISI KARDUS", 0, -Rr - 6, 32, ORANGE, CREAM, -.03); ctx.restore(); }
        // photo card
        const kp = t - tPh; if (kp > 0 && t < tPhOut + .4){ const a = 1 - clamp((t - tPhOut) / .4, 0, 1), sc = eBack(clamp(kp / .45, 0, 1)), X = 540, Y = 470;
          ctx.save(); ctx.globalAlpha = a; ctx.translate(X + (1 - sc) * 400, Y); ctx.rotate(.06 - (1 - sc) * .4); ctx.scale(sc, sc);
          ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; rr(ctx, -230, -220, 460, 420, 14); ctx.fillStyle = PAPER; ctx.fill(); ctx.restore(); rr(ctx, -230, -220, 460, 420, 14); ol(ctx, 5);
          rr(ctx, -200, -190, 400, 300, 8); ctx.fillStyle = "#3D4C63"; ctx.fill();
          ctx.save(); ctx.translate(-50, 90); glassShape(ctx, 110, 190, 1, t); ctx.restore();
          ctx.fillStyle = "rgba(200,235,250,.8)"; for (let i = 0; i < 6; i++){ ctx.save(); ctx.translate(40 + i * 24, 80 - rnd(i) * 30); ctx.rotate(i); ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(12, 8); ctx.lineTo(-10, 6); ctx.closePath(); ctx.fill(); ctx.restore(); }
          textC(ctx, "Foto dari pelanggan", 0, 165, 32, BROWN, 700);
          if (kp > .5) stampBox(ctx, "PECAH", 110, -60, kp - .5, RED, 52, .2);
          ctx.restore(); }
        // idea locked in a head
        const ki = t - tId; if (ki > 0 && Id.on != null){ const st = sts[Id.on]; if (st){ const h = headOf(st), sp = c.toScreen(h[0] - 30, h[1] - h[2] * 1.6), sc = eBack(clamp(ki / .5, 0, 1)), X = clamp(sp[0], 300, 780), Y = Math.max(330, sp[1] - 180);
          ctx.save(); ctx.translate(X, Y + Math.sin(t * 2) * 6); ctx.scale(sc, sc);
          [[-34, 230], [-12, 210]].forEach(([dx, dy], j) => { ctx.beginPath(); ctx.arc((sp[0] - X) * (j ? .7 : .4), (sp[1] - Y) * (j ? .75 : .45), 16 - j * 5, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); });
          ctx.beginPath(); for (let k = 0; k < 9; k++){ const a = k / 9 * TAU; ctx.arc(Math.cos(a) * 170, Math.sin(a) * 90, 60, a - 1.2, a + 1.2); } ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
          glowAt(ctx, -70, -10, 120, GOLD, .5 + .2 * Math.sin(t * 6)); ctx.beginPath(); ctx.arc(-70, -24, 40, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#9A9AA8"; rr(ctx, -88, 12, 36, 26, 6); ctx.fill(); ol(ctx, 4);
          fit(ctx, Id.text || "CARA AMAN", 190, 40, 900); ctx.fillStyle = BROWN; ctx.fillText(Id.text || "CARA AMAN", -14, 0);
          // padlock
          ctx.save(); ctx.translate(120, 50); ctx.rotate(Math.sin(t * 4) * .08); ctx.beginPath(); ctx.arc(0, -26, 22, Math.PI, 0); ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -32, -26, 64, 52, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(0, -4, 7, 0, TAU); ctx.fill(); ctx.restore();
          ctx.restore(); if (ki < .9) burstFx(ctx, X, Y, ki, GOLD, 10, 200); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rd = f.ride || {}; add(.2, "whoosh"); (Rd.bumps || []).forEach((b, j) => add(tOf(s, b, .15 + j * .12, i), "pop")); if (Rd.crack) add(tOf(s, Rd.crack, .4, i), "ping"); if (f.photo){ add(tOf(s, f.photo, .5, i), "whoosh"); add(tOf(s, f.photo, .5, i) + .5, "pop"); } if (f.idea) add(tOf(s, f.idea, .8, i), "chime"); });

  /* ================= cetak: the SOP is a mould made from the best result ================= */
  // f.mould {x, y, w, h, drop:{cue}, from (toon idx with the best box), press:{cue}, to:[idx], print:{cue}, check:{cue}, label}
  function miniBox(ctx, s, good){ ctx.save(); ctx.scale(s, s); rr(ctx, -60, -50, 120, 100, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "#C9A66B"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(0, 50); ctx.stroke();
    rr(ctx, -44, -6, 50, 34, 5); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3);
    if (good){ ctx.beginPath(); ctx.arc(38, -38, 22, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 3); ico(ctx, "check", 38, -38, 28, "#FFFFFF", 3); } ctx.restore(); }
  TT.scene("j2611221020121_cetak", "Cerita: cetakan SOP dari hasil terbaik", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Md = Object.assign({ x: 560, y: 780, w: 420, h: 300, label: "SOP" }, f.mould || {});
    const tDrop = tOf(s, Md.drop, .1, idx), tPress = tOf(s, Md.press, .55, idx), tPrint = tOf(s, Md.print, .8, idx), tChk = tOf(s, Md.check, .92, idx);
    base(ctx, s, t, { env: "info",
      spots: { mould: [Md.x, Md.y + 120, 1.15] },
      front: (ctx2, c, sts) => {
        if (t < tDrop) return; const kd = t - tDrop, dq = clamp(kd / .5, 0, 1), land = kd > .5 ? Math.sin((kd - .5) * 16) * Math.exp(-(kd - .5) * 6) : 0;
        const kp = t - tPress, press = kp > .7 && kp < 1.1 ? Math.sin((kp - .7) / .4 * Math.PI) : 0;
        const x = Md.x, y = Md.y - (1 - eIn(dq)) * 1100 + Math.sin(t * 1.8) * 10, W = Md.w, H = Md.h;
        glowAt(ctx, x, y, W * 1.2, GOLD, .2 + (kp > .9 ? .2 : 0));
        if (kd > .5 && kd < 1.2) burstFx(ctx, x, y + H / 2, kd - .5, CREAM, 10, 260);
        // the clay block
        ctx.save(); ctx.translate(x, y); ctx.scale(1 + (land + press * .5) * .07, 1 - (land + press * .5) * .07);
        ctx.beginPath(); ctx.moveTo(-W / 2, -H / 2 + 40); ctx.lineTo(-W / 2 + 60, -H / 2); ctx.lineTo(W / 2 + 60, -H / 2); ctx.lineTo(W / 2, -H / 2 + 40); ctx.closePath(); ctx.fillStyle = "#D98A5A"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.moveTo(W / 2, -H / 2 + 40); ctx.lineTo(W / 2 + 60, -H / 2); ctx.lineTo(W / 2 + 60, H / 2 - 40); ctx.lineTo(W / 2, H / 2); ctx.closePath(); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6);
        rr(ctx, -W / 2, -H / 2 + 40, W, H - 40, 12); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 7);
        // imprint after the press
        const iq = clamp((kp - .85) / .4, 0, 1);
        if (iq > 0){ ctx.save(); ctx.globalAlpha = iq; rr(ctx, -110, -H / 2 + 70, 220, 150, 12); ctx.fillStyle = "#7A3F22"; ctx.fill(); ctx.strokeStyle = hexA(GOLD, .6 + .4 * Math.sin(t * 5)); ctx.lineWidth = 8; ctx.stroke();
          ctx.strokeStyle = hexA(GOLD, .5); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, -H / 2 + 70); ctx.lineTo(0, -H / 2 + 220); ctx.stroke(); ctx.restore(); }
        font(ctx, 900, 70, FAM); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(Md.label, 0, H / 2 - 30); font(ctx, 800, 26, FAM); ctx.fillText("CETAKAN CARA TERBAIK", 0, H / 2 - 82); ctx.textAlign = "left";
        ctx.restore();
        // the best box flies from the expert's hands and presses in
        const st0 = sts[Md.from ?? 0]; if (st0 && kp > -0.1 && kp < 1.0){ const p0 = lp(st0, 20, -50), q = clamp(kp / .75, 0, 1), e = easeIO(q), bx = lerp(p0[0], x, e), by = lerp(p0[1], y - H / 2 - 60, e) - Math.sin(q * Math.PI) * 300 + press * 90;
          glowAt(ctx, bx, by, 150, GOLD, .5); ctx.save(); ctx.translate(bx, by); ctx.rotate((1 - e) * -.6); miniBox(ctx, 1.1, true); ctx.restore(); }
        if (kp > .9 && kp < 1.8) burstFx(ctx, x, y - 20, kp - .9, GOLD, 12, 280);
        // printed copies fly to the others
        (Md.to || []).forEach((j, n) => { const st = sts[j]; if (!st) return; const k = t - tPrint - n * .35; if (k < 0) return; const q = clamp(k / .8, 0, 1), e = easeIO(q), dst = lp(st, 18, -54);
          const bx = lerp(x, dst[0], e), by = lerp(y - 40, dst[1], e) - Math.sin(q * Math.PI) * 260;
          if (q < 1){ for (let i = 1; i < 5; i++){ const qq = Math.max(0, q - i * .05); ctx.globalAlpha = .25 * (1 - i / 5); ctx.beginPath(); ctx.arc(lerp(x, dst[0], easeIO(qq)), lerp(y - 40, dst[1], easeIO(qq)) - Math.sin(qq * Math.PI) * 260, 40, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); } ctx.globalAlpha = 1; }
          ctx.save(); ctx.translate(bx, by + (q >= 1 ? Math.sin((k - .8) * 16) * 8 * Math.exp(-(k - .8) * 5) : 0)); ctx.rotate((1 - e) * 4); miniBox(ctx, .85, t > tChk); ctx.restore();
          if (k < .4) { ctx.save(); ctx.globalAlpha = 1 - k / .4; textO(ctx, "CETAK!", x + (n ? 150 : -150), y - H / 2 - 60 - k * 100, 54, GOLD); ctx.restore(); }
          const kc = t - tChk - n * .15; if (kc > 0){ const h = headOf(st), sc = eBack(clamp(kc / .4, 0, 1)), cx2 = h[0] + h[2] * .9, cy2 = h[1] - h[2] * 1.35; ctx.save(); ctx.translate(cx2, cy2); ctx.scale(sc, sc); ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ico(ctx, "check", 0, 0, 54, "#FFFFFF", 3); ctx.restore(); if (kc < .8) burstFx(ctx, cx2, cy2, kc, GOLD, 8, 110); } });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Md = f.mould || {}; if (Md.drop){ add(tOf(s, Md.drop, .1, i), "whoosh"); add(tOf(s, Md.drop, .1, i) + .5, "pop"); } if (Md.press){ add(tOf(s, Md.press, .55, i), "whoosh"); add(tOf(s, Md.press, .55, i) + .85, "pop"); add(tOf(s, Md.press, .55, i) + 1, "chime"); }
    (Md.to || []).forEach((j, n) => { if (Md.print) add(tOf(s, Md.print, .8, i) + n * .35, "whoosh"); }); if (Md.check) add(tOf(s, Md.check, .92, i), "chime"); });

  /* ================= kemas: packing table, four steps ================= */
  TT.scene("j2611221020121_kemas", "Cerita: meja kemas empat langkah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Pk = Object.assign({ x: 560, top: 1330 }, f.pack || {}), steps = (Pk.steps || []).map((st, j) => Object.assign({ T: tOf(s, st, .2 + j * .15, idx), j }, st));
    const T = kind => { const st = steps.find(z => z.kind === kind); return st ? st.T : 1e9; };
    const tW = T("wrap"), tF = T("fill"), tL = T("label"), tTp = T("tape"), tD = tOf(s, Pk.done, .9, idx);
    const X = Pk.x, TOP = Pk.top;
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      spots: { box: [X, TOP - 200, 1.25] },
      front: (ctx2, c, sts) => {
        // table
        ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(-200, TOP + 40, 1500, 40);
        rr(ctx, -300, TOP, 1700, 46, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#A9643B"; ctx.fillRect(-300, TOP + 46, 1700, 400); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-300, TOP + 46, 1700, 400);
        ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 5; for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.moveTo(-300, TOP + 110 + k * 60); ctx.lineTo(1400, TOP + 110 + k * 60); ctx.stroke(); }
        // box: shifts right after done
        const kd = t - tD, slide = kd > .2 ? eIn(clamp((kd - .2) / .8, 0, 1)) * 0 : 0, hop = kd > 0 && kd < .5 ? Math.sin(kd / .5 * Math.PI) * 60 : 0;
        const bx = X + 60 + slide, bw = 300, bh = 210, by = TOP - hop, dep = 70;
        const closeQ = clamp((t - tL + .05) / .35, 0, 1);
        // back flaps (open)
        if (closeQ < 1){ const fa = 1 - closeQ; ctx.fillStyle = "#C88E54"; ctx.beginPath(); ctx.moveTo(bx - bw / 2 + dep * .5, by - bh - dep * .6); ctx.lineTo(bx + bw / 2 + dep * .5, by - bh - dep * .6); ctx.lineTo(bx + bw / 2 + dep * .5 + 10 * fa, by - bh - dep * .6 - 110 * fa); ctx.lineTo(bx - bw / 2 + dep * .5 - 10 * fa, by - bh - dep * .6 - 110 * fa); ctx.closePath(); ctx.fill(); ol(ctx, 5); }
        // box interior top (parallelogram)
        ctx.beginPath(); ctx.moveTo(bx - bw / 2, by - bh); ctx.lineTo(bx + bw / 2, by - bh); ctx.lineTo(bx + bw / 2 + dep, by - bh - dep * .6); ctx.lineTo(bx - bw / 2 + dep, by - bh - dep * .6); ctx.closePath(); ctx.fillStyle = closeQ >= 1 ? "#D9A066" : "#7A4A2A"; ctx.fill(); ol(ctx, 5);
        // glass: on the table, wrapped, then drops into the box
        const wq = clamp((t - tW) / 1.2, 0, 1), dropQ = clamp((t - tF) / .5, 0, 1), gx0 = X - 260, gx = lerp(gx0, bx + 20, easeIO(dropQ)), gy = lerp(TOP, by - bh * .35, dropQ) - Math.sin(dropQ * Math.PI) * 260;
        if (closeQ < 1 || dropQ < 1){ ctx.save(); ctx.translate(gx, gy); if (dropQ > 0 && dropQ < 1) ctx.rotate(dropQ * .6); glassShape(ctx, 120, 200, 0, t);
          if (wq > 0){ ctx.save(); ctx.beginPath(); ctx.rect(-80, -210 * wq, 160, 220 * wq); ctx.clip(); rr(ctx, -74, -206, 148, 212, 30); ctx.fillStyle = "rgba(220,240,250,.75)"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "rgba(255,255,255,.95)"; for (let yy = -190; yy < 0; yy += 26) for (let xx = -60 + ((yy / 26) % 2 ? 13 : 0); xx < 64; xx += 26){ ctx.beginPath(); ctx.arc(xx, yy, 8, 0, TAU); ctx.fill(); } ctx.restore(); }
          ctx.restore();
          if (t > tW && t < tW + 1.2) for (let i = 0; i < 5; i++){ const w = ((t - tW) * 2 + i / 5) % 1; ctx.globalAlpha = 1 - w; textO(ctx, "pop", gx + 90 + i * 12, TOP - 120 - w * 140 - i * 20, 26, CREAM, 5); ctx.globalAlpha = 1; } }
        // filler peanuts pour in
        if (t > tF + .3){ const k = t - tF - .3, lvl = clamp(k / 1.4, 0, 1); for (let i = 0; i < 26; i++){ const pq = clamp(k * 1.6 - rnd(i) * 1.2, 0, 1); if (pq <= 0) continue; const px = bx - bw / 2 + 30 + rnd(i + 3) * (bw - 10) + dep * .3, py = lerp(by - bh - 420, by - bh - 10 + rnd(i + 5) * 20 - lvl * 10, eIn(pq) * .5 + pq * .5);
            if (closeQ >= 1) continue; ctx.save(); ctx.translate(px, py); ctx.rotate(i + k * 4 * (1 - pq)); ctx.beginPath(); ctx.ellipse(0, 0, 18, 10, 0, 0, TAU); ctx.fillStyle = i % 2 ? PAPER : "#F3E2C8"; ctx.fill(); ol(ctx, 3); ctx.restore(); } }
        // closing top flaps
        if (closeQ > 0){ ctx.fillStyle = "#D9A066"; ctx.beginPath(); ctx.moveTo(bx - bw / 2, by - bh); ctx.lineTo(bx + bw / 2, by - bh); ctx.lineTo(bx + bw / 2 + dep * closeQ, by - bh - dep * .6 * closeQ); ctx.lineTo(bx - bw / 2 + dep * closeQ, by - bh - dep * .6 * closeQ); ctx.closePath(); ctx.fill(); ol(ctx, 5); }
        // front + side faces
        ctx.beginPath(); ctx.moveTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2 + dep, by - dep * .6); ctx.lineTo(bx + bw / 2 + dep, by - bh - dep * .6); ctx.lineTo(bx + bw / 2, by - bh); ctx.closePath(); ctx.fillStyle = "#B8814A"; ctx.fill(); ol(ctx, 5);
        rr(ctx, bx - bw / 2, by - bh, bw, bh, 4); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 6);
        // fragile sticker
        const kl = t - tL - .3; if (kl > 0){ const sc = 2 - eOut(clamp(kl / .25, 0, 1)); ctx.save(); ctx.translate(bx - 10, by - bh / 2); ctx.rotate(-.08); ctx.scale(sc, sc); rr(ctx, -110, -60, 220, 120, 12); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
          ctx.save(); ctx.translate(-62, 8); ctx.scale(.42, .42); glassShape(ctx, 90, 150, 1, t); ctx.restore(); font(ctx, 900, 30, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText("PECAH", -24, -6); ctx.fillText("BELAH", -24, 30); ctx.restore(); }
        // tape X on the top face
        const kt = t - tTp; if (kt > 0 && closeQ >= 1){ const q1 = clamp(kt / .35, 0, 1), q2 = clamp((kt - .35) / .35, 0, 1);
          const A = [bx - bw / 2 + 10, by - bh - 4], B2 = [bx + bw / 2 + dep - 10, by - bh - dep * .6 + 4], C2 = [bx + bw / 2 - 10, by - bh - 4], D2 = [bx - bw / 2 + dep + 10, by - bh - dep * .6 + 4];
          ctx.lineCap = "butt"; [[A, B2, q1], [C2, D2, q2]].forEach(([p, q, qq]) => { if (qq <= 0) return; ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], qq), lerp(p[1], q[1], qq)); ctx.stroke(); ctx.strokeStyle = "#C9A66B"; ctx.lineWidth = 26; ctx.stroke(); });
          ctx.strokeStyle = "#C9A66B"; ctx.lineWidth = 26; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(bx + 40, by - bh - 2); ctx.lineTo(bx + 40, by - bh + 70 * q2); ctx.stroke();
          if (kt < .9) for (let i = 0; i < 3; i++){ ctx.globalAlpha = 1 - kt / .9; textO(ctx, "sreet", bx + 200, by - bh - 140 - kt * 60, 36, CREAM, 6); ctx.globalAlpha = 1; } }
        if (kd > 0 && kd < 1.2) burstFx(ctx, bx, by - bh / 2, kd, GOLD, 12, 260);
        if (kd > 0) for (let i = 0; i < 6; i++){ const a = t * .8 + i / 6 * TAU; ctx.globalAlpha = .5 + .5 * Math.sin(t * 4 + i); sparkle(ctx, bx + Math.cos(a) * 230, by - bh / 2 + Math.sin(a) * 160, 16, i % 2 ? GOLD : CREAM); ctx.globalAlpha = 1; }
      },
      over: () => {
        // step chips at the top (the written SOP)
        const n = steps.length; steps.forEach((st, j) => { const k = t - st.T; if (k < 0) return; const sc = eBack(clamp(k / .4, 0, 1)), col = j % 2, row = Math.floor(j / 2), x = 300 + col * 480, y = 300 + row * 120;
          ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate((j % 2 ? 1 : -1) * .02); rr(ctx, -220, -48, 440, 96, 22); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5);
          ctx.beginPath(); ctx.arc(-170, 0, 32, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, String(j + 1), -170, 12, 34, CREAM, 900);
          fit(ctx, (st.text || "").toUpperCase(), 300, 38, 900); ctx.fillStyle = BROWN; ctx.fillText((st.text || "").toUpperCase(), -122, 13); ctx.restore(); });
        const kd = t - tD; if (kd > 0) stampBox(ctx, "UTUH!", 540, 600, kd, GREEN, 80, -.1);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Pk = f.pack || {}; (Pk.steps || []).forEach((st, j) => { const T0 = tOf(s, st, .2 + j * .15, i); add(T0, "pop"); if (st.kind === "fill") add(T0 + .3, "whoosh"); if (st.kind === "label") add(T0 + .3, "pop"); if (st.kind === "tape") add(T0 + .05, "whoosh"); }); if (Pk.done) add(tOf(s, Pk.done, .9, i), "chime"); });

  /* ================= tunjuk: the "I thought you did it" loop ================= */
  TT.scene("j2611221020121_tunjuk", "Cerita: lingkaran saling mengira", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Lp = f.loop || {}, pairs = (Lp.pairs || []).map((p, j) => Object.assign({ T: tOf(s, p, .5 + j * .12, idx) }, p));
    const tSpin = tOf(s, Lp.spin, .95, idx), Ph = Lp.phone, tPh = Ph ? tOf(s, Ph, .05, idx) : 1e9, Ev = Lp.env, tEv = Ev ? tOf(s, Ev, .3, idx) : 1e9;
    base(ctx, s, t, { env: "info",
      front: (ctx2, c, sts) => {
        // dusty envelope nobody sent
        if (Ev && t > tEv){ const sc = eBack(clamp((t - tEv) / .4, 0, 1)), ex = Ev.x ?? 540, ey = Ev.y ?? 1690; ctx.save(); ctx.translate(ex, ey); ctx.scale(sc, sc);
          rr(ctx, -130, -90, 260, 170, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(-130, -90); ctx.lineTo(0, 0); ctx.lineTo(130, -90); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
          font(ctx, 900, 30, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(Ev.label || "NOTULEN", 0, 55); ctx.textAlign = "left";
          ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2; for (let r = 1; r < 4; r++){ ctx.beginPath(); ctx.arc(-130, -90, r * 28, 0, Math.PI / 2); ctx.stroke(); } for (let a = 0; a < 4; a++){ ctx.beginPath(); ctx.moveTo(-130, -90); ctx.lineTo(-130 + Math.cos(a * .5) * 100, -90 + Math.sin(a * .5) * 100); ctx.stroke(); }
          for (let i = 0; i < 10; i++){ ctx.fillStyle = "rgba(170,150,120,.55)"; ctx.beginPath(); ctx.arc(-100 + rnd(i) * 200, -80 + rnd(i + 4) * 30, 4 + rnd(i) * 5, 0, TAU); ctx.fill(); }
          const fa = t * 3; ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(Math.cos(fa) * 150, -140 + Math.sin(fa * 2) * 30, 7, 0, TAU); ctx.fill(); ctx.strokeStyle = hexA(CREAM, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(Math.cos(fa) * 150, -150 + Math.sin(fa * 2) * 30, 10, 5, Math.sin(t * 40), 0, TAU); ctx.stroke();
          ctx.restore(); }
        // arrows head -> head
        const cen = sts.length ? [sts.reduce((a, st) => a + toonHead(st)[0], 0) / sts.length, sts.reduce((a, st) => a + toonHead(st)[1], 0) / sts.length - 120] : [540, 900];
        const spin = t > tSpin ? (t - tSpin) * 2.2 : 0;
        pairs.forEach((p, j) => { const A = sts[p.from], B2 = sts[p.to]; if (!A || !B2) return; const k = t - p.T; if (k < 0) return; const g = eOut(clamp(k / .5, 0, 1));
          const ha = headOf(A), hb = headOf(B2); let a0 = [ha[0], ha[1] - ha[2] * 1.2], b0 = [hb[0], hb[1] - hb[2] * 1.2];
          const rot = (pt) => { const dx = pt[0] - cen[0], dy = pt[1] - cen[1], cs = Math.cos(spin), sn = Math.sin(spin); return [cen[0] + dx * cs - dy * sn, cen[1] + dx * sn + dy * cs]; };
          if (spin){ a0 = rot(a0); b0 = rot(b0); }
          const mx = (a0[0] + b0[0]) / 2, my = (a0[1] + b0[1]) / 2, nx = -(b0[1] - a0[1]), ny = b0[0] - a0[0], nl = Math.hypot(nx, ny) || 1, bend = 170, cxp = mx + nx / nl * bend * (my > cen[1] ? -1 : 1) * (p.flip ? -1 : 1), cyp = my + ny / nl * bend * (my > cen[1] ? -1 : 1) * (p.flip ? -1 : 1);
          const pts = []; for (let q = 0; q <= g + 1e-6; q += .04){ const u = Math.min(q, g); pts.push([(1 - u) * (1 - u) * a0[0] + 2 * u * (1 - u) * cxp + u * u * b0[0], (1 - u) * (1 - u) * a0[1] + 2 * u * (1 - u) * cyp + u * u * b0[1]]); }
          if (pts.length < 2) return;
          ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])); ctx.strokeStyle = OUT; ctx.lineWidth = 30; ctx.stroke(); ctx.strokeStyle = j % 2 ? GOLD : HL; ctx.lineWidth = 18; ctx.stroke();
          const e = pts[pts.length - 1], d = pts[pts.length - 2], an = Math.atan2(e[1] - d[1], e[0] - d[0]); ctx.save(); ctx.translate(e[0], e[1]); ctx.rotate(an); ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(-24, -30); ctx.lineTo(-24, 30); ctx.closePath(); ctx.fillStyle = j % 2 ? GOLD : HL; ctx.fill(); ol(ctx, 6); ctx.restore(); });
        if (spin > 0){ const q = eBack(clamp((t - tSpin) / .5, 0, 1)); ctx.save(); ctx.translate(cen[0], cen[1]); ctx.rotate(Math.sin(t * 5) * .15); ctx.scale(q, q); textO(ctx, "?", 0, 40, 150, CREAM, 26); ctx.restore(); }
      },
      over: () => {
        if (!Ph || t < tPh) return; const k = t - tPh, sc = eBack(clamp(k / .45, 0, 1)), X = Ph.x ?? 540, Y = Ph.y ?? 470, shk = Math.sin(t * 50) * 8 * (Math.sin(t * 4) > 0 ? 1 : .2);
        ctx.save(); ctx.translate(X + shk, Y); ctx.rotate(Math.sin(t * 40) * .04); ctx.scale(sc, sc);
        for (let r = 0; r < 3; r++){ const w = (t * 1.2 + r / 3) % 1; ctx.strokeStyle = hexA(RED, (1 - w) * .9); ctx.lineWidth = 10; [-1, 1].forEach(dd => { ctx.beginPath(); ctx.arc(0, 0, 150 + w * 120, dd > 0 ? -.6 : Math.PI - .6, dd > 0 ? .6 : Math.PI + .6); ctx.stroke(); }); }
        rr(ctx, -90, -150, 180, 300, 30); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6); rr(ctx, -76, -130, 152, 260, 18); ctx.fillStyle = "#E0503A"; ctx.fill();
        ctx.fillStyle = "#FFDA6B"; ctx.beginPath(); ctx.arc(0, -20, 52, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.save(); ctx.translate(-18, -28); ctx.rotate(.4); ctx.fillRect(-12, -4, 24, 8); ctx.restore(); ctx.save(); ctx.translate(18, -28); ctx.rotate(-.4); ctx.fillRect(-12, -4, 24, 8); ctx.restore();
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 10, 16, Math.PI + .3, -.3); ctx.stroke();
        for (let i = 0; i < 3; i++){ const w = (t * 1.4 + i / 3) % 1; ctx.fillStyle = hexA("#FFFFFF", .7 * (1 - w)); ctx.beginPath(); ctx.arc(-40 + i * 40, -90 - w * 120, 14 + w * 16, 0, TAU); ctx.fill(); }
        chip(ctx, "KLIEN", 0, 110, 34, CREAM, BROWN); ctx.restore();
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Lp = f.loop || {}; (Lp.pairs || []).forEach((p, j) => add(tOf(s, p, .5 + j * .12, i), "whoosh")); if (Lp.spin) add(tOf(s, Lp.spin, .95, i), "ping"); if (Lp.phone) add(tOf(s, Lp.phone, .05, i), "ping"); if (Lp.env) add(tOf(s, Lp.env, .3, i), "pop"); });

  /* ================= voli: task balls ================= */
  function ballDraw(ctx, x, y, r, rot, label, tag){
    ctx.save(); ctx.translate(x, y); ctx.save(); ctx.rotate(rot); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ctx.save(); ctx.clip();
    ctx.fillStyle = "#F6C343"; ctx.beginPath(); ctx.ellipse(-r * .55, 0, r * .45, r * 1.1, .3, 0, TAU); ctx.fill(); ctx.fillStyle = "#5B9BD5"; ctx.beginPath(); ctx.ellipse(r * .6, -r * .1, r * .4, r * 1.1, -.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-r * 1.2, 0, r * 1.05, -.8, .8); ctx.stroke(); ctx.beginPath(); ctx.arc(r * 1.25, -r * .1, r * 1.05, Math.PI - .8, Math.PI + .8); ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ol(ctx, 6); ctx.restore();
    if (label){ fit(ctx, label, r * 2.6, 34, 900); const w = ctx.measureText(label).width + 30; rr(ctx, -w / 2, -24, w, 48, 14); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(label, 0, 11); ctx.textAlign = "left"; }
    if (tag){ ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, r); ctx.lineTo(0, r + 30); ctx.stroke(); fit(ctx, tag, 300, 30, 900); const w = ctx.measureText(tag).width + 28; rr(ctx, -w / 2, r + 30, w, 46, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(tag, 0, r + 64); ctx.textAlign = "left"; }
    ctx.restore(); }
  TT.scene("j2611221020121_voli", "Cerita: bola tugas (jatuh di tengah / ditangkap pemiliknya)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, balls = (f.balls || []).map((b, j) => Object.assign({ T: tOf(s, b, .2 + j * .2, idx), j, dur: 1.1, peak: 420, r: 62 }, b));
    let ballPos = [540, 900];
    base(ctx, s, t, { env: "beach",
      spots: { ball: () => [ballPos[0], ballPos[1] + 120, null] },
      back: (ctx2, c, sts) => { if (!f.net) return; const nx = f.net.x ?? 1000, top = GROUND - 560;
        ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(nx, GROUND); ctx.lineTo(nx, top - 20); ctx.stroke(); ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 9; ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(nx - 50, top, 100, 220); ctx.strokeStyle = "rgba(43,26,18,.7)"; ctx.lineWidth = 3; for (let yy = top; yy <= top + 220; yy += 28){ ctx.beginPath(); ctx.moveTo(nx - 50, yy + Math.sin(t * 2 + yy) * 3); ctx.lineTo(nx + 50, yy + 10 + Math.sin(t * 2 + yy) * 3); ctx.stroke(); }
        for (let xx = nx - 50; xx <= nx + 50; xx += 25){ ctx.beginPath(); ctx.moveTo(xx, top); ctx.lineTo(xx, top + 220); ctx.stroke(); }
        ctx.fillStyle = PAPER; ctx.fillRect(nx - 56, top - 10, 112, 18); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(nx - 56, top - 10, 112, 18); },
      front: (ctx2, c, sts) => {
        balls.forEach(b => { const k = t - b.T; if (k < -.01 && b.pre !== true) return;
          const src = Array.isArray(b.from) ? b.from : (sts[b.from] ? lp(sts[b.from], 20, -60) : [b.from ?? 1300, 600]);
          const toToon = typeof b.to === "number" && sts[b.to], dst = toToon ? lp(sts[b.to], 16, -58) : (Array.isArray(b.to) ? b.to : [540, GROUND - b.r]);
          const q = clamp(k / b.dur, 0, 1); let x, y, rot = k * 8;
          if (q < 1){ x = lerp(src[0], dst[0], q); y = lerp(src[1], dst[1], q) - Math.sin(q * Math.PI) * b.peak; }
          else if (toToon){ x = dst[0]; y = dst[1] + Math.sin((k - b.dur) * 18) * 14 * Math.exp(-(k - b.dur) * 6); rot = b.dur * 8; }
          else { const kk = k - b.dur, bo = Math.abs(Math.sin(kk * 7)) * 150 * Math.exp(-kk * 3.2); x = dst[0] + Math.min(kk, 1.2) * 60; y = dst[1] - bo; rot = b.dur * 8 + Math.min(kk, 1.2) * 2; }
          ballPos = [x, y];
          // shadow
          if (!toToon || q < 1){ const hgt = clamp((GROUND - y) / 900, 0, 1); ctx.fillStyle = `rgba(43,26,18,${(.3 * (1 - hgt * .7)).toFixed(3)})`; ctx.beginPath(); ctx.ellipse(x, GROUND + 6, b.r * (1.2 - hgt * .6), 14 * (1 - hgt * .5), 0, 0, TAU); ctx.fill(); }
          // motion trail
          if (q > 0 && q < 1){ for (let i = 1; i < 6; i++){ const qq = Math.max(0, q - i * .03); ctx.globalAlpha = .25 * (1 - i / 6); ctx.beginPath(); ctx.arc(lerp(src[0], dst[0], qq), lerp(src[1], dst[1], qq) - Math.sin(qq * Math.PI) * b.peak, b.r * (1 - i * .08), 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); } ctx.globalAlpha = 1; }
          const sq = (!toToon && q >= 1 && (k - b.dur) < .15) ? .25 * Math.sin((k - b.dur) / .15 * Math.PI) : 0;
          ctx.save(); ctx.translate(x, y + b.r * sq); ctx.scale(1 + sq, 1 - sq); ballDraw(ctx, 0, 0, b.r, rot, b.label, q >= 1 || k > b.dur * .5 ? b.tag : b.tag); ctx.restore();
          if (q >= 1){ const kk = k - b.dur; if (!toToon){ if (kk < .9){ burstFx(ctx, dst[0], GROUND - 20, kk, "#F3E2C8", 10, 200); ctx.save(); ctx.globalAlpha = 1 - kk / .9; ctx.translate(dst[0], GROUND - 300 - kk * 80); ctx.rotate(-.1); const sc = eBack(clamp(kk / .25, 0, 1)); ctx.scale(sc, sc); textO(ctx, "BUK!", 0, 0, 90, GOLD); ctx.restore(); }
              for (let i = 0; i < 8; i++){ const w = clamp(kk / 1.2, 0, 1); ctx.fillStyle = hexA("#EAD7B5", .7 * (1 - w)); ctx.beginPath(); ctx.arc(dst[0] + (rnd(i) - .5) * 260 * (.4 + w), GROUND - 10 - rnd(i + 3) * 60 * w, 18 + 20 * w, 0, TAU); ctx.fill(); } }
            else { const hh = headOf(sts[b.to]); if (kk < .9) burstFx(ctx, x, y, kk, GOLD, 10, 160); const sc = eBack(clamp(kk / .4, 0, 1)); ctx.save(); ctx.translate(hh[0] - hh[2] * 1.05, hh[1] - hh[2] * 1.2); ctx.scale(sc, sc); ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ico(ctx, "check", 0, 0, 48, "#FFFFFF", 3); ctx.restore(); } }
        });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.balls || []).forEach((b, j) => { const T0 = tOf(s, b, .2 + j * .2, i); add(T0, "whoosh"); add(T0 + (b.dur ?? 1.1), typeof b.to === "number" ? "chime" : "pop"); }); });

  /* ================= sel: one cell crammed full, dates in three formats, formula refuses ================= */
  function dataPerson(ctx, x, y, sc, col, sign, t, ph, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 56, 11, 0, 0, TAU); ctx.fill();
    const step = o.moving ? Math.sin(ph) * 16 : 0, bob = o.moving ? Math.abs(Math.sin(ph)) * 10 : Math.sin(t * 3 + x) * 3;
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-16, -60); ctx.lineTo(-16 + step, -4); ctx.moveTo(16, -60); ctx.lineTo(16 - step, -4); ctx.stroke();
    ctx.translate(0, -bob);
    rr(ctx, -46, -150, 92, 100, 30); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(0, -186, 40, 0, TAU); ctx.fillStyle = o.skin || "#E2A77C"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-13, -190, 5.5, 0, TAU); ctx.arc(13, -190, 5.5, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath();
    if (o.sad) ctx.arc(0, -160, 12, Math.PI + .4, -.4); else ctx.arc(0, -178, 12, .3, Math.PI - .3); ctx.stroke();
    // arms up to the sign
    const sy = -300 + (o.raise || 0);
    ctx.strokeStyle = OUT; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(-40, -130); ctx.lineTo(-56, sy + 40); ctx.moveTo(40, -130); ctx.lineTo(56, sy + 40); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
    if (sign != null && !o.noSign){ ctx.save(); ctx.translate(0, sy); ctx.rotate(Math.sin(t * 2.2 + x * .01) * .05 + (o.tilt || 0)); const w = o.signW || 190; rr(ctx, -w / 2, -42, w, 84, 10); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.stroke(); ol(ctx, 3);
      fit(ctx, sign, w - 26, o.font || 40, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(sign, 0, 14); ctx.textAlign = "left"; ctx.restore(); }
    ctx.restore(); }
  function formulaBlock(ctx, x, y, sc, t, mood, k, fly){
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    if (!fly){ ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 90, 14, 0, 0, TAU); ctx.fill(); }
    else { for (let i = 0; i < 3; i++){ const w = (t * 2 + i / 3) % 1; ctx.fillStyle = hexA(GOLD, .7 * (1 - w)); ctx.beginPath(); ctx.arc((i - 1) * 30, 10 + w * 90, 16 * (1 - w) + 4, 0, TAU); ctx.fill(); } }
    ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.lineCap = "round"; const st = mood === "walk" ? Math.sin(t * 12) * 18 : 0; ctx.beginPath(); ctx.moveTo(-30, -50); ctx.lineTo(-30 + st, -4); ctx.moveTo(30, -50); ctx.lineTo(30 - st, -4); ctx.stroke();
    const shake = mood === "no" ? Math.sin(t * 22) * .12 : mood === "happy" ? Math.sin(t * 8) * .05 : 0; ctx.rotate(shake);
    rr(ctx, -90, -270, 180, 230, 26); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 7);
    rr(ctx, -70, -250, 140, 66, 12); ctx.fillStyle = mood === "no" ? "#F2B8B0" : "#D8F0D8"; ctx.fill(); ol(ctx, 4);
    fit(ctx, "=SUM", 120, 40, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText("=SUM", 0, -203); ctx.textAlign = "left";
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-30, -140, 10, 0, TAU); ctx.arc(30, -140, 10, 0, TAU); ctx.fill();
    if (mood === "no"){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-46, -164); ctx.lineTo(-16, -154); ctx.moveTo(46, -164); ctx.lineTo(16, -154); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -86, 18, Math.PI + .3, -.3); ctx.stroke();
      ctx.lineWidth = 16; ctx.strokeStyle = "#2F6F73"; ctx.beginPath(); ctx.moveTo(-90, -120); ctx.lineTo(60, -70); ctx.moveTo(90, -120); ctx.lineTo(-60, -70); ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.stroke(); }
    else { ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -110, 20, .3, Math.PI - .3); ctx.stroke(); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-90, -130); ctx.lineTo(-120, mood === "happy" ? -230 : -70); ctx.moveTo(90, -130); ctx.lineTo(120, mood === "happy" ? -230 : -70); ctx.stroke(); }
    ctx.restore(); }
  TT.scene("j2611221020121_sel", "Cerita: satu sel dijejali, tanggal beda format, rumus menolak", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Cl = Object.assign({ x: 540, y: 820, w: 520, h: 300, label: "B4" }, f.cell || {}), items = (Cl.items || []).map((it, j) => Object.assign({ T: tOf(s, it, .1 + j * .1, idx), j }, it));
    const dates = (f.dates || []).map((d, j) => Object.assign({ T: tOf(s, d, .5 + j * .08, idx), j }, d)), Fm = Object.assign({ x: 1480 }, f.formula || {}), tFi = tOf(s, Fm.in, .8, idx), tNo = tOf(s, Fm.no, .92, idx);
    const full = items.filter(it => t >= it.T).length, bulge = full >= 3 ? .06 + .03 * Math.sin(t * 9) : full * .015;
    base(ctx, s, t, { env: "night",
      spots: { cell: [Cl.x, Cl.y + 140, 1.05], dates: [1480, 1180, 1], formula: [Fm.x, 1150, 1] },
      front: (ctx2, c, sts) => {
        // the cell
        const kc = t - (items.length ? items[0].T - .4 : 0), ap = eBack(clamp(kc / .45, 0, 1)); if (ap > 0){
          ctx.save(); ctx.translate(Cl.x, Cl.y); ctx.scale(ap * (1 + bulge), ap * (1 - bulge * .6)); ctx.rotate(full >= 3 ? Math.sin(t * 13) * .02 : 0);
          // grid around
          ctx.strokeStyle = "rgba(200,220,255,.35)"; ctx.lineWidth = 4; for (let gx = -1; gx <= 1; gx++) for (let gy = -1; gy <= 1; gy++){ if (!gx && !gy) continue; ctx.strokeRect(-Cl.w / 2 + gx * Cl.w, -Cl.h / 2 + gy * Cl.h, Cl.w, Cl.h); }
          rr(ctx, -Cl.w / 2, -Cl.h / 2, Cl.w, Cl.h, 6); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = GREEN; ctx.lineWidth = 12; ctx.stroke(); ctx.fillStyle = GREEN; ctx.fillRect(Cl.w / 2 - 14, Cl.h / 2 - 14, 28, 28);
          chip(ctx, Cl.label, -Cl.w / 2 + 50, -Cl.h / 2 - 34, 34, "#E9E2D6", BROWN);
          items.forEach((it, j) => { const k = t - it.T; if (k < 0) return; const sc = eBack(clamp(k / .35, 0, 1)), pos = [[-140, -60, -.08], [110, -30, .1], [-10, 70, -.04]][j % 3];
            ctx.save(); ctx.translate(pos[0], pos[1] - (k < .35 ? (1 - k / .35) * 200 : 0)); ctx.rotate(pos[2] + Math.sin(t * 7 + j) * .04 * (full >= 3 ? 1 : .3)); ctx.scale(sc, sc);
            const cols = ["#F6D36B", "#9FD3E8", "#F7B7A3"]; fit(ctx, it.text, 280, 58, 900); const w = ctx.measureText(it.text).width + 44; rr(ctx, -w / 2, -44, w, 88, 12); ctx.fillStyle = cols[j % 3]; ctx.fill(); ol(ctx, 5); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(it.text, 0, 19); ctx.textAlign = "left"; ctx.restore(); });
          ctx.restore();
          if (full >= 3){ for (let i = 0; i < 4; i++){ const a = i / 4 * TAU + t * 2; ctx.strokeStyle = hexA(RED, .6 + .4 * Math.sin(t * 9)); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(Cl.x + Math.cos(a) * (Cl.w * .62), Cl.y + Math.sin(a) * (Cl.h * .8)); ctx.lineTo(Cl.x + Math.cos(a) * (Cl.w * .72), Cl.y + Math.sin(a) * (Cl.h * .95)); ctx.stroke(); }
            ctx.save(); ctx.translate(Cl.x + Cl.w / 2 - 20, Cl.y - Cl.h / 2 - 40); ctx.rotate(.15 + Math.sin(t * 8) * .05); textO(ctx, "PENUH!", 0, 0, 52, RED); ctx.restore(); } }
        // date creatures
        dates.forEach((d, j) => { const k = t - d.T; if (k < 0) return; const ap2 = eBack(clamp(k / .4, 0, 1)), x = d.x ?? (1300 + j * 190), hop = Math.abs(Math.sin(t * (4 + j * 1.7) + j)) * (40 + j * 20), drop = (1 - clamp(k / .35, 0, 1)) * -600;
          const shapes = [{ w: 210, h: 150, col: "#F6D36B", r: 75 }, { w: 170, h: 220, col: "#9FD3E8", r: 14 }, { w: 250, h: 120, col: "#F7B7A3", r: 0 }][j % 3];
          ctx.save(); ctx.translate(x, (f.ledge ?? 1500) - hop + drop); ctx.rotate((j - 1) * .12 + Math.sin(t * 3 + j) * .08); ctx.scale(ap2 * 1.45, ap2 * 1.45);
          ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-30, -50); ctx.lineTo(-36, 0); ctx.moveTo(30, -50); ctx.lineTo(36, 0); ctx.stroke();
          rr(ctx, -shapes.w / 2, -50 - shapes.h, shapes.w, shapes.h, shapes.r); ctx.fillStyle = shapes.col; ctx.fill(); ol(ctx, 6);
          ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-26, -50 - shapes.h + 40, 7, 0, TAU); ctx.arc(26, -50 - shapes.h + 40, 7, 0, TAU); ctx.fill();
          const fonts = [["700", 40], ["900", 44], ["600", 46]][j % 3]; font(ctx, +fonts[0], fonts[1], j === 1 ? "Georgia" : FAM); let fs = fonts[1]; while (ctx.measureText(d.text).width > shapes.w - 24 && fs > 20){ fs -= 2; font(ctx, +fonts[0], fs, j === 1 ? "Georgia" : FAM); }
          ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(d.text, 0, -50 - shapes.h / 2 + 24); ctx.textAlign = "left"; ctx.restore(); });
        // formula block
        if (t > tFi){ const k = t - tFi, wq = clamp(k / 1, 0, 1), x = lerp(Fm.x + 600, Fm.x, eOut(wq)), mood = t > tNo ? "no" : (wq < 1 ? "walk" : "idle");
          const LY = (f.ledge ?? 1500) + 10; formulaBlock(ctx, x, LY, 1.45, t, mood, k);
          if (t > tNo){ const kn = t - tNo, sc = eBack(clamp(kn / .4, 0, 1)); ctx.save(); ctx.translate(x, LY - 470); ctx.rotate(-.06 + Math.sin(t * 6) * .03); ctx.scale(sc, sc); rr(ctx, -150, -50, 300, 100, 16); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6); textC(ctx, "#VALUE!", 0, 18, 50, "#FFFFFF", 900); ctx.restore();
            for (let i = 0; i < 4; i++){ const w = ((t - tNo) * .9 + i / 4) % 1; ctx.fillStyle = hexA("#FFFFFF", .55 * (1 - w)); ctx.beginPath(); ctx.arc(x + (i % 2 ? 100 : -100) + w * (i % 2 ? 40 : -40), LY - 400 - w * 160, 20 + w * 26, 0, TAU); ctx.fill(); }
            if (kn < .9) burstFx(ctx, x, LY - 470, kn, RED, 10, 220); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Cl = f.cell || {}; (Cl.items || []).forEach((it, j) => add(tOf(s, it, .1 + j * .1, i), "pop")); (f.dates || []).forEach((d, j) => add(tOf(s, d, .5 + j * .08, i), "pop")); const Fm = f.formula || {}; if (Fm.in) add(tOf(s, Fm.in, .8, i), "whoosh"); if (Fm.no) add(tOf(s, Fm.no, .92, i), "ping"); });

  /* ================= barisan: data parade in formation ================= */
  // f.form: {mode, cols, rows, cx, dx, S (front scale), gather, row:{cue,label}, col:{cue,label}, colIdx, rowIdx, hl, sum:{cue,c}, total:{cue,text}, totalX, totalY, fx, fy}
  TT.scene("j2611221020121_barisan", "Cerita: barisan data (baris = satu data, kolom = satu jenis)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Fo = Object.assign({ mode: "rapi", cx: 620, dx: 290, S: 1.25, cols: [], rows: [] }, f.form || {});
    const nC = Fo.cols.length, nR = Fo.rows.length, tG = Fo.mode === "rapi" ? tOf(s, Fo.gather, .15, idx) : -1, tRow = tOf(s, Fo.row, .4, idx), tCol = tOf(s, Fo.col, .6, idx);
    const hls = (Fo.hl || []).map((h, j) => ({ T: tOf(s, h, .7 + j * .1, idx), c: h.c })), tSum = tOf(s, Fo.sum, .5, idx), tTot = tOf(s, Fo.total, .75, idx), sumC = (Fo.sum && Fo.sum.c) ?? nC - 1;
    const dep = r => 1 - r * .12;
    const slot = (r, c) => { const d = dep(r); return [Fo.cx + (c - (nC - 1) / 2) * Fo.dx * d, GROUND - r * 80, Fo.S * d]; };
    const messy = (r, c) => { const i = r * 7 + c * 3 + 1, rr2 = Math.floor(rnd(i + 5) * nR); return [clamp(Fo.cx - Fo.dx * 1.4 + rnd(i) * Fo.dx * 2.8, 230, 1000), GROUND - rr2 * 80 - rnd(i + 2) * 20, Fo.S * dep(rr2)]; };
    base(ctx, s, t, { env: "info",
      spots: { form: [Fo.cx, 1200, null], total: [Fo.totalX ?? Fo.cx, 950, null] },
      mid: (ctx2, c, sts) => {
        // headers on poles behind the back row
        const [, yb, sb] = slot(nR - 1, 0), hy = yb - 340 * sb - 90;
        Fo.cols.forEach((col, j) => { const ap = eBack(clamp((t - Math.max(0, tG) - .1 - j * .12) / .45, 0, 1)); if (ap <= 0) return; const [x] = slot(nR - 1, j), hl = hls.find(h => h.c === j && t >= h.T), pul = hl ? 1.06 + .08 * Math.sin((t - hl.T) * 10) * Math.exp(-(t - hl.T) * 1.5) : 1;
          ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, hy + 30); ctx.lineTo(x, hy + 110); ctx.stroke();
          ctx.save(); ctx.translate(x, hy + Math.sin(t * 2 + j) * 4); ctx.scale(ap * pul, ap * pul); const w = Fo.dx * dep(nR - 1) - 16; rr(ctx, -w / 2, -42, w, 84, 14); ctx.fillStyle = col.col || ORANGE; ctx.fill(); ol(ctx, 5); if (hl){ ctx.strokeStyle = GOLD; ctx.lineWidth = 9; ctx.stroke(); }
          fit(ctx, col.label, w - 24, 40, 900, 22); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(col.label, 0, 14); ctx.textAlign = "left"; ctx.restore(); });
        // column highlight (behind the people)
        if (t > tCol){ const a = clamp((t - tCol) / .4, 0, 1) * (.38 + .1 * Math.sin(t * 6)), cc = Fo.colIdx ?? 1, [xf, yf, sf] = slot(0, cc), [xb, yb2, sb2] = slot(nR - 1, cc);
          ctx.fillStyle = hexA(GOLD, a); ctx.beginPath(); ctx.moveTo(xf - 120 * sf, yf + 20); ctx.lineTo(xf + 120 * sf, yf + 20); ctx.lineTo(xb + 120 * sb2, yb2 - 360 * sb2); ctx.lineTo(xb - 120 * sb2, yb2 - 360 * sb2); ctx.closePath(); ctx.fill(); }
        const people = []; for (let r = nR - 1; r >= 0; r--) for (let c2 = 0; c2 < nC; c2++) people.push([r, c2]);
        people.forEach(([r, c2]) => {
          // row highlight just before drawing its row
          if (c2 === 0 && t > tRow && r === (Fo.rowIdx ?? 0)){ const a = clamp((t - tRow) / .4, 0, 1) * (.4 + .1 * Math.sin(t * 6)), [x0, y0, s0] = slot(r, 0), [x1] = slot(r, nC - 1); ctx.fillStyle = hexA(HL, a); rr(ctx, x0 - 125 * s0, y0 - 360 * s0, x1 - x0 + 250 * s0, 380 * s0, 30); ctx.fill(); ctx.strokeStyle = hexA(GOLD, a * 1.6); ctx.lineWidth = 6; ctx.stroke(); }
          const [sx, sy, sc] = slot(r, c2), [mx, my, ms] = messy(r, c2), d = tG >= 0 ? t - tG - (r * .1 + c2 * .07) : 99, q = clamp(d / .8, 0, 1), e = easeIO(q);
          const x = lerp(mx + Math.sin(t * 1.3 + r * 2 + c2) * 50 * (1 - e), sx, e), y = lerp(my, sy, e) - Math.sin(q * Math.PI) * 50, scl = lerp(ms, sc, e);
          const moving = (q > 0 && q < 1) || (tG >= 0 && d < 0);
          const col = (Fo.cols[c2] || {}).col || ORANGE, sign = String((Fo.rows[r] || [])[c2] ?? ""); let raise = 0, noSign = false;
          if (Fo.mode === "hitung" && c2 === sumC){ const ks = t - tTot - r * .12; if (ks > 0) noSign = true; else if (t > tSum) raise = -30 * Math.abs(Math.sin((t - tSum) * 6)); }
          dataPerson(ctx, x, y, scl, col, sign, t, (t + r + c2) * 12, { moving, raise, noSign, skin: ["#E2A77C", "#C98B62", "#F0C29A", "#B5774F"][(r + c2) % 4], tilt: e < 1 ? Math.sin(t * 5 + r + c2) * .25 * (1 - e) : 0, sad: noSign });
          if (q >= 1 && d < 1.3){ ctx.globalAlpha = clamp(1 - (d - .8) / .5, 0, 1); sparkle(ctx, sx + 80 * sc, sy - 330 * sc, 18 * sc, GOLD); ctx.globalAlpha = 1; } });
        if (Fo.mode === "hitung"){ const bx = Fo.totalX ?? Fo.cx - 80, by = Fo.totalY ?? 820;
          for (let r = 0; r < nR; r++){ const ks = t - tTot - r * .12; if (ks < 0 || ks > .7) continue; const [sx, sy, sc] = slot(r, sumC), q = eIn(clamp(ks / .7, 0, 1)); const x = lerp(sx, bx, q), y = lerp(sy - 300 * sc, by, q) - Math.sin(q * Math.PI) * 150;
            ctx.save(); ctx.translate(x, y); ctx.rotate(q * 6); rr(ctx, -64, -40, 128, 80, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, String(Fo.rows[r][sumC]), 0, 16, 46, BROWN, 900); ctx.restore(); }
          const kb = t - tTot - nR * .12 - .55; if (kb > 0){ const sc = eBack(clamp(kb / .45, 0, 1)) * (1 + .03 * Math.sin(t * 5)); ctx.save(); ctx.translate(bx, by); ctx.scale(sc, sc); glowAt(ctx, 0, 0, 380, GOLD, .45);
            rr(ctx, -280, -95, 560, 190, 30); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 8); font(ctx, 800, 38, FAM); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText("TOTAL", 0, -34); fit(ctx, Fo.total.text || "", 500, 88, 900); ctx.fillText(Fo.total.text || "", 0, 62); ctx.textAlign = "left"; ctx.restore(); if (kb < 1) burstFx(ctx, bx, by, kb, GOLD, 14, 380); }
          if (t > tSum){ const k = t - tSum, wq = clamp(k / 1.0, 0, 1), fx = Fo.fx ?? 930, fy = Fo.fy ?? 900, x = lerp(fx + 500, fx, eOut(wq)), y = lerp(fy - 500, fy, eOut(wq)) + Math.sin(t * 2.5) * 14;
            formulaBlock(ctx, x, y, .8, t, t > tTot ? "happy" : "idle", k, true); } }
      }, midZ: -.5,
      over: (ctx2, c) => {
        const lab = (txt, T0, x, y, bg, fg) => { const k = t - T0; if (k < 0) return; const sc = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(x, y + Math.sin(t * 2 + y) * 4); ctx.scale(sc, sc); chip(ctx, txt, 0, 0, 46, bg, fg, -.03); ctx.restore(); };
        if (Fo.row && Fo.row.label) lab(Fo.row.label, tRow, 540, Fo.labY ?? 560, HL, BROWN);
        if (Fo.col && Fo.col.label) lab(Fo.col.label, tCol, 540, (Fo.labY ?? 560) + 105, GOLD, BROWN);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Fo = f.form || {}; if (Fo.gather){ add(tOf(s, Fo.gather, .15, i), "ping"); add(tOf(s, Fo.gather, .15, i) + .3, "whoosh"); add(tOf(s, Fo.gather, .15, i) + 1.2, "pop"); } if (Fo.row) add(tOf(s, Fo.row, .4, i), "pop"); if (Fo.col) add(tOf(s, Fo.col, .6, i), "pop");
    (Fo.hl || []).forEach((h, j) => add(tOf(s, h, .7 + j * .1, i), "pop")); if (Fo.sum) add(tOf(s, Fo.sum, .5, i), "whoosh"); if (Fo.total){ add(tOf(s, Fo.total, .75, i), "whoosh"); add(tOf(s, Fo.total, .75, i) + 1, "chime"); } });
})();
