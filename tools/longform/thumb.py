#!/usr/bin/env python3
"""thumbnail 1280x720. usage: thumb.py FRAME.png OUT.jpg "BARIS1|BARIS2|BARIS3(sorot)" "LENCANA" cropx0,y0,x1,y1"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
FD = Path.home() / ".cache/studio-deps"
def F(w, s): return ImageFont.truetype(str(FD / f"fontsource-poppins-5.3.0/package/files/poppins-latin-{w}-normal.woff"), s)
src, out, text, badge, box = sys.argv[1:6]; box = tuple(map(int, box.split(",")))
W, H = 1280, 720
im = Image.new("RGB", (W, H), "#13223D"); d = ImageDraw.Draw(im)
d.polygon([(640, 0), (W, 0), (W, H), (560, H)], fill="#C2691F")
fr = Image.open(src).convert("RGB").crop(box); fr = fr.resize((int(fr.width * H / fr.height), H))
m = Image.new("L", fr.size, 255); md = ImageDraw.Draw(m)
for i in range(60): md.line((fr.width - 60 + i, 0, fr.width - 60 + i - 90, H), fill=int(255 * (1 - i / 60)))
im.paste(fr, (0, 0), m)
lines = text.split("|"); y = 120
for i, ln in enumerate(lines):
    f = F(800, 104 if i == len(lines) - 1 else 86)
    if i == len(lines) - 1:
        w = d.textlength(ln, font=f); d.rounded_rectangle((700, y + 8, 700 + w + 40, y + 140), 18, fill="#13223D")
        d.text((720, y + 4), ln, font=f, fill="#F6C343", stroke_width=0)
    else:
        d.text((720, y), ln, font=f, fill="white", stroke_width=6, stroke_fill="#7A3A0C")
    y += 120 if i < len(lines) - 1 else 150
bf = F(800, 38); bw = d.textlength(badge, font=bf)
d.rounded_rectangle((720, y + 20, 720 + bw + 50, y + 92), 36, fill="white"); d.text((745, y + 56), badge, font=bf, fill="#C2691F", anchor="lm")
lg = Image.open("site/public/logo.png").convert("RGBA"); lg.thumbnail((56, 56)); d.ellipse((W - 96, 18, W - 24, 90), fill="white"); im.paste(lg, (W - 88, 26), lg)
im.save(out, quality=92); print(out)
