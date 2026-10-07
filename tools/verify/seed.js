// 乱数を固定した総当たり。同じソースなら毎回まったく同じ結果になる。分割の前後が同じ動きかを確かめる道具。
// 使い方: node seed.js <A.html> [B.html] [--lv 0,1,4] [--out 結果.json]
//   1つだけ渡す → 結果の指紋(sha256)を出す。 2つ渡す → 1試合ずつ比べ、違う試合を出す(全部同じなら終了コード0)。
//   全キャラの全組み合わせ(11人なら 110試合)× 難易度3つ = 330試合。
const L=require('./lib'),crypto=require('crypto'),fs=require('fs');
const av=process.argv.slice(2),opt={};const files=[];for(let i=0;i<av.length;i++){if(av[i]=='--lv')opt.lv=av[++i];else if(av[i]=='--out')opt.out=av[++i];else files.push(av[i])}
const LVS=(opt.lv||'0,1,4').split(',').map(Number);
(async()=>{const b=await L.launch();
const one=async(file,LVL)=>{const p=await L.open(b,file,{},true);
 const out=await p.evaluate(LVL=>{const N=CH.length,out=[];for(let a=0;a<N;a++)for(let c=0;c<N;c++){if(a==c)continue;__seed(a*100+c*7+LVL*1000+5);ch=a;selC=c+1;lv=LVL;SPECT=true;start();let i=0,h=0;
  for(;i<40000&&mode!='end';i++){update();if(i%30==0){h=(Math.imul(h,31)+Math.round(A.x*8)+Math.round(B.x*8)*3+Math.round(A.y*8)*5+Math.round(B.y*8)*7+Math.round(A.hp*10)*11+Math.round(B.hp*10)*13+Math.round(A.gauge*10)*17+Math.round(B.gauge*10)*19)|0}}
  out.push([LVL,CH[a].n,CH[c].n,win,i,Math.round(A.hp*10),Math.round(B.hp*10),A.pbk.join(''),B.pbk.join(''),h>>>0].join(','))}return out},LVL);
 if(p.errs.length){console.log('エラー',file,p.errs.slice(0,3));process.exitCode=1}await p.context().close();return out};
const res=[];for(const f of files){const r=(await Promise.all(LVS.map(l=>one(f,l)))).flat();res.push(r);console.log(f,'試合数',r.length,'指紋',crypto.createHash('sha256').update(r.join('\n')).digest('hex').slice(0,16))}
if(opt.out)fs.writeFileSync(opt.out,JSON.stringify(res[0],null,0));
if(res.length==2){const[A,B]=res;let same=0,diff=0;for(let i=0;i<Math.max(A.length,B.length);i++){if(A[i]===B[i])same++;else{diff++;if(diff<=5)console.log('違い',A[i],'|',B[i])}}
 console.log(diff?'✗ 違う試合があります: 同じ '+same+' / 違う '+diff:'✓ '+same+' 試合すべて同じ');if(diff)process.exitCode=1}
await b.close()})();
