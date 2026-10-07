# NEON FIGHTER

ブラウザで動く格闘ゲーム。インストール不要で、PC（キーボード・コントローラー）とスマホ（タッチ）で遊べます。日本語と英語に対応。

公開ページ: https://protein-818.github.io/neon-fighter/

## ファイル構成

| 場所 | 役割 |
|---|---|
| `src/` | ゲーム本体のソース（正本）。いまは `src/neon-fighter.html` の1ファイル。`src/VERSION` が版の番号 |
| `tools/build.py` | `src/` のソースから公開用の `index.html` を作る |
| `tools/apply_patch.py` | 公開用の変換（`build.py` から呼ばれる） |
| `tools/check_site.py` | 公開前の確認（ヘッドレスブラウザ） |
| `tools/verify.py`、`tools/verify/` | 確かめる道具（開発側）。`src/` をまとめたものを基準（Version 64）と比べる |
| `docs/` | 仕様書と開発の記録（引っ越しの段階4 で移す） |
| `CLAUDE.md` | Claude Code が毎回読む決まり |
| `index.html` | 公開されるゲーム本体。**`src/` から作る。直接編集しない** |
| `analytics.js` | 計測（プレイ人数・プレイ時間・再訪・キャラ使用率） |
| `privacy.html` | 利用データの取り扱いの説明ページ |
| `site.js` | タイトル画面のリンク（利用データの説明、感想フォーム）と、決着画面の「結果を X でシェア」 |
| `gamepad.js` | コントローラー対応。対戦中の入力は本体の `window.NF_INPUT` に渡す。2人対戦では1台目が1P、2台目が2P |
| `og.png` / `favicon.svg` | SNS共有時の画像とアイコン |

## 手元で動かす

`index.html` をブラウザで開くだけで動きます。`src/neon-fighter.html` も単体で開けます（外付け部品なしの素の本体）。

## 公開

GitHub Pages で `main` ブランチの直下をそのまま公開します。`main` に反映すると数分で公開ページも更新されます。

## 計測

`analytics.js` の `GA_ID` に Google アナリティクス（GA4）の測定IDを設定済みです（`G-5TL4CWMFT1`）。空にすると外部への送信が止まります。

送っているイベント:

| イベント | 送る内容 |
|---|---|
| `match_start` | 使用キャラ、相手、難易度、観戦かどうか、再戦かどうか、表示言語（`lang`）、CPU戦か2人対戦か（`mode`） |
| `match_end` | 上記に加えて勝敗、ラウンド数、対戦時間（秒） |
| `training_start` | 使用キャラ、表示言語 |
| `gamepad_connected` | コントローラーが接続された |
| `share_click` | 「結果を X でシェア」が押された（勝敗） |

URLの末尾に `?nfa_debug=1` を付けると、送信内容がブラウザのコンソールに表示されます。

## ゲームを更新する

> 下書き（引っ越しの段階1 時点）。段階3 で本体を複数のファイルに分けたら、ソースの場所の説明を直す。

ゲーム本体の正本は `src/` にあります。Claude のアーティファクトからの取り出しは行いません。

1. `main` とは別のブランチで `src/` を直す（開発側）。版を上げるときは `src/VERSION` も直す。
2. 公開物を作る。

   ```
   python3 tools/build.py
   ```

3. 公開前の確認を通す。

   ```
   python3 tools/check_site.py
   ```

4. 確認が通ったら `main` に入れる。数分で公開ページに出る。

流れは「`src/` → まとめる → 公開用の変換（`apply_patch.py`）→ `index.html`」です。`index.html` は直接編集しません（次に作り直すと上書きされるため）。

`python3 tools/build.py --check` は、作り直さずに「`src/` から作ったものが、いまの `index.html` と1文字も違わないか」だけを確かめます。ソースを分ける作業のように、結果が変わらないはずの変更の確認に使います。

公開用の変換が行うのは次の3つだけで、遊びの挙動は変えません。

1. `<head>` に説明文・共有用メタ情報・アイコンを足す
2. `analytics.js` を本体スクリプトの前に読み込む
3. `site.js` と `gamepad.js` を末尾で読み込む

計測の呼び出し（`NFA.matchStart` / `matchEnd` / `trainingStart`）は本体に入っています。変換では差し込まず、1回ずつ入っていることだけを確かめます。

急ぎでアーティファクト側を直した場合（引っ越しが終わるまでの逃げ道）は、取り出した HTML を `python3 tools/apply_patch.py <取り出したHTML>` に渡せば今までどおり `index.html` を作れます。その直しは `src/` にも入れてください。

### 外付け部品が本体から読んでいる名前

`mode` `paused` `tut` `SPECT` `VS2` `LANG` `A` `B` `win` `lv` `LV` `CH` `ch` `cv` `TR()` `NF_INPUT`

### 公開前の確認

`python3 tools/check_site.py` が、ヘッドレスブラウザで、キーボードのみ・コントローラー1台（溜めを含む）・コントローラー2台（2人対戦）・英語表示・スマホ表示を通し、計測が1回ずつ出ることとエラーが無いことを確かめます。すべて PASS になってから `main` に入れます。

Python の `playwright` と Chromium が要ります（`pip install playwright` のあと `playwright install chromium`）。

## 感想フォームを付ける

`site.js` の `FEEDBACK_URL` にフォームのURLを入れると、タイトル画面に「感想を送る」が表示されます。

## コントローラーの配置

VS CPU とトレーニングでは、つないだコントローラーはすべて 1P を操作します。2人対戦では1台目が 1P、2台目が 2P です（1台だけなら 2P はキーボード）。タイトル画面では A=対戦、Y=トレーニング、X=2人対戦。

| 入力 | 動作 |
|---|---|
| 十字キー / 左スティック | 移動・ジャンプ・しゃがみ |
| 左のボタン（Xbox: X） | 弱攻撃 |
| 上のボタン（Xbox: Y） | 強攻撃 |
| 下のボタン（Xbox: A） | 投げ / メニューの決定 |
| 右のボタン（Xbox: B） | ガード / メニューの戻る |
| LB・RB・LT・RT | 必殺技 1〜4 |
| 強・必殺技1 を押し続ける | 溜められる技は溜まり、離すと出る |
| START | ポーズ |
| BACK | トレーニングで中央に戻す |
