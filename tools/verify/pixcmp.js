// 2つのフォルダの同じ名前の PNG を 1 画素ずつ比べる。
// 使い方: node pixcmp.js <フォルダA> <フォルダB> [違いを書き出すフォルダ]      全部同じなら終了コード0
const L=require('./lib'),fs=require('fs'),path=require('path');const [,,DA,DB,DD]=process.argv;
(async()=>{const a=fs.readdirSync(DA).filter(f=>f.endsWith('.png')).sort(),bset=new Set(fs.readdirSync(DB).filter(f=>f.endsWith('.png')));let same=0,diff=0,miss=0,b=null,p=null;
for(const f of a){if(!bset.has(f)){console.log('片方にしかない',f);miss++;continue}const A=fs.readFileSync(path.join(DA,f)),B=fs.readFileSync(path.join(DB,f));if(A.equals(B)){same++;continue}
 // ファイルの中身が違うときだけ、ブラウザで開いて画素を数える
 if(!b){b=await L.launch();p=await b.newPage()}
 const r=await p.evaluate(async([x,y])=>{const ld=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/png;base64,'+s});const[i,j]=[await ld(x),await ld(y)];if(i.width!=j.width||i.height!=j.height)return{size:[i.width,i.height,j.width,j.height]};
  const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(i,0,0);const d1=g.getImageData(0,0,c.width,c.height);g.clearRect(0,0,c.width,c.height);g.drawImage(j,0,0);const d2=g.getImageData(0,0,c.width,c.height);let n=0,mx=0,x0=1e9,y0=1e9,x1=-1,y1=-1;
  for(let k=0;k<d1.data.length;k+=4){const d=Math.max(Math.abs(d1.data[k]-d2.data[k]),Math.abs(d1.data[k+1]-d2.data[k+1]),Math.abs(d1.data[k+2]-d2.data[k+2]));if(d){n++;mx=Math.max(mx,d);const q=k/4,X=q%c.width,Y=q/c.width|0;x0=Math.min(x0,X);y0=Math.min(y0,Y);x1=Math.max(x1,X);y1=Math.max(y1,Y);d2.data[k]=255;d2.data[k+1]=0;d2.data[k+2]=255}}
  g.putImageData(d2,0,0);return{n,mx,box:[x0,y0,x1,y1],png:n?c.toDataURL().split(',')[1]:null}},[A.toString('base64'),B.toString('base64')]);
 if(r.size){console.log('✗ 大きさが違う',f,r.size.join(' '));diff++}else if(!r.n)same++;else{diff++;console.log('✗',f,'違う画素',r.n,'最大の差',r.mx,'範囲 x'+r.box[0]+'-'+r.box[2]+' y'+r.box[1]+'-'+r.box[3]);if(DD){fs.mkdirSync(DD,{recursive:true});fs.writeFileSync(path.join(DD,f),Buffer.from(r.png,'base64'))}}}
console.log(diff||miss?'✗ 同じ '+same+' / 違う '+diff+' / 片方だけ '+miss:'✓ '+same+' 枚すべて同じ');process.exitCode=diff||miss?1:0;if(b)await b.close()})();
