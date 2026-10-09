# 爱听书 · Readio 官网

一个可直接用于 GitHub Pages 的中英文静态官网。**无需 npm install、无需后端、没有第三方字体或追踪脚本**。发布时只上传官网文件，不需要上传 iOS 项目、模型、书籍或用户数据。

## 设计与内容

- **暖白纸感 + 清透蓝色**：延续最新商店图，以真实界面建立信任，避免通用 AI 产品的暗色霓虹风。
- 首屏直接传达“导入自己的书、选声音、配角色、边听边读”，两个真实 App 画面分别展示书架和跟读。
- 首屏后的三个功能入口，以及顶部导航，直接跳转到 TTS、书籍导入和阅读 AI，不再把重点只藏在截图标签里。
- **TTS 独立介绍**：系统语音、网络 TTS、本地克隆、插件四类来源；配音示意解释旁白与角色的不同声音，并说明离线资源、授权及费用边界。示意不是可播放的真实试听。
- **导入独立介绍**：文件/iCloud、Wi-Fi/直链、常用云盘、WebDAV/S3/OPDS 分组说明；区分 TXT/EPUB 听读、MOBI 转换导入与 PDF 当前的文件保存能力，不宣传未实现的 SMB 下载。
- **阅读 AI 独立介绍**：随书问答、章节剧情、人物与线索、听书角色；检索/记忆、模型/工具、发送范围/用量/预算以原生折叠区渐进展开。
- 七项可切换功能：边听边读、声音库、导入、阅读定制、书架、统计、AI 辅助；支持放大查看对应完整商店图。
- 三个独立介绍都有真实截图入口，支持中英文海报、Escape 关闭和返回触发链接；没有 JavaScript 时直接打开图片。
- 通勤、睡前、理解故事的日常场景，三步上手、本地优先说明、8 个产品常见问题、重复下载入口。
- 手机、平板和桌面响应式布局；键盘导航、原生弹窗/FAQ、减少动态效果偏好。
- 独立的中英双语隐私政策与使用条款：章节目录、移动端折叠目录、更新时间和联系邮箱；与首页共享语言选择，关闭 JavaScript 仍可阅读完整中英文正文。
- 所有宣传边界按已有界面与代码保守描述：不声称自带书库、所有功能离线、AI 永远准确，也不虚构用户数量和评分。

功能文案依据与不能过度承诺的项目见 `FEATURES.md`。本轮调整只涉及官网，没有修改 iOS 功能。

## 先看效果

直接在浏览器打开 `index.html` 即可。更推荐在这个目录运行：

```sh
node scripts/serve.cjs
```

然后打开：

- 自动语言：`http://127.0.0.1:8765/`
- 中文：`http://127.0.0.1:8765/?lang=zh`
- 英文：`http://127.0.0.1:8765/?lang=en`
- TTS：`http://127.0.0.1:8765/?lang=zh#tts`
- 导入：`http://127.0.0.1:8765/?lang=zh#imports`
- 阅读 AI：`http://127.0.0.1:8765/?lang=zh#reading-ai`
- 隐私政策：`http://127.0.0.1:8765/privacy.html?lang=zh`
- 使用条款：`http://127.0.0.1:8765/terms.html?lang=zh`
- 英文政策 / 条款：将以上链接的 `lang=zh` 改成 `lang=en`。

本地预览不代表已经发布到互联网。

## 语言规则

优先级：**URL 的 `?lang=zh|en` > 用户保存的手动选择 > 浏览器第一首选语言 > 英文兜底**。

- `zh`、`zh-CN`、`zh-Hans`、`zh-Hant`、`zh-TW`、`zh-HK`、`zh-MO` 等中文语言显示中文。
- `yue`、`cmn` 以及地区字段为 `CN / HK / TW / MO` 的浏览器语言（如 `en-HK`）也显示中文。
- 其他语言显示英文。例如首选 `en-US`、次选 `zh-CN` 时，仍显示英文。
- 当前只有**中文（简体文案）与英文**两个内容版本。繁体浏览器用户会进入中文版，而不是单独的繁体翻译版。
- 文案、图片、图片替代文本、页面标题、描述、按钮无障碍标签一起切换。
- 手动切换会更新 URL 并尽可能记住偏好；浏览器禁用本地存储时也能正常切换。
- **按语言地区判断，不按真实地理位置**。人在中国但浏览器设置为 `en-US` 会看到英文。纯 GitHub Pages 无法直接可靠获得访客国家；本网站不调用 IP 定位接口、不请求位置授权。
- 首页、隐私政策、条款之间的链接会带上当前 `lang`，即使本地存储不可用，也不会因换页而丢失语言。外部 HTTPS 政策链接不强加本网站的语言参数。
- 关闭 JavaScript 后仍有英文首页、三块完整功能说明、进阶 AI 折叠区和 FAQ；法律页面会同时展示完整中英文正文，章节目录、邮箱、首页及文档链接仍有效。自动语言判断和七图切换需要 JavaScript。

## 联系方式与法律页面

`site.config.js` 已配置：

```js
const config = Object.freeze({
  appStoreURL: 'https://apps.apple.com/app/id6809803750', // 用户提供的 App ID，不固定商店地区
  supportEmail: 'listenbook999@outlook.com',
  privacyURL: 'privacy.html',
  termsURL: 'terms.html',
});
```

- 首页页脚、政策与条款中的联系入口统一使用此邮箱，不需要分别修改每一份 HTML。
- 政策链接使用相对路径，在独立域名和 `用户名.github.io/仓库名/` 下都可使用；不要在文件名前加 `/`。
- 也支持替换为已审核的完整 HTTPS 政策地址。外部地址另开标签页；本网站页面在当前标签页打开并保留语言。
- **App Store 下载地址已设置为 `https://apps.apple.com/app/id6809803750`**。导航、首屏和页面底部三个下载入口共用此地址；中英文一致，不固定 `/cn` 或 `/us` 商店地区。静态 HTML 也已写入，关闭 JavaScript 仍可跳转。
- 如果以后清空或误填 App Store 地址，运行时会恢复“下载链接待更新”提示；其他未配置或不安全的政策/联系链接会隐藏。
- 链接根据用户提供的 App ID 生成；能否下载以 App 实际上架状态及所在商店地区为准。
- 修改配置后执行 `node scripts/build-html.cjs` 和 `node scripts/build-legal.cjs`，同步无 JavaScript 时的静态链接。
- 隐私政策与条款已按当前源码功能编写，未照搬参考网站的旧品牌、广告 SDK 或全面免责条款。**发布前请按 `LEGAL_REVIEW.md` 确认运营主体、真实数据处理、购买说明与法律适用要求。**本地页面可用不等于已经通过法律或 App Store 审核。
- 此处只能放公开链接，不要放 API Key、访问令牌、Cookie、密码或任何秘密。

发布后可将“实际网站根地址 + `privacy.html` / `terms.html`”用于 App Store 或 App 内链接；本次尚未设置正式域名，也没有把猜测的网址写入 iOS 项目。

## GitHub Pages 部署（推荐：独立官网仓库）

1. 在 GitHub 创建一个独立仓库，例如 `lovelistenbooks-site`。不要把整个 iOS 工程上传为公开网站。
2. 将**本文件所在目录内的内容**放进仓库根目录。根目录应直接看到 `index.html`，不是再套一层“官网”文件夹。包含 `.github/workflows/deploy-pages.yml` 和 `.nojekyll` 两个隐藏路径。
3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 提交到 `main`（也支持 `master`）。附带的工作流会先运行测试，再只打包网页与图片，最后部署。
5. 打开 **Actions → Deploy website to GitHub Pages**，等待成功。Pages 设置页会给出正式网址，通常为 `https://你的用户名.github.io/仓库名/`。
6. 用电脑和手机分别检查 `?lang=zh` 与 `?lang=en`，再确认下载和法律链接。

不喜欢 Actions，也可以改为 **Deploy from a branch → main → /(root)**。此时不需要工作流，GitHub Pages 会直接发布静态 HTML；不要同时开启两个部署方案。

### 自定义域名

在 Pages 设置中绑定自己的域名，按 GitHub 提示配置 DNS，并开启 HTTPS。域名确定后可进一步补充绝对地址的 canonical、分享卡片和 sitemap；当前未编造正式域名。

### 如果必须保留在同一个代码仓库

需要把工作流放到**仓库根目录**的 `.github/workflows/`，并把测试工作目录和复制来源改为 `官网/`。推荐仍只打包官网资源，不要直接把整个仓库作为公开 Pages artifact。

## 文件结构与维护

```text
index.html                  已预渲染的首页，可直接发布
privacy.html                中英双语隐私政策（完整静态正文）
terms.html                  中英双语使用条款（完整静态正文）
legal.css                   法律页排版、目录、响应式与打印样式
legal.js                    法律页语言、元数据及链接的渐进增强
styles.css                  设计系统与响应式布局
app.js                      交互、语言切换、可配置链接
content.js                  中英文文案、三块详细介绍及七个截图功能的数据
language.js                 共享语言规则及偏好存储键
links.js                    浏览器与生成器共享的安全链接处理
site.config.js              下载/隐私/条款/联系信息
assets/zh/                  中文 WebP 截图
assets/en/                  英文 WebP 截图
assets/*icon*.png            项目真实 App 图标
scripts/build-html.cjs      从首页文案与配置生成 HTML
scripts/build-legal.cjs     生成两份完整的双语法律页面
scripts/legal-content.cjs   隐私政策、条款及公共标签的双语内容源
scripts/serve.cjs           零依赖的本地预览服务
scripts/prepare-assets.py   从原始商店图重新优化图片（需 Pillow）
tests/site.test.cjs         首页自动回归测试
tests/legal.test.cjs        法律页、邮箱、安全链接和部署回归测试
tests/browser.test.cjs      可选浏览器、交互和截图检查
FEATURES.md                 功能文案的源码依据与宣传边界
LEGAL_REVIEW.md             法律文案依据与发布前确认事项
.github/workflows/          GitHub Pages 自动部署
```

修改文字：先改 `content.js`，再重新生成 HTML，保证无 JavaScript 时的内容也同步：

```sh
node scripts/build-html.cjs
node scripts/build-legal.cjs
node --test tests/site.test.cjs tests/legal.test.cjs
node scripts/build-html.cjs --check
node scripts/build-legal.cjs --check
```

修改政策或条款：编辑 `scripts/legal-content.cjs`（中英文须对应），再执行上面的生成与检查命令。不要只修改生成后的 HTML，否则下一次生成会覆盖变动。法律文案不是浏览器运行时依赖，Actions 发布时不会打包 `scripts/`、测试或内部审核说明。

详细介绍分别位于 `tts`、`imports`、`readingAI` 对象中。模板和运行时均支持 `data-i18n="tts.engines.0.title"` 这类路径；新增字段必须同时补齐中英文，测试会核对结构及页面上的全部翻译。

图片从用户提供的中英文各 7 张商店图优化而来，未修改原图。裁剪版用于设备展示，完整海报用于放大查看。全部网页图片约 2.1 MB，无外部 CDN 依赖，未用到的完整海报不会在首次加载时请求。

要重新生成图片，需要将官网目录放回原 iOS 项目旁的当前位置，并提供 Python + Pillow，然后运行 `python3 scripts/prepare-assets.py`。**普通部署不需要 Python 或 Pillow**，现成图片已包含。

### 可选：完整浏览器检查

已有 Playwright 和 Chrome 的环境中运行：

```sh
node tests/browser.test.cjs
```

如依赖不是安装在当前目录，可通过 `NODE_PATH` 指向已有 `node_modules`；如不使用系统 Chrome，可用 `BROWSER_EXECUTABLE` 指定 Chromium 的可执行路径。

检查覆盖两种语言的 320、375、390、768、1024、1440 像素视口、所有嵌套文案翻译、核心区块内容是否被裁切、自动语言规则、手动偏好、全部功能切换、各区块截图弹窗、进阶 AI 折叠区、手机菜单、FAQ、减少动态效果、存储受限和无 JavaScript 降级。临时预览服务模拟 GitHub Pages 子路径，结束后自动关闭，截图保存到系统临时目录 `lovelisten-website-qa`（可用 `QA_OUTPUT_DIR` 覆盖）。区块截图会临时隐藏固定导航和跳转链接，避免截图拼接时把浮层绘入正文，不影响真实页面。
