/* Scene pack j2611221424512: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for KD40, JS40, SC40, MS40, SB41.
   Layout prefix j2611221424512_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     env      also own interiors: "kayu" (carpentry workshop), "pabrik" (factory gate at night), "dapur" (big kitchen),
              "toko" (bright product showroom)
     shots    [{at|cue, env, envOpt, toons, cam, props, cards, piece:false, ...}]  hard cut (cream flash) to a new shot
     hold     [{on, kind, at|cue, outCue, s, dx, dy, rot, text, ring}]  object in a toon's hand:
              phone, saw, tape, pencil, letter, sketch, pen, spoon, cup, envelope, box, card, bag
     bots     [{x, y, s, at|cue, outCue, mood, keys:[{at|cue, x, y, mood, dur}], type, chop}]  the AI assistant robot
     badges   [{on, at|cue, outCue, text, col}]  chip over a toon's head     pops [{at|cue, text, x, y, size, rot, col}]
     stamps   [{at|cue, text, x, y, col}]   confetti {at|cue}     helmets [{on, strap:{cue, buckled}}]
   Set pieces (layout suffix) are documented at each TT.scene below. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221424512_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", SKY = "#6FB3D9", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const pin = (t, a) => t < a ? 0 : eBack(clamp((t - a) / .35, 0, 1));
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47],
    scratch: [21, -76], cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = (st) => { const h = HANDS[st.pose] || HANDS.idle; return lp(st, h[0] + 2, h[1]); };
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function textL(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.fillText(txt, x, y); }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, Math.min(1, a))); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); fit(ctx, txt, 820, size, 900, 30); const sz = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
    const w = ctx.measureText(txt).width + sz * .9, h = sz * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, sz * .36); ctx.textAlign = "left"; ctx.restore(); }
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; const hold = o.hold || 1.1; if (k < 0 || k > hold) return; const a = 1 - clamp((k - hold + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 110; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; if (maxW) size = fit(ctx, txt, maxW, size, 800); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function puffC(ctx, x, y, r, col){ ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; ctx.moveTo(x + Math.cos(a) * r * .6 + r * .55, y + Math.sin(a) * r * .45); ctx.arc(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .45, r * .55, 0, TAU); } ctx.fillStyle = col; ctx.fill(); }
  function check(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(16, -13); ctx.stroke(); ctx.restore(); }
  function cross(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || RED; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(12, 12); ctx.moveTo(12, -12); ctx.lineTo(-12, 12); ctx.stroke(); ctx.restore(); }
  function ringCircle(ctx, x, y, rx, ry, k, col){ if (k < 0) return; const q = clamp(k / .45, 0, 1); ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -.05, -1.9, -1.9 + TAU * 1.05 * eOut(q)); ctx.stroke(); ctx.restore(); }
  function speedLines(ctx, x0, x1, y0, y1, t, a, col){ ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col || "#FFFFFF"; ctx.lineCap = "round";
    for (let i = 0; i < 14; i++){ const y = y0 + rnd(i) * (y1 - y0), L = 80 + rnd(i + 3) * 160, x = x1 - ((t * 1400 + rnd(i + 7) * 2000) % (x1 - x0 + L)); ctx.lineWidth = 4 + rnd(i + 2) * 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L, y); ctx.stroke(); } ctx.restore(); }
  function dust(ctx, x, y, k, n, col){ if (k < 0 || k > 1.2) return; ctx.save(); for (let i = 0; i < (n || 10); i++){ const a = Math.PI + rnd(i) * Math.PI, r = 30 + k * (120 + rnd(i + 4) * 160); ctx.globalAlpha = (1 - k / 1.2) * .8;
      puffC(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * .5 - k * 40, 22 + k * 30, col || "#E9DCC8"); } ctx.restore(); }

  /* ---------- objects (world coordinates; origin = hand / standing point) ---------- */
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (kind === "phone"){ ctx.rotate(-.15); if (o.glow) glowAt(ctx, 0, -40, 160, "#9FD8FF", .45 + .15 * Math.sin(t * 9)); rr(ctx, -34, -100, 68, 124, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
      rr(ctx, -26, -90, 52, 98, 8); ctx.fillStyle = o.glow ? "#BFE6FF" : "#5B6B7E"; ctx.fill();
      if (o.ring){ ctx.strokeStyle = HL; ctx.lineWidth = 6; for (let i = 0; i < 3; i++){ const q = (t * 2 + i / 3) % 1; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.arc(0, -40, 60 + q * 90, -1.1, -.3); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -40, 60 + q * 90, Math.PI + .3, Math.PI + 1.1); ctx.stroke(); } ctx.globalAlpha = 1;
        ctx.save(); ctx.translate(Math.sin(t * 60) * 3, 0); rr(ctx, -20, -76, 40, 40, 10); ctx.fillStyle = GREEN; ctx.fill(); ctx.restore(); } }
    else if (kind === "saw"){ const sw = o.saw ? Math.sin(t * 16) * 26 : 0; ctx.translate(sw, 0); ctx.rotate(.35);
      ctx.beginPath(); ctx.moveTo(10, -20); ctx.lineTo(250, -8); ctx.lineTo(250, 18); ctx.lineTo(10, 34); ctx.closePath(); ctx.fillStyle = "#C9CED6"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); for (let i = 0; i < 14; i++){ const xx = 20 + i * 16.5; ctx.moveTo(xx, 32 - i * .9); ctx.lineTo(xx + 8, 42 - i * .9); ctx.lineTo(xx + 16, 31 - i * .9); } ctx.strokeStyle = "#8E959E"; ctx.lineWidth = 3; ctx.stroke();
      rr(ctx, -50, -36, 70, 74, 18); ctx.fillStyle = "#B5562A"; ctx.fill(); ol(ctx, 4); rr(ctx, -34, -18, 36, 36, 10); ctx.fillStyle = "#3B2418"; ctx.fill(); }
    else if (kind === "tape"){ ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill();
      const L = o.len || 0; if (L > 0){ ctx.fillStyle = "#F9E27A"; ctx.fillRect(30, 30, L, 22); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(30, 30, L, 22);
        ctx.fillStyle = BROWN; for (let xx = 40; xx < 30 + L; xx += 20) ctx.fillRect(xx, 30, 2, xx % 100 < 20 ? 14 : 8); ctx.fillStyle = "#8E959E"; ctx.fillRect(28 + L, 24, 8, 34); } }
    else if (kind === "pencil"){ ctx.rotate(.6 + (o.write ? Math.sin(t * 14) * .12 : 0)); rr(ctx, -12, -90, 24, 140, 4); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.moveTo(-12, 50); ctx.lineTo(12, 50); ctx.lineTo(0, 78); ctx.closePath(); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#E07A9B"; ctx.fillRect(-12, -100, 24, 14); }
    else if (kind === "pen"){ ctx.rotate(.5 + (o.write ? Math.sin(t * 18) * .15 : 0)); rr(ctx, -10, -80, 20, 120, 8); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 4); ctx.fillStyle = GOLD; ctx.fillRect(-10, -60, 20, 8);
      ctx.beginPath(); ctx.moveTo(-8, 40); ctx.lineTo(8, 40); ctx.lineTo(0, 62); ctx.closePath(); ctx.fillStyle = "#C9CED6"; ctx.fill(); ol(ctx, 3); }
    else if (kind === "letter" || kind === "sketch"){ ctx.rotate(-.08); rr(ctx, -70, -100, 140, 180, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      if (kind === "sketch"){ ctx.strokeStyle = TEAL; ctx.lineWidth = 4; ctx.strokeRect(-40, -66, 80, 100); ctx.beginPath(); ctx.moveTo(-40, -32); ctx.lineTo(40, -32); ctx.moveTo(-40, 2); ctx.lineTo(40, 2); ctx.stroke(); textC(ctx, o.text || "40 cm", 0, 62, 22, ORANGE, 900); }
      else { for (let i = 0; i < 6; i++){ ctx.fillStyle = i ? "#C9B79E" : ORANGE; ctx.fillRect(-50, -76 + i * 24, i ? 100 - (i % 3) * 18 : 60, 9); } } }
    else if (kind === "spoon"){ ctx.rotate(-.6); ctx.fillStyle = "#C9CED6"; rr(ctx, -6, -10, 12, 120, 6); ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.ellipse(0, -30, 22, 30, 0, 0, TAU); ctx.fill(); ol(ctx, 4); }
    else if (kind === "cup"){ rr(ctx, -34, -70, 68, 74, 12); ctx.fillStyle = o.col || "#FFFDF8"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(38, -36, 16, -1.4, 1.4); ctx.lineWidth = 7; ctx.strokeStyle = OUT; ctx.stroke();
      for (let i = 0; i < 3; i++){ const q = (t * .7 + i / 3) % 1; ctx.save(); ctx.globalAlpha = .7 * Math.sin(q * Math.PI); puffC(ctx, -12 + i * 14 + Math.sin(q * 6 + i) * 8, -90 - q * 90, 14 + q * 14, "#FFFFFF"); ctx.restore(); } }
    else if (kind === "envelope"){ rr(ctx, -90, -60, 180, 120, 10); ctx.fillStyle = o.col || "#F3D9B5"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-90, -60); ctx.lineTo(0, 6); ctx.lineTo(90, -60); ol(ctx, 4);
      if (o.text) textC(ctx, o.text, 0, 44, 26, BROWN, 900, 160); }
    else if (kind === "box"){ rr(ctx, -70, -110, 140, 130, 10); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 5); rr(ctx, -46, -80, 92, 40, 8); ctx.fillStyle = CREAM; ctx.fill(); sparkle(ctx, 40, -100, 16 + 4 * Math.sin(t * 6), GOLD); }
    else if (kind === "card"){ rr(ctx, -110, -70, 220, 120, 14); ctx.fillStyle = o.col || PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, o.text || "", 0, 4, 34, o.ink || BROWN, 900, 190); }
    else if (kind === "bag"){ rr(ctx, -70, -60, 140, 120, 18); ctx.fillStyle = o.col || "#5A4A6B"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -60, 34, Math.PI, 0); ctx.stroke(); ctx.fillStyle = GOLD; ctx.fillRect(-52, -16, 104, 6); }
    ctx.restore(); }

  /* ---------- the AI assistant robot (world, origin = body centre) ---------- */
  function bot(ctx, x, y, s, t, o){
    o = o || {}; const mood = o.mood || "happy", f = o.face || 1, bob = Math.sin(t * 3.4 + x * .01) * 10;
    ctx.save(); ctx.translate(x, y + bob); ctx.scale(s * f, s); ctx.lineJoin = "round"; ctx.lineCap = "round";
    // jet glow
    ctx.save(); ctx.globalAlpha = .55 + .2 * Math.sin(t * 20); ctx.fillStyle = "#9FE3FF"; ctx.beginPath(); ctx.moveTo(-30, 70); ctx.lineTo(30, 70); ctx.lineTo(0, 120 + Math.sin(t * 30) * 10); ctx.closePath(); ctx.fill(); ctx.restore();
    // arms
    const arm = (side, ex, ey) => { ctx.strokeStyle = "#8A97A8"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(side * 82, 10); ctx.quadraticCurveTo(side * 110, 40, ex, ey); ctx.stroke(); ctx.beginPath(); ctx.arc(ex, ey, 14, 0, TAU); ctx.fillStyle = "#E9EEF2"; ctx.fill(); ol(ctx, 4); };
    if (o.type){ arm(-1, -70 + Math.sin(t * 40) * 10, 80); arm(1, 70 + Math.cos(t * 38) * 10, 80); }
    else if (o.chop){ arm(-1, -100, 60); const c = Math.abs(Math.sin(t * 22)); arm(1, 120, 20 + c * 60);
      ctx.save(); ctx.translate(120, 20 + c * 60); ctx.rotate(-.2); rr(ctx, -6, -4, 90, 30, 6); ctx.fillStyle = "#D8DDE3"; ctx.fill(); ol(ctx, 3); rr(ctx, -40, 0, 36, 18, 6); ctx.fillStyle = BROWN; ctx.fill(); ctx.restore(); }
    else if (mood === "shrug"){ arm(-1, -140, -30 + Math.sin(t * 5) * 6); arm(1, 140, -30 - Math.sin(t * 5) * 6); }
    else if (o.give){ arm(-1, -100, 60); arm(1, 150, -10); }
    else { arm(-1, -110, 50 + Math.sin(t * 4) * 8); arm(1, 110, 50 - Math.sin(t * 4) * 8); }
    // antenna
    ctx.strokeStyle = "#8A97A8"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, -78); ctx.lineTo(0, -118); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -124, 14, 0, TAU); ctx.fillStyle = (t * 2) % 1 < .5 ? HL : GOLD; ctx.fill(); ol(ctx, 4); if ((t * 2) % 1 < .5) glowAt(ctx, 0, -124, 46, HL, .6);
    // body
    rr(ctx, -95, -80, 190, 158, 44); ctx.fillStyle = "#E9EEF2"; ctx.fill(); ol(ctx, 7);
    ctx.save(); rr(ctx, -95, -80, 190, 158, 44); ctx.clip(); ctx.fillStyle = "rgba(43,26,18,.08)"; ctx.fillRect(-95, 40, 190, 50); ctx.restore();
    rr(ctx, -72, -60, 144, 92, 26); ctx.fillStyle = "#1F2A3A"; ctx.fill(); ol(ctx, 4);
    // face
    const blink = ((t + x * .003) % 3.3) < .12; ctx.strokeStyle = "#7FF0FF"; ctx.fillStyle = "#7FF0FF"; ctx.lineWidth = 8;
    [-1, 1].forEach(d => { const ex = d * 30, ey = -22;
      if (blink){ ctx.beginPath(); ctx.moveTo(ex - 12, ey); ctx.lineTo(ex + 12, ey); ctx.stroke(); }
      else if (mood === "happy" || mood === "busy"){ ctx.beginPath(); ctx.arc(ex, ey + 6, 13, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
      else if (mood === "sad"){ ctx.beginPath(); ctx.arc(ex, ey - 8, 13, Math.PI * .1, Math.PI * .9); ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(ex, ey, mood === "shock" ? 15 : 11, 0, TAU); ctx.fill(); } });
    ctx.beginPath(); if (mood === "shrug"){ ctx.moveTo(-18, 12); ctx.lineTo(-6, 6); ctx.lineTo(6, 12); ctx.lineTo(18, 6); } else if (mood === "sad"){ ctx.arc(0, 18, 14, Math.PI * 1.15, Math.PI * 1.85); } else if (mood === "shock"){ ctx.arc(0, 10, 9, 0, TAU); } else { ctx.arc(0, 2, 16, Math.PI * .15, Math.PI * .85); } ctx.stroke();
    // chest tag
    rr(ctx, -30, 42, 60, 28, 10); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 3); ctx.save(); ctx.scale(f, 1); textC(ctx, "AI", 0, 64, 22, "#FFFFFF", 900); ctx.restore();
    if (mood === "busy"){ for (let i = 0; i < 3; i++){ const q = (t * 3 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - q; ctx.fillStyle = "#7FF0FF"; ctx.font = "900 26px Poppins"; ctx.fillText(["01", "10", "11"][i], 70 + q * 50, -60 - q * 60); ctx.restore(); } }
    ctx.restore();
    return { x, y: y + bob, top: y + bob - 140 * s };
  }

  /* ---------- motorbike (world; geometry follows the rider) ---------- */
  function motor(ctx, x, t, o){
    o = o || {}; const s = o.s || 1, f = o.face || 1, wr = 92 * s, spin = o.spin || 0, col = o.col || "#2F6F73";
    ctx.save(); ctx.translate(x, GY); ctx.scale(f, 1); ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(0, 4, 330 * s, 22 * s, 0, 0, TAU); ctx.fill();
    const wheel = (wx) => { ctx.beginPath(); ctx.arc(wx, -wr, wr, 0, TAU); ctx.fillStyle = "#2B2430"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(wx, -wr, wr * .55, 0, TAU); ctx.fillStyle = "#B8BEC8"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = "#6E7480"; ctx.lineWidth = 6 * s; for (let i = 0; i < 5; i++){ const a = spin + i * TAU / 5; ctx.beginPath(); ctx.moveTo(wx, -wr); ctx.lineTo(wx + Math.cos(a) * wr * .5, -wr + Math.sin(a) * wr * .5); ctx.stroke(); } };
    wheel(-230 * s); wheel(230 * s);
    // body
    ctx.beginPath(); ctx.moveTo(-300 * s, -150 * s); ctx.quadraticCurveTo(-250 * s, -250 * s, -120 * s, -250 * s); ctx.lineTo(60 * s, -250 * s); ctx.quadraticCurveTo(110 * s, -180 * s, 60 * s, -130 * s);
    ctx.lineTo(-40 * s, -120 * s); ctx.quadraticCurveTo(-60 * s, -60 * s, -130 * s, -70 * s); ctx.lineTo(-270 * s, -100 * s); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = hexA("#FFFFFF", .25); ctx.beginPath(); ctx.ellipse(-150 * s, -210 * s, 90 * s, 18 * s, -.1, 0, TAU); ctx.fill();
    // seat
    rr(ctx, -250 * s, -290 * s, 270 * s, 46 * s, 22 * s); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
    // front: leg shield + fork + handlebar
    ctx.beginPath(); ctx.moveTo(70 * s, -250 * s); ctx.quadraticCurveTo(170 * s, -300 * s, 180 * s, -420 * s); ctx.lineTo(230 * s, -410 * s); ctx.quadraticCurveTo(220 * s, -200 * s, 120 * s, -120 * s); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.strokeStyle = "#6E7480"; ctx.lineWidth = 14 * s; ctx.beginPath(); ctx.moveTo(205 * s, -400 * s); ctx.lineTo(230 * s, -wr); ctx.stroke();
    const gx = o.grip ? o.grip[0] : 150 * s, gy = o.grip ? o.grip[1] : -470 * s;
    ctx.strokeStyle = "#3B3A3F"; ctx.lineWidth = 12 * s; ctx.beginPath(); ctx.moveTo(205 * s, -430 * s); ctx.lineTo(gx, gy); ctx.stroke();
    ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.moveTo(215 * s, -440 * s); ctx.lineTo(250 * s, -520 * s); ctx.stroke(); ctx.beginPath(); ctx.ellipse(258 * s, -530 * s, 18 * s, 12 * s, 0, 0, TAU); ctx.fillStyle = "#B8D8E8"; ctx.fill(); ol(ctx, 3);
    // headlight
    rr(ctx, 215 * s, -440 * s, 50 * s, 44 * s, 14 * s); ctx.fillStyle = o.light ? "#FFF6C8" : "#E9E2D6"; ctx.fill(); ol(ctx, 4);
    if (o.light){ ctx.save(); ctx.globalAlpha = .35; const g = ctx.createLinearGradient(260 * s, 0, 900 * s, 0); g.addColorStop(0, "#FFF2B8"); g.addColorStop(1, "rgba(255,242,184,0)"); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(260 * s, -440 * s); ctx.lineTo(900 * s, -520 * s); ctx.lineTo(900 * s, -60 * s); ctx.lineTo(260 * s, -396 * s); ctx.closePath(); ctx.fill(); ctx.restore(); }
    // tail light
    ctx.beginPath(); ctx.ellipse(-300 * s, -160 * s, 14 * s, 10 * s, 0, 0, TAU); ctx.fillStyle = o.brake ? "#FF3B2E" : "#B5352B"; ctx.fill(); if (o.brake) glowAt(ctx, -300 * s, -160 * s, 120 * s, "#FF3B2E", .6);
    ctx.restore();
    return { seatY: GY - 290 * s };
  }

  /* ---------- own interiors ---------- */
  const MYENV = {};
  function sunbeam(ctx, x, y, w, h, t, a){ ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#FFF4D8"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w + h * .6, y + h); ctx.lineTo(x + h * .6, y + h); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = a * 2.2; ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 18; i++){ const q = (t * .05 + rnd(i)) % 1, px = x + rnd(i + 3) * w + q * h * .6, py = y + q * h; ctx.beginPath(); ctx.arc(px + Math.sin(t + i) * 8, py, 3, 0, TAU); ctx.fill(); } ctx.restore(); }
  MYENV.kayu = (ctx, c, t, o) => {
    layer(ctx, c, .35, () => {
      ctx.fillStyle = "#A8693D"; ctx.fillRect(-3000, -3000, 7080, 7000);
      for (let x = -1800; x < 2900; x += 110){ const k = Math.round(x / 110); ctx.fillStyle = k % 2 ? "#B47444" : "#A86A3C"; ctx.fillRect(x, -2000, 106, 4000); ctx.fillStyle = "#6E3F20"; ctx.fillRect(x + 106, -2000, 4, 4000);
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x + 40 + rnd(k) * 30, 500 + rnd(k + 3) * 700, 8, 14, 0, 0, TAU); ctx.fill(); }
      // window
      const wx = o.winX ?? 90, wy = 360, ww = 380, wh = 460; ctx.fillStyle = "#9DCFDC"; ctx.fillRect(wx, wy, ww, wh); ctx.fillStyle = "#CFE6C0"; ctx.fillRect(wx, wy + wh * .62, ww, wh * .38);
      puffC(ctx, wx + ((t * 20) % (ww + 200)) - 100, wy + 120, 60, "rgba(255,255,255,.9)");
      ctx.strokeStyle = "#5A3A22"; ctx.lineWidth = 20; ctx.strokeRect(wx, wy, ww, wh); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
      // tool board (silhouettes)
      const bx = o.boardX ?? 640; rr(ctx, bx, 400, 380, 330, 12); ctx.fillStyle = "#D9B98E"; ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = "rgba(90,58,34,.35)"; for (let i = 0; i < 7; i++) for (let j = 0; j < 6; j++) { ctx.beginPath(); ctx.arc(bx + 30 + i * 54, 430 + j * 52, 4, 0, TAU); ctx.fill(); }
      ctx.save(); ctx.translate(bx + 80, 470); ctx.rotate(Math.sin(t * 1.3) * .03); ctx.fillStyle = "#5A3A22"; rr(ctx, -10, 0, 20, 160, 6); ctx.fill(); rr(ctx, -40, -10, 80, 34, 8); ctx.fillStyle = "#6E7480"; ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(bx + 200, 460); ctx.rotate(Math.sin(t * 1.1 + 1) * .03); ctx.fillStyle = "#6E7480"; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.lineTo(60, 120); ctx.lineTo(-60, 150); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#B5562A"; rr(ctx, -90, -10, 40, 60, 10); ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(bx + 310, 470); ctx.rotate(Math.sin(t * 1.5 + 2) * .04); ctx.strokeStyle = "#5A3A22"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 150); ctx.stroke(); ctx.fillStyle = GOLD; ctx.fillRect(-14, 110, 28, 50); ctx.restore();
      // planks leaning
      for (let i = 0; i < 4; i++){ ctx.save(); ctx.translate((o.planksX ?? -150) + i * 46, GY - 120); ctx.rotate(-.12 + i * .02); ctx.fillStyle = i % 2 ? "#E2B57E" : "#D6A56C"; rr(ctx, -20, -760, 40, 760, 6); ctx.fill(); ol(ctx, 4); ctx.restore(); }
      ctx.fillStyle = "#6E3F20"; ctx.fillRect(-3000, GY - 150, 7080, 26);
    });
    layer(ctx, c, 1, () => { ctx.fillStyle = "#D9B486"; ctx.fillRect(-3000, GY - 126, 7080, 2000); ctx.strokeStyle = "rgba(110,63,32,.25)"; ctx.lineWidth = 4;
      for (let y = GY - 80; y < GY + 600; y += 70){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(4080, y); ctx.stroke(); }
      ctx.fillStyle = "#F3DDB6"; for (let i = 0; i < 40; i++){ ctx.beginPath(); ctx.ellipse(-200 + rnd(i) * 1600, GY - 60 + rnd(i + 5) * 400, 10 + rnd(i + 2) * 16, 4, rnd(i) * 3, 0, TAU); ctx.fill(); } });
    sunbeam(ctx, 300, 0, 320, 1700, t, .12);
    // hanging lamp
    layer(ctx, c, .6, () => { const lx = o.lampX ?? 560, sw = Math.sin(t * 1.4) * .08; ctx.save(); ctx.translate(lx, -200); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 520); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-70, 590); ctx.lineTo(70, 590); ctx.lineTo(30, 520); ctx.lineTo(-30, 520); ctx.closePath(); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 4); glowAt(ctx, 0, 610, 220, "#FFE7B0", .5); ctx.restore(); });
  };
  MYENV.pabrik = (ctx, c, t, o) => {
    layer(ctx, c, .1, () => { const g = ctx.createLinearGradient(0, -600, 0, GY); g.addColorStop(0, "#0E1530"); g.addColorStop(1, "#3A2C4E"); ctx.fillStyle = g; ctx.fillRect(-3000, -3000, 7080, 7000);
      for (let i = 0; i < 60; i++){ ctx.globalAlpha = .3 + .7 * Math.abs(Math.sin(t * 1.3 + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(-600 + rnd(i) * 2300, -300 + rnd(i + 9) * 1100, 2.6, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
      ctx.fillStyle = "#FFF0D6"; glowAt(ctx, 860, 300, 180, "#FFE7C0", .35); ctx.beginPath(); ctx.arc(860, 300, 56, 0, TAU); ctx.fill(); });
    layer(ctx, c, .45, () => { const bx = o.factoryX ?? -200, by = GY - 200;
      ctx.fillStyle = "#2A2638"; ctx.fillRect(bx, by - 760, 1500, 760);
      ctx.beginPath(); for (let i = 0; i < 6; i++){ ctx.moveTo(bx + i * 250, by - 760); ctx.lineTo(bx + i * 250 + 125, by - 880); ctx.lineTo(bx + i * 250 + 250, by - 760); } ctx.fill();
      for (let j = 0; j < 3; j++) for (let i = 0; i < 12; i++){ const on = rnd(i * 7 + j) > .3; ctx.fillStyle = on ? "#F4C27A" : "#3E3850"; ctx.fillRect(bx + 40 + i * 120, by - 680 + j * 170, 80, 100); if (on) glowAt(ctx, bx + 80 + i * 120, by - 630 + j * 170, 90, "#F4C27A", .18); }
      const cx = bx + 1200; ctx.fillStyle = "#3A3348"; ctx.fillRect(cx, by - 1200, 90, 500); ctx.fillStyle = "#C2691F"; ctx.fillRect(cx, by - 1150, 90, 30);
      for (let i = 0; i < 5; i++){ const q = (t * .25 + i / 5) % 1; ctx.save(); ctx.globalAlpha = .45 * (1 - q); puffC(ctx, cx + 45 + q * 260, by - 1220 - q * 360, 50 + q * 80, "#8C88A0"); ctx.restore(); } });
    layer(ctx, c, .8, () => { // fence + gate posts + security post
      ctx.strokeStyle = "#5B5470"; ctx.lineWidth = 8; for (let x = -1200; x < 2400; x += 60){ if (x > (o.gateX ?? 380) - 250 && x < (o.gateX ?? 380) + 250) continue; ctx.beginPath(); ctx.moveTo(x, GY - 140); ctx.lineTo(x, GY - 520); ctx.stroke(); }
      ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-1200, GY - 480); ctx.lineTo(2400, GY - 480); ctx.stroke();
      const gx = o.gateX ?? 380; ctx.fillStyle = "#4A4360"; ctx.fillRect(gx - 290, GY - 700, 60, 560); ctx.fillRect(gx + 230, GY - 700, 60, 560); ctx.fillStyle = "#6B6385"; ctx.fillRect(gx - 290, GY - 760, 580, 80);
      font(ctx, 900, 40, FAM); ctx.fillStyle = "#FFD08A"; ctx.textAlign = "center"; ctx.fillText(o.gateText || "AREA PABRIK", gx, GY - 706); ctx.textAlign = "left";
      [gx - 260, gx + 260].forEach((lx, n) => { glowAt(ctx, lx, GY - 790, 160, "#FFD08A", .45 + .1 * Math.sin(t * 3 + n)); ctx.fillStyle = "#FFE3A8"; ctx.beginPath(); ctx.arc(lx, GY - 790, 18, 0, TAU); ctx.fill(); }); });
    layer(ctx, c, 1, () => { ctx.fillStyle = "#3A3442"; ctx.fillRect(-3000, GY - 140, 7080, 2000); ctx.fillStyle = "#4A4352"; ctx.fillRect(-3000, GY - 140, 7080, 20);
      ctx.fillStyle = "rgba(255,255,255,.12)"; for (let x = -1200; x < 2400; x += 260) ctx.fillRect(x, GY + 120, 140, 12); });
  };
  MYENV.dapur = (ctx, c, t, o) => {
    layer(ctx, c, .35, () => { ctx.fillStyle = "#F7EFE2"; ctx.fillRect(-3000, -3000, 7080, 7000);
      ctx.strokeStyle = "rgba(160,120,90,.25)"; ctx.lineWidth = 3; for (let x = -1000; x < 2200; x += 90){ ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, GY); ctx.stroke(); } for (let y = 300; y < GY; y += 90){ ctx.beginPath(); ctx.moveTo(-1000, y); ctx.lineTo(2200, y); ctx.stroke(); }
      ctx.fillStyle = "#2F6F73"; ctx.fillRect(-3000, -3000, 7080, 3300); ctx.fillStyle = "#C2691F"; ctx.fillRect(-3000, 290, 7080, 18);
      // hood + shelf with pots
      ctx.fillStyle = "#C9CED6"; ctx.beginPath(); ctx.moveTo(300, 420); ctx.lineTo(780, 420); ctx.lineTo(860, 640); ctx.lineTo(220, 640); ctx.closePath(); ctx.fill(); ol(ctx, 6); ctx.fillRect(440, 300, 200, 120);
      rr(ctx, -150, 720, 380, 26, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 4); rr(ctx, 860, 720, 380, 26, 8); ctx.fill(); ol(ctx, 4);
      [[-80, "#C2691F"], [60, "#2F6F73"], [930, "#D9483B"], [1080, "#E8A55B"]].forEach(([px, col], n) => { ctx.save(); ctx.translate(px, 720); ctx.rotate(Math.sin(t * 2 + n) * .03); rr(ctx, -55, -90, 110, 90, 16); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.fillRect(-70, -84, 140, 12); ctx.restore(); });
      // hanging ladles
      for (let i = 0; i < 4; i++){ ctx.save(); ctx.translate(380 + i * 110, 650); ctx.rotate(Math.sin(t * 2.2 + i) * .12); ctx.strokeStyle = "#8A97A8"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 120); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 140, 22, 0, Math.PI); ctx.stroke(); ctx.restore(); }
      for (let i = 0; i < 4; i++){ const q = (t * .3 + i / 4) % 1; ctx.save(); ctx.globalAlpha = .4 * Math.sin(q * Math.PI); puffC(ctx, 540 + Math.sin(q * 5 + i) * 60, 900 - q * 300, 40 + q * 40, "#FFFFFF"); ctx.restore(); } });
    layer(ctx, c, 1, () => { ctx.fillStyle = "#E3D3BE"; ctx.fillRect(-3000, GY - 100, 7080, 2000); ctx.fillStyle = "rgba(0,0,0,.06)"; for (let x = -1000; x < 2200; x += 160) for (let y = GY - 100; y < GY + 500; y += 160) if (((x + y) / 160) % 2 === 0) ctx.fillRect(x, y, 160, 160); });
  };
  MYENV.toko = (ctx, c, t, o) => {
    layer(ctx, c, .35, () => { ctx.fillStyle = "#F9E9D2"; ctx.fillRect(-3000, -3000, 7080, 7000); ctx.fillStyle = "#E8A55B"; ctx.fillRect(-3000, 260, 7080, 60);
      // garland
      for (let i = 0; i < 24; i++){ const x = -400 + i * 90; ctx.fillStyle = [ORANGE, TEAL, GOLD, RED][i % 4]; ctx.beginPath(); ctx.moveTo(x, 330); ctx.lineTo(x + 70, 330); ctx.lineTo(x + 35, 400 + Math.sin(t * 2 + i) * 6); ctx.closePath(); ctx.fill(); }
      // shelves with product boxes
      [[-200, 0], [760, 1]].forEach(([sx, n]) => { for (let r = 0; r < 3; r++){ const y = 620 + r * 230; ctx.fillStyle = "#8E5A34"; ctx.fillRect(sx, y, 520, 22);
          for (let b = 0; b < 4; b++){ const col = ["#2F6F73", "#C2691F", "#5B7DB1", "#7FA563", "#D9483B"][(b + r + n * 2) % 5], h = 110 + rnd(b + r * 4 + n * 20) * 60; rr(ctx, sx + 20 + b * 125, y - h, 100, h, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4);
            rr(ctx, sx + 36 + b * 125, y - h + 22, 68, 26, 6); ctx.fillStyle = CREAM; ctx.fill(); } } });
      // banner
      rr(ctx, 360, 420, 360, 150, 16); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 6); textC(ctx, o.banner || "PRODUK BARU", 540, 515, 46, ORANGE, 900, 320);
      ctx.fillStyle = "#E9D6BC"; ctx.fillRect(-3000, GY - 200, 7080, 60); });
    layer(ctx, c, 1, () => { ctx.fillStyle = "#F1E3CF"; ctx.fillRect(-3000, GY - 140, 7080, 2000); ctx.strokeStyle = "rgba(120,90,60,.18)"; ctx.lineWidth = 3; for (let x = -1000; x < 2200; x += 140){ ctx.beginPath(); ctx.moveTo(x, GY - 140); ctx.lineTo(x - 80, GY + 500); ctx.stroke(); } });
    for (let i = 0; i < 10; i++){ const q = (t * .1 + rnd(i)) % 1; ctx.save(); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); sparkle(ctx, 100 + rnd(i + 2) * 880, 1400 - q * 1000, 8 + rnd(i) * 6, "#FFFFFF"); ctx.restore(); }
  };
  function anyEnv(ctx, kind, t, c, o){ if (MYENV[kind]) MYENV[kind](ctx, c, t, o || {}); else env(ctx, kind, t, c, o); }
  function anyFront(ctx, kind, t, c, o){ if (!MYENV[kind]) envFront(ctx, kind, t, c, o); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function keyPath(s, o, t, idx, init){ // generic x/y/mood keys
    const st = Object.assign({ x: o.x ?? 540, y: o.y ?? 1000, s: o.s ?? 1, mood: o.mood || "happy", mv: false }, init || {});
    (o.keys || []).map((k, j) => Object.assign({ T: tOf(s, k, .2 + j * .1, idx) }, k)).sort((a, b) => a.T - b.T).forEach(k => {
      if (t < k.T) return; const d = k.dur || .7, q = clamp((t - k.T) / d, 0, 1), e = easeIO(q);
      if (k.x != null){ st.x = lerp(st.x, k.x, e); } if (k.y != null){ st.y = lerp(st.y, k.y, e); } if (k.s != null){ st.s = lerp(st.s, k.s, e); } if (k.mood) st.mood = k.mood; if (k.type != null) st.type = k.type; if (k.chop != null) st.chop = k.chop; if (k.give != null) st.give = k.give; if (k.face) st.face = k.face; if (q > 0 && q < 1) st.mv = true; });
    return st; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    if (H.mod) H.mod(sts, f, shotT);
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + sitD + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 1000, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    const piece = f.piece !== false;
    anyEnv(ctx, E, t, c, eo);
    const R = { c, f, piece, shotT, sts, bots: [] };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const holds = (f.hold || []).map((h) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      const r = R[j];
      if (r) layer(ctx, c, 1, () => {
        if (a.mhelmet){ const k = r.k, fc = st.face || 1, R0 = 23 * k, a0 = Math.asin(.42); ctx.save(); ctx.translate(r.headX - fc * 1.5 * k, r.headY); ctx.scale(fc, 1);
          ctx.beginPath(); ctx.arc(0, 0, R0, Math.PI + a0, TAU - a0); ctx.lineTo(R0 * .92, -R0 * .42 + 3 * k); ctx.lineTo(-R0 * 1.02, -R0 * .42 + 9 * k); ctx.closePath(); ctx.fillStyle = a.mhelmet; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.4 * k; ctx.stroke();
          ctx.beginPath(); ctx.ellipse(-R0 * .35, -R0 * .72, R0 * .3, R0 * .12, -.4, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fill();
          rr(ctx, -R0 * .1, -R0 * .42 - 2 * k, R0 * 1.1, 4.4 * k, 2.2 * k); ctx.fillStyle = "#2C2433"; ctx.fill(); ctx.stroke(); ctx.restore(); }
        holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
          drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0) - (st.y - r.y), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: ["card", "envelope", "letter", "sketch", "box"].includes(h.kind) ? 1 : (h.flip ? -(st.face || 1) : (st.face || 1)), rot: (h.rot || 0) })); });
      });
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    (f.bots || []).forEach((b, j) => items.push({ z: b.z ?? .3, j: 60 + j, draw: () => {
      const T0 = b.cue || b.at != null ? tOf(s, b, .2, idx) : -1, O = b.outCue ? T(s, b.outCue, .5, idx) : 1e9; if (t < T0 || t > O + .4) return;
      const ks = keyPath(s, b, t, idx, { type: b.type, chop: b.chop, give: b.give, face: b.face }), q = T0 < 0 ? 1 : eBack(clamp((t - T0) / .45, 0, 1)), oq = 1 - clamp((t - O) / .4, 0, 1);
      layer(ctx, c, 1, () => { ctx.save(); ctx.globalAlpha *= oq; if (T0 >= 0 && t - T0 < .5) burstFx(ctx, ks.x, ks.y, t - T0, SKY, 10, 120);
        ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.beginPath(); ctx.ellipse(ks.x, b.floor ?? GY, 80 * ks.s * q, 14 * q, 0, 0, TAU); if (b.shadow !== false) ctx.fill();
        R.bots[j] = bot(ctx, ks.x, ks.y, ks.s * q, t, { mood: ks.mood, type: ks.type, chop: ks.chop, give: ks.give, face: ks.face || 1 }); ctx.restore(); });
      if (b.say && R.bots[j]){ (Array.isArray(b.say) ? b.say : [b.say]).forEach(sy => { const ts = tOf(s, sy, .3, idx); if (t >= ts && t < ts + (sy.dur || 2.2)){ const p = c.toScreen(R.bots[j].x, R.bots[j].top); TT.CS.ov.push(() => TT.bubble(ctx, sy.text, p[0], p[1], t - ts, { kind: sy.kind || "say", t, size: 44 })); } }); }
    } }));
    (f.motors || []).forEach((m, j) => items.push({ z: m.z ?? -.5, j: 70 + j, draw: () => {
      const T0 = m.cue || m.at != null ? tOf(s, m, .2, idx) : -1; if (t < T0) return; const ks = keyPath(s, m, t, idx, {}), fc = m.face || 1;
      let grip = null; if (m.rider != null && sts[m.rider] && sts[m.rider].pose === "sit"){ const h = handOf(sts[m.rider]); grip = [(h[0] - ks.x) * fc, h[1] - GY]; }
      const sp = m.spinCue ? Math.max(0, t - T(s, m.spinCue, .3, idx)) : (m.spin ? t : 0), stop = m.brakeCue ? T(s, m.brakeCue, .3, idx) : 1e9;
      const ang = (t < stop ? sp : Math.max(0, stop - (m.spinCue ? T(s, m.spinCue, .3, idx) : 0)) + (1 - Math.exp(-(t - stop) * 4)) / 4) * (m.spinRate || 9);
      layer(ctx, c, 1, () => { R.motors = R.motors || []; R.motors[j] = motor(ctx, ks.x, t, { s: m.s || 1, face: fc, grip, light: m.light, brake: t >= stop || m.brake, spin: ang, col: m.col }); }); } }));
    (f.straps || []).forEach((sp, j) => items.push({ z: 5, j: 80 + j, draw: () => { const r = R[sp.on ?? 0], st = sts[sp.on ?? 0]; if (!r) return; const bk = sp.buckleCue ? t >= T(s, sp.buckleCue, .3, idx) : !!sp.buckled;
      layer(ctx, c, 1, () => { const k = r.k, fc = st.face || 1, hx = r.headX, hy = r.headY; ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 2.4 * k;
        if (bk){ ctx.beginPath(); ctx.moveTo(hx - 13 * k * fc, hy + 2 * k); ctx.quadraticCurveTo(hx, hy + 20 * k, hx + 13 * k * fc, hy + 2 * k); ctx.stroke(); ctx.fillStyle = GOLD; ctx.fillRect(hx - 2.5 * k, hy + 13.5 * k, 5 * k, 3.5 * k); }
        else { const sw = Math.sin(t * 7) * .35; [[-1, 0], [1, 1]].forEach(([d, n]) => { const ax = hx + d * 13 * k * fc, ay = hy + 2 * k; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + Math.sin(sw + n) * 6 * k, ay + 12 * k); ctx.stroke();
            if (n) { ctx.fillStyle = GOLD; ctx.fillRect(ax + Math.sin(sw + n) * 6 * k - 2.5 * k, ay + 11 * k, 5 * k, 3.5 * k); } }); }
        ctx.restore(); }); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) anyFront(ctx, E, t, c, eo);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.badges || []).forEach((b, n) => { const T0 = tOf(s, b, .3 + n * .05, idx), O = b.outCue ? T(s, b.outCue, .6, idx) : 1e9; if (t < T0 || t > O) return; const r = R[b.on ?? 0]; if (!r || !r.screen) return;
      const p = r.screen.top; ovs.push(() => popChip(ctx, b.text, clamp(p[0] + (b.dx || 0), 200, 880), Math.max(230, p[1] - 70 + (b.dy || 0)), t - T0, b.col || ORANGE, "#FFFFFF", b.size || 34, (b.rot ?? -3) * Math.PI / 180)); });
    (f.stamps || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .1, idx); if (t < T0) return; const O = p.outCue ? T(s, p.outCue, .5, idx) : 1e9; if (t > O) return;
      ovs.push(() => { stampBox(ctx, p.text, p.x ?? 540, p.y ?? 600, t - T0, p.col || ORANGE, p.size || 60, (p.rot ?? -8) * Math.PI / 180); burstFx(ctx, p.x ?? 540, p.y ?? 600, t - T0 - .1, p.col || HL, 12, 200); }); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f };
  }
  function sfxBase(s, f0, i, add){
    const all = [f0].concat(f0.shots || []);
    all.forEach((f, n) => {
      const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
      if (n > 0) add(tOf(s, f, .2, i), "whoosh");
      (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
      (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
      if (n === 0 || f.cards !== f0.cards) (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
      (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
      (f.hold || []).forEach(h => { if (h.cue) add(tOf(s, h, .2, i), "pop"); });
      (f.bots || []).forEach(b => { if (b.cue || b.at != null) add(tOf(s, b, .2, i), "whoosh"); });
      (f.badges || []).forEach((b, n2) => { if (b.cue) add(tOf(s, b, .3 + n2 * .05, i), "pop"); });
      (f.stamps || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i) + .05, "chime"));
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }
  const sfxWith = (fn) => (s, f, i, add) => { sfxBase(s, f, i, add); fn(s, f, i, add); };
  const SH = (s, t) => shotOf(s, t).F;   // active shot data

  /* ================= _adegan: generic story shot with the shared extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, robot asisten AI, chip, kata pop, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* =====================================================================================================
     KD40 "AI itu asisten"
     ===================================================================================================== */
  // floating offer letter (world). o: {title, rows:[{label, val, state: bad|ok|fixed|struck, fix}], sign 0..1, scan 0..1, wob}
  function offerLetter(ctx, x, y, w, t, o){
    o = o || {}; const rows = o.rows || [], h = 170 + rows.length * 86 + 120, x0 = x - w / 2, y0 = y; const P = {};
    ctx.save(); ctx.translate(x, y + h / 2); ctx.rotate((o.rot ?? -.015) + Math.sin(t * 1.6) * .006); ctx.translate(-x, -(y + h / 2));
    ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, x0 + 14, y0 + 18, w, h, 18); ctx.fill();
    rr(ctx, x0, y0, w, h, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
    ctx.fillStyle = ORANGE; rr(ctx, x0, y0, w, 26, 18); ctx.fill();
    textL(ctx, o.title || "SURAT PENAWARAN", x0 + 40, y0 + 100, 44, BROWN, 900, w - 80);
    ctx.fillStyle = "#E3C9A6"; ctx.fillRect(x0 + 40, y0 + 124, w - 80, 4);
    rows.forEach((r, i) => { const ry = y0 + 190 + i * 86; P[i] = [x0 + w / 2, ry - 14];
      const bad = r.state === "bad", ok = r.state === "ok" || r.state === "fixed";
      if (bad){ ctx.fillStyle = hexA(RED, .12 + .08 * Math.sin(t * 10)); rr(ctx, x0 + 24, ry - 56, w - 48, 74, 12); ctx.fill(); }
      if (ok){ ctx.fillStyle = hexA(GREEN, .12); rr(ctx, x0 + 24, ry - 56, w - 48, 74, 12); ctx.fill(); }
      textL(ctx, r.label, x0 + 44, ry, 34, "#8A5A3E", 700, 230);
      const val = r.state === "fixed" && r.fix ? r.fix : r.val;
      textL(ctx, val, x0 + 270, ry, 38, bad ? RED : BROWN, 900, w - 380);
      if (r.state === "struck"){ font(ctx, 900, 38, FAM); const ww = Math.min(w - 380, ctx.measureText(val).width); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0 + 262, ry - 12); ctx.lineTo(x0 + 278 + ww * (r.sq ?? 1), ry - 14); ctx.stroke(); }
      if (ok) check(ctx, x0 + w - 60, ry - 14, 1.6 * (r.ck ?? 1), GREEN); });
    // signature line
    const sy = y0 + h - 60; ctx.strokeStyle = "#C9B79E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + w - 330, sy); ctx.lineTo(x0 + w - 50, sy); ctx.stroke();
    textL(ctx, "Hormat kami,", x0 + 44, sy - 6, 30, "#8A5A3E", 700);
    if ((o.sign || 0) > 0){ ctx.save(); ctx.beginPath(); ctx.rect(x0 + w - 330, sy - 120, 280 * o.sign, 140); ctx.clip(); ctx.strokeStyle = NAVY; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath();
      const sx = x0 + w - 320; ctx.moveTo(sx, sy - 20); ctx.bezierCurveTo(sx + 30, sy - 110, sx + 60, sy - 100, sx + 50, sy - 20); ctx.bezierCurveTo(sx + 70, sy - 70, sx + 110, sy - 70, sx + 110, sy - 24);
      ctx.bezierCurveTo(sx + 140, sy - 60, sx + 170, sy - 40, sx + 180, sy - 26); ctx.bezierCurveTo(sx + 200, sy - 70, sx + 230, sy - 60, sx + 260, sy - 30); ctx.stroke(); ctx.restore();
      if (o.sign >= 1) textL(ctx, o.signName || "RAKA", x0 + w - 300, sy + 38, 28, BROWN, 900); }
    P.sign = [x0 + w - 190, sy - 40];
    if (o.scan > 0 && o.scan < 1){ const yy = y0 + 140 + o.scan * (h - 200); ctx.fillStyle = hexA(SKY, .35); ctx.fillRect(x0 + 10, yy - 30, w - 20, 60); ctx.strokeStyle = hexA("#2E7FB8", .9); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0 + 10, yy); ctx.lineTo(x0 + w - 10, yy); ctx.stroke(); }
    ctx.restore(); P.h = h; return P;
  }

  /* _robot: office afternoon; the AI robot pops out of the laptop, types at lightning speed, the floating draft fills in seconds
     f.ai {deskX, sheetX, sheetY, popCue, draftCue, doneCue, timerCue, timerText} */
  TT.scene(PX + "robot", "Cerita: robot asisten AI melompat dari laptop, draf surat terisi kilat", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ deskX: 790, sheetX: 600, sheetY: 330, timerText: "10 DETIK" }, f.ai || {});
    const tPop = T(s, A.popCue, .3, idx), tDraft = T(s, A.draftCue, .3, idx), tDone = T(s, A.doneCue, .5, idx), tTimer = T(s, A.timerCue, .3, idx);
    const lapX = A.deskX - 40, lapY = GY - 290 - 70;
    base(ctx, s, t, { env: "office",
      spots: { lap: [lapX, lapY - 60, 1.3], sheet: [A.sheetX, A.sheetY + 300, 1.0] },
      back: () => {
        prop(ctx, "desk", A.deskX, GY, { laptop: true, mug: true, papers: 3 }, t);
        if (t >= tPop - .1 && t < tPop + .6){ const k = (t - tPop + .1) / .7; glowAt(ctx, lapX, lapY, 260 * (1 - k * .5), "#BFF4FF", .8 * (1 - k)); }
        // the draft sheet: appears after the pop, fills between draftCue and doneCue
        const tIn = Math.min(tDraft, tPop + .8); if (t < tIn) return; const q = eBack(clamp((t - tIn) / .45, 0, 1));
        const p = ramp(t, tIn + .2, tDone), n = 9, x0 = A.sheetX - 280, y0 = A.sheetY, SS = A.sheetS || 1.15;
        ctx.save(); ctx.translate(A.sheetX, y0 + 240); ctx.scale(q * SS, q * SS); ctx.rotate(-.02 + Math.sin(t * 1.5) * .01); ctx.translate(-A.sheetX, -(y0 + 240));
        rr(ctx, x0, y0, 560, 480, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7); ctx.fillStyle = ORANGE; rr(ctx, x0, y0, 560, 24, 18); ctx.fill();
        textL(ctx, "DRAF SURAT", x0 + 36, y0 + 84, 40, BROWN, 900, 300);
        for (let i = 0; i < n; i++){ const lq = clamp(p * n - i, 0, 1); if (lq <= 0) break; const L = (i % 3 === 2 ? 300 : 460) * lq; ctx.fillStyle = i === 0 ? hexA(ORANGE, .85) : "#C9B79E"; rr(ctx, x0 + 36, y0 + 120 + i * 36, L, 14, 7); ctx.fill();
          if (lq < 1){ ctx.fillStyle = TEAL; ctx.fillRect(x0 + 40 + L, y0 + 114 + i * 36, 6, 26); } }
        if (t >= tDone){ const k = t - tDone; glowAt(ctx, A.sheetX, y0 + 240, 420, GOLD, .35 * Math.max(0, 1 - k * .5) + .1); check(ctx, x0 + 490, y0 + 70, 2.2 * eBack(clamp(k / .35, 0, 1)), GREEN);
          for (let i = 0; i < 6; i++){ const a = t * 1.5 + i; sparkle(ctx, A.sheetX + Math.cos(a) * 320, y0 + 240 + Math.sin(a) * 270, 14 + 6 * Math.sin(t * 6 + i), i % 2 ? GOLD : "#FFFFFF"); } }
        ctx.restore();
        // paper bits streaming from the robot to the sheet while drafting
        if (t > tIn && t < tDone){ for (let i = 0; i < 8; i++){ const qq = (t * 2.2 + i / 8) % 1, bx = lerp(A.deskX + 40, A.sheetX + 100, qq), by = lerp(GY - 560, y0 + 300, qq) - Math.sin(qq * Math.PI) * 160;
          ctx.save(); ctx.translate(bx, by); ctx.rotate(qq * 6 + i); ctx.fillStyle = i % 2 ? PAPER : "#BFF4FF"; ctx.fillRect(-16, -11, 32, 22); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(-16, -11, 32, 22); ctx.restore(); } }
      },
      over: () => {
        if (t >= tTimer && t < tDone + 2.5){ const k = t - tTimer, n = Math.min(10, Math.floor(ramp(t, tTimer, tDone) * 10 + (t >= tDone ? 10 : 0)));
          ctx.save(); ctx.translate(830, 300); const q = eBack(clamp(k / .35, 0, 1)); ctx.scale(q, q); ctx.rotate(.05);
          ctx.beginPath(); ctx.arc(0, 0, 92, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 8); rr(ctx, -16, -122, 32, 30, 6); ctx.fillStyle = BROWN; ctx.fill();
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 76, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, n / 10)); ctx.closePath(); ctx.fillStyle = hexA(HL, .35); ctx.fill();
          ctx.strokeStyle = BROWN; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * 9) * 60, -Math.cos(t * 9) * 60); ctx.stroke();
          ctx.restore(); popChip(ctx, n >= 10 ? A.timerText : n + " DETIK", 830, 430, k - .1, ORANGE, "#FFFFFF", 34, .04); }
      } });
  }, sfxWith((s, f, i, add) => { const A = f.ai || {}; if (A.popCue) add(cueT(s, A.popCue, .3, i), "pop"); if (A.doneCue) add(cueT(s, A.doneCue, .5, i), "chime"); if (A.timerCue) add(cueT(s, A.timerCue, .3, i), "ping"); }));

  /* _kirim: the finger hovers over a giant KIRIM button; a colleague reads over the shoulder, two errors light up red with a siren
     f.send {letterX, letterY, w, btnX, btnY, rows, errs:[{row, cue, label}], pressCue, stopCue, sirenCue} */
  TT.scene(PX + "kirim", "Cerita: jari di atas tombol KIRIM, rekan membaca, kesalahan menyala merah + sirene", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ letterX: 560, letterY: 250, w: 680, btnX: 640, btnY: 1250 }, f.send || {});
    const tStop = T(s, A.stopCue, .4, idx), tPress = T(s, A.pressCue, .3, idx), tSiren = T(s, A.sirenCue, .4, idx);
    const errs = (A.errs || []).map((e, n) => Object.assign({ T: T(s, e.cue, .3 + n * .1, idx) }, e));
    let P = {};
    base(ctx, s, t, { env: "office", envOpt: { plantX: 980 },
      spots: { btn: [A.btnX - 80, A.btnY - 120, 1.35], letter: [A.letterX, A.letterY + 330, 1.12] },
      back: () => {
        const rows = (A.rows || []).map((r, i) => { const e = errs.find(z => z.row === i); return Object.assign({}, r, { state: e && t >= e.T ? "bad" : r.state }); });
        if (t >= tSiren){ const on = Math.sin((t - tSiren) * 14) > 0; glowAt(ctx, A.letterX, A.letterY + 330, 640, on ? RED : "#FF8A3A", .3); }
        P = offerLetter(ctx, A.letterX, A.letterY, A.w, t, { rows, sign: 0 });
        errs.forEach(e => { if (t < e.T || !P[e.row]) return; ringCircle(ctx, P[e.row][0], P[e.row][1], A.w * .5, 52, t - e.T, RED); });
      },
      front: () => { // the KIRIM button
        const pressed = t >= tPress && t < tStop, hover = pressed ? .5 + .5 * Math.sin((t - tPress) * 9) : 0, x = A.btnX, y = A.btnY;
        glowAt(ctx, x, y, 240, HL, .25 + .2 * hover);
        ctx.fillStyle = "#8E3F14"; rr(ctx, x - 170, y - 50, 340, 120, 40); ctx.fill(); ol(ctx, 6);
        const dy = t >= tStop ? 0 : 8 * hover; rr(ctx, x - 170, y - 80 + dy, 340, 120, 40); ctx.fillStyle = t >= tStop ? "#9AA6B2" : ORANGE; ctx.fill(); ol(ctx, 6);
        textC(ctx, "KIRIM", x + 26, y + 2 + dy, 56, "#FFFFFF", 900); icon(ctx, "rocket", x - 100, y - 20 + dy, 50, "#FFFFFF", 6);
        if (t >= tStop){ const k = t - tStop; ctx.save(); ctx.globalAlpha = clamp(k / .2, 0, 1); cross(ctx, x + 150, y - 90, 2.4 * eBack(clamp(k / .3, 0, 1)), RED); ctx.restore(); }
      },
      over: (c2, c, sts, R) => {
        errs.forEach((e, n) => { if (t < e.T || !P[e.row]) return; const p = R.c.toScreen(A.letterX + A.w * .5 - 70, P[e.row][1] - 70); popChip(ctx, e.label, clamp(p[0], 200, 880), p[1], t - e.T - .15, RED, "#FFFFFF", 34, .06 - n * .1); });
        if (t >= tSiren){ const k = t - tSiren; [[150, 230], [930, 230]].forEach(([x, y], n) => { const a = (t * 8 + n * Math.PI) % TAU; ctx.save(); ctx.translate(x, y); const q = eBack(clamp(k / .3, 0, 1)); ctx.scale(q, q);
          ctx.save(); ctx.globalAlpha = .5; ctx.fillStyle = "#FF5A4A"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 260, a - .35, a + .35); ctx.closePath(); ctx.fill(); ctx.restore();
          ctx.beginPath(); ctx.arc(0, 6, 46, Math.PI, 0); ctx.closePath(); ctx.fillStyle = "#FF3B2E"; ctx.fill(); ol(ctx, 5); rr(ctx, -58, 6, 116, 24, 8); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 4); ctx.restore(); }); }
      } });
  }, sfxWith((s, f, i, add) => { const A = f.send || {}; (A.errs || []).forEach((e, n) => add(cueT(s, e.cue, .3 + n * .1, i), "ping")); if (A.stopCue) add(cueT(s, A.stopCue, .4, i), "pop"); if (A.sirenCue) add(cueT(s, A.sirenCue, .4, i), "ping"); }));

  /* _dapur: imagination kitchen; the robot sous-chef chops at lightning speed, does not know the price, scoots off when the
     complaint arrives; the human chef (chef hat) holds the responsibility
     f.kitchen {chef (toon idx), boardX, bowlX, chopCue, priceCue, blameCue, plate} */
  function chefHat(ctx, r, t){ const k = r.k; ctx.save(); ctx.translate(r.headX - r.face * 1 * k, r.top + 3 * k); ctx.scale(k * .78, k * .78);
    ctx.fillStyle = "#FFFFFF"; rr(ctx, -17, -9, 34, 12, 3); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.beginPath(); [[-12, -16, 9], [0, -21, 11], [12, -16, 9]].forEach(([x, y, rr2]) => { ctx.moveTo(x + rr2, y); ctx.arc(x, y + Math.sin(t * 2 + x) * .4, rr2, 0, TAU); }); ctx.fill(); ctx.stroke();
    ctx.fillRect(-16, -12, 32, 6); ctx.restore(); }
  TT.scene(PX + "dapur", "Cerita: dapur imajinasi, robot pemotong kilat vs kepala koki yang menanggung komplain", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ chef: 0, boardX: 330, bowlX: 600, top: 1330, plate: "KOKI: RAKA" }, f.kitchen || {});
    const tChop = T(s, A.chopCue, .3, idx), tPrice = T(s, A.priceCue, .3, idx), tBlame = T(s, A.blameCue, .4, idx);
    let chefR = null;
    base(ctx, s, t, { env: "dapur", envFront: false,
      spots: { board: [A.boardX + 60, 1120, 1.25] },
      over1: (c2, c, sts, j, R) => { if (j === A.chef && R[j]){ chefHat(ctx, R[j], t); chefR = R[j]; } },
      front: () => {
        const top = A.top; ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.fillRect(-400, top + 10, 1900, 40);
        rr(ctx, -400, top, 1900, 50, 10); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#8E5A34"; ctx.fillRect(-400, top + 50, 1900, 600); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-400, top + 50, 1900, 600);
        for (let x = -300; x < 1500; x += 300){ rr(ctx, x, top + 90, 260, 220, 12); ctx.strokeStyle = "rgba(43,26,18,.35)"; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = "#3B2418"; ctx.fillRect(x + 110, top + 120, 40, 10); }
        // name plate
        const pl = t >= tBlame ? 1 : 0, px = 790, py = top + 300; if (pl) glowAt(ctx, px, py, 300, GOLD, .45 + .15 * Math.sin(t * 8));
        rr(ctx, px - 190, py - 50, 380, 100, 14); ctx.fillStyle = pl ? GOLD : CREAM; ctx.fill(); ol(ctx, 6); textC(ctx, A.plate, px, py + 16, 44, BROWN, 900, 340);
        // board + veg
        const bx = A.boardX; rr(ctx, bx - 150, top - 26, 300, 30, 8); ctx.fillStyle = "#C88E5A"; ctx.fill(); ol(ctx, 5);
        const chopping = t >= tChop, cut = chopping ? clamp((t - tChop) * 2.5, 0, 6) : 0;
        ctx.save(); ctx.translate(bx - 40, top - 50); ctx.rotate(-.05); ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(0, -30, 90 - cut * 18, -6); ctx.lineTo(90 - cut * 18, 14); ctx.quadraticCurveTo(0, 22, -90, 10); ctx.closePath(); ctx.fillStyle = "#F08C2E"; ctx.fill(); ol(ctx, 4);
        ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-130, -30); ctx.lineTo(-120, 6); ctx.lineTo(-136, 20); ctx.closePath(); ctx.fill(); ctx.restore();
        // bowl filling
        const bw = A.bowlX, fill = clamp((t - tChop) / 3, 0, 1);
        if (chopping) for (let i = 0; i < 10; i++){ const qq = (t * 3 + i / 10) % 1; const x = lerp(bx + 60, bw, qq), y = top - 60 - Math.sin(qq * Math.PI) * 220; ctx.save(); ctx.translate(x, y); ctx.rotate(qq * 9 + i);
          ctx.fillStyle = i % 3 ? "#F08C2E" : (i % 2 ? RED : GREEN); ctx.beginPath(); ctx.ellipse(0, 0, 16, 10, 0, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); }
        for (let i = 0; i < Math.floor(fill * 12); i++){ ctx.fillStyle = i % 3 ? "#F08C2E" : (i % 2 ? RED : GREEN); ctx.beginPath(); ctx.ellipse(bw - 70 + (i % 6) * 28, top - 66 - Math.floor(i / 6) * 18, 16, 10, i, 0, TAU); ctx.fill(); ol(ctx, 3); }
        ctx.beginPath(); ctx.moveTo(bw - 110, top - 70); ctx.quadraticCurveTo(bw, top + 40, bw + 110, top - 70); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = TEAL; ctx.fillRect(bw - 96, top - 58, 192, 12);
        if (chopping && t < tBlame) speedLines(ctx, bx - 220, bx + 220, 980, 1260, t, .5, "#FFFFFF");
      },
      over: (c2, c, sts, R) => {
        // price tag over the robot
        const b = R.bots[0]; if (b && t >= tPrice && t < tBlame + .2){ const p = R.c.toScreen(b.x + 40, b.top - 40), k = t - tPrice; ctx.save(); ctx.translate(p[0], p[1]); const q = eBack(clamp(k / .35, 0, 1)); ctx.scale(q, q); ctx.rotate(Math.sin(t * 4) * .08);
          ctx.beginPath(); ctx.moveTo(-120, -50); ctx.lineTo(90, -50); ctx.lineTo(140, 0); ctx.lineTo(90, 50); ctx.lineTo(-120, 50); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.arc(96, 0, 12, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); textC(ctx, "HARGA ???", -14, 16, 40, BROWN, 900, 200); ctx.restore(); }
        // complaint note flies onto the chef
        if (t >= tBlame && chefR && chefR.screen){ const k = t - tBlame, q = eOut(clamp(k / .5, 0, 1)), h = chefR.screen.head, tx = clamp(h[0] + 150, 200, 900), ty = h[1] - 210;
          const x = lerp(1180, tx, q), y = lerp(260, ty, q) - Math.sin(q * Math.PI) * 120; ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(1.2, .08, q) + (q >= 1 ? Math.sin(t * 6) * .03 : 0));
          rr(ctx, -150, -80, 300, 160, 12); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ol(ctx, 6); textC(ctx, "KOMPLAIN", 0, -12, 44, RED, 900, 260); textC(ctx, "dari pelanggan", 0, 40, 28, BROWN, 800, 260); ctx.restore();
          if (k > .45) burstFx(ctx, tx, ty, k - .45, RED, 10, 140); }
      } });
  }, sfxWith((s, f, i, add) => { const A = f.kitchen || {}; if (A.chopCue) add(cueT(s, A.chopCue, .3, i), "whoosh"); if (A.priceCue) add(cueT(s, A.priceCue, .3, i), "pop"); if (A.blameCue) add(cueT(s, A.blameCue, .4, i), "ping"); }));

  /* _teken: checking the letter row by row, fixing, signing with a pen; then (shot) the letter folds into a paper plane and flies to the client
     f.check {letterX, letterY, w, rows, scanCue, fixes:[{row, cue}], signCue, signName}, f.plane {cue, from:[x,y], to:[x,y], dur} */
  TT.scene(PX + "teken", "Cerita: surat diperiksa baris demi baris, diperbaiki, ditandatangani, lalu terbang jadi pesawat kertas", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ letterX: 640, letterY: 260, w: 640 }, f.check || {}), PL = f.plane;
    const tScan = T(s, A.scanCue, .3, idx), tSign = T(s, A.signCue, .4, idx), fixes = (A.fixes || []).map((x, n) => Object.assign({ T: T(s, x.cue, .3 + n * .1, idx) }, x));
    base(ctx, s, t, { env: "office",
      spots: { letter: [A.letterX, A.letterY + 320, 1.1], sign: [A.letterX + 140, A.letterY + 560, 1.3] },
      back: () => { if (PL || !A.rows) return;
        const rows = A.rows.map((r, i) => { const fx = fixes.find(z => z.row === i); if (!fx || t < fx.T) return r; const k = t - fx.T; return Object.assign({}, r, { state: r.struck ? "struck" : "fixed", sq: clamp(k / .4, 0, 1), ck: eBack(clamp(k / .35, 0, 1)) }); });
        const P = offerLetter(ctx, A.letterX, A.letterY, A.w, t, { rows, scan: t >= tScan ? ((t - tScan) / 1.6) % 1.2 * (fixes.length && t >= fixes[0].T ? 0 : 1) : 0, sign: ramp(t, tSign, tSign + 1.1), signName: A.signName });
        if (t >= tSign && t < tSign + 1.3){ drawItem(ctx, "pen", P.sign[0] - 120 + 260 * ramp(t, tSign, tSign + 1.1), P.sign[1] - 30 + Math.sin(t * 30) * 8, t, { s: 1.4, write: true }); }
        if (t >= tSign + 1.1){ const k = t - tSign - 1.1; ctx.save(); ctx.translate(A.letterX - A.w / 2 + 150, A.letterY + P.h - 150); ctx.rotate(-.25); const q = clamp(k / .3, 0, 1); ctx.scale(2 - q, 2 - q); ctx.globalAlpha = q;
          rr(ctx, -120, -40, 240, 80, 12); ctx.strokeStyle = GREEN; ctx.lineWidth = 7; ctx.stroke(); textC(ctx, "DIPERIKSA", 0, 16, 40, GREEN, 900, 220); ctx.restore(); }
      },
      over: (c2, c, sts, R) => { if (!PL) return; const t0 = T(s, PL.cue, .3, idx), d = PL.dur || 1.6, k = t - t0; if (k < 0) return; const q = clamp(k / d, 0, 1), e = easeIO(q);
        const a = R.c.toScreen(PL.from[0], PL.from[1]), b = R.c.toScreen(PL.to[0], PL.to[1]), x = lerp(a[0], b[0], e), y = lerp(a[1], b[1], e) - Math.sin(q * Math.PI) * 340;
        if (q < 1){ ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 6; ctx.setLineDash([16, 18]); ctx.beginPath(); for (let i = 0; i <= 20; i++){ const qq = q * i / 20, ee = easeIO(qq); const xx = lerp(a[0], b[0], ee), yy = lerp(a[1], b[1], ee) - Math.sin(qq * Math.PI) * 340; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore();
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(b[1] - a[1] - Math.cos(q * Math.PI) * 340 * Math.PI, b[0] - a[0]) * .6); ctx.scale(1.2, 1.2);
          ctx.beginPath(); ctx.moveTo(70, 0); ctx.lineTo(-60, -40); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(70, 0); ctx.lineTo(-60, 34); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fillStyle = "#E9DCC8"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
        else burstFx(ctx, b[0], b[1], k - d, GOLD, 12, 160);
      } });
  }, sfxWith((s, f, i, add) => { const A = f.check || {}; (A.fixes || []).forEach((x, n) => add(cueT(s, x.cue, .3 + n * .1, i), "chime")); if (A.signCue) add(cueT(s, A.signCue, .4, i), "whoosh");
    (f.shots || []).forEach(sh => { if (sh.plane){ add(cueT(s, sh.plane.cue, .3, i), "whoosh"); add(cueT(s, sh.plane.cue, .3, i) + (sh.plane.dur || 1.6), "chime"); } }); }));

  /* =====================================================================================================
     JS40 "Kualitas sejak awal"
     ===================================================================================================== */
  function sawhorse(ctx, x, top){ ctx.strokeStyle = "#6E3F20"; ctx.lineWidth = 20; ctx.lineCap = "round"; [[-70, 1], [70, -1]].forEach(([dx]) => { ctx.beginPath(); ctx.moveTo(x + dx * .3, top + 20); ctx.lineTo(x + dx, GY); ctx.stroke(); });
    rr(ctx, x - 90, top, 180, 30, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); }
  function plank(ctx, x0, x1, y, col){ rr(ctx, x0, y - 40, x1 - x0, 40, 6); ctx.fillStyle = col || "#E2B57E"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "rgba(110,63,32,.35)"; ctx.lineWidth = 3; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(x0 + 10, y - 30 + i * 10); ctx.bezierCurveTo(x0 + (x1 - x0) * .3, y - 34 + i * 10, x0 + (x1 - x0) * .6, y - 24 + i * 10, x1 - 10, y - 30 + i * 10); ctx.stroke(); } }
  function cobweb(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 2.5;
    for (let i = 0; i < 6; i++){ const a = -Math.PI / 2 + (i - 2.5) * .45; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 110, -Math.abs(Math.sin(a)) * 110 - 10); ctx.stroke(); }
    for (let r = 30; r <= 100; r += 24){ ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = -Math.PI / 2 + (i - 2.5) * .45; const px = Math.cos(a) * r, py = -Math.abs(Math.sin(a)) * r - 10; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    const sy = -60 + Math.sin(t * 2) * 14; ctx.beginPath(); ctx.moveTo(40, -100); ctx.lineTo(40, sy); ctx.stroke(); ctx.fillStyle = "#2C2433"; ctx.beginPath(); ctx.arc(40, sy + 8, 9, 0, TAU); ctx.fill(); ctx.restore(); }
  function tapeBuddy(ctx, x, y, s, t, mood){ // lonely tape measure with a face
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -70, -130, 140, 130, 30); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -66, 34, 0, TAU); ctx.fillStyle = "#E5A92E"; ctx.fill(); ol(ctx, 4);
    rr(ctx, 64, -30, 40, 30, 6); ctx.fillStyle = "#F9E27A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#8E959E"; ctx.fillRect(100, -40, 8, 40);
    const blink = (t % 3) < .12; [-1, 1].forEach(d => { ctx.beginPath(); if (blink || mood === "sad") { ctx.arc(d * 30 - 2, -78, 10, mood === "sad" ? 0 : Math.PI, mood === "sad" ? Math.PI : TAU); ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.stroke(); } else { ctx.arc(d * 30 - 2, -78, 9, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); } });
    ctx.beginPath(); if (mood === "happy") ctx.arc(-2, -50, 16, .15 * Math.PI, .85 * Math.PI); else ctx.arc(-2, -34, 14, 1.15 * Math.PI, 1.85 * Math.PI); ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.stroke();
    if (mood === "sad"){ ctx.fillStyle = SKY; ctx.beginPath(); ctx.ellipse(36, -58 + ((t * 40) % 40), 6, 9, 0, 0, TAU); ctx.fill(); }
    ctx.restore(); }

  /* _potong: carpentry workshop; the hero saws a plank by eye; the lonely tape measure sits untouched under a cobweb; the off-cut drops
     f.cut {tableX, tapeX, tapeCue, guessCue, dropCue} */
  TT.scene(PX + "potong", "Cerita: bengkel kayu, papan digergaji asal kira, meteran kesepian bersarang laba-laba", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ tableX: 660, tapeX: 960 }, f.cut || {});
    const tTape = T(s, A.tapeCue, .3, idx), tGuess = T(s, A.guessCue, .3, idx), tDrop = T(s, A.dropCue, .3, idx), top = GY - 360;
    base(ctx, s, t, { env: "kayu", envOpt: { boardX: 600 },
      spots: { tape: [A.tapeX - 60, GY - 330, 1.75] },
      back: () => {
        sawhorse(ctx, A.tableX - 200, top); sawhorse(ctx, A.tableX + 190, top);
        // crate with the tape measure
        rr(ctx, A.tapeX - 110, GY - 200, 220, 200, 8); ctx.fillStyle = "#C88E5A"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(A.tapeX - 110, GY - 100); ctx.lineTo(A.tapeX + 110, GY - 100); ctx.stroke();
        tapeBuddy(ctx, A.tapeX - 20, GY - 200, 1.05, t, t >= tTape ? "sad" : "idle"); cobweb(ctx, A.tapeX + 40, GY - 200, .9, t);
        if (t >= tTape && t < tTape + 3){ ctx.save(); ctx.globalAlpha = .7 * clamp((t - tTape) / .3, 0, 1); for (let i = 0; i < 12; i++){ const q = (t * .4 + rnd(i)) % 1; ctx.fillStyle = "#E9DCC8"; ctx.beginPath(); ctx.arc(A.tapeX - 120 + rnd(i + 4) * 240, GY - 360 + q * 160, 4, 0, TAU); ctx.fill(); } ctx.restore(); }
        // plank: the off-cut falls at dropCue
        const cutX = A.tableX + 160; plank(ctx, A.tableX - 330, cutX, top);
        if (t < tDrop) plank(ctx, cutX + 4, A.tableX + 300, top);
        else { const k = t - tDrop, q = clamp(k / .5, 0, 1); ctx.save(); ctx.translate(cutX + 90, lerp(top - 20, GY - 20, eIn2(q))); ctx.rotate(lerp(0, .9, q) + (q >= 1 ? Math.sin(k * 20) * .05 * Math.max(0, 1 - (k - .5) * 3) : 0)); plank(ctx, -86, 86, 20); ctx.restore();
          if (k > .5) dust(ctx, cutX + 90, GY - 20, k - .5, 10, "#F3DDB6"); }
        // sawdust while sawing
        if (t < tDrop) for (let i = 0; i < 14; i++){ const q = (t * 1.6 + rnd(i)) % 1; ctx.fillStyle = i % 2 ? "#F3DDB6" : "#E2B57E"; ctx.beginPath(); ctx.arc(cutX + (rnd(i + 3) - .5) * 80 + q * 40 * (rnd(i) - .5), top + q * 300, 5 + rnd(i) * 4, 0, TAU); ctx.fill(); }
      },
      over: (c2, c, sts, R) => {
        if (t >= tTape && t < tTape + 2.8){ const p = R.c.toScreen(A.tapeX - 20, GY - 430); popChip(ctx, "TAK DISENTUH", clamp(p[0], 240, 840), Math.max(300, p[1] - 60), t - tTape - .2, BROWN, "#FFFFFF", 38, -.05); }
        if (t >= tGuess){ popWord(ctx, "KIRA-KIRA", 540, 380, t - tGuess, { size: 100, hold: 1.6, rot: -6 }); }
      } });
  }, sfxWith((s, f, i, add) => { const A = f.cut || {}; if (A.tapeCue) add(cueT(s, A.tapeCue, .3, i), "ping"); if (A.guessCue) add(cueT(s, A.guessCue, .3, i), "pop"); if (A.dropCue) add(cueT(s, A.dropCue, .3, i) + .5, "pop"); }));
  const eIn2 = x => x * x;

  /* niche in a living-room wall + a shelf (rak) */
  function niche(ctx, x, w, h, t){ const y1 = GY - 60, y0 = y1 - h;
    ctx.fillStyle = "#4E2A17"; rr(ctx, x - w / 2 - 26, y0 - 26, w + 52, h + 52, 10); ctx.fill();
    ctx.fillStyle = "#5E351E"; ctx.fillRect(x - w / 2, y0, w, h); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(x - w / 2, y0, w, 26); ctx.fillRect(x - w / 2, y0, 22, h);
    rr(ctx, x - w / 2 - 40, y1, w + 80, 60, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); return { y0, y1 }; }
  function rak(ctx, x, y1, w, h, t){ const y0 = y1 - h; rr(ctx, x - w / 2, y0, w, h, 8); ctx.fillStyle = "#C88E5A"; ctx.fill(); ol(ctx, 6);
    for (let i = 1; i < 3; i++){ ctx.fillStyle = "#8E5A34"; ctx.fillRect(x - w / 2 + 14, y0 + i * h / 3 - 6, w - 28, 14); }
    ctx.fillStyle = "#A9703F"; ctx.fillRect(x - w / 2 + 14, y0 + 14, w - 28, h / 3 - 20);
    const cols = [TEAL, ORANGE, "#5B7DB1", RED, GOLD]; for (let i = 0; i < 5; i++){ rr(ctx, x - w / 2 + 30 + i * 36, y0 + h / 3 - 110 + (i % 2) * 12, 30, 104 - (i % 2) * 12, 4); ctx.fillStyle = cols[i]; ctx.fill(); ol(ctx, 3); }
    ctx.save(); ctx.translate(x + w / 4, y0 + 2 * h / 3 - 8); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-30, -60); ctx.lineTo(30, -60); ctx.lineTo(22, 0); ctx.lineTo(-22, 0); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#3E7D4F"; for (let k = 0; k < 5; k++){ ctx.save(); ctx.translate(0, -60); ctx.rotate(-1 + k * .5 + Math.sin(t * 1.5 + k) * .05); ctx.beginPath(); ctx.ellipse(0, -36, 12, 36, 0, 0, TAU); ctx.fill(); ctx.restore(); } ctx.restore(); }

  /* _ceruk: delivery day; the shelf is 5 cm too wide for the wall niche, bump, red measurement, carried back out
     f.fit {nicheX, nicheW, rakW, h, carrier, offset, bumpCue, sizeCue, backCue, ok} */
  TT.scene(PX + "ceruk", "Cerita: rak diantar ke rumah, tak muat di ceruk dinding (+5 cm), dibawa pulang", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ nicheX: 620, nicheW: 420, rakW: 470, h: 520, carrier: 0, offset: 330 }, f.fit || {});
    const tBump = T(s, A.bumpCue, .3, idx), tSize = T(s, A.sizeCue, .3, idx), tIn = T(s, A.inCue, .3, idx);
    let rx = A.nicheX;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 980 },
      spots: { niche: [A.nicheX, GY - 400, 1.15] },
      back: (c2, c, sts) => { niche(ctx, A.nicheX, A.nicheW, A.h + 10, t);
        if (A.ok){ // perfect fit: slides in, settles
          const q = eBack(clamp((t - tIn) / .7, 0, 1)); rx = lerp(A.nicheX + 700, A.nicheX, t < tIn ? 0 : q); if (t >= tIn) rak(ctx, rx, GY - 60, A.rakW, A.h, t);
          if (t >= tIn + .7){ const k = t - tIn - .7; glowAt(ctx, A.nicheX, GY - 330, 420, GOLD, .35 * Math.max(.3, 1 - k * .4)); }
        } },
      over1: (c2, c, sts, j, R) => { if (A.ok || j !== A.carrier) return; const st = sts[j]; rx = st.x + A.offset * (st.face || 1);
        let dx = 0, dy = 0; if (t >= tBump && t < tBump + .6){ const k = t - tBump; dx = -Math.sin(k * 30) * 14 * (1 - k / .6); dy = -Math.abs(Math.sin(k * 20)) * 10 * (1 - k / .6); }
        ctx.save(); ctx.translate(dx, dy); ctx.rotate(st.moving ? Math.sin(t * 9) * .015 : 0); rak(ctx, rx, GY - 70, A.rakW, A.h, t); ctx.restore();
        if (t >= tBump && t < tBump + .8) dust(ctx, A.nicheX + A.nicheW / 2 * (A.side || 1), GY - 300, t - tBump, 8, "#F3DDB6"); },
      over: (c2, c, sts, R) => {
        if (t >= tBump && !A.ok) popWord(ctx, "DUK!", 760, 520, t - tBump, { size: 120, hold: 1.0, rot: 8 });
        if (t >= tSize && !A.ok){ const k = t - tSize, my = GY - A.h - (A.measY ?? 220), a = R.c.toScreen(A.nicheX - A.nicheW / 2, my), b = R.c.toScreen(A.nicheX + A.nicheW / 2, my), b2 = R.c.toScreen(rx + A.rakW / 2 * (A.side || 1), my);
          const q = clamp(k / .4, 0, 1); ctx.save(); ctx.globalAlpha = q; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
          ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.beginPath(); const bb = (A.side || 1) > 0 ? b : a; ctx.moveTo(bb[0], bb[1] - 30); ctx.lineTo(bb[0], bb[1] + 30); ctx.moveTo(b2[0], b2[1] - 30); ctx.lineTo(b2[0], b2[1] + 30); ctx.moveTo(bb[0], bb[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke(); ctx.restore();
          popChip(ctx, "+5 cm", clamp(b2[0] + 40 * (A.side || 1), 200, 880), b2[1] + 70, k - .1, RED, "#FFFFFF", 48, .06); }
      } });
  }, sfxWith((s, f, i, add) => { const A = f.fit || {}; if (A.bumpCue) add(cueT(s, A.bumpCue, .3, i), "pop"); if (A.sizeCue) add(cueT(s, A.sizeCue, .3, i), "ping"); if (A.inCue){ add(cueT(s, A.inCue, .3, i), "whoosh"); add(cueT(s, A.inCue, .3, i) + .7, "chime"); } }));

  /* _biaya: the "salah ukur" bug grows at each stage: on paper (erased in 1 second), after the cut (new plank), at the customer's house
     (time, money, trust); coin stacks show the cost; the boss walks along and points
     f.cost {xs:[3], cues:[3], fixCues:[3], chips:[{cue, text}]} */
  function bug(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const w = Math.sin(t * 14) * 8;
    ctx.strokeStyle = OUT; ctx.lineWidth = 7; for (let i = 0; i < 3; i++) [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 30, -30 + i * 22); ctx.lineTo(d * 80, -40 + i * 26 + (i % 2 ? w : -w) * d); ctx.lineTo(d * 96, -10 + i * 26); ctx.stroke(); });
    ctx.beginPath(); ctx.ellipse(0, -30, 70, 56, 0, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(0, -86); ctx.lineTo(0, 26); ol(ctx, 4);
    ctx.fillStyle = "#2B1A12"; [[-30, -50], [26, -20], [-20, 0], [34, -60]].forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px, py, 9, 0, TAU); ctx.fill(); });
    ctx.beginPath(); ctx.arc(0, -96, 34, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 13, -100, 10, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.arc(d * 13 + 2, -98, 5, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(d * 4, -116); ctx.lineTo(d * 24, -110); ctx.stroke();
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(d * 10, -126); ctx.quadraticCurveTo(d * 30, -170 + w, d * 44, -160); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(-12, -80); ctx.lineTo(-4, -86); ctx.lineTo(4, -80); ctx.lineTo(12, -86); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.stroke();
    if (o.tag !== false){ rr(ctx, -110, 34, 220, 46, 23); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); textC(ctx, "SALAH UKUR", 0, 66, 28, RED, 900, 200); }
    ctx.restore(); }
  function coins(ctx, x, y, n, t){ for (let i = 0; i < n; i++){ const col = i % 4, row = Math.floor(i / 4); const cx = x + (col - 1.5) * 64, cy = y - row * 26 - col * 2;
      ctx.beginPath(); ctx.ellipse(cx, cy, 30, 14, 0, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#E5A92E"; ctx.fillRect(cx - 30, cy, 60, 10); textC(ctx, "Rp", cx, cy + 6, 16, BROWN, 900); } }
  TT.scene(PX + "biaya", "Cerita: kutu SALAH UKUR membesar di tiap tahap (kertas, potongan, rumah pelanggan), tumpukan koin biaya", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ xs: [360, 1120, 1880] }, f.cost || {});
    const tc = (A.cues || []).map((c, n) => T(s, c, .2, idx)), tf = (A.fixCues || []).map((c, n) => T(s, c, .3, idx)), chips = (A.chips || []).map((c, n) => Object.assign({ T: T(s, c.cue, .3 + n * .1, idx) }, c));
    const SC = [.55, 1.0, 1.7], NC = [1, 4, 12];
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      spots: { s0: [A.xs[0], 1060, 1.0], s1: [A.xs[1], 1060, 1.0], s2: [A.xs[2], 1000, .95] },
      back: () => {
        // floor arrow linking stations
        ctx.strokeStyle = hexA("#FFFFFF", .25); ctx.lineWidth = 16; ctx.setLineDash([30, 30]); ctx.lineDashOffset = -t * 60; ctx.beginPath(); ctx.moveTo(A.xs[0] - 200, GY - 40); ctx.lineTo(A.xs[2] + 300, GY - 40); ctx.stroke(); ctx.setLineDash([]);
        A.xs.forEach((x, n) => { const t0 = n === 0 ? -1 : tc[n] - .3, on = t >= t0, q = on ? (n === 0 ? 1 : eBack(clamp((t - t0) / .45, 0, 1))) : 0; if (!on) return;
          ctx.save(); ctx.translate(x, GY); ctx.scale(q, q); ctx.translate(-x, -GY);
          // pedestal + stage label
          rr(ctx, x - 230, GY - 60, 460, 60, 10); ctx.fillStyle = "#2E4670"; ctx.fill(); ol(ctx, 5);
          if (n === 0){ // paper sketch on a stand
            ctx.save(); ctx.translate(x, GY - 520); ctx.rotate(-.05); rr(ctx, -170, -200, 340, 260, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
            ctx.strokeStyle = TEAL; ctx.lineWidth = 5; ctx.strokeRect(-110, -160, 220, 180); ctx.beginPath(); ctx.moveTo(-110, -100); ctx.lineTo(110, -100); ctx.moveTo(-110, -40); ctx.lineTo(110, -40); ctx.stroke(); ctx.restore();
            ctx.strokeStyle = "#6E3F20"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x - 80, GY - 60); ctx.lineTo(x - 40, GY - 470); ctx.moveTo(x + 80, GY - 60); ctx.lineTo(x + 40, GY - 470); ctx.stroke(); }
          if (n === 1){ sawhorse(ctx, x - 150, GY - 280); sawhorse(ctx, x + 150, GY - 280); plank(ctx, x - 260, x + 120, GY - 280);
            if (t >= tf[1]){ const k = t - tf[1], qq = eOut(clamp(k / .6, 0, 1)); ctx.save(); ctx.translate(lerp(x + 600, x, qq), lerp(GY - 900, GY - 330, qq)); ctx.rotate((1 - qq) * 1.2); plank(ctx, -270, 270, 0, "#F0C890"); ctx.restore(); } }
          if (n === 2){ // customer's house front
            ctx.fillStyle = "#F3D9B5"; ctx.fillRect(x - 330, GY - 620, 660, 560); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(x - 380, GY - 610); ctx.lineTo(x, GY - 860); ctx.lineTo(x + 380, GY - 610); ctx.closePath(); ctx.fillStyle = "#B5562A"; ctx.fill(); ol(ctx, 6);
            rr(ctx, x - 70, GY - 300, 140, 240, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); [[-220], [220]].forEach(([dx]) => { rr(ctx, x + dx - 70, GY - 480, 140, 120, 8); ctx.fillStyle = "#9DCFDC"; ctx.fill(); ol(ctx, 5); }); }
          ctx.restore();
          // the bug
          const fixed = n === 0 && t >= tf[0], by = n === 2 ? GY - 200 : (n === 1 ? GY - 330 : GY - 560), bx = n === 2 ? x - 30 : x;
          if (!fixed){ const st = Math.abs(Math.sin(t * (n === 2 ? 5 : 9))) * (n === 2 ? 30 : 10); bug(ctx, bx, by - st, SC[n] * q, t, {}); if (n === 2 && st < 4) dust(ctx, bx, GY - 60, (t * 5) % 1, 6, "#4A6A9A"); }
          else { const k = t - tf[0]; if (k < .6){ ctx.save(); ctx.globalAlpha = 1 - k / .6; bug(ctx, bx, by, SC[0] * (1 - k / .6), t, {}); ctx.restore(); }
            // eraser
            const ex = x - 120 + Math.min(1, k / .5) * 240 + Math.sin(k * 30) * 20 * (k < .5 ? 1 : 0); ctx.save(); ctx.translate(ex, by - 20); ctx.rotate(-.4); rr(ctx, -50, -26, 100, 52, 10); ctx.fillStyle = "#F4A7B9"; ctx.fill(); ol(ctx, 5); rr(ctx, 10, -26, 40, 52, 10); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
          // coins
          const cq = t >= tf[n] ? Math.min(NC[n], Math.floor((t - tf[n]) * 14) + 1) : 0; coins(ctx, x + (n === 2 ? 290 : 210), GY - 90, cq, t); });
      },
      over: (c2, c, sts, R) => {
        A.xs.forEach((x, n) => { const st0 = n === 0 ? 0 : tc[n], st1 = n < 2 ? tc[n + 1] : 1e9; if (t < st0 || t >= st1) return;
          popChip(ctx, ["DI KERTAS", "SETELAH DIPOTONG", "DI RUMAH PELANGGAN"][n], 540, 300, t - st0 - .1, NAVY, "#FFFFFF", 44, -.03);
          const lab = n === 0 ? "1 DETIK" : n === 1 ? "PAPAN BARU" : null; if (lab && t >= tf[n]){ const p = R.c.toScreen(x, n === 0 ? GY - 860 : GY - 700); popChip(ctx, lab, clamp(p[0], 220, 860), Math.max(420, p[1]), t - tf[n], n ? ORANGE : GREEN, "#FFFFFF", 44, .05); } });
        chips.forEach((cp, n) => { if (t < cp.T) return; popChip(ctx, cp.text, 540, 410 + n * 96, t - cp.T, RED, "#FFFFFF", 44, (n - 1) * .04); });
      } });
  }, sfxWith((s, f, i, add) => { const A = f.cost || {}; (A.cues || []).forEach(c => add(cueT(s, c, .2, i), "whoosh")); (A.fixCues || []).forEach(c => add(cueT(s, c, .3, i), "pop")); (A.chips || []).forEach((c, n) => add(cueT(s, c.cue, .3 + n * .1, i), "ping")); }));

  /* _ukur: measure twice (tape runs along the plank twice, pencil mark, 2x check), then cuts to the customer approving the sketch and
     the shelf sliding perfectly into the niche (shots)
     f.measure {tableX, runCue, againCue, markCue}, shots with fit:{ok:true, inCue} for the niche */
  TT.scene(PX + "ukur", "Cerita: ukur dua kali (meteran menyusur papan), cocokkan gambar, rak pas di ceruk", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene;
    if (f.fit && f.fit.ok){ // reuse the niche scene drawing
      const A = Object.assign({ nicheX: 600, nicheW: 420, rakW: 410, h: 500 }, f.fit), tIn = T(s, A.inCue, .3, idx);
      base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 980 },
        back: () => { niche(ctx, A.nicheX, A.nicheW, A.h + 10, t); const q = t < tIn ? 0 : eBack(clamp((t - tIn) / .7, 0, 1)); if (t >= tIn) rak(ctx, lerp(A.nicheX + 760, A.nicheX, q), GY - 60, A.rakW, A.h, t);
          if (t >= tIn + .7){ glowAt(ctx, A.nicheX, GY - 330, 460, GOLD, .4); for (let i = 0; i < 8; i++){ const a = t * 1.2 + i * .8; sparkle(ctx, A.nicheX + Math.cos(a) * 280, GY - 330 + Math.sin(a) * 300, 14, i % 2 ? GOLD : "#FFFFFF"); } } } });
      return; }
    const A = Object.assign({ tableX: 620 }, f.measure || {}), top = GY - 360, x0 = A.tableX - 340, L = 640;
    const tRun = T(s, A.runCue, .3, idx), tAgain = T(s, A.againCue, .3, idx), tMark = T(s, A.markCue, .5, idx);
    base(ctx, s, t, { env: "kayu", envOpt: { boardX: 80, winX: 640, lampX: 300, planksX: 1100 },
      spots: { plank: [A.tableX, top - 120, 1.2] },
      back: () => { sawhorse(ctx, A.tableX - 220, top); sawhorse(ctx, A.tableX + 220, top); plank(ctx, x0, x0 + L, top);
        const run = (T0) => t < T0 ? 0 : clamp((t - T0) / 1.0, 0, 1);
        const r1 = run(tRun), r2 = run(tAgain), len = t >= tAgain ? r2 : r1;
        if (len > 0){ ctx.fillStyle = "#F9E27A"; ctx.fillRect(x0, top - 64, L * len, 24); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(x0, top - 64, L * len, 24);
          ctx.fillStyle = BROWN; for (let xx = 10; xx < L * len; xx += 17) ctx.fillRect(x0 + xx, top - 64, 2, xx % 85 < 17 ? 14 : 7);
          ctx.fillStyle = "#8E959E"; ctx.fillRect(x0 + L * len - 4, top - 72, 10, 40); }
        drawItem(ctx, "tape", x0 - 60, top - 80, t, { s: 1.1 });
        if (t >= tMark){ const k = t - tMark; ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0 + L - 40, top - 40); ctx.lineTo(x0 + L - 40, top - 40 + 40 * clamp(k / .3, 0, 1)); ctx.stroke(); }
        [[tRun + 1, "1x"], [tAgain + 1, "2x"]].forEach(([T0, txt], n) => { if (t < T0) return; const k = t - T0, q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x0 + L - 170, top - 150 - n * 90); ctx.scale(q, q);
          ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); check(ctx, -6, 2, 1.3, "#FFFFFF"); textC(ctx, txt, 76, 14, 40, "#FFFFFF", 900); ctx.restore(); });
      },
      over: () => { if (t >= tAgain) popWord(ctx, "UKUR 2 KALI", 540, 400, t - tAgain - .2, { size: 92, hold: 2.0, rot: -5 }); } });
  }, sfxWith((s, f, i, add) => { const A = f.measure || {}; if (A.runCue) add(cueT(s, A.runCue, .3, i), "whoosh"); if (A.againCue){ add(cueT(s, A.againCue, .3, i), "whoosh"); add(cueT(s, A.againCue, .3, i) + 1, "chime"); }
    (f.shots || []).forEach(sh => { if (sh.fit && sh.fit.inCue){ add(cueT(s, sh.fit.inCue, .3, i), "whoosh"); add(cueT(s, sh.fit.inCue, .3, i) + .7, "chime"); } }); }));

  /* =====================================================================================================
     SC40 "Menabung vs berinvestasi"
     ===================================================================================================== */
  function chest(ctx, x, y, s, t, o){ o = o || {}; const lid = o.lid || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.beginPath(); ctx.ellipse(0, 6, 190, 20, 0, 0, TAU); ctx.fill();
    rr(ctx, -170, -200, 340, 200, 16); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 7); [-110, 110].forEach(dx => { ctx.fillStyle = GOLD; ctx.fillRect(dx - 14, -200, 28, 200); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(dx - 14, -200, 28, 200); });
    if (o.glow) glowAt(ctx, 0, -210, 260, GOLD, o.glow);
    ctx.save(); ctx.translate(-170, -200); ctx.rotate(-1.6 * lid); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(340, 0); ctx.quadraticCurveTo(340, -110, 170, -120); ctx.quadraticCurveTo(0, -110, 0, 0); ctx.closePath(); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 7); ctx.restore();
    rr(ctx, -150, -90, 300, 62, 12); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, o.label || "INVESTASI", 0, -46, 40, BROWN, 900, 270);
    rr(ctx, -26, -180, 52, 60, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -156, 8, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.restore(); }
  function coinAt(ctx, x, y, r, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .92, 0, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(0, 0, r * .66, r * .6, 0, 0, TAU); ctx.strokeStyle = "#E5A92E"; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, "Rp", 0, r * .3, r * .7, BROWN, 900); ctx.restore(); }
  function schoolGate(ctx, x, t){ // fence, arch with sign, flag
    ctx.strokeStyle = "#5B7DB1"; ctx.lineWidth = 10; for (let xx = -900; xx < 2000; xx += 70){ if (Math.abs(xx - x) < 300) continue; ctx.beginPath(); ctx.moveTo(xx, GY - 150); ctx.lineTo(xx, GY - 470); ctx.stroke(); }
    ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-900, GY - 440); ctx.lineTo(2000, GY - 440); ctx.moveTo(-900, GY - 220); ctx.lineTo(2000, GY - 220); ctx.stroke();
    ctx.fillStyle = "#F3E6D2"; ctx.fillRect(x - 310, GY - 760, 70, 610); ctx.fillRect(x + 240, GY - 760, 70, 610); ol(ctx, 5);
    rr(ctx, x - 340, GY - 880, 680, 140, 20); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 7); textC(ctx, "SEKOLAH", x, GY - 790, 70, "#FFFFFF", 900, 600);
    ctx.strokeStyle = "#8A97A8"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 420, GY - 150); ctx.lineTo(x + 420, GY - 1000); ctx.stroke();
    const w = Math.sin(t * 4); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(x + 424, GY - 990); ctx.quadraticCurveTo(x + 500, GY - 1000 + w * 12, x + 570, GY - 985); ctx.lineTo(x + 570, GY - 945); ctx.quadraticCurveTo(x + 500, GY - 960 + w * 12, x + 424, GY - 950); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(x + 424, GY - 950); ctx.quadraticCurveTo(x + 500, GY - 960 + w * 12, x + 570, GY - 945); ctx.lineTo(x + 570, GY - 905); ctx.quadraticCurveTo(x + 500, GY - 920 + w * 12, x + 424, GY - 910); ctx.closePath(); ctx.fill(); }

  /* _gerbang: (shot A) last year: all the money pours into the INVESTASI chest; (shot B) school gate: the teacher hands over a letter,
     the letter fills the screen: UANG PANGKAL, pay NEXT MONTH
     f.chestA {x, pourCue, closeCue, from (toon idx)}, f.gate {x, letterCue, outCue} */
  TT.scene(PX + "gerbang", "Cerita: semua uang masuk peti INVESTASI, lalu surat uang pangkal di gerbang sekolah", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, CA = f.chestA, GT = f.gate;
    base(ctx, s, t, { env: "home",
      spots: { chest: [CA ? CA.x : 800, GY - 300, 1.15] },
      back: () => { if (GT) schoolGate(ctx, GT.x ?? 560, t);
        if (CA){ const tp = T(s, CA.pourCue, .3, idx), tc = T(s, CA.closeCue, .5, idx); const lid = t < tp - .3 ? 0 : (t < tc ? eBack(clamp((t - tp + .3) / .4, 0, 1)) : 1 - eOut(clamp((t - tc) / .35, 0, 1)));
          chest(ctx, CA.x, GY, 1.1, t, { lid, glow: t >= tp && t < tc ? .4 : 0 }); } },
      front: (c2, c, sts) => { if (!CA) return; const tp = T(s, CA.pourCue, .3, idx), tc = T(s, CA.closeCue, .5, idx); if (t < tp || t > tc + .5) return;
        const st = sts[CA.from || 0], h = handOf(st); for (let i = 0; i < 14; i++){ const q = (t * 1.8 + i / 14) % 1; if (t > tc && q > (t - tc) * 2) continue;
          coinAt(ctx, lerp(h[0], CA.x, q), lerp(h[1], GY - 260, q) - Math.sin(q * Math.PI) * 260, 26, q * 8 + i); } },
      over: () => { if (!GT) return; const tl = T(s, GT.letterCue, .3, idx), to = T(s, GT.outCue, .8, idx); if (t < tl || t > to + .35) return;
        const k = t - tl, q = eBack(clamp(k / .45, 0, 1)), oq = 1 - clamp((t - to) / .35, 0, 1); ctx.save(); ctx.globalAlpha *= oq; ctx.translate(540, 560); ctx.rotate(-.04 + Math.sin(t * 2) * .01); ctx.scale(q, q);
        ctx.fillStyle = "rgba(43,26,18,.3)"; rr(ctx, -300, -220, 620, 460, 18); ctx.fill(); rr(ctx, -320, -240, 620, 460, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 8);
        ctx.fillStyle = TEAL; rr(ctx, -320, -240, 620, 70, 18); ctx.fill(); textC(ctx, "SURAT DARI SEKOLAH", -10, -192, 36, "#FFFFFF", 900, 560);
        textC(ctx, "Uang pangkal Alya", -10, -90, 48, BROWN, 900, 560); ctx.fillStyle = "#E3C9A6"; ctx.fillRect(-260, -60, 500, 4);
        textC(ctx, "Dibayar:", -10, 10, 36, "#8A5A3E", 800); const pul = 1 + .06 * Math.sin(t * 8); ctx.save(); ctx.translate(-10, 100); ctx.scale(pul, pul); rr(ctx, -230, -54, 460, 90, 16); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "BULAN DEPAN!", 0, 12, 52, "#FFFFFF", 900, 420); ctx.restore();
        ctx.restore(); } });
  }, sfxWith((s, f, i, add) => { const all = [f].concat(f.shots || []); all.forEach(F => { if (F.chestA){ add(cueT(s, F.chestA.pourCue, .3, i), "whoosh"); add(cueT(s, F.chestA.closeCue, .5, i), "pop"); } if (F.gate) add(cueT(s, F.gate.letterCue, .3, i), "ping"); }); }));

  /* mountain boots + backpack for a walking toon (feet follow the engine's walk cycle) */
  function bootsOn(ctx, st, t){ const k = st.size / 92, f = st.face || 1, ph = (st.moveT || 0) * (st.run ? 15 : 9.5);
    [[-1, -5.5], [1, 5.5]].forEach(([d, hx]) => { let fx = hx, fy = 0; if (st.moving){ const s0 = Math.sin(ph + (d > 0 ? 0 : Math.PI)); fx = hx * .5 + s0 * 8.5; fy = -Math.max(0, Math.cos(ph + (d > 0 ? 0 : Math.PI))) * 4; }
      const x = st.x + fx * k * f, y = st.y + fy * k; ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k);
      ctx.beginPath(); ctx.moveTo(-6, 1); ctx.lineTo(-6, -17); ctx.lineTo(5, -17); ctx.lineTo(5, -8); ctx.quadraticCurveTo(15, -7, 16, -1); ctx.lineTo(16, 2); ctx.lineTo(-6, 2); ctx.closePath(); ctx.fillStyle = "#7A4A2A"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.fillStyle = "#3B2418"; ctx.fillRect(-7, 0, 24, 3.4); ctx.strokeStyle = GOLD; ctx.lineWidth = .9; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-1, -14 + i * 3.6); ctx.lineTo(4, -15 + i * 3.6); ctx.stroke(); }
      ctx.restore(); }); }
  function backpack(ctx, st, t){ const k = st.size / 92, f = st.face || 1; ctx.save(); ctx.translate(st.x - 13 * k * f, st.y - 52 * k + Math.sin(t * 9) * (st.moving ? .6 * k : 0)); ctx.scale(k * f, k);
    rr(ctx, -9, -16, 18, 34, 5); ctx.fillStyle = "#C2691F"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.3; ctx.stroke(); rr(ctx, -7, 4, 14, 10, 3); ctx.fillStyle = "#A35516"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -18, 10, 4, 0, 0, TAU); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ctx.stroke(); ctx.restore(); }
  function warung(ctx, x, t){ ctx.fillStyle = "#E9D6BC"; ctx.fillRect(x - 260, GY - 640, 520, 640); ol(ctx, 6);
    for (let i = 0; i < 8; i++){ ctx.fillStyle = i % 2 ? "#FFFFFF" : "#D9483B"; ctx.beginPath(); ctx.moveTo(x - 300 + i * 75, GY - 700); ctx.lineTo(x - 225 + i * 75, GY - 700); ctx.lineTo(x - 225 + i * 75, GY - 610); ctx.quadraticCurveTo(x - 262 + i * 75, GY - 580 + Math.sin(t * 3 + i) * 4, x - 300 + i * 75, GY - 610); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); }
    rr(ctx, x - 180, GY - 830, 360, 110, 14); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); textC(ctx, "WARUNG", x, GY - 755, 56, BROWN, 900, 320);
    rr(ctx, x - 230, GY - 330, 460, 330, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
    for (let i = 0; i < 6; i++){ ctx.fillStyle = [TEAL, ORANGE, RED, GOLD, "#5B7DB1", GREEN][i]; rr(ctx, x - 210 + i * 70, GY - 470, 56, 120, 8); ctx.fill(); ol(ctx, 3); }
    for (let i = 0; i < 4; i++){ const sw = Math.sin(t * 2 + i) * .1; ctx.save(); ctx.translate(x - 180 + i * 120, GY - 590); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.stroke(); rr(ctx, -20, 30, 40, 50, 6); ctx.fillStyle = ["#F6C343", "#E07A9B", "#7FC8C0", "#E8A55B"][i]; ctx.fill(); ol(ctx, 3); ctx.restore(); } }

  /* _sepatu: (A) home: the chest's value sinks (red arrow), sold below capital: MODAL vs DIJUAL coin stacks, RUGI;
     (B) street: walking to the shop next door in heavy mountain boots and a backpack, thump by thump
     f.sell {x, downCue, sellCue, capital, got}, shots[1] f.trek {on, shopX, stepCue} */
  TT.scene(PX + "sepatu", "Cerita: nilai peti turun & dijual rugi, lalu ke warung sebelah pakai sepatu gunung", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, SL = f.sell, TR = f.trek;
    base(ctx, s, t, { env: "home",
      spots: { stacks: [SL ? SL.x - 60 : 540, GY - 380, 1.1] },
      under: (c2, c, sts, j) => { if (TR && j === (TR.on || 0)) backpack(ctx, sts[j], t); },
      over1: (c2, c, sts, j) => { if (TR && j === (TR.on || 0)) bootsOn(ctx, sts[j], t); },
      back: () => {
        if (TR) warung(ctx, TR.shopX ?? 820, t);
        if (!SL) return; const td = T(s, SL.downCue, .3, idx), ts = T(s, SL.sellCue, .3, idx);
        const sink = t < td ? 0 : eOut(clamp((t - td) / .8, 0, 1)) * 90; ctx.save(); ctx.translate(0, sink); chest(ctx, SL.x + 170, GY - 30, 1.0, t, { lid: 0 }); ctx.restore();
        // wavy "value" line under the chest
        ctx.strokeStyle = hexA(RED, .9); ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); for (let i = 0; i <= 30; i++){ const xx = SL.x - 220 + i * 26, yy = GY - 640 + i * (t < td ? 0 : 7 * clamp((t - td) / .8, 0, 1)) + Math.sin(i * .8 + t * 3) * 18; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
        if (t >= td){ const k = t - td, q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(SL.x + 170, GY - 520 + Math.sin(t * 6) * 8 + Math.min(1, k) * 40); ctx.scale(q, q); ctx.beginPath(); ctx.moveTo(-40, -90); ctx.lineTo(40, -90); ctx.lineTo(40, 0); ctx.lineTo(80, 0); ctx.lineTo(0, 90); ctx.lineTo(-80, 0); ctx.lineTo(-40, 0); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6); ctx.restore(); }
        if (t >= ts){ const k = t - ts, cap = SL.capital || 10, got = Math.min(SL.got || 7, Math.floor(k * 9)); const bx0 = SL.x - 310, bx1 = SL.x - 100;
          for (let i = 0; i < cap; i++){ ctx.save(); ctx.globalAlpha = .45; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.ellipse(bx0, GY - 300 - i * 26, 50, 16, 0, 0, TAU); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
          for (let i = 0; i < cap; i++){ ctx.beginPath(); ctx.ellipse(bx0, GY - 300 - i * 26, 50, 16, 0, 0, TAU); ctx.fillStyle = hexA(GOLD, .5); ctx.fill(); ol(ctx, 3); }
          for (let i = 0; i < got; i++){ ctx.beginPath(); ctx.ellipse(bx1, GY - 300 - i * 26, 50, 16, 0, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); }
          rr(ctx, bx0 - 80, GY - 290, 160, 50, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, "MODAL", bx0, GY - 254, 30, BROWN, 900);
          rr(ctx, bx1 - 80, GY - 290, 160, 50, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, "DIJUAL", bx1, GY - 254, 30, RED, 900); }
      },
      over: (c2, c, sts, R) => {
        if (SL){ const ts = T(s, SL.sellCue, .3, idx); if (t >= ts + .9){ const p = R.c.toScreen(SL.x - 220, GY - 640); stampBox(ctx, "RUGI", clamp(p[0], 220, 860), Math.max(340, p[1]), t - ts - .9, RED, 70, -.12); } }
        if (TR){ const st = sts[TR.on || 0]; if (st.moving){ const ph = (st.moveT || 0) * 9.5, thump = Math.abs(Math.cos(ph)) < .12; if (thump){ const p = R.c.toScreen(st.x, GY); popWord(ctx, "DUG", clamp(p[0] + 120, 200, 880), p[1] - 420, .3, { size: 60, hold: .6, rot: 6 }); } } }
      } });
  }, sfxWith((s, f, i, add) => { const all = [f].concat(f.shots || []); all.forEach(F => { if (F.sell){ add(cueT(s, F.sell.downCue, .3, i), "ping"); add(cueT(s, F.sell.sellCue, .3, i) + .9, "pop"); } }); }));

  /* _jarak: sky + hills; NEAR: a shop door with sandals on the mat (TABUNGAN); FAR: a mountain whose trail goes up and down to the summit flag
     (INVESTASI); a tiny hiker walks the trail
     f.dist {shopX, mtX, nearCue, farCue, waveCue} */
  function trailPts(mx){ return [[mx - 470, GY - 60], [mx - 330, GY - 200], [mx - 260, GY - 150], [mx - 140, GY - 360], [mx - 60, GY - 300], [mx + 40, GY - 520], [mx + 120, GY - 450], [mx + 200, GY - 650], [mx + 250, GY - 610], [mx + 300, GY - 800]]; }
  function alongPts(P, u){ const n = P.length - 1, x = clamp(u, 0, .9999) * n, i = Math.floor(x), q = x - i; return [lerp(P[i][0], P[i + 1][0], q), lerp(P[i][1], P[i + 1][1], q)]; }
  TT.scene(PX + "jarak", "Cerita: dekat = pintu warung + sandal (tabungan), jauh = gunung dengan jalur naik turun (investasi)", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ shopX: 130, mtX: 860 }, f.dist || {});
    const tN = T(s, A.nearCue, .3, idx), tF = T(s, A.farCue, .3, idx), tW = T(s, A.waveCue, .3, idx);
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: true, frontClouds: false }, envFront: false,
      spots: { near: [A.shopX + 120, GY - 380, 1.12], far: [A.mtX - 40, GY - 470, 1.0], trail: [A.mtX - 60, GY - 420, 1.15] },
      back: () => {
        // mountain
        const mx = A.mtX; ctx.beginPath(); ctx.moveTo(mx - 620, GY); ctx.lineTo(mx + 300, GY - 900); ctx.lineTo(mx + 900, GY); ctx.closePath(); ctx.fillStyle = "#7FA563"; ctx.fill(); ol(ctx, 7);
        ctx.beginPath(); ctx.moveTo(mx + 300, GY - 900); ctx.lineTo(mx + 190, GY - 790); ctx.lineTo(mx + 250, GY - 800); ctx.lineTo(mx + 300, GY - 760); ctx.lineTo(mx + 360, GY - 800); ctx.lineTo(mx + 410, GY - 790); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
        const P = trailPts(mx), hot = t >= tW; ctx.strokeStyle = hot ? ORANGE : "#E9D6BC"; ctx.lineWidth = hot ? 16 : 12; ctx.setLineDash([26, 14]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.setLineDash([]);
        if (hot){ [[2, "naik"], [3, "turun"], [5, "naik"], [6, "turun"]].forEach(([i, w], n) => { const k = t - tW - n * .25; if (k < 0) return; const p = P[i]; popChip(ctx, w === "naik" ? "▲" : "▼", p[0] + 50, p[1] - 50, k, w === "naik" ? GREEN : RED, "#FFFFFF", 30); }); }
        // flag at the summit
        const fx = mx + 300, fy = GY - 800; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - 170); ctx.stroke(); const w = Math.sin(t * 4) * 10;
        ctx.beginPath(); ctx.moveTo(fx, fy - 170); ctx.quadraticCurveTo(fx + 70, fy - 175 + w, fx + 140, fy - 160); ctx.lineTo(fx + 140, fy - 100); ctx.quadraticCurveTo(fx + 70, fy - 115 + w, fx, fy - 110); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4);
        textC(ctx, "JAUH", fx + 70, fy - 124, 30, "#FFFFFF", 900);
        // tiny hiker on the trail
        const u = ((t * .07) % 1), hp = alongPts(P, u); ctx.save(); ctx.translate(hp[0], hp[1] - 10); const bb = Math.abs(Math.sin(t * 10)) * 4; ctx.translate(0, -bb);
        ctx.fillStyle = ORANGE; rr(ctx, -16, -60, 22, 34, 6); ctx.fill(); ol(ctx, 3); ctx.fillStyle = TEAL; rr(ctx, -8, -62, 22, 42, 8); ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(4, -76, 13, 0, TAU); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 3);
        ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-2, -20); ctx.lineTo(-8 + Math.sin(t * 10) * 6, 0); ctx.moveTo(8, -20); ctx.lineTo(12 - Math.sin(t * 10) * 6, 0); ctx.stroke(); ctx.restore();
        // shop door (near)
        const sx = A.shopX; ctx.fillStyle = "#F3D9B5"; ctx.fillRect(sx - 300, GY - 700, 520, 700); ol(ctx, 6); for (let i = 0; i < 7; i++){ ctx.fillStyle = i % 2 ? "#FFFFFF" : TEAL; ctx.fillRect(sx - 300 + i * 74, GY - 760, 74, 80); } ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(sx - 300, GY - 760, 520, 80);
        rr(ctx, sx - 40, GY - 470, 210, 470, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(sx + 140, GY - 230, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
        rr(ctx, sx - 60, GY - 30, 250, 30, 8); ctx.fillStyle = "#B5562A"; ctx.fill(); ol(ctx, 4);
        [[sx + 20, -.1], [sx + 90, .1]].forEach(([x, r]) => { ctx.save(); ctx.translate(x, GY - 38); ctx.rotate(r); ctx.beginPath(); ctx.ellipse(0, 0, 34, 14, 0, 0, TAU); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 3); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(4, -12); ctx.lineTo(16, -2); ctx.stroke(); ctx.restore(); });
        rr(ctx, sx - 30, GY - 560, 190, 60, 12); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); textC(ctx, "DEKAT", sx + 65, GY - 518, 32, TEAL, 900);
        if (t >= tN && t < tN + .8) burstFx(ctx, sx + 65, GY - 300, t - tN, TEAL, 10, 220);
        if (t >= tF && t < tF + .8) burstFx(ctx, fx + 60, fy - 130, t - tF, ORANGE, 12, 220);
      } });
  }, sfxWith((s, f, i, add) => { const A = f.dist || {}; if (A.nearCue) add(cueT(s, A.nearCue, .3, i), "chime"); if (A.farCue) add(cueT(s, A.farCue, .3, i), "chime"); if (A.waveCue) add(cueT(s, A.waveCue, .3, i), "pop"); }));

  /* _bagi: dividing the money at the table: a sandal box (TABUNGAN) and a mountain-boot box (INVESTASI); labelled envelopes fly in;
     later a calm wavy line above the boot box while she sips tea
     f.split {deskX, envs:[{cue, text, to: 0|1}], yearsCue, calmCue} */
  function shoeBox(ctx, x, y, kind, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); const sq = o.bump ? 1 + .08 * Math.sin(o.bump * 20) * Math.max(0, 1 - o.bump * 3) : 1; ctx.scale(1 / sq, sq);
    rr(ctx, -130, -150, 260, 150, 12); ctx.fillStyle = kind ? "#C2691F" : "#2F6F73"; ctx.fill(); ol(ctx, 6); rr(ctx, -140, -170, 280, 40, 10); ctx.fillStyle = kind ? "#A35516" : "#25595C"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -110, -110, 220, 46, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, kind ? "INVESTASI" : "TABUNGAN", 0, -77, 30, BROWN, 900, 200);
    ctx.save(); ctx.translate(0, -40); ctx.scale(.9, .9);
    if (kind){ ctx.beginPath(); ctx.moveTo(-40, 10); ctx.lineTo(-40, -24); ctx.lineTo(-8, -24); ctx.lineTo(-8, -6); ctx.quadraticCurveTo(26, -4, 30, 8); ctx.lineTo(30, 14); ctx.lineTo(-40, 14); ctx.closePath(); ctx.fillStyle = "#7A4A2A"; ctx.fill(); ol(ctx, 3); }
    else { ctx.beginPath(); ctx.ellipse(0, 0, 40, 14, 0, 0, TAU); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 3); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-14, -4); ctx.lineTo(2, -14); ctx.lineTo(16, -2); ctx.stroke(); }
    ctx.restore(); ctx.restore(); }
  TT.scene(PX + "bagi", "Cerita: membagi amplop ke kotak sandal (tabungan) dan kotak sepatu gunung (investasi), lalu tenang", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ deskX: 700 }, f.split || {});
    const envs = (A.envs || []).map((e, n) => Object.assign({ T: T(s, e.cue, .3 + n * .1, idx) }, e)), tY = T(s, A.yearsCue, .3, idx), tC = T(s, A.calmCue, .3, idx);
    const bx = [A.deskX - 140, A.deskX + 160], by = GY - 290;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 960 },
      spots: { boxes: [A.deskX, GY - 520, 1.1] },
      back: () => { prop(ctx, "desk", A.deskX, GY, { s: 1.05 }, t); },
      front: (c2, c, sts) => {
        const bumps = [null, null]; envs.forEach(e => { if (t >= e.T + .7) bumps[e.to] = t - e.T - .7; });
        [0, 1].forEach(k => { ctx.save(); ctx.translate(bx[k], by - 14); ctx.scale(1.2, 1.2); shoeBox(ctx, 0, 0, k, t, { bump: bumps[k] }); ctx.restore(); });
        const h = handOf(sts[0]);
        envs.forEach((e, n) => { if (t < e.T - .2) return; const q = clamp((t - e.T) / .7, 0, 1); if (q >= 1) return; const x = lerp(h[0], bx[e.to], easeIO(q)), y = lerp(h[1], by - 170, easeIO(q)) - Math.sin(q * Math.PI) * 220;
          drawItem(ctx, "envelope", x, y, t, { s: 1.1 - q * .4, text: e.text, rot: q * .6 }); });
        envs.forEach((e) => { if (t < e.T + .7) return; const k = t - e.T - .7; if (k < 2.6){ ctx.save(); ctx.globalAlpha = clamp(1 - (k - 2) / .6, 0, 1); const p = [bx[e.to], by - 230]; popChip(ctx, e.text, p[0], p[1] - k * 10, k, e.to ? ORANGE : TEAL, "#FFFFFF", 30); ctx.restore(); } });
        if (t >= tY){ popChip(ctx, "20 TAHUN", bx[1] + 40, by - 330, t - tY, NAVY, "#FFFFFF", 34, .05); }
        if (t >= tC){ const q = clamp((t - tC) / .6, 0, 1); ctx.save(); ctx.globalAlpha = q; ctx.strokeStyle = ORANGE; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); for (let i = 0; i <= 24; i++){ const xx = bx[1] - 160 + i * 14, yy = by - 470 - i * 4 + Math.sin(i * .9 + t * 3) * 26; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
      } });
  }, sfxWith((s, f, i, add) => { const A = f.split || {}; (A.envs || []).forEach((e, n) => { add(cueT(s, e.cue, .3 + n * .1, i), "whoosh"); add(cueT(s, e.cue, .3 + n * .1, i) + .7, "pop"); }); if (A.yearsCue) add(cueT(s, A.yearsCue, .3, i), "pop"); if (A.calmCue) add(cueT(s, A.calmCue, .3, i), "chime"); }));

  /* =====================================================================================================
     MS40 "Pulang dengan selamat"
     ===================================================================================================== */
  function digiSign(ctx, x, y, txt, t, col){ ctx.save(); ctx.translate(x, y); rr(ctx, -150, -62, 300, 124, 18); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6);
    glowAt(ctx, 0, 0, 200, col || "#FF5A4A", .25); textC(ctx, txt, 0, 26, 76, col || "#FF5A4A", 900); ctx.restore(); }

  /* _pabrik: factory gate at night; shift over (22.00 board), yawning, mounting the motorbike with the helmet strap loose, phone glowing
     f.gate {clockX, clockText, looseCue, phoneCue} (motors/straps/hold come from base) */
  TT.scene(PX + "pabrik", "Cerita: gerbang pabrik malam, shift selesai 22.00, naik motor tali helm lepas & ponsel menyala", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ clockX: 800, clockText: "22.00" }, f.gate || {});
    const tL = T(s, A.looseCue, .3, idx);
    base(ctx, s, t, { env: "pabrik", envOpt: { gateX: 330, gateText: "SHIFT SELESAI" },
      spots: { head: () => { const st = SH(s, t).toons ? null : null; return [600, 1000, 1.3]; } },
      back: () => { digiSign(ctx, A.clockX, GY - 860, A.clockText, t, "#FF6A4A"); },
      over: (c2, c, sts, R) => { const r = R[0]; if (t >= tL && r && r.screen){ const p = r.screen.head; popChip(ctx, "TALI HELM LEPAS", clamp(p[0] - 120, 260, 820), Math.max(300, p[1] - 300), t - tL, RED, "#FFFFFF", 36, -.05); } } });
  }, sfxWith((s, f, i, add) => { const A = f.gate || {}; if (A.looseCue) add(cueT(s, A.looseCue, .3, i), "ping"); }));

  /* night road with scrolling dashes + passing street lamps; truck */
  function roadNight(ctx, t, v, x0){ const off = x0; ctx.fillStyle = "#2C2832"; ctx.fillRect(-2000, GY - 120, 5080, 2000); ctx.fillStyle = "#4A4352"; ctx.fillRect(-2000, GY - 130, 5080, 16);
    ctx.fillStyle = "#F2E6D0"; for (let x = -2000 + ((-off) % 260 + 260) % 260; x < 3000; x += 260) ctx.fillRect(x, GY + 60, 140, 14);
    for (let i = -2; i < 6; i++){ const x = i * 700 + ((-off * .8) % 700 + 700) % 700; ctx.fillStyle = "#3B3A3F"; ctx.fillRect(x - 8, GY - 760, 16, 640); ctx.fillRect(x - 8, GY - 760, 110, 14);
      glowAt(ctx, x + 100, GY - 720, 300, "#FFD08A", .35); ctx.fillStyle = "#FFE3A8"; ctx.beginPath(); ctx.ellipse(x + 100, GY - 740, 28, 14, 0, 0, TAU); ctx.fill(); } }
  function truck(ctx, x, t, o){ o = o || {}; ctx.save(); ctx.translate(x, GY); ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(400, 6, 560, 24, 0, 0, TAU); ctx.fill();
    rr(ctx, 200, -720, 820, 560, 16); ctx.fillStyle = "#B5562A"; ctx.fill(); ol(ctx, 7); ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 6; for (let i = 1; i < 6; i++){ ctx.beginPath(); ctx.moveTo(200 + i * 137, -710); ctx.lineTo(200 + i * 137, -170); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(0, -160); ctx.lineTo(0, -470); ctx.quadraticCurveTo(10, -600, 120, -610); ctx.lineTo(210, -610); ctx.lineTo(210, -160); ctx.closePath(); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 7);
    ctx.beginPath(); ctx.moveTo(24, -460); ctx.quadraticCurveTo(34, -570, 120, -578); ctx.lineTo(180, -578); ctx.lineTo(180, -440); ctx.closePath(); ctx.fillStyle = "#9FC6D6"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -20, -220, 120, 60, 10); ctx.fillStyle = "#6E7480"; ctx.fill(); ol(ctx, 5);
    [130, 520, 860].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -80, 80, 0, TAU); ctx.fillStyle = "#2B2430"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(wx, -80, 34, 0, TAU); ctx.fillStyle = "#B8BEC8"; ctx.fill(); });
    ctx.beginPath(); ctx.ellipse(6, -300, 18, 34, 0, 0, TAU); ctx.fillStyle = "#FFF6C8"; ctx.fill(); ol(ctx, 4);
    if (o.glare){ ctx.save(); ctx.globalAlpha = o.glare * .55; const g = ctx.createLinearGradient(0, 0, -900, 0); g.addColorStop(0, "#FFF6C8"); g.addColorStop(1, "rgba(255,246,200,0)"); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(0, -320); ctx.lineTo(-1000, -700); ctx.lineTo(-1000, 120); ctx.lineTo(0, -280); ctx.closePath(); ctx.fill(); ctx.restore(); glowAt(ctx, 6, -300, 220 * o.glare, "#FFFFFF", .9 * o.glare); }
    ctx.restore(); }
  function eyelids(ctx, c){ if (c <= 0) return; ctx.save(); ctx.fillStyle = "#0B0710"; const h = 980 * c;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1080, 0); ctx.lineTo(1080, h - 120 * c); ctx.quadraticCurveTo(540, h + 120 * c, 0, h - 120 * c); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 1920); ctx.lineTo(1080, 1920); ctx.lineTo(1080, 1920 - h + 120 * c); ctx.quadraticCurveTo(540, 1920 - h - 120 * c, 0, 1920 - h + 120 * c); ctx.closePath(); ctx.fill(); ctx.restore(); }

  /* _jalan: riding home at night; phone rings, glance down, eyelids close over the screen, truck headlights, hard braking (skid, smoke), near miss
     f.ride {speed, lidCue, truckCue, brakeCue, phewCue, truckX} */
  TT.scene(PX + "jalan", "Cerita: naik motor malam, ponsel berdering, kelopak mata menutup layar, truk muncul, rem mendadak", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ speed: 900, truckX: 960 }, f.ride || {});
    const tLid = T(s, A.lidCue, .3, idx), tTr = T(s, A.truckCue, .3, idx), tBr = T(s, A.brakeCue, .3, idx), tPh = T(s, A.phewCue, .3, idx);
    const vAt = tt => tt < tBr ? A.speed : A.speed * Math.exp(-(tt - tBr) * 4);
    const dist = t < tBr ? t * A.speed : tBr * A.speed + A.speed * (1 - Math.exp(-(t - tBr) * 4)) / 4;
    base(ctx, s, t, { env: "night",
      mod: (sts) => { sts.forEach(st => { st.y += Math.sin(t * 22) * (vAt(t) / A.speed) * 2; }); },
      back: () => { roadNight(ctx, t, A.speed, dist);
        if (t >= tTr){ const k = t - tTr, q = eOut(clamp(k / .9, 0, 1)); truck(ctx, lerp(A.truckX + 900, A.truckX, q), t, { glare: clamp(k / .3, 0, 1) * (t < tBr + 1 ? 1 : .6) }); }
        if (t >= tBr){ const k = t - tBr; ctx.strokeStyle = "rgba(10,10,10,.6)"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(140 - Math.min(1, k * 2) * 380, GY + 6); ctx.lineTo(140, GY + 6); ctx.stroke(); dust(ctx, 170, GY - 30, k, 10, "#B9B4C8"); }
        if (t < tBr) speedLines(ctx, -300, 1400, 700, 1500, t, .25, "#FFFFFF");
      },
      over: () => {
        // eyelids: close slowly from lidCue, snap open at truckCue
        let lid = 0; if (t >= tLid && t < tTr){ lid = clamp((t - tLid) / 1.4, 0, 1) * (.42 + .2 * Math.abs(Math.sin((t - tLid) * 2.2))); } else if (t >= tTr && t < tTr + .25) lid = .5 * (1 - (t - tTr) / .25);
        eyelids(ctx, lid);
        if (t >= tTr && t < tTr + .3){ ctx.save(); ctx.globalAlpha = .7 * (1 - (t - tTr) / .3); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
        if (t >= tBr) popWord(ctx, "CIIIT!", 560, 520, t - tBr, { size: 120, hold: 1.2, rot: -8, col: RED });
        if (t >= tPh) popWord(ctx, "Hampir saja!", 540, 420, t - tPh, { size: 96, hold: 2.2, rot: -4 });
      } });
  }, sfxWith((s, f, i, add) => { const A = f.ride || {}; if (A.truckCue) add(cueT(s, A.truckCue, .3, i), "ping"); if (A.brakeCue) add(cueT(s, A.brakeCue, .3, i), "whoosh"); if (A.phewCue) add(cueT(s, A.phewCue, .3, i), "pop"); }));

  /* _tunggu: living room at night; mother and daughter wait on the sofa, the wall clock races, dinner under a food cover, the child's drawing AYAH
     f.wait {clockX, clockY, fastCue, times:[{cue, text}], drawCue} */
  function foodCover(ctx, x, y, t){ ctx.fillStyle = "#8E5A34"; rr(ctx, x - 170, y, 340, 26, 8); ctx.fill(); ol(ctx, 5); ctx.fillRect(x - 140, y + 26, 20, 140); ctx.fillRect(x + 120, y + 26, 20, 140);
    ctx.beginPath(); ctx.ellipse(x, y - 4, 150, 16, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.moveTo(x - 140, y - 6); ctx.quadraticCurveTo(x - 130, y - 150, x, y - 156); ctx.quadraticCurveTo(x + 130, y - 150, x + 140, y - 6); ctx.closePath(); ctx.fillStyle = hexA("#E8A55B", .85); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA("#8E4E2E", .5); ctx.lineWidth = 3; for (let i = -3; i <= 3; i++){ ctx.beginPath(); ctx.moveTo(x + i * 36, y - 6); ctx.lineTo(x + i * 10, y - 150); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y - 166, 12, 0, TAU); ctx.fillStyle = "#8E4E2E"; ctx.fill(); }
  TT.scene(PX + "tunggu", "Cerita: ruang keluarga malam, ibu & anak menunggu di sofa, jam dinding berlari, tudung saji, gambar AYAH", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ clockX: 820, clockY: 640 }, f.wait || {});
    const tF = T(s, A.fastCue, .3, idx), tD = T(s, A.drawCue, .3, idx); let txt = null, tT = -9; (A.times || []).forEach((m, n) => { const tm = T(s, m.cue, .3 + n * .1, idx); if (t >= tm){ txt = m.text; tT = tm; } });
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 120 },
      spots: { clock: [A.clockX - 60, A.clockY + 160, 1.25] },
      back: () => { if (!f.wait) return;
        const sp = t < tF ? .5 : 6 + Math.min(10, (t - tF) * 3); ctx.save(); ctx.translate(A.clockX, A.clockY); ctx.scale(1.4, 1.4); prop(ctx, "clock", 0, 0, {}, t * (t < tF ? 1 : 1) + (t >= tF ? (t - tF) * sp * .9 : 0)); ctx.restore();
        if (t >= tF) for (let i = 0; i < 3; i++){ ctx.save(); ctx.globalAlpha = .6; ctx.strokeStyle = "#FFF4E6"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(A.clockX, A.clockY, 150 + i * 22, -1 + t * 4 + i, -.4 + t * 4 + i); ctx.stroke(); ctx.restore(); }
        foodCover(ctx, 150, GY - 180, t);
      },
      over: (c2, c, sts, R) => { if (!f.wait) return; if (txt){ const p = R.c.toScreen(A.clockX, A.clockY + 190); popChip(ctx, txt, clamp(p[0], 220, 860), p[1] + 20, t - tT, NAVY, "#FFFFFF", 40, .04); }
        if (t >= tD && R[1] && R[1].screen){ const p = R[1].screen.head, k = t - tD, q = eBack(clamp(k / .4, 0, 1)); ctx.save(); ctx.translate(clamp(p[0] + 180, 240, 860), p[1] - 190); ctx.rotate(.08 + Math.sin(t * 3) * .03); ctx.scale(q, q);
          rr(ctx, -130, -100, 260, 190, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#5B7DB1"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-50, -30, 24, 0, TAU); ctx.moveTo(-50, -6); ctx.lineTo(-50, 50); ctx.moveTo(-80, 14); ctx.lineTo(-20, 14); ctx.stroke();
          ctx.strokeStyle = "#B5556B"; ctx.beginPath(); ctx.arc(30, -20, 18, 0, TAU); ctx.moveTo(30, -2); ctx.lineTo(30, 40); ctx.stroke(); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(90, -40); ctx.bezierCurveTo(70, -70, 40, -40, 90, -5); ctx.bezierCurveTo(140, -40, 110, -70, 90, -40); ctx.fill();
          textC(ctx, "AYAH", -10, 80, 34, BROWN, 900); ctx.restore(); } } });
  }, sfxWith((s, f, i, add) => { const A = f.wait || {}; if (A.fastCue) add(cueT(s, A.fastCue, .3, i), "whoosh"); if (A.drawCue) add(cueT(s, A.drawCue, .3, i), "pop"); (A.times || []).forEach((m, n) => add(cueT(s, m.cue, .3 + n * .1, i), "ping")); }));

  /* _klik: (A) close-up: the helmet strap clicks shut (giant buckle overlay), the phone drops into the bag; (B) a roadside guard hut: pulls over,
     sits, stretches, warm drink; (C) home door opens, the daughter runs into a hug
     f.click {buckleCue, bagCue}, f.rest {hutX}, f.door {x, openCue} */
  function guardHut(ctx, x, t){ // roadside rest spot: big shady tree, bench, lamp post, sign
    const tx = x + 230; ctx.fillStyle = "#6E4A30"; ctx.beginPath(); ctx.moveTo(tx - 60, GY - 120); ctx.lineTo(tx - 40, GY - 760); ctx.lineTo(tx + 40, GY - 760); ctx.lineTo(tx + 60, GY - 120); ctx.closePath(); ctx.fill(); ol(ctx, 6);
    const sw = Math.sin(t * 1.2) * 8; ctx.fillStyle = "#2F4A3A"; ctx.beginPath(); [[0, 0, 280], [-230, 70, 190], [230, 60, 200], [-120, -170, 190], [140, -160, 190]].forEach(([dx, dy, r]) => { ctx.moveTo(tx + dx + sw + r, GY - 860 + dy); ctx.arc(tx + dx + sw, GY - 860 + dy, r, 0, TAU); }); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.beginPath(); ctx.arc(tx - 100 + sw, GY - 950, 110, 0, TAU); ctx.fill();
    for (let i = 0; i < 6; i++){ const q = (t * .25 + i / 6) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .9; ctx.fillStyle = "#FFF3A0"; ctx.beginPath(); ctx.arc(x - 200 + rnd(i) * 700 + Math.sin(t * 2 + i) * 30, GY - 400 - q * 400, 6, 0, TAU); ctx.fill(); glowAt(ctx, x - 200 + rnd(i) * 700 + Math.sin(t * 2 + i) * 30, GY - 400 - q * 400, 24, "#FFF3A0", .6); ctx.restore(); }
    rr(ctx, x - 300, GY - 230, 600, 40, 8); ctx.fillStyle = "#C88E5A"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 300, GY - 330, 600, 30, 8); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#5A3A22"; ctx.fillRect(x - 270, GY - 190, 20, 190); ctx.fillRect(x + 250, GY - 190, 20, 190);
    const lx = x - 380; ctx.fillStyle = "#3B3A3F"; ctx.fillRect(lx - 8, GY - 820, 16, 820); ctx.fillRect(lx - 8, GY - 820, 110, 14); glowAt(ctx, lx + 100, GY - 780, 320, "#FFD08A", .5 + .05 * Math.sin(t * 8)); ctx.fillStyle = "#FFE3A8"; ctx.beginPath(); ctx.ellipse(lx + 100, GY - 798, 28, 14, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#5A3A22"; ctx.fillRect(x + 380, GY - 420, 14, 420); rr(ctx, x + 250, GY - 560, 280, 140, 12); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); textC(ctx, "ISTIRAHAT", x + 390, GY - 500, 36, "#FFFFFF", 900, 250); textC(ctx, "DULU", x + 390, GY - 452, 36, "#FFFFFF", 900, 250); }
  function houseDoor(ctx, x, t, open){ ctx.fillStyle = "#E9D6BC"; ctx.fillRect(x - 520, GY - 900, 1040, 900); ol(ctx, 6); ctx.fillStyle = "#C99A6E"; ctx.fillRect(x - 520, GY - 940, 1040, 60);
    rr(ctx, x - 130, GY - 560, 260, 560, 8); ctx.fillStyle = "#FFE3A8"; ctx.fill(); glowAt(ctx, x, GY - 300, 420 * open, "#FFE3A8", .7 * open);
    ctx.save(); ctx.translate(x - 130, 0); ctx.scale(1 - .85 * open, 1); rr(ctx, 0, GY - 560, 260, 560, 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(220, GY - 280, 12, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore();
    [[-340], [340]].forEach(([dx]) => { rr(ctx, x + dx - 90, GY - 640, 180, 200, 8); ctx.fillStyle = "#F4C27A"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + dx, GY - 640); ctx.lineTo(x + dx, GY - 440); ctx.stroke(); });
    ctx.fillStyle = "#3E7D4F"; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.arc(x - 470 + i * 30, GY - 40 - (i % 2) * 20, 50, 0, TAU); ctx.fill(); } }
  TT.scene(PX + "klik", "Cerita: tali helm dikunci KLIK, ponsel masuk tas, menepi istirahat di bangku bawah pohon, disambut anak di pintu", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, CK = f.click, RS = f.rest, DR = f.door;
    const tB = CK ? T(s, CK.buckleCue, .3, idx) : 1e9, tBag = CK ? T(s, CK.bagCue, .3, idx) : 1e9, tO = DR ? T(s, DR.openCue, .3, idx) : 1e9;
    base(ctx, s, t, { env: RS ? "night" : (DR ? "street" : "night"), envOpt: { time: "night" },
      back: () => { if (RS) guardHut(ctx, RS.hutX ?? 640, t); if (DR) houseDoor(ctx, DR.x ?? 560, t, t < tO ? 0 : eOut(clamp((t - tO) / .6, 0, 1))); },
      over: (c2, c, sts, R) => {
        if (CK && t >= tB){ const k = t - tB, q = eBack(clamp(k / .35, 0, 1)), snap = clamp((k - .2) / .2, 0, 1); ctx.save(); ctx.translate(800, 420); ctx.scale(q * 1.1, q * 1.1); ctx.rotate(-.08);
          ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ol(ctx, 7);
          ctx.fillStyle = "#2C2433"; rr(ctx, -130, -20, 90, 40, 8); ctx.fill(); rr(ctx, 40, -20, 90, 40, 8); ctx.fill();
          rr(ctx, -60 + 30 * (1 - snap), -34, 70, 68, 12); ctx.fillStyle = "#6E7480"; ctx.fill(); ol(ctx, 4); rr(ctx, 0 - 10 * (1 - snap), -28, 60, 56, 12); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
          ctx.restore(); if (k > .35) burstFx(ctx, 800, 420, k - .35, GOLD, 12, 170); popWord(ctx, "KLIK!", 800, 640, k - .3, { size: 100, hold: 1.4, rot: -6 }); }
        if (CK && t >= tBag){ const k = t - tBag, r = R[0]; if (r && r.screen && k < 1.2){ const h = r.screen.head, q = clamp(k / .6, 0, 1); drawItem(ctx, "phone", lerp(h[0] + 160, 300, q), lerp(h[1] + 120, 1130, q) - Math.sin(q * Math.PI) * 160, t, { s: 1.3 * (1 - q * .5), glow: q < .5, rot: q * 3 }); }
          drawItem(ctx, "bag", 300, 1200, t, { s: 1.4 * eBack(clamp(k / .3, 0, 1)), col: "#5A4A6B" }); if (k > .6 && k < 1.4) popChip(ctx, "PONSEL DISIMPAN", 330, 1040, k - .6, TEAL, "#FFFFFF", 32, -.04); }
      } });
  }, sfxWith((s, f, i, add) => { const all = [f].concat(f.shots || []); all.forEach(F => { if (F.click){ add(cueT(s, F.click.buckleCue, .3, i) + .3, "chime"); add(cueT(s, F.click.bagCue, .3, i), "whoosh"); } if (F.door) add(cueT(s, F.door.openCue, .3, i), "chime"); }); }));

  /* =====================================================================================================
     SB41 "Kenali kekuatanmu"
     ===================================================================================================== */
  function plaster(ctx, x, y, s, rot, txt){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    rr(ctx, -120, -34, 240, 68, 34); ctx.fillStyle = "#F1C9A0"; ctx.fill(); ol(ctx, 5); rr(ctx, -50, -26, 100, 52, 10); ctx.fillStyle = "#E3AE80"; ctx.fill();
    ctx.fillStyle = hexA("#8E5A34", .5); for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.arc(-90 + (i % 3) * 14 + (i > 2 ? 150 : 0), -10 + Math.floor((i % 3) / 2) * 18, 3, 0, TAU); ctx.fill(); }
    textC(ctx, txt, 0, 11, 30, BROWN, 900, 96); ctx.restore(); }

  /* _tambal: late night at the desk; plasters labelled with weaknesses fly in and stick all over the hero; result stamp PAS-PASAN
     f.patch {items:[{cue, text, dx, dy, rot}], gradeCue, deskX} */
  TT.scene(PX + "tambal", "Cerita: lembur malam, plester kelemahan (TABEL, DESAIN, LAPORAN) menempel di badan, hasil pas-pasan", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ deskX: 800 }, f.patch || {});
    const items = (A.items || []).map((p, n) => Object.assign({ T: T(s, p.cue, .3 + n * .05, idx) }, p)), tG = T(s, A.gradeCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { time: "night", deskX: -800, plantX: -600 },
      back: () => { prop(ctx, "desk", A.deskX, GY, { laptop: true, mug: true, papers: 5 }, t); },
      over1: (c2, c, sts, j) => { if (j !== 0) return; const st = sts[0], k = st.size / 92, fc = st.face || 1;
        items.forEach((p, n) => { if (t < p.T) return; const q = clamp((t - p.T) / .4, 0, 1), e = eBack(q); const tx = st.x + p.dx * k * fc, ty = st.y + p.dy * k;
          const x = lerp(tx + (n % 2 ? 700 : -700), tx, eOut(q)), y = lerp(ty - 500, ty, eOut(q)); plaster(ctx, x, y, (.9 + .3 * (1 - e)) * k / 8, (p.rot || 0) + (1 - q) * 3, p.text);
          if (q >= 1 && t - p.T < .8) burstFx(ctx, tx, ty, t - p.T - .4, HL, 8, 90); }); },
      over: () => { if (t >= tG){ stampBox(ctx, "PAS-PASAN", 540, 460, t - tG, RED, 76, -.1); } } });
  }, sfxWith((s, f, i, add) => { const A = f.patch || {}; (A.items || []).forEach((p, n) => add(cueT(s, p.cue, .3 + n * .05, i) + .35, "pop")); if (A.gradeCue) add(cueT(s, A.gradeCue, .3, i), "ping"); }));

  /* _binar: product showroom; the hero explains a product, customers' eyes turn into stars, a warm aura glows around her; the boss peeks in
     f.shine {hero, fans:[toon idx], starCue, auraCue, product} */
  TT.scene(PX + "binar", "Cerita: toko produk, menjelaskan ke pelanggan, mata pelanggan jadi bintang, aura bersinar", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ hero: 0, fans: [1, 2] }, f.shine || {});
    const tS = T(s, A.starCue, .3, idx), tA = T(s, A.auraCue, .3, idx);
    base(ctx, s, t, { env: "toko", envOpt: { banner: A.banner || "PRODUK BARU" },
      under: (c2, c, sts, j) => { if (j !== A.hero || t < tA) return; const st = sts[j], k = st.size / 92, q = clamp((t - tA) / .6, 0, 1), cx = st.x, cy = st.y - 50 * k;
        glowAt(ctx, cx, cy, 520 * q, GOLD, .55 + .1 * Math.sin(t * 5)); ctx.save(); ctx.globalAlpha = .5 * q; ctx.strokeStyle = "#FFF1C9"; ctx.lineWidth = 10; for (let i = 0; i < 14; i++){ const a = i / 14 * TAU + t * .4, r0 = 330, r1 = 430 + 30 * Math.sin(t * 4 + i); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke(); } ctx.restore(); },
      over1: (c2, c, sts, j, R) => { if (!A.fans.includes(j) || t < tS || !R[j]) return; const r = R[j], k = r.k, fc = r.face, q = eBack(clamp((t - tS - A.fans.indexOf(j) * .2) / .35, 0, 1)); if (q <= 0) return;
        [-1, 1].forEach(d => { const ex = r.headX + (2.6 + d * 7.3) * k * fc - 2 * k * fc, ey = r.headY - 1 * k; ctx.save(); ctx.translate(ex, ey); ctx.rotate(t * 2 * d); ctx.scale(q, q);
          ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? 3.2 * k : 7.5 * k; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.2 * k; ctx.stroke(); ctx.restore(); });
        for (let i = 0; i < 3; i++){ const qq = (t * .8 + i / 3 + j * .2) % 1; ctx.save(); ctx.globalAlpha = Math.sin(qq * Math.PI); sparkle(ctx, r.headX + (i - 1) * 16 * k, r.top - qq * 20 * k, 3 * k, i % 2 ? GOLD : "#FFFFFF"); ctx.restore(); } } });
  }, sfxWith((s, f, i, add) => { const A = f.shine || {}; if (A.starCue) add(cueT(s, A.starCue, .3, i), "chime"); if (A.auraCue) add(cueT(s, A.auraCue, .3, i), "chime"); }));

  /* _ikan: fable in the park: a fish forced to climb a tree keeps sliding down (sweat, GAGAL); dropped into the river it shoots off like a rocket
     f.fish {treeX, riverX, climbCue, failCue, waterCue} */
  function fishDraw(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * (o.face || 1), s); const w = Math.sin(t * (o.fast ? 30 : 8)) * .35;
    ctx.save(); ctx.translate(-110, 0); ctx.rotate(w); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-80, -60); ctx.quadraticCurveTo(-60, 0, -80, 60); ctx.closePath(); ctx.fillStyle = "#E8742A"; ctx.fill(); ol(ctx, 6); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, 130, 82, 0, 0, TAU); ctx.fillStyle = "#F08C2E"; ctx.fill(); ol(ctx, 7);
    ctx.beginPath(); ctx.moveTo(-40, -76); ctx.quadraticCurveTo(10, -140, 60, -70); ctx.closePath(); ctx.fillStyle = "#E8742A"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 6; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(-30 + i * 30, 0, 40, -.7, .7); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(70, -20, 26, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    if (o.mood === "sad"){ ctx.beginPath(); ctx.arc(74, -12, 10, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#F08C2E"; ctx.fillRect(48, -46, 50, 24); ctx.beginPath(); ctx.moveTo(48, -24); ctx.lineTo(98, -30); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(100, 40, 16, 1.2 * Math.PI, 1.8 * Math.PI); ol(ctx, 5); ctx.fillStyle = SKY; ctx.beginPath(); ctx.ellipse(40, -60 + ((t * 50) % 50), 8, 12, 0, 0, TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(76, -18, 11, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.arc(80, -22, 4, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.arc(96, 22, 20, .1 * Math.PI, .8 * Math.PI); ol(ctx, 5); }
    ctx.restore(); }
  TT.scene(PX + "ikan", "Cerita: dongeng ikan dipaksa memanjat pohon (melorot, gagal), lalu dilepas ke sungai dan melesat", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ treeX: 300, riverX: 640 }, f.fish || {});
    const tC = T(s, A.climbCue, .3, idx), tF = T(s, A.failCue, .3, idx), tW = T(s, A.waterCue, .3, idx);
    let fishS = null;
    base(ctx, s, t, { env: "park", envOpt: { treeX: -900, bench: false }, envFront: false,
      spots: { tree: [A.treeX + 80, 1040, 1.05], river: [A.riverX + 260, 1180, 1.05] },
      back: () => {
        // river
        const rx = A.riverX; ctx.fillStyle = "#4E9FC6"; ctx.beginPath(); ctx.moveTo(rx, GY + 400); ctx.lineTo(rx + 80, GY - 70); ctx.lineTo(rx + 2000, GY - 70); ctx.lineTo(rx + 2000, GY + 400); ctx.closePath(); ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 6; for (let i = 0; i < 8; i++){ const wx = rx + 140 + ((i * 160 + t * 90) % 1200), wy = GY - 20 + (i % 3) * 70; ctx.beginPath(); ctx.arc(wx, wy, 26, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
        // tree
        const tx = A.treeX; ctx.fillStyle = "#7A5236"; ctx.beginPath(); ctx.moveTo(tx - 70, GY); ctx.lineTo(tx - 50, GY - 900); ctx.lineTo(tx + 50, GY - 900); ctx.lineTo(tx + 70, GY); ctx.closePath(); ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 4; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(tx - 30 + i * 10, GY - 100 - i * 120); ctx.quadraticCurveTo(tx, GY - 140 - i * 120, tx + 26, GY - 110 - i * 120); ctx.stroke(); }
        const sw = Math.sin(t * 1.1) * 8; ctx.fillStyle = "#6E9A58"; ctx.beginPath(); [[0, 0, 260], [-200, 60, 180], [200, 60, 180], [-110, -150, 170], [120, -140, 180]].forEach(([dx, dy, r]) => { ctx.moveTo(tx + dx + sw + r, GY - 1000 + dy); ctx.arc(tx + dx + sw, GY - 1000 + dy, r, 0, TAU); }); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.arc(tx - 90 + sw, GY - 1080, 100, 0, TAU); ctx.fill();
        // fish
        if (t < tW){ // climbing: inch up the trunk then slide down
          const cyc = t < tC ? 0 : ((t - tC) % 2.2) / 2.2, up = t >= tF ? Math.max(0, 1 - (t - tF) / .5) * .3 : (cyc < .7 ? cyc / .7 : 1 - (cyc - .7) / .3);
          const fy = GY - 220 - up * 380 - Math.abs(Math.sin(t * 10)) * 10 * (cyc < .7 ? 1 : 0);
          fishS = [tx + 60, fy]; fishDraw(ctx, tx + 60, fy, 1.15, t, { rot: t >= tF ? lerp(-1.5, -.3, clamp((t - tF) / .5, 0, 1)) : -1.5, mood: t >= tC ? "sad" : "happy" });
          if (cyc > .7 && t < tF){ ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 5; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(tx + 130 + i * 20, fy - 160); ctx.lineTo(tx + 130 + i * 20, fy - 260); ctx.stroke(); } }
        } else { const k = t - tW; let x, y, rot = 0, sc = .9, fast = false;
          if (k < .9){ const q = k / .9; x = lerp(A.treeX + 40, rx + 360, q); y = lerp(GY - 220, GY - 20, q) - Math.sin(q * Math.PI) * 420; rot = lerp(-1.2, 1.0, q); }
          else { const k2 = k - .9; x = rx + 360 + Math.sin(k2 * 2.4) * 380; y = GY + 30 + Math.sin(k2 * 6) * 26; rot = 0; fast = true; sc = 1.0; }
          const face = k < .9 ? 1 : (Math.cos((k - .9) * 2.4) >= 0 ? 1 : -1); fishS = [x, y];
          if (k >= .9){ ctx.save(); ctx.globalAlpha = .6; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(x - face * (140 + i * 30), y - 40 + i * 26); ctx.lineTo(x - face * (260 + i * 50), y - 40 + i * 26); ctx.stroke(); } ctx.restore(); }
          fishDraw(ctx, x, y, sc, t, { rot: rot * face, face, fast, mood: "happy" });
          if (k >= .85 && k < 1.6){ const kk = k - .85; for (let i = 0; i < 10; i++){ const a = -Math.PI * (.15 + .7 * i / 9), r = kk * 500; ctx.fillStyle = "#BFE6FF"; ctx.beginPath(); ctx.arc(rx + 360 + Math.cos(a) * r * .6, GY - 40 + Math.sin(a) * r + kk * kk * 600, 14, 0, TAU); ctx.fill(); ol(ctx, 3); } }
        }
      },
      front: () => { const rx = A.riverX; ctx.fillStyle = hexA("#4E9FC6", .55); ctx.fillRect(rx + 60, GY + 20, 2000, 400); },
      over: (c2, c, sts, R) => { if (t >= tF && t < tW && fishS){ const p = R.c.toScreen(fishS[0], fishS[1] - 260); stampBox(ctx, "GAGAL", clamp(p[0] + 60, 220, 860), Math.max(380, p[1]), t - tF, RED, 64, -.12); }
        if (t >= tW + .9 && fishS){ const p = R.c.toScreen(A.riverX + 360, GY - 360); popWord(ctx, "Melesat!", clamp(p[0], 260, 820), p[1], t - tW - .9, { size: 100, hold: 2, rot: -6 }); } } });
  }, sfxWith((s, f, i, add) => { const A = f.fish || {}; if (A.failCue) add(cueT(s, A.failCue, .3, i), "ping"); if (A.waterCue){ add(cueT(s, A.waterCue, .3, i), "whoosh"); add(cueT(s, A.waterCue, .3, i) + .85, "pop"); } }));

  /* _tukar: the boss reshuffles tasks: task cards fly between people and glow green when they land in the right hands; the team sales chart
     rises; 17.00 home on time
     f.swap {cards:[{cue, text, from, to, col}], chartCue, chartX, clockCue, clockText} */
  TT.scene(PX + "tukar", "Cerita: kartu tugas bertukar tangan sesuai kekuatan, grafik penjualan naik, pulang 17.00", (ctx, th, s, t) => {
    const f = SH(s, t), idx = G.scene, A = Object.assign({ chartX: 560 }, f.swap || {});
    const cards = (A.cards || []).map((cd, n) => Object.assign({ T: T(s, cd.cue, .3 + n * .1, idx) }, cd)), tCh = T(s, A.chartCue, .3, idx), tCl = T(s, A.clockCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { deskX: -900, plantX: 1000 },
      back: () => { const p = t < tCh ? .5 : .5 + .5 * eBack(clamp((t - tCh) / .9, 0, 1)); ctx.save(); ctx.translate(A.chartX, GY - 500); ctx.scale(.95, .95); prop(ctx, "board", 0, 0, { bars: [.35, .45, .6, 1], p }, t); ctx.restore();
        textC(ctx, "PENJUALAN TIM", A.chartX, GY - 1110, 34, BROWN, 900, 400);
        if (t >= tCh){ const k = t - tCh; ctx.save(); ctx.translate(A.chartX + 290, GY - 1000 - Math.min(1, k) * 40); const q = eBack(clamp(k / .4, 0, 1)); ctx.scale(q, q); ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(50, 0); ctx.lineTo(20, 0); ctx.lineTo(20, 60); ctx.lineTo(-20, 60); ctx.lineTo(-20, 0); ctx.lineTo(-50, 0); ctx.closePath(); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ctx.restore(); } },
      over: (c2, c, sts, R) => {
        cards.forEach((cd, n) => { if (t < cd.T - .1) return; const a = R[cd.from], b = R[cd.to]; if (!a || !b || !a.screen || !b.screen) return; const pa = a.screen.head, pb = b.screen.head;
          const q = clamp((t - cd.T) / .9, 0, 1), e = easeIO(q), x = lerp(pa[0], pb[0], e), y = lerp(pa[1] - 280, pb[1] - 280, e) - Math.sin(q * Math.PI) * 220; const ok = q >= 1;
          ctx.save(); ctx.translate(clamp(x, 170, 910), Math.max(330, y)); ctx.rotate((1 - e) * .6 * (n % 2 ? 1 : -1) + Math.sin(t * 3 + n) * .04); if (ok) glowAt(ctx, 0, 0, 200, GREEN, .45);
          rr(ctx, -150, -60, 300, 120, 16); ctx.fillStyle = ok ? "#E7F5EA" : PAPER; ctx.fill(); ctx.strokeStyle = ok ? GREEN : OUT; ctx.lineWidth = 7; ctx.stroke(); textC(ctx, cd.text, 0, 14, 40, BROWN, 900, 260);
          if (ok){ ctx.beginPath(); ctx.arc(140, -54, 30, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); check(ctx, 140, -52, 1.1, "#FFFFFF"); } ctx.restore();
          if (ok && t - cd.T < 1.7) burstFx(ctx, clamp(pb[0], 170, 910), Math.max(330, pb[1] - 280), t - cd.T - .9, GREEN, 10, 150); });
        if (t >= tCl){ ctx.save(); ctx.translate(880, 300); const q = eBack(clamp((t - tCl) / .35, 0, 1)); ctx.scale(q, q); rr(ctx, -140, -56, 280, 112, 18); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6); textC(ctx, A.clockText || "17.00", 0, 26, 70, "#7FF0A0", 900); ctx.restore(); }
      } });
  }, sfxWith((s, f, i, add) => { const A = f.swap || {}; (A.cards || []).forEach((cd, n) => { add(cueT(s, cd.cue, .3 + n * .1, i), "whoosh"); add(cueT(s, cd.cue, .3 + n * .1, i) + .9, "chime"); }); if (A.chartCue) add(cueT(s, A.chartCue, .3, i), "pop"); if (A.clockCue) add(cueT(s, A.clockCue, .3, i), "ping"); }));
})();
