"""Audio mix: Arric's cloned voice (speech-to-speech) + ducked music bed + shot-synced SFX, -14 LUFS."""
import json, os, subprocess, sys
import numpy as np

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, "audio")
TIM = json.load(open(os.path.join(HERE, "timing.json")))
SHOTS, END = TIM["shots"], TIM["end"]
DUR = END + 1.0
# shot modes, matching stage.html: f = full-screen data stage, s = split screen
MODES = "ssssssss" "ffff" "s" "fffff" "sss" "ffff" "sss" "ff" "s"


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
n = int(round(DUR * SR))
t = np.arange(n) / SR

sts = os.path.join(A, "sts", "Avatar Video_1080p.mp3")
if not os.path.exists(sts):
    sys.exit("run .claude/skills/arric-talking-head/scripts/sts_convert.py first")
voice = np.zeros(n, np.float32)
v = load(sts)[:n]
voice[:len(v)] = v
voice *= db(-17 - rms_db(voice[np.abs(voice) > 0.01]))

music = load(os.path.join(A, "music.mp3"))
reps = int(np.ceil(n / len(music)))
music = np.tile(music, reps)[:n]
music *= db(-36 - rms_db(music[: 60 * SR]))
win = int(0.05 * SR)
env = np.sqrt(movavg(voice ** 2, win))
talk = (env > db(-40)).astype(np.float32)
sm = int(0.25 * SR)
gain = db(-4 * movavg(talk, sm)).astype(np.float32)
OUT = SHOTS[30] + TIM["outro"]                # swell under the end card
k = t >= OUT
gain[k] *= db(4 * np.clip((t[k] - OUT) / 1.0, 0, 1))
k = t >= DUR - 1.2
gain[k] *= np.clip((DUR - t[k]) / 1.2, 0, 1)
gain[t < 0.6] *= t[t < 0.6] / 0.6
music *= gain

sfx = np.zeros(n, np.float32)
cache = {}
def hit(name, at, level=-24):
    if name not in cache:
        x = load(os.path.join(A, name + ".mp3"))
        cache[name] = x * db(level - rms_db(x[np.abs(x) > 0.005]))
    x, o = cache[name], int(at * SR)
    x = x[: n - o]
    sfx[o:o + len(x)] += x

hit("whoosh", 1.5, -26)                       # split-screen slide in
for i in range(1, 27):
    m, pm = MODES[i], MODES[i - 1]
    if m != pm:
        hit("whoosh", SHOTS[i], -27)          # stage change
    else:
        hit("softpop", SHOTS[i] + 0.05, -28)  # new card
hit("stamp", SHOTS[4] + 0.4, -28)            # "High Deductible" crossed out
hit("buzzer", SHOTS[11] + 0.5, -32)           # AI claim denials
hit("chime", SHOTS[12] + 1.2, -28)            # automatically covered
hit("chime", SHOTS[22] + 0.6, -28)            # 20% credited to the cap
hit("click", SHOTS[24] + 0.2, -26)            # $80 / $20 split
hit("chime", SHOTS[29] + 0.8, -27)            # GHD bar
hit("chime", SHOTS[30] + TIM["outro"] + 0.1, -25)   # end card
mix = voice + music + sfx
tmp = os.path.join(HERE, "mix_raw.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                "-ac", "2", "-c:a", "pcm_f32le", tmp], input=mix.astype(np.float32).tobytes(), check=True)
out = sys.argv[1] if len(sys.argv) > 1 else "mix.wav"
# measure, then apply one static gain to -14 LUFS (no pumping), with a -1.5 dBTP safety limiter
meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", tmp, "-af", "ebur128", "-f", "null", "-"],
                      capture_output=True, text=True).stderr
I = float(meas[meas.rindex("I:"):].split()[1])


def render(gain_db):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af",
                    f"volume={gain_db:.2f}dB,alimiter=limit=0.84:attack=2:release=50:level=false",
                    "-ar", str(SR), "-ac", "2", out], check=True)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", out, "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return float(r[r.rindex("I:"):].split()[1])


g = -14 - I
for _ in range(3):              # the limiter shaves a little, so iterate onto -14
    got = render(g)
    if abs(got + 14) < 0.2:
        break
    g += -14 - got
print(f"final {got:.1f} LUFS")
os.remove(tmp)
print("wrote", out)
