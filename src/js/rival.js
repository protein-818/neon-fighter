/* 因縁: 相手ごとの戦績(対戦数・勝敗・前回の結果・前回折られた部位)で入場の台詞・観客・CPUの攻め方が変わる。保存先 localStorage nf2_rec */
const a4=v=>Array.isArray(v)&&v.length==4?v.map(x=>+x||0):[0,0,0,0];
let REC={rv:{}},GR=null,RST=0;try{const q=JSON.parse(localStorage.getItem('nf2_rec')||'null');if(q&&q.rv&&typeof q.rv=='object')REC={rv:q.rv}}catch(e){}
const recSave=()=>{try{localStorage.setItem('nf2_rec',JSON.stringify(REC))}catch(e){}},rvOf=(a,b)=>REC.rv[a+'>'+b]||null,recAny=()=>Object.keys(REC.rv).length;
const LINES={'ブレイズ':['正々堂々、手合わせ願う','前と同じだと思うな。油断はしない','あの負けは忘れていない。今日こそ取り返す','この{}の借りは、拳で返す'],
'ボルト':['ゴングが鳴ったら止まらないぜ','また倒されに来たのか？','前のダウンはカウントに入れてねえ','折られた{}がうずくんだよ'],
'タイタン':['リングへようこそ。王者が相手だ','挑戦者よ、ベルトはまだ遠いぞ','王者は二度は負けん','この{}の礼は倍にして返す'],
'ジョーカー':['さあ、カードを引きな','また同じ札を引いたねぇ','イカサマは一度きりだよ','この{}…最高の切り札をくれたね'],
'ゲイル':['風についてこられる？','前より速くなった？ 見せてよ','今度は私が頭上を取る','{}の痛み、忘れてないから'],
'ヴァンプ':['いい血の匂いがするわ','あなたの味は覚えているの','夜はまだ終わっていないわ','この{}の代わりに、血をいただくわ'],
'ガロウ':['……腹が減った。お前で我慢してやる','まだ骨が残っていたか','傷は飢えを育てる。礼を言う','この{}の分まで、喰い尽くす'],
'ルリ':['ねえ、何秒で壊れるか数えてあげる','まだ立てるの？ じゃあ今日はちゃんと壊すね','この前のは手加減だよ。本気、見たい？','この{}のお返し。あなたのは全部もらうね'],
'カグラ':['参る','何度来ても同じこと','不覚は一度で十分だ','この{}の礼、刀で返す'],
'イヴ':['対戦相手を登録しました','前回の戦闘記録を参照。勝率は高いです','敗北データは学習済みです','{}の損傷ログ、消去できません'],
'ツララ':['……寒くなるよ。覚悟して','まだ溶けてなかったの？','氷は割れても、また張るもの','この{}の冷たさ、あなたにも教えてあげる'],
_:['……','また会ったな','借りは返す','この{}の借りは返す']};
function grudge(){GR=null;if(SPECT||VS2)return;const r=rvOf(A.c.n,B.c.n)||{},n=r.n|0,w=r.w|0,l=r.l|0,last=r.last|0,pl=a4(r.pl),cl=a4(r.cl),any=v=>v.some(x=>x),ln=(f,won,lost,bk)=>{const q=LINES[f.c.n]||LINES._;return any(bk)?TR(q[3]).replace('{}',TR(bk[0]||bk[1]?'腕':'脚')):lost?q[2]:won?q[1]:q[0]};
B.gAg=last>0?1.15:1;
GR={n,w,l,last,cv:n?(last<0||n>=3?2:1):0,ttl:!n?'初対決':last<0?'雪辱戦':'因縁の対決',sub:n?(LANG=='en'?'Match '+(n+1)+' · '+w+'W '+l+'L':(n+1)+'戦目 ・ 通算 '+w+'勝 '+l+'敗'):A.c.n+'  vs  '+B.c.n,la:ln(A,last>0,last<0,pl),lb:ln(B,last<0,last>0,cl),end:null};introT=100+RVT}
function recEnd(){if(SPECT||tut||!GR)return;const k=A.c.n+'>'+B.c.n,o=REC.rv[k]||{},wn=win=='WIN',str=o.str|0,r=REC.rv[k]={n:(o.n|0)+1,w:(o.w|0)+(wn?1:0),l:(o.l|0)+(wn?0:1),last:wn?1:-1,str:wn?(str>0?str+1:1):(str<0?str-1:-1),pl:A.pbk.slice(),cl:B.pbk.slice()};recSave();GR.end={w:r.w,l:r.l}}
function drawRival(){const u=100+RVT-introT,e=Math.max(0,Math.min(1,u/10)*Math.min(1,(introT-100)/8)),bc=GR.last<0?UI.acc:GR.n?'#a97a1e':'rgba(12,13,18,.9)';g.save();g.globalAlpha=e;g.fillStyle='rgba(8,9,12,.55)';g.fillRect(0,100,W,196);
g.save();g.translate(W/2,150);g.transform(1,0,-.18,1,0,0);g.fillStyle=bc;g.fillRect(-W,-30,W*2,46);g.restore();txtO(GR.ttl,W/2,162,30,'#fff','center',6);txt(GR.sub,W/2,190,12,'#e8ecf4');
[[A,GR.la,20,'left'],[B,GR.lb,350,'right']].forEach(([f,s,x,al])=>{const c=fcol(f),tx=al=='left'?x+18:x+292;panel(x,204,310,50,'rgba(14,16,22,.92)',UI.ln,10);g.fillStyle=c;rr(al=='left'?x:x+304,204,6,50,3);g.fill();txtF(f.c.n,tx,222,11,c,al);txtF('「'+s+'」',tx,242,13,'#fff',al,280)});
txt(['観客は静かに見守っている','観客がざわめいている','観客は総立ちだ'][GR.cv],W/2,273,11,UI.sub);txt(kk('クリック / キーでスキップ','タップでスキップ'),W/2,289,9,'rgba(255,255,255,.4)');g.restore()}
function drawRiv(y){const C0=CH[ch],ci=selC?selC-1:-1,r=ci>=0?rvOf(C0.n,CH[ci].n):null,any=recAny();
panel(14,y,652,46,UI.p1,UI.ln,12);txtF('因縁',30,y+28,11,UI.gold,'left');txtF(ci<0?'CPUランダム（相手ごとに戦績が残ります）':r?'vs '+CH[ci].n+'　'+(r.n|0)+'戦 '+(r.w|0)+'勝 '+(r.l|0)+'敗（前回：'+(r.last>0?'勝ち':'負け')+'）':'vs '+CH[ci].n+'　初対決',66,y+28,11,UI.tx,'left',any?470:580);
if(any){const arm=Date.now()<RST;panel(556,y+9,98,28,arm?UI.acc:UI.p2,UI.ln,8);txtF(arm?'もう一度で消去':'記録を消す',605,y+27,10,'#fff','center',90)}}
function rivHit(x,y,py){if(!recAny()||x<556||x>654||y<py+9||y>py+37)return false;if(Date.now()<RST){REC={rv:{}};recSave();RST=0;sfx('ok')}else RST=Date.now()+3000;return true}
