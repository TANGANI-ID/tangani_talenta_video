/* Scene pack j2611221020183: MODE CERITA story scenes for SP31, RN31, KD31, JS31, SC31. Layout prefix j2611221020183_.
   Every scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front)
   plus its own set piece (camera keys may use on:"<spot>" for named spots):
     _ikut    work steps are little paper cards with legs; they pop out of a toon's head, float, then march after him when he leaves
              f.steps [{text, cue}], f.leaveCue, f.hero, f.bag (rolling bag with tag)
     _kabut   fog fills the room; the toon sweeps a flashlight beam over question marks; a phone rings with a growing missed-call badge
              f.fog {inCue, thick}, f.qs [{text, cue, x, y}], f.phone {x, y, cues:[..]}, f.hero
     _salin   the step cards hop from a toon's head into a binder and become written rows (+ screenshot thumb); binder flies to a colleague
              f.book {x, y, w, h, title}, f.steps [{text, cue}], f.passCue, f.to, f.doneCue, f.quiet {cue, x, y}
     _es      meeting time is an ice block on the table: it melts while time is wasted, or stays frozen while decisions pop up
              f.ice {mode: melt|keep, x, from, to, meltCue, endCue, doneCue, doneText}, f.decide [{cue, text, x}]
     _kaleng  "kick the can down the road": the reading material is a can that gets kicked from toon to toon down the street to the meeting door
              f.can {label, inCue, x0, kicks:[{cue, to}], door:{x, label}}
     _klon    a living document splits into look-alike clones with name tags; envelopes can trigger births; clones panic / show values
              f.docs [{tag, val, cue, x, y, band}], f.diffCue, f.panicCue, f.mail {from:[x,y], alt:[x,y]}
     _satu    scattered clones jump together and fuse into one big shared document with live cursors and a version history panel
              f.docs [{tag, x, y}], f.mergeCue, f.big {x, y, s, title, link}, f.cursors [{name, col, cue}], f.hist {cue, rows:[{time, name}]}, f.doneCue
     _botol   message in a bottle: thrown into the sea and drifting unanswered, or a carrier pigeon brings a quick reply
              f.bottle {mode: wait|reply, from, throwCue, text, quietCue, x, y}, f.pigeon {from, to, cue, msgs:[{cue, text}]}, f.timer {cue, text}
     _berita  worry broadcast: a breaking-news screen floats from the toon's head showing her worst guesses; stars fall to one
              f.tv {x, y, w, h, from}, f.heads [{cue, text, kind: box|thief|late|stars}], f.ticker, f.dropCue
     _jebak   a giant mousetrap with glowing bait cheese and flags; the toon is lured, then snatched back as the trap snaps shut
              f.trap {x, inCue, snapCue, label, sub, flag2}
     _topeng  a smiley-mask mascot holds an offer sign; a phone scan sweeps it, TIDAK TERDAFTAR, the mask cracks and falls, contacts spray
              f.mask {on, crackCue, dropCue}, f.sign {text, sub}, f.scan {from, cue, dur}, f.result {cue, text}, f.spray {cue} */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const PX = "j2611221020183_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const eIn = x => x * x * x;
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  const over = fn => { if (TT.CS && TT.CS.active) TT.CS.ov.push(fn); else fn(); };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const headR = st => st.size * 20.5 / 92;
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
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
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; if (k < 0 || k > (o.hold || 1.1)) return; const a = 1 - clamp((k - (o.hold || 1.1) + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 110; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function lines2(ctx, txt, maxW, size, weight){ const ws = String(txt).split(" "); let L = [txt];
    font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width > maxW && ws.length > 1){ let best = null; for (let i = 1; i < ws.length; i++){ const a = ws.slice(0, i).join(" "), b = ws.slice(i).join(" "), m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width); if (!best || m < best[0]) best = [m, [a, b]]; } L = best[1]; }
    while (Math.max(...L.map(l => ctx.measureText(l).width)) > maxW && size > 14){ size -= 2; font(ctx, weight || 800, size, FAM); }
    return { L, size }; }
  function chip(ctx, txt, x, y, bg, fg, size){ size = size || 34; font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }

  /* ---------- shared base (same data as the generic "cerita" layout + hooks) ---------- */
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const R = { c };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
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
  }

  /* ---------- little step card with face and legs (SP31) ---------- */
  function stepCard(ctx, x, y, s, rot, o){
    const w = 190, h = 150; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s * (1 + (o.sq || 0)), s * (1 - (o.sq || 0)));
    // legs
    if (o.legs !== false){ const ph = o.walk || 0; ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.lineCap = "round";
      [-1, 1].forEach(d => { const sw = Math.sin(ph + (d > 0 ? Math.PI : 0)) * 16 * (o.moving ? 1 : .25); ctx.beginPath(); ctx.moveTo(d * 36, h / 2 - 6); ctx.lineTo(d * 36 + sw, h / 2 + 40); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(d * 36 + sw + 8 * (o.look || 1), h / 2 + 44, 18, 9, 0, 0, TAU); ctx.fillStyle = BROWN; ctx.fill(); }); }
    ctx.fillStyle = "rgba(43,26,18,.2)"; rr(ctx, -w / 2 + 8, -h / 2 + 10, w, h, 16); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = o.col || PAPER; ctx.fill(); ol(ctx, 6);
    // number badge
    ctx.beginPath(); ctx.arc(-w / 2 + 14, -h / 2 + 10, 30, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); textC(ctx, String(o.num || 1), -w / 2 + 14, -h / 2 + 22, 34, "#FFFFFF", 900);
    // face
    const lk = (o.look || 0) * 4, bl = (Math.sin((o.blink || 0) * 1.3) > .985) ? .15 : 1;
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 26 + 6, -26, 14, 16 * bl, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      if (bl > .5){ ctx.beginPath(); ctx.arc(d * 26 + 6 + lk, -24, 7, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); } });
    ctx.beginPath(); if (o.sad) ctx.arc(6, 6, 12, Math.PI * 1.15, Math.PI * 1.85); else ctx.arc(6, -6, 12, Math.PI * .15, Math.PI * .85); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    const { L, size } = lines2(ctx, String(o.text || "").toUpperCase(), w - 30, 30, 800); ctx.fillStyle = BROWN; ctx.textAlign = "center";
    L.forEach((l, i) => ctx.fillText(l, 0, 40 + (i - (L.length - 1) / 2) * size * 1.05 + size * .3)); ctx.textAlign = "left";
    ctx.restore(); }

  /* ================= _ikut: steps follow the leaving toon ================= */
  TT.scene(PX + "ikut", "Cerita: langkah kerja ikut pergi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, hj = f.hero ?? 0, hero = (f.toons || [])[hj] || {}, tL = T(s, f.leaveCue, .6, idx);
    const steps = (f.steps || []).map((p, j) => Object.assign({ T: tOf(s, p, .2 + j * .1, idx), j }, p)), n = steps.length;
    const slot = j => [lerp(200, 880, n > 1 ? j / (n - 1) : .5), 610 + Math.abs(j - (n - 1) / 2) * 50];
    const pos = (p, st) => {
      const k = t - p.T, hd = toonHead(st), [sx, sy] = slot(p.j), face = st.face || 1;
      let x = sx, y = sy + Math.sin(t * 3 + p.j) * 12, sc = 1, rot = Math.sin(t * 2 + p.j) * .06, moving = false, sq = 0;
      if (k < .55){ const q = clamp(k / .55, 0, 1), e = eOut(q); x = lerp(hd[0], sx, e); y = lerp(hd[1] - 120, sy, e) - Math.sin(q * Math.PI) * 220; sc = .3 + .7 * eBack(q); rot = (1 - q) * 1.2 * (p.j % 2 ? 1 : -1); }
      const d = t - tL - p.j * .16;
      if (d > 0){ const sd = toonState(hero, s, t - .28 * (p.j + 1)), lx = sd.x - face * (250 + p.j * 175), ly = GY - 44 - 75 * .9, q = clamp(d / .55, 0, 1), e = eOut(q);
        const hop = Math.abs(Math.sin(t * 9 + p.j * 1.3)) * 34; moving = true;
        x = lerp(x, lx, e); y = lerp(y, ly, e) - Math.sin(q * Math.PI) * 140 - hop * e; sc = lerp(1, .9, e); rot = Math.sin(t * 9 + p.j) * .08; if (q > .95 && hop < 4) sq = .08; }
      return { x, y, sc, rot, moving, sq };
    };
    base(ctx, s, t, { env: "street",
      spots: { steps: [540, 820, 1] },
      under: (ctx2, c, sts, j) => { if (j !== hj || f.bag === false) return; const st = sts[j], face = st.face || 1, k = st.size / 92, bx = st.x - face * 30 * k, wob = st.moving ? Math.sin(t * 14) * .04 : 0;
        const hand = lp(st, -14, -30); ctx.save(); ctx.translate(bx, GY); ctx.rotate(wob - face * .08);
        ctx.strokeStyle = "#6B6B6B"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(hand[0] - bx, hand[1] - GY); ctx.stroke();
        rr(ctx, -70, -190, 140, 172, 18); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .25); ctx.fillRect(-48, -176, 12, 144); ctx.fillRect(36, -176, 12, 144);
        [-40, 40].forEach(dx => { ctx.beginPath(); ctx.arc(dx, -12, 13, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
        ctx.save(); ctx.translate(-20, -120); ctx.rotate(Math.sin(t * 5) * .2); rr(ctx, -50, 0, 100, 46, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, f.bagTag || "CUTI", 0, 33, 28, BROWN, 900); ctx.restore();
        ctx.restore(); },
      front: (ctx2, c, sts) => { const st = sts[hj]; if (!st) return;
        steps.forEach(p => { if (t < p.T) return; const P = pos(p, st); const lookX = (toonHead(st)[0] - P.x) > 0 ? 1 : -1;
          stepCard(ctx, P.x, P.y, P.sc, P.rot, { num: p.j + 1, text: p.text, walk: t * 9 + p.j, moving: P.moving, look: lookX, blink: t + p.j * 2, sq: P.sq, sad: false });
          const k = t - p.T - .5; if (k > 0 && k < .9) burstFx(ctx, slot(p.j)[0], slot(p.j)[1], k, HL, 8, 140);
          if (P.moving){ ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = "#E7D3B5"; for (let i = 0; i < 3; i++){ const q = (t * 2 + i / 3 + p.j * .2) % 1; ctx.beginPath(); ctx.arc(P.x - (st.face || 1) * (60 + q * 80), GY - 8 - q * 30, 14 * (1 - q) + 4, 0, TAU); ctx.fill(); } ctx.restore(); } }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.steps || []).forEach((p, j) => add(tOf(s, p, .2 + j * .1, i), "pop")); if (f.leaveCue) add(cueT(s, f.leaveCue, .6, i), "whoosh"); });

  /* ================= _kabut: fog + flashlight ================= */
  TT.scene(PX + "kabut", "Cerita: kabut dan senter", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, hj = f.hero ?? 0, Fg = Object.assign({ thick: .8 }, f.fog || {});
    const tIn = T(s, Fg.inCue, 0, idx), fq = Fg.inCue ? clamp((t - tIn) / 1.4, 0, 1) : 1;
    const qs = (f.qs || []).map((q, j) => Object.assign({ T: tOf(s, q, .25 + j * .2, idx), j }, q));
    const ph = f.phone || null, rings = ph ? (ph.cues || []).map((cu, j) => T(s, cu, .6 + j * .1, idx)).sort((a, b) => a - b) : [];
    const tgtAt = () => { let cur = null; qs.forEach(q => { if (t >= q.T) cur = q; }); if (ph && rings.length && t >= rings[rings.length - 1] + .2 && (!cur || rings[rings.length - 1] > cur.T)) return [ph.x, ph.y - 80]; return cur ? [cur.x, cur.y] : [800, 900]; };
    base(ctx, s, t, { env: "office", envOpt: { time: "night" },
      spots: { phone: () => [ph ? ph.x - 300 : 640, ph ? ph.y - 300 : 1000, 1.08] },
      front: (ctx2, c, sts) => { const st = sts[hj]; if (!st) return; const h = toonHead(st);
        // fog puffs drifting
        for (let i = 0; i < 18; i++){ const px = ((rnd(i) * 1800 + t * (30 + rnd(i + 1) * 50) * (i % 2 ? 1 : -1)) % 1900 + 1900) % 1900 - 420, py = 420 + rnd(i + 2) * 1350, r = 280 + rnd(i + 3) * 260;
          const hd = Math.hypot(px - h[0], py - h[1]); glowAt(ctx, px, py, r, "#C9D3DE", Fg.thick * fq * (.35 + .55 * clamp(hd / 650, 0, 1))); }
        ctx.fillStyle = hexA("#9AA7B6", .38 * fq * Fg.thick); ctx.fillRect(-4000, -4000, 9000, 9000);
        // flashlight beam from the hand
        const hand = lp(st, 33, -56), tg = tgtAt(), aim = Math.atan2(tg[1] - hand[1], tg[0] - hand[0]);
        const sm = t < .1 ? 0 : Math.sin(t * 1.6) * .09; const ang = aim + sm;
        if (fq > 0){ ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = .55 * fq; const L = 1150, sp = .2;
          const g = ctx.createRadialGradient(hand[0], hand[1], 20, hand[0], hand[1], L); g.addColorStop(0, "rgba(255,236,180,.9)"); g.addColorStop(1, "rgba(255,236,180,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hand[0], hand[1]); ctx.arc(hand[0], hand[1], L, ang - sp, ang + sp); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(ang); rr(ctx, -20, -18, 90, 36, 10); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5); rr(ctx, 60, -26, 30, 52, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.restore();
        // question marks in the fog
        qs.forEach(q => { const k = t - q.T; if (k < 0) return; const a = Math.atan2(q.y - hand[1], q.x - hand[0]), lit = clamp(1 - Math.abs(Math.atan2(Math.sin(a - ang), Math.cos(a - ang))) / .3, 0, 1);
          const sc = eBack(clamp(k / .45, 0, 1)), bob = Math.sin(t * 2.4 + q.j) * 14; ctx.save(); ctx.translate(q.x, q.y + bob); ctx.rotate(Math.sin(t * 1.7 + q.j) * .08); ctx.scale(sc, sc);
          ctx.globalAlpha = .45 + .55 * lit; glowAt(ctx, 0, -10, 170, GOLD, .35 * lit);
          ctx.beginPath(); ctx.arc(0, -30, 78, 0, TAU); ctx.fillStyle = lit > .3 ? GOLD : "#E9E4DA"; ctx.fill(); ol(ctx, 6); textC(ctx, "?", 0, 6, 110, BROWN, 900);
          const { L, size } = lines2(ctx, String(q.text || "").toUpperCase(), 330, 40, 900); L.forEach((l, i) => { font(ctx, 900, size, FAM); const w = ctx.measureText(l).width + 40; rr(ctx, -w / 2, 70 + i * (size + 18), w, size + 14, 12); ctx.fillStyle = BROWN; ctx.fill(); textC(ctx, l, 0, 70 + i * (size + 18) + size * .92, size, CREAM, 900); });
          ctx.restore(); });
        // ringing phone
        if (ph){ const nR = rings.filter(r => t >= r).length, last = rings.filter(r => t >= r).pop() ?? -9, rk = t - last, ringing = nR > 0;
          const shake = ringing ? Math.sin(t * 60) * .12 * (Math.sin(t * 7) > 0 ? 1 : .25) : 0;
          glowAt(ctx, ph.x, ph.y - 120, 220, RED, ringing ? .25 + .15 * Math.sin(t * 9) : 0);
          ctx.save(); ctx.translate(ph.x, ph.y - 110); ctx.rotate(shake); ctx.scale(.9, .9); prop(ctx, "phone", 0, 0, { notif: nR > 0 ? nR : null, screen: ringing ? "#FBD5C6" : "#BFE2EA" }, t);
          if (ringing){ ctx.strokeStyle = RED; ctx.lineCap = "round"; for (let r = 0; r < 3; r++){ const w = ((t * 1.6 + r / 3) % 1); ctx.globalAlpha = 1 - w; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, -40, 120 + w * 90, -2.3, -.85); ctx.stroke(); } }
          ctx.restore();
          if (rk >= 0 && rk < .8) popWord(ctx, "KRING!", ph.x + 20, ph.y - 330, rk, { size: 70, rot: 8, hold: .8 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.qs || []).forEach((q, j) => add(tOf(s, q, .25 + j * .2, i), "pop")); ((f.phone || {}).cues || []).forEach((cu, j) => { const t0 = cueT(s, cu, .6 + j * .1, i); add(t0, "ping"); add(t0 + .35, "ping"); }); });

  /* ================= _salin: steps hop from head into a binder ================= */
  TT.scene(PX + "salin", "Cerita: isi kepala jadi buku panduan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, hj = f.hero ?? 0, B = Object.assign({ x: 720, y: 760, w: 470, h: 600, title: "CARA KERJA" }, f.book || {});
    const steps = (f.steps || []).map((p, j) => Object.assign({ T: tOf(s, p, .15 + j * .12, idx), j }, p));
    const tP = T(s, f.passCue, .6, idx), tD = T(s, f.doneCue, .8, idx), Q = f.quiet || null, tQ = Q ? tOf(s, Q, .85, idx) : 1e9;
    const tIn = f.bookCue ? T(s, f.bookCue, .05, idx) : .05;
    const rowY = j => -B.h / 2 + 150 + j * 102;
    let bookPos = null;
    base(ctx, s, t, { env: "office",
      spots: { book: () => bookPos ? [bookPos[0], bookPos[1] + 80, 1.15] : [B.x, B.y, 1.15] },
      front: (ctx2, c, sts) => {
        const st = sts[hj]; if (!st) return; const hd = toonHead(st), rTo = f.to != null ? sts[f.to] : null;
        // binder position (flies to the colleague)
        const pq = clamp((t - tP) / .8, 0, 1), pe = eOut(pq); let bx = B.x, by = B.y, bs = 1, br = -.03 + Math.sin(t * 1.3) * .015;
        if (f.passTo && pq > 0){ const P2 = f.passTo; bx = lerp(B.x, P2[0], pe); by = lerp(B.y, P2[1], pe) - Math.sin(pq * Math.PI) * 200; bs = lerp(1, P2[2] ?? .65, pe); br = lerp(br, -.06, pe); }
        else if (rTo && pq > 0){ const hand = lp(rTo, 21, -47); bx = lerp(B.x, hand[0] - (rTo.face || 1) * 40, pe); by = lerp(B.y, hand[1] - 150, pe) - Math.sin(pq * Math.PI) * 200; bs = lerp(1, .62, pe); br = lerp(br, (rTo.face || 1) * -.08, pe); }
        bookPos = [bx, by];
        const iq = eBack(clamp((t - tIn) / .5, 0, 1)); if (iq <= 0) return;
        glowAt(ctx, bx, by, 420 * bs, GOLD, .25 + .1 * Math.sin(t * 3));
        ctx.save(); ctx.translate(bx, by + Math.sin(t * 2) * 8); ctx.rotate(br); ctx.scale(bs * iq, bs * iq);
        rr(ctx, -B.w / 2 - 18, -B.h / 2 - 14, B.w + 36, B.h + 28, 26); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7);
        rr(ctx, -B.w / 2, -B.h / 2, B.w, B.h, 16); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
        for (let r = 0; r < 4; r++){ ctx.beginPath(); ctx.arc(-B.w / 2 + 2, -B.h / 2 + 90 + r * 140, 16, 0, TAU); ctx.fillStyle = "#C9C2B6"; ctx.fill(); ol(ctx, 4); }
        rr(ctx, -B.w / 2 + 26, -B.h / 2 + 22, B.w - 52, 78, 12); ctx.fillStyle = BROWN; ctx.fill(); textC(ctx, B.title, 0, -B.h / 2 + 76, 40, CREAM, 900, B.w - 90);
        steps.forEach(p => { const land = p.T + .7, k = t - land; const y = rowY(p.j);
          ctx.strokeStyle = hexA(BROWN, .15); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-B.w / 2 + 40, y + 34); ctx.lineTo(B.w / 2 - 30, y + 34); ctx.stroke();
          if (k < 0) return; const wq = clamp(k / .45, 0, 1);
          ctx.beginPath(); ctx.arc(-B.w / 2 + 64, y, 26, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, String(p.j + 1), -B.w / 2 + 64, y + 11, 30, "#FFFFFF", 900);
          ctx.save(); ctx.beginPath(); ctx.rect(-B.w / 2 + 100, y - 40, (B.w - 230) * wq, 80); ctx.clip(); fit(ctx, String(p.text).toUpperCase(), B.w - 240, 36, 800); ctx.fillStyle = BROWN; ctx.fillText(String(p.text).toUpperCase(), -B.w / 2 + 104, y + 13); ctx.restore();
          if (p.shot !== false){ const q2 = eBack(clamp((k - .3) / .35, 0, 1)); if (q2 > 0){ ctx.save(); ctx.translate(B.w / 2 - 74, y); ctx.scale(q2, q2); rr(ctx, -40, -30, 80, 60, 6); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4);
            ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(-32, 22); ctx.lineTo(-8, -6); ctx.lineTo(8, 10); ctx.lineTo(18, 0); ctx.lineTo(32, 22); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(18, -14, 7, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore(); } }
          if (k < .8) burstFx(ctx, 0, y, k, HL, 8, 120); });
        if (t > tD){ ctx.save(); ctx.translate(0, B.h / 2 - 70); stampBox(ctx, f.doneText || "LUNAS ✓", 0, 0, t - tD, GREEN, 70, -.14); ctx.restore(); }
        ctx.restore();
        // flying step cards (from the head into the binder)
        steps.forEach(p => { const k = t - p.T; if (k < 0 || k > .72) return; const q = clamp(k / .7, 0, 1), e = eIn(q) * .5 + q * .5, tx = B.x - B.w / 2 + 100, ty = B.y + rowY(p.j);
          const x = lerp(hd[0], tx, e), y = lerp(hd[1] - headR(st) - 20, ty, e) - Math.sin(q * Math.PI) * 300, sc = q < .15 ? eBack(q / .15) * .9 : lerp(.9, .35, (q - .15) / .85);
          stepCard(ctx, x, y, sc, q * 6.3 * (p.j % 2 ? 1 : -1) * .3, { num: p.j + 1, text: p.text, walk: t * 14, moving: true, look: 1, blink: t }); });
        // quiet phone (no calls)
        if (Q && t > tQ){ const q = eBack(clamp((t - tQ) / .4, 0, 1)); ctx.save(); ctx.translate(Q.x, Q.y); ctx.scale(q, q); prop(ctx, "phone", 0, 0, { screen: "#DDE6D8" }, t);
          ctx.fillStyle = BROWN; for (let i = 0; i < 3; i++){ const z = (t * .6 + i / 3) % 1; ctx.globalAlpha = Math.sin(z * Math.PI); textC(ctx, "z", 70 + z * 60, -120 - z * 140, 40 + i * 8, BROWN, 900); } ctx.globalAlpha = 1;
          chip(ctx, Q.text || "0 PANGGILAN", 0, 190, GREEN, "#FFFFFF", 30); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.steps || []).forEach((p, j) => { const t0 = tOf(s, p, .15 + j * .12, i); add(t0, "whoosh"); add(t0 + .7, "pop"); });
    if (f.passCue) add(cueT(s, f.passCue, .6, i), "whoosh"); if (f.doneCue) add(cueT(s, f.doneCue, .8, i), "chime"); if (f.quiet) add(tOf(s, f.quiet, .85, i), "pop"); });

  /* ---------- meeting table (front, world) ---------- */
  function table(ctx, t, y){ y = y ?? 1470;
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(-1200, y + 40, 3500, 30);
    ctx.fillStyle = "#7E4428"; ctx.fillRect(-1200, y + 30, 3500, 420); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-1200, y + 30, 3500, 420);
    ctx.fillStyle = "#B86E40"; rr(ctx, -1220, y - 14, 3540, 52, 14); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = hexA("#FFFFFF", .12); ctx.fillRect(-1200, y - 8, 3500, 8); }

  /* ================= _es: meeting time as an ice block ================= */
  TT.scene(PX + "es", "Cerita: es waktu rapat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, I = Object.assign({ mode: "melt", x: 540, from: 30, to: 10, label: "MENIT" }, f.ice || {}), TBY = f.tableY ?? 1270, TY = TBY - 14;
    const tM = T(s, I.meltCue, .05, idx), tE = T(s, I.endCue, .85, idx), tDn = T(s, I.doneCue, .8, idx);
    const m0 = clamp((t - Math.min(tM, 1e8)) / Math.max(.5, (Math.min(tE, 1e8) - Math.min(tM, 1e8))), 0, 1), m = I.mode === "keep" ? Math.min(m0, t > tDn ? 1 : m0) : m0;
    const dec = (f.decide || []).map((d, j) => Object.assign({ T: tOf(s, d, .3 + j * .2, idx), j }, d));
    base(ctx, s, t, { env: "office",
      spots: { ice: [I.x, TY - 180, 1.3] },
      front: (ctx2, c, sts) => {
        table(ctx, t, TBY);
        // decision cards rising from the table
        dec.forEach(d => { const k = t - d.T; if (k < 0) return; const q = eBack(clamp(k / .45, 0, 1)), x = d.x ?? (d.j % 2 ? 860 : 220); ctx.save(); ctx.translate(x, TY - 110 * q + Math.sin(t * 2 + d.j) * 4); ctx.rotate((d.j % 2 ? 1 : -1) * .05);
          rr(ctx, -130, -70, 260, 130, 16); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); textC(ctx, String(d.text).toUpperCase(), 0, -10, 36, BROWN, 900, 220); ctx.restore();
          const k2 = k - .5; if (k2 > 0){ const sq = eBack(clamp(k2 / .3, 0, 1)); ctx.save(); ctx.translate(x + 70, TY - 110 * q + 30); ctx.rotate(-.2); ctx.scale(sq, sq); ctx.beginPath(); ctx.arc(0, 0, 52, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 6);
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-22, 2); ctx.lineTo(-6, 18); ctx.lineTo(24, -16); ctx.stroke(); ctx.restore(); if (k2 < .8) burstFx(ctx, x + 70, TY - 80, k2, GREEN, 10, 160); } });
        // puddle
        const pw = 120 + 520 * (I.mode === "melt" ? m : m * .45);
        ctx.fillStyle = hexA("#9FD3E8", .75); ctx.beginPath(); ctx.ellipse(I.x + 20, TY + 4, pw / 2, 14 + pw * .02, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = hexA("#5FA8C4", .8); ctx.lineWidth = 4; ctx.stroke();
        if (I.mode === "melt" && m > .3){ for (let i = 0; i < 3; i++){ const q = (t * .8 + i / 3) % 1, dx = I.x + 20 + pw / 2 - 20 - i * 30; ctx.fillStyle = hexA("#9FD3E8", .9 * (1 - q)); ctx.beginPath(); ctx.ellipse(dx, TY + 30 + q * 300, 9, 14, 0, 0, TAU); ctx.fill(); } }
        // ice block
        const frozen = I.mode === "keep", hgt = 300 * (frozen ? 1 - .45 * m : 1 - .72 * m), wd = 270 * (frozen ? 1 - .2 * m : 1 - .28 * m), x0 = I.x - wd / 2, y0 = TY - hgt;
        const wob = frozen ? 0 : Math.sin(t * 2.2) * .012;
        ctx.save(); ctx.translate(I.x, TY); ctx.rotate(wob); ctx.translate(-I.x, -TY);
        glowAt(ctx, I.x, y0 + hgt / 2, 300, frozen ? "#BFE9FF" : "#9FD3E8", frozen ? .45 + .15 * Math.sin(t * 3) : .25);
        const g = ctx.createLinearGradient(x0, y0, x0 + wd, TY); g.addColorStop(0, "rgba(225,246,255,.95)"); g.addColorStop(1, "rgba(140,200,228,.92)");
        ctx.beginPath(); const rad = 26 + (frozen ? 0 : m * 40); ctx.roundRect(x0, y0, wd, hgt, [rad, rad, 10, 10]); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "#4F94B3"; ctx.lineWidth = 7; ctx.stroke();
        // number inside the ice
        const num = Math.round(lerp(I.from, I.to, m)); ctx.save(); ctx.globalAlpha = .82; const ns = Math.min(170, hgt * .62); textC(ctx, String(num), I.x, y0 + hgt * .52 + ns * .3, ns, "#1F5E7A", 900);
        if (hgt > 150) textC(ctx, I.label, I.x, y0 + hgt * .52 + ns * .3 + 46, 36, "#1F5E7A", 800); ctx.restore();
        ctx.fillStyle = "rgba(255,255,255,.7)"; rr(ctx, x0 + 20, y0 + 16, 22, hgt * .55, 11); ctx.fill(); rr(ctx, x0 + 52, y0 + 16, 60, 16, 8); ctx.fill();
        // drips on the sides
        if (!frozen) for (let i = 0; i < 5; i++){ const q = (t * .9 + i / 5) % 1, side = i % 2 ? 1 : -1, dx = I.x + side * (wd / 2 - 10 - (i * 13) % 40), dy = y0 + 40 + q * (hgt - 40);
          ctx.fillStyle = hexA("#7CC1DD", .95); ctx.beginPath(); ctx.ellipse(dx, dy, 9, 15, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = "#4F94B3"; ctx.lineWidth = 3; ctx.stroke(); }
        // cold mist / frost
        for (let i = 0; i < 5; i++){ const q = (t * .45 + i / 5) % 1; ctx.save(); ctx.globalAlpha = .55 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.lineCap = "round"; const bx = x0 + 40 + i * (wd - 80) / 4;
          ctx.beginPath(); ctx.moveTo(bx, y0 - 10 - q * 120); ctx.quadraticCurveTo(bx - 22, y0 - 40 - q * 120, bx + 4, y0 - 70 - q * 120); ctx.stroke(); ctx.restore(); }
        if (frozen) for (let i = 0; i < 6; i++){ const a = t * 1.4 + i * 1.05; sparkle(ctx, I.x + Math.cos(a) * (wd / 2 + 30), y0 + hgt / 2 + Math.sin(a) * (hgt / 2 + 20), 14 + 6 * Math.sin(t * 5 + i), i % 2 ? "#FFFFFF" : "#BFE9FF"); }
        ctx.restore();
        if (t > tDn && I.doneText){ stampBox(ctx, I.doneText, I.x, y0 - 120, t - tDn, GREEN, 62, -.1); if (t - tDn < 1) burstFx(ctx, I.x, y0 - 120, t - tDn - .1, GOLD, 14, 280); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.decide || []).forEach((d, j) => { const t0 = tOf(s, d, .3 + j * .2, i); add(t0, "pop"); add(t0 + .5, "chime"); }); const I = f.ice || {}; if (I.doneCue) add(cueT(s, I.doneCue, .8, i), "chime"); if (I.meltCue) add(cueT(s, I.meltCue, .05, i), "whoosh"); });

  /* ================= _kaleng: kick the can down the road ================= */
  function canDraw(ctx, x, y, rot, label, dent){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const w = 120, h = 170;
    ctx.beginPath(); ctx.ellipse(0, h / 2, w / 2, 16, 0, 0, Math.PI); ctx.lineTo(-w / 2, -h / 2); ctx.ellipse(0, -h / 2, w / 2, 16, 0, Math.PI, TAU); ctx.closePath();
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, "#9BA4AE"); g.addColorStop(.45, "#E8EDF2"); g.addColorStop(1, "#7C8691"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.ellipse(0, -h / 2, w / 2, 16, 0, 0, TAU); ctx.fillStyle = "#C9D0D8"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -w / 2 + 2, -46, w - 4, 92, 4); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    const L = String(label || "").toUpperCase().split("\n"); L.forEach((l, i) => textC(ctx, l, 0, -8 + i * 34 - (L.length - 1) * 10, 28, "#FFFFFF", 900, w - 14));
    if (dent){ ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-30, -70); ctx.lineTo(-10, -58); ctx.lineTo(-26, -48); ctx.stroke(); }
    ctx.restore(); }
  TT.scene(PX + "kaleng", "Cerita: menendang kaleng (menunda)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, C = Object.assign({ label: "BAHAN\nRAPAT", x0: 640 }, f.can || {});
    const tIn = tOf(s, C.inCue ? { cue: C.inCue } : { at: .2 }, .05, idx), kicks = (C.kicks || []).map((k, j) => Object.assign({ T: tOf(s, k, .5 + j * .2, idx), j }, k));
    const canAt = tt => { // position of the can at time tt
      let x = C.x0, y = GY - 85, rot = 0, air = false, k0 = -9;
      if (tt < tIn){ const q = 0; return { x, y: -400, rot, air: true, k0, show: false }; }
      const dq = clamp((tt - tIn) / .6, 0, 1); if (dq < 1){ y = lerp(-300, GY - 85, eIn(dq)); rot = (1 - dq) * 4; return { x, y, rot, air: true, k0, show: true }; }
      let from = C.x0;
      for (const k of kicks){ if (tt < k.T) break; const D = .9 + Math.abs(k.to - from) / 1800, q = clamp((tt - k.T) / D, 0, 1);
        x = lerp(from, k.to, eOut(q)); y = GY - 85 - Math.sin(Math.min(1, q * 1.25) * Math.PI) * 330 * (q < .8 ? 1 : 0) - (q >= .8 ? Math.abs(Math.sin((q - .8) * 16)) * 60 * (1 - q) * 5 : 0); rot = q * 14 * (k.to > from ? 1 : -1) * (1 - q * .4); air = q < 1; k0 = k.T; if (q >= 1){ from = k.to; rot = Math.PI / 2 * (k.j % 2 ? 1 : -1); } }
      if (kicks.length && tt >= kicks[0].T) { const last = kicks.filter(k => tt >= k.T).pop(); if (tt - last.T > 1.2) rot = Math.PI / 2 + Math.sin(tt * 2) * .05; }
      return { x, y, rot, air, k0, show: true }; };
    base(ctx, s, t, { env: "street",
      spots: { can: () => { const p = canAt(t); return [p.x, Math.min(p.y, 1300) - 80, null]; } },
      back: () => { const D = C.door; if (!D) return; ctx.save(); ctx.translate(D.x, GY);
        ctx.fillStyle = "#E9D9BF"; rr(ctx, -260, -720, 520, 720, 10); ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#8E4E2E"; rr(ctx, -170, -560, 340, 560, 12); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#A9643B"; rr(ctx, -140, -520, 280, 220, 8); ctx.fill(); ol(ctx, 4); rr(ctx, -140, -270, 280, 220, 8); ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.arc(120, -280, 14, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
        rr(ctx, -230, -690, 460, 100, 14); ctx.fillStyle = BROWN; ctx.fill(); textC(ctx, D.label || "RUANG RAPAT", 0, -626, 46, CREAM, 900, 420); ctx.restore(); },
      front: (ctx2, c, sts) => { const p = canAt(t); if (!p.show) return;
        // shadow
        const air = Math.max(0, GY - 85 - p.y); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(p.x, GY - 4, 80 * (1 - Math.min(.6, air / 700)), 14, 0, 0, TAU); ctx.fill();
        // speed lines
        if (p.air && p.k0 > 0){ ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineCap = "round"; for (let i = 0; i < 4; i++){ ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(p.x - 110 - i * 30, p.y - 40 + i * 26); ctx.lineTo(p.x - 260 - i * 30, p.y - 40 + i * 26); ctx.stroke(); } ctx.restore(); }
        canDraw(ctx, p.x, p.y, p.rot, C.label, kicks.some(k => t > k.T));
        // mail ping when it arrives
        const kq = t - tIn - .6; if (kq > 0 && kq < 2.4){ const q = eBack(clamp(kq / .3, 0, 1)); ctx.save(); ctx.translate(p.x + 70, p.y - 150); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 42, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "1", 0, 14, 44, "#FFFFFF", 900); ctx.restore(); if (kq < .8) burstFx(ctx, p.x, p.y, kq, HL, 10, 180); }
        kicks.forEach(k => { const d = t - k.T; if (d >= 0 && d < 1) { const from = k.j ? kicks[k.j - 1].to : C.x0; burstFx(ctx, from, GY - 110, d, HL, 10, 170); popWord(ctx, k.word || "DUK!", from, GY - 420, d, { size: 90, rot: -10, hold: .9 }); } }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const C = f.can || {}; add(tOf(s, C.inCue ? { cue: C.inCue } : { at: .2 }, .05, i) + .6, "pop"); (C.kicks || []).forEach((k, j) => { const t0 = tOf(s, k, .5 + j * .2, i); add(t0, "pop"); add(t0 + .05, "whoosh"); }); });

  /* ---------- living document (KD31) ---------- */
  function docChar(ctx, x, y, s, o){
    o = o || {}; const w = 200, h = 250; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * (1 + (o.sq || 0)), s * (1 - (o.sq || 0)));
    if (o.legs !== false){ const ph = o.walk || 0; ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round";
      [-1, 1].forEach(d => { const sw = Math.sin(ph + (d > 0 ? Math.PI : 0)) * 18 * (o.moving ? 1 : .2); ctx.beginPath(); ctx.moveTo(d * 44, h / 2 - 6); ctx.lineTo(d * 44 + sw, h / 2 + 46); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(d * 44 + sw + 6, h / 2 + 50, 20, 10, 0, 0, TAU); ctx.fillStyle = BROWN; ctx.fill(); });
      // arms
      [-1, 1].forEach(d => { const wv = Math.sin((o.walk || 0) * .8 + d) * (o.panic ? 40 : 12); ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(d * (w / 2 - 4), 10); ctx.quadraticCurveTo(d * (w / 2 + 30), 0, d * (w / 2 + 40), (o.panic ? -60 : 40) + wv); ctx.stroke(); }); }
    ctx.fillStyle = "rgba(43,26,18,.2)"; rr(ctx, -w / 2 + 10, -h / 2 + 12, w, h, 12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - 40, -h / 2); ctx.lineTo(w / 2, -h / 2 + 40); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fillStyle = o.paper || PAPER; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(w / 2 - 40, -h / 2); ctx.lineTo(w / 2 - 40, -h / 2 + 40); ctx.lineTo(w / 2, -h / 2 + 40); ctx.closePath(); ctx.fillStyle = "#E3D8C6"; ctx.fill(); ol(ctx, 4);
    if (o.tag){ ctx.save(); ctx.translate(-8, -h / 2 - 4); ctx.rotate(-.05); fit(ctx, String(o.tag).toUpperCase(), 230, 32, 900); const tw = Math.min(250, ctx.measureText(String(o.tag).toUpperCase()).width + 30);
      rr(ctx, -tw / 2, -26, tw, 50, 12); ctx.fillStyle = o.band || ORANGE; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(String(o.tag).toUpperCase(), 0, 11); ctx.textAlign = "left"; ctx.restore(); }
    // face
    const lk = (o.look || 0) * 5, bl = (Math.sin((o.blink || 0) * 1.1) > .985) ? .15 : 1, ey = -52;
    [-1, 1].forEach(d => { const er = o.panic ? 22 : 17; ctx.beginPath(); ctx.ellipse(d * 34, ey, er, (er + 3) * bl, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      if (bl > .5){ ctx.beginPath(); ctx.arc(d * 34 + lk, ey + 2, o.panic ? 6 : 8, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }
      if (o.smug){ ctx.fillStyle = o.paper || PAPER; ctx.fillRect(d * 34 - 20, ey - 24, 40, 18); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(d * 34 - 20, ey - 6); ctx.lineTo(d * 34 + 20, ey - 6); ctx.stroke(); } });
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath();
    if (o.panic){ ctx.ellipse(0, -10, 14, 18, 0, 0, TAU); ctx.fillStyle = "#6B2335"; ctx.fill(); ctx.stroke(); }
    else if (o.smug){ ctx.moveTo(-22, -16); ctx.quadraticCurveTo(4, -2, 26, -24); ctx.stroke(); }
    else { ctx.arc(0, -22, 20, Math.PI * .15, Math.PI * .85); ctx.stroke(); }
    // text lines + value
    ctx.fillStyle = hexA(BROWN, .25); [[-70, 22, 140], [-70, 46, 110], [-70, 70, 128]].forEach(([lx, ly, lw2], i) => { if (!(o.val && o.showVal && i === 2)) ctx.fillRect(lx, ly, lw2 * (o.lineK ?? 1), 10); });
    if (o.val && o.showVal){ const q = eBack(clamp(o.showVal, 0, 1)); ctx.save(); ctx.translate(0, 92); ctx.scale(q, q); fit(ctx, o.val, 180, 40, 900); ctx.fillStyle = o.valCol || RED; ctx.textAlign = "center"; ctx.fillText(o.val, 0, 0); ctx.textAlign = "left"; ctx.restore(); }
    ctx.restore(); }
  function envelope(ctx, x, y, s, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); rr(ctx, -70, -46, 140, 92, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(-66, -40); ctx.lineTo(0, 8); ctx.lineTo(66, -40); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.arc(52, -40, 18, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); ctx.restore(); }

  /* ================= _klon: document clones ================= */
  TT.scene(PX + "klon", "Cerita: dokumen beranak-pinak", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, tDf = T(s, f.diffCue, .6, idx), tPn = T(s, f.panicCue, .7, idx), M = f.mail || null;
    const docs = (f.docs || []).map((d, j) => Object.assign({ T: j === 0 ? (d.cue ? tOf(s, d, .05, idx) : (d.at ?? 0)) : tOf(s, d, .1 + j * .15, idx), j }, d));
    const S = f.docScale || .85;
    base(ctx, s, t, { env: "office",
      front: (ctx2, c, sts) => {
        const hero = sts[f.hero ?? 0];
        docs.forEach((d, j) => { const k = t - d.T; if (k < 0) return; const par = docs[0], pk = t - d.T;
          let x = d.x, y = d.y, sc = S, rot = 0, sq = 0, moving = false;
          if (j > 0 && pk < .6){ const q = clamp(pk / .6, 0, 1), e = eOut(q); x = lerp(par.x, d.x, e); y = lerp(par.y, d.y, e) - Math.sin(q * Math.PI) * 260; sc = S * (.35 + .65 * eBack(q)); rot = (1 - q) * (d.x > par.x ? 1 : -1) * 2; moving = true; }
          else if (j === 0 && k < .5){ sc = S * eBack(clamp(k / .5, 0, 1)); }
          // parent squash at each birth
          if (j === 0) docs.forEach(o => { const b = t - o.T; if (o.j > 0 && b > -.15 && b < .35) sq += Math.sin(clamp((b + .15) / .5, 0, 1) * Math.PI) * .22; });
          const hop = Math.abs(Math.sin(t * (t > tPn ? 9 : 3.2) + j * 1.7)) * (t > tPn ? 60 : 18);
          if (t > tPn){ x += Math.sin(t * 5 + j * 2) * 40; rot += Math.sin(t * 8 + j) * .14; moving = true; }
          const lookX = hero ? Math.sign(hero.x - x) : 0;
          if (d.glow){ glowAt(ctx, x, y, 240, GOLD, .4); }
          docChar(ctx, x, y - hop, sc, { tag: d.tag, band: d.band, val: d.val, showVal: t > tDf ? (t - tDf - j * .12) / .35 : 0, panic: t > tPn, look: lookX, walk: t * 10 + j, moving, blink: t + j * 3, rot, sq, smug: d.smug && t > tDf });
          if (j > 0 && pk >= 0 && pk < .9) burstFx(ctx, par.x, par.y, pk, HL, 10, 170); });
        if (M) docs.forEach((d, j) => { if (j === 0) return; const k = t - (d.T - .5); if (k < 0 || k > .55) return; const q = clamp(k / .5, 0, 1), from = (j % 2 ? M.from : (M.alt || M.from)), par = docs[0];
          envelope(ctx, lerp(from[0], par.x, eIn(q) * .4 + q * .6), lerp(from[1], par.y, q) - Math.sin(q * Math.PI) * 200, 1.1, q * 6); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.docs || []).forEach((d, j) => { if (j) { const t0 = tOf(s, d, .1 + j * .15, i); add(t0, "pop"); if (f.mail) add(t0 - .5, "whoosh"); } }); if (f.diffCue) add(cueT(s, f.diffCue, .6, i), "ping"); if (f.panicCue) add(cueT(s, f.panicCue, .7, i), "whoosh"); });

  /* ================= _satu: clones fuse into one shared document ================= */
  TT.scene(PX + "satu", "Cerita: satu dokumen bersama", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bg = Object.assign({ x: 430, y: 720, s: 1.85, title: "PROPOSAL", link: "1 TAUTAN" }, f.big || {});
    const tMg = T(s, f.mergeCue, .1, idx), tDn = T(s, f.doneCue, .85, idx), H = f.hist || null, tH = H ? tOf(s, H, .6, idx) : 1e9;
    const docs = (f.docs || []), curs = (f.cursors || []).map((cu, j) => Object.assign({ T: tOf(s, cu, .3 + j * .15, idx), j }, cu));
    const bigOn = clamp((t - tMg - .55) / .45, 0, 1);
    base(ctx, s, t, { env: "office",
      spots: { big: [Bg.x + 70, Bg.y + 200, 1.05] },
      front: (ctx2, c, sts) => {
        docs.forEach((d, j) => { const k = t - tMg - j * .07; let x = d.x, y = d.y + Math.abs(Math.sin(t * 3 + j)) * -16, sc = .7, rot = Math.sin(t * 2 + j) * .06;
          if (k > 0){ const q = clamp(k / .55, 0, 1); if (q >= 1) return; const e = eIn(q); x = lerp(d.x, Bg.x, e); y = lerp(d.y, Bg.y, e) - Math.sin(q * Math.PI) * 240; sc = lerp(.7, .3, e); rot = q * 5; }
          docChar(ctx, x, y, sc, { tag: d.tag, band: d.band, look: Math.sign(Bg.x - x), walk: t * 9 + j, moving: k > 0, blink: t + j * 2, rot, panic: k <= 0 && !!f.panicStart }); });
        if (bigOn > 0){ const e = eBack(bigOn), bob = Math.sin(t * 1.8) * 10;
          glowAt(ctx, Bg.x, Bg.y, 520, GOLD, .35 + .1 * Math.sin(t * 3));
          ctx.save(); ctx.globalAlpha = .4 * bigOn; ctx.translate(Bg.x, Bg.y); ctx.rotate(t * .3); for (let i = 0; i < 12; i++){ ctx.rotate(TAU / 12); ctx.fillStyle = hexA("#FFF0C8", .55); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-50, -720); ctx.lineTo(50, -720); ctx.closePath(); ctx.fill(); } ctx.restore();
          docChar(ctx, Bg.x, Bg.y + bob, Bg.s * e, { tag: Bg.title, legs: false, look: 0, blink: t, lineK: 0 });
          // link chip
          ctx.save(); ctx.translate(Bg.x, Bg.y - 125 * Bg.s - 80 + bob); ctx.scale(e, e); font(ctx, 900, 36, FAM); const lw2 = ctx.measureText(Bg.link).width + 110; rr(ctx, -lw2 / 2, -36, lw2, 72, 36); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 5);
          icon(ctx, "link", -lw2 / 2 + 22, -20, 40, "#FFFFFF", 3); ctx.fillStyle = "#FFFFFF"; ctx.fillText(Bg.link, -lw2 / 2 + 76, 13); ctx.restore();
          // live cursors typing on the lines
          curs.forEach(cu => { const k = t - cu.T; if (k < 0) return; const row = cu.j % 3, ly = Bg.y + bob + (22 + row * 24 + 5) * Bg.s, lx0 = Bg.x - 70 * Bg.s, len = Math.min(1, .15 + k * .35) * 140 * Bg.s;
            const typed = lx0 + len * (.5 + .5 * Math.abs(Math.sin(k * 1.3))); ctx.fillStyle = hexA(cu.col, .35); ctx.fillRect(lx0, ly - 14, typed - lx0, 22);
            const cx = typed, q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(cx, ly); ctx.scale(q, q); ctx.fillStyle = cu.col; ctx.fillRect(-4, -30, 8, 46);
            font(ctx, 900, 30, FAM); const nw = ctx.measureText(cu.name).width + 26; rr(ctx, -4, -78, nw, 46, 10); ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#FFFFFF"; ctx.fillText(cu.name, 9, -45); ctx.restore(); });
          if (bigOn < 1 || t - tMg - .55 < .9) burstFx(ctx, Bg.x, Bg.y, t - tMg - .55, GOLD, 16, 380); }
        if (t > tDn && f.doneText){ stampBox(ctx, f.doneText, Bg.x, Bg.y + 150 * Bg.s, t - tDn, GREEN, 70, -.1); if (t - tDn < 1) burstFx(ctx, Bg.x, Bg.y + 150 * Bg.s, t - tDn - .1, GREEN, 14, 260); } },
      over: () => { if (!H || t < tH) return; const q = eOut(clamp((t - tH) / .5, 0, 1)), x0 = lerp(1100, 700, q), y0 = 360, w = 330, rows = H.rows || [], h = 110 + rows.length * 92;
        ctx.save(); ctx.translate(x0, y0); ctx.rotate(.02); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; rr(ctx, 0, 0, w, h, 24); ctx.fillStyle = NAVY; ctx.fill(); ctx.shadowColor = "transparent"; ctx.strokeStyle = "#2E4670"; ctx.lineWidth = 5; ctx.stroke();
        icon(ctx, "clock", 26, 26, 44, HL, 2.6); font(ctx, 900, 36, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText(H.title || "RIWAYAT", 84, 62);
        rows.forEach((r, i) => { const rq = clamp((t - tH - .3 - i * .25) / .3, 0, 1); if (rq <= 0) return; ctx.save(); ctx.globalAlpha *= rq; ctx.translate(0, 100 + i * 92 + (1 - rq) * 20);
          ctx.beginPath(); ctx.arc(40, 30, 12, 0, TAU); ctx.fillStyle = r.col || HL; ctx.fill(); font(ctx, 800, 32, FAM); ctx.fillStyle = "#A9BCDD"; ctx.fillText(r.time, 66, 24); fit(ctx, r.name, w - 80, 34, 900); ctx.fillStyle = "#FFFFFF"; ctx.fillText(r.name, 66, 62); ctx.restore(); });
        ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); if (f.mergeCue){ const t0 = cueT(s, f.mergeCue, .1, i); add(t0, "whoosh"); add(t0 + .55, "chime"); } (f.cursors || []).forEach((cu, j) => add(tOf(s, cu, .3 + j * .15, i), "pop")); if (f.hist) add(tOf(s, f.hist, .6, i), "whoosh"); if (f.doneCue) add(cueT(s, f.doneCue, .85, i), "chime"); });

  /* ================= _botol: message in a bottle / carrier pigeon ================= */
  function bottleDraw(ctx, x, y, s, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-26, -70); ctx.lineTo(26, -70); ctx.lineTo(26, -40); ctx.quadraticCurveTo(62, -30, 62, 10); ctx.lineTo(62, 90); ctx.quadraticCurveTo(62, 110, 40, 110); ctx.lineTo(-40, 110); ctx.quadraticCurveTo(-62, 110, -62, 90); ctx.lineTo(-62, 10); ctx.quadraticCurveTo(-62, -30, -26, -40); ctx.closePath();
    ctx.fillStyle = "rgba(170,220,200,.75)"; ctx.fill(); ol(ctx, 6); rr(ctx, -24, -104, 48, 40, 8); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.rotate(.15); rr(ctx, -30, -10, 60, 100, 10); ctx.fillStyle = "#FFF1D6"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA(BROWN, .4); ctx.fillRect(-18, 12, 36, 6); ctx.fillRect(-18, 30, 30, 6); ctx.fillRect(-18, 48, 36, 6); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.6)"; rr(ctx, -50, 0, 12, 80, 6); ctx.fill(); ctx.restore(); }
  function pigeon(ctx, x, y, s, t, face){ ctx.save(); ctx.translate(x, y); ctx.scale(s * (face || 1), s); const fl = Math.sin(t * 22);
    ctx.fillStyle = "#E7E9EE"; ctx.beginPath(); ctx.ellipse(-60, 6, 46, 18, -.2, 0, TAU); ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.translate(-10, -10); ctx.rotate(-.4 - fl * .7); ctx.beginPath(); ctx.ellipse(-40, 0, 70, 26, 0, 0, TAU); ctx.fillStyle = "#C9CDD6"; ctx.fill(); ol(ctx, 5); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, 70, 46, 0, 0, TAU); ctx.fillStyle = "#F2F3F6"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(56, -34, 34, 0, TAU); ctx.fillStyle = "#F2F3F6"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(86, -40); ctx.lineTo(116, -30); ctx.lineTo(86, -22); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(64, -42, 8, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.arc(66, -45, 3, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill();
    ctx.beginPath(); ctx.moveTo(26, -14); ctx.quadraticCurveTo(50, 4, 82, -10); ctx.lineWidth = 14; ctx.strokeStyle = ORANGE; ctx.stroke(); ctx.lineWidth = 4;
    ctx.save(); ctx.translate(-14, 10); ctx.rotate(.4 + fl * .7); ctx.beginPath(); ctx.ellipse(-30, -10, 64, 24, 0, 0, TAU); ctx.fillStyle = "#DADDE4"; ctx.fill(); ol(ctx, 5); ctx.restore();
    ctx.restore(); }
  function msgCard(ctx, txt, x, y, k, col){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.rotate(-.03);
    const { L, size } = lines2(ctx, txt, 440, 46, 800); const w = Math.max(...L.map(l => ctx.measureText(l).width)) + 70, h = L.length * size * 1.2 + 50;
    rr(ctx, -w / 2, -h, w, h, 26); ctx.fillStyle = col || "#DFF5D8"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(-30, -2); ctx.lineTo(-10, 34); ctx.lineTo(10, -2); ctx.fillStyle = col || "#DFF5D8"; ctx.fill(); ol(ctx, 5); ctx.fillRect(-28, -10, 36, 10);
    ctx.fillStyle = BROWN; ctx.textAlign = "center"; L.forEach((l, i) => ctx.fillText(l, 0, -h + 25 + size * .95 + i * size * 1.2)); ctx.textAlign = "left"; ctx.restore(); }
  TT.scene(PX + "botol", "Cerita: pesan dalam botol / merpati balasan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bt = Object.assign({ mode: "wait", from: 0, x: 640, y: 1190 }, f.bottle || {}), Pg = f.pigeon || null, Tm = f.timer || null;
    const tTh = Bt.mode === "wait" ? tOf(s, Bt.throwCue ? { cue: Bt.throwCue } : { at: .4 }, .15, idx) : -9, tLd = tTh + .9, tQ = T(s, Bt.quietCue, .8, idx);
    const tPg = Pg ? tOf(s, Pg, .45, idx) : 1e9, msgs = Pg ? (Pg.msgs || []).map((m, j) => Object.assign({ T: tOf(s, m, .6 + j * .2, idx), j }, m)) : [];
    let bot = null;
    base(ctx, s, t, { env: "beach",
      spots: { bottle: () => bot ? [bot[0], bot[1] - 60, 1.25] : [Bt.x, Bt.y - 60, 1.25] },
      front: (ctx2, c, sts) => {
        const st = sts[Bt.from]; let x = Bt.x, y = Bt.y, sc = 1.15, rot = Math.sin(t * 2) * .25, inHand = false;
        const tSh = Bt.showCue ? T(s, Bt.showCue, .1, idx) : tTh - 1;
        if (Bt.mode === "wait"){ if (t < tSh) return; if (t < tTh){ const hp = lp(st, 25, -70); x = hp[0]; y = hp[1] - 40; sc = .7 * eBack(clamp((t - tSh) / .4, 0, 1)); rot = -.3 + Math.sin(t * 3) * .1; inHand = true; }
          else if (t < tLd){ const q = (t - tTh) / .9, hp = lp(st, 25, -70); x = lerp(hp[0], Bt.x, q); y = lerp(hp[1], Bt.y, q) - Math.sin(q * Math.PI) * 420; sc = lerp(.8, 1.15, q); rot = q * 9; }
          else { const d = t - tLd; x = Bt.x + d * 26; y = Bt.y - d * 9 + Math.sin(t * 2.4) * 10; sc = Math.max(.7, 1.15 - d * .04); } }
        else { x = Bt.x + Math.sin(t * .5) * 20; y = Bt.y + Math.sin(t * 2.4) * 10; }
        bot = [x, y];
        if (!inHand){ ctx.save(); ctx.globalAlpha = .5; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y + 95 * sc, 110 * sc + Math.sin(t * 3) * 10, 18 * sc, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
        bottleDraw(ctx, x, y, sc, rot);
        const sp = t - tLd; if (Bt.mode === "wait" && sp > 0 && sp < 1){ for (let i = 0; i < 10; i++){ const a = -Math.PI * (.1 + .8 * i / 9), r = 60 + sp * 220; ctx.fillStyle = hexA("#E3F4F8", 1 - sp); ctx.beginPath(); ctx.arc(Bt.x + Math.cos(a) * r, Bt.y + 60 + Math.sin(a) * r * .9 + sp * sp * 200, 14 * (1 - sp) + 4, 0, TAU); ctx.fill(); } }
        // chat label above the bottle
        if (Bt.text && t > tLd - .2){ const k = t - tLd + .2, q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(x, y - 190 * sc - 40); ctx.scale(q * Math.max(.75, sc), q * Math.max(.75, sc)); font(ctx, 800, 40, FAM); const w = ctx.measureText(Bt.text).width + 120;
          rr(ctx, -w / 2, -52, w, 92, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = BROWN; ctx.fillText(Bt.text, -w / 2 + 30, 6);
          ctx.strokeStyle = t > tQ ? "#9AA0A6" : "#9AA0A6"; ctx.lineWidth = 5; ctx.lineCap = "round"; [0, 16].forEach(dx => { ctx.beginPath(); ctx.moveTo(w / 2 - 74 + dx, 0); ctx.lineTo(w / 2 - 64 + dx, 12); ctx.lineTo(w / 2 - 46 + dx, -12); ctx.stroke(); });
          ctx.restore(); }
        // silence: typing dots that fade, then a lonely cricket-like "..."
        if (t > tQ){ const k = t - tQ; for (let i = 0; i < 3; i++){ const a = clamp(1 - (k - i * .5) / 1.2, 0, 1) * (Math.sin(t * 6 + i) * .3 + .7); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x - 40 + i * 40, y - 360 * sc - 40, 16, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); } ctx.globalAlpha = 1;
          if (k > .6) popWord(ctx, f.quietWord || "SUNYI...", 560, 560, k - .6, { size: 92, rot: -4, hold: 9, col: "#9FD3E8" }); }
        // pigeon with reply
        if (Pg && t > tPg){ const a = sts[Pg.from], b = sts[Pg.to]; if (a && b){ const k = t - tPg, q = clamp(k / .9, 0, 1), e = eOut(q), ha = lp(a, 20, -66), hb = toonHead(b), tx = hb[0] + (a.x > b.x ? 210 : -210), ty = hb[1] - 300;
          const px = lerp(ha[0], tx, e), py = lerp(ha[1], ty, e) - Math.sin(q * Math.PI) * 240 + (q >= 1 ? Math.sin(t * 4) * 16 : 0);
          if (q < 1){ ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineCap = "round"; ctx.lineWidth = 7; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(px + (a.x > b.x ? 1 : -1) * (90 + i * 40), py - 30 + i * 22); ctx.lineTo(px + (a.x > b.x ? 1 : -1) * (200 + i * 40), py - 30 + i * 22); ctx.stroke(); } ctx.restore(); }
          pigeon(ctx, px, py, 1.2, t, a.x > b.x ? -1 : 1);
          msgs.forEach((m, j) => { const nx = msgs[j + 1]; if (nx && t > nx.T) return; msgCard(ctx, m.text, (px + 540) / 2 + (a.x > b.x ? -30 : 30), py - 90, t - m.T); });
          if (k > .9 && k < 1.8) burstFx(ctx, px, py, k - .9, GOLD, 12, 200); } }
        if (Tm){ const k = t - tOf(s, Tm, .5, idx); if (k > 0){ const q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(Tm.x ?? 860, Tm.y ?? 600); ctx.scale(q, q); ctx.rotate(Math.sin(t * 3) * .05);
          ctx.beginPath(); ctx.arc(0, 0, 96, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 8); rr(ctx, -18, -126, 36, 30, 6); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4);
          ctx.strokeStyle = ORANGE; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 74, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(k / 1.2, 0, 1) * .15); ctx.stroke();
          textC(ctx, Tm.text || "2 MNT", 0, 14, 40, BROWN, 900, 150); ctx.restore(); if (k < .9) burstFx(ctx, Tm.x ?? 860, Tm.y ?? 600, k, HL, 10, 170); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Bt = f.bottle || {}; if (Bt.mode !== "reply"){ const t0 = tOf(s, Bt.throwCue ? { cue: Bt.throwCue } : { at: .4 }, .15, i); add(t0, "whoosh"); add(t0 + .9, "pop"); }
    if (f.pigeon){ const t0 = tOf(s, f.pigeon, .45, i); add(t0, "whoosh"); add(t0 + .9, "chime"); (f.pigeon.msgs || []).forEach((m, j) => add(tOf(s, m, .6 + j * .2, i), "pop")); } if (f.timer) add(tOf(s, f.timer, .5, i), "ping"); });

  /* ================= _berita: worry broadcast ================= */
  function starP(ctx, x, y, r, fill){ ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ol(ctx, 5); }
  TT.scene(PX + "berita", "Cerita: siaran kekhawatiran", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, V = Object.assign({ x: 600, y: 640, w: 720, h: 520, from: 0 }, f.tv || {});
    const heads = (f.heads || []).map((h, j) => Object.assign({ T: tOf(s, h, .2 + j * .2, idx), j }, h)), tDr = T(s, f.dropCue, .9, idx), tOn = heads.length ? heads[0].T - .3 : .2;
    base(ctx, s, t, { env: "home",
      spots: { tv: [V.x, V.y + 420, 1.0] },
      front: (ctx2, c, sts) => {
        const st = sts[V.from]; if (!st) return; const on = eBack(clamp((t - tOn) / .5, 0, 1)); if (on <= 0) return; const hd = toonHead(st);
        // thought dots
        for (let i = 0; i < 3; i++){ const q = (i + 1) / 4, x = lerp(hd[0] + 60, V.x - V.w / 2 + 80, q), y = lerp(hd[1] - headR(st) - 20, V.y + V.h / 2, q); ctx.beginPath(); ctx.arc(x, y + Math.sin(t * 3 + i) * 6, (12 + i * 9) * on, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); }
        ctx.save(); ctx.translate(V.x, V.y + Math.sin(t * 1.6) * 8); ctx.rotate(Math.sin(t * 1.1) * .012); ctx.scale(on, on);
        const w = V.w, h = V.h; rr(ctx, -w / 2 - 22, -h / 2 - 22, w + 44, h + 44, 36); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 7);
        ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 20); ctx.clip();
        const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, "#1B2E52"); g.addColorStop(1, "#0E1830"); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
        for (let i = 0; i < 6; i++){ const q = (t * .25 + i / 6) % 1; ctx.fillStyle = hexA("#5D7BB0", .18); ctx.fillRect(-w / 2 + q * w * 1.4 - 200, -h / 2, 60, h); }
        let cur = null; heads.forEach(hh => { if (t >= hh.T) cur = hh; });
        if (cur){ const k = t - cur.T;
          // illustration
          ctx.save(); ctx.translate(0, 40);
          if (cur.kind === "box"){ const fx = Math.sin(t * 1.8) * 160, fy = Math.cos(t * 2.4) * 40 - 20, fl = Math.sin(t * 20); ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.sin(t * 2) * .15);
            [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * 70, -40); ctx.rotate(d * (-.5 - fl * .6)); ctx.beginPath(); ctx.ellipse(d * 50, 0, 60, 22, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.restore(); });
            rr(ctx, -80, -70, 160, 130, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#B57B44"; ctx.fillRect(-14, -70, 28, 130); ctx.restore();
            for (let i = 0; i < 3; i++) textC(ctx, "?", -220 + i * 220, -60 + Math.sin(t * 3 + i) * 14, 70, GOLD, 900); }
          else if (cur.kind === "thief"){ const rx = ((t * 260) % (w + 300)) - w / 2 - 150; ctx.save(); ctx.translate(rx, 0); const bob = Math.abs(Math.sin(t * 12)) * 14;
            ctx.fillStyle = "#2C2433"; rr(ctx, -50, -60 - bob, 100, 120, 30); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -100 - bob, 46, 0, TAU); ctx.fill(); ol(ctx, 4);
            ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-36, -112 - bob, 72, 18); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-14, -103 - bob, 5, 0, TAU); ctx.arc(16, -103 - bob, 5, 0, TAU); ctx.fill();
            ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 14; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 20, 50 - bob); ctx.lineTo(d * 20 + Math.sin(t * 12 + d) * 30, 110); ctx.stroke(); });
            ctx.beginPath(); ctx.arc(-80, -40 - bob, 50, 0, TAU); ctx.fillStyle = "#C9A26B"; ctx.fill(); ol(ctx, 4); textC(ctx, "Rp", -80, -28 - bob, 34, BROWN, 900); ctx.restore(); }
          else if (cur.kind === "late"){ ctx.save(); ctx.rotate(Math.sin(t * 2) * .05); ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = BROWN; ctx.lineWidth = 10; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * 4) * 70, -Math.cos(t * 4) * 70); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * .4) * 46, -Math.cos(t * .4) * 46); ctx.stroke(); ctx.restore(); }
          else if (cur.kind === "stars"){ for (let i = 0; i < 5; i++){ const d = t - tDr - (4 - i) * .12, fall = i > 0 && d > 0; let sx = -240 + i * 120, sy = -10, r = 0;
              if (fall){ sy += d * d * 900 + d * 60; r = d * 6 * (i % 2 ? 1 : -1); sx += d * 60 * (i - 2); }
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(r); starP(ctx, 0, 0, 50 * eBack(clamp((k - i * .1) / .3, 0, 1)), i === 0 || !fall ? GOLD : "#9AA0A6"); ctx.restore(); } }
          ctx.restore();
          // headline
          const tq = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(0, -h / 2 + 140); ctx.scale(tq, tq); const U = String(cur.text).toUpperCase(); let sz = 74; font(ctx, 900, sz, FAM); while (ctx.measureText(U).width > w - 70 && sz > 34){ sz -= 4; font(ctx, 900, sz, FAM); }
          outlineWords(ctx, U.split(" ").map(z => ({ w: z, hl: false })), 0, 0, sz, { sw: sz * .2 }); ctx.restore();
          if (k < .28){ for (let i = 0; i < 14; i++){ ctx.fillStyle = hexA(i % 2 ? "#FFFFFF" : "#8899BB", .5); ctx.fillRect(-w / 2, -h / 2 + rnd(i + Math.floor(t * 30)) * h, w, 6 + rnd(i + 9) * 22); } } }
        // live tag + ticker
        rr(ctx, -w / 2 + 20, -h / 2 + 20, 250, 54, 10); ctx.fillStyle = RED; ctx.fill(); ctx.beginPath(); ctx.arc(-w / 2 + 46, -h / 2 + 47, 10, 0, TAU); ctx.fillStyle = Math.sin(t * 8) > 0 ? "#FFFFFF" : hexA("#FFFFFF", .3); ctx.fill();
        textC(ctx, f.liveTag || "KABAR TERKINI", -w / 2 + 158, -h / 2 + 59, 28, "#FFFFFF", 900, 180);
        ctx.fillStyle = RED; ctx.fillRect(-w / 2, h / 2 - 64, w, 64); ctx.fillStyle = GOLD; ctx.fillRect(-w / 2, h / 2 - 64, 120, 64); textC(ctx, "INFO", -w / 2 + 60, h / 2 - 20, 30, BROWN, 900);
        ctx.save(); ctx.beginPath(); ctx.rect(-w / 2 + 120, h / 2 - 64, w - 120, 64); ctx.clip(); font(ctx, 800, 32, FAM); ctx.fillStyle = "#FFFFFF"; const tk = (f.ticker || "") + "   •   "; const tw = ctx.measureText(tk).width; const off = (t * 170) % tw;
        for (let i = 0; i < 4; i++) ctx.fillText(tk, -w / 2 + 130 - off + i * tw, h / 2 - 21); ctx.restore();
        ctx.restore(); ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.heads || []).forEach((h, j) => add(tOf(s, h, .2 + j * .2, i), j ? "whoosh" : "ping")); if (f.dropCue) { const t0 = cueT(s, f.dropCue, .9, i); add(t0, "pop"); add(t0 + .4, "pop"); } });

  /* ================= _jebak: mousetrap with bait ================= */
  TT.scene(PX + "jebak", "Cerita: perangkap umpan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Tr = Object.assign({ x: 760, label: "CAIR 5 MENIT", sub: "TANPA SYARAT" }, f.trap || {});
    const tIn = Tr.inCue ? T(s, Tr.inCue, .1, idx) : -9, tSn = T(s, Tr.snapCue, .7, idx), lure = Tr.lure ?? 0, TrY = Tr.y ?? GY, TS = Tr.s ?? 1;
    base(ctx, s, t, { env: "home", envOpt: { time: "night" },
      spots: { trap: [Tr.x, TrY - 300, 1.15], cheese: [Tr.x + 120, TrY - 340, 1.35] },
      front: (ctx2, c, sts) => {
        if (TrY < GY){ ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(Tr.x, GY, 460, 26, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#6E3B22"; [-380, 340].forEach(dx => { rr(ctx, Tr.x + dx, TrY, 40, GY - TrY, 6); ctx.fill(); ol(ctx, 5); }); rr(ctx, Tr.x - 430, TrY - 6, 860, 46, 12); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); }
        const k = t - tIn; if (k < 0) return; const dq = clamp(k / .55, 0, 1), drop = (1 - eIn(dq)) * -1100, land = k - .55, sq = land > 0 && land < .4 ? Math.sin(land / .4 * Math.PI) * .12 : 0;
        ctx.save(); ctx.translate(Tr.x, TrY - 6 + drop); ctx.scale(TS * (1 + sq), TS * (1 - sq));
        ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.ellipse(0, 6, 340, 26, 0, 0, TAU); ctx.fill();
        rr(ctx, -320, -74, 640, 74, 12); ctx.fillStyle = "#C98B4E"; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#A9703C"; ctx.fillRect(-316, -26, 632, 22);
        for (let i = 0; i < 4; i++){ ctx.strokeStyle = hexA(BROWN, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-300 + i * 160, -60); ctx.quadraticCurveTo(-240 + i * 160, -50, -180 + i * 160, -62); ctx.stroke(); }
        textC(ctx, Tr.sub, 0, -34, 30, CREAM, 900, 560);
        // spring
        ctx.strokeStyle = "#8A929C"; ctx.lineWidth = 8; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.ellipse(-60 + i * 16, -86, 12, 22, 0, 0, TAU); ctx.stroke(); }
        // bait plate + cheese
        const sn = t - tSn, closed = sn > 0, squash = closed ? clamp(sn / .12, 0, 1) : 0;
        rr(ctx, 90, -92, 220, 20, 6); ctx.fillStyle = "#8A929C"; ctx.fill(); ol(ctx, 4);
        const pulse = 1 + Math.sin(t * 5) * .03; if (!closed) glowAt(ctx, 200, -190, 300, GOLD, .45 + .15 * Math.sin(t * 4));
        ctx.save(); ctx.translate(200, -92); ctx.scale(pulse, pulse * (1 - squash * .55));
        ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(120, 0); ctx.lineTo(120, -130); ctx.lineTo(-120, -40); ctx.closePath(); ctx.fillStyle = "#F7C948"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.moveTo(-120, -40); ctx.lineTo(120, -130); ctx.lineTo(150, -120); ctx.lineTo(-90, -32); ctx.closePath(); ctx.fillStyle = "#FBE08A"; ctx.fill(); ol(ctx, 5);
        [[-40, -30, 16], [30, -50, 20], [80, -20, 12], [60, -95, 10]].forEach(([hx, hy, r]) => { ctx.beginPath(); ctx.arc(hx, hy, r, 0, TAU); ctx.fillStyle = "#E0A82E"; ctx.fill(); });
        ctx.restore();
        // flags stuck in the cheese
        if (!closed){ [[Tr.label, 270, -440, ORANGE, 0], [Tr.flag2, 150, -330, "#2F6F73", 1]].forEach(([txt, fx, fy, col, j]) => { if (!txt) return; const q = eBack(clamp((k - .5 - j * .25) / .4, 0, 1)); if (q <= 0) return;
          ctx.save(); ctx.translate(fx, -150); ctx.scale(q, q); ctx.strokeStyle = BROWN; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, fy + 150); ctx.stroke();
          ctx.translate(0, fy + 150); ctx.rotate(Math.sin(t * 3 + j) * .06); fit(ctx, txt, 400, 40, 900); const fw = ctx.measureText(txt).width + 40; rr(ctx, -fw, 0, fw, 66, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = "#FFFFFF"; ctx.fillText(txt, -fw + 20, 47); ctx.restore(); }); }
        // kill bar
        const a = closed ? lerp(Math.PI, 0, eOut(clamp(sn / .12, 0, 1))) + (sn > .12 ? Math.sin((sn - .12) * 30) * .12 * Math.max(0, 1 - (sn - .12) * 3) : 0) : Math.PI - .06 - Math.abs(Math.sin(t * 6)) * .03;
        const px = -40, py = -90, L = 300; ctx.save(); ctx.translate(px, py); ctx.rotate(-a + Math.PI); ctx.strokeStyle = "#5E6670"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(-L, -60); ctx.lineTo(-L, 60); ctx.lineTo(0, 60); ctx.stroke();
        ctx.strokeStyle = "#B8C0C9"; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
        ctx.restore();
        // lure scent lines toward the hero
        if (!closed && lure){ const st = sts[0]; if (st){ const hd = toonHead(st); for (let i = 0; i < 3; i++){ ctx.save(); ctx.strokeStyle = hexA(GOLD, .7); ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath();
          const x0 = Tr.x + 160 * TS, y0 = TrY - 260 * TS + drop; for (let q = 0; q <= 1; q += .05){ const x = lerp(x0, hd[0] + 60, q), y = lerp(y0, hd[1] - 20 + (i - 1) * 60, q) + Math.sin(q * 12 - t * 6 + i) * 26; q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.setLineDash([30, 26]); ctx.lineDashOffset = -t * 120; ctx.stroke(); ctx.restore(); } } }
        if (closed && sn < 1.1){ popWord(ctx, Tr.snapWord || "JEPRET!", Tr.x + 60, TrY - 560, sn, { size: 120, rot: -8, hold: 1.05 }); burstFx(ctx, Tr.x + 160 * TS, TrY - 140 * TS, sn, HL, 14, 300);
          for (let i = 0; i < 10; i++){ const ang = -Math.PI * (.1 + .8 * rnd(i)), r = sn * 600; ctx.fillStyle = "#F7C948"; ctx.beginPath(); ctx.arc(Tr.x + 200 * TS + Math.cos(ang) * r, TrY - 150 * TS + Math.sin(ang) * r + sn * sn * 700, 12, 0, TAU); ctx.fill(); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Tr = f.trap || {}; if (Tr.inCue){ const t0 = cueT(s, Tr.inCue, .1, i); add(t0, "whoosh"); add(t0 + .55, "pop"); add(t0 + .8, "chime"); } if (Tr.snapCue){ const t0 = cueT(s, Tr.snapCue, .7, i); add(t0, "pop"); add(t0 + .05, "ping"); } });

  /* ================= _topeng: mask mascot gets scanned and unmasked ================= */
  TT.scene(PX + "topeng", "Cerita: topeng penawaran terbuka", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Mk = Object.assign({ on: 2 }, f.mask || {}), Sg = f.sign || null, Sc = f.scan || null, Rs = f.result || null, Sp = f.spray || null;
    const tCr = T(s, Mk.crackCue, .4, idx), tDp = T(s, Mk.dropCue, .5, idx), tSc = Sc ? tOf(s, Sc, .05, idx) : 1e9, dSc = (Sc && Sc.dur) || 1.4, tRs = Rs ? tOf(s, Rs, .3, idx) : 1e9, tSp = Sp ? tOf(s, Sp, .6, idx) : 1e9;
    base(ctx, s, t, { env: "street",
      spots: { masked: () => [800, 1000, 1.1] },
      over1: (ctx2, c, sts, j) => { if (j !== Mk.on) return; const st = sts[j], hd = toonHead(st), r = headR(st), k = st.size / 92;
        // sign held in front
        const stD = t > tDp + .4 ? toonState((f.toons || [])[j], s, tDp + .4) : st;
        if (Sg){ const hand = lp(stD, 20, -46), fall = t - tDp - .4, fq = fall > 0 ? clamp(fall / .5, 0, 1) : 0; ctx.save(); ctx.globalAlpha *= 1 - clamp((fall - 1.1) / .5, 0, 1); ctx.translate(hand[0] - (stD.face || 1) * 40, hand[1] + eIn(fq) * (GY - hand[1] - 60)); ctx.rotate(Math.sin(t * 2) * .04 * (1 - fq) + fq * .4 * (stD.face || 1));
          rr(ctx, -170, -100, 340, 200, 18); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ol(ctx, 7); rr(ctx, -150, -82, 300, 70, 12); ctx.fillStyle = RED; ctx.fill(); textC(ctx, Sg.text || "", 0, -32, 40, "#FFFFFF", 900, 280);
          textC(ctx, Sg.sub || "", 0, 54, 38, BROWN, 800, 300); for (let i = 0; i < 4; i++){ const a = t * 2 + i * 1.6; sparkle(ctx, Math.cos(a) * 200, Math.sin(a) * 120, 12, GOLD); } ctx.restore(); }
        // mask
        const dp = t - tDp; const h0 = dp > 0 ? toonHead(toonState((f.toons || [])[j], s, tDp)) : hd, f0 = dp > 0 ? (toonState((f.toons || [])[j], s, tDp).face || 1) : 1; let mx = h0[0], my = h0[1], mr = 0, ma = 1 - clamp((dp - 1.3) / .5, 0, 1); if (ma <= 0) return;
        if (dp > 0){ const q = clamp(dp / .7, 0, 1); mx += f0 * -Math.min(dp, .7) * 160; my = lerp(h0[1], GY - r * 1.1, eIn(q)) - (q >= 1 ? Math.abs(Math.sin((dp - .7) * 10)) * 50 * Math.max(0, 1 - (dp - .7) * 2) : 0); mr = -dp * 3; if (q >= 1) mr = -2.1 + Math.sin(dp) * .02; }
        ctx.save(); ctx.translate(mx, my); ctx.rotate(mr + (dp > 0 ? 0 : Math.sin(t * 2.2) * .05)); ctx.globalAlpha = ma; const R = r * 1.28;
        if (dp <= 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-R, 0); ctx.lineTo(-R * 1.05, -R * .1); ctx.moveTo(R, 0); ctx.lineTo(R * 1.05, -R * .1); ctx.stroke(); }
        ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fillStyle = "#FFD447"; ctx.fill(); ol(ctx, 8);
        ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * R * .36, -R * .12, R * .16, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); });
        ctx.beginPath(); ctx.arc(0, R * .08, R * .52, Math.PI * .12, Math.PI * .88); ctx.stroke(); ctx.fillStyle = hexA("#F08C6E", .6); [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * R * .62, R * .2, R * .14, R * .09, 0, 0, TAU); ctx.fill(); });
        ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.ellipse(-R * .45, -R * .55, R * .22, R * .12, -.6, 0, TAU); ctx.fill();
        if (t > tCr){ const cq = clamp((t - tCr) / .3, 0, 1); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); const pts = [[-.1, -1], [.05, -.6], [-.12, -.3], [.1, 0], [-.05, .35], [.12, .7]];
          pts.forEach(([px, py], i) => { if (i / (pts.length - 1) <= cq) i ? ctx.lineTo(px * R, py * R) : ctx.moveTo(px * R, py * R); }); ctx.stroke(); }
        ctx.restore(); },
      front: (ctx2, c, sts) => { const tg = sts[Mk.on]; if (!tg) return;
        // scan beam + sweeping line
        if (Sc && t > tSc){ const src = sts[Sc.from], k = t - tSc, done = t > tRs, col = done ? RED : "#4FD18B";
          if (src){ const hp = lp(src, 17, -43), top = tg.y - tg.size * 1.02, bot = tg.y, sq = clamp(k / dSc, 0, 1), ly = lerp(top, bot, (Math.sin(k * 3) * .5 + .5) * (k < dSc ? sq : 1));
            if (k < dSc + 2.5 || !done){ ctx.save(); ctx.globalAlpha = .3; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(hp[0], hp[1]); ctx.lineTo(tg.x - tg.size * .22, ly - 30); ctx.lineTo(tg.x - tg.size * .22, ly + 30); ctx.closePath(); ctx.fill(); ctx.restore();
              ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(tg.x - tg.size * .3, ly); ctx.lineTo(tg.x + tg.size * .3, ly); ctx.stroke(); ctx.restore(); }
            // HUD brackets
            const bx0 = tg.x - tg.size * .34, bx1 = tg.x + tg.size * .34, by0 = top - 30, by1 = bot - 10, Lb = 70, pulse = 1 + Math.sin(t * 8) * .02; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.lineCap = "round";
            [[bx0, by0, 1, 1], [bx1, by0, -1, 1], [bx0, by1, 1, -1], [bx1, by1, -1, -1]].forEach(([x, y, dx, dy]) => { ctx.beginPath(); ctx.moveTo(x, y + dy * Lb * pulse); ctx.lineTo(x, y); ctx.lineTo(x + dx * Lb * pulse, y); ctx.stroke(); }); ctx.restore(); } }
        // contacts spray out
        if (t > tSp){ const k = t - tSp, hd = toonHead(tg); for (let i = 0; i < 12; i++){ const d = k - i * .08; if (d < 0) continue; const a = -Math.PI * .95 + rnd(i) * Math.PI * .9 + (i % 2 ? 0 : Math.PI * .05), r = 80 + d * 520, x = hd[0] + Math.cos(a) * r * 1.2, y = hd[1] + 80 + Math.sin(a) * r * .8;
          const al = clamp(1 - (d - 1.6) / .6, 0, 1); if (al <= 0) continue; ctx.save(); ctx.globalAlpha = al; ctx.translate(x, y); ctx.rotate(Math.sin(t * 4 + i) * .2);
          if (i % 3 === 2){ ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "!", 0, 18, 54, "#FFFFFF", 900); }
          else { ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = i % 2 ? "#FFFFFF" : "#FCE3C4"; ctx.fill(); ol(ctx, 5); icon(ctx, "users", -24, -24, 48, BROWN, 3); }
          ctx.restore(); } } },
      post: () => { if (t > tRs && t - tRs < 1.6){ const q = t - tRs; ctx.globalAlpha = .35 * Math.max(0, Math.sin(q * 9)) * (1 - q / 1.6); const g = ctx.createRadialGradient(540, 960, 300, 540, 960, 1200); g.addColorStop(0, "rgba(217,72,59,0)"); g.addColorStop(1, "rgba(217,72,59,1)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); } },
      over: () => { if (Rs && t > tRs && t < (Rs.out != null ? tOf(s, { cue: Rs.out }, .9, idx) : 1e9) + .3){ const oq = Rs.out ? clamp((t - tOf(s, { cue: Rs.out }, .9, idx)) / .3, 0, 1) : 0; ctx.globalAlpha = 1 - oq; stampBox(ctx, Rs.text || "TIDAK TERDAFTAR", 540, Rs.y || 330, t - tRs, RED, 76, -.08); if (t - tRs < 1) burstFx(ctx, 540, Rs.y || 330, t - tRs - .1, RED, 14, 320); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); if (f.scan) add(tOf(s, f.scan, .05, i), "whoosh"); if (f.result){ const t0 = tOf(s, f.result, .3, i); add(t0, "ping"); add(t0 + .25, "pop"); } const Mk = f.mask || {}; if (Mk.dropCue) add(cueT(s, Mk.dropCue, .5, i), "whoosh"); if (Mk.crackCue) add(cueT(s, Mk.crackCue, .4, i), "pop"); if (f.spray) add(tOf(s, f.spray, .6, i), "whoosh"); });
})();
