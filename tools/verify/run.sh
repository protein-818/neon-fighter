#!/bin/sh
# 1つのコマンドで「まとめる → 基準(Version 64)と比べる」を回す。 所要 7〜8分
# 使い方（リポジトリのどこからでも）: sh tools/verify/run.sh
#   0) python tools/build.py --check（src/ から作った index.html がいまのものと同じか）
#   1) src/ を build.py の bundle() でまとめ、外付け部品を足す前の本体 1枚にする
#   2) verify.sh で、基準 base/neon-fighter.v64.html と並べて確かめる
#      （取り決めとバイト一致 / 乱数を固定した総当たり330試合 / 画面66枚の画素比較 / 通し試合）
# 指紋と画像はブラウザの版で変わるので、基準の本体と新しい本体を毎回この環境で両方動かして比べる。
D=$(cd "$(dirname "$0")" && pwd); ROOT=$(cd "$D/../.." && pwd); BASE="$D/base/neon-fighter.v64.html"
T=${TMPDIR:-/tmp}/nfrun.$$; mkdir -p "$T"
# python3 が無い（Windows の Store 案内だけの python3 を含む）ときは python を使う
PY=python3; "$PY" -c 'import sys' >/dev/null 2>&1 || PY=python
[ -d "$D/node_modules/playwright" ] || { echo "先に道具を入れてください: cd tools/verify && npm ci && npx playwright install chromium"; exit 2; }
if grep -q "$(printf '\r')" "$ROOT/src/neon-fighter.html" "$BASE" 2>/dev/null; then
  echo "✗ 改行が CRLF になっています。git config core.autocrlf false にして取り出し直してください"; exit 2; fi
echo "== 0/2 build.py --check"; "$PY" "$ROOT/tools/build.py" --check || exit 1
echo "== 1/2 まとめる（bundle）"
"$PY" - "$ROOT/tools" "$T/bundle.html" <<'EOF' || exit 1
import sys
sys.path.insert(0, sys.argv[1])
import build
with open(sys.argv[2], 'w', encoding='utf-8', newline='') as f:
    f.write(build.bundle())
print('まとめました:', sys.argv[2])
EOF
echo "== 2/2 基準（Version 64）と比べる"; sh "$D/verify.sh" "$BASE" "$T/bundle.html"
