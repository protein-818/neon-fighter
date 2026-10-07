#!/usr/bin/env python3
"""src/ をまとめ、基準（tools/verify/baseline/）と比べる。

使い方（リポジトリのどこから実行してもよい）:
  python3 tools/verify.py             まとめる → 基準と比べる（約5分）
  python3 tools/verify.py --quick     通し試合（smoke.js、約4分）を省く（約1分半）
  python3 tools/verify.py --record    いまの src/ をまとめたものを、新しい基準として記録する

比べるもの（すべて通れば終了コード 0）:
  1. 公開用の index.html  build.py --check と同じ（src/ から作ったものが、いまの index.html と1文字も違わない）
  2. 取り決めとバイト一致  check.js（まとめたものが、基準のソースとバイト単位で同じか、も見る）
  3. 読み込みの順番        map.js（後ろで宣言される名前を読み込み時に使う所「！」が無い）
  4. 乱数を固定した総当たり seed.js（330試合を1試合ずつ）
  5. 画面                  shots.js（66枚。指紋が違う画面だけ、基準のソースから撮り直して pixcmp.js で画素を比べる）
  6. 通し試合              smoke.js（--quick で省く）

基準は「ブラウザの版」に左右される（資料_開発_02 §4）。記録したときと Chromium の版が違うときは、
記録した結果ではなく、基準のソース（baseline/source.html）をその場で動かした結果と比べる。

道具（tools/verify/*.js）が相手にするのは、公開用の変換（apply_patch.py）をかける前のもの。
途中のファイルと違いの画像は tools/verify/out/ に残る（git には入らない）。
"""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import build  # noqa: E402

V = os.path.join(HERE, 'verify')
BASE = os.path.join(V, 'baseline')
OUT = os.path.join(V, 'out')
REF = os.path.join(BASE, 'source.html')
INFO = os.path.join(BASE, 'baseline.json')
SEED = os.path.join(BASE, 'seed.txt')
SHOTS = os.path.join(BASE, 'shots.txt')


def node(tool, *args, show=True):
    """道具を1つ動かす。(終了コード, 出力) を返す。"""
    p = subprocess.run(['node', os.path.join(V, tool), *args], cwd=ROOT,
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if show:
        print(p.stdout.rstrip())
    return p.returncode, p.stdout


def sha(path):
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()


def write(path, text):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(text)


def env():
    """いまの環境（ブラウザの版など）。基準を記録したときと同じかを見るため。"""
    js = "require(process.argv[1]).launch().then(async b=>{console.log(b.version());await b.close()})"
    p = subprocess.run(['node', '-e', js, os.path.join(V, 'lib.js')], cwd=ROOT,
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if p.returncode:
        sys.exit('ブラウザを開けません:\n' + p.stdout)
    pw = subprocess.run(['node', '-e', "console.log(require('playwright/package.json').version)"],
                        cwd=V, stdout=subprocess.PIPE, text=True).stdout.strip()
    nv = subprocess.run(['node', '-v'], stdout=subprocess.PIPE, text=True).stdout.strip()
    return {'chromium': p.stdout.strip().splitlines()[-1], 'playwright': pw, 'node': nv}


def seed_lines(html, name):
    out = os.path.join(OUT, name + '.json')
    code, _ = node('seed.js', html, '--out', out)
    if code or not os.path.exists(out):
        return None
    with open(out, encoding='utf-8') as f:
        return json.load(f)


def shot_hashes(html, folder):
    shutil.rmtree(folder, ignore_errors=True)
    code, _ = node('shots.js', html, folder)
    if code:
        return None
    return {f: sha(os.path.join(folder, f)) for f in sorted(os.listdir(folder)) if f.endswith('.png')}


def read_shots():
    d = {}
    for ln in build.read(SHOTS).splitlines():
        h, f = ln.split('  ', 1)
        d[f] = h
    return d


def record():
    html = build.bundle()
    os.makedirs(BASE, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    write(REF, html)
    e = env()
    print('== 乱数を固定した総当たり')
    lines = seed_lines(REF, 'seed_record')
    print('== 画面')
    hs = shot_hashes(REF, os.path.join(OUT, 'shots_record'))
    print('== もう一度撮って、毎回同じ絵になるかを確かめる')
    hs2 = shot_hashes(REF, os.path.join(OUT, 'shots_record2'))
    if lines is None or hs is None or hs != hs2:
        sys.exit('✗ 基準を記録できませんでした（上を見てください）')
    write(SEED, '\n'.join(lines) + '\n')
    write(SHOTS, ''.join(f'{h}  {f}\n' for f, h in hs.items()))
    info = {
        'version': build.version(),
        'source_sha256': sha(REF),
        'source_bytes': os.path.getsize(REF),
        'seed_matches': len(lines),
        'seed_fingerprint': hashlib.sha256('\n'.join(lines).encode()).hexdigest()[:16],
        'shots': len(hs),
        'env': e,
        'recorded': time.strftime('%Y-%m-%d'),
    }
    write(INFO, json.dumps(info, ensure_ascii=False, indent=2) + '\n')
    print(f'✓ 基準を記録しました（Version {info["version"]}、{info["seed_matches"]}試合、'
          f'指紋 {info["seed_fingerprint"]}、画面 {info["shots"]}枚、Chromium {e["chromium"]}）→ {BASE}')


def compare(quick):
    if not os.path.exists(INFO):
        sys.exit('基準がありません。先に python3 tools/verify.py --record を実行してください')
    info = json.loads(build.read(INFO))
    shutil.rmtree(OUT, ignore_errors=True)
    os.makedirs(OUT)
    html = build.bundle()
    NEW = os.path.join(OUT, 'bundle.html')
    write(NEW, html)
    res = []

    def ok(c, title, detail=''):
        res.append((c, title, detail))
        print(('✓ ' if c else '✗ ') + title + ('  ' + detail if detail else ''))

    print(f'基準: Version {info["version"]}（{info["recorded"]} 記録、Chromium {info["env"]["chromium"]}）')
    print(f'まとめたもの: Version {build.version()}、{len(html.encode())} bytes → {NEW}')

    print('\n== 1/6 公開用の index.html')
    try:
        same = build.read(build.OUT) == build.patch(html)
        ok(same, '公開用の index.html', '' if same else 'src/ から作ったものが、いまの index.html と違う（python3 tools/build.py で作り直す）')
    except SystemExit as e:
        ok(False, '公開用の index.html', f'公開用の変換が止まった: {e}')

    print('\n== 2/6 取り決めとバイト一致（check.js）')
    code, _ = node('check.js', NEW, REF)
    ok(code == 0, '取り決めとバイト一致')

    print('\n== 3/6 読み込みの順番（map.js）')
    code, out = node('map.js', NEW, show=False)
    late = [ln.strip() for ln in out.splitlines() if '！' in ln]
    print(out.strip().splitlines()[-1] if out.strip() else '')
    ok(code == 0 and not late, '読み込みの順番', '; '.join(late[:3]))

    e = env()
    same_env = e['chromium'] == info['env']['chromium']
    if same_env:
        ref_seed = build.read(SEED).splitlines()
        ref_shots = read_shots()
    else:
        print(f'\n！ ブラウザの版が基準と違います（基準 {info["env"]["chromium"]} / いま {e["chromium"]}）。'
              '記録した結果ではなく、基準のソースをこの環境で動かした結果と比べます')
        ref_seed = seed_lines(REF, 'seed_ref')
        ref_shots = shot_hashes(REF, os.path.join(OUT, 'shots_ref'))

    print('\n== 4/6 乱数を固定した総当たり（seed.js）')
    new_seed = seed_lines(NEW, 'seed_new')
    if new_seed is None or ref_seed is None:
        ok(False, '乱数を固定した総当たり', '道具が止まった')
    else:
        diff = [(a, b) for a, b in zip(ref_seed, new_seed) if a != b]
        n = max(len(ref_seed), len(new_seed))
        nd = len(diff) + abs(len(ref_seed) - len(new_seed))
        for a, b in diff[:5]:
            print('  違い 基準', a, '\n       いま', b)
        ok(nd == 0, '乱数を固定した総当たり', f'{n} 試合すべて同じ' if nd == 0 else f'違う試合 {nd} / {n}')

    print('\n== 5/6 画面（shots.js）')
    new_shots = shot_hashes(NEW, os.path.join(OUT, 'shots_new'))
    if new_shots is None or ref_shots is None:
        ok(False, '画面', '道具が止まった')
    else:
        names = sorted(set(ref_shots) | set(new_shots))
        bad = [f for f in names if ref_shots.get(f) != new_shots.get(f)]
        if bad:
            # 違う画面だけ、基準のソースから撮り直して画素を比べる（違う所を紫で塗った画像を out/diff に出す）
            ref_dir = os.path.join(OUT, 'shots_ref')
            if same_env:
                shot_hashes(REF, ref_dir)
            node('pixcmp.js', ref_dir, os.path.join(OUT, 'shots_new'), os.path.join(OUT, 'diff'))
        ok(not bad, '画面', f'{len(names)} 枚すべて同じ' if not bad else f'違う {len(bad)} / {len(names)} 枚: {" ".join(bad[:6])}')

    if quick:
        print('\n== 6/6 通し試合（smoke.js）: --quick なので省きました')
    else:
        print('\n== 6/6 通し試合（smoke.js）')
        code, _ = node('smoke.js', NEW)
        ok(code == 0, '通し試合')

    bad = [r for r in res if not r[0]]
    print('\n' + ('✓ 全部通りました' if not bad else f'✗ 通らなかったもの {len(bad)} 件: ' + '、'.join(r[1] for r in bad)))
    return 1 if bad else 0


def main():
    args = sys.argv[1:]
    if any(a not in ('--quick', '--record') for a in args):
        sys.exit(__doc__)
    if '--record' in args:
        record()
        return
    sys.exit(compare('--quick' in args))


if __name__ == '__main__':
    main()
