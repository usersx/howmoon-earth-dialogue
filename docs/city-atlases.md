# 东京与西安城市图鉴

新增两座完整城市，均提供俯瞰艺术封面、六景长卷与六个独立建筑图鉴。图鉴提供三处建筑热点、局部图像放大、可切换放大镜、官方资料入口与前后景点切换。

- 东京 /city/tokyo/，机票城市代码 TYO
- 西安 /city/xian/，机票城市代码 SIA
- ?enter=1 直接进入长卷，&landmark=景点slug 恢复指定景点
- 首页 /?fly=tokyo 和 /?fly=xian 点亮地球，再进入城市封面

内容由 site/city-atlas-data.json 管理。修改后运行 backend/.venv/bin/python scripts/build_city_atlases.py，生成静态 HTML。交互与样式分别位于 site/city-atlas.js 和 site/city-atlas.css。

## 视觉

使用内置 imagegen 生成 2 张城市封面、2 幅连续建筑长卷和 12 张独立建筑插画。东京采用靛蓝暮色、橙红东京塔、寺社素木与丸之内红砖；西安采用灰砖、赭石、铜绿瓦面与城门晚灯。图鉴统一暖纸底、铅笔排线与克制淡彩。

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
