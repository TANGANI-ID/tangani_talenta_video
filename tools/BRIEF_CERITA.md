# Briefing: video "1 Menit 1 Insight" dalam MODE CERITA (gaya Shorts kartun)

Proyek: /var/www/tangani_talenta/tangani_talenta_video (jalankan semua perintah dari sini).
Alat bersama ada di tools/; folder kerjamu W diberikan di tugasmu.
Python render: V=~/.cache/studio-deps/venv/bin/python, selalu `-I`.

Baca dulu: tools/BRIEF_ADEGAN.md (aturan umum naskah, VO, QC, render, episode.json — ikuti kecuali yang diubah di bawah), lalu **tools/API_CERITA.md** (alat mode cerita), contoh `engine/packs/cerita_demo.js`, proyek demo `$W/cerita/demo/project.json` + `mk_demo.py`, dan lihat `$W/cerita/demo/best4.jpg` + `demo.mp4` (frame) untuk standar visual. Referensi gaya dari pengguna: `$W/ref/all.jpg` (YouTube Shorts kanal ceritastik / Ali Topan / Ukur Dunia).

## Yang berbeda dari briefing biasa
- Setiap project.json WAJIB `"motion": {"mode": "cerita"}` (boleh tambah opsi mode cerita dari API.md seperti host/ctaEnv). Tidak ada judul atas (topHead), tidak ada kartu kecil di tengah: semua adegan LAYAR PENUH dengan lingkungan, tokoh toon besar, kamera bergerak, teks gaya Shorts otomatis.
- Naskah bergaya CERITA PENDEK, bukan ceramah: buka dengan hook 1 kalimat yang bikin penasaran / situasi lucu ("Jam tiga sore, Dimas menatap layar kosong..."), ada tokoh bernama yang konsisten sepanjang video (1–3 tokoh, mis. karyawan + rekan/atasan), konflik kecil → momen sadar → cara yang benar → hasil. Insight dari plan.md harus jelas tersampaikan. Tetap 120–128 kata, 5 adegan isi + cta, batas adegan di akhir kalimat, adegan isi terakhir = aksi hari ini, cta diakhiri "Selamat hari <hari>." (MS boleh "Aksi malam ini"/"selamat beristirahat").
- Adegan: buat paket sendiri `engine/packs/<pack>.js` (nama layout WAJIB berawalan prefiks paketmu, mis. `ca_` atau `cb_`, supaya tidak bentrok), dan/atau pakai layout data `"cerita"` dari API.md. Tiap adegan menggambarkan momen cerita yang spesifik untuk episodenya (boleh tiap episode punya adegan unik). Gunakan berbagai lingkungan (office, home, street, park, beach, sky, sunset, night, info) dan sesekali kartu infografis gaya dokumenter (TT.infoCard) untuk poin/angka. Variasikan shot: wide → medium → close-up wajah, reaksi berlebihan, balon ucapan, properti yang bergerak.
- LEBIH HIDUP: semua aturan "LEBIH HIDUP" di BRIEF8.md berlaku dan diukur (selisih frame tiap 0,25 dtk, tidak ada bagian diam).
- Teks layar tetap Bahasa Indonesia, pendek; balon ucapan ≤ ±24 karakter; kartu info ≤ 3 baris pendek. Subtitle otomatis jangan ditutup wajah/kartu (area y 1300–1460).
- Jangan ubah engine/motion-tangani.js, build_engine.py, studio-tangani.html, cerita_demo.js, paket agen lain, site/, plan.md. Mesin uji: `python3 -I engine/build_engine.py --pack engine/packs/<pack>.js --out engine/studio-<pack>.html` (tambahkan `--pack engine/packs/cerita_demo.js` hanya bila memakai adegan cd_*).
- VO: `K1=<key> tools/tts.sh CODE` (key dikirim di tugasmu; hanya lewat env, jangan pernah ditulis ke file). Uji awal boleh pakai VO robot (tools/dummy_vo.sh lalu paksa 59,2 dtk dengan tools/dummy_fit.sh), tapi render final WAJIB VO Citra. Hapus vo_dummy_raw.mp3 hanya di folder episodemu (jangan wildcard */).
- QC: `$V -I tools/qc.py engine/studio-<pack>.html CODE $W/<pack>/qc` → Durasi 60.0, batas ✓, errors none; periksa lembar kontak dengan Read (teks terpotong, wajah menutupi subtitle, tokoh terpotong aneh, elemen keluar layar, adegan sepi). Render final satu per satu, ffprobe ≈60.0–60.11, tulis episode.json (lihat SC06/episode.json).

## Laporan akhir (singkat)
Per episode: kode, ringkasan cerita 1 kalimat, urutan adegan + lingkungan, durasi mp4, batas OK, hasil uji gerak. Daftar adegan paket. Masalah tersisa.

## Aturan tambahan (berlaku untuk semua batch cerita)
- Mesin sudah diperbaiki (spasi antarkata subtitle). Selalu bangun mesin ujimu dari motion-tangani.js terbaru.
- Adegan HARUS BERBEDA dari batch cerita sebelumnya. Konsep yang sudah dipakai (jangan diulang sebagai objek utama): ca_pilih (dua kartu penawaran), ca_tunggu (jendela siang-malam), ca_ponsel / cb_hp (ponsel raksasa berisi chat/aplikasi), ca_daftar (papan klip), ca_kabur (kilas balik sepia), ca_lingkar (meja arisan), ca_awan (awan hujan di kepala), ca_angkat (barbel), ca_presentasi (papan presentasi + penonton), ca_kerja (meja kerja cap/kebut), ca_gunung (gunung tugas), ca_jam (timer raksasa), cb_loket (loket + layar status), cb_sapa (label nama + hati), cb_layar (monitor tabel), cb_pikir (awan pikiran/chip mengorbit), cb_catat (notes ditulis pensil), cb_kamar (kamar malam + jam digital). Pelajari kodenya hanya sebagai contoh teknik. Ciptakan metafora visual baru yang kuat per episode (mis. tokoh mengecil/membesar, dunia berubah warna, benda hidup berbicara, kejar-kejaran, kilas balik bergaya lain, split-screen dua tokoh, adegan imajinasi berlebihan ala kartun).
- Variasikan lingkungan: jangan dua adegan berturut-turut di lingkungan yang sama kecuali memang satu lokasi cerita; setiap video minimal 3 lingkungan berbeda. Variasikan host dan tokoh (nama, gender, hijab/kopiah/kacamata, usia) antar video.
- Masalah dari batch lalu yang harus dihindari: tokoh terpotong canggung di tepi layar saat kamera menyorot objek (geser tokoh atau komposisi ulang), layar/objek kosong >1 dtk sebelum isinya muncul, hanya ujung kepala tokoh di area subtitle, chip/teks melintas di depan wajah.
- Prefiks layout wajib unik per paket (diberikan di tugasmu). Cek `grep -ho 'TT.layout("[a-z_0-9]*"' engine/packs/*.js` supaya tidak bentrok.
- Konsep adegan di SEMUA paket yang sudah ada (engine/packs/*.js: set6*, set7*, set8*, cerita*) jangan diulang sebagai objek utama; buka filenya untuk melihat daftar layout dan konsepnya.

## Aturan tokoh & adegan (berlaku sejak 2026-11-22)
- **WAJIB (permintaan pengguna): semua tokoh wanita berhijab** (toon `hair: "hijab"` dengan warna hijab bervariasi; termasuk figuran, penonton, anak perempuan usia sekolah ke atas, dan host CTA). Cek lembar kontak: tidak boleh ada tokoh wanita tanpa hijab.
- **Adegan harus lahir dari cerita episodenya**: tiap adegan menggambarkan momen spesifik naskah (siapa, di mana, sedang apa), bukan templat umum. Tidak boleh ada dua adegan yang sama/mirip, baik di dalam satu video, antar video dalam tugasmu, maupun dengan paket lain di engine/packs/ (cerita*, j*, set*). Bila memakai kembali sebuah layout dari paketmu, isinya, lingkungan, tokoh, aksi, dan sudut kamera harus jelas berbeda.

## Jebakan tata letak (WAJIB dibaca)
- Baca tools/JEBAKAN_CERITA.md sebelum merancang kamera/komposisi: kumpulan masalah lembar kontak dari batch hari 182–271 beserta solusinya.

## Pemeran tetap (disetujui pengguna 2026-11-22)
Bila naskah memakai nama Rina, Bayu, Bu Ratna, Pak Hendra, Sinta, Yoga, Nisa, atau Dodi, WAJIB pakai tampilan baku dari `youtube/tokoh/tokoh.json` (kunci `look`, salin apa adanya ke toon). Jangan beri nama itu ke tokoh dengan tampilan lain. Tokoh figuran boleh dirancang bebas (wanita tetap berhijab). Lembar: `youtube/tokoh/lembar_tokoh.jpg`.
