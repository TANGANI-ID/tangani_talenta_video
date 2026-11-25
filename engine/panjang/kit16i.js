/* STORY16 kit I — tambahan untuk Kantor Tangani: Utang Bayu Eps 1 ("Gaji sama besar, kenapa Rina bisa menabung dan Bayu tidak?"). Dimuat sesudah kit16h.js.
   Lokasi  : parkiran (parkiran motor belakang kantor; opsi time sore|malam).
   Properti: motor (motor lama; opsi seat = tinggi jok, helmet:"seat", flip, s), phoneLying (ponsel tergeletak di meja, layar menghadap atas; opsi buzz 0..1),
             hand_helmet (helm baru berstiker).
   Efek    : payslips (dua slip gaji berdampingan: angka hampir sama), envelopes (lima amplop; mode rumus: tabungan dulu → sisa dibagi; opsi ignoreAt/pickAt/dropAt/noteAt),
             catatan (buku catatan 26 MEI–24 JUNI + lima kotak), shopApp (toko daring: helm + jam, cicilan 0%; opsi tapAt, closeAt),
             lockAlert (layar ponsel; mode sent | paid | due).
   S16.thumbs.utang1 = gambar thumbnail (tools/panjang/thumb16.py jenis "utang1").
   Waktu: angka = relatif terhadap f.at; objek {cue}/{at} = waktu lokal adegan (lihat tm()). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343", MAROON = "#6E2430", GREY = "#9CA3AF", WBROWN = "#8E4A24";
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const ring = (ctx, cx, cy, rx, ry, k, col, lw) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = lw || 8; ctx.lineCap = "round"; ctx.beginPath(); const n = 44;
    for (let j = 0; j <= n * k; j++){ const a = -2.3 + j / n * TAU * 1.07; ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); } ctx.stroke(); ctx.restore(); };
  const reveal = (ctx, txt, x, y, size, k, o) => { if (k <= 0) return; o = o || {}; font(ctx, o.w || 700, size, o.fam || F2); const w = ctx.measureText(txt).width; const ax = o.align === "center" ? x - w / 2 : x;
    ctx.save(); ctx.beginPath(); ctx.rect(ax - 6, y - size * 1.1, (w + 12) * k, size * 1.6); ctx.clip(); T(ctx, txt, ax, y, size, Object.assign({ fam: F2, w: 700 }, o, { align: "left" })); ctx.restore(); };
  const bgWood = (ctx, t) => { fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C9925F"], [1, "#9E6A40"]])); ctx.fillStyle = "rgba(59,36,24,.12)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, 120 * k + 40, SW, 4); U.motes(ctx, t, 20, 9, 0, 0, SW, SH, "#FFF3D6", .3); };
  const push = (ctx, f, t, k, cx, cy) => { const z = 1 + (t - f.at) * (f.push ?? k ?? .015); ctx.translate(cx ?? 960, cy ?? 540); ctx.scale(z, z); ctx.rotate(Math.sin(t * .6) * .006); ctx.translate(-(cx ?? 960), -(cy ?? 540)); };
  const hp = fn => (ctx, x, y, k, f, t, sp) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); try { fn(ctx, t, sp); } finally { ctx.restore(); } };

  /* ============================== HELM BARU (origin = tengah bawah, lebar ±50) ============================== */
  function helmetArt(ctx, o){ o = o || {}; ctx.save(); const col = o.col || "#1E2A44";
    ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(-58, -62, -6, -78); ctx.quadraticCurveTo(52, -84, 56, -22); ctx.lineTo(56, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-34, -66); ctx.quadraticCurveTo(0, -84, 40, -70); ctx.lineTo(36, -58); ctx.quadraticCurveTo(0, -72, -30, -54); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(2, -44); ctx.quadraticCurveTo(52, -50, 56, -22); ctx.lineTo(56, -8); ctx.lineTo(-2, -8); ctx.closePath(); ctx.fillStyle = "#9FC6D0"; ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.ellipse(18, -33, 18, 5, -.15, 0, TAU); ctx.fill();
    if (o.sticker !== false){ P(ctx, -42, -34, 36, 20, 3, "#FFFDF8", 2.5); ctx.fillStyle = RED; ctx.fillRect(-38, -30, 28, 5); ctx.fillStyle = "#3B2418"; ctx.fillRect(-38, -22, 20, 3); }
    ctx.restore(); }
  S.helmetArt = helmetArt;
  PROP.hand_helmet = hp(ctx => { ctx.rotate(-.1); ctx.translate(3, 1); ctx.scale(.17, .17); helmetArt(ctx); });

  /* ============================== MOTOR LAMA (menghadap kanan; origin = tengah roda, di tanah) ============================== */
  PROP.motor = (ctx, o, t) => { ctx.save(); if (o.flip) ctx.scale(-1, 1); ctx.scale(o.s || 1, o.s || 1); const H = o.seat || 118, col = o.col || "#8E4A24";
    ctx.fillStyle = "rgba(20,12,6,.3)"; ctx.beginPath(); ctx.ellipse(0, 4, 300, 20, 0, 0, TAU); ctx.fill();
    [[-170], [170]].forEach(([wx]) => { ctx.beginPath(); ctx.arc(wx, -66, 66, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
      ctx.beginPath(); ctx.arc(wx, -66, 32, 0, TAU); ctx.fillStyle = "#9AA3AE"; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(wx, -66, 8, 0, TAU); ctx.fillStyle = "#3B3A40"; ctx.fill(); });
    // knalpot + mesin
    P(ctx, -190, -86, 170, 22, 10, "#6E7782", 4); P(ctx, -70, -150, 150, 84, 18, "#3B3A40", 5);
    // bodi belakang + jok
    ctx.beginPath(); ctx.moveTo(-220, -H - 18); ctx.quadraticCurveTo(-170, -H - 52, -100, -H - 30); ctx.lineTo(-100, -H + 8); ctx.lineTo(-196, -H + 8); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
    P(ctx, -186, -H - 20, 240, 30, 15, "#2B2A30", 5);
    // tangki + bodi depan
    P(ctx, 10, -H - 50, 130, 60, 22, col, 5); ctx.beginPath(); ctx.moveTo(100, -H - 20); ctx.lineTo(170, -H - 20); ctx.quadraticCurveTo(206, -80, 180, -64); ctx.lineTo(120, -64); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(-190, -H + 8, 60, 5);
    // garpu + setang + lampu
    ctx.strokeStyle = "#9AA3AE"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(150, -H - 60); ctx.lineTo(176, -70); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, -H - 60); ctx.lineTo(176, -70); ctx.stroke();
    ctx.strokeStyle = "#2B2A30"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(120, -H - 62); ctx.lineTo(162, -H - 82); ctx.stroke(); ctx.lineCap = "butt";
    ctx.beginPath(); ctx.arc(188, -H - 50, 24, 0, TAU); ctx.fillStyle = "#FFF3C4"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = "#3B3A40"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(150, -H - 78); ctx.lineTo(160, -H - 118); ctx.stroke(); P(ctx, 148, -H - 138, 32, 20, 8, "#9FC6D0", 3);
    if (o.helmet === "seat"){ ctx.save(); ctx.translate(-60, -H - 16); ctx.scale(.9, .9); helmetArt(ctx); ctx.restore(); }
    ctx.restore(); };

  /* ============================== PONSEL TERGELETAK (layar menghadap atas; origin = tengah bawah di permukaan meja) ============================== */
  PROP.phoneLying = (ctx, o, t) => { const b = o.buzz || 0, sh = b > 0 ? Math.sin(t * 90) * 5 * b : 0; ctx.save(); ctx.translate(sh, b > 0 ? Math.sin(t * 70) * 2 * b : 0);
    ctx.fillStyle = "rgba(20,12,6,.3)"; ctx.beginPath(); ctx.ellipse(0, 6, 120, 12, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.transform(1, 0, -.35, 1, 0, 0); P(ctx, -90, -34, 180, 40, 10, "#1E1A18", 4); P(ctx, -80, -29, 160, 30, 5, b > 0 ? "#FFF6E0" : "#2A2346", 0);
    if (b > 0){ [0, 1, 2].forEach(i => { ctx.fillStyle = ["#D9483B", "#5B7DB1", "#C2691F"][i]; ctx.fillRect(-72 + i * 4, -26 + i * 9, 144 - i * 8, 6); }); } ctx.restore();
    if (b > 0) glow(ctx, 0, -30, 220, "#FFF3C4", .35 * b); ctx.restore(); };

  /* ============================== LOKASI: parkiran motor belakang kantor ============================== */
  LOC.parkiran = { bounds: [-300, 2220, -300, 1300], grade: { warm: .1, vig: .5 }, def: { time: "sore" },
    bg(ctx, c, t, o){ const time = o.time || "sore", night = time === "malam";
      layer(ctx, c, .3, () => { U.sky(ctx, -1400, -500, 4800, 1300, time, t, 41); U.skyline(ctx, -1400, -500, 4800, 560, time, t, 41, 1.2); });
      layer(ctx, c, .6, () => { P(ctx, -700, 20, 3400, 700, 0, night ? "#4A4458" : "#D9CFC0", 0); ctx.fillStyle = "rgba(43,26,18,.07)"; for (let x = -700; x < 2700; x += 90) ctx.fillRect(x, 20, 4, 700);
        P(ctx, -720, 0, 3440, 56, 0, "#8D97A3", 6);
        [0, 1, 2, 3].forEach(i => { const x = 120 + i * 480, lit = night ? (i !== 2) : true; P(ctx, x, 150, 300, 200, 6, lit ? (night ? "#FFE3A0" : "#9FC6D0") : "#2B2A30", 5); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(x + 148, 150, 4, 200); ctx.fillRect(x, 248, 300, 4);
          if (night && lit) glow(ctx, x + 150, 250, 260, "#FFE3A0", .16); });
        P(ctx, 1560, 330, 190, 370, 4, "#6E7782", 6); P(ctx, 1580, 350, 150, 330, 2, "#8D97A3", 0); ctx.fillStyle = "#C9D1D9"; ctx.fillRect(1700, 520, 12, 40);
        P(ctx, 1500, 255, 310, 52, 10, NAVY, 4); T(ctx, "PARKIR KARYAWAN", 1655, 292, 28, { align: "center", col: "#FFF", track: 2 });
        P(ctx, 320, 380, 140, 90, 8, "#C9D1D9", 5); ctx.strokeStyle = "#6E7782"; ctx.lineWidth = 3; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(334, 400 + k * 18); ctx.lineTo(446, 400 + k * 18); ctx.stroke(); } });
      layer(ctx, c, .75, () => { U.floor(ctx, 700, night ? [[0, "#3A3A46"], [1, "#25252E"]] : [[0, "#8D8A86"], [1, "#6E6A66"]], false, t);
        ctx.fillStyle = "rgba(255,255,255,.5)"; for (let x = -800; x < 3000; x += 300){ ctx.save(); ctx.translate(x, 800); ctx.transform(1, 0, -.7, 1, 0, 0); ctx.fillRect(0, 0, 12, 150); ctx.restore(); }
        ctx.fillStyle = YEL; ctx.fillRect(-1000, 760, 5000, 8);
        [[-80, "#3B4A6B"], [330, "#6E2430"], [2020, "#2F6F73"]].forEach(([x, col]) => { ctx.save(); ctx.translate(x, 810); ctx.globalAlpha = night ? .6 : .95; PROP.motor(ctx, { s: .5, col, seat: 110 }, t); ctx.restore(); }); });
      layer(ctx, c, .7, () => { const lx = 1180; ctx.fillStyle = "#3B3A40"; ctx.fillRect(lx - 8, 230, 16, 520); P(ctx, lx - 70, 200, 140, 40, 14, "#4B5563", 4); ctx.fillStyle = night ? "#FFF3C4" : "#FFE9B0"; rr(ctx, lx - 56, 238, 112, 12, 6); ctx.fill();
        glow(ctx, lx, 260, night ? 560 : 360, "#FFD98A", night ? .38 : .2); if (night){ ctx.fillStyle = "rgba(255,217,138,.1)"; ctx.beginPath(); ctx.moveTo(lx - 50, 250); ctx.lineTo(lx + 50, 250); ctx.lineTo(lx + 330, 800); ctx.lineTo(lx - 330, 800); ctx.closePath(); ctx.fill(); }
        U.motes(ctx, t, 16, 61, 300, 150, 1700, 700, night ? "#FFE3B0" : "#FFF3D6", night ? .5 : .4); });
    } };

  /* ============================== EFEK: dua slip gaji ============================== */
  const slipArt = (ctx, x, y, w, h, nm, tint, t, a0, per) => { ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, x, y, w, h, 10, "#FFFFFF", 0); ctx.restore(); P(ctx, x, y, w, h, 10, "#FFFFFF", 5, OUT);
    P(ctx, x, y, w, 110, [10, 10, 0, 0], NAVY, 0); T(ctx, "SLIP GAJI · JUNI", x + 34, y + 68, 40, { col: "#FFF", track: 2 }); T(ctx, "PT Tangani Digital Automasi", x + 34, y + 170, 26, { col: "#6B7280", w: 600 });
    T(ctx, nm, x + 34, y + 250, 72, { col: tint }); ctx.fillStyle = "#E5E7EB"; ctx.fillRect(x + 34, y + 280, w - 68, 4);
    const rows = [["Gaji pokok", .9], ["Tunjangan", .5], ["Potongan", .34], ["DITERIMA", .8]];
    rows.forEach(([lb, ln], i) => { const k = fin(t, a0 + i * per, .4), yy = y + 350 + i * 120, last = i === 3; if (k <= 0) return; ctx.save(); ctx.globalAlpha = k;
      if (last) P(ctx, x + 20, yy - 54, w - 40, 100, 14, "#E6F4EC", 3, GREEN);
      T(ctx, lb, x + 40, yy, last ? 40 : 34, { col: last ? "#14532D" : "#374151", w: last ? 800 : 600 });
      const bw = (w - 80) * .46 * (ln + (nm === "BAYU" ? .015 * (i % 2 ? 1 : -1) : 0)); ctx.fillStyle = last ? GREEN : "#9CA3AF"; rr(ctx, x + w - 40 - bw, yy - 26, bw, 30, 8); ctx.fill(); ctx.restore(); });
    ctx.restore(); };
  FX.payslips = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; bgWood(ctx, t); ctx.save(); push(ctx, f, t, .012);
    const a0 = tm(f, f.rowsAt, 1.0), per = f.per ?? .5;
    [["RINA", 130, "#C2691F", 0], ["BAYU", 1030, "#3F6FB5", 1]].forEach(([nm, x, tint, i]) => { const s = pop(t, f.at + .15 + i * .35, .45); if (s <= 0) return; ctx.save(); ctx.translate(x + 380, 560); ctx.scale(s, s); ctx.rotate(i ? .02 : -.02); ctx.translate(-380, -450);
      slipArt(ctx, 0, 0, 760, 900, nm, tint, t, a0, per); ctx.restore(); });
    const ap = pop(t, tm(f, f.eqAt, 3.6), .4); if (ap > 0){ ctx.save(); ctx.translate(960, 540); ctx.scale(ap, ap); ctx.beginPath(); ctx.arc(0, 0, 68, 0, TAU); ctx.fillStyle = YEL; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); T(ctx, "≈", 0, 32, 92, { align: "center", col: NAVY }); ctx.restore(); }
    ctx.restore(); if (f.chip) chip(ctx, 960, f.chipY ?? 1010, pop(t, tm(f, f.chipAt, 4.2), .4), f.chip, f.chipBg || NAVY, "#FFF", 40, -.02); },
    sfx(f, g, add){ add(g(f.at + .15), "whoosh", .5); add(g(f.at + .5), "whoosh", .5); const a0 = tm(f, f.rowsAt, 1.0); for (let i = 0; i < 4; i++) add(g(a0 + i * (f.per ?? .5)), "scribble", .4, .3); if (f.chip) add(g(tm(f, f.chipAt, 4.2)), "pop", .6); } };

  /* ============================== EFEK: lima amplop ============================== */
  const ENV = [["KULIAH DIMAS", "#C2691F"], ["MAKAN", "#3F6FB5"], ["KOS", "#2F6F73"], ["TRANSPORT", "#8E4A24"], ["LAIN-LAIN", "#9B7BC4"]];
  const ENV_FILL = [1, .55, .8, .42, .4];
  function envelope(ctx, cx, cy, w, h, label, col, fill, lift){ ctx.save(); ctx.translate(cx, cy - (lift || 0));
    const sh = Math.max(0, fill) * 120; if (sh > 4){ for (let i = 0; i < 6; i++){ const yy = -h / 2 - sh * (1 - i / 7) + 8; P(ctx, -w / 2 + 28 + (i % 2) * 8, yy, w - 56, 40, 4, i % 2 ? "#7FA563" : "#5E8A44", 3); } }
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; P(ctx, -w / 2, -h / 2, w, h, 10, "#F3E3C3", 0); ctx.restore(); P(ctx, -w / 2, -h / 2, w, h, 10, "#F3E3C3", 5, OUT);
    ctx.strokeStyle = "rgba(59,36,24,.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, -h / 2 + h * .46); ctx.lineTo(w / 2, -h / 2); ctx.stroke();
    P(ctx, -w / 2 + 22, 6, w - 44, 70, 12, col, 4); T(ctx, label, 0, 54, label.length > 9 ? 33 : 40, { align: "center", col: "#FFF", maxW: w - 60 }); ctx.restore(); }
  FX.envelopes = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; bgWood(ctx, t); ctx.save(); push(ctx, f, t, .012);
    const fA = tm(f, f.firstAt), rA = tm(f, f.restAt), dA = tm(f, f.dropAt), pA = tm(f, f.pickAt), nA = tm(f, f.noteAt);
    const fills = ENV.map((_, i) => { let v = ENV_FILL[i]; if (fA != null){ const a = i === 0 ? fA : (rA ?? 1e9) + (i - 1) * .3; v = ENV_FILL[i] * easeIO(clamp((t - a) / .9, 0, 1)); }
      if (i === 4 && dA != null) v = lerp(f.lainFrom ?? .4, f.lainTo ?? .12, easeIO(clamp((t - dA) / 1.0, 0, 1))); return v; });
    ENV.forEach(([lb, col], i) => { const s = pop(t, f.at + .15 + i * .12, .4); if (s <= 0) return; const cx = 260 + i * 350, cy = 560; let lift = 0; if (i === 4 && pA != null) lift = 40 * easeIO(clamp((t - pA) / .5, 0, 1));
      ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); envelope(ctx, cx, cy, 310, 210, lb, col, fills[i], lift); ctx.restore(); });
    if (fA != null){ const a = fin(t, f.at + .2, .3); ctx.save(); ctx.globalAlpha = a; chip(ctx, 360, 190, 1, "GAJI MASUK", NAVY, YEL, 44, -.03); ctx.restore();
      chip(ctx, 260, 880, pop(t, fA + .6, .4), "1 · TABUNGAN DULU", GREEN, "#FFF", 38, -.02);
      if (rA != null){ const s = pop(t, rA + .5, .4); if (s > 0){ ctx.save(); ctx.strokeStyle = WBROWN; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.globalAlpha = s; ctx.beginPath(); ctx.moveTo(460, 810); ctx.lineTo(460, 830); ctx.lineTo(1860, 830); ctx.lineTo(1860, 810); ctx.stroke(); ctx.restore(); chip(ctx, 1160, 930, s, "2 · SISA DIBAGI", ORANGE, "#FFF", 38, .02); } } }
    const uA = tm(f, f.utuhAt); if (uA != null) chip(ctx, 260, 880, pop(t, uA, .4), f.utuhText || "MASIH UTUH", GREEN, "#FFF", 38, -.02);
    const iA = tm(f, f.ignoreAt); if (iA != null){ ring(ctx, 260, 560, 205, 150, fin(t, iA, .6), GREEN, 9); chip(ctx, 260, 880, pop(t, iA + .4, .4), "TIDAK DISENTUH", GREEN, "#FFF", 38, -.02); }
    if (pA != null){ const k = clamp((t - pA) / 1.1, 0, 1); if (k > 0 && k < 1){ ctx.save(); ctx.globalAlpha = 1 - k * .8; ctx.translate(lerp(1740, 1900, k), lerp(430, 120, easeIO(k))); ctx.rotate(.4 + k * 1.2); P(ctx, -60, -30, 120, 60, 6, "#7FA563", 4); T(ctx, "Rp", 0, 14, 32, { align: "center", col: "#FFF" }); ctx.restore(); }
      chip(ctx, 1560, 880, pop(t, pA + .3, .4), "LAIN-LAIN: UNTUK TAK TERDUGA", "#7B5BA8", "#FFF", 32, .02); }
    if (nA != null){ ctx.save(); ctx.translate(960, 150); ctx.rotate(-.02); P(ctx, -560, -70, 1120, 140, 14, "#FFFDF0", 6, OUT); reveal(ctx, f.note || "5 Juli · dipinjamkan · untuk cicilan, bukan makan", -520, 22, 44, clamp((t - nA) / 2.2, 0, 1), { col: "#1F4E8C", w: 800 }); ctx.restore(); }
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 1010, pop(t, tm(f, f.chipAt, 5), .4), f.chip, f.chipBg || NAVY, "#FFF", 40, -.02); },
    sfx(f, g, add){ ENV.forEach((_, i) => add(g(f.at + .15 + i * .12), "pop", .4)); const fA = tm(f, f.firstAt), rA = tm(f, f.restAt); if (fA != null){ add(g(fA), "stamp", .5); if (rA != null) for (let i = 0; i < 4; i++) add(g(rA + i * .3), "scribble", .4, .3); }
      if (f.pickAt != null) add(g(tm(f, f.pickAt)), "whoosh", .6); if (f.noteAt != null) add(g(tm(f, f.noteAt)), "scribble", .5, 1.8); if (f.dropAt != null) add(g(tm(f, f.dropAt)), "whoosh", .4); } };

  /* ============================== EFEK: buku catatan 30 hari ============================== */
  const LOG = [["Kopi", "18rb"], ["Ongkir", "12rb"], ["Pulsa", "25rb"], ["Fotokopi", "6rb"], ["Kue lobi", "15rb"], ["Kopi", "18rb"], ["Ongkir", "9rb"], ["Parkir", "4rb"], ["Pulsa", "25rb"], ["Kue lobi", "12rb"]];
  const BOXES = [["MAKAN", .5], ["KOS", .78], ["TRANSPORT", .38], ["LAIN-LAIN", .94], ["KULIAH DIMAS", .6]];
  FX.catatan = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#7E796F"], [1, "#5E5A52"]])); const z = 1 + q * .018; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.025 + Math.sin(t * .7) * .008); ctx.translate(-960 + Math.sin(t * .9) * 12, -540);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 130, 90, 1660, 900, 14, "#3B4A6B", 0); ctx.restore(); P(ctx, 130, 90, 1660, 900, 14, "#3B4A6B", 6, OUT); P(ctx, 160, 120, 790, 840, 6, "#FFFDF0", 0); P(ctx, 970, 120, 790, 840, 6, "#FFFDF0", 0);
    ctx.strokeStyle = "rgba(91,125,177,.28)"; ctx.lineWidth = 2; for (let y = 260; y < 940; y += 64){ ctx.beginPath(); ctx.moveTo(176, y); ctx.lineTo(936, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(986, y); ctx.lineTo(1744, y); ctx.stroke(); }
    ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.fillRect(950, 120, 20, 840);
    const t1 = tm(f, f.titleAt, .3); reveal(ctx, f.title || "26 MEI – 24 JUNI", 200, 220, 62, clamp((t - t1) / .8, 0, 1), { col: "#1F4E8C", w: 800 });
    const a0 = tm(f, f.rowsAt, 1.1), per = f.per ?? .4; LOG.forEach(([nm, v], i) => { const k = clamp((t - (a0 + i * per)) / .35, 0, 1); if (k <= 0) return; const y = 330 + i * 64 - 8; reveal(ctx, nm, 200, y, 38, k, { col: "#1F4E8C", w: 700 }); reveal(ctx, v, 760, y, 38, k, { col: "#1F4E8C", w: 700, align: "left" }); });
    const b0 = tm(f, f.boxesAt, 5); if (t > b0 - .2){ const kt = clamp((t - b0) / .6, 0, 1); reveal(ctx, "LIMA KOTAK", 1010, 220, 54, kt, { col: "#1F4E8C", w: 800 });
      BOXES.forEach(([nm, v], i) => { const k = easeIO(clamp((t - b0 - .4 - i * .35) / .6, 0, 1)); if (k <= 0) return; const bw = 210, bx = 1010 + (i % 3) * 235, by = 290 + Math.floor(i / 3) * 330; const hh = 230;
        ctx.strokeStyle = "#1F4E8C"; ctx.lineWidth = 6; ctx.strokeRect(bx, by, bw, hh); ctx.fillStyle = i === 3 ? "rgba(217,72,59,.4)" : (i === 4 ? "rgba(59,163,107,.35)" : "rgba(194,105,31,.3)"); ctx.fillRect(bx + 3, by + hh - 3 - (hh - 6) * v * k, bw - 6, (hh - 6) * v * k);
        T(ctx, nm, bx + bw / 2, by + hh + 38, nm.length > 9 ? 24 : 30, { align: "center", col: "#1F4E8C", w: 800 }); }); }
    const r0 = tm(f, f.ringAt); if (r0 != null){ ring(ctx, 1010 + 235 * 0 + 105 + 0, 290 + 330 + 115, 150, 170, 0, RED, 9); ring(ctx, 1010 + 105, 290 + 330 + 115, 150, 170, fin(t, r0, .7), RED, 10); }
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 1010, pop(t, tm(f, f.chipAt, 8), .4), f.chip, f.chipBg || NAVY, "#FFF", 40, -.02); },
    sfx(f, g, add){ add(g(tm(f, f.titleAt, .3)), "scribble", .5, .8); const a0 = tm(f, f.rowsAt, 1.1); LOG.forEach((_, i) => add(g(a0 + i * (f.per ?? .4)), "scribble", .35, .3)); const b0 = tm(f, f.boxesAt, 5); BOXES.forEach((_, i) => add(g(b0 + .4 + i * .35), "scribble", .4, .4)); if (f.ringAt != null) add(g(tm(f, f.ringAt)), "scribble", .6, .6); } };

  /* ============================== EFEK: ponsel ============================== */
  const BILLS_N = [["Pinjaman A", "#5B7DB1"], ["Paylater B", "#D9483B"], ["Kredit C", "#2F6F73"], ["Pinjaman D", "#8E4A24"], ["Paylater E", "#9B7BC4"], ["Cicilan F", "#C2691F"], ["Pinjaman G", "#3BA36B"]];
  FX.lockAlert = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, mode = f.mode || "paid", z = (f.scale || 1.04) * (1 + q * .014); let shake = 0; const bA = tm(f, f.bannerAt, .5);
    if (mode !== "sent" && t > bA && t < bA + .4) shake = Math.sin(t * 80) * 8 * (1 - (t - bA) / .4);
    ctx.save(); ctx.translate(shake, 0); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ night: mode !== "sent", skin: "#E2A77C" }, f), z);
    if (mode === "sent"){ ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, y, w, h); P(ctx, x, y, w, 120, 0, NAVY, 0); T(ctx, "Transfer", 0, y + 76, 38, { align: "center", col: "#FFF" });
      const k = easeIO(clamp((t - bA) / .6, 0, 1)); ctx.save(); ctx.translate(0, y + 330); ctx.scale(k, k); ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ctx.strokeStyle = "#FFF"; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-46, 4); ctx.lineTo(-10, 40); ctx.lineTo(50, -34); ctx.stroke(); ctx.restore();
      const a = fin(t, bA + .5, .4); ctx.globalAlpha = a; T(ctx, "Transfer berhasil", 0, y + 520, 44, { align: "center", col: "#14532D" }); T(ctx, f.amount || "Rp300.000", 0, y + 610, 76, { align: "center", col: NAVY });
      T(ctx, "ke Bayu", 0, y + 670, 34, { align: "center", col: "#6B7280", w: 600 }); P(ctx, x + 50, y + 720, w - 100, 80, 20, "#E5E7EB", 0); T(ctx, f.memo || "Catatan: untuk makan", 0, y + 772, 30, { align: "center", col: "#374151", w: 600 }); ctx.globalAlpha = 1; }
    else { ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, "#2A2346"], [1, "#4E3446"]]); ctx.fillRect(x, y, w, h); T(ctx, f.clock || "12.43", 0, y + 120, 84, { align: "center", col: "#FFF" }); T(ctx, f.date || "Sabtu, 5 Juli", 0, y + 160, 26, { align: "center", col: "#DCE6F5", w: 600 });
      if (mode === "paid"){ const r0 = tm(f, f.rowsAt, .3), per = f.per ?? .3; BILLS_N.forEach(([nm, col], i) => { const by = y + 280 + i * 72, kk = fin(t, r0 + i * per, .3); if (kk <= 0) return; ctx.save(); ctx.globalAlpha = .55 * kk; ctx.translate((1 - kk) * 60, 0); P(ctx, x + 14, by, w - 28, 62, 14, "rgba(255,255,255,.9)", 0); P(ctx, x + 26, by + 9, 44, 44, 10, col, 0); T(ctx, nm[0], x + 48, by + 42, 28, { align: "center", col: "#FFF" }); T(ctx, nm, x + 84, by + 40, 22, { col: NAVY }); ctx.restore(); });
        const s = pop(t, bA, .45); if (s > 0){ ctx.save(); ctx.translate(0, y + 250 + (1 - Math.min(1, s)) * -120); ctx.globalAlpha = Math.min(1, s); P(ctx, x + 8, 0, w - 16, 190, 22, GREEN, 5, "#14532D"); P(ctx, x + 28, 22, 56, 56, 14, "#FFF", 0); T(ctx, "B", x + 56, 64, 36, { align: "center", col: GREEN });
          T(ctx, "Paylater B", x + 104, 52, 24, { col: "#FFF", w: 800 }); T(ctx, "sekarang", x + w - 28, 52, 18, { align: "right", col: "#DCFCE7", w: 600 }); T(ctx, "Pembayaran berhasil", x + 28, 112, 34, { col: "#FFF", w: 800 }); T(ctx, (f.amount || "Rp300.000") + " · lunas", x + 28, 158, 30, { col: "#DCFCE7", w: 700 }); ctx.restore(); } }
      else if (mode === "missed"){ const s = pop(t, bA, .45); if (s > 0){ ctx.save(); ctx.translate(0, y + 330); ctx.scale(Math.min(1.04, s), Math.min(1.04, s)); P(ctx, x + 6, -120, w - 12, 300, 26, "#FFF6F2", 6, RED); P(ctx, x + 30, -92, 64, 64, 16, GREEN, 0); T(ctx, "G", x + 62, -42, 40, { align: "center", col: "#FFF" }); T(ctx, "Pinjaman G", x + 112, -62, 28, { col: NAVY, w: 800 }); T(ctx, "sekarang", x + w - 28, -62, 20, { align: "right", col: "#6B7280", w: 600 });
          T(ctx, "Panggilan tak terjawab", 0, 40, 31, { align: "center", col: RED, w: 800 }); T(ctx, "3 kali hari ini", 0, 100, 34, { align: "center", col: NAVY, w: 700 }); ctx.restore(); } }
      else { const s = pop(t, bA, .45); if (s > 0){ ctx.save(); ctx.translate(0, y + 330); ctx.scale(Math.min(1.04, s), Math.min(1.04, s)); const pulse = 1 + .02 * Math.sin(t * 9); ctx.scale(pulse, pulse);
          P(ctx, x + 6, -120, w - 12, 400, 26, "#FFF6F2", 6, RED); P(ctx, x + 30, -92, 64, 64, 16, "#C2691F", 0); T(ctx, "F", x + 62, -42, 40, { align: "center", col: "#FFF" }); T(ctx, "Cicilan F", x + 112, -62, 28, { col: NAVY, w: 800 }); T(ctx, "sekarang", x + w - 28, -62, 20, { align: "right", col: "#6B7280", w: 600 });
          T(ctx, "Jatuh tempo", 0, 40, 56, { align: "center", col: RED }); T(ctx, "hari ini.", 0, 108, 56, { align: "center", col: RED }); T(ctx, "Denda berlaku.", 0, 200, 44, { align: "center", col: NAVY, w: 800 }); ctx.restore(); } } }
    ctx.restore(); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 260, pop(t, tm(f, f.chipAt, 2), .4), f.chip, f.chipBg || RED, "#FFF", 40, .04); },
    sfx(f, g, add){ const bA = tm(f, f.bannerAt, .5); if ((f.mode || "paid") === "sent"){ add(g(bA), "send", .8); add(g(bA + .5), "chime", .6); } else { add(g(bA), "buzz", .7, .4); add(g(bA), "notif", .6); } } };

  /* ============================== EFEK: toko daring (helm + jam) ============================== */
  FX.shopApp = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.04) * (1 + q * .014); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#E2A77C" }, f), z);
    const tA = tm(f, f.tapAt), cA = tm(f, f.closeAt), lA = tm(f, f.lookAt, 1); ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, y, w, h); P(ctx, x, y, w, 110, 0, "#E0502A", 0); T(ctx, "TokoKilat", 0, y + 72, 44, { align: "center", col: "#FFF" });
    T(ctx, "Promo gajian · Cicilan 0%", 0, y + 160, 26, { align: "center", col: "#6B7280", w: 700 });
    [0, 1].forEach(i => { const by = y + 190 + i * 300, s = pop(t, f.at + .3 + i * .3, .4); if (s <= 0) return; ctx.save(); ctx.translate(0, by + 130); ctx.scale(s, s); ctx.translate(0, -130); P(ctx, x + 22, 0, w - 44, 270, 18, "#FFFFFF", 4, "#D1D5DB");
      ctx.save(); ctx.translate(x + 130, 190); if (i === 0){ ctx.scale(1.35, 1.35); helmetArt(ctx); } else { ctx.scale(1, 1); S.watchFace(ctx, 0, -70, 80, (t * 9) % 60, 5); P(ctx, -22, -190, 44, 50, 4, "#3B2418", 3); P(ctx, -22, 14, 44, 50, 4, "#3B2418", 3); } ctx.restore();
      T(ctx, i === 0 ? "Helm Full Face" : "Jam Tangan Sport", x + 250, 70, 30, { col: NAVY, w: 800, maxW: w - 270 }); T(ctx, i === 0 ? "Rp1.150.000" : "Rp1.490.000", x + 250, 124, 26, { col: "#9CA3AF", w: 600 });
      P(ctx, x + 250, 150, 170, 56, 14, "#FDE2E0", 0); T(ctx, "Cicilan 0%", x + 335, 190, 26, { align: "center", col: RED, w: 800 }); T(ctx, "Rp95rb/bln", x + 250, 246, 26, { col: GREEN, w: 800 }); ctx.restore(); });
    const bq = pop(t, f.at + .9, .4); ctx.save(); ctx.translate(0, y + h - 80); ctx.scale(bq * (tA != null && t > tA && t < tA + .25 ? .94 : 1), bq); P(ctx, x + 40, -48, w - 80, 96, 48, tA != null && t > tA ? "#14532D" : GREEN, 5, OUT); T(ctx, tA != null && t > tA ? "Pesanan dibuat ✓" : "BAYAR NANTI", 0, 14, 38, { align: "center", col: "#FFF" }); ctx.restore();
    if (f.look){ const r = fin(t, lA, .6); ring(ctx, x + w / 2, y + 190 + 300 + 135, w / 2 - 30, 140, r, RED, 8); }
    if (cA != null && t > cA){ const k = easeIO(clamp((t - cA) / .55, 0, 1)); ctx.fillStyle = `rgba(14,10,20,${.96 * k})`; ctx.fillRect(x, y, w, h); if (k > .6){ ctx.globalAlpha = (k - .6) / .4; T(ctx, "Tab ditutup", 0, y + h / 2 + 10, 40, { align: "center", col: "#6B7280", w: 700 }); ctx.globalAlpha = 1; } }
    ctx.restore(); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 260, pop(t, tm(f, f.chipAt, 2.5), .4), f.chip, f.chipBg || ORANGE, "#FFF", 40, .04); },
    sfx(f, g, add){ if (f.tapAt != null){ add(g(tm(f, f.tapAt)), "click", .8); add(g(tm(f, f.tapAt)) + .2, "chime", .5); } if (f.closeAt != null) add(g(tm(f, f.closeAt)), "click", .6); } };

  /* ============================== THUMBNAIL ============================== */
  S.thumbs = S.thumbs || {};
  S.thumbs.utang1 = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    const cam = S.makeCam(1000, 470, 1.05, 0, 0, 0, 0); S.LOC.pantry.bg(x, cam, 3.1, { time: 'siang', clock: '12:40' });
    S.grade(x, { warm: .1, vig: .3 }); x.fillStyle = 'rgba(19,34,61,.3)'; x.fillRect(0, 0, 1920, 1080);
    [["Pinjaman A", "#5B7DB1", 250, 190, -.05], ["Paylater B", "#D9483B", 360, 360, .04], ["Cicilan F", "#C2691F", 280, 530, -.03]].forEach(([nm, col, px, py, r]) => { x.save(); x.translate(px + 560, py); x.rotate(r); x.fillStyle = 'rgba(255,255,255,.96)'; x.beginPath(); x.roundRect(-250, -62, 500, 124, 24); x.fill();
      x.fillStyle = col; x.beginPath(); x.arc(-190, 0, 36, 0, 7); x.fill(); x.fillStyle = '#FFF'; x.font = '800 40px Poppins'; x.textAlign = 'center'; x.fillText(nm[0], -190, 14);
      x.textAlign = 'left'; x.fillStyle = '#13223D'; x.font = '800 30px Poppins'; x.fillText(nm, -132, -8); x.fillStyle = '#D9483B'; x.font = '700 26px Poppins'; x.fillText('Jatuh tempo hari ini', -132, 34); x.restore(); });
    const put = (who, o, key, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: 1, seed: 3 }, look, o, { keys: [Object.assign({ at: 0 }, key)] }); const st = TT.toonState(a, null, t); st.talk = false; TT.drawToon(x, a, st, t); };
    put('rina', { x: 1010, y: 1240, size: 800, face: -1 }, { pose: 'hold', expr: 'sad', look: [-1, -.2] }, 4.2);
    put('bayu', { x: 460, y: 1700, size: 1240, face: 1 }, { pose: 'hold', expr: 'laugh', look: 'cam' }, 5.25);
    const k = 1240 / 92; PROP.hand_helmet(x, 460 + 21 * k, 1700 - 47 * k, k, 1, 5.25);
    return c.toDataURL('image/png').slice(22); };
})();
