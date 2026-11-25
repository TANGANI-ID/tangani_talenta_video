#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-05 (Klien Terbesar Eps 1: "Klien terbesar mengamuk di lobi").
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}.
Bagian split (layar terbelah) tidak diubah shot_local(): kunci di dalamnya memakai cue atau at=0."""
import json, re, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-05/episode.json"
NASKAH = "youtube/serial/ep05-naskah.md"

def C(cue, d=None, **kw):
    o = {"cue": cue}
    if d is not None: o["d"] = d
    o.update(kw); return o

CHAIR = {"type": "chair16", "x": 830, "y": 1000}
def desk(**kw):
    o = {"type": "deskR", "x": 1210, "y": 1000}; o.update(kw); return o
def rina_sit(**kw):
    o = {"who": "rina", "x": 850, "face": 1}; o.update(kw); return o
def cap(x, y, text, bg="#13223D", col=None, **kw):
    o = {"type": "chip", "text": text, "x": x, "y": y, "bg": bg}
    if col: o["col"] = col
    o.update(kw); return o
def card(cue, text, d=0.1, **kw):
    o = {"type": "card", "cue": cue, "d": d, "style": "small", "text": text, "x": 1380, "y": 210, "size": 50}; o.update(kw); return o
NOLOC = {"actors": [], "useLoc": False}
def insert(cue, d, fx, trans="zoom", **kw):
    o = dict(cue=cue, d=d, trans=trans, **NOLOC); o["fx"] = fx if isinstance(fx, list) else [fx]; o.update(kw); return o
RATNA_DESK = {"who": "ratna", "x": 1330, "y": 950, "layer": "back", "face": -1, "size": 580}
def ratna_desk(**kw):
    o = dict(RATNA_DESK); o.update(kw); return o

# lobi: meja resepsionis di depan Mbak Wulan, tangga ke lantai 2 di kanan (anak tangga terbawah x=1600)
SX0 = 1600
LOBI = {"time": "pagi", "deskX": 1100, "deskFront": True, "stairs": SX0, "slamX": -230}
def step(i):
    return SX0 + i * 70 + 35, 1000 - (i + 1) * 50
def stairs_down(t0, to_step=-1, per=0.24, end_x=None, end_dur=0.7):
    """Kunci turun tangga: dari bordes (x 2250, y 650) ke anak tangga to_step (-1 = lantai), lalu (opsional) jalan ke end_x."""
    keys = [{"at": 0, "x": 2260, "y": 650, "face": -1}, {"at": t0, "x": step(6)[0], "dur": per * 2}]
    t = t0 + per * 2
    for i in range(5, to_step - 1 if to_step >= 0 else -1, -1):
        x, y = step(i); keys.append({"at": round(t, 2), "x": x, "dur": per}); keys.append({"at": round(t + per * .5, 2), "y": y}); t += per
    if to_step < 0:
        keys.append({"at": round(t, 2), "x": SX0 - 60, "dur": per}); keys.append({"at": round(t + per * .5, 2), "y": 1000}); t += per
        if end_x is not None:
            keys.append({"at": round(t, 2), "x": end_x, "dur": end_dur}); t += end_dur
    return keys, t
WULAN = lambda **kw: dict({"who": "resepsionis", "x": 1000, "y": 930, "layer": "back", "face": -1, "size": 520}, **kw)
TOKO = {"time": "pagi", "fill": 0.15, "counterX": 900}

extras = {
    "wijaya": {"nama": "Pak Wijaya (klien, 11 toko + 1 baru)", "look": {"hat": "kopiah", "hatColor": "#1E1A18", "mustache": True, "hairColor": "#8A8A8A", "shirt": "#8E4A24", "pants": "#2C2433", "skin": "c"}},
    "resepsionis": {"nama": "Mbak Wulan (resepsionis)", "look": {"hair": "hijab", "hijab": "#C2691F", "shirt": "#FFFDF8", "jacket": "#13223D", "pants": "#2C2433", "skin": "d", "idcard": "#C2691F"}},
}

A = []

# 1 ------------------------------------------------------------------ PEMBUKA DINGIN: lobi, Senin 08.10
rk, rt = stairs_down(0.1, per=0.22, end_x=1380, end_dur=0.8)
A.append({"n": 1, "name": "Lobi: itu bukan bagian saya", "loc": "lobi", "music": "tense", "pre": 0.5, "post": 1.0, "trans": "cut",
  "locOpt": dict(LOBI, slam=C("menggebrak meja", 0.15), slam2=C("jauh lebih buruk", 0.0)),
  "lines": [{"who": "wijaya", "from": "Siapa yang bertanggung", "to": "di sini", "text": "Siapa yang bertanggung jawab di sini?!", "label": "Pak Wijaya", "kind": "shout", "maxW": 700, "size": 44},
            {"who": "rina", "from": "Maaf, Pak", "to": "bagian saya", "text": "Maaf, Pak. Itu bukan bagian saya.", "maxW": 560, "size": 42}],
  "shots": [
    {"at": 0, "actors": [WULAN(keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [-1, 0.3]}, C("Pak Wijaya, klien", expr="neutral", look=[-1, 0]),
                                     C("menggebrak meja", 0.1, x=1080, dur=0.4, pose="scared", expr="scared", emote="!")]),
                         {"who": "wijaya", "x": -300, "face": 1, "size": 640, "keys": [{"at": 0, "expr": "angry"}, {"at": 2.8, "x": 640, "dur": 2.6}, C("menggebrak meja", -0.35, pose="point", expr="angry"),
                          C("menggebrak meja", 0.5, pose="hips"), C("Siapa yang bertanggung", -0.1, pose="shrug", expr="angry", emote="anger")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.02}, {"at": 0, "x": 1050, "y": 520, "zoom": 1.08, "dur": 4}, C("Pak Wijaya, klien", x=820, y=520, zoom=1.22, dur=1.6),
             C("menggebrak meja", 0.15, shake=14), C("Siapa yang bertanggung", -0.2, on="wijaya", fit=0.25, sx=760, dur=0.5, ease="back", shake=8)],
     "sfx": [C("menggebrak meja", 0.15, type="thud", vol=1.0)],
     "fx": [cap(1460, 170, "SENIN · 08.10 · LOBI", col="#F6C343", at=0.4, out=C("Pak Wijaya, klien", -0.2)),
            {"type": "nameTag", "cue": "Pak Wijaya, klien", "d": 0.3, "name": "Pak Wijaya", "role": "Klien terbesar · 11 toko", "x": 1180, "y": 800, "out": C("Siapa yang bertanggung", -0.3)}]},
    {"cue": "Rina buru-buru", "d": -0.2, "trans": "cut",
     "actors": [WULAN(x=1080, keys=[{"at": 0, "pose": "scared", "expr": "scared", "look": [1, -0.5]}, C("Itu bukan bagian", 0.3, expr="shock", look=[-1, 0])]),
                {"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry", "look": [1, -0.3]}, C("Dan kalimat pertama", pose="hips", look=[1, 0]),
                 C("Itu bukan bagian", 0.6, expr="angry", emote="anger")]},
                {"who": "rina", "x": 2260, "y": 650, "face": -1, "keys": rk + [{"at": rt + 0.1, "pose": "idle", "expr": "happy", "emote": "sweat"},
                 C("Maaf, Pak", pose="talk", expr="happy"), C("Itu bukan bagian", pose="shrug", expr="happy")]}],
     "cam": [{"x": 1300, "y": 480, "zoom": 1.12}, {"at": 0.6, "x": 1150, "y": 500, "zoom": 1.12, "dur": 2.2}, C("Dan kalimat pertama", x=1010, y=520, zoom=1.14, dur=1.6)],
     "fx": [cap(1500, 170, "RINA · LAYANAN PELANGGAN", bg="#5B7DB1", at=0.6, out=C("Dan kalimat pertama", 0))]},
    {"cue": "Dalam tiga detik", "d": -0.15, "trans": "cut",
     "actors": [{"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry", "emote": "anger"}, C("jauh lebih buruk", -0.35, pose="point", expr="angry"),
                 C("jauh lebih buruk", 0.4, pose="shrug")]},
                {"who": "rina", "x": 1380, "face": -1, "keys": [{"at": 0, "pose": "shrug", "expr": "scared", "emote": "sweat"}]}],
     "cam": [{"on": "wijaya", "fit": 0.28, "sx": 820}, {"at": 0, "on": "wijaya", "fit": 0.34, "sx": 820, "dur": 2.0}, C("jauh lebih buruk", 0.0, shake=16)],
     "grade": {"tint": "rgba(170,40,24,.10)"},
     "sfx": [C("jauh lebih buruk", 0.0, type="thud", vol=1.0)],
     "fx": [{"type": "freeze", "cue": "jauh lebih buruk", "d": 0.35, "text": "3 DETIK. JAUH LEBIH BURUK.", "x": 1300, "y": 880, "size": 42}]},
  ]})

# 2 ------------------------------------------------------------------ JUDUL
A.append({"n": 2, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "KLIEN TERBESAR · EPS 1/4",
     "hook": "Klien Terbesar Mengamuk di Lobi, Rina Malah Membela Diri", "day": "8", "month": "JUNI", "marker": "SENIN · 08.10", "markerAt": 2.9}]}]})

# 3 ------------------------------------------------------------------ Meja Rina, seminggu sebelumnya
A.append({"n": 3, "name": "Klien terbesar", "loc": "kerja", "music": "light", "trans": "iris",
  "locOpt": {"time": "pagi", "clock": "08:30"},
  "shots": [
    {"at": 0, "actors": [rina_sit(item="folder", keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.3]}, C("Ini Rina", expr="laugh", look="cam", emote="sparkle"),
                          C("perusahaan penyedia", expr="happy", look=[1, 0.3]), C("Rina dipercaya", expr="proud"), C("Pak Wijaya, pemilik", expr="laugh", look=[1, 0.4])])],
     "props": [CHAIR, desk(cups=1, laptop=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "on": "rina", "fit": 0.21, "sx": 760, "dur": 3}, C("Bulan ini", x=1080, y=520, zoom=1.12, dur=2.2)],
     "fx": [{"type": "month", "at": 0.2, "hold": 3.5, "day": "1", "text": "JUNI"}, cap(1500, 190, "SEMINGGU SEBELUMNYA", bg="#5E5A62", at=0.5, out=C("Ini Rina", 0.5)),
            {"type": "nameTag", "cue": "Ini Rina", "d": 0.2, "name": "Rina", "role": "Layanan pelanggan · PT Tangani Digital Automasi", "x": 110, "y": 800, "out": C("Bulan ini", -0.2)},
            cap(1450, 200, "WIJAYA · 12 TOKO", bg="#6E2430", cue="Rina dipercaya", d=0.1, out=C("Pak Wijaya, pemilik", -0.3)),
            card("klien terbesar kantor", "Klien terbesar kantor!", d=0.0, x=1400, y=340, size=44, out=C("Pak Wijaya, pemilik", -0.3))]},
    insert("Pak Wijaya, pemilik", -0.3, {"type": "storeMap", "litAt": C("sebelas toko", 0.0), "per": 0.27, "newAt": C("Kamis ini", 0.2), "title": "Toko Wijaya",
            "chip": "SEMUA PAKAI KASIR TANGANI", "chipAt": C("aplikasi kasir Tangani", 0.0), "chipBg": "#2F6F73"}, trans="zoom"),
    {"cue": "Rina sudah membayangkan", "d": -0.2, "trans": "whip",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "think", "expr": "laugh", "emote": "sparkle", "look": [0.4, -0.7]}, {"at": 2.6, "pose": "sit", "expr": "proud", "look": [1, 0.4]}])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"on": "rina", "fit": 0.22, "sx": 800}, {"at": 0, "on": "rina", "fit": 0.25, "sx": 800, "dur": 3}, C("Ia bahkan menempel", x=1100, y=520, zoom=1.2, dur=1.4)],
     "fx": [card("Rina sudah membayangkan", "Foto peresmian, Kamis!", d=0.2, x=1400, y=200, size=46, out=C("Ia bahkan menempel", -0.2)),
            cap(1450, 200, "JADWAL: KAMIS 08.00 · TOKO KE-12", bg="#D9483B", cue="Ia bahkan menempel", d=0.4, size=34)]},
    {"cue": "Klien besar, toko baru", "d": -0.2, "trans": "cut",
     "actors": [rina_sit(item="folder", keys=[{"at": 0, "pose": "sit", "expr": "proud", "look": [1, 0.4]}, {"at": 1.6, "expr": "happy", "look": "cam"}]),
                {"who": "sinta", "x": -320, "face": 1, "item": "notebook", "keys": [{"at": 0, "x": 470, "dur": 1.9, "expr": "neutral"}, {"at": 2.0, "pose": "hold", "expr": "neutral", "look": [1, 0.5]},
                 {"at": 3.4, "x": -400, "dur": 2.2, "face": -1, "pose": "idle"}]}],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 860, "y": 520, "zoom": 1.16, "dur": 4}],
     "fx": [card("Semuanya terdengar", "Semuanya terdengar sempurna.", d=0.1, x=1400, y=200, size=46),
            {"type": "nameTag", "at": 1.4, "name": "Sinta", "role": "Koordinator tim", "x": 110, "y": 800, "out": C("Semuanya terdengar", 0.2)}]},
  ]})

# 4 ------------------------------------------------------------------ Lobi: keluhan Pak Wijaya
A.append({"n": 4, "name": "Saya tidak peduli bagian siapa", "loc": "lobi", "music": "tense", "trans": "whip",
  "locOpt": LOBI,
  "lines": [{"who": "wijaya", "from": "Toko saya buka Kamis", "to": "Toko saya buka Kamis", "text": "Toko saya buka Kamis!", "kind": "shout", "min": 1.6, "shots": [2]},
            {"who": "rina", "from": "Pengiriman itu diurus", "to": "layanan pelanggan", "text": "Pengiriman itu urusan gudang, Pak.", "maxW": 560, "size": 42},
            {"who": "wijaya", "from": "Saya tidak peduli bagian", "to": "buka atau tidak", "text": "Saya tidak peduli bagian siapa!", "kind": "shout", "maxW": 620, "size": 42},
            {"who": "rina", "from": "Nanti saya cek", "to": "dulu, ya, Pak", "text": "Nanti saya cek dulu, ya, Pak.", "maxW": 560, "size": 42},
            {"who": "wijaya", "from": "Nanti itu kapan", "to": "Nanti itu kapan", "text": "Nanti itu kapan?!", "kind": "shout", "min": 1.8}],
  "shots": [
    {"at": 0, "actors": [WULAN(x=1080, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [-1, 0]}]),
                         {"who": "wijaya", "x": 640, "face": 1, "size": 640, "item": "phone", "keys": [{"at": 0, "pose": "hold", "expr": "angry", "look": [1, 0]}, {"at": 0.9, "pose": "point", "expr": "angry"}]},
                         {"who": "rina", "x": 1380, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "scared", "look": [-1, 0.3]}]}],
     "cam": [{"x": 1010, "y": 520, "zoom": 1.1}, {"at": 0, "x": 880, "y": 520, "zoom": 1.22, "dur": 3}]},
    insert("Kardus yang datang", -0.2, {"type": "boxPhoto", "stickerAt": C("tipe mini", -0.2), "chip": "PESANAN: TIPE BESAR", "chipAt": C("Yang saya pesan", 0.2), "chipBg": "#3BA36B",
            "chip2": "UNTUK KASIR YANG RAMAI", "chip2At": C("untuk kasir yang ramai", 0.0), "chip2Bg": "#13223D"}, trans="zoom"),
    {"cue": "Toko saya buka Kamis", "d": -0.15, "trans": "flash", "loc": "tokobaru", "locOpt": TOKO,
     "actors": [{"who": "wijaya", "x": 1320, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "shrug", "expr": "angry", "look": "cam"}]}],
     "cam": [{"x": 1150, "y": 480, "zoom": 1.05}, {"at": 0, "x": 1000, "y": 480, "zoom": 1.12, "dur": 2.2}],
     "fx": [cap(560, 170, "KILAS · TOKO KE-12", bg="#5E5A62", at=0.1), cap(560, 290, "BUKA KAMIS!", bg="#D9483B", at=0.4)]},
    {"cue": "Rina mencoba menjelaskan", "d": -0.2, "trans": "flash",
     "actors": [WULAN(x=1080, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [-1, 0]}]),
                {"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}, C("Mata Pak Wijaya", expr="angry", look=[1, 0.1]),
                 C("Saya tidak peduli bagian", pose="shrug", expr="angry", emote="anger"), C("Saya peduli toko", pose="hips")]},
                {"who": "rina", "x": 1380, "face": -1, "keys": [{"at": 0, "pose": "talk", "expr": "neutral"}, C("Pengiriman itu diurus", pose="point", face=1, expr="neutral"),
                 C("Saya hanya layanan", pose="shrug", face=-1, expr="happy"), C("Saya tidak peduli bagian", pose="scared", expr="shock", emote="!")]}],
     "cam": [{"x": 1010, "y": 520, "zoom": 1.1}, {"at": 0, "x": 1100, "y": 520, "zoom": 1.16, "dur": 3}, C("Mata Pak Wijaya", on="wijaya", fit=0.26, sx=820, dur=0.8),
             C("Saya peduli toko", x=1010, y=520, zoom=1.12, dur=1.2)],
     "fx": [cap(1650, 330, "GUDANG →", bg="#5E5A62", cue="Pengiriman itu diurus", d=0.4, out=C("Mata Pak Wijaya", -0.2))]},
    {"cue": "Rina menambahkan", "d": -0.2, "trans": "cut",
     "actors": [WULAN(x=1080, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [1, 0]}]),
                {"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}, C("Nanti itu kapan", -0.1, pose="shrug", expr="angry", emote="anger")]},
                {"who": "rina", "x": 1380, "face": -1, "keys": [{"at": 0, "pose": "talk", "expr": "scared", "emote": "sweat"}, C("Nanti itu kapan", pose="scared", expr="shock", emote="!"),
                 C("Rina tidak punya", pose="sad", expr="sad", look="down")]}],
     "cam": [{"on": "rina", "fit": 0.24, "sx": 1150}, {"at": 0, "on": "rina", "fit": 0.27, "sx": 1150, "dur": 2.5}, C("Nanti itu kapan", -0.2, x=1010, y=520, zoom=1.14, dur=0.5, ease="back", shake=6),
             C("Rina tidak punya", on="rina", fit=0.28, sx=1100, dur=1.2)]},
  ]})

# 5 ------------------------------------------------------------------ Pak Wijaya pergi; Sinta mencatat
sk, st = stairs_down(0.0, to_step=4, per=0.26)
SINTA_STAIRS = [sk[0]] + [dict({kk: vv for kk, vv in k.items() if kk != "at"}, cue="Dan dari ujung", d=round(k["at"] - 0.3, 2)) for k in sk[1:]]
A.append({"n": 5, "name": "Saya kira kalian beda", "loc": "lobi", "music": "sad", "trans": "cut",
  "locOpt": LOBI,
  "lines": [{"who": "wijaya", "from": "Saya kira kalian", "to": "penyedia lain", "text": "Saya kira kalian beda.", "maxW": 560, "size": 44},
            {"who": "rina", "from": "Apa yang sedang Sinta", "to": "Kesalahannya barusan", "text": "Kesalahanku barusan?", "kind": "think", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "actors": [WULAN(x=1300, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [-1, 0]}]),
                         {"who": "wijaya", "x": 640, "face": 1, "size": 640, "item": "keys", "keys": [{"at": 0, "pose": "hold", "expr": "angry", "look": [1, -0.2]}, {"at": 1.4, "x": 380, "dur": 1.4, "face": -1, "pose": "idle"},
                          C("Di depan pintu kaca", 0.4, face=1, pose="hips", expr="angry"), C("Saya kira kalian", pose="shrug", expr="sad"), C("Lalu ia pergi", 0.1, x=-420, dur=1.5, face=-1, pose="idle", expr="angry")]},
                         {"who": "rina", "x": 1150, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "scared", "look": [-1, 0]}, C("Saya kira kalian", expr="sad"), C("Lalu ia pergi", 0.6, pose="sad", expr="sad", look="down")]}],
     "cam": [{"x": 820, "y": 520, "zoom": 1.08}, {"at": 0.8, "x": 700, "y": 520, "zoom": 1.16, "dur": 2.5}, C("Saya kira kalian", -0.2, on="wijaya", fit=0.24, sx=700, dur=0.8), C("Lalu ia pergi", x=860, y=520, zoom=1.06, dur=1.6)],
     "fx": [cap(1480, 170, "KUNCI MOBIL · PINTU KACA", col="#F6C343", at=0.4, out=C("Di depan pintu kaca", 0.3))]},
    {"cue": "Rina berdiri di tengah", "d": -0.2, "trans": "cut",
     "actors": [WULAN(x=1000, keys=[{"at": 0, "pose": "idle", "expr": "sad", "look": [1, 0]}]),
                {"who": "rina", "x": 1150, "face": 1, "keys": [{"at": 0, "pose": "sad", "expr": "sad", "look": "down"}, C("Dan dari ujung", 0.4, look=[1, -0.5], expr="scared"),
                 C("Sinta membuka buku", 0.3, expr="shock", emote="!", look=[1, -0.5]), C("Rina menunduk", pose="sad", expr="sad", look="down", emote="sweat")]},
                {"who": "sinta", "x": 2260, "y": 650, "face": -1, "keys": SINTA_STAIRS + [C("Sinta membuka buku", -0.2, pose="hold", item="notebook", expr="neutral", look=[-1, 0.5]), C("lalu menulis sesuatu", pose="think", expr="neutral", look=[0, 0.6])]}],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.0}, {"at": 0, "x": 1150, "y": 520, "zoom": 1.08, "dur": 2}, C("Dan dari ujung", x=1300, y=500, zoom=1.1, dur=1.4)],
     "fx": [{"type": "nameTag", "cue": "koordinator timnya", "d": 0.2, "name": "Sinta", "role": "Koordinator tim", "x": 110, "y": 800, "out": C("Rina menunduk", -0.2)},
            cap(1500, 170, "BUKU CATATAN KUNING", bg="#F6C343", col="#13223D", cue="lalu menulis sesuatu", d=0.0, out=C("Rina menunduk", -0.1))]},
    {"cue": "Rina menunduk", "d": -0.2, "trans": "cut",
     "actors": [{"who": "rina", "x": 1150, "face": 1, "keys": [{"at": 0, "pose": "sad", "expr": "sad", "look": "down", "emote": "sweat"}, {"at": 1.6, "pose": "think", "look": [1, -0.4]}]}],
     "cam": [{"on": "rina", "fit": 0.22, "sx": 820}, {"at": 0, "on": "rina", "fit": 0.25, "sx": 820, "dur": 4}],
     "grade": {"tint": "rgba(200,60,40,.10)"}},
  ]})

# 6 ------------------------------------------------------------------ Ruang Pak Hendra: intinya apa?
HEN = {"who": "hendra", "x": 1400, "y": 950, "layer": "back", "face": -1, "size": 600}
A.append({"n": 6, "name": "Intinya apa, Rin?", "loc": "bos", "music": "tense", "trans": "iris",
  "locOpt": {"time": "pagi", "deskX": 1300, "folder": True},
  "lines": [{"who": "hendra", "from": "Intinya apa", "to": "Intinya apa, Rin", "text": "Intinya apa, Rin?", "label": "Pak Hendra", "min": 2.2, "size": 46},
            {"who": "hendra", "from": "Pak Wijaya tidak butuh", "to": "siapa yang salah", "text": "", "bubble": "none"},
            {"who": "hendra", "from": "Ia butuh tokonya", "to": "Selesaikan hari ini", "text": "", "bubble": "none"}],
  "shots": [
    {"at": 0, "actors": [dict(HEN, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "angry"}, {"at": 1.3, "pose": "sit", "item": None, "expr": "neutral", "look": [-1, 0]},
                               C("Katanya, staf", pose="point", expr="angry"), C("Rina mulai menjelaskan", pose="sit", expr="neutral"), C("Pak Hendra mengangkat", pose="wave", expr="neutral"),
                               C("Rina terdiam", pose="sit", expr="neutral")]),
                         {"who": "rina", "x": -260, "face": 1, "keys": [{"at": 0.1, "x": 620, "dur": 1.6, "expr": "scared"}, {"at": 1.8, "pose": "idle", "expr": "scared"},
                          C("Rina mulai menjelaskan", pose="point", face=-1, expr="neutral"), C("soal pengiriman", pose="talk", face=1), C("soal siapa", pose="shrug", expr="neutral"),
                          C("Intinya apa", pose="scared", expr="shock", emote="!"), C("Rina terdiam", pose="sad", expr="sad", look="down")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, {"at": 1.0, "x": 1050, "y": 520, "zoom": 1.12, "dur": 3}, C("Ternyata Pak Wijaya", on="hendra", fit=0.23, sx=1150, dur=1.2),
             C("Rina mulai menjelaskan", x=1000, y=520, zoom=1.1, dur=1.0), C("Intinya apa", -0.3, on="hendra", fit=0.27, sx=1150, dur=0.6, ease="back"),
             C("Rina terdiam", on="rina", fit=0.26, sx=760, dur=1.0)],
     "fx": [cap(560, 160, "10 MENIT KEMUDIAN · RUANG PAK HENDRA", bg="#3B2418", at=0.3, out=C("Ternyata Pak Wijaya", -0.2)),
            cap(560, 160, "PAK WIJAYA MENELEPON DARI MOBIL", bg="#D9483B", cue="Ternyata Pak Wijaya", d=0.2, out=C("Rina mulai menjelaskan", -0.2)),
            card("Katanya, staf", "\"Katanya: itu bukan urusan saya.\"", d=0.1, x=560, y=310, size=42, maxW=760, out=C("Rina mulai menjelaskan", -0.2)),
            cap(700, 150, "GUDANG", bg="#5E5A62", cue="soal gudang", d=0.0, out=C("Intinya apa", -0.2)),
            cap(1080, 240, "PENGIRIMAN", bg="#5E5A62", cue="soal pengiriman", d=0.0, out=C("Intinya apa", -0.2)),
            cap(760, 330, "SIAPA INPUT PESANAN?", bg="#5E5A62", cue="soal siapa", d=0.0, out=C("Intinya apa", -0.2))]},
    {"cue": "Pak Wijaya tidak butuh", "d": -0.2, "trans": "cut",
     "actors": [dict(HEN, keys=[{"at": 0, "pose": "talk", "expr": "neutral", "look": [-1, 0]}, C("Ia butuh tokonya", pose="shrug", expr="neutral"), C("Selesaikan hari ini", pose="point", expr="angry")]),
                {"who": "rina", "x": 620, "face": 1, "keys": [{"at": 0, "pose": "sad", "expr": "sad"}, C("Selesaikan hari ini", 0.3, pose="idle", expr="scared", emote="!")]}],
     "cam": [{"on": "hendra", "fit": 0.22, "sx": 1150}, {"at": 0, "on": "hendra", "fit": 0.25, "sx": 1150, "dur": 4}, C("Selesaikan hari ini", x=1000, y=520, zoom=1.12, dur=1.0)],
     "fx": [card("Pak Wijaya tidak butuh", "Bukan soal siapa yang salah.", d=0.2, x=520, y=200, size=46, out=C("Ia butuh tokonya", -0.2)),
            card("Ia butuh tokonya", "Toko buka Kamis. Selesaikan hari ini.", d=0.1, x=560, y=200, size=44, maxW=760)]},
  ]})

# 7 ------------------------------------------------------------------ Ruang kaca Bu Ratna: apa yang ia dengar?
A.append({"n": 7, "name": "Apa yang ia dengar?", "loc": "kaca", "music": "warm", "trans": "iris",
  "locOpt": {"view": "dalam", "time": "pagi", "deskX": 1240},
  "lines": [{"who": "ratna", "from": "Tadi kamu bilang", "to": "ke Pak Wijaya", "text": "Tadi kamu bilang apa?", "label": "Bu Ratna", "side": -0.3, "size": 44},
            {"who": "rina", "from": "Rina mengulang", "to": "kalimatnya", "text": "\"Itu bukan bagian saya.\"", "maxW": 560, "size": 42, "min": 1.8},
            {"who": "ratna", "from": "Menurutmu, apa", "to": "dari kalimat itu", "text": "Apa yang dia dengar dari kalimatmu?", "side": -0.3, "maxW": 620, "size": 42},
            {"who": "rina", "from": "Bahwa saya tidak", "to": "tidak peduli", "text": "Bahwa saya tidak peduli.", "maxW": 560, "size": 42}],
  "shots": [
    {"at": 0, "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("Bu Ratna sempat meraih", pose="phone", item="phone", expr="neutral"), C("Lalu ia menaruhnya", pose="sit", item=None, expr="neutral"),
                          C("Ini klien Rina", expr="happy"), C("Tadi kamu bilang", pose="talk", expr="neutral"), C("Rina mengulang", pose="sit", expr="neutral"), C("Menurutmu, apa", pose="think", expr="neutral"),
                          C("Bu Ratna mengangguk", pose="sit", expr="happy")]),
                         {"who": "rina", "x": -260, "face": 1, "keys": [{"at": 0.1, "x": 700, "dur": 1.8, "expr": "scared"}, {"at": 2.0, "pose": "idle", "expr": "scared"},
                          C("Rina mengulang", pose="talk", expr="sad"), C("Rina menelan ludah", pose="idle", expr="scared", emote="sweat"), C("Bahwa saya tidak", pose="sad", expr="sad", look="down")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, {"at": 2.0, "x": 1000, "y": 520, "zoom": 1.12, "dur": 3}, C("Bu Ratna sempat meraih", on="ratna", fit=0.23, sx=1150, dur=1.0),
             C("Ini klien Rina", x=1000, y=520, zoom=1.1, dur=1.0), C("Menurutmu, apa", on="ratna", fit=0.24, sx=1150, dur=1.0), C("Rina menelan ludah", on="rina", fit=0.24, sx=760, dur=1.0),
             C("Bu Ratna mengangguk", x=1000, y=520, zoom=1.1, dur=1.0)],
     "fx": [{"type": "taps", "x": 1000, "y": 720, "word": "tok", "sound": "knock", "times": [{"at": 2.3}, {"at": 2.6}]},
            cap(1520, 160, "RUANG BU RATNA · 08.40", at=0.3, out=C("Bu Ratna sempat meraih", -0.2)),
            card("Ini klien Rina", "Ini klien Rina.", d=0.0, x=520, y=200, out=C("Tadi kamu bilang", -0.2))]},
    insert("Orang yang marah", -0.2, [{"type": "boardWrite", "title": "Orang yang marah butuh:", "skin": "#C98B62", "marker": "#C2691F",
            "lines": [{"text": "DENGAR", "at": C("Didengar sampai", -0.2), "x": 300, "y": 470, "size": 130, "col": "#C2691F", "dur": 0.7},
                      {"text": "sampai habis", "at": C("Didengar sampai", 0.5), "x": 1000, "y": 450, "size": 56, "col": "#6B7280", "dur": 0.6},
                      {"text": "AKUI", "at": C("Masalahnya diakui", -0.2), "x": 300, "y": 660, "size": 130, "col": "#C2691F", "dur": 0.6},
                      {"text": "masalahnya", "at": C("Masalahnya diakui", 0.5), "x": 1000, "y": 640, "size": 56, "col": "#6B7280", "dur": 0.6},
                      {"text": "JAM", "at": C("Dan tahu jam", -0.1), "x": 300, "y": 850, "size": 130, "col": "#D9483B", "dur": 0.5, "box": True},
                      {"text": "kapan beres", "at": C("masalahnya beres", 0.0), "x": 1000, "y": 830, "size": 56, "col": "#6B7280", "dur": 0.6}]},
            card("Penjelasan bisa", "Penjelasan bisa menunggu.", d=0.1, x=1350, y=180, size=44)], trans="zoom"),
  ]})

# 8 ------------------------------------------------------------------ Menelepon lagi (titik tegang)
A.append({"n": 8, "name": "Bicara.", "loc": "kerja", "music": "tense", "musicCut": 2.0, "trans": "fade", "post": 0.4, "hold": 1.6,
  "locOpt": {"time": "pagi", "clock": "09:05"},
  "shots": [
    {"at": 0, "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.4]}, C("Ia memutar ulang", pose="think", expr="sad", look=[0.4, -0.6])])],
     "props": [CHAIR, desk(cups=1, laptop=1)],
     "cam": [{"x": 950, "y": 520, "zoom": 1.06}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 800, "dur": 4}],
     "fx": [cap(1500, 170, "MEJA RINA · 09.05", col="#F6C343", at=0.3)]},
    {"cue": "Setiap kali ia menjelaskan", "d": -0.2, "trans": "flash", "loc": "lobi", "locOpt": LOBI,
     "actors": [{"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "shrug", "expr": "angry"}, {"at": 1.2, "pose": "hips", "expr": "angry", "emote": "anger"}, {"at": 2.4, "pose": "shrug"}]},
                {"who": "rina", "x": 1380, "face": -1, "keys": [{"at": 0, "pose": "point", "face": 1, "expr": "neutral"}, {"at": 1.4, "pose": "talk", "face": -1, "expr": "scared"}]}],
     "cam": [{"on": "wijaya", "fit": 0.24, "sx": 860}, {"at": 0, "on": "wijaya", "fit": 0.31, "sx": 860, "dur": 3.2}, C("makin marah", 0.0, shake=10)],
     "fx": [{"type": "flashback"}, cap(1460, 300, "MAKIN MARAH", bg="#D9483B", cue="makin marah", d=0.0)]},
    insert("Bu Ratna di catatan", -0.2, {"type": "stickyMove", "lines": ["DENGAR", "AKUI", "JAM"], "writeAt": 2.1, "circleAt": 99}, trans="zoom"),
    insert("Lalu ia menekan", -0.2, {"type": "callScreen", "rings": [C("sekali", -0.1), C("dua kali", -0.1), C("tiga kali", -0.1)], "connectAt": C("Lalu suara berat", 0.0),
            "voiceAt": C("Bicara", -0.05), "voice": "\"Bicara.\"", "chip": "PANGGILAN KEDUA", "chipAt": 0.4}, trans="whip"),
    {"cue": "Hanya satu kata", "d": -0.3, "trans": "cut",
     "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": [1, -0.1]}, C("Tangan Rina dingin", emote="sweat"), C("Ini kesempatan", expr="neutral", look="cam")])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"on": "rina", "fit": 0.25, "sx": 860}, {"at": 0, "on": "rina", "fit": 0.36, "sx": 880, "dur": 6.5, "ease": "lin"}],
     "grade": {"tint": "rgba(20,20,60,.22)"},
     "fx": [card("Ini kesempatan", "Kesempatan kedua.", d=0.1, x=1400, y=220, size=48), card("Dan mungkin yang terakhir", "Mungkin yang terakhir.", d=0.1, x=1400, y=380, size=44)]},
    {"atE": 1.6, "trans": "cut", "actors": [], "useLoc": False, "loc": "hitam", "noHeader": True},
  ]})

# 9 ------------------------------------------------------------------ Telepon kedua (layar terbelah)
RINA_L = {"loc": "kerja", "locOpt": {"time": "pagi", "clock": "09:07"}, "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)]}
TOKO_R = {"loc": "tokobaru", "locOpt": dict(TOKO, fill=0.6)}
A.append({"n": 9, "name": "Telepon kedua", "loc": "kerja", "music": "hope", "trans": "fade", "pre": 0.8,
  "locOpt": {"time": "pagi", "clock": "09:07"},
  "lines": [{"who": "wijaya", "from": "Pak Wijaya menumpahkan", "to": "sudah disebar", "text": "", "bubble": "none"},
            {"who": "rina", "from": "Iya, Pak", "to": "Iya, Pak", "text": "Iya, Pak.", "min": 1.8, "size": 44},
            {"who": "rina", "from": "Jadi, toko kedua", "to": "Saya minta maaf", "text": "", "bubble": "none"},
            {"who": "rina", "from": "Jam tiga sore ini", "to": "siap buka", "text": "", "bubble": "none"},
            {"who": "wijaya", "from": "Oke", "to": "Jam tiga", "n2": 2, "text": "Oke. Jam tiga.", "label": "Pak Wijaya", "min": 2.2, "size": 44}],
  "shots": [
    {"at": 0, "split": [
       dict(RINA_L, actors=[rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared"}, C("Ia mendengarkan", expr="neutral", look=[1, 0.2]),
                             C("Pak Wijaya menumpahkan", expr="sad"), C("Rina hanya berkata", pose="phone", expr="neutral"), C("dan mencatat", item="notebook", pose="sit", expr="neutral", look=[1, 0.5])])],
            cam=[{"x": 900, "y": 540, "zoom": 1.15}, C("Satu menit", x=880, y=540, zoom=1.28, dur=8)]),
       dict(TOKO_R, actors=[{"who": "wijaya", "x": 880, "y": 950, "layer": "back", "face": -1, "size": 600, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "angry"},
                             C("karyawan yang sudah", pose="shrug", expr="angry"), C("rak yang sudah", pose="point", face=1, expr="angry"), C("undangan peresmian", pose="hips", face=-1, expr="angry", emote="anger"),
                             C("Rina hanya berkata", pose="phone", expr="angry"), C("Setelah Pak Wijaya berhenti", pose="phone", expr="neutral")]}],
            cam=[{"x": 1000, "y": 520, "zoom": 1.0}, C("Pak Wijaya menumpahkan", x=980, y=500, zoom=1.12, dur=6)])],
     "fx": [{"type": "listenTimer", "cue": "Ia mendengarkan", "d": 0.0, "t1": C("Rina hanya berkata", 0.0), "from": 30, "to": 185, "x": 960, "y": 110, "label": "DENGAR"},
            cap(1700, 240, "KARYAWAN SUDAH DIREKRUT", bg="#6E2430", size=28, cue="karyawan yang sudah", d=0.0),
            cap(1700, 340, "RAK SUDAH DIISI", bg="#6E2430", size=28, cue="rak yang sudah diisi", d=0.0),
            cap(1700, 440, "UNDANGAN SUDAH DISEBAR", bg="#6E2430", size=28, cue="undangan peresmian", d=0.0),
            {"type": "nameTag", "at": 0.6, "name": "Pak Wijaya", "role": "Toko ke-12 · rak masih kosong", "x": 1010, "y": 800, "out": C("Satu menit", 0.5)}]},
    {"cue": "Setelah Pak Wijaya berhenti", "d": -0.2, "trans": "whip",
     "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [1, 0.1]}, C("Bapak benar", expr="sad"), C("Lalu ia menyebut", expr="proud")])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"on": "rina", "fit": 0.19, "sx": 430}, {"at": 0, "on": "rina", "fit": 0.21, "sx": 430, "dur": 12, "ease": "lin"}],
     "fx": [{"type": "steps", "x": 1300, "y": 300, "gap": 220, "w": 1000, "title": "TELEPON KEDUA",
             "items": [{"cue": "Rina mengulang intinya", "text": "Ulang intinya"}, {"cue": "Bapak benar", "text": "Akui dampaknya"}, {"cue": "Lalu ia menyebut", "text": "Langkah + jam pasti"}]},
            cap(430, 160, "KAMIS 08.00 · KASIR TAK BISA DIPAKAI", bg="#13223D", size=28, cue="Jadi, toko kedua", d=0.2, out=C("Bapak benar", -0.2))]},
    {"cue": "Jam tiga sore ini", "d": -0.2, "trans": "whip", "split": [
       dict(RINA_L, actors=[rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "proud", "look": [1, 0.1]}, C("Hening", expr="scared", look=[1, 0]), C("Oke", 0.4, expr="laugh", emote="sparkle")])],
            cam=[{"x": 1030, "y": 540, "zoom": 1.2}, C("Hening", x=1000, y=540, zoom=1.3, dur=3)]),
       dict(TOKO_R, actors=[{"who": "wijaya", "x": 880, "y": 950, "layer": "back", "face": -1, "size": 600, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "angry"},
                             C("Hari Rabu teknisi", expr="neutral"), C("Kamis pagi, toko", expr="neutral", look=[1, 0]), C("Hening", pose="think", expr="neutral"), C("Oke", pose="phone", expr="neutral")]}],
            cam=[{"x": 960, "y": 500, "zoom": 1.1}, C("Hening", x=920, y=500, zoom=1.22, dur=3)])],
     "fx": [cap(640, 150, "15.00 · KABAR PENGIRIMAN", bg="#C2691F", size=30, cue="Jam tiga sore ini", d=0.3),
            cap(640, 250, "RABU · TEKNISI PASANG", bg="#C2691F", size=30, cue="Hari Rabu teknisi", d=0.0),
            cap(640, 350, "KAMIS · SIAP BUKA", bg="#3BA36B", size=30, cue="Kamis pagi, toko", d=0.0)]},
  ]})

# 10 ----------------------------------------------------------------- Bukti di formulir pesanan (kejutan tengah)
A.append({"n": 10, "name": "Formulir pesanan", "loc": "kerja", "music": "light", "trans": "iris",
  "locOpt": {"time": "siang", "clock": "11:20"},
  "shots": [
    {"at": 0, "actors": [rina_sit(keys=[{"at": 0, "pose": "type", "expr": "neutral", "look": [1, 0.3]}])],
     "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.06}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 820, "dur": 4}],
     "fx": [cap(1480, 170, "SAMBIL MENUNGGU · 11.20", col="#F6C343", at=0.3)]},
    insert("membuka formulir", 0.2, {"type": "orderForm", "hlAt": 99, "whoAt": 99}, trans="zoom"),
    {"cue": "Dan ia tertegun", "d": -0.2, "trans": "cut",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "shock", "emote": "!", "look": [1, 0.3]}])],
     "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
     "cam": [{"on": "rina", "fit": 0.27, "sx": 900, "shake": 6}, {"at": 0, "on": "rina", "fit": 0.31, "sx": 900, "dur": 1.6}]},
    insert("Di kolom tipe", -0.3, {"type": "orderForm", "hlAt": C("mini.", -0.3), "whoAt": C("Yang mengisinya Fitri", 0.4),
            "verdict": "TANGANI TIDAK SALAH KIRIM", "verdictAt": C("Jadi, Tangani tidak", 0.1)}, trans="cut"),
    insert("Jarinya langsung", -0.2, {"type": "draftChat", "dragAt": C("Jarinya langsung", 0.2), "typeAt": C("Ia mengetik pesan", 0.4), "cps": 13,
            "holdAt": C("Lalu ia berhenti", 0.0)}, trans="whip"),
    {"cue": "Kalau pesan itu", "d": -0.2, "trans": "cut",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "think", "expr": "neutral", "look": [1, 0.2]}, {"at": 1.8, "expr": "sad", "look": [0.3, -0.6]}])],
     "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
     "cam": [{"on": "rina", "fit": 0.23, "sx": 820}, {"at": 0, "on": "rina", "fit": 0.27, "sx": 820, "dur": 4}],
     "fx": [card("Kalau pesan itu", "Apa yang akan Pak Wijaya dengar?", d=0.2, x=1380, y=200, size=44, maxW=700)]},
    insert("Ia menghapusnya", -0.3, {"type": "draftChat", "dragAt": -9, "typeAt": -9, "delAt": C("Ia menghapusnya", 0.1), "delCps": 50, "saveAt": C("Benar belum tentu", -0.1),
            "saveChip": "SIMPAN DULU"}, trans="cut"),
    {"cue": "Benar belum tentu", "d": 0.6, "trans": "fade",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]}, C("Bereskan dulu", pose="type", expr="proud")])],
     "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.06}, {"at": 0, "x": 920, "y": 520, "zoom": 1.14, "dur": 4}],
     "fx": [{"type": "card", "cue": "Benar belum tentu", "d": 0.7, "text": "Benar belum tentu tepat waktunya.", "size": 66, "maxW": 1200, "y": 330, "out": C("Bereskan dulu", 1.2)}]},
  ]})

# 11 ----------------------------------------------------------------- Jam tiga, janji ditepati
A.append({"n": 11, "name": "Jam tiga tepat", "loc": "kerja", "music": "hope", "trans": "whip",
  "locOpt": {"time": "siang", "clock": "13:40"},
  "lines": [{"who": "bayu", "from": "Santai, Rin", "to": "pagi berangkat", "text": "Santai, Rin! Besok jam tujuh berangkat.", "label": "Bayu", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "split": [
       {"loc": "kerja", "locOpt": {"time": "siang", "clock": "13:40"}, "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
        "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": [1, 0.1]}, C("Unit tipe besar sudah", expr="happy"), C("pagi berangkat", expr="laugh", emote="sparkle")])],
        "cam": [{"x": 900, "y": 540, "zoom": 1.18}, C("Santai, Rin", x=880, y=540, zoom=1.26, dur=5)]},
       {"loc": "kerja", "locOpt": {"time": "siang", "clock": "13:40", "clockWall": False}, "props": [{"type": "chair16", "x": 830, "y": 1000, "col": "#2F6F73"}, desk(cups=3, laptop=1, photo=False)],
        "actors": [{"who": "bayu", "x": 850, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "happy"}, C("Santai, Rin", pose="pointUp", item="thumb", expr="laugh"),
                    C("pagi berangkat", 0.3, pose="phone", item="phone", expr="happy")]}],
        "cam": [{"x": 950, "y": 520, "zoom": 1.1}, C("Santai, Rin", x=930, y=520, zoom=1.2, dur=4)]}],
     "fx": [{"type": "nameTag", "cue": "sahabatnya", "d": 0.0, "name": "Bayu", "role": "Tim operasional", "x": 1000, "y": 800, "out": C("Santai, Rin", -0.2)},
            cap(1440, 170, "UNIT TIPE BESAR: SIAP", bg="#3BA36B", size=32, cue="Unit tipe besar sudah", d=0.3)]},
    insert("Tepat jam tiga", -0.2, {"type": "clockClose", "time": "15:00", "label": "15.00", "sub": "Tepat seperti janji"}, trans="whip"),
    insert("Unit berangkat besok", -0.6, {"type": "chat16", "name": "Pak Wijaya", "sub": "Toko Wijaya · online", "ch": "W",
            "msgs": [{"t": 0.3, "me": True, "text": "Pak, unit tipe besar berangkat besok jam 07.00. Teknisi pasang Rabu jam 10.00. Saya kabari lagi besok sore.", "time": "15.00", "read": C("Ia akan mengabari", 0.6)},
                     {"t": C("satu jempol", 0.0), "thumb": True, "time": "15.02"}],
            "chip": "GENCATAN SENJATA", "chipAt": C("gencatan senjata", -0.2), "chipBg": "#13223D"}, trans="zoom"),
  ]})

# 12 ----------------------------------------------------------------- Sore: fakta disampaikan dengan tenang
A.append({"n": 12, "name": "Fakta, setelah tenang", "loc": "kerja", "music": "warm", "trans": "iris",
  "locOpt": {"time": "sore", "clock": "16:30"},
  "lines": [{"who": "rina", "from": "Pak, supaya toko", "to": "formulir pesanannya", "text": "Supaya toko berikutnya aman, Pak.", "maxW": 520, "size": 40},
            {"who": "wijaya", "from": "Fitri salah pilih", "to": "Pantas", "text": "Fitri salah pilih. Pantas.", "label": "Pak Wijaya", "maxW": 560, "size": 42},
            {"who": "wijaya", "from": "Mbak Rina, lain kali", "to": "ke saya, ya", "text": "Lain kali cek ulang ke saya, ya.", "maxW": 600, "size": 42},
            {"who": "wijaya", "from": "Dan terima kasih", "to": "mau mendengar", "text": "Terima kasih sudah mendengar.", "maxW": 600, "size": 42}],
  "shots": [
    {"at": 0, "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]}, C("Bukan untuk membela", pose="phone", expr="neutral")])],
     "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 800, "dur": 6}],
     "fx": [cap(1480, 170, "SORE · 16.30", col="#F6C343", at=0.3), card("Bukan untuk membela", "Bukan untuk membela diri.", d=0.2, x=1400, y=320, size=46)]},
    {"cue": "Pak, supaya toko", "d": -0.2, "trans": "whip", "split": [
       {"loc": "kerja", "locOpt": {"time": "sore", "clock": "16:31"}, "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
        "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [1, 0.1]}])],
        "cam": [{"x": 900, "y": 540, "zoom": 1.18}, C("formulir pesanannya", x=880, y=540, zoom=1.24, dur=3)]},
       {"loc": "tokobaru", "locOpt": dict(TOKO, time="sore", fill=0.8),
        "actors": [{"who": "wijaya", "x": 880, "y": 950, "layer": "back", "face": -1, "size": 600, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "neutral"}, C("formulir pesanannya", pose="hold", expr="neutral", look="down")]}],
        "cam": [{"x": 960, "y": 500, "zoom": 1.1}, C("formulir pesanannya", x=930, y=500, zoom=1.18, dur=3)]}]},
    insert("Pak Wijaya membaca", -0.2, {"type": "chat16", "name": "Rina · Tangani", "sub": "online", "ch": "R", "col": "#D9483B",
            "msgs": [{"t": -2.5, "img": "form", "text": "Pak, supaya toko berikutnya aman, ini formulir pesanannya.", "time": "16.31"}], "chip": "DIPESAN: FITRI", "chipAt": 1.4, "chipBg": "#6E2430"}, trans="zoom"),
    {"cue": "Lalu ia menghela", "d": -0.2, "trans": "cut", "loc": "tokobaru", "locOpt": dict(TOKO, time="sore", fill=0.8),
     "actors": [{"who": "wijaya", "x": 880, "y": 950, "layer": "back", "face": -1, "size": 600, "item": "phone", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"},
                 {"at": 0.5, "pose": "facepalm", "item": None, "expr": "sad"}, C("Fitri salah pilih", pose="shrug", expr="sad"), C("Ia diam sebentar", pose="think", expr="neutral"),
                 C("Mbak Rina, lain kali", pose="phone", item="phone", expr="neutral"), C("Dan terima kasih", expr="happy")]}],
     "cam": [{"on": "wijaya", "fit": 0.22, "sx": 1000}, {"at": 0, "on": "wijaya", "fit": 0.24, "sx": 1000, "dur": 5}, C("Ia diam sebentar", x=960, y=480, zoom=1.12, dur=1.4)],
     "fx": [cap(560, 170, "TOKO KE-12 · SORE", bg="#5E5A62", at=0.3, out=C("Fitri salah pilih", -0.2))]},
    {"cue": "Di seberang ruangan", "d": -0.2, "trans": "whip", "loc": "kerja", "locOpt": {"time": "sore", "clock": "16:40"},
     "actors": [{"who": "rina", "x": 1250, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "happy", "look": [1, 0.2]}, C("Rina masih belum tahu", 0.2, pose="sit", item=None, expr="confused", emote="?", look=[-1, -0.1])]},
                {"who": "sinta", "x": 480, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0.3]}, C("menutup buku", item=None, pose="idle", expr="proud", look=[1, 0])]}],
     "props": [{"type": "chair16", "x": 1230, "y": 1000}, desk(x=1610, cups=2, laptop=1, sticky=1)],
     "cam": [{"x": 950, "y": 520, "zoom": 1.06}, {"at": 0, "x": 900, "y": 520, "zoom": 1.14, "dur": 3}, C("Rina masih belum tahu", on="rina", fit=0.22, sx=1100, dur=1.4)],
     "fx": [cap(560, 170, "BUKU KUNING DITUTUP", bg="#F6C343", col="#13223D", cue="menutup buku", d=0.2, out=C("Rina masih belum tahu", -0.2))]},
  ]})

# 13 ----------------------------------------------------------------- Kartu pelajaran
A.append({"n": 13, "name": "Kartu pelajaran", "loc": "lobi", "music": "warm", "trans": "iris", "post": 1.2,
  "locOpt": {"time": "pagi", "deskX": 1250},
  "shots": [
    {"at": 0, "blur": 9, "actors": [{"who": "rina", "x": 300, "size": 600, "face": 1, "keys": [{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: dengarkan", pose="pointUp"),
                 C("Dua: akui", pose="hips", expr="proud"), C("Tiga: fakta", pose="pointUp", expr="laugh", item="thumb", jump=30)]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 18}],
     "fx": [{"type": "lesson", "cue": "Satu: dengarkan", "d": -0.6, "items": [{"cue": "Satu: dengarkan", "text": "Dengarkan sampai tuntas, tanpa membela diri"},
            {"cue": "Dua: akui", "text": "Akui dampaknya, lalu janjikan langkah dan jam pasti"}, {"cue": "Tiga: fakta", "text": "Sampaikan fakta setelah suasana tenang"}]}]},
    insert("Klien yang marah", -0.3, [{"type": "sticky", "lines": ["DENGAR", "AKUI", "JAM"], "writeAt": -5, "circleAt": 99},
            card("Klien yang marah", "Klien yang marah bukan musuh.", d=0.2, x=1430, y=170, size=42, maxW=700)], trans="fade"),
    {"cue": "Ia sedang takut", "d": -0.2, "trans": "fade", "loc": "tokobaru", "locOpt": dict(TOKO, time="sore", fill=0.15, banner=True),
     "actors": [{"who": "wijaya", "x": 1350, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "hips", "expr": "sad", "look": [-1, -0.4]}, {"at": 1.4, "pose": "think", "expr": "sad"}]}],
     "cam": [{"x": 1150, "y": 500, "zoom": 1.08}, {"at": 0, "x": 1220, "y": 500, "zoom": 1.18, "dur": 4}],
     "fx": [card("Ia sedang takut", "Ia sedang takut kehilangan sesuatu.", d=0.2, x=620, y=200, size=46, maxW=820)]},
  ]})

# 14 ----------------------------------------------------------------- Malam di halte, lega yang singkat
HALTE = {"time": "senja"}
A.append({"n": 14, "name": "Halte: hanya ada satu Tangani", "loc": "halte", "music": "night", "trans": "fade",
  "locOpt": HALTE,
  "lines": [{"who": "rina", "from": "itu bukan bagian saya", "to": "itu bukan bagian saya", "text": "Itu bukan bagian saya.", "min": 2.4, "size": 42, "maxW": 520},
            {"who": "bayu", "from": "Tuh kan", "to": "aman!", "text": "Tuh kan. Aman!", "label": "Bayu", "min": 2.0, "size": 44}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 880, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "sit", "expr": "happy", "look": [0.4, 0.6]}]},
                         {"who": "bayu", "x": 1200, "face": -1, "item": "phone", "keys": [{"at": 0, "pose": "sit", "expr": "happy", "look": [-0.3, 0.6]}]}],
     "cam": [{"x": 1040, "y": 520, "zoom": 1.08}, {"at": 0, "x": 980, "y": 540, "zoom": 1.18, "dur": 3}],
     "fx": [cap(1480, 170, "MALAM · HALTE", col="#F6C343", at=0.3)]},
    insert("memandangi jempol", -0.3, {"type": "chat16", "night": True, "name": "Pak Wijaya", "sub": "Toko Wijaya", "ch": "W",
            "msgs": [{"t": -5, "me": True, "text": "Pak, unit tipe besar berangkat besok jam 07.00. …", "time": "15.00", "read": -4}, {"t": -4, "thumb": True, "time": "15.02"}]}, trans="zoom"),
    {"cue": "Pagi tadi", "d": -0.2, "trans": "flash", "loc": "lobi", "locOpt": LOBI,
     "actors": [{"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}]},
                {"who": "rina", "x": 1380, "face": -1, "keys": [{"at": 0, "pose": "shrug", "expr": "happy", "emote": "sweat"}, C("Memang benar", pose="idle", expr="neutral")]}],
     "cam": [{"x": 1010, "y": 520, "zoom": 1.12}, {"at": 0, "x": 1150, "y": 520, "zoom": 1.22, "dur": 6}],
     "fx": [{"type": "flashback"}, card("Memang benar", "Benar: pengiriman bukan tugasnya.", d=0.1, x=1350, y=200, size=42, maxW=760)]},
    {"cue": "Tapi bagi klien", "d": -0.2, "trans": "fade", "loc": "lobi", "locOpt": {"time": "pagi", "deskX": 99999},
     "actors": [{"who": "rina", "x": 1290, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [0.3, -0.2]}, C("adalah Tangani", -0.3, pose="hips", expr="proud", look="cam")]}],
     "cam": [{"x": 1290, "y": 470, "zoom": 1.05}, {"at": 0, "x": 1290, "y": 470, "zoom": 1.1, "dur": 3}, C("Dan orang yang berdiri", on="rina", fit=0.2, sx=960, sy=520, dur=3)],
     "fx": [card("hanya ada satu Tangani", "Bagi klien, hanya ada satu Tangani.", d=0.0, x=520, y=860, size=40, maxW=760, out=C("Dan orang yang berdiri", 0.3)),
            cap(1500, 860, "SAAT ITU: RINA = TANGANI", bg="#C2691F", cue="adalah Tangani", d=0.0)]},
    {"cue": "Bayu menyenggol", "d": -0.2, "trans": "fade",
     "actors": [{"who": "rina", "x": 800, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [0.4, 0.6]}, {"at": 0.4, "jump": 12, "expr": "shock", "look": [1, -0.1]},
                 C("Rina tersenyum", expr="happy", look=[1, -0.1]), C("Ia mengetuk bangku", expr="laugh", look="cam"), C("Satu hari yang berat", expr="happy", look=[0.4, -0.4]),
                 C("Setidaknya", expr="neutral", look=[1, -0.3])]},
                {"who": "bayu", "x": 1180, "face": -1, "item": "phone", "keys": [{"at": 0, "pose": "sit", "expr": "laugh"}, {"at": 0.3, "jump": 16}, C("Ia mengetuk bangku", expr="happy", look=[0, 0.6])]}],
     "cam": [{"x": 990, "y": 540, "zoom": 1.12}, {"at": 0, "x": 990, "y": 540, "zoom": 1.18, "dur": 5}, C("Satu hari yang berat", on="rina", fit=0.2, sx=900, dur=3),
             C("Setidaknya", on="rina", fit=0.26, sx=900, dur=2.5)],
     "sfx": [C("Setidaknya", 0.0, type="dun", vol=0.7)],
     "fx": [{"type": "taps", "x": 700, "y": 880, "word": "tok", "sound": "knock", "times": [C("Ia mengetuk bangku", 0.4), C("Ia mengetuk bangku", 0.75)]},
            cap(1450, 170, "BUKAN KARENA GUGUP", bg="#3BA36B", cue="bukan karena gugup", d=0.0, out=C("Satu hari yang berat", 0.3)),
            cap(1450, 170, "TOKO KE-12 BUKA TEPAT WAKTU?", bg="#6E2430", cue="Toko kedua belas", d=0.2)]},
  ]})

# 15 ----------------------------------------------------------------- Cuplikan Eps 2 + layar akhir
A.append({"n": 15, "name": "Cuplikan Klien Terbesar Eps 2 + layar akhir", "loc": "kerja", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": {"time": "pagi", "clock": "07:10", "empty": True},
  "lines": [{"who": "bayu", "from": "Rin, kardus untuk", "to": "tidak ada di gudang", "text": "Rin… kardusnya nggak ada.", "label": "Bayu", "maxW": 520, "size": 42},
            {"who": "dodi", "from": "seorang pria bertopi", "to": "tangan terlipat", "text": "Pasti gudang lagi yang salah, ya?", "label": "Dodi", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "actors": [rina_sit(keys=[{"at": 0, "pose": "type", "expr": "happy", "look": [1, 0.3]}, C("telepon Rina berdering", pose="phone", item="phoneBuzz", expr="shock", emote="!")])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 820, "dur": 3}, C("telepon Rina berdering", on="rina", fit=0.26, sx=820, dur=0.5, ease="back")],
     "sfx": [C("telepon Rina berdering", -0.2, type="ring", vol=0.8, dur=2.2)],
     "fx": [{"type": "month", "at": 0.2, "hold": 3.0, "day": "9", "text": "JUNI"}, cap(1480, 190, "SELASA · 07.10", col="#F6C343", at=0.5)]},
    {"cue": "Suara Bayu", "d": -0.2, "trans": "whip", "split": [
       {"loc": "kerja", "locOpt": {"time": "pagi", "clock": "07:11", "empty": True}, "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
        "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [1, 0.1]}, C("tidak ada di gudang", expr="shock", emote="!")])],
        "cam": [{"x": 900, "y": 540, "zoom": 1.2}, C("Rin, kardus untuk", x=880, y=540, zoom=1.3, dur=4)]},
       {"loc": "gudang", "locOpt": {"emptyRack": {"x": 260, "w": 700, "label": "WIJAYA · TK-12"}, "boxes": [[1500, 2], [1760, 1]]},
        "actors": [{"who": "bayu", "x": 1100, "face": -1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "scared", "look": [-1, -0.2]}, C("tidak ada di gudang", expr="sad", emote="sweat")]}],
        "cam": [{"x": 820, "y": 500, "zoom": 0.95}, C("Rin, kardus untuk", x=860, y=500, zoom=1.02, dur=4)]}]},
    insert("Toko buka lusa", -0.2, {"type": "calendar", "title": "JUNI", "days": [["SEN", 8], ["SEL", 9], ["RAB", 10], ["KAM", 11], ["JUM", 12], ["SAB", 13], ["MIN", 14]],
            "today": 9, "todayLabel": "HARI INI", "dead": 11, "deadLabel": "TOKO BUKA", "deadSub": "KAMIS", "circleAt": 0.3}, trans="zoom"),
    {"cue": "Dan di gudang", "d": -0.2, "trans": "whip", "loc": "gudang", "locOpt": {"emptyRack": {"x": -40, "w": 600, "label": "WIJAYA · TK-12"}, "boxes": [[1700, 2]]},
     "actors": [{"who": "dodi", "x": 1330, "face": -1, "keys": [{"at": 0, "pose": "cross", "expr": "neutral", "look": [-1, 0]}, C("tangan terlipat", -0.4, pose="cross", expr="angry", look="cam")]},
                {"who": "rina", "x": -300, "face": 1, "keys": [{"at": 0.2, "x": 760, "dur": 1.8, "expr": "scared"}, {"at": 2.1, "pose": "idle", "expr": "scared", "emote": "sweat"}]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.05}, {"at": 0, "x": 950, "y": 520, "zoom": 1.14, "dur": 3}],
     "fx": [{"type": "nameTag", "at": 0.6, "name": "Dodi", "role": "Gudang & lapangan", "x": 1380, "y": 800}]},
    {"cue": "Saksikan kelanjutannya", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis"), "nextQuote": "\"Pasti gudang lagi?\"", "nextSub": "kardus hilang", "nextTitle": "Klien Terbesar · Eps 2",
             "nextWho": "dodi", "nextKey": {"pose": "cross", "expr": "angry"}, "nextThumb": False, "playlist": "Klien Terbesar", "playlistEps": "Eps 1 · 2 · 3 · 4",
             "ask": "Pernahkah kamu refleks membela diri saat dimarahi? Tulis di komentar!"}]},
  ]})


def shot_local(A):
    """Mesin membaca `at` (aktor, kamera, fx) sebagai detik sejak awal ADEGAN. Di shot ke-2 dst. data di sini ditulis
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
            for k in sh.get("cam", []): fix(k, sh, moving)
            for f in sh.get("fx", []): fix(f, sh, lambda k: k["at"] > 0)


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


shot_local(A)
ep = {"slug": "kantor-05", "title": "Klien Terbesar Mengamuk di Lobi, Rina Malah Membela Diri | Kantor Tangani: Klien Terbesar Eps 1",
      "series": "Kantor Tangani", "story": "Klien Terbesar", "eps": "1/4", "month": "JUNI", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Lobi"], [3, "Klien terbesar"], [6, "Intinya apa?"], [9, "Telepon kedua"], [10, "Formulir pesanan"], [13, "Pelajaran"], [15, "Episode berikutnya"]],
      "parts": [["Pembuka & masalah", 0, 2], ["Memburuk", 2, 4], ["Berubah & hasil", 4, 6], ["Episode berikutnya", 6, 7]],
      "lessons": ["Dengarkan sampai tuntas, tanpa membela diri.", "Akui dampaknya, lalu janjikan langkah dan jam yang pasti.", "Fakta tetap penting, tapi sampaikan setelah suasana tenang."],
      "youtube": {
        "desc": "Senin pagi, klien terbesar kantor menggebrak meja resepsionis: mesin kasir untuk toko barunya salah tipe, padahal toko buka Kamis. Kalimat pertama Rina justru \"Maaf, Pak. Itu bukan bagian saya.\" Bisakah Rina menenangkan klien yang sedang marah, dan kapan fakta boleh disampaikan? Episode pertama Kantor Tangani: Klien Terbesar.",
        "ask": "Pernahkah kamu refleks membela diri saat dimarahi? Tulis di kolom komentar.",
        "next": "Klien Terbesar Eps 2 tayang berikutnya.",
        "tags": "kantor tangani, klien terbesar, cerita kantor, animasi kantor, klien marah, menghadapi komplain, layanan pelanggan, customer service, membela diri, komunikasi kerja, dunia kerja, Tangani Talenta",
        "hashtags": "#KantorTangani #KlienTerbesar #duniakerja",
        "adAfter": 8},
      "thumb": {"kind": "lobi", "lines": ["KLIEN", "TERBESAR"], "hl": "MENGAMUK!", "hlSize": 100, "badge": "EPS 1/4", "tag": "KANTOR TANGANI · KLIEN TERBESAR"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
