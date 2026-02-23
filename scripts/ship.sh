#!/bin/bash
# Ship: commit & push
# 변경사항이 없으면 종료, 있으면 add -> commit -> push

if [ -z "$(git status --porcelain)" ]; then
    echo "변경사항이 없습니다. 종료합니다."
    exit 0
fi

timestamp=$(date +%Y%m%d-%H%M%S)
git add .
git commit -m "update $timestamp"
git push
