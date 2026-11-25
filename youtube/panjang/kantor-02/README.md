# Kantor Tangani: Tak Terlihat Eps 2 (video panjang 16:9, animasi penuh)

Judul: **Bilang "Aman, Bu!" Padahal Proyeknya Hampir Gagal | Kantor Tangani: Tak Terlihat Eps 2**
Naskah: `youtube/serial/ep02-naskah.md` · panduan & alat: lihat `youtube/panjang/kantor-01/README.md` (perintah sama, ganti `kantor-01` → `kantor-02`).

## Status
- SELESAI 2026-11-23: `kantor-02-16x9.mp4` 8:19, VO Citra (ElevenLabs, salinan di `vo_citra/`), QC gerak lolos (diam terpanjang 0,75 dtk), lembar kontak `work/qc/lembar_kontak.jpg`, `thumbnail.jpg`, `YOUTUBE.txt`.
- Render ulang: `~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-02` (+ `thumb16.py`).
- Kunci aktor `at` = waktu sejak awal ADEGAN, bukan shot; di shot ke-2 dst. pakai `{cue, d}`.

## Yang baru di mesin (dipakai mulai Eps 2)
- `engine/panjang/kit16b.js` (dimuat page16.py): lokasi `pantry`, `kampus`; properti `deskCal`; efek `recap`, `calendar`, `mail`, `group`,
  `exportSheet`, `projectChat`, `report`, `phone2`, `rescue`, `ring`, `sticky`; slide rapat `bagi` dan `demo`. Ambience `pantry`/`kampus` di audio16.js.
- `fx16.js`: `title` (eps/hook/day/month/marker) dan `endscreen` (nextQuote/nextSub/nextTitle/nextWho/nextKey/nextThumb/ask) kini berparameter; bawaan = Eps 1.
- `story16.js`: `out: {cue}` pada efek kini waktu lokal adegan (dulu relatif sehingga kartu/panel ber-`out` tidak pernah tampil — juga memengaruhi Eps 1 bila dirender ulang).
- `meta16.py` membaca `episode.json → youtube{desc, ask, next, tags, adAfter}` dan `parts`; `thumb16.py` membaca `episode.json → thumb{kind, lines, hl, badge}`.
- Generator data adegan: `work/ep02.py` (ubah lalu jalankan untuk menulis ulang episode.json).
