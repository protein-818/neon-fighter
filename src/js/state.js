/* v59 2人対戦: VS2=2人対戦中。ch2・col2=2Pのキャラと色、p2s=キャラ選択が2Pの番、P2S=2Pの選択を処理中(1Pのキャラ番号+1)、KP=技表に出すキーの組(0=通常 1=2人対戦の1P 2=同2P)。入力は NF_INPUT.set(p,{l,r,u,d,g})／NF_INPUT.act(p,k) に集めた(p:0=1P 1=2P、k:'z','x','c','a','s','d','f') */
let VS2=false,ch2=1,col2=0,p2s=0,P2S=0,KP=0;
let SPECT=false,SELF=null,msub=0,lastOpp=null,lastSG=null,lastCol=null,ST=null,endT=0,STGC=[],PVS={};
const XMIN=40,XMAX=640,GL=16,PT=0.9;let selC=0,selV=0,SG=0,lowFlag=false,lv=2,ch=0,mode='title',A,B,T=0,win='',shake=0,parts=[],texts=[],PJ=[],kt=0,zoom=1,koV=null,koFinal=0,koT=0,paused=false,tut=null,tutM=false,rn=1,rt=5400,introT=0,hstop=0,RG=[],SPX=[],DEB=[],IA=1,TT=0,CI=null,koPerfect=0,koTm=0;
try{const v=+localStorage.getItem('nf2_lv'),c=+localStorage.getItem('nf2_ch');if(v>=0&&v<5)lv=v;if(c>=0&&c<CH.length)ch=c;const a=+localStorage.getItem('nf2_sv');if(a>=0&&a<=5)selV=a;const cc=+localStorage.getItem('nf2_cpu');if(cc>=0&&cc<=CH.length)selC=cc}catch(e){}
function cycleCpu(d){const n=CH.length+1;selC=(selC+d+n)%n;try{localStorage.setItem('nf2_cpu',selC)}catch(e){}}
