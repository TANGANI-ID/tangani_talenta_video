#!/usr/bin/env python3
"""Suara robot SEMENTARA (espeak-ng) per adegan, format sama dengan vo16.py (ElevenLabs), diperlambat ke
±127 kata/menit (kecepatan Citra). Hanya untuk uji animasi; vo16.py otomatis menimpa berkas "dummy".

usage: python3 tools/panjang/vo_dummy16.py youtube/panjang/kantor-01 [--force]"""
import json, re, subprocess, sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16 import ROOT, load_episode, narration, vo_name, duration

WPM = 127.0


def syl(w):
    return max(1, len(re.findall(r"[aiueoAIUEO]+", w)))


def chunks(text):
    """split into (chunk_text, char_offset) at , . ? ! : … boundaries (punctuation stays with the word)."""
    out, start = [], 0
    for m in re.finditer(r"[,.?!:;…]+[\"”]?(\s+|$)", text):
        end = m.end()
        seg = text[start:end]
        if seg.strip():
            out.append((seg, start))
        start = end
    if text[start:].strip():
        out.append((text[start:], start))
    return out


def main():
    d = Path(sys.argv[1]).resolve(); force = "--force" in sys.argv
    ep = load_episode(d); nar = narration(ROOT / ep["naskah"]); out = d / "vo"; out.mkdir(exist_ok=True)
    for n, text in sorted(nar.items()):
        name = vo_name(n); mp3, js = out / f"{name}.mp3", out / f"{name}.json"
        if mp3.exists() and js.exists() and not force:
            continue
        T = Path(tempfile.mkdtemp())
        parts, lst, words, t = chunks(text), [], [], 0.0
        for k, (seg, off) in enumerate(parts):
            wav = T / f"c{k}.wav"
            subprocess.run(["espeak-ng", "-v", "id", "-s", "150", "-w", str(wav), seg.strip().strip('"“”')], check=True)
            # trim espeak's own leading/trailing silence
            tr = T / f"t{k}.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-af",
                            "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                            "-ar", "22050", "-ac", "1", str(tr)], check=True)
            dur = duration(tr)
            ws = [(m.group(0), off + m.start()) for m in re.finditer(r"\S+", seg)]
            tot = sum(syl(w) for w, _ in ws) or 1; acc = 0
            for w, i in ws:
                a = t + acc / tot * dur; acc += syl(w); b = t + acc / tot * dur
                words.append((i, i + len(w), a, b))
            lst.append(f"file '{tr}'"); t += dur
            last = seg.rstrip()[-1:] if seg.rstrip() else ""
            gap = .34 if last in ".?!…\"”" else .2 if last in ":;" else .13 if last == "," else 0
            if k < len(parts) - 1 and gap:
                g = T / f"g{k}.wav"
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono", "-t", f"{gap}", str(g)], check=True)
                lst.append(f"file '{g}'"); t += gap
        (T / "l.txt").write_text("\n".join(lst))
        raw = T / "raw.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(T / "l.txt"), str(raw)], check=True)
        L = duration(raw); target = len(text.split()) / WPM * 60; tempo = L / target
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", f"atempo={tempo:.5f},volume=1.6", "-ar", "44100", "-ac", "1",
                        "-b:a", "128k", str(mp3)], check=True)
        sc = 1 / tempo; starts = [0.0] * len(text); ends = [0.0] * len(text); prev = 0.0
        wi = 0
        for ci in range(len(text)):
            while wi < len(words) and words[wi][1] <= ci:
                wi += 1
            if wi < len(words) and words[wi][0] <= ci < words[wi][1]:
                i0, i1, a, b = words[wi]; q0 = (ci - i0) / (i1 - i0); q1 = (ci + 1 - i0) / (i1 - i0)
                starts[ci] = (a + (b - a) * q0) * sc; ends[ci] = (a + (b - a) * q1) * sc; prev = ends[ci]
            else:
                starts[ci] = ends[ci] = prev
        js.write_text(json.dumps({"text": text, "src": text, "chars": list(text), "start": [round(x, 3) for x in starts],
                                  "end": [round(x, 3) for x in ends], "dummy": True}, ensure_ascii=False))
        subprocess.run(["rm", "-rf", str(T)])
        print(f"{name} (robot): {duration(mp3):.2f} dtk, {len(text.split())} kata, tempo x{tempo:.2f}")


if __name__ == "__main__":
    main()
