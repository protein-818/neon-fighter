#!/usr/bin/env python3
"""Claude上のゲーム（HTML 1ファイル）を公開用 index.html に変換する。

使い方: python3 tools/apply_patch.py <Claudeから取り出したHTML> [出力先=index.html]

ゲームの挙動は変えず、公開に必要な差分だけを入れる:
  1. <head> に説明文・共有用メタ情報・アイコン
  2. analytics.js / site.js / gamepad.js の読み込み
  3. 対戦開始・決着・トレーニング開始の計測呼び出し
目印の文字列が見つからない（ゲーム側が変わった）場合はエラーで止まる。
"""
import sys

SITE = 'https://protein-818.github.io/neon-fighter/'
DESC = 'インストール不要。ブラウザで今すぐ遊べる2D格闘ゲーム。部位破壊・構え切替・10人のキャラクター。'
HEAD = f'''<title>NEON FIGHTER</title>
<meta name="description" content="{DESC}">
<meta property="og:title" content="NEON FIGHTER">
<meta property="og:description" content="{DESC}">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}">
<meta property="og:image" content="{SITE}og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">'''

EDITS = [
    ('<title>NEON FIGHTER</title>', HEAD),
    ("<script>\nconst cv=document.getElementById('c')",
     "<script src=\"analytics.js\"></script>\n<script>\nconst cv=document.getElementById('c')"),
    ("try{localStorage.setItem('nf2_lv',lv);localStorage.setItem('nf2_ch',ch)}catch(e){}}",
     "try{localStorage.setItem('nf2_lv',lv);localStorage.setItem('nf2_ch',ch)}catch(e){}"
     "try{window.NFA&&NFA.matchStart({character:CH[ch].n,opponent:CH[oi].n,level:lv,spectate:SPECT?1:0,rematch:re?1:0})}catch(e){}}"),
    ("if(koFinal){win=d===A?'LOSE':'WIN';recEnd()}",
     "if(koFinal){win=d===A?'LOSE':'WIN';recEnd();"
     "try{window.NFA&&NFA.matchEnd({result:koTm?'TIMEUP_'+win:win,rounds:A.rw+B.rw})}catch(e){}}"),
    ("r:[{h:A.hp,t:0},{h:B.hp,t:0}]};mode='play'}",
     "r:[{h:A.hp,t:0},{h:B.hp,t:0}]};mode='play';"
     "try{window.NFA&&NFA.trainingStart({character:CH[ch].n})}catch(e){}}"),
    ('</script></body></html>', '</script>\n<script src="site.js"></script>\n<script src="gamepad.js"></script></body></html>'),
]

def main():
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else 'index.html'
    raw = open(src, encoding='utf-8').read()
    # Claudeの公開ページは外側にもう1枚HTMLの枠が付くので、内側のゲーム本体だけ取り出す
    i = raw.find('<!DOCTYPE html>')
    if i < 0:
        sys.exit('ゲーム本体の開始位置が見つかりません')
    j = raw.find('</html>', i) + len('</html>')
    s = raw[i:j] + '\n'
    for old, new in EDITS:
        n = s.count(old)
        if n != 1:
            sys.exit(f'目印が {n} 個見つかりました（1個のはず）: {old[:50]}...')
        s = s.replace(old, new)
    open(out, 'w', encoding='utf-8').write(s)
    print(f'{out} を書き出しました（{len(s.encode())} bytes）')

if __name__ == '__main__':
    main()
