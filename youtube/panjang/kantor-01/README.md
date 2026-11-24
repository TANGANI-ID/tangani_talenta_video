# Kantor Tangani: Tak Terlihat Eps 1 (video panjang 16:9, animasi penuh)

Judul: **Paling Rajin di Kantor, Tapi yang Dipromosikan Orang Lain | Kantor Tangani: Tak Terlihat Eps 1**
Naskah: `youtube/serial/ep01-naskah.md` · panduan: `youtube/serial/panduan-serial.md` · pemeran: `youtube/tokoh/tokoh.json`

## Isi folder
| Berkas | Isi |
|---|---|
| `episode.json` | data 16 adegan: lokasi, tokoh + kunci gerak (dipicu kata narasi lewat `cue`), kamera, properti, efek/kartu, balon (`lines`), SFX, musik, transisi, bab YouTube, 3 pelajaran |
| `vo/aNN.mp3` + `vo/aNN.json` | narasi per adegan + stempel waktu per karakter (format ElevenLabs). Sekarang: suara **Citra** asli (disalin dari `vo_citra/`) |
| `vo_citra/` | VO Citra asli dari koordinator (jangan dihapus) |
| `vo_robot/` | suara robot sementara (espeak) yang sudah diganti, hanya arsip |
| `kantor-01-16x9.mp4` | hasil render 1920x1080, 30 fps, AAC 48 kHz, -14 LUFS |
| `thumbnail.jpg` | 1280x720 |
| `YOUTUBE.txt`, `chapters.txt`, `tema.json` | teks unggah (judul, deskripsi + catatan cerita fiksi, bab dari waktu adegan sebenarnya, pelajaran), data halaman admin #/youtube |
| `work/` | timeline.json, mix.wav, vo_env.json (gerak bibir), events.json (SFX), qc/lembar_kontak.jpg |

## Render ulang (satu perintah)
Dari akar proyek `/var/www/tangani_talenta/tangani_talenta_video`:
```bash
~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-01
```
Urutannya: timeline dari panjang VO (+ jeda napas 0,5–0,9 dtk; bila total < 8:15 jeda diperpanjang, audio tidak pernah diregangkan) → audio (VO + SFX sintetis + ambience lokasi + musik latar per suasana, di-duck di bawah suara) → frame paralel (6 proses Chrome) → MP4 → YOUTUBE.txt/chapters.txt/tema.json. Lalu:
```bash
~/.cache/studio-deps/venv/bin/python tools/panjang/thumb16.py youtube/panjang/kantor-01      # thumbnail
~/.cache/studio-deps/venv/bin/python tools/panjang/qc16.py youtube/panjang/kantor-01 --sheet  # lembar kontak
~/.cache/studio-deps/venv/bin/python tools/panjang/qc16.py youtube/panjang/kantor-01 --motion --mp4  # cek "tidak diam > 0,8 dtk"
```
Uji cepat: `render16.py ... --stills a1,a6,123.5 --scale .5` (frame cek ke `work/stills/`), atau `--from 120 --to 160` (potongan ke `work/uji.mp4`).

## Suara
- Untuk episode baru (atau mengganti VO ini dengan VO baru dari ElevenLabs):
  ```bash
  K1=<kunci ElevenLabs> [K2=<kunci cadangan>] python3 tools/panjang/vo16.py youtube/panjang/kantor-01
  ~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-01
  ```
  `vo16.py` membuat `vo/aNN.mp3` + `.json` (Citra, `eleven_v4`, bahasa `id`, endpoint with-timestamps) dari baris `> ` tiap adegan. Berkas yang sudah ada dilewati, kecuali suara robot ("dummy": true) yang otomatis ditimpa. Untuk membuat ulang adegan tertentu, hapus dulu `vo/aNN.*`. Kunci hanya dibaca dari environment dan tidak dicetak/disimpan.
- Tanpa kunci: `python3 tools/panjang/vo_dummy16.py <folder>` membuat suara robot sementara (espeak-ng, ±127 kata/menit) dalam format yang sama.
- VO yang sudah jadi di folder lain (mis. `vo_citra/adegan01.*`): `python3 tools/panjang/vo_import16.py youtube/panjang/kantor-01/vo_citra youtube/panjang/kantor-01`.

## Kode
- `engine/panjang/story16.js` inti: kamera 16:9, timeline dari data, tokoh (memakai `TT.toonState`/`TT.drawToon` mesin 9:16 tanpa mengubahnya), balon, teks terjemahan gaya YouTube (1 baris, kata aktif oranye), transisi (whip/zoom/iris/fade/flash/cut, juga antar-shot), grading hangat + vinyet, header logo, layar terbelah.
- `engine/panjang/loc16.js` lokasi: ruang rapat Melati, ruang kerja terbuka, meja Yoga, halte (senja/malam + bus + lalu lintas), ruang kaca Bu Ratna (luar/dalam), lorong, toko kelontong, kamar kos.
- `engine/panjang/fx16.js` properti + efek: meja Rina, kursi, papan tulis, benda di tangan, kartu judul, penanda bulan, nama tokoh, jam besar, layar laptop (antrean tiket, balasan panjang, draf, chat Yoga, review, balasan menyusut + bintang lima, folder kosong), panel komik, foto Dimas, grafik (peringkat, dua grafik, naik), papan TV, kartu, 3 langkah, kartu pelajaran, buku catatan, ponsel, jendela bus, video call, layar akhir.
- `engine/panjang/audio16.js` campuran audio offline. `tools/panjang/*.py` alat Python.
- File 9:16 (`engine/motion-tangani.js`, `engine/studio-tangani.html`, packs) TIDAK diubah.
