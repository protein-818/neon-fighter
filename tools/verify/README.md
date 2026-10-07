# tools/verify — 確かめる道具

分ける前と後、直す前と後で「同じゲームのままか」を確かめる道具。使い方の詳しい説明は `docs/引っ越し/資料_開発_02_検証の道具.md`。

ふだんは1つのコマンドで回す。

```
python3 tools/verify.py            # src/ をまとめる → 基準と比べる（約5分）
python3 tools/verify.py --quick    # 通し試合を省く（約1分半）
```

## 中身

| ファイル | 中身 |
|---|---|
| `lib.js` `check.js` `seed.js` `shots.js` `pixcmp.js` `smoke.js` `rr.js` `map.js` `verify.sh` | 道具9本。資料_開発_02 §7（＝ `nf-verify-tools.zip`）と1文字も違わない |
| `package.json` | 道具が使う `playwright`（1.56.1）と `acorn`。`npm install` で入る |
| `baseline/` | 基準（下） |
| `out/` | `verify.py` の途中のファイルと、違いの画像。git には入らない |

`tools/verify.py` は、`tools/build.py` の `bundle()` でまとめたもの（公開用の変換をかける前）を相手に道具を動かす。公開用の `index.html` には `check.js` は使えない（外付け部品の読み込みが足されているため）。

## 基準（`baseline/`）

| ファイル | 中身 |
|---|---|
| `source.html` | 基準にしたソース。Version 64 の `src/neon-fighter.html` と同じもの（sha256 `35403b0e…`） |
| `seed.txt` | 乱数を固定した総当たり 330試合の結果（1行1試合） |
| `shots.txt` | 決まった画面 66枚の指紋（sha256）。画像そのものは入れていない（約7MB になるため）。違いが出たときは `source.html` から撮り直して画素を比べる |
| `baseline.json` | 版、指紋、記録したときの環境（Chromium の版など） |

- 結果はブラウザの版で変わることがある。記録したときと Chromium の版が違う環境では、`verify.py` は記録した結果を使わず、`source.html` をその場で動かして比べる（そのぶん1分ほど長くなる）。
- 基準を記録し直すのは `python3 tools/verify.py --record`。**引っ越しの間は記録し直さない**（Version 64 のまま比べる）。

## 道具の準備

Node.js（v22 で確認）と Chromium が要る。

```
cd tools/verify && npm install
```

Chromium は `/opt/pw-browsers/chromium` があればそれを使う。別の場所なら環境変数 `NF_CHROMIUM` に入れる。無ければ `npx playwright install chromium`。
