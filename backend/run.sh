#!/bin/zsh
set -euo pipefail

BACKEND_DIR="${0:A:h}"
cd "$BACKEND_DIR"

if [[ -f .env.local ]]; then
  set -a
  source .env.local
  set +a
fi

arguments=(app.main:app --host 127.0.0.1 --port "${PORT:-3000}")
if [[ "${UVICORN_RELOAD:-false}" == "true" ]]; then
  arguments+=(--reload --reload-exclude '.venv/**')
fi

exec .venv/bin/uvicorn "${arguments[@]}"
