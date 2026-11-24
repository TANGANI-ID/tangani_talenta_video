# Kantor Tangani: Tak Terlihat Eps 3 (video panjang 16:9, animasi penuh)

Judul: **Atasan Kirim Chat Jam 11 Malam Terus. Ternyata Ini Sebabnya | Kantor Tangani: Tak Terlihat Eps 3**
Naskah: `youtube/serial/ep03-naskah.md` (adegan dinomori ulang 1–16; "6b" lama = Adegan 7) · panduan & alat: `youtube/panjang/kantor-01/README.md` (perintah sama, ganti `kantor-01` → `kantor-03`).

## Status
- SELESAI 2026-11-23: `kantor-03-16x9.mp4` 8:20, VO Citra (ElevenLabs, salinan di `vo_citra/`), QC gerak lolos (diam terpanjang 0,75 dtk), lembar kontak `work/qc/lembar_kontak.jpg`, `thumbnail.jpg`, `YOUTUBE.txt`. Belum diunggah ke YouTube.
- Render ulang: `python3 work/ep03.py` (tulis ulang episode.json) lalu `~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-03` (+ `thumb16.py`, `qc16.py --sheet`, `qc16.py --motion --mp4`).
- `work/ep03.py` → `shot_local()`: mesin membaca `at` (aktor/kamera/fx) sebagai detik sejak awal ADEGAN; generator ini menulis `at` di shot ke-2 dst. relatif terhadap awal SHOT lalu mengubahnya otomatis ke `{cue shot, d}`. Tanpa ini zoom kamera/gerak tokoh sudah selesai sebelum shot tampil (adegan 10 sempat diam 3,25 dtk). Eps 1–2 masih punya beberapa kunci seperti itu (lolos QC, tidak diubah).
- Balon panjang tokoh duduk di close-up jatuh ke bawah kepala (menutupi wajah) bila tidak muat di atas; adegan 12: kamera mundur dulu + balon 2 baris (`maxW` 820, `size` 42, `d0`).

## Yang baru di mesin (dipakai mulai Eps 3)
- `engine/panjang/kit16c.js` (dimuat page16.py sesudah kit16b): lokasi `toilet`; properti `bigPlant`, `hand_folder`, `hand_envelope(s)`, `hand_bowl`, `hand_glasses`;
  efek `radarChat`, `ccMail`, `updateDay`, `headphones` (leher → telinga), `capGlasses`, `wrongSend`, `cycle`, `msgChart`, `phoneDraft`, `alarm`, `nightCount`,
  `boardWrite`, `rulePoster`, `sleepBed`, `folderDesk`, `envelope`, `catPop`, `strikeChip`; slide rapat `aturan` (locOpt `aturan1`/`aturan2`).
- `kit16b.js`: `report` kini menerima `reply` (2 baris), `replyChip`, `sentTime`; pembantu ponsel diekspor (`S.phoneShell`, `S.chatHeader`, `S.bubbleMsg`, `S.avatar`).
- `loc16.js`: `kaca` view luar menerima `bandY` (pita kaca buram; bawaan 520 = sama seperti Eps 1–2).
- `thumb16.py`: jenis thumbnail `radar`.
- Tokoh ganti look per shot: `"look": {"glasses": false}` pada aktor (Bu Ratna melepas kacamata).
