/* Scene pack set8b: wok, swing, cat, robot, easel, drums, sandcastle, hammock.
   Cartoon-style scenes: continuous idle motion, an acting character (hero(): walk-in via `from`, hops with
   anticipation / squash & stretch via key `hop`, breathing), a living camera (stage(): slow drift, push-in at the
   payoff, shakes on impacts) and particles. Canvas 1080x1920; visuals kept in y ~560-1330, text in x 90-990. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const RED = "#D84315", GREEN = "#3BB273", YEL = "#E8A317", PAPER = "#FFF7EE", SKY = "#7CC4E8", TEAL = "#2F6F73", WOOD = "#A0522D", STEEL = "#8C8476";
  const dark = th => th.key === "B";
  const lineC = (th, a) => dark(th) ? `rgba(250,248,243,${a == null ? .85 : a})` : hexA(INK, a == null ? 1 : a);
  const lerp = (a, b, q) => a + (b - a) * q;
  const ramp = (t, T, d) => clamp((t - T) / (d || .5), 0, 1);
  const popAt = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  const eIn = p => p * p * p;
  const eEl = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (TAU / 3)) + 1;
  const damp = (u, fq, k) => u < 0 ? 0 : Math.sin(u * fq) * Math.exp(-u * (k || 6));
  const DEF_A = { hair: "short", shirt: "#2F6F73", skin: "a" };
  const timesOf = (s, list, base, step, i) => (list || []).map((x, k) => at(s, x.cue, base + k * step, i));

  /* ---------- text helpers (always measured, shrunk or wrapped to fit) ---------- */
  function fitFont(ctx, th, txt, maxW, size, weight, min){ let z = size; font(ctx, weight || 700, z, th.fam); while (z > (min || 16) && ctx.measureText(txt).width > maxW){ z -= 1; font(ctx, weight || 700, z, th.fam); } return z; }
  function wrapL(ctx, txt, maxW){ return wrapRich(ctx, String(txt || ""), "", maxW).map(l => l.map(z => z.w).join(" ")).filter(l => l.length); }
  function fitLines(ctx, th, txt, maxW, size, maxL, weight, min){ let z = size;
    for (;;){ font(ctx, weight || 700, z, th.fam); const L = String(txt || "").split("\n").flatMap(p => wrapL(ctx, p, maxW));
      if ((L.length <= maxL && L.every(l => ctx.measureText(l).width <= maxW)) || z <= (min || 16)) return { z, L: L.slice(0, maxL) }; z -= 1; } }
  function tag(ctx, th, txt, cx, cy, o){ o = o || {}; const size = o.size || 32, maxW = Math.min(o.maxW || 800, 880), pad = size * .72, icS = o.icon ? size * 1.05 : 0, inner = maxW - pad * 2 - (icS ? icS + 10 : 0);
    const r = fitLines(ctx, th, txt, inner, size, o.lines || 1, o.weight || 800, o.min || 18), z = r.z, lh = z * 1.18;
    const tw = Math.max(...r.L.map(l => ctx.measureText(l).width), 10), ic = o.icon ? z * 1.05 : 0, w = tw + pad * 2 + (ic ? ic + 10 : 0), h = z * .85 + lh * r.L.length;
    let x0 = o.align === "right" ? cx - w : o.align === "left" ? cx : cx - w / 2; x0 = clamp(x0, 100, 980 - w);
    rr(ctx, x0, cy - h / 2, w, h, Math.min(h / 2, 30)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 4; ctx.stroke(); }
    if (ic) icon(ctx, o.icon, x0 + pad * .75, cy - ic / 2, ic, o.fg || INK, 2.4);
    font(ctx, o.weight || 800, z, th.fam); ctx.fillStyle = o.fg || INK; ctx.textAlign = "left";
    r.L.forEach((l, k) => ctx.fillText(l, x0 + pad + (ic ? ic + 8 : 0), cy + z * .36 + (k - (r.L.length - 1) / 2) * lh));
    return { x0, w, h };
  }
  // tag that pops in with overshoot + a wobble that settles, then floats gently
  function ptag(ctx, th, txt, x, y, T, t, o){ if (T == null || t < T) return null; const u = t - T, q = eBack(clamp(u / .42, 0, 1)), w = Math.sin(u * 13) * .13 * Math.max(0, 1 - u / .8);
    ctx.save(); ctx.translate(x, y + Math.sin(t * 2.1 + x * .01) * 3); ctx.rotate(w); ctx.scale(q, q); ctx.translate(-x, -y); const r = tag(ctx, th, txt, x, y, o); ctx.restore(); return r; }
  const toneTag = (th, tone, o) => Object.assign({ bg: tone === "bad" ? RED : tone === "good" ? GREEN : "#FFFFFF", fg: tone === "bad" || tone === "good" ? "#fff" : INK, stroke: tone === "bad" || tone === "good" ? null : th.accent }, o || {});
  // a row (or two) of chips at the top of the visual band
  function chipsTop(ctx, th, list, Ts, t, o){ o = o || {}; const n = list.length; if (!n) return; const idx = list.map((x, k) => k), h = Math.ceil(n / 2);
    const rows = n <= (o.perRow || 3) ? [idx] : [idx.slice(0, h), idx.slice(h)];
    rows.forEach((row, ri) => { const y = (o.y || 612) + ri * 76, slot = 880 / row.length;
      row.forEach((k, j) => { const it = list[k]; if (Ts[k] == null || t < Ts[k]) return; const x = 100 + slot * (j + .5);
        let dx = 0; if (it.shakeT != null && t > it.shakeT) dx = damp(t - it.shakeT, 40, 5) * 10;
        ptag(ctx, th, it.label, x + dx, y, Ts[k], t, toneTag(th, it.tone, { size: o.size || 30, maxW: slot - 14, min: 17, icon: it.icon })); }); });
  }
  function scaled(ctx, x, y, k, fn){ if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); }

  /* ---------- fx ---------- */
  function glow(ctx, x, y, r, col, a){ if (a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, clamp(a, 0, 1))); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function puff(ctx, x, y, u, col, n, sz, spread){ if (u < 0 || u > .9) return; const q = eOut(u / .9); n = n || 7;
    for (let k = 0; k < n; k++){ const a = Math.PI + (n > 1 ? k / (n - 1) : .5) * Math.PI; ctx.beginPath();
      ctx.arc(x + Math.cos(a) * (18 + q * (spread || 80)), y + Math.sin(a) * (8 + q * 34) - q * 10, (sz || 15) * (1 - q * .45), 0, TAU); ctx.fillStyle = hexA(col || "#E9DDCF", (1 - q) * .8); ctx.fill(); } }
  const CONF = [YEL, GREEN, "#E8742C", SKY, "#C2691F", "#F4A85C"];
  function confetti(ctx, x, y, u, n, spread, v0){ if (u < 0 || u > 2.3) return;
    for (let k = 0; k < (n || 24); k++){ const a = -Math.PI / 2 + (((k * .618) % 1) - .5) * (spread || 2.6), v = (v0 || 420) + (k * 37 % 5) * 60;
      const px = x + Math.cos(a) * v * u, py = y + Math.sin(a) * v * u + 560 * u * u; ctx.save(); ctx.globalAlpha *= clamp((2.3 - u) / .6, 0, 1);
      ctx.translate(px, py); ctx.rotate(u * (5 + k % 5) + k); ctx.scale(1, Math.cos(u * 9 + k)); ctx.fillStyle = CONF[k % CONF.length]; ctx.fillRect(-8, -5, 16, 10); ctx.restore(); } }
  function sparkles(ctx, x, y, t, n, R, a){ for (let k = 0; k < n; k++){ const an = k * TAU / n + t * .8, rr_ = R * (.7 + .3 * Math.sin(t * 2 + k)), s = 9 + 7 * Math.sin(t * 6 + k * 1.7);
      ctx.save(); ctx.globalAlpha *= (a == null ? 1 : a) * (.55 + .45 * Math.sin(t * 5 + k)); ctx.fillStyle = [YEL, "#FFFFFF", "#F4A85C"][k % 3]; star(ctx, x + Math.cos(an) * rr_, y + Math.sin(an) * rr_ * .7, Math.max(2, s)); ctx.restore(); } }
  function ringFx(ctx, x, y, u, col, R, lw){ if (u < 0 || u > .7) return; const q = eOut(u / .7); ctx.save(); ctx.globalAlpha *= 1 - q; ctx.strokeStyle = col; ctx.lineWidth = (lw || 8) * (1 - q * .6); ctx.beginPath(); ctx.arc(x, y, (R || 30) + q * 110, 0, TAU); ctx.stroke(); ctx.restore(); }
  function boom(ctx, th, x, y, u, txt, col){ if (u < 0 || u > 1.9) return; const q = eBack(clamp(u / .25, 0, 1)), a = clamp((1.9 - u) / .4, 0, 1);
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.07 + damp(u, 30, 5) * .08); ctx.scale(q, q); ctx.globalAlpha *= a;
    ctx.beginPath(); for (let k = 0; k < 24; k++){ const rad = k % 2 ? 74 : 112, an = k * TAU / 24; ctx.lineTo(Math.cos(an) * rad * 1.4, Math.sin(an) * rad * .8); } ctx.closePath();
    ctx.fillStyle = col || YEL; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    const z = fitFont(ctx, th, txt || "!", 220, 48, 900, 20); ctx.fillStyle = col && col !== YEL ? "#fff" : INK; ctx.textAlign = "center"; ctx.fillText(txt || "!", 0, z * .36); ctx.textAlign = "left"; ctx.restore(); }
  function speed(ctx, th, x, y, dir, a, n, len){ if (a <= .02) return; ctx.save(); ctx.strokeStyle = lineC(th, .55 * a); ctx.lineWidth = 5; ctx.lineCap = "round";
    for (let k = 0; k < (n || 3); k++){ const yy = y + (k - 1) * 26, l = (len || 70) * (1 - Math.abs(k - 1) * .3); ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x - dir * l, yy); ctx.stroke(); } ctx.restore(); }
  function noteSym(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 0, 13, 10, -.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(11, -3); ctx.lineTo(11, -46); ctx.quadraticCurveTo(26, -38, 30, -22); ctx.stroke(); ctx.restore(); }
  function heartSym(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 10); ctx.bezierCurveTo(-26, -8, -14, -30, 0, -16); ctx.bezierCurveTo(14, -30, 26, -8, 0, 10); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function checkDisc(ctx, x, y, r, col){ if (r <= 0) return; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || GREEN; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .34); ctx.lineTo(x + r * .45, y - r * .3); ctx.stroke(); }
  function cloud(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, 80, 26, 0, 0, TAU); ctx.ellipse(-34, -16, 40, 28, 0, 0, TAU); ctx.ellipse(28, -22, 46, 32, 0, 0, TAU); ctx.fill(); ctx.restore(); }

  /* ---------- living camera: clip to the visual band, slow drift, push-in at payoffs, shake on impacts ---------- */
  function stage(ctx, t, o){ o = o || {}; ctx.beginPath(); ctx.rect(0, 492, 1080, 868); ctx.clip();
    const nc = window.__noCam; let z = 1 + (nc ? 0 : .012 * Math.sin(t * .8)); (o.push || []).forEach(p => { if (p && p[0] != null) z += (p[1] || .05) * eOut(ramp(t, p[0], 1.3)); });
    let sx = nc ? 0 : Math.sin(t * .55) * 4, sy = nc ? 0 : Math.cos(t * .45) * 2.5;
    (o.shakes || []).forEach(p => { if (!p || p[0] == null) return; const u = t - p[0]; if (u >= 0 && u < .45){ const a = (1 - u / .45) * (p[1] || 10); sx += Math.sin(u * 77) * a; sy += Math.cos(u * 63) * a * .7; } });
    const fx = o.fx || 540, fy = o.fy || 960; ctx.translate(fx + sx, fy + sy); ctx.scale(z, z); ctx.translate(-fx, -fy); }

  /* ---------- actors ---------- */
  const ARM = { point: [1.5, 1.55], rest: [.35, -.95], stand: [.15, .08], wave: [2.7, 2.9], cheer: [2.75, 2.95], thumbs: [.45, 2.75], talk: [.55, -.5], type: [.35, -.95], cross: [.35, -1.95], think: [.3, 3.5], work: [.55, -1.2], shrug: [.9, 2.1] };
  function handAt(x, gy, sc, pose, sit, dir){ const [u, f] = ARM[pose] || ARM.stand, hipY = sit ? -112 : -182, neckY = hipY - 150;
    return [x + (dir || 1) * (44 + Math.sin(u) * 72 + Math.sin(f) * 66) * sc, gy + (neckY + 18 + Math.cos(u) * 72 + Math.cos(f) * 66) * sc]; }
  // hero: actor + walk-in (a.from), hops (key hop:n, hopH), breathing, squash & stretch, ground shadow
  function hero(ctx, th, s, a, t, gy, sc, mod, o){
    if (!a) return null; o = o || {};
    const A = Object.assign({ x: 200 }, DEF_A, a), keys = (A.keys || []).slice();
    if (A.from != null){ keys.unshift({ at: A.enterAt != null ? A.enterAt : .05, x: A.x }); A.x = A.from; }
    A.keys = keys;
    const st = actorState(A, s, t); if (mod) mod(st);
    let lift = 0, sq = 0;
    const hops = keyTimes(s, keys).filter(k => k.hop).map(k => [k.T, k.hop === true ? 1 : k.hop, k.hopH || 80]).concat((o.hops || []).map(h => Array.isArray(h) ? h : [h, 1, 80]));
    hops.forEach(([T0, n, H]) => { for (let j = 0; j < n; j++){ const u = t - T0 - j * .6; if (u < 0 || u > .6) continue;
      if (u < .1) sq = -.1 * Math.sin(u / .1 * Math.PI / 2);
      else if (u < .48){ const q = (u - .1) / .38; lift = Math.sin(q * Math.PI) * H; sq = .08 * Math.sin(q * Math.PI); }
      else sq = -.1 * Math.sin((u - .48) / .12 * Math.PI); } });
    if (o.lift) lift += o.lift;
    const br = .013 * Math.sin(t * 2.3 + (A.x || 0) * .013), syv = 1 + sq + br, sxv = 1 - sq * .6 - br * .5;
    if (!st.sit && o.shadow !== false && st.show !== false){ ctx.save(); ctx.globalAlpha *= .16 * clamp(1 - lift / 260, .3, 1); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(st.x, gy + 3, 72 * sc * clamp(1 - lift / 300, .5, 1), 12 * sc, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.save(); if (o.mirror){ ctx.translate(st.x, 0); ctx.scale(-1, 1); ctx.translate(-st.x, 0); }
    ctx.translate(st.x, gy - lift); ctx.scale(sxv, syv); ctx.translate(-st.x, -gy);
    const r = drawActor(ctx, th, A, st, t, gy, sc); ctx.restore();
    const R = r ? { headX: o.mirror ? 2 * st.x - r.headX : r.headX, headTop: gy - lift - (gy - r.headTop) * syv } : null;
    return { a: A, st, r: R, gy, sc, lift, mirror: !!o.mirror };
  }
  function personFx(ctx, th, P, t){ if (!P || !P.r) return; const { a, st, r } = P;
    if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (a.emoteDx || 0), r.headTop - 20, t - st.emoteT, t);
    if (st.say) bubbleAt(ctx, th, st.say, r.headX + (a.bubbleDx || 0), r.headTop - (st.emote ? 90 : 10), st.chat, t - st.sayT); }
  function actorSfx(s, a, i, add){ if (!a) return; keyTimes(s, a.keys, i).forEach(k => {
    if (k.say != null || ["?", "!", "check", "heart", "sparkle"].includes(k.emote)) add(k.T, k.emote === "check" ? "chime" : "pop"); else if (k.hop) add(k.T + .1, "whoosh"); if (k.emote === "ring") add(k.T, "ping"); }); }
  const hasKey = (a, field) => !!(a && (a.keys || []).some(k => k[field] != null));
  // default acting when the script gives no explicit pose/expr: before T* neutral, after it happy etc.
  function autoAct(a, st, pose, expr){ if (pose && !hasKey(a, "pose")) st.pose = pose; if (expr && !hasKey(a, "expr")) st.expr = expr; }
  function chefHat(ctx, P, t){ if (!P || !P.r) return; const x = P.r.headX, y = P.r.headTop + 26 * P.sc, s = P.sc; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2.2) * .04); ctx.scale(s, s);
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 4; rr(ctx, -46, -40, 92, 34, 8); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-30, -58, 28, 0, TAU); ctx.arc(0, -72, 34, 0, TAU); ctx.arc(30, -58, 28, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-30, -58, 28, Math.PI * .7, Math.PI * 1.75); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -72, 34, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.beginPath(); ctx.arc(30, -58, 28, Math.PI * 1.25, Math.PI * .3); ctx.stroke(); ctx.restore(); }
  function beret(ctx, P, t, col){ if (!P || !P.r) return; const x = P.r.headX, y = P.r.headTop + 30 * P.sc, s = P.sc; ctx.save(); ctx.translate(x, y); ctx.rotate(-.18 + Math.sin(t * 2) * .03); ctx.scale(s, s);
    ctx.beginPath(); ctx.ellipse(6, -10, 62, 24, 0, 0, TAU); ctx.fillStyle = col || "#B23A2E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.moveTo(6, -34); ctx.lineTo(10, -48); ctx.stroke(); ctx.restore(); }

  /* =====================================================================
     wok: a cook tosses a wok over a live flame. Each item is an ingredient that hops out of a bowl into the wok
     (chip pops at the top); flipCue = big toss in the air with a flame flare; result = food flies onto a plate
     (steam, sparkle, result tag); fail = {cue, kind:"spill"|"burn", label} overflow / burnt.
       f: items:[{label, cue, icon, color}], flipCue, result:{cue, label, icon}, fail:{cue, kind, label}, actor (cook, left)
     ===================================================================== */
  const FOOD = ["#E8742C", "#3BB273", "#D84315", "#F2C94C", "#8E4E2E", "#7CC4E8"];
  function foodBit(ctx, x, y, r, col, rot, ic, burnt){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath(); ctx.moveTo(-r, 0); ctx.bezierCurveTo(-r, -r * .95, r * .25, -r * 1.15, r, -r * .2); ctx.bezierCurveTo(r * 1.15, r * .65, -r * .3, r * 1.05, -r, 0); ctx.closePath();
    ctx.fillStyle = burnt ? "#3B2A20" : col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.38)"; ctx.beginPath(); ctx.ellipse(-r * .35, -r * .4, r * .3, r * .13, -.5, 0, TAU); ctx.fill();
    if (ic && !burnt){ ctx.rotate(-rot); icon(ctx, ic, -r * .42, -r * .48, r * .86, "#fff", 2.6); } ctx.restore(); }
  function wokTimes(s, f, i){ const T = timesOf(s, f.items, .12, .16, i);
    return { T, TF: f.flipCue ? at(s, f.flipCue, .7, i) : null, TR: f.result ? at(s, f.result.cue, .85, i) : null, TX: f.fail ? at(s, f.fail.cue, .8, i) : null }; }
  TT.layout("wok", "Wajan masak", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.items || [], n = its.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { T, TF, TR, TX } = wokTimes(s, f), FL = f.fail || null, burn = FL && FL.kind === "burn", FLY = .62, land = T.map(x => x + FLY);
    const WX = 600, WY = 1062, SRC = [905, 1150];
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t, { fx: WX, fy: 1010, push: [[TR, .05], [TX, .05], [TF, .025]], shakes: land.map(x => [x, 5]).concat([[TF != null ? TF + .32 : null, 9], [TX, 15]]) });
    chipsTop(ctx, th, its.map(it => ({ label: it.label, icon: it.icon, tone: FL && t >= TX ? "bad" : null, shakeT: FL ? TX : null })), T, t);
    // counter on the right with the ingredient bowl (or the plate once served)
    ctx.fillStyle = "#C79A6B"; rr(ctx, 822, 1188, 176, 20, 8); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "#8E6A48"; ctx.fillRect(842, 1208, 14, 100); ctx.fillRect(964, 1208, 14, 100);
    const served = TR != null && t >= TR, plateIn = served ? eOut(ramp(t, TR, .4)) : 0;
    if (!served || plateIn < 1){ const bx = SRC[0] + plateIn * 200, hopB = T.reduce((m, T0) => Math.max(m, damp(t - T0, 25, 8)), 0) * 14;
      ctx.save(); ctx.translate(bx, 1188 - hopB); ctx.beginPath(); ctx.moveTo(-62, -48); ctx.quadraticCurveTo(-58, 0, 0, 0); ctx.quadraticCurveTo(58, 0, 62, -48); ctx.closePath(); ctx.fillStyle = TEAL; ctx.fill(); ctx.stroke();
      its.forEach((it, k) => { if (t < T[k]) foodBit(ctx, -34 + (k % 3) * 32, -52 - Math.floor(k / 3) * 14, 17, it.color || FOOD[k % FOOD.length], k, null, false); }); ctx.restore(); }
    // stove
    ctx.fillStyle = dark(th) ? "#6B5A48" : "#544E42"; rr(ctx, 410, 1186, 380, 132, 18); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = INK; rr(ctx, 392, 1172, 416, 22, 10); ctx.fill();
    [470, 600, 730].forEach((x, k) => { ctx.beginPath(); ctx.arc(x, 1262, 17, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); const a = -1.2 + k * .5 + (burn && t > TX ? 1.4 : 0); ctx.beginPath(); ctx.moveTo(x, 1262); ctx.lineTo(x + Math.cos(a) * 13, 1262 + Math.sin(a) * 13); ctx.stroke(); });
    // flames (flare on the toss, roar when burning)
    const flare = (TF != null ? clamp(1 - Math.abs(t - TF - .42) / .45, 0, 1) : 0) + (burn && t > TX ? .9 * ramp(t, TX, .4) : 0);
    if (flare > 0) glow(ctx, WX, 1150, 260 + flare * 120, "#F4A85C", .55 * flare);
    for (let k = 0; k < 9; k++){ const fx = WX - 150 + k * 37.5, edge = k === 0 || k === 8 ? .65 : 1, fl = (34 + 20 * Math.sin(t * 13 + k * 1.7) + 10 * Math.sin(t * 21 + k)) * edge * (1 + flare * 2.4);
      ctx.beginPath(); ctx.moveTo(fx - 16, 1174); ctx.quadraticCurveTo(fx - 18, 1174 - fl * .5, fx + Math.sin(t * 9 + k) * 6, 1174 - fl); ctx.quadraticCurveTo(fx + 18, 1174 - fl * .5, fx + 16, 1174); ctx.closePath(); ctx.fillStyle = burn && t > TX ? RED : "#E8742C"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(fx - 8, 1174); ctx.quadraticCurveTo(fx - 9, 1174 - fl * .3, fx, 1174 - fl * .55); ctx.quadraticCurveTo(fx + 9, 1174 - fl * .3, fx + 8, 1174); ctx.closePath(); ctx.fillStyle = YEL; ctx.fill(); }
    // wok motion: idle jiggle, little hops, landing dips, the big toss, the spill tilt
    const tossing = n && t > land[0] && !(served) && !(FL && t > TX);
    const idleHop = tossing ? Math.pow(Math.max(0, Math.sin((t - land[0]) * TAU / 1.25)), 6) : 0;
    let wy = -idleHop * 10, wr = -idleHop * .06, wx = Math.sin(t * 8) * 2.5;
    land.forEach(L => { wy += damp(t - L, 22, 7) * 12; });
    const fu = TF != null ? t - TF : -1;
    if (fu >= 0 && fu < 1.2){ if (fu < .18) wy += 16 * Math.sin(fu / .18 * Math.PI / 2); else if (fu < .34){ const q = (fu - .18) / .16; wy += lerp(16, -50, q); wr += -.24 * q; } else { const q = eOut((fu - .34) / .86); wy += -50 * (1 - q); wr += -.24 * (1 - q); } }
    if (FL && !burn && t > TX){ const u = t - TX; wr += Math.sin(u * 14) * .12 * Math.exp(-u * 1.5) + .1 * ramp(t, TX, .3); wx += Math.sin(u * 30) * 6 * Math.exp(-u * 2); }
    // food positions
    const SL = [[-95, -10], [55, -18], [-20, -30], [118, -8], [-138, 0], [10, -6]];
    const flipH = u => (u > .3 && u < 1.25) ? Math.sin((u - .3) / .95 * Math.PI) * 330 : 0;
    const foodAt = k => { const sl = SL[k % SL.length], c = Math.cos(wr), sn = Math.sin(wr), lx = sl[0] * c - sl[1] * sn, ly = sl[0] * sn + sl[1] * c;
      const hop = idleHop * (24 + (k % 3) * 8) + (fu >= 0 ? flipH(fu - k * .03) * (1 + (k % 3) * .1) : 0);
      return [WX + wx + lx + (fu > .3 && fu < 1.25 ? Math.sin((fu - .3) * 3 + k) * 30 : 0), WY + wy + ly - hop + Math.sin(t * 9 + k) * 2.5, (fu > .3 && fu < 1.25 ? (fu - .3) * (6 + k) : Math.sin(t * 3 + k) * .25) + k]; };
    // wok body (back half, inside, food, front lip)
    ctx.save(); ctx.translate(WX + wx, WY + wy); ctx.rotate(wr);
    ctx.beginPath(); ctx.ellipse(0, 0, 188, 100, 0, 0, Math.PI); ctx.closePath(); const wg = ctx.createLinearGradient(0, 0, 0, 100); wg.addColorStop(0, "#5A5550"); wg.addColorStop(1, "#2A2522"); ctx.fillStyle = wg; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, 188, 26, 0, 0, TAU); ctx.fillStyle = "#3E3935"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 2, 172, 20, 0, 0, TAU); ctx.fillStyle = burn && t > TX ? "#2A1A12" : "#6A625B"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, 26, 150, 55, 0, .3, 1.2); ctx.stroke();
    ctx.fillStyle = INK; rr(ctx, 180, -12, 46, 18, 8); ctx.fill();
    ctx.restore();
    // ingredients: in flight, in the wok, onto the plate, or spilled
    its.forEach((it, k) => { if (t < T[k]) return; const col = it.color || FOOD[k % FOOD.length], u = t - T[k], burnt = burn && t > TX + .4 + k * .15;
      const [ix, iy, ir] = foodAt(k);
      if (u < FLY){ const q = u / FLY, x = lerp(SRC[0], ix, q), y = lerp(SRC[1] - 40, iy, q) - Math.sin(q * Math.PI) * 400;
        for (let j = 1; j < 5; j++){ const qq = Math.max(0, q - j * .05); ctx.beginPath(); ctx.arc(lerp(SRC[0], ix, qq), lerp(SRC[1] - 40, iy, qq) - Math.sin(qq * Math.PI) * 400, 18 - j * 3, 0, TAU); ctx.fillStyle = hexA(col, .3 - j * .05); ctx.fill(); }
        foodBit(ctx, x, y, 34 * (1 + .12 * Math.sin(q * Math.PI)), col, q * 7, it.icon, false); return; }
      if (served){ const q = ramp(t, TR + .3 + k * .09, .55); if (q >= 1) return; const px = 880 + (k % 3 - 1) * 24, py = 1150; foodBit(ctx, lerp(ix, px, q), lerp(iy, py, q) - Math.sin(q * Math.PI) * 220, 34 * (1 - q * .4), col, ir + q * 6, it.icon, false); return; }
      if (FL && !burn && t > TX + .15 + k * .08){ const v = t - TX - .15 - k * .08, dir = k % 2 ? 1 : -1, x = ix + dir * Math.min(v, 1.1) * (230 + k * 30), fall = Math.min(v, 1.1);
        let y = iy - 240 * fall + 520 * fall * fall; const floor = 1300 - (dir > 0 ? 0 : 0); let rot = ir + v * 8;
        if (y > floor){ y = floor - Math.abs(Math.sin((v - 1.1) * 9)) * 30 * Math.exp(-(v - 1.1) * 3); rot = ir + 9; }
        foodBit(ctx, Math.min(Math.max(x, 120), 960), Math.min(y, floor), 30, col, rot, it.icon, false); return; }
      foodBit(ctx, ix, iy, 32, col, ir, it.icon, burnt);
      const lu = t - land[k]; if (lu < .5){ for (let j = 0; j < 7; j++){ const a = -Math.PI * (j + .5) / 7, d = eOut(lu / .5) * 70; ctx.beginPath(); ctx.arc(ix + Math.cos(a) * d, iy + Math.sin(a) * d * .8 + lu * lu * 200, 6 * (1 - lu * 2), 0, TAU); ctx.fillStyle = "#F2C94C"; ctx.fill(); } }
    });
    // front lip over the food
    ctx.save(); ctx.translate(WX + wx, WY + wy); ctx.rotate(wr); ctx.beginPath(); ctx.ellipse(0, 0, 188, 26, 0, 0, Math.PI); ctx.strokeStyle = "#2A2522"; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    // steam / smoke
    const smoky = burn && t > TX;
    for (let k = 0; k < (smoky ? 9 : 6); k++){ const q = ((t * (smoky ? .55 : .42)) + k / (smoky ? 9 : 6)) % 1, x = WX - 120 + (k * 53) % 260 + Math.sin(q * 6 + k) * 22, y = WY - 30 - q * 330, r = 14 + q * (smoky ? 60 : 38);
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = smoky ? `rgba(70,60,55,${((1 - q) * .7).toFixed(3)})` : `rgba(255,255,255,${((1 - q) * .55).toFixed(3)})`; ctx.fill(); if (!smoky && !dark(th)){ ctx.strokeStyle = `rgba(59,36,24,${((1 - q) * .14).toFixed(3)})`; ctx.lineWidth = 2; ctx.stroke(); } }
    // plate with the served dish
    if (served){ const px = 1100 - 220 * plateIn, ar = ramp(t, TR + .5, .7);
      glow(ctx, px, 1150, 190, YEL, .45 * ar * (.75 + .25 * Math.sin(t * 5)));
      ctx.beginPath(); ctx.ellipse(px, 1184, 88, 20, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      if (ar > 0){ ctx.save(); ctx.translate(px, 1176); ctx.scale(1, eBack(ar)); ctx.beginPath(); ctx.ellipse(0, 0, 66, 46, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = "#E8955A"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
        its.forEach((it, k) => { ctx.beginPath(); ctx.arc(-40 + k * 26, -14 - (k % 2) * 16, 11, 0, TAU); ctx.fillStyle = it.color || FOOD[k % FOOD.length]; ctx.fill(); }); ctx.restore();
        for (let k = 0; k < 3; k++){ const q = ((t * .6) + k / 3) % 1; ctx.strokeStyle = lineC(th, .5 * (1 - q)); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(px - 30 + k * 30, 1110 - q * 80); ctx.bezierCurveTo(px - 45 + k * 30, 1090 - q * 80, px - 15 + k * 30, 1070 - q * 80, px - 30 + k * 30, 1050 - q * 80); ctx.stroke(); }
        sparkles(ctx, px, 1130, t, 6, 120, ar); }
      if (f.result && f.result.label) ptag(ctx, th, f.result.label, 820, 1010, TR + .45, t, { size: 34, maxW: 400, bg: GREEN, fg: "#fff", icon: f.result.icon || "check" });
      confetti(ctx, px, 1120, t - TR - .45, 20, 2.2, 380); }
    // the cook, holding the wok handle
    const A = Object.assign({ x: 210 }, f.actor || {}), GY = 1318, SC = .92;
    const P = hero(ctx, th, s, A, t, GY, SC, st => { autoAct(f.actor, st, "point", served && t > TR + .5 ? "happy" : (FL && t > TX ? "shock" : (fu > 0 && fu < 1.3 ? "happy" : null))); }, { hops: served ? [[TR + .6, 2, 60]] : FL ? [[TX, 1, 50]] : [] });
    const hd = handAt(P.st.x, GY - P.lift, SC, P.st.pose, P.st.sit, 1), c = Math.cos(wr), sn = Math.sin(wr), rimL = [WX + wx - 186 * c, WY + wy - 186 * sn];
    ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(rimL[0], rimL[1]); ctx.lineTo(hd[0] - 6, hd[1] + 4); ctx.stroke(); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(rimL[0] - 30 * c, rimL[1] - 30 * sn); ctx.lineTo(hd[0] - 6, hd[1] + 4); ctx.stroke();
    ctx.beginPath(); ctx.arc(hd[0], hd[1], 15 * SC, 0, TAU); ctx.fillStyle = "#D99A6E"; ctx.fill();
    if (f.hat !== false) chefHat(ctx, P, t);
    if (FL && t > TX) boom(ctx, th, WX, 860, t - TX, FL.label || (burn ? "Gosong!" : "Tumpah!"), RED);
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { const { T, TF, TR, TX } = wokTimes(s, f, i); T.forEach(x => { add(x, "whoosh"); add(x + .62, "pop"); }); if (TF != null) add(TF + .3, "whoosh"); if (TR != null){ add(TR + .3, "whoosh"); add(TR + .45, "chime"); } if (TX != null) add(TX, "pop"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     swing: a person on a swing; every cue is a push that makes it swing higher (chip at the top, numbered flag
     on the height arc); peak = big cheer at the top with confetti + tag; stopCue lets it die down.
       f: items:[{label, cue, icon}], peak:{cue, label, icon}, stopCue, stopLabel, actor (rider)
     ===================================================================== */
  function swingTimes(s, f, i){ return { T: timesOf(s, f.items, .15, .2, i), TP: f.peak ? at(s, f.peak.cue, .85, i) : null, TS: f.stopCue ? at(s, f.stopCue, .85, i) : null }; }
  TT.layout("swing", "Ayunan", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.items || [], n = its.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { T, TP, TS } = swingTimes(s, f), PX = 590, PY = 762, L = 372, A0 = .13, A1 = f.max || .8;
    const ampAt = τ => { let a = A0; T.forEach(T0 => a += (A1 - A0) / Math.max(1, n) * eOut(ramp(τ, T0, 1.3))); if (TP != null) a += .07 * eOut(ramp(τ, TP, 1)); if (TS != null) a = lerp(a, .03, eOut(ramp(τ, TS, 2.4))); return a; };
    const om = TAU / 2.1, amp = ampAt(t), th0 = amp * Math.sin(om * t), dth = amp * om * Math.cos(om * t);
    const seat = a => [PX + Math.sin(a) * L, PY + Math.cos(a) * L];
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t, { fx: PX, fy: 990, push: [[TP, .05]], shakes: [] });
    // sky things: drifting clouds and a bird
    for (let k = 0; k < 2; k++){ const x = ((t * (16 + k * 9) + k * 520) % 1300) - 150; cloud(ctx, x, 700 + k * 130, .8 + k * .2, dark(th) ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.85)"); }
    { const bx = ((t * 70) % 1400) - 200, by = 690 + Math.sin(t * 1.3) * 26, w = Math.sin(t * 11) * 14; ctx.strokeStyle = lineC(th, .7); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 20, by - w); ctx.quadraticCurveTo(bx - 8, by - 6, bx, by); ctx.quadraticCurveTo(bx + 8, by - 6, bx + 20, by - w); ctx.stroke(); }
    chipsTop(ctx, th, its, T, t, { y: 612 });
    // ground: sand patch + grass
    ctx.beginPath(); ctx.ellipse(PX, 1312, 360, 26, 0, 0, TAU); ctx.fillStyle = dark(th) ? "rgba(233,201,168,.35)" : "#E9C9A8"; ctx.fill();
    for (let k = 0; k < 26; k++){ const gx = 110 + k * 34, sway = Math.sin(t * 2.4 + k * .7) * 6; ctx.strokeStyle = k % 2 ? "#6FA55A" : "#4E8A43"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(gx, 1326); ctx.quadraticCurveTo(gx + sway * .4, 1310, gx + sway, 1294 - (k % 3) * 6); ctx.stroke(); }
    // frame (A-legs + top bar)
    const leg = (x0, y0, x1, y1) => { ctx.lineCap = "round"; ctx.strokeStyle = INK; ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = WOOD; ctx.lineWidth = 16; ctx.stroke(); };
    leg(300, 752, 225, 1318); leg(300, 752, 380, 1318); leg(880, 752, 800, 1318); leg(880, 752, 955, 1318); leg(282, 752, 898, 752);
    // height arc + flags for every push reached
    ctx.save(); ctx.setLineDash([10, 14]); ctx.strokeStyle = lineC(th, .28); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(PX, PY, L + 70, Math.PI / 2 - amp, Math.PI / 2 + amp); ctx.stroke(); ctx.restore();
    its.forEach((it, k) => { const q = popAt(t, T[k] + .9, .45); if (!q) return; const a = A0 + (A1 - A0) * (k + 1) / n, [x, y] = [PX + Math.sin(a) * (L + 70), PY + Math.cos(a) * (L + 70)];
      scaled(ctx, x, y, q, () => { ctx.beginPath(); ctx.arc(x, y, 24, 0, TAU); ctx.fillStyle = CONF[k % 4]; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); font(ctx, 900, 26, th.fam); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(String(k + 1), x, y + 9); ctx.textAlign = "left"; }); });
    // push puffs on the ground
    T.forEach(T0 => puff(ctx, seat(th0)[0], 1300, t - T0, "#E9C9A8", 7, 14));
    // ghost trail
    for (let j = 3; j >= 1; j--){ const a = ampAt(t - j * .05) * Math.sin(om * (t - j * .05)), [gx, gy] = seat(a); ctx.save(); ctx.globalAlpha *= .05 * (4 - j) * clamp(Math.abs(dth) / 1.6, 0, 1); ctx.fillStyle = lineC(th, 1); ctx.beginPath(); ctx.ellipse(gx, gy - 120, 60, 130, -a, 0, TAU); ctx.fill(); ctx.restore(); }
    // rider in the swinging frame
    const A = Object.assign({}, f.actor || {}, { x: 0 }), SC = .78, peakNow = TP != null && t >= TP;
    ctx.save(); ctx.translate(PX, PY); ctx.rotate(-th0);
    ctx.strokeStyle = "#7A5A44"; ctx.lineWidth = 6; [-66, 66].forEach(x => { ctx.beginPath(); ctx.moveTo(x * .6, 0); ctx.lineTo(x, L); ctx.stroke(); });
    const P = hero(ctx, th, s, A, t, L - 4 + 112 * SC, SC, st => { st.x = 0; st.sit = true; st.walking = false; autoAct(f.actor, st, "cheer", peakNow ? "happy" : amp > .35 ? "happy" : "smile"); if (TS != null && t > TS && !hasKey(f.actor, "expr")) st.expr = "tired"; }, { shadow: false });
    ctx.fillStyle = WOOD; rr(ctx, -88, L - 8, 176, 18, 8); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.restore();
    // speed lines behind the rider
    const [sx, sy] = seat(th0); speed(ctx, th, sx - Math.sign(dth) * 110, sy - 150, Math.sign(dth), clamp((Math.abs(dth) - .6) / 1.2, 0, 1), 3, 80);
    // peak: confetti burst + glow on every high point
    if (peakNow){ confetti(ctx, sx, sy - 260, t - TP, 26, 2.6, 440); const hi = clamp((Math.abs(Math.sin(om * t)) - .85) / .15, 0, 1); sparkles(ctx, sx, sy - 160, t, 6, 150, hi);
      if (f.peak.label) ptag(ctx, th, f.peak.label, PX, 1262, TP + .3, t, { size: 36, maxW: 560, bg: GREEN, fg: "#fff", icon: f.peak.icon || "star" }); }
    if (TS != null && f.stopLabel) ptag(ctx, th, f.stopLabel, PX, 1262, TS + .5, t, { size: 34, maxW: 560, bg: RED, fg: "#fff", icon: "alert" });
    // emote / bubble in world space (head position rotated with the swing)
    if (P && P.r){ const hx = P.r.headX, hy = P.r.headTop, c = Math.cos(-th0), sn = Math.sin(-th0); P.r = { headX: PX + hx * c - hy * sn, headTop: PY + hx * sn + hy * c }; personFx(ctx, th, P, t); }
    ctx.restore();
  }, (s, f, i, add) => { const { T, TP, TS } = swingTimes(s, f, i); T.forEach(x => add(x, "whoosh")); T.forEach(x => add(x + .9, "pop")); if (TP != null) add(TP, "chime"); if (TS != null) add(TS + .5, "pop"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     cat: a pet cat reacts to the story next to its owner. place "sofa" (owner on a sofa, window behind) or
     "desk" (owner at a desk with laptop; optional cork board with file cards = props).
     beats:[{cue, act, say, to, then}] act: sit | sleep | wake | meow | jump | startle | purr | sulk | watch | knock
       (jump moves between home and alt spot; meow shows a bubble "Meong!" or say)
       f: place, beats, cat0 (start act), tags:[{label, cue, tone, icon}] (chips on top),
          props:[{label, icon, cue, okCue, badCue}] (desk board cards), pushCue, actor (owner)
     ===================================================================== */
  const CAT = { body: "#E8955A", dark: "#B8652F", belly: "#FBE3C8", pink: "#F2A0A0" };
  function catHead(ctx, r, o, t){
    ctx.save(); ctx.rotate(o.tilt || 0); ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.lineJoin = "round";
    [-1, 1].forEach(d => { ctx.beginPath();
      if (o.ears === "flat"){ ctx.moveTo(d * r * .3, -r * .75); ctx.lineTo(d * r * 1.25, -r * .5); ctx.lineTo(d * r * .8, -r * .12); }
      else { const tw = d > 0 ? Math.max(0, Math.sin(t * 7)) * Math.max(0, Math.sin(t * .9)) * 10 : 0; ctx.moveTo(d * r * .18, -r * .78); ctx.lineTo(d * r * .78 + tw * .3, -r * 1.38 + tw); ctx.lineTo(d * r * .98, -r * .38); }
      ctx.closePath(); ctx.fillStyle = CAT.body; ctx.fill(); ctx.stroke();
      if (o.ears !== "flat"){ ctx.beginPath(); ctx.moveTo(d * r * .36, -r * .76); ctx.lineTo(d * r * .76, -r * 1.16); ctx.lineTo(d * r * .86, -r * .55); ctx.closePath(); ctx.fillStyle = CAT.pink; ctx.fill(); } });
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * .92, 0, 0, TAU); ctx.fillStyle = CAT.body; ctx.fill(); ctx.stroke();
    ctx.strokeStyle = CAT.dark; ctx.lineWidth = 6; ctx.lineCap = "round"; [-.28, 0, .28].forEach(x => { ctx.beginPath(); ctx.moveTo(x * r, -r * .88); ctx.lineTo(x * r * .8, -r * .55); ctx.stroke(); });
    ctx.beginPath(); ctx.ellipse(0, r * .38, r * .5, r * .32, 0, 0, TAU); ctx.fillStyle = CAT.belly; ctx.fill();
    ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 4.5;
    const blink = ((t * .7) % 3.1) < .13, ey = o.eyes === "open" && blink ? "closed" : o.eyes;
    [-1, 1].forEach(d => { const ex = d * r * .42, eyy = -r * .06;
      if (ey === "closed"){ ctx.beginPath(); ctx.arc(ex, eyy - 4, r * .17, .2, Math.PI - .2); ctx.stroke(); }
      else if (ey === "happy"){ ctx.beginPath(); ctx.arc(ex, eyy + 6, r * .17, Math.PI + .25, -.25); ctx.stroke(); }
      else if (ey === "half"){ ctx.beginPath(); ctx.ellipse(ex, eyy + 3, r * .14, r * .09, 0, 0, Math.PI); ctx.fill(); ctx.beginPath(); ctx.moveTo(ex - r * .18, eyy); ctx.lineTo(ex + r * .18, eyy); ctx.stroke(); }
      else if (ey === "wide"){ ctx.beginPath(); ctx.arc(ex, eyy, r * .24, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(ex + d * 2, eyy, r * .09, 0, TAU); ctx.fillStyle = INK; ctx.fill(); }
      else { ctx.beginPath(); ctx.ellipse(ex + (o.look || 0) * 3, eyy, r * .13, r * .19, 0, 0, TAU); ctx.fillStyle = INK; ctx.fill(); ctx.beginPath(); ctx.arc(ex + (o.look || 0) * 3 - 3, eyy - 6, r * .05, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); } });
    ctx.beginPath(); ctx.moveTo(-r * .1, r * .2); ctx.lineTo(r * .1, r * .2); ctx.lineTo(0, r * .32); ctx.closePath(); ctx.fillStyle = CAT.pink; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.lineWidth = 4;
    if (o.mouth === "open" || o.mouth === "yawn"){ const h = (o.mouth === "yawn" ? r * .34 : r * .2) * (o.mo == null ? 1 : o.mo); ctx.beginPath(); ctx.ellipse(0, r * .5, r * (o.mouth === "yawn" ? .24 : .17), Math.max(3, h), 0, 0, TAU); ctx.fillStyle = "#7A2E2E"; ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(-r * .11, r * .34, r * .11, .1, Math.PI - .3); ctx.stroke(); ctx.beginPath(); ctx.arc(r * .11, r * .34, r * .11, .3, Math.PI - .1); ctx.stroke(); }
    ctx.lineWidth = 2.5; ctx.strokeStyle = hexA(INK, .7); [-1, 1].forEach(d => [-.1, .06, .2].forEach(a => { ctx.beginPath(); ctx.moveTo(d * r * .42, r * .32); ctx.lineTo(d * r * 1.2, r * (.32 + a * 1.6)); ctx.stroke(); }));
    ctx.restore(); }
  // local frame: facing right, ground at y = 0; returns head position (local) for fx
  function catDraw(ctx, x, y, sc, dir, m, u, t, sq){
    ctx.save(); ctx.translate(x, y); ctx.scale(sc * dir * (1 - (sq || 0) * .6), sc * (1 + (sq || 0)));
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = INK; ctx.lineWidth = 4.5;
    const sw = Math.sin(t * (m === "watch" ? 5.5 : 3)), br = Math.sin(t * 2.6) * (m === "sleep" ? .05 : .025);
    const tail = (p, w) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]); ctx.strokeStyle = INK; ctx.lineWidth = w + 9; ctx.stroke(); ctx.strokeStyle = CAT.body; ctx.lineWidth = w; ctx.stroke();
      ctx.strokeStyle = CAT.dark; ctx.lineWidth = w * .5; ctx.setLineDash([8, 14]); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = INK; ctx.lineWidth = 4.5; };
    const leg = (x0, y0, x1, y1) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = INK; ctx.lineWidth = 25; ctx.stroke(); ctx.strokeStyle = CAT.body; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(x1 + 4, y1 - 3, 14, 9, 0, 0, TAU); ctx.fillStyle = CAT.belly; ctx.fill(); ctx.stroke(); ctx.lineWidth = 4.5; };
    const body = (cx, cy, rx, ry, rot) => { ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, TAU); ctx.fillStyle = CAT.body; ctx.fill(); ctx.stroke();
      ctx.save(); ctx.clip(); ctx.strokeStyle = CAT.dark; ctx.lineWidth = 10; for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.moveTo(cx + k * rx * .34, cy - ry * 1.05); ctx.quadraticCurveTo(cx + k * rx * .34 + 12, cy - ry * .5, cx + k * rx * .3, cy - ry * .15); ctx.stroke(); } ctx.restore(); ctx.strokeStyle = INK; ctx.lineWidth = 4.5; };
    const head = (hx, hy, r, o) => { ctx.save(); ctx.translate(hx, hy); catHead(ctx, r, o, t); ctx.restore(); return [hx, hy - r * 1.3]; };
    let H;
    if (m === "sleep" || m === "sulk"){
      body(0, -42 * (1 + br), 98, 43 * (1 + br * 1.6));
      tail([-88, -22, -122, 14, -20, 12, 62, -4], 16);
      H = m === "sleep" ? head(72, -50, 42, { eyes: "closed", mouth: "w", tilt: .32 }) : head(82, -40, 40, { eyes: "half", mouth: "w", tilt: .18, ears: "flat" });
      ctx.beginPath(); ctx.ellipse(96, -8, 18, 10, 0, 0, TAU); ctx.fillStyle = CAT.belly; ctx.fill(); ctx.stroke();
    } else if (m === "stretch"){
      tail([-92, -104, -128, -160, -84, -206 + sw * 12, -52, -196], 16);
      leg(-64, -84, -68, -4); leg(-42, -82, -44, -4);
      body(-6, -70, 94, 38, .3);
      leg(52, -46, 120, -4); leg(68, -42, 136, -4);
      const mo = clamp(Math.sin(clamp(u / 1.2, 0, 1) * Math.PI) * 1.3, 0, 1);
      H = head(108, -58, 42, { eyes: "closed", mouth: "yawn", mo, tilt: -.15 });
    } else if (m === "stand"){
      const ph = t * 11;
      tail([-86, -96, -132, -120, -124, -188 + sw * 12, -92, -200], 17);
      leg(-60, -64, -60 + Math.sin(ph) * 8, -4); leg(-36, -64, -36 - Math.sin(ph) * 8, -4);
      body(0, -86, 94, 44);
      leg(46, -64, 52 + Math.sin(ph) * 8, -4); leg(70, -64, 76 - Math.sin(ph) * 8, -4);
      H = head(100, -128, 44, { eyes: "open", mouth: "w" });
    } else if (m === "arch"){
      tail([-84, -104, -110, -150, -100, -230, -86, -262], 26);
      ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 4; for (let k = 0; k < 7; k++){ const a = k / 6; ctx.beginPath(); ctx.moveTo(-96 + Math.sin(a * 3) * 8, -150 - a * 100); ctx.lineTo(-118 + Math.sin(a * 3) * 8, -156 - a * 100); ctx.stroke(); } ctx.restore();
      leg(-62, -104, -66, -4); leg(-40, -104, -42, -4); leg(46, -104, 50, -4); leg(68, -104, 72, -4);
      ctx.beginPath(); ctx.moveTo(-88, -100); ctx.bezierCurveTo(-84, -200, 74, -200, 84, -100); ctx.quadraticCurveTo(0, -80, -88, -100); ctx.closePath(); ctx.fillStyle = CAT.body; ctx.fill(); ctx.stroke();
      ctx.strokeStyle = INK; ctx.lineWidth = 4; for (let k = 0; k < 9; k++){ const a = k / 8, px = lerp(-70, 66, a), py = -100 - Math.sin(a * Math.PI) * 80; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 4, py - 14 - Math.sin(t * 30 + k) * 3); ctx.stroke(); }
      H = head(104, -122, 44, { eyes: "wide", mouth: "open", mo: .8, ears: "flat" });
    } else {
      // sit / meow / purr / watch / knock
      tail([-42, -14, -104, -6, -124, -52 + sw * 10, -98 + sw * 16, -98], 18);
      body(-18, -28, 46, 30);
      body(2, -70 * (1 + br), 56, 70 * (1 + br));
      ctx.beginPath(); ctx.ellipse(26, -74, 22, 40, .1, 0, TAU); ctx.fillStyle = CAT.belly; ctx.fill();
      leg(16, -42, 18, -4);
      if (m === "knock"){ const a = -1.1 + Math.sin(u * 11) * .8; leg(38, -70, 38 + Math.cos(a) * 62, -70 + Math.sin(a) * 62); } else leg(38, -42, 40, -4);
      const meow = m === "meow", hb = meow ? Math.sin(clamp(u / 1.4, 0, 1) * Math.PI) : 0;
      H = head(28, -148 - hb * 10, 46, { eyes: m === "purr" ? "happy" : meow ? "happy" : "open", mouth: meow ? "open" : "w", mo: hb, tilt: meow ? -.3 * hb : m === "watch" ? Math.sin(t * 1.4) * .18 : Math.sin(t * .9) * .06, look: m === "watch" ? 1 : 0 });
    }
    ctx.restore();
    return [x + H[0] * sc * dir, y + H[1] * sc];
  }
  function catPlan(s, f, i){ return (f.beats || []).map((b, k) => Object.assign({}, b, { T: at(s, b.cue, .2 + k * .2, i) })).sort((a, b) => a.T - b.T); }
  function catState(f, beats, t, home, alt){
    let pos = home, from = home, jT = -9, mode = f.cat0 || "sit", mT = -9, say = null, sayT = -9, dir = f.catDir || -1, where = "home";
    for (const b of beats){ if (t < b.T) break;
      if (b.act === "jump"){ from = pos; const tg = b.to || (where === "home" ? "alt" : "home"); pos = tg === "alt" ? alt : home; where = tg; jT = b.T; dir = Math.sign(pos[0] - from[0]) || dir; mode = b.then || "sit"; mT = b.T + .75; }
      else { mode = b.act; mT = b.T; }
      if (b.act === "meow" || b.say){ say = b.say || "Meong!"; sayT = b.T; } if (b.dir) dir = b.dir; }
    const u = t - mT; let m = mode, lift = 0;
    if (m === "wake" || m === "yawn") m = u < 1.7 ? "stretch" : "sit";
    if (m === "meow" && u > 1.5) m = "sit";
    if (m === "knock" && u > 1.5) m = "sit";
    if (m === "startle"){ if (u < 1.6){ m = "arch"; lift = u < .45 ? Math.sin(u / .45 * Math.PI) * 70 : 0; } else m = "sit"; }
    let x = pos[0], y = pos[1], sq = 0, air = false; const ju = t - jT;
    if (ju >= 0 && ju < .78){ if (ju < .15){ x = from[0]; y = from[1]; sq = -.13 * Math.sin(ju / .15 * Math.PI / 2); m = "sit"; }
      else if (ju < .6){ const q = (ju - .15) / .45; x = lerp(from[0], pos[0], q); y = lerp(from[1], pos[1], q) - Math.sin(q * Math.PI) * (150 + Math.abs(from[1] - pos[1]) * .6); air = true; m = "stand"; sq = .1; }
      else { sq = -.15 * Math.sin((ju - .6) / .18 * Math.PI); m = "sit"; } }
    if (!air && u >= 0 && u < .6) sq += damp(u, 20, 6) * .08;
    return { x, y: y - lift, m, u, dir, say: say && t - sayT < 1.8 ? say : null, sayT, air, sq, landT: jT + .6, jT };
  }
  function cardsAt(n){ if (n <= 1) return [[695, 845, 400, 150]]; if (n === 2) return [[552, 845, 270, 150], [838, 845, 270, 150]];
    return [[552, 782, 270, 108], [838, 782, 270, 108], [552, 912, 270, 108], [838, 912, 270, 108]].slice(0, n); }
  TT.layout("cat", "Kucing peliharaan", (ctx, th, s, t) => {
    const f = s.f, M = mv(), desk = f.place === "desk"; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const beats = catPlan(s, f), tags = f.tags || [], TG = timesOf(s, tags, .3, .25), props = f.props || [], TPp = timesOf(s, props, .2, .15);
    const pushT = f.pushCue ? at(s, f.pushCue, .8) : null;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t, { fx: desk ? 700 : 560, fy: 1060, push: [[pushT, .05]], shakes: beats.filter(b => b.act === "startle").map(b => [b.T, 11]).concat(beats.filter(b => b.act === "jump").map(b => [b.T + .6, 5])) });
    chipsTop(ctx, th, tags, TG, t, { y: 612 });
    const home = desk ? [820, 1150] : [815, 1316], alt = desk ? [925, 1316] : [590, 1166];
    const A = Object.assign({ x: desk ? 262 : 330 }, f.actor || {}), SC = desk ? .9 : .95;
    let P;
    if (desk){
      if (props.length){ ctx.fillStyle = "#D9B48A"; rr(ctx, 400, 708, 590, 274, 22); ctx.fill(); ctx.strokeStyle = WOOD; ctx.lineWidth = 10; ctx.stroke();
        ctx.fillStyle = "rgba(142,78,46,.18)"; for (let k = 0; k < 40; k++){ ctx.beginPath(); ctx.arc(420 + (k * 97) % 560, 725 + (k * 53) % 240, 3, 0, TAU); ctx.fill(); }
        const C = cardsAt(props.length);
        props.forEach((p, k) => { const [cx, cy, w, h] = C[k], T0 = TPp[k]; if (t < T0) return; const q = eBack(clamp((t - T0) / .45, 0, 1)), dropY = (1 - clamp((t - T0) / .3, 0, 1)) * -60;
          const okT = p.okCue ? at(s, p.okCue, .6) : null, badT = p.badCue ? at(s, p.badCue, .7) : null, ok = okT != null && t >= okT, bad = badT != null && t >= badT;
          const shk = bad ? damp(t - badT, 40, 4) * 8 + Math.sin(t * 9 + k) * 1.5 : 0, rot = Math.sin(t * 1.6 + k * 2) * .02 + (bad ? .04 : 0);
          ctx.save(); ctx.translate(cx + shk, cy + dropY); ctx.rotate(rot); ctx.scale(q, q);
          if (ok) glow(ctx, 0, 0, w * .75, GREEN, .35 + .1 * Math.sin(t * 5));
          rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = bad ? RED : ok ? GREEN : INK; ctx.lineWidth = bad || ok ? 7 : 4; ctx.stroke();
          ctx.beginPath(); ctx.arc(0, -h / 2 + 4, 9, 0, TAU); ctx.fillStyle = RED; ctx.fill();
          icon(ctx, p.icon || "file", -w / 2 + 16, -20, 40, bad ? RED : ok ? GREEN : th.accent, 2.6);
          const r = fitLines(ctx, th, p.label, w - 84, 28, 2, 800, 16); ctx.fillStyle = INK; r.L.forEach((l, j) => ctx.fillText(l, -w / 2 + 66, r.z * .36 + (j - (r.L.length - 1) / 2) * r.z * 1.15));
          ctx.restore();
          if (ok) checkDisc(ctx, cx + w / 2 - 6, cy - h / 2 + 4, 24 * popAt(t, okT, .35));
          if (bad){ const qq = popAt(t, badT, .35); if (qq){ ctx.beginPath(); ctx.arc(cx + w / 2 - 6, cy - h / 2 + 4, 24 * qq, 0, TAU); ctx.fillStyle = RED; ctx.fill(); font(ctx, 900, 32 * qq, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText("!", cx + w / 2 - 6, cy - h / 2 + 15 * qq); ctx.textAlign = "left"; } }
          if (ok) burst(ctx, cx, cy, t - okT, M, 8); });
      } else { ctx.save(); rr(ctx, 700, 700, 250, 210, 16); ctx.fillStyle = dark(th) ? "#3B4A5A" : "#CFE8F2"; ctx.fill(); ctx.clip(); cloud(ctx, 700 + ((t * 25) % 360) - 40, 780, .6, "rgba(255,255,255,.9)"); ctx.restore(); rr(ctx, 700, 700, 250, 210, 16); ctx.strokeStyle = WOOD; ctx.lineWidth = 10; ctx.stroke(); ctx.beginPath(); ctx.moveTo(825, 700); ctx.lineTo(825, 910); ctx.stroke(); }
      // chair + owner + desk + laptop + mug
      ctx.fillStyle = "#544E42"; rr(ctx, 168, 980, 22, 240, 10); ctx.fill(); rr(ctx, 168, 1196, 190, 22, 10); ctx.fill(); ctx.fillRect(252, 1216, 14, 100);
      P = hero(ctx, th, s, A, t, 1316, SC, st => { st.sit = true; autoAct(f.actor, st, "type", null); });
      ctx.fillStyle = "#C79A6B"; rr(ctx, 372, 1150, 618, 26, 10); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = "#8E6A48"; ctx.fillRect(392, 1176, 18, 142); ctx.fillRect(950, 1176, 18, 142); rr(ctx, 700, 1176, 230, 70, 8); ctx.fill();
      ctx.save(); ctx.translate(470, 1150); ctx.fillStyle = INK; rr(ctx, -84, -12, 168, 12, 5); ctx.fill(); ctx.transform(1, 0, -.12, 1, 0, 0); rr(ctx, -70, -118, 140, 104, 10); ctx.fill(); rr(ctx, -62, -110, 124, 88, 6); ctx.fillStyle = "#9FD3E0"; ctx.fill();
      ctx.fillStyle = "rgba(59,36,24,.35)"; for (let k = 0; k < 4; k++){ const w = 30 + ((k * 37 + Math.floor(t * 4) * 13) % 60); ctx.fillRect(-50, -96 + k * 18, w, 7); } ctx.restore();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 600, 1104, 46, 46, 8); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(650, 1126, 12, -1.2, 1.2); ctx.stroke();
      for (let k = 0; k < 2; k++){ const q = ((t * .5) + k / 2) % 1; ctx.strokeStyle = lineC(th, .4 * (1 - q)); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(614 + k * 16, 1096 - q * 60); ctx.quadraticCurveTo(604 + k * 16, 1080 - q * 60, 614 + k * 16, 1064 - q * 60); ctx.stroke(); }
    } else {
      // window with drifting clouds, curtains swaying
      ctx.save(); rr(ctx, 690, 680, 280, 240, 18); ctx.fillStyle = dark(th) ? "#3B4A5A" : "#CFE8F2"; ctx.fill(); ctx.clip(); ctx.beginPath(); ctx.arc(905, 740, 30, 0, TAU); ctx.fillStyle = YEL; ctx.fill(); cloud(ctx, 680 + ((t * 28) % 380), 800, .7, "rgba(255,255,255,.92)"); cloud(ctx, 640 + ((t * 18 + 200) % 420), 870, .5, "rgba(255,255,255,.8)"); ctx.restore();
      rr(ctx, 690, 680, 280, 240, 18); ctx.strokeStyle = WOOD; ctx.lineWidth = 10; ctx.stroke(); ctx.beginPath(); ctx.moveTo(830, 680); ctx.lineTo(830, 920); ctx.moveTo(690, 800); ctx.lineTo(970, 800); ctx.lineWidth = 6; ctx.stroke();
      [[690, 1], [970, -1]].forEach(([x, d]) => { const sw = Math.sin(t * 1.3 + d) * 8; ctx.beginPath(); ctx.moveTo(x - d * 10, 668); ctx.lineTo(x + d * 58, 668); ctx.quadraticCurveTo(x + d * (40 + sw), 820, x + d * (52 + sw), 950); ctx.lineTo(x - d * 10, 950); ctx.closePath(); ctx.fillStyle = th.accent; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); });
      ctx.beginPath(); ctx.ellipse(560, 1318, 430, 30, 0, 0, TAU); ctx.fillStyle = hexA(th.accent, dark(th) ? .35 : .25); ctx.fill();
      // sofa
      ctx.fillStyle = TEAL; ctx.strokeStyle = INK; ctx.lineWidth = 5; rr(ctx, 118, 990, 504, 210, 44); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#3C8487"; rr(ctx, 118, 1150, 504, 118, 26); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; ctx.fillRect(150, 1268, 16, 48); ctx.fillRect(574, 1268, 16, 48);
      P = hero(ctx, th, s, A, t, 1272, SC, st => { st.sit = true; autoAct(f.actor, st, "holdphone", null); });
      ctx.fillStyle = TEAL; ctx.strokeStyle = INK; ctx.lineWidth = 5; rr(ctx, 92, 1070, 70, 190, 30); ctx.fill(); ctx.stroke(); rr(ctx, 580, 1070, 70, 190, 30); ctx.fill(); ctx.stroke();
    }
    // the cat
    const cs = catState(f, beats, t, home, alt), CS = desk ? .86 : .95;
    if (cs.jT > 0) puff(ctx, cs.x, cs.y + 4, t - cs.landT, "#E9DDCF", 7, 13);
    if (!cs.air){ ctx.save(); ctx.globalAlpha *= .15; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(cs.x, cs.y + 4, 90 * CS, 12, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    const hp = catDraw(ctx, cs.x, cs.y, CS, cs.dir, cs.m, cs.u, t, cs.sq);
    if (cs.m === "sleep") emoteAt(ctx, th, "zzz", hp[0] + 10, hp[1] - 10, 1, t);
    if (cs.m === "purr") for (let k = 0; k < 3; k++){ const q = ((t * .7) + k / 3) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(q * Math.PI); heartSym(ctx, hp[0] + Math.sin(q * 6 + k) * 30 - 20 + k * 20, hp[1] - q * 110, 1.2, RED); ctx.restore(); }
    if (cs.m === "arch") emoteAt(ctx, th, "!", hp[0], hp[1] - 20, cs.u, t);
    if (cs.say) bubbleAt(ctx, th, cs.say, hp[0], hp[1] - 6, false, t - cs.sayT);
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { catPlan(s, f, i).forEach(b => { if (b.act === "meow") add(b.T, "pop"); else if (b.act === "jump"){ add(b.T, "whoosh"); add(b.T + .6, "pop"); } else if (b.act === "startle") add(b.T, "ping"); else if (b.act === "purr") add(b.T, "chime"); else if (b.act === "wake" || b.act === "yawn" || b.act === "knock") add(b.T, "whoosh"); });
    timesOf(s, f.tags, .3, .25, i).forEach(x => add(x, "pop")); (f.props || []).forEach((p, k) => { add(at(s, p.cue, .2 + k * .15, i), "pop"); if (p.okCue) add(at(s, p.okCue, .6, i), "chime"); if (p.badCue) add(at(s, p.badCue, .7, i), "ping"); }); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     robot: a robot is assembled part by part (each part flies in, snaps with sparks, label tag on the left);
     aliveCue = it powers up (glowing eyes, hop + dance, wave); glitchCue = it sparks, smokes, head springs off.
       f: parts:[{label, cue, part: legs|body|arms|head|antenna, bad}], aliveCue, aliveLabel, glitchCue, glitchLabel,
          flow (data flows from the head to every part once alive), actor (mechanic, right)
     ===================================================================== */
  const RORD = ["legs", "body", "arms", "head", "antenna"];
  const RFLY = { legs: [-560, 200, 2], body: [0, -760, -1.5], arms: [600, -160, 3], head: [0, -720, 4], antenna: [0, -420, 6] };
  const RANCH = { legs: [-48, -90], body: [-100, -240], arms: [-160, -230], head: [-92, -430], antenna: [0, -570] };
  function robotTimes(s, f, i){ const parts = f.parts || [], T = timesOf(s, parts, .12, .18, i), comp = {};
    parts.forEach((p, k) => { comp[p.part || RORD[k] || "antenna"] = { T: T[k], k, bad: !!p.bad }; });
    let last = null; const CT = {}; RORD.forEach(c => { if (comp[c]){ CT[c] = comp[c]; last = comp[c]; } else CT[c] = last ? { T: last.T, k: -1, bad: false } : { T: -9, k: -1, bad: false }; });
    return { T, CT, TA: f.aliveCue ? at(s, f.aliveCue, .85, i) : null, TG: f.glitchCue ? at(s, f.glitchCue, .8, i) : null }; }
  TT.layout("robot", "Merakit robot", (ctx, th, s, t) => {
    const f = s.f, M = mv(), parts = f.parts || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { T, CT, TA, TG } = robotTimes(s, f), CX = 590, GY = 1262, FLY = .5, alive = TA != null && t >= TA, glitch = TG != null && t >= TG;
    const snaps = RORD.map(c => CT[c].T + FLY).filter(x => x > 0);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t, { fx: CX, fy: 1000, push: [[TA, .05], [TG, .05]], shakes: snaps.map(x => [x, 6]).concat([[TG, 14], [TA, 6]]) });
    // workbench platform
    ctx.fillStyle = "#544E42"; rr(ctx, 400, GY, 380, 34, 14); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = YEL; for (let k = 0; k < 6; k++){ ctx.save(); ctx.beginPath(); rr(ctx, 400, GY, 380, 34, 14); ctx.clip(); ctx.beginPath(); ctx.moveTo(400 + k * 70, GY + 34); ctx.lineTo(430 + k * 70, GY); ctx.lineTo(460 + k * 70, GY); ctx.lineTo(430 + k * 70, GY + 34); ctx.fill(); ctx.restore(); }
    // labels (left column) with dashed leader lines
    const anchorW = c => [CX + RANCH[c][0], GY + RANCH[c][1]];
    parts.forEach((p, k) => { if (t < T[k]) return; const c = p.part || RORD[k] || "antenna", y = 1222 - k * 118, q = popAt(t, T[k], .45);
      ctx.save(); ctx.globalAlpha *= clamp((t - T[k]) / .3, 0, 1); const a = anchorW(c); ctx.setLineDash([8, 10]); ctx.strokeStyle = lineC(th, .45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(370, y); ctx.quadraticCurveTo(400, a[1], a[0], a[1]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(a[0], a[1], 7, 0, TAU); ctx.fillStyle = p.bad ? RED : th.accent; ctx.fill(); ctx.restore();
      ptag(ctx, th, p.label, 100, y, T[k], t, { align: "left", size: 28, maxW: 280, lines: 2, min: 17, bg: p.bad ? RED : "#FFFFFF", fg: p.bad ? "#fff" : INK, stroke: p.bad ? null : th.accent, icon: p.icon }); });
    // robot body transform: snap squash, alive dance, glitch jitter
    let sq = 0; snaps.forEach(x => sq -= damp(t - x, 22, 7) * .07);
    let lift = 0, rot = 0, jx = 0;
    if (alive && !glitch){ const u = t - TA; lift = Math.abs(Math.sin(u * TAU / .8)) * (u < 2.4 ? 34 : 10); rot = Math.sin(u * TAU / 1.6) * .06; sq += u < 2.4 ? -Math.max(0, Math.cos(u * TAU / .8)) * .03 : 0; }
    if (glitch){ const u = t - TG; jx = Math.sin(t * 70) * 5 * (u < 1.5 ? 1 : .4); rot = Math.sin(t * 23) * .03; }
    if (!alive && !glitch){ rot = Math.sin(t * 1.7) * .018; lift = Math.abs(Math.sin(t * 1.7)) * 4; }
    ctx.save(); ctx.translate(CX + jx, GY - lift); ctx.rotate(rot); ctx.scale(1 - sq * .5, 1 + sq);
    ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = "round";
    const part = (c, fn) => { const C = CT[c]; if (C.T > t) return; const q = C.T < 0 ? 1 : clamp((t - C.T) / FLY, 0, 1), e = eIn(q), F = RFLY[c];
      ctx.save(); ctx.translate(F[0] * (1 - e) * (c === "arms" ? 1 : 1), F[1] * (1 - e)); ctx.rotate(F[2] * (1 - e)); if (C.bad){ ctx.rotate(.12); ctx.translate(10, 4); } fn(q, C.bad); ctx.restore(); };
    const eyesCol = glitch ? RED : alive ? "#7CE8F0" : "#5A5F66";
    // flow cables (behind)
    if (f.flow && alive){ const ends = [[0, -258], [-150, -150], [150, -150], [-48, -24], [48, -24]], src = [0, -362];
      ends.forEach((e, k) => { ctx.strokeStyle = hexA(th.accent, .55); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(src[0], src[1]); ctx.quadraticCurveTo((src[0] + e[0]) * .5 + (k % 2 ? 60 : -60), (src[1] + e[1]) * .5, e[0], e[1]); ctx.stroke();
        for (let j = 0; j < 3; j++){ const q = ((t - TA) * 1.1 + j / 3 + k * .13) % 1, mx = (src[0] + e[0]) * .5 + (k % 2 ? 60 : -60), my = (src[1] + e[1]) * .5, v = 1 - q;
          const px = v * v * src[0] + 2 * v * q * mx + q * q * e[0], py = v * v * src[1] + 2 * v * q * my + q * q * e[1]; glow(ctx, px, py, 26, YEL, .9); ctx.beginPath(); ctx.arc(px, py, 7, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); } }); }
    part("legs", () => { [-1, 1].forEach(d => { ctx.fillStyle = STEEL; rr(ctx, d * 48 - 18, -145, 36, 105, 12); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(d * 48, -95, 16, 0, TAU); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#544E42"; rr(ctx, d * 48 - 42, -46, 84, 46, 16); ctx.fill(); ctx.stroke(); }); });
    part("arms", (q, bad) => { [-1, 1].forEach(d => { let a = -d * .2 + Math.sin(t * 1.5 + d) * .03; if (alive && !glitch && d === 1) a = -2.5 + Math.sin(t * 9) * .4; if (alive && !glitch && d === -1) a = .25 + Math.sin((t - TA) * TAU / .8) * .2; if (glitch) a = -d * .2 + Math.sin(t * 31 + d) * .35;
      ctx.save(); ctx.translate(d * 130, -312); ctx.rotate(a); ctx.lineCap = "round"; ctx.strokeStyle = INK; ctx.lineWidth = 40; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 140); ctx.stroke(); ctx.strokeStyle = STEEL; ctx.lineWidth = 30; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 70, 13, 0, TAU); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.lineWidth = 12; ctx.strokeStyle = "#544E42"; ctx.beginPath(); ctx.arc(0, 168, 22, -Math.PI * .95, -Math.PI * .45); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 168, 22, -Math.PI * .55, -Math.PI * .05); ctx.stroke(); ctx.restore(); }); });
    part("body", (q, bad) => { ctx.fillStyle = STEEL; rr(ctx, -26, -366, 52, 32, 8); ctx.fill(); ctx.stroke(); ctx.fillStyle = th.accent; rr(ctx, -120, -342, 240, 208, 38); ctx.fill(); ctx.strokeStyle = bad ? RED : INK; ctx.lineWidth = bad ? 8 : 5; ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 5;
      ctx.fillStyle = PAPER; rr(ctx, -76, -308, 152, 96, 18); ctx.fill(); ctx.stroke();
      const pulse = alive && !glitch ? .5 + .5 * Math.sin((t - TA) * 8) : 0; if (pulse) glow(ctx, 0, -260, 90, "#FF6B6B", .55 * pulse);
      if (alive && !glitch) heartSym(ctx, 0, -256, 1.6 + pulse * .25, RED); else { ctx.beginPath(); ctx.arc(0, -260, 22, 0, TAU); ctx.fillStyle = glitch ? (Math.sin(t * 25) > 0 ? RED : "#5A5F66") : (Math.sin(t * 2) > .6 ? "#A9A090" : "#5A5F66"); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = INK; [-1, 1].forEach(d => [-1, 1].forEach(e => { ctx.beginPath(); ctx.arc(d * 98, -240 + e * 82, 6, 0, TAU); ctx.fill(); }));
      ctx.strokeStyle = hexA(INK, .5); ctx.lineWidth = 6; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.moveTo(-50, -186 + k * 16); ctx.lineTo(50, -186 + k * 16); ctx.stroke(); } ctx.strokeStyle = INK; ctx.lineWidth = 5; });
    // head (springs off when glitching)
    const pop = glitch ? eEl(ramp(t, TG + .35, .9)) * 60 : 0, ht = glitch ? .28 * eEl(ramp(t, TG + .35, .9)) : alive ? Math.sin((t - TA) * TAU / 1.6) * .1 : 0;
    if (pop > 2){ ctx.strokeStyle = "#544E42"; ctx.lineWidth = 5; ctx.beginPath(); for (let k = 0; k <= 8; k++){ const y = -366 - k / 8 * pop, x = (k % 2 ? 1 : -1) * (k === 0 || k === 8 ? 0 : 16); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.strokeStyle = INK; }
    ctx.save(); ctx.translate(0, -pop); ctx.translate(0, -430); ctx.rotate(ht); ctx.translate(0, 430);
    part("antenna", () => { ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, -500); ctx.quadraticCurveTo(Math.sin(t * 4) * 10, -535, 0, -560); ctx.stroke();
      const on = alive && !glitch && Math.sin(t * 7) > 0; if (on) glow(ctx, 0, -572, 50, YEL, .8); ctx.beginPath(); ctx.arc(0, -572, 15, 0, TAU); ctx.fillStyle = on ? YEL : glitch ? RED : "#A9A090"; ctx.fill(); ctx.lineWidth = 4; ctx.stroke(); });
    part("head", (q, bad) => { ctx.fillStyle = PAPER; rr(ctx, -94, -502, 188, 140, 32); ctx.fill(); ctx.strokeStyle = bad ? RED : INK; ctx.lineWidth = bad ? 8 : 5; ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 5;
      ctx.fillStyle = "#544E42"; rr(ctx, -108, -456, 16, 46, 6); ctx.fill(); rr(ctx, 92, -456, 16, 46, 6); ctx.fill();
      ctx.fillStyle = "#2B2F36"; rr(ctx, -72, -482, 144, 96, 20); ctx.fill();
      const blink = alive && !glitch && ((t - TA) % 2.6) > 2.45;
      [-1, 1].forEach(d => { const ex = d * 34, ey = -440;
        if (glitch){ ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex - 11, ey - 11); ctx.lineTo(ex + 11, ey + 11); ctx.moveTo(ex + 11, ey - 11); ctx.lineTo(ex - 11, ey + 11); ctx.stroke(); }
        else { if (alive) glow(ctx, ex, ey, 34, "#7CE8F0", .7); ctx.beginPath(); ctx.ellipse(ex, ey, 13, blink ? 2 : 15, 0, 0, TAU); ctx.fillStyle = eyesCol; ctx.fill(); } });
      ctx.strokeStyle = alive && !glitch ? "#7CE8F0" : "#5A5F66"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); if (alive && !glitch) ctx.arc(0, -420, 18, .2, Math.PI - .2); else { ctx.moveTo(-16, -404); ctx.lineTo(16, -404); } ctx.stroke(); ctx.strokeStyle = INK; });
    ctx.restore();
    ctx.restore();
    // snap sparks at each joint
    RORD.forEach(c => { const x = CT[c].T + FLY; if (x <= 0 || CT[c].k < 0 && c !== "arms" && c !== "antenna") return; const u = t - x; if (u < 0 || u > .5) return; const a = anchorW(c), q = u / .5;
      for (let k = 0; k < 10; k++){ const an = k * TAU / 10 + .3, d1 = 20 + q * 90, d0 = 10 + q * 50; ctx.strokeStyle = k % 2 ? YEL : "#FFFFFF"; ctx.globalAlpha = 1 - q; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(a[0] + 92 + Math.cos(an) * d0, a[1] + Math.sin(an) * d0); ctx.lineTo(a[0] + 92 + Math.cos(an) * d1, a[1] + Math.sin(an) * d1); ctx.stroke(); } ctx.globalAlpha = 1; });
    // idle welding sparks on the latest part (mechanic keeps tinkering)
    if (!alive && !glitch){ const done = RORD.filter(c => CT[c].T >= 0 && t > CT[c].T + FLY + .6); if (done.length){ const c = done[done.length - 1], a = anchorW(c), ph = (t * 1.4) % 1, wx = a[0] + 100, wy = a[1];
      if (ph < .45){ glow(ctx, wx, wy, 60, YEL, .7 * (1 - ph / .45)); for (let k = 0; k < 7; k++){ const an = -Math.PI * (k + .5) / 7 - .2, d = 10 + ph * 160; ctx.strokeStyle = k % 2 ? YEL : "#FFFFFF"; ctx.lineWidth = 4; ctx.globalAlpha = 1 - ph / .45; ctx.beginPath(); ctx.moveTo(wx + Math.cos(an) * d * .6, wy + Math.sin(an) * d * .6 + ph * ph * 200); ctx.lineTo(wx + Math.cos(an) * d, wy + Math.sin(an) * d + ph * ph * 260); ctx.stroke(); } ctx.globalAlpha = 1; } } }
    // glitch: sparks crackle + smoke
    if (glitch){ const u = t - TG; for (let k = 0; k < 5; k++){ const q = ((t * .45) + k / 5) % 1; ctx.beginPath(); ctx.arc(CX + 40 + Math.sin(q * 5 + k) * 30, GY - 520 - q * 200 - 80 * ramp(t, TG + .35, .5), 18 + q * 40, 0, TAU); ctx.fillStyle = `rgba(90,80,75,${((1 - q) * .6).toFixed(3)})`; ctx.fill(); }
      if (Math.sin(t * 17) > .3){ const bx = CX + (Math.sin(t * 7) > 0 ? 120 : -120), by = GY - 300; ctx.strokeStyle = YEL; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 20, by - 26); ctx.lineTo(bx + 4, by - 30); ctx.lineTo(bx + 26, by - 60); ctx.stroke(); }
      if (f.glitchLabel) ptag(ctx, th, f.glitchLabel, CX, 640, TG + .4, t, { size: 36, maxW: 560, bg: RED, fg: "#fff", icon: "alert" }); }
    if (alive && !glitch){ const u = t - TA; confetti(ctx, CX, GY - 560, u - .1, 26, 2.8, 420); sparkles(ctx, CX, GY - 320, t, 8, 260, clamp(u * 2, 0, 1) * .8);
      for (let k = 0; k < 3; k++){ const q = ((u * .5) + k / 3) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(q * Math.PI) * clamp(u, 0, 1); noteSym(ctx, CX + 170 + k * 30 + Math.sin(q * 6) * 20, GY - 420 - q * 160, 1, k % 2 ? th.accent : TEAL); ctx.restore(); }
      if (f.aliveLabel) ptag(ctx, th, f.aliveLabel, CX, 640, TA + .3, t, { size: 36, maxW: 600, bg: GREEN, fg: "#fff", icon: f.aliveIcon || "sparkles" }); }
    // mechanic (right), facing the robot, wrench in hand
    const A = Object.assign({ x: 915 }, f.actor || {}), SC = .8;
    const P = hero(ctx, th, s, A, t, 1312, SC, st => { autoAct(f.actor, st, alive && !glitch ? "cheer" : "point", glitch ? "shock" : alive ? "happy" : null); if (!hasKey(f.actor, "nod")){ const last = snaps.filter(x => x <= t).pop(); if (last != null && t - last < 1) st.nodT = last; } },
      { mirror: true, hops: alive && !glitch ? [[TA + .2, 2, 70]] : glitch ? [[TG + .1, 1, 50]] : [] });
    if (P && P.st.pose === "point"){ const hd = handAt(P.st.x, 1312 - P.lift, SC, "point", false, -1), tap = snaps.reduce((m, x) => Math.max(m, damp(t - x + .15, 18, 5)), 0);
      ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate(-.6 + tap * .5); ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-62, -10); ctx.stroke();
      ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(-74, -12, 16, .9, TAU - .9); ctx.stroke(); ctx.restore(); }
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { const { T, CT, TA, TG } = robotTimes(s, f, i); T.forEach(x => { add(x, "whoosh"); add(x + .5, "pop"); }); if (TA != null){ add(TA, "ping"); add(TA + .3, "chime"); } if (TG != null){ add(TG, "pop"); add(TG + .4, "ping"); } actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     easel: a painter paints on a canvas; each stroke (on cue) paints one element while the brush follows it,
     paint drips and drops fall from the ledge; reveal = golden frame, rays, confetti, tag on top.
     copies: small canvases on the right that mirror the main one once linked (or go stale with a red "!").
       f: strokes:[{cue, kind, label, color, text, dur}] kind: sky|hill|sun|tree|house|flower|heart|path|bird|splat|scribble|text,
          base:[kind...] (already painted), reveal:{cue, label, icon}, copies:{labels:[..], cue, linked, badCue}, actor (painter)
     ===================================================================== */
  const PAINT = { sky: "#8EC9E8", hill: "#6FB35A", sun: "#F2C94C", tree: "#3E8E4F", house: "#D8644A", flower: "#E86A9A", heart: "#E25555", path: "#C9A27A", bird: "#3B2418", splat: "#7A5CC2", scribble: "#D84315", text: "#2F6F73" };
  function paintKind(ctx, th, it, W, H, p, t){
    const kd = it.kind || "splat", col = it.color || PAINT[kd] || "#7A5CC2"; let tip = [W * .5, H * .5]; if (p <= 0) return tip;
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (kd === "sky"){ ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * p, H); ctx.clip(); const g = ctx.createLinearGradient(0, 0, 0, H * .75); g.addColorStop(0, col); g.addColorStop(1, "#E4F3FA"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * .75); ctx.restore(); tip = [W * p, H * (.1 + .5 * Math.abs(Math.sin(p * 14)))]; }
    else if (kd === "hill"){ ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * p, H); ctx.clip(); ctx.beginPath(); ctx.moveTo(0, H * .7); ctx.bezierCurveTo(W * .3, H * .5, W * .6, H * .82, W, H * .6); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); tip = [W * p, H * (.72 + .18 * Math.abs(Math.sin(p * 12)))]; }
    else if (kd === "sun"){ const r = W * .1 * eBack(clamp(p * 1.3, 0, 1)), cx = W * .8, cy = H * .22; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, Math.max(0, r), 0, TAU); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = W * .014;
      for (let k = 0; k < 8; k++){ if (k / 8 > p) break; const a = k * TAU / 8 + t * .4; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r * 1.3); ctx.lineTo(cx + Math.cos(a) * r * 1.8, cy + Math.sin(a) * r * 1.8); ctx.stroke(); } tip = [cx + Math.cos(p * TAU * 1.5) * W * .12, cy + Math.sin(p * TAU * 1.5) * W * .12]; }
    else if (kd === "tree"){ const x = W * .2, y = H * .82, q1 = clamp(p / .4, 0, 1), q2 = clamp((p - .35) / .65, 0, 1); ctx.fillStyle = "#8E5A3A"; ctx.fillRect(x - W * .02, y - H * .3 * q1, W * .04, H * .3 * q1);
      if (q2 > 0){ ctx.fillStyle = col; [[0, -.42, .11], [-.06, -.34, .08], [.06, -.34, .08]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * W, y + dy * H, r * W * eBack(q2), 0, TAU); ctx.fill(); }); } tip = q2 > 0 ? [x + Math.cos(p * 20) * W * .08, y - H * .4 + Math.sin(p * 20) * H * .06] : [x, y - H * .3 * q1]; }
    else if (kd === "house"){ const x = W * .55, y = H * .84, w = W * .2, h = H * .22, q1 = clamp(p / .6, 0, 1), q2 = clamp((p - .55) / .45, 0, 1);
      ctx.fillStyle = "#FFF1DC"; ctx.fillRect(x - w / 2, y - h * q1, w, h * q1); ctx.strokeStyle = "#8E5A3A"; ctx.lineWidth = W * .008; ctx.strokeRect(x - w / 2, y - h * q1, w, h * q1);
      if (q2 > 0){ ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w * .62, y - h); ctx.lineTo(x, y - h - H * .16 * eBack(q2)); ctx.lineTo(x + w * .62, y - h); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#8E5A3A"; ctx.fillRect(x - w * .12, y - h * .5, w * .24, h * .5); } tip = q2 > 0 ? [x + (q2 - .5) * w, y - h - H * .08] : [x + Math.sin(p * 30) * w * .4, y - h * q1]; }
    else if (kd === "flower"){ for (let k = 0; k < 4; k++){ const q = clamp((p - k * .22) / .3, 0, 1); if (!q) continue; const x = W * (.12 + k * .25), y = H * .88, s = W * .028 * eBack(q);
        ctx.strokeStyle = "#3E8E4F"; ctx.lineWidth = W * .008; ctx.beginPath(); ctx.moveTo(x, y + H * .08); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = k % 2 ? col : "#F2C94C"; for (let j = 0; j < 5; j++){ const a = j * TAU / 5 + t * .5; ctx.beginPath(); ctx.arc(x + Math.cos(a) * s, y + Math.sin(a) * s, s * .7, 0, TAU); ctx.fill(); } ctx.fillStyle = "#FFF7EE"; ctx.beginPath(); ctx.arc(x, y, s * .55, 0, TAU); ctx.fill(); }
      tip = [W * (.12 + Math.min(3, Math.floor(p * 4)) * .25), H * .86]; }
    else if (kd === "heart"){ const q = eBack(clamp(p * 1.2, 0, 1)); ctx.save(); ctx.translate(W * .5, H * .5); ctx.scale(q * W / 160, q * W / 160); heartSym(ctx, 0, 6, 2.2, col); ctx.restore(); tip = [W * .5 + Math.sin(p * 9) * W * .1, H * .45 + Math.cos(p * 9) * H * .1]; }
    else if (kd === "path"){ ctx.save(); ctx.beginPath(); ctx.rect(0, H * (1 - p * .45), W, H); ctx.clip(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(W * .38, H); ctx.quadraticCurveTo(W * .5, H * .78, W * .5, H * .58); ctx.lineTo(W * .54, H * .58); ctx.quadraticCurveTo(W * .58, H * .8, W * .68, H); ctx.closePath(); ctx.fill(); ctx.restore(); tip = [W * .53, H * (1 - p * .42)]; }
    else if (kd === "bird"){ ctx.strokeStyle = col; ctx.lineWidth = W * .01; for (let k = 0; k < 3; k++){ const q = clamp((p - k * .3) / .35, 0, 1); if (!q) continue; const x = W * (.3 + k * .12), y = H * (.18 + (k % 2) * .08), w = W * .045 * q, fl = Math.sin(t * 6 + k) * .3;
        ctx.beginPath(); ctx.moveTo(x - w, y - w * (.5 + fl)); ctx.quadraticCurveTo(x - w * .4, y - w * .5, x, y); ctx.quadraticCurveTo(x + w * .4, y - w * .5, x + w, y - w * (.5 + fl)); ctx.stroke(); } tip = [W * (.3 + p * .3), H * .2]; }
    else if (kd === "text"){ ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * (.06 + .9 * p), H); ctx.clip(); const z = fitFont(ctx, th, it.text || "", W * .86, H * .3, 900, 18); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(it.text || "", W / 2, H * .52 + z * .35); ctx.textAlign = "left"; ctx.restore(); tip = [W * (.06 + .88 * p), H * .5 + Math.sin(p * 30) * H * .08]; }
    else if (kd === "scribble"){ ctx.strokeStyle = col; ctx.lineWidth = W * .025; ctx.beginPath(); const N = Math.max(2, Math.floor(p * 22)); for (let k = 0; k < N; k++){ const x = W * (.15 + .7 * ((k * .618) % 1)), y = H * (.2 + .6 * ((k * .37 + .1) % 1)); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); const k = N - 1; tip = [W * (.15 + .7 * ((k * .618) % 1)), H * (.2 + .6 * ((k * .37 + .1) % 1))]; }
    else { for (let k = 0; k < 4; k++){ const q = clamp((p - k * .2) / .3, 0, 1); if (!q) continue; const x = W * (.25 + ((k * .53) % .55)), y = H * (.3 + ((k * .41) % .45)), r = W * (.07 + (k % 2) * .03) * eBack(q);
        ctx.fillStyle = k % 2 ? col : (it.color2 || "#E8742C"); ctx.beginPath(); for (let j = 0; j < 14; j++){ const a = j * TAU / 14, rad = r * (j % 2 ? .65 : 1); ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } ctx.closePath(); ctx.fill(); }
      tip = [W * (.25 + ((Math.floor(p * 4) * .53) % .55)), H * (.3 + ((Math.floor(p * 4) * .41) % .45))]; }
    ctx.restore(); return tip;
  }
  function easelTimes(s, f, i){ return { T: timesOf(s, f.strokes, .12, .2, i), TR: f.reveal ? at(s, f.reveal.cue, .85, i) : null, TL: f.copies && f.copies.cue ? at(s, f.copies.cue, .6, i) : null, TB: f.copies && f.copies.badCue ? at(s, f.copies.badCue, .7, i) : null }; }
  TT.layout("easel", "Melukis di kanvas", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.strokes || [], cp = f.copies || null; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { T, TR, TL, TB } = easelTimes(s, f), CX0 = cp ? 360 : 440, CY0 = 668, W = cp ? 400 : 450, H = cp ? 300 : 340, rv = TR != null && t >= TR;
    const dur = k => its[k].dur || 1.05, active = its.findIndex((it, k) => t >= T[k] && t < T[k] + dur(k));
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t, { fx: CX0 + W / 2, fy: 920, push: [[TR, .05]], shakes: T.map(x => [x, 3]) });
    // reveal rays behind the canvas
    if (rv){ const ar = ramp(t, TR, .5); ctx.save(); ctx.translate(CX0 + W / 2, CY0 + H / 2); ctx.rotate(t * .25); for (let k = 0; k < 12; k++){ ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, -520); ctx.lineTo(40, -520); ctx.closePath(); ctx.fillStyle = hexA(YEL, .18 * ar); ctx.fill(); } ctx.restore(); }
    // easel
    const legL = (x0, y0, x1, y1, w) => { ctx.lineCap = "round"; ctx.strokeStyle = INK; ctx.lineWidth = (w || 18) + 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = WOOD; ctx.lineWidth = w || 18; ctx.stroke(); };
    const ax = CX0 + W / 2; legL(ax, 636, ax, 1312, 14); legL(ax, 630, CX0 + 40, 1316); legL(ax, 630, CX0 + W - 40, 1316);
    // canvas with a little wobble whenever the brush hits it
    let wob = 0; T.forEach(x => wob += damp(t - x, 18, 4) * .02);
    ctx.save(); ctx.translate(ax, CY0 + H); ctx.rotate(wob); ctx.translate(-ax, -(CY0 + H));
    ctx.fillStyle = "rgba(59,36,24,.18)"; rr(ctx, CX0 + 8, CY0 + 10, W, H, 8); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, CX0, CY0, W, H, 8); ctx.fill();
    ctx.save(); ctx.beginPath(); rr(ctx, CX0, CY0, W, H, 8); ctx.clip(); ctx.translate(CX0, CY0);
    (f.base || []).forEach(b => paintKind(ctx, th, typeof b === "string" ? { kind: b } : b, W, H, 1, t));
    let tip = null; its.forEach((it, k) => { if (t < T[k]) return; const tp = paintKind(ctx, th, it, W, H, clamp((t - T[k]) / dur(k), 0, 1), t); if (k === active) tip = tp; });
    // drips that slide down from finished strokes
    its.forEach((it, k) => { const u = t - T[k] - dur(k); if (u < 0) return; const x = W * (.18 + ((k * .37) % .64)), y0 = H * (it.kind === "sky" || it.kind === "bird" || it.kind === "sun" ? .45 : .62), len = 55 * eOut(clamp(u / 1.4, 0, 1));
      ctx.strokeStyle = it.color || PAINT[it.kind] || "#7A5CC2"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + len); ctx.stroke(); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(x, y0 + len + 3, 7, 0, TAU); ctx.fill(); });
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 5; rr(ctx, CX0, CY0, W, H, 8); ctx.stroke();
    if (rv){ const q = eBack(clamp((t - TR) / .5, 0, 1)), k2 = 1.12 - .12 * q; ctx.save(); ctx.globalAlpha *= clamp((t - TR) / .25, 0, 1); ctx.translate(ax, CY0 + H / 2); ctx.scale(k2, k2); ctx.translate(-ax, -(CY0 + H / 2));
      ctx.strokeStyle = "#C9A227"; ctx.lineWidth = 22; rr(ctx, CX0 - 12, CY0 - 12, W + 24, H + 24, 12); ctx.stroke(); ctx.strokeStyle = "#8A6D12"; ctx.lineWidth = 4; rr(ctx, CX0 - 24, CY0 - 24, W + 48, H + 48, 16); ctx.stroke(); ctx.restore(); }
    ctx.restore();
    // ledge
    ctx.fillStyle = WOOD; rr(ctx, CX0 - 24, CY0 + H, W + 48, 22, 8); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    // falling drops from the ledge (periodic, from the latest finished stroke) + floor splashes
    const done = its.map((it, k) => k).filter(k => t > T[k] + dur(k) + .8);
    if (done.length){ const k = done[done.length - 1], it = its[k], col = it.color || PAINT[it.kind] || "#7A5CC2", per = 2.3, ph = (t - T[k] - dur(k) - .8) % per, x = CX0 + W * (.18 + ((k * .37) % .64));
      if (ph < .55){ const y = CY0 + H + 22 + 600 * ph * ph * 3.2; if (y < 1306){ ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, 7, 11, 0, 0, TAU); ctx.fill(); } }
      const su = ph - Math.sqrt((1306 - CY0 - H - 22) / (600 * 3.2)); if (su > 0 && su < .5){ ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, 1308, 10 + su * 70, 4 + su * 10, 0, 0, TAU); ctx.globalAlpha *= 1 - su * 2; ctx.stroke(); ctx.globalAlpha = 1; } }
    if (!cp){ ctx.fillStyle = hexA("#7A5CC2", .5); ctx.beginPath(); ctx.ellipse(CX0 + W * .4, 1312, 70, 10, 0, 0, TAU); ctx.fill(); }
    // copies on the right
    if (cp){ const labels = cp.labels || [], cw = 178, ch = Math.round(cw * H / W), xs = 805, linked = TL != null && t >= TL;
      labels.forEach((lb, k) => { const y = 652 + k * (ch + 36), q = popAt(t, .25 + k * .12, .4); if (!q) return; const upd = linked ? t - TL - .35 - k * .18 : -1, stale = !cp.linked && TB != null && t >= TB + k * .2;
        if (linked){ const sy = CY0 + H * (k + .5) / labels.length, ey = y + ch / 2; ctx.strokeStyle = hexA(GREEN, .7); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(CX0 + W, sy); ctx.bezierCurveTo(CX0 + W + 30, sy, xs - 30, ey, xs, ey); ctx.stroke();
          for (let j = 0; j < 2; j++){ const qq = ((t - TL) * 1.3 + j / 2 + k * .2) % 1, px = lerp(CX0 + W, xs, qq), py = lerp(sy, ey, easeIO(qq)); glow(ctx, px, py, 18, YEL, .9); ctx.beginPath(); ctx.arc(px, py, 5, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); } }
        const shk = stale ? damp(t - TB - k * .2, 40, 4) * 8 : 0;
        ctx.save(); ctx.translate(xs + cw / 2 + shk, y + ch / 2); ctx.scale(q, q); ctx.translate(-cw / 2, -ch / 2);
        if (upd > 0) glow(ctx, cw / 2, ch / 2, cw * .8, GREEN, .3 * clamp(1.5 - upd, .3, 1));
        ctx.fillStyle = "#FFFFFF"; rr(ctx, 0, 0, cw, ch, 6); ctx.fill(); ctx.save(); ctx.beginPath(); rr(ctx, 0, 0, cw, ch, 6); ctx.clip(); ctx.scale(cw / W, ch / H);
        (f.base || []).forEach(b => paintKind(ctx, th, typeof b === "string" ? { kind: b } : b, W, H, 1, t));
        if (linked) its.forEach((it, j) => { const tt = t - .35 - k * .18; if (tt < T[j]) return; paintKind(ctx, th, it, W, H, clamp((tt - T[j]) / dur(j), 0, 1), t); });
        ctx.restore(); ctx.strokeStyle = stale ? RED : upd > 0 ? GREEN : INK; ctx.lineWidth = stale || upd > 0 ? 6 : 4; rr(ctx, 0, 0, cw, ch, 6); ctx.stroke();
        const z = fitFont(ctx, th, lb, cw - 16, 22, 800, 14); rr(ctx, 0, ch - z - 12, cw, z + 12, 6); ctx.fillStyle = hexA(INK, .78); ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(lb, cw / 2, ch - 9); ctx.textAlign = "left";
        ctx.restore();
        if (upd > 0) checkDisc(ctx, xs + cw - 4, y + 6, 22 * popAt(t, TL + .35 + k * .18, .35));
        if (stale){ const qq = popAt(t, TB + k * .2, .35); ctx.beginPath(); ctx.arc(xs + cw - 4, y + 6, 22 * qq, 0, TAU); ctx.fillStyle = RED; ctx.fill(); font(ctx, 900, 30 * qq, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText("!", xs + cw - 4, y + 6 + 11 * qq); ctx.textAlign = "left"; } }); }
    else { // paint pots
      [["#E8742C", 880], [TEAL, 935], ["#E86A9A", 985]].forEach(([c, x], k) => { const y = 1306 - damp(t - (T[k] || -9), 20, 6) * 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, x - 24, y - 46, 48, 46, 8); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = c; rr(ctx, x - 24, y - 46, 48, 16, 6); ctx.fill(); }); }
    // stroke tags under the canvas
    const cols = cp ? [CX0 + W / 2] : [560, 840];
    its.forEach((it, k) => { if (!it.label) return; const c = cols[k % cols.length], r = Math.floor(k / cols.length), y = 1086 + r * 76; const col = it.color || PAINT[it.kind] || "#7A5CC2";
      ptag(ctx, th, it.label, c, y, T[k] + .15, t, { size: 27, maxW: cp ? 420 : 272, lines: 2, min: 18, bg: "#FFFFFF", fg: INK, stroke: col, lw: 6 }); });
    // painter + brush
    const A = Object.assign({ x: 212 }, f.actor || {}), SC = .92, GY = 1318;
    const P = hero(ctx, th, s, A, t, GY, SC, st => { autoAct(f.actor, st, rv ? "cheer" : "point", rv ? "happy" : active >= 0 ? "smile" : null); }, { hops: rv ? [[TR + .15, 2, 70]] : [] });
    beret(ctx, P, t);
    if (!rv || t < TR + .1){ const hd = handAt(P.st.x, GY - P.lift, SC, "point", false, 1); let bx, by, col = "#7A5CC2";
      if (tip){ bx = CX0 + tip[0]; by = CY0 + tip[1]; const it = its[active]; col = it.color || PAINT[it.kind] || col; } else { const lastK = its.map((x, k) => k).filter(k => t >= T[k]).pop(); if (lastK != null) col = its[lastK].color || PAINT[its[lastK].kind] || col; bx = hd[0] + 40 + Math.sin(t * 2) * 6; by = hd[1] - 20 + Math.sin(t * 3) * 6; }
      const an = Math.atan2(by - hd[1], bx - hd[0]); ctx.save(); ctx.translate(bx, by); ctx.rotate(an); ctx.strokeStyle = INK; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-30, 0); ctx.stroke(); ctx.strokeStyle = "#E2B07A"; ctx.lineWidth = 8; ctx.stroke();
      ctx.fillStyle = "#B0A89A"; rr(ctx, -34, -9, 20, 18, 3); ctx.fill(); ctx.beginPath(); ctx.moveTo(-14, -9); ctx.quadraticCurveTo(6, 0, -14, 9); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore();
      if (tip) for (let j = 0; j < 4; j++){ const a = t * 9 + j * 1.7; ctx.beginPath(); ctx.arc(bx + Math.cos(a) * 26, by + Math.sin(a) * 18 + 8, 4, 0, TAU); ctx.fillStyle = hexA(col, .6); ctx.fill(); } }
    if (rv){ confetti(ctx, ax, CY0 - 10, t - TR - .1, 26, 2.8, 400); sparkles(ctx, ax, CY0 + H / 2, t, 8, W * .62, ramp(t, TR, .5)); if (f.reveal.label) ptag(ctx, th, f.reveal.label, ax, 612, TR + .25, t, { size: 36, maxW: 620, bg: GREEN, fg: "#fff", icon: f.reveal.icon || "star" }); }
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { const { T, TR, TL, TB } = easelTimes(s, f, i); T.forEach(x => add(x, "whoosh")); T.forEach(x => add(x + .2, "pop")); if (TR != null) add(TR + .1, "chime"); if (TL != null) (f.copies.labels || []).forEach((l, k) => add(TL + .35 + k * .18, "ping")); if (TB != null) add(TB, "pop"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     drums: a drummer behind a kit keeps a steady groove (sticks fly, drum heads vibrate, cymbals wobble, notes float);
     each cue hit is a big accent on one drum (shock ring + chip); crash = finale (cymbal crash, shake, confetti, tag).
     phases change the tempo (bpm 0 = stops); offbeat = labelled drums each play their own tempo (chaos).
       f: hits:[{cue, drum: snare|tom1|tom2|floor|hihat|crash|kick, label, icon}], bpm, phases:[{cue, bpm, label, tone, expr}],
          crash:{cue, label, icon}, kit:{snare, tom1, tom2, floor} (name plates), offbeat, actor (drummer)
     ===================================================================== */
  const DK = { hihat: [236, 968, 74, 12], snare: [372, 1064, 78, 22, 52], tom1: [482, 992, 62, 19, 50], tom2: [652, 992, 62, 19, 50], floor: [790, 1082, 80, 22, 116], crash: [884, 880, 92, 16], kick: [566, 1180, 120] };
  const HAND = { hihat: 0, snare: 0, tom1: 0, tom2: 1, floor: 1, crash: 1, kick: 2 };
  const hitPt = d => { const D = DK[d]; return d === "kick" ? [D[0], D[1] - D[2]] : [D[0], D[1] - (d === "hihat" || d === "crash" ? 4 : 0)]; };
  function drumEvents(s, f, i){
    const hits = (f.hits || []).map((h, k) => ({ T: at(s, h.cue, .15 + k * .2, i), d: h.drum || ["snare", "tom2", "tom1", "floor"][k % 4], k, big: true }));
    const phases = (f.phases || []).map((p, k) => ({ T: at(s, p.cue, .1 + k * .3, i), bpm: p.bpm }));
    const TC = f.crash ? at(s, f.crash.cue, .85, i) : null, end = 40, ev = [[], [], []];
    const bpmAt = τ => { let b = f.bpm != null ? f.bpm : 104; phases.forEach(p => { if (τ >= p.T) b = p.bpm; }); return b; };
    if (f.offbeat){ const kit = ["snare", "tom1", "tom2", "floor"], per = [.53, .71, .89, 1.07]; kit.forEach((d, k) => { for (let τ = .3 + k * .17; τ < end; τ += per[k] * (1 + .25 * Math.sin(τ * 1.3 + k))) ev[HAND[d]].push({ T: τ, d }); }); }
    else { let τ = f.startAt != null ? f.startAt : .35, n = 0; while (τ < end){ const b = bpmAt(τ); if (!b){ τ += .1; continue; } const B = 60 / b;
        ev[0].push({ T: τ, d: n % 2 ? "snare" : "hihat" }); ev[1].push({ T: τ + B / 2, d: n % 2 ? "floor" : "tom2", soft: true }); if (n % 2 === 0) ev[2].push({ T: τ, d: "kick" }); τ += B; n++; } }
    hits.forEach(h => { const hd = HAND[h.d]; ev[hd] = ev[hd].filter(e => Math.abs(e.T - h.T) > .22); ev[hd].push(h); });
    if (TC != null){ ev[1] = ev[1].filter(e => Math.abs(e.T - TC) > .3); ev[0] = ev[0].filter(e => Math.abs(e.T - TC) > .3); ev[1].push({ T: TC, d: "crash", big: true }); ev[0].push({ T: TC, d: "snare", big: true }); ev[2].push({ T: TC, d: "kick", big: true }); }
    ev.forEach(l => l.sort((a, b) => a.T - b.T));
    return { ev, hits, phases, TC };
  }
  TT.layout("drums", "Set drum", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { ev, hits, phases, TC } = drumEvents(s, f), crashed = TC != null && t >= TC;
    const lastHit = {}; ev.forEach(l => l.forEach(e => { if (e.T <= t && (lastHit[e.d] == null || e.T > lastHit[e.d].T)) lastHit[e.d] = e; }));
    const hu = d => lastHit[d] ? t - lastHit[d].T : 99;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t, { fx: 566, fy: 1000, push: [[TC, .05]], shakes: hits.map(h => [h.T, 6]).concat([[TC, 16]]) });
    // chips: hits or phases
    const chipList = hits.length ? (f.hits || []).map(h => ({ label: h.label, icon: h.icon, tone: h.tone })) : (f.phases || []).map(p => ({ label: p.label, icon: p.icon, tone: p.tone }));
    const chipT = hits.length ? hits.map(h => h.T) : phases.map(p => p.T);
    chipsTop(ctx, th, chipList, chipT, t, { y: 612 });
    // floor rug + stage light
    ctx.beginPath(); ctx.ellipse(566, 1310, 420, 30, 0, 0, TAU); ctx.fillStyle = hexA(th.accent, dark(th) ? .35 : .22); ctx.fill();
    glow(ctx, 566, 900, 420, YEL, .12 + (crashed ? .25 * Math.exp(-(t - TC) * 1.2) : 0) + .05 * Math.sin(t * 3));
    // drummer (behind the kit)
    const A = Object.assign({ x: 566 }, f.actor || {}), SC = .95, GY = 1188;
    let ph = null; phases.forEach((p, k) => { if (t >= p.T) ph = f.phases[k]; });
    const P = hero(ctx, th, s, A, t, GY, SC, st => { st.sit = true; st.pose = "rest"; autoAct(f.actor, st, null, crashed ? "happy" : ph && ph.expr ? ph.expr : f.offbeat ? "confused" : "smile");
      const b = lastHit.kick ? t - lastHit.kick.T : 9; if (b < .3 && !(ph && ph.bpm === 0)) st.nodT = lastHit.kick.T; }, { shadow: false, hops: crashed ? [[TC, 1, 40]] : [] });
    // kit
    const shell = (d, col) => { const D = DK[d], u = hu(d), vib = damp(u, 55, 9) * (lastHit[d] && lastHit[d].big ? 10 : 5);
      ctx.save(); ctx.translate(D[0], D[1]); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(-D[2], 0); ctx.lineTo(-D[2], D[4]); ctx.ellipse(0, D[4], D[2], D[3], 0, Math.PI, 0, true); ctx.lineTo(D[2], 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.fillRect(-D[2] + 10, 6, 14, D[4] - 8);
      ctx.beginPath(); ctx.ellipse(0, 0, D[2] + Math.abs(vib) * .3, D[3] + vib * .5, 0, 0, TAU); ctx.fillStyle = "#F7F1E8"; ctx.fill(); ctx.stroke();
      const nm = f.kit && f.kit[d]; if (nm){ const z = fitFont(ctx, th, nm, D[2] * 2 - 14, 24, 800, 13), w = Math.min(D[2] * 2 - 6, ctx.measureText(nm).width + 16); rr(ctx, -w / 2, D[4] / 2 - z * .5 - 2, w, z + 8, 7); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(nm, 0, D[4] / 2 + z * .38); ctx.textAlign = "left"; }
      ctx.restore(); };
    const stand = (x, y0) => { ctx.strokeStyle = "#544E42"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, 1300); ctx.moveTo(x, 1260); ctx.lineTo(x - 34, 1306); ctx.moveTo(x, 1260); ctx.lineTo(x + 34, 1306); ctx.stroke(); };
    const cym = d => { const D = DK[d], u = hu(d), big = lastHit[d] && lastHit[d].big, wo = damp(u, 16, big ? 1.6 : 3.5) * (big ? .4 : .16); stand(D[0], D[1]);
      ctx.save(); ctx.translate(D[0], D[1] - Math.abs(wo) * 12); ctx.rotate(wo + (d === "crash" ? -.12 : 0)); ctx.beginPath(); ctx.ellipse(0, 0, D[2], D[3], 0, 0, TAU); const g = ctx.createLinearGradient(-D[2], 0, D[2], 0); g.addColorStop(0, "#C9A227"); g.addColorStop(.5, "#F2D16B"); g.addColorStop(1, "#B08A1E"); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      if (d === "hihat"){ ctx.beginPath(); ctx.ellipse(0, 14, D[2], D[3], 0, 0, TAU); ctx.fill(); ctx.stroke(); } ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
      if (big && u < .8){ ctx.save(); ctx.strokeStyle = hexA(YEL, 1 - u / .8); ctx.lineWidth = 6; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(D[0], D[1], D[2] + 20 + u * 140 + k * 26, -Math.PI * .9, -Math.PI * .1); ctx.stroke(); } ctx.restore(); } };
    cym("hihat"); cym("crash"); stand(DK.snare[0], DK.snare[1] + 50); stand(DK.floor[0] - 50, DK.floor[1] + 100); stand(DK.floor[0] + 50, DK.floor[1] + 100);
    // kick drum (front face pulses with every kick)
    { const D = DK.kick, u = hu("kick"), pk = 1 + damp(u, 30, 8) * (lastHit.kick && lastHit.kick.big ? .07 : .035); ctx.save(); ctx.translate(D[0], D[1]); ctx.scale(pk, pk);
      ctx.beginPath(); ctx.arc(0, 0, D[2], 0, TAU); ctx.fillStyle = th.accent; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, D[2] - 18, 0, TAU); ctx.fillStyle = "#F7F1E8"; ctx.fill(); ctx.stroke();
      icon(ctx, f.kickIcon || "star", -42, -42, 84, th.accent, 3); ctx.restore(); if (u < .5) ringFx(ctx, D[0], D[1], u, hexA(th.accent, .5), D[2] - 10, 6); }
    ctx.strokeStyle = "#544E42"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(530, 1066); ctx.lineTo(500, 1040); ctx.moveTo(602, 1066); ctx.lineTo(632, 1040); ctx.stroke();
    shell("tom1", TEAL); shell("tom2", TEAL); shell("snare", "#B8B0A2"); shell("floor", TEAL);
    // arms + sticks
    const sh = [[566 - 40, 958], [566 + 40, 958]], grip = [[480, 905], [652, 905]], skin = { a: "#D99A6E", b: "#C98B62", c: "#B5774F", d: "#E2A77C" }[A.skin || "a"] || "#D99A6E";
    [0, 1].forEach(h => { const L = ev[h]; let e0 = null, e1 = null; for (const e of L){ if (e.T <= t) e0 = e; else { e1 = e; break; } }
      const D0 = e0 ? hitPt(e0.d) : [grip[h][0] + (h ? 40 : -40), 1000], D1 = e1 ? hitPt(e1.d) : D0; let tip;
      if (e0 && t - e0.T < .06) tip = D0.slice();
      else if (e1 && (!e0 || e1.T - e0.T < 1.6)){ const T0 = e0 ? e0.T + .06 : e1.T - .8, q = clamp((t - T0) / Math.max(.1, e1.T - T0), 0, 1), lift = 50 + 40 * clamp((e1.T - T0) / .8, 0, 1) + (e1.big ? 40 : 0);
        tip = [lerp(D0[0], D1[0], easeIO(q)), lerp(D0[1], D1[1], easeIO(q)) - Math.sin(Math.pow(q, .8) * Math.PI) * lift]; }
      else tip = [D0[0], D0[1] - 55 + Math.sin(t * 2 + h) * 6];
      if (ph && ph.bpm === 0) tip = [D0[0] + (h ? 20 : -20), D0[1] - 20 + Math.sin(t * 1.2 + h) * 4];
      const g = grip[h], dx = g[0] - tip[0], dy = g[1] - tip[1] + 30, dl = Math.hypot(dx, dy) || 1, hand = [tip[0] + dx / dl * 118, tip[1] + dy / dl * 118];
      const el = [sh[h][0] + (h ? 1 : -1) * 70, sh[h][1] + 50];
      ctx.lineCap = "round"; ctx.strokeStyle = A.shirt || "#2F6F73"; ctx.lineWidth = 24 * SC; ctx.beginPath(); ctx.moveTo(sh[h][0], sh[h][1]); ctx.lineTo(el[0], el[1]); ctx.lineTo(hand[0], hand[1]); ctx.stroke();
      ctx.strokeStyle = INK; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(hand[0] + (hand[0] - tip[0]) * .15, hand[1] + (hand[1] - tip[1]) * .15); ctx.lineTo(tip[0], tip[1]); ctx.stroke(); ctx.strokeStyle = "#E2B07A"; ctx.lineWidth = 8; ctx.stroke();
      ctx.beginPath(); ctx.arc(hand[0], hand[1], 14, 0, TAU); ctx.fillStyle = skin; ctx.fill();
      if (e0 && t - e0.T < .12 && !e0.soft){ ctx.strokeStyle = lineC(th, .6); ctx.lineWidth = 4; for (let k = 0; k < 3; k++){ const a = -Math.PI / 2 + (k - 1) * .6; ctx.beginPath(); ctx.moveTo(D0[0] + Math.cos(a) * 26, D0[1] + Math.sin(a) * 18); ctx.lineTo(D0[0] + Math.cos(a) * 50, D0[1] + Math.sin(a) * 34); ctx.stroke(); } } });
    // big hits: shock ring + notes
    hits.forEach(h => { const u = t - h.T, p = hitPt(h.d); ringFx(ctx, p[0], p[1], u, YEL, 30, 9); burst(ctx, p[0], p[1] - 20, u, M, 7); });
    // floating notes: from recent hits (colour = calm/chaos)
    ev.slice(0, 2).forEach((L, h) => L.forEach((e, j) => { if (j % 2) return; const u = t - e.T; if (u < 0 || u > 1.6) return; const p = hitPt(e.d), q = u / 1.6;
      ctx.save(); ctx.globalAlpha *= Math.sin(q * Math.PI) * .9; noteSym(ctx, p[0] + Math.sin(q * 5 + j) * 30 + (h ? 30 : -30), p[1] - 60 - q * 240, e.big ? 1.3 : .9, f.offbeat ? (j % 4 ? RED : STEEL) : (j % 4 ? th.accent : TEAL)); ctx.restore(); }));
    if (f.offbeat){ ctx.save(); ctx.strokeStyle = hexA(RED, .55); ctx.lineWidth = 5; for (let k = 0; k < 3; k++){ const x = 300 + k * 230, y = 760 + Math.sin(t * 3 + k) * 20; ctx.beginPath(); for (let j = 0; j <= 10; j++){ const xx = x + j * 14, yy = y + (j % 2 ? -12 : 12) * Math.sin(t * 8 + k); j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } ctx.restore(); }
    if (crashed){ confetti(ctx, DK.crash[0], DK.crash[1], t - TC, 28, 3, 460); if (f.crash.label) ptag(ctx, th, f.crash.label, 566, 708, TC + .2, t, { size: 38, maxW: 620, bg: GREEN, fg: "#fff", icon: f.crash.icon || "star" }); }
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { const { hits, phases, TC } = drumEvents(s, f, i); hits.forEach(h => add(h.T, "pop")); phases.forEach(p => add(p.T, "whoosh")); if (TC != null){ add(TC, "pop"); add(TC + .2, "chime"); } actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     sandcastle: a builder flips a bucket for every tower (slam, dust, the tower bounces up, flag + tag);
     each wave rolls up the beach: towers built before it crumble (tag drops, grey) unless strong:true.
       f: towers:[{label, cue, strong, icon}], waves:[{cue}] (or waveCue), end:{cue, label, tone, icon}, actor (builder, left)
     ===================================================================== */
  function sandTimes(s, f, i){ const T = timesOf(s, f.towers, .12, .16, i), W = (f.waves || (f.waveCue ? [{ cue: f.waveCue }] : [])).map((w, k) => at(s, w.cue, .65 + k * .1, i));
    return { T, W, TE: f.end ? at(s, f.end.cue, .9, i) : null }; }
  TT.layout("sandcastle", "Istana pasir & ombak", (ctx, th, s, t) => {
    const f = s.f, M = mv(), tw = f.towers || [], n = tw.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { T, W, TE } = sandTimes(s, f), BASE = 1236, SEA = 1012;
    const xs = n <= 1 ? [610] : n === 2 ? [530, 730] : n === 3 ? [460, 625, 790] : [420, 548, 676, 804].slice(0, n);
    const hgt = k => 165 + (k % 2) * 40 + (tw[k].strong ? 20 : 0);
    // sea front for a wave: rush in, hold, retreat
    const front = τ => { let y = SEA + Math.sin(τ * 1.6) * 6; W.forEach(Tw => { const u = τ - Tw; if (u < -.9 || u > 2.6) return; let q = 0;
      if (u < 0) q = -.04 * Math.sin((u + .9) / .9 * Math.PI); else if (u < .6) q = eOut(u / .6); else if (u < 1.0) q = 1; else q = 1 - easeIO((u - 1) / 1.6); y = Math.max(y, lerp(SEA, 1296, q)); }); return y; };
    const fy = front(t);
    // wave that destroys tower k (first wave after it was built, unless strong)
    const killT = k => { if (tw[k].strong) return null; const w = W.find(Tw => Tw > T[k] + .5); return w != null ? w + .35 : null; };
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t, { fx: 610, fy: 1050, push: [[TE, .05]], shakes: T.map(x => [x + .52, 6]).concat(W.map(x => [x + .3, 12])) });
    // sun, gull
    ctx.save(); ctx.translate(165, 655); ctx.rotate(t * .3); for (let k = 0; k < 10; k++){ ctx.rotate(TAU / 10); ctx.fillStyle = hexA(YEL, .7); ctx.beginPath(); ctx.moveTo(-8, -54); ctx.lineTo(0, -80 - 6 * Math.sin(t * 3 + k)); ctx.lineTo(8, -54); ctx.fill(); } ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = YEL; ctx.fill(); ctx.restore();
    { const gx = ((t * 85) % 1500) - 250, gy = 720 + Math.sin(t * 1.1) * 30, w = Math.sin(t * 9) * 16; ctx.strokeStyle = lineC(th, .8); ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(gx - 28, gy - w); ctx.quadraticCurveTo(gx - 12, gy - 8, gx, gy); ctx.quadraticCurveTo(gx + 12, gy - 8, gx + 28, gy - w); ctx.stroke(); }
    // beach window
    ctx.save(); rr(ctx, 70, 890, 940, 440, 40); ctx.clip();
    const sg = ctx.createLinearGradient(0, 890, 0, 1012); sg.addColorStop(0, "#3E95C4"); sg.addColorStop(1, "#6EC1E4"); ctx.fillStyle = sg; ctx.fillRect(70, 890, 940, 140);
    ctx.fillStyle = "#EED3A2"; ctx.fillRect(70, 1012, 940, 330);
    ctx.fillStyle = "rgba(190,150,100,.25)"; for (let k = 0; k < 60; k++){ ctx.beginPath(); ctx.arc(90 + (k * 157) % 900, 1030 + (k * 71) % 290, 3, 0, TAU); ctx.fill(); }
    // wet sand left by the latest retreat
    W.forEach(Tw => { const u = t - Tw; if (u < 1 || u > 6) return; ctx.fillStyle = `rgba(150,110,70,${(.3 * (1 - (u - 1) / 5)).toFixed(3)})`; ctx.fillRect(70, 1012, 940, 1290 - 1012); });
    // idle wave lines on the sea
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 4; for (let k = 0; k < 4; k++){ const y = 920 + k * 24, ofs = (t * (30 + k * 12)) % 120; ctx.beginPath(); for (let x = 60 - ofs; x < 1040; x += 120){ ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 30, y - 10, x + 60, y); } ctx.stroke(); }
    // crab
    { const run = W.some(Tw => t > Tw - .5 && t < Tw + 2), cx = 860 + Math.sin(t * (run ? 3 : .8)) * (run ? 60 : 90) + (run ? 60 : 0), cy = 1296; ctx.fillStyle = RED; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      for (let k = -2; k <= 2; k++){ if (!k) continue; ctx.beginPath(); ctx.moveTo(cx + k * 9, cy); ctx.lineTo(cx + k * 22, cy + 14 + Math.sin(t * 20 + k) * 4); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(cx, cy - 4, 26, 16, 0, 0, TAU); ctx.fill(); ctx.stroke(); [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(cx + d * 30, cy - 20 + Math.sin(t * 6 + d) * 4, 9, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx + d * 8, cy - 22, 5, 0, TAU); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(cx + d * 8, cy - 22, 2.5, 0, TAU); ctx.fill(); ctx.fillStyle = RED; }); }
    // towers
    tw.forEach((it, k) => { const x = xs[k], h0 = hgt(k), TT0 = T[k], rev = TT0 + .72; if (t < rev) return; const KT = killT(k), kq = KT != null ? eOut(ramp(t, KT, .7)) : 0;
      const sq = 1 + damp(t - rev, 22, 6) * .14, h = h0 * lerp(1, .22, kq) * sq, wB = 142 * (1 + kq * .4), wT = 106 * (1 - kq * .5);
      ctx.save(); ctx.translate(x, BASE);
      if (it.strong && t > rev) glow(ctx, 0, -h / 2, 140, YEL, (W.some(Tw => t > Tw + .3) ? .5 : .2) * (.75 + .25 * Math.sin(t * 4)));
      ctx.beginPath(); ctx.moveTo(-wB / 2, 0); ctx.lineTo(-wT / 2, -h); if (kq < .5){ for (let j = 0; j < 3; j++){ const x0 = -wT / 2 + j * wT / 3; ctx.lineTo(x0, -h - 18); ctx.lineTo(x0 + wT / 6, -h - 18); ctx.lineTo(x0 + wT / 6, -h); ctx.lineTo(x0 + wT / 3, -h); } } else ctx.quadraticCurveTo(0, -h - 30, wT / 2, -h);
      ctx.lineTo(wB / 2, 0); ctx.closePath(); ctx.fillStyle = it.strong ? "#E0B66E" : "#E9C58E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.stroke();
      ctx.fillStyle = "rgba(150,100,50,.22)"; ctx.beginPath(); ctx.moveTo(wB * .18, 0); ctx.lineTo(wT * .2, -h); ctx.lineTo(wT / 2, -h); ctx.lineTo(wB / 2, 0); ctx.closePath(); ctx.fill();
      if (kq < .4){ ctx.fillStyle = "#7A5A44"; ctx.beginPath(); ctx.moveTo(-12, -h * .3); ctx.lineTo(-12, -h * .5); ctx.arc(0, -h * .5, 12, Math.PI, 0); ctx.lineTo(12, -h * .3); ctx.closePath(); ctx.fill();
        if (it.strong){ ctx.strokeStyle = "#8A6D12"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-wB / 2 + 6, -14); ctx.lineTo(wB / 2 - 6, -14); ctx.stroke(); }
        const fh = -h - 18; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, fh); ctx.lineTo(0, fh - 46); ctx.stroke(); const wv = Math.sin(t * 6 + k) * 6;
        ctx.beginPath(); ctx.moveTo(0, fh - 46); ctx.quadraticCurveTo(18, fh - 46 + wv, 36, fh - 40); ctx.lineTo(0, fh - 30); ctx.closePath(); ctx.fillStyle = it.strong ? GREEN : CONF[k % CONF.length]; ctx.fill(); }
      ctx.restore();
      if (KT != null){ const u = t - KT; if (u > 0 && u < .9) for (let j = 0; j < 8; j++){ const a = -Math.PI * (j + .5) / 8, d = u * 160; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, BASE - h0 * .6 + Math.sin(a) * d * .6 + u * u * 300, 9 * (1 - u), 0, TAU); ctx.fillStyle = "#D8B27A"; ctx.fill(); } }
      if (it.strong && W.some(Tw => t > Tw + .35)) sparkles(ctx, x, BASE - h0 / 2, t, 5, 90, .9); });
    // water (over the beach, translucent so submerged towers still read) + foam front
    if (fy > SEA + 14){ ctx.save(); ctx.globalAlpha *= .62; ctx.beginPath(); ctx.moveTo(70, 1012); ctx.lineTo(1010, 1012); for (let x = 1010; x >= 70; x -= 20) ctx.lineTo(x, fy + Math.sin(x * .03 + t * 7) * 10); ctx.closePath(); ctx.fillStyle = "#6EC1E4"; ctx.fill(); ctx.restore();
      for (let x = 80; x < 1010; x += 34){ const yy = fy + Math.sin(x * .03 + t * 7) * 10; ctx.beginPath(); ctx.arc(x + Math.sin(t * 5 + x) * 6, yy, 13 + Math.sin(x + t * 9) * 4, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.fill(); }
      W.forEach(Tw => { const u = t - Tw; if (u < .2 || u > 1.1) return; xs.forEach((x, k) => { if (t < T[k]) return; for (let j = 0; j < 6; j++){ const a = -Math.PI / 2 + (j - 2.5) * .35, d = (u - .2) * 260; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, BASE - 80 + Math.sin(a) * d + (u - .2) * (u - .2) * 400, 8, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fill(); } }); }); }
    else { ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 9; ctx.beginPath(); for (let x = 70; x <= 1010; x += 20) { const yy = fy + Math.sin(x * .04 + t * 3) * 5; x > 70 ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
    // incoming big wave crest (anticipation)
    W.forEach(Tw => { const u = t - Tw; if (u < -.9 || u > .5) return; const q = u < 0 ? (u + .9) / .9 : 1 - u / .5, h = 70 * q; ctx.beginPath(); ctx.moveTo(70, 1012); for (let x = 70; x <= 1010; x += 30) ctx.lineTo(x, 1012 - h * (.7 + .3 * Math.sin(x * .02 + t * 4))); ctx.lineTo(1010, 1012); ctx.closePath(); ctx.fillStyle = "#3E95C4"; ctx.fill();
      for (let x = 80; x < 1010; x += 40){ ctx.beginPath(); ctx.arc(x, 1012 - h * (.7 + .3 * Math.sin(x * .02 + t * 4)), 10 * q + 2, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); } });
    ctx.restore();
    ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.3)" : hexA(INK, .15); ctx.lineWidth = 4; rr(ctx, 70, 890, 940, 440, 40); ctx.stroke();
    // bucket flips
    const A = Object.assign({ x: 200 }, f.actor || {}), SC = .86, GY = 1318;
    tw.forEach((it, k) => { const u = t - T[k]; if (u < 0 || u > 1.3) return; const x = xs[k], h0 = hgt(k); let bx, by, rot = Math.PI, al = 1;
      if (u < .4){ const q = u / .4; bx = lerp(300, x, q); by = lerp(1040, BASE - h0 - 90, q) - Math.sin(q * Math.PI) * 120; rot = q * Math.PI; }
      else if (u < .52){ bx = x; by = lerp(BASE - h0 - 90, BASE - h0 / 2 - 10, (u - .4) / .12); }
      else if (u < .72){ bx = x + Math.sin(u * 60) * 3; by = BASE - h0 / 2 - 10; }
      else { const q = (u - .72) / .58; bx = x + q * 80; by = BASE - h0 / 2 - 10 - q * 220; rot = Math.PI + q * 1.5; al = 1 - q; }
      ctx.save(); ctx.globalAlpha *= al; ctx.translate(bx, by); ctx.rotate(rot); const bh = h0 * .62 + 40; ctx.beginPath(); ctx.moveTo(-80, -bh / 2); ctx.lineTo(-60, bh / 2); ctx.lineTo(60, bh / 2); ctx.lineTo(80, -bh / 2); ctx.closePath(); ctx.fillStyle = k % 2 ? "#E8742C" : SKY; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -bh / 2, 76, Math.PI, 0); ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
      puff(ctx, x, BASE, u - .52, "#E3C08A", 8, 16, 110); });
    // tower labels (two staggered rows) with leader lines; washed-away ones drop and grey out
    tw.forEach((it, k) => { if (!it.label) return; const x = xs[k], y = 842 - (k % 2) * 72, KT = killT(k), gone = KT != null && t > KT, gq = gone ? eOut(ramp(t, KT, .8)) : 0; if (t < T[k]) return;
      ctx.save(); ctx.globalAlpha *= clamp((t - T[k] - .7) / .3, 0, 1) * (1 - gq * .45); ctx.setLineDash([6, 8]); ctx.strokeStyle = lineC(th, .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 24); ctx.lineTo(x, BASE - hgt(k) - 70); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.rotate(gq * (k % 2 ? .25 : -.25)); ctx.translate(-x, -y + gq * 40); ctx.globalAlpha *= 1 - gq * .35;
      ptag(ctx, th, it.label, x, y, T[k] + .1, t, { size: 26, maxW: 245, lines: 2, min: 16, bg: gone ? "#BDB3A6" : it.strong ? GREEN : "#FFFFFF", fg: gone || it.strong ? "#fff" : INK, stroke: gone || it.strong ? null : th.accent, icon: it.icon || (it.strong ? "shield" : null) }); ctx.restore(); });
    // builder
    const lastKill = tw.map((it, k) => killT(k)).filter(x => x != null && x <= t).pop();
    const P = hero(ctx, th, s, A, t, GY, SC, st => { const building = T.some(x => t > x - .1 && t < x + .8); autoAct(f.actor, st, building ? "work" : lastKill != null && t - lastKill < 3 ? "shrug" : "stand", lastKill != null && t - lastKill < 3 ? "shock" : building ? "smile" : null); },
      { hops: lastKill != null ? [[W.find(Tw => Tw + .35 === lastKill) != null ? lastKill : lastKill, 1, 40]] : [] });
    if (f.end){ ptag(ctx, th, f.end.label, 640, 1292, TE, t, toneTag(th, f.end.tone || "bad", { size: 34, maxW: 640, icon: f.end.icon || (f.end.tone === "good" ? "check" : "alert") })); if (f.end.tone === "good") confetti(ctx, 640, 1200, t - TE, 22, 2.4, 380); }
    personFx(ctx, th, P, t);
    ctx.restore();
  }, (s, f, i, add) => { const { T, W, TE } = sandTimes(s, f, i); T.forEach(x => { add(x, "whoosh"); add(x + .52, "pop"); }); W.forEach(x => add(x - .3, "whoosh")); if (TE != null) add(TE, f.end.tone === "good" ? "chime" : "pop"); actorSfx(s, f.actor, i, add); });

  /* =====================================================================
     hammock: a person sways in a hammock between two palms; worries float above as grey clouds and drift away
     at goCue (each pops); items pop in as glowing thought bubbles; sleepCue = zzz; wakeCue = hops out and lands
     standing, cheering. Leaves fall and butterflies flutter all the time.
       f: worries:[{label, icon}], goCue, items:[{label, cue, icon}], sleepCue, wakeCue, end:{cue, label, icon}, actor
     ===================================================================== */
  function hamTimes(s, f, i){ return { TI: timesOf(s, f.items, .3, .2, i), TG: f.goCue ? at(s, f.goCue, .5, i) : null, TS: f.sleepCue ? at(s, f.sleepCue, .5, i) : null, TW: f.wakeCue ? at(s, f.wakeCue, .8, i) : null, TE: f.end ? at(s, f.end.cue, .9, i) : null }; }
  function thoughtCloud(ctx, th, txt, x, y, s, o){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); o = o || {};
    font(ctx, 800, 30, th.fam); const r = fitLines(ctx, th, txt, 240, 30, 2, 800, 17), w = Math.max(...r.L.map(l => ctx.measureText(l).width)) + (o.icon ? 50 : 0), h = r.L.length * r.z * 1.2;
    const rx = w / 2 + 40, ry = h / 2 + 30;
    if (o.glow) glow(ctx, 0, 0, rx * 1.5, YEL, .45);
    ctx.fillStyle = o.bg || "#FFFFFF"; ctx.strokeStyle = o.stroke || INK; ctx.lineWidth = 4;
    ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = k * TAU / 10, bx = Math.cos(a) * rx * .82, by = Math.sin(a) * ry * .8; ctx.moveTo(bx + ry * .42, by); ctx.arc(bx, by, ry * .42, 0, TAU); } ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, rx * .88, ry * .86, 0, 0, TAU); ctx.fill(); ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = k * TAU / 10, bx = Math.cos(a) * rx * .82, by = Math.sin(a) * ry * .8; ctx.moveTo(bx + ry * .42 * Math.cos(a - 1.2), by + ry * .42 * Math.sin(a - 1.2)); ctx.arc(bx, by, ry * .42, a - 1.2, a + 1.2); } ctx.stroke();
    let x0 = -w / 2; if (o.icon){ icon(ctx, o.icon, x0, -20, 40, o.fg || th.accent, 2.6); x0 += 50; }
    font(ctx, 800, r.z, th.fam); ctx.fillStyle = INK; r.L.forEach((l, k) => ctx.fillText(l, x0, r.z * .36 + (k - (r.L.length - 1) / 2) * r.z * 1.2));
    ctx.restore(); return { rx: rx * s, ry: ry * s }; }
  TT.layout("hammock", "Tempat tidur gantung", (ctx, th, s, t) => {
    const f = s.f, M = mv(), ws = f.worries || [], its = f.items || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { TI, TG, TS, TW, TE } = hamTimes(s, f), woke = TW != null && t >= TW, sleeping = TS != null && t >= TS && !woke;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    stage(ctx, t, { fx: 545, fy: 1020, push: [[TS, .04], [TE, .04]], shakes: woke ? [[TW + .9, 9]] : [] });
    // ground + palms
    ctx.beginPath(); ctx.ellipse(545, 1318, 470, 30, 0, 0, TAU); ctx.fillStyle = dark(th) ? "rgba(111,165,90,.4)" : "#BFD9A8"; ctx.fill();
    const palm = (x, d) => { ctx.lineCap = "round"; ctx.strokeStyle = INK; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(x, 1318); ctx.quadraticCurveTo(x - d * 40, 1000, x + d * 20, 700); ctx.stroke(); ctx.strokeStyle = "#A0703F"; ctx.lineWidth = 36; ctx.stroke();
      ctx.strokeStyle = "rgba(59,36,24,.35)"; ctx.lineWidth = 3; for (let k = 0; k < 10; k++){ const q = k / 10, px = (1 - q) * (1 - q) * x + 2 * q * (1 - q) * (x - d * 40) + q * q * (x + d * 20), py = (1 - q) * (1 - q) * 1318 + 2 * q * (1 - q) * 1000 + q * q * 700; ctx.beginPath(); ctx.moveTo(px - 17, py); ctx.lineTo(px + 17, py - 6); ctx.stroke(); }
      for (let k = 0; k < 6; k++){ const a = -Math.PI / 2 + (k - 2.5) * .55 + Math.sin(t * 1.6 + k + x) * .07; ctx.save(); ctx.translate(x + d * 20, 700); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(80, -36, 165, 10); ctx.quadraticCurveTo(80, 6, 0, 0); ctx.fillStyle = k % 2 ? "#4E8A43" : "#6FA55A"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
      [-1, 1].forEach(j => { ctx.beginPath(); ctx.arc(x + d * 20 + j * 14, 716, 15, 0, TAU); ctx.fillStyle = "#7A5A44"; ctx.fill(); }); };
    palm(150, 1); palm(940, -1);
    // hammock group (sways; swings harder once released)
    const free = woke ? Math.exp(-(t - TW - .5) * .4) : 0, sw = Math.sin(t * 1.25) * (1 + 3 * free), PIV = [545, 950];
    const LA = [176, 960], RA = [916, 960], FL = [290, 1044], FR = [800, 1044];
    ctx.save(); ctx.translate(PIV[0], PIV[1]); ctx.rotate(sw * .03); ctx.translate(-PIV[0] + sw * 8, -PIV[1]);
    ctx.strokeStyle = "#7A5A44"; ctx.lineWidth = 6; [[LA, FL], [RA, FR]].forEach(([a, b]) => { for (let k = -1; k <= 1; k++){ ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1] + k * 14); ctx.stroke(); } });
    ctx.beginPath(); ctx.moveTo(FL[0], FL[1]); ctx.quadraticCurveTo(545, 1128, FR[0], FR[1]); ctx.quadraticCurveTo(545, 1252, FL[0], FL[1]); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill();
    ctx.save(); ctx.clip(); for (let k = 0; k < 9; k++){ ctx.fillStyle = k % 2 ? th.accent : TEAL; ctx.fillRect(250 + k * 64, 1030, 30, 240); } ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    // actor lying (before waking)
    const A = Object.assign({}, f.actor || {}), SC = .86, BX = 565, BY = 1066;
    let P = null, headW = null;
    if (!woke || t < TW + .9){
      const q = woke ? clamp((t - TW) / .9, 0, 1) : 0, ang = lerp(-Math.PI / 2 + .05, 0, eOut(q)), lift = Math.sin(q * Math.PI) * 150;
      const cx = lerp(BX, 560, q), cy = lerp(BY, 1318 - 205 * SC, q) - lift;
      if (q > 0){ ctx.restore(); ctx.save(); }
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); const breathe = Math.sin(t * (sleeping ? 1.6 : 2.3)) * .02;
      ctx.scale(1, 1 + breathe);
      P = hero(ctx, th, s, Object.assign({}, A, { x: 0 }), t, 205 * SC, SC, st => { st.x = 0; st.walking = false; st.sit = false; autoAct(f.actor, st, q > 0 ? "cheer" : "think", sleeping ? "tired" : woke ? "happy" : (TG != null && t >= TG) ? "happy" : ws.length ? "worried" : "smile"); }, { shadow: false });
      ctx.restore();
      if (P && P.r){ const hx = P.r.headX, hy = P.r.headTop + 50 * SC, c = Math.cos(ang), sn = Math.sin(ang); headW = [cx + hx * c - hy * sn, cy + hx * sn + hy * c]; }
      if (q === 0){ ctx.strokeStyle = "#7A5A44"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(FL[0] + 10, FL[1] + 22); ctx.quadraticCurveTo(545, 1196, FR[0] - 10, FR[1] + 22); ctx.stroke(); }
    }
    ctx.restore();
    if (woke && t >= TW + .9){ P = hero(ctx, th, s, Object.assign({ x: 560 }, A), t, 1318, SC, st => { st.x = 560; autoAct(f.actor, st, "cheer", "happy"); }, { hops: [[TW + 1.2, 2, 70]] }); headW = P && P.r ? [P.r.headX, P.r.headTop + 30] : null; puff(ctx, 560, 1318, t - TW - .9, "#D9CFC2", 8, 16, 110); }
    // zzz while sleeping
    if (sleeping && headW) emoteAt(ctx, th, "zzz", headW[0] + 30, headW[1] - 70, 1, t);
    // worries: grey clouds that drift away at goCue
    const slot = k => [k % 2 ? 770 : 320, 728 + Math.floor(k / 2) * 178 + (k % 2) * 18];
    ws.forEach((w, k) => { const [x0, y0] = slot(k), q0 = popAt(t, .25 + k * .15, .45); if (!q0) return; const u = TG != null ? t - TG - k * .25 : -1;
      if (u > 1.1) { puff(ctx, x0 + 1.1 * 280, y0 - 1.1 * 230, u - 1.1, "#D9D2CA", 7, 16, 70); return; }
      const x = x0 + (u > 0 ? u * 280 : Math.sin(t * 1.2 + k) * 10), y = y0 + (u > 0 ? -u * 230 : Math.sin(t * 1.6 + k * 2) * 8), sc = q0 * (u > 0 ? 1 - u * .45 : 1);
      ctx.save(); ctx.globalAlpha *= u > 0 ? clamp(1.1 - u, 0, 1) : 1;
      if (headW && u <= 0 && k === ws.length - 1) for (let j = 0; j < 3; j++){ ctx.beginPath(); ctx.arc(lerp(headW[0], x, (j + 1) / 4), lerp(headW[1] - 40, y + 50, (j + 1) / 4), 7 + j * 4, 0, TAU); ctx.fillStyle = "#E9E4DE"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); }
      thoughtCloud(ctx, th, w.label, x, y, sc * .9, { bg: "#E9E4DE", icon: w.icon || "alert", fg: RED }); ctx.restore(); });
    // good thoughts / ideas
    its.forEach((it, k) => { if (t < TI[k]) return; const [x, y0] = slot(ws.length + k), q = eBack(clamp((t - TI[k]) / .45, 0, 1)), y = y0 + Math.sin(t * 1.5 + k) * 8;
      if (headW && t - TI[k] < 1.2) for (let j = 0; j < 3; j++){ ctx.beginPath(); ctx.arc(lerp(headW[0], x, (j + 1) / 4), lerp(headW[1] - 40, y + 50, (j + 1) / 4), 7 + j * 4, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); }
      thoughtCloud(ctx, th, it.label, x, y, q * .9, { glow: true, icon: it.icon || "sparkles", fg: GREEN }); burst(ctx, x, y, t - TI[k], M, 8); });
    // falling leaves + butterflies
    for (let k = 0; k < 3; k++){ const per = 5 + k, q = ((t + k * 1.9) % per) / per, x = 200 + k * 300 + Math.sin(q * 9 + k) * 50, y = 720 + q * 600; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(q * 12 + k) * 1.2); ctx.globalAlpha *= Math.sin(q * Math.PI);
      ctx.beginPath(); ctx.ellipse(0, 0, 18, 8, 0, 0, TAU); ctx.fillStyle = k % 2 ? "#E8A317" : "#6FA55A"; ctx.fill(); ctx.restore(); }
    for (let k = 0; k < 2; k++){ const bx = 545 + Math.sin(t * .6 + k * 3) * 360, by = 860 + Math.sin(t * 1.3 + k) * 90 + k * 140, wf = Math.abs(Math.sin(t * 14 + k)); ctx.save(); ctx.translate(bx, by);
      ctx.fillStyle = k ? "#E86A9A" : "#7CC4E8"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 12 * wf, -4, 12 * wf + 2, 15, d * .4, 0, TAU); ctx.fill(); }); ctx.fillStyle = INK; ctx.fillRect(-2, -12, 4, 20); ctx.restore(); }
    if (f.end) ptag(ctx, th, f.end.label, 545, 1286, TE, t, { size: 34, maxW: 640, bg: GREEN, fg: "#fff", icon: f.end.icon || "check" });
    if (f.end && TE != null) confetti(ctx, 545, 1180, t - TE - .1, 20, 2.4, 360);
    if (P && headW){ P.r = { headX: headW[0], headTop: headW[1] - 30 }; personFx(ctx, th, P, t); }
    ctx.restore();
  }, (s, f, i, add) => { const { TI, TG, TS, TW, TE } = hamTimes(s, f, i); (f.worries || []).forEach((w, k) => add(.25 + k * .15, "pop")); if (TG != null) (f.worries || []).forEach((w, k) => add(TG + k * .25 + 1.1, "pop")); TI.forEach(x => add(x, "pop"));
    if (TS != null) add(TS, "whoosh"); if (TW != null){ add(TW, "whoosh"); add(TW + .9, "pop"); } if (TE != null) add(TE, "chime"); actorSfx(s, f.actor, i, add); });
})();
