/* Scene pack set6d: spotlight, mirror, giftbox, chess, umbrella, lens.
   Runs after motion-tangani.js. Canvas 1080x1920; visuals live in y ~590-1330, text inside x 90-990.
   spotlight: dark stage, sweeping spotlight; items [{label, icon, cue, actor?}] lit on cue; finale {cue, label} lights up all.
   mirror:    subject (icon or actor) + oval mirror; reflection = copy until cue, then becomes f.right; crackCue cracks it.
   giftbox:   wobbling gift (label), openCue: ribbon flies, lid pops, items [{label, icon, cue, bad}] jump out.
   chess:     6x6 board, pieces [{label, kind, side me|foe, at:[c,r], cue?, moves:[{cue, to:[c,r]}]}], mateCue/mateLabel.
   umbrella:  rain + labelled problem drops [{label, icon, cue}] on an actor; openCue opens umbrella (label) that deflects them.
   lens:      magnifier sweeps a document (doc.kind doc|post|idcard|chat|hand); spots [{label, text?, cue, x, y, danger}] revealed; stamp/stampCue. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, panel, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr) => cueT(s, c, fr);
  const CREAM = "#FFF7EE", RED = "#D84315", GREEN = "#3BB273";
  const k01 = (t, t0, d) => clamp((t - t0) / d, 0, 1);
  const lerp = (a, b, q) => a + (b - a) * q;
  const dark = th => th.key === "B";

  function wrap(ctx, text, maxW){ const ws = String(text || "").split(/\s+/).filter(Boolean), out = []; let cur = "";
    for (const w of ws){ const tr = cur ? cur + " " + w : w; if (!cur || ctx.measureText(tr).width <= maxW) cur = tr; else { out.push(cur); cur = w; } }
    if (cur) out.push(cur); return out.length ? out : [""]; }
  function fit(ctx, th, text, size, maxW, maxLines, weight){ let sz = size, lines;
    for (;;){ font(ctx, weight || 800, sz, th.fam); lines = wrap(ctx, text, maxW); const mw = Math.max(...lines.map(l => ctx.measureText(l).width));
      if ((lines.length <= (maxLines || 2) && mw <= maxW) || sz <= 18) break; sz -= 2; }
    return { sz, lines }; }
  // rounded label, up to 2 lines, centred on (x, y); kept inside x 90..990
  function tag(ctx, th, text, x, y, bg, fg, size, maxW, border, k, rot){ const { sz, lines } = fit(ctx, th, text, size || 30, maxW || 300, 2); const lh = sz * 1.18;
    const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + sz * 1.3, h = lines.length * lh + sz * .75, X = clamp(x, 90 + w / 2, 990 - w / 2);
    if (k != null && k <= 0) return { w, h, cx: X };
    ctx.save(); ctx.translate(X, y); if (rot) ctx.rotate(rot); if (k != null) ctx.scale(k, k); const cx = 0; y = 0;
    rr(ctx, cx - w / 2, y - h / 2, w, h, Math.min(h / 2, sz * .95)); ctx.fillStyle = bg; ctx.fill(); if (border){ ctx.strokeStyle = border; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    lines.forEach((l, i) => ctx.fillText(l, cx, y + (i - (lines.length - 1) / 2) * lh + sz * .05)); ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; ctx.restore(); return { w, h, cx: X }; }
  const ACT = (a, x) => Object.assign({ x, hair: "short", shirt: "#2F6F73", skin: "a" }, a || {});
  function actorExtras(ctx, th, a, st, r, t){ if (!r) return;
    if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (a.emoteDx || 0), r.headTop - 30, t - st.emoteT, t);
    if (st.say) bubbleAt(ctx, th, st.say, r.headX + (a.bubbleDx || 0), r.headTop - (st.emote ? 90 : 10), st.chat, t - st.sayT); }

  /* ================= spotlight ================= */
  let OFF = null; const off = () => { if (!OFF){ OFF = document.createElement("canvas"); OFF.width = 1080; OFF.height = 1920; } return OFF; };
  const SG = { x0: 90, x1: 990, y0: 590, y1: 1330, floor: 1218 };
  function stage(ctx, t){ const { x0, x1, y0, y1, floor } = SG;
    ctx.save(); rr(ctx, x0, y0, x1 - x0, y1 - y0, 40); ctx.clip();
    let g = ctx.createLinearGradient(0, y0, 0, floor); g.addColorStop(0, "#1E1610"); g.addColorStop(1, "#33251B"); ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, floor - y0);
    ctx.fillStyle = "rgba(255,255,255,.03)"; for (let x = x0 + 40; x < x1; x += 96) ctx.fillRect(x, y0, 44, floor - y0);
    g = ctx.createLinearGradient(0, floor, 0, y1); g.addColorStop(0, "#7A4E30"); g.addColorStop(1, "#3B2418"); ctx.fillStyle = g; ctx.fillRect(x0, floor, x1 - x0, y1 - floor);
    ctx.strokeStyle = "rgba(0,0,0,.28)"; ctx.lineWidth = 3; for (let k = 1; k < 4; k++){ const y = floor + k * (y1 - floor) / 4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
    for (let x = x0 + 70; x < x1; x += 140){ ctx.beginPath(); ctx.moveTo(x, floor); ctx.lineTo(x + (x - 540) * .25, y1); ctx.stroke(); }
    ctx.fillStyle = "#E89544"; ctx.fillRect(x0, floor - 3, x1 - x0, 7); ctx.restore(); }
  function curtains(ctx, t){ const { x0, x1, y0, y1, floor } = SG;
    ctx.save(); rr(ctx, x0, y0, x1 - x0, y1 - y0, 40); ctx.clip();
    [[x0, 1], [x1, -1]].forEach(([ex, d]) => { const w = 54 + Math.sin(t * .8 + d) * 4;
      for (let k = 0; k < 4; k++){ const xa = ex + d * k * w / 4, xb = xa + d * w / 4, g = ctx.createLinearGradient(xa, 0, xb, 0);
        g.addColorStop(0, "#5A2A14"); g.addColorStop(.5, "#A0522D"); g.addColorStop(1, "#4A2210"); ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(xa, y0); ctx.lineTo(xb, y0); ctx.lineTo(xb + d * 12 * Math.sin(t * 1.1 + k), floor + 24); ctx.lineTo(xa, floor + 24); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = "#E8A317"; ctx.beginPath(); ctx.arc(ex + d * (w - 6), floor - 280, 9, 0, TAU); ctx.fill(); });
    ctx.fillStyle = "#7A3B1E"; ctx.fillRect(x0, y0, x1 - x0, 44); ctx.fillStyle = "#A0522D"; for (let x = x0; x < x1 + 30; x += 64){ ctx.beginPath(); ctx.arc(x + 32, y0 + 44, 32, 0, Math.PI); ctx.fill(); }
    ctx.fillStyle = "#E8A317"; ctx.fillRect(x0, y0 + 42, x1 - x0, 4); ctx.restore(); }
  function lamp(ctx, lx, ly, tx, ty){ const a = Math.atan2(ty - ly, tx - lx) - Math.PI / 2;
    ctx.save(); ctx.fillStyle = "#2B1A12"; ctx.fillRect(lx - 4, ly - 40, 8, 40); ctx.translate(lx, ly); ctx.rotate(a);
    rr(ctx, -26, -22, 52, 50, 10); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 28, 24, 8, 0, 0, TAU); ctx.fillStyle = "#FFE7B8"; ctx.fill(); ctx.restore(); }

  TT.layout("spotlight", "Lampu sorot", (ctx, th, s, t) => {
    const f = s.f, M = mv(), items = f.items || [], n = items.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { x0, x1, y0, y1, floor } = SG, gap = n > 1 ? Math.min(275, 650 / (n - 1)) : 0, DR = Math.min(92, (gap || 300) * .38);
    const xs = items.map((it, i) => it.x != null ? it.x : 540 + (i - (n - 1) / 2) * gap);
    const T = items.map((it, i) => at(s, it.cue, .12 + i * .75 / Math.max(1, n)));
    const acts = items.map((it, i) => it.actor ? ACT(it.actor, xs[i]) : null);
    const itemX = (i, u) => acts[i] ? actorState(acts[i], s, u).x : xs[i];
    const order = T.map((v, i) => [v, i]).concat((f.path || []).map((p, k) => [at(s, p.cue, .5 + k * .1), p.item | 0])).sort((a, b) => a[0] - b[0]);
    const sweep = u => 540 + Math.sin(u * 1.15 + .4) * 290;
    const beamX = (u, d) => { let last = -1, lt = 0; for (const [v, i] of order) if (u >= v){ last = i; lt = v; } if (last < 0 || d > 12) return sweep(u);
      const from = beamX(lt - 1e-3, d + 1); return from + (itemX(last, u) - from) * easeIO(k01(u, lt, .65)); };
    const fin = f.finale && f.finale.cue ? at(s, f.finale.cue, .85) : 1e9, lit = k01(t, fin, .8);
    const bx = beamX(t, 0), lx = 540, ly = y0 + 92, curIdx = (() => { let c = -1; for (const [v, i] of order) if (t >= v) c = i; return c; })();
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t);
    // items (drawn before the darkness overlay so they sit in the dark until lit)
    const pedY = floor - 86, heads = [];
    items.forEach((it, i) => { const on = t >= T[i], q = on ? eBack(k01(t, T[i], .5)) : 0, x = itemX(i, t);
      if (acts[i]){ const st = actorState(acts[i], s, t); const r = drawActor(ctx, th, acts[i], st, t, floor + 22, acts[i].scale || 1.02); heads.push([acts[i], st, r]); return; }
      ctx.save(); ctx.translate(x, 0);
      rr(ctx, -78, pedY, 156, 86, 12); ctx.fillStyle = "#8E4E2E"; ctx.fill(); rr(ctx, -86, pedY - 12, 172, 22, 8); ctx.fillStyle = "#B5643C"; ctx.fill();
      const bob = Math.sin(t * 2 + i) * 6, sc = on ? 1 + .14 * Math.sin(Math.PI * k01(t, T[i], .5)) : .92;
      ctx.translate(0, pedY - 112 + bob); ctx.scale(sc, sc);
      ctx.beginPath(); ctx.arc(0, 0, DR, 0, TAU); ctx.fillStyle = it.bad ? RED : (on ? M.pal[i % 3] : "#6A5A4A"); ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.stroke();
      icon(ctx, it.icon || "star", -DR * .55, -DR * .55, DR * 1.1, "#fff", 2.2); ctx.restore(); });
    // darkness with holes for the beam and earlier pools
    const o = off(), c = o.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1080, 1920); c.globalCompositeOperation = "source-over";
    c.save(); rr(c, x0, y0, x1 - x0, y1 - y0, 40); c.clip(); c.fillStyle = `rgba(6,4,2,${.74 - .6 * lit})`; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    c.globalCompositeOperation = "destination-out";
    items.forEach((it, i) => { if (t < T[i] || i === curIdx) return; const x = itemX(i, t), g = c.createRadialGradient(x, floor - 150, 20, x, floor - 150, 230);
      g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(x - 240, y0, 480, y1 - y0); });
    const bw = 170, g2 = c.createLinearGradient(0, ly, 0, floor + 40); g2.addColorStop(0, "rgba(0,0,0,.7)"); g2.addColorStop(1, "rgba(0,0,0,.95)"); c.fillStyle = g2;
    c.beginPath(); c.moveTo(lx - 20, ly + 20); c.lineTo(lx + 20, ly + 20); c.lineTo(bx + bw, floor + 10); c.ellipse(bx, floor + 10, bw, 40, 0, 0, Math.PI); c.lineTo(bx - bw, floor + 10); c.closePath(); c.fill();
    c.restore(); ctx.drawImage(o, 0, 0);
    // warm light in the beam + dust
    ctx.save(); rr(ctx, x0, y0, x1 - x0, y1 - y0, 40); ctx.clip(); ctx.globalCompositeOperation = "lighter";
    const g3 = ctx.createLinearGradient(0, ly, 0, floor); g3.addColorStop(0, "rgba(255,214,150,.22)"); g3.addColorStop(1, "rgba(255,214,150,.06)"); ctx.fillStyle = g3;
    ctx.beginPath(); ctx.moveTo(lx - 20, ly + 20); ctx.lineTo(lx + 20, ly + 20); ctx.lineTo(bx + bw, floor + 10); ctx.lineTo(bx - bw, floor + 10); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx, floor + 10, bw, 40, 0, 0, TAU); ctx.fillStyle = "rgba(255,220,160,.22)"; ctx.fill();
    for (let k = 0; k < 18; k++){ const u = ((t * .08 + k * .137) % 1), yy = lerp(ly + 40, floor, u), half = lerp(20, bw, u) * .8, xx = lerp(lx, bx, u) + Math.sin(t * .9 + k * 2.3) * half;
      ctx.fillStyle = `rgba(255,235,200,${.35 * Math.sin(u * Math.PI)})`; ctx.beginPath(); ctx.arc(xx, yy, 2.5 + (k % 3), 0, TAU); ctx.fill(); }
    ctx.restore();
    curtains(ctx, t); lamp(ctx, lx, ly, bx, floor);
    // labels, bubbles, finale
    items.forEach((it, i) => { if (t < T[i] || !it.label) return; const q = eBack(k01(t, T[i] + .15, .4)), x = itemX(i, t);
      tag(ctx, th, it.label, x, floor + 58, i === curIdx || lit > 0 ? CREAM : "rgba(255,247,238,.82)", INK, 34, Math.max(190, (n > 1 ? gap : 400) - 16), null, q);
      if (!acts[i]) burst(ctx, x, pedY - 112, t - T[i], M, 8); });
    heads.forEach(([a, st, r]) => actorExtras(ctx, th, a, st, r, t));
    if (lit > 0){ const q = eBack(k01(t, fin, .5)); tag(ctx, th, f.finale.label || "", 540, y0 + 150, th.accent, "#fff", 40, 700, CREAM, q, -.03); burst(ctx, 540, y0 + 150, t - fin, M, 14); }
    ctx.restore();
  }, (s, f, i, add) => { (f.items || []).forEach((it, k) => { add(cueT(s, it.cue, .12 + k * .75 / Math.max(1, (f.items || []).length), i), "whoosh");
      if (it.actor) keyTimes(s, it.actor.keys, i).forEach(kk => { if (kk.say != null || kk.emote === "!" || kk.emote === "?") add(kk.T, "pop"); if (kk.emote === "check") add(kk.T, "chime"); }); });
    (f.path || []).forEach((p, k) => add(cueT(s, p.cue, .5 + k * .1, i), "whoosh"));
    if (f.finale && f.finale.cue) add(cueT(s, f.finale.cue, .85, i), "chime"); });

  /* ================= mirror ================= */
  TT.layout("mirror", "Cermin", (ctx, th, s, t) => {
    const f = s.f, M = mv(), L = f.left || {}, Rg = f.right || L; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const tc = f.cue ? at(s, f.cue, .45) : 1e9, tk = f.crackCue ? at(s, f.crackCue, .85) : 1e9, sx = 290, mx = 715, my = 915, rx = 210, ry = 300;
    const swapped = t >= tc, q = k01(t, tc, .9), cracked = t >= tk, dk = t - tk, shake = cracked && dk < .6 ? Math.sin(dk * 60) * 9 * (1 - dk / .6) : 0;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    panel(ctx, th, 600, 1330);
    ctx.fillStyle = dark(th) ? "rgba(250,248,243,.12)" : hexA(INK, .1); ctx.fillRect(110, 1250, 860, 6);
    // subject
    const subj = (d, x, gy, sc, refl, tt) => { if (d.actor){ const a = ACT(d.actor, x), st = actorState(a, s, tt); if (refl) st.x = x; return { a, st, r: drawActor(ctx, th, a, st, tt, gy, sc) }; }
      ctx.save(); ctx.translate(x, gy - 260 * sc + Math.sin(tt * 1.8) * 8); ctx.scale(sc, sc); ctx.beginPath(); ctx.arc(0, 0, 118, 0, TAU); ctx.fillStyle = d.bad ? RED : (d.color || th.accent); ctx.fill();
      ctx.strokeStyle = CREAM; ctx.lineWidth = 8; ctx.stroke(); icon(ctx, d.icon || "users", -64, -64, 128, "#fff", 2.2); ctx.restore(); return null; };
    const me = subj(L, sx, 1250, 1, false, t);
    // stand
    ctx.save(); ctx.translate(shake, 0); ctx.strokeStyle = "#7A4E30"; ctx.lineWidth = 14; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(mx - 110, my + ry - 30); ctx.lineTo(mx - 150, 1252); ctx.moveTo(mx + 110, my + ry - 30); ctx.lineTo(mx + 150, 1252); ctx.stroke();
    // glass + reflection
    ctx.save(); ctx.beginPath(); ctx.ellipse(mx, my, rx, ry, 0, 0, TAU); ctx.clip();
    const gg = ctx.createLinearGradient(mx - rx, my - ry, mx + rx, my + ry); gg.addColorStop(0, "#E4EEF0"); gg.addColorStop(1, "#B9CDD3"); ctx.fillStyle = gg; ctx.fillRect(mx - rx, my - ry, 2 * rx, 2 * ry);
    ctx.fillStyle = "rgba(59,36,24,.08)"; ctx.fillRect(mx - rx, my + 170, 2 * rx, 200);
    const drawRef = (d, alpha, wob) => { if (alpha <= 0) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(mx, 0); ctx.scale(-(1 + wob), 1); ctx.translate(-mx, 0); subj(d, mx, my + 262, .8, true, t); ctx.restore(); };
    const wob = swapped && q < 1 ? Math.sin(q * 18) * .12 * (1 - q) : 0;
    drawRef(L, swapped ? 1 - q : 1, wob); if (swapped) drawRef(Rg.actor || Rg.icon ? Rg : L, q, wob);
    if (swapped && q < 1){ ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 6; for (let k = 0; k < 3; k++){ const r = (q * 1.4 - k * .2) * 320; if (r > 0){ ctx.beginPath(); ctx.ellipse(mx, my, r * .7, r, 0, 0, TAU); ctx.stroke(); } } }
    const sh = ((t * .32) % 1.3) - .15; ctx.save(); ctx.translate(mx - rx + sh * 2 * rx * 1.4, my); ctx.rotate(.5); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(-28, -ry * 1.4, 56, ry * 2.8); ctx.fillRect(40, -ry * 1.4, 16, ry * 2.8); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(mx - rx, my - ry, 2 * rx, 2 * ry);
    if (cracked){ const ix = mx + 40, iy = my - 70, g = clamp(dk / .35, 0, 1); ctx.fillStyle = `rgba(40,30,25,${.18 * g})`; ctx.fillRect(mx - rx, my - ry, 2 * rx, 2 * ry);
      ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 4; ctx.lineJoin = "round";
      for (let k = 0; k < 9; k++){ const a = k * TAU / 9 + .3; let px = ix, py = iy; ctx.beginPath(); ctx.moveTo(px, py);
        for (let j = 1; j <= 4; j++){ const L2 = 95 * j * g, ja = a + Math.sin(k * 7 + j * 3) * .25; px = ix + Math.cos(ja) * L2; py = iy + Math.sin(ja) * L2; ctx.lineTo(px, py); } ctx.stroke(); }
      [60, 130].forEach(rad => { ctx.beginPath(); for (let k = 0; k <= 9; k++){ const a = k * TAU / 9 + .3, rr2 = rad * g * (1 + Math.sin(k * 5) * .15); ctx[k ? "lineTo" : "moveTo"](ix + Math.cos(a) * rr2, iy + Math.sin(a) * rr2); } ctx.stroke(); });
      ctx.strokeStyle = "rgba(59,36,24,.35)"; ctx.lineWidth = 2; for (let k = 0; k < 9; k++){ const a = k * TAU / 9 + .32; ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix + Math.cos(a) * 380 * g, iy + Math.sin(a) * 380 * g); ctx.stroke(); } }
    ctx.restore();
    // frame
    ctx.lineWidth = 30; const fg = ctx.createLinearGradient(mx - rx, my - ry, mx + rx, my + ry); fg.addColorStop(0, "#E8B86A"); fg.addColorStop(.5, "#B87333"); fg.addColorStop(1, "#E8A04A");
    ctx.strokeStyle = fg; ctx.beginPath(); ctx.ellipse(mx, my, rx + 12, ry + 12, 0, 0, TAU); ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = CREAM; ctx.beginPath(); ctx.ellipse(mx, my, rx - 2, ry - 2, 0, 0, TAU); ctx.stroke();
    ctx.fillStyle = "#E8B86A"; ctx.beginPath(); ctx.arc(mx, my - ry - 22, 20, 0, TAU); ctx.fill(); ctx.fillStyle = "#B87333"; ctx.beginPath(); ctx.arc(mx, my - ry - 22, 9, 0, TAU); ctx.fill();
    if (cracked){ for (let k = 0; k < 6; k++){ const u = clamp(dk / 1.1, 0, 1), a = k * 1.1 + .4; ctx.save(); ctx.globalAlpha *= 1 - u; ctx.translate(mx + 40 + Math.cos(a) * 200 * u, my - 70 + Math.sin(a) * 120 * u + 400 * u * u); ctx.rotate(u * 6 + k);
      ctx.fillStyle = "rgba(220,235,238,.9)"; ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(14, 10); ctx.lineTo(-12, 8); ctx.closePath(); ctx.fill(); ctx.restore(); } }
    ctx.restore();
    if (swapped) burst(ctx, mx, my - 80, t - tc - .4, M, 10);
    // labels
    if (L.label){ const q2 = eBack(k01(t, .25, .4)); tag(ctx, th, L.label, sx, 1296, dark(th) ? CREAM : INK, dark(th) ? INK : CREAM, 30, 360, null, q2); }
    const mlab = cracked ? (f.crackLabel || Rg.label) : swapped ? Rg.label : (f.before || L.label), mq = eBack(k01(t, cracked ? tk : swapped ? tc + .2 : .35, .4));
    if (mlab){ tag(ctx, th, mlab, mx, 1296, cracked ? RED : swapped ? th.accent : (dark(th) ? "#4A3E33" : "#8C8476"), "#fff", 30, 400, null, mq); }
    if (me && me.r) actorExtras(ctx, th, me.a, me.st, me.r, t);
  }, (s, f, i, add) => { if (f.cue) add(cueT(s, f.cue, .45, i), "chime"); if (f.crackCue) add(cueT(s, f.crackCue, .85, i), "pop");
    const L = f.left || {}; if (L.actor) keyTimes(s, L.actor.keys, i).forEach(k => { if (k.say != null || k.emote === "!" || k.emote === "?") add(k.T, "pop"); }); });

  /* ================= giftbox ================= */
  TT.layout("giftbox", "Kotak hadiah", (ctx, th, s, t) => {
    const f = s.f, M = mv(), items = f.items || [], n = items.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T0 = at(s, f.openCue, .3), d = t - T0, opened = d >= 0, cx = 540, by = 1250, bw = 380, bh = 250, top = by - bh;
    const tIn = items.map((it, i) => Math.max(at(s, it.cue, .45 + i * .15), T0 + .55 + i * .35));
    const SL = { 1: [[540, 720]], 2: [[320, 760], [760, 760]], 3: [[230, 800], [540, 705], [850, 800]], 4: [[210, 800], [420, 700], [660, 700], [870, 800]] }[Math.min(4, n)] || [];
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // floor shadow
    ctx.fillStyle = dark(th) ? "rgba(0,0,0,.45)" : "rgba(59,36,24,.14)"; ctx.beginPath(); ctx.ellipse(cx, by + 8, bw * .62, 24, 0, 0, TAU); ctx.fill();
    // anticipation wobble
    const ant = opened ? 0 : clamp(1 - (T0 - t) / 3, 0, 1), hop = opened ? 0 : Math.max(0, Math.sin(t * 5.5)) * (8 + 22 * ant), rot = opened ? 0 : Math.sin(t * 13) * (.015 + .05 * ant);
    // light rays from inside
    if (opened){ const a = k01(d, .25, .5); ctx.save(); ctx.globalAlpha *= a * (.75 + .25 * Math.sin(t * 4)); ctx.translate(cx, top);
      for (let k = 0; k < 9; k++){ const ang = -Math.PI / 2 + (k - 4) * .2 + Math.sin(t * .8 + k) * .03, g = ctx.createLinearGradient(0, 0, Math.cos(ang) * 520, Math.sin(ang) * 520);
        g.addColorStop(0, "rgba(255,226,170,.75)"); g.addColorStop(1, "rgba(255,226,170,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0);
        ctx.lineTo(Math.cos(ang + .07) * 520, Math.sin(ang + .07) * 520); ctx.lineTo(Math.cos(ang - .07) * 520, Math.sin(ang - .07) * 520); ctx.closePath(); ctx.fill(); }
      ctx.restore(); }
    ctx.save(); ctx.translate(cx, by - hop); ctx.rotate(rot);
    // box body
    rr(ctx, -bw / 2, -bh, bw, bh, 16); ctx.fillStyle = th.accent; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,.1)"; rr(ctx, bw / 2 - 70, -bh + 6, 64, bh - 12, 10); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.08)"; for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.arc(k * 80, -bh / 2 + (k % 2) * 60, 14, 0, TAU); ctx.fill(); }
    if (opened){ ctx.fillStyle = "#5A2A14"; rr(ctx, -bw / 2 + 10, -bh - 8, bw - 20, 22, 8); ctx.fill(); }
    const rib = opened ? 1 - k01(d, 0, .35) : 1;
    if (rib > 0){ ctx.save(); ctx.globalAlpha *= rib; ctx.fillStyle = "#FCE1C6"; ctx.fillRect(-24, -bh, 48, bh); ctx.restore(); }
    ctx.restore();
    // lid
    { const q = opened ? k01(d, .15, 1.1) : 0, lx = cx + 380 * q, ly = (top - 36 - hop) - 520 * Math.sin(Math.min(1, q * 1.6) * Math.PI / 2) + 260 * q * q, lr = opened ? q * 3.4 : rot;
      if (q < 1){ ctx.save(); ctx.globalAlpha *= 1 - k01(q, .6, .4); ctx.translate(lx, ly); ctx.rotate(lr);
        rr(ctx, -bw / 2 - 22, -36, bw + 44, 72, 14); ctx.fillStyle = "#A0522D"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
        if (rib > 0){ ctx.globalAlpha *= rib; ctx.fillStyle = "#FCE1C6"; ctx.fillRect(-24, -36, 48, 72); }
        ctx.restore(); } }
    // bow
    if (rib > 0){ const ex = opened ? eOut(k01(d, 0, .5)) : 0; ctx.save(); ctx.translate(cx, top - 72 - hop - ex * 120); ctx.rotate(rot + ex * 1.5); ctx.globalAlpha *= 1 - ex;
      [-1, 1].forEach(sd => { ctx.save(); ctx.scale(sd, 1); ctx.rotate(-.35 + Math.sin(t * 3) * .05); ctx.beginPath(); ctx.ellipse(52, -10, 56, 34, -.2, 0, TAU); ctx.fillStyle = "#FCE1C6"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(10, 10); ctx.quadraticCurveTo(40, 60, 30 + ex * 40, 90); ctx.lineWidth = 16; ctx.strokeStyle = "#FCE1C6"; ctx.stroke(); ctx.restore(); });
      ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = "#F4A85C"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
    // tag on the box
    if (f.label){ tag(ctx, th, f.label, cx, by - hop - bh / 2 + 10, "#FFFFFF", INK, 36, 320, INK, 1, rot - .04); }
    // sparkles / question marks before opening
    if (!opened){ for (let k = 0; k < 4; k++){ const a = t * .9 + k * TAU / 4, x = cx + Math.cos(a) * 300, y = top - 60 + Math.sin(a) * 110; ctx.fillStyle = hexA(M.pal[k % 3], .7 + .3 * Math.sin(t * 4 + k)); star(ctx, x, y, 12 + 6 * Math.sin(t * 5 + k)); }
      font(ctx, 800, 70, th.fam); ctx.fillStyle = hexA(th.accent, .55 + .35 * Math.sin(t * 3)); ctx.textAlign = "center"; ctx.fillText("?", cx - 250, top - 70 + Math.sin(t * 2) * 10); ctx.fillText("?", cx + 250, top - 30 + Math.cos(t * 2) * 10); ctx.textAlign = "left"; }
    if (opened) burst(ctx, cx, top - 20, d - .1, M, 16);
    // items jump out
    items.forEach((it, i) => { if (t < tIn[i] || !SL[i]) return; const [sx, sy] = SL[i], u = k01(t, tIn[i], .75), e = eOut(u), x = lerp(cx, sx, e), y = lerp(top + 20, sy, e) - Math.sin(Math.PI * u) * 190 + (u >= 1 ? Math.sin(t * 2.2 + i) * 7 : 0), sc = .35 + .65 * eBack(u);
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate((1 - e) * (i % 2 ? 1 : -1) * 2.5);
      ctx.beginPath(); ctx.arc(0, 0, 74, 0, TAU); ctx.fillStyle = it.bad ? RED : M.pal[(i + 1) % 3]; ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 7; ctx.stroke(); icon(ctx, it.icon || "star", -42, -42, 84, "#fff", 2.3); ctx.restore();
      if (u > .55){ const q = eBack(k01(t, tIn[i] + .4, .35)); tag(ctx, th, it.label || "", sx, sy + 116, "#FFFFFF", it.bad ? RED : INK, 33, n >= 3 ? 290 : 380, hexA(INK, .15), q, 0); }
      if (u >= 1) burst(ctx, sx, sy, t - tIn[i] - .75, M, 8); });
    ctx.restore();
  }, (s, f, i, add) => { const T0 = cueT(s, f.openCue, .3, i); add(T0, "pop"); add(T0 + .3, "chime");
    (f.items || []).forEach((it, k) => add(Math.max(cueT(s, it.cue, .45 + k * .15, i), T0 + .55 + k * .35) + .7, "pop")); });

  /* ================= chess ================= */
  function piece(ctx, kind, col, edge){
    ctx.fillStyle = col; ctx.strokeStyle = edge; ctx.lineWidth = 4; ctx.lineJoin = "round";
    const sh = () => { ctx.fill(); ctx.stroke(); };
    rr(ctx, -36, -16, 72, 16, 6); sh(); rr(ctx, -28, -27, 56, 12, 5); sh();
    const body = (w0, w1, h) => { ctx.beginPath(); ctx.moveTo(-w0, -27); ctx.lineTo(-w1, -27 - h); ctx.lineTo(w1, -27 - h); ctx.lineTo(w0, -27); ctx.closePath(); sh(); };
    if (kind === "rook"){ body(22, 18, 44); ctx.beginPath(); ctx.moveTo(-26, -71); ctx.lineTo(-26, -96); ctx.lineTo(-15, -96); ctx.lineTo(-15, -86); ctx.lineTo(-5, -86); ctx.lineTo(-5, -96); ctx.lineTo(5, -96); ctx.lineTo(5, -86); ctx.lineTo(15, -86); ctx.lineTo(15, -96); ctx.lineTo(26, -96); ctx.lineTo(26, -71); ctx.closePath(); sh(); }
    else if (kind === "knight"){ ctx.beginPath(); ctx.moveTo(-22, -27); ctx.lineTo(-20, -62); ctx.quadraticCurveTo(-14, -96, 8, -100); ctx.lineTo(14, -110); ctx.lineTo(18, -96); ctx.quadraticCurveTo(34, -82, 30, -64); ctx.lineTo(22, -58); ctx.lineTo(8, -64); ctx.quadraticCurveTo(2, -48, 22, -27); ctx.closePath(); sh();
      ctx.fillStyle = edge; ctx.beginPath(); ctx.arc(10, -84, 4, 0, TAU); ctx.fill(); }
    else if (kind === "bishop"){ body(20, 11, 38); ctx.beginPath(); ctx.ellipse(0, -84, 17, 24, 0, 0, TAU); sh(); ctx.beginPath(); ctx.arc(0, -114, 7, 0, TAU); sh(); ctx.beginPath(); ctx.moveTo(-6, -92); ctx.lineTo(8, -78); ctx.stroke(); }
    else if (kind === "queen"){ body(22, 12, 48); ctx.beginPath(); ctx.moveTo(-18, -75); ctx.lineTo(-26, -104); ctx.lineTo(-12, -90); ctx.lineTo(0, -112); ctx.lineTo(12, -90); ctx.lineTo(26, -104); ctx.lineTo(18, -75); ctx.closePath(); sh();
      [-26, 0, 26].forEach(x => { ctx.beginPath(); ctx.arc(x, x ? -106 : -115, 6, 0, TAU); sh(); }); }
    else if (kind === "king"){ body(22, 13, 52); rr(ctx, -20, -98, 40, 22, 8); sh(); rr(ctx, -5, -128, 10, 32, 3); sh(); rr(ctx, -14, -118, 28, 10, 3); sh(); }
    else { body(19, 10, 32); ctx.beginPath(); ctx.arc(0, -74, 17, 0, TAU); sh(); }
    ctx.fillStyle = "rgba(255,255,255,.22)"; rr(ctx, -16, -60, 7, 26, 3); ctx.fill();
  }
  TT.layout("chess", "Catur", (ctx, th, s, t) => {
    const f = s.f, M = mv(), ps = f.pieces || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const S = 112, N = 6, bx = 540 - S * N / 2, by = 612, cc = (c, r) => [bx + c * S + S / 2, by + r * S + S / 2];
    const tm = f.mateCue ? at(s, f.mateCue, .85) : 1e9, dm = t - tm;
    // timeline per piece
    const P = ps.map((p, i) => ({ p, i, moves: (p.moves || []).map((m, k) => ({ to: m.to, T: at(s, m.cue, .3 + k * .2) })).sort((a, b) => a.T - b.T),
      tA: p.cue ? at(s, p.cue, .1) : .15 + i * .07 }));
    const sq = (o, u) => { let c = o.p.at; for (const m of o.moves) if (u >= m.T + .7) c = m.to; return c; };
    const pos = (o, u) => { let c = o.p.at, hop = 0, x, y; for (const m of o.moves){ if (u < m.T) break; const q = k01(u, m.T, .7);
        if (q < 1){ const [x0, y0] = cc(...c), [x1, y1] = cc(...m.to); const e = easeIO(q); return { x: lerp(x0, x1, e), y: lerp(y0, y1, e), hop: Math.sin(Math.PI * q) * 70, moving: true, from: c, to: m.to }; } c = m.to; }
      [x, y] = cc(...c); return { x, y, hop: 0, moving: false }; };
    // captures
    const capT = P.map(() => 1e9);
    P.forEach(o => o.moves.forEach(m => { const Tl = m.T + .7; P.forEach(v => { if (v === o || (v.p.side || "me") === (o.p.side || "me") || capT[v.i] < Tl || Tl < v.tA) return; const c = sq(v, Tl - .01); if (c[0] === m.to[0] && c[1] === m.to[1]) capT[v.i] = Math.min(capT[v.i], Tl); }); }));
    let kingI = f.mate != null ? f.mate : ps.findIndex(p => p.side === "foe" && p.kind === "king"); if (kingI < 0) kingI = ps.findIndex(p => p.side === "foe");
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // board
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,.25)"; rr(ctx, bx - 22, by - 16, S * N + 44, S * N + 44, 26); ctx.fill(); ctx.restore();
    rr(ctx, bx - 22, by - 22, S * N + 44, S * N + 44, 24); ctx.fillStyle = "#5A3A26"; ctx.fill(); ctx.strokeStyle = "#E8B86A"; ctx.lineWidth = 4; ctx.stroke();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){ ctx.fillStyle = (r + c) % 2 ? "#C89B6D" : "#F6E7D3"; ctx.fillRect(bx + c * S, by + r * S, S, S); }
    // move highlights
    P.forEach(o => o.moves.forEach(m => { const dt = t - m.T; if (dt < 0 || dt > 2.6) return; const a = dt < 2 ? 1 : 1 - (dt - 2) / .6, [x1, y1] = cc(...m.to);
      ctx.fillStyle = hexA((o.p.side || "me") === "foe" ? "#3B2418" : th.accent, (.3 + .12 * Math.sin(t * 6)) * a); ctx.fillRect(x1 - S / 2, y1 - S / 2, S, S);
      let from = o.p.at; for (const mm of o.moves){ if (mm === m) break; if (t >= mm.T) from = mm.to; } const [x0, y0] = cc(...from);
      ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = th.accent; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore(); }));
    if (dm >= 0 && kingI >= 0){ const [kx, ky] = cc(...sq(P[kingI], tm)); ctx.fillStyle = `rgba(216,67,21,${.45 + .2 * Math.sin(t * 8)})`; ctx.fillRect(kx - S / 2, ky - S / 2, S, S); }
    // pieces, back rows first
    const draw = P.map(o => ({ o, ps: pos(o, t) })).sort((a, b) => a.ps.y - b.ps.y), labels = [];
    draw.forEach(({ o, ps: q }) => { const p = o.p; if (t < o.tA) return; const ap = eBack(k01(t, o.tA, .45)), ct = t - capT[o.i]; if (ct > 1) return;
      const foe = (p.side || "me") === "foe", isK = o.i === kingI && dm >= 0;
      ctx.save(); let x = q.x, y = q.y + 38 - q.hop - (1 - ap) * 120;
      if (ct >= 0){ x += ct * 300 * (foe ? 1 : -1); y -= Math.sin(ct * Math.PI) * 160 - ct * ct * 200; ctx.globalAlpha *= 1 - ct; }
      ctx.translate(x, y); if (ct >= 0) ctx.rotate(ct * 8);
      if (isK){ ctx.translate(dm < .35 ? Math.sin(dm * 50) * 6 : 0, 0); ctx.rotate(-1.35 * eOut(k01(dm, .2, .5))); }
      const br = 1 + .025 * Math.sin(t * 2.4 + o.i); ctx.scale(ap, ap * br);
      if (q.hop > 0){ ctx.save(); ctx.scale(1, .3); ctx.beginPath(); ctx.arc(0, q.hop * 3.3, 34, 0, TAU); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fill(); ctx.restore(); }
      piece(ctx, p.kind || "pawn", foe ? "#3B2418" : th.accent, foe ? "#E8B86A" : CREAM); ctx.restore();
      if (p.label && ct < 0) labels.push([p.label, x, y - (p.kind === "king" || p.kind === "queen" ? 158 : 135), foe, ap]); });
    labels.forEach(([l, x, y, foe, ap]) => { ctx.save(); ctx.globalAlpha *= clamp(ap, 0, 1); tag(ctx, th, l, x, Math.max(y, 600), foe ? "#3B2418" : "#FFFFFF", foe ? CREAM : INK, 28, 250, foe ? "#E8B86A" : th.accent); ctx.restore(); });
    if (dm >= 0){ const q = eBack(k01(dm, .15, .4)); if (q > 0){ ctx.fillStyle = `rgba(24,16,10,${.3 * k01(dm, .15, .4)})`; rr(ctx, bx, by, S * N, S * N, 6); ctx.fill();
      tag(ctx, th, f.mateLabel || "Skakmat!", 540, by + S * N / 2, RED, "#fff", 62, 640, CREAM, q, -.05); burst(ctx, 540, by + S * N / 2, dm - .15, M, 16); } }
    ctx.restore();
  }, (s, f, i, add) => { (f.pieces || []).forEach(p => (p.moves || []).forEach((m, k) => { const T = cueT(s, m.cue, .3 + k * .2, i); add(T, "whoosh"); add(T + .7, "pop"); }));
    if (f.mateCue) add(cueT(s, f.mateCue, .85, i) + .15, "chime"); });

  /* ================= umbrella ================= */
  TT.layout("umbrella", "Payung", (ctx, th, s, t) => {
    const f = s.f, M = mv(), drops = f.drops || [], B = dark(th); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const x0 = 90, x1 = 990, y0 = 590, y1 = 1330, gy = 1262, sc = .9, To = f.openCue ? at(s, f.openCue, .55) : 1e9, open = t >= To, uq = eBack(k01(t, To, .6));
    const a = ACT(Object.assign({ pose: "cover", expr: "worried", skin: "b" }, f.actor || {}), (f.actor && f.actor.x) || 470), st = actorState(a, s, t);
    if (open){ st.pose = "thumbs"; if (!(f.actor && f.actor.keepExpr)) st.expr = (f.actor && f.actor.openExpr) || "smile"; }
    const hx = st.x + 100 * sc, hy = gy - 310 * sc, ux = hx, rimY = gy - 560 * sc, UR = 255 * Math.max(.05, uq), URy = 135;
    const canopyY = x => { const dx = (x - ux) / 255; return Math.abs(dx) >= 1 ? null : rimY - URy * Math.sqrt(1 - dx * dx); };
    const headTop = gy - 450 * sc;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, x0, y0, x1 - x0, y1 - y0, 40); ctx.save(); ctx.clip();
    let g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, B ? "#1A1612" : "#D6CFC5"); g.addColorStop(1, B ? "#2A231C" : "#EFE8DE"); ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    // clouds
    for (let k = 0; k < 5; k++){ const cx = ((k * 230 + t * (14 + k * 3)) % 1300) - 110, cy = y0 + 40 + (k % 2) * 34; ctx.fillStyle = B ? "rgba(90,78,66,.9)" : "rgba(160,150,138,.85)";
      [[0, 0, 70], [60, -18, 58], [-60, 8, 50], [110, 10, 44]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(cx + dx, cy + dy, r, 0, TAU); ctx.fill(); }); }
    // ground + puddles
    ctx.fillStyle = B ? "#3A3028" : "#C9BEB0"; ctx.fillRect(x0, gy - 6, x1 - x0, y1 - gy + 6);
    ctx.strokeStyle = B ? "rgba(180,200,215,.25)" : "rgba(255,255,255,.6)"; ctx.lineWidth = 3;
    for (let k = 0; k < 7; k++){ const q = ((t * .7 + k * .37) % 1), x = 150 + ((k * 263) % 780), y = gy + 22 + (k % 3) * 18; ctx.globalAlpha = (1 - q) * .9; ctx.beginPath(); ctx.ellipse(x, y, 10 + q * 50, 3 + q * 10, 0, 0, TAU); ctx.stroke(); }
    ctx.globalAlpha = 1;
    // rain streaks
    ctx.strokeStyle = B ? "rgba(180,205,220,.45)" : "rgba(96,120,140,.5)"; ctx.lineWidth = 3; ctx.lineCap = "round";
    for (let k = 0; k < 80; k++){ const x = x0 + ((k * 137.5) % (x1 - x0)), y = y0 + (((k * 311) % 740) + t * 950) % 740; const cy = open ? canopyY(x) : null;
      if (cy != null && y > cy - 4){ if (y < cy + 30){ ctx.beginPath(); ctx.arc(x, cy - 4, 5, Math.PI, TAU); ctx.stroke(); } continue; }
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 30); ctx.stroke(); }
    ctx.restore();
    // actor
    const hits = drops.map((d, i) => at(s, d.cue, .12 + i * .2) + 1.0);
    hits.forEach(hT => { if (!open || hT < To) { if (t >= hT && t - hT < 1){ st.shakeT = hT; } } });
    const r = drawActor(ctx, th, a, st, t, gy, sc);
    // umbrella
    if (open){ ctx.save(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hx, hy + 40); ctx.lineTo(hx, rimY - URy * uq + 10); ctx.stroke();
      ctx.beginPath(); ctx.arc(hx - 18, hy + 40, 18, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(ux, rimY, UR, URy * uq, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = th.accent; ctx.fill();
      for (let k = 0; k < 6; k++){ if (k % 2) continue; const a0 = Math.PI + k * Math.PI / 6, a1 = a0 + Math.PI / 6; ctx.beginPath(); ctx.moveTo(ux, rimY - URy * uq); ctx.lineTo(ux + Math.cos(a0) * UR, rimY); ctx.lineTo(ux + Math.cos(a1) * UR, rimY); ctx.closePath(); ctx.fillStyle = "#E89544"; ctx.fill(); }
      ctx.fillStyle = th.accent; for (let k = 0; k < 6; k++){ const xa = ux - UR + (k + .5) * UR / 3; ctx.beginPath(); ctx.ellipse(xa, rimY, UR / 6, 14 * uq, 0, 0, Math.PI); ctx.fill(); }
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(ux, rimY, UR, URy * uq, 0, Math.PI, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(ux, rimY - URy * uq - 8, 9, 0, TAU); ctx.fillStyle = INK; ctx.fill();
      if (f.label && uq > .6){ ctx.save(); ctx.globalAlpha *= k01(t, To + .3, .3); const { sz, lines } = fit(ctx, th, f.label, 36, 300, 1); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(lines[0], ux, rimY - 40); ctx.textAlign = "left"; ctx.restore(); }
      ctx.restore(); burst(ctx, ux, rimY - 60, t - To, M, 14); }
    // problem drops
    const restN = [0, 0];
    drops.forEach((d, i) => { const T = hits[i] - 1.0; if (t < T) return; const blocked = open && hits[i] >= To + .3, side = i % 2 ? 1 : -1;
      font(ctx, 700, 28, th.fam); const tw = Math.min(250, ctx.measureText(d.label || "").width), w = tw + 92, h = 66;
      const restX = clamp((blocked ? ux : st.x) + side * 330, 90 + w / 2, 990 - w / 2), restY = 1292 - restN[side > 0 ? 1 : 0]++ * 74;
      const sx = (blocked ? ux : st.x) + [-60, 90, -20, 50][i % 4], hitY = blocked ? (canopyY(sx) ?? rimY) - h / 2 : headTop - h / 2 + 6;
      let x, y, rot = 0; const u = t - T;
      if (u < 1){ const q = u * u; x = sx; y = lerp(y0 + 20, hitY, q); rot = Math.sin(t * 4 + i) * .1; }
      else if (blocked && u < 1.7){ const q = easeIO((u - 1) / .7), ex = ux + side * (255 + w / 2 - 20); x = lerp(sx, ex, q); y = (canopyY(clamp(x, ux - 250, ux + 250)) ?? rimY) - h / 2 + q * 20; rot = side * q * .5; }
      else { const u0 = blocked ? 1.7 : 1, dur = .7, q = k01(u, u0, dur), fx = blocked ? ux + side * (255 + w / 2 - 20) : sx, fy = blocked ? rimY - h / 2 + 20 : hitY;
        x = lerp(fx, restX, eOut(q)); y = lerp(fy, restY, q * q) - (blocked ? 0 : Math.sin(Math.PI * q) * 120); rot = lerp(blocked ? side * .5 : 0, side * .06, q) + (blocked ? 0 : side * Math.sin(Math.PI * q) * .8); }
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = blocked ? hexA(INK, .25) : RED; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.arc(-w / 2 + 34, 0, 24, 0, TAU); ctx.fillStyle = blocked ? "#8C8476" : RED; ctx.fill(); icon(ctx, d.icon || "alert", -w / 2 + 18, -16, 32, "#fff", 2.4);
      font(ctx, 700, 28, th.fam); const { lines } = fit(ctx, th, d.label || "", 28, 250, 1, 700); ctx.fillStyle = INK; ctx.fillText(lines[0], -w / 2 + 70, 10); ctx.restore();
      if (!blocked && u >= 1 && u < 1.9){ emoteAt(ctx, th, "sweat", (r ? r.headX : st.x) + 70, headTop + 20, u - 1, t); }
      if (blocked && u >= 1 && u < 1.6) burst(ctx, sx, hitY, u - 1, M, 6); });
    if (r) actorExtras(ctx, th, a, st, r, t);
    ctx.restore();
  }, (s, f, i, add) => { const To = f.openCue ? cueT(s, f.openCue, .55, i) : 1e9; if (f.openCue){ add(To, "whoosh"); add(To + .2, "chime"); }
    (f.drops || []).forEach((d, k) => { const T = cueT(s, d.cue, .12 + k * .2, i); add(T + 1, T + 1 >= To + .3 ? "ping" : "pop"); }); });

  /* ================= lens ================= */
  const DOC = { x: 170, y: 615, w: 740, h: 690 };
  function tiny(ctx, th, text, x, y, danger, noBg){ font(ctx, 800, 15, th.fam); const ls = wrap(ctx, text, 118), w = Math.max(...ls.map(l => ctx.measureText(l).width)) + 10, h = ls.length * 17 + 6;
    if (!noBg){ rr(ctx, x - w / 2, y - h / 2, w, h, 4); ctx.fillStyle = danger ? "#FDE3D8" : "#FFF3E0"; ctx.fill(); }
    ctx.fillStyle = danger ? RED : INK; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ls.forEach((l, i) => ctx.fillText(l, x, y + (i - (ls.length - 1) / 2) * 17)); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; }
  function bars(ctx, x, y, ws, gap, col){ ctx.fillStyle = col || "rgba(59,36,24,.16)"; ws.forEach((w, i) => { rr(ctx, x, y + i * gap, w, 12, 6); ctx.fill(); }); }
  function germ(ctx, x, y, r, t, k){ ctx.save(); ctx.translate(x, y); ctx.rotate(t * .6 + k); ctx.fillStyle = "#4E9A4F"; ctx.beginPath(); for (let j = 0; j < 16; j++){ const rad = j % 2 ? r : r * 1.32; ctx.lineTo(Math.cos(j * TAU / 16) * rad, Math.sin(j * TAU / 16) * rad); } ctx.closePath(); ctx.fill();
    ctx.rotate(-(t * .6 + k)); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-r * .3, -r * .15, r * .22, 0, TAU); ctx.arc(r * .3, -r * .15, r * .22, 0, TAU); ctx.fill(); ctx.fillStyle = "#18150f"; ctx.beginPath(); ctx.arc(-r * .3, -r * .12, r * .1, 0, TAU); ctx.arc(r * .3, -r * .12, r * .1, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#18150f"; ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(0, r * .2, r * .25, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); ctx.restore(); }
  function drawDoc(ctx, th, f, t){
    const d = f.doc || {}, k = d.kind || "doc", { x, y, w, h } = DOC, sp = f.spots || [], M = mv();
    const SP = i => [x + sp[i].x * w, y + sp[i].y * h];
    if (k === "hand"){ const cx = 540, cy = 1040, sk = "#E2A77C", ed = "#B5774F";
      ctx.fillStyle = sk; ctx.strokeStyle = ed; ctx.lineWidth = 6;
      [[-120, 230, 54], [-40, 270, 58], [40, 262, 56], [118, 215, 50]].forEach(([dx, len, fw]) => { rr(ctx, cx + dx - fw / 2, cy - 150 - len, fw, len + 80, fw / 2); ctx.fill(); ctx.stroke(); });
      ctx.save(); ctx.translate(cx - 190, cy - 10); ctx.rotate(-.75); rr(ctx, -30, -170, 62, 210, 31); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.beginPath(); ctx.ellipse(cx, cy, 190, 205, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = sk; ctx.fillRect(cx - 150, cy - 200, 300, 120);
      ctx.strokeStyle = "rgba(150,90,60,.35)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - 120, cy - 40); ctx.quadraticCurveTo(cx, cy + 10, cx + 130, cy - 70); ctx.moveTo(cx - 130, cy + 40); ctx.quadraticCurveTo(cx - 20, cy + 60, cx + 90, cy + 10); ctx.stroke();
      sp.forEach((s2, i) => { const [px, py] = SP(i); germ(ctx, px, py - 6, 8, t, i); tiny(ctx, th, s2.text || s2.label, px, py + 18, s2.danger, true); });
      return; }
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    if (k === "idcard"){ rr(ctx, x, y + 120, w, 450, 30); ctx.fillStyle = "#F7EFE4"; ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, x, y + 120, w, 450, 30); ctx.clip(); ctx.fillStyle = th.accent; ctx.fillRect(x, y + 120, w, 76); ctx.fillStyle = "rgba(194,105,31,.08)"; for (let k2 = 0; k2 < 6; k2++){ ctx.beginPath(); ctx.arc(x + 120 + k2 * 110, y + 420, 90, 0, TAU); ctx.fill(); } ctx.restore();
      font(ctx, 800, 32, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(d.title || "KARTU IDENTITAS", x + w / 2, y + 170); ctx.textAlign = "left";
      rr(ctx, x + w - 210, y + 230, 170, 210, 14); ctx.fillStyle = "#D9CFC2"; ctx.fill(); ctx.fillStyle = "#A89A88"; ctx.beginPath(); ctx.arc(x + w - 125, y + 310, 42, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + w - 125, y + 430, 70, 60, 0, Math.PI, TAU); ctx.fill();
      for (let r2 = 0; r2 < 6; r2++){ ctx.fillStyle = "rgba(59,36,24,.28)"; rr(ctx, x + 40, y + 232 + r2 * 46, 110, 12, 6); ctx.fill(); ctx.fillStyle = "rgba(59,36,24,.14)"; rr(ctx, x + 170, y + 232 + r2 * 46, 260 - (r2 % 3) * 40, 12, 6); ctx.fill(); }
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + w - 200, y + 520); ctx.bezierCurveTo(x + w - 170, y + 470, x + w - 140, y + 550, x + w - 110, y + 500); ctx.quadraticCurveTo(x + w - 80, y + 470, x + w - 60, y + 515); ctx.stroke(); }
    else { rr(ctx, x, y, w, h, 26); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore();
      if (k === "post"){ ctx.beginPath(); ctx.arc(x + 60, y + 58, 32, 0, TAU); ctx.fillStyle = th.accent; ctx.fill(); icon(ctx, "users", x + 40, y + 38, 40, "#fff", 2.4);
        font(ctx, 800, 28, th.fam); ctx.fillStyle = INK; ctx.fillText(d.title || "kamu", x + 110, y + 52); bars(ctx, x + 110, y + 66, [120], 0);
        const px = x + 30, py = y + 110, pw = w - 60, ph = 380; ctx.save(); rr(ctx, px, py, pw, ph, 16); ctx.clip();
        let g = ctx.createLinearGradient(0, py, 0, py + ph); g.addColorStop(0, "#F3DEC4"); g.addColorStop(1, "#E9C9A8"); ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph);
        rr(ctx, px + 40, py + 30, 200, 150, 10); ctx.fillStyle = "#CFE7EE"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.stroke();
        ctx.fillStyle = "#B5643C"; ctx.fillRect(px, py + 280, pw, 26); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(px + 40, py + 306, 18, 80); ctx.fillRect(px + pw - 60, py + 306, 18, 80);
        rr(ctx, px + 300, py + 140, 250, 150, 10); ctx.fillStyle = "#544E42"; ctx.fill(); rr(ctx, px + 312, py + 152, 226, 118, 6); ctx.fillStyle = "#9FD3E0"; ctx.fill(); rr(ctx, px + 280, py + 274, 290, 12, 6); ctx.fillStyle = "#3B2418"; ctx.fill();
        ctx.save(); ctx.translate(px + 130, py + 250); ctx.rotate(-.08); ctx.fillStyle = "#fff"; ctx.fillRect(-60, -40, 120, 70); bars(ctx, -48, -28, [90, 70, 80], 18, "rgba(59,36,24,.25)"); ctx.restore();
        rr(ctx, px + pw - 110, py + 230, 46, 52, 8); ctx.fillStyle = th.accent; ctx.fill(); ctx.restore();
        icon(ctx, "heart", x + 36, y + 512, 40, RED, 2.4); icon(ctx, "chat", x + 96, y + 512, 40, INK, 2.4); bars(ctx, x + 36, y + 580, [560, 460, 300], 30); }
      else if (k === "chat"){ ctx.save(); rr(ctx, x, y, w, h, 26); ctx.clip(); ctx.fillStyle = th.accent; ctx.fillRect(x, y, w, 80); ctx.fillStyle = "#FBF3E9"; ctx.fillRect(x, y + 80, w, h - 80); ctx.restore();
        icon(ctx, "users", x + 30, y + 18, 44, "#fff", 2.4); font(ctx, 800, 30, th.fam); ctx.fillStyle = "#fff"; ctx.fillText(d.title || "Grup Kerja", x + 90, y + 52);
        [[0, 110, 420, 92], [1, 225, 360, 76], [0, 325, 470, 110], [1, 460, 400, 92], [0, 575, 330, 76]].forEach(([rt, yy, bw2, bh2]) => { const bx2 = rt ? x + w - 30 - bw2 : x + 30; rr(ctx, bx2, y + yy, bw2, bh2, 20); ctx.fillStyle = rt ? "#FCE1C6" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "rgba(59,36,24,.08)"; ctx.lineWidth = 2; ctx.stroke();
          bars(ctx, bx2 + 22, y + yy + 22, [bw2 * .7, bw2 * .5, bw2 * .6].slice(0, Math.floor(bh2 / 36)), 26); }); }
      else { ctx.save(); rr(ctx, x, y, w, h, 26); ctx.clip(); ctx.fillStyle = th.accent; ctx.fillRect(x, y, w, 84); ctx.restore();
        icon(ctx, d.icon || "file", x + 30, y + 20, 44, "#fff", 2.4); font(ctx, 800, 32, th.fam); ctx.fillStyle = "#fff"; ctx.fillText(d.title || "Dokumen", x + 90, y + 54);
        for (let r2 = 0; r2 < 12; r2++) bars(ctx, x + 40, y + 120 + r2 * 46, [[620, 560, 600, 400][r2 % 4]], 0); }
    }
    sp.forEach((s2, i) => { const [px, py] = SP(i); tiny(ctx, th, s2.text || s2.label, px, py, s2.danger); });
  }
  TT.layout("lens", "Kaca pembesar", (ctx, th, s, t) => {
    const f = s.f, M = mv(), sp = f.spots || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { x, y, w, h } = DOC, SP = i => [x + sp[i].x * w, y + sp[i].y * h], R0 = 160, Z = 2.4;
    const T = sp.map((p, i) => at(s, p.cue, .15 + i * .7 / Math.max(1, sp.length))), order = T.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
    const wander = u => [540 + Math.sin(u * .85) * 210, 950 + Math.sin(u * 1.2 + 1) * 160];
    const posAt = (u, dd) => { let last = -1; for (const [v, i] of order) if (u >= v) last = i; if (last < 0 || dd > 8) return wander(u);
      const from = posAt(T[last] - 1e-3, dd + 1), to = SP(last), q = easeIO(k01(u, T[last], .7)); return [lerp(from[0], to[0], q) + (q >= 1 ? Math.sin(u * 2.4) * 5 : 0), lerp(from[1], to[1], q) + (q >= 1 ? Math.cos(u * 2) * 5 : 0)]; };
    const cur = (() => { let c = -1; for (const [v, i] of order) if (t >= v) c = i; return c; })();
    const ts = f.stampCue ? at(s, f.stampCue, .85) : 1e9;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    if ((f.doc || {}).kind === "hand") panel(ctx, th, 600, 1330);
    drawDoc(ctx, th, f, t);
    // revealed markers (spots the lens has already visited)
    sp.forEach((p, i) => { if (t < T[i] + .7) return; const [px, py] = SP(i), pulse = 1 + .08 * Math.sin(t * 4 + i);
      ctx.strokeStyle = p.danger ? RED : th.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(px, py, 78 * pulse, 40 * pulse, 0, 0, TAU); ctx.stroke(); });
    sp.forEach((p, i) => { if (i === cur || t < T[i] + .7) return; const [px, py] = SP(i), q = eBack(k01(t, Math.max(T[i] + .7, Math.min(1e9, ...T.filter(v => v > T[i]))), .35));
      tag(ctx, th, p.label, px, py + 66, p.danger ? RED : th.accent, "#fff", 31, 340, CREAM, q); });
    // lens
    const [lx, ly] = posAt(t, 0), hAng = (ly > 1000 ? -1 : 1) * (lx > 560 ? Math.PI * .75 : Math.PI * .25), lz = 1 + .03 * Math.sin(t * 3);
    ctx.save(); ctx.translate(lx, ly); ctx.rotate(hAng); rr(ctx, R0 + 4, -18, 190, 36, 18); ctx.fillStyle = "#5A3A26"; ctx.fill(); ctx.strokeStyle = "#E8B86A"; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = th.accent; ctx.fillRect(R0 + 40, -18, 22, 36); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, R0, 0, TAU); ctx.clip(); ctx.fillStyle = (f.doc || {}).kind === "hand" ? (dark(th) ? "#2A2622" : "#F3EADF") : "#FFFFFF"; ctx.fillRect(lx - R0, ly - R0, 2 * R0, 2 * R0);
    ctx.translate(lx, ly); ctx.scale(Z * lz, Z * lz); ctx.translate(-lx, -ly); drawDoc(ctx, th, f, t); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, R0, 0, TAU); const gl = ctx.createRadialGradient(lx - 60, ly - 70, 10, lx, ly, R0); gl.addColorStop(0, "rgba(255,255,255,.35)"); gl.addColorStop(.5, "rgba(255,255,255,0)"); gl.addColorStop(1, "rgba(160,200,210,.18)"); ctx.fillStyle = gl; ctx.fill();
    ctx.lineWidth = 20; ctx.strokeStyle = "#3B2418"; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = "#E8B86A"; ctx.beginPath(); ctx.arc(lx, ly, R0 - 12, 0, TAU); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(lx, ly, R0 - 34, Math.PI * 1.1, Math.PI * 1.4); ctx.stroke(); ctx.restore();
    if (cur >= 0) burst(ctx, lx, ly, t - T[cur] - .7, M, 10);
    if (f.stamp && t >= ts){ const q = k01(t, ts, .35), sc = 2.2 - 1.2 * eOut(q); ctx.save(); ctx.globalAlpha *= clamp(q * 2, 0, 1); ctx.translate(540, y + h * .5); ctx.rotate(-.18); ctx.scale(sc, sc);
      const { sz, lines } = fit(ctx, th, f.stamp, 58, 560, 1); const tw = ctx.measureText(lines[0]).width + 60; rr(ctx, -tw / 2, -sz * .95, tw, sz * 1.75, 16); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fill(); ctx.strokeStyle = f.stampOk ? GREEN : RED; ctx.lineWidth = 10; ctx.stroke();
      ctx.fillStyle = f.stampOk ? GREEN : RED; ctx.textAlign = "center"; ctx.fillText(lines[0], 0, sz * .33); ctx.textAlign = "left"; ctx.restore(); }
    ctx.restore();
  }, (s, f, i, add) => { const sp = f.spots || []; sp.forEach((p, k) => { const T = cueT(s, p.cue, .15 + k * .7 / Math.max(1, sp.length), i); add(T, "whoosh"); add(T + .7, "ping"); });
    if (f.stamp && f.stampCue) add(cueT(s, f.stampCue, .85, i), "pop"); });
})();
