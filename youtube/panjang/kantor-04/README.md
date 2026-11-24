# Kantor Tangani: Tak Terlihat Eps 4 (video panjang 16:9, animasi penuh) · penutup Cerita 1

Judul: **Nilai Kinerja Jelek, 3 Bulan Kemudian Jadi yang Terbaik | Kantor Tangani: Tak Terlihat Eps 4**
Naskah: `youtube/serial/ep04-naskah.md` · panduan & alat: `youtube/panjang/kantor-01/README.md` (perintah sama, ganti `kantor-01` → `kantor-04`).

## Status
- SELESAI 2026-11-23 09:53: `kantor-04-16x9.mp4` 8:15 (495,6 dtk), VO Citra, QC gerak lolos (diam terpanjang 0,50 dtk; `twoNote` sudah diberi gerak), lembar kontak `work/qc/lembar_kontak.jpg`, `thumbnail.jpg`, `YOUTUBE.txt`. Render pakai `--workers 4` (6 proses sempat dihentikan sistem karena memori rendah). Belum diunggah ke YouTube.
- 2026-11-23: episode.json (16 adegan, generator `work/ep04.py`), VO Citra (ElevenLabs), render + QC. Lihat bagian Hasil.
- Ubah adegan: edit `work/ep04.py` → `python3 youtube/panjang/kantor-04/work/ep04.py` (menulis episode.json + cek semua cue ada di narasi) →
  `~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-04` (+ `thumb16.py`, `qc16.py --sheet`, `qc16.py --motion --mp4`; cek cepat `qc16.py --shots`).
- `at` di shot ke-2 dst. ditulis relatif terhadap awal shot; `shot_local()` mengubahnya ke `{cue shot, d}` (mesin membaca `at` sejak awal adegan).
- Objek waktu bersarang di dalam fx (mis. `flag`) jangan memakai kunci `at` (dikonversi mesin menjadi angka); pakai `t`.

## Yang baru di mesin (dipakai mulai Eps 4)
- `engine/panjang/kit16d.js` (dimuat page16.py sesudah kit16c): lokasi `warung` (warung kopi seberang kantor), `bos` (ruang Pak Hendra, `folder` = berkas WIJAYA · 12 TOKO),
  `lobi` (meja resepsionis, `slam` = waktu gebrakan), `gudang` (kardus PERANGKAT KASIR, `wrong` = TIPE SALAH); properti `warungTable`, `officeDoor`, `hand_paper`;
  efek `jobApp`, `review`, `yearFile`, `nineList`, `lineChart`, `rankTop`, `jobMail`, `headChart`, `countdown`, `oldPhoto`, `course`, `twoNote`.
- `audio16.js`: ambience lokasi baru memakai alias (warung = halte, bos = kaca, lobi/gudang = lorong).
- `thumb16.py`: jenis thumbnail `nilai`.
- Figuran baru (extras di episode.json): Pak Wijaya (kopiah, kemeja cokelat; dipakai tetap di Cerita 2), Mbak Wulan (resepsionis, berhijab), Mas Andi (tim TI).
