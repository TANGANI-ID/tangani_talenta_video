#!/usr/bin/env python3
"""Susun video panjang landscape 16:9 dari episode 9:16 + VO penghubung.
usage (root proyek, venv studio-deps): build.py youtube/panjang/<tema>
butuh: <tema>/tema.json, work/scenes.json (scene_times.py), work/vo/*.mp3+json (tts_ts.py)
hasil: <tema>/<slug>-16x9.mp4, chapters.txt, work/seg/*.mp4"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

D = Path(sys.argv[1]); T = json.loads((D / "tema.json").read_text())
W_ = D / "work"; L = W_ / "layers"; S = W_ / "seg"; L.mkdir(parents=True, exist_ok=True); S.mkdir(exist_ok=True)
SC = json.loads((W_ / "scenes.json").read_text())
FD = Path.home() / ".cache/studio-deps"
def F(fam, w, size):
    p = {"pop": f"fontsource-poppins-5.3.0/package/files/poppins-latin-{w}-normal.woff",
         "jak": f"fontsource-plus-jakarta-sans-5.3.0/package/files/plus-jakarta-sans-latin-{w}-normal.woff"}[fam]
    return ImageFont.truetype(str(FD / p), size)
W, H, FPS = 1920, 1080, 30
NAVY, NAVY2, CREAM, ORANGE, ORANGE_L, GOLD = "#13223D", "#0B1628", "#FFF6EA", "#C2691F", "#F0A35E", "#F6C343"
SLOT = (150, 40, 562, 1000)          # x, y, w, h video vertikal
RX = 820; RW = 1000                  # area teks kanan
CH = [c for p in T["parts"] for c in p["chapters"]]; N = len(CH)
PART_OF = {c: (i, p["name"]) for i, p in enumerate(T["parts"]) for c in p["chapters"]}
LOGO = Image.open("site/public/logo.png").convert("RGBA")

def ff(*a): subprocess.run(["ffmpeg", "-v", "error", "-y", *map(str, a)], check=True)
def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]))
def blank(): return Image.new("RGBA", (W, H), (0, 0, 0, 0))
def wrap(d, text, font, maxw):
    out = []
    for para in text.split("\n"):
        line = ""
        for w in para.split():
            t = (line + " " + w).strip()
            if d.textlength(t, font=font) <= maxw: line = t
            else: out.append(line); line = w
        out.append(line)
    return out
def logo_row(im, x, y, size=46, color=CREAM, font=None):
    lg = LOGO.copy(); lg.thumbnail((size, size)); im.alpha_composite(lg, (x, y))
    ImageDraw.Draw(im).text((x + size + 14, y + size / 2), "Tangani Talenta", font=font or F("pop", 700, 30), fill=color, anchor="lm")

def bg(kind, name):
    """latar: navy + titik halus + bayangan & bingkai slot video; 'orange' untuk kartu bab"""
    im = Image.new("RGBA", (W, H), NAVY)
    g = Image.new("L", (W, H), 0); gd = ImageDraw.Draw(g)
    if kind == "orange":
        im = Image.new("RGBA", (W, H), ORANGE); gd.ellipse((-300, -500, 1300, 1300), fill=110)
        im.alpha_composite(Image.composite(Image.new("RGBA", (W, H), "#D9803A"), Image.new("RGBA", (W, H), (0, 0, 0, 0)), g.filter(ImageFilter.GaussianBlur(160))))
    else:
        gd.ellipse((SLOT[0] - 250, -150, SLOT[0] + SLOT[2] + 250, H + 150), fill=150)
        im.alpha_composite(Image.composite(Image.new("RGBA", (W, H), "#2A3F66"), Image.new("RGBA", (W, H), (0, 0, 0, 0)), g.filter(ImageFilter.GaussianBlur(180))))
        v = Image.new("L", (W, H), 0); ImageDraw.Draw(v).rectangle((0, 0, W, H), fill=0)
    d = ImageDraw.Draw(im)
    dot = (255, 255, 255, 18) if kind != "orange" else (255, 255, 255, 26)
    for yy in range(30, H, 44):
        for xx in range(30, W, 44):
            if kind == "slot" and xx > SLOT[0] + SLOT[2] + 60: continue      # area teks kanan bersih
            if kind == "plain" and 150 < yy < 960: continue
            d.ellipse((xx - 2, yy - 2, xx + 2, yy + 2), fill=dot)
    if kind == "slot":
        x, y, w, h = SLOT
        sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle((x + 8, y + 18, x + w + 8, y + h + 18), 34, fill=(0, 0, 0, 150))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(22)))
        d.rounded_rectangle((x - 7, y - 7, x + w + 7, y + h + 7), 36, fill=ORANGE)
    p = L / f"bg_{name}.png"; im.save(p); return p

def mask():
    p = L / "mask.png"
    m = Image.new("L", SLOT[2:], 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, SLOT[2] - 1, SLOT[3] - 1), 30, fill=255); m.save(p); return p

def progress(im, cur):
    d = ImageDraw.Draw(im); gap = 10; sw = (RW - gap * (N - 1)) / N; y = 1000
    for i in range(N):
        x0 = RX + i * (sw + gap); col = ORANGE_L if i == cur else ((255, 246, 234, 150) if i < cur else (255, 255, 255, 40))
        d.rounded_rectangle((x0, y, x0 + sw, y + 10), 5, fill=col)

def save(im, name): p = L / f"{name}.png"; im.save(p); return p

def word_time(seg, phrase):
    a = json.loads((W_ / "vo" / f"{seg}.json").read_text()); txt = "".join(a["chars"]); i = txt.find(phrase)
    if i < 0: raise SystemExit(f"'{phrase}' tidak ada di {seg}")
    return a["start"][i]

# ---------- segmen ----------
def render(name, d, base, slot_src=None, slot_ss=0, layers=(), audio=None, audio_delay=0.0, clip_audio=False):
    """layers: (png, t_in, t_out|None, slide_px)"""
    args = ["-loop", "1", "-framerate", FPS, "-t", f"{d:.3f}", "-i", base]; idx = 1; fc = []; cur = "[0:v]"
    if slot_src:
        args += ["-ss", f"{slot_ss:.3f}", "-t", f"{d:.3f}", "-i", slot_src, "-loop", "1", "-framerate", FPS, "-t", f"{d:.3f}", "-i", mask()]
        vi, mi = idx, idx + 1; idx += 2
        fc.append(f"[{vi}:v]fps={FPS},scale={SLOT[2]}:{SLOT[3]},setsar=1,format=rgba[sv];[{mi}:v]format=gray[sm];[sv][sm]alphamerge[sr]")
        fc.append(f"{cur}[sr]overlay={SLOT[0]}:{SLOT[1]}:shortest=0:eof_action=repeat[b0]"); cur = "[b0]"
    for k, (png, tin, tout, sl) in enumerate(layers):
        args += ["-loop", "1", "-framerate", FPS, "-t", f"{d:.3f}", "-i", png]
        f = f"[{idx}:v]format=rgba,fade=in:st={tin:.3f}:d=0.45:alpha=1"
        if tout is not None: f += f",fade=out:st={tout:.3f}:d=0.3:alpha=1"
        fc.append(f + f"[l{k}]")
        x = f"'{sl}*pow(max(0,1-(t-{tin:.3f})/0.5),3)'" if sl else "0"
        fc.append(f"{cur}[l{k}]overlay=x={x}:y=0[b{k + 1}]"); cur = f"[b{k + 1}]"; idx += 1
    fc.append(f"{cur}format=yuv420p[vout]")
    if clip_audio:
        fc.append(f"[1:a]aresample=48000,aformat=channel_layouts=stereo,afade=t=out:st={d - 0.3:.3f}:d=0.3,apad,atrim=0:{d:.3f}[aout]")
    elif audio:
        args += ["-i", audio]
        fc.append(f"[{idx}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={int(audio_delay * 1000)}:all=1,apad,atrim=0:{d:.3f}[aout]")
    else:
        args += ["-f", "lavfi", "-t", f"{d:.3f}", "-i", "anullsrc=r=48000:cl=stereo"]; fc.append(f"[{idx}:a]anull[aout]")
    out = S / f"{name}.mp4"
    ff(*args, "-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]", "-t", f"{d:.3f}",
       "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-r", FPS, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", out)
    print("seg", name, f"{d:.2f}s"); return out, d

def montage(name, picks, d):
    """picks: [(code, ss, len)] -> mp4 vertikal tanpa suara selama d"""
    args = []; fc = []
    for i, (c, ss, ln) in enumerate(picks):
        args += ["-ss", f"{ss:.2f}", "-t", f"{ln:.2f}", "-i", f"{c}/{c}-tangani-talenta-9x16.mp4"]
        fc.append(f"[{i}:v]fps={FPS},scale=1080:1920,setsar=1[m{i}]")
    fc.append("".join(f"[m{i}]" for i in range(len(picks))) + f"concat=n={len(picks)}:v=1:a=0,trim=0:{d:.3f}[v]")
    out = S / f"{name}_src.mp4"
    ff(*args, "-filter_complex", ";".join(fc), "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-an", out); return out

def picks_for(scene_idx, d, offset=0):
    out, t, k = [], 0.0, offset
    while t < d + 0.5:
        c = CH[k % N]; s = SC[c]["scenes"]; si = scene_idx if (k // N) % 2 == 0 else scene_idx + 1
        out.append((c, s[si][0] + 1.0, 3.0)); t += 3.0; k += 1
    return out

segs = []; chapters = []

# ---------- pembuka ----------
vo = W_ / "vo" / "intro.mp3"; d = dur(vo) + 0.9; base = bg("slot", "slot")
lay = []
top = blank(); logo_row(top, RX, 70); ImageDraw.Draw(top).text((RX, 140), "KELAS KARYAWAN", font=F("jak", 800, 28), fill=ORANGE_L)
lay.append((save(top, "intro_top"), 0.1, None, 0))
beats = T["intro"]["beats"]
for i, b in enumerate(beats):
    t0 = word_time("intro", b["at"]) + 0.35; t1 = (word_time("intro", beats[i + 1]["at"]) + 0.35 - 0.3) if i + 1 < len(beats) else None
    im = blank(); dr = ImageDraw.Draw(im); fnt = F("pop", 800, 92); lines = wrap(dr, b["text"], fnt, RW)
    y = 540 - len(lines) * 112 / 2
    for j, ln in enumerate(lines):
        dr.text((RX, y + j * 112), ln, font=fnt, fill=GOLD if j == len(lines) - 1 and len(lines) > 1 else "white");
    lay.append((save(im, f"intro_b{i}"), t0, t1, 90))
tt = blank(); dr = ImageDraw.Draw(tt); dr.rounded_rectangle((RX, 860, RX + RW, 960), 22, fill=(255, 255, 255, 28))
dr.text((RX + 30, 910), T["title"], font=F("pop", 700, 34), fill=CREAM, anchor="lm")
lay.append((save(tt, "intro_title"), word_time("intro", "sebelas kebiasaan") + 0.35, None, 0))
src = montage("intro", picks_for(1, d), d)
segs.append(render("00_intro", d, base, src, 0, lay, audio=vo, audio_delay=0.35)); chapters.append(("Pembuka", 0))

# ---------- bab ----------
for n, c in enumerate(CH):
    e = json.loads(Path(f"{c}/episode.json").read_text()); s = SC[c]["scenes"]; pi, pname = PART_OF[c]
    first_of_part = T["parts"][pi]["chapters"][0] == c
    # kartu penghubung
    vo = W_ / "vo" / f"b_{c}.mp3"; d = dur(vo) + 1.0; base = bg("orange", "orange")
    num = blank(); dr = ImageDraw.Draw(num); dr.text((150, 540), f"{n + 1:02d}", font=F("pop", 800, 420), fill=(255, 246, 234, 235), anchor="lm")
    txt = blank(); dr = ImageDraw.Draw(txt); y = 300
    if first_of_part:
        lab = f"BAGIAN {pi + 1} · {pname.upper()}"; fl = F("jak", 800, 30); w = dr.textlength(lab, font=fl)
        dr.rounded_rectangle((RX, y, RX + w + 44, y + 60), 30, fill=NAVY); dr.text((RX + 22, y + 30), lab, font=fl, fill=CREAM, anchor="lm"); y += 100
    else: y += 60
    dr.text((RX, y), f"KEBIASAAN KE-{n + 1}", font=F("jak", 800, 34), fill=(255, 246, 234, 210)); y += 60
    for ln in wrap(dr, e["title"], F("pop", 800, 92), RW): dr.text((RX, y), ln, font=F("pop", 800, 92), fill="white"); y += 112
    segs.append(render(f"{n + 1:02d}a_{c}", d, base, None, 0, [(save(num, f"num_{c}"), 0.05, None, -120), (save(txt, f"card_{c}"), 0.2, None, 90)], audio=vo, audio_delay=0.35))
    chapters.append((f"{n + 1}. {e['title']}", None))
    # episode
    cut = s[-1][0] - 0.4; base = bg("slot", "slot")
    head = blank(); dr = ImageDraw.Draw(head)
    dr.text((RX, 86), f"BAGIAN {pi + 1} · {pname.upper()}", font=F("jak", 800, 28), fill=ORANGE_L)
    dr.text((RX, 120), f"{n + 1:02d}", font=F("pop", 800, 150), fill=ORANGE_L)
    nw = dr.textlength(f"{n + 1:02d}", font=F("pop", 800, 150)); dr.text((RX + nw + 18, 205), f"/ {N}", font=F("pop", 700, 52), fill=(255, 246, 234, 120))
    y = 320; ft = F("pop", 800, 68)
    for ln in wrap(dr, e["title"], ft, RW): dr.text((RX, y), ln, font=ft, fill="white"); y += 84
    progress(head, n); ycard = y + 36
    def card(label, text, fill, lab_col, txt_col, y0, size):
        im = blank(); dr = ImageDraw.Draw(im); fb = F("jak", 700, size); lines = wrap(dr, text, fb, RW - 70)
        h = 34 + 34 + 12 + len(lines) * int(size * 1.32) + 30
        dr.rounded_rectangle((RX, y0, RX + RW, y0 + h), 26, fill=fill)
        dr.text((RX + 35, y0 + 30), label, font=F("jak", 800, 24), fill=lab_col)
        for j, ln in enumerate(lines): dr.text((RX + 35, y0 + 76 + j * int(size * 1.32)), ln, font=fb, fill=txt_col)
        return im, h
    for size in (36, 33, 30, 28):
        ci, h1 = card("INTINYA", e["insight"], CREAM, ORANGE, NAVY, ycard, size)
        ai, h2 = card("COBA MINGGU INI", e["action"], ORANGE, CREAM, "white", ycard + h1 + 24, size - 2)
        if ycard + h1 + 24 + h2 <= 975: break
    lay = [(save(head, f"head_{c}"), 0.0, None, 0), (save(ci, f"ins_{c}"), s[2][0] + 0.3, None, 70), (save(ai, f"act_{c}"), s[4][0] + 0.3, None, 70)]
    segs.append(render(f"{n + 1:02d}b_{c}", cut, base, f"{c}/{c}-tangani-talenta-9x16.mp4", 0, lay, clip_audio=True))

# ---------- penutup ----------
vo = W_ / "vo" / "outro.mp3"; d = dur(vo) + 0.9; base = bg("slot", "slot"); lay = []
top = blank(); dr = ImageDraw.Draw(top); dr.text((RX, 70), "RINGKASAN", font=F("jak", 800, 30), fill=ORANGE_L)
dr.text((RX, 110), "Dilirik atasan = nilaimu terlihat", font=F("pop", 800, 54), fill="white"); lay.append((save(top, "out_top"), 0.2, None, 0))
for i, p in enumerate(T["outro"]["points"]):
    im = blank(); dr = ImageDraw.Draw(im); y0 = 230 + i * 190
    dr.rounded_rectangle((RX, y0, RX + RW, y0 + 165), 26, fill=(255, 255, 255, 26))
    dr.ellipse((RX + 30, y0 + 37, RX + 120, y0 + 127), fill=ORANGE); dr.text((RX + 75, y0 + 82), str(i + 1), font=F("pop", 800, 54), fill="white", anchor="mm")
    dr.text((RX + 150, y0 + 30), p["head"], font=F("pop", 800, 46), fill="white"); dr.text((RX + 150, y0 + 98), p["sub"], font=F("jak", 700, 30), fill=(255, 246, 234, 200))
    lay.append((save(im, f"out_p{i}"), word_time("outro", p["at"]) + 0.35, None, 80))
sub = blank(); dr = ImageDraw.Draw(sub); y0 = 845
dr.rounded_rectangle((RX, y0, RX + 360, y0 + 96), 48, fill="#E62117"); dr.text((RX + 180, y0 + 48), "SUBSCRIBE", font=F("pop", 800, 40), fill="white", anchor="mm")
dr.text((RX + 400, y0 + 48), "@tanganitalenta", font=F("pop", 700, 40), fill=CREAM, anchor="lm")
lay.append((save(sub, "out_sub"), word_time("outro", T["outro"]["subscribeAt"]) + 0.35, None, 0))
src = montage("outro", picks_for(3, d, 3), d)
segs.append(render("90_outro", d, base, src, 0, lay, audio=vo, audio_delay=0.35)); chapters.append(("Ringkasan", None))

# ---------- layar akhir (untuk elemen end screen YouTube) ----------
d = 12.0; base = bg("plain", "plain"); im = blank(); dr = ImageDraw.Draw(im)
lg = LOGO.copy(); lg.thumbnail((84, 84)); tw = dr.textlength("Tangani Talenta", font=F("pop", 800, 52)); x0 = (W - (84 + 20 + tw)) / 2
im.alpha_composite(lg, (int(x0), 70)); dr.text((x0 + 104, 112), "Tangani Talenta", font=F("pop", 800, 52), fill="white", anchor="lm")
dr.text((W / 2, 200), "Tonton berikutnya", font=F("jak", 800, 36), fill=ORANGE_L, anchor="mm")
dr.rounded_rectangle((300, 300, 300 + 820, 300 + 461), 28, outline=(255, 255, 255, 70), width=4)
dr.ellipse((1330, 360, 1330 + 340, 360 + 340), outline=(255, 255, 255, 70), width=4)
dr.text((W / 2, 900), "Satu video kerja lebih pintar, setiap minggu.", font=F("pop", 700, 40), fill=CREAM, anchor="mm")
segs.append(render("99_end", d, base, None, 0, [(save(im, "end"), 0.1, None, 0)]))

# ---------- gabung ----------
lst = S / "list.txt"; lst.write_text("".join(f"file '{p.resolve()}'\n" for p, _ in segs))
raw = W_ / "concat.mp4"; ff("-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", raw)
out = D / f"{T['slug']}-16x9.mp4"
ff("-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", out)
# chapter YouTube: bab dimulai di kartu penghubungnya
t = 0.0; ci = 0; lines = []
for (p, dd) in segs:
    nm = p.stem
    if nm == "00_intro": lines.append(f"0:00 Pembuka")
    elif len(nm) > 3 and nm[2] == "a" and nm[3] == "_": lines.append(f"{int(t // 60)}:{int(t % 60):02d} {chapters[1 + ci][0]}"); ci += 1
    elif nm == "90_outro": lines.append(f"{int(t // 60)}:{int(t % 60):02d} Ringkasan")
    t += dd
(D / "chapters.txt").write_text("\n".join(lines) + "\n")
print("SELESAI", out, f"{dur(out):.1f} dtk"); print("\n".join(lines))
