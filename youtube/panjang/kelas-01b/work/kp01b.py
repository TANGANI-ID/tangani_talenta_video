#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kelas-01b (Kelas Produktif Eps 1 versi 1 narator + 6 poin: "Sibuk Seharian Tapi Tidak Ada yang Selesai? Atur Prioritas Begini").
Tanpa tokoh cerita: semua adegan berupa ilustrasi/infografis (engine/panjang/kit16kp.js: pointCard, treadmill, nightList, timeBars, bigStat, brainDump, twoLamps, matrix4, weekPlan, passCard, morningRule, recapList, tomatoBig).
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() mengubahnya ke {cue shot, d}."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kelas-01b/episode.json"
NASKAH = "youtube/kelas/kp01b-naskah.md"

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
A.append(scene(1, "Capek tapi tidak ke mana-mana", [
    sh(None, {"type": "nightList", "at": 0, "chipAt": 9.0}, trans="fade"),
    sh("Rasanya seperti berlari di atas treadmill", {"type": "treadmill", "at": 0, "chip": "Capek, tapi tidak ke mana-mana.", "chipAt": 1.0}, d=-0.3, trans="whip"),
    sh("Kalau kamu pernah merasa begitu", {"type": "pointCard", "at": 0, "n": 2, "num": "6", "label": "YANG AKAN KAMU DAPAT", "lines": ["LANGKAH", "ATUR PRIORITAS"], "sub": "Cukup kertas, pulpen, dan keberanian memilih.", "noDots": True}, d=-0.3, trans="zoom"),
  ], music="light", trans="fade"))

# 2 ------------------------------------------------------------------ Judul
A.append({"n": 2, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash", "loc": "kerja",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "titleKP", "at": 0, "disc": 0, "eps": "EPS 1", "topic": "WAKTU & PRIORITAS",
     "hook": "Sibuk Seharian Tapi Tidak Ada yang Selesai? Atur Prioritas Begini"}]}]})

# 3 ------------------------------------------------------------------ Sibuk bukan berarti produktif
A.append(scene(3, "Sibuk bukan berarti produktif", [
    sh(None, {"type": "timeBars", "at": 0, "mode": "pie", "labAt": C("Padahal kamu punya dua puluh empat jam", 3.0)}, trans="flash"),
    sh("Yang membedakan adalah urutan", {"type": "timeBars", "at": 0, "mode": "bars", "chipA": "SIBUK: APA SAJA YANG DATANG", "chipB": "MAJU: YANG PALING BERDAMPAK"}, d=-0.2, trans="zoom"),
    sh("Sibuk itu terasa", {"type": "bigStat", "at": 0, "c": 4, "top": "SIBUK ITU TERASA", "big": "HASIL?", "size": 240, "lines": ["Tapi tidak otomatis", "ada hasilnya."]}, d=-0.2, trans="zoom"),
    sh("Jadi tujuan kita bukan mengerjakan semuanya", {"type": "bigStat", "at": 0, "c": 1, "top": "SIBUK  ≠  PRODUKTIF", "big": "PILIH", "size": 320, "lines": ["Yang penting dulu,", "bukan yang banyak."]}, d=-0.2, trans="whip"),
    sh("Coba bayangkan harimu seperti piring", {"type": "bigStat", "at": 0, "c": 0, "top": "HARIMU SEPERTI PIRING", "big": "PILIH", "size": 300, "lines": ["Semua diambil = piring penuh,", "yang paling penting malah jatuh."]}, d=-0.2, trans="zoom"),
  ], music="light", trans="flash"))

# 4 ------------------------------------------------------------------ Poin 1
A.append(scene(4, "Poin 1: Tulis semua dulu", [
    sh(None, pc(1, ["TULIS", "SEMUA DULU"], "Kepala untuk berpikir, bukan untuk menyimpan."), trans="whip"),
    sh("Semua yang ada di kepalamu", {"type": "brainDump", "at": 0, "flyAt": C("Rapat, laporan, balasan pesan", -0.2), "per": 0.8, "chip": "KELUARKAN DARI KEPALA", "chipAt": 1.0}, d=-0.3, trans="whip"),
    sh("Biasanya, saat aku tulis semua", {"type": "bigStat", "at": 0, "c": 0, "top": "SAAT SEMUA DITULIS", "big": "20–30", "size": 330, "lines": ["hal saja,", "bukan seratus."]}, d=-0.2, trans="zoom"),
    sh("Jangan menilai apa pun dulu", {"type": "bigStat", "at": 0, "c": 0, "top": "LANGKAH INI", "big": "TULIS", "size": 320, "lines": ["Jangan menilai dulu,", "termasuk yang bikin malu."]}, d=-0.2, trans="cut"),
  ], music="light"))

# 5 ------------------------------------------------------------------ Poin 2
A.append(scene(5, "Poin 2: Tanya dua hal", [
    sh(None, pc(2, ["TANYA", "DUA HAL"], "Penting itu soal dampak. Mendesak itu soal waktu."), trans="whip"),
    sh("Pertama, kalau tugas ini tidak dikerjakan", {"type": "twoLamps", "at": 0, "start": C("Pertama, kalau tugas ini tidak dikerjakan", 0.0), "per": 3.6,
        "q1At": C("Pertama, kalau tugas ini tidak dikerjakan", 0.2), "q2At": C("Kedua, kalau tidak dikerjakan hari ini", 0.2)}, d=-0.3, trans="whip"),
    sh("Dua hal ini berbeda", {"type": "bigStat", "at": 0, "c": 1, "top": "SERING TERTUKAR", "big": "≠", "size": 380, "lines": ["PENTING = dampak", "MENDESAK = waktu"]}, d=-0.2, trans="zoom"),
    sh("Dan tugas yang paling penting biasanya", {"type": "bigStat", "at": 0, "c": 1, "top": "YANG PENTING BIASANYA", "big": "SEPI", "size": 330, "lines": ["Tidak ada notifikasi yang menagihnya,", "mudah tergeser oleh yang ramai."]}, d=-0.2, trans="whip"),
  ], music="tense"))

# 6 ------------------------------------------------------------------ Poin 3
A.append(scene(6, "Poin 3: Masukkan ke 4 kotak", [
    sh(None, pc(3, ["MASUKKAN", "KE 4 KOTAK"], "Matriks penting–mendesak."), trans="whip"),
    sh("Kotak pertama, penting dan mendesak", {"type": "matrix4", "at": 0, "mode": "card", "title": "MATRIKS PENTING–MENDESAK", "titleAt": 0.1,
        "items": [{"at": C("Kotak pertama", 0.0), "q": 0, "ex": "Sistem klien mati"}, {"at": C("Kotak kedua", 0.0), "q": 1, "ex": "Rencana kerja bulan depan"},
                  {"at": C("Kotak ketiga", 0.0), "q": 2, "ex": "Minta foto kardus"}, {"at": C("Kotak keempat", 0.0), "q": 3, "ex": "Stiker grup alumni"}]}, d=-0.3, trans="zoom"),
    sh("Kalau kamu lakukan ini jujur", {"type": "bigStat", "at": 0, "c": 2, "top": "KOTAK PALING BERHARGA", "big": "KOTAK 2", "size": 280, "lines": ["Tempat pekerjaan yang membuatmu maju.", "Pindahkan hidupmu pelan-pelan dari kotak 1 ke kotak 2."]}, d=-0.2, trans="whip"),
  ], music="warm"))

# 7 ------------------------------------------------------------------ Poin 4
A.append(scene(7, "Poin 4: Beri jam", [
    sh(None, pc(4, ["BERI", "JAM"], "Bukan \"nanti\", tapi \"Rabu jam 2\"."), trans="whip"),
    sh("Bukan", {"type": "weekPlan", "at": 0, "crossAt": 2.4, "flyAt": 3.6, "alarmAt": 5.6, "chip": "Bukan 'nanti', tapi 'Rabu jam 2'.", "chipAt": 1.2}, d=-0.2, trans="whip"),
    sh("Kalau kamu tunda terus", {"type": "bigStat", "at": 0, "c": 3, "top": "YANG TIDAK MENDESAK", "big": "DARURAT", "size": 260, "lines": ["Ditunda terus, suatu hari", "ia berubah jadi darurat."]}, d=-0.2, trans="zoom"),
    sh("Jadi ia harus punya tempat di kalender", {"type": "bigStat", "at": 0, "c": 1, "top": "TULIS JAMNYA, PASANG PENGINGATNYA", "big": "JANJI", "size": 330, "lines": ["Anggap seperti rapat dengan atasan,", "tidak dibatalkan sembarangan."]}, d=-0.2, trans="whip"),
    sh("Kalau tiba-tiba ada yang mengajak", {"type": "bigStat", "at": 0, "c": 3, "top": "KALAU ADA YANG MENGAJAK DI JAM ITU", "big": "JAM INI?", "size": 260, "lines": ["Jam segitu aku sudah ada janji,", "bisa jam berikutnya?"]}, d=-0.2, trans="zoom"),
    sh("Ukurannya juga kecil", {"type": "bigStat", "at": 0, "c": 3, "top": "UKURANNYA KECIL", "big": "45", "size": 400, "lines": ["menit yang pasti", "lebih berguna dari tiga jam niat."]}, d=-0.2, trans="whip"),
  ], music="warm"))

# 8 ------------------------------------------------------------------ Poin 5
A.append(scene(8, "Poin 5: Serahkan atau bilang tidak", [
    sh(None, pc(5, ["SERAHKAN ATAU", "BILANG TIDAK"], "Tidak itu bukan egois."), trans="whip"),
    sh("Kalau tugas itu mendesak tapi bukan bagianmu", {"type": "passCard", "at": 0, "mode": "pass", "moveAt": 1.6, "card": "Pesan minta foto"}, d=-0.2, trans="whip"),
    sh("Kalau cuma perlu satu kalimat", {"type": "passCard", "at": 0, "mode": "no", "ask": "Data stok sudah dikirim belum?", "reply": "Sudah, kukirim ya.", "replyAt": 1.8, "noStamp": True}, d=-0.2, trans="whip"),
    sh("Dan kalau tugas itu tidak penting", {"type": "passCard", "at": 0, "mode": "bin", "dropAt": 1.8, "card": "Stiker grup alumni"}, d=-0.2, trans="whip"),
    sh("Mengatakan tidak itu bukan egois", {"type": "passCard", "at": 0, "mode": "no", "replyAt": C("Cukup bilang", 0.2), "stampAt": C("Orang biasanya mengerti", 0.1), "reply": "Aku lagi pegang ini sampai jam 10, ya."}, d=-0.3, trans="whip"),
    sh("Yang membuat orang kecewa", {"type": "bigStat", "at": 0, "c": 4, "top": "YANG MEMBUAT KECEWA", "big": "IYA", "size": 360, "lines": ["Bukan kata tidak,", "tapi iya yang tidak pernah ditepati."]}, d=-0.2, trans="zoom"),
  ], music="tense"))

# 9 ------------------------------------------------------------------ Poin 6
A.append(scene(9, "Poin 6: Satu tugas penting dulu", [
    sh(None, pc(6, ["SATU TUGAS", "PENTING DULU"], "Baru buka chat."), trans="whip"),
    sh("Pagi hari, tanganmu pasti langsung", {"type": "morningRule", "at": 0, "reachAt": C("langsung meraih ponsel", -1.0), "flipAt": C("balik ponselmu menghadap meja", 0.3),
        "checkAt": C("buka tugas yang tadi sudah kamu beri jam", 0.2), "openAt": 1e5, "chip": "SATU TUGAS DULU, BARU CHAT", "chipAt": 1.0}, d=-0.3, trans="whip"),
    sh("Itu enam langkahnya", {"type": "bigStat", "at": 0, "c": 5, "top": "ITU ENAM LANGKAHNYA", "big": "6", "size": 420, "lines": ["Bisa dilakukan hari ini juga,", "di kantor mana pun."]}, d=-0.2, trans="zoom"),
    sh("Aku sudah mencobanya", {"type": "morningRule", "at": 0, "sunOff": 6, "reachAt": -50, "flipAt": -49, "checkAt": -48, "openAt": C("Dua puluh tiga pesan menunggu", -0.2), "chip": "23 PESAN MENUNGGU", "chipAt": 0.5}, d=-0.2, trans="whip"),
    sh("Kalau satu tugas penting sudah selesai", {"type": "bigStat", "at": 0, "c": 5, "top": "SEBELUM JAM SEMBILAN", "big": "MENANG", "size": 300, "lines": ["Kamu bekerja dari posisi sudah menang,", "bukan dari posisi mengejar."]}, d=-0.2, trans="zoom"),
  ], music="warm"))

# 10 ----------------------------------------------------------------- Rangkuman
A.append(scene(10, "Rangkuman enam poin", [
    sh(None, {"type": "recapList", "at": 0, "rows": [
        {"text": "Tulis semua dulu", "icon": "paper", "at": C("Satu, tulis semua dulu", -0.1)},
        {"text": "Tanya dua hal: penting & mendesak", "icon": "star", "at": C("Dua, tanya dua hal", -0.1)},
        {"text": "Masukkan ke 4 kotak", "icon": "boxes", "at": C("Tiga, masukkan ke empat kotak", -0.1)},
        {"text": "Yang penting tapi tidak mendesak: beri jam", "icon": "cal", "at": C("Empat, yang penting tapi tidak mendesak", -0.1)},
        {"text": "Serahkan atau berani bilang tidak", "icon": "hand", "at": C("Lima, serahkan atau berani bilang tidak", -0.1)},
        {"text": "Satu tugas penting dulu, baru buka chat", "icon": "flip", "at": C("Dan enam, satu tugas penting dulu", -0.1)}]}, trans="fade"),
  ], music="warm", trans="fade"))

# 11 ----------------------------------------------------------------- Coba besok pagi
A.append({"n": 11, "name": "Coba besok pagi", "loc": "kerja", "music": "warm", "trans": "iris", "post": 3.0, "noHeader": True,
  "locOpt": {"time": "pagi", "clock": "08:00"}, "props": [{"type": "chair16", "x": 830, "y": 1000}, {"type": "deskR", "x": 1210, "y": 1000, "photo": False, "laptop": 1}],
  "shots": [{"at": 0, "blur": 9, "actors": [], "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 18}],
     "fx": [{"type": "matrixMini", "at": 0.6, "x": 250, "y": 190, "s": 0.8},
            {"type": "lesson", "cue": "Satu, tulis semua tugasmu", "d": -0.6, "tag": "COBA BESOK PAGI", "items": [{"cue": "Satu, tulis semua tugasmu", "text": "Tulis semua tugasmu, masukkan ke 4 kotak"},
             {"cue": "Dua, yang penting tapi tidak mendesak", "text": "Yang penting tapi tidak mendesak: beri jam"}, {"cue": "Tiga, kerjakan satu tugas", "text": "Kerjakan satu tugas penting sebelum membuka chat"}]}]}]})

# 12 ----------------------------------------------------------------- Penggoda Eps 2 + layar akhir
A.append(scene(12, "Cuplikan Eps 2 + layar akhir", [
    sh(None, {"type": "tabsLaptop", "at": 0, "from": 540, "to": 720, "dur": 7.0, "pct": 0.2, "chip": "3 JAM · BARU 20%", "chipAt": C("dua puluh persen", -0.6)}, trans="flash"),
    sh("Di episode berikutnya", {"type": "tomatoBig", "at": 0, "runAt": 1.4, "chip": "25 MENIT · SATU TUGAS", "chipAt": 0.8}, d=-0.2, trans="whip"),
    {"cue": "Kalau video ini bermanfaat", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di kolom komentar"), "nextQuote": "\"Dua puluh lima menit.\"", "nextSub": "Satu tugas.", "nextTitle": "Kelas Produktif · Eps 2",
             "nextWho": "yoga", "nextKey": {"pose": "pointUp", "expr": "happy"}, "nextThumb": False, "playlistHead": "Kelas Produktif:", "playlist": "Waktu & Prioritas", "playlistEps": "Eps 1 · 2 · 3",
             "ask": "Dari enam langkah tadi, mana yang paling sulit buatmu? Tulis di komentar!"}]},
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
ep = {"slug": "kelas-01b", "title": "Sibuk Seharian Tapi Tidak Ada yang Selesai? Atur Prioritas Begini | Kelas Produktif Eps 1",
      "series": "Kelas Produktif", "story": "Waktu & Prioritas", "eps": "1", "naskah": NASKAH, "minDur": 480,
      "chapters": [[1, "Capek tapi tidak ke mana-mana"], [3, "Sibuk bukan berarti produktif"], [4, "Poin 1: Tulis semua dulu"], [5, "Poin 2: Tanya dua hal"], [6, "Poin 3: Empat kotak"], [7, "Poin 4: Beri jam"],
                   [8, "Poin 5: Serahkan atau bilang tidak"], [9, "Poin 6: Satu tugas penting dulu"], [10, "Rangkuman"], [11, "Coba besok pagi"], [12, "Episode berikutnya"]],
      "parts": [["Masalah", 0, 2], ["6 Langkah", 2, 8], ["Penutup", 8, 11]],
      "lessons": ["Tulis semua tugasmu, lalu masukkan ke empat kotak: penting dan mendesak, penting tidak mendesak, mendesak tidak penting, tidak penting.",
                  "Yang penting tapi tidak mendesak: beri jam, jangan cuma \"nanti\".",
                  "Kerjakan satu tugas penting sebelum membuka chat."],
      "youtube": {
        "lessonHead": "Coba besok pagi:",
        "about": "Kelas Produktif adalah serial belajar kerja dari Tangani Talenta: penjelasan singkat, cara praktis yang bisa dicoba besok.",
        "desc": "Sibuk seharian, ponsel penuh balasan, tapi pekerjaan terpenting belum ada yang selesai? Di video ini ada enam langkah mengatur prioritas kerja harian: tulis semua dulu, tanya dua hal, masukkan ke empat kotak (matriks penting-mendesak), beri jam, serahkan atau berani bilang tidak, dan kerjakan satu tugas penting sebelum membuka chat.",
        "ask": "Dari enam langkah tadi, mana yang paling sulit buatmu? Tulis di kolom komentar.",
        "next": "Kelas Produktif Eps 2: Susah Fokus Kerja? Coba Teknik 25 Menit Ini (Pomodoro).",
        "tags": "kelas produktif, prioritas kerja, matriks eisenhower, penting mendesak, produktivitas kerja, manajemen waktu, sibuk tapi tidak produktif, tips kerja, dunia kerja, Tangani Talenta",
        "hashtags": "#KelasProduktif #produktivitas #duniakerja",
        "adAfter": 6},
      "thumb": {"kind": "kp1b", "lines": ["SIBUK TAPI", "TAK SELESAI?"], "hl": "ATUR PRIORITAS", "lineSize": 90, "hlSize": 72, "badge": "6 LANGKAH", "tag": "KELAS PRODUKTIF · EPS 1"},
      "extras": {}, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
