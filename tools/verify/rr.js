// CPU同士の総当たり(乱数は固定しない。勝率を測る道具)
// 使い方: node rr.js <index.html> [繰り返し=4] [並列=6] [難易度=4] [m]
//   1キャラあたりの試合数 = 繰り返し × 並列 × (キャラ数−1) × 2。 4 6 4 で 11人なら 480戦。末尾に m で相性表も出す。
//   難易度: 0ビギナー 1ノーマル 2ハード 3エキスパート 4ヘル
const L=require('./lib');
(async()=>{const file=process.argv[2],reps=+process.argv[3]||4,W=+process.argv[4]||6,LVL=+(process.argv[5]||4);const b=await L.launch();
const run=async()=>{const p=await L.open(b,file);await p.evaluate(()=>{window.requestAnimationFrame=()=>0});
const r=await p.evaluate(([reps,LVL])=>{const N=CH.length,w=Array.from({length:N},()=>Array(N).fill(0)),n=Array.from({length:N},()=>Array(N).fill(0));
 // 本体が typeof で見て数える計測用の変数(無ければ本体は何もしない)
 window.BRK=[0,0];window.HXN=0;window.ADN=0;window.IBN=0;window.CHF=0;let tfr=0,tm=0,tbrk=0,fr=0,m=0,mc=0,hist=Array(16).fill(0),par=0,blk=0;
 const op=pop;pop=function(t,x,y,c){if(t=='PARRY!')par++;else if(t=='BLOCK')blk++;return op(t,x,y,c)};
 for(let rep=0;rep<reps;rep++)for(let a=0;a<N;a++)for(let c=0;c<N;c++){if(a==c)continue;ch=a;selC=c+1;lv=LVL;SPECT=true;const b0=BRK[0]+BRK[1];start();let i=0,pa=0,pb=0,ma=0;
  for(;i<40000&&mode!='end';i++){update();for(const f of[A,B]){const pv=f===A?pa:pb;if(f.combo<pv||(f.combo==0&&pv>0))hist[Math.min(15,pv)]++;if(f===A)pa=f.combo;else pb=f.combo;ma=Math.max(ma,f.combo)}}
  fr+=i;m++;if(CH[a].chill||CH[c].chill){tfr+=i*((CH[a].chill?1:0)+(CH[c].chill?1:0));tm++;tbrk+=BRK[0]+BRK[1]-b0}mc+=ma;n[a][c]++;n[c][a]++;if(win=='WIN')w[a][c]++;else w[c][a]++}
 return{tfr,tm,tbrk,chfN:CHF,ibN:IBN,hx:HXN/m,ad:ADN/m,ib:IBN/m,brk:(BRK[0]+BRK[1])/m,w,n,avgSec:fr/m/60,names:CH.map(c=>c.n),mc:mc/m,hist,m,par:par/m,blk:blk/m}},[reps,LVL]);
const errs=p.errs;await p.context().close();return{r,errs}};
const rs=await Promise.all(Array.from({length:W},run));
const N=rs[0].r.names.length,w=Array.from({length:N},()=>Array(N).fill(0)),n=Array.from({length:N},()=>Array(N).fill(0));
for(const {r} of rs)for(let i=0;i<N;i++)for(let j=0;j<N;j++){w[i][j]+=r.w[i][j];n[i][j]+=r.n[i][j]}
const nm=rs[0].r.names,H=Array(16).fill(0),avg=k=>rs.reduce((a,x)=>a+x.r[k],0)/rs.length,S=k=>rs.reduce((a,x)=>a+x.r[k],0);let M=0;for(const{r}of rs){r.hist.forEach((v,i)=>H[i]+=v);M+=r.m}
console.log('難易度'+LVL+' 勝率%:',nm.map((x,i)=>x.slice(0,2)+(w[i].reduce((a,b)=>a+b,0)/n[i].reduce((a,b)=>a+b,0)*100).toFixed(1)).join(' '));
console.log('  1キャラの試合数',n[0].reduce((a,b)=>a+b,0),'| 平均秒',avg('avgSec').toFixed(0),'| 最大コンボ/試合',avg('mc').toFixed(1),'| PARRY',avg('par').toFixed(1),'BLOCK',avg('blk').toFixed(1),'| 部位破壊/試合',avg('brk').toFixed(2),'| 溜め強/試合',avg('hx').toFixed(3),'| 空中ダッシュ/試合',avg('ad').toFixed(3),'| 氷葬/試合',avg('ib').toFixed(3));
console.log('  ツララ: 凍えさせていた時間の割合',(S('chfN')/Math.max(1,S('tfr'))).toFixed(3),'| 部位破壊/ツララ戦',(S('tbrk')/Math.max(1,S('tm'))).toFixed(2),'| ツララ戦の数',S('tm'));
console.log('  コンボ回数/試合(ヒット数別):',H.map((v,i)=>i>=2?i+':'+(v/M).toFixed(2):'').filter(Boolean).join(' '));
if(process.argv[6]){console.log('相性表(行のキャラが列のキャラに勝つ%)\n     '+nm.map(x=>x.slice(0,2)).join('  '));for(let i=0;i<N;i++)console.log(nm[i].slice(0,2)+' '+w[i].map((v,j)=>i==j?' --':String(Math.round(v/n[i][j]*100)).padStart(3)).join(' '))}
const e=rs.flatMap(x=>x.errs);if(e.length){console.log('エラー',e.slice(0,3));process.exitCode=1}await b.close()})();
