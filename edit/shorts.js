// Shared timeline logic for the 9:16 shorts (used by render_short.js and mix_short.py via --json).
const tim = require('./timing.json');
const cfg = require('./shorts.json');
const SH = tim.shots, W = tim.words;
const CTA_GAP = 0.25, CTA_LEN = 5.0;
function lastWordEndBefore(t) { let e = 0; for (const w of W) if (w[1] < t - 0.01) e = w[2]; return e; }
function build(name) {
  const segs = [];
  for (const run of cfg[name].shots) {
    const a = run[0], b = run[run.length - 1];
    const tin = Math.max(0, SH[a - 1] - 0.08);
    const nextStart = b < SH.length ? SH[b] : tim.end + 0.3;
    const tout = Math.min(lastWordEndBefore(nextStart) + 0.22, nextStart - 0.02);
    segs.push({ in: tin, out: tout, shots: run });
  }
  let tl = 0;
  for (const s of segs) { s.tl = tl; tl += s.out - s.in; }
  const speechEnd = tl, ctaAt = speechEnd + CTA_GAP, dur = ctaAt + CTA_LEN;
  // shot appearance times on the timeline
  const shotTl = [];
  for (const s of segs) for (const k of s.shots) shotTl.push({ k, tl: s.tl + Math.max(0, SH[k - 1] - s.in) });
  return { name, title: cfg[name].title, segs, speechEnd, ctaAt, dur, shotTl };
}
function srcAt(T, t) {
  for (const s of T.segs) if (t < s.tl + (s.out - s.in)) return s.in + (t - s.tl);
  const s = T.segs[T.segs.length - 1]; return s.out;
}
// captions: chunks of up to 3 words, broken at punctuation
function chunks(T) {
  const out = [];
  for (const s of T.segs) {
    const ws = W.filter(w => w[1] >= s.in - 0.01 && w[2] <= s.out + 0.05).map(w => [w[0].replace(/^Eric/, 'Arric'), w[1], w[2]]);
    let cur = [];
    for (const w of ws) { cur.push(w); if (cur.length === 3 || /[.,:;?!]$/.test(w[0])) { out.push(cur); cur = []; } }
    if (cur.length) out.push(cur);
  }
  return out;
}
function caption(T, CH, t) {
  if (t >= T.speechEnd) return '';
  const src = srcAt(T, t);
  let c = null; for (const ch of CH) if (src >= ch[0][1] - 0.05) c = ch; else break;
  if (!c || src > c[c.length - 1][2] + 0.6) return '';
  let on = -1; c.forEach((w, j) => { if (src >= w[1] - 0.03) on = j; });
  return c.map((w, j) => `<span class="${j === on ? 'on' : ''}">${w[0].toUpperCase().replace(/[,;:]$/, '')}</span>`).join(' ');
}
module.exports = { build, srcAt, chunks, caption };
if (require.main === module) console.log(JSON.stringify(build(process.argv[2])));
