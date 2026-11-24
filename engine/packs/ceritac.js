/* Scene pack ceritac: story scenes for MODE CERITA ("motion": {"mode": "cerita"}). Layout prefix cc_.
   Every cc_ scene takes the base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], props[], cards[], stamp)
   plus: toon.grow [{at|cue, size, dur}] (a toon shrinks / grows), f.tint {at|cue, outCue, color, a} (the world changes colour),
   f.spots {name: [x, y, zoom]} for camera keys on:"name". Set pieces:
     cc_iri      envy: spotlight + applause on a rival, the world turns green, the hero shrinks (f.spot, f.claps, f.aura)
     cc_raksasa  exaggerated imagination: dreamy frame + purple tint, a giant rival stomps, a puff pops back to reality (f.dream, f.stomp)
     cc_jejak    glowing footprints along a path, the hero follows them, then branches into his own prints (f.path, f.flag)
     cc_berbagi  lunch table at a warung: knowledge chips arc from one head into another (f.table, f.share)
     cc_serbu    interruptions: focus orb cracks on every hit, ringing phone, a meeting card slams over the document (f.doc, f.orb, f.ring, f.meet)
     cc_kejar    chase: a running paper creature flees, notification obstacles trip the hero, camera follows (f.paper, f.drops)
     cc_balok    giant schedule board in the sky: a big block drops into the empty slot, a bell gets switched off (f.board, f.bell)
     cc_kubah    glass focus dome over the desk: pings bounce off into a "later" tray, dome lifts, document done (f.dome, f.pings, f.done)
     cc_laci     bad-news blob pops out of the laptop and is shoved into a rattling drawer (f.blob, f.drawer)
     cc_sempit   bad-news blob grows at home at night and squeezes the hero into the corner (f.blob)
     cc_kabar    bad-news blob that shrinks with every step said; check stickers; pops into confetti (f.blob, f.checks)
     cc_angka    hologram digit blocks above a laptop; a living extra zero hops into the number (f.digits)
     cc_estafet  a report (with the zero riding on it) is passed hand to hand; approval stamp (f.relay, f.approve)
     cc_gudang   warehouse: boxes rain down and bury the team, money bag gets chained, the zero waves on top (f.boxes, f.money, f.zero)
     cc_debat    split-screen argument with lightning seam + VS, opens into a wide shot with the decision banner (f.camA, f.camB, f.open, f.banner)
     cc_kaki     three-legged race: two toons tied at the ankle; out of step they topple, in step they break the finish tape (f.pair, f.fall, f.signs, f.finish) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, drawToon, prop, infoCard, titleStamp, layer, bubble, G, TAU, CS } = TT;
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", TEAL = "#2F6F73", PAPER = "#FFFDF6", NAVY = "#13223D", GROUND = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const eIn = x => x * x * x;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .5, i ?? G.scene) : (o.T ?? 1e9)));
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.stroke(); };
  const ico = (ctx, name, cx, cy, size, col, lw) => icon(ctx, name, cx - size / 2, cy - size / 2, size, col, lw || 2.4);
  const lg = (ctx, x0, y0, x1, y1, st) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 18)) return size; size -= 2; } }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : "#F6D36B"); }
    ctx.restore(); }
  function confetti(ctx, x, y, k, n, spread){ if (k < 0 || k > 2.6) return; n = n || 26; spread = spread || 1; const pal = [ORANGE, "#F6D36B", TEAL, "#E8604C", CREAM];
    ctx.save(); ctx.globalAlpha *= clamp((2.6 - k) / .6, 0, 1); for (let i = 0; i < n; i++){ const a = -Math.PI / 2 + (rnd(i) - .5) * 2.4, v = (520 + rnd(i + 9) * 520) * spread;
      const px = x + Math.cos(a) * v * k + Math.sin(k * 5 + i) * 20, py = y + Math.sin(a) * v * k + 900 * k * k; ctx.save(); ctx.translate(px, py); ctx.rotate(k * (6 + i % 5) + i);
      ctx.fillStyle = pal[i % pal.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function dust(ctx, x, y, k, n, col, R){ if (k < 0 || k > .8) return; n = n || 7; R = R || 160; const q = eOut(k / .8);
    ctx.save(); ctx.globalAlpha *= (1 - k / .8) * .85; ctx.fillStyle = col || "#EADBC6";
    for (let i = 0; i < n; i++){ const d = (i / (n - 1) - .5) * 2, px = x + d * R * q, py = y - Math.abs(Math.sin(i * 1.7)) * 50 * q - 10; ctx.beginPath(); ctx.arc(px, py, (20 + rnd(i) * 22) * (.6 + q * .6), 0, TAU); ctx.fill(); } ctx.restore(); }
  function dizzy(ctx, x, y, t, r){ for (let k = 0; k < 4; k++){ const a = t * 5 + k * TAU / 4; ctx.fillStyle = k % 2 ? "#F6D36B" : CREAM; ctx.save(); ctx.strokeStyle = OUT; ctx.lineWidth = 3;
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * .3; sparkle(ctx, px, py, 22, k % 2 ? "#F6D36B" : CREAM); ctx.restore(); } }
  function pill(ctx, txt, x, y, size, bg, fg, rot){ font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); return w; }
  // stamp text in a frame, slammed in (k = seconds since)
  function slam(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); font(ctx, 900, size, FAM); const w = ctx.measureText(txt).width + size * .9, h = size * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .94); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }

  /* ---------- characters / objects ---------- */
  // bad-news blob: x centre, y bottom, r radius; o: {mood: worry|evil|sad|calm, label, look:[x,y], sq}
  function blob(ctx, x, y, r, t, o){
    o = o || {}; if (r <= 3) return; const sq = o.sq || 0, w = r * (1 + sq * .5), h = r * 1.2 * (1 - sq * .5);
    ctx.save(); ctx.translate(x, y); ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(25,12,35,.28)"; ctx.beginPath(); ctx.ellipse(0, 4, w * 1.08, r * .14, 0, 0, TAU); ctx.fill();
    glowAt(ctx, 0, -h * .5, r * 1.6, "#7A5A9E", .25);
    const body = () => { ctx.beginPath(); const N = 30; for (let i = 0; i <= N; i++){ const a = Math.PI + i / N * Math.PI, wob = 1 + .05 * Math.sin(t * 3.2 + i * 1.3) + .035 * Math.sin(t * 5.3 + i * .7);
        const px = Math.cos(a) * w * wob, py = Math.sin(a) * h * wob; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      for (let i = 0; i < 5; i++){ const x1 = w - (i + 1) * w * 2 / 5, xm = (w - (i + .5) * w * 2 / 5); ctx.quadraticCurveTo(xm, r * .1 + (i % 2) * r * .06 + Math.sin(t * 4 + i) * 3, x1, 0); } ctx.closePath(); };
    body(); ctx.fillStyle = lg(ctx, 0, -h, 0, 0, [[0, "#8C6BB1"], [1, "#4E3A6E"]]); ctx.fill(); ol(ctx, Math.max(4, r * .05));
    ctx.save(); body(); ctx.clip(); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.ellipse(-w * .45, -h * .7, w * .18, h * .1, -.6, 0, TAU); ctx.fill(); ctx.restore();
    const mood = o.mood || "worry", lk = o.look || [Math.sin(t * .9) * .3, 0], blink = (t % 3.1) < .12 ? .15 : 1;
    [[-.32, -.62], [.3, -.66]].forEach(([ex, ey], k) => { const R = r * .2; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(w * ex, h * ey, R, R * 1.15 * blink, 0, 0, TAU); ctx.fill(); ol(ctx, Math.max(3, r * .03));
      if (blink > .5){ ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(w * ex + lk[0] * R * .45, h * ey + lk[1] * R * .4 + R * .1, R * .45, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(4, r * .05); ctx.lineCap = "round"; ctx.beginPath(); const bx = w * ex, by = h * ey - R * 1.35, s2 = k ? 1 : -1;
      if (mood === "evil"){ ctx.moveTo(bx - s2 * R, by - R * .3); ctx.lineTo(bx + s2 * R * .7, by + R * .35); } else if (mood === "worry" || mood === "sad"){ ctx.moveTo(bx - s2 * R, by + R * .3); ctx.lineTo(bx + s2 * R * .7, by - R * .25); }
      else { ctx.moveTo(bx - R * .8, by); ctx.quadraticCurveTo(bx, by - R * .3, bx + R * .8, by); } ctx.stroke(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(4, r * .05); ctx.beginPath(); const my = -h * .32;
    if (mood === "evil"){ ctx.moveTo(-w * .3, my); ctx.quadraticCurveTo(0, my + r * .3, w * .32, my - r * .05); ctx.fillStyle = "#2A1835"; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-w * .15, my + r * .02, r * .1, r * .08); ctx.fillRect(w * .05, my + r * .02, r * .1, r * .08); }
    else if (mood === "calm"){ ctx.moveTo(-w * .15, my); ctx.quadraticCurveTo(0, my + r * .12, w * .15, my); ctx.stroke(); }
    else { for (let i = 0; i <= 6; i++){ const px = -w * .2 + i * w * .4 / 6, py = my + r * .05 + (i % 2 ? -1 : 1) * r * .04; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    if (mood === "sad" || mood === "worry"){ ctx.fillStyle = "#8FD0EE"; ctx.beginPath(); const sx = w * .62, sy = -h * .7 + ((t * 40) % 30); ctx.moveTo(sx, sy - 14); ctx.quadraticCurveTo(sx + 10, sy, sx, sy + 8); ctx.quadraticCurveTo(sx - 10, sy, sx, sy - 14); ctx.fill(); }
    if (o.label){ const ls = Math.max(18, r * .2); font(ctx, 900, ls, FAM); const lw = ctx.measureText(o.label).width + ls * .9, lh = ls * 1.5; ctx.save(); ctx.translate(-w * .02, -h * .1); ctx.rotate(-.06 + Math.sin(t * 2) * .02);
      ctx.fillStyle = "#F6D36B"; ctx.fillRect(-lw / 2, -lh / 2, lw, lh); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(3, ls * .12); ctx.strokeRect(-lw / 2, -lh / 2, lw, lh); ctx.fillStyle = RED; ctx.textAlign = "center"; ctx.fillText(o.label, 0, ls * .36); ctx.textAlign = "left"; ctx.restore(); }
    ctx.restore();
  }
  // living digit zero: x centre, y bottom, h height; o: {grin, wave, run}
  function zeroGuy(ctx, x, y, h, t, o){
    o = o || {}; const w = h * .62, legT = o.run ? t * 14 : 0; ctx.save(); ctx.translate(x, y); ctx.lineCap = "round";
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 2, w * .6, h * .06, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = h * .07; [-1, 1].forEach(d => { const sw = o.run ? Math.sin(legT + (d > 0 ? Math.PI : 0)) * h * .12 : 0; ctx.beginPath(); ctx.moveTo(d * w * .2, -h * .18); ctx.lineTo(d * w * .25 + sw, 0); ctx.lineTo(d * w * .25 + sw + d * h * .08, 0); ctx.stroke(); });
    const cy = -h * .58; ctx.beginPath(); ctx.ellipse(0, cy, w / 2, h * .42, 0, 0, TAU); ctx.fillStyle = "#E8604C"; ctx.fill(); ol(ctx, h * .05);
    ctx.beginPath(); ctx.ellipse(0, cy, w * .22, h * .24, 0, 0, TAU); ctx.fillStyle = "#3A1F1A"; ctx.fill(); ol(ctx, h * .03);
    // face on the ring (top part)
    const blink = (t % 2.7) < .12 ? .2 : 1; [-1, 1].forEach(d => { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(d * w * .2, cy - h * .3, h * .07, h * .08 * blink, 0, 0, TAU); ctx.fill(); ol(ctx, h * .02);
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(d * w * .2 + h * .02, cy - h * .29, h * .035 * blink, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = h * .03; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * w * .3, cy - h * .43); ctx.lineTo(d * w * .1, cy - h * .38); ctx.stroke(); });
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(0, cy + h * .3, w * .2, h * .05, 0, 0, Math.PI); ctx.fill(); ol(ctx, h * .02);
    // arms
    ctx.strokeStyle = OUT; ctx.lineWidth = h * .06; ctx.beginPath(); ctx.moveTo(-w * .48, cy); ctx.lineTo(-w * .75, cy + h * .15); ctx.stroke();
    const wa = o.wave ? Math.sin(t * 12) * .5 : 0; ctx.beginPath(); ctx.moveTo(w * .48, cy - h * .05); ctx.lineTo(w * .75 + Math.sin(wa) * h * .1, cy - h * .3 - Math.cos(wa) * h * .05); ctx.stroke();
    ctx.restore();
  }
  function digitBlock(ctx, x, y, w, h, ch, o){
    o = o || {}; const d = h * .12; ctx.save(); ctx.translate(x, y); ctx.lineJoin = "round";
    if (ch === "."){ ctx.fillStyle = o.ink || BROWN; ctx.beginPath(); ctx.arc(0, -h * .14, h * .1, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore(); return; }
    ctx.fillStyle = o.side || "#B9772F"; ctx.beginPath(); ctx.moveTo(w / 2, -h); ctx.lineTo(w / 2 + d, -h - d); ctx.lineTo(w / 2 + d, -d); ctx.lineTo(w / 2, 0); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = o.top || "#F3C98B"; ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(-w / 2 + d, -h - d); ctx.lineTo(w / 2 + d, -h - d); ctx.lineTo(w / 2, -h); ctx.closePath(); ctx.fill(); ol(ctx, 4);
    rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = o.face || CREAM; ctx.fill(); ol(ctx, 5);
    font(ctx, 900, h * .78, FAM); ctx.fillStyle = o.ink || BROWN; ctx.textAlign = "center"; ctx.fillText(ch, 0, -h * .22); ctx.textAlign = "left"; ctx.restore();
  }
  function doc(ctx, x, y, w, h, rot, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(43,26,18,.25)"; rr(ctx, -w / 2 + 10, -h / 2 + 14, w, h, 14); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.clip(); ctx.fillStyle = o.color || ORANGE; ctx.fillRect(-w / 2, -h / 2, w, h * .2); ctx.restore();
    if (o.title){ const sz = fit(ctx, o.title, w - 50, h * .11, 900, 14); ctx.fillStyle = "#FFFFFF"; ctx.fillText(o.title, -w / 2 + 24, -h / 2 + h * .1 + sz * .36); }
    const n = o.lines ?? 4, prog = o.prog ?? 1; ctx.fillStyle = "#D9C7AE";
    for (let i = 0; i < n; i++){ const lw = (w - 60) * (i === n - 1 ? .6 : .92), p = clamp(prog * n - i, 0, 1); if (p <= 0) continue; rr(ctx, -w / 2 + 28, -h / 2 + h * .3 + i * h * .14, lw * p, h * .06, 4); ctx.fill(); }
    if (o.cursor){ const i = Math.min(n - 1, Math.floor(prog * n)), p = clamp(prog * n - i, 0, 1), lw = (w - 60) * (i === n - 1 ? .6 : .92);
      if (Math.sin(o.t * 9) > 0){ ctx.fillStyle = ORANGE; ctx.fillRect(-w / 2 + 30 + lw * p, -h / 2 + h * .28 + i * h * .14, 5, h * .1); } }
    if (o.chart){ ctx.fillStyle = hexA(ORANGE, .85); [.3, .45, .4, 1].forEach((v, i) => { const bh = h * .32 * v; rr(ctx, -w / 2 + 34 + i * (w - 80) / 4, h / 2 - 26 - bh, (w - 80) / 4 - 14, bh, 4); ctx.fill(); });
      ctx.strokeStyle = GREEN; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-w / 2 + 40, h / 2 - 50); ctx.lineTo(w / 2 - 50, -h / 2 + h * .32); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w / 2 - 80, -h / 2 + h * .3); ctx.lineTo(w / 2 - 50, -h / 2 + h * .32); ctx.lineTo(w / 2 - 56, -h / 2 + h * .32 + 30); ctx.stroke(); }
    if (o.big){ const sz = fit(ctx, o.big, w - 50, h * .22, 900, 16); ctx.fillStyle = o.bigColor || BROWN; ctx.textAlign = "center"; ctx.fillText(o.big, 0, -h / 2 + h * .48); ctx.textAlign = "left"; }
    ctx.restore();
  }
  function crate(ctx, x, y, w, h, rot, label){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h, w, h, 6); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "#A8703C"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 2, -h * .72); ctx.lineTo(w / 2, -h * .72); ctx.moveTo(0, -h); ctx.lineTo(0, -h * .72); ctx.stroke();
    if (label){ const sz = fit(ctx, label, w * .8, h * .2, 900, 12); ctx.fillStyle = "#7A4A2E"; ctx.textAlign = "center"; ctx.fillText(label, 0, -h * .3 + sz * .3); ctx.textAlign = "left"; }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function sizeAt(a, s, t){ let sz = a.size || 760; const K = (a.grow || []).map((k, j) => ({ T: tOf(s, k, .3 + j * .2), size: k.size, dur: k.dur ?? .55 })).sort((p, q) => p.T - q.T);
    for (const k of K){ if (t < k.T) break; sz = lerp(sz, k.size, eBack(clamp((t - k.T) / k.dur, 0, 1))); } return sz; }
  function headTop(st){ const hp = toonHead(st); return [hp[0], hp[1] - st.size * .27]; }
  // draws a toon (optionally rotated about its feet) and queues its speech bubble
  function drawT(ctx, c, a, st, t, rot, noBubble){
    ctx.save(); c.apply(ctx); if (rot){ ctx.translate(st.x, st.y); ctx.rotate(rot); ctx.translate(-st.x, -st.y); } const r = drawToon(ctx, a, st, t); ctx.restore();
    if (r && st.say && !noBubble && Math.abs(rot || 0) < .2){ const ts = c.toScreen(r.headX + r.face * r.k * 6, r.top), txt = st.say, k = t - st.sayT, kind = st.sayKind; CS.ov.push(() => bubble(ctx, txt, ts[0], ts[1] - 10, k, { kind, t })); }
    return r; }
  function base(ctx, s, t, H){
    H = H || {};
    const f = s.f || {}, idx = G.scene;
    const toons = (f.toons || []).map(a => a.grow ? Object.assign({}, a, { size: sizeAt(a, s, t) }) : a);
    const sts = toons.map(a => toonState(a, s, t));
    const spots = Object.assign({}, typeof H.spots === "function" ? H.spots(sts, toons) : (H.spots || {}), f.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || H.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, H.camOpt || {}, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    if (H.envDraw) H.envDraw(ctx, c); else env(ctx, E, t, c, eo);
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const W = fn => fn && layer(ctx, c, 1, () => fn(ctx, c, sts, toons));
    W(H.back);
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => { if (H.skip && H.skip(j)) return; toon(ctx, c, a, s, t, { st: sts[j] }); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => W(H.mid) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    W(H.front);
    drawProps(true);
    if (f.front !== false && H.envFront !== false && !H.envDraw) envFront(ctx, E, t, c, eo);
    W(H.post);
    if (f.tint){ const T0 = tOf(s, f.tint, .5), T1 = f.tint.outCue ? cueT(s, f.tint.outCue, .9, idx) : 1e9, q = clamp((t - T0) / (f.tint.dur ?? 1.2), 0, 1) * (1 - clamp((t - T1) / .4, 0, 1));
      if (q > 0){ ctx.save(); ctx.globalCompositeOperation = "color"; ctx.globalAlpha = q * (f.tint.a ?? .55); ctx.fillStyle = f.tint.color || "#5FA35A"; ctx.fillRect(-100, -100, 1280, 2120); ctx.restore(); } }
    if (H.screen) H.screen(ctx, c, sts, toons);
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, toons };
  }
  function sfxBase(s, f, i, add){
    const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
    (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
    (f.toons || []).forEach(a => { (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); });
      (a.grow || []).forEach((k, j) => add(tOf(s, k, .3 + j * .2, i), "whoosh")); });
    (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
    (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
    if (f.tint) add(tOf(s, f.tint, .5, i), "whoosh");
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
  }
  const SFX = extra => (s, f, i, add) => { sfxBase(s, f, i, add); if (extra) extra(s, f, i, add); };

  /* ================= cc_iri: envy ================= */
  TT.scene("cc_iri", "Cerita: iri (spotlight, dunia menghijau, mengecil)", (ctx, th, s, t) => {
    const f = s.f || {}, sp = f.spot || {}, tS = tOf(s, sp, .1), cl = f.claps || {}, tC = tOf(s, cl, .35), au = f.aura || {}, tA = tOf(s, au, .7);
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      back: (ctx2, c, sts) => { const st = sts[sp.on ?? 1]; if (!st || t < tS) return; const q = eOut(clamp((t - tS) / .5, 0, 1)), x = st.x, pu = 1 + .05 * Math.sin(t * 4);
        ctx.save(); ctx.globalAlpha = .6 * q; ctx.fillStyle = lg(ctx, 0, 0, 0, GROUND, [[0, "rgba(255,240,200,.0)"], [.3, "rgba(255,240,200,.55)"], [1, "rgba(255,226,160,.7)"]]);
        ctx.beginPath(); ctx.moveTo(x - 70, -200); ctx.lineTo(x + 70, -200); ctx.lineTo(x + 330 * pu, GROUND + 30); ctx.lineTo(x - 330 * pu, GROUND + 30); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,236,180,.8)"; ctx.beginPath(); ctx.ellipse(x, GROUND + 10, 330 * pu, 60, 0, 0, TAU); ctx.fill(); ctx.restore();
        for (let i = 0; i < 9; i++){ const a = t * 1.2 + i * TAU / 9, R = st.size * .42 + Math.sin(t * 3 + i) * 20, px = x + Math.cos(a) * R, py = st.y - st.size * .62 + Math.sin(a) * R * .55; ctx.save(); ctx.globalAlpha = q * (.6 + .4 * Math.sin(t * 5 + i)); sparkle(ctx, px, py, 18 + 6 * Math.sin(t * 4 + i), i % 2 ? "#F6D36B" : CREAM); ctx.restore(); } },
      front: (ctx2, c, sts) => {
        if (t >= tC){ (cl.on || [2]).forEach((j, n) => { const st = sts[j]; if (!st) return; for (let k = 0; k < 6; k++){ const life = 1.1, tt = t - tC - k * .38 - n * .19; if (tt < 0 || tt > life) continue; const q = tt / life;
            const px = st.x + (k % 2 ? 1 : -1) * (120 + rnd(k + n * 7) * 90), py = st.y - st.size * .6 - q * 170; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.translate(px, py); ctx.rotate((rnd(k) - .5) * .5); const sc = .7 + .3 * eBack(clamp(q * 3, 0, 1)); ctx.scale(sc, sc);
            font(ctx, 900, 50, FAM); ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.textAlign = "center"; ctx.strokeText("PLOK!", 0, 0); ctx.fillStyle = "#F6D36B"; ctx.fillText("PLOK!", 0, 0); ctx.textAlign = "left"; ctx.restore(); } }); }
        if (t >= tA){ const st = sts[au.on ?? 0]; if (!st) return; const q = clamp((t - tA) / .6, 0, 1); for (let r = 0; r < 3; r++){ const w = ((t * .6 + r / 3) % 1), R = st.size * (.28 + w * .25);
            ctx.save(); ctx.globalAlpha = q * .7 * (1 - w); ctx.strokeStyle = "#6FBF4A"; ctx.lineWidth = 9; ctx.beginPath(); for (let i = 0; i <= 40; i++){ const a = i / 40 * TAU, rr2 = R * (1 + .08 * Math.sin(a * 7 + t * 6)); const px = st.x + Math.cos(a) * rr2 * .8, py = st.y - st.size * .5 + Math.sin(a) * rr2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); } } } });
  }, SFX((s, f, i, add) => { if (f.spot) add(tOf(s, f.spot, .1, i), "chime"); if (f.claps) for (let k = 0; k < 4; k++) add(tOf(s, f.claps, .35, i) + k * .38, "pop"); }));

  /* ================= cc_raksasa: giant imagination ================= */
  TT.scene("cc_raksasa", "Cerita: imajinasi raksasa", (ctx, th, s, t) => {
    const f = s.f || {}, dr = f.dream || {}, tE = dr.outCue ? cueT(s, dr.outCue, .55, G.scene) : (dr.out ?? 1e9), st0 = f.stomp || {};
    base(ctx, s, t, { env: "sunset",
      back: (ctx2, c, sts) => { if (t >= tE) return; const g = sts[st0.on ?? 0], h = sts[st0.hero ?? 1]; if (!g) return;
        // stomp dust every period
        const per = st0.every || 1.3, k = (t % per); dust(ctx, g.x + (Math.floor(t / per) % 2 ? 140 : -140), GROUND + 10, k, 8, "#E9CFB0", 260);
        // giant's shadow falls over the hero
        if (h){ ctx.save(); ctx.globalAlpha = .45 + .1 * Math.sin(t * 2); ctx.fillStyle = "#2A1835"; ctx.beginPath(); ctx.ellipse(h.x + 120, GROUND + 6, 520, 70, 0, 0, TAU); ctx.fill(); ctx.restore(); } },
      front: (ctx2, c, sts) => { if (t >= tE) return; const h = sts[st0.hero ?? 1]; if (!h) return; ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = lg(ctx, h.x - 400, 0, h.x + 400, 0, [[0, "rgba(42,24,53,0)"], [.5, "rgba(42,24,53,.7)"], [1, "rgba(42,24,53,0)"]]); ctx.fillRect(h.x - 400, GROUND - h.size - 80, 800, h.size + 100); ctx.restore(); },
      screen: () => {
        if (t < tE){ const q = clamp(t / .5, 0, 1);
          ctx.save(); ctx.globalCompositeOperation = "color"; ctx.globalAlpha = .38 * q; ctx.fillStyle = "#7A5AB0"; ctx.fillRect(-100, -100, 1280, 2120); ctx.restore();
          // dreamy puff frame
          ctx.save(); ctx.globalAlpha = .92 * q; ctx.fillStyle = "#F4ECFF"; const n = 22;
          for (let i = 0; i < n; i++){ const u = i / n, wob = Math.sin(t * 2 + i) * 14; let x, y; const per = (u * 4) % 1, side = Math.floor(u * 4);
            if (side === 0){ x = per * 1080; y = 150 + wob; } else if (side === 1){ x = 1080 + wob; y = 150 + per * 1650; } else if (side === 2){ x = 1080 - per * 1080; y = 1800 + wob; } else { x = wob; y = 1800 - per * 1650; }
            ctx.beginPath(); ctx.arc(x, y, 95 + 25 * Math.sin(i * 2.3 + t * 1.5), 0, TAU); ctx.fill(); }
          ctx.restore();
          if (dr.tag){ ctx.save(); ctx.globalAlpha = q; pill(ctx, dr.tag, 540, dr.tagY ?? 250, 34, "#7A5AB0", "#FFFFFF", -.03); ctx.restore(); }
          for (let i = 0; i < 6; i++){ const a = t * .7 + i, px = 540 + Math.cos(a * 1.3 + i) * 380, py = 760 + Math.sin(a + i * 2) * 420; ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 4 + i); sparkle(ctx, px, py, 16, "#E9DDFF"); ctx.restore(); } }
        const k = t - tE; if (k >= 0 && k < .7){ const q = eOut(k / .7); ctx.save(); ctx.globalAlpha = 1 - k / .7; ctx.fillStyle = "#FFFFFF";
          for (let i = 0; i < 14; i++){ const a = i / 14 * TAU, R = 120 + q * 700; ctx.beginPath(); ctx.arc(540 + Math.cos(a) * R, 900 + Math.sin(a) * R * 1.3, 160 * (1 - q * .5), 0, TAU); ctx.fill(); }
          ctx.globalAlpha = Math.max(0, 1 - k / .35); ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } } });
  }, SFX((s, f, i, add) => { const d = f.dream || {}; if (d.outCue) add(cueT(s, d.outCue, .55, i), "pop"), add(cueT(s, d.outCue, .55, i) + .05, "chime"); }));

  /* ================= cc_jejak: glowing footprints ================= */
  function foot(ctx, x, y, s, rot, col, a){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s * .55); ctx.globalAlpha *= a; ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(0, 0, 34, 20, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-30, 0, 18, 16, 0, 0, TAU); ctx.fill();
    for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.arc(44, -16 + k * 11, 7, 0, TAU); ctx.fill(); } ctx.restore(); }
  TT.scene("cc_jejak", "Cerita: jejak bercahaya", (ctx, th, s, t) => {
    const f = s.f || {}, P0 = Object.assign({ x0: 260, x1: 1100, n: 9, y: 1690 }, f.path || {}), tP = tOf(s, P0, .4), dur = P0.dur ?? 1.6, own = f.own || {}, tO = tOf(s, own, .8), fl = f.flag || null;
    const pts = []; for (let i = 0; i < P0.n; i++) pts.push([lerp(P0.x0, P0.x1, i / (P0.n - 1)), P0.y + (i % 2 ? 18 : -18)]);
    base(ctx, s, t, { env: "park",
      back: () => {
        if (fl){ const fx = fl.x ?? P0.x1 + 120, q = eBack(clamp((t - tOf(s, fl, .3)) / .5, 0, 1)); if (q > 0){ ctx.save(); ctx.translate(fx, GROUND + 20); ctx.scale(1, q);
          ctx.fillStyle = "#9DBB7A"; ctx.beginPath(); ctx.ellipse(0, 0, 170, 40, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -560); ctx.stroke();
          const wv = t * 5; ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(0, -560); for (let k = 0; k <= 10; k++) ctx.lineTo(k * 26, -560 + Math.sin(wv + k * .7) * 10 * k / 10); for (let k = 10; k >= 0; k--) ctx.lineTo(k * 26, -420 + Math.sin(wv + k * .7) * 10 * k / 10); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          if (fl.icon) ico(ctx, fl.icon, 130, -490, 70, "#FFFFFF", 3); ctx.restore(); glowAt(ctx, fx + 130, GROUND - 490, 220, "#FFD27A", .35 + .1 * Math.sin(t * 4)); } }
        pts.forEach(([x, y], i) => { const ti = tP + i * dur / P0.n, k = t - ti; if (k < 0) return; const q = eBack(clamp(k / .3, 0, 1)), pu = .75 + .25 * Math.sin(t * 4 - i * .6);
          glowAt(ctx, x, y, 90 * q, "#FFC24A", .5 * pu); foot(ctx, x, y, q * 1.2, (i % 2 ? .1 : -.1), "#FFB238", .95); if (k < .5) burstFx(ctx, x, y - 10, k, HL, 6, 90); });
        if (t >= tO){ const from = own.from ?? 5; for (let i = from; i < P0.n + 2; i++){ const u = (i - from + 1), ti = tO + (i - from) * .28, k = t - ti; if (k < 0) continue; const q = eBack(clamp(k / .3, 0, 1));
          const x = pts[Math.min(i, P0.n - 1)][0] + (i >= P0.n ? (i - P0.n + 1) * 80 : 0) + u * 12, y = P0.y - 26 - u * 20 + (i % 2 ? 12 : -12);
          glowAt(ctx, x, y, 80 * q, "#7FD6CF", .5); foot(ctx, x, y, q * (1.1 - u * .05), .25 + (i % 2 ? .1 : -.1), "#5EC4B8", .95); if (k < .5) burstFx(ctx, x, y - 10, k, "#5EC4B8", 6, 80); } } } });
  }, SFX((s, f, i, add) => { const P0 = f.path || {}, t0 = tOf(s, P0, .4, i), n = P0.n || 9, d = P0.dur ?? 1.6; for (let k = 0; k < n; k++) add(t0 + k * d / n, "pop"); if (f.own) add(tOf(s, f.own, .8, i), "chime"); if (f.flag) add(tOf(s, f.flag, .3, i), "whoosh"); }));

  /* ================= cc_berbagi: knowledge chips between heads ================= */
  TT.scene("cc_berbagi", "Cerita: berbagi ilmu di meja makan", (ctx, th, s, t) => {
    const f = s.f || {}, sh = f.share || {}, TB = Object.assign({ x: 540, w: 980, y: 1470 }, f.table || {});
    base(ctx, s, t, { env: "street",
      front: (ctx2, c, sts) => {
        // table + food
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(TB.x, GROUND + 8, TB.w * .55, 26, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#7A4A2E"; [TB.x - TB.w / 2 + 40, TB.x + TB.w / 2 - 70].forEach(lx => { rr(ctx, lx, TB.y, 30, GROUND - TB.y + 10, 6); ctx.fill(); ol(ctx, 5); });
        rr(ctx, TB.x - TB.w / 2, TB.y - 20, TB.w, 44, 12); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#E7D3B5"; ctx.fillRect(TB.x - TB.w / 2 + 10, TB.y + 26, TB.w - 20, 70); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(TB.x - TB.w / 2 + 10, TB.y + 26, TB.w - 20, 70);
        for (let k = 0; k < 9; k++){ ctx.fillStyle = k % 2 ? "#E8604C" : CREAM; ctx.fillRect(TB.x - TB.w / 2 + 12 + k * (TB.w - 24) / 9, TB.y + 28, (TB.w - 24) / 9, 66); }
        [[TB.x - 220, 0], [TB.x + 200, 1]].forEach(([px, k]) => { ctx.save(); ctx.translate(px, TB.y - 20); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(0, 0, 110, 26, 0, 0, TAU); ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = "#FFF8EC"; ctx.beginPath(); ctx.arc(-20, -12, 46, Math.PI, 0); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.ellipse(48, -10, 30, 14, .3, 0, TAU); ctx.fill(); ol(ctx, 4);
          // glass of iced tea
          ctx.translate(k ? -160 : 160, 0); ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.moveTo(-26, -100); ctx.lineTo(26, -100); ctx.lineTo(20, 0); ctx.lineTo(-20, 0); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = hexA("#FFFFFF", .5); ctx.fillRect(-14, -88 + Math.sin(t * 2 + k) * 3, 12, 12); ctx.fillRect(4, -70 + Math.cos(t * 2 + k) * 3, 12, 12); ctx.restore();
          for (let j = 0; j < 3; j++){ const q = ((t * .5 + j / 3 + k * .2) % 1); ctx.save(); ctx.globalAlpha = .45 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px - 30 + j * 20, TB.y - 70 - q * 90); ctx.quadraticCurveTo(px - 40 + j * 20 + Math.sin(q * 6) * 12, TB.y - 110 - q * 90, px - 26 + j * 20, TB.y - 150 - q * 90); ctx.stroke(); ctx.restore(); } }); },
      post: (ctx2, c, sts) => {
        const A = sts[sh.from ?? 1], B = sts[sh.to ?? 0]; if (!A || !B) return;
        (sh.items || []).forEach((it, j) => { const T0 = tOf(s, it, .5 + j * .2), k = t - T0; if (k < 0) return; const fly = 1.3, q = clamp(k / fly, 0, 1), e = (1 - Math.cos(q * Math.PI)) / 2;
          const a0 = headTop(A), b0 = headTop(B), x = lerp(a0[0], b0[0], e), y = lerp(a0[1] - 90, b0[1] - 60, e) - Math.sin(q * Math.PI) * 260;
          if (q < 1){ for (let d = 1; d < 7; d++){ const qq = clamp(q - d * .03, 0, 1), ee = (1 - Math.cos(qq * Math.PI)) / 2; ctx.save(); ctx.globalAlpha = .5 * (1 - d / 7); ctx.fillStyle = "#F6D36B"; ctx.beginPath();
              ctx.arc(lerp(a0[0], b0[0], ee), lerp(a0[1] - 90, b0[1] - 60, ee) - Math.sin(qq * Math.PI) * 260, 14 - d, 0, TAU); ctx.fill(); ctx.restore(); }
            const sc = (q < .15 ? eBack(q / .15) : 1) * (q > .85 ? 1 - (q - .85) / .15 * .7 : 1); font(ctx, 800, 40, FAM); const tw = ctx.measureText(it.label).width + 120;
            ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3 + j) * .06); ctx.scale(sc, sc); rr(ctx, -tw / 2, -40, tw, 80, 40); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6);
            ctx.beginPath(); ctx.arc(-tw / 2 + 42, 0, 28, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ico(ctx, it.icon || "file", -tw / 2 + 42, 0, 34, "#FFFFFF", 2.6); ctx.fillStyle = BROWN; ctx.fillText(it.label, -tw / 2 + 82, 14); ctx.restore(); }
          else { burstFx(ctx, b0[0], b0[1] - 40, k - fly, HL, 10, 180); if (k - fly < 3) glowAt(ctx, b0[0], b0[1] + 40, 280, "#FFD27A", .3 * (1 - (k - fly) / 3)); } }); } });
  }, SFX((s, f, i, add) => { ((f.share || {}).items || []).forEach((it, j) => { const T0 = tOf(s, it, .5 + j * .2, i); add(T0, "whoosh"); add(T0 + 1.3, "chime"); }); }));

  /* ================= cc_serbu: interruptions crack the focus orb ================= */
  function orb(ctx, x, y, r, t, cracks, k, label){
    const shake = k >= 0 && k < .45 ? Math.sin(t * 70) * 14 * (1 - k / .45) : 0, broken = cracks >= 3 && k > .25;
    ctx.save(); ctx.translate(x + shake, y + Math.sin(t * 2) * 8);
    if (!broken){ glowAt(ctx, 0, 0, r * 2.1, "#FFC86B", .45 - cracks * .1); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = lg(ctx, 0, -r, 0, r, [[0, "#FFE3A3"], [1, "#F08C2E"]]); ctx.fill(); ol(ctx, 6);
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.ellipse(-r * .35, -r * .4, r * .25, r * .14, -.6, 0, TAU); ctx.fill();
      font(ctx, 900, r * .32, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(label || "FOKUS", 0, r * .12); ctx.textAlign = "left";
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineCap = "round"; for (let c = 0; c < cracks; c++){ const a = c * 2.1 + .5; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); ctx.lineTo(Math.cos(a) * r * .5 + 10, Math.sin(a) * r * .5); ctx.lineTo(Math.cos(a + .4) * r * .25, Math.sin(a + .4) * r * .25); ctx.stroke(); } }
    else { const kk = k - .25; for (let i = 0; i < 7; i++){ const a = i / 7 * TAU, d = kk * 260, py = Math.sin(a) * d + 700 * kk * kk; ctx.save(); ctx.globalAlpha = clamp(1.6 - kk, 0, 1); ctx.translate(Math.cos(a) * d, py); ctx.rotate(kk * 6 + i);
        ctx.fillStyle = i % 2 ? "#F08C2E" : "#FFD98A"; ctx.beginPath(); ctx.moveTo(0, -r * .4); ctx.lineTo(r * .3, r * .2); ctx.lineTo(-r * .25, r * .3); ctx.closePath(); ctx.fill(); ol(ctx, 4); ctx.restore(); } }
    ctx.restore(); }
  TT.scene("cc_serbu", "Cerita: gangguan bertubi (bola fokus retak)", (ctx, th, s, t) => {
    const f = s.f || {}, D = Object.assign({ x: 760, y: 640, w: 420, h: 330, title: "PROPOSAL" }, f.doc || {}), O = Object.assign({ x: 250, y: 560, r: 80 }, f.orb || {});
    const tD = tOf(s, D, .1), hits = (f.hits || []).map((h, j) => tOf(s, h, .3 + j * .2)).sort((a, b) => a - b), nh = hits.filter(h => t >= h).length, lastH = nh ? hits[nh - 1] : -9;
    const tR = tOf(s, f.ring, .35), tM = tOf(s, f.meet, .8), tO = tOf(s, O, .1);
    base(ctx, s, t, { env: "office", envOpt: { deskX: 820 },
      back: () => {
        // phone on the desk, ringing
        const k = t - tR, ring = k >= 0 && k < 2.2, sh = ring ? Math.sin(t * 60) * 8 : 0; ctx.save(); ctx.translate(980 + sh, 1306); ctx.rotate(ring ? Math.sin(t * 45) * .08 : 0); prop(ctx, "phone", 0, -70, { s: .5, notif: k >= 0 ? 1 : 0, screen: ring ? "#FFE9A8" : "#BFE2EA" }, t); ctx.restore();
        if (ring){ for (let r = 0; r < 3; r++){ const w = ((k * 1.6 + r / 3) % 1); ctx.strokeStyle = hexA(ORANGE, .8 * (1 - w)); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(980, 1236, 60 + w * 110, -2.6, -.5); ctx.stroke(); }
          ctx.save(); ctx.translate(960, 1050 + Math.sin(t * 20) * 4); ctx.rotate(-.1); pill(ctx, "KRING!", 0, 0, 40, "#F6D36B", BROWN); ctx.restore(); } },
      post: () => {
        if (t >= tD){ const q = eBack(clamp((t - tD) / .45, 0, 1)); ctx.save(); ctx.translate(D.x, D.y); ctx.scale(q, q);
          const jolt = t - lastH < .4 ? Math.sin(t * 60) * 10 * (1 - (t - lastH) / .4) : 0; doc(ctx, jolt, 0, D.w, D.h, -.03, { title: D.title, lines: 4, prog: Math.min(.26, clamp((t - tD - .4) / 3, 0, .26)), cursor: true, t }); ctx.restore(); }
        if (t >= tM){ const k = t - tM, q = eOut(clamp(k / .5, 0, 1)), x = lerp(1500, D.x + 20, q), y = lerp(-200, D.y + 30, q); ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(.8, .08, q) + (k > .5 && k < .8 ? Math.sin(k * 60) * .03 : 0));
          rr(ctx, -230, -110, 460, 220, 22); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6); rr(ctx, -230, -110, 460, 64, [22, 22, 0, 0]); ctx.fillStyle = RED; ctx.fill(); font(ctx, 900, 32, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(f.meet.title || "RAPAT DADAKAN", 0, -66);
          font(ctx, 900, 74, FAM); ctx.fillStyle = "#F6D36B"; ctx.fillText(f.meet.time || "10.00", 30, 50); ctx.textAlign = "left"; ico(ctx, "users", -150, 26, 70, "#FFFFFF", 2.6); ctx.restore(); if (k > .45) dust(ctx, D.x, D.y + 140, k - .45, 6, "#FFFFFF", 240); } },
      screen: (ctx2, c) => { if (t < tO) return; const q = eBack(clamp((t - tO) / .5, 0, 1)), p = c.toScreen(O.x, O.y); ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(q, q); ctx.translate(-p[0], -p[1]); orb(ctx, p[0], p[1], O.r * c.scale(), t, nh, t - lastH, O.label); ctx.restore(); } });
  }, SFX((s, f, i, add) => { (f.hits || []).forEach((h, j) => add(tOf(s, h, .3 + j * .2, i), "ping")); if (f.ring) add(tOf(s, f.ring, .35, i), "ping"); if (f.meet) add(tOf(s, f.meet, .8, i) + .45, "pop"); if (f.doc) add(tOf(s, f.doc, .1, i), "pop"); }));

  /* ================= cc_kejar: chase the running paper ================= */
  TT.scene("cc_kejar", "Cerita: kejar-kejaran kertas kabur", (ctx, th, s, t) => {
    const f = s.f || {}, pa = Object.assign({ gap: 430, label: "PROPOSAL" }, f.paper || {}), tF = pa.fleeCue ? cueT(s, pa.fleeCue, .7, G.scene) : 1e9, tT = pa.taunt ? tOf(s, pa.taunt, .3) : 1e9;
    const hero = (f.toons || [])[0];
    base(ctx, s, t, { env: "park", envOpt: { bench: false },
      spots: sts => ({ run: [sts[0].x + 220, 1010, .95] }), camOpt: { push: 0 },
      mid: (ctx2, c, sts) => {
        const h = sts[0]; if (!h) return;
        // speed lines behind the hero
        if (h.moving){ ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < 6; i++){ const y = h.y - 120 - i * 95 - (i % 2) * 30, x = h.x - 240 - ((t * 900 + i * 70) % 160); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 150, y); ctx.stroke(); } ctx.restore(); }
        // obstacles
        (f.drops || []).forEach((d, j) => { const T0 = tOf(s, d, .4 + j * .2), k = t - T0; if (k < 0) return; const hx = toonState(hero, s, T0).x + (d.dx ?? 150), q = clamp(k / .4, 0, 1), y = GROUND - 10 - (1 - q * q) * 900, bounce = k > .4 && k < .7 ? -Math.sin((k - .4) / .3 * Math.PI) * 40 : 0;
          ctx.save(); ctx.translate(hx, y + bounce); ctx.rotate(Math.sin(k * 3) * .15); rr(ctx, -70, -130, 140, 130, 30); ctx.fillStyle = d.color || RED; ctx.fill(); ol(ctx, 6); ico(ctx, d.icon || "alert", 0, -65, 76, "#FFFFFF", 3); ctx.restore();
          if (k > .4) dust(ctx, hx, GROUND, k - .4, 6, "#E9DCC0", 150);
          if (d.trip && k > .5 && k < 2.6){ const hp = toonHead(h); dizzy(ctx, hp[0], hp[1] - h.size * .3, t, 110); } });
        // paper creature
        let gx = h.x + pa.gap; if (t > tF) gx += eIn(clamp((t - tF) / 1.4, 0, 1)) * 1400;
        const run = h.moving || t > tF, by = GROUND - (run ? Math.abs(Math.sin(t * 12)) * 40 : Math.abs(Math.sin(t * 5)) * 20), legs = run ? t * 14 : t * 5;
        ctx.save(); ctx.translate(gx, by); ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; [-1, 1].forEach(d => { const sw = Math.sin(legs + (d > 0 ? Math.PI : 0)) * 40; ctx.beginPath(); ctx.moveTo(d * 30, -110); ctx.lineTo(d * 30 + sw, 0); ctx.lineTo(d * 30 + sw + 24, 0); ctx.stroke(); });
        ctx.rotate(run ? .12 : Math.sin(t * 4) * .06); doc(ctx, 0, -250, 220, 300, 0, { title: pa.label, lines: 4, prog: pa.prog ?? .3 });
        ctx.fillStyle = "#FFFFFF"; [-40, 40].forEach(ex => { ctx.beginPath(); ctx.ellipse(ex, -180, 22, 26, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(ex - 8, -176, 11, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; });
        ctx.beginPath(); ctx.arc(0, -138, 22, 0, Math.PI); ctx.fillStyle = "#7A2A1A"; ctx.fill(); ol(ctx, 4); if (!run){ ctx.fillStyle = "#E8604C"; ctx.beginPath(); ctx.ellipse(0, -112, 12, 16, 0, 0, TAU); ctx.fill(); }
        ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-110, -230); ctx.lineTo(-170, run ? -190 : -300 + Math.sin(t * 12) * 20); ctx.moveTo(110, -230); ctx.lineTo(170, run ? -290 : -300 + Math.cos(t * 12) * 20); ctx.stroke();
        ctx.restore();
        if (t >= tT && t < tT + 2.2){ const p = c.toScreen(gx, by - 420); CS.ov.push(() => bubble(ctx, pa.say || "Kejar aku!", p[0], p[1], t - tT, { kind: "shout", t, size: 46 })); } } });
  }, SFX((s, f, i, add) => { (f.drops || []).forEach((d, j) => { const T0 = tOf(s, d, .4 + j * .2, i); add(T0, "whoosh"); add(T0 + .4, "pop"); }); const pa = f.paper || {}; if (pa.fleeCue) add(cueT(s, pa.fleeCue, .7, i), "whoosh"); if (pa.taunt) add(tOf(s, pa.taunt, .3, i), "pop"); }));

  /* ================= cc_balok: schedule board in the sky ================= */
  TT.scene("cc_balok", "Cerita: balok fokus masuk jadwal", (ctx, th, s, t) => {
    const f = s.f || {}, B = Object.assign({ x: 760, y: 470, w: 520, rowH: 150, title: "JADWAL", rows: [], slot: [1, 2] }, f.board || {}), bk = f.block || {}, tB = tOf(s, bk, .3), tL = tOf(s, bk.labelCue ? { cue: bk.labelCue } : null, .5), tTm = tOf(s, bk.timeCue ? { cue: bk.timeCue } : null, .45);
    const bl = f.bell || null, tBl = bl ? tOf(s, bl, .75) : 1e9, tOff = bl && bl.offCue ? cueT(s, bl.offCue, .9, G.scene) : 1e9;
    const x0 = B.x - B.w / 2, top = B.y + 110, H0 = B.rows.length * B.rowH;
    base(ctx, s, t, { env: "sky", envOpt: { hills: true }, spots: { board: [B.x, top + H0 / 2, 1.05], slot: [B.x, top + B.rowH * (B.slot[0] + 1), 1.35] },
      back: () => {
        ctx.fillStyle = "#7A4A2E"; [x0 + 60, x0 + B.w - 90].forEach(px => { rr(ctx, px, top + H0, 30, GROUND - top - H0 + 20, 6); ctx.fill(); ol(ctx, 5); });
        ctx.save(); ctx.translate(0, Math.sin(t * 1.2) * 4); rr(ctx, x0 - 20, B.y - 20, B.w + 40, H0 + 150, 26); ctx.fillStyle = "#FFF8EC"; ctx.fill(); ol(ctx, 8);
        rr(ctx, x0 - 20, B.y - 20, B.w + 40, 110, [26, 26, 0, 0]); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 8); ico(ctx, "clock", x0 + 50, B.y + 35, 54, "#FFFFFF", 2.8);
        fit(ctx, B.title, B.w - 120, 50, 900); ctx.fillStyle = "#FFFFFF"; ctx.fillText(B.title, x0 + 95, B.y + 52);
        B.rows.forEach((r, i) => { const y = top + i * B.rowH; ctx.strokeStyle = "#E3C9A6"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + B.w, y); ctx.stroke();
          font(ctx, 800, 40, FAM); ctx.fillStyle = "#8A5A3E"; ctx.fillText(r.h, x0 + 14, y + 56);
          if (r.label){ rr(ctx, x0 + 130, y + 14, B.w - 150, B.rowH - 28, 16); ctx.fillStyle = r.color || "#D9C7AE"; ctx.fill(); ol(ctx, 4); fit(ctx, r.label, B.w - 200, 38, 800); ctx.fillStyle = "#FFFFFF"; ctx.fillText(r.label, x0 + 155, y + B.rowH / 2 + 13); } });
        // empty slot outline (dashed) until the block lands
        const sy = top + B.slot[0] * B.rowH, sh = (B.slot[1] - B.slot[0]) * B.rowH; if (t < tB + .45){ ctx.setLineDash([18, 14]); ctx.lineDashOffset = -t * 40; rr(ctx, x0 + 130, sy + 14, B.w - 150, sh - 28, 18); ctx.strokeStyle = hexA(ORANGE, .8); ctx.lineWidth = 6; ctx.stroke(); ctx.setLineDash([]); }
        ctx.restore(); },
      post: () => {
        const sy = top + B.slot[0] * B.rowH, sh = (B.slot[1] - B.slot[0]) * B.rowH, k = t - tB; if (k < 0) return;
        const fall = clamp(k / .45, 0, 1), land = k - .45, y = lerp(-900, sy + 14, eIn(fall)), sq = land > 0 && land < .35 ? Math.sin(land / .35 * Math.PI) * .18 : 0, bw = B.w - 150, bh = sh - 28;
        ctx.save(); ctx.translate(x0 + 130 + bw / 2, y + Math.sin(Math.max(0, land) * 3) * 0 + bh); ctx.scale(1 + sq, 1 - sq); glowAt(ctx, 0, -bh / 2, bw * .9, "#FFC86B", land > 0 ? .35 + .1 * Math.sin(t * 4) : 0);
        rr(ctx, -bw / 2, -bh, bw, bh, 20); ctx.fillStyle = lg(ctx, 0, -bh, 0, 0, [[0, "#F08C2E"], [1, ORANGE]]); ctx.fill(); ol(ctx, 7); ctx.fillStyle = "rgba(255,255,255,.25)"; rr(ctx, -bw / 2 + 14, -bh + 12, bw - 28, 20, 10); ctx.fill();
        if (t >= tL){ const q = eBack(clamp((t - tL) / .35, 0, 1)); ctx.save(); ctx.translate(0, -bh * .58); ctx.scale(q, q); fit(ctx, bk.label || "FOKUS", bw - 60, 92, 900); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(bk.label || "FOKUS", 0, 30); ctx.restore(); }
        if (t >= tTm){ const q = eBack(clamp((t - tTm) / .35, 0, 1)); ctx.save(); ctx.translate(0, -bh * .2); ctx.scale(q, q); font(ctx, 800, 40, FAM); ctx.fillStyle = "#FFF4E6"; ctx.textAlign = "center"; ctx.fillText(bk.time || "09.00 – 11.00", 0, 12); ctx.restore(); }
        ctx.textAlign = "left"; ctx.restore();
        if (land > 0) dust(ctx, B.x + 60, sy + sh, land, 9, "#FFFFFF", 330), burstFx(ctx, B.x + 60, sy + sh / 2, land - .1, HL, 10, 300);
        if (bl && t >= tBl){ const kb = t - tBl, q = eBack(clamp(kb / .4, 0, 1)), off = t >= tOff, ringA = off ? 0 : Math.sin(t * 30) * .25; ctx.save(); ctx.translate(bl.x ?? 300, bl.y ?? 560); ctx.scale(q, q);
          ctx.beginPath(); ctx.arc(0, 0, 120, 0, TAU); ctx.fillStyle = off ? "#9AA5B1" : "#F6D36B"; ctx.fill(); ol(ctx, 7); ctx.rotate(ringA);
          ctx.fillStyle = off ? "#5E6B78" : ORANGE; ctx.beginPath(); ctx.moveTo(-62, 40); ctx.quadraticCurveTo(-58, -70, 0, -72); ctx.quadraticCurveTo(58, -70, 62, 40); ctx.closePath(); ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, 54, 16, 0, TAU); ctx.fill(); ol(ctx, 5); ctx.rotate(-ringA);
          if (!off) for (let r = 0; r < 2; r++){ const w = ((kb * 1.5 + r / 2) % 1); ctx.strokeStyle = hexA(ORANGE, .8 * (1 - w)); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 0, 130 + w * 80, -.9, .3); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 130 + w * 80, Math.PI - .3, Math.PI + .9); ctx.stroke(); }
          if (off){ const qs = clamp((t - tOff) / .3, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-90, -90); ctx.lineTo(-90 + 180 * qs, -90 + 180 * qs); ctx.stroke();
            for (let z = 0; z < 3; z++){ const qq = ((t * .5 + z / 3) % 1); ctx.save(); ctx.globalAlpha = Math.sin(qq * Math.PI); font(ctx, 900, 40 + z * 8, FAM); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeText("z", 110 + qq * 60 + z * 20, -100 - qq * 120); ctx.fillText("z", 110 + qq * 60 + z * 20, -100 - qq * 120); ctx.restore(); } }
          ctx.restore(); } } });
  }, SFX((s, f, i, add) => { const bk = f.block || {}, T0 = tOf(s, bk, .3, i); add(T0, "whoosh"); add(T0 + .45, "pop"); if (bk.labelCue) add(cueT(s, bk.labelCue, .5, i), "chime");
    if (f.bell){ add(tOf(s, f.bell, .75, i), "ping"); if (f.bell.offCue) add(cueT(s, f.bell.offCue, .9, i), "pop"); } }));

  /* ================= cc_kubah: focus dome ================= */
  TT.scene("cc_kubah", "Cerita: kubah fokus", (ctx, th, s, t) => {
    const f = s.f || {}, D = Object.assign({ x: 540, base: 1560, rx: 470, ry: 700, sign: "FOKUS 09–11" }, f.dome || {}), tLift = D.liftCue ? cueT(s, D.liftCue, .8, G.scene) : 1e9, tDone = tOf(s, f.done, .85);
    const lift = eIn(clamp((t - tLift) / .8, 0, 1)) * 1500, drop = (1 - eOut(clamp((t - (D.at ?? .15)) / .6, 0, 1))) * -1200, dy = drop - lift;
    const hitR = (px, py) => { // nearest point on the dome ellipse from direction
      const a = Math.atan2((py - D.base) / D.ry, (px - D.x) / D.rx); return [D.x + Math.cos(a) * D.rx, D.base + Math.sin(a) * D.ry]; };
    base(ctx, s, t, { env: "office", envOpt: { desk: "front", deskX: D.x, plantX: 960 },
      post: () => {
        // later-tray
        const tx = D.trayX ?? 930, ty = GROUND + 40; ctx.save(); ctx.translate(tx, ty); rr(ctx, -110, -60, 220, 60, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); ctx.restore();
        const pings = f.pings || []; let stack = 0;
        pings.forEach((p, j) => { const T0 = tOf(s, p, .3 + j * .15), k = t - T0; if (k < 0) return; const fromL = (p.from || (j % 2 ? "L" : "R")) === "L", sx = fromL ? -200 : 1280, sy = 520 + (j % 3) * 120;
          const hp = hitR(fromL ? 0 : 1080, sy + 80); const hk = .45; let x, y, rot = 0;
          if (k < hk){ const q = eIn(k / hk); x = lerp(sx, hp[0] + (fromL ? -40 : 40), q); y = lerp(sy, hp[1], q); }
          else { const k2 = k - hk, q = clamp(k2 / .9, 0, 1), endX = tx + ((stack % 3) - 1) * 60, endY = ty - 90 - Math.floor(stack / 3) * 70; x = lerp(hp[0] + (fromL ? -40 : 40), endX, eOut(q)) ; y = lerp(hp[1], endY, q) - Math.sin(q * Math.PI) * 200; rot = q * (fromL ? -4 : 4);
            if (k2 < .5 && dy > -50){ ctx.save(); ctx.globalAlpha = 1 - k2 / .5; ctx.strokeStyle = "#BFE8F2"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(hp[0], hp[1], 30 + k2 * 160, 0, TAU); ctx.stroke(); ctx.restore(); } }
          if (k >= hk) stack++;
          ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rr(ctx, -55, -45, 110, 90, 22); ctx.fillStyle = p.color || (j % 2 ? TEAL : RED); ctx.fill(); ol(ctx, 5); ico(ctx, p.icon || "chat", 0, 0, 56, "#FFFFFF", 2.8); ctx.restore(); });
        if (stack > 0){ ctx.save(); ctx.translate(tx, ty + 50); pill(ctx, D.later || "NANTI 11.00", 0, 0, 30, CREAM, BROWN); ctx.restore(); }
        // dome
        ctx.save(); ctx.translate(0, dy);
        ctx.beginPath(); ctx.ellipse(D.x, D.base, D.rx, D.ry, 0, Math.PI, 0); ctx.closePath(); ctx.fillStyle = "rgba(190,232,242,.18)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = "rgba(120,190,210,.9)"; ctx.lineWidth = 4; ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(D.x, D.base, D.rx * .82, D.ry * .88, 0, Math.PI * 1.15, Math.PI * 1.35); ctx.stroke();
        ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(D.x, D.base, D.rx * .82, D.ry * .88, 0, Math.PI * 1.42, Math.PI * 1.48); ctx.stroke();
        const sh = ((t * .35) % 1.6) - .3; ctx.save(); ctx.beginPath(); ctx.ellipse(D.x, D.base, D.rx, D.ry, 0, Math.PI, 0); ctx.clip(); ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.translate(D.x - D.rx + sh * D.rx * 2, D.base - D.ry); ctx.rotate(.4); ctx.fillRect(-40, -200, 80, D.ry * 2.4); ctx.restore();
        ctx.fillStyle = "#9AA5B1"; rr(ctx, D.x - D.rx - 20, D.base - 14, D.rx * 2 + 40, 34, 14); ctx.fill(); ol(ctx, 5);
        // sign on top
        const sy = D.base - D.ry - 40; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(D.x, D.base - D.ry); ctx.lineTo(D.x, sy + 40); ctx.stroke();
        ctx.save(); ctx.translate(D.x, sy - 30); ctx.rotate(Math.sin(t * 1.6) * .04); font(ctx, 900, 50, FAM); const sw = ctx.measureText(D.sign).width + 140; rr(ctx, -sw / 2, -60, sw, 120, 22); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.arc(-sw / 2 + 52, 0, 30, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ico(ctx, "clock", -sw / 2 + 52, 0, 40, ORANGE, 2.8); ctx.fillStyle = "#FFFFFF"; ctx.fillText(D.sign, -sw / 2 + 96, 18); ctx.restore();
        ctx.restore();
        // finished document
        const kd = t - tDone; if (kd >= 0){ const q = eBack(clamp(kd / .6, 0, 1)), y = lerp(1300, 640, eOut(clamp(kd / .6, 0, 1))); ctx.save(); ctx.translate(D.x, y); ctx.scale(.4 + .6 * q, .4 + .6 * q); glowAt(ctx, 0, 0, 380, "#FFD27A", .45);
          for (let r = 0; r < 12; r++){ const a = r / 12 * TAU + t * .5; ctx.fillStyle = hexA("#F6D36B", .25); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 360, a, a + .15); ctx.closePath(); ctx.fill(); }
          doc(ctx, 0, 0, 340, 420, -.04, { title: f.done.title || "PROPOSAL", lines: 5, prog: 1 }); ctx.restore(); slam(ctx, f.done.stamp || "SELESAI", D.x + 80, y + 120, kd - .5, GREEN, 60, -.15); confetti(ctx, D.x, y, kd - .3, 34); } },
      screen: (ctx2, c) => { // progress bar under the sign (screen space for crisp text)
        const p = clamp(t / Math.max(1, tDone - .2), 0, 1); if (dy < -200 || f.noBar) return; const sp = c.toScreen(D.x, D.base - D.ry + 30 + dy), w = 360;
        ctx.save(); rr(ctx, sp[0] - w / 2, sp[1], w, 34, 17); ctx.fillStyle = "rgba(43,26,18,.65)"; ctx.fill(); rr(ctx, sp[0] - w / 2 + 6, sp[1] + 6, (w - 12) * p, 22, 11); ctx.fillStyle = "#6FCF7A"; ctx.fill(); ctx.restore(); } });
  }, SFX((s, f, i, add) => { const D = f.dome || {}; add((D.at ?? .15) + .5, "pop"); (f.pings || []).forEach((p, j) => add(tOf(s, p, .3 + j * .15, i) + .45, "pop")); if (D.liftCue) add(cueT(s, D.liftCue, .8, i), "whoosh"); if (f.done) add(tOf(s, f.done, .85, i), "chime"), add(tOf(s, f.done, .85, i) + .5, "pop"); }));

  /* ================= blob scenes: cc_laci, cc_sempit, cc_kabar ================= */
  function blobAt(s, t, B){ // B: {x, y, r, mood, label, keys:[{at|cue, x, y, r, mood, dur}]}
    let x = B.x ?? 540, y = B.y ?? GROUND, r = B.r ?? 120, mood = B.mood || "worry", lastT = -9;
    const K = (B.keys || []).map((k, j) => Object.assign({}, k, { T: tOf(s, k, .3 + j * .15) })).sort((a, b) => a.T - b.T);
    for (const k of K){ if (t < k.T) break; const q = (k.ease === "out" ? eOut : eBack)(clamp((t - k.T) / (k.dur ?? .5), 0, 1)); if (k.x != null) x = lerp(x, k.x, q); if (k.y != null) y = lerp(y, k.y, q); if (k.r != null) r = lerp(r, k.r, q); if (k.mood) mood = k.mood; lastT = k.T; }
    const sq = t - lastT < .4 ? Math.sin((t - lastT) / .4 * Math.PI * 2) * .12 * (1 - (t - lastT) / .4) : .03 * Math.sin(t * 3);
    return { x, y, r, mood, sq, follow: B.follow }; }
  function blobScene(kind){ return (ctx, th, s, t) => {
    const f = s.f || {}, B = f.blob || {}, idx = G.scene, tPop = B.popCue ? cueT(s, B.popCue, .8, idx) : 1e9, dr = f.drawer || null;
    const tOpen = dr ? tOf(s, dr, .7) : 1e9, tShut = dr && dr.shutCue ? cueT(s, dr.shutCue, .9, idx) : tOpen + 1.2;
    const drawBlob = (ctx2, c, sts) => { if (t > tPop + .1) return; const b = blobAt(s, t, B); let x = b.x, y = b.y;
      if (B.follow != null && sts[B.follow]){ const h = sts[B.follow]; x = h.x + (B.fdx ?? -260) * (h.face || 1); y = GROUND - (h.moving ? Math.abs(Math.sin(t * 9)) * 30 : 0); }
      blob(ctx, x, y, b.r, t, { mood: b.mood, label: B.label, sq: b.sq, look: B.look }); };
    const drawer = () => { if (!dr) return; const x = dr.x ?? 900, w = dr.w ?? 200, y0 = dr.y ?? 1340, h = GROUND - y0; const open = t >= tOpen && t < tShut ? eOut(clamp((t - tOpen) / .3, 0, 1)) : (t >= tShut ? 1 - eOut(clamp((t - tShut) / .18, 0, 1)) : 0);
      const rattle = t > tShut + .2 ? (Math.sin(t * 2.3) > .3 ? Math.sin(t * 55) * 6 : 0) : 0;
      ctx.fillStyle = "#8E4E2E"; rr(ctx, x - w / 2, y0, w, h, 8); ctx.fill(); ol(ctx, 6); for (let k = 1; k < 3; k++){ ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - w / 2, y0 + k * h / 3); ctx.lineTo(x + w / 2, y0 + k * h / 3); ctx.stroke(); ctx.fillStyle = "#E8C07A"; rr(ctx, x - 24, y0 + k * h / 3 + h / 6 - 8, 48, 14, 6); ctx.fill(); }
      // top drawer (pulled out toward the viewer = drawn lower & bigger)
      const dh = h / 3, oy = open * 70; ctx.save(); ctx.translate(rattle, 0); rr(ctx, x - w / 2 - 6 * open, y0 + oy * .3, w + 12 * open, dh + oy * .2, 8); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#E8C07A"; rr(ctx, x - 24, y0 + dh / 2 - 8 + oy * .4, 48, 14, 6); ctx.fill(); ctx.restore();
      if (t > tShut + .2 && Math.sin(t * 2.3) > .3){ for (let k = 0; k < 3; k++){ ctx.save(); ctx.globalAlpha = .9; font(ctx, 900, 54, FAM); ctx.fillStyle = "#F6D36B"; ctx.strokeStyle = OUT; ctx.lineWidth = 8; const px = x - 120 + k * 120, py = y0 - 30 - Math.abs(Math.sin(t * 9 + k)) * 30; ctx.strokeText("!", px, py); ctx.fillText("!", px, py); ctx.restore(); } } };
    base(ctx, s, t, { env: kind === "sempit" ? "home" : kind === "laci" ? "office" : "office",
      mid: (ctx2, c, sts) => { drawBlob(ctx2, c, sts); drawer(); },
      midZ: B.z ?? .5,
      post: () => { if (t >= tPop){ const b = blobAt(s, tPop, B); confetti(ctx, b.x, b.y - b.r, t - tPop, 30); burstFx(ctx, b.x, b.y - b.r * .6, t - tPop, HL, 12, 220); } },
      screen: () => { (f.checks || []).forEach((ck, j) => { const T0 = tOf(s, ck, .3 + j * .2), k = t - T0; if (k < 0 || (ck.outCue && t > cueT(s, ck.outCue, .9, idx) + .3)) return; const q = eBack(clamp(k / .4, 0, 1)), y = (f.checkY ?? 300) + j * 112, x = f.checkX ?? 540;
          ctx.save(); ctx.translate(x, y); ctx.rotate((j % 2 ? 1 : -1) * .02); ctx.scale(q, q); font(ctx, 900, 50, FAM); const w = Math.max(500, ctx.measureText(ck.text).width + 160); rr(ctx, -w / 2, -46, w, 92, 20); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.arc(-w / 2 + 52, 0, 30, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-w / 2 + 38, 2); ctx.lineTo(-w / 2 + 50, 14); ctx.lineTo(-w / 2 + 68, -12); ctx.stroke();
          ctx.fillStyle = BROWN; ctx.fillText(ck.text, -w / 2 + 100, 18); if (ck.n){ font(ctx, 800, 30, FAM); ctx.fillStyle = ORANGE; ctx.textAlign = "right"; ctx.fillText(ck.n, w / 2 - 26, 12); ctx.textAlign = "left"; } ctx.restore(); }); } });
  }; }
  const blobSfx = SFX((s, f, i, add) => { const B = f.blob || {}; (B.keys || []).forEach((k, j) => { if (k.r != null) add(tOf(s, k, .3 + j * .15, i), k.r > 100 ? "whoosh" : "pop"); }); if (B.popCue) add(cueT(s, B.popCue, .8, i), "chime"), add(cueT(s, B.popCue, .8, i) + .05, "pop");
    if (f.drawer){ add(tOf(s, f.drawer, .7, i), "whoosh"); if (f.drawer.shutCue) add(cueT(s, f.drawer.shutCue, .9, i), "pop"); } (f.checks || []).forEach((c, j) => add(tOf(s, c, .3 + j * .2, i), "chime")); });
  TT.scene("cc_laci", "Cerita: kabar buruk disimpan di laci", blobScene("laci"), blobSfx);
  TT.scene("cc_sempit", "Cerita: kabar buruk membesar di rumah", blobScene("sempit"), blobSfx);
  TT.scene("cc_kabar", "Cerita: kabar buruk mengecil saat disampaikan", blobScene("kabar"), blobSfx);

  /* ================= cc_angka: hologram digits + living zero ================= */
  TT.scene("cc_angka", "Cerita: angka hologram dan nol nakal", (ctx, th, s, t) => {
    const f = s.f || {}, D = Object.assign({ x: 680, y: 900, from: "1.000", to: "10.000", w: 120, h: 170, src: [330, 1250], unit: "UNIT" }, f.digits || {}), idx = G.scene;
    const tIn = tOf(s, D, .2), tHop = tOf(s, D.hopCue ? { cue: D.hopCue } : null, .5), tTo = tOf(s, D.toCue ? { cue: D.toCue } : null, .85), tCatch = D.catchCue ? cueT(s, D.catchCue, .6, idx) : 1e9;
    const layout = str => { const ws = [...str].map(ch => ch === "." ? 50 : D.w + 16), tot = ws.reduce((a, b) => a + b, 0); let x = D.x - tot / 2; return [...str].map((ch, i) => { const cx = x + ws[i] / 2; x += ws[i]; return { ch, x: cx }; }); };
    const A = layout(D.from), Bl = layout(D.to);
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: "front", deskX: D.src[0] - 20 },
      post: () => {
        if (t < tIn) return; const q = eOut(clamp((t - tIn) / .6, 0, 1)), bad = t >= tTo && t < tCatch;
        // beam
        ctx.save(); ctx.globalAlpha = .35 * q * (.85 + .15 * Math.sin(t * 7)); ctx.fillStyle = lg(ctx, 0, D.src[1], 0, D.y - D.h, [[0, "rgba(140,220,240,.9)"], [1, "rgba(140,220,240,.1)"]]);
        ctx.beginPath(); ctx.moveTo(D.src[0] - 60, D.src[1]); ctx.lineTo(D.src[0] + 60, D.src[1]); ctx.lineTo(D.x + 380, D.y + 30); ctx.lineTo(D.x - 380, D.y + 30); ctx.closePath(); ctx.fill(); ctx.restore();
        ctx.save(); ctx.globalAlpha = q; ctx.strokeStyle = hexA("#8CDCF0", .7); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(D.x, D.y + 20, 400, 40, 0, 0, TAU); ctx.stroke(); ctx.restore();
        // digits
        const mv = eBack(clamp((t - tHop - .55) / .45, 0, 1)), aMap = [];
        // map from-digits to to-digits: everything after the first char shifts one slot right (the inserted zero lands at index 1)
        A.forEach((d, i) => { let j = i === 0 ? 0 : i + 1; if (D.from === "1.000" && D.to === "10.000"){ j = d.ch === "." ? 2 : (i === 0 ? 0 : i + 1); } aMap.push(j); });
        A.forEach((d, i) => { const tg = Bl[aMap[i]] || d, x = lerp(d.x, tg.x, mv), bob = Math.sin(t * 2 + i) * 6, qi = eBack(clamp((t - tIn - i * .1) / .4, 0, 1)); if (qi <= 0) return;
          ctx.save(); ctx.translate(x, D.y + bob); ctx.scale(qi, qi); digitBlock(ctx, 0, 0, d.ch === "." ? 40 : D.w, D.h, d.ch, bad ? { face: "#FFE1DA", ink: RED } : {}); ctx.restore(); });
        // the living zero
        if (t >= tHop && t < tCatch + 1.4){ const k = t - tHop, slot = Bl[1], hopQ = clamp(k / .55, 0, 1), sx = D.src[0] + 40, sy = D.src[1] - 60; let x, y, h = D.h * .95, wave = false, run = false;
          if (t < tCatch){ x = lerp(sx, slot.x, hopQ); y = lerp(sy, D.y, hopQ) - Math.sin(hopQ * Math.PI) * 380 + Math.sin(t * 2 + 1) * 6; if (k > .55) wave = true; else run = true; }
          else { const kc = t - tCatch, q2 = eIn(clamp(kc / 1, 0, 1)); x = lerp(slot.x, 1500, q2); y = D.y - Math.sin(q2 * Math.PI) * 300; run = true; }
          const sq = k > .55 && k < .8 ? Math.sin((k - .55) / .25 * Math.PI) * .2 : 0; ctx.save(); ctx.translate(x, y); ctx.scale(1 + sq, 1 - sq); zeroGuy(ctx, 0, 0, h, t, { wave, run }); ctx.restore();
          if (k > .55 && k < 1.4) burstFx(ctx, slot.x, D.y - D.h / 2, k - .55, RED, 10, 200); }
        // unit + strike
        if (t >= tTo){ const qq = eBack(clamp((t - tTo) / .4, 0, 1)); ctx.save(); ctx.translate(D.x, D.y + 110); ctx.scale(qq, qq); pill(ctx, D.unit, 0, 0, 40, bad ? RED : TEAL, "#FFFFFF"); ctx.restore(); } } });
  }, SFX((s, f, i, add) => { const D = f.digits || {}; add(tOf(s, D, .2, i), "whoosh"); if (D.hopCue){ const T0 = cueT(s, D.hopCue, .5, i); add(T0, "whoosh"); add(T0 + .55, "ping"); } if (D.toCue) add(cueT(s, D.toCue, .85, i), "pop"); if (D.catchCue) add(cueT(s, D.catchCue, .6, i), "whoosh"); }));

  /* ================= cc_estafet: report passed hand to hand ================= */
  TT.scene("cc_estafet", "Cerita: laporan berpindah tangan", (ctx, th, s, t) => {
    const f = s.f || {}, R0 = f.relay || {}, hops = (R0.hops || []).map((h, j) => Object.assign({}, h, { T: tOf(s, h, .2 + j * .3) })), ap = f.approve || null, tAp = ap ? tOf(s, ap, .8) : 1e9;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, rug: false },
      spots: sts => { const o = {}; (R0.hops || []).forEach((h, j) => { o["h" + j] = [h.camX ?? h.x, 1000, h.zoom ?? 1.05]; }); return o; },
      post: (ctx2, c, sts) => {
        let x = R0.x ?? 300, y = R0.y ?? 1180, hop = 0, kk = 9;
        hops.forEach(h => { if (t >= h.T){ const q = clamp((t - h.T) / .9, 0, 1); hop = Math.sin(q * Math.PI) * 320; x = lerp(x, h.x, (1 - Math.cos(q * Math.PI)) / 2); y = lerp(y, h.y ?? 1180, q); kk = t - h.T; } });
        const fly = hop > 2; if (fly){ for (let d = 1; d < 6; d++){ ctx.save(); ctx.globalAlpha = .25 * (1 - d / 6); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x - d * 34, y - hop + d * 6, 22 - d * 3, 0, TAU); ctx.fill(); ctx.restore(); } }
        glowAt(ctx, x, y - hop - 120, 260, "#FFD27A", .3 + .1 * Math.sin(t * 5));
        doc(ctx, x, y - hop - 120, 240, 300, Math.sin(t * 2) * .06 + (fly ? Math.sin(kk * 8) * .2 : 0), { title: R0.title || "LAPORAN", lines: 0, chart: true, big: R0.big || "10.000", bigColor: GREEN });
        zeroGuy(ctx, x + 60, y - hop - 262, 120, t, { wave: !fly, run: fly });
        if (t >= tAp){ const k = t - tAp; slam(ctx, ap.text || "SETUJU", x, y - hop - 90, k, RED, 58, -.18); if (k < .9) burstFx(ctx, x, y - hop - 120, k - .2, RED, 12, 260); } } });
  }, SFX((s, f, i, add) => { ((f.relay || {}).hops || []).forEach((h, j) => { const T0 = tOf(s, h, .2 + j * .3, i); add(T0, "whoosh"); add(T0 + .85, "pop"); }); if (f.approve) add(tOf(s, f.approve, .8, i), "pop"), add(tOf(s, f.approve, .8, i) + .05, "ping"); }));

  /* ================= cc_gudang: warehouse buried in boxes ================= */
  function warehouse(ctx, c, t){
    layer(ctx, c, .35, () => { ctx.fillStyle = lg(ctx, 0, -300, 0, GROUND, [[0, "#6E7B86"], [1, "#9AA5AE"]]); ctx.fillRect(-3000, -3000, 7080, 7000);
      for (let x = -1500; x < 2600; x += 44){ ctx.fillStyle = (Math.round(x / 44) % 2) ? "rgba(0,0,0,.07)" : "rgba(255,255,255,.05)"; ctx.fillRect(x, -600, 22, GROUND + 600); }
      ctx.fillStyle = "#4E5A64"; ctx.fillRect(-3000, 250, 7080, 26); [-200, 350, 900, 1450].forEach(x => { ctx.fillStyle = "#3E4850"; ctx.fillRect(x, -600, 30, 900); });
      // rolling door
      ctx.fillStyle = "#B5BEC6"; rr(ctx, 330, 560, 420, 700, 6); ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 4; for (let y = 600; y < 1260; y += 34){ ctx.beginPath(); ctx.moveTo(330, y); ctx.lineTo(750, y); ctx.stroke(); }
      ctx.fillStyle = "#E8B23A"; rr(ctx, 420, 470, 240, 60, 8); ctx.fill(); ol(ctx, 4); font(ctx, 900, 36, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText("GUDANG", 540, 513); ctx.textAlign = "left"; });
    layer(ctx, c, .6, () => { // shelving racks with boxes
      [[-260, 1], [860, 0]].forEach(([x0, k]) => { ctx.fillStyle = "#2F6F73"; [x0, x0 + 420].forEach(px => ctx.fillRect(px, 300, 26, GROUND - 300)); for (let r = 0; r < 4; r++){ const y = 560 + r * 300; ctx.fillStyle = "#C2691F"; ctx.fillRect(x0, y, 446, 20);
        for (let b = 0; b < 4; b++) crate(ctx, x0 + 70 + b * 100, y, 90, 70 + rnd(b + r * 4 + k * 9) * 60, 0, ""); } }); });
    layer(ctx, c, .75, () => { [200, 880].forEach((lx, i) => { const sw = Math.sin(t * 1.1 + i * 2) * .05; ctx.save(); ctx.translate(lx, -600); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 900); ctx.stroke();
      ctx.fillStyle = "rgba(255,236,190,.16)"; ctx.beginPath(); ctx.moveTo(-60, 960); ctx.lineTo(60, 960); ctx.lineTo(420, 2300); ctx.lineTo(-420, 2300); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#3E4850"; ctx.beginPath(); ctx.moveTo(-30, 900); ctx.lineTo(30, 900); ctx.lineTo(90, 970); ctx.lineTo(-90, 970); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#FFF1CC"; ctx.beginPath(); ctx.ellipse(0, 972, 40, 12, 0, 0, TAU); ctx.fill(); ctx.restore(); }); });
    layer(ctx, c, 1, () => { ctx.fillStyle = lg(ctx, 0, GROUND - 190, 0, GROUND + 400, [[0, "#8C949B"], [1, "#6E767D"]]); ctx.fillRect(-3000, GROUND - 190, 7080, 3000); ctx.fillStyle = "#E8B23A";
      for (let x = -1000; x < 2200; x += 160) ctx.fillRect(x + ((t * 0) % 160), GROUND + 120, 90, 16); ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.fillRect(-3000, GROUND - 190, 7080, 10);
      for (let i = 0; i < 18; i++){ const q = ((t * .05 + rnd(i)) % 1); ctx.fillStyle = `rgba(255,240,210,${.5 * Math.sin(q * Math.PI)})`; ctx.beginPath(); ctx.arc(rnd(i + 3) * 1080, 1500 - q * 1100, 3 + rnd(i) * 3, 0, TAU); ctx.fill(); } });
  }
  TT.scene("cc_gudang", "Cerita: gudang tertimbun kardus", (ctx, th, s, t) => {
    const f = s.f || {}, BX = Object.assign({ n: 34, label: "STOK" }, f.boxes || {}), t0 = tOf(s, BX, .1), t1 = BX.endCue ? cueT(s, BX.endCue, .45, G.scene) : t0 + 3.5, M = f.money || null, tM = M ? tOf(s, M, .55) : 1e9, Z = f.zero || null, tZ = Z ? tOf(s, Z, .8) : 1e9;
    const cols = [60, 170, 280, 390, 500, 610, 720, 830, 940, 1050], hgt = cols.map(() => 0), boxes = [];
    for (let i = 0; i < BX.n; i++){ let ci = Math.floor(rnd(i * 3 + 1) * cols.length); for (let g = 0; g < cols.length && hgt[ci] > (BX.cap ?? 380); g++) ci = (ci + 3) % cols.length; const w = 120 + rnd(i) * 30, h = 100 + rnd(i + 5) * 30; boxes.push({ x: cols[ci] + (rnd(i + 2) - .5) * 20, y: GROUND + 30 - hgt[ci], w, h, rot: (rnd(i + 7) - .5) * .2, T: t0 + (t1 - t0) * (i / BX.n) + rnd(i + 11) * .15 }); hgt[ci] += h - 6; }
    base(ctx, s, t, { envDraw: (ctx2, c) => warehouse(ctx, c, t),
      front: (ctx2, c, sts) => {
        boxes.forEach((b, i) => { const k = t - b.T; if (k < 0) return; const q = clamp(k / .45, 0, 1), y = b.y - (1 - q * q) * 1500, land = k - .45, sq = land > 0 && land < .25 ? Math.sin(land / .25 * Math.PI) * .15 : 0;
          ctx.save(); ctx.translate(b.x, y); ctx.scale(1 + sq, 1 - sq); crate(ctx, 0, 0, b.w, b.h, b.rot * (q < 1 ? 3 : 1), BX.label); ctx.restore(); if (land > 0 && land < .6 && i % 3 === 0) dust(ctx, b.x, b.y, land, 5, "#D9D2C6", 120); });
        if (M && t >= tM){ const k = t - tM, q = eBack(clamp(k / .5, 0, 1)), mx = M.x ?? 540, my = M.y ?? 560; ctx.save(); ctx.translate(mx, my + Math.sin(t * 2) * 6); ctx.scale(q, q);
          glowAt(ctx, 0, 0, 260, "#F6D36B", .3); ctx.fillStyle = "#C9A15A"; ctx.beginPath(); ctx.moveTo(-40, -120); ctx.lineTo(40, -120); ctx.lineTo(30, -90); ctx.quadraticCurveTo(150, -40, 140, 60); ctx.quadraticCurveTo(130, 140, 0, 140); ctx.quadraticCurveTo(-130, 140, -140, 60); ctx.quadraticCurveTo(-150, -40, -30, -90); ctx.closePath(); ctx.fill(); ol(ctx, 7);
          font(ctx, 900, 74, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText("Rp", 0, 60); ctx.textAlign = "left";
          const cq = clamp((k - .35) / .5, 0, 1); ctx.strokeStyle = "#5E6B78"; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.setLineDash([26, 12]); [[-170, -60, 170, 120], [170, -60, -170, 120]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(lerp(a, c2, cq), lerp(b, d, cq)); ctx.stroke(); }); ctx.setLineDash([]);
          if (cq >= 1){ const lq = eBack(clamp((k - .85) / .35, 0, 1)); ctx.save(); ctx.translate(0, 40); ctx.scale(lq, lq); ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, -40, 36, Math.PI, 0); ctx.stroke(); rr(ctx, -58, -40, 116, 90, 14); ctx.fillStyle = "#E8B23A"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(0, -2, 12, 0, TAU); ctx.fill(); ctx.restore(); }
          ctx.restore(); }
        if (Z && t >= tZ){ let top = boxes[0]; boxes.forEach(b => { if (b.y - b.h < top.y - top.h && Math.abs(b.x - (Z.x ?? 600)) < 300) top = b; }); const zx = Z.x ?? top.x, zy = Math.min(...boxes.filter(b => Math.abs(b.x - zx) < 80).map(b => b.y - b.h), GROUND), q = eBack(clamp((t - tZ) / .4, 0, 1));
          ctx.save(); ctx.translate(zx, zy); ctx.scale(q, q); glowAt(ctx, 0, -80, 200, "#E8604C", .35); zeroGuy(ctx, 0, 0, 170, t, { wave: true }); ctx.restore(); } } });
  }, SFX((s, f, i, add) => { const BX = f.boxes || {}, t0 = tOf(s, BX, .1, i), t1 = BX.endCue ? cueT(s, BX.endCue, .45, i) : t0 + 3.5; for (let k = 0; k < 8; k++) add(t0 + .45 + (t1 - t0) * k / 8, "pop");
    if (f.money) add(tOf(s, f.money, .55, i), "whoosh"), add(tOf(s, f.money, .55, i) + .9, "ping"); if (f.zero) add(tOf(s, f.zero, .8, i), "pop"); }));

  /* ================= cc_debat: split-screen argument ================= */
  TT.scene("cc_debat", "Cerita: debat layar terbelah", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, toons = f.toons || [], sts = toons.map(a => toonState(a, s, t)), tOpen = tOf(s, f.open, .45), tIn = f.split ? tOf(s, f.split, .2) : -9, oq = t < tIn ? 1 : (t < tOpen ? 1 - eOut(clamp((t - tIn) / .45, 0, 1)) : eIn(clamp((t - tOpen) / .7, 0, 1)));
    const resolve = (on, tt, k) => { const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null; const st = sts[j], hp = toonHead(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null; return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? 0), z]; };
    const eo = Object.assign({ desk: false, rug: false }, f.envOpt || {}), TB = Object.assign({ y: 1440, x: 540, w: 1100 }, f.table || {});
    const table = c => layer(ctx, c, 1, () => { ctx.fillStyle = "#7A4A2E"; rr(ctx, TB.x - TB.w / 2, TB.y, TB.w, 60, 14); ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#5A3420"; ctx.fillRect(TB.x - TB.w / 2 + 20, TB.y + 60, TB.w - 40, GROUND + 200 - TB.y);
      ctx.fillStyle = PAPER; [[-300, -.1], [260, .12]].forEach(([dx, r]) => { ctx.save(); ctx.translate(TB.x + dx, TB.y + 6); ctx.rotate(r); ctx.fillRect(-70, -16, 140, 22); ctx.restore(); });
      ctx.fillStyle = CREAM; rr(ctx, TB.x - 30, TB.y - 60, 60, 60, 8); ctx.fill(); ol(ctx, 4); });
    const world = (c, bubbles) => { env(ctx, "office", t, c, eo); toons.map((a, j) => [a, j]).sort((p, q) => (p[0].z || 0) - (q[0].z || 0)).forEach(([a, j]) => drawT(ctx, c, a, sts[j], t, 0, !bubbles)); table(c); };
    // wide shot (behind the panels)
    const cW = cam(s, t, f.cam || [{ at: 0, x: 540, y: 1000, zoom: 1 }], { resolve });
    world(cW, t >= tOpen || t < tIn);
    if (f.banner){ const tb = tOf(s, f.banner, .8), k = t - tb; if (k >= 0){ const q = eBack(clamp(k / .5, 0, 1)), y = lerp(-200, f.banner.y ?? 470, eOut(clamp(k / .5, 0, 1)));
        CS.ov.push(() => { ctx.save(); ctx.translate(540, y); ctx.rotate(-.03 + Math.sin(t * 2) * .01); font(ctx, 900, 64, FAM); const w = Math.max(700, ctx.measureText(f.banner.text).width + 120);
          ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-w / 2 - 60, -40); ctx.lineTo(-w / 2, -40); ctx.lineTo(-w / 2, 70); ctx.lineTo(-w / 2 - 60, 70); ctx.lineTo(-w / 2 - 30, 15); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          ctx.beginPath(); ctx.moveTo(w / 2 + 60, -40); ctx.lineTo(w / 2, -40); ctx.lineTo(w / 2, 70); ctx.lineTo(w / 2 + 60, 70); ctx.lineTo(w / 2 + 30, 15); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          rr(ctx, -w / 2, -70, w, 140, 16); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 7); font(ctx, 800, 30, FAM); ctx.fillStyle = ORANGE; ctx.textAlign = "center"; ctx.fillText(f.banner.tag || "KEPUTUSAN", 0, -26);
          fit(ctx, f.banner.text, w - 60, 64, 900); ctx.fillStyle = BROWN; ctx.fillText(f.banner.text, 0, 46); ctx.textAlign = "left"; ctx.restore(); burstFx(ctx, 540, y, k - .3, HL, 12, 420); }); } }
    // split panels
    if (oq < 1){ const L = [[0, 1290], [1080, 610]], dA = -oq * 1300, dB = oq * 1300;
      const panel = (poly, off, keys, owner) => { ctx.save(); ctx.translate(off * .55, off); ctx.beginPath(); poly.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.clip();
        const cP = cam(s, t, keys, { resolve, handheld: 1.6 }); env(ctx, "office", t, cP, eo); toons.forEach((a, j) => { const r = drawT(ctx, cP, a, sts[j], t, 0, j !== owner); }); table(cP); ctx.restore(); };
      panel([[-100, -100], [1180, -100], [1180, L[1][1] - 60], [-100, L[0][1] + 60]], dA, f.camA || [{ at: 0, on: 0, fit: .42 }], f.ownerA ?? 0);
      panel([[-100, L[0][1] + 60], [1180, L[1][1] - 60], [1180, 2020], [-100, 2020]], dB, f.camB || [{ at: 0, on: 1, fit: .42 }], f.ownerB ?? 1);
      // lightning seam
      ctx.save(); ctx.globalAlpha = 1 - oq; ctx.translate(0, 0); const pts = []; for (let i = 0; i <= 12; i++){ const u = i / 12; pts.push([lerp(-20, 1100, u), lerp(L[0][1] + 60, L[1][1] - 60, u) + (i % 2 ? 1 : -1) * (18 + 12 * Math.sin(t * 30 + i))]); }
      ctx.lineJoin = "round"; [[30, "#2B1A12"], [18, "#FFF1C9"], [8, "#F6D36B"]].forEach(([w, col]) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); });
      for (let i = 0; i < 6; i++){ const u = ((t * .9 + i / 6) % 1), x = lerp(0, 1080, u), y = lerp(L[0][1] + 60, L[1][1] - 60, u); sparkle(ctx, x + Math.sin(t * 20 + i) * 30, y + Math.cos(t * 17 + i) * 30, 22, i % 2 ? "#F6D36B" : CREAM); }
      const vs = 1 + .08 * Math.sin(t * 8); ctx.translate(540, (L[0][1] + L[1][1]) / 2); ctx.scale(vs, vs); ctx.rotate(-.2); ctx.beginPath(); ctx.arc(0, 0, 78, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 7);
      font(ctx, 900, 64, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText("VS", 0, 22); ctx.textAlign = "left"; ctx.restore(); }
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp), t);
  }, SFX((s, f, i, add) => { add(tOf(s, f.open, .45, i), "whoosh"); if (f.split) add(tOf(s, f.split, .2, i), "whoosh"), add(tOf(s, f.split, .2, i) + .4, "pop"); if (f.banner) add(tOf(s, f.banner, .8, i), "pop"), add(tOf(s, f.banner, .8, i) + .1, "chime"); }));

  /* ================= cc_kaki: three-legged race ================= */
  TT.scene("cc_kaki", "Cerita: lomba lari tiga kaki", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, pr = f.pair || [0, 1], tFall = f.fall ? tOf(s, f.fall, .8) : 1e9, fin = f.finish || null, tFin = fin ? tOf(s, fin, .7) : 1e9;
    const rotOf = j => { if (t < tFall) return 0; const k = t - tFall, q = clamp(k / .45, 0, 1), b = k > .45 && k < .75 ? Math.sin((k - .45) / .3 * Math.PI) * .12 : 0; return (j === pr[0] ? -1 : 1) * (eIn(q) * 1.35 - b); };
    base(ctx, s, t, { env: f.env || "park", envOpt: Object.assign({ bench: false }, f.envOpt || {}),
      spots: sts => ({ pair: [(sts[pr[0]].x + sts[pr[1]].x) / 2 + (f.lead ?? 120), 1000, f.zoom ?? 1] }), camOpt: { push: 0 },
      skip: j => pr.includes(j),
      back: () => { if (!fin) return; const fx = fin.x ?? 1500, k = t - tFin; ctx.fillStyle = "#7A4A2E"; [fx - 20, fx + 20].forEach((px, n) => { rr(ctx, px - 14 + (n ? 0 : 0), GROUND - 560 + n * 20, 28, 560 - n * 20 + 20, 6); ctx.fill(); ol(ctx, 5); });
        ctx.save(); ctx.translate(fx, GROUND - 620); ctx.rotate(Math.sin(t * 2) * .03); font(ctx, 900, 54, FAM); rr(ctx, -150, -50, 300, 100, 16); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(fin.text || "FINIS", 0, 20); ctx.textAlign = "left"; ctx.restore();
        for (let i = 0; i < 8; i++){ ctx.fillStyle = i % 2 ? OUT : "#FFFFFF"; ctx.fillRect(fx - 14, GROUND - 540 + i * 30, 28, 30); } },
      mid: (ctx2, c, sts) => {
        const A = sts[pr[0]], B = sts[pr[1]]; if (!A || !B) return; const ra = rotOf(pr[0]), rb = rotOf(pr[1]);
        // finish tape (in front of the runners' torso line)
        // draw runners via drawToon in the world transform (ctx already has c applied -> undo, use drawT)
        ctx.restore(); ctx.save();
        drawT(ctx, c, f.toons[pr[0]], A, t, ra); drawT(ctx, c, f.toons[pr[1]], B, t, rb);
        c.apply(ctx);
        // band around the inner ankles
        const mx = (A.x + B.x) / 2, by = GROUND - 46; ctx.save(); ctx.translate(mx, by); ctx.rotate(Math.sin(t * 6) * .05); rr(ctx, -70, -26, 140, 52, 18); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(-40, 50 + Math.sin(t * 8) * 8); ctx.lineTo(-10, 46); ctx.closePath(); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(40, 54 + Math.cos(t * 8) * 8); ctx.lineTo(12, 46); ctx.closePath(); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fillStyle = "#A8541A"; ctx.fill(); ol(ctx, 4); ctx.restore();
        if (A.moving || B.moving) dust(ctx, mx - 120, GROUND, (t * 2.2) % .8, 5, "#EADBC6", 120);
        if (t >= tFall){ const k = t - tFall; dust(ctx, mx, GROUND, k - .45, 9, "#EADBC6", 320); if (k > .5) dizzy(ctx, mx, GROUND - 330, t, 170); }
        // held signs
        (f.signs || []).forEach((sg, n) => { const st = sts[sg.on]; if (!st) return; const T0 = tOf(s, sg, .4 + n * .1), k = t - T0, out = sg.outCue ? cueT(s, sg.outCue, .9, idx) : tFall; if (k < 0 || t > out + .3) return; const q = eBack(clamp(k / .4, 0, 1)) * (1 - clamp((t - out) / .3, 0, 1));
          const side = sg.side ?? (st.face || 1), hx = st.x + side * st.size * .2, top = st.y - st.size * 1.08; ctx.save(); ctx.translate(hx, st.y - st.size * .5); ctx.rotate(Math.sin(t * 3 + n) * .08 * side); ctx.scale(q, q); ctx.translate(-hx, -(st.y - st.size * .5));
          ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(hx, st.y - st.size * .45); ctx.lineTo(hx, top + 40); ctx.stroke();
          font(ctx, 900, 46, FAM); const w = Math.max(220, ctx.measureText(sg.text).width + 60); rr(ctx, hx - w / 2, top - 70, w, 110, 14); ctx.fillStyle = sg.color || CREAM; ctx.fill(); ol(ctx, 6); ctx.fillStyle = sg.ink || BROWN; ctx.textAlign = "center"; ctx.fillText(sg.text, hx, top + 2); ctx.textAlign = "left"; ctx.restore(); });
        if (fin){ const fx = fin.x ?? 1500, k = t - tFin, ty = GROUND - 330; ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = "round";
          if (k < 0){ ctx.beginPath(); ctx.moveTo(fx - 600, ty); ctx.quadraticCurveTo(fx - 300, ty + 20 + Math.sin(t * 3) * 6, fx, ty); ctx.stroke(); }
          else { const q = eOut(clamp(k / .6, 0, 1)); ctx.beginPath(); ctx.moveTo(fx - 600, ty); ctx.quadraticCurveTo(fx - 560, ty + 200 * q, fx - 600 + 60 * q, ty + 300 * q); ctx.stroke(); ctx.beginPath(); ctx.moveTo(fx, ty); ctx.quadraticCurveTo(fx - 40, ty + 200 * q, fx - 60 * q, ty + 300 * q); ctx.stroke();
            ctx.fillStyle = "#7A4A2E"; rr(ctx, fx - 614, GROUND - 560, 28, 580, 6); ctx.fill(); ol(ctx, 5); confetti(ctx, fx - 300, ty - 100, k, 36, 1.2); burstFx(ctx, fx - 300, ty, k, HL, 12, 300); }
          if (k < 0){ ctx.fillStyle = "#7A4A2E"; rr(ctx, fx - 614, GROUND - 560, 28, 580, 6); ctx.fill(); ol(ctx, 5); } } } });
  }, SFX((s, f, i, add) => { if (f.fall) add(tOf(s, f.fall, .8, i), "whoosh"), add(tOf(s, f.fall, .8, i) + .45, "pop"), add(tOf(s, f.fall, .8, i) + .5, "ping"); if (f.finish) add(tOf(s, f.finish, .7, i), "pop"), add(tOf(s, f.finish, .7, i) + .05, "chime"); (f.signs || []).forEach((sg, n) => add(tOf(s, sg, .4 + n * .1, i), "pop")); }));
})();
