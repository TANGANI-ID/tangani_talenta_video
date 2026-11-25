/* STORY16 props (world) + effects (screen inserts, cards, graphs, UI) for 16:9 episodes. */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { PROP, FX, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, HL, lerp, rnd, lg, rg, glow, fillAll } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO, eIn = S.eIn;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel;
  const T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343";

  /* =========================== PROPS (origin = floor point) =========================== */
  // Rina's desk (side view). o: laptop (0..1 open), mug, cups (extra coffee cups), photo, plant, papers, nasi, glow, phoneRing (time), sticky (n notes)
  PROP.deskR = (ctx, o, t) => {
    const W2 = 300, top = -235;
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 6, W2 + 30, 22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-W2 + 20, top + 20, 24, -top - 20); ctx.fillRect(W2 - 44, top + 20, 24, -top - 20);
    P(ctx, W2 - 230, top + 30, 190, 150, 8, "#A9643B", 5);   // drawer block
    ctx.fillStyle = "#E8C07A"; [top + 70, top + 135].forEach(y => { ctx.fillRect(W2 - 160, y, 50, 8); });
    P(ctx, -W2 - 10, top, W2 * 2 + 20, 30, 8, "#C47A48", 6);
    // papers
    if (o.papers !== false){ for (let k = 0; k < 4; k++){ ctx.save(); ctx.translate(190, top - 4 - k * 7); ctx.rotate((rnd(k + 3) - .5) * .12); ctx.fillStyle = k % 2 ? "#FFFDF8" : "#F3E6D2"; ctx.fillRect(-55, -6, 110, 8); ctx.restore(); } }
    // plant
    if (o.plant !== false){ ctx.save(); ctx.translate(250, top); ctx.scale(.42, .42); for (let k = 0; k < 7; k++){ ctx.save(); ctx.translate(0, -100); ctx.rotate(-1.1 + k * .36 + Math.sin(t * 1.3 + k) * .05); ctx.fillStyle = k % 2 ? "#3E7D4F" : "#4F8F5C"; ctx.beginPath(); ctx.ellipse(0, -70, 20, 70, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = TEAL; ctx.beginPath(); ctx.moveTo(-50, -110); ctx.lineTo(50, -110); ctx.lineTo(38, 0); ctx.lineTo(-38, 0); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke(); ctx.restore(); }
    // photo frame of Dimas (faces the viewer)
    if (o.photo !== false){ ctx.save(); ctx.translate(o.photoX ?? 85, top); ctx.rotate(-.04); P(ctx, -46, -110, 92, 110, 6, "#5A321C", 4); ctx.fillStyle = "#CFE3EE"; ctx.fillRect(-36, -100, 72, 80); ctx.save(); ctx.beginPath(); ctx.rect(-36, -100, 72, 80); ctx.clip(); drawDimas(ctx, 0, -62, .2, t, 0); ctx.restore(); ctx.fillStyle = "#5A321C"; ctx.fillRect(-36, -22, 72, 12); ctx.restore(); }
    // nasi bungkus
    if (o.nasi){ ctx.save(); ctx.translate(o.nasiX ?? 60, top); P(ctx, -60, -34, 120, 34, 14, "#7FA563", 4); ctx.fillStyle = "#5E8A44"; ctx.beginPath(); ctx.moveTo(-50, -30); ctx.lineTo(0, -50); ctx.lineTo(50, -30); ctx.fill(); ctx.fillStyle = "#E0503A"; ctx.fillRect(-8, -48, 16, 46); ctx.restore(); }
    // coffee cups (extra ones accumulate)
    const n = Math.round(o.cups || 0); for (let k = 0; k < n; k++){ const cx = 120 + (k % 5) * 34 + Math.floor(k / 5) * 14, cy = top - Math.floor(k / 5) * 44; ctx.save(); ctx.translate(cx, cy); ctx.scale(.85, .85); P(ctx, -15, -42, 30, 42, 5, "#FFF4E6", 3.5); ctx.fillStyle = k % 2 ? ORANGE : "#8E5A34"; ctx.fillRect(-12, -30, 24, 7); ctx.restore(); }
    // the orange mug with steam
    if (o.mug !== false){ ctx.save(); ctx.translate(o.mugX ?? -20, top); P(ctx, -24, -58, 48, 58, 8, ORANGE, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-26, -30, 13, 1.8, 4.5); ctx.stroke(); ctx.fillStyle = "#FFF4E6"; ctx.fillRect(-20, -40, 40, 8);
      if (o.steam !== false) for (let k = 0; k < 3; k++){ const q = ((t * .5 + k / 3) % 1); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-8 + k * 8, -66 - q * 70); ctx.quadraticCurveTo(-20 + k * 8 + Math.sin(q * 6) * 10, -88 - q * 70, -6 + k * 8, -106 - q * 70); ctx.stroke(); } ctx.globalAlpha = 1; ctx.restore(); }
    // phone on the desk (rings)
    if (o.phoneRing != null){ const q = t - o.phoneRing, on = q > 0 && q < (o.ringDur || 2.4); ctx.save(); ctx.translate(-240, top); if (on) ctx.rotate(Math.sin(t * 60) * .06); P(ctx, -34, -14, 68, 14, 4, "#1E1A18", 3); ctx.fillStyle = on ? "#9FD3E0" : "#4A4A52"; ctx.fillRect(-28, -12, 56, 6);
      if (on) for (let k = 0; k < 3; k++){ const w = ((t * 2 + k / 3) % 1); ctx.strokeStyle = hexA(ORANGE, 1 - w); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -20, 30 + w * 80, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } ctx.restore(); }
    // laptop: screen faces left (towards the chair); we see the lid's back at 3/4 + the screen glow
    const op = o.laptop ?? 1; ctx.save(); ctx.translate(o.lx ?? -175, top);
    P(ctx, -95, -14, 190, 14, 5, "#3B3A40", 4);
    if (op > .02){ const a = lerp(-1.45, -.18, op); ctx.save(); ctx.translate(90, -12); ctx.rotate(a); P(ctx, -8, -190, 18, 190, 6, "#5E5A62", 4);
        ctx.restore();
        ctx.save(); ctx.translate(90, -12); ctx.rotate(a); ctx.fillStyle = "#4F4B55"; ctx.beginPath(); ctx.moveTo(10, -6); ctx.lineTo(10, -188); ctx.lineTo(60, -176); ctx.lineTo(60, -14); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = hexA(ORANGE, .95); ctx.beginPath(); ctx.arc(36, -96, 11, 0, TAU); ctx.fill();
        for (let k = 0; k < (o.sticky || 0); k++){ ctx.fillStyle = [YEL, "#F4A85C", "#9FD3E0"][k % 3]; ctx.save(); ctx.translate(26 + (k % 2) * 14, -160 + k * 44); ctx.rotate((k - 1) * .08); ctx.fillRect(-16, -16, 32, 32); ctx.restore(); }
        ctx.restore();
        if (o.glow !== false){ ctx.globalCompositeOperation = "lighter"; glow(ctx, 0, -110, 260, "#7FC3E0", .22 * op + .04 * Math.sin(t * 5)); ctx.globalCompositeOperation = "source-over"; } }
    else { P(ctx, -95, -26, 190, 12, 5, "#4F4B55", 4); }
    ctx.restore();
  };
  // office chair seen from the side (seat for a 560 px seated toon)
  PROP.chair16 = (ctx, o, t) => {
    const f = o.face || 1; ctx.save(); ctx.scale(f, 1);
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 4, 110, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#2B2A30"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(0, -16); ctx.moveTo(-80, -10); ctx.lineTo(80, -10); ctx.stroke();
    [-80, 80].forEach(x => { ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(x, -4, 10, 0, TAU); ctx.fill(); });
    P(ctx, -80, -100, 160, 26, 12, o.col || "#3B4A6B", 5);
    P(ctx, -96, -330, 34, 250, 16, o.col || "#3B4A6B", 5);
    ctx.restore();
  };
  // standing whiteboard (adegan 16) with optional writing reveal o.text, o.reveal 0..1
  PROP.wb = (ctx, o, t) => {
    ctx.fillStyle = "#6E7782"; ctx.fillRect(-300, -560, 14, 560); ctx.fillRect(286, -560, 14, 560); ctx.fillRect(-330, -20, 120, 14); ctx.fillRect(210, -20, 120, 14);
    P(ctx, -360, -820, 720, 440, 10, "#FBFCFB", 7, "#6E7782"); ctx.fillStyle = "#9AA3AE"; ctx.fillRect(-340, -378, 680, 14);
    const txt = o.text || "", n = Math.floor(txt.length * clamp(o.reveal ?? 1, 0, 1)), lines = txt.split("\n"); let k = 0;
    lines.forEach((ln, i) => { const s = ln.slice(0, Math.max(0, n - k)); k += ln.length; T(ctx, s, -320, -720 + i * 92, 66, { col: i ? ORANGE : "#1F4E8C", fam: "'Plus Jakarta Sans'", w: 800 }); });
  };
  // hand items (drawn at the front hand in world space): ctx, hx, hy, k (toon unit), f (facing)
  PROP.hand_thumb = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.fillStyle = "#F0C29A"; ctx.strokeStyle = OUT; ctx.lineWidth = 1.2;
    rr(ctx, -5, -4, 10, 9, 3); ctx.fill(); ctx.stroke(); rr(ctx, -2.2, -12, 4.4, 9, 2.2); ctx.fill(); ctx.stroke(); ctx.restore(); };
  PROP.hand_phone = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y - 4 * k); ctx.scale(k * f, k); ctx.rotate(-.15); rr(ctx, -4.5, -8, 9, 15, 1.8); ctx.fillStyle = "#1E1A18"; ctx.fill(); rr(ctx, -3.6, -7, 7.2, 12.4, 1.2); ctx.fillStyle = "#BFE2EA"; ctx.fill();
    ctx.fillStyle = "#FFF6D0"; const s = 1 + .4 * Math.sin(t * 7); TT.star && (TT.star(ctx, 6, -10, 2.4 * s), TT.star(ctx, -6, -4, 1.6 * s)); ctx.restore(); };
  PROP.hand_phoneBuzz = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x + Math.sin(t * 70) * k * .6, y - 4 * k); ctx.scale(k * f, k); rr(ctx, -4.5, -8, 9, 15, 1.8); ctx.fillStyle = "#1E1A18"; ctx.fill(); rr(ctx, -3.6, -7, 7.2, 12.4, 1.2); ctx.fillStyle = "#F4A85C"; ctx.fill();
    ctx.strokeStyle = RED; ctx.lineWidth = .9; for (let i = 0; i < 2; i++){ const w = (t * 2.5 + i / 2) % 1; ctx.globalAlpha = 1 - w; ctx.beginPath(); ctx.arc(0, 0, 9 + w * 8, -.6, .6); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 9 + w * 8, Math.PI - .6, Math.PI + .6); ctx.stroke(); } ctx.restore(); };
  PROP.hand_notebook = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(-.2); P(ctx, -2, -9, 16, 12, 1.2, YEL, .9); ctx.fillStyle = "#3B2418"; ctx.fillRect(6, -9, .8, 12); ctx.fillStyle = "rgba(59,36,24,.6)"; ctx.fillRect(0, -6, 5, .8); ctx.fillRect(0, -3.5, 5, .8); ctx.fillRect(8, -6, 5, .8); ctx.restore(); };
  PROP.hand_marker = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(-.6); rr(ctx, -1.5, -10, 3, 12, 1); ctx.fillStyle = "#1F4E8C"; ctx.fill(); ctx.fillStyle = "#FFF"; ctx.fillRect(-1.5, -6, 3, 2); ctx.restore(); };
  PROP.hand_bag = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y + 2 * k); ctx.scale(k * f, k); P(ctx, -12, -6, 20, 15, 3, "#8E4E2E", 1); ctx.strokeStyle = "#5A321C"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(-2, -6, 5, Math.PI, TAU); ctx.stroke(); ctx.restore(); };
  PROP.hand_cup = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); P(ctx, -3, -8, 7, 8, 1, ORANGE, .8); ctx.restore(); };
  PROP.hand_headphones = () => {};
  // wall light switch
  PROP.switch = (ctx, o, t) => { P(ctx, -22, -34, 44, 68, 6, "#FFF6EA", 4); P(ctx, -8, -18, 16, 30, 4, o.on ? ORANGE : "#9AA3AE", 3); };
  // headphones on the neck of Yoga are drawn as an fx in world space (see FX.neckphones)

  /* =========================== Dimas (photo / video call only) =========================== */
  const DIMAS = { hair: "short", hairColor: "#2B1A12", shirt: "#FFFDF8", jacket: "#1F4E8C", skin: "c", collarColor: "#F6C343" };
  function drawDimas(ctx, x, y, s, t, expr, talk){
    // head + shoulders at (x, y) = head centre; s = scale where 1 -> toon size 560
    const a = Object.assign({ size: 560 * s, x: 0, y: 0, face: 1, seed: 2.2 }, DIMAS, { keys: [{ at: 0, expr: expr || "happy", pose: "idle", look: "cam" }] });
    const st = TT.toonState(a, null, t); st.talk = !!talk; const k = a.size / 92;
    ctx.save(); ctx.translate(x, y + 72 * k); TT.drawToon(ctx, a, st, t); ctx.restore();
  }
  S.drawDimas = drawDimas;

  /* =========================== SCREEN FX =========================== */
  // --- disclaimer + title card (full screen, 8 s) ---
  FX.title = { layer: "screen", draw(ctx, f, t){
    const d1 = f.disc ?? 2.2;
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]]));
    for (let i = 0; i < 16; i++){ const x = rnd(i + 3) * 2200 - 140 + Math.sin(t * .9 + i) * 160, y = rnd(i + 8) * 1200 - 60 + Math.cos(t * .7 + i) * 110, r = 80 + rnd(i) * 200;
      ctx.fillStyle = `rgba(194,105,31,${.05 + rnd(i + 2) * .08})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    U.motes(ctx, t, 40, 17, 0, 0, SW, SH, "#F6D9AE", .5);
    if (t < d1 + .3){ const a = fin(t, .15, .35) * (1 - fin(t, d1, .3));
      ctx.save(); ctx.globalAlpha = a; const zz = 1 + t * .05; ctx.translate(960, 540); ctx.scale(zz, zz); ctx.translate(-960, -540); P(ctx, 560, 470, 800, 140, 20, "rgba(255,246,234,.08)", 2, "rgba(255,246,234,.35)");
      T(ctx, "Cerita fiksi.", 960, 530, 40, { align: "center", col: "#FFF6EA" }); T(ctx, "Tokoh dan kejadian dalam cerita ini rekaan.", 960, 580, 30, { align: "center", col: "#C9D4E8", w: 600 }); ctx.restore(); return; }
    const q = t - d1;
    // spotlight sweeping past a small Rina (theme: tak terlihat)
    const sx = 960 + Math.sin(q * .9) * 520; ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = lg(ctx, 0, 0, 0, SH, [[0, "rgba(255,226,170,.16)"], [1, "rgba(255,226,170,0)"]]); ctx.beginPath(); ctx.moveTo(sx - 60, -50); ctx.lineTo(sx + 60, -50); ctx.lineTo(sx + 300, SH); ctx.lineTo(sx - 300, SH); ctx.fill(); ctx.restore();
    // logo
    const lq = pop(t, d1 + .1, .5); ctx.save(); ctx.translate(960, 230); ctx.scale(lq, lq); ctx.beginPath(); ctx.arc(0, 0, 74, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.stroke(); S.drawLogo(ctx, 0, 0, 104); ctx.restore();
    const a2 = fin(t, d1 + .35, .3); ctx.save(); ctx.globalAlpha = a2; T(ctx, "TANGANI TALENTA", 960, 352, 30, { align: "center", col: "#F6D9AE", track: 8 }); ctx.restore();
    // series + story
    const s1 = pop(t, d1 + .6, .45); ctx.save(); ctx.translate(960, 480); ctx.scale(s1, s1); ctx.rotate(-.02);
    T(ctx, "KANTOR TANGANI", 0, 0, 104, { align: "center", col: "#FFFFFF", stroke: "#0B1426", sw: 16 }); ctx.restore();
    const s2 = pop(t, d1 + 1.0, .45); ctx.save(); ctx.translate(960, 585); ctx.scale(s2, s2);
    const epsL = f.eps || "TAK TERLIHAT · EPS 1/4"; font(ctx, 800, 52, F); const tw = ctx.measureText(epsL).width + 70; P(ctx, -tw / 2, -50, tw, 78, 39, ORANGE, 5, OUT); T(ctx, epsL, 0, 8, 52, { align: "center", col: "#FFF6EA" }); ctx.restore();
    const a3 = fin(t, d1 + 1.6, .4); ctx.save(); ctx.globalAlpha = a3; ctx.translate(0, (1 - a3) * 20);
    T(ctx, f.hook || "Paling Rajin di Kantor, Tapi yang Dipromosikan Orang Lain", 960, 712, 44, { align: "center", col: "#FFFFFF", w: 700, maxW: 1700 }); ctx.restore();
    // month marker
    const m = pop(t, d1 + 2.2, .4); ctx.save(); ctx.translate(960, 810); ctx.scale(m, m); P(ctx, -150, -40, 300, 80, 16, "#FFF6EA", 5, OUT); P(ctx, -150, -40, 86, 80, [16, 0, 0, 16], RED, 0);
    T(ctx, f.day || "1", -107, 18, 44, { align: "center", col: "#FFF" }); T(ctx, f.month || "JANUARI", 40, 16, 38, { align: "center", col: BROWN, track: 3 }); ctx.restore();
    if (f.marker){ const mk = pop(t, d1 + (f.markerAt ?? 2.9), .4); ctx.save(); ctx.translate(960, 900); ctx.scale(mk, mk); ctx.rotate(-.015); font(ctx, 800, 36, F); const mw = ctx.measureText(f.marker).width + 70; P(ctx, -mw / 2, -36, mw, 70, 35, NAVY, 5, "#F6D9AE"); T(ctx, f.marker, 0, 13, 36, { align: "center", col: YEL, track: 3 }); ctx.restore(); }
    // small Rina silhouette walking under the sweeping light
    const rx = 220 + q * 120; ctx.save(); ctx.globalAlpha = .9; const a = Object.assign({ size: 150, x: rx, y: 1066, face: 1 }, S.cast.rina.look || S.cast.rina, { keys: [{ at: 0, x: rx }, { at: .01, x: rx + 2000, speed: 120 }] });
    const st = TT.toonState(a, null, q); st.talk = false; TT.drawToon(ctx, a, st, q); ctx.restore();
  }, sfx(f, g, add){ add(g(f.at || 0) + (f.disc ?? 2.2), "stinger", 1); } };

  // --- month chip (top right) ---
  FX.month = { layer: "screen", draw(ctx, f, t){ const q = t - (f.at || 0), hold = f.hold ?? 4.5; if (q < 0 || q > hold + .5) return;
    const a = eOut(clamp(q / .45, 0, 1)) * (1 - eIn(clamp((q - hold) / .45, 0, 1)));
    ctx.save(); ctx.translate(1860 - 300 * a + 300, 60); ctx.globalAlpha = a; P(ctx, -280, -34, 280, 68, 14, "rgba(255,246,234,.95)", 4, OUT); P(ctx, -280, -34, 70, 68, [14, 0, 0, 14], RED, 0);
    T(ctx, f.day || "1", -245, 15, 34, { align: "center", col: "#FFF" }); T(ctx, f.text || "JANUARI", -110, 13, 32, { align: "center", col: BROWN, track: 3 }); ctx.restore(); } };

  // --- name tag lower third ---
  FX.nameTag = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, hold = (f.out ?? f.at + 3.5) - f.at; if (q < 0 || q > hold + .4) return;
    const a = eOut(clamp(q / .4, 0, 1)) * (1 - clamp((q - hold) / .4, 0, 1)), x = f.x ?? 110, y = f.y ?? 760;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(-(1 - a) * 80, 0); font(ctx, 800, 50, F); const w1 = Math.max(ctx.measureText(f.name).width + 60, 300); font(ctx, 600, 28, F); const w2 = ctx.measureText(f.role || "").width + 50;
    P(ctx, x, y, w1, 74, 14, ORANGE, 5, OUT); T(ctx, f.name, x + 30, y + 54, 50, { col: "#FFF" });
    if (f.role){ P(ctx, x + 18, y + 70, w2, 50, 12, "#FFF6EA", 4, OUT); T(ctx, f.role, x + 43, y + 104, 28, { col: BROWN, w: 600 }); } ctx.restore(); } };

  // --- generic chip / label (screen) ---
  FX.chip = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, out = f.out ?? 1e9; if (q < 0 || t > out + .3) return;
    const s = pop(t, f.at, .3) * (1 - fin(t, out, .3)); ctx.save(); ctx.translate(f.x ?? 960, f.y ?? 120); ctx.scale(s, s); ctx.rotate((f.rot ?? -2) * Math.PI / 180);
    font(ctx, 800, f.size || 44, F); const w = ctx.measureText(f.text).width + 60, h = (f.size || 44) * 1.6;
    P(ctx, -w / 2, -h / 2, w, h, h / 2.4, f.bg || NAVY, 5, OUT); T(ctx, f.text, 0, (f.size || 44) * .36, f.size || 44, { align: "center", col: f.col || "#FFF" }); ctx.restore(); } };

  // --- confetti burst (screen) ---
  FX.confetti = { layer: "screen", draw(ctx, f, t){ const dt = t - f.at; if (dt < 0 || dt > 4) return; const n = f.count || 90, ox = f.x ?? 960, oy = f.y ?? 260;
    for (let i = 0; i < n; i++){ const an = -Math.PI / 2 + (rnd(i + 3) - .5) * 3.1, v = 700 + rnd(i + 9) * 1100, x = ox + Math.cos(an) * v * dt * .9 + Math.sin(dt * 3 + i) * 30, y = oy + Math.sin(an) * v * dt + 900 * dt * dt;
      if (y > SH + 40) continue; ctx.save(); ctx.globalAlpha = clamp(3.6 - dt, 0, 1); ctx.translate(x, y); ctx.rotate(dt * 9 + i); ctx.scale(1, Math.abs(Math.sin(dt * 8 + i)) + .2);
      ctx.fillStyle = [ORANGE, "#F4A85C", CREAM, YEL, TEAL, "#E07A9B"][i % 6]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); } },
    sfx(f, g, add){ add(g(f.at), "confetti", .8); } };

  // --- big wall clock insert (full screen) ---
  FX.clockClose = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, f.wall || "#E9CFAE"], [1, f.wall2 || "#D8B084"]]));
    ctx.strokeStyle = "rgba(59,36,24,.08)"; ctx.lineWidth = 2; for (let x = 0; x < SW; x += 60){ ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, SH); ctx.stroke(); }
    const z = 1 + q * (f.push ?? .03), r = 330 * z, cx = f.x ?? 960, cy = f.y ?? 500;
    let h, m, s;
    if (f.rate){ const tot = (f.h0 ?? 7) * 60 + q * f.rate * 60; h = Math.floor(tot / 60); m = tot % 60; s = (q * 400) % 60; }
    else { const cl = U.parseClock(f.time || "08:05", q); h = cl.h; m = cl.m; s = cl.s; }
    U.clock(ctx, cx, cy, r, h, m, s, {});
    if (f.rate){ ctx.save(); ctx.globalAlpha = .25; for (let k = 1; k < 4; k++){ ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r * .55, -Math.PI / 2 + (q * f.rate / 12 * TAU) - k * .25, -Math.PI / 2 + (q * f.rate / 12 * TAU) - k * .25 + .2); ctx.stroke(); } ctx.restore(); }
    if (f.label){ const lab = typeof f.label === "string" ? f.label : (f.label[Math.floor(q / (f.labelEvery || 1.2)) % f.label.length]);
      const s2 = 1 + .08 * Math.sin(clamp(((q % (f.labelEvery || 1.2)) / .2), 0, 1) * Math.PI);
      ctx.save(); ctx.translate(cx + r + 230, cy - 40); ctx.scale(s2, s2); ctx.rotate(-.04); font(ctx, 800, 88, F); const w = ctx.measureText(lab).width + 70; P(ctx, -w / 2, -70, w, 110, 22, NAVY, 6, OUT); T(ctx, lab, 0, 12, 88, { align: "center", col: "#FFF" }); ctx.restore(); }
    if (f.sub){ T(ctx, f.sub, cx, cy + r + 110, 52, { align: "center", col: BROWN }); }
  }, sfx(f, g, add){ const s0 = g(f.at), d = (f.out ?? f.at + 3) - f.at; if (f.rate) add(s0, "tickfast", .7, d); else add(s0, "tick", .9, d); } };

  // --- laptop full-screen insert with several UI modes ---
  const APP = "Tangani Helpdesk";
  function laptopFrame(ctx, t, f){
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C9925F"], [1, "#9E6A40"]]));
    ctx.fillStyle = "rgba(59,36,24,.12)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, 120 * k + 40, SW, 4);
    const z = 1 + (t - f.at) * (f.push ?? .012), cx = 960, cy = 520;
    ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; P(ctx, 230, 40, 1460, 900, 34, "#26252B", 0); ctx.restore();
    P(ctx, 230, 40, 1460, 900, 34, "#26252B", 6, OUT); ctx.fillStyle = "#3B3A40"; ctx.beginPath(); ctx.arc(960, 62, 6, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3B3A40"; ctx.beginPath(); ctx.moveTo(150, 960); ctx.lineTo(1770, 960); ctx.lineTo(1840, 1100); ctx.lineTo(80, 1100); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    ctx.save(); rr(ctx, 266, 80, 1388, 830, 10); ctx.clip(); ctx.fillStyle = "#F4F6F8"; ctx.fillRect(266, 80, 1388, 830);
    // app header
    ctx.fillStyle = NAVY; ctx.fillRect(266, 80, 1388, 70); S.drawLogo(ctx, 310, 115, 40); T(ctx, f.app || APP, 345, 127, 30, { col: "#FFF" });
    if (f.clock){ const cl = U.parseClock(f.clock, t - f.at); T(ctx, `${String(cl.h % 24).padStart(2, "0")}.${String(Math.floor(cl.m)).padStart(2, "0")}`, 1620, 127, 30, { align: "right", col: "#F6D9AE" }); }
    return [266, 150, 1388, 760];
  }
  const ICONS = { toko: (ctx, x, y, s) => { P(ctx, x - 18 * s, y - 6 * s, 36 * s, 26 * s, 3 * s, "#FFF", 0); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(x - 22 * s, y - 6 * s); ctx.lineTo(x + 22 * s, y - 6 * s); ctx.lineTo(x + 16 * s, y - 18 * s); ctx.lineTo(x - 16 * s, y - 18 * s); ctx.fill(); ctx.fillStyle = "#8E5A34"; ctx.fillRect(x - 6 * s, y + 4 * s, 12 * s, 16 * s); },
    printer: (ctx, x, y, s) => { P(ctx, x - 20 * s, y - 8 * s, 40 * s, 22 * s, 4 * s, "#5E5A62", 0); ctx.fillStyle = "#FFF"; ctx.fillRect(x - 12 * s, y - 22 * s, 24 * s, 16 * s); ctx.fillRect(x - 12 * s, y + 10 * s, 24 * s, 12 * s); },
    kasir: (ctx, x, y, s) => { P(ctx, x - 20 * s, y - 20 * s, 40 * s, 28 * s, 4 * s, "#3B3A40", 0); ctx.fillStyle = "#9FD3E0"; ctx.fillRect(x - 16 * s, y - 16 * s, 32 * s, 20 * s); ctx.fillStyle = "#5E5A62"; ctx.fillRect(x - 24 * s, y + 10 * s, 48 * s, 12 * s); },
    laporan: (ctx, x, y, s) => { P(ctx, x - 18 * s, y - 22 * s, 36 * s, 44 * s, 4 * s, "#FFF", 0); ctx.fillStyle = TEAL; [[-10, 8], [0, 0], [10, -8]].forEach(([dx, h]) => ctx.fillRect(x + dx * s - 4 * s, y + (8 - h) * s - 4 * s, 8 * s, (12 + h) * s)); } };
  const TICKETS = [["toko", "Toko Berkah", "Aplikasi kasir tidak bisa dibuka"], ["printer", "Warung Bu Tini", "Printer struk macet"], ["laporan", "Mart 88", "Laporan penjualan tidak muncul"], ["kasir", "Toko Sari Jaya", "Cara cetak ulang struk?"],
    ["toko", "Kopi Senja", "Stok tidak berkurang"], ["printer", "Apotek Sehat", "Struk terpotong"], ["kasir", "Bengkel Jaya", "Kasir minta login ulang"], ["laporan", "Toko Mawar", "Laporan harian kosong"], ["toko", "Roti Hangat", "Diskon tidak muncul"]];
  function ticketList(ctx, x, y, w, h, t, f, scroll){
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h);
    const rh = 104, off = scroll ? (t * scroll) % (rh * TICKETS.length) : 0;
    for (let k = -1; k < Math.ceil(h / rh) + 2; k++){ const idx = ((k + Math.floor(off / rh)) % TICKETS.length + TICKETS.length) % TICKETS.length, yy = y + k * rh - (off % rh), [ic, name, msg] = TICKETS[idx];
      const ap = f.rowsAt != null ? pop(t, f.rowsAt + k * .18, .3) : 1; if (ap <= 0) continue;
      ctx.save(); ctx.translate(x + (1 - ap) * 60, 0); ctx.globalAlpha = Math.min(1, ap);
      P(ctx, x + 18, yy + 10, w - 36, rh - 18, 14, idx === (f.hlRow ?? -1) ? "#FFF1E2" : "#F7F8FA", 2, "#E3E6EA");
      ctx.beginPath(); ctx.arc(x + 70, yy + rh / 2, 32, 0, TAU); ctx.fillStyle = "#FDEBD9"; ctx.fill(); ICONS[ic](ctx, x + 70, yy + rh / 2, 1.1);
      T(ctx, name, x + 120, yy + 46, 28, { col: NAVY }); T(ctx, msg, x + 120, yy + 82, 24, { col: "#6B7280", w: 600, maxW: w - 300 });
      const wait = [2, 3, 4, 5, 6, 7, 1, 8, 2][idx]; P(ctx, x + w - 150, yy + 32, 110, 40, 20, wait > 4 ? "#FDE2DF" : "#E7F3EC", 0); T(ctx, `${wait} jam`, x + w - 95, yy + 61, 22, { align: "center", col: wait > 4 ? RED : GREEN, w: 700 });
      ctx.restore(); }
    ctx.restore();
  }
  function typed(str, t, t0, cps){ const n = Math.max(0, Math.floor((t - t0) * (cps || 22))); return str.slice(0, n); }
  function para(ctx, lines, x, y, size, col, lh){ lines.forEach((l, i) => T(ctx, l, x, y + i * (lh || size * 1.45), size, { col: col || "#374151", w: 500, fam: F2 })); }
  const LONG = "Selamat pagi, Bapak. Semoga usahanya lancar selalu. Terima kasih sudah menghubungi Tangani. Kami mohon maaf atas ketidaknyamanan yang Bapak alami. Untuk membuka kembali aplikasi kasir, pertama-tama silakan Bapak memastikan bahwa perangkat sudah tersambung ke internet dengan baik, kemudian tutup aplikasi sepenuhnya, lalu buka kembali dari menu utama. Apabila langkah tersebut belum berhasil, Bapak dapat mencoba memulai ulang perangkat, menunggu sekitar satu menit, dan masuk kembali dengan akun toko Bapak. Kami juga melampirkan panduan bergambar agar lebih mudah diikuti. Semoga penjelasan ini bermanfaat dan usaha Bapak semakin berkah, ramai pembeli, dan lancar selalu. Salam hangat, Rina.";
  FX.laptop = { layer: "screen", draw(ctx, f, t){
    ctx.save(); const [x, y, w, h] = laptopFrame(ctx, t, f); const q = t - f.at, mode = f.mode || "tickets";
    if (mode === "tickets"){
      ctx.fillStyle = "#EEF1F4"; ctx.fillRect(x, y, w, h); T(ctx, "Antrean tiket klien", x + 40, y + 62, 38, { col: NAVY });
      const n = Math.floor(lerp(f.n0 ?? 96, f.n1 ?? 214, clamp(q / (f.countDur || 6), 0, 1))); P(ctx, x + 470, y + 22, 170, 54, 27, RED, 0); T(ctx, `${n} tiket`, x + 555, y + 59, 28, { align: "center", col: "#FFF" });
      ticketList(ctx, x + 20, y + 100, w - 40, h - 110, q, f, f.scroll ?? 40);
    } else if (mode === "longReply" || mode === "guide"){
      ctx.fillStyle = "#EEF1F4"; ctx.fillRect(x, y, 420, h); ticketList(ctx, x, y, 420, h, q, { hlRow: 0 }, 0);
      const px = x + 450, pw = w - 480; P(ctx, px, y + 20, pw, h - 40, 16, "#FFFFFF", 2, "#E3E6EA"); T(ctx, "Balasan untuk: Toko Berkah", px + 30, y + 70, 28, { col: NAVY });
      font(ctx, 500, 30, F2); const full = (f.quote ? f.quote + " " : "") + LONG + " " + LONG;
      const shown = typed(full, q, .2, f.cps || 26), lines = S.wrap(ctx, shown, pw - 70), lh = 44, maxL = Math.floor((h - 200) / lh);
      const first = Math.max(0, lines.length - maxL); ctx.save(); ctx.beginPath(); ctx.rect(px + 20, y + 95, pw - 40, h - 190); ctx.clip();
      lines.slice(first).forEach((l, i) => T(ctx, l, px + 35, y + 140 + i * lh, 30, { col: "#374151", w: 500, fam: F2 }));
      if (mode === "guide" && q > (f.guideAt ?? 1.5)){ const gq = pop(t, f.at + (f.guideAt ?? 1.5), .4); ctx.save(); ctx.translate(px + pw - 300, y + 300); ctx.scale(gq, gq); ctx.rotate(.03);
        P(ctx, -230, -160, 460, 320, 12, "#FFF7EA", 5, ORANGE); T(ctx, "PANDUAN BERGAMBAR", 0, -110, 26, { align: "center", col: ORANGE }); P(ctx, -180, -80, 160, 200, 10, "#3B3A40", 0); ctx.fillStyle = "#9FD3E0"; ctx.fillRect(-168, -68, 136, 150);
        ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(60, -20); ctx.lineTo(-60, 20); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-50, 30); ctx.lineTo(-62, 20); ctx.lineTo(-46, 8); ctx.stroke();
        T(ctx, "1. Buka menu", 30, 60, 22, { col: BROWN }); T(ctx, "2. Ketuk ikon", 30, 92, 22, { col: BROWN }); ctx.restore(); }
      ctx.restore();
      const cur = Math.sin(t * 8) > 0; if (cur){ ctx.fillStyle = NAVY; ctx.fillRect(px + 35 + Math.min(pw - 100, ctx.measureText(lines[lines.length - 1] || "").width + 4), y + 140 + Math.min(lines.length - 1 - first, maxL - 1) * lh - 26, 3, 32); }
      // scrollbar thumb shrinking = never-ending reply
      const th = Math.max(40, (h - 200) * maxL / Math.max(maxL, lines.length)); ctx.fillStyle = "#D1D5DB"; ctx.fillRect(px + pw - 24, y + 100, 8, h - 200); ctx.fillStyle = ORANGE; ctx.fillRect(px + pw - 24, y + 100 + (h - 200 - th), 8, th);
      T(ctx, `${lines.length * 9} kata`, px + pw - 40, y + h - 50, 24, { align: "right", col: "#9CA3AF", w: 600 });
    } else if (mode === "draft"){
      ctx.fillStyle = "#EEF1F4"; ctx.fillRect(x, y, w, h);
      const px = x + 40, pw = w - 80; P(ctx, px, y + 24, pw, 120, 16, "#FFFFFF", 2, "#E3E6EA"); T(ctx, "Bu Sari · Toko Sari Jaya", px + 30, y + 70, 28, { col: NAVY }); T(ctx, "Saya mau tanya cara cetak ulang struk.", px + 30, y + 115, 26, { col: "#374151", w: 500, fam: F2 });
      P(ctx, px + pw - 190, y + 46, 160, 44, 22, "#FDE2DF", 0); T(ctx, "masuk 09.02", px + pw - 110, y + 76, 22, { align: "center", col: RED, w: 700 });
      P(ctx, px, y + 170, pw, h - 300, 16, "#FFFFFF", 2, "#E3E6EA"); T(ctx, "DRAF BALASAN · belum terkirim", px + 30, y + 215, 24, { col: ORANGE, track: 2 });
      font(ctx, 500, 26, F2); const ptxt = ["Selamat siang, Ibu Sari yang kami hormati. Terima kasih sudah menghubungi Tangani dan mohon maaf atas ketidaknyamanannya.", "Untuk mencetak ulang struk, Ibu dapat membuka aplikasi kasir, lalu masuk ke menu utama, kemudian memilih bagian riwayat transaksi yang tersedia di sisi kiri layar...", "Agar lebih jelas, kami lampirkan panduan bergambar di bawah ini. Semoga usaha Ibu semakin lancar dan ramai pembeli."];
      let yy = y + 260; ptxt.forEach((p, i) => { const L = S.wrap(ctx, p, pw - 560); L.forEach(l => { T(ctx, l, px + 30, yy, 26, { col: "#374151", w: 500, fam: F2 }); yy += 36; }); yy += 16; });
      P(ctx, px + pw - 480, y + 240, 420, 290, 12, "#FFF7EA", 4, ORANGE); T(ctx, "PANDUAN.png", px + pw - 270, y + 290, 24, { align: "center", col: ORANGE }); P(ctx, px + pw - 400, y + 310, 120, 190, 8, "#3B3A40", 0); ctx.fillStyle = "#9FD3E0"; ctx.fillRect(px + pw - 390, y + 320, 100, 150);
      ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px + pw - 150, y + 400); ctx.lineTo(px + pw - 260, y + 420); ctx.stroke();
      // Kirim button (not pressed) + hovering cursor
      const bx = px + pw - 260, by = y + h - 110, pul = 1 + .04 * Math.sin(t * 6); ctx.save(); ctx.translate(bx + 110, by + 34); ctx.scale(pul, pul); P(ctx, -110, -34, 220, 68, 34, GREEN, 0); T(ctx, "Kirim ➤", 0, 11, 32, { align: "center", col: "#FFF" }); ctx.restore();
      const cx2 = bx + 60 + Math.sin(t * 1.7) * 140 - 120, cy2 = by + 40 + Math.cos(t * 1.3) * 30; cursor(ctx, cx2, cy2);
      T(ctx, "Masih dirapikan...", px + 30, by + 46, 28, { col: "#9CA3AF", w: 600 });
    } else if (mode === "chat"){
      ctx.fillStyle = "#EEF1F4"; ctx.fillRect(x, y, w, h);
      const px = x + 40; P(ctx, px, y + 24, w - 80, 90, 16, "#FFFFFF", 2, "#E3E6EA");
      ctx.beginPath(); ctx.arc(px + 55, y + 69, 32, 0, TAU); ctx.fillStyle = "#7FA563"; ctx.fill(); T(ctx, "Y", px + 55, y + 82, 34, { align: "center", col: "#FFF" });
      T(ctx, f.from || "Yoga · Data & Laporan", px + 105, y + 80, 30, { col: NAVY });
      const m1 = pop(t, f.at + (f.msgAt ?? .3), .35); ctx.save(); ctx.translate(px + 40, y + 150); ctx.scale(m1, m1); P(ctx, 0, 0, 640, 90, 24, "#FFFFFF", 3, "#D1D5DB"); T(ctx, f.msg || "Rin, kamu harus lihat ini.", 30, 58, 34, { col: "#111827", w: 600, fam: F2 }); ctx.restore();
      const m2 = pop(t, f.at + (f.imgAt ?? 1.4), .4); if (m2 > 0){ ctx.save(); ctx.translate(px + 40, y + 270); ctx.scale(m2, m2); P(ctx, 0, 0, 640, 420, 24, "#FFFFFF", 3, "#D1D5DB");
        miniRank(ctx, 30, 30, 580, 360, t, f); ctx.restore(); }
    } else if (mode === "review"){
      ctx.fillStyle = "#EEF1F4"; ctx.fillRect(x, y, w, h); T(ctx, "Balasan terkirim", x + 40, y + 62, 38, { col: NAVY });
      const per = f.per || 1.4; for (let k = 0; k < 5; k++){ const s0 = (f.revAt ?? .3) + k * per; const sh = pop(t, f.at + s0, .35); if (sh <= 0) continue;
        const yy = y + 100 + k * 128 - Math.max(0, (q - (f.revAt ?? .3) - 3 * per)) * 60; if (yy > y + h || yy < y - 120) continue;
        ctx.save(); ctx.globalAlpha = Math.min(1, sh); P(ctx, x + 40, yy, w - 80, 110, 16, "#FFFFFF", 2, "#E3E6EA"); T(ctx, TICKETS[k][1], x + 70, yy + 44, 26, { col: NAVY }); T(ctx, LONG.slice(k * 40, k * 40 + 70) + "...", x + 70, yy + 82, 22, { col: "#6B7280", w: 500, fam: F2 });
        const c1 = pop(t, f.at + s0 + .5, .3), c2 = pop(t, f.at + s0 + .8, .3); [[c1, "Benar", w - 330], [c2, "Sopan", w - 170]].forEach(([s, lab, xx]) => { if (s <= 0) return; ctx.save(); ctx.translate(x + xx, yy + 55); ctx.scale(s, s); P(ctx, -70, -24, 140, 48, 24, "#E7F3EC", 0); T(ctx, "✓ " + lab, 0, 9, 24, { align: "center", col: GREEN }); ctx.restore(); }); ctx.restore(); }
    } else if (mode === "shrink"){
      ctx.fillStyle = "#EEF1F4"; ctx.fillRect(x, y, w, h);
      const px = x + 40, pw = w - 80; P(ctx, px, y + 24, pw, 100, 16, "#FFFFFF", 2, "#E3E6EA"); T(ctx, "Bu Sari · Toko Sari Jaya", px + 30, y + 68, 28, { col: NAVY }); T(ctx, "Cara cetak ulang struk?", px + 30, y + 106, 24, { col: "#374151", w: 500, fam: F2 });
      const sq = clamp((q - (f.shrinkAt ?? 1)) / 1.4, 0, 1), e = easeIO(sq), sent = f.sendAt != null && q >= f.sendAt;
      // old long reply shrinks + fades
      if (e < 1){ ctx.save(); ctx.globalAlpha = 1 - e * .9; ctx.translate(px + pw / 2, y + 160 + (1 - e) * 250); ctx.scale(1 - e * .85, 1 - e * .85); ctx.translate(-(px + pw / 2), -(y + 160 + 250));
        P(ctx, px, y + 150, pw, 500, 16, "#FFFFFF", 2, "#E3E6EA"); font(ctx, 500, 26, F2); const L = S.wrap(ctx, LONG, pw - 60).slice(0, 11); L.forEach((l, i) => T(ctx, l, px + 30, y + 200 + i * 40, 26, { col: "#6B7280", w: 500, fam: F2 })); ctx.restore();
        if (sq > 0 && sq < 1){ ctx.save(); ctx.globalAlpha = .9 * (1 - sq); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(px + 100, y + 200); ctx.lineTo(px + pw - 100, y + 600); ctx.stroke(); ctx.restore(); } }
      // new short reply
      if (sq > .5){ const nq = pop(t, f.at + (f.shrinkAt ?? 1) + .9, .4), lift = sent ? -eOut(clamp((q - f.sendAt) / .5, 0, 1)) * 60 : 0;
        ctx.save(); ctx.translate(px + pw / 2, y + 330 + lift); ctx.scale(nq, nq); ctx.translate(-(px + pw / 2), -(y + 330));
        P(ctx, px + 80, y + 170, pw - 160, 330, 22, sent ? "#E7F6EE" : "#FFFFFF", 5, sent ? GREEN : ORANGE);
        const NEW = ["Bisa, Bu.", "1) Buka Riwayat", "2) Pilih transaksi", "3) Tekan Cetak Ulang.", "Semoga lancar!"];
        NEW.forEach((l, i) => T(ctx, typed(l, q, (f.shrinkAt ?? 1) + 1.2 + i * .45, 40), px + 130, y + 235 + i * 54, i === 0 || i === 4 ? 36 : 34, { col: i === 0 ? NAVY : i === 4 ? ORANGE : "#111827", fam: F2, w: 700 }));
        ctx.restore(); }
      // + paragraf / + gambar temptation buttons (wiggle) then Kirim
      const wig = f.itchAt != null && q > f.itchAt && !sent ? Math.sin(t * 22) * 4 : 0;
      if (q > (f.itchAt ?? 99) - .2 && !sent){ ctx.save(); ctx.translate(wig, 0); [["+ paragraf", px + 120], ["+ gambar", px + 380]].forEach(([lab, bx]) => { P(ctx, bx, y + h - 110, 230, 62, 31, "#F3F4F6", 3, "#D1D5DB"); T(ctx, lab, bx + 115, y + h - 68, 28, { align: "center", col: "#6B7280" }); }); ctx.restore(); }
      const bx = px + pw - 270, by = y + h - 112; P(ctx, bx, by, 230, 66, 33, sent ? "#9CA3AF" : GREEN, 0); T(ctx, sent ? "Terkirim ✓" : "Kirim ➤", bx + 115, by + 44, 32, { align: "center", col: "#FFF" });
      if (f.sendAt != null){ const cq = clamp((q - f.sendAt + 1.2) / 1.2, 0, 1); if (cq > 0 && q < f.sendAt + 1.5) cursor(ctx, lerp(bx - 300, bx + 120, easeIO(cq)), lerp(by - 200, by + 40, easeIO(cq)), q > f.sendAt && q < f.sendAt + .25); }
      if (f.day){ const dq = pop(t, f.at + .1, .3); ctx.save(); ctx.translate(x + w - 170, y + 70); ctx.scale(dq, dq); P(ctx, -110, -34, 220, 68, 18, NAVY, 0); T(ctx, f.day, 0, 13, 36, { align: "center", col: YEL }); ctx.restore(); }
    } else if (mode === "sari5"){
      ctx.fillStyle = "#EEF1F4"; ctx.fillRect(x, y, w, h);
      const px = x + 40, pw = w - 80; P(ctx, px, y + 24, pw, 86, 16, "#FFFFFF", 2, "#E3E6EA"); T(ctx, "Bu Sari · Toko Sari Jaya", px + 30, y + 80, 30, { col: NAVY });
      const m1 = pop(t, f.at + .2, .35); ctx.save(); ctx.translate(px + 30, y + 140); ctx.scale(m1, m1); P(ctx, 0, 0, 760, 86, 22, "#FFFFFF", 3, "#D1D5DB"); T(ctx, "Mbak, mau tanya lagi: cara ganti kertas struk?", 26, 54, 28, { col: "#111827", w: 600, fam: F2 }); T(ctx, "13.02", 740, 80, 18, { align: "right", col: "#9CA3AF", w: 600 }); ctx.restore();
      const m2 = pop(t, f.at + (f.replyAt ?? 1.6), .35); if (m2 > 0){ ctx.save(); ctx.translate(px + pw - 30, y + 260); ctx.scale(m2, m2); P(ctx, -700, 0, 700, 130, 22, "#DCF5E6", 3, "#B7E4C7"); T(ctx, "Bisa, Bu. 1) Buka penutup 2) Masukkan kertas", -674, 52, 28, { col: "#111827", w: 600, fam: F2 }); T(ctx, "3) Tutup lagi. Semoga lancar!", -674, 96, 28, { col: "#111827", w: 600, fam: F2 }); T(ctx, "13.07 ✓✓", -26, 122, 18, { align: "right", col: GREEN, w: 700 }); ctx.restore();
        const cq = pop(t, f.at + (f.replyAt ?? 1.6) + .4, .4); ctx.save(); ctx.translate(px + pw - 120, y + 240); ctx.scale(cq, cq); P(ctx, -110, -30, 220, 56, 28, ORANGE, 4, OUT); T(ctx, "⏱ 5 menit", 0, 10, 28, { align: "center", col: "#FFF" }); ctx.restore(); }
      const st = f.starsAt ?? 3.2; for (let k = 0; k < 5; k++){ const s = pop(t, f.at + st + k * .16, .35); if (s <= 0) continue; ctx.save(); ctx.translate(px + 120 + k * 120, y + 560); ctx.scale(s * 1.0, s * 1.0); ctx.rotate(Math.sin(t * 3 + k) * .08); ctx.fillStyle = YEL; starShape(ctx, 0, 0, 56); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
      const tq = pop(t, f.at + st + 1, .5); if (tq > 0){ ctx.save(); ctx.translate(px + 860, y + 540); ctx.scale(tq * 1.3, tq * 1.3); ctx.rotate(-.15 + Math.sin(t * 4) * .08); bigThumb(ctx); ctx.restore(); }
    } else if (mode === "folder"){
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y, 330, h);
      ["Dokumen", "Data klien", "Data vendor", "Arsip"].forEach((n, i) => { const on = i === 2; P(ctx, x + 20, y + 30 + i * 76, 290, 62, 12, on ? "#FDEBD9" : "#F3F4F6", 0); folderIcon(ctx, x + 60, y + 61 + i * 76, .8, on ? ORANGE : "#9CA3AF"); T(ctx, n, x + 100, y + 72 + i * 76, 26, { col: on ? ORANGE : "#374151" }); });
      T(ctx, "Data vendor", x + 380, y + 70, 40, { col: NAVY }); T(ctx, "0 item", x + 380, y + 112, 26, { col: "#9CA3AF", w: 600 });
      const e = pop(t, f.at + .4, .5); ctx.save(); ctx.translate(x + 380 + (w - 380) / 2, y + 420); ctx.scale(e, e); folderIcon(ctx, 0, -60, 3.2, "#E5E7EB"); T(ctx, "Folder ini kosong", 0, 120, 44, { align: "center", col: "#6B7280" }); ctx.restore();
    } else if (mode === "notif"){
      ticketList(ctx, x, y, w, h, q, {}, 30);
    }
    ctx.restore();
    // floating notification banner over the laptop (e.g. Yoga's message)
    if (f.notifAt != null){ const nq = pop(t, f.at + f.notifAt, .4); if (nq > 0){ ctx.save(); ctx.translate(1290, 150 + (1 - nq) * -80); ctx.globalAlpha = Math.min(1, nq); P(ctx, -330, -60, 660, 120, 20, "#FFFFFF", 4, OUT); ctx.beginPath(); ctx.arc(-260, 0, 38, 0, TAU); ctx.fillStyle = "#7FA563"; ctx.fill(); T(ctx, "Y", -260, 14, 40, { align: "center", col: "#FFF" }); T(ctx, "Yoga", -200, -8, 30, { col: NAVY }); T(ctx, "Rin, kamu harus lihat ini.", -200, 34, 26, { col: "#374151", w: 600, fam: F2 }); ctx.restore(); } }
  }, sfx(f, g, add){ const m = f.mode || "tickets"; if (m === "longReply" || m === "guide") add(g(f.at) + .2, "typing", .5, Math.min(6, (f.out ?? f.at + 5) - f.at));
    if (f.notifAt != null) add(g(f.at + f.notifAt), "notif", .9); if (m === "chat") add(g(f.at + (f.msgAt ?? .3)), "notif", .8);
    if (m === "shrink"){ add(g(f.at + (f.shrinkAt ?? 1)), "whoosh", .5); add(g(f.at + (f.shrinkAt ?? 1)) + 1.2, "typing", .45, 2.4); if (f.sendAt != null) add(g(f.at + f.sendAt), "send", .8); }
    if (m === "sari5"){ add(g(f.at + .2), "notif", .7); add(g(f.at + (f.replyAt ?? 1.6)), "send", .7); for (let k = 0; k < 5; k++) add(g(f.at + (f.starsAt ?? 3.2) + k * .16), "star", .6); add(g(f.at + (f.starsAt ?? 3.2) + 1), "chime", .8); }
    if (m === "review") for (let k = 0; k < 5; k++) add(g(f.at + (f.revAt ?? .3) + k * (f.per || 1.4) + .5), "pop", .5);
    if (m === "folder") add(g(f.at + .4), "dun", .7); if (m === "tickets") add(g(f.at), "notif", .5); } };
  function cursor(ctx, x, y, click){ ctx.save(); ctx.translate(x, y); if (click){ ctx.strokeStyle = hexA(ORANGE, .8); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.stroke(); } ctx.fillStyle = "#FFF"; ctx.strokeStyle = "#111"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 44); ctx.lineTo(12, 33); ctx.lineTo(22, 54); ctx.lineTo(30, 50); ctx.lineTo(20, 30); ctx.lineTo(36, 30); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
  function starShape(ctx, x, y, r){ ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } ctx.closePath(); }
  function bigThumb(ctx){ P(ctx, -60, -20, 110, 90, 22, "#F6C343", 6); P(ctx, -36, -95, 42, 90, 20, "#F6C343", 6); ctx.strokeStyle = "rgba(59,36,24,.4)"; ctx.lineWidth = 5; [10, 30, 50].forEach(y => { ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(46, y); ctx.stroke(); }); }
  function folderIcon(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; rr(ctx, -24, -14, 20, 8, 3); ctx.fill(); rr(ctx, -24, -10, 48, 32, 5); ctx.fill(); ctx.restore(); }
  S.starShape = starShape; S.bigThumb = bigThumb; S.cursor = cursor; S.laptopFrame = laptopFrame; S.typed = typed; S.folderIcon = folderIcon; S.ICONS = ICONS;

  // --- comic cut-away panels (3 problems) ---
  FX.panels = { layer: "screen", draw(ctx, f, t){ (f.items || []).forEach((it, i) => { const s = pop(t, it.at, .35), out = f.out ?? 1e9; if (s <= 0 || t > out + .3) return; const fo = 1 - fin(t, out, .3);
    const x = it.x ?? (330 + i * 630), y = it.y ?? 520, w = 520, h = 420; ctx.save(); ctx.globalAlpha = fo; ctx.translate(x, y); ctx.scale(s, s); ctx.rotate((i - 1) * .04);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; P(ctx, -w / 2, -h / 2, w, h, 16, "#FFF6EA", 0); ctx.restore(); P(ctx, -w / 2, -h / 2, w, h, 16, "#FFF6EA", 7, OUT);
    ctx.save(); rr(ctx, -w / 2 + 16, -h / 2 + 16, w - 32, h - 110, 10); ctx.clip(); ctx.fillStyle = ["#F4DEC1", "#E7D2A8", "#DCE8EE"][i % 3]; ctx.fillRect(-w / 2, -h / 2, w, h); panelArt(ctx, it.kind, t, 0, -40); ctx.restore();
    T(ctx, it.label, 0, h / 2 - 40, 34, { align: "center", col: BROWN, maxW: w - 40 }); ctx.restore(); }); },
    sfx(f, g, add){ (f.items || []).forEach(it => add(g(it.at), "pop", .7)); } };
  function panelArt(ctx, kind, t, x, y){
    ctx.save(); ctx.translate(x, y);
    if (kind === "kasir"){ P(ctx, -130, -100, 260, 170, 14, "#2B2A30", 6); ctx.fillStyle = "#7F8FA6"; ctx.fillRect(-114, -86, 228, 140); ctx.strokeStyle = "#FFF"; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, -16, 34, t * 5, t * 5 + 4.6); ctx.stroke(); T(ctx, "Tidak merespons", 0, 40, 22, { align: "center", col: "#FFF", w: 700 }); ctx.fillStyle = "#3B3A40"; ctx.fillRect(-160, 70, 320, 30); }
    else if (kind === "printer"){ const a = Object.assign({ size: 300, x: -90, y: 150, face: 1, seed: 7 }, { hair: "short", hairColor: "#2B1A12", shirt: "#E8B23A", skin: "b", mustache: true }, { keys: [{ at: 0, expr: "angry", pose: "hold" }] }); const st = TT.toonState(a, null, t); st.talk = false; TT.drawToon(ctx, a, st, t);
      ctx.save(); ctx.translate(50 + Math.sin(t * 30) * 2, -20); P(ctx, -70, -40, 140, 80, 12, "#3B3A40", 5); ctx.fillStyle = "#FFFDF8"; ctx.beginPath(); ctx.moveTo(-40, -42); ctx.quadraticCurveTo(-60, -90, -20, -110); ctx.lineTo(10, -100); ctx.quadraticCurveTo(30, -80, 30, -42); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
      for (let k = 0; k < 3; k++){ const q = (t * .8 + k / 3) % 1; ctx.globalAlpha = .6 * (1 - q); ctx.fillStyle = "#9AA3AE"; ctx.beginPath(); ctx.arc(60 + k * 8, -60 - q * 80, 10 + q * 12, 0, TAU); ctx.fill(); } ctx.restore(); }
    else if (kind === "laporan"){ P(ctx, -150, -110, 300, 200, 12, "#FFFFFF", 5); ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 3; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(-120, -70 + k * 40); ctx.lineTo(120, -70 + k * 40); ctx.stroke(); }
      const b = Math.abs(Math.sin(t * 3)) * 10; T(ctx, "?", 0, 40 - b, 140, { align: "center", col: RED, stroke: OUT, sw: 10 }); T(ctx, "Laporan: 0", 0, 80, 24, { align: "center", col: "#6B7280", w: 700 }); }
    ctx.restore();
  }

  // --- framed photo of Dimas (full screen insert) ---
  FX.photo = { layer: "screen", draw(ctx, f, t){ const q = t - f.at;
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C98A55"], [1, "#9C6A40"]])); ctx.fillStyle = "rgba(59,36,24,.12)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, 120 * k + 40, SW, 4);
    const z = 1 + q * .025; ctx.save(); ctx.translate(960, 520); ctx.scale(z, z); ctx.rotate(-.03);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; P(ctx, -330, -400, 660, 800, 20, "#5A321C", 0); ctx.restore(); P(ctx, -330, -400, 660, 800, 20, "#5A321C", 6, OUT);
    ctx.save(); rr(ctx, -280, -350, 560, 640, 8); ctx.clip(); ctx.fillStyle = lg(ctx, 0, -350, 0, 290, [[0, "#BFE2EA"], [1, "#F6E2C4"]]); ctx.fillRect(-280, -350, 560, 640);
    ctx.fillStyle = "#E8D2B0"; ctx.fillRect(-280, 120, 560, 200); ctx.fillStyle = "#C9B08C"; for (let k = 0; k < 5; k++) ctx.fillRect(-280 + k * 130, 40, 70, 90);
    drawDimas(ctx, 0, -60, 1.25, t, "happy"); ctx.restore();
    ctx.fillStyle = "#FFF6EA"; ctx.fillRect(-280, 300, 560, 0); T(ctx, f.caption || "Dimas · semester 5", 0, 360, 40, { align: "center", col: "#FFF6EA" });
    ctx.restore();
    const glare = (q * .4) % 2; if (glare < 1){ ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = "#FFF"; ctx.translate(lerp(400, 1500, glare), 0); ctx.rotate(.3); ctx.fillRect(-60, -200, 120, 1600); ctx.restore(); } } };

  // --- statement card ---
  FX.card = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, out = f.out ?? 1e9; if (q < 0 || t > out + .4) return;
    const s = pop(t, f.at, .45) * (1 - .2 * fin(t, out, .4)), a = 1 - fin(t, out, .4), big = f.style !== "small";
    ctx.save(); ctx.globalAlpha = a;
    if (big && f.dim !== false){ ctx.fillStyle = `rgba(12,8,20,${.45 * Math.min(1, s)})`; ctx.fillRect(0, 0, SW, SH); }
    ctx.translate((f.x ?? 960) + Math.sin(t * .8) * 8, (f.y ?? (big ? 470 : 200)) + Math.sin(t * 1.3) * 7); ctx.scale(s * (1 + .015 * Math.sin(t * 1.1)), s * (1 + .015 * Math.sin(t * 1.1))); ctx.rotate(((f.rot ?? -1.5) + Math.sin(t * .9) * .8) * Math.PI / 180);
    const size = f.size || (big ? 84 : 46); font(ctx, 800, size, F); const L = S.wrap(ctx, f.text, f.maxW || (big ? 1300 : 900)), lw2 = Math.max(...L.map(l => ctx.measureText(l).width)), w = lw2 + size * 1.4, tp = f.tag ? 22 : 0, h = L.length * size * 1.2 + size * 1.0 + (f.sub ? size * .9 : 0) + tp;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, -w / 2, -h / 2, w, h, 26, f.bg || (big ? ORANGE : "#FFF6EA"), 0); ctx.restore();
    P(ctx, -w / 2, -h / 2, w, h, 26, f.bg || (big ? ORANGE : "#FFF6EA"), 7, OUT);
    if (f.tag){ font(ctx, 800, 28, F); const tw = ctx.measureText(f.tag).width + 40; P(ctx, -w / 2 + 30, -h / 2 - 24, tw, 48, 12, NAVY, 4, OUT); T(ctx, f.tag, -w / 2 + 50, -h / 2 + 10, 28, { col: YEL }); }
    L.forEach((l, i) => T(ctx, l, 0, -h / 2 + tp + size * 1.15 + i * size * 1.2, size, { align: "center", col: big ? "#FFF6EA" : BROWN }));
    if (f.sub) T(ctx, f.sub, 0, h / 2 - size * .55, size * .62, { align: "center", col: big ? NAVY : ORANGE });
    const sh = (q - .3) / .8; if (sh > 0 && sh < 1){ ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.clip(); ctx.translate(-w / 2 - 200 + sh * (w + 400), 0); ctx.rotate(.3); ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.fillRect(-60, -h, 120, h * 2); ctx.restore(); }
    ctx.restore(); }, sfx(f, g, add){ add(g(f.at), f.style === "small" ? "pop" : "stamp", .8); } };

  // --- 3 steps (orange cards appearing one by one) ---
  FX.steps = { layer: "screen", draw(ctx, f, t){ const items = f.items || [], x = f.x ?? 1290, y0 = f.y ?? 250, gap = f.gap ?? 210, w = f.w ?? 1060;
    if (f.title){ const s = pop(t, items[0] ? items[0].at - .3 : f.at, .3); ctx.save(); ctx.translate(x, y0 - 120); ctx.scale(s, s); T(ctx, f.title, 0, 0, 40, { align: "center", col: "#FFF", stroke: OUT, sw: 10 }); ctx.restore(); }
    items.forEach((it, i) => { const s = pop(t, it.at, .4), out = f.out ?? 1e9; if (s <= 0 || t > out + .3) return; const a = 1 - fin(t, out, .3);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(x + (1 - Math.min(1, s)) * 300 + Math.sin(t * .8 + i) * 6, y0 + i * gap + Math.sin(t * 1.2 + i * 1.7) * 6); ctx.scale(Math.min(1.08, s), Math.min(1.08, s)); ctx.rotate((i % 2 ? 1 : -1) * .012);
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; P(ctx, -w / 2, -80, w, 160, 24, it.bg || ORANGE, 0); ctx.restore(); P(ctx, -w / 2, -80, w, 160, 24, it.bg || ORANGE, 6, OUT);
      ctx.beginPath(); ctx.arc(-w / 2 + 86, 0, 52, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, String(i + 1), -w / 2 + 86, 22, 62, { align: "center", col: ORANGE });
      font(ctx, 800, it.size || 44, F); const L = S.wrap(ctx, it.text, w - 220); L.slice(0, 2).forEach((l, j) => T(ctx, l, -w / 2 + 170, (L.length > 1 ? -12 : 16) + j * 54, it.size || 44, { col: "#FFF6EA" }));
      ctx.restore(); }); }, sfx(f, g, add){ (f.items || []).forEach(it => add(g(it.at), "stamp", .6)); } };

  // --- lesson card (orange, 3 lines) ---
  FX.lesson = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .5); if (s <= 0) return;
    U.motes(ctx, t * 2, 40, 33, 0, 0, SW, SH, "#FFF3D6", .8);
    ctx.save(); ctx.translate(1120 + Math.sin(t * .9) * 14, 520 + Math.sin(t * 1.3) * 12); ctx.scale(s * (1 + .012 * Math.sin(t * 1.7)), s * (1 + .012 * Math.sin(t * 1.7))); ctx.rotate(-.012 + Math.sin(t * .8) * .01);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; P(ctx, -640, -360, 1280, 720, 36, ORANGE, 0); ctx.restore(); P(ctx, -640, -360, 1280, 720, 36, ORANGE, 8, OUT);
    P(ctx, -610, -330, 1220, 660, 26, "rgba(255,246,234,0)", 3, "rgba(255,246,234,.35)");
    { const q3 = ((t - f.at) % 3.2) / 1.1; if (q3 < 1){ ctx.save(); rr(ctx, -640, -360, 1280, 720, 36); ctx.clip(); ctx.translate(-900 + q3 * 1800, 0); ctx.rotate(.3); ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.fillRect(-90, -900, 180, 1800); ctx.restore(); } }
    font(ctx, 800, 30, F); P(ctx, -560, -400, 420, 66, 16, NAVY, 5, OUT); T(ctx, f.tag || "PELAJARAN DARI RINA", -350, -356, 30, { align: "center", col: YEL, track: 2 });
    (f.items || []).forEach((it, i) => { const q = pop(t, it.at, .4); if (q <= 0) return; ctx.save(); ctx.translate((1 - Math.min(1, q)) * 120, -200 + i * 200); ctx.globalAlpha = Math.min(1, q);
      ctx.beginPath(); ctx.arc(-500, 0, 56, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, String(i + 1), -500, 24, 66, { align: "center", col: ORANGE });
      font(ctx, 800, 54, F); const L = S.wrap(ctx, it.text, 900); L.slice(0, 2).forEach((l, j) => T(ctx, l, -410, (L.length > 1 ? -12 : 18) + j * 64, 54, { col: "#FFF6EA" })); ctx.restore(); });
    ctx.restore(); }, sfx(f, g, add){ add(g(f.at), "stamp", .7); (f.items || []).forEach(it => add(g(it.at), "chime", .5)); } };

  // --- graphs (full screen board) ---
  const NAMES = ["Sinta", "Dewi", "Fajar", "Lia", "Agus", "Rina"];
  function board(ctx, x, y, w, h, title, sub){ ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, x, y, w, h, 28, NAVY, 0); ctx.restore(); P(ctx, x, y, w, h, 28, NAVY, 6, OUT);
    T(ctx, title, x + 50, y + 80, 44, { col: "#FFF" }); if (sub) T(ctx, sub, x + 50, y + 124, 28, { col: "#A9BCDD", w: 600 }); }
  function miniRank(ctx, x, y, w, h, t, f){ ctx.fillStyle = "#F7F8FA"; ctx.fillRect(x, y, w, h); T(ctx, "Waktu balas tim", x + 20, y + 40, 26, { col: NAVY });
    NAMES.forEach((n, i) => { const yy = y + 70 + i * 46, v = [.25, .3, .35, .4, .45, .95][i]; ctx.save(); ctx.filter = "blur(4px)"; T(ctx, n, x + 20, yy + 26, 22, { col: "#374151", w: 700 }); ctx.restore(); P(ctx, x + 130, yy + 6, (w - 160) * v, 28, 8, i === 5 ? RED : "#93A4C3", 0); }); }
  FX.graph = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, mode = f.mode || "rank";
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]])); U.motes(ctx, t, 26, 3, 0, 0, SW, SH, "#9FB9E8", .35);
    if (mode === "rank" || mode === "rise"){
      const rise = mode === "rise"; const z = 1 + q * (f.push ?? .035), pan = rise ? 0 : Math.min(1, q / (f.panDur || 9)) * 160;
      ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540 - pan);
      board(ctx, 300, 70, 1320, 960, f.title || "Rata-rata waktu balas klien", f.sub || "Tim Layanan Pelanggan · Januari");
      const order = rise ? ["Sinta", "Dewi", "Rina", "Fajar", "Lia", "Agus"] : NAMES; const vals = { Sinta: .2, Dewi: .26, Fajar: .33, Lia: .38, Agus: .45, Rina: 1 };
      const rq = rise ? easeIO(clamp((q - (f.riseAt ?? 1)) / 2.2, 0, 1)) : 0;
      NAMES.forEach((n, i) => { const iStart = i, iEnd = order.indexOf(n), pos = lerp(iStart, iEnd, rq), yy = 220 + pos * 128, isR = n === "Rina";
        const v = isR ? lerp(1, .36, rise ? rq : 0) : vals[n]; const grow = eOut(clamp((q - .3 - i * .15) / .9, 0, 1));
        const rev = isR ? (rise ? 1 : clamp((q - (f.revealAt ?? 3)) / 1.2, 0, 1)) : (rise ? 1 : 0);
        ctx.save(); if (rev < 1) ctx.filter = `blur(${(1 - rev) * 9}px)`; T(ctx, isR && rev > .5 ? "RINA" : n.toUpperCase(), 360, yy + 52, 40, { col: isR && rev > .5 ? "#FFB4A8" : "#DCE6F5" }); ctx.restore();
        P(ctx, 620, yy + 14, 880 * v * grow, 60, 14, isR ? (rise ? lerp(0, 1, rq) > .5 ? ORANGE : RED : RED) : "#5B7DB1", 0);
        if (grow > .9){ const hrs = isR ? (rise ? (6 - 4 * rq).toFixed(0) : "6") : ["1", "1", "1", "1", "2"][i] || "1"; T(ctx, `${hrs} jam`, 620 + 880 * v * grow + 20, yy + 56, 32, { col: "#FFF" }); }
        if (isR && rev > .5 && !rise){ ctx.save(); ctx.globalAlpha = .4 + .4 * Math.sin(t * 6); ctx.strokeStyle = RED; ctx.lineWidth = 6; rr(ctx, 330, yy, 1260, 90, 16); ctx.stroke(); ctx.restore(); }
        if (isR && rise){ ctx.save(); ctx.globalAlpha = rq; ctx.translate(1540, yy + 44); T(ctx, "▲", 0, 14, 44, { align: "center", col: "#7FD39B" }); ctx.restore(); } });
      ctx.restore();
    } else if (mode === "avg" || mode === "dual"){
      const dual = mode === "dual", sl = dual ? easeIO(clamp((q - (f.slideAt ?? 0)) / .8, 0, 1)) : 0;
      // graph 1: average reply time
      const g1x = lerp(460, 120, sl), gw = lerp(1000, 820, sl);
      board(ctx, g1x, 120, gw, 820, "Rata-rata waktu balas", "Januari · jam");
      const bars1 = [["Rina", 6, RED], ["Tim", 1, "#5B7DB1"]]; bars1.forEach(([n, v, col], i) => { const g = eOut(clamp((q - .3 - i * .3) / 1, 0, 1)), bh = 520 * v / 6 * g, bx = g1x + 140 + i * (gw - 280) / 1.6;
        P(ctx, bx, 860 - bh, 220, Math.max(4, bh), [16, 16, 4, 4], col, 0); T(ctx, `${Math.round(v * g)} jam`, bx + 110, 840 - bh, 48, { align: "center", col: "#FFF" }); T(ctx, n, bx + 110, 920, 36, { align: "center", col: "#DCE6F5" }); });
      if (dual && sl > .02){ const g2x = lerp(1960, 1000, sl); board(ctx, g2x, 120, 820, 820, "Jam kerja per minggu", "paling panjang di tim");
        const vals = [["Rina", 60, RED], ["Sinta", 41, "#5B7DB1"], ["Dewi", 42, "#5B7DB1"], ["Fajar", 40, "#5B7DB1"]];
        vals.forEach(([n, v, col], i) => { const g = eOut(clamp((q - (f.slideAt ?? 0) - .6 - i * .2) / 1, 0, 1)), bh = 520 * v / 60 * g, bx = g2x + 90 + i * 175;
          P(ctx, bx, 860 - bh, 130, Math.max(4, bh), [14, 14, 4, 4], col, 0); T(ctx, String(Math.round(v * g)), bx + 65, 840 - bh, 38, { align: "center", col: "#FFF" }); T(ctx, n, bx + 65, 920, 30, { align: "center", col: "#DCE6F5" }); });
        // red arrows: up on hours, up on reply time = bad
        const aq = pop(t, f.at + (f.arrowAt ?? 2.5), .5); if (aq > 0){ [[g1x + gw - 120, 420, -1, "LAMBAT"], [g2x + 720, 300, -1, "LEMBUR"]].forEach(([ax, ay, d, lab], i) => { ctx.save(); ctx.translate(ax, ay + Math.sin(t * 4 + i) * 10); ctx.scale(aq, aq); ctx.fillStyle = RED; ctx.strokeStyle = "#FFF"; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(0, -90 * -d * -1); ctx.lineTo(60, 0); ctx.lineTo(22, 0); ctx.lineTo(22, 90); ctx.lineTo(-22, 90); ctx.lineTo(-22, 0); ctx.lineTo(-60, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); T(ctx, lab, 0, 140, 30, { align: "center", col: "#FFB4A8" }); ctx.restore(); }); }
        const dq = pop(t, f.at + (f.downAt ?? 3.5), .5); if (dq > 0){ ctx.save(); ctx.translate(960, 1000); ctx.scale(dq, dq); P(ctx, -330, -46, 660, 84, 42, "#FFF6EA", 5, OUT); T(ctx, "Kepuasan klien  ▼", 0, 14, 38, { align: "center", col: RED }); ctx.restore(); } }
    }
  }, sfx(f, g, add){ const m = f.mode || "rank"; if (m === "rank"){ add(g(f.at), "riser", .6, (f.revealAt ?? 3) + .3); add(g(f.at + (f.revealAt ?? 3)) + .3, "dun", .9); } if (m === "rise") add(g(f.at + (f.riseAt ?? 1)), "rise", .7);
    if (m === "dual"){ add(g(f.at + (f.slideAt ?? 0)), "whoosh", .5); add(g(f.at + (f.arrowAt ?? 2.5)), "dun", .7); } if (m === "avg") add(g(f.at) + .3, "pop", .5); } };

  // --- wall TV board in the office (world) ---
  FX.tvBoard = { layer: "world", draw(ctx, f, t){ const x = f.x ?? 360, y = f.y ?? 120, w = f.w ?? 620, h = f.h ?? 360, q = t - (f.at || 0);
    ctx.save(); ctx.translate(0, 0); P(ctx, x - 18, y - 18, w + 36, h + 36, 18, "#1E1D22", 6); ctx.fillStyle = "#13223D"; ctx.fillRect(x, y, w, h); glow(ctx, x + w / 2, y + h / 2, w * .7, "#5D7BB0", .15);
    if ((f.mode || "queue") === "queue"){ T(ctx, "ANTREAN TIKET TIM", x + 24, y + 44, 28, { col: "#FFF", track: 2 });
      const cols = [["Sinta", f.sinta ?? .08], ["Dewi", .35], ["Rina", 1], ["Fajar", .4], ["Lia", .3]];
      cols.forEach(([n, v], i) => { const g = eOut(clamp((q - .2 - i * .12) / .9, 0, 1)), bh = (h - 120) * v * g, bx = x + 40 + i * (w - 80) / 5, isR = n === "Rina", pulse = isR ? .75 + .25 * Math.sin(t * 6) : 1;
        ctx.globalAlpha = pulse; P(ctx, bx, y + h - 50 - bh, (w - 80) / 5 - 26, Math.max(3, bh), 6, isR ? RED : "#5B7DB1", 0); ctx.globalAlpha = 1;
        T(ctx, n, bx + ((w - 80) / 5 - 26) / 2, y + h - 18, 22, { align: "center", col: isR ? "#FFB4A8" : "#DCE6F5", w: 700 });
        if (g > .8) T(ctx, String(Math.round(v * 52)), bx + ((w - 80) / 5 - 26) / 2, y + h - 58 - bh, 24, { align: "center", col: "#FFF" }); }); }
    else { T(ctx, "WAKTU BALAS · TIM", x + 24, y + 44, 28, { col: "#FFF", track: 2 }); const rq = easeIO(clamp((q - (f.riseAt ?? .8)) / 2, 0, 1)); const order0 = NAMES, idxR = lerp(5, 2.6, rq);
      NAMES.forEach((n, i) => { const isR = n === "Rina", pos = isR ? idxR : (i >= 3 && rq > 0 ? i + (i < 5 ? lerp(0, 1, rq) * (i >= 3 ? 1 : 0) : 0) : i), yy = y + 70 + Math.min(pos, 5) * 46, v = isR ? lerp(.95, .4, rq) : [.25, .3, .35, .4, .45][i];
        T(ctx, n, x + 24, yy + 28, 22, { col: isR ? "#FFD3A8" : "#DCE6F5", w: 700 }); P(ctx, x + 120, yy + 8, (w - 160) * v, 28, 8, isR ? (rq > .5 ? ORANGE : RED) : "#5B7DB1", 0); });
      if (rq > .2){ ctx.save(); ctx.globalAlpha = rq; T(ctx, "▲", x + w - 30, y + 70 + idxR * 46 + 30, 34, { align: "center", col: "#7FD39B" }); ctx.restore(); } }
    ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * .35, y); ctx.lineTo(x, y + h * .6); ctx.fill();
    ctx.restore(); } };

  // --- whiteboard cards in Bu Ratna's room (world, layer depth .4 to match the wall) ---
  FX.boardCards = { layer: "world", draw(ctx, f, t){ const b = S.boardRect || [820, 120, 640, 380]; (f.items || []).forEach((it, i) => { const s = pop(t, it.at, .4); if (s <= 0) return;
    const cw = Math.min(280, b[2] * .42), cx = b[0] + b[2] * (i ? .75 : .25), cy = b[1] + b[3] * .62; ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.rotate((i ? 1 : -1) * .04);
    P(ctx, -cw / 2, -60, cw, 120, 12, i ? YEL : ORANGE, 5); T(ctx, it.text, 0, 12, 32, { align: "center", col: i ? BROWN : "#FFF", maxW: cw - 30 }); ctx.restore(); }); },
    sfx(f, g, add){ (f.items || []).forEach(it => add(g(it.at), "stamp", .6)); } };

  // --- yellow notebook close-up ---
  FX.notebook = { layer: "screen", draw(ctx, f, t){ const q = t - f.at;
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C8A27A"], [1, "#A98258"]])); const z = 1 + q * .03; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.05 + Math.sin(t * .8) * .01);
    // hands holding (Sinta's skin)
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; P(ctx, -620, -380, 1240, 760, 22, "#E8B23A", 0); ctx.restore();
    P(ctx, -620, -380, 1240, 760, 22, "#E8B23A", 7, OUT); P(ctx, -590, -350, 580, 700, 12, "#FFFBEA", 3); P(ctx, 10, -350, 580, 700, 12, "#FFFBEA", 3);
    ctx.strokeStyle = "rgba(95,140,200,.35)"; ctx.lineWidth = 3; for (let k = 0; k < 13; k++){ [[-570, -30], [30, 570]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a, -280 + k * 50); ctx.lineTo(b, -280 + k * 50); ctx.stroke(); }); }
    ctx.fillStyle = "#3B2418"; for (let k = 0; k < 12; k++){ ctx.beginPath(); ctx.arc(0, -320 + k * 58, 10, 0, TAU); ctx.fill(); }
    const rv = clamp((q - (f.writeAt ?? .3)) / 1.2, 0, 1); ctx.save(); ctx.beginPath(); ctx.rect(-570, -300, 1140 * rv, 400); ctx.clip();
    T(ctx, "TARGETNYA", -300, -80, 96, { align: "center", col: "#1F4E8C", fam: "'Plus Jakarta Sans'", w: 800 }); T(ctx, "APA?", -300, 40, 120, { align: "center", col: RED, fam: "'Plus Jakarta Sans'", w: 800 }); ctx.restore();
    if (rv >= 1){ ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(-300, -20, 300, 150, -.05, 0, TAU * Math.min(1, (q - (f.writeAt ?? .3) - 1.2) / .6)); ctx.stroke(); }
    ["• tiket hari ini habis", "• balas < 1 jam", "• klien puas ★"].forEach((l, i) => T(ctx, l, 70, -230 + i * 100, 46, { col: "#374151", fam: "'Plus Jakarta Sans'", w: 700 }));
    ctx.restore(); }, sfx(f, g, add){ add(g(f.at + (f.writeAt ?? .3)), "scribble", .7, 1.2); } };

  // --- phone close-up: modes cicilan | tagihan | call ---
  FX.phone = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, mode = f.mode || "tagihan";
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, f.night ? [[0, "#2A2346"], [1, "#120E20"]] : [[0, "#6F5A86"], [1, "#D98A78"]])); U.motes(ctx, t, 26, 9, 0, 0, SW, SH, "#FFE3B0", .45);
    const shake = mode === "tagihan" && q > (f.buzzAt ?? .2) && q < (f.buzzAt ?? .2) + 1.6 ? Math.sin(t * 70) * 6 : 0, z = 1 + q * .02;
    ctx.save(); ctx.translate(960 + shake, 560); ctx.scale(z, z); ctx.rotate(-.06);
    // hand
    ctx.fillStyle = "#E2A77C"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; rr(ctx, -260, 120, 520, 420, 120); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; P(ctx, -230, -470, 460, 900, 60, "#1E1A18", 0); ctx.restore(); P(ctx, -230, -470, 460, 900, 60, "#1E1A18", 7, OUT);
    ctx.save(); rr(ctx, -205, -440, 410, 840, 44); ctx.clip(); ctx.fillStyle = lg(ctx, 0, -440, 0, 400, [[0, "#F6C98C"], [1, "#C2691F"]]); ctx.fillRect(-205, -440, 410, 840);
    T(ctx, "19.42", 0, -300, 96, { align: "center", col: "#FFF" }); T(ctx, "Kamis, 9 Januari", 0, -250, 30, { align: "center", col: "#FFF6EA", w: 600 });
    if (mode === "cicilan"){ const s = pop(t, f.at + .3, .4); ctx.save(); ctx.translate(0, 0); ctx.scale(s, s); P(ctx, -170, -120, 340, 240, 26, "#FFF6EA", 5); T(ctx, "PONSEL BARU", 0, -60, 32, { align: "center", col: ORANGE }); T(ctx, "Rp300rb", 0, 20, 70, { align: "center", col: BROWN }); T(ctx, "/bulan · 12x", 0, 76, 30, { align: "center", col: "#8A5A3E", w: 600 }); ctx.restore();
      for (let i = 0; i < 6; i++){ const a = t * 1.5 + i; ctx.fillStyle = i % 2 ? YEL : "#FFF"; ctx.save(); ctx.translate(Math.cos(a) * 190, Math.sin(a * 1.3) * 300); TT.star(ctx, 0, 0, 16 + 6 * Math.sin(t * 5 + i)); ctx.restore(); } }
    if (mode === "tagihan"){ const s = pop(t, f.at + (f.buzzAt ?? .2), .4); ctx.save(); ctx.translate(0, -120 + (1 - Math.min(1, s)) * -100); ctx.globalAlpha = Math.min(1, s);
      P(ctx, -190, -80, 380, 190, 26, "#FFFFFF", 4); ctx.beginPath(); ctx.arc(-130, -20, 34, 0, TAU); ctx.fillStyle = RED; ctx.fill(); T(ctx, "!", -130, -4, 46, { align: "center", col: "#FFF" });
      T(ctx, "PayNanti", -80, -30, 30, { col: NAVY }); T(ctx, "Tagihan jatuh", -165, 40, 34, { col: "#111827", w: 800 }); T(ctx, "tempo BESOK", -165, 84, 34, { col: RED, w: 800 }); ctx.restore(); }
    if (mode === "call"){ const r = (t * 1.5) % 1; ctx.strokeStyle = hexA("#FFFFFF", 1 - r); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 40, 90 + r * 120, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 40, 90, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); T(ctx, "S", 0, 70, 90, { align: "center", col: ORANGE });
      T(ctx, "Bu Sari", 0, 220, 54, { align: "center", col: "#FFF" }); T(ctx, "Toko Sari Jaya · memanggil", 0, 270, 28, { align: "center", col: "#FFF6EA", w: 600 }); }
    ctx.restore(); ctx.restore(); }, sfx(f, g, add){ const m = f.mode || "tagihan"; if (m === "tagihan") add(g(f.at + (f.buzzAt ?? .2)), "buzz", .9, 1.4); if (m === "cicilan") add(g(f.at + .3), "sparkle", .7); if (m === "call") add(g(f.at), "ring", .8, 2.2); } };

  // --- inside the bus at night: Rina by the window (full screen) ---
  FX.busWindow = { layer: "screen", draw(ctx, f, t){ const q = t - f.at;
    fillAll(ctx, "#1B1A2A");
    ctx.save(); rr(ctx, 260, 120, 1400, 560, 40); ctx.clip(); ctx.fillStyle = lg(ctx, 0, 120, 0, 680, [[0, "#151A36"], [1, "#3A2C48"]]); ctx.fillRect(260, 120, 1400, 560);
    for (let k = 0; k < 3; k++){ const sp = [260, 520, 900][k], depth = [.4, .7, 1][k]; for (let i = 0; i < 14; i++){ const w = 120 + rnd(i + k * 30) * 180, h = (180 + rnd(i + 9 + k * 30) * 300) * depth, x = 1800 - ((t * sp + i * 260) % 2600), base = 680;
      ctx.fillStyle = ["#24253F", "#2C2A48", "#1A1830"][k]; ctx.fillRect(x, base - h, w, h); for (let wy = base - h + 20; wy < base - 10; wy += 34) for (let wx = x + 10; wx < x + w - 14; wx += 22) if (rnd(wx * 1.3 + wy + k) > .55){ ctx.fillStyle = "rgba(246,196,122,.85)"; ctx.fillRect(wx, wy, 10, 15); } } }
    for (let i = 0; i < 8; i++){ const x = 1800 - ((t * 1400 + i * 400) % 2400); ctx.fillStyle = "rgba(255,227,168,.5)"; ctx.fillRect(x, 620 + (i % 2) * 20, 180, 5); }
    ctx.restore(); ctx.strokeStyle = "#3A3950"; ctx.lineWidth = 30; rr(ctx, 260, 120, 1400, 560, 40); ctx.stroke(); ctx.fillStyle = "#3A3950"; ctx.fillRect(930, 120, 30, 560);
    ctx.fillStyle = "#2B2A3E"; ctx.fillRect(0, 700, SW, 400); ctx.fillStyle = "#3B4A6B"; rr(ctx, 230, 380, 260, 760, 40); ctx.fill(); ctx.fillStyle = "#2F3C59"; rr(ctx, 250, 400, 220, 120, 30); ctx.fill();
    ctx.strokeStyle = "#9AA3AE"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, 90); ctx.lineTo(SW, 90); ctx.stroke(); for (let k = 0; k < 6; k++){ const hx = 160 + k * 340, sw = Math.sin(t * 2 + k) * .08; ctx.save(); ctx.translate(hx, 90); ctx.rotate(sw); ctx.strokeStyle = "#9AA3AE"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 78, 18, 0, TAU); ctx.stroke(); ctx.restore(); }
    // Rina seated (drawn by the toon engine), looking out, then determined
    const a = Object.assign({ size: 780, x: 820, y: 1110, face: 1, seed: 5 }, S.cast.rina.look || S.cast.rina, { keys: [{ at: 0, pose: "sit", expr: "sad", look: [.9, -.1] }, { at: f.decideAt ?? 3, expr: "neutral", look: "cam" }, { at: (f.decideAt ?? 3) + .9, pose: "hips", expr: "proud", emote: "!!" }] });
    const st = TT.toonState(a, null, q); st.talk = false; const bob = Math.sin(t * 9) * 2; ctx.save(); ctx.translate(0, bob); TT.drawToon(ctx, a, st, q); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = "lighter"; for (let i = 0; i < 3; i++){ const x = 1900 - ((t * 700 + i * 700) % 2600); ctx.fillStyle = lg(ctx, x - 200, 0, x + 200, 0, [[0, "rgba(255,200,120,0)"], [.5, "rgba(255,200,120,.12)"], [1, "rgba(255,200,120,0)"]]); ctx.fillRect(x - 200, 0, 400, SH); } ctx.restore();
    if (q > (f.decideAt ?? 3) + .9){ const s = pop(t, f.at + (f.decideAt ?? 3) + .9, .4); ctx.save(); ctx.translate(1330, 300); ctx.scale(s, s); ctx.rotate(-.04); P(ctx, -300, -60, 600, 120, 24, ORANGE, 6, OUT); T(ctx, "LEBIH KERAS LAGI!", 0, 18, 52, { align: "center", col: "#FFF" }); ctx.restore(); }
  }, sfx(f, g, add){ add(g(f.at), "bus", .6, 4); add(g(f.at + (f.decideAt ?? 3) + .9), "stamp", .8); } };

  // --- video call on the laptop in the kos room (world space) ---
  FX.videoCall = { layer: "world", draw(ctx, f, t){ const x = f.x ?? 1180, y = f.y ?? 718, q = t - (f.at || 0);
    ctx.save(); ctx.translate(x, y);
    P(ctx, -230, -10, 460, 22, 8, "#3B3A40", 5); ctx.save(); ctx.transform(1, 0, -.12, 1, 0, 0); P(ctx, -200, -330, 400, 320, 18, "#26252B", 6);
    ctx.save(); rr(ctx, -184, -314, 368, 288, 10); ctx.clip(); ctx.fillStyle = lg(ctx, 0, -314, 0, -26, [[0, "#9FC6D0"], [1, "#F6E2C4"]]); ctx.fillRect(-184, -314, 368, 288);
    ctx.fillStyle = "#C9B08C"; ctx.fillRect(-184, -120, 368, 100); ctx.fillStyle = "#8E5A34"; ctx.fillRect(60, -260, 100, 120);
    drawDimas(ctx, 0, -190, .62, t, f.expr || "happy", !!(f.talkFrom != null && q > f.talkFrom && q < f.talkTo));
    P(ctx, 100, -300, 74, 60, 6, "#13223D", 0); T(ctx, "🎓", 137, -258, 26, { align: "center" });
    ctx.restore(); ctx.restore();
    glow(ctx, 0, -170, 360, "#BFE2EA", .25); P(ctx, -160, -350, 160, 36, 18, "rgba(19,34,61,.85)", 0); T(ctx, "Dimas", -80, -324, 22, { align: "center", col: "#FFF" });
    ctx.restore(); } };

  // --- Yoga's headphones around the neck (world; follows the actor anchor via id) ---
  FX.neckphones = { layer: "world", draw(ctx, f, t){ const an = S.anchors[f.who || "yoga"]; if (!an || !an.world) return; const r = an.world, k = r.k, st = r.st;
    const cx = st.x + 1 * k * r.face, cy = r.headY + 17 * k;
    ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 4.4 * k; ctx.beginPath(); ctx.ellipse(cx, cy, 15 * k, 7 * k, 0, .1, Math.PI - .1); ctx.stroke(); ctx.strokeStyle = "#2B2A30"; ctx.lineWidth = 3 * k; ctx.stroke();
    [-1, 1].forEach(d => { P(ctx, cx + d * 15 * k - 4 * k, cy - 2 * k, 8 * k, 11 * k, 3 * k, "#2B2A30", 1.2 * k); ctx.fillStyle = ORANGE; ctx.fillRect(cx + d * 15 * k - 2.5 * k, cy + 1 * k, 5 * k, 5 * k); }); ctx.restore(); } };

  // --- tap / knock rings at a world point ---
  FX.taps = { layer: "world", draw(ctx, f, t){ (f.times || []).forEach((tt, i) => { tt = typeof tt === "object" ? tt.at : tt; const q = t - tt; if (q < 0 || q > .6) return; ctx.save(); ctx.globalAlpha = 1 - q / .6; ctx.strokeStyle = f.col || "#FFF6EA"; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(f.x, f.y, 20 + q * 120, 0, TAU); ctx.stroke(); if (f.word){ T(ctx, f.word, f.x + (i ? 80 : -80), f.y - 60 - q * 40, 46, { align: "center", col: "#FFF", stroke: OUT, sw: 10 }); } ctx.restore(); }); },
    sfx(f, g, add){ (f.times || []).forEach(tt => add(g(typeof tt === "object" ? tt.at : tt), f.sound || "tap", .9)); } };

  // --- fly circling the untouched lunch (world) ---
  FX.fly = { layer: "world", draw(ctx, f, t){ const a = t * 5, x = f.x + Math.cos(a) * 60 + Math.sin(a * 2.3) * 20, y = f.y + Math.sin(a * 1.4) * 30 - 40;
    ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.7)"; const w = Math.abs(Math.sin(t * 60)) * 8 + 2; ctx.beginPath(); ctx.ellipse(x - 4, y - 6, w, 4, -.5, 0, TAU); ctx.ellipse(x + 4, y - 6, w, 4, .5, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(30,26,24,.25)"; ctx.setLineDash([4, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y - 40, 60, a - 1.2, a); ctx.stroke(); ctx.setLineDash([]); }, sfx(f, g, add){ add(g(f.at || 0), "fly", .35, 2.5); } };

  // --- flashback overlay (sepia frame + tag) ---
  FX.flashback = { layer: "screen", draw(ctx, f, t){ ctx.save(); ctx.globalCompositeOperation = "color"; ctx.fillStyle = "rgba(160,120,80,.55)"; ctx.fillRect(0, 0, SW, SH); ctx.restore();
    ctx.save(); ctx.fillStyle = rg(ctx, 960, 540, 300, 1100, [[0, "rgba(0,0,0,0)"], [1, "rgba(30,16,8,.7)"]]); ctx.fillRect(0, 0, SW, SH);
    for (let i = 0; i < 60; i++){ ctx.fillStyle = `rgba(255,240,210,${rnd(i + Math.floor(t * 24)) * .25})`; ctx.fillRect(rnd(i * 3 + Math.floor(t * 24)) * SW, rnd(i * 7 + Math.floor(t * 24)) * SH, 3, 3); }
    P(ctx, 70, 60, 300, 64, 14, "rgba(255,246,234,.9)", 4); T(ctx, "KILAS BALIK", 220, 104, 32, { align: "center", col: BROWN, track: 3 }); ctx.restore(); } };

  // --- counter chip: "Antrean: 48 -> 12" ---
  FX.counter = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .4), out = f.out ?? 1e9; if (s <= 0 || t > out + .3) return; const v = Math.round(lerp(f.from, f.to, easeIO(clamp((t - f.at - .4) / (f.dur || 2.4), 0, 1))));
    ctx.save(); ctx.globalAlpha = 1 - fin(t, out, .3); ctx.translate(f.x ?? 1560, f.y ?? 200); ctx.scale(s, s); P(ctx, -230, -80, 460, 160, 24, NAVY, 6, OUT); T(ctx, f.label || "ANTREAN", 0, -26, 30, { align: "center", col: "#A9BCDD", track: 3 });
    T(ctx, String(v), 0, 56, 84, { align: "center", col: v <= (f.good ?? 15) ? "#7FD39B" : "#FFB4A8" }); ctx.restore(); } };

  // --- deadline (calendar + clock) ---
  FX.deadline = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#3A1E1A"], [1, "#160C0A"]])); const pul = 1 + .03 * Math.sin(t * 10);
    ctx.save(); ctx.translate(700, 520); ctx.scale(pul, pul); ctx.rotate(-.04); P(ctx, -300, -330, 600, 660, 30, "#FFF6EA", 7, OUT); P(ctx, -300, -330, 600, 150, [30, 30, 0, 0], RED, 0); T(ctx, "TENGGAT", 0, -230, 60, { align: "center", col: "#FFF", track: 4 });
    T(ctx, "1", 0, 140, 300, { align: "center", col: RED }); T(ctx, "HARI LAGI", 0, 260, 56, { align: "center", col: BROWN }); ctx.restore();
    const cl = U.parseClock("16:59", q * 3); U.clock(ctx, 1380, 470, 230, cl.h, cl.m, cl.s);
    ctx.fillStyle = `rgba(217,72,59,${.15 + .15 * Math.sin(t * 10)})`; ctx.fillRect(0, 0, SW, SH); }, sfx(f, g, add){ add(g(f.at), "tick", 1, 3); add(g(f.at), "dun", .8); } };

  // --- end screen (16:9; YouTube elements go on the two boxes) ---
  FX.endscreen = { layer: "screen", draw(ctx, f, t){ const q = t - f.at;
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]]));
    for (let i = 0; i < 14; i++){ const x = rnd(i + 3) * 2200 - 140 + Math.sin(t * .3 + i) * 50, y = rnd(i + 8) * 1200 - 60, r = 90 + rnd(i) * 200; ctx.fillStyle = `rgba(194,105,31,${.05 + rnd(i + 2) * .07})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    ctx.save(); ctx.translate(960, 520); ctx.rotate(t * .15); for (let i = 0; i < 14; i++){ ctx.rotate(TAU / 14); ctx.fillStyle = "rgba(246,217,174,.045)"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -120); ctx.lineTo(1400, 120); ctx.fill(); } ctx.restore();
    U.motes(ctx, t * 2, 50, 21, 0, 0, SW, SH, "#F6D9AE", .6);
    const a0 = fin(t, f.at, .4); ctx.save(); ctx.globalAlpha = a0; T(ctx, "TONTON BERIKUTNYA", 960, 140, 44, { align: "center", col: "#F6D9AE", track: 6 }); ctx.restore();
    // box 1: next episode (video element area) with art
    const b1 = pop(t, f.at + .2, .5); ctx.save(); ctx.translate(560, 500 + Math.sin(t * 1.4) * 10); ctx.rotate(Math.sin(t * .9) * .012); ctx.scale(b1, b1); P(ctx, -400, -230, 800, 450, 24, "#0E1A30", 6, ORANGE);
    ctx.save(); rr(ctx, -388, -218, 776, 426, 18); ctx.clip(); ctx.fillStyle = lg(ctx, 0, -218, 0, 208, [[0, "#3A1E1A"], [1, "#160C0A"]]); ctx.fillRect(-388, -218, 776, 426);
    const nw = f.nextWho || "rina", a = Object.assign({ size: 420, x: -170, y: 260, face: 1, seed: 4 }, S.cast[nw].look || S.cast[nw], { keys: [Object.assign({ at: 0, pose: "pointUp", expr: "happy" }, f.nextKey || {})], item: f.nextThumb === false ? null : "thumb" }); const st = TT.toonState(a, null, q); st.talk = false; TT.drawToon(ctx, a, st, q);
    if (f.nextThumb !== false){ ctx.save(); ctx.translate(-170 + 25 * 420 / 92, 260 - 71 * 420 / 92); PROP.hand_thumb(ctx, 0, 0, 420 / 92, 1, t); ctx.restore(); }
    P(ctx, 30, -150, 330, 120, 20, "#FFF1C9", 5); T(ctx, f.nextQuote || "\"Aman, Bu!\"", 195, -75, 44, { align: "center", col: BROWN, maxW: 300 });
    T(ctx, f.nextSub || "Padahal...", 195, 40, 52, { align: "center", col: "#FFB4A8", stroke: OUT, sw: 10 }); ctx.restore();
    P(ctx, -400, 160, 800, 70, [0, 0, 24, 24], ORANGE, 0); T(ctx, f.nextTitle || "Tak Terlihat · Eps 2", 0, 208, 40, { align: "center", col: "#FFF" }); ctx.restore();
    // box 2: playlist
    const b2 = pop(t, f.at + .45, .5); ctx.save(); ctx.translate(1380, 500 + Math.sin(t * 1.4 + 1.6) * 10); ctx.rotate(Math.sin(t * .9 + 1) * .012); ctx.scale(b2, b2); P(ctx, -340, -230, 680, 450, 24, "#0E1A30", 6, "#5D7BB0");
    for (let k = 0; k < 3; k++){ P(ctx, -300 + k * 18, -190 + k * 18, 600, 300, 18, ["#2F3C59", "#3B4A6B", "#4A5E86"][k], 0); }
    T(ctx, "PLAYLIST", 36, -40, 34, { align: "center", col: "#A9BCDD", track: 5 }); T(ctx, f.playlistHead || "Kantor Tangani:", 36, 20, 46, { align: "center", col: "#FFF" }); T(ctx, f.playlist || "Tak Terlihat", 36, 78, 52, { align: "center", col: YEL });
    T(ctx, f.playlistEps || "Eps 1 · 2 · 3 · 4", 36, 170, 32, { align: "center", col: "#DCE6F5", w: 600 }); ctx.restore();
    // subscribe button (pulses, gets "clicked")
    const sb = pop(t, f.at + .8, .5), clk = q > (f.clickAt ?? 3) && q < (f.clickAt ?? 3) + .3; ctx.save(); ctx.translate(960, 900); ctx.scale(sb * (clk ? .94 : 1 + .03 * Math.sin(t * 4)), sb * (clk ? .94 : 1 + .03 * Math.sin(t * 4)));
    const subbed = q > (f.clickAt ?? 3); P(ctx, -230, -52, 460, 104, 52, subbed ? "#5E5A62" : "#E0302A", 6, OUT); T(ctx, subbed ? "✓ SUBSCRIBED" : "SUBSCRIBE", 30, 16, 44, { align: "center", col: "#FFF" });
    ctx.beginPath(); ctx.arc(-160, 0, 40, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, -160, 0, 56); ctx.restore();
    if (q > (f.clickAt ?? 3) - 1 && q < (f.clickAt ?? 3) + 1.2) cursor(ctx, lerp(1300, 1010, easeIO(clamp((q - (f.clickAt ?? 3) + 1) / 1, 0, 1))), lerp(1080, 910, easeIO(clamp((q - (f.clickAt ?? 3) + 1) / 1, 0, 1))), clk);
    const cq = fin(t, f.at + (f.askAt ?? 6), .5); if (cq > 0){ ctx.save(); ctx.globalAlpha = cq; T(ctx, f.ask || "Pernah merasa sudah kerja keras, tapi tidak dilirik? Tulis di komentar!", 960, 790, 34, { align: "center", col: "#FFF6EA", w: 700 }); ctx.restore(); }
  }, sfx(f, g, add){ add(g(f.at + (f.clickAt ?? 3)), "click", .9); add(g(f.at + .2), "whoosh", .5); } };

  // --- projector slide painter for the meeting room (used by LOC.rapat) ---
  FX.slide = { layer: "none", draw(){}, paint(ctx, x, y, w, h, t, o){
    const k = o.slide || "cover"; ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, 4); ctx.clip();
    if (k === "cover"){ ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, h); S.drawLogo(ctx, x + w / 2, y + 110, 90); T(ctx, "PENGUMUMAN", x + w / 2, y + 228, 64, { align: "center", col: "#FFF" });
      ctx.fillStyle = ORANGE; ctx.fillRect(x + w / 2 - 80, y + 256, 160, 8); }
    else if (k === "logo"){ ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, h); S.drawLogo(ctx, x + w / 2, y + h / 2, 140); }
    else if (k === "sinta"){ ctx.fillStyle = ORANGE; ctx.fillRect(x, y, w, h); for (let i = 0; i < 12; i++){ const an = i / 12 * TAU + t * .5; ctx.fillStyle = "rgba(255,246,234,.12)"; ctx.beginPath(); ctx.moveTo(x + w / 2, y + h / 2); ctx.arc(x + w / 2, y + h / 2, 700, an, an + .2); ctx.fill(); }
      T(ctx, "SELAMAT!", x + w / 2, y + 120, 54, { align: "center", col: "#FFF6EA" }); T(ctx, "SINTA", x + w / 2, y + 250, 120, { align: "center", col: "#FFF", stroke: OUT, sw: 14 }); T(ctx, "Koordinator Tim", x + w / 2, y + 330, 40, { align: "center", col: NAVY }); }
    else if (k === "proyek"){ ctx.fillStyle = "#FFFDF7"; ctx.fillRect(x, y, w, h); T(ctx, "PROYEK BESAR", x + w / 2, y + 120, 50, { align: "center", col: ORANGE }); T(ctx, "Pindah data klien", x + w / 2, y + 220, 50, { align: "center", col: NAVY }); T(ctx, "→ sistem baru", x + w / 2, y + 290, 50, { align: "center", col: NAVY }); }
    ctx.restore(); } };
  // --- Yoga's monitors painter (used by LOC.yoga) ---
  FX.monitorUI = { layer: "none", draw(){}, paint(ctx, x, y, w, h, t, o, i){
    if (i === 0){ ctx.strokeStyle = "#7FD39B"; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= 30; k++){ const xx = x + 10 + k * (w - 20) / 30, yy = y + h * .55 + Math.sin(k * .7 + t * 2) * 30 + Math.sin(k * 1.9 + t) * 12; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
      ctx.fillStyle = "#93A4C3"; for (let k = 0; k < 6; k++) ctx.fillRect(x + 14, y + 14 + k * 10, 60 + rnd(k) * 80, 4); }
    else { for (let k = 0; k < 6; k++){ const v = .3 + .6 * Math.abs(Math.sin(k * 1.3 + t * .8)); ctx.fillStyle = k === 5 ? "#D9483B" : "#5B7DB1"; ctx.fillRect(x + 20 + k * 44, y + h - 20 - v * (h - 50), 30, v * (h - 50)); } } } };
})();
