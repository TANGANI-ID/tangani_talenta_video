#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kelas-02 (Kelas Produktif Eps 2 versi 1 narator + 6 poin: "Susah Fokus Kerja? Coba Teknik 25 Menit Ini (Pomodoro)").
Tanpa tokoh cerita: semua adegan berupa ilustrasi/infografis (engine/panjang/kit16kp.js: pointCard, bigStat, leakBucket, lostCursor, focusGraph, splitTask, closeTabs, noteDistract, urgeWave, breakTimeline, cycleRing, adaptDay, longList, recapList, tomatoBig).
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() mengubahnya ke {cue shot, d}."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kelas-02/episode.json"
NASKAH = "youtube/kelas/kp02b-naskah.md"

def C(cue, d=None, **kw):
    o = {"cue": cue}
    if d is not None: o["d"] = d
    o.update(kw); return o

NOLOC = {"actors": [], "useLoc": False}
def sh(cue, fx, d=-0.2, trans="cut", **kw):
    """satu shot layar penuh tanpa lokasi; cue=None untuk shot pertama adegan."""
    o = dict(NOLOC, trans=trans); o["fx"] = fx if isinstance(fx, list) else [fx]
    if cue is None: o["at"] = 0
    else: o["cue"] = cue; o["d"] = d
    o.update(kw); return o
def scene(n, name, shots, music="light", trans="whip", **kw):
    o = {"n": n, "name": name, "loc": "kerja", "music": music, "trans": trans, "noHeader": True, "shots": shots}; o.update(kw); return o
def pc(n, lines, sub=None, **kw):
    o = {"type": "pointCard", "at": 0, "n": n, "lines": lines}
    if sub: o["sub"] = sub
    o.update(kw); return o

NAVY, ORANGE, YEL, GREEN, RED = "#13223D", "#C2691F", "#F6C343", "#3BA36B", "#D9483B"
A = []

# 1 ------------------------------------------------------------------ Pembuka
A.append(scene(1, "Tiga jam, dua puluh persen", [
    sh(None, {"type": "tabsLaptop", "at": 0, "from": 660, "to": 840, "dur": 9.0, "pct": 0.2, "chip": "3 JAM · BARU 20%", "chipAt": C("Dua puluh persen", -0.6)}, trans="fade"),
    sh("Tab terbuka empat belas", {"type": "bigStat", "at": 0, "c": 3, "top": "PADAHAL TIDAK BERMALAS-MALASAN", "big": "14 TAB", "size": 300, "lines": ["Chat berbunyi terus,", "video tutorial jalan di pojok layar."]}, d=-0.2, trans="zoom"),
    sh("Lalu ke mana perginya tiga jam itu", {"type": "leakBucket", "at": 0, "drain": 16, "chip": "KE MANA PERGINYA?", "chipAt": 0.6}, d=-0.3, trans="whip"),
    sh("Di video ini, aku bahas teknik fokus", {"type": "tomatoBig", "at": 0, "runAt": 1.4, "chip": "25 MENIT · SATU TUGAS", "chipAt": 0.8}, d=-0.2, trans="zoom"),
  ], music="light", trans="fade"))

# 2 ------------------------------------------------------------------ Judul
A.append({"n": 2, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash", "loc": "kerja",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "titleKP", "at": 0, "disc": 0, "deco": "tomato", "eps": "EPS 2", "topic": "WAKTU & PRIORITAS",
     "hook": "Susah Fokus Kerja? Coba Teknik 25 Menit Ini (Pomodoro)"}]}]})

# 3 ------------------------------------------------------------------ Pindah-pindah ada harganya
A.append(scene(3, "Pindah-pindah itu ada harganya", [
    sh(None, {"type": "bigStat", "at": 0, "c": 4, "top": "BANGGA BISA LIMA HAL SEKALIGUS?", "big": "BANGGA?", "size": 260, "lines": ["Banyak orang merasa", "itu tanda produktif."]}, trans="flash"),
    sh("Dulu aku juga begitu", {"type": "bigStat", "at": 0, "c": 2, "top": "DULU AKU JUGA BEGITU", "big": "HEBAT?", "size": 300, "lines": ["Terasa hebat, sampai sadar", "hasilnya selalu setengah-setengah."]}, d=-0.2, trans="whip"),
    sh("Tapi otak tidak benar-benar", {"type": "bigStat", "at": 0, "c": 4, "top": "OTAK TIDAK MULTITASKING", "big": "BERPINDAH", "size": 210, "lines": ["Ia hanya berpindah dengan sangat cepat,", "dan tiap pindah ada biayanya."]}, d=-0.2, trans="zoom"),
    sh("Dan setiap kali berpindah, ada biayanya", {"type": "bigStat", "at": 0, "c": 3, "top": "SETIAP KALI BERPINDAH", "big": "ADA BIAYANYA", "size": 190, "lines": ["Biaya untuk masuk lagi", "ke pekerjaan yang sama."]}, d=-0.2, trans="zoom"),
    sh("Coba ingat", {"type": "lostCursor", "at": 0, "cycle": 4.6, "chip": "KEMBALI KE PEKERJAAN, LUPA SAMPAI MANA", "chipAt": 0.6}, d=-0.2, trans="whip"),
    sh("Setiap pindah terasa sebentar", {"type": "focusGraph", "at": 0, "cmpAt": 4.8, "chip": "BIAYA MASUK LAGI MENUMPUK", "chipAt": 1.0}, d=-0.2, trans="whip"),
    sh("Seperti air yang bocor dari ember kecil", {"type": "leakBucket", "at": 0, "drain": 12, "plugAt": C("Tujuan kita, berhenti bocor", 0.2), "chip": "TIDAK TERLIHAT, TAPI BOCOR", "chipAt": 0.8}, d=-0.2, trans="whip"),
    sh("Caranya ada enam langkah", {"type": "bigStat", "at": 0, "c": 5, "top": "CARANYA ADA", "big": "6", "size": 420, "lines": ["Kita kerjakan satu per satu.", "Mulai dari yang paling sederhana."]}, d=-0.2, trans="zoom"),
  ], music="light", trans="flash"))

# 4 ------------------------------------------------------------------ Poin 1
A.append(scene(4, "Poin 1: Pilih satu tugas", [
    sh(None, pc(1, ["PILIH", "SATU TUGAS"], "Tulis juga targetnya untuk satu sesi."), trans="whip"),
    sh("Bukan mengerjakan rekap", {"type": "splitTask", "at": 0, "ex": 1, "splitAt": C("karena itu terlalu besar", 0.5), "lit": [{"at": C("Tapi mengisi rekap baris satu sampai empat puluh", 0.2), "i": 0}],
        "chip": "BUKAN 'MENGERJAKAN REKAP'", "chipAt": 0.6}, d=-0.2, trans="whip"),
    sh("Kenapa harus satu tugas", {"type": "bigStat", "at": 0, "c": 0, "top": "KENAPA SATU TUGAS?", "big": "1", "size": 430, "lines": ["Begitu ada dua, kamu mulai berpindah,", "dan kembali ke ember bocor."]}, d=-0.2, trans="zoom"),
    sh("Kalau tugasnya besar", {"type": "splitTask", "at": 0, "ex": 2, "splitAt": C("pecah dulu jadi potongan", 0.2),
        "lit": [{"at": C("mengumpulkan data", 0.0), "i": 0}, {"at": C("membuat kerangka", 0.0), "i": 1}, {"at": C("lalu menulis bagian pertama", 0.0), "i": 2}]}, d=-0.2, trans="whip"),
    sh("Potongan kecil terasa ringan untuk dimulai", {"type": "bigStat", "at": 0, "c": 0, "top": "POTONGAN KECIL", "big": "MULAI", "size": 300, "lines": ["Mulai itu bagian tersulitnya,", "jadi buat potongannya kecil."]}, d=-0.2, trans="whip"),
  ], music="light"))

# 5 ------------------------------------------------------------------ Poin 2
A.append(scene(5, "Poin 2: Pasang timer 25 menit", [
    sh(None, pc(2, ["PASANG TIMER", "25 MENIT"], "Singkirkan semua yang bisa menggoda."), trans="whip"),
    sh("Tutup tab lain", {"type": "closeTabs", "at": 0, "closeAt": C("Tutup tab lain", 0.2), "per": 0.55, "flipAt": C("Balik ponselmu menghadap meja", 0.4), "muteAt": C("Matikan notifikasi di komputer", 0.9),
        "chip": "SINGKIRKAN GODAAN", "chipAt": 0.6}, d=-0.2, trans="whip"),
    sh("Kenapa dua puluh lima menit", {"type": "bigStat", "at": 0, "c": 1, "top": "KENAPA 25 MENIT?", "big": "25", "size": 440, "lines": ["Cukup pendek, tidak menakutkan.", "Cukup panjang, untuk masuk ke pekerjaan."]}, d=-0.2, trans="zoom"),
    sh("Dan pengatur waktu itu penting", {"type": "tomatoBig", "at": 0, "runAt": 1.5, "chip": "BERDETAK = ADA GARIS AKHIR", "chipAt": 1.0}, d=-0.2, trans="whip"),
    sh("Pomodoro memang bahasa Italia", {"type": "bigStat", "at": 0, "c": 4, "top": "POMODORO", "big": "TOMAT", "size": 330, "lines": ["Bahasa Italia untuk tomat,", "dari pengatur waktu dapur milik penemunya."]}, d=-0.2, trans="zoom"),
    sh("Pengatur waktu di ponsel pun bisa", {"type": "bigStat", "at": 0, "c": 1, "top": "PAKAI PONSEL?", "big": "OKE", "size": 330, "lines": ["Asal mode jangan ganggu menyala."]}, d=-0.2, trans="whip"),
  ], music="tense"))

# 6 ------------------------------------------------------------------ Poin 3
A.append(scene(6, "Poin 3: Tulis di kertas", [
    sh(None, pc(3, ["TULIS", "DI KERTAS"], "Ada gangguan? Catat, lalu lanjutkan."), trans="whip"),
    sh("Ini langkah yang paling menyelamatkan", {"type": "bigStat", "at": 0, "c": 2, "top": "LANGKAH INI", "big": "PENYELAMAT", "size": 210, "lines": ["Langkah yang paling menyelamatkan", "sesi fokusmu."]}, d=-0.2, trans="zoom"),
    sh("Di tengah sesi, hampir pasti", {"type": "noteDistract", "at": 0, "mode": "main",
        "thoughts": [{"at": C("Harus balas pesan itu", -0.2), "text": "Balas pesan Kak Rina?"}, {"at": C("Harus cek harga", -0.2), "text": "Cek harga tiket"}, {"at": C("Harus tanya teman soal satu kode", -0.2), "text": "Tanya kode K-07"}]}, d=-0.3, trans="whip"),
    sh("Kertas itu berjanji", {"type": "bigStat", "at": 0, "c": 2, "top": "KERTAS ITU BERJANJI", "big": "TENANG", "size": 310, "lines": ["Kamu tidak akan lupa,", "jadi otakmu boleh tenang."]}, d=-0.2, trans="zoom"),
    sh("Dan ada bonusnya", {"type": "bigStat", "at": 0, "c": 5, "top": "BONUSNYA", "big": "SATU GARIS", "size": 200, "lines": ["Melatih diri melihat dorongan,", "tanpa menurutinya."]}, d=-0.2, trans="whip"),
    sh("Gangguan biasanya naik sebentar", {"type": "urgeWave", "at": 0, "cmpAt": 5.2}, d=-0.2, trans="whip"),
    sh("Nanti saat istirahat", {"type": "bigStat", "at": 0, "c": 2, "top": "SAAT ISTIRAHAT", "big": "NANTI", "size": 320, "lines": ["Semua catatan diurus sekaligus.", "Tidak ada yang terlupa."]}, d=-0.2, trans="zoom"),
  ], music="warm"))

# 7 ------------------------------------------------------------------ Poin 4
A.append(scene(7, "Poin 4: Berhenti 5 menit", [
    sh(None, pc(4, ["BERHENTI", "5 MENIT"], "Saat timer berbunyi, benar-benar berhenti."), trans="whip"),
    sh("Sungguh-sungguh berhenti", {"type": "bigStat", "at": 0, "c": 4, "top": "TIMER BERBUNYI", "big": "BERHENTI", "size": 260, "lines": ["Walau sedang asyik,", "walau tinggal sedikit lagi."]}, d=-0.2, trans="zoom"),
    sh("Istirahat lima menit, dan jauh dari layar", {"type": "breakTimeline", "at": 0, "restDur": 15,
        "stages": [{"at": C("Berdiri", -0.1), "label": "BERDIRI", "pose": 1}, {"at": C("minum air", -0.1), "label": "MINUM AIR", "pose": 2}, {"at": C("regangkan bahu", -0.1), "label": "REGANGKAN BAHU", "pose": 3}, {"at": C("lihat jendela", -0.1), "label": "LIHAT JENDELA", "pose": 4}],
        "crossAt": C("Bukan pindah ke media sosial", 0.9)}, d=-0.2, trans="whip"),
    sh("Aku tahu ini terasa berat", {"type": "bigStat", "at": 0, "c": 0, "top": "TIMER BUKAN MUSUH", "big": "BOLEH", "size": 330, "lines": ["Kamu boleh berhenti", "tanpa rasa bersalah."]}, d=-0.2, trans="zoom"),
    sh("Kenapa harus berhenti walau masih semangat", {"type": "bigStat", "at": 0, "c": 3, "top": "ISTIRAHAT TERJADWAL", "big": "SEGAR", "size": 300, "lines": ["Sesi berikutnya tetap segar,", "bukan makin lelah dan makin lambat."]}, d=-0.2, trans="whip"),
    sh("Kalau terus dipaksa", {"type": "bigStat", "at": 0, "c": 4, "top": "KALAU DIPAKSA TERUS", "big": "TURUN", "size": 330, "lines": ["Di jam kedua sudah lelah,", "dan mutunya turun."]}, d=-0.2, trans="zoom"),
    sh("Pada lima menit ini juga", {"type": "noteDistract", "at": 0, "mode": "check", "checks": [C("Balas pesan yang menunggu", 0.2), C("tanyakan hal yang kamu catat", 0.4), C("Semuanya jadi rapi", 0.0)]}, d=-0.2, trans="whip"),
  ], music="warm"))

# 8 ------------------------------------------------------------------ Poin 5
A.append(scene(8, "Poin 5: Empat sesi, istirahat panjang", [
    sh(None, pc(5, ["EMPAT SESI,", "ISTIRAHAT PANJANG"], "Sekitar dua jam fokus, lalu rehat 15–30 menit."), trans="whip"),
    sh("ambil istirahat yang lebih panjang", {"type": "cycleRing", "at": 0, "mode": "ring", "arcAt": [0.0, 0.7, 1.4, 2.1], "longAt": C("lima belas sampai tiga puluh menit", 0.1), "labelAt": C("dua jam kerja fokus", 0.3)}, d=-0.3, trans="whip"),
    sh("Itu sebenarnya banyak sekali", {"type": "bigStat", "at": 0, "c": 5, "top": "EMPAT SESI", "big": "2 JAM", "size": 340, "lines": ["Fokus sungguhan,", "itu sebenarnya banyak sekali."]}, d=-0.2, trans="zoom"),
    sh("Banyak orang mengira harus fokus delapan jam penuh", {"type": "cycleRing", "at": 0, "mode": "cmp", "laneBAt": C("dua atau tiga jam fokus sungguhan", 0.0)}, d=-0.2, trans="whip"),
    sh("Gunakan istirahat panjang", {"type": "bigStat", "at": 0, "c": 3, "top": "ISTIRAHAT PANJANG", "big": "TANPA LAYAR", "size": 190, "lines": ["Makan, berjalan sebentar,", "atau sekadar duduk."]}, d=-0.2, trans="zoom"),
    sh("Dan kalau hari ini kamu hanya sempat dua sesi", {"type": "bigStat", "at": 0, "c": 1, "top": "HANYA SEMPAT DUA SESI?", "big": "2 SESI", "size": 330, "lines": ["Dua sesi yang utuh", "lebih berharga daripada seharian setengah hati."]}, d=-0.2, trans="whip"),
    sh("Yang penting kamu mulai", {"type": "bigStat", "at": 0, "c": 4, "top": "YANG PENTING", "big": "MULAI", "size": 330, "lines": ["Mulai, dan sesinya utuh."]}, d=-0.2, trans="zoom"),
  ], music="warm"))

# 9 ------------------------------------------------------------------ Poin 6
A.append(scene(9, "Poin 6: Sesuaikan dan latih", [
    sh(None, pc(6, ["SESUAIKAN", "DAN LATIH"], "Fokus bukan bakat. Fokus bisa dilatih."), trans="whip"),
    sh("Kalau kamu sering dipanggil", {"type": "adaptDay", "at": 0, "mode": "queue"}, d=-0.2, trans="whip"),
    sh("Pasang status di aplikasi chat", {"type": "adaptDay", "at": 0, "mode": "status", "statusAt": 0.6, "calAt": C("Blok jam fokusmu di kalender", 0.2), "chip": "BERI TAHU TIM"}, d=-0.2, trans="whip"),
    sh("Dan kalau ada yang benar-benar darurat", {"type": "bigStat", "at": 0, "c": 4, "top": "ADA YANG DARURAT?", "big": "STOP", "size": 330, "lines": ["Hentikan sesinya, tidak apa-apa.", "Selesai urusan, mulai sesi baru."]}, d=-0.2, trans="zoom"),
    sh("Terakhir, jangan kecil hati", {"type": "bigStat", "at": 0, "c": 2, "top": "DI MENIT KETUJUH BUKA PONSEL?", "big": "WAJAR", "size": 290, "lines": ["Aku dulu begitu,", "bahkan di menit keempat."]}, d=-0.2, trans="whip"),
    sh("Fokus bukan bakat", {"type": "bigStat", "at": 0, "c": 5, "top": "FOKUS BUKAN BAKAT", "big": "OTOT", "size": 340, "lines": ["Tumbuh lewat latihan."]}, d=-0.2, trans="zoom"),
    sh("Orang yang tadinya punya satu halaman penuh", {"type": "adaptDay", "at": 0, "mode": "tally", "oldAt": 0.6, "newAt": 4.0, "chip": "FOKUS = OTOT"}, d=-0.2, trans="whip"),
  ], music="warm"))

# 10 ----------------------------------------------------------------- Rangkuman
A.append(scene(10, "Rangkuman enam poin", [
    sh(None, {"type": "recapList", "at": 0, "title": "POMODORO · 6 LANGKAH", "rows": [
        {"text": "Pilih satu tugas + target sesi", "icon": "star", "at": C("Satu, pilih satu tugas", -0.1)},
        {"text": "Timer 25 menit, singkirkan godaan", "icon": "tomato", "at": C("Dua, pasang pengatur waktu", -0.1)},
        {"text": "Ada gangguan? Tulis di kertas", "icon": "paper", "at": C("Tiga, ada gangguan", -0.1)},
        {"text": "Timer bunyi: istirahat 5 menit", "icon": "cup", "at": C("Empat, saat berbunyi", -0.1)},
        {"text": "Empat sesi, istirahat panjang", "icon": "boxes", "at": C("Lima, setelah empat sesi", -0.1)},
        {"text": "Sesuaikan pekerjaanmu, latih terus", "icon": "cal", "at": C("Dan enam, sesuaikan", -0.1)}]}, trans="fade"),
  ], music="warm", trans="fade"))

# 11 ----------------------------------------------------------------- Coba besok pagi
A.append({"n": 11, "name": "Coba besok pagi", "loc": "kerja", "music": "warm", "trans": "iris", "post": 3.0, "noHeader": True,
  "locOpt": {"time": "pagi", "clock": "08:00"}, "props": [{"type": "chair16", "x": 830, "y": 1000}, {"type": "deskR", "x": 1210, "y": 1000, "photo": False, "laptop": 1}],
  "shots": [{"at": 0, "blur": 9, "actors": [], "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 18}],
     "fx": [{"type": "tomatoMini", "at": 0.6, "x": 250, "y": 330, "s": 0.9},
            {"type": "lesson", "cue": "Satu, pilih satu tugas, fokus", "d": -0.6, "tag": "COBA BESOK PAGI", "items": [{"cue": "Satu, pilih satu tugas, fokus", "text": "Pilih satu tugas, fokus 25 menit"},
             {"cue": "Dua, kalau ada gangguan", "text": "Ada gangguan? Tulis di kertas, lalu lanjutkan"}, {"cue": "Tiga, istirahat lima menit", "text": "Istirahat 5 menit jauh dari layar, lalu ulangi"}]}]}]})

# 12 ----------------------------------------------------------------- Penggoda Eps 3 + layar akhir
A.append(scene(12, "Cuplikan Eps 3 + layar akhir", [
    sh(None, {"type": "longList", "at": 0, "mode": "list", "dur": 6.0, "chip": "TIDAK PERNAH HABIS", "chipAt": 1.4}, trans="flash"),
    sh("Di episode berikutnya", {"type": "longList", "at": 0, "mode": "vs", "chip": "23 BUTIR vs 3 BARIS", "chipAt": 2.0}, d=-0.2, trans="whip"),
    {"cue": "Kalau video ini bermanfaat", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di kolom komentar"), "nextQuote": "\"23 butir.\"", "nextSub": "Tak pernah habis.", "nextTitle": "Kelas Produktif · Eps 3",
             "nextWho": "sinta", "nextKey": {"pose": "pointUp", "expr": "happy"}, "nextThumb": False, "playlistHead": "Kelas Produktif:", "playlist": "Waktu & Prioritas", "playlistEps": "Eps 1 · 2 · 3",
             "ask": "Di menit keberapa kamu biasanya tergoda membuka ponsel? Tulis di komentar!"}]},
  ], music="tense", trans="flash", post=6.5))


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
                if k == "from" and "time" in o: continue   # nama pengirim di pesan chat, bukan cue
                if isinstance(v, str) and v.lower() not in nar.get(n, "").lower(): bad.append((n, k, v))
            for v in o.values(): walk(v, n)
        elif isinstance(o, list):
            for v in o: walk(v, n)
    for a in A: walk(a, a["n"])
    for b in bad: print("CUE TIDAK DITEMUKAN:", b)
    return not bad


A = json.loads(json.dumps(A))
shot_local(A)
for a in A:
    for s in a.get("shots", []):
        if s.get("sfx"): a.setdefault("sfx", []).extend(s.pop("sfx"))
ep = {"slug": "kelas-02", "title": "Susah Fokus Kerja? Coba Teknik 25 Menit Ini (Pomodoro) | Kelas Produktif Eps 2",
      "series": "Kelas Produktif", "story": "Waktu & Prioritas", "eps": "2", "naskah": NASKAH, "minDur": 480,
      "chapters": [[1, "Tiga jam, dua puluh persen"], [3, "Pindah-pindah itu ada harganya"], [4, "Poin 1: Pilih satu tugas"], [5, "Poin 2: Timer 25 menit"], [6, "Poin 3: Tulis di kertas"], [7, "Poin 4: Berhenti 5 menit"],
                   [8, "Poin 5: Empat sesi"], [9, "Poin 6: Sesuaikan dan latih"], [10, "Rangkuman"], [11, "Coba besok pagi"], [12, "Episode berikutnya"]],
      "parts": [["Masalah", 0, 2], ["6 Langkah", 2, 8], ["Penutup", 8, 11]],
      "lessons": ["Pilih satu tugas, fokus 25 menit.",
                  "Ada gangguan? Tulis di kertas, lalu lanjutkan.",
                  "Istirahat 5 menit jauh dari layar, lalu ulangi."],
      "youtube": {
        "lessonHead": "Coba besok pagi:",
        "about": "Kelas Produktif adalah serial belajar kerja dari Tangani Talenta: penjelasan singkat, cara praktis yang bisa dicoba besok.",
        "desc": "Susah fokus kerja? Tiga jam di depan layar tapi progres baru 20%? Di video ini ada enam langkah teknik Pomodoro: pilih satu tugas dan targetnya, pasang timer 25 menit, tulis gangguan di kertas, istirahat 5 menit jauh dari layar, ambil istirahat panjang setelah empat sesi, lalu sesuaikan dengan pekerjaanmu dan latih terus.",
        "ask": "Di menit keberapa kamu biasanya tergoda membuka ponsel? Tulis di kolom komentar.",
        "next": "Kelas Produktif Eps 3: To-Do List-mu Tidak Pernah Selesai? Ini Kesalahannya.",
        "tags": "kelas produktif, pomodoro, teknik pomodoro, susah fokus kerja, cara fokus kerja, produktivitas kerja, manajemen waktu, tips kerja, dunia kerja, Tangani Talenta",
        "hashtags": "#KelasProduktif #pomodoro #produktivitas",
        "adAfter": 6},
      "thumb": {"kind": "kp2b", "lines": ["SUSAH", "FOKUS KERJA?"], "hl": "COBA 25 MENIT", "lineSize": 96, "hlSize": 78, "badge": "6 LANGKAH", "tag": "KELAS PRODUKTIF · EPS 2"},
      "extras": {}, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
