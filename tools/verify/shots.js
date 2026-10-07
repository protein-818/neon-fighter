// 決まった画面を決まった状態で撮る。乱数と時間を固定するので、同じソースなら毎回同じ絵になる。
// 使い方: node shots.js <index.html> <出力フォルダ>      約60枚、所要 1分ほど
//   このあと node pixcmp.js <フォルダA> <フォルダB> で 1 画素ずつ比べる。
const L=require('./lib'),fs=require('fs'),path=require('path');const file=process.argv[2],out=process.argv[3];if(!out){console.error('使い方: node shots.js <index.html> <出力フォルダ>');process.exit(2)}fs.mkdirSync(out,{recursive:true});
// 画面の一覧: [名前, ページの中で実行する準備]。準備のあと TT(時間)を固定して draw() を1回呼んで撮る。
const N=11;const S=[];
const play=(a,c,n,extra)=>`VS2=false;SPECT=false;tutM=false;ch=${a};selC=${c}+1;selV=1+(${a}%STG.length);lv=4;start();A.cpu=true;for(let i=0;i<${n}&&mode!='end';i++)update();${extra||''}`;
S.push(['title',`mode='title'`]);
for(let i=0;i<N;i++)S.push(['sel_'+i,`if(${i}<CH.length){mode='menu';msub=0;tutM=false;VS2=false;ch=${i};SELF=null;for(let i=0;i<40;i++)selTick()}`]);
S.push(['set_vs',`mode='menu';msub=1;tutM=false;ch=0;selC=0;selV=0;lv=2`],['set_train',`mode='menu';msub=1;tutM=true;ch=3`]);
S.push(['intro',play(0,5,30)],['rival',play(2,7,3)]);
for(let i=0;i<N;i++){S.push(['play_'+i+'a',`if(${i}<CH.length){${play(i,(i+5)%N,420)}}`]);S.push(['play_'+i+'b',`if(${i}<CH.length){${play(i,(i+3)%N,1100)}}`])}
S.push(['ko',play(1,8,40000,'')+`;`],['pause',play(4,9,300,'paused=true')],['end',play(6,10,40000,'for(let i=0;i<60;i++)draw()')]);
S.push(['train',`VS2=false;ch=7;selC=1;selV=2;tutM=true;startTut();for(let i=0;i<120;i++)update()`],['guide',`VS2=false;ch=0;selC=2;selV=1;tutM=true;startTut();for(let i=0;i<60;i++)update()`]);
S.push(['vs2_sel',`mode='menu';msub=0;tutM=false;VS2=true;ch=0;ch2=10;p2s=1;SELF=null;for(let i=0;i<40;i++)p2w(selTick)`],['vs2_play',`VS2=true;SPECT=false;tutM=false;ch=8;ch2=10;selV=3;start();for(let i=0;i<200;i++)update()`]);
const EN=['title','sel_0','sel_7','sel_10','set_vs','set_train','play_10a','play_8b','pause','end','train','vs2_sel'];
(async()=>{const b=await L.launch();let n=0,bad=0;
for(const [tag,opt,list] of [['pc',{},S.map(s=>s[0])],['en',{},EN],['touch',{hasTouch:true,isMobile:true,viewport:{width:844,height:390}},['title','sel_0','sel_10','set_vs','play_10a','play_5b','pause','end','train']]]){
 for(const nm of list){const s=S.find(x=>x[0]==nm);
  // 1枚ごとにページを開き直す(前の画面の状態や戦績を持ち越さない)
  const p=await L.open(b,file,opt,true);if(tag=='en')await p.evaluate(()=>setLang('en'));
  try{await p.evaluate(([code,k])=>{__seed(1000+k);VS2=false;paused=false;(0,eval)(code);__seed(7);TT=100;draw()},[s[1],n])}catch(e){console.log('✗',tag,nm,String(e.message).split('\n')[0]);bad++}
  if(p.errs.length){console.log('✗ ページのエラー',tag,nm,p.errs[0]);bad++}
  await p.screenshot({path:path.join(out,tag+'_'+nm+'.png')});n++;await p.context().close()}}
console.log(bad?'✗ 失敗 '+bad+' 件':'✓ '+n+' 枚撮りました → '+out);process.exitCode=bad?1:0;await b.close()})();
