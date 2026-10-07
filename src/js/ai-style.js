const NOCB=['stance','limit','buff','tr'];
const PD={keep:[0,66],rush:1,rt:0,ag:1,tm:1,qm:1,jm:1,sm:1,gm:1,am:1,ha:0,tag:'標準'};
/* v50 戦闘スタイル: keep=保ちたい間合い rush=詰める頻度 anti=対空 grabs=密着でつかみ技 poke=[最小,最大,技,頻度,構え] 中距離の差し込み dashIn=ダッシュで詰める trap=設置 rz=条件を満たすと常に詰める */
const BZ=f=>f.bz>0,PERS={'ブレイズ':{...PD,keep:[60,120],rush:.35,rt:.04,qm:1.8,gm:1.3,sm:1.3,anti:.6,poke:[[70,98,'H',.35]],tag:'後の先型'},
'ボルト':{...PD,ag:2.4,jm:.8,gm:.8,tm:1.3,dashIn:1.5,anti:.3,tag:'インファイト型'},
'タイタン':{...PD,ag:.7,tm:1.5,gm:1,jm:.2,sm:1,grabs:.35,anti:.4,tag:'重戦車型'},
'ジョーカー':{...PD,keep:[70,150],rush:.5,rt:.05,qm:1.6,jm:1.2,sm:1.3,gm:.8,ag:1.3,trap:1,anti:.3,rz:BZ,tag:'トリックスター型'},
'ゲイル':{...PD,keep:[70,130],rush:.6,rt:.04,jm:1.6,am:1.7,ha:10,anti:.3,qm:1.5,ag:1.6,sm:1.3,tag:'一撃離脱型'},
'ヴァンプ':{...PD,keep:[55,110],rush:.5,rt:.04,ag:1.6,sm:1.6,gm:1.1,tag:'吸血鬼型'},
'ガロウ':{...PD,ag:2.2,rush:.9,tm:1.2,gm:1,sm:1.6,jm:1,dashIn:1.5,anti:.4,poke:[[52,80,'CL',.8]],rz:BZ,tag:'猛攻型'},
'ルリ':{...PD,keep:[85,140],rush:.3,rt:.06,qm:1.8,sm:1.5,gm:1.1,ag:1.3,anti:.4,poke:[[95,128,'H2',.25],[80,112,'H',.2]],tag:'制圧砲台型'},
'カグラ':{...PD,keep:[70,140],rush:.45,rt:.05,qm:0,sm:1.3,gm:1.3,ag:1.4,anti:.5,poke:[[92,126,'H',.5,1],[88,122,'L',.6,1]],tag:'間合い剣士型'},
'イヴ':{...PD,keep:[80,150],rush:.35,rt:.05,qm:0,sm:1.2,gm:1.2,ag:1.4,jm:1.4,am:1.5,rz:f=>f.stc>=2,tag:'空中砲台型'},
'ツララ':{...PD,keep:[60,125],rush:0.5,rt:.05,qm:2.2,sm:1.2,gm:1.1,ag:1.6,jm:.8,anti:.5,poke:[[60,92,'CL',.6]],rz:f=>chst(f===A?B:A)>=1,tag:'凍てつき型'}};
function styleAI(f,o,PR){if(f.st!='i'||f.y>0||mode!='play')return false;const L=LV[lv],r=Math.random(),dx=o.x-f.x,d=Math.abs(dx),up=o.st!='fall'&&o.st!='down'&&o.inv<=0,g0=f.gauge;
if(PR.anti&&o.y>24&&o.st!='fall'&&d<78&&lv>=1&&r<PR.anti*.012*lv){f.cr=1;atk(f,'H');return true}
if(PR.grabs&&up&&o.y<=0&&d<62&&lv>=1&&r<PR.grabs*(.012+.008*lv)*(f.ht>=3&&g0>=8?3:1)){atk(f,g0>=20?'R':g0>=12?'E':g0>=8?'W':'T');return true}
if(PR.trap&&g0>=8&&d>90&&d<230&&lv>=1&&!PJ.some(p=>p.trap&&p.own===f)&&r<.003*(lv+1)){atk(f,'W');return true}
if(PR.poke&&up&&o.y<40&&lv>=1)for(const p of PR.poke)if((p[4]==null||!!f.stc==!!p[4])&&d>p[0]&&d<p[1]&&r<L.ag*p[3]){const k=p[2];if(k[0]=='C'){f.cr=1;atk(f,k[1])}else atk(f,k[0],k.length>1);return true}
if(PR.dashIn&&d>110&&d<260&&f.dsh<=0&&f.legs<2&&r<PR.dashIn*.004*(lv+1)){startDash(f,dx>0?1:-1);return true}
return false}
