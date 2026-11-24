# Kantor Tangani: Klien Terbesar Eps 2 (video panjang 16:9, animasi penuh)

Judul: **Orang Gudang Tidak Mau Membantu, Sampai Rina Melakukan Ini | Kantor Tangani: Klien Terbesar Eps 2**
Naskah: `youtube/serial/ep06-naskah.md` (16 adegan; adegan 3 = kartu judul tanpa VO, adegan 16 = cuplikan Eps 3 + layar akhir) · panduan & alat: `youtube/panjang/kantor-01/README.md` (perintah sama, ganti `kantor-01` → `kantor-06`).

## Status
- SELESAI 2026-11-23: `kantor-06-16x9.mp4` 8:15 (495,0 dtk), VO Citra (sudah ada di `vo/`), QC gerak lolos (diam terpanjang 0,75 dtk, di tahan-hitam sebelum jeda iklan adegan 9), lembar kontak `work/qc/lembar_kontak.jpg`, `thumbnail.jpg` (jenis `gudang`), `YOUTUBE.txt`, `chapters.txt`, `tema.json`. Render `--workers 4` (±9 menit). Belum diunggah.
- Bab: 0:00 Sebelumnya · 0:22 Gudang · 0:59 Dodi · 2:39 Warung Bu Tini · 4:21 Rak tahan · 5:28 Diantar sendiri · 7:18 Pelajaran · 7:42 Episode berikutnya (dari waktu adegan sebenarnya; perkiraan naskah lebih panjang). Iklan tengah sesudah adegan 9.
- Pemindaian galat halaman tiap 0,5 dtk (mesin) bersih untuk kantor-04, kantor-05 dan kantor-06 sesudah kit16f + perubahan kit16e.
- Ubah adegan: edit `work/ep06.py` → `python3 youtube/panjang/kantor-06/work/ep06.py` (menulis episode.json + cek semua cue ada di narasi) →
  `~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-06 --workers 4` (+ `thumb16.py`, `qc16.py --sheet`, `qc16.py --motion --mp4`; cek cepat `--stills a1,a9,123.5 --scale .5`).
- `vo/` = VO Citra asli (ElevenLabs, berbayar; a01–a16 kecuali a03). Jangan dihapus / dibuat ulang; jangan ubah baris `> ` di naskah.
- `at` di shot ke-2 dst. ditulis relatif terhadap awal shot; `shot_local()` mengubahnya ke `{cue shot, d}`. Bagian `split` memakai cue.
- **SFX di dalam shot diabaikan mesin** (story16 `buildEvents` hanya membaca `adegan.sfx`). `ep06.py` memindahkan `shot.sfx` ke `adegan.sfx` sesudah `shot_local()`.
  (Di Eps 1–5 sfx tingkat shot ikut terabaikan; gebrakan tetap berbunyi lewat `shake` kamera.)
- Objek waktu bersarang di dalam fx jangan memakai kunci `at`; pakai `t` (mis. `chat16.msgs[].t`, `chat16.input[].t`).
- Render pakai `--workers 4`. Menunggu render: jalankan sebagai tugas latar dan tunggu notifikasinya (jangan `while pgrep -f "render16.py …"`: pola itu cocok dengan baris perintahnya sendiri).

## Isi episode (ringkas)
| Adegan | Isi | Lokasi / efek utama |
|---|---|---|
| 1 | Sebelumnya: gebrakan, "Itu bukan bagian saya", DENGAR · AKUI · JAM, jempol, rak TK-12 kosong | `lobi`, `stickyMove`, `chat16`, `gudang` + `recap` |
| 2 | Selasa 07.30: pintu besi gudang bergeser, Dodi di meja uji: "Orang kantor depan bisanya nyalahin gudang." | `gudang` (`door`/`doorAt`, `bench`, `board`, `emptyRack`), `strikeChip` |
| 3 | Kartu judul JUNI · 2 HARI SEBELUM TOKO BUKA | `title` |
| 4 | Papan cetakan pesan acak; "Printer yang mana?"; pesan Rina sendiri disorot | `messyBoard` |
| 5 | "Apa yang paling bikin Mas pusing dari kami?" → 4 keluhan → tabel 5 kolom di buku kuning | `fiveTable` (notebook) |
| 6 | Bayu datang; buku bon "BAYU: 14 KOPI" | `bonBook` |
| 7 | Warung Bu Tini: alur gudang di kertas nasi + RAK TAHAN, format 5 kolom | `warung`, `flowPaper`, `nasiBungkus` |
| 8 | "Aman, Pak." diketik → dihapus → pesan jujur + jam 17.00; tabel dikirim ke gudang; Dodi mencetak | `chat16` (`input`), `fiveTable` (laptop) |
| 9 | 16.20 Dodi menelepon, Rina berdiri: "Tapi Mbak nggak bakal suka." → hitam (jeda iklan) | `callScreen`, `split` kerja + gudang |
| 10 | Rak tahan: label TK-11 vs tabel TK-12; data pesanan "Diubah oleh: Rina · Senin 14.52" | `holdRack`, `fiveTable` (print), `orderForm` (`head`) |
| 11 | "Maaf, Mas. Saya yang salah." → troli + kunci mobil bak: "Ayo. Kita antar sendiri." | `trolley`, `hand_box`, `hand_keys` |
| 12 | 17.00 kabar tepat janji; jalan malam; depan toko ke-12 jam 19.00; pulang, Dodi bersiul | `kabin`, `jalan`, `tokoluar` + `pickup`, `whistle` |
| 13 | Rabu: terima kasih di grup kantor; Dodi membetulkan topi, menempel format 5 kolom: "Beres, Bos!" | `chat16` (grup), `gudang.board5` |
| 14 | Kamis: pita peresmian, struk pertama di kasir tipe besar, foto struk ke grup gudang (jempol + topi oranye); bon Bayu 14 → 15 | `tokoluar` (`ribbon`), `tokobaru` (`posBig`, `receiptAt`), `chat16` (`receipt`, `cap`), `bonBook` |
| 15 | Kartu pelajaran (3 baris), latar gudang buram | `lesson` |
| 16 | Dua minggu kemudian: dua kiriman terlambat, email "Peringatan terakhir", papan 7 HARI; layar akhir → Klien Terbesar Eps 3 | `warnMail`, `countdown`, `endscreen` |

## Yang baru di mesin (dipakai mulai Klien Terbesar Eps 2)
- `engine/panjang/kit16f.js` (dimuat page16.py sesudah kit16e):
  - Tokoh: opsi look `pencil: true` (pensil di telinga; Dodi lewat `extras.dodi` di episode.json). Membungkus `TT.drawToon`; tanpa opsi tidak berubah.
  - Lokasi baru: `kabin` (kabin mobil bak dari depan, malam; `radioAt`), `jalan` (jalan malam, mobil bak melaju), `tokoluar` (depan toko ke-12; `time`, `banner`, `ribbon`, `ribbonCut`).
  - Opsi tambahan lokasi lama: `gudang.door` + `doorAt`/`doorOpen`, `gudang.board` + `boardQ`/`board5`, `gudang.bench` (meja uji, di depan tokoh `layer:"back"`), `gudang.holdRack`; `tokobaru.posBig`, `tokobaru.receiptAt`.
  - Properti: `pickup`, `trolley`, `nasiBungkus`, `hand_box`, `hand_money`, `hand_bon`.
  - Efek: `messyBoard`, `fiveTable` (notebook / laptop / print), `flowPaper`, `bonBook`, `warnMail`, `whistle`.
- `kit16e.js` (tambahan, Eps 1 tetap sama): `chat16` menerima `input` (teks diketik/dihapus/dikirim), `msgs[].from`, `msgs[].img = "receipt"`, `msgs[].cap` (jempol + topi oranye), pesan gambar tanpa teks; `orderForm.head`; `emptyRack.note: false`.
- `audio16.js`: ambience `kabin`/`jalan`/`tokoluar` = `halte`.
- `thumb16.py`: jenis thumbnail `gudang` (Dodi bersedekap + pensil, Rina dengan buku kuning) dan opsi `thumb.lineSize`.
- Figuran baru (extras): Bu Tini (berhijab), Mas Eko & Mas Jaka (staf gudang), pembeli pertama (berhijab); Pak Wijaya & Mbak Wulan sama dengan Eps 1.
