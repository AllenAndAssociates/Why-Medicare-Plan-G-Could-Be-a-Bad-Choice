// Graphics layer (stage.html, Playwright) + keyed avatar -> 1920x1080 video-only render.
// usage: node render.js out.mp4 [--still t1,t2,...]
const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path');
const FPS=25,TAIL=1.0,SRC=path.resolve(__dirname,'../Avatar Video_1080p.mp4');
const tim=require('./timing.json');const DUR=tim.end+TAIL;
const out=process.argv[2]||'video.mp4';const si=process.argv.indexOf('--still');
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
 await p.goto('file://'+path.join(__dirname,'stage.html'));await p.evaluate(()=>document.fonts.ready);
 // backdrop behind the keyed speaker: light studio gradient
 const bg=path.join(__dirname,'build_bg.png');
 if(si>0){
  for(const t of process.argv[si+1].split(',').map(Number)){await p.evaluate(t=>setT(t),t);await p.screenshot({path:`/tmp/claude-0/w/fg_${t}.png`,omitBackground:true});}
  await b.close();return;}
 const ax="if(lt(t,1.5),581,if(lt(t,2.3),581-480*((t-1.5)/0.8)*((t-1.5)/0.8)*(3-2*(t-1.5)/0.8),101))";
 const f=`[1]crop=1080:1540:0:60,chromakey=0x0BC04C:0.12:0.06,despill=type=green,scale=757:1080,tpad=stop_mode=clone:stop_duration=${TAIL+0.2}[av];`+
   `[0][av]overlay=x='${ax}':y=0:eval=frame[b];[b][2]overlay=0:0:format=auto,format=yuv420p[out]`;
 const ff=spawn('ffmpeg',['-v','error','-y','-loop','1','-framerate',''+FPS,'-i',bg,'-i',SRC,'-f','image2pipe','-framerate',''+FPS,'-c:v','png','-i','-',
  '-filter_complex',f,'-map','[out]','-r',''+FPS,'-t',''+DUR,'-c:v','libx264','-crf','18','-preset','medium','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
 const N=Math.round(DUR*FPS);
 for(let k=0;k<N;k++){await p.evaluate(t=>setT(t),k/FPS);const buf=await p.screenshot({omitBackground:true});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(k%250==0)console.log(`frame ${k}/${N}`);}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done',out);
})();
