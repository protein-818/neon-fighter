const PB={x:312,y:28,w:56,h:30},kk=(a,b)=>touch?b:a;
/* v60 ブレイズの溜め: chg=押し続けを見る入力名(in.hx=強 in.ha=必殺1)。発生の直前(at==su-1)で止まり、押してから CHGT F で最大。最大から CHGA F で自動的に出る。最大で離すと mx(最大溜め版)になる。途中で離すと通常版。f.cg=押してからのF f.cq=離した f.cm=最大で出した f.cw=CPUが溜めるつもり */
const CHGT=30,CHGA=30,CHGK=1.3;{const c=CH.find(c=>c.n=='ブレイズ'),M=c.M;c.chgc=1;M.H.chg=M.H2.chg='hx';M.Q.chg='ha';M.H.mx={...M.H,d:M.H.d*CHGK,lau:1,cmx:1};M.H2.mx={...M.H2,d:M.H2.d*CHGK,gb:1,cmx:1};M.Q.mx={...M.Q,r:18,n:2,multi:2,iv:6,d:M.Q.d*CHGK/2,cmx:1}}
/* v61 ボルトのギア: f.gr=0〜3。当てる・ガードさせる(1つの技で1回)・投げ・カウンターで+1、のけぞりで−1(相手の1つの技で1回)、PARRYされて−1、ダウン・つかまれて0、GRI F 何も起きないと−1。通常技の硬直−gr F(最短2F)、歩きとダッシュ+GRS×gr。EV()=戦闘のできごとをキャラ固有の仕組みに伝える口 */
const GRI=240,GRS=.04,GRM=['L','L2','H','H2','CL','CH'];let AID=0;CH.find(c=>c.n=='ボルト').gear=1;
/* v62 タイタンのヒート: f.ht=0〜3。アーマーで耐える(相手の1つの技で1回)・投げ・つかみ必殺で+1。減らない。ラウンドをまたいで持ち越す。ヒート3でつかみ必殺をつかむと強化版(ダメージ×HTK)になり0に戻る */
const HTK=1.25;CH.find(c=>c.n=='タイタン').heat=1;
function heat(f,n){const h0=f.ht|0,h1=Math.min(3,h0+n);if(h1==h0)return;f.ht=h1;sfx('heat',h1);ring(f.x,GY-f.y-55,'#ffd23c',h1>=3?1:0)}
/* v63 ゲイルの空中ダッシュ: 空中で前か後ろを2回。f.ads=残りF f.add=向き f.adu=このジャンプで使った。高さを保って水平に滑る(前 ADF F・後ろ ADB F)。1回のジャンプに1回、着地で戻る。無敵なし */
const ADF=10,ADB=8,ADV=5.2,ADW=4.4;CH.find(c=>c.n=='ゲイル').adash=1;
function airDash(f,dir){if(f.adu||f.y<=0||f.legs>=2)return false;const fw=dir==f.face;f.adu=1;f.ads=fw?ADF:ADB;f.add=dir;f.adf=fw;f.vy=0;ring(f.x-dir*8,GY-f.y-45,fcol(f));ring(f.x-dir*8,GY-f.y-45,'#ffffff');sfx('dash');if(f.cpu&&typeof ADN!='undefined')ADN++;return true}
/* v64 ツララ: 凍え=相手ごとの値 f.chv(0〜CQ2)。ツララの技(ch=増える量)が当たると増え、ガードは1/4、PARRY・アーマー・当て身は増えない。CQ1以上で段階1、CQ2に届くと段階2(f.chm。CQR を下回るまで続く)。最後に氷の技を受けてから CQW F たつと 1F に CQD ずつ減る。段階ぶんだけ 待機から出す技の発生+1F(負傷と合わせて+3Fまで)・歩きとダッシュ−6%・ジャンプ−3%。滑走=前ダッシュの距離 CQS 倍、相手をすり抜ける(無敵なし)。req=相手が段階1以上のときだけ出せる技(氷葬)。段階2の相手には CQK 倍 */
const CQ1=50,CQ2=100,CQR=75,CQD=0.25,CQW=40,CQS=1.2,CQK=1.25,chst=f=>f.chm?2:f.chv>=CQ1?1:0,chLag=(f,sm)=>sm.kind=='stance'||sm.kind=='limit'||sm.kind=='buff'?0:chst(f),cTxt=f=>{const s=chst(f);return s?'凍え  技 +'+s+'F ・ 移動 −'+s*6+'%':''},SPNG=(f,t)=>{const m=f.c.M[t];return!!(m&&m.req)&&chst(f===A?B:A)<1};
function chill(d,n){if(!(d.hp>0))return;const s0=chst(d);d.chv=Math.min(CQ2,(d.chv||0)+n);d.cht=CQW;if(d.chv>=CQ2)d.chm=1;const s1=chst(d);if(s1>s0){sfx('chl',s1);ring(d.x,GY-d.y-50,'#cfe8ff',s1>1?1:0);if(s1>1)ring(d.x,GY-d.y-50,'#ffffff')}}
function gear(f,n){const g0=f.gr|0,g1=Math.max(0,Math.min(3,g0+n));f.grt=0;if(g1==g0)return;f.gr=g1;sfx(g1>g0?'gup':'gdn',g1);if(g1>g0){ring(f.x,GY-f.y-52,fcol(f));if(g1==3)ring(f.x,GY-f.y-52,'#ffffff',1)}}
function EV(t,a,d,ex,kd){if(a.c.chill&&ex){if(t=='grab'&&ex.sp){if(chst(d)>=2)ex.td*=CQK;d.chv=0;d.chm=0;ex.ice=1;if(typeof IBN!='undefined')IBN++}else if(ex.ch&&(t=='hit'||t=='blk'||t=='grab'))chill(d,t=='blk'?ex.ch/4:ex.ch)}
if(a.c.gear){if(t=='hit'||t=='blk'){if(a.guk!==a.aid){a.guk=a.aid;gear(a,1)}else a.grt=0}else if(t=='grab')gear(a,1);else if(t=='pry')gear(a,-1)}
if(d.c.heat&&t=='arm'){const k=ex&&ex.sid?'s'+ex.sid:a.aid;if(d.hak!==k){d.hak=k;heat(d,1)}}
if(a.c.heat&&t=='grab'){if(ex.sp&&a.ht>=3){ex.td*=HTK;ex.hx=1;a.ht=0;sfx('heat',4);if(typeof HXN!='undefined')HXN++}else heat(a,1)}
if(d.c.gear){if(t=='hit'){if(kd)gear(d,-9);else{const k=ex&&ex.sid?'s'+ex.sid:a.aid;if(d.gdk!==k){d.gdk=k;gear(d,-1)}else d.grt=0}}else if(t=='grab')gear(d,-9);else if(t=='ctr')gear(d,1);else if(t=='blk'||t=='arm')d.grt=0}}
const DSK=f=>(f.c.mist?1.25:f.c.jetd?1.15:1)*(f.gr?1+GRS*f.gr:1)*(f.c.slide&&f.dfw?CQS:1)*(1-.06*chst(f));
const MV=f=>{const m=f.c.M[f.ty];return f.cm&&m.mx?m.mx:m};
/* v52 コンボ: キャンセルで出した技は相手ののけぞりが切れる前に当たるよう発生を短縮(最短CSMIN F)し、離れた分だけ踏み込む。打ち上げ(rise+lau)は真上に浮き、浮いた相手(高さJGY超)にJGM回まで追撃できる。ダウンは「lau技／1コンボの被ダメージがダウン耐性kt×KTM以上／CMAXヒット」。コンボ数は相手が動けるようになったら0に戻る。補正は1ヒットごとに−CSC(下限CMIN)、追撃は×JGD。BUFT=先行入力の受付F */
const JGY=6,JGM=3,JGD=.7,CSMIN=3,CMAX=12,KTM=2.5,CSC=.15,CMIN=.25,BUFT=9,HPK=2,THR=66,THV=3.5,THG=44;/* v53 投げ(C): 射程=THR+技のtr。出始めにTHVの速さで踏み込み、つかんだら相手の手前THGまで寄る */let SID=0;
const PW=3,LV=[{n:'ビギナー',sf:.65,ag:.02,pp:.003,bk:.15,dg:0,cb:0,tp:0,err:50},{n:'ノーマル',sf:.8,ag:.04,pp:.008,bk:.35,dg:.02,cb:.05,tp:.02,err:30},{n:'ハード',sf:.95,ag:.06,pp:.02,bk:.55,dg:.06,cb:.1,tp:.05,err:15},{n:'エキスパート',sf:1.05,ag:.09,pp:.04,bk:.75,dg:.12,cb:.15,tp:.08,err:6},{n:'ヘル',sf:1.15,ag:.13,pp:.07,bk:.9,dg:.25,cb:.2,tp:.12,err:0}];
