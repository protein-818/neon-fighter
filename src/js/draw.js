let uiSync=()=>{};
function draw(){uiSync();g.save();g.clearRect(0,0,W,H);if(shake>.5){g.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.85}
g.fillStyle=UI.bg;g.fillRect(-20,-20,W+40,H+40);
if(mode=='title'){titleBG();
g.fillStyle=UI.acc;g.save();g.translate(W/2,124);g.transform(1,0,-.25,1,0,0);g.fillRect(-170,0,340,8);g.restore();
txtO('NEON FIGHTER',W/2,108,58,'#fff','center',8);txtO('ULTIMATE STREET BATTLE',W/2,152,13,'#c9cfdc','center',3);
TBT.forEach(b=>{const y=TBY();panel(b[2],y,256,66,'rgba(18,20,27,.88)','rgba(255,255,255,.18)',12);g.fillStyle=UI.acc;rr(b[2],y,6,66,3);g.fill();txt(b[0],b[2]+131,y+30,20,'#fff');txt(b[1],b[2]+131,y+51,11,UI.sub)});
if(!touch){const y=TBY()+76,x=W/2-262;panel(x,y,524,50,'rgba(18,20,27,.88)','rgba(255,255,255,.18)',12);g.fillStyle=UI.gold;rr(x,y,6,50,3);g.fill();txt('2人対戦',x+131,y+32,20,'#fff');txtF('1つのキーボードで2人が同時に遊ぶ（PC専用）',x+393,y+30,11,UI.sub,'center',250);txt('キー: 1=対戦 2=トレーニング 3=2人対戦  M=消音  L=言語',W/2,TBY()+152,12,'#8a93a6')}drawAud();drawLang();g.restore();return}
if(mode=='menu'){drawMenu();g.restore();return}
g.save();zmIn();bg();
drawDeb();figure(B);figure(A);drawSPX();
drawPJ();
if(mode=='play'&&!SPECT&&!VS2&&B.st=='atk'&&A.st!='fall'&&A.st!='down'){const P=MV(B),ttl=P.su-B.at+(B.lag||0),d=Math.abs(A.x-B.x);if(ttl>0&&d<(P.rg||THR+(P.tr||0)+20)+50&&(P.rg||B.ty=='T')){const z=ttl<=PW+1&&B.ty!='T'&&!(P.chg&&!B.cq);g.strokeStyle=z?UI.ok:'#ff8a2a';g.globalAlpha=.8;g.lineWidth=3;g.beginPath();g.arc(A.x,GY-A.y-55,20+ttl*3,0,7);g.stroke();g.globalAlpha=1;g.lineWidth=1;}}
fxDraw();drawRG();g.restore();
if(!tut){panel(W/2-26,6,52,24,'rgba(12,13,18,.75)',null,8);txtO(Math.max(0,Math.ceil(rt/60)),W/2,25,19,rt<900?UI.acc:'#fff','center',3)}txt(STG[SG],W/2,74,9,'rgba(255,255,255,.55)');hud(A,10,(SPECT?'CPU '+LV[lv].n+'  ':VS2?'1P  ':'YOU  ')+A.c.n,false);hud(B,370,tut?'ダミー  '+B.c.n:VS2?'2P  '+B.c.n:'CPU '+LV[lv].n+'  '+B.c.n+'〈'+(PERS[B.c.n]||PD).tag+'〉',true);
drawSPBar();drawCI();
if(mode=='ko'){koT++;g.fillStyle='rgba(8,9,12,'+Math.min(.45,koT/100)+')';g.fillRect(0,0,W,H);if(koT<5){g.fillStyle='rgba(255,255,255,.5)';g.fillRect(0,0,W,H)}const s1=40+Math.min(1,koT/18)*34;g.save();g.translate(W/2,262);g.transform(1,0,-.18,1,0,0);g.fillStyle=UI.acc;g.fillRect(-W,-s1*.55,W*2,s1*.85);g.restore();txtO(koTm?'TIME UP':'K.O.',W/2,270,s1,'#fff','center',8);if(koPerfect&&koT>25)txtO('PERFECT',W/2,318,26,UI.gold);if(koFinal&&koT>40)txtO(SPECT?(koV===A?B:A).c.n+' WIN':VS2?(koV===A?'2P WIN':'1P WIN'):koV===A?'YOU LOSE':'YOU WIN',W/2,350,22,'#fff')}
if(mode=='intro'&&introT>100)drawRival();else if(mode=='intro'){const fr=introT<=45,k=fr?Math.min(1,(45-introT)/8):Math.min(1,(100-introT)/12);g.save();g.globalAlpha=.85;g.fillStyle=fr?UI.acc:'rgba(12,13,18,.8)';g.translate(W/2,255);g.transform(1,0,-.18,1,0,0);g.fillRect(-W*k,-30,W*2*k,48);g.restore();if(!fr)txtO(A.rw==1&&B.rw==1?'FINAL ROUND':'ROUND '+rn,W/2,268,30+k*12,'#fff','center',6);else txtO('FIGHT!',W/2,272,40+k*22,'#fff','center',8)}
if(mode=='end')drawEnd();else endT=0;
if(tut)drawTut();drawPause();g.restore()}
function pos(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
function act(k,re,p){const P=p?B:A;if(mode!='play'||paused||SPECT||(p&&!VS2)){if(P)P.bq=null;return}const fw=(P.face>0?P.in.r:P.in.l)?1:0,m='asdf'.indexOf(k);let ok=true;if(k=='z')ok=atk(P,'L',fw);else if(k=='x')ok=atk(P,'H',fw);else if(k=='c')ok=atk(P,'T');else if(m>=0)ok=atk(P,'QWER'[m]);else if('qwer'.includes(k))ok=atk(P,k.toUpperCase());if(ok)P.bq=null;else if(!re)P.bq={k,t:BUFT}}
window.NF_INPUT={set(p,dir){const f=p?B:A;if(!f||!f.in||!dir||(p&&!VS2))return;for(const k of['l','r','u','d','g','hx','ha'])if(dir[k]!=null)f.in[k]=dir[k]?1:0},act(p,k){act(k,0,p?1:0)}};
const VK=[{w:'u',a:'l',s:'d',d:'r',t:'g'},{ArrowUp:'u',ArrowLeft:'l',ArrowDown:'d',ArrowRight:'r',';':'g'}],VA=[{f:'z',g:'x',h:'c',c:'a',v:'s',b:'d',n:'f'},{j:'z',k:'x',l:'c','7':'a','8':'s','9':'d','0':'f'}],VN={Numpad0:'g',Numpad1:'z',Numpad2:'x',Numpad3:'c',Numpad4:'a',Numpad5:'s',Numpad6:'d',NumpadAdd:'f'};
function vsKey(e,k){const c=e.code||'';if(c.startsWith('Numpad')){const v=VN[c];return v?[1,v=='g'?'d':'a',v]:null}for(let p=0;p<2;p++){if(VK[p][k])return[p,'d',VK[p][k]];if(VA[p][k])return[p,'a',VA[p][k]]}return null}
function go2P(){VS2=true;tutM=false;SPECT=false;msub=0;p2s=0;mode='menu'}
const v2col=()=>ch2==ch&&col2==colOf(ch)?(col2+1)%NCOL:col2;
function p2w(fn){if(!VS2)return fn();const two=p2s&&!msub,t=ch;KP=two?2:1;if(two){ch=ch2;P2S=t+1}try{return fn()}finally{if(two){if(ch!=ch2){ch2=ch;col2=ch2==t?(colOf(t)+1)%NCOL:colOf(ch2)}ch=t;P2S=0}KP=0}}
function mBack(){if(msub)msub=0;else if(VS2&&p2s)p2s=0;else mode='title'}
function mNext(){if(VS2&&!p2s){p2s=1;col2=ch2==ch?(colOf(ch)+1)%NCOL:colOf(ch2)}else msub=1}
