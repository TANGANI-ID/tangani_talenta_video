#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-12 (Utang Bayu Eps 4: "Terjerat 7 Aplikasi Paylater Sampai Gaji Habis. Begini Bayu Bebas").
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}.
Mesin tambahan: engine/panjang/kit16l.js (sevenSheet, debtMontage, ojkSearch, reportSent, bonLunas, thumbnail utang4), kit16k.js (walletClose, lunchBox), kit16h.js (bills)."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-12/episode.json"
NASKAH = "youtube/serial/ep12-naskah.md"

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
REC = {"type": "recap", "label": "SEBELUMNYA DI UTANG BAYU"}
CHAIR = {"type": "chair16", "x": 830, "y": 1000}
def desk(**kw):
    o = {"type": "deskR", "x": 1210, "y": 1000}; o.update(kw); return o
SORE = {"time": "sore", "clock": "16:45"}
def B(x=850, **kw):   # Bayu
    o = {"who": "bayu", "x": x, "face": 1}; o.update(kw); return o
def R(x, **kw):   # Rina
    o = {"who": "rina", "x": x, "face": -1}; o.update(kw); return o
def H(x, **kw):   # Pak Hendra
    o = {"who": "hendra", "x": x, "face": -1}; o.update(kw); return o
def Y(x, **kw):   # Yoga (headphone di leher)
    o = {"who": "yoga", "x": x, "face": 1, "neckphones": True}; o.update(kw); return o
def SI(x, **kw):   # Sinta
    o = {"who": "sinta", "x": x, "face": 1}; o.update(kw); return o
def D(x, **kw):   # Dodi
    o = {"who": "dodi", "x": x, "face": 1, "size": 560}; o.update(kw); return o
def back(o, y=930, size=520):
    o.update({"y": y, "layer": "back", "size": size}); return o
WULAN = lambda **kw: dict({"who": "resepsionis", "x": 1000, "y": 930, "layer": "back", "face": -1, "size": 520}, **kw)
LOBI = {"time": "sore", "deskX": 1100, "deskFront": True, "stairs": 1600, "slamX": -230}
TANGGA = {"time": "siang", "deskX": 3200, "deskFront": True, "stairs": 1200, "slam": 0}
DODI_LOOK = {"hat": "cap", "hatColor": "#C2691F", "beard": "goatee", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "a", "pencil": True}
PAN_R = {"time": "malam", "clock": "17:40"}
def ptab(cups=2, phone=None, bekal=False):
    p = [{"type": "warungTable", "x": 960, "y": 1060, "layer": "front", "w": 1000, "cups": [[-380, "teh"], [380, "teh"]][:cups]}]
    if phone is not None: p.append(dict({"type": "phoneLying", "x": 1060, "y": 884, "layer": "front"}, **phone))
    return p
def stair(i, x0=1200):
    return [x0 + i * 70 + 35, 1000 - (i + 1) * 50]

SORE = {"time": "sore", "clock": "16:45"}
def B(x=850, **kw):   # Bayu
    o = {"who": "bayu", "x": x, "face": 1}; o.update(kw); return o
def R(x, **kw):   # Rina
    o = {"who": "rina", "x": x, "face": -1}; o.update(kw); return o
def H(x, **kw):   # Pak Hendra
    o = {"who": "hendra", "x": x, "face": -1}; o.update(kw); return o
def Y(x, **kw):   # Yoga (headphone di leher)
    o = {"who": "yoga", "x": x, "face": 1, "neckphones": True}; o.update(kw); return o
def SI(x, **kw):   # Sinta
    o = {"who": "sinta", "x": x, "face": 1}; o.update(kw); return o
def D(x, **kw):   # Dodi
    o = {"who": "dodi", "x": x, "face": 1, "size": 560}; o.update(kw); return o
def back(o, y=930, size=520):
    o.update({"y": y, "layer": "back", "size": size}); return o
WULAN = lambda **kw: dict({"who": "resepsionis", "x": 1000, "y": 930, "layer": "back", "face": -1, "size": 520}, **kw)
LOBI = {"time": "sore", "deskX": 1100, "deskFront": True, "stairs": 1600, "slamX": -230}
TANGGA = {"time": "siang", "deskX": 3200, "deskFront": True, "stairs": 1200, "slam": 0}
DODI_LOOK = {"hat": "cap", "hatColor": "#C2691F", "beard": "goatee", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "a", "pencil": True}
PAN_R = {"time": "malam", "clock": "17:40"}
def ptab(cups=2, phone=None, bekal=False):
    p = [{"type": "warungTable", "x": 960, "y": 1060, "layer": "front", "w": 1000, "cups": [[-380, "teh"], [380, "teh"]][:cups]}]
    if phone is not None: p.append(dict({"type": "phoneLying", "x": 1060, "y": 884, "layer": "front"}, **phone))
    return p
def stair(i, x0=1200):
    return [x0 + i * 70 + 35, 1000 - (i + 1) * 50]

AYU_LOOK = {"hair": "hijab", "hijab": "#2F5D50", "shirt": "#FFFDF8", "jacket": "#FFFDF8", "pants": "#2C2433", "skin": "c", "idcard": "#2F6F73"}
extras = {
    "ayu": {"nama": "Mbak Ayu (HR)", "look": AYU_LOOK},
    "tini": {"nama": "Bu Tini (pemilik warung)", "look": {"hair": "hijab", "hijab": "#7FA563", "shirt": "#F3D9B5", "jacket": "#B5643C", "pants": "#3B2418", "skin": "b"}},
    "dodi": {"nama": "Dodi (staf gudang & lapangan)", "look": DODI_LOOK},
    "rekan": {"nama": "Rekan ruang kerja (hijab hijau)", "look": {"hair": "hijab", "hijab": "#2F6F73", "shirt": "#FFFDF8", "jacket": "#7A8B99", "pants": "#2C2433", "skin": "c", "idcard": "#C2691F"}},
    "rekan2": {"nama": "Rekan ruang kerja (hijab biru)", "look": {"hair": "hijab", "hijab": "#3B4A6B", "shirt": "#F3D9B5", "jacket": "#9B7BC4", "pants": "#2C2433", "skin": "d", "idcard": "#C2691F"}},
}
def AY(x, **kw):   # Mbak Ayu
    o = {"who": "ayu", "x": x, "face": -1}; o.update(kw); return o
def N(x, **kw):   # Nisa
    o = {"who": "nisa", "x": x, "face": -1}; o.update(kw); return o
def TI(x, **kw):   # Bu Tini
    o = {"who": "tini", "x": x, "y": 930, "layer": "back", "face": -1, "size": 520}; o.update(kw); return o
def RK(x, **kw):
    o = {"who": "rekan", "x": x, "face": 1}; o.update(kw); return o
def RK2(x, **kw):
    o = {"who": "rekan2", "x": x, "face": -1}; o.update(kw); return o
PINTU = {"type": "officeDoor", "x": 1500, "y": 1000, "label": "KEPALA OPERASIONAL"}
BOS = {"time": "pagi", "deskX": 1300, "folder": True}
BOSP = [{"type": "officeDoor", "x": 420, "y": 1000, "label": "KEPALA OPERASIONAL"}]
KACA = {"view": "dalam", "time": "siang", "deskX": 1240}
def HD(x=1400, **kw): return H(x, y=950, layer="back", size=600, **kw)

A = []
# 1 ------------------------------------------------------------------ SEBELUMNYA (kilas Eps 1-3)
A.append({"n": 1, "name": "Sebelumnya (kilas Eps 1-3)", "vo": True, "music": "sad", "pre": 0.5, "post": 0.5, "trans": "cut",
  "shots": [
    dict({"at": 0, "fx": [{"type": "bills", "at": 0, "startAt": 0.3, "per": 0.35}, REC]}, **NOLOC),
    {"cue": "Bayu menutupinya dengan tawa", "d": -0.2, "trans": "whip", "loc": "kerja", "locOpt": {"time": "pagi", "clock": "08:40"}, "props": [CHAIR, desk(papers=1, laptop=1)],
     "actors": [B(1100, face=-1, keys=[{"at": 0, "pose": "hips", "expr": "laugh", "look": "cam"}, C("lalu bercerita pada Rina", 0.0, expr="sad")]), back(RK(420, keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [1, 0]}])), back(RK2(640, keys=[{"at": 0, "pose": "idle", "expr": "confused"}]))],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, {"at": 0, "x": 1040, "y": 540, "zoom": 1.15, "dur": 4}], "fx": [REC]},
    {"cue": "lalu bercerita pada Rina", "d": -0.2, "trans": "cut", "loc": "pantry", "locOpt": PAN_R, "props": ptab(cups=2),
     "actors": [B(960, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0]}]), R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"x": 1250, "y": 620, "zoom": 1.15}, {"at": 0, "x": 1280, "y": 630, "zoom": 1.28, "dur": 4}], "fx": [REC]},
    insert("Rina menutup dompetnya", -0.2, [{"type": "walletClose", "closeAt": -5, "chip": "DOMPET DITUTUP", "chipAt": 0.4, "chipBg": RED}, REC], trans="whip"),
    {"cue": "Pagi ini Pak Hendra", "d": -0.2, "trans": "cut", "loc": "lorong", "locOpt": {}, "props": [PINTU],
     "actors": [B(-250, face=1, keys=[{"at": 0, "x": -250}, {"at": 0.3, "x": 1100, "dur": 3.4, "expr": "scared"}])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.05}, {"at": 0, "x": 1250, "y": 560, "zoom": 1.15, "dur": 5}], "fx": [REC]},
    {"cue": "Dari luar, pintunya tertutup", "d": -0.2, "trans": "cut", "loc": "lorong", "locOpt": {}, "props": [PINTU], "actors": [],
     "cam": [{"x": 1500, "y": 560, "zoom": 1.4}, {"at": 0, "x": 1500, "y": 570, "zoom": 1.6, "dur": 4}], "fx": [REC]},
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: di dalam ruangan
A.append({"n": 2, "name": "Di dalam ruangan", "loc": "bos", "music": "tense", "trans": "flash", "pre": 0.8,
  "locOpt": BOS, "props": BOSP,
  "lines": [{"who": "hendra", "from": "Kamu tidak dipecat", "to": "Duduk", "text": "Kamu tidak dipecat. Duduk.", "label": "Pak Hendra", "maxW": 520, "size": 46, "min": 2.4}],
  "shots": [
    {"at": 0, "actors": [HD(keys=[{"at": 0, "pose": "idle", "expr": "neutral"}]), B(700, face=1, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [1, 0.2]}])],
     "cam": [{"x": 950, "y": 520, "zoom": 1.05}, {"at": 0, "x": 990, "y": 520, "zoom": 1.15, "dur": 6}],
     "fx": [cap(560, 170, "SELASA, 15 JULI · RUANG PAK HENDRA", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Dasi oranye di seberangnya", "d": -0.2, "trans": "cut",
     "actors": [HD(keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, C("Ia menunjuk kursi", -0.2, pose="point")]), B(700, face=1, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [1, 0.2]}])],
     "cam": [{"x": 1200, "y": 520, "zoom": 1.2}, {"at": 0, "x": 1220, "y": 520, "zoom": 1.32, "dur": 5}],
     "fx": [cap(1500, 170, "DIPECAT? DIGANTI? HABIS?", bg="#6E2430", size=34, cue="Dipecat. Diganti. Habis", d=0.0)]},
    {"cue": "Kamu tidak dipecat", "d": -0.3, "trans": "cut",
     "actors": [B(700, face=1, keys=[{"at": 0, "pose": "idle", "expr": "shock", "look": [1, 0.2]}, C("Duduk", 0.2, expr="happy")])],
     "cam": [{"on": "bayu", "fit": 0.27, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.36, "sx": 800, "dur": 4}]},
    {"cue": "Bayu duduk", "d": -0.2, "trans": "cut",
     "actors": [HD(keys=[{"at": 0, "pose": "idle", "expr": "neutral"}]), B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.2]}])],
     "cam": [{"x": 950, "y": 560, "zoom": 1.1}, {"at": 0, "x": 990, "y": 560, "zoom": 1.2, "dur": 6}]},
    {"cue": "Di saku bajunya", "d": -0.2, "trans": "cut",
     "actors": [B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "tired", "look": "down"}])],
     "cam": [{"on": "bayu", "fit": 0.3, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.36, "sx": 800, "dur": 6}],
     "fx": [cap(1450, 190, "TUTUP KOTAK NASI DODI MASIH TERLIPAT", bg="#8E4A24", size=28, cue="tutup kotak nasi Dodi", d=0.0)]},
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "UTANG BAYU · EPS 4/4",
     "hook": "Terjerat 7 Aplikasi Paylater Sampai Gaji Habis. Begini Bayu Bebas", "day": "15", "month": "JULI", "marker": "SELASA · 15 JULI", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Jujur, lalu Mbak Ayu
A.append({"n": 4, "name": "Jujur, lalu Mbak Ayu", "loc": "bos", "music": "warm", "trans": "iris",
  "locOpt": BOS, "props": BOSP,
  "lines": [{"who": "hendra", "from": "Intinya, kamu jujur", "to": "dari lobi", "text": "Intinya, kamu jujur sekarang. Ayu yang bantu urutkan.", "label": "Pak Hendra", "maxW": 580, "size": 38},
            {"who": "ayu", "from": "Kita tidak menyelesaikan ini", "to": "berhenti menambah", "text": "Kita tulis semuanya. Hari ini tidak ada yang ditambah.", "label": "Mbak Ayu", "maxW": 560, "size": 38}],
  "shots": [
    {"at": 0, "actors": [HD(keys=[{"at": 0, "pose": "idle", "expr": "neutral"}]), B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.2]}])],
     "cam": [{"x": 950, "y": 560, "zoom": 1.1}, {"at": 0, "x": 990, "y": 560, "zoom": 1.2, "dur": 7}],
     "fx": [cap(560, 170, "SEBENARNYA, SAMPAI SELESAI", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Bayu menyebutnya pelan", "d": -0.2, "trans": "cut",
     "actors": [B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.2]}, C("Tujuh aplikasi", 0.0, expr="scared")])],
     "cam": [{"on": "bayu", "fit": 0.27, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.33, "sx": 800, "dur": 6}],
     "fx": [cap(1450, 190, "7 APLIKASI", bg=RED, size=40, cue="Tujuh aplikasi", d=0.0), cap(1450, 300, "TANPA BERCANDA", bg=NAVY, col=YEL, size=30, cue="Gaji masuk, gaji habis", d=0.0)]},
    {"cue": "Pak Hendra mengangguk sekali", "d": -0.2, "trans": "cut",
     "actors": [HD(item="phone", keys=[{"at": 0, "pose": "hold", "expr": "neutral"}, C("Ia mengangkat telepon internal", -0.2, pose="phone", item="phone")]), B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.2]}])],
     "cam": [{"x": 1200, "y": 520, "zoom": 1.2}, {"at": 0, "x": 1220, "y": 520, "zoom": 1.32, "dur": 6}]},
    {"cue": "Mbak Ayu dari HR masuk", "d": -0.2, "trans": "cut",
     "actors": [HD(keys=[{"at": 0, "pose": "idle", "expr": "neutral"}]), B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.2]}]),
                AY(-260, face=1, item="folder", keys=[{"at": 0, "pose": "hold", "expr": "neutral"}, {"at": 0.2, "x": 1000, "dur": 2.4}, C("Ia duduk di samping", 0.0, pose="sit", x=1000, face=1)])],
     "cam": [{"x": 800, "y": 560, "zoom": 1.1}, {"at": 0, "x": 940, "y": 560, "zoom": 1.2, "dur": 7}]},
    {"cue": "Kita tidak menyelesaikan ini", "d": -0.4, "trans": "cut",
     "actors": [B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.2]}]), AY(1000, face=-1, item="folder", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.1]}])],
     "cam": [{"x": 900, "y": 580, "zoom": 1.2}, {"at": 0, "x": 920, "y": 580, "zoom": 1.34, "dur": 8}],
     "fx": [cap(560, 190, "HARI INI: MENULIS. DAN BERHENTI MENAMBAH.", bg=NAVY, col=YEL, size=30, cue="Hari ini kita hanya menulis", d=0.0)]},
  ]})

# 5 ------------------------------------------------------------------ Maaf yang tertunda
A.append({"n": 5, "name": "Maaf yang tertunda", "loc": "pantry", "music": "warm", "trans": "whip",
  "locOpt": {"time": "pagi", "clock": "08:15"}, "props": ptab(cups=1),
  "lines": [{"who": "bayu", "from": "Maaf, Rin", "to": "bukan karena kamu salah", "text": "Maaf, Rin. Kemarin aku marah karena takut.", "label": "Bayu", "maxW": 560, "size": 40},
            {"who": "rina", "from": "Aku tetap tidak meminjamkan uang", "to": "Aku di sini", "text": "Aku tetap tidak meminjamkan. Tapi aku di sini.", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "actors": [R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}]), B(-250, face=1, keys=[{"at": 0, "x": -250}, {"at": 0.4, "x": 640, "dur": 2.4, "expr": "sad"}])],
     "cam": [{"x": 1100, "y": 600, "zoom": 1.1}, {"at": 0, "x": 1160, "y": 600, "zoom": 1.2, "dur": 7}],
     "fx": [cap(560, 170, "PANTRY · BELUM RAMAI", bg=NAVY, col=YEL, at=0.4)]},
    insert("Bayu meletakkan tutup kotak nasi", -0.3, {"type": "lunchBox", "chip": "TUTUP YANG IA SIMPAN SEJAK KEMARIN", "chipAt": C("yang ia simpan sejak kemarin", 0.0), "chipBg": "#8E4A24"}, trans="zoom"),
    {"cue": "Tidak ada gorengan, belum", "d": -0.1, "trans": "cut",
     "actors": [B(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0]}, C("Maaf, Rin", -0.2, look="down")]), R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"x": 1220, "y": 620, "zoom": 1.25}, {"at": 0, "x": 1240, "y": 630, "zoom": 1.38, "dur": 8}]},
    {"cue": "Rina mengangguk", "d": -0.2, "trans": "cut",
     "actors": [R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}, C("Tapi aku di sini", -0.2, expr="happy")])],
     "cam": [{"on": "rina", "fit": 0.27, "sx": 900}, {"at": 0, "on": "rina", "fit": 0.32, "sx": 900, "dur": 6}]},
    {"cue": "Tidak ada pelukan", "d": -0.2, "trans": "cut",
     "actors": [B(960, face=-1, keys=[{"at": 0, "pose": "sit", "expr": "sad"}, C("Ada kursi yang ditarik", 0.0, x=1280, dur=1.2, pose="sit"), C("dua orang yang duduk", 0.0, expr="neutral")]), R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"x": 1250, "y": 600, "zoom": 1.15}, {"at": 0, "x": 1280, "y": 610, "zoom": 1.3, "dur": 9}],
     "fx": [cap(560, 190, "MAAFNYA PENDEK. CUKUP.", bg=NAVY, col=YEL, size=32, cue="Maafnya pendek", d=0.0)]},
  ]})

# 6 ------------------------------------------------------------------ Tujuh baris
A.append({"n": 6, "name": "Tujuh baris", "loc": "kaca", "music": "hope", "trans": "iris",
  "locOpt": KACA,
  "lines": [{"who": "ayu", "from": "Urutannya kamu yang tentukan", "to": "tidak ada baris baru", "text": "Urutannya kamu yang pilih. Yang penting satu per satu, dan tidak ada baris baru.", "label": "Mbak Ayu", "maxW": 620, "size": 36}],
  "shots": [
    {"at": 0, "actors": [B(700, face=1, keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": [1, 0.2]}]), AY(1100, face=-1, item="folder", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0.1]}])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.05}, {"at": 0, "x": 940, "y": 560, "zoom": 1.15, "dur": 6}],
     "fx": [cap(560, 170, "RUANG KACA BU RATNA · DIPINJAM SEJAM", bg=NAVY, col=YEL, at=0.4), cap(1400, 190, "BERHENTI NAMBAH DULU. BARU DIURUTKAN.", bg=GREEN, size=30, at=2.6)]},
    insert("Bayu menulis tujuh nama", -0.2, {"type": "sevenSheet", "writeAt": 0.3, "per": 0.7, "title": "UTANG BAYU · JULI"}, trans="zoom"),
    {"cue": "Mbak Ayu tidak memilihkan", "d": -0.2, "trans": "cut",
     "actors": [AY(1100, face=-1, item="folder", keys=[{"at": 0, "pose": "talk", "expr": "neutral", "look": [-1, 0.1]}]), B(700, face=1, keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": [1, 0.2]}])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.2}, {"at": 0, "x": 920, "y": 560, "zoom": 1.34, "dur": 9}]},
    insert("Bayu menandai Cicilan F", -0.2, {"type": "sevenSheet", "writeAt": -10, "per": 0, "mark": 5, "markAt": 0.5, "chip": "CICILAN F DULU · DENDANYA MENYALA", "chipAt": C("dendanya menyala", 0.0), "chipBg": RED}, trans="whip"),
    insert("Lalu, di ujung meja", -0.2, {"type": "sevenSheet", "writeAt": -10, "per": 0, "mark": 5, "markAt": -10, "itemsAt": 0.2, "sellAt": C("Yang ini dijual", -0.1), "chip": "HELM & JAM: DIJUAL, BUKAN DICICIL", "chipAt": C("Bukan ditambah cicilannya", -0.3)}, trans="cut"),
  ]})

# 7 ------------------------------------------------------------------ Sinta memotong bisikan
A.append({"n": 7, "name": "Sinta memotong bisikan", "loc": "pantry", "music": "tense", "trans": "whip",
  "locOpt": {"time": "siang", "clock": "11:30"}, "props": ptab(cups=1),
  "lines": [{"who": "sinta", "from": "Kalau mau bantu, bantu", "to": "Kalau tidak, diam", "text": "Kalau mau bantu, bantu. Kalau tidak, diam.", "label": "Sinta", "maxW": 560, "size": 44, "min": 2.4}],
  "shots": [
    {"at": 0, "actors": [RK(700, keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [1, 0]}]), RK2(960, keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [-1, 0]}])],
     "cam": [{"x": 900, "y": 600, "zoom": 1.15}, {"at": 0, "x": 930, "y": 600, "zoom": 1.28, "dur": 7}],
     "fx": [cap(560, 170, "MASIH BERBISIK · SEBELUM SIANG", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Di pantry, dua orang", "d": -0.1, "trans": "cut",
     "actors": [RK(700, keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [1, 0]}]), RK2(960, keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [-1, 0]}]),
                {"who": "sinta", "x": 2300, "face": -1, "item": "notebook", "keys": [{"at": 0, "x": 2300, "pose": "hold", "expr": "neutral"}, C("Sinta lewat", 0.0, x=1500, dur=3.0)]}],
     "cam": [{"x": 1200, "y": 580, "zoom": 1.05}, {"at": 0, "x": 1250, "y": 580, "zoom": 1.15, "dur": 7}],
     "fx": [cap(560, 190, "ANGKANYA MEREKA TIDAK TAHU. NAMANYA MEREKA TEBAK.", bg="#6E2430", size=28, cue="Namanya mereka tebak", d=0.0)]},
    {"cue": "Ia berhenti", "d": -0.2, "trans": "cut",
     "actors": [RK(700, keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [1, 0]}]), RK2(960, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [1, 0]}]),
                {"who": "sinta", "x": 1500, "face": -1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}]}],
     "cam": [{"x": 1150, "y": 580, "zoom": 1.15}, {"at": 0, "x": 1120, "y": 580, "zoom": 1.28, "dur": 6}]},
    {"cue": "Kalau mau bantu, bantu", "d": -0.4, "trans": "cut",
     "actors": [{"who": "sinta", "x": 1500, "face": -1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}, C("Kalau tidak, diam", 0.0, expr="angry")]}],
     "cam": [{"on": "sinta", "fit": 0.27, "sx": 1100}, {"at": 0, "on": "sinta", "fit": 0.33, "sx": 1100, "dur": 7}]},
    {"cue": "Ia tidak menjelaskan", "d": -0.2, "trans": "cut",
     "actors": [RK(700, keys=[{"at": 0, "pose": "idle", "expr": "sad", "look": "down"}]), RK2(960, keys=[{"at": 0, "pose": "idle", "expr": "sad", "look": "down"}]),
                {"who": "sinta", "x": 1500, "face": -1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}]}],
     "cam": [{"x": 1150, "y": 580, "zoom": 1.1}, {"at": 0, "x": 1150, "y": 580, "zoom": 1.2, "dur": 8}],
     "fx": [cap(560, 190, "KALIMAT PENDEK. RUANGAN IKUT PENDEK.", bg=NAVY, col=YEL, size=30, cue="Untuk semenit", d=0.0)]},
  ]})

# 8 ------------------------------------------------------------------ Daftar resmi (titik tegang)
A.append({"n": 8, "name": "Daftar resmi", "loc": "kaca", "music": "tense", "musicCut": 2.2, "trans": "iris", "post": 0.4, "hold": 1.6,
  "locOpt": KACA,
  "lines": [{"who": "ayu", "from": "Yang berizin ada daftarnya", "to": "nama panggilan saja", "text": "Cari nama perusahaannya, dan nama aplikasinya. Jangan nama panggilan saja.", "label": "Mbak Ayu", "maxW": 600, "size": 34},
            {"who": "bayu", "from": "Kalau tidak ada di daftar", "to": "bagaimana", "text": "Kalau yang ini tidak ada di daftar… bagaimana?", "label": "Bayu", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "actors": [AY(1100, face=-1, item="tablet", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0.1]}]), B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "tired", "look": [1, 0.2]}])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.05}, {"at": 0, "x": 940, "y": 560, "zoom": 1.15, "dur": 4}],
     "fx": [cap(560, 170, "SIANGNYA · SITUS RESMI, BUKAN GRUP GOSIP", bg=NAVY, col=YEL, at=0.4)]},
    insert("Yang berizin ada daftarnya", -1.2, {"type": "ojkSearch", "rowsAt": C("Enam baris mereka temukan", -0.3), "per": 0.55, "typeAt": 999}, trans="zoom"),
    {"cue": "Bayu mencentang pelan", "d": -0.2, "trans": "cut",
     "actors": [B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.2]}, C("Tinggal satu", 0.0, expr="scared")]), AY(1100, face=-1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.1]}])],
     "cam": [{"x": 900, "y": 580, "zoom": 1.2}, {"at": 0, "x": 920, "y": 580, "zoom": 1.34, "dur": 6}],
     "fx": [cap(560, 190, "ENAM DICENTANG. TINGGAL SATU.", bg=NAVY, col=YEL, size=32, cue="Tinggal satu", d=0.0)]},
    insert("Pinjaman G. Jari Bayu", -0.3, {"type": "ojkSearch", "rowsAt": -10, "per": 0, "typeAt": 0.2, "chip": "KE RESEPSIONIS, BUKAN KE BAYU", "chipX": 1200, "chipY": 130, "chipAt": C("Ke resepsionis", 0.0), "chipBg": "#6E2430"}, trans="cut"),
    {"cue": "Ia belum menekan enter", "d": -0.3, "trans": "cut",
     "actors": [B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [1, 0.2], "emote": "sweat"}])],
     "cam": [{"on": "bayu", "fit": 0.27, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.4, "sx": 800, "dur": 4}]},
  ]})

# 9 ------------------------------------------------------------------ Yang tidak berizin (kejutan tengah)
A.append({"n": 9, "name": "Yang tidak berizin", "loc": "kaca", "music": "tense", "trans": "cut", "pre": 0.2,
  "locOpt": KACA,
  "lines": [{"who": "ayu", "from": "Yang berizin tidak menagih dengan mempermalukan", "to": "tidak menelpon orang lain", "text": "Penagih yang berizin tidak menelpon orang lain di kantor.", "label": "Mbak Ayu", "maxW": 620, "size": 36},
            {"who": "bayu", "from": "Bayu takut", "to": "Tangannya tetap di meja", "text": "Aku laporkan. Dan aku tidak pinjam lagi ke situ.", "label": "Bayu", "maxW": 580, "size": 38}],
  "shots": [
    dict({"at": 0, "fx": [{"type": "ojkSearch", "at": 0, "rowsAt": -10, "per": 0, "typeAt": -10, "enterAt": -3, "emptyAt": 0.5, "chip": "TIDAK ADA DI DAFTAR BERIZIN", "chipAt": 1.4, "chipBg": RED}]}, **NOLOC),
    {"cue": "Bukan salah ketik", "d": -0.1, "trans": "cut",
     "actors": [B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "shock", "look": [1, 0.2]}, C("Bayu takut", 0.0, expr="scared")]), AY(1100, face=-1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.1]}, C("Mbak Ayu menunjuk catatan", -0.2, pose="point")])],
     "cam": [{"x": 900, "y": 580, "zoom": 1.2}, {"at": 0, "x": 920, "y": 580, "zoom": 1.34, "dur": 6}],
     "fx": [cap(560, 190, "CATATAN: MENELPON RESEPSIONIS, BUKAN BAYU", bg=NAVY, col=YEL, size=28, cue="catatan kecil di pinggir kertas", d=0.0)]},
    {"cue": "Yang seperti ini dilaporkan", "d": -0.4, "trans": "cut",
     "actors": [AY(1100, face=-1, item="folder", keys=[{"at": 0, "pose": "talk", "expr": "neutral", "look": [-1, 0.1]}]), B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.2]}])],
     "cam": [{"on": "ayu", "fit": 0.27, "sx": 1100}, {"at": 0, "on": "ayu", "fit": 0.33, "sx": 1100, "dur": 8}]},
    insert("Mereka mengirim laporannya", -0.2, {"type": "reportSent", "stampAt": C("Cap hijau", -0.1), "replyAt": C("Bayu menulis arahan itu", -0.6), "chip": "LAPORAN TERKIRIM", "chipAt": C("Cap hijau", 0.5), "chipBg": GREEN}, trans="zoom"),
    {"cue": "Bayu menulis arahan itu", "d": -0.2, "trans": "cut",
     "actors": [B(700, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": "down"}, C("Tidak menambah", 0.0, expr="proud")]), AY(1100, face=-1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.1]}])],
     "cam": [{"x": 900, "y": 580, "zoom": 1.15}, {"at": 0, "x": 920, "y": 580, "zoom": 1.3, "dur": 8}],
     "fx": [card("Tidak menambah", "Tidak ada di daftar berizin · Laporkan · Ikuti arahan · Jangan tambah", d=0.2, x=1200, y=200, size=34, maxW=900)]},
  ]})

# 10 ----------------------------------------------------------------- Tiga bulan, satu per satu
A.append({"n": 10, "name": "Tiga bulan, satu per satu", "loc": "kerja", "music": "hope", "trans": "fade", "pre": 0.3,
  "locOpt": {"time": "sore", "clock": "16:20"}, "props": [CHAIR, desk(papers=1, laptop=1)],
  "lines": [{"who": "rina", "from": "Ada baris baru", "to": "Ada baris baru", "text": "Ada baris baru?", "maxW": 420, "size": 44, "min": 1.8},
            {"who": "bayu", "from": "Tidak ada", "to": "Tidak ada", "text": "Tidak ada.", "label": "Bayu", "maxW": 420, "size": 46, "min": 1.8}],
  "shots": [
    dict({"at": 0, "fx": [{"type": "debtMontage", "at": 0, "flips": [C("Agustus, satu baris", -0.2), C("September, helm", -0.2), C("Oktober, tinggal satu", -0.2)], "chipAt": C("Oktober, tinggal satu", 1.2)}]}, **NOLOC),
    {"cue": "Rina tidak mengambil alih", "d": -0.2, "trans": "cut",
     "actors": [R(1300, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}, C("Ada baris baru", -0.2, expr="happy")]), B(850, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.1]}, C("Bayu menggeleng", 0.0, expr="proud"), C("Tidak ada", 0.0, pose="thumbs", item="thumb")])],
     "cam": [{"x": 1100, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1100, "y": 560, "zoom": 1.25, "dur": 8}],
     "fx": [cap(1450, 190, "PERTANYAAN RINA: ADA BARIS BARU?", bg=NAVY, col=YEL, size=30, cue="Sesekali ia hanya bertanya", d=0.0)]},
    {"cue": "Untuk Bayu, kalimat itu", "d": -0.2, "trans": "cut",
     "actors": [B(850, face=1, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.1]}])],
     "cam": [{"on": "bayu", "fit": 0.27, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.33, "sx": 800, "dur": 5}],
     "fx": [cap(1450, 190, "LEBIH BERAT DARIPADA PUJIAN", bg=GREEN, size=30, cue="lebih berat daripada pujian", d=0.0)]},
  ]})

# 11 ----------------------------------------------------------------- Gorengan yang lunas
WTAB = [{"type": "warungTable", "x": 960, "y": 1060, "layer": "front", "w": 1180, "cups": [[-440, "teh"], [-40, "kopi"], [420, "teh"]], "spoon": 1}]
A.append({"n": 11, "name": "Gorengan yang lunas", "loc": "warung", "music": "warm", "trans": "iris",
  "locOpt": {"time": "siang"}, "props": WTAB,
  "lines": [{"who": "bayu", "from": "Yang ini lunas, Rin", "to": "Yang ini lunas, Rin", "text": "Yang ini lunas, Rin.", "label": "Bayu", "maxW": 520, "size": 46, "min": 2.0},
            {"who": "tini", "from": "Kopinya juga", "to": "Lunas.\" Dodi", "text": "Kopinya juga. Lima belas. Lunas.", "label": "Bu Tini", "maxW": 520, "size": 42},
            {"who": "dodi", "from": "Beres, Bos", "to": "Beres, Bos", "text": "Beres, Bos.", "label": "Dodi", "maxW": 420, "size": 46, "min": 1.8}],
  "shots": [
    {"at": 0, "actors": [TI(1620, keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": [-1, 0.3]}]), B(600, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.1]}])],
     "cam": [{"x": 1000, "y": 620, "zoom": 1.1}, {"at": 0, "x": 1040, "y": 620, "zoom": 1.2, "dur": 5}],
     "fx": [cap(560, 170, "WARUNG BU TINI · JULI-OKTOBER", bg=NAVY, col=YEL, at=0.4)]},
    insert("Lima belas garis", -0.4, {"type": "bonLunas", "stampAt": C("sampai Bu Tini berhenti menghitung", 0.2), "chip": "15 KOPI · LUNAS", "chipAt": C("sampai Bu Tini berhenti menghitung", 1.0)}, trans="zoom"),
    {"cue": "Lalu ia memesan gorengan", "d": -0.2, "trans": "cut", "props": WTAB,
     "actors": [TI(1620, item="gorengan", keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": [-1, 0.3]}]), B(600, face=1, item="money", keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": [1, 0.1]}, C("Bukan paylater", 0.0, item=None, expr="proud")]),
                R(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [-1, 0]}]), D(1320, face=-1, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [-1, 0]}])],
     "cam": [{"x": 1000, "y": 620, "zoom": 1.05}, {"at": 0, "x": 1000, "y": 620, "zoom": 1.15, "dur": 6}],
     "fx": [cap(560, 190, "UANG KERTAS. BUKAN PAYLATER.", bg=GREEN, size=32, cue="Uang kertas", d=0.0)]},
    {"cue": "Yang ini lunas, Rin", "d": -0.3, "trans": "cut", "props": WTAB,
     "actors": [B(600, face=1, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.1]}]), R(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [-1, 0]}]), TI(1620, keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": [-1, 0.3]}, C("Bu Tini menutup buku itu", 0.0, pose="talk")])],
     "cam": [{"x": 1000, "y": 620, "zoom": 1.1}, {"at": 0, "x": 1050, "y": 620, "zoom": 1.22, "dur": 5}]},
    {"cue": "Dodi menepuk topi oranyenya", "d": -0.2, "trans": "cut", "props": WTAB,
     "actors": [B(600, face=1, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.1]}, C("Bayu tertawa", 0.0, expr="laugh")]), D(1320, face=-1, keys=[{"at": 0, "pose": "sit", "expr": "proud", "look": [-1, 0]}, C("Beres, Bos", -0.3, pose="thumbs", item="thumb")]), R(960, face=1, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [-1, 0]}])],
     "cam": [{"x": 1000, "y": 620, "zoom": 1.05}, {"at": 0, "x": 1000, "y": 620, "zoom": 1.18, "dur": 6}],
     "fx": [cap(560, 190, "TAWANYA TIDAK MENUTUP APA-APA", bg=NAVY, col=YEL, size=32, cue="tidak menutup apa-apa", d=0.0)]},
  ]})

# 12 ----------------------------------------------------------------- Kartu pelajaran dan penutup cerita
A.append({"n": 12, "name": "Kartu pelajaran dan penutup cerita", "loc": "kerja", "music": "warm", "trans": "iris", "post": 3.0,
  "locOpt": {"time": "sore", "clock": "17:40"}, "props": [CHAIR, desk(papers=1, laptop=1)],
  "shots": [
    {"at": 0, "blur": 9, "actors": [B(1000, face=1, keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": "cam"}, C("Satu: tulis semua utang", pose="pointUp"), C("Dua: lunasi berurutan", pose="hips", expr="proud"), C("Tiga: cek nama perusahaan", pose="pointUp", expr="happy")])],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 14}],
     "fx": [{"type": "lesson", "cue": "Satu: tulis semua utang", "d": -0.3, "items": [{"cue": "Satu: tulis semua utang", "text": "Tulis semua utang, berhenti menambah"},
            {"cue": "Dua: lunasi berurutan", "text": "Lunasi berurutan, minta keringanan ke pemberi berizin"}, {"cue": "Tiga: cek nama perusahaan", "text": "Cek daftar resmi. Tidak ada? Laporkan, ikuti arahan"}]}]},
    insert("Bayu tidak bebas dalam satu malam", -0.2, {"type": "sevenSheet", "writeAt": -10, "per": 0, "strikes": [[0, -9], [1, -9], [2, -9], [3, -9], [4, -9], [5, -9], [6, 1.2]], "title": "UTANG BAYU · SELESAI"}, trans="zoom"),
    insert("Ia juga tidak bebas karena Rina", -0.2, {"type": "walletClose", "closeAt": -5, "chip": "BUKAN KARENA PINJAMAN RINA", "chipAt": 0.4}, trans="whip"),
    insert("Ia bebas karena ia berhenti", -0.2, {"type": "lunchBox", "chip": "BERHENTI BERPURA-PURA", "chipAt": 0.8, "chipBg": "#8E4A24"}, trans="zoom"),
    insert("tidak menambal lubang dengan lubang baru", -0.4, {"type": "reportSent", "stampAt": -1, "replyAt": -1, "chip": "TIDAK MENAMBAL LUBANG DENGAN LUBANG BARU", "chipAt": 0.6, "chipBg": GREEN}, trans="cut"),
  ]})

# 13 ----------------------------------------------------------------- Cuplikan Cerita 4 (Anak Baru) + layar akhir
A.append({"n": 13, "name": "Cuplikan Anak Baru + layar akhir", "loc": "kerja", "music": "hope", "trans": "flash", "post": 6.5,
  "locOpt": {"time": "pagi", "clock": "08:50"}, "props": [CHAIR, desk(papers=1, laptop=1), desk(x=1700, laptop=1)],
  "lines": [{"who": "nisa", "from": "Halo, saya Nisa", "to": "Karyawan baru", "text": "Halo, saya Nisa. Karyawan baru.", "label": "Nisa", "maxW": 520, "size": 46, "min": 2.2}],
  "shots": [
    dict({"at": 0, "fx": [{"type": "sevenSheet", "at": 0, "writeAt": -10, "per": 0, "strikes": [[5, -9], [1, -9], [0, -9]], "chip": "AWAL AGUSTUS", "chipAt": 0.4, "chipBg": NAVY, "title": "UTANG BAYU · AGUSTUS"}]}, **NOLOC),
    {"cue": "ada meja kosong di sebelah Rina", "d": -0.2, "trans": "cut",
     "actors": [B(850, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.1]}]), R(1300, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}])],
     "cam": [{"x": 1250, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1350, "y": 560, "zoom": 1.2, "dur": 5}]},
    {"cue": "Seorang perempuan muda berdiri", "d": -0.2, "trans": "cut",
     "actors": [N(1800, item="folder", keys=[{"at": 0, "pose": "hold", "expr": "scared", "look": [-1, 0.1]}, C("Halo, saya Nisa", 0.0, pose="wave", expr="happy", item=None)]), R(1300, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}, C("Rina menoleh", 0.0, face=1, expr="happy")])],
     "cam": [{"x": 1500, "y": 560, "zoom": 1.15}, {"at": 0, "x": 1600, "y": 560, "zoom": 1.3, "dur": 8}]},
    {"cue": "Bayu, di mejanya", "d": -0.2, "trans": "cut",
     "actors": [B(850, face=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": "down"}, C("Tapi di meja sebelah", 0.0, look=[1, 0.1], expr="happy")])],
     "cam": [{"x": 950, "y": 540, "zoom": 1.1}, {"at": 0, "x": 1000, "y": 540, "zoom": 1.2, "dur": 5}]},
    {"cue": "Saksikan Kantor Tangani", "d": -0.2, "trans": "flash", "blur": 8, "actors": [N(1750, keys=[{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}])],
     "cam": [{"x": 1500, "y": 560, "zoom": 1.15}, {"at": 0, "x": 1560, "y": 560, "zoom": 1.2, "dur": 4}],
     "fx": [{"type": "card", "at": 0.1, "text": "CERITA BARU · ANAK BARU", "tag": "KANTOR TANGANI", "size": 90, "bg": ORANGE}]},
    {"cue": "Kalau cerita ini", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di komentar"), "nextQuote": "\"Halo, saya Nisa.\"", "nextSub": "karyawan baru", "nextTitle": "Anak Baru · Eps 1",
             "nextWho": "nisa", "nextKey": {"pose": "wave", "expr": "happy"}, "nextThumb": False, "playlist": "Utang Bayu", "playlistEps": "Eps 1 · 2 · 3 · 4",
             "ask": "Utang yang paling sering ditutup dengan tawa, biasanya utang yang mana? Tulis di komentar!"}]},
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
ep = {"slug": "kantor-12", "title": "Terjerat 7 Aplikasi Paylater Sampai Gaji Habis. Begini Bayu Bebas | Kantor Tangani: Utang Bayu Eps 4",
      "series": "Kantor Tangani", "story": "Utang Bayu", "eps": "4/4", "month": "JULI", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "Tidak dipecat"], [6, "Tujuh baris"], [7, "Kalau mau bantu"], [9, "Tidak berizin"], [10, "Tiga bulan"], [12, "Pelajaran"], [13, "Cerita baru"]],
      "parts": [["Pembuka & masalah", 0, 3], ["Memburuk", 3, 5], ["Berubah", 5, 7], ["Cerita berikutnya", 7, 8]],
      "lessons": ["Tulis semua utang, lalu berhenti menambah.",
                  "Lunasi berurutan, dan minta keringanan kepada pemberi yang berizin.",
                  "Cek nama perusahaan dan aplikasinya di daftar resmi. Yang tidak ada, laporkan lewat saluran resmi, lalu ikuti arahannya."],
      "youtube": {
        "desc": "Bayu dipanggil Pak Hendra dan ternyata tidak dipecat. Bersama Mbak Ayu dari HR, ia menulis tujuh utangnya, mengecek daftar penyelenggara berizin di situs resmi OJK, dan melaporkan yang tidak berizin lewat saluran resmi. Tiga bulan kemudian, kertas tujuh baris itu hampir habis dicoret. Episode terakhir Kantor Tangani: Utang Bayu. Cerita fiksi, bukan nasihat keuangan. Aduan: OJK 157, WhatsApp 081 157 157 157, sipasti.ojk.go.id.",
        "ask": "Utang yang paling sering ditutup dengan tawa, biasanya utang yang mana? Tulis di kolom komentar.",
        "next": "Kantor Tangani: Anak Baru, Eps 1.",
        "tags": "kantor tangani, utang bayu, cerita kantor, animasi kantor, paylater, pinjol ilegal, pinjaman online, daftar OJK, Satgas PASTI, keluar dari utang, dunia kerja, Tangani Talenta",
        "hashtags": "#KantorTangani #UtangBayu #duniakerja",
        "adAfter": 7},
      "thumb": {"kind": "utang4", "lines": ["TERJERAT 7 PAYLATER,", "GAJI HABIS?"], "hl": "BAYU BEBAS", "lineSize": 76, "hlSize": 104, "badge": "EPS 4/4", "tag": "KANTOR TANGANI · UTANG BAYU"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
