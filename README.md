# 爱城国语信义会善牧堂

Edmonton Good Shepherd Chinese Lutheran Church 的轻量三语静态网站。原生 HTML / CSS / JavaScript，无 npm 依赖、数据库或服务器运行时。支持简体中文、繁体中文、英语及手机浏览。

## 本地使用

安装 **Node.js 22** 和 Git，在项目目录运行：

```sh
npm run dev
```

打开 <http://127.0.0.1:4173>。手机与电脑连接同一个 Wi-Fi，使用终端打印的 Network 地址；服务监听 `0.0.0.0:4173`。不要直接双击 HTML，ES modules 需要 HTTP 服务。

```sh
npm run validate               # 文案、解析器测试、构建、发布文件与公开文件检查
npm run audit:public -- --history # 首次公开前额外检查本地 Git 历史
npm run sync:sermons -- --dry-run # 查询 YouTube，但不改文件
npm run sync:sermons            # 更新证道列表
```

无需 `npm install`。`dist/` 是可重新生成的发布目录，不提交到 Git。

## 发布到 Cloudflare Pages

### 1. 准备 GitHub 仓库

1. 先运行上述 `validate` 和历史检查，审阅 `git diff`、`git status`。检查不能替代人工审阅；公开仓库也会公开提交历史与作者信息。
2. 在 GitHub 创建空的 public 仓库，不初始化额外 README。将本项目提交并推送到 `main`。若尚未设置远程，可以按下面执行，将占位地址换成实际仓库地址：

```sh
git add .
git commit -m "Prepare Cloudflare Pages deployment"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

已有 `origin` 时先用 `git remote -v` 核对，不重复添加。本项目包含 Git 配置，但不包含任何 Cloudflare 凭证。若使用其他主分支名，请修改 `.github/workflows/ci.yml` 的 `push.branches`。

### 2. 连接 Cloudflare

在 Cloudflare 控制台进入 **Workers & Pages → Create application → Pages → Import an existing Git repository**（界面文案可能变化）。选择 GitHub 并授权此仓库，确认创建的是 **Pages** 项目。

| 设置 | 填写值 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run validate` |
| Build output directory | `dist` |
| Root directory | 留空，使用仓库根目录 |
| Node.js | 仓库 `.node-version` 指定 `22`；必要时设环境变量 `NODE_VERSION=22` |

点击 Save and Deploy。成功后使用控制台提供的 `https://项目名.pages.dev` 地址检查五个页面、三种语言、头像和证道链接。无需 Wrangler、Cloudflare API Token、YouTube API Key 或构建时联网查询 YouTube。

后续推送会由 Cloudflare Git 集成自动部署。GitHub CI 与 Cloudflare 构建各自运行；因此 Cloudflare 同样使用 `npm run validate`，检查失败不会发布该次版本。自定义域名请在 Pages 项目的 **Custom domains** 中添加并按提示设置 DNS，不能只手工创建 DNS 记录。

参考：[Git 集成](https://developers.cloudflare.com/pages/get-started/git-integration/) · [构建设置](https://developers.cloudflare.com/pages/configuration/build-configuration/)。

### 3. 启用每周证道更新

`.github/workflows/sync-sermons.yml` 已设置为 **每周五 03:00 UTC（新加坡周五 11:00）**。工作流推送到 GitHub 默认分支后才能生效，本地文件本身不会运行定时任务。

1. 在仓库 **Actions** 启用工作流；确认仓库/组织策略允许 Actions，并允许此工作流请求 `contents: write`。
2. 选择 **Update sermons → Run workflow**，选择默认分支，手动运行一次验证。
3. 新数据通过检查后，机器人仅提交 `sermon-data.js`；没有变化则不提交。Cloudflare Git 集成接收提交后部署，在控制台核对 commit SHA。
4. 分支规则必须允许该自动提交。若组织要求所有修改走 PR，应将同步流程改为组织批准的 PR 流程，当前工作流不会强制推送或绕过保护。

GitHub 定时任务可能排队延迟，并非精确到点执行。公共仓库连续 60 天没有活动时，GitHub 会停用计划任务，需要到 Actions 重新启用。建议开启 GitHub 工作流失败通知。

机器人使用 `GITHUB_TOKEN` 的提交不会触发其他 GitHub `push` 工作流；同步任务已自行执行完整验证，Cloudflare 使用独立 Git 集成。参考：[计划任务规则](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) · [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token)。

## 项目结构与修改方式

| 文件 | 用途 |
| --- | --- |
| `content.js` | 所有三语文案、教会信息、聚会安排和外部链接 |
| `app.js` | 五个 hash 页面、语言切换、导航和交互 |
| `styles.css` / `design.css` | 基础布局与动效 / 视觉主题与响应式细化，按此顺序加载 |
| `verses.js` | 三语轮换金句 |
| `sermon-data.js` | 自动生成的证道数据，已有人工译题会保留 |
| `assets/` | 教会标识、头像、街区示意图 |
| `scripts/site-files.mjs` | 本地预览和生产构建的公开文件白名单；新增资源需加入 |
| `scripts/sync-sermons.mjs` / `youtube-parser.mjs` | YouTube 查询、来源校验、标题与日期解析 |
| `.github/workflows/` | 提交/PR 检查及周五同步 |
| `_headers` / `404.html` | Cloudflare 响应头与真正的不存在页面 |
| `docs/` | 排障及内容来源 |

页面地址使用 `/#home`、`/#about`、`/#fellowship`、`/#sermons`、`/#giving`。语言首次按浏览器选择，后续遵循用户保存的选择。动画支持系统减少动态效果设置。无追踪、无用户资料提交。

同步脚本查询指定频道，校验频道身份，筛选带有效日期的主日崇拜/证道，排除见证、诗歌及宣教分享。页面查询失败时尝试 RSS（仅包含近期视频）；按视频 ID 合并、去重、保留最多 60 条。新标题使用频道原题，不自动编造英文翻译。失败会报错并保留原文件，网站继续使用已提交数据。

公开前请教会确认文案、聚会时间、奉献邮箱和图片使用权限。头像及 Logo 来自用户提供；氛围照片使用远程 Unsplash 图片，字体使用 Google Fonts，存在外部网络依赖及系统字体回退。没有为第三方素材重新授予许可。

详见 [部署与同步排障](docs/TROUBLESHOOTING.md) 和 [内容来源](docs/SOURCES.md)。
