# Prosedur produksi episode "Kantor Tangani" (16:9, ±8 menit)

Dari root repo. `V=~/.cache/studio-deps/venv/bin/python`. Kunci ElevenLabs lewat env `K1` (cadangan `K2`,`K3`).

## 0. Server baru (sekali)
```bash
bash setup.sh                       # venv, playwright, pillow, bangun engine/studio-tangani.html, cek chrome/ffmpeg/node
cp .env.example .env && nano .env && set -a && . ./.env && set +a
```

## 1. Naskah
Tulis `youtube/serial/epNN-naskah.md` mengikuti `epNN` sebelumnya (adegan bernomor, baris `> ` = narasi Citra, `Balon` = ucapan di layar).
±980–1000 kata narasi, jeda iklan ±4:00. Alur & benang merah: `garis-besar.md`, `panduan-serial.md`. Minta tinjauan pemilik sebelum VO.

## 2. VO Citra (berbayar — sekali saja)
```bash
K1=$K1 python3 tools/panjang/vo16.py youtube/panjang/kantor-NN   # vo/aNN.mp3 + .json (timestamp); yang sudah ada dilewati
```
Uji tanpa kredit: `python3 tools/panjang/vo_dummy16.py youtube/panjang/kantor-NN`. Suara Citra = `RbNgJzKAV7jpYJNtCBpj`, model `eleven_v4`, bahasa `id`.

## 3. Animasi
Buat `youtube/panjang/kantor-NN/{tema.json,README.md}` dan `work/epNN.py` (salin dari episode terbaru). Generator menulis `episode.json` dan
mengecek semua cue ada di narasi: `python3 youtube/panjang/kantor-NN/work/epNN.py`. Lokasi/efek baru → `engine/panjang/kit16<huruf>.js`
(daftarkan di `tools/panjang/page16.py`). Tokoh hanya dari `youtube/tokoh/tokoh.json`.

## 4. Render, thumbnail, QC
```bash
$V tools/panjang/render16.py youtube/panjang/kantor-NN --workers 3     # ±10–12 mnt; uji cepat: --stills a1,a6,123.5 --scale .5  /  --from 120 --to 160
$V tools/panjang/thumb16.py  youtube/panjang/kantor-NN                  # thumbnail.jpg
$V tools/panjang/qc16.py youtube/panjang/kantor-NN --sheet              # work/qc/lembar_kontak.jpg → LIHAT gambarnya
$V tools/panjang/qc16.py youtube/panjang/kantor-NN --motion --mp4       # diam terpanjang ≤ 0,8 dtk
python3 tools/panjang/meta16.py youtube/panjang/kantor-NN               # YOUTUBE.txt + chapters.txt
```
Render serial (`flock youtube/panjang/.render.lock …`); bila proses dihentikan sistem, turunkan `--workers`.

## 5. Selesai
Perbarui `status` di `youtube/rencana-90.json` (naskah → produksi → jadi). Commit tanpa mp4. Unggah ke YouTube manual
(judul/deskripsi/bab dari `YOUTUBE.txt` dan `chapters.txt`).

## Cek konsistensi
Semua tokoh wanita berhijab · tokoh sesuai `tokoh.json` · aksen #C2691F + logo Tangani · suara Citra · durasi ≥ 8 menit · catatan "cerita fiksi".
