# Kantor Tangani: Klien Terbesar Eps 3 (video panjang 16:9, animasi penuh)

Judul: **Klien Terbesar Memberi Waktu 7 Hari Sebelum Pergi | Kantor Tangani: Klien Terbesar Eps 3**
Naskah: `youtube/serial/ep07-naskah.md` (15 adegan; adegan 3 = kartu judul tanpa VO, adegan 15 = cuplikan Eps 4 + layar akhir) · panduan & alat: `youtube/panjang/kantor-01/README.md` (perintah sama, ganti `kantor-01` → `kantor-07`).

## Status
- SELESAI 2026-11-23: `kantor-07-16x9.mp4` 8:15 (495,0 dtk), VO Citra (sudah ada di `vo/`), log render tanpa galat halaman, QC gerak lolos (diam terpanjang 0,25 dtk), lembar kontak `work/qc/lembar_kontak.jpg`, `thumbnail.jpg` (jenis `hari7`), `YOUTUBE.txt`, `chapters.txt`, `tema.json`. Render `--workers 4` di bawah `flock` (±12 menit). Belum diunggah.
- Bab: 0:00 Sebelumnya · 0:21 Tujuh hari · 0:59 Tanpa alasan · 2:49 Canggung tapi efektif · 4:07 Kabar buruk · 5:23 Buku kuning Sinta · 6:32 Keputusan Pak Wijaya · 7:12 Pelajaran · 7:36 Episode berikutnya (dari waktu adegan sebenarnya). Iklan tengah sesudah adegan 9.
- Ubah adegan: edit `work/ep07.py` → `python3 youtube/panjang/kantor-07/work/ep07.py` (menulis episode.json + cek semua cue) →
  `flock youtube/panjang/.render.lock ~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-07 --workers 4`
  (+ `thumb16.py`, `qc16.py --sheet`, `qc16.py --motion --mp4`; cek cepat `--stills a1,a9,123.5 --scale .5` tanpa kunci). Periksa log render untuk "galat halaman".
- Kunci `flock` dipakai bersama agen Eps 4 (kantor-08) supaya dua render penuh tidak berjalan bersamaan (memori).
- `vo/` = VO Citra asli (a01–a15 kecuali a03). Jangan dihapus / dibuat ulang; jangan ubah baris `> ` di naskah.
- SFX selalu di tingkat adegan (`ep07.py` memindahkan `shot.sfx`; mesin mengabaikan sfx di dalam shot).
- Penanda hari `dayCount` memakai kunci `day` (bukan `n`: `n` di objek cue = nomor kemunculan kalimat).
- Adegan dengan layar terbelah memakai `"ownBubbles": true` (opsi baru story16): balon hanya digambar di separuh milik tokohnya.
  Tanpa opsi ini balon tokoh kiri ikut tergambar lagi di separuh kanan (terjadi di Klien Terbesar Eps 1 adegan 12; tidak diubah).

## Isi episode (ringkas)
| Adegan | Isi | Lokasi / efek utama |
|---|---|---|
| 1 | Sebelumnya: gebrakan, telepon kedua, rak tahan TK-11, toko buka, email | `lobi`, `split`, `gudang`, `tokoluar`, `warnMail` + `recap` |
| 2 | Ruang Melati: email di layar, Pak Hendra menempel "7 HARI", semua menoleh ke Rina | `rapat` (`slide: "email"`), `projSlide`, `easel7` |
| 3 | Kartu judul JUNI · HARI 1 DARI 7 | `title` |
| 4 | Draf email alasan memanjang; tangan Bu Ratna ke mouse lalu ditarik | `excuseDraft` |
| 5 | Hari 1: draf dihapus, telepon tanpa alasan; buku kecil Pak Wijaya | `split`, `wijayaBook`, `dayCount` |
| 6 | Papan pemulihan: CEK GANDA · KURIR CADANGAN · KABAR 17.00 + 7 kotak | `recBoard`, `recBoardFx` |
| 7 | Bu Ratna mendorong meja Sinta ke sebelah Rina; hening canggung | `deskFront` ×2 (kunci `x`), `taps` |
| 8 | Hari 2–3: pesan 17.00 Sudah/Sedang/Risiko → "Ok."; Sinta membantu; cek ganda di gudang | `chat16`, `hand_scanner` |
| 9 | Hari 4: ban pecah di hujan, papan, hitung mundur 7 → 3, "Aman, Pak" diketik → hitam (jeda iklan) | `jalanHujan` + `truck`, `countdown`, `chat16.input` |
| 10 | Hapus, telepon lebih dulu: "Lagi?!"; buku kecil "Hari 4: dikabari DULUAN"; Dodi mengantar malam | `split` (`ownBubbles`), `wijayaBook`, `jalan` |
| 11 | Hari 5 malam: buku kuning Sinta "MENGHADAPI KLIEN MARAH (cara Rina)" | `sintaBook` |
| 12 | Hari 6: balasan lebih dari satu kata; gorengan; dua buku kuning | `chat16`, `deskFront` (`gorengan`, `book`), `hand_gorengan` |
| 13 | Hari 7 di Melati: tujuh baris di buku kecil, "Tiga puluh hari. Dengan satu syarat." | `rapat`, `wijayaBook` |
| 14 | Kartu pelajaran, latar papan pemulihan 7 kotak tercentang | `lesson` |
| 15 | Pintu Pak Hendra sedikit terbuka, brosur JASA GUDANG PIHAK KETIGA, pensil Dodi jatuh; layar akhir → Klien Terbesar Eps 4 | `lorong` + `doorAjar`, `bos`, `brochure`, `pencilFall` |

## Yang baru di mesin (dipakai mulai Klien Terbesar Eps 3)
- `engine/panjang/kit16g.js` (dimuat page16.py sesudah kit16f; kit16h milik Eps 4):
  - Lokasi `jalanHujan` (jalan siang berhujan, hujan di lapisan depan); slide rapat `"email"` (opsi `hl7`).
  - Properti: `easel7`, `recBoard`, `deskFront` (meja tampak depan; `laptopX`, `lidW`/`lidH`, `book`, `book2`, `gorengan`, `mug`, `night`), `doorAjar`, `truck` (`flat`), `hand_scanner`, `hand_brochure`, `hand_gorengan`.
  - Efek: `dayCount`, `projSlide`, `excuseDraft`, `recBoardFx`, `wijayaBook`, `sintaBook`, `brochure`, `pencilFall`.
- Tambahan kecil di berkas bersama (tanpa opsi = sama seperti sebelumnya): `kit16f.js` opsi aktor `pencilOff` (pensil hilang dari telinga mulai waktu itu);
  `story16.js` opsi adegan `ownBubbles` / baris `own` (balon di layar terbelah); `audio16.js` ambience `jalanHujan`; `thumb16.py` jenis thumbnail `hari7`.
- FX.countdown (kit16d) kini benar-benar menghitung mundur 7 → 3 di adegan 9.
