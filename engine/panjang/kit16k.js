/* STORY16 kit K — tambahan untuk Kantor Tangani: Utang Bayu Eps 3 ("Penagih utang menelepon ke kantor, satu divisi jadi tahu"). Dimuat sesudah kit16j.js.
   Efek: billNote (catatan tagihan di ponsel Bayu; opsi rowsAt, per, markAt = baris "paling mepet" diberi tanda merah, chip),
         walletClose (dompet Rina terbuka dengan uang; closeAt = kancing ditutup),
         lunchBox (kotak nasi: tutup bergambar topi oranye tanpa nama; openAt = tutup digeser, chip),
         msgDraft (ponsel: ketik "Maaf. Aku masih marah." ke Rina, hapus per huruf; typeAt, delAt, offAt = layar mati),
         photoMsg (ponsel Dodi: foto tutup kotak dari Bayu, tanpa teks; msgAt, chip).
   S16.thumbs.utang3 = thumbnail (thumb16.py jenis "utang3"). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { FX, TAU, ORANGE, NAVY, BROWN, OUT, lerp, rnd, lg, fillAll } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", YEL = "#F6C343", GREY = "#9CA3AF";
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const typed = (txt, t, t0, cps) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((t - t0) * (cps || 14)))));
  const lidDoodle = (ctx, w, h) => { P(ctx, -w / 2, -h / 2, w, h, 18, "#F3E3C3", 6, OUT); ctx.save(); ctx.translate(0, 8); ctx.fillStyle = ORANGE; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, h * .3, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(h * .22, 2, h * .34, h * .07, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); };
  const BILLS = [["Pinjaman A", "Rp850 rb", "tgl 12"], ["Paylater B", "Rp1,1 jt", "tgl 14"], ["Kredit C", "Rp640 rb", "tgl 15"], ["Pinjaman D", "Rp720 rb", "tgl 16"], ["Paylater E", "Rp930 rb", "tgl 18"], ["Cicilan F", "Rp1,4 jt", "HARI INI"], ["Pinjaman G", "Rp560 rb", "tgl 20"]];

  /* ============================== CATATAN TAGIHAN ============================== */
  FX.billNote = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.04) * (1 + q * .014); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#E2A77C" }, f), z);
    ctx.fillStyle = "#FFF6C9"; ctx.fillRect(x, y, w, h); P(ctx, x, y, w, 100, 0, "#F2C94C", 0); T(ctx, "Catatan · Tagihan Juli", 0, y + 64, 30, { align: "center", col: "#5B4A12" });
    const r0 = tm(f, f.rowsAt, .3), per = f.per ?? .25, mA = tm(f, f.markAt);
    BILLS.forEach(([nm, am, dd], i) => { const by = y + 120 + i * 96, kk = fin(t, r0 + i * per, .3); if (kk <= 0) return; const hot = i === 5 && mA != null && t > mA;
      ctx.save(); ctx.globalAlpha = kk; ctx.translate((1 - kk) * 40, 0); ctx.strokeStyle = "rgba(91,74,18,.25)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 16, by + 84); ctx.lineTo(x + w - 16, by + 84); ctx.stroke();
      if (hot){ ctx.fillStyle = "rgba(217,72,59,.18)"; ctx.fillRect(x + 6, by + 2, w - 12, 80); }
      T(ctx, nm, x + 26, by + 40, 30, { col: hot ? RED : "#3B2A12", w: 800 }); T(ctx, am, x + 26, by + 74, 24, { col: "#6B5A2A", w: 600 }); T(ctx, dd, x + w - 26, by + 52, 28, { align: "right", col: hot ? RED : "#6B5A2A", w: 800 }); ctx.restore(); });
    if (mA != null && t > mA){ const k = fin(t, mA, .5); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = "round"; const by = y + 120 + 5 * 96; ctx.beginPath(); ctx.moveTo(x + 14, by + 76); ctx.lineTo(lerp(x + 14, x + w - 14, k), by + 76 - 4 * k); ctx.stroke(); ctx.restore(); }
    ctx.restore(); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 260, pop(t, tm(f, f.chipAt, 2.5), .4), f.chip, f.chipBg || RED, "#FFF", 40, .04); },
    sfx(f, g, add){ const r0 = tm(f, f.rowsAt, .3), per = f.per ?? .25; for (let i = 0; i < 7; i++) add(g(r0 + i * per), "pop", .25); if (f.markAt != null) add(g(tm(f, f.markAt)), "scribble", .5, .5); } };

  /* ============================== DOMPET RINA ============================== */
  FX.walletClose = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C9925F"], [1, "#8F6540"]])); U.motes(ctx, t, 18, 9, 0, 0, SW, SH, "#FFF3D6", .3);
    const cA = tm(f, f.closeAt), open = cA == null ? 1 : 1 - easeIO(fin(t, cA, .22)); ctx.save(); ctx.translate(960 + Math.sin(q * .9) * 18, 600 + Math.cos(q * .7) * 10); const z = 1 + q * .035 + (cA != null && t > cA && t < cA + .3 ? .04 * Math.sin((t - cA) / .3 * Math.PI) : 0); ctx.scale(z, z); ctx.rotate(-.04 + Math.sin(q * .8) * .015);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 260, 380, 34, 0, 0, TAU); ctx.fill();
    P(ctx, -340, -190, 680, 400, 34, "#5E3B22", 7, OUT); P(ctx, -316, -166, 632, 352, 24, "#2C1A0F", 0);
    [[-150, "#7FA563", -.12], [10, "#5E8A44", .02], [170, "#E0503A", .14]].forEach(([bx, col, rt], i) => { const rise = open * (50 + Math.sin(t * 2 + i) * 6); ctx.save(); ctx.translate(bx, -60 - rise); ctx.rotate(rt); P(ctx, -90, -110, 180, 240, 12, col, 5, OUT); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(-60, -70, 120, 30); ctx.beginPath(); ctx.arc(0, 20, 34, 0, TAU); ctx.fill(); ctx.restore(); });
    ctx.save(); ctx.translate(0, -190); ctx.scale(1, 1 - 2 * open); P(ctx, -340, 0, 680, 230, [0, 0, 34, 34], "#7A4A2A", 7, OUT); ctx.fillStyle = "#C8A04A"; ctx.beginPath(); ctx.arc(0, 200, 22, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 140, pop(t, tm(f, f.chipAt, cA != null ? cA - f.at + .4 : 2), .4), f.chip, f.chipBg || NAVY, "#FFF", 44, -.02); },
    sfx(f, g, add){ if (f.closeAt != null) add(g(tm(f, f.closeAt) + .15), "click", 1); } };

  /* ============================== KOTAK NASI TANPA NAMA ============================== */
  FX.lunchBox = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#D9B58A"], [1, "#B88A5A"]])); U.motes(ctx, t, 18, 9, 0, 0, SW, SH, "#FFF3D6", .3);
    const oA = tm(f, f.openAt), k = oA == null ? 0 : easeIO(fin(t, oA, .6)); ctx.save(); ctx.translate(960 + Math.sin(q * .9) * 18, 600 + Math.cos(q * .7) * 10); const z = 1 + q * .035; ctx.scale(z, z); ctx.rotate(Math.sin(q * .8) * .012);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 190, 420, 30, 0, 0, TAU); ctx.fill();
    P(ctx, -380, -40, 760, 230, 30, "#F2F2EE", 7, OUT); ctx.save(); ctx.beginPath(); ctx.roundRect(-366, -28, 732, 206, 22); ctx.clip(); ctx.fillStyle = "#FFFDF8"; ctx.beginPath(); ctx.ellipse(-120, 40, 200, 100, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#FFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(150, 100, 120, 66, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = YEL; ctx.beginPath(); ctx.ellipse(150, 100, 40, 32, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#9CCB7A"; ctx.beginPath(); ctx.ellipse(300, 120, 44, 44, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#CFE8B8"; ctx.beginPath(); ctx.ellipse(300, 120, 26, 26, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(k * 120, -k * 330 - (1 - k) * 0 - 100); ctx.rotate(k * .12); ctx.translate(0, 0); lidDoodle(ctx, 760, 150); ctx.restore();
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 150, pop(t, tm(f, f.chipAt, 1.6), .4), f.chip, f.chipBg || NAVY, "#FFF", 40, -.02); },
    sfx(f, g, add){ if (f.openAt != null) add(g(tm(f, f.openAt)), "click", .6); } };

  /* ============================== PESAN YANG DIHAPUS ============================== */
  FX.msgDraft = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.06) * (1 + q * .012); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ night: true, skin: "#D9A07A" }, f), z);
    ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h); S.chatHeader(ctx, x, y, w, "Rina", "terakhir dilihat 17.52", ORANGE, "R", null, t);
    const tA = tm(f, f.typeAt, .6), dA = tm(f, f.delAt), draft = f.draft || "Maaf. Aku masih marah."; let txt = ""; if (t > tA){ txt = typed(draft, t, tA, f.cps || 14); if (dA != null && t > dA) txt = draft.slice(0, Math.max(0, draft.length - Math.floor((t - dA) * (f.delCps || 14)))); }
    font(ctx, 600, 28, F2); const L = txt ? S.wrap(ctx, txt + (Math.sin(t * 8) > 0 ? "|" : " "), w - 170) : ["Ketik pesan…"], ih = Math.max(52, L.length * 36 + 16);
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + h - ih - 34, w, ih + 34); P(ctx, x + 16, y + h - ih - 18, w - 110, ih, 24, "#FFFFFF", 2, txt ? ORANGE : "#D1D5DB"); L.forEach((l, i) => T(ctx, l, x + 34, y + h - ih - 18 + 36 + i * 36, 28, { col: txt ? "#111827" : "#9CA3AF", w: 600, fam: F2 }));
    ctx.beginPath(); ctx.arc(x + w - 46, y + h - ih / 2 - 18, 30, 0, TAU); ctx.fillStyle = txt ? GREEN : GREY; ctx.fill(); T(ctx, "➤", x + w - 46, y + h - ih / 2 - 6, 30, { align: "center", col: "#FFF" });
    const oA = tm(f, f.offAt); if (oA != null && t > oA){ ctx.fillStyle = `rgba(8,8,12,${fin(t, oA, .35)})`; ctx.fillRect(x, y, w, h); }
    ctx.restore(); ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 260, pop(t, tm(f, f.chipAt, 2.5), .4), f.chip, f.chipBg || NAVY, "#FFF", 38, .04); } };

  /* ============================== FOTO TUTUP KOTAK DI PONSEL DODI ============================== */
  FX.photoMsg = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.06) * (1 + q * .012); let shake = 0; const mA = tm(f, f.msgAt, .5); if (t > mA && t < mA + .7) shake = Math.sin(t * 70) * 6 * (1 - (t - mA) / .7);
    ctx.save(); ctx.translate(shake, 0); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#C9926A" }, f), z);
    ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h); S.chatHeader(ctx, x, y, w, "Bayu", "online", NAVY, "B", null, t);
    const s = pop(t, mA, .4); if (s > 0){ ctx.save(); ctx.translate(x + 30, y + 160); ctx.scale(s, s); P(ctx, 0, 0, w - 90, 300, 22, "#FFFFFF", 3, "#D1D5DB"); ctx.save(); ctx.translate((w - 90) / 2, 150); ctx.scale(.52, .85); lidDoodle(ctx, 640, 270); ctx.restore(); T(ctx, "07.58", w - 108, 290, 18, { align: "right", col: "#9CA3AF", w: 700 }); ctx.restore(); }
    ctx.restore(); ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 260, pop(t, tm(f, f.chipAt, 2), .4), f.chip, f.chipBg || NAVY, "#FFF", 40, .04); },
    sfx(f, g, add){ add(g(tm(f, f.msgAt, .5)), "notif", .6); } };

  /* ============================== THUMBNAIL ============================== */
  S.thumbs = S.thumbs || {};
  S.thumbs.utang3 = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    const cam = S.makeCam(1000, 470, 1.05, 0, 0, 0, 0); S.LOC.kerja.bg(x, cam, 3.1, { time: 'pagi', clock: '09:07' });
    S.grade(x, { warm: .1, vig: .3 }); x.fillStyle = 'rgba(19,34,61,.38)'; x.fillRect(0, 0, 1920, 1080);
    x.save(); x.translate(400, 190); x.rotate(-.05); x.fillStyle = '#FFF'; x.beginPath(); x.roundRect(-290, -110, 580, 220, 28); x.fill(); x.fillStyle = '#D9483B'; x.beginPath(); x.arc(-205, 0, 52, 0, 7); x.fill();
    x.strokeStyle = '#FFF'; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); x.arc(-205, 8, 22, 3.6, 5.8); x.stroke();
    x.fillStyle = '#6B7280'; x.font = '700 30px Poppins'; x.textAlign = 'left'; x.fillText('Telepon masuk', -130, -22); x.fillStyle = '#13223D'; x.font = '800 62px Poppins'; x.fillText('Penagihan', -130, 48); x.restore();
    [[210, 450, '…penagihan?', -.06], [480, 560, 'psst…', .05]].forEach(([bx, by, tx, rt]) => { x.save(); x.translate(bx, by); x.rotate(rt); x.fillStyle = '#FFF1C9'; x.strokeStyle = '#3B2418'; x.lineWidth = 5; x.beginPath(); x.roundRect(-130, -40, 260, 80, 40); x.fill(); x.stroke(); x.fillStyle = '#5B3A1E'; x.font = '700 34px Poppins'; x.textAlign = 'center'; x.fillText(tx, 0, 12); x.restore(); });
    const put = (who, o, key, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: 1, seed: 3 }, look, o, { keys: [Object.assign({ at: 0 }, key)] }); const st = TT.toonState(a, null, t); st.talk = false; TT.drawToon(x, a, st, t); };
    put('bayu', { x: 560, y: 1760, size: 1240, face: 1, item: 'phone' }, { pose: 'phone', expr: 'laugh', look: 'cam' }, 5.25);
    return c.toDataURL('image/png').slice(22); };
})();
