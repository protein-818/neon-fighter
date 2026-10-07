// 通し試合: でたらめな入力で全キャラを動かし、止まらないか・数値が壊れないか(NaN)を見る。描画も呼ぶ。
// 使い方: node smoke.js <index.html>     所要 1〜2分
const L=require('./lib');
(async()=>{const b=await L.launch(),file=process.argv[2];let bad=0;
for(const touch of[false,true]){const p=await L.open(b,file,touch?{hasTouch:true,isMobile:true,viewport:{width:844,height:390}}:{});await p.evaluate(()=>{window.requestAnimationFrame=()=>0});
 // 1) プレイヤー側にでたらめな入力。対戦とトレーニングの両方
 const r=await p.evaluate(()=>{const N=CH.length;let nan=0,m=0,mx=0;
  for(let c=0;c<N;c++)for(const tr of[0,1]){ch=c;selC=((c+3)%N)+1;lv=4;SPECT=false;if(tr){tutM=true;startTut();TRN.dm=[0,4][c%2]}else start();
   for(let i=0;i<5000&&mode!='end';i++){if(i%4==0){A.in.l=Math.random()<.2?1:0;A.in.r=Math.random()<.5?1:0;A.in.u=Math.random()<.06?1:0;A.in.d=Math.random()<.15?1:0;A.in.g=Math.random()<.08?1:0}if(Math.random()<.25)act('zzzxxcasdf'[Math.random()*10|0]);update();mx=Math.max(mx,A.combo,B.combo);
    if(i%7==0){draw();if(isNaN(A.x+B.x+A.hp+B.hp+A.at+B.at)||(A.ps&&isNaN(A.ps.lean)))nan++}}m++}return{試合:m,NaN:nan,最大コンボ:mx}});
 console.log(touch?'スマホ':'PC','でたらめ入力',JSON.stringify(r),p.errs.slice(0,3));if(r.NaN||p.errs.length)bad++;
 // 2) 全組み合わせを CPU 同士で、描画しながら最後まで
 if(!touch){const r2=await p.evaluate(()=>{const N=CH.length;let nan=0,m=0,end=0;for(let a=0;a<N;a++)for(let c=0;c<N;c++){if(a==c)continue;ch=a;selC=c+1;lv=3;SPECT=false;start();A.cpu=true;for(let i=0;i<30000&&mode!='end';i++){update();if(i%9==0){draw();if(isNaN(A.x+B.x+A.hp+B.hp)||(A.ps&&isNaN(A.ps.lean)))nan++}}m++;if(mode=='end')end++}return{試合:m,決着:end,NaN:nan}});
  console.log('PC 全組み合わせ(描画つき)',JSON.stringify(r2),p.errs.slice(0,3));if(r2.NaN||r2.試合!=r2.決着||p.errs.length)bad++}
 await p.context().close()}
console.log(bad?'✗ 問題あり':'✓ 問題なし');process.exitCode=bad?1:0;await b.close()})();
