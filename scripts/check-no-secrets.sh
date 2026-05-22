#!/usr/bin/env bash
# Run before git push: fails if staged files look like they contain real API keys.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STAGED="$(git diff --cached --name-only 2>/dev/null || true)"
if [ -z "$STAGED" ]; then
  echo "No staged files — nothing to scan."
  exit 0
fi

FAIL=0

for f in $STAGED; do
  case "$f" in
    .env.example|.env.sample|scripts/check-no-secrets.sh|SECURITY.md) continue ;;
    .env|.env.*|.env*.local|*.pem|*.key) echo "BLOCKED: attempt to commit env/secret file: $f"; FAIL=1 ;;
  esac
done

# Common secret patterns in staged diffs only
if git diff --cached | grep -qE 'AIza[0-9A-Za-z_-]{20,}|sk-[a-zA-Z0-9]{20,}|re_[a-zA-Z0-9]{20,}'; then
  echo "BLOCKED: staged diff may contain an API key pattern. Unstage and use .env.local instead."
  FAIL=1
fi

if [ "$FAIL" -ne 0 ]; then
  exit 1
fi

echo "OK: no obvious secrets in staged files."
