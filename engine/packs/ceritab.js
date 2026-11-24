/* Scene pack ceritab: story scenes for MODE CERITA ("motion": {"mode": "cerita"}). Layout prefix cb_.
   Every cb_ scene takes the same base fields as the generic "cerita" layout
   (env, envOpt, toons[], cam[], props[], cards[], stamp, front) plus its own set piece:
     cb_loket  service counter / guard booth with hanging sign and a status screen that flips (f.counter)
     cb_sapa   greeting: a big name tag flies out of a toon, warm glow + hearts when the name is spoken (f.tag, f.warm)
     cb_layar  big monitor with a spreadsheet: messy cells shake red, duplicate rows flagged, cells flip to a uniform format (f.sheet)
     cb_pikir  thought cloud above a toon (items pop in, then fog into "?") or chips orbiting the head (f.think)
     cb_hp     giant phone held in a hand: app pages with chat messages, rows, status stamp, toggle; buzzes (f.phone)
     cb_catat  big spiral notepad: lines are hand-written with a moving pencil, boxes get ticked (f.note)
     cb_kamar  bedroom at night: bed, nightstand clock whose time changes, phone glow, optional orbiting thoughts (f.room, f.think)
   Camera keys may use on:"<spot>" for the set piece (e.g. "sheet", "phone", "note", "sign", "cloud", "tag"). */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, G, TAU } = TT;
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const T = (s, cue, fr, i) => cueT(s, cue, fr, i);
  const kt = (s, k, j, i, fr) => k == null ? 1e9 : (k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, fr ?? .2 + j * .12, i) : 1e9));
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr, i) : (o.T ?? 1e9)));
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.stroke(); };
  const ico = (ctx, name, cx, cy, size, col, lw) => icon(ctx, name, cx - size / 2, cy - size / 2, size, col, lw || 2.4);
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 18)) return size; size -= 2; } }
  function wrap(ctx, txt, maxW){ const ws = String(txt).split(" "), L = []; let cur = "";
    ws.forEach(w => { const n = cur ? cur + " " + w : w; if (ctx.measureText(n).width > maxW && cur){ L.push(cur); cur = w; } else cur = n; }); if (cur) L.push(cur); return L; }
  function heart(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.moveTo(0, r * .9); ctx.bezierCurveTo(-r * 1.6, -r * .2, -r * .7, -r * 1.3, 0, -r * .45); ctx.bezierCurveTo(r * .7, -r * 1.3, r * 1.6, -r * .2, 0, r * .9); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = r * .16; ctx.stroke(); ctx.restore(); }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, rr2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : "#F6D36B"); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stamp(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .32, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .92); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }

  /* ---------- shared base: same data as the generic "cerita" layout + hooks ---------- */
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    const spots = H.spots || {};
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || H.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => toon(ctx, c, a, s, t, { st: sts[j] }) }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.over) TT.CS.ov.push(() => H.over(ctx, c, sts));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts };
  }
  function sfxBase(s, f, i, add){
    const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
    (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
    (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
    (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
    (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= cb_loket: counter / guard booth ================= */
  TT.scene("cb_loket", "Cerita: loket / pos jaga", (ctx, th, s, t) => {
    const f = s.f || {}, C = Object.assign({ x: 560, w: 780, sign: "LOKET", icon: "users", color: "#2F6F73", top: "#E9D6B8", signY: 610, h: 350 }, f.counter || {}), idx = G.scene;
    const topY = GROUND - C.h, x0 = C.x - C.w / 2;
    const states = (C.states || []).map((q, j) => Object.assign({}, q, { T: tOf(s, q, .3 + j * .2, idx) })).filter(q => q.T <= t);
    const cur = states[states.length - 1];
    const scr = [C.x + (C.screenDx ?? C.w * .26), topY - 110];
    base(ctx, s, t, { env: "office", spots: { sign: [C.x, C.signY + 40, 1.35], screen: [scr[0], scr[1], 1.6], counter: [C.x, topY - 120, 1.2] },
      back: (ctx2) => {
        if (C.booth){ // booth: pillars + striped awning roof
          const rY = C.signY - 120; ctx.fillStyle = "#7A4A2E"; [x0 + 20, x0 + C.w - 50].forEach(px => { rr(ctx, px, rY, 30, topY - rY, 6); ctx.fill(); ol(ctx, 5); });
          ctx.fillStyle = "#F3E6D2"; rr(ctx, x0 + 50, rY + 60, C.w - 100, topY - rY - 60, 8); ctx.fill(); ctx.fillStyle = hexA("#BFE2EA", .55); rr(ctx, x0 + 80, rY + 120, C.w - 160, topY - rY - 150, 10); ctx.fill();
        }
      },
      mid: (ctx2) => {
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(C.x, GROUND + 6, C.w * .56, 26, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = C.color; rr(ctx, x0, topY + 26, C.w, C.h - 26, 10); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = hexA("#FFFFFF", .12); for (let k = 1; k < 4; k++) ctx.fillRect(x0 + C.w * k / 4 - 4, topY + 40, 8, C.h - 60);
        ctx.fillStyle = C.top; rr(ctx, x0 - 30, topY, C.w + 60, 40, 12); ctx.fill(); ol(ctx, 6);
        // emblem on the front
        const ex = C.x - C.w * .18, ey = topY + C.h * .5; ctx.beginPath(); ctx.arc(ex, ey, 62, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6); ico(ctx, C.icon, ex, ey, 70, ORANGE, 2.6);
        // paper tray + bell
        ctx.fillStyle = PAPER; ctx.save(); ctx.translate(C.x - C.w * .36, topY - 6); ctx.rotate(-.05); ctx.fillRect(-70, -14, 140, 14); ctx.fillStyle = "#F3E6D2"; ctx.fillRect(-64, -22, 130, 9); ctx.restore();
        const bt = t - (cur ? cur.T : -9), bj = bt >= 0 && bt < .4 ? Math.sin(bt * 40) * 4 * (1 - bt / .4) : 0;
        ctx.fillStyle = "#E8B23A"; ctx.beginPath(); ctx.arc(C.x - C.w * .02, topY - 4 + bj, 30, Math.PI, 0); ctx.fill(); ol(ctx, 5); ctx.fillStyle = OUT; ctx.fillRect(C.x - C.w * .02 - 5, topY - 42 + bj, 10, 10);
        // status screen on the counter (faces the viewer)
        if (C.states){ const sw = C.screenW || 360, sh = 180; ctx.save(); ctx.translate(scr[0], scr[1]);
          ctx.fillStyle = "#3B3631"; ctx.fillRect(-12, sh / 2 - 4, 24, 40); rr(ctx, -60, sh / 2 + 30, 120, 14, 6); ctx.fill();
          rr(ctx, -sw / 2, -sh / 2, sw, sh, 14); ctx.fillStyle = "#2A2623"; ctx.fill(); ol(ctx, 6);
          const k = cur ? t - cur.T : -1, ok = cur && cur.ok, col = !cur ? "#5A6B78" : ok ? GREEN : RED, blink = cur && !ok ? (Math.sin(t * 10) > -.2 ? 1 : .55) : 1;
          rr(ctx, -sw / 2 + 12, -sh / 2 + 12, sw - 24, sh - 24, 8); ctx.fillStyle = hexA(col, .95 * blink); ctx.fill();
          if (cur){ const pq = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.scale(pq, pq); const txt = cur.text || "";
            ico(ctx, ok ? "check" : "alert", -sw / 2 + 52, 0, 46, "#FFFFFF", 3); const sz = fit(ctx, txt, sw - 110, 44, 900, 18); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(txt, 26, sz * .36); ctx.textAlign = "left"; ctx.restore();
            if (!ok && k < 1.6) for (let r = 0; r < 3; r++){ const w = ((k * 1.3 + r / 3) % 1); ctx.strokeStyle = hexA(RED, .6 * (1 - w)); ctx.lineWidth = 6; rr(ctx, -sw / 2 - w * 50, -sh / 2 - w * 50, sw + w * 100, sh + w * 100, 20); ctx.stroke(); }
            if (ok) burstFx(ctx, 0, 0, k, GREEN, 10, 170); }
          else { ctx.fillStyle = hexA("#FFFFFF", .5 + .3 * Math.sin(t * 4)); for (let d = 0; d < 3; d++){ ctx.beginPath(); ctx.arc(-30 + d * 30, 0, 9, 0, TAU); ctx.fill(); } }
          ctx.restore(); }
      },
      midZ: .5,
      front: (ctx2) => { // sign (hangs above the counter / on the booth roof)
        const q = eBack(clamp((t - (C.signAt ?? .15)) / .5, 0, 1)); if (q <= 0) return; const rot = Math.sin(t * 1.7) * .025;
        font(ctx, 900, 64, FAM); const tw = ctx.measureText(C.sign).width, w = Math.max(360, tw + 170), h = 118, sy = C.signY;
        ctx.save(); ctx.translate(C.x, sy - 140); ctx.rotate(rot); ctx.scale(q, q);
        if (C.booth){ ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-C.w / 2 - 60, 30); ctx.lineTo(C.w / 2 + 60, 30); ctx.lineTo(C.w / 2 + 20, 150); ctx.lineTo(-C.w / 2 - 20, 150); ctx.closePath(); ctx.fill(); ol(ctx, 6);
          for (let k = 0; k < 8; k++){ ctx.fillStyle = k % 2 ? CREAM : ORANGE; const xa = -C.w / 2 - 20 + k * (C.w + 40) / 8; ctx.beginPath(); ctx.arc(xa + (C.w + 40) / 16, 150, (C.w + 40) / 16, 0, Math.PI); ctx.fill(); ol(ctx, 4); } }
        else { ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w / 3, -300); ctx.lineTo(-w / 3, 140 - h / 2); ctx.moveTo(w / 3, -300); ctx.lineTo(w / 3, 140 - h / 2); ctx.stroke(); }
        ctx.translate(0, 140); rr(ctx, -w / 2, -h / 2, w, h, 20); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); rr(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 14); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.stroke();
        ctx.beginPath(); ctx.arc(-w / 2 + 72, 0, 38, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ico(ctx, C.icon, -w / 2 + 72, 0, 46, "#FFFFFF", 2.6);
        font(ctx, 900, 64, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(C.sign, 36, 22); ctx.textAlign = "left"; ctx.restore();
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const C = f.counter || {}; add((C.signAt ?? .15) + .1, "pop");
    (C.states || []).forEach((q, j) => add(tOf(s, q, .3 + j * .2, i), q.ok ? "chime" : "ping")); });

  /* ================= cb_sapa: name tag + warmth ================= */
  TT.scene("cb_sapa", "Cerita: sapaan dengan nama", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, tg = f.tag || {}, wm = f.warm || {};
    const tT = tOf(s, tg, .4, idx), tOut = tg.outCue ? T(s, tg.outCue, .9, idx) : 1e9, wT = tOf(s, wm, .5, idx);
    const toons = f.toons || [];
    const anchor = (j) => { const a = toons[j || 0]; if (!a) return [540, 1000, 760]; const st = toonState(a, s, t), hp = toonHead(st); return [hp[0], hp[1], st.size, st]; };
    const A = anchor(tg.on ?? 1), B = anchor(wm.on ?? (tg.on ?? 1));
    const tagPos = () => { const k = t - tT, q = eOut(clamp(k / .7, 0, 1)); const sx = A[0], sy = A[1] + A[2] * .42, ex = A[0] + (tg.dx ?? 0), ey = A[1] - A[2] * .5;
      return [lerp(sx, ex, q), lerp(sy, ey, q) - Math.sin(q * Math.PI) * 120, q, k]; };
    base(ctx, s, t, { env: "office", spots: { tag: [A[0] + (tg.dx ?? 0), A[1] - A[2] * .35, 1.3], warm: [B[0], B[1], 1.25] },
      back: () => { if (t >= wT){ const k = t - wT, pu = 1 + .08 * Math.sin(t * 5); glowAt(ctx, B[0], B[1] + 40, 460 * pu * eOut(clamp(k / .6, 0, 1)), "#FFC27A", .55);
          for (let r = 0; r < 3; r++){ const w = ((k * .55 + r / 3) % 1); ctx.strokeStyle = hexA("#F4A85C", .45 * (1 - w)); ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(B[0], B[1] + 30, 160 + w * 330, 0, TAU); ctx.stroke(); } }
        if (f.cold && t < wT){ const k = t - tOf(s, f.cold, .1, idx); if (k > 0){ ctx.save(); ctx.globalAlpha = clamp(k / .4, 0, 1) * .75; for (let i = 0; i < 5; i++){ const x = B[0] - 160 + i * 80, y = B[1] - B[2] * .38 - ((t * 40 + i * 37) % 80); ctx.fillStyle = "#9AA6B2"; ctx.beginPath(); ctx.arc(x, y, 22 + 6 * Math.sin(t * 2 + i), 0, TAU); ctx.fill(); } ctx.restore(); } } },
      front: () => {
        if (t >= wT){ const k = t - wT; for (let i = 0; i < 14; i++){ const life = 2.2, tt = (k - i * .18); if (tt < 0) continue; const q = (tt % life) / life; if (k > 6 && tt > life) continue;
            const x = B[0] + (rnd(i) - .5) * 520 + Math.sin(q * 6 + i) * 30, y = B[1] + 60 - q * 560; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); heart(ctx, x, y, 22 + rnd(i + 4) * 18, i % 3 ? "#E8604C" : HL); ctx.restore(); }
          burstFx(ctx, B[0], B[1], k, HL, 12, 260); }
        if (t >= tT && t < tOut + .35){ const [x, y, q, k] = tagPos(), out = clamp((t - tOut) / .35, 0, 1), sc = (.35 + .65 * eBack(clamp(k / .7, 0, 1))) * (1 - out);
          const txt = (tg.text || "NAMA").toUpperCase(); font(ctx, 900, 84, FAM); const w = Math.max(380, ctx.measureText(txt).width + 110), h = 210;
          ctx.save(); ctx.translate(x, y + Math.sin(t * 2.4) * 6); ctx.rotate(-.05 + Math.sin(t * 1.8) * .03); ctx.scale(sc, sc);
          for (let r = 0; r < 12; r++){ const a = r / 12 * TAU + t * .4; ctx.fillStyle = hexA("#F6D36B", .22); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, w * .85, a, a + .16); ctx.closePath(); ctx.fill(); }
          ctx.shadowColor = "rgba(30,18,11,.35)"; ctx.shadowOffsetY = 12; rr(ctx, -w / 2, -h / 2, w, h, 22); ctx.fillStyle = PAPER; ctx.fill(); ctx.shadowColor = "transparent"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke();
          ctx.save(); rr(ctx, -w / 2, -h / 2, w, 70, [22, 22, 0, 0]); ctx.fillStyle = tg.color || ORANGE; ctx.fill(); ctx.restore(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 70); ctx.lineTo(w / 2, -h / 2 + 70); ctx.stroke();
          font(ctx, 800, 34, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(tg.head || "HALO, NAMA SAYA", 0, -h / 2 + 48);
          fit(ctx, txt, w - 60, 84, 900); ctx.fillStyle = BROWN; ctx.fillText(txt, 0, 70); ctx.textAlign = "left"; ctx.restore();
          if (k < .9) burstFx(ctx, x, y, k - .45, HL, 10, 240); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); if (f.tag) add(tOf(s, f.tag, .4, i), "whoosh"), add(tOf(s, f.tag, .4, i) + .5, "chime"); if (f.warm) add(tOf(s, f.warm, .5, i), "chime"); });

  /* ================= cb_layar: monitor with a spreadsheet ================= */
  TT.scene("cb_layar", "Cerita: layar tabel", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, S = Object.assign({ x: 690, y: 540, w: 700, h: 600, title: "Rekap", cols: ["Nama", "Tanggal"], colW: [.56, .44], rows: [] }, f.sheet || {});
    const x0 = S.x - S.w / 2, deskY = S.y + S.h + 130, night = (f.envOpt || {}).time === "night";
    const tShow = tOf(s, S.show || { at: .2 }, .1, idx), tBad = S.badCue ? T(s, S.badCue, .4, idx) : 1e9, tDup = S.dupCue ? T(s, S.dupCue, .4, idx) : 1e9, tFix = S.fixCue ? T(s, S.fixCue, .4, idx) : 1e9;
    const tErr = S.err ? tOf(s, S.err, .6, idx) : 1e9, tErrOut = S.err && S.err.outCue ? T(s, S.err.outCue, .9, idx) : (tFix < 1e9 ? tFix : 1e9), tOk = S.ok ? tOf(s, S.ok, .8, idx) : 1e9;
    base(ctx, s, t, { env: "office", envOpt: { desk: false }, spots: { sheet: [S.x, S.y + S.h * .5, 1.45], sheetTop: [S.x, S.y + S.h * .32, 1.7] },
      back: () => {
        glowAt(ctx, S.x, S.y + S.h / 2, S.w * .95, night ? "#9FD3E8" : "#FFF0D6", night ? .35 : .25);
        // desk
        ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(S.x, GROUND + 6, 520, 24, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#8E4E2E"; [S.x - 470, S.x + 430].forEach(dx => { rr(ctx, dx, deskY, 34, GROUND - deskY, 6); ctx.fill(); ol(ctx, 5); });
        ctx.fillStyle = "#C47A48"; rr(ctx, S.x - 520, deskY - 10, 1040, 46, 12); ctx.fill(); ol(ctx, 6);
        // stand
        ctx.fillStyle = "#3B3631"; rr(ctx, S.x - 26, S.y + S.h, 52, 130, 6); ctx.fill(); ol(ctx, 5); rr(ctx, S.x - 120, deskY - 26, 240, 22, 10); ctx.fill(); ol(ctx, 5);
        // keyboard + mug
        ctx.fillStyle = "#E9E2D6"; rr(ctx, S.x - 190, deskY - 22, 300, 20, 6); ctx.fill(); ol(ctx, 4);
        ctx.save(); ctx.translate(S.x + 330, deskY - 10); ctx.fillStyle = CREAM; rr(ctx, -28, -66, 56, 66, 8); ctx.fill(); ol(ctx, 5); ctx.fillStyle = ORANGE; ctx.fillRect(-24, -46, 48, 12);
        for (let k = 0; k < 3; k++){ const q = ((t * .5 + k / 3) % 1); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-8 + k * 8, -74 - q * 70); ctx.quadraticCurveTo(-20 + k * 8 + Math.sin(q * 6) * 10, -96 - q * 70, -6 + k * 8, -116 - q * 70); ctx.stroke(); } ctx.globalAlpha = 1; ctx.restore();
        // monitor
        const sh = t > tBad && t < tBad + .5 ? Math.sin(t * 70) * 10 * (1 - (t - tBad) / .5) : 0;
        ctx.save(); ctx.translate(sh, 0);
        rr(ctx, x0 - 24, S.y - 24, S.w + 48, S.h + 48, 26); ctx.fillStyle = "#2A2623"; ctx.fill(); ol(ctx, 7);
        rr(ctx, x0, S.y, S.w, S.h, 10); ctx.fillStyle = "#FBFAF6"; ctx.fill();
        ctx.save(); rr(ctx, x0, S.y, S.w, S.h, 10); ctx.clip();
        // title bar
        ctx.fillStyle = S.barColor || "#2F7D4F"; ctx.fillRect(x0, S.y, S.w, 64); ctx.fillStyle = "#FFFFFF"; font(ctx, 800, 30, FAM); ctx.fillText(S.title, x0 + 70, S.y + 43); ico(ctx, "chart", x0 + 38, S.y + 32, 32, "#FFFFFF", 2.6);
        [0, 1, 2].forEach(d => { ctx.fillStyle = hexA("#FFFFFF", .6); ctx.beginPath(); ctx.arc(x0 + S.w - 34 - d * 30, S.y + 32, 8, 0, TAU); ctx.fill(); });
        const rh = S.rowH || 78, hy = S.y + 64, cx = [x0 + 60]; S.colW.forEach((w, j) => cx.push(cx[j] + (S.w - 60) * w));
        ctx.fillStyle = "#EFE6D8"; ctx.fillRect(x0, hy, S.w, rh * .8); ctx.fillStyle = BROWN; font(ctx, 800, 28, FAM); S.cols.forEach((cn, j) => ctx.fillText(cn.toUpperCase(), cx[j] + 16, hy + rh * .55));
        const y1 = hy + rh * .8;
        S.rows.forEach((r, i) => {
          const ti = tShow + i * .14, q = clamp((t - ti) / .3, 0, 1); if (q <= 0) return; const y = y1 + i * rh;
          ctx.save(); ctx.globalAlpha = q; ctx.translate((1 - eOut(q)) * 60, 0);
          ctx.fillStyle = i % 2 ? "#FFFFFF" : "#F7F2EA"; ctx.fillRect(x0, y, S.w, rh);
          ctx.fillStyle = "#A08A74"; font(ctx, 700, 24, FAM); ctx.textAlign = "center"; ctx.fillText(String(i + 2), x0 + 30, y + rh * .6); ctx.textAlign = "left";
          const fixT = tFix + i * .32, fq = clamp((t - fixT) / .3, 0, 1);
          r.c.forEach((txt, j) => {
            const bad = (r.bad || []).includes(j), isBad = bad && t >= tBad && fq < .5, wob = isBad && t < tBad + 1.2 ? Math.sin(t * 50 + i) * 4 : 0;
            const shown = fq >= .5 && r.fix ? r.fix[j] : txt, flip = Math.abs(Math.cos(fq * Math.PI)), cw = cx[j + 1] - cx[j];
            if (isBad){ ctx.fillStyle = hexA(RED, .22 + .12 * Math.sin(t * 8)); ctx.fillRect(cx[j] + 4, y + 6, cw - 8, rh - 12); }
            if (fq >= .5 && r.fix && (bad || r.fix[j] !== txt)){ ctx.fillStyle = hexA(GREEN, .18); ctx.fillRect(cx[j] + 4, y + 6, cw - 8, rh - 12); }
            ctx.save(); ctx.translate(cx[j] + 16 + wob, y + rh / 2); ctx.scale(1, fq > 0 && fq < 1 ? Math.max(.05, flip) : 1);
            const sz = fit(ctx, shown, cw - 34, 34, 700, 20); ctx.fillStyle = isBad ? "#A3261C" : BROWN; ctx.fillText(shown, 0, sz * .36); ctx.restore();
          });
          if (fq >= 1 && r.fix){ const k = t - fixT - .3, pq = eBack(clamp(k / .3, 0, 1)); ctx.save(); ctx.translate(x0 + S.w - 34, y + rh / 2); ctx.scale(pq, pq); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ico(ctx, "check", 0, 0, 30, "#FFFFFF", 3.2); ctx.restore(); }
          ctx.strokeStyle = "#E3D6C4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y + rh); ctx.lineTo(x0 + S.w, y + rh); ctx.stroke(); ctx.restore();
        });
        ctx.strokeStyle = "#E3D6C4"; ctx.lineWidth = 2; cx.slice(1, -1).forEach(xx => { ctx.beginPath(); ctx.moveTo(xx, hy); ctx.lineTo(xx, y1 + S.rows.length * rh); ctx.stroke(); });
        // duplicate bracket
        if (t >= tDup && t < tFix + .3){ const dr = S.rows.map((r, i) => r.dup ? i : -1).filter(i => i >= 0); if (dr.length){ const k = t - tDup, q = eBack(clamp(k / .4, 0, 1)), ya = y1 + dr[0] * rh + 8, yb = y1 + (dr[dr.length - 1] + 1) * rh - 8;
          ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.setLineDash([16, 10]); ctx.lineDashOffset = -t * 40; rr(ctx, x0 + 8, ya, (cx[1] - x0) * q + (S.w * .5) * 0, yb - ya, 12); ctx.stroke(); ctx.setLineDash([]);
          ctx.save(); ctx.translate(cx[1] - 50, (ya + yb) / 2); ctx.scale(q, q); ctx.rotate(.12); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); font(ctx, 900, 38, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(S.dupText || (dr.length + "x"), 0, 13); ctx.textAlign = "left"; ctx.restore(); } }
        ctx.restore(); // clip
        // banners on the screen bottom
        const banner = (txt, col, k, out, icn) => { if (k < 0 || out > 1) return; const q = eBack(clamp(k / .35, 0, 1)) * (1 - out); font(ctx, 900, 40, FAM); const w = Math.min(S.w - 40, ctx.measureText(txt).width + 120);
          ctx.save(); ctx.translate(S.x, S.y + S.h - 70); ctx.scale(q, q); ctx.rotate(-.03); rr(ctx, -w / 2, -42, w, 84, 18); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6); ico(ctx, icn, -w / 2 + 48, 0, 40, "#FFFFFF", 3);
          fit(ctx, txt, w - 110, 40, 900); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(txt, 24, 14); ctx.textAlign = "left"; ctx.restore(); };
        if (S.err) banner(S.err.text || "#ERROR", RED, t - tErr, clamp((t - tErrOut) / .3, 0, 1), "alert");
        if (S.ok) banner(S.ok.text || "REKAP SELESAI", GREEN, t - tOk, 0, "check");
        if (S.ok) burstFx(ctx, S.x, S.y + S.h - 70, t - tOk, GREEN, 12, 260);
        ctx.restore();
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.sheet || {};
    add(tOf(s, S.show || { at: .2 }, .1, i), "whoosh"); if (S.badCue) add(T(s, S.badCue, .4, i), "ping"); if (S.dupCue) add(T(s, S.dupCue, .4, i), "pop");
    if (S.fixCue){ const t0 = T(s, S.fixCue, .4, i); (S.rows || []).forEach((r, k) => { if (r.fix) add(t0 + k * .32 + .3, "pop"); }); }
    if (S.err) add(tOf(s, S.err, .6, i), "ping"); if (S.ok) add(tOf(s, S.ok, .8, i), "chime"); });

  /* ================= thoughts: cloud or orbit ================= */
  function chip(ctx, it, x, y, sc, a, dark){
    if (sc <= .01) return; const lab = it.label || "", hasI = !!it.icon; font(ctx, 800, 38, FAM); const w = Math.max(hasI && !lab ? 110 : 150, ctx.measureText(lab).width + (hasI ? 110 : 60)), h = 92;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(it.rot ?? 0); ctx.globalAlpha *= a;
    rr(ctx, -w / 2, -h / 2, w, h, 46); ctx.fillStyle = it.bad ? "#FCE3DE" : (dark ? "#FFF4E6" : PAPER); ctx.fill(); ctx.strokeStyle = it.bad ? RED : OUT; ctx.lineWidth = 6; ctx.stroke();
    let tx = 0; if (hasI){ const ix = lab ? -w / 2 + 50 : 0; ctx.beginPath(); ctx.arc(ix, 0, 32, 0, TAU); ctx.fillStyle = it.bad ? RED : ORANGE; ctx.fill(); ico(ctx, it.icon, ix, 0, 38, "#FFFFFF", 2.6); tx = 30; }
    if (lab){ ctx.fillStyle = it.bad ? "#A3261C" : BROWN; ctx.textAlign = "center"; font(ctx, 800, 38, FAM); ctx.fillText(lab, tx, 13); ctx.textAlign = "left"; }
    ctx.restore(); }
  function orbit(ctx, s, t, th0, head, behind, idx){
    const its = th0.items || [], tS = th0.stressCue ? T(s, th0.stressCue, .5, idx) : 1e9, ph = t * (th0.speed || .9) + Math.max(0, t - tS) * 1.6, rx = th0.rx || 400, ry = th0.ry || 120;
    its.forEach((it, j) => { const ti = tOf(s, it.at != null || it.cue ? it : { at: .3 + j * .25 }, .2 + j * .12, idx); if (t < ti) return;
      const a = ph + j / its.length * TAU, sn = Math.sin(a); if ((sn < 0) !== behind) return; const q = eBack(clamp((t - ti) / .4, 0, 1));
      const x = head[0] + Math.cos(a) * rx, y = head[1] - (th0.dy ?? 150) + sn * ry, sc = (.78 + .22 * sn) * q * (th0.scale || 1.25);
      chip(ctx, Object.assign({ rot: Math.cos(a) * .12 }, it), x, y, sc, behind ? .8 : 1); });
    if (t > tS && !behind){ const k = t - tS; for (let i = 0; i < 6; i++){ const a = i / 6 * TAU + t * 2; ctx.strokeStyle = hexA(OUT, .7); ctx.lineWidth = 7; ctx.lineCap = "round"; const r0 = 200 + 20 * Math.sin(t * 9 + i);
        ctx.beginPath(); ctx.moveTo(head[0] + Math.cos(a) * r0, head[1] - 60 + Math.sin(a) * r0 * .6); ctx.lineTo(head[0] + Math.cos(a) * (r0 + 40), head[1] - 60 + Math.sin(a) * (r0 + 40) * .6); ctx.stroke(); } }
  }
  function cloudShape(ctx, cx, cy, w, h, wob){ ctx.beginPath(); const n = 10; for (let k = 0; k < n; k++){ const a = k / n * TAU, px = cx + Math.cos(a) * w * .5, py = cy + Math.sin(a) * h * .5, r = (k % 2 ? .2 : .25) * Math.min(w, h) * (1 + .03 * Math.sin(wob + k)); ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, TAU); } ctx.moveTo(cx + w * .5, cy); ctx.ellipse(cx, cy, w * .5, h * .5, 0, 0, TAU); }

  TT.scene("cb_pikir", "Cerita: awan pikiran / pikiran berputar", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, th0 = Object.assign({ on: 0, mode: "cloud" }, f.think || {}), toons = f.toons || [];
    const a = toons[th0.on] || toons[0]; const st = a ? toonState(a, s, t) : null; const head = st ? toonHead(st) : [540, 1040];
    const cw = th0.w || 700, chh = th0.h || 460, cx = th0.x ?? 560, cy = th0.y ?? 560, tC = tOf(s, th0.cloud || { at: .2 }, .1, idx), tFog = th0.fogCue ? T(s, th0.fogCue, .5, idx) : 1e9;
    base(ctx, s, t, { env: "office", spots: { cloud: [cx, cy + 40, 1.25], head: [head[0], head[1] - 100, 1.2] },
      back: () => { if (th0.mode === "orbit") orbit(ctx, s, t, th0, head, true, idx); },
      front: () => {
        if (th0.mode === "orbit"){ orbit(ctx, s, t, th0, head, false, idx); return; }
        const k = t - tC, tO = th0.outCue ? T(s, th0.outCue, .8, idx) : 1e9; if (k < 0 || t > tO + .4) return; const q = eBack(clamp(k / .5, 0, 1)) * (1 - eOut(clamp((t - tO) / .4, 0, 1))), fog = clamp((t - tFog) / .8, 0, 1), dir = Math.sign(cx - head[0]) || 1;
        // trail bubbles from head to cloud
        [0, 1, 2].forEach(j => { const qq = clamp((k - j * .08) / .3, 0, 1); if (qq <= 0) return; const px = lerp(head[0] + dir * 120, cx - dir * cw * .25, (j + 1) / 4), py = lerp(head[1] - 200, cy + chh * .45, (j + 1) / 4);
          ctx.beginPath(); ctx.arc(px, py + Math.sin(t * 3 + j) * 5, (16 + j * 10) * eBack(qq), 0, TAU); ctx.fillStyle = fog > 0 ? "#E4E0DA" : PAPER; ctx.fill(); ol(ctx, 5); });
        ctx.save(); ctx.translate(cx, cy + Math.sin(t * 1.6) * 8); ctx.scale(q, q);
        cloudShape(ctx, 0, 0, cw * .86, chh * .82, t * 2); ctx.strokeStyle = OUT; ctx.lineWidth = 15; ctx.stroke(); ctx.fillStyle = fog > .01 ? `rgb(${Math.round(lerp(255, 222, fog))},${Math.round(lerp(253, 220, fog))},${Math.round(lerp(246, 216, fog))})` : PAPER; ctx.fill();
        const its = th0.items || [], n = its.length, cols = n <= 3 ? 1 : 2, rows = Math.ceil(n / cols), rgap = Math.max(chh * .36, 140);
        its.forEach((it, j) => { const ti = tOf(s, it.at != null || it.cue ? it : { at: .4 + j * .3 }, .2 + j * .15, idx); if (t < ti) return;
          const cxi = cols === 1 ? 0 : ((j % cols) - (cols - 1) / 2) * cw * .42, cyi = rows === 1 ? 0 : (Math.floor(j / cols) - (rows - 1) / 2) * rgap + 20;
          const pq = eBack(clamp((t - ti) / .4, 0, 1)), fq = clamp((t - tFog - j * .15) / .6, 0, 1);
          chip(ctx, it, cxi + Math.sin(t * 2 + j) * 6 + fq * 20 * (j % 2 ? 1 : -1), cyi + Math.cos(t * 1.7 + j) * 5 - fq * 30, pq * (1 - .3 * fq) * (th0.chipScale || 1.35), 1 - fq);
          if (fq > .3){ const z = eBack(clamp((fq - .3) / .5, 0, 1)); ctx.save(); ctx.translate(cxi, cyi); ctx.scale(z, z); ctx.rotate(Math.sin(t * 3 + j) * .15); font(ctx, 900, 110, FAM); ctx.textAlign = "center"; ctx.lineWidth = 12; ctx.strokeStyle = OUT; ctx.strokeText("?", 0, 38); ctx.fillStyle = HL; ctx.fillText("?", 0, 38); ctx.textAlign = "left"; ctx.restore(); } });
        if (fog > 0){ for (let i = 0; i < 9; i++){ const x = (rnd(i) - .5) * cw * .9 + Math.sin(t * .8 + i) * 50, y = (rnd(i + 7) - .5) * chh * .7; ctx.globalAlpha = .55 * fog; ctx.fillStyle = "#C9C3BB"; ctx.beginPath(); ctx.arc(x, y, 50 + rnd(i + 3) * 40, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
        if (th0.title){ font(ctx, 800, 34, FAM); ctx.fillStyle = "#8A5A3E"; ctx.textAlign = "center"; ctx.fillText(th0.title.toUpperCase(), 0, -chh * .36); ctx.textAlign = "left"; }
        ctx.restore();
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const th0 = f.think || {}; if ((th0.mode || "cloud") === "cloud") add(tOf(s, th0.cloud || { at: .2 }, .1, i), "pop");
    (th0.items || []).forEach((it, j) => add(tOf(s, it.at != null || it.cue ? it : { at: (th0.mode === "orbit" ? .3 + j * .25 : .4 + j * .3) }, .2 + j * .15, i), "pop"));
    if (th0.fogCue) add(T(s, th0.fogCue, .5, i), "whoosh"); if (th0.stressCue) add(T(s, th0.stressCue, .5, i), "ping"); });

  /* ================= cb_hp: giant phone in a hand ================= */
  function itemH(ctx, it, w){ if (it.kind === "status") return 190; if (it.kind === "toggle") return 120; if (it.kind === "row") return 100;
    if (it.kind === "msg"){ font(ctx, 700, 34, FAM); return 70 + wrap(ctx, it.text || "", w - 120).slice(0, 3).length * 44; } return 70; }
  function drawItem(ctx, it, x, y, w, k, t, ac){
    const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.globalAlpha *= clamp(k / .2, 0, 1);
    if (it.kind === "msg"){ font(ctx, 700, 34, FAM); const L = wrap(ctx, it.text || "", w - 120).slice(0, 3), bw = Math.min(w - 40, Math.max(...L.map(l => ctx.measureText(l).width)) + 60), bh = 30 + L.length * 44, me = !!it.me, bx = me ? x + w - 20 - bw : x + 20;
      ctx.translate(me ? bx + bw : bx, y + 30); ctx.scale(q, q); ctx.translate(-(me ? bx + bw : bx), -(y + 30));
      if (!me && it.from){ font(ctx, 800, 24, FAM); ctx.fillStyle = ac; ctx.fillText(it.from, bx + 10, y + 22); }
      rr(ctx, bx, y + 30, bw, bh, 22); ctx.fillStyle = me ? "#FCE3C8" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#D9CBB8"; ctx.lineWidth = 3; ctx.stroke();
      font(ctx, 700, 34, FAM); ctx.fillStyle = BROWN; L.forEach((l, j) => ctx.fillText(l, bx + 30, y + 30 + 48 + j * 44 - 6));
      if (it.time){ font(ctx, 700, 20, FAM); ctx.fillStyle = "#A08A74"; ctx.textAlign = "right"; ctx.fillText(it.time, bx + bw - 14, y + 30 + bh - 10); ctx.textAlign = "left"; } }
    else if (it.kind === "row"){ ctx.translate(x + w / 2, y + 45); ctx.scale(q, q); ctx.translate(-(x + w / 2), -(y + 45)); rr(ctx, x + 16, y + 4, w - 32, 84, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#E3D6C4"; ctx.lineWidth = 3; ctx.stroke();
      if (it.icon){ ctx.beginPath(); ctx.arc(x + 62, y + 46, 26, 0, TAU); ctx.fillStyle = hexA(ac, .15); ctx.fill(); ico(ctx, it.icon, x + 62, y + 46, 32, ac, 2.6); }
      const lx = x + (it.icon ? 104 : 40); fit(ctx, it.text || "", w - (it.icon ? 104 : 40) - (it.value ? 170 : 40), 32, 700, 20); ctx.fillStyle = BROWN; ctx.fillText(it.text || "", lx, y + 57);
      if (it.value){ font(ctx, 800, 28, FAM); const vw = ctx.measureText(it.value).width + 30; rr(ctx, x + w - 36 - vw, y + 26, vw, 42, 21); ctx.fillStyle = it.ok === false ? RED : (it.ok ? GREEN : ac); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.fillText(it.value, x + w - 21 - vw, y + 57); } }
    else if (it.kind === "status"){ rr(ctx, x + 16, y + 6, w - 32, 176, 22); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#E3D6C4"; ctx.lineWidth = 3; ctx.stroke();
      font(ctx, 700, 28, FAM); ctx.fillStyle = "#8A7A68"; ctx.textAlign = "center"; ctx.fillText(it.label || "Status", x + w / 2, y + 52); ctx.textAlign = "left";
      stamp(ctx, it.text || "AKTIF", x + w / 2, y + 118, k, it.ok === false ? RED : GREEN, 54, -.06); if (it.ok !== false) burstFx(ctx, x + w / 2, y + 118, k - .25, GREEN, 10, 200); }
    else if (it.kind === "toggle"){ const on = it.onT != null && t >= it.onT, tq = on ? eBack(clamp((t - it.onT) / .35, 0, 1)) : 0;
      ctx.translate(x + w / 2, y + 60); ctx.scale(q, q); ctx.translate(-(x + w / 2), -(y + 60)); rr(ctx, x + 16, y + 8, w - 32, 104, 22); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#E3D6C4"; ctx.lineWidth = 3; ctx.stroke();
      ico(ctx, it.icon || "clock", x + 62, y + 60, 38, ac, 2.6); fit(ctx, it.text || "", w - 260, 32, 800, 20); ctx.fillStyle = BROWN; ctx.fillText(it.text || "", x + 100, y + 71);
      const sx = x + w - 140; rr(ctx, sx, y + 34, 100, 52, 26); ctx.fillStyle = on ? lerpCol("#C9C3BB", ac, clamp(tq, 0, 1)) : "#C9C3BB"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(sx + 26 + 48 * tq, y + 60, 21, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      if (on) burstFx(ctx, sx + 74, y + 60, t - it.onT, ac, 8, 110); }
    else { font(ctx, 700, 26, FAM); ctx.fillStyle = "#8A7A68"; ctx.textAlign = "center"; ctx.fillText(it.text || "", x + w / 2, y + 44); ctx.textAlign = "left"; }
    ctx.restore(); }
  function lerpCol(a, b, q){ const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), m = (s2) => Math.round(lerp(pa >> s2 & 255, pb >> s2 & 255, q)); return `rgb(${m(16)},${m(8)},${m(0)})`; }
  function phoneDraw(ctx, s, t, Ph, idx){
    const tIn = tOf(s, Ph.enter || { at: .15 }, .1, idx), k = t - tIn; if (k < 0) return; const w = Ph.w, h = Ph.h;
    const inQ = eBack(clamp(k / .6, 0, 1)); let bz = 0; (Ph.buzz || []).forEach(b => { const bt = t - tOf(s, typeof b === "string" ? { cue: b } : b, .3, idx); if (bt >= 0 && bt < .6) bz += Math.sin(bt * 70) * (1 - bt / .6); });
    const cx = Ph.x, cy = Ph.y + h / 2 + (1 - inQ) * 900;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((Ph.rot ?? -.04) + bz * .05 + Math.sin(t * 1.3) * .012); ctx.translate(bz * 6, 0);
    if (Ph.glow) glowAt(ctx, 0, 0, w * 1.2, "#BFE2EA", .35);
    rr(ctx, -w / 2 - 22, -h / 2 - 22, w + 44, h + 44, 70); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 8);
    rr(ctx, -w / 2, -h / 2, w, h, 52); ctx.fillStyle = "#F4EFE8"; ctx.fill();
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 52); ctx.clip();
    const pages = (Ph.pages || []).map((p, j) => Object.assign({}, p, { T: j === 0 ? -1 : tOf(s, p, .4, idx) })); let pi = 0; pages.forEach((p, j) => { if (t >= p.T) pi = j; });
    const drawPage = (p, ox) => { const ac = p.color || ORANGE; ctx.save(); ctx.translate(ox, 0);
      if (p.bg) { ctx.fillStyle = p.bg; ctx.fillRect(-w / 2, -h / 2, w, h); }
      ctx.fillStyle = ac; ctx.fillRect(-w / 2, -h / 2, w, 170); font(ctx, 700, 22, FAM); ctx.fillStyle = hexA("#FFFFFF", .85); ctx.fillText(p.clock || "21.07", -w / 2 + 44, -h / 2 + 44);
      ctx.beginPath(); ctx.arc(-w / 2 + 76, -h / 2 + 112, 34, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ico(ctx, p.icon || "phone", -w / 2 + 76, -h / 2 + 112, 38, ac, 2.6);
      fit(ctx, p.app || "", w - 160, 38, 800, 22); ctx.fillStyle = "#FFFFFF"; ctx.fillText(p.app || "", -w / 2 + 126, -h / 2 + 108); if (p.sub){ font(ctx, 600, 22, FAM); ctx.fillStyle = hexA("#FFFFFF", .85); ctx.fillText(p.sub, -w / 2 + 126, -h / 2 + 140); }
      const its = (p.items || []).map((it, j) => Object.assign({}, it, { T: tOf(s, it.at != null || it.cue ? it : { at: (p.T < 0 ? tIn : p.T) + .5 + j * .4 }, .2 + j * .15, idx), onT: it.onCue ? T(s, it.onCue, .6, idx) : (it.onAt ?? null) })).filter(it => t >= it.T);
      const avail = h - 210, grow = it => eOut(clamp((t - it.T) / .35, 0, 1)); let tot = 0; its.forEach(it => tot += (itemH(ctx, it, w) + 14) * grow(it)); const sc = Math.max(0, tot - avail);
      let y = -h / 2 + 190 - sc;
      its.forEach(it => { const hh = itemH(ctx, it, w); drawItem(ctx, it, -w / 2, y, w, t - it.T, t, ac); y += (hh + 14) * grow(it); });
      ctx.restore(); };
    const cur = pages[pi]; if (cur){ const sw = pi > 0 ? clamp((t - cur.T) / .45, 0, 1) : 1; if (sw < 1 && pages[pi - 1]) drawPage(pages[pi - 1], -eOut(sw) * w); drawPage(cur, (1 - eOut(sw)) * w); }
    ctx.restore();
    rr(ctx, -70, -h / 2 + 14, 140, 30, 15); ctx.fillStyle = "#1E1A18"; ctx.fill();
    // ring lines while buzzing
    if (bz !== 0){ ctx.strokeStyle = hexA(OUT, .8); ctx.lineWidth = 8; ctx.lineCap = "round"; [-1, 1].forEach(sd => [0, 1].forEach(r => { ctx.beginPath(); ctx.arc(sd * (w / 2 + 50 + r * 34), -h / 2 + 120, 30 + r * 20, sd > 0 ? -.8 : Math.PI - .8 + 0, sd > 0 ? .8 : Math.PI + .8); ctx.stroke(); })); }
    // hand
    if (Ph.hand !== false){ const sk = Ph.skin || "#E2A77C"; ctx.fillStyle = sk; ctx.strokeStyle = OUT; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.ellipse(-w / 2 - 10, h / 2 - 120, 60, 130, -.25, 0, TAU); ctx.fill(); ctx.stroke();
      [0, 1, 2, 3].forEach(j => { ctx.beginPath(); ctx.ellipse(w / 2 + 14, h / 2 - 330 + j * 70, 40, 30, 0, 0, TAU); ctx.fill(); ctx.stroke(); });
      ctx.beginPath(); ctx.ellipse(-w / 2 + 40, h / 2 - 260, 34, 70, .5, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = Ph.sleeve || "#2F6F73"; rr(ctx, -w / 2 - 90, h / 2 - 40, 220, 400, 40); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  TT.scene("cb_hp", "Cerita: ponsel besar di tangan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Ph = Object.assign({ x: 650, y: 300, w: 520, h: 960 }, f.phone || {});
    base(ctx, s, t, { env: "office", spots: { phone: [Ph.x, Ph.y + Ph.h * .42, 1.25], phoneTop: [Ph.x, Ph.y + Ph.h * .3, 1.45] },
      front: () => phoneDraw(ctx, s, t, Ph, idx) });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Ph = f.phone || {}; add(tOf(s, Ph.enter || { at: .15 }, .1, i), "whoosh");
    (Ph.buzz || []).forEach(b => add(tOf(s, typeof b === "string" ? { cue: b } : b, .3, i), "ping"));
    (Ph.pages || []).forEach((p, j) => { if (j) add(tOf(s, p, .4, i), "whoosh"); (p.items || []).forEach((it, k) => { if (it.cue || it.at != null) add(tOf(s, it, .2 + k * .15, i), it.kind === "status" ? "chime" : "pop"); if (it.onCue) add(T(s, it.onCue, .6, i), "chime"); }); }); });

  /* ================= cb_catat: spiral notepad written live ================= */
  TT.scene("cb_catat", "Cerita: catatan ditulis", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, N = Object.assign({ x: 660, y: 420, w: 640, h: 820, title: "Catatan", lines: [] }, f.note || {});
    const x0 = N.x - N.w / 2, tIn = tOf(s, N.enter || { at: .15 }, .1, idx);
    base(ctx, s, t, { env: "office", spots: { note: [N.x, N.y + N.h * .45, 1.3] },
      front: () => {
        const k = t - tIn; if (k < 0) return; const q = eBack(clamp(k / .55, 0, 1));
        ctx.save(); ctx.translate(N.x, N.y + N.h / 2); ctx.rotate((N.rot ?? .025) + Math.sin(t * 1.2) * .006); ctx.scale(q, q); ctx.translate(-N.x, -(N.y + N.h / 2));
        ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, x0 + 16, N.y + 22, N.w, N.h, 18); ctx.fill();
        rr(ctx, x0, N.y, N.w, N.h, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
        ctx.strokeStyle = "#E0C9AE"; ctx.lineWidth = 3; for (let y = N.y + 190; y < N.y + N.h - 30; y += 66){ ctx.beginPath(); ctx.moveTo(x0 + 24, y); ctx.lineTo(x0 + N.w - 24, y); ctx.stroke(); }
        ctx.strokeStyle = hexA(RED, .55); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + 96, N.y + 60); ctx.lineTo(x0 + 96, N.y + N.h - 20); ctx.stroke();
        for (let i = 0; i < 9; i++){ const rx = x0 + 60 + i * (N.w - 120) / 8; ctx.fillStyle = "#3B3631"; ctx.beginPath(); ctx.arc(rx, N.y + 6, 13, 0, TAU); ctx.fill(); ctx.strokeStyle = "#8C8C8C"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(rx, N.y - 8, 18, Math.PI * .9, Math.PI * 2.1); ctx.stroke(); }
        font(ctx, 900, 46, FAM); ctx.fillStyle = ORANGE; fit(ctx, N.title, N.w - 160, 46, 900); ctx.fillText(N.title, x0 + 120, N.y + 120);
        let y = N.y + 250, pen = null;
        N.lines.forEach((ln, j) => {
          const ti = tOf(s, ln, .2 + j * .2, idx); font(ctx, 700, 38, FAM); const L = wrap(ctx, ln.text, N.w - 170), all = L.join(" "), dur = Math.min(1.6, .25 + all.length * .045);
          const p = clamp((t - ti) / dur, 0, 1); let left = Math.floor(all.length * p);
          if (t >= ti){ // box + label
            const bq = eBack(clamp((t - ti) / .3, 0, 1)); ctx.save(); ctx.translate(x0 + 56, y - 14); ctx.scale(bq, bq); rr(ctx, -20, -20, 40, 40, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
            if (p >= 1){ const ck = eBack(clamp((t - ti - dur) / .3, 0, 1)); ctx.scale(ck, ck); ico(ctx, "check", 4, -6, 50, GREEN, 3.6); } ctx.restore();
            let last = null; L.forEach((l, r) => { const part = l.slice(0, Math.max(0, left)); left -= l.length + 1; ctx.fillStyle = BROWN; font(ctx, 700, 38, FAM);
              if (ln.lab && r === 0){ const lw = ctx.measureText(ln.lab).width; ctx.fillStyle = ORANGE; ctx.fillText(part.slice(0, ln.lab.length), x0 + 120, y + r * 66); ctx.fillStyle = BROWN; ctx.fillText(part.slice(ln.lab.length), x0 + 120 + Math.min(lw, ctx.measureText(part.slice(0, ln.lab.length)).width), y + r * 66); }
              else ctx.fillText(part, x0 + 120, y + r * 66);
              if (part.length > 0) last = [x0 + 120 + ctx.measureText(part).width, y + r * 66]; });
            if (p > 0 && p < 1 && last) pen = last;
            if (ln.hl && t >= tOf(s, { cue: ln.hl }, .6, idx)){ const hq = clamp((t - tOf(s, { cue: ln.hl }, .6, idx)) / .5, 0, 1); ctx.strokeStyle = hexA(HL, .9); ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(x0 + N.w / 2 + 30, y - 12 + (L.length - 1) * 33, N.w * .46, 40 + (L.length - 1) * 33, -.03, -Math.PI / 2, -Math.PI / 2 + TAU * eOut(hq)); ctx.stroke(); }
          }
          y += L.length * 66 + 30;
        });
        if (pen){ const [px, py] = pen, wig = Math.sin(t * 40) * 5; ctx.save(); ctx.translate(px + 10, py - 10 + wig); ctx.rotate(-.7);
          ctx.fillStyle = "#E8B23A"; rr(ctx, 0, -14, 190, 28, 6); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#F3D9B5"; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-40, 0); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.moveTo(-28, -4); ctx.lineTo(-40, 0); ctx.lineTo(-28, 4); ctx.fill();
          ctx.fillStyle = "#E8604C"; rr(ctx, 176, -14, 30, 28, 6); ctx.fill(); ol(ctx, 4); ctx.restore(); }
        ctx.restore();
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const N = f.note || {}; add(tOf(s, N.enter || { at: .15 }, .1, i), "whoosh");
    (N.lines || []).forEach((ln, j) => { const ti = tOf(s, ln, .2 + j * .2, i); add(ti, "pop"); add(ti + Math.min(1.6, .25 + (ln.text || "").length * .045), "chime"); }); });

  /* ================= cb_kamar: bedroom at night ================= */
  TT.scene("cb_kamar", "Cerita: kamar malam", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rm = Object.assign({ bedX: 640, clockX: 150 }, f.room || {}), th0 = f.think, toons = f.toons || [];
    const a = toons[0], st = a ? toonState(a, s, t) : null, head = st ? toonHead(st) : [540, 1040];
    const times = (Rm.times || []).map((q, j) => Object.assign({}, q, { T: j === 0 ? -1 : tOf(s, q, .4, idx) })); let ci = 0; times.forEach((q, j) => { if (t >= q.T) ci = j; });
    const tDark = Rm.lightsOffCue ? T(s, Rm.lightsOffCue, .6, idx) : 1e9;
    base(ctx, s, t, { env: "home", envOpt: { lampX: Rm.lampX ?? 1500 }, spots: { clock: [Rm.clockX + 60, GROUND - 560, 1.5], head: [head[0], head[1] - 60, 1.2] },
      back: () => {
        if (th0 && th0.mode === "orbit") orbit(ctx, s, t, th0, head, true, idx);
        const bx = Rm.bedX, top = GROUND - 330;
        ctx.fillStyle = "rgba(43,26,18,.28)"; ctx.beginPath(); ctx.ellipse(bx, GROUND + 6, 520, 26, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#7A4A2E"; rr(ctx, bx + 380, top - 330, 90, 660, 22); ctx.fill(); ol(ctx, 6); rr(ctx, bx - 500, top - 60, 70, 390, 18); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#8E5A3A"; rr(ctx, bx - 480, top + 120, 900, 120, 14); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#FFFDF8"; rr(ctx, bx - 450, top + 20, 860, 120, 40); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#FFFFFF"; rr(ctx, bx + 210, top - 40, 180, 90, 40); ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.moveTo(bx - 450, top + 40); ctx.quadraticCurveTo(bx - 120, top - 30 + Math.sin(t * 1.4) * 6, bx + 180, top + 30); ctx.lineTo(bx + 200, top + 150); ctx.lineTo(bx - 455, top + 150); ctx.closePath(); ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = hexA("#FFFFFF", .35); ctx.lineWidth = 6; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(bx - 380 + k * 140, top + 60); ctx.lineTo(bx - 400 + k * 140, top + 140); ctx.stroke(); }
        // nightstand + digital clock
        const nx = Rm.clockX; ctx.fillStyle = "#A9643B"; rr(ctx, nx - 120, GROUND - 440, 240, 440, 14); ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 4; [GROUND - 290, GROUND - 150].forEach(yy => { ctx.beginPath(); ctx.moveTo(nx - 120, yy); ctx.lineTo(nx + 120, yy); ctx.stroke(); ctx.fillStyle = "#E8B23A"; ctx.beginPath(); ctx.arc(nx, yy + 70, 12, 0, TAU); ctx.fill(); });
        const cur = times[ci]; if (cur){ const k = t - cur.T, pq = ci > 0 ? eBack(clamp(k / .35, 0, 1)) : 1; ctx.save(); ctx.translate(nx, GROUND - 515); ctx.scale(pq, pq); rr(ctx, -120, -70, 240, 140, 24); ctx.fillStyle = "#2A2623"; ctx.fill(); ol(ctx, 6);
          glowAt(ctx, 0, 0, 160, cur.late ? "#FF6A4D" : "#FFB566", .35); font(ctx, 900, 70, FAM); ctx.textAlign = "center"; ctx.fillStyle = cur.late ? "#FF7A5C" : "#FFC27A"; const blink = Math.floor(t * 2) % 2 ? cur.text : cur.text.replace(/[.:]/, " "); ctx.fillText(blink, 0, 25); ctx.textAlign = "left"; ctx.restore();
          if (ci > 0) burstFx(ctx, nx, GROUND - 515, k, cur.late ? RED : HL, 8, 150); }
      },
      front: () => {
        if (th0 && th0.mode === "orbit") orbit(ctx, s, t, th0, head, false, idx);
        if (Rm.phoneGlow && st && t < tDark){ glowAt(ctx, head[0] + 80 * (st.face || 1), head[1] + 120, 330, "#9FD3E8", .45 + .08 * Math.sin(t * 7)); }
        if (t > tDark){ ctx.fillStyle = hexA("#0E1330", .45 * clamp((t - tDark) / .5, 0, 1)); ctx.fillRect(-2000, -2000, 5000, 6000); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Rm = f.room || {}; (Rm.times || []).forEach((q, j) => { if (j) add(tOf(s, q, .4, i), "ping"); }); if (Rm.lightsOffCue) add(T(s, Rm.lightsOffCue, .6, i), "whoosh");
    const th0 = f.think; if (th0) (th0.items || []).forEach((it, j) => add(tOf(s, it.at != null || it.cue ? it : { at: .3 + j * .25 }, .2 + j * .12, i), "pop")); });
})();
