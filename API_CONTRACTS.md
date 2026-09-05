# 前端观察到的 API 协议

以下内容来自当前部署的生产前端和真实接口验证，不包含服务端实现。

## `POST /api/dialogue`

请求为 JSON：

```json
{
  "sessionId": "uuid-or-session-id",
  "promptVersion": "3.3",
  "messages": [
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "..." }
  ]
}
```

客户端声明 `Accept: text/event-stream`。SSE 事件类型包括 `model-text`、`reset`、`final` 和错误事件。`final.response.turn.kind` 为 `question` 或 `result`。

## `POST /api/geography`

```json
{
  "turn": {},
  "scope": "city"
}
```

`scope` 可为 `city` 或 `full`。响应主要字段为 `scope` 和 `geography`；后者包含状态、提供方、地点 ID、坐标、可选边界与地标。

## `POST /api/tts`

```json
{ "text": "需要朗读的文字" }
```

当前响应为 `audio/L16`、单声道、`s16le` PCM。macOS 本地朗读为 16 kHz，千问在线朗读通常为 24 kHz；客户端接受 8–48 kHz。

## `POST /api/transcribe`

`multipart/form-data`：

- `audio`：浏览器录制的 WebM/MP4 音频。
- `localeHint`：当前固定为 `zh-CN`。

响应：

```json
{ "text": "转写结果" }
```

## `POST /api/city-visual`

```json
{ "result": {} }
```

响应字段包括 `cacheKey`、PNG Data URL、`imageVersion: "watercolour-v2"` 和生成提示摘要。图片由千问 Qwen-Image 生成，失败返回 503，不返回模板图。后端总超时 110 秒，客户端超时 125 秒。会话缓存键为 `earth-dialogue.city-visual.watercolour-v2`，点击“再画一张”会清除缓存并重新生成。sourceReference 的 about:blank 表示生成图没有外部图片引用，前端不显示搜索来源链接。
