"""Audio for a 9:16 short: same cuts as render_short.js, Arric's cloned voice (speech-to-speech),
TTS call-to-action line over the full-screen end card, ducked music bed, SFX, -14 LUFS.
usage: python3 mix_short.py <name> out.wav"""
import json, os, subprocess, sys
import numpy as np

SR = 48000
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio")


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def movavg(x, w):
    c = np.concatenate([[0.0], np.cumsum(x, dtype=np.float64)])
    y = (c[w:] - c[:-w]) / w
    return np.pad(y, (w // 2, len(x) - len(y) - w // 2), mode="edge").astype(np.float32)


db = lambda x: 10 ** (x / 20)
rms_db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)

HERE = os.path.dirname(os.path.abspath(__file__))
name, out = sys.argv[1], sys.argv[2]
T = json.loads(subprocess.run(["node", os.path.join(HERE, "shorts.js"), name], capture_output=True, text=True, check=True).stdout)
n = int(round(T["dur"] * SR)); t = np.arange(n) / SR

sts = load(os.path.join(A, "sts", "Avatar Video_1080p.mp3"))
voice = np.zeros(n, np.float32)
fl = int(0.012 * SR)
for s in T["segs"]:
    seg = sts[int(s["in"] * SR):int(s["out"] * SR)].copy()
    seg[:fl] *= np.linspace(0, 1, fl); seg[-fl:] *= np.linspace(1, 0, fl)
    o = int(round(s["tl"] * SR)); voice[o:o + len(seg)] += seg[: n - o]
cta = load(os.path.join(A, "tts", "cta_full_video.mp3"))       # same cloned voice, plays over the end card only
o = int((T["ctaAt"] + 0.35) * SR); cta = cta[: n - o]
cta *= db(rms_db(voice[np.abs(voice) > 0.01]) - rms_db(cta[np.abs(cta) > 0.01]))
voice[o:o + len(cta)] += cta
voice *= db(-17 - rms_db(voice[np.abs(voice) > 0.01]))

music = load(os.path.join(A, "music.mp3")); music = np.tile(music, int(np.ceil(n / len(music))))[:n]
music *= db(-35 - rms_db(music[: 30 * SR]))
env = np.sqrt(movavg(voice ** 2, int(0.05 * SR)))
gain = db(-4 * movavg((env > db(-40)).astype(np.float32), int(0.25 * SR))).astype(np.float32)
k = t >= T["ctaAt"]; gain[k] *= db(3 * np.clip((t[k] - T["ctaAt"]) / 0.8, 0, 1))
k = t >= T["dur"] - 1.0; gain[k] *= np.clip((T["dur"] - t[k]) / 1.0, 0, 1)
gain[t < 0.4] *= t[t < 0.4] / 0.4
music *= gain

sfx = np.zeros(n, np.float32); cache = {}
def hit(nm, at, level):
    if nm not in cache:
        x = load(os.path.join(A, nm + ".mp3")); cache[nm] = x * db(level - rms_db(x[np.abs(x) > 0.005]))
    x, o = cache[nm], int(at * SR); x = x[: n - o]; sfx[o:o + len(x)] += x
for s in T["shotTl"][1:]:
    hit("softpop", s["tl"] + 0.05, -28)
for s in T["segs"][1:]:
    hit("whoosh", s["tl"], -28)
hit("whooshclick", T["ctaAt"], -25)
hit("chime", T["ctaAt"] + 4.3, -27)

mix = voice + music + sfx
tmp = out + ".raw.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-ac", "2", "-c:a", "pcm_f32le", tmp],
               input=mix.astype(np.float32).tobytes(), check=True)
def lufs(p):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", p, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(r[r.rindex("I:"):].split()[1])
g = -14 - lufs(tmp)
for _ in range(3):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={g:.2f}dB,alimiter=limit=0.84:attack=2:release=50:level=false",
                    "-ar", str(SR), "-ac", "2", out], check=True)
    got = lufs(out)
    if abs(got + 14) < 0.2: break
    g += -14 - got
os.remove(tmp); print(f"{name}: {got:.1f} LUFS -> {out}")
