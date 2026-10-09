/* Editorial source, not a runtime dependency. Keep both versions aligned.
 * Product facts and publication checks are documented in LEGAL_REVIEW.md.
 * {{tokens}} become reviewed links; arbitrary HTML is never interpolated.
 */
const p = text => ({ type: 'paragraph', text });
const list = items => ({ type: 'list', items });
const points = items => ({ type: 'points', items });
const section = (id, enTitle, zhTitle, en, zh) => ({ id, en: { title: enTitle, blocks: en }, zh: { title: zhTitle, blocks: zh } });

module.exports = {
  updated: '2026-10-09',
  ui: {
    en: {
      brand: 'Readio', back: 'Back to home', skip: 'Skip to policy content',
      navLabel: 'Legal documents', toc: 'On this page', tocLabel: 'Document sections',
      updated: 'Last updated', date: 'October 9, 2026', scope: 'App & website',
      privacy: 'Privacy policy', terms: 'Terms of use',
      contactHeading: 'A question about your data or these terms?',
      contactBody: 'Write to us for privacy requests, product support, or questions about your rights.',
      emailNote: 'Please do not include passwords, API keys, payment details, or unneeded book and voice files.',
      rights: 'Readio. All rights reserved.', top: 'Back to top',
      noJS: 'JavaScript is off. Both English and Chinese text are available below; document links and the contents list still work.',
    },
    zh: {
      brand: '爱听书', back: '返回首页', skip: '跳转到政策正文',
      navLabel: '法律与政策', toc: '本页目录', tocLabel: '文档章节',
      updated: '更新日期', date: '2026 年 10 月 9 日', scope: '适用于 App 与官网',
      privacy: '隐私政策', terms: '使用条款',
      contactHeading: '关于隐私或条款，还有疑问？',
      contactBody: '隐私请求、产品支持或权利相关问题，都可以通过邮件与我们联系。',
      emailNote: '请勿发送密码、API 密钥、支付资料，或与问题无关的书籍和录音文件。',
      rights: '爱听书 Readio. 保留所有权利。', top: '回到顶部',
      noJS: 'JavaScript 已关闭，下方同时展示中英文正文；页面链接与章节目录仍可使用。',
    },
  },
  links: {
    applePrivacy: { href: 'https://www.apple.com/legal/privacy/', en: 'Apple Privacy Policy', zh: 'Apple 隐私政策' },
    microsoftPrivacy: { href: 'https://privacy.microsoft.com/privacystatement', en: 'Microsoft Privacy Statement', zh: 'Microsoft 隐私声明' },
    githubPrivacy: { href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement', en: 'GitHub General Privacy Statement', zh: 'GitHub 隐私声明' },
    gitlabPrivacy: { href: 'https://about.gitlab.com/privacy/', en: 'GitLab Privacy Statement', zh: 'GitLab 隐私声明' },
    refund: { href: 'https://reportaproblem.apple.com/', en: 'Apple’s purchase support', zh: 'Apple 购买项目支持' },
    subscriptions: { href: 'https://apps.apple.com/account/subscriptions', en: 'Apple subscription management', zh: 'Apple 订阅管理' },
  },
  pages: {
    privacy: {
      file: 'privacy.html',
      en: {
        title: 'Privacy policy', eyebrow: 'YOUR LIBRARY. YOUR CHOICES.',
        description: 'What stays on your device, when services connect, and how you stay in control.',
        intro: 'Local-first does not mean never online. This policy separates on-device data from the information needed by cloud, voice, AI, purchase, and hosting services.',
        summary: [
          { icon: 'book', title: 'Start on your device', body: 'Your imported library, reading progress, and many settings are managed locally.' },
          { icon: 'cloud', title: 'Know each connection', body: 'Online features send relevant data to their providers. App checks can also make network requests.' },
          { icon: 'settings', title: 'Keep your choices clear', body: 'Manage permissions, connected services, local records, and cloud copies separately.' },
        ],
      },
      zh: {
        title: '隐私政策', eyebrow: '你的书库，你的选择',
        description: '哪些数据留在本机，何时会连接外部服务，以及你能如何管理它们。',
        intro: '本地优先，不等于从不联网。我们将本机数据与云服务、语音、AI、购买及托管服务所需的信息分开说明，帮助你做出知情选择。',
        summary: [
          { icon: 'book', title: '从本机书库开始', body: '导入的书籍、阅读进度和多项偏好设置，在你的设备上管理。' },
          { icon: 'cloud', title: '了解每一次连接', body: '联网功能会向对应服务发送所需数据；应用检查也可能发起网络请求。' },
          { icon: 'settings', title: '保留清楚的选择', body: '权限、已连接服务、本地记录与云端副本，需要分别管理。' },
        ],
      },
      sections: [
        section('scope', 'Scope and who we are', '适用范围与我们的角色', [
          p('This policy applies to 爱听书 / Readio (the “App”) and its official website. “We” refers to the App’s developer and maintainer. Contact us at {{contact}} about the processing described here.'),
          p('Readio is a tool for importing, managing, reading, and listening to books you are entitled to use, with optional cloud, voice, and AI features. It is not a built-in licensed book catalog. Third-party services you connect have their own privacy terms.'),
          p('We explain processing by purpose below. Where applicable law requires consent, a separate choice, or permission for a particular feature, that requirement is not replaced merely by your viewing this policy.'),
        ], [
          p('本政策适用于爱听书 / Readio（下称“App”）及其官方网站。“我们”指 App 的开发与维护方。有关本政策所述信息处理的问题，可通过 {{contact}} 联系我们。'),
          p('爱听书是用于导入、管理、阅读和收听你有权使用的书籍的工具，并提供可选的云服务、语音与 AI 功能；它不是内置正版书籍内容库。你连接的第三方服务另有各自的隐私规则。'),
          p('下文按用途说明数据处理。对于依法需要同意、单独选择或系统授权的功能，不会仅因你浏览本政策就视为已经取得相应授权。'),
        ]),
        section('local-data', 'Your library and on-device data', '书库与本机数据', [
          p('To provide reading and listening, the App keeps data such as imported files, book metadata and covers, bookmarks, reading positions, reading statistics, settings, and downloaded or generated audio caches on your device. Which records exist depends on the features you use.'),
          p('Voice profiles may contain reference recordings, reference text, voice parameters, and local model resources. Reading AI can create local conversations, summaries, retrieval indexes, and memory records.'),
          p('Service addresses, account authorization information, and API credentials that you configure are used to connect to the corresponding services. Protect your device and any exported configuration or backup. “Stored locally” does not mean that a system backup or a sync you enable can never copy that data elsewhere.'),
        ], [
          p('为提供阅读与听书功能，App 会在设备上保存导入的文件、书籍信息与封面、书签、阅读位置、阅读统计、偏好设置以及下载或生成的音频缓存等数据。实际产生的记录取决于你使用的功能。'),
          p('声音配置可能包含参考录音、参考文本、声音参数及本地模型资源。阅读 AI 可能生成本地对话、摘要、检索索引和记忆记录。'),
          p('你配置的服务地址、账户授权信息与 API 凭证用于连接相应服务。请保护设备以及导出的配置或备份。“保存在本机”不代表系统备份或你启用的同步永远不会将相应数据复制到其他位置。'),
        ]),
        section('connections', 'Cloud, imports, and online speech', '云服务、导入与网络语音', [
          points([
            ['Files and remote sources', 'Importing from Files/iCloud Drive, direct URLs, WebDAV, OPDS, S3, or a supported cloud provider requires access to the selected files or service. That provider may receive authentication details, file paths, search or listing requests, and download requests. Remote or partial-book access can continue requesting content while you read.'],
            ['Cloud synchronization', 'When you enable or run sync to iCloud, WebDAV, or S3, the sync package can include book files, titles, progress, voice settings, and, depending on the options, reference recordings and audio caches. Review the sync options before enabling it, especially those involving another person’s voice. Cloud copies follow the selected provider’s storage and access controls.'],
            ['Network TTS and plugins', 'Online speech synthesis sends the text to be spoken and necessary voice/request settings to the engine or endpoint being used. A plugin or custom endpoint may involve its own provider. System speech and local models have different resource and network requirements; not every voice is offline.'],
            ['Local Wi-Fi transfer', 'File transfer makes a local service available to devices that can reach it on the network. Use a trusted private network, check the address and recipient, and stop the transfer service when finished.'],
          ]),
          p('Check the operator, destination, privacy policy, and permissions of each service before connecting. Where you use Microsoft’s services, see {{microsoftPrivacy}}. User-defined endpoints are not all operated or reviewed by us.'),
        ], [
          points([
            ['文件与远程来源', '从“文件”/iCloud Drive、直链、WebDAV、OPDS、S3 或受支持云盘导入时，需要访问你选定的文件或服务。对应服务可能接收鉴权信息、文件路径、搜索或目录请求及下载请求。远程或部分下载的书籍在阅读过程中仍可能继续请求内容。'],
            ['云同步', '启用或执行 iCloud、WebDAV 或 S3 同步时，同步包可能包含书籍文件、书名、进度、声音设置，并根据选项包含参考录音与音频缓存。启用前请检查同步选项，尤其是涉及他人声音的内容。云端副本受所选服务的存储和访问规则约束。'],
            ['网络 TTS 与插件', '在线语音合成会将待朗读文本及必要的声音、请求设置发送给实际使用的引擎或接口。插件和自定义接口可能涉及其各自的服务商。系统语音和本地模型的资源、联网需求不同，并非所有声音都能离线使用。'],
            ['局域网 Wi-Fi 传输', '文件传输会向可访问该地址的局域网设备开放本地服务。请使用可信的私人网络，核对地址与接收方，并在完成后关闭传输服务。'],
          ]),
          p('连接前请了解对应服务的运营方、请求目标、隐私政策与权限。使用 Microsoft 服务时，可查阅 {{microsoftPrivacy}}。用户自定义接口并非都由我们运营或审核。'),
        ]),
        section('reading-ai', 'Reading AI and external models', '阅读 AI 与外部模型', [
          p('When you use book questions, chapter summaries, character analysis, role identification, or similar AI features, the App may send your question, relevant book excerpts, selected context, retrieved material, memory, and necessary tool results to the AI service you configure. The scope depends on the task and your settings.'),
          p('Local retrieval indexes do not by themselves mean every AI request stays local. If you enable remote embeddings, chapter excerpts may be sent to the embedding service. Enabled external tools may also contact their configured servers and receive the arguments needed for the tool call.'),
          p('Use the App’s sending-scope, tool-permission, index/memory, and usage controls to limit processing. Avoid sending sensitive or unauthorized material. The selected provider’s terms determine its retention, training use, region, and deletion process; we cannot promise that every external provider follows the same rules.'),
        ], [
          p('使用随书问答、章节摘要、人物分析、角色识别等 AI 功能时，App 可能将你的问题、相关书籍片段、选定的上下文、检索资料、记忆及必要的工具结果发送给你配置的 AI 服务。发送范围取决于任务与设置。'),
          p('本地检索索引不代表所有 AI 请求都在本机完成。启用远程向量服务时，章节片段可能被发送给对应服务；启用的外部工具也可能连接所配置的服务器，并接收调用所需参数。'),
          p('你可以使用 App 中的发送范围、工具权限、索引与记忆、用量等设置限制处理。请避免发送敏感或未经授权的资料。服务商对数据的保留、训练用途、处理地区与删除方式，由其规则决定；我们不能保证所有外部服务采用相同政策。'),
        ]),
        section('voice-permissions', 'Voice references and permissions', '参考声音与系统权限', [
          points([
            ['Microphone and voice files', 'Microphone access is requested when recording a voice reference. You may also import a recording and its reference text. Local voice cloning uses reference material and local model resources on the device; model downloads make network requests. Recordings may leave the device if you include them in cloud sync, export, or sharing.'],
            ['Speech recognition', 'If you ask the App to transcribe reference audio, it requests speech-recognition authorization. It requires on-device recognition where the system reports support; otherwise Apple’s recognition service may process audio over the network. Review {{applePrivacy}} and the system permission prompt.'],
            ['Files and local network', 'File selection, cloud authorization, and local-network functions require access appropriate to the action. The operating system may ask for permission. You can refuse or revoke permissions in system settings; the associated feature may then be unavailable. Ordinary text reading does not require recording your voice.'],
          ]),
          p('Only supply recordings and voices you have the right and any required consent to use. A recording can contain personal or sensitive information about the speaker; do not submit someone else’s recording without appropriate authorization.'),
        ], [
          points([
            ['麦克风与声音文件', '录制参考声音时会申请麦克风权限；你也可以导入录音及参考文本。本地声音克隆在设备上使用参考资料和本地模型资源，模型下载会产生网络请求。将录音纳入云同步、导出或分享时，录音可能离开设备。'],
            ['语音识别', '让 App 转写参考录音时，会申请语音识别授权。系统报告支持本地识别时，App 要求在设备上识别；否则可能由 Apple 的识别服务通过网络处理音频。请同时查看 {{applePrivacy}} 与系统权限提示。'],
            ['文件与本地网络', '文件选择、云账户授权及局域网功能需要与该操作相应的访问权限，操作系统可能弹出授权提示。你可以拒绝或在系统设置中撤回权限，相应功能可能因此无法使用。普通文本阅读不需要录制你的声音。'],
          ]),
          p('请仅提供你有权使用、且已取得必要同意的录音和声音。录音可能包含说话人的个人信息或敏感信息；未经适当授权，请勿提交他人的录音。'),
        ]),
        section('purchases-checks', 'Purchases and app checks', '购买与应用检查', [
          p('App Store purchases and restores are processed through Apple’s StoreKit. The App verifies and caches entitlement information such as product and transaction identifiers, purchase/expiry dates, and revocation or refund status to determine access. Apple processes payment-account information; the App does not need your full payment-card details.'),
          p('The App can automatically retrieve remote update/configuration and promotional information from configured GitLab/GitHub resources, including during its lifecycle checks. These requests expose normal connection information such as IP address, request time, and network headers to the hosting provider. The current configuration-file requests do not contain book text or reference recordings.'),
          p('Other network requests, including model downloads, also reveal normal connection information to their destinations. Hosting and Apple’s processing are described in {{githubPrivacy}}, {{gitlabPrivacy}}, and {{applePrivacy}}.'),
        ], [
          p('App Store 购买与恢复购买通过 Apple StoreKit 处理。App 会验证并缓存产品与交易标识、购买和到期时间、撤销或退款状态等权益信息，以判断功能访问权限。支付账户资料由 Apple 处理，App 不需要你的完整银行卡信息。'),
          p('App 会在生命周期检查等场景下，自动从已配置的 GitLab/GitHub 资源获取更新、配置及优惠相关信息。托管方会因此接触 IP 地址、请求时间、网络请求头等通常的连接信息。当前配置文件请求中不包含书籍正文或参考录音。'),
          p('模型下载等其他联网请求，也会向其目标服务暴露通常的连接信息。可分别查阅 {{githubPrivacy}}、{{gitlabPrivacy}} 与 {{applePrivacy}}，了解托管及 Apple 服务的数据处理规则。'),
        ]),
        section('website-contact', 'Website and email contact', '官网与邮件联系', [
          p('This static website stores your manual language choice in your browser’s localStorage under “love-listen-books.language”. This is a preference, not a book upload. The current website does not embed third-party advertising, analytics scripts, or remote fonts. You can remove its stored preference by clearing this site’s browser data.'),
          p('When the website is hosted on GitHub Pages, GitHub can process IP addresses and request information needed to deliver and secure the site. Its hosting logs are separate from the website’s language preference. See {{githubPrivacy}}.'),
          p('If you email {{contact}}, your email address, message, and any attachments are processed to respond and follow up. Supply only what is needed. Email providers also process the message under their own policies; do not send passwords, API keys, full payment details, or unnecessary recordings and book files.'),
        ], [
          p('本静态官网会使用浏览器 localStorage 中的“love-listen-books.language”记录你手动选择的语言。这是显示偏好，不是书籍上传。当前官网未嵌入第三方广告、统计追踪脚本或远程字体。清除此网站的浏览器数据即可移除该偏好。'),
          p('官网部署于 GitHub Pages 时，GitHub 可能处理提供网站内容与安全保障所需的 IP 地址及请求信息。托管日志与官网保存的语言偏好是不同的数据处理。详情请见 {{githubPrivacy}}。'),
          p('向 {{contact}} 发邮件时，你的邮箱地址、邮件正文及主动附上的附件会用于回复与跟进。请仅提供必要资料。邮件服务商也会依据其政策处理邮件；请勿发送密码、API 密钥、完整支付资料或不必要的录音、书籍文件。'),
        ]),
        section('security-sharing', 'Recipients, location, and security', '接收方、处理地区与安全', [
          p('Data is provided to the services needed for the actions described above, to recipients you choose when exporting or sharing, and where disclosure is required by applicable law or necessary for a lawful security response. A connected provider is not automatically the App’s developer or a service we control.'),
          p('Processing location depends on your device, system/cloud backups, hosting, and the service region of each provider. Some providers may process data outside your country or region. We do not promise that all data remains in one country; review the destination before connecting. Additional notices, safeguards, or consent must be provided where legally required.'),
          p('We use the App’s available platform security and access controls, but no device, network, or storage is risk-free. Use trusted HTTPS endpoints where available, restrict cloud access, keep devices updated, and revoke leaked credentials. A file hash or an HTTPS connection is not a promise of end-to-end encryption for your entire cloud backup.'),
        ], [
          p('数据会按上述功能需要提供给相应服务，在你导出或分享时提供给你选择的接收方，以及在适用法律要求或依法处置安全事件所必要的情况下提供。连接的服务商不当然等同于 App 开发方，也不一定受我们控制。'),
          p('处理地区取决于你的设备、系统或云端备份、托管服务，以及各服务商的服务区域。部分服务可能在你所在国家或地区之外处理数据。我们不承诺所有数据都留在同一个国家；连接前请检查处理目标。依法需要时，应提供额外告知、保护措施或取得相应同意。'),
          p('我们使用 App 可用的平台安全与访问控制机制，但设备、网络和存储均无法做到零风险。请优先使用可信的 HTTPS 接口、限制云存储权限、及时更新设备，并撤销泄露的凭证。文件校验值或 HTTPS 连接不代表整个云备份已具备端到端加密。'),
        ]),
        section('retention', 'Retention and removing copies', '保存期限与副本删除', [
          list([
            'Local library files and generated records remain as needed for the feature until you remove them through the available library, cache, voice, or AI management controls. Check each category: removing a book is not necessarily the same as clearing all related audio, AI, or backup data.',
            'Cloud sync packages, exports, system backups, and data already sent to a provider are separate copies. Deleting a local file, disconnecting an account, or uninstalling the App does not necessarily delete those copies, revoke provider tokens, remove every system-held credential, or cancel a subscription.',
            'Use your cloud provider and device backup settings to remove remote copies, and contact an AI/voice provider for data already processed by it. Retention of provider logs and purchase records follows that provider’s rules and applicable legal obligations.',
            'Correspondence handled by us is retained only as needed to resolve and follow up on the request, protect legitimate rights, or meet legal obligations; we will delete or de-identify it when that need ends, subject to required retention.',
          ]),
        ], [
          list([
            '本地书库文件与生成记录会按功能需要保存，直到你通过可用的书库、缓存、声音或 AI 管理入口移除。请逐项检查：删除一本书不一定等于清除全部相关音频、AI 记录或备份。',
            '云同步包、导出文件、系统备份及已发送给服务商的数据属于不同副本。删除本地文件、断开账户或卸载 App，不一定会删除这些副本、撤销服务商令牌、移除全部系统保存的凭证，也不会自动取消订阅。',
            '请在云服务与设备备份设置中删除远端副本；已由 AI 或语音服务处理的数据，请按该服务的流程申请删除。服务商日志和购买记录的保存受其规则与适用法律义务约束。',
            '由我们处理的联系邮件，仅在解决与跟进请求、保护正当权益或履行法律义务所需的期限内保留；相关需要结束后，将删除或去标识化，但依法需要继续保留的除外。',
          ]),
        ]),
        section('your-choices', 'Your choices and rights', '你的选择与权利', [
          p('You can manage local records, stop using online engines or AI, adjust AI sending/tool settings, disconnect configured services, and withdraw system permissions. Disabling a feature stops its future use but does not undo processing already completed or necessarily stop separate app update/purchase checks.'),
          p('Depending on applicable law, you may request access, correction, deletion, a copy or portability, restriction of processing, or withdrawal of consent, and may raise a privacy complaint. Email {{contact}} with the request type and enough information to locate the relevant record. We may ask for proportionate verification, not unnecessary identity documents.'),
          p('We will respond within applicable legal time limits. Where a record is held only on your device or by a provider we do not control, we will explain the relevant steps or limits rather than imply that we can directly access or delete it. Your right to contact an appropriate regulator is not restricted.'),
        ], [
          p('你可以管理本地记录、停用联网引擎或 AI、调整 AI 发送范围和工具权限、断开已配置服务，并撤回系统授权。停用功能会停止之后对该功能的使用，但不会撤销已完成的处理，也不一定停止独立的应用更新或购买检查。'),
          p('在适用法律规定的范围内，你可以请求访问、更正、删除、获取副本或转移、限制处理、撤回同意，或提出隐私投诉。请向 {{contact}} 说明请求类型，并提供定位相关记录所需的信息。我们可能要求适当的核验，但不会要求与请求无关的身份证明。'),
          p('我们会在适用法律要求的时限内回复。对于仅存于你的设备或我们无法控制的第三方的数据，会说明操作方式或限制，不会声称能够直接访问或删除。你向适当监管机构反映问题的权利不受限制。'),
        ]),
        section('children', 'Children and guardians', '未成年人及监护人', [
          p('Minors should review the use of this App, purchases, recordings, and external services with a parent or guardian. For a child under 14, or a higher age where local law requires it, obtain the guardian’s required consent before providing personal information or using features that transmit it.'),
          p('Do not submit a child’s recording or other sensitive information without proper authorization. If a guardian believes that a child’s information was improperly provided to us, contact {{contact}} so that we can assess and handle the request under applicable law.'),
        ], [
          p('未成年人应在父母或其他监护人指导下了解 App 使用、购买、录音与外部服务。对于未满 14 周岁儿童，或当地法律规定的更高年龄范围，在提供个人信息或使用会传输这些信息的功能前，应取得法律要求的监护人同意。'),
          p('未经适当授权，请勿提交儿童录音或其他敏感信息。监护人如认为儿童信息被不当提供给我们，可通过 {{contact}} 联系，以便依法核实和处理。'),
        ]),
        section('updates-contact', 'Policy updates and contact', '政策更新与联系', [
          p('We may revise this policy as features or legal requirements change and will update the date above. Material changes will be brought to your attention through an appropriate website or in-app notice; where a new processing activity requires consent, we will seek it as required.'),
          p('For questions or privacy requests, contact {{contact}}. For the rules on content, voices, AI, and purchases, also read the {{terms}}.'),
        ], [
          p('我们可能因功能或法律要求变化修订本政策，并更新页首日期。对于重大变化，会通过适当的官网或 App 内提示予以告知；新的处理活动依法需要同意时，将按要求取得同意。'),
          p('政策疑问或隐私请求，请联系 {{contact}}。关于内容、声音、AI 及购买的使用规则，请同时阅读 {{terms}}。'),
        ]),
      ],
    },
    terms: {
      file: 'terms.html',
      en: {
        title: 'Terms of use', eyebrow: 'MORE STORY. CLEARER TERMS.',
        description: 'A clear agreement for your books, your voices, and the services you choose.',
        intro: 'Readio provides reading and listening tools, not ownership of book or voice rights. These terms explain responsible use, optional services, purchases, and the rights you keep.',
        summary: [
          { icon: 'book', title: 'Bring books you can use', body: 'Import and enjoy content you own or are authorized to access.' },
          { icon: 'voice', title: 'Respect every voice', body: 'Use authorized recordings and check AI-generated results before relying on them.' },
          { icon: 'receipt', title: 'Understand your purchase', body: 'Review membership benefits, renewal terms, and any separate provider charges.' },
        ],
      },
      zh: {
        title: '使用条款', eyebrow: '多一点故事，少一点疑惑',
        description: '关于你的书籍、声音，以及所选择服务的一份清楚约定。',
        intro: '爱听书提供阅读与听书工具，不代表授予书籍或声音的权利。以下条款说明合理使用、可选服务、购买规则，以及你依法享有的权利。',
        summary: [
          { icon: 'book', title: '导入你有权使用的书', body: '请使用自己拥有或已获授权访问的内容。' },
          { icon: 'voice', title: '尊重每一个声音', body: '使用已获授权的录音，采信 AI 结果前进行核查。' },
          { icon: 'receipt', title: '了解每一项购买', body: '确认会员权益、续订规则与服务商的独立费用。' },
        ],
      },
      sections: [
        section('scope', 'About this agreement', '关于本协议', [
          p('These terms govern your use of 爱听书 / Readio (the “App”) and its official website. “We” refers to the App’s developer and maintainer, reachable at {{contact}}. Please read these terms before using the service; if you do not agree, do not use the affected service.'),
          p('Personal-information processing is explained separately in the {{privacy}}. Agreement to these terms does not replace a consent or permission required by privacy law. App Store purchases and connected third-party services are also subject to their applicable rules.'),
        ], [
          p('本条款适用于你使用爱听书 / Readio（下称“App”）及其官方网站。“我们”指 App 的开发与维护方，联系邮箱为 {{contact}}。请在使用前阅读；如不同意，请勿使用相关服务。'),
          p('个人信息处理另见 {{privacy}}。同意本条款不替代隐私法律所要求的同意或授权。App Store 购买及连接的第三方服务，还应遵守各自适用的规则。'),
        ]),
        section('service', 'What the App provides', 'App 提供什么', [
          p('Readio offers tools for importing and managing your own books, reading, speech synthesis, reading progress, voice configuration, and optional cloud and AI features. It does not grant access to an included licensed catalog or promise that a remote source is lawful or permanently available.'),
          p('Capabilities vary by file, device, system, resources, and version. Current workflows include TXT/EPUB reading and listening and conversion on MOBI import. PDF import currently saves the source file; complete PDF text extraction, reading, and speech are not promised. Remote or partial access is not the same as a complete offline copy.'),
          p('Offline listening requires a suitable engine and its resources. Some features require network access, provider configuration, membership, or usage allowances. Review the current feature description and purchase screen rather than assuming every listed service is free or offline.'),
        ], [
          p('爱听书提供导入与管理个人书籍、阅读、语音合成、阅读进度、声音配置，以及可选云服务和 AI 等工具。它不代表附带已授权内容库，也不保证某个远程来源合法或永久可用。'),
          p('具体能力受文件、设备、系统、资源和版本影响。当前流程包括 TXT/EPUB 阅读听书及 MOBI 导入转换；PDF 导入目前以保存原始文件为主，不承诺完整 PDF 文本提取、阅读与朗读。远程或部分访问不等于已拥有完整离线副本。'),
          p('离线听书需要适用的引擎及其资源。部分功能需要联网、配置服务商、会员资格或可用额度。请以当前功能说明和购买页面为准，不要将所有列出的服务理解为免费或离线可用。'),
        ]),
        section('content-rights', 'Books, content, and intellectual property', '书籍、内容与知识产权', [
          p('You must have the rights or authorization needed to import, download, read, synthesize, store, sync, or share the content you use. Connecting a URL, catalog, cloud drive, or other source does not create that authorization. Do not bypass access controls or use the App to infringe copyright or other rights.'),
          p('You retain the rights you already hold in your content. The App needs to process it to perform your chosen actions, such as local parsing, generating audio, syncing, or requesting an AI response. This does not grant us a general right to publicly distribute your books or recordings. Third-party processing is described in the {{privacy}}.'),
          p('The App’s software, design, and branding are protected by applicable rights. Third-party libraries, models, and voice resources keep their respective licenses. Use or redistribution of them must follow those licenses; a membership does not automatically provide commercial rights to every model, voice, or book.'),
        ], [
          p('对导入、下载、阅读、合成、存储、同步或分享的内容，你应拥有所需权利或授权。连接网址、目录、云盘等来源本身不会产生该授权。请勿绕过访问控制，或使用 App 侵犯著作权及其他权利。'),
          p('你保留对所提供内容原本享有的权利。App 需要按你的选择处理内容，例如本地解析、生成音频、同步或请求 AI 回答；这不代表授予我们任意公开传播书籍或录音的权利。第三方处理详见 {{privacy}}。'),
          p('App 的软件、设计与品牌受相关权利保护。第三方库、模型与声音资源保留各自的许可要求，使用和分发应遵守对应许可；购买会员不自动赋予对所有模型、声音或书籍的商业使用权。'),
        ]),
        section('responsible-use', 'Responsible use and credentials', '合理使用与凭证安全', [
          list([
            'Do not use the App to infringe privacy, harass, defraud, distribute unlawful content, attack services, or interfere with others’ access.',
            'Only connect accounts, endpoints, plugins, and tools you are authorized to use. You are responsible for choosing trustworthy configurations and following provider limits and terms.',
            'Protect passwords, access tokens, API keys, backups, and your device. Revoke a credential promptly if exposed; removing it from the App does not necessarily revoke it at the provider.',
            'Use Wi-Fi transfer only on a network you trust, verify the destination, and close the service when finished. Do not publicly expose local transfers or private files.',
          ]),
        ], [
          list([
            '请勿使用 App 侵犯隐私、骚扰、诈骗、传播违法内容、攻击服务或妨碍他人正常访问。',
            '仅连接你有权使用的账户、接口、插件及工具，并选择可信配置，遵守服务商的限制和条款。',
            '请妥善保护密码、访问令牌、API 密钥、备份与设备。凭证泄露后应及时撤销；从 App 中移除不一定代表服务商端已撤销。',
            'Wi-Fi 传输应在可信网络中使用，确认接收目标并在结束后关闭；不要将本地传输或私人文件暴露给公众。',
          ]),
        ]),
        section('voice-rights', 'Voice cloning and generated speech', '声音克隆与合成语音', [
          p('Before recording, importing, cloning, or sharing a voice, obtain the rights and consent required from the speaker and any recording rights holder. A publicly available recording is not necessarily permission to clone the speaker. Respect the authorized purpose, scope, and withdrawal of that consent.'),
          p('Do not use cloned or generated speech for fraud, deceptive impersonation, identity-verification bypass, harassment, or other unlawful purposes. Disclose that audio is synthetic where required by law, a platform, or the circumstances, and do not imply an endorsement you do not have.'),
          p('You must check the applicable voice/model license before publishing or commercial use. Local cloning, network TTS, transcription, and synced voice references have different technical and privacy implications. Quality, pronunciation, and availability can vary; no perfect reproduction of a person’s voice is promised.'),
        ], [
          p('录制、导入、克隆或分享声音前，应获得说话人及录音权利人所需的授权与同意。公开可获取的录音不当然代表允许克隆该声音。请尊重授权的用途、范围与同意撤回。'),
          p('不得将克隆或合成语音用于诈骗、误导性冒充、绕过身份验证、骚扰或其他违法用途。在法律、平台规则或具体场景要求时，应说明音频为合成内容，不得虚构他人的认可或背书。'),
          p('发布或商业使用前，请核对声音及模型的许可。本地克隆、网络 TTS、转写与参考录音同步有不同的技术和隐私影响。音质、发音及可用性可能变化，不承诺能够完美复现某个人的声音。'),
        ]),
        section('ai-use', 'AI output, tools, and provider costs', 'AI 输出、工具与服务费用', [
          p('AI-generated summaries, answers, character relationships, and role labels may be wrong, incomplete, or contain spoilers. They are reading aids, not verified facts or professional advice. Check the source material and use your own judgment before relying on or sharing a result.'),
          p('Only send material you are entitled to provide to the model or tool. Review sending scope and permissions before enabling external tools or remote embeddings. The availability and rules of a model are determined in part by its provider.'),
          p('Membership access to an AI feature does not necessarily include the provider’s API fees. AI, voice, storage, bandwidth, and other external services may charge separately. App token counts, quotas, and budget estimates are aids, not a guarantee of the provider’s final bill; monitor limits in the provider account too.'),
        ], [
          p('AI 生成的摘要、回答、人物关系和角色标签可能有误、不完整或包含剧透。它们是阅读辅助，不是已核实事实或专业意见。依赖或分享前，请核查原文并自行判断。'),
          p('仅向模型或工具发送你有权提供的资料。启用外部工具或远程向量服务前，应检查发送范围与权限。模型是否可用及其使用规则，部分取决于服务商。'),
          p('会员对 AI 功能的访问权限不一定包含服务商的 API 费用。AI、语音、存储、流量等外部服务可能另行收费。App 中的令牌统计、额度和预算估算仅用于辅助，不保证与服务商最终账单一致；也请在服务商账户中管理限额。'),
        ]),
        section('membership', 'Membership, renewal, and refunds', '会员、续订与退款', [
          points([
            ['Your purchase', 'The App may offer Basic/Pro membership with monthly, yearly, or lifetime options. Available products, prices, currency, taxes, benefits, and any trial are those shown in the App Store purchase confirmation. A lifetime option, when offered, is a non-recurring purchase of the stated benefits, not unlimited third-party services, API credit, or rights to all future separately sold products.'],
            ['Automatic renewal', 'If you purchase an auto-renewing subscription, it renews under Apple’s displayed terms until canceled. To avoid the next renewal, cancel at least 24 hours before the current period ends, subject to Apple’s confirmation and applicable rules. Manage it in iOS Settings → your Apple Account → Subscriptions, or {{subscriptions}}. Deleting the App does not cancel it.'],
            ['Restore and access', 'Use Restore Purchases with the purchasing Apple Account where the product supports it. Apple’s verified transactions, expiration, revocation, and refund status determine access. Canceling renewal normally preserves access for the remaining paid period, unless a refund, revocation, or another applicable rule changes it.'],
            ['Refunds and separate fees', 'For App Store refunds or billing issues, use {{refund}}; eligibility follows Apple’s process and applicable law. Contact us for App entitlement problems. External AI, TTS, or cloud charges must be addressed with the corresponding provider. Nothing here removes a mandatory refund or other consumer right.'],
          ]),
        ], [
          points([
            ['购买内容', 'App 可能提供基础/专业会员及月度、年度、永久等选项。实际上架产品、价格、币种、税费、权益和试用，以 App Store 购买确认界面为准。若提供永久选项，它是对所列权益的非续订式购买，不代表无限额第三方服务、API 余额或所有未来单独销售产品的权利。'],
            ['自动续订', '购买自动续期订阅后，将按 Apple 展示的规则续订，直至取消。如不希望继续续订，请至少在当前周期结束前 24 小时取消，具体以 Apple 的确认和适用规则为准。可在 iOS“设置 → Apple 账户 → 订阅”或 {{subscriptions}} 中管理。删除 App 不会取消订阅。'],
            ['恢复与权益', '产品支持恢复时，可使用购买时的 Apple 账户执行“恢复购买”。访问权限以 Apple 验证的交易、到期、撤销及退款状态为依据。取消续订通常不影响剩余已付周期内的权益，但退款、撤销或其他适用规则另有处理的除外。'],
            ['退款与独立费用', 'App Store 退款或扣费问题请通过 {{refund}} 处理，资格依 Apple 流程及适用法律决定。App 内权益异常可联系我们。外部 AI、TTS 或云服务费用需向对应服务商处理。本条款不排除依法必须保障的退款或其他消费者权利。'],
          ]),
        ]),
        section('availability-backups', 'Availability and your backups', '服务可用性与备份', [
          p('Remote sources, cloud providers, APIs, system services, and models may change, charge differently, restrict access, or stop operating. We cannot guarantee that every third-party integration or format will always work. We will exercise reasonable care in maintaining the App and handling issues within our control.'),
          p('Keep independent backups of important books, voice references, and settings. Check sync scope and destination before uploading or restoring: synchronization can create additional copies or replace records. Do not treat a partial remote-book cache as your only archive.'),
          p('You are responsible for reasonable care with your device and configuration; this does not excuse us from responsibility for our own conduct where applicable law imposes it.'),
        ], [
          p('远程来源、云服务、API、系统服务和模型可能调整规则、费用、访问限制或停止运营。我们无法保证每个第三方连接或格式始终可用，但会对 App 维护及控制范围内的问题尽合理注意义务。'),
          p('请为重要书籍、参考录音和配置保留独立备份。上传或恢复前核对同步范围与目标：同步可能产生额外副本或替换记录。不要将部分下载的远程书籍缓存视为唯一存档。'),
          p('你应对设备与配置采取合理保护措施，但这不会免除我们依法应对自身行为承担的责任。'),
        ]),
        section('privacy', 'Privacy and support', '隐私与支持', [
          p('The {{privacy}} explains local storage, cloud sync, network speech, AI, permissions, app checks, and the website. Review it before sending personal information or another person’s material to a service.'),
          p('For support, entitlement issues, or a rights complaint, email {{contact}} with the relevant App version, a concise description, and only necessary supporting information. Do not email passwords, API keys, or unrelated private files.'),
        ], [
          p('{{privacy}} 说明了本地存储、云同步、网络语音、AI、权限、应用检查及官网的数据处理。向服务发送个人信息或他人资料前，请先了解相关内容。'),
          p('产品支持、会员权益异常或权利投诉，请向 {{contact}} 提供相关 App 版本、简要问题说明与必要的佐证资料。请勿通过邮件发送密码、API 密钥或无关私人文件。'),
        ]),
        section('changes-ending', 'Changes, suspension, and stopping use', '变更、暂停与停止使用', [
          p('We may update features or these terms for product, security, or legal reasons. We will update the date and provide an appropriate notice for material changes. If a change materially affects paid benefits, we will handle existing purchasers’ rights as required by the purchase terms and applicable law, rather than treat a general update as a waiver of those rights.'),
          p('We may restrict an affected feature where reasonably necessary to address unlawful use, a serious security risk, or a legal requirement. Where practical and lawful, we will explain the reason and available remedy. This is not an unrestricted right to withdraw paid benefits without a lawful basis.'),
          p('You may stop using the App at any time. Back up needed data, manage cloud copies, revoke provider authorizations, and cancel any renewal separately. Ending use does not itself erase third-party records or settle existing payment obligations.'),
        ], [
          p('我们可能基于产品、安全或法律原因更新功能或条款，并更新日期；重大变化会给予适当提示。若实质影响已付费权益，将按购买约定与适用法律处理已有用户的权利，不会将一般更新视为你已放弃这些权利。'),
          p('为处理违法使用、重大安全风险或法律要求，可能在合理必要范围内限制相关功能。在可行且合法的情况下，会说明原因及可用的解决方式。这不构成无合法依据任意撤回已付费权益的权利。'),
          p('你可以随时停止使用。请先备份所需数据、管理云端副本、撤销服务商授权，并另行取消续订。停止使用本身不会删除第三方记录，也不会自动结清已产生的付款义务。'),
        ]),
        section('rights-disputes', 'Responsibility and consumer rights', '责任与消费者权利', [
          p('Software and external services can experience interruptions and errors. We do not promise uninterrupted operation, perfect AI or speech output, or suitability for every file and device. Each party’s responsibility for loss is determined by applicable law and the circumstances, including its own conduct.'),
          p('Nothing in these terms excludes liability that cannot lawfully be excluded, limits a mandatory warranty, or removes your statutory consumer, privacy, refund, or other rights. No blanket waiver of responsibility or automatic obligation to indemnify us is imposed by these terms.'),
          p('If a dispute arises, contact {{contact}} so we can try to resolve it. This does not prevent you from contacting a competent authority or bringing a claim in a court with lawful jurisdiction. Mandatory protections under the laws applicable to you remain available.'),
        ], [
          p('软件与外部服务可能出现中断或错误。我们不承诺永不中断、AI 或语音结果完全准确，或适用于所有文件和设备。各方对损失的责任应依据适用法律和具体情况，包括各自行为确定。'),
          p('本条款不排除依法不得排除的责任，不限制强制性保障，也不剥夺你法定的消费者、隐私、退款及其他权利；不设置一概免责或要求你自动承担对我们赔偿义务的条款。'),
          p('发生争议时，可先联系 {{contact}} 以便尝试解决。这不影响你向主管机构反映问题，或向依法具有管辖权的法院主张权利。对你适用法律中的强制性保护继续有效。'),
        ]),
        section('general-contact', 'Guardians, language, and contact', '监护、语言与联系', [
          p('If you are a minor, review these terms with your parent or guardian and obtain any consent required for purchases, recordings, personal information, and external services. Do not assume that access to the App makes every connected service suitable for your age.'),
          p('The English and Chinese versions are intended to describe the same rules. If wording is unclear or differs, contact us for clarification; mandatory legal rights are not reduced by a translation. If a provision is unenforceable, the remaining provisions continue to the extent allowed by law.'),
          p('Questions about these terms or the App: {{contact}}. Related document: {{privacy}}.'),
        ], [
          p('未成年人应与父母或其他监护人共同阅读本条款，并对购买、录音、个人信息及外部服务取得所需同意。能够使用 App 不代表每个连接的服务都适合你的年龄。'),
          p('中英文版本旨在表达相同规则。如表述不清或出现差异，请联系我们说明；翻译不会减损强制性法律权利。某项条款不可执行时，其余条款在法律允许的范围内继续适用。'),
          p('关于本条款或 App 的问题，请联系 {{contact}}。相关文档：{{privacy}}。'),
        ]),
      ],
    },
  },
};
