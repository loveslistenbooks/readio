# 隐私政策与使用条款：依据及发布确认

整理日期：2026-10-12。适用品牌：**爱听书 / Readio**。联系邮箱：**listenbook999@outlook.com**。

本目录已包含可以直接预览、随静态官网一起部署的页面；这份说明是给维护者的核对清单，不是政策正文，也不代表已完成法务、完整 SDK 或线上服务审计。GitHub Actions 的公开文件白名单不会打包本说明。

## 参考与改写原则

参考 `/Users/chen/Desktop/guanwang/privacy.html` 和 `/Users/chen/Desktop/guanwang/agreement.html` 的政策类别和长文结构，重新按本项目整理中英文版本：

- 不使用旧产品“阅读阅多”、旧邮箱、旧日期和未确认的运营公司资料。
- 不套用参考网站列出的友盟、优量汇、穿山甲、快手广告 SDK；未确认它们属于本项目。
- 不照搬“不收集任何信息”“所有信息都不出境”“继续使用即授权一切处理”等绝对表述。
- 不套用无限制免责、无通知撤回权益或自动要求用户兜底赔偿的条款。
- 未虚构正式域名、公司地址、第三方日志保存天数、争议法院或全面合规保证。

## 已查看的产品依据

以下路径相对于 iOS 项目根目录，**只做了源码核对，没有编译 iOS App**。

| 事实 | 依据 |
| --- | --- |
| 导入自己的书、格式边界、联网语音、阅读 AI 与外部费用 | `官网/FEATURES.md` 及其列出的导入、语音、AI 实现路径 |
| 书籍文件、标题、进度、声音配置，以及可选参考录音和音频缓存进入同步包 | `lovelistenbooks/Sync/CloudSyncManifest.swift`、`CloudSyncBookPackageBuilder.swift` |
| iCloud / WebDAV / S3 是同步目标 | `lovelistenbooks/Sync/CloudSyncTransfer.swift` |
| 参考录音转写：系统支持时要求本地识别，否则可能联网使用 Apple 服务 | `lovelistenbooks/VoiceClone/SystemSpeechReferenceTranscriber.swift` |
| 麦克风与语音识别用途 | `lovelistenbooks-Info.plist` 的权限说明 |
| 会员购买、验证、恢复及本地权益缓存 | `lovelistenbooks/Membership/MembershipStore.swift`、`MembershipTier.swift`、`MembershipTransactionRecord.swift`、`lovelistenbooks/Manager/MemberManager.swift` |
| 月度、年度及永久选项存在于代码；上架状态、真实价格以商店为准 | `lovelistenbooks/Membership/MembershipTier.swift` |
| 自动续期产品为初级/高级的月度与年度；永久为一次性购买，不自动取消已有订阅 | `MembershipTier.swift`、`MembershipView.swift` 的订阅与永久说明 |
| 书架、同步、阅读器背景、自定义字体、AI、多语音、定时停止、多端书架及听书额度 | `MembershipAccess.swift`、`ReadingTimeManager.swift`、购买页权益对比 |
| 生命周期购买权益刷新 | `lovelistenbooks/Manager/MembershipLifecycleManager.swift` |
| 自动远程配置读取 GitLab/GitHub；当前配置请求不附书籍正文或录音 | `lovelistenbooks/Manager/RemoteCheckConfiguration.swift`、`RemoteCheckManager.swift` |
| 官网 localStorage 仅用于手动语言偏好；未加入外部广告、分析或字体脚本 | `官网/app.js`、`language.js`、`legal.js` 与 HTML 引入资源 |

这些核对不代表已经验证所有网络流量、所有插件、全部第三方 SDK、第三方实际保留/训练策略或线上商店配置。自定义 AI、TTS、插件、云端和工具服务应按最终上线配置再次检查。

## 正式发布前由维护者确认

- [ ] **运营主体**：按适用法律补充或核实实际开发/运营方名称、必要的地址与联系资料。当前正文只写“App 的开发与维护方”，未替你编造身份。
- [ ] **联系邮箱**：确认邮箱由你控制，能接收隐私请求、支持和投诉，并建立实际回复流程。
- [ ] **数据清单**：核对正式发布包的 SDK、网络请求、日志、权限、推送/诊断及后台服务。若新增广告、分析、自有账户服务器或数据用途，先更新政策和必要的授权流程。
- [ ] **同步与声音**：确认默认同步选项、录音及缓存范围、导出文件内容和实际删除入口；敏感录音或儿童数据须符合相应同意要求。
- [ ] **第三方及跨境**：核实实际服务商、处理地区、保留期限、训练用途、访问/删除方式及法律要求的出境安排。不要将本政策当作替服务商作保证。
- [ ] **购买**：核对 App Store Connect 中的产品类型、基础/专业等级、价格、周期、永久权益、试用和续订展示；确保购买界面与条款一致。
- [ ] **法律适用**：请有资质的专业人士根据实际运营主体、销售地区和服务方式复核，包括未成年人、隐私同意、消费者权利及 Apple 许可要求。
- [ ] **App Store 信息**：核实 App 隐私标签、权限用途和收集声明与实际行为一致；本次只完成官网页面，不代替 App 内同意流程或自定义 EULA 配置。
- [ ] **发布日期与网址**：正式发布时核对页首日期；用实际 HTTPS 网站地址填写商店/App 的政策链接，不使用本地预览地址或猜测域名。

## 内容维护

1. 更新 `scripts/legal-content.cjs`，同时调整中英文对应段落；公开链接与邮箱在 `site.config.js` 修改。
2. 执行 `node scripts/build-html.cjs` 和 `node scripts/build-legal.cjs`，生成首页静态链接和四份双语页面。
3. 运行 `node --test tests/site.test.cjs tests/legal.test.cjs`，以及两个生成器的 `--check`。
4. 预览中英文、章节锚点、手机阅读、联系邮箱与从首页进入/返回的流程，再发布。

四份法律页都保留了完整中英文静态正文：有 JavaScript 时只显示选中的语言；无 JavaScript 时同时显示两种语言。网站的语言控制不会改变 iOS 的系统语言或桌面 App 名称。


## 2026-10-12 会员与自动续费页面

新增 `membership-agreement.html` 与 `auto-renewal-agreement.html`，供 App Store 的自定义 EULA、会员协议和自动续费协议链接使用。页面按当前源码书写，不采用参考文案中的黄金/钻石会员、6 个月方案或具体人民币价格。

- 自动续期：`com.readio.basic`、`com.readio.basic1year`、`com.readio.pro`、`com.readio.pro1year`。
- 一次性购买：`com.readio.basic.lifetime`、`com.readio.pro.lifetime`。购买永久不会自动关闭已有续订。
- 免费/初级/高级额度以 `ReadingTimeManager.Limits` 和 `MembershipAccess` 为准，包括 5 本书、克隆声音 3/20/不限、本地克隆 1 小时/天与 4 小时/天、网络 TTS 8 小时/周、微软 TTS 4 小时/周、微软 Max 初级 4 小时/周、插件 TTS 2 小时/周与 8 小时/周。
- 协议明确会员不包含第三方 API 余额，也不把 App 内可选的第三方登录描述成 Readio 自己的账户系统。
- 正式价格、币种、试用和店面仍以 App Store 购买确认为准。发布前把实际 HTTPS 地址填入 App Store Connect，不要使用本地预览地址。
