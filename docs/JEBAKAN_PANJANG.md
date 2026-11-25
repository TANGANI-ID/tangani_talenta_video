# Jebakan & pelajaran video panjang (Eps 1–8)

**Waktu & cue**
- `at` aktor/kamera/fx = detik sejak awal **ADEGAN** (bukan shot). Kamera "at 0, dur 4" di shot ke-2+ sudah selesai sebelum shot tampil → layar diam. Pakai `shot_local()` (ada di `ep03.py`+; salin ke generator baru) yang mengubah `at` shot-lokal menjadi `{cue shot, d}`.
- Cue di story16 hanya huruf kecil dan tanda baca harus persis. Cue "Tiga"/"Satu" kena kata yang sama lebih awal ("tiga baris"); pakai frasa unik ("Tiga: bantuan"). Jalankan `check_cues()`.
- Objek waktu bersarang di dalam fx jangan berkunci `at` (diubah `rel()` jadi angka) — pakai `t`.
- SFX di level shot **diabaikan** mesin; taruh di level adegan (bug ini masih mempengaruhi kantor-01–05).
- Bug lama: fx dengan `out: {cue}` dikonversi relatif; sudah diperbaiki (`out` = waktu lokal adegan).

**Tata letak**
- Balon tokoh yang tidak muat di atas kepala (close-up/zoom) pindah ke bawah dan menutup wajah → perpendek balon (`maxW`), geser (`side`), atau mundurkan kamera. Balon juga menutupi teks slide di belakang.
- `confused` memunculkan "?" oranye di samping kepala. Efek ponsel (`phoneShell`) menutup layar penuh → jadikan shot sisipan.
- Tokoh duduk 540 px berjarak ~300 saling menutup; tokoh yang di-close-up taruh di ujung dekat pembicara dan beri `z` lebih tinggi.
- `LOC.kaca` view "luar": pita buram menutup wajah tokoh duduk; untuk close-up pakai view "dalam". Slide rapat `"logo"` bila layar proyektor tidak boleh berisi teks.
- Layar terbelah (split): balon dobel — pakai opsi `ownBubbles` (kit16g).

**Render & QC**
- Render `--workers 4` (6 proses dihentikan sistem karena memori; server lain ikut memakai RAM). Eps 4 kantor-08 berhasil dengan `--workers 3`.
- Pemantau `while pgrep -f "render16.py …"` mencocokkan dirinya sendiri; pakai pola `[r]ender16`.
- QC tidak menangkap helper JS yang hilang: baca log render untuk error halaman.
- Frame krem polos di lembar kontak bisa sekadar kilat transisi, bukan frame rusak.
- Narasi <960 kata → durasi di bawah 8 menit (batas mid-roll).
- Thumbnail Eps 4 (jempol mirip jari tengah di ukuran kecil) dibiarkan atas keputusan pemilik.
