/* NEON FIGHTER 公開ページ用の追加リンク（タイトル画面のときだけ右下に表示） */
(function(){
  var FEEDBACK_URL='';   // ← 感想フォームのURLを入れると「感想を送る」が表示される
  var box=document.createElement('div');
  box.style.cssText='position:fixed;right:max(10px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));z-index:6;display:none;font:11px "Noto Sans JP",system-ui,sans-serif';
  function link(t,href){var a=document.createElement('a');a.textContent=t;a.href=href;a.target='_blank';a.rel='noopener';
    a.style.cssText='color:#9aa3b5;text-decoration:none;margin-left:14px;padding:6px 2px;display:inline-block';
    a.addEventListener('pointerdown',function(e){e.stopPropagation()});box.appendChild(a)}
  if(FEEDBACK_URL)link('感想を送る',FEEDBACK_URL);
  link('利用データについて','privacy.html');
  document.body.appendChild(box);
  /* 決着画面に「結果をXでシェア」を出す（観戦時は出さない） */
  var SITE='https://protein-818.github.io/neon-fighter/';
  var sh=document.createElement('a');sh.textContent='結果を X でシェア';sh.target='_blank';sh.rel='noopener';
  sh.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:84%;z-index:6;display:none;background:#1a1d25;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:9px 20px;color:#fff;text-decoration:none;font:700 13px "Noto Sans JP",system-ui,sans-serif';
  sh.addEventListener('pointerdown',function(e){e.stopPropagation()});
  sh.addEventListener('click',function(){try{window.NFA&&NFA.track&&NFA.track('share_click',{result:win})}catch(e){}});
  document.body.appendChild(sh);
  function shareText(){var t=A.c.n+'で '+B.c.n+'（CPU '+LV[lv].n+'）に'+(win=='WIN'?'勝利！':'敗北…次は勝つ。');return t+' #NEONFIGHTER'}
  setInterval(function(){var m='',sp=false;try{m=mode;sp=SPECT}catch(e){}
    box.style.display=m==='title'?'block':'none';
    var on=m==='end'&&!sp;
    if(on&&sh.style.display==='none'){try{sh.href='https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText())+'&url='+encodeURIComponent(SITE)}catch(e){on=false}}
    if(on){try{var r=cv.getBoundingClientRect();sh.style.left=(r.left+r.width/2)+'px';sh.style.top=(r.top+r.height*.84)+'px'}catch(e){}}
    sh.style.display=on?'block':'none'},250);
})();
