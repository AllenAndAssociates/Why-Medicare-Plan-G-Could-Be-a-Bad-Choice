const B1='1 | The "High Deductible" Myth',B2='2 | Original Medicare Freedom',B3='3 | The Top 3 Medigap Options',B4='4 | How Plan GHD Works (The Math)',B5='5 | Monthly Premium Comparison';
// build helpers: k = step this element appears at, n = current step
const st=(n,k)=>n<k?'style="visibility:hidden"':'';
const cl=(n,k)=>n===k?'nw':'';
const omma=n=>`<div class="static" style="display:flex;gap:60px;width:100%;align-items:flex-start">
 <div class="col" style="flex:1;border-color:var(--green)"><div class="colh" style="background:var(--green)">Original Medicare + Plan GHD</div>
  <div class="rowi ${cl(n,2)}" ${st(n,2)}><span style="font-size:56px">🏥</span><div><h3>Any Doctor or Hospital Nationwide</h3><p class="g" style="font-size:32px">Including Mayo Clinic — Zero Network Restrictions</p></div></div>
  <div class="rowi ${cl(n,3)}" ${st(n,3)}><h3>✔️ Zero Specialist Referrals Required</h3><h3>✔️ Zero Prior Authorizations</h3></div></div>
 <div class="col" style="flex:1;border-color:var(--red)"><div class="colh" style="background:var(--red)">Medicare Advantage (Part C)</div>
  <div class="rowi ${cl(n,4)}" ${st(n,4)} style="border-color:var(--red);background:#E5484D22"><span style="font-size:56px">❌</span><div><h3 class="r">Prior Authorizations &amp; Automated AI Claim Denials</h3></div></div></div></div>`;
const three=n=>`<div class="static" style="width:100%"><div style="display:flex;gap:40px;width:100%;align-items:stretch">
 <div class="pcard ${n>=2&&n<=3?'hi':''}"><h2>Standard Plan G</h2>
  <p class="${cl(n,2)}" ${st(n,2)}>100% Gap Coverage After Small Part B Deductible</p>
  <div class="tag amber ${cl(n,3)}" ${st(n,3)}>~$300 Annual Part B Deductible</div>
  <div class="up ${cl(n,5)}" ${st(n,5)}>▲ Rising Monthly Premiums</div></div>
 <div class="pcard ${n===4?'hi':''}"><h2>Plan N</h2>
  <div class="${cl(n,4)}" ${st(n,4)}><p>~$300 Part B Deductible</p><p>+ Up to $20 Doctor Copay</p><p>+ $50 ER Copay</p></div>
  <div class="up ${cl(n,5)}" ${st(n,5)}>▲ Rising Monthly Premiums</div></div>
 <div class="pcard" style="border-color:var(--green)"><h2 class="g">High-Deductible Plan G (GHD)</h2></div></div></div>`;
const split8020=n=>`<div class="static" style="width:100%"><h2 style="margin-bottom:40px">A Covered Outpatient Bill</h2>
 <div style="display:flex;height:200px;border-radius:18px;overflow:hidden;width:100%;background:rgba(255,255,255,.08)">
  <div class="grow" style="flex:80;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:84px;font-weight:900">80%</div>
  <div class="${n===2?'growr':''}" style="flex:20;background:${n>=2?'var(--green)':'transparent'};display:flex;align-items:center;justify-content:center;font-size:84px;font-weight:900">${n>=2?'20%':''}</div></div>
 <div style="display:flex;width:100%;margin-top:34px;gap:40px"><h3 style="flex:80" class="bl">Paid Immediately by Original Medicare Part B</h3>
  <h3 style="flex:20" ${st(n,2)} class="g ${cl(n,2)}">Your 20% Share</h3></div>
 <div class="tag gbg ${cl(n,2)}" ${st(n,2)} style="margin-top:40px;font-size:40px">Your 20% Coinsurance ➔ Credited Toward Your ~$3,000 Annual Cap</div></div>`;
const invoice=n=>`<div class="static" style="display:flex;flex-direction:column;align-items:center;gap:40px;width:100%">
 <div class="inv"><div style="font-size:30px;font-weight:800;letter-spacing:.12em;color:#5b6b80">EXAMPLE DOCTOR OFFICE VISIT</div>
  <div style="font-size:150px;font-weight:900;line-height:1">$100</div><div style="font-size:34px;font-weight:700">Medicare-Approved Charge</div></div>
 <div class="row ${cl(n,2)}" ${st(n,2)} style="gap:60px">
  <div class="dcard" style="width:620px;border-color:var(--blue)"><h3>Medicare Pays</h3><div class="big bl" style="font-size:140px">$80</div><p>80%</p></div>
  <div class="dcard" style="width:760px;border-color:var(--green)"><h3>You Pay</h3><div class="big g" style="font-size:140px">$20</div><p>20% — counts toward your ~$3,000 GHD limit</p></div></div></div>`;
const hosp=n=>`<div class="static" style="display:flex;flex-direction:column;gap:30px"><h2>HOSPITAL STAYS: INPATIENT VS. OUTPATIENT</h2>
 <div class="card ${cl(n,2)}" ${st(n,2)} style="border-color:var(--amber)"><div class="tag amber">Formal Inpatient Admission</div><p style="margin-top:14px">➔ Triggers Part A Deductible <b>(~$1,700–$1,800)</b> — counts toward your $3,000 cap</p></div>
 <div class="card ${cl(n,3)}" ${st(n,3)}><div class="tag gbg">ER / Observation / Outpatient Surgery</div><p style="margin-top:14px">➔ Falls Under Part B <b class="g">(Medicare Pays 80% Immediately!)</b></p></div></div>`;
const bars=n=>{const B=(lab,val,h,c,k,extra)=>`<div class="bcol ${cl(n,k)}" ${st(n,k)}><div class="bval" style="color:${c}">${val}</div><div class="barv growy" style="height:${h}px;background:${c}"></div><h3>${lab}</h3>${extra||''}</div>`;
 return `<div class="static" style="width:100%"><h2 style="margin-bottom:30px">Typical Monthly Premiums</h2><div style="display:flex;gap:80px;align-items:flex-end;justify-content:center;border-bottom:3px solid rgba(255,255,255,.4)">
 ${B('Standard Plan G','$130 – $150 / mo',460,'#E5484D',1)}${B('Plan N','$100 – $125 / mo',380,'#F5A623',2)}${B('High-Deductible Plan G','$60 – $90 / mo',240,'#00B140',2)}</div>
 <div class="tag gbg ${cl(n,2)}" ${st(n,2)} style="margin-top:34px;font-size:40px">GHD: Up to 50% Lower Fixed Cost!</div>
 <p style="margin-top:18px;font-size:26px;opacity:.7">Rates vary by zip code and age.</p></div>`;};
const S=[
{m:'split',b:B1,h:`<div class="tag bbg">MEDIGAP STRATEGY</div><h1>High-Deductible Plan G: Is It Worth It in 2027?</h1>`},
{m:'split',b:B1,h:`<h2>Today You'll Learn How To Get:</h2><div class="pillc">✔️ Lower Monthly Premium</div><div class="pillc">✔️ Original Medicare Freedom</div><div class="pillc">✔️ Capped Annual Exposure</div>`},
{m:'split',b:B1,h:`<div class="card" style="text-align:left"><img src="assets/allen-associates-logo.png" style="width:520px;display:block;margin-bottom:26px"><h1>ARRIC ALLEN</h1><p style="margin-top:18px" class="g">Licensed Specialist Since 1994</p><h3 style="margin-top:14px">Allen &amp; Associates Insurance Agency</h3></div>`},
{m:'split',b:B1,h:`<div class="card" style="border-width:0 0 0 14px;padding:56px 50px"><div class="tag gbg">SPOTLIGHT</div><h1 style="margin-top:22px;font-size:120px">PLAN GHD</h1><h2 style="margin-top:12px;color:#33465f">High-Deductible Plan G</h2></div>`},
{m:'split',b:B1,h:`<h1 class="r" style="text-decoration:line-through;text-decoration-thickness:10px">❌ "High Deductible"</h1><div class="arrow" style="text-align:center">⬇</div><div class="card"><h2 class="g">✔️ True Function:</h2><h2 style="margin-top:10px">Annual Out-of-Pocket Maximum</h2></div>`},
{m:'split',b:B1,h:`<h2>WHY YOU HAVEN'T HEARD OF IT</h2><div class="card"><p>1. The name "High Deductible" sounds intimidating</p></div><div class="card"><p>2. Many agents don't understand the 80/20 mechanics</p></div>`},
{m:'split',b:B1,h:`<div class="static" style="display:flex;flex-direction:column;gap:28px"><h2>WHY YOU HAVEN'T HEARD OF IT</h2><div class="card"><p>1. The name "High Deductible" sounds intimidating</p></div><div class="card"><p>2. Many agents don't understand the 80/20 mechanics</p></div><div class="card nw" style="border-color:var(--amber);background:#FFF6E3"><p>3. Lower monthly premium = <b>Lower agent commission</b></p></div></div>`},
{m:'split',b:B1,h:`<h2>Where You Live Matters</h2><div class="card" style="border-color:var(--red)"><div class="tag rbg">HIGH-COST ZIP CODES</div><div class="hbar"><div class="grow" style="width:92%;background:var(--red)"></div></div></div><div class="card"><div class="tag gbg">MODERATE-COST ZIP CODES</div><div class="hbar"><div class="grow" style="width:55%;background:var(--green)"></div></div></div><h3 class="g">GHD can save you thousands in high-cost areas</h3>`},
{m:'full',b:B2,h:omma(1)},{m:'full',b:B2,h:omma(2)},{m:'full',b:B2,h:omma(3)},{m:'full',b:B2,h:omma(4)},
{m:'split',b:B2,h:`<div class="card"><h2>🩺 Doctor Deems Medically Necessary</h2></div><div class="arrow" style="text-align:center;color:var(--green)">⬇</div><div class="card"><h2 class="g">✔️ Automatically Covered by Medicare</h2></div>`},
{m:'full',b:B3,h:three(1)},{m:'full',b:B3,h:three(2)},{m:'full',b:B3,h:three(3)},{m:'full',b:B3,h:three(4)},{m:'full',b:B3,h:three(5)},
{m:'split',b:B4,h:`<h2>HIGH-DEDUCTIBLE PLAN G</h2><div class="big g" style="font-size:170px">~$3,000</div><h2>Annual Cap</h2><div class="tag bbg">2027</div>`},
{m:'split',b:B4,h:`<h3>Traditional Employer Deductible</h3><div class="hbar" style="height:120px"><div class="grow" style="width:100%;background:var(--red);display:flex;align-items:center;justify-content:center;color:#fff;font-size:44px;font-weight:900">YOU PAY 100%</div></div><p class="r">You pay 100% of bills up to $3,000</p>`},
{m:'split',b:B4,h:`<h3>Plan GHD</h3><div class="hbar" style="height:120px;display:flex"><div class="grow" style="flex:80;background:var(--blue);display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;font-weight:900">MEDICARE A &amp; B</div><div style="flex:20;background:var(--green)"></div></div><h2 class="g">Original Medicare A &amp; B Pay First From Day One!</h2>`},
{m:'full',b:B4,h:split8020(1)},{m:'full',b:B4,h:split8020(2)},
{m:'full',b:B4,h:invoice(1)},{m:'full',b:B4,h:invoice(2)},
{m:'split',b:B4,h:hosp(1)},{m:'split',b:B4,h:hosp(2)},{m:'split',b:B4,h:hosp(3)},
{m:'full',b:B5,h:bars(1)},{m:'full',b:B5,h:bars(2)},
{m:'split',b:B5,h:`<div class="tag amber">FREE 2027 MEDIGAP &amp; PLAN GHD RATE GUIDE</div><h1>💬 Comment "GUIDE" Below</h1><p>✔️ Nationwide Original Medicare access</p><p>✔️ Strict annual cap protects your savings</p>`},
];
