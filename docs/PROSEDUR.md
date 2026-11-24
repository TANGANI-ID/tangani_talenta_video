# Prosedur produksi video

Semua perintah dijalankan dari **root repo** (`/var/www/tangani_talenta/tangani_talenta_video`).
`V=~/.cache/studio-deps/venv/bin/python` (dibuat `setup.sh`). Selalu pakai `-I` untuk skrip yang membaca folder tak tepercaya.
Kunci ElevenLabs lewat variabel lingkungan `K1` (`K2`,`K3` cadangan) — jangan ditulis ke file.

## 0. Siapkan server (sekali)
```bash
bash setup.sh      # venv + playwright + pillow, bangun engine/studio-tangani.html, cek chrome/ffmpeg/node
cp .env.example .env && nano .env && set -a && . ./.env && set +a
```

## A. Video pendek 9:16 "1 Menit 1 Insight" (60 dtk)

### A1. Render ulang episode yang sudah ada (paling mudah)
`<KODE>/project.json` sudah berisi seluruh adegan, merek, logo, gaya. Hanya VO & render yang perlu dibuat.
```bash
K1=$K1 K2=$K2 tools/tts.sh SB01       # butuh <KODE>/.tts.json; menulis vo_raw.mp3 → vo.mp3 (tepat 59,2 dtk, suara Citra)
```
Jika episode tidak punya `.tts.json`, buat dari `vo_text.txt`/`project.json` (lihat `tools/mk_lib.py`, fungsi `mk()` menulisnya).
```bash
cd SB01 && $V -I ../engine/render_explainer.py --html ../engine/studio-tangani.html \
  --project project.json --vo vo.mp3 --out SB01-tangani-talenta-9x16.mp4 ; cd ..
```
Gaya/tema/gerak dibaca dari `project.json` + `engine/motion-tangani.js`; adegan khusus episode ada di `engine/packs/*.js`
(paket ikut dibangun ke `studio-tangani.html` oleh `build_engine.py`). Render **satu per satu** (berat memori).

### A2. Membuat episode baru
1. Ambil insight/aksi episode dari `plan.md` (atau `docs/Kurikulum-…docx`). Baca `docs/KARAKTER.md` (aturan wajib).
2. **Prompt agen** (dipakai persis untuk produksi massal; berisi aturan naskah, QC, render):
   - Mode cerita (kartun layar penuh, tokoh toon): `tools/BRIEF_CERITA.md` → rujukan `tools/API_CERITA.md`, `tools/JEBAKAN_CERITA.md`, `engine/packs/cerita_demo.js`
   - Mode adegan (infografis): `tools/BRIEF_ADEGAN.md`
   - Bungkus tugas: `tools/agent_prompt.md` (template `{{ROOT}} {{COUNT}} {{MODE}} {{EPISODES}} {{BRIEF}} {{PACK}} {{PREFIX}} {{W}} {{NOTES}}`) — mis. dengan `claude -p` headless.
3. Alur per episode: paket adegan `engine/packs/<paket>.js` (mulai dari `tools/pack_template.js`; nama layout berprefiks unik) →
   `python3 -I engine/build_engine.py --pack engine/packs/<paket>.js --out engine/studio-<paket>.html` →
   generator naskah mengikuti `tools/examples/mk_cerita_g.py` / `mk_set8a.py` (memakai `tools/mk_lib.py`; menulis `project.json` + `.tts.json`) →
   (uji tanpa kredit: `tools/dummy_vo.sh CODE`) → VO `tools/tts.sh CODE` → QC → render → tulis `episode.json`.
4. Naskah: 5 adegan isi + CTA, ±113–125 kata (batas adegan di akhir kalimat; CTA ditutup "Selamat hari <hari>."). Durasi akhir wajib 60 dtk; bila QC menampilkan "Durasi 59.9": `ffmpeg -i vo.mp3 -af apad -t 59.25 vo2.mp3`.
5. QC wajib: `$V -I tools/qc.py engine/studio-<paket>.html CODE <outdir>` lalu **lihat lembar kontak** (qc.py bisa "errors: none" padahal adegan hitam/terpotong). Uji gerak: `$V -I tools/motion.py engine/studio-<paket>.html CODE <outdir>` (tidak boleh ada bagian diam > 0,8 dtk). Cuplik frame: `tools/frames_at.py`.
6. Jebakan layout/kamera/tokoh hasil pengalaman 365 episode: `tools/JEBAKAN_CERITA.md`.

## B. Video panjang 16:9 "Kantor Tangani" (±8 menit)
Satu folder per episode `youtube/panjang/kantor-0N/` (README di tiap folder; panduan terlengkap: `kantor-01/README.md` dan `kantor-05/README.md`).
Naskah: `youtube/serial/epNN-naskah.md` (baris `> ` = narasi Citra; **jangan diubah setelah VO dibuat**). Generator adegan: `work/epNN.py` (menulis `episode.json`, mengecek cue).
```bash
python3 youtube/panjang/kantor-05/work/ep05.py                         # naskah → episode.json (+cek cue)
K1=$K1 python3 tools/panjang/vo16.py youtube/panjang/kantor-05          # VO Citra + timestamp (SUDAH ADA untuk kantor-01…08; lewati)
$V tools/panjang/render16.py youtube/panjang/kantor-05 --workers 3     # ±10–12 menit; 3–4 worker agar tidak kehabisan memori
$V tools/panjang/thumb16.py  youtube/panjang/kantor-05                  # thumbnail.jpg
$V tools/panjang/qc16.py youtube/panjang/kantor-05 --sheet              # lembar kontak
$V tools/panjang/qc16.py youtube/panjang/kantor-05 --motion --mp4       # cek tidak diam > 0,8 dtk
python3 tools/panjang/meta16.py youtube/panjang/kantor-05               # YOUTUBE.txt + chapters.txt
```
Uji cepat: `render16.py … --stills a1,a6,123.5 --scale .5` atau `--from 120 --to 160`. Render serial: bungkus dengan `flock`.
Mesin: `engine/panjang/` (story16, loc16 lokasi, fx16/kit16b–h efek, audio16). Lokasi/efek baru ditambah sebagai `kit16<huruf>.js` dan didaftarkan di `tools/panjang/page16.py`.
Pelajaran penting: `at` aktor/kamera/fx = detik sejak awal ADEGAN (bukan shot); gunakan `shot_local()` seperti di `ep03.py`+. Efek ponsel harus jadi shot sisipan.
Judul: `<hook> | Kantor Tangani: <nama cerita> Eps N` (≤100 karakter). Jadwal tayang & rencana 90 video: `youtube/serial/panduan-serial.md`, `youtube/rencana-90.md`.

## C. Cek konsistensi sebelum rilis
- Semua tokoh wanita berhijab; tokoh sesuai `youtube/tokoh/tokoh.json`.
- Warna aksen #C2691F, logo Tangani di tengah atas, footer talenta.tangani.id; suara Citra (voice_id `RbNgJzKAV7jpYJNtCBpj`).
- Durasi pendek 60,0 dtk; panjang ≥ 8 menit.
- Tidak ada adegan kembar dengan episode lain (grep `TT.layout` di `engine/packs/`).
