/* Scene pack set7a: balloon, kettle, snowball, kite, plane, metronome, ripple, rotary.
   Runs after motion-tangani.js in its own <script>. Canvas 1080x1920; visuals kept in y ~560-1330, text in x 90-990.
   Every scene has a moving object and (optionally) an actor from the stage rig: actor {x, hair, hijab, shirt, skin, glasses, keys:[...]}. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const RED = "#D84315", GREEN = "#3BB273", YEL = "#E8A317", PAPER = "#FFF7EE", SKY = "#7CC4E8";
  const dark = th => th.key === "B";
  const lerp = (a, b, q) => a + (b - a) * q;
  const ramp = (t, T, d) => clamp((t - T) / (d || .5), 0, 1);
  const popAt = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  const DEF_A = { hair: "short", shirt: "#2F6F73", skin: "a" }, DEF_B = { hair: "hijab", hijab: "#2F6F73", shirt: "#E89544", skin: "b" };

  /* ---------- text helpers (always measured, shrunk or wrapped to fit) ---------- */
  function fitFont(ctx, th, txt, maxW, size, weight, min){ let z = size; font(ctx, weight || 700, z, th.fam); while (z > (min || 16) && ctx.measureText(txt).width > maxW){ z -= 1; font(ctx, weight || 700, z, th.fam); } return z; }
  function wrapL(ctx, txt, maxW){ return wrapRich(ctx, String(txt || ""), "", maxW).map(l => l.map(z => z.w).join(" ")).filter(l => l.length); }
  function fitLines(ctx, th, txt, maxW, size, maxL, weight, min){ let z = size;
    for (;;){ font(ctx, weight || 700, z, th.fam); const L = String(txt || "").split("\n").flatMap(p => wrapL(ctx, p, maxW));
      if ((L.length <= maxL && L.every(l => ctx.measureText(l).width <= maxW)) || z <= (min || 16)) return { z, L: L.slice(0, maxL) }; z -= 1; } }
  // pill tag (1–n lines) anchored at cx (center/left/right), vertically centred at cy; kept inside x 90–990
  function tag(ctx, th, txt, cx, cy, o){ o = o || {}; const size = o.size || 32, maxW = Math.min(o.maxW || 800, 900), pad = size * .72, icS = o.icon ? size * 1.05 : 0, inner = maxW - pad * 2 - (icS ? icS + 10 : 0);
    const r = fitLines(ctx, th, txt, inner, size, o.lines || 1, o.weight || 800, o.min || 18), z = r.z, lh = z * 1.18;
    const tw = Math.max(...r.L.map(l => ctx.measureText(l).width), 10), ic = o.icon ? z * 1.05 : 0, w = tw + pad * 2 + (ic ? ic + 10 : 0), h = z * .85 + lh * r.L.length;
    let x0 = o.align === "right" ? cx - w : o.align === "left" ? cx : cx - w / 2; x0 = clamp(x0, 90, 990 - w);
    rr(ctx, x0, cy - h / 2, w, h, Math.min(h / 2, 30)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 4; ctx.stroke(); }
    if (ic) icon(ctx, o.icon, x0 + pad * .75, cy - ic / 2, ic, o.fg || INK, 2.4);
    font(ctx, o.weight || 800, z, th.fam); ctx.fillStyle = o.fg || INK; ctx.textAlign = "left";
    r.L.forEach((l, k) => ctx.fillText(l, x0 + pad + (ic ? ic + 8 : 0), cy + z * .36 + (k - (r.L.length - 1) / 2) * lh));
    return { x0, w, h };
  }
  function scaled(ctx, x, y, k, fn){ if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); }
  function checkDisc(ctx, x, y, r, col){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || GREEN; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .34); ctx.lineTo(x + r * .45, y - r * .3); ctx.stroke(); }

  /* ---------- actors ---------- */
  const ARM = { point: [1.5, 1.55], phone: [2.3, 3.9], rest: [.35, -.95], stand: [.15, .08], wave: [2.7, 2.9], cheer: [2.75, 2.95], thumbs: [.45, 2.75], talk: [.55, -.5], type: [.35, -.95], cross: [.35, -1.95], think: [.3, 3.5] };
  function handAt(x, gy, sc, pose, sit, dir){ const [u, f] = ARM[pose] || ARM.stand, hipY = sit ? -112 : -182, neckY = hipY - 150;
    return [x + (dir || 1) * (44 + Math.sin(u) * 72 + Math.sin(f) * 66) * sc, gy + (neckY + 18 + Math.cos(u) * 72 + Math.cos(f) * 66) * sc]; }
  function person(ctx, th, s, a, t, gy, sc, mod, mirror){
    if (!a) return null; const A = Object.assign({ x: 200 }, a), st = actorState(A, s, t); if (mod) mod(st);
    ctx.save(); if (mirror){ ctx.translate(st.x, 0); ctx.scale(-1, 1); ctx.translate(-st.x, 0); }
    const r = drawActor(ctx, th, A, st, t, gy, sc); ctx.restore(); return { a: A, st, r, gy, sc, mirror };
  }
  function personFx(ctx, th, P, t){ if (!P || !P.r) return; const { a, st, r } = P;
    if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (a.emoteDx || 0), r.headTop - 20, t - st.emoteT, t);
    if (st.say) bubbleAt(ctx, th, st.say, r.headX + (a.bubbleDx || 0), r.headTop - (st.emote ? 90 : 10), st.chat, t - st.sayT); }
  function actorSfx(s, a, i, add){ if (!a) return; keyTimes(s, a.keys, i).forEach(k => {
    if (k.say != null || ["?", "!", "check", "heart", "sparkle"].includes(k.emote)) add(k.T, k.emote === "check" ? "chime" : "pop"); if (k.emote === "ring") add(k.T, "ping"); }); }
  const timesOf = (s, list, base, step, i) => (list || []).map((x, k) => at(s, x.cue, base + k * step, i));

  /* =====================================================================
     balloon: a balloon is pumped up, one word per cue, then pops / deflates / floats.
       f: label, items:[{label, cue}], end:"pop"|"deflate"|"float", endCue, endLabel, popText, actor (pumps, left)
     leak mode (f.leak): starts full, each item escapes as a tag and the balloon shrinks; actor holds the string (right).
     multi mode (f.balloons:[{label, cue, pick}]): several option balloons; at pickCue the picked one glows (pickLabel).
     ===================================================================== */
  function balloonPath(ctx, r){ ctx.beginPath(); ctx.moveTo(0, r * 1.1);
    ctx.bezierCurveTo(-r * .55, r * .98, -r * 1.02, r * .45, -r, -r * .05); ctx.bezierCurveTo(-r * .98, -r * .78, -r * .52, -r * 1.06, 0, -r * 1.06);
    ctx.bezierCurveTo(r * .52, -r * 1.06, r * .98, -r * .78, r, -r * .05); ctx.bezierCurveTo(r * 1.02, r * .45, r * .55, r * .98, 0, r * 1.1); ctx.closePath(); }
  function balloonText(ctx, th, r, lines){ const maxW = r * 1.42, maxH = r * 1.4; let z = Math.min(46, r * .3);
    const sz = l => z * (l.big ? 1.15 : 1);
    const fits = () => { let H = 0, ok = true; lines.forEach(l => { font(ctx, l.big ? 900 : 800, sz(l), th.fam); if (ctx.measureText(l.txt).width > maxW) ok = false; H += sz(l) * 1.2; }); return ok && H <= maxH; };
    while (z > 13 && !fits()) z -= 1;
    const H = lines.reduce((a, l) => a + sz(l) * 1.2, 0); let y = -r * .04 - H / 2;
    ctx.textAlign = "center"; lines.forEach(l => { const zz = sz(l); y += zz * 1.2; ctx.save(); ctx.globalAlpha *= l.a == null ? 1 : l.a; font(ctx, l.big ? 900 : 800, zz, th.fam);
      ctx.fillStyle = "rgba(59,36,24,.25)"; ctx.fillText(l.txt, 2, y - zz * .3 + 2); ctx.fillStyle = "#fff"; ctx.fillText(l.txt, 0, y - zz * .3); ctx.restore(); }); ctx.textAlign = "left"; }
  function balloonDraw(ctx, th, r, col, lines){
    balloonPath(ctx, r); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "rgba(59,36,24,.28)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, r * 1.08); ctx.lineTo(-11, r * 1.1 + 17); ctx.lineTo(11, r * 1.1 + 17); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    ctx.save(); ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.beginPath(); ctx.ellipse(-r * .5, -r * .48, r * .12, r * .27, .55, 0, TAU); ctx.fill(); ctx.restore();
    if (lines && lines.length && r > 40) balloonText(ctx, th, r, lines);
  }
  function stringTo(ctx, x0, y0, x1, y1, t, col){ ctx.strokeStyle = col || "#7A5A44"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0);
    const mx = (x0 + x1) / 2 + Math.sin(t * 2) * 14, my = (y0 + y1) / 2 + 20; ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke(); }
  function popStar(ctx, th, x, y, u, txt){ if (u < 0 || u > 1) return; const q = eBack(clamp(u / .22, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.globalAlpha *= clamp((1 - u) / .3, 0, 1);
    ctx.beginPath(); for (let k = 0; k < 24; k++){ const rad = k % 2 ? 80 : 135, a = k * TAU / 24; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad * .8); } ctx.closePath(); ctx.fillStyle = YEL; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    font(ctx, 900, 58, th.fam); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(txt || "DOR!", 0, 20); ctx.textAlign = "left"; ctx.restore(); }

  function balloonOne(ctx, th, s, f, t, M){
    const its = f.items || [], n = its.length, T = timesOf(s, its, .15, .18), leak = !!f.leak, end = f.end || null, TE = end ? at(s, f.endCue, .85) : 1e9;
    const col = f.color || th.accent, R0 = f.r0 || (leak ? 225 : 92), R1 = f.r1 || (leak ? 120 : 220), BX = leak ? 620 : 680, KY = 1120;
    const rAt = τ => { let g = 0; T.forEach(T0 => g += eOut(ramp(τ, T0 + .05, .55))); g = n ? g / n : 0; return lerp(R0, R1, g); };
    const r = rAt(Math.min(t, TE)) + Math.sin(t * 2.4) * 3, cyOf = rr_ => KY - rr_ * 1.1 - 16, cy0 = cyOf(rAt(TE));
    const pump = !leak && f.pump !== false;
    // actor: pumps from the left, or (leak) holds the string from the right, facing the balloon
    const A = Object.assign({ x: leak ? 880 : 250 }, DEF_A, f.actor || {}), GY = 1290, SC = .76;
    let P = null;
    if (pump){ const PX = 420; let d = 0; T.forEach(T0 => { const u = (t - T0) / .5; if (u > 0 && u < 1) d = Math.max(d, Math.sin(u * Math.PI)); });
      if (t < TE || end === "pop"){ ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(PX + 28, 1236); ctx.bezierCurveTo(PX + 150, 1290, BX - 30, 1270, BX, KY + 22); ctx.stroke();
        rr(ctx, BX - 12, KY + 8, 24, 22, 6); ctx.fillStyle = "#544E42"; ctx.fill(); }
      const hy = 1012 + d * 62; ctx.fillStyle = "#8C8476"; ctx.fillRect(PX - 6, hy, 12, 1090 - hy);
      rr(ctx, PX - 32, 1080, 64, 170, 16); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.fillStyle = hexA(th.accent, .9); ctx.fillRect(PX - 32, 1130, 64, 14);
      rr(ctx, PX - 70, 1240, 140, 22, 10); ctx.fillStyle = INK; ctx.fill(); rr(ctx, PX - 62, hy - 16, 124, 26, 13); ctx.fillStyle = INK; ctx.fill();
      if (d > .2){ ctx.fillStyle = "rgba(255,255,255,.75)"; for (let k = 0; k < 3; k++){ const q = (d + k * .3) % 1; ctx.beginPath(); ctx.arc(lerp(PX + 120, BX - 30, q), 1262 - Math.sin(q * Math.PI) * 30, 7, 0, TAU); ctx.fill(); } }
      P = person(ctx, th, s, A, t, GY, SC, st => { if (!(f.actor && (f.actor.keys || []).some(k => k.pose))) st.pose = "point"; });
    } else if (f.actor || leak){ P = person(ctx, th, s, A, t, GY, SC, st => { if (!(f.actor && (f.actor.keys || []).some(k => k.pose))) st.pose = "point"; }, true); }
    const lines = []; if (f.label) lines.push({ txt: f.label, big: true });
    its.forEach((it, k) => { if (leak) lines.push({ txt: it.label, a: 1 - ramp(t, T[k], .3) }); else if (t >= T[k]) lines.push({ txt: it.label, a: ramp(t, T[k], .4) }); });
    if (leak){ const hand = P ? handAt(P.st.x, GY, SC, P.st.pose, false, -1) : [BX, 1260];
      stringTo(ctx, BX, KY + 17, hand[0], hand[1], t);
      ctx.save(); ctx.translate(BX + Math.sin(t * 1.3) * 6, cyOf(r)); ctx.rotate(Math.sin(t * 1.1) * .04); balloonDraw(ctx, th, r, col, lines.filter(l => l.a == null || l.a > .02)); ctx.restore();
      // escaping words: puff out of the knot, drift to a column on the left
      its.forEach((it, k) => { if (t < T[k]) return; const q = eOut(ramp(t, T[k], .9)), sx = BX, sy = KY + 10, tx = 90, ty = 650 + k * 112;
        const x = lerp(sx, tx + 150, q) - Math.sin(q * Math.PI) * 60, y = lerp(sy, ty, q) + Math.sin(q * Math.PI) * 60;
        if (q < 1){ ctx.fillStyle = "rgba(255,255,255,.7)"; for (let j = 0; j < 4; j++){ const qq = clamp(q - j * .08, 0, 1); ctx.beginPath(); ctx.arc(lerp(sx, tx + 150, qq), lerp(sy, ty, qq), 10 - j * 2, 0, TAU); ctx.fill(); } }
        ctx.save(); ctx.globalAlpha *= clamp(q * 2, 0, 1); tag(ctx, th, it.label, q < 1 ? x : tx, y, { align: q < 1 ? "center" : "left", size: 30, maxW: 400, lines: 2, bg: PAPER, fg: INK, stroke: th.accent, icon: it.icon || "alert" }); ctx.restore(); });
    } else if (t < TE || end === "float"){
      let bx = BX, by = cyOf(r), rot = Math.sin(t * 1.2) * .04;
      if (end === "float" && t >= TE){ const q = eOut(ramp(t, TE, 1.8)); by -= q * 120; bx += Math.sin(t * 1.4) * 14 * q; rot += Math.sin(t * 1.4) * .06 * q;
        ctx.strokeStyle = "#7A5A44"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx, by + r * 1.1 + 17); for (let k = 1; k <= 10; k++) ctx.lineTo(bx + Math.sin(t * 3 + k * .7) * 10, by + r * 1.1 + 17 + k * 14); ctx.stroke(); }
      ctx.save(); ctx.translate(bx, by); ctx.rotate(rot); balloonDraw(ctx, th, r, col, lines); ctx.restore();
      if (end === "float" && t >= TE){ emoteAt(ctx, th, "sparkle", bx, by - r - 20, t - TE, t); if (f.endLabel) scaled(ctx, BX, 1205, popAt(t, TE + .5), () => tag(ctx, th, f.endLabel, BX, 1205, { size: 32, maxW: 520, bg: GREEN, fg: "#fff", icon: "check" })); }
    } else if (end === "pop"){ const u = t - TE, rE = rAt(TE);
      for (let k = 0; k < 14; k++){ const a = k * TAU / 14 + .2, v = 360 + (k % 3) * 140; if (u > 1.5) break;
        ctx.save(); ctx.globalAlpha *= clamp(1.5 - u, 0, 1); ctx.translate(BX + Math.cos(a) * v * u, cy0 + Math.sin(a) * v * u * .8 + 520 * u * u); ctx.rotate(u * 9 + k); ctx.fillStyle = col;
        ctx.beginPath(); ctx.moveTo(-16, -6); ctx.quadraticCurveTo(0, -18, 16, -4); ctx.lineTo(11, 9); ctx.quadraticCurveTo(0, 0, -13, 9); ctx.closePath(); ctx.fill(); ctx.restore(); }
      popStar(ctx, th, BX, cy0, u / 1.1, f.popText);
      // the words fly out and settle around where the balloon was
      its.forEach((it, k) => { if (T[k] > TE) return; const q = eBack(clamp((u - .1) / .6, 0, 1)), a = -Math.PI / 2 + (k - (n - 1) / 2) * (n > 3 ? .62 : .85);
        const x = BX + Math.cos(a) * 250 * q, y = cy0 + Math.sin(a) * 175 * q + 30; if (q <= 0) return;
        scaled(ctx, x, y, clamp(q, 0, 1.2), () => tag(ctx, th, it.label, x, y, { size: 32, maxW: 300, bg: "#FFFFFF", fg: INK, stroke: RED, lw: 4 })); });
      if (f.endLabel) scaled(ctx, BX, cy0 + 40, popAt(t, TE + .9), () => tag(ctx, th, f.endLabel, BX, cy0 + 40, { size: 34, maxW: 560, bg: RED, fg: "#fff", icon: "alert" }));
    } else if (end === "deflate"){ const u = t - TE, q = clamp(u / 2.2, 0, 1), rE = rAt(TE), rr_ = lerp(rE, rE * .3, eOut(q));
      const x = BX + Math.sin(u * 6.5) * 190 * (1 - q) - q * 140, y = lerp(cy0, 1215, easeIO(q)) - Math.sin(q * Math.PI) * 200, rot = Math.sin(u * 9) * .9 * (1 - q) + q * 1.5;
      if (q < 1){ ctx.fillStyle = "rgba(255,255,255,.75)"; for (let j = 1; j < 6; j++){ const uu = Math.max(0, u - j * .07), qq = clamp(uu / 2.2, 0, 1);
        ctx.beginPath(); ctx.arc(BX + Math.sin(uu * 6.5) * 190 * (1 - qq) - qq * 140, lerp(cy0, 1215, easeIO(qq)) - Math.sin(qq * Math.PI) * 200 + 60, 12 - j * 1.6, 0, TAU); ctx.fill(); } }
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); if (q >= 1) ctx.scale(1, .6); balloonDraw(ctx, th, rr_, col, lines.map(l => Object.assign({}, l, { a: (l.a == null ? 1 : l.a) * (1 - clamp(u * 1.5, 0, 1)) }))); ctx.restore();
      if (f.endLabel) scaled(ctx, BX, cy0, popAt(t, TE + 1.6), () => tag(ctx, th, f.endLabel, BX, cy0, { size: 34, maxW: 560, bg: RED, fg: "#fff", icon: "alert" }));
    }
    if (P) personFx(ctx, th, P, t);
  }
  function balloonMulti(ctx, th, s, f, t, M){
    const bs = f.balloons, n = bs.length, xs = n === 2 ? [330, 750] : n === 3 ? [235, 540, 845] : bs.map((b, k) => 200 + k * 680 / Math.max(1, n - 1));
    const R = f.r || (n <= 2 ? 150 : 118), T = timesOf(s, bs, .15, .25), TP = f.pickCue ? at(s, f.pickCue, .8) : 1e9, cols = [th.accent, "#2F6F73", "#B87333", "#E8A317"];
    const A = Object.assign({ x: 540 }, DEF_B, f.actor || {}), GY = 1300, SC = .66;
    const P = person(ctx, th, s, A, t, GY, SC, st => { if (!(f.actor && (f.actor.keys || []).some(k => k.pose))) st.pose = "cheer"; });
    const hands = [handAt(P.st.x, GY, SC, P.st.pose, false, 1), handAt(P.st.x, GY, SC, P.st.pose, false, -1)];
    bs.forEach((b, k) => { if (t < T[k]) return; const q = eBack(clamp((t - T[k]) / .6, 0, 1)), pick = t >= TP ? (b.pick ? 1 : -1) : 0, pq = eBack(ramp(t, TP, .6));
      const sc = q * (pick > 0 ? 1 + .14 * pq : pick < 0 ? 1 - .1 * pq : 1), r = R * sc, x = xs[k] + Math.sin(t * 1.3 + k * 2) * 10, cy = 850 - (k % 2) * 45 - (pick > 0 ? 30 * pq : 0) + Math.sin(t * 1.7 + k) * 8;
      const hd = xs[k] < P.st.x ? hands[1] : hands[0];
      ctx.save(); if (pick < 0) ctx.globalAlpha *= 1 - .5 * pq;
      stringTo(ctx, x, cy + r * 1.1 + 17, hd[0], hd[1], t + k);
      if (pick > 0){ const g = ctx.createRadialGradient(x, cy, r * .6, x, cy, r * 1.7); g.addColorStop(0, hexA(YEL, .45 * pq)); g.addColorStop(1, hexA(YEL, 0)); ctx.fillStyle = g; ctx.fillRect(x - r * 1.8, cy - r * 1.8, r * 3.6, r * 3.6); }
      ctx.translate(x, cy); ctx.rotate(Math.sin(t * 1.2 + k) * .05); balloonDraw(ctx, th, r, b.color || cols[k % cols.length], [{ txt: b.label, big: true }].concat(b.sub ? [{ txt: b.sub }] : [])); ctx.restore();
      if (pick > 0){ burst(ctx, x, cy - r, t - TP, M, 9); if (f.pickLabel) scaled(ctx, x, cy - r * 1.06 - 34, pq, () => tag(ctx, th, f.pickLabel, x, cy - r * 1.06 - 34, { size: 28, maxW: 380, bg: GREEN, fg: "#fff", icon: "star" })); }
    });
    personFx(ctx, th, P, t);
  }
  TT.layout("balloon", "Balon ditiup", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    if (f.balloons) balloonMulti(ctx, th, s, f, t, M); else balloonOne(ctx, th, s, f, t, M);
    ctx.restore();
  }, (s, f, i, add) => {
    if (f.balloons){ timesOf(s, f.balloons, .15, .25, i).forEach(T => add(T, "pop")); if (f.pickCue) add(at(s, f.pickCue, .8, i), "chime"); }
    else { timesOf(s, f.items, .15, .18, i).forEach(T => add(T, "whoosh")); if (f.end) add(at(s, f.endCue, .85, i), f.end === "float" ? "chime" : f.end === "pop" ? "pop" : "whoosh"); }
    actorSfx(s, f.actor, i, add);
  });

  /* =====================================================================
     kettle: a kettle on a stove; each item adds heat (or cool:true lowers it); a pressure gauge follows;
     at high heat it whistles (steam jet, rattling lid). offCue turns the flame down.
       f: items:[{label, cue, icon, cool}], heat0, whistleCue, offCue, offLabel, gauge, whistleText, actor (left)
     ===================================================================== */
  function kettleHeat(s, f, t, i){
    const its = f.items || [], T = timesOf(s, its, .15, .2, i), nH = its.filter(x => !x.cool).length, nC = its.filter(x => x.cool).length;
    const h0 = f.heat0 != null ? f.heat0 : .12, hs = nH ? (.97 - h0) / nH : 0, peak = h0 + nH * hs, cs = nC ? (peak - .12) / nC : 0, TO = f.offCue ? at(s, f.offCue, .85, i) : 1e9;
    let h = h0; its.forEach((it, k) => h += (it.cool ? -cs : hs) * eOut(ramp(t, T[k] + .15, .9)));
    h = lerp(h, .05, eOut(ramp(t, TO, 1))); return { h: clamp(h, 0, 1), T, TO };
  }
  function kettleWhistleT(s, f, i){ if (f.whistleCue) return at(s, f.whistleCue, .7, i); for (let τ = 0; τ < 40; τ += .05) if (kettleHeat(s, f, τ, i).h > .86) return τ; return null; }
  TT.layout("kettle", "Ketel bersiul", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.items || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { h, T, TO } = kettleHeat(s, f, t), TW = f.whistleCue ? at(s, f.whistleCue, .7) : null, whistle = (TW != null ? t >= TW : h > .86) && t < TO + .3;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // gauge
    const GX = 225, GYc = 690, GR = 92; ctx.beginPath(); ctx.arc(GX, GYc, GR, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
    [[0, .5, GREEN], [.5, .8, YEL], [.8, 1, RED]].forEach(([a, b, c]) => { ctx.strokeStyle = c; ctx.lineWidth = 15; ctx.beginPath(); ctx.arc(GX, GYc, 68, .75 * Math.PI + a * 1.5 * Math.PI, .75 * Math.PI + b * 1.5 * Math.PI); ctx.stroke(); });
    const na = .75 * Math.PI + h * 1.5 * Math.PI + (h > .8 ? Math.sin(t * 34) * .05 : 0);
    ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(GX, GYc); ctx.lineTo(GX + Math.cos(na) * 70, GYc + Math.sin(na) * 70); ctx.stroke();
    ctx.beginPath(); ctx.arc(GX, GYc, 12, 0, TAU); ctx.fillStyle = INK; ctx.fill();
    if (h > .8 && Math.sin(t * 12) > 0){ ctx.strokeStyle = hexA(RED, .6); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(GX, GYc, GR + 12, 0, TAU); ctx.stroke(); }
    if (f.gauge) tag(ctx, th, f.gauge, GX, GYc + GR + 40, { size: 26, maxW: 270, bg: INK, fg: PAPER });
    // stove + flames
    rr(ctx, 380, 1146, 360, 18, 9); ctx.fillStyle = INK; ctx.fill(); rr(ctx, 405, 1164, 310, 84, 16); ctx.fillStyle = dark(th) ? "#6B5A48" : "#544E42"; ctx.fill();
    const ka = lerp(-2.2, .9, h); ctx.beginPath(); ctx.arc(470, 1206, 22, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(470, 1206); ctx.lineTo(470 + Math.cos(ka) * 18, 1206 + Math.sin(ka) * 18); ctx.stroke();
    for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(560 + k * 46, 1206, 8, 0, TAU); ctx.fillStyle = k / 2 <= h ? (h > .8 ? RED : YEL) : "#8C8476"; ctx.fill(); }
    for (let k = 0; k < 7; k++){ const fx = 445 + k * 38, fl = (12 + h * 78) * (.8 + .2 * Math.sin(t * 13 + k * 1.7)) * (k === 0 || k === 6 ? .7 : 1);
      ctx.beginPath(); ctx.moveTo(fx - 13, 1146); ctx.quadraticCurveTo(fx - 14, 1146 - fl * .5, fx + Math.sin(t * 9 + k) * 4, 1146 - fl); ctx.quadraticCurveTo(fx + 14, 1146 - fl * .5, fx + 13, 1146); ctx.closePath(); ctx.fillStyle = h < .1 ? "#4F8FD9" : "#E8742C"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(fx - 6, 1146); ctx.quadraticCurveTo(fx - 7, 1146 - fl * .3, fx, 1146 - fl * .55); ctx.quadraticCurveTo(fx + 7, 1146 - fl * .3, fx + 6, 1146); ctx.closePath(); ctx.fillStyle = h < .1 ? "#A9D0F5" : YEL; ctx.fill(); }
    // kettle (shakes while whistling)
    const sh = whistle ? Math.sin(t * 46) * 3.5 : 0, lid = whistle ? Math.abs(Math.sin(t * 19)) * 10 : 0;
    ctx.save(); ctx.translate(sh, 0);
    ctx.strokeStyle = INK; ctx.lineWidth = 15; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(482, 948); ctx.bezierCurveTo(470, 828, 650, 828, 638, 948); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(672, 1092); ctx.quadraticCurveTo(745, 1066, 790, 962); ctx.lineTo(812, 972); ctx.quadraticCurveTo(770, 1088, 688, 1118); ctx.closePath(); ctx.fillStyle = "#A0522D"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(428, 1128); ctx.bezierCurveTo(398, 1060, 438, 960, 482, 944); ctx.lineTo(638, 944); ctx.bezierCurveTo(682, 960, 722, 1060, 692, 1128); ctx.closePath();
    const kg = ctx.createLinearGradient(420, 0, 700, 0); kg.addColorStop(0, th.accent); kg.addColorStop(1, "#A0522D"); ctx.fillStyle = kg; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(455, 1090); ctx.quadraticCurveTo(440, 1030, 470, 975); ctx.stroke();
    if (h > .55){ ctx.fillStyle = hexA(RED, (h - .55) * .9); ctx.beginPath(); ctx.ellipse(560, 1095, 110, 26, 0, 0, TAU); ctx.fill(); }
    rr(ctx, 424, 1120, 272, 14, 7); ctx.fillStyle = INK; ctx.fill();
    ctx.beginPath(); ctx.ellipse(560, 944 - lid, 88, 17, whistle ? Math.sin(t * 19) * .06 : 0, 0, TAU); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(560, 924 - lid, 20, 13, 0, 0, TAU); ctx.fillStyle = INK; ctx.fill();
    ctx.restore();
    // steam
    const tipX = 806, tipY = 964, N = Math.round(3 + h * 10), steamC = "rgba(255,255,255,", edge = dark(th) ? "rgba(255,255,255,.0)" : "rgba(59,36,24,.13)";
    for (let k = 0; k < N; k++){ const q = ((t * (.4 + h * .55)) + k / N) % 1, px = tipX + q * 120 + Math.sin(q * 6 + k) * 18, py = tipY - q * 330, rad = 12 + q * 42;
      ctx.beginPath(); ctx.arc(px, py, rad, 0, TAU); ctx.fillStyle = steamC + ((1 - q) * .75 * (.25 + h)).toFixed(3) + ")"; ctx.fill(); ctx.strokeStyle = edge; ctx.lineWidth = 2; ctx.stroke(); }
    if (whistle){ ctx.strokeStyle = dark(th) ? "rgba(255,255,255,.8)" : hexA(INK, .55); ctx.lineWidth = 5; ctx.lineCap = "round";
      for (let k = 0; k < 4; k++){ const o = ((t * 3 + k / 4) % 1); ctx.globalAlpha = 1 - o; ctx.beginPath(); ctx.moveTo(tipX + 20 + o * 120, tipY - 18 - k * 12 - o * 50); ctx.lineTo(tipX + 70 + o * 120, tipY - 30 - k * 12 - o * 60); ctx.stroke(); }
      ctx.globalAlpha = 1; const wt = f.whistleText || "Tuiiit!", wz = fitFont(ctx, th, wt, 220, 46, 900, 24); ctx.save(); ctx.translate(880 + Math.sin(t * 30) * 3, 820); ctx.rotate(-.12);
      ctx.fillStyle = dark(th) ? th.ink : RED; ctx.textAlign = "center"; ctx.fillText(wt, 0, 0); ctx.textAlign = "left"; ctx.restore(); }
    if (TO < 1e9 && t >= TO){ checkDisc(ctx, 880, 860, 44 * popAt(t, TO + .6)); burst(ctx, 880, 860, t - TO - .6, M, 8);
      if (f.offLabel) scaled(ctx, 860, 945, popAt(t, TO + .8), () => tag(ctx, th, f.offLabel, 860, 945, { size: 28, maxW: 300, lines: 2, bg: GREEN, fg: "#fff" })); }
    // item tags (fuel / relief) along the bottom
    const n = its.length, slot = 900 / Math.max(1, n);
    its.forEach((it, k) => { const x = 90 + slot * (k + .5), q = popAt(t, T[k], .4); if (!q) return;
      scaled(ctx, x, 1288, q, () => tag(ctx, th, it.label, x, 1288, { size: 27, maxW: slot - 12, lines: 2, min: 18, bg: it.cool ? GREEN : th.accent, fg: "#fff", icon: it.icon || (it.cool ? "check" : null) })); });
    // actor (left), optional
    const P = f.actor ? person(ctx, th, s, Object.assign({ x: 190 }, DEF_A, f.actor), t, 1240, .66) : null; personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, f.items, .15, .2, i).forEach(T => add(T, "pop")); const tw = kettleWhistleT(s, f, i); if (tw != null) add(tw, "ping"); if (f.offCue) add(at(s, f.offCue, .85, i) + .6, "chime"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     snowball: a snowball rolls down a snowy slope and grows with every cue; a flag + tag marks each step,
     the latest value rides above the ball. bad:true = a dirty snowball of trouble (red tags).
       f: items:[{label, cue, value}], startLabel, startValue, bad, actor (pushes it; bad: stands at the bottom right)
     ===================================================================== */
  const SL = { ax: 90, ay: 830, bx: 990, by: 1150 }, SLEN = Math.hypot(900, 320), SN = [320 / SLEN, -900 / SLEN];
  const slopeY = x => SL.ay + (x - SL.ax) * (SL.by - SL.ay) / (SL.bx - SL.ax);
  TT.layout("snowball", "Bola salju", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.items || [], n = its.length, bad = !!f.bad; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = timesOf(s, its, .15, .18), u0 = .2, u1 = bad ? .62 : .76, r0 = f.r0 || 32, r1 = f.r1 || (bad ? 118 : 148);
    let g = 0, moving = false; T.forEach(T0 => { const p = ramp(t, T0, 1); g += easeIO(p); if (p > 0 && p < 1) moving = true; }); g = n ? g / n : 0;
    const u = lerp(u0, u1, g), r = r0 * Math.pow(r1 / r0, g), px = SL.ax + u * 900, py = slopeY(px), cx = px + SN[0] * r, cy = py + SN[1] * r;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // snowflakes
    for (let k = 0; k < 22; k++){ const fx = (k * 137 + Math.sin(t * .7 + k) * 30 + 2000) % 900 + 90, fy = 580 + ((k * 211 + t * (30 + k % 5 * 8)) % 720);
      ctx.beginPath(); ctx.arc(fx, fy, 3 + k % 3, 0, TAU); ctx.fillStyle = dark(th) ? "rgba(255,255,255,.5)" : hexA(SKY, .55); ctx.fill(); }
    // hill
    ctx.save(); rr(ctx, 90, 600, 900, 730, 40); ctx.clip();
    ctx.beginPath(); ctx.moveTo(SL.ax - 10, SL.ay); ctx.lineTo(SL.bx + 10, SL.by); ctx.lineTo(1000, 1340); ctx.lineTo(80, 1340); ctx.closePath();
    const hg = ctx.createLinearGradient(0, 820, 0, 1330); hg.addColorStop(0, "#FBFDFE"); hg.addColorStop(1, "#DCEBF0"); ctx.fillStyle = hg; ctx.fill();
    ctx.strokeStyle = "#A9C7D2"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(SL.ax - 10, SL.ay); ctx.lineTo(SL.bx + 10, SL.by); ctx.stroke();
    const sx0 = SL.ax + u0 * 900; ctx.strokeStyle = bad ? "rgba(156,122,96,.45)" : "rgba(143,184,196,.55)"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx0, slopeY(sx0) + 7); ctx.lineTo(px, py + 7); ctx.stroke();
    ctx.restore();
    // flags + tags (two staggered rows inside the hill)
    const dx = 900 * (u1 - u0) / Math.max(1, n), tw = Math.min(310, dx * 2 - 16);
    const mark = (x, row, txt, q, k) => { const y = slopeY(x), ty = row ? 1290 : 1222; if (q <= 0) return;
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y + 4); ctx.lineTo(x, y - 46 * q); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - 46 * q); ctx.lineTo(x + 30 * q, y - 38 * q); ctx.lineTo(x, y - 30 * q); ctx.closePath(); ctx.fillStyle = bad ? RED : M.pal[k % 3]; ctx.fill();
      ctx.setLineDash([5, 7]); ctx.strokeStyle = "rgba(59,36,24,.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 12); ctx.lineTo(x, ty - 26); ctx.stroke(); ctx.setLineDash([]);
      scaled(ctx, x, ty, q, () => tag(ctx, th, txt, x, ty, { size: 26, maxW: tw, min: 17, bg: bad ? RED : INK, fg: "#fff" })); };
    if (f.startLabel) mark(sx0, 0, f.startLabel, popAt(t, .3), 0);
    its.forEach((it, k) => mark(SL.ax + 900 * (u0 + (u1 - u0) * (k + 1) / n), (k + 1) % 2, it.label, popAt(t, T[k] + .75), k + 1));
    // actor (pusher, or bystander at the bottom when bad)
    let P = null;
    if (f.actor){ const SC = .6;
      if (bad){ const ax = f.actor.x || 940; P = person(ctx, th, s, Object.assign({}, DEF_A, f.actor, { x: ax }), t, slopeY(ax), SC); }
      else { const pose = r < 80 ? "rest" : "point", ax = cx - r - (pose === "point" ? 150 : 40) * SC - 18;
        P = person(ctx, th, s, Object.assign({}, DEF_A, f.actor, { x: ax }), t, slopeY(ax), SC, st => { st.x = ax; st.walking = moving; if (!st.pose || st.pose === "stand") st.pose = pose; }); } }
    // snow spray
    if (moving){ for (let k = 0; k < 7; k++){ const q = ((t * 2.2) + k / 7) % 1; ctx.beginPath(); ctx.arc(px - SN[1] * 0 - q * 60 - k * 4, py - q * 50 + q * q * 60, 6 * (1 - q) + 2, 0, TAU); ctx.fillStyle = bad ? "rgba(156,122,96,.6)" : "rgba(255,255,255,.95)"; ctx.fill(); ctx.strokeStyle = "rgba(124,196,232,.5)"; ctx.lineWidth = 1.5; ctx.stroke(); } }
    // the ball
    const rot = u * SLEN / Math.max(20, r) * .9;
    ctx.save(); ctx.translate(cx, cy);
    ctx.beginPath(); ctx.ellipse(0, r * .92, r * .9, r * .16, .34, 0, TAU); ctx.fillStyle = "rgba(59,36,24,.12)"; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); const bg = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r); bg.addColorStop(0, bad ? "#F2E6DA" : "#FFFFFF"); bg.addColorStop(1, bad ? "#CBB09A" : "#CFE3EA"); ctx.fillStyle = bg; ctx.fill();
    ctx.strokeStyle = bad ? "#8E6B52" : "#8FB8C4"; ctx.lineWidth = 5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r - 3, 0, TAU); ctx.clip(); ctx.rotate(rot);
    for (let k = 0; k < 4; k++){ ctx.strokeStyle = bad ? "rgba(142,107,82,.45)" : "rgba(143,184,196,.6)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, r * (.3 + k * .17), k * 1.7, k * 1.7 + 1.5); ctx.stroke(); }
    if (bad) for (let k = 0; k < 9; k++){ const a = k * 2.4, d = r * (.2 + (k % 4) * .2); ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 3 + r * .03, 0, TAU); ctx.fillStyle = "#6B4A33"; ctx.fill(); }
    ctx.restore(); ctx.restore();
    // value above the ball
    let val = f.startValue || null, vT = .3; its.forEach((it, k) => { if (it.value != null && t >= T[k] + .3){ val = it.value; vT = T[k] + .3; } });
    if (val != null){ const k2 = .8 + .2 * popAt(t, vT, .35), vx = cx + Math.max(0, 80 - r) * 1.3; scaled(ctx, vx, cy - r - 42, k2, () => tag(ctx, th, String(val), vx, cy - r - 42, { size: 36, maxW: 380, bg: bad ? RED : th.accent, fg: "#fff" })); }
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, f.items, .15, .18, i).forEach((T, k) => add(T + .75, k === (f.items || []).length - 1 && !f.bad ? "chime" : "whoosh")); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     kite: a person flies a kite; every cue is a gust that lifts it to the next level (tag on the left);
     an item with dip:true makes it drop a level (red tag on the right).
       f: items:[{label, cue, icon, dip}], kiteLabel, actor
     ===================================================================== */
  TT.layout("kite", "Layang-layang", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.items || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const T = timesOf(s, its, .15, .2), nUp = its.filter(x => !x.dip).length || 1;
    let L = 0, gust = 0, dip = 0; its.forEach((it, k) => { if (it.dip){ const Tn = k + 1 < its.length ? T[k + 1] : 1e9; dip = Math.max(dip, easeIO(ramp(t, T[k], .8)) * (1 - easeIO(ramp(t, Tn, 1.1)))); }
      else L += easeIO(ramp(t, T[k], 1.2)); if (t >= T[k]) gust = Math.max(gust, 1 - ramp(t, T[k], 1.8)); });
    const q = clamp(L / nUp, 0, 1), Y0 = 1030, Y1 = 655, lvY = j => lerp(Y0, Y1, j / nUp);
    const kx = lerp(610, 780, q) + Math.sin(t * 1.3) * 18 + dip * 40, ky = lerp(Y0, Y1, q) + Math.sin(t * 1.9) * 12 + dip * (190 + Math.sin(t * 9) * 10);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // clouds + wind
    for (let k = 0; k < 3; k++){ const x = ((t * (14 + k * 5) + k * 400) % 1300) - 160, y = 640 + k * 150; ctx.fillStyle = dark(th) ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.85)";
      ctx.beginPath(); ctx.ellipse(x, y, 90, 30, 0, 0, TAU); ctx.ellipse(x - 40, y - 18, 46, 30, 0, 0, TAU); ctx.ellipse(x + 34, y - 24, 52, 36, 0, 0, TAU); ctx.fill(); }
    ctx.lineCap = "round";
    for (let k = 0; k < 8; k++){ const ph = (t * (.32 + gust * .7) + k * .37) % 1, y = 610 + k * 82 + Math.sin(k * 3.1) * 20, x = 40 + ph * 1040, a = Math.sin(ph * Math.PI) * (.12 + gust * .45);
      ctx.strokeStyle = dark(th) ? `rgba(250,248,243,${a})` : hexA(INK, a); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 150, y); ctx.bezierCurveTo(x - 100, y - 16, x - 50, y + 16, x, y); ctx.stroke(); }
    // level tags (left) and dip tags (right)
    let j = 0; its.forEach((it, k) => { const qq = popAt(t, T[k] + .5); if (it.dip){ if (qq && dip > .05) scaled(ctx, 980, Math.min(1290, ky + 170), qq, () => tag(ctx, th, it.label, 990, Math.min(1290, ky + 170), { align: "right", size: 28, maxW: 330, bg: RED, fg: "#fff", icon: it.icon || "alert" })); return; }
      j++; const y = lvY(j); if (!qq) return;
      ctx.setLineDash([10, 12]); ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.25)" : hexA(INK, .2); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(470, y); ctx.lineTo(kx - 110, y); ctx.stroke(); ctx.setLineDash([]);
      scaled(ctx, 90, y, qq, () => tag(ctx, th, it.label, 90, y, { align: "left", size: 30, maxW: 380, bg: "#FFFFFF", fg: INK, stroke: M.pal[j % 3], icon: it.icon || "sparkles" })); });
    // actor + string
    const A = Object.assign({ x: 200 }, DEF_A, f.actor || {}), GY = 1300, SC = .74;
    const P = person(ctx, th, s, A, t, GY, SC, st => { if (!(f.actor && (f.actor.keys || []).some(k => k.pose))) st.pose = "point"; });
    const hd = handAt(P.st.x, GY, SC, P.st.pose, P.st.sit, 1);
    ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.8)" : INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(hd[0], hd[1]); ctx.quadraticCurveTo((hd[0] + kx) / 2 + 30, (hd[1] + ky) / 2 + 90, kx, ky + 20); ctx.stroke();
    ctx.beginPath(); ctx.arc(hd[0], hd[1], 15, 0, TAU); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    // tail
    ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.8)" : INK; ctx.lineWidth = 3; ctx.beginPath(); const tail = [];
    for (let k = 0; k <= 6; k++){ const tx = kx - k * 24 + Math.sin(t * 4 - k * .9) * (10 + k * 3), ty = ky + 130 + k * 38; tail.push([tx, ty]); k ? ctx.lineTo(tx, ty) : ctx.moveTo(tx, ty); } ctx.stroke();
    tail.slice(1).forEach(([x, y], k) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 5 + k) * .5); ctx.fillStyle = M.pal[k % 3];
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, -10); ctx.lineTo(-16, 10); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(16, -10); ctx.lineTo(16, 10); ctx.closePath(); ctx.fill(); ctx.restore(); });
    // kite
    ctx.save(); ctx.translate(kx, ky); ctx.rotate(Math.sin(t * 1.7) * .1 + gust * .12 + dip * .35);
    const pts = [[0, -125], [88, -22], [0, 130], [-88, -22]], cc = [th.accent, "#F4A85C", "#A0522D", "#FFF7EE"];
    for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(...pts[k]); ctx.lineTo(...pts[(k + 1) % 4]); ctx.closePath(); ctx.fillStyle = cc[k]; ctx.fill(); }
    ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -125); ctx.lineTo(0, 130); ctx.moveTo(-88, -22); ctx.lineTo(88, -22); ctx.stroke();
    if (f.kiteLabel){ const z = fitFont(ctx, th, f.kiteLabel, 120, 26, 900, 14), w = ctx.measureText(f.kiteLabel).width + 20; rr(ctx, -w / 2, 4, w, z + 14, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(f.kiteLabel, 0, 11 + z * .9); ctx.textAlign = "left"; }
    ctx.restore();
    if (gust > .6) burst(ctx, kx, ky - 60, (1 - gust) * 1.8 - .2, M, 6);
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, f.items, .15, .2, i).forEach((T, k) => add(T, (f.items[k] || {}).dip ? "pop" : "whoosh")); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     plane: a sheet is written (title + rows appear on cue), folds into a paper plane at foldCue,
     the actor throws it at throwCue and it glides to a target (second actor or icon disc).
       f: title, rows:[{text, cue}|string], foldCue, throwCue, to:{label, icon}, toActor, landLabel, actor
     ===================================================================== */
  const PL_RECT = [[-260, -180], [260, -180], [260, 180], [-260, 180], [-260, 0]], PL_SHAPE = [[-100, -70], [120, 0], [120, 0], [-100, 70], [-62, 0]];
  function planeTimes(s, f, i){ const TF = at(s, f.foldCue, .5, i), TH = Math.max(at(s, f.throwCue, .7, i), TF + 1.4); return { TF, TH, TL: TH + 1.7 }; }
  function planeShape(ctx, q){ ctx.beginPath(); PL_RECT.forEach((p, k) => { const x = lerp(p[0], PL_SHAPE[k][0], q), y = lerp(p[1], PL_SHAPE[k][1], q); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); }
  function drawPlane(ctx, q){ planeShape(ctx, q); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    if (q > .4){ ctx.save(); ctx.globalAlpha *= clamp((q - .4) / .6, 0, 1); ctx.beginPath(); ctx.moveTo(120, 0); ctx.lineTo(-100, 70); ctx.lineTo(-62, 0); ctx.closePath(); ctx.fillStyle = "#E9DDCF"; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(120, 0); ctx.lineTo(-62, 0); ctx.stroke(); ctx.restore(); } }
  const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };
  TT.layout("plane", "Pesawat kertas", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const rows = (f.rows || []).map(r => typeof r === "string" ? { text: r } : r), TR = rows.map((r, k) => r.cue ? at(s, r.cue, .1 + k * .12) : .25 + k * .2), { TF, TH, TL } = planeTimes(s, f);
    const GY = 1250, SC = .74, SX = 600, SY = 800;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    const A = Object.assign({ x: 190 }, DEF_A, f.actor || {}), B = f.toActor ? Object.assign({ x: 880 }, DEF_B, f.toActor) : null;
    const P = person(ctx, th, s, A, t, GY, SC, st => { if (t >= TF + .9 && t < TH + .9) st.pose = t < TH ? "wave" : "point"; });
    const Q = B ? person(ctx, th, s, B, t, GY, SC, null, true) : null;
    const H = handAt(P.st.x, GY, SC, t < TH ? "wave" : "point", false, 1);
    const E = B ? [Q.st.x - 70, GY - 270 * SC] : [850, 1060];
    if (!B){ const to = f.to || {}; const k = popS(t, .2); scaled(ctx, E[0], E[1], k, () => { ctx.beginPath(); ctx.arc(E[0], E[1], 92, 0, TAU); ctx.fillStyle = hexA(th.accent, .18); ctx.fill(); TT.disc(ctx, to.icon || "users", E[0], E[1], 74, th.accent, "#fff"); });
      if (to.label) tag(ctx, th, to.label, E[0], E[1] + 125, { size: 30, maxW: 300, bg: INK, fg: PAPER }); }
    else if (f.to && f.to.label) tag(ctx, th, f.to.label, Q.st.x, GY + 40, { size: 26, maxW: 280, bg: INK, fg: PAPER });
    if (f.actorLabel) tag(ctx, th, f.actorLabel, P.st.x, GY + 40, { size: 26, maxW: 280, bg: INK, fg: PAPER });
    // sheet -> fold -> to the hand -> flight -> landed
    const fq = easeIO(ramp(t, TF, .9));
    if (t < TF + .9){ const k = popS(t, .1); ctx.save(); ctx.translate(SX, SY); ctx.scale(k * lerp(1, .9, fq), k * lerp(1, .9, fq)); ctx.rotate(-.03 * (1 - fq));
      if (fq < .05){ ctx.fillStyle = "rgba(59,36,24,.14)"; ctx.fillRect(-252, -168, 528, 366); }
      drawPlane(ctx, fq);
      const ta = 1 - clamp(fq / .3, 0, 1); if (ta > 0){ ctx.save(); ctx.globalAlpha *= ta;
        ctx.strokeStyle = hexA(th.accent, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-205, -180); ctx.lineTo(-205, 180); ctx.stroke();
        if (f.title){ const z = fitFont(ctx, th, f.title, 440, 38, 900, 22); ctx.fillStyle = INK; ctx.fillText(f.title, -180, -118); ctx.fillStyle = th.accent; ctx.fillRect(-180, -100, Math.min(440, ctx.measureText(f.title).width), 5); }
        const y0 = f.title ? -40 : -110, gap = Math.min(66, 270 / Math.max(1, rows.length));
        rows.forEach((r, k) => { const q = ramp(t, TR[k], .45); if (q <= 0) return; ctx.save(); ctx.globalAlpha *= q; ctx.translate(-14 * (1 - q), 0);
          ctx.beginPath(); ctx.arc(-158, y0 + k * gap - 10, 9, 0, TAU); ctx.fillStyle = M.pal[k % 3]; ctx.fill();
          const z = fitFont(ctx, th, r.text, 390, 32, 700, 18); ctx.fillStyle = INK; ctx.fillText(r.text, -138, y0 + k * gap); ctx.restore(); });
        ctx.restore(); }
      ctx.restore();
      if (fq > 0 && fq < 1){ ctx.save(); ctx.globalAlpha *= Math.sin(fq * Math.PI); ctx.fillStyle = YEL; for (let k = 0; k < 5; k++){ const a = k * TAU / 5 + t * 3; star(ctx, SX + Math.cos(a) * 200, SY + Math.sin(a) * 130, 14); } ctx.restore(); }
    } else if (t < TH){ const q = easeIO(ramp(t, TF + .9, .5)), x = lerp(SX, H[0] + 30, q), y = lerp(SY, H[1] - 20, q) + Math.sin(t * 3) * 4, sc = lerp(.9, .62, q);
      ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(0, -.25, q)); ctx.scale(sc, sc); drawPlane(ctx, 1); ctx.restore();
    } else { const p0 = [H[0] + 30, H[1] - 20], c1 = [470, 560], c2 = [760, 600], u = clamp((t - TH) / 1.7, 0, 1), uu = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      ctx.setLineDash([12, 14]); ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.5)" : hexA(INK, .35); ctx.lineWidth = 4; ctx.beginPath();
      for (let k = 0; k <= 40; k++){ const v = uu * k / 40, p = bez(p0, c1, c2, E, v); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.setLineDash([]);
      const p = bez(p0, c1, c2, E, uu), p2 = bez(p0, c1, c2, E, Math.min(1, uu + .01)), ang = u < 1 ? Math.atan2(p2[1] - p[1], p2[0] - p[0]) : .25;
      ctx.save(); ctx.translate(p[0], p[1] + (u < 1 ? Math.sin(t * 8) * 5 : 0)); ctx.rotate(ang); ctx.scale(.62, .62); drawPlane(ctx, 1); ctx.restore();
      if (t >= TL){ burst(ctx, E[0], E[1], t - TL, M, 9); if (!B) checkDisc(ctx, E[0] + 62, E[1] - 62, 30 * popAt(t, TL));
        if (f.landLabel) scaled(ctx, E[0], E[1] - (B ? 250 : 150), popAt(t, TL + .2), () => tag(ctx, th, f.landLabel, E[0], E[1] - (B ? 250 : 150), { size: 30, maxW: 380, bg: GREEN, fg: "#fff", icon: "check", align: B ? "right" : "center" })); } }
    personFx(ctx, th, P, t); personFx(ctx, th, Q, t);
    ctx.restore();
  }, (s, f, i, add) => { (f.rows || []).forEach((r, k) => { if (r && r.cue) add(at(s, r.cue, .1 + k * .12, i), "pop"); }); const { TF, TH, TL } = planeTimes(s, f, i);
    add(TF, "whoosh"); add(TH, "whoosh"); add(TL, "chime"); actorSfx(s, f.actor, i, add); actorSfx(s, f.toActor, i, add); });

  /* =====================================================================
     metronome: a wooden metronome swings (tempo per phase), each cue lights the next block of a rhythm
     timeline at the top; optional beat counter (beats:N), chaotic swing until steadyCue, actor at a desk.
       f: items:[{label, cue, rest, tempo}], tempo, beats, steadyCue, tick, actor, desk
     ===================================================================== */
  function metroPhase(s, f, t, i){
    const its = f.items || [], T = timesOf(s, its, .12, .2, i), base = f.tempo || .62, per = k => its[k].tempo || (its[k].rest ? 1.05 : base);
    let ph = 0, prev = 0, pp = base; const ord = T.map((x, k) => [x, k]).sort((a, b) => a[0] - b[0]);
    for (const [Tk, k] of ord){ if (Tk >= t) break; ph += (Math.max(Tk, 0) - prev) * Math.PI / pp; prev = Math.max(Tk, 0); pp = per(k); }
    return { ph: ph + (t - prev) * Math.PI / pp, T };
  }
  TT.layout("metronome", "Metronom", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.items || [], n = its.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { ph, T } = metroPhase(s, f, t), TS = f.steadyCue ? at(s, f.steadyCue, .4) : -1, chaos = t < TS, has = !!f.actor, MX = has ? 300 : 540;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // rhythm timeline (top)
    let cur = -1; T.forEach((T0, k) => { if (t >= T0) cur = k; });
    const gap = 12, sw = (900 - gap * (n - 1)) / Math.max(1, n);
    its.forEach((it, k) => { const x = 90 + k * (sw + gap), q = popAt(t, T[k], .4), y = 572;
      if (!q){ ctx.setLineDash([8, 8]); ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.25)" : hexA(INK, .2); ctx.lineWidth = 3; rr(ctx, x, y, sw, 84, 18); ctx.stroke(); ctx.setLineDash([]); return; }
      const on = k === cur, col = it.rest ? GREEN : th.accent;
      scaled(ctx, x + sw / 2, y + 42, q * (on ? 1 + .04 * Math.sin(t * 6) : 1), () => {
        rr(ctx, x, y, sw, 84, 18); ctx.fillStyle = on ? col : (dark(th) ? "rgba(250,248,243,.12)" : "#FFFFFF"); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.stroke();
        if (on){ const nx = k + 1 < n ? T[k + 1] : TT.sceneDur() - .2, pq = clamp((t - T[k]) / Math.max(.5, nx - T[k]), 0, 1); rr(ctx, x + 10, y + 70, (sw - 20) * pq, 7, 4); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fill(); }
        const r = fitLines(ctx, th, it.label, sw - 22, 31, 2, 800, 15), fg = on ? "#fff" : (dark(th) ? th.ink : INK); ctx.fillStyle = fg; ctx.textAlign = "center";
        r.L.forEach((l, j) => ctx.fillText(l, x + sw / 2, y + 40 + r.z * .36 + (j - (r.L.length - 1) / 2) * r.z * 1.12)); ctx.textAlign = "left"; });
      if (k === cur) burst(ctx, x + sw / 2, y + 42, t - T[k], M, 6); });
    // metronome body
    const BY = 1300, TY = 735, PY = 1220, AL = 450;
    ctx.beginPath(); ctx.moveTo(MX - 150, BY); ctx.lineTo(MX - 58, TY + 20); ctx.quadraticCurveTo(MX, TY - 12, MX + 58, TY + 20); ctx.lineTo(MX + 150, BY); ctx.closePath(); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(MX - 100, PY - 20); ctx.lineTo(MX - 40, TY + 60); ctx.lineTo(MX + 40, TY + 60); ctx.lineTo(MX + 100, PY - 20); ctx.closePath(); ctx.fillStyle = "#F6E3C8"; ctx.fill();
    ctx.strokeStyle = hexA(INK, .35); ctx.lineWidth = 3; for (let y = TY + 90; y < PY - 40; y += 34){ const w = lerp(40, 96, (y - TY - 60) / (PY - TY - 80)); ctx.beginPath(); ctx.moveTo(MX - w * .35, y); ctx.lineTo(MX + w * .35, y); ctx.stroke(); }
    rr(ctx, MX - 172, BY - 8, 344, 30, 12); ctx.fillStyle = INK; ctx.fill();
    // pendulum
    const A = .42, ang = chaos ? .5 * Math.sin(t * 4.3) * Math.sin(t * 1.7 + .5) + .22 * Math.sin(t * 9.1) : A * Math.sin(ph);
    ctx.save(); ctx.translate(MX, PY); ctx.rotate(ang); ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -AL); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-34, -AL * .58); ctx.lineTo(34, -AL * .58); ctx.lineTo(26, -AL * .58 + 50); ctx.lineTo(-26, -AL * .58 + 50); ctx.closePath(); ctx.fillStyle = YEL; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.arc(MX, PY, 16, 0, TAU); ctx.fillStyle = th.accent; ctx.fill();
    // ticks at the ends of each swing
    if (!chaos && t > .3){ const b = Math.floor((ph + Math.PI / 2) / Math.PI), fr = ((ph + Math.PI / 2) / Math.PI) - b, side = b % 2 ? 1 : -1, fl = 1 - clamp(fr / .45, 0, 1);
      if (fl > 0){ ctx.save(); ctx.globalAlpha *= fl; const tx = clamp(MX + side * (Math.sin(A) * AL + 40), 150, 930), ty = PY - Math.cos(A) * AL + 10; font(ctx, 800, 34, th.fam); ctx.fillStyle = th.ink; ctx.textAlign = "center"; ctx.fillText(f.tick || "tik", tx, ty); ctx.textAlign = "left";
        ctx.strokeStyle = hexA(th.accent, .8); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(MX + side * Math.sin(A) * AL, PY - Math.cos(A) * AL, 20 + (1 - fl) * 30, 0, TAU); ctx.stroke(); ctx.restore(); }
      if (f.beats){ const num = String((b % f.beats + f.beats) % f.beats + 1), q = eBack(clamp(fr / .3, 0, 1)); ctx.save(); ctx.translate(has ? MX + 205 : MX + 260, 800); ctx.scale(.6 + .4 * q, .6 + .4 * q);
        ctx.beginPath(); ctx.arc(0, 0, 56, 0, TAU); ctx.fillStyle = th.accent; ctx.fill(); font(ctx, 900, 64, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(num, 0, 23); ctx.textAlign = "left"; ctx.restore(); } }
    if (chaos){ emoteAt(ctx, th, "?", MX + 170, 800, t, t); }
    if (TS > 0 && t >= TS) burst(ctx, MX, TY, t - TS, M, 8);
    // actor (right), optional desk
    let P = null;
    if (has){ const a = Object.assign({ x: 790 }, DEF_A, f.actor), gy = f.desk ? 1262 : 1290, sc = f.desk ? .95 : .8;
      const st0 = actorState(a, s, t); if (st0.sit && f.desk) TT.prop(ctx, th, { type: "chair", x: st0.x }, s, t);
      P = person(ctx, th, s, a, t, gy, sc);
      if (f.desk) TT.prop(ctx, th, { type: "desk", x: 790, w: 300, laptop: true }, s, t); }
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, f.items, .12, .2, i).forEach(T => add(T, "pop")); if (f.steadyCue) add(at(s, f.steadyCue, .4, i), "chime"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     ripple: drops (labels on top) fall into a pond and make rings; effects pop up on the water as the
     rings reach them; calmCue smooths the surface (calmLabel).
       f: drops:[{label, cue, x, bad, icon}], effects:[{label, cue, icon, bad, good}], calmCue, calmLabel, actor (left)
     ===================================================================== */
  const PD = { cx: 590, cy: 1135, rx: 372, ry: 118 };
  const EFX = [[400, 1078], [790, 1078], [400, 1196], [790, 1196]];
  TT.layout("ripple", "Tetes air", (ctx, th, s, t) => {
    const f = s.f, M = mv(), drops = f.drops || [], efx = f.effects || [], n = drops.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const TD = timesOf(s, drops, .12, .2), TE = timesOf(s, efx, .4, .15), TC = f.calmCue ? at(s, f.calmCue, .8) : 1e9, calm = 1 - ramp(t, TC, .9);
    const DX = drops.map((d, k) => d.x || (n === 1 ? PD.cx : PD.cx - 270 + k * 540 / (n - 1))), SY = drops.map((d, k) => PD.cy + (n > 1 ? (k % 2 ? 22 : -22) : 0));
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // pond
    ctx.beginPath(); ctx.ellipse(PD.cx, PD.cy + 10, PD.rx + 30, PD.ry + 24, 0, 0, TAU); ctx.fillStyle = dark(th) ? "#5A4232" : "#D9B892"; ctx.fill();
    for (let k = 0; k < 16; k++){ const a = k * TAU / 16 + .2; ctx.beginPath(); ctx.ellipse(PD.cx + Math.cos(a) * (PD.rx + 20), PD.cy + 10 + Math.sin(a) * (PD.ry + 16), 20, 11, 0, 0, TAU); ctx.fillStyle = k % 2 ? "#C9A57E" : "#B89270"; ctx.fill(); }
    ctx.save(); ctx.beginPath(); ctx.ellipse(PD.cx, PD.cy, PD.rx, PD.ry, 0, 0, TAU); ctx.clip();
    const wg = ctx.createLinearGradient(0, PD.cy - PD.ry, 0, PD.cy + PD.ry); wg.addColorStop(0, dark(th) ? "#2A6B78" : "#9AD3E0"); wg.addColorStop(1, dark(th) ? "#164650" : "#4E9BB0"); ctx.fillStyle = wg; ctx.fillRect(PD.cx - PD.rx, PD.cy - PD.ry, PD.rx * 2, PD.ry * 2);
    let active = 0; TD.forEach(T0 => { const u = t - T0 - .45; if (u > 0 && u < 2.6) active++; });
    const amp = (2 + Math.min(3, active) * 5) * calm + 1.5;
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 3; for (let k = 0; k < 5; k++){ const y = PD.cy - 80 + k * 40; ctx.beginPath(); for (let x = PD.cx - PD.rx; x <= PD.cx + PD.rx; x += 16) ctx.lineTo(x, y + Math.sin(x * .03 + t * (2 + active) + k) * amp * .6); ctx.stroke(); }
    drops.forEach((d, k) => { const TI = TD[k] + .45; for (let j = 0; j < 3; j++){ const q = (t - TI - j * .28) / 2.6; if (q <= 0 || q >= 1) continue; const rx = 16 + q * 340;
      ctx.strokeStyle = `rgba(255,255,255,${((1 - q) * .9 * (.25 + .75 * calm)).toFixed(3)})`; ctx.lineWidth = 6 * (1 - q) + 1.5; ctx.beginPath(); ctx.ellipse(DX[k], SY[k], rx, rx * .31, 0, 0, TAU); ctx.stroke(); } });
    if (t >= TC){ const q = ramp(t, TC, 1.2); ctx.fillStyle = `rgba(255,255,255,${(.28 * q).toFixed(3)})`; ctx.beginPath(); ctx.ellipse(PD.cx - 90, PD.cy - 40, 200, 26, -.05, 0, TAU); ctx.fill(); }
    ctx.restore();
    // reeds
    [[PD.cx - PD.rx + 10, 1], [PD.cx + PD.rx - 10, -1]].forEach(([x, d], j) => { for (let k = 0; k < 3; k++){ const bx = x + d * k * 14, sw = Math.sin(t * 1.4 + k + j) * 6;
      ctx.strokeStyle = "#3E7D4F"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(bx, PD.cy + 30); ctx.quadraticCurveTo(bx + sw, PD.cy - 60, bx + sw * 2 - d * 10, PD.cy - 120 - k * 18); ctx.stroke(); } });
    // drops + splashes
    drops.forEach((d, k) => { const T0 = TD[k]; if (t < T0) return; const q = clamp((t - T0) / .45, 0, 1), y = lerp(690, SY[k], q * q);
      if (q < 1){ ctx.save(); ctx.translate(DX[k], y); ctx.beginPath(); ctx.moveTo(0, -30); ctx.bezierCurveTo(20, -4, 18, 18, 0, 20); ctx.bezierCurveTo(-18, 18, -20, -4, 0, -30); ctx.fillStyle = d.bad ? "#E08A3C" : SKY; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.ellipse(-6, 2, 4, 8, .3, 0, TAU); ctx.fill(); ctx.restore(); }
      const u = t - T0 - .45; if (u > 0 && u < .6){ for (let j = 0; j < 7; j++){ const a = -Math.PI / 2 + (j - 3) * .32, v = 230 + (j % 3) * 50; ctx.beginPath(); ctx.arc(DX[k] + Math.cos(a) * v * u, SY[k] + Math.sin(a) * v * u + 600 * u * u, 6, 0, TAU); ctx.fillStyle = d.bad ? "rgba(224,138,60,.9)" : "rgba(190,230,245,.95)"; ctx.fill(); } } });
    // drop labels (top row)
    drops.forEach((d, k) => { const q = popAt(t, TD[k] - .05); if (!q) return; const mw = n === 1 ? 560 : Math.min(330, 540 / (n - 1) - 14);
      scaled(ctx, DX[k], 620, q, () => tag(ctx, th, d.label, DX[k], 622, { size: n > 3 ? 28 : 30, maxW: mw, lines: 2, min: 17, bg: d.bad ? RED : "#FFFFFF", fg: d.bad ? "#fff" : INK, stroke: d.bad ? null : th.accent, icon: d.icon })); });
    // effects on the water
    efx.forEach((e, k) => { const q = popAt(t, TE[k], .45); if (!q) return; const [x, y] = EFX[k % 4], bob = Math.sin(t * 2.2 + k) * 4;
      scaled(ctx, x, y + bob, q, () => tag(ctx, th, e.label, x, y + bob, { size: 30, maxW: 320, min: 17, bg: e.bad ? RED : e.good ? GREEN : PAPER, fg: e.bad || e.good ? "#fff" : INK, stroke: e.bad || e.good ? null : INK, lw: 3, icon: e.icon })); });
    if (t >= TC && f.calmLabel){ scaled(ctx, PD.cx, PD.cy, popAt(t, TC + .5), () => tag(ctx, th, f.calmLabel, PD.cx, PD.cy, { size: 32, maxW: 460, bg: GREEN, fg: "#fff", icon: "check" })); burst(ctx, PD.cx, PD.cy - 30, t - TC - .5, M, 8); }
    const P = f.actor ? person(ctx, th, s, Object.assign({ x: 130 }, DEF_A, f.actor), t, 1300, .6) : null; personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, f.drops, .12, .2, i).forEach(T => add(T + .45, "pop")); timesOf(s, f.effects, .4, .15, i).forEach(T => add(T, "pop")); if (f.calmCue) add(at(s, f.calmCue, .8, i) + .5, "chime"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     rotary: classic rotary phones.
     call mode: two people on the line (left / right), each with a phone on a side table and a curly cord;
       lines:[{who:"L"|"R", text, cue, noise, cut, dur}] -> speech bubble + a pulse along the cords (noise = jagged red, "?" at the listener);
       ringCue/ringWho rings a phone; left/right: actor + {label, pickCue}; hangCue/hangWho hangs up (line goes dead, "tut... tut...").
     dial mode (f.digits:[{label, caption, cue, n}]): one big phone dials a part per cue; the parts build a string on a display (join);
       doneCue/doneLabel confirms; optional actor on the left.
     ===================================================================== */
  function phoneDraw(ctx, th, x, y, S, o){ o = o || {}; ctx.save(); ctx.translate(x + (o.shake || 0), y); ctx.rotate((o.shake || 0) * .01); ctx.scale(S, S);
    ctx.beginPath(); ctx.moveTo(-138, 70); ctx.lineTo(138, 70); ctx.quadraticCurveTo(146, 70, 142, 58); ctx.lineTo(102, -46); ctx.quadraticCurveTo(96, -58, 82, -58); ctx.lineTo(-82, -58); ctx.quadraticCurveTo(-96, -58, -102, -46); ctx.lineTo(-142, 58); ctx.quadraticCurveTo(-146, 70, -138, 70); ctx.closePath();
    ctx.fillStyle = o.col || th.accent; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4 / Math.min(1, S); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 8, 62, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.translate(0, 8); ctx.rotate(o.rot || 0);
    for (let k = 0; k < 10; k++){ const a = -Math.PI / 3 - k * Math.PI / 6; ctx.beginPath(); ctx.arc(Math.cos(a) * 43, Math.sin(a) * 43, 10.5, 0, TAU); ctx.fillStyle = o.hot === k ? YEL : INK; ctx.fill();
      if (S >= 1.4){ ctx.save(); ctx.translate(Math.cos(a) * 43, Math.sin(a) * 43); ctx.rotate(-(o.rot || 0)); font(ctx, 800, 11, th.fam); ctx.fillStyle = o.hot === k ? INK : "#fff"; ctx.textAlign = "center"; ctx.fillText(String((k + 1) % 10), 0, 4); ctx.textAlign = "left"; ctx.restore(); } }
    ctx.restore(); ctx.beginPath(); ctx.arc(0, 8, 19, 0, TAU); ctx.fillStyle = o.col || th.accent; ctx.fill();
    ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 8, 60, .75, 1.0); ctx.stroke();
    ctx.fillStyle = "#544E42"; [-72, 72].forEach(cx => { rr(ctx, cx - 14, -76, 28, 22, 6); ctx.fill(); });
    if (!o.lifted){ ctx.fillStyle = INK; rr(ctx, -130, -96, 260, 30, 15); ctx.fill(); rr(ctx, -152, -112, 64, 50, 18); ctx.fill(); rr(ctx, 88, -112, 64, 50, 18); ctx.fill(); }
    ctx.restore(); }
  function handset(ctx, x, y, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = INK; rr(ctx, -9, -50, 18, 100, 9); ctx.fill(); rr(ctx, -26, -66, 36, 32, 13); ctx.fill(); rr(ctx, -26, 36, 36, 32, 13); ctx.fill(); ctx.restore(); }
  function coil(ctx, p0, p1, sag, t, col){ const c = [(p0[0] + p1[0]) / 2, Math.max(p0[1], p1[1]) + sag], pts = [];
    for (let k = 0; k <= 160; k++){ const u = k / 160, v = 1 - u, bx = v * v * p0[0] + 2 * v * u * c[0] + u * u * p1[0], by = v * v * p0[1] + 2 * v * u * c[1] + u * u * p1[1], a = u * 16 * TAU;
      pts.push([bx + Math.cos(a) * 7, by + Math.sin(a) * 9]); }
    ctx.strokeStyle = col || INK; ctx.lineWidth = 3.5; ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    return u => { const v = 1 - u; return [v * v * p0[0] + 2 * v * u * c[0] + u * u * p1[0], v * v * p0[1] + 2 * v * u * c[1] + u * u * p1[1]]; }; }
  function rotaryCall(ctx, th, s, f, t, M){
    const GY = 1255, SC = .78, lines = f.lines || [], TLn = timesOf(s, lines, .1, .25), TR = f.ringCue ? at(s, f.ringCue, .1) : null, ringWho = f.ringWho || "R";
    const TH = f.hangCue ? at(s, f.hangCue, .85) : 1e9, hangWho = f.hangWho || "L";
    const side = { L: Object.assign({ x: 190 }, DEF_A, f.left || {}), R: Object.assign({ x: 890 }, DEF_B, f.right || {}) };
    const pick = w => { const sd = (w === "L" ? f.left : f.right) || {}; return sd.pickCue ? at(s, sd.pickCue, .2) : (TR != null && w === ringWho ? TR + 1.2 : -1); };
    const holding = w => t >= pick(w) && !(t >= TH && w === hangWho);
    const PH = { L: [385, 1150], R: [695, 1150] }, out = {};
    // side tables + line
    [["L", 385], ["R", 695]].forEach(([w, x]) => { rr(ctx, x - 95, 1190, 190, 16, 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.fillStyle = "#6B3A22"; ctx.fillRect(x - 9, 1206, 18, GY - 1206); rr(ctx, x - 50, GY - 8, 100, 12, 6); ctx.fill(); });
    const dead = t >= TH, lineCol = dead ? "#B8AE9D" : INK;
    ctx.strokeStyle = dark(th) && !dead ? "#C9B79F" : lineCol; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(PH.L[0] + 80, 1180); ctx.quadraticCurveTo(540, 1262, PH.R[0] - 80, 1180); ctx.stroke();
    const lineAt = u => { const v = 1 - u, p0 = [PH.L[0] + 80, 1180], c = [540, 1262], p1 = [PH.R[0] - 80, 1180]; return [v * v * p0[0] + 2 * v * u * c[0] + u * u * p1[0], v * v * p0[1] + 2 * v * u * c[1] + u * u * p1[1]]; };
    // people + handsets + cords
    ["L", "R"].forEach(w => { const mir = w === "R", hold = holding(w);
      const P = person(ctx, th, s, side[w], t, GY, SC, st => { if (hold) st.pose = "phone"; }, mir); out[w] = P;
      const ring = TR != null && w === ringWho && t >= TR && t < pick(w) ? Math.sin(t * 50) * 4 : 0;
      phoneDraw(ctx, th, PH[w][0], PH[w][1], .6, { lifted: hold, shake: ring, col: w === "L" ? th.accent : "#B87333" });
      if (ring){ emoteAt(ctx, th, "ring", PH[w][0], PH[w][1] - 80, t - TR, t); }
      const ph0 = [PH[w][0] + (mir ? 70 : -70), PH[w][1] + 20];
      if (hold){ const hd = handAt(P.st.x, GY, SC, "phone", false, mir ? -1 : 1), hp = [hd[0] + (mir ? 8 : -8), hd[1] + 4];
        handset(ctx, hp[0], hp[1], mir ? .35 : -.35); out[w].cord = coil(ctx, [hp[0] + (mir ? -10 : 10), hp[1] + 50], ph0, 120, t, INK); }
      else { out[w].cord = coil(ctx, [PH[w][0] + (mir ? 75 : -75), PH[w][1] - 40], ph0, 30, t, INK); }
      const lb = (w === "L" ? f.left : f.right) || {}; if (lb.label) tag(ctx, th, lb.label, P.st.x, GY + 42, { size: 26, maxW: 300, bg: INK, fg: PAPER });
    });
    // pulses
    lines.forEach((l, k) => { const u = (t - TLn[k] - .15) / 1.0; if (u <= 0 || u >= 1 || t >= TH) return; const from = l.who === "R" ? "R" : "L", to = from === "L" ? "R" : "L";
      let p; if (u < .3) p = out[from].cord(u / .3); else if (u < .7){ const v = (u - .3) / .4; p = lineAt(from === "L" ? v : 1 - v); } else p = out[to].cord(1 - (u - .7) / .3);
      ctx.save(); const c = l.noise ? RED : YEL; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 34); g.addColorStop(0, hexA(c, .9)); g.addColorStop(1, hexA(c, 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - 34, p[1] - 34, 68, 68);
      if (l.noise){ ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); for (let j = 0; j < 6; j++) ctx.lineTo(p[0] - 30 + j * 12, p[1] + (j % 2 ? -14 : 14) * Math.sin(t * 30 + j)); ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(p[0], p[1], 11, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); }
      ctx.restore(); });
    if (dead){ const other = hangWho === "L" ? "R" : "L", q = t - TH; font(ctx, 800, 30, th.fam); ctx.fillStyle = th.ink; ctx.textAlign = "center";
      for (let j = 0; j < 2; j++){ if (Math.sin((q - j * .35) * 7) > -.2) ctx.fillText("tut…", PH[other][0] + (other === "L" ? -20 : 20) + (j ? 60 : -40) * (other === "L" ? 1 : -1), PH[other][1] - 110 - j * 40); } ctx.textAlign = "left"; }
    // bubbles + emotes
    ["L", "R"].forEach(w => personFx(ctx, th, out[w], t));
    lines.forEach((l, k) => { const w = l.who === "R" ? "R" : "L", P = out[w]; if (!P || !P.r || t < TLn[k]) return;
      const nextSame = lines.findIndex((m, j) => j > k && (m.who === "R" ? "R" : "L") === w), nextAny = k + 1 < lines.length ? TLn[k + 1] : 1e9;
      let tEnd = Math.min(nextSame >= 0 ? TLn[nextSame] : 1e9, TLn[k] + (l.dur || 3.6)); if (l.cut) tEnd = Math.min(tEnd, nextAny + .7);
      if (t >= tEnd) return; const x = P.r.headX + (w === "L" ? 40 : -40), y = P.r.headTop - 10;
      ctx.save(); if (l.cut && t > nextAny){ const q = ramp(t, nextAny, .7); ctx.globalAlpha *= 1 - q * .7; }
      bubbleAt(ctx, th, l.text, x, y, !!l.chat, t - TLn[k]);
      if (l.cut && t > nextAny){ ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = "round"; const q = ramp(t, nextAny, .25); ctx.beginPath(); ctx.moveTo(x - 150, y - 110); ctx.lineTo(x - 150 + 300 * q, y - 110 + 70 * q); ctx.stroke(); }
      ctx.restore();
      if (l.noise){ const ta = TLn[k] + 1.15, to = w === "L" ? out.R : out.L; if (t >= ta && t < ta + 1.8 && to && to.r) emoteAt(ctx, th, "?", to.r.headX, to.r.headTop - 20, t - ta, t); }
    });
  }
  function rotaryDial(ctx, th, s, f, t, M){
    const ds = f.digits, T = timesOf(s, ds, .15, .25), TD = f.doneCue ? at(s, f.doneCue, .85) : 1e9, CX = f.actor ? 600 : 540, CY = 870, S = 1.75;
    let rot = 0, hot = null; ds.forEach((d, k) => { const u = t - T[k]; if (u < 0 || u > 1.3) return; const hole = ((d.n || k + 1) + 9) % 10, amt = (Math.PI * (115 + 30 * hole)) / 180;
      rot = u < .5 ? amt * easeIO(u / .5) : u < .6 ? amt : amt * (1 - easeIO((u - .6) / .7)); hot = hole; });
    const ring = t >= TD && t < TD + 1.2 ? Math.sin(t * 50) * 4 : 0;
    ctx.beginPath(); ctx.ellipse(CX, CY + 135, 260, 26, 0, 0, TAU); ctx.fillStyle = "rgba(59,36,24,.15)"; ctx.fill();
    phoneDraw(ctx, th, CX, CY, S, { rot, hot, shake: ring });
    if (hot != null){ const a = -Math.PI / 3 - hot * Math.PI / 6 + rot; ctx.beginPath(); ctx.arc(CX + Math.cos(a) * 43 * S, CY + 8 * S + Math.sin(a) * 43 * S, 16, 0, TAU); ctx.fillStyle = "#D99A6E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); }
    if (t >= TD){ emoteAt(ctx, th, "ring", CX, CY - 200, t - TD, t); }
    // display strip with the parts joined
    const parts = ds.map((d, k) => t >= T[k] + .5 ? d.label : null).filter(x => x != null), join = f.join != null ? f.join : " ", txt = parts.join(join) || "";
    rr(ctx, 90, 1188, 900, 80, 22); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.strokeStyle = th.accent; ctx.lineWidth = 4; ctx.stroke();
    if (txt){ const z = fitFont(ctx, th, txt, 850, 40, 800, 18), full = ctx.measureText(txt).width; let x = 540 - full / 2; ctx.textAlign = "left";
      ds.forEach((d, k) => { if (t < T[k] + .5) return; const seg = d.label, w = ctx.measureText(seg).width, fresh = t - T[k] - .5 < 1.2;
        ctx.fillStyle = fresh ? "#FFFFFF" : "#F4A85C"; ctx.fillText(seg, x, 1240); if (fresh){ ctx.fillStyle = th.accent; ctx.fillRect(x, 1250, w * ramp(t, T[k] + .5, .4), 5); }
        if (d.caption){ font(ctx, 700, 23, th.fam); ctx.fillStyle = th.ink; ctx.textAlign = "center"; ctx.fillText(d.caption, clamp(x + w / 2, 150, 930), 1306); ctx.textAlign = "left"; font(ctx, 800, z, th.fam); }
        x += w; const jw = ctx.measureText(join).width; if (k < ds.length - 1 && t >= T[k + 1] + .5){ ctx.fillStyle = "#B8AE9D"; ctx.fillText(join, x, 1240); } x += jw; }); }
    else { const bl = Math.sin(t * 6) > 0; if (bl){ ctx.fillStyle = "#F4A85C"; ctx.fillRect(520, 1205, 18, 46); } }
    if (t >= TD){ checkDisc(ctx, 940, 1188, 34 * popAt(t, TD + .2)); burst(ctx, 940, 1188, t - TD - .2, M, 8);
      if (f.doneLabel) scaled(ctx, CX, 640, popAt(t, TD + .3), () => tag(ctx, th, f.doneLabel, CX, 640, { size: 32, maxW: 520, bg: GREEN, fg: "#fff", icon: "check" })); }
    const P = f.actor ? person(ctx, th, s, Object.assign({ x: 165 }, DEF_A, f.actor), t, 1160, .58) : null; personFx(ctx, th, P, t);
  }
  TT.layout("rotary", "Telepon klasik", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    if (f.digits) rotaryDial(ctx, th, s, f, t, M); else rotaryCall(ctx, th, s, f, t, M);
    ctx.restore();
  }, (s, f, i, add) => {
    if (f.digits){ timesOf(s, f.digits, .15, .25, i).forEach(T => add(T, "whoosh")); if (f.doneCue) add(at(s, f.doneCue, .85, i), "ping"); actorSfx(s, f.actor, i, add); return; }
    timesOf(s, f.lines, .1, .25, i).forEach(T => add(T, "pop")); if (f.ringCue) add(at(s, f.ringCue, .1, i), "ping"); if (f.hangCue) add(at(s, f.hangCue, .85, i), "pop");
    actorSfx(s, f.left, i, add); actorSfx(s, f.right, i, add);
  });
})();
