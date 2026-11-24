# Jebakan tata letak MODE CERITA (pelajaran QC batch hari 182–271)

Baca sebelum merancang kamera/komposisi. Semua ini muncul di lembar kontak batch lalu dan butuh satu putaran perbaikan.

## Subtitle & lantai
- Area subtitle layar y 1300–1460. Objek lantai (batu, kardus, gawang, meja) jatuh di sana bila kamera y≈1000–1100. Kamera y≈1330–1350 zoom 1 menaruh lantai di layar ≈1250–1270 dan kepala tokoh 700 px di ≈720.
- Tokoh anak (size ≤580) atau tokoh 560 px di tengah: wajahnya masuk area subtitle. Taruh di samping, kamera zoom ≈0.9, naikkan `y` tokoh (mis. 1480), atau `motion.subY: 1560`.
- Label/chip di dasar lubang atau lantai yang naik: tampilkan sebagai chip layar (y ≈330).
- Panggung: lantai panggung y≈1400 + kamera y≈1030 supaya tokoh di atas subtitle.

## Lingkungan
- `TT.envFront("park")` dan envfront `sky` menggambar semak/awan di depan yang menutupi objek bawah: pakai `"front": false`.
- Latar buatan sendiri di koordinat dunia y≈380–800 terpotong di atas bila kamera y≈1300: geser turun ±270 atau pakai kamera y lebih kecil.
- Tirai/latar yang digambar di `back` setelah papan judul menutupinya: gambar latar dulu, papan sesudahnya.

## Tokoh
- `TT.toonHead` tidak memperhitungkan pose `sit` (kepala 13 unit lebih rendah); kamera `on`/`fit` dan efek di kepala meleset tanpa koreksi. Tokoh duduk tetap tinggi: kepala bisa menabrak atap/papan.
- Tokoh naik motor (pose sit): y = 1640 − 20·size/92 agar duduk di jok.
- Tokoh 680–740 px di x≤230 terpotong di tepi kiri bila zoom >1.03 atau kamera digeser ke kanan: jaga cam x ≤560 saat tokoh di kiri. Close-up `on`+`fit` ke satu tokoh memotong tokoh kedua: untuk dua tokoh pakai x/zoom ±1.1.
- Menggambar tokoh di dalam hook yang sudah di-`layer`: pakai `TT.drawToon`, bukan `toon()` (kamera dobel). Hook `back` jalan sebelum tokoh digambar (boleh mengubah `sts[j].y`).
- Toon di belakang meja dapur (counter top 1330) bisa tertutup objek di atas meja: skala objek ±0.75.

## Objek, kartu, benda di tangan
- Objek melayang (dialog, toples, hologram) butuh lebar ≥600 px agar terbaca; objek melayang besar di y dunia ≤600 agar tidak menutupi kepala (y≈1080).
- Kartu info di layar y≈200–450 menutupi objek di atas y≈480: beri outCue sebelum objek tampil penuh. Kartu setinggi dada (y dunia ≈1180) menutupi wajah tokoh 720 px: taruh di y≈1330.
- Lencana/teks yang ditempel ke tangan jatuh di wajah saat close-up: taruh di samping kepala (koordinat layar). Papan yang dipegang menutupi wajah sendiri/tetangga: pakai infoCard kecil (x, w 440).
- Benda di tangan (hold/over1) tergambar SEBELUM lapisan `front` sehingga tertutup objek depan: gambar alat di hook `front`.
- base() dari paket lama hanya mengirim s/flip/rot ke drawItem: kirim seluruh objek hold (text, col, w ikut).
- Balon pikiran puffC 22u terlalu besar untuk toon 740 px: skala ±0.55. Potongan kepala (cut-away) taruh di area otak, bukan setengah bawah wajah.

## Kode & waktu
- `easeIO` dan helper easing BUKAN global: ambil dari TT. Tanpa itu adegan hitam tapi qc.py tetap "errors: none" → selalu lihat lembar kontak.
- `eBack(0)` = 2e-16 (>0): tulis `t < T0 ? 0 : eBack(...)`, jangan `if (q > 0)`.
- cueT memakai kemunculan PERTAMA kata di VO adegan ("Dua" kena "dua puluh lima"): pilih kata cue unik.
- Helper chip yang meng-clamp x: clamp di koordinat layar SEBELUM ctx.translate.
- Pack layout di dalam `shots` harus membaca data shot aktif (shotOf(s,t).F), bukan s.f.
- Tur dengan pos berjauhan tak terkejar saat kata cue berdekatan: taruh pos dalam satu bidikan lebar (≈390 px) dan `run: true`.

## Proses
- Generator yang dijalankan `python3 -I` tidak menemukan modul di foldernya: sisipkan sys.path sendiri.
- tools/motion.py: `ENGINE_HTML CODE OUTDIR`, jalankan dari tools/. Uji gerak cukup ±15 dtk per episode. Frame cepat: frames_at + montase PIL.
- Redirect log render ke path relatif `> ../$W/...` gagal diam-diam: pakai path log absolut.
- fit_vo 59,19 dtk → QC "Durasi 59.9": pad vo.mp3 dengan ffmpeg `-af apad -t 59.25` (bukan TTS ulang). Jeda koma pendek di awal adegan (batas ✗): pendekkan jeda di vo.mp3 dengan ffmpeg (minGap mesin 0,2 dtk). `P.nudges` di project.json tidak berlaku saat render.
- Menghentikan satu render: `pkill -f '[r]ender_explainer.py.*--out KODE-'`.
- Agen paralel di job yang sama sering memilih LATAR/konsep sama (laundry, bazar, bengkel, halte, rasi bintang, tur kantor). Cek `grep -o 'PX + "[a-z]*", "[^"]*"' engine/packs/j*.js` dan lembar kontak qc/ agen lain di site/data/jobs/<job>/agent*/ di awal DAN tepat sebelum render final; bila mirip, ganti latar/desain tokoh.

## Tambahan batch hari 312–316 (paket j2611221508201)
- Close-up papan/lempeng yang berdiri di belakang tokoh (kamera y≈780, zoom 1.25) menaruh setengah atas kepala tokoh di area subtitle: pakai y≈840, zoom ≤1.15.
- Benda jatuh/pecah di lantai (pot, pecahan) baru terlihat di atas subtitle bila kamera y≈1360 tepat saat benturan; kamera y≈1200 masih menaruh lantai di layar ≈1380.
- Tokoh benda besar berdiri di lantai (pot berwajah 3×) wajahnya jatuh di area subtitle pada kamera y≈1000–1180: pakai kamera y≈1300 dan geser benda latar atas (kartu merah) turun.
- Mengubah `sts[j].look` (mata mengikuti benda) harus di hook `back`; di `mid` tokohnya sudah tergambar.
- Toon 700 px berhijab tampak lebih lebar: jarak antar-tokoh ≥340 (bukan 300) agar kepala tidak bertumpuk; untuk 4 tokoh pakai size ≈600–640.

## Tambahan batch hari 327–331 (paket j2611221631522)
- Kuota ELEVENLABS_K1 bisa habis di tengah batch (job 261122163152: habis setelah 3 VO) dan K2 tidak selalu ada di environment: jalankan TTS SEMUA episode di awal, sebelum menulis adegan, supaya ketahuan lebih cepat; episode tanpa VO Citra jangan diberi episode.json (simpan di $W/<pack>/pending/).
- Env `sky`/`sunset` sebagai latar kebun/bukit: kirim `envFront: false` di base() atau awan depan menutup setengah bawah layar.
- Tokoh "jatuh" berbaring (rotasi −90°) menaruh kepalanya di area subtitle atau di dekat kaki tokoh lain saat close-up; lebih aman jatuh terduduk (rotasi ±0,3 + pose sit + y turun 16·size/92) dan letakkan ≥600 px dari tokoh yang di-close-up.
- Agen paralel job yang sama (j…521 SB47) memakai gelembung sabun janji karier; cek header paket job sendiri sebelum render, bukan hanya di awal.

## Tambahan batch hari 347–351 (paket j2611221631542)
- Kuota ELEVENLABS_K1 bisa habis di tengah job (sisa < ±330 kredit per episode) dan K2 tidak selalu dikirim: kerjakan adegan + QC dengan VO robot, simpan sebagai vo_dummy_uji.mp3 (jangan biarkan bernama vo.mp3), siapkan skrip penyelesai TTS→QC→render.
- Dua penumpang motor (tampak samping): penumpang di belakang pakai z=-1 dan gambar motor di hook `under` untuk tokoh yang PERTAMA digambar (urutan z), bukan selalu indeks 0; kalau tidak, motor menutupi pengemudi.
- Benda besar yang "diangkat" tokoh: pose `cheer` menaruh tangan setinggi pusat kepala, jadi benda di atas kepala tampak melayang; beri tiang/penopang dari tangan ke benda.
- Agen paralel di batch ini memakai karung uang (j…522) dan piala proyek (j…543, j…524): hindari karung/piala sebagai objek utama.

## Tambahan batch hari 342–346 (paket j2611221631541)
- Agen paralel job yang sama memakai wayang kulit/bayangan di kelir (j…542 KD50) dan koin berkaki yang berjalan (j…542 SC50); nama tokoh juga sering kembar (Sari, Yoga, Laras, Tika, Nisa, Gilang, Dina dipakai paket paralel). Grep `vo.py` semua agen di site/data/jobs/2611221631*/ untuk nama SEBELUM TTS, dan header paket j<tanggal>* sebelum render.
- Kunci `at` pada keys tokoh di dalam `shots` dihitung dari awal ADEGAN, bukan awal shot: balon `say` dengan `at: 0` di shot kedua tidak pernah tampil. Pakai `cue` (kata pertama shot).
- Benda diayun dari tangan (palu): dengan `ctx.scale(-face,1)` + `rotate(a)` kepala benda ada di (L·sin a, L·cos a); ayun lewat atas (a menurun dari −2,4 ke −5,15), bukan lewat bawah/depan wajah. Posisikan tokoh per pukulan (x = lubang − 21k − L·sin a).

## Tambahan batch hari 357–361 (paket j2611221631544)
- Galat di dalam fungsi adegan (mis. `ctx is not defined` di helper hook yang didefinisikan di luar fungsi adegan) hanya muncul sebagai `console.error`, bukan `pageerror`: qc.py/frames_at tetap "errors: none" dan tokoh/objek hilang diam-diam. Tangkap konsol (`pg.on("console", ...)`) saat cek frame, dan oper `ctx` sebagai argumen ke helper hook.
- Bagian adegan yang memakai `cueT` bekerja di waktu LOKAL adegan; log debug dengan syarat waktu global tidak akan pernah tercetak.
- Agen paralel memakai: kunang-kunang + jendela gedung menyala (j…524), gelembung sabun mimpi/janji (j…522, j…521), keluhan berpindah dari mulut ke mulut (j…521), kertas tempel di tutup laptop / pintu lemari (j…521), nenek-ibu di bangku taman + bingkai sulam (j…542), kata mengorbit kepala (j…524). Grep header paket j<tanggal>* SEBELUM TTS — naskah masih bisa diubah gratis.
- Kuota ElevenLabs bisa habis di tengah batch (K1 sisa 281 kredit, ±320 per VO, K2 tidak diberikan): bangun & QC semua adegan dengan VO robot, lalu coba ulang tts.sh berkala (gagal kuota tidak memotong kredit).

## Tambahan batch hari 352–356 (paket j2611221631543)
- Toon pose `sit` memajukan kepala ±14 unit ke arah hadap: dua tokoh duduk berhadapan di sofa/bangku butuh jarak x ≥ 480 (size 660–680), bukan 340.
- Objek di atas kepala tokoh (mesin, panel, awan pikiran): hitung posisinya dari `toonState` di awal fungsi adegan agar `spots` kamera tidak tertinggal satu frame; tokoh 720 px + objek 320 px muat bila kamera y ≈ 1000.
- Alas pameran/meja set-piece yang lebih rendah dari kepala tokoh membuat benda di atasnya tertutup kepala saat tokoh lewat; naikkan alas (top ≈ GY-720) supaya benda di atas kepala.
- Strip/garis kontras (hazard kuning) di layar y 1300–1460 membuat subtitle sulit dibaca; pindahkan ke bawah.
- Konsep yang sudah dipakai paket ini: mesin slot CAPAIANKU di atas kepala, museum setahun (kain ditarik dari alas), piala menguap abu-abu, parkiran motor + tiang beton, lampion atap kantor, laptop autopilot + kacamata hitam, lembar jawaban AI dilingkari spidol, delman berkuda AI, gelembung pesan jadi centang, bingkai foto berdebu, cap tangan di semen basah / pijakan melayang, lemari menyemburkan barang salah, layar terbelah rumah sakit | pedalaman, buku pop-up MAP KELUARGA, PIN-nyamuk + raket listrik.

## Tambahan batch hari 322–326 (paket j2611221631521)
- `motion.host` tokoh pria bertopi (`hat: "cap"`) tanpa `hair` tergambar seperti berkerudung oranye di CTA: selalu isi `hair` (mis. `"short"`) untuk host pria.
- Empat tokoh 640 px berjajar (rantai bisik) dengan jarak 340 dan zoom 0,9 kepalanya bersentuhan: pakai jarak ≥400 dan biarkan kamera mengikuti objek yang berpindah lewat `spots: {msg: () => [x, y, zoom]}` + key kamera `{"cue": ..., "on": "msg"}` (fungsi spot menghitung posisi sendiri dari `toonState(s.f.toons[j], s, t)`).
- Sampul buku yang dibuka (`scaleX` lewat engsel) harus digambar SEBELUM halaman kiri saat sudah terbuka, kalau tidak sampul menutupi halaman kiri.
- Kartu yang dibalik dengan `scale(|cos|, 1)` tidak perlu `scale(-1, 1)` lagi di sisi belakang; kalau ditambah, teks jawaban tercermin.
- Kuota ElevenLabs bisa habis di tengah job (K1 tersisa 281 kredit, satu episode ±320): siapkan semuanya dengan VO robot (dummy_vo + dummy_fit), jangan render final, dan tinggalkan skrip render_all.sh (TTS → QC → render) di folder kerja.
- Paket paralel dari job lain yang jalan bersamaan (2611221631 5x) memakai stiker di laptop, gunting memangkas rambut "Si Jawaban" AI, gelembung sabun di cuci mobil: cek ulang SEMUA engine/packs/j<tanggal>* tepat sebelum TTS; selama VO belum dibuat, mengganti konsep & nama tokoh masih gratis.

## Tambahan batch hari 362–365 (paket j2611221703151)
- Biaya ElevenLabs ±0,4 kredit per karakter teks (841 karakter = 336 kredit). Bila sisa kredit tidak cukup untuk satu naskah penuh, naskah ±100 kata (≤690 karakter) masih bisa dibuat.
- Citra membaca ±2,1 kata/dtk: 97 kata = 45,5 dtk, sehingga fit_vo menaruh ±9 dtk hening di ekor (CTA terlalu lama). Sebar ulang dari vo_raw.mp3 tanpa TTS ulang: `$W/j2611221703151/refit.py RAW OUT "b1,..,b5"` (atempo 0,95 + 1,2 dtk di 5 jeda paragraf + 0,22 dtk di jeda kalimat; b = awal hening paragraf di vo_raw, cari dengan silencedetect).
- Tokoh di belakang konter dengan kardus di atas konter: kardus (lebar ±250) menutupi wajah bila jaraknya <300 px dari tokoh; geser kardus ke sisi jauh.
- Helm/topi kebesaran yang digambar di atas kepala tokoh (r ≥30 unit) menutupi seluruh wajah; pakai r ≈28 unit dan tepi bawah sedikit di bawah mata agar mulut/ekspresi tetap terbaca.
- Tokoh memanjat tiang: ubah `sts[j].y` di AWAL hook `back` (sebelum benda lain yang membaca posisi tokoh, mis. pijakan yang menyala), lalu kamera `on` ke spot fungsi `() => [x, y - 600, null]` + `zoom` di key.
