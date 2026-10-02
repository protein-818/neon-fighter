/* NEON FIGHTER 計測モジュール
 * 測るもの: (1)プレイ人数 (2)1回の平均プレイ時間 (3)翌日また来た割合 (4)キャラ別の使用率
 * (1)〜(3)はGoogleアナリティクス(GA4)が自動で集計。(4)は下の match_start イベントで送る。
 * GA_ID が空のあいだは何も外部に送信しない（ゲームは普通に動く）。
 */
(function(){
  var GA_ID='';            // ← GA4の測定ID（G-XXXXXXXXXX）をここに入れると計測が始まる
  var DEBUG=/[?&]nfa_debug=1/.test(location.search);
  var on=!!GA_ID&&navigator.doNotTrack!=='1';
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments)}
  if(on){
    var s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag('js',new Date());gtag('config',GA_ID);
  }
  function send(name,p){
    if(DEBUG)console.log('[NFA]',name,JSON.stringify(p||{}));
    if(on)try{gtag('event',name,p||{})}catch(e){}
  }
  var cur=null;
  window.NFA={
    matchStart:function(p){cur={t:Date.now(),p:p};send('match_start',p)},
    matchEnd:function(p){
      var o={};if(cur){for(var k in cur.p)o[k]=cur.p[k];o.duration_sec=Math.round((Date.now()-cur.t)/1000)}
      for(var j in p)o[j]=p[j];cur=null;send('match_end',o)},
    trainingStart:function(p){cur=null;send('training_start',p)}
  };
})();
