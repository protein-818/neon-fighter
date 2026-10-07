// 公開側との取り決めと、ファイルの形を確かめる。
// 使い方: node check.js <index.html> [もとの index.html]
//   2つ目を渡すと、バイト単位で同じかも調べる。
const L=require('./lib'),fs=require('fs'),crypto=require('crypto');const [,,F,REF]=process.argv;const s=fs.readFileSync(F,'utf8');let bad=0;const ok=(c,t,d)=>{console.log((c?'✓ ':'✗ ')+t+(d?'  '+d:''));if(!c)bad++};
console.log(F,Buffer.byteLength(s),'バイト',s.split('\n').length,'行  sha256',crypto.createHash('sha256').update(fs.readFileSync(F)).digest('hex'));
ok((s.match(/<script/g)||[]).length==1,'script は1つ');
const tail=s.slice(-60);ok(/applyLang\(\);loop\(\);\n<\/script>\n?<\/body><\/html>\n?$/.test(tail),'ファイル末尾の形',JSON.stringify(tail.slice(-45)));
for(const k of['matchStart','matchEnd','trainingStart'])ok(s.includes('NFA.'+k+'('),'計測の呼び出し NFA.'+k);
ok(/[;}\n]addEventListener\('keydown'/.test(s)&&/[;}\n]addEventListener\('keyup'/.test(s),'キー入力は window の keydown / keyup');
for(const k of['nf2_lv','nf2_ch','nf2_sv','nf2_cpu','nf2_lang','nf2_rec','nf2_col','nf_aud2'])ok(s.includes("'"+k+"'"),'保存の名前 '+k);
ok(!/\btype=["']?module/.test(s)&&!/^\s*(import|export)\s/m.test(s),'ES modules を使っていない');
(async()=>{const b=await L.launch(),p=await L.open(b,F);
 const r=await p.evaluate(()=>{const o={};for(const k of['mode','paused','tut','SPECT','A','B','win','lv','LV','CH','ch','cv','VS2','LANG','TR','NF_INPUT','NFA'])o[k]=(0,eval)('typeof '+k);o.n=CH.length;o.names=CH.map(c=>c.n).join(' ');o.lvn=LV.length;o.cvok=cv===document.getElementById('c');return o});
 for(const k of['mode','paused','tut','SPECT','A','B','win','lv','LV','CH','ch','cv','VS2','LANG','TR','NF_INPUT'])ok(r[k]!='undefined','外から読める名前 '+k,r[k]);
 ok(r.cvok,'cv は id="c" の canvas');console.log('  キャラ',r.n,'人:',r.names,'/ 難易度',r.lvn,'段階');ok(!p.errs.length,'読み込み時のエラーなし',p.errs[0]||'');
 // キー入力が効くか(タイトルで 1 を押すとメニューへ)
 await p.keyboard.press('1');await p.waitForTimeout(150);ok(await p.evaluate(()=>mode)=='menu','キー 1 でメニューへ進む');await b.close();
 if(REF){const a=fs.readFileSync(F),c=fs.readFileSync(REF);if(a.equals(c))ok(true,'もとのファイルとバイト単位で同じ');else{let i=0;while(i<a.length&&i<c.length&&a[i]==c[i])i++;ok(false,'もとのファイルと違う','最初の違い '+i+' バイト目(行 '+(a.slice(0,i).toString().split('\n').length)+') '+JSON.stringify(a.slice(Math.max(0,i-20),i+20).toString())+' / '+JSON.stringify(c.slice(Math.max(0,i-20),i+20).toString())+'  長さ '+a.length+' / '+c.length)}}
 console.log(bad?'✗ 問題 '+bad+' 件':'✓ すべてよし');process.exitCode=bad?1:0})();
