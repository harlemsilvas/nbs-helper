#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
PROJECT_FILE="$SCRIPT_DIR/.vercel/project.json"

if [[ ! -f "$PROJECT_FILE" ]]; then
  echo "Missing $PROJECT_FILE. Run 'vercel link' inside apps/web first." >&2
  exit 1
fi

PROJECT_ID="$(sed -n 's/.*"projectId":"\([^"]*\)".*/\1/p' "$PROJECT_FILE")"
ORG_ID="$(sed -n 's/.*"orgId":"\([^"]*\)".*/\1/p' "$PROJECT_FILE")"

if [[ -z "$PROJECT_ID" || -z "$ORG_ID" ]]; then
  echo "Could not parse project/org IDs from $PROJECT_FILE." >&2
  exit 1
fi

export VERCEL_PROJECT_ID="$PROJECT_ID"
export VERCEL_ORG_ID="$ORG_ID"

echo "Deploying nbs-helper-web from repo root: $REPO_ROOT"
vercel --prod --yes --cwd "$REPO_ROOT"
