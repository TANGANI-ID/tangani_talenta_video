# Tangani Talenta Video — paket produksi

Paket untuk **membuat ulang / melanjutkan produksi video** Tangani Talenta di server lain, dengan karakter,
suara, gaya, dan merek yang konsisten. Platform pratinjau/katalog (situs, admin, S3) **sengaja tidak disertakan**.

| Produk | Format | Jumlah |
|---|---|---|
| **1 Menit 1 Insight** | 9:16, 60 dtk, animasi (7 series × 52 minggu = 365 episode) | folder `SB01…SB53 SP RN KD JS SC MS` |
| **Kantor Tangani** (YouTube panjang) | 16:9, ±8 menit, animasi penuh, 8 cerita × 4 eps | `youtube/panjang/kantor-01…08` |

## Isi repo
```
setup.sh              pasang venv/mesin di server baru
.env.example          nama variabel kunci ElevenLabs (isi sendiri, jangan di-commit)
assets/brand/         logo Tangani (logo.png), lembar tokoh
docs/PROSEDUR.md      ← LANGKAH PRODUKSI LENGKAP (baca ini dulu)
docs/KARAKTER.md      ← tokoh tetap, suara, warna, aturan wajib (agar hasil konsisten)
docs/Kurikulum-…docx  kurikulum 365 video (master prompt + brief tiap episode)
plan.md               rencana 365 episode (insight, aksi, peta series)
engine/               mesin animasi (studio.html + motion-tangani.js + packs/ adegan) + render
engine/panjang/       mesin tambahan 16:9 (lokasi, efek, kamera, audio)
tools/                tts.sh, qc.py, frames_at.py, fit_vo; BRIEF_*.md = PROMPT agen produksi
tools/panjang/        pipa video panjang: vo16 → render16 → thumb16 → qc16
youtube/tokoh/        tokoh.json (tampilan baku 8 tokoh) + lembar_tokoh.jpg
youtube/serial/       panduan serial + naskah Kantor Tangani Eps 1–8 + garis besar
youtube/rencana-90*   rencana 90 video panjang
youtube/panjang/*/    generator adegan (work/epNN.py), episode.json, README, VO Citra asli (vo/*.mp3)
<KODE>/               tiap episode pendek: project.json (adegan+VO teks+merek+logo), vo_text.txt, episode.json
```

## Tidak ikut (terlalu besar / dapat dibuat ulang)
- Hasil render `.mp4` (±27 GB) dan `vo.mp3` episode pendek (±0,7 GB) → dibuat ulang dengan perintah di PROSEDUR.
  VO episode pendek bisa dibuat ulang persis dengan suara yang sama (voice_id tetap, teks di `vo_text.txt`).
  VO video panjang (`youtube/panjang/*/vo/*.mp3`) SENGAJA disertakan: berbayar dan timestamp-nya terkunci ke naskah.
- Kunci API (ElevenLabs) — isi lewat variabel lingkungan.

## Mulai cepat
```bash
git clone git@github.com:TANGANI-ID/tangani_talenta_video.git /var/www/tangani_talenta/tangani_talenta_video
cd /var/www/tangani_talenta/tangani_talenta_video && bash setup.sh
```
Skrip lama memakai path `/var/www/tangani_talenta/tangani_talenta_video`; klon ke path itu (atau biarkan setup.sh
membuat symlink). Perlu: Chrome (`/usr/bin/google-chrome`), ffmpeg/ffprobe, node+npm, Python 3, curl.
Lalu lihat **docs/PROSEDUR.md**.

> Seluruh isi repo adalah materi internal PT Tangani Digital Automasi. Repo ini publik bila visibilitasnya tidak diubah.
