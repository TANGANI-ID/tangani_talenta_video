#!/bin/bash
# Siapkan server baru: bash setup.sh
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
# 1) Skrip lama memakai path absolut ini; buat symlink bila repo diklon di tempat lain.
TARGET=/var/www/tangani_talenta/tangani_talenta_video
if [ "$ROOT" != "$TARGET" ] && [ ! -e "$TARGET" ]; then
  mkdir -p "$(dirname "$TARGET")" && ln -s "$ROOT" "$TARGET" && echo "symlink $TARGET -> $ROOT"
fi
# 2) Python venv + playwright + pillow (lokasi yang dipakai semua skrip)
V=~/.cache/studio-deps/venv
[ -x $V/bin/python ] || python3 -m venv $V
$V/bin/pip install -q playwright pillow
# 3) Paket npm (mp4-muxer + font) di-install otomatis oleh engine/render_explainer.py saat render pertama (butuh node/npm & internet).
# 4) Mesin: studio-tangani.html (dibangun dari studio.html + motion-tangani.js + engine/packs/*.js)
python3 -I "$ROOT/engine/build_engine.py"
# 5) Cek yang wajib ada
for c in google-chrome ffmpeg ffprobe node npm curl; do command -v $c >/dev/null && echo "ok  $c" || echo "KURANG  $c  (wajib)"; done
echo "Selesai. Baca README.md dan docs/PROSEDUR.md"
