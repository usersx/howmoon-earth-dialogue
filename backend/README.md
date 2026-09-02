# 何月 FastAPI 兼容后端

这个后端保持线上前端已经使用的接口协议不变，并同时提供 `../site/` 中的静态部署镜像。

## 能力状态

- 对话：优先使用 `DASHSCOPE_API_KEY` 调用千问；也支持 DeepSeek；未配置时使用确定性的本地兼容模式。
- 地理：读取推荐结果中的坐标并返回诚实的 `estimated` 状态；目前不伪装成权威地理核验。
- 城市视觉：使用本地 SVG 生成，无需额外 Key。
- TTS：macOS 优先使用系统 `say`；Windows、Linux 与 Vercel 使用千问 `qwen3-tts-flash`，统一输出前端可播放的单声道 PCM。
- 语音转写：配置千问 Key 后使用 `qwen3-asr-flash`；同一个 Key 即可，无需额外供应商。

## 启动

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
cp .env.example .env.local
# 把轮换后的千问 Key 写入 .env.local 的 DASHSCOPE_API_KEY
chmod +x run.sh
./run.sh
```

访问：`http://127.0.0.1:3000/`

健康检查：`http://127.0.0.1:8000/api/health`

## 测试

```bash
.venv/bin/pytest -q
```

## 部署提示

需要强制使用真实模型时关闭本地兼容模式：

```text
ALLOW_MOCK_DIALOGUE=false
```

同时请在反向代理层配置 TLS、请求体上限、模型调用配额与每用户限流。不要把任何 API Key 写入前端环境变量或提交到仓库。
