/* Scene pack set7e: quiz, curtain, origami, ladder, dam, jar, radio, aquarium.
   Runs after motion-tangani.js in its own <script>. Canvas 1080x1920; visuals kept in y ~560-1330, text in x 90-990. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, actorState, drawActor, bubbleAt, emoteAt, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const RED = "#D84315", GREEN = "#3BB273", YEL = "#E8A317", PAPER = "#FFF7EE", TEAL = "#2F6F73", SKINC = "#D99A6E";
  const dark = th => th.key === "B";
  const lerp = (a, b, q) => a + (b - a) * q;
  const fr = x => x - Math.floor(x);
  const rnd = k => fr(Math.sin(k * 12.9898 + 4.1) * 43758.5453);

  /* ---------- text helpers (always measured, shrunk or wrapped to fit) ---------- */
  function fitFont(ctx, th, txt, maxW, size, weight, min){ let z = size; font(ctx, weight || 700, z, th.fam); while (z > (min || 16) && ctx.measureText(txt).width > maxW){ z -= 1; font(ctx, weight || 700, z, th.fam); } return z; }
  function wrapL(ctx, txt, maxW){ return wrapRich(ctx, String(txt || ""), "", maxW).map(l => l.map(z => z.w).join(" ")).filter(l => l.length); }
  function fitLines(ctx, th, txt, maxW, size, maxL, weight, min){ let z = size;
    for (;;){ font(ctx, weight || 700, z, th.fam); const L = wrapL(ctx, txt, maxW);
      if ((L.length <= maxL && L.every(l => ctx.measureText(l).width <= maxW)) || z <= (min || 16)) return { z, L: L.slice(0, maxL) }; z -= 1; } }
  function textLines(ctx, th, txt, cx, cy, maxW, size, maxL, color, weight){ const r = fitLines(ctx, th, txt, maxW, size, maxL, weight); const lh = r.z * 1.15;
    ctx.fillStyle = color; ctx.textAlign = "center"; r.L.forEach((l, k) => ctx.fillText(l, cx, cy + r.z * .35 + (k - (r.L.length - 1) / 2) * lh)); ctx.textAlign = "left"; return r; }
  function tag(ctx, th, txt, cx, cy, o){ o = o || {}; const size = o.size || 32, maxW = o.maxW || 800, pad = size * .72, icS = o.icon ? size * 1.05 : 0, inner = maxW - pad * 2 - (icS ? icS + 10 : 0);
    const r = fitLines(ctx, th, txt, inner, size, o.lines || 1, o.weight || 800, o.min || 18), z = r.z, lh = z * 1.18;
    const tw = Math.max(...r.L.map(l => ctx.measureText(l).width), 10), ic = o.icon ? z * 1.05 : 0, w = tw + pad * 2 + (ic ? ic + 10 : 0), h = z * .85 + lh * r.L.length;
    const x0 = o.align === "right" ? cx - w : o.align === "left" ? cx : cx - w / 2;
    rr(ctx, x0, cy - h / 2, w, h, Math.min(h / 2, 30)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 4; ctx.stroke(); }
    if (ic) icon(ctx, o.icon, x0 + pad * .75, cy - ic / 2, ic, o.fg || INK, 2.4);
    font(ctx, o.weight || 800, z, th.fam); ctx.fillStyle = o.fg || INK; ctx.textAlign = "left";
    r.L.forEach((l, k) => ctx.fillText(l, x0 + pad + (ic ? ic + 8 : 0), cy + z * .36 + (k - (r.L.length - 1) / 2) * lh));
    return { x0, w, h };
  }
  const popAt = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  function scaled(ctx, x, y, k, fn){ if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); }
  function mark(ctx, ok, x, y, r){ ctx.strokeStyle = ok ? GREEN : RED; ctx.lineWidth = r * .24; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
    if (ok){ ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .34); ctx.lineTo(x + r * .45, y - r * .3); }
    else { ctx.moveTo(x - r * .36, y - r * .36); ctx.lineTo(x + r * .36, y + r * .36); ctx.moveTo(x + r * .36, y - r * .36); ctx.lineTo(x - r * .36, y + r * .36); }
    ctx.stroke(); }
  function badge(ctx, ok, x, y, r, k){ scaled(ctx, x, y, k == null ? 1 : k, () => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = ok ? GREEN : RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .14; ctx.stroke();
    ctx.save(); ctx.translate(0, 0); const c = ok ? "#fff" : "#fff"; ctx.strokeStyle = c; ctx.lineWidth = r * .24; ctx.lineCap = "round"; ctx.beginPath();
    if (ok){ ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .34); ctx.lineTo(x + r * .45, y - r * .3); } else { ctx.moveTo(x - r * .36, y - r * .36); ctx.lineTo(x + r * .36, y + r * .36); ctx.moveTo(x + r * .36, y - r * .36); ctx.lineTo(x - r * .36, y + r * .36); }
    ctx.stroke(); ctx.restore(); }); }
  // actor helpers
  function withKeys(a, extra, x){ const b = Object.assign({ hair: "short", shirt: TEAL, skin: "a" }, a || {}); b.x = x != null ? x : (b.x != null ? b.x : 540); b.keys = (extra || []).concat((a && a.keys) || []); return b; }
  function overlay(ctx, th, a, st, r, t){ if (!r) return; if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (a.emoteDx != null ? a.emoteDx : 50), r.headTop - 6, t - st.emoteT, t);
    if (st.say) bubbleAt(ctx, th, st.say, r.headX + (a.bubbleDx || 0), r.headTop - (st.emote ? 70 : 8), st.chat, t - st.sayT); }
  function hand(ctx, x, y, rot, a){ if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = SKINC; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 22, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-20, -18, 9, 15, -.6, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#544E42"; ctx.fillRect(18, -16, 60, 32); ctx.restore(); }
  function noiseDots(ctx, x0, y0, w, h, n, t, a, col){ const f = Math.floor(t * 24); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col || "#FFFFFF";
    for (let k = 0; k < n; k++){ const x = x0 + rnd(k * 3.1 + f * 7.7) * w, y = y0 + rnd(k * 5.3 + f * 3.9) * h; ctx.fillRect(x, y, 3 + rnd(k + f) * 5, 3); } ctx.restore(); }

  /* =====================================================================
     quiz: game-show board with a question, answer plates slide in on cue, a contestant
     behind a desk slaps the buzzer; the chosen plate turns green (right) or red (wrong).
     f: headline, highlight, question, qCue, options:[{label, cue, right}], buzz:[{cue, pick, by, wait}], players:[{name, actor}]
     ===================================================================== */
  function quizEv(s, f, idx){ return (f.buzz || []).map((b, k) => { const T = at(s, b.cue, .55 + k * .15, idx), o = (f.options || [])[b.pick] || {};
    return { T, R: T + (b.wait != null ? b.wait : .8), pick: b.pick, by: b.by || 0, right: !!o.right }; }).sort((a, b) => a.T - b.T); }
  TT.layout("quiz", "Kuis bel", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const ops = (f.options || []).slice(0, 3), n = ops.length, pl = (f.players && f.players.length ? f.players : [{}]).slice(0, 2), np = pl.length;
    const qT = f.qCue ? at(s, f.qCue, .04) : .15, oT = ops.map((o, k) => at(s, o.cue, .2 + k * .14)), ev = quizEv(s, f);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // question board with chasing marquee bulbs
    const BX = 120, BY = 562, BW = 840, BH = 140;
    ctx.save(); ctx.shadowColor = "rgba(24,21,15,.28)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 8; rr(ctx, BX, BY, BW, BH, 30); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.restore();
    ctx.strokeStyle = th.accent; ctx.lineWidth = 6; rr(ctx, BX, BY, BW, BH, 30); ctx.stroke();
    const ph = Math.floor(t * 7); for (let k = 0; k < 13; k++){ [BY + 14, BY + BH - 14].forEach((y, j) => { ctx.beginPath(); ctx.arc(BX + 50 + k * 61.5, y, 6, 0, TAU); ctx.fillStyle = (k + j + ph) % 3 === 0 ? "#FFE08A" : "#6B5236"; ctx.fill(); }); }
    if (t < qT || !f.question){ const p = 1 + .07 * Math.sin(t * 5); ctx.save(); ctx.translate(540, BY + BH / 2); ctx.scale(p, p); font(ctx, 900, 92, th.fam); ctx.fillStyle = "#FFE08A"; ctx.textAlign = "center"; ctx.fillText("?", 0, 32); ctx.textAlign = "left"; ctx.restore(); }
    else { const q = eOut(clamp((t - qT) / .35, 0, 1)); ctx.save(); ctx.translate(540, BY + BH / 2); ctx.scale(1, Math.max(.02, q)); ctx.translate(-540, -(BY + BH / 2)); textLines(ctx, th, f.question, 540, BY + BH / 2, 740, 38, 2, "#FFF7EE", 800); ctx.restore(); }
    // answer plates
    const OH = n > 2 ? 68 : 80, OG = n > 2 ? 12 : 18, OY = 724;
    ops.forEach((o, k) => { if (t < oT[k]) return;
      const y = OY + k * (OH + OG), q = eOut(clamp((t - oT[k]) / .4, 0, 1)), ly = y + OH / 2;
      const done = ev.filter(e => e.pick === k && t >= e.R).pop(), pend = ev.find(e => e.pick === k && t >= e.T && t < e.R);
      let dx = (1 - q) * 640; if (done && !done.right && t - done.R < .5) dx += Math.sin((t - done.R) * 45) * 14 * (1 - (t - done.R) / .5);
      ctx.save(); ctx.globalAlpha *= q; ctx.translate(dx, 0);
      const bg = done ? (done.right ? GREEN : RED) : "#FFFFFF";
      ctx.fillStyle = "rgba(24,21,15,.14)"; rr(ctx, 126, y + 7, 840, OH, OH / 2); ctx.fill();
      rr(ctx, 120, y, 840, OH, OH / 2); ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = pend ? (Math.sin(t * 24) > 0 ? th.accent : YEL) : (done ? "rgba(255,255,255,.6)" : hexA(INK, .22)); ctx.lineWidth = pend ? 8 : 3; ctx.stroke();
      const lx = 120 + OH / 2 + 4;
      ctx.beginPath(); ctx.arc(lx, ly, OH * .36, 0, TAU); ctx.fillStyle = done ? "#FFFFFF" : th.accent; ctx.fill();
      font(ctx, 900, OH * .42, th.fam); ctx.fillStyle = done ? bg : "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText("ABC"[k], lx, ly + OH * .15); ctx.textAlign = "left";
      let fl = { z: fitFont(ctx, th, o.label || "", 650, n > 2 ? 33 : 36, 800, 26), L: [o.label || ""] }; if (ctx.measureText(o.label || "").width > 650) fl = fitLines(ctx, th, o.label || "", 650, n > 2 ? 27 : 30, 2, 800, 18); font(ctx, 800, fl.z, th.fam); ctx.fillStyle = done ? "#FFFFFF" : INK;
      fl.L.forEach((l, j) => ctx.fillText(l, lx + OH * .5 + 16, ly + fl.z * .36 + (j - (fl.L.length - 1) / 2) * fl.z * 1.12));
      if (done){ const kk = popAt(t, done.R, .35); scaled(ctx, 914, ly, kk, () => { ctx.beginPath(); ctx.arc(914, ly, OH * .33, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); mark(ctx, done.right, 914, ly, OH * .33); }); }
      ctx.restore();
      if (done && done.right) burst(ctx, 900, ly, t - done.R, M, 9);
    });
    // contestant desks
    const DX = np === 1 ? [540] : [290, 790], DY = 1196, heads = [];
    pl.forEach((p, j) => { const cx = DX[j], mine = ev.filter(e => e.by === j), auto = [];
      mine.forEach(e => { auto.push({ at: e.T, pose: "point", expr: "neutral" }); auto.push({ at: e.R, pose: e.right ? "cheer" : "shrug", expr: e.right ? "happy" : "worried", emote: e.right ? "sparkle" : "sweat" }); auto.push({ at: e.R + 1.8, pose: "stand", expr: e.right ? "smile" : "neutral" }); });
      const a = withKeys(p.actor || (j ? { hair: "hijab", hijab: "#2F6F73", shirt: "#E89544", skin: "b" } : { hair: "short", shirt: TEAL, skin: "a" }), auto, cx - 40);
      const st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, DY + 132, .7); heads.push([a, st, r]);
      ctx.fillStyle = "rgba(24,21,15,.2)"; rr(ctx, cx - 142, DY + 8, 300, 132, 18); ctx.fill();
      rr(ctx, cx - 150, DY, 300, 132, 18); ctx.fillStyle = j ? TEAL : th.accent; ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.fillRect(cx - 150, DY + 22, 300, 6);
      rr(ctx, cx - 166, DY - 16, 332, 28, 12); ctx.fillStyle = "#5A3A2A"; ctx.fill();
      if (p.name){ fitFont(ctx, th, p.name, 250, 34, 800, 18); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(p.name, cx, DY + 74); ctx.textAlign = "left"; }
      const sc = mine.filter(e => e.right && t >= e.R).length; ctx.fillStyle = "#FFE08A"; for (let q = 0; q < sc; q++) star(ctx, cx - (sc - 1) * 20 + q * 40, DY + 108, 14);
      const lb = mine.filter(e => t >= e.T).pop();
      if (lb && t - lb.T < .6){ ctx.save(); ctx.globalAlpha *= (1 - (t - lb.T) / .6) * .55; rr(ctx, cx - 150, DY, 300, 132, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore(); }
      const bx = cx + 92, by = DY - 16, press = lb && t - lb.T < .3 ? Math.sin((t - lb.T) / .3 * Math.PI) : 0;
      rr(ctx, bx - 46, by - 14, 92, 18, 8); ctx.fillStyle = "#2B2118"; ctx.fill();
      ctx.beginPath(); ctx.ellipse(bx, by - 12, 36, 32 * (1 - press * .5), 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = RED; ctx.fill();
      ctx.beginPath(); ctx.ellipse(bx - 12, by - 12 - 18 * (1 - press * .5), 9, 6, -.4, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fill();
      if (lb && t - lb.T < .9){ const u = (t - lb.T) / .9; ctx.strokeStyle = hexA(YEL, 1 - u); ctx.lineWidth = 6; ctx.lineCap = "round"; for (let r2 = 0; r2 < 2; r2++){ ctx.beginPath(); ctx.arc(bx, by - 20, 40 + u * 80 + r2 * 24, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } }
    });
    heads.forEach(([a, st, r]) => overlay(ctx, th, a, st, r, t));
    ctx.restore();
  }, (s, f, i, add) => { (f.options || []).forEach((o, k) => add(cueT(s, o.cue, .2 + k * .14, i), "pop")); quizEv(s, f, i).forEach(e => { add(e.T, "ping"); add(e.R, e.right ? "chime" : "whoosh"); }); });

  /* =====================================================================
     curtain: a theatre stage; red curtains open on cue to reveal a big icon + label.
     Each further act closes the curtain briefly and reopens on the new content.
     f: headline, highlight, tease, acts:[{cue, label, icon, sub, color}], actor (optional, on stage at x ~330)
     ===================================================================== */
  function curtainTimes(s, f, idx){ return (f.acts || []).map((a, k) => at(s, a.cue, .1 + k * .3, idx)); }
  function curtainState(T, t){ let o = 0, cur = -1, revT = -9;
    T.forEach((Tk, k) => { if (t < Tk) return;
      if (k === 0){ o = eOut(clamp((t - Tk) / .9, 0, 1)); cur = 0; revT = Tk + .45; }
      else if (t < Tk + .3) o = Math.min(o, 1 - eOut(clamp((t - Tk) / .3, 0, 1)));
      else { o = eOut(clamp((t - Tk - .3) / .8, 0, 1)); cur = k; revT = Tk + .7; } });
    return { o, cur, revT }; }
  TT.layout("curtain", "Panggung tirai", (ctx, th, s, t) => {
    const f = s.f, M = mv(), acts = f.acts || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = curtainTimes(s, f), cs = curtainState(T, t), X0 = 110, X1 = 970, Y0 = 590, Y1 = 1320, IX0 = 150, IX1 = 930, IY0 = 672, FL = 1215;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    ctx.save(); ctx.shadowColor = "rgba(24,21,15,.3)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10; rr(ctx, X0, Y0, X1 - X0, Y1 - Y0, 34); ctx.fillStyle = "#5A2A1E"; ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#E8B23A"; ctx.lineWidth = 5; rr(ctx, X0 + 12, Y0 + 12, X1 - X0 - 24, Y1 - Y0 - 24, 26); ctx.stroke();
    // inner stage
    ctx.save(); ctx.beginPath(); ctx.rect(IX0, IY0, IX1 - IX0, Y1 - 28 - IY0); ctx.clip();
    const g = ctx.createLinearGradient(0, IY0, 0, FL); g.addColorStop(0, "#22170F"); g.addColorStop(1, "#4A3326"); ctx.fillStyle = g; ctx.fillRect(IX0, IY0, IX1 - IX0, FL - IY0);
    ctx.fillStyle = "#8E5A34"; ctx.fillRect(IX0, FL, IX1 - IX0, Y1 - FL); ctx.strokeStyle = "rgba(59,36,24,.4)"; ctx.lineWidth = 3;
    for (let x = IX0 + 20; x < IX1 + 40; x += 70){ ctx.beginPath(); ctx.moveTo(x, FL); ctx.lineTo(x - 30, Y1); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.fillRect(IX0, FL, IX1 - IX0, 5);
    const hasA = !!f.actor, cx = hasA ? 650 : 540;
    if (cs.cur >= 0){ const a = acts[cs.cur], col = a.color || M.pal[cs.cur % 3], bob = Math.sin(t * 2.2) * 8;
      const sg = ctx.createLinearGradient(0, IY0, 0, FL); sg.addColorStop(0, "rgba(255,236,190,.05)"); sg.addColorStop(1, "rgba(255,236,190,.32)");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(cx - 50, IY0); ctx.lineTo(cx + 50, IY0); ctx.lineTo(cx + 270, FL + 40); ctx.lineTo(cx - 270, FL + 40); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,236,190,.28)"; ctx.beginPath(); ctx.ellipse(cx, FL + 34, 260, 38, 0, 0, TAU); ctx.fill();
      scaled(ctx, cx, 860, popAt(t, cs.revT - .3, .5), () => { ctx.beginPath(); ctx.arc(cx, 860 + bob, 112, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#FFF7EE"; ctx.lineWidth = 8; ctx.stroke();
        icon(ctx, a.icon || "star", cx - 58, 860 + bob - 58, 116, "#FFFFFF", 2.6); });
      if (a.label) scaled(ctx, cx, 1050, popAt(t, cs.revT, .45), () => tag(ctx, th, a.label, cx, 1050, { bg: "#FFF7EE", fg: INK, size: 40, maxW: hasA ? 480 : 570, lines: 2 }));
      if (a.sub) scaled(ctx, cx, 1150, popAt(t, cs.revT + .3, .45), () => tag(ctx, th, a.sub, cx, 1150, { bg: col, fg: "#fff", size: 28, maxW: hasA ? 460 : 560 }));
    }
    let AR = null; if (hasA){ const a = withKeys(f.actor, [], f.actor.x || 320), st = actorState(a, s, t); AR = [a, st, drawActor(ctx, th, a, st, t, FL + 52, a.scale || .62)]; }
    ctx.restore();
    // curtains
    const half = (IX1 - IX0) / 2, w = lerp(half + 6, 96, cs.o);
    [-1, 1].forEach(d => { const xe = d < 0 ? IX0 - 14 : IX1 + 14, wi = w + 14;
      const xin = y => xe - d * wi * (1 - .42 * cs.o * Math.exp(-Math.pow((y - 1010) / 170, 2))) + Math.sin(t * 1.6 + y * .012) * 4 * (1 - cs.o);
      const gr = ctx.createLinearGradient(xe, 0, xe - d * wi, 0), nf = 7; for (let q = 0; q <= nf * 2; q++) gr.addColorStop(q / (nf * 2), q % 2 ? "#7E1D18" : "#C2392E");
      ctx.beginPath(); ctx.moveTo(xe, IY0 - 20); ctx.lineTo(xin(IY0), IY0 - 20); for (let y = IY0; y <= Y1 - 28; y += 20) ctx.lineTo(xin(y), y); ctx.lineTo(xin(Y1 - 28), Y1 - 28); ctx.lineTo(xe, Y1 - 28); ctx.closePath(); ctx.fillStyle = gr; ctx.fill();
      if (cs.o > .25){ const tx = xin(1010); ctx.fillStyle = "#E8B23A"; ctx.beginPath(); ctx.ellipse((tx + xe) / 2, 1010, Math.abs(tx - xe) / 2 + 8, 11, 0, 0, TAU); ctx.fill(); } });
    // valance with scallops + bulbs
    ctx.fillStyle = "#9E2A22"; ctx.fillRect(IX0 - 14, IY0 - 30, IX1 - IX0 + 28, 50);
    const scw = (IX1 - IX0 + 28) / 10; for (let k = 0; k < 10; k++){ ctx.beginPath(); ctx.arc(IX0 - 14 + (k + .5) * scw, IY0 + 20, scw / 2, 0, Math.PI); ctx.fill(); }
    ctx.strokeStyle = "#E8B23A"; ctx.lineWidth = 4; for (let k = 0; k < 10; k++){ ctx.beginPath(); ctx.arc(IX0 - 14 + (k + .5) * scw, IY0 + 20, scw / 2, 0, Math.PI); ctx.stroke(); }
    const ph = Math.floor(t * 5); for (let k = 0; k < 14; k++){ ctx.beginPath(); ctx.arc(X0 + 48 + k * 60, Y0 + 32, 7, 0, TAU); ctx.fillStyle = (k + ph) % 2 ? "#FFE08A" : "#8C6A3A"; ctx.fill(); }
    if (f.tease && cs.cur < 0){ const b = Math.sin(t * 2.5) * 8; tag(ctx, th, f.tease, 540, 950 + b, { bg: "#FFF7EE", fg: INK, size: 38, maxW: 600, lines: 2, icon: "help" }); }
    if (cs.cur >= 0) burst(ctx, cx, 860, t - cs.revT, M, 10);
    if (AR && cs.o > .6) overlay(ctx, th, AR[0], AR[1], AR[2], t);
    ctx.restore();
  }, (s, f, i, add) => { curtainTimes(s, f, i).forEach((T, k) => { add(T, "whoosh"); add(T + (k ? .7 : .45), k ? "pop" : "chime"); }); });

  /* =====================================================================
     origami: a square sheet folds step by step (a flap flips over on each cue, hands pinch it),
     morphing into a paper plane / boat / heart; the result can fly, float or beat.
     f: headline, highlight, steps:[{label, cue}], shape:"plane"|"boat"|"heart", result:{label, cue}
     ===================================================================== */
  const SQ = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  const SHAPES = { plane: [[0, -1.25], [.2, -.1], [.95, .75], [.3, .62], [0, .85], [-.3, .62], [-.95, .75], [-.2, -.1]],
    boat: [[0, -1], [.42, -.05], [1.15, -.05], [.75, .62], [0, .62], [-.75, .62], [-1.15, -.05], [-.42, -.05]],
    heart: [[0, -.45], [.55, -.95], [1.05, -.45], [.75, .25], [0, .95], [-.75, .25], [-1.05, -.45], [-.55, -.95]] };
  const AXES = [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4, 0];
  const shapeAt = (sh, u) => SQ.map((p, i) => [lerp(p[0], sh[i][0], u), lerp(p[1], sh[i][1], u)]);
  function polyPath(ctx, pts, R){ ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x * R, y * R) : ctx.moveTo(x * R, y * R)); ctx.closePath(); }
  function planePos(v){ return [Math.sin(v * TAU) * 290, -Math.sin(v * Math.PI) * 150 - Math.sin(v * TAU * 2) * 40]; }
  TT.layout("origami", "Origami", (ctx, th, s, t) => {
    const f = s.f, M = mv(), sp = f.steps || [], n = Math.max(1, sp.length); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = sp.map((x, k) => at(s, x.cue, .12 + k * .22)), RT = f.result && f.result.cue ? at(s, f.result.cue, .85) : null;
    const kind = SHAPES[f.shape] ? f.shape : "plane", sh = SHAPES[kind], CX = 540, CY = 900, R = 172;
    let ck = -1, q = 1; T.forEach((Tk, k) => { if (t >= Tk){ ck = k; q = clamp((t - Tk) / .8, 0, 1); } });
    const e = easeIO(q), u0 = ck < 0 ? 0 : ck / n, u1 = ck < 0 ? 0 : (ck + 1) / n, u = lerp(u0, u1, e), res = RT != null && t >= RT, rk = res ? clamp((t - RT) / .5, 0, 1) : 0;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // table mat
    ctx.fillStyle = dark(th) ? "rgba(250,248,243,.06)" : hexA(INK, .06); rr(ctx, 170, 650, 740, 520, 40); ctx.fill();
    ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.12)" : hexA(INK, .1); ctx.lineWidth = 2; for (let x = 230; x < 900; x += 60){ ctx.beginPath(); ctx.moveTo(x, 662); ctx.lineTo(x, 1158); ctx.stroke(); } for (let y = 710; y < 1160; y += 60){ ctx.beginPath(); ctx.moveTo(182, y); ctx.lineTo(898, y); ctx.stroke(); }
    // result motion
    let ox = 0, oy = Math.sin(t * 2) * 6, rot = 0, sc = 1, trail = null;
    if (res && kind === "plane"){ const v = clamp((t - RT - .35) / 2, 0, 1); if (v > 0 && v < 1){ const p = planePos(v), p2 = planePos(Math.min(1, v + .01)); ox = p[0]; oy = p[1]; rot = (Math.atan2(p2[1] - p[1], p2[0] - p[0]) + Math.PI / 2) * Math.sin(v * Math.PI); sc = .7 + .3 * Math.abs(Math.cos(v * Math.PI));
        trail = []; for (let w = Math.max(0, v - .3); w <= v; w += .01) trail.push(planePos(w)); } else if (v >= 1) oy = Math.sin(t * 3) * 12; }
    if (res && kind === "boat"){ rot = Math.sin(t * 2.2) * .07; oy = Math.sin(t * 2.2 + 1) * 8; }
    if (res && kind === "heart") sc = 1 + .07 * Math.max(0, Math.sin(t * 7)) * rk;
    if (trail){ ctx.save(); ctx.strokeStyle = hexA(th.accent, .7); ctx.lineWidth = 6; ctx.setLineDash([14, 12]); ctx.lineCap = "round"; ctx.beginPath(); trail.forEach(([x, y], k) => k ? ctx.lineTo(CX + x, CY + y) : ctx.moveTo(CX + x, CY + y)); ctx.stroke(); ctx.restore(); }
    if (res && kind === "boat"){ ctx.save(); ctx.fillStyle = "#7CC4E8"; ctx.beginPath(); ctx.moveTo(250, 1030); for (let x = 250; x <= 830; x += 10) ctx.lineTo(x, 1015 + Math.sin(x * .03 + t * 3) * 10); ctx.lineTo(830, 1100); ctx.lineTo(250, 1100); ctx.closePath(); ctx.globalAlpha *= rk; ctx.fill(); ctx.restore(); }
    const pts = shapeAt(sh, u), front = "#FFFFFF", back = "#F4A85C", fill = res ? th.accent : front;
    ctx.save(); ctx.translate(CX + ox, CY + oy); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.save(); ctx.translate(8, 14); polyPath(ctx, pts, R); ctx.fillStyle = "rgba(24,21,15,.2)"; ctx.fill(); ctx.restore();
    polyPath(ctx, pts, R); ctx.fillStyle = front; ctx.fill(); if (rk > 0){ ctx.save(); ctx.globalAlpha *= rk; ctx.fillStyle = fill; ctx.fill(); ctx.restore(); }
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.stroke();
    // creases of finished folds
    ctx.save(); polyPath(ctx, pts, R); ctx.clip(); ctx.strokeStyle = res ? "rgba(255,255,255,.45)" : hexA(INK, .2); ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    const nDone = ck < 0 ? 0 : (q >= 1 ? ck + 1 : ck); for (let k = 0; k < nDone; k++){ const a = AXES[k % AXES.length] + (k >= 4 ? .3 : 0); ctx.beginPath(); ctx.moveTo(-Math.sin(a) * 320, -Math.cos(a) * 320); ctx.lineTo(Math.sin(a) * 320, Math.cos(a) * 320); ctx.stroke(); }
    ctx.restore();
    // flap flipping over the fold axis
    if (ck >= 0 && q < 1){ const a = AXES[ck % AXES.length] + (ck >= 4 ? .3 : 0), c = Math.cos(Math.PI * e), fade = 1 - clamp((e - .72) / .28, 0, 1);
      ctx.save(); ctx.globalAlpha *= fade; ctx.rotate(-a); ctx.scale(c, 1); ctx.beginPath(); ctx.rect(0, -420, 420, 840); ctx.clip(); ctx.rotate(a);
      polyPath(ctx, shapeAt(sh, u0), R); ctx.fillStyle = c >= 0 ? front : back; ctx.fill(); ctx.fillStyle = `rgba(24,21,15,${(1 - Math.abs(c)) * .25})`; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
      const ha = clamp(Math.min(q * 6, (1 - q) * 6), 0, 1), ca = Math.cos(-a), sa = Math.sin(-a), P = (x, y) => [x * ca - y * sa, x * sa + y * ca];
      const [h1x, h1y] = P(c * R * .95, -R * .55), [h2x, h2y] = P(-R * .9, R * .5); hand(ctx, h1x, h1y, -a - .3, ha); hand(ctx, h2x, h2y, -a + Math.PI + .3, ha); }
    ctx.restore();
    if (res) burst(ctx, CX, CY, t - RT, M, 12);
    // progress dots
    const tot = n + (f.result ? 1 : 0), dx0 = 540 - (tot - 1) * 26;
    for (let k = 0; k < tot; k++){ const on = k < n ? (ck > k || (ck === k && q >= .5)) : res; ctx.beginPath(); ctx.arc(dx0 + k * 52, 1142, on ? 13 : 10, 0, TAU);
      ctx.fillStyle = on ? (k < n ? th.accent : GREEN) : (dark(th) ? "rgba(250,248,243,.25)" : hexA(INK, .2)); ctx.fill(); }
    // current step / result tag
    if (res) scaled(ctx, 540, 1232, popAt(t, RT, .4), () => tag(ctx, th, f.result.label || "", 540, 1232, { bg: GREEN, fg: "#fff", size: 40, maxW: 800, icon: "check" }));
    else if (ck >= 0){ const st = sp[ck]; scaled(ctx, 540, 1232, popAt(t, T[ck], .35), () => tag(ctx, th, `${ck + 1}. ${st.label || ""}`, 540, 1232, { bg: th.accent, fg: "#fff", size: 38, maxW: 800, lines: 2 })); }
    else if (f.intro) tag(ctx, th, f.intro, 540, 1232, { bg: dark(th) ? "#2A2622" : "#FFFFFF", fg: dark(th) ? "#FAF8F3" : INK, size: 34, maxW: 760 });
    ctx.restore();
  }, (s, f, i, add) => { (f.steps || []).forEach((x, k) => add(cueT(s, x.cue, .12 + k * .22, i), "whoosh")); if (f.result && f.result.cue) add(cueT(s, f.result.cue, .85, i), "chime"); });

  /* =====================================================================
     ladder: a ladder leans on a wall ledge with a goal on top; a person climbs rung by rung on cue.
     Rungs can be missing (blocked), vanish on cue (person drops) or be fixed on cue (person continues).
     f: headline, highlight, rungs:[{label, cue, missing, vanishCue, fixCue}], goal:{label, icon, cue},
        moves:[{cue, to}] (optional; to = rung index, -1 floor, -2 off-screen, "goal"), flag:{cue, rung, label}, actor, start
     ===================================================================== */
  const LB = [215, 1298], LT = [520, 712];
  function rungPt(k, n){ const u = (k + 1) / (n + 1); return [lerp(LB[0], LT[0], u), lerp(LB[1], LT[1], u)]; }
  function lvlPt(L, n){ if (L <= -1) return [lerp(-20, 110, clamp(L + 2, 0, 1)), 1298];
    const Pp = l => l <= -1 ? [110, 1298] : l >= n ? [650, 700] : rungPt(l, n), fl = Math.floor(L), q = L - fl;
    if (fl === n - 1 && q > 0){ const a = rungPt(n - 1, n), top = [535, 704], end = [650, 700]; return q < .6 ? [lerp(a[0], top[0], q / .6), lerp(a[1], top[1], q / .6)] : [lerp(top[0], end[0], (q - .6) / .4), lerp(top[1], end[1], (q - .6) / .4)]; }
    const a = Pp(fl), b = Pp(fl + 1); return [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]; }
  function ladderPlan(s, f, idx){
    const rg = f.rungs || [], n = rg.length, ev = [], start = f.start != null ? f.start : -1;
    rg.forEach((r, k) => { if (r.vanishCue) ev.push({ T: at(s, r.vanishCue, .5, idx), type: "van", k }); if (r.fixCue) ev.push({ T: at(s, r.fixCue, .7, idx), type: "fix", k }); });
    if (f.moves) f.moves.forEach((m, j) => ev.push({ T: at(s, m.cue, .2 + j * .15, idx), type: "move", to: m.to === "goal" ? n : m.to }));
    else { rg.forEach((r, k) => { if (r.cue && !r.missing) ev.push({ T: at(s, r.cue, .15 + k * .18, idx) + .15, type: "move", to: k }); }); if (f.goal && f.goal.cue) ev.push({ T: at(s, f.goal.cue, .85, idx), type: "move", to: n }); }
    ev.sort((a, b) => a.T - b.T);
    const avail = rg.map(r => !r.missing), segs = [], blocks = [], fixes = {}, vans = {}; let cur = start, tFree = 0, pend = null, goalT = null;
    const go = (T, to) => { const T0 = Math.max(T, tFree); let tgt = to;
      if (to > cur){ for (let j = Math.max(0, Math.floor(cur) + 1); j <= Math.min(to, n - 1); j++) if (!avail[j]){ tgt = j - 1; break; } }
      const d = Math.abs(tgt - cur), dur = d * .4;
      if (d > 0){ segs.push({ t0: T0, t1: T0 + dur, a: cur, b: tgt }); if (tgt === n) goalT = T0 + dur; }
      if (tgt !== to){ blocks.push({ T: T0 + dur, k: tgt + 1 }); pend = to; } else pend = null;
      cur = tgt; tFree = T0 + dur; };
    ev.forEach(e => { if (e.type === "move") go(e.T, e.to);
      else if (e.type === "fix"){ avail[e.k] = true; fixes[e.k] = e.T; if (pend != null) go(e.T + .6, pend); }
      else { avail[e.k] = false; vans[e.k] = e.T; if (cur >= e.k && cur < n){ let j = e.k - 1; while (j >= 0 && !avail[j]) j--; const T0 = Math.max(e.T + .25, tFree); segs.push({ t0: T0, t1: T0 + .35, a: cur, b: j, fall: true }); blocks.push({ T: T0 + .35, k: e.k }); cur = j; tFree = T0 + .35; } } });
    return { segs, blocks, fixes, vans, n, start, goalT };
  }
  function levelAt(P, t){ let L = P.start, mov = false; for (const g of P.segs){ if (t < g.t0) break; if (t < g.t1){ const q = (t - g.t0) / (g.t1 - g.t0); L = lerp(g.a, g.b, g.fall ? q * q : easeIO(q)); mov = true; break; } L = g.b; } return { L, mov }; }
  TT.layout("ladder", "Tangga panjat", (ctx, th, s, t) => {
    const f = s.f, M = mv(), rg = f.rungs || [], n = Math.max(1, rg.length); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const P = ladderPlan(s, f), T = rg.map((r, k) => at(s, r.cue, .15 + k * .18)), lv = levelAt(P, t), D = dark(th);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // wall with bricks + ledge
    ctx.fillStyle = D ? "#3A3027" : "#EADCCB"; ctx.fillRect(545, 740, 445, 560);
    ctx.strokeStyle = D ? "rgba(250,248,243,.08)" : hexA(INK, .08); ctx.lineWidth = 3;
    for (let y = 792, r = 0; y < 1300; y += 52, r++){ ctx.beginPath(); ctx.moveTo(545, y); ctx.lineTo(990, y); ctx.stroke(); for (let x = 545 + (r % 2) * 55 + 55; x < 990; x += 110){ ctx.beginPath(); ctx.moveTo(x, y - 52); ctx.lineTo(x, y); ctx.stroke(); } }
    ctx.fillStyle = "rgba(24,21,15,.2)"; rr(ctx, 506, 708, 490, 56, 10); ctx.fill();
    rr(ctx, 500, 700, 490, 56, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(504, 702, 482, 6);
    const goal = f.goal || {}, GT = P.goalT, reached = GT != null && t >= GT;
    if (goal.label){ fitFont(ctx, th, goal.label, 420, 32, 800, 18); ctx.fillStyle = "#FFF7EE"; ctx.textAlign = "center"; ctx.fillText(goal.label, 745, 740); ctx.textAlign = "left"; }
    // trophy disc on the ledge
    { const gx = 905, gy = 640 + Math.sin(t * 2) * 5, pul = reached ? 1 + .08 * Math.sin((t - GT) * 8) * Math.exp(-(t - GT)) : 1;
      if (reached){ const gg = ctx.createRadialGradient(gx, gy, 10, gx, gy, 120); gg.addColorStop(0, "rgba(255,224,138,.7)"); gg.addColorStop(1, "rgba(255,224,138,0)"); ctx.fillStyle = gg; ctx.fillRect(gx - 120, gy - 120, 240, 240); }
      scaled(ctx, gx, gy, pul, () => { ctx.beginPath(); ctx.arc(gx, gy, 48, 0, TAU); ctx.fillStyle = reached ? YEL : (D ? "#6B5A48" : "#B8AE9D"); ctx.fill(); ctx.strokeStyle = "#FFF7EE"; ctx.lineWidth = 6; ctx.stroke(); icon(ctx, goal.icon || "star", gx - 26, gy - 26, 52, "#FFFFFF", 2.6); }); }
    // floor
    ctx.fillStyle = D ? "#4A4038" : "#CBBBA6"; rr(ctx, 90, 1298, 900, 22, 8); ctx.fill();
    // ladder rails + rungs
    const dx = LT[0] - LB[0], dy = LT[1] - LB[1], Ln = Math.hypot(dx, dy), ux = dx / Ln, uy = dy / Ln, px = -uy * 64, py = ux * 64;
    [-1, 1].forEach(sd => { ctx.strokeStyle = "#7A4A2A"; ctx.lineWidth = 20; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(LB[0] + sd * px, LB[1] + sd * py); ctx.lineTo(LT[0] + sd * px + ux * 34, LT[1] + sd * py + uy * 34); ctx.stroke();
      ctx.strokeStyle = "#C27A45"; ctx.lineWidth = 12; ctx.stroke(); });
    const rungState = k => { const r = rg[k]; let on = !r.missing; const fx = P.fixes[k], vn = P.vans[k]; if (vn != null && t >= vn) on = false; if (fx != null && t >= fx) on = true; return { on, fx, vn }; };
    rg.forEach((r, k) => { const [x, y] = rungPt(k, n), a = [x - px, y - py], b = [x + px, y + py], stt = rungState(k);
      const drawR = (o, rot, al) => { ctx.save(); ctx.globalAlpha *= al; ctx.translate(o[0], o[1]); ctx.rotate(rot); ctx.strokeStyle = "#7A4A2A"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a[0] - x, a[1] - y); ctx.lineTo(b[0] - x, b[1] - y); ctx.stroke(); ctx.strokeStyle = "#E0A46A"; ctx.lineWidth = 9; ctx.stroke(); ctx.restore(); };
      if (stt.on){ if (stt.fx != null && t < stt.fx + .5){ const q = eOut(clamp((t - stt.fx) / .5, 0, 1)); drawR([lerp(760, x, q), lerp(y - 60, y, q)], (1 - q) * 1.2, 1); } else drawR([x, y], 0, 1); }
      else { ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
        if (stt.vn != null && t < stt.vn + .9){ const q = clamp((t - stt.vn) / .9, 0, 1); drawR([x + q * 60, y + q * q * 520], q * 3, 1 - q); } } });
    // labels
    rg.forEach((r, k) => { if (t < T[k] || !r.label) return; const [x, y] = rungPt(k, n), stt = rungState(k), kk = popAt(t, T[k], .4), off = !stt.on;
      ctx.save(); ctx.setLineDash([8, 8]); ctx.strokeStyle = off ? RED : (D ? "rgba(250,248,243,.4)" : hexA(INK, .35)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + px + 14, y + py); ctx.lineTo(588, y); ctx.stroke(); ctx.restore();
      scaled(ctx, 590, y, kk, () => { const o = tag(ctx, th, r.label, 590, y, { align: "left", bg: off ? (D ? "#4A4038" : "#D9CFC2") : M.pal[k % 3], fg: off ? (D ? "#B8AE9D" : "#6B6457") : "#fff", size: 30, maxW: 390, lines: 2 });
        if (off){ ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(o.x0 + 14, y); ctx.lineTo(o.x0 + o.w - 14, y); ctx.stroke(); } }); });
    // flag ribbon on a rung
    const fg = f.flag; if (fg){ const FT = at(s, fg.cue, .4); if (t >= FT){ const [x, y] = rungPt(fg.rung || 0, n), kq = popAt(t, FT, .4), fx = x - px * .2, fy = y - py * .2;
      scaled(ctx, fx, fy, kq, () => { ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(fx, fy, 12, 0, TAU); ctx.fill(); for (let j = 0; j < 2; j++){ const w = Math.sin(t * 7 + j) * 10; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.quadraticCurveTo(fx - 30 - j * 10, fy + 30 + w, fx - 50 - j * 18, fy + 64 + w * .6); ctx.lineTo(fx - 36 - j * 18, fy + 66 + w * .6); ctx.quadraticCurveTo(fx - 18 - j * 10, fy + 30 + w, fx, fy); ctx.fill(); } });
      if (fg.label) scaled(ctx, 590, y + 62, popAt(t, FT + .2, .4), () => tag(ctx, th, fg.label, 590, y + 62, { align: "left", bg: YEL, fg: INK, size: 26, maxW: 390, icon: "pin" })); } }
    // the climber
    const auto = P.blocks.map(b => ({ at: b.T, expr: "worried", emote: "!" }));
    Object.keys(P.fixes).forEach(k => auto.push({ at: P.fixes[k] + .5, expr: "smile" }));
    if (GT != null) auto.push({ at: GT, pose: "cheer", expr: "happy", emote: "sparkle" });
    const [ax, ay] = lvlPt(lv.L, n), a = withKeys(f.actor, auto, ax), st = actorState(a, s, t);
    st.x = ax; const onFloor = ay > 1290; st.walking = lv.mov && onFloor; if (!onFloor && lv.L < n && (st.pose === "stand" || lv.mov)) st.pose = "cheer";
    ctx.save(); if (lv.L < -1) ctx.globalAlpha *= clamp(lv.L + 2, 0, 1); const r = drawActor(ctx, th, a, st, t, ay, a.scale || .42); ctx.restore();
    if (lv.L >= -1) overlay(ctx, th, a, st, r, t);
    if (reached) burst(ctx, 905, 640, t - GT, M, 10);
    ctx.restore();
  }, (s, f, i, add) => { const P = ladderPlan(s, f, i); (f.rungs || []).forEach((r, k) => { if (r.label) add(cueT(s, r.cue, .15 + k * .18, i), "pop"); });
    Object.values(P.vans).forEach(T => add(T, "whoosh")); Object.values(P.fixes).forEach(T => add(T, "chime")); P.blocks.forEach(b => add(b.T, "ping")); if (P.goalT != null) add(P.goalT, "chime");
    if (f.flag) add(cueT(s, f.flag.cue, .4, i), "pop"); });

  /* =====================================================================
     dam: a reservoir behind a dam with a sluice gate. Inflows pour in (level rises);
     requests arrive downstream; the gate lifts to release water (level falls) or stays locked (deny).
     f: headline, highlight, label, start (0-1), inflows:[{label, cue, amt}], outs:[{label, icon, cue, amt, deny, denyLabel, emptyLabel}]
     ===================================================================== */
  const WB = 1288, WT = 770;
  function damPlan(s, f, idx){
    const ev = (f.inflows || []).map((x, k) => ({ T: at(s, x.cue, .1 + k * .15, idx), x, inn: true }))
      .concat((f.outs || []).map((x, k) => ({ T: at(s, x.cue, .3 + k * .2, idx), x, k, inn: false }))).sort((a, b) => a.T - b.T);
    let lvl = f.start != null ? f.start : .3;
    ev.forEach(e => { e.L0 = lvl;
      if (e.inn){ e.d = Math.min(1 - lvl, e.x.amt != null ? e.x.amt : .25); e.t0 = e.T + .3; e.t1 = e.t0 + 1.4; }
      else if (e.x.deny){ e.d = 0; e.t0 = e.t1 = e.T + .6; }
      else { const want = e.x.amt != null ? e.x.amt : .25; e.d = -Math.min(lvl, want); e.empty = lvl < want - .01; e.t0 = e.T + .6; e.t1 = e.t0 + Math.max(.7, Math.abs(e.d) * 4); }
      lvl += e.d; });
    return ev;
  }
  TT.layout("dam", "Bendungan", (ctx, th, s, t) => {
    const f = s.f, M = mv(), ev = damPlan(s, f), D = dark(th); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    let L = f.start != null ? f.start : .3; ev.forEach(e => { if (e.d && t >= e.t0) L += e.d * easeIO(clamp((t - e.t0) / (e.t1 - e.t0), 0, 1)); });
    const wy = WB - clamp(L, 0, 1) * (WB - WT), outs = ev.filter(e => !e.inn), ins = ev.filter(e => e.inn);
    const flowing = outs.find(e => !e.x.deny && e.d && t >= e.t0 - .25 && t < e.t1 + .2), denyNow = outs.find(e => e.x.deny && t >= e.t0 && t < e.t0 + 1.2);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // terrain + basin
    ctx.fillStyle = D ? "#5A4232" : "#C9A27A"; ctx.beginPath(); ctx.moveTo(90, 740); ctx.lineTo(118, 740); ctx.lineTo(140, 1290); ctx.lineTo(480, 1290); ctx.lineTo(480, 1320); ctx.lineTo(90, 1320); ctx.closePath(); ctx.fill();
    ctx.fillStyle = D ? "#3A2C22" : "#E9D5BC"; ctx.beginPath(); ctx.moveTo(118, 740); ctx.lineTo(484, 740); ctx.lineTo(484, 1290); ctx.lineTo(140, 1290); ctx.closePath(); ctx.fill();
    // water
    ctx.save(); ctx.beginPath(); ctx.moveTo(118, 740); ctx.lineTo(484, 740); ctx.lineTo(484, 1290); ctx.lineTo(140, 1290); ctx.closePath(); ctx.clip();
    const wg = ctx.createLinearGradient(0, wy, 0, WB); wg.addColorStop(0, "#7CC4E8"); wg.addColorStop(1, "#2E7FA8"); ctx.fillStyle = wg;
    ctx.beginPath(); ctx.moveTo(110, WB + 10); for (let x = 110; x <= 490; x += 10) ctx.lineTo(x, wy + Math.sin(x * .03 + t * 2.4) * 6); ctx.lineTo(490, WB + 10); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 4; ctx.beginPath(); for (let x = 110; x <= 490; x += 10) ctx.lineTo(x, wy + Math.sin(x * .03 + t * 2.4) * 6); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 3; for (let k = 0; k < 4; k++){ const yy = wy + 60 + k * 90; if (yy > WB - 20) break; const xx = 180 + ((t * 30 + k * 140) % 220); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 70, yy); ctx.stroke(); }
    ctx.restore();
    // level ticks on bank
    ctx.strokeStyle = D ? "rgba(250,248,243,.35)" : hexA(INK, .3); ctx.lineWidth = 3; for (let k = 0; k <= 4; k++){ const yy = WB - k * (WB - WT) / 4; ctx.beginPath(); ctx.moveTo(122 + (yy - 740) * .04, yy); ctx.lineTo(150 + (yy - 740) * .04, yy); ctx.stroke(); }
    // inflow pipe + stream
    ctx.fillStyle = "#6B6457"; rr(ctx, 90, 690, 150, 36, 12); ctx.fill(); rr(ctx, 206, 690, 36, 70, 10); ctx.fill(); ctx.fillStyle = "#8C8476"; rr(ctx, 198, 744, 52, 18, 6); ctx.fill();
    ins.forEach(e => { if (t < e.T || t > e.t1 + .3) return; const a = clamp(Math.min((t - e.T) / .3, (e.t1 + .3 - t) / .3), 0, 1); ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = "#7CC4E8"; rr(ctx, 208, 760, 32, wy - 760, 14); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.6)"; for (let k = 0; k < 5; k++){ const yy = 770 + fr(t * 1.8 + k / 5) * (wy - 780); rr(ctx, 216, yy, 8, 26, 4); ctx.fill(); }
      ctx.fillStyle = "rgba(255,255,255,.8)"; for (let k = 0; k < 6; k++){ const aa = k / 6 * Math.PI + Math.PI, rr2 = 26 + fr(t * 2 + k * .3) * 30; ctx.beginPath(); ctx.arc(224 + Math.cos(aa) * rr2, wy + Math.sin(aa) * rr2 * .5, 5, 0, TAU); ctx.fill(); } ctx.restore(); });
    const lastIn = ins.filter(e => t >= e.T).pop();
    if (lastIn) scaled(ctx, 260, 640, popAt(t, lastIn.T, .4), () => tag(ctx, th, "+ " + (lastIn.x.label || ""), 260, 640, { align: "left", bg: TEAL, fg: "#fff", size: 32, maxW: 700 }));
    // reservoir plaque
    if (f.label) tag(ctx, th, f.label, 305, 1236, { bg: "#FFF7EE", fg: INK, size: 30, maxW: 320, stroke: hexA(INK, .2), lw: 3 });
    // downstream ground + channel
    ctx.fillStyle = D ? "#5A4232" : "#C9A27A"; ctx.fillRect(570, 1250, 420, 70);
    ctx.fillStyle = D ? "#2A2622" : "#8C6A4A"; rr(ctx, 570, 1262, 420, 26, 8); ctx.fill();
    if (flowing){ const a = clamp(Math.min((t - flowing.t0 + .25) / .3, (flowing.t1 + .2 - t) / .3), 0, 1); ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = "#7CC4E8"; rr(ctx, 570, 1264, 420, 22, 8); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.7)"; for (let k = 0; k < 6; k++){ const xx = 570 + fr(t * 1.5 + k / 6) * 400; rr(ctx, xx, 1270, 26, 6, 3); ctx.fill(); }
      ctx.strokeStyle = "#7CC4E8"; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(574, 1236); ctx.quadraticCurveTo(624, 1236, 644, 1268); ctx.stroke(); ctx.restore(); }
    // dam wall
    ctx.fillStyle = D ? "#8C8476" : "#B8AE9D"; ctx.beginPath(); ctx.moveTo(480, 726); ctx.lineTo(548, 726); ctx.lineTo(592, 1290); ctx.lineTo(480, 1290); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(59,36,24,.25)"; ctx.lineWidth = 3; for (let y = 790; y < 1290; y += 70){ ctx.beginPath(); ctx.moveTo(480, y); ctx.lineTo(548 + (y - 726) * .078, y); ctx.stroke(); }
    ctx.fillStyle = "#6B6457"; rr(ctx, 472, 712, 84, 20, 6); ctx.fill();
    // gate (slides up) + wheel
    const gOpen = flowing ? clamp(Math.min((t - flowing.t0 + .25) / .3, (flowing.t1 + .2 - t) / .3), 0, 1) : 0, gy = 1180 - gOpen * 90;
    ctx.fillStyle = "#2B2118"; ctx.fillRect(504, 1176, 70, 114);
    rr(ctx, 498, gy, 82, 108, 8); ctx.fillStyle = denyNow && Math.sin(t * 16) > 0 ? RED : "#544E42"; ctx.fill(); ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 4; ctx.stroke();
    for (let k = 0; k < 3; k++){ ctx.fillStyle = "#8C8476"; ctx.fillRect(506, gy + 22 + k * 30, 66, 6); }
    ctx.strokeStyle = "#6B6457"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(539, gy); ctx.lineTo(539, 700); ctx.stroke();
    { const wx = 539, wy2 = 690, ang = outs.reduce((s2, e) => s2 + (e.x.deny ? 0 : clamp((t - e.t0 + .25) / 1.2, 0, 1)), 0) * TAU;
      ctx.strokeStyle = "#D84315"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(wx, wy2, 30, 0, TAU); ctx.stroke(); for (let k = 0; k < 4; k++){ const a2 = ang + k * Math.PI / 2; ctx.beginPath(); ctx.moveTo(wx, wy2); ctx.lineTo(wx + Math.cos(a2) * 30, wy2 + Math.sin(a2) * 30); ctx.stroke(); } }
    if (denyNow){ const k2 = popAt(t, denyNow.t0, .35); scaled(ctx, 539, 1130, k2, () => { ctx.beginPath(); ctx.arc(539, 1130, 34, 0, TAU); ctx.fillStyle = RED; ctx.fill(); icon(ctx, "shield", 521, 1112, 36, "#fff", 2.6); }); }
    // requests downstream
    outs.forEach(e => { if (t < e.T) return; const y = 800 + e.k * 140, q = eOut(clamp((t - e.T) / .45, 0, 1)), x = lerp(1200, 790, q);
      const st = e.x.deny ? (t >= e.t0 ? "deny" : "wait") : (e.empty && t >= e.t1 ? "empty" : (t >= e.t0 + .3 ? "ok" : "wait"));
      const bg = st === "ok" ? GREEN : st === "deny" || st === "empty" ? RED : "#FFFFFF", fgc = st === "wait" ? INK : "#fff";
      if (st === "wait"){ ctx.save(); ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = D ? "rgba(250,248,243,.5)" : hexA(INK, .4); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 160, y + 24); ctx.quadraticCurveTo(600, y + 60, 585, 1170); ctx.stroke(); ctx.restore(); }
      const o = tag(ctx, th, e.x.label || "", x, y, { bg, fg: fgc, size: 33, maxW: 400, lines: 2, icon: e.x.icon, stroke: st === "wait" ? hexA(INK, .2) : null, lw: 3 });
      if (st !== "wait") badge(ctx, st === "ok", o.x0 + o.w - 4, y - o.h / 2 + 2, 20, popAt(t, st === "ok" ? e.t0 + .3 : (st === "deny" ? e.t0 : e.t1), .35));
      const note = st === "deny" ? e.x.denyLabel : st === "empty" ? e.x.emptyLabel : st === "ok" ? e.x.okLabel : null;
      if (note) scaled(ctx, 790, y + o.h / 2 + 26, popAt(t, st === "deny" ? e.t0 + .2 : st === "empty" ? e.t1 + .2 : e.t0 + .5, .35), () => tag(ctx, th, note, 790, y + o.h / 2 + 26, { bg: D ? "#2A2622" : "#FFFFFF", fg: st === "ok" ? GREEN : RED, size: 26, maxW: 380, stroke: st === "ok" ? GREEN : RED, lw: 2 }));
      if (st === "ok") burst(ctx, x, y, t - e.t0 - .3, M, 7); });
    ctx.restore();
  }, (s, f, i, add) => { damPlan(s, f, i).forEach(e => { if (e.inn) add(e.T, "whoosh"); else { add(e.T, "pop"); if (e.x.deny) add(e.t0, "ping"); else { add(e.t0, "whoosh"); if (e.empty) add(e.t1, "ping"); } } }); });

  /* =====================================================================
     jar: notes are written on a slip (letters appear), folded into a paper star and dropped into a
     glass jar that glows warmer as it fills. Optional person beside the jar writes and drops them.
     f: headline, highlight, label (sticker on the jar), notes:[{label, cue}], prefill, glowCue, glowLabel, actor
     ===================================================================== */
  function jarTimes(s, f, idx){ let prev = -9; const T = (f.notes || []).map((x, k) => { const c = Math.max(at(s, x.cue, .12 + k * .22, idx), prev + 1.1); prev = c; return c; });
    return T.map((c, k) => { const F = Math.max(c + .9, Math.min(k + 1 < T.length ? T[k + 1] - .15 : c + 2.4, c + 2.4)); return { T: c, F, L: F + .85 }; }); }
  const STARC = ["#E8A317", "#F4A85C", "#E9806A", "#7CC4E8", "#9BD3A8"];
  TT.layout("jar", "Toples catatan", (ctx, th, s, t) => {
    const f = s.f, M = mv(), notes = f.notes || [], D = dark(th); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const JT = jarTimes(s, f), hasA = !!f.actor, jc = hasA ? 650 : 540, J0 = 812, J1 = 1292, pre = f.prefill || 0, GT = f.glowCue ? at(s, f.glowCue, .85) : null, glow = GT != null && t >= GT;
    const pile = i => { const row = Math.floor(i / 5), col = i % 5; return [jc - 124 + col * 62 + (row % 2) * 28 + (rnd(i) - .5) * 14, J1 - 34 - row * 44]; };
    const landed = JT.filter(j => t >= j.L).length + pre, total = notes.length + pre;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // person
    let AR = null; if (hasA){ const auto = []; JT.forEach(j => { auto.push({ at: j.T, pose: "work", expr: "smile" }); auto.push({ at: j.F, pose: "point" }); auto.push({ at: j.L + .3, pose: "stand" }); }); if (glow) auto.push({ at: GT, pose: "cheer", expr: "happy" });
      const a = withKeys(f.actor, auto, f.actor.x || 250), st = actorState(a, s, t); AR = [a, st, drawActor(ctx, th, a, st, t, 1300, a.scale || .62)]; }
    // shelf
    ctx.fillStyle = D ? "#4A4038" : "#CBBBA6"; rr(ctx, jc - 250, J1, 500, 22, 8); ctx.fill();
    // glow inside jar
    const gl = clamp(landed / Math.max(3, total), 0, 1) * .55 + (glow ? .35 + .1 * Math.sin(t * 4) : 0);
    if (gl > 0){ const gg = ctx.createRadialGradient(jc, J1 - 120, 10, jc, J1 - 120, 360); gg.addColorStop(0, `rgba(255,214,120,${gl})`); gg.addColorStop(1, "rgba(255,214,120,0)"); ctx.fillStyle = gg; ctx.fillRect(jc - 380, J0 - 200, 760, 760); }
    // jar back glass
    rr(ctx, jc - 182, J0, 364, J1 - J0, 70); ctx.fillStyle = D ? "rgba(207,231,238,.14)" : "rgba(207,231,238,.35)"; ctx.fill();
    // stars inside
    ctx.save(); rr(ctx, jc - 182, J0, 364, J1 - J0, 70); ctx.clip();
    for (let i = 0; i < pre; i++){ const [x, y] = pile(i); ctx.save(); ctx.translate(x, y); ctx.rotate(rnd(i + 9) * TAU); ctx.fillStyle = STARC[i % 5]; star(ctx, 0, 0, 26); ctx.restore(); }
    JT.forEach((j, k) => { if (t < j.F + .5) return; const [x, y] = pile(pre + k), q = clamp((t - j.F - .5) / .35, 0, 1), yy = lerp(J0 - 20, y, q * q) - (q >= 1 ? Math.abs(Math.sin(clamp((t - j.L) / .3, 0, 1) * Math.PI)) * 12 : 0);
      ctx.save(); ctx.translate(lerp(jc, x, q), yy); ctx.rotate(rnd(pre + k + 9) * TAU + (1 - q) * 4); ctx.fillStyle = STARC[(pre + k) % 5]; star(ctx, 0, 0, 26); ctx.restore(); });
    if (glow) for (let k = 0; k < 7; k++){ const a = .5 + .5 * Math.sin(t * 5 + k * 1.7); ctx.fillStyle = `rgba(255,255,255,${a * .9})`; star(ctx, jc - 140 + rnd(k + 3) * 280, J0 + 80 + rnd(k + 7) * 300, 8 + a * 6); }
    ctx.restore();
    // jar front: outline + highlight + sticker
    rr(ctx, jc - 182, J0, 364, J1 - J0, 70); ctx.strokeStyle = "#8FB8C4"; ctx.lineWidth = 7; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.45)"; rr(ctx, jc - 150, J0 + 50, 22, J1 - J0 - 130, 11); ctx.fill();
    ctx.fillStyle = D ? "rgba(207,231,238,.25)" : "rgba(207,231,238,.6)"; rr(ctx, jc - 130, J0 - 24, 260, 30, 10); ctx.fill();
    if (f.label) tag(ctx, th, f.label, jc, J0 + 92, { bg: "#FFF7EE", fg: INK, size: 30, maxW: 310, stroke: th.accent, lw: 3 });
    // lid (tilts open while a star drops)
    const dropping = JT.some(j => t >= j.F + .15 && t < j.L + .1), lidA = dropping ? -.6 : 0;
    ctx.save(); ctx.translate(jc - 140, J0 - 24); ctx.rotate(lidA); rr(ctx, 0, -40, 280, 44, 12); ctx.fillStyle = th.accent; ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(8, -32, 264, 6); ctx.restore();
    // count badge
    if (landed > 0){ const lastL = Math.max(...JT.filter(j => t >= j.L).map(j => j.L), -9); scaled(ctx, jc + 170, J0 + 20, lastL > 0 ? .7 + .3 * popAt(t, lastL, .3) : 1, () => { ctx.beginPath(); ctx.arc(jc + 170, J0 + 20, 34, 0, TAU); ctx.fillStyle = TEAL; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.stroke(); font(ctx, 900, 34, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(String(landed), jc + 170, J0 + 32); ctx.textAlign = "left"; }); }
    // slips: write -> fold into star -> drop
    JT.forEach((j, k) => { if (t < j.T || t >= j.F + .5) return; const lab = notes[k].label || "", sy = 650;
      if (t < j.F){ const wq = clamp((t - j.T) / .7, 0, 1), k0 = popAt(t, j.T, .35);
        scaled(ctx, jc, sy, k0, () => { ctx.save(); ctx.translate(jc, sy); ctx.rotate((rnd(k) - .5) * .06); ctx.translate(-jc, -sy);
          const fl = fitLines(ctx, th, lab, hasA ? 480 : 600, 36, 2, 700, 20), w = Math.min(hasA ? 560 : 700, Math.max(...fl.L.map(l => { font(ctx, 700, fl.z, th.fam); return ctx.measureText(l).width; })) + 90), h = fl.L.length * fl.z * 1.2 + 44;
          ctx.fillStyle = "rgba(24,21,15,.18)"; ctx.fillRect(jc - w / 2 + 8, sy - h / 2 + 8, w, h); ctx.fillStyle = "#FFFDF6"; ctx.fillRect(jc - w / 2, sy - h / 2, w, h); ctx.fillStyle = hexA(th.accent, .8); ctx.fillRect(jc - w / 2, sy - h / 2, 10, h);
          ctx.strokeStyle = "rgba(124,196,232,.5)"; ctx.lineWidth = 2; for (let yy = sy - h / 2 + 30; yy < sy + h / 2; yy += fl.z * 1.2){ ctx.beginPath(); ctx.moveTo(jc - w / 2 + 20, yy + fl.z * .55); ctx.lineTo(jc + w / 2 - 14, yy + fl.z * .55); ctx.stroke(); }
          let left = Math.round(lab.length * wq); font(ctx, 700, fl.z, th.fam); ctx.fillStyle = INK; ctx.textAlign = "center";
          fl.L.forEach((l, i2) => { const sh = l.slice(0, Math.max(0, left)); left -= l.length + 1; const full = ctx.measureText(l).width; ctx.textAlign = "left"; ctx.fillText(sh, jc - full / 2, sy + fl.z * .35 + (i2 - (fl.L.length - 1) / 2) * fl.z * 1.2); });
          ctx.textAlign = "left"; ctx.restore(); }); }
      else { const q = clamp((t - j.F) / .5, 0, 1); ctx.save(); ctx.translate(jc, sy + q * 60); ctx.scale(1 - q, (1 - q) * .8 + .2); ctx.fillStyle = "#FFFDF6"; ctx.fillRect(-200, -40, 400, 80); ctx.restore();
        ctx.save(); ctx.translate(jc, sy + q * 60); ctx.rotate(q * 5); ctx.fillStyle = STARC[(pre + k) % 5]; star(ctx, 0, 0, 26 * q); ctx.restore(); } });
    if (glow){ burst(ctx, jc, J0 + 120, t - GT, M, 12); const GL = Math.max(GT + .1, ...JT.map(j => j.F + .5)); if (f.glowLabel && t >= GL) scaled(ctx, jc, 650, popAt(t, GL, .4), () => tag(ctx, th, f.glowLabel, jc, 650, { bg: GREEN, fg: "#fff", size: 38, maxW: hasA ? 600 : 780, icon: "sparkles" })); }
    if (AR) overlay(ctx, th, AR[0], AR[1], AR[2], t);
    ctx.restore();
  }, (s, f, i, add) => { jarTimes(s, f, i).forEach(j => { add(j.T, "pop"); add(j.F, "whoosh"); }); if (f.glowCue) add(cueT(s, f.glowCue, .85, i), "chime"); });

  /* =====================================================================
     radio: a retro radio; on each cue the tuning knob turns and the needle slides to a station.
     Noisy stations crackle (static, jagged waves, red LED); clear ones play smooth waves (green LED).
     f: headline, highlight, stations:[{cue, label, freq 0-1, clear, icon}], offCue, offLabel, actor (optional, right side)
     ===================================================================== */
  function radioTimes(s, f, idx){ return (f.stations || []).map((x, k) => ({ T: at(s, x.cue, .12 + k * .25, idx), x })).sort((a, b) => a.T - b.T); }
  TT.layout("radio", "Radio penala", (ctx, th, s, t) => {
    const f = s.f, M = mv(), D = dark(th); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const ST = radioTimes(s, f), OT = f.offCue ? at(s, f.offCue, .85) : null, off = OT != null && t >= OT, hasA = !!f.actor;
    const x0 = hasA ? 110 : 160, w = hasA ? 580 : 760, x1 = x0 + w, rc = x0 + w / 2, Y0 = 800, Y1 = 1140;
    let cur = null, prevF = .1, fq = .1; ST.forEach((e, k) => { if (t >= e.T){ cur = e; prevF = k ? ST[k - 1].x.freq : .1; } });
    if (cur){ const q = easeIO(clamp((t - cur.T) / .8, 0, 1)); fq = lerp(prevF != null ? prevF : .1, cur.x.freq != null ? cur.x.freq : .5, q); }
    const tuning = cur && t - cur.T < .8 && !off, clear = cur && !tuning && cur.x.clear && !off, noisy = cur && !off && (tuning || !cur.x.clear), on = cur && !off;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // antenna + signal
    const axb = x1 - 100, ayb = Y0, axt = x1 - 20, ayt = 612;
    ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(axb, ayb); ctx.lineTo(axt, ayt); ctx.stroke(); ctx.beginPath(); ctx.arc(axt, ayt, 10, 0, TAU); ctx.fillStyle = on ? (clear ? GREEN : RED) : "#8C8476"; ctx.fill();
    if (clear){ ctx.strokeStyle = GREEN; ctx.lineWidth = 6; for (let r = 0; r < 3; r++){ const q = fr(t * .9 + r / 3); ctx.globalAlpha = (1 - q) * .9; ctx.beginPath(); ctx.arc(axt, ayt, 24 + q * 110, -2.6, -.5); ctx.stroke(); } ctx.globalAlpha = 1; }
    else if (noisy){ ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.lineJoin = "round"; for (let r = 0; r < 3; r++){ const q = fr(t * 1.4 + r / 3), rad = 24 + q * 110; ctx.globalAlpha = (1 - q) * .9; ctx.beginPath();
        for (let a = -2.6; a <= -.5; a += .12){ const j = (rnd(Math.floor(t * 18) + a * 50 + r) - .5) * 22; ctx.lineTo(axt + Math.cos(a) * (rad + j), ayt + Math.sin(a) * (rad + j)); } ctx.stroke(); } ctx.globalAlpha = 1;
      noiseDots(ctx, x0, 600, w, 190, 40, t, .7, D ? "#FAF8F3" : "#544E42"); }
    // handle
    ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x0 + 130, Y0 + 6); ctx.quadraticCurveTo(x0 + 130, Y0 - 70, rc - 40, Y0 - 70); ctx.lineTo(rc + 40, Y0 - 70); ctx.quadraticCurveTo(x1 - 200, Y0 - 70, x1 - 200, Y0 + 6); ctx.stroke();
    // body
    const shake = noisy ? Math.sin(t * 60) * 1.5 : 0;
    ctx.save(); ctx.translate(shake, 0);
    ctx.fillStyle = "rgba(24,21,15,.22)"; rr(ctx, x0 + 10, Y0 + 12, w, Y1 - Y0, 46); ctx.fill();
    rr(ctx, x0, Y0, w, Y1 - Y0, 46); ctx.fillStyle = "#8E4E2E"; ctx.fill(); rr(ctx, x0 + 22, Y0 + 22, w - 44, Y1 - Y0 - 44, 30); ctx.fillStyle = "#F3E3CC"; ctx.fill();
    // speaker
    const scx = x0 + w * .27, scy = (Y0 + Y1) / 2, sr = Math.min(118, w * .2), vib = on ? 1 + (clear ? .025 * Math.sin(t * 26) : .04 * (rnd(Math.floor(t * 30)) - .5)) : 1;
    ctx.save(); ctx.translate(scx, scy); ctx.scale(vib, vib); ctx.beginPath(); ctx.arc(0, 0, sr, 0, TAU); ctx.fillStyle = "#5A3A2A"; ctx.fill();
    ctx.fillStyle = "#3B2418"; for (let yy = -sr + 16; yy < sr; yy += 22) for (let xx = -sr + 16; xx < sr; xx += 22){ if (xx * xx + yy * yy < (sr - 14) * (sr - 14)){ ctx.beginPath(); ctx.arc(xx, yy, 6, 0, TAU); ctx.fill(); } }
    ctx.restore();
    if (noisy) noiseDots(ctx, scx - sr, scy - sr, sr * 2, sr * 2, 30, t, .8, "#FFFFFF");
    // dial window + needle
    const wx = x0 + w * .5, ww = w * .44, wy = Y0 + 46, wh = 92;
    rr(ctx, wx, wy, ww, wh, 14); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.strokeStyle = "#E8B23A"; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = "#FFE08A"; ctx.lineWidth = 2; for (let k = 0; k <= 20; k++){ const xx = wx + 16 + k * (ww - 32) / 20; ctx.beginPath(); ctx.moveTo(xx, wy + 14); ctx.lineTo(xx, wy + (k % 5 ? 28 : 38)); ctx.stroke(); }
    font(ctx, 700, 18, th.fam); ctx.fillStyle = "#FFE08A"; ctx.textAlign = "center"; [88, 93, 98, 103, 108].forEach((v, k) => ctx.fillText(String(v), wx + 16 + k * (ww - 32) / 4, wy + 66)); ctx.textAlign = "left";
    if (noisy) noiseDots(ctx, wx + 4, wy + 4, ww - 8, wh - 8, 18, t, .6, "#FFFFFF");
    const nx = wx + 16 + fq * (ww - 32); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(nx, wy + 8); ctx.lineTo(nx, wy + wh - 8); ctx.stroke();
    // LED + knobs
    const lx = wx + 24, ly = Y1 - 112; ctx.beginPath(); ctx.arc(lx, ly, 14, 0, TAU); ctx.fillStyle = !on ? "#8C8476" : clear ? GREEN : (Math.sin(t * 14) > 0 ? RED : "#7A2A10"); ctx.fill();
    if (on){ ctx.beginPath(); ctx.arc(lx, ly, 26, 0, TAU); ctx.fillStyle = hexA(clear ? GREEN : RED, .25); ctx.fill(); }
    font(ctx, 800, 20, th.fam); ctx.fillStyle = INK; ctx.fillText(on ? (clear ? "JERNIH" : "KRESEK") : "OFF", lx + 26, ly + 7);
    const kx = x1 - 92, ky = Y1 - 96; ctx.save(); ctx.translate(kx, ky); ctx.rotate(fq * 9 + (off ? 0 : 0)); ctx.beginPath(); ctx.arc(0, 0, 52, 0, TAU); ctx.fillStyle = "#5A3A2A"; ctx.fill();
    ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 4; for (let k = 0; k < 16; k++){ const a = k / 16 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 44, Math.sin(a) * 44); ctx.lineTo(Math.cos(a) * 52, Math.sin(a) * 52); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = "#8E5A34"; ctx.fill(); ctx.fillStyle = "#FFE08A"; rr(ctx, -5, -32, 10, 22, 5); ctx.fill(); ctx.restore();
    if (tuning){ ctx.strokeStyle = th.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(kx, ky, 66, -1.2 + t * 4, .3 + t * 4); ctx.stroke(); }
    const vx = wx + 24, vy = Y1 - 56; ctx.save(); ctx.translate(vx, vy); ctx.rotate(off ? -2.2 * clamp((t - OT) / .5, 0, 1) : 0); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ctx.fillStyle = "#FFE08A"; ctx.fillRect(-3, -20, 6, 12); ctx.restore();
    ctx.restore();
    // station label
    const lab = off ? (f.offLabel || "") : cur ? cur.x.label : null, lT = off ? OT : cur ? cur.T + .5 : 0;
    if (lab && (off || t >= lT)){ const jit = noisy && !off ? (rnd(Math.floor(t * 20)) - .5) * 10 : 0;
      scaled(ctx, rc, 1222, popAt(t, lT, .35), () => { const o = tag(ctx, th, lab, rc + jit, 1222, { bg: off ? (D ? "#2A2622" : "#FFFFFF") : clear ? "#FFFFFF" : RED, fg: off ? (D ? "#FAF8F3" : INK) : clear ? INK : "#fff", size: 36, maxW: hasA ? 600 : 800, lines: 2, icon: off ? "check" : cur.x.icon, stroke: clear ? GREEN : null, lw: 5 });
        if (noisy && !off) noiseDots(ctx, o.x0, 1222 - o.h / 2, o.w, o.h, 14, t, .5, "#FFFFFF"); }); }
    // listener
    if (hasA){ const auto = []; ST.forEach(e => auto.push({ at: e.T + .8, expr: e.x.clear ? "happy" : "worried", emote: e.x.clear ? "heart" : "sweat", pose: e.x.clear ? "stand" : "think" })); if (OT != null) auto.push({ at: OT + .3, expr: "smile", pose: "stand", emote: f.offEmote || "sparkle" });
      const a = withKeys(f.actor, auto, f.actor.x || 865), st = actorState(a, s, t), r = drawActor(ctx, th, a, st, t, 1305, a.scale || .74); overlay(ctx, th, a, st, r, t); }
    ctx.restore();
  }, (s, f, i, add) => { radioTimes(s, f, i).forEach(e => { add(e.T, "whoosh"); add(e.T + .8, e.x.clear ? "chime" : "pop"); }); if (f.offCue) add(cueT(s, f.offCue, .85, i), "pop"); });

  /* =====================================================================
     aquarium: a fish tank. Labelled fish swim in on cue; ink drops cloud the water (murk),
     a filter clears it (cleanCue); a glass divider can split the tank, sending each fish to its side.
     f: headline, highlight, fish:[{label, cue, color, side:"L"|"R"}], murk:[{label, cue}], murkPer, cleanCue, cleanLabel, divider:{cue, left, right}
     ===================================================================== */
  const TX0 = 120, TX1 = 960, TY0 = 622, TY1 = 1196, SURF = 668, SAND = 1140;
  const FISHC = ["#F4A85C", "#E9806A", "#E8A317", "#7CC4E8", "#9BD3A8", "#C2691F"];
  function drawFish(ctx, x, y, dir, col, t, k, sad){ ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); const wag = Math.sin(t * 9 + k) * .25;
    ctx.save(); ctx.translate(-50, 0); ctx.rotate(wag); ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-40, -30); ctx.lineTo(-32, 0); ctx.lineTo(-40, 30); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, 58, 34, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-10, -30); ctx.quadraticCurveTo(6, -54, 22, -30); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(-4, 10, 30, 10, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(30, -8, 10, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); ctx.beginPath(); ctx.arc(33, -8, 5, 0, TAU); ctx.fillStyle = INK; ctx.fill();
    if (sad){ ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(20, -24); ctx.lineTo(38, -20); ctx.stroke(); ctx.beginPath(); ctx.arc(46, 14, 6, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
    else { ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(44, 6, 6, .2, Math.PI * .8); ctx.stroke(); }
    ctx.restore(); }
  function aqZones(f){ const fish = f.fish || [], all = fish.map((_, i) => i), L = fish.map((x, i) => x.side === "L" ? i : -1).filter(i => i >= 0), R = fish.map((x, i) => x.side === "R" ? i : -1).filter(i => i >= 0); return { all, L, R }; }
  TT.layout("aquarium", "Akuarium", (ctx, th, s, t) => {
    const f = s.f, M = mv(), fish = f.fish || [], D = dark(th); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const FT = fish.map((x, k) => at(s, x.cue, .1 + k * .18)), MK = (f.murk || []).map((x, k) => ({ T: at(s, x.cue, .15 + k * .2), x })), CT = f.cleanCue ? at(s, f.cleanCue, .8) : null;
    const DT = f.divider ? at(s, f.divider.cue, .3) : null, divQ = DT != null ? easeIO(clamp((t - DT) / .8, 0, 1)) : 0, Z = aqZones(f);
    const per = f.murkPer != null ? f.murkPer : Math.min(.3, .85 / Math.max(1, MK.length));
    let mk = MK.reduce((a, m) => a + per * clamp((t - m.T - .55) / 1.2, 0, 1), 0); if (CT != null && t >= CT) mk *= 1 - easeIO(clamp((t - CT) / 1.6, 0, 1)); mk = clamp(mk, 0, .9);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // stand
    ctx.fillStyle = "rgba(24,21,15,.2)"; rr(ctx, 148, 1206, 800, 108, 16); ctx.fill(); rr(ctx, 140, 1196, 800, 108, 16); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(150, 1204, 780, 6);
    // tank water
    ctx.save(); rr(ctx, TX0, TY0, TX1 - TX0, TY1 - TY0, 24); ctx.clip();
    ctx.fillStyle = D ? "rgba(207,231,238,.12)" : "rgba(207,231,238,.45)"; ctx.fillRect(TX0, TY0, TX1 - TX0, SURF - TY0);
    const wg = ctx.createLinearGradient(0, SURF, 0, TY1); wg.addColorStop(0, "#BFE6F2"); wg.addColorStop(1, "#5FB3D3"); ctx.fillStyle = wg;
    ctx.beginPath(); ctx.moveTo(TX0, TY1); for (let x = TX0; x <= TX1; x += 12) ctx.lineTo(x, SURF + Math.sin(x * .025 + t * 2) * 5); ctx.lineTo(TX1, TY1); ctx.closePath(); ctx.fill();
    // sand + pebbles
    ctx.fillStyle = "#E8CFA0"; ctx.beginPath(); ctx.moveTo(TX0, TY1); for (let x = TX0; x <= TX1; x += 20) ctx.lineTo(x, SAND + Math.sin(x * .02) * 10); ctx.lineTo(TX1, TY1); ctx.closePath(); ctx.fill();
    for (let k = 0; k < 18; k++){ ctx.fillStyle = ["#C9A27A", "#B8AE9D", "#D9A066"][k % 3]; ctx.beginPath(); ctx.ellipse(TX0 + 30 + rnd(k) * (TX1 - TX0 - 60), SAND + 26 + rnd(k + 5) * 24, 12, 8, 0, 0, TAU); ctx.fill(); }
    // seaweed
    [[170, 0], [230, 1], [860, 2], [915, 0]].forEach(([x, k]) => { ctx.strokeStyle = ["#3E7D4F", "#5A9E5F", "#2F6F4F"][k]; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, SAND + 20);
      for (let j = 1; j <= 6; j++) ctx.lineTo(x + Math.sin(t * 1.4 + j * .7 + x) * 12 * j / 3, SAND + 20 - j * 48); ctx.stroke(); });
    // bubbles
    for (let k = 0; k < 10; k++){ const q = fr(t * .35 + k / 10), bx = 200 + Math.sin(q * 12 + k) * 10 + (k % 2) * 520, by = SAND - q * (SAND - SURF); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx, by, 5 + (k % 3) * 3, 0, TAU); ctx.stroke(); }
    // fish
    const home = (i, side) => { const idxs = side === "L" ? Z.L : side === "R" ? Z.R : Z.all, j = Math.max(0, idxs.indexOf(i)), m = Math.max(1, idxs.length);
      const zx0 = side === "L" ? TX0 + 30 : side === "R" ? 560 : TX0 + 30, zx1 = side === "L" ? 520 : side === "R" ? TX1 - 30 : TX1 - 30, cx = (zx0 + zx1) / 2, ax = Math.max(20, (zx1 - zx0) / 2 - 110);
      return { cx, ax, cy: SURF + 60 + (j + .5) * ((SAND - SURF - 130) / m), zx0, zx1 }; };
    const labs = [];
    fish.forEach((fs, i) => { if (t < FT[i]) return; const ph = i * 2.1, h0 = home(i, null), h1 = fs.side && DT != null ? home(i, fs.side) : h0, bq = fs.side ? divQ : 0;
      const pos = h => [h.cx + h.ax * Math.sin(t * .32 + ph), h.cy + 10 * Math.sin(t * 1.3 + ph)];
      const p0 = pos(h0), p1 = pos(h1); let x = lerp(p0[0], p1[0], bq), y = lerp(p0[1], p1[1], bq);
      const ent = eOut(clamp((t - FT[i]) / 1.1, 0, 1)), ex = i % 2 ? TX1 + 120 : TX0 - 120; x = lerp(ex, x, ent);
      let dir = Math.cos(t * .32 + ph) >= 0 ? 1 : -1; if (ent < 1) dir = i % 2 ? -1 : 1; if (bq > 0 && bq < 1) dir = Math.sign(p1[0] - p0[0]) || dir;
      ctx.save(); ctx.globalAlpha *= 1 - mk * .5; drawFish(ctx, x, y, dir, fs.color || FISHC[i % FISHC.length], t, i, mk > .3); ctx.restore();
      const hz = bq > .5 ? h1 : h0; const mw = Math.min(320, hz.zx1 - hz.zx0 - 20); labs.push([fs.label, clamp(x, hz.zx0 + mw / 2, hz.zx1 - mw / 2), y + 56, FT[i], mw]); });
    // murk cloud
    if (mk > 0){ ctx.fillStyle = `rgba(110,92,64,${mk * .62})`; ctx.fillRect(TX0, SURF - 6, TX1 - TX0, TY1 - SURF);
      for (let k = 0; k < 40; k++){ ctx.fillStyle = `rgba(70,56,40,${mk * .7})`; ctx.beginPath(); ctx.arc(TX0 + fr(rnd(k) + t * .02 * (k % 3 + 1)) * (TX1 - TX0), SURF + 20 + rnd(k + 3) * (SAND - SURF), 4 + (k % 4) * 3, 0, TAU); ctx.fill(); } }
    MK.forEach((m, k) => { const q = clamp((t - m.T - .2) / .4, 0, 1); if (q <= 0 || t > m.T + 2) return; const dx = 300 + (k % 3) * 240, yy = lerp(TY0 - 10, SURF + 60, q * q);
      if (q < 1){ ctx.fillStyle = "#4A3A28"; ctx.beginPath(); ctx.moveTo(dx, yy - 30); ctx.bezierCurveTo(dx + 20, yy, dx + 16, yy + 18, dx, yy + 20); ctx.bezierCurveTo(dx - 16, yy + 18, dx - 20, yy, dx, yy - 30); ctx.fill(); }
      else { const u = clamp((t - m.T - .6) / 1.4, 0, 1); ctx.fillStyle = `rgba(70,56,40,${.55 * (1 - u)})`; ctx.beginPath(); ctx.arc(dx, SURF + 60 + u * 40, 20 + u * 150, 0, TAU); ctx.fill(); } });
    // filter whirl when cleaning
    if (CT != null && t >= CT && t < CT + 2.4){ const q = clamp((t - CT) / 2.4, 0, 1); for (let k = 0; k < 12; k++){ const a = t * 4 + k * TAU / 12, r = 40 + k * 8; ctx.fillStyle = `rgba(255,255,255,${.7 * (1 - q)})`; ctx.beginPath(); ctx.arc(860 + Math.cos(a) * r * .6, 760 + Math.sin(a) * r * .4 + k * 10, 6, 0, TAU); ctx.fill(); } }
    ctx.restore();
    // divider glass
    if (DT != null && t >= DT){ const yb = lerp(TY0 - 560, TY1, divQ); ctx.fillStyle = "rgba(207,231,238,.75)"; ctx.fillRect(534, Math.max(TY0, yb - (TY1 - TY0)), 12, Math.min(TY1, yb) - Math.max(TY0, yb - (TY1 - TY0))); ctx.fillStyle = "#544E42"; ctx.fillRect(528, Math.max(TY0 - 8, yb - (TY1 - TY0) - 8), 24, 10); }
    // glass + rim
    rr(ctx, TX0, TY0, TX1 - TX0, TY1 - TY0, 24); ctx.strokeStyle = D ? "rgba(207,231,238,.7)" : "#8FB8C4"; ctx.lineWidth = 8; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.35)"; rr(ctx, TX0 + 18, TY0 + 60, 16, 380, 8); ctx.fill();
    rr(ctx, TX0 - 10, TY0 - 14, TX1 - TX0 + 20, 24, 10); ctx.fillStyle = "#3B2418"; ctx.fill();
    rr(ctx, 820, TY0 - 46, 110, 40, 10); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.beginPath(); ctx.arc(905, TY0 - 26, 7, 0, TAU); ctx.fillStyle = CT != null && t >= CT ? GREEN : "#8C8476"; ctx.fill();
    // fish labels (on top of glass)
    labs.forEach(([lab, x, y, T0, mw]) => { if (!lab) return; ctx.save(); ctx.globalAlpha *= clamp((t - T0 - .5) / .4, 0, 1) * (1 - mk * .35); tag(ctx, th, lab, x, y, { bg: "#FFFFFF", fg: INK, size: 24, maxW: Math.min(320, mw), stroke: hexA(INK, .25), lw: 2 }); ctx.restore(); });
    // murk labels (above tank)
    MK.forEach((m, k) => { if (t < m.T || !m.x.label) return; const nx = MK[k + 1] && t >= MK[k + 1].T, a = nx ? 0 : clamp(1 - (t - m.T - 2.6) / .4, 0, 1); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; scaled(ctx, 300 + (k % 3) * 240, 588, popAt(t, m.T, .35), () => tag(ctx, th, m.x.label, clamp(300 + (k % 3) * 240, 260, 820), 588, { bg: "#4A3A28", fg: "#fff", size: 28, maxW: 420, icon: m.x.icon || "alert" })); ctx.restore(); });
    if (CT != null && t >= CT){ burst(ctx, 540, 860, t - CT - .6, M, 12); if (f.cleanLabel) scaled(ctx, 540, 588, popAt(t, CT, .4), () => tag(ctx, th, f.cleanLabel, 540, 588, { bg: GREEN, fg: "#fff", size: 34, maxW: 760, icon: "sparkles" })); }
    // divider labels on stand
    if (f.divider && DT != null && t >= DT + .5){ const k2 = popAt(t, DT + .5, .4); [[f.divider.left, 335], [f.divider.right, 745]].forEach(([lab, x], j) => { if (lab) scaled(ctx, x, 1250, k2, () => tag(ctx, th, lab, x, 1250, { bg: j ? th.accent : TEAL, fg: "#fff", size: 30, maxW: 380 })); }); }
    ctx.restore();
  }, (s, f, i, add) => { (f.fish || []).forEach((x, k) => add(cueT(s, x.cue, .1 + k * .18, i), "pop")); (f.murk || []).forEach((x, k) => add(cueT(s, x.cue, .15 + k * .2, i) + .55, "pop"));
    if (f.cleanCue) add(cueT(s, f.cleanCue, .8, i), "chime"); if (f.divider) add(cueT(s, f.divider.cue, .3, i), "whoosh"); });
})();
