#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-11 (Utang Bayu Eps 3: "Penagih Utang Menelepon ke Kantor, Satu Divisi Jadi Tahu").
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}.
Mesin tambahan: engine/panjang/kit16k.js (billNote, walletClose, lunchBox, msgDraft, photoMsg, thumbnail utang3), kit16j.js (transferApp), kit16i.js (lockAlert)."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-11/episode.json"
NASKAH = "youtube/serial/ep11-naskah.md"

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

extras = {
    "resepsionis": {"nama": "Mbak Wulan (resepsionis)", "look": {"hair": "hijab", "hijab": "#C2691F", "shirt": "#FFFDF8", "jacket": "#13223D", "pants": "#2C2433", "skin": "d", "idcard": "#C2691F"}},
    "dodi": {"nama": "Dodi (staf gudang & lapangan)", "look": DODI_LOOK},
    "rekan": {"nama": "Rekan ruang kerja (hijab hijau)", "look": {"hair": "hijab", "hijab": "#2F6F73", "shirt": "#FFFDF8", "jacket": "#7A8B99", "pants": "#2C2433", "skin": "c", "idcard": "#C2691F"}},
}

A = []
# 1 ------------------------------------------------------------------ SEBELUMNYA (kilas Eps 1-2)
RAP = {"clock": "16:50", "slide": "logo", "backChairs": [1300, 1520], "tableX0": 1080, "tableX1": 1960, "tableItems": [[1300, "paper"], [1560, "cup"], [1800, "laptop"]]}
A.append({"n": 1, "name": "Sebelumnya (kilas Eps 1-2)", "vo": True, "music": "sad", "pre": 0.5, "post": 0.5, "trans": "cut",
  "shots": [
    dict({"at": 0, "fx": [{"type": "transferApp", "at": 0, "typeAt": 0.3, "badgeAt": 1.4}, REC]}, **NOLOC),
    insert("Rina menyuruhnya menelepon dulu", -0.2, [{"type": "callScreen", "name": "Pak Hendra", "sub": "kontak tersimpan", "ch": "H", "col": ORANGE, "rings": [0.5, 1.8]}, REC], trans="whip"),
    insert("Uang kantor tidak jadi pergi", -0.2, [{"type": "transferApp", "typeAt": -30, "badgeAt": -30, "stampAt": 0.5, "fingerOut": 0.0}, REC], trans="cut"),
    {"cue": "Tapi sore itu telepon lain", "d": -0.2, "trans": "whip", "loc": "lobi", "locOpt": dict(LOBI, slam=0),
     "actors": [WULAN(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral"}])],
     "cam": [{"x": 1000, "y": 620, "zoom": 1.15}, {"at": 0, "x": 1040, "y": 620, "zoom": 1.28, "dur": 4}], "fx": [REC]},
    insert("Dari penagihan", -0.1, [{"type": "lockAlert", "mode": "missed", "bannerAt": 0.4, "clock": "16.58", "date": "Jumat, 11 Juli", "chip": "PINJAMAN G · TAK TERANGKAT", "chipAt": 1.4}, REC], trans="cut"),
    {"cue": "Dan ruang kerja keburu", "d": -0.2, "trans": "cut", "loc": "kerja", "locOpt": {"time": "sore", "clock": "16:58"},
     "props": [CHAIR, desk(papers=1, laptop=1)],
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}]),
                back(SI(260, keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [1, 0]}])), back(Y(1850, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [-1, 0]}]))],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, {"at": 0, "x": 1040, "y": 540, "zoom": 1.15, "dur": 5}], "fx": [REC]},
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: tawa yang terlalu keras
A.append({"n": 2, "name": "Senin, tawa yang terlalu keras", "loc": "kerja", "music": "tense", "trans": "flash", "pre": 0.5,
  "locOpt": {"time": "pagi", "clock": "08:40"},
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "lines": [{"who": "rekan", "from": "Kemarin ada telepon", "to": "Katanya penagihan", "text": "Kemarin ada telepon. Katanya penagihan.", "maxW": 540, "size": 38},
            {"who": "bayu", "from": "Salah sambung, guys", "to": "Santai!", "text": "Salah sambung, guys. Santai!", "label": "Bayu", "maxW": 520, "size": 44, "min": 2.4}],
  "shots": [
    {"at": 0, "actors": [back({"who": "rekan", "x": 420, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "confused", "look": [1, 0]}]}),
                         back(SI(640, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [-1, 0]}]))],
     "cam": [{"x": 700, "y": 560, "zoom": 1.15}, {"at": 0, "x": 760, "y": 560, "zoom": 1.25, "dur": 6}],
     "fx": [cap(1400, 170, "SENIN, 14 JULI · 08.40", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Bayu mendengarnya dari dua meja", "d": -0.2, "trans": "cut",
     "actors": [B(1500, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}, C("Salah sambung, guys", -0.4, expr="laugh", pose="hips"), C("Tawanya keras", 0.0, jump=16)]),
                back({"who": "rekan", "x": 420, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "confused", "look": [1, 0]}]}), back(SI(640, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "confused"}]))],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, {"at": 0, "x": 1060, "y": 540, "zoom": 1.15, "dur": 6}]},
    {"cue": "Tawanya keras", "d": -0.2, "trans": "cut",
     "actors": [B(1100, face=-1, keys=[{"at": 0, "pose": "hips", "expr": "laugh", "look": "cam"}, C("Terlalu keras untuk", 0.0, expr="happy", emote="sweat")])],
     "cam": [{"on": "bayu", "fit": 0.26, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.32, "sx": 800, "dur": 5}],
     "fx": [cap(1450, 190, "TERLALU KERAS, TERLALU CEPAT", bg="#6E2430", size=32, cue="Terlalu keras untuk", d=0.0)]},
    {"cue": "Rina tidak ikut tertawa", "d": -0.2, "trans": "cut",
     "actors": [R(1300, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": [-1, 0.1]}, C("Biasanya tawa itu", 0.0, expr="neutral")])],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 900}, {"at": 0, "on": "rina", "fit": 0.31, "sx": 900, "dur": 7}]},
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "UTANG BAYU · EPS 3/4",
     "hook": "Penagih Utang Menelepon ke Kantor, Satu Divisi Jadi Tahu", "day": "14", "month": "JULI", "marker": "SENIN · 14 JULI", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Makan siang yang ditolak
SB1 = stair(2)
A.append({"n": 4, "name": "Makan siang yang ditolak", "loc": "pantry", "music": "sad", "trans": "iris",
  "locOpt": {"time": "siang", "clock": "12:20"},
  "props": ptab(cups=1),
  "lines": [{"who": "rina", "from": "Ikut, Bay", "to": "Ikut, Bay", "text": "Ikut, Bay?", "maxW": 420, "size": 46, "min": 1.8},
            {"who": "bayu", "from": "Ada telepon vendor", "to": "Kamu duluan", "text": "Ada telepon vendor. Kamu duluan.", "label": "Bayu", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "actors": [R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}, C("Ikut, Bay", -0.2, pose="point", expr="happy")]), B(300, face=1, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0]}, {"at": 0.4, "x": 650, "dur": 1.5}])],
     "cam": [{"x": 1000, "y": 580, "zoom": 1.1}, {"at": 0, "x": 1060, "y": 580, "zoom": 1.2, "dur": 7}],
     "fx": [cap(560, 170, "SENIN · JAM MAKAN SIANG", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Bayu mengangkat ponsel", "d": -0.2, "trans": "cut",
     "actors": [B(650, face=1, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}, C("mengangguk pada telinga", 0.0, expr="happy", look=[0, 0]), C("Ada telepon vendor", 0.0, pose="shrug", expr="laugh")]),
                R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "confused", "look": [-1, 0.2]}])],
     "cam": [{"x": 1000, "y": 580, "zoom": 1.25}, {"at": 0, "x": 960, "y": 580, "zoom": 1.38, "dur": 6}]},
    {"cue": "Ia makan di tangga darurat", "d": -0.2, "trans": "whip", "loc": "lobi", "locOpt": TANGGA, "props": [],
     "actors": [B(SB1[0], y=SB1[1], face=-1, item="box", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}])],
     "cam": [{"x": 1300, "y": 640, "zoom": 1.3}, {"at": 0, "x": 1330, "y": 650, "zoom": 1.42, "dur": 6}],
     "fx": [cap(560, 170, "TANGGA DARURAT · SENDIRIAN", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Setiap kali langkah mendekat", "d": -0.2, "trans": "cut", "loc": "lobi", "locOpt": TANGGA, "props": [],
     "actors": [B(SB1[0], y=SB1[1], face=-1, item="box", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}, C("ia menunduk sampai", 0.0, expr="scared", emote="sweat")])],
     "cam": [{"on": "bayu", "fit": 0.3, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.36, "sx": 800, "dur": 8}],
     "fx": [cap(560, 190, "NASI PUTIH LAGI · TANPA KERUPUK", bg="#8E4A24", size=30, cue="Nasi putih lagi", d=0.0)]},
    {"cue": "Menutup utang dengan lelucon", "d": -0.2, "trans": "cut", "loc": "lobi", "locOpt": TANGGA, "props": [],
     "actors": [B(SB1[0], y=SB1[1], face=-1, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "tired", "look": "down"}])],
     "cam": [{"on": "bayu", "fit": 0.28, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.34, "sx": 800, "dur": 8}],
     "fx": [cap(560, 190, "HARI PERTAMA SEJAK LOBI MENDENGAR", bg="#6E2430", size=30, cue="Dan ini baru hari pertama", d=0.0)]},
  ]})

# 5 ------------------------------------------------------------------ Bekal tanpa nama
BEKAL = {"type": "bekal", "x": 1230, "y": 885, "layer": "front"}
A.append({"n": 5, "name": "Bekal tanpa nama", "loc": "kerja", "music": "warm", "trans": "fade",
  "locOpt": {"time": "siang", "clock": "12:35"},
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "shots": [
    {"at": 0, "actors": [D(-250, item="box", keys=[{"at": 0, "pose": "hold", "expr": "neutral"}, {"at": 0.2, "x": 1000, "dur": 3.0}])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1000, "y": 560, "zoom": 1.2, "dur": 7}],
     "fx": [cap(560, 170, "SENIN SIANG · MEJA BAYU KOSONG", bg=NAVY, col=YEL, at=0.4)]},
    insert("Nasi, telur, dan satu irisan", -0.3, {"type": "lunchBox", "openAt": C("Di tutupnya ada gambar kecil", -0.4), "chip": "TANPA NAMA · TANPA TULISAN", "chipAt": C("Tidak ada nama", 0.0)}, trans="zoom"),
    {"cue": "Dodi, dari gudang", "d": -0.2, "trans": "cut", "props": [CHAIR, desk(papers=1, laptop=1), BEKAL],
     "actors": [D(1000, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, C("sudah pergi sebelum", -0.6, x=-300, dur=3.2, face=-1)])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.1}, {"at": 0, "x": 860, "y": 560, "zoom": 1.2, "dur": 7}]},
    {"cue": "Ia tidak menitip pesan lewat Rina", "d": -0.2, "trans": "cut", "props": [CHAIR, desk(papers=1, laptop=1), BEKAL],
     "actors": [], "cam": [{"x": 1150, "y": 760, "zoom": 1.6}, {"at": 0, "x": 1180, "y": 780, "zoom": 1.85, "dur": 9}],
     "fx": [cap(560, 170, "TIDAK PERLU BAYU BERTERIMA KASIH DI DEPAN ORANG", bg="#13223D", col=YEL, size=28, cue="tidak perlu Bayu berterima kasih", d=0.0)]},
  ]})

# 6 ------------------------------------------------------------------ Empat mata
A.append({"n": 6, "name": "Empat mata", "loc": "pantry", "music": "warm", "trans": "fade", "pre": 0.5,
  "locOpt": PAN_R,
  "props": ptab(cups=2),
  "lines": [{"who": "rina", "from": "Kalau kamu mau cerita", "to": "disebar", "text": "Aku tidak bertanya buat disebar.", "maxW": 540, "size": 40},
            {"who": "bayu", "from": "Tujuh, Rin", "to": "Tujuh aplikasi", "text": "Tujuh, Rin. Tujuh aplikasi.", "label": "Bayu", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "actors": [R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"x": 1250, "y": 600, "zoom": 1.15}, {"at": 0, "x": 1280, "y": 610, "zoom": 1.28, "dur": 6}],
     "fx": [cap(560, 170, "SORE · PANTRY · LAMPU SETENGAH MATI", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Bayu berdiri di pintu", "d": -0.3, "trans": "cut",
     "actors": [B(240, face=1, keys=[{"at": 0, "pose": "idle", "expr": "sad", "look": "down"}, C("Lalu duduk", -0.2, x=960, dur=1.4, look=[1, 0]), C("Lalu duduk", 1.2, pose="sit")]),
                R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"x": 900, "y": 580, "zoom": 1.1}, C("Lalu duduk", -0.2, x=1100, y=590, zoom=1.2, dur=1.6)]},
    {"cue": "Ponselnya ia taruh telungkup", "d": -0.2, "trans": "cut", "props": ptab(cups=2, phone={}),
     "actors": [B(960, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}]), R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"x": 1150, "y": 640, "zoom": 1.3}, {"at": 0, "x": 1170, "y": 650, "zoom": 1.45, "dur": 6}]},
    {"cue": "Suaranya turun", "d": -0.2, "trans": "cut", "props": ptab(cups=2, phone={}),
     "actors": [B(960, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}, C("Maaf.", -0.2, expr="scared")]), R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"on": "bayu", "fit": 0.26, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.32, "sx": 800, "dur": 10}],
     "fx": [cap(1450, 190, "7 APLIKASI", bg=RED, size=40, cue="Tujuh aplikasi", d=0.0), cap(1450, 300, "GAJI MASUK, GAJI HABIS", bg="#6E2430", size=30, cue="Gaji masuk, gaji habis", d=0.0)]},
    {"cue": "Rina mengangguk", "d": -0.2, "trans": "cut", "props": ptab(cups=2, phone={}),
     "actors": [R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [-1, 0.2]}, C("Yang satu melihat", 0.0, expr="neutral")])],
     "cam": [{"on": "rina", "fit": 0.27, "sx": 900}, {"at": 0, "on": "rina", "fit": 0.32, "sx": 900, "dur": 7}],
     "fx": [cap(560, 190, "YANG SATU MELIHAT. YANG SATU MENGAKU.", bg=NAVY, col=YEL, size=30, cue="Yang satu melihat", d=0.0)]},
  ]})

# 7 ------------------------------------------------------------------ Permintaan paling mendesak
A.append({"n": 7, "name": "Permintaan yang paling mendesak", "loc": "pantry", "music": "tense", "musicCut": 2.0, "trans": "cut", "post": 0.4, "hold": 1.6,
  "locOpt": PAN_R,
  "props": ptab(cups=2),
  "lines": [{"who": "bayu", "from": "Yang ini paling mepet", "to": "Nanti beres semua", "text": "Yang ini saja, Rin. Nanti beres semua.", "label": "Bayu", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "actors": [B(960, item="phone", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0]}]), R(1500, item="cup", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"x": 1250, "y": 620, "zoom": 1.15}, {"at": 0, "x": 1280, "y": 630, "zoom": 1.28, "dur": 5}]},
    insert("Satu tagihan ditandai merah", -2.0, {"type": "billNote", "rowsAt": 0.3, "per": 0.22, "markAt": C("Satu tagihan ditandai merah", 0.0), "chip": "PALING MEPET", "chipAt": C("Yang ini paling mepet", 0.0)}, trans="whip"),
    {"cue": "Kalimat beres itu lagi", "d": -0.2, "trans": "cut",
     "actors": [B(960, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0]}, C("Rina membuka dompet", 0.0, expr="happy")]), R(1500, item="pocketbook", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}])],
     "cam": [{"x": 1250, "y": 620, "zoom": 1.25}, {"at": 0, "x": 1270, "y": 630, "zoom": 1.38, "dur": 5}]},
    insert("Uang kertasnya terlihat", -0.4, {"type": "walletClose", "chip": "DOMPET TERBUKA", "chipAt": 1.6}, trans="zoom"),
    {"cue": "Bayu menarik napas", "d": -0.2, "trans": "cut",
     "actors": [B(960, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0]}, C("Ia belum menutup dompet", 0.0, expr="sad")]), R(1500, item="pocketbook", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}])],
     "cam": [{"x": 1250, "y": 620, "zoom": 1.25}, {"at": 0, "x": 1270, "y": 630, "zoom": 1.38, "dur": 9}]},
  ]})

# 8 ------------------------------------------------------------------ Dompet ditutup
A.append({"n": 8, "name": "Dompet ditutup", "loc": "pantry", "music": "sad", "trans": "cut", "pre": 0.2,
  "locOpt": PAN_R,
  "props": ptab(cups=2),
  "lines": [{"who": "rina", "from": "Aku tidak bisa meminjamkan uang", "to": "jalan keluar", "text": "Aku tidak bisa meminjamkan uang. Tapi aku mau bantu cari jalan keluar.", "maxW": 600, "size": 34},
            {"who": "bayu", "from": "Kalau gitu, jangan bilang", "to": "mau bantu", "text": "Kalau gitu, jangan bilang mau bantu.", "label": "Bayu", "maxW": 560, "size": 40}],
  "shots": [
    dict({"at": 0, "fx": [{"type": "walletClose", "at": 0, "closeAt": 0.6, "chip": "DOMPET DITUTUP", "chipAt": 1.4, "chipBg": RED}]}, **NOLOC),
    {"cue": "Aku tidak bisa meminjamkan uang", "d": -0.4, "trans": "cut",
     "actors": [B(960, keys=[{"at": 0, "pose": "sit", "expr": "shock", "look": [1, 0]}, C("Bayu tertawa sekali", 0.0, expr="laugh", pose="shrug")]), R(1500, item="pocketbook", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [-1, 0.2]}, C("Aku tidak bisa meminjamkan uang", 0.0, item=None, expr="neutral")])],
     "cam": [{"x": 1250, "y": 620, "zoom": 1.2}, {"at": 0, "x": 1270, "y": 630, "zoom": 1.32, "dur": 8}]},
    {"cue": "Ia berdiri. Kursi bergeser", "d": -0.2, "trans": "cut",
     "actors": [B(960, keys=[{"at": 0, "pose": "sit", "expr": "angry", "look": [1, 0]}, C("Ia berdiri. Kursi bergeser", 0.0, pose="idle", face=-1), C("Ia pergi", 0.0, x=250, dur=2.0)]), R(1500, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [-1, 0.2]}])],
     "cam": [{"x": 1000, "y": 580, "zoom": 1.1}, C("Ia pergi", 0.0, x=800, y=580, zoom=1.2, dur=2.0)]},
    {"cue": "Di ambang pintu", "d": -0.2, "trans": "cut",
     "actors": [B(250, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "sad", "look": [1, 0.1]}, C("Rina menggeleng", -0.4, face=-1, look=[-1, 0]), C("Rina menggeleng", 0.8, x=-300, dur=1.4)]), R(1500, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [-1, 0.2]}, C("Rina menggeleng", 0.0, expr="neutral")])],
     "cam": [{"x": 900, "y": 580, "zoom": 1.05}, {"at": 0, "x": 960, "y": 580, "zoom": 1.15, "dur": 8}]},
    {"cue": "Menolong, kali ini", "d": -0.2, "trans": "cut",
     "actors": [R(1500, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": "down"}])],
     "cam": [{"on": "rina", "fit": 0.27, "sx": 900}, {"at": 0, "on": "rina", "fit": 0.32, "sx": 900, "dur": 7}],
     "fx": [cap(560, 190, "MENOLONG ≠ MENGISI LUBANG YANG SAMA", bg=NAVY, col=YEL, size=30, cue="bukan berarti mengisi lubang", d=0.0)]},
  ]})

# 9 ------------------------------------------------------------------ Kotak nasi yang akhirnya dibuka
A.append({"n": 9, "name": "Kotak nasi yang akhirnya dibuka", "loc": "kerja", "music": "sad", "trans": "fade", "pre": 0.5,
  "locOpt": {"time": "malam", "clock": "19:40"},
  "props": [CHAIR, desk(papers=1, laptop=1), BEKAL],
  "shots": [
    {"at": 0, "actors": [B(-250, face=1, keys=[{"at": 0, "x": -250}, {"at": 0.3, "x": 980, "dur": 3.0, "expr": "sad"}])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.08}, {"at": 0, "x": 960, "y": 560, "zoom": 1.18, "dur": 7}],
     "fx": [cap(560, 170, "MALAMNYA · KANTOR SEPI", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Bayu membuka tutupnya", "d": -0.4, "trans": "cut", "props": [],
     "actors": [], "useLoc": False, "fx": [{"type": "lunchBox", "openAt": 0.5, "chip": "GAMBAR TOPI ORANYE", "chipAt": C("Gambar topi oranye", 0.0)}]},
    {"cue": "Ia makan tiga suap", "d": -0.2, "trans": "cut",
     "actors": [B(980, face=1, item="box", keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}, C("Di ujung lorong, Dodi", 0.0, look=[1, 0])]),
                back(D(2250, face=-1, size=470, keys=[{"at": 0, "x": 2250}, C("Di ujung lorong, Dodi", 0.0, x=1750, dur=2.0), C("tidak masuk", 0.0, x=2300, dur=2.0)]))],
     "cam": [{"x": 1250, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1300, "y": 560, "zoom": 1.2, "dur": 8}]},
    insert("Bayu mengetik pesan untuk Rina", -0.2, {"type": "msgDraft", "typeAt": 0.9, "cps": 12, "delAt": C("Tetap saja ia menghapusnya", 0.0), "offAt": C("Layarnya mati", 0.0), "chip": "TIDAK TERKIRIM", "chipAt": C("Tetap saja ia menghapusnya", 0.4), "chipBg": RED}, trans="zoom"),
    {"cue": "Besok masih ada", "d": -0.2, "trans": "cut",
     "actors": [B(980, face=1, keys=[{"at": 0, "pose": "idle", "expr": "sad", "look": "down"}])],
     "cam": [{"on": "bayu", "fit": 0.27, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.33, "sx": 800, "dur": 6}]},
  ]})

# 10 ----------------------------------------------------------------- Yang tidak ia sembunyikan lagi, sedikit
A.append({"n": 10, "name": "Selasa pagi, satu kalimat", "loc": "pantry", "music": "hope", "trans": "iris",
  "locOpt": {"time": "pagi", "clock": "08:30"},
  "props": ptab(cups=1),
  "lines": [{"who": "rekan", "from": "Kemarin telepon apa, Bay", "to": "Kemarin telepon apa, Bay", "text": "Kemarin telepon apa, Bay?", "maxW": 480, "size": 40},
            {"who": "bayu", "from": "Urusan pribadi", "to": "aku bereskan", "text": "Urusan pribadi. Lagi aku bereskan.", "label": "Bayu", "maxW": 540, "size": 42}],
  "shots": [
    {"at": 0, "actors": [B(2150, face=-1, item="box", keys=[{"at": 0, "x": 2150, "pose": "idle", "expr": "neutral"}, {"at": 0.3, "x": 1250, "dur": 2.6}])],
     "cam": [{"x": 1200, "y": 580, "zoom": 1.1}, {"at": 0, "x": 1240, "y": 580, "zoom": 1.2, "dur": 7}],
     "fx": [cap(560, 170, "SELASA PAGI · SEBELUM DIPANGGIL", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Saat seseorang bertanya", "d": -0.4, "trans": "cut",
     "actors": [B(1250, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}, C("ia tidak tertawa", 0.0, expr="neutral"), C("Urusan pribadi", 0.0, expr="sad")]),
                {"who": "rekan", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "happy", "look": [1, 0]}]}],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 1000, "y": 560, "zoom": 1.28, "dur": 7}]},
    {"cue": "Tidak ada cerita yang ia lempar", "d": -0.2, "trans": "cut",
     "actors": [B(1250, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": "down"}]),
                back({"who": "rina", "x": 420, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0]}, C("Ia tidak tersenyum lebar", 0.0, expr="happy")]})],
     "cam": [{"x": 900, "y": 560, "zoom": 1.05}, {"at": 0, "x": 860, "y": 560, "zoom": 1.15, "dur": 9}],
     "fx": [cap(1450, 190, "TIDAK ADA NAMA APLIKASI. TIDAK ADA ANGKA.", bg=NAVY, col=YEL, size=28, cue="tidak ada angka", d=0.0)]},
    {"cue": "Orang yang berhenti menyembunyikan", "d": -0.2, "trans": "cut",
     "actors": [back({"who": "rina", "x": 420, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "happy", "look": [1, 0]}]}), B(1250, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "tired", "look": "down"}])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.05}, {"at": 0, "x": 900, "y": 560, "zoom": 1.12, "dur": 6}],
     "fx": [cap(1450, 190, "MULAI DARI SATU KALIMAT YANG TIDAK LUCU", bg=GREEN, size=28, cue="satu kalimat yang tidak lucu", d=0.0)]},
  ]})

# 11 ----------------------------------------------------------------- Dodi tidak menagih terima kasih
A.append({"n": 11, "name": "Dodi tidak menagih terima kasih", "loc": "gudang", "music": "warm", "trans": "whip",
  "locOpt": {"boxes": [[1800, 2]], "bench": 1100},
  "props": [{"type": "box16", "x": 1600, "y": 1000, "w": 220, "h": 150, "label": "RADIO"}, {"type": "radio16", "x": 1600, "y": 850, "on": True}],
  "shots": [
    {"at": 0, "actors": [D(900, item="box", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}])],
     "cam": [{"x": 1100, "y": 580, "zoom": 1.1}, {"at": 0, "x": 1150, "y": 580, "zoom": 1.2, "dur": 6}],
     "fx": [cap(560, 170, "GUDANG · RADIO KECIL MENYALA PELAN", bg=NAVY, col=YEL, at=0.4)]},
    insert("Ponselnya bergetar", -0.2, {"type": "photoMsg", "msgAt": 0.6, "chip": "FOTO TUTUP KOTAK · TANPA TEKS", "chipAt": C("Tidak ada tulisan", 0.0)}, trans="zoom"),
    {"cue": "Dodi mengangguk pada layar", "d": -0.2, "trans": "cut",
     "actors": [D(900, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": "down"}, C("Dodi mengangguk pada layar", 0.2, expr="happy"), C("Ia mengangkat kardus", 0.0, item="box", pose="hold", expr="neutral", look=[1, 0])])],
     "cam": [{"on": "dodi", "fit": 0.27, "sx": 800}, {"at": 0, "on": "dodi", "fit": 0.32, "sx": 800, "dur": 7}]},
    {"cue": "Menolong, bagi Dodi", "d": -0.2, "trans": "cut",
     "actors": [D(900, item="box", keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": [1, 0]}])],
     "cam": [{"x": 1100, "y": 580, "zoom": 1.1}, {"at": 0, "x": 1150, "y": 580, "zoom": 1.15, "dur": 5}],
     "fx": [cap(560, 190, "TIDAK PERLU DIUMUMKAN DI GRUP", bg=NAVY, col=YEL, size=30, cue="tidak perlu diumumkan", d=0.0)]},
  ]})

# 12 ----------------------------------------------------------------- Kartu pelajaran
A.append({"n": 12, "name": "Kartu pelajaran", "loc": "pantry", "music": "warm", "trans": "iris", "post": 3.0,
  "locOpt": {"time": "sore", "clock": "17:40"},
  "shots": [{"at": 0, "blur": 9, "actors": [R(300, face=1, size=600, keys=[{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: kalau utang", pose="pointUp"), C("Dua: cerita pada", pose="hips", expr="proud"),
                 C("Tiga: jangan menutup", pose="pointUp", expr="happy", item="thumb", jump=50), C("Tiga: jangan menutup", 2.8, pose="wave", item=None), C("Rina menolak", pose="hips", expr="neutral")])],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 14}],
     "fx": [{"type": "lesson", "cue": "Jadi, apa", "d": 0.8, "items": [{"cue": "Satu: kalau utang", "text": "Utang mengganggu kerja? Jangan sembunyi"},
            {"cue": "Dua: cerita pada", "text": "Cerita pada yang bisa membantu, empat mata"}, {"cue": "Tiga: jangan menutup", "text": "Jangan tutup utang lama dengan pinjaman teman"}]}]}]})

# 13 ----------------------------------------------------------------- Cuplikan Eps 4 + layar akhir
PINTU = {"type": "officeDoor", "x": 1500, "y": 1000, "label": "KEPALA OPERASIONAL"}
A.append({"n": 13, "name": "Cuplikan Eps 4 + layar akhir", "loc": "kerja", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": {"time": "pagi", "clock": "09:08"},
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "shots": [
    {"at": 0, "actors": [B(keys=[{"at": 0, "pose": "idle", "expr": "tired", "look": "down"}, C("Di layarnya, ruang Pak Hendra", 0.0, expr="scared", look=[1, 0])])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 1040, "y": 560, "zoom": 1.28, "dur": 6}],
     "fx": [cap(560, 170, "SELASA, 15 JULI · 09.10", bg=NAVY, col=YEL, at=0.4)]},
    insert("telepon mejanya berdering sekali", -0.2, {"type": "callScreen", "name": "RUANG PAK HENDRA", "sub": "telepon internal", "ch": "H", "col": NAVY, "rings": [0.4], "chip": "PANGGILAN INTERNAL", "chipAt": 1.6, "chipBg": RED}, trans="zoom"),
    {"cue": "Bayu berdiri. Lorong itu", "d": -0.2, "trans": "whip", "loc": "lorong", "locOpt": {}, "props": [PINTU],
     "actors": [B(-250, face=1, keys=[{"at": 0, "x": -250}, {"at": 0.3, "x": 1050, "dur": 4.4, "expr": "scared"}, C("Ia mengetuk", 0.0, pose="idle", look=[1, 0])])],
     "cam": [{"x": 900, "y": 560, "zoom": 1.05}, {"at": 0, "x": 1250, "y": 560, "zoom": 1.15, "dur": 6}]},
    {"cue": "Dari dalam, ", "d": -0.4, "trans": "cut", "loc": "lorong", "locOpt": {}, "props": [PINTU],
     "actors": [B(1250, face=1, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [1, 0]}, C("Pintu itu tertutup", -0.2, x=1450, dur=0.8)])],
     "cam": [{"x": 1300, "y": 560, "zoom": 1.2}, {"at": 0, "x": 1360, "y": 560, "zoom": 1.32, "dur": 5}],
     "fx": [cap(560, 170, "\"MASUK. TUTUP PINTUNYA.\"", bg="#6E2430", size=40, cue="Masuk. Tutup pintunya", d=0.0)]},
    {"cue": "Dari luar, tidak ada yang bisa", "d": -0.2, "trans": "cut", "loc": "lorong", "locOpt": {}, "props": [PINTU], "actors": [],
     "cam": [{"x": 1500, "y": 560, "zoom": 1.5}, {"at": 0, "x": 1500, "y": 570, "zoom": 1.7, "dur": 6}]},
    {"cue": "Saksikan akhir cerita ini", "d": -0.2, "trans": "flash", "blur": 8, "loc": "lorong", "locOpt": {}, "props": [PINTU], "actors": [],
     "cam": [{"x": 1500, "y": 560, "zoom": 1.2}, {"at": 0, "x": 1500, "y": 570, "zoom": 1.25, "dur": 4}],
     "fx": [{"type": "card", "at": 0.1, "text": "UTANG BAYU · EPS 4", "tag": "SATU RUANGAN. SATU PINTU TERTUTUP.", "size": 90, "bg": "#6E2430"}]},
    {"cue": "Kalau cerita ini", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di komentar"), "nextQuote": "\"Masuk.\"", "nextSub": "pintu tertutup", "nextTitle": "Utang Bayu · Eps 4",
             "nextWho": "bayu", "nextKey": {"pose": "sit", "expr": "scared"}, "nextThumb": False, "playlist": "Utang Bayu", "playlistEps": "Eps 1 · 2 · 3 · 4",
             "ask": "Pernahkah kamu menolong teman tanpa meminjamkan uang? Tulis di komentar!"}]},
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
ep = {"slug": "kantor-11", "title": "Penagih Utang Menelepon ke Kantor, Satu Divisi Jadi Tahu | Kantor Tangani: Utang Bayu Eps 3",
      "series": "Kantor Tangani", "story": "Utang Bayu", "eps": "3/4", "month": "JULI", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "Bisik-bisik"], [4, "Makan sendiri"], [6, "Empat mata"], [8, "Dompet ditutup"], [9, "Kotak nasi"], [12, "Pelajaran"], [13, "Episode berikutnya"]],
      "parts": [["Pembuka & masalah", 0, 3], ["Memburuk", 3, 5], ["Berubah", 5, 7], ["Episode berikutnya", 7, 8]],
      "lessons": ["Kalau utang mulai mengganggu kerja, jangan ditutup dengan lelucon.",
                  "Cerita pada orang yang bisa membantu, empat mata, bukan pada satu ruangan.",
                  "Jangan menutup utang lama dengan pinjaman dari teman."],
      "youtube": {
        "desc": "Satu telepon dari penagihan ke lobi kantor, dan satu divisi sudah mendengar. Bayu tertawa terlalu keras, makan sendirian di tangga darurat, lalu mengaku pada Rina: tujuh aplikasi. Rina menolak meminjamkan uang, tapi menawarkan jalan keluar. Episode ketiga Kantor Tangani: Utang Bayu. Cerita fiksi, bukan nasihat keuangan.",
        "ask": "Pernahkah kamu menolong teman tanpa meminjamkan uang? Tulis di kolom komentar.",
        "next": "Utang Bayu Eps 4: Terjerat 7 Aplikasi Paylater Sampai Gaji Habis. Begini Bayu Bebas.",
        "tags": "kantor tangani, utang bayu, cerita kantor, animasi kantor, penagih utang, paylater, pinjaman online, utang teman, menolong tanpa meminjamkan uang, dunia kerja, Tangani Talenta",
        "hashtags": "#KantorTangani #UtangBayu #duniakerja",
        "adAfter": 7},
      "thumb": {"kind": "utang3", "lines": ["PENAGIH MENELEPON", "KE KANTOR,"], "hl": "SATU DIVISI TAHU", "lineSize": 76, "hlSize": 82, "badge": "EPS 3/4", "tag": "KANTOR TANGANI · UTANG BAYU"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
