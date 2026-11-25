/* STORY16 kit KP — tambahan untuk Kelas Produktif Eps 1 ("Sibuk Seharian Tapi Tidak Ada yang Selesai? Atur Prioritas Begini"). Dimuat sesudah kit16i.js.
   Lokasi lama, opsi tambahan (tanpa opsi = sama seperti sebelumnya):
             tokoluar: rahma = true → papan "TOKO BU RAHMA" + lencana "BARU" (tanpa "12"), balloons = true → balon di kiri-kanan pintu.
             tokobaru: rahma = true → papan "TOKO BU RAHMA", lencana "BARU", tulisan jendela "BUKA HARI INI".
   Properti: galon (galon air di lantai; opsi s), hand_galon (galon di tangan), phoneDesk (ponsel di meja; opsi buzz 0..1, down 0|1 = terbalik, s), tomatoTimer (pengatur waktu bentuk tomat; opsi s, run 0..1, ring),
             weekBoard (papan jadwal pasang minggu ini; opsi done 0..5 = jumlah baris hijau berurutan, kontinu).
   Efek    : titleKP (catatan fiksi + kartu judul "KELAS PRODUKTIF · EPS n"; opsi hook, eps, topic),
             matrix4 (papan 4 kotak penting/mendesak; mode board = papan tulis + catatan tempel [{text, col, at, to, pickAt, moveAt, fallAt}], opsi drawAt, drawDur,
                      fillAt+per (waktu muncul otomatis), hl [{q, at, out}], cont (lanjutan insert sebelumnya: tanpa animasi gambar garis), title;
                      mode card = kartu alat 4 kotak, items [{q, at, ex}]),
             matrixMini (matriks kecil di pojok; opsi x, y, s),
             chatTower (gulir riwayat chat → menara 147 balon + file jadwal kecil di dasar; opsi zoomAt, zoomDur, fileAt, hudAt),
             jadwalFile (laptop: file "Jadwal Kirim & Pasang Minggu Ini"; opsi rows [waktu], fillAt+per, blink, covers [{at, name, text, col}], 
                         sendAt, clkFrom/clkTo/clkAt/clkDur (jam di layar), waAt/waN/waSteps [{at, v}] (ikon WhatsApp + jumlah), chip),
             msgCount (penghitung "PESAN DIBALAS" bertahap: steps [{at, v}]),
             tabsLaptop (laptop dengan 14 tab + bilah kemajuan 20%; opsi hours),
   Chat    : S.chatImg.rahma (foto Bu Rahma di kasir memegang struk).
   S16.thumbs.kp1 = gambar thumbnail (tools/panjang/thumb16.py jenis "kp1").
   Waktu: angka = relatif terhadap f.at; objek {cue}/{at} (juga di dalam larik) = waktu lokal adegan (lihat tm()). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343", GREY = "#9CA3AF";
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const typed = (str, t, t0, cps) => str.slice(0, Math.max(0, Math.floor((t - t0) * (cps || 22))));
  const push = (ctx, f, t, k, cx, cy) => { const z = 1 + Math.max(0, t - f.at) * (f.push ?? k ?? .012); ctx.translate(cx ?? 960, cy ?? 540); ctx.scale(z, z); ctx.rotate(Math.sin(t * .6) * .005); ctx.translate(-(cx ?? 960), -(cy ?? 540)); };
  const hp = fn => (ctx, x, y, k, f, t, sp) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); try { fn(ctx, t, sp); } finally { ctx.restore(); } };
  const bgDark = (ctx, t) => { fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]])); U.motes(ctx, t, 24, 3, 0, 0, SW, SH, "#9FB9E8", .3); };
  const bgWood = (ctx, t) => { fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C9925F"], [1, "#9E6A40"]])); ctx.fillStyle = "rgba(59,36,24,.12)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, 120 * k + 40, SW, 4); U.motes(ctx, t, 20, 9, 0, 0, SW, SH, "#FFF3D6", .3); };
  const STICKY = [YEL, "#F4A85C", "#9FD3E0", "#F7B6C2", "#BFE3A8"];

  /* ============================== KARTU JUDUL: KELAS PRODUKTIF ============================== */
  FX.titleKP = { layer: "screen", draw(ctx, f, t){
    const d1 = f.disc ?? 2.2;
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]]));
    for (let i = 0; i < 16; i++){ const x = rnd(i + 3) * 2200 - 140 + Math.sin(t * .9 + i) * 160, y = rnd(i + 8) * 1200 - 60 + Math.cos(t * .7 + i) * 110, r = 80 + rnd(i) * 200;
      ctx.fillStyle = `rgba(194,105,31,${.05 + rnd(i + 2) * .08})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    U.motes(ctx, t, 40, 17, 0, 0, SW, SH, "#F6D9AE", .5);
    if (t < d1 + .3){ const a = fin(t, .15, .35) * (1 - fin(t, d1, .3));
      ctx.save(); ctx.globalAlpha = a; const zz = 1 + t * .05; ctx.translate(960, 540); ctx.scale(zz, zz); ctx.translate(-960, -540); P(ctx, 560, 470, 800, 140, 20, "rgba(255,246,234,.08)", 2, "rgba(255,246,234,.35)");
      T(ctx, "Cerita fiksi.", 960, 530, 40, { align: "center", col: "#FFF6EA" }); T(ctx, "Tokoh dan kejadian dalam cerita ini rekaan.", 960, 580, 30, { align: "center", col: "#C9D4E8", w: 600 }); ctx.restore(); return; }
    const q = t - d1;
    const sx = 960 + Math.sin(q * .9) * 520; ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = lg(ctx, 0, 0, 0, SH, [[0, "rgba(255,226,170,.16)"], [1, "rgba(255,226,170,0)"]]); ctx.beginPath(); ctx.moveTo(sx - 60, -50); ctx.lineTo(sx + 60, -50); ctx.lineTo(sx + 300, SH); ctx.lineTo(sx - 300, SH); ctx.fill(); ctx.restore();
    // dua matriks 4 kotak melayang di kiri-kanan (kotak "penting + mendesak" menyala)
    [[250, 700, -.08], [1670, 700, .08]].forEach(([mx, my, rot], i) => { const s = pop(t, d1 + 1.2 + i * .2, .5); if (s <= 0) return; ctx.save(); ctx.translate(mx, my + Math.sin(t * 1.3 + i * 2) * 12); ctx.rotate(rot + Math.sin(t * .8 + i) * .02); ctx.scale(s, s); if (f.deco === "tomato"){ ctx.translate(0, 120); PROP.tomatoTimer(ctx, { s: 1.5, run: 0 }, t); } else miniMatrix(ctx, 0, 0, 1.15, t, i); ctx.restore(); });
    const lq = pop(t, d1 + .1, .5); ctx.save(); ctx.translate(960, 200); ctx.scale(lq, lq); ctx.beginPath(); ctx.arc(0, 0, 74, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.stroke(); S.drawLogo(ctx, 0, 0, 104); ctx.restore();
    const a2 = fin(t, d1 + .35, .3); ctx.save(); ctx.globalAlpha = a2; T(ctx, "TANGANI TALENTA", 960, 322, 30, { align: "center", col: "#F6D9AE", track: 8 }); ctx.restore();
    const s1 = pop(t, d1 + .6, .45); ctx.save(); ctx.translate(960, 440); ctx.scale(s1, s1); ctx.rotate(-.02);
    T(ctx, "KELAS PRODUKTIF", 0, 0, 108, { align: "center", col: "#FFFFFF", stroke: "#0B1426", sw: 16 }); ctx.restore();
    const s2 = pop(t, d1 + 1.0, .45); ctx.save(); ctx.translate(960, 548); ctx.scale(s2, s2);
    const epsL = f.eps || "EPS 1"; font(ctx, 800, 52, F); const tw = ctx.measureText(epsL).width + 90; P(ctx, -tw / 2, -50, tw, 78, 39, ORANGE, 5, OUT); T(ctx, epsL, 0, 8, 52, { align: "center", col: "#FFF6EA" }); ctx.restore();
    const a3 = fin(t, d1 + 1.6, .4); ctx.save(); ctx.globalAlpha = a3; ctx.translate(0, (1 - a3) * 20); font(ctx, 800, 56, F);
    const HL = S.wrap(ctx, f.hook || "Sibuk Seharian Tapi Tidak Ada yang Selesai? Atur Prioritas Begini", 1260); HL.slice(0, 2).forEach((l, i) => T(ctx, l, 960, 668 + i * 70, 56, { align: "center", col: "#FFFFFF" })); ctx.restore();
    const m = pop(t, d1 + 2.3, .4); ctx.save(); ctx.translate(960, 884); ctx.scale(m, m); font(ctx, 800, 40, F); const mw = ctx.measureText(f.topic || "WAKTU & PRIORITAS").width + 90;
    P(ctx, -mw / 2, -42, mw, 84, 16, "#FFF6EA", 5, OUT); P(ctx, -mw / 2, -42, 24, 84, [16, 0, 0, 16], ORANGE, 0); T(ctx, f.topic || "WAKTU & PRIORITAS", 12, 14, 40, { align: "center", col: BROWN, track: 4 }); ctx.restore();
  }, sfx(f, g, add){ add(g(f.at || 0) + (f.disc ?? 2.2), "stinger", 1); } };

  // matriks mini 2x2 (kotak kiri atas menyala)
  function miniMatrix(ctx, x, y, s, t, ph){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); P(ctx, -118, -118, 236, 236, 22, "#FBFBF8", 6, OUT);
    const cols = ["rgba(217,72,59,.35)", "rgba(59,163,107,.3)", "rgba(246,195,67,.4)", "rgba(107,114,128,.28)"];
    for (let q = 0; q < 4; q++){ const c = q % 2, r = q >> 1; ctx.fillStyle = q === 0 ? hexA(ORANGE, .55 + .3 * Math.sin(t * 3 + (ph || 0))) : cols[q]; rr(ctx, -106 + c * 108, -106 + r * 108, 100, 100, 10); ctx.fill(); }
    ctx.strokeStyle = NAVY; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -108); ctx.lineTo(0, 108); ctx.moveTo(-108, 0); ctx.lineTo(108, 0); ctx.stroke();
    ctx.fillStyle = "#FFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); starShape(ctx, -57, -57, 26); ctx.fill(); ctx.stroke(); ctx.restore(); }
  const starShape = (ctx, x, y, r) => S.starShape(ctx, x, y, r);
  FX.matrixMini = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .45), out = f.out ?? 1e9; if (s <= 0 || t > out + .3) return; ctx.save(); ctx.globalAlpha = 1 - fin(t, out, .3); ctx.translate(f.x ?? 250, f.y ?? 250); ctx.rotate(-.05); ctx.scale(s * (f.s || 1), s * (f.s || 1)); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10;
    miniMatrix(ctx, 0, 0, 1, t, 0); ctx.restore(); }, sfx(f, g, add){ add(g(f.at), "pop", .5); } };

  /* ============================== MATRIKS 4 KOTAK ============================== */
  const MX = { BX: 150, BY: 122, BW: 1620, BH: 820, LX: 120, TY: 72 };
  MX.GX = MX.BX + MX.LX; MX.GY = MX.BY + MX.TY; MX.QW = (MX.BW - MX.LX) / 2; MX.QH = (MX.BH - MX.TY) / 2;
  const qxy = q => [MX.GX + (q % 2) * MX.QW, MX.GY + (q >> 1) * MX.QH];
  const QT = [["KERJAKAN SEKARANG", "Penting + Mendesak", RED, "rgba(217,72,59,.17)"], ["JADWALKAN · PAKAI JAM", "Penting + Tidak mendesak", GREEN, "rgba(59,163,107,.2)"],
              ["SERAHKAN / BALAS SINGKAT", "Tidak penting + Mendesak", "#B8860B", "rgba(246,195,67,.28)"], ["HAPUS", "Tidak penting + Tidak mendesak", "#6B7280", "rgba(107,114,128,.18)"]];
  const slot = (q, k) => { const [qx, qy] = qxy(q); return [qx + 100 + (k % 4) * 160 + (rnd(k * 3 + q) - .5) * 26, qy + 88 + (Math.floor(k / 4) % 3) * 100 + (rnd(k * 5 + q + 1) - .5) * 20]; };
  function stickyNote(ctx, x, y, s, rot, txt, col, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); const w = o.w || 140, h = o.h || 96, sz = o.size || 21;
    ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 6; P(ctx, -w / 2, -h / 2, w, h, 3, col, 0); ctx.shadowColor = "transparent";
    P(ctx, -w / 2, -h / 2, w, h, 3, col, o.hl ? 5 : 1.5, o.hl ? ORANGE : "rgba(59,36,24,.28)"); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(-w / 2, -h / 2, w, 14);
    font(ctx, 800, sz, F); const L = S.wrap(ctx, txt, w - 20).slice(0, 3); L.forEach((l, i) => T(ctx, l, 0, (L.length > 2 ? -10 : L.length > 1 ? -2 : 8) + i * (sz + 4), sz, { align: "center", col: BROWN })); ctx.restore(); }
  FX.matrix4 = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, card = f.mode === "card", cont = !!f.cont;
    if (card) bgDark(ctx, t); else { fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#D9CDB8"], [1, "#B9A98E"]])); U.motes(ctx, t, 16, 9, 0, 0, SW, SH, "#FFF3D6", .3); }
    ctx.save(); push(ctx, f, t, f.push ?? .008, 960, 540);
    const s = cont ? 1 : pop(t, f.at, .45); ctx.translate(960, 540); ctx.scale(s, s); ctx.translate(-960, -540);
    // papan
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 36; ctx.shadowOffsetY = 18; P(ctx, MX.BX - 16, MX.BY - 16, MX.BW + 32, MX.BH + 32, 30, "#9AA3AE", 0); ctx.restore();
    P(ctx, MX.BX - 16, MX.BY - 16, MX.BW + 32, MX.BH + 32, 30, "#9AA3AE", 7, OUT); P(ctx, MX.BX, MX.BY, MX.BW, MX.BH, 20, "#FBFBF8", 0);
    const dA = tm(f, f.drawAt, .3), dk = (card || cont || f.noDraw) ? 1 : easeIO(clamp((t - dA) / (f.drawDur ?? 2.4), 0, 1)), seg = (a, b) => clamp((dk - a) / (b - a), 0, 1);
    const la = clamp((dk - .72) / .28, 0, 1);
    // warna kotak (muncul sesudah garis)
    if (!card && f.tint !== false) for (let k = 0; k < 4; k++){ const [qx, qy] = qxy(k); ctx.fillStyle = QT[k][3].replace(/[\d.]+\)$/, v => (parseFloat(v) * la) + ")"); ctx.fillRect(qx + 5, qy + 5, MX.QW - 10, MX.QH - 10); }
    // garis spidol
    ctx.strokeStyle = NAVY; ctx.lineCap = "round"; const L = (x0, y0, x1, y1, k, lw) => { if (k <= 0) return; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, k), lerp(y0, y1, k)); ctx.stroke(); };
    L(MX.GX + MX.QW, MX.BY + 16, MX.GX + MX.QW, MX.BY + MX.BH - 16, seg(0, .4), 10); L(MX.BX + 16, MX.GY + MX.QH, MX.BX + MX.BW - 16, MX.GY + MX.QH, seg(.3, .7), 10);
    L(MX.GX, MX.BY + 16, MX.GX, MX.BY + MX.BH - 16, seg(.6, .85), 6); L(MX.BX + 16, MX.GY, MX.BX + MX.BW - 16, MX.GY, seg(.7, 1), 6);
    // label sumbu
    ctx.save(); ctx.globalAlpha = la; T(ctx, "MENDESAK", MX.GX + MX.QW / 2, MX.BY + 50, 38, { align: "center", col: NAVY, track: 3 }); T(ctx, "TIDAK MENDESAK", MX.GX + MX.QW * 1.5, MX.BY + 50, 38, { align: "center", col: NAVY, track: 3 });
    [["PENTING", 0], ["TIDAK PENTING", 1]].forEach(([l, r]) => { ctx.save(); ctx.translate(MX.BX + 62, MX.GY + MX.QH * (r + .5)); ctx.rotate(-Math.PI / 2); T(ctx, l, 0, 12, 38, { align: "center", col: NAVY, track: 3 }); ctx.restore(); }); ctx.restore();
    // sorotan kotak (oranye, berdenyut)
    (f.hl || []).forEach(h => { const a0 = tm(f, h.at), a1 = h.out != null ? tm(f, h.out) : 1e9; if (a0 == null || t < a0 || t > a1 + .3) return; const k = fin(t, a0, .25) * (1 - fin(t, a1, .3)), [qx, qy] = qxy(h.q);
      ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = `rgba(194,105,31,${.14 + .06 * Math.sin(t * 6)})`; ctx.fillRect(qx + 5, qy + 5, MX.QW - 10, MX.QH - 10); ctx.strokeStyle = ORANGE; ctx.lineWidth = 12; rr(ctx, qx + 8, qy + 8, MX.QW - 16, MX.QH - 16, 14); ctx.stroke(); ctx.restore(); });
    if (card){ const items = f.items || []; items.forEach((it, i) => { const a0 = tm(f, it.at), nxt = items[i + 1] ? tm(f, items[i + 1].at) : 1e9; if (a0 == null || t < a0) return; const qd = it.q ?? i, [qx, qy] = qxy(qd), [tt, sub, col, tint] = QT[qd], k = Math.min(1, pop(t, a0, .4)), act = t < nxt ? 1 : 0;
        ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = tint; ctx.fillRect(qx + 5, qy + 5, MX.QW - 10, MX.QH - 10);
        if (act){ ctx.strokeStyle = ORANGE; ctx.lineWidth = 12; rr(ctx, qx + 8, qy + 8, MX.QW - 16, MX.QH - 16, 14); ctx.stroke(); }
        ctx.beginPath(); ctx.arc(qx + 76, qy + 84, 46, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, String(qd + 1), qx + 76, qy + 106, 60, { align: "center", col: "#FFF" });
        T(ctx, tt, qx + 146, qy + 78, 42, { col: NAVY, maxW: MX.QW - 180 }); T(ctx, sub, qx + 146, qy + 122, 28, { col: "#4B5563", w: 700, maxW: MX.QW - 180 });
        if (it.ex){ const ek = easeIO(fin(t, a0 + .8, .6)); if (ek > 0){ const ex = lerp(qx - 380, qx + MX.QW / 2, ek), ey = qy + MX.QH - 100; stickyNote(ctx, ex, ey, 1.05, lerp(-.3, .02, ek), it.ex, STICKY[qd % 5], { w: 560, h: 108, size: 28 }); } }
        ctx.restore(); }); }
    else { // catatan tempel
      const notes = f.notes || [], cnt = {}, fa = tm(f, f.fillAt, .5), per = f.per ?? .12, info = notes.map((n, i) => { const dq = n.to ?? -1; let k = 0; if (dq >= 0){ cnt[dq] = (cnt[dq] ?? -1) + 1; k = cnt[dq]; }
        const at = n.at != null ? tm(f, n.at) : fa + i * per; return { n, i, at, A: slot(0, i), D: dq >= 0 ? slot(dq, k) : null, col: n.col || STICKY[(i * 2 + 1) % 5] }; });
      const CX = 960, CY = 560, drawN = x => { const { n, i, at, A, D, col } = x; if (t < at) return; const sc0 = Math.min(1.1, pop(t, at, .3)); let X = A[0], Y = A[1], sc = 1, rot = (rnd(i + 11) - .5) * .22;
        const kp = n.pickAt != null ? easeIO(fin(t, tm(f, n.pickAt), .5)) : 0, km = n.moveAt != null && D ? easeIO(fin(t, tm(f, n.moveAt), .8)) : 0;
        if (kp > 0){ X = lerp(A[0], CX, kp); Y = lerp(A[1], CY, kp); sc = lerp(1, 2.4, kp); rot *= 1 - kp; }
        if (km > 0){ const fx = kp > 0 ? CX : A[0], fy = kp > 0 ? CY : A[1]; X = lerp(fx, D[0], km); Y = lerp(fy, D[1], km) - (kp > 0 ? 0 : Math.sin(km * Math.PI) * 50); sc = lerp(kp > 0 ? 2.4 : 1, .92, km); rot = lerp(kp > 0 ? 0 : rot, (rnd(i + 19) - .5) * .2, km); }
        if (n.fallAt != null){ const dt = t - tm(f, n.fallAt); if (dt > 0){ if (dt > 1.3) return; Y += 1500 * dt * dt; X += dt * (rnd(i) > .5 ? 160 : -160); rot += dt * 3; } }
        stickyNote(ctx, X, Y + Math.sin(t * 1.5 + i) * 1.2, sc * sc0, rot, n.text, col, { hl: kp > 0 && km < 1 }); };
      const late = x => (x.n.pickAt != null && t >= tm(f, x.n.pickAt) && (x.n.moveAt == null || t < tm(f, x.n.moveAt) + .8)) || (x.n.moveAt != null && t >= tm(f, x.n.moveAt) && t < tm(f, x.n.moveAt) + .8);
      info.filter(x => !late(x)).forEach(drawN); info.filter(late).forEach(drawN); }
    ctx.restore();
    if (f.title) chip(ctx, 960, 62, pop(t, tm(f, f.titleAt, .3), .4), f.title, NAVY, YEL, 34, -.01);
    if (f.chip) chip(ctx, f.chipX ?? 1540, f.chipY ?? 1020, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || ORANGE, "#FFF", 38, .03);
  }, sfx(f, g, add){ if (f.quiet) return; if (f.mode === "card"){ (f.items || []).forEach(it => { add(g(tm(f, it.at)), "stamp", .6); if (it.ex) add(g(tm(f, it.at)) + .8, "whoosh", .4); }); return; }
      if (!f.cont && !f.noDraw) add(g(tm(f, f.drawAt, .3)), "typing", .35, f.drawDur ?? 2.4);
      const notes = f.notes || [], fa = tm(f, f.fillAt, .5), per = f.per ?? .12; notes.forEach((n, i) => { if (n.at != null || f.fillAt != null){ const at = n.at != null ? tm(f, n.at) : fa + i * per; if (i < 14 || n.at != null) add(g(at), "pop", .28); } if (n.moveAt != null) add(g(tm(f, n.moveAt)), "whoosh", .35); if (n.fallAt != null) add(g(tm(f, n.fallAt)), "thud", .4); }); } };

  /* ============================== MENARA CHAT (adegan 8) ============================== */
  const TW = [["Siap!", 1], ["Foto kardusnya dong", 0], ["Siap, Bos!", 1], ["Galon siapa yang angkat?", 0], ["Meluncur!", 1], ["Fakturnya mana, Mas?", 0], ["Oke, sebentar", 1], ["Data bulan lalu ya", 0], ["Noted", 1], ["wkwk", 0],
              ["Sudah ya", 1], ["Ditunggu ya Kak", 0], ["Boleh minta tolong?", 0], ["Siap, aku cek", 1], ["Terima kasih!", 0], ["Kirim lokasinya", 0]];
  FX.chatTower = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, N = f.n ?? 147, H = 112, TOP = 560, zA = f.zoomAt ?? 6.5, zD = f.zoomDur ?? 5.5, sEnd = f.sEnd ?? .062, e = easeIO(clamp((q - zA) / zD, 0, 1));
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#12203A"], [1, "#060B16"]])); U.motes(ctx, t, 30, 3, 0, 0, SW, SH, "#9FB9E8", .2);
    const cyEnd = -(SH * .43) / sEnd + 40, cyA = lerp(-1500, -(N * H) * .7, clamp(q / zA, 0, 1)) , cyB = lerp(-(N * H) * .7, cyEnd, e), cy = q < zA ? cyA : cyB;
    const s = q < zA ? 1 : Math.exp(lerp(0, Math.log(sEnd), e) - .22 * clamp((q - zA - zD * .8) / 4, 0, 1)); const wy2s = wy => 540 + (wy - cy) * s;
    ctx.save(); ctx.translate(960, 540); ctx.scale(s, s); ctx.translate(0, -cy);
    // lantai
    ctx.fillStyle = "#1E2A44"; ctx.fillRect(-4000, 0, 8000, 600); ctx.fillStyle = ORANGE; ctx.fillRect(-4000, -6, 8000, 12 / Math.max(s, .2));
    const i0 = Math.max(0, Math.floor((-(cy + 540 / s) - TOP) / H) - 1), i1 = Math.min(N - 1, Math.ceil((-(cy - 540 / s) - TOP) / H) + 1);
    for (let i = i0; i <= i1; i++){ const [txt, me] = TW[i % TW.length], wy = -TOP - (i + 1) * H, w = 380 + rnd(i * 3 + 1) * 380, wob = me ? 1 : -1, bx = me ? 470 - w : -470, by = wy + 12;
      const hl = f.hlN != null && i === f.hlN ? 1 : 0; ctx.fillStyle = me ? "#DCF5E6" : "#FFFFFF"; rr(ctx, bx, by, w, H - 26, 30); ctx.fill(); if (s < .5){ ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 3 / s; ctx.stroke(); }
      if (s > .3) T(ctx, txt, bx + w / 2, by + (H - 26) / 2 + 14, 40, { align: "center", col: "#111827", w: 600, fam: F2, maxW: w - 50 });
      if (s > .3 && i % 5 === 0) T(ctx, `${8 + Math.floor(i / 22)}.${String((i * 7) % 60).padStart(2, "0")}`, bx + w - 16, by + H - 34, 20, { align: "right", col: GREY, w: 700 }); }
    // file jadwal kecil di dasar
    ctx.save(); ctx.translate(0, -230); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 20 / Math.max(s, .1); P(ctx, -360, -230, 720, 460, 24, "#FFFFFF", 0); ctx.shadowColor = "transparent"; P(ctx, -360, -230, 720, 460, 24, "#FFFFFF", 8 / Math.max(s, .3), OUT);
    P(ctx, -360, -230, 720, 84, [24, 24, 0, 0], "#1E7B4A", 0); T(ctx, "Jadwal Kirim & Pasang Minggu Ini", 0, -172, 40, { align: "center", col: "#FFF" });
    ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 3; for (let r = 0; r < 6; r++){ ctx.beginPath(); ctx.moveTo(-340, -130 + r * 62); ctx.lineTo(340, -130 + r * 62); ctx.stroke(); } T(ctx, "Sen · Toko Bu Rahma · 08.00", -330, -76 + 4, 34, { col: "#111827", w: 600, fam: F2 }); ctx.restore();
    ctx.restore();
    // cincin + label di file (koordinat layar)
    const fA = tm(f, f.fileAt, zA + zD * .55), rk = fin(t, fA, .6); if (rk > 0){ const fx = 960, fy = wy2s(-230); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.globalAlpha = rk; ctx.beginPath(); ctx.ellipse(fx, fy, 70 + 6 * Math.sin(t * 5), 48 + 4 * Math.sin(t * 5), 0, 0, TAU * rk); ctx.stroke(); ctx.restore();
      chip(ctx, fx + 360, fy - 70, pop(t, fA + .3, .4), "JADWAL KIRIM · 1 BARIS", RED, "#FFF", 38, -.03);
      ctx.save(); ctx.globalAlpha = rk; ctx.strokeStyle = "#FFF"; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(fx + 150, fy - 52); ctx.lineTo(fx + 90, fy - 16); ctx.stroke(); ctx.restore(); }
    // penghitung
    const hA = tm(f, f.hudAt, .4); const hs = pop(t, hA, .4); if (hs > 0){ ctx.save(); ctx.translate(250, 130); ctx.scale(hs, hs); P(ctx, -190, -64, 380, 128, 22, NAVY, 6, OUT); T(ctx, "PESAN DIBALAS", 0, -14, 28, { align: "center", col: "#A9BCDD", track: 3 });
      const v = q < zA ? Math.round(lerp(40, N, clamp(q / zA, 0, 1))) : N; T(ctx, String(v), 0, 44, 62, { align: "center", col: v >= N ? "#FFB4A8" : "#FFFFFF" }); ctx.restore(); }
  }, sfx(f, g, add){ add(g(f.at), "tick", .35, 5.5); add(g(f.at), "rise", .4, f.zoomAt ?? 6.5); add(g(tm(f, f.fileAt, (f.zoomAt ?? 6.5) + (f.zoomDur ?? 5.5) * .55) + .3), "dun", .8); } };

  /* ============================== LAPTOP: FILE JADWAL ============================== */
  const ROWS = [["Sen", "Toko Bu Rahma · mesin kasir", "08.00", "Pak Joko"], ["Sen", "Toko Maju Jaya · printer", "10.30", "Pak Joko"], ["Sel", "Toko Sumber Rejeki · pemindai", "09.00", "Mas Rizal"], ["Sel", "Warung Bu Tati · mesin kasir", "13.00", "Mas Rizal"],
                ["Rab", "Toko Arga Mart · printer", "08.30", "Pak Joko"], ["Rab", "Toko Sinar Baru · pemindai", "11.00", "Mas Dani"], ["Kam", "Toko Berkah · mesin kasir", "09.30", "Mas Dani"], ["Kam", "Minimarket Karya · printer", "14.00", "Mas Rizal"],
                ["Jum", "Toko Mawar · mesin kasir", "08.00", "Pak Joko"], ["Jum", "Toko Lancar Jaya · pemindai", "10.00", "Mas Dani"]];
  const CHATP = [["Nisa", "Kak, minta foto kardus printer ya", "#D9483B"], ["Grup Kantor", "Galon siapa yang angkat?", "#2F6F73"], ["Vendor Kurir", "Mas, fakturnya sudah?", "#5B7DB1"], ["Tim Pemasaran", "Data pemasangan bulan lalu dong", "#C2691F"], ["Alumni Kantor Lama", "[stiker] hahaha", "#6E2430"], ["Grup Operasional", "Siap Bayu mana nih?", "#3BA36B"]];
  function waIcon(ctx, x, y, s, n, bump){ ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + bump * .18), s * (1 + bump * .18)); P(ctx, -64, -64, 128, 128, 30, "#2BB458", 6, OUT);
    ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, -4, 36, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-26, 26); ctx.lineTo(-40, 50); ctx.lineTo(-8, 38); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#2BB458"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-4, -4, 22, 2.6, 5.6); ctx.stroke();
    if (n != null){ font(ctx, 800, 40, F); const bw = Math.max(64, ctx.measureText(String(n)).width + 36); P(ctx, 62 - bw / 2 + 6, -96, bw, 58, 29, RED, 5, "#FFF"); T(ctx, String(n), 62 + 6, -54, 40, { align: "center", col: "#FFF" }); } ctx.restore(); }
  FX.jadwalFile = { layer: "screen", draw(ctx, f, t){
    ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Tangani Kantor · Berkas Operasional" }, f, { clock: null })), q = t - f.at;
    if (f.clkTo != null){ const k = clamp((t - tm(f, f.clkAt, 0)) / (f.clkDur || 6), 0, 1), mn = lerp(f.clkFrom, f.clkTo, k), hh = Math.floor(mn / 60), mm = Math.floor(mn % 60); T(ctx, `${String(hh).padStart(2, "0")}.${String(mm).padStart(2, "0")}`, 1620, 127, 30, { align: "right", col: "#F6D9AE" }); }
    else if (f.clock){ T(ctx, String(f.clock).replace(":", "."), 1620, 127, 30, { align: "right", col: "#F6D9AE" }); }
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); const blink = f.blink ? .5 + .5 * Math.sin(q * 3.4) : 0;
    ctx.fillStyle = "#1E7B4A"; ctx.fillRect(x, y, w, 64); T(ctx, "Jadwal Kirim & Pasang Minggu Ini.xlsx", x + 30, y + 43, 32, { col: "#FFF" });
    if (f.blink){ ctx.save(); ctx.globalAlpha = blink * (1 - fin(t, tm(f, f.coverFrom, 1.4), .6)); ctx.strokeStyle = ORANGE; ctx.lineWidth = 12; ctx.strokeRect(x + 6, y + 6, w - 12, h - 12); ctx.restore(); }
    const cw = [150, 600, 260, 378], hx = [x, x + 150, x + 750, x + 1010], HY = y + 64, RH = 62; ctx.fillStyle = "#E8EEE9"; ctx.fillRect(x, HY, w, 60);
    ["HARI", "TOKO · BARANG", "JAM", "TEKNISI"].forEach((l, i) => T(ctx, l, hx[i] + 22, HY + 40, 26, { col: "#374151", track: 2 }));
    const fa = tm(f, f.fillAt), rows = f.rows ? f.rows.map(r => tm(f, r)) : (fa != null ? ROWS.map((_, i) => fa + i * (f.per ?? .5)) : []);
    ctx.strokeStyle = "#D8DEE5"; ctx.lineWidth = 2; for (let r = 0; r <= 10; r++){ ctx.beginPath(); ctx.moveTo(x, HY + 60 + r * RH); ctx.lineTo(x + w, HY + 60 + r * RH); ctx.stroke(); } hx.slice(1).forEach(px => { ctx.beginPath(); ctx.moveTo(px, HY); ctx.lineTo(px, HY + 60 + 10 * RH); ctx.stroke(); });
    let nv = 0; rows.forEach((ra, i) => { if (t < ra || i > 9) return; nv++; const k = fin(t, ra, .35), ry = HY + 60 + i * RH; ctx.save(); ctx.beginPath(); ctx.rect(x, ry, w, RH); ctx.clip(); ctx.globalAlpha = k; if (f.sendAt != null && t > tm(f, f.sendAt)){ ctx.fillStyle = "rgba(59,163,107,.1)"; ctx.fillRect(x, ry, w, RH); }
      ROWS[i].forEach((c, j) => T(ctx, c, hx[j] + 22, ry + 42, 28, { col: "#111827", w: j === 1 ? 700 : 600, fam: F2, maxW: cw[j] - 40 })); ctx.restore(); });
    if (nv === 0){ const cx0 = x + 150, cy0 = HY + 60; ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; if (Math.sin(q * 6) > -.3) ctx.strokeRect(cx0 + 2, cy0 + 2, cw[1] - 4, RH - 4); T(ctx, f.emptyText || "Belum ada jadwal minggu ini", x + w / 2, y + h / 2 + 120, 44, { align: "center", col: "#9CA3AF", w: 700 }); }
    // tombol kirim + kursor
    const sA = tm(f, f.sendAt); if (sA != null){ const bx = x + w - 420, by = y + 8, hot = t > sA - .3 && t < sA + .15; P(ctx, bx, by, 390, 48, 24, hot ? "#F6C343" : "#FFF6EA", 3, OUT); T(ctx, "Kirim ke Dodi & teknisi", bx + 195, by + 33, 25, { align: "center", col: BROWN });
      if (t < sA + .5) S.cursor(ctx, lerp(x + w - 900, bx + 180, easeIO(clamp((t - (sA - 1)) / .8, 0, 1))), lerp(y + 400, by + 18, easeIO(clamp((t - (sA - 1)) / .8, 0, 1))), t > sA - .3); }
    // jendela chat yang menutupi
    const cov = f.covers || []; cov.forEach((c, i) => { const ca = tm(f, c.at); if (ca == null) return; const s = pop(t, ca, .3); if (s <= 0) return; const [nm, tx, col] = CHATP[i % CHATP.length]; const px = x + 60 + ((i * 337) % 760), py = y + 150 + ((i * 197) % 420);
      ctx.save(); ctx.translate(px + 270, py + 62); ctx.scale(Math.min(1.05, s), Math.min(1.05, s)); ctx.rotate(((i % 3) - 1) * .03); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; P(ctx, -300, -66, 600, 132, 18, "#FFFFFF", 0); ctx.shadowColor = "transparent"; P(ctx, -300, -66, 600, 132, 18, "#FFFFFF", 3, "#D1D5DB");
      ctx.beginPath(); ctx.arc(-244, 0, 38, 0, TAU); ctx.fillStyle = c.col || col; ctx.fill(); T(ctx, (c.name || nm)[0], -244, 14, 40, { align: "center", col: "#FFF" }); T(ctx, c.name || nm, -190, -14, 26, { col: "#13223D", maxW: 470 }); T(ctx, c.text || tx, -190, 30, 26, { col: "#374151", w: 600, fam: F2, maxW: 480 }); ctx.restore(); });
    // ikon WhatsApp + jumlah
    if (f.waN !== undefined || f.waAt != null){ const wA = tm(f, f.waAt, .6), ws = pop(t, wA, .5); if (ws > 0){ const steps = f.waSteps || []; let n = f.waN ?? null, bump = 0; steps.forEach(st => { const sa = tm(f, st.at); if (t >= sa){ n = st.v; bump = Math.max(bump, Math.max(0, 1 - (t - sa) / .4)); } });
        waIcon(ctx, x + w - 110, y + h - 120, ws * 1.15, n, bump); } }
    ctx.restore(); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1480, f.chipY ?? 200, pop(t, tm(f, f.chipAt, 1.5), .4), f.chip, f.chipBg || RED, "#FFF", 40, .04);
    const sA2 = tm(f, f.sendAt); if (sA2 != null && t > sA2 + .15){ const k = pop(t, sA2 + .15, .45); ctx.save(); ctx.translate(960, 560); ctx.scale(k, k); ctx.rotate(-.03); P(ctx, -330, -90, 660, 180, 30, GREEN, 8, OUT); T(ctx, "TERKIRIM ✓", 0, 14, 76, { align: "center", col: "#FFF" }); T(ctx, f.sentTo || "Dodi · Pak Joko · Mas Rizal · Mas Dani", 0, 64, 26, { align: "center", col: "#DDF3E6", w: 700 }); ctx.restore(); }
  }, sfx(f, g, add){ (f.rows || []).forEach(r => add(g(tm(f, r)), "typing", .4, .8)); if (f.fillAt != null) add(g(tm(f, f.fillAt)), "typing", .45, (f.per ?? .5) * 10); (f.covers || []).forEach(c => add(g(tm(f, c.at)), "notif", .6));
      if (f.sendAt != null){ add(g(tm(f, f.sendAt)), "click", .8); add(g(tm(f, f.sendAt)) + .2, "send", .8); add(g(tm(f, f.sendAt)) + .4, "chime", .6); } (f.waSteps || []).forEach(st => add(g(tm(f, st.at)), "notif", .4)); } };

  /* ============================== PENGHITUNG PESAN DIBALAS ============================== */
  FX.msgCount = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .4), out = f.out ?? 1e9; if (s <= 0 || t > out + .3) return; const st = (f.steps || []).map(x => ({ at: tm(f, x.at), v: x.v })).sort((a, b) => a.at - b.at);
    let v = f.from ?? 0, bump = 0; st.forEach((x, i) => { const p0 = i ? st[i - 1].v : (f.from ?? 0); if (t >= x.at){ const k = easeIO(clamp((t - x.at) / .9, 0, 1)); v = lerp(p0, x.v, k); bump = Math.max(bump, Math.max(0, 1 - (t - x.at) / .35)); } });
    const n = Math.round(v), hot = clamp(n / 147, 0, 1);
    ctx.save(); ctx.globalAlpha = 1 - fin(t, out, .3); ctx.translate(f.x ?? 1560, f.y ?? 210); ctx.scale(s * (1 + bump * .12), s * (1 + bump * .12)); P(ctx, -250, -86, 500, 172, 26, NAVY, 6, OUT); T(ctx, f.label || "PESAN DIBALAS", 0, -28, 30, { align: "center", col: "#A9BCDD", track: 3 });
    T(ctx, String(n), 0, 58, 92, { align: "center", col: hot > .66 ? "#FFB4A8" : hot > .3 ? "#F6C343" : "#FFFFFF" }); ctx.restore(); },
    sfx(f, g, add){ (f.steps || []).forEach(x => add(g(tm(f, x.at)), "notif", .5)); } };

  /* ============================== LAPTOP: 14 TAB + 20% ============================== */
  const TABS = ["Rekap tiket", "Video lucu", "Chat tim", "Berita", "Toko daring", "Email", "Chat grup", "Meme", "Resep", "Drive", "Medsos", "Video musik", "Kalender", "Catatan"];
  FX.tabsLaptop = { layer: "screen", draw(ctx, f, t){
    ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Browser · Rekap Tiket Minggu Ini" }, f, { clock: null })), q = t - f.at;
    const hA = f.from ?? 9 * 60, hB = f.to ?? 12 * 60, k = easeIO(clamp((q - .6) / (f.dur ?? 6), 0, 1)), mn = lerp(hA, hB, k);
    T(ctx, `${String(Math.floor(mn / 60)).padStart(2, "0")}.${String(Math.floor(mn % 60)).padStart(2, "0")}`, 1620, 127, 30, { align: "right", col: "#F6D9AE" });
    ctx.fillStyle = "#E5E7EB"; ctx.fillRect(x, y, w, 70); const tw = Math.min(150, (w - 20) / TABS.length);
    TABS.forEach((nm, i) => { const ta = pop(t, f.at + .2 + i * .1, .3); if (ta <= 0) return; const tx = x + 10 + i * tw; ctx.save(); ctx.globalAlpha = Math.min(1, ta); P(ctx, tx, y + 14, tw - 4, 56, [12, 12, 0, 0], i === 0 ? "#FFFFFF" : "#CBD1D8", 2, "#9CA3AF"); T(ctx, nm, tx + 10, y + 50, 18, { col: "#374151", w: 700, maxW: tw - 24 }); ctx.restore(); });
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y + 70, w, h - 70); T(ctx, "Rekap tiket minggu ini", x + 60, y + 170, 52, { col: NAVY });
    const prog = clamp(k * (f.pct ?? .2), 0, 1), bx = x + 60, by = y + 240, bw = w - 120; P(ctx, bx, by, bw, 56, 28, "#E5E7EB", 3, "#D1D5DB"); if (prog > .01) P(ctx, bx, by, Math.max(56, bw * prog), 56, 28, ORANGE, 0);
    T(ctx, `${Math.round(prog * 100)}%`, bx + bw + 0, by + 128, 70, { align: "right", col: prog > .15 ? ORANGE : NAVY });
    for (let r = 0; r < 7; r++){ const done = r < Math.round(prog * 7 * 1.2); ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x + 60, y + 400 + r * 58, w - 120, 46); ctx.fillStyle = done ? GREEN : "#D1D5DB"; ctx.fillRect(x + 72, y + 410 + r * 58, 26, 26); T(ctx, `Tiket #${1042 + r} · ${["Kasir macet", "Printer error", "Lupa kata sandi", "Struk buram", "Stok tidak cocok", "Laporan kosong", "Koneksi putus"][r]}`, x + 120, y + 435 + r * 58, 26, { col: done ? "#6B7280" : "#111827", w: 600, fam: F2 }); }
    // notifikasi mengganggu
    [[.8, "Chat tim · 3 pesan baru", x + w - 560, y + 120], [2.4, "Video lucu · 2,1 jt tayangan", x + w - 620, y + 180], [4.0, "Toko daring · diskon 70%", x + w - 580, y + 240]].forEach(([d, tx, nx, ny], i) => { const s = pop(t, f.at + d, .35); if (s <= 0) return; const fo = 1 - fin(t, f.at + d + 2.2, .3); ctx.save(); ctx.globalAlpha = fo; ctx.translate(nx + 260, ny + 30); ctx.scale(s, s); P(ctx, -260, -30, 520, 60, 14, NAVY, 3, OUT); T(ctx, tx, 0, 8, 24, { align: "center", col: "#FFF", maxW: 480 }); ctx.restore(); });
    ctx.restore(); ctx.restore();
    chip(ctx, f.chipX ?? 1480, f.chipY ?? 190, pop(t, tm(f, f.chipAt, 2), .4), f.chip || "3 JAM · BARU 20%", RED, "#FFF", 42, .04);
  }, sfx(f, g, add){ for (let i = 0; i < 14; i += 3) add(g(f.at + .2 + i * .1), "pop", .3); add(g(f.at + .8), "notif", .5); add(g(f.at + 2.4), "notif", .5); add(g(tm(f, f.chipAt, 2)), "dun", .7); } };

  // ponsel di meja: layar menghadap atas (buzz) atau terbalik (down = 1, tampak punggung ponsel); s = skala (0 = hilang)
  PROP.phoneDesk = (ctx, o, t) => { const s = o.s ?? 1; if (s <= .02) return; ctx.save(); ctx.scale(s, s);
    if (!o.down){ PROP.phoneLying(ctx, o, t); ctx.restore(); return; }
    ctx.fillStyle = "rgba(20,12,6,.3)"; ctx.beginPath(); ctx.ellipse(0, 6, 120, 12, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.transform(1, 0, -.35, 1, 0, 0); P(ctx, -90, -34, 180, 40, 10, "#1E1A18", 4); P(ctx, -82, -30, 164, 32, 6, "#4A4458", 0); ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(-58, -20, 9, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(-30, -26, 90, 5); ctx.restore(); ctx.restore(); };

  /* ============================== PROPERTI ============================== */
  function galonArt(ctx, o){ o = o || {}; ctx.save(); ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 4, 90, 12, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-72, -20); ctx.quadraticCurveTo(-82, -60, -76, -180); ctx.quadraticCurveTo(-76, -250, -34, -280); ctx.lineTo(-30, -310); ctx.lineTo(30, -310); ctx.lineTo(34, -280); ctx.quadraticCurveTo(76, -250, 76, -180); ctx.quadraticCurveTo(82, -60, 72, -20); ctx.quadraticCurveTo(0, 4, -72, -20); ctx.closePath();
    ctx.fillStyle = "rgba(120,190,235,.82)"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.beginPath(); ctx.ellipse(-44, -150, 10, 70, .06, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(60,130,200,.55)"; ctx.fillRect(-74, -70, 150, 110 - 40); 
    P(ctx, -42, -150, 84, 62, 8, "#FFFFFF", 3, "#4B7BB0"); T(ctx, "AIR", 0, -106, 32, { align: "center", col: "#2B5C94", w: 800 });
    P(ctx, -36, -330, 72, 28, 8, "#2B5C94", 5); P(ctx, -60, -306, 120, 12, 5, "#2B5C94", 4);
    if (o.handle !== false){ ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(70, -200, 24, -1.3, 1.3); ctx.stroke(); }
    ctx.restore(); }
  PROP.galon = (ctx, o, t) => { ctx.save(); ctx.scale(o.s || 1, o.s || 1); galonArt(ctx); ctx.restore(); };
  PROP.hand_galon = hp(ctx => { ctx.rotate(-.05); ctx.translate(2, 9); ctx.scale(.12, .12); galonArt(ctx, { handle: false }); });
  PROP.tomatoTimer = (ctx, o, t) => { const s = o.s || 1, run = o.run ?? 1, sh = o.ring ? Math.sin(t * 60) * 3 : 0; ctx.save(); ctx.scale(s, s); ctx.translate(sh, 0);
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 4, 90, 12, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -76, 92, 78, 0, 0, TAU); ctx.fillStyle = "#E0402F"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.ellipse(-40, -110, 22, 34, .5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3E7D4F"; for (let i = 0; i < 5; i++){ ctx.save(); ctx.translate(0, -150); ctx.rotate(-1.2 + i * .6); ctx.beginPath(); ctx.ellipse(0, -16, 12, 30, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); }
    P(ctx, -50, -108, 100, 52, 10, "#1E1A18", 4); ctx.fillStyle = "#BFE2EA"; rr(ctx, -44, -102, 88, 40, 6); ctx.fill(); const secs = Math.round(25 * 60 - (t * 3 % 60) * run); T(ctx, run ? `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}` : "25:00", 0, -72, 34, { align: "center", col: "#13223D", w: 800, fam: "'Courier New'" });
    ctx.restore(); };
  PROP.weekBoard = (ctx, o, t) => { const d = o.done ?? 5, names = [["Sen", "Toko Bu Rahma"], ["Sel", "Toko Sumber Rejeki"], ["Rab", "Toko Arga Mart"], ["Kam", "Toko Berkah"], ["Jum", "Toko Mawar"]]; ctx.save(); ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 10; [-210, 210].forEach(x => { ctx.beginPath(); ctx.moveTo(x, -360); ctx.lineTo(x * 1.1, 0); ctx.stroke(); });
    P(ctx, -260, -700, 520, 400, 12, "#FBFCFB", 7, "#6E7782"); P(ctx, -260, -700, 520, 62, [12, 12, 0, 0], NAVY, 0); T(ctx, "JADWAL PASANG · MINGGU INI", 0, -656, 26, { align: "center", col: "#FFF", track: 1 });
    names.forEach(([hr, nm], i) => { const ry = -620 + i * 60, g = clamp(d - i, 0, 1); ctx.fillStyle = hexA(GREEN, .15 + .55 * g); ctx.fillRect(-244, ry, 488, 52); T(ctx, hr, -228, ry + 36, 26, { col: NAVY }); T(ctx, nm, -150, ry + 36, 26, { col: "#111827", w: 700, fam: F2 });
      if (g > 0){ ctx.save(); ctx.translate(200, ry + 26); ctx.scale(g, g); ctx.strokeStyle = GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-18, 2); ctx.lineTo(-4, 16); ctx.lineTo(20, -14); ctx.stroke(); ctx.restore(); } });
    ctx.restore(); };

  /* ============================== LOKASI: papan toko Bu Rahma ============================== */
  const balloons = (ctx, x, y, t, seed) => { [[-30, -150, "#E0503A"], [30, -190, YEL], [70, -130, "#5B7DB1"], [-80, -110, "#F7B6C2"], [10, -90, "#7FA563"]].forEach(([dx, dy, col], i) => { const sw = Math.sin(t * 1.3 + i + seed) * 8;
    ctx.strokeStyle = "rgba(59,36,24,.6)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + dx * .4 + sw, y + dy * .5, x + dx + sw, y + dy + 30); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x + dx + sw, y + dy, 34, 42, sw * .01, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.beginPath(); ctx.ellipse(x + dx + sw - 10, y + dy - 14, 8, 14, .4, 0, TAU); ctx.fill(); }); };
  const tokoluarBg = LOC.tokoluar.bg;
  LOC.tokoluar.bg = (ctx, c, t, o, sh, A) => { tokoluarBg(ctx, c, t, o, sh, A); if (!o.rahma && !o.balloons) return;
    layer(ctx, c, .7, () => { if (o.rahma){ P(ctx, 420, 30, 1080, 140, 16, NAVY, 6); ctx.beginPath(); ctx.arc(520, 100, 50, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, 520, 100, 72); T(ctx, "TOKO BU RAHMA", 960, 126, 70, { align: "center", col: "#FFF", track: 4 }); P(ctx, 1330, 50, 140, 96, 14, ORANGE, 5, OUT); T(ctx, "BARU", 1400, 116, 42, { align: "center", col: "#FFF" }); }
      if (o.balloons){ balloons(ctx, 150, 770, t, 1); balloons(ctx, 1850, 770, t, 4); } }); };
  const tokobaruBg = LOC.tokobaru.bg;
  LOC.tokobaru.bg = (ctx, c, t, o, sh, A) => { tokobaruBg(ctx, c, t, o, sh, A); if (!o.rahma) return;
    layer(ctx, c, .35, () => { P(ctx, 520, -40, 860, 150, 16, NAVY, 6); ctx.beginPath(); ctx.arc(610, 35, 52, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, 610, 35, 74); T(ctx, "TOKO BU RAHMA", 960, 62, 64, { align: "center", col: "#FFF", track: 3 }); P(ctx, 1250, -10, 100, 90, 14, ORANGE, 5, OUT); T(ctx, "BARU", 1300, 54, 34, { align: "center", col: "#FFF" });
      ctx.save(); ctx.translate(0, 300); ctx.rotate(-.04); P(ctx, -150, -40, 300, 80, 10, "#FFFDF8", 4); T(ctx, "BUKA HARI INI", 0, 12, 26, { align: "center", col: RED }); ctx.restore(); }); };

  /* ============================== FOTO CHAT: Bu Rahma di kasir ============================== */
  S.chatImg = S.chatImg || {};
  S.chatImg.rahma = (ctx, x, y, w, h, t) => { ctx.save(); rr(ctx, x, y, w, h, 8); ctx.clip(); ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, "#F5F0E7"], [1, "#E4DACB"]]); ctx.fillRect(x, y, w, h);
    ctx.fillStyle = ORANGE; ctx.fillRect(x, y + h * .2, w, h * .05); ctx.fillStyle = "#FFFDF8"; ctx.fillRect(x, y + h * .78, w, h * .22); ctx.fillStyle = "#3B3A40"; ctx.fillRect(x, y + h * .76, w, h * .03);
    const a = Object.assign({ x: x + w * .4, y: y + h * 1.75, size: h * 2.05, face: 1, seed: 5 }, S.cast.rahma ? (S.cast.rahma.look || S.cast.rahma) : {}, { keys: [{ at: 0, pose: "hold", expr: "laugh", look: "cam" }] }); const st = TT.toonState(a, null, 4); st.talk = false; TT.drawToon(ctx, a, st, 4);
    ctx.save(); ctx.translate(x + w * .72, y + h * .5); ctx.rotate(.14); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-w * .07, -h * .24, w * .14, h * .48); ctx.fillStyle = "#9CA3AF"; for (let i = 0; i < 6; i++) ctx.fillRect(-w * .055, -h * .19 + i * h * .07, w * .11 * (i % 2 ? .7 : 1), 3); T(ctx, "STRUK #001", 0, -h * .28, Math.max(12, h * .07), { align: "center", col: RED }); ctx.restore(); ctx.restore(); };

  /* ============================== KELAS PRODUKTIF 1 NARATOR: ILUSTRASI PER POIN ==============================
     Efek layar penuh tanpa tokoh cerita (waktu: angka = relatif f.at, objek {cue}/{at} = waktu lokal adegan, lihat tm()).
     pointCard {n, lines[], sub}                 kartu angka poin 1..6 (warna latar tiap poin beda)
     treadmill {chip, chipAt}                    pelari siluet di treadmill, jarak tetap 0,0 km
     nightList {items[], chipAt}                 jam 21.30 + daftar tugas belum dicentang + ponsel penuh notifikasi
     timeBars {pieAt, chipA, chipB}              dua bilah (dikerjakan vs penting) lalu pie 24 jam
     brainDump {flyAt, per}                      kepala + awan pikiran, ikon terbang ke kertas daftar
     twoLamps {start, per, q1At, q2At}           jalur kartu tugas lewat lampu PENTING? dan MENDESAK?
     weekPlan {crossAt, flyAt, alarmAt}          kalender minggu, "NANTI" dicoret, kartu terbang ke Rabu 14.00
     passCard {mode: pass|no|bin, ...}           oper kartu antar tangan / balas sopan + stempel TIDAK DULU / kartu masuk tong sampah
     morningRule {reachAt, flipAt, checkAt, openAt}  pagi 08.00, ponsel dibalik, tugas dicentang, notifikasi 23 → 0
     recapList {rows[{text, icon, at}]}          rangkuman 6 baris yang menyala satu per satu
     tomatoBig {runAt}                           pengatur waktu tomat besar 25:00 */
  const ICON = (ctx, k, x, y, s, a) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (a != null) ctx.globalAlpha *= a; ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.lineJoin = "round"; ctx.lineCap = "round";
    const box = (x0, y0, w, h, r, fill) => { rr(ctx, x0, y0, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.stroke(); };
    switch (k){
      case "mail": box(-44, -30, 88, 60, 8, "#FFFFFF"); ctx.beginPath(); ctx.moveTo(-44, -30); ctx.lineTo(0, 6); ctx.lineTo(44, -30); ctx.stroke(); break;
      case "chat": box(-44, -36, 88, 58, 16, "#DCF5E6"); ctx.beginPath(); ctx.moveTo(-22, 22); ctx.lineTo(-32, 42); ctx.lineTo(0, 22); ctx.fillStyle = "#DCF5E6"; ctx.fill(); ctx.stroke(); ctx.fillStyle = OUT; [-20, 0, 20].forEach(d => { ctx.beginPath(); ctx.arc(d, -7, 5, 0, TAU); ctx.fill(); }); break;
      case "doc": box(-34, -44, 68, 88, 8, "#FFFFFF"); ctx.fillStyle = "#9CA3AF"; [-24, -8, 8, 24].forEach(yy => ctx.fillRect(-22, yy, 44, 5)); break;
      case "cal": box(-42, -38, 84, 80, 8, "#FFFFFF"); ctx.fillStyle = RED; ctx.fillRect(-42, -38, 84, 22); ctx.strokeRect(-42, -38, 84, 22); T(ctx, "12", 0, 28, 34, { align: "center", col: OUT }); break;
      case "phone": box(-26, -44, 52, 88, 10, "#2B3550"); ctx.fillStyle = "#9FD3E0"; ctx.fillRect(-20, -32, 40, 58); break;
      case "galon": box(-14, -42, 28, 24, 6, "#BFE3F0"); box(-28, -20, 56, 62, 12, "#9FD3E0"); break;
      case "receipt": box(-30, -44, 60, 88, 4, "#FFFDF8"); ctx.fillStyle = "#9CA3AF"; [-26, -12, 2, 16].forEach(yy => ctx.fillRect(-20, yy, 40, 5)); break;
      case "star": ctx.beginPath(); for (let i = 0; i < 10; i++){ const r = i % 2 ? 20 : 44, a2 = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r); } ctx.closePath(); ctx.fillStyle = YEL; ctx.fill(); ctx.stroke(); break;
      case "hourglass": ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-30, -44); ctx.lineTo(30, -44); ctx.lineTo(4, 0); ctx.lineTo(30, 44); ctx.lineTo(-30, 44); ctx.lineTo(-4, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(-18, 40); ctx.lineTo(18, 40); ctx.lineTo(0, 16); ctx.closePath(); ctx.fill(); break;
      case "bell": ctx.fillStyle = YEL; ctx.beginPath(); ctx.moveTo(-34, 24); ctx.quadraticCurveTo(-30, -38, 0, -40); ctx.quadraticCurveTo(30, -38, 34, 24); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 32, 8, 0, TAU); ctx.fill(); ctx.stroke(); break;
      case "boxes": box(-36, -36, 72, 72, 6, "#F6C343"); ctx.fillStyle = "#F4A85C"; ctx.fillRect(-36, -36, 72, 16); ctx.strokeRect(-36, -36, 72, 16); break;
      case "hand": box(-30, -20, 60, 40, 14, "#F2B88C"); break;
      case "flip": box(-42, -30, 84, 60, 12, "#2B3550"); ctx.fillStyle = "#1E2640"; ctx.fillRect(-34, -22, 68, 44); break;
      case "paper": box(-34, -44, 68, 88, 6, "#FFFFFF"); ctx.fillStyle = "#C2691F"; [-24, -8, 8].forEach(yy => ctx.fillRect(-22, yy, 44, 5)); break;
      case "tomato": ctx.beginPath(); ctx.ellipse(0, 6, 40, 34, 0, 0, TAU); ctx.fillStyle = "#E0402F"; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#3E7D4F"; for (let i = 0; i < 4; i++){ ctx.save(); ctx.translate(0, -22); ctx.rotate(-.9 + i * .6); ctx.beginPath(); ctx.ellipse(0, -9, 6, 15, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); } break;
      case "cup": box(-28, -26, 56, 60, 10, "#FFFFFF"); ctx.beginPath(); ctx.arc(34, 0, 16, -1.2, 1.2); ctx.stroke(); ctx.fillStyle = "#8E5F37"; ctx.fillRect(-22, -20, 44, 14); ctx.strokeStyle = "rgba(11,20,38,.4)"; ctx.beginPath(); ctx.moveTo(-8, -42); ctx.quadraticCurveTo(-2, -52, -8, -62); ctx.moveTo(10, -42); ctx.quadraticCurveTo(16, -52, 10, -62); ctx.stroke(); break;
      default: box(-30, -30, 60, 60, 8, "#FFFFFF");
    } ctx.restore(); };
  const clockFace = (ctx, x, y, r, hh, mm, t) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#FFFDF8"; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = r * .09; ctx.stroke();
    for (let i = 0; i < 12; i++){ const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.sin(a) * r * .82, -Math.cos(a) * r * .82); ctx.lineTo(Math.sin(a) * r * .92, -Math.cos(a) * r * .92); ctx.lineWidth = r * .05; ctx.stroke(); }
    const ha = ((hh % 12) + mm / 60) * Math.PI / 6, ma = mm * Math.PI / 30 + (t ? Math.sin(t * 2) * .01 : 0); ctx.lineCap = "round"; ctx.lineWidth = r * .09; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ha) * r * .5, -Math.cos(ha) * r * .5); ctx.stroke();
    ctx.lineWidth = r * .06; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ma) * r * .78, -Math.cos(ma) * r * .78); ctx.stroke(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(0, 0, r * .07, 0, TAU); ctx.fill(); ctx.restore(); };
  const bgGrad = (ctx, c0, c1) => fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, c0], [1, c1]]));
  const dots = (ctx, t, col, a) => { ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = a ?? .12; for (let i = 0; i < 18; i++){ const x = (rnd(i + 1) * 2100 + t * (8 + rnd(i) * 14)) % 2100 - 90, y = rnd(i + 30) * 1100, r = 14 + rnd(i + 5) * 40; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } ctx.restore(); };
  const arm = (ctx, x0, y0, x1, y1, sleeve, skin) => { ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 84; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = sleeve; ctx.lineWidth = 72; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.fillStyle = skin; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x1, y1, 52, 40, Math.atan2(y1 - y0, x1 - x0), 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); };
  const PCOL = [["#C2691F", "#8E4A24"], ["#2F6F73", "#1B4448"], ["#5B4B8A", "#362C5C"], ["#3BA36B", "#216B45"], ["#D9483B", "#8F2A22"], ["#1B3A66", "#0B1426"]];

  // ---- kartu angka poin
  FX.pointCard = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, n = f.n || 1, [c0, c1] = PCOL[(n - 1) % 6]; bgGrad(ctx, c0, c1);
    ctx.save(); ctx.translate(520, 540); ctx.rotate(q * .12); ctx.fillStyle = "rgba(255,255,255,.07)"; for (let i = 0; i < 14; i++){ ctx.rotate(TAU / 14); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1500, -110); ctx.lineTo(1500, 110); ctx.closePath(); ctx.fill(); } ctx.restore();
    dots(ctx, t, "#FFFFFF", .08);
    const s = pop(t, f.at + .05, .6); ctx.save(); ctx.translate(520, 540); ctx.scale(s, s); ctx.rotate((1 - Math.min(1, s)) * -.5 + Math.sin(q * 1.4) * .02);
    ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 34; ctx.shadowOffsetY = 16; ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(0, 0, 270, 0, TAU); ctx.fill(); ctx.shadowColor = "transparent"; ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.stroke();
    ctx.strokeStyle = c0; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, 236, 0, TAU); ctx.stroke();
    T(ctx, String(f.num ?? n), 0, 128, 380, { align: "center", col: c0 }); ctx.restore();
    const tk = easeIO(fin(q, .35, .5)); ctx.save(); ctx.globalAlpha = tk; ctx.translate((1 - tk) * 420, 0);
    T(ctx, f.label || ("LANGKAH " + n + " DARI 6"), 900, 360, 38, { col: "#FFE9C8", track: 6 });
    const LS = f.lines || ["JUDUL"], ls = Math.min(112, Math.floor(930 / (Math.max(...LS.map(l => l.length)) * .7)));
    LS.forEach((l, i) => T(ctx, l, 900, 480 + i * 124 + (112 - ls) * .35, ls, { col: "#FFFFFF", stroke: OUT, sw: 14 })); ctx.restore();
    if (f.sub){ const a = fin(q, 1.0, .5); ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - a) * 20); T(ctx, f.sub, 900, 480 + (f.lines || [1]).length * 124 + 20, 48, { col: "#FFE9C8", w: 700, maxW: 920 }); ctx.restore(); }
    if (!f.noDots) for (let i = 0; i < 6; i++){ const x = 900 + i * 90, on = i + 1 === n, done = i + 1 < n; ctx.beginPath(); ctx.arc(x, 940, on ? 26 : 18, 0, TAU); ctx.fillStyle = on ? CREAM : done ? "rgba(255,246,234,.75)" : "rgba(255,255,255,.22)"; ctx.fill(); if (on){ ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, String(i + 1), x, 950, 30, { align: "center", col: c0 }); } }
  }, sfx(f, g, add){ add(g(f.at + .05), "stamp", .75); add(g(f.at + .35), "whoosh", .4); } };

  // ---- treadmill
  FX.treadmill = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at; bgGrad(ctx, "#EADFCB", "#CDBB9F"); ctx.fillStyle = "rgba(255,255,255,.35)"; for (let i = 0; i < 3; i++) ctx.fillRect(160 + i * 640, 150, 420, 330);
    ctx.fillStyle = "#8A6A4A"; ctx.fillRect(0, 880, SW, 200); ctx.fillStyle = "rgba(0,0,0,.12)"; ctx.fillRect(0, 880, SW, 10);
    const k = fin(q, 0, .6); ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 40);
    // dek
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(880, 905, 520, 24, 0, 0, TAU); ctx.fill();
    ctx.save(); rr(ctx, 400, 800, 960, 84, 24); ctx.fillStyle = "#3B3F4E"; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = OUT; ctx.stroke(); ctx.clip();
    ctx.fillStyle = "#23262F"; ctx.fillRect(420, 812, 920, 40); ctx.fillStyle = "#4A4F60"; const off = (q * 520) % 90; for (let x = 420 - 90 + off; x < 1340; x += 90) ctx.fillRect(x, 812, 34, 40); ctx.restore();
    // tiang + panel
    ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(1320, 830); ctx.lineTo(1400, 470); ctx.stroke(); ctx.strokeStyle = "#B8BDC8"; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(1320, 830); ctx.lineTo(1400, 470); ctx.stroke();
    ctx.save(); ctx.translate(1370, 400); ctx.rotate(-.12); P(ctx, -190, -90, 380, 180, 20, "#2B3550", 7, OUT); P(ctx, -164, -66, 328, 90, 10, "#0E2A24", 0); T(ctx, "0.0", -40, 14, 84, { align: "center", col: "#7CF2B0", w: 800 }); T(ctx, "KM", 118, 12, 34, { align: "center", col: "#7CF2B0" });
    T(ctx, "11.0 KM/JAM", 0, 62, 28, { align: "center", col: "#FFE9C8", track: 2 }); ctx.restore();
    // pelari
    const p = q * 9.5, hx = 800, hy = 650, bob = Math.abs(Math.sin(p)) * 14; const leg = (ph, col) => { const a1 = Math.sin(ph) * .95, a2 = a1 - (.35 + .85 * (.5 + .5 * Math.sin(ph + 1.1))), kx = hx + Math.sin(a1) * 96, ky = hy - bob + Math.cos(a1) * 96, fx = kx + Math.sin(a2) * 96, fy = ky + Math.cos(a2) * 96;
      ctx.strokeStyle = OUT; ctx.lineWidth = 42; ctx.beginPath(); ctx.moveTo(hx, hy - bob); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(hx, hy - bob); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(fx + 18, fy + 8, 34, 15, 0, 0, TAU); ctx.fill(); ctx.stroke(); };
    const armf = (ph, col) => { const b1 = -Math.sin(ph) * .9 + .2, b2 = b1 - 1.15, sx = hx + 18, sy = hy - 128 - bob, ex = sx + Math.sin(b1) * 70, ey = sy + Math.cos(b1) * 70, wx = ex + Math.sin(b2) * 66, wy = ey + Math.cos(b2) * 66;
      ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(wx, wy); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(wx, wy); ctx.stroke(); };
    leg(p + Math.PI, "#2A3150"); armf(p, "#E7A04F"); ctx.strokeStyle = OUT; ctx.lineWidth = 78; ctx.beginPath(); ctx.moveTo(hx, hy - bob); ctx.lineTo(hx + 22, hy - 130 - bob); ctx.stroke(); ctx.strokeStyle = "#F4A85C"; ctx.lineWidth = 64; ctx.beginPath(); ctx.moveTo(hx, hy - bob); ctx.lineTo(hx + 22, hy - 130 - bob); ctx.stroke();
    ctx.fillStyle = "#2B1A12"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(hx + 40, hy - 196 - bob, 46, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#F2B88C"; ctx.beginPath(); ctx.arc(hx + 52, hy - 190 - bob, 38, -1.2, Math.PI * 1.15); ctx.fill(); ctx.stroke();
    leg(p, "#2A3150"); armf(p + Math.PI, "#E7A04F");
    for (let i = 0; i < 5; i++){ const u = ((q * 1.6 + i * .21) % 1), sx = hx + 60 + u * 130, sy = hy - 230 - u * 40 + u * u * 190 - i * 8; ctx.globalAlpha = k * (1 - u); ctx.fillStyle = "#7FC3E8"; ctx.beginPath(); ctx.moveTo(sx, sy - 14); ctx.quadraticCurveTo(sx + 12, sy + 4, sx, sy + 10); ctx.quadraticCurveTo(sx - 12, sy + 4, sx, sy - 14); ctx.fill(); } ctx.globalAlpha = k;
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 6; for (let i = 0; i < 7; i++){ const y = 470 + i * 52, x0 = ((q * 900 + i * 230) % 700); ctx.beginPath(); ctx.moveTo(180 + x0, y); ctx.lineTo(260 + x0, y); ctx.stroke(); }
    ctx.restore();
    if (f.chip) chip(ctx, 960, 150, pop(t, tm(f, f.chipAt, .8), .45), f.chip, NAVY, YEL, 52, -.015);
  }, sfx(f, g, add){ add(g(f.at + .3), "tickfast", .35, 4); } };

  // ---- malam: jam 21.30, daftar belum dicentang, ponsel penuh notifikasi
  FX.nightList = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at; bgGrad(ctx, "#16264A", "#0A1224"); U.motes(ctx, t, 30, 5, 0, 0, SW, SH, "#9FB9E8", .35); const k = fin(q, 0, .6);
    ctx.save(); ctx.globalAlpha = k; clockFace(ctx, 330, 330, 190, 9, 30, t); T(ctx, "21.30", 330, 590, 70, { align: "center", col: "#F6D9AE", w: 800 });
    ctx.save(); ctx.translate(960, 560 + (1 - k) * 30); ctx.rotate(-.02); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, -250, -330, 500, 660, 16, "#FFFDF8", 0); ctx.shadowColor = "transparent"; P(ctx, -250, -330, 500, 660, 16, "#FFFDF8", 7, OUT);
    T(ctx, "DAFTAR HARI INI", 0, -270, 40, { align: "center", col: NAVY, track: 3 }); const items = f.items || ["Susun rencana bulan depan", "Laporan bulanan", "Belajar skill baru", "Hubungi klien besar", "Rapikan data", "Kirim proposal"];
    items.slice(0, 6).forEach((tx, i) => { const y = -190 + i * 84, a = pop(t, f.at + .5 + i * .12, .3); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -216, y - 24, 48, 48, 8); ctx.stroke(); T(ctx, tx, -146, y + 10, 31, { col: "#374151", w: 700, maxW: 360 }); ctx.restore(); });
    chip(ctx, 0, 380, pop(t, tm(f, f.chipAt, 2), .4), "0 DARI 6 SELESAI", RED, "#FFF", 38, .02); ctx.restore();
    // ponsel + notifikasi
    ctx.save(); ctx.translate(1560, 560 + Math.sin(t * 26) * (Math.sin(t * 3) > .6 ? 3 : 0)); P(ctx, -150, -300, 300, 600, 36, "#2B3550", 8, OUT); P(ctx, -128, -270, 256, 540, 18, "#101A33", 0);
    for (let i = 0; i < 5; i++){ const a = pop(t, f.at + .8 + i * .55, .3); if (a <= 0) continue; ctx.save(); ctx.translate(0, -200 + i * 100 + (1 - a) * -20); ctx.scale(a, a); P(ctx, -112, -36, 224, 72, 12, "#FFFFFF", 0); ctx.fillStyle = [GREEN, "#5B7DB1", RED, TEAL, "#B8860B"][i]; ctx.beginPath(); ctx.arc(-80, 0, 18, 0, TAU); ctx.fill(); ctx.fillStyle = "#374151"; ctx.fillRect(-52, -14, 140, 10); ctx.fillStyle = "#9CA3AF"; ctx.fillRect(-52, 6, 100, 8); ctx.restore(); }
    ctx.beginPath(); ctx.arc(110, -270, 34, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, "99+", 110, -259, 28, { align: "center", col: "#FFF" }); ctx.restore(); ctx.restore();
  }, sfx(f, g, add){ for (let i = 0; i < 5; i++) add(g(f.at + .8 + i * .55), "notif", .3); } };

  // ---- dua bilah lalu pie 24 jam
  FX.timeBars = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, md = f.mode, pa = md === "pie" ? f.at : tm(f, f.pieAt, 8), ph = md === "bars" ? 0 : easeIO(fin(t, pa, .7)), lb = f.labAt != null ? tm(f, f.labAt) : pa + 3.4; bgGrad(ctx, "#FFF4E2", "#F3DDB8"); dots(ctx, t, "#C2691F", .07);
    const IC = ["mail", "chat", "galon", "doc", "phone", "receipt", "cal", "boxes"];
    if (ph < 1 && md !== "pie"){ ctx.save(); ctx.globalAlpha = 1 - ph; ctx.translate(-ph * 300, 0);
      const base = 900, g1 = easeIO(clamp((q - .3) / 4.5, 0, 1)), g2 = easeIO(clamp((q - .6) / 1.2, 0, 1));
      ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.fillRect(220, base, 1480, 10);
      // bilah kiri
      const h1 = 620 * g1; P(ctx, 360, base - h1, 460, h1, 18, "#8AA4C8", 7, OUT);
      for (let i = 0; i < 26; i++){ const col = i % 4, row = Math.floor(i / 4), y = base - 56 - row * 84, x = 410 + col * 98; if (y < base - h1 + 40) continue; const a = clamp((h1 - (base - y) + 40) / 80, 0, 1); ICON(ctx, IC[i % IC.length], x + 40, y, .62 + Math.sin(q * 3 + i) * .02, a); }
      T(ctx, "YANG DIKERJAKAN", 590, base + 64, 36, { align: "center", col: NAVY, track: 2 });
      // bilah kanan
      const h2 = 130 * g2; P(ctx, 1100, base - h2, 460, h2, 18, "#F4A85C", 7, OUT); ICON(ctx, "star", 1330, base - h2 / 2, 1.2 * g2, 1);
      T(ctx, "YANG PENTING", 1330, base + 64, 36, { align: "center", col: NAVY, track: 2 });
      if (f.chipA) chip(ctx, 590, 190, pop(t, f.at + 1.2, .4), f.chipA, NAVY, YEL, 40, -.02); if (f.chipB) chip(ctx, 1330, 190, pop(t, f.at + 2.4, .4), f.chipB, ORANGE, "#FFF", 40, .02);
      ctx.restore(); }
    if (ph > 0){ ctx.save(); ctx.globalAlpha = ph; ctx.translate((1 - ph) * 300, 0); ctx.translate(780, 540); const R = 360;
      for (let i = 0; i < 24; i++){ const a0 = -Math.PI / 2 + i * TAU / 24, a1 = a0 + TAU / 24, on = clamp((t - pa - .5 - i * .06) / .3, 0, 1), imp = i === 9, pull = imp ? 24 * easeIO(fin(t, lb - .2, .6)) : 0, mid = (a0 + a1) / 2;
        if (on <= 0) continue; ctx.save(); ctx.translate(Math.cos(mid) * pull, Math.sin(mid) * pull); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R * (.2 + .8 * on), a0 + .006, a1 - .006); ctx.closePath();
        ctx.fillStyle = imp ? (t > lb - .4 ? ORANGE : "#B9B2A6") : ["#B9B2A6", "#CFC8BA"][i % 2]; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
      ctx.beginPath(); ctx.arc(0, 0, 120, 0, TAU); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); T(ctx, "24", 0, 18, 80, { align: "center", col: NAVY }); T(ctx, "JAM", 0, 62, 28, { align: "center", col: "#6B7280", track: 3 }); ctx.restore();
      const lab = pop(t, lb, .45); ctx.save(); ctx.translate(1450, 470); ctx.scale(lab, lab); P(ctx, -250, -130, 500, 260, 22, "#FFFDF8", 6, OUT); T(ctx, "24 jam yang sama.", 0, -52, 40, { align: "center", col: NAVY, maxW: 460 }); T(ctx, "Beda di URUTAN,", 0, 10, 46, { align: "center", col: ORANGE, maxW: 460 }); T(ctx, "bukan di jumlah jam.", 0, 66, 36, { align: "center", col: NAVY, maxW: 460 }); ctx.restore(); ctx.restore(); }
  }, sfx(f, g, add){ if (f.mode !== "pie"){ add(g(f.at + .3), "rise", .3, 4.5); add(g(f.at + 2.4), "pop", .5); } if (f.mode !== "bars") add(g(tm(f, f.pieAt, 8)), "whoosh", .5); add(g((f.labAt != null ? tm(f, f.labAt) : tm(f, f.pieAt, 8) + 3.4)), "stamp", .6); } };

  // ---- kartu angka/pernyataan besar (selingan di tengah poin)
  FX.bigStat = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, [c0, c1] = PCOL[(f.c ?? 0) % 6]; bgGrad(ctx, c0, c1); ctx.save(); ctx.translate(960, 500); ctx.rotate(-q * .08); ctx.fillStyle = "rgba(255,255,255,.06)"; for (let i = 0; i < 12; i++){ ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1500, -120); ctx.lineTo(1500, 120); ctx.closePath(); ctx.fill(); } ctx.restore(); dots(ctx, t, "#FFFFFF", .08);
    if (f.top){ const a = fin(q, .1, .4); ctx.save(); ctx.globalAlpha = a; T(ctx, f.top, 960, 150, 44, { align: "center", col: "#FFE9C8", track: 6 }); ctx.restore(); }
    const s = pop(t, f.at + .15, .55); ctx.save(); ctx.translate(960, 520); ctx.scale(s, s); T(ctx, f.big || "", 0, 0, f.size ?? 300, { align: "center", col: "#FFFFFF", stroke: OUT, sw: 22 }); ctx.restore();
    (f.lines || []).forEach((l, i) => { const a = fin(q, .6 + i * .35, .4); ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - a) * 24); T(ctx, l, 960, 740 + i * 82, 62, { align: "center", col: i ? "#FFE9C8" : "#FFFFFF", maxW: 1640 }); ctx.restore(); });
  }, sfx(f, g, add){ add(g(f.at + .15), "stamp", .55); } };

  // ---- kepala + awan pikiran + kertas daftar
  FX.brainDump = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, fa = tm(f, f.flyAt, 3), per = f.per ?? .5, IC = ["mail", "calendar", "doc", "galon", "phone", "receipt", "chat", "boxes"].map(x => x === "calendar" ? "cal" : x), N = 8, TXT = ["Balas surel", "Rapat jam 10", "Laporan", "Pesan galon", "Telepon klien", "Faktur", "Balas chat", "Kirim barang"];
    bgGrad(ctx, "#FFF4E2", "#F7E2C0"); dots(ctx, t, "#C2691F", .06); const k = fin(q, 0, .6);
    const clear = clamp((t - fa) / (N * per + .6), 0, 1);
    // kepala
    ctx.save(); ctx.globalAlpha = k; ctx.translate(560, 780); const br = Math.sin(t * 1.6) * 5; ctx.fillStyle = "#F2B88C"; ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, -40 + br, 230, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.arc(0, -70 + br, 236, Math.PI * 1.03, Math.PI * 1.97); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-60, -40 + br, 28, 36, 0, 0, TAU); ctx.fillStyle = "#FFF"; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(70, -40 + br, 28, 36, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = OUT; const pe = lerp(-4, 4, clear); ctx.beginPath(); ctx.arc(-60 + pe, -34 + br, 12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(70 + pe, -34 + br, 12, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); if (clear < .6){ ctx.moveTo(-50, 90 + br); ctx.quadraticCurveTo(0, 60 + br, 50, 90 + br); } else { ctx.moveTo(-60, 70 + br); ctx.quadraticCurveTo(0, 125 + br, 60, 70 + br); } ctx.stroke();
    ctx.fillStyle = "rgba(217,72,59,.4)"; ctx.beginPath(); ctx.ellipse(-120, 30 + br, 30, 18, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(120, 30 + br, 30, 18, 0, 0, TAU); ctx.fill(); ctx.restore();
    // awan
    const cs = lerp(1, .42, easeIO(clear)), ca = lerp(1, .55, clear); ctx.save(); ctx.globalAlpha = k * ca; ctx.translate(560, 340); ctx.scale(cs, cs); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 8;
    [[-210, 20, 140], [-60, -60, 170], [110, -40, 160], [230, 40, 130], [20, 50, 170]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }); ctx.beginPath(); [[-210, 20, 140], [-60, -60, 170], [110, -40, 160], [230, 40, 130]].forEach(([x, y, r]) => ctx.arc(x, y, r, 0, TAU)); ctx.restore();
    ctx.save(); ctx.globalAlpha = k * ca; ctx.fillStyle = "#FFFFFF"; [[520, 600, 22], [540, 540, 34]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x - 20, y + 20, r, 0, TAU); ctx.fill(); ctx.stroke(); }); ctx.restore();
    // kertas
    const pk = pop(t, f.at + .5, .5); ctx.save(); ctx.translate(1440, 540); ctx.scale(pk, pk); ctx.rotate(.03); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; P(ctx, -280, -380, 560, 760, 14, "#FFFDF8", 0); ctx.shadowColor = "transparent"; P(ctx, -280, -380, 560, 760, 14, "#FFFDF8", 7, OUT);
    T(ctx, "SEMUA TUGAS", 0, -320, 40, { align: "center", col: ORANGE, track: 4 }); ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 3; for (let i = 0; i < 8; i++){ ctx.beginPath(); ctx.moveTo(-240, -250 + i * 82); ctx.lineTo(240, -250 + i * 82); ctx.stroke(); }
    for (let i = 0; i < N; i++){ const a = easeIO(fin(t, fa + i * per + .55, .3)); if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -236, -280 + i * 82, 34, 34, 6); ctx.stroke(); T(ctx, TXT[i], -180, -253 + i * 82, 34, { col: "#374151", w: 700 }); ctx.restore(); } ctx.restore();
    // ikon terbang
    for (let i = 0; i < N; i++){ const st = fa + i * per, u = easeIO(fin(t, st, .7)), ang = i * TAU / N + t * (.6 - clear * .6), orb = 260; const x0 = 560 + Math.cos(ang) * orb * cs * 1.0, y0 = 330 + Math.sin(ang) * 120 * cs;
      if (u >= 1) continue; const tx = 1440 - 200, ty = -280 + i * 82 + 540 + 16; const x = lerp(x0, tx, u), y = lerp(y0, ty, u) - Math.sin(u * Math.PI) * 140; ICON(ctx, IC[i], x, y, lerp(.9 * cs + .1, .36, u), k); }
    if (f.chip) chip(ctx, 960, 110, pop(t, tm(f, f.chipAt, 1), .45), f.chip, NAVY, YEL, 44, -.012);
  }, sfx(f, g, add){ const fa = tm(f, f.flyAt, 3), per = f.per ?? .5; for (let i = 0; i < 8; i++) add(g(fa + i * per + .55), "pop", .3); add(g(fa + 8 * per + .5), "sparkle", .5); } };

  // ---- jalur kartu tugas lewat dua lampu
  FX.twoLamps = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at; bgDark(ctx, t); const k = fin(q, 0, .6), st = tm(f, f.start, 3), per = f.per ?? 3.4;
    const CARDS = f.cards || [["Sistem klien error", 1, 1], ["Susun rencana bulan depan", 1, 0], ["Minta foto kardus", 0, 1]], LX = [640, 1280], LY = 380;
    ctx.save(); ctx.globalAlpha = k;
    // jalur
    ctx.fillStyle = "#1B2A4A"; ctx.fillRect(0, 760, SW, 150); ctx.fillStyle = "#2B3F69"; ctx.fillRect(0, 760, SW, 14); const off = (q * 160) % 70; ctx.fillStyle = "rgba(255,255,255,.14)"; for (let x = -70 + off; x < SW; x += 70) ctx.fillRect(x, 830, 36, 10);
    // lampu
    const lit = [0, 0]; const cardX = i => lerp(-340, SW + 340, clamp((t - st - i * per) / per, 0, 1));
    CARDS.forEach(([_, a, b], i) => { const cx = cardX(i); [a, b].forEach((on, j) => { if (!on) return; const d = Math.abs(cx - LX[j]); lit[j] = Math.max(lit[j], clamp(1 - d / 260, 0, 1)); }); });
    [["star", "PENTING?", YEL, "#FFF1B5"], ["hourglass", "MENDESAK?", RED, "#FFC1B8"]].forEach(([ic, lab, col, hi], j) => { const x = LX[j], L = lit[j];
      ctx.save(); const gl = ctx.createRadialGradient(x, LY, 20, x, LY, 330); gl.addColorStop(0, col.replace("#", "#") + Math.round(L * 150).toString(16).padStart(2, "0")); gl.addColorStop(1, col + "00"); ctx.fillStyle = gl; ctx.fillRect(x - 340, LY - 340, 680, 680); ctx.restore();
      ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(x, LY + 130); ctx.lineTo(x, 760); ctx.stroke(); ctx.strokeStyle = "#7B879E"; ctx.lineWidth = 8; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, LY, 150, 0, TAU); ctx.fillStyle = L > .05 ? hi : "#26335A"; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = L > .05 ? col : "#3B4A78"; ctx.beginPath(); ctx.arc(x, LY, 130, 0, TAU); ctx.stroke();
      ICON(ctx, ic, x, LY, 1.55 + L * .15, L > .05 ? 1 : .4); T(ctx, lab, x, LY + 230, 46, { align: "center", col: L > .05 ? col : "#9FB0D3", track: 3 }); });
    // kartu
    CARDS.forEach(([tx, a, b], i) => { const u = (t - st - i * per) / per; if (u < 0 || u > 1) return; const x = cardX(i); ctx.save(); ctx.translate(x, 700 + Math.sin(u * 40) * 2); ctx.rotate(Math.sin(u * 6) * .02); P(ctx, -170, -70, 340, 140, 16, "#FFFDF8", 6, OUT); T(ctx, tx, 0, -6, 30, { align: "center", col: NAVY, maxW: 300 });
      const l1 = Math.abs(x - LX[0]) < 160 ? 1 : 0, l2 = Math.abs(x - LX[1]) < 160 ? 1 : 0; if (x > LX[0] + 150) { ctx.fillStyle = a ? YEL : GREY; ctx.beginPath(); ctx.arc(-48, 38, 14, 0, TAU); ctx.fill(); } if (x > LX[1] + 150) { ctx.fillStyle = b ? RED : GREY; ctx.beginPath(); ctx.arc(-10, 38, 14, 0, TAU); ctx.fill(); } ctx.restore(); });
    ctx.restore();
    const qs = [[f.q1At, "1) Kalau tidak dikerjakan, apa dampaknya ke klien atau targetku?", YEL], [f.q2At, "2) Kalau tidak hari ini, apa akibatnya?", "#FFB4A8"]];
    qs.forEach(([a, tx, col], i) => { const at = tm(f, a); if (at == null) return; const s = pop(t, at, .4); if (s <= 0) return; ctx.save(); ctx.translate(960, 130 + i * 110); ctx.scale(s, s); P(ctx, -830, -44, 1660, 88, 22, "rgba(11,20,38,.82)", 4, col); T(ctx, tx, 0, 14, 40, { align: "center", col: "#FFFFFF", maxW: 1580 }); ctx.restore(); });
  }, sfx(f, g, add){ const st = tm(f, f.start, 3), per = f.per ?? 3.4; (f.cards || [0, 0, 0]).forEach((_, i) => { add(g(st + i * per + per * .33), "ping", .35); add(g(st + i * per + per * .66), "ping", .3); }); add(g(tm(f, f.q1At, 1)), "pop", .4); add(g(tm(f, f.q2At, 2)), "pop", .4); } };

  // ---- kalender minggu: "NANTI" dicoret → Rabu 14.00
  FX.weekPlan = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, ca = tm(f, f.crossAt, 3), fl = tm(f, f.flyAt, 5), al = tm(f, f.alarmAt, 7); bgGrad(ctx, "#E6F2E8", "#CFE5D4"); dots(ctx, t, "#3BA36B", .08); const k = fin(q, 0, .5);
    const X0 = 240, Y0 = 140, CW = 288, RH = 62, DAYS = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];
    ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 30); P(ctx, X0 - 20, Y0 - 20, CW * 5 + 100, RH * 9 + 100, 24, "#FFFDF8", 7, OUT); ctx.fillStyle = GREEN; rr(ctx, X0 - 20, Y0 - 20, CW * 5 + 100, 80, 24); ctx.fill(); ctx.fillRect(X0 - 20, Y0 + 30, CW * 5 + 100, 30);
    DAYS.forEach((d, i) => T(ctx, d, X0 + 70 + CW * i + CW / 2 - 10, Y0 + 36, 34, { align: "center", col: "#FFF", track: 3 }));
    for (let r = 0; r < 9; r++){ const y = Y0 + 70 + r * RH; ctx.strokeStyle = "#E5E7EB"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0 + 40, y); ctx.lineTo(X0 + 70 + CW * 5, y); ctx.stroke(); T(ctx, String(8 + r).padStart(2, "0") + ".00", X0 + 26, y + 36, 24, { align: "center", col: "#6B7280", w: 700 }); }
    for (let c = 0; c < 6; c++){ const x = X0 + 70 + CW * c - 10; ctx.strokeStyle = "#E5E7EB"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, Y0 + 60); ctx.lineTo(x, Y0 + 70 + RH * 9); ctx.stroke(); }
    // blok jadwal lain (isi biar kalender hidup)
    [[0, 1, 2, "Rapat tim"], [1, 3, 2, "Klien"], [3, 0, 1, "Cek stok"], [4, 5, 2, "Laporan"]].forEach(([c, r, h, tx], i) => { const a = pop(t, f.at + .3 + i * .15, .3); ctx.save(); ctx.globalAlpha = a * .9; const x = X0 + 70 + CW * c - 4, y = Y0 + 70 + r * RH + 5; P(ctx, x, y, CW - 12, RH * h - 10, 10, "#D7DEE9", 3, "#9CA3AF"); T(ctx, tx, x + 14, y + 36, 26, { col: "#4B5563", w: 700, maxW: CW - 40 }); ctx.restore(); });
    const wx = X0 + 70 + CW * 2 - 4, wy = Y0 + 70 + 6 * RH + 5;   // Rabu 14.00
    const u = easeIO(fin(t, fl, .9));
    if (u > 0){ ctx.save(); const sc = lerp(1, .0, 0); P(ctx, wx, wy, CW - 12, (RH * 0.75) * u * 1.1, 10, ORANGE, 5, OUT); if (u > .6){ ctx.globalAlpha = fin(u, .6, .4); T(ctx, "14.00–14.45", wx + (CW - 12) / 2, wy + 30, 26, { align: "center", col: "#FFF" }); } ctx.restore(); }
    ctx.restore();
    // kartu tugas
    const cx0 = 960, cy0 = 960, cx1 = wx + (CW - 12) / 2, cy1 = wy + 22, cs = lerp(1, .26, u), ccx = lerp(cx0, cx1, u), ccy = lerp(cy0, cy1, u) - Math.sin(u * Math.PI) * 120; const ci = pop(t, f.at + .9, .5);
    if (u < .98 && ci > 0){ ctx.save(); ctx.translate(ccx, ccy); ctx.scale(cs * ci, cs * ci); ctx.rotate(lerp(-.03, .0, u)); P(ctx, -300, -62, 600, 124, 18, "#FFFDF8", 6, OUT); ctx.fillStyle = ORANGE; ctx.fillRect(-300, -62, 18, 124); T(ctx, f.task || "Susun rencana kirim minggu ini", -30, -6, 32, { align: "center", col: NAVY, maxW: 520 });
      const sh = t > ca && t < ca + .4 ? Math.sin((t - ca) * 90) * 5 : 0; ctx.save(); ctx.translate(sh, 0); T(ctx, "NANTI", -30, 40, 40, { align: "center", col: RED, track: 5 }); const sk = easeIO(fin(t, ca, .35)); if (sk > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-130, 40); ctx.lineTo(-130 + 200 * sk, 22); ctx.stroke(); } ctx.restore(); ctx.restore(); }
    const bp = pop(t, al, .4); if (bp > 0){ ctx.save(); ctx.translate(wx + CW - 40, wy - 8 + Math.sin(t * 30) * 2); ctx.rotate(Math.sin(t * 26) * .25 * Math.max(0, 1 - (t - al) / 1.4)); ICON(ctx, "bell", 0, 0, .8 * bp, 1); ctx.restore(); }
    if (f.chip) chip(ctx, 960, 975, pop(t, tm(f, f.chipAt, 2), .45), f.chip, NAVY, YEL, 38, -.01);
  }, sfx(f, g, add){ add(g(tm(f, f.crossAt, 3)), "scribble", .5); add(g(tm(f, f.flyAt, 5)), "whoosh", .5); add(g(tm(f, f.flyAt, 5) + .8), "stamp", .5); add(g(tm(f, f.alarmAt, 7)), "ring", .4); } };

  // ---- poin 5: oper kartu / balas sopan + stempel / tong sampah
  FX.passCard = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, m = f.mode || "pass", k = fin(q, 0, .5);
    if (m === "pass"){ bgGrad(ctx, "#EFE7DD", "#DCCFBC"); dots(ctx, t, "#8E4A24", .07);
      const ma = tm(f, f.moveAt, 1.4), p1 = easeIO(fin(t, ma, 1.1)), p2 = easeIO(fin(t, ma + 1.5, .9)), catchp = fin(t, ma + 1.1, .3);
      const cardX = lerp(560, 960, p1) + 300 * p2, cardY = 560 - Math.sin(p1 * Math.PI) * 50, rx = lerp(1850, cardX + 120, easeIO(fin(t, ma - .3, 1.3))), lx = lerp(cardX - 120, 300, p2);
      ctx.save(); ctx.translate(cardX, cardY); ctx.rotate(lerp(-.1, .06, p1)); P(ctx, -150, -100, 300, 200, 16, "#FFFDF8", 6, OUT); ctx.fillStyle = ORANGE; ctx.fillRect(-150, -100, 300, 26); T(ctx, f.card || "Pesan minta foto", 0, 10, 32, { align: "center", col: NAVY, maxW: 260 }); ctx.restore();
      arm(ctx, -120, 640, lx, cardY + 20, "#E7A04F", "#F2B88C"); arm(ctx, 2040, 680, rx, cardY + 20, "#3F6FB5", "#D9A279");
      if (catchp > 0) chip(ctx, 1300, 280, pop(t, ma + 1.2, .4), "SUDAH KUTERUSKAN YA", GREEN, "#FFF", 44, .02);
      chip(ctx, 560, 180, pop(t, f.at + .4, .4), "SERAHKAN", NAVY, YEL, 44, -.02);
    } else if (m === "no"){ bgGrad(ctx, "#E4ECF6", "#C9D8EC"); dots(ctx, t, "#5B7DB1", .09);
      const a1 = pop(t, f.at + .3, .4); ctx.save(); ctx.translate(560, 330); ctx.scale(a1, a1); P(ctx, -360, -90, 720, 180, 34, "#FFFFFF", 6, OUT); T(ctx, f.ask || "Bisa bantu aku sekarang, ya?", 0, 14, 42, { align: "center", col: "#111827", maxW: 640 }); ctx.restore();
      const ra = tm(f, f.replyAt, 1.6), tp = typed(f.reply || "Aku lagi pegang tugas sampai jam 10, ya.", t, ra, 24), a2 = pop(t, ra, .3);
      if (a2 > 0){ ctx.save(); ctx.translate(1360, 620); ctx.scale(a2, a2); P(ctx, -400, -110, 800, 220, 34, "#DCF5E6", 6, OUT); const L = S.wrap(ctx, tp || " ", 700); L.slice(0, 3).forEach((l, i) => T(ctx, l, -360, -30 + i * 56, 44, { col: "#111827", w: 700 })); ctx.restore(); }
      const sa = tm(f, f.stampAt, 4.2), sk = f.noStamp ? 0 : fin(t, sa, .18); if (sk > 0){ const s = lerp(3, 1, easeIO(sk)); ctx.save(); ctx.translate(960, 800); ctx.rotate(-.12); ctx.scale(s, s); ctx.globalAlpha = sk; ctx.strokeStyle = RED; ctx.lineWidth = 16; rr(ctx, -330, -90, 660, 180, 24); ctx.stroke(); ctx.lineWidth = 6; rr(ctx, -310, -72, 620, 144, 16); ctx.stroke(); T(ctx, "TIDAK DULU", 0, 36, 100, { align: "center", col: RED, w: 800 }); ctx.restore(); }
    } else { bgGrad(ctx, "#ECE6F0", "#D6CCE0"); dots(ctx, t, "#5B4B8A", .08);
      const fa = tm(f, f.dropAt, 1.6), u = clamp((t - fa) / .9, 0, 1), lid = t < fa - .3 ? 0 : (t < fa + .8 ? easeIO(fin(t, fa - .3, .3)) : 1 - easeIO(fin(t, fa + .9, .3)));
      // tong
      ctx.save(); ctx.translate(960, 640); ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.beginPath(); ctx.ellipse(0, 330, 230, 26, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-190, -130); ctx.lineTo(190, -130); ctx.lineTo(160, 320); ctx.lineTo(-160, 320); ctx.closePath(); ctx.fillStyle = "#8AA4C8"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.stroke();
      ctx.strokeStyle = "rgba(30,40,70,.35)"; ctx.lineWidth = 8; [-90, 0, 90].forEach(x => { ctx.beginPath(); ctx.moveTo(x, -90); ctx.lineTo(x * .85, 280); ctx.stroke(); }); ctx.restore();
      // kartu jatuh
      const cy = lerp(60, 560, u * u), cs = lerp(1, .55, u); if (u < 1){ ctx.save(); ctx.translate(960, cy); ctx.rotate(u * .6); ctx.scale(cs, cs); P(ctx, -160, -70, 320, 140, 14, "#FFFDF8", 6, OUT); T(ctx, f.card || "Stiker grup", 0, 10, 32, { align: "center", col: NAVY, maxW: 280 }); ctx.restore(); }
      // tutup
      ctx.save(); ctx.translate(960 - 210, 510); ctx.rotate(-lid * .95); P(ctx, 0, -34, 420, 40, 12, "#6B86AE", 8, OUT); ctx.fillStyle = OUT; ctx.fillRect(190, -52, 40, 18); ctx.restore();
      const ck = pop(t, fa + 1.3, .4); if (ck > 0){ ctx.save(); ctx.translate(1320, 460); ctx.scale(ck, ck); ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke(); ctx.strokeStyle = "#FFF"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-30, 4); ctx.lineTo(-8, 28); ctx.lineTo(34, -22); ctx.stroke(); ctx.restore(); }
      chip(ctx, 960, 170, pop(t, f.at + .4, .4), "HAPUS TANPA RASA BERSALAH", NAVY, YEL, 44, -.012); }
  }, sfx(f, g, add){ const m = f.mode || "pass"; if (m === "pass"){ add(g(tm(f, f.moveAt, 1.4)), "whoosh", .5); add(g(tm(f, f.moveAt, 1.4) + 1.2), "pop", .6); } else if (m === "no"){ add(g(f.at + .3), "notif", .4); add(g(tm(f, f.replyAt, 1.6)), "send", .5); if (!f.noStamp) add(g(tm(f, f.stampAt, 4.2) + .15), "stamp", .8); } else { add(g(tm(f, f.dropAt, 1.6)), "whoosh", .4); add(g(tm(f, f.dropAt, 1.6) + .8), "thud", .6); add(g(tm(f, f.dropAt, 1.6) + 1.3), "sparkle", .4); } } };

  // ---- poin 6: pagi 08.00, ponsel dibalik, satu tugas, 23 notifikasi → 0
  FX.morningRule = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, ra = tm(f, f.reachAt, 2), fp = tm(f, f.flipAt, 3.4), ck = tm(f, f.checkAt, 4.6), op = tm(f, f.openAt, 9), k = fin(q, 0, .6);
    // langit pagi: matahari naik
    const sun = easeIO(clamp((q + (f.sunOff || 0)) / 6, 0, 1)); fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, lerp2("#2B3E6E", "#8EC7E8", sun)], [.7, lerp2("#E88A4F", "#F7E7C4", sun)], [1, "#F7E7C4"]]));
    ctx.save(); const sy = lerp(760, 250, sun); const gl = ctx.createRadialGradient(1500, sy, 30, 1500, sy, 420); gl.addColorStop(0, "rgba(255,226,150,.9)"); gl.addColorStop(1, "rgba(255,226,150,0)"); ctx.fillStyle = gl; ctx.fillRect(1000, sy - 420, 920, 840); ctx.fillStyle = "#FFD66B"; ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(1500, sy, 110, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.fillStyle = "#7FA88A"; ctx.beginPath(); ctx.moveTo(0, 760); ctx.quadraticCurveTo(480, 640, 960, 760); ctx.quadraticCurveTo(1440, 860, 1920, 720); ctx.lineTo(1920, 1080); ctx.lineTo(0, 1080); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    ctx.save(); ctx.globalAlpha = k; P(ctx, 130, 90, 400, 150, 22, "#13223D", 6, OUT); const mins = Math.round(lerp(0, 48, clamp((t - ck) / 3, 0, 1))), ts = t < ck ? "08.00" : "08." + String(mins).padStart(2, "0"); T(ctx, ts, 330, 206, 110, { align: "center", col: "#7CF2B0", w: 800 }); ctx.restore();
    // meja
    ctx.fillStyle = "#9E6A40"; ctx.fillRect(0, 860, SW, 220); ctx.fillStyle = "#B88151"; ctx.fillRect(0, 860, SW, 24); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-6, 860, SW + 12, 240);
    // papan tugas
    const bp = pop(t, ck - 1.0, .45); if (bp > 0){ ctx.save(); ctx.translate(560, 560); ctx.scale(bp, bp); P(ctx, -300, -180, 600, 360, 22, "#FFFDF8", 7, OUT); T(ctx, "TUGAS PENTING HARI INI", 0, -118, 32, { align: "center", col: ORANGE, track: 3 });
      ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -260, -50, 60, 60, 10); ctx.stroke(); T(ctx, "Susun jadwal minggu ini", -170, 0, 40, { col: NAVY, maxW: 400 });
      const cp = easeIO(clamp((t - ck) / 2.4, 0, 1)); ctx.fillStyle = "#E5E7EB"; rr(ctx, -260, 80, 520, 30, 15); ctx.fill(); ctx.fillStyle = GREEN; rr(ctx, -260, 80, 520 * cp, 30, 15); ctx.fill(); T(ctx, Math.round(cp * 100) + "%", 0, 150, 40, { align: "center", col: NAVY });
      if (cp >= 1){ const s = pop(t, ck + 2.5, .4); ctx.save(); ctx.translate(-230, -20); ctx.scale(s, s); ctx.strokeStyle = GREEN; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-2, 20); ctx.lineTo(30, -26); ctx.stroke(); ctx.restore(); } ctx.restore(); }
    // ponsel di meja + tangan
    const px = 1260, py = 820, face = t < fp ? 1 : (t < op ? 0 : 1), flipK = t >= fp && t < fp + .3 ? Math.abs(Math.cos(fin(t, fp, .3) * Math.PI / 2)) : 1, buzz = t < fp ? Math.sin(t * 40) * 4 : 0;
    ctx.save(); ctx.translate(px + buzz, py); ctx.scale(1, flipK); P(ctx, -150, -46, 300, 80, 16, "#2B3550", 7, OUT);
    if (face){ ctx.fillStyle = "#101A33"; rr(ctx, -138, -38, 276, 64, 8); ctx.fill(); const n = t < op ? 23 : Math.round(lerp(23, 0, clamp((t - op - .6) / 3.6, 0, 1))); ctx.beginPath(); ctx.arc(120, -50, 36, 0, TAU); ctx.fillStyle = n > 0 ? RED : GREEN; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, n > 0 ? String(n) : "OK", 120, -38, 30, { align: "center", col: "#FFF" }); }
    else { ctx.fillStyle = "#1E2640"; rr(ctx, -138, -38, 276, 64, 8); ctx.fill(); ctx.fillStyle = "#3B4A78"; ctx.beginPath(); ctx.arc(-100, -6, 14, 0, TAU); ctx.fill(); }
    ctx.restore();
    // tangan meraih ponsel
    const rU = easeIO(fin(t, ra, .6)); const hx = lerp(1850, px + 40, rU) , hy = lerp(560, py - 70, rU); if (t < fp + .8 && rU > 0){ const outk = easeIO(fin(t, fp + .3, .5)); arm(ctx, 2100, 480, lerp(hx, 2000, outk), lerp(hy, 480, outk), "#E7A04F", "#F2B88C"); }
    if (t >= fp && t < fp + 1.2){ const a = pop(t, fp, .3); ctx.save(); ctx.translate(px, py - 150); ctx.scale(a, a); T(ctx, "tok", 0, 0, 60, { align: "center", col: NAVY }); ctx.restore(); }
    if (f.chip) chip(ctx, 960, 975, pop(t, tm(f, f.chipAt, 1), .45), f.chip, NAVY, YEL, 36, -.01);
    const dn = pop(t, op + 4.2, .4); if (dn > 0) chip(ctx, 1500, 560, dn, "TERBALAS DALAM 15 MENIT", GREEN, "#FFF", 40, .02);
  }, sfx(f, g, add){ const ad = (x, n, v) => { if (x >= f.at && x < f.at + 200) add(g(x), n, v); }; ad(tm(f, f.reachAt, 2), "whoosh", .3); ad(tm(f, f.flipAt, 3.4), "knock", .8); ad(tm(f, f.checkAt, 4.6) + 2.5, "star", .5); ad(tm(f, f.openAt, 9), "notif", .5); ad(tm(f, f.openAt, 9) + 4.2, "sparkle", .4); } };
  function lerp2(a, b, k){ const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, "0")).join(""); }

  // ---- rangkuman 6 baris
  FX.recapList = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at; bgDark(ctx, t); const k = fin(q, 0, .5), rows = f.rows || [], ICN = ["paper", "star", "boxes", "cal", "hand", "flip"];
    ctx.save(); ctx.globalAlpha = k; T(ctx, f.title || "ATUR PRIORITAS · 6 LANGKAH", 960, 130, 54, { align: "center", col: "#F6D9AE", track: 6 }); ctx.restore();
    rows.forEach((r, i) => { const at = tm(f, r.at), nxt = rows[i + 1] ? tm(f, rows[i + 1].at) : 1e9; if (at == null) return; const s = pop(t, at - .1, .35), act = t >= at && t < nxt ? 1 : 0, y = 250 + i * 128; if (s <= 0) return;
      ctx.save(); ctx.translate(960, y); ctx.scale(s, s); const w = 1360; P(ctx, -w / 2, -52, w, 104, 26, act ? ORANGE : "rgba(255,246,234,.1)", act ? 6 : 3, act ? OUT : "rgba(255,246,234,.35)");
      ctx.beginPath(); ctx.arc(-w / 2 + 70, 0, 38, 0, TAU); ctx.fillStyle = act ? CREAM : "rgba(255,246,234,.85)"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, String(i + 1), -w / 2 + 70, 14, 46, { align: "center", col: ORANGE });
      T(ctx, r.text, -w / 2 + 150, 15, 50, { col: act ? "#FFFFFF" : "#C9D4E8", maxW: 1000, w: 800 }); ICON(ctx, r.icon || ICN[i % 6], w / 2 - 80, 0, .9, act ? 1 : .65); ctx.restore(); });
  }, sfx(f, g, add){ (f.rows || []).forEach(r => add(g(tm(f, r.at)), "pop", .4)); } };

  // ---- pengatur waktu tomat besar
  FX.tomatoBig = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at; bgGrad(ctx, "#FBE6D6", "#F2C9A8"); dots(ctx, t, "#D9483B", .07); const s = pop(t, f.at + .1, .6), ra = tm(f, f.runAt, 1.2);
    ctx.save(); ctx.translate(960, 560); ctx.scale(s * 3.1, s * 3.1); PROP.tomatoTimer(ctx, { s: 1, run: clamp((t - ra) / 5, 0, 1), ring: t > ra + 4.5 }, t); ctx.restore();
    if (f.chip) chip(ctx, 960, 150, pop(t, tm(f, f.chipAt, .8), .45), f.chip, NAVY, YEL, 52, -.012);
  }, sfx(f, g, add){ add(g(f.at + .3), "pop", .5); add(g(tm(f, f.runAt, 1.2)), "tickfast", .35, 3); } };

  /* ============================== KELAS PRODUKTIF EPS 2 (POMODORO): ILUSTRASI PER POIN ==============================
     leakBucket {plugAt, drain, chip, chipAt}        ember bocor, tetesan berlabel (tab/chat/notifikasi), ditambal saat plugAt
     lostCursor {cycle, chip}                        spreadsheet baris 12 → notifikasi → kembali bingung "tadi sampai mana, ya?"
     focusGraph {cmpAt}                              garis fokus terpotong biaya "masuk lagi" vs satu tugas utuh
     splitTask {ex 1|2, splitAt, lit[{at,i}], badge} kartu tugas besar terbelah jadi potongan, satu potongan jadi target sesi
     closeTabs {closeAt, per, flipAt, muteAt}        6 tab ditutup satu per satu, ponsel dibalik, notifikasi dimatikan
     noteDistract {mode main|check, thoughts[{at,text}], items, checks[]}   gelembung gangguan terbang ke kertas / daftar dicentang saat istirahat
     urgeWave {cmpAt}                                dorongan membuka ponsel naik lalu lewat sendiri
     breakTimeline {ringAt, stages[{at,label,pose}], crossAt}   bilah 25|5, tomat berdering, orang berdiri-minum-regang-lihat jendela, media sosial dicoret
     cycleRing {mode ring|cmp, arcAt[], longAt, labelAt}        4 sesi + istirahat panjang / perbandingan 8 jam pindah-pindah vs 2-3 jam fokus
     adaptDay {mode queue|status|tally, calAt}       sesi 15 menit untuk yang sering dipanggil / status chat + kalender / dua kertas turus
     longList {mode list|vs}                         daftar 23 butir yang menggulir vs buku catatan 3 baris
     tomatoMini {x, y, s}                            tomat kecil di pojok */
  const stroke2 = (ctx, pts, col, w) => { ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; [[OUT, w + 10], [col, w]].forEach(([c, lw]) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }); ctx.restore(); };
  const TOMATO = (ctx, x, y, s, a, run) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a ?? 1; PROP.tomatoTimer(ctx, { s: 1, run: run ?? 0 }, 0); ctx.restore(); };
  const tally = (ctx, x, y, n, sc, col) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc || 1, sc || 1); ctx.strokeStyle = col || NAVY; ctx.lineWidth = 5; ctx.lineCap = "round";
    for (let i = 0; i < n; i++){ const g = Math.floor(i / 5), j = i % 5, gx = (g % 4) * 70, gy = Math.floor(g / 4) * 62; ctx.beginPath(); if (j < 4){ ctx.moveTo(gx + j * 12, gy); ctx.lineTo(gx + j * 12, gy + 40); } else { ctx.moveTo(gx - 6, gy + 34); ctx.lineTo(gx + 46, gy + 6); } ctx.stroke(); } ctx.restore(); };
  const paperSheet = (ctx, x, y, w, h, title, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; P(ctx, -w / 2, -h / 2, w, h, 14, "#FFFDF8", 0); ctx.shadowColor = "transparent"; P(ctx, -w / 2, -h / 2, w, h, 14, "#FFFDF8", 7, OUT);
    T(ctx, title, 0, -h / 2 + 62, 38, { align: "center", col: ORANGE, track: 4 }); ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 3; for (let i = 0; i < Math.floor((h - 130) / 70); i++){ ctx.beginPath(); ctx.moveTo(-w / 2 + 36, -h / 2 + 120 + i * 70); ctx.lineTo(w / 2 - 36, -h / 2 + 120 + i * 70); ctx.stroke(); } ctx.restore(); };

  // ---- ember bocor
  FX.leakBucket = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .6), pl = tm(f, f.plugAt, 1e9), te = Math.min(t, pl), lv = lerp(1, .14, easeIO(clamp((te - f.at - .6) / (f.drain ?? 14), 0, 1)));
    bgGrad(ctx, "#E7F1F7", "#C5DCEA"); dots(ctx, t, "#5B7DB1", .08); ctx.fillStyle = "#9E6A40"; ctx.fillRect(0, 900, SW, 180); ctx.fillStyle = "#B88151"; ctx.fillRect(0, 900, SW, 20);
    ctx.save(); ctx.globalAlpha = k; ctx.translate(960, 600 + (1 - k) * 30); const path = () => { ctx.beginPath(); ctx.moveTo(-230, -230); ctx.lineTo(230, -230); ctx.lineTo(180, 300); ctx.lineTo(-180, 300); ctx.closePath(); }, wallX = y => -230 + 50 * (y + 230) / 530;
    ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.beginPath(); ctx.ellipse(0, 316, 250, 26, 0, 0, TAU); ctx.fill();
    ctx.save(); path(); ctx.clip(); const wy = lerp(300, -230, lv) + Math.sin(t * 3) * 4; ctx.fillStyle = "#6CB4E4"; ctx.fillRect(-260, wy, 520, 600); ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillRect(-260, wy - 4, 520, 9); ctx.restore();
    path(); ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.lineJoin = "round"; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -230, 230, 24, 0, 0, TAU); ctx.lineWidth = 8; ctx.stroke(); ctx.beginPath(); ctx.arc(0, -230, 272, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 12; ctx.stroke();
    const HY = [-40, 90, 200], LAB = f.labels || ["tab", "chat", "notifikasi", "video", "email", "pesan"];
    HY.forEach((hy, i) => { const hx = wallX(hy), sealed = t >= pl + i * .25; if (!sealed){ ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(hx + 4, hy, 11, 15, 0, 0, TAU); ctx.fill(); } else { const s = pop(t, pl + i * .25, .3); ctx.save(); ctx.translate(hx + 6, hy); ctx.scale(s, s); ctx.rotate(.15); P(ctx, -34, -22, 68, 44, 8, "#F4A85C", 5, OUT); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke(); ctx.restore(); } });
    for (let j = 0; j < 40; j++){ const st = f.at + .8 + j * .62; if (st > pl || t < st) continue; const u = (t - st) / 1.1, hi = j % 3, hy = HY[hi]; if (u > 1.2 || hy < wy - 4) continue; const dx = wallX(hy) - 10 - u * 90, dy = hy + 640 * u * u, fl = dy > 316; if (fl && u > 1.15) continue;
      ctx.save(); ctx.globalAlpha = 1 - clamp((u - .9) / .3, 0, 1); ctx.fillStyle = "#6CB4E4"; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(dx, Math.min(dy, 316) - 16); ctx.quadraticCurveTo(dx + 12, Math.min(dy, 316) + 4, dx, Math.min(dy, 316) + 12); ctx.quadraticCurveTo(dx - 12, Math.min(dy, 316) + 4, dx, Math.min(dy, 316) - 16); ctx.fill(); ctx.stroke();
      T(ctx, LAB[j % LAB.length], dx - 22, Math.min(dy, 316) + 8, 30, { align: "right", col: RED, w: 800 }); ctx.restore(); }
    ctx.restore();
    // pengukur tenaga fokus
    const gx = 1500, gy = 560; ctx.save(); ctx.globalAlpha = k; P(ctx, gx - 50, gy - 260, 100, 520, 24, "#FFFDF8", 6, OUT); const gh = 480 * lv; ctx.save(); rr(ctx, gx - 40, gy - 250, 80, 500, 16); ctx.clip(); ctx.fillStyle = lv > .5 ? GREEN : lv > .3 ? YEL : RED; ctx.fillRect(gx - 40, gy + 250 - gh, 80, gh); ctx.restore(); T(ctx, "TENAGA", gx, gy - 290, 30, { align: "center", col: NAVY, track: 3 }); T(ctx, "FOKUS", gx, gy + 310, 30, { align: "center", col: NAVY, track: 3 }); ctx.restore();
    if (f.chip) chip(ctx, 960, 130, pop(t, tm(f, f.chipAt, 1), .45), f.chip, NAVY, YEL, 50, -.012);
    if (t >= pl){ const ck = pop(t, pl + .9, .4); if (ck > 0) chip(ctx, 960, 960, ck, f.chipB || "BERHENTI BOCOR", GREEN, "#FFF", 54, .015); }
  }, sfx(f, g, add){ for (let j = 0; j < 12; j++) add(g(f.at + .8 + j * 1.24), "pop", .18); if (f.plugAt != null){ add(g(tm(f, f.plugAt)), "stamp", .7); add(g(tm(f, f.plugAt) + .9), "chime", .5); } } };

  // ---- "tadi sampai mana, ya?"
  FX.lostCursor = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, PD = f.cycle ?? 4.4, c = Math.floor(q / PD), u = q % PD, k = fin(q, 0, .5), ov = u > 1.1 && u < 2.5, lost = u >= 2.5; bgGrad(ctx, "#E9EEF5", "#CBD6E6");
    const x0 = 260, y0 = 140, w = 1400, h = 800, RH = 60;
    ctx.save(); ctx.globalAlpha = k; P(ctx, x0 - 14, y0 - 14, w + 28, h + 28, 26, "#FBFBF8", 8, OUT); ctx.fillStyle = "#1E7B4A"; ctx.fillRect(x0, y0, w, 64); T(ctx, "Rekap Bulanan.xlsx", x0 + 30, y0 + 44, 34, { col: "#FFF" });
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0 + 64, w, h - 64); ctx.clip(); const off = lost ? 300 * Math.abs(Math.sin((u - 2.5) * 2.2)) + 60 : 0;
    for (let i = 0; i < 30; i++){ const y = y0 + 64 + i * RH - off; if (y < y0 || y > y0 + h) continue; ctx.fillStyle = i % 2 ? "#F7F8FA" : "#FFFFFF"; ctx.fillRect(x0, y, w, RH); ctx.strokeStyle = "#D8DEE5"; ctx.lineWidth = 2; ctx.strokeRect(x0, y, 110, RH);
      T(ctx, String(i + 1), x0 + 55, y + 40, 26, { align: "center", col: "#6B7280" }); if (i < 12){ T(ctx, ["Kasir macet", "Printer error", "Lupa sandi", "Struk buram", "Stok tidak cocok", "Koneksi putus"][i % 6], x0 + 140, y + 40, 28, { col: "#111827", w: 600, fam: F2 }); T(ctx, String(3 + (i * 7) % 11), x0 + 900, y + 40, 28, { col: "#111827", w: 600, fam: F2 }); } }
    if (!lost){ const y = y0 + 64 + 11 * RH; ctx.strokeStyle = ORANGE; ctx.lineWidth = 7; ctx.strokeRect(x0 + 4, y + 3, w - 8, RH - 6); if (Math.sin(q * 8) > 0) T(ctx, "|", x0 + 940, y + 44, 40, { col: ORANGE }); }
    ctx.restore();
    if (ov){ const a = pop(t, f.at + c * PD + 1.1, .3); ctx.save(); ctx.fillStyle = "rgba(11,20,38,.35)"; ctx.fillRect(x0, y0 + 64, w, h - 64); ctx.translate(x0 + w / 2, y0 + 440); ctx.scale(a, a); P(ctx, -330, -120, 660, 240, 26, "#FFFFFF", 6, OUT); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(-264, -52, 40, 0, TAU); ctx.fill(); T(ctx, "Nisa", -200, -44, 30, { col: NAVY }); P(ctx, -230, 0, 520, 80, 22, "#DCF5E6", 4, OUT); T(ctx, ["Kak, minta foto kardus ya", "Galon siapa yang angkat?", "Fakturnya sudah, Mas?"][c % 3], 30, 54, 32, { align: "center", col: "#111827", w: 700, maxW: 480 }); ctx.restore(); }
    if (lost){ const hs = pop(t, f.at + c * PD + 2.5, .3), sp = pop(t, f.at + c * PD + 2.8, .4); ctx.save(); ctx.translate(x0 + w - 120, y0 + 140); ctx.rotate(Math.sin(u * 4) * .12); ctx.scale(hs * 1.5, hs * 1.5); ICON(ctx, "hourglass", 0, 0, 1, 1); ctx.restore();
      ctx.save(); ctx.translate(x0 + w / 2, y0 + 400); ctx.scale(sp, sp); P(ctx, -300, -62, 600, 124, 40, "#FFF1C9", 6, OUT); T(ctx, "Tadi sampai mana, ya?", 0, 16, 50, { align: "center", col: BROWN, maxW: 560 }); ctx.restore(); }
    ctx.restore();
    const n = c + (u > 2.5 ? 1 : 0); if (n > 0) chip(ctx, 1520, 1010, pop(t, f.at + 2.5, .35), `KEMBALI KE REKAP: ${Math.min(n, c + 1)}×`, RED, "#FFF", 40, .02);
    if (f.chip) chip(ctx, 960, 74, pop(t, tm(f, f.chipAt, .8), .4), f.chip, NAVY, YEL, 38, -.01);
  }, sfx(f, g, add){ for (let c = 0; c < 4; c++){ add(g(f.at + c * (f.cycle ?? 4.4) + 1.1), "notif", .5); add(g(f.at + c * (f.cycle ?? 4.4) + 2.8), "dun", .5); } } };

  // ---- garis fokus terpotong vs utuh
  FX.focusGraph = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .5), ca = tm(f, f.cmpAt, 5); bgGrad(ctx, "#FFF4E2", "#F3DDB8"); dots(ctx, t, "#C2691F", .07); const X0 = 260, W = 1400;
    const SEG = [[0, 150], [1, 70], [0, 110], [1, 80], [0, 90], [1, 90], [0, 70], [1, 100], [0, 60], [1, 110], [0, 50], [1, 120]];
    ctx.save(); ctx.globalAlpha = k; T(ctx, "PINDAH-PINDAH", X0, 270, 46, { col: NAVY, track: 3 }); const pa = easeIO(clamp((q - .5) / 3.6, 0, 1)) * W; let x = 0; ctx.save(); ctx.beginPath(); ctx.rect(X0, 280, pa, 200); ctx.clip();
    SEG.forEach(([r, w], i) => { P(ctx, X0 + x, 330, w - 4, 110, 12, r ? "#E87E70" : "#6EC39A", 5, OUT); if (r) T(ctx, "masuk lagi", X0 + x + w / 2 - 2, 395, 22, { align: "center", col: "#FFF", maxW: w - 14 }); else ICON(ctx, "bell", X0 + x + w + 2, 305, .46, 1); x += w; }); ctx.restore();
    const pb = easeIO(clamp((t - ca) / 2.2, 0, 1)); T(ctx, "SATU TUGAS", X0, 640, 46, { col: NAVY, track: 3 }); ctx.save(); ctx.globalAlpha = fin(t, ca - .2, .3); P(ctx, X0, 700, Math.max(20, W * .96 * pb), 110, 12, "#6EC39A", 5, OUT); ctx.restore(); ctx.restore();
    const lg2 = (lx, col, tx) => { P(ctx, lx, 930, 40, 40, 8, col, 4, OUT); T(ctx, tx, lx + 58, 962, 32, { col: NAVY, w: 700 }); }; lg2(420, "#6EC39A", "waktu fokus"); lg2(860, "#E87E70", "waktu masuk lagi"); lg2(1380, YEL, "pindah / gangguan");
    if (f.chip) chip(ctx, 960, 130, pop(t, tm(f, f.chipAt, 1), .45), f.chip, NAVY, YEL, 44, -.012);
  }, sfx(f, g, add){ add(g(f.at + .5), "rise", .3, 3.6); add(g(tm(f, f.cmpAt, 5)), "whoosh", .5); } };

  // ---- poin 1: tugas besar dipecah, satu potongan jadi target
  FX.splitTask = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, ex = f.ex ?? 1, sa = tm(f, f.splitAt, 1.6), sp = easeIO(fin(t, sa, .9)), k = fin(q, 0, .5); bgGrad(ctx, "#FFF4E2", "#F7E2C0"); dots(ctx, t, "#C2691F", .06);
    const lit = (f.lit || []).map(l => ({ at: tm(f, l.at), i: l.i })); const cols = ex === 1 ? 4 : 3, rows = ex === 1 ? 2 : 1, cw = ex === 1 ? 210 : 280, ch = ex === 1 ? 150 : 190, N = cols * rows;
    const labs = ex === 1 ? ["Baris 1–40", "Baris 41–80", "Baris 81–120", "Baris 121–160", "Baris 161–200", "Baris 201–240", "Baris 241–280", "Baris 281–320"] : ["Kumpulkan data", "Buat kerangka", "Tulis bagian 1"], title = ex === 1 ? "REKAP BULANAN" : "MENULIS LAPORAN";
    ctx.save(); ctx.globalAlpha = k; const cy = ex === 1 ? 470 : 480; T(ctx, ex === 1 ? "SATU TUGAS BESAR" : "TUGAS BESAR LAIN", 960, 190, 46, { align: "center", col: ORANGE, track: 6 });
    if (sp < .02){ const s = pop(t, f.at + .1, .5); ctx.save(); ctx.translate(960, cy); ctx.scale(s, s); P(ctx, -cols * cw / 2, -rows * ch / 2, cols * cw, rows * ch, 24, "#FFFDF8", 8, OUT); T(ctx, title, 0, 22, ex === 1 ? 84 : 76, { align: "center", col: NAVY }); ctx.restore(); }
    else for (let i = 0; i < N; i++){ const c = i % cols, r = Math.floor(i / cols), bx = 960 + (c - (cols - 1) / 2) * (cw + 30 * sp), by = cy + (r - (rows - 1) / 2) * (ch + 30 * sp), li = lit.find(l => l.i === i && t >= l.at), anyLit = lit.some(l => t >= l.at), a = li ? 1 : (anyLit && ex === 1 ? .4 : 1), pk = li ? pop(t, li.at, .35) : 0;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(bx, by); const sc = li ? 1 + .1 * Math.min(1, pk) : 1; ctx.scale(sc, sc); P(ctx, -cw / 2 + 4, -ch / 2 + 4, cw - 8, ch - 8, 18, li ? ORANGE : "#FFFDF8", li ? 8 : 6, OUT);
      if (ex === 2){ ctx.beginPath(); ctx.arc(-cw / 2 + 40, -ch / 2 + 40, 26, 0, TAU); ctx.fillStyle = li ? CREAM : ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); T(ctx, String(i + 1), -cw / 2 + 40, -ch / 2 + 52, 32, { align: "center", col: li ? ORANGE : "#FFF" }); }
      T(ctx, labs[i], 0, ex === 1 ? 10 : 24, ex === 1 ? 32 : 40, { align: "center", col: li ? "#FFF" : NAVY, maxW: cw - 30 }); ctx.restore(); }
    if (ex === 1 && lit.length && t >= lit[0].at + .5){ const s = pop(t, lit[0].at + .5, .45); ctx.save(); ctx.translate(960, 850); ctx.scale(s, s); P(ctx, -520, -80, 1040, 160, 30, NAVY, 7, OUT); ICON(ctx, "star", -440, 0, 1, 1); T(ctx, "TARGET SESI", -370, -22, 28, { col: "#F6D9AE", track: 4 }); T(ctx, f.badge || "Isi rekap baris 1–40", -370, 38, 54, { col: "#FFFFFF" }); ctx.restore(); }
    if (f.chip) chip(ctx, 960, 960, pop(t, tm(f, f.chipAt, 1.2), .45), f.chip, NAVY, YEL, 38, -.01);
    ctx.restore();
  }, sfx(f, g, add){ add(g(tm(f, f.splitAt, 1.6)), "whoosh", .5); (f.lit || []).forEach(l => add(g(tm(f, l.at)), "stamp", .6)); } };

  // ---- poin 2: tab ditutup, ponsel dibalik, notifikasi dimatikan
  FX.closeTabs = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .5), ca = tm(f, f.closeAt, 1), per = f.per ?? .55, fp = tm(f, f.flipAt, 5), mu = tm(f, f.muteAt, 8); bgGrad(ctx, "#E6F2F2", "#C6DFE1"); dots(ctx, t, "#2F6F73", .08);
    const NM = ["Rekap Bulanan", "Video lucu", "Chat tim", "Berita", "Toko daring", "Email"], bx = 130, by = 170, bw = 1010, bh = 700, cl = i => ca + (i - 1) * per; let open = 0; for (let i = 0; i < 6; i++) if (i === 0 || t < cl(i) + .3) open++;
    ctx.save(); ctx.globalAlpha = k; P(ctx, bx, by, bw, bh, 24, "#FBFBF8", 8, OUT); ctx.fillStyle = "#D5DBE3"; rr(ctx, bx, by, bw, 78, 24); ctx.fill(); ctx.fillRect(bx, by + 40, bw, 38);
    let tx = bx + 20; NM.forEach((nm, i) => { const u = i === 0 ? 0 : easeIO(fin(t, cl(i), .3)), wd = lerp(i === 0 ? 220 : 150, 0, u) + (i === 0 ? 0 : 0); if (wd < 4) return; ctx.save(); ctx.beginPath(); ctx.rect(tx, by + 14, wd, 64); ctx.clip(); P(ctx, tx, by + 14, wd - 6, 64, [14, 14, 0, 0], i === 0 ? "#FFFFFF" : "#BFC7D1", 3, "#8A94A3"); T(ctx, nm, tx + 12, by + 56, 22, { col: "#374151", w: 700, maxW: wd - 52 }); if (u > 0){ ctx.fillStyle = "rgba(217,72,59,.5)"; ctx.fillRect(tx, by + 14, wd, 64); } T(ctx, "×", tx + wd - 26, by + 54, 28, { align: "center", col: "#6B7280" }); ctx.restore(); tx += wd; });
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(bx + 4, by + 78, bw - 8, bh - 82); T(ctx, "Rekap Bulanan", bx + 50, by + 170, 54, { col: NAVY }); for (let i = 0; i < 7; i++){ ctx.fillStyle = i % 2 ? "#F3F4F6" : "#E9EDF2"; ctx.fillRect(bx + 50, by + 210 + i * 62, bw - 100, 48); ctx.fillStyle = "#9CA3AF"; ctx.fillRect(bx + 70, by + 226 + i * 62, 300 + (i * 97) % 280, 14); }
    P(ctx, bx + bw - 250, by + 96, 220, 62, 31, open > 1 ? RED : GREEN, 5, OUT); T(ctx, open + (open > 1 ? " TAB" : " JENDELA"), bx + bw - 140, by + 138, 32, { align: "center", col: "#FFF" });
    // ponsel
    const px = 1450, py = 450, fu = easeIO(fin(t, fp, .5)), sx = Math.abs(Math.cos(fu * Math.PI)), back = fu > .5; ctx.save(); ctx.translate(px, py); ctx.scale(sx, 1); P(ctx, -140, -250, 280, 500, 40, back ? "#4A4458" : "#1E2640", 8, OUT);
    if (!back){ ctx.fillStyle = "#101A33"; rr(ctx, -120, -226, 240, 452, 22); ctx.fill(); for (let i = 0; i < 4; i++){ const a = pop(t, f.at + .6 + i * .8, .3); if (a <= 0 || t > fp) continue; ctx.save(); ctx.translate(0, -150 + i * 100); ctx.scale(a, a); P(ctx, -104, -36, 208, 72, 12, "#FFFFFF", 0); ctx.fillStyle = [GREEN, "#5B7DB1", RED, TEAL][i]; ctx.beginPath(); ctx.arc(-70, 0, 17, 0, TAU); ctx.fill(); ctx.fillStyle = "#374151"; ctx.fillRect(-42, -14, 130, 10); ctx.fillStyle = "#9CA3AF"; ctx.fillRect(-42, 6, 90, 8); ctx.restore(); } }
    else { ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(-70, -190, 30, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); }
    ctx.restore(); if (t >= fp + .4) chip(ctx, px, py - 320, pop(t, fp + .4, .4), "PONSEL DIBALIK", NAVY, YEL, 34, -.02);
    // sakelar notifikasi
    const on = t < mu ? 1 : 1 - easeIO(fin(t, mu, .3)); ctx.save(); ctx.translate(px, 850); T(ctx, "NOTIFIKASI KOMPUTER", 0, -56, 30, { align: "center", col: NAVY, track: 2 }); P(ctx, -90, -34, 180, 68, 34, on > .5 ? GREEN : "#9CA3AF", 6, OUT); ctx.beginPath(); ctx.arc(lerp(-52, 52, on), 0, 26, 0, TAU); ctx.fillStyle = "#FFF"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, on > .5 ? "ON" : "OFF", 0, 76, 34, { align: "center", col: on > .5 ? GREEN : RED }); ctx.restore();
    ctx.restore(); if (f.chip) chip(ctx, 960, 90, pop(t, tm(f, f.chipAt, .8), .4), f.chip, NAVY, YEL, 40, -.01);
  }, sfx(f, g, add){ for (let i = 1; i < 6; i++) add(g(tm(f, f.closeAt, 1) + (i - 1) * (f.per ?? .55)), "pop", .45); add(g(tm(f, f.flipAt, 5)), "knock", .8); add(g(tm(f, f.muteAt, 8)), "click", .7); for (let i = 0; i < 4; i++) add(g(f.at + .6 + i * .8), "notif", .3); } };

  // ---- poin 3: gangguan ditulis di kertas
  const THOUGHT_DEF = [["Balas pesan Kak Rina?"], ["Cek harga tiket"], ["Tanya kode K-07"]];
  FX.noteDistract = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .5), md = f.mode || "main"; bgGrad(ctx, "#EEE8F6", "#D8CEE8"); dots(ctx, t, "#5B4B8A", .08);
    if (md === "check"){ const IT = f.items || ["Balas pesan Kak Rina", "Cek harga tiket", "Tanya kode K-07"], ck = (f.checks || []).map(c => tm(f, c)); ctx.save(); ctx.globalAlpha = k; paperSheet(ctx, 960, 560, 840, 700, "KERTAS GANGGUAN", -.02);
      ctx.save(); ctx.translate(960, 560); ctx.rotate(-.02); IT.forEach((tx, i) => { const y = -190 + i * 140, c = ck[i] != null ? easeIO(fin(t, ck[i], .35)) : 0; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -340, y - 34, 68, 68, 12); ctx.stroke(); T(ctx, tx, -240, y + 18, 52, { col: c ? "#9CA3AF" : NAVY, w: 700 }); if (c > 0){ ctx.strokeStyle = GREEN; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-332, y); ctx.lineTo(-312 + 20 * c, y + 22 * c); ctx.lineTo(-292 + 28 * c, y - 30 * c); ctx.stroke(); ctx.strokeStyle = "rgba(107,114,128,.8)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-240, y + 4); ctx.lineTo(-240 + 560 * c, y + 4); ctx.stroke(); } }); ctx.restore(); ctx.restore();
      chip(ctx, 960, 140, pop(t, f.at + .4, .4), f.chip || "SAAT ISTIRAHAT: URUS SEMUANYA", NAVY, YEL, 46, -.012); return; }
    const TH = (f.thoughts || THOUGHT_DEF.map((x, i) => ({ at: 1 + i * 2, text: x[0] }))).map(x => ({ at: tm(f, x.at), text: x.text }));
    ctx.save(); ctx.globalAlpha = k; P(ctx, 130, 280, 900, 620, 24, "#FBFBF8", 8, OUT); ctx.fillStyle = "#1E7B4A"; ctx.fillRect(134, 284, 892, 56); T(ctx, "Rekap Bulanan.xlsx", 164, 324, 30, { col: "#FFF" }); const pr = clamp((q - .3) / 11, 0, 1);
    for (let i = 0; i < 7; i++){ ctx.fillStyle = i % 2 ? "#F3F4F6" : "#E9EDF2"; ctx.fillRect(170, 380 + i * 62, 820, 46); ctx.fillStyle = i < pr * 9 ? GREEN : "#9CA3AF"; ctx.fillRect(184, 394 + i * 62, 260 + (i * 91) % 300, 16); }
    P(ctx, 170, 830, 820, 40, 20, "#E5E7EB", 3, "#D1D5DB"); P(ctx, 170, 830, Math.max(40, 820 * pr), 40, 20, ORANGE, 0); T(ctx, "PEKERJAAN TERUS JALAN", 580, 330 - 6 - 190, 34, { align: "center", col: NAVY, track: 3 });
    paperSheet(ctx, 1480, 580, 620, 760, "KERTAS GANGGUAN", .02);
    TH.forEach((th, i) => { const fl = th.at + 1.1, u = easeIO(fin(t, fl, .8)), ly = 330 + i * 70 + 80; if (t < th.at) return; const sx = 580, sy = 170, ex = 1480 - 270, ey = ly + 40;
      if (u < 1){ const s = pop(t, th.at, .4), x = lerp(sx, ex + 100, u), y = lerp(sy, ey, u) - Math.sin(u * Math.PI) * 60; ctx.save(); ctx.translate(x, y); ctx.scale(s * lerp(1, .6, u), s * lerp(1, .6, u)); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, 0, 250, 62, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(-170, 84, 14, 0, TAU); ctx.fill(); ctx.stroke(); T(ctx, th.text, 0, 12, 36, { align: "center", col: NAVY, maxW: 440 }); ctx.restore(); }
      else { ctx.save(); ctx.translate(1480, 0); ctx.rotate(.02); T(ctx, "• " + typed(th.text, t, fl + .8, 26), -270, ly + 40, 34, { col: NAVY, w: 700, maxW: 560 }); ctx.restore(); } });
    ctx.save(); ctx.translate(1480, 880); ctx.rotate(.02); T(ctx, "GANGGUAN:", -250, 0, 30, { col: ORANGE, track: 2 }); tally(ctx, -90, -30, TH.filter(x => t >= x.at + 1.9).length, .8, RED); ctx.restore(); ctx.restore();
    chip(ctx, 960, 130, pop(t, f.at + .5, .4), f.chip || "TULIS, LALU LANJUTKAN", NAVY, YEL, 46, -.012);
  }, sfx(f, g, add){ if ((f.mode || "main") === "check"){ (f.checks || []).forEach(c => add(g(tm(f, c)), "stamp", .5)); return; } (f.thoughts || THOUGHT_DEF.map((x, i) => ({ at: 1 + i * 2 }))).forEach(th => { add(g(tm(f, th.at)), "pop", .5); add(g(tm(f, th.at) + 1.1), "whoosh", .4); add(g(tm(f, th.at) + 1.9), "scribble", .4); }); } };

  // ---- dorongan naik lalu lewat
  FX.urgeWave = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .5), ca = tm(f, f.cmpAt, 5); bgGrad(ctx, "#FFF4E2", "#F3DDB8"); dots(ctx, t, "#C2691F", .07); const X0 = 240, X1 = 1680, BY = 820, TOPY = 280; ctx.save(); ctx.globalAlpha = k;
    ctx.strokeStyle = NAVY; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(X0, 240); ctx.lineTo(X0, BY); ctx.lineTo(X1, BY); ctx.stroke(); T(ctx, "DORONGAN BUKA PONSEL", X0 + 24, 262, 34, { col: NAVY, track: 2 }); T(ctx, "WAKTU →", X1, BY + 56, 30, { align: "right", col: NAVY, track: 2 });
    const g = u => Math.exp(-Math.pow((u - .33) / .16, 2)), p = easeIO(clamp((q - .5) / 3.6, 0, 1)); ctx.beginPath(); for (let i = 0; i <= 120; i++){ const u = i / 120; if (u > p) break; const x = X0 + u * (X1 - X0), y = BY - 30 - g(u) * (BY - TOPY - 40); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = GREEN; ctx.lineWidth = 14; ctx.stroke();
    if (p > .35){ const a = pop(t, f.at + 2.0, .4); ctx.save(); ctx.translate(X0 + .33 * (X1 - X0), TOPY - 10); ctx.scale(a, a); P(ctx, -230, -50, 460, 76, 38, RED, 5, OUT); T(ctx, "ingin buka ponsel!", 0, 4, 38, { align: "center", col: "#FFF" }); ctx.restore(); }
    if (p > .95){ const a = pop(t, f.at + 4.2, .4); ctx.save(); ctx.translate(X0 + .78 * (X1 - X0), BY - 110); ctx.scale(a, a); P(ctx, -230, -44, 460, 70, 35, GREEN, 5, OUT); T(ctx, "lewat sendiri", 0, 4, 38, { align: "center", col: "#FFF" }); ctx.restore(); }
    if (t >= ca){ const u2 = easeIO(fin(t, ca, 1.6)); ctx.save(); ctx.setLineDash([22, 16]); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.beginPath(); for (let i = 0; i <= 80; i++){ const u = i / 80; if (u > u2) break; const x = X0 + u * (X1 - X0), y = BY - 30 - (u < .33 ? g(u) : (u < .5 ? 1 - (u - .33) * 1.4 : .78)) * (BY - TOPY - 40); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); const a = pop(t, ca + 1.4, .4); ctx.save(); ctx.translate(1440, 380); ctx.scale(a, a); P(ctx, -250, -50, 500, 76, 38, "#FFFDF8", 5, RED); T(ctx, "kalau diberi makan: tetap tinggi", 0, 4, 28, { align: "center", col: RED, maxW: 470 }); ctx.restore(); }
    ctx.restore();
  }, sfx(f, g, add){ add(g(f.at + 2.0), "pop", .4); add(g(f.at + 4.2), "sparkle", .4); if (f.cmpAt != null) add(g(tm(f, f.cmpAt)), "dun", .4); } };

  // ---- poin 4: bilah 25|5, tomat berdering, orang istirahat
  const person = (ctx, x, fy, pose, t) => { const SK = "#F2B88C", br = Math.sin(t * 2) * 3, sit = pose === 0, hipY = sit ? fy - 170 : fy - 270, shY = hipY - 190 + br, hdY = shY - 64, nod = pose === 4 ? 14 : 4;
    if (sit){ P(ctx, x - 150, fy - 420, 34, 300, 10, "#7B879E", 5, OUT); P(ctx, x - 150, fy - 190, 240, 32, 10, "#7B879E", 5, OUT); stroke2(ctx, [[x, hipY], [x + 130, hipY], [x + 130, fy]], "#2A3150", 36); } else { stroke2(ctx, [[x, hipY], [x - 6, fy]], "#2A3150", 36); stroke2(ctx, [[x + 14, hipY], [x + 26, fy]], "#2A3150", 36); }
    stroke2(ctx, [[x, hipY], [x, shY]], "#F4A85C", 78);
    const arm = (pts, col) => stroke2(ctx, pts, col || "#E7A04F", 28);
    if (pose === 0){ arm([[x + 10, shY + 20], [x + 90, shY + 100], [x + 190, hipY - 112]]); }
    else if (pose === 1 || pose === 4){ arm([[x + 6, shY + 22], [x + 24, shY + 100], [x + 34, shY + 176]]); }
    else if (pose === 2){ arm([[x + 6, shY + 22], [x + 70, shY + 90], [x + 84, shY - 10]]); P(ctx, x + 70, shY - 70, 48, 62, 8, "#FFFFFF", 5, OUT); ctx.fillStyle = "#6CB4E4"; ctx.fillRect(x + 76, shY - 40, 36, 28); }
    else { arm([[x + 6, shY + 10], [x + 60, shY - 60], [x + 54, shY - 170]]); arm([[x - 8, shY + 10], [x - 56, shY - 50], [x - 48, shY - 160]], "#D68F3F"); for (let i = 0; i < 3; i++){ ctx.strokeStyle = "rgba(11,20,38,.4)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 120 + i * 14, shY - 120 + i * 20); ctx.lineTo(x + 150 + i * 14, shY - 120 + i * 20); ctx.stroke(); } }
    ctx.fillStyle = "#2B1A12"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x + nod - 6, hdY - 6, 52, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = SK; ctx.beginPath(); ctx.arc(x + nod + 8, hdY + 2, 44, -1.2, Math.PI * 1.15); ctx.fill(); ctx.stroke(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(x + nod + 30, hdY - 6, 6, 0, TAU); ctx.fill(); };
  FX.breakTimeline = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .5), ra = tm(f, f.ringAt, f.at + 1.8), ST = (f.stages || []).map(s => ({ at: tm(f, s.at), label: s.label, pose: s.pose })); bgGrad(ctx, "#E4ECF6", "#C9D8EC"); dots(ctx, t, "#5B7DB1", .09);
    ctx.save(); ctx.globalAlpha = k; const X0 = 220, GW = 1100, BW = 240, gp = easeIO(clamp((q - .2) / 1.2, 0, 1)), bp = clamp((t - ra - .4) / (f.restDur ?? 14), 0, 1);
    P(ctx, X0, 130, GW, 70, 14, "#E5E7EB", 5, OUT); P(ctx, X0, 130, Math.max(10, GW * gp), 70, 14, "#E78A3E", 0); T(ctx, "25 MENIT KERJA", X0 + GW / 2, 178, 36, { align: "center", col: "#FFF" }); P(ctx, X0 + GW + 20, 130, BW, 70, 14, "#E5E7EB", 5, OUT); if (bp > 0) P(ctx, X0 + GW + 20, 130, Math.max(10, BW * bp), 70, 14, "#5B9BD5", 0); T(ctx, "5 MENIT", X0 + GW + 20 + BW / 2, 178, 34, { align: "center", col: t >= ra ? NAVY : "#9CA3AF" });
    if (t >= ra){ const a = pop(t, ra, .35), sh = t < ra + 1 ? Math.sin(t * 60) * 5 : 0; ctx.save(); ctx.translate(X0 + GW + 90 + sh, 120); ctx.scale(a * .55, a * .55); PROP.tomatoTimer(ctx, { s: 1, run: 0, ring: true }, t); ctx.restore(); if (t < ra + 1.6) T(ctx, "TRING!", X0 + GW - 120, 248, 54, { align: "center", col: RED }); }
    // jendela
    P(ctx, 1330, 330, 400, 400, 20, "#9FD3E0", 8, OUT); ctx.fillStyle = "#FFE08A"; ctx.beginPath(); ctx.arc(1560, 450, 54, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(1530, 330); ctx.lineTo(1530, 730); ctx.moveTo(1330, 530); ctx.lineTo(1730, 530); ctx.stroke(); ctx.fillStyle = "#7FA88A"; ctx.fillRect(1338, 640, 384, 82);
    ctx.fillStyle = "#9E6A40"; ctx.fillRect(100, 890, 1720, 150); ctx.fillStyle = "#B88151"; ctx.fillRect(100, 890, 1720, 18);
    let pose = 0, lab = null; ST.forEach(s => { if (t >= s.at){ pose = s.pose ?? 1; lab = s; } }); if (pose === 0){ P(ctx, 780, 600, 420, 22, 6, "#B88151", 5, OUT); stroke2(ctx, [[820, 622], [820, 890]], "#8E5F37", 18); stroke2(ctx, [[1160, 622], [1160, 890]], "#8E5F37", 18); P(ctx, 930, 478, 200, 120, 10, "#4A4F60", 5, OUT); P(ctx, 944, 490, 172, 92, 6, "#BFE2EA", 0); }
    person(ctx, 640, 890, pose, t); if (lab){ chip(ctx, 700, 300, pop(t, lab.at, .35), lab.label, NAVY, YEL, 40, -.02); }
    const cx = tm(f, f.crossAt, 1e9), sa = pop(t, cx - .3, .4); if (sa > 0){ ctx.save(); ctx.translate(1530, 840); ctx.scale(sa, sa); P(ctx, -200, -80, 400, 150, 22, "#FFFDF8", 6, OUT); [["#E1306C", -110], ["#1877F2", -10], ["#FF0000", 90]].forEach(([c, dx]) => { P(ctx, dx - 40, -50, 80, 80, 20, c, 4, OUT); }); const xk = easeIO(fin(t, cx, .35)); ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-190, -70 + 0); ctx.lineTo(-190 + 380 * xk, -70 + 130 * xk); ctx.moveTo(190, -70); ctx.lineTo(190 - 380 * xk, -70 + 130 * xk); ctx.stroke(); if (xk > .9) chip(ctx, 0, 140, 1, "BUKAN ISTIRAHAT", RED, "#FFF", 32, .02); ctx.restore(); }
    ctx.restore();
  }, sfx(f, g, add){ add(g(tm(f, f.ringAt, f.at + 1.8)), "ring", .6); (f.stages || []).forEach(s => add(g(tm(f, s.at)), "pop", .4)); if (f.crossAt != null) add(g(tm(f, f.crossAt)), "scribble", .5); } };

  // ---- poin 5: empat sesi + istirahat panjang / perbandingan jam
  FX.cycleRing = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .5), md = f.mode || "ring"; bgGrad(ctx, md === "ring" ? "#E8F0E4" : "#F6EBDD", md === "ring" ? "#CDE0C8" : "#EAD3B6"); dots(ctx, t, "#3BA36B", .07); ctx.save(); ctx.globalAlpha = k;
    if (md === "ring"){ const cx = 700, cy = 560, R = 300, AT = (f.arcAt || [0, .6, 1.2, 1.8]).map(a => tm(f, a)), la = tm(f, f.longAt, 4.5), lb = tm(f, f.labelAt, 6);
      ctx.strokeStyle = "rgba(0,0,0,.1)"; ctx.lineWidth = 110; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
      for (let i = 0; i < 4; i++){ const a0 = -Math.PI / 2 + i * Math.PI / 2, a1 = a0 + Math.PI / 2 * .8, u = easeIO(fin(t, AT[i], .6)); if (u > 0){ ctx.strokeStyle = "#E78A3E"; ctx.lineWidth = 110; ctx.lineCap = "butt"; ctx.beginPath(); ctx.arc(cx, cy, R, a0 + .02, a0 + .02 + (a1 - a0 - .04) * u); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, R + 55, a0 + .02, a0 + .02 + (a1 - a0 - .04) * u); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, R - 55, a0 + .02, a0 + .02 + (a1 - a0 - .04) * u); ctx.stroke();
          const tm0 = a0 + (a1 - a0) / 2; ICON(ctx, "tomato", cx + Math.cos(tm0) * (R + 110), cy + Math.sin(tm0) * (R + 110), .8 * pop(t, AT[i] + .3, .3), 1); }
        if (i < 3 && t >= AT[i] + .6){ const b0 = a1, b1 = a0 + Math.PI / 2, ub = easeIO(fin(t, AT[i] + .6, .3)); ctx.strokeStyle = "#5B9BD5"; ctx.lineWidth = 110; ctx.beginPath(); ctx.arc(cx, cy, R, b0 + .02, b0 + .02 + (b1 - b0 - .04) * ub); ctx.stroke(); } }
      if (t >= la){ const a0 = -Math.PI / 2 + 3 * Math.PI / 2 + Math.PI / 2 * .8, a1 = -Math.PI / 2 + 2 * Math.PI, u = easeIO(fin(t, la, .8)); ctx.strokeStyle = TEAL; ctx.lineWidth = 110; ctx.beginPath(); ctx.arc(cx, cy, R, a0 + .02, a0 + .02 + (a1 - a0 - .04) * u); ctx.stroke(); const ch = pop(t, la + .6, .4); ctx.save(); ctx.translate(cx + 210, cy - 380); ctx.scale(ch, ch); ICON(ctx, "cup", -90, 0, 1.2, 1); T(ctx, "15–30 MENIT", 20, 14, 40, { col: TEAL }); ctx.restore(); }
      ctx.beginPath(); ctx.arc(cx, cy, 200, 0, TAU); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke(); const n = AT.filter(a => t >= a + .4).length; T(ctx, t >= lb ? "±2 JAM" : String(n) + " / 4", cx, cy + 14, t >= lb ? 78 : 110, { align: "center", col: ORANGE }); T(ctx, t >= lb ? "FOKUS" : "SESI", cx, cy + 90, 40, { align: "center", col: NAVY, track: 4 });
      [["#E78A3E", "25 menit fokus"], ["#5B9BD5", "5 menit istirahat"], [TEAL, "istirahat panjang"]].forEach(([c, tx], i) => { const a = pop(t, f.at + .8 + i * .3, .35); ctx.save(); ctx.translate(1290, 430 + i * 120); ctx.scale(a, a); P(ctx, 0, -34, 68, 68, 14, c, 5, OUT); T(ctx, tx, 100, 14, 44, { col: NAVY, w: 800 }); ctx.restore(); });
    } else { const X0 = 360, LA = tm(f, f.laneBAt, 5), W = 1300;
      T(ctx, "8 JAM PINDAH-PINDAH", X0, 250, 46, { col: NAVY, track: 2 }); const pa = easeIO(fin(t, f.at + .4, 1.6)); P(ctx, X0, 290, W * pa, 100, 14, "#B9B2A6", 6, OUT); for (let i = 0; i < 9; i++) if (W * pa > 150 * i + 60) P(ctx, X0 + 60 + i * 140, 300, 28, 80, 6, "#6EC39A", 3, OUT); T(ctx, "HASIL", X0 - 20, 480, 36, { align: "right", col: ORANGE, track: 2 }); const ra = easeIO(fin(t, f.at + 2.4, 1)); P(ctx, X0, 440, Math.max(10, 380 * ra), 70, 14, "#F4A85C", 6, OUT);
      T(ctx, "2–3 JAM FOKUS", X0, 660, 46, { col: NAVY, track: 2 }); const pb = easeIO(fin(t, LA, 1.2)); P(ctx, X0, 700, Math.max(10, 520 * pb), 100, 14, "#6EC39A", 6, OUT); T(ctx, "HASIL", X0 - 20, 890, 36, { align: "right", col: ORANGE, track: 2 }); const rb = easeIO(fin(t, LA + 1.6, 1.2)); P(ctx, X0, 850, Math.max(10, 1050 * rb), 70, 14, "#E78A3E", 6, OUT);
      if (rb > .95) chip(ctx, 1500, 700, pop(t, LA + 2.9, .4), "LEBIH BANYAK", GREEN, "#FFF", 44, .03); }
    ctx.restore();
    if (f.chip) chip(ctx, 960, 90, pop(t, tm(f, f.chipAt, .8), .45), f.chip, NAVY, YEL, 40, -.01);
  }, sfx(f, g, add){ if ((f.mode || "ring") === "ring"){ (f.arcAt || [0, .6, 1.2, 1.8]).forEach(a => add(g(tm(f, a)), "pop", .5)); add(g(tm(f, f.longAt, 4.5)), "chime", .5); } else { add(g(f.at + .4), "rise", .3, 1.6); add(g(tm(f, f.laneBAt, 5)), "whoosh", .4); } } };

  // ---- poin 6: sesuaikan
  FX.adaptDay = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .5), md = f.mode || "queue"; bgGrad(ctx, "#EDE6F5", "#D5C9E6"); dots(ctx, t, "#5B4B8A", .08); ctx.save(); ctx.globalAlpha = k;
    if (md === "queue"){ const TK = ["Struk tidak keluar", "Printer error", "Lupa kata sandi", "Koneksi putus", "Stok tidak cocok", "Kasir macet"]; T(ctx, "ANTREAN TIKET", 500, 200, 40, { align: "center", col: NAVY, track: 4 });
      TK.forEach((tx, i) => { const a = pop(t, f.at + .4 + i * .5, .35), y = 290 + i * 112; if (a <= 0) return; ctx.save(); ctx.translate(500, y); ctx.scale(a, a); P(ctx, -330, -44, 660, 88, 18, "#FFFFFF", 6, OUT); ctx.fillStyle = i < 2 ? RED : YEL; ctx.fillRect(-330, -44, 22, 88); T(ctx, "#" + (1042 + i) + " · " + tx, -280, 12, 34, { col: "#111827", w: 700, maxW: 580 }); ctx.restore(); });
      const s = pop(t, f.at + 1.2, .5); ctx.save(); ctx.translate(1380, 620); ctx.scale(s, s); TOMATO(ctx, 0, 140, 1.5, 1, 0); P(ctx, -140, -300, 280, 110, 24, NAVY, 6, OUT); T(ctx, "15:00", 0, -218, 78, { align: "center", col: "#7CF2B0", w: 800 }); ctx.restore(); chip(ctx, 1380, 190, pop(t, f.at + 1.6, .45), "SESI 15 MENIT", ORANGE, "#FFF", 50, .02);
    } else if (md === "status"){ const sa = tm(f, f.statusAt, .5), ca = tm(f, f.calAt, 5); ctx.save(); ctx.translate(560, 460); P(ctx, -380, -280, 760, 560, 26, "#FFFFFF", 8, OUT); ctx.fillStyle = "#1E7B4A"; rr(ctx, -380, -280, 760, 78, 26); ctx.fill(); ctx.fillRect(-380, -240, 760, 38); T(ctx, "Tim Layanan Pelanggan", -340, -228, 34, { col: "#FFF" });
      const s = pop(t, sa, .4); ctx.save(); ctx.translate(0, -60); ctx.scale(s, s); ctx.beginPath(); ctx.arc(-300, -10, 40, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); P(ctx, -240, -62, 590, 160, 26, "#FFF1C9", 5, OUT); T(ctx, "● STATUS", -214, -20, 26, { col: RED, track: 2 }); T(ctx, typed("Fokus sampai 10.25. Darurat telepon saja.", t, sa + .4, 22), -214, 36, 34, { col: BROWN, w: 800, maxW: 540 }); ctx.restore(); ctx.restore();
      ctx.save(); ctx.translate(1380, 520); P(ctx, -280, -400, 560, 800, 26, "#FFFDF8", 8, OUT); ctx.fillStyle = GREEN; rr(ctx, -280, -400, 560, 76, 26); ctx.fill(); ctx.fillRect(-280, -360, 560, 36); T(ctx, "KALENDER · SENIN", 0, -346, 32, { align: "center", col: "#FFF", track: 2 });
      for (let r = 0; r < 6; r++){ ctx.strokeStyle = "#E5E7EB"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-240, -290 + r * 110); ctx.lineTo(260, -290 + r * 110); ctx.stroke(); T(ctx, String(8 + r).padStart(2, "0") + ".00", -250, -250 + r * 110, 24, { col: "#6B7280", w: 700 }); }
      const b = easeIO(fin(t, ca, .6)); if (b > 0){ P(ctx, -150, -290, 400, 220 * b, 14, ORANGE, 6, OUT); if (b > .7) T(ctx, "Fokus: rekap", 50, -170, 36, { align: "center", col: "#FFF" }); } ctx.restore(); chip(ctx, 960, 110, pop(t, f.at + .5, .4), f.chip || "BERI TAHU TIM", NAVY, YEL, 44, -.012);
    } else { const a1 = tm(f, f.oldAt, .5), a2 = tm(f, f.newAt, 3); paperSheet(ctx, 560, 540, 640, 760, "DULU", -.04); paperSheet(ctx, 1360, 540, 640, 760, "SEKARANG", .04);
      tally(ctx, 300, 300, Math.min(60, Math.floor(Math.max(0, t - a1) * 18)), 1.0, RED); tally(ctx, 1180, 300, Math.min(6, Math.floor(Math.max(0, t - a2) * 2.2)), 1.2, GREEN);
      const ar = pop(t, a2 - .3, .4); ctx.save(); ctx.translate(960, 540); ctx.scale(ar, ar); ctx.strokeStyle = ORANGE; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(60, 0); ctx.moveTo(20, -40); ctx.lineTo(70, 0); ctx.lineTo(20, 40); ctx.stroke(); ctx.restore(); T(ctx, "PELAN-PELAN", 960, 620, 28, { align: "center", col: ORANGE, track: 2 });
      chip(ctx, 960, 130, pop(t, f.at + .5, .4), f.chip || "FOKUS = OTOT", NAVY, YEL, 52, -.012); }
    ctx.restore();
  }, sfx(f, g, add){ const md = f.mode || "queue"; if (md === "queue") for (let i = 0; i < 6; i++) add(g(f.at + .4 + i * .5), "notif", .3); else if (md === "status"){ add(g(tm(f, f.statusAt, .5)), "pop", .5); add(g(tm(f, f.calAt, 5)), "stamp", .6); } else { add(g(tm(f, f.oldAt, .5)), "typing", .4, 3); add(g(tm(f, f.newAt, 3)), "stamp", .6); } } };

  // ---- teaser Eps 3: daftar 23 butir vs 3 baris
  const LIST = ["Balas email klien", "Rapikan laporan", "Telepon vendor", "Susun rencana", "Cek stok barang", "Kirim proposal", "Belajar skill baru", "Perbarui data", "Isi form cuti", "Tanya jadwal rapat", "Rapikan meja", "Unduh faktur", "Hubungi Pak Joko", "Revisi presentasi", "Catat pengeluaran", "Pesan galon", "Balas grup", "Cetak dokumen", "Rekap keluhan", "Cek tiket lama", "Atur ulang folder", "Kirim terima kasih", "Update jadwal"];
  FX.longList = { layer: "screen", draw(ctx, f, t){
    const q = t - f.at, k = fin(q, 0, .5), md = f.mode || "list"; bgGrad(ctx, "#FFF4E2", "#F3DDB8"); dots(ctx, t, "#C2691F", .07); ctx.save(); ctx.globalAlpha = k;
    const RH = 74, total = LIST.length * RH, sc = md === "vs" ? lerp(1, .5, easeIO(fin(t, f.at + .3, 1))) : 1, scr = md === "vs" ? 0 : easeIO(clamp((q - .5) / (f.dur ?? 7), 0, 1)) * (total - 560), cxL = md === "vs" ? 560 : 960;
    ctx.save(); ctx.translate(cxL, md === "vs" ? 540 : 540); ctx.scale(sc, sc); ctx.translate(0, md === "vs" ? -total / 2 + 300 : -scr + 20); P(ctx, -340, -100, 680, total + 220, 16, "#FFFDF8", 8, OUT); LIST.forEach((tx, i) => { const y = i * RH + 30; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -300, y - 24, 44, 44, 8); ctx.stroke(); T(ctx, (i + 1) + ". " + tx, -226, y + 12, 36, { col: NAVY, w: 700, maxW: 520 }); }); ctx.restore();
    const shown = md === "vs" ? LIST.length : Math.min(LIST.length, Math.floor(9 + scr / RH + 3)); P(ctx, md === "vs" ? 960 - 410 : 1460 - 130, md === "vs" ? 470 : 60, 260, 130, 26, RED, 7, OUT); T(ctx, String(shown), md === "vs" ? 960 - 410 + 130 : 1460, md === "vs" ? 556 : 150, 90, { align: "center", col: "#FFF" }); T(ctx, "BUTIR", md === "vs" ? 960 - 410 + 130 : 1460, md === "vs" ? 600 : 194, 26, { align: "center", col: "#FFE9C8", track: 3 });
    if (md === "vs"){ const a = pop(t, f.at + 1.2, .5); ctx.save(); ctx.translate(1380, 540); ctx.scale(a, a); ctx.rotate(.03); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; P(ctx, -280, -330, 560, 660, 14, "#FFE27A", 0); ctx.shadowColor = "transparent"; P(ctx, -280, -330, 560, 660, 14, "#FFE27A", 8, OUT); ctx.fillStyle = "rgba(0,0,0,.12)"; ctx.fillRect(-280, -330, 560, 60); T(ctx, "BUKU CATATAN", 0, -272, 36, { align: "center", col: BROWN, track: 4 });
      ["Rekap keluhan", "Balas klien besar", "Kirim proposal"].forEach((tx, i) => { const y = -150 + i * 120; ctx.strokeStyle = BROWN; ctx.lineWidth = 5; rr(ctx, -230, y - 30, 56, 56, 10); ctx.stroke(); T(ctx, tx, -140, y + 14, 44, { col: BROWN, w: 800, maxW: 400 }); }); ctx.restore(); P(ctx, 1380 - 130, 60, 260, 130, 26, GREEN, 7, OUT); T(ctx, "3", 1380, 150, 90, { align: "center", col: "#FFF" }); T(ctx, "BARIS", 1380, 194, 26, { align: "center", col: "#E1F5E9", track: 3 }); }
    ctx.restore(); if (f.chip) chip(ctx, md === "vs" ? 960 : 520, md === "vs" ? 980 : 160, pop(t, tm(f, f.chipAt, 1.2), .45), f.chip, NAVY, YEL, 42, -.012);
  }, sfx(f, g, add){ if ((f.mode || "list") === "vs") add(g(f.at + 1.2), "stamp", .6); else add(g(f.at + .5), "rise", .3, f.dur ?? 7); } };

  FX.tomatoMini = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .45); if (s <= 0) return; ctx.save(); ctx.translate(f.x ?? 250, f.y ?? 330); ctx.rotate(-.05 + Math.sin(t * 1.4) * .02); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; ctx.scale(s * (f.s || 1), s * (f.s || 1)); PROP.tomatoTimer(ctx, { s: 1, run: 1 }, t); ctx.restore(); }, sfx(f, g, add){ add(g(f.at), "pop", .5); } };

  ["pointCard", "treadmill", "nightList", "timeBars", "bigStat", "brainDump", "twoLamps", "weekPlan", "passCard", "morningRule", "recapList", "tomatoBig", "leakBucket", "lostCursor", "focusGraph", "splitTask", "closeTabs", "noteDistract", "urgeWave", "breakTimeline", "cycleRing", "adaptDay", "longList"].forEach(n => { const d0 = FX[n].draw; FX[n].draw = (ctx, f, t) => { ctx.save(); const z = 1 + .015 + Math.min(Math.max(0, t - f.at) * (f.push ?? .004), .04); ctx.translate(960 + Math.sin(t * .5) * 18, 540 + Math.cos(t * .4) * 12); ctx.scale(z, z); ctx.rotate(Math.sin(t * .6) * .003); ctx.translate(-960, -540); try { d0(ctx, f, t); } finally { ctx.restore(); } }; });

  /* ============================== THUMBNAIL ============================== */
  S.thumbs = S.thumbs || {};
  S.thumbs.kp1 = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    bgDark(x, 3); x.save(); x.translate(700, 480); x.rotate(.04); x.scale(.8, .8);
    const cols = ["rgba(217,72,59,.55)", "rgba(59,163,107,.5)", "rgba(246,195,67,.6)", "rgba(156,163,175,.45)"]; P(x, -480, -400, 960, 800, 40, "#FBFBF8", 10, OUT);
    for (let q = 0; q < 4; q++){ const cx = q % 2, cy = q >> 1; x.fillStyle = cols[q]; rr(x, -456 + cx * 464, -376 + cy * 384, 440, 360, 20); x.fill(); }
    x.strokeStyle = NAVY; x.lineWidth = 14; x.lineCap = "round"; x.beginPath(); x.moveTo(0, -396); x.lineTo(0, 396); x.moveTo(-476, 0); x.lineTo(476, 0); x.stroke();
    [[-232, -300, "MENDESAK"], [232, -300, "TIDAK"]].forEach(([px, py, tx]) => T(x, tx, px, py, 40, { align: "center", col: NAVY, track: 2 }));
    STICKY.slice(0, 4).forEach((col, i) => stickyNote(x, -400 + (i % 2) * 150 + i * 20, -200 + Math.floor(i / 2) * 120 + i * 10, 1.5, (i - 1.5) * .12, ["Siap!", "Galon", "Foto kardus", "Stiker"][i], col, { size: 20 })); x.restore();
    x.fillStyle = 'rgba(11,20,38,.25)'; x.fillRect(0, 0, 1920, 1080);
    const put = (who, o, key, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: 1, seed: 3 }, look, o, { keys: [Object.assign({ at: 0 }, key)] }); const st = TT.toonState(a, null, t); st.talk = false; TT.drawToon(x, a, st, t); };
    put('bayu', { x: 400, y: 1790, size: 1420, face: 1 }, { pose: 'phone', expr: 'scared', look: 'cam', emote: 'sweat' }, 5.25);
    const k = 1420 / 92; PROP.hand_phoneBuzz(x, 400 + 17 * k, 1790 - 43 * k, k, 1, 5.25);
    return c.toDataURL('image/png').slice(22); };
  S.thumbs.kp2b = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    bgDark(x, 3); x.save(); x.translate(640, 540); for (let i = 0; i < 16; i++){ x.rotate(TAU / 16); x.fillStyle = "rgba(246,195,67,.07)"; x.beginPath(); x.moveTo(0, 0); x.lineTo(1500, -110); x.lineTo(1500, 110); x.closePath(); x.fill(); } x.restore();
    ["Chat tim", "Video lucu", "Toko daring", "Berita", "Meme", "Email"].forEach((nm, i) => { x.save(); x.translate(130 + (i % 2) * 360 + i * 22, 190 + i * 128); x.rotate((i % 2 ? .1 : -.1)); x.globalAlpha = .5; P(x, -130, -34, 260, 68, 14, "#CBD1D8", 4, OUT); T(x, nm, 0, 10, 28, { align: "center", col: "#374151" }); x.restore(); });
    x.save(); x.shadowColor = "rgba(0,0,0,.4)"; x.shadowBlur = 40; x.shadowOffsetY = 20; x.translate(620, 960); x.scale(3.7, 3.7); PROP.tomatoTimer(x, { s: 1, run: 0 }, 3); x.restore();
    x.fillStyle = 'rgba(11,20,38,.12)'; x.fillRect(0, 0, 1920, 1080);
    return c.toDataURL('image/png').slice(22); };
  S.thumbs.kp1b = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    bgDark(x, 3); x.save(); x.translate(620, 560); x.rotate(-.04); x.scale(.98, .98);
    const cols = ["rgba(217,72,59,.6)", "rgba(59,163,107,.55)", "rgba(246,195,67,.65)", "rgba(156,163,175,.5)"]; P(x, -480, -400, 960, 800, 40, "#FBFBF8", 10, OUT);
    for (let q = 0; q < 4; q++){ const cx = q % 2, cy = q >> 1; x.fillStyle = cols[q]; rr(x, -456 + cx * 464, -376 + cy * 384, 440, 360, 20); x.fill(); }
    x.strokeStyle = NAVY; x.lineWidth = 14; x.lineCap = "round"; x.beginPath(); x.moveTo(0, -396); x.lineTo(0, 396); x.moveTo(-476, 0); x.lineTo(476, 0); x.stroke();
    [[-232, -300, "MENDESAK"], [232, -300, "TIDAK"]].forEach(([px, py, tx]) => T(x, tx, px, py, 44, { align: "center", col: NAVY, track: 2 }));
    [[-232, -180, "1", RED], [232, -180, "2", GREEN], [-232, 190, "3", "#B8860B"], [232, 190, "4", "#6B7280"]].forEach(([px, py, n, col]) => { x.beginPath(); x.arc(px, py, 92, 0, TAU); x.fillStyle = col; x.fill(); x.strokeStyle = OUT; x.lineWidth = 8; x.stroke(); T(x, n, px, py + 44, 130, { align: "center", col: "#FFF" }); });
    x.restore(); x.fillStyle = 'rgba(11,20,38,.22)'; x.fillRect(0, 0, 1920, 1080);
    return c.toDataURL('image/png').slice(22); };
})();
