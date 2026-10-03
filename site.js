/* NEON FIGHTER 公開ページ用の外付け部品
 * - タイトル画面の右下にリンク（利用データの説明、感想フォーム）
 * - 決着画面に「結果を X でシェア」
 * 表示の言語は本体の LANG（ja / en）に合わせる。 */
(function(){
  var FEEDBACK_URL='';   // ← 感想フォームのURLを入れると「感想を送る」が表示される
  var box=document.createElement('div');
  box.style.cssText='position:fixed;right:max(10px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));z-index:6;display:none;font:11px "Noto Sans JP",system-ui,sans-serif';
  function link(t,href){var a=document.createElement('a');a.textContent=t;a.href=href;a.target='_blank';a.rel='noopener';
    a.style.cssText='color:#9aa3b5;text-decoration:none;margin-left:14px;padding:6px 2px;display:inline-block';
    a.addEventListener('pointerdown',function(e){e.stopPropagation()});box.appendChild(a);return a}
  var fb=FEEDBACK_URL?link('感想を送る',FEEDBACK_URL):null;
  var pv=link('利用データについて','privacy.html');
  document.body.appendChild(box);
  /* 決着画面に「結果をXでシェア」を出す（観戦時は出さない） */
  var SITE='https://protein-818.github.io/neon-fighter/';
  var sh=document.createElement('a');sh.textContent='結果を X でシェア';sh.target='_blank';sh.rel='noopener';
  sh.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:84%;z-index:6;display:none;background:#1a1d25;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:9px 20px;color:#fff;text-decoration:none;font:700 13px "Noto Sans JP",system-ui,sans-serif';
  sh.addEventListener('pointerdown',function(e){e.stopPropagation()});
  sh.addEventListener('click',function(){try{window.NFA&&NFA.track&&NFA.track('share_click',{result:win})}catch(e){}});
  document.body.appendChild(sh);
  function en(){try{return LANG=='en'}catch(e){return false}}
  function nm(x){try{return en()&&typeof TR=='function'?TR(x):x}catch(e){return x}}
  function shareText(){var E=en(),two=false,t;try{two=!!VS2}catch(e){}
    if(two)t=E?'1P '+nm(A.c.n)+' vs 2P '+nm(B.c.n)+' — '+(win=='WIN'?'1P':'2P')+' wins!'
            :'1P '+A.c.n+' vs 2P '+B.c.n+'、'+(win=='WIN'?'1P':'2P')+' の勝ち！';
    else if(E)t=(win=='WIN'?'Beat ':'Lost to ')+nm(B.c.n)+' (CPU '+nm(LV[lv].n)+') as '+nm(A.c.n)+(win=='WIN'?'!':'. Rematch time.');
    else t=A.c.n+'で '+B.c.n+'（CPU '+LV[lv].n+'）に'+(win=='WIN'?'勝利！':'敗北…次は勝つ。');
    return t+' #NEONFIGHTER'}
  var lastLang=null;
  setInterval(function(){var m='',sp=false,E=en();try{m=mode;sp=SPECT}catch(e){}
    if(E!==lastLang){lastLang=E;pv.textContent=E?'Privacy':'利用データについて';if(fb)fb.textContent=E?'Send feedback':'感想を送る';sh.textContent=E?'Share on X':'結果を X でシェア'}
    box.style.display=m==='title'?'block':'none';
    var on=m==='end'&&!sp;
    if(on&&sh.style.display==='none'){try{sh.href='https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText())+'&url='+encodeURIComponent(SITE)}catch(e){on=false}}
    if(on){try{var r=cv.getBoundingClientRect();sh.style.left=(r.left+r.width/2)+'px';sh.style.top=(r.top+r.height*.84)+'px'}catch(e){}}
    sh.style.display=on?'block':'none'},250);
})();
