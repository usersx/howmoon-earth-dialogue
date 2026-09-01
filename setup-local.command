#!/bin/zsh
set -euo pipefail

PROJECT_DIR="${0:A:h}"
BACKEND_DIR="$PROJECT_DIR/backend"

cd "$PROJECT_DIR"
python3 -m venv "$BACKEND_DIR/.venv"
"$BACKEND_DIR/.venv/bin/pip" install -r "$BACKEND_DIR/requirements-dev.txt"

if [[ ! -f "$BACKEND_DIR/.env.local" ]]; then
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env.local"
fi

echo "何月本地环境已经安装完成。"
echo "下一步请双击 start-local.command。"
