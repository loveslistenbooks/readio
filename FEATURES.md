# 功能文案校对记录

校对日期：2026-10-08（Asia/Shanghai）。

本页用于维护官网文案，不作为服务商保证或 App 全功能验收报告。依据当前工程中的实际入口与实现、已提供的中英文商店图进行校对；本轮没有修改或运行 iOS 工程，也没有连接用户的云盘、AI 或 TTS 凭据做联调。

## TTS：先解释用途，再解释来源

官网用语：TTS 是把书里的文字转换成语音；可选择系统、网络、本地克隆和兼容插件等来源。AI 辅助分析旁白、对白与角色后，仍可检查结果和调整声音分配。

源码依据（以下路径相对于 iOS 项目根目录）：

- `lovelistenbooks/VoiceLibrary/VoiceLibraryView.swift`：系统、Azure、AzureMax、网络、插件、多角色入口，以及按会员权益显示的可用状态。
- `lovelistenbooks/Reader/ManhuadashiCore/Listen/TTSSourceSelection.swift`：system / azure / network / hshan / azureMax / pluginTTS / localClone 的角色声音选择模型。
- `lovelistenbooks/VoiceClone/VoiceCloneLibraryView.swift`、`lovelistenbooks/VoiceClone/NativeCoreMLZipVoiceSynthesizer.swift`：本地声音管理及合成实现。
- `lovelistenbooks/AI/BookAIWorkspaceView.swift`、`lovelistenbooks/AI/BookAIListeningRolesView.swift`：所选章节的角色识别、角色查看与配置。
- `lovelistenbooks/Membership/MembershipAccess.swift`：AI 会员访问以及部分语音的会员/时长/额度约束。

不承诺：所有声音离线、无限免费、所有设备达到实时合成、任意录音都能获得相同音质、角色识别绝对准确。克隆需要录音授权；网络与插件能力以用户配置和服务商条件为准。

官网配音段落是原创文字的静态示意，明确标注“非试听”，不会调用浏览器语音冒充 App 的 TTS 效果。真实声音库图通过旁边的截图链接单独查看。

## 导入：入口存在不等于已经完整实现

源码依据：

- `lovelistenbooks/Import/ImportCenterView.swift`：本地、iCloud、WebDAV、OPDS、Wi-Fi、直链及云盘入口。
- `lovelistenbooks/Import/WiFiTransferView.swift`、`lovelistenbooks/Import/BookImportSheets.swift`：局域网传书和远程来源。
- `lovelistenbooks/CloudStorageManager/CredentialCloudServices.swift`：WebDAV、OPDS、S3 的配置、浏览及下载实现。
- `lovelistenbooks/CloudStorageManager/OneDriveService.swift`、`BaiduPanCookieService.swift`、`AlipanCookieService.swift`、`QuarkService.swift`、`Pan115Service.swift`、`Pan123Service.swift`：对应云盘实现。
- `lovelistenbooks/Library/LocalBookImporter.swift`、`LocalBookFormatParser.swift`：TXT / EPUB 等解析、MOBI 转换导入，以及 PDF 原文件保存分支。

### 本轮特意收紧的边界

1. **SMB 不列入可用来源清单。** 当前 `SMBCredentialService.listFiles` 和 `downloadFile` 会抛出未支持的错误；不能因为导入中心显示了入口就宣传完整支持。真实截图中可能仍有该入口，官网文字清单只列已找到实现的来源。
2. **PDF 与 TXT / EPUB 不同等宣传。** 当前导入分支保存原文件并使用待接入解析的占位文本，因此官网明确标注 PDF 可导入保存，不把完整阅读、解析和 TTS 宣传为已支持；听读建议从 TXT / EPUB 开始。
3. **MOBI 说明“转换导入”。** 不承诺与原文件排版逐像素一致，也不承诺绕过 DRM。
4. 云盘需要实际配置或授权，外部 API 和登录状态可能变化；OPDS 提供目录入口，不意味着应用自带授权书籍。
5. 只宣传已下载且支持解析的本地内容可以离线阅读，不把远程 EPUB 按需读取等同于整本离线可用。

## AI：用户成果优先，进阶术语后置

一级内容：随书问答、章节/剧情梳理、人物/关系/设定/伏笔、听书角色。

二级折叠内容：本地检索与记忆、模型路由、工具权限、Skill/MCP、发送范围、用量与预算。

源码依据：

- `lovelistenbooks/AI/BookAIWorkspaceView.swift`：选择章节和资料类型、逐项生成、人物关系图、伏笔看板、时间线及角色识别。
- `lovelistenbooks/AI/BookAINarrativeInsightsView.swift`：剧情、人物、关系与时间线视图。
- `lovelistenbooks/AI/AIContextManagementView.swift`：选中文本、章节、检索片段与记忆进入上下文。
- `lovelistenbooks/AI/AIRAGIndexCenterView.swift`：本地检索索引，默认本地 hash 向量以及可选远程 embeddings；开启远程向量服务可能发送章节片段。
- `lovelistenbooks/AI/AISettingsCenterView.swift`：服务配置、发送范围、工具权限及各管理中心入口。
- `lovelistenbooks/AI/AICostControlCenterView.swift`：基于本地估算和服务端用量的成本控制。
- `lovelistenbooks/Membership/MembershipAccess.swift`：AI 访问属于会员权益，不能宣传“完全免费”。

不承诺：无需配置即可使用全部 AI、自动分析任意整本书且不会剧透、绝对正确的回答、所有操作都在本地完成、绝不向外部服务发送内容、费用估算等于账单。

官网上的 AI 句子是**示例任务**，不是伪造的实际模型回复。真实 AI 设置图由单独的截图入口提供。

## 维护原则

- 同时修改中英文 `content.js`，再运行 HTML 生成和测试。
- 新能力先确认运行路径和限制，再加入文案；不要只根据菜单、模型类型或计划文档宣称可用。
- 若后续补齐 PDF 或 SMB，先在 App 中验证，再更新这里的依据、官网边界和对应回归测试。
- 不加入真实 API Key、Cookie、网盘账号、语音样本或用户书籍；公开站点只包含静态内容与已提供的展示素材。
