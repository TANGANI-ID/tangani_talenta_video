/* Scene pack set6b: weather, bridge, radar, elevator, bookshelf, thermometer, b_reader, b_desk.
   Runs after motion-tangani.js. Canvas 1080x1920; visuals stay in y ~600-1330, text in x 90-990. */
(() => {
  'use strict';
  const { cueT, popS, label, disc, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, sceneDur, panel, pill, mv, easeIO, TAU, G, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const GREEN = "#3BB273", RED = "#D84315", CREAM = "#FFF7EE";
  const dark = th => th.key === "B";
  const Y0 = f => f.headline ? 620 : 580, Y1 = 1330;

  /* ---------- small helpers ---------- */
  function fitFont(ctx, th, txt, weight, size, maxW, min){ let z = size; font(ctx, weight, z, th.fam); while (z > (min || 18) && ctx.measureText(txt).width > maxW){ z -= 2; font(ctx, weight, z, th.fam); } return z; }
  function wrapLines(ctx, txt, maxW){ const out = []; String(txt || "").split("\n").forEach(par => { let line = ""; par.split(/\s+/).filter(Boolean).forEach(w => { const tt = line ? line + " " + w : w; if (line && ctx.measureText(tt).width > maxW){ out.push(line); line = w; } else line = tt; }); out.push(line); }); return out; }
  // pill tag with optional icon, kept inside x 92..988; returns its box
  function tag(ctx, th, txt, cx, cy, o){
    o = o || {}; const maxW = Math.min(o.maxW || 860, 896); let z = o.size || 30; const ic = o.icon ? 1 : 0;
    font(ctx, 800, z, th.fam); while (z > 18 && ctx.measureText(txt).width + 44 + ic * z * 1.25 > maxW){ z -= 2; font(ctx, 800, z, th.fam); }
    const h = z * 1.8, w = ctx.measureText(txt).width + 44 + ic * z * 1.25; let x = o.align === "left" ? cx : o.align === "right" ? cx - w : cx - w / 2; x = clamp(x, o.minX || 92, (o.maxX || 988) - w);
    rr(ctx, x, cy - h / 2, w, h, h / 2); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); if (o.border){ ctx.strokeStyle = o.border; ctx.lineWidth = 4; ctx.stroke(); }
    if (ic) icon(ctx, o.icon, x + 18, cy - z * .5, z, o.fg || INK, 2.4);
    ctx.fillStyle = o.fg || INK; ctx.textAlign = "left"; ctx.fillText(txt, x + 22 + ic * z * 1.25, cy + z * .35);
    return { x, w, h };
  }
  const hx2 = h => { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const mix = (a, b, q) => { const A = hx2(a), B = hx2(b); return "#" + A.map((v, k) => Math.round(v + (B[k] - v) * clamp(q, 0, 1)).toString(16).padStart(2, "0")).join(""); };
  const popIn = (ctx, x, y, q, fn) => { if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.translate(-x, -y); fn(); ctx.restore(); };
  const qB = (t, t0, d) => eBack(clamp((t - t0) / (d || .45), 0, 1)), qO = (t, t0, d) => eOut(clamp((t - t0) / (d || .45), 0, 1));
  function actorWithHead(ctx, th, a, st, t, gy, sc){ const r = drawActor(ctx, th, a, st, t, gy, sc); return r; }
  function actorExtras(ctx, th, a, st, r, t, dy){ if (!r) return;
    if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (a.emoteDx || 0), r.headTop - 20 + (dy || 0), t - st.emoteT, t);
    if (st.say) bubbleAt(ctx, th, st.say, r.headX + (a.bubbleDx || 0), r.headTop - (st.emote ? 80 : 6) + (dy || 0), st.chat, t - st.sayT); }

  /* =========================================================== WEATHER */
  const SKY = {
    sun:   { top: "#8FD0EE", bot: "#FCE7C8", cloud: "#FFFFFF", sun: 1, clouds: .25, rain: 0, bolt: 0, expr: "happy", pose: "stand", icon: "sparkles" },
    cloud: { top: "#AEB8C0", bot: "#E7E1D8", cloud: "#F1EEEA", sun: .15, clouds: 1, rain: 0, bolt: 0, expr: "neutral", pose: "think", icon: "clock" },
    rain:  { top: "#6F7E8B", bot: "#AEB7BE", cloud: "#8D96A0", sun: 0, clouds: 1, rain: 1, bolt: 0, expr: "worried", pose: "cover", icon: "alert" },
    storm: { top: "#2F3640", bot: "#5E636B", cloud: "#4A5059", sun: 0, clouds: 1, rain: 1, bolt: 1, expr: "shock", pose: "shrug", icon: "alert" },
  };
  function wxStates(s, f, idx){ return (f.states || []).map((x, k) => Object.assign({}, x, { T: k === 0 && !x.cue ? 0 : at(s, x.cue, .05 + k * .3, idx) })).sort((a, b) => a.T - b.T); }
  function cloudShape(ctx, x, y, sc, col){ ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = col; ctx.beginPath();
    ctx.arc(-60, 10, 42, 0, TAU); ctx.arc(-10, -18, 58, 0, TAU); ctx.arc(52, 4, 46, 0, TAU); ctx.arc(10, 22, 44, 0, TAU); ctx.fill(); ctx.restore(); }
  TT.layout("weather", "Cuaca berubah", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = Y0(f), y1 = Y1, sts = wxStates(s, f), cur = Math.max(0, sts.reduce((a, x, k) => t >= x.T ? k : a, 0));
    const A = SKY[(sts[cur] || {}).sky || "sun"], Bk = cur > 0 ? SKY[sts[cur - 1].sky || "sun"] : A, q = cur > 0 ? easeIO(clamp((t - sts[cur].T) / .9, 0, 1)) : 1;
    const L = k => Bk[k] + (A[k] - Bk[k]) * q, C = k => mix(Bk[k], A[k], q);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, 90, y0, 900, y1 - y0, 44); ctx.save(); ctx.clip();
    const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, C("top")); g.addColorStop(1, C("bot")); ctx.fillStyle = g; ctx.fillRect(90, y0, 900, y1 - y0);
    // sun
    const sa = L("sun"); if (sa > .02){ ctx.save(); ctx.globalAlpha *= sa; ctx.translate(800, y0 + 170); ctx.rotate(t * .5); ctx.fillStyle = "#F4B23A";
      for (let k = 0; k < 12; k++){ ctx.rotate(TAU / 12); rr(ctx, -7, -150 - Math.sin(t * 3 + k) * 8, 14, 46, 7); ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, 0, 92, 0, TAU); ctx.fillStyle = "#F8C24A"; ctx.fill(); ctx.restore(); }
    // clouds (drift)
    const ca = L("clouds"), cc = C("cloud");
    [[180, 90, 1.1], [520, 60, 1.35], [860, 120, 1.0], [360, 200, .9], [700, 230, 1.15]].forEach(([cx, cy, sc], k) => {
      const show = k === 0 ? Math.max(.35, ca) : ca; if (show < .02) return; const x = ((cx + t * (14 + k * 6)) % 1100) - 10;
      ctx.save(); ctx.globalAlpha *= show; cloudShape(ctx, x, y0 + cy + Math.sin(t * .8 + k) * 6, sc, k % 2 ? cc : mix(cc, "#FFFFFF", .12)); ctx.restore(); });
    // rain
    const ra = L("rain"); if (ra > .02){ ctx.save(); ctx.globalAlpha *= ra * .85; ctx.strokeStyle = "#CFE7F5"; ctx.lineWidth = 4; ctx.lineCap = "round";
      for (let k = 0; k < 46; k++){ const x = (k * 97 + 37) % 900 + 90, sp = 700 + (k % 5) * 90, y = y0 + 200 + ((t * sp + k * 131) % (y1 - y0 - 200));
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 34); ctx.stroke(); } ctx.restore(); }
    // lightning
    const ba = L("bolt"); if (ba > .5){ const ph = (t + .3) % 1.7; if (ph < .35){ ctx.save(); ctx.globalAlpha *= (1 - ph / .35);
      ctx.fillStyle = "rgba(255,255,240,.35)"; ctx.fillRect(90, y0, 900, y1 - y0);
      ctx.strokeStyle = "#FFE27A"; ctx.lineWidth = 12; ctx.lineJoin = "round"; const bx = 300 + ((Math.floor((t + .3) / 1.7) * 233) % 480);
      ctx.beginPath(); ctx.moveTo(bx, y0 + 230); ctx.lineTo(bx - 40, y0 + 340); ctx.lineTo(bx + 10, y0 + 340); ctx.lineTo(bx - 50, y0 + 470); ctx.stroke(); ctx.restore(); } }
    // ground
    ctx.fillStyle = mix("#C9A27A", "#7C6450", L("rain")); ctx.beginPath(); ctx.moveTo(90, y1 - 120); ctx.quadraticCurveTo(540, y1 - 190, 990, y1 - 120); ctx.lineTo(990, y1); ctx.lineTo(90, y1); ctx.fill();
    ctx.fillStyle = mix("#8DBF6A", "#5E7A50", L("rain")); ctx.beginPath(); ctx.moveTo(90, y1 - 120); ctx.quadraticCurveTo(540, y1 - 190, 990, y1 - 120); ctx.lineTo(990, y1 - 100); ctx.quadraticCurveTo(540, y1 - 168, 90, y1 - 100); ctx.fill();
    if (ra > .3){ ctx.fillStyle = hexA("#CFE7F5", .5 * ra); [[260, y1 - 60, 70], [760, y1 - 50, 90]].forEach(([x, y, w]) => { ctx.beginPath(); ctx.ellipse(x, y, w + Math.sin(t * 3) * 4, 12, 0, 0, TAU); ctx.fill(); }); }
    ctx.restore();
    // subject: actor or big icon
    const ws = sts[cur] || {}, wsT = ws.T || 0, sk = SKY[ws.sky || "sun"];
    if (f.actor){ const a = Object.assign({ x: 540 }, f.actor), st = actorState(a, s, t);
      if (!a.keepExpr){ st.expr = ws.expr || sk.expr; st.pose = ws.pose || sk.pose; }
      if (!st.emote && ws.emote && t - wsT < 2.2 && t >= wsT){ st.emote = ws.emote; st.emoteT = wsT; }
      const r = drawActor(ctx, th, a, st, t, y1 - 70, a.scale || .95); actorExtras(ctx, th, a, st, r, t); }
    else if (f.icon){ const shake = ws.sky === "storm" ? Math.sin(t * 30) * 5 : 0, bob = ws.sky === "sun" ? Math.abs(Math.sin(t * 3)) * -14 : 0;
      disc(ctx, f.icon, 540 + shake, y1 - 230 + bob, 110, ws.sky === "sun" ? th.accent : "#6B6F76", "#FFFFFF", "#FFFFFF"); }
    // state label
    if (ws.label){ const k = qB(t, wsT, .4); popIn(ctx, 540, y0 + 64, k, () => tag(ctx, th, ws.label, 540, y0 + 64, { bg: ws.sky === "sun" ? th.accent : ws.sky === "cloud" ? "#FFFFFF" : INK, fg: ws.sky === "cloud" ? INK : "#FFFFFF", icon: ws.icon || sk.icon, size: 34, maxW: 820 })); }
    if (ws.sky === "sun" && cur > 0) burst(ctx, 800, y0 + 170, t - wsT - .3, M, 10);
    ctx.restore();
  }, (s, f, i, add) => { wxStates(s, f, i).forEach((x, k) => { if (k === 0 && x.T < .2) { add(.15, "whoosh"); return; } add(x.T, x.sky === "sun" ? "chime" : x.sky === "storm" ? "whoosh" : "pop"); }); });

  /* =========================================================== BRIDGE */
  function bridgePlan(s, f, idx){ const pl = (f.planks || []).map((p, k) => Object.assign({}, p, { T: at(s, p.cue, .1 + k * .17, idx), F: p.fixCue ? at(s, p.fixCue, .8, idx) : null }));
    const cross = f.crossCue ? at(s, f.crossCue, .85, idx) : null, speed = (f.actor && f.actor.speed) || 300, arrive = cross != null ? cross + 720 / speed : null; return { pl, cross, arrive, speed }; }
  TT.layout("bridge", "Jembatan papan", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = Y0(f), y1 = Y1, deck = Math.min(1090, y0 + 470), XL = 270, XR = 810, P = bridgePlan(s, f), n = P.pl.length || 1, pw = (XR - XL) / n;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // chasm
    rr(ctx, 90, y0, 900, y1 - y0, 44); ctx.save(); ctx.clip();
    const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, dark(th) ? "#2A2119" : "#FCEBD7"); g.addColorStop(1, dark(th) ? "#3A2C22" : "#F2D4B4"); ctx.fillStyle = g; ctx.fillRect(90, y0, 900, y1 - y0);
    ctx.fillStyle = hexA("#FFFFFF", dark(th) ? .06 : .7); [[230, y0 + 90, .8], [720, y0 + 60, 1], [930, y0 + 150, .6]].forEach(([x, y, sc], k) => cloudShape(ctx, x + Math.sin(t * .3 + k) * 20, y, sc * .8, hexA("#FFFFFF", dark(th) ? .08 : .8)));
    const cg = ctx.createLinearGradient(0, deck, 0, y1); cg.addColorStop(0, "#6B4A36"); cg.addColorStop(1, "#2B1A12"); ctx.fillStyle = cg; ctx.fillRect(XL, deck + 20, XR - XL, y1 - deck);
    ctx.strokeStyle = "#7CC4E8"; ctx.lineWidth = 8; ctx.beginPath(); for (let x = XL; x <= XR; x += 10) ctx.lineTo(x, y1 - 30 + Math.sin(x * .04 + t * 4) * 6); ctx.stroke();
    // cliffs
    const cliff = (x0, x1, side) => { ctx.fillStyle = "#A0522D"; ctx.beginPath(); ctx.moveTo(x0, deck); ctx.lineTo(x1, deck); ctx.lineTo(x1 - side * 30, deck + 160); ctx.lineTo(x1 - side * 10, y1); ctx.lineTo(x0, y1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#8DBF6A"; ctx.fillRect(Math.min(x0, x1), deck - 6, Math.abs(x1 - x0), 22); ctx.fillStyle = "rgba(59,36,24,.18)"; for (let k = 0; k < 5; k++){ ctx.beginPath(); ctx.arc((x0 + x1) / 2 + ((k * 53) % 120) - 60, deck + 70 + k * 45, 10 + k % 3 * 4, 0, TAU); ctx.fill(); } };
    cliff(90, XL, 1); cliff(990, XR, -1);
    ctx.restore();
    // posts + ropes
    const built = P.pl.filter(p => t >= p.T).length; ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 16; ctx.lineCap = "round";
    [XL, XR].forEach(x => { ctx.beginPath(); ctx.moveTo(x, deck + 10); ctx.lineTo(x, deck - 110); ctx.stroke(); });
    const ropeQ = clamp(built / n, 0, 1); ctx.strokeStyle = "#C9A27A"; ctx.lineWidth = 6; ctx.setLineDash([]); ctx.beginPath(); for (let k = 0; k <= 40 * ropeQ; k++){ const u = k / 40, x = XL + (XR - XL) * u, y = deck - 100 + Math.sin(u * Math.PI) * 40; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    // planks + labels
    P.pl.forEach((p, k) => { if (t < p.T) return; const x = XL + k * pw, q = clamp((t - p.T) / .55, 0, 1), dropY = (1 - eOut(q)) * -260, rot = (1 - eBack(q)) * (k % 2 ? .6 : -.6);
      const fixed = p.F != null && t >= p.F, weak = p.weak && !fixed;
      ctx.save(); ctx.translate(x + pw / 2, deck + 8 + dropY + (weak ? Math.sin(t * 9 + k) * 3 : 0)); ctx.rotate(rot + (weak ? .06 : 0));
      rr(ctx, -pw / 2 + 4, -16, pw - 8, 32, 8); ctx.fillStyle = weak ? "#9C8B7A" : fixed ? th.accent : (k % 2 ? "#C98B5A" : "#D9A066"); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      if (weak){ ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-10, -16); ctx.lineTo(4, -2); ctx.lineTo(-6, 6); ctx.lineTo(8, 16); ctx.stroke(); }
      else { ctx.fillStyle = "rgba(59,36,24,.35)"; ctx.beginPath(); ctx.arc(-pw / 2 + 18, 0, 4, 0, TAU); ctx.arc(pw / 2 - 18, 0, 4, 0, TAU); ctx.fill(); }
      ctx.restore();
      if (fixed) burst(ctx, x + pw / 2, deck, t - p.F, M, 8);
      if (p.label){ const lq = qB(t, p.T + .3, .4), ly = deck + (k % 2 ? 200 : 110); if (lq > 0){ ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + pw / 2, deck + 26); ctx.lineTo(x + pw / 2, ly - 20); ctx.stroke();
        popIn(ctx, x + pw / 2, ly, lq, () => tag(ctx, th, p.label, x + pw / 2, ly, { bg: weak ? RED : fixed ? GREEN : "#FFFFFF", fg: weak || fixed ? "#FFFFFF" : INK, size: 32, maxW: Math.max(240, Math.min(520, pw * 2 - 20)), icon: p.icon, minX: XL + 6, maxX: XR - 6 })); } } });
    // cliff labels
    const side = (txt, cx, glow) => { if (!txt) return; font(ctx, 800, 30, th.fam); const lines = wrapLines(ctx, txt, 160).slice(0, 2); ctx.textAlign = "center";
      lines.forEach((l, j) => { fitFont(ctx, th, l, 800, 30, 160); ctx.fillStyle = glow ? "#FFE9C9" : CREAM; ctx.fillText(l, cx, deck + 92 + j * 38); }); ctx.textAlign = "left"; };
    side(f.from, 180, false); side(f.to, 900, P.arrive != null && t > P.arrive);
    // traveller
    if (f.actor){ const a = Object.assign({ x: 180 }, f.actor), keys = (a.keys || []).slice();
      if (P.cross != null){ keys.push({ at: P.cross, x: 900, speed: P.speed }); keys.push({ at: P.arrive, pose: "cheer", expr: "happy", emote: f.arriveEmote || "check" }); }
      const st = actorState(Object.assign({}, a, { keys }), s, t); const r = drawActor(ctx, th, a, st, t, deck - 2, a.scale || .74); actorExtras(ctx, th, a, st, r, t);
      if (P.arrive != null) burst(ctx, 900, deck - 200, t - P.arrive, M, 12); }
    ctx.restore();
  }, (s, f, i, add) => { const P = bridgePlan(s, f, i); P.pl.forEach(p => { add(p.T + .35, "pop"); if (p.F != null) add(p.F, "chime"); }); if (P.cross != null){ add(P.cross, "whoosh"); add(P.arrive, "chime"); } });

  /* =========================================================== RADAR */
  const BLIP = { threat: RED, chance: GREEN, info: "#F4A85C" };
  TT.layout("radar", "Radar", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = Y0(f), R0 = 290, cx = 540, cy = y0 + 330, sw = t * 2.4 + (f.phase || 0), k0 = popS(t, .05);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k0, k0); ctx.translate(-cx, -cy);
    // screen
    ctx.beginPath(); ctx.arc(cx, cy, R0 + 24, 0, TAU); ctx.fillStyle = "#5A3A2A"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R0); bg.addColorStop(0, "#3B2A1E"); bg.addColorStop(1, "#1E1510"); ctx.fillStyle = bg; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); ctx.clip();
    ctx.strokeStyle = "rgba(232,149,68,.35)"; ctx.lineWidth = 3; [.33, .66, 1].forEach(r => { ctx.beginPath(); ctx.arc(cx, cy, R0 * r, 0, TAU); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(cx - R0, cy); ctx.lineTo(cx + R0, cy); ctx.moveTo(cx, cy - R0); ctx.lineTo(cx, cy + R0); ctx.stroke();
    for (let k = 0; k < 28; k++){ const a0 = sw - Math.PI / 2 - k * .04; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R0, a0 - .045, a0); ctx.closePath(); ctx.fillStyle = `rgba(244,168,92,${.32 * (1 - k / 28)})`; ctx.fill(); }
    ctx.strokeStyle = "#F4A85C"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sw - Math.PI / 2) * R0, cy + Math.sin(sw - Math.PI / 2) * R0); ctx.stroke();
    ctx.restore();
    // center
    const c = f.center || {}; disc(ctx, c.icon || "user", cx, cy, 52, th.accent, "#FFFFFF", "#FFF7EE");
    // blips
    const bl = (f.blips || []).map((b, k) => Object.assign({}, b, { T: at(s, b.cue, .15 + k * .2) }));
    bl.forEach((b, k) => { if (t < b.T) return; const a = (b.a ?? (k * 97 + 30)) * Math.PI / 180, r = (b.r ?? .72) * R0, bx = cx + Math.sin(a) * r, by = cy - Math.cos(a) * r, col = BLIP[b.kind || "info"], dt = t - b.T;
      let d = ((sw % TAU) - a) % TAU; if (d < 0) d += TAU; const lit = Math.max(0, 1 - d / 1.4);
      for (let j = 0; j < 2; j++){ const qq = ((dt * .9) + j / 2) % 1; ctx.beginPath(); ctx.arc(bx, by, 16 + qq * 60, 0, TAU); ctx.strokeStyle = hexA(col, .7 * (1 - qq)); ctx.lineWidth = 4; ctx.stroke(); }
      const sc = qB(t, b.T, .4); ctx.beginPath(); ctx.arc(bx, by, (18 + lit * 8) * sc, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke();
      if (b.label){ const right = b.side ? b.side === "right" : bx >= cx; const lx = right ? bx + 34 : bx - 34, ly = by + (b.dy || 0);
        popIn(ctx, lx, ly, qB(t, b.T + .15, .4), () => tag(ctx, th, b.label, lx, ly, { align: right ? "left" : "right", bg: "#FFFFFF", fg: INK, border: col, icon: b.icon, size: 32, maxW: 400 })); }
      burst(ctx, bx, by, dt, M, 6); });
    ctx.restore();
    // bottom label / result
    const res = f.result; const tr = res ? at(s, res.cue, .85) : 1e9;
    if (res && t >= tr){ const q = qB(t, tr, .45); popIn(ctx, cx, cy + R0 + 62, q, () => tag(ctx, th, res.label, cx, cy + R0 + 62, { bg: res.kind === "threat" ? RED : res.kind === "chance" ? GREEN : th.accent, fg: "#FFFFFF", icon: res.icon || (res.kind === "threat" ? "alert" : "check"), size: 34, maxW: 860 })); burst(ctx, cx, cy + R0 + 62, t - tr, M, 12); }
    else if (c.label){ font(ctx, 800, 32, th.fam); tag(ctx, th, c.label, cx, cy + R0 + 62, { bg: dark(th) ? "rgba(250,248,243,.12)" : "#FFFFFF", fg: dark(th) ? th.ink : INK, size: 30, maxW: 700 }); }
  }, (s, f, i, add) => { add(.1, "whoosh"); (f.blips || []).forEach((b, k) => add(at(s, b.cue, .15 + k * .2, i), "ping")); if (f.result) add(at(s, f.result.cue, .85, i), f.result.kind === "threat" ? "pop" : "chime"); });

  /* =========================================================== ELEVATOR */
  function elevPlan(s, f, idx){
    const stops = (f.stops || []).map((x, k) => Object.assign({}, x, { T: at(s, x.cue, .15 + k * .25, idx) })).sort((a, b) => a.T - b.T);
    let cur = f.start || 0; return stops.map(x => { const from = cur, to = x.stuck ? from + (x.floor - from) * .5 : x.floor, g = { T: x.T, from, to, close: .3, mv: .5 + .3 * Math.abs(to - from), open: .35, stuck: !!x.stuck, x };
      g.arrive = g.T + g.close + g.mv; cur = to; return g; });
  }
  function elevAt(plan, f, t){ let pos = f.start || 0, door = 1, dir = 0, stuck = null;
    for (const g of plan){ if (t < g.T) break; const dt = t - g.T;
      if (dt < g.close){ door = 1 - dt / g.close; pos = g.from; dir = 0; }
      else if (dt < g.close + g.mv){ door = 0; pos = g.from + (g.to - g.from) * easeIO((dt - g.close) / g.mv); dir = Math.sign(g.to - g.from); }
      else { pos = g.to; dir = 0; door = g.stuck ? 0 : clamp((dt - g.close - g.mv) / g.open, 0, 1); stuck = g.stuck ? g : null; } }
    return { pos, door, dir, stuck }; }
  TT.layout("elevator", "Lift", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = Y0(f), y1 = Y1, fl = f.floors || [], n = Math.max(1, fl.length), H = (y1 - y0 - 30) / n, SX = 140, SW = 330, carW = 250, carH = H - 22, carX = SX + SW / 2;
    const plan = elevPlan(s, f), E = elevAt(plan, f, t), floorY = k => y1 - 10 - k * H; // floor surface of level k
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // building
    rr(ctx, 100, y0, 880, y1 - y0, 30); ctx.fillStyle = dark(th) ? "#2A2119" : "#F6E6D2"; ctx.fill(); ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.15)" : hexA(INK, .12); ctx.lineWidth = 3; ctx.stroke();
    rr(ctx, SX, y0 + 14, SW, y1 - y0 - 24, 14); ctx.fillStyle = dark(th) ? "#18130E" : "#E2CBB0"; ctx.fill();
    ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.08)" : "rgba(59,36,24,.08)"; ctx.lineWidth = 6; [SX + 40, SX + SW - 40].forEach(x => { ctx.beginPath(); ctx.moveTo(x, y0 + 14); ctx.lineTo(x, y1 - 10); ctx.stroke(); });
    // floors
    fl.forEach((F, k) => { const y = floorY(k), here = Math.abs(E.pos - k) < .05 && E.door > .5, wasStuck = E.stuck && Math.abs(E.pos - k) < .5;
      ctx.fillStyle = dark(th) ? "#5A4232" : "#C9A27A"; ctx.fillRect(100, y, 880, 10);
      const ly = y - H / 2; tag(ctx, th, F.label, 540, ly, { align: "left", bg: here ? th.accent : (dark(th) ? "rgba(250,248,243,.12)" : "#FFFFFF"), fg: here ? "#FFFFFF" : (dark(th) ? th.ink : INK), icon: F.icon, size: 38, maxW: 440, border: here ? null : (dark(th) ? null : hexA(INK, .12)) });
      ctx.fillStyle = here ? th.accent : (dark(th) ? "rgba(250,248,243,.35)" : hexA(INK, .3)); font(ctx, 800, 26, th.fam); ctx.textAlign = "center"; ctx.fillText(String(k + 1), 506, ly + 9); ctx.textAlign = "left";
      if (here && !wasStuck) burst(ctx, 540, ly, t - (plan.find(g => g.to === k && t >= g.arrive) || { arrive: -9 }).arrive - .3, M, 6); });
    // cable
    const cy = floorY(E.pos) - carH, shake = E.stuck ? Math.sin(t * 35) * 3 : 0;
    ctx.strokeStyle = "#544E42"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(carX, y0 + 14); ctx.lineTo(carX, cy); ctx.stroke();
    // car interior
    ctx.save(); ctx.translate(shake, 0);
    rr(ctx, carX - carW / 2, cy, carW, carH, 12); ctx.fillStyle = E.stuck && Math.sin(t * 8) > 0 ? "#7A2A10" : "#FCE7C8"; ctx.fill();
    ctx.save(); rr(ctx, carX - carW / 2, cy, carW, carH, 12); ctx.clip();
    const light = ctx.createRadialGradient(carX, cy, 0, carX, cy, carH); light.addColorStop(0, "rgba(255,255,255,.7)"); light.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = light; ctx.fillRect(carX - carW / 2, cy, carW, carH);
    let headR = null, ast = null, aa = null;
    if (f.actor){ aa = Object.assign({ x: carX }, f.actor); const keys = (aa.keys || []).slice(); plan.forEach(g => { const k = { at: g.arrive + (g.stuck ? 0 : .3) }; ["expr", "pose", "emote", "say"].forEach(p => { if (g.x[p] != null) k[p] = g.x[p]; }); if (g.stuck && !k.emote) k.emote = "!"; if (g.stuck && !k.expr) k.expr = "shock"; keys.push(k); });
      ast = actorState(Object.assign({}, aa, { keys }), s, t); ast.x = carX; ast.walking = false; const sc = aa.scale || Math.min(.42, (carH - 18) / 440);
      headR = drawActor(ctx, th, aa, ast, t, cy + carH - 4, sc); }
    ctx.restore();
    // doors
    const dw = carW / 2 * (1 - eOut(E.door)); ctx.fillStyle = "#B8AE9D"; ctx.fillRect(carX - carW / 2, cy, dw, carH); ctx.fillRect(carX + carW / 2 - dw, cy, dw, carH);
    if (dw > 4){ ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(carX - carW / 2 + dw, cy); ctx.lineTo(carX - carW / 2 + dw, cy + carH); ctx.moveTo(carX + carW / 2 - dw, cy); ctx.lineTo(carX + carW / 2 - dw, cy + carH); ctx.stroke(); }
    rr(ctx, carX - carW / 2, cy, carW, carH, 12); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
    // display on top of the car
    rr(ctx, carX - 46, cy - 40, 92, 34, 8); ctx.fillStyle = "#18150f"; ctx.fill(); font(ctx, 800, 26, "Inter"); ctx.fillStyle = E.stuck ? RED : "#F4A85C"; ctx.textAlign = "center";
    ctx.fillText((E.dir > 0 ? "▲ " : E.dir < 0 ? "▼ " : "") + (E.stuck ? "!" : String(Math.round(E.pos) + 1)), carX, cy - 14); ctx.textAlign = "left";
    ctx.restore();
    if (headR && ast) actorExtras(ctx, th, aa, ast, headR, t, -30);
    if (E.stuck && f.stuckLabel){ const q = qB(t, E.stuck.arrive, .4); popIn(ctx, carX, cy + carH / 2, q, () => tag(ctx, th, f.stuckLabel, carX, cy + carH / 2, { bg: RED, fg: "#FFFFFF", icon: "alert", size: 30, maxW: 300 })); }
    ctx.restore();
  }, (s, f, i, add) => { elevPlan(s, f, i).forEach(g => { add(g.T + g.close, "whoosh"); add(g.arrive, g.stuck ? "pop" : "ping"); }); });

  /* =========================================================== BOOKSHELF */
  const BOOKC = ["#C2691F", "#2F6F73", "#A0522D", "#E89544", "#544E42", "#B87333", "#7A8F3A"];
  TT.layout("bookshelf", "Rak buku / map", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = Y0(f), y1 = Y1, sh = f.shelves || [{}], n = Math.max(1, sh.length), top = y0 + 30, bot = y1 - 16, cH = (bot - top) / n, messy = f.mode === "messy";
    const tidyT = f.tidyCue ? at(s, f.tidyCue, .4) : null;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // frame
    rr(ctx, 120, top - 24, 840, bot - top + 40, 20); ctx.fillStyle = "#8E4E2E"; ctx.fill(); rr(ctx, 140, top - 6, 800, bot - top + 6, 10); ctx.fillStyle = dark(th) ? "#3A2C22" : "#F3DCC0"; ctx.fill();
    // shelves + labels
    sh.forEach((S, k) => { const by = top + (k + 1) * cH - 20; ctx.fillStyle = "#B5643C"; ctx.fillRect(140, by, 800, 20); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(140, by + 20, 800, 6);
      if (S.label || S.icon){ const cx = 250, cy = by - cH / 2 + 10; rr(ctx, 158, cy - 70, 184, 140, 18); ctx.fillStyle = S.hl && tidyT != null && t > tidyT ? th.accent : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .18); ctx.lineWidth = 3; ctx.stroke();
        const fg = S.hl && tidyT != null && t > tidyT ? "#FFFFFF" : INK; if (S.icon) icon(ctx, S.icon, cx - 22, cy - 58, 44, fg, 2.4);
        font(ctx, 800, 30, th.fam); const ls = wrapLines(ctx, S.label || "", 166).slice(0, 2); ctx.fillStyle = fg; ctx.textAlign = "center"; ls.forEach((l, j) => { fitFont(ctx, th, l, 800, 30, 170); ctx.fillText(l, cx, cy + (S.icon ? 18 : -4) + j * 34 + (ls.length === 1 ? 12 : 0)); }); ctx.textAlign = "left"; } });
    // books: slot positions
    const used = sh.map(() => 380), bk = (f.books || []).map((b, k) => { const w = b.w || 58 + (k * 23) % 26, h = Math.min(cH - 60, 120 + (k * 37) % 58), si = clamp(b.shelf || 0, 0, n - 1), x = used[si]; used[si] += w + 10;
      const T = b.cue ? at(s, b.cue, .1 + k * .1) : (messy && tidyT != null ? tidyT + k * .22 : at(s, null, .1 + k * .1)); return Object.assign({}, b, { w, h, si, x, T, k }); });
    const drawBook = (b, x, y, rot, glow) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const col = b.color || BOOKC[b.k % BOOKC.length];
      if (glow > 0){ ctx.shadowColor = hexA("#F4A85C", glow); ctx.shadowBlur = 30; }
      rr(ctx, -b.w / 2, -b.h, b.w, b.h, 6); ctx.fillStyle = col; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(-b.w / 2 + 6, -b.h + 14, b.w - 12, 6); ctx.fillRect(-b.w / 2 + 6, -22, b.w - 12, 6);
      if (b.icon) icon(ctx, b.icon, -b.w / 2 + 8, -b.h + 26, b.w - 16, "#FFFFFF", 2.2);
      if (b.label){ ctx.save(); ctx.rotate(-Math.PI / 2); const z = fitFont(ctx, th, b.label, 800, 26, b.h - (b.icon ? b.w + 24 : 34), 14); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(b.label, b.icon ? (b.h - b.w - 14) / 2 : b.h / 2, z * .35); ctx.restore(); }
      ctx.restore(); };
    bk.forEach(b => { const slotX = b.x + b.w / 2, slotY = top + (b.si + 1) * cH - 20;
      if (messy){ const mi = (b.si + 1 + b.k) % n, my = top + (mi + 1) * cH - 20, lie = b.k % 3 === 0, mx = 430 + ((b.k * 173) % 380) + (lie ? b.h / 2 : 0), mr = lie ? -Math.PI / 2 + (b.k % 2 ? .05 : -.05) : (b.k % 2 ? .42 : -.38);
        const q = clamp((t - b.T) / .8, 0, 1), e = easeIO(q), x = mx + (slotX - mx) * e, y = my + (slotY - my) * e - Math.sin(q * Math.PI) * 120, r = mr * (1 - e) + (q > 0 && q < 1 ? Math.sin(q * 9) * .1 : 0);
        drawBook(b, x, y - (lie ? b.w / 2 : 0) * (1 - e), r, q >= 1 ? Math.max(0, 1 - (t - b.T - .8) * 1.5) : 0); if (q >= 1) burst(ctx, slotX, slotY - b.h, t - b.T - .8, M, 5); }
      else { if (t < b.T) return; const q = clamp((t - b.T) / .7, 0, 1), e = eOut(q), x = 1120 + (slotX - 1120) * e, y = slotY - Math.sin(q * Math.PI) * 90, r = (1 - eBack(q)) * .5;
        drawBook(b, x, y, r + (q >= 1 ? Math.sin((t - b.T) * 6) * .02 * Math.max(0, 1 - (t - b.T - .7)) : 0), q >= 1 ? Math.max(0, 1 - (t - b.T - .7) * 1.5) : 0); if (q >= 1) burst(ctx, slotX, slotY - b.h, t - b.T - .7, M, 5); } });
    // status pill on the crown
    const allIn = bk.length && bk.every(b => t >= b.T + .8); const lbl = messy ? (allIn ? f.doneLabel : f.messyLabel) : (allIn ? f.doneLabel : null);
    if (lbl){ const t0 = allIn ? Math.max(...bk.map(b => b.T)) + .8 : .2, q = qB(t, t0, .4); popIn(ctx, 540, top - 24, q, () => tag(ctx, th, lbl, 540, top - 24, { bg: allIn ? GREEN : RED, fg: "#FFFFFF", icon: allIn ? "check" : "alert", size: 30, maxW: 640 })); if (allIn) burst(ctx, 540, top - 24, t - t0, M, 12); }
    ctx.restore();
  }, (s, f, i, add) => { const messy = f.mode === "messy", tidyT = f.tidyCue ? at(s, f.tidyCue, .4, i) : null; if (tidyT != null) add(tidyT, "whoosh");
    (f.books || []).forEach((b, k) => { const T = b.cue ? at(s, b.cue, .1 + k * .1, i) : (messy && tidyT != null ? tidyT + k * .22 : at(s, null, .1 + k * .1, i)); add(T + .6, "pop"); }); });

  /* =========================================================== THERMOMETER */
  function thermoKeys(s, f, idx){ return (f.keys || []).map((k, j) => Object.assign({}, k, { T: at(s, k.cue, .15 + j * .25, idx) })).sort((a, b) => a.T - b.T); }
  TT.layout("thermometer", "Termometer", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = Y0(f), y1 = Y1, hasA = !!f.actor, tx = hasA ? 410 : 330, top = y0 + 60, bulbY = y1 - 100, Rb = 88, tw = 78, yAt = v => bulbY - Rb - 30 - v * (bulbY - Rb - 30 - (top + 40));
    const ks = thermoKeys(s, f); let v = f.start ?? .3, prev = v, kT = -9; ks.forEach(k => { if (t >= k.T){ prev = v; v = k.v; kT = k.T; } });
    const q = clamp((t - kT) / 1.1, 0, 1), val = clamp(prev + (v - prev) * eBack(q), -.04, 1.06) + Math.sin(t * 2.2) * .006;
    const hot = clamp((val - .72) / .2, 0, 1), cold = clamp((.26 - val) / .2, 0, 1), col = val < .5 ? mix("#7CC4E8", "#E89544", val * 2) : mix("#E89544", RED, (val - .5) * 2);
    const jit = hot > .5 ? Math.sin(t * 40) * 2 * hot : 0;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1); ctx.translate(jit, 0);
    // glow
    const gl = ctx.createRadialGradient(tx, bulbY, 20, tx, bulbY, 300); gl.addColorStop(0, hexA(hot > 0 ? RED : cold > 0 ? "#7CC4E8" : "#F4A85C", .25 + .25 * Math.max(hot, cold))); gl.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = gl; ctx.fillRect(90, y0, 900, y1 - y0);
    // levels
    (f.levels || []).forEach((L, j) => { const y = yAt(L.v), near = Math.abs(val - L.v) < .09;
      ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.35)" : hexA(INK, .3); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tx + tw / 2 + 8, y); ctx.lineTo(tx + tw / 2 + 50, y); ctx.stroke();
      const lc = L.color || (L.v > .7 ? RED : L.v < .3 ? "#4A9CC8" : th.accent);
      const box = tag(ctx, th, L.label, tx + tw / 2 + 62, y, { align: "left", bg: near ? lc : (dark(th) ? "rgba(250,248,243,.12)" : "#FFFFFF"), fg: near ? "#FFFFFF" : (dark(th) ? th.ink : INK), icon: L.icon, size: near ? 40 : 34, maxW: 980 - (tx + tw / 2 + 62), border: near || dark(th) ? null : hexA(INK, .12) }); });
    // tube
    rr(ctx, tx - tw / 2 - 10, top - 10, tw + 20, bulbY - top + 10, (tw + 20) / 2); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
    ctx.beginPath(); ctx.arc(tx, bulbY, Rb + 10, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(tx, bulbY, Rb - 4, 0, TAU); ctx.fillStyle = col; ctx.fill();
    const my = yAt(val); rr(ctx, tx - tw / 2 + 8, my, tw - 16, bulbY - my, (tw - 16) / 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.45)"; rr(ctx, tx - tw / 2 + 14, my + 10, 10, Math.max(0, bulbY - my - 60), 5); ctx.fill(); ctx.beginPath(); ctx.arc(tx - 30, bulbY - 26, 16, 0, TAU); ctx.fill();
    for (let k = 0; k < 9; k++){ const y = top + 40 + k * (bulbY - Rb - top - 40) / 9; ctx.strokeStyle = hexA(INK, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx - tw / 2 - 10, y); ctx.lineTo(tx - tw / 2 + 4, y); ctx.stroke(); }
    // boiling bubbles + steam
    if (hot > 0){ for (let k = 0; k < 7; k++){ const qq = ((t * .9) + k / 7) % 1, by = bulbY - qq * (bulbY - my); ctx.beginPath(); ctx.arc(tx + Math.sin(k * 2 + t * 5) * 12, by, 5 + k % 3 * 2, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .7 * hot); ctx.fill(); }
      ctx.strokeStyle = hexA(dark(th) ? "#FAF8F3" : "#8C8476", .55 * hot); ctx.lineWidth = 7; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const qq = ((t * .7) + k / 3) % 1; ctx.save(); ctx.globalAlpha *= 1 - qq; ctx.beginPath();
        for (let j = 0; j <= 10; j++){ const yy = top - 14 - qq * 70 - j * 6, xx = tx + (k - 1) * 30 + Math.sin(j * .8 + t * 4 + k) * 10; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); } }
    if (cold > 0){ ctx.save(); ctx.globalAlpha *= cold; ctx.strokeStyle = "#BFE6F7"; ctx.lineWidth = 5; ctx.lineCap = "round";
      [[tx - 80, top + 140], [tx + 70, top + 260], [tx - 70, top + 400], [tx + 60, bulbY - 160]].forEach(([x, y], k) => { ctx.save(); ctx.translate(x, y); ctx.rotate(t * .4 + k); for (let a = 0; a < 3; a++){ ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.stroke(); } ctx.restore(); }); ctx.restore(); }
    if (f.unit){ font(ctx, 800, 30, th.fam); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(f.unit, tx, bulbY + 10); ctx.textAlign = "left"; }
    ctx.restore();
    // actor
    if (hasA){ const a = Object.assign({ x: 190 }, f.actor), st = actorState(a, s, t); if (!a.keepExpr && !(a.keys || []).some(k => k.expr)) st.expr = hot > .3 ? "worried" : cold > .3 ? "smile" : "neutral";
      if (!st.emote && hot > .5) { st.emote = "sweat"; st.emoteT = kT; }
      const r = drawActor(ctx, th, a, st, t, y1 - 10, a.scale || .72); actorExtras(ctx, th, a, st, r, t); }
    ks.forEach(k => burst(ctx, tx, yAt(k.v), t - k.T - .6, M, 6));
  }, (s, f, i, add) => { let v = f.start ?? .3; thermoKeys(s, f, i).forEach(k => { add(k.T, k.v > v ? "whoosh" : "chime"); v = k.v; }); });

  /* =========================================================== b_reader: message card + reader reacting */
  function readerRows(s, f, idx){ return (f.lines || []).map((l, k) => Object.assign({}, l, { T: k === 0 && !l.cue ? .15 : at(s, l.cue, .08 + k * .15, idx), F: l.fixCue ? at(s, l.fixCue, .7, idx) : null })); }
  TT.layout("b_reader", "Pesan + pembaca", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = Y0(f), y1 = Y1, email = f.app === "email", X = 96, Wc = 610, rows = readerRows(s, f), sendT = f.sendCue ? at(s, f.sendCue, .9) : null;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // layout rows first to know the height
    const tw = Wc - 70, FZ = email ? 36 : 40, LH = email ? 46 : 50; font(ctx, 600, FZ, th.fam);
    const lay = rows.map(r => { const txt = r.F != null && t >= r.F ? r.fix : r.text; font(ctx, r.type === "subject" ? 800 : 600, FZ, th.fam);
      const pre = r.prefix != null ? r.prefix : (r.type === "subject" ? "Subjek:" : ""), lines = r.type === "attach" ? [txt] : wrapLines(ctx, (pre ? pre + " " : "") + txt, tw - (email ? 0 : 30)).slice(0, 4);
      return { r, txt, lines, h: r.type === "attach" ? 80 : lines.length * LH + (email ? 24 : 40) }; });
    const head = 96, ch = Math.min(y1 - y0 - 10, Math.max(email ? 0 : 520, head + 26 + lay.reduce((a, l) => a + l.h + 14, 0) + 20 + (email ? 0 : 90))), cy0 = y0 + 6, fly = sendT != null && t > sendT ? eOut(clamp((t - sendT) / .6, 0, 1)) : 0;
    ctx.save(); ctx.translate(fly * 80, -fly * 30); ctx.globalAlpha *= 1 - fly * .0;
    rr(ctx, X + 10, cy0 + 14, Wc, ch, 30); ctx.fillStyle = "rgba(24,21,15,.18)"; ctx.fill();
    rr(ctx, X, cy0, Wc, ch, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .14); ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); rr(ctx, X, cy0, Wc, ch, 30); ctx.clip(); ctx.fillStyle = email ? "#F3E6D6" : "#FBEBDD"; ctx.fillRect(X, cy0, Wc, head);
    disc(ctx, email ? "file" : (f.avatar || "user"), X + 52, cy0 + head / 2, 30, th.accent, "#FFFFFF");
    if (!email){ ctx.fillStyle = "#F6EDE2"; ctx.fillRect(X, cy0 + ch - 92, Wc, 92); rr(ctx, X + 22, cy0 + ch - 72, Wc - 120, 52, 26); ctx.fillStyle = "#FFFFFF"; ctx.fill(); font(ctx, 600, 26, th.fam); ctx.fillStyle = "#B8AE9D"; ctx.fillText("Ketik pesan…", X + 46, cy0 + ch - 37); disc(ctx, "rocket", X + Wc - 52, cy0 + ch - 46, 28, th.accent, "#FFFFFF"); }
    const hdr = f.from || (email ? "Email baru" : "Chat"); fitFont(ctx, th, hdr, 800, 36, Wc - 130); ctx.fillStyle = INK; ctx.fillText(hdr, X + 96, cy0 + head / 2 + 11);
    ctx.restore();
    let y = cy0 + head + 22;
    lay.forEach(({ r, txt, lines, h }) => { if (t < r.T) { y += h + 14; return; }
      const k = qO(t, r.T, .35), fixed = r.F != null && t >= r.F, kind = fixed ? "good" : (r.tone || "plain"), chars = Math.floor(clamp((t - r.T) / Math.max(.4, txt.length * .03), 0, 1) * 999);
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 20);
      if (r.type === "attach"){ rr(ctx, X + 30, y, Wc - 60, 66, 16); ctx.fillStyle = kind === "bad" ? hexA(RED, .1) : hexA(th.accent, .14); ctx.fill(); ctx.strokeStyle = kind === "bad" ? RED : th.accent; ctx.lineWidth = 3; ctx.setLineDash(kind === "bad" ? [10, 8] : []); ctx.stroke(); ctx.setLineDash([]);
        icon(ctx, kind === "bad" ? "alert" : "file", X + 46, y + 14, 38, kind === "bad" ? RED : th.accent, 2.4); fitFont(ctx, th, txt, 700, 32, Wc - 150); ctx.fillStyle = INK; ctx.fillText(txt, X + 98, y + 47); }
      else {
        const bx = email ? X + 26 : X + 26, bw = Wc - 52; if (!email || kind !== "plain"){ rr(ctx, bx, y, bw, h, email ? 14 : 24); ctx.fillStyle = kind === "bad" ? hexA(RED, .09) : kind === "good" || kind === "add" ? hexA(GREEN, .12) : "#FBF3E9"; ctx.fill();
          if (kind === "bad" || kind === "good" || kind === "add"){ ctx.strokeStyle = kind === "bad" ? hexA(RED, .6 + .3 * Math.sin(t * 5)) : GREEN; ctx.lineWidth = 3; ctx.stroke(); } }
        let left = chars; lines.forEach((l, j) => { const part = l.slice(0, Math.max(0, left)); left -= l.length + 1; font(ctx, r.type === "subject" && j === 0 ? 800 : 600, FZ, th.fam); ctx.fillStyle = INK;
          const ly = y + (email ? 44 : 50) + j * LH; ctx.fillText(part, bx + (email ? 16 : 20), ly);
          if (kind === "bad" && part.length === l.length){ const lw = ctx.measureText(l).width; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); for (let xx = 0; xx <= lw; xx += 6) ctx.lineTo(bx + (email ? 16 : 20) + xx, ly + 8 + Math.sin(xx * .5) * 3); ctx.stroke(); } });
        if (fixed){ const q2 = qB(t, r.F, .4); popIn(ctx, bx + bw - 6, y + 6, q2, () => { disc(ctx, "check", bx + bw - 6, y + 6, 22, GREEN, "#FFFFFF"); }); burst(ctx, bx + bw - 40, y + h / 2, t - r.F, M, 8); }
        if (r.cut){ const tc = at(s, r.cut, .6); if (t > tc){ const qc = clamp((t - tc) / .5, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx + 10, y + h / 2); ctx.lineTo(bx + 10 + (bw - 20) * qc, y + h / 2); ctx.stroke(); } }
      }
      ctx.restore(); y += h + 14; });
    if (sendT != null && t > sendT){ const q = qB(t, sendT, .4); popIn(ctx, X + Wc - 70, cy0 + ch - 10, q, () => disc(ctx, "rocket", X + Wc - 70, cy0 + ch - 10, 38, th.accent, "#FFFFFF")); }
    ctx.restore();
    // reader
    if (f.actor){ const a = Object.assign({ x: 850 }, f.actor), st = actorState(a, s, t); const r = drawActor(ctx, th, a, st, t, y1 - 20, a.scale || 1.0); actorExtras(ctx, th, a, st, r, t);
      if (f.readerLabel){ font(ctx, 700, 28, th.fam); const lw = ctx.measureText(f.readerLabel).width; ctx.fillStyle = th.ink; ctx.textAlign = "center"; ctx.fillText(f.readerLabel, clamp(st.x, 690 + lw / 2, 985 - lw / 2), y1 + 0); ctx.textAlign = "left"; } }
    ctx.restore();
  }, (s, f, i, add) => { readerRows(s, f, i).forEach(r => { add(r.T, "pop"); if (r.F != null) add(r.F, "chime"); }); if (f.sendCue) add(at(s, f.sendCue, .9, i), "whoosh");
    if (f.actor) keyTimes(s, f.actor.keys, i).forEach(k => { if (k.emote || k.say != null) add(k.T + .05, k.emote === "check" || k.emote === "heart" ? "chime" : "pop"); }); });

  /* =========================================================== b_desk: worker at a desk, monitor + posture */
  function deskScreens(s, f, idx){ return (f.screens || []).map((x, k) => Object.assign({}, x, { T: k === 0 && !x.cue ? 0 : at(s, x.cue, .1 + k * .3, idx) })).sort((a, b) => a.T - b.T); }
  TT.layout("b_desk", "Meja kerja", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = Y0(f), y1 = Y1, deskY = 1130, floor = 1262, ax = f.actorX || 270, mxC = 735;
    const raiseT = f.raiseCue ? at(s, f.raiseCue, .5) : null, straightT = f.straightCue ? at(s, f.straightCue, .7) : null;
    const rq = raiseT != null ? easeIO(clamp((t - raiseT) / 1, 0, 1)) : (f.monitor === "eye" ? 1 : 0), sq = straightT != null ? easeIO(clamp((t - straightT) / .9, 0, 1)) : (f.posture === "straight" ? 1 : 0);
    const low = f.monitor === "low" || raiseT != null, lean = low || f.posture === "hunch" ? .42 * (1 - sq) : 0;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, 90, y0, 900, y1 - y0, 40); ctx.save(); ctx.clip();
    const g = ctx.createLinearGradient(0, y0, 0, floor); g.addColorStop(0, dark(th) ? "#3A2C22" : "#FFF3E4"); g.addColorStop(1, dark(th) ? "#4A3628" : "#FBE6D0"); ctx.fillStyle = g; ctx.fillRect(90, y0, 900, y1 - y0);
    ctx.fillStyle = dark(th) ? "#5A4232" : "#E9C9A8"; ctx.fillRect(90, floor, 900, y1 - floor);
    // window + clock decoration
    rr(ctx, 130, y0 + 40, 200, 170, 12); ctx.fillStyle = dark(th) || f.night ? "#1E2A33" : "#CFE7EE"; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.stroke(); ctx.beginPath(); ctx.moveTo(230, y0 + 40); ctx.lineTo(230, y0 + 210); ctx.stroke();
    if (f.night){ ctx.beginPath(); ctx.arc(290, y0 + 80, 22, 0, TAU); ctx.fillStyle = "#F4E3B5"; ctx.fill(); ctx.fillStyle = "rgba(24,21,15,.28)"; ctx.fillRect(90, y0, 900, y1 - y0); }
    if (f.wallIcon) disc(ctx, f.wallIcon, 900, y0 + 110, 46, hexA(th.accent, .85), "#FFFFFF");
    ctx.restore();
    // chair back
    const chX = ax - 64; ctx.fillStyle = "#5A3A2A"; ctx.save(); ctx.translate(chX, floor - 120); ctx.rotate(-.12); rr(ctx, -22, -250, 44, 250, 18); ctx.fill(); ctx.restore();
    rr(ctx, ax - 80, floor - 140, 150, 26, 12); ctx.fill(); ctx.fillStyle = "#3B2418"; ctx.fillRect(ax - 12, floor - 114, 16, 100); rr(ctx, ax - 70, floor - 18, 140, 14, 7); ctx.fill();
    // actor (sitting, leaning around the hip)
    let r = null, st = null, a = null;
    if (f.actor !== false){ a = Object.assign({ x: ax, sit: true, pose: "type" }, f.actor || {}); st = actorState(a, s, t); st.sit = true;
      const sc = a.scale || 1.0, hipY = floor - 112 * sc - 20; ctx.save(); ctx.translate(st.x, hipY); ctx.rotate(lean); ctx.translate(-st.x, -hipY);
      r = drawActor(ctx, th, a, st, t, floor - 20, sc); ctx.restore();
      if (r){ const dx = Math.sin(lean) * (hipY - r.headTop), dy = (1 - Math.cos(lean)) * (hipY - r.headTop); r = { headX: r.headX + dx, headTop: r.headTop + dy }; } }
    // desk
    ctx.fillStyle = "#B5643C"; rr(ctx, 400, deskY, 560, 30, 10); ctx.fill(); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(430, deskY + 30, 22, floor - deskY - 30); ctx.fillRect(910, deskY + 30, 22, floor - deskY - 30);
    if (f.mug !== false){ rr(ctx, 890, deskY - 56, 42, 56, 9); ctx.fillStyle = th.accent; ctx.fill(); ctx.strokeStyle = th.accent; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(934, deskY - 30, 12, -1.2, 1.2); ctx.stroke(); }
    // riser books
    const stack = rq * 3; for (let k = 0; k < 3; k++){ const q = clamp(stack - k, 0, 1); if (q <= 0) continue; const yy = deskY - (k + 1) * 34 + (1 - eOut(q)) * -200; ctx.globalAlpha = q;
      rr(ctx, mxC - 130 + k * 6, yy, 260 - k * 12, 32, 6); ctx.fillStyle = BOOKC[k + 1]; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.globalAlpha = 1; }
    // monitor
    const lowC = deskY - 124, eyeC = r ? Math.min(lowC, r.headTop + 70 * (a.scale || 1)) : deskY - 260, mY = low || f.monitor === "eye" ? lowC + (eyeC - lowC) * rq : deskY - 190, sw = 400, sh = 250;
    ctx.fillStyle = "#544E42"; ctx.fillRect(mxC - 10, mY + sh / 2, 20, Math.max(0, deskY - stack * 34 * (stack > 0 ? 1 : 0) - (mY + sh / 2))); rr(ctx, mxC - 70, deskY - 10 - Math.min(3, stack) * 34 * (rq > 0 ? 1 : 0), 140, 12, 6); ctx.fill();
    rr(ctx, mxC - sw / 2 - 12, mY - sh / 2 - 12, sw + 24, sh + 24, 18); ctx.fillStyle = "#2B2620"; ctx.fill();
    rr(ctx, mxC - sw / 2, mY - sh / 2, sw, sh, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill();
    const scs = deskScreens(s, f); let cur = null; scs.forEach(x => { if (t >= x.T) cur = x; });
    if (cur){ ctx.save(); rr(ctx, mxC - sw / 2, mY - sh / 2, sw, sh, 10); ctx.clip(); const k = qO(t, cur.T, .35), kind = cur.kind || "plain", dt = t - cur.T;
      const hc = kind === "alert" ? RED : kind === "ok" ? GREEN : kind === "sale" ? "#D84315" : th.accent; ctx.fillStyle = hc; ctx.fillRect(mxC - sw / 2, mY - sh / 2, sw, 52);
      if (kind === "alert" || kind === "sale"){ ctx.fillStyle = `rgba(255,255,255,${.25 + .25 * Math.sin(t * 8)})`; ctx.fillRect(mxC - sw / 2, mY - sh / 2, sw, 52); }
      font(ctx, 800, 28, th.fam); ctx.fillStyle = "#FFFFFF"; ctx.fillText(cur.app || (kind === "alert" ? "Peringatan" : kind === "ok" ? "Selesai" : kind === "sale" ? "Promo" : "Layar"), mxC - sw / 2 + 18, mY - sh / 2 + 37);
      ctx.globalAlpha *= k; if (cur.icon && !cur.items) icon(ctx, cur.icon, mxC - sw / 2 + 20, mY - sh / 2 + 70, 76, hc, 2.6);
      font(ctx, 800, 34, th.fam); const ls = cur.items ? [] : wrapLines(ctx, cur.text || "", sw - (cur.icon ? 130 : 40)).slice(0, cur.buttons || cur.progress || cur.timer ? 2 : 3); ctx.fillStyle = INK; ls.forEach((l, j) => { fitFont(ctx, th, l, 800, 34, sw - (cur.icon ? 130 : 40)); ctx.fillText(l, mxC - sw / 2 + (cur.icon ? 112 : 20), mY - sh / 2 + 102 + j * 40); });
      if (cur.items){ const t0 = cur.itemsCue ? at(s, cur.itemsCue, .4) : cur.T + .3; cur.items.slice(0, 4).forEach((it, j) => { const tj = t0 + j * .45; if (t < tj) return; const qq = qO(t, tj, .3), yy = mY - sh / 2 + 82 + j * 44;
          ctx.save(); ctx.globalAlpha *= qq; rr(ctx, mxC - sw / 2 + 24, yy - 14, 28, 28, 7); ctx.strokeStyle = th.accent; ctx.lineWidth = 4; ctx.stroke(); fitFont(ctx, th, it, 700, 30, sw - 100); ctx.fillStyle = INK; ctx.fillText(it, mxC - sw / 2 + 66, yy + 11); ctx.restore(); }); }
      if (cur.progress){ const p = clamp(dt / (cur.dur || 2.2), 0, 1); rr(ctx, mxC - sw / 2 + 20, mY + sh / 2 - 44, sw - 40, 22, 11); ctx.fillStyle = "#ECE6DD"; ctx.fill(); rr(ctx, mxC - sw / 2 + 20, mY + sh / 2 - 44, (sw - 40) * p, 22, 11); ctx.fillStyle = p >= 1 ? GREEN : th.accent; ctx.fill(); }
      if (cur.timer){ const secs = Math.max(0, cur.timer - Math.floor(dt * 37)); const hh = Math.floor(secs / 3600), mm = Math.floor(secs / 60) % 60, ss = secs % 60; font(ctx, 800, 34, "Inter"); ctx.fillStyle = RED; ctx.textAlign = "center"; ctx.fillText(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`, mxC, mY + sh / 2 - 22); ctx.textAlign = "left"; }
      if (cur.buttons){ cur.buttons.slice(0, 2).forEach((b, j) => { const bw2 = (sw - 60) / 2, bx = mxC - sw / 2 + 20 + j * (bw2 + 20), by = mY + sh / 2 - 62; rr(ctx, bx, by, bw2, 48, 24); ctx.fillStyle = j ? hc : "#ECE6DD"; ctx.fill(); fitFont(ctx, th, b, 800, 28, bw2 - 16); ctx.fillStyle = j ? "#FFFFFF" : INK; ctx.textAlign = "center"; ctx.fillText(b, bx + bw2 / 2, by + 34); ctx.textAlign = "left"; });
        if (cur.tap != null){ const tt = at(s, cur.tapCue, .6); if (t > tt){ const bw2 = (sw - 60) / 2, bx = mxC - sw / 2 + 20 + cur.tap * (bw2 + 20) + bw2 / 2, by = mY + sh / 2 - 35, qq = clamp((t - tt) / .5, 0, 1); ctx.beginPath(); ctx.arc(bx, by, 10 + qq * 40, 0, TAU); ctx.strokeStyle = hexA(INK, .6 * (1 - qq)); ctx.lineWidth = 5; ctx.stroke(); } } }
      ctx.restore(); if (kind === "ok") burst(ctx, mxC, mY, dt - .2, M, 10); }
    else { const gl = ctx.createLinearGradient(0, mY - sh / 2, 0, mY + sh / 2); gl.addColorStop(0, "#E9F4F7"); gl.addColorStop(1, "#CFE7EE"); ctx.fillStyle = gl; rr(ctx, mxC - sw / 2, mY - sh / 2, sw, sh, 10); ctx.fill(); }
    // sight line
    if (f.sight && r){ const ex = r.headX + 20, ey = r.headTop + 64 * (a.scale || 1), sx = mxC - sw / 2, sy = mY, ok = Math.abs(sy - ey) < 40; ctx.save(); ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = ok ? GREEN : RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(sx, sy); ctx.stroke(); ctx.restore();
      if (f.sightLabels){ const lb = ok ? f.sightLabels[1] : f.sightLabels[0]; if (lb) tag(ctx, th, lb, mxC, Math.min(mY + sh / 2 + 48, 1205), { bg: ok ? GREEN : RED, fg: "#FFFFFF", size: 28, maxW: 300, icon: ok ? "check" : "alert" }); } }
    if (lean > .2 && f.painMark !== false && low && r){ const px = st.x + 30, py = r.headTop + 150; ctx.save(); ctx.globalAlpha *= (.5 + .5 * Math.sin(t * 6)) * (1 - sq); ctx.strokeStyle = RED; ctx.lineWidth = 6; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(px, py, 18 + k * 14, -2.4, -.6); ctx.stroke(); } ctx.restore(); }
    if (r && st) actorExtras(ctx, th, a, st, r, t);
    if (straightT != null && t > straightT + .9) burst(ctx, ax, r ? r.headTop : 900, t - straightT - .9, M, 10);
    ctx.restore();
  }, (s, f, i, add) => { deskScreens(s, f, i).forEach((x, k) => { if (k || x.T > .1) add(x.T, x.kind === "alert" || x.kind === "sale" ? "ping" : x.kind === "ok" ? "chime" : "pop"); if (x.tapCue) add(at(s, x.tapCue, .6, i), "pop"); });
    if (f.raiseCue) add(at(s, f.raiseCue, .5, i), "whoosh"); if (f.straightCue) add(at(s, f.straightCue, .7, i) + .9, "chime");
    if (f.actor) keyTimes(s, f.actor.keys, i).forEach(k => { if (k.emote || k.say != null) add(k.T + .05, "pop"); }); });
})();
