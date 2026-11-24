#!/usr/bin/env python3
"""Salin VO yang sudah jadi (mis. vo_citra/adegan01.mp3 + adegan01.json dari ElevenLabs) ke layout vo/aNN.*.
usage: python3 tools/panjang/vo_import16.py youtube/panjang/kantor-01/vo_citra youtube/panjang/kantor-01
Suara robot sementara yang tertimpa dipindah ke vo_robot/. Folder sumber tidak diubah."""
import json, re, shutil, sys
from pathlib import Path
src, d = Path(sys.argv[1]), Path(sys.argv[2]); out = d / "vo"; bak = d / "vo_robot"; out.mkdir(exist_ok=True)
for js in sorted(src.glob("*.json")):
    m = re.search(r"(\d+)$", js.stem)
    mp3 = js.with_suffix(".mp3")
    if not m or not mp3.exists():
        continue
    name = f"a{int(m.group(1)):02d}"; j = json.loads(js.read_text("utf-8"))
    if len(j["chars"]) != len(j["text"]):
        j["text"] = "".join(j["chars"])
    old = out / f"{name}.json"
    if old.exists() and json.loads(old.read_text("utf-8")).get("dummy"):
        bak.mkdir(exist_ok=True); shutil.move(str(old), bak / old.name); shutil.move(str(out / f"{name}.mp3"), bak / f"{name}.mp3")
    shutil.copyfile(mp3, out / f"{name}.mp3"); (out / f"{name}.json").write_text(json.dumps(j, ensure_ascii=False))
    print(name, "<-", js.name, f"{j['end'][-1]:.2f} dtk")
