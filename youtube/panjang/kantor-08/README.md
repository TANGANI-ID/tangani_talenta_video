# Kantor Tangani: Klien Terbesar Eps 4 (video panjang 16:9, animasi penuh) · penutup Cerita 2

Judul: **Gudang Paling Lambat Mau Diserahkan ke Pihak Luar | Kantor Tangani: Klien Terbesar Eps 4**
Naskah: `youtube/serial/ep08-naskah.md` (16 adegan; adegan 3 = kartu judul tanpa VO, adegan 16 = cuplikan cerita baru "Utang Bayu" + layar akhir) · panduan & alat: `youtube/panjang/kantor-01/README.md` (perintah sama, ganti `kantor-01` → `kantor-08`).

## Status
- 2026-11-23: episode.json (generator `work/ep08.py`, cue OK), timeline 8:15 (495,0 dtk), audio `work/mix.wav`, `thumbnail.jpg` (jenis `gudang4`), `YOUTUBE.txt`, `chapters.txt`, `tema.json` SIAP; frame cek (±140 frame, tiap 3,5 dtk) sudah diperiksa, tanpa galat halaman.
- SELESAI 2026-11-23 14:08: `kantor-08-16x9.mp4` 8:15 (495,0 dtk), render ulang dengan `--workers 3` di dalam kunci (render pertama dengan 4 proses dihentikan sistem karena memori rendah), log tanpa error halaman. QC gerak lolos (diam terpanjang 0,75 dtk, jeda hitam sebelum iklan), lembar kontak `work/qc/lembar_kontak.jpg` diperiksa. Belum diunggah.
- Bab: 0:00 Sebelumnya · 0:22 Gudang sunyi · 0:58 Mengukur · 2:36 Enam puluh dua persen · 3:46 Buku saku Dodi · 4:28 Memindahkan rak · 7:00 Pelajaran · 7:36 Cerita baru (dari waktu adegan sebenarnya). Iklan tengah sesudah adegan 8 (± 3:46, tahan hitam 1,6 dtk).
- Ubah adegan: edit `work/ep08.py` → `python3 youtube/panjang/kantor-08/work/ep08.py` (menulis episode.json + cek semua cue ada di narasi) →
  `flock youtube/panjang/.render.lock ~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-08 --workers 4` (+ `thumb16.py`, `qc16.py --sheet`, `qc16.py --motion --mp4`; cek cepat `--stills a1,a9,123.5 --scale .5`).
- `vo/` = VO Citra asli (ElevenLabs, berbayar; a01–a16 kecuali a03). Jangan dihapus / dibuat ulang; jangan ubah baris `> ` di naskah.
- `at` di shot ke-2 dst. ditulis relatif terhadap awal shot; `shot_local()` mengubahnya ke `{cue shot, d}` — di ep08.py juga untuk kunci **props** (troli, papan rak, radio, papan status). Bagian `split` memakai cue.
- `ep08.py` menyalin seluruh daftar adegan lewat JSON sebelum `shot_local()` (objek bantu seperti `signs()`, `radio()`, `BROCH` dipakai di beberapa shot; tanpa salinan, konversi waktu shot satu ikut mengubah shot lain).
- SFX ditaruh di tingkat adegan (ep08.py memindahkan `shot.sfx` ke `adegan.sfx`). Objek waktu bersarang di dalam fx memakai `t` / nama lain, bukan `at`.
- Topi Dodi: dipakai sampai adegan 8 ("melepas topi oranyenya" → kunci `hat: null`, topi di tangan `item: "cap"`), adegan 9–13 tanpa topi (`NOCAP`), adegan 14 dipakai lagi (`hat: "cap"` di cue "memakai kembali"). Yoga selalu `neckphones: true`.
- Balon Pak Wijaya di panggilan video memakai `pos` (tanpa jangkar tokoh) + `shots` supaya hanya tampil di sisipan panggilan.

## Isi episode (ringkas)
| Adegan | Isi | Lokasi / efek utama |
|---|---|---|
| 1 | Sebelumnya: gebrakan di lobi, 30 HARI LAGI, rak tahan "syarat: gudang beres", Dodi menguping di ruang Pak Hendra (pensil jatuh), "Kalau gagal: diserahkan ke pihak luar" | `lobi`, `countdown`, `gudang.holdRack`, `bos` + `officeDoor`, `dropPencil`, `recap` |
| 2 | HARI 1/30: radio mati, brosur JASA GUDANG PIHAK KETIGA di meja uji, Rina + Yoga masuk (pengukur waktu, papan jepit); "Mau ngukur apa?" | `gudang` (`doorAt`, `bench`), `radio16`, `brochure`, `dayChip` |
| 3 | Kartu judul KLIEN TERBESAR · EPS 4/4, HARI 1 DARI 30 | `title` |
| 4 | Rina duduk di kardus sejajar Dodi; Yoga "Kalau tidak diukur…"; papan jepit KE MANA WAKTU HABIS?; Dodi: dua jari "2 HARI" | `box16`, `clipCard`, `hand_two` |
| 5 | Pengukur waktu per pesanan; Rina mengikuti staf; denah + benang merah kusut ke RAK 9 | `measure`, `floorPlan` |
| 6 | Halaman: kurir 10.00 vs kardus 14.00, truk menunggu (sopir tertidur, jam berputar cepat), teknisi menunggu di toko, layar terbelah | `halaman`, `truck16`, `tokobaru`, `split` |
| 7 | 42 menit, berjalan 26 menit = 62%; tabel barang laris di RAK 9, rak depan jarang dikirim; "Bukan orangnya. Letak barangnya." | `bar42`, `movers` |
| 8 | HARI 12: Pak Hendra + 2 petugas jasa gudang (abu-abu) mengukur lorong; 10 perbaikan, 0 selesai; Dodi melepas topi, duduk di kardus → hitam (jeda iklan) | `countdown`, `tapeLine`, `tenList`, `hitam` |
| 9 | Yoga mencoret 9 dari 10, sisa "Barang laris ke rak depan"; buku saku Dodi: sketsa + panah, 14 Juni 2024, "Rapat: nanti dulu." (+ usul kedua 2025) | `tenList` (`strikeAt`, `circleAt`), `pocketBook` |
| 10 | Sabtu: Dodi memimpin dengan buku saku; Rina, Yoga, Bayu, Sinta mendorong troli; Bu Ratna ikut mengangkat; papan rak berbalik; radio menyala lagi | `trolley` (kunci x), `rackSign` (`swap`), `radio16` (`on`), `whistle` |
| 11 | Bayu menulis ulang jadwal: KEMAS 08.00–10.30 → KURIR 11.00 → PASANG 13.00; "Kopimu di Bu Tini juga ketemu, Bay." | `schedBoard`, `sched` |
| 12 | HARI 20: 42 → 14 menit, 71% → 98%; denah pendek & rapi; papan status merah → hijau | `compare`, `floorPlan` mode `tidy`, `statusBoard` (`green`) |
| 13 | HARI 30, Melati: Rina menyerahkan pengendali ke Dodi, buku saku di layar, Pak Hendra berdiri: "Maaf, Dod. Kami tidak mendengar."; brosur masuk laci | `rapat` slide `gudang14` → `bukuSaku`, `hand_clicker`, `drawer` |
| 14 | Panggilan video Pak Wijaya: 5 toko baru (peta 12 + 5), "Mbak Rina dan Mas Dodi yang pegang"; Dodi memakai topi lagi: "Beres, Bos!" | `wijayaCall`, `storeMap17`, kunci `hat` |
| 15 | Kartu pelajaran (3 baris) + montase lambat Cerita 2 (lobi, DENGAR·AKUI·JAM, kabin malam, troli rak) + KLIEN TERBESAR · SELESAI | `lesson`, `recap` (label EPS 1–4), `finale` |
| 16 | Pantry 5 JULI, bekal nasi + kerupuk, notifikasi tagihan 7 aplikasi, "Rin, boleh pinjam dulu?"; kartu CERITA BARU · UTANG BAYU; layar akhir → Utang Bayu · Eps 1 | `pantry`, `bekal`, `deskCal`, `bills`, `card`, `endscreen` |

## Yang baru di mesin (dipakai mulai Klien Terbesar Eps 4)
- `engine/panjang/kit16h.js` (dimuat page16.py sesudah kit16g):
  - Tokoh: look `neckphones: true` (headphone di leher, Yoga); kunci tokoh boleh berisi `hat` / `pencil` / `neckphones` (topi dilepas/dipakai di tengah shot). Membungkus `TT.drawToon`; tanpa opsi/kunci itu tidak berubah.
  - Lokasi baru: `halaman` (halaman depan gudang, pintu gulung terbuka, papan GUDANG TANGANI, jam `clock` + `clockRate`).
  - Slide rapat baru: `bukuSaku`, `gudang14` (membungkus `FX.slide.paint`; slide lain tetap).
  - Properti: `box16`, `radio16`, `brochure`, `truck16`, `statusBoard`, `schedBoard`, `rackSign`, `tapeLine`, `bekal`; `hand_stopwatch`, `hand_clipboard`, `hand_pocketbook`, `hand_cap`, `hand_clicker`, `hand_tape`, `hand_tablet`, `hand_two`.
  - Efek: `dayChip`, `dropPencil`, `clipCard`, `measure`, `floorPlan`, `bar42`, `movers`, `tenList`, `pocketBook`, `sched`, `compare`, `storeMap17`, `wijayaCall`, `drawer`, `bills`, `finale`.
  - `S16.thumbs.gudang4` = gambar thumbnail.
- `audio16.js`: ambience `halaman` = `halte`.
- `thumb16.py`: jenis thumbnail `gudang4` (satu baris tambahan, gambarnya di kit16h).
- Figuran baru (extras): dua petugas jasa gudang (pria, seragam abu-abu), teknisi pasang (pria); Dodi, Pak Wijaya, Mbak Wulan (berhijab), Mas Eko, Mas Jaka sama dengan Eps 1–2. Semua tokoh wanita (Rina, Sinta, Bu Ratna, Mbak Wulan) berhijab.
