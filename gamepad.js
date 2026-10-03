/* NEON FIGHTER コントローラー対応（外付け部品）
 * 対戦中の入力は、本体が公開している window.NF_INPUT に直接渡す（Version 59 以降）。
 *   VS CPU・トレーニング: つないだコントローラーはすべて 1P を操作する
 *   2人対戦: 1台目 = 1P、2台目 = 2P（1台だけなら 1P。2P はキーボード）
 * メニューとポーズは、キーボード入力に変換して渡す。
 * 配置（Xbox配列での名前 / 位置）:
 *   十字キー・左スティック = 移動      X(左)=弱  Y(上)=強  A(下)=投げ  B(右)=ガード
 *   LB / RB / LT / RT = 必殺技 1〜4     START = ポーズ     BACK = トレーニングで中央に戻す
 * 溜められる技（Version 60 以降。強と必殺技1）は、ボタンを押し続けると溜まり、離すと出る。
 * メニュー: 十字キーで選択、A=決定、B=戻る。タイトルは A=対戦、Y=トレーニング、X=2人対戦。
 */
(function(){
  if(!navigator.getGamepads)return;
  var DEAD=0.5,prev={},held={},seen=false,sent=[null,null];
  var ATK={2:'z',3:'x',0:'c',4:'a',5:'s',6:'d',7:'f'},ZERO={l:0,r:0,u:0,d:0,g:0};
  var CHG={3:'hx',4:'ha'},chg=[{},{}];
  function key(type,k){try{window.dispatchEvent(new KeyboardEvent(type,{key:k,bubbles:true,cancelable:true}))}catch(e){}}
  function hold(id,k,on){if(on&&!held[id]){held[id]=k;key('keydown',k)}else if(!on&&held[id]){key('keyup',held[id]);delete held[id]}}
  function st(){var s={mode:'',paused:false,tut:false,vs2:false,en:false,api:null};
    try{s.mode=mode;s.paused=paused;s.tut=!!tut}catch(e){}
    try{s.vs2=!!VS2}catch(e){}try{s.en=LANG=='en'}catch(e){}
    if(window.NF_INPUT&&NF_INPUT.set&&NF_INPUT.act)s.api=NF_INPUT;return s}
  function pads(){var ps=navigator.getGamepads(),o=[];for(var i=0;i<ps.length;i++)if(ps[i]&&ps[i].connected)o.push(ps[i]);return o}
  function read(p){var b=[],ax=p.axes||[];
    for(var j=0;j<p.buttons.length;j++)if(p.buttons[j]&&(p.buttons[j].pressed||p.buttons[j].value>0.5))b[j]=true;
    return{b:b,l:!!b[14]||(ax[0]||0)<-DEAD,r:!!b[15]||(ax[0]||0)>DEAD,u:!!b[12]||(ax[1]||0)<-DEAD,d:!!b[13]||(ax[1]||0)>DEAD}}
  function merge(a,b){if(!a)return b;var o={b:[],l:a.l||b.l,r:a.r||b.r,u:a.u||b.u,d:a.d||b.d};for(var i=0;i<17;i++)o.b[i]=a.b[i]||b.b[i];return o}
  /* 方向とガードは、変わったときだけ渡す（キーボードで遊ぶ人の入力を上書きしないため） */
  function setDir(api,p,g){var d=g?{l:g.l?1:0,r:g.r?1:0,u:g.u?1:0,d:g.d?1:0,g:g.b[1]?1:0}:ZERO,o=sent[p];
    if(o&&o.l==d.l&&o.r==d.r&&o.u==d.u&&o.d==d.d&&o.g==d.g)return;
    if(!o&&d===ZERO)return;
    sent[p]=d===ZERO?null:d;try{api.set(p,d)}catch(e){}}
  function releaseAll(s){for(var id in held)key('keyup',held[id]);held={};
    if(s&&s.api)for(var p=0;p<2;p++){if(sent[p]){sent[p]=null;try{s.api.set(p,ZERO)}catch(e){}}
      if(chg[p].hx||chg[p].ha){chg[p]={};try{s.api.set(p,{hx:0,ha:0})}catch(e){}}}}
  function tick(){requestAnimationFrame(tick);
    var ps=pads(),s=st();
    if(!ps.length){if(seen){releaseAll(s);prev={}}return}
    if(!seen){seen=true;toast(s.en);try{window.NFA&&NFA.track&&NFA.track('gamepad_connected',{})}catch(e){}}
    var cur={},fight=(s.mode=='play'||s.mode=='intro'||s.mode=='ko')&&!s.paused,all=null,i;
    function edge(id,on){cur[id]=on;return on&&!prev[id]}
    for(i=0;i<ps.length;i++)all=merge(all,read(ps[i]));
    if(fight){
      if(s.api){
        /* 誰がどちらを操作するか: 2人対戦は 1台目=1P・2台目=2P、それ以外は全員 1P */
        var who=[null,null];
        for(i=0;i<ps.length;i++){var p=s.vs2&&i>=1?1:0,g=read(ps[i]);who[p]=merge(who[p],g)}
        for(var q=0;q<2;q++){setDir(s.api,q,who[q]);
          for(var n in ATK){var dn=!!(who[q]&&who[q].b[n]),was=prev['b'+n],c=CHG[n];
            if(who[q]&&edge('p'+q+'b'+n,dn)&&!was&&s.mode=='play'){
              /* 溜められる技（強・必殺技1）は「押している」ことも渡す。離したら戻す */
              if(c){chg[q][c]=1;try{var o={};o[c]=1;s.api.set(q,o)}catch(e){}}
              try{s.api.act(q,ATK[n])}catch(e){}}
            if(c&&!dn&&chg[q][c]){chg[q][c]=0;try{var o2={};o2[c]=0;s.api.set(q,o2)}catch(e){}}}}
      }else{
        /* 古い本体向け: キーボード入力に変換 */
        hold('l','ArrowLeft',all.l);hold('r','ArrowRight',all.r);hold('u','ArrowUp',all.u);hold('d','ArrowDown',all.d);hold('g','v',!!all.b[1]);
        for(var n2 in ATK)if(edge('b'+n2,!!all.b[n2]))key('keydown',ATK[n2]);
      }
      if(edge('start',!!all.b[9]))key('keydown','p');
      if(s.tut&&edge('back',!!all.b[8]))key('keydown','r');
    }else{
      releaseAll(s);
      /* 対戦中から押しっぱなしのボタンは、離すまでメニューの入力にしない */
      for(var n3=0;n3<4;n3++)if(prev['p0b'+n3]||prev['p1b'+n3])prev['b'+n3]=true;
      var L=edge('ml',all.l),R=edge('mr',all.r),U=edge('mu',all.u),D=edge('md',all.d),A=edge('b0',!!all.b[0]),B=edge('b1',!!all.b[1]),X=edge('b2',!!all.b[2]),Y=edge('b3',!!all.b[3]),S=edge('start',!!all.b[9]);
      if(s.paused){if(A||S)key('keydown','Enter')}
      else if(s.mode=='title'){if(A||S)key('keydown','1');else if(Y)key('keydown','2');else if(X)key('keydown','3')}
      else if(s.mode=='menu'){if(L)key('keydown','ArrowLeft');if(R)key('keydown','ArrowRight');if(U)key('keydown','ArrowUp');if(D)key('keydown','ArrowDown');
        if(A||S)key('keydown','Enter');else if(B)key('keydown','Escape');else if(X)key('keydown','c')}
      else if(s.mode=='end'){if(A||S)key('keydown','Enter');else if(X)key('keydown','c');else if(B)key('keydown','Escape')}
    }
    prev=cur}
  function toast(en){var t=document.createElement('div');
    t.innerHTML=en?'🎮 Controller connected<br><span style="color:#9aa3b5">Left=Light　Top=Heavy　Bottom=Throw　Right=Guard　/　LB·RB·LT·RT=Specials　/　START=Pause</span>'
      :'🎮 コントローラー接続<br><span style="color:#9aa3b5">左=弱　上=強　下=投げ　右=ガード　／　LB・RB・LT・RT=必殺技　／　START=ポーズ</span>';
    t.style.cssText='position:fixed;left:50%;bottom:34px;transform:translateX(-50%);z-index:7;background:rgba(18,20,27,.94);border:1px solid rgba(255,255,255,.22);border-radius:10px;padding:8px 14px;color:#fff;font:12px/1.6 "Noto Sans JP",system-ui,sans-serif;text-align:center;pointer-events:none;transition:opacity .6s';
    document.body.appendChild(t);setTimeout(function(){t.style.opacity='0'},6000);setTimeout(function(){t.remove()},7000)}
  addEventListener('gamepaddisconnected',function(){releaseAll(st());prev={};if(!pads().length)seen=false});
  addEventListener('blur',function(){releaseAll(st())});
  requestAnimationFrame(tick);
})();
