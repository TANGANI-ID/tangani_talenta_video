# Tangani Talenta Video — Kantor Tangani (YouTube 16:9)

Paket produksi **serial animasi YouTube "Kantor Tangani"** (PT Tangani Digital Automasi): 8 cerita bersambung × 4 episode,
±8 menit per episode, satu narator (suara Citra), pemeran tetap. Berisi mesin, alat, naskah, tokoh, dan prosedur agar
produksi dapat dilanjutkan di server lain dengan hasil yang konsisten. Platform pratinjau/katalog tidak disertakan.
Video pendek 9:16 "1 Menit 1 Insight" sudah dikeluarkan dari repo ini (masih ada di riwayat git).

## Mulai
```bash
git clone git@github.com:TANGANI-ID/tangani_talenta_video.git /var/www/tangani_talenta/tangani_talenta_video
cd /var/www/tangani_talenta/tangani_talenta_video && bash setup.sh
cp .env.example .env   # isi K1 (kunci ElevenLabs), lalu: set -a; . ./.env; set +a
```
Perlu Chrome (`/usr/bin/google-chrome`), ffmpeg/ffprobe, node+npm, Python 3, curl. RAM cukup: render pakai `--workers 3`.
**Pakai agen AI (Claude Code, Antigravity, dll.): suruh baca `AGENTS.md` dulu.**

## Isi
```
AGENTS.md              aturan & jalur kerja untuk agen AI  ← mulai di sini
docs/PROSEDUR.md       langkah produksi satu episode
docs/KARAKTER.md       merek, suara, 8 tokoh tetap, aturan wajib
docs/JEBAKAN_PANJANG.md  pelajaran QC/teknis dari episode 1–8
docs/API_MESIN_TOON.md API tokoh toon (TT.toon, TT.cam, TT.env) yang dipakai mesin 16:9
assets/brand/          logo.png, lembar_tokoh.jpg;  assets/base/project_dasar.json (basis tampilan tokoh)
engine/                studio.html + motion-tangani.js (+packs/) → build_engine.py → studio-tangani.html; panjang/ = mesin 16:9
tools/panjang/         vo16 → render16 → thumb16 → qc16 → meta16 (+ vo_dummy16, vo_import16)
tools/longform/cast_sheet.py  membuat lembar tokoh
youtube/tokoh/         tokoh.json (tampilan baku) + lembar tokoh
youtube/serial/        panduan serial, garis besar 8 cerita, naskah Eps 1–8 (ep01…ep08-naskah.md)
youtube/rencana-90.*   rencana 90 video (cerita, Kelas Produktif, Hak Karyawan, Skrip Percakapan)
youtube/panjang/kantor-01…08/   generator adegan (work/epNN.py), episode.json, README, VO Citra asli (vo/*.mp3)
```
Tidak ikut: hasil render mp4 (dibuat ulang), kunci API.

> Materi internal PT Tangani Digital Automasi. Repo publik bila visibilitasnya tidak diubah.
