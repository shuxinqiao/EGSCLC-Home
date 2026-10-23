# 善牧堂 · Good Shepherd

响应式、三语、无运行时依赖的静态单页网站。5 个 hash 页面：主页 / 关于 / 团契 / 证道 / 奉献。无数据库、无服务器端框架，不需要 npm install。

## 本地开发

安装 Node.js 20 或以上，然后运行 `npm run dev`，打开 http://127.0.0.1:4173。

预览服务监听 `0.0.0.0:4173`，启动时打印本机局域网地址。本次确认 Wi-Fi 地址为 `192.168.0.11`，同一 Wi-Fi 手机可打开 http://192.168.0.11:4173 。IP 变化后以启动输出为准。服务仅提供网站公开文件，不提供项目文档或 Git 文件。若手机连接失败，请检查 Windows 防火墙对 Node 的专用网络许可及路由器客户端隔离；当前项目不会自动更改防火墙。

`npm run check` 检查语法、三语字段完整性及已配置链接；`npm run build` 将发布文件复制到 `dist/`。直接双击 HTML 不适用于 ES modules，请使用本地服务。

## 修改内容

- `content.js`：三语文案、教会地址、各语言聚会时间、电邮、地图、奉献及证道频道链接；通过 `sermon-data.js` 添加证道，自动按日期倒序并支持搜索。
- `archive-content.js`：从旧站核实后的教会历史、六项团契、聚会时间与奉献说明（三语），覆盖基础文案中的对应字段。
- `sermon-data.js`：自动生成的证道数据，由 content.js 导入。请使用 `npm run sync:sermons` 更新，不必手动维护视频列表。
- `verses.js`：三语金句库。刷新及切换页面随机轮换，localStorage 可用时避免上次访问的经文；切换语言保持同节经文。
- `assets/logo.svg`：用户提供的原始教会 Logo。
- `design.css`：墨蓝、铜橙新版视觉与大屏字号；标题尺寸沿用原有样式。
- `design-content.js`：三语扩写、历史版块、到访地图与新版页脚文案。
- `assets/neighbourhood.svg`：手绘风街区意象插画，不作为真实比例导航。
- `ministry-content.js`：首页直接介绍、手机教会名称标识及传道人完整介绍（三语）。

## 自动更新证道

运行 `npm run sync:sermons` 会查询教会 YouTube 频道，支持两种频道页面结构，并在页面不可用时尝试公共 RSS。正则匹配主日崇拜／证道及有效日期，去除教会名称、日期与崇拜前缀，排除见证、诗歌、宣教分享等内容。按视频 ID 去重，保留最多 60 条；已有英文译题保留，新视频使用频道原题，不编造翻译或经文。

`.github/workflows/sync-sermons.yml` 每天运行两次，变化时提交 sermon-data.js。GitHub Pages 工作流通过 workflow_run 在同步成功后重新发布；Cloudflare Pages 的 Git 集成可从提交更新触发部署。推送到 GitHub 的 main 分支并允许 Actions 写入仓库后才会启用，当前本地文件不代表定时任务已上线。若有分支保护，请允许相应自动提交，或按仓库策略改成 PR 流程。

Cloudflare Pages 单独使用时也需要保留 GitHub 同步工作流；仅一次性上传 dist 不会自动更新。YouTube 可能限流或调整结构，脚本失败会保留原列表并令工作流报错，不会清空数据。浏览器不直接抓取 YouTube，无 API 密钥、跨域代理或运行时服务器依赖。

`npm run check` 包含解析器测试（标题、日期、去重、RSS、来源校验、失败保留）。`npm run sync:sermons -- --dry-run` 可只查看结果而不写文件。
- `app.js`：页面布局、图片、语言与导航逻辑。
- `styles.css`：颜色、字体、响应式断点与动画。
- `index.html`：默认 SEO 描述与浏览器配置。

首次访问按浏览器语言列表选择简中 / 繁中 / 英语（不支持的语言回退英语）；手动选择保存在 localStorage，存储不可用时仍可切换。中文台湾、香港、澳门及 Hant 使用繁体。hash 路由兼容 GitHub Pages 子路径，无需重写规则。导航可分享、支持浏览器前进后退。

## GitHub Pages

将项目推送到 GitHub 仓库的 `main` 分支。在 Settings → Pages → Build and deployment 中选择 GitHub Actions。已提供 `.github/workflows/pages.yml`，自动检查、构建和发布 `dist/`。如果主分支名称不同，请修改 workflow 的 branches。所有内部资源均使用相对路径，可部署在 `username.github.io/repository/`。

## Cloudflare Pages

连接 Git 仓库，框架预设选择 None，构建命令填写 `npm run build`，输出目录填写 `dist`，Node 版本设置为 22。也可本地构建后直接上传 `dist` 内文件。网站不使用 Worker 或 SPA fallback。

## 资料状态与图片

用户提供旧站存档：https://web.archive.org/web/20260713101835/http://egsclc.com/ 。已成功读取首页、团契及奉献存档并整合教会历史、下午 2:00 主日崇拜、地址、电邮、六项团契与 Interac e-Transfer 收款邮箱。页面明确注明这些是存档资料，参加聚会或奉献前应向教会确认。证道页连接旧站公布的 YouTube 频道；个别证道可在 sermon-data.js 补充。来源详见 SOURCES.md。正式上线前请教会审阅文案与最新安排。

图片使用 Unsplash 远程氛围摄影，并非本堂活动照片；出处 URL 在 `app.js` 的 images 中。字体使用 Google Fonts，均有系统字体回退。正式上线建议替换为已授权的本堂照片，并将压缩后的 WebP / AVIF 放在本地 assets 文件夹，同时在构建脚本复制该文件夹，减少外部依赖。当前页面在图片网络不可用时保留布局及文字。无追踪、无用户资料提交。

轻量动效使用 transform / opacity 与 IntersectionObserver，支持 prefers-reduced-motion。包含语义化导航、当前页面提示、键盘焦点、跳转主内容、可访问的折叠菜单与 FAQ。
