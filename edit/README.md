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
