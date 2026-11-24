/* Scene pack set6e: train, tugwar, jenga, switchboard, mixbowl, queue, firework.
   Runs after motion-tangani.js in its own <script>. Canvas 1080x1920, visuals in y ~560-1330. */
(() => {
  'use strict';
  const { cueT, popS, label, disc, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, sceneDur, panel, pill, mv, easeIO, TAU, G, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const CREAM = "#FFF7EE", GREEN = "#3BB273", RED = "#D84315", WOOD = "#D9A066", WOOD2 = "#8E4E2E", GOLD = "#FFD166", TEAL = "#2F6F73";
  const md = (a, m) => ((a % m) + m) % m;
  const hsh = k => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const PEOPLE = [{ hair: "short", shirt: "#2F6F73", skin: "a" }, { hair: "hijab", hijab: "#A0522D", shirt: "#E89544", skin: "b" },
    { hair: "long", shirt: "#C2691F", skin: "d" }, { hair: "short", shirt: "#544E42", skin: "c", glasses: true }, { hair: "long", shirt: "#A0522D", skin: "a" }];

  // wrap text into at most maxLines lines that fit maxW, shrinking the font when needed
  function wrapFit(ctx, th, text, maxW, size, weight, maxLines, minSize){
    let sz = size;
    for (;;){
      font(ctx, weight, sz, th.fam);
      const lines = [];
      String(text || "").split("\n").forEach(par => { let cur = "";
        par.split(/\s+/).filter(Boolean).forEach(w => { const tr = cur ? cur + " " + w : w; if (!cur || ctx.measureText(tr).width <= maxW) cur = tr; else { lines.push(cur); cur = w; } });
        if (cur) lines.push(cur); });
      const ok = lines.length <= maxLines && lines.every(l => ctx.measureText(l).width <= maxW);
      if (ok || sz <= (minSize || 18)) return { lines: lines.slice(0, maxLines), size: sz };
      sz -= 2;
    }
  }
  // centred multi-line label in a rounded box; returns {w,h}
  function tag(ctx, th, text, cx, cy, maxW, o){
    o = o || {}; const { lines, size } = wrapFit(ctx, th, text, maxW - 30, o.size || 28, o.weight || 700, o.lines || 2, 16);
    font(ctx, o.weight || 700, size, th.fam); const lh = size * 1.16, w = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width)) + 32), h = lines.length * lh + 22;
    if (o.bg !== "none"){ rr(ctx, cx - w / 2, cy - h / 2, w, h, Math.min(22, h / 2)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 4; ctx.stroke(); } }
    ctx.fillStyle = o.fg || INK; ctx.textAlign = "center";
    lines.forEach((l, i) => ctx.fillText(l, cx, cy - h / 2 + 11 + lh * (i + .5) + size * .36)); ctx.textAlign = "left";
    return { w, h };
  }
  function checkBadge(ctx, x, y, r, q){ if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-r * .42, 0); ctx.lineTo(-r * .1, r * .32); ctx.lineTo(r * .45, -r * .32); ctx.stroke(); ctx.restore(); }
  function crossBadge(ctx, x, y, r, q){ if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-r * .35, -r * .35); ctx.lineTo(r * .35, r * .35); ctx.moveTo(r * .35, -r * .35); ctx.lineTo(-r * .35, r * .35); ctx.stroke(); ctx.restore(); }
  function puff(ctx, x, y, r, a){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.arc(x + r * .7, y + r * .2, r * .75, 0, TAU); ctx.arc(x - r * .7, y + r * .25, r * .7, 0, TAU); ctx.fillStyle = `rgba(150,140,128,${a})`; ctx.fill(); }

  /* ======================= train ======================= */
  // f: headline, highlight, loco (label), locoIcon, cars:[{label, icon, cue, detachCue}], station:{label, cue}
  const trainTimes = (s, f, i) => { const cars = (f.cars || []).slice(0, 4);
    return { cars: cars.map((c, k) => at(s, c.cue, .15 + k * .2, i)), det: cars.map(c => c.detachCue ? at(s, c.detachCue, .8, i) : 1e9), st: f.station && f.station.cue ? at(s, f.station.cue, .75, i) : 1e9 }; };
  function wheel(ctx, x, y, r, a){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, r * .72, 0, TAU); ctx.fillStyle = "#8C8476"; ctx.fill();
    ctx.strokeStyle = CREAM; ctx.lineWidth = 4; for (let k = 0; k < 3; k++){ const b = a + k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x - Math.cos(b) * r * .7, y - Math.sin(b) * r * .7); ctx.lineTo(x + Math.cos(b) * r * .7, y + Math.sin(b) * r * .7); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y, r * .2, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); }
  TT.layout("train", "Kereta gerbong", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const cars = (f.cars || []).slice(0, 4), n = cars.length, T = trainTimes(s, f), dark = th.key === "B";
    const y0 = f.headline ? 600 : 570, y1 = 1325, rail = 1150, V0 = 330, D = 2.2, ts = T.st;
    const dist = x => x < ts ? V0 * x : (x - ts < D ? V0 * ts + V0 * ((x - ts) - (x - ts) ** 2 / (2 * D)) : V0 * ts + V0 * D / 2);
    const d = dist(t), moving = t < ts + D, arrived = t >= ts + D;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, 90, y0, 900, y1 - y0, 44); ctx.fillStyle = dark ? "#1F1A14" : "#FDF6EC"; ctx.fill(); ctx.save(); ctx.clip();
    // sky: sun + clouds + hills (parallax)
    ctx.beginPath(); ctx.arc(820, y0 + 120, 60, 0, TAU); ctx.fillStyle = hexA("#F4A85C", dark ? .35 : .5); ctx.fill();
    for (let k = 0; k < 3; k++){ const x = 90 + md(k * 380 - d * .12, 1200) - 120, y = y0 + 80 + k * 55; ctx.fillStyle = dark ? "rgba(250,248,243,.08)" : "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.ellipse(x, y, 70, 22, 0, 0, TAU); ctx.ellipse(x + 40, y - 14, 40, 22, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = dark ? "rgba(250,248,243,.06)" : hexA(M.pal[4], .22); ctx.beginPath(); ctx.moveTo(90, rail);
    for (let x = 90; x <= 990; x += 10) ctx.lineTo(x, rail - 190 - Math.sin((x + d * .25) * .007) * 70 - Math.sin((x + d * .25) * .021) * 22); ctx.lineTo(990, rail); ctx.closePath(); ctx.fill();
    // station (scrolls in, stops behind the locomotive)
    if (f.station){ const sx = 700 + (dist(ts + D) - d);
      if (sx < 1400){ ctx.fillStyle = dark ? "#3A2C22" : "#E9C9A8"; ctx.fillRect(sx - 300, rail - 46, 600, 46); ctx.fillStyle = hexA("#C2691F", .6); ctx.fillRect(sx - 300, rail - 50, 600, 8);
        ctx.fillStyle = "#8E4E2E"; [-250, 250].forEach(o => ctx.fillRect(sx + o - 9, y0 + 175, 18, rail - 46 - y0 - 175));
        ctx.beginPath(); ctx.moveTo(sx - 310, y0 + 180); ctx.lineTo(sx, y0 + 120); ctx.lineTo(sx + 310, y0 + 180); ctx.closePath(); ctx.fillStyle = th.accent; ctx.fill();
        ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx - 60, y0 + 175); ctx.lineTo(sx - 60, y0 + 205); ctx.moveTo(sx + 60, y0 + 175); ctx.lineTo(sx + 60, y0 + 205); ctx.stroke();
        tag(ctx, th, f.station.label || "Stasiun", sx, y0 + 245, 380, { bg: CREAM, stroke: INK, size: 32, lines: 1 });
        if (arrived) burst(ctx, sx, y0 + 245, t - ts - D, M, 12); } }
    // ground, rails, poles
    ctx.fillStyle = dark ? "#2A2119" : "#EAD9C4"; ctx.fillRect(90, rail + 8, 900, y1 - rail);
    for (let k = 0; k < 16; k++){ const x = 90 + md(k * 64 - d, 1024) - 32; ctx.fillStyle = dark ? "#4A3628" : "#B5643C"; ctx.fillRect(x, rail + 4, 34, 18); }
    ctx.fillStyle = dark ? "#8C8476" : "#544E42"; ctx.fillRect(90, rail, 900, 7);
    // cars
    const locoX = 730, cw = Math.min(190, (locoX - 14 - 110 - 14 * n) / Math.max(1, n)), carH = 124;
    const detT = k => Math.min(...T.det.slice(0, k + 1));
    const sh = moving ? Math.sin(t * 16) * 1.5 : 0;
    cars.forEach((c, k) => { const tc = T.cars[k]; if (t < tc) return;
      const right = locoX - 14 - k * (cw + 14), q = eOut(clamp((t - tc) / .8, 0, 1)), dtd = t - detT(k);
      let ox = -(1 - q) * 900 + (q >= 1 && t - tc < 1 ? Math.sin((t - tc - .8) * 30) * 6 * (1 - (t - tc - .8) * 5) : 0);
      if (dtd > 0) ox -= 140 * dtd * dtd;
      const x = right - cw + ox, top = rail - 22 - carH, col = M.pal[k % 3];
      ctx.save(); ctx.translate(0, k % 2 ? sh : -sh);
      ctx.fillStyle = "#3B2418"; ctx.fillRect(x + cw - 4, rail - 56, 22 + (dtd > 0 ? -18 : 0), 10);
      rr(ctx, x, top, cw, carH, 16); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 5; ctx.stroke();
      rr(ctx, x - 6, top - 14, cw + 12, 22, 10); ctx.fillStyle = "#A0522D"; ctx.fill();
      ctx.beginPath(); ctx.arc(x + cw / 2, top + carH / 2 - 2, 38, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); icon(ctx, c.icon || "file", x + cw / 2 - 24, top + carH / 2 - 26, 48, col, 2.6);
      const wa = d / 22; wheel(ctx, x + 34, rail - 16, 22, wa); wheel(ctx, x + cw - 34, rail - 16, 22, wa);
      ctx.restore();
      const tq = clamp((t - tc - .5) / .4, 0, 1); if (tq > 0){ ctx.save(); ctx.globalAlpha *= tq; const tw = tag(ctx, th, c.label, x + cw / 2, 1240, cw + 12, { size: 30, stroke: dtd > 0 ? RED : hexA(INK, .18), lw: 3 });
        if (arrived && dtd < 0) checkBadge(ctx, x + cw / 2 + tw.w / 2 - 8, 1240 - tw.h / 2 + 2, 20, eBack(clamp((t - ts - D - .2 - k * .15) / .4, 0, 1)));
        ctx.restore(); }
      if (dtd > 0 && dtd < 2.2){ ctx.save(); ctx.globalAlpha *= 1 - clamp((dtd - 1.6) / .6, 0, 1); pill(ctx, th, f.detachLabel || "Lepas!", clamp(x + cw / 2, 200, 880), top - 50, RED, "#fff", 30); ctx.restore(); } });
    // locomotive
    const le = eOut(clamp((t - .05) / .9, 0, 1)), lx = locoX - (1 - le) * 950;
    ctx.save(); ctx.translate(lx, sh);
    rr(ctx, 0, rail - 250, 100, 228, 12); ctx.fillStyle = "#A0522D"; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 5; ctx.stroke();
    rr(ctx, -10, rail - 268, 120, 26, 10); ctx.fillStyle = "#3B2418"; ctx.fill();
    rr(ctx, 18, rail - 228, 64, 58, 10); ctx.fillStyle = "#CFE7EE"; ctx.fill();
    rr(ctx, 96, rail - 150, 140, 128, 30); ctx.fillStyle = th.accent; ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#3B2418"; ctx.fillRect(110, rail - 150, 10, 128); ctx.fillRect(170, rail - 150, 10, 128);
    rr(ctx, 186, rail - 214, 34, 68, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); rr(ctx, 178, rail - 222, 50, 16, 6); ctx.fill();
    ctx.beginPath(); ctx.arc(236, rail - 92, 13, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
    ctx.beginPath(); ctx.moveTo(236, rail - 40); ctx.lineTo(256, rail - 8); ctx.lineTo(206, rail - 8); ctx.closePath(); ctx.fillStyle = "#3B2418"; ctx.fill();
    const wa = d / 30; wheel(ctx, 40, rail - 22, 30, wa); wheel(ctx, 140, rail - 18, 22, wa); wheel(ctx, 200, rail - 18, 22, wa);
    if (f.locoIcon){ ctx.beginPath(); ctx.arc(50, rail - 110, 30, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); icon(ctx, f.locoIcon, 30, rail - 130, 40, "#A0522D", 2.6); }
    ctx.restore();
    // smoke
    for (let k = 0; k < 7; k++){ const q = md(t * (moving ? 1.1 : .5) + k / 7, 1), sp = moving ? 1 : .25; puff(ctx, lx + 203 - q * 260 * sp, rail - 232 - q * 150, 12 + q * 26, .55 * (1 - q)); }
    if (t > ts + D && t < ts + D + 1.4){ const q = (t - ts - D) / 1.4; for (let k = 0; k < 5; k++) puff(ctx, lx + 240 + k * 22 * q, rail - 60 - k * 18 * q, 14 + q * 20, .5 * (1 - q)); }
    ctx.restore(); // clip
    if (f.loco){ const q = clamp((t - .6) / .4, 0, 1); ctx.save(); ctx.globalAlpha *= q; tag(ctx, th, f.loco, lx + 128, 1240, 250, { bg: th.accent, fg: "#FFFFFF", size: 28 }); ctx.restore(); }
    ctx.restore();
  }, (s, f, i, add) => { const T = trainTimes(s, f, i); add(.1, "whoosh"); T.cars.forEach(x => { add(x, "whoosh"); add(x + .8, "pop"); }); T.det.forEach(x => { if (x < 1e8) add(x, "whoosh"); }); if (T.st < 1e8) add(T.st + 2.2, "chime"); });

  /* ======================= tugwar ======================= */
  // f: headline, highlight, left:{label, people:[look]}, right:{...}, start, moves:[{cue,pos}] (pos -1..1, <0 = left wins ground),
  //    winCue, win:"left"|"right", verdict
  function tugPos(s, f, t, idx){ const mv0 = keyTimes(s, f.moves, idx); let cur = f.start || 0;
    for (let k = 0; k < mv0.length; k++){ const m = mv0[k]; if (t < m.T) break; const val = T => cur + (m.pos - cur) * easeIO(clamp((T - m.T) / 1.1, 0, 1));
      if (k + 1 < mv0.length && t >= mv0[k + 1].T){ cur = val(mv0[k + 1].T); continue; } return val(t); }
    return cur; }
  TT.layout("tugwar", "Tarik tambang", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const gy = 1268, sc = .84, dark = th.key === "B", pos = tugPos(s, f, t), tw = f.winCue ? at(s, f.winCue, .8) : 1e9, won = t >= tw;
    const mvs = keyTimes(s, f.moves); const pulling = mvs.some(m => t >= m.T && t < m.T + 1.1);
    const jit = Math.sin(t * 9) * (pulling ? 7 : 3), off = pos * 150 + jit;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // ground + centre line
    ctx.fillStyle = dark ? "rgba(250,248,243,.08)" : hexA(INK, .08); rr(ctx, 90, gy - 10, 900, 60, 30); ctx.fill();
    ctx.fillStyle = hexA(TEAL, dark ? .35 : .18); rr(ctx, 90, gy - 10, 450, 60, 30); ctx.fill();
    ctx.fillStyle = hexA("#C2691F", dark ? .35 : .18); rr(ctx, 540, gy - 10, 450, 60, 30); ctx.fill();
    ctx.setLineDash([16, 12]); ctx.strokeStyle = th.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(540, gy - 330); ctx.lineTo(540, gy + 50); ctx.stroke(); ctx.setLineDash([]);
    const sides = [[-1, f.left || {}, [PEOPLE[0], PEOPLE[1], PEOPLE[3]], TEAL], [1, f.right || {}, [PEOPLE[2], PEOPLE[4], PEOPLE[1]], "#C2691F"]];
    const hands = []; let ropeY = gy - 250;
    sides.forEach(([side, S, def, col]) => {
      const ppl = (S.people || def.slice(0, 2)).slice(0, 3), m = ppl.length, spc = m === 3 ? 118 : 140, winning = pos * side > .25 || (won && f.win === (side < 0 ? "left" : "right"));
      const winner = won && f.win === (side < 0 ? "left" : "right"), loser = won && f.win && !winner;
      const th0 = winner ? -.08 : loser ? .12 : -(.13 + (winning ? .07 : 0));
      ppl.forEach((p, k) => {
        const X0 = 540 + side * (170 + k * spc), a = Object.assign({}, PEOPLE[(k + (side > 0 ? 2 : 0)) % 5], p, { x: X0, pose: "point", expr: winning ? "smile" : pos * side < -.25 ? "worried" : "neutral" });
        const st = actorState(a, s, t); st.x = X0 + off + (pulling ? Math.sin(t * 20 + k) * 3 : 0); st.walking = false;
        if (!p.keys || !p.keys.some(kk => kk.expr && t >= at(s, kk.cue, .5))) st.expr = winner ? "happy" : loser ? "shock" : a.expr;
        if (winner) st.pose = "cheer";
        ctx.save(); ctx.translate(st.x, gy); if (side > 0) ctx.scale(-1, 1); ctx.rotate(th0); ctx.translate(-st.x, -gy);
        drawActor(ctx, th, a, st, t, gy, sc); ctx.restore();
        const hx = 182 * sc, hy = -308 * sc, rx = hx * Math.cos(th0) - hy * Math.sin(th0), ry = hx * Math.sin(th0) + hy * Math.cos(th0);
        if (!winner){ hands.push([st.x - side * rx, gy + ry, a.skin]); ropeY = gy + ry; }
        const headX = st.x + side * Math.sin(-th0) * 400 * sc, headTop = gy - 460 * sc;
        if (st.emote) emoteAt(ctx, th, st.emote, headX, headTop - 20, t - st.emoteT, t);
        if (st.say) bubbleAt(ctx, th, st.say, headX, headTop - 10, st.chat, t - st.sayT);
        if (winner && k === 0) emoteAt(ctx, th, "sparkle", headX, headTop - 20, t - tw, t);
      });
      // team label
      const lx = clamp(540 + side * (170 + (m - 1) * spc / 2) + off, 200, 880), q = popS(t, .2);
      if (S.label && q){ ctx.save(); ctx.translate(lx, 700); ctx.scale(q, q); font(ctx, 800, 34, th.fam); const { w } = tag(ctx, th, S.label, 0, 0, 360, { bg: col, fg: "#FFFFFF", size: 34, weight: 800, lines: 1 });
        if (S.icon){ disc(ctx, S.icon, -w / 2 - 6, 0, 34, "#FFFFFF", col); } ctx.restore(); }
      if (winner) burst(ctx, lx, 700, t - tw, M, 12);
    });
    // rope + flag
    const ry = ropeY + Math.sin(t * 3) * 2;
    ctx.strokeStyle = "#B87333"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(100, ry + 6); ctx.quadraticCurveTo(540 + off, ry + 14, 980, ry + 6); ctx.stroke();
    ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 4; ctx.setLineDash([10, 12]); ctx.lineDashOffset = -off * .5; ctx.beginPath(); ctx.moveTo(100, ry + 6); ctx.quadraticCurveTo(540 + off, ry + 14, 980, ry + 6); ctx.stroke(); ctx.setLineDash([]);
    hands.forEach(([x, y, sk]) => { ctx.beginPath(); ctx.arc(x, ry + 9 + (y - ropeY) * .2, 12, 0, TAU); ctx.fillStyle = { a: "#D99A6E", b: "#C98B62", c: "#B5774F", d: "#E2A77C" }[sk || "a"]; ctx.fill(); });
    const fx = 540 + off; ctx.beginPath(); ctx.moveTo(fx, ry + 10); ctx.lineTo(fx - 26, ry + 80 + Math.sin(t * 6) * 6); ctx.lineTo(fx + 26, ry + 80 - Math.sin(t * 6) * 6); ctx.closePath(); ctx.fillStyle = RED; ctx.fill();
    for (let k = 0; k < 4 && pulling; k++){ const q = md(t * 2 + k / 4, 1); puff(ctx, 540 + off - Math.sign(pos || 1) * (200 + k * 60) , gy + 20 - q * 40, 8 + q * 14, .45 * (1 - q)); }
    if (won && f.verdict){ const q = eBack(clamp((t - tw - .3) / .45, 0, 1)); if (q > 0){ ctx.save(); ctx.translate(540, 800); ctx.scale(q, q); tag(ctx, th, f.verdict, 0, 0, 600, { bg: INK, fg: "#FFFFFF", size: 36, weight: 800, lines: 1, stroke: th.accent, lw: 4 }); ctx.restore(); } }
    ctx.restore();
  }, (s, f, i, add) => { keyTimes(s, f.moves, i).forEach(m => add(m.T, "whoosh")); if (f.winCue) add(at(s, f.winCue, .8, i), "chime");
    ["left", "right"].forEach(k => ((f[k] || {}).people || []).forEach(p => keyTimes(s, p.keys, i).forEach(kk => { if (kk.say != null || kk.emote) add(kk.T, "pop"); }))); });

  /* ======================= jenga ======================= */
  // f: headline, highlight, rows (default 7), items:[{label, cue, action:"pull"|"add", row}], collapseCue, collapseLabel, steadyCue, steadyLabel
  function jengaPlan(s, f, idx){
    const nRows = f.rows ?? 7, items = (f.items || []).map((it, k) => Object.assign({}, it, { T: at(s, it.cue, .2 + k * .2, idx) }));
    const free = []; for (let r = 2; r < nRows - 1; r += 2) free.push(r); free.sort((a, b) => Math.abs(a - nRows / 2) - Math.abs(b - nRows / 2));
    let addRow = nRows; items.forEach(it => { if (it.action === "add") it.row = addRow++; else if (it.row == null) it.row = free.shift() ?? 2; });
    return { nRows, items, total: addRow, tc: f.collapseCue ? at(s, f.collapseCue, .8, idx) : 1e9, tst: f.steadyCue ? at(s, f.steadyCue, .8, idx) : 1e9 };
  }
  TT.layout("jenga", "Menara balok", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const J = jengaPlan(s, f), hasPull = J.items.some(it => it.action !== "add"), cx = hasPull ? 450 : 540, base = 1288, bh = Math.min(hasPull ? 58 : 80, (base - (f.headline ? 640 : 600)) / (J.total + .6)), bw = hasPull ? 380 : 540, dark = th.key === "B";
    const pulled = J.items.filter(it => it.action !== "add" && t > it.T + .5).length, steady = t >= J.tst;
    const amp = steady ? 0 : Math.min(.045, pulled * .014) + (J.items.some(it => it.action !== "add" && t > it.T + .5 && t < it.T + 1.6) ? .012 : 0), ang = t < J.tc ? Math.sin(t * 5.5) * amp : 0;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // table
    rr(ctx, cx - bw / 2 - 90, base, bw + 180, 22, 10); ctx.fillStyle = WOOD2; ctx.fill(); ctx.fillRect(cx - bw / 2 - 60, base + 22, 18, 30); ctx.fillRect(cx + bw / 2 + 42, base + 22, 18, 30);
    if (steady){ const g = ctx.createRadialGradient(cx, base - J.total * bh / 2, 40, cx, base - J.total * bh / 2, 420); g.addColorStop(0, hexA(GREEN, .28 + .08 * Math.sin(t * 3))); g.addColorStop(1, hexA(GREEN, 0)); ctx.fillStyle = g; ctx.fillRect(90, 560, 900, 770); }
    // blocks
    const blocks = [];
    for (let r = 0; r < J.nRows; r++){ const y = -(r + .5) * bh; if (r % 2 === 0) blocks.push({ x: 0, y, w: bw, h: bh, r }); else for (let k = -1; k <= 1; k++) blocks.push({ x: k * (bw / 3), y, w: bw / 3 - 10, h: bh, r }); }
    J.items.forEach(it => { if (it.action === "add"){ blocks.push({ x: 0, y: -(it.row + .5) * bh, w: bw, h: bh, r: it.row, it }); } else { const b = blocks.find(b => b.r === it.row && b.w === bw); if (b) b.it = it; } });
    blocks.forEach((b, j) => {
      const r0 = b.r, buildT = .1 + r0 * .07; let x = b.x, y = b.y, rot = 0, alpha = 1, col = WOOD, lab = null;
      if (b.it && b.it.action === "add"){ if (t < b.it.T) return; const q = clamp((t - b.it.T) / .55, 0, 1), drop = Math.max(60, Math.min(420, base + b.y - b.h / 2 - 570)); y = b.y - (1 - q * q) * drop; alpha = clamp(q * 3, 0, 1); if (q >= 1) y += -Math.max(0, Math.sin((t - b.it.T - .55) * 14)) * 14 * Math.max(0, 1 - (t - b.it.T - .55) * 3); col = M.pal[(b.r) % 3]; lab = b.it.label; }
      else { if (t < buildT) return; const q = clamp((t - buildT) / .3, 0, 1); y = b.y - (1 - eOut(q)) * 220; alpha = q; }
      if (b.it && b.it.action !== "add" && t >= b.it.T){ col = th.accent; lab = b.it.label; const q = easeIO(clamp((t - b.it.T - .5) / .8, 0, 1)); x = b.x + 330 * q; }
      ctx.save(); ctx.globalAlpha *= alpha;
      // collapse physics (in table space, no wobble)
      let wx, wy;
      if (t >= J.tc){ const dt = Math.max(0, t - J.tc - (J.total - r0) * .03), vx = (hsh(j) - .5) * 520 + (b.x + (x - b.x)) * .6, vr = (hsh(j + 9) - .5) * 6;
        const g = 1500, fall = .5 * g * dt * dt, floor = -bh / 2 - (hsh(j + 3) * 2 | 0) * bh; const yy = Math.min(floor, y + fall), land = yy >= floor - .01;
        const tl = land ? Math.sqrt(Math.max(0, 2 * (floor - y) / g)) : dt; wx = clamp(cx + x + vx * Math.min(dt, tl) * .9, 90 + b.w / 2 * .6, 990 - b.w / 2 * .6); wy = base + yy; rot = vr * Math.min(dt, tl);
        ctx.translate(wx, wy); ctx.rotate(rot); }
      else { ctx.translate(cx, base); ctx.rotate(ang * (b.it && b.it.action !== "add" && t > b.it.T + .5 ? 0 : 1)); ctx.translate(x, y); if (b.it && b.it.action !== "add" && t > b.it.T + .5) ctx.rotate(0); }
      rr(ctx, -b.w / 2, -b.h / 2 + 2, b.w, b.h - 4, 8); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 4; ctx.stroke();
      if (!lab){ ctx.strokeStyle = "rgba(142,78,46,.35)"; ctx.lineWidth = 2; ctx.beginPath(); for (let g = 0; g < 2; g++){ ctx.moveTo(-b.w / 2 + 14, -6 + g * 12); ctx.bezierCurveTo(-b.w / 6, -12 + g * 12, b.w / 6, g * 12, b.w / 2 - 14, -6 + g * 12); } ctx.stroke(); }
      else tag(ctx, th, lab, 0, 0, b.w - 10, { bg: "none", fg: "#FFFFFF", size: Math.round(Math.min(36, b.h * .52)), weight: 800, lines: 1 });
      ctx.restore();
      // ghost gap left by a pulled block
      if (b.it && b.it.action !== "add" && t > b.it.T + .7 && t < J.tc){ ctx.save(); ctx.translate(cx, base); ctx.rotate(ang); ctx.setLineDash([10, 8]); ctx.strokeStyle = dark ? "rgba(250,248,243,.5)" : hexA(INK, .45); ctx.lineWidth = 3; rr(ctx, b.x - b.w / 2, b.y - b.h / 2 + 2, b.w, b.h - 4, 8); ctx.stroke(); ctx.restore(); }
    });
    // pulled-block wobble alerts
    J.items.forEach(it => { if (it.action !== "add" && t > it.T + .5 && t < it.T + 1.8 && t < J.tc){ const yy = base - J.total * bh - 40; ctx.save(); ctx.globalAlpha *= 1 - clamp((t - it.T - 1.3) / .5, 0, 1); emoteAt(ctx, th, "!", cx - 230, yy + 60, t - it.T - .5, t); ctx.restore(); } });
    if (t >= J.tc){ burst(ctx, cx, base - 120, t - J.tc, M, 12); if (f.collapseLabel){ const q = eBack(clamp((t - J.tc - .5) / .45, 0, 1)); if (q > 0){ ctx.save(); ctx.translate(540, f.headline ? 700 : 660); ctx.scale(q, q); tag(ctx, th, f.collapseLabel, 0, 0, 640, { bg: RED, fg: "#FFFFFF", size: 38, weight: 800, lines: 1 }); ctx.restore(); } } }
    if (steady){ const ty = base - J.total * bh, q = eBack(clamp((t - J.tst) / .45, 0, 1)); const bxx = Math.min(900, cx + bw / 2 + 40); checkBadge(ctx, bxx, ty + 10, 44, q); burst(ctx, bxx, ty + 10, t - J.tst, M, 10);
      if (f.steadyLabel && q > 0){ ctx.save(); ctx.globalAlpha *= clamp(q, 0, 1); tag(ctx, th, f.steadyLabel, clamp(bxx, 200, 840), ty - 70, 320, { bg: GREEN, fg: "#FFFFFF", size: 32, weight: 800, lines: 1 }); ctx.restore(); } }
    ctx.restore();
  }, (s, f, i, add) => { const J = jengaPlan(s, f, i); add(.15, "whoosh"); J.items.forEach(it => { if (it.action === "add") add(it.T + .5, "pop"); else { add(it.T, "pop"); add(it.T + .5, "whoosh"); } });
    if (J.tc < 1e8) add(J.tc, "whoosh"); if (J.tst < 1e8) add(J.tst, "chime"); });

  /* ======================= switchboard ======================= */
  // f: headline, highlight, title, sockets:[{label, icon, cue, bad, unplugCue}], doneCue, doneLabel
  TT.layout("switchboard", "Panel colokan", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const so = (f.sockets || []).slice(0, 5), n = so.length || 1, px = 110, pw = 860, py = f.headline ? 600 : 575, ph = 470, cw = (pw - 40) / n;
    const tm = so.map((x, k) => at(s, x.cue, .15 + k * .2)), tu = so.map(x => x.unplugCue ? at(s, x.unplugCue, .8) : 1e9), td = f.doneCue ? at(s, f.doneCue, .85) : 1e9, done = t >= td;
    const q0 = popS(t, .05); ctx.save(); ctx.translate(540, py + ph / 2); ctx.scale(q0, q0); ctx.translate(-540, -(py + ph / 2));
    rr(ctx, px + 8, py + 12, pw, ph, 36); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fill();
    rr(ctx, px, py, pw, ph, 36); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.strokeStyle = th.key === "B" ? hexA("#E89544", .5) : "#2A1A12"; ctx.lineWidth = 5; ctx.stroke();
    [[px + 24, py + 24], [px + pw - 24, py + 24], [px + 24, py + ph - 24], [px + pw - 24, py + ph - 24]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fillStyle = "#8C8476"; ctx.fill(); });
    rr(ctx, px + 44, py + 26, pw - 88, 72, 22); ctx.fillStyle = done ? GREEN : "#2A1A12"; ctx.fill();
    font(ctx, 800, 34, th.fam); ctx.fillStyle = CREAM; ctx.textAlign = "center"; const ttl = done && f.doneLabel ? f.doneLabel : (f.title || "");
    ctx.fillText(ttl, 540 - 20, py + 74); ctx.textAlign = "left";
    const ml = done ? 1 : 0; ctx.beginPath(); ctx.arc(px + pw - 86, py + 62, 20, 0, TAU); ctx.fillStyle = ml ? GOLD : "#544E42"; ctx.fill();
    if (ml){ const g = ctx.createRadialGradient(px + pw - 86, py + 62, 10, px + pw - 86, py + 62, 70); g.addColorStop(0, hexA(GOLD, .6)); g.addColorStop(1, hexA(GOLD, 0)); ctx.fillStyle = g; ctx.fillRect(px + pw - 160, py, 150, 130); }
    const plugged = so.map((x, k) => t >= tm[k] + .7 && t < tu[k]);
    so.forEach((x, k) => { const cx = px + 20 + cw * (k + .5), lt = popS(t, .2 + k * .08);
      ctx.save(); ctx.globalAlpha *= clamp(lt, 0, 1);
      tag(ctx, th, x.label, cx, py + 165, cw - 14, { bg: "none", fg: CREAM, size: 30, weight: 700, lines: 3 });
      const on = plugged[k], lamp = on ? (x.bad ? RED : GOLD) : "#544E42", ly = py + 285;
      if (on){ const g = ctx.createRadialGradient(cx, ly, 8, cx, ly, 90); g.addColorStop(0, hexA(x.bad ? RED : GOLD, .55 + .1 * Math.sin(t * 6))); g.addColorStop(1, hexA(x.bad ? RED : GOLD, 0)); ctx.fillStyle = g; ctx.fillRect(cx - 90, ly - 90, 180, 180); }
      ctx.beginPath(); ctx.arc(cx, ly, 26, 0, TAU); ctx.fillStyle = lamp; ctx.fill(); ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 4; ctx.stroke();
      rr(ctx, cx - 14, ly + 24, 28, 14, 4); ctx.fillStyle = "#8C8476"; ctx.fill();
      if (x.icon && on) icon(ctx, x.icon, cx - 15, ly - 15, 30, x.bad ? "#FFFFFF" : "#3B2418", 2.4);
      const sy = py + 385; ctx.beginPath(); ctx.arc(cx, sy, 38, 0, TAU); ctx.fillStyle = "#1A120C"; ctx.fill(); ctx.strokeStyle = on ? (x.bad ? RED : GOLD) : "#8C8476"; ctx.lineWidth = 6; ctx.stroke();
      ctx.fillStyle = "#544E42"; ctx.fillRect(cx - 14, sy - 12, 8, 24); ctx.fillRect(cx + 6, sy - 12, 8, 24);
      ctx.restore();
      if (on && t - tm[k] - .7 < 1) burst(ctx, cx, ly, t - tm[k] - .7, M, 10);
      if (on && x.bad){ for (let j = 0; j < 4; j++){ const a = t * 9 + j * 1.7, r = 30 + md(t * 3 + j * .3, 1) * 40; ctx.fillStyle = j % 2 ? GOLD : RED; star(ctx, cx + Math.cos(a) * r, ly + Math.sin(a) * r, 8); } }
    });
    ctx.restore();
    // cables + plugs (in front of the panel, coming from the tray below)
    const trayY = 1296; rr(ctx, 150, trayY, 780, 30, 15); ctx.fillStyle = "#3B2418"; ctx.fill();
    const cols = [th.accent, TEAL, "#A0522D", "#E89544", "#544E42"];
    so.forEach((x, k) => { const cx = px + 20 + cw * (k + .5), rx = 200 + (n > 1 ? k * 680 / (n - 1) : 340), restY = 1220, sy = py + 385 + 58;
      const go = clamp((t - tm[k]) / .7, 0, 1), back = t >= tu[k] ? clamp((t - tu[k]) / .6, 0, 1) : 0, q = easeIO(go) * (1 - easeIO(back));
      const lift = Math.sin(q * Math.PI) * 140, X = rx + (cx - rx) * q, Y = restY + (sy - restY) * q - lift + (q === 0 ? Math.sin(t * 2 + k) * 4 : 0);
      ctx.strokeStyle = cols[k % 5]; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(rx, trayY + 6); ctx.bezierCurveTo(rx, trayY + 60 - 40, X, Y + 160, X, Y + 34); ctx.stroke();
      ctx.save(); ctx.translate(X, Y); rr(ctx, -26, -30, 52, 64, 12); ctx.fillStyle = cols[k % 5]; ctx.fill(); ctx.strokeStyle = "#2A1A12"; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = "#C9C1B3"; ctx.fillRect(-14, -50, 8, 22); ctx.fillRect(6, -50, 8, 22); ctx.restore(); });
    if (done) burst(ctx, 540, py + 62, t - td, M, 14);
  }, (s, f, i, add) => { (f.sockets || []).forEach((x, k) => { const tc = at(s, x.cue, .15 + k * .2, i); add(tc, "whoosh"); add(tc + .7, x.bad ? "pop" : "ping"); if (x.unplugCue) add(at(s, x.unplugCue, .8, i), "whoosh"); }); if (f.doneCue) add(at(s, f.doneCue, .85, i), "chime"); });

  /* ======================= mixbowl ======================= */
  // f: headline, highlight, items:[{label, icon, cue}], stirCue, result:{label, icon, cue}
  TT.layout("mixbowl", "Mangkuk adonan", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const it = (f.items || []).slice(0, 4), n = it.length, top = f.headline ? 640 : 600, sy = top + 60, bx = 540, rimY = 1070, rx = 300, ry = 52, botY = 1290;
    const xs = n === 1 ? [540] : n === 2 ? [330, 750] : n === 3 ? [230, 540, 850] : [200, 427, 653, 880], slotW = n <= 2 ? 380 : n === 3 ? 290 : 220;
    const tm = it.map((x, k) => at(s, x.cue, .12 + k * .2)), land = tm.map(x => x + 1.05), R = f.result || null, tr = R ? at(s, R.cue, .8) : 1e9;
    const ts = f.stirCue ? at(s, f.stirCue, .6) : (n ? land[n - 1] + .2 : 1e9), landed = land.filter(x => t >= x).length, rq = clamp((t - tr) / .6, 0, 1);
    const cols = [th.accent, TEAL, "#E89544", "#A0522D"];
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // bowl back rim
    ctx.beginPath(); ctx.ellipse(bx, rimY, rx, ry, 0, 0, TAU); ctx.fillStyle = "#E9DCCB"; ctx.fill();
    // contents
    const lev = landed ? 18 + landed * 26 : 0;
    if (lev){ ctx.save(); ctx.beginPath(); ctx.ellipse(bx, rimY, rx - 10, ry - 6, 0, 0, TAU); ctx.clip();
      ctx.beginPath(); ctx.ellipse(bx, rimY + 46 - lev * .4, rx - 10, ry - 4, 0, 0, TAU); ctx.fillStyle = hexA(th.accent, .9); ctx.fill();
      const spin = t >= ts ? (t - ts) * 3 : 0; for (let k = 0; k < landed; k++){ ctx.strokeStyle = hexA(["#FFF7EE", "#2F6F73", "#E89544", "#A0522D"][k % 4], .8); ctx.lineWidth = 8; ctx.beginPath();
        for (let a = 0; a < 5.5; a += .2){ const rr0 = 30 + a * 40, x = bx + Math.cos(a + spin + k * 1.6) * rr0, y = rimY + 40 - lev * .4 + Math.sin(a + spin + k * 1.6) * rr0 * .16; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
      ctx.restore(); }
    // spoon
    const sa = t >= ts ? (t - ts) * 4.2 : -.9, hx = bx + 110 + Math.cos(sa) * 90, hy0 = rimY + 30 + Math.sin(sa) * 14;
    ctx.strokeStyle = WOOD2; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hx, hy0); ctx.lineTo(hx + 80 + Math.cos(sa) * 30, rimY - 230); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(hx, hy0, 30, 16, 0, 0, TAU); ctx.fillStyle = WOOD2; ctx.fill();
    // bowl front
    ctx.beginPath(); ctx.moveTo(bx - rx, rimY); ctx.bezierCurveTo(bx - rx + 10, botY - 30, bx - 160, botY, bx, botY); ctx.bezierCurveTo(bx + 160, botY, bx + rx - 10, botY - 30, bx + rx, rimY);
    ctx.ellipse(bx, rimY, rx, ry, 0, 0, Math.PI); ctx.closePath(); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(bx, rimY, rx, ry, 0, 0, TAU); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
    ctx.fillStyle = hexA(th.accent, .85); rr(ctx, bx - 200, rimY + 120, 400, 26, 13); ctx.fill();
    if (t >= ts && t < tr){ for (let k = 0; k < 3; k++){ const q = md(t * 1.4 + k / 3, 1); ctx.globalAlpha = (1 - q) * .6; ctx.strokeStyle = th.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx - 220 + k * 40, rimY - 60 - q * 60, 18 + q * 10, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } ctx.globalAlpha = 1; }
    // items: appear in slot, then fly into the bowl
    it.forEach((x, k) => { if (t < tm[k]){ const q = popS(t, .25 + k * .1); if (q){ ctx.save(); ctx.translate(xs[k], sy + Math.sin(t * 2 + k) * 5); ctx.scale(q, q); ctx.globalAlpha *= .55; ctx.setLineDash([10, 9]); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = th.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 48, 0, TAU); ctx.stroke(); ctx.setLineDash([]); label(ctx, th, "?", 0, 18, 50, th.ink); ctx.restore(); } return; } const a = eBack(clamp((t - tm[k]) / .4, 0, 1)), fl = clamp((t - tm[k] - .55) / .5, 0, 1), col = cols[k % 4];
      ctx.save(); ctx.globalAlpha *= 1 - rq; tag(ctx, th, x.label, xs[k], sy + 104, slotW, { bg: "#FFFFFF", stroke: hexA(col, .9), lw: 4, size: 32 }); if (fl >= 1) checkBadge(ctx, xs[k] + 30, sy, 24, eBack(clamp((t - land[k]) / .35, 0, 1))); ctx.restore();
      if (fl < 1){ const X = xs[k] + (bx + (k - 1.5) * 40 - xs[k]) * fl, Y = sy + (rimY - sy) * fl - Math.sin(fl * Math.PI) * 120, sc = a * (1 - fl * .55);
        ctx.save(); ctx.translate(X, Y); ctx.rotate(fl * 3); ctx.scale(sc, sc); disc(ctx, x.icon || "star", 0, 0, 50, col, "#FFFFFF", "#FFFFFF"); ctx.restore(); }
      if (t >= land[k] && t < land[k] + .8){ const q = (t - land[k]) / .8; for (let j = 0; j < 8; j++){ const ang = Math.PI + j * Math.PI / 7, r = 40 + q * 120; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.arc(bx + Math.cos(ang) * r * 1.6, rimY - 10 + Math.sin(ang) * r - (-q * q * 80), 10, 0, TAU); ctx.fillStyle = col; ctx.fill(); } ctx.globalAlpha = 1; }
    });
    // result rises
    if (R && t >= tr){ const q = eBack(clamp((t - tr) / .7, 0, 1)), y = rimY - 40 - (rimY - 40 - (top + 190)) * clamp((t - tr) / .7, 0, 1);
      ctx.save(); ctx.translate(bx, y); ctx.rotate(t * .4); for (let k = 0; k < 12; k++){ ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.lineTo(0, -190 * q); ctx.closePath(); ctx.fillStyle = hexA("#F4A85C", .3); ctx.fill(); } ctx.restore();
      ctx.save(); ctx.translate(bx, y); ctx.scale(q, q); disc(ctx, R.icon || "star", 0, 0, 104, R.bad ? RED : GREEN, "#FFFFFF", "#FFFFFF"); ctx.restore();
      burst(ctx, bx, y, t - tr - .3, M, 14);
      const lq = clamp((t - tr - .4) / .4, 0, 1); if (lq > 0){ ctx.save(); ctx.globalAlpha *= lq; tag(ctx, th, R.label, bx, y + 150, 640, { bg: INK, fg: "#FFFFFF", size: 38, weight: 800, lines: 1, stroke: th.accent, lw: 4 }); ctx.restore(); } }
    ctx.restore();
  }, (s, f, i, add) => { (f.items || []).slice(0, 4).forEach((x, k) => { const tc = at(s, x.cue, .12 + k * .2, i); add(tc, "pop"); add(tc + 1.05, "whoosh"); }); if (f.result) add(at(s, f.result.cue, .8, i), "chime"); });

  /* ======================= queue ======================= */
  // f: headline, highlight, counter:{label, icon}, clerk:{look, keys}, people:[{label, look..., serveCue, enterCue, cutTo, backCue, keys}], smoke:{cue, label}
  const QX = k => 680 - k * 165;
  function queuePlan(s, f, idx){
    const ppl = (f.people || []).slice(0, 5), ev = [];
    ppl.forEach((p, i) => { if (p.enterCue) ev.push({ T: at(s, p.enterCue, .3, idx), k: "enter", i }); if (p.serveCue) ev.push({ T: at(s, p.serveCue, .5, idx), k: "serve", i }); if (p.backCue) ev.push({ T: at(s, p.backCue, .6, idx), k: "back", i }); });
    ev.sort((a, b) => a.T - b.T);
    const keys = ppl.map(() => []), init = ppl.map(() => -110); let order = ppl.map((p, i) => i).filter(i => !ppl[i].enterCue); order.forEach((i, k) => init[i] = QX(k));
    const relayout = (T, ent) => order.forEach((i, k) => keys[i].push({ at: T, x: QX(k), speed: i === ent ? 950 : 440 }));
    ev.forEach(e => { const i = e.i;
      if (e.k === "serve"){ keys[i].push({ at: e.T, pose: "thumbs", expr: "happy", emote: "check" }); order = order.filter(j => j !== i); keys[i].push({ at: e.T + .8, x: 820, pose: "stand" }); keys[i].push({ at: e.T + 1.05, show: false }); relayout(e.T + .8); }
      else if (e.k === "enter"){ const k = Math.min(ppl[i].cutTo ?? order.length, order.length); order.splice(k, 0, i); keys[i].push({ at: e.T, show: true }); relayout(e.T, i);
        if (k < order.length - 1 && ppl[i].cutTo != null && ppl[i].cutAlert !== false){ const j = order[k + 1]; keys[j].push({ at: e.T + 1.2, emote: "!", expr: "shock" }); } }
      else if (e.k === "back"){ order = order.filter(j => j !== i); order.push(i); keys[i].push({ at: e.T, expr: "smile" }); relayout(e.T); } });
    return { ppl, init, keys, ev };
  }
  TT.layout("queue", "Antrean", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const gy = 1272, sc = .95, Q = queuePlan(s, f), dark = th.key === "B", y0 = f.headline ? 610 : 580;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, 90, y0, 900, 1325 - y0, 44); ctx.save(); ctx.clip();
    ctx.fillStyle = dark ? "#1F1A14" : "#FFF3E4"; ctx.fillRect(90, y0, 900, gy - y0); ctx.fillStyle = dark ? "#3A2C22" : "#E9C9A8"; ctx.fillRect(90, gy, 900, 1325 - gy);
    ctx.strokeStyle = dark ? "rgba(250,248,243,.08)" : "rgba(59,36,24,.08)"; ctx.lineWidth = 3; for (let x = 90; x < 990; x += 120){ ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x - 50, 1325); ctx.stroke(); }
    // floor marks for the queue
    for (let k = 0; k < 4; k++){ ctx.fillStyle = hexA("#C2691F", dark ? .5 : .35); rr(ctx, QX(k) - 50, gy + 10, 100, 12, 6); ctx.fill(); }
    // booth back + clerk
    const bx0 = 800; ctx.fillStyle = dark ? "#4A3628" : "#F4D9BC"; ctx.fillRect(bx0, 790, 200, gy - 790);
    let clerk = null; if (f.clerk){ const c = Object.assign({}, PEOPLE[3], f.clerk, { x: 905, face: -1 }); const st = actorState(c, s, t); clerk = { r: drawActor(ctx, th, c, st, t, gy, .86), st }; }
    // people
    const heads = [];
    Q.ppl.forEach((p, i) => { const a = Object.assign({}, PEOPLE[i % 5], p, { x: Q.init[i], show: !p.enterCue, keys: Q.keys[i].concat(p.keys || []) }); delete a.label;
      const st = actorState(a, s, t); if (!st.show && t - st.showT > .4) return; const r = drawActor(ctx, th, a, st, t, gy, sc); heads.push([a, st, r, p]); });
    // placards on chests
    heads.forEach(([a, st, r, p]) => { if (!p.label) return; ctx.save(); if (!st.show) ctx.globalAlpha *= 1 - clamp((t - st.showT) / .4, 0, 1); else if (st.showT > 0) ctx.globalAlpha *= clamp((t - st.showT) / .4, 0, 1);
      tag(ctx, th, p.label, st.x, gy - 250 * sc + Math.sin(t * 2 + st.x) * 2, 160, { bg: "#FFFFFF", stroke: p.color || th.accent, lw: 4, size: 27, lines: 2 }); ctx.restore(); });
    // booth front
    ctx.fillStyle = th.accent; ctx.fillRect(bx0, 1110, 200, gy - 1110); ctx.fillStyle = "#A0522D"; ctx.fillRect(bx0 - 10, 1098, 210, 18);
    ctx.fillStyle = "#3B2418"; ctx.fillRect(bx0, 790, 14, gy - 790);
    for (let k = 0; k < 5; k++){ ctx.fillStyle = k % 2 ? "#FFFFFF" : th.accent; ctx.beginPath(); ctx.moveTo(bx0 - 20 + k * 44, 790); ctx.lineTo(bx0 + 24 + k * 44, 790); ctx.lineTo(bx0 + 24 + k * 44, 840); ctx.arc(bx0 + 2 + k * 44, 840, 22, 0, Math.PI); ctx.closePath(); ctx.fill(); }
    // smoke drifting in
    if (f.smoke){ const t0 = at(s, f.smoke.cue, .3), a0 = clamp((t - t0) / 1.5, 0, 1); if (a0 > 0) for (let k = 0; k < 12; k++){ const q = md((t - t0) * .1 + k / 12, 1), x = 60 + q * 1000 * Math.min(1, (t - t0) * .5 + k / 12), y = 880 + Math.sin(k * 1.7 + t * .8) * 70 + (k % 3) * 40;
      puff(ctx, x, y, 38 + 14 * Math.sin(k + t), .6 * a0 * (1 - q * .4)); } }
    ctx.restore(); // clip
    // counter sign
    if (f.counter){ const q = popS(t, .2); if (q){ ctx.save(); font(ctx, 800, 32, th.fam); const w = Math.min(420, ctx.measureText(f.counter.label || "").width + (f.counter.icon ? 110 : 60)); const cx = Math.min(900, 975 - w / 2);
      ctx.translate(cx, 732); ctx.scale(q, q); ctx.rotate(Math.sin(t * 1.5) * .02); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 3, -40); ctx.lineTo(-w / 3, 40); ctx.moveTo(w / 3, -40); ctx.lineTo(w / 3, 40); ctx.stroke();
      rr(ctx, -w / 2, -32, w, 64, 20); ctx.fillStyle = INK; ctx.fill(); ctx.strokeStyle = th.accent; ctx.stroke(); if (f.counter.icon) icon(ctx, f.counter.icon, -w / 2 + 18, -20, 40, GOLD, 2.6);
      font(ctx, 800, 30, th.fam); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(f.counter.label || "", f.counter.icon ? 24 : 0, 11); ctx.textAlign = "left"; ctx.restore(); } }
    if (f.smoke && f.smoke.label){ const t0 = at(s, f.smoke.cue, .3), q = eBack(clamp((t - t0 - .6) / .45, 0, 1)); if (q > 0){ ctx.save(); ctx.translate(330, y0 + 70); ctx.scale(q, q); tag(ctx, th, f.smoke.label, 0, 0, 440, { bg: "#8C8476", fg: "#FFFFFF", size: 30, weight: 800, lines: 1 }); ctx.restore(); } }
    // emotes + bubbles
    heads.forEach(([a, st, r]) => { if (!r || !st.show) return; if (st.emote) emoteAt(ctx, th, st.emote, r.headX, r.headTop - 30, t - st.emoteT, t);
      if (st.say) bubbleAt(ctx, th, st.say, r.headX, r.headTop - (st.emote ? 90 : 10), st.chat, t - st.sayT); });
    if (clerk && clerk.r){ const c = clerk.st, r = clerk.r; if (c.emote) emoteAt(ctx, th, c.emote, r.headX, r.headTop - 30, t - c.emoteT, t); if (c.say) bubbleAt(ctx, th, c.say, r.headX - 60, r.headTop - 10, c.chat, t - c.sayT); }
    Q.ev.forEach(e => { if (e.k === "serve") burst(ctx, 760, 960, t - e.T, M, 8); });
    ctx.restore();
  }, (s, f, i, add) => { const Q = queuePlan(s, f, i); Q.ev.forEach(e => { add(e.T, e.k === "serve" ? "chime" : "whoosh"); if (e.k === "serve") add(e.T + .8, "whoosh"); });
    (f.people || []).forEach(p => keyTimes(s, p.keys, i).forEach(k => { if (k.say != null || k.emote) add(k.T, "pop"); })); if (f.clerk) keyTimes(s, f.clerk.keys, i).forEach(k => { if (k.say != null || k.emote) add(k.T, "pop"); });
    if (f.smoke) add(at(s, f.smoke.cue, .3, i), "whoosh"); });

  /* ======================= firework ======================= */
  // f: headline, highlight, shots:[{label, icon, cue}], finaleCue, finaleLabel
  const FWP = { 1: [[540, 860]], 2: [[320, 840], [760, 900]], 3: [[250, 820], [540, 1010], [830, 820]], 4: [[310, 790], [770, 790], [310, 1070], [770, 1070]] };
  TT.layout("firework", "Kembang api", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const sh = (f.shots || []).slice(0, 4), n = sh.length, y0 = f.headline ? 600 : 570, y1 = 1325, pos = FWP[Math.max(1, n)] || FWP[1], lw = n === 1 ? 700 : n === 2 ? 400 : 300;
    const tm = sh.map((x, k) => at(s, x.cue, .15 + k * .25)), tf = f.finaleCue ? at(s, f.finaleCue, .85) : 1e9, cols = [GOLD, "#F4A85C", "#E89544", "#FFFFFF", "#7CC4E8", "#E9806A"];
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, 90, y0, 900, y1 - y0, 44); const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, "#140E0A"); g.addColorStop(1, "#3B2418"); ctx.fillStyle = g; ctx.fill(); ctx.save(); ctx.clip();
    for (let k = 0; k < 40; k++){ const x = 100 + hsh(k) * 880, y = y0 + 20 + hsh(k + 50) * 560; ctx.globalAlpha = .3 + .5 * Math.abs(Math.sin(t * 1.5 + k)); ctx.fillStyle = "#FFF7EE"; ctx.beginPath(); ctx.arc(x, y, 1.5 + hsh(k + 7) * 2, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
    // skyline
    ctx.fillStyle = "#0C0805"; for (let k = 0; k < 11; k++){ const x = 90 + k * 85, h = 50 + hsh(k + 20) * 110; ctx.fillRect(x, y1 - h, 80, h);
      for (let w = 0; w < 6; w++){ if (hsh(k * 7 + w) > .55){ ctx.fillStyle = hexA(GOLD, .55 + .3 * Math.sin(t + k + w)); ctx.fillRect(x + 12 + (w % 2) * 34, y1 - h + 16 + (w >> 1) * 28, 16, 14); ctx.fillStyle = "#0C0805"; } } }
    const boom = (cx, cy, dt, seed, big) => { if (dt < 0 || dt > 2) return; const N = big ? 46 : 34;
      for (let j = 0; j < N; j++){ const a = j * TAU / N + seed, v = (big ? 380 : 300) * (.75 + .25 * hsh(j + seed * 10)), q = eOut(clamp(dt / 1.1, 0, 1));
        const x = cx + Math.cos(a) * v * q, y = cy + Math.sin(a) * v * q + 90 * dt * dt; ctx.globalAlpha = clamp(1 - dt / 2, 0, 1); ctx.fillStyle = cols[(j + Math.floor(seed * 3)) % cols.length];
        ctx.beginPath(); ctx.arc(x, y, 5 * (1 - dt / 2.4), 0, TAU); ctx.fill();
        ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 2; ctx.globalAlpha *= .5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx + Math.cos(a) * v * q * .7, cy + Math.sin(a) * v * q * .7 + 60 * dt * dt); ctx.stroke(); }
      if (dt < .25){ ctx.globalAlpha = 1 - dt / .25; ctx.beginPath(); ctx.arc(cx, cy, 60 + dt * 300, 0, TAU); ctx.fillStyle = "rgba(255,247,238,.35)"; ctx.fill(); } ctx.globalAlpha = 1; };
    sh.forEach((x, k) => { const [cx, cy] = pos[k], T = tm[k], L = Math.max(.05, T - .85); if (t < L) return;
      if (t < T){ const q = eOut((t - L) / (T - L)), sx = cx + (k % 2 ? -60 : 60), X = sx + (cx - sx) * q, Y = y1 - 10 + (cy - y1 + 10) * q;
        for (let j = 0; j < 8; j++){ const qq = Math.max(0, q - j * .03); ctx.globalAlpha = .7 * (1 - j / 8); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(sx + (cx - sx) * qq, y1 - 10 + (cy - y1 + 10) * qq + Math.sin(j) * 2, 5 - j * .5, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(X, Y, 7, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); return; }
      boom(cx, cy, t - T, k * .7 + .3, false); });
    if (t >= tf){ for (let j = 0; j < 5; j++) boom(160 + hsh(j + 3) * 760, y0 + 140 + hsh(j + 11) * 380, t - tf - j * .22, j * 1.3, true); }
    ctx.restore();
    // icons + labels (outside clip so they stay crisp)
    sh.forEach((x, k) => { const [cx, cy] = pos[k], T = tm[k]; if (t < T + .1) return; const q = eBack(clamp((t - T - .1) / .45, 0, 1)), fl = Math.sin(t * 1.6 + k) * 5;
      const gl = ctx.createRadialGradient(cx, cy + fl, 10, cx, cy + fl, 120); gl.addColorStop(0, hexA(GOLD, .35)); gl.addColorStop(1, hexA(GOLD, 0)); ctx.fillStyle = gl; ctx.fillRect(cx - 120, cy - 120 + fl, 240, 240);
      ctx.save(); ctx.translate(cx, cy + fl); ctx.scale(q, q); disc(ctx, x.icon || "star", 0, 0, 56, th.accent, "#FFFFFF", GOLD); ctx.restore();
      for (let j = 0; j < 3; j++){ const a = t * 1.2 + j * TAU / 3 + k; ctx.fillStyle = GOLD; ctx.globalAlpha = .7; star(ctx, cx + Math.cos(a) * 82, cy + fl + Math.sin(a) * 82, 7 + Math.sin(t * 5 + j) * 2); } ctx.globalAlpha = 1;
      const lq = clamp((t - T - .3) / .4, 0, 1); if (lq > 0){ ctx.save(); ctx.globalAlpha *= lq; tag(ctx, th, x.label, cx, cy + fl + 112, lw, { bg: "none", fg: CREAM, size: 40, weight: 800, lines: 2 }); ctx.restore(); } });
    if (t >= tf && f.finaleLabel){ const q = eBack(clamp((t - tf - .2) / .45, 0, 1)); if (q > 0){ ctx.save(); ctx.translate(540, y0 + 74); ctx.scale(q, q); tag(ctx, th, f.finaleLabel, 0, 0, 760, { bg: th.accent, fg: "#FFFFFF", size: 38, weight: 800, lines: 1, stroke: GOLD, lw: 4 }); ctx.restore(); } }
    ctx.restore();
  }, (s, f, i, add) => { (f.shots || []).slice(0, 4).forEach((x, k) => { const T = at(s, x.cue, .15 + k * .25, i); add(Math.max(.05, T - .85), "whoosh"); add(T, "pop"); }); if (f.finaleCue) add(at(s, f.finaleCue, .85, i), "chime"); });
})();
