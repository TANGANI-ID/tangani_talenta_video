# AGENTS.md — panduan agen AI untuk produksi "Kantor Tangani"

Tujuan: membuat episode baru serial YouTube 16:9 yang **konsisten** dengan episode 1–8. Baca berurutan:
1. `docs/KARAKTER.md` (aturan wajib) → 2. `docs/PROSEDUR.md` (langkah) → 3. `docs/JEBAKAN_PANJANG.md` →
4. `youtube/serial/panduan-serial.md` + `garis-besar.md` (alur) → 5. contoh terbaru: `youtube/panjang/kantor-08/` (README, `work/ep08.py`) dan naskah `youtube/serial/ep08-naskah.md`.

## Lingkungan
- Repo harus ada di `/var/www/tangani_talenta/tangani_talenta_video` (skrip memakai path ini). Jalankan `bash setup.sh` sekali.
- Python render: `V=~/.cache/studio-deps/venv/bin/python`. Perintah dijalankan dari root repo.
- Kunci ElevenLabs hanya dari variabel lingkungan `K1` (`K2`,`K3`). **Jangan** mencetak, menulis ke file/log, atau commit kunci. VO berbayar.
- Butuh kemampuan MELIHAT GAMBAR: QC memakai lembar kontak JPG; `qc16.py` bisa lolos padahal tampilan rusak. Buka gambarnya.

## Aturan keras
1. Semua tokoh wanita **berhijab**. Pemeran = `youtube/tokoh/tokoh.json` persis (jangan ubah warna/ciri). Narator & suara tokoh = Citra saja.
2. Merek: Tangani Talenta, aksen #C2691F, logo `assets/brand/logo.png`. Cerita fiksi; Tangani tidak pernah digambarkan membocorkan data/menipu.
3. Naskah: ±980–1000 kata narasi per episode (<960 kata → di bawah 8 menit, batas mid-roll). Baris `> ` = narasi; **jangan diubah setelah VO dibuat** (VO tidak cocok lagi; TTS ulang = biaya).
4. Standar cerita: 1 konflik besar, 2–3 pelajaran, plot A/B, twist tengah, teaser episode berikut, Eps 2–4 dibuka "Sebelumnya di…". Ikuti benang merah di `garis-besar.md`.
5. Judul: `<hook> | Kantor Tangani: <nama cerita> Eps N` (≤100 karakter).
6. Jangan menimpa folder `vo/` episode lama; jangan commit mp4/mp3 baru kecuali `vo/*.mp3` video panjang (sudah di .gitignore pengecualian).
7. Render satu per satu dan serial (`flock`), `--workers 3`; render pernah dihentikan sistem karena memori.
8. Tidak ada bagian layar diam > 0,8 dtk (`qc16.py --motion --mp4`).
9. Jangan ubah `engine/motion-tangani.js`, `engine/studio.html`, `story16.js`/`loc16.js`/`fx16.js` secara destruktif: tambah efek/lokasi baru sebagai `kit16<huruf>.js` baru dan daftarkan di `tools/panjang/page16.py`.

## Alur satu episode
naskah `youtube/serial/epNN-naskah.md` (tinjauan pemilik) → `K1=… python3 tools/panjang/vo16.py youtube/panjang/kantor-NN` →
generator `work/epNN.py` (salin dari episode terbaru, pakai `shot_local()` + `check_cues()`) → `render16.py` → `thumb16.py` →
`qc16.py --sheet` (lihat gambar) → `qc16.py --motion --mp4` → `meta16.py` → perbarui status di `youtube/rencana-90.json` → commit (tanpa mp4).
Uji tanpa kredit: `tools/panjang/vo_dummy16.py` (suara robot). Detail perintah: `docs/PROSEDUR.md`.

## Status serial
Cerita 1 Tak Terlihat (Eps 1–4 = kantor-01…04) dan Cerita 2 Klien Terbesar (Eps 1–4 = kantor-05…08) selesai. Berikutnya: **Cerita 3 Utang Bayu** (naskah belum ditulis; kantor-09…12). Belum ada unggah otomatis ke YouTube.
