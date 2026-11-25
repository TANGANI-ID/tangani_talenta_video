#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-10 (Utang Bayu Eps 2: "Suara Atasan Minta Transfer 25 Juta. Ternyata Bukan Dia").
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}.
Mesin tambahan: engine/panjang/kit16j.js (transferApp, voiceMsg, twoCol, thumbnail utang2) + lockAlert mode "missed" (kit16i.js)."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-10/episode.json"
NASKAH = "youtube/serial/ep10-naskah.md"

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
def B(x=850, **kw):   # Bayu (duduk di meja, menghadap meja)
    o = {"who": "bayu", "x": x, "face": 1}; o.update(kw); return o
def R(x, **kw):   # Rina
    o = {"who": "rina", "x": x, "face": -1}; o.update(kw); return o
def H(x, **kw):   # Pak Hendra
    o = {"who": "hendra", "x": x, "face": -1}; o.update(kw); return o
def Y(x, **kw):   # Yoga (headphone di leher)
    o = {"who": "yoga", "x": x, "face": 1, "neckphones": True}; o.update(kw); return o
def SI(x, **kw):   # Sinta
    o = {"who": "sinta", "x": x, "face": 1}; o.update(kw); return o
def back(o, y=930, size=520):
    o.update({"y": y, "layer": "back", "size": size}); return o
WULAN = lambda **kw: dict({"who": "resepsionis", "x": 1000, "y": 930, "layer": "back", "face": -1, "size": 520}, **kw)
LOBI = {"time": "sore", "deskX": 1100, "deskFront": True, "stairs": 1600, "slamX": -230}

extras = {
    "resepsionis": {"nama": "Mbak Wulan (resepsionis)", "look": {"hair": "hijab", "hijab": "#C2691F", "shirt": "#FFFDF8", "jacket": "#13223D", "pants": "#2C2433", "skin": "d", "idcard": "#C2691F"}},
}

A = []

# 1 ------------------------------------------------------------------ SEBELUMNYA (kilas Eps 1)
A.append({"n": 1, "name": "Sebelumnya (kilas Eps 1)", "vo": True, "music": "sad", "pre": 0.5, "post": 0.5, "trans": "cut",
  "shots": [
    dict({"at": 0, "fx": [{"type": "payslips", "at": 0, "rowsAt": 1.6, "per": 0.5, "eqAt": C("hampir sama", 0.2)}, REC]}, **NOLOC),
    insert("Rina menyisihkan tabungan", -0.2, [{"type": "envelopes", "firstAt": C("di awal gajian", 0.0), "restAt": C("Bayu menutup cicilan", -0.4)}, REC], trans="whip"),
    insert("Bayu menutup cicilan", -0.2, [{"type": "lockAlert", "mode": "paid", "rowsAt": 0.3, "per": 0.5, "bannerAt": 99, "clock": "12.43"}, REC], trans="whip"),
    insert("Siang itu ia bilang beres", -0.2, [{"type": "lockAlert", "mode": "sent", "amount": "Rp300.000", "memo": "Catatan: untuk makan", "bannerAt": 0.6}, REC], trans="cut"),
    insert("Malamnya, di parkiran", -0.2, [{"type": "lockAlert", "mode": "due", "bannerAt": 0.6, "clock": "20.12", "date": "Sabtu, 5 Juli"}, REC], trans="whip"),
    insert("Jatuh tempo hari ini", -0.1, [{"type": "lockAlert", "mode": "paid", "rowsAt": -30, "bannerAt": 0.2, "amount": "Denda berlaku", "chip": "DENDA BERLAKU", "chipAt": 0.5, "chipBg": RED}, REC], trans="cut"),
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: jari di atas KIRIM
A.append({"n": 2, "name": "Jari di atas tombol kirim", "loc": "kerja", "music": "tense", "trans": "flash", "pre": 0.5,
  "locOpt": SORE,
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "shots": [
    {"at": 0, "actors": [B(keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}], item="phone")],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.1}, {"at": 0, "x": 960, "y": 580, "zoom": 1.25, "dur": 7}],
     "fx": [cap(560, 170, "JUMAT, 11 JULI · 16.45", bg=NAVY, col=YEL, at=0.4)]},
    insert("Jari Bayu sudah di atas", -0.3, {"type": "transferApp", "typeAt": 0.2, "badgeAt": C("Di ponselnya, pesan suara", -0.4)}, trans="zoom"),
    insert("Di ponselnya, pesan suara", -0.2, {"type": "voiceMsg", "plays": [0.6], "labelAt": C("persis Pak Hendra", -0.6), "chip": "PESAN SUARA · NOMOR TIDAK DIKENAL", "chipAt": 2.4,
                                              "caption": "\"Transfer 25 juta ke vendor baru. Urgent.\"", "captionAt": C("Transfer dua puluh lima juta ke vendor baru", 0.0)}, trans="whip"),
    insert("Dua puluh lima juta. Rekening", -0.2, {"type": "transferApp", "typeAt": 0.0, "badgeAt": 0.6, "chip": "TIDAK ADA DI DAFTAR VENDOR", "chipAt": C("belum pernah Bayu lihat", 0.0)}, trans="cut"),
    {"cue": "Dan jarinya tinggal", "d": -0.2, "trans": "cut",
     "actors": [B(keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}], item="phone"),
                R(2150, keys=[{"at": 0, "x": 2150}, {"at": 0.4, "x": 1700, "dur": 1.6, "expr": "neutral"}], item="cup")],
     "cam": [{"x": 1100, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1160, "y": 560, "zoom": 1.25, "dur": 5}]},
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "UTANG BAYU · EPS 2/4",
     "hook": "Suara Atasan Minta Transfer 25 Juta. Ternyata Bukan Dia", "day": "11", "month": "JULI", "marker": "JUMAT · 16.45", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Pujian yang canggung
A.append({"n": 4, "name": "Pujian yang canggung", "loc": "kerja", "music": "light", "trans": "iris",
  "locOpt": {"time": "pagi", "clock": "08:50"},
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "lines": [{"who": "hendra", "from": "Pembayaran ke vendor bulan ini", "to": "Rapi", "text": "Bayu yang pegang pembayaran vendor. Rapi.", "maxW": 520, "size": 40},
            {"who": "bayu", "from": "Bayu menjawab", "to": "Siap, Pak", "text": "Siap, Pak.", "label": "Bayu", "maxW": 400, "size": 44, "min": 1.6}],
  "shots": [
    {"at": 0, "actors": [B(item="phone", keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": "down"}]),
                         H(2250, keys=[{"at": 0, "x": 2250}, {"at": 0.2, "x": 1560, "dur": 2.4}, C("Pembayaran ke vendor bulan ini", 0.0, pose="pointUp", expr="happy")])],
     "cam": [{"x": 1100, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1200, "y": 560, "zoom": 1.2, "dur": 8}]},
    {"cue": "Beberapa orang bertepuk", "d": -0.2, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0]}]), H(1560, keys=[{"at": 0, "pose": "hips", "expr": "happy"}]),
                back(SI(260, keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [1, 0]}])), back(Y(1850, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}]))],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.0}, {"at": 0, "x": 1040, "y": 540, "zoom": 1.08, "dur": 6}]},
    {"cue": "Bayu menjawab", "d": -0.2, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [1, 0]}, C("dan tersenyum seperti", 0.0, expr="neutral", look="cam")]), H(1560, keys=[{"at": 0, "pose": "hips", "expr": "happy"}, C("Begitu Pak Hendra berlalu", -0.3, x=2300, dur=2.0, face=1)])],
     "cam": [{"on": "bayu", "fit": 0.25, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 800, "dur": 7}],
     "fx": [cap(1450, 190, "SENYUM SEPERTI ORANG YANG DIUJI", bg=NAVY, col=YEL, size=30, cue="dan tersenyum seperti", d=0.0)]},
    {"cue": "Begitu Pak Hendra berlalu", "d": -0.2, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": "down"}, C("Ada notifikasi", 0.0, expr="scared", emote="sweat")])],
     "cam": [{"x": 940, "y": 600, "zoom": 1.3}, {"at": 0, "x": 920, "y": 620, "zoom": 1.45, "dur": 4}]},
    insert("Ada notifikasi", -0.2, {"type": "lockAlert", "mode": "due", "bannerAt": 0.5, "clock": "08.52", "date": "Jumat, 11 Juli", "chip": "TAGIHAN LAIN · JATUH TEMPO", "chipAt": 1.8}, trans="zoom"),
    {"cue": "Pujian hari itu", "d": -0.2, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "sad", "look": "down"}])],
     "cam": [{"on": "bayu", "fit": 0.27, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.32, "sx": 800, "dur": 8}],
     "fx": [cap(1450, 190, "BISA DICABUT KALAU SALAH SEKALI", bg="#6E2430", size=30, cue="Terasa seperti sesuatu", d=0.0)]},
  ]})

# 5 ------------------------------------------------------------------ Pesan suara jam 16.45
A.append({"n": 5, "name": "Pesan suara 16.45", "loc": "kerja", "music": "tense", "trans": "whip",
  "locOpt": {"time": "sore", "clock": "16:45"},
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "sfx": [C("ponselnya berbunyi", 0.0, type="buzz", vol=0.8, dur=1.0)],
  "shots": [
    {"at": 0, "actors": [B(keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": "down"}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 1040, "y": 560, "zoom": 1.28, "dur": 7}],
     "fx": [cap(560, 170, "BAYAR VENDOR · DARI REKENING KANTOR", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "ponselnya berbunyi", "d": -0.3, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "confused", "look": "down"}])],
     "cam": [{"x": 940, "y": 620, "zoom": 1.5}, {"at": 0, "x": 920, "y": 630, "zoom": 1.65, "dur": 4}],
     "fx": [cap(1450, 190, "BUKAN NOMOR TERSIMPAN", bg=RED, size=32, cue="Bukan nomor yang tersimpan", d=0.0)]},
    insert("Tapi suaranya, ia kenal", -0.2, {"type": "voiceMsg", "plays": [C("Bay. Transfer dua puluh lima juta", -0.3)], "labelAt": C("Nanti saya jelaskan", 0.4), "chip": "LABEL DARI BAYU SENDIRI", "chipAt": C("Nanti saya jelaskan", 0.8)}, trans="zoom"),
    {"cue": "Bayu mendengarnya dua kali", "d": -0.2, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": "down"}, C("Kali kedua ia tutup mata", 0.0, expr="tired"), C("Makin didengar", 0.0, expr="scared")])],
     "cam": [{"on": "bayu", "fit": 0.25, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.31, "sx": 800, "dur": 8}]},
    {"cue": "Di meja, daftar vendor", "d": -0.2, "trans": "cut",
     "actors": [B(keys=[{"at": 0, "pose": "idle", "expr": "confused", "look": [1, 0.3]}])],
     "cam": [{"x": 1200, "y": 640, "zoom": 1.3}, {"at": 0, "x": 1260, "y": 660, "zoom": 1.45, "dur": 5}],
     "fx": [cap(1500, 190, "NAMA ITU TIDAK ADA DI DAFTAR", bg=RED, size=32, cue="Nama di pesan itu", d=0.0)]},
  ]})

# 6 ------------------------------------------------------------------ Alasan untuk menurut
A.append({"n": 6, "name": "Alasan untuk menurut", "loc": "kerja", "music": "sad", "trans": "iris",
  "locOpt": {"time": "sore", "clock": "16:48"},
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "lines": [{"who": "bayu", "from": "kalau aku bertanya", "to": "kelihatan lambat", "text": "Kalau aku bertanya, aku kelihatan lambat.", "label": "Bayu", "maxW": 520, "size": 40, "min": 3.0}],
  "shots": [
    {"at": 0, "actors": [B(keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0.3]}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 1060, "y": 560, "zoom": 1.28, "dur": 5}]},
    insert("Dua puluh lima juta. Nama penerima", -0.3, {"type": "transferApp", "typeAt": 0.0, "badgeAt": 0.4, "chip": "BUKAN VENDOR YANG IA HAFAL", "chipAt": C("Seharusnya itu cukup", 0.0)}, trans="zoom"),
    {"cue": "Tapi kepalanya sedang penuh", "d": -0.2, "trans": "cut",
     "actors": [B(keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": "down"}, C("Tujuh tagihan", 0.0, emote="sweat")])],
     "cam": [{"on": "bayu", "fit": 0.25, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.31, "sx": 800, "dur": 4}]},
    insert("Tujuh tagihan", -0.2, [{"type": "lockAlert", "mode": "paid", "rowsAt": 0.2, "per": 0.25, "bannerAt": 99, "clock": "16.48"}], trans="cut"),
    {"cue": "Dan kalimat yang ia ulang", "d": -0.2, "trans": "cut",
     "actors": [B(keys=[{"at": 0, "pose": "idle", "expr": "sad", "look": "down"}, C("Orang yang lambat", 0.0, expr="scared"), C("Apalagi kalau utangnya", 0.0, expr="sad", emote="sweat")])],
     "cam": [{"on": "bayu", "fit": 0.24, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.31, "sx": 800, "dur": 9}],
     "fx": [cap(1450, 190, "ORANG LAMBAT MUDAH DIGANTI", bg="#6E2430", size=32, cue="Orang yang lambat", d=0.0)]},
    insert("Ia menarik layar itu lebih dekat", -0.1, {"type": "transferApp", "typeAt": -30, "badgeAt": -30, "scale": 1.12}, trans="zoom"),
  ]})

# 7 ------------------------------------------------------------------ Rina menahan
A.append({"n": 7, "name": "Rina menahan", "loc": "kerja", "music": "tense", "musicCut": 2.0, "trans": "cut", "post": 0.4, "hold": 1.6,
  "locOpt": {"time": "sore", "clock": "16:49"},
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "lines": [{"who": "rina", "from": "Telepon dulu, Bay", "to": "Telepon dulu, Bay", "text": "Telepon dulu, Bay.", "maxW": 460, "size": 46, "min": 2.0},
            {"who": "bayu", "from": "Ini suara Pak Hendra", "to": "Ini suara Pak Hendra", "text": "Ini suara Pak Hendra.", "label": "Bayu", "maxW": 480, "size": 42, "min": 2.0},
            {"who": "rina", "from": "Justru karena urgent", "to": "pesan yang sama", "text": "Justru karena urgent. Telepon dulu.", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}]),
                         R(2200, item="cup", keys=[{"at": 0, "x": 2200}, {"at": 0.2, "x": 1560, "dur": 1.8, "expr": "neutral"}, C("Ia melihat angkanya", 0.0, look=[-1, 0.2]), C("Telepon dulu, Bay", 0.0, expr="confused")])],
     "cam": [{"x": 1100, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1200, "y": 560, "zoom": 1.2, "dur": 8}]},
    {"cue": "Bayu tidak menoleh", "d": -0.2, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}]),
                R(1560, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "confused", "look": [-1, 0.2]}, C("Rina menepuk meja", 0.0, pose="pointDown", item=None, expr="serious")])],
     "cam": [{"x": 1150, "y": 560, "zoom": 1.2}, {"at": 0, "x": 1190, "y": 560, "zoom": 1.32, "dur": 8}]},
    insert("Jari Bayu tidak turun", -0.3, {"type": "transferApp", "typeAt": -30, "badgeAt": -30, "scale": 1.12}, trans="zoom"),
    {"cue": "Rina tidak merebut", "d": -0.2, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}]),
                R(1560, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0.2]}])],
     "cam": [{"x": 1150, "y": 560, "zoom": 1.25}, {"at": 0, "x": 1190, "y": 560, "zoom": 1.38, "dur": 6}]},
  ]})

# 8 ------------------------------------------------------------------ Nomor yang sudah tersimpan
RAP = {"clock": "16:50", "slide": "logo", "backChairs": [1300, 1520], "tableX0": 1080, "tableX1": 1960, "tableItems": [[1300, "paper"], [1560, "cup"], [1800, "laptop"]]}
A.append({"n": 8, "name": "Nomor yang sudah tersimpan", "music": "tense", "trans": "cut", "pre": 0.3,
  "lines": [{"who": "hendra", "from": "Bay? Saya sedang rapat", "to": "Ada apa", "text": "Bay? Saya sedang rapat. Ada apa?", "maxW": 520, "size": 40},
            {"who": "hendra", "from": "Saya tidak mengirim apa pun", "to": "Jangan dikirim", "text": "Saya tidak mengirim apa pun.", "maxW": 520, "size": 42},
            {"who": "rina", "from": "Suara bisa ditiru", "to": "Suara bisa ditiru", "text": "Suara bisa ditiru.", "maxW": 460, "size": 44, "min": 2.0}],
  "shots": [
    dict({"at": 0, "fx": [{"type": "callScreen", "at": 0, "name": "Pak Hendra", "sub": "kontak tersimpan sejak lama", "ch": "H", "col": ORANGE, "rings": [0.6, 2.2],
                           "chip": "BUKAN MEMBALAS PESAN TADI", "chipAt": C("Bukan membalas pesan tadi", 0.0), "chipBg": GREEN}]}, **NOLOC),
    {"cue": "Di ruang rapat Melati", "d": -0.2, "trans": "whip", "split": [
       {"loc": "kerja", "locOpt": {"time": "sore", "clock": "16:50"}, "props": [CHAIR, desk(papers=1, laptop=1)],
        "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}, C("Bayu menelan ludah", 0.0, expr="sad"), C("Tombol kirim itu", -0.2, expr="neutral")]),
                   R(2200, keys=[{"at": 0, "x": 2200}, C("Rina, di samping Bayu", 0.0, x=1500, dur=1.4, expr="neutral")])],
        "cam": [{"x": 1000, "y": 540, "zoom": 1.15}, {"at": 0, "x": 1060, "y": 540, "zoom": 1.3, "dur": 14}]},
       {"loc": "rapat", "locOpt": RAP,
        "actors": [H(1560, size=560, item="phone", keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("Ia mengangkat", 0.0, pose="phone", expr="confused"), C("Hening sebentar", 0.0, expr="shock"), C("Saya tidak mengirim apa pun", 0.0, expr="angry")])],
        "cam": [{"x": 1480, "y": 520, "zoom": 1.1}, {"at": 0, "x": 1500, "y": 520, "zoom": 1.2, "dur": 14}]}],
     "fx": [cap(560, 170, "KIRI · MEJA BAYU", bg=NAVY, col=YEL, size=26, at=0.4), cap(1400, 170, "KANAN · RUANG RAPAT MELATI", bg=NAVY, col=YEL, size=26, at=0.4)]},
    insert("Tombol kirim itu", -0.3, {"type": "transferApp", "typeAt": -30, "badgeAt": -30, "stampAt": 0.9, "fingerOut": 0.5, "chip": "TIDAK DISENTUH", "chipAt": 1.8, "chipBg": GREEN}, trans="zoom"),
  ]})

# 9 ------------------------------------------------------------------ Kenapa ia tergesa
def stair(i, x0=1600):
    return [x0 + i * 70 + 35, 1000 - (i + 1) * 50]
SB, SR = stair(1), stair(3)
A.append({"n": 9, "name": "Kenapa ia tergesa", "loc": "lobi", "music": "sad", "trans": "fade", "pre": 0.6,
  "locOpt": dict(LOBI, slam=0),
  "lines": [{"who": "bayu", "from": "Aku hampir menekan kirim", "to": "habis semuanya", "text": "Aku takut kelihatan tidak bisa diandalkan.", "label": "Bayu", "maxW": 560, "size": 38, "min": 3.0}],
  "shots": [
    {"at": 0, "actors": [B(SB[0], y=SB[1], face=-1, item="phone", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}]),
                         R(SR[0], y=SR[1], face=-1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, -0.2]}])],
     "cam": [{"x": 1500, "y": 640, "zoom": 1.1}, {"at": 0, "x": 1560, "y": 640, "zoom": 1.2, "dur": 6}]},
    {"cue": "Bayu tidak langsung bercanda", "d": -0.2, "trans": "cut",
     "actors": [B(SB[0], y=SB[1], face=-1, item="phone", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}]),
                R(SR[0], y=SR[1], face=-1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, -0.2]}])],
     "cam": [{"on": "bayu", "fit": 0.3, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.36, "sx": 800, "dur": 12}]},
    {"cue": "Rina tidak menyuruhnya", "d": -0.2, "trans": "cut",
     "actors": [B(SB[0], y=SB[1], face=-1, item="phone", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}]),
                R(SR[0], y=SR[1], face=-1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, -0.2]}, C("Kamu tidak menekan kirim", 0.0, expr="proud", look=[1, -0.4])])],
     "cam": [{"x": 1500, "y": 640, "zoom": 1.25}, {"at": 0, "x": 1540, "y": 650, "zoom": 1.38, "dur": 8}],
     "fx": [cap(540, 190, "HARI INI: TIDAK MENEKAN KIRIM", bg=GREEN, size=32, cue="Kamu tidak menekan kirim", d=0.0)]},
    {"cue": "Bayu mengangguk", "d": -0.2, "trans": "cut",
     "actors": [B(SB[0], y=SB[1], face=-1, item="phone", keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}]),
                R(SR[0], y=SR[1], face=-1, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, -0.2]}])],
     "cam": [{"x": 1500, "y": 640, "zoom": 1.1}, {"at": 0, "x": 1560, "y": 640, "zoom": 1.2, "dur": 4}],
     "fx": [cap(540, 190, "YANG LAIN, NANTI. KALAU KAMU MAU.", bg=NAVY, col=YEL, size=30, cue="Yang lain, nanti", d=0.0)]},
  ]})

# 10 ----------------------------------------------------------------- Aturan dua orang
A.append({"n": 10, "name": "Aturan dua orang", "loc": "bos", "music": "hope", "trans": "iris",
  "locOpt": {"time": "sore", "deskX": 1300, "folder": True},
  "props": [{"type": "officeDoor", "x": 420, "y": 1000, "label": "KEPALA OPERASIONAL"}],
  "lines": [{"who": "hendra", "from": "Intinya,", "to": "Bagus", "text": "Intinya, kamu bertanya sebelum mengirim.", "maxW": 560, "size": 38}],
  "shots": [
    {"at": 0, "actors": [H(1400, y=950, layer="back", size=600, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, C("Pak Hendra mendengar", 0.0, expr="neutral")]),
                         {"who": "bayu", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "sad", "look": [1, 0.2]}, C("Bukan seluruh utangnya", 0.0, expr="neutral")]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.05}, {"at": 0, "x": 960, "y": 520, "zoom": 1.15, "dur": 8}]},
    {"cue": "Pak Hendra mendengar sampai", "d": -0.2, "trans": "cut",
     "actors": [H(1400, y=950, layer="back", size=600, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, C("Bagus", -0.5, expr="happy")]),
                {"who": "bayu", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0.2]}]}],
     "cam": [{"x": 1050, "y": 520, "zoom": 1.15}, {"at": 0, "x": 1090, "y": 520, "zoom": 1.28, "dur": 6}]},
    insert("Lalu ia menulis aturan baru", -0.3, {"type": "twoCol", "titleAt": 0.4, "colsAt": C("Satu orang mengisi", -0.6), "neqAt": C("Orang lain menyetujui", 0.2), "ruleAt": C("Tidak boleh orang yang sama", 0.0),
                                                "chip": "YANG MENGISI ≠ YANG MENYETUJUI", "chipAt": C("Tidak boleh orang yang sama", 1.2)}, trans="zoom"),
    {"cue": "Rina tidak ikut masuk", "d": -0.2, "trans": "cut",
     "actors": [H(1400, y=950, layer="back", size=600, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}]),
                {"who": "bayu", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "proud", "look": [1, 0.2]}]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.05}, {"at": 0, "x": 860, "y": 520, "zoom": 1.15, "dur": 5}],
     "fx": [cap(560, 170, "YANG MELAPOR: BAYU", bg=GREEN, size=32, cue="Yang melapor", d=0.0)]},
  ]})

# 11 ----------------------------------------------------------------- Nomor palsu disimpan
A.append({"n": 11, "name": "Nomor palsu disimpan", "loc": "kerja", "music": "warm", "trans": "fade",
  "locOpt": {"time": "sore", "clock": "17:20"},
  "props": [CHAIR, desk(papers=1, laptop=1)],
  "lines": [{"who": "bayu", "from": "Nyaris. Tidak jadi", "to": "Nyaris. Tidak jadi", "text": "Nyaris. Tidak jadi.", "label": "Bayu", "maxW": 420, "size": 44, "min": 2.0}],
  "shots": [
    {"at": 0, "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": "down"}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 580, "zoom": 1.28, "dur": 5}]},
    insert("Bukan untuk dibalas", -0.9, {"type": "voiceMsg", "plays": [-30], "labelAt": 0.5, "labelText": "JANGAN DIANGGAP PAK HENDRA", "labelSub": "disimpan Bayu · bukan untuk dibalas", "labelCol": RED, "labelCh": "!",
                                       "chip": "UNTUK DIINGAT", "chipAt": C("Untuk diingat", 0.0), "chipBg": RED}, trans="zoom"),
    insert("Di halaman transfer, cap merah", -0.2, {"type": "transferApp", "typeAt": -30, "badgeAt": -30, "stampAt": 0.5, "fingerOut": 0.0}, trans="cut"),
    {"cue": "Ia menunjukkan layar itu", "d": -0.2, "trans": "cut",
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [1, 0]}, C("Nyaris. Tidak jadi", 0.0, pose="shrug", expr="sad")]),
                Y(1650, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, C("Yoga mengangguk", 0.0, expr="happy")])],
     "cam": [{"x": 1200, "y": 560, "zoom": 1.2}, {"at": 0, "x": 1240, "y": 560, "zoom": 1.3, "dur": 6}]},
    {"cue": "Uang kantor tetap", "d": -0.2, "trans": "cut",
     "actors": [B(keys=[{"at": 0, "pose": "idle", "expr": "tired", "look": "down"}, C("Takutnya tidak hilang", 0.0, expr="sad"), C("Tapi takutnya tidak sampai", 0.0, expr="neutral")])],
     "cam": [{"on": "bayu", "fit": 0.25, "sx": 800}, {"at": 0, "on": "bayu", "fit": 0.31, "sx": 800, "dur": 12}]},
  ]})

# 12 ----------------------------------------------------------------- Kartu pelajaran
A.append({"n": 12, "name": "Kartu pelajaran", "loc": "kerja", "music": "warm", "trans": "iris", "post": 3.0,
  "locOpt": {"time": "sore", "clock": "17:20"},
  "shots": [{"at": 0, "blur": 9, "actors": [R(300, face=1, size=600, keys=[{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: kalau ada", pose="pointUp"), C("Dua: transfer besar", pose="hips", expr="proud"),
                 C("Tiga: takut", pose="pointUp", expr="happy", item="thumb", jump=50), C("Tiga: takut", 2.8, pose="wave", item=None), C("Dua puluh lima juta itu tetap", pose="hips", expr="proud")])],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 14}],
     "fx": [{"type": "lesson", "cue": "Jadi, apa", "d": 0.8, "items": [{"cue": "Satu: kalau ada", "text": "Minta uang mendadak: cek lewat saluran lain"},
            {"cue": "Dua: transfer besar", "text": "Transfer besar: satu mengisi, satu menyetujui"}, {"cue": "Tiga: takut", "text": "Takut bukan alasan untuk tidak bertanya"}]}]}]})

# 13 ----------------------------------------------------------------- Cuplikan Eps 3 + layar akhir
A.append({"n": 13, "name": "Cuplikan Eps 3 + layar akhir", "loc": "lobi", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": dict(LOBI, slam=0),
  "shots": [
    {"at": 0, "actors": [WULAN(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral"}])],
     "cam": [{"x": 1000, "y": 620, "zoom": 1.15}, {"at": 0, "x": 1040, "y": 620, "zoom": 1.28, "dur": 6}],
     "fx": [cap(560, 170, "LOBI · HAMPIR 17.00", bg=NAVY, col=YEL, at=0.4)]},
    {"cue": "Mbak Wulan menyambungkannya", "d": -0.2, "trans": "whip", "loc": "kerja", "locOpt": {"time": "sore", "clock": "16:58"},
     "props": [CHAIR, desk(papers=1, laptop=1)],
     "actors": [B(item="phone", keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": "down"}, C("Beberapa kepala menoleh", 0.0, look=[1, 0]), C("Bayu mengangkat", 0.0, pose="phone", expr="scared", emote="sweat")]),
                back(SI(260, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, C("Beberapa kepala menoleh", 0.0, look=[1, 0], expr="confused")])),
                back(Y(1850, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, C("Beberapa kepala menoleh", 0.0, look=[-1, 0], expr="confused")]))],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, {"at": 0, "x": 1040, "y": 540, "zoom": 1.15, "dur": 8}]},
    insert("Di ponsel pribadinya", -0.2, {"type": "lockAlert", "mode": "missed", "bannerAt": 0.5, "clock": "16.58", "date": "Jumat, 11 Juli", "chip": "PINJAMAN G · TAK TERANGKAT", "chipAt": 1.8}, trans="zoom"),
    {"cue": "Saksikan kelanjutannya", "d": -0.2, "trans": "flash", "blur": 8, "loc": "kerja", "locOpt": {"time": "sore", "clock": "16:59"},
     "props": [CHAIR, desk(papers=1, laptop=1)],
     "actors": [B(keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": "down"}])],
     "cam": [{"x": 960, "y": 600, "zoom": 1.1}, {"at": 0, "x": 960, "y": 610, "zoom": 1.16, "dur": 4}],
     "fx": [{"type": "card", "at": 0.1, "text": "UTANG BAYU · EPS 3", "tag": "PENAGIH MENELEPON KE KANTOR", "size": 90, "bg": "#6E2430"}]},
    {"cue": "Kalau cerita ini", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di komentar"), "nextQuote": "\"Mencari Pak Bayu.\"", "nextSub": "satu divisi tahu", "nextTitle": "Utang Bayu · Eps 3",
             "nextWho": "bayu", "nextKey": {"pose": "sit", "expr": "scared"}, "nextThumb": False, "playlist": "Utang Bayu", "playlistEps": "Eps 1 · 2 · 3 · 4",
             "ask": "Kamu menekan kirim, atau menelepon dulu? Tulis di komentar!"}]},
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
ep = {"slug": "kantor-10", "title": "Suara Atasan Minta Transfer 25 Juta. Ternyata Bukan Dia | Kantor Tangani: Utang Bayu Eps 2",
      "series": "Kantor Tangani", "story": "Utang Bayu", "eps": "2/4", "month": "JULI", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "Tombol kirim"], [4, "Pujian"], [7, "Telepon dulu"], [8, "Bukan suaranya"], [10, "Dua orang"], [12, "Pelajaran"], [13, "Episode berikutnya"]],
      "parts": [["Pembuka & masalah", 0, 3], ["Memburuk", 3, 5], ["Berubah", 5, 7], ["Episode berikutnya", 7, 8]],
      "lessons": ["Permintaan uang yang mendadak: cek lewat saluran lain, telepon nomor yang sudah tersimpan.",
                  "Transfer besar: satu orang mengisi, orang lain menyetujui.",
                  "Takut kelihatan tidak mampu itu manusiawi, tapi bukan alasan untuk tidak bertanya."],
      "youtube": {
        "desc": "Pesan suara dengan suara persis atasan meminta transfer Rp25 juta ke rekening vendor yang belum pernah ada. Bayu hampir menekan kirim. Episode kedua Kantor Tangani: Utang Bayu. Cerita fiksi, bukan nasihat hukum atau keuangan.",
        "ask": "Kalau kamu yang mendengar suara itu, kamu menekan kirim atau menelepon dulu? Tulis di kolom komentar.",
        "next": "Utang Bayu Eps 3: Penagih Utang Menelepon ke Kantor, Satu Divisi Jadi Tahu.",
        "tags": "kantor tangani, utang bayu, cerita kantor, animasi kantor, penipuan suara, suara tiruan AI, penipuan transfer, Satgas PASTI, keamanan transfer, dunia kerja, Tangani Talenta",
        "hashtags": "#KantorTangani #UtangBayu #duniakerja",
        "adAfter": 7},
      "thumb": {"kind": "utang2", "lines": ["SUARA ATASAN", "MINTA 25 JUTA,"], "hl": "BUKAN DIA", "lineSize": 78, "hlSize": 100, "badge": "EPS 2/4", "tag": "KANTOR TANGANI · UTANG BAYU"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
