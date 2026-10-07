const AUD={bgm:1,se:1};try{const a=JSON.parse(localStorage.getItem('nf_aud2')||'null');if(a){AUD.bgm=a.bgm?1:0;AUD.se=a.se?1:0}}catch(e){}
const saveAud=()=>{try{localStorage.setItem('nf_aud2',JSON.stringify(AUD))}catch(e){}};
let AC=null,MG,SFg,BGg,NBUF,aOK=typeof AudioContext!='undefined'||typeof webkitAudioContext!='undefined',PV=1;
let REV,SDIST,BBUS,CROWD=null;function dcurve(k){const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=(1+k)*x/(1+k*Math.abs(x))}return c}
function ac(){if(!aOK)return null;try{if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();const cp=AC.createDynamicsCompressor();cp.threshold.value=-14;cp.ratio.value=4;cp.connect(AC.destination);MG=AC.createGain();MG.gain.value=.85;MG.connect(cp);
const n=AC.sampleRate,b=AC.createBuffer(1,n,n),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;NBUF=b;
REV=AC.createConvolver();const L=Math.floor(n*1.8),ir=AC.createBuffer(2,L,n);for(let ch=0;ch<2;ch++){const q=ir.getChannelData(ch);for(let i=0;i<L;i++)q[i]=(Math.random()*2-1)*Math.pow(1-i/L,3.2)}REV.buffer=ir;const rg=AC.createGain();rg.gain.value=.9;REV.connect(rg);rg.connect(MG);
SFg=AC.createGain();SFg.gain.value=1.4;SFg.connect(MG);const rs=AC.createGain();rs.gain.value=.16;SFg.connect(rs);rs.connect(REV);
SDIST=AC.createWaveShaper();SDIST.curve=dcurve(6);SDIST.connect(SFg);
BGg=AC.createGain();BGg.gain.value=0;BGg.connect(MG);const rb=AC.createGain();rb.gain.value=.22;BGg.connect(rb);rb.connect(REV);
const bd=AC.createWaveShaper();bd.curve=dcurve(9);const bl=AC.createBiquadFilter();bl.type='lowpass';bl.frequency.value=1100;bd.connect(bl);bl.connect(BGg);BBUS=bd}
if(AC.state=='suspended')AC.resume()}catch(e){aOK=false;AC=null;return null}return AC}
function tn(f,d,type,v,f2,t0,dest){const t=AC.currentTime+(t0||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(dest||SFg);o.start(t);o.stop(t+d+.02)}
function nz(d,v,ft,f0,f1,t0,dest){const t=AC.currentTime+(t0||0),s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NBUF;fl.type=ft||'bandpass';fl.frequency.setValueAtTime(f0,t);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(fl);fl.connect(g);g.connect(dest||SFg);s.start(t,Math.random()*.5);s.stop(t+d+.02)}
function beep(f,d=.05,t='square',v=.03){if(!AC||!AUD.se)return;try{tn(f,d,t,v*1.2,f*.7)}catch(e){}}
const D=()=>SDIST,click=(f,v)=>tn(f,.014,'square',v||.2),crowd=(d,v,t0)=>{nz(d,v,'bandpass',650,900,t0);nz(d*.9,v*.7,'bandpass',1250,1500,(t0||0)+.05)};
const SFX={
swingL:()=>{nz(.09,.1,'bandpass',3200*PV,1300);nz(.05,.04,'highpass',6000)},
swingH:()=>{nz(.17,.16,'bandpass',2000*PV,450);tn(150*PV,.16,'sine',.08,70)},
hitL:()=>{click(1900*PV,.16);nz(.06,.28,'highpass',2600);tn(320*PV,.08,'square',.16,120,0,D())},
hitM:()=>{click(1600*PV,.2);nz(.09,.34,'bandpass',1600,500);tn(210*PV,.13,'sawtooth',.22,70,0,D());tn(95,.13,'sine',.3,45)},
hitH:()=>{click(1400,.25);nz(.26,.45,'lowpass',4500,280);tn(150*PV,.3,'sawtooth',.3,38,0,D());tn(72,.38,'sine',.45,28);crowd(.6,.05,.08)},
combo:a=>{const f=520+Math.min(12,a)*70;tn(f,.09,'square',.06);tn(f*1.5,.12,'triangle',.06,0,.05)},
block:()=>{tn(1230*PV,.06,'square',.07);tn(1870*PV,.14,'triangle',.09);tn(2950*PV,.22,'sine',.06);nz(.04,.14,'highpass',4500)},
parry:()=>{tn(2200,.4,'sine',.16,2700);tn(3300,.35,'sine',.08);tn(110,.15,'sine',.3,50);nz(.12,.12,'highpass',6000);crowd(.5,.04,.05)},
armor:()=>{tn(420,.16,'square',.12,300,0,D());tn(640,.2,'triangle',.08);nz(.08,.2,'bandpass',900)},
counter:()=>{SFX.hitH();tn(2400,.3,'sine',.14,1200,.03)},
grab:()=>{nz(.12,.16,'bandpass',900,1600);tn(180,.12,'square',.07,280)},
slam:()=>{tn(120,.45,'sine',.55,30);nz(.35,.5,'lowpass',1800,100);tn(90,.2,'sawtooth',.2,40,0,D());crowd(.8,.06,.1)},
tech:()=>{click(2400,.18);click(1800,.15);tn(900,.08,'square',.06,0,.04)},
jump:()=>nz(.13,.08,'bandpass',800*PV,2600),
land:()=>{tn(110,.08,'sine',.18,50);nz(.06,.1,'lowpass',900,200)},
dash:()=>{nz(.16,.16,'bandpass',2200*PV,700);nz(.1,.05,'highpass',6500,0,.03);tn(130,.1,'sine',.12,60)},
shoot:()=>{tn(900*PV,.2,'sawtooth',.1,280,0,D());nz(.14,.1,'bandpass',2400,700)},
spk:()=>{tn(220,.28,'sawtooth',.09,1300,0,D());nz(.25,.12,'bandpass',600,3200)},
super:()=>{tn(60,.6,'sawtooth',.16,700,0,D());tn(120,.6,'square',.07,1400);nz(.6,.18,'bandpass',300,4200);tn(80,.55,'sine',.5,28,.45);nz(.4,.35,'lowpass',3000,120,.45);crowd(1.3,.09,.35)},
aura:()=>{tn(110,.6,'sawtooth',.08,330,0,D());nz(.5,.1,'bandpass',400,1400)},
heat:a=>{const v=a||1;crowd(.7+.3*v,.05+.035*v,0);tn(110+20*v,.25,'sine',.25,60);if(v>=3)[523,659,784].forEach((f,i)=>tn(f,.3,'triangle',.06,0,.05+i*.07))},
chl:a=>{const v=a||1;tn(1700+350*v,.2,'sine',.09,2700);tn(2800,.26,'triangle',.05,0,.05);nz(.12,.1,'highpass',7000);if(v>=3){nz(.32,.32,'highpass',2600);tn(880,.3,'triangle',.1,280)}},
gup:a=>{const f=520+(a||1)*190;tn(f,.07,'square',.07,f*1.5);tn(f*2,.12,'triangle',.07,0,.04);nz(.05,.07,'highpass',6000)},
gdn:()=>{tn(420,.12,'triangle',.05,210);nz(.05,.03,'bandpass',900)},
chg:()=>{tn(1320,.1,'triangle',.11);tn(1980,.22,'sine',.09,0,.05);nz(.08,.08,'highpass',5000)},
tag:()=>{tn(1046,.35,'sine',.12);tn(1568,.3,'sine',.07,0,.04);click(3000,.08)},
tele:()=>{tn(1700,.25,'sine',.12,150);nz(.22,.12,'bandpass',3500,300)},
det:()=>{click(1200,.25);nz(.5,.45,'lowpass',3500,120);tn(110,.5,'sawtooth',.28,28,0,D());tn(60,.55,'sine',.45,25);crowd(.7,.06,.1)},
limb:()=>{for(let i=0;i<6;i++)nz(.035,.32,'bandpass',1400+i*450,500,i*.022);nz(.18,.25,'bandpass',900,2600,.13);tn(320,.12,'square',.12,70,.14,D());tn(80,.35,'sine',.45,28,.14);click(2200,.22);crowd(1,.09,.2)},
ko:()=>{click(1000,.3);tn(90,1.3,'sine',.55,24);nz(1.2,.5,'lowpass',3500,60);tn(140,.6,'sawtooth',.25,30,0,D());[180,271,412,577].forEach(f=>tn(f,1.6,'sine',.06));crowd(1.9,.12,.15)},
round:()=>{for(const t0 of[0,.32])[880,1318,2210,3150].forEach((f,i)=>tn(f,.9,'sine',.09/(i+1)*2,0,t0))},
fight:()=>{for(const t0 of[0,.13,.26])[880,1318,2210].forEach((f,i)=>tn(f,.5,'sine',.08/(i+1)*2,0,t0));crowd(1.4,.1,.1)},
rival:a=>{const v=a||0;crowd(1.4+.5*v,.06+.035*v,0);tn(62,.7,'sine',.4,30);tn(62,.5,'sine',.3,30,.34);if(v>1)[392,523,659].forEach((f,i)=>tn(f,.5,'triangle',.05,0,.1+i*.09))},
ok:()=>{tn(880,.1,'triangle',.08);tn(1320,.15,'triangle',.08,0,.08)},
ui:()=>{click(1800,.06);tn(900,.04,'square',.03)},
tick:()=>{click(2600,.1);tn(1300,.05,'square',.04)},
win:()=>{crowd(2.2,.12,0);[523,659,784,1046,784,1046].forEach((f,i)=>tn(f,.3,'square',.07,0,i*.13))},
lose:()=>[392,349,311,262].forEach((f,i)=>tn(f,.5,'sawtooth',.08,f*.97,i*.24,D()))};
const sfxL={};
function sfx(n,a){if(!AC||!AUD.se||AC.state!='running')return;const now=AC.currentTime;if(sfxL[n]&&now-sfxL[n]<.035)return;sfxL[n]=now;PV=1+(Math.random()-.5)*.1;try{SFX[n](a)}catch(e){}}
function sfxAtk(t,sm){if(SP[t]){const c=sm.cost!=null?sm.cost:SP[t];sfx(c>=12?'super':'spk')}else if(t!='T')sfx(['H','H2','CH','AH'].includes(t)?'swingH':'swingL')}
const NT=n=>440*Math.pow(2,(n-69)/12),BGM={cur:'',nextT:0,step:0,bpm:100,tmr:null,root:40,inten:0};
function bv(t,n,d,ty,v,ft,dest){const o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type=ty;o.frequency.value=NT(n);fl.type='lowpass';fl.frequency.value=ft||3000;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(fl);fl.connect(g);g.connect(dest||BGg);o.start(t);o.stop(t+d+.02)}
function bn(t,d,v,ft,f0){const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NBUF;fl.type=ft;fl.frequency.value=f0;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(fl);fl.connect(g);g.connect(BGg);s.start(t,Math.random()*.5);s.stop(t+d+.02)}
function bkick(t,v){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(38,t+.14);g.gain.setValueAtTime(v||.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.connect(g);g.connect(BGg);o.start(t);o.stop(t+.24);bn(t,.012,.12*(v?v/.6:1),'highpass',3000)}
function bclap(t){for(const d of[0,.011,.023])bn(t+d,.02,.12,'bandpass',1300);bn(t+.03,.18,.16,'bandpass',1100)}
function bmetal(t,v){[540,1270,1970,2830].forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime((v||.05)/(i*.6+1),t);g.gain.exponentialRampToValueAtTime(.0008,t+.35-i*.05);o.connect(g);g.connect(BGg);o.start(t);o.stop(t+.4)});bn(t,.02,.08,'highpass',5000)}
function bbass(t,n,d,v){bv(t,n,d,'sawtooth',v,2400,BBUS);bv(t,n+.08,d,'square',v*.5,1600,BBUS)}
function bgmStep(t,st){const k=BGM.cur,bar=(st>>4)&3,s=st&15,root=BGM.root,spb=60/BGM.bpm/4,I=BGM.inten;
if(k=='battle'){const R=[0,0,1,-2][bar],BP=[1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1];
 if(BP[s]||(I&&s%2==0))bbass(t,root+R+(s==6||s==14?12:0),spb*.95,.16);
 if(s==0||s==8||(s==3&&bar%2==0)||(s==10&&bar%2==1)||(I&&(s==6||s==14)))bkick(t);
 if(s==4||s==12)bclap(t);
 if(s%2==0)bn(t,.025,I?.045:.03,'highpass',9000);if(I&&s%2)bn(t,.015,.02,'highpass',10000);
 if(s==14||(s==7&&bar==3))bmetal(t,.05);
 if(s==0&&bar%2==1)for(const iv of[0,1,7])bv(t,root+12+R+iv,spb*4,'sawtooth',.035,1600);
 if(bar==2&&[0,3,6,10].includes(s))bv(t,root+24+[0,1,3,1][[0,3,6,10].indexOf(s)],spb*2.6,'sawtooth',.04,1500);
 if(I&&s%4==2)bv(t,root+24+R+[0,1,3,7][(st>>2)&3],spb*1.4,'square',.03,2400);
}else if(k=='menu'){const R=[0,0,1,0][bar];
 if(s==0){bv(t,root-12+R,spb*16,'sawtooth',.05,420);bv(t,root-12+R+.12,spb*16,'sawtooth',.05,420);bv(t,root+7+R,spb*16,'triangle',.02,900)}
 if(s==0||s==3)bkick(t,s?.25:.4);
 if(s==8&&bar==3)bmetal(t,.03);
 if(s%4==2)bn(t,.03,.02,'highpass',8000);
 if((s==6||s==10)&&bar%2==0)bv(t,root+24+R+(s==6?3:1),spb*5,'sine',.035,2000)}}
function bgmSched(){if(!AC||AC.state!='running'||!BGM.cur)return;const spb=60/BGM.bpm/4;if(BGM.nextT<AC.currentTime-.3)BGM.nextT=AC.currentTime+.05;while(BGM.nextT<AC.currentTime+.15){bgmStep(BGM.nextT,BGM.step);BGM.nextT+=spb;BGM.step++}}
let lastMode='';
function bgmTick(){if(mode!=lastMode){if(mode=='end')sfx(SPECT||VS2||win=='WIN'?'win':'lose');lastMode=mode}
if(!AC)return;const want=(mode=='title'||mode=='menu'||tut)?'menu':(mode=='play'||mode=='intro'||mode=='ko')?'battle':'';
BGM.inten=!tut&&A&&B&&(A.rw==1&&B.rw==1||A.hp<A.mhp*.3||B.hp<B.mhp*.3)?1:0;
if(want!=BGM.cur){BGM.cur=want;BGM.step=0;BGM.nextT=AC.currentTime+.08}
BGM.root=[40,38,41,36,43][(SG||0)%5];BGM.bpm=want=='menu'?84:132+(BGM.inten?10:0);if(want=='battle'&&!CROWD&&AUD.bgm){try{const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NBUF;s.loop=true;fl.type='bandpass';fl.frequency.value=700;fl.Q.value=.6;g.gain.value=.05;s.connect(fl);fl.connect(g);g.connect(BGg);s.start();CROWD={s,g}}catch(e){}}else if(want!='battle'&&CROWD){try{CROWD.s.stop()}catch(e){}CROWD=null}if(CROWD)CROWD.g.gain.setTargetAtTime(.035+.03*BGM.inten+(mode=='ko'?.08:0)+(GR?GR.cv*.012:0),AC.currentTime,.4);
const base=want=='menu'?.4:.3,duck=paused||mode=='ko'?.25:1;BGg.gain.setTargetAtTime(AUD.bgm&&want?base*duck:0,AC.currentTime,.12)}
let SIL=null,silOK=false;
function silURL(){let b='RIFF';const n=4000,u32=x=>String.fromCharCode(x&255,x>>8&255,x>>16&255,x>>24&255),u16=x=>String.fromCharCode(x&255,x>>8&255);b+=u32(36+n)+'WAVEfmt '+u32(16)+u16(1)+u16(1)+u32(8000)+u32(8000)+u16(1)+u16(8)+'data'+u32(n)+String.fromCharCode(128).repeat(n);return 'data:audio/wav;base64,'+btoa(b)}
function unlockAudio(){if(!aOK)return;try{if(navigator.audioSession&&navigator.audioSession.type!='playback')navigator.audioSession.type='playback'}catch(e){}
try{if(!SIL){SIL=new Audio(silURL());SIL.loop=true;SIL.setAttribute('playsinline','');SIL.preload='auto'}if(!silOK){const p=SIL.play();if(p&&p.then)p.then(()=>silOK=true).catch(()=>{})}}catch(e){}
ac();if(!AC)return;try{const b=AC.createBuffer(1,1,22050),s=AC.createBufferSource();s.buffer=b;s.connect(AC.destination);s.start(0)}catch(e){}if(AC.state!='running')AC.resume().catch(()=>{});if(!BGM.tmr)BGM.tmr=setInterval(bgmSched,40)}
function audReady(){return AC&&AC.state=='running'}
function drawAud(){if((AUD.bgm||AUD.se)&&!audReady()&&aOK&&Date.now()%1200<800)txt('🔇 画面をタップすると音が鳴ります',672,52,11,UI.gold,'right');[['♪ BGM',498,AUD.bgm],['🔊 SE',588,AUD.se]].forEach(b=>{panel(b[1],8,84,26,b[2]?UI.p2:UI.p1,b[2]?'rgba(255,255,255,.35)':UI.ln,13);txt(b[0]+' '+(b[2]?'ON':'OFF'),b[1]+42,26,11,b[2]?'#fff':'#6b7385')})}
function audHit(x,y){if(!(mode=='title'||mode=='menu'||paused)||y<4||y>38)return false;if(x>498&&x<582){AUD.bgm^=1;saveAud();return true}if(x>588&&x<672){AUD.se^=1;saveAud();if(AUD.se)sfx('ui');return true}return false}
