# Briefing: video "1 Menit 1 Insight" Tangani Talenta dengan adegan BARU (mode adegan)

Daftar episode, nama paket, dan folder kerja W diberikan di tugasmu. Gaya per series/kuartal dipilih otomatis oleh mesin.
Proyek: /var/www/tangani_talenta/tangani_talenta_video (jalankan semua perintah dari folder ini).
Alat bersama ada di tools/ (tts.sh, qc.py, frames_at.py, mk_lib.py, dummy_vo.sh, dummy_fit.sh, motion.py [`$V -I tools/motion.py engine/studio-<pack>.html CODE $W/mot` = uji gerak per adegan], pack_template.js, examples/). Folder kerjamu W (diberikan di tugasmu) untuk skrip generator, lembar kontak, dan file uji.
Python render: V=~/.cache/studio-deps/venv/bin/python (playwright). Selalu pakai `python3 -I` / `$V -I`.

Seri video edukasi karyawan 60 detik, 9:16, narasi suara ElevenLabs "Citra". Warna Tangani (krem, oranye #C2691F, cokelat #3B2418). Header logo + footer sudah otomatis dari mesin; gaya latar per series juga otomatis. Untuk kuartal 2 (episode nomor 14–26) sedang dibuat GAYA BARU per series oleh agen lain di engine/motion-tangani.js (latar, transisi, subtitle, font baru). Jangan mengandalkan tampilan latar lama; adeganmu harus terbaca di atas latar terang maupun gelap (KD tetap gelap). Tugasmu: 5 episode, masing-masing dengan adegan yang BELUM PERNAH dipakai di 141 video sebelumnya (hari 1–141).

## 1. Bikin paket adegan barumu
- Salin templat `tools/pack_template.js` ke `engine/packs/<pack>.js` (nama pack diberikan di tugasmu). Daftarkan tiap adegan dengan `TT.layout(name, label, draw, sfx)`.
- Pelajari pola gambar yang sudah ada di `engine/motion-tangani.js`: set 5 (cari `fifth set:` — lock, inbox, domino, map, comic, funnel, kanban, calendar, dart, puzzle, tree, bucket) adalah contoh terbaik; rig tokoh bergerak ada di `actorState`/`drawActor`/`emoteAt`/`bubbleAt` (sekitar baris 640–790, lihat juga R.stage dan R.comic untuk cara memakai: actor {x, hair: short|long|hijab, hijab, shirt, skin a–d, glasses, pose, expr, keys:[{cue|at, x, speed, pose, expr, say, emote, sit, show, nod, shake}]}). Pose/ekspresi/emote yang valid: lihat kodenya.
- Helper global mesin: rr, font(ctx, weight, size, th.fam), icon(ctx, name, x, y, size, color, lw), hexA, clamp, eOut, eBack, prog, headline, drawRich, wrapRich, TL, P, R. Helper paket lewat `TT` (lihat templat). Ikon: link, unlink, help, users, user-x, code, server, graduation, check, chart, chat, cart, receipt, gear, clock, wallet, leaf, truck, shield, phone, star, ear, target, rocket, briefcase, file, alert, book, sparkles, heart, pin, money.
- Kanvas 1080×1920. `topHead(ctx, th, f, t)` menggambar judul (y≈250–460). Visual di y≈560–1330; subtitle ada di y≈1380–1500; jangan taruh apa pun di sana. Semua teks harus di dalam x 90–990, ukur dengan ctx.measureText dan kecilkan/bungkus bila perlu.
- Tema KD (Kamis) gelap: `th.key === "B"`. Di dalam bentuk putih pakai warna `INK`, bukan th.ink; di atas latar pakai th.ink (terang). Cek keterbacaan.
- Animasi harus HIDUP: benda bergerak, masuk tepat saat kata cue diucapkan (`cueT(s, cueWord, fallbackFrac)`), ada gerak idle kecil, burst/pop saat hasil. Hindari pola teks→teks atau list→list biasa; utamakan objek, ikon, dan tokoh yang bergerak.
- Setiap adegan butuh fungsi sfx (pop/whoosh/chime/ping) di momen kuncinya.
- Bangun mesin uji khusus paketmu (jangan sentuh studio-tangani.html):
  `node --check engine/packs/<pack>.js && python3 -I engine/build_engine.py --pack engine/packs/<pack>.js --out engine/studio-<pack>.html`
  Pakai `engine/studio-<pack>.html` untuk SEMUA cek dan render.

## 2. Adegan yang DILARANG (sudah dipakai)
hook, statement, cards, steps, features, brand, handoff, versus, meter, bigicon, flow, week, kinetic, sort, stack, split, scale, chart, phone, stage, pie, pour, flip, portrait, glass, battery, bricks, daycycle, waveform, search, lock, inbox, domino, slider, map, comic, funnel, timer, kanban, calendar, dart, puzzle, tree, bucket.
Juga dilarang (set 6, hari 42–91): weather, bridge, radar, elevator, bookshelf, thermometer, b_reader, b_desk, maze, compass, piggy, notebook, podium, pinboard, c_gaze, c_lift, spotlight, mirror, giftbox, chess, umbrella, lens, conveyor, traffic, stairs, magnet, rocket, envelope, hourglass, train, tugwar, jenga, switchboard, mixbowl, queue, firework ; set 7 (hari 92–141): lighthouse, sailboat, anchor, campfire, backpack, suitcase, mailbox, hotair, balloon, kettle, snowball, kite, plane, metronome, ripple, rotary, cabinet, trash, cloud, photo, barcode, keycard, blinds, remote, juggle, plates, signpost, toss, vending, canphone, hive, xpbar, quiz, curtain, origami, ladder, dam, jar, radio, aquarium — dan juga KONSEP yang sama dengan nama lain (mis. jangan bikin 'lift' kalau elevator sudah ada). Lihat engine/packs/set6*.js dan set7*.js supaya tidak mengulang.
Satu-satunya pengecualian: adegan terakhir setiap video selalu `cta`. 5 adegan isi harus memakai adegan dari paketmu. Dalam satu video minimal 4 jenis adegan berbeda; sebarkan pemakaian merata di 5 video.

## 3. Naskah
- Sumber: `plan.md` (judul + insight episode; baca juga bagian Koreksi bila episodenya bertanda ✏️). Kamu yang menulis alur dan naskah, bahasa Indonesia santai-edukatif, konkret, contoh situasi kerja sehari-hari. Jangan mengarang statistik/klaim di luar insight; angka contoh sederhana boleh (mis. harga kopi).
- Struktur: 5 adegan isi + `cta`. Adegan 1 = situasi/masalah yang relatable; tengah = kenapa + caranya; adegan isi terakhir = aksi hari ini; `cta` = penutup 1–2 kalimat diakhiri "Selamat hari <Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu>." sesuai series (SB Senin, SP Selasa, RN Rabu, KD Kamis, JS Jumat, SC Sabtu, MS Minggu; MS boleh "Aksi malam ini"/"selamat beristirahat").
- Panjang total 120–128 kata (target VO ±56–60 dtk). Angka ditulis dengan kata di `vo` (TTS), boleh angka di teks layar.
- `cue` = kata persis di `vo` adegan itu (huruf besar/kecil bebas). `highlight` = potongan persis dari `headline`. Judul ≤2 baris pendek (pakai `\n`), label ≤4 kata.
- Pertanyaan CTA (`question`) maks 26 karakter (gaya Q2 membungkus yang lebih panjang dan menabrak judul).
- cta: `{"layout":"cta","vo":...,"f":{"question":..., "headline":"...\n...", "highlight":..., "pill":"Aksi hari ini", "url":""}}`
- Tulis skrip generator seperti contoh `tools/examples/mk_set8a.py` (… mk_set6e.py, batch sebelumnya) (pakai `from mk_lib import mk`; `mk()` menulis CODE/project.json dan CODE/.tts.json, mengecek cue secara rekursif dan mencetak jumlah kata). Simpan skripmu sebagai `$W/<pack>/mk.py`. JANGAN set `project["motion"]` (transisi, latar, subtitle, font): gaya Q2 baru per series yang menentukannya.
- Batas adegan harus jatuh di akhir kalimat (mesin memotong adegan di jeda VO antar paragraf `vo`).

## 4. VO
Key sudah tersedia (dikirim di tugasmu), jadi tidak ada fase uji terpisah. Untuk mencoba adegan sebelum naskah final boleh pakai VO robot `tools/dummy_vo.sh CODE` (lebih lambat dari Citra; untuk uji boleh paksa ke 59,2 dtk dengan `tools/dummy_fit.sh`), tapi render final WAJIB dengan VO Citra dari tts.sh. Hapus vo_dummy_raw.mp3 di FOLDER EPISODEMU SAJA (jangan pakai wildcard */).


`K1=<key1> K2=<key2> tools/tts.sh CODE` → membuat CODE/vo_raw.mp3 lalu CODE/vo.mp3 tepat 59,2 dtk (fit_vo). Kalau keluar "terlalu panjang", perpendek naskah (buang kalimat paling tidak penting) lalu ulang; kalau terlalu pendek ia menambah jeda otomatis. Jangan generate ulang tanpa alasan (kredit). Jangan pernah menulis API key ke file apa pun.

## 5. QC (wajib per episode)
`$V -I tools/qc.py engine/studio-<pack>.html CODE $W/<pack>/qc`
- Harus: `Durasi 60.0`, semua batas ✓, `errors: none`.
- Buka lembar kontak `$W/<pack>/qc/CODE.jpg` dengan Read dan periksa: teks terpotong/bertumpuk, objek keluar layar atau menabrak subtitle/judul, elemen tak terlihat di tema gelap, adegan kosong terlalu lama, elemen muncul tidak sesuai narasi. Perbaiki paket/naskah lalu QC ulang. Untuk detail, render frame tertentu: `$V -I tools/frames_at.py engine/studio-<pack>.html CODE/project.json CODE/vo.mp3 OUTDIR t1 t2 ...`.

## 6. Render final (satu per satu, server dipakai bersama 5 agen)
`cd CODE && $V -I ../engine/render_explainer.py --html ../engine/studio-<pack>.html --project project.json --vo vo.mp3 --out CODE-tangani-talenta-9x16.mp4; cd ..`
Cek `ffprobe -v error -show_entries format=duration -of csv=p=0 CODE/CODE-tangani-talenta-9x16.mp4` ≈ 60.0–60.11.

## 7. episode.json
`CODE/episode.json`: `{"code","series","day","title","insight","action","caption","video":"CODE-tangani-talenta-9x16.mp4"}`. Contoh: lihat `SC06/episode.json`. caption ±2 kalimat + "Aksi hari ini: ...". title/insight sama dengan plan.md (HTML entity `&quot;` ditulis sebagai tanda kutip biasa).

## Jangan
Jangan ubah engine/motion-tangani.js, engine/build_engine.py, engine/studio-tangani.html, paket agen lain, site/, plan.md, atau episode di luar tugasmu. Jangan jalankan site/scripts/build_catalog.py. Jangan render paralel.

## Laporan akhir (singkat)
Per episode: kode, urutan adegan, durasi mp4, batas OK. Daftar adegan di paketmu (nama + field utama, 1 baris). Masalah yang tersisa, kalau ada.

## LEBIH HIDUP (permintaan utama pengguna untuk batch ini)
Animasi harus terasa seperti kartun pendek, bukan slide:
- Tidak ada momen diam: selalu ada gerak (napas/kedip/goyang tokoh, objek bergoyang, partikel, latar adegan bergerak). Tidak boleh ada jeda >0,8 dtk tanpa perubahan berarti di area adegan.
- Prinsip animasi: antisipasi → aksi → follow-through; squash & stretch saat benturan/lompatan; overshoot dan settle (eBack/eElastic); gerak sekunder (rambut, kain, bayangan yang mengecil saat objek naik).
- Tokoh BERAKTING tiap adegan: berjalan masuk, bereaksi (kaget, tertawa, garuk kepala, lompat senang, lesu), menoleh ke objek yang sedang dibahas, ekspresi berganti sesuai narasi. Minimal satu tokoh di 4 dari 5 adegan isi.
- Kamera dalam adegan: dorong masuk (zoom) pelan ke momen kunci, guncang kecil saat benturan, geser mengikuti objek bila perlu.
- Efek: partikel (debu, kilau, confetti, uap, garis kecepatan), jejak gerak, cahaya berdenyut pada hasil.
- Label/teks masuk dengan pop/pantul, keluar dengan halus; jangan muncul begitu saja.
- Puncak tiap adegan (hasil/pelajaran) ditandai momen besar + sfx.
- Ukur: render frame tiap 0,25 dtk untuk satu adegan (frames_at.py) dan hitung selisih rata-rata antar-frame (PIL ImageChops) di area y 560–1330; laporkan bagian yang hampir diam lalu hidupkan.
- Isi area y 560–1330 dengan baik: objek dan tokoh cukup besar, tidak kecil di tengah ruang kosong.

## Aturan tokoh & adegan (berlaku sejak 2026-11-22)
- **WAJIB (permintaan pengguna): semua tokoh wanita berhijab** (toon `hair: "hijab"` dengan warna hijab bervariasi; termasuk figuran, penonton, anak perempuan usia sekolah ke atas, dan host CTA). Cek lembar kontak: tidak boleh ada tokoh wanita tanpa hijab.
- **Adegan harus lahir dari cerita episodenya**: tiap adegan menggambarkan momen spesifik naskah (siapa, di mana, sedang apa), bukan templat umum. Tidak boleh ada dua adegan yang sama/mirip, baik di dalam satu video, antar video dalam tugasmu, maupun dengan paket lain di engine/packs/ (cerita*, j*, set*). Bila memakai kembali sebuah layout dari paketmu, isinya, lingkungan, tokoh, aksi, dan sudut kamera harus jelas berbeda.
