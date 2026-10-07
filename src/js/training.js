const tutC=()=>({dist:0,jump:0,crouch:0,L:0,H:0,V:0,air:0,blk:0,thr:0,sp:0,cmb:0});
const TS=[
{k:'move',t:'移動',d:()=>['左右に歩いてみよう(素早く2回押しでダッシュ)',kk('←→キー','左の方向パッド')+'で移動'],g:300,p:c=>c.dist},
{k:'jump',t:'ジャンプ・しゃがみ',d:()=>[kk('↑','パッド上')+'でジャンプ(2回)、'+kk('↓','パッド下')+'でしゃがみ(0.5秒)','しゃがむと上段攻撃をかわせます'],g:3,p:c=>Math.min(c.jump,2)+(c.crouch>=30?1:0)},
{k:'weak',t:'弱攻撃',d:()=>[kk('Z','弱')+'で素早い攻撃。連打でコンボになります','ダミーに3回当てよう'],g:3,p:c=>c.L},
{k:'strong',t:'強攻撃',d:()=>[kk('X','強')+'は遅いが高威力。当たると倒れることも','ダミーに2回当てよう'],g:2,p:c=>c.H},
{k:'var',t:'派生技',d:()=>['前入力(→+弱/強)=踏み込み技 / しゃがみ(↓+弱/強)=下段・対空','どれかを2回当てよう(キャラごとに違います)'],g:2,p:c=>c.V},
{k:'air',t:'空中技',d:()=>['ジャンプ中に'+kk('Z/X','弱/強')+'で空中攻撃','ダミーに1回当てよう'],g:1,p:c=>c.air},
{k:'guard',t:'ガード',d:()=>['ダミーが攻撃してきます。'+kk('Vキー','ガード')+'を押し続けて防ごう','直前に押すとPARRY(反撃のチャンス)。3回防ごう'],g:3,p:c=>c.blk},
{k:'throw',t:'投げ',d:()=>[kk('C','投げ')+'はガード不能。近づいて掴もう','相手が投げを出した時は投げで「投げ抜け」できます'],g:1,p:c=>c.thr},
{k:'sp',t:'必殺技',d:()=>[kk('A S D F','左の必殺ボタン')+'で必殺技。ゲージ(1/2/3/5本)を消費','練習中はゲージ無限。2回使おう'],g:2,p:c=>c.sp},
{k:'combo',t:'コンボ',d:()=>['弱→弱→強→必殺 と続けて押すとコンボになります(早めに押してもOK)','↓強で浮かせた相手には追撃できます。4HIT以上を決めよう'],g:4,p:c=>c.cmb}];
function startTut(){SPECT=false;GR=null;tutM=false;paused=false;A=mk(200,false,ch);B=mk(480,true,selC?selC-1:(ch+1+(Math.random()*(CH.length-1)|0))%CH.length);A.alt=colOf(ch);B.alt=B.c===A.c?(A.alt+1)%NCOL:0;SPX=[];B.ai=aiD;T=0;SG=selV?selV-1:Math.random()*STG.length|0;parts=[];texts=[];PJ=[];RG=[];CI=null;hstop=0;tut={step:0,c:tutC(),ok:0,px:200,air:false,fin:0,last:0,cd:0,ch:0,max:0,mv:null,mp:null,adj:0,hb:B.hp,r:[{h:A.hp,t:0},{h:B.hp,t:0}]};mode='play';try{window.NFA&&NFA.trainingStart({character:CH[ch].n,lang:LANG})}catch(e){}}
const TRN={dm:0,inf:1,guide:0},DMN=['立ち','しゃがみ','ガード','ジャンプ','CPU'];
function aiD(f,o){const i=f.in={l:0,r:0,u:0,d:0,g:0};if(mode!='play'||!tut)return;if(TRN.guide){const S=TS[tut.step];if(!S||S.k!='guard'||f.st!='i')return;const dx=o.x-f.x;if(Math.abs(dx)>62){if(dx>0)i.r=1;else i.l=1}else if(T%75==0)atk(f,'L');return}
const m=TRN.dm;if(m==1)i.d=1;else if(m==2){i.g=1;const P=o.st=='atk'?MV(o):null;if(P&&P.low)i.d=1}else if(m==3)i.u=1;else if(m==4)ai(f,o)}
function trnReset(){[A,B].forEach((f,i)=>{Object.assign(f,{ht:0,gr:0,grt:0,adu:0,ads:0,chv:0,chm:0,cht:0,bl:0,dju:0,ps:null,dsh:0,bz:0,spin:0,gu:0,gv:0,gF:null,x:i?480:200,y:0,vy:0,vx:0,hp:f.mhp,st:'i',stun:0,inv:0,combo:0,at:0,gt:0,th:0,dn:0,acc:0,chain:0,fl:0,lag:0});f.face=i?-1:1});PJ=[];RG=[];SPX=[];hstop=0;CI=null;const t=tut;t.adj=0;t.hb=B.hp;t.r[0]={h:A.hp,t:0};t.r[1]={h:B.hp,t:0};t.px=A.x;sfx('ui')}
function trnSet(i){if(i==0)TRN.dm=(TRN.dm+1)%DMN.length;else if(i==1)TRN.inf^=1;else{TRN.guide^=1;tut.px=A.x;tut.step=0;tut.c=tutC();tut.ok=0;tut.fin=0}sfx('ui')}
function trnHit(x,y){if(x>270&&x<410&&y>88&&y<128){trnReset();return true}
if(TRN.guide){const y0=GY+14;if(y>y0&&y<y0+32){if(x>496&&x<568&&tut.step<TS.length){tutNext();return true}if(x>424&&x<496){trnSet(2);return true}}return false}
const y0=GY+10;if(y>y0+46&&y<y0+84&&x>116&&x<554){trnSet(Math.min(2,Math.floor((x-118)/145)));return true}return false}
function trnKey(k){if(k=='r')trnReset();else if(k=='t'&&!TRN.guide)trnSet(0);else if(k=='g'&&!TRN.guide)trnSet(1);else if(k=='h')trnSet(2);else if(k=='n'&&TRN.guide)tutNext();else return false;return true}
const fmtD=v=>String(Math.round(v*10)/10);
function drawTrn(){const y0=GY+10,t=tut;panel(110,y0,450,86,'rgba(14,16,22,.9)',UI.ln,12);g.fillStyle=UI.acc;rr(110,y0,5,86,2.5);g.fill();
if(t.mv){txtF(SNM(t.mv.nm),124,y0+19,13,'#fff','left',230);txtF('発生 '+t.mv.su+'F'+(t.mv.tot?'   全体 '+t.mv.tot+'F':''),548,y0+19,11,UI.gold,'right')}else txtF('技を出すと、ここに発生の速さやダメージが出ます',124,y0+19,11,UI.sub,'left');
txtF('ダメージ',124,y0+38,10,UI.sub,'left');txtF(fmtD(t.last),172,y0+38,13,'#fff','left');txtF('コンボ',232,y0+38,10,UI.sub,'left');txtF(t.ch+' HIT / '+fmtD(t.cd),270,y0+38,13,'#fff','left');txtF('最大',430,y0+38,10,UI.sub,'left');txtF(fmtD(t.max),458,y0+38,13,UI.gold,'left');
[kk('T  ','')+'ダミー: '+DMN[TRN.dm],kk('G  ','')+'ゲージ: '+(TRN.inf?'無限':'通常'),kk('H  ','')+'操作ガイド'].forEach((l,i)=>{const x=118+i*145;panel(x,y0+50,139,28,UI.p2,'rgba(255,255,255,.22)',10);txtF(l,x+69.5,y0+69,11,'#fff','center',131)})}
function drawTut(){if(mode=='play'&&!paused){panel(275,92,130,32,'rgba(18,20,27,.85)','rgba(255,255,255,.3)',16);txtF(kk('R  ','')+'中央に戻す',340,113,12,'#fff','center')}if(TRN.guide)drawGuide();else drawTrn()}
function tutHit(a){const ty=a.ty.replace(/@.*/,''),c=tut.c;if(['L','L2','CL','AL'].includes(ty))c.L++;if(['H','H2','CH','AH'].includes(ty))c.H++;if(['L2','H2','CL','CH'].includes(ty))c.V++;if(a.y>0)c.air++}
function tutTick(){const t=tut,c=t.c,d=t.hb-B.hp+t.adj;t.adj=0;if(d>.01&&!(B.bl>0&&d<=(B.bld||0)+.01)){t.last=d;if(A.combo<=1)t.cd=d;else t.cd+=d;t.ch=Math.max(1,A.combo);if(t.cd>t.max)t.max=t.cd}
[A,B].forEach((f,k)=>{const r=t.r[k];if(f.hp<r.h-.01)r.t=80;if(k&&A.combo>0&&r.t>0)r.t=Math.max(r.t,2);if(r.t>0&&--r.t==0)f.hp=f.mhp;r.h=f.hp});t.hb=B.hp;
if(TRN.inf&&A.gauge<28)A.gauge=28;
if(A.st=='atk'){const P=MV(A);if(P&&P.nm&&t.mp!==P){t.mp=P;t.mv={nm:P.nm,su:P.su,tot:P.air?0:P.su+(P.ac||1)+(P.rc||0)}}}
if(!TRN.guide)return;c.dist+=Math.abs(A.x-t.px);t.px=A.x;if(A.y>0&&!t.air)c.jump++;t.air=A.y>0;if(A.cr&&A.st=='i')c.crouch++;c.cmb=Math.max(c.cmb,A.combo);
const S=TS[t.step];if(!S){if(++t.fin>200)trnSet(2);return}if(t.ok>0){if(--t.ok==0)tutNext()}else if(S.p(c)>=S.g){t.ok=50;sfx('ok');pop('OK!',A.x,GY-A.y-130,'#5f5')}}
function tutNext(){tut.step=Math.min(TS.length,tut.step+1);tut.c=tutC();tut.ok=0}
function drawGuide(){const y0=GY+14,t=tut,S=TS[t.step];panel(110,y0,460,78,'rgba(14,16,22,.9)',UI.ln,12);g.fillStyle=UI.acc;rr(110,y0,5,78,2.5);g.fill();
if(!S){txtO('ガイド完了!',340,y0+32,20,UI.gold);txt('このまま自由に練習できます',340,y0+56,12,UI.tx);return}
txt('STEP '+(t.step+1)+'/'+TS.length,124,y0+19,11,UI.acc,'left');txt(S.t,190,y0+19,14,'#fff','left');const d=S.d();txt(d[0],124,y0+39,11,UI.tx,'left');txt(d[1],124,y0+54,11,UI.sub,'left');
const p=Math.min(S.g,S.p(t.c));rr(124,y0+61,296,7,3.5);g.fillStyle='rgba(255,255,255,.12)';g.fill();if(p>0){rr(124,y0+61,296*p/S.g,7,3.5);g.fillStyle=t.ok>0?UI.ok:UI.gold;g.fill()}txt(Math.floor(p)+'/'+S.g,430,y0+69,10,UI.sub,'left');
panel(498,y0+6,64,20,UI.p2,UI.ln,10);txt('スキップ ▶',530,y0+20,10,'#fff');panel(428,y0+6,64,20,UI.p2,UI.ln,10);txt('✕ 終了',460,y0+20,10,'#fff')}
