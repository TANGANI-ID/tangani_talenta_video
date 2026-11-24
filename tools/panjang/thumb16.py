#!/usr/bin/env python3
"""Thumbnail 1280x720 untuk episode 16:9: Rina besar (sedih) di depan, pengumuman + konfeti untuk Sinta di belakang,
teks hook + lencana episode. usage: ~/.cache/studio-deps/venv/bin/python tools/panjang/thumb16.py youtube/panjang/kantor-01"""
import base64, io, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from page16 import open_page, timeline, ROOT  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402
from PIL import Image, ImageDraw, ImageFilter, ImageFont  # noqa: E402

FD = Path.home() / ".cache/studio-deps"
JS = r"""() => {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d'), S = S16, T = TT;
  const cam = S.makeCam(1180, 470, 1.05, 0, 0, 0, 0);
  S.LOC.rapat.bg(x, cam, 4.2, { slide: 'sinta', clock: '08:06', backChairs: [] });
  x.save(); cam.apply(x, 1);
  const put = (who, o, keys, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: -1, seed: o.x * .01 }, look, o, { keys });
    const st = T.toonState(a, null, t); st.talk = false; T.drawToon(x, a, st, t); };
  put('hendra', { x: 1020, y: 990, size: 470, face: 1 }, [{ at: 0, pose: 'point', expr: 'laugh' }], 1.2);
  put('sinta', { x: 1420, y: 990, size: 470, face: -1 }, [{ at: 0, pose: 'cheer', expr: 'laugh' }], 1.3);
  put('bayu', { x: 1760, y: 1000, size: 470, face: -1 }, [{ at: 0, pose: 'clap', expr: 'happy' }], 1.25);
  x.restore();
  S.grade(x, { warm: .12, vig: .2 });
  S.FX.confetti.draw(x, { at: 0, x: 1420, y: 330, count: 120 }, .75);
  x.fillStyle = 'rgba(19,34,61,.35)'; x.fillRect(0, 0, 1920, 1080);
  // Rina big in front, sad, looking at the viewer
  const look = S.cast.rina.look; const a = Object.assign({ x: 560, y: 1880, size: 1560, face: 1, seed: 3 }, look, { keys: [{ at: 0, pose: 'sad', expr: 'sad', look: 'cam' }] });
  const st = T.toonState(a, null, 5); st.talk = false; T.drawToon(x, a, st, 5.25);
  return c.toDataURL('image/png').slice(22); }"""

# Eps 2 ("aman"): Rina big in front, forced smile + thumbs up; behind her Bu Ratna asks, empty folder on the laptop
JS_AMAN = r"""() => {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d'), S = S16, T = TT;
  const cam = S.makeCam(1150, 500, 1.1, 0, 0, 0, 0);
  S.LOC.kerja.bg(x, cam, 3.1, { time: 'sore', clock: '16:30' });
  x.save(); cam.apply(x, 1);
  S.PROP.deskR(x, { laptop: 1, cups: 4, photo: false }, 2); x.restore();
  const look0 = S.cast.ratna.look; const r = Object.assign({ x: 1500, y: 1060, size: 640, face: -1, seed: 2 }, look0, { keys: [{ at: 0, pose: 'hold', expr: 'happy', look: [-1, .2] }] });
  x.save(); cam.apply(x, 1); const s0 = T.toonState(r, null, 2); s0.talk = false; T.drawToon(x, r, s0, 2); x.restore();
  // empty-folder screen floating behind
  x.save(); x.translate(1330, 300); x.rotate(.05); x.fillStyle = '#26252B'; x.fillRect(-250, -150, 500, 300); x.fillStyle = '#F4F6F8'; x.fillRect(-232, -132, 464, 264);
  x.fillStyle = '#E5E7EB'; x.fillRect(-60, -60, 120, 80); x.font = '800 34px Poppins'; x.textAlign = 'center'; x.fillStyle = '#D9483B'; x.fillText('0 item', 0, 80); x.restore();
  S.grade(x, { warm: .12, vig: .25 });
  x.fillStyle = 'rgba(19,34,61,.28)'; x.fillRect(0, 0, 1920, 1080);
  const look = S.cast.rina.look; const a = Object.assign({ x: 520, y: 1820, size: 1500, face: 1, seed: 3 }, look, { keys: [{ at: 0, pose: 'pointUp', expr: 'laugh', look: 'cam', emote: 'sweat' }] });
  const st = T.toonState(a, null, 5); st.talk = false; T.drawToon(x, a, st, 5.25);
  const k = 1500 / 92; S.PROP.hand_thumb(x, 520 + 25 * k, 1820 - 71 * k, k, 1, 5);
  return c.toDataURL('image/png').slice(22); }"""
# Eps 3 ("radar"): Rina big in front at night in the kos room, phone glowing with Bu Ratna's messages behind her
JS_RADAR = r"""() => {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d'), S = S16, T = TT;
  const cam = S.makeCam(1050, 500, 1.05, 0, 0, 0, 0);
  S.LOC.kos.bg(x, cam, 3.1, {});
  S.grade(x, { warm: .1, vig: .3 }); x.fillStyle = 'rgba(19,20,50,.45)'; x.fillRect(0, 0, 1920, 1080);
  // floating lock-screen notifications from Bu Ratna
  [['23.07', 'Rin, sudah dicek?', 1000, 230, -.05], ['23.21', 'Rin?', 1110, 400, .04], ['23.40', 'Rin, laporan besok jam berapa?', 1020, 570, -.03]].forEach(([tm, tx, px, py, r]) => {
    x.save(); x.translate(px, py); x.rotate(r); x.scale(.9, .9); x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.roundRect(-330, -70, 660, 140, 28); x.fill();
    x.fillStyle = '#6E2430'; x.beginPath(); x.arc(-262, 0, 40, 0, 7); x.fill(); x.fillStyle = '#FFF'; x.font = '800 44px Poppins'; x.textAlign = 'center'; x.fillText('R', -262, 16);
    x.textAlign = 'left'; x.fillStyle = '#13223D'; x.font = '800 32px Poppins'; x.fillText('Bu Ratna', -200, -14); x.fillStyle = '#6B7280'; x.font = '600 26px Poppins'; x.fillText(tm, 200, -14);
    x.fillStyle = '#111827'; x.font = '600 30px Poppins'; x.fillText(tx.length > 24 ? tx.slice(0, 23) + '…' : tx, -200, 34); x.restore(); });
  const look = S.cast.rina.look; const a = Object.assign({ x: 520, y: 1820, size: 1500, face: 1, seed: 3 }, look, { keys: [{ at: 0, pose: 'phone', expr: 'shock', look: 'cam', emote: 'sweat' }] });
  const st = T.toonState(a, null, 5); st.talk = false; T.drawToon(x, a, st, 5.25);
  const k = 1500 / 92; S.PROP.hand_phoneBuzz(x, 520 + 17 * k, 1820 - 43 * k, k, 1, 5);
  return c.toDataURL('image/png').slice(22); }"""
# Eps 4 ("nilai"): Rina big in front, laughing with thumbs up; behind her the review sheet: CUKUP crossed out, SANGAT BAIK circled
JS_NILAI = r"""() => {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d'), S = S16, T = TT;
  const cam = S.makeCam(1150, 500, 1.1, 0, 0, 0, 0);
  S.LOC.kerja.bg(x, cam, 3.1, { time: 'siang', clock: '10:00' });
  S.grade(x, { warm: .12, vig: .25 }); x.fillStyle = 'rgba(19,34,61,.3)'; x.fillRect(0, 0, 1920, 1080);
  // floating review sheet
  x.save(); x.translate(1240, 330); x.rotate(.06); x.fillStyle = 'rgba(0,0,0,.3)'; x.fillRect(-372, -212, 760, 440); x.fillStyle = '#FFFFFF'; x.fillRect(-380, -220, 760, 440);
  x.fillStyle = '#13223D'; x.fillRect(-380, -220, 760, 80); x.font = '800 34px Poppins'; x.textAlign = 'center'; x.fillStyle = '#FFF'; x.fillText('PENILAIAN KINERJA', 0, -166);
  [['CUKUP', '#D9483B', -190], ['SANGAT BAIK', '#3BA36B', 170]].forEach(([l, col, px], i) => { x.fillStyle = i ? '#DDF3E6' : '#FDE2DF'; x.strokeStyle = col; x.lineWidth = 5; x.beginPath(); x.roundRect(px - 150, -40, 300, 110, 16); x.fill(); x.stroke();
    x.font = '800 40px Poppins'; x.fillStyle = col; x.fillText(l, px, 28); });
  x.strokeStyle = '#D9483B'; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); x.moveTo(-320, -10); x.lineTo(-60, 40); x.stroke();
  x.strokeStyle = '#3BA36B'; x.lineWidth = 9; x.beginPath(); x.ellipse(170, 15, 190, 85, 0, 0, 7); x.stroke();
  x.font = '800 30px Poppins'; x.fillStyle = '#3BA36B'; x.fillText('TERBAIK DI TIM', 170, 150); x.restore();
  const look = S.cast.rina.look; const a = Object.assign({ x: 520, y: 1820, size: 1500, face: 1, seed: 3 }, look, { keys: [{ at: 0, pose: 'pointUp', expr: 'laugh', look: 'cam', emote: 'sparkle' }] });
  const st = T.toonState(a, null, 5); st.talk = false; T.drawToon(x, a, st, 5.25);
  const k = 1500 / 92; S.PROP.hand_thumb(x, 520 + 25 * k, 1820 - 71 * k, k, 1, 5);
  return c.toDataURL('image/png').slice(22); }"""
# Klien Terbesar Eps 1 ("lobi"): Pak Wijaya big in front, furious with open palms ("siapa yang bertanggung jawab?!"); Rina behind him, nervous; brochures flying off the desk
JS_LOBI = r"""() => {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d'), S = S16, T = TT;
  const cam = S.makeCam(1000, 470, 1.05, 0, 0, 0, 0);
  S.LOC.lobi.bg(x, cam, 3.1, { time: 'pagi', deskX: 760, slam: 3.0, slamX: 120 });
  S.grade(x, { warm: .12, vig: .25 }); x.fillStyle = 'rgba(19,34,61,.22)'; x.fillRect(0, 0, 1920, 1080);
  const put = (who, o, key, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: 1, seed: 3 }, look, o, { keys: [Object.assign({ at: 0 }, key)] });
    const st = T.toonState(a, null, t); st.talk = false; T.drawToon(x, a, st, t); return st; };
  // Rina (medium, behind), nervous smile + sweat
  put('rina', { x: 150, y: 1240, size: 820, face: 1 }, { pose: 'scared', expr: 'scared', look: [1, -.3], emote: 'sweat' }, 4.2);
  // Pak Wijaya (big, front), furious, both palms open
  put('wijaya', { x: 640, y: 1850, size: 1400, face: 1 }, { pose: 'shrug', expr: 'angry', look: 'cam', emote: 'anger' }, 5.25);
  // shout burst
  x.save(); x.translate(700, 150); x.rotate(-.06); x.fillStyle = '#FFF1C9'; x.strokeStyle = '#2B1A12'; x.lineWidth = 8; x.beginPath();
  for (let i = 0; i < 24; i++){ const an = i / 24 * Math.PI * 2, r = i % 2 ? 1.18 : 1; x.lineTo(Math.cos(an) * 250 * r, Math.sin(an) * 95 * r); } x.closePath(); x.fill(); x.stroke();
  x.font = '800 54px Poppins'; x.textAlign = 'center'; x.fillStyle = '#3B2418'; x.fillText('SIAPA?!', 0, 20); x.restore();
  return c.toDataURL('image/png').slice(22); }"""
# Klien Terbesar Eps 2 ("gudang"): Dodi big in front, arms crossed, pencil behind the ear; Rina behind with her yellow notebook; racks + RAK TAHAN
JS_GUDANG = r"""() => {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d'), S = S16, T = TT;
  const cam = S.makeCam(1000, 470, 1.05, 0, 0, 0, 0);
  S.LOC.gudang.bg(x, cam, 3.1, { emptyRack: { x: 500, w: 560, label: 'WIJAYA · TK-12' }, boxes: [] });
  S.grade(x, { warm: .1, vig: .3 }); x.fillStyle = 'rgba(19,34,61,.25)'; x.fillRect(0, 0, 1920, 1080);
  const put = (who, o, key, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: 1, seed: 3 }, look, o, { keys: [Object.assign({ at: 0 }, key)] });
    const st = T.toonState(a, null, t); st.talk = false; T.drawToon(x, a, st, t); return st; };
  const rk = 780 / 92; put('rina', { x: 130, y: 1200, size: 780, face: 1 }, { pose: 'hold', expr: 'scared', look: [1, -.3], emote: 'sweat' }, 4.2); S.PROP.hand_notebook(x, 130 + 21 * rk, 1200 - 47 * rk, rk, 1, 4.2);
  put('dodi', { x: 720, y: 1560, size: 1120, face: 1 }, { pose: 'cross', expr: 'angry', look: 'cam' }, 5.25);
  x.save(); x.translate(700, 150); x.rotate(-.05); x.fillStyle = '#FFF1C9'; x.strokeStyle = '#2B1A12'; x.lineWidth = 8; x.beginPath();
  for (let i = 0; i < 24; i++){ const an = i / 24 * Math.PI * 2, r = i % 2 ? 1.16 : 1; x.lineTo(Math.cos(an) * 300 * r, Math.sin(an) * 95 * r); } x.closePath(); x.fill(); x.stroke();
  x.font = '800 46px Poppins'; x.textAlign = 'center'; x.fillStyle = '#3B2418'; x.fillText('SALAH GUDANG LAGI?', 0, 16); x.restore();
  return c.toDataURL('image/png').slice(22); }"""
JSS = {"aman": JS_AMAN, "radar": JS_RADAR, "nilai": JS_NILAI, "lobi": JS_LOBI, "gudang": JS_GUDANG}
# Klien Terbesar Eps 3 ("hari7"): Pak Wijaya big in front, hands on hips, brown notebook; Rina nervous behind; Melati room with the email + "7 HARI" easel
JS_HARI7 = r"""() => {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d'), S = S16, T = TT;
  const cam = S.makeCam(1000, 470, 1.05, 0, 0, 0, 0);
  S.LOC.rapat.bg(x, cam, 3.1, { slide: 'email', hl7: 0, clock: '09:00', backChairs: [] });
  x.save(); cam.apply(x, 1); x.translate(1180, 1000); x.scale(1.1, 1.1); S.PROP.easel7(x, {}, 3); x.restore();
  S.grade(x, { warm: .1, vig: .3 }); x.fillStyle = 'rgba(19,34,61,.22)'; x.fillRect(0, 0, 1920, 1080);
  const put = (who, o, key, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: 1, seed: 3 }, look, o, { keys: [Object.assign({ at: 0 }, key)] });
    const st = T.toonState(a, null, t); st.talk = false; T.drawToon(x, a, st, t); return st; };
  put('rina', { x: 140, y: 1230, size: 800, face: 1 }, { pose: 'scared', expr: 'scared', look: [1, -.3], emote: 'sweat' }, 4.2);
  const wk = 1150 / 92; put('wijaya', { x: 680, y: 1600, size: 1150, face: 1 }, { pose: 'hold', expr: 'angry', look: 'cam' }, 5.25); S.PROP.hand_bon(x, 680 + 21 * wk, 1600 - 47 * wk, wk, 1, 5.25);
  return c.toDataURL('image/png').slice(22); }"""
JSS["hari7"] = JS_HARI7
# Klien Terbesar Eps 4 ("gudang4"): Dodi big in front with his pocket notebook, green status board + "42 → 14 MENIT" (drawn in engine/panjang/kit16h.js)
JSS["gudang4"] = "() => S16.thumbs.gudang4()"


def F(w, s):
    return ImageFont.truetype(str(FD / f"fontsource-poppins-5.3.0/package/files/poppins-latin-{w}-normal.woff"), s)


def main():
    d = Path(sys.argv[1]).resolve(); work = d / "work"; work.mkdir(exist_ok=True)
    tl = json.loads((work / "timeline.json").read_text()) if (work / "timeline.json").exists() else timeline(d)
    with sync_playwright() as pw:
        pg = open_page(pw, d, tl, None, log=False)
        cfg = json.loads((d / "episode.json").read_text("utf-8")).get("thumb", {})
        png = base64.b64decode(pg.evaluate(JSS.get(cfg.get("kind"), JS))); pg._browser.close()
    im = Image.open(io.BytesIO(png)).convert("RGB").resize((1280, 720), Image.LANCZOS); im.save(work / "thumb_raw.png")
    dr = ImageDraw.Draw(im, "RGBA")
    # dark band behind the hook text (right side)
    band = Image.new("L", (1280, 720), 0); bd = ImageDraw.Draw(band); bd.polygon([(640, 0), (1280, 0), (1280, 720), (560, 720)], fill=150)
    im.paste(Image.new("RGB", (1280, 720), "#13223D"), (0, 0), band.filter(ImageFilter.GaussianBlur(30)))
    dr = ImageDraw.Draw(im)
    dr.rounded_rectangle((700, 52, 1220, 104), 14, fill="#C2691F"); dr.text((960, 78), cfg.get("tag", "KANTOR TANGANI · TAK TERLIHAT"), font=F(800, 27), fill="white", anchor="mm")
    L1, L2 = cfg.get("lines", ["PALING", "RAJIN,"]); HL = cfg.get("hl", "TAPI…"); hs = cfg.get("hlSize", 150 if len(HL) <= 6 else 112)
    ls = cfg.get("lineSize", 108)
    dr.text((1230, 210), L1, font=F(800, ls), fill="white", anchor="rm", stroke_width=8, stroke_fill="#13223D")
    dr.text((1230, 330), L2, font=F(800, ls), fill="white", anchor="rm", stroke_width=8, stroke_fill="#13223D")
    dr.text((1230, 470), HL, font=F(800, hs), fill="#F6C343", anchor="rm", stroke_width=10, stroke_fill="#13223D")
    dr.rounded_rectangle((990, 570, 1230, 650), 40, fill="white", outline="#13223D", width=5); dr.text((1110, 611), cfg.get("badge", "EPS 1/4"), font=F(800, 44), fill="#C2691F", anchor="mm")
    lg = Image.open(ROOT / "site/public/logo.png").convert("RGBA"); lg.thumbnail((52, 52))
    dr.ellipse((30, 24, 100, 94), fill="#FFF6EA"); im.paste(lg, (65 - lg.width // 2, 59 - lg.height // 2), lg)
    im.save(d / "thumbnail.jpg", quality=92); print("thumbnail:", d / "thumbnail.jpg")


if __name__ == "__main__":
    main()
