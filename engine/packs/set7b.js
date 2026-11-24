/* Scene pack set7b: juggle, plates, signpost, toss, vending, canphone, hive, xpbar.
   Runs after motion-tangani.js in its own <script>. Canvas 1080x1920; visuals kept in y ~560-1330, text in x 90-990.
   Every label sits on its own light shape (white tag / paper / cell) so it reads on light and dark (KD) backgrounds. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, actorState, drawActor, bubbleAt, emoteAt, keyTimes, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const RED = "#D84315", GREEN = "#3BB273", GOLD = "#E8A317", PAPER = "#FFF7EE", WOOD = "#8E4E2E", TEAL = "#2F6F73";
  const BALLC = ["#C2691F", TEAL, "#A0522D", "#544E42", "#B87333"];
  const dark = th => th.key === "B";

  /* ---------- text helpers (always measured, shrunk or wrapped to fit) ---------- */
  function wrapL(ctx, txt, maxW){ return wrapRich(ctx, String(txt || ""), "", maxW).map(l => l.map(z => z.w).join(" ")).filter(l => l.length); }
  function fitLines(ctx, th, txt, maxW, size, maxL, weight, min){ let z = size;
    for (;;){ font(ctx, weight || 700, z, th.fam); const L = wrapL(ctx, txt, maxW);
      if ((L.length <= maxL && L.every(l => ctx.measureText(l).width <= maxW)) || z <= (min || 16)) return { z, L: L.slice(0, maxL) }; z -= 1; } }
  function textBlock(ctx, th, txt, cx, cy, maxW, size, maxL, color, weight, min){ const r = fitLines(ctx, th, txt, maxW, size, maxL, weight || 800, min); const lh = r.z * 1.13;
    font(ctx, weight || 800, r.z, th.fam); ctx.fillStyle = color; ctx.textAlign = "center"; r.L.forEach((l, k) => ctx.fillText(l, cx, cy + r.z * .36 + (k - (r.L.length - 1) / 2) * lh)); ctx.textAlign = "left"; return r; }
  // pill tag (1–2 lines) anchored at cx (center/left/right), vertically centred at cy
  function tag(ctx, th, txt, cx, cy, o){ o = o || {}; const size = o.size || 32, maxW = o.maxW || 800, pad = size * .7, icS = o.icon ? size * 1.05 : 0, inner = maxW - pad * 2 - (icS ? icS + 10 : 0);
    const r = fitLines(ctx, th, txt, inner, size, o.lines || 1, o.weight || 800, o.min || 16), z = r.z, lh = z * 1.16;
    const tw = Math.max(...r.L.map(l => ctx.measureText(l).width), 10), ic = o.icon ? z * 1.05 : 0, w = tw + pad * 2 + (ic ? ic + 10 : 0), h = z * .9 + lh * r.L.length;
    const x0 = o.align === "right" ? cx - w : o.align === "left" ? cx : cx - w / 2;
    rr(ctx, x0, cy - h / 2, w, h, Math.min(h / 2, o.rad || 30)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 4; ctx.stroke(); }
    if (ic) icon(ctx, o.icon, x0 + pad * .8, cy - ic / 2, ic, o.fg || INK, 2.4);
    font(ctx, o.weight || 800, z, th.fam); ctx.fillStyle = o.fg || INK; ctx.textAlign = "left";
    r.L.forEach((l, k) => ctx.fillText(l, x0 + pad + (ic ? ic + 8 : 0), cy + z * .36 + (k - (r.L.length - 1) / 2) * lh));
    return { x0, w, h };
  }
  const toneBg = (tone, def) => tone === "good" ? GREEN : tone === "bad" ? RED : tone === "accent" ? "#C2691F" : (def || "#FFFFFF");
  const toneFg = (tone, def) => (tone === "good" || tone === "bad" || tone === "accent") ? "#FFFFFF" : (def || INK);
  const popAt = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  function scaled(ctx, x, y, k, fn){ if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); }
  function checkDisc(ctx, x, y, r, col){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || GREEN; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .34); ctx.lineTo(x + r * .45, y - r * .3); ctx.stroke(); }
  function crossDisc(ctx, x, y, r){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .35, y - r * .35); ctx.lineTo(x + r * .35, y + r * .35); ctx.moveTo(x + r * .35, y - r * .35); ctx.lineTo(x - r * .35, y + r * .35); ctx.stroke(); }
  function hsh(n){ let x = Math.imul(n ^ 0x9E3779B9, 2654435761) >>> 0; x ^= x >>> 15; return x >>> 0; }

  /* ---------- actor helpers ---------- */
  const A = (a, x, extra) => Object.assign({ hair: "short", shirt: TEAL, skin: "a", x }, extra || {}, a || {});
  const withKeys = (a, more) => Object.assign({}, a, { keys: (a.keys || []).concat(more || []) });
  function figure(ctx, th, a, st, t, gy, sc, mirror){
    if (!mirror) return drawActor(ctx, th, a, st, t, gy, sc);
    ctx.save(); ctx.translate(2 * st.x, 0); ctx.scale(-1, 1); const r = drawActor(ctx, th, a, Object.assign({}, st, { face: -st.face }), t, gy, sc); ctx.restore();
    if (r) r.headX = 2 * st.x - r.headX; return r;
  }
  function overlays(ctx, th, st, r, t, dx, noSay){ if (!r) return;
    if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (dx == null ? 56 : dx), r.headTop - 4, t - st.emoteT, t);
    if (st.say && !noSay) bubbleAt(ctx, th, st.say, r.headX, r.headTop - 6, st.chat, t - st.sayT); }
  function ground(ctx, th, y, x0, x1){ ctx.fillStyle = dark(th) ? "rgba(250,248,243,.12)" : "rgba(59,36,24,.11)"; rr(ctx, x0, y - 4, x1 - x0, 14, 7); ctx.fill(); }

  /* =====================================================================
     juggle: a person juggles labelled balls; one per cue joins the cascade (faster as it grows).
     On dropCue the balls fall one by one (to the floor, or into a paper "tray" where they become a neat list).
     f: headline, highlight, balls:[{label, icon, cue, bad}], dropCue, keep (index or [indices] kept in the air),
        tray:{label, icon} (optional), actor:{..., keys}
     ===================================================================== */
  const JG = { CY: 790, RX: 240, RT: 190, RB: 135, BR: 74 };
  function jugTimes(s, f, idx){
    const B = f.balls || [], T = B.map((b, i) => b.cue ? at(s, b.cue, .08 + i * .14, idx) : .15 + i * .2);
    const keep = [].concat(f.keep != null ? f.keep : []), tD = f.dropCue ? at(s, f.dropCue, .7, idx) : null, D = {}, order = [];
    if (tD != null){ let k = 0; B.forEach((b, i) => { if (keep.includes(i)) return; D[i] = Math.max(tD + k * .45, T[i] + .7); order.push(i); k++; }); }
    order.sort((p, q) => D[p] - D[q]);
    return { T, D, tD, order };
  }
  const wrapA = d => { d = (d + Math.PI) % TAU; if (d < 0) d += TAU; return d - Math.PI; };
  function jugPhases(B, T, D, t){
    const ev = []; B.forEach((b, i) => { ev.push({ t: T[i], i, k: "in" }); if (D[i] != null) ev.push({ t: D[i], i, k: "out" }); });
    ev.sort((p, q) => p.t - q.t || (p.k === "out" ? -1 : 1));
    let base = 0, tp = 0, act = []; const ph = {}, w = n => 1.6 + .3 * n;
    const cur = (i, x) => { const p = ph[i]; return p.from + (p.to - p.from) * easeIO(clamp((x - p.te) / .7, 0, 1)); };
    for (const e of ev){ if (e.t > t) break;
      base += w(act.length) * (e.t - tp); tp = e.t;
      if (e.k === "in") act.push(e.i); else act = act.filter(j => j !== e.i);
      if (!act.length) continue;
      const anchor = (act[0] !== e.i && ph[act[0]]) ? cur(act[0], e.t) : 0;
      act.forEach((j, k) => { const isNew = e.k === "in" && j === e.i, tgt = anchor + TAU * k / act.length, from = (!isNew && ph[j]) ? cur(j, e.t) : tgt;
        ph[j] = { from, to: from + wrapA(tgt - from), te: e.t }; });
    }
    base += w(act.length) * Math.max(0, t - tp);
    return { act, n: act.length, ang: i => base + (ph[i] ? cur(i, t) : 0) };
  }
  function ball(ctx, th, b, x, y, r, col, rot){
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = col; ctx.fill();
    const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .05, -r * .2, -r * .2, r * 1.1); g.addColorStop(0, "rgba(255,255,255,.45)"); g.addColorStop(.45, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(0,0,0,.18)");
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "rgba(43,26,18,.45)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = Math.max(2, r * .06); ctx.beginPath(); ctx.arc(0, 0, r * .84, rot, rot + 1.2); ctx.stroke();
    if (r > 40 && b.label){ const fl = fitLines(ctx, th, b.label, r * 1.66, Math.round(r * .4), 2, 800, 14), icn = b.icon && fl.L.length === 1;
      if (icn) icon(ctx, b.icon, -r * .26, -r * .66, r * .52, "#fff", 2.4);
      font(ctx, 800, fl.z, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; const y0 = icn ? r * .3 : 0;
      fl.L.forEach((l, k) => ctx.fillText(l, 0, y0 + fl.z * .36 + (k - (fl.L.length - 1) / 2) * fl.z * 1.08)); ctx.textAlign = "left"; }
    else if (b.icon) icon(ctx, b.icon, -r * .5, -r * .5, r, "#fff", 2.4);
    ctx.restore();
  }
  TT.layout("juggle", "Juggling bola", (ctx, th, s, t) => {
    const f = s.f, M = mv(), B = f.balls || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const tray = f.tray, CX = tray ? 370 : 540, GY = 1290, { T, D, order } = jugTimes(s, f), J = jugPhases(B, T, D, t);
    const pos = a => { const sn = Math.sin(a); return [CX + JG.RX * Math.cos(a), JG.CY - (sn > 0 ? JG.RT : JG.RB) * sn]; };
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    ground(ctx, th, GY, 110, 970);
    // paper tray on the right: dropped balls land here as a neat list
    const TX = 680, TY0 = 610, TY1 = 1250;
    if (tray){ ctx.save(); ctx.translate(TX + 150, TY0); ctx.rotate(.015); ctx.translate(-(TX + 150), -TY0);
      ctx.fillStyle = "rgba(24,21,15,.18)"; rr(ctx, TX + 10, TY0 + 12, 300, TY1 - TY0, 22); ctx.fill();
      rr(ctx, TX, TY0, 300, TY1 - TY0, 22); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.strokeStyle = "rgba(194,105,31,.25)"; ctx.lineWidth = 3; for (let y = TY0 + 150; y < TY1 - 20; y += 90){ ctx.beginPath(); ctx.moveTo(TX + 24, y + 40); ctx.lineTo(TX + 276, y + 40); ctx.stroke(); }
      rr(ctx, TX, TY0, 300, 96, 22); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.fillRect(TX, TY0 + 60, 300, 36);
      if (tray.icon) icon(ctx, tray.icon, TX + 22, TY0 + 26, 44, "#fff", 2.4);
      textBlock(ctx, th, tray.label || "Di kertas", TX + 150 + (tray.icon ? 24 : 0), TY0 + 48, tray.icon ? 200 : 260, 34, 1, "#fff");
      ctx.restore(); }
    // actor
    const a = A(f.actor, CX), st = actorState(a, s, t);
    if (J.n > 0 && st.pose === (a.pose || "stand")) st.pose = "cheer";
    const r = drawActor(ctx, th, a, st, t, GY, a.scale || .86);
    // dropped balls
    B.forEach((b, i) => { if (D[i] == null || t < D[i]) return;
      const k = order.indexOf(i), col = b.bad ? RED : BALLC[i % BALLC.length], [x0, y0] = pos(jugPhases(B, T, D, D[i] - 1e-3).ang(i)), u = clamp((t - D[i]) / .7, 0, 1);
      if (tray){ const tx = TX + 52, ty = TY0 + 150 + k * 90, x = x0 + (tx - x0) * easeIO(u), y = y0 + (ty - y0) * u - Math.sin(u * Math.PI) * 160, rad = JG.BR + (26 - JG.BR) * u;
        ball(ctx, th, b, x, y, rad, col, t * 3 + i);
        if (u >= 1){ const q = popAt(t, D[i] + .7, .35); scaled(ctx, tx + 40, ty, q, () => { const fl = fitLines(ctx, th, b.label || "", 186, 30, 2, 800, 17); font(ctx, 800, fl.z, th.fam); ctx.fillStyle = INK;
          fl.L.forEach((l, j) => ctx.fillText(l, tx + 40, ty + fl.z * .36 + (j - (fl.L.length - 1) / 2) * fl.z * 1.1)); }); }
      } else { const tx = clamp(CX + [-330, 330, -190, 190, -450, 450][k % 6], 150, 930), ty = GY - 54, dt = t - D[i] - .7;
        let x = x0 + (tx - x0) * u, y = y0 + (ty - y0) * u * u; if (dt > 0) y -= Math.abs(Math.sin(dt * 9)) * 34 * Math.exp(-dt * 5);
        ball(ctx, th, b, x, y, JG.BR * (1 - .15 * u), col, i + u * 4);
        if (dt > 0 && !b.safe){ const q = popAt(t, D[i] + .75, .3); scaled(ctx, x + 40, y - 40, q, () => crossDisc(ctx, x + 40, y - 40, 20)); }
      } });
    // balls in the air
    J.act.forEach(i => { const b = B[i], col = b.bad ? RED : BALLC[i % BALLC.length], dt = t - T[i]; let [x, y] = pos(J.ang(i)), rad = JG.BR;
      if (dt < .45){ const u = dt / .45, sx = CX + 80, sy = 920; x = sx + (x - sx) * easeIO(u); y = sy + (y - sy) * u - Math.sin(u * Math.PI) * 120; rad = JG.BR * (.4 + .6 * eBack(u)); }
      ball(ctx, th, b, x, y, rad, col, t * 4 + i); burst(ctx, x, y, dt - .45, M, 8); });
    overlays(ctx, th, st, r, t, 70);
    ctx.restore();
  }, (s, f, i, add) => { const { T, D } = jugTimes(s, f, i); T.forEach(x => add(x, "pop")); Object.keys(D).forEach(k => { add(D[k], "whoosh"); add(D[k] + .7, f.tray ? "pop" : "ping"); }); });

  /* =====================================================================
     plates: plates spin on sticks. Each plate drops on its stick on cue; wobbleCue makes it wobble,
     fallCue makes it crash, spinCue sends the person to re-spin it (wobble stops, sparkle).
     f: headline, highlight, plates:[{label, icon, cue, wobbleCue, fallCue, spinCue, tone}], actor
     ===================================================================== */
  function plateTimes(s, f, idx){ return (f.plates || []).map((p, i) => ({ tIn: p.cue ? at(s, p.cue, .08 + i * .15, idx) : .15 + i * .12,
    tW: p.wobbleCue ? at(s, p.wobbleCue, .5, idx) : null, tF: p.fallCue ? at(s, p.fallCue, .7, idx) : null, tS: p.spinCue ? at(s, p.spinCue, .8, idx) : null })); }
  function wobAmp(m, t){ if (m.tW == null || t < m.tW) return .03; const fix = m.tS != null && m.tS + .9 > m.tW ? m.tS + .9 : null, rise = x => .03 + .37 * clamp((x - m.tW) / 1.4, 0, 1);
    if (fix != null && t > fix) return .03 + (rise(fix) - .03) * (1 - clamp((t - fix) / .5, 0, 1)); return rise(t); }
  function plateDraw(ctx, x, y, tilt, ph, col, sp){
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(1.2, 1.2);
    if (sp > .55){ ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 4; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(0, 0, 118, 36, 0, d > 0 ? .25 : Math.PI + .25, d > 0 ? 1.15 : Math.PI + 1.15); ctx.stroke(); }); }
    ctx.beginPath(); ctx.ellipse(0, 8, 98, 25, 0, 0, TAU); ctx.fillStyle = "rgba(24,21,15,.25)"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, 98, 25, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 1, 64, 14, 0, 0, TAU); ctx.fillStyle = hexA(col, .9); ctx.fill();
    for (let k = 0; k < 7; k++){ const a = ph + k * TAU / 7; if (Math.sin(a) < -.15) continue; ctx.beginPath(); ctx.arc(Math.cos(a) * 82, Math.sin(a) * 19, 6, 0, TAU); ctx.fillStyle = col; ctx.fill(); }
    ctx.restore();
  }
  TT.layout("plates", "Piring berputar", (ctx, th, s, t) => {
    const f = s.f, M = mv(), PL = f.plates || [], n = Math.max(1, PL.length); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const GY = 1290, TOP = 900, xs = PL.map((p, i) => n === 1 ? 620 : n === 2 ? 330 + i * 420 : 210 + i * (660 / (n - 1))), TM = plateTimes(s, f), gap = n > 1 ? xs[1] - xs[0] : 500;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    ground(ctx, th, GY, 110, 970);
    // actor walks to re-spin plates
    const extra = []; PL.forEach((p, i) => { const m = TM[i]; if (m.tS == null) return; extra.push({ at: m.tS, x: xs[i] + (i === n - 1 && n > 1 ? -78 : 78) * (i === 0 ? 1 : -1) }, { at: m.tS + .75, pose: "cheer" }, { at: m.tS + 1.7, pose: (f.actor && f.actor.pose) || "stand" }); });
    const a = withKeys(A(f.actor, n === 3 ? 375 : n === 2 ? 540 : n === 1 ? 420 : 320), extra), st = actorState(a, s, t);
    PL.forEach((p, i) => { const m = TM[i], x = xs[i], col = p.tone === "bad" ? RED : BALLC[i % BALLC.length], fallen = m.tF != null && t >= m.tF, A0 = wobAmp(m, t), tilt = fallen ? 0 : A0 * Math.sin(t * 7.5 + i * 1.3);
      const topX = x + Math.sin(tilt) * 30;
      ctx.strokeStyle = dark(th) ? "#C9A27E" : WOOD; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, GY); ctx.quadraticCurveTo(x, (GY + TOP) / 2, topX, TOP + 8); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, GY, 16, Math.PI, TAU); ctx.fillStyle = dark(th) ? "#6B5A48" : "#544E42"; ctx.fill();
      if (t < m.tIn) return;
      if (!fallen){
        // spin speed integrated so the pattern never jumps
        let ph = 0; for (let u = m.tIn; u < t; u += 1 / 30){ const aw = wobAmp(m, u); ph += (9 * (1 - 1.9 * (aw - .03))) / 30; }
        const sp = 1 - 1.9 * (A0 - .03), q = clamp((t - m.tIn) / .35, 0, 1), py = TOP - (1 - eOut(q)) * 230;
        plateDraw(ctx, topX, py, tilt, ph, col, sp);
        if (m.tS != null && t > m.tS + .9) burst(ctx, topX, TOP, t - m.tS - .9, M, 9);
        burst(ctx, topX, TOP, t - m.tIn - .35, M, 6);
      } else { const u = clamp((t - m.tF) / .6, 0, 1), side = i === n - 1 && n > 1 ? -1 : 1;
        if (u < 1){ const x1 = x + side * 70, y1 = GY - 14; plateDraw(ctx, x + (x1 - x) * u, TOP + (y1 - TOP) * u * u, side * u * 2.2, 0, col, 0); }
        else { const bx = x + side * 70, by = GY - 6; ctx.save(); ctx.translate(bx, by);
          [[-46, -4, -.5], [40, 0, .4]].forEach(([dx, dy, rot]) => { ctx.save(); ctx.translate(dx, dy); ctx.rotate(rot); ctx.beginPath(); ctx.ellipse(0, 0, 50, 13, 0, Math.PI * .05, Math.PI * .95); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); });
          [[-8, -14], [12, -20], [70, -8]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + 10, dy - 6); ctx.lineTo(dx + 14, dy + 4); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); });
          ctx.restore(); burst(ctx, bx, by - 20, t - m.tF - .6, M, 7); } }
      // label tag above the plate
      if (p.label){ const k = popAt(t, m.tIn + .2, .4), wob = A0 > .12 && !fallen, shake = wob ? Math.sin(t * 30) * 3 : 0, mw = Math.min(300, gap - 16);
        scaled(ctx, x, TOP - 100, k, () => { tag(ctx, th, p.label, x + shake, TOP - 100, { size: 34, maxW: mw, lines: 2, icon: p.icon, bg: fallen ? RED : "#FFFFFF", fg: fallen ? "#fff" : INK, stroke: fallen ? null : (wob ? RED : hexA(INK, .2)), lw: wob ? 5 : 3, min: 17 });
          if (wob) emoteAt(ctx, th, "!", x + Math.min(mw / 2, 130) - 6, TOP - 162, t - m.tW, t); }); } });
    const r = drawActor(ctx, th, a, st, t, GY, a.scale || .78);
    overlays(ctx, th, st, r, t, 60);
    ctx.restore();
  }, (s, f, i, add) => { plateTimes(s, f, i).forEach(m => { add(m.tIn + .3, "pop"); if (m.tW != null) add(m.tW, "ping"); if (m.tF != null){ add(m.tF, "whoosh"); add(m.tF + .6, "pop"); } if (m.tS != null) add(m.tS + .9, "chime"); }); });

  /* =====================================================================
     signpost: a crossroads post; arrow boards swing in on cue. The person stands below, looks left/right,
     then on pickCue the chosen board lights up (others dim, "bad" ones get an X) and the person walks that way.
     f: headline, highlight, signs:[{label, icon, cue, dir:"L"|"R", tone}], pickCue + pick (index)
        or picks:[{cue, sign}] (several highlights, no walk), walk (default true for a single pick), actor
     ===================================================================== */
  function signTimes(s, f, idx){ const SG = (f.signs || []).slice(0, 4), T = SG.map((g, i) => at(s, g.cue, .08 + i * .16, idx));
    const picks = (f.picks || (f.pickCue ? [{ cue: f.pickCue, sign: f.pick || 0 }] : [])).map((p, k) => Object.assign({}, p, { T: at(s, p.cue, .75 + k * .1, idx) })).sort((p, q) => p.T - q.T);
    return { SG, T, picks }; }
  function board(ctx, th, g, y, ang, glow, dim, t){
    const L = g.dir === "L" ? -1 : 1, w = 420, h = 96, tip = 50;
    ctx.save(); ctx.translate(540 + L * 12, y); ctx.rotate(ang); if (dim) ctx.globalAlpha *= .42;
    const path = () => { ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.lineTo(L * (w - tip), -h / 2); ctx.lineTo(L * w, 0); ctx.lineTo(L * (w - tip), h / 2); ctx.lineTo(0, h / 2); ctx.closePath(); };
    ctx.save(); ctx.translate(6, 8); path(); ctx.fillStyle = "rgba(24,21,15,.22)"; ctx.fill(); ctx.restore();
    const GC = g.tone === "bad" ? RED : GREEN;
    if (glow){ ctx.save(); ctx.shadowColor = hexA(GC, .8); ctx.shadowBlur = 30 + 10 * Math.sin(t * 6); path(); ctx.fillStyle = GC; ctx.fill(); ctx.restore(); }
    path(); ctx.fillStyle = glow ? GC : g.tone === "bad" ? "#F6D9CC" : "#F8E6CC"; ctx.fill(); ctx.strokeStyle = glow ? (g.tone === "bad" ? "#7A2A10" : "#1F6B42") : "#5A3A22"; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = glow ? "rgba(255,255,255,.25)" : "rgba(142,78,46,.18)"; ctx.lineWidth = 3; [-.2, .2].forEach(v => { ctx.beginPath(); ctx.moveTo(L * 10, v * h); ctx.lineTo(L * (w - tip - 6), v * h); ctx.stroke(); });
    [[L * 22, 0]].forEach(([nx, ny]) => { ctx.beginPath(); ctx.arc(nx, ny, 6, 0, TAU); ctx.fillStyle = "#5A3A22"; ctx.fill(); });
    const a0 = L < 0 ? -(w - tip) + 8 : 38, a1 = L < 0 ? -38 : (w - tip) - 8, fg = glow ? "#FFFFFF" : INK; let tx0 = a0;
    if (g.icon){ const ix = L < 0 ? a0 + 4 : a0 + 2; icon(ctx, g.icon, ix, -20, 40, glow ? "#fff" : "#C2691F", 2.6); tx0 = ix + 50; }
    const mw = a1 - tx0; textBlock(ctx, th, g.label || "", tx0 + mw / 2, 0, mw, 36, 2, fg, 800, 17);
    ctx.restore();
  }
  TT.layout("signpost", "Papan penunjuk arah", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { SG, T, picks } = signTimes(s, f), GY = 1290, PX = 540, picked = {}; let lastPick = null;
    picks.forEach(p => { if (t >= p.T){ picked[p.sign] = p.T; lastPick = p; } }); const any = lastPick != null;
    const walk = picks.length === 1 && f.walk !== false;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // forked road
    ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.12)" : "rgba(59,36,24,.1)"; ctx.lineWidth = 64; ctx.lineCap = "round";
    [[-1], [1]].forEach(([d]) => { ctx.beginPath(); ctx.moveTo(PX, 1322); ctx.quadraticCurveTo(PX + d * 120, GY - 20, PX + d * 420, GY - 40); ctx.stroke(); });
    ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.35)" : "rgba(255,255,255,.75)"; ctx.lineWidth = 5; ctx.setLineDash([22, 18]); ctx.lineDashOffset = -t * 20;
    [[-1], [1]].forEach(([d]) => { ctx.beginPath(); ctx.moveTo(PX, 1322); ctx.quadraticCurveTo(PX + d * 120, GY - 20, PX + d * 420, GY - 40); ctx.stroke(); }); ctx.setLineDash([]);
    // pole
    ctx.fillStyle = "rgba(24,21,15,.25)"; ctx.beginPath(); ctx.ellipse(PX + 10, GY + 2, 50, 10, 0, 0, TAU); ctx.fill();
    rr(ctx, PX - 13, 600, 26, GY - 600, 8); ctx.fillStyle = dark(th) ? "#9C7452" : "#6B4A33"; ctx.fill();
    ctx.beginPath(); ctx.arc(PX, 600, 20, 0, TAU); ctx.fillStyle = "#C2691F"; ctx.fill();
    SG.forEach((g, k) => { if (t < T[k]) return; const L = g.dir === "L" ? -1 : 1, u = t - T[k], y = 655 + k * (SG.length > 3 ? 106 : 125);
      const ang = -L * .34 * Math.exp(-4 * u) * Math.cos(9 * u) + .012 * Math.sin(t * 1.4 + k);
      const glow = picked[k] != null, dim = any && !glow;
      ctx.save(); ctx.globalAlpha *= clamp(u / .15, 0, 1); board(ctx, th, g, y, ang, glow, dim, t); ctx.restore();
      const bx = 540 + L * 12 + L * 366;
      if (glow){ const q = popAt(t, picked[k] + .1, .35); scaled(ctx, bx, y - 46, q, () => g.tone === "bad" ? crossDisc(ctx, bx, y - 46, 24) : checkDisc(ctx, bx, y - 46, 24)); if (g.tone !== "bad") burst(ctx, bx, y, t - picked[k], M, 8); }
      else if (any && g.tone === "bad"){ const q = popAt(t, lastPick.T + .2, .35); scaled(ctx, bx, y - 46, q, () => crossDisc(ctx, bx, y - 46, 22)); } });
    // person at the crossroads
    const extra = []; if (walk){ const g = SG[picks[0].sign] || {}; extra.push({ at: picks[0].T + .5, x: g.dir === "L" ? 215 : 865, speed: 230 }); }
    const a = withKeys(A(f.actor, PX - (f.actor && f.actor.x == null ? 0 : 0)), extra), st = actorState(a, s, t);
    if (!any && !st.walking && f.look !== false && SG.length > 1 && t > (T[1] || 0)) st.face = Math.sin(t * 1.7) > 0 ? 1 : -1;
    const r = drawActor(ctx, th, a, st, t, GY, a.scale || (SG.length > 3 ? .62 : .74));
    overlays(ctx, th, st, r, t, 62);
    ctx.restore();
  }, (s, f, i, add) => { const { T, picks } = signTimes(s, f, i); T.forEach(x => add(x, "whoosh")); picks.forEach(p => add(p.T + .1, "chime")); });

  /* =====================================================================
     toss: a person flips a coin (or rolls a die) on cue; it spins through the air and lands showing a face,
     with a result tag. Earlier results shrink into a small history row.
     f: headline, highlight, kind:"coin"|"dice", faces:{a, b} (coin text), tosses:[{cue, face ("a"|"b" or 1-6), label, tone}], actor
     ===================================================================== */
  const COINC = { a: ["#E8A317", "#A86A12", "#5A3410"], b: ["#D9D2C5", "#8C8476", "#2B2118"] };
  function coinDraw(ctx, th, x, y, r, sy, side, txt){ const c = COINC[side] || COINC.a;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, Math.max(.07, Math.abs(sy)));
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = c[0]; ctx.fill(); ctx.strokeStyle = c[1]; ctx.lineWidth = r * .1; ctx.stroke();
    ctx.setLineDash([r * .08, r * .07]); ctx.lineWidth = r * .04; ctx.beginPath(); ctx.arc(0, 0, r * .8, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(-r * .35, -r * .4, r * .25, r * .14, -.6, 0, TAU); ctx.fill();
    if (Math.abs(sy) > .35 && txt) textBlock(ctx, th, txt, 0, 0, r * 1.35, Math.round(r * .42), 2, c[2], 900, 12);
    ctx.restore(); }
  const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  function dieDraw(ctx, x, y, sz, rot, n){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    rr(ctx, -sz / 2 + 6, -sz / 2 + 8, sz, sz, sz * .2); ctx.fillStyle = "rgba(24,21,15,.25)"; ctx.fill();
    rr(ctx, -sz / 2, -sz / 2, sz, sz, sz * .2); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = sz * .04; ctx.stroke();
    (PIPS[n] || PIPS[1]).forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px * sz * .27, py * sz * .27, sz * .085, 0, TAU); ctx.fillStyle = n === 1 ? RED : INK; ctx.fill(); });
    ctx.restore(); }
  function tossTimes(s, f, idx){ return (f.tosses || []).map((x, i) => Object.assign({}, x, { T: at(s, x.cue, .12 + i * .28, idx) })).sort((p, q) => p.T - q.T); }
  TT.layout("toss", "Lempar koin / dadu", (ctx, th, s, t) => {
    const f = s.f, M = mv(), dice = f.kind === "dice", faces = f.faces || { a: "A", b: "B" }; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const TS = tossTimes(s, f), GY = 1290, AX = 230, SC = .76, LX = 720, LY = 1010, FD = 1.05;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    ground(ctx, th, GY, 110, 970);
    const extra = []; TS.forEach(x => extra.push({ at: x.T - .3, pose: "thumbs" }, { at: x.T + .45, pose: (f.actor && f.actor.pose) || "stand" }));
    const a = withKeys(A(f.actor, AX), extra), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, GY, a.scale || SC);
    const hx = st.x + 100 * (a.scale || SC), hy = GY - 310 * (a.scale || SC);
    const faceTxt = x => dice ? "" : x.text != null ? x.text : (faces[x.face] != null ? faces[x.face] : String(x.face || ""));
    // history: earlier results
    const past = TS.filter((x, k) => TS[k + 1] && t >= TS[k + 1].T);
    past.slice(-3).forEach((x, j, arr) => { const k = TS.indexOf(x), nxt = TS[k + 1].T, u = easeIO(clamp((t - nxt) / .5, 0, 1)), slot = arr.length - 1 - j, sx = 925 - slot * 128, sy = 622;
      const px = LX + (sx - LX) * u, py = LY + (sy - LY) * u, rad = (dice ? 70 : 118) + ((dice ? 34 : 42) - (dice ? 70 : 118)) * u;
      if (dice) dieDraw(ctx, px, py, rad * 2, 0, +x.face || 1); else coinDraw(ctx, th, px, py, rad, 1, x.face === "b" ? "b" : "a", faceTxt(x));
      if (u >= 1 && x.label){ ctx.save(); ctx.globalAlpha *= clamp((t - nxt - .5) / .3, 0, 1); tag(ctx, th, x.label, sx, sy + 68, { size: 20, maxW: 124, lines: 2, bg: toneBg(x.tone), fg: toneFg(x.tone), min: 12, rad: 14 }); ctx.restore(); } });
    // current toss
    const cur = TS.filter(x => t >= x.T - .05).pop();
    if (cur){ const k = TS.indexOf(cur), u = clamp((t - cur.T) / FD, 0, 1), side = cur.face === "b" ? "b" : "a";
      let x, y, rad, sy = 1, sd = side;
      if (u < 1){ x = hx + (LX - hx) * u; y = hy + (LY - hy) * u - 4 * 400 * u * (1 - u); rad = 70 + 48 * u;
        const flips = side === "a" ? 10 : 9, c = Math.cos(u * flips * Math.PI); sy = c; sd = c >= 0 ? "a" : "b"; }
      else { const dt = t - cur.T - FD; x = LX; y = LY - Math.abs(Math.sin(dt * 10)) * 26 * Math.exp(-dt * 6); rad = 118; sy = side === "a" ? 1 : -1; }
      const hgt = clamp((GY - y) / 700, 0, 1); ctx.fillStyle = "rgba(24,21,15,.18)"; ctx.beginPath(); ctx.ellipse(x, GY + 2, 70 * (1 - hgt * .6), 11 * (1 - hgt * .6), 0, 0, TAU); ctx.fill();
      if (dice){ const n = u < 1 ? 1 + hsh(k * 31 + Math.floor(u * 14)) % 6 : (+cur.face || 1); dieDraw(ctx, x, y, rad * 1.3, u < 1 ? u * 4 * Math.PI : 0, n); }
      else coinDraw(ctx, th, x, y, rad, sy, sd, sd === side ? faceTxt(cur) : (faces[sd] != null ? faces[sd] : ""));
      if (u >= 1){ burst(ctx, LX, LY, t - cur.T - FD, M, 9);
        if (cur.label){ const q = popAt(t, cur.T + FD + .15, .4); scaled(ctx, LX, 1200, q, () => tag(ctx, th, cur.label, clamp(LX, 330, 750), 1200, { size: 40, maxW: 480, lines: 2, bg: toneBg(cur.tone), fg: toneFg(cur.tone), stroke: cur.tone ? null : hexA(INK, .2), lw: 3, icon: cur.icon })); } } }
    overlays(ctx, th, st, r, t, 60);
    ctx.restore();
  }, (s, f, i, add) => { tossTimes(s, f, i).forEach(x => { add(x.T, "whoosh"); add(x.T + 1.05, x.tone === "bad" ? "ping" : "pop"); }); });

  /* =====================================================================
     vending: a vending machine. On each buy cue the person walks up, drops N coins into the slot (LCD counts),
     the chosen item turns on its coil, falls into the tray and pops out as a result card on the left (with ×N coins).
     f: headline, highlight, title (machine header), items:[{label, icon}] (≤6), buys:[{cue, coins, pick, out, icon, tone}], actor
     ===================================================================== */
  const VM = { X0: 530, X1: 930, T: 590, B: 1250, WX0: 668, WX1: 910, WY0: 700, WY1: 1078, SX: 600, SY: 832 };
  function vendTimes(s, f, idx){ return (f.buys || []).map((b, i) => { const T = at(s, b.cue, .12 + i * .3, idx), n = Math.max(1, b.coins || 1), c0 = T + .5, push = c0 + n * .16 + .2;
    return Object.assign({}, b, { T, n, c0, push, fall: push + .3, land: push + .7, tOut: push + 1.05, card: push + 1.5 }); }); }
  const cellXY = i => [VM.WX0 + 60.5 + (i % 2) * 121, VM.WY0 + 58 + Math.floor(i / 2) * 126];
  function vItem(ctx, th, it, x, y, sc, i, withLabel){ ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.beginPath(); ctx.arc(0, -16, 32, 0, TAU); ctx.fillStyle = it.tone === "bad" ? RED : BALLC[i % BALLC.length]; ctx.fill(); ctx.strokeStyle = "rgba(43,26,18,.4)"; ctx.lineWidth = 3; ctx.stroke();
    icon(ctx, it.icon || "star", -19, -35, 38, "#fff", 2.4);
    if (withLabel && it.label) textBlock(ctx, th, it.label, 0, 36, 108, 21, 2, INK, 800, 13);
    ctx.restore(); }
  TT.layout("vending", "Mesin penjual otomatis", (ctx, th, s, t) => {
    const f = s.f, M = mv(), IT = (f.items || []).slice(0, 6); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const BT = vendTimes(s, f), GY = 1290, SC = .74;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    ground(ctx, th, GY, 110, 970);
    // machine body
    ctx.fillStyle = "rgba(24,21,15,.22)"; rr(ctx, VM.X0 + 14, VM.T + 14, VM.X1 - VM.X0, VM.B - VM.T, 30); ctx.fill();
    ctx.fillStyle = "#3B2418"; ctx.fillRect(VM.X0 + 30, VM.B - 10, 40, GY - VM.B + 6); ctx.fillRect(VM.X1 - 70, VM.B - 10, 40, GY - VM.B + 6);
    rr(ctx, VM.X0, VM.T, VM.X1 - VM.X0, VM.B - VM.T, 30); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.12)"; rr(ctx, VM.X0 + 10, VM.T + 10, 24, VM.B - VM.T - 20, 12); ctx.fill();
    rr(ctx, VM.X0 + 22, VM.T + 18, VM.X1 - VM.X0 - 44, 66, 18); ctx.fillStyle = "#3B2418"; ctx.fill();
    for (let k = 0; k < 8; k++){ const on = Math.floor(t * 4 + k) % 2 === 0; ctx.beginPath(); ctx.arc(VM.X0 + 50 + k * 43, VM.T + 26, 4, 0, TAU); ctx.fillStyle = on ? "#FFD27A" : "rgba(255,210,122,.25)"; ctx.fill(); }
    textBlock(ctx, th, f.title || "MESIN", (VM.X0 + VM.X1) / 2, VM.T + 56, VM.X1 - VM.X0 - 90, 30, 1, "#FFF7EE", 900, 16);
    // window
    rr(ctx, VM.WX0 - 6, VM.WY0 - 6, VM.WX1 - VM.WX0 + 12, VM.WY1 - VM.WY0 + 12, 18); ctx.fillStyle = "#3B2418"; ctx.fill();
    rr(ctx, VM.WX0, VM.WY0, VM.WX1 - VM.WX0, VM.WY1 - VM.WY0, 14); ctx.fillStyle = "#FDF6EC"; ctx.fill();
    const active = BT.filter(b => t >= b.push && t < b.tOut).pop();
    IT.forEach((it, i) => { const [cx, cy] = cellXY(i);
      ctx.strokeStyle = "#B8AE9D"; ctx.lineWidth = 4; ctx.beginPath(); const spin = active && (active.pick || 0) === i ? (t - active.push) * 14 : 0;
      for (let k = 0; k <= 16; k++){ const xx = cx - 46 + k * 5.75, yy = cy + 56 + Math.sin(k * 1.2 + spin) * 6; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
      const busy = BT.find(b => (b.pick || 0) === i && t >= b.push && t < b.tOut + .9);
      if (busy){ const u = clamp((t - busy.push) / .4, 0, 1); if (t < busy.fall) vItem(ctx, th, it, cx, cy + u * 6, 1 + .08 * u, i, true);
        else if (t > busy.tOut){ ctx.save(); ctx.globalAlpha *= clamp((t - busy.tOut - .2) / .6, 0, 1); vItem(ctx, th, it, cx, cy, 1, i, true); ctx.restore(); } }
      else vItem(ctx, th, it, cx, cy, 1, i, true); });
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.save(); rr(ctx, VM.WX0, VM.WY0, VM.WX1 - VM.WX0, VM.WY1 - VM.WY0, 14); ctx.clip();
    ctx.beginPath(); ctx.moveTo(VM.WX0 + 30, VM.WY0); ctx.lineTo(VM.WX0 + 80, VM.WY0); ctx.lineTo(VM.WX0 - 40, VM.WY1); ctx.lineTo(VM.WX0 - 90, VM.WY1); ctx.fill(); ctx.restore();
    // falling item (inside the glass)
    BT.forEach(b => { if (t < b.fall || t >= b.tOut) return; const it = IT[b.pick || 0] || { label: b.out, icon: b.icon }, [cx, cy] = cellXY(b.pick || 0), u = clamp((t - b.fall) / .4, 0, 1), dt = t - b.land;
      const y = cy + (1150 - cy) * u * u - (dt > 0 ? Math.abs(Math.sin(dt * 12)) * 16 * Math.exp(-dt * 6) : 0); vItem(ctx, th, it, cx + (785 - cx) * u, y, .8, b.pick || 0, false); });
    // panel: LCD, coin slot, keypad
    rr(ctx, 552, 708, 96, 62, 12); ctx.fillStyle = "#18150f"; ctx.fill();
    const cb = BT.filter(b => t >= b.T && t < b.card + .6).pop(); let lcd = f.lcd || "--";
    if (cb){ const n = clamp(Math.floor((t - cb.c0 - .32) / .16) + 1, 0, cb.n); lcd = n > 0 ? `×${n}` : "0"; }
    textBlock(ctx, th, lcd, 600, 740, 80, 34, 1, "#FFB766", 900, 16);
    const slotGlow = BT.some(b => t >= b.c0 && t < b.c0 + b.n * .16 + .35);
    rr(ctx, 584, 796, 32, 72, 10); ctx.fillStyle = slotGlow ? "#FFD27A" : "#3B2418"; ctx.fill(); rr(ctx, 594, 806, 12, 52, 6); ctx.fillStyle = "#18150f"; ctx.fill();
    for (let k = 0; k < 9; k++){ const px = 568 + (k % 3) * 32, py = 912 + Math.floor(k / 3) * 32, pr = BT.some(b => t >= b.push - .2 && t < b.push + .2 && ((b.pick || 0) + 2) % 9 === k);
      ctx.beginPath(); ctx.arc(px, py, 11, 0, TAU); ctx.fillStyle = pr ? "#FFD27A" : "#FFF7EE"; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 2; ctx.stroke(); }
    // tray
    rr(ctx, 672, 1112, 232, 86, 16); ctx.fillStyle = "#18150f"; ctx.fill(); rr(ctx, 672, 1112, 232, 28, 12); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fill();
    // person
    const extra = []; BT.forEach((b, k) => { if (k === 0) extra.push({ at: b.T, x: 400 }); extra.push({ at: b.c0 - .15, pose: "point" }, { at: b.push, pose: (f.actor && f.actor.pose) || "stand" }, { at: b.card, expr: b.tone === "bad" ? "worried" : "happy" }); });
    const a = withKeys(A(f.actor, 240), extra), st = actorState(a, s, t), sc = a.scale || SC, r = drawActor(ctx, th, a, st, t, GY, sc);
    // coins into the slot
    const hx = st.x + 182 * sc, hy = GY - 308 * sc;
    BT.forEach(b => { for (let k = 0; k < b.n; k++){ const t0 = b.c0 + k * .16, u = (t - t0) / .32; if (u < 0 || u > 1) continue;
      const x = hx + (VM.SX - hx) * u, y = hy + (VM.SY - hy) * u - Math.sin(u * Math.PI) * 120; coinDraw(ctx, th, x, y, 20, Math.cos(u * 6), "a", ""); } });
    // result cards on the left
    BT.forEach((b, j) => { if (t < b.tOut) return; const it = IT[b.pick || 0] || {}, lab = b.out || it.label, ic = b.icon || it.icon || "star";
      const cy = 645 + j * 118, u = clamp((t - b.tOut) / .45, 0, 1);
      if (u < 1){ const x = 785 + (295 - 785) * easeIO(u), y = 1150 + (cy - 1150) * u - Math.sin(u * Math.PI) * 140; vItem(ctx, th, Object.assign({}, it, { icon: ic, tone: b.tone }), x, y, .8 + .3 * u, b.pick || 0, false); return; }
      const q = popAt(t, b.card - .05, .35);
      scaled(ctx, 295, cy, q, () => { rr(ctx, 95, cy - 50, 400, 100, 24); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = b.tone === "bad" ? RED : b.tone === "good" ? GREEN : INK; ctx.lineWidth = 4; ctx.stroke();
        ctx.beginPath(); ctx.arc(145, cy, 30, 0, TAU); ctx.fillStyle = b.tone === "bad" ? RED : b.tone === "good" ? GREEN : BALLC[(b.pick || 0) % BALLC.length]; ctx.fill(); icon(ctx, ic, 127, cy - 18, 36, "#fff", 2.4);
        coinDraw(ctx, th, 418, cy, 17, 1, "a", ""); font(ctx, 900, 28, th.fam); ctx.fillStyle = INK; ctx.fillText(`×${b.n}`, 440, cy + 10);
        const fl = fitLines(ctx, th, lab || "", 222, 29, 2, 800, 16); font(ctx, 800, fl.z, th.fam); ctx.fillStyle = INK;
        fl.L.forEach((l, k) => ctx.fillText(l, 186, cy + fl.z * .36 + (k - (fl.L.length - 1) / 2) * fl.z * 1.1)); });
      burst(ctx, 295, cy, t - b.card, M, 7); });
    overlays(ctx, th, st, r, t, 58);
    ctx.restore();
  }, (s, f, i, add) => { vendTimes(s, f, i).forEach(b => { for (let k = 0; k < b.n; k++) add(b.c0 + k * .16 + .32, "ping"); add(b.land, "pop"); add(b.card, b.tone === "bad" ? "pop" : "chime"); }); });

  /* =====================================================================
     canphone: two people talk through tin cans on a string. On each message cue the sender talks,
     a pulse travels along the (vibrating) string and the message pops up as a card above (left/right aligned).
     f: headline, highlight, left:{actor fields, name, keys}, right:{...}, msgs:[{cue, from:"L"|"R", text, tone:"good"|"bad"|"open"|"closed", tag}]
     ===================================================================== */
  function canTimes(s, f, idx){ return (f.msgs || []).map((m, i) => Object.assign({}, m, { T: at(s, m.cue, .1 + i * .2, idx) })).sort((p, q) => p.T - q.T); }
  function canDraw(ctx, x, y, d){ ctx.save(); ctx.translate(x, y); ctx.rotate(d * .35);
    rr(ctx, -20, -30, 40, 60, 6); const g = ctx.createLinearGradient(-20, 0, 20, 0); g.addColorStop(0, "#9C978E"); g.addColorStop(.45, "#ECE8E1"); g.addColorStop(1, "#8C8476"); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "#544E42"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#C2691F"; ctx.fillRect(-20, -8, 40, 16); ctx.restore(); }
  TT.layout("canphone", "Telepon kaleng", (ctx, th, s, t) => {
    const f = s.f, M = mv(), MS = canTimes(s, f); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const GY = 1275, SC = .74, LX = 205, RX = 875;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    ground(ctx, th, GY, 110, 970);
    const speaking = side => MS.find(m => m.from === side && t >= m.T && t < m.T + (m.dur || 1.7));
    const mk = (cfg, x, side) => { const a = A(cfg, x, side === "R" ? { hair: "hijab", hijab: "#A0522D", shirt: "#E89544", skin: "b" } : null), st = actorState(a, s, t); st.pose = "think"; if (speaking(side)) st.say = "…"; return { a, st }; };
    const L = mk(f.left, LX, "L"), R = mk(f.right, RX, "R");
    const rL = figure(ctx, th, L.a, L.st, t, GY, L.a.scale || SC, false), rR = figure(ctx, th, R.a, R.st, t, GY, R.a.scale || SC, true);
    const scL = L.a.scale || SC, scR = R.a.scale || SC, cL = [L.st.x + 50 * scL, GY - 330 * scL], cR = [R.st.x - 50 * scR, GY - 330 * scR];
    // string
    const P0 = [cL[0] + 18, cL[1] + 18], P1 = [cR[0] - 18, cR[1] + 18], live = MS.find(m => t >= m.T && t < m.T + 1.1), sag = live ? 40 : 110 + Math.sin(t * 1.3) * 6;
    const C = [(P0[0] + P1[0]) / 2, Math.max(P0[1], P1[1]) + sag], B = u => [(1 - u) * (1 - u) * P0[0] + 2 * (1 - u) * u * C[0] + u * u * P1[0], (1 - u) * (1 - u) * P0[1] + 2 * (1 - u) * u * C[1] + u * u * P1[1]];
    ctx.strokeStyle = dark(th) ? "#E6D6C2" : "#8E4E2E"; ctx.lineWidth = 4; ctx.beginPath();
    for (let k = 0; k <= 40; k++){ const u = k / 40, [x, y] = B(u), v = live ? Math.sin(u * 40 - t * 30) * 5 * Math.sin(u * Math.PI) : 0; k ? ctx.lineTo(x, y + v) : ctx.moveTo(x, y + v); } ctx.stroke();
    canDraw(ctx, cL[0], cL[1], 1); canDraw(ctx, cR[0], cR[1], -1);
    MS.forEach(m => { const q = (t - m.T - .1) / .9; if (q < 0 || q > 1) return; const u = m.from === "R" ? 1 - q : q, [x, y] = B(u), col = m.tone === "bad" ? RED : m.tone === "good" ? GREEN : "#F4A85C";
      const g = ctx.createRadialGradient(x, y, 0, x, y, 40); g.addColorStop(0, hexA(col, .9)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 40, 0, TAU); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 4; for (let k = 0; k < 2; k++){ const rr2 = 18 + k * 14 + (t * 40 % 14); ctx.globalAlpha *= .8; ctx.beginPath(); ctx.arc(x, y, rr2, -.8, .8); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, rr2, Math.PI - .8, Math.PI + .8); ctx.stroke(); } ctx.globalAlpha = 1; });
    // name tags
    [[f.left, LX], [f.right, RX]].forEach(([c, x]) => { if (c && c.name) tag(ctx, th, c.name, x, 1305, { size: 25, maxW: 300, bg: "#FFFFFF", stroke: hexA(INK, .2), lw: 3 }); });
    // message cards (newest at the bottom, older slide up)
    const shown = MS.filter(m => t >= m.T + .25), BOT = 905, TOPY = 575; let y = BOT;
    const cards = shown.map(m => { const fl = fitLines(ctx, th, m.text || "", 600, 36, 3, 700, 20), h = fl.L.length * fl.z * 1.18 + 40 + (m.tag ? 34 : 0); return { m, fl, h }; });
    for (let k = cards.length - 1; k >= 0; k--){ const c = cards[k], isNew = k === cards.length - 1, q = popAt(t, c.m.T + .25, .4);
      const shift = !isNew ? 0 : 0; const y1 = y - shift, y0 = y1 - c.h; y = y0 - 18; if (y1 < TOPY + 30) break;
      const alpha = clamp((y0 - TOPY + 60) / 80, 0, 1), fromL = c.m.from !== "R";
      const w = Math.max(...c.fl.L.map(l => { font(ctx, 700, c.fl.z, th.fam); return ctx.measureText(l).width; }), c.m.tag ? 160 : 60) + 56, x0 = fromL ? 100 : 980 - w;
      ctx.save(); ctx.globalAlpha *= alpha; scaled(ctx, fromL ? x0 + 30 : x0 + w - 30, y1, isNew ? q : 1, () => {
        ctx.fillStyle = "rgba(24,21,15,.18)"; rr(ctx, x0 + 6, y0 + 8, w, c.h, 24); ctx.fill();
        ctx.beginPath(); ctx.roundRect(x0, y0, w, c.h, 24); const tx = fromL ? x0 + 46 : x0 + w - 46; ctx.moveTo(tx - 14, y1 - 2); ctx.lineTo(tx + (fromL ? -18 : 18), y1 + 24); ctx.lineTo(tx + 14, y1 - 2);
        ctx.fillStyle = fromL ? "#FFFFFF" : "#FCE1C6"; ctx.fill(); ctx.strokeStyle = c.m.tone === "bad" ? RED : c.m.tone === "good" ? GREEN : c.m.tone === "open" ? "#C2691F" : INK; ctx.lineWidth = c.m.tone ? 5 : 3.5; ctx.stroke();
        let ty = y0 + 26; if (c.m.tag){ const tb = c.m.tone === "bad" ? RED : c.m.tone === "good" ? GREEN : c.m.tone === "closed" ? "#8C8476" : "#C2691F"; tag(ctx, th, c.m.tag, x0 + 28, ty + 10, { align: "left", size: 21, bg: tb, fg: "#fff", maxW: w - 50, rad: 14 }); ty += 34; }
        font(ctx, 700, c.fl.z, th.fam); ctx.fillStyle = INK; c.fl.L.forEach((l, j) => ctx.fillText(l, x0 + 28, ty + c.fl.z * .95 + j * c.fl.z * 1.18));
        if (c.m.tone === "good") checkDisc(ctx, x0 + w - 8, y0 + 8, 20); if (c.m.tone === "bad") crossDisc(ctx, x0 + w - 8, y0 + 8, 20); });
      ctx.restore(); }
    overlays(ctx, th, L.st, rL, t, 60, true); overlays(ctx, th, R.st, rR, t, -60, true);
    ctx.restore();
  }, (s, f, i, add) => { canTimes(s, f, i).forEach(m => { add(m.T + .1, "whoosh"); add(m.T + .3, m.tone === "good" ? "chime" : m.tone === "bad" ? "ping" : "pop"); }); });

  /* =====================================================================
     hive: a honeycomb; a bee flies cell to cell and fills them with honey. Each fill cue fills cells up to `to`
     (cumulative) and pops a milestone tag under the comb. Optional per-cell labels and a counter pill.
     f: headline, highlight, cells: N | [{label, icon}], cols, fills:[{cue, to, tag, icon, tone}], counter:{suffix}
     ===================================================================== */
  function hiveTimes(s, f, idx){ let prev = 0, tPrev = -9; return (f.fills || []).map((x, i) => { const T = Math.max(at(s, x.cue, .15 + i * .25, idx), tPrev + .1), from = prev, to = Math.max(prev, x.to || prev + 1); prev = to;
    const step = Math.min(.32, 1.6 / Math.max(1, to - from)), cells = []; for (let c = from; c < to; c++) cells.push({ c, T: T + .25 + (c - from) * step }); tPrev = T + .25 + (to - from) * step;
    return Object.assign({}, x, { T, from, to, cells, done: T + .25 + (to - from) * step + .3 }); }); }
  function hexPath(ctx, x, y, R){ ctx.beginPath(); for (let k = 0; k < 6; k++){ const a = Math.PI / 6 + k * Math.PI / 3; ctx.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R); } ctx.closePath(); }
  function beeDraw(ctx, x, y, t, face){ ctx.save(); ctx.translate(x, y); ctx.scale(face || 1, 1);
    const wf = Math.abs(Math.sin(t * 38)); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.strokeStyle = "rgba(43,26,18,.5)"; ctx.lineWidth = 2;
    [[-6, -1], [8, 1]].forEach(([dx, d]) => { ctx.beginPath(); ctx.ellipse(dx, -22, 12, 20 * (.4 + .6 * wf), d * .3, 0, TAU); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 21, 0, 0, TAU); ctx.fillStyle = "#F4B63F"; ctx.fill(); ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 30, 21, 0, 0, TAU); ctx.clip(); ctx.fillStyle = "#2B1A12"; [-10, 4].forEach(sx => ctx.fillRect(sx, -22, 7, 44)); ctx.restore();
    ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-40, 3); ctx.lineTo(-30, 6); ctx.fillStyle = "#2B1A12"; ctx.fill();
    ctx.beginPath(); ctx.arc(28, -4, 12, 0, TAU); ctx.fillStyle = "#2B1A12"; ctx.fill(); ctx.beginPath(); ctx.arc(32, -7, 3.5, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill();
    ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(30, -14); ctx.quadraticCurveTo(34, -28, 42, -30); ctx.stroke();
    ctx.restore(); }
  TT.layout("hive", "Sarang lebah", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const CL = Array.isArray(f.cells) ? f.cells : Array.from({ length: f.cells || 6 }, () => ({})), n = CL.length;
    const cols = f.cols || (n <= 3 ? n : n === 4 ? 2 : n <= 6 ? 3 : n <= 12 ? 4 : 5), rows = Math.ceil(n / cols);
    const R = Math.min(720 / ((cols + (rows > 1 ? .5 : 0)) * Math.sqrt(3)), 470 / (1.5 * (rows - 1) + 2), 135), hw = Math.sqrt(3) * R;
    const top = f.counter ? 655 : 610, gh = 1.5 * R * (rows - 1) + 2 * R, cy0 = top + (520 - gh) / 2 + R + (f.counter ? 0 : 20);
    const pos = c => { const row = Math.floor(c / cols), col = c % cols, inRow = Math.min(cols, n - row * cols), off = (row % 2 ? hw / 2 : 0) - (rows > 1 ? hw / 4 : 0);
      return [540 - (inRow - 1) * hw / 2 + col * hw + off, cy0 + row * 1.5 * R]; };
    const FT = hiveTimes(s, f), cellT = {}; FT.forEach(x => x.cells.forEach(c => { cellT[c.c] = { T: c.T, fill: x }; }));
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    let filled = 0;
    CL.forEach((cell, c) => { const [x, y] = pos(c), ct = cellT[c], q = ct ? clamp((t - ct.T) / .55, 0, 1) : 0, sh = popAt(t, .05 + c * .05, .4); if (q >= 1) filled++;
      scaled(ctx, x, y, sh, () => {
        hexPath(ctx, x + 5, y + 7, R - 4); ctx.fillStyle = "rgba(24,21,15,.2)"; ctx.fill();
        hexPath(ctx, x, y, R - 4); ctx.fillStyle = "#FFF7EE"; ctx.fill();
        if (q > 0){ ctx.save(); hexPath(ctx, x, y, R - 4); ctx.clip(); const lvl = y + R - 2 * R * eOut(q), col = ct.fill.tone === "bad" ? ["#F08A5D", "#D84315"] : ["#F9C74F", "#E8A317"];
          const g = ctx.createLinearGradient(0, y - R, 0, y + R); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]); ctx.fillStyle = g;
          ctx.beginPath(); ctx.moveTo(x - R, y + R); for (let k = 0; k <= 12; k++){ const xx = x - R + k * R / 6; ctx.lineTo(xx, lvl + Math.sin(k * 1.3 + t * 5) * (q < 1 ? 5 : 1.5)); } ctx.lineTo(x + R, y + R); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(x - R * .35, y - R * .35, R * .16, R * .08, -.6, 0, TAU); ctx.fill(); ctx.restore(); }
        hexPath(ctx, x, y, R - 4); ctx.strokeStyle = "#B8862B"; ctx.lineWidth = Math.max(5, R * .08); ctx.stroke();
        const full = q >= 1, lab = cell.label, fg = full ? "#3B2418" : INK;
        if (cell.icon || lab){ const hasL = !!lab, iz = R * (hasL ? .42 : .7);
          if (cell.icon) icon(ctx, cell.icon, x - iz / 2, y - (hasL ? R * .52 : iz / 2), iz, full ? "#3B2418" : hexA(INK, .55), 2.4);
          if (hasL) textBlock(ctx, th, lab, x, y + (cell.icon ? R * .22 : 0), R * 1.4, Math.round(R * .27), 2, full ? fg : hexA(INK, .6), 800, 13); }
        else if (full) checkDisc(ctx, x, y, R * .28, "#8E4E2E"); });
      if (ct) burst(ctx, x, y, t - ct.T - .55, M, 6); });
    // counter pill
    if (f.counter){ const tot = f.counter.total || n, nf = FT.filter(x => t >= x.done - .3).map(x => x.to).pop() || f.counter.start || 0, txt = `${nf}/${tot}${f.counter.suffix || ""}`;
      tag(ctx, th, txt, 540, 600, { size: 34, bg: "#3B2418", fg: "#FFD27A", icon: f.counter.icon }); }
    // milestone tag
    const cur = FT.filter(x => t >= x.done).pop();
    if (cur && cur.tag){ const q = popAt(t, cur.done, .4), ty = Math.min(1215, cy0 + (rows - 1) * 1.5 * R + R + 62);
      scaled(ctx, 540, ty, q, () => tag(ctx, th, cur.tag, 540, ty, { size: 36, maxW: 860, lines: 2, bg: cur.tone === "bad" ? RED : "#C2691F", fg: "#fff", icon: cur.icon })); burst(ctx, 540, ty, t - cur.done, M, 10); }
    // bee
    let bx = 1060, by = 700, face = -1; const ent = clamp((t - .1) / .9, 0, 1), home = [880, 640];
    bx = 1100 + (home[0] - 1100) * easeIO(ent); by = 560 + (home[1] - 560) * easeIO(ent);
    const visits = []; FT.forEach(x => x.cells.forEach(c => visits.push(c))); let prevP = [bx, by];
    for (const v of visits){ const p = pos(v.c), tgt = [p[0] + R * .62, p[1] - R * .92]; if (t < v.T - .25) break; const u = clamp((t - (v.T - .25)) / .25, 0, 1); face = tgt[0] >= prevP[0] ? 1 : -1;
      bx = prevP[0] + (tgt[0] - prevP[0]) * easeIO(u); by = prevP[1] + (tgt[1] - prevP[1]) * easeIO(u) - Math.sin(u * Math.PI) * 30; prevP = tgt; }
    beeDraw(ctx, bx + Math.sin(t * 3) * 10, by + Math.sin(t * 4.3) * 8, t, face);
    ctx.restore();
  }, (s, f, i, add) => { hiveTimes(s, f, i).forEach(x => { x.cells.forEach(c => add(c.T, "pop")); if (x.tag) add(x.done, "chime"); }); });

  /* =====================================================================
     xpbar: a game HUD (avatar, name, level badge, XP bar). Each gain cue: "+N XP" floats from the person
     to the bar, the bar fills and a quest tag is logged on the right. Crossing the max = LEVEL UP (badge, banner, cheer).
     f: headline, highlight, name, icon, start (xp), level (start), max (default 100), levels:[names per level],
        gains:[{cue, xp, label, icon}], actor
     ===================================================================== */
  function xpTimes(s, f, idx){ const max = f.max || 100; let xp = f.start || 0, lv = f.level || 1; return (f.gains || []).map((g, i) => { const T = at(s, g.cue, .12 + i * .2, idx), from = xp, fromLv = lv;
    xp += g.xp || 0; const ups = []; while (xp >= max){ xp -= max; lv++; ups.push(lv); } if (xp < 0) xp = 0; return Object.assign({}, g, { T, arr: T + .8, from, to: xp, fromLv, lv, ups }); }); }
  TT.layout("xpbar", "Bar XP naik level", (ctx, th, s, t) => {
    const f = s.f, M = mv(), max = f.max || 100, G0 = xpTimes(s, f), LV = f.levels || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const GY = 1290, AX = 280, SC = .82;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // current xp / level (animated)
    let xp = f.start || 0, lv = f.level || 1, lvT = -9;
    G0.forEach(g => { if (t < g.arr) return; const u = clamp((t - g.arr) / .6, 0, 1), span = (g.lv - g.fromLv) * max + g.to - g.from, cur = g.from + span * easeIO(u);
      lv = g.fromLv + Math.floor(Math.max(0, cur) / max); xp = ((cur % max) + max) % max; if (u >= 1){ xp = g.to; lv = g.lv; }
      g.ups.forEach((L, k) => { const tu = g.arr + .6 * clamp(((L - g.fromLv) * max - g.from) / Math.max(1, span), 0, 1); if (t >= tu) lvT = Math.max(lvT, tu); }); });
    // HUD
    const hx0 = 90, hy0 = 582, hw = 900, hh = 178;
    ctx.fillStyle = "rgba(24,21,15,.25)"; rr(ctx, hx0 + 8, hy0 + 10, hw, hh, 32); ctx.fill();
    rr(ctx, hx0, hy0, hw, hh, 32); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.strokeStyle = "#E08A3C"; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.arc(172, hy0 + 89, 58, 0, TAU); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 5; ctx.stroke(); icon(ctx, f.icon || "user", 142, hy0 + 59, 60, "#fff", 2.6);
    const lvq = t - lvT < .6 ? 1 + .35 * Math.sin((t - lvT) / .6 * Math.PI) : 1, badge = `LV ${lv}`;
    scaled(ctx, 920, hy0 + 48, lvq, () => tag(ctx, th, badge, 965, hy0 + 48, { align: "right", size: 30, bg: "#FFD27A", fg: "#2B2118", weight: 900 }));
    textBlock(ctx, th, f.name || "Kamu", 510, hy0 + 44, 480, 34, 1, "#FFF7EE", 800, 18);
    const lvName = LV.length ? (LV[clamp(lv - (f.level || 1), 0, LV.length - 1)] || "") : "";
    // bar
    const bx0 = 250, bx1 = 965, by = hy0 + 112, bh = 40;
    rr(ctx, bx0, by, bx1 - bx0, bh, 20); ctx.fillStyle = "#4A3C30"; ctx.fill();
    const fw = (bx1 - bx0) * clamp(xp / max, 0, 1); if (fw > 2){ ctx.save(); rr(ctx, bx0, by, bx1 - bx0, bh, 20); ctx.clip(); const g = ctx.createLinearGradient(bx0, 0, bx0 + fw, 0); g.addColorStop(0, "#C2691F"); g.addColorStop(1, "#FFB766"); ctx.fillStyle = g; ctx.fillRect(bx0, by, fw, bh);
      ctx.fillStyle = "rgba(255,255,255,.25)"; for (let x = bx0 - 40 + (t * 60) % 40; x < bx0 + fw; x += 40){ ctx.beginPath(); ctx.moveTo(x, by + bh); ctx.lineTo(x + 16, by + bh); ctx.lineTo(x + 36, by); ctx.lineTo(x + 20, by); ctx.fill(); } ctx.restore(); }
    for (let k = 1; k < 10; k++){ ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(bx0 + (bx1 - bx0) * k / 10 - 1, by + 6, 2, bh - 12); }
    rr(ctx, bx0, by, bx1 - bx0, bh, 20); ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 3; ctx.stroke();
    font(ctx, 800, 24, th.fam); ctx.fillStyle = "#FFF7EE"; const xt = `${Math.round(xp)} / ${max} XP`; ctx.fillText(xt, bx1 - ctx.measureText(xt).width - 14, by + 29);
    // left subtitle under name: level name (fits before the badge)
    if (lvName){ const r2 = fitLines(ctx, th, lvName, 430, 26, 1, 700, 16); font(ctx, 700, r2.z, th.fam); ctx.fillStyle = "#FFB766"; ctx.textAlign = "center"; ctx.fillText(r2.L[0] || "", 510, hy0 + 86); ctx.textAlign = "left"; }
    ground(ctx, th, GY, 110, 970);
    // person
    const extra = []; G0.forEach(g => { if (g.ups.length){ const tu = g.arr + .3; extra.push({ at: tu, pose: "cheer", expr: "happy", emote: "sparkle" }, { at: tu + 1.6, pose: (f.actor && f.actor.pose) || "stand" }); } else if ((g.xp || 0) < 0) extra.push({ at: g.T, expr: "worried", emote: "sweat" }); });
    const a = withKeys(A(f.actor, AX), extra), st = actorState(a, s, t), sc = a.scale || SC, r = drawActor(ctx, th, a, st, t, GY, sc);
    // quest log on the right
    const shown = G0.filter(g => t >= g.T && g.label), vis = shown.slice(-4);
    vis.forEach((g, j) => { const y = 860 + j * 104, q = popAt(t, g.T, .4), neg = (g.xp || 0) < 0;
      scaled(ctx, 735, y, q, () => { rr(ctx, 490, y - 44, 490, 88, 22); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = neg ? RED : hexA(INK, .25); ctx.lineWidth = neg ? 5 : 3; ctx.stroke();
        if (neg) crossDisc(ctx, 530, y, 22); else checkDisc(ctx, 530, y, 22);
        const chip = `${neg ? "" : "+"}${g.xp} XP`; font(ctx, 900, 24, th.fam); const cw = ctx.measureText(chip).width + 24; rr(ctx, 968 - cw, y - 20, cw, 40, 20); ctx.fillStyle = neg ? RED : "#C2691F"; ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(chip, 980 - cw, y + 9);
        const fl = fitLines(ctx, th, g.label, 968 - cw - 12 - 566, 30, 2, 800, 16); font(ctx, 800, fl.z, th.fam); ctx.fillStyle = INK;
        fl.L.forEach((l, k) => ctx.fillText(l, 566, y + fl.z * .36 + (k - (fl.L.length - 1) / 2) * fl.z * 1.1)); }); });
    // floating +XP
    const headY = r ? r.headTop : GY - 450 * sc;
    G0.forEach(g => { const u = (t - g.T) / .8; if (u < 0 || u > 1.15) return; const neg = (g.xp || 0) < 0, x0 = st.x, y0 = headY - 20, x1 = bx0 + (bx1 - bx0) * clamp((g.from + (g.xp || 0) * .5) / max, .1, .9), y1 = by + bh / 2;
      const uu = Math.min(1, u), x = x0 + (x1 - x0) * easeIO(uu), y = y0 + (y1 - y0) * easeIO(uu) - Math.sin(uu * Math.PI) * 120, sz = 46 * (1 - .4 * uu);
      ctx.save(); ctx.globalAlpha *= u > 1 ? clamp(1 - (u - 1) / .15, 0, 1) : 1; font(ctx, 900, sz, th.fam); const txt = `${neg ? "" : "+"}${g.xp} XP`, w = ctx.measureText(txt).width;
      ctx.lineWidth = 8; ctx.strokeStyle = "#2B2118"; ctx.lineJoin = "round"; ctx.strokeText(txt, x - w / 2, y); ctx.fillStyle = neg ? "#FF8A65" : "#FFD27A"; ctx.fillText(txt, x - w / 2, y); ctx.restore(); });
    // LEVEL UP banner
    if (t - lvT < 2.2){ const u = t - lvT, q = popAt(t, lvT, .4), al = clamp((2.2 - u) / .4, 0, 1), cx = 285, cy = 845;
      ctx.save(); ctx.globalAlpha *= al; for (let k = 0; k < 12; k++){ const a2 = k * TAU / 12 + u * .8; ctx.strokeStyle = hexA("#FFD27A", .5); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a2) * 70, cy + Math.sin(a2) * 40); ctx.lineTo(cx + Math.cos(a2) * 170, cy + Math.sin(a2) * 90); ctx.stroke(); }
      scaled(ctx, cx, cy, q, () => tag(ctx, th, f.levelUp || "LEVEL UP!", cx, cy, { size: 46, bg: "#C2691F", fg: "#fff", weight: 900, stroke: "#FFD27A", lw: 5, maxW: 390 })); ctx.restore(); burst(ctx, cx, cy, u, M, 12); }
    overlays(ctx, th, st, r, t, 60);
    ctx.restore();
  }, (s, f, i, add) => { xpTimes(s, f, i).forEach(g => { add(g.T, (g.xp || 0) < 0 ? "ping" : "pop"); add(g.arr, "pop"); if (g.ups.length) add(g.arr + .3, "chime"); }); });
})();
