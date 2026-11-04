# High-Deductible Plan G: Is It Worth It in 2027? — 16:9 edit + 3 YouTube Shorts

Source: `../Avatar Video_1080p.mp4` (single green-screen take, 1080×1920, 3:59).
Outputs in `../hdg/`:

- `High-Deductible Plan G - Final.mp4` — 1920×1080, 25 fps, -14 LUFS, 31 shots from the production blueprint.
- `shorts/HDG Short 1 - The High Deductible Myth.mp4` — shots 4–8 (0:38)
- `shorts/HDG Short 2 - Original Medicare Freedom.mp4` — shots 4, 9–13 (0:44)
- `shorts/HDG Short 3 - The 100 Dollar Doctor Visit Math.mp4` — shots 19–25 (0:58)

Same pipeline as `../edit/` (see that README): `shots.js` holds the 31 shot graphics (built into `stage.html`
and `short.html`), `timing.json` the word timestamps and shot starts, `render.js` / `mix.py` the 16:9 video,
`render_short.js` / `mix_short.py` the Shorts. Speaker framing: cropped from just above the head down to the
belt so the hands show, scaled evenly (never stretched).

Voice: on-camera lines are Arric's ElevenLabs clone via speech-to-speech (`audio/sts/`). The Shorts' end-card
line ("Want the full breakdown? Tap the link below to watch the full video.") is TTS in the same cloned voice,
played over the full-screen end card with the speaker off-screen. When uploading each Short, set its
**Related video** to the full video.

Shot 8 ("where you live matters") uses a high-cost vs. moderate-cost zip code comparison bar instead of a US map.
