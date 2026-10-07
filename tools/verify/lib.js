// 共通: Playwright と Chromium を探して開く。乱数の種を固定する関数もここ。
const fs=require('fs'),path=require('path');let pw;
try{pw=require('playwright')}catch(e){try{pw=require('/opt/npm-tools/node_modules/playwright')}catch(e2){console.error('playwright が見つかりません。 npm i playwright && npx playwright install chromium を実行してください');process.exit(2)}}
const exe=process.env.NF_CHROMIUM||(fs.existsSync('/opt/pw-browsers/chromium')?'/opt/pw-browsers/chromium':null);
exports.launch=()=>pw.chromium.launch(exe?{executablePath:exe}:{});
exports.url=f=>{const p=path.resolve(f);if(!fs.existsSync(p)){console.error('ファイルがありません: '+p);process.exit(2)}return 'file://'+p};
// ページの中で最初に呼ぶ。画面更新の自動ループを止め、時刻(Date.now)を固定し、Math.random を種つきに差し替える。__seed(n) で種を入れ直す。
exports.FREEZE=()=>{window.requestAnimationFrame=()=>0;Date.now=()=>1700000000000;let sd=1;window.__seed=n=>{sd=n|0};Math.random=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
// freeze=true なら、本体が読み込まれる前から乱数と画面更新を固定する(読み込み直後の動きも毎回同じになる)
exports.open=async(b,file,opt,freeze)=>{const ctx=await b.newContext(Object.assign({viewport:{width:760,height:720},locale:'ja-JP'},opt||{}));// 外への通信は止める(Web フォントなどの読み込みで絵や時間が変わらないように)
 await ctx.route(u=>!String(u).startsWith('file:'),r=>r.abort());if(freeze)await ctx.addInitScript(exports.FREEZE);const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto(exports.url(file));await p.waitForTimeout(300);return p};
