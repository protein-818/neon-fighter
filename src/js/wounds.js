const LN=['前腕','後腕','前脚','後脚'];
/* v37 部位ダメージ: 蓄積が破壊ラインの45%で負傷(1)、75%で重傷(2)。腕=腕技の出が+1F/+2F(左右で重い方)、脚=脚技の出が同様に遅れ、移動・跳躍・ダッシュも鈍る。キャンセルで出す技は遅れない */
const WQ=[.45,.75],RVT=110;
const wq=(f,i)=>{if(!f.pd||!f.pbk)return 0;if(f.pbk[i])return 2;const q=f.pd[i]/(f.mhp*PT);return q>=WQ[1]?2:q>=WQ[0]?1:0},wLegU=f=>f.pbk?(f.pbk[2]?0:wq(f,2))+(f.pbk[3]?0:wq(f,3)):0;
function wLag(f,sm,t){if(tut||!f.pd||sm.kind=='stance'||sm.kind=='limit'||sm.kind=='buff')return 0;const lg=LEG.includes(sm.ps||t);return Math.max(lg?wq(f,2):wq(f,0),lg?wq(f,3):wq(f,1))}
function wound(d,i,w){burst(d.x,GY-d.y-(i<2?80:28),w>1?20:45);if(typeof WND!='undefined')WND[w-1]++}
function wTxt(f){if(!f.pd)return'';const a=Math.max(wq(f,0),wq(f,1)),k=Math.max(wq(f,2),wq(f,3)),m=Math.round((1-(1-.06*wLegU(f))*(f.legs?(1-.22*f.legs)*(f.legs>=2?.45:1):1))*100),p=[];if(a)p.push('腕技 +'+a+'F');if(k)p.push('脚技 +'+k+'F');if(m)p.push('移動 −'+m+'%');return p.length?'負傷  '+p.join(' ・ '):''}
