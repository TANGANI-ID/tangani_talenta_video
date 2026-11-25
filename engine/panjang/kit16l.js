/* STORY16 kit L — tambahan untuk Kantor Tangani: Utang Bayu Eps 4 ("Terjerat 7 aplikasi paylater, begini Bayu bebas"). Dimuat sesudah kit16k.js.
   Efek: sevenSheet (kertas besar tujuh baris; writeAt, per, markAt = Cicilan F ditandai nomor 1, strikes = [[indeks, at]...], itemsAt = helm & jam di ujung meja, sellAt = helm & jam hilang/DIJUAL, chip),
         debtMontage (kalender JULI→OKTOBER + kertas tujuh baris dicoret satu per satu + ikon aplikasi berkurang; at, per, chipAt, chip),
         ojkSearch (laptop: direktori resmi, enam baris dicentang, cari "Pinjaman G"; rowsAt, per, typeAt, enterAt, emptyAt),
         reportSent (laptop: formulir laporan + cap LAPORAN TERKIRIM + balasan arahan; stampAt, replyAt),
         bonLunas (buku bon Bu Tini: 15 garis + cap LUNAS; stampAt).
   S16.thumbs.utang4 = thumbnail (thumb16.py jenis "utang4"). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { FX, TAU, ORANGE, NAVY, BROWN, OUT, lerp, lg, fillAll } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", YEL = "#F6C343", GREY = "#9CA3AF", INK = "#1F4E8C";
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const typed = (txt, t, t0, cps) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((t - t0) * (cps || 14)))));
  const NAMES = ["Pinjaman A", "Paylater B", "Kredit C", "Pinjaman D", "Paylater E", "Cicilan F", "Pinjaman G"], COLS = ["#5B7DB1", "#D9483B", "#2F6F73", "#8E4A24", "#9B7BC4", "#C2691F", "#6B7280"];

  // helm & jam (ujung meja)
  const helm = (ctx, x, y, k) => { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = "#2F6F73"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 90, Math.PI, 0); ctx.lineTo(90, 36); ctx.lineTo(-90, 36); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#E8F1F2"; ctx.beginPath(); ctx.roundRect(10, -20, 90, 44, 14); ctx.fill(); ctx.stroke(); ctx.restore(); };
  const jam = (ctx, x, y, k) => { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = "#6B7280"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.fillRect(-26, -90, 52, 180); ctx.strokeRect(-26, -90, 52, 180);
    ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fill(); ctx.stroke(); ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -34); ctx.moveTo(0, 0); ctx.lineTo(26, 12); ctx.stroke(); ctx.restore(); };

  // kertas tujuh baris; o = { wt: waktu tulis tiap baris [t0, per], marks: indeks ditandai, strikes: [[idx, at]], rows: jumlah baris tampil }
  const sheet = (ctx, x, y, w, h, t, o) => { ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, x, y, w, h, 8, "#FFFEF8", 0); ctx.restore(); P(ctx, x, y, w, h, 8, "#FFFEF8", 5, OUT);
    ctx.strokeStyle = "rgba(217,72,59,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 90, y); ctx.lineTo(x + 90, y + h); ctx.stroke();
    const rh = (h - 130) / 7; T(ctx, o.title || "UTANG BAYU · JULI", x + w / 2, y + 74, 44, { align: "center", col: BROWN, w: 800, fam: F2 });
    NAMES.forEach((nm, i) => { const ry = y + 120 + i * rh, wt = o.wt ? o.wt[0] + i * o.wt[1] : -99; if (t < wt) return; const txt = o.instant ? nm : typed(nm, t, wt, 16); const st = (o.strikes || []).find(s => s[0] === i), k = st ? fin(t, st[1], .5) : 0;
      ctx.strokeStyle = "rgba(31,78,140,.2)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 20, ry + rh - 8); ctx.lineTo(x + w - 20, ry + rh - 8); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 48, ry + rh / 2 - 6, 22, 0, TAU); ctx.fillStyle = COLS[i]; ctx.fill(); T(ctx, String(i + 1), x + 48, ry + rh / 2 + 4, 26, { align: "center", col: "#FFF", w: 800 });
      T(ctx, txt, x + 130, ry + rh / 2 + 8, 48, { col: k > 0 ? "#8B8B8B" : INK, fam: F2, w: 800 });
      if (o.marks && o.marks.includes(i) && t > (o.markAt ?? 0)){ const m = pop(t, o.markAt ?? 0, .4); ctx.save(); ctx.translate(x + w - 110, ry + rh / 2 - 6); ctx.scale(m, m); ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = YEL; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, "1", 0, 14, 42, { align: "center", col: NAVY, w: 800 }); ctx.restore(); }
      if (k > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 110, ry + rh / 2 + 2); ctx.lineTo(lerp(x + 110, x + w - 150, k), ry + rh / 2 - 4 * k); ctx.stroke(); if (k >= 1) T(ctx, "LUNAS", x + w - 100, ry + rh / 2 + 10, 28, { align: "center", col: GREEN, w: 800 }); } }); };

  FX.sevenSheet = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#D7BE9A"], [1, "#B79970"]])); U.motes(ctx, t, 16, 9, 0, 0, SW, SH, "#FFF3D6", .25);
    const z = 1 + q * .018; ctx.save(); ctx.translate(960 + Math.sin(q * .8) * 12, 540 + Math.cos(q * .6) * 8); ctx.scale(z, z); ctx.rotate(-.015 + Math.sin(q * .7) * .008);
    const iA = tm(f, f.itemsAt, 0), sA = tm(f, f.sellAt), sk = sA != null ? 1 - fin(t, sA, .5) : 1;
    sheet(ctx, -600, -420, 1060, 860, t, { wt: [tm(f, f.writeAt, .4), f.per ?? .45], strikes: (f.strikes || []).map(([i, a]) => [i, tm(f, a)]), marks: f.mark == null ? null : [f.mark], markAt: tm(f, f.markAt), title: f.title });
    if (f.itemsAt != null && sk > 0){ const s = pop(t, iA, .4) * sk; if (s > 0){ helm(ctx, 640, -120, s); jam(ctx, 640, 190, s); } }
    if (sA != null && t > sA){ chip(ctx, 640, 20, pop(t, sA + .2, .4), "DIJUAL", GREEN, "#FFF", 44, -.06); }
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 120, pop(t, tm(f, f.chipAt, 1.6), .4), f.chip, f.chipBg || NAVY, "#FFF", 40, -.02); },
    sfx(f, g, add){ const w0 = tm(f, f.writeAt, .4); for (let i = 0; i < 7; i++) add(g(w0 + i * (f.per ?? .45)), "scribble", .3, .4); (f.strikes || []).forEach(s => add(g(tm(f, s[1])), "scribble", .5, .5)); } };

  FX.debtMontage = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, per = f.per ?? 2.7, MON = ["JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER"], STR = [[], [[5, 0]], [[5, 0], [1, 0], [0, 0]], [[5, 0], [1, 0], [0, 0], [2, 0], [3, 0], [4, 0]]];
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#D7BE9A"], [1, "#B79970"]])); U.motes(ctx, t, 16, 9, 0, 0, SW, SH, "#FFF3D6", .25);
    ctx.save(); { const zz = 1 + q * .006 + Math.sin(q * .5) * .012; ctx.translate(960 + Math.sin(q * .7) * 22, 540 + Math.cos(q * .55) * 14); ctx.scale(zz, zz); ctx.rotate(Math.sin(q * .4) * .008); ctx.translate(-960, -540); }
    const ms = [f.at].concat([0, 1, 2].map(i => f.flips ? tm(f, f.flips[i]) : f.at + (i + 1) * per)); let mi = 0; ms.forEach((m, i) => { if (t >= m) mi = i; }); const lq = t - ms[mi], flip = mi > 0 && lq < .55 ? lq / .55 : 1;
    // lembar kalender
    const calPage = (i, dy, rot, a) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(430, 470 + dy); ctx.rotate(rot); P(ctx, -250, -330, 500, 640, 22, "#FFFDF8", 7, OUT); P(ctx, -250, -330, 500, 150, [22, 22, 0, 0], RED, 0); T(ctx, MON[i], 0, -226, 62, { align: "center", col: "#FFF", track: 4 });
      T(ctx, String(i === 0 ? 14 : 1), 0, 170, 160, { align: "center", col: BROWN }); ctx.restore(); };
    calPage(mi, 0, -.02, 1); if (mi > 0 && flip < 1){ const e = flip * flip; calPage(mi - 1, e * 520, -.02 + e * .5, 1 - e); }
    // kertas
    const strikes = STR[mi].map(([i], n) => [i, mi === 0 ? 1e9 : ms[mi] + .5 + n * .25]);
    sheet(ctx, 760, 150, 960, 720, t, { instant: true, strikes, title: "UTANG BAYU" });
    // ikon aplikasi
    for (let i = 0; i < 7; i++){ const st = strikes.find(s => s[0] === i), k = st ? fin(t, st[1] + .3, .5) : 0, a = 1 - k; if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; ctx.translate(800 + i * 130, 940); ctx.scale(1 - k * .4, 1 - k * .4); P(ctx, -42, -42, 84, 84, 20, COLS[i], 5, OUT); T(ctx, "ABCDEFG"[i], 0, 14, 40, { align: "center", col: "#FFF", w: 800 }); ctx.restore(); }
    ctx.restore(); chip(ctx, 960, 90, pop(t, tm(f, f.chipAt, ms[3] - f.at + .8), .4), f.chip || "JULI: 7 BARIS · OKTOBER: BARIS TERAKHIR", NAVY, YEL, 38, -.01); },
    sfx(f, g, add){ const per = f.per ?? 2.7, ms = [f.at].concat([0, 1, 2].map(i => f.flips ? tm(f, f.flips[i]) : f.at + (i + 1) * per)); for (let m = 1; m < 4; m++) add(g(ms[m]), "whoosh", .4); [[1, 1], [2, 3], [3, 6]].forEach(([m, n]) => { for (let k = 0; k < n; k++) add(g(ms[m] + .5 + k * .25), "scribble", .3, .4); }); } };

  FX.ojkSearch = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Direktori resmi", clock: "13:05" }, f)), q = t - f.at;
    ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#13223D"; ctx.fillRect(x, y, w, 64); T(ctx, "ojk.go.id · Daftar Penyelenggara Berizin", x + 28, y + 42, 28, { col: "#FFF", w: 700 });
    const r0 = tm(f, f.rowsAt, .3), per = f.per ?? .4; ["Pinjaman A", "Paylater B", "Kredit C", "Pinjaman D", "Paylater E", "Cicilan F"].forEach((nm, i) => { const k = pop(t, r0 + i * per, .3); if (k <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, k); const ry = y + 90 + i * 66;
      P(ctx, x + 20, ry, w - 40, 56, 12, "#FFFFFF", 2, "#D1D5DB"); T(ctx, nm, x + 44, ry + 38, 28, { col: "#1F2937", w: 700 }); T(ctx, "terdaftar · berizin", x + w - 150, ry + 36, 22, { align: "right", col: GREY, w: 600 });
      ctx.beginPath(); ctx.arc(x + w - 66, ry + 28, 20, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); T(ctx, "✓", x + w - 66, ry + 38, 28, { align: "center", col: "#FFF", w: 800 }); ctx.restore(); });
    const tA = tm(f, f.typeAt, 2.6), eA = tm(f, f.enterAt), mA = tm(f, f.emptyAt), sy = y + h - 190; P(ctx, x + 20, sy, w - 40, 64, 32, "#FFFFFF", 3, t > tA ? NAVY : "#D1D5DB");
    const tx = typed("Pinjaman G", t, tA, 9); T(ctx, tx ? tx + (Math.sin(t * 8) > 0 && !(eA != null && t > eA) ? "|" : "") : "Cari nama perusahaan / aplikasi…", x + 56, sy + 44, 28, { col: tx ? "#111827" : GREY, w: 600 });
    if (eA != null && t > eA){ if (mA == null || t < mA){ const a = (t - eA) * 6; ctx.strokeStyle = NAVY; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(x + w / 2, sy + 110, 22, a, a + 4.2); ctx.stroke(); } else { const s = pop(t, mA, .4); ctx.save(); ctx.translate(x + w / 2, sy + 108); ctx.scale(s, s); P(ctx, -w / 2 + 40, -34, w - 80, 70, 14, "#FDECEA", 4, RED); T(ctx, "0 hasil · tidak ditemukan di daftar berizin", 0, 10, 28, { align: "center", col: RED, w: 800 }); ctx.restore(); } }
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 220, pop(t, tm(f, f.chipAt, 3), .4), f.chip, f.chipBg || RED, "#FFF", 40, .04); },
    sfx(f, g, add){ const r0 = tm(f, f.rowsAt, .3); for (let i = 0; i < 6; i++) add(g(r0 + i * (f.per ?? .4)), "pop", .25); if (f.emptyAt != null) add(g(tm(f, f.emptyAt)), "dun", .6); } };

  FX.reportSent = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Lapor · saluran resmi", clock: "13:22" }, f)), q = t - f.at;
    ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#13223D"; ctx.fillRect(x, y, w, 64); T(ctx, "Lapor aktivitas pinjaman tidak berizin", x + 28, y + 42, 28, { col: "#FFF", w: 700 });
    [["Nama aplikasi", "Pinjaman G"], ["Kejadian", "Menelepon resepsionis kantor, bukan Bayu"], ["Bukti", "catatan panggilan terlampir"]].forEach(([a, b], i) => { const ry = y + 96 + i * 100; T(ctx, a, x + 40, ry + 22, 22, { col: GREY, w: 700 }); P(ctx, x + 40, ry + 34, w - 80, 48, 10, "#FFFFFF", 2, "#D1D5DB"); T(ctx, b, x + 58, ry + 68, 24, { col: "#1F2937", w: 600 }); });
    const sA = tm(f, f.stampAt, 1.2), rA = tm(f, f.replyAt, 3.2);
    if (t > rA){ const s = pop(t, rA, .4); ctx.save(); ctx.globalAlpha = Math.min(1, s); P(ctx, x + 40, y + 420, w - 80, 150, 14, "#FFFBEA", 3, YEL); T(ctx, "Arahan dari balasan:", x + 64, y + 462, 24, { col: BROWN, w: 800 }); ["Simpan bukti panggilan", "Jangan tambah pinjaman baru", "Ikuti arahan petugas"].forEach((l, i) => T(ctx, "• " + l, x + 70, y + 496 + i * 30, 24, { col: "#1F2937", w: 600 })); ctx.restore(); }
    if (t > sA){ const s = pop(t, sA, .35); ctx.save(); ctx.translate(x + w / 2, y + h / 2 - 20); ctx.rotate(-.12); ctx.scale(1.6 - .6 * Math.min(1, s), 1.6 - .6 * Math.min(1, s)); ctx.globalAlpha = Math.min(1, s * 1.5); ctx.strokeStyle = GREEN; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-290, -62, 580, 124, 20); ctx.stroke(); T(ctx, "LAPORAN TERKIRIM", 0, 24, 66, { align: "center", col: GREEN, w: 800 }); ctx.restore(); }
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 220, pop(t, tm(f, f.chipAt, 4), .4), f.chip, f.chipBg || NAVY, "#FFF", 38, .04); },
    sfx(f, g, add){ add(g(tm(f, f.stampAt, 1.2)), "click", 1); } };

  FX.bonLunas = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#B5643C"], [1, "#8E4E2E"]]));
    const z = 1 + q * .02; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.03 + Math.sin(t * .7) * .01); ctx.translate(-960 + Math.sin(t * .9) * 16, -540 + Math.sin(t * 1.2) * 10);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 420, 60, 1080, 960, 14, "#8E4A24", 0); ctx.restore(); P(ctx, 420, 60, 1080, 960, 14, "#8E4A24", 6, OUT); P(ctx, 450, 90, 1020, 900, 6, "#FFF6DE", 0);
    ctx.strokeStyle = "rgba(217,72,59,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(540, 90); ctx.lineTo(540, 990); ctx.stroke(); T(ctx, "BUKU BON · WARUNG BU TINI", 960, 190, 46, { align: "center", col: BROWN, fam: F2, w: 800 });
    T(ctx, "BAYU:", 580, 420, 60, { col: RED, fam: F2, w: 800 }); T(ctx, "15 KOPI", 1440, 420, 64, { align: "right", col: RED, fam: F2, w: 800 });
    const sA = tm(f, f.stampAt, 1.6); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = "round";
    for (let i = 0; i < 15; i++){ const grp = Math.floor(i / 5), r = i % 5, gx = 600 + grp * 250; ctx.beginPath(); if (r < 4){ const x = gx + r * 40; ctx.moveTo(x, 470); ctx.lineTo(x, 600); } else { ctx.moveTo(gx - 16, 590); ctx.lineTo(gx + 150, 480); } ctx.stroke(); }
    if (t > sA){ const s = pop(t, sA, .3); ctx.save(); ctx.translate(960, 760); ctx.rotate(-.1); const k = 1.5 - .5 * Math.min(1, s); ctx.scale(k, k); ctx.globalAlpha = Math.min(1, s * 1.5); ctx.strokeStyle = GREEN; ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(-250, -90, 500, 180, 24); ctx.stroke(); T(ctx, "LUNAS", 0, 44, 130, { align: "center", col: GREEN, w: 800, fam: F2 }); ctx.restore(); }
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1600, f.chipY ?? 180, pop(t, tm(f, f.chipAt, 2.4), .4), f.chip, f.chipBg || GREEN, "#FFF", 36); },
    sfx(f, g, add){ add(g(tm(f, f.stampAt, 1.6)), "click", 1); } };

  S.thumbs = S.thumbs || {};
  S.thumbs.utang4 = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    const cam = S.makeCam(1000, 470, 1.05, 0, 0, 0, 0); S.LOC.kerja.bg(x, cam, 3.1, { time: 'pagi', clock: '09:07' });
    S.grade(x, { warm: .14, vig: .3 }); x.fillStyle = 'rgba(19,34,61,.34)'; x.fillRect(0, 0, 1920, 1080);
    x.save(); x.translate(250, 560); x.rotate(-.07); sheet(x, -230, -430, 500, 820, 99, { instant: true, strikes: [0, 1, 2, 3, 4, 5].map(i => [i, 0]), title: "UTANG BAYU" }); x.restore();
    const put = (who, o, key, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: 1, seed: 3 }, look, o, { keys: [Object.assign({ at: 0 }, key)] }); const st = TT.toonState(a, null, t); st.talk = false; TT.drawToon(x, a, st, t); };
    put('bayu', { x: 640, y: 1760, size: 1240, face: 1, item: 'thumb' }, { pose: 'thumbs', expr: 'happy', look: 'cam' }, 5.25);
    return c.toDataURL('image/png').slice(22); };
})();
