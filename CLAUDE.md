# NEON FIGHTER — このリポジトリで作業するときの決まり

> **下書き（引っ越しの段階1 時点。公開側が用意）。** 段階3 で開発側が、分けた後の構成と確かめ方を足して仕上げる。
> もとの決まりは Claude のプロジェクト「ゲーム開発（NF）」の指示欄と `claude/依頼_秘書_01_開発環境の引っ越し.md`。食い違うときはそちらが正しい。

## これは何か

ブラウザで動く2D格闘ゲーム。公開物は HTML 1ファイル（`index.html`）と外付け部品で、GitHub Pages が `main` ブランチの直下をそのまま公開している。**`main` に入れたものは数分で公開ページに出る。**

公開ページ: https://protein-818.github.io/neon-fighter/

## 置き場

| 場所 | 中身 | 直してよい人 |
|---|---|---|
| `src/` | ゲーム本体のソース（正本）。`src/VERSION` が版の番号 | 開発側 |
| `tools/build.py` | `src/` から `index.html` を作る | 公開側（まとめ方の部分は開発側） |
| `tools/apply_patch.py` | 公開用の変換（説明文と外付け部品の読み込みを足す） | 公開側 |
| `tools/check_site.py` | 公開前の確認（ヘッドレスブラウザ） | 公開側 |
| `docs/` | 仕様書 `01`・`02` と開発の記録（段階4 で移す） | 開発側 |
| ルート直下 | 公開物。`index.html`、`analytics.js`、`gamepad.js`、`site.js`、`privacy.html`、`og.png`、`favicon.svg` | 公開側 |

進行表（`claude/00_進行表.md`）と連絡ノート（`claude/連絡_*.md`）は Claude のプロジェクトにある。進行表を書き換えるのは秘書だけ。

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

## 作る・確かめる

```
python3 tools/build.py            # src/ → index.html
python3 tools/build.py --check    # 作り直さず、いまの index.html と同じかだけ見る
python3 tools/check_site.py       # 公開前の確認（すべて PASS で終了コード 0）
```

- 本体を変えていないのに `--check` が「違いあり」と言ったら、どこかで意図しない変更が入っている。
- `tools/apply_patch.py` は、目印の文字列（`<title>`、本体 script の先頭、ファイル末尾）が見つからないと止まる。止まったら本体側の形が変わっているので、取り決めを確かめる。

## まだ決まっていないこと（段階2・3 で開発側が足す）

- 分けた後のファイルの一覧と、つなげる順番（`src/order.txt`）、HTML の枠（`src/shell.html`）。`tools/build.py` の `bundle()` だけを差し替える。
- 総当たりと画面比較の道具、基準の置き場、1つのコマンドで回す方法。
- 版の番号の上げ方（65 から。`src/VERSION` を使うかどうかも含む）。
