#!/bin/zsh
set -euo pipefail

PROJECT_DIR="${0:A:h}"
BACKEND_DIR="$PROJECT_DIR/backend"

if [[ ! -x "$BACKEND_DIR/.venv/bin/uvicorn" ]]; then
  echo "尚未安装本地依赖，请先双击 setup-local.command。"
  exit 1
fi

echo "何月 · Howmoon · Earth Dialogue"
echo "本地地址： http://localhost:3000"
echo "按 Control+C 可以停止。"
cd "$BACKEND_DIR"
exec ./run.sh
