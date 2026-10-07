#!/usr/bin/env python3
"""src/ のソースから、公開用の index.html を作る。

使い方（リポジトリのどこから実行してもよい）:
  python3 tools/build.py           index.html を作り直す
  python3 tools/build.py --check   作り直さず、いまの index.html と同じになるかだけ確かめる

流れ:  src/ のソース → まとめる（bundle） → 公開用の変換（apply_patch.patch） → index.html

index.html は直接編集しない。直すのは src/ の中だけ。
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from apply_patch import patch  # noqa: E402

SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, 'index.html')


def read(path):
    # 改行を勝手に変えない（1文字も違わないことを確かめるため）
    with open(path, encoding='utf-8', newline='') as f:
        return f.read()


MARK = '/*@NF_SCRIPT@*/\n'


def bundle():
    """src/ のソースを、ゲーム本体の HTML 1枚（文字列）にまとめる。

    src/order.txt に書いた順に src/js/ のファイルをそのままつなげて1つの script にし、
    src/shell.html の目印の行（MARK）と置き換える。足したり整えたりはしない。
    script は1つ、ファイル末尾の形は変えない（公開側との取り決め）。
    ES モジュールやバンドラーは使わない（名前が閉じ込められて外付け部品から読めなくなる）。
    """
    names = []
    for line in read(os.path.join(SRC, 'order.txt')).split('\n'):
        line = line.strip()
        if line and not line.startswith('#'):
            names.append(line)
    if len(set(names)) != len(names):
        sys.exit('order.txt に同じファイルが2回あります')
    js_dir = os.path.join(SRC, 'js')
    left = sorted(set('js/' + n for n in os.listdir(js_dir) if n.endswith('.js')) - set(names))
    if left:
        sys.exit('order.txt に書かれていないファイルがあります: ' + ', '.join(left))
    parts = []
    for n in names:
        path = os.path.join(SRC, n)
        if not os.path.exists(path):
            sys.exit('order.txt のファイルがありません: ' + n)
        s = read(path)
        if not s.endswith('\n') or '\r' in s:
            sys.exit(n + ': 改行は LF にし、最後の行も改行で終える')
        parts.append(s)
    shell = read(os.path.join(SRC, 'shell.html'))
    if shell.count(MARK) != 1:
        sys.exit('shell.html に目印 ' + MARK.strip() + ' の行がちょうど1つ必要です')
    return shell.replace(MARK, ''.join(parts))


def version():
    return read(os.path.join(SRC, 'VERSION')).strip()


def main():
    args = sys.argv[1:]
    if any(a not in ('--check',) for a in args):
        sys.exit(__doc__)
    html = patch(bundle())
    size = len(html.encode())
    if '--check' in args:
        if not os.path.exists(OUT):
            sys.exit('index.html がありません')
        if read(OUT) != html:
            sys.exit('違いあり: src/ から作ったものと、いまの index.html が一致しません')
        print(f'同じ: src/（Version {version()}）から作ったものは、いまの index.html と1文字も違いません（{size} bytes）')
        return
    with open(OUT, 'w', encoding='utf-8', newline='') as f:
        f.write(html)
    print(f'index.html を書き出しました（Version {version()}、{size} bytes）')


if __name__ == '__main__':
    main()
