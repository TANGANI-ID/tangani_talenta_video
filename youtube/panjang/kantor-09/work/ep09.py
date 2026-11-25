#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-09 (Utang Bayu Eps 1: "Gaji Sama Besar, Kenapa Rina Bisa Menabung dan Bayu Tidak?").
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}.
Mesin tambahan: engine/panjang/kit16i.js (parkiran, motor, phoneLying, payslips, envelopes, catatan, lockAlert, shopApp)."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-09/episode.json"
NASKAH = "youtube/serial/ep09-naskah.md"

def C(cue, d=None, **kw):
    o = {"cue": cue}
    if d is not None: o["d"] = d
    o.update(kw); return o

def cap(x, y, text, bg="#13223D", col=None, **kw):
    o = {"type": "chip", "text": text, "x": x, "y": y, "bg": bg}
    if col: o["col"] = col
    o.update(kw); return o
def card(cue, text, d=0.1, **kw):
    o = {"type": "card", "cue": cue, "d": d, "style": "small", "text": text, "x": 1380, "y": 210, "size": 50}; o.update(kw); return o
NOLOC = {"actors": [], "useLoc": False}
def insert(cue, d, fx, trans="zoom", **kw):
    o = dict(cue=cue, d=d, trans=trans, **NOLOC); o["fx"] = fx if isinstance(fx, list) else [fx]; o.update(kw); return o

GREEN, RED, NAVY, ORANGE, YEL = "#3BA36B", "#D9483B", "#13223D", "#C2691F", "#F6C343"
PAN = {"time": "siang", "clock": "12:41"}
def ptab(mon="JULI", day="5", sub="GAJIAN +10", phone=None, bekal=True):
    p = [{"type": "warungTable", "x": 960, "y": 1060, "layer": "front", "w": 1000, "cups": [[-380, "teh"]]},
         {"type": "deskCal", "x": 1330, "y": 880, "layer": "front", "mon": mon, "day": day, "sub": sub, "ring": True}]
    if bekal: p.append({"type": "bekal", "x": 760, "y": 880, "layer": "front"})
    if phone is not None: p.append(dict({"type": "phoneLying", "x": 1130, "y": 884, "layer": "front"}, **phone))
    return p
KCHAIR = {"type": "chair16", "x": 700, "y": 1000, "col": "#C2691F"}
def motor(x=1250, **kw):
    o = {"type": "motor", "x": x, "y": 1010, "s": 0.95, "seat": 118}; o.update(kw); return o

extras = {
    "dimas": {"nama": "Dimas (adik Rina, mahasiswa)", "look": {"hair": "short", "hairColor": "#2B1A12", "shirt": "#FFFDF8", "jacket": "#1F4E8C", "pants": "#2C2433", "skin": "c"}},
}
def R(x, **kw):   # Rina
    o = {"who": "rina", "x": x, "face": 1}; o.update(kw); return o
def B(x, **kw):   # Bayu
    o = {"who": "bayu", "x": x, "face": -1}; o.update(kw); return o

A = []

# 1 ------------------------------------------------------------------ PEMBUKA DINGIN: pantry, Sabtu 5 Juli
A.append({"n": 1, "name": "Pantry, Sabtu 5 Juli", "loc": "pantry", "music": "tense", "pre": 0.5, "post": 0.5, "trans": "cut",
  "locOpt": PAN,
  "props": ptab(phone={"keys": [{"at": 0, "buzz": 0}, C("Ponsel di meja bergetar", 0.0, buzz=1, dur=0.05), C("Ia membaliknya", 0.0, buzz=0, dur=0.05)]}),
  "lines": [{"who": "bayu", "from": "Rin, boleh pinjam", "to": "Buat makan", "text": "Rin, boleh pinjam uang dulu? Buat makan.", "label": "Bayu", "maxW": 520, "size": 42, "min": 3.0}],
  "sfx": [C("Ponsel di meja bergetar", 0.0, type="buzz", vol=0.8, dur=1.0)],
  "shots": [
    {"at": 0, "actors": [B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": "down"}])],
     "cam": [{"x": 1100, "y": 700, "zoom": 1.55}, {"at": 0, "x": 1160, "y": 720, "zoom": 1.7, "dur": 7}],
     "fx": [cap(560, 170, "SABTU, 5 JULI", bg=NAVY, col=YEL, at=0.4), cap(560, 300, "NASI PUTIH + DUA KERUPUK", bg="#8E4A24", size=34, cue="nasi putih", d=0.0)]},
    {"cue": "Ponsel di meja bergetar", "d": -0.4, "trans": "cut",
     "actors": [B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": "down"}, C("Ia membaliknya", -0.2, expr="scared", emote="sweat")])],
     "cam": [{"x": 1060, "y": 840, "zoom": 1.9}, {"at": 0, "x": 1100, "y": 860, "zoom": 2.1, "dur": 4}]},
    {"cue": "Rina masuk membawa", "d": -0.3, "trans": "cut",
     "actors": [B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": "down"}, {"at": 1.2, "expr": "happy", "look": [1, 0]}]),
                R(2100, face=-1, item="cup", keys=[{"at": 0, "x": 2100}, {"at": 0.1, "x": 1500, "dur": 2.0, "expr": "happy"}])],
     "cam": [{"x": 1200, "y": 560, "zoom": 1.12}, {"at": 0, "x": 1250, "y": 580, "zoom": 1.2, "dur": 4}]},
    {"cue": "Bayu tersenyum lebar", "d": -0.2, "trans": "cut",
     "actors": [B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "laugh", "look": "cam"}])],
     "cam": [{"on": "bayu", "fit": 0.24, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 800, "dur": 5}],
     "fx": [cap(1450, 200, "SENYUM TERLALU LEBAR", bg=RED, size=34, at=0.8)]},
    {"cue": "Rina menatap bekal", "d": -0.2, "trans": "cut",
     "actors": [B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "laugh", "look": [1, 0]}]),
                R(1500, face=-1, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "confused", "look": "down"}, C("Ada yang tidak beres", expr="scared", emote="?")])],
     "cam": [{"x": 1200, "y": 600, "zoom": 1.25}, {"at": 0, "x": 1260, "y": 620, "zoom": 1.38, "dur": 5}],
     "fx": [cap(560, 170, "GAJIAN BARU 10 HARI LEWAT", bg=NAVY, col=YEL, cue="Gajian baru sepuluh hari lewat", d=0.0)]},
  ]})

# 2 ------------------------------------------------------------------ JUDUL
A.append({"n": 2, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "UTANG BAYU · EPS 1/4",
     "hook": "Gaji Sama Besar, Kenapa Rina Bisa Menabung dan Bayu Tidak?", "day": "5", "month": "JULI", "marker": "GAJIAN +10 HARI", "markerAt": 2.9}]}]})

# 3 ------------------------------------------------------------------ Hari gajian, 25 Juni
A.append({"n": 3, "name": "Hari gajian, 25 Juni", "loc": "pantry", "music": "light", "trans": "iris",
  "locOpt": PAN,
  "props": ptab(mon="JUNI", day="25", sub="GAJIAN", bekal=False),
  "shots": [
    {"at": 0, "actors": [R(700, keys=[{"at": 0, "pose": "idle", "expr": "happy"}]), B(1250, keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [-1, 0]}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1040, "y": 580, "zoom": 1.2, "dur": 5}],
     "fx": [cap(560, 170, "RABU, 25 JUNI · GAJIAN", bg=NAVY, col=YEL, at=0.4)]},
    insert("Di meja pantry tergelar", -0.2, {"type": "payslips", "rowsAt": 2.0, "per": 0.7, "eqAt": C("berdekatan", -0.2), "chip": "ANGKA HAMPIR SAMA. CARA MEMEGANG, BEDA.", "chipAt": C("Cara memegangnya, tidak", 0.0)}, trans="zoom"),
    {"cue": "Rina sudah mengeluarkan", "d": -0.2, "trans": "cut",
     "actors": [R(900, item="envelopes", keys=[{"at": 0, "pose": "hold", "expr": "proud", "look": "cam"}]), B(1400, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}])],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 900}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 900, "dur": 3}],
     "fx": [cap(1450, 200, "LIMA AMPLOP", bg=ORANGE, at=0.4)]},
    {"cue": "Bayu memotret slipnya", "d": -0.3, "trans": "cut",
     "actors": [B(1100, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "happy", "look": [1, 0.3]}])],
     "cam": [{"on": "bayu", "fit": 0.26, "sx": 900}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 900, "dur": 3}]},
    insert("lalu membuka toko daring", -0.4, {"type": "shopApp", "look": True, "lookAt": 1.4, "tapAt": C("sebelum kertas itu", 0.2), "chip": "CICILAN 0% · BAYAR NANTI", "chipAt": 1.8}, trans="whip"),
  ]})

# 4 ------------------------------------------------------------------ Kamar kos, tabungan Dimas
A.append({"n": 4, "name": "Kamar kos, tabungan Dimas", "loc": "kos", "music": "warm", "trans": "fade",
  "props": [KCHAIR],
  "lines": [{"who": "dimas", "from": "Biayanya kelihatan", "to": "Kak,", "text": "Biayanya kelihatan, Kak.", "label": "Dimas", "bubble": "none"},
            {"who": "rina", "from": "Yang ini tidak boleh", "to": "lagi ingin", "text": "Yang ini tidak boleh disentuh, Dim.", "maxW": 520, "size": 42, "min": 3.0}],
  "shots": [
    {"at": 0, "actors": [R(720, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.3]}])],
     "cam": [{"x": 950, "y": 520, "zoom": 1.08}, {"at": 0, "x": 980, "y": 520, "zoom": 1.18, "dur": 6}],
     "sfx": [{"at": 0.4, "type": "ring", "vol": 0.6, "dur": 1.0}],
     "fx": [{"type": "videoCall", "talkFrom": C("Biayanya kelihatan", -0.1), "talkTo": C("Kak,", 0.0, cueEnd=True), "expr": "happy"}, cap(1500, 160, "MALAMNYA · KAMAR KOS", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Rina tidak menjawab", "d": -0.2, "trans": "cut",
     "actors": [R(720, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}])],
     "cam": [{"on": "rina", "fit": 0.24, "sx": 760}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 760, "dur": 6}],
     "fx": [cap(1450, 200, "KALAU MENUNGGU SISA, BIASANYA TIDAK ADA", bg=RED, size=30, cue="Yang ia tahu", d=0.2)]},
    insert("Begitu gaji masuk", -0.2, {"type": "envelopes", "firstAt": C("ia mengisi amplop", 0.0), "restAt": C("Baru sisanya", 0.0)}, trans="zoom"),
    {"cue": "Ia mengetuk meja dua kali", "d": -0.3, "trans": "cut",
     "actors": [R(720, keys=[{"at": 0, "pose": "sit", "expr": "proud", "look": [1, 0.5]}, {"at": 1.0, "pose": "point"}, {"at": 2.2, "pose": "sit"}])],
     "sfx": [{"at": 0.5, "type": "click", "vol": 0.9}, {"at": 0.9, "type": "click", "vol": 0.9}],
     "cam": [{"x": 900, "y": 560, "zoom": 1.2}, {"at": 0, "x": 860, "y": 580, "zoom": 1.34, "dur": 5}],
     "fx": [{"type": "videoCall"}, cap(1450, 200, "KULIAH DIMAS · TIDAK BOLEH DISENTUH", bg=GREEN, size=32, at=1.4)]},
  ]})

# 5 ------------------------------------------------------------------ Helm dan jam baru
A.append({"n": 5, "name": "Helm dan jam baru", "loc": "parkiran", "music": "light", "trans": "whip",
  "locOpt": {"time": "sore"},
  "props": [motor(1250)],
  "lines": [{"who": "bayu", "from": "Cicilan, Rin", "to": "cuma sekali", "text": "Cicilan, Rin. Murah. Hidup cuma sekali.", "label": "Bayu", "maxW": 520, "size": 42},
            {"who": "rina", "from": "Ponselmu yang dulu", "to": "Tiga ratus ribu sebulan", "text": "Ponselmu yang dulu juga cicilan.", "maxW": 520, "size": 42},
            {"who": "bayu", "from": "Santai. Nanti juga lunas", "to": "juga lunas", "text": "Santai. Nanti juga lunas.", "label": "Bayu", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "actors": [B(900, keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [1, 0]}]), R(-300, keys=[{"at": 0.6, "x": 380, "dur": 2.4, "expr": "neutral"}])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.05}, {"at": 0, "x": 840, "y": 560, "zoom": 1.12, "dur": 5}],
     "fx": [cap(560, 170, "PARKIRAN BELAKANG · SORE", bg=NAVY, col=YEL, at=0.4), cap(1500, 260, "MOTOR LAMA. BUKAN YANG BARU.", bg="#8E4A24", size=32, cue="motornya masih motor yang lama", d=0.0)]},
    {"cue": "Ia menepuk helm", "d": -0.4, "trans": "cut",
     "actors": [B(900, item="helmet", keys=[{"at": 0, "pose": "hold", "expr": "laugh", "look": "cam"}, C("Cicilan, Rin", pose="pointUp", expr="laugh", jump=18)])],
     "cam": [{"on": "bayu", "fit": 0.26, "sx": 900}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 900, "dur": 5}],
     "fx": [cap(1450, 200, "HELM BARU · MASIH BERSTIKER", bg=ORANGE, size=32, at=0.5)]},
    {"cue": "Rina tersenyum", "d": -0.2, "trans": "cut",
     "actors": [R(700, keys=[{"at": 0, "pose": "idle", "expr": "smile", "look": [1, 0]}, C("Ponselmu yang dulu", pose="talk", expr="happy")]),
                B(1150, item="helmet", face=-1, keys=[{"at": 0, "pose": "hold", "expr": "laugh"}, C("Tiga ratus ribu", expr="neutral"), C("Santai. Nanti", pose="shrug", expr="laugh")])],
     "cam": [{"x": 940, "y": 560, "zoom": 1.2}, {"at": 0, "x": 920, "y": 560, "zoom": 1.3, "dur": 8}],
     "fx": [cap(560, 170, "PONSEL LAMA: CICILAN JUGA", bg=RED, size=32, cue="Tiga ratus ribu", d=0.0)]},
    {"cue": "Ia memutar ponselnya", "d": -0.2, "trans": "cut",
     "actors": [B(1100, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": "down"}, C("miringkan", -0.3, expr="scared", look=[1, 0.4]), C("Ia tidak membukanya", expr="sad", emote="sweat")]),
                R(520, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0]}, {"at": 1.6, "x": 800, "dur": 1.6}])],
     "sfx": [C("Ada getaran singkat", 0.0, type="buzz", vol=0.7, dur=0.5)],
     "cam": [{"x": 960, "y": 600, "zoom": 1.2}, {"at": 0, "x": 980, "y": 620, "zoom": 1.34, "dur": 7}],
     "fx": [cap(1450, 200, "LAYARNYA DIMIRINGKAN", bg=NAVY, col=YEL, cue="layar itu ia miringkan", d=0.0)]},
  ]})

# 6 ------------------------------------------------------------------ Catatan tiga puluh hari
A.append({"n": 6, "name": "Catatan tiga puluh hari", "loc": "kerja", "music": "light", "trans": "iris",
  "locOpt": {"time": "siang", "clock": "16:05"},
  "lines": [{"who": "rina", "from": "Ternyata bocornya", "to": "tidak aku lihat", "text": "Ternyata bocornya di tempat yang tidak aku lihat.", "maxW": 560, "size": 40},
            {"who": "bayu", "from": "Ribet, Rin", "to": "gajian lagi", "text": "Ribet. Nanti juga keburu gajian lagi.", "label": "Bayu", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "actors": [R(800, item="notebook", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}])],
     "cam": [{"x": 900, "y": 540, "zoom": 1.15}, {"at": 0, "x": 860, "y": 560, "zoom": 1.28, "dur": 5}],
     "fx": [cap(1450, 170, "26 MEI – 24 JUNI", bg=NAVY, col=YEL, at=0.4)]},
    insert("Dari dua puluh enam Mei", -0.3, {"type": "catatan", "titleAt": 0.4, "rowsAt": C("Kopi yang ia kira", -0.2), "per": 0.5, "boxesAt": C("Di halaman terakhir", 0.0), "ringAt": C("Kotak lain-lain paling penuh", 0.0), "chip": "LAIN-LAIN PALING PENUH", "chipAt": C("Kotak lain-lain paling penuh", 0.6), "chipBg": RED}, trans="zoom"),
    {"cue": "Aku kira uangku", "d": -0.2, "trans": "cut",
     "actors": [R(800, item="notebook", keys=[{"at": 0, "pose": "hold", "expr": "think", "look": [1, 0.2]}, C("Ternyata bocornya", expr="sad", look="down")])],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 900}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 900, "dur": 6}]},
    {"cue": "Bayu melirik dua detik", "d": -0.2, "trans": "cut",
     "actors": [R(700, item="notebook", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}]), B(1300, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0.3]}, C("Ribet, Rin", pose="shrug", expr="laugh")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 1020, "y": 560, "zoom": 1.26, "dur": 6}]},
    {"cue": "Lalu ia mengembalikan", "d": -0.2, "trans": "cut",
     "actors": [R(700, item="notebook", keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": [1, 0.2]}]), B(1200, keys=[{"at": 0, "pose": "idle", "expr": "laugh", "look": "cam"}, {"at": 1.2, "x": 1500, "dur": 1.8}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1000, "y": 560, "zoom": 1.2, "dur": 5}],
     "fx": [cap(560, 170, "SEPERTI ORANG YANG SUDAH SELESAI MEMBACA", bg=NAVY, col=YEL, size=30, at=0.4)]},
  ]})

# 7 ------------------------------------------------------------------ Sabtu, uangnya diberikan
A.append({"n": 7, "name": "Sabtu, uangnya diberikan", "loc": "pantry", "music": "tense", "trans": "whip",
  "locOpt": PAN,
  "props": ptab(),
  "lines": [{"who": "rina", "from": "Untuk makan, ya", "to": "setengah bertanya", "text": "Untuk makan, ya.", "maxW": 520, "size": 44, "min": 2.2},
            {"who": "bayu", "from": "Iya, Rin", "to": "aku ganti", "text": "Iya, Rin. Besok aku ganti.", "label": "Bayu", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "actors": [B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}]), R(1500, face=-1, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}])],
     "cam": [{"x": 1200, "y": 600, "zoom": 1.2}, {"at": 0, "x": 1240, "y": 620, "zoom": 1.3, "dur": 5}],
     "fx": [cap(560, 170, "SABTU, 5 JULI", bg=NAVY, col=YEL, at=0.4)]},
    insert("Ia ingat amplop kuliah", -0.4, {"type": "envelopes", "ignoreAt": C("dan ia tidak menyentuhnya", -1.2), "pickAt": C("Yang ia buka amplop lain-lain", 0.0)}, trans="zoom"),
    {"cue": "Untuk makan, ya", "d": -0.3, "trans": "cut",
     "actors": [R(1500, face=-1, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": "down"}, C("setengah bertanya", expr="confused", look=[-1, 0])]),
                B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}, C("Bayu mengangguk cepat", 0.0, expr="happy", jump=14), C("Besok aku ganti", expr="laugh")])],
     "cam": [{"x": 1200, "y": 620, "zoom": 1.25}, {"at": 0, "x": 1220, "y": 640, "zoom": 1.36, "dur": 6}]},
    insert("Transfernya terkirim", -0.2, {"type": "lockAlert", "mode": "sent", "amount": "Rp300.000", "memo": "Catatan: untuk makan", "bannerAt": 0.6}, trans="zoom"),
    {"cue": "Bayu mengembuskan napas", "d": -0.2, "trans": "cut",
     "actors": [B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "tired", "emote": "sweat"}, C("Beres", pose="thumbs", expr="laugh", item="thumb")]),
                R(1500, face=-1, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}])],
     "cam": [{"x": 1100, "y": 600, "zoom": 1.2}, {"at": 0, "x": 1060, "y": 620, "zoom": 1.32, "dur": 4}]},
    {"cue": "Ia berdiri ke dispenser", "d": -0.2, "trans": "cut",
     "actors": [B(960, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "happy"}, {"at": 0.2, "x": 80, "dur": 2.4, "pose": "idle"}]),
                R(1500, face=-1, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.05}, {"at": 0.2, "x": 400, "y": 560, "zoom": 1.15, "dur": 2.6}]},
    {"cue": "Ponselnya tertinggal", "d": -0.4, "trans": "cut",
     "props": ptab(phone={}),
     "actors": [R(1500, face=-1, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}, C("Rina belum sempat", expr="confused")]), B(-60, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "laugh"}])],
     "cam": [{"x": 1250, "y": 760, "zoom": 1.6}, {"at": 0, "x": 1220, "y": 800, "zoom": 1.9, "dur": 5}],
     "fx": [cap(560, 170, "PONSEL BAYU: LAYAR MENGHADAP ATAS", bg=RED, size=30, cue="Layarnya menghadap atas", d=0.0)]},
  ]})

# 8 ------------------------------------------------------------------ Ponsel yang tertinggal (titik tegang -> hitam)
A.append({"n": 8, "name": "Ponsel yang tertinggal", "loc": "pantry", "music": "tense", "musicCut": 2.0, "trans": "cut", "post": 0.4, "hold": 1.6,
  "locOpt": PAN,
  "props": ptab(phone={"keys": [{"at": 0, "buzz": 0}, C("Ponsel itu bergetar", 0.0, buzz=1, dur=0.05)]}),
  "sfx": [C("Ponsel itu bergetar", 0.0, type="buzz", vol=0.9, dur=1.2), C("Lalu tidak berhenti", 0.0, type="buzz", vol=0.9, dur=2.4), C("Meja ikut berbunyi", 0.0, type="buzz", vol=0.9, dur=2.0),
          C("Layar di depan Rina", 0.0, type="notif", vol=0.7)],
  "shots": [
    {"at": 0, "actors": [R(1500, face=-1, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}])],
     "cam": [{"x": 1250, "y": 800, "zoom": 2.0}, {"at": 0, "x": 1220, "y": 830, "zoom": 2.4, "dur": 4}]},
    {"cue": "Rina menoleh", "d": -0.2, "trans": "cut",
     "actors": [R(1500, face=-1, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "shock", "look": [-1, 0.5], "emote": "!"}])],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 1000}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 1000, "dur": 3}]},
    {"cue": "Bayu masih di depan dispenser", "d": -0.2, "trans": "cut",
     "actors": [B(80, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "laugh"}, C("tertawa", pose="talk")])],
     "cam": [{"x": 300, "y": 560, "zoom": 1.15}, {"at": 0, "x": 260, "y": 560, "zoom": 1.25, "dur": 3}]},
    {"cue": "Layar di depan Rina", "d": -0.3, "trans": "cut",
     "props": ptab(phone={"buzz": 1}),
     "actors": [R(1500, face=-1, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "scared", "look": "down"}])],
     "cam": [{"x": 1250, "y": 800, "zoom": 2.3}, {"at": 0, "x": 1210, "y": 830, "zoom": 2.6, "dur": 5}]},
    {"cue": "Tangan Rina dingin", "d": -0.2, "trans": "cut",
     "props": ptab(phone={"buzz": 1}),
     "actors": [R(1380, face=-1, keys=[{"at": 0, "pose": "point", "expr": "scared", "look": "down", "emote": "sweat"}])],
     "cam": [{"x": 1250, "y": 700, "zoom": 1.5}, {"at": 0, "x": 1230, "y": 740, "zoom": 1.8, "dur": 5}]},
    {"atE": 1.6, "trans": "cut", "actors": [], "useLoc": False, "loc": "hitam", "noHeader": True},
  ]})

# 9 ------------------------------------------------------------------ Tujuh tagihan, dan uangnya pergi
A.append({"n": 9, "name": "Tujuh tagihan", "loc": "pantry", "music": "sad", "trans": "fade", "pre": 0.8,
  "locOpt": {"time": "siang", "clock": "12:43"},
  "props": ptab(phone={"buzz": 1}),
  "shots": [
    {"at": 0, "actors": [R(1380, face=-1, keys=[{"at": 0, "pose": "point", "expr": "scared", "look": "down"}])],
     "cam": [{"x": 1250, "y": 740, "zoom": 1.6}, {"at": 0, "x": 1230, "y": 780, "zoom": 1.8, "dur": 3}]},
    insert("Pinjaman A.", -0.2, {"type": "lockAlert", "mode": "paid", "rowsAt": 0.2, "per": 1.33, "bannerAt": 99, "clock": "12.43"}, trans="cut"),
    {"cue": "Rina tidak hafal", "d": -0.1, "trans": "cut",
     "actors": [R(1380, face=-1, keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}, C("Yang ia kenali", expr="shock", emote="!")])],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 1000}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 1000, "dur": 5}]},
    insert("Lalu satu spanduk", -0.2, [{"type": "lockAlert", "mode": "paid", "rowsAt": -30, "bannerAt": 0.5, "amount": "Rp300.000", "chip": "NOMINAL = TRANSFER RINA", "chipAt": C("Nominalnya persis", 0.0), "chipBg": RED}], trans="cut"),
    {"cue": "Uang dari amplop", "d": -0.2, "trans": "cut",
     "props": ptab(phone={"buzz": 1}),
     "actors": [R(1380, face=-1, keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}, C("Rina membalikkan", pose="point", look="down")])],
     "cam": [{"x": 1250, "y": 700, "zoom": 1.4}, {"at": 0, "x": 1230, "y": 730, "zoom": 1.6, "dur": 5}],
     "fx": [{"type": "card", "cue": "Uang dari amplop", "d": 0.4, "style": "small", "text": "Uang makan itu tidak jadi makan.", "x": 620, "y": 200, "size": 46, "maxW": 760, "bg": RED}]},
    {"cue": "Rina membalikkan ponsel", "d": -0.2, "trans": "cut",
     "props": ptab(phone={"keys": [{"at": 0, "buzz": 1}, {"at": 1.2, "buzz": 0, "dur": 0.05}]}),
     "actors": [R(1380, face=-1, keys=[{"at": 0, "pose": "point", "expr": "sad", "look": "down"}, {"at": 1.4, "pose": "hold"}, C("Tapi senyum lebar", expr="sad", look=[-1, 0.2])])],
     "cam": [{"x": 1250, "y": 740, "zoom": 1.5}, {"at": 0, "x": 1230, "y": 770, "zoom": 1.7, "dur": 4}, C("Tapi senyum lebar", on="rina", fit=0.26, sx=1000, dur=2.0)]},
  ]})

# 10 ----------------------------------------------------------------- Amplop yang tidak ikut jebol
A.append({"n": 10, "name": "Amplop yang tidak ikut jebol", "loc": "kos", "music": "warm", "trans": "fade",
  "props": [KCHAIR],
  "lines": [{"who": "rina", "from": "Tabungan yang disisihkan", "to": "ikut jebol", "text": "Tabungannya tidak ikut.", "maxW": 520, "size": 44, "min": 2.4}],
  "shots": [
    {"at": 0, "actors": [R(720, item="envelopes", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.5]}])],
     "cam": [{"x": 900, "y": 540, "zoom": 1.15}, {"at": 0, "x": 860, "y": 560, "zoom": 1.28, "dur": 4}],
     "fx": [cap(1500, 160, "MALAMNYA · KAMAR KOS", bg=NAVY, col=YEL, at=0.4)]},
    insert("Amplop kuliah Dimas masih utuh", -0.5, {"type": "envelopes", "utuhAt": C("masih utuh", 0.0), "utuhText": "KULIAH DIMAS MASIH UTUH", "dropAt": C("Yang berkurang hanya", 0.0), "noteAt": C("Ia menulis satu baris", 0.0)}, trans="zoom"),
    {"cue": "Jarinya sempat mengetik", "d": -0.3, "trans": "cut",
     "actors": [R(720, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "angry", "look": "down"}, C("Lalu ia hapus semua", expr="sad", look="down")])],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 760}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 760, "dur": 6}],
     "fx": [card("kenapa kamu tidak bilang", "Kenapa kamu tidak bilang?", d=0.0, x=1400, y=220, size=42, bg="#FFF6EA", out=C("Lalu ia hapus semua", 0.0))]},
    {"cue": "Memarahi seseorang", "d": -0.2, "trans": "cut",
     "actors": [R(720, keys=[{"at": 0, "pose": "sit", "expr": "tired", "look": "down"}, C("Yang bisa ia pegang", expr="neutral", look=[1, 0.5]), C("Tabungan yang disisihkan", pose="point", expr="proud"), C("Cara Bayu, belum", pose="sit", expr="sad", look="down")])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.2}, {"at": 0, "x": 860, "y": 580, "zoom": 1.34, "dur": 8}],
     "fx": [cap(1450, 200, "TABUNGAN DI AWAL: TIDAK IKUT JEBOL", bg=GREEN, size=32, cue="Tabungan yang disisihkan", d=0.0, out=C("Cara Bayu, belum", -0.2)), cap(1450, 200, "CARA BAYU: BELUM", bg=RED, size=34, cue="Cara Bayu, belum", d=0.0)]},
  ]})

# 11 ----------------------------------------------------------------- Yang tidak ia beli
A.append({"n": 11, "name": "Yang tidak ia beli", "loc": "pantry", "music": "warm", "trans": "fade",
  "locOpt": {"time": "siang", "clock": "12:30"},
  "props": [{"type": "warungTable", "x": 960, "y": 1060, "layer": "front", "w": 1000, "cups": [[-380, "teh"]]}],
  "shots": [
    {"at": 0, "actors": [R(900, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}])],
     "cam": [{"x": 940, "y": 560, "zoom": 1.15}, {"at": 0, "x": 920, "y": 560, "zoom": 1.26, "dur": 5}],
     "fx": [cap(1450, 200, "KOPI DARI RUMAH", bg="#8E4A24", size=34, at=0.6)]},
    insert("Bedanya, sebelum membeli", -0.3, {"type": "shopApp", "look": True, "lookAt": 0.8, "closeAt": C("ia lewati", 0.4), "chip": "TIDAK ADA ANGGARANNYA", "chipAt": C("Yang tidak ada anggarannya", 0.0), "chipBg": GREEN}, trans="whip"),
    {"cue": "Bukan karena ia lebih pintar", "d": -0.2, "trans": "cut",
     "actors": [R(900, item="notebook", keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": "cam"}])],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 900}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 900, "dur": 5}],
     "fx": [card("Karena bocornya sudah tertulis", "Catat dulu. Baru kelihatan bocornya.", d=0.0, x=1400, y=220, size=46, maxW=700, bg="#FFF6EA")]},
    {"cue": "Bayu belum punya halaman", "d": -0.2, "trans": "flash", "loc": "parkiran", "locOpt": {"time": "sore"},
     "props": [motor(1000, helmet="seat")], "actors": [],
     "cam": [{"x": 1000, "y": 640, "zoom": 1.3}, {"at": 0, "x": 1000, "y": 660, "zoom": 1.45, "dur": 6}],
     "fx": [cap(560, 170, "HELM BARU · BELUM DIPAKAI", bg=ORANGE, at=0.4)]},
  ]})

# 12 ----------------------------------------------------------------- Kartu pelajaran
A.append({"n": 12, "name": "Kartu pelajaran", "loc": "kerja", "music": "warm", "trans": "iris", "post": 3.0,
  "locOpt": {"time": "siang", "clock": "16:05"},
  "shots": [{"at": 0, "blur": 9, "actors": [R(300, size=600, keys=[{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: begitu gajian", pose="pointUp"), C("Dua: catat", pose="hips", expr="proud"),
                 C("Tiga: jangan", pose="pointUp", expr="laugh", item="thumb", jump=50), C("Tiga: jangan", 2.8, pose="wave", item=None), C("Rina belum menyelesaikan", pose="hips", expr="proud")])],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 14}],
     "fx": [{"type": "lesson", "cue": "Jadi, apa", "d": 0.8, "items": [{"cue": "Satu: begitu gajian", "text": "Begitu gajian, sisihkan tabungan dulu"},
            {"cue": "Dua: catat", "text": "Catat pengeluaran, supaya bocornya kelihatan"}, {"cue": "Tiga: jangan", "text": "Jangan tutup cicilan dengan cicilan baru"}]}]}]})

# 13 ----------------------------------------------------------------- Cuplikan Eps 2 + layar akhir
A.append({"n": 13, "name": "Cuplikan Eps 2 + layar akhir", "loc": "parkiran", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": {"time": "malam"},
  "props": [motor(1000)],
  "shots": [
    {"at": 0, "actors": [B(900, face=1, item="helmet", y=930, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}])],
     "cam": [{"x": 960, "y": 640, "zoom": 1.2}, {"at": 0, "x": 940, "y": 650, "zoom": 1.34, "dur": 6}],
     "fx": [cap(560, 170, "MALAM · PARKIRAN BELAKANG", bg=NAVY, col=YEL, at=0.4)]},
    insert("Ponselnya menyala", -0.2, {"type": "lockAlert", "mode": "due", "bannerAt": 0.5, "clock": "20.12", "date": "Sabtu, 5 Juli", "chip": "CICILAN F · JATUH TEMPO", "chipAt": 1.8}, trans="zoom"),
    {"cue": "Siang tadi ia bilang beres", "d": -0.2, "trans": "cut",
     "actors": [B(900, face=1, item="helmet", y=930, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}, C("Layar ini tidak ikut", expr="scared", look="cam", emote="sweat")])],
     "cam": [{"on": "bayu", "fit": 0.26, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 800, "dur": 6}]},
    {"cue": "Ia menatapnya lama", "d": -0.2, "trans": "cut",
     "actors": [B(900, face=1, item="phone", y=930, keys=[{"at": 0, "pose": "phone", "expr": "sad", "look": "down"}, C("memasukkan ponsel", pose="sit", item=None, expr="tired"), C("Tidak hilang", expr="scared", emote="sweat")])],
     "cam": [{"x": 940, "y": 660, "zoom": 1.3}, {"at": 0, "x": 920, "y": 670, "zoom": 1.45, "dur": 8}]},
    {"cue": "Saksikan kelanjutannya", "d": -0.2, "trans": "flash", "blur": 8,
     "actors": [B(900, face=1, y=930, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}])],
     "cam": [{"x": 960, "y": 600, "zoom": 1.1}, {"at": 0, "x": 960, "y": 610, "zoom": 1.16, "dur": 4}],
     "fx": [{"type": "card", "at": 0.1, "text": "UTANG BAYU · EPS 2", "tag": "JUMAT NANTI, ADA SUARA YANG SANGAT DIKENAL", "size": 90, "bg": "#6E2430"}]},
    {"cue": "Kalau cerita ini", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di komentar"), "nextQuote": "\"Transfer 25 juta.\"", "nextSub": "suara siapa itu?", "nextTitle": "Utang Bayu · Eps 2",
             "nextWho": "bayu", "nextKey": {"pose": "sit", "expr": "scared"}, "nextThumb": False, "playlist": "Utang Bayu", "playlistEps": "Eps 1 · 2 · 3 · 4",
             "ask": "Begitu gajian, yang kamu sisihkan lebih dulu apa? Tulis di komentar!"}]},
  ]})


def shot_local(A):
    """Mesin membaca `at` (aktor, kamera, fx, props) sebagai detik sejak awal ADEGAN. Di shot ke-2 dst. data di sini ditulis
    relatif terhadap awal SHOT, jadi diubah ke {cue shot, d} (atau shot.at + at bila shot tidak memakai cue)."""
    def fix(k, sh, need):
        if "at" not in k or "cue" in k or not need(k):
            return
        a = k.pop("at")
        if "cue" in sh:
            k["cue"] = sh["cue"]; k["d"] = round(sh.get("d", 0) + a, 3)
            if "n" in sh: k["n"] = sh["n"]
        else:
            k["at"] = round(sh.get("at", 0) + a, 3)
    moving = lambda k: k["at"] > 0 or "dur" in k
    for a in A:
        for sh in a.get("shots", [])[1:]:
            for ac in sh.get("actors", []):
                for k in ac.get("keys", []): fix(k, sh, moving)
            for p in sh.get("props", []):
                for k in p.get("keys", []): fix(k, sh, moving)
            for k in sh.get("cam", []): fix(k, sh, moving)
            for f in sh.get("fx", []): fix(f, sh, lambda k: k["at"] > 0)
            for k in sh.get("sfx", []): fix(k, sh, lambda k: k["at"] > 0)


def check_cues(A):
    """Setiap cue harus ada di narasi adegannya (huruf kecil, tanda baca persis)."""
    nar = narration(ROOT / NASKAH); bad = []
    def walk(o, n):
        if isinstance(o, dict):
            for k in ("cue", "from", "to"):
                v = o.get(k)
                if isinstance(v, str) and v.lower() not in nar.get(n, "").lower(): bad.append((n, k, v))
            for v in o.values(): walk(v, n)
        elif isinstance(o, list):
            for v in o: walk(v, n)
    for a in A: walk(a, a["n"])
    for b in bad: print("CUE TIDAK DITEMUKAN:", b)
    return not bad


A = json.loads(json.dumps(A))
shot_local(A)
for a in A:   # story16 hanya membaca sfx di tingkat adegan → pindahkan sfx dari shot
    for sh in a.get("shots", []):
        if sh.get("sfx"): a.setdefault("sfx", []).extend(sh.pop("sfx"))
ep = {"slug": "kantor-09", "title": "Gaji Sama Besar, Kenapa Rina Bisa Menabung dan Bayu Tidak? | Kantor Tangani: Utang Bayu Eps 1",
      "series": "Kantor Tangani", "story": "Utang Bayu", "eps": "1/4", "month": "JUNI–JULI", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Pantry"], [3, "Hari gajian"], [6, "Catatan 30 hari"], [8, "Ponsel tertinggal"], [10, "Amplop Dimas"], [12, "Pelajaran"], [13, "Episode berikutnya"]],
      "parts": [["Pembuka & masalah", 0, 3], ["Memburuk", 3, 5], ["Berubah", 5, 7], ["Episode berikutnya", 7, 8]],
      "lessons": ["Begitu gajian, sisihkan tabungan dulu; jangan menunggu sisa di akhir bulan.",
                  "Catat pengeluaran supaya bocornya kelihatan.",
                  "Jangan menutup cicilan dengan cicilan baru."],
      "youtube": {
        "desc": "Dua orang, gaji hampir sama. Rina bisa menabung untuk kuliah adiknya, Bayu justru meminjam uang makan. Apa bedanya cara memegang gaji? Episode pertama Kantor Tangani: Utang Bayu. Cerita fiksi, bukan nasihat keuangan.",
        "ask": "Begitu gajian, yang kamu sisihkan lebih dulu apa? Tulis di kolom komentar.",
        "next": "Utang Bayu Eps 2: Suara Atasan Minta Transfer 25 Juta. Ternyata Bukan Dia.",
        "tags": "kantor tangani, utang bayu, cerita kantor, animasi kantor, menabung, gajian, paylater, cicilan, catatan keuangan, dunia kerja, Tangani Talenta",
        "hashtags": "#KantorTangani #UtangBayu #duniakerja",
        "adAfter": 8},
      "thumb": {"kind": "utang1", "lines": ["GAJI SAMA,", "RINA MENABUNG"], "hl": "BAYU TIDAK?", "lineSize": 78, "hlSize": 92, "badge": "EPS 1/4", "tag": "KANTOR TANGANI · UTANG BAYU"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
