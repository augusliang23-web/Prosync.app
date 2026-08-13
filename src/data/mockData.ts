import { Project, ExecutiveBriefing } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-001',
    code: 'PRJ-2026-01',
    name: 'AI 智慧客服與知識庫升級',
    department: '研發部',
    leadPm: '陳雅婷 (Sarah Chen)',
    strategicPriority: '核心產品升級',
    targetCompletionDate: '2026-09-30',
    currentProgress: 78,
    health: 'ON_TRACK',
    currency: 'TWD',
    totalBudget: 3500000,
    spentBudget: 2450000,
    description: '整合 LLM 與企業內部 Knowledge Base，建立第一線智慧客服機器人與內部專家檢索系統，預期降低 40% 客服人力負擔。',
    keyDeliverables: [
      { id: 'del-101', title: '完成向量資料庫 Schema 設計與檢索測試', dueDate: '2026-05-15', completed: true },
      { id: 'del-102', title: '完成內部專家 Knowledge Agent Beta 測試', dueDate: '2026-07-10', completed: true },
      { id: 'del-103', title: '對外 AI 客服網頁與 LINE 官方帳號串接', dueDate: '2026-08-20', completed: false },
      { id: 'del-104', title: '全公司各單位維運訓練與正式上線', dueDate: '2026-09-30', completed: false }
    ],
    createdAt: '2026-04-01',
    updatedAt: '2026-07-28',
    updates: [
      {
        id: 'upd-102',
        date: '2026-07-28',
        pmName: '陳雅婷 (Sarah Chen)',
        progress: 78,
        status: 'ON_TRACK',
        keyAchievements: [
          '完成第二階段內部專家 Agent 封測，滿意度問卷得分 4.6/5.0',
          '將模型推論延遲由原本的 1.8 秒降至 0.65 秒',
          '完成資安紅隊滲透測試，符合 ISO 27001 規範'
        ],
        risksAndBlockers: '無重大風險。僅需持續追蹤供應商 Token 使用費率比率。',
        managementAssistanceNeeded: '暫無，團隊進度順暢。',
        nextMilestones: [
          '展開跨部門測試（客服部、行銷部）',
          '進行 LINE Bot Webhook 高併發壓測'
        ],
        budgetVarianceNote: '費用在預算範圍內控制良好，已消耗 70%。'
      },
      {
        id: 'upd-101',
        date: '2026-07-14',
        pmName: '陳雅婷 (Sarah Chen)',
        progress: 68,
        status: 'ON_TRACK',
        keyAchievements: [
          '完成了 12,000 份歷史 FAQ 文件清理與 embedding 匯入',
          '建立自動化評測集 (RAG Evaluation Benchmark)'
        ],
        risksAndBlockers: '部份舊PDF檔案解析精度不足，需進行 OCR 微調',
        managementAssistanceNeeded: '請營運部協助審核常見客服問答集定稿',
        nextMilestones: ['完成客服 UI/UX 第二版修正']
      }
    ]
  },
  {
    id: 'prj-002',
    code: 'PRJ-2026-02',
    name: '核心 ERP 與微服務架構重構',
    department: 'IT資訊部',
    leadPm: '王大衛 (David Wang)',
    strategicPriority: '資安與基建',
    targetCompletionDate: '2026-11-15',
    currentProgress: 32,
    health: 'DELAYED',
    currency: 'TWD',
    totalBudget: 6000000,
    spentBudget: 2800000,
    description: '將歷史 Monolith 舊 ERP 系統分階段拆解為 Docker/K8s 微服務，升級資料庫並建置實時 ETL pipeline。',
    keyDeliverables: [
      { id: 'del-201', title: '完成雲端 K8s 基礎架構建置與 CI/CD pipeline', dueDate: '2026-05-30', completed: true },
      { id: 'del-202', title: '舊 Oracle DB 移轉至 Cloud SQL PostgreSQL', dueDate: '2026-07-15', completed: false },
      { id: 'del-203', title: '財務與庫存模組微服務開發', dueDate: '2026-09-10', completed: false },
      { id: 'del-204', title: '全系統併行平行運作驗證 (Parallel Run)', dueDate: '2026-11-01', completed: false }
    ],
    createdAt: '2026-03-15',
    updatedAt: '2026-07-29',
    updates: [
      {
        id: 'upd-202',
        date: '2026-07-29',
        pmName: '王大衛 (David Wang)',
        progress: 32,
        status: 'DELAYED',
        keyAchievements: [
          '完成驗證 15 年歷史關聯資料之清理作業',
          '基礎 K8s 集群已通通過資安漏洞掃描'
        ],
        risksAndBlockers: '舊 Oracle 預存程序 (Stored Procedures) 商業邏輯龐雜，外包廠商資料轉換進度延遲 3 週。資料庫同步有資料一致性落差問題。',
        managementAssistanceNeeded: '需要主管協調增派 2 名 Senior PostgreSQL DBA 駐點協助，並核可預備金 NT$30萬 以追加外包人力支援。',
        nextMilestones: [
          '解決金融交易資料平移對帳之邏輯落差',
          '重設 DB 壓測計畫'
        ],
        budgetVarianceNote: '因外包時數追加，預計最後可能超出總預算約 8-10%。'
      }
    ]
  },
  {
    id: 'prj-003',
    code: 'PRJ-2026-03',
    name: 'Q3 全球品牌形象與線上行銷活動',
    department: '行銷部',
    leadPm: '林哲宇 (Alex Lin)',
    strategicPriority: '市場拓展與品牌',
    targetCompletionDate: '2026-08-31',
    currentProgress: 55,
    health: 'AT_RISK',
    currency: 'USD',
    totalBudget: 75000,
    spentBudget: 42000,
    description: '迎接 Q3 產品新品發布會，推動數位廣告、KOL 合作、跨國影音專案與社群媒體宣傳。',
    keyDeliverables: [
      { id: 'del-301', title: '定案年度主視覺與 Key Visual 設計規範', dueDate: '2026-06-15', completed: true },
      { id: 'del-302', title: '拍攝 3 支品牌形象影片與 KOL 簽約', dueDate: '2026-07-20', completed: false },
      { id: 'del-303', title: '線上預購 Landing Page 開發與 SEO 部署', dueDate: '2026-08-05', completed: true },
      { id: 'del-304', title: '跨國同步線上發布會直播與媒體公關', dueDate: '2026-08-25', completed: false }
    ],
    milestoneRequests: [
      {
        id: 'cr-301',
        projectId: 'prj-003',
        projectName: 'Q3 全球品牌形象與線上行銷活動',
        pmName: '林哲宇 (Alex Lin)',
        changeType: 'MODIFY_DATE',
        deliverableId: 'del-302',
        originalTitle: '拍攝 3 支品牌形象影片與 KOL 簽約',
        originalDueDate: '2026-07-20',
        newTitle: '拍攝 3 支品牌形象影片與 KOL 簽約 (展延預備)',
        newDueDate: '2026-07-30',
        reason: '主合作影音製作團隊因導演確診隔離與腳本雙語對比修訂，申請將交件日展延 10 天，已規劃備用 Reels 素材墊檔。',
        status: 'PENDING',
        requestedAt: '2026-07-30 16:30'
      }
    ],
    createdAt: '2026-05-01',
    updatedAt: '2026-07-30',
    updates: [
      {
        id: 'upd-302',
        date: '2026-07-30',
        pmName: '林哲宇 (Alex Lin)',
        progress: 55,
        status: 'AT_RISK',
        keyAchievements: [
          '預購頁面上線 5 天吸引超過 32,000 人次瀏覽與 1,200 筆名單留存',
          '完成北美與東南亞 5 位核心 KOL 簽約'
        ],
        risksAndBlockers: '主要合作的影音製作公司因導演確診與腳本修訂延誤，形象影片交件時間預計延後 10 天，可能影響第一波影音投放排程。',
        managementAssistanceNeeded: '請行銷副總協助確認是否可以備用腳本剪輯 B-roll 搶先發布 Shorts / Reels 墊檔。',
        nextMilestones: [
          '完成第二階段媒體採訪新聞稿簽核',
          '影音素材最終門檻驗收'
        ],
        budgetVarianceNote: '廣告投放預算正常使用中。'
      }
    ]
  },
  {
    id: 'prj-004',
    code: 'PRJ-2026-04',
    name: '亞太區新倉儲系統與供應鏈整合',
    department: '營運部',
    leadPm: '黃美玲 (Emily Huang)',
    strategicPriority: '營運效率與自動化',
    targetCompletionDate: '2026-10-31',
    currentProgress: 88,
    health: 'ON_TRACK',
    currency: 'JPY',
    totalBudget: 22000000,
    spentBudget: 19000000,
    description: '引進 WMS 智慧倉儲管理系統、AGV 自動搬運機器人與跨國關務系統自動化，目標提高揀貨效率 50%。',
    keyDeliverables: [
      { id: 'del-401', title: '桃機新物流中心軟硬體工程與網路佈線', dueDate: '2026-04-30', completed: true },
      { id: 'del-402', title: 'AGV 自動導引搬運車車隊測試與教導', dueDate: '2026-06-30', completed: true },
      { id: 'del-403', title: 'WMS 與第三方跨境快遞 API 串接', dueDate: '2026-07-25', completed: true },
      { id: 'del-404', title: '桃園倉正式試營運與正式接單切換', dueDate: '2026-09-15', completed: false }
    ],
    createdAt: '2026-02-01',
    updatedAt: '2026-07-27',
    updates: [
      {
        id: 'upd-402',
        date: '2026-07-27',
        pmName: '黃美玲 (Emily Huang)',
        progress: 88,
        status: 'ON_TRACK',
        keyAchievements: [
          '已成功完成 100,000 件出貨單連線情境壓力測試，系統無異常掉單',
          '現場倉儲人員已完成 100% 操作培訓與認證',
          '平均訂單處理時間由 14 分鐘下降至 4.2 分鐘'
        ],
        risksAndBlockers: '關務系統假日批次處理有零星超時情況，已跟海關連線端工程師協調專線升級。',
        managementAssistanceNeeded: '暫無，計畫比預期進度提前兩週。',
        nextMilestones: [
          '8/15 啟動第一批次 30% 流量實體測試',
          '進行雙倉備援系統模擬切換'
        ]
      }
    ]
  },
  {
    id: 'prj-005',
    code: 'PRJ-2026-05',
    name: '企業 ESG 碳盤查與永續報告書系統',
    department: '永續營運部',
    leadPm: '張建國 (Ken Chang)',
    strategicPriority: '永續與合規',
    targetCompletionDate: '2026-12-15',
    currentProgress: 65,
    health: 'ON_TRACK',
    currency: 'EUR',
    totalBudget: 50000,
    spentBudget: 30000,
    description: '建立範疇一、二、三的範疇碳排放自動化計算系統，與第三方第三方驗證機構 (SGS/BSI) 數據庫連線。',
    keyDeliverables: [
      { id: 'del-501', title: '完成範疇一二能源邊界與溫室氣體清冊', dueDate: '2026-05-31', completed: true },
      { id: 'del-502', title: '跨廠區 IoT 電表與自動化數據擷取模組', dueDate: '2026-07-30', completed: true },
      { id: 'del-503', title: '供應鏈範疇三問卷調查與碳足跡係數庫建置', dueDate: '2026-10-15', completed: false },
      { id: 'del-504', title: '取得第三方機構查驗聲明書 (ISO 14064-1)', dueDate: '2026-12-01', completed: false }
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-07-25',
    updates: [
      {
        id: 'upd-501',
        date: '2026-07-25',
        pmName: '張建國 (Ken Chang)',
        progress: 65,
        status: 'ON_TRACK',
        keyAchievements: [
          '全公司 4 個廠區 100% 完成 IoT 電表安裝與每日碳排自動連線',
          '初步完成 ISO 14064-1 邊界範疇擬定與內部稽核'
        ],
        risksAndBlockers: '海外二級供應商回覆碳足跡問卷率偏低（僅約 35%）。',
        managementAssistanceNeeded: '請採購主管於季度供應商大會宣導，將碳盤查數據列為合格供應商考核指標。',
        nextMilestones: [
          '發起第二輪供應商 ESG 說明會',
          '完成永續報告書草稿撰寫'
        ]
      }
    ]
  },
  {
    id: 'prj-006',
    code: 'PRJ-2026-06',
    name: '新一代跨平台行動 App 2.0 重刷',
    department: '產品部',
    leadPm: '吳佩琪 (Jessica Wu)',
    strategicPriority: '核心產品升級',
    targetCompletionDate: '2026-10-01',
    currentProgress: 42,
    health: 'AT_RISK',
    currency: 'CNY',
    totalBudget: 1100000,
    spentBudget: 480000,
    description: '使用 React Native 完全重構雙平台 App，引進極簡 UI 設計、生物辨識快登與個人化智慧推薦首頁。',
    keyDeliverables: [
      { id: 'del-601', title: '完成新版 Design System 與 60+ UI Component 庫', dueDate: '2026-05-20', completed: true },
      { id: 'del-602', title: '完成核心購物與會員點數微服務 API 介接', dueDate: '2026-07-15', completed: true },
      { id: 'del-603', title: 'iOS/Android 封閉 Beta 測試與 Crashlytics 最佳化', dueDate: '2026-08-30', completed: false },
      { id: 'del-604', title: '雙平台商店（App Store / Google Play）正式上架', dueDate: '2026-10-01', completed: false }
    ],
    createdAt: '2026-04-01',
    updatedAt: '2026-07-31',
    updates: [
      {
        id: 'upd-601',
        date: '2026-07-31',
        pmName: '吳佩琪 (Jessica Wu)',
        progress: 42,
        status: 'AT_RISK',
        keyAchievements: [
          '已完成會員中心、首頁推薦區與金流結帳 3 大模組開發',
          '前端效能比舊版原生 App 提升 35%'
        ],
        risksAndBlockers: 'Apple 新版 App Store 隱私權政策審查趨嚴，生物辨識快登模組需要補充額外合規宣告；Android 端有少數三星手機折疊螢幕適應 Bug。',
        managementAssistanceNeeded: '需要法務與資安團隊協助審閱 iOS 隱私權揭露聲明條款，確保發布審查無阻礙。',
        nextMilestones: [
          '解決 Android 折疊機版面跑版問題',
          '展開公司內部 200 人 Alpha 測試'
        ]
      }
    ]
  }
];

export const INITIAL_EXECUTIVE_BRIEFING: ExecutiveBriefing = {
  generatedAt: '2026-07-31 08:00',
  overallExecutiveSummary: '本週專案組合總體健康度為【中偏良】。全公司共 6 項重大戰略專案，其中 3 項進行順利 (On Track)，2 項需要高層關注 (At Risk)，1 項進度落後嚴重 (Delayed)。總分配預算 NT$23.8M，累積已執行 NT$13.95M (執行率 58.6%)。主要痛點聚焦於【IT資訊部 ERP 資料庫轉型人力瓶頸】以及【行銷部與產品部外部廠商合規與影音交期延遲】。建議一級主管本週重點撥款支援 ERP 專案之專家人力，並指示法務與採購端協助加速。',
  portfolioHealthOverview: {
    totalProjects: 6,
    onTrackCount: 3,
    atRiskCount: 2,
    delayedCount: 1,
    completedCount: 0,
    totalBudgetAllocated: 23800000,
    totalSpentBudget: 13950000
  },
  criticalRisksAndDecisions: [
    {
      projectId: 'prj-002',
      projectName: '核心 ERP 與微服務架構重構',
      department: 'IT資訊部',
      leadPm: '王大衛 (David Wang)',
      issue: '15年舊 Oracle 資料庫存取邏輯龐雜，轉換移轉落後 3 週，外包進度塞車。',
      pmAssistanceRequested: '申請追加 NT$30萬 預備金聘用 2 名資深 DBA 專家協助關聯資料對帳。',
      aiRecommendedAction: '【建議核准】ERP 為全公司營運命脈，30萬費用在總體專案預算 8% 變動許可內，應立即批准增派 manpower 以免拖累後續全公司結算。',
      priority: 'HIGH'
    },
    {
      projectId: 'prj-003',
      projectName: 'Q3 全球品牌形象與線上行銷活動',
      department: '行銷部',
      leadPm: '林哲宇 (Alex Lin)',
      issue: '形象影片製作廠商因導演確診交件延後 10 天，恐影響預購開賣宣傳波段。',
      pmAssistanceRequested: '請主管核准先以精華組圖與精簡短影音 (Reels) 先行開跑開賣預熱。',
      aiRecommendedAction: '【同意彈性排程】核准行銷團隊啟用備用短影音方案，避免硬等主影片而錯失 Q3 預購流量黃金期。',
      priority: 'MEDIUM'
    },
    {
      projectId: 'prj-006',
      projectName: '新一代跨平台行動 App 2.0 重刷',
      department: '產品部',
      leadPm: '吳佩琪 (Jessica Wu)',
      issue: 'Apple App Store 隱私聲明條款審查趨嚴，生物辨識模組缺少法務聲明。',
      pmAssistanceRequested: '需要資安與法務團隊於本週內完成條款審閱。',
      aiRecommendedAction: '【交辦跨部門協調】交辦法務部於 2 個工作天內完成審查，避免阻礙 8 月底封測時程。',
      priority: 'MEDIUM'
    }
  ],
  topWinsAndProgress: [
    {
      projectId: 'prj-004',
      projectName: '亞太區新倉儲系統與供應鏈整合',
      department: '營運部',
      achievement: '成功通過 10 萬件出貨壓力測試，揀貨處理時間大幅縮短 70%，進度超前 2 週！'
    },
    {
      projectId: 'prj-001',
      projectName: 'AI 智慧客服與知識庫升級',
      department: '研發部',
      achievement: '內部 Agent 滿意度達 4.6 高分，推論延遲縮短至 0.65 秒，已通過 ISO 27001 紅隊測試。'
    },
    {
      projectId: 'prj-005',
      projectName: '企業 ESG 碳盤查與永續報告書系統',
      department: '永續營運部',
      achievement: '全公司 4 大廠區 IoT 電表 100% 上線自動化追蹤碳排數據。'
    }
  ],
  departmentalStatus: [
    { department: '研發部', statusSummary: '進度表現優異，AI 專案成效卓越，無重大瓶頸。', healthScore: 92, activeProjectCount: 1 },
    { department: '營運部', statusSummary: '倉儲自動化工程超前，跨國物流連線測試圓滿完成。', healthScore: 95, activeProjectCount: 1 },
    { department: '永續營運部', statusSummary: '廠區 IoT 上線完備，正推動第二階段海外供應鏈盤查。', healthScore: 88, activeProjectCount: 1 },
    { department: '行銷部', statusSummary: '線上預購流量強勁，但外部影音供應商有所延誤，需調整波段。', healthScore: 72, activeProjectCount: 1 },
    { department: '產品部', statusSummary: ' App 2.0 介面效能顯著進步，但合規審查與折疊螢幕硬體相容待突破。', healthScore: 70, activeProjectCount: 1 },
    { department: 'IT資訊部', statusSummary: 'ERP 資料庫移轉遭遇龐雜舊邏輯卡關，需要技術補強。', healthScore: 52, activeProjectCount: 1 }
  ],
  strategicRecommendations: [
    '【重點資源投放】：優先將預備預算核撥至 IT 資訊部 ERP 移轉專案，解決關鍵資料庫瓶頸。',
    '【跨部門流程加速】：建立「App/行銷發表專用」的法務與資安快速審核通道 (Fast-track Review)。',
    '【供應商管理政策】：宣導將採購部供應商評鑑與永續部碳盤查問卷填報率強制連結，提高範疇三數據回覆率。'
  ]
};

export const INITIAL_DECISION_RECORDS: any[] = [
  {
    id: 'dec-001',
    projectId: 'prj-002',
    projectName: '核心 ERP 與微服務架構重構',
    department: 'IT資訊部',
    leadPm: '王大衛 (David Wang)',
    decisionMakerRole: 'VP of Technology & Operations',
    decisionMakerName: '張董事長 / Marcus Chang',
    timestamp: '2026-08-09 15:30',
    issueTitle: '15年舊 Oracle 資料庫存取邏輯龐雜，外包進度塞車致關鍵轉型延遲',
    pmAssistanceRequested: '申請追加 NT$30萬 預備金聘用 2 名資深 DBA 專家協助關聯資料對帳。',
    outcome: 'APPROVED',
    approvedAmount: 300000,
    approvedCurrency: 'TWD',
    decisionReason: 'Critical schedule recovery — Approved NT$300k budget allocation for Senior DBA onboarding to prevent Q4 financial reporting blockage.',
    actionItems: [
      {
        id: 'act-101',
        title: '撥可追加 NT$30萬 預備預算至 IT 資訊部外包專戶',
        assignee: 'CFO / 財務部',
        dueDate: '2026-08-11',
        status: 'COMPLETED',
        completedAt: '2026-08-10'
      },
      {
        id: 'act-102',
        title: '完成 2 位 Senior PostgreSQL DBA 駐點合約簽署與資安授權',
        assignee: '王大衛 (David Wang)',
        dueDate: '2026-08-14',
        status: 'IN_PROGRESS'
      },
      {
        id: 'act-103',
        title: '每週五回報 Oracle 至 Cloud SQL 資料對帳正確率曲線',
        assignee: '王大衛 (David Wang)',
        dueDate: '2026-08-21',
        status: 'OPEN'
      }
    ]
  },
  {
    id: 'dec-002',
    projectId: 'prj-003',
    projectName: 'Q3 全球品牌形象與線上行銷活動',
    department: '行銷部',
    leadPm: '林哲宇 (Alex Lin)',
    decisionMakerRole: 'VP of Marketing',
    decisionMakerName: '林副總 / Sarah Lin',
    timestamp: '2026-08-08 11:15',
    issueTitle: '形象影片製作廠商因導演確診交件延後 10 天，影響 Q3 預購上線',
    pmAssistanceRequested: '請主管核准先以精華組圖與精簡短影音 (Reels) 先行開跑開賣預熱。',
    outcome: 'APPROVED',
    decisionReason: 'Approved flexible Reels marketing wave to capture high-intent Q3 traffic without waiting for full video delivery.',
    actionItems: [
      {
        id: 'act-201',
        title: '上架預備 Reels 腳本組圖與 IG/Meta 廣告投放預熱',
        assignee: '林哲宇 (Alex Lin)',
        dueDate: '2026-08-10',
        status: 'COMPLETED',
        completedAt: '2026-08-09'
      },
      {
        id: 'act-202',
        title: '追蹤影音製作廠商 8/12 補拍與第二次門檻驗收',
        assignee: '林哲宇 (Alex Lin)',
        dueDate: '2026-08-12',
        status: 'IN_PROGRESS'
      }
    ]
  }
];

