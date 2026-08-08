import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Header & Brand
    'app.title': 'PROSYNC',
    'app.subtitle': 'Executive Project Hub',
    'header.execTitle': 'Executive Portfolio Dashboard',
    'header.pmTitle': 'Program Manager Hub',
    'header.syncStatus': '專案數據即時同步中',
    'header.executive': '一級主管',
    'header.pmView': 'PM 週報',
    'header.aiQA': 'AI 戰略問答',
    'header.memoExport': '高層 Memo',
    'header.addProject': '建立專案',

    // Sidebar
    'sidebar.7featuresTitle': '核心戰略模組',
    'sidebar.7featuresSub': '即時追蹤與決策支援',
    'sidebar.sectionCore': '戰略管理視圖',
    'sidebar.execDashboard': '一級主管戰略儀表板',
    'sidebar.pmHub': 'PM 週報與專案視圖',
    'sidebar.sectionAiTools': '高階 AI 賦能工具',
    'sidebar.aiQAAssistant': 'AI 主管戰略問答助理',
    'sidebar.memoExportModal': '高層會議 Memo 匯出',
    'sidebar.createProject': '立項建立新專案',
    'sidebar.sectionList': '主要模組',
    'sidebar.feature1': '一頁式戰略總覽',
    'sidebar.feature2': 'AI 精煉高層簡報',
    'sidebar.feature3': '高風險阻礙列管',
    'sidebar.feature4': 'PM 輕量週報 & 潤飾',
    'sidebar.feature5': '多維度專案視圖',
    'sidebar.feature6': '交付物與里程碑',
    'sidebar.feature7': '一級主管 AI 問答',
    'sidebar.resetData': '重設範例專案資料',

    // Executive Dashboard
    'dashboard.bannerText': '全公司專案組合動態與 AI 戰略分析',
    'dashboard.bannerSub': '專注高層決策效率與資源調配',
    'dashboard.kpiHeader': '全公司專案組合總覽 (Portfolio KPI)',
    'dashboard.activeProjects': '進行中專案',
    'dashboard.coveringDepts': '涵蓋 6 大事業部門',
    'dashboard.onScheduleRate': '按期推進率',
    'dashboard.actualSpent': '累積實際支出',
    'dashboard.totalBudget': '總預算',
    'dashboard.risksManaged': '卡關與風險列管',
    'dashboard.atRiskCount': '需要關注',
    'dashboard.delayedCount': '嚴重落後',
    'dashboard.deptPulse': '部門專案脈搏 (Department Pulse)',
    'dashboard.clickToFilter': '點擊可篩選部門',
    'dashboard.projectsSuffix': '個專案',
    'dashboard.healthScore': '健康度',
    'dashboard.spent': '實支',
    'dashboard.budget': '預算',
    'dashboard.portfolioOverview': '全公司專案清單',
    'dashboard.searchPlaceholder': '搜尋專案名稱、編號或 PM...',
    'dashboard.allDepts': '所有部門',
    'dashboard.allStatus': '所有健康狀態',
    'dashboard.latestWeekly': '最新週報',
    'dashboard.progressingNormally': '穩定推進中',
    'dashboard.fillWeeklyUpdate': '+ 填寫週報',
    'dashboard.detailsAndMilestones': '詳情與里程碑',
    'dashboard.noMatchingProjects': '沒有符合條件的專案項目',

    // Briefing Card
    'briefing.cardTitle': 'AI 戰略簡報 (Executive Briefing)',
    'briefing.cardSub': '自動整合多位 PM 週報，提煉高層決策與跨部門資源調配建議',
    'briefing.updateTime': '更新時間',
    'briefing.copyMemo': '複製 Memo',
    'briefing.copied': '已複製',
    'briefing.regenerate': '重新精煉簡報',
    'briefing.generating': '生成中...',
    'briefing.failedError': 'AI 簡報生成失敗，請再試一次',
    'briefing.memoTitle': '一級主管專案綜合簡報 (Executive Briefing)',
    'briefing.takeaway': '全公司戰略 Takeaway',
    'briefing.riskTitle': '關鍵風險與待高層決策事項',
    'briefing.highRisk': '高風險',
    'briefing.medRisk': '中風險',
    'briefing.projectDetails': '專案細節',
    'briefing.blocker': '卡關瓶頸',
    'briefing.pmRequest': 'PM 請求協助',
    'briefing.aiRecommend': 'AI 建議對策',
    'briefing.winsTitle': '重點突破成果',
    'briefing.strategicRecs': '高階跨部門戰略建議',

    // Project List / PM View
    'projectList.title': '專案檢視與週報管理 (Project Hub)',
    'projectList.subtitle': '無縫切換視圖，輕鬆掌控進度與提交每週 PM 簡報',
    'projectList.cardView': '卡片',
    'projectList.tableView': '表格',
    'projectList.kanbanView': '看板',
    'projectList.searchPlaceholder': '搜尋專案關鍵字、PM 姓名、專案代碼...',

    // Health Badges
    'health.ON_TRACK': '順利進行',
    'health.AT_RISK': '需要關注',
    'health.DELAYED': '嚴重落後',
    'health.COMPLETED': '已完成',

    // PM Update Modal
    'updateModal.title': 'PM 週報填報 & AI 文案潤飾',
    'updateModal.progress': '當前進度完成率',
    'updateModal.healthStatus': '專案健康度評估',
    'updateModal.achievements': '本週重大突破與完成事項',
    'updateModal.achievementsPlaceholder': '例如：完成跨平台 API 介面串接測試、第二階段客戶驗收通過',
    'updateModal.blockers': '當前面臨問題與卡關阻礙',
    'updateModal.blockersPlaceholder': '敘述問題根因、受影響項目或預期落後天數...',
    'updateModal.assistance': '需要一級主管協助事項',
    'updateModal.assistancePlaceholder': '向主管明確提出所需資源、人力調配或資金核可請求...',
    'updateModal.aiPolish': '調用 AI 自動精煉與潤飾公文書文案',
    'updateModal.aiPolishing': 'AI 潤飾中...',
    'updateModal.submit': '提交週報紀錄',
    'updateModal.cancel': '取消',

    // Add Project Modal
    'addModal.title': '立項建立新專案',
    'addModal.code': '專案編號',
    'addModal.leadPm': '負責 PM',
    'addModal.name': '專案名稱',
    'addModal.department': '所屬部門',
    'addModal.priority': '戰略優先級',
    'addModal.budget': '總預算金額 (NTD)',
    'addModal.targetDate': '預計完成日期',
    'addModal.description': '專案說明與商業效益',
    'addModal.submit': '確認建立專案',

    // Executive Report Modal
    'reportModal.title': '高層簡報 Memo 匯出',
    'reportModal.subtitle': '適用於 CEO / 董事會與高層會報',
    'reportModal.copyText': '複製純文字 Memo',
    'reportModal.copied': '已複製',
    'reportModal.printPdf': '列印 / 存為 PDF',
    'reportModal.headerTitle': 'EXECUTIVE PROJECT BRIEFING MEMO',
    'reportModal.headerSub': '全公司專案組合執行進度與卡關瓶頸高階匯出報告',
    'reportModal.confidential': '機密等級：內部高階專用',
    'reportModal.section1': '一、總體戰略評估摘要',
    'reportModal.section2': '二、專案健康度與預算總覽',
    'reportModal.kpiChartTitle': '二、全公司專案 KPI 與進度達成率視覺圖表',
    'reportModal.avgCompletionRate': '全公司平均進度達成率',
    'reportModal.scheduleOnTrackRate': '專案按期推進率',
    'reportModal.targetBenchmark': '目標基準：85%',
    'reportModal.budgetExecutionRate': '預算支用執行率',
    'reportModal.deptCompletionBreakdown': '各部門專案達成率與進度分佈',
    'reportModal.deliverablesCompletionRate': '里程碑交付物達成率',
    'reportModal.projectsCount': '個專案',
    'reportModal.completedDeliverables': '項已交付',
    'reportModal.riskDistribution': '專案健康度與風險分佈',
    'reportModal.section3': '三、關鍵風險與待高層決策事項',
    'reportModal.section4': '四、重點進展與亮點',
    'reportModal.section5': '五、高階跨部門戰略建議',

    // QA Chat
    'qa.title': '一級主管 AI 戰略問答助理',
    'qa.sub': '掌握全公司各專案進度、預算支用、人力卡關與 PM 回報數據，提供即時洞察與決策對策',
    'qa.suggested': '建議常見問答 (快捷點擊)：',
    'qa.suggested1': '目前有哪些專案嚴重落後？卡關原因與建議對策是什麼？',
    'qa.suggested2': '全公司專案預算使用狀況如何？是否有超支風險？',
    'qa.suggested3': '請幫我列出各部門進度表現與 PM 請求主管協助的項目。',
    'qa.inputPlaceholder': '請輸入您想向 AI 秘書詢問的專案問題 (例如：研發部目前的重點進展？)',
    'qa.send': '發送',
    'qa.thinking': 'AI 秘書思考中...',

    // Project Detail Modal
    'detail.title': '專案詳細資訊',
    'detail.deliverables': '關鍵交付物 (Deliverables)',
    'detail.history': '歷史週報紀錄',
    'detail.noUpdates': '尚無週報填報紀錄',

    // Confirmations
    'confirm.reset': '確定要將專案數據恢復為系統預設範例專案資料嗎？',
    'confirm.resetSuccess': '已恢復系統預設範例專案數據',
  },
  en: {
    // Header & Brand
    'app.title': 'PROSYNC',
    'app.subtitle': 'Executive Strategic Hub',
    'header.execTitle': 'Executive Strategic Dashboard',
    'header.pmTitle': 'PM Weekly Reporting Hub',
    'header.syncStatus': 'Live Sync Active',
    'header.executive': 'Executive',
    'header.pmView': 'PM View',
    'header.aiQA': 'AI Q&A',
    'header.memoExport': 'Executive Memo',
    'header.addProject': 'Create Project',

    // Sidebar
    'sidebar.7featuresTitle': 'Core Modules',
    'sidebar.7featuresSub': 'Real-time Tracking & Decisions',
    'sidebar.sectionCore': 'Strategic Views',
    'sidebar.execDashboard': 'Executive Dashboard',
    'sidebar.pmHub': 'PM Weekly Log & Projects',
    'sidebar.sectionAiTools': 'AI Executive Tools',
    'sidebar.aiQAAssistant': 'AI Strategic Q&A',
    'sidebar.memoExportModal': 'Export Executive Memo',
    'sidebar.createProject': 'Initiate Project',
    'sidebar.sectionList': 'Key Capabilities',
    'sidebar.feature1': 'Executive Portfolio Overview',
    'sidebar.feature2': 'AI Briefing Synthesis',
    'sidebar.feature3': 'Critical Risk Management',
    'sidebar.feature4': 'Lightweight PM Log & AI Polish',
    'sidebar.feature5': 'Multi-View Project Hub',
    'sidebar.feature6': 'Milestone & Deliverable Tracker',
    'sidebar.feature7': 'AI Executive Q&A Assistant',
    'sidebar.resetData': 'Reset Demo Data',

    // Executive Dashboard
    'dashboard.bannerText': 'Portfolio Intelligence & AI Strategic Briefing',
    'dashboard.bannerSub': 'Streamlined for C-Suite Decisions & Resource Allocation',
    'dashboard.kpiHeader': 'Executive Portfolio Overview',
    'dashboard.activeProjects': 'Active Projects',
    'dashboard.coveringDepts': 'Across 6 Departments',
    'dashboard.onScheduleRate': 'On-Track Rate',
    'dashboard.actualSpent': 'Total Spent',
    'dashboard.totalBudget': 'Total Budget',
    'dashboard.risksManaged': 'Risks & Bottlenecks',
    'dashboard.atRiskCount': 'At Risk',
    'dashboard.delayedCount': 'Delayed',
    'dashboard.deptPulse': 'Department Health Pulse',
    'dashboard.clickToFilter': 'Click department to filter',
    'dashboard.projectsSuffix': 'Projects',
    'dashboard.healthScore': 'Health',
    'dashboard.spent': 'Spent',
    'dashboard.budget': 'Budget',
    'dashboard.portfolioOverview': 'Company Project List',
    'dashboard.searchPlaceholder': 'Search project name, code, or PM...',
    'dashboard.allDepts': 'All Departments',
    'dashboard.allStatus': 'All Health Statuses',
    'dashboard.latestWeekly': 'Latest Update',
    'dashboard.progressingNormally': 'Progressing smoothly',
    'dashboard.fillWeeklyUpdate': '+ Log Update',
    'dashboard.detailsAndMilestones': 'Details & Milestones',
    'dashboard.noMatchingProjects': 'No matching projects found',

    // Briefing Card
    'briefing.cardTitle': 'AI Executive Briefing',
    'briefing.cardSub': 'Synthesized from PM logs with actionable C-suite insights & resource recommendations',
    'briefing.updateTime': 'Updated',
    'briefing.copyMemo': 'Copy Memo',
    'briefing.copied': 'Copied',
    'briefing.regenerate': 'Re-synthesize',
    'briefing.generating': 'Generating...',
    'briefing.failedError': 'Failed to generate briefing. Please try again.',
    'briefing.memoTitle': 'Executive Project Briefing Memo',
    'briefing.takeaway': 'Strategic Takeaway',
    'briefing.riskTitle': 'Critical Risks & Executive Decisions Needed',
    'briefing.highRisk': 'High Risk',
    'briefing.medRisk': 'Medium Risk',
    'briefing.projectDetails': 'Details',
    'briefing.blocker': 'Critical Bottleneck',
    'briefing.pmRequest': 'PM Help Request',
    'briefing.aiRecommend': 'AI Recommended Action',
    'briefing.winsTitle': 'Top Wins & Breakthroughs',
    'briefing.strategicRecs': 'Strategic Recommendations',

    // Project List / PM View
    'projectList.title': 'Project Hub & Weekly Management',
    'projectList.subtitle': 'Seamlessly switch views to monitor progress and log updates',
    'projectList.cardView': 'Cards',
    'projectList.tableView': 'Table',
    'projectList.kanbanView': 'Kanban',
    'projectList.searchPlaceholder': 'Search project keyword, PM name, code...',

    // Health Badges
    'health.ON_TRACK': 'On Track',
    'health.AT_RISK': 'At Risk',
    'health.DELAYED': 'Delayed',
    'health.COMPLETED': 'Completed',

    // PM Update Modal
    'updateModal.title': 'PM Weekly Log & AI Copy Polish',
    'updateModal.progress': 'Completion Rate',
    'updateModal.healthStatus': 'Project Health Assessment',
    'updateModal.achievements': 'Key Achievements This Week',
    'updateModal.achievementsPlaceholder': 'e.g., Completed API integration testing, passed Phase 2 UAT',
    'updateModal.blockers': 'Current Blockers & Risks',
    'updateModal.blockersPlaceholder': 'Describe root cause, impacted items, or expected delay in days...',
    'updateModal.assistance': 'Management Assistance Requested',
    'updateModal.assistancePlaceholder': 'State specific resource, staffing, or budget approval requests to management...',
    'updateModal.aiPolish': 'Polish Copy with AI',
    'updateModal.aiPolishing': 'Polishing Copy...',
    'updateModal.submit': 'Submit Weekly Log',
    'updateModal.cancel': 'Cancel',

    // Add Project Modal
    'addModal.title': 'Create New Project',
    'addModal.code': 'Project Code',
    'addModal.leadPm': 'Lead PM',
    'addModal.name': 'Project Name',
    'addModal.department': 'Department',
    'addModal.priority': 'Strategic Priority',
    'addModal.budget': 'Total Budget (NTD)',
    'addModal.targetDate': 'Target Completion Date',
    'addModal.description': 'Description & Business Objectives',
    'addModal.submit': 'Confirm Create Project',

    // Executive Report Modal
    'reportModal.title': 'Export Executive Briefing Memo',
    'reportModal.subtitle': 'Designed for CEO, Board, and C-Suite Meetings',
    'reportModal.copyText': 'Copy Plain Text Memo',
    'reportModal.copied': 'Copied',
    'reportModal.printPdf': 'Print / Save PDF',
    'reportModal.headerTitle': 'EXECUTIVE PROJECT BRIEFING MEMO',
    'reportModal.headerSub': 'Company-wide Portfolio Progress & Bottleneck Executive Report',
    'reportModal.confidential': 'Confidential: Executive Use Only',
    'reportModal.section1': 'I. Overall Strategic Assessment',
    'reportModal.section2': 'II. Portfolio Health & Budget Overview',
    'reportModal.kpiChartTitle': 'II. Portfolio KPI & Completion Rate Visual Charts',
    'reportModal.avgCompletionRate': 'Average Completion Rate',
    'reportModal.scheduleOnTrackRate': 'On-Schedule Rate',
    'reportModal.targetBenchmark': 'Target Benchmark: 85%',
    'reportModal.budgetExecutionRate': 'Budget Execution Rate',
    'reportModal.deptCompletionBreakdown': 'Department Completion Rate Breakdown',
    'reportModal.deliverablesCompletionRate': 'Milestones & Deliverables Completion Rate',
    'reportModal.projectsCount': 'Projects',
    'reportModal.completedDeliverables': 'Deliverables Done',
    'reportModal.riskDistribution': 'Project Health & Risk Distribution',
    'reportModal.section3': 'III. Critical Risks & Executive Decisions Needed',
    'reportModal.section4': 'IV. Top Wins & Breakthroughs',
    'reportModal.section5': 'V. Cross-Department Strategic Recommendations',

    // QA Chat
    'qa.title': 'Executive AI Strategic Q&A Assistant',
    'qa.sub': 'Access company-wide project status, budget spending, bottlenecks, and PM logs with instant AI insights',
    'qa.suggested': 'Suggested Quick Questions:',
    'qa.suggested1': 'Which projects are currently delayed? What are the root causes and recommended actions?',
    'qa.suggested2': 'What is the overall project budget consumption? Are there any budget overrun risks?',
    'qa.suggested3': 'Summarize departmental progress performance and list PM resource requests for leadership.',
    'qa.inputPlaceholder': 'Ask AI Secretary a project question (e.g., What are R&D department key breakthroughs?)',
    'qa.send': 'Send',
    'qa.thinking': 'AI Secretary thinking...',

    // Project Detail Modal
    'detail.title': 'Project Details',
    'detail.deliverables': 'Key Deliverables',
    'detail.history': 'Historical Weekly Updates',
    'detail.noUpdates': 'No weekly logs submitted yet',

    // Confirmations
    'confirm.reset': 'Are you sure you want to reset project data back to system defaults?',
    'confirm.resetSuccess': 'Project data restored to default demo state.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'en' || urlLang === 'zh') {
        return urlLang;
      }
    }
    const saved = localStorage.getItem('prosync_language');
    return saved === 'en' ? 'en' : 'zh';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('prosync_language', lang);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const t = (key: string, fallback?: string): string => {
    const text = translations[language]?.[key] || translations['zh']?.[key];
    if (text) return text;
    if (fallback) return fallback;
    // Fallback cleanly without leaking key names
    const cleanLastPart = key.split('.').pop() || key;
    return cleanLastPart;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
