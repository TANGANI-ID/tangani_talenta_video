/* Scene pack ceritag: story scenes for MODE CERITA ("motion": {"mode": "cerita"}). Layout prefix cg_.
   Every cg_ scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], props[], cards[], stamp, front)
   plus its own set piece:
     cg_tempel   sticky notes (tips) fly in and slap onto a toon, then peel off and flutter down (f.notes, f.dropCue)
     cg_belah    split screen: two panels, each with its own world, toon, clock badge and mood fx (quiet / music) (f.left, f.right, f.splitCue)
     cg_super    power-up: two power badges fly into a toon -> headphones, cape, golden aura; pages shoot into a stack + SELESAI stamp (f.power)
     cg_panas    anger: a toon swells and turns red, heat haze + steam, a spiky word-ball trembles at its mouth (f.angry)
     cg_kata     comic flashback: spoken words fly off as winged cards, the toon chases them with a net; tumbleweed of awkward silence (f.words)
     cg_jeda     time freeze: world goes grey and still around one toon, breathing ring + count, colour and size return (f.freeze)
     cg_desktop  inside the laptop: a tiny toon on the taskbar while icons rain until the wallpaper vanishes, or get tidied into folders (f.desk)
     cg_longsor  a giant download folder bursts: look-alike files avalanche onto the toon, screenshots whirl in a tornado (f.folder)
     cg_replay   instant replay of a past event: REPLAY badge, scanlines, timecode, telestrator circles/arrows, rewind (f.replay)
     cg_bisik    a tiny inner self floats beside the toon and asks questions; an answer card lights up (f.mini)
     cg_portal   a lesson orb + swirling portal "next month"; the toon steps through into a happy future scene (f.portal)
     cg_warna    the world drains to grey (snail-slow savings bar) or colour floods back from a phone with a count-up number (f.mood)
     cg_finis    beach path with month flags behind and a finish arch ahead; coins pop from footprints as the toon jogs (f.finish)
   Camera keys may use on:"<spot>" for named spots of the set piece. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, G, TAU, star } = TT;
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const eIn = x => x * x * x;
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
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .94); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function textC(ctx, txt, x, y, size, col, weight){ font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  // screen-space desaturation (before the colour grade); hole = [x, y, r] keeps a circle in colour
  function desat(ctx, amt, hole, tint){
    if (amt <= 0.01) return; ctx.save(); ctx.globalAlpha = clamp(amt, 0, 1);
    if (hole && hole[2] > 0){ ctx.beginPath(); ctx.rect(-50, -50, 1180, 2020); ctx.moveTo(hole[0] + hole[2], hole[1]); ctx.arc(hole[0], hole[1], hole[2], 0, TAU, true); ctx.clip("evenodd"); }
    ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = "#808080"; ctx.fillRect(-50, -50, 1180, 2020);
    if (tint){ ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = tint; ctx.fillRect(-50, -50, 1180, 2020); }
    ctx.restore();
    if (hole && hole[2] > 0 && hole[2] < 1500){ ctx.save(); ctx.globalAlpha = clamp(amt, 0, 1) * .8; ctx.strokeStyle = hexA(GOLD, .8); ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(hole[0], hole[1], hole[2], 0, TAU); ctx.stroke(); ctx.restore(); }
  }
  // toon-local point (units of size/92, y up from the feet) -> world
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const headOf = st => { const h = toonHead(st); return [h[0], h[1], st.size * 20.5 / 92]; };
  function headphones(ctx, st, q, col){ if (q <= 0) return; const [hx, hy, r] = headOf(st), s = eBack(clamp(q, 0, 1)), drop = (1 - eOut(clamp(q, 0, 1))) * -r * 1.6;
    ctx.save(); ctx.translate(hx, hy + drop); ctx.scale(s, s); ctx.lineCap = "round";
    ctx.strokeStyle = OUT; ctx.lineWidth = r * .26; ctx.beginPath(); ctx.arc(0, -r * .05, r * 1.1, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    ctx.strokeStyle = col || ORANGE; ctx.lineWidth = r * .15; ctx.stroke();
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * r * 1.02, r * .12, r * .26, r * .4, 0, 0, TAU); ctx.fillStyle = col || ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = r * .07; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(d * r * 1.06, r * .12, r * .12, r * .24, 0, 0, TAU); ctx.fillStyle = BROWN; ctx.fill(); });
    ctx.restore(); }
  function noteShape(ctx, w, h, col){ ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2, h / 2 - 22); ctx.lineTo(w / 2 - 22, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w / 2, h / 2 - 22); ctx.lineTo(w / 2 - 22, h / 2 - 22); ctx.lineTo(w / 2 - 22, h / 2); ctx.closePath(); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fill(); ctx.stroke(); }
  function lines2(ctx, txt, maxW, size, weight){ const ws = String(txt).split(" "); let L = [txt];
    font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width > maxW && ws.length > 1){ let best = null; for (let i = 1; i < ws.length; i++){ const a = ws.slice(0, i).join(" "), b = ws.slice(i).join(" "), m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width); if (!best || m < best[0]) best = [m, [a, b]]; } L = best[1]; }
    while (Math.max(...L.map(l => ctx.measureText(l).width)) > maxW && size > 14){ size -= 2; font(ctx, weight || 800, size, FAM); }
    return { L, size }; }

  /* ---------- shared base: same data as the generic "cerita" layout + hooks ---------- */
  // H: {env, envOpt, spots:{name:[x,y,zoom]}, prep(a, j, st) -> {a, t} (per-frame actor override), back/mid/front(ctx, c, sts, R), midZ, post(ctx, c, sts, R) (screen, before grade), over (screen, after grade)}
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
    if (H.envDraw) H.envDraw(ctx, c, E, eo); else env(ctx, E, t, c, eo);
    const R = {};
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => { if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R)); R[j] = toon(ctx, c, P[j].a, s, P[j].t, { st: sts[j] }); if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
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
  const NOTE_COL = ["#F6D36B", "#F4A85C", "#F7B7A3", "#BFE3B4", "#FFF4E6", "#9FD3E8"];

  /* ================= cg_tempel: sticky notes slap onto a toon ================= */
  // f.notes: [{text, cue|at, slot:[lx, ly] (toon-local) | world:[x, y], rot}], f.dropCue (notes peel off and fall), f.hero (toon index, default 0)
  TT.scene("cg_tempel", "Cerita: tempelan tips", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, hj = f.hero ?? 0, tD = T(s, f.dropCue, .4, idx);
    const SL = [[-12, -97, -.2], [13, -95, .18], [-23, -52, -.3], [23, -50, .26], [0, -34, .06], [-6, -16, -.12], [9, -16, .14]];
    const notes = (f.notes || []).map((n, j) => Object.assign({ T: tOf(s, n, .2 + j * .1, idx), j }, n));
    const pose = (n, st) => { const sl = n.slot || SL[n.j % SL.length]; if (n.world) return [n.world[0], n.world[1], n.rot ?? sl[2] ?? 0]; const p = lp(st, sl[0], sl[1]); return [p[0], p[1], n.rot ?? sl[2] ?? 0]; };
    base(ctx, s, t, { env: "office",
      spots: { hero: () => { const st = toonState((f.toons || [])[hj] || {}, s, t), h = toonHead(st); return [h[0], h[1] + 120, 1.2]; } },
      front: (ctx2, c, sts) => {
        const st = sts[hj]; if (!st) return;
        notes.forEach(n => { const k = t - n.T; if (k < 0) return; const [tx, ty, tr] = pose(n, st), fly = .45;
          let x, y, rot, sc = 1, a = 1;
          if (k < fly){ const q = k / fly, e = eIn(q) * .5 + q * .5, side = n.j % 2 ? 1 : -1, sx = tx + side * 900, sy = ty - 700 - (n.j % 3) * 150;
            x = lerp(sx, tx, e); y = lerp(sy, ty, e) - Math.sin(q * Math.PI) * 220; rot = tr + (1 - q) * side * 6; sc = .7 + .3 * q; }
          let sqv = 0;
          if (k >= fly){ const kq = k - fly; sqv = kq < .3 ? Math.sin(kq / .3 * Math.PI) * .18 * (1 - kq / .3) : 0; x = tx; y = ty; rot = tr + Math.sin(t * 3 + n.j) * .03; sc = 1; }
          if (t > tD){ const d = t - tD - n.j * .12; if (d > 0){ const g = d; x = tx + Math.sin(g * 4 + n.j) * 60 * Math.min(1, g) + (n.j % 2 ? 1 : -1) * g * 90; y = Math.min(GROUND - 30, ty + 380 * g * g + 60 * g); rot = tr + Math.sin(g * 5 + n.j) * .6; a = 1; } }
          const w = 210, h = 170;
          ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc * (1 + sqv), sc * (1 - sqv));
          ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.fillRect(-w / 2 + 10, -h / 2 + 14, w, h);
          noteShape(ctx, w, h, n.col || NOTE_COL[n.j % NOTE_COL.length]);
          ctx.fillStyle = hexA(ORANGE, .55); ctx.fillRect(-36, -h / 2 - 12, 72, 26);
          const { L, size } = lines2(ctx, String(n.text || "").toUpperCase(), w - 34, 34, 800); ctx.fillStyle = BROWN; ctx.textAlign = "center";
          L.forEach((l, i) => ctx.fillText(l, 0, (i - (L.length - 1) / 2) * size * 1.08 + size * .36)); ctx.textAlign = "left"; ctx.restore();
          if (k >= fly && k < fly + .5 && t < tD) burstFx(ctx, tx, ty, k - fly, HL, 8, 130);
        });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.notes || []).forEach((n, j) => { const t0 = tOf(s, n, .2 + j * .1, i); add(t0, "whoosh"); add(t0 + .45, "pop"); }); if (f.dropCue) add(cueT(s, f.dropCue, .4, i), "whoosh"); });

  /* ================= cg_belah: split screen ================= */
  // f.left / f.right: {env, envOpt, toon:{actor}, cam:{x, y, zoom}, name, time:"09.00", hour (0-24), icon, fx:"quiet"|"music", desk:{x, s, laptop}, inCue}
  // f.splitCue: right panel slides in; before that the left panel fills the screen
  TT.scene("cg_belah", "Cerita: layar terbelah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, tS = T(s, f.splitCue, .3, idx), sq = eOut(clamp((t - tS) / .55, 0, 1)), D = lerp(1180, 540, sq);
    const panel = (Pn, x0, x1, side) => {
      if (!Pn || x1 - x0 < 4) return; const cx = (x0 + x1) / 2, sl = 46;
      ctx.save(); ctx.beginPath();
      if (side < 0){ ctx.moveTo(-10, -10); ctx.lineTo(x1 + sl, -10); ctx.lineTo(x1 - sl, 1930); ctx.lineTo(-10, 1930); }
      else { ctx.moveTo(x0 + sl, -10); ctx.lineTo(1090, -10); ctx.lineTo(1090, 1930); ctx.lineTo(x0 - sl, 1930); }
      ctx.closePath(); ctx.clip(); ctx.translate(cx - 540, 0);
      const keys = Pn.camKeys || [{ at: 0, x: (Pn.cam || {}).x ?? 540, y: (Pn.cam || {}).y ?? 1000, zoom: (Pn.cam || {}).zoom ?? 1.1 }];
      const c = cam(s, t, keys, { push: .01 });
      env(ctx, Pn.env || "office", t, c, Pn.envOpt || {});
      const a = Object.assign({ x: 540, size: 640 }, Pn.toon || {}), st = toonState(a, s, t);
      layer(ctx, c, 1, () => {
        if (Pn.desk) prop(ctx, "desk", Pn.desk.x ?? 760, GROUND, { laptop: Pn.desk.laptop !== false, back: Pn.desk.back, mug: true, s: Pn.desk.s ?? .9 }, t);
        if (Pn.fx === "quiet"){ const h = toonHead(st); for (let r = 0; r < 3; r++){ const w = ((t * .35 + r / 3) % 1); ctx.strokeStyle = hexA("#9FD3E8", .5 * (1 - w)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(h[0], h[1], 200 + w * 260, 0, TAU); ctx.stroke(); }
          for (let i = 0; i < 14; i++){ const q = (t * .12 + rnd(i)) % 1, x = 220 + rnd(i + 3) * 640 + Math.sin(t + i) * 20, y = 1500 - q * 1000; ctx.globalAlpha = Math.sin(q * Math.PI) * .8; sparkle(ctx, x, y, 10 + rnd(i) * 8, "#E7F4FA"); } ctx.globalAlpha = 1; }
      });
      toon(ctx, c, a, s, t, { st });
      layer(ctx, c, 1, () => {
        if (Pn.phones) headphones(ctx, st, clamp((t - tOf(s, Pn.phones, .2, idx)) / .4, 0, 1), Pn.phones.col);
        if (Pn.fx === "music"){ const h = toonHead(st); for (let i = 0; i < 9; i++){ const q = (t * .45 + i / 9) % 1, side = i % 2 ? 1 : -1, x = h[0] + side * (190 + q * 120) + Math.sin(q * 8 + i) * 30, y = h[1] + 60 - q * 520;
            ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3 + i) * .3); ctx.fillStyle = i % 3 ? ORANGE : BROWN; ctx.strokeStyle = OUT; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.ellipse(-10, 18, 16, 12, -.4, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillRect(2, -34, 7, 52); if (i % 2){ ctx.beginPath(); ctx.moveTo(4, -34); ctx.quadraticCurveTo(30, -26, 26, -2); ctx.lineWidth = 7; ctx.strokeStyle = ctx.fillStyle; ctx.stroke(); } ctx.restore(); } }
      });
      envFront(ctx, Pn.env || "office", t, c, Pn.envOpt || {});
      ctx.restore();
      // badge (screen space, centred on the panel)
      const tB = tOf(s, Pn.badge || { at: .25 }, .2, idx), kb = t - tB; if (kb < 0) return;
      const bq = eBack(clamp(kb / .45, 0, 1)), bx = cx, by = 300;
      TT.CS.ov.push(() => { ctx.save(); ctx.translate(bx, by + Math.sin(t * 2 + side) * 5); ctx.scale(bq, bq); ctx.rotate(side * .03);
        const w = Math.min(470, x1 - x0 - 40); rr(ctx, -w / 2, -80, w, 160, 26); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        // clock face
        const cxk = -w / 2 + 82, hr = (Pn.hour ?? 9), ang = (hr % 12) / 12 * TAU, mq = clamp(kb / 1.2, 0, 1), spin = (1 - eOut(mq)) * TAU * 2;
        ctx.beginPath(); ctx.arc(cxk, 0, 56, 0, TAU); ctx.fillStyle = Pn.fx === "music" ? "#FCE3C4" : "#E3F1F6"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
        ctx.lineCap = "round"; ctx.strokeStyle = BROWN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cxk, 0); ctx.lineTo(cxk + Math.sin(ang - spin / 12) * 30, -Math.cos(ang - spin / 12) * 30); ctx.stroke();
        ctx.lineWidth = 5; ctx.strokeStyle = ORANGE; ctx.beginPath(); ctx.moveTo(cxk, 0); ctx.lineTo(cxk + Math.sin(-spin) * 44, -Math.cos(-spin) * 44); ctx.stroke();
        const tx = cxk + 74, tw = w / 2 - tx - 20;
        fit(ctx, Pn.name || "", tw, 46, 900); ctx.fillStyle = BROWN; ctx.fillText(Pn.name || "", tx, -10);
        fit(ctx, Pn.time || "", tw, 40, 800); ctx.fillStyle = ORANGE; ctx.fillText(Pn.time || "", tx, 44);
        ctx.restore();
        if (kb < .9) burstFx(ctx, bx, by, kb - .1, HL, 8, 170); });
    };
    panel(f.left, 0, D, -1);
    if (sq > 0) panel(f.right, D, 1080, 1);
    if (sq > 0){ ctx.save(); ctx.strokeStyle = CREAM; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(D + 46, -10); ctx.lineTo(D - 46, 1930); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
    TT.CS.focus = [D / 2, 1000];
  }, (s, f, i, add) => { sfxBase(s, f, i, add); if (f.splitCue) add(cueT(s, f.splitCue, .3, i), "whoosh"); [f.left, f.right].forEach((Pn, j) => { if (Pn && Pn.badge) add(tOf(s, Pn.badge, .2, i), "pop"); }); });

  /* ================= cg_super: focus power-up ================= */
  // f.power: {items:[{cue, kind:"clock"|"music", label, sub}], powerCue (items fly in -> transform), workCue (pages fly), doneCue (stamp), stampText, desk:{x}}
  TT.scene("cg_super", "Cerita: mode fokus super", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Pw = Object.assign({ stampText: "SELESAI!" }, f.power || {}), hj = Pw.hero ?? 0;
    const tP = T(s, Pw.powerCue, .4, idx), tW = T(s, Pw.workCue, .3, idx), tDn = T(s, Pw.doneCue, .6, idx), on = clamp((t - tP - .55) / .5, 0, 1);
    const items = (Pw.items || []).map((it, j) => Object.assign({ T: tOf(s, it, .2 + j * .2, idx), j }, it));
    const deskX = (Pw.desk || {}).x ?? 860, stackX = deskX + 60, stackY = GROUND - 290 * .95;
    base(ctx, s, t, { env: "office",
      spots: { desk: [deskX - 60, 1150, 1.25] },
      back: (ctx2, c, sts) => { const st = sts[hj]; if (!st || on <= 0) return; const h = toonHead(st), k = st.size / 92;
        // golden rays behind the hero
        ctx.save(); ctx.globalAlpha = on * .55; ctx.translate(h[0], h[1] + 120); ctx.rotate(t * .25);
        for (let i = 0; i < 16; i++){ ctx.rotate(TAU / 16); ctx.fillStyle = i % 2 ? hexA(GOLD, .55) : hexA("#FFF0C8", .4); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-70, -1500); ctx.lineTo(70, -1500); ctx.closePath(); ctx.fill(); }
        ctx.restore(); glowAt(ctx, h[0], h[1] + 200, 620 * on, "#FFD77A", .55);
        // cape (behind the toon)
        const nx = st.x - (st.face || 1) * 2 * k, ny = st.y - 56 * k, L = 50 * k * on, wv = t * 7;
        ctx.save(); ctx.beginPath(); ctx.moveTo(nx - 13 * k, ny); ctx.lineTo(nx + 13 * k, ny);
        ctx.quadraticCurveTo(nx + 26 * k + Math.sin(wv) * 6 * k, ny + L * .55, nx + 22 * k - (st.face || 1) * 14 * k + Math.sin(wv + 1) * 10 * k, ny + L);
        for (let i = 0; i <= 4; i++){ const xx = lerp(nx + 22 * k, nx - 22 * k, i / 4) - (st.face || 1) * 14 * k + Math.sin(wv + i) * 8 * k; ctx.lineTo(xx, ny + L + Math.sin(wv * 1.3 + i * 1.7) * 4 * k + (i % 2 ? -5 * k : 0)); }
        ctx.quadraticCurveTo(nx - 26 * k + Math.sin(wv + 2) * 6 * k, ny + L * .55, nx - 13 * k, ny); ctx.closePath();
        ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
        // aura flames
        for (let i = 0; i < 18; i++){ const a = i / 18 * TAU, rr0 = 52 * k, fl = (Math.sin(t * 9 + i * 2.1) * .5 + .5);
          const bx = st.x + Math.cos(a) * rr0 * .62, by = st.y - 46 * k + Math.sin(a) * rr0; ctx.save(); ctx.globalAlpha = on * (.35 + fl * .35); ctx.fillStyle = i % 2 ? GOLD : HL;
          ctx.beginPath(); ctx.ellipse(bx, by - fl * 30, 26 + fl * 16, 50 + fl * 40, a + Math.PI / 2, 0, TAU); ctx.fill(); ctx.restore(); }
        // speed lines
        ctx.save(); ctx.globalAlpha = on * .5; ctx.strokeStyle = "#FFF4E6"; ctx.lineCap = "round";
        for (let i = 0; i < 18; i++){ const a = rnd(i) * TAU, q = (t * 1.6 + rnd(i + 7)) % 1, r0 = 520 + q * 700; ctx.lineWidth = 6 + rnd(i + 2) * 6;
          ctx.beginPath(); ctx.moveTo(h[0] + Math.cos(a) * r0, h[1] + 200 + Math.sin(a) * r0); ctx.lineTo(h[0] + Math.cos(a) * (r0 + 160), h[1] + 200 + Math.sin(a) * (r0 + 160)); ctx.stroke(); }
        ctx.restore();
      },
      mid: (ctx2, c, sts) => { // desk + flying pages + stack
        prop(ctx, "desk", deskX, GROUND, { laptop: true, mug: true, s: .95, lx: -60 }, t);
        if (t > tW){ const n = Math.min(14, Math.floor((t - tW) * 6)), top = Math.min(n, 9);
          for (let i = 0; i < top; i++){ ctx.save(); ctx.translate(stackX + Math.sin(i * 2.1) * 6, stackY - 8 - i * 11); ctx.rotate(Math.sin(i * 1.3) * .05); ctx.fillStyle = PAPER; rr(ctx, -80, -10, 160, 18, 3); ctx.fill(); ol(ctx, 4); ctx.restore(); }
          for (let i = 0; i < 6; i++){ const q = ((t - tW) * 1.8 + i / 6) % 1; if (t > tDn + .4) break; const x = lerp(deskX - 120, stackX, q), y = stackY - 160 - Math.sin(q * Math.PI) * 260;
            ctx.save(); ctx.translate(x, y); ctx.rotate(q * 6 + i); ctx.fillStyle = PAPER; rr(ctx, -50, -64, 100, 128, 6); ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA(BROWN, .35); for (let l = 0; l < 4; l++) ctx.fillRect(-34, -40 + l * 22, 68 - (l % 2) * 20, 7); ctx.restore(); } }
      },
      over1: (ctx2, c, sts, j) => { if (j !== hj) return; const st = sts[hj]; const mu = items.find(it => it.kind === "music"); if (mu && t > tP + .35) headphones(ctx, st, clamp((t - tP - .35) / .35, 0, 1), ORANGE); },
      front: (ctx2, c, sts) => {
        const st = sts[hj]; if (!st) return; const h = toonHead(st);
        items.forEach(it => { const k = t - it.T; if (k < 0) return; const side = it.j % 2 ? 1 : -1, hx = side > 0 ? 860 : 220, hy = 600 + Math.sin(t * 2 + it.j) * 14;
          let x = hx, y = hy, sc = eBack(clamp(k / .45, 0, 1)), a = 1;
          if (t > tP){ const q = clamp((t - tP - it.j * .12) / .5, 0, 1), e = eIn(q); const tx = it.kind === "music" ? h[0] : st.x, ty = it.kind === "music" ? h[1] - 80 : st.y - st.size * .5;
            x = lerp(hx, tx, e); y = lerp(hy, ty, e) - Math.sin(q * Math.PI) * 200; sc *= 1 - .7 * e; a = q >= 1 ? 0 : 1; }
          if (a <= 0) return;
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2.4 + it.j) * .08); ctx.scale(sc, sc);
          glowAt(ctx, 0, 0, 170, GOLD, .45); ctx.beginPath(); ctx.arc(0, 0, 104, 0, TAU); ctx.fillStyle = it.kind === "clock" ? GOLD : CREAM; ctx.fill(); ol(ctx, 7);
          if (it.kind === "clock"){ ctx.beginPath(); ctx.arc(0, 0, 76, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); ctx.lineCap = "round"; ctx.strokeStyle = BROWN; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * .6) * 30, -Math.cos(t * .6) * 30); ctx.stroke(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * 5) * 56, -Math.cos(t * 5) * 56); ctx.stroke();
            for (let r = 0; r < 12; r++){ const an = r / 12 * TAU; ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(Math.cos(an + t) * 116, Math.sin(an + t) * 116); ctx.lineTo(Math.cos(an + t) * 140, Math.sin(an + t) * 140); ctx.stroke(); } }
          else { ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, 10, 62, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 9; ctx.stroke();
            [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 60, 20, 22, 34, 0, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); });
            ctx.fillStyle = BROWN; ctx.beginPath(); ctx.ellipse(-6, 50, 12, 9, -.4, 0, TAU); ctx.fill(); ctx.fillRect(4, 8, 6, 42); }
          if (it.label){ const k2 = clamp((k - .2) / .3, 0, 1); ctx.globalAlpha *= k2; fit(ctx, it.label.toUpperCase(), 300, 40, 900); const w = ctx.measureText(it.label.toUpperCase()).width + 44;
            rr(ctx, -w / 2, 124, w, 62, 31); ctx.fillStyle = it.kind === "clock" ? ORANGE : BROWN; ctx.fill(); ol(ctx, 5); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(it.label.toUpperCase(), 0, 168); ctx.textAlign = "left"; }
          ctx.restore();
          if (k < .9) burstFx(ctx, hx, hy, k - .15, HL, 8, 170); });
        // transformation flash
        const fq = t - tP - .55; if (fq > 0 && fq < .9) burstFx(ctx, st.x, st.y - st.size * .5, fq, GOLD, 16, 380);
        if (t > tDn) stampBox(ctx, Pw.stampText, stackX - 40, stackY - 250, t - tDn, GREEN, 70, -.1);
        if (t > tDn && t - tDn < 1) burstFx(ctx, stackX - 40, stackY - 250, t - tDn - .15, GREEN, 14, 260);
      },
      post: () => { const fq = t - tP - .55; if (fq > 0 && fq < .35){ ctx.globalAlpha = (1 - fq / .35) * .7; ctx.fillStyle = "#FFF4D6"; ctx.fillRect(0, 0, 1080, 1920); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Pw = f.power || {}; (Pw.items || []).forEach((it, j) => add(tOf(s, it, .2 + j * .2, i), "pop"));
    if (Pw.powerCue){ const tp = cueT(s, Pw.powerCue, .4, i); add(tp, "whoosh"); add(tp + .55, "chime"); }
    if (Pw.workCue) add(cueT(s, Pw.workCue, .3, i), "whoosh"); if (Pw.doneCue) add(cueT(s, Pw.doneCue, .6, i), "chime"); });

  /* ---------- meeting table (front layer, world) ---------- */
  function meetingTable(ctx, t, o){ o = o || {}; const y = o.y ?? 1470;
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(-600, y + 40, 2300, 30);
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-600, y + 30, 2300, 400); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-600, y + 30, 2300, 400);
    ctx.fillStyle = "#C47A48"; rr(ctx, -620, y - 14, 2340, 52, 14); ctx.fill(); ol(ctx, 6);
    (o.items || [[260, "paper"], [520, "mug"], [800, "paper"]]).forEach(([x, k], i) => { ctx.save(); ctx.translate(x, y - 12);
      if (k === "mug"){ ctx.fillStyle = CREAM; rr(ctx, -26, -60, 52, 60, 8); ctx.fill(); ol(ctx, 5); ctx.fillStyle = ORANGE; ctx.fillRect(-22, -42, 44, 10);
        for (let j = 0; j < 2; j++){ const q = ((t * .5 + j / 2) % 1); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-6 + j * 10, -66 - q * 50); ctx.quadraticCurveTo(-16 + j * 10, -86 - q * 50, -4 + j * 10, -106 - q * 50); ctx.stroke(); } }
      else { ctx.rotate(Math.sin(i * 2.3) * .08); ctx.fillStyle = PAPER; rr(ctx, -80, -12, 160, 16, 3); ctx.fill(); ol(ctx, 4); }
      ctx.restore(); }); }
  function spikyBall(ctx, x, y, r, t, txt){ ctx.save(); ctx.translate(x + Math.sin(t * 47) * r * .05, y + Math.cos(t * 39) * r * .05); ctx.rotate(Math.sin(t * 3) * .2);
    ctx.beginPath(); const n = 14; for (let i = 0; i <= n * 2; i++){ const a = i / (n * 2) * TAU, rr2 = i % 2 ? r * .72 : r * (1.05 + .08 * Math.sin(t * 9 + i)); ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
    ctx.closePath(); ctx.fillStyle = "#6B2335"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(4, r * .07); ctx.stroke();
    ctx.rotate(-Math.sin(t * 3) * .2); if (txt){ fit(ctx, txt, r * 1.2, r * .55, 900); ctx.fillStyle = "#FFD3C4"; ctx.textAlign = "center"; ctx.fillText(txt, 0, r * .2); ctx.textAlign = "left"; }
    ctx.restore(); }

  /* ================= cg_panas: anger swells ================= */
  // f.angry: {on (toon index), cue (start), grow=1.2, thornCue, thornText="#@!%", calmCue (shrink back)}; f.table: true|{items}
  TT.scene("cg_panas", "Cerita: emosi memanas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, A = Object.assign({ on: 1, grow: 1.2, thornText: "#@!%" }, f.angry || {}), tA = T(s, A.cue, .3, idx), tTh = T(s, A.thornCue, .3, idx), tCalm = T(s, A.calmCue, .3, idx);
    const heat = clamp((t - tA) / 1.2, 0, 1) * (1 - clamp((t - tCalm) / .8, 0, 1));
    base(ctx, s, t, { env: "office",
      prep: (a, j) => j === A.on ? { a: Object.assign({}, a, { size: (a.size || 760) * (1 + (A.grow - 1) * eBack(heat)), x: (a.x ?? 540) + Math.sin(t * 43) * 5 * heat }), t } : null,
      back: (ctx2, c, sts) => { const st = sts[A.on]; if (!st || heat <= 0) return; const h = toonHead(st);
        glowAt(ctx, h[0], h[1] + 150, 700 * heat, "#E8432A", .5 * heat);
        ctx.save(); ctx.globalAlpha = .55 * heat; ctx.strokeStyle = "#FFB08A"; ctx.lineWidth = 7; ctx.lineCap = "round";
        for (let i = 0; i < 9; i++){ const q = (t * .7 + i / 9) % 1, x = h[0] - 380 + i * 95; ctx.globalAlpha = .55 * heat * Math.sin(q * Math.PI); ctx.beginPath();
          for (let k = 0; k <= 8; k++){ const yy = h[1] + 420 - q * 700 - k * 22; ctx.lineTo(x + Math.sin(k * .9 + t * 6 + i) * 14, yy); } ctx.stroke(); } ctx.restore(); },
      over1: (ctx2, c, sts, j, R) => { if (j !== A.on || heat <= 0) return; const st = sts[j], r = R[j]; if (!r) return;
        for (let i = 0; i < 8; i++){ const q = (t * 1.3 + i / 8) % 1, side = i % 2 ? 1 : -1, x = r.headX + side * (r.r * 1.05 + q * 90), y = r.headY - r.r * .2 - q * 260;
          ctx.save(); ctx.globalAlpha = heat * Math.sin(q * Math.PI) * .85; ctx.fillStyle = "#F3EDE6"; ctx.beginPath(); ctx.arc(x, y, 26 + q * 40, 0, TAU); ctx.fill(); ctx.restore(); }
        if (t > tTh && t < tCalm + .5){ const q = eBack(clamp((t - tTh) / .5, 0, 1)) * (1 - clamp((t - tCalm) / .5, 0, 1)); spikyBall(ctx, r.headX + r.face * r.r * 1.25, r.mouthY + r.r * .05, r.r * .62 * q, t, A.thornText); } },
      front: () => { if (f.table !== false) meetingTable(ctx, t, f.table || {}); },
      post: () => { if (heat > 0){ ctx.globalAlpha = heat * .18; ctx.fillStyle = "#E8432A"; ctx.fillRect(0, 0, 1080, 1920); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.angry || {}; if (A.cue) add(cueT(s, A.cue, .3, i), "whoosh"); if (A.thornCue) add(cueT(s, A.thornCue, .3, i), "pop"); });

  /* ================= cg_kata: words fly away ================= */
  // f.words: [{text, cue}] (launched from toon f.hero), f.flyCue (they fly off), f.chase: {cue} (net appears), f.awkCue (tumbleweed + cold tint), f.tag ("BULAN LALU")
  let HALF = null;
  function halftone(ctx){ if (!HALF){ const cv = document.createElement("canvas"); cv.width = cv.height = 22; const x = cv.getContext("2d"); x.fillStyle = "rgba(43,26,18,.5)"; x.beginPath(); x.arc(5, 5, 3.2, 0, TAU); x.fill(); x.beginPath(); x.arc(16, 16, 3.2, 0, TAU); x.fill(); HALF = cv; } return ctx.createPattern(HALF, "repeat"); }
  TT.scene("cg_kata", "Cerita: kata-kata terbang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, hj = f.hero ?? 0, tF = T(s, f.flyCue, .4, idx), tCh = T(s, f.chaseCue, .3, idx), tAw = T(s, f.awkCue, .3, idx);
    const W = (f.words || []).map((w, j) => Object.assign({ T: tOf(s, w, .2 + j * .1, idx), j }, w));
    const hero = (f.toons || [])[hj] || {};
    const birdPos = (w) => { const st0 = toonState(hero, s, w.T), h0 = toonHead(st0), k = t - w.T, q = eOut(clamp(k / .6, 0, 1)), n = W.length;
      const hx = n > 1 ? 230 + w.j * (620 / (n - 1)) : 540, hy = 520 + (w.j % 2) * 190;
      let x = lerp(h0[0] + (st0.face || 1) * 160, hx, q) + Math.sin(t * 2.2 + w.j * 2) * 26, y = lerp(h0[1] + 40, hy, q) + Math.sin(t * 3.1 + w.j) * 22;
      const d = t - tF - w.j * .18; if (d > 0){ x += 260 * d + 120 * d * d + w.j * 30 * d; y -= 300 * d + 260 * d * d; }
      return [x, y, q]; };
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      over1: (ctx2, c, sts, j, R) => { if (j !== hj || t < tCh) return; const st = sts[j], hand = lp(st, 25, -71), sw = Math.sin((t - tCh) * 7) * .5, q = eBack(clamp((t - tCh) / .3, 0, 1));
        ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(-.5 * (st.face || 1) + sw); ctx.scale(q, q); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(0, -330); ctx.stroke(); ctx.strokeStyle = "#B07A4A"; ctx.lineWidth = 9; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, -420, 95, 90, 0, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 6; ctx.stroke();
        ctx.save(); ctx.beginPath(); ctx.ellipse(0, -420, 90, 85, 0, 0, TAU); ctx.clip(); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 2.5; for (let g = -100; g <= 100; g += 22){ ctx.beginPath(); ctx.moveTo(g, -520); ctx.lineTo(g + 40, -320); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-100, -420 + g); ctx.lineTo(100, -440 + g); ctx.stroke(); } ctx.restore();
        ctx.restore(); },
      front: () => {
        W.forEach(w => { if (t < w.T) return; const [x, y, q] = birdPos(w); if (y < -600) return; const fl = Math.sin(t * 16 + w.j * 2), sc = .4 + .6 * eBack(q);
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2 + w.j) * .12 - (t > tF ? .15 : 0)); ctx.scale(sc, sc);
          [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * 70, -30); ctx.rotate(d * (-.5 + fl * .6)); ctx.beginPath(); ctx.ellipse(d * 70, -10, 90, 34, d * -.3, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
            ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 4; for (let f2 = 0; f2 < 3; f2++){ ctx.beginPath(); ctx.moveTo(d * (40 + f2 * 30), -10); ctx.lineTo(d * (60 + f2 * 30), 14); ctx.stroke(); } ctx.restore(); });
          const txt = String(w.text || "").toUpperCase(); font(ctx, 900, 56, FAM); const tw = Math.max(170, ctx.measureText(txt).width + 60);
          rr(ctx, -tw / 2, -50, tw, 100, 22); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 7); ctx.fillStyle = "#B02A2A"; ctx.textAlign = "center"; ctx.fillText(txt, 0, 20); ctx.textAlign = "left";
          ctx.beginPath(); ctx.moveTo(tw / 2 - 6, -12); ctx.lineTo(tw / 2 + 34, 0); ctx.lineTo(tw / 2 - 6, 12); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
          ctx.restore();
          if (t - w.T < .7) burstFx(ctx, x, y, t - w.T - .1, RED, 8, 150); });
        if (t > tAw){ const k = t - tAw, x = 1300 - k * 520, b = Math.abs(Math.sin(k * 4)) * 70, r = 80; if (x > -300){ ctx.save(); ctx.translate(x, GROUND - r - b); ctx.rotate(-k * 6);
          ctx.strokeStyle = "#8E6A3E"; ctx.lineWidth = 7; for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.ellipse(0, 0, r * (.6 + rnd(i) * .4), r * (.35 + rnd(i + 3) * .5), i * .7, 0, TAU); ctx.stroke(); }
          ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.restore();
          ctx.save(); ctx.globalAlpha = .5; ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(x + r + 30 + i * 30, GROUND - r - b + (i - 1) * 40); ctx.lineTo(x + r + 120 + i * 40, GROUND - r - b + (i - 1) * 40); ctx.stroke(); } ctx.restore(); } }
      },
      post: () => { ctx.globalAlpha = .1; ctx.fillStyle = halftone(ctx); ctx.fillRect(0, 0, 1080, 1920); ctx.globalAlpha = 1;
        if (t > tAw){ const q = clamp((t - tAw) / .8, 0, 1); ctx.globalAlpha = q * .35; ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = "#4A6FA5"; ctx.fillRect(0, 0, 1080, 1920); ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1; } },
      over: () => { // comic frame + caption
        ctx.save(); ctx.strokeStyle = CREAM; ctx.lineWidth = 26; rr(ctx, 13, 13, 1054, 1894, 30); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, 26, 26, 1028, 1868, 24); ctx.stroke(); ctx.restore();
        if (f.tag){ const q = eBack(clamp((t - .15) / .45, 0, 1)); ctx.save(); ctx.translate(90, 215); ctx.rotate(-.04); ctx.scale(q, q); font(ctx, 900, 46, FAM); const w = ctx.measureText(f.tag).width + 56;
          ctx.fillStyle = "#F6D36B"; ctx.fillRect(0, 0, w, 78); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(0, 0, w, 78); ctx.fillStyle = BROWN; ctx.fillText(f.tag, 28, 56); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); (f.words || []).forEach((w, j) => add(tOf(s, w, .2 + j * .1, i), "pop")); if (f.flyCue) add(cueT(s, f.flyCue, .4, i), "whoosh"); if (f.chaseCue) add(cueT(s, f.chaseCue, .3, i), "whoosh"); if (f.awkCue) add(cueT(s, f.awkCue, .3, i), "whoosh"); });

  /* ================= cg_jeda: time freeze + breathing ================= */
  // f.freeze: {on (toon index), cue (freeze), breathCue, countCue, countEndCue, countTo=5, coolCue (unfreeze, colour + size back), grow0=1.2}; f.papers: n paper sheets that freeze mid-air
  TT.scene("cg_jeda", "Cerita: jeda waktu berhenti", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Z = Object.assign({ on: 1, grow0: 1.2, countTo: 5 }, f.freeze || {});
    const tF = T(s, Z.cue, .3, idx), tB = T(s, Z.breathCue, .3, idx), tC = T(s, Z.coolCue, .3, idx), tN0 = T(s, Z.countCue, .1, idx), tN1 = Z.countEndCue ? T(s, Z.countEndCue, .3, idx) : tN0 + 1.6;
    const frozen = t >= tF && t < tC, tp = t < tF ? t : (t < tC ? tF : t - (tC - tF));
    const dz = clamp((t - tF) / .3, 0, 1) * (1 - clamp((t - tC) / .8, 0, 1)), shrink = eOut(clamp((t - tC) / 1.0, 0, 1));
    let headS = null;
    base(ctx, s, t, { env: "office",
      prep: (a, j) => j === Z.on ? { a: Object.assign({}, a, { size: (a.size || 760) * lerp(Z.grow0, 1, shrink) }), t } : { a, t: frozen ? tF : t },
      back: (ctx2, c, sts) => { const st = sts[Z.on]; if (!st || t < tB || t > tC + .8) return; const [hx, hy, r] = headOf(st), ph = (t - tB), br = .5 - .5 * Math.cos(ph * 1.6), a = (1 - clamp((t - tC) / .8, 0, 1));
        for (let i = 0; i < 3; i++){ ctx.save(); ctx.globalAlpha = a * (.55 - i * .15); ctx.strokeStyle = i ? "#BFE3F0" : "#7CC7E0"; ctx.lineWidth = 16 - i * 4; ctx.beginPath(); ctx.arc(hx, hy + r * .4, r * (1.55 + br * .7) + i * 40, 0, TAU); ctx.stroke(); ctx.restore(); }
        glowAt(ctx, hx, hy + r * .4, r * (2.4 + br), "#BFE3F0", .35 * a); },
      front: (ctx2, c, sts) => { if (f.table !== false) meetingTable(ctx, t, f.table || {});
        for (let i = 0; i < (f.papers ?? 4); i++){ const x = 160 + i * 250 + Math.sin(tp * 1.5 + i) * 50, y = 260 + rnd(i) * 160 + tp * (110 + i * 18); if (y > 1480) continue;
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(tp * 2 + i * 2) * .6); ctx.fillStyle = PAPER; rr(ctx, -55, -70, 110, 140, 6); ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA(BROWN, .3); for (let l = 0; l < 4; l++) ctx.fillRect(-36, -44 + l * 24, 72 - (l % 2) * 20, 7); ctx.restore(); }
        const st = sts[Z.on]; if (st) { const h = c.toScreen(...toonHead(st)); headS = [h[0], h[1], st.size * 20.5 / 92 * c.scale()]; } },
      post: () => { if (dz > 0 && headS) desat(ctx, dz * .9, [headS[0], headS[1] + headS[2] * .4, headS[2] * 2.3], "#5A7AA8"); },
      over: () => {
        const kq = t - tF; if (kq > 0 && kq < 1.6){ const q = eBack(clamp(kq / .35, 0, 1)) * (1 - clamp((kq - 1.2) / .4, 0, 1)); ctx.save(); ctx.translate(540, 330); ctx.scale(q, q);
          rr(ctx, -90, -90, 180, 180, 36); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ol(ctx, 7); ctx.fillStyle = BROWN; rr(ctx, -46, -52, 30, 104, 8); ctx.fill(); rr(ctx, 16, -52, 30, 104, 8); ctx.fill(); ctx.restore(); }
        if (t > tN0 && t < tC + .6){ const n = Z.countTo, step = (tN1 - tN0) / Math.max(1, n - 1), i = Math.min(n - 1, Math.floor((t - tN0) / step)), k = t - tN0 - i * step, q = eBack(clamp(k / .25, 0, 1)), out = clamp((t - tC) / .6, 0, 1);
          ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(540, 470); ctx.scale(q * (1 + .5 * out), q * (1 + .5 * out)); TT.outlineWords(ctx, [{ w: String(i + 1), hl: i === n - 1 }], 0, 60, 190, { sw: 40 }); ctx.restore();
          for (let d = 0; d < n; d++){ ctx.save(); ctx.globalAlpha = 1 - out; ctx.beginPath(); ctx.arc(540 + (d - (n - 1) / 2) * 50, 620, 14, 0, TAU); ctx.fillStyle = d <= i ? HL : "rgba(255,255,255,.35)"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Z = Object.assign({ countTo: 5 }, f.freeze || {}); if (Z.cue) add(cueT(s, Z.cue, .3, i), "ping"); if (Z.coolCue) add(cueT(s, Z.coolCue, .3, i), "chime");
    if (Z.countCue){ const a = cueT(s, Z.countCue, .1, i), b = Z.countEndCue ? cueT(s, Z.countEndCue, .3, i) : a + 1.6; for (let k = 0; k < Z.countTo; k++) add(a + k * (b - a) / Math.max(1, Z.countTo - 1), "pop"); } });

  /* ---------- desktop icons ---------- */
  const ICON_NAMES = { doc: ["laporan_final.docx", "rapat (2).pptx", "draft_baru.docx", "anggaran.xlsx", "memo_v3.docx", "notulen.pdf"], zip: ["unduhan (7).zip", "setup_v2.exe", "file (12).zip", "tema_lama.zip"], img: ["Screenshot_88.png", "IMG_0412.jpg", "Screenshot_91.png", "IMG_2231.jpg"] };
  const ICON_TYPES = ["doc", "img", "zip", "doc", "img", "doc", "zip", "img", "doc", "zip"];
  function drawIcon(ctx, type, x, y, s, label, t, hl){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (hl){ glowAt(ctx, 0, 0, 150, GOLD, .7); }
    if (type === "folder" || type === "album"){ const col = type === "folder" ? "#F2C14E" : "#7FB7E6";
      ctx.fillStyle = col; rr(ctx, -66, -52, 56, 22, 6); ctx.fill(); ol(ctx, 4); rr(ctx, -66, -40, 132, 92, 10); ctx.fill(); ol(ctx, 5);
      if (type === "album"){ ctx.fillStyle = "#FFFFFF"; rr(ctx, -40, -24, 80, 60, 6); ctx.fill(); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(-36, 32); ctx.lineTo(-8, 0); ctx.lineTo(20, 32); ctx.fill(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(20, -8, 9, 0, TAU); ctx.fill(); } }
    else if (type === "img"){ ctx.fillStyle = "#9FD3E8"; rr(ctx, -50, -56, 100, 112, 10); ctx.fill(); ol(ctx, 5); ctx.save(); rr(ctx, -50, -56, 100, 112, 10); ctx.clip();
      ctx.fillStyle = "#5F8F4E"; ctx.beginPath(); ctx.moveTo(-60, 56); ctx.lineTo(-14, 0); ctx.lineTo(30, 56); ctx.fill(); ctx.fillStyle = "#7FA563"; ctx.beginPath(); ctx.moveTo(0, 56); ctx.lineTo(30, 20); ctx.lineTo(70, 56); ctx.fill(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(24, -28, 13, 0, TAU); ctx.fill(); ctx.restore(); }
    else { const band = type === "zip" ? "#8E7BB5" : (label && /pdf/.test(label) ? RED : label && /xlsx/.test(label) ? GREEN : label && /pptx/.test(label) ? ORANGE : "#3F6FB5");
      ctx.beginPath(); ctx.moveTo(-44, -58); ctx.lineTo(22, -58); ctx.lineTo(46, -34); ctx.lineTo(46, 58); ctx.lineTo(-44, 58); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = band; ctx.fillRect(-44, 14, 90, 26); ctx.fillStyle = "rgba(43,26,18,.25)"; for (let l = 0; l < 3; l++) ctx.fillRect(-30, -36 + l * 15, 50 - l * 8, 6);
      if (type === "zip"){ ctx.fillStyle = "#5B4A80"; for (let l = 0; l < 5; l++) ctx.fillRect(-4 + (l % 2) * 8, -58 + l * 12, 8, 8); } }
    if (label){ font(ctx, 700, 22, FAM); let L = label; while (ctx.measureText(L).width > 180 && L.length > 4) L = L.slice(0, -2); if (L !== label) L += "…";
      ctx.textAlign = "center"; ctx.lineWidth = 6; ctx.strokeStyle = "rgba(20,24,40,.85)"; ctx.lineJoin = "round"; ctx.strokeText(L, 0, 92); ctx.fillStyle = "#FFFFFF"; ctx.fillText(L, 0, 92); ctx.textAlign = "left"; }
    ctx.restore(); }
  function wallpaper(ctx, c, t, bright){
    layer(ctx, c, .4, () => { ctx.fillStyle = (() => { const g = ctx.createLinearGradient(0, -300, 0, 1700); g.addColorStop(0, "#1F3A66"); g.addColorStop(.6, "#5B6FA8"); g.addColorStop(1, "#E8A07A"); return g; })(); ctx.fillRect(-3000, -3000, 7080, 7000);
      ctx.fillStyle = "#F6D36B"; ctx.beginPath(); ctx.arc(760, 900, 150, 0, TAU); ctx.fill(); glowAt(ctx, 760, 900, 420, "#FFE3A0", .35 + .1 * Math.sin(t * 2));
      ctx.fillStyle = "#3B4A7A"; ctx.beginPath(); ctx.moveTo(-800, 1700); ctx.lineTo(200, 1000); ctx.lineTo(700, 1500); ctx.lineTo(1100, 1100); ctx.lineTo(2000, 1700); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#2C3560"; ctx.beginPath(); ctx.moveTo(-800, 1750); ctx.lineTo(500, 1250); ctx.lineTo(1300, 1750); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 4; i++){ const x = ((t * 22 + i * 420) % 1900) - 400; ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.ellipse(x, 300 + i * 120, 120, 34, 0, 0, TAU); ctx.fill(); } });
    layer(ctx, c, 1, () => { ctx.fillStyle = "rgba(18,22,40,.92)"; ctx.fillRect(-2000, GROUND, 5080, 1200); ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(-2000, GROUND, 5080, 4);
      ctx.fillStyle = "#3F6FB5"; rr(ctx, 60, GROUND + 24, 70, 70, 14); ctx.fill(); ctx.fillStyle = "#FFFFFF"; [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([a, b]) => ctx.fillRect(76 + a * 20, GROUND + 40 + b * 20, 16, 16));
      [ORANGE, GREEN, "#7FB7E6", GOLD].forEach((col, i) => { ctx.fillStyle = col; rr(ctx, 170 + i * 90, GROUND + 30, 60, 60, 12); ctx.fill(); });
      font(ctx, 700, 34, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText("21.04", 900, GROUND + 72); });
    TT.CS.grade = { warm: .06, vig: .35 };
  }

  /* ================= cg_desktop: inside the laptop ================= */
  // f.desk: {mode:"mess"|"clean", enterCue (mess: zoom into the laptop first), fillCue, fullCue, n=34, groups:[{cue, kind:"folder"|"poof"|"album", label, x, y}], foundCue, found:"kontrak_final.pdf"}
  // mess: f.toonA (actor at the laptop, home at night), f.camA (keys), f.deskX
  TT.scene("cg_desktop", "Cerita: di dalam laptop", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Dk = Object.assign({ mode: "mess", n: 34, found: "kontrak.pdf", foundIdx: 17 }, f.desk || {}), mess = Dk.mode === "mess";
    const tE = mess ? T(s, Dk.enterCue, .35, idx) : -1, tIn = mess ? tE + .6 : -1, tFill = T(s, Dk.fillCue, .2, idx), tFull = T(s, Dk.fullCue, .6, idx), tFound = T(s, Dk.foundCue, .3, idx);
    if (mess && t < tIn){ // phase A: at the laptop
      const deskX = f.deskX ?? 700, a = Object.assign({ x: 380, size: 760, face: 1 }, f.toonA || {}), st = toonState(a, s, t);
      const c = cam(s, t, (f.camA || [{ at: 0, x: 560, y: 1040, zoom: 1.06 }]).concat([{ at: tE, x: deskX - 40, y: GROUND - 370, zoom: 5.5, dur: .6, ease: "in" }]), { resolve: (on, tt, k) => { const h = toonHead(st); return [h[0], h[1] + 40, k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null]; } });
      env(ctx, "home", t, c, { time: "night", lampX: 900 });
      layer(ctx, c, 1, () => prop(ctx, "desk", deskX, GROUND, { laptop: true, mug: true }, t));
      toon(ctx, c, a, s, t, { st });
      layer(ctx, c, 1, () => { const k = t - (tE - .3); if (k > 0){ ctx.fillStyle = hexA("#CFE7EE", clamp(k / .5, 0, 1) * .8); ctx.fillRect(deskX - 40 - 86, GROUND - 290 - 136, 172, 112); } });
      if (f.stamp) titleStamp(ctx, f.stamp, t);
      return;
    }
    // icons
    const n = Dk.n, ic = [];
    for (let i = 0; i < n; i++){ const grid = i < 30, col = i % 5, row = Math.floor(i / 5) % 6;
      const x = grid ? 120 + col * 210 + (rnd(i) - .5) * 40 : 140 + rnd(i + 50) * 800, y = grid ? 270 + row * 205 + (rnd(i + 9) - .5) * 30 : 300 + rnd(i + 70) * 900;
      const type = i === Dk.foundIdx ? "doc" : ICON_TYPES[i % ICON_TYPES.length], nm = i === Dk.foundIdx ? Dk.found : ICON_NAMES[type][(i * 7) % ICON_NAMES[type].length];
      const tA = mess ? (i < 8 ? tIn + .1 + i * .05 : lerp(tFill, tFull, (i - 8) / Math.max(1, n - 9))) : -9;
      ic.push({ i, x, y, type, nm, tA, rot: (rnd(i + 3) - .5) * (grid ? .12 : .5) }); }
    const groups = (Dk.groups || []).map((g, j) => Object.assign({ T: tOf(s, g, .3, idx), j }, g));
    const grpOf = it => it.i === Dk.foundIdx ? null : groups.find(g => (g.kind === "folder" && it.type === "doc") || (g.kind === "poof" && it.type === "zip") || (g.kind === "album" && it.type === "img"));
    const camKeys = (mess ? [{ at: 0, x: 540, y: 1000, zoom: 1.7 }, { at: tIn, x: 540, y: 960, zoom: 1.0, dur: .8, ease: "out" }] : []).concat(f.cam || [{ at: 0, x: 540, y: 960, zoom: 1.04 }]);
    base(ctx, s, Math.max(t, 0), { envDraw: (ctx2, c) => wallpaper(ctx, c, t), envFront: false, cam: camKeys,
      back: () => {
        groups.forEach(g => { if (g.kind === "poof" || t < g.T) return; const recv = ic.filter(it => grpOf(it) === g).map(it => t - (g.T + .3 + it.i * .03) - .5).filter(d => d > 0 && d < .25).length;
          drawIcon(ctx, g.kind, g.x ?? 540, g.y ?? 420, (1.9 + (recv ? .15 : 0)) * eBack(clamp((t - g.T) / .4, 0, 1)), null, t);
          if (g.label){ const q = clamp((t - g.T - .2) / .3, 0, 1); ctx.save(); ctx.globalAlpha = q; fit(ctx, g.label, 300, 40, 900); const w = ctx.measureText(g.label).width + 40; rr(ctx, (g.x ?? 540) - w / 2, (g.y ?? 420) + 120, w, 58, 29); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(g.label, g.x ?? 540, (g.y ?? 420) + 163); ctx.textAlign = "left"; ctx.restore(); } });
        ic.forEach(it => { if (it.i === Dk.foundIdx && t > tFound) return; let x = it.x, y = it.y, sc = 1, rot = it.rot;
          if (mess){ const k = t - it.tA; if (k < 0) return; const q = clamp(k / .45, 0, 1); y = lerp(it.y - 900, it.y, eIn(q)); if (q >= 1){ const b = k - .45; sc = 1 + (b < .3 ? Math.sin(b / .3 * Math.PI) * .12 : 0); } rot = it.rot + (1 - q) * 2; }
          const g = grpOf(it); if (g && t > g.T + .3){ const k = t - (g.T + .3 + it.i * .03); if (k > 0){ if (g.kind === "poof"){ const q = clamp(k / .35, 0, 1); if (q >= 1){ if (k < .9){ ctx.save(); ctx.globalAlpha = 1 - (k - .35) / .55; for (let p = 0; p < 6; p++){ const a = p / 6 * TAU; ctx.fillStyle = "#E9E2D6"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * (30 + k * 80), y + Math.sin(a) * (30 + k * 80), 26 * (1 - k * .6), 0, TAU); ctx.fill(); } ctx.restore(); } return; } sc *= 1 - eIn(q); rot += q * 3; }
              else { const q = clamp(k / .5, 0, 1); if (q >= 1) return; const e = eIn(q) * .6 + q * .4; x = lerp(it.x, g.x ?? 540, e); y = lerp(it.y, g.y ?? 420, e) - Math.sin(q * Math.PI) * 160; sc *= 1 - .6 * e; rot += q * 4; } } }
          ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.translate(-x, -y); drawIcon(ctx, it.type, x, y, sc, it.nm, t, false); ctx.restore(); });
      },
      front: (ctx2, c, sts) => { if (t < tFound) return; const it = ic[Dk.foundIdx], k = t - tFound, q = eOut(clamp(k / .6, 0, 1)), x = lerp(it.x, 540, q), y = lerp(it.y, 560, q) - Math.sin(q * Math.PI) * 120;
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * .05); ctx.translate(-x, -y); drawIcon(ctx, "doc", x, y, 1 + 1.1 * eBack(clamp(k / .6, 0, 1)), it.nm, t, true); ctx.restore(); burstFx(ctx, 540, 560, k - .4, GOLD, 14, 300); } });
    if (mess && t - tIn < .45){ ctx.save(); ctx.globalAlpha = 1 - clamp((t - tIn) / .45, 0, 1); ctx.fillStyle = "#EAF6FB"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Dk = Object.assign({ mode: "mess" }, f.desk || {});
    if (Dk.mode === "mess" && Dk.enterCue){ const tE = cueT(s, Dk.enterCue, .35, i); add(tE, "whoosh"); add(tE + .6, "ping"); }
    if (Dk.fillCue){ const a = cueT(s, Dk.fillCue, .2, i), b = Dk.fullCue ? cueT(s, Dk.fullCue, .6, i) : a + 2; for (let k = 0; k < 5; k++) add(a + (b - a) * k / 4, "pop"); }
    (Dk.groups || []).forEach(g => { const t0 = tOf(s, g, .3, i); add(t0, "pop"); add(t0 + .35, "whoosh"); }); if (Dk.foundCue){ const tf = cueT(s, Dk.foundCue, .3, i); add(tf, "whoosh"); add(tf + .4, "chime"); } });

  /* ================= cg_longsor: download folder bursts ================= */
  // f.folder: {x, y, w, h, label, burstCue, files:[names], pileTo (pile top y), pileX:[x0, x1], galleryCue, tornadoX}
  TT.scene("cg_longsor", "Cerita: folder unduhan meledak", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, F = Object.assign({ x: 760, y: 760, w: 480, h: 380, label: "UNDUHAN", pileTo: 1330, pileX: [40, 760], tornadoX: 800,
      files: ["file (1).pdf", "file (2).pdf", "file_final.pdf", "file_final2.pdf", "file_fix.pdf", "file (3).pdf", "file_baru.pdf", "file_fix2.pdf"] }, f.folder || {});
    const tB = T(s, F.burstCue, .3, idx), tG = T(s, F.galleryCue, .3, idx), pileQ = eOut(clamp((t - tB - .4) / 3, 0, 1)), pileTop = lerp(GROUND + 40, F.pileTo, pileQ);
    const mx = F.x, my = F.y - F.h * .35;
    const mound = x => { const [a, b] = F.pileX, u = clamp((x - a) / (b - a), 0, 1); return lerp(GROUND + 40, pileTop, Math.sin(u * Math.PI) ** .7); };
    base(ctx, s, t, { env: "info", envOpt: { spotX: 300 },
      back: () => {
        const gone = clamp((t - tG) / .5, 0, 1); if (gone < 1){ const pre = clamp((t - tB + 1.5) / 1.5, 0, 1), tr = t < tB ? Math.sin(t * 40) * 8 * pre : 0, bul = t < tB ? .06 * pre * (1 + Math.sin(t * 9)) : 0, open = eBack(clamp((t - tB) / .35, 0, 1));
          ctx.save(); ctx.translate(F.x + tr, F.y + Math.sin(t * 1.6) * 12); ctx.scale((1 + bul) * (1 - gone), (1 - bul * .5) * (1 - gone)); glowAt(ctx, 0, 0, F.w, "#F2C14E", .25);
          ctx.fillStyle = "#D9A23A"; rr(ctx, -F.w / 2, -F.h / 2 - 40, F.w * .4, 60, 14); ctx.fill(); ol(ctx, 6); rr(ctx, -F.w / 2, -F.h / 2, F.w, F.h, 22); ctx.fill(); ol(ctx, 7);
          for (let i = 0; i < 5; i++){ ctx.save(); ctx.translate(-F.w * .3 + i * F.w * .14, -F.h / 2 + 10 - (t > tB ? 30 : 0) - Math.sin(t * 10 + i) * 6 * pre); ctx.rotate((i - 2) * .1); ctx.fillStyle = PAPER; rr(ctx, -50, -60, 100, 90, 6); ctx.fill(); ol(ctx, 4); ctx.restore(); }
          ctx.save(); ctx.translate(0, F.h / 2); ctx.transform(1, 0, 0, Math.cos(open * 1.25), 0, 0); ctx.fillStyle = "#F2C14E"; rr(ctx, -F.w / 2, -F.h * .78, F.w, F.h * .78, 20); ctx.fill(); ol(ctx, 7);
          if (open < .5){ fit(ctx, F.label, F.w - 80, 64, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(F.label, 0, -F.h * .38); ctx.textAlign = "left"; ico(ctx, "file", 0, -F.h * .62, 60, BROWN, 3); } ctx.restore();
          ctx.restore(); if (t > tB) burstFx(ctx, mx, my, t - tB, GOLD, 14, 300); }
        // tornado of screenshots
        if (t > tG){ const q = eOut(clamp((t - tG) / .7, 0, 1)), cx = F.tornadoX, th2 = [];
          ctx.save(); ctx.globalAlpha = .4 * q; ctx.strokeStyle = "#BFD0EA"; ctx.lineWidth = 6; for (let k = 0; k < 9; k++){ const h = k / 8, y = 1450 - h * 900 * q, r = 50 + h * 280; ctx.beginPath(); ctx.ellipse(cx + Math.sin(t * 3 + k) * 20, y, r, r * .22, 0, t * 2 + k, t * 2 + k + 4.4); ctx.stroke(); } ctx.restore();
          for (let i = 0; i < 26; i++){ const h = (i / 26 + t * .05) % 1, a = t * (3.4 - h * 1.4) + i * 2.4, r = (60 + h * 280) * q, y = 1450 - h * 900 * q, z = Math.sin(a); th2.push({ x: cx + Math.cos(a) * r, y: y + z * r * .18, z, i }); }
          th2.sort((p, q2) => p.z - q2.z).forEach(p => { const sc = (.55 + .3 * (p.z + 1) / 2) * q; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(t * 4 + p.i) * .4); ctx.scale(sc, sc);
            rr(ctx, -48, -80, 96, 160, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = ["#7FB7E6", ORANGE, GREEN, "#8E7BB5"][p.i % 4]; ctx.fillRect(-40, -70, 80, 26);
            ctx.fillStyle = "rgba(43,26,18,.25)"; for (let l = 0; l < 4; l++) ctx.fillRect(-36, -30 + l * 22, 72 - (l % 2) * 24, 9); ctx.restore(); }); }
      },
      front: () => {
        // flying files
        if (t > tB) for (let i = 0; i < 46; i++){ const tl = tB + i * .07, d = t - tl; if (d < 0) break; const vx = -260 - rnd(i) * 560, vy = -700 - rnd(i + 5) * 500, x = mx + vx * d, y = my + vy * d + 1300 * d * d;
          if (vy + 2600 * d > 0 && y > mound(x) - 40) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(d * (4 + rnd(i) * 4)); drawIcon(ctx, "doc", 0, 0, .9, null, t); ctx.restore(); }
        // the pile in front of the toon
        if (pileQ > 0){ for (let i = 0; i < 60; i++){ const u = rnd(i + 200), x = lerp(F.pileX[0], F.pileX[1], u), top = mound(x), y = lerp(GROUND + 60, top + 60, rnd(i + 300) ** .5); if (y < top + 30) continue;
            ctx.save(); ctx.translate(x, y); ctx.rotate((rnd(i + 400) - .5) * 1.6); drawIcon(ctx, "doc", 0, 0, .95, F.files[i % F.files.length], t); ctx.restore(); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const F = f.folder || {}; if (F.burstCue){ const tb = cueT(s, F.burstCue, .3, i); add(tb, "pop"); add(tb + .05, "whoosh"); for (let k = 1; k < 5; k++) add(tb + k * .5, "pop"); } if (F.galleryCue) add(cueT(s, F.galleryCue, .3, i), "whoosh"); });

  /* ================= cg_replay: instant replay with telestrator ================= */
  // f.replay: {tag:"REPLAY", tableX, tableTop, plates, clock:{x, y, r, spinCue}, carry (toon index carrying boxes), marks:[{cue, kind:"circle"|"arrow", x, y, rx, ry | x1, y1, x2, y2}], rewindCue}
  TT.scene("cg_replay", "Cerita: tayangan ulang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rp = Object.assign({ tag: "REPLAY", tableX: 640, tableTop: 1250, tableW: 640, plates: 3 }, f.replay || {}), C = Object.assign({ x: 960, y: 560, r: 84 }, Rp.clock || {});
    const tSpin = T(s, C.spinCue, .3, idx), tRw = T(s, Rp.rewindCue, .3, idx);
    const marks = (Rp.marks || []).map((m, j) => Object.assign({ T: tOf(s, m, .3, idx) }, m));
    base(ctx, s, t, { env: "park",
      back: () => { // bunting + clock on a pole
        for (let row = 0; row < 2; row++){ const y0 = 430 + row * 70, sag = 90; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); for (let x = -100; x <= 1180; x += 20){ const u = (x + 100) / 1280, y = y0 + Math.sin(u * Math.PI) * sag; x === -100 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
          for (let i = 0; i < 12; i++){ const x = -60 + i * 105 + row * 50, u = (x + 100) / 1280, y = y0 + Math.sin(u * Math.PI) * sag, sw = Math.sin(t * 3 + i + row) * .15; ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
            ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(0, 62); ctx.closePath(); ctx.fillStyle = [ORANGE, GOLD, CREAM, "#7FB7E6"][(i + row) % 4]; ctx.fill(); ol(ctx, 3); ctx.restore(); } }
        ctx.fillStyle = "#6B4A30"; rr(ctx, C.x - 12, C.y, 24, GROUND - C.y, 6); ctx.fill(); ol(ctx, 5);
        const spin = clamp((t - tSpin) / 1.4, 0, 1), m = eOut(spin) * TAU, hr = .4 + eOut(spin) * TAU / 12;
        ctx.beginPath(); ctx.arc(C.x, C.y, C.r, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = BROWN; ctx.lineWidth = 12; ctx.stroke();
        for (let k = 0; k < 12; k++){ const a = k / 12 * TAU; ctx.fillStyle = BROWN; ctx.beginPath(); ctx.arc(C.x + Math.cos(a) * C.r * .78, C.y + Math.sin(a) * C.r * .78, 5, 0, TAU); ctx.fill(); }
        ctx.lineCap = "round"; ctx.strokeStyle = BROWN; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.lineTo(C.x + Math.sin(hr) * C.r * .45, C.y - Math.cos(hr) * C.r * .45); ctx.stroke();
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.lineTo(C.x + Math.sin(m) * C.r * .68, C.y - Math.cos(m) * C.r * .68); ctx.stroke();
        if (spin > 0 && spin < 1){ ctx.save(); ctx.globalAlpha = .6; ctx.strokeStyle = HL; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(C.x, C.y, C.r + 24, m - 1.6 - Math.PI / 2, m - Math.PI / 2); ctx.stroke(); ctx.restore(); } },
      mid: () => { const x0 = Rp.tableX - Rp.tableW / 2, y = Rp.tableTop;
        ctx.fillStyle = "#8E4E2E"; [x0 + 30, x0 + Rp.tableW - 54].forEach(lx => { rr(ctx, lx, y, 24, GROUND - y, 5); ctx.fill(); ol(ctx, 5); });
        ctx.fillStyle = CREAM; rr(ctx, x0 - 20, y - 10, Rp.tableW + 40, 120, 12); ctx.fill(); ol(ctx, 6);
        for (let i = 0; i < 9; i++){ ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x0 - 20 + (i + .5) * (Rp.tableW + 40) / 9, y + 110, (Rp.tableW + 40) / 18, 0, Math.PI); ctx.fill(); ol(ctx, 4); }
        for (let i = 0; i < Rp.plates; i++){ const px = x0 + (i + .5) * Rp.tableW / Rp.plates; ctx.beginPath(); ctx.ellipse(px, y - 6, 74, 22, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(px, y - 6, 44, 12, 0, 0, TAU); ctx.strokeStyle = "rgba(43,26,18,.2)"; ctx.lineWidth = 3; ctx.stroke(); } },
      midZ: .5,
      over1: (ctx2, c, sts, j) => { if (j !== Rp.carry) return; const st = sts[j], h = lp(st, 32, -42); for (let b = 0; b < 2; b++){ ctx.save(); ctx.translate(h[0] + Math.sin(t * 9 + b) * 4, h[1] - b * 52); ctx.rotate(Math.sin(t * 6 + b) * .05);
          ctx.fillStyle = b % 2 ? "#E8B98A" : "#D99A62"; rr(ctx, -70, -46, 140, 48, 6); ctx.fill(); ol(ctx, 5); ctx.fillStyle = RED; ctx.fillRect(-12, -46, 24, 48); ctx.restore(); } },
      front: () => { marks.forEach(m => { const k = t - m.T; if (k < 0) return; const q = clamp(k / .5, 0, 1); ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
          const path = () => { ctx.beginPath(); if (m.kind === "arrow"){ const ex = lerp(m.x1, m.x2, q), ey = lerp(m.y1, m.y2, q); ctx.moveTo(m.x1, m.y1); ctx.quadraticCurveTo((m.x1 + ex) / 2 + 40, (m.y1 + ey) / 2 - 40, ex, ey);
              if (q >= 1){ const a = Math.atan2(m.y2 - m.y1, m.x2 - m.x1); ctx.moveTo(m.x2, m.y2); ctx.lineTo(m.x2 - Math.cos(a - .5) * 60, m.y2 - Math.sin(a - .5) * 60); ctx.moveTo(m.x2, m.y2); ctx.lineTo(m.x2 - Math.cos(a + .5) * 60, m.y2 - Math.sin(a + .5) * 60); } }
            else { const rx = m.rx ?? m.r ?? 120, ry = m.ry ?? m.r ?? 120; for (let a = 0; a <= q * TAU * 1.08; a += .08){ const w = 1 + .06 * Math.sin(a * 3 + m.T), x = m.x + Math.cos(a - 1.9) * rx * w, y = m.y + Math.sin(a - 1.9) * ry * w; a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } } };
          path(); ctx.strokeStyle = OUT; ctx.lineWidth = 20; ctx.stroke(); path(); ctx.strokeStyle = "#FFE14D"; ctx.lineWidth = 12; ctx.stroke(); ctx.restore(); }); },
      post: () => { ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = hexA("#4FA3C7", .45 + (t > tRw ? .3 : 0)); ctx.fillRect(0, 0, 1080, 1920); ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0,0,0,.07)"; for (let y = (t * 60) % 8; y < 1920; y += 8) ctx.fillRect(0, y, 1080, 3);
        if (t > tRw){ for (let i = 0; i < 6; i++){ const y = (rnd(i + Math.floor(t * 20)) * 1920), h = 10 + rnd(i + 3) * 40; ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(0, y, 1080, h); } } },
      over: () => { const rw = t > tRw, blink = Math.sin(t * 8) > 0; ctx.save(); ctx.translate(90, 200);
        font(ctx, 900, 44, FAM); const lbl = rw ? "ULANG" : Rp.tag, w = ctx.measureText(lbl).width + 110; rr(ctx, 0, 0, w, 76, 14); ctx.fillStyle = "rgba(18,20,30,.75)"; ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.stroke();
        if (rw){ ctx.fillStyle = CREAM; for (let d = 0; d < 2; d++){ ctx.beginPath(); ctx.moveTo(56 - d * 22, 22); ctx.lineTo(56 - d * 22, 54); ctx.lineTo(34 - d * 22, 38); ctx.closePath(); ctx.fill(); } }
        else if (blink){ ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(40, 38, 16, 0, TAU); ctx.fill(); }
        ctx.fillStyle = CREAM; ctx.fillText(lbl, 76, 54);
        const tc = rw ? 30 - t * 4 : 12 + t, mm = Math.floor(Math.abs(tc) / 60), ss = Math.floor(Math.abs(tc) % 60), ff = Math.floor((Math.abs(tc) * 30) % 30);
        font(ctx, 700, 34, FAM); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fillText(`19:${String(42 + mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}:${String(ff).padStart(2, "0")}`, 4, 120);
        ctx.restore();
        ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 6; [[60, 170, 1, 1], [1020, 170, -1, 1], [60, 1760, 1, -1], [1020, 1760, -1, -1]].forEach(([x, y, dx, dy]) => { ctx.beginPath(); ctx.moveTo(x, y + dy * 70); ctx.lineTo(x, y); ctx.lineTo(x + dx * 70, y); ctx.stroke(); }); ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rp = f.replay || {}; (Rp.marks || []).forEach(m => add(tOf(s, m, .3, i), "whoosh")); if (Rp.clock && Rp.clock.spinCue) add(cueT(s, Rp.clock.spinCue, .3, i), "ping"); if (Rp.rewindCue) add(cueT(s, Rp.rewindCue, .3, i), "whoosh"); });

  /* ================= cg_bisik: tiny inner self ================= */
  // f.mini: {cue (appear), on (toon index), dx=250, dy=-60, size, actor:{look}, keys:[...], qs:[{cue, text}], answerCue}
  TT.scene("cg_bisik", "Cerita: diri kecil bertanya", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ on: 0, dx: 250, dy: -40 }, f.mini || {}), tM = T(s, M.cue, .3, idx), tAns = T(s, M.answerCue, .2, idx);
    const qs = (M.qs || []).map((q, j) => Object.assign({ T: tOf(s, q, .3, idx), j }, q));
    const hero = (f.toons || [])[M.on] || {};
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 860 },
      after: (ctx2, c, sts) => { const st = sts[M.on]; if (!st || t < tM) return; const h = toonHead(st), k = t - tM, q = eBack(clamp(k / .5, 0, 1)), size = M.size || st.size * .42;
        const mx = h[0] + (st.face || 1) * M.dx, fy = h[1] + M.dy + size * .1 + Math.sin(t * 2.2) * 14;
        layer(ctx, c, 1, () => { // link dots + cushion
          for (let d = 0; d < 4; d++){ const u = (d + 1) / 5; ctx.fillStyle = hexA(CREAM, .8 * q); ctx.beginPath(); ctx.arc(lerp(h[0] + (st.face || 1) * 120, mx, u), lerp(h[1] - 120, fy - size * .3, u) - Math.sin(u * Math.PI) * 60, 10 + d * 3, 0, TAU); ctx.fill(); }
          ctx.save(); ctx.globalAlpha = q; glowAt(ctx, mx, fy - size * .5, size * 1.1, "#FFE3A0", .35);
          const PF = [[-.42, .02, .2], [-.16, -.04, .26], [.14, -.03, .25], [.4, .02, .2], [0, .06, .22]];
          PF.forEach(([ox, oy, r]) => { ctx.beginPath(); ctx.arc(mx + ox * size, fy + oy * size + 14, r * size + 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
          PF.forEach(([ox, oy, r]) => { ctx.beginPath(); ctx.arc(mx + ox * size, fy + oy * size + 14, r * size, 0, TAU); ctx.fillStyle = "#FFF4E6"; ctx.fill(); });
          ctx.restore(); });
        const a = Object.assign({}, hero, M.actor || {}, { x: mx, y: fy, size: size * q, keys: M.keys || [], face: -(st.face || 1), shadow: false });
        if (q > .05){ const r = toon(ctx, c, a, s, t);
          const cur = qs.filter(qq => qq.T <= t && t < tAns).pop(); if (cur && r){ const kk = t - cur.T, top = r.screen.top; TT.CS.ov.push(() => TT.bubble(ctx, cur.text, top[0], top[1] - 10, kk, { size: 50, t })); } }
        if (k < .8) burstFx(ctx, c.toScreen(mx, fy)[0], c.toScreen(mx, fy - size * .5)[1], k - .05, GOLD, 10, 160); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.mini || {}; if (M.cue){ add(cueT(s, M.cue, .3, i), "pop"); add(cueT(s, M.cue, .3, i) + .05, "chime"); } (M.qs || []).forEach(q => add(tOf(s, q, .3, i), "pop")); if (M.answerCue) add(cueT(s, M.answerCue, .2, i), "chime"); });

  /* ================= cg_portal: lesson orb + portal to the next time ================= */
  // f.portal: {on, orbCue, openCue, enterCue, futureCue, x, y, label, future:{env, envOpt, toons, cam, stars:5, starsCue, starLabel}}
  TT.scene("cg_portal", "Cerita: portal ke keputusan berikutnya", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Po = Object.assign({ on: 0, x: 820, y: 1180, label: "BULAN DEPAN" }, f.portal || {});
    const tO = T(s, Po.orbCue, .3, idx), tP = T(s, Po.openCue, .3, idx), tE = T(s, Po.enterCue, .3, idx), tFu = Po.futureCue ? T(s, Po.futureCue, .2, idx) : tE + 1.2;
    const orbAt = (st) => lp(st, 21, -50);
    if (t < tFu){
      let dist = 1;
      base(ctx, s, t, { env: "info", envOpt: { spotX: 300 },
        prep: (a, j) => { if (j !== Po.on) return null; const st0 = toonState(a, s, t), d = Math.abs(st0.x - Po.x); dist = clamp(d / 260, 0, 1); return { a: Object.assign({}, a, { size: (a.size || 760) * (.15 + .85 * dist) }), t }; },
        back: () => { const q = eBack(clamp((t - tP) / .6, 0, 1)); if (q <= 0) return; const rx = 230 * q, ry = 380 * q;
          glowAt(ctx, Po.x, Po.y, 560 * q, "#FFB45C", .5);
          for (let i = 0; i < 7; i++){ ctx.save(); ctx.translate(Po.x, Po.y); ctx.scale(1, ry / rx); ctx.rotate(t * (2 + i * .4) * (i % 2 ? 1 : -1)); ctx.strokeStyle = [ORANGE, CREAM, GOLD, HL][i % 4]; ctx.lineWidth = 16 - i; ctx.globalAlpha = .9 - i * .08;
            ctx.beginPath(); ctx.arc(0, 0, rx * (1 - i * .12), 0, 4.2); ctx.stroke(); ctx.restore(); }
          ctx.save(); ctx.translate(Po.x, Po.y); ctx.scale(1, ry / rx); ctx.beginPath(); ctx.arc(0, 0, rx * .22, 0, TAU); ctx.fillStyle = "#FFF6E0"; ctx.fill(); ctx.restore();
          for (let i = 0; i < 16; i++){ const u = (t * .8 + rnd(i)) % 1, a = rnd(i + 4) * TAU + t, r = (1 - u) * 420; sparkle(ctx, Po.x + Math.cos(a) * r, Po.y + Math.sin(a) * r * 1.4, 12 * (1 - u) + 4, i % 2 ? GOLD : CREAM); }
          const lq = clamp((t - tP - .3) / .4, 0, 1); ctx.save(); ctx.globalAlpha = lq; ctx.translate(Po.x, Po.y - ry - 90 + Math.sin(t * 2) * 8); ctx.scale(eBack(lq), eBack(lq)); fit(ctx, Po.label, 420, 50, 900); const w = ctx.measureText(Po.label).width + 60;
          rr(ctx, -w / 2, -40, w, 80, 40); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(Po.label, 0, 17); ctx.textAlign = "left"; ctx.restore(); },
        over1: (ctx2, c, sts, j) => { if (j !== Po.on || t < tO) return; const st = sts[j], k = t - tO, q = eOut(clamp(k / .7, 0, 1)), h = toonHead(st), o = orbAt(st), x = lerp(h[0], o[0], q), y = lerp(h[1] - 260, o[1] - 40, q), r = 62 * (st.size / 760) * eBack(clamp(k / .4, 0, 1));
          glowAt(ctx, x, y, r * 3.2, GOLD, .7); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = "#FFF3C4"; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.stroke(); ctx.fillStyle = HL; star(ctx, x, y, r * .55);
          for (let i = 0; i < 6; i++){ const a = t * 2 + i; sparkle(ctx, x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6, 10, CREAM); } if (k < .8) burstFx(ctx, x, y, k - .1, GOLD, 10, 160); } });
      const fl = t - (tFu - .25); if (fl > 0){ ctx.save(); ctx.globalAlpha = clamp(fl / .25, 0, 1); ctx.fillStyle = "#FFF6E0"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      return;
    }
    const Fu = Object.assign({ env: "park", stars: 5, starLabel: "ULASAN BAIK" }, Po.future || {}), s2 = Object.assign({}, s, { f: Object.assign({}, Fu, { stamp: null, cards: Fu.cards || [] }) });
    base(ctx, s2, t, { env: Fu.env, envOpt: Fu.envOpt || {},
      front: () => { const k = t - tFu; for (let i = 0; i < 26; i++){ const d = k - .2; if (d < 0 || d > 3) break; const an = -Math.PI / 2 + (rnd(i + 3) - .5) * 2.6, v = 500 + rnd(i + 9) * 700, x = 540 + Math.cos(an) * v * d, y = 900 + Math.sin(an) * v * d + 900 * d * d;
          ctx.save(); ctx.translate(x, y); ctx.rotate(d * 8 + i); ctx.fillStyle = [ORANGE, GOLD, CREAM, "#7FB7E6"][i % 4]; ctx.fillRect(-12, -6, 24, 12); ctx.restore(); } },
      over: () => { const k = t - (Fu.starsCue ? T(s, Fu.starsCue, .2, idx) : tFu + .3); if (k < 0) return; const n = Fu.stars;
        const bq = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(540, 400); ctx.scale(bq, bq); rr(ctx, -400, -110, 800, 220, 40); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ol(ctx, 7);
        for (let i = 0; i < n; i++){ const q = eBack(clamp((k - .2 - i * .15) / .3, 0, 1)), x = (i - (n - 1) / 2) * 140; ctx.save(); ctx.translate(x, -20); ctx.scale(q, q); ctx.fillStyle = GOLD; star(ctx, 0, 0, 62); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
        textC(ctx, Fu.starLabel, 0, 80, 40, BROWN, 900); ctx.restore(); if (k < 1.2) burstFx(ctx, 540, 400, k - .7, GOLD, 14, 380); } });
    const fl = t - tFu; if (fl < .4){ ctx.save(); ctx.globalAlpha = 1 - fl / .4; ctx.fillStyle = "#FFF6E0"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Po = f.portal || {}; if (Po.orbCue) add(cueT(s, Po.orbCue, .3, i), "chime"); if (Po.openCue) add(cueT(s, Po.openCue, .3, i), "whoosh");
    const tE = Po.enterCue ? cueT(s, Po.enterCue, .3, i) : 0, tFu = Po.futureCue ? cueT(s, Po.futureCue, .2, i) : tE + 1.2; add(tFu - .25, "whoosh"); add(tFu + .3, "chime"); });

  /* ================= cg_warna: grey world / colour flood ================= */
  // f.mood: {start (grey 0..1 at t=0), grayCue, grayTo=.9, colorCue (colour floods from the hero's phone hand), hero, snail:{cue, label, p, y}, coinCue, num:{cue, to, suffix, label}}
  TT.scene("cg_warna", "Cerita: dunia abu-abu / berwarna", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Md = Object.assign({ start: 0, grayTo: .92, hero: 0 }, f.mood || {});
    const tG = T(s, Md.grayCue, .3, idx), tC = T(s, Md.colorCue, .2, idx), tS = Md.snail ? tOf(s, Md.snail, .3, idx) : 1e9, tCoin = T(s, Md.coinCue, .3, idx), tN = Md.num ? tOf(s, Md.num, .2, idx) : 1e9;
    let amt = Math.max(Md.start, Md.grayTo * clamp((t - tG) / 1.4, 0, 1)), src = null;
    base(ctx, s, t, { env: "street",
      front: (ctx2, c, sts) => { const st = sts[Md.hero]; if (!st) return; const h = lp(st, 17, -43);
        if (t > tC - 1.5 && t < tC + 3){ const g = clamp((t - (tC - 1.5)) / .5, 0, 1); glowAt(ctx, h[0], h[1] - 20, 260 * g * (1 + .1 * Math.sin(t * 8)), "#CFF1FF", .6); }
        src = c.toScreen(h[0], h[1] - 20);
        if (t > tC){ const k = t - tC; for (let i = 0; i < 14; i++){ const x = 80 + i * 72 + Math.sin(i * 3) * 20, y = GROUND - 10 - (i % 3) * 40, q = eBack(clamp((k - .5 - rnd(i) * .8) / .4, 0, 1)); if (q <= 0) continue;
            ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -60); ctx.stroke();
            for (let p = 0; p < 5; p++){ const a = p / 5 * TAU + t; ctx.fillStyle = [ORANGE, GOLD, "#F7B7A3", "#E8604C"][i % 4]; ctx.beginPath(); ctx.arc(Math.cos(a) * 18, -60 + Math.sin(a) * 18, 14, 0, TAU); ctx.fill(); } ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(0, -60, 10, 0, TAU); ctx.fill(); ctx.restore(); } } },
      post: () => { let hole = null; if (t > tC && src){ const r = Math.pow(t - tC, 1.6) * 900; hole = [src[0], src[1], r]; if (r > 2300) amt = 0; }
        desat(ctx, amt, hole, amt > .3 ? "#6A7A8C" : null); if (amt > .3 && !hole) TT.CS.grade = { warm: 0, vig: .5 }; },
      over: () => {
        if (t > tS){ const S = Object.assign({ label: "TABUNGAN", p: .32, y: 470 }, Md.snail), k = t - tS, q = eBack(clamp(k / .45, 0, 1)), p = S.p + k * .004 + (t > tCoin + .5 ? .01 : 0), W = 760, x0 = 540 - W / 2;
          ctx.save(); ctx.translate(540, S.y); ctx.scale(q, q); ctx.translate(-540, -S.y);
          font(ctx, 900, 40, FAM); ctx.fillStyle = CREAM; ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineJoin = "round"; ctx.textAlign = "right"; ctx.strokeText(S.label, x0 + W, S.y - 62); ctx.fillText(S.label, x0 + W, S.y - 62); ctx.textAlign = "left";
          rr(ctx, x0, S.y - 36, W, 72, 36); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fill(); ol(ctx, 6); rr(ctx, x0 + 8, S.y - 28, (W - 16) * p, 56, 28); ctx.fillStyle = "#9DB0A0"; ctx.fill();
          const sx = x0 + 8 + (W - 16) * p, sy = S.y - 36; ctx.save(); ctx.translate(sx, sy); ctx.fillStyle = "#C9B79A"; ctx.beginPath(); ctx.ellipse(0, -10, 54, 14, 0, 0, TAU); ctx.fill(); ol(ctx, 5);
          ctx.beginPath(); ctx.arc(-6, -40, 34, 0, TAU); ctx.fillStyle = "#B07A4A"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); for (let a = 0; a < 9; a += .3) ctx.lineTo(-6 + Math.cos(a) * a * 3.4, -40 + Math.sin(a) * a * 3.4); ctx.stroke();
          ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(40, -16); ctx.lineTo(52, -54); ctx.moveTo(48, -16); ctx.lineTo(66, -48); ctx.stroke(); ctx.fillStyle = OUT; [[52, -54], [66, -48]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 5, 0, TAU); ctx.fill(); });
          for (let z = 0; z < 3; z++){ const u = ((t * .5 + z / 3) % 1); ctx.globalAlpha = Math.sin(u * Math.PI); font(ctx, 900, 30 + z * 6, FAM); ctx.fillStyle = CREAM; ctx.fillText("z", 30 + u * 40 + z * 10, -80 - u * 60); } ctx.restore();
          if (t > tCoin){ const d = t - tCoin, cy = d < .5 ? lerp(S.y - 400, S.y - 50, eIn(d / .5)) : S.y - 50 - Math.abs(Math.sin((d - .5) * 6)) * 80 * Math.exp(-(d - .5) * 3); ctx.save(); ctx.translate(x0 + W * .2, cy); ctx.scale(Math.cos(t * 8), 1); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.restore(); }
          ctx.restore(); }
        if (t > tN){ const N = Md.num, k = t - tN, q = eBack(clamp(k / .4, 0, 1)), v = Math.round(lerp(0, N.to, eOut(clamp(k / 1.2, 0, 1)))); ctx.save(); ctx.translate(540, 440); ctx.scale(q, q);
          for (let r = 0; r < 12; r++){ const a = r / 12 * TAU + t * .5; ctx.fillStyle = hexA(GOLD, .3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 360, a, a + .14); ctx.closePath(); ctx.fill(); }
          TT.outlineWords(ctx, [{ w: v + (N.suffix || ""), hl: true }], 0, 70, 220, { sw: 46 });
          if (N.label){ fit(ctx, N.label, 520, 44, 900); const w = ctx.measureText(N.label).width + 60; rr(ctx, -w / 2, 110, w, 76, 38); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(N.label, 0, 163); ctx.textAlign = "left"; }
          ctx.restore(); if (k < 1) burstFx(ctx, 540, 440, k - .2, GOLD, 16, 360); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Md = f.mood || {}; if (Md.grayCue) add(cueT(s, Md.grayCue, .3, i), "whoosh"); if (Md.colorCue){ add(cueT(s, Md.colorCue, .2, i), "whoosh"); add(cueT(s, Md.colorCue, .2, i) + .3, "chime"); }
    if (Md.snail) add(tOf(s, Md.snail, .3, i), "pop"); if (Md.coinCue) add(cueT(s, Md.coinCue, .3, i) + .5, "ping"); if (Md.num) add(tOf(s, Md.num, .2, i), "chime"); });

  /* ================= cg_finis: path to the finish arch ================= */
  // f.finish: {hero, flags:[{x, label}], archX, archNear, archLabel, nearCue, coinCue, startX}
  TT.scene("cg_finis", "Cerita: menuju garis finis", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Fi = Object.assign({ hero: 0, archX: 2300, archNear: 1700, archLabel: "KURSUS DESAIN", startX: 520, flags: [] }, f.finish || {});
    const tNear = T(s, Fi.nearCue, .3, idx), tCoin = T(s, Fi.coinCue, .3, idx), ax = lerp(Fi.archX, Fi.archNear, eOut(clamp((t - tNear) / 1.2, 0, 1)));
    let heroX = 0;
    base(ctx, s, t, { env: "beach", envOpt: { palmX: -400 },
      spots: { arch: () => [ax, 900, .8] },
      back: (ctx2, c, sts) => { const st = sts[Fi.hero]; heroX = st ? st.x : 0;
        // footprints + coins
        for (let x = Fi.startX - 900; x < heroX - 60; x += 95){ const i = Math.round(x / 95); ctx.fillStyle = "rgba(140,96,60,.35)"; ctx.beginPath(); ctx.ellipse(x, GROUND - 4 + (i % 2) * 14, 26, 10, 0, 0, TAU); ctx.fill();
          if (x > Fi.startX && t > tCoin){ const passT = tCoin + 0; const k = t - passT - (x - Fi.startX) / 400; if (k > 0 && k < 1.6){ const y = GROUND - 30 - Math.sin(clamp(k / 1.2, 0, 1) * Math.PI * .5) * 300; ctx.save(); ctx.globalAlpha = clamp((1.6 - k) / .4, 0, 1); ctx.translate(x, y); ctx.scale(Math.cos(t * 9 + i), 1);
              ctx.beginPath(); ctx.arc(0, 0, 32, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#C9962B"; font(ctx, 900, 30, FAM); ctx.textAlign = "center"; ctx.fillText("Rp", 0, 10); ctx.textAlign = "left"; ctx.restore(); sparkle(ctx, x + 30, y - 30, 14, CREAM); } } }
        // flags
        Fi.flags.forEach((fl, j) => { const sw = Math.sin(t * 3 + j) * .12; ctx.fillStyle = "#6B4A30"; rr(ctx, fl.x - 8, GROUND - 520, 16, 520, 6); ctx.fill(); ol(ctx, 4);
          ctx.save(); ctx.translate(fl.x + 8, GROUND - 510); ctx.transform(1, sw, 0, 1, 0, 0); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(220, 20 + Math.sin(t * 4 + j) * 8); ctx.lineTo(0, 130); ctx.closePath(); ctx.fillStyle = fl.hl ? ORANGE : CREAM; ctx.fill(); ol(ctx, 5);
          fit(ctx, fl.label, 150, 38, 900); ctx.fillStyle = fl.hl ? CREAM : BROWN; ctx.fillText(fl.label, 14, 76); ctx.restore(); });
        // arch
        ctx.save(); ctx.translate(ax, GROUND); [-300, 300].forEach(dx => { ctx.fillStyle = "#FFFFFF"; rr(ctx, dx - 26, -820, 52, 820, 10); ctx.fill(); ol(ctx, 5); for (let k = 0; k < 8; k++){ ctx.fillStyle = k % 2 ? ORANGE : "#FFFFFF"; ctx.fillRect(dx - 24, -800 + k * 100, 48, 50); } });
        rr(ctx, -360, -940, 720, 170, 24); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7); for (let k = 0; k < 18; k++){ ctx.fillStyle = k % 2 ? OUT : "#FFFFFF"; ctx.fillRect(-340 + k * 38, -800, 38, 18); }
        fit(ctx, Fi.archLabel, 640, 70, 900); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(Fi.archLabel, 0, -838); ctx.textAlign = "left";
        glowAt(ctx, 0, -500, 520, "#FFE3A0", .25 + .1 * Math.sin(t * 3)); ctx.restore(); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Fi = f.finish || {}; if (Fi.nearCue) add(cueT(s, Fi.nearCue, .3, i), "whoosh"); if (Fi.coinCue){ const a = cueT(s, Fi.coinCue, .3, i); for (let k = 0; k < 4; k++) add(a + .3 + k * .35, "ping"); } });
})();
