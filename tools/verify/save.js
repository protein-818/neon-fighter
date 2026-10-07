// 保存データの引き継ぎ: 遊んだあとの保存データを入れた状態で開き、戦績・色・設定・言語・音が引き継がれるかを見る。
// 使い方: node save.js <もとの index.html> [新しい index.html]      所要 10秒ほど
//   1) もとの本体で1試合して、色・言語・音・ステージ・CPU を変え、本体自身に保存させる(nf2_*、nf_aud2)。
//   2) その保存データを入れて開き直し、読み込んだ値が保存データどおりかを見る。2つ渡すと両方で見て、同じかも比べる。
const L=require('./lib');const files=process.argv.slice(2);
if(!files.length){console.error('使い方: node save.js <もとの index.html> [新しい index.html]');process.exit(2)}
(async()=>{const b=await L.launch();let bad=0;const ok=(c,t,d)=>{console.log((c?'✓ ':'✗ ')+t+(d?'  '+d:''));if(!c)bad++};
// 1) 保存データを作る
const p=await L.open(b,files[0],{},true);
const saved=await p.evaluate(()=>{localStorage.clear();
 lv=3;ch=7;selC=10;selV=1;SPECT=false;tutM=false;VS2=false;start();A.cpu=true;for(let i=0;i<40000&&mode!='end';i++)update();
 mode='menu';setCol(2);cycleStage(1);cycleCpu(1);setLang('en');AUD.bgm=0;AUD.se=1;saveAud();
 const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^nf/.test(k))o[k]=localStorage.getItem(k)}return o});
ok(!p.errs.length,'保存データを作るときのエラーなし',p.errs[0]||'');await p.context().close();
console.log('  作った保存データ:',Object.keys(saved).sort().join(' '));
for(const k of['nf2_lv','nf2_ch','nf2_sv','nf2_cpu','nf2_lang','nf2_rec','nf2_col','nf_aud2'])ok(k in saved,'本体が保存した '+k,saved[k]&&saved[k].slice(0,60));
// 2) 保存データを入れて開き直す
const res=[];
for(const f of files){const ctx=await b.newContext({viewport:{width:760,height:720},locale:'ja-JP'});await ctx.route(u=>!String(u).startsWith('file:'),r=>r.abort());
 await ctx.addInitScript(s=>{if(!sessionStorage.getItem('nf_seeded')){localStorage.clear();for(const k in s)localStorage.setItem(k,s[k]);sessionStorage.setItem('nf_seeded','1')}},saved);
 const q=await ctx.newPage();q.errs=[];q.on('pageerror',e=>q.errs.push(e.message));await q.goto(L.url(f));await q.waitForTimeout(300);
 const r=await q.evaluate(()=>{const o={lv,ch,selV,selC,LANG,REC:JSON.stringify(REC),COLS:JSON.stringify(COLS),AUD:JSON.stringify(AUD),col:colOf(ch)};
  // 読み込んだデータで画面が描けるか(タイトル、キャラ選択、因縁つきの入場)
  draw();mode='menu';msub=0;draw();msub=1;draw();SPECT=false;start();for(let i=0;i<60;i++)update();draw();return o});
 const e=JSON.parse(saved.nf2_rec).rv,c=JSON.parse(saved.nf2_col),a=JSON.parse(saved.nf_aud2);
 console.log(f);
 ok(r.lv==+saved.nf2_lv&&r.ch==+saved.nf2_ch,'難易度とキャラ',`lv ${r.lv} ch ${r.ch}`);
 ok(r.selV==+saved.nf2_sv&&r.selC==+saved.nf2_cpu,'ステージと CPU',`selV ${r.selV} selC ${r.selC}`);
 ok(r.LANG==saved.nf2_lang,'言語',r.LANG);
 ok(r.REC==JSON.stringify({rv:e})&&Object.keys(e).length>0,'戦績',r.REC.slice(0,80));
 ok(r.COLS==JSON.stringify(c)&&r.col==2,'色',r.COLS);
 ok(r.AUD==JSON.stringify({bgm:a.bgm?1:0,se:a.se?1:0})&&!a.bgm,'音の設定',r.AUD);
 ok(!q.errs.length,'エラーなし',q.errs[0]||'');res.push(JSON.stringify(r));await ctx.close()}
if(res.length==2)ok(res[0]==res[1],'もとと新しいもので、読み込んだ値が同じ');
console.log(bad?'✗ 問題 '+bad+' 件':'✓ 保存データは引き継がれます');process.exitCode=bad?1:0;await b.close()})();
