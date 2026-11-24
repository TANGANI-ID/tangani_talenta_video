# Kantor Tangani: Klien Terbesar Eps 1 (video panjang 16:9, animasi penuh) · pembuka Cerita 2

Judul: **Klien Terbesar Mengamuk di Lobi, Rina Malah Membela Diri | Kantor Tangani: Klien Terbesar Eps 1**
Naskah: `youtube/serial/ep05-naskah.md` (15 adegan; adegan 2 = kartu judul tanpa VO, adegan 15 = cuplikan Eps 2 + layar akhir) · panduan & alat: `youtube/panjang/kantor-01/README.md` (perintah sama, ganti `kantor-01` → `kantor-05`).

## Status
- SELESAI 2026-11-23: `kantor-05-16x9.mp4` 8:15 (495,0 dtk), VO Citra (ElevenLabs, sudah ada di `vo/`), QC gerak lolos (diam terpanjang 0,75 dtk, di tahan-hitam sebelum jeda iklan adegan 8), lembar kontak `work/qc/lembar_kontak.jpg`, `thumbnail.jpg` (jenis `lobi`), `YOUTUBE.txt`, `chapters.txt`, `tema.json`. Render pakai `--workers 4` (±10 menit). Belum diunggah ke YouTube.
- Bab: 0:00 Lobi · 0:34 Klien terbesar · 2:13 Intinya apa? · 3:56 Telepon kedua · 4:48 Formulir pesanan · 6:33 Pelajaran · 7:37 Episode berikutnya (dihitung dari waktu adegan sebenarnya, bukan perkiraan naskah). Iklan tengah sesudah adegan 8 (± 3:56).
- Catatan lembar kontak: frame "Adegan 4 · 30%" krem polos = tepat di tengah transisi kilat ke kilas toko ke-12 (bukan frame rusak).
- Ubah adegan: edit `work/ep05.py` → `python3 youtube/panjang/kantor-05/work/ep05.py` (menulis episode.json + cek semua cue ada di narasi) →
  `~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-05 --workers 4` (+ `thumb16.py`, `qc16.py --sheet`, `qc16.py --motion --mp4`; cek cepat `qc16.py --shots` atau `--stills a1,a9,123.5 --scale .5`).
- `vo/` = VO Citra asli (ElevenLabs, berbayar). Jangan dihapus / dibuat ulang; jangan ubah baris `> ` di naskah (VO akan tidak cocok).
- `at` di shot ke-2 dst. ditulis relatif terhadap awal shot; `shot_local()` mengubahnya ke `{cue shot, d}`. Bagian `split` (layar terbelah) TIDAK diubah: kunci di sana memakai cue.
  Tokoh Sinta di tangga (adegan 5) memakai `SINTA_STAIRS` (kunci turun tangga dipasang ke cue "Dan dari ujung").
- Objek waktu bersarang di dalam fx jangan memakai kunci `at` (dikonversi mesin jadi angka); pakai `t` (mis. `chat16.msgs[].t`, `listenTimer.t1`).
- Render pakai `--workers 4` (6 proses pernah dihentikan sistem karena memori rendah).

## Isi episode (ringkas)
| Adegan | Isi | Lokasi / efek utama |
|---|---|---|
| 1 | Pak Wijaya menggebrak meja resepsionis; Rina turun tangga: "Itu bukan bagian saya." → bekukan gambar | `lobi` (`deskFront`, `stairs`, `slam`/`slam2`), `freeze` |
| 2 | Kartu judul JUNI · EPS 1/4 | `title` |
| 3 | Seminggu sebelumnya: berkas WIJAYA · 12 TOKO, peta 11 + 1 toko | `kerja`, `storeMap` |
| 4 | Foto kardus TIPE MINI, kilas toko ke-12, "Saya tidak peduli bagian siapa!" | `boxPhoto`, `tokobaru` |
| 5 | Pak Wijaya pergi; Sinta mencatat di tangga | `lobi` + kunci tangga, `hand_keys` |
| 6 | Ruang Pak Hendra: "Intinya apa, Rin?" | `bos` (`folder`) |
| 7 | Bu Ratna: "Apa yang dia dengar?" → papan DENGAR · AKUI · JAM | `kaca`, `boardWrite` |
| 8 | Catatan tempel, nada sambung, "Bicara." → hitam (jeda iklan) | `sticky`, `callScreen`, `hitam` |
| 9 | Telepon kedua, layar terbelah, penghitung 00:30 → 03:05, 3 langkah | `split` kerja + `tokobaru`, `listenTimer`, `steps` |
| 10 | Formulir pesanan: Tipe MINI, dipesan Fitri; pesan diketik lalu dihapus | `orderForm`, `draftChat` |
| 11 | Bayu: unit berangkat besok; 15.00 tepat; balasan jempol | `split`, `clockClose`, `chat16` |
| 12 | Sore: fakta disampaikan dengan tenang; Sinta menutup buku kuning | `split`, `chat16` (gambar formulir), `tokobaru` |
| 13 | Kartu pelajaran (3 baris) + catatan tempel + Pak Wijaya di toko kosong | `lesson`, `sticky`, `tokobaru` |
| 14 | Halte senja: "Tuh kan. Aman!"; kilas lobi; "hanya ada satu Tangani" | `halte`, `chat16` (malam), `lobi` |
| 15 | Selasa 07.10: kardus hilang, rak WIJAYA · TK-12 kosong, Dodi; layar akhir → Klien Terbesar Eps 2 | `split` + `gudang` (`emptyRack`), `calendar`, `endscreen` |

## Yang baru di mesin (dipakai mulai Klien Terbesar Eps 1)
- `engine/panjang/kit16e.js` (dimuat page16.py sesudah kit16d): lokasi `tokobaru` (toko ke-12 Pak Wijaya: rak kosong/terisi `fill`, spanduk SEGERA DIBUKA, meja kasir dengan mesin MINI);
  opsi tambahan lokasi lama: `lobi.stairs` (tangga ke lantai 2, posisi anak tangga `S16.stairStep`), `lobi.deskFront` (meja resepsionis di depan Mbak Wulan; `slam2` = gebrakan kedua, brosur melompat),
  `gudang.emptyRack` (rak kosong berlabel); properti `hand_keys`;
  efek `storeMap`, `boxPhoto`, `freeze`, `listenTimer`, `callScreen`, `orderForm`, `draftChat`, `chat16` (chat ponsel umum: centang biru, gambar formulir, balasan jempol).
- `fx16.js` `endscreen`: opsi `playlist` / `playlistEps` (bawaan tetap "Tak Terlihat").
- `audio16.js`: ambience `tokobaru` = `toko`.
- `meta16.py`: `youtube.hashtags` (bawaan tetap `#KantorTangani #TakTerlihat #duniakerja`).
- `thumb16.py`: jenis thumbnail `lobi` (Pak Wijaya marah dengan dua telapak terbuka + Rina gugup) dan opsi `thumb.tag` (pita oranye atas).
- Figuran (extras di episode.json): Pak Wijaya (kopiah, kemeja cokelat) dan Mbak Wulan (resepsionis, berhijab), sama dengan Tak Terlihat Eps 4. Fitri hanya nama di formulir.
