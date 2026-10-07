// ソースの地図: 最上位の宣言と、読み込み時に走る文を行番号つきで出す
// 使い方: node map.js <index.html または 連結した js> [--load]
const fs=require('fs');let acorn;try{acorn=require('acorn')}catch(e){acorn=require('/opt/npm-tools/node_modules/acorn')}
const file=process.argv[2],only=process.argv.includes('--load');let s=fs.readFileSync(file,'utf8'),off=0;
if(/<script>/.test(s)){const a=s.indexOf('<script>')+8,b=s.lastIndexOf('</script>');off=s.slice(0,a).split('\n').length-1;s=s.slice(a,b)}
const ast=acorn.parse(s,{ecmaVersion:'latest',locations:true});
const names=n=>n.type=='Identifier'?[n.name]:n.type=='ObjectPattern'?n.properties.flatMap(p=>names(p.value||p.argument)):n.type=='ArrayPattern'?n.elements.filter(Boolean).flatMap(names):n.type=='AssignmentPattern'?names(n.left):n.type=='RestElement'?names(n.argument):[];
// 最上位の名前 → 宣言の種類と位置
const def={};ast.body.forEach((st,i)=>{if(st.type=='FunctionDeclaration')def[st.id.name]={k:'function',i,l:st.loc.start.line+off};else if(st.type=='VariableDeclaration')st.declarations.forEach(d=>names(d.id).forEach(n=>def[n]={k:st.kind,i,l:st.loc.start.line+off,fn:d.init&&/Function/.test(d.init.type)}))});
// 文の中で「関数の外」で読まれる識別子(=読み込み時に評価されるもの)
function eager(node,out,inFn){if(!node||typeof node.type!='string')return;if(/Function/.test(node.type)){return}
 if(node.type=='Identifier')out.add(node.name);
 for(const k in node){if(k=='loc'||k=='type')continue;const v=node[k];if(node.type=='MemberExpression'&&k=='property'&&!node.computed)continue;if(node.type=='Property'&&k=='key'&&!node.computed)continue;
  if(Array.isArray(v))v.forEach(x=>eager(x,out));else if(v&&typeof v=='object')eager(v,out)}}
// 読み込み時に呼ばれる関数の中身も1段たどる
function called(node,out){if(!node||typeof node.type!='string')return;if(/Function/.test(node.type))return;if(node.type=='CallExpression'&&node.callee.type=='Identifier')out.add(node.callee.name);for(const k in node){if(k=='loc')continue;const v=node[k];if(Array.isArray(v))v.forEach(x=>called(x,out));else if(v&&typeof v=='object')called(v,out)}}
const rows=[];ast.body.forEach((st,i)=>{const l=st.loc.start.line+off;let kind,nm=[],load=false;
 if(st.type=='FunctionDeclaration'){kind='function';nm=[st.id.name]}
 else if(st.type=='VariableDeclaration'){kind=st.kind;nm=st.declarations.flatMap(d=>names(d.id));load=st.declarations.some(d=>d.init&&!/Function/.test(d.init.type)&&!/Literal/.test(d.init.type))}
 else{kind='★実行';load=true}
 const e=new Set();if(st.type!='FunctionDeclaration')eager(st.type=='VariableDeclaration'?{type:'X',a:st.declarations.map(d=>d.init)}:st,e);
 const dep=[...e].filter(n=>def[n]&&def[n].i!=i&&!nm.includes(n));const c=new Set();called(st.type=='FunctionDeclaration'?null:st,c);
 const late=dep.filter(n=>def[n].i>i&&def[n].k!='function');
 rows.push({l,kind,nm,load,dep,calls:[...c].filter(n=>def[n]),late,src:s.slice(st.start,Math.min(st.end,st.start+70)).replace(/\n/g,' ')})});
for(const r of rows){if(only&&r.kind!='★実行'&&!r.dep.length)continue;
 console.log(String(r.l).padStart(5),r.kind.padEnd(8),r.nm.length?r.nm.join(','):r.src,r.dep.length&&(only||r.kind=='★実行')?'\n        ← 読み込み時に使う: '+r.dep.join(','):'',r.late.length?'\n        ！後ろで宣言される名前を読み込み時に参照: '+r.late.join(','):'')}
console.error('最上位の文',rows.length,'/ 関数',rows.filter(r=>r.kind=='function').length,'/ ★実行',rows.filter(r=>r.kind=='★実行').length);
