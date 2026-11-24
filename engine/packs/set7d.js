/* Scene pack set7d: cabinet, trash, cloud, photo, barcode, keycard, blinds, remote.
   Runs after motion-tangani.js in its own <script>. Canvas 1080x1920; visuals kept in y ~560-1330, text in x 90-990.
   cabinet: filing cabinet, drawers [{label, icon, cue, bad}] slide out on cue (bad = stuffed, jams + papers fly); label, doneCue/doneLabel; actor pulls.
   trash:   paper cards [{label, icon, cue, toss|keep}] - toss: crumpled into a ball and thrown into the bin; keep: checked. bin, doneCue/doneLabel.
   cloud:   laptop/phone uploads files [{label, icon, cue, fail, hold}] to a cloud with a progress bar (bar:{from,to,max,unit,dec,warn}); label, doneCue/doneLabel.
   photo:   tilted photo (before:{label, icon, items}) with sticky notes [{label, cue}]; fixCue straightens + crop marks + scan -> after:{label, icon}; crop, fixLabel.
   barcode: cashier counter; items [{label, icon, cue, price, value, skip}] slide to the scanner and beep; receipt (label) with lines + total:{label, prefix, suffix, value}.
   keycard: door with card reader (label = room); guests [{label, cue, access: edit|view|deny|in, status}] walk up, tap the card; door opens / window / denied.
   blinds:  window with blinds; openCue (+open fraction) or levels [{cue, open}] raise them; items [{label, icon, cue}] appear in the view; before/after labels.
   remote:  TV + seated actor with a remote; channels [{label, icon, cue, num, bad, good}] switch with static; offCue turns the TV off. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, actorState, drawActor, bubbleAt, emoteAt, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const RED = "#D84315", GREEN = "#3BB273", AMBER = "#E8A317", PAPER = "#FFF7EE", TEAL = "#2F6F73";
  const dark = th => th.key === "B";
  const k01 = (t, t0, d) => clamp((t - t0) / d, 0, 1), lerp = (a, b, q) => a + (b - a) * q;
  const popAt = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  const CAST = [{ hair: "hijab", hijab: "#2F6F73", shirt: "#E89544", skin: "b" }, { hair: "short", shirt: "#2F6F73", skin: "a" },
    { hair: "long", shirt: "#A0522D", skin: "d" }, { hair: "short", shirt: "#C2691F", skin: "c", glasses: true }];
  const ACT = (a, x, k) => Object.assign({ x }, CAST[(k || 0) % CAST.length], a || {});
  const withKeys = (a, keys) => (a.keys && a.keys.length) ? a : Object.assign({}, a, { keys });
  // cue times for a list, kept at least `gap` apart
  function seq(s, arr, base, step, idx, gap){ let prev = -9; return (arr || []).map((it, k) => { const c = Math.max(at(s, it && it.cue, base + k * step, idx), prev + (gap || 0)); prev = c; return c; }); }
  const fmtNum = (v, dec) => { const p = (+v).toFixed(dec || 0).split("."); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (p[1] && +p[1] ? "," + p[1] : ""); };

  /* ---------- text (always measured; shrinks/wraps to fit) ---------- */
  function wrap(ctx, text, maxW){ const ws = String(text || "").split(/\s+/).filter(Boolean), out = []; let cur = "";
    for (const w of ws){ const tr = cur ? cur + " " + w : w; if (!cur || ctx.measureText(tr).width <= maxW) cur = tr; else { out.push(cur); cur = w; } }
    if (cur) out.push(cur); return out.length ? out : [""]; }
  function fit(ctx, th, text, size, maxW, maxLines, weight, min){ let sz = size, lines;
    for (;;){ font(ctx, weight || 800, sz, th.fam); lines = wrap(ctx, text, maxW); const mw = Math.max(...lines.map(l => ctx.measureText(l).width));
      if ((lines.length <= (maxLines || 2) && mw <= maxW) || sz <= (min || 16)) break; sz -= 1; }
    return { sz, lines: lines.slice(0, maxLines || 2) }; }
  function textC(ctx, th, text, x, y, size, maxW, maxLines, color, weight){ const r = fit(ctx, th, text, size, maxW, maxLines, weight); const lh = r.sz * 1.14;
    ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle"; r.lines.forEach((l, i) => ctx.fillText(l, x, y + (i - (r.lines.length - 1) / 2) * lh));
    ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; return r; }
  // rounded tag, up to 2 lines, optional icon (name or draw fn(ctx, cx, cy, size)); kept inside x 90..990
  function tag(ctx, th, text, x, y, o){ o = o || {}; const size = o.size || 30, maxW = o.maxW || 320, ic = !!o.icon;
    const inner = maxW - size * 1.3 - (ic ? size * 1.1 + 10 : 0);
    const { sz, lines } = fit(ctx, th, text, size, inner, o.lines || 2, o.weight || 800, o.min || 17); const lh = sz * 1.16;
    const tw = Math.max(...lines.map(l => ctx.measureText(l).width)), isz = ic ? sz * 1.1 : 0;
    const w = tw + sz * 1.3 + (ic ? isz + 10 : 0), h = lines.length * lh + sz * .72;
    const X0 = o.align === "left" ? x + w / 2 : o.align === "right" ? x - w / 2 : x, X = o.clampOff ? X0 : clamp(X0, 90 + w / 2, 990 - w / 2);
    const k = o.k == null ? 1 : o.k; if (k <= 0) return { w, h, cx: X };
    ctx.save(); ctx.translate(X, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(k, k); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    if (o.shadow !== false){ rr(ctx, -w / 2 + 3, -h / 2 + 6, w, h, Math.min(h / 2, sz * .95)); ctx.fillStyle = "rgba(0,0,0,.13)"; ctx.fill(); }
    rr(ctx, -w / 2, -h / 2, w, h, Math.min(h / 2, sz * .95)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill();
    if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 3; ctx.stroke(); }
    const x0 = -w / 2 + sz * .65;
    if (ic){ if (typeof o.icon === "function") o.icon(ctx, x0 + isz / 2, 0, isz); else icon(ctx, o.icon, x0, -isz / 2, isz, o.fg || INK, 2.4); }
    font(ctx, o.weight || 800, sz, th.fam); ctx.fillStyle = o.fg || INK; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const tx = x0 + (ic ? isz + 10 : 0) + tw / 2;
    lines.forEach((l, i) => ctx.fillText(l, tx, (i - (lines.length - 1) / 2) * lh + sz * .04));
    if (o.strike){ ctx.strokeStyle = o.strike; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tx - tw / 2 - 6, 0); ctx.lineTo(tx + tw / 2 + 6, 0); ctx.stroke(); }
    ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; ctx.restore(); return { w, h, cx: X }; }

  /* ---------- small glyphs ---------- */
  function checkDisc(ctx, x, y, r, col){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || GREEN; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .34); ctx.lineTo(x + r * .45, y - r * .3); ctx.stroke(); }
  function crossDisc(ctx, x, y, r, col){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .35, y - r * .35); ctx.lineTo(x + r * .35, y + r * .35); ctx.moveTo(x + r * .35, y - r * .35); ctx.lineTo(x - r * .35, y + r * .35); ctx.stroke(); }
  function pauseDisc(ctx, x, y, r, col){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || AMBER; ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillRect(x - r * .38, y - r * .4, r * .25, r * .8); ctx.fillRect(x + r * .13, y - r * .4, r * .25, r * .8); }
  function eyeIco(ctx, x, y, s, col){ ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * .11; ctx.beginPath(); ctx.moveTo(x - s * .5, y); ctx.quadraticCurveTo(x, y - s * .55, x + s * .5, y); ctx.quadraticCurveTo(x, y + s * .55, x - s * .5, y); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, s * .15, 0, TAU); ctx.fill(); ctx.restore(); }
  function penIco(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 4); ctx.fillStyle = col; ctx.fillRect(-s * .38, -s * .11, s * .62, s * .22); ctx.beginPath(); ctx.moveTo(s * .27, -s * .11); ctx.lineTo(s * .46, 0); ctx.lineTo(s * .27, s * .11); ctx.closePath(); ctx.fill(); ctx.restore(); }
  const glyph = (fn, col) => (ctx, x, y, s) => fn(ctx, x, y, s, col);
  function spinner(ctx, x, y, s, t, col){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * .14; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(x, y, s * .38, t * 7, t * 7 + 4.2); ctx.stroke(); ctx.restore(); }
  function extras(ctx, th, a, st, r, t){ if (!r) return;
    if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (a.emoteDx || 0), r.headTop - 30, t - st.emoteT, t);
    if (st.say) bubbleAt(ctx, th, st.say, r.headX + (a.bubbleDx || 0), r.headTop - (st.emote ? 90 : 10), st.chat, t - st.sayT); }
  function floorShadow(ctx, x, y, w){ ctx.fillStyle = "rgba(0,0,0,.14)"; ctx.beginPath(); ctx.ellipse(x, y, w, w * .09, 0, 0, TAU); ctx.fill(); }

  /* =====================================================================
     cabinet: filing cabinet on the right, actor on the left pulls drawers out on cue.
     ===================================================================== */
  const CB = { X0: 540, CW: 350, Y0: 660, Y1: 1300, SL: 170 };
  TT.layout("cabinet", "Lemari arsip", (ctx, th, s, t) => {
    const f = s.f, M = mv(), D = (f.drawers || []).slice(0, 4), n = Math.max(1, D.length); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = seq(s, D, .15, .22, undefined, .45), tD = f.doneCue ? at(s, f.doneCue, .9) : null, { X0, CW, Y0, Y1, SL } = CB;
    const pad = 22, dh = (Y1 - Y0 - pad * 2 - 40) / n, FW = CW - 30, doneK = tD != null ? eOut(k01(t, tD, .45)) : 0;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    const enterY = (1 - eOut(k01(t, 0, .5))) * 60; ctx.translate(0, enterY);
    floorShadow(ctx, X0 + CW / 2 - 60, Y1 + 4, CW * .8);
    // body
    rr(ctx, X0, Y0, CW, Y1 - Y0, 22); ctx.fillStyle = "#C98B5E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(X0 + CW - 34, Y0 + 20, 12, Y1 - Y0 - 40);
    rr(ctx, X0 - 12, Y0 - 18, CW + 24, 30, 12); ctx.fillStyle = "#A0522D"; ctx.fill(); ctx.stroke();
    // little plant on top
    ctx.save(); ctx.translate(X0 + CW - 70, Y0 - 18); rr(ctx, -26, -46, 52, 46, 10); ctx.fillStyle = TEAL; ctx.fill(); ctx.fillStyle = "#3E7D4F";
    for (let k = 0; k < 4; k++){ ctx.save(); ctx.translate(0, -46); ctx.rotate(-.8 + k * .53 + Math.sin(t * 1.4 + k) * .06); ctx.beginPath(); ctx.ellipse(0, -36, 12, 36, 0, 0, TAU); ctx.fill(); ctx.restore(); } ctx.restore();
    const late = []; let lastBad = -9;
    const DS = D.map((d, i) => { const sy = Y0 + pad + 20 + i * dh, sh = dh - 16, T0 = T[i], bad = !!d.bad; let o = 0, jit = 0;
      if (t >= T0){ if (bad){ o = .34 * eBack(k01(t, T0, .45)); const u = t - T0; jit = u < 1.3 ? Math.sin(u * 38) * 6 * (1 - u / 1.3) : 0; lastBad = Math.max(lastBad, T0); } else o = eOut(k01(t, T0, .55)); }
      else if (bad) jit = Math.sin(t * 9 + i) * 1.5;
      o *= 1 - doneK; return { d, i, sy, sh, T0, bad, o, jit, fx: X0 + 15 - o * SL + jit, fy: sy - o * 10 }; });
    // pass 1: slots and what is visible inside an open drawer
    DS.forEach(({ i, sy, sh, bad, o, fx }) => { rr(ctx, X0 + 15, sy, FW, sh, 10); ctx.fillStyle = "#3B2418"; ctx.fill();
      const x0 = fx + FW, x1 = X0 + 15 + FW; if (x1 - x0 < 8) return;
      ctx.save(); ctx.beginPath(); ctx.rect(x0, sy - 4, x1 - x0, sh + 4); ctx.clip();
      if (bad){ for (let k = 0; k < 9; k++){ ctx.save(); ctx.translate(x0 + 10 + k * 20, sy + sh * .55); ctx.rotate(Math.sin(k * 2.7) * .5 + Math.sin(t * 3 + k) * .05); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-18, -sh * .45, 36, sh * .8); ctx.strokeStyle = hexA(INK, .5); ctx.lineWidth = 2; ctx.strokeRect(-18, -sh * .45, 36, sh * .8); ctx.restore(); } }
      else for (let k = 0; k < 6; k++){ const fh = sh * (.62 + (k % 3) * .1); rr(ctx, x0 + 12 + k * 30, sy + sh - fh, 24, fh + 8, 5); ctx.fillStyle = k % 2 ? PAPER : M.pal[(k + i) % 3]; ctx.fill(); ctx.strokeStyle = hexA(INK, .5); ctx.lineWidth = 2; ctx.stroke(); }
      ctx.restore(); });
    // pass 2: drawer fronts
    DS.forEach(({ d, i, sh, T0, bad, fx, fy }) => {
      if (bad){ for (let k = 0; k < 5; k++){ ctx.save(); ctx.translate(fx + 60 + k * 58, fy + 2); ctx.rotate((k % 2 ? .3 : -.25) + Math.sin(t * 3 + k) * .05); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-20, -12, 40, 20); ctx.strokeStyle = hexA(INK, .5); ctx.lineWidth = 2; ctx.strokeRect(-20, -12, 40, 20); ctx.restore(); } }
      rr(ctx, fx, fy, FW, sh, 12); ctx.fillStyle = bad && t >= T0 ? "#F6D5C5" : "#F3DCC2"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      rr(ctx, fx + 14, fy + sh / 2 - 32, 16, 64, 8); ctx.fillStyle = INK; ctx.fill();
      const pw = FW - 62, ph = Math.min(sh * .7, 110); rr(ctx, fx + 44, fy + sh / 2 - ph / 2, pw, ph, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .6); ctx.lineWidth = 3; ctx.stroke();
      textC(ctx, th, d.label || "", fx + 44 + pw / 2, fy + sh / 2, Math.min(32, ph * .34), pw - 24, 2, INK, 800);
      const kb = popAt(t, T0 + .25, .4) * (1 - doneK);
      if (kb > 0) late.push(() => { ctx.save(); ctx.translate(fx + 6, fy + 8); ctx.scale(kb, kb); if (bad) crossDisc(ctx, 0, 0, 30); else { ctx.beginPath(); ctx.arc(0, 0, 32, 0, TAU); ctx.fillStyle = M.pal[i % 3]; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.stroke(); icon(ctx, d.icon || "file", -18, -18, 36, "#fff", 2.4); } ctx.restore(); });
      if (bad && t >= T0 && t - T0 < 1.6){ const u = (t - T0) / 1.6; for (let k = 0; k < 4; k++){ const vx = -120 - k * 70, vy = -300 - k * 60;
          late.push(() => { ctx.save(); ctx.globalAlpha *= 1 - u; ctx.translate(fx + 40 + k * 30 + vx * u, fy + vy * u + 520 * u * u); ctx.rotate(u * (3 + k)); ctx.fillStyle = "#fff"; ctx.fillRect(-24, -30, 48, 60); ctx.strokeStyle = hexA(INK, .5); ctx.lineWidth = 2; ctx.strokeRect(-24, -30, 48, 60); ctx.restore(); }); } }
      if (!bad && t >= T0) late.push(() => burst(ctx, fx + 6, fy + 8, t - T0 - .25, M, 6));
    });
    if (f.label) tag(ctx, th, f.label, X0 + CW / 2 - 40, Y0 - 62, { bg: INK, fg: PAPER, size: 28, maxW: 330, lines: 1, icon: f.icon });
    late.forEach(fn => fn());
    // actor
    const auto = [{ at: 0, pose: "stand", expr: "neutral" }];
    D.forEach((d, i) => { auto.push({ at: T[i] - .15, pose: "point", expr: d.bad ? "worried" : "smile", emote: d.bad ? "sweat" : null, say: d.say }); });
    if (tD != null) auto.push({ at: tD, pose: "cheer", expr: "happy", emote: "sparkle" });
    const a = withKeys(ACT(f.actor, 225, 1), auto), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, 1305, a.scale || .86);
    if (tD != null && t >= tD){ const k = popAt(t, tD + .15, .45); ctx.save(); ctx.translate(X0 + CW / 2, (Y0 + Y1) / 2 - 40); ctx.scale(k, k); checkDisc(ctx, 0, 0, 86); ctx.restore();
      burst(ctx, X0 + CW / 2, (Y0 + Y1) / 2 - 40, t - tD - .15, M, 10);
      if (f.doneLabel) tag(ctx, th, f.doneLabel, X0 + CW / 2, (Y0 + Y1) / 2 + 100, { bg: GREEN, fg: "#fff", size: 32, maxW: 400, k: popAt(t, tD + .35, .4) }); }
    extras(ctx, th, a, st, r, t);
    ctx.restore();
  }, (s, f, i, add) => { const T = seq(s, f.drawers, .15, .22, i, .45); (f.drawers || []).slice(0, 4).forEach((d, k) => { add(T[k], d.bad ? "whoosh" : "pop"); if (d.bad) add(T[k] + .3, "ping"); });
    if (f.doneCue) add(at(s, f.doneCue, .9, i) + .15, "chime"); });

  /* =====================================================================
     trash: paper cards; toss = crumple into a ball and throw into the bin, keep = checked.
     ===================================================================== */
  const TB = { BX: 800, BT: 1110, BB: 1300 };
  function ballPath(ctx, r, seed){ ctx.beginPath(); for (let k = 0; k < 11; k++){ const a = k / 11 * TAU, rr2 = r * (.82 + .18 * Math.sin(seed * 7 + k * 2.3)); ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); }
  function paperCard(ctx, th, it, M, k, W, H, keep){
    rr(ctx, -W / 2 + 4, -H / 2 + 8, W, H, 18); ctx.fillStyle = "rgba(0,0,0,.14)"; ctx.fill();
    rr(ctx, -W / 2, -H / 2, W, H, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = keep ? GREEN : INK; ctx.lineWidth = keep ? 7 : 4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2 - 34, -H / 2); ctx.lineTo(W / 2, -H / 2 + 34); ctx.lineTo(W / 2 - 34, -H / 2 + 34); ctx.closePath(); ctx.fillStyle = "#F3DCC2"; ctx.fill();
    ctx.beginPath(); ctx.arc(0, -H / 2 + 56, 36, 0, TAU); ctx.fillStyle = it.toss ? "#9A6A50" : M.pal[k % 3]; ctx.fill(); icon(ctx, it.icon || "file", -21, -H / 2 + 35, 42, "#fff", 2.4);
    textC(ctx, th, it.label || "", 0, H / 2 - 56, 32, W - 34, 2, INK, 800);
  }
  TT.layout("trash", "Tempat sampah", (ctx, th, s, t) => {
    const f = s.f, M = mv(), I = (f.items || []).slice(0, 4), n = I.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = seq(s, I, .2, .2, undefined, .7), tD = f.doneCue ? at(s, f.doneCue, .9) : null, { BX, BT, BB } = TB;
    const W = n <= 2 ? 300 : 282, H = 205, pos = n <= 3 ? I.map((_, k) => [540 + (k - (n - 1) / 2) * (n <= 2 ? 340 : 296), 775]) : I.map((_, k) => [430 + (k % 2) * 300, 715 + Math.floor(k / 2) * 215]);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // flight state
    const sts = I.map((it, k) => { const T0 = T[k]; if (!it.toss || t < T0) return { ph: "card" }; const q1 = k01(t, T0, .45), q2 = k01(t, T0 + .45, .7);
      if (q1 < 1) return { ph: "crumple", q: q1 }; if (q2 < 1) return { ph: "fly", q: q2 }; return { ph: "in", tin: T0 + 1.15 }; });
    const nIn = sts.filter(x => x.ph === "in").length, lastIn = Math.max(-9, ...sts.filter(x => x.ph === "in").map(x => x.tin));
    const flying = sts.some(x => x.ph === "fly" && x.q > .35) || (t - lastIn < .3 && lastIn > 0);
    // bin (back + lid)
    floorShadow(ctx, BX, BB + 4, 130);
    ctx.beginPath(); ctx.moveTo(BX - 110, BT); ctx.lineTo(BX + 110, BT); ctx.lineTo(BX + 86, BB); ctx.lineTo(BX - 86, BB); ctx.closePath(); ctx.fillStyle = "#A0522D"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 8; [-50, 0, 50].forEach(dx => { ctx.beginPath(); ctx.moveTo(BX + dx, BT + 26); ctx.lineTo(BX + dx * .8, BB - 22); ctx.stroke(); });
    if (nIn > 0){ for (let k = 0; k < Math.min(nIn, 4); k++){ ctx.save(); ctx.translate(BX - 50 + k * 34, BT - 4 - (k % 2) * 10); ballPath(ctx, 26, k + 1); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); } }
    const lid = flying ? -1.05 : (t - lastIn < .6 && lastIn > 0 ? -1.05 * (1 - eBack(k01(t, lastIn + .25, .35))) : 0);
    ctx.save(); ctx.translate(BX + 116, BT - 10); ctx.rotate(lid); rr(ctx, -236, -14, 240, 26, 12); ctx.fillStyle = "#7A3E22"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke(); rr(ctx, -140, -32, 48, 20, 8); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
    if (f.bin) tag(ctx, th, f.bin, BX, BT + 105, { bg: PAPER, fg: INK, size: 26, maxW: 170, lines: 2, shadow: false });
    if (nIn > 0){ const kc = .75 + .25 * popAt(t, lastIn, .35); ctx.save(); ctx.translate(BX + 100, BT + 30); ctx.scale(kc, kc); ctx.beginPath(); ctx.arc(0, 0, 32, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.stroke();
      font(ctx, 900, 32, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(String(nIn), 0, 11); ctx.textAlign = "left"; ctx.restore(); }
    // cards
    I.forEach((it, k) => { const [px, py] = pos[k], st = sts[k], ap = popAt(t, .12 + k * .12, .45); if (!ap || st.ph === "in") return;
      const keep = it.keep && t >= T[k], kk = keep ? 1 + .08 * Math.sin(k01(t, T[k], .5) * Math.PI) : 1;
      if (st.ph === "card"){ ctx.save(); ctx.translate(px, py + Math.sin(t * 1.6 + k) * 4 - (keep ? 10 * eOut(k01(t, T[k], .3)) : 0)); ctx.rotate((k % 2 ? .03 : -.03)); ctx.scale(ap * kk, ap * kk); paperCard(ctx, th, it, M, k, W, H, keep); ctx.restore();
        if (keep){ const kc = popAt(t, T[k] + .1, .4); ctx.save(); ctx.translate(px + W / 2 - 14, py - H / 2 + 6); ctx.scale(kc, kc); checkDisc(ctx, 0, 0, 30); ctx.restore(); burst(ctx, px, py, t - T[k], M, 7); } }
      else if (st.ph === "crumple"){ const q = st.q, sc = lerp(1, .3, eOut(q)); ctx.save(); ctx.translate(px + Math.sin(q * 50) * 6 * (1 - q), py); ctx.rotate(q * 1.2);
        ctx.save(); ctx.globalAlpha *= 1 - q; ctx.scale(sc, sc * (1 - .25 * q)); paperCard(ctx, th, it, M, k, W, H, false); ctx.restore();
        ctx.globalAlpha *= q; ballPath(ctx, 34, k + 1); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
      else if (st.ph === "fly"){ const q = st.q, x = lerp(px, BX, q), y = lerp(py, BT - 20, q) - Math.sin(q * Math.PI) * 220; ctx.save(); ctx.translate(x, y); ctx.rotate(q * 9);
        ballPath(ctx, 34 - q * 6, k + 1); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
        ctx.strokeStyle = hexA(INK, .4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, -6); ctx.lineTo(4, 4); ctx.lineTo(14, -10); ctx.stroke(); ctx.restore(); }
    });
    // actor
    const auto = [{ at: 0, pose: "stand", expr: "neutral" }];
    I.forEach((it, k) => auto.push(it.toss ? { at: T[k] - .1, pose: "point", expr: "neutral" } : { at: T[k], pose: "thumbs", expr: "smile", emote: it.keep ? "check" : null }));
    if (tD != null) auto.push({ at: tD, pose: "cheer", expr: "happy", emote: "sparkle" });
    const a = withKeys(ACT(f.actor, 230, 0), auto), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, 1305, a.scale || .82);
    I.forEach((it, k) => { if (it.toss && t >= T[k] + 1.15) burst(ctx, BX, BT - 30, t - T[k] - 1.15, M, 6); });
    if (tD != null && f.doneLabel) tag(ctx, th, f.doneLabel, 500, 1210, { bg: GREEN, fg: "#fff", size: 30, maxW: 340, k: popAt(t, tD, .45), icon: glyph(checkDisc2, "#fff") });
    extras(ctx, th, a, st, r, t);
    ctx.restore();
  }, (s, f, i, add) => { const T = seq(s, f.items, .2, .2, i, .7); (f.items || []).slice(0, 4).forEach((it, k) => { if (it.toss){ add(T[k], "whoosh"); add(T[k] + 1.15, "pop"); } else add(T[k], it.keep ? "chime" : "pop"); });
    if (f.doneCue) add(at(s, f.doneCue, .9, i), "chime"); });
  function checkDisc2(ctx, x, y, s, col){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * .16; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x - s * .35, y); ctx.lineTo(x - s * .08, y + s * .28); ctx.lineTo(x + s * .38, y - s * .28); ctx.stroke(); ctx.restore(); }

  /* =====================================================================
     cloud: files fly from a laptop/phone into a cloud; progress bar, status chips.
     ===================================================================== */
  const CL = { CX: 540, CY: 705, DX: 420, BY: 1150, FLY: 1.0 };
  function cloudPath(ctx, cx, cy){ ctx.beginPath(); ctx.arc(cx - 135, cy + 5, 85, 0, TAU); ctx.moveTo(cx + 115, cy - 40); ctx.arc(cx, cy - 40, 115, 0, TAU); ctx.moveTo(cx + 220, cy + 5); ctx.arc(cx + 135, cy + 5, 85, 0, TAU); ctx.roundRect(cx - 220, cy - 20, 440, 110, 55); }
  function fileGlyph(ctx, it, M, k, sc, col){ ctx.save(); ctx.scale(sc, sc); rr(ctx, -34, -42, 68, 84, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = col || INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, -42); ctx.lineTo(34, -22); ctx.lineTo(14, -22); ctx.closePath(); ctx.fillStyle = "#F3DCC2"; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 8, 22, 0, TAU); ctx.fillStyle = col && col !== INK ? col : M.pal[k % 3]; ctx.fill(); icon(ctx, it.icon || "file", -13, -5, 26, "#fff", 2.4); ctx.restore(); }
  function cloudTimes(s, f, idx){ return seq(s, f.files, .15, .2, idx, .75); }
  TT.layout("cloud", "Sinkron awan", (ctx, th, s, t) => {
    const f = s.f, M = mv(), F = (f.files || []).slice(0, 4); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = cloudTimes(s, f), tD = f.doneCue ? at(s, f.doneCue, .9) : null, { DX, BY, FLY } = CL, CX = CL.CX, CY = CL.CY + Math.sin(t * 1.3) * 6;
    const bar = f.bar || {}, b0 = bar.from != null ? bar.from : 0, b1 = bar.to != null ? bar.to : 100, bmax = bar.max || 100, good = F.filter(x => !x.fail && !x.hold);
    let v = b0, lastArr = -9; F.forEach((x, k) => { if (x.fail || x.hold) return; const ta = T[k] + FLY; v += (b1 - b0) * eOut(k01(t, ta - .1, .5)) / (good.length || 1); if (t >= ta) lastArr = Math.max(lastArr, ta); });
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // desk + device
    ctx.fillStyle = "#8E4E2E"; rr(ctx, DX - 200, BY + 18, 400, 22, 8); ctx.fill(); ctx.fillRect(DX - 180, BY + 40, 18, 1305 - BY - 40); ctx.fillRect(DX + 162, BY + 40, 18, 1305 - BY - 40);
    const sending = F.some((x, k) => t >= T[k] && t < T[k] + FLY);
    if (f.device === "phone"){ rr(ctx, DX - 72, BY - 230, 144, 248, 22); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.strokeStyle = dark(th) ? "#8C7B6B" : INK; ctx.lineWidth = 4; ctx.stroke(); rr(ctx, DX - 60, BY - 214, 120, 214, 12); ctx.fillStyle = "#CFE7EE"; ctx.fill(); }
    else { rr(ctx, DX - 150, BY - 180, 300, 180, 14); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.strokeStyle = dark(th) ? "#8C7B6B" : INK; ctx.lineWidth = 4; ctx.stroke(); rr(ctx, DX - 136, BY - 166, 272, 152, 8); ctx.fillStyle = "#CFE7EE"; ctx.fill();
      rr(ctx, DX - 176, BY, 352, 20, 8); ctx.fillStyle = "#544E42"; ctx.fill(); }
    const scy = f.device === "phone" ? BY - 107 : BY - 90;
    ctx.save(); ctx.globalAlpha *= sending ? .6 + .4 * Math.sin(t * 10) : .5; ctx.strokeStyle = TEAL; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(DX, scy + 34); ctx.lineTo(DX, scy - 30); ctx.moveTo(DX - 24, scy - 6); ctx.lineTo(DX, scy - 30); ctx.lineTo(DX + 24, scy - 6); ctx.stroke(); ctx.restore();
    if (f.deviceLabel) tag(ctx, th, f.deviceLabel, DX, BY + 85, { bg: PAPER, fg: INK, size: 24, maxW: 300, lines: 1, stroke: INK });
    // path
    const P0 = [DX, scy - 40], P1 = [DX - 60, 900], P2 = [CX, CY + 80], bz = q => [lerp(lerp(P0[0], P1[0], q), lerp(P1[0], P2[0], q), q), lerp(lerp(P0[1], P1[1], q), lerp(P1[1], P2[1], q), q)];
    ctx.save(); ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.35)" : hexA(INK, .25); ctx.lineWidth = 5; ctx.setLineDash([14, 14]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(...P0); ctx.quadraticCurveTo(...P1, ...P2); ctx.stroke(); ctx.restore();
    // cloud
    const pulse = lastArr > 0 ? 1 + .05 * (1 - k01(t, lastArr, .35)) : 1;
    ctx.save(); ctx.translate(CX, CY); ctx.scale(pulse, pulse); ctx.translate(-CX, -CY);
    ctx.save(); ctx.translate(6, 10); cloudPath(ctx, CX, CY); ctx.fillStyle = "rgba(0,0,0,.12)"; ctx.fill(); ctx.restore();
    cloudPath(ctx, CX, CY); ctx.strokeStyle = INK; ctx.lineWidth = 12; ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.fill();
    if (f.label) textC(ctx, th, f.label, CX, CY - 22, 32, 380, 1, INK, 800);
    const bx = CX - 160, bw = 230, byy = CY + 26, warn = !!bar.warn, fillC = warn ? (Math.sin(t * 8) > 0 ? RED : "#B5381A") : (dark(th) ? "#C2691F" : th.accent);
    rr(ctx, bx, byy, bw, 26, 13); ctx.fillStyle = "#EADBC8"; ctx.fill(); const fw = bw * clamp(v / bmax, 0, 1); if (fw > 2){ rr(ctx, bx, byy, Math.max(26, fw), 26, 13); ctx.fillStyle = fillC; ctx.fill(); }
    const vt = bar.unit ? `${fmtNum(v, bar.dec)} ${bar.unit}` : `${Math.round(v)}%`; font(ctx, 900, 28, th.fam); let z = 28; while (ctx.measureText(vt).width > 120 && z > 16){ z--; font(ctx, 900, z, th.fam); }
    ctx.fillStyle = warn ? RED : INK; ctx.fillText(vt, bx + bw + 12, byy + 23);
    ctx.restore();
    // flying files + chips
    F.forEach((x, k) => { const T0 = T[k], u = t - T0; if (u < 0) return;
      let q, col = null, show = true, badge = null;
      if (x.fail){ if (u < .55) q = eOut(u / .55) * .55; else { const d = k01(u, .55, .5); q = .55 * (1 - d * d); col = RED; badge = "x"; show = u < 1.5; } }
      else if (x.hold){ q = .5 * eOut(clamp(u / .5, 0, 1)); if (u >= .5){ col = AMBER; badge = "pause"; } }
      else { q = easeIO(clamp(u / FLY, 0, 1)); show = u < FLY; }
      if (show){ const [px, py] = bz(q), hov = x.hold && u > .5 ? Math.sin(t * 3) * 8 : 0, shk = x.fail && u > .55 && u < 1 ? Math.sin(u * 50) * 6 : 0;
        ctx.save(); ctx.translate(px + shk, py + hov); ctx.rotate(Math.sin(t * 4 + k) * .06); fileGlyph(ctx, x, M, k, 1 - q * .35, col || INK);
        if (badge === "x") crossDisc(ctx, 30, -40, 20); if (badge === "pause") pauseDisc(ctx, 30, -40, 20); ctx.restore(); }
      // status chip on the right
      const done = !x.fail && !x.hold && u >= FLY, ic = x.fail ? (u >= .55 ? glyph(crossDisc3, RED) : null) : x.hold ? (u >= .5 ? glyph(pauseDisc3, AMBER) : null) : (done ? glyph(checkDisc3, GREEN) : null);
      const chipIc = ic || ((ctx2, cx, cy, sz) => spinner(ctx2, cx, cy, sz, t, TEAL));
      tag(ctx, th, x.label || "", 650, 935 + k * 88, { align: "left", bg: x.fail && u >= .55 ? "#FCE4DA" : "#FFFFFF", fg: INK, size: 26, maxW: 340, lines: 1, icon: chipIc, stroke: done ? GREEN : (x.fail && u >= .55 ? RED : hexA(INK, .3)), k: popAt(t, T0, .35) });
      if (done) burst(ctx, CX, CY + 60, u - FLY, M, 6);
    });
    // actor
    const auto = [{ at: 0, pose: "type", expr: "neutral" }];
    F.forEach((x, k) => { if (x.fail) auto.push({ at: T[k] + .55, expr: "worried", emote: "!" }); else if (x.hold) auto.push({ at: T[k] + .5, pose: "stand", expr: "worried", emote: "sweat" }); else auto.push({ at: T[k], pose: "type", expr: "smile" }); });
    if (tD != null) auto.push({ at: tD, pose: "cheer", expr: "happy", emote: "sparkle" });
    const a = withKeys(ACT(f.actor, 150, 3), auto), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, 1305, a.scale || .78);
    if (tD != null){ const k = popAt(t, tD, .45); if (k > 0){ ctx.save(); ctx.translate(CX + 200, CY - 100); ctx.scale(k, k); checkDisc(ctx, 0, 0, 42); ctx.restore(); burst(ctx, CX + 200, CY - 100, t - tD, M, 9); }
      if (f.doneLabel) tag(ctx, th, f.doneLabel, CX, CY + 160, { bg: GREEN, fg: "#fff", size: 30, maxW: 420, k }); }
    extras(ctx, th, a, st, r, t);
    ctx.restore();
  }, (s, f, i, add) => { const T = cloudTimes(s, f, i); (f.files || []).slice(0, 4).forEach((x, k) => { add(T[k], "whoosh"); if (x.fail) add(T[k] + .55, "ping"); else if (x.hold) add(T[k] + .5, "ping"); else add(T[k] + CL.FLY, "pop"); });
    if (f.doneCue) add(at(s, f.doneCue, .9, i), "chime"); });
  function checkDisc3(ctx, x, y, s){ checkDisc(ctx, x, y, s * .48); }
  function crossDisc3(ctx, x, y, s){ crossDisc(ctx, x, y, s * .48); }
  function pauseDisc3(ctx, x, y, s){ pauseDisc(ctx, x, y, s * .48); }

  /* =====================================================================
     photo: tilted photo with sticky notes; fixCue -> crop marks snap, photo straightens, scan line, content swaps.
     ===================================================================== */
  const PH = { X: 540, Y: 880, W: 540, H: 380 };
  function photoContent(ctx, th, c, M, W, H, big){ if (!c) return;
    (c.items || []).slice(0, 4).forEach((l, k) => { const x = (k % 2 ? 1 : -1) * (W / 2 - 110), y = (k < 2 ? -1 : 1) * (H / 2 - 50); tag(ctx, th, l, x, y, { bg: hexA(INK, .08), fg: hexA(INK, .75), size: 20, maxW: 190, lines: 1, shadow: false, clampOff: true }); });
    const R = big ? 70 : 58; ctx.beginPath(); ctx.arc(0, -52, R, 0, TAU); ctx.fillStyle = c.bad ? RED : (c.color || M.pal[0]); ctx.fill(); icon(ctx, c.icon || "file", -R * .55, -52 - R * .55, R * 1.1, "#fff", 2.2);
    textC(ctx, th, c.label || "", 0, 72, big ? 44 : 38, W - 70, 2, INK, 800); }
  TT.layout("photo", "Bingkai foto", (ctx, th, s, t) => {
    const f = s.f, M = mv(), N = (f.notes || []).slice(0, 3); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const tF = f.fixCue ? at(s, f.fixCue, .6) : null, TN = seq(s, N, .25, .2, undefined, .4), { X, Y, W, H } = PH;
    const fq = tF != null ? k01(t, tF, .7) : 0, a0 = f.tilt != null ? f.tilt : -.16, rot = a0 * (1 - eBack(fq)) + Math.sin(t * 1.1) * .01 * (1 - fq);
    const swap = tF != null ? k01(t, tF + .55, .3) : 0, crop = !!f.crop;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    const ent = eBack(k01(t, .05, .5));
    // crop marks (screen-aligned frame the photo snaps into)
    const cw = crop ? W * .74 : W + 30, chh = crop ? H * .74 : H + 30;
    if (tF != null && t >= tF){ const q = eOut(k01(t, tF, .45)), ex = (1 - q) * 70; ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = dark(th) ? "#F4A85C" : th.accent; ctx.lineWidth = 12; ctx.lineCap = "round";
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { const cx = X + sx * (cw / 2 + ex), cy = Y + sy * (chh / 2 + ex); ctx.beginPath(); ctx.moveTo(cx, cy - sy * 56); ctx.lineTo(cx, cy); ctx.lineTo(cx - sx * 56, cy); ctx.stroke(); }); ctx.restore(); }
    // photo
    ctx.save(); ctx.translate(X, Y + (1 - ent) * 120); ctx.rotate(rot); ctx.scale(.6 + .4 * ent, .6 + .4 * ent);
    rr(ctx, -W / 2 + 8, -H / 2 + 14, W, H, 14); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fill();
    rr(ctx, -W / 2, -H / 2, W, H, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.save(); rr(ctx, -W / 2 + 18, -H / 2 + 18, W - 36, H - 36, 8); ctx.clip();
    const g = ctx.createLinearGradient(0, -H / 2, 0, H / 2); g.addColorStop(0, "#FCE9D2"); g.addColorStop(1, "#F6D9BC"); ctx.fillStyle = g; ctx.fillRect(-W / 2, -H / 2, W, H);
    if (swap < 1){ ctx.save(); ctx.globalAlpha *= 1 - swap; if (tF == null || fq < 1){ ctx.save(); ctx.globalAlpha *= .3 * (1 - fq); ctx.translate(9, 5); photoContent(ctx, th, f.before, M, W, H); ctx.restore(); }
      photoContent(ctx, th, f.before, M, W, H); ctx.restore(); }
    if (swap > 0){ ctx.save(); ctx.globalAlpha *= swap; ctx.scale(.9 + .1 * swap, .9 + .1 * swap); photoContent(ctx, th, f.after, M, crop ? W * .72 : W, crop ? H * .8 : H, true); ctx.restore(); }
    if (crop && tF != null){ const q = eOut(k01(t, tF + .2, .4)); ctx.fillStyle = `rgba(30,20,12,${.5 * q})`; ctx.beginPath(); ctx.rect(-W / 2, -H / 2, W, H); ctx.rect(-cw / 2, -chh / 2, cw, chh); ctx.fill("evenodd"); }
    // scan line
    if (tF != null && t > tF + .2 && t < tF + 1){ const q = k01(t, tF + .2, .8), y = -H / 2 + q * H; const gl = ctx.createLinearGradient(0, y - 40, 0, y); gl.addColorStop(0, "rgba(244,168,92,0)"); gl.addColorStop(1, "rgba(244,168,92,.55)"); ctx.fillStyle = gl; ctx.fillRect(-W / 2, y - 40, W, 40); ctx.fillStyle = "#E08A3C"; ctx.fillRect(-W / 2, y - 3, W, 6); }
    ctx.restore();
    // tape on the photo
    ctx.fillStyle = "rgba(244,168,92,.75)"; ctx.save(); ctx.rotate(-.2); ctx.fillRect(-60, -H / 2 - 18, 120, 34); ctx.restore();
    ctx.restore();
    // sticky notes
    const NP = [[245, 660, -.08], [835, 660, .07], [245, 1110, .05]];
    N.forEach((nt, k) => { const T0 = TN[k], kk = popAt(t, T0, .4); if (!kk) return; const away = tF != null ? eOut(k01(t, tF, .5)) : 0; if (away >= 1) return; const [nx, ny, nr] = NP[k];
      const res = tag(ctx, th, nt.label || "", nx + (nx < 540 ? -1 : 1) * away * 160, ny - away * 60, { bg: nt.good ? "#D6F0DF" : "#FFE8A3", fg: INK, size: 30, maxW: 290, lines: 2, rot: nr + away * .5, k: kk, alpha: 1 - away, icon: nt.icon });
      if (away <= 0) { ctx.save(); ctx.translate(res.cx, ny - res.h / 2 + 2); ctx.rotate(nr); ctx.fillStyle = "rgba(194,105,31,.55)"; ctx.fillRect(-30, -10, 60, 18); ctx.restore(); } });
    // stamp + label
    if (tF != null){ const k = popAt(t, tF + 1, .4); if (k > 0){ ctx.save(); ctx.translate(X + cw / 2 - 6, Y - chh / 2 + 6); ctx.scale(k, k); checkDisc(ctx, 0, 0, 38); ctx.restore(); burst(ctx, X + cw / 2 - 6, Y - chh / 2 + 6, t - tF - 1, M, 9); }
      if (f.fixLabel) tag(ctx, th, f.fixLabel, 470, Y + H / 2 + 95, { bg: GREEN, fg: "#fff", size: 30, maxW: 560, k: popAt(t, tF + 1.1, .4) }); }
    // actor
    const auto = [{ at: 0, pose: "think", expr: "confused" }];
    N.forEach((nt, k) => auto.push({ at: TN[k], expr: nt.good ? "smile" : "worried", emote: k === 0 && !nt.good ? "sweat" : null }));
    if (tF != null) auto.push({ at: tF + .6, pose: "thumbs", expr: "happy", emote: "check" });
    const a = withKeys(ACT(f.actor, 885, 2), auto), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, 1310, a.scale || .7);
    extras(ctx, th, a, st, r, t);
    ctx.restore();
  }, (s, f, i, add) => { seq(s, f.notes, .25, .2, i, .4).forEach(T => add(T, "pop")); if (f.fixCue){ const T = at(s, f.fixCue, .6, i); add(T, "whoosh"); add(T + 1, "chime"); } });

  /* =====================================================================
     barcode: checkout counter; items slide to the scanner, beep, drop in the bag (skip = rejected); receipt prints.
     ===================================================================== */
  const BC = { SX: 470, CT: 1045, BAG: 595, START: 170, PX0: 640, PW: 350, PY: 625, LH: 50 };
  function bcTimes(s, f, idx){ return seq(s, f.items, .25, .2, idx, .95); }
  function product(ctx, th, it, M, k, bad){ const W = 176, Hh = 136; rr(ctx, -W / 2 + 4, -Hh + 6, W, Hh, 16); ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.fill();
    rr(ctx, -W / 2, -Hh, W, Hh, 16); ctx.fillStyle = bad ? "#FCE4DA" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = bad ? RED : INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.arc(-W / 2 + 36, -Hh + 36, 24, 0, TAU); ctx.fillStyle = bad ? RED : M.pal[k % 3]; ctx.fill(); icon(ctx, it.icon || "cart", -W / 2 + 21, -Hh + 21, 30, "#fff", 2.4);
    ctx.fillStyle = INK; for (let b = 0; b < 9; b++) ctx.fillRect(W / 2 - 70 + b * 6.5, -Hh + 18, b % 3 ? 2.5 : 4, 34);
    textC(ctx, th, it.label || "", 0, -42, 24, W - 22, 2, INK, 800); }
  TT.layout("barcode", "Kasir barcode", (ctx, th, s, t) => {
    const f = s.f, M = mv(), I = (f.items || []).slice(0, 4); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = bcTimes(s, f), { SX, CT, BAG, START, PX0, PW, PY, LH } = BC, last = I.length ? T[I.length - 1] : .5, tTot = f.totalCue ? at(s, f.totalCue, .9) : last + 1;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // receipt printer + paper
    const lines = I.map((it, k) => ({ it, k, T: T[k] })).filter(x => t >= x.T), showTot = f.total && t >= tTot;
    const hT = 60 + lines.length * LH + (showTot ? 70 : 0), hp = hT;
    ctx.fillStyle = dark(th) ? "#8C7B6B" : "#544E42"; ctx.fillRect(PX0 + PW / 2 - 8, PY - 70, 16, 40);
    const paperH = hp + Math.sin(t * 2) * 2; ctx.save(); ctx.translate(PX0 + PW / 2, PY + 20); ctx.rotate(Math.sin(t * 1.3) * .012); ctx.translate(-(PX0 + PW / 2), -(PY + 20));
    ctx.beginPath(); ctx.moveTo(PX0 + 12, PY + 20); ctx.lineTo(PX0 + PW - 12, PY + 20); ctx.lineTo(PX0 + PW - 12, PY + 20 + paperH);
    for (let x = PX0 + PW - 12; x > PX0 + 12; x -= 20){ ctx.lineTo(x - 10, PY + 20 + paperH + 10); ctx.lineTo(x - 20, PY + 20 + paperH); } ctx.closePath();
    ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .5); ctx.lineWidth = 3; ctx.stroke();
    lines.forEach(({ it, k, T: T0 }, j) => { const y = PY + 74 + j * LH, q = k01(t, T0, .3); ctx.save(); ctx.globalAlpha *= q;
      const val = it.price || "", vw = val ? (font(ctx, 800, 27, th.fam), Math.min(115, ctx.measureText(val).width)) : 34;
      const r2 = fit(ctx, th, it.label || "", 27, PW - 44 - vw - 12, 1, 700, 15); ctx.fillStyle = it.skip ? RED : INK; ctx.fillText(r2.lines[0], PX0 + 22, y + 9);
      if (it.skip){ const lw = ctx.measureText(r2.lines[0]).width; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(PX0 + 24, y); ctx.lineTo(PX0 + 32 + lw, y); ctx.stroke(); }
      if (val){ let z = 27; font(ctx, 800, z, th.fam); while (ctx.measureText(val).width > 115 && z > 15){ z--; font(ctx, 800, z, th.fam); } ctx.fillStyle = it.skip ? RED : INK; ctx.textAlign = "right"; ctx.fillText(val, PX0 + PW - 22, y + 9); ctx.textAlign = "left"; }
      else if (it.skip) crossDisc(ctx, PX0 + PW - 44, y, 15); else checkDisc(ctx, PX0 + PW - 44, y, 15);
      ctx.restore(); });
    if (showTot){ const y = PY + 74 + lines.length * LH + 16, q = popAt(t, tTot, .4); ctx.save(); ctx.strokeStyle = hexA(INK, .4); ctx.lineWidth = 3; ctx.setLineDash([8, 7]); ctx.beginPath(); ctx.moveTo(PX0 + 26, y - 18); ctx.lineTo(PX0 + PW - 26, y - 18); ctx.stroke(); ctx.setLineDash([]);
      const sum = I.filter(x => !x.skip).reduce((a, x) => a + (+x.value || 0), 0), tv = f.total.value != null ? f.total.value : `${f.total.prefix || ""}${fmtNum(sum)}${f.total.suffix || ""}`;
      let z = 32; font(ctx, 900, z, th.fam); while (ctx.measureText(tv).width > 150 && z > 16){ z--; font(ctx, 900, z, th.fam); } const tvw = ctx.measureText(tv).width;
      ctx.translate(PX0 + PW - 28, y + 20); ctx.scale(q, q); ctx.fillStyle = f.total.bad ? RED : (dark(th) ? "#C2691F" : th.accent); ctx.textAlign = "right"; ctx.fillText(tv, 0, 0); ctx.textAlign = "left"; ctx.restore();
      const r3 = fit(ctx, th, f.total.label || "Total", 28, PW - 70 - tvw, 1, 900, 15); ctx.fillStyle = INK; ctx.fillText(r3.lines[0], PX0 + 28, y + 20); }
    ctx.restore();
    rr(ctx, PX0 - 10, PY - 40, PW + 20, 64, 16); ctx.fillStyle = dark(th) ? "#6B5A48" : "#544E42"; ctx.fill(); rr(ctx, PX0 + 14, PY + 8, PW - 28, 10, 5); ctx.fillStyle = "#18150f"; ctx.fill();
    if (f.label) textC(ctx, th, f.label, PX0 + PW / 2, PY - 10, 28, PW - 40, 1, PAPER, 800);
    // shop shelves behind the cashier
    [700, 860].forEach((sy, j) => { ctx.fillStyle = "#8E4E2E"; rr(ctx, 110, sy, 450, 16, 6); ctx.fill();
      for (let k = 0; k < 6; k++){ if ((k + j) % 3 === 2) continue; const bw = 50 + (k * 13 % 20), bh = 60 + (k * 29 % 40); rr(ctx, 130 + k * 72, sy - bh, bw, bh, 8); ctx.fillStyle = [M.pal[0], "#F3DCC2", TEAL, M.pal[2]][(k + j) % 4]; ctx.fill(); ctx.strokeStyle = hexA(INK, .5); ctx.lineWidth = 3; ctx.stroke(); } });
    // cashier (behind the counter)
    const auto = [{ at: 0, pose: "stand", expr: "smile" }];
    I.forEach((it, k) => auto.push({ at: T[k] - .5, pose: "work", expr: it.skip ? "neutral" : "smile" }, it.skip ? { at: T[k], shake: true, expr: "worried" } : { at: T[k] + .1, nod: true }));
    auto.push({ at: tTot, pose: f.endPose || "thumbs", expr: f.endExpr || "happy", emote: f.endEmote || null });
    const a = withKeys(ACT(f.actor, 300, 0), auto), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, 1215, a.scale || .96);
    // counter
    rr(ctx, 90, CT, 900, 1300 - CT, 18); ctx.fillStyle = "#B5643C"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.14)"; for (let x = 140; x < 960; x += 120) ctx.fillRect(x, CT + 40, 60, 1300 - CT - 80);
    rr(ctx, 80, CT - 12, 920, 28, 12); ctx.fillStyle = "#E9C9A8"; ctx.fill(); ctx.stroke();
    const boff = (t * 120) % 40; ctx.save(); rr(ctx, 90, CT - 8, 340, 12, 6); ctx.clip(); ctx.fillStyle = "rgba(59,36,24,.35)"; for (let x = 70 + boff; x < 440; x += 40) ctx.fillRect(x, CT - 8, 18, 12); ctx.restore();
    rr(ctx, SX - 70, CT - 10, 140, 14, 6); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.fillStyle = hexA(RED, .7 + .3 * Math.sin(t * 6)); ctx.fillRect(SX - 56, CT - 5, 112, 4);
    // bag (back)
    ctx.fillStyle = "#C98B5E"; rr(ctx, BAG - 85, CT - 155, 170, 147, 12); ctx.fill();
    // items
    let beep = null;
    I.forEach((it, k) => { const T0 = T[k], ta = Math.max(.05, T0 - .6); if (t < ta) return; let x, sc = 1, y = CT - 12, al = 1, rot = 0;
      if (t < T0) x = lerp(START, SX, eOut(k01(t, ta, T0 - ta)));
      else if (it.skip){ const q = k01(t, T0 + .35, .6); x = lerp(SX, START - 40, easeIO(q)) + (t - T0 < .35 ? Math.sin((t - T0) * 50) * 6 : 0); al = 1 - q * .9; if (q >= 1) return; }
      else { const q = k01(t, T0 + .25, .6); if (q >= 1) return; x = lerp(SX, BAG, easeIO(q)); y = CT - 12 - Math.sin(q * Math.PI) * 60 + q * q * 60; sc = 1 - q * .55; }
      if (t >= T0 && t - T0 < .4) beep = { ok: !it.skip, u: t - T0 };
      ctx.save(); ctx.globalAlpha *= al * clamp((t - ta) * 5, 0, 1); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc * 1.25, sc * 1.25); product(ctx, th, it, M, k, it.skip && t >= T0); if (t >= T0) { if (it.skip) crossDisc(ctx, 80, -130, 22); else checkDisc(ctx, 80, -130, 22); } ctx.restore(); });
    // bag (front)
    rr(ctx, BAG - 92, CT - 110, 184, 102, 12); ctx.fillStyle = "#D9A066"; ctx.fill(); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(BAG, CT - 110, 30, Math.PI, TAU); ctx.stroke();
    const nBag = I.filter((it, k) => !it.skip && t >= T[k] + .85).length; if (nBag){ font(ctx, 900, 34, th.fam); ctx.fillStyle = "#5A2A1E"; ctx.textAlign = "center"; ctx.fillText(String(nBag), BAG, CT - 46); ctx.textAlign = "left"; }
    // laser + beep text
    if (beep){ const c = beep.ok ? RED : RED, al = 1 - beep.u / .4; ctx.save(); ctx.globalAlpha *= al; const g = ctx.createLinearGradient(0, CT, 0, CT - 200); g.addColorStop(0, hexA(c, .55)); g.addColorStop(1, hexA(c, 0)); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(SX - 40, CT - 6); ctx.lineTo(SX + 40, CT - 6); ctx.lineTo(SX + 110, CT - 200); ctx.lineTo(SX - 110, CT - 200); ctx.closePath(); ctx.fill(); ctx.restore();
      tag(ctx, th, beep.ok ? (f.beep || "bip!") : (f.beepBad || "tolak"), SX, CT - 255 - beep.u * 60, { bg: beep.ok ? GREEN : RED, fg: "#fff", size: 30, maxW: 220, lines: 1, k: popAt(t, t - beep.u, .2), alpha: 1 - beep.u / .4 * .5 }); }
    extras(ctx, th, a, st, r, t);
    ctx.restore();
  }, (s, f, i, add) => { const T = bcTimes(s, f, i); (f.items || []).slice(0, 4).forEach((it, k) => add(T[k], it.skip ? "whoosh" : "ping"));
    if (f.total){ const last = T.length ? T[Math.min(3, T.length - 1)] : .5; add(f.totalCue ? at(s, f.totalCue, .9, i) : last + 1, f.total.bad ? "pop" : "chime"); } });

  /* =====================================================================
     keycard: guests walk up to a door, tap a card; edit/in -> door opens and they walk in,
     view -> small window opens (they stay outside), deny -> red, door rattles, they leave.
     ===================================================================== */
  const KC = { DX0: 610, DX1: 870, DY0: 770, DY1: 1300, RX: 545, RY: 1060, SPOT: 410 };
  const ACC = { edit: [GREEN, "Boleh edit", glyph(penIco, "#fff")], in: [GREEN, "Silakan masuk", glyph(checkDisc2, "#fff")], view: [AMBER, "Lihat saja", glyph(eyeIco, "#fff")], deny: [RED, "Ditolak", glyph(crossX, "#fff")] };
  function crossX(ctx, x, y, s, col){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * .16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - s * .3, y - s * .3); ctx.lineTo(x + s * .3, y + s * .3); ctx.moveTo(x + s * .3, y - s * .3); ctx.lineTo(x - s * .3, y + s * .3); ctx.stroke(); ctx.restore(); }
  function kcTimes(s, f, idx){ return seq(s, f.guests, .3, .25, idx, 2.1); }
  TT.layout("keycard", "Pintu akses", (ctx, th, s, t) => {
    const f = s.f, M = mv(), Gs = (f.guests || []).slice(0, 3); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = kcTimes(s, f), { DX0, DX1, DY0, DY1, RX, RY, SPOT } = KC, DW = DX1 - DX0;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // door / window states
    let dO = 0, vO = 0, cur = null, curT = -9;
    Gs.forEach((g, k) => { const T0 = T[k], acc = g.access || "view";
      if (t >= T0 - .1 && t < T0 + 2) { cur = acc; curT = T0; }
      const nd = Gs.findIndex((g2, j) => j > k && (g2.access || "view") === "deny"), cT = nd >= 0 ? T[nd] - .6 : 1e9;
      if (acc === "edit" || acc === "in") dO = Math.max(dO, eOut(k01(t, T0 + .15, .45)) * (1 - eOut(k01(t, cT, .45))));
      if (acc === "view") vO = Math.max(vO, eOut(k01(t, T0 + .15, .4)) * (1 - eOut(k01(t, T0 + 1.9, .4)))); });
    const shake = cur === "deny" && t - curT < .8 ? Math.sin((t - curT) * 50) * 5 * (1 - (t - curT) / .8) : 0;
    // wall + floor
    ctx.fillStyle = dark(th) ? "rgba(250,248,243,.10)" : hexA(INK, .1); rr(ctx, 90, DY1, 900, 10, 5); ctx.fill();
    // door frame + interior
    rr(ctx, DX0 - 18, DY0 - 18, DW + 36, DY1 - DY0 + 18, 12); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(DX0, DY0, DW, DY1 - DY0); ctx.clip();
    const ig = ctx.createLinearGradient(0, DY0, 0, DY1); ig.addColorStop(0, "#FFE3B8"); ig.addColorStop(1, "#F4A85C"); ctx.fillStyle = ig; ctx.fillRect(DX0, DY0, DW, DY1 - DY0);
    ctx.beginPath(); ctx.arc(DX0 + DW / 2, DY0 + 180, 64, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); icon(ctx, f.icon || "file", DX0 + DW / 2 - 36, DY0 + 144, 72, dark(th) ? "#C2691F" : th.accent, 2.4);
    ctx.fillStyle = "#B5643C"; ctx.fillRect(DX0 + 20, DY0 + 300, DW - 40, 18);
    let nin = 0; Gs.forEach((g, k) => { const acc = g.access || "view"; if ((acc !== "edit" && acc !== "in") || t < T[k] + 1.1) return;
      const a2 = ACT(g.actor, DX0 + 70 + (nin++ % 3) * 62, k + 1), st2 = actorState(Object.assign({}, a2, { keys: [{ at: 0, pose: "stand", expr: "happy" }] }), s, t);
      ctx.save(); ctx.globalAlpha *= clamp((t - T[k] - 1.1) / .4, 0, 1); drawActor(ctx, th, a2, st2, t, DY1 - 6, .5); ctx.restore(); });
    // door leaf (hinged on the right)
    const lw = DW * (1 - .84 * dO), lx = DX1 - lw + shake;
    rr(ctx, lx, DY0, lw, DY1 - DY0, 6); ctx.fillStyle = dO > .02 ? "#D9B48F" : "#E9C9A8"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    if (lw > 120){ ctx.strokeStyle = hexA(INK, .18); ctx.lineWidth = 4; rr(ctx, lx + 26, DY0 + 210, lw - 52, 150, 10); ctx.stroke(); rr(ctx, lx + 26, DY0 + 380, lw - 52, 130, 10); ctx.stroke();
      ctx.beginPath(); ctx.arc(lx + 30, DY0 + 300, 13, 0, TAU); ctx.fillStyle = INK; ctx.fill();
      // view window
      const wx = lx + lw / 2 - 66, wy = DY0 + 40, ww = 132, wh = 120; rr(ctx, wx, wy, ww, wh, 12); ctx.fillStyle = "#2B2118"; ctx.fill();
      if (vO > 0){ ctx.save(); rr(ctx, wx, wy, ww, wh, 12); ctx.clip(); ctx.fillStyle = "#FFE3B8"; ctx.fillRect(wx, wy, ww, wh); icon(ctx, f.icon || "file", wx + ww / 2 - 30, wy + wh / 2 - 30, 60, "#C2691F", 2.4);
        ctx.fillStyle = "#544E42"; ctx.fillRect(wx, wy, ww, wh * (1 - vO)); ctx.restore(); }
      else { ctx.fillStyle = "#544E42"; rr(ctx, wx + 6, wy + 6, ww - 12, wh - 12, 8); ctx.fill(); }
      ctx.strokeStyle = INK; ctx.lineWidth = 4; rr(ctx, wx, wy, ww, wh, 12); ctx.stroke(); }
    ctx.restore();
    // sign
    if (f.label) tag(ctx, th, f.label, DX0 + DW / 2, DY0 - 62, { bg: INK, fg: PAPER, size: 28, maxW: 380, lines: 1, stroke: dark(th) ? "#8C7B6B" : null });
    // reader
    const rc = cur && t >= curT ? ACC[cur][0] : "#8C7B6B";
    rr(ctx, RX - 30, RY - 60, 60, 110, 12); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.strokeStyle = dark(th) ? "#8C7B6B" : INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(RX, RY - 32, 11, 0, TAU); ctx.fillStyle = cur && t >= curT ? (Math.sin(t * 14) > -.3 ? rc : "#2B2118") : (Math.sin(t * 2) > 0 ? "#8C7B6B" : "#544E42"); ctx.fill();
    ctx.strokeStyle = "#8C7B6B"; ctx.lineWidth = 3; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(RX, RY + 22, 8 + k * 8, -2.3, -.85); ctx.stroke(); }
    // guests
    const heads = []; let vk = 0;
    Gs.forEach((g, k) => { const T0 = T[k], acc = g.access || "view";
      const keys = [{ at: T0 - 1.1, show: true, x: SPOT, speed: 560, pose: "stand", expr: g.expr || "neutral" }, { at: T0 - .2, pose: "point" }];
      if (acc === "edit" || acc === "in") keys.push({ at: T0 + .15, pose: "stand", expr: "happy", emote: g.emote || "check" }, { at: T0 + .65, x: DX0 + DW / 2 + 10, speed: 420 }, { at: T0 + 1.3, show: false });
      else if (acc === "view") keys.push({ at: T0 + .15, pose: "stand", expr: "smile" }, { at: T0 + 1.5, x: 180 + vk++ * 120, speed: 420 });
      else keys.push({ at: T0 + .1, pose: "stand", expr: "worried", shake: true, emote: "!" }, { at: T0 + 1.2, x: -170, speed: 520 });
      const a = Object.assign(ACT(g.actor, -150, k + 1), { show: false, keys: g.keys || keys }), st = actorState(a, s, t);
      const r = drawActor(ctx, th, a, st, t, DY1, a.scale || .74);
      // card in hand
      if (t > T0 - .35 && t < T0 + .5 && st.show){ ctx.save(); ctx.translate(st.x + 100, DY1 - 226); ctx.rotate(-.15); rr(ctx, -22, -15, 44, 30, 5); ctx.fillStyle = ACC[acc][0]; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
      if (r && st.show) heads.push([a, st, r, g, acc, T0]); });
    heads.forEach(([a, st, r, g, acc, T0]) => { if (g.label && st.x > 90 && st.x < 990){ const out = !st.show ? 1 - clamp((t - st.showT) / .4, 0, 1) : 1;
        tag(ctx, th, g.label, st.x, r.headTop - 34, { bg: PAPER, fg: INK, size: 24, maxW: 230, lines: 1, stroke: INK, alpha: out, icon: acc === "view" && t > T0 + .2 ? glyph(eyeIco, AMBER) : null }); }
      extras(ctx, th, a, st, r, t); });
    // roster of decisions so far
    Gs.forEach((g, k) => { const acc = g.access || "view", T0 = T[k]; if (t < T0 + .3 || !g.label) return; const [c, , ic] = ACC[acc];
      tag(ctx, th, g.label, 100, 650 + k * 66, { align: "left", bg: PAPER, fg: INK, size: 26, maxW: 400, lines: 1, stroke: c, lw: 4, icon: (cx2, x, y, sz) => { cx2.beginPath(); cx2.arc(x, y, sz * .55, 0, TAU); cx2.fillStyle = c; cx2.fill(); ic(cx2, x, y, sz * .75); }, k: popAt(t, T0 + .3, .4) }); });
    // status pill on the door
    if (cur && t >= curT + .1){ const [c, lbl, ic] = ACC[cur], g = Gs[T.indexOf(curT)] || {}, k = popAt(t, curT + .1, .35) * (1 - k01(t, curT + 1.85, .2));
      tag(ctx, th, g.status || lbl, DX0 + DW / 2, DY0 + 440, { bg: c, fg: "#fff", size: 30, maxW: 330, lines: 1, icon: ic, k });
      if (cur !== "deny") burst(ctx, RX, RY - 32, t - curT, M, 6); }
    ctx.restore();
  }, (s, f, i, add) => { const T = kcTimes(s, f, i); (f.guests || []).slice(0, 3).forEach((g, k) => { const acc = g.access || "view"; add(T[k], acc === "deny" ? "pop" : acc === "view" ? "ping" : "chime"); if (acc === "edit" || acc === "in") add(T[k] + .2, "whoosh"); }); });

  /* =====================================================================
     blinds: closed blinds, dim room; levels raise them; light floods in; items appear in the view.
     ===================================================================== */
  const BL = { X0: 300, X1: 960, Y0: 620, Y1: 1070 };
  function blLevels(s, f, idx){ const L = f.levels || (f.openCue ? [{ cue: f.openCue, open: f.open != null ? f.open : 1 }] : []); return L.map((l, k) => ({ T: at(s, l.cue, .3 + k * .3, idx), open: l.open != null ? l.open : 1 })).sort((a, b) => a.T - b.T); }
  TT.layout("blinds", "Tirai jendela", (ctx, th, s, t) => {
    const f = s.f, M = mv(), I = (f.items || []).slice(0, 3); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const LV = blLevels(s, f), { X0, X1, Y0, Y1 } = BL, WW = X1 - X0, WH = Y1 - Y0;
    let L = 0; LV.forEach(l => { const q = easeIO(k01(t, l.T, 1.1)); L = L + (l.open - L) * q; });
    const tOpen = LV.length ? LV[0].T : 0, full = LV.length ? LV[LV.length - 1] : null;
    const IT = seq(s, I, .4, .18, undefined, .3).map(x => Math.max(x, LV.length ? tOpen + .5 : 0));
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // window frame + view
    rr(ctx, X0 - 22, Y0 - 22, WW + 44, WH + 44, 16); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(X0, Y0, WW, WH); ctx.clip();
    const sg = ctx.createLinearGradient(0, Y0, 0, Y1); sg.addColorStop(0, "#9FD3E0"); sg.addColorStop(1, "#FCE9D2"); ctx.fillStyle = sg; ctx.fillRect(X0, Y0, WW, WH);
    const sx = X1 - 110, sy = Y0 + 90; ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * .3); ctx.fillStyle = "rgba(244,168,92,.45)"; for (let k = 0; k < 10; k++){ ctx.rotate(TAU / 10); ctx.fillRect(-5, 52, 10, 30 + 14 * L); } ctx.restore();
    ctx.beginPath(); ctx.arc(sx, sy, 44, 0, TAU); ctx.fillStyle = "#F4A85C"; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.9)"; [[0, 0], [1, 1]].forEach(([k]) => { const cx = X0 + 120 + ((t * 18 + k * 300) % (WW + 200)) - 100, cy = Y0 + 70 + k * 60; ctx.beginPath(); ctx.ellipse(cx, cy, 60, 20, 0, 0, TAU); ctx.ellipse(cx + 30, cy - 14, 34, 22, 0, 0, TAU); ctx.fill(); });
    ctx.fillStyle = "#A9CFA0"; ctx.beginPath(); ctx.moveTo(X0, Y1); ctx.quadraticCurveTo(X0 + 200, Y1 - 150, X0 + 400, Y1 - 70); ctx.quadraticCurveTo(X0 + 560, Y1 - 150, X1, Y1 - 90); ctx.lineTo(X1, Y1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#E9C9A8"; [[X0 + 70, 110], [X0 + 130, 160], [X0 + 470, 130]].forEach(([bx, bh]) => ctx.fillRect(bx, Y1 - bh, 50, bh));
    // items in the view
    I.forEach((it, k) => { const kk = popAt(t, IT[k], .45); if (!kk) return; const x = X0 + WW / 2 + (k - (I.length - 1) / 2) * 212, y = Y1 - 125;
      ctx.save(); ctx.translate(x, y - 58); ctx.scale(kk, kk); ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = M.pal[k % 3]; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.stroke(); icon(ctx, it.icon || "sparkles", -20, -20, 40, "#fff", 2.4); ctx.restore();
      tag(ctx, th, it.label || "", x, y + 22, { bg: PAPER, fg: INK, size: 26, maxW: 205, lines: 2, stroke: INK, k: kk }); burst(ctx, x, y - 58, t - IT[k], M, 6); });
    if (f.after && full){ const k = popAt(t, full.T + 1, .45); if (k) tag(ctx, th, f.after, X0 + WW / 2 - 60, Y0 + 80, { bg: dark(th) ? "#C2691F" : th.accent, fg: "#fff", size: 34, maxW: 440, lines: 1, k }); }
    // blinds
    const yb = Y0 + WH * (1 - L) + 26 * L, stackH = 10 + 34 * L;
    ctx.fillStyle = "#E9D3BC"; ctx.fillRect(X0, Y0, WW, stackH); ctx.strokeStyle = hexA(INK, .3); ctx.lineWidth = 2; for (let y = Y0 + 6; y < Y0 + stackH; y += 6){ ctx.beginPath(); ctx.moveTo(X0, y); ctx.lineTo(X1, y); ctx.stroke(); }
    for (let y = Y0 + stackH; y < yb - 4; y += 32){ const h = Math.min(30, yb - y); rr(ctx, X0 + 4, y, WW - 8, h, 6); ctx.fillStyle = "#F3E3CF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .22); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(X0 + 10, y + 4, WW - 20, 4); }
    rr(ctx, X0 - 4, yb - 10, WW + 8, 20, 8); ctx.fillStyle = "#C98B5E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    if (f.before){ const al = clamp(1 - L * 2.5, 0, 1); if (al > 0) tag(ctx, th, f.before, X0 + WW / 2, Y0 + WH / 2, { bg: INK, fg: PAPER, size: 34, maxW: 520, lines: 2, alpha: al, k: popAt(t, .2, .45) }); }
    ctx.restore();
    // sill
    rr(ctx, X0 - 40, Y1 + 18, WW + 80, 26, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    // pull cord
    const pulling = LV.some(l => t >= l.T - .1 && t < l.T + 1.1), pull = pulling ? Math.sin(clamp((t - LV.find(l => t >= l.T - .1 && t < l.T + 1.1).T) / 1.1, 0, 1) * Math.PI) * 60 : 0;
    const kx = 288, ky = 1075 + pull; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0 + 14, Y0 + 6); ctx.lineTo(kx, ky - 18); ctx.stroke();
    rr(ctx, kx - 9, ky - 20, 18, 40, 9); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.stroke();
    // light beam on the floor
    if (L > .02){ ctx.save(); ctx.globalAlpha *= L; const bg = ctx.createLinearGradient(0, Y1, 0, 1330); bg.addColorStop(0, "rgba(255,214,150,.45)"); bg.addColorStop(1, "rgba(255,214,150,0)"); ctx.fillStyle = bg;
      ctx.beginPath(); ctx.moveTo(X0 + 20, Y1 + 44); ctx.lineTo(X1 - 20, Y1 + 44); ctx.lineTo(990, 1330); ctx.lineTo(X0 + 140, 1330); ctx.closePath(); ctx.fill(); ctx.restore(); }
    // actor
    const auto = [{ at: 0, pose: "stand", expr: (f.actor && f.actor.expr) || "tired" }];
    LV.forEach((l, k) => { auto.push({ at: l.T - .15, pose: "point", expr: "neutral" }); if (k === LV.length - 1) auto.push({ at: l.T + 1.2, pose: f.endPose || "cheer", expr: "happy", emote: "sparkle" }); else auto.push({ at: l.T + 1.15, pose: "stand", expr: "smile" }); });
    const a = withKeys(ACT(f.actor, 175, 1), auto), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, 1310, a.scale || .82);
    // dim room while closed
    const dim = (1 - L) * .3; if (dim > .01){ ctx.fillStyle = `rgba(30,20,12,${dim})`; rr(ctx, 90, 585, 900, 755, 40); ctx.fill(); }
    extras(ctx, th, a, st, r, t);
    ctx.restore();
  }, (s, f, i, add) => { const LV = blLevels(s, f, i); LV.forEach(l => add(l.T, "whoosh")); const t0 = LV.length ? LV[0].T + .5 : 0;
    seq(s, f.items, .4, .18, i, .3).forEach(T => add(Math.max(T, t0), "pop")); if (f.after && LV.length) add(LV[LV.length - 1].T + 1, "chime"); });

  /* =====================================================================
     remote: seated actor points a remote at a TV; channels switch with static on cue; offCue turns it off.
     ===================================================================== */
  const RM = { X0: 200, Y0: 590, W: 680, H: 400 };
  function rmTimes(s, f, idx){ return seq(s, f.channels, .12, .2, idx, .6); }
  function noise(ctx, x, y, w, h, t, a){ const fr = Math.floor(t * 30); let r = (fr * 9301 + 49297) % 233280; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#544E42"; ctx.fillRect(x, y, w, h); for (let k = 0; k < 140; k++){ const c = Math.floor(120 + rnd() * 135); ctx.fillStyle = `rgb(${c},${c},${c})`; ctx.fillRect(x + rnd() * w, y + rnd() * h, 6 + rnd() * 40, 3 + rnd() * 5); }
    ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.fillRect(x, y + ((t * 400) % h), w, 18); ctx.restore(); }
  TT.layout("remote", "Remote TV", (ctx, th, s, t) => {
    const f = s.f, M = mv(), C = (f.channels || []).slice(0, 5); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = rmTimes(s, f), tOff = f.offCue ? at(s, f.offCue, .9) : null, { X0, Y0, W, H } = RM, SX = X0 + 26, SY = Y0 + 26, SW = W - 52, SH = H - 52;
    let cur = -1; T.forEach((x, k) => { if (t >= x) cur = k; }); const sw = cur >= 0 ? t - T[cur] : 9, offQ = tOff != null ? k01(t, tOff, .5) : 0;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // TV
    ctx.fillStyle = dark(th) ? "#8C7B6B" : "#3B2418"; ctx.beginPath(); ctx.moveTo(X0 + W / 2 - 40, Y0 + H); ctx.lineTo(X0 + W / 2 + 40, Y0 + H); ctx.lineTo(X0 + W / 2 + 70, Y0 + H + 40); ctx.lineTo(X0 + W / 2 - 70, Y0 + H + 40); ctx.closePath(); ctx.fill(); rr(ctx, X0 + W / 2 - 120, Y0 + H + 36, 240, 14, 7); ctx.fill();
    rr(ctx, X0 + 6, Y0 + 12, W, H, 30); ctx.fillStyle = "rgba(0,0,0,.16)"; ctx.fill();
    rr(ctx, X0, Y0, W, H, 30); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.strokeStyle = dark(th) ? "#8C7B6B" : INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.arc(X0 + W - 22, Y0 + H - 14, 5, 0, TAU); ctx.fillStyle = offQ >= 1 ? RED : GREEN; ctx.fill();
    ctx.save(); rr(ctx, SX, SY, SW, SH, 16); ctx.clip(); ctx.fillStyle = "#18150f"; ctx.fillRect(SX, SY, SW, SH);
    const vy = 1 - eOut(offQ); ctx.translate(0, SY + SH / 2); ctx.scale(1, Math.max(.004, vy)); ctx.translate(0, -(SY + SH / 2));
    if (offQ < 1){
      if (cur < 0) { if (f.start){ ctx.fillStyle = "#FFF7EE"; ctx.fillRect(SX, SY, SW, SH); ctx.beginPath(); ctx.arc(540, SY + 130, 64, 0, TAU); ctx.fillStyle = M.pal[2]; ctx.fill(); icon(ctx, f.start.icon || "clock", 540 - 36, SY + 94, 72, "#fff", 2.2); textC(ctx, th, f.start.label || "", 540, SY + 270, 44, SW - 80, 2, INK, 800); } else noise(ctx, SX, SY, SW, SH, t, .7); }
      else { const ch = C[cur], col = ch.bad ? RED : ch.good ? GREEN : M.pal[cur % 3], roll = (1 - eOut(k01(sw, .25, .3))) * SH * .5;
        const bg = ctx.createLinearGradient(0, SY, 0, SY + SH); bg.addColorStop(0, ch.bad ? "#FCE4DA" : ch.good ? "#E2F5E8" : "#FFF7EE"); bg.addColorStop(1, ch.bad ? "#F6C3B0" : ch.good ? "#BFE8CC" : "#F6D9BC"); ctx.fillStyle = bg; ctx.fillRect(SX, SY, SW, SH);
        ctx.save(); ctx.translate(0, roll); ctx.beginPath(); ctx.arc(540, SY + 125 + Math.sin(t * 2.5) * 5, 66, 0, TAU); ctx.fillStyle = col; ctx.fill(); icon(ctx, ch.icon || "sparkles", 540 - 37, SY + 88 + Math.sin(t * 2.5) * 5, 74, "#fff", 2.2);
        textC(ctx, th, ch.label || "", 540, SY + 262, 46, SW - 80, 2, INK, 800); ctx.restore();
        rr(ctx, SX + 18, SY + 16, 120, 46, 12); ctx.fillStyle = INK; ctx.fill(); font(ctx, 800, 26, th.fam); ctx.fillStyle = PAPER; ctx.textAlign = "center"; ctx.fillText(`CH ${ch.num != null ? ch.num : cur + 1}`, SX + 78, SY + 48); ctx.textAlign = "left";
        if (ch.bad){ ctx.strokeStyle = hexA(RED, .5 + .4 * Math.sin(t * 8)); ctx.lineWidth = 12; rr(ctx, SX + 6, SY + 6, SW - 12, SH - 12, 12); ctx.stroke(); }
        if (ch.good){ const k = popAt(t, T[cur] + .5, .4); if (k){ ctx.save(); ctx.translate(SX + SW - 54, SY + 54); ctx.scale(k, k); checkDisc(ctx, 0, 0, 30); ctx.restore(); } }
        if (sw < .32) noise(ctx, SX, SY, SW, SH, t, 1 - sw / .32 * .4); }
    }
    ctx.restore();
    if (offQ > 0 && offQ < 1){ ctx.fillStyle = `rgba(255,255,255,${1 - offQ})`; ctx.beginPath(); ctx.ellipse(540, SY + SH / 2, SW / 2 * (1 - offQ * .9), 6, 0, 0, TAU); ctx.fill(); }
    ctx.save(); ctx.globalAlpha *= .12; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(SX, SY); ctx.lineTo(SX + 240, SY); ctx.lineTo(SX + 120, SY + SH); ctx.lineTo(SX, SY + SH); ctx.closePath(); ctx.fill(); ctx.restore();
    // sofa (back)
    const AX = 300, GY = 1305, sc = .8; rr(ctx, AX - 170, 1095, 340, 150, 34); ctx.fillStyle = "#A0522D"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    // actor (seated, pointing the remote)
    const auto = [{ at: 0, sit: true, pose: "point", expr: (f.actor && f.actor.expr) || "neutral" }];
    C.forEach((ch, k) => auto.push({ at: T[k] + .1, expr: ch.bad ? "worried" : ch.good ? "happy" : (ch.expr || "neutral"), emote: ch.emote || (ch.good ? "sparkle" : null) }));
    if (tOff != null) auto.push({ at: tOff + .5, sit: false, pose: f.endPose || "cheer", expr: "happy", emote: "sparkle" });
    const a = withKeys(ACT(f.actor, AX, 0), auto), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, GY, a.scale || sc);
    // sofa (seat + arms, front)
    rr(ctx, AX - 175, 1215, 350, 70, 22); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.stroke(); rr(ctx, AX - 200, 1150, 50, 135, 20); ctx.fill(); ctx.stroke(); rr(ctx, AX + 150, 1150, 50, 135, 20); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#3B2418"; ctx.fillRect(AX - 160, 1285, 16, 22); ctx.fillRect(AX + 144, 1285, 16, 22);
    // remote in hand
    const press = C.some((c, k) => t >= T[k] - .12 && t < T[k] + .1) || (tOff != null && t >= tOff - .12 && t < tOff + .1);
    if (st.sit){ const hx = st.x + 182 * (a.scale || sc), hy = GY - 190 * (a.scale || sc) + (press ? 4 : 0); ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.35);
      rr(ctx, -10, -17, 112, 34, 14); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.strokeStyle = dark(th) ? "#8C7B6B" : "#000"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(84, 0, 7, 0, TAU); ctx.fillStyle = RED; ctx.fill(); [20, 40, 60].forEach(bx => { ctx.beginPath(); ctx.arc(bx, -5, 4, 0, TAU); ctx.arc(bx, 7, 4, 0, TAU); ctx.fillStyle = press && bx === 40 ? "#F4A85C" : "#8C7B6B"; ctx.fill(); });
      ctx.beginPath(); ctx.arc(-4, 0, 15, 0, TAU); ctx.fillStyle = "#D99A6E"; ctx.fill();
      // IR waves toward the TV
      const lastP = Math.max(-9, ...T.filter(x => t >= x - .12), tOff != null && t >= tOff - .12 ? tOff : -9), u = t - (lastP - .12);
      if (u >= 0 && u < .7){ ctx.strokeStyle = dark(th) ? "#F4A85C" : th.accent; ctx.lineWidth = 5; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const q = u / .7 + k * .18; if (q > 1) continue; ctx.globalAlpha *= 1; ctx.save(); ctx.globalAlpha = (1 - q) * ctx.globalAlpha; ctx.beginPath(); ctx.arc(112, 0, 20 + q * 110, -.5, .5); ctx.stroke(); ctx.restore(); } }
      ctx.restore(); }
    extras(ctx, th, a, st, r, t);
    if (f.label) tag(ctx, th, f.label, 760, 1210, { bg: PAPER, fg: INK, size: 28, maxW: 380, lines: 2, stroke: INK });
    ctx.restore();
  }, (s, f, i, add) => { const T = rmTimes(s, f, i); (f.channels || []).slice(0, 5).forEach((c, k) => { add(T[k], "pop"); if (c.bad) add(T[k] + .35, "ping"); if (c.good) add(T[k] + .5, "chime"); }); if (f.offCue) add(at(s, f.offCue, .9, i), "whoosh"); });
})();
