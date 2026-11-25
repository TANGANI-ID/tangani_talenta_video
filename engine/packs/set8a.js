/* Scene pack set8a: pinball, popcorn, claw, plinko, ferris, fishing, bowling, slingshot.
   Runs after motion-tangani.js in its own <script>. Canvas 1080x1920; visuals kept in y ~560-1330, text in x 90-990.
   "Lebih hidup": every scene has an in-scene camera (slow push + push/shake on impacts), constant idle motion
   (lights, wheels, water, particles), squash/stretch on impacts and an acting actor (hop/jump keys, auto reactions).
   actor {x, hair, hijab, shirt, skin, glasses, pose, expr, auto:false, keys:[{cue|at, pose, expr, emote, say, jump:n, nod, shake}]} */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, mv, easeIO, TAU, star, sceneDur } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const RED = "#D84315", GREEN = "#3BB273", YEL = "#E8A317", PAPER = "#FFF7EE", TEAL = "#2F6F73", WOOD = "#A0522D", DWOOD = "#6B3A1E", CREAM = "#FFF3D6", BLUE = "#4F8FD9";
  const dark = th => th.key === "B";
  const lerp = (a, b, q) => a + (b - a) * q;
  const ramp = (t, T, d) => clamp((t - T) / (d || .5), 0, 1);
  const popAt = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  const eEl = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (TAU / 3)) + 1;
  const fr = x => x - Math.floor(x), rnd = k => fr(Math.sin(k * 12.9898 + 4.1) * 43758.5453);
  const DEF_A = { hair: "short", shirt: "#2F6F73", skin: "a" };
  const timesOf = (s, list, base, step, i) => (list || []).map((x, k) => at(s, x.cue, base + k * step, i));
  const PALC = ["#C2691F", "#E8A317", "#2F6F73", "#4F8FD9", "#D84315", "#3BB273"];

  /* ---------- text helpers (always measured, shrunk or wrapped to fit) ---------- */
  function fitFont(ctx, th, txt, maxW, size, weight, min){ let z = size; font(ctx, weight || 700, z, th.fam); while (z > (min || 16) && ctx.measureText(txt).width > maxW){ z -= 1; font(ctx, weight || 700, z, th.fam); } return z; }
  function wrapL(ctx, txt, maxW){ return wrapRich(ctx, String(txt || ""), "", maxW).map(l => l.map(z => z.w).join(" ")).filter(l => l.length); }
  function fitLines(ctx, th, txt, maxW, size, maxL, weight, min){ let z = size;
    for (;;){ font(ctx, weight || 700, z, th.fam); const L = String(txt || "").split("\n").flatMap(p => wrapL(ctx, p, maxW));
      if ((L.length <= maxL && L.every(l => ctx.measureText(l).width <= maxW)) || z <= (min || 16)) return { z, L: L.slice(0, maxL) }; z -= 1; } }
  function textIn(ctx, th, txt, cx, cy, maxW, size, maxL, color, weight){ const r = fitLines(ctx, th, txt, maxW, size, maxL, weight || 800); const lh = r.z * 1.12;
    ctx.fillStyle = color; ctx.textAlign = "center"; r.L.forEach((l, k) => ctx.fillText(l, cx, cy + r.z * .36 + (k - (r.L.length - 1) / 2) * lh)); ctx.textAlign = "left"; return r; }
  // pill tag anchored at cx (center/left/right), vertically centred at cy; always kept inside x 90-990
  function tag(ctx, th, txt, cx, cy, o){ o = o || {}; const size = o.size || 32, maxW = Math.min(o.maxW || 800, 900), pad = size * .72, icS = o.icon ? size * 1.05 : 0, inner = maxW - pad * 2 - (icS ? icS + 10 : 0);
    const r = fitLines(ctx, th, txt, inner, size, o.lines || 1, o.weight || 800, o.min || 18), z = r.z, lh = z * 1.18;
    const tw = Math.max(...r.L.map(l => ctx.measureText(l).width), 10), ic = o.icon ? z * 1.05 : 0, w = tw + pad * 2 + (ic ? ic + 10 : 0), h = z * .85 + lh * r.L.length;
    let x0 = o.align === "right" ? cx - w : o.align === "left" ? cx : cx - w / 2; x0 = clamp(x0, 92, 988 - w);
    ctx.save(); if (o.shadow !== false){ ctx.shadowColor = "rgba(0,0,0,.18)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5; }
    rr(ctx, x0, cy - h / 2, w, h, Math.min(h / 2, 28)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); ctx.restore();
    if (o.stroke){ rr(ctx, x0, cy - h / 2, w, h, Math.min(h / 2, 28)); ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 4; ctx.stroke(); }
    if (ic) icon(ctx, o.icon, x0 + pad * .75, cy - ic / 2, ic, o.fg || INK, 2.4);
    font(ctx, o.weight || 800, z, th.fam); ctx.fillStyle = o.fg || INK; ctx.textAlign = "left";
    r.L.forEach((l, k) => ctx.fillText(l, x0 + pad + (ic ? ic + 8 : 0), cy + z * .36 + (k - (r.L.length - 1) / 2) * lh));
    if (o.strike > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0 + 14, cy); ctx.lineTo(x0 + 14 + (w - 28) * clamp(o.strike, 0, 1), cy); ctx.stroke(); }
    return { x0, w, h };
  }
  function scaled(ctx, x, y, k, fn){ if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); }
  function checkDisc(ctx, x, y, r, col){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || GREEN; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .34); ctx.lineTo(x + r * .45, y - r * .3); ctx.stroke(); }
  function crossDisc(ctx, x, y, r){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .35, y - r * .35); ctx.lineTo(x + r * .35, y + r * .35); ctx.moveTo(x + r * .35, y - r * .35); ctx.lineTo(x - r * .35, y + r * .35); ctx.stroke(); }

  /* ---------- in-scene camera: slow push-in, extra push at key moments, decaying shake on impacts ---------- */
  function camOpen(ctx, t, o){ o = o || {}; const D = Math.max(2, sceneDur());
    let z = 1 + .022 * clamp(t / D, 0, 1); (o.push || []).forEach(p => { if (p && p[0] != null && p[0] < 1e8 && t > p[0]) z += p[1] * eOut(ramp(t, p[0], 1.1)); });
    let sx = 0, sy = 0; (o.shake || []).forEach(p => { if (!p || p[0] == null) return; const u = t - p[0]; if (u > 0 && u < .7){ const k = p[1] * Math.exp(-u * 6.5); sx += Math.sin(u * 67) * k; sy += Math.cos(u * 53) * k * .7; } });
    const cx = o.cx || 540, cy = o.cy || 950;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 500, 1080, 872); ctx.clip();
    ctx.translate(cx + sx, cy + sy); ctx.scale(z, z); ctx.translate(-cx, -cy); }

  /* ---------- effects ---------- */
  function puffs(ctx, x, y, u, n, col, spread, size){ if (u < 0 || u > 1) return; ctx.save(); ctx.globalAlpha *= (1 - u) * .9; ctx.fillStyle = col;
    for (let k = 0; k < n; k++){ const a = k / n * TAU + .4, d = (spread || 60) * eOut(u) * (.7 + .3 * rnd(k)); ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * .6 - u * 20, (size || 16) * (1 - u * .5), 0, TAU); ctx.fill(); } ctx.restore(); }
  function confetti(ctx, x, y, u, n, seed){ if (u < 0 || u > 2.2) return;
    for (let k = 0; k < n; k++){ const r1 = rnd(k + seed), r2 = rnd(k * 3 + seed + 7), vx = (r1 - .5) * 1000, vy = -450 - r2 * 650;
      ctx.save(); ctx.globalAlpha *= clamp(2.2 - u, 0, 1); ctx.translate(x + vx * u, y + vy * u + 800 * u * u); ctx.rotate(u * (6 + r1 * 8) + k); ctx.scale(1, Math.cos(u * 9 + k));
      ctx.fillStyle = PALC[k % PALC.length]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); } }
  function ringFx(ctx, x, y, u, r0, r1, col, lw){ if (u < 0 || u > 1) return; ctx.save(); ctx.globalAlpha *= 1 - u; ctx.strokeStyle = col; ctx.lineWidth = (lw || 6) * (1 - u * .5); ctx.beginPath(); ctx.arc(x, y, lerp(r0, r1, eOut(u)), 0, TAU); ctx.stroke(); ctx.restore(); }
  function glow(ctx, x, y, r, col, a){ if (a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, Math.min(1, a))); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function rays(ctx, x, y, r, t, col, a){ if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(t * .6); ctx.fillStyle = col;
    for (let k = 0; k < 12; k++){ ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r, -r * .14); ctx.lineTo(r, r * .14); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  function sparks(ctx, x, y, u, n, col){ if (u < 0 || u > .6) return; const q = u / .6; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.strokeStyle = col || YEL; ctx.lineWidth = 5; ctx.lineCap = "round";
    for (let k = 0; k < n; k++){ const a = k / n * TAU + .3, r0 = 20 + q * 50, r1 = r0 + 24 * (1 - q); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); } ctx.restore(); }
  function bigWord(ctx, th, x, y, u, txt, col){ if (u < 0 || u > 1.8 || !txt) return; const q = eBack(clamp(u / .28, 0, 1)), out = clamp((u - 1.45) / .35, 0, 1);
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.08 + Math.sin(u * 9) * .03 * (1 - out)); const k = q * (1 - out * .6); ctx.scale(k, k); ctx.globalAlpha *= 1 - out;
    ctx.beginPath(); for (let j = 0; j < 24; j++){ const rad = j % 2 ? 78 : 112, a = j * TAU / 24; ctx.lineTo(Math.cos(a) * rad * 1.55, Math.sin(a) * rad * .72); } ctx.closePath();
    ctx.fillStyle = col || YEL; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    const z = fitFont(ctx, th, txt, 230, 52, 900, 22); ctx.fillStyle = col === RED || col === GREEN ? "#fff" : INK; ctx.textAlign = "center"; ctx.fillText(txt, 0, z * .36); ctx.textAlign = "left"; ctx.restore(); }
  function speedLines(ctx, x, y, dx, dy, n, len, a, t, col){ const L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineWidth = 5;
    for (let k = 0; k < n; k++){ const off = (k - (n - 1) / 2) * 16, ph = fr(t * 3 + k * .37), sx = x - ux * (40 + ph * 40) - uy * off, sy = y - uy * (40 + ph * 40) + ux * off;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - ux * len * (1 - ph * .5), sy - uy * len * (1 - ph * .5)); ctx.stroke(); } ctx.restore(); }
  const lineCol = th => dark(th) ? "rgba(250,248,243,.55)" : "rgba(59,36,24,.35)";

  /* ---------- actors (stage rig + hop/squash, idle sway, shadow, auto reactions) ---------- */
  const ARM = { point: [1.5, 1.55], phone: [2.3, 3.9], rest: [.35, -.95], stand: [.15, .08], wave: [2.7, 2.9], cheer: [2.75, 2.95], thumbs: [.45, 2.75], talk: [.55, -.5], type: [.35, -.95],
    cross: [.35, -1.95], think: [.3, 3.5], work: [.55, -1.2], down: [.05, .02], shrug: [.9, 2.1], cover: [2.72, -1.3], holdphone: [.3, -1.75], drink: [2.72, -1.3] };
  function handAt(x, gy, sc, pose, sit, dir){ const [u, f] = ARM[pose] || ARM.stand, hipY = sit ? -112 : -182, neckY = hipY - 150;
    return [x + (dir || 1) * (44 + Math.sin(u) * 72 + Math.sin(f) * 66) * sc, gy + (neckY + 18 + Math.cos(u) * 72 + Math.cos(f) * 66) * sc]; }
  function hopOf(s, keys, t){ let y = 0, sq = 0; keyTimes(s, keys).forEach(k => { if (!k.jump) return; const n = k.jump === true ? 1 : k.jump, u = t - k.T, D = .44;
      if (u > -.14 && u < 0) sq = Math.max(sq, Math.sin((u + .14) / .14 * Math.PI) * .09);
      if (u >= 0 && u < n * D){ const v = (u % D) / D; y = Math.min(y, -Math.sin(v * Math.PI) * 72); if (v > .92 || v < .05) sq = Math.max(sq, .07); }
      if (u >= n * D && u < n * D + .2) sq = Math.max(sq, Math.sin((u - n * D) / .2 * Math.PI) * .1); }); return { y, sq }; }
  function person(ctx, th, s, a, t, gy, sc, o){ if (!a) return null; o = o || {};
    const A = Object.assign({ x: o.x || 200, pose: o.pose || "stand" }, DEF_A, a); if (o.auto && a.auto !== false) A.keys = (a.keys || []).concat(o.auto.filter(Boolean));
    const st = actorState(A, s, t); if (o.mod) o.mod(st); const hp = hopOf(s, A.keys, t);
    if (!st.sit){ ctx.save(); ctx.fillStyle = dark(th) ? "rgba(0,0,0,.4)" : hexA(INK, .14); const k = 1 + hp.y / 220; ctx.beginPath(); ctx.ellipse(st.x, gy + 4, 72 * sc * k, 13 * sc * k, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.translate(st.x, gy); ctx.rotate(Math.sin(t * 1.7 + A.x * .01) * .014 + (o.lean || 0)); ctx.scale(1 + hp.sq * .6, 1 - hp.sq); if (o.mirror) ctx.scale(-1, 1); ctx.translate(-st.x, -gy);
    const r = drawActor(ctx, th, A, st, t, gy + hp.y, sc); ctx.restore();
    return { a: A, st, r, gy, sc, mirror: !!o.mirror, hop: hp.y, hand: () => handAt(st.x, gy + hp.y, sc, st.walking ? "stand" : st.pose, st.sit, o.mirror ? -1 : 1) };
  }
  function personFx(ctx, th, P, t){ if (!P || !P.r) return; const { a, st, r } = P;
    if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (a.emoteDx || 0), r.headTop - 20, t - st.emoteT, t);
    if (st.say) bubbleAt(ctx, th, st.say, r.headX + (a.bubbleDx || 0), r.headTop - (st.emote ? 90 : 10), st.chat, t - st.sayT); }
  function actorSfx(s, a, i, add){ if (!a) return; keyTimes(s, a.keys, i).forEach(k => {
    if (k.say != null || ["?", "!", "check", "heart", "sparkle"].includes(k.emote)) add(k.T, k.emote === "check" ? "chime" : "pop"); if (k.emote === "ring") add(k.T, "ping"); }); }

  /* =====================================================================
     pinball: a pinball table; the ball (attention / an idea) is launched, bounces between flippers and hits one
     bumper per item cue (bumper flashes, label pops, LED counter changes). end: "win" (jackpot target lights up,
     confetti) or "drain" (ball falls between the flippers, table flashes red). Actor plays at the left.
       f: items:[{label, cue, icon, value, color}] (<=4), led, endLed, end:"win"|"drain", endCue, endWord, endLabel, actor
     ===================================================================== */
  function pinGeo(f){ const act = !!f.actor, X0 = act ? 330 : 200, X1 = act ? 968 : 880; return { X0, X1, W: X1 - X0, cx: (X0 + X1) / 2, Y0: 588, Y1: 1318 }; }
  const PIN_POS = { 1: [[.5, .5]], 2: [[.28, .5], [.72, .5]], 3: [[.25, 0], [.75, 0], [.5, 1]], 4: [[.24, 0], [.76, 0], [.3, 1], [.7, 1]] };
  function pinPlan(s, f, i){
    const g = pinGeo(f), its = (f.items || []).slice(0, 4), B = (PIN_POS[Math.max(1, its.length)] || []).map(([rx, ry]) => ({ x: g.X0 + g.W * rx, y: 800 + ry * 200 }));
    const T = timesOf(s, its, .15, .2, i), end = f.end || null, TE = end ? at(s, f.endCue, .85, i) : null;
    const FL = { x: g.cx - g.W * .15, y: 1190, kind: "FL" }, FR = { x: g.cx + g.W * .15, y: 1190, kind: "FR" };
    const WL = [{ x: g.X0 + 56, y: 1050, kind: "WL" }, { x: g.cx, y: 742, kind: "WT" }, { x: g.X1 - 74, y: 1050, kind: "WR" }];
    const targets = T.map((T0, k) => ({ x: B[k].x, y: B[k].y + 74, T: T0, kind: "B", k }));
    if (end === "win") targets.push({ x: g.cx, y: 738, T: TE, kind: "J" }); else if (end === "drain") targets.push({ x: g.cx, y: 1350, T: TE, kind: "D" });
    const t0 = targets.length ? Math.min(.35, targets[0].T * .5) : .35;
    const wp = [{ x: g.X1 - 36, y: 1280, T: 0, kind: "P" }, { x: g.X1 - 36, y: 760, T: t0, kind: "L" }];
    let side = 0, wi = 0;
    const fill = (A, Bt) => { const gap = Bt.T - A.T, nb = gap < .95 ? 0 : Math.min(9, Math.floor(gap / 1.05)), segs = nb * 2 + 1;
      for (let j = 0; j < nb; j++){ const F = side++ % 2 ? FR : FL, Wl = WL[(wi++) % 3];
        wp.push(Object.assign({}, F, { T: A.T + gap * (2 * j + 1) / segs })); wp.push(Object.assign({}, Bt.kind === "D" && j === nb - 1 ? WL[1] : Wl, { T: A.T + gap * (2 * j + 2) / segs })); } };
    let prev = wp[1]; targets.forEach(tg => { fill(prev, tg); wp.push(tg); prev = tg; });
    if (!end && B.length){ for (let j = 0; j < 40; j++){ const F = side++ % 2 ? FR : FL, k = Math.floor(rnd(j + 3) * B.length);
      wp.push(Object.assign({}, F, { T: prev.T + .55 + j * 1.1 })); wp.push({ x: B[k].x, y: B[k].y + 74, T: prev.T + 1.1 + j * 1.1, kind: "B", k, tail: true }); } }
    return { g, its, B, T, end, TE, wp, FL, FR };
  }
  function pinBall(P, t){ const wp = P.wp; if (t <= 0) return { x: wp[0].x, y: wp[0].y };
    let j = 0; while (j < wp.length - 1 && wp[j + 1].T <= t) j++;
    if (j >= wp.length - 1) return { x: wp[j].x, y: wp[j].y, done: true };
    const A = wp[j], B = wp[j + 1], q = clamp((t - A.T) / Math.max(.01, B.T - A.T), 0, 1), down = B.y > A.y, u = down ? q * (.45 + .55 * q) : q * (1.55 - .55 * q);
    const cx = (A.x + B.x) / 2, cy = Math.min(A.y, B.y) - (down ? 30 : 80);
    return { x: (1 - u) * (1 - u) * A.x + 2 * u * (1 - u) * cx + u * u * B.x, y: (1 - u) * (1 - u) * A.y + 2 * u * (1 - u) * cy + u * u * B.y }; }
  const flipShape = (t, T) => { const u = t - T; return u < -.09 || u > .32 ? 0 : u < 0 ? (u + .09) / .09 : u < .14 ? 1 : 1 - (u - .14) / .18; };
  TT.layout("pinball", "Mesin pinball", (ctx, th, s, t) => {
    const f = s.f; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const P = pinPlan(s, f), { g, its, B, T, end, TE, wp } = P, { X0, X1, W, cx, Y0, Y1 } = g, after = end && t >= TE;
    camOpen(ctx, t, { cx: f.actor ? 560 : cx, cy: 960, push: [[TE, .03]], shake: T.map(T0 => [T0, 6]).concat([[TE, end === "drain" ? 13 : 9]]) });
    ctx.globalAlpha *= clamp(t * 4, 0, 1);
    let Pa = null; if (f.actor) Pa = person(ctx, th, s, f.actor, t, 1300, .78, { x: 178, pose: "work",
      auto: end ? [{ at: TE + .15, pose: end === "win" ? "cheer" : "cover", expr: end === "win" ? "happy" : "worried", jump: end === "win" ? 2 : 0 }] : null });
    // cabinet + playfield
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.28)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; rr(ctx, X0, Y0, W, Y1 - Y0, 40); ctx.fillStyle = "#7A3E1E"; ctx.fill(); ctx.restore();
    rr(ctx, X0 + 16, Y0 + 16, W - 32, Y1 - Y0 - 32, 28); const pg = ctx.createLinearGradient(0, Y0, 0, Y1); pg.addColorStop(0, "#1C3F42"); pg.addColorStop(1, "#2F6F73"); ctx.fillStyle = pg; ctx.fill();
    ctx.save(); rr(ctx, X0 + 16, Y0 + 16, W - 32, Y1 - Y0 - 32, 28); ctx.clip();
    ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 20; for (let k = -6; k < 22; k++){ const x = X0 + k * 64 + (t * 24) % 64; ctx.beginPath(); ctx.moveTo(x, Y0); ctx.lineTo(x - 320, Y1); ctx.stroke(); }
    if (after && end === "drain"){ ctx.fillStyle = hexA(RED, .22 + .14 * Math.sin(t * 10)); ctx.fillRect(X0, Y0, W, Y1 - Y0); }
    if (after && end === "win"){ ctx.fillStyle = hexA(YEL, .1 + .08 * Math.sin(t * 9)); ctx.fillRect(X0, Y0, W, Y1 - Y0); }
    // launch lane
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X1 - 62, 1300); ctx.lineTo(X1 - 62, 820); ctx.quadraticCurveTo(X1 - 62, 712, X1 - 170, 712); ctx.stroke();
    const pl = clamp(1 - t / .25, 0, 1); ctx.fillStyle = "#C9C2B6"; ctx.fillRect(X1 - 48, 1296 + pl * 14, 24, 40);
    // side lights (chase)
    for (let k = 0; k < 14; k++){ const y = 730 + k * 38; [X0 + 30, X1 - 30].forEach((x, d) => { const on = after ? Math.sin(t * 14 + k) > 0 : Math.sin(t * 7 - k * .8 + d * 2) > .25;
      ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fillStyle = on ? (after && end === "drain" ? RED : YEL) : "rgba(255,255,255,.15)"; ctx.fill(); }); }
    // kickers
    const kick = side => { let a = 0; wp.forEach(w => { if (w.kind === side){ const u = t - w.T; if (u >= 0 && u < .3) a = Math.max(a, 1 - u / .3); } }); return a; };
    [[X0 + 46, 1, "WL"], [X1 - 46, -1, "WR"]].forEach(([x, d, kd]) => { const a = kick(kd); ctx.beginPath(); ctx.moveTo(x, 1010); ctx.lineTo(x, 1140); ctx.lineTo(x + d * 92, 1150); ctx.closePath();
      ctx.fillStyle = a > 0 ? YEL : RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 5 + a * 4; ctx.stroke(); });
    // flippers
    [[P.FL, 1, "FL"], [P.FR, -1, "FR"]].forEach(([F, d, kd]) => { let a = 0; wp.forEach(w => { if (w.kind === kd) a = Math.max(a, flipShape(t, w.T)); });
      const px = cx - d * W * .29, py = 1212, ang = d > 0 ? lerp(.48, -.38, a) : Math.PI - lerp(.48, -.38, a), L = W * .17;
      ctx.strokeStyle = "#fff"; ctx.lineCap = "round"; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang) * L, py + Math.sin(ang) * L); ctx.stroke();
      ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang) * L * .92, py + Math.sin(ang) * L * .92); ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, 9, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); });
    ctx.fillStyle = "rgba(0,0,0,.45)"; rr(ctx, cx - 46, 1292, 92, 40, 14); ctx.fill();
    // jackpot target
    if (end === "win"){ const on = after ? 1 : .35 + .25 * Math.sin(t * 4); if (after){ rays(ctx, cx, 738, 140, t, YEL, .5); glow(ctx, cx, 738, 120, YEL, .7); }
      ctx.fillStyle = hexA(YEL, on); star(ctx, cx, 738, 44 * (after ? 1 + .12 * Math.sin(t * 8) : 1)); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke(); }
    // bumpers
    B.forEach((b, k) => { const it = its[k], lit = t >= T[k]; let pulse = 0;
      wp.forEach(w => { if (w.kind === "B" && w.k === k){ const u = t - w.T; if (u >= 0 && u < .5) pulse = Math.max(pulse, Math.sin(u / .5 * Math.PI) * (1 - u)); } });
      const r = 58 * (1 + pulse * .22), col = it.color || PALC[k % 4];
      ctx.beginPath(); ctx.ellipse(b.x, b.y + 46, 60, 16, 0, 0, TAU); ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fill();
      if (lit) glow(ctx, b.x, b.y, r * 1.9, YEL, .3 + pulse * .5 + .08 * Math.sin(t * 5 + k));
      ctx.beginPath(); ctx.arc(b.x, b.y + 10, r, 0, TAU); ctx.fillStyle = lit ? DWOOD : "#3E5254"; ctx.fill();
      ctx.beginPath(); ctx.arc(b.x, b.y, r * .94, 0, TAU); ctx.fillStyle = lit ? col : "#6E8486"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 6; ctx.stroke();
      ctx.beginPath(); ctx.arc(b.x, b.y, r * .56, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill();
      icon(ctx, it.icon || "star", b.x - r * .36, b.y - r * .36, r * .72, lit ? INK : "#9AA6A7", 2.4);
      wp.forEach(w => { if (w.kind === "B" && w.k === k){ ringFx(ctx, b.x, b.y, (t - w.T) / .5, r, r + 70, YEL, 7); if (!w.tail) sparks(ctx, b.x, b.y, t - w.T, 10, "#fff"); } }); });
    B.forEach((b, k) => { if (t >= T[k]) scaled(ctx, b.x, b.y + 94, popAt(t, T[k] + .04, .45), () => tag(ctx, th, its[k].label, b.x, b.y + 94, { size: 27, maxW: 250, lines: 2, bg: PAPER, fg: INK, stroke: YEL, lw: 3 })); });
    // LED
    rr(ctx, X0 + 44, 604, W - 88, 76, 16); ctx.fillStyle = "#120E0A"; ctx.fill(); ctx.strokeStyle = "#5A3A22"; ctx.lineWidth = 4; ctx.stroke();
    let kk = -1; T.forEach((T0, k) => { if (t >= T0) kk = k; }); const hits = wp.filter(w => w.kind === "B" && w.T <= t).length;
    const val = after && f.endLed ? f.endLed : kk >= 0 && its[kk].value != null ? String(its[kk].value) : String(hits * 500);
    const lastT = after ? TE : kk >= 0 ? Math.max(T[kk], (wp.filter(w => w.kind === "B" && w.T <= t).pop() || { T: 0 }).T) : 0, vq = 1 + .25 * Math.max(0, 1 - (t - lastT) / .25);
    if (f.led){ fitFont(ctx, th, f.led, (W - 120) * .5, 28, 800, 16); ctx.fillStyle = "#E08A3C"; ctx.fillText(f.led, X0 + 66, 652); }
    ctx.save(); ctx.translate(X1 - 66, 642); ctx.scale(vq, vq); const vz = fitFont(ctx, th, val, f.led ? (W - 120) * .42 : W - 130, 42, 900, 18); ctx.fillStyle = after && end === "drain" ? "#FF7A59" : YEL; ctx.textAlign = "right"; ctx.fillText(val, 0, vz * .36); ctx.textAlign = "left"; ctx.restore();
    // ball (trail + stretch)
    if (!(end === "drain" && t > TE)){
      for (let k = 5; k >= 1; k--){ const p = pinBall(P, t - k * .03); ctx.beginPath(); ctx.arc(p.x, p.y, 19 * (1 - k * .12), 0, TAU); ctx.fillStyle = `rgba(255,255,255,${.22 * (1 - k / 6)})`; ctx.fill(); }
      const bp = pinBall(P, t), bq = pinBall(P, t - .03), vx = bp.x - bq.x, vy = bp.y - bq.y, sp = Math.hypot(vx, vy) / .03, stc = 1 + Math.min(.38, sp / 3500);
      ctx.save(); ctx.translate(bp.x, bp.y); ctx.rotate(Math.atan2(vy, vx || 1e-3)); ctx.scale(stc, 1 / stc);
      const bg = ctx.createRadialGradient(-6, -7, 2, 0, 0, 21); bg.addColorStop(0, "#FFFFFF"); bg.addColorStop(.5, "#C9CED3"); bg.addColorStop(1, "#6C747B"); ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fillStyle = bg; ctx.fill(); ctx.restore();
      if (end === "win" && after) glow(ctx, bp.x, bp.y, 60, "#FFFFFF", .5 + .2 * Math.sin(t * 9)); }
    ctx.restore();
    if (after){ if (end === "win") confetti(ctx, cx, 760, t - TE, 30, 5); else puffs(ctx, cx, 1300, (t - TE) / .8, 8, "rgba(255,255,255,.7)", 70, 18);
      bigWord(ctx, th, cx, 930, t - TE - .1, f.endWord || (end === "win" ? "JACKPOT!" : ""), end === "win" ? YEL : RED);
      if (f.endLabel) scaled(ctx, cx, 1110, popAt(t, TE + .55, .5), () => tag(ctx, th, f.endLabel, cx, 1110, { size: 34, maxW: Math.min(W - 40, 600), lines: 2, bg: end === "win" ? GREEN : RED, fg: "#fff", icon: end === "win" ? "check" : "alert" })); }
    if (Pa) personFx(ctx, th, Pa, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, (f.items || []).slice(0, 4), .15, .2, i).forEach(T => add(T, "pop")); add(.05, "whoosh");
    if (f.end){ const TE = at(s, f.endCue, .85, i); add(TE, f.end === "win" ? "chime" : "whoosh"); if (f.endLabel) add(TE + .55, "pop"); } actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     popcorn: a popcorn cart; once the kettle heats up small kernels pop constantly; on every item cue a BIG
     labelled popcorn bursts out and lands as a tag in the left column. end: "overflow" (glass door bursts,
     popcorn floods out) or "off" (heat off, popping calms down).
       f: sign, items:[{label, cue, icon}] (<=4), heatCue, end:"overflow"|"off", endCue, endWord, endLabel, actor (right)
     ===================================================================== */
  function popPuff(ctx, x, y, r, rot, a){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); if (a != null) ctx.globalAlpha *= a;
    ctx.fillStyle = CREAM; ctx.strokeStyle = "#D9B25C"; ctx.lineWidth = Math.max(1.5, r * .08);
    [[0, 0, .62], [-.5, -.32, .5], [.48, -.3, .52], [-.42, .38, .46], [.44, .36, .5], [0, -.62, .42]].forEach(([dx, dy, k]) => { ctx.beginPath(); ctx.arc(dx * r, dy * r, k * r, 0, TAU); ctx.fill(); ctx.stroke(); });
    [[0, 0, .62], [-.5, -.32, .5], [.48, -.3, .52], [-.42, .38, .46], [.44, .36, .5], [0, -.62, .42]].forEach(([dx, dy, k]) => { ctx.beginPath(); ctx.arc(dx * r, dy * r, k * r - ctx.lineWidth, 0, TAU); ctx.fill(); });
    ctx.fillStyle = "#E8A317"; ctx.beginPath(); ctx.arc(r * .1, r * .15, r * .16, 0, TAU); ctx.fill(); ctx.restore(); }
  TT.layout("popcorn", "Mesin popcorn", (ctx, th, s, t) => {
    const f = s.f; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const its = (f.items || []).slice(0, 4), n = its.length, T = timesOf(s, its, .2, .18), CX = f.actor ? 615 : 660, end = f.end || null, TE = end ? at(s, f.endCue, .85) : 1e9;
    const TH = f.heatCue ? at(s, f.heatCue, .1) : Math.max(.15, (n ? T[0] : 1) - 1.4), heatAt = τ => clamp((τ - TH) / 1.4, 0, 1) * (end === "off" ? 1 - clamp((τ - TE) / 1.4, 0, 1) : 1), heat = heatAt(t);
    const GL = CX - 180, GR = CX + 180, GT = 712, GB = 1060, flood = end === "overflow" && t >= TE;
    camOpen(ctx, t, { cx: CX - 120, cy: 950, push: [[n ? T[n - 1] : null, .015], [end ? TE : null, .03]], shake: T.map(x => [x + .02, 4]).concat(end === "overflow" ? [[TE, 15]] : []) });
    ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // wheels + base cabinet
    [CX - 128, CX + 128].forEach(x => { ctx.beginPath(); ctx.arc(x, 1262, 36, 0, TAU); ctx.fillStyle = INK; ctx.fill(); ctx.beginPath(); ctx.arc(x, 1262, 14, 0, TAU); ctx.fillStyle = "#C9C2B6"; ctx.fill(); });
    rr(ctx, CX - 196, 1060, 392, 180, 20); ctx.fillStyle = "#B8452A"; ctx.fill();
    ctx.save(); rr(ctx, CX - 196, 1060, 392, 180, 20); ctx.clip(); ctx.fillStyle = "rgba(255,247,238,.9)"; for (let k = 0; k < 7; k++) ctx.fillRect(CX - 196 + k * 60 + 20, 1060, 26, 180); ctx.restore();
    rr(ctx, CX - 120, 1105, 240, 74, 18); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    fitFont(ctx, th, f.sign || "POPCORN", 210, 38, 900, 18); ctx.fillStyle = "#B8452A"; ctx.textAlign = "center"; ctx.fillText(f.sign || "POPCORN", CX, 1155); ctx.textAlign = "left";
    // glass box: inside (pile + small pops)
    const pileQ = clamp((t - TH) / Math.max(3, sceneDur() - TH), 0, 1) * (heat > 0 || t > TH ? 1 : 0), hP = 26 + 120 * pileQ;
    rr(ctx, GL, GT, 360, GB - GT, 12); ctx.fillStyle = dark(th) ? "rgba(214,236,242,.22)" : "rgba(214,236,242,.55)"; ctx.fill();
    ctx.save(); rr(ctx, GL, GT, 360, GB - GT, 12); ctx.clip();
    for (let k = 0; k < 26; k++){ const px = GL + 18 + rnd(k) * 324, mound = hP * (1 - Math.pow((px - CX) / 200, 2) * .5), py = GB - rnd(k + 40) * mound; popPuff(ctx, px, py, 17 + rnd(k + 9) * 6, rnd(k + 3) * 6); }
    const DT = .085, j1 = Math.floor((t - TH) / DT), floorY = GB - hP + 14;
    for (let j = Math.max(0, j1 - 16); j <= j1; j++){ const tj = TH + j * DT, age = t - tj; if (age < 0 || rnd(j * 1.7 + 2) > heatAt(tj)) continue;
      const vx = (rnd(j + 1) - .5) * 560, vy = -320 - rnd(j + 2) * 360; let x = CX + (rnd(j) - .5) * 110 + vx * age, y = 790 + vy * age + 950 * age * age;
      const span = 330, rel = x - (GL + 15); x = GL + 15 + Math.abs(((rel % (2 * span)) + 2 * span) % (2 * span) - span) * (1) ; if (y > floorY) y = floorY;
      popPuff(ctx, x, y, 14, age * 9 + j, age > 1.1 ? clamp((1.4 - age) / .3, 0, 1) : 1); }
    // kettle (shakes with heat, lid kicks on every big pop)
    let kick = 0; T.forEach(T0 => { const u = t - T0; if (u > -.05 && u < .45) kick = Math.max(kick, Math.sin(clamp((u + .05) / .5, 0, 1) * Math.PI)); });
    const jx = heat * Math.sin(t * 41) * 3 + kick * Math.sin(t * 60) * 4, tilt = Math.sin(t * 3.1) * .05 * heat + kick * .12;
    ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(CX, GT); ctx.lineTo(CX + jx, 770); ctx.stroke();
    glow(ctx, CX, 860, 120, "#FF5A1F", heat * (.35 + .1 * Math.sin(t * 13)));
    ctx.save(); ctx.translate(CX + jx, 800); ctx.rotate(tilt);
    rr(ctx, -84, 0, 168, 76, 18); const kg = ctx.createLinearGradient(-84, 0, 84, 0); kg.addColorStop(0, "#9AA1A6"); kg.addColorStop(.5, "#E6E9EB"); kg.addColorStop(1, "#80878C"); ctx.fillStyle = kg; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.save(); ctx.translate(-84, 2); ctx.rotate(-kick * .9); rr(ctx, 0, -14, 168, 16, 8); ctx.fillStyle = "#6C747B"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    ctx.fillStyle = "#544E42"; rr(ctx, 84, 22, 46, 12, 6); ctx.fill(); ctx.restore();
    ctx.restore();
    // glass frame, roof, awning, sign
    ctx.strokeStyle = DWOOD; ctx.lineWidth = 10; rr(ctx, GL, GT, 360, GB - GT, 12); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 12; const gx = GL + 40 + ((t * 40) % 300); ctx.beginPath(); ctx.moveTo(gx, GT + 20); ctx.lineTo(gx - 60, GT + 140); ctx.stroke();
    if (flood){ const q = eOut(ramp(t, TE, .35)), dw = 360 * (1 - q * .82) + Math.sin((t - TE) * 18) * 6 * Math.exp(-(t - TE) * 3); ctx.beginPath(); ctx.moveTo(GL, GT); ctx.lineTo(GL - dw * .35 * q + dw * (1 - q), GT - 30 * q); ctx.lineTo(GL - dw * .35 * q + dw * (1 - q), GB + 30 * q); ctx.lineTo(GL, GB); ctx.closePath(); ctx.fillStyle = "rgba(214,236,242,.75)"; ctx.fill(); ctx.strokeStyle = DWOOD; ctx.lineWidth = 8; ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(CX - 222, 712); ctx.lineTo(CX + 222, 712); ctx.lineTo(CX + 180, 652); ctx.lineTo(CX - 180, 652); ctx.closePath(); ctx.fillStyle = "#B8452A"; ctx.fill();
    for (let k = 0; k < 9; k++){ const x = CX - 222 + k * 49.3; ctx.beginPath(); ctx.arc(x + 24.6, 712, 24.6, 0, Math.PI); ctx.fillStyle = k % 2 ? "#B8452A" : PAPER; ctx.fill(); }
    rr(ctx, CX - 150, 590, 300, 58, 20); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = "#B8452A"; ctx.lineWidth = 5; ctx.stroke();
    for (let k = 0; k < 12; k++){ const on = Math.sin(t * 8 - k) > 0; ctx.beginPath(); ctx.arc(CX - 132 + k * 24, 598, 4.5, 0, TAU); ctx.fillStyle = on ? YEL : "#D9C7B0"; ctx.fill(); }
    fitFont(ctx, th, f.sign || "POPCORN", 250, 34, 900, 16); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(f.sign || "POPCORN", CX, 634); ctx.textAlign = "left";
    // steam
    if (heat > .05) for (let k = 0; k < 4; k++){ const q = fr(t * .5 + k / 4); ctx.save(); ctx.globalAlpha *= heat * Math.sin(q * Math.PI) * .45; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(CX - 50 + k * 34 + Math.sin(t * 2 + k) * 10, 700 - q * 110, 16 + q * 18, 0, TAU); ctx.fill(); ctx.restore(); }
    // flood
    if (flood){ const u = t - TE; for (let k = 0; k < 46; k++){ const d = k * .035; if (u < d) continue; const a = u - d, vx = (rnd(k) - .5) * 900, vy = -380 - rnd(k + 5) * 420;
      let x = CX + (rnd(k + 2) - .5) * 200 + vx * a, y = 900 + vy * a + 1300 * a * a, ground = 1270 - rnd(k + 8) * 50; if (y > ground) y = ground; x = clamp(x, 110, 975);
      popPuff(ctx, x, y, 18 + rnd(k + 1) * 8, a * 7 + k); } }
    // big labelled pops -> tags in the left column
    its.forEach((it, k) => { const T0 = T[k], u = t - T0; if (u < 0) return; const ty = 700 + k * 132, tx = 92, lx = tx + 150, q = clamp(u / .7, 0, 1);
      if (q < 1){ const sx = CX, sy = 800, cxp = (sx + lx) / 2, cyp = 545, x = (1 - q) * (1 - q) * sx + 2 * q * (1 - q) * cxp + q * q * lx, y = (1 - q) * (1 - q) * sy + 2 * q * (1 - q) * cyp + q * q * ty;
        const sq = 1 + .25 * Math.sin(q * Math.PI * 3) * (1 - q); ctx.save(); ctx.translate(x, y); ctx.scale(sq, 1 / sq); popPuff(ctx, 0, 0, 44, u * 8); ctx.restore(); puffs(ctx, sx, sy - 10, u / .5, 7, "rgba(255,255,255,.8)", 50, 12); }
      else { puffs(ctx, lx, ty, (u - .7) / .5, 7, "rgba(255,243,214,.95)", 70, 14);
        scaled(ctx, lx, ty, popAt(t, T0 + .7, .4), () => { const bob = Math.sin(t * 2.2 + k) * 3; ctx.translate(0, bob); tag(ctx, th, it.label, tx, ty, { align: "left", size: 30, maxW: GL - tx - 26, lines: 2, bg: CREAM, fg: INK, stroke: "#D9B25C", lw: 3, icon: it.icon }); }); } });
    let Pa = null; if (f.actor) Pa = person(ctx, th, s, f.actor, t, 1300, .8, { x: 905, mirror: true,
      auto: end ? [{ at: TE + .1, expr: end === "overflow" ? "shock" : "happy", emote: end === "overflow" ? "!" : "sparkle", pose: end === "overflow" ? "shrug" : "thumbs", jump: end === "overflow" ? 1 : 0 }] : null });
    if (end && t >= TE){ bigWord(ctx, th, CX, 860, t - TE - .1, f.endWord || "", end === "overflow" ? RED : GREEN);
      if (f.endLabel) scaled(ctx, CX, 1000, popAt(t, TE + .6, .45), () => tag(ctx, th, f.endLabel, CX, 1000, { size: 34, maxW: 560, lines: 2, bg: end === "overflow" ? RED : GREEN, fg: "#fff", icon: end === "overflow" ? "alert" : "check" })); }
    if (Pa) personFx(ctx, th, Pa, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, (f.items || []).slice(0, 4), .2, .18, i).forEach(T => { add(T, "pop"); add(T + .7, "pop"); });
    if (f.end){ const TE = at(s, f.endCue, .85, i); add(TE, f.end === "overflow" ? "whoosh" : "chime"); if (f.endLabel) add(TE + .6, "pop"); } actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     claw: a claw machine full of labelled prizes. Every try {cue, pick, result:"win"|"slip"} moves the claw over
     prize `pick`, drops, grabs and lifts; "slip" drops it back, "win" carries it to the chute and the prize pops out
     to the front (big, glowing) with winLabel.
       f: title, prizes:[{label, icon, color}] (<=5), tries:[{cue, pick, result}], winLabel, actor (right, at the joystick)
     ===================================================================== */
  function clawGeo(f){ const act = !!f.actor, X0 = act ? 105 : 210, X1 = act ? 765 : 870; return { X0, X1, W: X1 - X0, CX: (X0 + X1) / 2, home: X0 + 82 }; }
  function clawSlot(g, n, k){ const PA = g.X0 + 168, PW = g.X1 - 26 - PA; if (n <= 3) return { x: PA + (k + .5) * PW / n, y: 1096 };
    return k < 3 ? { x: PA + (k + .5) * PW / 3, y: 1096 } : { x: PA + (k - 3 + 1) * PW / 3, y: 990 }; }
  const CLK = .78; // claw timeline speed (seconds of the base timeline are multiplied by this)
  function clawState(s, f, t, g){ const n = (f.prizes || []).length, tries = (f.tries || []).map((tr, k) => Object.assign({}, tr, { T: at(s, tr.cue, .3 + k * .3) }));
    const idle = τ => g.home + Math.sin(τ * .9) * 24;
    // one try's claw pose at time τ (null when the try is not running); x0 = where the claw was when the try started
    const pose = (tr, τ, x0) => { const u = (τ - tr.T) / CLK, p = tr.pick, sp = clawSlot(g, n, p), gy = sp.y - 62; if (u < 0 || u > 5.2) return null;
      const o = { cx: 0, cy: 760, op: .55, held: -1, press: u > .85 && u < 1.05 ? 1 : 0 };
      if (u < .9){ o.cx = lerp(x0, sp.x, easeIO(u / .9)); o.op = lerp(.55, 1, u / .9); }
      else if (u < 1.5){ o.cx = sp.x; o.cy = lerp(760, gy, easeIO((u - .9) / .6)); o.op = 1; }
      else if (u < 1.8){ o.cx = sp.x; o.cy = gy; o.op = lerp(1, .12, (u - 1.5) / .3); if (u > 1.65) o.held = p; }
      else if (u < 2.6){ o.cx = sp.x; o.cy = lerp(gy, 760, easeIO((u - 1.8) / .8)); o.op = .12; o.held = p;
        if (tr.result === "slip" && u >= 2.25){ o.held = -1; o.op = .5 + Math.sin(u * 40) * .1; } }
      else if (tr.result === "win"){ const v = u - 2.6;
        if (v < .8){ o.cx = lerp(sp.x, g.home, easeIO(v / .8)); o.held = p; o.op = .12; }
        else if (v < 1.0){ o.cx = g.home; o.op = lerp(.12, 1, (v - .8) / .2); o.held = v < .85 ? p : -1; }
        else { o.cx = lerp(g.home, idle(τ), clamp((v - 1.6) / 1, 0, 1)); o.op = lerp(1, .55, clamp((v - 1) / 1, 0, 1)); } }
      else { const v = u - 2.6; o.op = .5; o.cx = v < .8 ? sp.x : lerp(sp.x, idle(τ), easeIO(clamp((v - .8) / .8, 0, 1))); }
      return o; };
    const x0s = []; tries.forEach((tr, k) => { const prev = k ? pose(tries[k - 1], tr.T, x0s[k - 1]) : null; x0s.push(prev ? prev.cx : idle(tr.T)); });
    const S = { cx: idle(t), cy: 760 + Math.sin(t * 1.7) * 5, op: .55, held: -1, won: new Set(), slip: null, chute: null, winPop: null, press: 0, tries };
    tries.forEach((tr, k) => { const u = (t - tr.T) / CLK, p = tr.pick, sp = clawSlot(g, n, p), gy = sp.y - 62; if (u < 0) return;
      if (tr.result === "win"){ if (u >= 3.45) S.won.add(p); if (u >= 3.45 && u < 3.8) S.chute = { p, q: (u - 3.45) / .35 }; if (u >= 3.95) S.winPop = { p, T: tr.T + 3.95 * CLK }; }
      if (tr.result === "slip" && u >= 2.25) S.slip = { p, u: (u - 2.25) * CLK, y0: lerp(gy, 760, easeIO(.5625)) + 62 };
      const o = pose(tr, t, x0s[k]); if (o) Object.assign(S, o); });
    return S; }
  function prizeDraw(ctx, th, p, x, y, k, sq){ const w = 150, h = 106, col = p.color || PALC[k % PALC.length]; ctx.save(); ctx.translate(x, y + h / 2); ctx.scale(1 / (sq || 1), sq || 1); ctx.translate(0, -h / 2);
    ctx.beginPath(); ctx.ellipse(-w * .3, -h / 2 + 4, 17, 21, -.3, 0, TAU); ctx.ellipse(w * .3, -h / 2 + 4, 17, 21, .3, 0, TAU); ctx.fillStyle = col; ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 40); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    rr(ctx, -w / 2 + 10, 2, w - 20, h / 2 - 10, 16); ctx.fillStyle = "#FFFFFF"; ctx.fill();
    if (p.icon) icon(ctx, p.icon, -17, -h / 2 + 10, 34, "#FFFFFF", 2.6);
    textIn(ctx, th, p.label, 0, 2 + (h / 2 - 10) / 2, w - 34, 22, 2, INK, 800); ctx.restore(); }
  TT.layout("claw", "Mesin capit", (ctx, th, s, t) => {
    const f = s.f; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const pz = (f.prizes || []).slice(0, 5), n = pz.length, g = clawGeo(f), { X0, X1, W, CX } = g, S = clawState(s, f, t, g), S0 = clawState(s, f, t - .06, g), vx = (S.cx - S0.cx) / .06;
    const winT = S.tries.filter(tr => tr.result === "win").map(tr => tr.T + 3.95 * CLK), slipT = S.tries.filter(tr => tr.result === "slip").map(tr => tr.T + 2.25 * CLK);
    camOpen(ctx, t, { cx: CX + 60, cy: 950, push: S.tries.map(tr => [tr.T + .9 * CLK, .012]).concat(winT.map(T => [T, .025])), shake: slipT.map(T => [T + .4, 7]).concat(winT.map(T => [T, 8])) });
    ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // cabinet body
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 28; ctx.shadowOffsetY = 12; rr(ctx, X0, 576, W, 724, 30); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.restore();
    rr(ctx, X0 + 24, 588, W - 48, 56, 18); ctx.fillStyle = INK; ctx.fill();
    for (let k = 0; k < 16; k++){ const on = Math.sin(t * 8 - k * .9) > 0; ctx.beginPath(); ctx.arc(X0 + 40 + k * (W - 80) / 15, 582, 6, 0, TAU); ctx.fillStyle = on ? YEL : "#7A3E1E"; ctx.fill(); }
    fitFont(ctx, th, f.title || "PILIH SATU", W - 90, 34, 900, 16); ctx.fillStyle = YEL; ctx.textAlign = "center"; ctx.fillText(f.title || "PILIH SATU", CX, 628); ctx.textAlign = "left";
    // glass
    rr(ctx, X0 + 20, 654, W - 40, 498, 14); ctx.fillStyle = "#E3F1F5"; ctx.fill();
    ctx.save(); rr(ctx, X0 + 20, 654, W - 40, 498, 14); ctx.clip();
    ctx.fillStyle = "rgba(47,111,115,.08)"; for (let k = 0; k < 8; k++) ctx.fillRect(X0 + 20 + k * 90, 654, 45, 498);
    // chute partition
    ctx.fillStyle = "rgba(194,105,31,.25)"; ctx.fillRect(X0 + 22, 1000, 124, 152); ctx.strokeStyle = "#7A3E1E"; ctx.lineWidth = 5; ctx.strokeRect(X0 + 22, 1000, 124, 152);
    for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(X0 + 30 + k * 30, 1010); ctx.lineTo(X0 + 22 + k * 30, 1140); ctx.strokeStyle = "rgba(122,62,30,.3)"; ctx.lineWidth = 3; ctx.stroke(); }
    // prizes
    pz.forEach((p, k) => { if (S.won.has(k) || S.held === k || (S.slip && S.slip.p === k && S.slip.u < .75)) return; const sp = clawSlot(g, n, k);
      const near = Math.abs(S.cx - sp.x) < 90 && S.cy > 900 ? 1 : 0, jig = near * Math.sin(t * 22 + k) * 3 + Math.sin(t * 1.6 + k * 2) * 1.5; prizeDraw(ctx, th, p, sp.x + jig, sp.y + Math.abs(jig) * .3, k, 1); });
    if (S.slip && S.slip.u < .75){ const k = S.slip.p, sp = clawSlot(g, n, k), u = S.slip.u, q = clamp(u / .42, 0, 1), y = lerp(S.slip.y0, sp.y, q * q), sq = u > .42 ? 1 + .22 * Math.sin((u - .42) * 22) * Math.exp(-(u - .42) * 8) : .9;
      prizeDraw(ctx, th, pz[k], sp.x + Math.sin(u * 20) * 4, y, k, sq); if (u > .42) puffs(ctx, sp.x, sp.y + 55, (u - .42) / .4, 7, "rgba(255,255,255,.9)", 70, 12); }
    if (S.chute){ const k = S.chute.p; prizeDraw(ctx, th, pz[k], g.home, lerp(822, 1210, S.chute.q * S.chute.q), k, 1.1); }
    // rail + claw
    ctx.fillStyle = "#8C8476"; ctx.fillRect(X0 + 26, 672, W - 52, 14); ctx.fillStyle = "#544E42"; rr(ctx, S.cx - 38, 664, 76, 30, 10); ctx.fill();
    const sw = clamp(-vx * .0009, -.35, .35) + Math.sin(t * 2.3) * .03, hx = S.cx + Math.sin(sw) * (S.cy - 694), hy = S.cy;
    ctx.strokeStyle = "#544E42"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(S.cx, 694); ctx.lineTo(hx, hy - 24); ctx.stroke();
    if (S.held >= 0){ const k = S.held; prizeDraw(ctx, th, pz[k], hx, hy + 62, k, .9 + Math.sin(t * 9) * .03); }
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(-sw * .6);
    rr(ctx, -30, -28, 60, 34, 12); ctx.fillStyle = "#9AA1A6"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    [-1, 1].forEach(d => { const a = .2 + S.op * .6; ctx.strokeStyle = "#544E42"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(d * 16, 4);
      const ex = d * 16 + d * Math.sin(a) * 46, ey = 4 + Math.cos(a) * 46; ctx.lineTo(ex, ey); ctx.lineTo(ex - d * 22 * (1 - S.op * .3), ey + 30); ctx.stroke(); });
    ctx.strokeStyle = "#6C747B"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(0, 44 + S.op * 6); ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 10; const rx = X0 + 60 + fr(t * .12) * (W - 120); ctx.beginPath(); ctx.moveTo(rx, 680); ctx.lineTo(rx - 50, 800); ctx.stroke();
    ctx.strokeStyle = "#7A3E1E"; ctx.lineWidth = 8; rr(ctx, X0 + 20, 654, W - 40, 498, 14); ctx.stroke();
    // front panel: chute flap, joystick, button
    rr(ctx, X0 + 28, 1178, 122, 96, 16); ctx.fillStyle = "#2B1A12"; ctx.fill();
    const flap = S.winPop && t - S.winPop.T < .5 ? Math.sin((t - S.winPop.T) / .5 * Math.PI) : 0; ctx.save(); ctx.translate(X0 + 28, 1178); ctx.scale(1, 1 - flap * .8); rr(ctx, 0, 0, 122, 60, 14); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.restore();
    const jx = X1 - 150, jtilt = clamp(vx * .0016, -.55, .55); ctx.beginPath(); ctx.ellipse(jx, 1240, 44, 14, 0, 0, TAU); ctx.fillStyle = INK; ctx.fill();
    ctx.save(); ctx.translate(jx, 1236); ctx.rotate(jtilt); ctx.strokeStyle = "#544E42"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -62); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -66, 20, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(X1 - 68, 1240 + S.press * 5, 28, 14, 0, 0, TAU); ctx.fillStyle = S.press ? YEL : "#3BB273"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    let Pa = null; if (f.actor) Pa = person(ctx, th, s, f.actor, t, 1300, .8, { x: 905, mirror: true, pose: "work",
      auto: [].concat(slipT.map(T => ({ at: T + .1, expr: "worried", emote: "sweat", pose: "cover" })), slipT.map(T => ({ at: T + 1.4, pose: "work", expr: "neutral" })), winT.map(T => ({ at: T, pose: "cheer", expr: "happy", jump: 2 }))) });
    // the won prize pops out to the front, big and glowing
    if (S.winPop){ const u = t - S.winPop.T, q = eOut(clamp(u / .6, 0, 1)), x = lerp(X0 + 89, CX + 40, q), y = lerp(1230, 860, q) - Math.sin(q * Math.PI) * 90, k = S.winPop.p, sc = lerp(.6, 1.55, eBack(clamp(u / .6, 0, 1)));
      rays(ctx, x, y, 200 * q, t, hexA(YEL, .9), .45 * q); glow(ctx, x, y, 210, YEL, .55 * q); burst(ctx, x, y, u - .5, mv(), 10); confetti(ctx, x, y, u - .45, 26, 11);
      ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 6 * q); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 2.4) * .05); prizeDraw(ctx, th, pz[k], 0, 0, k, 1 + .1 * Math.sin(u * 10) * Math.exp(-u * 3)); ctx.restore();
      if (f.winLabel) scaled(ctx, CX + 40, 1030, popAt(t, S.winPop.T + .55, .45), () => tag(ctx, th, f.winLabel, CX + 40, 1030, { size: 34, maxW: Math.min(W, 620), lines: 2, bg: GREEN, fg: "#fff", icon: "check" })); }
    if (Pa) personFx(ctx, th, Pa, t);
    ctx.restore();
  }, (s, f, i, add) => { (f.tries || []).forEach((tr, k) => { const T = at(s, tr.cue, .3 + k * .3, i); add(T, "whoosh"); add(T + 1.65 * CLK, "pop"); add(T + (tr.result === "win" ? 3.95 : 2.25) * CLK, tr.result === "win" ? "chime" : "pop"); });
    actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     plinko: a peg board; balls dropped from the hopper bounce from peg to peg (pegs flash) into labelled slots
     and stack up. drops:[{cue, slot, n, label, color}] (n balls per drop), resultCue/resultSlot/resultLabel
     highlight one slot at the end. slots:[{label, good, bad}] (2-4).
       f: slots, drops, resultCue, resultSlot, resultLabel, actor (left, watching)
     ===================================================================== */
  function plinkoPlan(s, f, i){
    const act = !!f.actor, X0 = act ? 300 : 200, X1 = act ? 968 : 880, W = X1 - X0, cx = (X0 + X1) / 2, slots = (f.slots || []).slice(0, 4), ns = Math.max(1, slots.length);
    const R = 7, PY0 = 712, DY = 58, DX = (W - 80) / 8, pegX = (r, j) => X0 + 40 + (j + (r % 2 ? .5 : 0)) * DX, slotX = k => X0 + 18 + (k + .5) * (W - 36) / ns;
    const balls = []; (f.drops || []).forEach((d, di) => { const T0 = at(s, d.cue, .15 + di * .25, i), cnt = d.n || 1;
      for (let b = 0; b < cnt; b++){ const seed = di * 31 + b * 7 + 1, Tr = T0 + b * (d.gap || .3), tgt = slotX(d.slot || 0);
        let x = pegX(0, clamp(Math.round((cx + (rnd(seed) - .5) * 60 - X0 - 40) / DX), 0, 8)); const xs = [x];
        for (let r = 1; r < R; r++){ const left = R - r, need = tgt - x, reach = left * DX / 2; let dir;
          if (Math.abs(need) >= reach - DX * .25) dir = Math.sign(need) || 1; else dir = rnd(seed * 13 + r) < .5 + clamp(need / (reach + 1), -.35, .35) ? 1 : -1;
          x = clamp(x + dir * DX / 2, X0 + 40, X1 - 40); xs.push(x); }
        balls.push({ Tr, xs, slot: d.slot || 0, color: d.color, seed, di, TL: Tr + .22 + (R - 1) * .17 + .3 }); } });
    const cnt = {}; balls.slice().sort((a, b) => a.TL - b.TL).forEach(b => { const c = cnt[b.slot] || 0; cnt[b.slot] = c + 1; b.stack = c; });
    return { X0, X1, W, cx, slots, ns, R, PY0, DY, DX, pegX, slotX, balls };
  }
  function plinkoPos(P, b, t){ const u = t - b.Tr; if (u < 0) return null; const { R, PY0, DY } = P;
    if (u < .22){ const q = u / .22; return { x: lerp(P.cx, b.xs[0], q), y: lerp(650, PY0 - 22, q * q), row: -1 }; }
    let v = u - .22; const rt = .17, r = Math.floor(v / rt);
    if (r < R - 1){ const q = (v - r * rt) / rt; return { x: lerp(b.xs[r], b.xs[r + 1], q), y: lerp(PY0 + r * DY, PY0 + (r + 1) * DY, q * q) - 22 - Math.sin(q * Math.PI) * 20, row: r, q }; }
    v -= (R - 1) * rt; const sx = P.slotX(b.slot) + (b.stack % 2 ? 17 : -17), sy = 1230 - Math.floor(b.stack / 2) * 33;
    if (v < .3){ const q = v / .3; return { x: lerp(b.xs[R - 1], sx, q), y: lerp(PY0 + (R - 1) * DY - 22, sy, q * q), row: R - 1, q }; }
    const w = v - .3; return { x: sx, y: sy - Math.abs(Math.sin(w * 11)) * 24 * Math.exp(-w * 5), landed: true, w }; }
  TT.layout("plinko", "Papan plinko", (ctx, th, s, t) => {
    const f = s.f; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const P = plinkoPlan(s, f), { X0, X1, W, cx, slots, ns, R, PY0, DY, DX, pegX, slotX, balls } = P, TRs = f.resultCue ? at(s, f.resultCue, .85) : null, RS = f.resultSlot != null ? f.resultSlot : -1;
    camOpen(ctx, t, { cx: RS >= 0 ? slotX(RS) : cx, cy: 1000, push: [[TRs, .035]], shake: balls.filter(b => b.stack === 0).map(b => [b.TL, 3]).concat([[TRs, 6]]) });
    ctx.globalAlpha *= clamp(t * 4, 0, 1);
    let Pa = null; if (f.actor) Pa = person(ctx, th, s, f.actor, t, 1300, .78, { x: 168, pose: "stand", auto: TRs != null ? [{ at: TRs + .1, pose: (slots[RS] || {}).bad ? "cover" : "cheer", expr: (slots[RS] || {}).bad ? "worried" : "happy", jump: (slots[RS] || {}).bad ? 0 : 1 }] : null });
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10; rr(ctx, X0, 586, W, 724, 34); ctx.fillStyle = WOOD; ctx.fill(); ctx.restore();
    rr(ctx, X0 + 14, 600, W - 28, 696, 24); ctx.fillStyle = "#FFF7EE"; ctx.fill();
    ctx.save(); rr(ctx, X0 + 14, 600, W - 28, 696, 24); ctx.clip();
    for (let k = 0; k < 9; k++){ ctx.fillStyle = k % 2 ? "rgba(194,105,31,.05)" : "rgba(47,111,115,.05)"; ctx.fillRect(X0 + k * W / 8, 600, W / 8, 700); }
    // slots
    const sw = (W - 36) / ns; slots.forEach((sl, k) => { const x0 = X0 + 18 + k * sw, hot = TRs != null && t >= TRs && k === RS, col = sl.good ? GREEN : sl.bad ? RED : TEAL;
      ctx.fillStyle = hot ? hexA(col, .22 + .12 * Math.sin(t * 9)) : "rgba(47,111,115,.07)"; ctx.fillRect(x0, 1110, sw, 190);
      rr(ctx, x0 + 6, 1250, sw - 12, 50, 12); ctx.fillStyle = hot ? col : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(col, .8); ctx.lineWidth = 3; ctx.stroke();
      textIn(ctx, th, sl.label, x0 + sw / 2, 1275, sw - 26, 24, 2, hot ? "#fff" : INK, 800); });
    for (let k = 0; k <= ns; k++){ const x = X0 + 18 + k * sw; ctx.fillStyle = "#7A3E1E"; rr(ctx, x - 5, 1110, 10, 140, 5); ctx.fill(); }
    // pegs
    for (let r = 0; r < R; r++) for (let j = 0; j < (r % 2 ? 8 : 9); j++){ const x = pegX(r, j), y = PY0 + r * DY; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.beginPath(); ctx.arc(x - 3, y - 3, 3, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fill(); }
    // balls (+ peg flashes)
    balls.forEach(b => { const p = plinkoPos(P, b, t); if (!p) return; const col = b.color || PALC[b.di % PALC.length];
      if (p.row >= 0 && p.row < R && !p.landed && p.q < .4){ const px = b.xs[p.row], py = PY0 + p.row * DY; glow(ctx, px, py, 34, YEL, .9 * (1 - p.q / .4)); ctx.beginPath(); ctx.arc(px, py, 11, 0, TAU); ctx.fillStyle = YEL; ctx.fill(); }
      if (p.landed && p.w < .5) puffs(ctx, p.x, p.y + 14, p.w / .5, 5, "rgba(59,36,24,.25)", 30, 7);
      const hot = TRs != null && t >= TRs && b.slot === RS && p.landed, bob = hot ? Math.abs(Math.sin(t * 7 + b.seed)) * -8 : 0;
      ctx.beginPath(); ctx.arc(p.x, p.y + bob, 17, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(p.x - 5, p.y - 5 + bob, 5, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fill(); });
    ctx.restore();
    // hopper
    ctx.beginPath(); ctx.moveTo(cx - 74, 596); ctx.lineTo(cx + 74, 596); ctx.lineTo(cx + 24, 652); ctx.lineTo(cx - 24, 652); ctx.closePath(); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    // current drop label
    const drops = f.drops || []; let cur = -1; drops.forEach((d, di) => { if (t >= at(s, d.cue, .15 + di * .25) - .05) cur = di; });
    if (cur >= 0 && drops[cur].label && !(TRs != null && t >= TRs)){ const T0 = at(s, drops[cur].cue, .15 + cur * .25); scaled(ctx, cx - 92, 628, popAt(t, T0 - .05, .4), () => tag(ctx, th, drops[cur].label, cx - 92, 628, { align: "right", size: 28, maxW: cx - 92 - 95, lines: 1, bg: drops[cur].color || PALC[cur % PALC.length], fg: "#fff", icon: drops[cur].icon })); }
    if (TRs != null && t >= TRs && RS >= 0){ const sl = slots[RS] || {}, x = slotX(RS); rays(ctx, x, 1190, 170, t, hexA(sl.bad ? RED : YEL, .8), .35 * ramp(t, TRs, .4));
      if (f.resultLabel) scaled(ctx, clamp(x, X0 + 150, X1 - 150), 1060, popAt(t, TRs + .1, .45), () => tag(ctx, th, f.resultLabel, clamp(x, X0 + 150, X1 - 150), 1060, { size: 32, maxW: Math.min(W - 20, 560), lines: 2, bg: sl.bad ? RED : GREEN, fg: "#fff", icon: sl.bad ? "alert" : "check" }));
      confetti(ctx, x, 1150, sl.bad ? -1 : t - TRs, 22, 3); }
    if (Pa) personFx(ctx, th, Pa, t);
    ctx.restore();
  }, (s, f, i, add) => { const P = plinkoPlan(s, f, i); let last = -9; P.balls.slice().sort((a, b) => a.Tr - b.Tr).forEach(b => { if (b.Tr - last > .25){ add(b.Tr, "pop"); last = b.Tr; } });
    if (f.resultCue) add(at(s, f.resultCue, .85, i), (f.slots || [])[f.resultSlot] && f.slots[f.resultSlot].bad ? "whoosh" : "chime"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     ferris: a turning ferris wheel; each cabin lights up on its cue (label + optional badge check/x/shield).
     stopCue: the wheel decelerates so cabin `pick` stops at the top (cabins swing on, then settle), hub badge pops.
       f: cabins:[{label, cue, color, badge}] (3-6), speed, stopCue, pick, hub, hubCue, actor (left, looking up)
     ===================================================================== */
  function ferrisTheta(f, TS, n){ const w = f.speed || .3, D = 2.4, pick = f.pick || 0;
    const th0 = TS == null ? 0 : -pick * TAU / n - (TS * w + w * D / 3);
    return τ => { if (TS == null || τ < TS) return th0 + w * τ; const q = clamp((τ - TS) / D, 0, 1), u = τ - TS - D;
      return th0 + w * TS + (w * D / 3) * (1 - Math.pow(1 - q, 3)) + (u > 0 ? .035 * Math.sin(u * 5) * Math.exp(-u * 2) : 0); }; }
  TT.layout("ferris", "Bianglala", (ctx, th, s, t) => {
    const f = s.f; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const cab = (f.cabins || []).slice(0, 6), n = Math.max(1, cab.length), T = cab.map((c, k) => c.cue ? at(s, c.cue, .15 + k * .12) : -1);
    const CX = f.actor ? 605 : 540, CY = 905, RAD = 272, TS = f.stopCue ? at(s, f.stopCue, .65) : null, D = 2.4, theta = ferrisTheta(f, TS, n), TH = f.hub ? (f.hubCue ? at(s, f.hubCue, .8) : TS != null ? TS + D * .8 : .5) : null;
    const settled = TS != null && t >= TS + D * .75;
    camOpen(ctx, t, { cx: CX, cy: 820, push: [[TS != null ? TS + D * .5 : null, .03]], shake: T.filter(x => x > 0).map(x => [x, 3]).concat([[TS != null ? TS + D * .8 : null, 5]]) });
    ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // stand + platform
    ctx.strokeStyle = DWOOD; ctx.lineWidth = 24; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(CX + d * 215, 1292); ctx.stroke(); });
    ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(CX - 120, 1110); ctx.lineTo(CX + 120, 1110); ctx.stroke();
    rr(ctx, CX - 290, 1284, 580, 24, 12); ctx.fillStyle = "#7A3E1E"; ctx.fill();
    // wheel
    const a0 = theta(t);
    ctx.strokeStyle = dark(th) ? "#E08A3C" : "#C2691F"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(CX, CY, RAD, 0, TAU); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(CX, CY, RAD - 34, 0, TAU); ctx.stroke();
    ctx.lineWidth = 4; ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.55)" : "rgba(122,62,30,.65)";
    for (let k = 0; k < n * 2; k++){ const a = a0 + k * Math.PI / n; ctx.beginPath(); ctx.moveTo(CX + Math.cos(a) * 40, CY + Math.sin(a) * 40); ctx.lineTo(CX + Math.cos(a) * RAD, CY + Math.sin(a) * RAD); ctx.stroke(); }
    for (let m = 0; m < 30; m++){ const a = a0 + m * TAU / 30, on = settled ? Math.sin(t * 12 + m) > 0 : Math.sin(t * 6 - m * .9) > 0;
      ctx.beginPath(); ctx.arc(CX + Math.cos(a) * (RAD - 17), CY + Math.sin(a) * (RAD - 17), 6, 0, TAU); ctx.fillStyle = on ? YEL : dark(th) ? "#5A4232" : "#E9D3B8"; ctx.fill(); }
    ctx.beginPath(); ctx.arc(CX, CY, 50, 0, TAU); ctx.fillStyle = INK; ctx.fill(); ctx.strokeStyle = YEL; ctx.lineWidth = 6; ctx.stroke();
    ctx.save(); ctx.translate(CX, CY); ctx.rotate(a0 * 2); ctx.fillStyle = YEL; star(ctx, 0, 0, 24); ctx.restore();
    // swing amount: decel push then damped settle
    const swingS = TS == null ? 0 : (() => { const q = (t - TS) / D, u = t - TS - D; return q < 0 ? 0 : q < 1 ? .22 * Math.sin(q * Math.PI / 2) : .22 * Math.cos(u * 6) * Math.exp(-u * 1.5); })();
    const order = cab.map((c, k) => k).sort((p, q) => Math.sin(a0 + p * TAU / n - Math.PI / 2) - Math.sin(a0 + q * TAU / n - Math.PI / 2));
    order.forEach(k => { const c = cab[k], a = a0 + k * TAU / n - Math.PI / 2, px = CX + Math.cos(a) * RAD, py = CY + Math.sin(a) * RAD, lit = T[k] < 0 || t >= T[k];
      const phi = swingS * Math.sin(a) + Math.sin(t * 1.9 + k * 1.3) * .035, isPick = TS != null && k === (f.pick || 0) && settled, col = c.color || PALC[k % PALC.length];
      ctx.save(); ctx.translate(px, py); ctx.rotate(phi);
      const pk = isPick ? 1 + .12 * eBack(ramp(t, TS + D * .75, .5)) : 1, lp = lit && T[k] > 0 ? popAt(t, T[k], .45) : 1;
      if (isPick){ rays(ctx, 0, 56, 150, t, hexA(YEL, .9), .4); glow(ctx, 0, 56, 150, YEL, .45); }
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fillStyle = INK; ctx.fill();
      ctx.scale(pk, pk);
      rr(ctx, -98, 16, 196, 80, 22); ctx.fillStyle = lit ? PAPER : "#D9D2C6"; ctx.fill(); ctx.strokeStyle = lit ? col : "#A89F92"; ctx.lineWidth = 6; ctx.stroke();
      rr(ctx, -98, 16, 196, 18, [22, 22, 0, 0]); ctx.fillStyle = lit ? col : "#A89F92"; ctx.fill();
      if (lit){ ctx.save(); ctx.translate(0, 62); ctx.scale(lp, lp); textIn(ctx, th, c.label, 0, 0, 170, 26, 2, INK, 800); ctx.restore(); }
      else { font(ctx, 800, 32, th.fam); ctx.fillStyle = "#A89F92"; ctx.textAlign = "center"; ctx.fillText("?", 0, 72); ctx.textAlign = "left"; }
      if (lit && c.badge){ const bq = popAt(t, (T[k] > 0 ? T[k] : 0) + .35, .4); if (bq > 0){ ctx.save(); ctx.translate(90, 20); ctx.scale(bq, bq); if (c.badge === "x") crossDisc(ctx, 0, 0, 22); else if (c.badge === "check") checkDisc(ctx, 0, 0, 22); else { ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = TEAL; ctx.fill(); icon(ctx, c.badge, -15, -15, 30, "#fff", 2.4); } ctx.restore(); } }
      ctx.restore();
      if (lit && T[k] > 0) burst(ctx, px, py + 56, t - T[k], mv(), 8); });
    if (TH != null && t >= TH){ const q = popAt(t, TH, .5); scaled(ctx, CX, CY, q, () => { glow(ctx, CX, CY, 150, f.hubBad ? RED : YEL, .5); tag(ctx, th, f.hub, CX, CY, { size: 32, maxW: 340, lines: 2, bg: f.hubBad ? RED : GREEN, fg: "#fff", icon: f.hubIcon || (f.hubBad ? "alert" : "check") }); }); if (!f.hubBad) confetti(ctx, CX, CY - 40, t - TH, 24, 7); }
    let Pa = null; if (f.actor) Pa = person(ctx, th, s, f.actor, t, 1300, .8, { x: 158, pose: "point", auto: TS != null ? [{ at: TS + D * .8, pose: "cheer", expr: "happy", jump: 2 }] : null });
    if (Pa) personFx(ctx, th, Pa, t);
    ctx.restore();
  }, (s, f, i, add) => { (f.cabins || []).forEach((c, k) => { if (c.cue) add(at(s, c.cue, .15 + k * .12, i), "pop"); });
    if (f.stopCue){ const TS = at(s, f.stopCue, .65, i); add(TS, "whoosh"); add(TS + 2.4 * .8, "chime"); } else if (f.hub && f.hubCue) add(at(s, f.hubCue, .8, i), "chime"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     fishing: the actor sits on a pier with a rod; castCue flings the bobber; fish (labelled) swim below;
     catchCue: the bobber dips, the rod bends and the chosen fish (or a boot) is yanked out with a splash.
       f: fish:[{label, cue, kind:"fish"|"boot", color}] (<=3), castCue, catchCue, catch, catchLabel, bait, actor
     ===================================================================== */
  function fishDraw(ctx, x, y, dir, t, col, kind, k){ ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
    if (kind === "boot"){ ctx.rotate(.15); rr(ctx, -30, -46, 44, 70, 8); ctx.fillStyle = "#5A3A22"; ctx.fill(); rr(ctx, -30, 8, 86, 28, 12); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; rr(ctx, -30, -46, 44, 70, 8); ctx.stroke(); ctx.fillStyle = "#7CC4E8"; ctx.beginPath(); ctx.arc(30, -30, 6, 0, TAU); ctx.fill(); ctx.restore(); return; }
    const wag = Math.sin(t * 12 + k) * .35;
    ctx.save(); ctx.translate(-52, 0); ctx.rotate(wag); ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-34, -26); ctx.lineTo(-34, 26); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, 60, 32, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(4, 10, 40, 14, 0, 0, Math.PI); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-6, -30); ctx.quadraticCurveTo(8, -50 + Math.sin(t * 6) * 4, 26, -26); ctx.fillStyle = col; ctx.fill();
    ctx.beginPath(); ctx.arc(34, -8, 8, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); ctx.beginPath(); ctx.arc(36, -8, 4, 0, TAU); ctx.fillStyle = INK; ctx.fill(); ctx.restore(); }
  TT.layout("fishing", "Memancing", (ctx, th, s, t) => {
    const f = s.f; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const fish = (f.fish || []).slice(0, 3), FT = fish.map((x, k) => x.cue ? at(s, x.cue, .2 + k * .15) : 0), WY = 1088, TC = f.castCue ? at(s, f.castCue, .1) : null, TB = f.catchCue ? at(s, f.catchCue, .7) : null, ci = f.catch || 0, BX = 742;
    const boot = TB != null && fish[ci] && fish[ci].kind === "boot";
    camOpen(ctx, t, { cx: 600, cy: 900, push: [[TB != null ? TB + .7 : null, .035]], shake: [[TB, 6], [TB != null ? TB + .7 : null, 9]] });
    ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // sky life: clouds + birds
    for (let k = 0; k < 3; k++){ const x = 90 + fr(t * .025 + k * .37) * 1000, y = 640 + k * 95; ctx.save(); ctx.globalAlpha *= dark(th) ? .22 : .85; ctx.fillStyle = "#FFFFFF";
      [[0, 0, 34], [32, -12, 40], [70, 0, 30], [36, 10, 32]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx - 40, y + dy, r, 0, TAU); ctx.fill(); }); ctx.restore(); }
    ctx.strokeStyle = lineCol(th); ctx.lineWidth = 4; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const x = 1000 - fr(t * .06 + k * .21) * 900, y = 700 + k * 40 + Math.sin(t * 2 + k) * 10, fl = Math.sin(t * 9 + k) * 10;
      ctx.beginPath(); ctx.moveTo(x - 18, y - fl); ctx.quadraticCurveTo(x - 8, y - 6, x, y); ctx.quadraticCurveTo(x + 8, y - 6, x + 18, y - fl); ctx.stroke(); }
    // water
    ctx.save(); rr(ctx, 90, WY - 10, 900, 1330 - WY + 10, [0, 0, 30, 30]); ctx.clip();
    const wg = ctx.createLinearGradient(0, WY, 0, 1330); wg.addColorStop(0, "#6FC0E0"); wg.addColorStop(1, "#2F6F9F"); ctx.fillStyle = wg;
    ctx.beginPath(); ctx.moveTo(90, 1340); for (let x = 90; x <= 990; x += 15) ctx.lineTo(x, WY + Math.sin(x * .025 + t * 2.2) * 5); ctx.lineTo(990, 1340); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 4; for (let k = 0; k < 6; k++){ const x = 100 + fr(t * .05 + k * .17) * 880, y = 1140 + (k % 3) * 55; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 20, y - 8, x + 40, y); ctx.stroke(); }
    // fish swimming
    const fishPos = k => { const sp = .32 * (1 + k * .23), ph = t * sp + k * 2.1, x0 = 640 + 250 * Math.sin(ph), dir0 = Math.cos(ph) >= 0 ? 1 : -1, y0 = 1185 + k * 52 + Math.sin(t * 1.4 + k) * 7;
      if (TB != null && k === ci && t > TB - 1.4){ const q = easeIO(clamp((t - (TB - 1.4)) / 1.2, 0, 1)), sx = 640 + 250 * Math.sin((TB - 1.4) * sp + k * 2.1); return { x: lerp(sx, BX - 50, q), y: lerp(y0, WY + 38, q), dir: 1 }; }
      return { x: x0, y: y0, dir: dir0 }; };
    fish.forEach((fi, k) => { if (t < FT[k] || (TB != null && k === ci && t > TB + .7)) return; const p = fishPos(k), a = clamp((t - FT[k]) / .5, 0, 1); ctx.save(); ctx.globalAlpha *= a; fishDraw(ctx, p.x, p.y + (1 - a) * 40, p.dir, t, fi.color || PALC[(k + 1) % PALC.length], fi.kind, k); ctx.restore(); });
    ctx.restore();
    fish.forEach((fi, k) => { if (t < FT[k] || (TB != null && k === ci && t > TB - .2)) return; const p = fishPos(k); scaled(ctx, p.x, p.y - 58, popAt(t, FT[k], .4), () => tag(ctx, th, fi.label, p.x, p.y - 58, { size: 24, maxW: 250, bg: PAPER, fg: INK, stroke: fi.kind === "boot" ? RED : TEAL, lw: 3 })); });
    // pier
    [130, 250, 350].forEach(x => { ctx.fillStyle = DWOOD; ctx.fillRect(x - 12, WY - 30, 24, 250); });
    rr(ctx, 90, WY - 40, 300, 30, 8); ctx.fillStyle = WOOD; ctx.fill(); ctx.strokeStyle = DWOOD; ctx.lineWidth = 3; for (let x = 140; x < 390; x += 50){ ctx.beginPath(); ctx.moveTo(x, WY - 40); ctx.lineTo(x, WY - 10); ctx.stroke(); }
    // actor on the pier edge
    const SC = .8, GY = WY - 40 + 112 * SC;
    const autoK = TB != null ? [{ at: TB - .5, expr: "shock", emote: "!" }, { at: TB + 1.0, expr: boot ? "confused" : "happy", emote: boot ? "?" : "sparkle" }] : [];
    const Pa = person(ctx, th, s, Object.assign({ sit: true }, f.actor || DEF_A), t, GY, SC, { x: 300, pose: "point", auto: autoK });
    const [hx, hy] = Pa.hand();
    // rod angle (cast: back then fling; catch: pulled down, then yank)
    let ra = TC != null && t < TC ? -1.15 : -.85, bend = 22 + Math.sin(t * 2) * 3;
    if (TC != null && t >= TC){ const u = t - TC; ra = u < .3 ? lerp(-1.15, -2.05, eOut(u / .3)) : u < .5 ? lerp(-2.05, -.55, (u - .3) / .2) : lerp(-.55, -.85, eEl(clamp((u - .5) / .8, 0, 1))); }
    if (TB != null){ const u = t - TB; if (u > -.6 && u < 0) ra += Math.sin(u * 40) * .025; if (u >= 0 && u < .7){ ra = -.5 + Math.sin(u * 50) * .04; bend = 70; } else if (u >= .7){ ra = lerp(-.5, -1.12, eBack(clamp((u - .7) / .4, 0, 1))); bend = lerp(60, 34, clamp((u - .7) / .6, 0, 1)) + Math.sin(u * 14) * 6 * Math.exp(-(u - .7) * 2); } }
    const L = 400, tipX = hx + Math.cos(ra) * L, tipY = hy + Math.sin(ra) * L + bend * .7, mx = hx + Math.cos(ra) * L * .55 - Math.sin(ra) * 0, my = hy + Math.sin(ra) * L * .55 + bend;
    ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(mx, my, tipX, tipY); ctx.stroke();
    ctx.beginPath(); ctx.arc(hx + Math.cos(ra) * 40, hy + Math.sin(ra) * 40 + 4, 12, 0, TAU); ctx.fillStyle = "#544E42"; ctx.fill();
    // bobber + line
    let bx, by, inWater = false;
    if (TC != null && t < TC + .5){ bx = tipX + Math.sin(t * 2.4) * 10; by = tipY + 90; }
    else if (TC != null && t < TC + 1.15){ const q = (t - TC - .5) / .65; bx = lerp(tipX, BX, q); by = lerp(tipY + 40, WY, q) - Math.sin(q * Math.PI) * 170; }
    else { inWater = true; bx = BX + Math.sin(t * .7) * 8; by = WY - 2 + Math.sin(t * 3) * 4; }
    const caught = TB != null && t >= TB + .7, fq = caught ? clamp((t - TB - .7) / .5, 0, 1) : 0;
    if (TB != null && t >= TB - .6 && t < TB + .7){ const u = t - TB; by += u < 0 ? Math.abs(Math.sin(u * 18)) * 8 : 24 + Math.sin(u * 30) * 4; }
    let fx = 0, fy = 0;
    if (caught){ const hangX = tipX + 6, hangY = tipY + 118, sx = BX - 20, sy = WY + 20; fx = lerp(sx, hangX, eOut(fq)); fy = lerp(sy, hangY, eOut(fq)) - Math.sin(fq * Math.PI) * 120; bx = fx; by = fy - 70; }
    ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.75)" : "rgba(59,36,24,.7)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.quadraticCurveTo((tipX + bx) / 2, Math.max(tipY, by) + (inWater && !caught ? 40 : 0), bx, by); ctx.stroke();
    if (inWater && !caught) for (let k = 0; k < 2; k++){ const q = fr(t * .7 + k * .5); ctx.save(); ctx.globalAlpha *= (1 - q) * .8; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(bx, WY + 4, 20 + q * 70, 5 + q * 14, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
    if (TC != null) { const u = t - TC - 1.15; if (u > 0 && u < .8){ puffs(ctx, BX, WY, u / .8, 8, "rgba(255,255,255,.9)", 60, 10); } }
    if (!caught || fq < 1){ ctx.beginPath(); ctx.arc(bx, by, 16, Math.PI, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.beginPath(); ctx.arc(bx, by, 16, 0, Math.PI); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx, by, 16, 0, TAU); ctx.stroke(); }
    if (f.bait && !caught && (TC == null || t > TC + 1.15)) scaled(ctx, bx, WY - 74, popAt(t, TC != null ? TC + 1.2 : .3, .4), () => tag(ctx, th, f.bait, bx + Math.sin(t * 2) * 4, WY - 74, { size: 26, maxW: 330, bg: YEL, fg: INK, stroke: INK, lw: 3, icon: "money" }));
    // the catch: splash, fish/boot dangling with squash & wiggle
    if (TB != null && t >= TB + .7){ const u = t - TB - .7; for (let k = 0; k < 14; k++){ const a = -Math.PI / 2 + (rnd(k) - .5) * 2.2, v = 300 + rnd(k + 4) * 300, x = BX - 20 + Math.cos(a) * v * u, y = WY + Math.sin(a) * v * u + 900 * u * u;
        if (u < 1){ ctx.beginPath(); ctx.arc(x, y, 7 * (1 - u * .5), 0, TAU); ctx.fillStyle = "rgba(160,215,240,.95)"; ctx.fill(); } }
      const fi = fish[ci] || {}, wig = Math.sin(t * 16) * .35 * Math.exp(-u * 1.1) + Math.sin(t * 3) * .08, stc = 1 + .18 * Math.sin(u * 18) * Math.exp(-u * 2.5);
      if (!boot) glow(ctx, fx, fy, 110 * fq, YEL, .4 * fq);
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.PI / 2 * (boot ? .2 : .85) + wig); ctx.scale(stc, 1 / stc); fishDraw(ctx, 0, 0, -1, t, fi.color || PALC[(ci + 1) % PALC.length], fi.kind, ci); ctx.restore();
      if (!boot) confetti(ctx, fx, fy, u - .3, 18, 9);
      const lab = f.catchLabel || fi.label; if (lab) scaled(ctx, 420, 700, popAt(t, TB + 1.1, .45), () => tag(ctx, th, lab, 420, 700 + Math.sin(t * 2.2) * 4, { size: 34, maxW: 560, lines: 2, bg: boot ? RED : GREEN, fg: "#fff", icon: boot ? "alert" : "check" })); }
    personFx(ctx, th, Pa, t);
    ctx.restore();
  }, (s, f, i, add) => { if (f.castCue) { const TC = at(s, f.castCue, .1, i); add(TC + .3, "whoosh"); add(TC + 1.15, "pop"); }
    (f.fish || []).forEach((x, k) => { if (x.cue) add(at(s, x.cue, .2 + k * .15, i), "pop"); });
    if (f.catchCue){ const TB = at(s, f.catchCue, .7, i), boot = (f.fish || [])[f.catch || 0] && f.fish[f.catch || 0].kind === "boot"; add(TB, "pop"); add(TB + .7, "whoosh"); add(TB + 1.1, boot ? "pop" : "chime"); } actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     bowling: perspective lane; pins (labelled with side tags) drop in on their cues; rollCue: wind-up, the ball
     rolls up the lane (spin, speed lines, rumble) and hits. result "strike": pins fly (stay:true pins remain and
     glow), STRIKE! burst; "gutter": the ball slides into the gutter, pins wobble.
       f: pins:[{label, cue, stay}] (<=6), rollCue, result:"strike"|"gutter", knock:"fade"|"check", strikeText, endLabel, ballLabel, actor
     ===================================================================== */
  function pinShape(ctx, x, y, sc, rot, glowA){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(sc, sc);
    if (glowA > 0) glow(ctx, 0, -70, 110, GREEN, glowA);
    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.bezierCurveTo(-36, -40, -30, -70, -13, -92); ctx.bezierCurveTo(-8, -102, -20, -120, -14, -134); ctx.bezierCurveTo(-8, -150, 8, -150, 14, -134);
    ctx.bezierCurveTo(20, -120, 8, -102, 13, -92); ctx.bezierCurveTo(30, -70, 36, -40, 20, 0); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = RED; ctx.fillRect(-12, -108, 24, 6); ctx.fillRect(-12, -98, 24, 6); ctx.restore(); }
  TT.layout("bowling", "Boling", (ctx, th, s, t) => {
    const f = s.f; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const pins = (f.pins || []).slice(0, 6), n = pins.length, T = timesOf(s, pins, .1, .14), TR = at(s, f.rollCue, .6), TI = TR + 1.0, gut = f.result === "gutter";
    const ROWS = { 1: [1], 2: [2], 3: [1, 2], 4: [1, 3], 5: [2, 3], 6: [1, 2, 3] }[Math.max(1, n)] || [1], pos = [];
    ROWS.forEach((c, j) => { for (let m = 0; m < c; m++) pos.push({ x: 590 + (m - (c - 1) / 2) * (104 - j * 8), y: 884 - j * 42, sc: 1.2 - j * .1 }); });
    const rolling = t > TR && t < TI + .2;
    camOpen(ctx, t, { cx: 590, cy: 880, push: [[TI - .3, .04]], shake: [[TI, gut ? 4 : 14]].concat(T.map(x => [x + .45, 3])) });
    ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // lane
    const L = (y) => { const q = (1330 - y) / (1330 - 770); return { l: lerp(300, 480, q), r: lerp(880, 700, q) }; };
    ctx.beginPath(); ctx.moveTo(258, 1330); ctx.lineTo(922, 1330); ctx.lineTo(718, 770); ctx.lineTo(462, 770); ctx.closePath(); ctx.fillStyle = "#544E42"; ctx.fill();
    ctx.beginPath(); ctx.moveTo(300, 1330); ctx.lineTo(880, 1330); ctx.lineTo(700, 770); ctx.lineTo(480, 770); ctx.closePath(); const lg = ctx.createLinearGradient(0, 770, 0, 1330); lg.addColorStop(0, "#E2B06A"); lg.addColorStop(1, "#F0C88A"); ctx.fillStyle = lg; ctx.fill();
    ctx.strokeStyle = "rgba(122,62,30,.18)"; ctx.lineWidth = 2; for (let k = 1; k < 10; k++){ ctx.beginPath(); ctx.moveTo(lerp(300, 880, k / 10), 1330); ctx.lineTo(lerp(480, 700, k / 10), 770); ctx.stroke(); }
    { const gq = fr(t * .45), gy = lerp(1330, 770, gq), w = L(gy); ctx.save(); ctx.globalAlpha *= .35 * Math.sin(gq * Math.PI); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(w.l, gy); ctx.lineTo(w.r, gy); const w2 = L(gy - 40); ctx.lineTo(w2.r, gy - 40); ctx.lineTo(w2.l, gy - 40); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.globalAlpha *= .4 + .3 * Math.sin(t * 3); for (let k = 0; k < 5; k++){ const y = 1080, w = L(y), x = lerp(w.l, w.r, (k + 1) / 6); ctx.beginPath(); ctx.moveTo(x, y - 22); ctx.lineTo(x - 11, y); ctx.lineTo(x + 11, y); ctx.closePath(); ctx.fillStyle = "#C2691F"; ctx.fill(); } ctx.restore();
    // pit behind pins
    rr(ctx, 430, 628, 320, 150, 18); ctx.fillStyle = "#2B1A12"; ctx.fill(); for (let k = 0; k < 10; k++){ ctx.beginPath(); ctx.arc(452 + k * 30.6, 642, 6, 0, TAU); ctx.fillStyle = Math.sin(t * 7 - k) > 0 ? YEL : "#5A3A22"; ctx.fill(); }
    // ball position
    const P0 = null; let Pa = null, ball = null;
    const drawBall = (x, y, r, spin) => { ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); const bg = ctx.createRadialGradient(-r * .3, -r * .35, 2, 0, 0, r); bg.addColorStop(0, "#5DA4E8"); bg.addColorStop(1, "#1E4F8F"); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.rotate(spin); ctx.fillStyle = "#0E2440"; [[0, -.4], [-.25, -.15], [.25, -.15]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(dx * r, dy * r, r * .11, 0, TAU); ctx.fill(); }); ctx.restore(); };
    // pins (back rows first) + flying pins
    const order = pins.map((p, k) => k).sort((a, b) => pos[a].y - pos[b].y);
    const ballAt = τ => { const q = clamp((τ - TR) / 1.0, 0, 1); if (gut){ const x = lerp(470, 700, Math.min(1, q * 1.3)), y = lerp(1255, 760, q * (1.15 - .15 * q)); return { x: Math.min(x, L(y).r + 22), y, r: lerp(46, 20, q) }; }
      return { x: lerp(470, 590, q) + Math.sin(q * Math.PI) * 40, y: lerp(1255, 880, q * (1.15 - .15 * q)), r: lerp(46, 26, q) }; };
    if (t >= TR && t < TI + (gut ? .3 : .05)){ const b = ballAt(t), b2 = ballAt(t - .05); speedLines(ctx, b.x, b.y, b.x - b2.x, b.y - b2.y, 3, 70, .8, t, dark(th) ? "rgba(255,255,255,.6)" : "rgba(59,36,24,.35)"); }
    order.forEach(k => { const p = pos[k], pn = pins[k], u0 = t - T[k]; if (u0 < 0) return; const q = clamp(u0 / .45, 0, 1);
      let x = p.x, y = p.y - 260 * Math.pow(1 - q, 2), rot = Math.sin(t * 2.4 + k) * .015, sq = 1, al = 1;
      if (q >= 1){ const v = u0 - .45; sq = 1 - .16 * Math.cos(v * 30) * Math.exp(-v * 8); }
      if (t >= TI && !gut && !pn.stay){ const u = t - TI - (p.y < 840 ? .05 : 0); if (u > 0){ const vx = (p.x - 590) * 6 + (rnd(k) - .5) * 420, vy = -700 - rnd(k + 5) * 380;
        x = p.x + vx * u; y = p.y + vy * u + 1700 * u * u; rot = (rnd(k + 2) - .5) * 16 * u; al = clamp(1.3 - u, 0, 1); } }
      if (t >= TI && (gut || pn.stay)){ const u = t - TI; rot += Math.sin(u * 14) * (gut ? .1 : .22) * Math.exp(-u * 3); }
      if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.scale(1 / sq, sq); pinShape(ctx, 0, 0, p.sc, rot, pn.stay && t >= TI + .3 && !gut ? .4 + .15 * Math.sin(t * 5) : 0); ctx.restore(); });
    // ball (held -> wind-up -> roll)
    Pa = person(ctx, th, s, f.actor || DEF_A, t, 1300, .86, { x: 200, pose: "stand",
      auto: [{ at: TR - .55, pose: "down" }, { at: TR, pose: "point" }, { at: TI + .15, pose: gut ? "cover" : "cheer", expr: gut ? "worried" : "happy", jump: gut ? 0 : 2 }, { at: TI + .15, emote: gut ? "sweat" : "sparkle" }],
      lean: t > TR - .55 && t < TR ? -.08 * Math.sin((t - TR + .55) / .55 * Math.PI) : t >= TR && t < TR + .6 ? .06 * Math.sin((t - TR) / .6 * Math.PI) : 0 });
    if (t < TR){ const [hx, hy] = Pa.hand(); let bx = hx + 8, by = hy + 26 - Math.abs(Math.sin(t * 3.2)) * 16; if (t > TR - .55){ const q = (t - TR + .55) / .55; bx = lerp(hx - 40, 470, eOut(q)) - Math.sin(q * Math.PI) * 120; by = lerp(hy + 30, 1255, q) - Math.sin(q * Math.PI) * 40; } drawBall(bx, by, 46, 0);
      if (f.ballLabel) scaled(ctx, bx, by - 80, popAt(t, .3, .4), () => tag(ctx, th, f.ballLabel, bx + 40, by - 80, { size: 26, maxW: 300, bg: "#1E4F8F", fg: "#fff" })); }
    else if (t < TI + (gut ? .3 : .05)){ const b = ballAt(t); drawBall(b.x, b.y, b.r, (t - TR) * 14); }
    // tags with leader lines
    let nl = 0, nr = 0; const side = pos.map(p => p.x < 589 ? -1 : p.x > 591 ? 1 : 0).map((d, k) => d || (k % 2 ? 1 : -1));
    const slotY = pins.map((p, k) => side[k] < 0 ? 640 + (nl++) * 104 : 640 + (nr++) * 104), TXL = 425, TXR = 755;
    pins.forEach((pn, k) => { const u0 = t - T[k] - .3; if (u0 < 0) return; const p = pos[k], d = side[k], ty = slotY[k], tx = d < 0 ? TXL : TXR, knocked = t >= TI + .1 && !gut && !pn.stay, keep = t >= TI + .3 && !gut && pn.stay;
      let al = 1, dy = 0; if (knocked && f.knock !== "check"){ const u = t - TI - .1; al = 1 - .35 * clamp(u / .6, 0, 1); dy = 26 * eBack(clamp(u / .5, 0, 1)) + Math.sin(t * 2 + k) * 3; }
      if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al * clamp(u0 / .2, 0, 1);
      if (!knocked){ ctx.strokeStyle = lineCol(th); ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y - 140 * p.sc); ctx.stroke(); ctx.setLineDash([]); }
      const chk = knocked && f.knock === "check";
      scaled(ctx, tx, ty + dy, popAt(t, T[k] + .3, .4) * (keep ? 1 + .06 * Math.sin(t * 6) : 1), () => tag(ctx, th, pn.label, tx, ty + dy, { align: d < 0 ? "right" : "left", size: 28, maxW: d < 0 ? 330 : 232, lines: 2,
        bg: keep || chk ? GREEN : PAPER, fg: keep || chk ? "#fff" : INK, stroke: keep || chk ? null : "#C2691F", lw: 3, icon: keep ? "star" : chk ? "check" : null, strike: knocked && !chk ? clamp((t - TI - .1) / .3, 0, 1) : 0 }));
      ctx.restore(); });
    if (t >= TI){ if (!gut){ confetti(ctx, 590, 820, t - TI, 34, 13); bigWord(ctx, th, 590, 760, t - TI - .05, f.strikeText || "STRIKE!", YEL); }
      else puffs(ctx, 690, 780, (t - TI) / .7, 6, "rgba(255,255,255,.7)", 40, 10);
      if (f.endLabel) scaled(ctx, 590, 1040, popAt(t, TI + .7, .45), () => tag(ctx, th, f.endLabel, 590, 1040, { size: 34, maxW: 600, lines: 2, bg: gut ? RED : GREEN, fg: "#fff", icon: gut ? "alert" : "check" })); }
    personFx(ctx, th, Pa, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, (f.pins || []).slice(0, 6), .1, .14, i).forEach(T => add(T + .42, "pop")); const TR = at(s, f.rollCue, .6, i);
    add(TR + .2, "whoosh"); add(TR + 1.0, "pop"); if (f.result !== "gutter") add(TR + 1.1, "chime"); if (f.endLabel) add(TR + 1.7, "pop"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     slingshot: the actor pulls a slingshot further back with every item (tags pop in the left column), trembles at
     full stretch, fireCue releases: the band snaps, the ball arcs (trail, spin) into the target board (wobble,
     rings, confetti, hit word). result "miss" sails over.
       f: items:[{label, cue, icon}] (<=3), fireCue, target:{label, icon}, ammo (icon), result:"hit"|"miss", hitText, endLabel, actor
     ===================================================================== */
  TT.layout("slingshot", "Ketapel", (ctx, th, s, t) => {
    const f = s.f; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const its = (f.items || []).slice(0, 3), n = its.length, T = timesOf(s, its, .12, .16), TF = at(s, f.fireCue, .72), TH = TF + .85, miss = f.result === "miss";
    const FX = 470, FY = 1010, tx = 822, ty = 836, TRd = 116;
    camOpen(ctx, t, { cx: t < TF ? 420 : 640, cy: 960, push: [[TF - .9, .02], [TH, .03]], shake: [[TH, miss ? 0 : 12], [TF, 4]] });
    ctx.globalAlpha *= clamp(t * 4, 0, 1);
    for (let k = 0; k < 2; k++){ const x = 1080 - fr(t * .03 + k * .5) * 1100, y = 700 + k * 150; ctx.save(); ctx.globalAlpha *= dark(th) ? .2 : .8; ctx.fillStyle = "#FFFFFF";
      [[0, 0, 30], [30, -12, 38], [66, 0, 28], [34, 10, 30]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx - 40, y + dy, r, 0, TAU); ctx.fill(); }); ctx.restore(); }
    { const fx0 = tx + 12, fy0 = 1180; ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.moveTo(fx0, fy0); for (let k = 0; k <= 8; k++) ctx.lineTo(fx0 + k * 10, fy0 + Math.sin(t * 7 - k * .8) * (k * 1.4)); for (let k = 8; k >= 0; k--) ctx.lineTo(fx0 + k * 10, fy0 + 40 + Math.sin(t * 7 - k * .8) * (k * 1.4)); ctx.closePath(); ctx.fill(); }
    let pull = 0; T.forEach(T0 => pull += eOut(ramp(t, T0, .5))); pull = n ? pull / n * .75 : 0; pull = Math.max(pull, eOut(ramp(t, TF - .9, .6))); if (t >= TF) pull = 0;
    // target board on its post
    const hu = t - TH, hit = !miss && hu >= 0, wob = hit ? .28 * Math.sin(hu * 13) * Math.exp(-hu * 3) : Math.sin(t * 1.3) * .02, kb = hit ? 22 * Math.exp(-hu * 5) * Math.sin(hu * 9) : 0;
    ctx.fillStyle = DWOOD; ctx.fillRect(tx - 12, ty + 60, 24, 1300 - ty - 60); rr(ctx, tx - 70, 1288, 140, 18, 9); ctx.fill();
    ctx.save(); ctx.translate(tx + kb, ty + TRd); ctx.rotate(wob); ctx.translate(0, -TRd);
    if (hit) glow(ctx, 0, 0, 200, YEL, .5 * Math.exp(-hu * .6) + .15);
    [[1, "#FFFFFF"], [.82, RED], [.62, "#FFFFFF"], [.42, RED], [.22, YEL]].forEach(([k, c]) => { ctx.beginPath(); ctx.arc(0, 0, TRd * k, 0, TAU); ctx.fillStyle = c; ctx.fill(); });
    ctx.beginPath(); ctx.arc(0, 0, TRd, 0, TAU); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    if (hit){ const sq = 1 + .3 * Math.exp(-hu * 6); ctx.save(); ctx.scale(1 / sq, sq); ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); icon(ctx, f.ammo || "star", -15, -15, 30, "#fff", 2.4); ctx.restore(); }
    ctx.restore();
    if (f.target) scaled(ctx, tx, ty - TRd - 42, popAt(t, .2, .45), () => tag(ctx, th, f.target.label, tx, ty - TRd - 42 + Math.sin(t * 2) * 3, { size: 28, maxW: 330, bg: INK, fg: PAPER, icon: f.target.icon || "target" }));
    if (hit){ for (let r = 0; r < 3; r++) ringFx(ctx, tx, ty, (hu - r * .15) / .7, TRd, TRd + 110, YEL, 7); sparks(ctx, tx, ty, hu, 12, YEL); confetti(ctx, tx, ty, hu - .05, 30, 17); }
    // items column
    its.forEach((it, k) => { if (t < T[k]) return; const y = 650 + k * 100; burst(ctx, 250, y, t - T[k], mv(), 7);
      scaled(ctx, 92, y, popAt(t, T[k], .4), () => tag(ctx, th, it.label, 92, y + Math.sin(t * 2 + k) * 3, { align: "left", size: 29, maxW: 400, lines: 2, bg: PAPER, fg: INK, stroke: "#C2691F", lw: 3, icon: it.icon || "check" })); });
    // actor pulls back (trembles at full stretch)
    const Pa = person(ctx, th, s, f.actor || DEF_A, t, 1300, .75, { x: 300, pose: "point",
      mod: st => { st.x = lerp(318, 190, pull) + (pull > .85 ? Math.sin(t * 47) * 2.5 : 0); if (t < TF && pull > .5) st.expr = st.expr === "neutral" ? "worried" : st.expr; },
      lean: -.06 * pull, auto: [{ at: TH + .1, pose: miss ? "shrug" : "cheer", expr: miss ? "confused" : "happy", jump: miss ? 0 : 2, emote: miss ? "?" : null }] });
    const [hx, hy] = Pa.hand();
    // slingshot
    ctx.fillStyle = WOOD; rr(ctx, FX - 15, 1110, 30, 190, 10); ctx.fill(); rr(ctx, FX - 60, 1288, 120, 16, 8); ctx.fillStyle = DWOOD; ctx.fill();
    ctx.strokeStyle = WOOD; ctx.lineWidth = 24; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(FX - 48, FY); ctx.lineTo(FX, 1120); ctx.lineTo(FX + 48, FY); ctx.stroke();
    let px, py; if (t < TF){ px = hx; py = hy + 4; } else { const u = t - TF, d = Math.exp(-u * 5); px = FX + (318 - FX) * .0 + Math.cos(u * 20) * 60 * d; py = FY + 18 + Math.sin(u * 20) * 12 * d; }
    ctx.strokeStyle = "#7A2E12"; ctx.lineWidth = 7 - pull * 2; ctx.beginPath(); ctx.moveTo(FX + 48, FY); ctx.lineTo(px, py); ctx.stroke();
    // projectile
    const ammo = (x, y, r, spin) => { ctx.save(); ctx.translate(x, y); ctx.rotate(spin); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); icon(ctx, f.ammo || "star", -r * .55, -r * .55, r * 1.1, "#fff", 2.4); ctx.restore(); };
    const flight = τ => { const q = clamp((τ - TF) / .85, 0, 1), x0 = 318 + 136 * .75 * 0 + (Pa ? 0 : 0); const sx = 190 + 136.5, sy = 1072, ex = miss ? tx + 60 : tx, ey = miss ? ty - 330 : ty, cx = (sx + ex) / 2, cy = miss ? 380 : 470;
      return { x: (1 - q) * (1 - q) * sx + 2 * q * (1 - q) * cx + q * q * ex + (miss && q >= 1 ? (τ - TF - .85) * 600 : 0), y: (1 - q) * (1 - q) * sy + 2 * q * (1 - q) * cy + q * q * ey - (miss && q >= 1 ? (τ - TF - .85) * 300 : 0), q }; };
    if (t < TF) ammo(px, py, 32, 0);
    else if (miss || t < TH){ for (let k = 6; k >= 1; k--){ const p = flight(t - k * .035); if (p.q <= 0) continue; ctx.beginPath(); ctx.arc(p.x, p.y, 30 * (1 - k * .12), 0, TAU); ctx.fillStyle = hexA("#C2691F", .3 * (1 - k / 7)); ctx.fill(); }
      const p = flight(t); if (p.x < 1100) ammo(p.x, p.y, 32, (t - TF) * 12); }
    ctx.strokeStyle = "#7A2E12"; ctx.lineWidth = 7 - pull * 2; ctx.beginPath(); ctx.moveTo(FX - 48, FY); ctx.lineTo(px, py); ctx.stroke();
    ctx.beginPath(); ctx.arc(FX - 48, FY, 9, 0, TAU); ctx.arc(FX + 48, FY, 9, 0, TAU); ctx.fillStyle = DWOOD; ctx.fill();
    if (pull > .85 && t < TF){ ctx.save(); ctx.globalAlpha *= .6; ctx.strokeStyle = lineCol(th); ctx.lineWidth = 4; for (let k = 0; k < 3; k++){ const a = -.5 + k * .5; ctx.beginPath(); ctx.moveTo(px - 50 * Math.cos(a), py - 50 * Math.sin(a)); ctx.lineTo(px - 70 * Math.cos(a), py - 70 * Math.sin(a)); ctx.stroke(); } ctx.restore(); }
    if (hit){ bigWord(ctx, th, 640, 700, hu - .05, f.hitText || "TEPAT!", YEL); }
    if (f.endLabel && hu >= 0) scaled(ctx, 770, 1080, popAt(t, TH + .6, .45), () => tag(ctx, th, f.endLabel, 770, 1080, { size: 34, maxW: 420, lines: 2, bg: miss ? RED : GREEN, fg: "#fff", icon: miss ? "alert" : "check" }));
    personFx(ctx, th, Pa, t);
    ctx.restore();
  }, (s, f, i, add) => { timesOf(s, (f.items || []).slice(0, 3), .12, .16, i).forEach(T => add(T, "pop")); const TF = at(s, f.fireCue, .72, i);
    add(TF + .1, "whoosh"); add(TF + .85, f.result === "miss" ? "pop" : "chime"); if (f.endLabel) add(TF + 1.45, "pop"); actorSfx(s, f.actor, i, add); });
})();
