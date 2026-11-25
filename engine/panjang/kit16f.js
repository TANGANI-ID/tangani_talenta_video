/* STORY16 kit F — tambahan untuk Kantor Tangani: Klien Terbesar Eps 2 ("Orang gudang"). Dimuat sesudah kit16e.js.
   Tokoh   : opsi look `pencil: true` = pensil terselip di telinga (Dodi). Membungkus TT.drawToon; tanpa opsi tidak berubah.
   Lokasi  : kabin (kabin mobil bak gudang dari depan, malam: dua kursi, setir, dasbor + radio, sapuan lampu jalan),
             jalan (jalan malam dari samping, mobil bak melaju), tokoluar (depan toko ke-12 Pak Wijaya; opsi time, banner, ribbon, ribbonCut, lit).
   Lokasi lama, opsi tambahan (tanpa opsi = sama seperti sebelumnya):
             gudang  : door = x pintu besi geser (+ doorAt = mulai terbuka, doorOpen = terbuka), board = x papan pengumuman penuh cetakan pesan
                       (boardQ = tanda tanya muncul, board5 = format 5 kolom ditempel), bench = x meja uji perangkat (digambar di depan tokoh layer:"back"),
                       holdRack = {x, w, box, hlAt} rak tahan dengan kardus berlabel.
             tokobaru: posBig = mesin kasir tipe besar, receiptAt = struk keluar.
   Properti: pickup (mobil bak parkir; box, lights, flip), trolley (troli + kardus), nasiBungkus,
             hand_box, hand_money, hand_bon (buku bon kecil).
   Efek    : messyBoard (papan cetakan pesan acak: cabut satu, tanda tanya, pesan Rina disorot / mode "format": 5 kolom ditempel),
             fiveTable (tabel 5 kolom: mode notebook / laptop + kirim ke gudang / print vs label kardus TK-11),
             flowPaper (kertas nasi: alur label → rak → troli → mobil + RAK TAHAN, lalu tabel 5 kolom Rina),
             bonBook (buku bon warung: "BAYU: 14 KOPI" + garis baru → 15), warnMail (email "Peringatan terakhir", sorot "7 hari"),
             whistle (not musik dari kepala tokoh). chat16 (kit16e) kini juga: input diketik/dihapus, gambar "receipt", balasan jempol + topi.
   Waktu: angka = relatif terhadap f.at; objek {cue}/{at} (juga di dalam larik) = waktu lokal adegan. */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO; const eIn = S.eIn;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343", MAROON = "#6E2430", GREY = "#9CA3AF", WBROWN = "#8E4A24";
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const tmL = (o, v) => v == null ? null : (typeof v === "object" ? v.at : v);   // location options (already adegan-local numbers)
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const ring = (ctx, cx, cy, rx, ry, k, col, lw) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = lw || 8; ctx.lineCap = "round"; ctx.beginPath(); const n = 44;
    for (let j = 0; j <= n * k; j++){ const a = -2.3 + j / n * TAU * 1.07; ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); } ctx.stroke(); ctx.restore(); };
  const pen = (ctx, x, y, col, t) => { ctx.save(); ctx.translate(x + 8, y + Math.sin(t * 18) * 4); ctx.rotate(-.6); P(ctx, -11, -100, 22, 110, 8, col || "#1F4E8C", 4); P(ctx, -11, -100, 22, 28, 6, "#FFF", 0);
    ctx.fillStyle = "#C98B62"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -48, -10, 96, 86, 30); ctx.fill(); ctx.stroke(); ctx.restore(); };
  const reveal = (ctx, txt, x, y, size, k, o) => { if (k <= 0) return null; font(ctx, (o && o.w) || 700, size, (o && o.fam) || F2); const w = ctx.measureText(txt).width; const ax = o && o.align === "center" ? x - w / 2 : x;
    ctx.save(); ctx.beginPath(); ctx.rect(ax - 6, y - size * 1.1, (w + 12) * k, size * 1.6); ctx.clip(); T(ctx, txt, ax, y, size, Object.assign({ fam: F2, w: 700 }, o || {}, { align: "left" })); ctx.restore(); return k < 1 ? [ax + w * k, y - size * .3] : null; };

  /* ============================== TOKOH: pensil di telinga ============================== */
  const drawToon0 = TT.drawToon;
  TT.drawToon = function(ctx, a, st, t){ const r = drawToon0.apply(this, arguments); if (r && a && a.pencil && !(a.pencilOff != null && t >= (typeof a.pencilOff === "object" ? a.pencilOff.at : a.pencilOff))){ try {
      const k = r.k, f = r.face, ex = r.x + (-21) * k * f, ey = r.headY + (-4) * k;
      ctx.save(); ctx.translate(ex, ey); ctx.scale(k * f * .62, k * .62); ctx.rotate(.8); ctx.lineJoin = "round";
      ctx.fillStyle = "#F6C343"; ctx.strokeStyle = OUT; ctx.lineWidth = 1.1; rr(ctx, -12, -1.9, 22, 3.8, .6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#E9B58A"; ctx.beginPath(); ctx.moveTo(10, -1.9); ctx.lineTo(15, 0); ctx.lineTo(10, 1.9); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.moveTo(13.4, -.65); ctx.lineTo(15, 0); ctx.lineTo(13.4, .65); ctx.fill();
      ctx.fillStyle = "#F7B6C2"; rr(ctx, -15, -1.9, 3.6, 3.8, .8); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#C9D1D9"; ctx.fillRect(-11.8, -1.9, 1.4, 3.8);
      ctx.restore(); } catch (e){ console.error(e); } }
    return r; };

  /* ============================== LOKASI: gudang (opsi tambahan) ============================== */
  const MESSY = ["printer rusak!!", "toko pak X", "URGENT", "kirim ulang??", "kasir mati", "yg kemarin itu", "ASAP!!", "cek ya mas", "alamat?"];
  function messyNote(ctx, x, y, w, h, txt, rot, col, sign){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); P(ctx, -w / 2, -h / 2, w, h, 3, col || "#FFFFFF", 2, "rgba(43,26,18,.35)");
    ctx.fillStyle = "#D9483B"; ctx.beginPath(); ctx.arc(0, -h / 2 + 8, 5, 0, TAU); ctx.fill();
    T(ctx, txt, -w / 2 + 10, -h / 2 + 34, Math.min(22, w / 7), { col: "#1E120B", fam: F2, w: 800, maxW: w - 18 });
    ctx.fillStyle = "rgba(0,0,0,.12)"; for (let i = 0; i < 3; i++) ctx.fillRect(-w / 2 + 10, -h / 2 + 48 + i * 14, (w - 30) * (.9 - i * .2), 5);
    if (sign) T(ctx, sign, w / 2 - 8, h / 2 - 8, 14, { align: "right", col: "#6B7280", w: 700 }); ctx.restore(); }
  function fiveSheet(ctx, x, y, w, h, s){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); P(ctx, -w / 2, -h / 2, w, h, 4, "#FFFFFF", 3, OUT); ctx.fillStyle = NAVY; ctx.fillRect(-w / 2 + 2, -h / 2 + 2, w - 4, h * .2);
    T(ctx, "FORMAT KELUHAN KE GUDANG", 0, -h / 2 + h * .14, h * .1, { align: "center", col: "#FFF" }); const cols = ["Toko", "Kode alamat", "Barang", "Masalah", "Foto"], cw = (w - 20) / 5;
    cols.forEach((c, i) => { P(ctx, -w / 2 + 10 + i * cw, -h / 2 + h * .26, cw - 4, h * .14, 3, ORANGE, 0); T(ctx, c, -w / 2 + 10 + i * cw + cw / 2 - 2, -h / 2 + h * .36, h * .065, { align: "center", col: "#FFF", maxW: cw - 10 });
      for (let r = 0; r < 4; r++){ ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 10 + i * cw, -h / 2 + h * (.42 + r * .13), cw - 4, h * .13); } }); ctx.restore(); }
  S.fiveSheet = fiveSheet;
  function board(ctx, x, t, o){ const y = 150, w = 600, h = 380, b5 = o.board5 === true ? -1e9 : tmL(o, o.board5), q5 = b5 != null ? clamp((t - b5) / .5, 0, 1) : 0, bq = tmL(o, o.boardQ);
    P(ctx, x - w / 2 - 14, y - 14, w + 28, h + 28, 10, "#8E5A34", 4); P(ctx, x - w / 2, y, w, h, 6, "#C9965E", 0); ctx.fillStyle = "rgba(0,0,0,.06)"; for (let i = 0; i < 40; i++) ctx.fillRect(x - w / 2 + rnd(i) * w, y + rnd(i + 9) * h, 4, 4);
    ctx.save(); ctx.globalAlpha = 1 - q5 * .85; MESSY.forEach((m, i) => { const px = x - w / 2 + 80 + (i % 4) * 145 + (rnd(i) - .5) * 30, py = y + 70 + Math.floor(i / 4) * 120 + (rnd(i + 3) - .5) * 30;
      messyNote(ctx, px, py, 120 + rnd(i + 5) * 30, 90, m, (rnd(i + 7) - .5) * .3, i % 3 === 0 ? "#FFF6C9" : "#FFFFFF"); }); ctx.restore();
    if (bq != null && t > bq && q5 < 1){ [[0, 0], [2, 1], [5, 2], [7, 3]].forEach(([i, j]) => { const px = x - w / 2 + 80 + (i % 4) * 145, py = y + 40 + Math.floor(i / 4) * 120, s = pop(t, bq + j * .25, .35), bb = Math.abs(Math.sin(t * 4 + j)) * 10;
      if (s > 0){ ctx.save(); ctx.translate(px, py - bb); ctx.scale(s, s); T(ctx, "?", 0, 0, 70, { align: "center", col: RED, stroke: "#FFF", sw: 10 }); ctx.restore(); } }); }
    if (q5 > 0) fiveSheet(ctx, x, y + h / 2, 440, 300, eBack(q5) * (1 + .01 * Math.sin(t * 2))); }
  function bench(ctx, x, t){ const top = 770; ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, 1004, 340, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#4B5563"; [x - 280, x + 260].forEach(lx => ctx.fillRect(lx, top + 20, 22, 1000 - top - 20)); P(ctx, x - 300, top, 600, 30, 6, "#6B7280", 5); P(ctx, x - 290, top + 60, 580, 16, 4, "#4B5563", 3);
    // devices on the bench: two registers, receipt printer, scanner gun, tester with blinking light
    [[x - 200, 0], [x - 30, 1]].forEach(([dx, i]) => { P(ctx, dx - 60, top - 110, 120, 80, 8, "#2B2A30", 4); ctx.fillStyle = i ? "#BFE2EA" : (Math.sin(t * 3) > 0 ? "#7FD39B" : "#BFE2EA"); rr(ctx, dx - 50, top - 100, 100, 56, 5); ctx.fill(); P(ctx, dx - 70, top - 30, 140, 30, 6, "#3B3A40", 3); });
    P(ctx, x + 100, top - 70, 90, 70, 10, "#3B3A40", 4); ctx.fillStyle = "#FFFDF8"; ctx.fillRect(x + 125, top - 100, 40, 32);
    ctx.save(); ctx.translate(x + 240, top - 30); ctx.rotate(-.4); P(ctx, -14, -60, 28, 70, 8, "#1F2937", 3); P(ctx, -30, -70, 60, 26, 8, "#1F2937", 3); ctx.restore();
    ctx.fillStyle = Math.sin(t * 6) > 0 ? RED : "#5E1A14"; ctx.beginPath(); ctx.arc(x + 150, top - 50, 6, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#1F2937"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 140, top - 20); ctx.bezierCurveTo(x - 80, top + 50, x + 40, top + 60, x + 100, top - 10); ctx.stroke(); }
  function holdRack(ctx, R, t){ const x0 = R.x ?? 1200, w = R.w ?? 640; ctx.fillStyle = "#7A3B2E"; ctx.fillRect(x0, 120, 24, 680); ctx.fillRect(x0 + w - 24, 120, 24, 680);
    for (let r = 0; r < 3; r++){ const y = 330 + r * 210; ctx.fillStyle = "#E8A55B"; ctx.fillRect(x0, y, w, 18); }
    // diagonal hazard sign
    ctx.save(); ctx.translate(x0 + w / 2, 140); ctx.rotate(Math.sin(t * 1.5) * .02); P(ctx, -230, -20, 460, 96, 10, YEL, 5, OUT); ctx.save(); rr(ctx, -230, -20, 460, 96, 10); ctx.clip(); ctx.fillStyle = "rgba(30,20,10,.85)"; for (let k = -6; k < 8; k++){ ctx.beginPath(); ctx.moveTo(-230 + k * 70, 76); ctx.lineTo(-200 + k * 70, 76); ctx.lineTo(-150 + k * 70, -20); ctx.lineTo(-180 + k * 70, -20); ctx.fill(); } ctx.restore();
    P(ctx, -170, -6, 340, 68, 8, "#FFFDF8", 3); T(ctx, R.label || "RAK TAHAN", 0, 44, 42, { align: "center", col: RED, track: 3 }); ctx.restore();
    // misc boxes + THE box (middle shelf)
    [[x0 + 40, 330, 120, 90], [x0 + w - 170, 330, 130, 110], [x0 + 60, 750, 150, 100]].forEach(([bx, by, bw, bh]) => { P(ctx, bx, by - bh, bw, bh, 4, "#C9965E", 4); ctx.fillStyle = "#A8794A"; ctx.fillRect(bx + bw / 2 - 8, by - bh, 16, bh); });
    if (R.box !== false){ const bx = x0 + w / 2 - 150, by = 540, bh = 170; const hA = tmL(null, R.hlAt), hl = hA != null && t > hA; if (hl) glow(ctx, bx + 150, by - 80, 260, YEL, .35 + .15 * Math.sin(t * 5));
      P(ctx, bx, by - bh, 300, bh, 5, "#C9965E", 5); ctx.fillStyle = "#A8794A"; ctx.fillRect(bx + 140, by - bh, 20, bh); T(ctx, "KASIR TIPE BESAR", bx + 150, by - bh + 40, 22, { align: "center", col: MAROON, w: 800 });
      P(ctx, bx + 40, by - 100, 220, 70, 6, "#FFFDF8", 4); T(ctx, R.box || "WIJAYA · TK-11", bx + 150, by - 54, 30, { align: "center", col: hl ? RED : BROWN, w: 800 }); } }
  const gudangBg1 = LOC.gudang.bg;
  LOC.gudang.bg = (ctx, c, t, o, sh, A) => { gudangBg1(ctx, c, t, o, sh, A);
    if (o.door != null) layer(ctx, c, .75, () => { const x = o.door, dA = tmL(o, o.doorAt), p = o.doorOpen ? 1 : dA != null ? easeIO(clamp((t - dA) / 1.3, 0, 1)) : 0;
      ctx.save(); rr(ctx, x, 60, 440, 700, 4); ctx.clip(); ctx.fillStyle = lg(ctx, 0, 60, 0, 760, [[0, "#FFF2D6"], [1, "#F6D9A8"]]); ctx.fillRect(x, 60, 440, 700); glow(ctx, x + 220, 400, 420, "#FFFFFF", .5 * p);
      ctx.translate(-p * 420, 0); P(ctx, x, 60, 440, 700, 2, "#8D97A3", 5); ctx.strokeStyle = "rgba(43,43,50,.35)"; ctx.lineWidth = 4; for (let k = 1; k < 6; k++){ ctx.beginPath(); ctx.moveTo(x + k * 73, 70); ctx.lineTo(x + k * 73, 750); ctx.stroke(); } P(ctx, x + 380, 380, 30, 90, 6, "#4B5563", 3); ctx.restore();
      ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 16; ctx.strokeRect(x, 60, 440, 700);
      if (p > 0){ ctx.save(); ctx.globalAlpha = .35 * p; ctx.fillStyle = "#FFF2D6"; ctx.beginPath(); ctx.moveTo(x, 760); ctx.lineTo(x + 440 * p, 760); ctx.lineTo(x + 440 * p + 500, 1300); ctx.lineTo(x + 200, 1300); ctx.fill(); ctx.restore(); } });
    if (o.board != null) layer(ctx, c, .75, () => board(ctx, o.board, t, o));
    if (o.holdRack) layer(ctx, c, .85, () => holdRack(ctx, o.holdRack, t)); };
  LOC.gudang.mid = (ctx, c, t, o) => { if (o.bench != null) layer(ctx, c, 1, () => bench(ctx, o.bench, t)); };

  /* ============================== LOKASI: tokobaru (opsi tambahan) ============================== */
  const tokoMid = LOC.tokobaru.mid;
  LOC.tokobaru.mid = (ctx, c, t, o, sh, A) => { tokoMid(ctx, c, t, o.posBig ? Object.assign({}, o, { pos: false }) : o, sh, A); if (!o.posBig) return;
    layer(ctx, c, 1, () => { const x = (o.counterX ?? 700) + 120, top = 734; ctx.save(); ctx.translate(x, top);
      ctx.fillStyle = "#2B2A30"; ctx.fillRect(-10, -90, 20, 90); P(ctx, -130, -250, 260, 170, 12, "#2B2A30", 5); ctx.fillStyle = "#BFE2EA"; rr(ctx, -116, -236, 232, 140, 6); ctx.fill();
      ctx.fillStyle = "#13223D"; ctx.fillRect(-116, -236, 232, 30); S.drawLogo(ctx, -96, -221, 22); T(ctx, "Kasir Tangani", -78, -213, 16, { col: "#FFF" }); ctx.fillStyle = "rgba(19,34,61,.25)"; for (let i = 0; i < 4; i++) ctx.fillRect(-100, -192 + i * 20, 120 - i * 15, 10);
      P(ctx, 20, -110, 80, 30, 8, GREEN, 3, OUT); T(ctx, "BESAR", 60, -89, 16, { align: "center", col: "#FFF" }); P(ctx, -150, -10, 300, 18, 6, "#3B3A40", 3);
      // receipt printer + paper
      ctx.translate(-230, 0); P(ctx, -60, -70, 120, 70, 10, "#3B3A40", 4); ctx.fillStyle = "#1E1A18"; ctx.fillRect(-40, -74, 80, 8);
      const rA = tmL(o, o.receiptAt); if (rA != null && t > rA){ const L = Math.min(170, (t - rA) * 130), sw = Math.sin(t * 3) * 4; ctx.fillStyle = "#FFFDF8"; ctx.strokeStyle = "rgba(43,26,18,.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-32, -72); ctx.lineTo(32, -72); ctx.lineTo(32 + sw, -72 - L); ctx.lineTo(-32 + sw, -72 - L); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(43,26,18,.35)"; for (let i = 0; i < Math.floor(L / 18); i++) ctx.fillRect(-24 + sw * (i * 18 / L), -86 - i * 18, 30 + rnd(i) * 18, 5); }
      ctx.restore(); }); };

  /* ============================== mobil bak ============================== */
  function pickup(ctx, x, y, t, o){ o = o || {}; const night = !!o.night, bob = o.moving ? Math.sin(t * 9) * 3 : 0, spin = o.moving ? t * 12 : 0; ctx.save(); ctx.translate(x, y); if (o.flip) ctx.scale(-1, 1);
    ctx.fillStyle = "rgba(20,12,6,.3)"; ctx.beginPath(); ctx.ellipse(0, 6, 470, 24, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(0, bob);
    // bed (back, left) + cab (front, right)
    P(ctx, -440, -230, 500, 150, 10, "#E9ECEF", 6); ctx.fillStyle = ORANGE; ctx.fillRect(-436, -150, 492, 18); P(ctx, -450, -250, 520, 30, 6, "#C9CED4", 5);
    if (o.box){ P(ctx, -330, -360, 220, 120, 4, "#C9965E", 5); ctx.fillStyle = "#A8794A"; ctx.fillRect(-230, -360, 20, 120); P(ctx, -310, -330, 120, 34, 3, "#FFFDF8", 2); T(ctx, "TK-12", -250, -305, 22, { align: "center", col: BROWN, w: 800 }); }
    ctx.beginPath(); ctx.moveTo(60, -80); ctx.lineTo(60, -360); ctx.quadraticCurveTo(60, -380, 90, -380); ctx.lineTo(260, -380); ctx.quadraticCurveTo(300, -380, 330, -320); ctx.lineTo(380, -230); ctx.quadraticCurveTo(450, -225, 455, -170); ctx.lineTo(455, -80); ctx.closePath();
    ctx.fillStyle = "#E9ECEF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = ORANGE; ctx.fillRect(64, -150, 388, 18);
    ctx.beginPath(); ctx.moveTo(100, -230); ctx.lineTo(100, -345); ctx.lineTo(255, -345); ctx.quadraticCurveTo(285, -345, 300, -310); ctx.lineTo(335, -230); ctx.closePath(); ctx.fillStyle = night ? "#2A3350" : "#9FC6D9"; ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.moveTo(130, -330); ctx.lineTo(180, -330); ctx.lineTo(140, -240); ctx.lineTo(110, -240); ctx.fill();
    S.drawLogo(ctx, -300, -190, 54); T(ctx, "GUDANG TANGANI", -130, -176, 34, { align: "center", col: NAVY, track: 2 });
    // lights
    ctx.fillStyle = night ? "#FFE9B0" : "#FFF4E6"; rr(ctx, 430, -200, 26, 34, 8); ctx.fill(); ctx.fillStyle = RED; rr(ctx, -452, -200, 16, 40, 6); ctx.fill();
    if (night || o.lights){ ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = lg(ctx, 450, 0, 1100, 0, [[0, "rgba(255,233,176,.45)"], [1, "rgba(255,233,176,0)"]]); ctx.beginPath(); ctx.moveTo(450, -200); ctx.lineTo(1150, -330); ctx.lineTo(1150, 40); ctx.lineTo(450, -160); ctx.fill(); ctx.restore(); glow(ctx, -452, -180, 90, RED, .5); }
    ctx.restore();
    [[-290], [300]].forEach(([wx]) => { ctx.save(); ctx.translate(wx, -50); ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(0, 0, 64, 0, TAU); ctx.fill(); ctx.fillStyle = "#9AA3AE"; ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fill(); ctx.rotate(spin); ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 6; for (let k = 0; k < 3; k++){ ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(24, 0); ctx.stroke(); } ctx.restore(); });
    ctx.restore(); }
  S.pickup = pickup;
  PROP.pickup = (ctx, o, t) => pickup(ctx, 0, 0, t, o);
  PROP.trolley = (ctx, o, t) => { ctx.save(); ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(0, 4, 170, 12, 0, 0, TAU); ctx.fill();
    P(ctx, -160, -50, 320, 22, 4, "#4B5563", 4); ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(150, -40); ctx.lineTo(170, -300); ctx.lineTo(120, -300); ctx.stroke();
    [-120, 120].forEach(wx => { ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(wx, -14, 16, 0, TAU); ctx.fill(); });
    if (o.box !== false){ P(ctx, -140, -230, 260, 180, 4, "#C9965E", 5); ctx.fillStyle = "#A8794A"; ctx.fillRect(-20, -230, 20, 180); P(ctx, -110, -160, 200, 50, 4, "#FFFDF8", 3); T(ctx, o.label || "WIJAYA · TK-11", -10, -126, 22, { align: "center", col: RED, w: 800 }); }
    ctx.restore(); };
  PROP.nasiBungkus = (ctx, o, t) => { ctx.save(); (o.items || [[-300], [0], [300]]).forEach(([dx], i) => { ctx.save(); ctx.translate(dx, 0); P(ctx, -70, -26, 140, 26, 10, "#C9A27A", 3); ctx.fillStyle = "#FFFDF8"; ctx.beginPath(); ctx.ellipse(0, -28, 50, 16, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.arc(26, -34, 9, 0, TAU); ctx.fill(); ctx.fillStyle = "#3E7D4F"; ctx.fillRect(-30, -38, 20, 8); ctx.restore(); }); ctx.restore(); };
  PROP.hand_box = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); P(ctx, -14, -18, 30, 22, 1.2, "#C9965E", .9); ctx.fillStyle = "#A8794A"; ctx.fillRect(-1, -18, 3, 22); P(ctx, -10, -12, 12, 5, .5, "#FFFDF8", .4); ctx.restore(); };
  PROP.hand_money = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); [[-.3, "#7FA563"], [0, "#5E8A44"], [.3, "#E0503A"]].forEach(([r, col]) => { ctx.save(); ctx.rotate(r + Math.sin(t * 6) * .05); P(ctx, -2, -14, 9, 15, .8, col, .6); ctx.restore(); }); ctx.restore(); };
  PROP.hand_bon = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(-.2); P(ctx, -3, -12, 12, 15, 1, "#8E4A24", .8); P(ctx, -1, -10, 8, 11, .6, "#FFF6DE", 0); ctx.fillStyle = "#3B2418"; for (let i = 0; i < 3; i++) ctx.fillRect(0, -8 + i * 3, 6, .7); ctx.restore(); };

  // kabin mobil bak dari depan (malam): kursi, jendela belakang dengan lampu kota yang lewat, dasbor + setir + radio di depan
  LOC.kabin = { bounds: [-100, 2020, -100, 1250], grade: { warm: .05, vig: .55 }, def: {},
    bg(ctx, c, t, o){ layer(ctx, c, .6, () => { fillAll(ctx, "#1C1A28");
        // rear window with passing lights
        ctx.save(); rr(ctx, 260, 140, 1400, 420, 60); ctx.clip(); ctx.fillStyle = lg(ctx, 0, 140, 0, 560, [[0, "#0E1330"], [1, "#2A2346"]]); ctx.fillRect(260, 140, 1400, 420);
        for (let i = 0; i < 16; i++){ const w = 90 + rnd(i) * 120, h = 120 + rnd(i + 3) * 200, x = 1700 - ((t * 220 + i * 140) % 1600); ctx.fillStyle = "#23233D"; ctx.fillRect(x, 560 - h, w, h); for (let wy = 560 - h + 16; wy < 550; wy += 26) for (let wx = x + 8; wx < x + w - 10; wx += 18) if (rnd(wx + wy * .7) > .6){ ctx.fillStyle = "rgba(246,196,122,.8)"; ctx.fillRect(wx, wy, 8, 11); } }
        for (let i = 0; i < 6; i++){ const x = 1700 - ((t * 700 + i * 300) % 1700); glow(ctx, x, 230, 60, "#FFE3A8", .6); }
        ctx.restore(); ctx.strokeStyle = "#0E0C16"; ctx.lineWidth = 26; rr(ctx, 260, 140, 1400, 420, 60); ctx.stroke(); ctx.fillStyle = "#0E0C16"; ctx.fillRect(945, 140, 30, 420);
        // seats
        [[700], [1220]].forEach(([sx]) => { P(ctx, sx - 210, 330, 420, 700, 90, "#3B3045", 6, "#0E0C16"); P(ctx, sx - 120, 250, 240, 120, 40, "#3B3045", 6, "#0E0C16"); }); }); },
    front(ctx, c, t, o){ layer(ctx, c, 1, () => { const bob = Math.sin(t * 9) * 3;
        // steering wheel in front of the driver
        const sx = o.wheelX ?? 700; ctx.save(); ctx.translate(sx, 860 + bob); ctx.rotate(Math.sin(t * .9) * .12); ctx.strokeStyle = "#111018"; ctx.lineWidth = 34; ctx.beginPath(); ctx.ellipse(0, 0, 190, 120, 0, 0, TAU); ctx.stroke(); ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(-180, 0); ctx.lineTo(180, 0); ctx.stroke(); ctx.fillStyle = "#2B2A35"; ctx.beginPath(); ctx.arc(0, 10, 50, 0, TAU); ctx.fill(); ctx.restore();
        // dashboard
        P(ctx, -400, 880 + bob, 2800, 600, 40, "#24232E", 6, "#0E0C16"); ctx.fillStyle = "rgba(255,255,255,.05)"; ctx.fillRect(-400, 900 + bob, 2800, 20);
        P(ctx, 880, 920 + bob, 160, 70, 12, "#111018", 4); const rad = o.radioAt != null && t > tmL(o, o.radioAt); ctx.fillStyle = rad ? "#F7A23B" : "#4B3A22"; rr(ctx, 895, 935 + bob, 130, 38, 6); ctx.fill(); if (rad){ T(ctx, "FM 98.7", 960, 963 + bob, 22, { align: "center", col: "#2B1A12" }); glow(ctx, 960, 950 + bob, 160, "#F7A23B", .35); }
        // A-pillars + windshield glare
        ctx.fillStyle = "#0E0C16"; ctx.beginPath(); ctx.moveTo(-200, -200); ctx.lineTo(120, -200); ctx.lineTo(-40, 1000); ctx.lineTo(-200, 1000); ctx.fill(); ctx.beginPath(); ctx.moveTo(2120, -200); ctx.lineTo(1800, -200); ctx.lineTo(1960, 1000); ctx.lineTo(2120, 1000); ctx.fill();
        ctx.save(); ctx.globalAlpha = .07; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(200, -100); ctx.lineTo(500, -100); ctx.lineTo(200, 900); ctx.lineTo(-100, 900); ctx.fill(); ctx.restore();
        // passing street-light sweep over everything
        const q = (t * .65) % 1; ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = lg(ctx, -600 + q * 3200, 0, -200 + q * 3200, 0, [[0, "rgba(255,210,140,0)"], [.5, "rgba(255,210,140,.22)"], [1, "rgba(255,210,140,0)"]]); ctx.fillRect(-400, -200, 2800, 1500); ctx.restore(); }); } };

  // jalan malam dari samping: mobil bak melaju (lampu jalan + gedung bergeser)
  LOC.jalan = { bounds: [-200, 2120, -200, 1300], grade: { warm: .04, vig: .5 }, def: { time: "malam" },
    bg(ctx, c, t, o){ const sp = o.speed ?? 600;
      layer(ctx, c, .1, () => { fillAll(ctx, lg(ctx, 0, -300, 0, 700, [[0, "#0E1330"], [.6, "#2A2346"], [1, "#4A3050"]])); for (let i = 0; i < 70; i++){ ctx.globalAlpha = .3 + .5 * Math.abs(Math.sin(t + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(rnd(i + 40) * 2400 - 200, rnd(i + 90) * 400 - 200, 2, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; });
      layer(ctx, c, .3, () => { for (let i = 0; i < 26; i++){ const w = 110 + rnd(i + 170) * 120, h = 250 + rnd(i + 180) * 360, x = ((i * 140 - t * sp * .15) % 3640 + 3640) % 3640 - 900; ctx.fillStyle = "#24253F"; ctx.fillRect(x, 640 - h, w, h + 100);
        for (let wy = 640 - h + 24; wy < 700; wy += 34) for (let wx = x + 12; wx < x + w - 14; wx += 22) if (rnd(wx * 1.3 + wy * .7 + i) > .55){ ctx.fillStyle = "rgba(244,194,122,.8)"; ctx.fillRect(wx, wy, 10, 14); } } });
      layer(ctx, c, .7, () => { ctx.fillStyle = "#2E2638"; ctx.fillRect(-3000, 700, 8000, 120); ctx.fillStyle = "#28232C"; ctx.fillRect(-3000, 820, 8000, 600); ctx.fillStyle = "#F2E6D0"; for (let k = -10; k < 30; k++){ const x = ((k * 260 - t * sp) % 7800 + 7800) % 7800 - 2600; ctx.fillRect(x, 1040, 140, 12); } });
      layer(ctx, c, .8, () => { for (let k = 0; k < 8; k++){ const x = ((k * 700 - t * sp * .8) % 5600 + 5600) % 5600 - 1600; ctx.fillStyle = "#2B2A30"; ctx.fillRect(x, 160, 18, 660); ctx.fillRect(x, 160, 120, 14); ctx.fillStyle = "#FFE3A8"; ctx.beginPath(); ctx.ellipse(x + 104, 180, 34, 12, 0, 0, TAU); ctx.fill(); glow(ctx, x + 104, 240, 300, "#FFD08A", .35); } }); },
    mid(ctx, c, t, o){ layer(ctx, c, 1, () => pickup(ctx, o.carX ?? 960, 1000, t, { night: true, moving: true, box: o.box !== false })); } };

  // depan toko ke-12 Pak Wijaya
  LOC.tokoluar = { bounds: [-200, 2120, -200, 1300], grade: { warm: .1, vig: .45 }, def: { time: "pagi" },
    bg(ctx, c, t, o){ const time = o.time || "pagi", night = time === "malam";
      layer(ctx, c, .2, () => { U.sky(ctx, -1200, -600, 4400, 1300, time, t, 51); U.skyline(ctx, -1200, -600, 4400, 400, time, t, 51, 1.1); });
      layer(ctx, c, .7, () => { fillAll(ctx, "rgba(0,0,0,0)"); ctx.fillStyle = night ? "#3A3552" : "#EFE6D6"; ctx.fillRect(100, -120, 1900, 900); ctx.fillStyle = night ? "#2A2742" : "#DCCFB9"; ctx.fillRect(100, 640, 1900, 140);
        // windows with the shop inside
        ctx.save(); rr(ctx, 200, 200, 1050, 470, 6); ctx.clip(); ctx.fillStyle = night ? "#FFF0CF" : "#F5F0E7"; ctx.fillRect(200, 200, 1050, 470);
        for (let s = 0; s < 3; s++){ const x0 = 230 + s * 340; P(ctx, x0, 290, 300, 380, 6, "#C9CED4", 3, "#6E7782"); for (let r = 0; r < 3; r++){ ctx.fillStyle = "#8D97A3"; ctx.fillRect(x0 + 6, 380 + r * 100, 288, 8); for (let k = 0; k < 6; k++){ if (rnd(s * 30 + r * 6 + k) > (o.fill ?? .8)) continue; ctx.fillStyle = ["#E0503A", "#F6D36B", TEAL, "#F4A85C", BLUE, "#7FA563"][(s + r + k) % 6]; ctx.fillRect(x0 + 16 + k * 46, 380 + r * 100 - 50, 34, 50); } } }
        if (night) glow(ctx, 720, 430, 700, "#FFE3A8", .3); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.moveTo(300, 200); ctx.lineTo(420, 200); ctx.lineTo(260, 670); ctx.lineTo(200, 670); ctx.fill(); ctx.restore(); ctx.strokeStyle = "#8D97A3"; ctx.lineWidth = 12; ctx.strokeRect(200, 200, 1050, 470);
        // door
        ctx.save(); rr(ctx, 1380, 230, 380, 530, 4); ctx.clip(); ctx.fillStyle = night ? "#FFEFC8" : "#E6EEF2"; ctx.fillRect(1380, 230, 380, 530); if (night) glow(ctx, 1570, 500, 400, "#FFE3A8", .5); ctx.restore(); ctx.strokeStyle = "#8D97A3"; ctx.lineWidth = 12; ctx.strokeRect(1380, 230, 380, 530); ctx.beginPath(); ctx.moveTo(1570, 230); ctx.lineTo(1570, 760); ctx.stroke();
        P(ctx, 1530, 460, 14, 90, 6, "#5C6670", 0); P(ctx, 1596, 460, 14, 90, 6, "#5C6670", 0);
        // sign
        P(ctx, 420, 30, 1080, 140, 16, NAVY, 6); ctx.save(); ctx.beginPath(); ctx.arc(520, 100, 50, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, 520, 100, 72); ctx.restore(); T(ctx, "TOKO WIJAYA", 960, 126, 70, { align: "center", col: "#FFF", track: 4 }); P(ctx, 1360, 50, 110, 96, 14, ORANGE, 5, OUT); T(ctx, "12", 1415, 118, 56, { align: "center", col: "#FFF" });
        if (night || o.lit) glow(ctx, 960, 100, 700, "#9FB9E8", .18);
        if (o.banner){ ctx.save(); ctx.translate(720, 215 + Math.sin(t * 2) * 3); P(ctx, -300, -26, 600, 60, 8, ORANGE, 4, OUT); T(ctx, o.banner === true ? "SEGERA DIBUKA" : o.banner, 0, 16, 36, { align: "center", col: "#FFF", track: 3 }); ctx.restore(); }
        // ribbon across the door (cut at ribbonCut)
        if (o.ribbon){ const cA = tmL(o, o.ribbonCut), cq = cA != null ? clamp((t - cA) / .8, 0, 1) : 0; ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.lineCap = "round";
          if (cq <= 0){ ctx.beginPath(); ctx.moveTo(1340, 470); ctx.quadraticCurveTo(1570, 500 + Math.sin(t * 2) * 6, 1800, 470); ctx.stroke(); ctx.save(); ctx.translate(1570, 495); ctx.fillStyle = RED; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 40, 0, 44, 26, d * .3, 0, TAU); ctx.fill(); }); ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill(); ctx.restore(); }
          else { [[1340, -1], [1800, 1]].forEach(([x0, d]) => { ctx.beginPath(); ctx.moveTo(x0, 470); ctx.quadraticCurveTo(x0 - d * 60, 520 + cq * 80, x0 - d * (60 + 40 * (1 - cq)), 600 + cq * 120); ctx.stroke(); }); }
          ctx.lineCap = "butt"; P(ctx, 1450, 180, 240, 46, 10, "#FFFDF8", 3); T(ctx, "PERESMIAN", 1570, 212, 26, { align: "center", col: RED, track: 3 }); } });
      layer(ctx, c, .85, () => { ctx.fillStyle = night ? "#4E4450" : "#C9BBA6"; ctx.fillRect(-3000, 760, 8000, 600); ctx.fillStyle = night ? "#6A5E68" : "#DCD0BD"; ctx.fillRect(-3000, 752, 8000, 14); ctx.strokeStyle = "rgba(20,12,6,.15)"; ctx.lineWidth = 3; for (let x = -3000; x < 5000; x += 160){ ctx.beginPath(); ctx.moveTo(x, 766); ctx.lineTo(x - 80, 1300); ctx.stroke(); }
        if (o.plants !== false){ U.plant(ctx, 160, 790, .8, t); U.plant(ctx, 1880, 790, .8, t, TEAL); } });
    } };

  /* ============================== EFEK ============================== */
  // papan cetakan pesan acak (close-up). pullAt: satu kertas dicabut & membesar; qAt: tanda tanya; mineAt: pesan bertanda "— Rina" disorot; mode "format": 5 kolom ditempel di pinAt
  FX.messyBoard = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#7E796F"], [1, "#5E5A52"]]));
    const z = 1 + q * (f.push ?? .02); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.012 + Math.sin(t * .6) * .006); ctx.translate(-960 + Math.sin(t * .9) * 14, -540 + Math.sin(t * .7) * 10);
    P(ctx, 140, 60, 1640, 960, 16, "#8E5A34", 8, OUT); P(ctx, 170, 90, 1580, 900, 8, "#C9965E", 0); ctx.fillStyle = "rgba(0,0,0,.06)"; for (let i = 0; i < 160; i++) ctx.fillRect(170 + rnd(i) * 1570, 90 + rnd(i + 9) * 890, 5, 5);
    const pA = tm(f, f.pinAt), fmt = f.mode === "format", pq = fmt && pA != null ? clamp((t - pA) / .6, 0, 1) : (fmt ? 1 : 0), mA = tm(f, f.mineAt), pullA = tm(f, f.pullAt), qA = tm(f, f.qAt);
    const notes = MESSY.concat(["printer?", "toko yg biasa", "BESOK!!", "rusak lagi", "tolong cek"]);
    notes.forEach((m, i) => { const px = 330 + (i % 5) * 320 + (rnd(i) - .5) * 60, py = 230 + Math.floor(i / 5) * 270 + (rnd(i + 3) - .5) * 50, mine = i === 0 || i === 6 || i === 9;
      if (i === 0 && pullA != null && t > pullA) return; ctx.save(); ctx.globalAlpha = 1 - pq * .9; const hl = mine && mA != null && t > mA;
      if (hl){ glow(ctx, px, py, 200, YEL, .45 + .15 * Math.sin(t * 5)); } messyNote(ctx, px, py, 250, 180, m, (rnd(i + 7) - .5) * .25, i % 3 === 0 ? "#FFF6C9" : "#FFFFFF", mine ? "— Rina" : (i % 2 ? "— CS" : ""));
      if (hl) ring(ctx, px, py, 160, 120, clamp((t - mA) / .5, 0, 1), RED, 7); ctx.restore(); });
    if (qA != null && pq < 1){ [[1, 0], [3, 1], [5, 2], [7, 3], [11, 4]].forEach(([i, j]) => { const px = 330 + (i % 5) * 320 + 90, py = 230 + Math.floor(i / 5) * 270 - 80, s = pop(t, qA + j * .3, .35), bb = Math.abs(Math.sin(t * 4 + j)) * 14;
      if (s > 0){ ctx.save(); ctx.translate(px, py - bb); ctx.scale(s, s); T(ctx, "?", 0, 0, 110, { align: "center", col: RED, stroke: "#FFF", sw: 14 }); ctx.restore(); } }); }
    if (pq > 0) fiveSheet(ctx, 960, 540, 1100, 700, eBack(pq) * (1 + .01 * Math.sin(t * 2)));
    ctx.restore();
    // pulled note held up big
    if (pullA != null && t > pullA){ const k = easeIO(clamp((t - pullA) / .6, 0, 1)); ctx.save(); ctx.translate(lerp(330, 760, k), lerp(230, 520, k) + Math.sin(t * 1.4) * 8); ctx.scale(lerp(1, 2.4, k), lerp(1, 2.4, k)); ctx.rotate(lerp(-.05, .04, k));
      ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 20; messyNote(ctx, 0, 0, 250, 180, "printer rusak!!", 0, "#FFF6C9", "— CS"); ctx.restore();
      ["Printer yang mana?", "Toko yang mana?", "Alamatnya di mana?"].forEach((s0, j) => { const at = f.qs && f.qs[j] != null ? tm(f, f.qs[j]) : pullA + 1 + j; chip(ctx, 1480, 300 + j * 200, pop(t, at, .4), s0, RED, "#FFF", 40, (j - 1) * .03); }); }
    if (f.card) chip(ctx, f.cardX ?? 960, f.cardY ?? 990, pop(t, tm(f, f.cardAt, 1), .4), f.card, f.cardBg || NAVY, "#FFF", 38, -.02); },
    sfx(f, g, add){ if (f.pullAt != null) add(g(tm(f, f.pullAt)), "whoosh", .5); if (f.qAt != null) for (let j = 0; j < 5; j++) add(g(tm(f, f.qAt) + j * .3), "pop", .5); if (f.mineAt != null) add(g(tm(f, f.mineAt)), "dun", .6); if (f.pinAt != null) add(g(tm(f, f.pinAt)), "stamp", .8); (f.qs || []).forEach(v => add(g(tm(f, v)), "pop", .6)); } };

  // tabel 5 kolom: mode notebook (digambar di buku kuning) | laptop (diisi pesanan Wijaya + dikirim ke gudang) | print (cetakan di tangan Dodi vs label kardus TK-11)
  const COLS = ["Toko", "Kode alamat", "Barang", "Masalah", "Foto"];
  const ROWS = [["Wijaya 3", "TK-03", "Kertas struk 20 rol", "Kirim rutin", "ada"], ["Wijaya 7", "TK-07", "Pemindai", "Ganti rusak", "ada"], ["Wijaya 9", "TK-09", "Printer struk", "Macet", "ada"], ["Wijaya 12 (baru)", "TK-12", "Kasir tipe besar", "Belum ketemu", "ada"]];
  function table(ctx, x, y, w, rowH, t, colAt, rowAt, o){ o = o || {}; const cw = w / 5; COLS.forEach((c, i) => { const k = colAt ? clamp((t - colAt[i]) / .4, 0, 1) : 1; if (k <= 0) return; ctx.save(); ctx.globalAlpha = k;
      P(ctx, x + i * cw, y, cw - 6, rowH, 8, o.headCol || ORANGE, 0); T(ctx, c, x + i * cw + cw / 2 - 3, y + rowH * .64, rowH * .4, { align: "center", col: "#FFF", maxW: cw - 16 }); ctx.restore(); });
    (o.rows || ROWS).forEach((r, j) => { const ra = rowAt ? (Array.isArray(rowAt) ? rowAt[j] : rowAt + j * (o.per ?? .35)) : -1e9, k = clamp((t - ra) / .35, 0, 1); for (let i = 0; i < 5; i++){ const cx = x + i * cw, cy = y + rowH * (1.1 + j);
        ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 2; ctx.strokeRect(cx, cy, cw - 6, rowH); if (k > 0){ ctx.save(); ctx.globalAlpha = k; const hl = o.hlRow === j && o.hlAt != null && t > o.hlAt; if (hl && (i < 2)){ ctx.fillStyle = "rgba(246,195,67,.6)"; ctx.fillRect(cx + 2, cy + 2, cw - 10, rowH - 4); }
          T(ctx, r[i], cx + 14, cy + rowH * .64, rowH * .36, { col: hl && i === 1 ? RED : "#111827", fam: F2, w: 700, maxW: cw - 26 }); ctx.restore(); } } }); }
  FX.fiveTable = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, mode = f.mode || "notebook";
    if (mode === "notebook"){ fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#7E796F"], [1, "#5E5A52"]])); const z = 1 + q * .02; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.03 + Math.sin(t * .7) * .01); ctx.translate(-960 + Math.sin(t * .9) * 16, -540);
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 260, 80, 1400, 920, 14, "#F6C343", 0); ctx.restore(); P(ctx, 260, 80, 1400, 920, 14, "#F6C343", 6, OUT); P(ctx, 300, 110, 1320, 860, 6, "#FFFDF0", 0);
      ctx.strokeStyle = "rgba(91,125,177,.3)"; ctx.lineWidth = 2; for (let y = 230; y < 960; y += 70){ ctx.beginPath(); ctx.moveTo(310, y); ctx.lineTo(1610, y); ctx.stroke(); }
      const tA = tm(f, f.titleAt, .2); let front = reveal(ctx, f.title || "Format ke gudang:", 360, 200, 54, clamp((t - tA) / .7, 0, 1), { col: "#1F4E8C" });
      const cA = f.colAt ? f.colAt.map(v => tm(f, v)) : COLS.map((_, i) => tm(f, f.drawAt, 1) + i * .45), cw = 250;
      COLS.forEach((c, i) => { const k = clamp((t - cA[i]) / .4, 0, 1); if (k <= 0) return; const x = 360 + i * cw; ctx.strokeStyle = "#1F4E8C"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, 260); ctx.lineTo(x, 260 + 640 * k); ctx.stroke(); if (i === 4){ ctx.beginPath(); ctx.moveTo(x + cw, 260); ctx.lineTo(x + cw, 260 + 640 * k); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(x, 340); ctx.lineTo(x + cw * k, 340); ctx.stroke(); const fr = reveal(ctx, c, x + 18, 315, 38, k, { col: "#1F4E8C", w: 800 }); if (fr) front = fr; });
      if (front) pen(ctx, front[0], front[1], "#1F4E8C", t); ctx.restore(); }
    else if (mode === "laptop"){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Tabel keluhan · Pesanan Wijaya", clock: "16:05" }, f)); ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, y, w, h);
      T(ctx, f.title || "Pesanan Toko Wijaya · semua toko", x + 60, y + 70, 38, { col: NAVY }); table(ctx, x + 60, y + 110, w - 120, 84, t, null, tm(f, f.rowsAt, .4), { per: f.per ?? .45 });
      const sA = tm(f, f.sendAt); const sent = sA != null && t > sA; P(ctx, x + w - 420, y + h - 110, 360, 76, 38, sent ? GREEN : ORANGE, 4, OUT); T(ctx, sent ? "✓ Terkirim ke Gudang" : "Kirim ke Gudang ➤", x + w - 240, y + h - 60, 28, { align: "center", col: "#FFF" });
      if (sA != null){ const cq = clamp((t - sA + 1) / 1, 0, 1); if (cq > 0 && t < sA + .4) S.cursor(ctx, lerp(x + w - 700, x + w - 200, easeIO(cq)), lerp(y + h - 300, y + h - 70, easeIO(cq)), t > sA - .15);
        if (sent){ const k = clamp((t - sA) / .9, 0, 1); ctx.save(); ctx.translate(lerp(x + w - 240, x + w + 200, eIn(k)), lerp(y + h - 70, y - 200, eIn(k))); ctx.rotate(-.5); ctx.globalAlpha = 1 - k; P(ctx, -60, -40, 120, 80, 8, "#FFFFFF", 4, ORANGE); ctx.restore(); } }
      ctx.restore(); if (sA != null && t > sA) chip(ctx, 1500, 200, pop(t, sA + .3, .4), f.sentChip || "DIKIRIM KE GUDANG", GREEN, "#FFF", 40, -.03); }
    else { // print vs box label
      fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#6E6A5F"], [1, "#4E4A42"]])); const z = 1 + q * .018; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960 + Math.sin(t * .8) * 12, -540 + Math.sin(t * .6) * 8);
      // cardboard with label (right)
      P(ctx, 1080, 120, 760, 820, 8, "#C9965E", 6); ctx.fillStyle = "#A8794A"; ctx.fillRect(1420, 120, 60, 820); P(ctx, 1160, 380, 600, 260, 10, "#FFFDF8", 5); T(ctx, "KODE ALAMAT", 1460, 450, 36, { align: "center", col: "#6B7280", track: 3 });
      const lA = tm(f, f.labelAt, .4), lq = clamp((t - lA) / .5, 0, 1); T(ctx, f.boxLabel || "TK-11", 1460, 580, 120, { align: "center", col: lq > 0 ? RED : BROWN }); ring(ctx, 1460, 540, 230, 90, lq, RED, 10); T(ctx, "WIJAYA", 1460, 700, 44, { align: "center", col: BROWN });
      // printout in the hand (left)
      ctx.save(); ctx.translate(80, 140); ctx.rotate(-.03); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 24; P(ctx, 0, 0, 940, 760, 6, "#FFFFFF", 0); ctx.shadowColor = "transparent"; P(ctx, 0, 0, 940, 760, 6, "#FFFFFF", 4);
      T(ctx, "Tabel keluhan · dari Rina (CS)", 40, 70, 34, { col: NAVY }); table(ctx, 40, 110, 860, 92, t, null, null, { hlRow: 3, hlAt: tm(f, f.rowAt, 2) }); ctx.restore();
      ctx.fillStyle = "#C98B62"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; rr(ctx, 20, 800, 200, 160, 60); ctx.fill(); ctx.stroke();
      const cA = tm(f, f.cmpAt); if (cA != null && t > cA){ const k = easeIO(clamp((t - cA) / .6, 0, 1)); ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.setLineDash([22, 14]); ctx.beginPath(); ctx.moveTo(560, 620); ctx.quadraticCurveTo(900, 760, lerp(560, 1260, k), lerp(620, 600, k)); ctx.stroke(); ctx.setLineDash([]);
        const s = pop(t, cA + .6, .4); ctx.save(); ctx.translate(1080, 560); ctx.scale(s, s); ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); T(ctx, "≠", 0, 34, 100, { align: "center", col: "#FFF" }); ctx.restore(); }
      ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 980, pop(t, tm(f, f.chipAt, 3), .4), f.chip, f.chipBg || NAVY, "#FFF", 38, -.02); } },
    sfx(f, g, add){ const m = f.mode || "notebook"; if (m === "notebook"){ add(g(tm(f, f.titleAt, .2)), "scribble", .5, .7); (f.colAt || [0, 1, 2, 3, 4]).forEach((v, i) => add(g(f.colAt ? tm(f, v) : tm(f, f.drawAt, 1) + i * .45), "scribble", .5, .4)); }
      if (m === "laptop"){ add(g(tm(f, f.rowsAt, .4)), "typing", .5, 2); if (f.sendAt != null){ add(g(tm(f, f.sendAt)), "send", .8); add(g(tm(f, f.sendAt)) + .3, "pop", .5); } }
      if (m === "print"){ add(g(tm(f, f.labelAt, .4)), "scribble", .6, .5); add(g(tm(f, f.rowAt, 2)), "scribble", .5, .5); if (f.cmpAt != null) add(g(tm(f, f.cmpAt)) + .6, "dun", .8); } } };

  // kertas pembungkus nasi: alur gudang (label kode → rak → troli → mobil, + RAK TAHAN), lalu tabel 5 kolom Rina di sebelahnya
  FX.flowPaper = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#B5643C"], [1, "#8E4E2E"]])); ctx.fillStyle = "rgba(255,255,255,.06)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, k * 130, SW, 4);
    const z = 1 + q * .016; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.02 + Math.sin(t * .6) * .008); ctx.translate(-960 + Math.sin(t * .8) * 14, -540 + Math.sin(t * 1.1) * 8);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; ctx.fillStyle = "#D9B98E"; ctx.beginPath(); ctx.moveTo(160, 90); ctx.lineTo(1760, 70); ctx.lineTo(1780, 1010); ctx.lineTo(140, 1020); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = "rgba(160,110,50,.25)"; [[400, 800, 90], [1500, 300, 60], [1200, 900, 70]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.ellipse(x, y, r, r * .7, .3, 0, TAU); ctx.fill(); });
    const steps = ["LABEL KODE", "RAK", "TROLI", "MOBIL"], fA = (f.flowAt || []).map(v => tm(f, v)); let front = null;
    steps.forEach((s0, i) => { const a0 = fA[i] ?? f.at + .4 + i * .7, k = clamp((t - a0) / .5, 0, 1); if (k <= 0) return; const x = 300 + i * 360, y = 260;
      ctx.save(); ctx.globalAlpha = Math.min(1, k * 2); ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 6; ctx.lineJoin = "round"; ctx.beginPath(); const n = 30; for (let j = 0; j <= n * k; j++){ const u = j / n * 4; const px = u < 1 ? x + 260 * u : u < 2 ? x + 260 : u < 3 ? x + 260 - 260 * (u - 2) : x, py = u < 1 ? y : u < 2 ? y + 110 * (u - 1) : u < 3 ? y + 110 : y + 110 - 110 * (u - 3); ctx.lineTo(px + Math.sin(j) * 1.5, py + Math.cos(j * 1.3) * 1.5); } ctx.stroke(); ctx.restore();
      const fr = reveal(ctx, s0, x + 130, y + 72, 36, clamp((t - a0 - .2) / .4, 0, 1), { col: "#2B1A12", w: 800, align: "center" }); if (fr) front = fr;
      if (i < 3 && k >= 1){ ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + 275, y + 55); ctx.lineTo(x + 345, y + 55); ctx.lineTo(x + 328, y + 40); ctx.moveTo(x + 345, y + 55); ctx.lineTo(x + 328, y + 70); ctx.stroke(); } });
    const hA = tm(f, f.holdAt); if (hA != null && t > hA){ const k = clamp((t - hA) / .6, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(790, 370); ctx.lineTo(790, 370 + 90 * k); ctx.stroke();
      if (k > .5){ const k2 = clamp((t - hA - .3) / .5, 0, 1); ctx.save(); ctx.globalAlpha = k2; P(ctx, 640, 470, 300, 110, 8, "rgba(217,72,59,.12)", 6, RED); ctx.restore(); const fr = reveal(ctx, "RAK TAHAN", 790, 540, 40, k2, { col: RED, w: 800, align: "center" }); if (fr) front = fr;
        const k3 = clamp((t - hA - 1) / .6, 0, 1); reveal(ctx, "kode tidak cocok", 960, 540, 28, k3, { col: RED }); } }
    const tA = tm(f, f.tableAt); if (tA != null && t > tA){ const cw = 250; COLS.forEach((c, i) => { const a0 = f.colAt && f.colAt[i] != null ? tm(f, f.colAt[i]) : tA + .3 + i * .4, k = clamp((t - a0) / .4, 0, 1); if (k <= 0) return; const x = 320 + i * cw, y = 700;
      ctx.strokeStyle = "#1F4E8C"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 240 * k); ctx.stroke(); if (i === 4){ ctx.beginPath(); ctx.moveTo(x + cw, y); ctx.lineTo(x + cw, y + 240 * k); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(x, y + 70); ctx.lineTo(x + cw * k, y + 70); ctx.stroke();
      const fr = reveal(ctx, c, x + 16, y + 50, 34, k, { col: "#1F4E8C", w: 800 }); if (fr) front = fr; }); const fr0 = reveal(ctx, "Format baru (Rina):", 320, 670, 34, clamp((t - tA) / .4, 0, 1), { col: "#1F4E8C" }); if (fr0) front = fr0; }
    if (front) pen(ctx, front[0], front[1], front[1] > 600 ? "#1F4E8C" : "#2B1A12", t);
    ctx.restore();
    if (f.card) chip(ctx, f.cardX ?? 960, f.cardY ?? 990, pop(t, tm(f, f.cardAt, 4), .4), f.card, f.cardBg || ORANGE, "#FFF", f.cardSize || 34, -.01); },
    sfx(f, g, add){ (f.flowAt || [0, 1, 2, 3]).forEach((v, i) => add(g(f.flowAt ? tm(f, v) : f.at + .4 + i * .7), "scribble", .5, .5)); if (f.holdAt != null) add(g(tm(f, f.holdAt)), "scribble", .6, .8); if (f.tableAt != null) add(g(tm(f, f.tableAt)), "scribble", .5, 2.2); if (f.card) add(g(tm(f, f.cardAt, 4)), "pop", .5); } };

  // buku bon warung: "BAYU: 14 KOPI" dengan turus; addAt = satu garis baru + angka 15
  FX.bonBook = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#B5643C"], [1, "#8E4E2E"]]));
    const z = 1 + q * .02; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.03 + Math.sin(t * .7) * .01); ctx.translate(-960 + Math.sin(t * .9) * 16, -540 + Math.sin(t * 1.2) * 10);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 420, 60, 1080, 960, 14, "#8E4A24", 0); ctx.restore(); P(ctx, 420, 60, 1080, 960, 14, "#8E4A24", 6, OUT); P(ctx, 450, 90, 1020, 900, 6, "#FFF6DE", 0);
    ctx.strokeStyle = "rgba(217,72,59,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(540, 90); ctx.lineTo(540, 990); ctx.stroke(); ctx.strokeStyle = "rgba(91,125,177,.25)"; for (let y = 260; y < 980; y += 110){ ctx.beginPath(); ctx.moveTo(450, y); ctx.lineTo(1470, y); ctx.stroke(); }
    T(ctx, f.title || "BUKU BON · WARUNG BU TINI", 960, 190, 46, { align: "center", col: BROWN, fam: F2, w: 800 });
    const aA = tm(f, f.addAt), added = aA != null && t > aA, n0 = f.count ?? 14, n = added ? n0 + 1 : n0;
    [["PAK RT", "3 teh", .5], ["DODI", "lunas ✓", .5], ["BAYU", null, 1]].forEach(([nm, v, a], j) => { const yy = 360 + j * 220; ctx.save(); ctx.globalAlpha = a; T(ctx, nm + ":", 580, yy, 54, { col: j === 2 ? RED : "#1F4E8C", fam: F2, w: 800 });
      if (v) T(ctx, v, 900, yy, 50, { col: "#1F4E8C", fam: F2, w: 700 });
      else { T(ctx, `${n} KOPI`, 1440, yy, 64, { align: "right", col: RED, fam: F2, w: 800 }); ctx.strokeStyle = "#1F4E8C"; ctx.lineWidth = 7; ctx.lineCap = "round";
        for (let i = 0; i < n; i++){ const grp = Math.floor(i / 5), r = i % 5, gx = 600 + grp * 130, last = added && i === n - 1, k = last ? clamp((t - aA) / .4, 0, 1) : 1; if (k <= 0) continue; ctx.beginPath();
          if (r < 4){ const x = gx + r * 22; ctx.moveTo(x, yy + 30); ctx.lineTo(x, yy + 30 + 90 * k); } else { ctx.moveTo(gx - 12, yy + 110); ctx.lineTo(gx - 12 + 100 * k, yy + 110 - 70 * k); } ctx.stroke(); }
        if (added) ring(ctx, 1330, yy - 22, 150, 62, clamp((t - aA - .4) / .5, 0, 1), RED, 7); } ctx.restore(); });
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1600, f.chipY ?? 180, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || MAROON, "#FFF", 36); },
    sfx(f, g, add){ add(g(f.at + .1), "whoosh", .3); if (f.addAt != null){ add(g(tm(f, f.addAt)), "scribble", .7, .4); add(g(tm(f, f.addAt)) + .5, "dun", .6); } } };

  // email "Peringatan terakhir": kotak masuk → email terbuka, baris "7 hari" disorot dan kamera mendekat
  FX.warnMail = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, zA = tm(f, f.zoomAt, 3), zk = easeIO(clamp((t - zA) / 1.2, 0, 1));
    ctx.save(); ctx.translate(960, 540); ctx.scale(1 + .5 * zk, 1 + .5 * zk); ctx.translate(-960 - 160 * zk, -540 - 120 * zk);
    const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Surel Kantor", clock: "09:12" }, f)); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y, 380, h);
    const oA = tm(f, f.openAt, .8), open = t > oA, nq = pop(t, f.at + .2, .35);
    [["Pak Wijaya", "Peringatan terakhir", true], ["Tim Gudang", "Jadwal kirim pekan ini", false], ["HR", "Info cuti bersama", false]].forEach(([fr, sb, hot], i) => { const yy = y + 30 + i * 120; ctx.save(); if (i === 0){ ctx.globalAlpha = Math.min(1, nq); } P(ctx, x + 16, yy, 348, 104, 12, hot ? "#FDE2DF" : "#FFFFFF", 2, hot ? RED : "#E5E7EB");
      T(ctx, fr, x + 36, yy + 40, 24, { col: NAVY, w: hot ? 800 : 600 }); T(ctx, sb, x + 36, yy + 78, 21, { col: hot ? RED : "#6B7280", w: hot ? 800 : 500, maxW: 310 }); ctx.restore(); });
    if (open){ const k = clamp((t - oA) / .35, 0, 1); ctx.save(); ctx.globalAlpha = k; const px = x + 420, pw = w - 460;
      P(ctx, px, y + 30, pw, h - 60, 14, "#FFFFFF", 3, "#E5E7EB"); S.avatar(ctx, px + 60, y + 100, 36, WBROWN, "W"); T(ctx, "Pak Wijaya · Toko Wijaya", px + 116, y + 92, 28, { col: NAVY }); T(ctx, "kepada: Rina (Tangani)", px + 116, y + 128, 22, { col: GREY, w: 600 });
      P(ctx, px + 30, y + 170, 330, 54, 12, RED, 0); T(ctx, "Peringatan terakhir", px + 195, y + 207, 28, { align: "center", col: "#FFF" });
      T(ctx, "Kiriman terlambat tiga kali bulan ini.", px + 30, y + 310, 38, { col: "#111827", fam: F2, w: 700 });
      const hA = tm(f, f.hlAt, 2), hk = clamp((t - hA) / .6, 0, 1); font(ctx, 700, 38, F2); const w1 = ctx.measureText("Dalam ").width, w2 = ctx.measureText("7 hari").width;
      if (hk > 0){ ctx.fillStyle = "rgba(246,195,67,.7)"; ctx.fillRect(px + 30 + w1 - 6, y + 372, (w2 + 12) * hk, 54); }
      T(ctx, "Dalam 7 hari kami pindah ke penyedia lain.", px + 30, y + 410, 38, { col: "#111827", fam: F2, w: 700 }); if (hk >= 1) ring(ctx, px + 30 + w1 + w2 / 2, y + 398, w2 / 2 + 40, 44, clamp((t - hA - .6) / .5, 0, 1), RED, 7);
      T(ctx, "Salam, Wijaya", px + 30, y + 510, 32, { col: "#374151", fam: F2, w: 600 }); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(f.at + .2), "notif", .9); add(g(tm(f, f.openAt, .8)), "click", .5); add(g(tm(f, f.hlAt, 2)), "dun", .8); } };

  // not musik naik dari kepala tokoh (siulan)
  FX.whistle = { layer: "screen", draw(ctx, f, t){ const an = S.anchors[f.who || "dodi"]; if (!an || an.frame !== S.frameId) return; if (t < f.at) return;
    for (let k = 0; k < 4; k++){ const u = ((t - f.at) * .7 + k / 4) % 1; ctx.save(); ctx.globalAlpha = Math.sin(u * Math.PI) * fin(t, f.at, .5); T(ctx, k % 2 ? "♪" : "♫", an.head[0] + (f.dx ?? 70) * an.face + Math.sin(u * 6 + k) * 20 + u * 60 * an.face, an.head[1] - 40 - u * 160, 54, { align: "center", col: YEL, stroke: OUT, sw: 8 }); ctx.restore(); } } };

  // gambar struk untuk chat16 (msgs[].img = "receipt")
  S.chatImg = S.chatImg || {};
  S.chatImg.receipt = (ctx, x, y, w, h, t) => { ctx.save(); rr(ctx, x, y, w, h, 6); ctx.clip(); ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, "#E9DCC8"], [1, "#C9B79A"]]); ctx.fillRect(x, y, w, h);
    ctx.translate(x + w / 2, y + h / 2); ctx.rotate(-.08); P(ctx, -w * .2, -h * .45, w * .4, h * .95, 3, "#FFFDF8", 2, "rgba(43,26,18,.3)"); S.drawLogo(ctx, 0, -h * .32, h * .14); T(ctx, "TOKO WIJAYA 12", 0, -h * .18, h * .065, { align: "center", col: BROWN });
    ctx.fillStyle = "rgba(43,26,18,.4)"; for (let i = 0; i < 5; i++) ctx.fillRect(-w * .15, -h * .08 + i * h * .08, w * (.2 + rnd(i) * .1), h * .025); T(ctx, "STRUK #0001", 0, h * .4, h * .06, { align: "center", col: RED }); ctx.restore(); };
})();
