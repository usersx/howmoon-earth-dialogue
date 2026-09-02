# 何月 · Howmoon · Earth Dialogue

<p align="center">
  和地球聊聊，找到此刻真正想去的地方。
</p>

<p align="center">
  <a href="https://howmoon-earth-dialogue.vercel.app">在线体验</a>
</p>

![何月首页与互动地球](docs/screenshots/01-home.png)

何月从一个很轻的问题开始。你可以打字，也可以直接开口，说出一段一直记得的旅途、最近的精神状态，或者此刻最想逃离什么。地球会沿着这些回答继续追问，慢慢把一个模糊的念头变成一座可以进入的城市。

目的地亮起以后，地图不会停在一个地名上。北京与罗马各有一张可以左右探索的建筑长卷，二十处代表性地点可以继续进入。屋顶、台基、穹顶、回廊和城市天际线都被拆成可以阅读、可以停留的视觉切片。

## 一次完整的旅行对话

### 先选择你习惯的交流方式

蓝色首页保留了完整的素描线稿地球。国家边界、经纬网、城市点与旅行航线会随地球缓慢自转，也支持鼠标拖拽和滚轮缩放。

### 让问题慢一点

文字模式使用暖白纸张质感。每次回答后会出现明确的思考等待，接入千问或 DeepSeek 后由真实模型继续对话；没有配置 Key 时也能用本地模式体验完整流程。

| 文字深谈 | AI 继续追问 |
| --- | --- |
| ![暖白文字对话页](docs/screenshots/02-text-dialogue.png) | ![AI 根据旅行记忆继续追问](docs/screenshots/03-ai-dialogue.png) |

### 看着目的地在地球上亮起

当信息足够时，推荐城市会落到地球的真实坐标附近。持续呼吸的光点把对话结果和下一段视觉体验连在一起。

![北京在互动地球上被点亮](docs/screenshots/04-city-selected.png)

### 从城市天际线走进建筑长卷

北京从皇城屋脊延伸到现代天际线，罗马沿石路进入两千年的城市层次。两个城市都可以从全屏入口继续进入横向建筑长卷。

| 北京 | 罗马 |
| --- | --- |
| ![北京城市体验入口](docs/screenshots/05-beijing-gateway.png) | ![罗马城市体验入口](docs/screenshots/07-rome-gateway.png) |

![北京十处建筑组成的横向探索长卷](docs/screenshots/06-beijing-atlas.png)

### 把一座建筑读得更近

二十个沉浸式地点页面提供局部放大与呼吸光点讲解。下面是故宫太和殿页面，光点分别对应屋顶、开间、台基、彩画与典礼空间。

![故宫太和殿沉浸式建筑细节页](docs/screenshots/08-forbidden-city-detail.png)

## 现在可以体验的内容

| 能力 | 具体表现 |
| --- | --- |
| 地球交互 | 慢速自转、鼠标拖拽、滚轮缩放、国家边界、经纬网、城市点与航线 |
| 深度对话 | 文字输入、语音录制、连续追问、对话恢复、重新开始与结果缓存 |
| AI 接入 | 千问与 DeepSeek 二选一，SSE 流式协议，保留可感知的思考时间 |
| 语音能力 | macOS 本地朗读、Windows/Linux/Vercel 千问在线朗读、千问 `qwen3-asr-flash` 语音转写 |
| 目的地呈现 | 城市坐标定位、地球光点锁定、个性化城市插画与标准 PNG 下载 |
| 城市体验 | 北京与罗马双城入口、两张建筑长卷、二十处沉浸式地点页面 |
| 本地运行 | 一个 FastAPI 进程同时提供网页和接口，双击脚本即可启动 |

## 快速开始

第一次使用时双击

```text
setup-local.command
```

安装完成后双击

```text
start-local.command
```

浏览器访问

```text
http://localhost:3000
```

命令行方式也很简单

```bash
python3 -m venv backend/.venv
backend/.venv/bin/pip install -r backend/requirements-dev.txt
cp backend/.env.example backend/.env.local
./start-local.command
```

## 接入真实 AI

编辑 `backend/.env.local`，填入千问或 DeepSeek 的 Key。Key 只保存在这个本地文件里，`.gitignore` 会阻止它进入提交记录。

千问同时承担对话与中文语音转写，只需要一个 Key。

```text
DASHSCOPE_API_KEY=
QWEN_MODEL=qwen3.7-plus
QWEN_ASR_MODEL=qwen3-asr-flash
QWEN_TTS_MODEL=qwen3-tts-flash
QWEN_TTS_VOICE=Cherry
```

使用 DeepSeek 对话时填写

```text
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-flash
```

没有配置 Key 时，项目会进入本地确定性对话模式，并保留约 2.6 秒的思考状态。若希望启动时强制检查真实模型配置，可以设置

```text
ALLOW_MOCK_DIALOGUE=false
```

## 接口与运行方式

前端使用五组接口完成对话、定位、语音与图片生成。

| 接口 | 用途 |
| --- | --- |
| `POST /api/dialogue` | 多轮旅行对话与最终目的地结果 |
| `POST /api/geography` | 城市坐标与地点信息 |
| `POST /api/tts` | 16 或 24 kHz 单声道语音输出 |
| `POST /api/transcribe` | 浏览器录音转写 |
| `POST /api/city-visual` | 生成可下载的 1024 × 1024 PNG 城市插画 |

更完整的请求与响应字段见 [API_CONTRACTS.md](API_CONTRACTS.md)。

## 项目结构

```text
.
├── site/                  浏览器直接运行的完整前端与视觉资源
├── backend/               FastAPI 服务、AI 接入与图片生成
├── backend/tests/         接口与回归测试
├── docs/screenshots/      README 使用的真实运行截图
├── scripts/               资源维护脚本
├── setup-local.command    首次安装入口
└── start-local.command    日常启动入口
```

## 验证

```bash
cd backend
.venv/bin/pytest -q
```

当前测试结果为 `12 passed`，覆盖健康检查、对话 SSE、地理信息、TTS、转写、城市插画和静态路由。仓库内共有 27 个可访问页面，其中 20 个是北京与罗马的沉浸式地点页面。

## 名字

何月读起来像一个人的名字，也像一句关于时间的提问。Howmoon 把月亮放进英文名里。它适合这段体验，因为旅行往往从一个很小的念头开始，然后才在地球上有了坐标。
