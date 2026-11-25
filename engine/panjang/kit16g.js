/* STORY16 kit G — tambahan untuk Kantor Tangani: Klien Terbesar Eps 3 ("7 hari"). Dimuat sesudah kit16f.js.
   Lokasi  : jalanHujan (jalan siang berhujan; mobil kurir ban pecah = PROP.truck di depan tokoh, hujan di lapisan depan).
   Slide   : LOC.rapat locOpt.slide = "email" (email Pak Wijaya di layar Melati; hl7 = waktu sorot "7 hari").
   Properti: easel7 (papan berkaki + kertas besar "7 HARI", paperAt), recBoard (papan pemulihan 3 kolom + 7 kotak hari),
             deskFront (meja tampak depan; laptop, book, bookX, gorengan, mug), doorAjar (pintu ruangan sedikit terbuka + cahaya),
             truck (mobil kurir cadangan, ban pecah, lampu hazard), hand_scanner, hand_brochure, hand_gorengan.
   Efek    : dayCount (pojok kanan atas "HARI n/7" + 7 kotak; `day` lewat keys — jangan pakai kunci `n`, itu nomor kemunculan cue), projSlide (layar Melati satu layar penuh),
             excuseDraft (draf email alasan yang terus memanjang + tangan Bu Ratna ke mouse lalu ditarik; delAt = dihapus semua),
             recBoardFx (papan pemulihan close-up), wijayaBook (buku kecil cokelat Pak Wijaya: baris per hari, sorot hari 4),
             sintaBook (buku kuning Sinta: "MENGHADAPI KLIEN MARAH (cara Rina)" 2 kolom), brochure (brosur "JASA GUDANG PIHAK KETIGA"),
             pencilFall (pensil Dodi jatuh dari telinga ke lantai; pasangkan dengan aktor `pencilOff`, opsi baru di kit16f).
   Waktu: angka di FX = relatif terhadap f.at; objek {cue}/{at} (juga di larik) = waktu lokal adegan. Di PROP/locOpt: angka = waktu lokal adegan. */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO, eIn = S.eIn;
  const pop = (t, t0, d) => t0 == null || t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343", MAROON = "#6E2430", GREY = "#9CA3AF", WBROWN = "#8E4A24";
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const ta = v => v == null ? null : (typeof v === "object" ? v.at : v);      // PROP / locOpt time (adegan-local)
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const ring = (ctx, cx, cy, rx, ry, k, col, lw) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = lw || 8; ctx.lineCap = "round"; ctx.beginPath(); const n = 44;
    for (let j = 0; j <= n * k; j++){ const a = -2.3 + j / n * TAU * 1.07; ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); } ctx.stroke(); ctx.restore(); };
  const reveal = (ctx, txt, x, y, size, k, o) => { if (k <= 0) return null; o = o || {}; font(ctx, o.w || 700, size, o.fam || F2); const w = ctx.measureText(txt).width;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 6, y - size * 1.1, (w + 12) * k, size * 1.6); ctx.clip(); T(ctx, txt, x, y, size, Object.assign({ fam: F2, w: 700 }, o, { align: "left" })); ctx.restore(); return k < 1 ? [x + w * k, y - size * .3] : null; };
  const pen = (ctx, x, y, col, t, skin) => { ctx.save(); ctx.translate(x + 8, y + Math.sin(t * 18) * 4); ctx.rotate(-.6); P(ctx, -11, -100, 22, 110, 8, col || "#1F4E8C", 4); P(ctx, -11, -100, 22, 28, 6, "#FFF", 0);
    ctx.fillStyle = skin || "#C98B62"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -48, -10, 96, 86, 30); ctx.fill(); ctx.stroke(); ctx.restore(); };
  const tick = (ctx, x, y, s, k, col) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col || GREEN; ctx.lineWidth = 9 * s; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x - 22 * s, y);
    if (k < .4) ctx.lineTo(x - 22 * s + 14 * s * k / .4, y + 16 * s * k / .4); else { ctx.lineTo(x - 8 * s, y + 16 * s); ctx.lineTo(x - 8 * s + 32 * s * (k - .4) / .6, y + 16 * s - 40 * s * (k - .4) / .6); } ctx.stroke(); ctx.restore(); };

  /* ============================== slide email di layar Melati ============================== */
  const slideBase = FX.slide.paint;
  FX.slide.paint = (ctx, x, y, w, h, t, o) => { if (o.slide !== "email") return slideBase(ctx, x, y, w, h, t, o);
    const s = h / 430; ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, 4); ctx.clip(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, 70 * s); T(ctx, "Kotak masuk · Email baru", x + 24 * s, y + 46 * s, 28 * s, { col: "#FFF" });
    S.avatar(ctx, x + 60 * s, y + 120 * s, 30 * s, WBROWN, "W"); T(ctx, "Pak Wijaya · Toko Wijaya", x + 104 * s, y + 116 * s, 26 * s, { col: NAVY }); T(ctx, "kepada: Rina, Pak Hendra", x + 104 * s, y + 146 * s, 18 * s, { col: GREY, w: 600 });
    P(ctx, x + 30 * s, y + 170 * s, 300 * s, 44 * s, 10 * s, RED, 0); T(ctx, "Peringatan terakhir", x + 180 * s, y + 200 * s, 24 * s, { align: "center", col: "#FFF" });
    T(ctx, "Kiriman terlambat tiga kali bulan ini.", x + 30 * s, y + 270 * s, 30 * s, { col: "#111827", fam: F2, w: 700, maxW: w - 60 * s });
    const hl = o.hl7 != null && t > o.hl7, hk = hl ? clamp((t - o.hl7) / .5, 0, 1) : 0; font(ctx, 700, 30 * s, F2); const w1 = ctx.measureText("Dalam ").width, w2 = ctx.measureText("7 hari").width;
    if (hk > 0){ ctx.fillStyle = "rgba(246,195,67,.75)"; ctx.fillRect(x + 30 * s + w1 - 4, y + 318 * s, (w2 + 8) * hk, 44 * s); }
    T(ctx, "Dalam 7 hari kami pindah ke penyedia lain.", x + 30 * s, y + 350 * s, 30 * s, { col: "#111827", fam: F2, w: 700, maxW: w - 60 * s });
    if (hk >= 1) ring(ctx, x + 30 * s + w1 + w2 / 2, y + 340 * s, w2 / 2 + 30 * s, 34 * s, clamp((t - o.hl7 - .5) / .5, 0, 1), RED, 6 * s);
    ctx.restore(); };
  FX.projSlide = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#3A2A22"], [1, "#1E1410"]])); glow(ctx, 960, 480, 1100, "#FFF6D8", .16);
    const z = 1 + q * (f.push ?? .02); ctx.save(); ctx.translate(960, 520); ctx.scale(z, z); ctx.rotate(Math.sin(t * .5) * .004); ctx.translate(-960 + Math.sin(t * .7) * 10, -520);
    P(ctx, 190, 70, 1540, 880, 10, "#FFFDF7", 8, "#2B1A12"); FX.slide.paint(ctx, 210, 90, 1500, 840, t, { slide: f.slide || "email", hl7: tm(f, f.hl7) });
    ctx.restore(); ctx.save(); ctx.globalAlpha = .06 + .02 * Math.sin(t * 7); ctx.fillStyle = "#FFF6D8"; ctx.fillRect(0, 0, SW, SH); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1520, f.chipY ?? 990, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || RED, "#FFF", 36, -.03); },
    sfx(f, g, add){ add(g(f.at + .1), "notif", .6); if (f.hl7 != null) add(g(tm(f, f.hl7)), "dun", .8); } };

  /* ============================== properti ============================== */
  // papan berkaki + kertas besar "7 HARI"
  PROP.easel7 = (ctx, o, t) => { ctx.save(); ctx.strokeStyle = "#5A3A26"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-170, 0); ctx.lineTo(-120, -560); ctx.moveTo(170, 0); ctx.lineTo(120, -560); ctx.moveTo(0, -20); ctx.lineTo(0, -560); ctx.stroke();
    P(ctx, -220, -640, 440, 330, 8, "#FBFCFB", 6, "#6E7782"); const pA = ta(o.paperAt), s = o.paperAt == null ? 1 : pop(t, pA, .4);
    if (s > 0){ ctx.save(); ctx.translate(0, -475); ctx.scale(s, s); ctx.rotate(-.03 + Math.sin(t * 1.3) * .01); P(ctx, -180, -140, 360, 280, 3, "#FFFDF0", 3, "rgba(43,26,18,.4)"); ctx.fillStyle = "#8D97A3"; [[-160, -126], [148, -126]].forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px, py, 7, 0, TAU); ctx.fill(); });
      T(ctx, o.big || "7", -60, 70, 190, { align: "center", col: RED }); T(ctx, o.text || "HARI", 80, 40, 62, { align: "center", col: RED, track: 2 }); ctx.restore(); }
    ctx.restore(); };
  // papan pemulihan (dipakai PROP dan FX): 3 kolom kartu + 7 kotak hari
  const REC = [["DODI · GUDANG", "CEK GANDA: pindai barcode + cocokkan kode alamat", "#3F6FB5"], ["BAYU · OPERASIONAL", "KURIR CADANGAN kalau kurir utama penuh", "#E8A55B"], ["RINA · CS", "KABAR 17.00 setiap hari, tanpa kecuali", "#D9483B"]];
  function recBoard(ctx, w, h, t, o, TM){ // origin = top-left of the board
    P(ctx, -16, -16, w + 32, h + 32, 14, "#9AA3AE", 5, OUT); P(ctx, 0, 0, w, h, 8, "#FBFCFB", 0);
    T(ctx, o.title || "PEMULIHAN · TOKO WIJAYA · 7 HARI", w / 2, 58, 40, { align: "center", col: NAVY, fam: F2, w: 800 });
    const cw = (w - 80) / 3; REC.forEach(([who, txt, col], i) => { const x = 40 + i * cw; T(ctx, who, x + cw / 2 - 10, 120, 26, { align: "center", col: "#6B7280", fam: F2, w: 800 });
      ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 3; ctx.strokeRect(x, 140, cw - 20, h * .42);
      const ca = o.cards ? TM(o.cards[i]) : -1e9, s = o.cards && o.cards[i] == null ? 0 : (ca != null ? pop(t, ca, .4) : 0); if (s > 0){ ctx.save(); ctx.translate(x + cw / 2 - 10, 140 + h * .21); ctx.scale(s, s); ctx.rotate((i - 1) * .03 + Math.sin(t * 1.2 + i) * .008);
        P(ctx, -(cw - 60) / 2, -h * .17, cw - 60, h * .34, 4, col, 0); ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(-(cw - 60) / 2, h * .17 - 10, cw - 60, 10); font(ctx, 800, 30, F2); const L = S.wrap(ctx, txt, cw - 100);
        L.slice(0, 4).forEach((l, j) => T(ctx, l, 0, -h * .17 + 50 + j * 38, 30, { align: "center", col: "#FFF", fam: F2, w: 800 })); ctx.restore(); } });
    // 7 day boxes
    const by = 160 + h * .42, bw = (w - 80) / 7; for (let d = 0; d < 7; d++){ const ba = o.boxesAt != null ? TM(o.boxesAt) + d * .28 : -1e9, bs = o.boxesAt != null ? pop(t, ba, .3) : 1; if (bs <= 0) continue; const x = 40 + d * bw;
      ctx.save(); ctx.translate(x + bw / 2, by + 70); ctx.scale(bs, bs); P(ctx, -bw / 2 + 10, -55, bw - 20, 110, 8, "#FFFFFF", 4, NAVY); T(ctx, `H${d + 1}`, 0, -66, 22, { align: "center", col: "#6B7280", w: 800 });
      const tk = o.tickAt && o.tickAt[d] != null ? clamp((t - TM(o.tickAt[d])) / .5, 0, 1) : (d < (o.ticks || 0) ? 1 : 0); tick(ctx, 4, -6, 1.5, tk, GREEN);
      if (o.hlDay === d + 1){ ctx.strokeStyle = `rgba(217,72,59,${.5 + .5 * Math.sin(t * 6)})`; ctx.lineWidth = 7; ctx.strokeRect(-bw / 2 + 4, -61, bw - 8, 122); } ctx.restore(); } }
  S.recBoard = recBoard;
  PROP.recBoard = (ctx, o, t) => { const w = o.w || 900, h = o.h || 520; ctx.save(); ctx.strokeStyle = "#5C6670"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-w / 2 + 60, 0); ctx.lineTo(-w / 2 + 60, -200); ctx.moveTo(w / 2 - 60, 0); ctx.lineTo(w / 2 - 60, -200); ctx.stroke();
    ctx.translate(-w / 2, -200 - h); recBoard(ctx, w, h, t, o, ta); ctx.restore(); };
  FX.recBoardFx = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#E8C69E"], [1, "#C99A6C"]]));
    const z = 1 + q * (f.push ?? .018); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.01 + Math.sin(t * .6) * .006); ctx.translate(-960 + Math.sin(t * .8) * 14, -540 + Math.sin(t * 1.1) * 8);
    ctx.translate(180, 90); recBoard(ctx, 1560, 860, t, f, v => tm(f, v)); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 1000, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || ORANGE, "#FFF", f.chipSize || 34, -.01); },
    sfx(f, g, add){ (f.cards || []).forEach(v => v != null && add(g(tm(f, v)), "stamp", .6)); if (f.boxesAt != null) add(g(tm(f, f.boxesAt)), "scribble", .5, 2); (f.tickAt || []).forEach(v => v != null && add(g(tm(f, v)), "chime", .5)); } };

  // meja tampak depan (tokoh duduk di belakangnya: layer "back", y ≈ 950)
  PROP.deskFront = (ctx, o, t) => { const w = o.w || 600; ctx.save(); ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 6, w / 2 + 30, 20, 0, 0, TAU); ctx.fill();
    P(ctx, -w / 2 + 20, -230, w - 40, 230, 8, "#A9643B", 6); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(-w / 2 + 40, -200, w - 80, 8); P(ctx, -w / 2, -262, w, 40, 10, "#C47A48", 6);
    if (o.laptop !== false){ const lx = o.laptopX ?? 0, lw = o.lidW || 240, lh = o.lidH || 170; P(ctx, lx - lw / 2, -262 - lh, lw, lh, 12, "#3B3A40", 5); S.drawLogo(ctx, lx, -262 - lh / 2, lh * .3); if (o.night) glow(ctx, lx, -262 - lh, 200, "#BFE2EA", .25); P(ctx, lx - lw / 2 - 20, -270, lw + 40, 14, 4, "#2B2A30", 3); }
    if (o.mug){ const mx = o.mugX ?? 210; P(ctx, mx - 22, -262 - 50, 44, 50, 8, ORANGE, 4); }
    if (o.book != null && o.book !== false){ const bx = typeof o.book === "number" ? o.book : -200; ctx.save(); ctx.translate(bx, -266); ctx.transform(1, 0, -.5, .35, 0, 0); P(ctx, -70, -100, 140, 100, 6, YEL, 4); ctx.restore(); }
    if (o.book2 != null && o.book2 !== false){ ctx.save(); ctx.translate(o.book2, -266); ctx.transform(1, 0, -.5, .35, 0, 0); P(ctx, -70, -100, 140, 100, 6, YEL, 4); ctx.restore(); }
    if (o.gorengan != null && o.gorengan !== false){ const gx = typeof o.gorengan === "number" ? o.gorengan : 0; ctx.save(); ctx.translate(gx, -268); ctx.fillStyle = "#FFFDF8"; ctx.beginPath(); ctx.ellipse(0, 0, 90, 22, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
      [[-40, "#D9A24E"], [0, "#C7862F"], [38, "#E0B25A"]].forEach(([dx, col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(dx, -14, 30, 16, (dx / 100), 0, TAU); ctx.fill(); ctx.stroke(); }); ctx.restore(); }
    ctx.restore(); };
  // pintu ruangan sedikit terbuka (cahaya hangat dari dalam)
  PROP.doorAjar = (ctx, o, t) => { const op = o.open ?? .4; ctx.save(); ctx.fillStyle = "#2B1A12"; ctx.fillRect(-150, -560, 300, 560); ctx.save(); rr(ctx, -150, -560, 300 * op + 4, 560, 0); ctx.clip(); ctx.fillStyle = lg(ctx, -150, 0, 150, 0, [[0, "#FFE7B8"], [1, "#F6C98C"]]); ctx.fillRect(-150, -560, 300, 560); ctx.restore();
    ctx.save(); ctx.globalAlpha = .35 + .05 * Math.sin(t * 3); ctx.fillStyle = "#FFE7B8"; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-150 + 300 * op, 0); ctx.lineTo(-150 + 300 * op + 260, 120); ctx.lineTo(-150 - 40, 120); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(-150 + 300 * op, 0); ctx.transform(1 - op, -.12 * op, 0, 1, 0, 0); P(ctx, 0, -560, 300, 560, 6, "#A9643B", 6); ctx.fillStyle = "#E8C07A"; ctx.beginPath(); ctx.arc(250, -270, 12, 0, TAU); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#8D97A3"; ctx.lineWidth = 12; ctx.strokeRect(-162, -572, 324, 572); P(ctx, -140, -650, 280, 56, 6, "#FFFDF8", 3); T(ctx, o.label || "KEPALA DIVISI", 0, -614, 18, { align: "center", col: BROWN, w: 800 }); ctx.restore(); };
  // mobil kurir cadangan dengan ban pecah (miring) + hazard
  PROP.truck = (ctx, o, t) => { const blink = Math.sin(t * 7) > 0; ctx.save(); if (o.flip) ctx.scale(-1, 1); ctx.fillStyle = "rgba(20,12,6,.3)"; ctx.beginPath(); ctx.ellipse(0, 6, 520, 24, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(0, -60); ctx.rotate(o.flat ? -.035 : 0);
    P(ctx, -500, -440, 620, 380, 10, "#F3F4F6", 6); ctx.fillStyle = TEAL; ctx.fillRect(-496, -150, 612, 26); T(ctx, o.label || "KURIR CADANGAN", -190, -270, 46, { align: "center", col: TEAL, track: 2 });
    ctx.beginPath(); ctx.moveTo(130, -60); ctx.lineTo(130, -340); ctx.lineTo(330, -340); ctx.quadraticCurveTo(380, -340, 410, -260); ctx.lineTo(450, -170); ctx.lineTo(450, -60); ctx.closePath(); ctx.fillStyle = "#3F6FB5"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(170, -190); ctx.lineTo(170, -310); ctx.lineTo(320, -310); ctx.quadraticCurveTo(355, -310, 375, -260); ctx.lineTo(405, -190); ctx.closePath(); ctx.fillStyle = "#9FC6D9"; ctx.fill(); ctx.stroke();
    [[440, -120], [-496, -120]].forEach(([hx, hy]) => { ctx.fillStyle = blink ? "#F7A23B" : "#8A5A2A"; rr(ctx, hx, hy, 18, 30, 6); ctx.fill(); if (blink) glow(ctx, hx + 9, hy + 15, 90, "#F7A23B", .6); });
    ctx.restore();
    [[-330, false], [300, !!o.flat]].forEach(([wx, flat]) => { ctx.save(); ctx.translate(wx, -58); ctx.fillStyle = "#1E1A18"; ctx.beginPath(); if (flat) ctx.ellipse(0, 18, 70, 44, 0, 0, TAU); else ctx.arc(0, 0, 62, 0, TAU); ctx.fill(); ctx.fillStyle = "#9AA3AE"; ctx.beginPath(); ctx.arc(0, flat ? 8 : 0, 26, 0, TAU); ctx.fill(); ctx.restore(); });
    if (o.flat){ T(ctx, "PSSS…", 300, -150 - Math.abs(Math.sin(t * 2)) * 10, 30, { align: "center", col: "#FFF", stroke: OUT, sw: 8 }); }
    ctx.restore(); };
  PROP.hand_scanner = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(-.3); P(ctx, -3, -4, 14, 7, 1.5, "#1F2937", .8); P(ctx, -2, 0, 5, 10, 1.5, "#1F2937", .8);
    if (Math.sin(t * 9) > -.2){ ctx.strokeStyle = "rgba(217,72,59,.85)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(11, -1); ctx.lineTo(26, 6); ctx.stroke(); } ctx.restore(); };
  PROP.hand_brochure = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(-.15); P(ctx, -2, -16, 16, 20, 1, "#FFFDF8", .8); ctx.fillStyle = TEAL; ctx.fillRect(-1, -15, 14, 6); ctx.fillStyle = ORANGE; ctx.fillRect(1, -6, 10, 2); ctx.restore(); };
  PROP.hand_gorengan = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.fillStyle = "#D9A24E"; ctx.strokeStyle = OUT; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(4, -4, 7, 4, -.3, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); };

  /* ============================== lokasi: jalan siang berhujan ============================== */
  LOC.jalanHujan = { bounds: [-200, 2120, -200, 1300], grade: { warm: 0, vig: .5, tint: "rgba(40,60,90,.12)" }, def: {},
    bg(ctx, c, t, o){ layer(ctx, c, .15, () => { fillAll(ctx, lg(ctx, 0, -300, 0, 700, [[0, "#6F7A8A"], [1, "#9AA3AE"]])); for (let k = 0; k < 5; k++) U.puff(ctx, ((t * 12 + k * 600) % 3200) - 600, -100 + k * 50, 1.2, "rgba(90,100,115,.6)"); });
      layer(ctx, c, .35, () => { for (let i = -6; i < 22; i++){ const w = 120 + rnd(i + 170) * 120, h = 260 + rnd(i + 180) * 320, x = i * 150 - 300; ctx.fillStyle = "#7B8494"; ctx.fillRect(x, 640 - h, w, h + 100);
        for (let wy = 640 - h + 24; wy < 680; wy += 36) for (let wx = x + 12; wx < x + w - 14; wx += 24) if (rnd(wx + wy * .7) > .5){ ctx.fillStyle = "rgba(220,230,240,.5)"; ctx.fillRect(wx, wy, 10, 14); } } });
      layer(ctx, c, .7, () => { ctx.fillStyle = "#5E6470"; ctx.fillRect(-3000, 700, 8000, 140); ctx.fillStyle = "#4B505A"; ctx.fillRect(-3000, 840, 8000, 600); ctx.fillStyle = "#E9ECEF"; for (let x = -3000; x < 5000; x += 260) ctx.fillRect(x, 930, 140, 10);
        ctx.fillStyle = "#8D97A3"; ctx.fillRect(-3000, 690, 8000, 16); for (let i = 0; i < 10; i++){ const px = rnd(i + 3) * 2400 - 200, py = 880 + rnd(i + 5) * 300, r = ((t * .8 + rnd(i)) % 1); ctx.strokeStyle = `rgba(220,230,240,${.5 * (1 - r)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(px, py, 20 + r * 50, 5 + r * 12, 0, 0, TAU); ctx.stroke(); } }); },
    front(ctx, c, t, o){
      layer(ctx, c, 1.15, () => { ctx.strokeStyle = "rgba(220,232,245,.45)"; ctx.lineWidth = 3; for (let i = 0; i < 160; i++){ const x = rnd(i) * 2800 - 400 + ((t * 120) % 140), y = ((rnd(i + 5) * 1600 + t * 1500) % 1600) - 300; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 48); ctx.stroke(); } }); } };

  /* ============================== efek layar ============================== */
  // penanda hari di pojok kanan atas: "HARI n/7" + 7 kotak (n lewat keys)
  FX.dayCount = { layer: "screen", draw(ctx, f, t){ const n = Math.round(f.day || 1), a = fin(t, f.at, .4) * (f.out != null ? 1 - fin(t, f.out, .3) : 1); if (a <= 0) return;
    const lastK = (f.keys || []).filter(k => k.day != null && k.at != null && k.at <= t).pop(), bump = lastK ? 1 + .25 * Math.max(0, 1 - (t - lastK.at) / .4) : 1;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(f.x ?? 1720, f.y ?? 62); ctx.scale(bump, bump); P(ctx, -170, -36, 340, 72, 18, "rgba(19,34,61,.92)", 4, OUT);
    T(ctx, `HARI ${n}/7`, -150, 13, 30, { col: "#FFF", track: 1 }); for (let d = 0; d < 7; d++){ const x = 14 + d * 21; P(ctx, x, -10, 16, 20, 4, d < n - 1 ? GREEN : d === n - 1 ? (Math.sin(t * 5) > 0 ? YEL : ORANGE) : "#3B4A6B", 0); } ctx.restore(); },
    sfx(f, g, add){ (f.keys || []).forEach(k => { if (k.day != null && k.at != null && k.at > 0) add(g(k.at), "pop", .5); }); } };

  // draf email alasan yang memanjang (laptop); handAt/backAt = tangan Bu Ratna ke mouse lalu ditarik; delAt = pilih semua + hapus
  const EXC = ["Kurir yang terlambat karena volume kiriman naik", "Hujan deras di jalur pengiriman", "Pesanan yang datang mendadak dari dua toko", "Stok kardus di gudang menipis", "Sistem label sempat bermasalah",
    "Kurir utama penuh di hari Kamis", "Jalan ditutup karena perbaikan", "Admin toko mengubah alamat", "Antrean tiket di tim CS sedang tinggi", "Cuti bersama minggu lalu", "Printer label gudang macet"];
  FX.excuseDraft = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Surel Kantor · Tulis pesan", clock: "09:40" }, f));
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); T(ctx, "Kepada:", x + 40, y + 60, 24, { col: GREY, w: 600 }); T(ctx, "Pak Wijaya · Toko Wijaya", x + 160, y + 60, 26, { col: NAVY });
    T(ctx, "Perihal:", x + 40, y + 104, 24, { col: GREY, w: 600 }); T(ctx, "Penjelasan keterlambatan kiriman", x + 160, y + 104, 26, { col: "#111827" }); ctx.fillStyle = "#E5E7EB"; ctx.fillRect(x + 30, y + 126, w - 60, 2);
    const its = f.itemAt || [], gA = tm(f, f.growAt), dA = tm(f, f.delAt); let n = 0; EXC.forEach((_, i) => { const a0 = its[i] != null ? tm(f, its[i]) : (gA != null ? gA + (i - its.length) * (f.per ?? .55) : 1e9); if (t >= a0) n = i + 1; });
    if (f.full) n = EXC.length; const lh = 56, top = y + 220, area = h - 300, contentH = n * lh, scroll = Math.max(0, contentH - area + 40);
    const sel = dA != null && t > dA - .6 && t < dA, gone = dA != null && t >= dA;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y + 130, w - 40, h - 230); ctx.clip();
    if (!gone){ T(ctx, "Yth. Pak Wijaya, berikut penyebab keterlambatan:", x + 40, y + 180 - Math.min(scroll, 9999), 26, { col: "#374151", fam: F2, w: 600 });
      for (let i = 0; i < n; i++){ const yy = top + i * lh - scroll; if (yy < y + 100 || yy > y + h) continue; const k = clamp((t - (its[i] != null ? tm(f, its[i]) : (gA ?? 0) + (i - its.length) * (f.per ?? .55))) / .4, 0, 1);
        if (sel){ ctx.fillStyle = "rgba(91,125,177,.35)"; ctx.fillRect(x + 36, yy - 36, w - 140, 48); } reveal(ctx, `${i + 1}. ${EXC[i]}`, x + 60, yy, 28, f.full ? 1 : k, { col: "#111827" }); } }
    else { if (Math.sin(t * 8) > 0){ ctx.fillStyle = "#111827"; ctx.fillRect(x + 42, y + 156, 3, 30); } }
    ctx.restore();
    // scrollbar
    if (!gone && contentH > area * .6){ const th = Math.max(60, (h - 240) * Math.min(1, area / (contentH + 1))); P(ctx, x + w - 26, y + 140, 12, h - 240, 6, "#F3F4F6", 0); P(ctx, x + w - 26, y + 140 + (h - 240 - th) * Math.min(1, scroll / Math.max(1, contentH - area + 40)), 12, th, 6, "#9CA3AF", 0); }
    if (!gone && n > 3){ T(ctx, `${n} alasan · ${Math.round(n * 38)} kata`, x + w - 60, y + h - 30, 22, { align: "right", col: n > 6 ? RED : GREY, w: 700 }); }
    P(ctx, x + 40, y + h - 76, 150, 56, 28, "#5B7DB1", 0); T(ctx, "Kirim", x + 115, y + h - 38, 26, { align: "center", col: "#FFF" });
    ctx.restore();
    // mouse on the desk + Bu Ratna's hand reaching in and pulling back
    const mx = 1780, my = 1010; ctx.save(); ctx.fillStyle = "#E5E7EB"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(mx, my, 48, 64, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    const hA = tm(f, f.handAt), bA = tm(f, f.backAt); if (hA != null && t > hA){ const k = easeIO(clamp((t - hA) / 1.2, 0, 1)) * (bA != null ? 1 - easeIO(clamp((t - bA) / .9, 0, 1)) : 1); if (k > 0){ const hx = lerp(2250, mx + 40, k), hy = lerp(1250, my - 30, k) + Math.sin(t * 6) * 3 * (1 - k);
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.5); P(ctx, 60, -60, 700, 150, 50, "#3B4A6B", 6); ctx.fillStyle = "#C98B62"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -90, -55, 170, 120, 50); ctx.fill(); ctx.stroke(); ctx.restore(); } }
    if (f.chip) chip(ctx, f.chipX ?? 1540, f.chipY ?? 170, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || RED, "#FFF", 36, .03); },
    sfx(f, g, add){ (f.itemAt || []).forEach(v => add(g(tm(f, v)), "typing", .5, 1.2)); if (f.growAt != null) add(g(tm(f, f.growAt)), "typing", .45, 3); if (f.handAt != null) add(g(tm(f, f.handAt)), "whoosh", .3); if (f.delAt != null) add(g(tm(f, f.delAt)), "whoosh", .5); } };

  // buku kecil bersampul cokelat Pak Wijaya: baris per hari; n = jumlah baris; writeAt = baris ke-n sedang ditulis; hl = indeks baris disorot (hlAt)
  const WB = ["Hari 1: Rina telepon. Tanpa alasan.", "Hari 2: kabar 17.00. Tepat.", "Hari 3: kabar 17.00. Tepat.", "Hari 4: gagal kirim, tapi dikabari DULUAN.", "Hari 5: kabar 17.00. Tepat.", "Hari 6: toko 5 sudah pakai pemindai.", "Hari 7: datang ke kantor."];
  FX.wijayaBook = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#6B4129"], [1, "#4A2C1A"]])); ctx.fillStyle = "rgba(255,255,255,.05)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, k * 130, SW, 4);
    const z = 1 + q * .018; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.025 + Math.sin(t * .6) * .008); ctx.translate(-960 + Math.sin(t * .8) * 14, -540 + Math.sin(t * 1.1) * 8);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 230, 90, 1460, 900, 18, WBROWN, 0); ctx.restore(); P(ctx, 230, 90, 1460, 900, 18, WBROWN, 6, OUT);
    P(ctx, 260, 116, 690, 850, 6, "#FFF6DE", 0); P(ctx, 970, 116, 690, 850, 6, "#FFF6DE", 0); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(950, 116, 20, 850);
    ctx.strokeStyle = "rgba(91,125,177,.25)"; ctx.lineWidth = 2; for (let yy = 230; yy < 960; yy += 100){ ctx.beginPath(); ctx.moveTo(270, yy); ctx.lineTo(940, yy); ctx.moveTo(980, yy); ctx.lineTo(1650, yy); ctx.stroke(); }
    T(ctx, "TANGANI · 7 HARI", 605, 200, 40, { align: "center", col: WBROWN, fam: F2, w: 800 });
    const n = f.n ?? 7, wA = tm(f, f.writeAt), hA = tm(f, f.hlAt); let front = null;
    for (let i = 0; i < n; i++){ const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4, lx = col ? 1000 : 290, ly = col ? 210 + row * 200 : 330 + row * 160, last = i === n - 1 && wA != null;
      const k = last ? clamp((t - wA) / 1.6, 0, 1) : 1; font(ctx, 700, 36, F2); const L = S.wrap(ctx, WB[i], 620);
      L.forEach((l, j) => { const kk = clamp(k * L.length - j, 0, 1); if (kk <= 0) return; const r2 = reveal(ctx, l, lx, ly + j * 46, 36, kk, { col: i === f.hl ? RED : "#1F4E8C", w: 800 }); if (r2) front = r2; });
      if (i === f.hl && hA != null && t > hA){ const hk = clamp((t - hA) / .6, 0, 1); ctx.fillStyle = "rgba(246,195,67,.45)"; ctx.fillRect(lx - 8, ly - 40, 640 * hk, 46 * L.length + 10); ring(ctx, lx + 320, ly + 6, 360, 70, clamp((t - hA - .6) / .5, 0, 1), RED, 7); } }
    if (front) pen(ctx, front[0], front[1], "#1F4E8C", t, "#B5774F");
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1480, f.chipY ?? 1000, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || NAVY, "#FFF", 36, -.02); },
    sfx(f, g, add){ add(g(f.at + .1), "whoosh", .3); if (f.writeAt != null) add(g(tm(f, f.writeAt)), "scribble", .7, 1.6); if (f.hlAt != null) add(g(tm(f, f.hlAt)), "ping", .6); if (f.chip) add(g(tm(f, f.chipAt, 1)), "pop", .5); } };

  // buku kuning Sinta: MENGHADAPI KLIEN MARAH (cara Rina), dua kolom
  FX.sintaBook = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#3A2E40"], [1, "#221A28"]])); glow(ctx, 1500, 200, 700, "#FFD9A0", .22);
    const z = 1 + q * .016; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.02 + Math.sin(t * .6) * .008); ctx.translate(-960 + Math.sin(t * .8) * 14, -540 + Math.sin(t * 1.1) * 8);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 220, 80, 1480, 920, 14, YEL, 0); ctx.restore(); P(ctx, 220, 80, 1480, 920, 14, YEL, 6, OUT); P(ctx, 250, 110, 1420, 860, 6, "#FFFDF0", 0);
    ctx.strokeStyle = "rgba(91,125,177,.25)"; ctx.lineWidth = 2; for (let yy = 260; yy < 960; yy += 80){ ctx.beginPath(); ctx.moveTo(260, yy); ctx.lineTo(1660, yy); ctx.stroke(); } ctx.strokeStyle = "rgba(217,72,59,.35)"; ctx.beginPath(); ctx.moveTo(340, 110); ctx.lineTo(340, 970); ctx.stroke();
    let front = null; const tA = tm(f, f.titleAt, .3); const r1 = reveal(ctx, "MENGHADAPI KLIEN MARAH (cara Rina)", 380, 210, 52, clamp((t - tA) / 1.2, 0, 1), { col: "#1F4E8C", w: 800 }); if (r1) front = r1;
    const lA = tm(f, f.leftAt), rA = tm(f, f.rightAt);
    if (lA != null && t > lA){ ctx.strokeStyle = "#1F4E8C"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1000, 280); ctx.lineTo(1000, 280 + 600 * clamp((t - lA) / .6, 0, 1)); ctx.stroke();
      [["Menit 1–3 (lobi):", 330, "#6B7280"], ["membela diri  ✗", 420, RED], ["\"Itu bukan bagian saya.\"", 500, RED]].forEach(([s0, yy, col], i) => { const r = reveal(ctx, s0, 380, yy, i ? 42 : 34, clamp((t - lA - .3 - i * .5) / .6, 0, 1), { col, w: 800 }); if (r) front = r; }); }
    if (rA != null && t > rA){ [["Telepon kedua:", 330, "#6B7280"], ["dengar · akui · jam  ✓", 420, GREEN], ["+ fakta setelah tenang", 500, GREEN]].forEach(([s0, yy, col], i) => { const r = reveal(ctx, s0, 1040, yy, i ? 42 : 34, clamp((t - rA - i * .5) / .6, 0, 1), { col, w: 800 }); if (r) front = r; });
      const kq = clamp((t - rA - 1.6) / .6, 0, 1); if (kq > 0) ring(ctx, 1300, 410, 300, 60, kq, GREEN, 7); }
    if (front) pen(ctx, front[0], front[1], "#1F4E8C", t);
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 1000, pop(t, tm(f, f.chipAt, 2), .4), f.chip, f.chipBg || TEAL, "#FFF", 36, -.02); },
    sfx(f, g, add){ add(g(tm(f, f.titleAt, .3)), "scribble", .6, 1.2); if (f.leftAt != null) add(g(tm(f, f.leftAt)), "scribble", .6, 1.5); if (f.rightAt != null){ add(g(tm(f, f.rightAt)), "scribble", .6, 1.5); add(g(tm(f, f.rightAt)) + 1.6, "chime", .5); } } };

  // brosur "JASA GUDANG PIHAK KETIGA" di tangan
  FX.brochure = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C9A27A"], [1, "#A97E56"]]));
    const z = 1 + q * .03; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.04 + Math.sin(t * .8) * .01); ctx.translate(-960 + Math.sin(t * .9) * 10, -540);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 460, 100, 1000, 860, 8, "#FFFFFF", 0); ctx.restore(); P(ctx, 460, 100, 1000, 860, 8, "#FFFFFF", 4);
    ctx.fillStyle = TEAL; ctx.fillRect(462, 102, 996, 260); T(ctx, "JASA GUDANG", 960, 200, 76, { align: "center", col: "#FFF", track: 3 }); T(ctx, "PIHAK KETIGA", 960, 300, 76, { align: "center", col: YEL, track: 3 });
    // warehouse icon
    ctx.fillStyle = "#E5E7EB"; ctx.beginPath(); ctx.moveTo(620, 640); ctx.lineTo(620, 480); ctx.lineTo(760, 400); ctx.lineTo(900, 480); ctx.lineTo(900, 640); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); P(ctx, 710, 540, 100, 100, 4, "#9CA3AF", 4);
    ["Lebih cepat", "Lebih murah", "Kontrak 1 tahun", "Tanpa urus staf gudang"].forEach((l, i) => T(ctx, "• " + l, 960, 470 + i * 70, 38, { col: "#374151", fam: F2, w: 700 }));
    T(ctx, "LogistikPro · hubungi kami", 960, 900, 30, { align: "center", col: TEAL, w: 800 }); ctx.restore();
    ctx.fillStyle = "#B5774F"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; rr(ctx, 360, 760, 220, 170, 60); ctx.fill(); ctx.stroke(); P(ctx, 160, 820, 260, 140, 40, "#3B2418", 6);
    if (f.chip) chip(ctx, 1550, 960, pop(t, tm(f, f.chipAt, .8), .4), f.chip, f.chipBg || RED, "#FFF", 34, -.03); },
    sfx(f, g, add){ add(g(f.at + .1), "dun", .7); } };

  // pensil jatuh dari telinga tokoh (world; pakai jangkar tokoh) — pasangkan dengan aktor { pencilOff: sama dengan f.at }
  FX.pencilFall = { layer: "world", draw(ctx, f, t){ const an = S.anchors[f.who || "dodi"]; if (!an || !an.world) return; const r = an.world, k = r.k, fc = r.face, q = t - f.at; if (q < 0) return;
    const x0 = r.x + (-21) * k * fc, y0 = r.headY - 4 * k, gy = f.floor ?? 1000, fall = Math.min(1, q / .55), y = lerp(y0, gy - 6, fall * fall), bounce = q > .55 ? Math.abs(Math.sin((q - .55) * 12)) * 30 * Math.exp(-(q - .55) * 6) : 0, x = x0 - fc * Math.min(q, 1.2) * 80;
    ctx.save(); ctx.translate(x, y - bounce); ctx.scale(k * .62, k * .62); ctx.rotate(.8 + q * 9 * Math.exp(-q * 1.5)); ctx.fillStyle = "#F6C343"; ctx.strokeStyle = OUT; ctx.lineWidth = 1.1; rr(ctx, -12, -1.9, 22, 3.8, .6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#E9B58A"; ctx.beginPath(); ctx.moveTo(10, -1.9); ctx.lineTo(15, 0); ctx.lineTo(10, 1.9); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#F7B6C2"; rr(ctx, -15, -1.9, 3.6, 3.8, .8); ctx.fill(); ctx.stroke(); ctx.restore();
    if (q > .5 && q < 1.4){ ctx.save(); ctx.globalAlpha = 1 - (q - .5) / .9; T(ctx, "tak", x + 60, gy - 60 - (q - .5) * 40, 40, { align: "center", col: "#FFF", stroke: OUT, sw: 8 }); ctx.restore(); } },
    sfx(f, g, add){ add(g(f.at) + .55, "tap", .9); add(g(f.at) + .75, "tap", .5); } };
})();
