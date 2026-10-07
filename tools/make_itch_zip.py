#!/usr/bin/env python3
"""itch.io に上げる zip を作る（公開物のうち、ゲームを動かすのに要るものだけ）。

使い方: python3 tools/make_itch_zip.py [出力先=neon-fighter-itch.zip]

先に python3 tools/build.py で index.html を作り、python3 tools/check_site.py を通しておく。
src/ から作ったものと index.html が違うときは止まる（古い index.html を上げないため）。
"""
import os
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import build  # noqa: E402

FILES = ['index.html', 'analytics.js', 'site.js', 'gamepad.js', 'privacy.html', 'favicon.svg']


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'neon-fighter-itch.zip')
    if build.read(build.OUT) != build.patch(build.bundle()):
        sys.exit('index.html が src/ から作ったものと違います。先に python3 tools/build.py を実行してください')
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in FILES:
            z.write(os.path.join(ROOT, f), f)
    print(f'{out} を作りました（Version {build.version()}、{len(FILES)} ファイル、{os.path.getsize(out)} bytes）')


if __name__ == '__main__':
    main()
