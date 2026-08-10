import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  LayoutDashboard, 
  TrendingUp, 
  FileCheck2, 
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  DollarSign,
  Layers,
  Award,
  Languages
} from 'lucide-react';
import { Project, ExecutiveBriefing } from '../types';
import { WeeklyTrendChart } from './ExecutiveView/WeeklyTrendChart';
import { useLanguage } from '../context/LanguageContext';

interface LinkedInDMShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  briefing: ExecutiveBriefing;
}

type TabType = 'DASHBOARD' | 'TREND' | 'APPROVAL' | 'PM_EDITOR';

export const LinkedInDMShowcaseModal: React.FC<LinkedInDMShowcaseModalProps> = ({
  isOpen,
  onClose,
  projects,
  briefing,
}) => {
  if (!isOpen) return null;

  const { language: globalLang, setLanguage } = useLanguage();
  const [modalLang, setModalLang] = useState<'en' | 'zh'>(globalLang || 'en');
  const isEn = modalLang === 'en';

  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const [copied, setCopied] = useState(false);

  const linkedinCopiesEn: Record<TabType, string> = {
    DASHBOARD: `🚀 【C-Suite Portfolio AI Control Tower】Eliminate Information Asymmetry Across Global Initiatives!

As an executive leader, do you constantly face:
❓ Inconsistent weekly updates across departments, masking true budget and schedule risks?
❓ Scope creep and unrecorded changes escalating until deadlines are missed?

Our AI-powered **Executive Portfolio Dashboard** delivers:
✅ Real-time multi-currency budget clearing & spending analytics (USD / EUR / TWD / JPY / GBP / SGD)
✅ Portfolio health indicators (On Track / At Risk / Delayed) with quantitative tracking
✅ AI Strategic Briefing Memo generating executive action items and bottleneck analyses
✅ Department Health Pulse guiding N-1 leaders to high-priority red/yellow projects

👉 Turn data into strategic clarity! Experience the future of enterprise PMO governance.

#ProjectManagement #ExecutiveDashboard #AIPMO #EnterpriseLeadership #DigitalTransformation #CSuite #Strategy`,

    TREND: `📈 【12~24 Week Portfolio Trajectory Chart】Visualizing Project Health Trends at Scale!

Traditional weekly reports only capture a "static snapshot", missing crucial historical velocity and momentum.

Introducing the **24-Week Project Trend Engine**:
📊 Dynamic stacked trajectory tracking (On Track / At Risk / Delayed / Completed)
🔄 Automated Status Shift Logs capturing escalation and recovery root causes
🎯 Critical milestone markers linking decision timestamps to budget burn rates

Empower executive leadership with empirical data and trend insights!

#DataVisualization #ProjectGovernance #PMO #AgileManagement #ExecutiveReporting #Strategy #Analytics`,

    APPROVAL: `🛡️ 【N-1 Manager Automated Approval Gateway】Prevent Scope Creep & Secure Baseline Governance!

Why do project timelines slip? Because they lack strict **Baseline Governance**!

Our intuitive **N-1 Approval Gateway** features:
🔒 All project charters, milestone date changes, and deletions require formal N-1 approval
⚡ Seamless binding to Org Architecture for multi-tier delegation without CEO bottlenecks
📝 Immutable audit trails capturing timestamps, business justifications, and reviewer notes

Protecting project baselines is protecting corporate performance!

#ChangeManagement #CorporateGovernance #ApprovalWorkflow #PMO #OrganizationalEfficiency #Leadership`,

    PM_EDITOR: `💼 【PM Weekly Reporting & Live Editor】Streamline Weekly Updates & AI Copy Polish!

PMs shouldn't waste hours formatting slide decks!

The **PM Management & Live Editor** module provides:
✨ Seamless switching across Grid, Table, and Kanban views
⏱️ Interactive sliders, multi-currency budget controls, and milestone checkboxes
📝 AI-assisted summary generation and blocker escalation phrasing

Enable PMs to focus on execution and delivery while AI handles weekly synthesis!

#ProjectManagement #Agile #WorkplaceProductivity #PMTools #Automation #Leadership #TechTools`
  };

  const linkedinCopiesZh: Record<TabType, string> = {
    DASHBOARD: `🚀 【企業級 AI 專案戰情室】打破高層資訊迷霧，全覽跨國跨部門專案組合！

身為 C-Suite 高階主管，你是否常面臨：
❓ 各部門回報格式不一，難以掌握真實預算與進度？
❓ 專案變更缺乏紀錄，發生延宕才發現早已失控？

我們專為企業高層打造的 **AI 專案戰情中心 (Executive Portfolio Dashboard)** 提供：
✅ 1 秒多幣別預算換算與累積支出統計 (USD / TWD / EUR / JPY / SGD / GBP / AUD)
✅ 全公司專案健康度燈號 (On Track / At Risk / Delayed) 量化圖表
✅ AI 戰略備忘錄 (Executive Briefing Memo)，自動生成高層決策建議與瓶頸剖析
✅ 部門專案脈搏，即時指引 N-1 主管關注紅黃燈專案

👉 讓資料成為決策的最佳羽翼！歡迎交流與體驗。

#專案管理 #ProjectManagement #AIPMO #ExecutiveDashboard #企業轉型 #CSuiteLeadership`,

    TREND: `📈 【12~24 週專案狀態與進度推移軌跡圖】讓專案趨勢一目了然！

傳統專案週報只看「當週靜態畫面」，卻忽視了「長期趨勢軌跡」。

全新開發的 **24 Weeks Project Trend Engine**：
📊 跨週別動態狀態分佈（綠燈/黃燈/紅燈/完工）動態疊加圖
🔄 自動追蹤該週狀態轉變紀錄 (Status Shift Logs)，掌握升降級原因
🎯 重大里程碑事件標記，連結決策時間點與預算消耗速率

從此高層開會不再各執一詞，用數據與軌跡說話！

#DataVisualization #ProjectGovernance #PMO #AgileManagement #數位轉型`,

    APPROVAL: `🛡️ 【N-1 部門主管自動化簽核關卡】權責分明、防範範疇蔓延！

專案時程為何總是一延再延？因為缺少了「專案基線防護機制 (Baseline Governance)」！

我們設計了直覺的 **N-1 Approval Gateway**：
🔒 所有專案立項、里程碑展延與項目刪除，均自動陳核至 N-1 部門主管
⚡ 自動扣連組織架構（Org Architecture），分級授權無需排隊呈報 CEO
📝 完整保留變更理由與時間戳記審計軌跡 (Audit Trail)

保護專案基線，就是保護企業營運績效！

#ChangeManagement #CorporateGovernance #ApprovalWorkflow #組織效能 #PMO`,

    PM_EDITOR: `💼 【專案經理實用週報與進度編輯器】大幅縮短 PM 週報撰寫時間！

PM 不該把時間花在重複做簡報美工上！

專屬 **PM Management & Live Editor** 模組：
✨ 支援 Grid 網格、Table 表格與 Kanban 看板三大視角切換
⏱️ 一鍵開啟進度滑桿、幣別預算與里程碑 Checkbox 互動維護
📝 自動整合 AI 產生每週摘要與執行障礙提報

讓 PM 專注在溝通與交付，把繁瑣報告交給系統！

#ProjectManager #Agile #WorkplaceProductivity #PMTools #週報自動化`
  };

  const currentCopies = isEn ? linkedinCopiesEn : linkedinCopiesZh;

  const handleCopyText = () => {
    navigator.clipboard.writeText(currentCopies[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleLang = (lang: 'en' | 'zh') => {
    setModalLang(lang);
    setLanguage(lang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                <span>{isEn ? 'LinkedIn Promo & Screenshot Generator Center' : 'LinkedIn 宣傳 DM 與介面圖卡生成中心'}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/30">
                  Fade-Out DM Showcase
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn 
                  ? '4 Curated Product Screenshot Cards with Gradient Fade-Out Effect for LinkedIn Posts & Outreach'
                  : '具備底部漸層融雪消失效果 (Gradient Fade-Out) 的精選產品介面圖卡，專供 LinkedIn 貼文與推廣 DM'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector inside Modal Header */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => handleToggleLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isEn ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇺🇸 English</span>
              </button>
              <button
                onClick={() => handleToggleLang('zh')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  !isEn ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇹🇼 繁體中文</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100/90 p-2 border-b border-slate-200 flex items-center justify-between gap-1.5 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'DASHBOARD', label: isEn ? '1. Executive AI Dashboard' : '1. 高階 AI 戰情室', icon: LayoutDashboard },
              { id: 'TREND', label: isEn ? '2. 12~24 Wk Trajectory Chart' : '2. 12~24週推移圖表', icon: TrendingUp },
              { id: 'APPROVAL', label: isEn ? '3. N-1 Manager Approval Gateway' : '3. N-1 主管簽核關卡', icon: FileCheck2 },
              { id: 'PM_EDITOR', label: isEn ? '4. PM Weekly Log & Editor' : '4. PM 週報與編輯器', icon: FolderGit2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="shrink-0 px-2">
            <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
              {isEn ? 'English Version Active' : '中文版本'}
            </span>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
          
          {/* Card Frame Showcase Container */}
          <div className="bg-slate-900/5 p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-inner space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{isEn ? 'LinkedIn Screenshot Card Preview (Fade-Out Screenshot Card)' : 'LinkedIn 圖卡預覽 (Fade-Out Screenshot Card)'}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                {isEn ? 'Ready to screenshot for LinkedIn posts & outreach' : '可直接截圖使用於 LinkedIn 貼文與 DM 配圖'}
              </span>
            </div>

            {/* Simulated macOS / Browser Frame with Bottom Fade-Out Effect */}
            <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden max-h-[520px] transition-all">
              
              {/* Fake Window Header Bar */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">Enterprise PMO AI Hub — https://pmo.enterprise.internal</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>C-Suite Live ({isEn ? 'EN' : 'ZH'})</span>
                </div>
              </div>

              {/* Render Content Based on Active Tab */}
              <div className="p-4 sm:p-6 overflow-hidden pointer-events-none select-none bg-slate-50/50">
                {activeTab === 'DASHBOARD' && (
                  <div className="space-y-4">
                    {/* Simulated Portfolio KPI Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? 'Portfolio Total Budget' : '全公司總預算'}</div>
                        <div className="text-base font-extrabold text-slate-900 font-mono mt-1">{isEn ? 'USD $ 4,250,000' : 'NT$ 128,500,000'}</div>
                        <div className="text-[10px] text-emerald-600 font-medium mt-0.5">{isEn ? 'Multi-Currency Clearing Active' : '多幣別自動清算換算'}</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? 'Budget Spent Rate' : '預算支用率'}</div>
                        <div className="text-base font-extrabold text-indigo-600 font-mono mt-1">42.8 %</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{isEn ? 'USD $ 1,820,000 Expended' : 'NT$ 55,000,000 已列支'}</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? 'Health Distribution' : '健康狀態佈局'}</div>
                        <div className="flex items-center gap-1.5 mt-1 font-bold text-xs">
                          <span className="text-emerald-600">{isEn ? '🟢 3 On Track' : '🟢 3 正常'}</span>
                          <span className="text-amber-600">{isEn ? '🟡 2 Risk' : '🟡 2 注意'}</span>
                          <span className="text-rose-600">{isEn ? '🔴 1 Delayed' : '🔴 1 延宕'}</span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? 'Avg Progress Velocity' : '平均推進進度'}</div>
                        <div className="text-base font-extrabold text-emerald-600 font-mono mt-1">68.5 %</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{isEn ? 'Target Milestones On Schedule' : '預計完工率穩健'}</div>
                      </div>
                    </div>

                    {/* Simulated Briefing Memo snippet */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-xl shadow-md space-y-2">
                      <div className="flex items-center justify-between border-b border-indigo-700/50 pb-2">
                        <span className="text-xs font-extrabold flex items-center gap-1.5 text-indigo-200">
                          <Sparkles className="w-4 h-4 text-amber-300" /> {isEn ? 'Executive Briefing Memo (C-Suite AI Strategic Summary)' : 'Executive Briefing Memo (C-Suite AI 戰略備忘錄)'}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-300">{isEn ? 'W24 Portfolio Digest' : 'W24 最新週報彙整'}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {isEn 
                          ? '[Key Summary] R&D and IT initiatives are progressing smoothly this week. The ESG Scope 3 Carbon Accounting Platform has entered final UAT staging. Semiconductor supply chain lead times remain under yellow alert; priority buffer allocation recommended.'
                          : '【重點摘要】本週研發與 IT 部門專案進度符合預期，永續 ESG 碳盤查系統已進入最後測試階段；供應鏈晶片交期風險仍列黃燈警戒，建議維持備料優先權。'
                        }
                      </p>
                    </div>

                    {/* Simulated Department Pulse */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-700">{isEn ? 'Department Health Pulse' : '部門專案脈搏 (Department Pulse)'}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                        <div className="p-2 rounded bg-slate-50 border border-slate-200">{isEn ? 'R&D Dept: 🟢 2 Active' : '研發部：🟢 2 專案進行中'}</div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-200">{isEn ? 'IT Info Dept: 🟡 1 At Risk' : 'IT資訊部：🟡 1 專案風險'}</div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-200">{isEn ? 'ESG Dept: 🟢 1 Active' : '永續部：🟢 1 專案進行中'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'TREND' && (
                  <div className="space-y-3">
                    <WeeklyTrendChart projects={projects} />
                  </div>
                )}

                {activeTab === 'APPROVAL' && (
                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                        <h3 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-amber-600" />
                          <span>{isEn ? 'Department N-1 / Executive Approval Gateway: Pending Baseline Change Requests' : '部門 N-1 / 高層簽核關卡：待核准專案變更 (Approval Gateway)'}</span>
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-mono font-bold">
                          {isEn ? '2 Pending Reviews' : '2 筆待審核'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5 text-xs">
                          <div className="font-bold text-slate-900">{isEn ? 'AI Smart Logistics Sorting System (PRJ-2026-001)' : '新一代 AI 智慧物流分揀系統 (PRJ-2026-001)'}</div>
                          <div className="text-[11px] text-amber-700 font-mono">{isEn ? 'Schedule Extension: 2026-09-30 → 2026-10-15' : '展延申請：2026-09-30 → 2026-10-15'}</div>
                          <div className="text-[11px] text-slate-600">{isEn ? 'Reason: Awaiting Gen-3 Sensor Software SDK integration tests' : '變更理由：等待第三代感測器軟體 SDK 更新測試'}</div>
                          <div className="pt-2 flex justify-end gap-1.5">
                            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{isEn ? 'Reject' : '退回申請'}</span>
                            <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold">{isEn ? 'Approve Baseline' : '核准並更新基線'}</span>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5 text-xs">
                          <div className="font-bold text-slate-900">{isEn ? 'Green Supply Chain Scope 3 Carbon Accounting (PRJ-2026-005)' : '綠色供應鏈範疇三碳盤查平台 (PRJ-2026-005)'}</div>
                          <div className="text-[11px] text-indigo-700 font-mono">{isEn ? 'New Milestone: EU CSRD Audit Compliance Certification' : '新增里程碑：完成歐盟 CSRD 規範查核認證'}</div>
                          <div className="text-[11px] text-slate-600">{isEn ? 'Target Completion: 2026-11-20' : '預定完成日：2026-11-20'}</div>
                          <div className="pt-2 flex justify-end gap-1.5">
                            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{isEn ? 'Reject' : '退回申請'}</span>
                            <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold">{isEn ? 'Approve Baseline' : '核准並更新基線'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'PM_EDITOR' && (
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="font-bold text-xs text-slate-900">{isEn ? 'PM Management & Weekly Log Live Editor' : '專案經理編輯模組 (PM Project Editor & Weekly Log)'}</div>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                          {isEn ? 'Live Database Sync' : '即時連動全公司資料庫'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500">{isEn ? 'Project Name' : '專案名稱'}</span>
                          <p className="font-bold text-slate-900">{isEn ? 'AI Medical Diagnostic Assist Platform' : '智慧醫療影像輔助診斷系統'}</p>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500">{isEn ? 'Total Budget & Currency' : '總預算與計價幣別'}</span>
                          <p className="font-mono font-bold text-slate-900">USD $ 850,000 (TWD $ 27,200,000)</p>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500">{isEn ? 'Progress Velocity' : '完成進度'}</span>
                          <p className="font-mono font-bold text-emerald-600">75 % (ON_TRACK)</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold text-slate-700">{isEn ? 'Core Milestone Deliverables' : '核心里程碑交付清單 (Key Deliverables)'}</div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between bg-white p-1.5 rounded border border-slate-200">
                            <span className="font-semibold text-slate-800">{isEn ? '☑️ Clinical TFDA Audit Regulatory Filing' : '☑️ 完成臨床數據 TFDA 稽核備查'}</span>
                            <span className="font-mono text-[10px] text-slate-500">2026-07-15</span>
                          </div>
                          <div className="flex items-center justify-between bg-white p-1.5 rounded border border-slate-200">
                            <span className="font-semibold text-slate-800">{isEn ? '☐ Phase 1 Hospital Staging Deployment' : '☐ 第一階段院區試行場域上線部署'}</span>
                            <span className="font-mono text-[10px] text-indigo-600 font-bold">2026-09-01</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* The Key Screenshot Bottom Gradient Fade-Out Overlay (Bottom Fade-out Effect) */}
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-white/80 to-white pointer-events-none flex items-end justify-center pb-4">
                
                {/* Floating Highlights Badges Overlay */}
                <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 px-4">
                  <span className="px-3 py-1.5 rounded-full bg-slate-900/95 text-white font-bold text-xs shadow-lg border border-slate-700 flex items-center gap-1.5 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isEn ? 'AI Portfolio Control Tower' : 'AI 專案戰情室'}</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-indigo-600/95 text-white font-bold text-xs shadow-lg border border-indigo-400/40 flex items-center gap-1.5 backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
                    <span>{isEn ? 'N-1 Baseline Approval' : 'N-1 自動簽核'}</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/95 text-slate-900 font-bold text-xs shadow-lg border border-slate-300 flex items-center gap-1.5 backdrop-blur-md">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isEn ? '24-Week Trajectory Chart' : '24週軌跡圖'}</span>
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* LinkedIn Post Text Copy Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  in
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    {isEn ? 'LinkedIn Post Copy Template (English)' : 'LinkedIn 建議貼文內文 (LinkedIn Copy Template)'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isEn ? 'One-click copy the high-converting English LinkedIn promo copy' : '一鍵複製下方文案，即可直接貼至 LinkedIn 進行行銷推廣'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyText}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEn ? 'Copied Post Content!' : '已複製貼文內文！'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{isEn ? 'Copy English Post Content' : '一鍵複製 LinkedIn 貼文內文'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800 selection:bg-indigo-500 selection:text-white">
              {currentCopies[activeTab]}
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-indigo-50/80 rounded-xl p-3.5 border border-indigo-200/80 text-xs text-indigo-900 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-indigo-950">{isEn ? '📸 How to Publish to LinkedIn:' : '📸 如何完美發佈至 LinkedIn：'}</span>
              <p className="text-[11px] text-indigo-800/90 leading-normal mt-0.5">
                {isEn 
                  ? 'Use OS screenshot shortcuts (Mac: Cmd+Shift+4 / Win: Win+Shift+S) to capture the 4 fade-out preview cards above, click "Copy English Post Content", and paste directly into your LinkedIn post!'
                  : '使用作業系統快捷鍵（Mac: Cmd+Shift+4 / Windows: Win+Shift+S）框選上方含漸層融雪效果的圖卡框，再點選「一鍵複製 LinkedIn 貼文內文」，即可快速在 LinkedIn 建立吸睛貼文！'
                }
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-2 font-mono">
            <span>{isEn ? 'ProSync AI Hub Promo Generator' : 'ProSync AI Hub 宣傳圖卡生成器'}</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">{isEn ? '4 English Cards Ready' : '4 組宣傳卡片'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isEn ? 'Close Promo Hub' : '關閉圖卡生成器'}
          </button>
        </div>

      </div>
    </div>
  );
};

