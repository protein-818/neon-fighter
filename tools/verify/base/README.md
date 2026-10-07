# 基準（Version 64、分ける前）

引っ越しの段階2 で記録した。段階3 でファイルを分けたあと、まとめたものがこれと同じかを確かめる相手。

## 置いてあるもの

| ファイル | 中身 |
|---|---|
| `neon-fighter.v64.html` | 分ける前の本体（`src/neon-fighter.html` を commit `70492e0` の時点でそのまま写したもの）。261342 バイト、sha256 `35403b0ee373a4d9e682e9198f9d7f23a7b918a9a311e3d98bf07ce69b11f6b3` |
| `seed_v64.json` | `node seed.js <本体> --out` の結果。乱数を固定した330試合（11人の全組み合わせ110 × 難易度0・1・4）の1行ずつ |
| `png/` | `node shots.js <本体> <フォルダ>` の画面66枚（PC 45・英語 12・スマホ 9） |

## 記録したときの結果と環境

| 項目 | 結果 |
|---|---|
| `seed.js` の指紋 | `d1102e7afc8c0a95`（330試合。2回撮って同じ） |
| `shots.js` | 66枚。撮り直しと `pixcmp.js` で比べて全部同じ |
| `check.js` | すべてよし |
| `smoke.js` | 問題なし（でたらめ入力 PC・スマホ 各22試合、CPU同士110試合すべて決着、NaN 0、エラー 0） |
| `build.py --check` | 同じ（index.html 262175 バイト） |
| 環境 | Windows 11（10.0.26200）、Node.js 24.19.0、Playwright 1.63.0、Chromium 153.0.8010.12 |
| 日付 | 2026-10-07 |

**指紋と画像はブラウザの版で変わる。** ここに置いた指紋と画像は、記録した日の参考。合否は、`run.sh` が基準の本体と新しい本体を同じ環境で両方動かして並べた結果で決める（保存した画像と別の環境で撮った画像を比べない）。

## 使うコマンド

最初の1回（Node.js、Python、Git が要る。Windows では Git Bash の `sh` を使う）:

```
git config core.autocrlf false        # 改行を変えずに取り出す（clone の前に --global で決めるか、clone 後に設定して取り出し直す）
cd tools/verify && npm ci && npx playwright install chromium
```

まとめる → 基準と比べる（約7分。全部通れば終了コード 0）:

```
sh tools/verify/run.sh
```

中でやっていること: `build.py --check` → `build.py` の `bundle()` で `src/` をまとめる → `verify.sh <基準> <まとめたもの>`（取り決めとバイト一致 / 330試合 / 画面66枚 / 通し試合）。

道具を1本ずつ使うとき（`tools/verify/` で）:

```
node check.js <本体> [基準]           # 取り決めとファイルの形。2つ目を渡すとバイト一致も
node seed.js <基準> <本体>            # 330試合を1試合ずつ比べる
node shots.js <本体> <フォルダ>       # 画面66枚。node pixcmp.js <フォルダA> <フォルダB> [違いの出力先] で比べる
node smoke.js <本体>                  # 通し試合（約5分）
node map.js <本体> [--load]           # ソースの地図（分け方を考えるとき）
node rr.js <本体> [繰り返し] [並列] [難易度] [m]   # 勝率を測る総当たり（乱数は固定しない）
```
