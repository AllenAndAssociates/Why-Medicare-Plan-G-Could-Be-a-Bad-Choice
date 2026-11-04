# 16:9 edit — Why Medicare Plan G Could Be a Bad Choice for 2027

Output: `../Why Medicare Plan G Could Be a Bad Choice for 2027 - Final.mp4` — 1920×1080, 25 fps, -14 LUFS, 27 shots.

- Source: `../Why Medicare Plan G Could Be a Bad Choice for 2027.mp4` (single green-screen take, 1080×1920).
- `stage.html` — the USAFacts-style graphics layer: 50/50 split stage (off-white `#F9FAF8` canvas, 2px `#00B140`
  divider, navy `#0A2540` type), full-screen dark-grid data stage (`#0B192C`), section pill badge top-left,
  agency bar bottom, branded end card with the official logo. `setT(t)` seeks every animation to time *t*.
- `timing.json` — word timestamps of the take; each shot starts on the first word of its scripted line.
- `render.js` — renders `stage.html` frame by frame (Playwright) over the keyed speaker
  (`chromakey 0x0BC048` + despill, cropped to waist, on a light studio backdrop): full-frame centered for 1.5 s,
  then slides into the left half.
- `mix.py` — Arric's cloned voice + music bed (ducked 4 dB while he talks, swell on the end card) +
  shot-synced SFX (whoosh on stage changes, soft pop on new cards), normalized to -14 LUFS.
- Voice: the on-camera audio is converted to Arric's ElevenLabs clone via speech-to-speech
  (`audio/sts/`), per the `arric-talking-head` skill in `../.claude/skills/`. No TTS lines.

Rebuild:

```
python3 ../.claude/skills/arric-talking-head/scripts/sts_convert.py --out audio/sts "../Why Medicare Plan G Could Be a Bad Choice for 2027.mp4"
node render.js video.mp4
python3 mix.py mix.wav
ffmpeg -i video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest "../Why Medicare Plan G Could Be a Bad Choice for 2027 - Final.mp4"
```

## 9:16 YouTube Shorts (`../shorts/`)

Three Shorts cut from the same take, each ending on a "Watch the full video — tap the link below" card:

| File | Script lines (shots) | Length |
|---|---|---|
| Short 1 - The Plan G Trap | 1, 10–14 | 0:50 |
| Short 2 - Plan N The Smarter Option | 1, 16–21 | 0:56 |
| Short 3 - High-Deductible Plan G | 1, 15, 24–26 | 0:42 |

- `shorts.json` — which shots go in each Short; `shorts.js` — cut points (on word boundaries), timeline, captions.
- `short.html` — vertical layout: data card on top, keyed speaker below on a navy canvas with a soft glow,
  word-highlight captions kept above the Shorts bottom overlay zone, end card with the official logo.
- `render_short.js <name> out.mp4` — video; `mix_short.py <name> out.wav` — audio (-14 LUFS).
- Voice: on-camera lines are Arric's clone via speech-to-speech. The end-card line ("Want the full breakdown?
  Tap the link below to watch the full video.", `audio/tts/cta_full_video.mp3`) is text-to-speech in the same
  cloned voice and plays over the full-screen end card, with the speaker off-screen.
- When uploading, set each Short's **Related video** to the full video so the "link below" works.

```
for n in plan-g-trap plan-n high-deductible-g; do node render_short.js $n v_$n.mp4; python3 mix_short.py $n a_$n.wav; done
```
