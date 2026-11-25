#!/bin/bash
# usage: dummy_vo.sh CODE  (run from project root) -> CODE/vo.mp3 robot voice (espeak-ng) with the same paragraph pauses,
# fitted to 59.2 s. ONLY for testing scenes before the real ElevenLabs VO exists; tts.sh later overwrites vo.mp3.
set -eu; e=$1; T=$(mktemp -d)
python3 -I - "$e" "$T" <<'PY'
import json, sys, subprocess
e, T = sys.argv[1:3]
paras = [p.strip() for p in json.load(open(f"{e}/.tts.json"))["text"].split("\n\n") if p.strip()]
lst = []
for i, p in enumerate(paras):
    subprocess.run(["espeak-ng", "-v", "id", "-s", "165", "-w", f"{T}/p{i}.wav", p], check=True)
    lst.append(f"file '{T}/p{i}.wav'")
    if i < len(paras) - 1: lst.append(f"file '{T}/gap.wav'")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono", "-t", "0.7", f"{T}/gap.wav"], check=True)
open(f"{T}/l.txt", "w").write("\n".join(lst))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{T}/l.txt", "-ar", "44100", "-b:a", "128k", f"{e}/vo_dummy_raw.mp3"], check=True)
PY
printf "$e (dummy): "; python3 -I engine/fit_vo.py $e/vo_dummy_raw.mp3 $e/vo.mp3 || true
rm -rf "$T"
