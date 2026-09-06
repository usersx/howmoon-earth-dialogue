# 城市图鉴开发说明

在北京、罗马之外新增 15 座城市，每城提供俯瞰艺术封面、六景长卷和六个独立景点图鉴。合计 17 城、110 景点。新增图鉴默认启用鼠标放大镜，包含三处热点、三节详细讲解、官方入口、前后景点切换和返回位置恢复。原有两城的 20 景点也将讲解展开到页面下方。

新增城市：东京、西安、杭州、南京、哈尔滨、三亚、广州、深圳、新加坡、厦门、佛罗伦萨、巴黎、伦敦、纽约、柏林。

`/cities/` 是可按中文、英文、国家搜索的城市入口。名片直接进入 `/city/{slug}/`，地球点亮使用 `/?fly={slug}`。

- 东京 /city/tokyo/，机票城市代码 TYO
- 西安 /city/xian/，机票城市代码 SIA
- ?enter=1 直接进入长卷，&landmark=景点slug 恢复指定景点
- 首页 /?fly=tokyo 和 /?fly=xian 点亮地球，再进入城市封面

内容由 `site/city-atlas-data.json` 管理。一次修改后依次运行：

```sh
backend/.venv/bin/python scripts/build_city_atlases.py
backend/.venv/bin/python scripts/sync_city_entries.py
backend/.venv/bin/python scripts/build_legacy_reading.py
backend/.venv/bin/python -m pytest backend/tests -q
```

第一步生成名片、目录和图鉴；第二步同步首页点亮数据及两个城市匹配模块，带标记区块以便幂等更新；第三步保持北京、罗马服务端 HTML 与新阅读组件一致，防止 hydration mismatch。交互与样式分别位于 `site/city-atlas.js`、`site/city-atlas.css`、`site/landmark-reading.css`。

说明字段 `article` 为三段独立讲解，每段有 `heading` 与 `text`；热点 `points` 为具体图片百分比坐标。必须按实际出图校对，不能直接照搬均分占位值。馆内话题的外观热点明确标注“入内延伸”。

## 视觉

使用 imagegen 分别生成 15 张城市封面、15 幅长卷与 90 张独立插画，统一暖纸、铅笔排线与淡彩。各城保留自己的色彩与建筑语言。后续城市使用高质量 JPEG，原生成 PNG 保留在本机生成目录，避免将全部大图重复塞入部署产物。

封面为城市艺术肖像，并非实拍照片；长卷按视觉节奏排布，并非地理地图。图鉴局部图片由浏览器放大原插画对应位置，不是另行捏造的建筑细节摄影。

## 资料

- [东京官方景点指南](https://www.gotokyo.org/en/see-and-do/attractions/)
- [浅草地区](https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/)
- [晴空塔观景体验](https://www.tokyo-skytree.jp/enjoy/experience-tokyo-skytree/)
- [明治神宫境内图与建筑介绍](https://www.meijijingu.or.jp/en/map/)
- [明治神宫森林](https://www.meijijingu.or.jp/en/whattosee/forest/)
- [东京塔历史](https://gallery.tokyotower.co.jp/en/index.html)
- [东京站建筑指南](https://www.gotokyo.org/en/story/walks-and-tours/tokyo-architecture-tokyo-station/index.html)
- [宫内厅皇居参观](https://sankan.kunaicho.go.jp/english/guide/koukyo.html)
- [西安市地标介绍](https://en.xa.gov.cn/MediaCenter/News/1691691491099529217.html)
- [西安市大雁塔介绍](https://en.xa.gov.cn/CultureTravel/Attractions/1691691504798126082.html)
- [碑林区与小雁塔](https://en.xa.gov.cn/ThisisXian/Districts/1854445049833164802.html)
- [大明宫遗址景区](https://en.xa.gov.cn/MediaCenter/News/1691691385017192449.html)
- [秦始皇帝陵博物院](https://www.bmy.com.cn/)

不写固定票价或开放时间，访问官方入口核对最新安排。丹凤门文案明确区别当代保护展示建筑与唐代遗址。

其他城市的官方来源记录在各景点 `source` 字段及 [广州、深圳、新加坡研究](research-guangzhou-shenzhen-singapore.md)、[厦门等六城研究](research-next-six-cities.md)。讲解素材保留于对应研究 JSON 文件，应用以 `site/city-atlas-data.json` 为准。

城市坐标是用于地球标记的近似位置；机票链接沿用 Trip 目的地代码协议，没有出票或支付操作，也不承诺实时票价或可订余量。贝塞斯达喷泉的修复提示以官方公告为依据。

## Vercel 静态资源

图片的唯一受维护位置是已提交到 Git 的 `public/assets/`，浏览器 URL 仍为 `/assets/...`。Vercel 从部署输入中识别这些静态文件，本地由 FastAPI 在前端根挂载之前提供 `/assets`。`scripts/prepare_vercel.py` 仅校验必需图片，不再移动目录。页面、脚本和城市元数据保留在 `site/`。

2026-09-06 的线上 404 日志证明，过去“构建时临时移动到 public”的实现没有正确发布图片。函数包变小和部署 Ready 都不能证明图片可访问。现已采用版本化静态目录，并补充 Git 文件检查、本地挂载检查和线上封面解码检查。当前修复的线上结果以实际验收为准。

依据 [Vercel FastAPI 的 public 目录说明](https://vercel.com/docs/frameworks/backend/fastapi#the-public-directory)。不要把整个项目目录复制到 public，以免公开环境配置或其他私有文件。
