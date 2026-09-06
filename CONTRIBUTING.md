# 一起补完这本城市图鉴

欢迎把你去过的城市、喜欢的景点带进何月，也欢迎直接提 PR。我们希望每座城市都有自己的样子，景点里的细节也经得起认真阅读。一次补好一座城市，或把一个已有景点讲得更清楚，都很有价值。

没去过也可以参与，请依据可靠资料写作。个人感受可以保留，但要与历史事实、参观安排分开。不要把资料查询写成自己的亲历。

## 选择一种贡献方式

| 类型 | 推荐范围 | 提交内容 |
| --- | --- | --- |
| 新增城市 | 一次一个城市 | 城市数据、8 张配图、6 个景点、生成页面、入口及验收证据 |
| 完善已有景点 | 一次一个景点或一组相关纠错 | 更准确的讲解、素材或热点位置，附修改依据 |
| 修复交互 | 一次解决一个明确问题 | 复现步骤、修改前后对比、回归检查 |
| 文档改进 | 一次讲清一个操作或限制 | 校对过的命令、说明或链接 |

新增城市、整体换图和修改公共交互，建议先开 Issue，列出城市名、六个景点和大致风格，避免重复工作。小范围错字与事实纠正可直接提 PR。更换框架、引入新的付费服务、改登录或部署方式，需要先与维护者讨论。

## 新城市的交付标准

### 1. 先选好六个地方

当前新城市按六景规格组织。优先选能说明城市差异的建筑、街区或自然景观，避免六张只有名称不同的通用风景。新增完整城市时交付六景；还在准备的内容使用 Draft PR。

新增第七个景点也可以先讨论，但需要同时调整长卷、区域坐标、相关数量文案与测试。不要只往数组末尾加一条数据。北京和罗马沿用各自十景的现有实现，修改前先读 [Agents.md](Agents.md)。

### 2. 数据与命名保持一致

在 `site/city-atlas-data.json` 中新增一个城市对象。选一个现有新城市作为结构参考，只复制字段结构，文案与图片必须重新准备。

| 字段 | 要求 |
| --- | --- |
| 城市对象的键 | 稳定的小写英文 slug，多个单词用连字符，如 `new-york` |
| `name`、`english`、`country` | 中文名、展示英文名和国家名保持准确 |
| `latitude`、`longitude`、`coordinates` | 数值和展示文字一致，经纬度范围合理，南纬与西经使用负数 |
| `iata` | 核验机场或城市三字码，不能根据英文名自行缩写；机场所在地与目的城市不同要解释 |
| `accent`、`tagline`、`intro`、`description` | 延续暖纸风格，给城市自己的颜色和表达 |
| `imageFormat` | 与文件真实编码、后缀一致；新增资源优先 `jpg` |
| `panoramaRegions` | 与 `landmarks` 同序、数量一致，每项为 `[起点百分比, 终点百分比, 标签纵向百分比]` |
| `landmarks` | 六个景点，每个使用唯一 slug，图片名、数据和路由一致 |

景点需要 `name`、`english`、`subtitle`、`era`、`area`、`visit`、`description`、`source`、`tips`、`points`、`article`。字段形状以现有 JSON 为准。

- `source` 放支持介绍内容的官方或第一方页面。更多来源写在 `docs/` 的研究说明里，注明查阅日期和分歧。
- `article` 固定三节，每节包含 `heading` 和 `text`。通常分别讲背景、如何观看和漫游建议，可按景点调整标题。三节正文总计至少 200 个字符，建议约 220 至 400 个中文字，不靠重复热点说明凑数。
- `visit` 是建议停留时长，不能当作开放时间。票价、预约要求、修复状态等易变信息应附来源及核验日期，优先引导读者查看官方公告。
- `points` 默认三处，包含 `x`、`y`、`title`、`lead`、`text`。坐标为整张图的百分比，必须按实际图片校对，不接受重叠的 `50/50` 占位点。

`scripts/sync_city_entries.py` 会生成多数新城市的地球入口及城市匹配信息。遇到新的国家，要补齐其中的 `COUNTRY_CODES`；需要别名时补 `EXTRA_ALIASES`。不能因为城市卡片能打开，就省略 `/?fly=<slug>` 的检查。

### 3. 准备完整且有辨识度的素材

新增城市通常交付下面 8 个文件，路径与 JSON 中的后缀保持一致。

```text
site/assets/<city-slug>/
  hero.jpg
  panorama.jpg
  <landmark-1>.jpg
  <landmark-2>.jpg
  <landmark-3>.jpg
  <landmark-4>.jpg
  <landmark-5>.jpg
  <landmark-6>.jpg
```

- 城市名片优先用精美俯瞰构图，建议接近 16∶9，给标题和按钮留出可读区域。自然光、屋顶、植被应符合城市，别把相隔很远的地标拼成一张声称真实的航拍。
- 长卷采用连续的建筑或景观编排，建议接近 3∶1。六景应能分别识别、选中和进入，图内不要烘焙按钮或热点标签。主题顺序可以重排，但必须保留非地理地图的说明。
- 单景图延续暖白纸纹、细线稿与克制淡彩，建议接近 3∶2。保留完整主体与适当留白，核对塔形、屋檐、桥梁结构等识别特征。构图需要其他比例时，说明理由并检查布局。
- 新图建议单张不超过 2 MB。超过时在 PR 中说明原因及优化结果。不要为了减小文件而裁掉地标、制造明显压缩痕迹或只改后缀。
- 提供来源链接、作者及可在本项目使用的依据；AI 生成素材注明工具、提示摘要和人工校对情况。不要提交来源不明的图、水印图或包含个人隐私的照片。项目许可或素材权属不明确时，先交维护者确认，不自行补一份授权声明。
- 原始大图可以保留在自己的工作目录，提交用于网页的成品。不要把缓存、录屏原片、重复素材或密钥文件一并推上来。

### 4. 保持已有交互

城市名片能进入长卷，长卷支持拖动、景点选择和滚动位置控制。进入图鉴后，桌面鼠标移动直接出现放大镜，不应要求用户先开开关。触屏用户应能通过点按热点阅读。

热点要落在对应结构上。主图没有画出内部大厅时，可以在入口处标记“入内延伸”，明确解释的是内部空间。不要把一个穹顶的解释贴在旁边的树上。

详细讲解直接显示在图下方，“阅读景点讲解”使用原生页内跳转。返回长卷应恢复选中的景点，前后景点链接不能跳错城市。机票入口保留到 Trip 的目的地参数，测试不需要下单。

## 本地开发与构建

下面命令都从仓库根目录执行，以 macOS/Linux 为例。需要 Python、项目开发依赖；修改 JavaScript 后还需要 Node.js 做语法检查。Windows 可将 `backend/.venv/bin/python` 换成 `backend\.venv\Scripts\python.exe`。

```sh
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements-dev.txt
```

首次运行时，确认 `backend/.env.local` 尚不存在，再将 `backend/.env.example` 复制过去，避免覆盖自己的 Key。仅做静态城市开发不需要真实 Key。

```sh
backend/.venv/bin/python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 3000 --env-file backend/.env.local
```

macOS 也可用 `setup-local.command` 和 `start-local.command`。这些 `.command`/`.sh` 入口使用 zsh，不能当成 Windows 启动脚本。修改 Python 后重启服务或自行启用开发重载。

改完数据后生成页面与入口，再运行测试。

```sh
backend/.venv/bin/python scripts/build_city_atlases.py
backend/.venv/bin/python scripts/sync_city_entries.py
backend/.venv/bin/python scripts/build_legacy_reading.py
backend/.venv/bin/python -m pytest backend/tests -q
node --check site/city-atlas.js
node --check site/city-catalogue.js
node --check site/_next/static/chunks/app/page-cfec76f4fe91be41.js
git diff --check
```

构建脚本会更新已提交的 HTML 和 bundle，这些产物需要与源数据一起提交。检查第二次运行是否又产生意外变化，别手改生成页面后忘记修改源头。只改文档时，不必重生成前端。

如果 `site/` 有变化，更新校验清单。下面命令适用于 macOS，Linux 可将 `shasum -a 256` 换成 `sha256sum`。Windows 可使用 WSL/Git Bash 中相应工具。

```sh
(cd site && find . -type f ! -name '.DS_Store' -exec shasum -a 256 {} + | sort > ../SHA256SUMS.txt)
```

不要在本地设置 `VERCEL=1` 来运行 `scripts/prepare_vercel.py`。它会移动图片目录，专供 Vercel 的临时构建环境使用。部署规则详见 [Agents.md](Agents.md)。

## PR 需要附什么

请使用仓库自动填入的 [PR 模板](.github/pull_request_template.md)。推荐标题如 `feat(city): add Suzhou atlas`、`fix(atlas): restore selected landmark` 或 `docs: improve city contribution guide`。

1. 说明改了什么、为什么选这座城市或这个景点，关联已有 Issue。
2. 列出资料来源、核验日期和素材使用依据；有不确定之处直接写出。
3. 附实际运行截图。新增城市至少展示名片、长卷、开启的热点卡片、默认放大镜和下方讲解；同时提供约 390 px 宽度的窄屏截图。同一张截图可以覆盖多个检查项。
4. 写出本次运行的测试命令与结果。未运行写“未运行”并解释原因，不能拿历史通过记录代替本次结果。
5. 说明影响范围、已知限制和回退方式。纯文案纠错可以简化截图，但必须附对应依据。

一次 PR 尽量只做一件事。请从自己 fork 的分支发往上游 `main`，使用自己的 GitHub 作者信息，提交有意义的说明。不要混入全库格式化、无关依赖升级或别人的未提交改动。

## 提交前验收清单

- [ ] `/cities/` 能找到新城市，中英文搜索正常。
- [ ] `/city/<slug>/` 的名片能进入长卷，六处区域与景点顺序一致。
- [ ] `/?fly=<slug>` 能点亮正确城市并进入正确名片。
- [ ] 每个新增或修改的景点都实际点过，热点文字和局部图匹配。
- [ ] 桌面默认放大镜正常；触屏点按、关闭、键盘焦点和 Escape 可用。
- [ ] 下方三节讲解可直接阅读，页内跳转及返回选中位置正常。
- [ ] 图片可解码，无缺图；宽屏与窄屏无意外横向溢出。
- [ ] 检查了浏览器错误；修改公共交互时复查至少一座未修改城市。
- [ ] 测试与生成产物已更新，PR 附有本次结果、截图和未测说明。
- [ ] 无密钥、私有配置、个人隐私及不明来源素材。

这些是贡献与评审标准，不代表仓库已经配置了同名自动 CI 或分支保护。维护者会检查内容、交互和风险，资料不全时可能要求补充。合并也不等于已部署，正式发布由维护者单独确认。
