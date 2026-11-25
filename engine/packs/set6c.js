/* Scene pack set6c: maze, compass, piggy, notebook, podium, pinboard + c_gaze (eye rest, actor) and c_lift (side-view lifting figure).
   Canvas 1080x1920; visuals stay in y ~560-1330, text inside x 90-990. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, actorState, drawActor, emoteAt, pill, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const RED = "#D84315", GREEN = "#3BB273", TEAL = "#2F6F73", GOLD = "#E8A317", CREAM = "#FFF3E4";
  const el = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (TAU / 3)) + 1;
  const ink = th => th.key === "B" ? "#FAF8F3" : INK;
  function fit(ctx, th, txt, maxW, size, w){ let z = size; font(ctx, w || 700, z, th.fam); while (z > 18 && ctx.measureText(txt).width > maxW){ z -= 1; font(ctx, w || 700, z, th.fam); } return z; }
  function wrap(ctx, txt, maxW){ const ws = String(txt || "").split(" "), out = []; let cur = ""; ws.forEach(w => { const n = cur ? cur + " " + w : w; if (ctx.measureText(n).width > maxW && cur){ out.push(cur); cur = w; } else cur = n; }); if (cur) out.push(cur); return out; }
  // pill that always fits inside x 90-990 (shrinks the font, then clamps the centre)
  function tag(ctx, th, txt, x, y, bg, fg, size, maxW, k){ const z = fit(ctx, th, txt, Math.min(maxW || 880, 880) - 44, size || 32, 800); const w = ctx.measureText(txt).width + 44, cx = clamp(x, 90 + w / 2, 990 - w / 2);
    if (k == null) return pill(ctx, th, txt, cx, y, bg, fg, z); if (k <= 0) return w; ctx.save(); ctx.translate(cx, y); ctx.scale(k, k); pill(ctx, th, txt, 0, 0, bg, fg, z); ctx.restore(); return w; }
  function coin(ctx, x, y, r, spin, txt){ const sx = Math.max(.15, Math.abs(Math.cos(spin || 0))); ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.lineWidth = r * .14; ctx.strokeStyle = "#B87333"; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * .66, 0, TAU); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = r * .08; ctx.stroke();
    font(ctx, 800, r * .62, "Poppins"); ctx.fillStyle = "#8E4E2E"; ctx.textAlign = "center"; ctx.fillText(txt || "Rp", 0, r * .22); ctx.textAlign = "left"; ctx.restore(); }

  /* ---------------- maze: top-down labyrinth, a little walker tries dead ends, then the right path ---------------- */
  const MZ = { ok: [[0, 4], [1, 4], [1, 2], [3, 2], [3, 1], [5, 1], [5, 0], [6, 0]],
    dead: [[[0, 4], [1, 4], [4, 4], [4, 3]], [[0, 4], [1, 4], [1, 2], [1, 0], [3, 0]], [[0, 4], [1, 4], [1, 2], [3, 2], [3, 3], [2, 3]]],
    extra: [[[0, 0], [0, 2]], [[5, 4], [6, 4], [6, 2], [5, 2], [5, 3]], [[4, 0], [4, 0]], [[2, 1], [2, 1]]] };
  function mzPts(route, geo){ return route.map(([c, r]) => [geo.x0 + (geo.flip ? 6 - c : c) * geo.cs + geo.cs / 2, geo.y0 + r * geo.cs + geo.cs / 2]); }
  function polyLen(P){ let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; }
  function polyAt(P, d){ for (let i = 1; i < P.length; i++){ const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (d <= l){ const q = l ? d / l : 0; return [P[i - 1][0] + (P[i][0] - P[i - 1][0]) * q, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * q, Math.sign(P[i][0] - P[i - 1][0])]; } d -= l; } const e = P[P.length - 1]; return [e[0], e[1], 0]; }
  function polyPart(ctx, P, d){ ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++){ const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (d >= l){ ctx.lineTo(P[i][0], P[i][1]); d -= l; } else { const q = d / l; ctx.lineTo(P[i - 1][0] + (P[i][0] - P[i - 1][0]) * q, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * q); break; } } ctx.stroke(); }
  function walker(ctx, w, x, y, t, moving, dir, sad){
    const b = moving ? -Math.abs(Math.sin(t * 12)) * 8 : Math.sin(t * 2) * 2; ctx.save(); ctx.translate(x, y + b);
    ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath(); ctx.ellipse(0, 30 - b, 26, 8, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = w.skin || "#D99A6E"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    ctx.fillStyle = w.hair === "hijab" ? (w.hijab || TEAL) : "#2B1A12"; ctx.beginPath(); ctx.arc(0, -4, 31, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    const lx = (dir || 0) * 6; ctx.fillStyle = "#2B1A12"; [-10, 10].forEach(d => { ctx.beginPath(); ctx.arc(d + lx, 4, 4, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 3; ctx.beginPath(); if (sad) ctx.arc(lx, 22, 7, 1.15 * Math.PI, 1.85 * Math.PI); else ctx.arc(lx, 12, 7, .2 * Math.PI, .8 * Math.PI); ctx.stroke();
    ctx.restore(); }
  TT.layout("maze", "Labirin", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const geo = { x0: 120, y0: f.headline ? 660 : 610, cs: 120, flip: !!f.flip }, W0 = 840, H0 = 600, cw = 74;
    const q0 = eOut(clamp((t - .1) / .5, 0, 1)); ctx.save(); ctx.globalAlpha *= q0; ctx.translate(540, geo.y0 + H0 / 2); ctx.scale(.9 + .1 * q0, .9 + .1 * q0); ctx.translate(-540, -geo.y0 - H0 / 2);
    rr(ctx, geo.x0 - 14, geo.y0 - 14, W0 + 28, H0 + 28, 34); ctx.fillStyle = "#6E4A2F"; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
    ctx.save(); rr(ctx, geo.x0, geo.y0, W0, H0, 26); ctx.clip(); ctx.fillStyle = "#8A5A36"; ctx.fillRect(geo.x0, geo.y0, W0, H0);
    ctx.fillStyle = "rgba(255,255,255,.07)"; for (let k = 0; k < 70; k++){ const x = geo.x0 + (k * 97) % W0, y = geo.y0 + (k * 53) % H0; ctx.beginPath(); ctx.arc(x, y, 6 + (k % 3) * 3, 0, TAU); ctx.fill(); } ctx.restore();
    const all = [MZ.ok].concat(MZ.dead, MZ.extra);
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = CREAM; ctx.lineWidth = cw;
    all.forEach(r => { const P = mzPts(r, geo); ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); P.forEach(p => ctx.lineTo(p[0], p[1])); if (P.length === 2 && P[0][0] === P[1][0] && P[0][1] === P[1][1]) ctx.lineTo(P[0][0] + .1, P[0][1]); ctx.stroke(); });
    const tries = (f.tries || []).map((tr, k) => ({ tr, T: at(s, tr.cue, .15 + k * .25) }));
    let di = 0; tries.forEach(o => { o.route = o.tr.dead ? MZ.dead[(di++) % MZ.dead.length] : MZ.ok; o.P = mzPts(o.route, geo); o.L = polyLen(o.P); o.dur = Math.max(1.1, o.L / 520); });
    const S = mzPts([MZ.ok[0]], geo)[0], E = mzPts([MZ.ok[MZ.ok.length - 1]], geo)[0];
    // goal
    const won = tries.find(o => !o.tr.dead && t > o.T + o.dur), wonT = won ? won.T + won.dur : 0;
    ctx.save(); ctx.translate(E[0], E[1]); const gp = 1 + Math.sin(t * 4) * .06 + (won ? .25 * (1 - clamp((t - wonT) / .5, 0, 1)) : 0); ctx.scale(gp, gp);
    ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = won ? GREEN : th.accent; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); icon(ctx, (f.goal || {}).icon || "star", -20, -20, 40, "#fff", 2.6); ctx.restore();
    ctx.beginPath(); ctx.arc(S[0], S[1], 30, 0, TAU); ctx.strokeStyle = hexA(INK, .35); ctx.lineWidth = 5; ctx.setLineDash([8, 8]); ctx.stroke(); ctx.setLineDash([]);
    // trails
    let cur = null; tries.forEach(o => { if (t < o.T) return; cur = o; const d = Math.min(o.L, (t - o.T) / o.dur * o.L);
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 14;
      if (o.tr.dead){ ctx.strokeStyle = hexA(RED, .75); ctx.setLineDash([4, 22]); } else ctx.strokeStyle = th.accent;
      polyPart(ctx, o.P, easeIO(clamp((t - o.T) / o.dur, 0, 1)) * o.L); ctx.restore(); });
    // dead-end crosses + labels
    tries.forEach(o => { if (!o.tr.dead || t < o.T + o.dur) return; const e = o.P[o.P.length - 1], k = t - o.T - o.dur, q = eBack(clamp(k / .35, 0, 1));
      ctx.save(); ctx.translate(e[0], e[1]); ctx.scale(q, q); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-22, -22); ctx.lineTo(22, 22); ctx.moveTo(22, -22); ctx.lineTo(-22, 22); ctx.stroke(); ctx.restore();
      if (o.tr.label){ ctx.save(); ctx.globalAlpha *= q; tag(ctx, th, o.tr.label, e[0], e[1] + 72, RED, "#fff", 28, 360); ctx.restore(); } });
    // walker
    const wk = f.walker || {};
    if (!cur) walker(ctx, wk, S[0], S[1], t, false, 1, false);
    else { const lt = t - cur.T, p = easeIO(clamp(lt / cur.dur, 0, 1)), [x, y, dir] = polyAt(cur.P, p * cur.L), done = lt > cur.dur;
      if (cur.tr.dead && lt > cur.dur + 1.1){ const k = clamp((lt - cur.dur - 1.1) / .4, 0, 1); ctx.save(); ctx.globalAlpha *= k; walker(ctx, wk, S[0], S[1], t, false, 1, false); ctx.restore(); }
      else { const sh = cur.tr.dead && done ? Math.sin((lt - cur.dur) * 30) * 6 * Math.max(0, 1 - (lt - cur.dur)) : 0;
        walker(ctx, wk, x + sh, y, t, !done, done ? 0 : dir, cur.tr.dead && done);
        if (!done && cur.tr.label){ font(ctx, 800, 26, th.fam); tag(ctx, th, cur.tr.label, x, y - 62, INK, "#FFF7EE", 26, 360); }
        if (done && !cur.tr.dead){ burst(ctx, E[0], E[1], lt - cur.dur, M, 12); if (cur.tr.label) tag(ctx, th, cur.tr.label, E[0], E[1] + 76, GREEN, "#fff", 28, 380); } } }
    ctx.restore();
    if (f.start) tag(ctx, th, f.start, S[0], geo.y0 + H0 + 54, th.key === "B" ? "#FAF8F3" : INK, th.key === "B" ? INK : "#FFF7EE", 28, 400);
    if (f.goal && f.goal.label){ tag(ctx, th, f.goal.label, E[0], geo.y0 - 50, won ? GREEN : th.accent, "#fff", 30, 420, popS(t, .3)); }
  }, (s, f, i, add) => { let di = 0; (f.tries || []).forEach((tr, k) => { const T = cueT(s, tr.cue, .15 + k * .25, i); add(T, "whoosh");
      const P = mzPts(tr.dead ? MZ.dead[(di++) % MZ.dead.length] : MZ.ok, { x0: 120, y0: 660, cs: 120 }); add(T + Math.max(1.1, polyLen(P) / 520), tr.dead ? "pop" : "chime"); }); },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);

  /* ---------------- compass: needle spins, then swings to a labelled direction ---------------- */
  const CDIR = { N: [0, -1], NE: [1, -1], E: [1, 0], SE: [1, 1], S: [0, 1], SW: [-1, 1], W: [-1, 0], NW: [-1, -1] };
  TT.layout("compass", "Kompas", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const cx = 540, cy = f.headline ? 985 : 950, R0 = 190, dirs = (f.dirs || []).slice(0, 4), defP = ["NW", "NE", "SW", "SE"];
    const pts = (f.points || []).map((p, k) => ({ dir: p.dir, T: at(s, p.cue, .4 + k * .3) })).sort((a, b) => a.T - b.T);
    const angOf = d => { const v = CDIR[(dirs[d] || {}).pos || defP[d] || "N"]; return Math.atan2(v[0], -v[1]); };
    // needle angle
    const t0 = pts.length ? pts[0].T : 1e9, spin = f.spin !== false;
    const spinA = T => spin ? T * 9 + Math.sin(T * 3) * 1.2 : Math.sin(T * 2.4) * .5;
    let a = spinA(Math.min(t, t0)), last = -1;
    pts.forEach((p, k) => { if (t < p.T) return; const from = k === 0 ? spinA(p.T) : a; let to = angOf(p.dir); while (to < from + (k === 0 && spin ? 1.5 : -Math.PI)) to += TAU; while (to > from + Math.PI && !(k === 0 && spin)) to -= TAU;
      a = from + (to - from) * el(clamp((t - p.T) / 1.4, 0, 1)); last = p.dir; });
    a += Math.sin(t * 2.3) * .025;
    // labels
    dirs.forEach((d, k) => { const v = CDIR[d.pos || defP[k]], lx = cx + v[0] * (v[1] ? 290 : 330), ly = cy + v[1] * (v[0] ? 300 : 300), tk = at(s, d.cue, .05 + k * .08), q = popS(t, tk);
      if (!q) return; const hit = pts.filter(p => p.dir === k && t > p.T + .9), chosen = hit.length > 0, dim = pts.some(p => t > p.T + .9) && !chosen;
      const pulse = chosen ? 1 + .05 * Math.sin(t * 5) : 1;
      ctx.save(); ctx.translate(lx, ly); ctx.scale(q * pulse, q * pulse); if (dim) ctx.globalAlpha *= .45;
      font(ctx, 800, 30, th.fam); let z = 30; const maxT = 210; let lines = wrap(ctx, d.label, maxT); while ((lines.length > 2 || lines.some(l => ctx.measureText(l).width > maxT)) && z > 20){ z -= 2; font(ctx, 800, z, th.fam); lines = wrap(ctx, d.label, maxT); }
      const tw = Math.max(...lines.map(l => ctx.measureText(l).width)), bw = tw + 110, bh = Math.max(84, lines.length * (z + 8) + 34);
      const bx = clamp(-bw / 2, 92 - lx, 988 - lx - bw);
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.18)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; rr(ctx, bx, -bh / 2, bw, bh, 26); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore();
      ctx.lineWidth = chosen ? 7 : 3; ctx.strokeStyle = chosen ? (d.bad ? RED : th.accent) : hexA(INK, .2); rr(ctx, bx, -bh / 2, bw, bh, 26); ctx.stroke();
      ctx.beginPath(); ctx.arc(bx + 44, 0, 28, 0, TAU); ctx.fillStyle = d.bad ? RED : (chosen ? th.accent : M.pal[k % 3]); ctx.fill(); icon(ctx, d.icon || (d.bad ? "alert" : "pin"), bx + 26, -18, 36, "#fff", 2.4);
      ctx.fillStyle = INK; font(ctx, 800, z, th.fam); lines.forEach((l, j) => ctx.fillText(l, bx + 84, (j - (lines.length - 1) / 2) * (z + 8) + z * .36));
      ctx.restore();
      if (chosen && !d.bad) burst(ctx, lx, ly, t - hit[0].T - 1, M, 10); });
    // compass body
    const q = eBack(clamp((t - .1) / .5, 0, 1)); ctx.save(); ctx.translate(cx, cy + Math.sin(t * 1.3) * 5); ctx.scale(q, q);
    ctx.beginPath(); ctx.arc(8, 14, R0 + 34, 0, TAU); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fill();
    const g = ctx.createLinearGradient(-R0, -R0, R0, R0); g.addColorStop(0, "#E0A060"); g.addColorStop(1, "#9A5A2A"); ctx.beginPath(); ctx.arc(0, 0, R0 + 34, 0, TAU); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, R0, 0, TAU); ctx.fillStyle = "#FFFDF7"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    for (let k = 0; k < 32; k++){ const aa = k * TAU / 32, l = k % 8 === 0 ? 26 : k % 4 === 0 ? 18 : 9; ctx.strokeStyle = hexA(INK, k % 4 ? .35 : .8); ctx.lineWidth = k % 4 ? 2 : 4; ctx.beginPath(); ctx.moveTo(Math.sin(aa) * (R0 - 8), -Math.cos(aa) * (R0 - 8)); ctx.lineTo(Math.sin(aa) * (R0 - 8 - l), -Math.cos(aa) * (R0 - 8 - l)); ctx.stroke(); }
    font(ctx, 800, 34, "Poppins"); ctx.textAlign = "center"; [["U", 0], ["T", 1], ["S", 2], ["B", 3]].forEach(([c, k]) => { const aa = k * Math.PI / 2; ctx.fillStyle = k ? hexA(INK, .6) : RED; ctx.fillText(c, Math.sin(aa) * (R0 - 62), -Math.cos(aa) * (R0 - 62) + 12); }); ctx.textAlign = "left";
    ctx.save(); ctx.rotate(.785); ctx.fillStyle = hexA(th.accent, .12); for (let k = 0; k < 4; k++){ ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, -R0 * .55); ctx.lineTo(14, 0); ctx.lineTo(-14, 0); ctx.fill(); } ctx.restore();
    ctx.save(); ctx.rotate(a); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.moveTo(0, -R0 + 30); ctx.lineTo(24, 0); ctx.lineTo(-24, 0); ctx.closePath(); ctx.fillStyle = th.accent; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, R0 - 40); ctx.lineTo(24, 0); ctx.lineTo(-24, 0); ctx.closePath(); ctx.fillStyle = "#8C8476"; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fillStyle = INK; ctx.fill(); ctx.beginPath(); ctx.arc(-5, -5, 6, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, R0, Math.PI * 1.1, Math.PI * 1.45); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 10; ctx.stroke();
    ctx.restore();
  }, (s, f, i, add) => { (f.dirs || []).forEach((d, k) => { if (d.cue) add(cueT(s, d.cue, .05, i), "pop"); }); (f.points || []).forEach((p, k) => { const T = cueT(s, p.cue, .4 + k * .3, i); add(T, "whoosh"); add(T + 1.2, "ping"); }); });

  /* ---------------- piggy: coins drop in (or fly out), piggy fattens, wobbles, cracks ---------------- */
  TT.layout("piggy", "Celengan", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const px = 540, py = f.headline ? 890 : 850, coins = (f.coins || []).map((c, k) => ({ c, T: at(s, c.cue, .15 + k * .2) }));
    const tc = f.crackCue ? at(s, f.crackCue, .8) : 1e9, cracked = t > tc;
    let fat = 0, wob = 0; coins.forEach(o => { const land = o.T + (o.c.out ? 0 : .65); if (t > land){ fat += o.c.out ? -1 : 1; const k = t - land; wob += Math.sin(k * 18) * Math.exp(-k * 4) * .08; } });
    const sc = clamp(1 + fat * .045, .82, 1.22), shake = cracked ? Math.sin((t - tc) * 40) * 9 * Math.max(0, 1 - (t - tc) / .8) : 0;
    const sad = cracked || fat < 0 || f.sad;
    // pig
    const q = eBack(clamp((t - .1) / .5, 0, 1));
    ctx.save(); ctx.translate(px + shake, py + Math.sin(t * 1.6) * 5); ctx.scale(q * sc * (1 + wob), q * sc * (1 - wob)); ctx.rotate(Math.sin(t * 1.1) * .02 + wob);
    ctx.fillStyle = "rgba(0,0,0,.16)"; ctx.beginPath(); ctx.ellipse(0, 190, 200, 22, 0, 0, TAU); ctx.fill();
    const body = "#F6B48F", edge = INK;
    [[-120, 1], [-60, 0], [70, 0], [130, 1]].forEach(([x, b]) => { rr(ctx, x - 26, 100, 52, 86, 18); ctx.fillStyle = b ? "#E89A74" : body; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = edge; ctx.stroke(); });
    ctx.save(); ctx.translate(-218, -10); ctx.rotate(Math.sin(t * 3) * .15); ctx.strokeStyle = edge; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-40, -10, -30, -50, -10, -40); ctx.bezierCurveTo(5, -30, -20, -10, -46, -18); ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, 225, 165, 0, 0, TAU); ctx.fillStyle = body; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = edge; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-30, 50, 150, 80, 0, 0, Math.PI); ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-60, -80, 70, 26, -.3, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fill();
    [[110, -150, .4], [40, -168, .1]].forEach(([x, y, r]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.beginPath(); ctx.moveTo(-34, 22); ctx.lineTo(0, -38); ctx.lineTo(34, 22); ctx.closePath(); ctx.fillStyle = "#E89A74"; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = edge; ctx.stroke(); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(210, 10, 46, 56, 0, 0, TAU); ctx.fillStyle = "#EE9C78"; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = edge; ctx.stroke();
    ctx.fillStyle = "#8E4E2E"; [[-12], [14]].forEach(([dy]) => { ctx.beginPath(); ctx.ellipse(214, dy, 9, 13, 0, 0, TAU); ctx.fill(); });
    const blink = (t % 3.1) < .12; ctx.fillStyle = "#2B1A12"; ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 5; ctx.lineCap = "round";
    if (blink || (!sad && fat > 1)){ ctx.beginPath(); ctx.arc(120, -50, 12, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } else { ctx.beginPath(); ctx.arc(120, -50, 11, 0, TAU); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(124, -54, 4, 0, TAU); ctx.fill(); }
    if (sad){ ctx.beginPath(); ctx.moveTo(98, -82); ctx.lineTo(136, -74); ctx.stroke(); ctx.fillStyle = "#7CC4E8"; ctx.beginPath(); ctx.ellipse(132, -18 + ((t * 40) % 30), 6, 9, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "rgba(233,128,106,.5)"; ctx.beginPath(); ctx.ellipse(150, 20, 22, 14, 0, 0, TAU); ctx.fill();
    rr(ctx, -55, -172, 110, 22, 11); ctx.fillStyle = "#5A2A1E"; ctx.fill();
    if (cracked){ const k = clamp((t - tc) / .4, 0, 1); ctx.strokeStyle = "#5A2A1E"; ctx.lineWidth = 6; ctx.lineJoin = "round"; const Z = [[-40, -160], [-20, -110], [-55, -70], [-15, -20], [-45, 30], [-10, 90]]; ctx.beginPath(); ctx.moveTo(Z[0][0], Z[0][1]); for (let j = 1; j < Z.length * k; j++) ctx.lineTo(Z[j][0], Z[j][1]); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-55, -70); ctx.lineTo(-100 * k, -50); ctx.moveTo(-15, -20); ctx.lineTo(30 * k, 0); ctx.stroke(); }
    if (f.label){ const z = fit(ctx, th, f.label, 250, 38, 800); ctx.fillStyle = hexA(INK, .85); ctx.textAlign = "center"; ctx.fillText(f.label, -10, 40); ctx.textAlign = "left"; }
    ctx.restore();
    if (cracked){ for (let k = 0; k < 6; k++){ const d = t - tc; if (d > 1.2) break; ctx.fillStyle = hexA("#F6B48F", 1 - d / 1.2); ctx.beginPath(); ctx.arc(px - 40 + Math.cos(k) * 120 * d * 2, py - 40 + Math.sin(k * 1.7) * 60 * d + 300 * d * d, 9, 0, TAU); ctx.fill(); } }
    // coins
    const slotY = py - 172 * sc, ins = coins.filter(o => !o.c.out), outs = coins.filter(o => o.c.out), two = ins.length && outs.length;
    coins.forEach(o => { const lt = t - o.T; if (lt < 0) return;
      if (!o.c.out){ if (lt < .65){ const p = lt / .65, y = 575 + (slotY - 575) * p * p, sp = lt * 14; coin(ctx, px, y, 38, sp, o.c.coin);
          if (o.c.label){ ctx.save(); ctx.globalAlpha *= clamp(lt * 5, 0, 1); tag(ctx, th, "+ " + o.c.label, px + 210, y, GREEN, "#fff", 28, 400); ctx.restore(); } }
        else if (lt < .9) burst(ctx, px, slotY, lt - .65, M, 6); }
      else { if (lt < 1.3){ const p = clamp(lt / 1.3, 0, 1), side = (outs.indexOf(o) % 2 ? -1 : 1), x = px + side * 380 * p, y = slotY - 120 * Math.sin(Math.PI * p * .8) + 320 * p * p;
          ctx.save(); ctx.globalAlpha *= 1 - clamp((p - .75) * 4, 0, 1); coin(ctx, x, y, 34, lt * 12, o.c.coin); ctx.restore();
          if (o.c.label && lt < 1.1){ ctx.save(); ctx.globalAlpha *= clamp(lt * 5, 0, 1); tag(ctx, th, "− " + o.c.label, x, y - 66, RED, "#fff", 28, 400); ctx.restore(); } } } });
    // ledger chips under the pig
    const chips = (arr, cx0, inn) => arr.forEach((o, j) => { const lt = t - o.T - (inn ? .65 : .9); if (lt < 0) return; const q2 = eBack(clamp(lt / .35, 0, 1)), grid = !two && arr.length > 2, y = py + 250 + (grid ? j >> 1 : j) * 70; if (grid) cx0 = j % 2 ? 760 : 320;
      tag(ctx, th, (inn ? "+ " : "− ") + o.c.label, cx0, y, inn ? GREEN : RED, "#fff", 26, two ? 420 : 600, q2); });
    chips(ins.slice(two ? -3 : -4), two ? 320 : 540, true); chips(outs.slice(two ? -3 : -4), two ? 760 : 540, false);
  }, (s, f, i, add) => { (f.coins || []).forEach((c, k) => { const T = cueT(s, c.cue, .15 + k * .2, i); if (c.out) add(T, "whoosh"); else add(T + .62, "ping"); }); if (f.crackCue) add(cueT(s, f.crackCue, .8, i), "pop"); });

  /* ---------------- notebook: lined page, pen writes letter by letter, then strikes / ticks / circles ---------------- */
  TT.layout("notebook", "Buku catatan", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = f.headline ? 630 : 590, X0 = 140, X1 = 940, bot = 1310, LS = f.lines && f.lines.length > 4 ? 98 : 112, lines = (f.lines || []).slice(0, 5);
    const q = eOut(clamp((t - .1) / .5, 0, 1)); ctx.save(); ctx.globalAlpha *= q; ctx.translate(540, 960); ctx.rotate(-.015 + (1 - q) * .1); ctx.translate(-540, -960 + (1 - q) * 80);
    ctx.fillStyle = "rgba(0,0,0,.16)"; rr(ctx, X0 + 12, top + 16, X1 - X0, bot - top, 22); ctx.fill();
    rr(ctx, X0, top, X1 - X0, bot - top, 22); ctx.fillStyle = "#FFFDF7"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = hexA(INK, .25); ctx.stroke();
    ctx.fillStyle = hexA(th.accent, .9); rr(ctx, X0, top, X1 - X0, 56, 22); ctx.fill(); ctx.fillRect(X0, top + 30, X1 - X0, 26);
    for (let x = X0 + 50; x < X1 - 20; x += 62){ ctx.beginPath(); ctx.arc(x, top + 4, 13, 0, TAU); ctx.fillStyle = th.key === "B" ? "#2A2119" : "#F3E6D6"; ctx.fill(); ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, top - 6, 14, Math.PI * .9, Math.PI * 2.1); ctx.stroke(); }
    const y1 = top + 130; ctx.strokeStyle = "rgba(47,111,115,.25)"; ctx.lineWidth = 3; for (let y = y1 + LS * .5; y < bot - 20; y += LS){ ctx.beginPath(); ctx.moveTo(X0 + 20, y + 12); ctx.lineTo(X1 - 20, y + 12); ctx.stroke(); }
    ctx.strokeStyle = "rgba(216,67,21,.45)"; ctx.beginPath(); ctx.moveTo(X0 + 90, top + 60); ctx.lineTo(X0 + 90, bot - 10); ctx.stroke();
    if (f.title){ const z = fit(ctx, th, f.title, X1 - X0 - 140, 40, 800); ctx.fillStyle = th.accent; ctx.fillText(f.title, X0 + 110, top + 110); }
    const T = lines.map((l, k) => at(s, l.cue, .1 + k * .18)), tx = X0 + 112, maxW = X1 - tx - 90;
    let pen = null;
    lines.forEach((l, k) => { if (t < T[k]) return; const y = y1 + LS * (k + .5);
      const z = fit(ctx, th, l.text, maxW, 44, 700), nx = k + 1 < lines.length ? T[k + 1] : T[k] + 1.4, cps = Math.max(22, l.text.length / Math.max(.5, (nx - T[k]) * .8));
      const n = Math.min(l.text.length, Math.floor((t - T[k]) * cps)), sub = l.text.slice(0, n), w = ctx.measureText(sub).width, full = ctx.measureText(l.text).width;
      ctx.fillStyle = l.color === "accent" ? th.accent : INK; ctx.fillText(sub, tx, y);
      if (n < l.text.length) pen = [tx + w, y, true];
      else if (!pen || !pen[2]) pen = [tx + full + 10, y, false];
      if (l.mark){ const tm = l.markCue ? at(s, l.markCue, .9) : T[k] + l.text.length / cps + .2; if (t >= tm){ const p = easeIO(clamp((t - tm) / .45, 0, 1)); ctx.lineCap = "round"; ctx.lineJoin = "round";
        if (l.mark === "strike"){ ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(tx - 8, y - z * .32); for (let x = 0; x <= (full + 16) * p; x += 20) ctx.lineTo(tx - 8 + x, y - z * .32 + Math.sin(x * .09) * 3); ctx.stroke(); pen = [tx - 8 + (full + 16) * p, y - z * .32, p < 1]; }
        else if (l.mark === "circle"){ ctx.strokeStyle = th.accent; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(tx + full / 2, y - z * .32, full / 2 + 26, z * .78, -.03, -Math.PI * .6, -Math.PI * .6 + TAU * 1.05 * p); ctx.stroke(); }
        else { const mx = Math.min(X1 - 60, tx + full + 56), my = y - z * .3; ctx.strokeStyle = l.mark === "x" ? RED : GREEN; ctx.lineWidth = 10; ctx.beginPath();
          if (l.mark === "x"){ ctx.moveTo(mx - 20, my - 20); ctx.lineTo(mx - 20 + 40 * Math.min(1, p * 2), my - 20 + 40 * Math.min(1, p * 2)); if (p > .5){ ctx.moveTo(mx + 20, my - 20); ctx.lineTo(mx + 20 - 40 * (p - .5) * 2, my - 20 + 40 * (p - .5) * 2); } }
          else { const P2 = [[mx - 24, my], [mx - 6, my + 20], [mx + 28, my - 26]]; ctx.moveTo(P2[0][0], P2[0][1]); if (p < .4) ctx.lineTo(P2[0][0] + (P2[1][0] - P2[0][0]) * p / .4, P2[0][1] + (P2[1][1] - P2[0][1]) * p / .4); else { ctx.lineTo(P2[1][0], P2[1][1]); ctx.lineTo(P2[1][0] + (P2[2][0] - P2[1][0]) * (p - .4) / .6, P2[1][1] + (P2[2][1] - P2[1][1]) * (p - .4) / .6); } }
          ctx.stroke(); if (p >= 1) burst(ctx, mx, my, t - tm - .45, M, 6); } } } });
    ctx.restore();
    // pen
    const pp = pen || [X1 - 120, bot - 80, false], wob = pp[2] ? Math.sin(t * 30) * 4 : Math.sin(t * 2) * 4;
    ctx.save(); ctx.translate(pp[0], pp[1] + wob - (pp[2] ? 0 : 14)); ctx.rotate(Math.PI - .6);
    ctx.fillStyle = "rgba(0,0,0,.18)"; rr(ctx, 6, -170, 30, 170, 10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-12, -34); ctx.lineTo(12, -34); ctx.closePath(); ctx.fillStyle = "#E9C9A8"; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-4, -12); ctx.lineTo(4, -12); ctx.fillStyle = INK; ctx.fill();
    rr(ctx, -15, -190, 30, 158, 8); ctx.fillStyle = th.accent; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = "#8C8476"; ctx.fillRect(-15, -190, 30, 22); ctx.fillStyle = "#F2A7A0"; rr(ctx, -15, -214, 30, 26, 8); ctx.fill();
    ctx.restore();
  }, (s, f, i, add) => { (f.lines || []).forEach((l, k) => { add(cueT(s, l.cue, .1 + k * .18, i), "pop"); if (l.mark) add(l.markCue ? cueT(s, l.markCue, .9, i) + .3 : cueT(s, l.cue, .1 + k * .18, i) + l.text.length / 20 + .4, l.mark === "check" ? "chime" : l.mark === "circle" ? "ping" : "whoosh"); }); });

  /* ---------------- podium: winners (icons or walking actors) climb steps 1-2-3, trophy over #1 ---------------- */
  const STEP = { 1: { x: 540, h: 230, c: 0 }, 2: { x: 260, h: 160, c: 3 }, 3: { x: 820, h: 105, c: 5 } };
  function trophy(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.save(); ctx.rotate(t * .6); for (let k = 0; k < 12; k++){ ctx.rotate(TAU / 12); ctx.fillStyle = "rgba(244,168,92,.22)"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-14, -120); ctx.lineTo(14, -120); ctx.fill(); } ctx.restore();
    ctx.fillStyle = GOLD; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(50, -50); ctx.quadraticCurveTo(48, 20, 0, 26); ctx.quadraticCurveTo(-48, 20, -50, -50); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 9; ctx.strokeStyle = GOLD; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 52, -24, 20, d > 0 ? -1.4 : Math.PI - 1.7, d > 0 ? 1.7 : Math.PI + 1.4, d < 0); ctx.stroke(); });
    ctx.fillStyle = "#B87333"; ctx.fillRect(-9, 24, 18, 22); rr(ctx, -36, 44, 72, 18, 5); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(-30, -42, 10, 40);
    ctx.fillStyle = "#fff"; star(ctx, 0, -18, 16); ctx.restore(); }
  TT.layout("podium", "Podium juara", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const gy = 1300, places = (f.places || []).map((p, k) => ({ p, T: at(s, p.cue, .15 + k * .25) }));
    const tT = f.trophyCue ? at(s, f.trophyCue, .85) : 1e9;
    ctx.fillStyle = th.key === "B" ? "rgba(250,248,243,.25)" : hexA(INK, .25); rr(ctx, 100, gy, 880, 10, 5); ctx.fill();
    [2, 1, 3].forEach(r => { const S0 = STEP[r], q = eOut(clamp((t - .1 - (r === 1 ? .1 : r === 2 ? .2 : .3)) / .5, 0, 1)), h = S0.h * q; if (h < 2) return;
      ctx.save(); rr(ctx, S0.x - 135, gy - h, 270, h, 14); ctx.fillStyle = r === 1 ? th.accent : M.pal[S0.c % M.pal.length] === th.accent ? "#A0522D" : (r === 2 ? "#A0522D" : "#B87333"); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.16)"; rr(ctx, S0.x - 135, gy - h, 270, 26, 14); ctx.fill();
      ctx.beginPath(); rr(ctx, S0.x - 135, gy - h, 270, h, 14); ctx.clip(); font(ctx, 800, r === 1 ? 92 : 72, "Poppins"); ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.textAlign = "center"; ctx.fillText(String(r), S0.x, gy - h + (r === 1 ? 112 : r === 2 ? 96 : 82)); ctx.textAlign = "left"; ctx.restore(); });
    let won = null;
    places.forEach(o => { const S0 = STEP[o.p.rank || 1], top = gy - S0.h, lt = t - o.T; if (lt < 0) return; let x = S0.x, y = top, headTop;
      if (o.p.actor){ const a = o.p.actor, from = a.from != null ? a.from : (S0.x < 540 ? -90 : S0.x > 540 ? 1170 : -90), walkD = Math.abs(S0.x - from) / 620, hop = clamp((lt - walkD) / .45, 0, 1);
        x = lt < walkD ? from + (S0.x - from) * easeIO(lt / walkD) : S0.x; y = lt < walkD ? gy : gy + (top - gy) * hop - Math.sin(Math.PI * hop) * 90;
        const cheering = t > tT && (o.p.rank || 1) === 1, done = hop >= 1;
        const st = { x, walking: lt < walkD, pose: cheering ? "cheer" : (done ? (a.pose || "wave") : "stand"), expr: cheering ? "happy" : (a.expr || "smile"), face: lt < walkD ? Math.sign(S0.x - from) || 1 : 1, sit: false, say: null, shakeT: -9, nodT: done ? o.T + walkD + .5 : -9, show: true, showT: -9 };
        const r2 = drawActor(ctx, th, a, st, t, y, a.scale || .5); headTop = r2.headTop;
        if (done && lt - walkD < 1.2) burst(ctx, S0.x, top - 20, lt - walkD - .45, M, 8); }
      else { const k = clamp(lt / .5, 0, 1), yy = top - 70 - (1 - eBack(k)) * 300; ctx.save(); ctx.globalAlpha *= clamp(lt * 4, 0, 1); TT.disc(ctx, o.p.icon || "star", x, yy + Math.sin(t * 2 + x) * 4, 62, (o.p.rank || 1) === 1 ? GREEN : "#FFF7EE", (o.p.rank || 1) === 1 ? "#fff" : INK, INK); ctx.restore(); headTop = yy - 70;
        if (lt > .4 && lt < 1.3) burst(ctx, x, top - 20, lt - .4, M, 6); }
      if (o.p.label){ const q2 = popS(t, o.T + .3); if (q2) tag(ctx, th, o.p.label, S0.x, headTop - 38, (o.p.rank || 1) === 1 ? th.accent : (th.key === "B" ? "#FAF8F3" : INK), (o.p.rank || 1) === 1 ? "#fff" : (th.key === "B" ? INK : "#FFF7EE"), 28, 300, q2); }
      if ((o.p.rank || 1) === 1) won = { x: S0.x, y: headTop - 38 }; });
    if (t > tT){ const k = clamp((t - tT) / .6, 0, 1), y = won ? won.y - 120 : 700; trophy(ctx, won ? won.x : 540, y - (1 - eBack(k)) * 200 + Math.sin(t * 2) * 6, .9 * k, t); burst(ctx, won ? won.x : 540, y, t - tT - .3, M, 12); }
  }, (s, f, i, add) => { (f.places || []).forEach((p, k) => { const T = cueT(s, p.cue, .15 + k * .25, i); add(T, p.actor ? "whoosh" : "pop"); if (p.actor) add(T + Math.abs(STEP[p.rank || 1].x - (STEP[p.rank || 1].x < 540 ? -90 : 1170)) / 620 + .4, "pop"); }); if (f.trophyCue) add(cueT(s, f.trophyCue, .85, i) + .2, "chime"); });

  /* ---------------- pinboard: cork board, polaroids & notes pinned on cue, red string links them, verdict stamp ---------------- */
  const PB = { 2: [[310, 250], [770, 270]], 3: [[290, 200], [790, 220], [540, 470]], 4: [[290, 195], [790, 215], [300, 470], [780, 480]] };
  TT.layout("pinboard", "Papan bukti", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = f.headline ? 630 : 590, H = 670, items = (f.items || []).slice(0, 4), pos = PB[Math.max(2, items.length)] || PB[4];
    const q = eOut(clamp((t - .1) / .45, 0, 1)); ctx.save(); ctx.globalAlpha *= q;
    rr(ctx, 96, top, 888, H, 22); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
    rr(ctx, 120, top + 24, 840, H - 48, 12); ctx.fillStyle = "#D9A066"; ctx.fill(); ctx.save(); ctx.clip(); for (let k = 0; k < 220; k++){ ctx.fillStyle = k % 2 ? "rgba(142,78,46,.22)" : "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.arc(120 + (k * 137) % 840, top + 24 + (k * 71) % (H - 48), 2 + k % 3, 0, TAU); ctx.fill(); } ctx.restore();
    ctx.restore();
    const T = items.map((it, k) => at(s, it.cue, .1 + k * .2)), pins = [];
    items.forEach((it, k) => { if (t < T[k]) return; const [x, yy] = pos[k], y = top + yy, lt = t - T[k], p = clamp(lt / .45, 0, 1), rot = ((k * 37) % 7 - 3) * .022, photo = (it.kind || (k % 2 ? "note" : "photo")) === "photo";
      const sc = 1.35 - .35 * eOut(p); ctx.save(); ctx.globalAlpha *= clamp(lt * 5, 0, 1); ctx.translate(x, y - (1 - eOut(p)) * 60); ctx.rotate(rot + (1 - p) * .25 + Math.sin(t * 1.3 + k) * .008); ctx.scale(sc, sc);
      const w = photo ? 270 : 260, h = photo ? 250 : 210; ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.fillRect(-w / 2 + 8, -h / 2 + 12, w, h);
      if (photo){ ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = it.danger ? "#F7D6C8" : "#CFE7EE"; ctx.fillRect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 92);
        ctx.fillStyle = it.danger ? hexA(RED, .2) : "rgba(47,111,115,.18)"; ctx.beginPath(); ctx.moveTo(-w / 2 + 16, h / 2 - 76); ctx.lineTo(-40, -10); ctx.lineTo(20, 30); ctx.lineTo(70, -20); ctx.lineTo(w / 2 - 16, h / 2 - 76); ctx.fill();
        TT.disc(ctx, it.icon || "file", 0, -h / 2 + 16 + (h - 92) / 2, 44, it.danger ? RED : th.accent, "#fff");
        let z = fit(ctx, th, it.label, w - 30, 28, 800); let L = [it.label]; if (z < 24){ font(ctx, 800, 24, th.fam); L = wrap(ctx, it.label, w - 30).slice(0, 2); z = 24; } ctx.fillStyle = INK; ctx.textAlign = "center"; L.forEach((l, j) => ctx.fillText(l, 0, h / 2 - 34 + (j - (L.length - 1) / 2) * 28 + 6)); ctx.textAlign = "left"; }
      else { ctx.fillStyle = it.color || "#FCE38A"; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = "rgba(0,0,0,.06)"; ctx.fillRect(-w / 2, -h / 2, w, 34);
        if (it.icon) icon(ctx, it.icon, -w / 2 + 18, -h / 2 + 44, 40, it.danger ? RED : th.accent, 2.4);
        font(ctx, 800, 32, th.fam); let z = 32, L = wrap(ctx, it.label, w - 36); while ((L.length > 3 || L.some(l => ctx.measureText(l).width > w - 36)) && z > 22){ z -= 2; font(ctx, 800, z, th.fam); L = wrap(ctx, it.label, w - 36); }
        ctx.fillStyle = INK; ctx.textAlign = "center"; const yc = it.icon ? 30 : 10; L.slice(0, 3).forEach((l, j) => ctx.fillText(l, 0, yc + (j - (L.length - 1) / 2) * (z + 6) + z * .35)); ctx.textAlign = "left"; }
      if (it.mark){ const tm = at(s, it.markCue || it.cue, .85); if (t > tm){ const mp = eBack(clamp((t - tm) / .4, 0, 1)); ctx.save(); ctx.scale(mp, mp); ctx.lineCap = "round";
        if (it.mark === "x"){ ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-70, -70); ctx.lineTo(70, 70); ctx.moveTo(70, -70); ctx.lineTo(-70, 70); ctx.stroke(); }
        else if (it.mark === "check"){ ctx.beginPath(); ctx.arc(w / 2 - 20, -h / 2 + 20, 38, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(w / 2 - 38, -h / 2 + 20); ctx.lineTo(w / 2 - 25, -h / 2 + 34); ctx.lineTo(w / 2 - 2, -h / 2 + 6); ctx.stroke(); }
        else { ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, -10, w / 2 + 14, h / 2 + 10, .05, 0, TAU); ctx.stroke(); }
        ctx.restore(); } }
      ctx.restore();
      const pinY = y - h / 2 * sc - (1 - eOut(p)) * 60 + 10, pk = eBack(clamp((lt - .35) / .3, 0, 1)); pins.push([x, pinY + 4, k]);
      if (pk > 0){ ctx.save(); ctx.translate(x, pinY); ctx.scale(pk, pk); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(6, 10, 14, 7, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 17, 0, TAU); ctx.fillStyle = "#C62828"; ctx.fill(); ctx.beginPath(); ctx.arc(-5, -5, 6, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fill(); ctx.restore(); } });
    // red string
    const links = f.links || (f.linkCue ? items.slice(1).map((_, k) => ({ from: k, to: k + 1, cue: f.linkCue, delay: k * .5 })) : []);
    links.forEach((ln, k) => { const a = pins.find(p => p[2] === ln.from), b = pins.find(p => p[2] === ln.to); if (!a || !b) return; const tl = at(s, ln.cue, .6) + (ln.delay || 0); if (t < tl) return;
      const p = easeIO(clamp((t - tl) / .55, 0, 1)), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 40 + Math.sin(t * 2 + k) * 4;
      ctx.save(); ctx.strokeStyle = "#C62828"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a[0], a[1]);
      for (let j = 1; j <= 24 * p; j++){ const u = j / 24, x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * my + u * u * b[1]; ctx.lineTo(x, y); } ctx.stroke(); ctx.restore(); });
    // verdict stamp
    if (f.conclusion){ const tc = at(s, f.conclusion.cue, .8); if (t > tc){ const k = clamp((t - tc) / .35, 0, 1), sc = 1 + (1 - eOut(k)) * 1.2;
      ctx.save(); ctx.fillStyle = `rgba(24,21,15,${.35 * k})`; rr(ctx, 120, top + 24, 840, H - 48, 12); ctx.fill(); ctx.translate(540, top + H / 2 + (items.length === 3 ? -20 : 0)); ctx.rotate(-.06); ctx.scale(sc, sc); ctx.globalAlpha *= k;
      const col = f.conclusion.bad ? RED : GREEN; font(ctx, 800, 50, th.fam); let z = fit(ctx, th, f.conclusion.label, 640, 50, 800); const w = ctx.measureText(f.conclusion.label).width + 90;
      rr(ctx, -w / 2, -64, w, 128, 20); ctx.fillStyle = "#FFFDF7"; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = col; ctx.stroke(); rr(ctx, -w / 2 + 14, -50, w - 28, 100, 12); ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(f.conclusion.label, 0, z * .36); ctx.textAlign = "left"; ctx.restore(); burst(ctx, 540, top + H / 2, t - tc - .3, M, 12); } }
  }, (s, f, i, add) => { (f.items || []).forEach((it, k) => { add(cueT(s, it.cue, .1 + k * .2, i) + .35, "pop"); if (it.mark) add(cueT(s, it.markCue || it.cue, .85, i), it.mark === "check" ? "chime" : "whoosh"); });
    if (f.linkCue) add(cueT(s, f.linkCue, .6, i), "whoosh"); (f.links || []).forEach(l => add(cueT(s, l.cue, .6, i), "whoosh")); if (f.conclusion) add(cueT(s, f.conclusion.cue, .8, i), "chime"); });

  /* ---------------- c_gaze: worker at a laptop, reminder rings, looks out the window ~6 m away, 20 s countdown ---------------- */
  TT.layout("c_gaze", "Mata & jendela", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = f.headline ? 620 : 580, bot = 1320, X0 = 90, X1 = 990, floorY = 1180;
    const q = eOut(clamp((t - .05) / .4, 0, 1)); ctx.save(); ctx.globalAlpha *= q;
    rr(ctx, X0, top, X1 - X0, bot - top, 40); ctx.save(); ctx.clip();
    const g = ctx.createLinearGradient(0, top, 0, floorY); g.addColorStop(0, "#FFF3E4"); g.addColorStop(1, "#FBE6D0"); ctx.fillStyle = g; ctx.fillRect(X0, top, X1 - X0, floorY - top);
    ctx.fillStyle = "#E9C9A8"; ctx.fillRect(X0, floorY, X1 - X0, bot - floorY); ctx.fillStyle = "rgba(59,36,24,.12)"; ctx.fillRect(X0, floorY, X1 - X0, 8);
    // window with far view
    const wx = 560, wy = top + 50, ww = 380, wh = 330, tLook = f.lookCue ? at(s, f.lookCue, .3) : 1e9, look = clamp((t - tLook) / .6, 0, 1);
    rr(ctx, wx, wy, ww, wh, 14); ctx.fillStyle = "#CFE7EE"; ctx.fill(); ctx.save(); rr(ctx, wx, wy, ww, wh, 14); ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.ellipse(wx + 90 + Math.sin(t * .4) * 30, wy + 70, 48, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#9CC59A"; ctx.beginPath(); ctx.moveTo(wx, wy + wh - 90); ctx.quadraticCurveTo(wx + 140, wy + wh - 170, wx + ww, wy + wh - 110); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx, wy + wh); ctx.fill();
    const tx = wx + 270, ty = wy + wh - 120; ctx.fillStyle = "#8E4E2E"; ctx.fillRect(tx - 7, ty - 10, 14, 60); ctx.fillStyle = "#3E7D4F"; ctx.beginPath(); ctx.arc(tx + Math.sin(t * 1.3) * 3, ty - 30, 42, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(tx - 26, ty - 8, 26, 0, TAU); ctx.arc(tx + 28, ty - 6, 26, 0, TAU); ctx.fill();
    ctx.restore(); rr(ctx, wx, wy, ww, wh, 14); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 12; ctx.stroke(); ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
    // wall clock spinning fast until the reminder
    const tRing = f.ringCue ? at(s, f.ringCue, .2) : -1, cx0 = 230, cy0 = top + 110, spin = tRing > 0 ? Math.min(t, tRing) : (f.fastClock ? t : t * .1);
    ctx.beginPath(); ctx.arc(cx0, cy0, 56, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
    ctx.lineCap = "round"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx0, cy0); ctx.lineTo(cx0 + Math.sin(spin * 3) * 40, cy0 - Math.cos(spin * 3) * 40); ctx.stroke(); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx0, cy0); ctx.lineTo(cx0 + Math.sin(spin * .25 + 2) * 26, cy0 - Math.cos(spin * .25 + 2) * 26); ctx.stroke();
    if (f.clockLabel){ font(ctx, 800, 26, th.fam); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(f.clockLabel, cx0, cy0 + 92); ctx.textAlign = "left"; }
    // actor at desk
    const a = Object.assign({ hair: "long", shirt: TEAL, skin: "a" }, f.actor || {}), tired = f.tired && t < tLook, tRel = f.relaxCue ? at(s, f.relaxCue, .8) : 1e9;
    const st = { x: 230, walking: false, pose: t > tRing && tRing > 0 && t < tLook ? "phone" : (t >= tLook ? "rest" : "type"), expr: tired ? "tired" : t > tRel ? "happy" : t >= tLook ? "smile" : "neutral", face: 1, sit: true, say: null, shakeT: -9, nodT: t > tRel ? tRel : -9, show: true, showT: -9 };
    if (t >= tLook) st.pose = "rest";
    ctx.fillStyle = "#5A3A2A"; rr(ctx, st.x - 70, floorY - 180, 140, 140, 24); ctx.fill(); ctx.fillStyle = "#3B2418"; ctx.fillRect(st.x - 8, floorY - 40, 16, 50);
    const r = drawActor(ctx, th, a, st, t, floorY + 70, 1.0);
    const dx = 430, dy = floorY - 150; ctx.fillStyle = "#B5643C"; rr(ctx, dx - 190, dy, 380, 26, 8); ctx.fill(); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(dx - 170, dy + 26, 18, 150); ctx.fillRect(dx + 152, dy + 26, 18, 150);
    ctx.save(); ctx.translate(dx + 80, dy); const sg = ctx.createRadialGradient(0, -80, 0, 0, -80, 170); sg.addColorStop(0, `rgba(159,211,224,${t < tLook ? .45 : .15})`); sg.addColorStop(1, "rgba(159,211,224,0)"); ctx.fillStyle = sg; ctx.fillRect(-180, -260, 360, 260);
    rr(ctx, -100, -118, 200, 118, 12); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.beginPath(); ctx.arc(0, -59, 14, 0, TAU); ctx.fillStyle = hexA(th.accent, .8); ctx.fill(); rr(ctx, -110, -6, 220, 10, 5); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
    // phone ringing on desk
    if (tRing > 0){ const ph = [dx - 70, dy - 14], ring = t > tRing && t < tLook + .3; ctx.save(); ctx.translate(ph[0] + (ring ? Math.sin(t * 40) * 3 : 0), ph[1]); rr(ctx, -30, -14, 60, 20, 6); ctx.fillStyle = "#18150f"; ctx.fill(); ctx.restore();
      if (ring) emoteAt(ctx, th, "ring", ph[0], ph[1] - 40, t - tRing, t); }
    ctx.restore();
    // eyes strain marks
    if (tired){ ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const aa = -1.9 + k * .45, rr0 = 70 + Math.sin(t * 6 + k) * 6; ctx.beginPath(); ctx.moveTo(r.headX + Math.cos(aa) * rr0, r.headTop + 70 + Math.sin(aa) * rr0); ctx.lineTo(r.headX + Math.cos(aa) * (rr0 + 24), r.headTop + 70 + Math.sin(aa) * (rr0 + 24)); ctx.stroke(); } }
    // sight line to the far tree + distance tag
    if (t >= tLook){ const ex = r.headX + 30, ey = r.headTop + 60, p = easeIO(look); ctx.save(); ctx.strokeStyle = th.accent; ctx.lineWidth = 6; ctx.setLineDash([4, 16]); ctx.lineDashOffset = -t * 40; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + (tx - ex) * p, ey + (ty - 30 - ey) * p); ctx.stroke(); ctx.restore();
      if (p >= 1 && f.dist){ const k = eBack(clamp((t - tLook - .6) / .4, 0, 1)); tag(ctx, th, f.dist, (ex + tx) / 2 + 40, (ey + ty) / 2 - 70, th.accent, "#fff", 32, 360, k); } }
    if (t > tRel) emoteAt(ctx, th, "sparkle", r.headX, r.headTop + 10, t - tRel, t); else if (tired) emoteAt(ctx, th, "sweat", r.headX + 60, r.headTop + 10, t, t);
    // countdown
    if (f.timerCue){ const t0 = at(s, f.timerCue, .5), secs = f.secs || 20, dur = Math.max(2, Math.min(secs, (f.timerDur || 4))); if (t > t0){ const p = clamp((t - t0) / dur, 0, 1), n = Math.ceil(secs * (1 - p)), x = 820, y = top + 470, k = eBack(clamp((t - t0) / .4, 0, 1));
      ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.beginPath(); ctx.arc(0, 0, 78, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = hexA(INK, .2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 66, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - p)); ctx.strokeStyle = p >= 1 ? GREEN : th.accent; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.stroke();
      font(ctx, 800, 50, "Poppins"); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(p >= 1 ? "✓" : String(n), 0, 12); font(ctx, 700, 22, th.fam); ctx.fillText(f.timerLabel || "detik", 0, 44); ctx.textAlign = "left"; ctx.restore();
      if (p >= 1) burst(ctx, x, y, t - t0 - dur, M, 10); } }
    ctx.restore();
    rr(ctx, X0, top, X1 - X0, bot - top, 40); ctx.lineWidth = 4; ctx.strokeStyle = th.key === "B" ? "rgba(250,248,243,.25)" : hexA(INK, .12); ctx.stroke();
  }, (s, f, i, add) => { if (f.ringCue) add(cueT(s, f.ringCue, .2, i), "ping"); if (f.lookCue) add(cueT(s, f.lookCue, .3, i), "whoosh"); if (f.timerCue){ const t0 = cueT(s, f.timerCue, .5, i); add(t0, "pop"); add(t0 + Math.max(2, Math.min(f.secs || 20, f.timerDur || 4)), "chime"); } if (f.relaxCue) add(cueT(s, f.relaxCue, .8, i), "chime"); });

  /* ---------------- c_lift: side-view figure lifting a box (bad stoop / good squat / lift), annotated ---------------- */
  const LP = { // hip height above ground, hip x offset from feet, torso lean (rad, + = forward), box centre (dx from feet, height of centre above ground)
    stand: { hh: 292, hx: 0, th: .02, box: [250, 75] }, bad: { hh: 288, hx: -40, th: 1.32, box: [250, 75] },
    good: { hh: 150, hx: -70, th: .42, box: [150, 75] }, lift: { hh: 292, hx: 0, th: .06, box: [118, 300] } };
  function ik(ax, ay, bx, by, l1, l2, bend){ const d = Math.min(Math.hypot(bx - ax, by - ay), l1 + l2 - .01), a0 = Math.atan2(by - ay, bx - ax), c = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), a1 = a0 + bend * Math.acos(c);
    const jx = ax + Math.cos(a1) * l1, jy = ay + Math.sin(a1) * l1, ex = ax + Math.cos(a0) * d, ey = ay + Math.sin(a0) * d; return [jx, jy, ex, ey]; }
  TT.layout("c_lift", "Angkat beban", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = f.headline ? 620 : 580, bot = 1320, gy = 1250, fx = 400;
    const q = eOut(clamp((t - .05) / .4, 0, 1)); ctx.save(); ctx.globalAlpha *= q;
    rr(ctx, 90, top, 900, bot - top, 40); ctx.fillStyle = "#FFF3E4"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = "#E9C9A8"; ctx.fillRect(90, gy, 900, bot - gy); ctx.fillStyle = "rgba(59,36,24,.15)"; ctx.fillRect(90, gy, 900, 8);
    ctx.strokeStyle = "rgba(59,36,24,.06)"; ctx.lineWidth = 3; for (let x = 120; x < 990; x += 90){ ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, gy); ctx.stroke(); } ctx.restore();
    // pose interpolation
    const keys = (f.keys || []).map((k, j) => ({ k, T: at(s, k.cue, .1 + j * .3) })).sort((a, b) => a.T - b.T);
    let cur = LP[f.pose || "stand"], last = f.pose || "stand"; keys.forEach(o => { if (t < o.T) return; const nx = LP[o.k.pose] || cur, p = easeIO(clamp((t - o.T) / .9, 0, 1));
      cur = { hh: cur.hh + (nx.hh - cur.hh) * p, hx: cur.hx + (nx.hx - cur.hx) * p, th: cur.th + (nx.th - cur.th) * p, box: [cur.box[0] + (nx.box[0] - cur.box[0]) * p, cur.box[1] + (nx.box[1] - cur.box[1]) * p] }; last = o.k.pose; });
    const bad = last === "bad", breath = Math.sin(t * 2.2) * 3;
    const H = [fx + cur.hx, gy - cur.hh + breath], Sh = [H[0] + Math.sin(cur.th) * 240, H[1] - Math.cos(cur.th) * 240], Hd = [Sh[0] + Math.sin(cur.th) * 78 + 10, Sh[1] - Math.cos(cur.th) * 78];
    const bw = 170, bh = 150, B = [fx + cur.box[0], gy - cur.box[1]];
    const hand = [B[0] - bw / 2 + 22, B[1] - 8];
    const skin = "#D99A6E", shirt = (f.actor && f.actor.shirt) || TEAL, pants = "#3B2418";
    const leg = (dx, col) => { const [kx, ky] = ik(H[0] + dx, H[1], fx + dx, gy - 14, 150, 150, -1); ctx.strokeStyle = col; ctx.lineWidth = 44; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(H[0] + dx, H[1]); ctx.lineTo(kx, ky); ctx.lineTo(fx + dx, gy - 14); ctx.stroke();
      rr(ctx, fx + dx - 26, gy - 30, 84, 30, 12); ctx.fillStyle = "#18150f"; ctx.fill(); return [kx, ky]; };
    const arm = (dx, col) => { const [ex, ey, hx2, hy2] = ik(Sh[0] + dx, Sh[1], hand[0] + dx, hand[1], 125, 120, 1); ctx.strokeStyle = col; ctx.lineWidth = 32; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(Sh[0] + dx, Sh[1]); ctx.lineTo(ex, ey); ctx.lineTo(hx2, hy2); ctx.stroke(); ctx.beginPath(); ctx.arc(hx2, hy2, 19, 0, TAU); ctx.fillStyle = skin; ctx.fill(); };
    leg(-14, "#2A1A10"); arm(-12, "#25585B");
    const K = leg(8, pants);
    ctx.strokeStyle = shirt; ctx.lineWidth = 86; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(H[0], H[1] - 10); ctx.lineTo(Sh[0], Sh[1]); ctx.stroke();
    ctx.beginPath(); ctx.arc(Hd[0], Hd[1], 58, 0, TAU); ctx.fillStyle = skin; ctx.fill(); ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.arc(Hd[0] - 6, Hd[1] - 6, 60, Math.PI * .85 + cur.th, Math.PI * 1.75 + cur.th); ctx.fill();
    const ea = cur.th, fwd = [Math.cos(ea), Math.sin(ea)]; ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.arc(Hd[0] + fwd[0] * 32 - fwd[1] * 4, Hd[1] + fwd[1] * 32 - 6, 6, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 4; ctx.beginPath(); const mx = Hd[0] + fwd[0] * 34 + Math.sin(ea) * -2, my = Hd[1] + 24; if (bad && t > (keys.find(o => o.k.pose === "bad") || { T: 0 }).T + .9){ ctx.arc(mx, my + 8, 9, 1.2 * Math.PI, 1.9 * Math.PI); } else ctx.arc(mx, my - 4, 9, .2 * Math.PI, .8 * Math.PI); ctx.stroke();
    // box
    ctx.save(); ctx.translate(B[0], B[1]); rr(ctx, -bw / 2, -bh / 2, bw, bh, 10); ctx.fillStyle = "#D9A066"; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = "#8E4E2E"; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-bw / 2, -bh / 2 + 34); ctx.lineTo(bw / 2, -bh / 2 + 34); ctx.moveTo(0, -bh / 2); ctx.lineTo(0, -bh / 2 + 34); ctx.stroke();
    if (f.boxLabel){ font(ctx, 800, 26, th.fam); ctx.fillStyle = "#8E4E2E"; ctx.textAlign = "center"; ctx.fillText(f.boxLabel, 0, 40); ctx.textAlign = "left"; } ctx.restore();
    arm(8, shirt);
    ctx.restore();
    // warnings + annotations
    if (bad){ const bk = [H[0] + (Sh[0] - H[0]) * .3, H[1] + (Sh[1] - H[1]) * .3]; ctx.save(); ctx.globalAlpha = .55 + .35 * Math.sin(t * 8); const rg = ctx.createRadialGradient(bk[0], bk[1] - 30, 0, bk[0], bk[1] - 30, 90); rg.addColorStop(0, "rgba(216,67,21,.9)"); rg.addColorStop(1, "rgba(216,67,21,0)"); ctx.fillStyle = rg; ctx.fillRect(bk[0] - 90, bk[1] - 120, 180, 180); ctx.restore();
      ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(bk[0] - 40, bk[1] - 90); ctx.lineTo(bk[0] - 20, bk[1] - 60); ctx.lineTo(bk[0] - 45, bk[1] - 40); ctx.lineTo(bk[0] - 20, bk[1] - 10); ctx.stroke(); }
    (f.marks || []).forEach((m, j) => { const tm = at(s, m.cue, .3 + j * .2); if (t < tm) return; const k = eBack(clamp((t - tm) / .4, 0, 1)), col = m.bad ? RED : GREEN; let L, ax, ay;
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = col; ctx.lineWidth = 7;
      if (m.kind === "knee"){ ctx.beginPath(); ctx.arc(K[0], K[1], 50, -Math.PI * .95, -Math.PI * .95 + 1.6 * k); ctx.stroke(); L = [850, gy - 70]; ax = K[0] + 40; ay = K[1]; }
      else if (m.kind === "back"){ ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(H[0] - 60 * Math.cos(cur.th), H[1] - 40); ctx.lineTo(H[0] - 60 * Math.cos(cur.th) + (Sh[0] - H[0]) * 1.15 * k, H[1] - 40 + (Sh[1] - H[1]) * 1.15 * k); ctx.stroke(); L = [250, top + 80]; ax = H[0] - 50 + (Sh[0] - H[0]) * .8; ay = H[1] - 40 + (Sh[1] - H[1]) * .8; }
      else if (m.kind === "close"){ const y = B[1] - 20, x0 = H[0] + (Sh[0] - H[0]) * .5 + 40, x1 = B[0] - bw / 2 - 6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + (x1 - x0) * k, y); ctx.stroke(); L = [790, top + 80]; ax = B[0]; ay = B[1] - bh / 2 - 10; }
      else { L = [250, top + 80]; ax = H[0]; ay = H[1] - 80; }
      ctx.restore();
      if (m.label){ ctx.save(); ctx.globalAlpha *= clamp((t - tm) * 4, 0, 1); ctx.strokeStyle = hexA(col, .7); ctx.lineWidth = 4; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(L[0], L[1] + 30); ctx.lineTo(ax, ay); ctx.stroke(); ctx.setLineDash([]);
        tag(ctx, th, (m.bad ? "✕ " : "✓ ") + m.label, L[0], L[1], col, "#fff", 30, 420, k); ctx.restore(); }
      if (t - tm < 1) burst(ctx, ax, ay, t - tm - .2, M, 6); });
  }, (s, f, i, add) => { (f.keys || []).forEach((k, j) => add(cueT(s, k.cue, .1 + j * .3, i), k.pose === "bad" ? "pop" : "whoosh")); (f.marks || []).forEach((m, j) => add(cueT(s, m.cue, .3 + j * .2, i), m.bad ? "pop" : "chime")); });
})();
