# 部署与同步排障

## Cloudflare 构建失败

先查看 Pages → Deployments → 对应部署 → Build log 的第一条错误，而不是最后一行退出码。

- **找不到 package.json**：Root directory 应为仓库根目录。框架选择 None。
- **Node 版本不符**：日志确认 Node 22；检查 `.node-version` 已提交，必要时设置 `NODE_VERSION=22` 后重试。
- **没有 dist / 输出目录不存在**：构建命令用 `npm run validate`，输出目录为 `dist`，不是 `/dist`。
- **public-file audit 报错**：日志只显示文件名和问题类别，不显示密钥。删除不应公开的文件；若密钥已进入历史，先撤销/轮换密钥，再按 GitHub 指引清理历史，仅删除当前文件不够。
- **缺少资源**：新增图片、脚本后要同时更新 `scripts/site-files.mjs`。本地运行 `npm run validate` 复现错误。
- **出现 Wrangler/Worker 部署错误**：核对是否误建为 Workers；本项目使用 Pages 静态站点，不需要 Worker 部署命令。

## 网站没更新或出现空白

1. 确认修改已提交并推送，核对 Cloudflare 的部署 commit SHA 和生产分支。
2. 确认最新部署成功，且访问的是 production 域名，不是旧的 preview URL。
3. 浏览器强制刷新；开发者工具 Network 查看失败请求。本站未使用 Service Worker。静态资源不带内容哈希，`_headers` 设置重新验证缓存，避免新 HTML 配旧 JS。
4. 脚本返回 HTML / MIME 错误时，检查 dist 中是否存在对应 JS，以及是否配置了额外的重写规则。本项目不需要 SPA fallback；缺失资源应返回 404。
5. 页面采用 hash 路由，请分享 `/#about`，不要用 `/about`。
6. Google Fonts / Unsplash 在部分网络不可用，系统字体及正文仍应可见；需要完全离线资源时，将已授权图片/字体本地化并更新白名单。

## 自动同步没运行

- 工作流必须在默认分支，仓库 Actions 必须启用。手动运行也请选择默认分支，否则 job 会跳过。
- 计划为每周五 **03:00 UTC**；GitHub 高负载可能延迟，不保证准点。
- 公共仓库 60 天无活动可能被停用，进入 Actions 重新启用。无新视频时不会生成空提交来保持活跃。
- 本地仓库中的工作流不会自动执行；必须先推送 GitHub。

## 同步失败或视频未收录

打开 Actions → Update sermons → 对应运行，定位失败步骤。

| 现象 | 处理方式 |
| --- | --- |
| YouTube 超时、403、429 | 稍后手动重跑。脚本会尝试 RSS，仍失败则保留旧数据；不要通过关闭来源校验解决 |
| 没有符合条件的视频 | 检查频道新视频是否包含日期及主日崇拜/证道关键词；见证、诗歌等会排除。YouTube 结构变化时更新解析器和相应测试 |
| 视频标题日期不符合格式 | 用 `npm run sync:sermons -- --dry-run` 检查结果；依据真实标题扩展 `scripts/youtube-parser.mjs`，运行 `npm run check` |
| 403 / permission denied on git push | 确认 job 的 `contents: write` 权限未被仓库/组织策略限制 |
| Protected branch / ruleset 拒绝 | 按组织规范配置机器人权限或实现 PR 流程，不要强制推送。当前工作流需要可直接提交默认分支 |
| rebase conflict | 人工审阅冲突及最新数据，再重跑；任务不会 force push |
| 绿色但没有提交 | 查询结果没有变化，属于正常情况；查看步骤摘要 |
| 已提交但 Cloudflare 未部署 | 检查 Pages Git 集成授权、生产分支、自动部署开关及 build watch paths；核对机器人提交 SHA，必要时从 Pages 重试部署 |

RSS 只覆盖近期条目，并不是完整历史来源。已有条目会合并保留，但首次抓取不能保证覆盖全部历史视频。

## 回退

代码或文案问题：用 `git revert <有问题的提交SHA>` 生成正常回退提交并推送，Cloudflare 会重新构建。紧急恢复可在 Pages 部署列表中对可用的生产版本使用 Rollback（若该版本可回退），随后也修正 Git 源码，否则下次提交会重新引入问题。不要把 `dist` 当作唯一源码备份。

## 手机本地预览

运行 `npm run dev`，电脑与手机同 Wi-Fi，打开终端的 Network 地址。IP 由路由器分配，可能变化。确认服务还在运行、Windows 防火墙允许 Node 的专用网络连接、路由器未开启客户端隔离。`0.0.0.0` 是监听地址，不是手机需要访问的地址。本地预览不是公网发布。

若启动报 `EADDRINUSE`，说明 4173 端口已有服务监听；先关闭自己此前启动的预览终端再重启。修改 `scripts/serve.mjs` 后需要重启服务，修改网页文件只需刷新。
