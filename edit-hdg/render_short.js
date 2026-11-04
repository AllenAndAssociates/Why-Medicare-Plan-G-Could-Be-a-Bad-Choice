// 9:16 short: graphics (short.html) + keyed speaker in the lower stage + CTA end card. Video only.
// usage: node render_short.js <name> out.mp4 [--still t1,t2]
const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path');
const L=require('./shorts.js');
const FPS=25,SRC=path.resolve(__dirname,'../Avatar Video_1080p.mp4');
const name=process.argv[2],out=process.argv[3];const T=L.build(name),CH=L.chunks(T);
const si=process.argv.indexOf('--still');
function frameArgs(t){
  let st=T.shotTl[0];for(const s of T.shotTl)if(t>=s.tl-0.001)st=s;
  const src=L.srcAt(T,Math.min(t,T.speechEnd-0.001));
  const cta=Math.max(0,Math.min(1,(t-T.ctaAt)/0.4));
  return [t,src,st.tl,cta,L.caption(T,CH,t)];
}
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file://'+path.join(__dirname,'short.html'));await p.evaluate(()=>document.fonts.ready);
 if(si>0){for(const t of process.argv[si+1].split(',').map(Number)){await p.evaluate(a=>setF(...a),frameArgs(t));await p.screenshot({path:`/tmp/claude-0/w/sf_${name}_${t}.png`,omitBackground:true});}await b.close();return;}
 const cut=`[1]split=${T.segs.length}`+T.segs.map((s,i)=>`[c${i}]`).join('')+';'+T.segs.map((s,i)=>`[c${i}]trim=${s.in.toFixed(3)}:${s.out.toFixed(3)},setpts=PTS-STARTPTS[s${i}];`).join('');
 const cat=T.segs.map((s,i)=>`[s${i}]`).join('')+`concat=n=${T.segs.length}:v=1:a=0[av0];`;
 const f=cut+cat+`[av0]crop=1080:1540:0:60,chromakey=0x0BC04C:0.12:0.06,despill=type=green,scale=680:970,tpad=stop_mode=clone:stop_duration=${(T.dur-T.speechEnd+0.5).toFixed(2)}[av];`+
   `[0][av]overlay=x=200:y=870[b];[b][2]overlay=0:0:format=auto,format=yuv420p[out]`;
 const ff=spawn('ffmpeg',['-v','error','-y','-loop','1','-framerate',''+FPS,'-i',path.join(__dirname,'build_bg_9x16.png'),'-i',SRC,
  '-thread_queue_size','64','-f','image2pipe','-framerate',''+FPS,'-c:v','png','-i','-','-filter_complex',f,'-map','[out]','-r',''+FPS,'-t',T.dur.toFixed(3),
  '-c:v','libx264','-crf','18','-preset','medium','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
 const N=Math.round(T.dur*FPS);
 for(let k=0;k<N;k++){await p.evaluate(a=>setF(...a),frameArgs(k/FPS));const buf=await p.screenshot({omitBackground:true});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(k%250==0)console.log(`${name} frame ${k}/${N}`);}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done',out);
})();
