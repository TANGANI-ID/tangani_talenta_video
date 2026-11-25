/* Scene pack j2611221020184: story scenes for MODE CERITA ("motion": {"mode": "cerita"}). Layout prefix j2611221020184_.
   Episodes MS31, SB32, SP32, RN32, KD32. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], props[], cards[], stamp) plus its own set piece (world space, ground y = 1640):
     _sinyal   parents' phone on a cabinet: full signal bars, false-alarm promo buzz, wall calendar crossed off, "0 calls" (f.sinyal)
     _tembok   excuse bricks fly from a toon and stack into a wall that hides a glowing "IBU" phone (f.tembok)
     _rumah    the parents' house is a living face: sleepy shutter eyelids open, windows light up, awning smiles, door opens,
               chimney puffs hearts while the call goes on (f.rumah)
     _tunda    giant digital alarm clock, promise scroll pinned to the wall, big red snooze button the toon slaps (f.tunda)
     _stempel  a loyalty-style "promise stamp card": cracks and tears apart (mode "sobek") or fills stamp by stamp (mode "isi") (f.stempel)
     _buka     a rolling shutter in front of the workstation rolls up at eight sharp, TUTUP/BUKA sign flips, phone face-down (f.buka)
     _luncur   copy work: the toon shuttles cards from an EMAIL tower to a table ("manual"/"cepat"), or a data slide does it ("otomatis") (f.luncur)
     _kursi    rolling-chair convoy follows a bell into the meeting room; the wall clock races; crickets (f.kursi)
     _kosong   the empty work floor during the meeting: spinning empty chairs, sleeping laptops, ringing phones, the time sum (f.kosong)
     _ombak    one group message hops from desk to desk; read ticks, then a stadium wave of "Siap!" (f.ombak)
     _dok      giant shared document: ninja edit ("ninja"), crime-scene tape on the changes ("kaget"), pinned comment + suggestion ("komentar") (f.dok)
   Camera keys may use on:"<spot>" for named spots of the set piece. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, easeIO, G, TAU, star } = TT;
  const PX = "j2611221020184_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", GOLD2 = "#D99A1E", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const eIn = x => x * x * x;
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr, i) : 1e9;
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) + (o.delay || 0) : 1e9));
  const rq = (t, T0, d) => clamp((t - T0) / (d || .4), 0, 1);
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
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

  /* ---------- shared base (same data as the generic "cerita" layout + hooks) ---------- */
  // H: {env, envOpt, spots, prep(a, j) -> {a, t}, adj(sts) (mutate states), back/mid/front(ctx, c, sts, R), midZ, under/over1(ctx, c, sts, j, R), post, over}
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const P = toons.map((a, j) => (H.prep && H.prep(a, j)) || { a, t });
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
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => { if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R)); R[j] = toon(ctx, c, P[j].a, s, P[j].t, { st: sts[j] }); if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.post){ ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
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
  const reg = (name, label, draw, sfx) => TT.scene(PX + name, label, draw, (s, f, i, add) => { sfxBase(s, f, i, add); if (sfx) sfx(s, f, i, add); });

  /* small shared objects */
  function phoneBody(ctx, x, y, w, h, rot, lit, scr){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
    ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -w / 2 + 10, -h / 2 + 14, w, h, w * .16); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, w * .16); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    const sx = -w / 2 + w * .08, sy = -h / 2 + w * .1, sw = w * .84, sh = h - w * .2;
    rr(ctx, sx, sy, sw, sh, w * .1); ctx.fillStyle = lit ? "#FFF4E6" : "#2C323D"; ctx.fill();
    if (!lit){ ctx.save(); rr(ctx, sx, sy, sw, sh, w * .1); ctx.clip(); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.beginPath(); ctx.moveTo(sx + sw * .2, sy); ctx.lineTo(sx + sw * .55, sy); ctx.lineTo(sx, sy + sh * .5); ctx.lineTo(sx, sy + sh * .2); ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (lit && scr){ ctx.save(); rr(ctx, sx, sy, sw, sh, w * .1); ctx.clip(); scr(ctx, sx, sy, sw, sh); ctx.restore(); }
    ctx.restore();
  }
  function ringWaves(ctx, x, y, t, k, col, r0){ for (let j = 0; j < 3; j++){ const q = ((t * 1.6 + j / 3) % 1); ctx.save(); ctx.globalAlpha *= (1 - q) * k; ctx.strokeStyle = col || HL; ctx.lineWidth = 9; ctx.lineCap = "round";
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(x, y, (r0 || 120) + q * 120, d > 0 ? -.6 : Math.PI - .6 + 0, d > 0 ? .6 : Math.PI + .6); ctx.stroke(); }); ctx.restore(); } }
  function avatar(ctx, x, y, r, col, letter){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); if (letter) textC(ctx, letter, x, y + r * .38, r * 1.05, "#FFFFFF", 800); }
  function clockFace(ctx, x, y, r, hA, mA, o){ o = o || {};
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.arc(x + 8, y + 12, r, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = o.rim || ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r * .84, 0, TAU); ctx.fillStyle = "#FFF8EE"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    for (let k = 0; k < 12; k++){ const a = k / 12 * TAU; ctx.strokeStyle = BROWN; ctx.lineWidth = k % 3 ? 4 : 8; ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * r * .7, y - Math.cos(a) * r * .7); ctx.lineTo(x + Math.sin(a) * r * .78, y - Math.cos(a) * r * .78); ctx.stroke(); }
    if (o.blur){ ctx.save(); ctx.globalAlpha *= .3; ctx.fillStyle = HL; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r * .66, mA - Math.PI / 2 - 1.4, mA - Math.PI / 2); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.lineCap = "round"; ctx.strokeStyle = BROWN; ctx.lineWidth = r * .1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(hA) * r * .42, y - Math.cos(hA) * r * .42); ctx.stroke();
    ctx.lineWidth = r * .065; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(mA) * r * .64, y - Math.cos(mA) * r * .64); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r * .08, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); }

  /* ================= _sinyal: parents' phone, full signal, no call ================= */
  // f.sinyal: {x, top (cabinet top y), buzzCue (false alarm: promo), promo, promo2, calCue, calX, calY, weeks=3, weekText, sigCue, noneCue, noneText}
  reg("sinyal", "Cerita: sinyal penuh, telepon sepi", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.sinyal || {};
    const px = o.x ?? 790, top = o.top ?? 1150, tB = T(s, o.buzzCue, .3, i), tC = T(s, o.calCue, .5, i), tSg = T(s, o.sigCue, .3, i), tN = T(s, o.noneCue, .5, i);
    const cx = o.calX ?? 800, cy = o.calY ?? 300, weeks = o.weeks || 3, phY = top - 22 - 165;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 140 },
      spots: { phone: [px, phY - 40, 1.4], cal: [cx, cy + 160, 1.35] },
      back: (ctx) => {
        // wall calendar
        const cw = 330, chh = 320, nC = weeks * 7, cellW = (cw - 40) / 7, cellH = 52;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(.02 + Math.sin(t * 1.1) * .004);
        ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -cw / 2 + 10, 14, cw, chh, 14); ctx.fill();
        rr(ctx, -cw / 2, 0, cw, chh, 14); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        rr(ctx, -cw / 2, 0, cw, 70, [14, 14, 0, 0]); ctx.fillStyle = ORANGE; ctx.fill(); ctx.stroke();
        textC(ctx, o.calTitle || "KALENDER", 0, 50, 34, CREAM, 800);
        [-90, 90].forEach(dx => { ctx.fillStyle = BROWN; rr(ctx, dx - 8, -18, 16, 40, 8); ctx.fill(); });
        for (let k = 0; k < nC; k++){ const r = Math.floor(k / 7), col = k % 7, x = -cw / 2 + 20 + col * cellW, y = 90 + r * (cellH + 14);
          rr(ctx, x + 3, y, cellW - 6, cellH, 6); ctx.fillStyle = "#F3E6D2"; ctx.fill();
          font(ctx, 700, 22, FAM); ctx.fillStyle = "#8A5A3E"; ctx.fillText(String(k + 1), x + 8, y + 24);
          const tk = tC + k * .075; if (t >= tk){ const q = rq(t, tk, .12); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 6, y + 4); ctx.lineTo(lerp(x + 6, x + cellW - 8, q), lerp(y + 4, y + cellH - 4, q)); ctx.stroke();
            if (q >= 1){ const q2 = rq(t, tk + .1, .1); ctx.beginPath(); ctx.moveTo(x + cellW - 8, y + 4); ctx.lineTo(lerp(x + cellW - 8, x + 6, q2), lerp(y + 4, y + cellH - 4, q2)); ctx.stroke(); } } }
        ctx.restore();
        stampBox(ctx, (o.weekText || (weeks + " MINGGU")), cx + 20, cy + 210, t - (tC + nC * .075 + .2), RED, 52, .14);
        // cabinet
        ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(px, GROUND + 6, 200, 18, 0, 0, TAU); ctx.fill();
        rr(ctx, px - 160, top, 320, GROUND - top, 12); ctx.fillStyle = "#8E5A36"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        [0, 1].forEach(r => { const y = top + 40 + r * 190; rr(ctx, px - 130, y, 260, 160, 10); ctx.fillStyle = "#A86B42"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(px, y + 80, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.stroke(); });
        rr(ctx, px - 185, top - 26, 370, 34, 10); ctx.fillStyle = "#B97A4C"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
        ctx.fillStyle = "#FFF8EE"; ctx.beginPath(); ctx.ellipse(px - 10, top - 24, 120, 14, 0, 0, TAU); ctx.fill();
        // framed photo of the son
        ctx.save(); ctx.translate(px - 120, top - 26); ctx.rotate(-.05); rr(ctx, -50, -120, 100, 120, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
        rr(ctx, -38, -108, 76, 92, 4); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ctx.fillStyle = "#3B2418"; ctx.beginPath(); ctx.arc(0, -70, 16, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -26, 26, 22, 0, Math.PI, 0); ctx.fill(); ctx.restore();
        // phone on its stand (buzzes once: a promo, not the son)
        const bk = t - tB, buzz = bk >= 0 && bk < 1.1 ? Math.sin(bk * 70) * .07 * (1 - bk / 1.1) : 0, lit = bk >= 0 && bk < 3.2;
        ctx.fillStyle = BROWN; ctx.beginPath(); ctx.moveTo(px - 30, top - 26); ctx.lineTo(px + 60, top - 26); ctx.lineTo(px + 40, top - 70); ctx.closePath(); ctx.fill();
        if (lit) glowAt(ctx, px, phY, 260 * (1 - clamp((bk - 2.6) / .6, 0, 1)), "#FFE7B8", .55);
        phoneBody(ctx, px + 30, phY, 170, 330, -.06 + buzz, lit, (ctx2, sx, sy, sw, sh) => {
          ctx2.fillStyle = "#F3E6D2"; ctx2.fillRect(sx, sy, sw, sh);
          const q = popQ(t, tB + .25, .35); ctx2.save(); ctx2.translate(sx + sw / 2, sy + 90); ctx2.scale(q, q);
          rr(ctx2, -sw / 2 + 8, -44, sw - 16, 88, 14); ctx2.fillStyle = "#FFFFFF"; ctx2.fill(); ctx2.strokeStyle = ORANGE; ctx2.lineWidth = 4; ctx2.stroke();
          textC(ctx2, o.promo || "PROMO", 0, -6, 26, ORANGE, 800, sw - 30); textC(ctx2, o.promo2 || "PULSA!", 0, 26, 24, BROWN, 800, sw - 30); ctx2.restore(); });
        if (bk >= 0 && bk < 1.1) ringWaves(ctx, px + 30, phY, t, 1 - bk / 1.1, HL, 130);
        // signal bars: full, bouncing
        if (t >= tSg){ const q = popQ(t, tSg, .45), X = px + 30, Y = phY - 300; ctx.save(); ctx.translate(X, Y); ctx.scale(q, q);
          glowAt(ctx, 0, -40, 170, "#BFF0C8", .35);
          for (let k = 0; k < 4; k++){ const on = t >= tSg + .15 + k * .14, b = on ? Math.abs(Math.sin((t - tSg) * 5 - k * .6)) * 8 : 0, h = 34 + k * 30; rr(ctx, -92 + k * 46, -h - b, 34, h, 8); ctx.fillStyle = on ? GREEN : "#C9B79F"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); }
          font(ctx, 800, 30, FAM); const sw2 = Math.min(300, ctx.measureText(o.sigText || "SINYAL PENUH").width + 40); rr(ctx, -sw2 / 2, 22, sw2, 46, 23); ctx.fillStyle = GREEN; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, o.sigText || "SINYAL PENUH", 0, 55, 30, "#FFFFFF", 800, 270); ctx.restore(); }
        if (t >= tN) chip(ctx, o.noneText || "0 PANGGILAN", px + 30, phY + 230, t - tN, { size: 40, icon: "phone", iconBg: RED, t, rot: .04 });
        // floating dust motes in the sunbeam
        for (let k = 0; k < 14; k++){ const x = px - 200 + ((rnd(k) * 420 + t * 12) % 420), y = top - 420 + ((rnd(k + 9) * 380 - t * (10 + rnd(k) * 12)) % 380 + 380) % 380; ctx.globalAlpha = .35 + .4 * Math.abs(Math.sin(t + k)); ctx.fillStyle = "#FFF3D6"; ctx.beginPath(); ctx.arc(x, y, 3 + rnd(k + 2) * 3, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = 1;
      } });
  }, (s, f, i, add) => { const o = f.sinyal || {};
    if (o.buzzCue){ const tb = cueT(s, o.buzzCue, .3, i); add(tb, "ping"); add(tb + .3, "pop"); }
    if (o.sigCue){ const ts = cueT(s, o.sigCue, .3, i); for (let k = 0; k < 4; k++) add(ts + .15 + k * .14, "pop"); }
    if (o.calCue){ const tc = cueT(s, o.calCue, .5, i); for (let k = 0; k < 4; k++) add(tc + k * .4, "pop"); add(tc + (o.weeks || 3) * 7 * .075 + .2, "whoosh"); }
    if (o.noneCue) add(cueT(s, o.noneCue, .5, i), "ping"); });

  /* ================= _tembok: a wall of excuses ================= */
  // f.tembok: {phoneCue, phoneX, phoneY, wallX0, wallX1, baseY, rowH, from (toon index), bricks:[{cue, delay, text}], name}
  reg("tembok", "Cerita: tembok alasan", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.tembok || {};
    const px = o.phoneX ?? 830, py = o.phoneY ?? 720, tP = T(s, o.phoneCue, .2, i), W0 = o.wallX0 ?? 620, W1 = o.wallX1 ?? 1040, rowH = o.rowH ?? 118, baseY = o.baseY ?? 1290;
    const bricks = (o.bricks || []).map((b, j) => Object.assign({ T: tOf(s, b, .3, i), j }, b));
    const nDone = bricks.filter(b => t >= b.T + .42).length;
    base(ctx, s, t, { env: "office", envOpt: { time: "night", deskX: 230 },
      spots: { phone: [px, py, 1.25], wall: [(W0 + W1) / 2 - 60, baseY - 330, 1.0] },
      back: (ctx) => {
        if (t < tP) return; const q = popQ(t, tP, .5), dim = clamp(nDone / Math.max(1, bricks.length), 0, 1);
        glowAt(ctx, px, py, 360 * q, "#FFD9A0", .45 * (1 - dim * .7)); ringWaves(ctx, px, py, t, q * (1 - dim), HL, 200);
        ctx.save(); ctx.translate(px, py); ctx.scale(q, q); ctx.rotate(.05 + Math.sin(t * 1.4) * .03);
        phoneBody(ctx, 0, 0, 250, 470, 0, true, (c2, sx, sy, sw, sh) => {
          c2.fillStyle = lg2(c2, sy, sy + sh); c2.fillRect(sx, sy, sw, sh);
          c2.beginPath(); c2.arc(0, sy + 120, 60, 0, TAU); c2.fillStyle = "#E8A55B"; c2.fill(); c2.strokeStyle = OUT; c2.lineWidth = 4; c2.stroke();
          c2.fillStyle = "#8E4E2E"; c2.beginPath(); c2.arc(0, sy + 112, 40, Math.PI, 0); c2.lineTo(44, sy + 160); c2.lineTo(-44, sy + 160); c2.closePath(); c2.fill();
          c2.fillStyle = "#F0C29A"; c2.beginPath(); c2.arc(0, sy + 122, 26, 0, TAU); c2.fill();
          textC(c2, o.name || "IBU", 0, sy + 236, 58, BROWN, 800, sw - 20); textC(c2, o.sub || "Ketuk untuk panggil", 0, sy + 276, 20, "#8A5A3E", 700, sw - 20);
          const pu = 1 + Math.sin(t * 6) * .08; c2.save(); c2.translate(0, sy + sh - 70); c2.scale(pu, pu); c2.beginPath(); c2.arc(0, 0, 42, 0, TAU); c2.fillStyle = GREEN; c2.fill(); icon(c2, "phone", -24, -24, 48, "#FFFFFF", 2.6); c2.restore(); });
        ctx.restore();
      },
      front: (ctx, c, sts) => {
        const st = sts[o.from ?? 0], hand = st ? lp(st, 22, -60) : [300, 1100];
        bricks.forEach((b, k) => { const k2 = t - b.T; if (k2 < 0) return; const row = b.row ?? k, off = row % 2 ? 26 : -26, bw = W1 - W0 - 20, x = (W0 + W1) / 2 + off, y = baseY - row * rowH - rowH / 2, FL = .42;
          let bx, by, rot = 0, sx = 1, sy = 1;
          if (k2 < FL){ const q = k2 / FL, e = eOut(q); bx = lerp(hand[0], x, e); by = lerp(hand[1], y, e) - Math.sin(q * Math.PI) * 280; rot = (1 - q) * -2.2; sx = sy = .45 + .55 * q; }
          else { bx = x; by = y; const u = k2 - FL; if (u < .3){ const a = Math.sin(u / .3 * Math.PI) * .14 * (1 - u / .3); sx = 1 + a; sy = 1 - a; } }
          ctx.save(); ctx.translate(bx, by); ctx.rotate(rot); ctx.scale(sx, sy);
          ctx.fillStyle = "rgba(43,26,18,.3)"; rr(ctx, -bw / 2 + 8, -rowH / 2 + 12, bw, rowH - 8, 12); ctx.fill();
          rr(ctx, -bw / 2, -rowH / 2 + 4, bw, rowH - 8, 12); ctx.fillStyle = k % 2 ? "#B5523B" : "#C8673F"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
          ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-bw / 2 + 20, rowH / 2 - 20); ctx.lineTo(bw / 2 - 20, rowH / 2 - 20); ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,.14)"; rr(ctx, -bw / 2 + 12, -rowH / 2 + 12, bw - 24, 16, 8); ctx.fill();
          const size = fitFont(ctx, String(b.text || "").toUpperCase(), bw - 50, 50, 800); ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.textAlign = "center"; ctx.strokeText(String(b.text || "").toUpperCase(), 0, size * .36); ctx.fillStyle = CREAM; ctx.fillText(String(b.text || "").toUpperCase(), 0, size * .36); ctx.textAlign = "left";
          ctx.restore();
          if (k2 >= FL) dust(ctx, x, y + rowH / 2 - 4, k2 - FL, 9, "#E9D8C2", 200); });
      } });
  }, (s, f, i, add) => { const o = f.tembok || {}; if (o.phoneCue) add(cueT(s, o.phoneCue, .2, i), "ping");
    (o.bricks || []).forEach(b => { const tb = tOf(s, b, .3, i); if (tb < 1e8){ add(tb, "whoosh"); add(tb + .42, "pop"); } }); });
  function lg2(ctx, y0, y1){ const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, "#FFF4E6"); g.addColorStop(1, "#F6D9B5"); return g; }

  /* ================= _rumah: the parents' house wakes up when the call comes ================= */
  // f.rumah: {x, wakeCue, laughCue, doorCue, ringCue, ringOn (toon index), ringText, voice:{cue|at, text, dur}}
  reg("rumah", "Cerita: rumah yang terbangun", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.rumah || {};
    const hx = o.x ?? 640, tW = T(s, o.wakeCue, .2, i), tL = T(s, o.laughCue, .3, i), tD = T(s, o.doorCue, .2, i), tR = T(s, o.ringCue, .2, i), vc = o.voice || {}, tV = tOf(s, vc, .3, i);
    const wq = t < tW ? 0 : eBack(clamp((t - tW) / .6, 0, 1)), wl = clamp((t - tW) / .6, 0, 1), roofY = 430, wallY = 760;
    base(ctx, s, t, { env: "park", envOpt: { time: "night", treeX: 1010, bushes: false },
      spots: { house: [hx, 960, 1.0], door: [hx, 1330, 1.25], eyes: [hx, 900, 1.3] },
      back: (ctx) => {
        const dance = t >= tL ? Math.sin((t - tL) * 8) * .025 * Math.min(1, (t - tL) * 2) : 0;
        ctx.save(); ctx.translate(hx, GROUND); ctx.scale(1 + dance, 1 - dance); ctx.translate(-hx, -GROUND);
        // chimney + smoke (zz while asleep, hearts once laughing)
        rr(ctx, hx + 150, roofY + 40, 80, 170, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        for (let k = 0; k < 5; k++){ const u = ((t * .35 + k / 5) % 1), x = hx + 190 + Math.sin(u * 6 + k) * 24 + u * 60, y = roofY + 20 - u * 330;
          ctx.save(); ctx.globalAlpha *= Math.sin(u * Math.PI) * .9; ctx.translate(x, y);
          if (t >= tL && (t - tL) > (1 - u) * .3){ const sz = 16 + u * 20; ctx.fillStyle = k % 2 ? "#E8708A" : "#FFB3A6"; ctx.beginPath(); ctx.moveTo(0, sz * .9); ctx.bezierCurveTo(-sz * 1.4, -sz * .1, -sz * .6, -sz * 1.1, 0, -sz * .35); ctx.bezierCurveTo(sz * .6, -sz * 1.1, sz * 1.4, -sz * .1, 0, sz * .9); ctx.fill(); }
          else if (t < tW){ textC(ctx, "z", 0, 0, 30 + u * 34, "#D6E0F0", 800); }
          else { ctx.fillStyle = "#C9C2D6"; ctx.beginPath(); ctx.arc(0, 0, 18 + u * 26, 0, TAU); ctx.fill(); }
          ctx.restore(); }
        // walls
        ctx.fillStyle = "rgba(10,8,20,.35)"; ctx.beginPath(); ctx.ellipse(hx, GROUND + 8, 380, 26, 0, 0, TAU); ctx.fill();
        rr(ctx, hx - 300, wallY, 600, GROUND - wallY, 10); ctx.fillStyle = "#E9C79A"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
        ctx.strokeStyle = "rgba(59,36,24,.18)"; ctx.lineWidth = 4; for (let y = wallY + 60; y < GROUND; y += 60){ ctx.beginPath(); ctx.moveTo(hx - 296, y); ctx.lineTo(hx + 296, y); ctx.stroke(); }
        // roof
        ctx.beginPath(); ctx.moveTo(hx - 370, wallY + 20); ctx.lineTo(hx, roofY); ctx.lineTo(hx + 370, wallY + 20); ctx.closePath(); ctx.fillStyle = "#B5523B"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke();
        ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 4; for (let k = 1; k < 6; k++){ const q = k / 6; ctx.beginPath(); ctx.moveTo(hx - 370 * q, roofY + (wallY + 20 - roofY) * q); ctx.lineTo(hx + 370 * q, roofY + (wallY + 20 - roofY) * q); ctx.stroke(); }
        // eave lights
        for (let k = 0; k < 15; k++){ const q = k / 14, side = q < .5 ? -1 : 1, qq = side < 0 ? q * 2 : (q - .5) * 2, x = side < 0 ? lerp(hx - 360, hx, qq) : lerp(hx, hx + 360, qq), y = side < 0 ? lerp(wallY + 20, roofY, qq) : lerp(roofY, wallY + 20, qq);
          const lit = wl > q, tw = .7 + .3 * Math.sin(t * 5 + k * 1.3); if (lit) glowAt(ctx, x, y + 14, 38, k % 2 ? "#FFD27A" : "#FFB37A", .8 * tw); ctx.beginPath(); ctx.arc(x, y + 14, 9, 0, TAU); ctx.fillStyle = lit ? (k % 2 ? "#FFE9A8" : "#FFC98F") : "#6B5A4C"; ctx.fill(); }
        // window eyes
        const st0 = (f.toons || [])[o.ringOn ?? 0], lookX = st0 ? clamp(((st0.x ?? 300) - hx) / 400, -1, 1) * 26 : 0, blink = t >= tW && ((t + .3) % 3.1) < .14 ? 1 : 0;
        [-1, 1].forEach(d => { const wx = hx + d * 160, wy = 905, ww = 170, wh = 180;
          rr(ctx, wx - ww / 2 - 16, wy - wh / 2 - 16, ww + 32, wh + 32, 14); ctx.fillStyle = "#8E5A36"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
          ctx.save(); rr(ctx, wx - ww / 2, wy - wh / 2, ww, wh, 8); ctx.clip();
          ctx.fillStyle = wq > 0 ? lerpCol("#2A2346", "#FFE3A0", clamp(wl, 0, 1)) : "#2A2346"; ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
          if (wq > 0) glowAt(ctx, wx, wy, 140, "#FFF6D8", .6 * wl);
          const pr = 38 * clamp(wq, 0, 1.2); if (pr > 1){ ctx.beginPath(); ctx.arc(wx + lookX, wy + 16, pr, 0, TAU); ctx.fillStyle = BROWN; ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(wx + lookX - pr * .35, wy + 16 - pr * .35, pr * .3, 0, TAU); ctx.fill(); }
          const lid = clamp(lerp(.62, 0, clamp(wq, 0, 1)) + blink + (t < tW ? Math.sin(t * 1.4) * .04 : 0), 0, 1);
          ctx.fillStyle = "#9A5A34"; ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh * lid); ctx.strokeStyle = "rgba(43,26,18,.35)"; ctx.lineWidth = 4; for (let y = wy - wh / 2 + 22; y < wy - wh / 2 + wh * lid; y += 22){ ctx.beginPath(); ctx.moveTo(wx - ww / 2, y); ctx.lineTo(wx + ww / 2, y); ctx.stroke(); }
          ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx - ww / 2, wy - wh / 2 + wh * lid); ctx.lineTo(wx + ww / 2, wy - wh / 2 + wh * lid); ctx.stroke();
          ctx.restore();
          // brow (flower box under the window)
          rr(ctx, wx - ww / 2 - 10, wy + wh / 2 + 16, ww + 20, 34, 8); ctx.fillStyle = "#B5643C"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
          for (let k = 0; k < 5; k++){ ctx.fillStyle = "#4E7A41"; ctx.beginPath(); ctx.arc(wx - 70 + k * 35, wy + wh / 2 + 12, 16, 0, TAU); ctx.fill(); } });
        // door + smiling awning
        const dop = rq(t, tD, .45), dx0 = hx - 90, dy0 = 1320;
        ctx.save(); ctx.beginPath(); ctx.moveTo(dx0, GROUND); ctx.lineTo(dx0, dy0 + 90); ctx.arc(hx, dy0 + 90, 90, Math.PI, 0); ctx.lineTo(hx + 90, GROUND); ctx.closePath(); ctx.fillStyle = dop > 0 ? "#FFE3A0" : "#5A3A2A"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); ctx.clip();
        if (dop > 0) glowAt(ctx, hx, dy0 + 160, 200, "#FFFFFF", .5);
        const dw = 180 * (1 - .82 * eOut(dop)); ctx.fillStyle = "#A9643B"; ctx.fillRect(dx0, dy0, dw, GROUND - dy0); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(dx0, dy0, dw, GROUND - dy0);
        if (dop < .5){ ctx.beginPath(); ctx.arc(dx0 + dw - 26, dy0 + 180, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); }
        ctx.restore();
        if (dop > 0) glowAt(ctx, hx, GROUND - 40, 260 * dop, "#FFE3A0", .35);
        const sm = lerp(-28, 60, clamp(wq, 0, 1.1)); ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(hx - 150, 1240); ctx.quadraticCurveTo(hx, 1240 + sm, hx + 150, 1240); ctx.stroke(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 15; ctx.stroke();
        // lamp post glow by the door
        ctx.restore();
        if (t >= tW && t - tW < .9) burstFx(ctx, hx, 900, t - tW, GOLD, 12, 300);
      },
      over1: (ctx, c, sts, j, R) => { if (j !== (o.ringOn ?? 0) || !R[j]) return; const r = R[j], k = t - tR;
        if (k >= 0 && k < 1.6){ ringWaves(ctx, r.headX, r.headY, t, 1 - k / 1.6, HL, r.r * 1.3); ctx.save(); ctx.translate(r.headX + r.face * r.r * 1.5, r.headY - r.r * 1.4 + Math.sin(k * 40) * 5); ctx.rotate(-.12 * r.face); const q = popQ(t, tR, .3); ctx.scale(q, q); outlineWords(ctx, [{ w: o.ringText || "KRING!", hl: true }], 0, 0, 72, { sw: 15 }); ctx.restore(); }
        const kv = t - tV; if (kv >= 0 && kv < (vc.dur || 2.6)){ const sc = r.screen; TT.CS.ov.push(() => TT.bubble(ctx, vc.text || "Bu, apa kabar?", sc.top[0] + 120, sc.top[1] - 10, kv, { size: 46, t })); } } });
  }, (s, f, i, add) => { const o = f.rumah || {}; if (o.ringCue){ const tr = cueT(s, o.ringCue, .2, i); add(tr, "ping"); add(tr + .5, "ping"); } if (o.wakeCue){ const tw = cueT(s, o.wakeCue, .2, i); add(tw, "chime"); add(tw + .1, "whoosh"); }
    if (o.doorCue) add(cueT(s, o.doorCue, .2, i), "whoosh"); if (o.laughCue) add(cueT(s, o.laughCue, .3, i), "chime"); if (o.voice) add(tOf(s, o.voice, .3, i), "pop"); });

  /* ================= _stempel: the promise stamp card ================= */
  // f.stempel: {mode:"sobek"|"isi", x, y, title, name, days:[5 labels], cardCue|cardAt,
  //   sobek: times:[{cue, text}], clockX, clockY, crackCue
  //   isi: stamps:[{cue|at, slot}], bigCue, bigText, bigBreakCue, fullCue, fullText}
  function stampTool(ctx, x, y, press, s){ s = s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + press * .12), s * (1 - press * .2));
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 12, 70, 12, 0, 0, TAU); ctx.fill();
    rr(ctx, -66, -26, 132, 22, 6); ctx.fillStyle = "#B5323B"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    rr(ctx, -56, -86, 112, 62, 12); ctx.fillStyle = ORANGE; ctx.fill(); ctx.stroke();
    rr(ctx, -16, -132, 32, 50, 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -152, 32, 0, TAU); ctx.fillStyle = "#A9643B"; ctx.fill(); ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.3)"; ctx.beginPath(); ctx.arc(-10, -162, 10, 0, TAU); ctx.fill();
    ctx.restore(); }
  reg("stempel", "Cerita: kartu stempel janji", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.stempel || {}, mode = o.mode || "sobek";
    const CX = o.x ?? 540, CY = o.y ?? 560, CW = 800, CH = 420, days = o.days || ["SEN", "SEL", "RAB", "KAM", "JUM"], tCard = o.cardCue ? T(s, o.cardCue, .2, i) : (o.cardAt ?? 0);
    const slotP = k => [CX - 300 + (k % 5) * 150, CY - 10 + Math.floor(k / 5) * 128];
    const stamps = (o.stamps || []).map((x, j) => Object.assign({ T: tOf(s, x, .3, i), slot: x.slot ?? j }, x));
    const tFull = T(s, o.fullCue, .3, i); if (mode === "isi" && tFull < 1e8){ const used = new Set(stamps.map(x => x.slot)); let n = 0; for (let k = 0; k < 10; k++) if (!used.has(k)) stamps.push({ T: tFull + n++ * .16, slot: k, auto: true }); }
    const tAll = stamps.length ? Math.max(...stamps.map(x => x.T)) + .5 : 1e9;
    const tK = T(s, o.crackCue, .4, i), tSp = tK + .6, tBig = T(s, o.bigCue, .3, i), tBB = o.bigBreakCue ? T(s, o.bigBreakCue, .3, i) : tBig + 1.5;
    const times = (o.times || []).map(x => Object.assign({ T: tOf(s, x, .2, i) }, x));
    function card(ctx, dim){
      ctx.fillStyle = "rgba(20,12,6,.3)"; rr(ctx, -CW / 2 + 14, -CH / 2 + 18, CW, CH, 34); ctx.fill();
      rr(ctx, -CW / 2, -CH / 2, CW, CH, 34); ctx.fillStyle = dim ? lerpCol("#FFF4E6", "#BDB5AB", dim) : "#FFF4E6"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
      ctx.save(); rr(ctx, -CW / 2, -CH / 2, CW, CH, 34); ctx.clip(); ctx.fillStyle = dim ? lerpCol(ORANGE, "#8C8476", dim) : ORANGE; ctx.fillRect(-CW / 2, -CH / 2, CW, 92);
      ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 18; for (let k = -6; k < 10; k++){ ctx.beginPath(); ctx.moveTo(-CW / 2 + k * 90, -CH / 2 + 92); ctx.lineTo(-CW / 2 + k * 90 + 92, -CH / 2); ctx.stroke(); } ctx.restore();
      font(ctx, 800, 44, FAM); ctx.fillStyle = CREAM; ctx.fillText(o.title || "KARTU JANJI", -CW / 2 + 40, -CH / 2 + 62); textC(ctx, o.name || "", CW / 2 - 110, -CH / 2 + 60, 34, CREAM, 800, 180);
      for (let k = 0; k < 10; k++){ const [x, y] = slotP(k), lx = x - CX, ly = y - CY; ctx.beginPath(); ctx.arc(lx, ly, 52, 0, TAU); ctx.setLineDash([10, 8]); ctx.strokeStyle = "#C9B79F"; ctx.lineWidth = 5; ctx.stroke(); ctx.setLineDash([]);
        textC(ctx, days[k % 5], lx, ly + 10, 28, "#B8A58C", 800); }
    }
    function stampMark(ctx, lx, ly, q, lbl){ if (q <= 0) return; const s2 = 1.6 - .6 * eOut(clamp(q, 0, 1)); ctx.save(); ctx.translate(lx, ly); ctx.rotate(-.18); ctx.scale(s2, s2); ctx.globalAlpha *= clamp(q * 3, 0, 1);
      ctx.beginPath(); for (let k = 0; k < 16; k++){ const a = k / 16 * TAU, r = k % 2 ? 46 : 56; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = HL; ctx.fill(); ctx.strokeStyle = "#A2501A"; ctx.lineWidth = 4; ctx.stroke();
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-5, 14); ctx.lineTo(20, -14); ctx.stroke(); if (lbl) textC(ctx, lbl, 0, 40, 20, "#FFFFFF", 800); ctx.restore(); }
    base(ctx, s, t, { env: mode === "sobek" ? "info" : "sky", envOpt: mode === "sobek" ? { spotX: 300 } : { time: "day" },
      spots: { card: [CX, CY + 60, 1.15], slot0: [slotP(0)[0] + 60, slotP(0)[1] + 120, 1.45] },
      back: (ctx) => {
        if (mode === "sobek"){ const cur = times.filter(x => t >= x.T).pop(); if (cur){ const X = o.clockX ?? 280, Y = o.clockY ?? 250, k = t - cur.T, flip = k < .3 ? Math.abs(Math.cos(k / .3 * Math.PI)) : 1;
          ctx.save(); ctx.translate(X, Y); const q = popQ(t, times[0].T, .4); ctx.scale(q, q); rr(ctx, -160, -64, 320, 128, 26); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 8; ctx.stroke(); ctx.scale(1, flip);
          font(ctx, 800, 88, FAM); ctx.fillStyle = "#FF7A4A"; ctx.textAlign = "center"; ctx.shadowColor = "#FF7A4A"; ctx.shadowBlur = 14; ctx.fillText(cur.text, 0, 31); ctx.shadowBlur = 0; ctx.textAlign = "left"; ctx.restore(); } }
        // the card (sobek: cracks and tears apart)
        const q = popQ(t, tCard, .5); if (q <= 0) return;
        const bob = Math.sin(t * 1.6) * 6, k = t - tSp, dim = mode === "sobek" ? rq(t, tSp, .8) : 0;
        if (mode !== "sobek" || t < tSp){
          const jit = mode === "sobek" && t >= tK ? Math.sin(t * 70) * 4 * rq(t, tK, .2) : 0;
          ctx.save(); ctx.translate(CX + jit, CY + bob); ctx.rotate(-.02); ctx.scale(q, q);
          if (mode === "isi" && t >= tAll) glowAt(ctx, 0, 0, 560, "#FFE08A", .35 + .1 * Math.sin(t * 4));
          card(ctx, 0);
          if (mode === "sobek"){ const pulse = .5 + .5 * Math.sin(t * 5); const [x0, y0] = slotP(0); ctx.beginPath(); ctx.arc(x0 - CX, y0 - CY, 58 + pulse * 6, 0, TAU); ctx.strokeStyle = hexA(RED, .5 + .4 * pulse); ctx.lineWidth = 6; ctx.stroke();
            if (t >= tK){ const cq = rq(t, tK, .45); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineJoin = "round"; ctx.beginPath(); const pts = [[-30, -CH / 2], [10, -120], [-40, -40], [20, 30], [-30, 110], [0, CH / 2]], n = Math.max(1, Math.round(cq * (pts.length - 1)));
              ctx.moveTo(pts[0][0], pts[0][1]); for (let j = 1; j <= n; j++) ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2; ctx.stroke(); } }
          stamps.forEach(sp => { const [x, y] = slotP(sp.slot); stampMark(ctx, x - CX, y - CY, (t - sp.T - .3) / .25, days[sp.slot % 5]); });
          ctx.restore();
        } else { // two halves tear apart and fall
          const ZZ = [[-30, -CH / 2 - 30], [-30, -CH / 2], [10, -120], [-40, -40], [20, 30], [-30, 110], [0, CH / 2], [0, CH / 2 + 30]];
          [-1, 1].forEach(d => { ctx.save(); const e = eOut(clamp(k / .8, 0, 1)); ctx.translate(CX + d * (40 * e + 30 * k), CY + bob + 260 * k * k * .6 + 40 * e); ctx.rotate(d * (.22 * e + .05 * k)); ctx.scale(q, q);
            ctx.beginPath(); ctx.moveTo(ZZ[0][0], ZZ[0][1]); ZZ.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(d * (CW / 2 + 40), CH / 2 + 40); ctx.lineTo(d * (CW / 2 + 40), -CH / 2 - 40); ctx.closePath(); ctx.clip();
            card(ctx, dim); ctx.restore(); });
          if (k < .9) burstFx(ctx, CX - 10, CY, k, "#FFFFFF", 12, 220);
          for (let p = 0; p < 10; p++){ const u = k * .9 + p * .07; if (u > 1.6) continue; ctx.save(); ctx.globalAlpha *= clamp(1.6 - u, 0, 1); ctx.translate(CX - 10 + (rnd(p) - .5) * 80 + Math.sin(u * 5 + p) * 40, CY - 150 + rnd(p + 4) * 300 + u * 420); ctx.rotate(u * 6 + p); ctx.fillStyle = p % 2 ? "#FFF4E6" : ORANGE; ctx.fillRect(-8, -5, 16, 10); ctx.restore(); }
        }
      },
      front: (ctx) => {
        if (mode !== "isi") return;
        if (mode === "isi" && t >= tBig && t < tBB + 1.6){ const k = t - tBig, fall = k < .45 ? eIn(k / .45) : 1, X = o.bigX ?? 800, Y = lerp(-200, o.bigY ?? 1000, fall), br = t >= tBB ? t - tBB : -1;
          if (br < 0){ const sq = k > .45 && k < .8 ? Math.sin((k - .45) / .35 * Math.PI) : 0; stampTool(ctx, X, Y, sq, 2.6); ctx.save(); ctx.translate(X, Y - 2.6 * 55); textC(ctx, o.bigText || "TEKAD BESAR", 0, 12, 34, CREAM, 800, 270); ctx.restore();
            if (k > .45 && k < 1.3) dust(ctx, X, Y + 20, k - .45, 10, "#FFFFFF", 300); }
          else { for (let p = 0; p < 8; p++){ const a = p / 8 * TAU, x = X + Math.cos(a) * (120 + br * 220), y = Y - 140 + Math.sin(a) * 100 + 900 * br * br; ctx.save(); ctx.globalAlpha *= clamp(1.4 - br, 0, 1); ctx.translate(x, y); ctx.rotate(br * (p % 2 ? 5 : -5)); rr(ctx, -44, -24, 88, 48, 10); ctx.fillStyle = p % 2 ? ORANGE : "#8E4E2E"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
            if (br < .9) burstFx(ctx, X, Y - 140, br, ORANGE, 12, 240); } }
        const q = popQ(t, tCard, .5); if (q <= 0) return;
        // the small stamp hops from slot to slot
        let prev = [CX + 330, CY - 260];
        for (let j = 0; j < stamps.length; j++){ const sp = stamps[j], [x, y] = slotP(sp.slot), k = t - sp.T, nxt = stamps[j + 1];
          if (k < 0){ if (j === 0) stampTool(ctx, prev[0], prev[1] + Math.sin(t * 3) * 10, 0, .9); break; }
          if (nxt && t >= nxt.T){ prev = [x, y + bob0(t)]; continue; }
          const tr = clamp(k / .3, 0, 1), px = lerp(prev[0], x, eOut(tr)), py = lerp(prev[1], y - 10, eOut(tr)) - Math.sin(tr * Math.PI) * 120 - (k > .3 && k < .55 ? 0 : 30 * (1 - tr)), press = k > .3 && k < .5 ? Math.sin((k - .3) / .2 * Math.PI) : 0;
          stampTool(ctx, px, py - (k > .5 ? Math.min(60, (k - .5) * 200) : 0) + bob0(t), press, .9);
          if (k > .3 && k < 1) burstFx(ctx, x, y, k - .3, HL, 8, 100); break; }
        if (t >= tAll && t < tAll + 2.2) { for (let k2 = 0; k2 < 36; k2++){ const wk = t - tAll, a = -Math.PI / 2 + (rnd(k2 + 3) - .5) * 2.8, v = 500 + rnd(k2 + 9) * 700, x = CX + Math.cos(a) * v * wk, y = CY + Math.sin(a) * v * wk + 1000 * wk * wk;
          ctx.save(); ctx.globalAlpha *= clamp(2 - wk, 0, 1); ctx.translate(x, y); ctx.rotate(wk * 8 + k2); ctx.fillStyle = [ORANGE, GOLD, CREAM, "#E8708A"][k2 % 4]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); } }
        if (t >= tAll) stampBox(ctx, o.fullText || "PENUH!", CX + 250, CY + 210, t - tAll - .2, GREEN, 54, -.12);
      } });
    function bob0(tt){ return Math.sin(tt * 1.6) * 6; }
  }, (s, f, i, add) => { const o = f.stempel || {}; if (o.cardCue) add(cueT(s, o.cardCue, .2, i), "pop"); (o.times || []).forEach(x => add(tOf(s, x, .2, i), "pop"));
    if (o.crackCue){ const tk = cueT(s, o.crackCue, .4, i); add(tk, "ping"); add(tk + .6, "whoosh"); add(tk + .62, "pop"); }
    (o.stamps || []).forEach(x => { const ts = tOf(s, x, .3, i); add(ts, "whoosh"); add(ts + .3, "pop"); });
    if (o.fullCue){ const tf = cueT(s, o.fullCue, .3, i); for (let k = 0; k < 10; k += 2) add(tf + k * .16 + .3, "pop"); add(tf + 1.9, "chime"); }
    if (o.bigCue){ const tb = cueT(s, o.bigCue, .3, i); add(tb + .45, "pop"); add(o.bigBreakCue ? cueT(s, o.bigBreakCue, .3, i) : tb + 1.5, "whoosh"); } });

  /* ================= _buka: the rolling shutter opens at eight sharp ================= */
  // f.buka: {x0, x1, topY, deskX, deskY, clockX, clockY, openCue, phoneCue, docCue, winCue, from (toon index), signA, signB}
  reg("buka", "Cerita: rolling door buka tepat jam 8", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.buka || {};
    const X0 = o.x0 ?? 380, X1 = o.x1 ?? 1030, TY = o.topY ?? 470, dX = o.deskX ?? 760, dY = o.deskY ?? 1210, ccx = o.clockX ?? 210, ccy = o.clockY ?? 400;
    const tO = T(s, o.openCue, .2, i), tPh = T(s, o.phoneCue, .3, i), tDoc = T(s, o.docCue, .3, i), tWin = T(s, o.winCue, .5, i);
    const oq = t < tO ? 0 : clamp(eOut(clamp((t - tO) / .8, 0, 1)) + Math.sin(clamp((t - tO - .8) / .4, 0, 1) * Math.PI) * -.03, 0, 1), botY = lerp(GROUND, TY + 80, oq);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { shutter: [(X0 + X1) / 2, 960, 1.0], clock: [ccx + 60, ccy + 80, 1.35], desk: [dX - 40, dY - 140, 1.3] },
      back: (ctx) => {
        // wall clock strikes eight
        const k = t - tO, mA = t < tO ? -.1 + Math.sin(t * 6) * .01 : lerp(-.1, 0, eBack(clamp(k / .3, 0, 1))), sh = k >= 0 && k < 1 ? Math.sin(k * 50) * 8 * (1 - k) : 0;
        ctx.save(); ctx.translate(sh, 0); clockFace(ctx, ccx, ccy, 120, 8 / 12 * TAU, mA); ctx.restore();
        if (k >= 0 && k < 1.4){ ctx.save(); ctx.translate(ccx + 40, ccy - 160); ctx.rotate(-.12); const q2 = popQ(t, tO, .3); ctx.scale(q2, q2); ctx.globalAlpha *= clamp(1.4 - k, 0, 1); outlineWords(ctx, [{ w: o.bellText || "TENG!", hl: true }], 0, 0, 70, { sw: 14 }); ctx.restore(); }
        // workstation behind the shutter
        ctx.fillStyle = "#EAD3B2"; ctx.fillRect(X0, TY + 80, X1 - X0, GROUND - TY - 80);
        rr(ctx, X0 + 60, TY + 170, 260, 150, 10); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, o.boardText || "TARGET HARI INI", X0 + 190, TY + 215, 24, ORANGE, 800, 230); for (let r = 0; r < 3; r++){ ctx.fillStyle = "#C9B79F"; rr(ctx, X0 + 90, TY + 240 + r * 24, 180 - r * 40, 10, 5); ctx.fill(); }
        ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(dX, GROUND + 4, 300, 18, 0, 0, TAU); ctx.fill();
        [-250, 230].forEach(d => { rr(ctx, dX + d, dY + 20, 24, GROUND - dY - 20, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); });
        rr(ctx, dX - 280, dY - 10, 560, 40, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        // laptop (dark until the first document opens)
        const lx = dX - 60, lit = rq(t, tDoc, .35);
        rr(ctx, lx - 170, dY - 26, 340, 18, 8); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
        rr(ctx, lx - 150, dY - 26 - 220, 300, 220, 12); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.stroke();
        rr(ctx, lx - 136, dY - 26 - 208, 272, 196, 8); ctx.fillStyle = lit > 0 ? lerpCol("#2C323D", "#FFFDF8", lit) : "#2C323D"; ctx.fill();
        if (lit > 0){ glowAt(ctx, lx, dY - 130, 280, "#FFF3D6", .35 * lit); const ty = (t - tDoc - .3) * 3; ctx.fillStyle = ORANGE; rr(ctx, lx - 116, dY - 214, 120, 16, 6); ctx.fill(); for (let r = 0; r < 6; r++){ const w = clamp(ty - r, 0, 1) * (170 + rnd(r) * 60); ctx.fillStyle = "#C9B79F"; rr(ctx, lx - 116, dY - 184 + r * 26, w, 11, 5); ctx.fill(); } }
        // mug
        ctx.save(); ctx.translate(dX + 200, dY - 10); rr(ctx, -26, -62, 52, 62, 8); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = ORANGE; ctx.fillRect(-22, -44, 44, 10);
        for (let k2 = 0; k2 < 3; k2++){ const q = ((t * .5 + k2 / 3) % 1); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-8 + k2 * 8, -70 - q * 70); ctx.quadraticCurveTo(-20 + k2 * 8, -90 - q * 70, -6 + k2 * 8, -110 - q * 70); ctx.stroke(); } ctx.restore();
        // the phone flips face-down on the desk
        const st = null;
        // shutter housing + slats
        ctx.save(); ctx.beginPath(); ctx.rect(X0, TY + 80, X1 - X0, botY - TY - 80); ctx.clip();
        ctx.fillStyle = "#B8B0A2"; ctx.fillRect(X0, TY + 80, X1 - X0, botY - TY - 80);
        for (let y = botY - 34; y > TY + 60; y -= 34){ ctx.fillStyle = "#A39A8C"; ctx.fillRect(X0, y, X1 - X0, 6); ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(X0, y + 8, X1 - X0, 4); }
        ctx.restore();
        if (botY > TY + 90){ rr(ctx, X0 - 6, botY - 26, X1 - X0 + 12, 30, 6); ctx.fillStyle = "#8C8476"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); rr(ctx, (X0 + X1) / 2 - 50, botY - 18, 100, 14, 7); ctx.fillStyle = BROWN; ctx.fill(); }
        [X0 - 18, X1 - 2].forEach(x => { rr(ctx, x, TY + 60, 20, GROUND - TY - 60, 6); ctx.fillStyle = "#8C8476"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); });
        rr(ctx, X0 - 30, TY, X1 - X0 + 60, 96, 16); ctx.fillStyle = "#6B6457"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        if (k >= 0 && k < 1){ for (let j = 0; j < 8; j++){ const u = k + j * .05; ctx.save(); ctx.globalAlpha *= clamp(1 - k, 0, 1) * .8; ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.beginPath(); const xx = X0 + 40 + j * (X1 - X0 - 80) / 7; ctx.moveTo(xx, TY + 110 + u * 30); ctx.lineTo(xx, TY + 160 + u * 30); ctx.stroke(); ctx.restore(); } dust(ctx, (X0 + X1) / 2, TY + 110, k, 10, "#E9D8C2", 300); }
        // hanging sign: TUTUP -> BUKA
        const sk = t - tO - .25, flip = sk < 0 ? 1 : sk < .4 ? Math.cos(sk / .4 * Math.PI) : -1, open = flip < 0, sw = Math.sin(t * 2.2) * .05 + (sk > 0 && sk < 1.2 ? Math.sin(sk * 12) * .12 * (1.2 - sk) : 0);
        ctx.save(); ctx.translate((X0 + X1) / 2, TY + 96); ctx.rotate(sw); ctx.strokeStyle = BROWN; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-40, 60); ctx.moveTo(60, 0); ctx.lineTo(40, 60); ctx.stroke();
        ctx.translate(0, 110); ctx.scale(Math.abs(flip) < .05 ? .05 : Math.abs(flip), 1); rr(ctx, -130, -52, 260, 104, 18); ctx.fillStyle = open ? GREEN : RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        textC(ctx, open ? (o.signB || "BUKA") : (o.signA || "TUTUP"), 0, 20, 56, "#FFFFFF", 800, 230); ctx.restore();
      },
      front: (ctx, c, sts) => {
        const st = sts[o.from ?? 0];
        const pk = t - tPh, PX2 = dX + 90, PY2 = dY - 16;
        if (pk >= 0){ const A = st ? lp(st, 18, -46) : [400, 1150], q = clamp(pk / .5, 0, 1), x = lerp(A[0], PX2, eOut(q)), y = lerp(A[1], PY2, q) - Math.sin(q * Math.PI) * 200;
          ctx.save(); ctx.translate(x, y); ctx.rotate(q < 1 ? q * TAU : 0); const sy = q < 1 ? Math.cos(q * Math.PI) : -1; ctx.scale(1, q < 1 ? sy : .28); ctx.translate(0, 0);
          rr(ctx, -50, -90, 100, 180, 18); ctx.fillStyle = q > .5 ? "#3B3530" : "#1E1A18"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
          if (q >= 1){ const mq = popQ(t, tPh + .55, .35); ctx.save(); ctx.translate(PX2 + 30, PY2 - 70 + Math.sin(t * 2) * 6); ctx.scale(mq, mq); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
            ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(-2, 0, 16, 0, TAU); ctx.fill(); ctx.fillStyle = "#3B4A6B"; ctx.beginPath(); ctx.arc(6, -5, 14, 0, TAU); ctx.fill(); ctx.restore(); } }
        const wk = t - tWin; if (wk >= 0 && st){ const h = toonHead(st), q = popQ(t, tWin, .5); ctx.save(); ctx.translate(h[0] + 10, h[1] - 300 + Math.sin(t * 3) * 8); ctx.scale(q, q); ctx.rotate(-.05);
            rr(ctx, -150, -70, 300, 140, 22); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); rr(ctx, -150, -70, 300, 40, [22, 22, 0, 0]); ctx.fillStyle = ORANGE; ctx.fill(); ctx.stroke(); textC(ctx, o.winCard || "KARTU JANJI", 0, -40, 22, CREAM, 800, 260);
            [["SEN", 0], ["SEL", 1]].forEach(([l, j]) => { const xx = -80 + j * 90; ctx.beginPath(); ctx.arc(xx, 20, 34, 0, TAU); ctx.setLineDash([7, 6]); ctx.strokeStyle = "#C9B79F"; ctx.lineWidth = 4; ctx.stroke(); ctx.setLineDash([]); if (j === 1){ const s2 = 1.6 - .6 * eOut(clamp((wk - .3) / .25, 0, 1)); if (wk > .3){ ctx.save(); ctx.translate(xx, 20); ctx.scale(s2, s2); ctx.beginPath(); for (let p = 0; p < 16; p++){ const a = p / 16 * TAU, r = p % 2 ? 30 : 38; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = HL; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-3, 9); ctx.lineTo(13, -9); ctx.stroke(); ctx.restore(); } } else textC(ctx, l, xx, 29, 22, "#B8A58C", 800); });
            textC(ctx, "...", 100, 30, 36, "#B8A58C", 800); ctx.restore();
          if (wk < 2.2){ for (let k2 = 0; k2 < 36; k2++){ const a = -Math.PI / 2 + (rnd(k2 + 3) - .5) * 2.6, v = 500 + rnd(k2 + 9) * 700, x = h[0] + Math.cos(a) * v * wk, y = h[1] - 100 + Math.sin(a) * v * wk + 1000 * wk * wk;
            ctx.save(); ctx.globalAlpha *= clamp(2 - wk, 0, 1); ctx.translate(x, y); ctx.rotate(wk * 8 + k2); ctx.fillStyle = [ORANGE, GOLD, CREAM, "#E8708A"][k2 % 4]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); } } }
      } });
  }, (s, f, i, add) => { const o = f.buka || {}; if (o.openCue){ const to = cueT(s, o.openCue, .2, i); add(to, "chime"); add(to + .05, "whoosh"); add(to + .8, "pop"); add(to + .3, "pop"); }
    if (o.phoneCue){ const tp = cueT(s, o.phoneCue, .3, i); add(tp, "whoosh"); add(tp + .5, "pop"); } if (o.docCue) add(cueT(s, o.docCue, .3, i), "ping"); if (o.winCue){ const tw = cueT(s, o.winCue, .5, i); add(tw, "chime"); add(tw + .3, "pop"); } });

  /* ================= _tunda: alarm clock, promise scroll, snooze button ================= */
  // f.tunda: {clockX, clockY, from:"07.59", ringCue, ringText:"08.00", promise:{cue, text, x, y}, btn:{cue, x}, pressCue, pressText:"+5 MENIT", after:"08.05"}
  reg("tunda", "Cerita: tombol tunda raksasa", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.tunda || {};
    const cx = o.clockX ?? 540, cy = o.clockY ?? 300, tR = T(s, o.ringCue, .2, i), tPr = T(s, o.pressCue, .4, i), pr = o.promise || {}, tPm = tOf(s, pr, .3, i), bt = o.btn || {}, tB = tOf(s, bt, .2, i);
    const bx = bt.x ?? 780, btop = o.btnTop ?? 1180;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 980 },
      spots: { clock: [cx, cy + 120, 1.3], btn: [bx - 100, btop - 120, 1.2] },
      back: (ctx, c, sts) => {
        // promise scroll on the wall
        if (t >= tPm){ const st = sts[pr.from ?? 0], start = st ? toonHead(st) : [300, 1000], X = pr.x ?? 780, Y = pr.y ?? 650, k = t - tPm, FL = .6, q = clamp(k / FL, 0, 1), e = eOut(q);
          const x = lerp(start[0], X, e), y = lerp(start[1], Y, e) - Math.sin(q * Math.PI) * 200, crack = t >= tPr ? rq(t, tPr + .2, .4) : 0, wob = t >= tPr ? Math.sin((t - tPr) * 18) * .08 * Math.exp(-(t - tPr) * 2.5) : 0;
          ctx.save(); ctx.translate(x, y); ctx.rotate(-.06 + (1 - q) * 3 + wob); const sc = .4 + .6 * e; ctx.scale(sc, sc);
          const w = 330, h = 200; ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -w / 2 + 10, -h / 2 + 14, w, h, 10); ctx.fill();
          rr(ctx, -w / 2, -h / 2, w, h, 10); ctx.fillStyle = "#FFF3D9"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
          [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(0, d * h / 2, w / 2 + 6, 16, 0, 0, TAU); ctx.fillStyle = "#E9D0A8"; ctx.fill(); ctx.stroke(); });
          textC(ctx, "JANJIKU", 0, -h / 2 + 58, 30, ORANGE, 800);
          String(pr.text || "MULAI KERJA\nJAM 08.00").split("\n").forEach((l, j) => textC(ctx, l, 0, -h / 2 + 106 + j * 44, 38, BROWN, 800, w - 50));
          ctx.beginPath(); ctx.arc(w / 2 - 34, h / 2 - 26, 30, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.stroke(); textC(ctx, "✓", w / 2 - 34, h / 2 - 14, 32, CREAM, 800);
          if (crack > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); const pts = [[-30, -h / 2], [-10, -40], [-34, -6], [-6, 30], [-22, h / 2]]; const n = Math.max(1, Math.round(crack * (pts.length - 1)));
            ctx.moveTo(pts[0][0], pts[0][1]); for (let k2 = 1; k2 <= n; k2++) ctx.lineTo(pts[k2][0], pts[k2][1]); ctx.stroke(); }
          ctx.restore(); }
        // giant digital alarm clock
        const ringK = t - tR, ringing = ringK >= 0 && t < tPr, jig = ringing ? Math.sin(t * 45) * .035 : 0, pq = t >= tPr ? t - tPr : -1;
        ctx.save(); ctx.translate(cx, cy + 120); ctx.rotate(jig); const sq = pq >= 0 && pq < .35 ? 1 - .12 * Math.sin(pq / .35 * Math.PI) : 1; ctx.scale(2 - sq, sq);
        [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * 210, -130); ctx.rotate(d * .4 + (ringing ? Math.sin(t * 50 + d) * .25 : 0)); ctx.beginPath(); ctx.arc(0, 0, 58, Math.PI, 0); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); });
        [-1, 1].forEach(d => { ctx.fillStyle = BROWN; ctx.beginPath(); ctx.moveTo(d * 200, 110); ctx.lineTo(d * 240, 160); ctx.lineTo(d * 180, 160); ctx.closePath(); ctx.fill(); });
        rr(ctx, -300, -130, 600, 250, 60); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke();
        rr(ctx, -250, -95, 500, 180, 30); ctx.fillStyle = "#1E1A18"; ctx.fill();
        let txt = o.from || "07.59"; if (t >= tR) txt = o.ringText || "08.00"; if (t >= tPr + .35) txt = o.after || "08.05";
        const blink = t >= tR && t < tPr && Math.floor(t * 4) % 2 === 0; ctx.globalAlpha *= blink ? .45 : 1;
        font(ctx, 800, 150, FAM); ctx.fillStyle = t >= tR ? "#FF7A4A" : "#F6C343"; ctx.textAlign = "center"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 18; ctx.fillText(txt, 0, 52); ctx.shadowBlur = 0; ctx.textAlign = "left";
        ctx.restore();
        if (ringing){ ctx.save(); ctx.strokeStyle = HL; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let k = 0; k < 6; k++){ const a = -Math.PI / 2 + (k - 2.5) * .45, r0 = 330 + ((t * 3 + k * .3) % 1) * 40; ctx.globalAlpha = .8; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + 120 + Math.sin(a) * r0 * .7); ctx.lineTo(cx + Math.cos(a) * (r0 + 40), cy + 120 + Math.sin(a) * (r0 + 40) * .7); ctx.stroke(); } ctx.restore(); }
        if (pq >= 0){ chip(ctx, o.pressText || "+5 MENIT", cx + 190, cy + 300, pq - .3, { size: 44, icon: "clock", t, rot: .05 }); }
      },
      mid: (ctx) => {
        if (t < tB) return; const q = popQ(t, tB, .5), pq = t >= tPr ? t - tPr : -1, press = pq >= 0 && pq < .45 ? Math.sin(pq / .45 * Math.PI) : 0;
        ctx.save(); ctx.translate(bx, GROUND); ctx.scale(q, q);
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 6, 150, 18, 0, 0, TAU); ctx.fill();
        rr(ctx, -95, -(GROUND - btop), 190, GROUND - btop, 20); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        rr(ctx, -120, -(GROUND - btop) - 26, 240, 40, 14); ctx.fillStyle = "#8E5A36"; ctx.fill(); ctx.stroke();
        textC(ctx, o.btnText || "TUNDA", 0, -(GROUND - btop) + 110, 46, CREAM, 800, 170);
        const dh = 80 * (1 - .55 * press); ctx.beginPath(); ctx.ellipse(0, -(GROUND - btop) - 26, 100, dh, 0, Math.PI, 0); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.beginPath(); ctx.ellipse(-36, -(GROUND - btop) - 26 - dh * .55, 22, 12, -.4, 0, TAU); ctx.fill();
        ctx.restore();
        if (pq >= 0 && pq < .9){ burstFx(ctx, bx, btop - 60, pq, RED, 10, 150); }
        if (pq >= 0){ for (let k = 0; k < 3; k++){ const u = ((pq * .6 + k / 3) % 1); ctx.save(); ctx.globalAlpha *= (1 - u) * clamp(pq * 2, 0, 1); textC(ctx, "z", bx + 60 + u * 90 + k * 10, btop - 150 - u * 220, 40 + k * 12, CREAM, 800); ctx.restore(); } }
      }, midZ: 1 });
  }, (s, f, i, add) => { const o = f.tunda || {}; if (o.ringCue){ const tr = cueT(s, o.ringCue, .2, i); add(tr, "ping"); add(tr + .4, "ping"); add(tr + .8, "ping"); }
    if (o.promise) add(tOf(s, o.promise, .3, i) + .6, "pop"); if (o.btn) add(tOf(s, o.btn, .2, i), "whoosh"); if (o.pressCue){ const tp = cueT(s, o.pressCue, .4, i); add(tp, "pop"); add(tp + .3, "whoosh"); } });

  function lerpCol(a, b, q){ const pa = [1, 3, 5].map(k => parseInt(a.slice(k, k + 2), 16)), pb = [1, 3, 5].map(k => parseInt(b.slice(k, k + 2), 16)); return "#" + pa.map((v, k) => Math.round(lerp(v, pb[k], q)).toString(16).padStart(2, "0")).join(""); }


  /* ================= _luncur: back-and-forth copying vs. a data slide ================= */
  // f.luncur: {mode:"manual"|"cepat"|"otomatis", runner (toon index), startAt, period, towerX, board:{x0, y0, w, h, title},
  //   days:[{cue|at, text}], calX, calY, timerCue, timerText, tripCue (trip counter chip), lateCue, lateText, buildCue, autoRate}
  reg("luncur", "Cerita: bolak-balik salin data / perosotan data", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.luncur || {}, mode = o.mode || "manual", b = o.board || {};
    const TX = o.towerX ?? 150, x0 = b.x0 ?? 600, y0 = b.y0 ?? 340, w = b.w ?? 380, h = b.h ?? 560, nR = 7, rowH = (h - 130) / nR;
    const ri = o.runner ?? 0, t0 = o.startAt ?? .2, P = o.period ?? (mode === "cepat" ? .95 : 1.7), xa = TX + 150, xb = x0 - 40;
    const shuttle = mode !== "otomatis", trips = shuttle ? Math.max(0, Math.floor((t - t0) / P + .5)) : 0;
    const days = (o.days || []).map(d => Object.assign({ T: tOf(s, d, .2, i) }, d)), tT = T(s, o.timerCue, .4, i), tTr = T(s, o.tripCue, .3, i), tLt = T(s, o.lateCue, .4, i), tBd = T(s, o.buildCue, .3, i);
    const slideA = [TX + 80, 640], slideC1 = [TX + 420, 560], slideC2 = [x0 - 260, 900], slideB = [x0 + 10, 760];
    const sl = u => { const v = 1 - u; return [v * v * v * slideA[0] + 3 * v * v * u * slideC1[0] + 3 * v * u * u * slideC2[0] + u * u * u * slideB[0], v * v * v * slideA[1] + 3 * v * v * u * slideC1[1] + 3 * v * u * u * slideC2[1] + u * u * u * slideB[1]]; };
    const autoRate = o.autoRate ?? .32, autoN = mode === "otomatis" && t > tBd + 1.2 ? Math.floor((t - tBd - 1.2) / autoRate) : 0, filled = shuttle ? trips : autoN;
    base(ctx, s, t, { env: o.env || (mode === "cepat" ? "info" : "office"), envOpt: o.envOpt || (mode === "cepat" ? { spotX: 540 } : { desk: false, plantX: 1010 }),
      spots: { board: [x0 + w / 2, y0 + h / 2, 1.1], tower: [TX + 60, 760, 1.25], slide: [560, 860, 1.0] },
      adj: (sts) => { if (!shuttle) return; const st = sts[ri]; if (!st || t < t0 - .1) return; const u = ((t - t0) / P) % 1, go = u < .5, q = go ? u * 2 : (u - .5) * 2, e = easeIO(q);
        st.x = go ? lerp(xa, xb, e) : lerp(xb, xa, e); st.face = go ? 1 : -1; st.moving = q > .06 && q < .94; st.run = mode === "cepat"; st.moveT = t; st.pose = go ? "hold" : (mode === "cepat" ? "idle" : "idle"); },
      back: (ctx, c, sts) => {
        // mailbox tower "EMAIL"
        const tw = 210, tTop = 560; ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(TX, GROUND + 6, 150, 16, 0, 0, TAU); ctx.fill();
        rr(ctx, TX - tw / 2, tTop, tw, GROUND - tTop, 16); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        rr(ctx, TX - tw / 2 - 14, tTop - 30, tw + 28, 50, 14); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ctx.stroke(); textC(ctx, o.towerText || "EMAIL", TX, tTop + 8, 34, CREAM, 800, tw);
        rr(ctx, TX - 70, tTop + 70, 140, 26, 8); ctx.fillStyle = "#1E1A18"; ctx.fill();
        for (let k = 0; k < 3; k++){ ctx.save(); ctx.translate(TX - 30 + k * 30, tTop + 72 + Math.sin(t * 4 + k) * 3); ctx.rotate(-.1 + k * .1); rr(ctx, -26, -40, 52, 36, 4); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
        for (let k = 0; k < 5; k++){ rr(ctx, TX - 80, tTop + 140 + k * 150, 160, 120, 10); ctx.fillStyle = "#4A6A9C"; ctx.fill(); ctx.strokeStyle = "rgba(43,26,18,.4)"; ctx.lineWidth = 3; ctx.stroke(); }
        const bq = 1 + .1 * Math.sin(t * 6); ctx.save(); ctx.translate(TX + tw / 2 - 6, tTop - 26); ctx.scale(bq, bq); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, mode === "otomatis" ? "✓" : "99+", 0, 9, 24, "#FFFFFF", 800, 60); ctx.restore();
        // table board
        rr(ctx, x0 + 12, y0 + 16, w, h, 20); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fill();
        rr(ctx, x0, y0, w, h, 20); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        rr(ctx, x0, y0, w, 76, [20, 20, 0, 0]); ctx.fillStyle = ORANGE; ctx.fill(); ctx.stroke(); textC(ctx, b.title || "TABEL PESANAN", x0 + w / 2, y0 + 52, 34, CREAM, 800, w - 40);
        const hy = y0 + 76; ctx.fillStyle = "#F3E6D2"; ctx.fillRect(x0 + 3, hy, w - 6, 48); font(ctx, 800, 24, FAM); ctx.fillStyle = "#8A5A3E"; ["NO", "NAMA", "QTY"].forEach((l, k) => ctx.fillText(l, x0 + [18, 90, w - 86][k], hy + 33));
        ctx.save(); ctx.beginPath(); ctx.rect(x0 + 3, hy + 48, w - 6, nR * rowH); ctx.clip();
        const scroll = Math.max(0, filled - nR); const lastT = shuttle ? t0 + (filled - .5) * P : tBd + 1.2 + autoN * autoRate, sq = clamp((t - lastT) / .25, 0, 1), off = filled > nR ? (1 - sq) * rowH : 0;
        for (let r = Math.max(0, scroll - 1); r < filled; r++){ const y = hy + 48 + (r - scroll) * rowH + off; const isNew = r === filled - 1, q = isNew ? sq : 1;
          ctx.fillStyle = r % 2 ? "#FFF8EE" : "#FFFDF8"; ctx.fillRect(x0 + 3, y, w - 6, rowH); if (isNew && q < 1){ ctx.fillStyle = hexA(GOLD, .5 * (1 - q)); ctx.fillRect(x0 + 3, y, w - 6, rowH); }
          font(ctx, 700, 24, FAM); ctx.fillStyle = BROWN; ctx.fillText(String(r + 1), x0 + 20, y + rowH / 2 + 9); ctx.fillStyle = "#C9B79F"; rr(ctx, x0 + 88, y + rowH / 2 - 7, (110 + rnd(r) * 120) * (isNew ? q : 1), 14, 7); ctx.fill(); ctx.fillStyle = ORANGE; rr(ctx, x0 + w - 84, y + rowH / 2 - 7, 40 + rnd(r + 3) * 20, 14, 7); ctx.fill(); }
        ctx.restore();
        ctx.strokeStyle = "rgba(59,36,24,.25)"; ctx.lineWidth = 3; [x0 + 70, x0 + w - 100].forEach(x => { ctx.beginPath(); ctx.moveTo(x, hy); ctx.lineTo(x, y0 + h - 6); ctx.stroke(); });
        // tear-off calendar
        if (days.length){ const X = o.calX ?? 400, Y = o.calY ?? 330, cur = days.filter(d => t >= d.T), di = cur.length - 1;
          ctx.save(); ctx.translate(X, Y); rr(ctx, -110, -40, 220, 200, 14); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
          const page = (txt) => { rr(ctx, -96, -12, 192, 160, 8); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); rr(ctx, -96, -12, 192, 36, [8, 8, 0, 0]); ctx.fillStyle = RED; ctx.fill(); textC(ctx, String(txt).toUpperCase(), 0, 96, 40, BROWN, 800, 170); };
          if (di >= 0){ const nxt = days[di + 1]; page(cur[di].text); const k = t - cur[di].T; if (di > 0 && k < 1.2){ ctx.save(); ctx.translate(60 + k * 200, 40 + 500 * k * k); ctx.rotate(k * 4); ctx.globalAlpha *= clamp(1.2 - k, 0, 1); ctx.translate(-60, -40); page(days[di - 1].text); ctx.restore(); } }
          else page(days[0] ? "..." : ""); ctx.restore(); }
        if (t >= tT) chip(ctx, o.timerText || "45 MENIT", o.timerX ?? 400, o.timerY ?? 560, t - tT, { size: 44, icon: "clock", t, rot: .03 });
        if (t >= tTr) chip(ctx, (o.tripText || "BOLAK-BALIK") + " " + trips + "x", o.tripX ?? 360, o.tripY ?? 300, t - tTr, { size: 42, t, rot: -.03, fill: "#FFE5DF", ink: RED });
        // waiting "PENTING" folder with a clock that runs to noon
        if (t >= tLt){ const X = o.lateX ?? 380, Y = o.lateY ?? 520, q = popQ(t, tLt, .5), tap = Math.sin(t * 10) * .04; ctx.save(); ctx.translate(X, Y); ctx.scale(q, q); ctx.rotate(-.05 + tap);
          ctx.fillStyle = "#E8B23A"; rr(ctx, -130, -86, 110, 44, 10); ctx.fill(); rr(ctx, -130, -62, 260, 170, 14); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); textC(ctx, o.lateLabel || "PENTING", 0, 36, 42, BROWN, 800, 230); ctx.restore();
          clockFace(ctx, X + 170, Y - 60, 56, (t - tLt) * 2 + 10 / 12 * TAU, (t - tLt) * 24);
          stampBox(ctx, o.lateText || "TERTUNDA", X + 10, Y + 150, t - tLt - .8, RED, 40, -.1); }
        // the data slide (otomatis)
        if (mode === "otomatis" && t >= tBd){ const bq = clamp((t - tBd) / 1.0, 0, 1), N = 40, nn = Math.floor(N * bq);
          const pts = []; for (let k = 0; k <= nn; k++) pts.push(sl(k / N));
          if (pts.length > 1){ ctx.lineCap = "round"; ctx.lineJoin = "round"; const path = () => { ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); };
            path(); ctx.strokeStyle = OUT; ctx.lineWidth = 62; ctx.stroke(); path(); ctx.strokeStyle = "#F4A85C"; ctx.lineWidth = 48; ctx.stroke(); path(); ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 10; ctx.stroke();
            for (let k = 2; k < nn; k += 4){ const p = sl(k / N); glowAt(ctx, p[0], p[1] + 40, 50, "#FFE08A", .5 + .3 * Math.sin(t * 6 + k)); sparkle(ctx, p[0] + Math.sin(t * 3 + k) * 10, p[1] + 50 + Math.cos(t * 4 + k) * 8, 10, GOLD); }
            if (bq < 1){ const p = sl(bq); burstFx(ctx, p[0], p[1], ((t - tBd) * 3) % .9, GOLD, 6, 70); } }
          if (bq >= 1){ const p = sl(.42); chip(ctx, o.slideText || "OTOMATIS", p[0] + 20, p[1] - 110, t - tBd - 1.0, { size: 34, icon: "gear", fill: CREAM, t }); }
        }
      },
      front: (ctx, c, sts) => {
        const st = sts[ri];
        if (shuttle && st && t >= t0){ const u = ((t - t0) / P) % 1;
          if (u < .5){ const hd = lp(st, 21, -47); ctx.save(); ctx.translate(hd[0], hd[1] - 30); ctx.rotate(Math.sin(t * 8) * .06); rr(ctx, -50, -34, 100, 68, 8); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = "#C9B79F"; for (let r = 0; r < 3; r++){ rr(ctx, -36, -20 + r * 16, 72 - r * 16, 8, 4); ctx.fill(); } ctx.restore(); }
          // the card flies into the table at each arrival
          const ka = ((t - t0) / P + .5) % 1 * P; if (trips > 0 && ka < .3){ const q = ka / .3, A = [xb + 40, 1120], rowIdx = Math.min(trips - 1, nR - 1), B = [x0 + w / 2, y0 + 124 + (rowIdx + .5) * rowH]; ctx.save(); ctx.translate(lerp(A[0], B[0], eOut(q)), lerp(A[1], B[1], eOut(q)) - Math.sin(q * Math.PI) * 80); ctx.scale(1 - q * .3, 1 - q * .3); rr(ctx, -50, -34, 100, 68, 8); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
          if (mode === "cepat"){ const ph = ((t - t0) / P * 2) % 1; if (ph < .3){ dust(ctx, st.x - st.face * 40, GROUND - 10, ph, 6, "#E9D8C2", 120); } } }
        if (mode === "otomatis" && t >= tBd + 1.0){ for (let k = 0; k < 6; k++){ const u = ((t - tBd - 1.0) / (autoRate * 3) + k / 6) % 1; if (t - tBd - 1.0 < k * autoRate * .5) continue; const p = sl(u), p2 = sl(Math.min(1, u + .02)), a = Math.atan2(p2[1] - p[1], p2[0] - p[0]);
          ctx.save(); ctx.translate(p[0], p[1] - 34); ctx.rotate(a); rr(ctx, -40, -26, 80, 52, 6); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = ORANGE; rr(ctx, -28, -14, 56, 8, 4); ctx.fill(); ctx.restore(); } }
      },
      over1: (ctx, c, sts, j, R2) => { if (j !== ri || !R2[j] || mode !== "cepat") return; const r = R2[j];
        for (let k = 0; k < 5; k++){ const u = ((t * 1.5 + k / 5) % 1); ctx.save(); ctx.globalAlpha *= (1 - u) * .9; ctx.translate(r.headX - r.face * (r.r * .9 + u * 90), r.headY - r.r * .7 + u * u * 140 - u * 40); ctx.fillStyle = "#9FD3E8"; ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(9, 2, 0, 10); ctx.quadraticCurveTo(-9, 2, 0, -12); ctx.fill(); ctx.restore(); } } });
  }, (s, f, i, add) => { const o = f.luncur || {}, mode = o.mode || "manual";
    (o.days || []).forEach((d, j) => { if (j) add(tOf(s, d, .2, i), "whoosh"); });
    if (mode !== "otomatis"){ const P = o.period ?? (mode === "cepat" ? .95 : 1.7), t0 = o.startAt ?? .2; for (let k = 0; k < 40; k++){ const ta = t0 + (k + .5) * P; if (ta > 30) break; if (k % (mode === "cepat" ? 2 : 1) === 0) add(ta, "pop"); } }
    if (o.timerCue) add(cueT(s, o.timerCue, .4, i), "ping"); if (o.tripCue) add(cueT(s, o.tripCue, .3, i), "pop"); if (o.lateCue){ const tl = cueT(s, o.lateCue, .4, i); add(tl, "pop"); add(tl + .8, "pop"); }
    if (o.buildCue){ const tb = cueT(s, o.buildCue, .3, i); add(tb, "whoosh"); add(tb + 1.0, "chime"); for (let k = 0; k < 8; k++) add(tb + 1.2 + k * (o.autoRate ?? .32) * 2, "pop"); } });

  /* ================= _kursi: rolling-chair convoy into the meeting room ================= */
  // f.kursi: {doorX, clockX, clockY, fastCue, slowCue, cricketCue, cricketText, bellOn (toon index), bellCue, chairs: [toon indexes on chairs]}
  function rollChair(ctx, x, y, face, size, spin, moving){ const k = size / 760; ctx.save(); ctx.translate(x, y); ctx.scale(k * face, k);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 150, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.lineCap = "round"; [-110, 0, 110].forEach(d => { ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(d, -18); ctx.stroke(); });
    [-110, 0, 110].forEach(d => { ctx.save(); ctx.translate(d, -14); ctx.rotate(spin); ctx.beginPath(); ctx.arc(0, 0, 17, 0, TAU); ctx.fillStyle = "#3B3530"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.stroke(); ctx.restore(); });
    ctx.fillStyle = "#8C8476"; rr(ctx, -10, -230, 20, 175, 6); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    rr(ctx, -130, -250, 230, 46, 20); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ctx.stroke();
    rr(ctx, -150, -560, 60, 330, 26); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ctx.stroke();
    if (moving){ ctx.strokeStyle = hexA(CREAM, .7); ctx.lineWidth = 8; for (let j = 0; j < 3; j++){ ctx.beginPath(); ctx.moveTo(-200 - j * 30, -120 - j * 60); ctx.lineTo(-300 - j * 50, -120 - j * 60); ctx.stroke(); } }
    ctx.restore(); }
  reg("kursi", "Cerita: konvoi kursi beroda ke ruang rapat", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.kursi || {};
    const DX = o.doorX ?? 900, ccx = o.clockX ?? 330, ccy = o.clockY ?? 400, tF = T(s, o.fastCue, .2, i), tS = T(s, o.slowCue, .6, i), tC = T(s, o.cricketCue, .5, i), tBl = T(s, o.bellCue, .2, i);
    const fastU = t < tF ? 0 : Math.min(t, tS) - tF, mA = t * .3 + fastU * 14, hA = 1.7 + fastU * 14 / 12, chairs = new Set(o.chairs || []);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { door: [DX - 120, 1020, 1.05], clock: [ccx, ccy + 80, 1.4] },
      back: (ctx) => {
        // meeting room door
        rr(ctx, DX - 120, 820, 240, GROUND - 820, 10); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
        ctx.fillStyle = "#5A3A2A"; rr(ctx, DX - 104, 836, 208, GROUND - 836, 6); ctx.fill(); glowAt(ctx, DX, 1100, 240, "#FFE3A0", .25);
        rr(ctx, DX - 150, 720, 300, 80, 14); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); textC(ctx, o.doorText || "RUANG RAPAT", DX, 774, 34, CREAM, 800, 270);
        // clock racing while everyone gathers
        clockFace(ctx, ccx, ccy, 115, hA, mA, { blur: t >= tF && t < tS });
        if (t >= tF && t < tS){ ctx.save(); ctx.strokeStyle = HL; ctx.lineWidth = 7; ctx.lineCap = "round"; for (let k = 0; k < 6; k++){ const a = k / 6 * TAU + t * 3; ctx.beginPath(); ctx.arc(ccx, ccy, 140, a, a + .35); ctx.stroke(); } ctx.restore();
          chip(ctx, o.waitText || "30 MENIT...", ccx, ccy + 180, t - tF - .2, { size: 40, t, fill: "#FFE5DF", ink: RED }); }
      },
      under: (ctx, c, sts, j) => { if (!chairs.has(j)) return; const st = sts[j]; rollChair(ctx, st.x - st.face * st.size * .03, st.y, st.face || 1, st.size, st.x / 30, Math.abs(st.vx) > 30); },
      over1: (ctx, c, sts, j, R2) => { if (j !== (o.bellOn ?? -1) || !R2[j]) return; const st = sts[j], hd = lp(st, 25, -70), k = t - tBl, ring = k >= 0 && k < 2.4 ? Math.sin(t * 30) * .5 : 0;
        ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate(ring); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(-34, 50); ctx.quadraticCurveTo(-30, -10, 0, -14); ctx.quadraticCurveTo(30, -10, 34, 50); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
        rr(ctx, -7, -60, 14, 48, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.stroke(); ctx.restore();
        if (k >= 0 && k < 2.4){ ctx.save(); ctx.strokeStyle = HL; ctx.lineWidth = 7; ctx.lineCap = "round"; for (let q = 0; q < 3; q++){ const a = -1.2 + q * .5; ctx.beginPath(); ctx.moveTo(hd[0] + Math.cos(a) * 70, hd[1] + Math.sin(a) * 70); ctx.lineTo(hd[0] + Math.cos(a) * (100 + Math.sin(t * 20) * 10), hd[1] + Math.sin(a) * (100 + Math.sin(t * 20) * 10)); ctx.stroke(); } ctx.restore(); } },
      over: () => {
        if (t < tC) return; const k = t - tC; for (let j = 0; j < 2; j++){ const kk = k - j * .7; if (kk < 0 || kk > 1.6) continue; ctx.save(); ctx.globalAlpha *= clamp(1.6 - kk, 0, 1) * clamp(kk * 4, 0, 1); outlineWords(ctx, [{ w: o.cricketText || "KRIK...", hl: false }], 300 + j * 420, 640 - kk * 40, 64, { sw: 13, fill: "#DCEFC9" }); ctx.restore(); }
      } });
  }, (s, f, i, add) => { const o = f.kursi || {}; if (o.bellCue){ const tb = cueT(s, o.bellCue, .2, i); for (let k = 0; k < 4; k++) add(tb + k * .3, "ping"); } if (o.fastCue) add(cueT(s, o.fastCue, .2, i), "whoosh"); if (o.slowCue) add(cueT(s, o.slowCue, .6, i), "pop");
    if (o.cricketCue){ const tc = cueT(s, o.cricketCue, .5, i); add(tc, "ping"); add(tc + .7, "ping"); } });

  /* ================= _kosong: the empty work floor during the meeting ================= */
  // f.kosong: {eqCue, eqText, totalCue, totalText, totalHl, delayCue, delayText, delayOn (toon index), desks:[{x, y, s}]}
  reg("kosong", "Cerita: meja kerja kosong saat rapat", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.kosong || {};
    const tEq = T(s, o.eqCue, .3, i), tTo = T(s, o.totalCue, .5, i), tDl = T(s, o.delayCue, .5, i);
    const desks = o.desks || [{ x: 170, y: 1230, s: .5 }, { x: 420, y: 1230, s: .5 }, { x: 670, y: 1230, s: .5 }, { x: 920, y: 1230, s: .5 }, { x: 110, y: 1640, s: .72 }, { x: 420, y: 1640, s: .72 }, { x: 730, y: 1640, s: .72 }, { x: 1040, y: 1640, s: .72 }];
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1000 },
      spots: { floor: [540, 1050, 1.0], top: [540, 600, 1.05] },
      back: (ctx) => {
        desks.forEach((d, k) => { const sc = d.s, X = d.x, Y = d.y, ring = (t * .7 + k * .37) % 3 < .9;
          // empty office chair, slowly spinning
          const sp = Math.cos(t * (.8 + rnd(k) * .6) + k * 1.7); ctx.save(); ctx.translate(X - 20 * sc, Y - 30 * sc); ctx.scale(sc, sc);
          ctx.fillStyle = "#3B4A6B"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -110 * Math.abs(sp) - 10, -700, 220 * Math.abs(sp) + 20, 300, 40); ctx.fill(); ctx.stroke(); ctx.restore();
          ctx.save(); ctx.translate(X, Y); prop(ctx, "desk", 0, 0, { s: sc, papers: 3 }, t); ctx.restore();
          // sleeping laptop + ringing phone
          const ty = Y - 290 * sc; ctx.save(); ctx.translate(X - 40 * sc, ty); ctx.scale(sc, sc);
          ctx.beginPath(); ctx.moveTo(-100, -150); ctx.lineTo(100, -150); ctx.lineTo(110, -10); ctx.lineTo(-110, -10); ctx.closePath(); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = "#2C323D"; ctx.fillRect(-86, -136, 172, 112);
          for (let z = 0; z < 2; z++){ const u = ((t * .5 + z / 2 + k * .13) % 1); ctx.globalAlpha = Math.sin(u * Math.PI); textC(ctx, "z", -20 + z * 30 + u * 30, -60 - u * 60, 34 + z * 10, "#9FB9E8", 800); } ctx.globalAlpha = 1;
          rr(ctx, -125, -10, 250, 14, 6); ctx.fillStyle = BROWN; ctx.fill(); ctx.restore();
          ctx.save(); ctx.translate(X + 150 * sc, ty - 8 * sc); ctx.scale(sc, sc); ctx.rotate(ring ? Math.sin(t * 50) * .15 : 0); rr(ctx, -30, -56, 60, 56, 10); ctx.fillStyle = ring ? RED : "#5A3A2A"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
          if (ring){ ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.lineCap = "round"; [-1, 1].forEach(dd => { ctx.beginPath(); ctx.arc(X + 150 * sc, ty - 36 * sc, 50 * sc, dd > 0 ? -.6 : Math.PI - .6, dd > 0 ? .6 : Math.PI + .6); ctx.stroke(); }); ctx.restore(); }
        });
        if (t >= tEq) bigWord(ctx, (o.eqText || "8 × 30 MENIT").split(" ").map((w, k) => ({ w, hl: k === 1 })), 540, 360 + Math.sin(t * 2) * 5, 90, t - tEq);
        if (t >= tTo){ const L = (o.totalText || "= 4 JAM HILANG").split(" "), hl = (o.totalHl || "4 JAM").split(" "); bigWord(ctx, L.map(w => ({ w, hl: hl.includes(w) })), 540, 500 + Math.sin(t * 2 + 1) * 5, 96, t - tTo);
          if (t - tTo < .9) burstFx(ctx, 540, 470, t - tTo, RED, 12, 260); }
      },
      front: (ctx, c, sts) => { if (t < tDl) return; const st = sts[o.delayOn ?? 0]; if (!st) return; const p = lp(st, 24, -58); stampBox(ctx, o.delayText || "TERTUNDA", p[0] - 30, p[1] - 40, t - tDl, RED, 44, -.14); } });
  }, (s, f, i, add) => { const o = f.kosong || {}; if (o.eqCue) add(cueT(s, o.eqCue, .3, i), "pop"); if (o.totalCue){ const tt = cueT(s, o.totalCue, .5, i); add(tt, "ping"); add(tt + .1, "pop"); } if (o.delayCue) add(cueT(s, o.delayCue, .5, i), "pop"); add(.6, "ping"); add(2.3, "ping"); });

  /* ================= _ombak: one message, a wave of "SIAP!" ================= */
  // f.ombak: {from (sender toon index), to:[toon indexes], sendCue, readCue, replyCue, replyText, timeCue, timeText, deskS}
  reg("ombak", "Cerita: pesan grup, gelombang siap", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.ombak || {}, to = o.to || [1, 2, 3, 4];
    const tSd = T(s, o.sendCue, .3, i), tRd = T(s, o.readCue, .4, i), tRp = T(s, o.replyCue, .5, i), tTm = T(s, o.timeCue, .3, i);
    const arr = k => tSd + .45 + k * .3;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 60 },
      spots: { team: [680, 1000, 1.05] },
      prep: (a, j) => { const k = to.indexOf(j); if (k < 0 || tRp > 1e8) return null; return { a: Object.assign({}, a, { keys: (a.keys || []).concat([{ at: tRp + k * .22, pose: "cheer", expr: "laugh", jump: 110 }, { at: tRp + k * .22 + 1.1, pose: "hips", expr: "happy" }]) }), t }; },
      back: (ctx) => { if (t >= tTm){ const q = popQ(t, tTm, .4); ctx.save(); ctx.translate(560, 420); ctx.scale(q, q); chip(ctx, o.timeText || "2 MENIT", 0, 0, 1, { size: 52, icon: "clock", t }); ctx.restore(); } },
      front: (ctx, c, sts) => {
        const se = sts[o.from ?? 0], A = se ? lp(se, 18, -50) : [220, 1150];
        to.forEach((j, k) => { const st = sts[j]; if (!st) return; ctx.save(); ctx.translate(st.x + 10, GROUND + 30); prop(ctx, "desk", 0, 0, { s: o.deskS ?? .4, laptop: true, back: true }, t); ctx.restore(); });
        // notification orb hops from the sender's phone to every desk
        if (t >= tSd){ to.forEach((j, k) => { const st = sts[j]; if (!st) return; const h = toonHead(st), B = [h[0], h[1] - st.size * .2], t0 = k ? arr(k - 1) : tSd, t1 = arr(k), P0 = k ? (() => { const s0 = sts[to[k - 1]], h0 = toonHead(s0); return [h0[0], h0[1] - s0.size * .2]; })() : A;
            if (t >= t0 && t < t1){ const q = (t - t0) / (t1 - t0), x = lerp(P0[0], B[0], q), y = lerp(P0[1], B[1], q) - Math.sin(q * Math.PI) * 160;
              for (let m = 1; m < 5; m++){ const q2 = Math.max(0, q - m * .06); ctx.save(); ctx.globalAlpha *= .3 - m * .05; ctx.beginPath(); ctx.arc(lerp(P0[0], B[0], q2), lerp(P0[1], B[1], q2) - Math.sin(q2 * Math.PI) * 160, 22, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore(); }
              glowAt(ctx, x, y, 80, "#FFE08A", .7); ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); icon(ctx, "chat", x - 18, y - 18, 36, BROWN, 2.6); }
            if (t >= t1 && t < t1 + .8) burstFx(ctx, B[0], B[1], t - t1, GOLD, 8, 100); }); }
        if (se && t >= tSd && t < tSd + .8) burstFx(ctx, A[0], A[1], t - tSd, HL, 8, 120);
      },
      over: () => { const c2 = TT.CS.cam; if (!c2) return;
        to.forEach((j, k) => { const a = (f.toons || [])[j]; if (!a) return; const st = toonState(a, s, t), h = toonHead(st), sc = c2.toScreen(h[0], h[1] - st.size * .34), tr = tRd + k * .2, tp = tRp + k * .22;
          if (t >= tr && t < tp) chip(ctx, "✓✓", sc[0], sc[1] - 10, t - tr, { size: 34, fill: "#E3F2FD", ink: "#1E88E5", t });
          if (t >= tp) chip(ctx, o.replyText || "Siap!", clamp(sc[0], 140, 940), sc[1] - 20 - (k % 2) * 70, t - tp, { size: 38, icon: "check", iconBg: GREEN, t }); }); } });
  }, (s, f, i, add) => { const o = f.ombak || {}; if (o.sendCue){ const ts = cueT(s, o.sendCue, .3, i); add(ts, "whoosh"); (o.to || [1, 2, 3, 4]).forEach((j, k) => add(ts + .45 + k * .3, "pop")); }
    if (o.readCue){ const tr = cueT(s, o.readCue, .4, i); for (let k = 0; k < 4; k++) add(tr + k * .2, "pop"); } if (o.replyCue){ const tp = cueT(s, o.replyCue, .5, i); for (let k = 0; k < 4; k++){ add(tp + k * .22, "chime"); add(tp + k * .22 + .13, "whoosh"); } } if (o.timeCue) add(cueT(s, o.timeCue, .3, i), "ping"); });

  /* ================= _dok: giant shared document ================= */
  // f.dok: {mode:"ninja"|"kaget"|"komentar", x0, y0, w, h, file, oldNum, newNum, line ("Target naik"),
  //   ninja: readCue, wrongCue, sneakCue, ninjaOn (toon index), eraseCue (paragraph)
  //   kaget: openCue, diffCue, goneCue, whoCue
  //   komentar: blokCue, commentCue, commentText, author, suggestCue, choiceCue, acceptCue}
  function ninjaMask(ctx, r, t){ const k = r.k, hx = r.headX, hy = r.headY, f = r.face, ey = hy - 2 * k;
    ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, 21.5 * k, 21.5 * k, 0, 0, TAU); ctx.clip();
    ctx.beginPath(); ctx.rect(hx - 24 * k, ey - 6.5 * k, 48 * k, 12 * k); [-1, 1].forEach(d => { const ex = hx + (2 + d * 7.3) * k * f; ctx.moveTo(ex + 5.2 * k, ey); ctx.ellipse(ex, ey, 5.2 * k, 4.2 * k, 0, 0, TAU, true); });
    ctx.fillStyle = "#1E1A18"; ctx.fill("evenodd"); ctx.restore();
    ctx.save(); ctx.translate(hx - f * 21 * k, ey); ctx.fillStyle = "#1E1A18"; [0, 1].forEach(j => { ctx.save(); ctx.rotate(f * (-.3 - j * .35) + Math.sin(t * 8 + j) * .15 * f + (f < 0 ? Math.PI : 0)); ctx.beginPath(); ctx.moveTo(0, -3 * k); ctx.quadraticCurveTo(-12 * k, -6 * k, -24 * k, -2 * k + Math.sin(t * 9 + j) * 3 * k); ctx.lineTo(-22 * k, 3 * k); ctx.quadraticCurveTo(-10 * k, 2 * k, 0, 3 * k); ctx.fill(); ctx.restore(); }); ctx.restore(); }
  reg("dok", "Cerita: dokumen bersama raksasa", (ctx, th, s, t) => {
    const f = s.f || {}, i = G.scene, o = f.dok || {}, mode = o.mode || "ninja";
    const x0 = o.x0 ?? 440, y0 = o.y0 ?? 300, w = o.w ?? 590, h = o.h ?? 720;
    const tRead = T(s, o.readCue, .2, i), tWrong = T(s, o.wrongCue, .4, i), tSn = T(s, o.sneakCue, .3, i), tEr = o.eraseCue ? T(s, o.eraseCue, .5, i) : tSn + 1.6;
    const tOp = T(s, o.openCue, .3, i), tDf = T(s, o.diffCue, .3, i), tGn = T(s, o.goneCue, .3, i), tWho = T(s, o.whoCue, .3, i);
    const tBl = T(s, o.blokCue, .3, i), tCm = T(s, o.commentCue, .3, i), tSg = T(s, o.suggestCue, .3, i), tCh = T(s, o.choiceCue, .3, i), tAc = T(s, o.acceptCue, .3, i);
    const numY = y0 + 330, numX = x0 + 50, oldN = o.oldNum || "15%", newN = o.newNum || "12%";
    const erQ = mode === "ninja" ? rq(t, tSn + .5, .7) : 0, typeQ = mode === "ninja" ? rq(t, tSn + 1.25, .4) : 0, paraGone = mode === "ninja" ? rq(t, tEr, .6) : (mode === "kaget" ? 1 : 0);
    base(ctx, s, t, { env: o.env || (mode === "kaget" ? "home" : "office"), envOpt: o.envOpt || (mode === "kaget" ? { time: "day", lampX: 120 } : { desk: false, time: mode === "ninja" ? "night" : "day", plantX: 980 }),
      spots: { doc: [x0 + w / 2, y0 + h / 2, 1.0], num: [x0 + 210, numY - 10, 1.45], para: [x0 + w / 2, y0 + 470, 1.3], comment: [x0 + w / 2 + 40, y0 + 460, 1.25] },
      back: (ctx) => {
        const oq = mode === "kaget" ? popQ(t, tOp, .5) : 1; if (oq <= 0) return;
        ctx.save(); ctx.translate(x0 + w / 2, y0 + h / 2); ctx.scale(oq, oq); ctx.rotate(.012 + Math.sin(t * .9) * .004); ctx.translate(-(x0 + w / 2), -(y0 + h / 2));
        glowAt(ctx, x0 + w / 2, y0 + h / 2, w * .9, mode === "ninja" ? "#BFD8FF" : "#FFF3D6", .25);
        ctx.fillStyle = "rgba(20,12,6,.3)"; rr(ctx, x0 + 14, y0 + 18, w, h, 22); ctx.fill();
        rr(ctx, x0, y0, w, h, 22); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        rr(ctx, x0, y0, w, 64, [22, 22, 0, 0]); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ctx.stroke();
        ["#E0503A", "#E8B23A", "#3E9B5A"].forEach((cc, k) => { ctx.beginPath(); ctx.arc(x0 + 36 + k * 30, y0 + 32, 9, 0, TAU); ctx.fillStyle = cc; ctx.fill(); });
        font(ctx, 700, 26, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText(o.file || "Proposal Bagas", x0 + 140, y0 + 42);
        textC(ctx, o.heading || "PROPOSAL", x0 + w / 2, y0 + 130, 46, BROWN, 800, w - 60);
        const bar = (y, ww, col) => { ctx.fillStyle = col || "#D8CBB8"; rr(ctx, x0 + 50, y, ww, 14, 7); ctx.fill(); };
        [0, 1, 2].forEach(r => bar(y0 + 170 + r * 34, [w - 110, w - 160, w - 260][r]));
        // number line
        const blk = mode === "komentar" ? rq(t, tBl, .5) : 0;
        if (blk > 0){ ctx.fillStyle = "rgba(246,211,107,.75)"; rr(ctx, numX - 10, numY - 52, (w - 80) * blk, 72, 10); ctx.fill(); }
        font(ctx, 800, 44, FAM); ctx.fillStyle = BROWN; const lineTxt = (o.line || "Target naik") + " "; ctx.fillText(lineTxt, numX, numY); const lw2 = ctx.measureText(lineTxt).width, nx = numX + lw2;
        let shownNum = oldN, numCol = ORANGE;
        if (mode === "ninja"){ if (erQ > 0 && typeQ <= 0){ ctx.save(); ctx.globalAlpha *= 1 - erQ; font(ctx, 800, 44, FAM); ctx.fillStyle = ORANGE; ctx.fillText(oldN, nx, numY); ctx.restore(); shownNum = null; } else if (typeQ > 0){ shownNum = newN.slice(0, Math.ceil(newN.length * typeQ)); } }
        if (mode === "kaget"){ shownNum = newN; numCol = t >= tDf && Math.floor((t - tDf) * 4) % 2 === 0 ? RED : ORANGE; }
        if (mode === "komentar" && t >= tSg){ const acc = t >= tAc; if (!acc){ font(ctx, 800, 44, FAM); ctx.fillStyle = RED; ctx.fillText(oldN, nx, numY); const ow = ctx.measureText(oldN).width; ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(nx - 4, numY - 14); ctx.lineTo(nx + ow * rq(t, tSg, .3) + 4, numY - 14); ctx.stroke();
            ctx.fillStyle = GREEN; const q = popQ(t, tSg + .2, .35); ctx.save(); ctx.translate(nx + ow + 16, numY); ctx.scale(q, q); ctx.fillText(newN, 0, 0); const nw = ctx.measureText(newN).width; ctx.fillRect(0, 8, nw, 5); ctx.restore(); shownNum = null; }
          else { shownNum = newN; numCol = GREEN; } }
        if (shownNum != null){ font(ctx, 800, 44, FAM); ctx.fillStyle = numCol; ctx.fillText(shownNum, nx, numY); }
        if (mode === "ninja" && t >= tWrong && erQ <= 0){ const q = rq(t, tWrong, .4); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); font(ctx, 800, 44, FAM); const ow = ctx.measureText(oldN).width; for (let k = 0; k <= 20 * q; k++){ const x = nx + k / 20 * ow, y = numY + 12 + Math.sin(k * 1.6) * 4; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
        if (mode === "kaget" && t >= tDf){ const q = rq(t, tDf, .4); font(ctx, 800, 44, FAM); const ow = ctx.measureText(newN).width; ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(nx + ow / 2, numY - 14, ow / 2 + 26, 44, -.05, 0, TAU * q); ctx.stroke();
          chip(ctx, oldN + "?", nx + ow + 90, numY - 70, t - tDf - .2, { size: 34, fill: "#FFE5DF", ink: RED, t }); }
        // paragraph 2 (removed by the silent edit)
        const pY = y0 + 410; [0, 1, 2].forEach(r => { const ww = [w - 120, w - 150, w - 300][r]; if (paraGone < 1){ ctx.save(); ctx.beginPath(); ctx.rect(x0 + 40, pY - 10 + r * 34, (1 - clamp(paraGone * 3 - r * .9, 0, 1)) * (ww + 20), 30); ctx.clip(); bar(pY + r * 34, ww, "#C9B79F"); ctx.restore(); } });
        if (mode === "kaget" && t >= tGn){ const q = rq(t, tGn, .5); ctx.save(); ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = RED; ctx.lineWidth = 5; rr(ctx, x0 + 36, pY - 18, (w - 72) * q, 110, 12); ctx.stroke(); ctx.restore(); if (q >= 1) textC(ctx, "?", x0 + w / 2, pY + 62, 72, RED, 800); }
        [0, 1, 2, 3].forEach(r => bar(y0 + 560 + r * 34, [w - 110, w - 200, w - 140, w - 330][r]));
        if (mode === "kaget" && t >= tDf){ const tapes = [[-.32, .42, 0], [.26, .7, .35]]; tapes.forEach(([rot, fy, d], k) => { const q = eOut(rq(t, tDf + .5 + d, .45)); if (q <= 0) return; ctx.save(); ctx.translate(x0 + w / 2, y0 + h * fy); ctx.rotate(rot + Math.sin(t * 2 + k) * .01); const L = (w + 260) * q;
          ctx.fillStyle = "rgba(20,12,6,.3)"; ctx.fillRect(-(w + 260) / 2 + 8, -26 + 10, L, 56); ctx.fillStyle = "#F6D33B"; ctx.fillRect(-(w + 260) / 2, -28, L, 56); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-(w + 260) / 2, -28, L, 56);
          ctx.save(); ctx.beginPath(); ctx.rect(-(w + 260) / 2, -28, L, 56); ctx.clip(); font(ctx, 900, 30, FAM); ctx.fillStyle = OUT; const txt = (o.tapeText || "DIUBAH TANPA KABAR") + "  •  "; const tw2 = ctx.measureText(txt).width; for (let xx = -(w + 260) / 2 + 10; xx < (w + 260) / 2; xx += tw2) ctx.fillText(txt, xx, 11); ctx.restore(); ctx.restore(); }); }
        // eraser crumbs + ghost ninja
        if (mode === "ninja" && erQ > 0 && erQ < 1){ const ex = nx + 40 + Math.sin(t * 30) * 30; ctx.save(); ctx.translate(ex, numY - 50); ctx.rotate(-.3); rr(ctx, -36, -22, 72, 44, 10); ctx.fillStyle = "#F4A3B0"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = "#5B7DB1"; rr(ctx, -36, -22, 30, 44, [10, 0, 0, 10]); ctx.fill(); ctx.restore();
          for (let k = 0; k < 8; k++){ const u = ((t * 2 + k / 8) % 1); ctx.fillStyle = "#E9B7BE"; ctx.beginPath(); ctx.arc(nx + 20 + rnd(k) * 80, numY - 10 + u * 120, 5, 0, TAU); ctx.fill(); } }
        if (mode === "ninja" && t >= tEr && t < tEr + 1){ const u = t - tEr; for (let k = 0; k < 10; k++){ ctx.fillStyle = hexA("#C9B79F", 1 - u); ctx.beginPath(); ctx.arc(x0 + 60 + rnd(k + 4) * (w - 120) + u * 60, pY + 30 + rnd(k) * 60 + u * u * 300, 6, 0, TAU); ctx.fill(); } }
        if (mode === "kaget" && t >= tWho){ const q = popQ(t, tWho, .4), k = t - tWho, fade = clamp(1.6 - k, 0, 1); ctx.save(); ctx.globalAlpha *= fade; ctx.translate(x0 + w - 110, y0 + h - 120); ctx.scale(q, q);
          ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(0, -60, 44, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 30, 48, 70, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(-14, -62, 9, 6, 0, 0, TAU); ctx.ellipse(14, -62, 9, 6, 0, 0, TAU); ctx.fill(); ctx.restore();
          if (k > 1.1){ dust(ctx, x0 + w - 110, y0 + h - 100, k - 1.1, 9, "#9A8C7C", 140); } chip(ctx, "???", x0 + w - 110, y0 + h - 270, k - .2, { size: 40, fill: "#FFE5DF", ink: RED, t }); }
        // komentar: comment card + suggestion + accept button
        if (mode === "komentar" && t >= tCm){ const q = popQ(t, tCm, .45), done = t >= tAc + .9, cq = done ? 1 - eIn(rq(t, tAc + .9, .35)) : 1, CX = x0 + w - 20, CY = numY + 110;
          if (cq > 0){ ctx.save(); ctx.translate(CX, CY); ctx.scale(q * cq, q * cq); ctx.rotate(.02);
            ctx.strokeStyle = "#E8B23A"; ctx.lineWidth = 5; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(-160, -60); ctx.lineTo(-250, -84); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = "rgba(20,12,6,.3)"; rr(ctx, -150, -54, 330, 230, 18); ctx.fill(); rr(ctx, -160, -66, 330, 230, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#E8B23A"; ctx.lineWidth = 6; ctx.stroke();
            avatar(ctx, -116, -22, 28, "#2F6F73", (o.author || "Tari")[0]); font(ctx, 800, 28, FAM); ctx.fillStyle = BROWN; ctx.fillText(o.author || "Tari", -78, -12);
            const L = String(o.commentText || "Usul: 12%?\nSesuai data Q3").split("\n"); L.forEach((l, k) => { const sz = fitFont(ctx, l, 290, 28, k ? 600 : 800); ctx.fillStyle = k ? "#6A5444" : BROWN; ctx.fillText(l, -140, 36 + k * 38); });
            ctx.save(); ctx.translate(150, -66); ctx.rotate(.4); const pd = 1 - eOut(clamp((t - tCm - .25) / .25, 0, 1)); ctx.translate(0, -pd * 60); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -26, 24, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); rr(ctx, -12, -10, 24, 26, 4); ctx.fill(); ctx.stroke(); ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 16); ctx.lineTo(0, 40); ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.beginPath(); ctx.arc(-8, -32, 7, 0, TAU); ctx.fill(); ctx.restore();
            if (t >= tCh){ const bq = popQ(t, tCh, .35), press = t >= tAc && t < tAc + .3 ? 1 - .12 * Math.sin((t - tAc) / .3 * Math.PI) : 1; ctx.save(); ctx.translate(-60, 128); ctx.scale(bq * press, bq * press); rr(ctx, -80, -28, 160, 56, 28); ctx.fillStyle = GREEN; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, "TERIMA", 0, 10, 26, "#FFFFFF", 800, 140); ctx.restore();
              ctx.save(); ctx.translate(90, 128); ctx.scale(bq, bq); rr(ctx, -70, -28, 140, 56, 28); ctx.fillStyle = "#EFE6DA"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, "TOLAK", 0, 10, 26, BROWN, 800, 120); ctx.restore(); }
            ctx.restore(); }
          if (t >= tAc && t < tAc + .9) burstFx(ctx, nx + 40, numY - 14, t - tAc, GREEN, 12, 170); }
        // live cursor with author's name (komentar / ninja)
        if (mode === "ninja" && t >= tSn){ const cxp = nx + 120, cyp = numY - 44; ctx.fillStyle = "#2F6F73"; ctx.fillRect(cxp, cyp, 5, 64); rr(ctx, cxp, cyp - 34, 86, 34, 8); ctx.fill(); font(ctx, 700, 22, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText(o.author || "Tari", cxp + 10, cyp - 10); }
        ctx.restore();
      },
      over1: (ctx, c, sts, j, R2) => { if (mode !== "ninja" || j !== (o.ninjaOn ?? 0) || !R2[j] || t < tSn) return; const q = rq(t, tSn, .25); ctx.save(); ctx.globalAlpha *= q; ninjaMask(ctx, R2[j], t); ctx.restore();
        if (t - tSn < .5) dust(ctx, R2[j].headX, R2[j].headY, t - tSn, 8, "#CFC6BA", 160); } });
  }, (s, f, i, add) => { const o = f.dok || {}; const C = (k, fr) => o[k] ? cueT(s, o[k], fr ?? .3, i) : null;
    const add1 = (k, nm, fr, d) => { const x = C(k, fr); if (x != null) add(x + (d || 0), nm); };
    add1("wrongCue", "ping", .4); add1("sneakCue", "whoosh"); add1("sneakCue", "pop", .3, .55); add1("sneakCue", "pop", .3, 1.3); add1("eraseCue", "whoosh", .5);
    add1("openCue", "pop"); add1("diffCue", "ping"); add1("goneCue", "pop"); add1("whoCue", "whoosh");
    add1("blokCue", "whoosh"); add1("commentCue", "pop"); add1("suggestCue", "pop"); add1("choiceCue", "pop"); add1("acceptCue", "chime"); add1("acceptCue", "pop", .3, .9); });
})();
