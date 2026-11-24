/* STORY16 kit E — tambahan untuk Kantor Tangani: Klien Terbesar Eps 1 ("Klien terbesar mengamuk di lobi"). Dimuat sesudah kit16d.js.
   Lokasi  : tokobaru (toko ke-12 Pak Wijaya: toko kelontong modern, rak masih kosong, spanduk SEGERA DIBUKA, meja kasir;
             opsi fill 0..1 = isi rak, counterX, banner:false, sign).
   Lokasi lama, opsi tambahan (tanpa opsi = sama seperti Eps 4):
             lobi  : stairs = x anak tangga terbawah (tangga naik ke kanan, 7 anak tangga, run 70, rise 50 → S16.stairStep(x0, i)),
                     deskFront = meja resepsionis digambar di depan tokoh layer:"back" (resepsionis berdiri DI BELAKANG meja).
             gudang: emptyRack = {x, label} rak kosong berlabel (mis. "WIJAYA · TK-12") di depan rak lain.
   Properti: hand_keys (kunci mobil di tangan).
   Efek    : storeMap (peta kota: 11 titik toko menyala satu per satu + titik ke-12 berkedip "BUKA KAMIS"),
             boxPhoto (foto kardus terbuka di ponsel: mesin kasir kecil + stiker TIPE MINI),
             freeze (bekukan gambar: kilat + abu-abu + bingkai), listenTimer (penghitung waktu dengar 00:30 → 03:05),
             callScreen (layar panggilan: memanggil… nada sambung → terhubung + suara "Bicara."),
             orderForm (formulir pesanan di laptop: Tipe MINI + Dipesan oleh Fitri distabilo),
             draftChat (chat laptop: tangkapan layar diseret, pesan diketik → ragu → dihapus → tangkapan layar disimpan ke folder),
             chat16 (chat ponsel umum: pesan + centang biru + gambar formulir + balasan jempol),
             stickyMove (FX.sticky dengan zoom + geser lebih kuat).
   Waktu: angka = relatif terhadap f.at; objek {cue}/{at} (juga di dalam larik) = waktu lokal adegan (lihat tm()). */
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
  const typed = (str, t, t0, cps) => str.slice(0, Math.max(0, Math.floor((t - t0) * (cps || 22))));
  const mmss = s => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
  // a tiny cardboard box with a small cash register inside (used by boxPhoto + tokobaru counter)
  function miniBox(ctx, x, y, s, t, sticker){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    // back flaps
    ctx.fillStyle = "#B98450"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-170, -150); ctx.lineTo(-120, -230); ctx.lineTo(120, -230); ctx.lineTo(170, -150); ctx.closePath(); ctx.fill(); ctx.stroke();
    // the mini register peeking out
    P(ctx, -70, -250, 140, 100, 10, "#2B2A30", 4); ctx.fillStyle = "#BFE2EA"; rr(ctx, -58, -240, 116, 70, 6); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(-48, -230, 40, 8);
    P(ctx, -90, -160, 180, 30, 8, "#3B3A40", 4);
    // box body + front flap
    P(ctx, -180, -150, 360, 220, 6, "#C9965E", 5); ctx.fillStyle = "#A8794A"; ctx.fillRect(-14, -150, 28, 220);
    ctx.fillStyle = "#D7A56C"; ctx.beginPath(); ctx.moveTo(-180, -150); ctx.lineTo(-215, -95); ctx.lineTo(-10, -95); ctx.lineTo(0, -150); ctx.closePath(); ctx.fill(); ctx.stroke();
    P(ctx, 30, -60, 130, 46, 4, "#FFFDF8", 3); T(ctx, "KASIR", 95, -28, 22, { align: "center", col: MAROON, w: 800 });
    if (sticker > 0){ ctx.save(); ctx.translate(-95, 10); ctx.rotate(-.12); ctx.scale(sticker, sticker); P(ctx, -82, -30, 164, 60, 10, RED, 5, OUT); T(ctx, "TIPE MINI", 0, 12, 28, { align: "center", col: "#FFF" }); ctx.restore(); }
    ctx.restore(); }
  S.miniBox = miniBox;

  /* ============================== LOKASI ============================== */
  // toko ke-12 Pak Wijaya: toko kelontong modern yang belum buka
  LOC.tokobaru = { bounds: [-300, 2220, -200, 1300], grade: { warm: .1, vig: .42 }, def: { time: "pagi" },
    bg(ctx, c, t, o){ const fill = o.fill ?? .12, time = o.time || "pagi";
      layer(ctx, c, .35, () => { fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#F5F0E7"], [1, "#E4DACB"]]));
        // glass front (left) with the street outside
        ctx.save(); rr(ctx, -280, 40, 560, 720, 6); ctx.clip(); U.sky(ctx, -280, 40, 560, 720, time, t, 31); U.skyline(ctx, -280, 40, 560, 560, time, t, 31, 1.1); ctx.fillStyle = "#8E8A86"; ctx.fillRect(-280, 600, 560, 160); ctx.restore();
        ctx.strokeStyle = "#8D97A3"; ctx.lineWidth = 14; ctx.strokeRect(-280, 40, 560, 720); ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, 760); ctx.stroke();
        ctx.save(); ctx.globalAlpha = .9; ctx.translate(0, 300); ctx.rotate(-.04); P(ctx, -150, -40, 300, 80, 10, "#FFFDF8", 4); T(ctx, "BUKA KAMIS 08.00", 0, 12, 26, { align: "center", col: RED }); ctx.restore();
        // teal + orange wall stripes
        ctx.fillStyle = TEAL; ctx.fillRect(280, 150, 3000, 22); ctx.fillStyle = ORANGE; ctx.fillRect(280, 178, 3000, 10);
        // shop sign
        P(ctx, 520, -40, 860, 150, 16, NAVY, 6); ctx.save(); ctx.beginPath(); ctx.arc(610, 35, 52, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, 610, 35, 74); ctx.restore();
        T(ctx, o.sign || "TOKO WIJAYA", 960, 62, 66, { align: "center", col: "#FFF", track: 4 }); P(ctx, 1250, -10, 100, 90, 14, ORANGE, 5, OUT); T(ctx, "12", 1300, 54, 52, { align: "center", col: "#FFF" });
        // gondola racks (mostly empty)
        [[360, 0], [880, 1], [1400, 2]].forEach(([x0, j]) => { P(ctx, x0, 230, 460, 530, 8, "#C9CED4", 5, "#6E7782"); ctx.fillStyle = "#E9ECEF"; ctx.fillRect(x0 + 14, 244, 432, 502);
          for (let r = 0; r < 4; r++){ const y = 350 + r * 120; ctx.fillStyle = "#8D97A3"; ctx.fillRect(x0 + 8, y, 444, 12); ctx.fillStyle = ORANGE; ctx.fillRect(x0 + 8, y + 12, 444, 6);
            for (let k = 0; k < 8; k++){ const id = j * 40 + r * 8 + k; if (rnd(id + 3) > fill) continue; const w = 38 + rnd(id) * 12, h = 46 + rnd(id + 1) * 44, col = ["#E0503A", "#F6D36B", TEAL, "#F4A85C", BLUE, "#7FA563", "#FFF4E6", ORANGE][id % 8];
              ctx.fillStyle = col; rr(ctx, x0 + 22 + k * 54, y - h, w, h, 5); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x0 + 28 + k * 54, y - h + 10, w - 12, 8); } } });
        // "SEGERA DIBUKA" banner hanging from the ceiling, swaying
        if (o.banner !== false){ const sw = Math.sin(t * 1.3) * .025; ctx.save(); ctx.translate(1460, -150); ctx.rotate(sw); ctx.strokeStyle = "#5C6670"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-260, 0); ctx.lineTo(-240, 260); ctx.moveTo(260, 0); ctx.lineTo(240, 260); ctx.stroke();
          ctx.fillStyle = ORANGE; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-300, 250); for (let k = 0; k <= 12; k++){ const x = -300 + k * 50; ctx.lineTo(x, 250 + Math.sin(t * 2.4 + k * .8) * 4); }
          ctx.lineTo(300, 370); for (let k = 12; k >= 0; k--){ const x = -300 + k * 50; ctx.lineTo(x, 370 + Math.sin(t * 2.4 + k * .8 + 1) * 5); } ctx.closePath(); ctx.fill(); ctx.stroke();
          T(ctx, "SEGERA DIBUKA", 0, 330, 54, { align: "center", col: "#FFF", track: 3 }); ctx.restore(); }
        // stacked stock boxes by the wall
        [[1960, 3], [2140, 2]].forEach(([x, n]) => { for (let k = 0; k < n; k++){ P(ctx, x - 80 + (k % 2) * 10, 760 - (k + 1) * 100, 160, 100, 4, "#C9965E", 4); ctx.fillStyle = "#A8794A"; ctx.fillRect(x - 8 + (k % 2) * 10, 760 - (k + 1) * 100, 16, 100); } });
      });
      layer(ctx, c, .8, () => { U.floor(ctx, 760, [[0, "#E8E4DC"], [1, "#CFC8BC"]], false, t); ctx.strokeStyle = "rgba(59,36,24,.1)"; ctx.lineWidth = 3;
        for (let k = -20; k < 30; k++){ ctx.beginPath(); ctx.moveTo(960 + k * 160, 760); ctx.lineTo(960 + k * 380, 1400); ctx.stroke(); } for (let y = 820; y < 1400; y += 80){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(5000, y); ctx.stroke(); }
        U.baseboard(ctx, 762, "#8D97A3");
        [200, 1000, 1800].forEach((x, i) => { ctx.fillStyle = "#FFFDF4"; rr(ctx, x - 140, -170, 280, 22, 10); ctx.fill(); glow(ctx, x, -100, 260, "#FFF3D6", .25); }); });
      layer(ctx, c, .6, () => U.motes(ctx, t, 16, 57, 0, 0, 1920, 800, "#FFF3D6", .45));
    },
    // cashier counter (actors behind it use layer:"back")
    mid(ctx, c, t, o){ layer(ctx, c, 1, () => { const x = o.counterX ?? 700, w = 640, top = 760;
      ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, 1004, w / 2 + 30, 20, 0, 0, TAU); ctx.fill();
      P(ctx, x - w / 2, top, w, 1000 - top, 12, "#FFFDF8", 6); ctx.fillStyle = ORANGE; ctx.fillRect(x - w / 2 + 3, top + 60, w - 6, 22); ctx.fillStyle = TEAL; ctx.fillRect(x - w / 2 + 3, top + 86, w - 6, 8);
      S.drawLogo(ctx, x - 200, top + 160, 64); T(ctx, "KASIR", x + 60, top + 172, 40, { align: "center", col: NAVY, track: 4 });
      P(ctx, x - w / 2 - 16, top - 26, w + 32, 34, 10, "#3B3A40", 5);
      if (o.pos !== false){ ctx.save(); ctx.translate(x + 150, top - 26); P(ctx, -50, -70, 100, 70, 8, "#2B2A30", 4); ctx.fillStyle = "#BFE2EA"; rr(ctx, -42, -62, 84, 46, 5); ctx.fill(); P(ctx, -58, -12, 116, 14, 5, "#3B3A40", 3);
        P(ctx, 70, -40, 90, 40, 6, RED, 3, OUT); T(ctx, "MINI", 115, -12, 20, { align: "center", col: "#FFF" }); ctx.restore(); }
    }); } };

  // lobi: stairs + desk in front of the receptionist (both optional)
  const STR = { run: 70, rise: 50, n: 7 };
  S.stairStep = (x0, i) => [x0 + i * STR.run + STR.run / 2, 1000 - (i + 1) * STR.rise];
  const lobiBg = LOC.lobi.bg;
  function lobiDesk(ctx, x, t, o){ const y = 1000, sl = o.slam != null ? Math.max(0, 1 - Math.abs(t - o.slam) / .25) : 0, sl2 = o.slam2 != null ? Math.max(0, 1 - Math.abs(t - o.slam2) / .25) : 0, s = Math.max(sl, sl2);
    ctx.save(); ctx.translate(x, y + s * 4);
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 6, 480, 22, 0, 0, TAU); ctx.fill();
    P(ctx, -440, -300, 880, 300, 16, "#FFFDF8", 6); ctx.fillStyle = ORANGE; ctx.fillRect(-440, -110, 880, 26); P(ctx, -470, -330, 940, 44, 12, "#B5643C", 6);
    S.drawLogo(ctx, -300, -200, 70); T(ctx, "RESEPSIONIS", 60, -184, 34, { align: "center", col: NAVY, track: 4 });
    P(ctx, 220, -400, 120, 70, 8, "#544E42", 4); P(ctx, -160, -350, 70, 22, 6, "#C9D6DA", 3);
    // brochures on the counter: jump on a slam
    [[-30, YEL], [40, "#9FD3E0"], [100, "#F7B6C2"]].forEach(([bx, col], i) => { const jy = s > 0 ? Math.sin(s * Math.PI) * (40 + i * 14) : 0, jr = s > 0 ? (i - 1) * .4 * s : (i - 1) * .06; ctx.save(); ctx.translate(bx, -334 - jy); ctx.rotate(jr); P(ctx, -30, -40, 60, 40, 3, col, 3); ctx.restore(); });
    if (s > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; for (let k = 0; k < 5; k++){ const a = -Math.PI + k * .3 + .3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 90 + (o.slamX ?? -260), -330 + Math.sin(a) * 50); ctx.lineTo(Math.cos(a) * (130 + s * 50) + (o.slamX ?? -260), -330 + Math.sin(a) * (80 + s * 40)); ctx.stroke(); } }
    ctx.restore(); }
  function stairs(ctx, x0, t){ const { run, rise, n } = STR, top = 1000 - n * rise, xe = x0 + n * run;
    // solid stair block (side view) + landing to the upper floor
    ctx.fillStyle = "#CDB79B"; ctx.beginPath(); ctx.moveTo(x0, 1000); for (let i = 0; i < n; i++){ ctx.lineTo(x0 + i * run, 1000 - (i + 1) * rise); ctx.lineTo(x0 + (i + 1) * run, 1000 - (i + 1) * rise); } ctx.lineTo(xe + 900, top); ctx.lineTo(xe + 900, 1000); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
    for (let i = 0; i < n; i++){ P(ctx, x0 + i * run - 4, 1000 - (i + 1) * rise - 10, run + 8, 14, 4, "#B5643C", 3); }
    P(ctx, xe - 4, top - 10, 900, 14, 4, "#B5643C", 3); ctx.fillStyle = "#BBA387"; ctx.fillRect(xe, top + 4, 900, 40);
    // railing
    ctx.strokeStyle = "#8D97A3"; ctx.lineWidth = 7; for (let i = 0; i <= n; i += 1){ const px = x0 + i * run + 10, py = 1000 - Math.max(1, i) * rise - 6; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - 250); ctx.stroke(); }
    for (let k = 1; k < 7; k++){ const px = xe + k * 130; ctx.beginPath(); ctx.moveTo(px, top - 6); ctx.lineTo(px, top - 256); ctx.stroke(); }
    ctx.lineWidth = 14; ctx.strokeStyle = "#5C6670"; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0 + 10, 1000 - rise - 256); ctx.lineTo(xe + 10, top - 256); ctx.lineTo(xe + 900, top - 256); ctx.stroke(); ctx.lineCap = "butt";
    P(ctx, xe + 120, top - 520, 300, 70, 10, NAVY, 4); T(ctx, "LANTAI 2 ↑", xe + 270, top - 474, 30, { align: "center", col: "#FFF", track: 2 }); }
  LOC.lobi.bg = (ctx, c, t, o, sh, A) => {
    if (!o.deskFront && o.stairs == null) return lobiBg(ctx, c, t, o, sh, A);
    lobiBg(ctx, c, t, Object.assign({}, o, o.deskFront ? { deskX: 1e5, slam: null } : {}), sh, A);
    if (o.stairs != null) layer(ctx, c, 1, () => stairs(ctx, o.stairs, t)); };
  LOC.lobi.mid = (ctx, c, t, o) => { if (o.deskFront) layer(ctx, c, 1, () => lobiDesk(ctx, o.deskX ?? 1250, t, o)); };

  // gudang: optional empty labelled rack in front
  const gudangBg = LOC.gudang.bg;
  LOC.gudang.bg = (ctx, c, t, o, sh, A) => { gudangBg(ctx, c, t, o, sh, A); const R = o.emptyRack; if (!R) return;
    layer(ctx, c, .85, () => { const x0 = R.x ?? 300, w = R.w ?? 700; ctx.fillStyle = "#2E4A6B"; ctx.fillRect(x0, 120, 24, 680); ctx.fillRect(x0 + w - 24, 120, 24, 680);
      for (let r = 0; r < 3; r++){ const y = 330 + r * 210; ctx.fillStyle = "#E8A55B"; ctx.fillRect(x0, y, w, 18); ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(x0 + 24, y - 190, w - 48, 190); }
      const sw = Math.sin(t * 1.6) * .03; ctx.save(); ctx.translate(x0 + w / 2, 150); ctx.rotate(sw); P(ctx, -230, -10, 460, 90, 10, YEL, 5, OUT); T(ctx, R.label || "WIJAYA · TK-12", 0, 52, 44, { align: "center", col: OUT, track: 2 }); ctx.restore();
      if (R.note !== false){ ctx.save(); ctx.translate(x0 + w / 2, 460); ctx.rotate(-.05); T(ctx, R.note || "KOSONG", 0, 0, 64, { align: "center", col: RED, stroke: "#FFF", sw: 10, track: 6 }); ctx.restore(); } }); };

  PROP.hand_keys = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(Math.sin(t * 7) * .25);
    ctx.strokeStyle = "#9AA3AE"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 4, 3.4, 0, TAU); ctx.stroke(); P(ctx, -2.2, 6, 4.4, 8, 1.2, "#2B2A30", .6); ctx.fillStyle = "#C9D1D9"; ctx.fillRect(2, 6, 1.6, 7); ctx.restore(); };

  /* ============================== EFEK ============================== */
  // peta kota: 11 titik toko oranye menyala satu per satu, titik ke-12 berkedip "BUKA KAMIS"
  const DOTS = [[540, 380], [700, 300], [860, 420], [1010, 330], [620, 560], [800, 640], [1120, 520], [1270, 400], [980, 720], [1220, 700], [1400, 600]], NEW = [1520, 360];
  FX.storeMap = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]])); U.motes(ctx, t, 26, 3, 0, 0, SW, SH, "#9FB9E8", .3);
    const z = 1 + q * (f.push ?? .018); ctx.save(); ctx.translate(960, 560); ctx.scale(z, z); ctx.rotate(-.01 + Math.sin(t * .5) * .004); ctx.translate(-960, -560);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; P(ctx, 260, 150, 1400, 820, 26, "#F3EAD9", 0); ctx.restore(); P(ctx, 260, 150, 1400, 820, 26, "#F3EAD9", 6, OUT);
    ctx.save(); rr(ctx, 266, 156, 1388, 808, 22); ctx.clip();
    // park + river + roads
    ctx.fillStyle = "#CFE3B8"; ctx.beginPath(); ctx.ellipse(420, 820, 200, 120, .2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(1500, 860, 180, 90, -.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#9FC6D9"; ctx.lineWidth = 46; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(200, 250); ctx.bezierCurveTo(600, 300, 500, 520, 900, 560); ctx.bezierCurveTo(1200, 590, 1300, 820, 1700, 900); ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 22; [[[260, 470], [1660, 470]], [[260, 760], [1660, 760]], [[700, 150], [700, 970]], [[1180, 150], [1180, 970]], [[300, 200], [1600, 950]]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
    ctx.strokeStyle = "#E4D6BF"; ctx.lineWidth = 8; for (let k = 0; k < 8; k++){ ctx.beginPath(); ctx.moveTo(260 + k * 190, 150); ctx.lineTo(260 + k * 190 + 60, 970); ctx.stroke(); }
    ctx.restore();
    // title + subtitle chip
    T(ctx, f.title || "Toko Wijaya", 320, 236, 50, { col: NAVY });
    const lit = tm(f, f.litAt, .4), per = f.per ?? .3, nA = tm(f, f.newAt, lit - f.at + 11 * per + .6);
    let n = 0; DOTS.forEach(([x, y], i) => { const s = pop(t, lit + i * per, .35); if (s <= 0) return; n++; glow(ctx, x, y, 70, ORANGE, .45 * Math.min(1, s)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, String(i + 1), 0, 11, 30, { align: "center", col: "#FFF" }); ctx.restore(); });
    const cnt = `${n} toko`; P(ctx, 1260, 196, 360, 64, 32, NAVY, 4); T(ctx, f.count ? cnt : (n >= 11 ? "11 toko + 1 toko baru" : cnt), 1440, 240, 30, { align: "center", col: "#FFF", maxW: 330 });
    if (t >= nA){ const s = pop(t, nA, .4), b = .55 + .45 * Math.sin((t - nA) * 7); ctx.save(); ctx.translate(NEW[0], NEW[1]); ctx.scale(s, s);
      ctx.strokeStyle = hexA(ORANGE, 1 - ((t - nA) * 1.2) % 1); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 34 + (((t - nA) * 1.2) % 1) * 60, 0, TAU); ctx.stroke();
      ctx.globalAlpha = b; ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 8; ctx.stroke(); ctx.globalAlpha = 1; T(ctx, "12", 0, 12, 32, { align: "center", col: ORANGE });
      ctx.restore(); chip(ctx, NEW[0] - 10, NEW[1] - 100, pop(t, nA + .3, .4), f.newLabel || "BUKA KAMIS", RED, "#FFF", 32, -.04); }
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 1010, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || ORANGE, "#FFF", 34, 0); },
    sfx(f, g, add){ const lit = tm(f, f.litAt, .4), per = f.per ?? .3; for (let i = 0; i < 11; i++) add(g(lit + i * per), "pop", .45); add(g(tm(f, f.newAt, lit - f.at + 11 * per + .6)), "ping", .7); } };

  // foto kardus di ponsel Pak Wijaya: mesin kasir kecil + stiker TIPE MINI
  FX.boxPhoto = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.04) * (1 + q * .014); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#B5774F" }, f), z);
    ctx.fillStyle = "#111"; ctx.fillRect(x, y, w, h); T(ctx, "Galeri", x + 30, y + 64, 26, { col: "#FFF" }); T(ctx, f.date || "Sabtu, 6 Juni", x + w - 30, y + 64, 22, { align: "right", col: GREY, w: 600 });
    ctx.save(); rr(ctx, x, y + 100, w, 600, 0); ctx.clip(); ctx.fillStyle = lg(ctx, 0, y + 100, 0, y + 700, [[0, "#E4DACB"], [1, "#C9BBA6"]]); ctx.fillRect(x, y + 100, w, 600);
    ctx.strokeStyle = "rgba(59,36,24,.12)"; ctx.lineWidth = 3; for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.moveTo(x, y + 500 + k * 40); ctx.lineTo(x + w, y + 480 + k * 44); ctx.stroke(); }
    miniBox(ctx, x + w / 2, y + 560, .95, t, pop(t, tm(f, f.stickerAt, .6), .35)); ctx.restore();
    T(ctx, f.caption || "Kiriman untuk toko ke-12", x + 30, y + 760, 26, { col: "#FFF" }); T(ctx, "♡  Bagikan  ·  Edit", x + 30, y + 806, 22, { col: GREY, w: 600 });
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1520, f.chipY ?? 240, pop(t, tm(f, f.chipAt, 1.2), .4), f.chip, f.chipBg || NAVY, "#FFF", 36);
    if (f.chip2) chip(ctx, f.chipX ?? 1520, (f.chipY ?? 240) + 150, pop(t, tm(f, f.chip2At, 2), .4), f.chip2, f.chip2Bg || RED, "#FFF", 36, -.04); },
    sfx(f, g, add){ add(g(f.at + .1), "whoosh", .4); add(g(tm(f, f.stickerAt, .6)), "stamp", .7); if (f.chip) add(g(tm(f, f.chipAt, 1.2)), "pop", .5); if (f.chip2) add(g(tm(f, f.chip2At, 2)), "dun", .7); } };

  // bekukan gambar: kilat putih, gambar jadi abu-abu, bingkai sudut, teks
  FX.freeze = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; if (q < 0) return; const a = fin(t, f.at, .12);
    ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = `rgba(128,128,128,${.85 * a})`; ctx.fillRect(0, 0, SW, SH); ctx.restore();
    ctx.save(); ctx.fillStyle = `rgba(20,24,40,${.25 * a})`; ctx.fillRect(0, 0, SW, SH); ctx.restore();
    const fl = 1 - fin(t, f.at, .35); if (fl > 0){ ctx.save(); ctx.globalAlpha = fl * .9; ctx.fillStyle = "#FFF4E6"; ctx.fillRect(0, 0, SW, SH); ctx.restore(); }
    ctx.save(); ctx.strokeStyle = "#FFF6EA"; ctx.lineWidth = 8; ctx.globalAlpha = a; const m = 50 - 6 * Math.sin(q * 2); [[m, m, 1, 1], [SW - m, m, -1, 1], [m, SH - m, 1, -1], [SW - m, SH - m, -1, -1]].forEach(([x, y, dx, dy]) => { ctx.beginPath(); ctx.moveTo(x, y + dy * 90); ctx.lineTo(x, y); ctx.lineTo(x + dx * 90, y); ctx.stroke(); });
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(110, 110, 12, 0, TAU); ctx.fill(); T(ctx, "BEKU", 134, 122, 30, { col: "#FFF6EA", track: 4 }); ctx.restore();
    if (f.text){ const s = pop(t, f.at + (f.textD ?? .5), .4); chip(ctx, f.x ?? 1380, f.y ?? 880, s, f.text, f.bg || RED, "#FFF", f.size || 46, -.03); } },
    sfx(f, g, add){ add(g(f.at), "stamp", .9); add(g(f.at) + .05, "dun", .7); } };

  // penghitung waktu dengar (chip di layar): angka berjalan dari `from` ke `to` detik antara f.at dan t1
  FX.listenTimer = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .4); if (s <= 0) return; const fo = f.out != null ? 1 - fin(t, f.out, .35) : 1; if (fo <= 0) return;
    const t1 = tm(f, f.t1, 10), v = lerp(f.from ?? 30, f.to ?? 185, clamp((t - f.at) / Math.max(.1, t1 - f.at), 0, 1));
    ctx.save(); ctx.globalAlpha = fo; ctx.translate((f.x ?? 960) + Math.sin(t * .9) * 4, (f.y ?? 120) + Math.sin(t * 1.3) * 4); ctx.scale(s, s);
    P(ctx, -230, -56, 500, 112, 56, NAVY, 6, OUT); ctx.beginPath(); ctx.arc(-168, 0, 36, 0, TAU); ctx.fillStyle = "#FFF6EA"; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.stroke();
    ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.lineCap = "round"; const an = v / 60 * TAU; ctx.beginPath(); ctx.moveTo(-168, 0); ctx.lineTo(-168 + Math.sin(an) * 24, -Math.cos(an) * 24); ctx.stroke();
    T(ctx, mmss(v), -110, 22, 62, { col: "#FFF" }); ctx.fillStyle = RED; ctx.globalAlpha *= .5 + .5 * Math.sin(t * 6); ctx.beginPath(); ctx.arc(196, -22, 10, 0, TAU); ctx.fill(); ctx.globalAlpha = fo;
    T(ctx, f.label || "DENGAR", 196, 24, 24, { align: "center", col: YEL, track: 1 }); ctx.restore(); },
    sfx(f, g, add){ add(g(f.at), "pop", .5); } };

  // layar panggilan: memanggil (nada sambung) → terhubung (detik berjalan) → suara di seberang
  FX.callScreen = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.04) * (1 + q * .012); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#B5774F" }, f), z);
    ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, "#22304A"], [1, "#0E1626"]]); ctx.fillRect(x, y, w, h);
    const cA = tm(f, f.connectAt), on = cA != null && t > cA, cx = 0, cy = y + 300;
    if (!on){ for (let k = 0; k < 3; k++){ const r = ((t * .9 + k / 3) % 1); ctx.strokeStyle = `rgba(255,255,255,${.5 * (1 - r)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, 100 + r * 130, 0, TAU); ctx.stroke(); } }
    else { const r = (t * 1.6) % 1; ctx.strokeStyle = `rgba(59,163,107,${.6 * (1 - r)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 100 + r * 50, 0, TAU); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(cx, cy, 100, 0, TAU); ctx.fillStyle = f.col || WBROWN; ctx.fill(); ctx.strokeStyle = "#FFF6EA"; ctx.lineWidth = 6; ctx.stroke(); T(ctx, f.ch || "W", cx, cy + 36, 100, { align: "center", col: "#FFF" });
    T(ctx, f.name || "Pak Wijaya", cx, y + 480, 44, { align: "center", col: "#FFF" }); T(ctx, f.sub || "Toko Wijaya · 12 toko", cx, y + 524, 24, { align: "center", col: "#A9BCDD", w: 600 });
    const dots = ".".repeat(1 + Math.floor(t * 2.5) % 3);
    T(ctx, on ? mmss(t - cA) : "Memanggil" + dots, cx, y + 590, 34, { align: "center", col: on ? "#7FD39B" : "#FFF6EA", w: 700 });
    // ring counter
    (f.rings || []).forEach((rv, i) => { const ra = tm(f, rv); const s = pop(t, ra, .3); if (s <= 0 || on) return; ctx.save(); ctx.translate(cx - 70 + i * 70, y + 650); ctx.scale(s, s); ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ctx.restore(); });
    // voice from the other side
    const vA = tm(f, f.voiceAt); if (vA != null && t > vA){ const s = pop(t, vA, .35); ctx.save(); ctx.translate(cx, y + 680); ctx.scale(s, s); P(ctx, -170, -50, 340, 100, 50, "#FFF1C9", 5, OUT); T(ctx, f.voice || "\"Bicara.\"", 0, 18, 48, { align: "center", col: BROWN }); ctx.restore(); }
    // buttons
    [[-130, "#5E5A62", "🔇"], [0, RED, ""], [130, "#5E5A62", "🔊"]].forEach(([bx, col], i) => { ctx.beginPath(); ctx.arc(cx + bx, y + h - 110, i === 1 ? 52 : 40, 0, TAU); ctx.fillStyle = col; ctx.fill();
      if (i === 1){ ctx.save(); ctx.translate(cx, y + h - 110); ctx.rotate(2.35); ctx.strokeStyle = "#FFF"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 8, 22, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.restore(); }
      else { ctx.fillStyle = "#FFF"; ctx.fillRect(cx + bx - 8, y + h - 122, 16, 24); } });
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1520, f.chipY ?? 240, pop(t, tm(f, f.chipAt, .6), .4), f.chip, f.chipBg || NAVY, "#FFF", 36); },
    sfx(f, g, add){ (f.rings || []).forEach(rv => add(g(tm(f, rv)), "ring", .7, 1)); if (f.connectAt != null) add(g(tm(f, f.connectAt)), "click", .8); if (f.voiceAt != null) add(g(tm(f, f.voiceAt)), "dun", .5); } };

  // formulir pesanan di laptop: baris Tipe (MINI) + Dipesan oleh (Fitri) distabilo
  FX.orderForm = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Tangani Order · Formulir pesanan", clock: "11:20" }, f)), q = t - f.at;
    ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, y, w, h); const px = x + 160, pw = w - 320;
    P(ctx, px, y + 30, pw, h - 60, 18, "#FFFFFF", 3, "#D1D5DB"); ctx.fillStyle = NAVY; rr(ctx, px, y + 30, pw, 90, [18, 18, 0, 0]); ctx.fill(); S.drawLogo(ctx, px + 56, y + 75, 50);
    T(ctx, f.head || "FORMULIR PESANAN", px + 100, y + 88, 34, { col: "#FFF", track: 2 }); T(ctx, f.no || "PO-0525-12", px + pw - 30, y + 86, 26, { align: "right", col: "#A9BCDD", w: 700 });
    const hA = tm(f, f.hlAt, 1), wA = tm(f, f.whoAt, 3);
    const rows = f.rows || [["Toko", "Toko Wijaya 12 · Jl. Kenanga"], ["Produk", "Mesin kasir Tangani"], ["Tipe", "MINI", "hl"], ["Jumlah", "2 unit"], ["Dipesan oleh", "Fitri (admin Toko Wijaya)", "who"], ["Tanggal", "25 Mei · 14.12", "who"]];
    let cur = null; rows.forEach(([k, v, tag], i) => { const ry = y + 170 + i * 96, ta = tag === "hl" ? hA : tag === "who" ? wA + (k === "Tanggal" ? .5 : 0) : null, hq = ta != null ? clamp((t - ta) / .5, 0, 1) : 0;
      if (i) { ctx.fillStyle = "#EEF0F3"; ctx.fillRect(px + 30, ry - 56, pw - 60, 2); }
      T(ctx, k, px + 50, ry, 30, { col: "#6B7280", w: 700 }); font(ctx, 700, 36, F2); const tw = ctx.measureText(v).width;
      if (hq > 0){ ctx.fillStyle = "rgba(246,195,67,.6)"; ctx.fillRect(px + 380, ry - 40, (tw + 30) * hq, 54); if (hq < 1) cur = [px + 395 + tw * hq, ry - 10]; }
      T(ctx, v, px + 395, ry, 36, { col: tag === "hl" ? RED : "#111827", fam: F2, w: 800 });
      if (tag === "hl" && hq >= 1) ring(ctx, px + 395 + tw / 2, ry - 12, tw / 2 + 60, 50, clamp((t - ta - .5) / .5, 0, 1), RED, 8); });
    // cursor wandering towards the highlighted row
    const cq = cur || [lerp(x + w - 300, px + 500, easeIO(clamp(q / 1.2, 0, 1))), lerp(y + h - 100, y + 400, easeIO(clamp(q / 1.2, 0, 1))) + Math.sin(t * 2) * 6];
    S.cursor(ctx, cq[0] + 20, cq[1] + 20, false);
    ctx.restore();
    if (f.verdict){ chip(ctx, f.vx ?? 1460, f.vy ?? 980, pop(t, tm(f, f.verdictAt, 5), .4), f.verdict, f.verdictBg || GREEN, "#FFF", 36, -.03); } },
    sfx(f, g, add){ add(g(f.at + .1), "click", .4); add(g(tm(f, f.hlAt, 1)), "scribble", .6, .5); add(g(tm(f, f.hlAt, 1)) + .5, "ping", .6); add(g(tm(f, f.whoAt, 3)), "scribble", .6, .9); if (f.verdict) add(g(tm(f, f.verdictAt, 5)), "chime", .6); } };

  // chat laptop: tangkapan layar diseret ke kolom pesan, pesan diketik, ragu di tombol kirim, dihapus, tangkapan layar disimpan ke folder
  function formThumb(ctx, x, y, w, h){ P(ctx, x, y, w, h, 8, "#FFFFFF", 3, "#D1D5DB"); ctx.fillStyle = NAVY; ctx.fillRect(x + 3, y + 3, w - 6, h * .2); T(ctx, "FORMULIR PESANAN", x + w * .06, y + h * .15, h * .09, { col: "#FFF" });
    [["Tipe", "MINI"], ["Dipesan", "Fitri"]].forEach(([k, v], i) => { const yy = y + h * (.45 + i * .27); ctx.fillStyle = "rgba(246,195,67,.6)"; ctx.fillRect(x + w * .4, yy - h * .12, w * .4, h * .17); T(ctx, k, x + w * .06, yy, h * .11, { col: "#6B7280" }); T(ctx, v, x + w * .42, yy, h * .12, { col: i ? "#111827" : RED }); }); }
  S.formThumb = formThumb; S.chatImg = S.chatImg || {}; S.chatImg.form = formThumb;
  FX.draftChat = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Chat · Pak Wijaya", clock: "11:24" }, f)), q = t - f.at;
    ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h); S.chatHeader(ctx, x, y, w, "Pak Wijaya", "Toko Wijaya · online", WBROWN, "W", null, t);
    S.bubbleMsg(ctx, x + 40, y + 160, 700, "Oke. Jam tiga.", { time: "10.42", size: 30 });
    S.bubbleMsg(ctx, x + 40, y + 160, w - 80, "Baik, Pak. Jam 15.00 saya kabari.", { me: true, right: w - 80, time: "10.43 ✓✓", size: 30 });
    // folder (bottom-left of the chat area)
    const sA = tm(f, f.saveAt), saved = sA != null && t > sA + .7;
    ctx.save(); ctx.translate(x + 120, y + h - 240); S.folderIcon(ctx, 0, 0, 3.2, saved ? ORANGE : "#E8A55B"); T(ctx, "Bukti · Wijaya 12", 0, 90, 22, { align: "center", col: BROWN, w: 700 }); if (saved){ const s = pop(t, sA + .7, .4); ctx.scale(s, s); P(ctx, 40, -70, 56, 40, 20, GREEN, 3, OUT); T(ctx, "1", 68, -40, 24, { align: "center", col: "#FFF" }); } ctx.restore();
    // input row
    const tA = tm(f, f.typeAt, 2), dA = tm(f, f.delAt), hA = tm(f, f.holdAt), draft = f.draft || "Pak, ternyata yang memesan tipe mini adalah staf Bapak.";
    let txt = ""; if (t > tA){ txt = typed(draft, t, tA, f.cps || 18); if (dA != null && t > dA) txt = draft.slice(0, Math.max(0, Math.min(txt.length, draft.length - Math.floor((t - dA) * (f.delCps || 30))))); }
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + h - 110, w, 110); P(ctx, x + 300, y + h - 90, w - 480, 70, 35, "#FFFFFF", 3, txt ? ORANGE : "#D1D5DB");
    T(ctx, txt ? txt + (Math.sin(t * 8) > 0 ? "|" : "") : "Ketik pesan…", x + 340, y + h - 44, 28, { col: txt ? "#111827" : "#9CA3AF", w: 600, fam: F2, maxW: w - 560 });
    const hot = hA != null && t > hA && (dA == null || t < dA); ctx.beginPath(); ctx.arc(x + w - 110, y + h - 55, 38 + (hot ? 3 * Math.sin(t * 10) : 0), 0, TAU); ctx.fillStyle = txt ? (hot ? RED : GREEN) : "#9CA3AF"; ctx.fill(); T(ctx, "➤", x + w - 108, y + h - 42, 34, { align: "center", col: "#FFF" });
    // screenshot thumbnail: dragged in → attached → (deleted with the text) → flies to the folder
    const gA = tm(f, f.dragAt, .4), slot = [x + 300, y + h - 320], from = [x + w - 420, y + 200], fold = [x + 70, y + h - 280];
    if (t > gA){ const k = easeIO(clamp((t - gA) / .9, 0, 1)); let px = lerp(from[0], slot[0], k), py = lerp(from[1], slot[1], k), sc = lerp(1.15, 1, k);
      if (sA != null && t > sA){ const k2 = easeIO(clamp((t - sA) / .7, 0, 1)); px = lerp(slot[0], fold[0], k2); py = lerp(slot[1], fold[1], k2); sc = lerp(1, .25, k2); }
      if (!(sA != null && t > sA + .7)){ ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 20; formThumb(ctx, 0, 0, 340, 190); ctx.restore(); if (k < 1) S.cursor(ctx, px + 300 * sc, py + 160 * sc, true); } }
    if (hot) S.cursor(ctx, x + w - 120 + Math.sin(t * 9) * 3, y + h - 70, false);
    ctx.restore();
    if (hot) chip(ctx, 1500, 200, pop(t, hA + .2, .4), "KIRIM?", RED, "#FFF", 50, .05);
    if (dA != null && t > dA + .3 && !(sA != null && t > sA + .5)) chip(ctx, 1500, 200, pop(t, dA + .3, .4), "HAPUS…", "#5E5A62", "#FFF", 46, -.04);
    if (sA != null && t > sA + .6) chip(ctx, 1500, 200, pop(t, sA + .7, .4), f.saveChip || "SIMPAN DULU", GREEN, "#FFF", 46, -.03); },
    sfx(f, g, add){ add(g(tm(f, f.dragAt, .4)), "whoosh", .4); const tA = tm(f, f.typeAt, 2), dr = f.draft || "Pak, ternyata yang memesan tipe mini adalah staf Bapak."; add(g(tA), "typing", .5, Math.min(4, dr.length / (f.cps || 18)));
      if (f.holdAt != null) add(g(tm(f, f.holdAt)), "tick", .4, 2); if (f.delAt != null) add(g(tm(f, f.delAt)), "typing", .35, 1.6); if (f.saveAt != null){ add(g(tm(f, f.saveAt)), "whoosh", .4); add(g(tm(f, f.saveAt)) + .7, "pop", .6); } } };

  // chat ponsel umum: msgs [{t, me, text, time, read (centang biru), img: "form", thumb: true}]
  FX.chat16 = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.04) * (1 + q * .014); let shake = 0;
    (f.msgs || []).forEach(m => { const d = t - tm(f, m.t, 0); if (!m.me && d > 0 && d < .6) shake = Math.sin(t * 70) * 6 * (1 - d / .6); });
    ctx.save(); ctx.translate(shake, 0); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: f.skinHand || "#B5774F" }, f), z);
    ctx.fillStyle = f.night ? "#D9D0C4" : "#EDE5DA"; ctx.fillRect(x, y, w, h); S.chatHeader(ctx, x, y, w, f.name || "Pak Wijaya", f.sub || "online", f.col || WBROWN, f.ch || "W", null, t);
    let yy = y + 150; (f.msgs || []).forEach(m => { const ma = tm(f, m.t, 0), s = pop(t, ma, .35); if (s <= 0) return; ctx.save(); ctx.translate(0, (1 - Math.min(1, s)) * 30); ctx.globalAlpha = Math.min(1, s);
      if (m.thumb){ const bw = m.cap ? 280 : 170, bh = m.from ? 180 : 150, bx = m.me ? x + w - 22 - bw : x + 22, ty = m.from ? 30 : 0; P(ctx, bx, yy, bw, bh, 22, "#FFFFFF", 3, "#D1D5DB"); if (m.from) T(ctx, m.from, bx + 20, yy + 34, 22, { col: m.fromCol || ORANGE, w: 800 });
        if (m.cap){ ctx.save(); ctx.translate(bx + 200, yy + ty + 92 + Math.sin(t * 3 + 1) * 3); ctx.scale(1.5, 1.5); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 26, 20, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(24, 0, 15, 4.5, -.06, 0, TAU); ctx.fillStyle = "#9C5418"; ctx.fill(); ctx.stroke(); ctx.restore(); }
        ctx.save(); ctx.translate(bx + (m.cap ? 80 : bw / 2 - 6), yy + ty + 95); const b = 1 + .12 * Math.max(0, Math.sin((t - ma) * 6)) * Math.exp(-(t - ma) * 1.2); ctx.scale(.75 * b, .75 * b); ctx.rotate(-.08 + Math.sin(t * 3) * .05); S.bigThumb(ctx); ctx.restore();
        T(ctx, m.time || "", bx + bw - 14, yy + bh - 10, 16, { align: "right", col: "#9CA3AF", w: 700 }); yy += bh + 18; }
      else { let extra = 0; if (m.img){ const iw = w - 120, ih = iw * .56, bx = m.me ? x + w - 22 - iw - 20 : x + 22; P(ctx, bx, yy, iw + 20, ih + 20, 18, m.me ? "#DCF5E6" : "#FFFFFF", 3, "#D1D5DB"); (S.chatImg[m.img] || formThumb)(ctx, bx + 10, yy + 10, iw, ih, t); extra = ih + 32; yy += extra; }
        const rd = m.read != null && t > tm(f, m.read); if (!m.text){ yy += 6; ctx.restore(); return; } const r = S.bubbleMsg(ctx, x + 22, yy, w - 80, m.text, { me: m.me, right: w - 44, time: m.time ? (m.me ? m.time + (rd ? " ✓✓" : " ✓") : m.time) : "", size: 25, name: m.from, nameCol: m.fromCol });
        if (m.me && rd){ T(ctx, "✓✓", x + w - 22 - 14, yy + r[3] - 10, 16, { align: "right", col: "#3B82F6", w: 800 }); }
        yy += r[3] + 18; }
      ctx.restore(); });
    let inp = ""; (f.input || []).forEach(I => { const a0 = tm(f, I.t, 0); if (t < a0) return; const sd = I.send != null ? tm(f, I.send) : null, dl = I.del != null ? tm(f, I.del) : null; if (sd != null && t >= sd) return;
      let s1 = typed(I.text, t, a0, I.cps || 16); if (dl != null && t > dl) s1 = I.text.slice(0, Math.max(0, Math.min(s1.length, I.text.length - Math.floor((t - dl) * (I.delCps || 20))))); inp = s1; });
    font(ctx, 600, 24, F2); const IL = inp ? S.wrap(ctx, inp + (Math.sin(t * 8) > 0 ? "|" : " "), w - 80).slice(-3) : [], ih = Math.max(48, IL.length * 30 + 18);
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + h - ih - 32, w, ih + 32); P(ctx, x + 20, y + h - ih - 16, w - 40, ih, 24, "#FFFFFF", 2, inp ? ORANGE : "#D1D5DB");
    IL.forEach((l, i) => T(ctx, l, x + 40, y + h - ih + 12 + i * 30, 24, { col: "#111827", w: 600, fam: F2 }));
    ctx.restore(); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1500, f.chipY ?? 240, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || ORANGE, f.chipCol || "#FFF", f.chipSize || 40, .04);
    if (f.chip2) chip(ctx, f.chip2X ?? 1500, f.chip2Y ?? 400, pop(t, tm(f, f.chip2At, 2), .4), f.chip2, f.chip2Bg || NAVY, "#FFF", f.chipSize || 40, -.04); },
    sfx(f, g, add){ (f.msgs || []).forEach(m => add(g(tm(f, m.t, 0)), m.me ? "send" : "notif", .8)); (f.input || []).forEach(I => { const a0 = tm(f, I.t, 0); add(g(a0), "typing", .45, Math.min(4, I.text.length / (I.cps || 16))); if (I.del != null) add(g(tm(f, I.del)), "typing", .3, 1); }); if (f.chip) add(g(tm(f, f.chipAt, 1)), "pop", .5); if (f.chip2) add(g(tm(f, f.chip2At, 2)), "chime", .5); } };
  // catatan tempel (FX.sticky kit16b) dengan gerak kamera lebih kuat (zoom + geser), supaya tidak terbaca diam sebelum ditulis
  FX.stickyMove = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = 1 + q * (f.push ?? .035);
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(Math.sin(t * .7) * .02); ctx.translate(-960 + Math.sin(t * 1.1) * 40, -540 + Math.sin(t * .8 + 1) * 26);
    FX.sticky.draw(ctx, f, t); ctx.restore(); },
    sfx(f, g, add){ FX.sticky.sfx(f, g, add); } };
})();
