/* NEON FIGHTER ゲームパッド対応（外付け部品）
 * コントローラーの入力をキーボード入力に変換してゲームに渡す。ゲーム本体は変更しない。
 * 配置（Xbox配列での名前 / 位置）:
 *   十字キー・左スティック = 移動      X(左)=弱  Y(上)=強  A(下)=投げ  B(右)=ガード
 *   LB / RB / LT / RT = 必殺技 1〜4     START = ポーズ     BACK = トレーニングで中央に戻す
 * メニュー: 十字キーで選択、A=決定、B=戻る。タイトルは A=対戦、Y=トレーニング。
 */
(function(){
  if(!navigator.getGamepads)return;
  var DEAD=0.5,prev={},held={},seen=false;
  function key(type,k){try{window.dispatchEvent(new KeyboardEvent(type,{key:k,bubbles:true,cancelable:true}))}catch(e){}}
  function hold(id,k,on){if(on&&!held[id]){held[id]=k;key('keydown',k)}else if(!on&&held[id]){key('keyup',held[id]);delete held[id]}}
  function releaseAll(){for(var id in held){key('keyup',held[id])}held={}}
  function st(){var s={mode:'',paused:false,tut:false};try{s.mode=mode;s.paused=paused;s.tut=!!tut}catch(e){}return s}
  function read(){var ps=navigator.getGamepads(),b=[],ax=[0,0];
    for(var i=0;i<ps.length;i++){var p=ps[i];if(!p||!p.connected)continue;
      for(var j=0;j<p.buttons.length;j++)if(p.buttons[j]&&(p.buttons[j].pressed||p.buttons[j].value>0.5))b[j]=true;
      if(Math.abs(p.axes[0]||0)>Math.abs(ax[0]))ax[0]=p.axes[0];if(Math.abs(p.axes[1]||0)>Math.abs(ax[1]))ax[1]=p.axes[1]}
    return{b:b,l:!!b[14]||ax[0]<-DEAD,r:!!b[15]||ax[0]>DEAD,u:!!b[12]||ax[1]<-DEAD,d:!!b[13]||ax[1]>DEAD}}
  var PLAY={2:'z',3:'x',0:'c',4:'a',5:'s',6:'d',7:'f'};
  function tick(){requestAnimationFrame(tick);
    var any=false,ps=navigator.getGamepads();for(var i=0;i<ps.length;i++)if(ps[i]&&ps[i].connected)any=true;
    if(!any){if(seen){releaseAll();prev={}}return}
    if(!seen){seen=true;toast();try{window.NFA&&NFA.track&&NFA.track('gamepad_connected',{})}catch(e){}}
    var s=st(),g=read(),cur={},fight=(s.mode=='play'||s.mode=='intro'||s.mode=='ko')&&!s.paused;
    function edge(id,on){cur[id]=on;return on&&!prev[id]}
    if(fight){
      hold('l','ArrowLeft',g.l);hold('r','ArrowRight',g.r);hold('u','ArrowUp',g.u);hold('d','ArrowDown',g.d);hold('g','v',!!g.b[1]);
      for(var n in PLAY)if(edge('b'+n,!!g.b[n]))key('keydown',PLAY[n]);
      if(edge('start',!!g.b[9]))key('keydown','p');
      if(s.tut&&edge('back',!!g.b[8]))key('keydown','r');
    }else{
      releaseAll();
      var L=edge('ml',g.l),R=edge('mr',g.r),U=edge('mu',g.u),D=edge('md',g.d),A=edge('b0',!!g.b[0]),B=edge('b1',!!g.b[1]),X=edge('b2',!!g.b[2]),Y=edge('b3',!!g.b[3]),S=edge('start',!!g.b[9]);
      if(s.paused){if(A||S)key('keydown','Enter')}
      else if(s.mode=='title'){if(A||S)key('keydown','1');else if(Y)key('keydown','2')}
      else if(s.mode=='menu'){if(L)key('keydown','ArrowLeft');if(R)key('keydown','ArrowRight');if(U)key('keydown','ArrowUp');if(D)key('keydown','ArrowDown');
        if(A||S)key('keydown','Enter');else if(B)key('keydown','Escape');else if(X)key('keydown','c')}
      else if(s.mode=='end'){if(A||S)key('keydown','Enter');else if(X)key('keydown','c');else if(B)key('keydown','Escape')}
    }
    prev=cur}
  function toast(){var t=document.createElement('div');
    t.innerHTML='🎮 コントローラー接続<br><span style="color:#9aa3b5">左=弱　上=強　下=投げ　右=ガード　／　LB・RB・LT・RT=必殺技　／　START=ポーズ</span>';
    t.style.cssText='position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:7;background:rgba(18,20,27,.94);border:1px solid rgba(255,255,255,.22);border-radius:10px;padding:8px 14px;color:#fff;font:12px/1.6 "Noto Sans JP",system-ui,sans-serif;text-align:center;pointer-events:none;transition:opacity .6s';
    document.body.appendChild(t);setTimeout(function(){t.style.opacity='0'},6000);setTimeout(function(){t.remove()},7000)}
  addEventListener('gamepaddisconnected',function(){releaseAll();prev={};seen=false});
  addEventListener('blur',releaseAll);
  requestAnimationFrame(tick);
})();
