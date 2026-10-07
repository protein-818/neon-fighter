# NEON FIGHTER — このリポジトリで作業するときの決まり

> 引っ越しの段階1 で公開側が下書きし、段階3 で開発側が仕上げた（2026-10-07）。
> もとの決まりは Claude のプロジェクト「ゲーム開発（NF）」の指示欄と `claude/依頼_秘書_01_開発環境の引っ越し.md`（写しは `docs/引っ越し/`）。食い違うときはそちらが正しい。

## これは何か

ブラウザで動く2D格闘ゲーム。公開物は HTML 1ファイル（`index.html`）と外付け部品で、GitHub Pages が `main` ブランチの直下をそのまま公開している。**`main` に入れたものは数分で公開ページに出る。**

公開ページ: https://protein-818.github.io/neon-fighter/

## 置き場

| 場所 | 中身 | 直してよい人 |
|---|---|---|
| `src/js/*.js` | ゲーム本体の script を22個に分けたもの（正本） | 開発側 |
| `src/order.txt` | `src/js/` のファイルをつなげる順番 | 開発側 |
| `src/shell.html` | HTML の枠（`<head>`、CSS、canvas、タッチ用の部品）。`/*@NF_SCRIPT@*/` の行に script が入る | 開発側 |
| `src/VERSION` | 版の番号 | 開発側 |
| `tools/build.py` | `src/` から `index.html` を作る | 公開側（まとめ方の `bundle()` は開発側） |
| `tools/apply_patch.py` | 公開用の変換（説明文と外付け部品の読み込みを足す） | 公開側 |
| `tools/check_site.py` | 公開前の確認（ヘッドレスブラウザ） | 公開側 |
| `tools/verify/` | 確かめる道具（`run.sh` ほか）と基準（`base/`） | 開発側 |
| `docs/` | 仕様書 `01`・`02` と開発の記録（段階4 で移す）、引っ越しの文書、連絡ノート（`docs/連絡/`） | 開発側 |
| ルート直下 | 公開物。`index.html`、`analytics.js`、`gamepad.js`、`site.js`、`privacy.html`、`og.png`、`favicon.svg` | 公開側 |

進行表（`claude/00_進行表.md`）は Claude のプロジェクトにある。書き換えるのは秘書だけ。Claude Code からはプロジェクトの文書を読めないので、開発側からの連絡は `docs/連絡/開発側.md` に書く（秘書が GitHub から読む）。

**引っ越しの作業をするときは、先に `docs/引っ越し/README.md` と、そこにある3つの文書（依頼書、検証の道具、引き継ぎ）を読む。**

## 必ず守ること

1. **`index.html` を直接編集しない。** `src/` を直して `python3 tools/build.py` で作り直す。
2. **公開側との取り決め**（外付け部品が本体のこれらを読んでいる）
   - 名前を変えない: `mode` `paused` `tut` `SPECT` `A` `B` `win` `lv` `LV` `CH` `ch` `cv` `VS2` `LANG` `TR` `NF_INPUT`（`set(p,dir)`・`act(p,k)`、`set` の `l r u d g hx ha`）
   - キー入力は `window` の `keydown`／`keyup` で受け、割り当てを変えない
   - script は1つにまとめ、ファイル末尾の形（`</script>` → `</body></html>`）を変えない。ES モジュールやバンドラーは使わない（名前が閉じ込められて外付け部品から読めなくなる）
   - 計測の呼び出し `NFA.matchStart`／`NFA.matchEnd`／`NFA.trainingStart` を消さず、1回ずつにする
3. **保存データ**（`nf2_*`、`nf_aud2`）の名前と形を変えない。
4. 作業は `main` とは別のブランチで行い、確かめが通ってから `main` に入れる。
5. **引っ越しの間（段階4 が終わるまで）は、機能の追加と数値の調整をしない。**
6. 大きな改修は1つずつ別々の更新で出す。数値を触ったら CPU 同士の総当たりで測り直す。進行表の「凍結」の項目は触らない。
7. 自分の役割の外の作業は、勝手に行わず依頼書にする。文書は平易な日本語で書く。

## 分けた後のソース

`src/js/` の22個は、Version 64 の1ファイルを**行の切れ目で、もとの順のまま**切っただけのもの。つなげると分ける前と1バイトも違わない。各ファイルの中身と、もとの行番号は `src/order.txt` のコメントにある。

| ファイル | 中身 |
|---|---|
| `screen.js` | 画面の基本（`cv g W GY touch H`） |
| `data-chars.js` | キャラのデータ11人と技の種類の表（`CH`、`CN SP LEG`） |
| `tune-moves.js` | 読み込み時の数値の書き換え（全技 ×1.15、リーチ +10、`cut`、`blunt`） |
| `lang.js` | 英語対応（`LANG EN TR applyLang setLang`） |
| `consts.js` | 共通の定数とキャラ固有の仕組み（溜め、ギア、ヒート、空中ダッシュ、凍え、`EV`、`LV`） |
| `state.js` | 状態の変数と、保存データの読み込み |
| `sound.js` | 音（効果音、BGM、音の設定） |
| `flow.js` | 試合の土台（`mk start resetRound ko hitRes atk`、投げ） |
| `wounds.js` | 部位の負傷 |
| `rival.js` | 因縁（相手ごとの戦績、入場の台詞） |
| `limbs.js` | ダッシュ、部位破壊、つかみ |
| `ai-style.js` | CPU の戦い方の型（`PD PERS styleAI`） |
| `ring.js` | 場外、時間切れ、ポーズ |
| `training.js` | トレーニングと操作ガイド |
| `step.js` | 飛び道具、CPU、1フレームの進行（`spawn ai step update`） |
| `draw-fx.js` | ステージの背景、飛び道具と演出の描画 |
| `pose.js` | 姿勢（`STN pose`） |
| `draw-figure.js` | 見た目と体の描画（`LOOK figure`）。途中にキャラ別の CPU（`eveAI` など）がある |
| `screens.js` | 画面の部品、HUD、メニュー、結果、タイトル |
| `draw.js` | 全体の描画と入力の入口（`draw act NF_INPUT`）、2人対戦のキー |
| `listeners.js` | 入力の受け口（`window` の `keydown`／`keyup` など）とタッチ用の部品 |
| `boot.js` | ループと起動。**必ず最後** |

気をつけること（くわしくは `docs/引っ越し/資料_開発_03_引き継ぎ.md` の §3・§4。行番号はそこから1を引くと分ける前の行、`order.txt` のコメントで今のファイルが分かる）:

- 全部が1つの script の最上位にある。ファイルを関数や `{ }` で包まない。`'use strict'` を足さない。
- `function` は順番を入れ替えてもよいが、読み込み時に走る文と `const`／`let` の順番は変えない（例: `tune-moves.js` は `data-chars.js` のあと、`boot.js` は最後）。
- 整形の道具（Prettier など）をかけない。並べ替えや整形をするなら、引っ越しのあとに別の更新で行い、`run.sh` の2と3（総当たりと画面）で確かめる。
- ファイルを足すときは `src/js/` に置き、`order.txt` に書く。書き忘れると `build.py` が止まる。

## まとめ方

`tools/build.py` の `bundle()` が、`src/order.txt` の順に `src/js/` のファイルをそのままつなげ、`src/shell.html` の `/*@NF_SCRIPT@*/` の行と置き換える。何も足さず、整えない。そのあと公開用の変換（`apply_patch.py`）をかけて `index.html` にする。

流れ: `src/js/*.js`（`order.txt` の順）→ `shell.html` にはめる（`bundle()`）→ 公開用の変換（`apply_patch.patch`）→ `index.html`

## 作る・確かめる

```
python3 tools/build.py            # src/ → index.html
python3 tools/build.py --check    # 作り直さず、いまの index.html と同じかだけ見る
sh tools/verify/run.sh            # まとめる → 基準（Version 64）と比べる。約8分、全部通れば終了コード 0
python3 tools/check_site.py       # 公開前の確認（公開側。すべて PASS で終了コード 0）
```

`run.sh` がやること（道具の使い方は `tools/verify/base/README.md` と `docs/引っ越し/資料_開発_02_検証の道具.md`）:

1. `build.py --check`（`apply_patch.py` の確かめもここで通る）
2. `src/` をまとめ、外付け部品を足す前の本体1枚にする
3. 基準 `tools/verify/base/neon-fighter.v64.html` と並べて `verify.sh`: 取り決めとバイト一致（`check.js`）、乱数を固定した総当たり330試合（`seed.js`）、画面66枚の画素比較（`shots.js`・`pixcmp.js`）、通し試合（`smoke.js`）
4. 保存データの引き継ぎ（`save.js`）と、読み込み時の順番（`map.js` で「！」が出ないこと）

- 本体を変えていないのに `--check` が「違いあり」と言ったら、どこかで意図しない変更が入っている。
- `tools/apply_patch.py` は、目印の文字列（`<title>`、本体 script の先頭、ファイル末尾）が見つからないと止まる。止まったら本体側の形が変わっているので、取り決めを確かめる。
- 道具は公開用の変換をかける**前**のものを相手にする（公開用の `index.html` に `check.js` をかけると「script は1つ」で落ちる）。
- 指紋と画像はブラウザの版で変わる。基準と新しいものは、必ず同じ環境で両方動かして比べる（`run.sh` はそうしている）。保存した画像や指紋を別の環境と見比べない。
- 遊びの中身を変えたときは、`seed.js` と `shots.js` の違いは出て当たり前。違いが触ったところだけに出ているかを見る（資料_開発_03 §5-3）。そのあと基準を記録し直すかどうかは、版を上げるときに決める。
- 最初の1回は `cd tools/verify && npm ci && npx playwright install chromium`（Node.js が要る）。

### python と python3

- 文書のコマンドは `python3` で書いている。Windows では `python3` が Microsoft Store の案内だけのダミーで動かないことがある。そのときは `python` に読み替える（`python tools/build.py --check`）。
- `run.sh` は `python3` が動かなければ自動で `python` を使う。
- Windows では `sh` を Git Bash のもの（`C:\Program Files\Git\bin\sh.exe`）で動かす。

### 改行

- **改行はすべて LF。** ルートの `.gitattributes`（`* -text`）で、git が改行を変えずに取り出し、変えずに入れる。Windows で `core.autocrlf=true` でも LF のまま取り出される。
- そのかわり、エディタが CRLF で保存すると、そのまま入ってしまう。エディタの改行を LF にしておく。
- `build.py` は `src/js/` に CRLF があると止まる。`run.sh` は `src/` に CRLF があると止まる。
- `.gitattributes` を入れる前に Windows で取り出したものは CRLF になっていることがある。そのときは、手元の変更をすべて commit してから `git rm -r --cached -q .` と `git reset -q --hard` を順に実行して取り出し直す（commit していない変更は消える）。

## まだ決まっていないこと

- 版の番号の上げ方（65 から。`src/VERSION` を使うかどうかも含む）。段階4 で決める。
- 基準（`tools/verify/base/`）を版ごとに記録し直すかどうか。
