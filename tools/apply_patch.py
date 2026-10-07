#!/usr/bin/env python3
"""ゲーム本体（HTML 1ファイル）を公開用 index.html に変換する。

ふだんは tools/build.py から呼ばれる（src/ のソース → まとめる → この変換 → index.html）。
単体でも使える: python3 tools/apply_patch.py <ゲーム本体のHTML> [出力先=index.html]
（Claude のアーティファクトから取り出した HTML をそのまま渡してもよい。外側の枠は自動で外す）

ゲームの挙動は変えず、公開に必要な差分だけを入れる:
  1. <head> に説明文・共有用メタ情報・アイコン
  2. analytics.js / site.js / gamepad.js の読み込み
計測の呼び出し（NFA.matchStart / matchEnd / trainingStart）は、ゲーム本体に
最初から入っている（プロジェクト文書 23）。ここでは差し込まず、1回ずつ入っている
ことだけを確かめる。二重に入ると計測が2回飛ぶため。
目印の文字列が見つからない（ゲーム側が変わった）場合はエラーで止まる。
"""
import re
import sys

SITE = 'https://protein-818.github.io/neon-fighter/'
DESC = 'インストール不要。ブラウザで今すぐ遊べる2D格闘ゲーム。部位破壊・2人対戦・11人のキャラクター。'
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
]

def patch(raw):
    """ゲーム本体の HTML（文字列）を受け取り、公開用の HTML（文字列）を返す。"""
    # Claudeの公開ページは外側にもう1枚HTMLの枠が付くので、内側のゲーム本体だけ取り出す
    i = raw.find('<!DOCTYPE html>')
    if i < 0:
        sys.exit('ゲーム本体の開始位置が見つかりません')
    j = raw.find('</html>', i) + len('</html>')
    s = raw[i:j] + '\n'
    for call in ('NFA.matchStart(', 'NFA.matchEnd(', 'NFA.trainingStart('):
        n = s.count(call)
        if n != 1:
            sys.exit(f'計測の呼び出し {call} が {n} 個あります（本体に1個だけ入っているはず）')
    for old, new in EDITS:
        n = s.count(old)
        if n != 1:
            sys.exit(f'目印が {n} 個見つかりました（1個のはず）: {old[:50]}...')
        s = s.replace(old, new)
    # 外付け部品の読み込みを、末尾の </body> の直前に足す（</script> と </body> の間の改行の有無は問わない）
    m = re.search(r'</script>\s*</body>\s*</html>\s*$', s)
    if not m or s.count('</body>') != 1:
        sys.exit('ファイル末尾が </script></body></html> の形になっていません')
    return s[:m.start()] + '</script>\n<script src="site.js"></script>\n<script src="gamepad.js"></script></body></html>\n'

def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else 'index.html'
    s = patch(open(src, encoding='utf-8', newline='').read())
    open(out, 'w', encoding='utf-8', newline='').write(s)
    print(f'{out} を書き出しました（{len(s.encode())} bytes）')

if __name__ == '__main__':
    main()
