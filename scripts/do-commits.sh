#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

git update-ref -d HEAD 2>/dev/null || true
git reset
git add -A
git reset HEAD -- src/components/CartaoPresenca/index.tsx src/components/CartaoEntrega/index.tsx

t1=$(git write-tree)
c1=$(git commit-tree "$t1" -F .git/COMMIT_MSG_1.txt)

git add src/components/CartaoPresenca/index.tsx src/components/CartaoEntrega/index.tsx
t2=$(git write-tree)
c2=$(git commit-tree "$t2" -p "$c1" -F .git/COMMIT_MSG_2.txt)

git update-ref refs/heads/master "$c2"
git reset --hard "$c2"
git log -2 --format=full
