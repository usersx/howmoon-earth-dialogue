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

当前响应为 `audio/L16`、16 kHz、单声道、`s16le` PCM。客户端只接受 8–48 kHz、单声道、`s16le`。

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

响应字段包括 `cacheKey`、内联 Data URL 图片、`imageVersion: "dynamic-v1"`、生成提示摘要和搜索来源引用。客户端超时为 125 秒，并把结果缓存到 `sessionStorage` 的 `earth-dialogue.city-visual.v1`。
