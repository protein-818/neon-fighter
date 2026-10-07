#!/bin/sh
# 分割の前後をまとめて確かめる。 使い方: sh verify.sh <もとの index.html> <新しい index.html>     所要 5〜6分
D=$(dirname "$0"); A=$1; B=$2; T=${TMPDIR:-/tmp}/nfverify.$$; r=0
[ -f "$A" ] && [ -f "$B" ] || { echo "使い方: sh verify.sh <もとの index.html> <新しい index.html>"; exit 2; }
echo "== 1/4 取り決めとバイト一致"; node "$D/check.js" "$B" "$A" || r=1
echo "== 2/4 乱数を固定した総当たり(330試合)"; node "$D/seed.js" "$A" "$B" || r=1
echo "== 3/4 画面の画素比較(66枚)"; node "$D/shots.js" "$A" "$T/a" || r=1; node "$D/shots.js" "$B" "$T/b" || r=1; node "$D/pixcmp.js" "$T/a" "$T/b" "$T/diff" || r=1
echo "== 4/4 通し試合"; node "$D/smoke.js" "$B" || r=1
if [ $r = 0 ]; then echo "✓ 全部通りました"; else echo "✗ どこかで違いがあります(上を見てください。画像は $T )"; fi; exit $r
