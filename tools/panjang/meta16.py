#!/usr/bin/env python3
"""YOUTUBE.txt + chapters.txt + tema.json (untuk halaman admin #/youtube) dari episode.json + work/timeline.json.
usage: python3 tools/panjang/meta16.py youtube/panjang/kantor-01"""
import json, sys
from pathlib import Path

d = Path(sys.argv[1]).resolve()
ep = json.loads((d / "episode.json").read_text("utf-8"))
tl = json.loads((d / "work" / "timeline.json").read_text("utf-8"))
start = {a["n"]: a["start"] for a in tl["adegan"]}


def mmss(t):
    t = int(round(t)); return f"{t // 60}:{t % 60:02d}"


chap = [(0.0 if i == 0 else start[n], name) for i, (n, name) in enumerate(ep["chapters"])]
chapters = "\n".join(f"{mmss(t)} {name}" for t, name in chap)
L = ep["lessons"]
Y = ep.get("youtube", {})
DESC = Y.get("desc", "Tiga tahun Rina datang paling pagi dan pulang paling malam. Tapi saat pengumuman koordinator tim, yang dipanggil justru Sinta. Apa yang kurang dari Rina? Ikuti ceritanya di episode pertama Kantor Tangani: Tak Terlihat.")
ASK = Y.get("ask", "Pernahkah kamu merasa sudah kerja keras, tapi tidak dilirik? Tulis di kolom komentar.")
NEXT = Y.get("next", "Tak Terlihat Eps 2 tayang berikutnya.")
TAGS = Y.get("tags", "kantor tangani, tak terlihat, cerita kantor, animasi kantor, kerja keras, naik jabatan, promosi kerja, layanan pelanggan, dunia kerja, Tangani Talenta")
AD = int(Y.get("adAfter", 8))
TAGS_H = Y.get("hashtags", "#KantorTangani #TakTerlihat #duniakerja")
txt = f"""JUDUL:
{ep['title']}

DESKRIPSI:
{DESC}

Cerita fiksi. Tokoh dan kejadian dalam cerita ini rekaan.

{Y.get("lessonHead", "Yang bisa kamu bawa dari cerita Rina:")}
1. {L[0]}
2. {L[1]}
3. {L[2]}

{ASK}

{Y.get("about", "Kantor Tangani adalah serial animasi tentang dunia kerja dari Tangani Talenta.")} {NEXT} Subscribe supaya tidak ketinggalan.

BAB:
{chapters}

{TAGS_H}

TAG:
{TAGS}

DURASI: {mmss(tl['dur'])} · iklan tengah: sesudah adegan {AD} (± {mmss(start.get(AD + 1, 0))})
"""
(d / "YOUTUBE.txt").write_text(txt, encoding="utf-8")
(d / "chapters.txt").write_text(chapters + "\n", encoding="utf-8")
parts = [{"name": n, "chapters": [c[1] for c in chap[a:b]]} for n, a, b in ep["parts"]] if ep.get("parts") else [{"name": "Pembuka & masalah", "chapters": [c[1] for c in chap[:2]]}, {"name": "Memburuk", "chapters": [c[1] for c in chap[2:4]]},
         {"name": "Berubah & hasil", "chapters": [c[1] for c in chap[4:6]]}, {"name": "Episode berikutnya", "chapters": [c[1] for c in chap[6:]]}]
tema = {"slug": d.name, "title": ep["title"], "kicker": f"{ep['series']}: {ep['story']} · Eps {ep['eps']} · animasi 16:9", "kind": "cerita16",
        "parts": parts, "lessons": L, "duration": tl["dur"], "voice": "robot sementara" if tl.get("dummy") else "Citra (ElevenLabs)"}
(d / "tema.json").write_text(json.dumps(tema, ensure_ascii=False, indent=1), encoding="utf-8")
print("YOUTUBE.txt, chapters.txt, tema.json siap ·", chapters.replace("\n", " | "))
