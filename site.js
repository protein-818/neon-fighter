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
  setInterval(function(){var on=false;try{on=mode==='title'}catch(e){}box.style.display=on?'block':'none'},250);
})();
