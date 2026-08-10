import React, { useState } from 'react';
import { 
  Share2, 
  Sparkles, 
  Copy, 
  Check, 
  LayoutDashboard, 
  TrendingUp, 
  FileCheck2, 
  FolderGit2, 
  ShieldCheck, 
  Globe, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { WeeklyTrendChart } from './ExecutiveView/WeeklyTrendChart';
import { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LinkedInPromoSectionProps {
  projects: Project[];
  onOpenModal: () => void;
}

export const LinkedInPromoSection: React.FC<LinkedInPromoSectionProps> = ({ projects, onOpenModal }) => {
  const { language, setLanguage } = useLanguage();
  const [modalLang, setModalLang] = useState<'en' | 'zh'>(language === 'en' ? 'en' : 'en');
  const isEn = modalLang === 'en';

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const linkedinCopiesEn = {
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

  const linkedinCopiesZh = {
    DASHBOARD: `🚀 【企業級 AI 專案戰情室】打破高層資訊迷霧，全覽跨國跨部門專案組合！

身為 C-Suite 高階主管，你是否常面臨：
❓ 各部門週報格式不一，難以精準評估預算與時程風險？
❓ 專案範圍不斷蔓延 (Scope Creep)，直到延宕才被控管？

我們的 **AI Executive Portfolio Control Tower** 帶來：
✅ 多幣別（USD/EUR/TWD/JPY/GBP/SGD）即時清算與預算花費分析
✅ 專案健康指標 (On Track / At Risk / Delayed) 與量化進度追蹤
✅ AI 戰略備忘錄，自動萃取執行要點與瓶頸洞察
✅ 部門專案脈搏 (Department Pulse)，引導 N-1 主管快速排除紅黃燈

👉 讓數據成為高層戰略決策的強力後盾！立即體驗企業級 PMO 戰情室！

#ProjectManagement #ExecutiveDashboard #AIPMO #EnterpriseLeadership #DigitalTransformation #CSuite`,

    TREND: `📈 【12~24週專案健康度推移圖】掌握趨勢動向，拒絕靜態盲區！

傳統週報只能看到「當下截圖」，無法呈現專案歷程的速度與勢頭。

**24週專案軌跡推移引擎** 提供：
📊 動態堆疊軌跡追蹤 (正常 / 警戒 / 延宕 / 已完工)
🔄 狀態變更紀錄 (Status Shift Audit Log) 自動記錄等級升降與主因
🎯 關鍵里程碑時間軸，將決策時間點與預算消耗精準連結

給予高層管理者超越時空的洞察力！

#DataVisualization #ProjectGovernance #PMO #AgileManagement #ExecutiveReporting`,

    APPROVAL: `🛡️ 【N-1 主管自動簽核關卡】防止專案基線失控，建立嚴謹治理體系！

專案時程為什麼總是一延再延？因為缺少嚴格的 **基線變更治理 (Baseline Governance)**！

**N-1 簽核關卡** 具備：
🔒 專案發起、里程碑日期展延、刪除皆須經過 formal N-1 簽核
⚡ 組織架構自動綁定，兼顧多層級授權與決策效率
📝 完整留存審核歷史紀錄與審查意見

保護專案基線，就是守護企業營運績效！

#ChangeManagement #CorporateGovernance #ApprovalWorkflow #PMO #OrganizationalEfficiency`,

    PM_EDITOR: `💼 【PM 週報與即時編輯器】極速更新專案進度，AI 智慧潤飾報告！

PM 不該把時間浪費在拉簡報格式上！

**PM Management & Live Editor** 模組：
✨ 支援 Grid / Table / Kanban 自由切換
⏱️ 直覺拖拉進度條、多幣別預算調整與里程碑 Checkbox 勾選
📝 AI 輔助產生週報摘要與阻礙排除建議文案

讓 PM 專注於執行交付，週報自動化交給 AI！

#ProjectManager #Agile #WorkplaceProductivity #PMTools #週報自動化`
  };

  const currentCopies = isEn ? linkedinCopiesEn : linkedinCopiesZh;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleLang = (lang: 'en' | 'zh') => {
    setModalLang(lang);
    setLanguage(lang);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-800/40 space-y-6 my-8 relative overflow-hidden">
      
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner Area */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>{isEn ? 'LinkedIn Promo Screenshot Cards (4 Variations)' : 'LinkedIn 宣傳圖卡生成器 (4 組精選圖卡)'}</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-mono font-bold border border-indigo-400/40">
                Gradient Fade-Out Active
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1">
              {isEn 
                ? 'High-fidelity product cards with melted gradient fade-out effect and English/Chinese LinkedIn post text, ready for social sharing.'
                : '具備底部漸層融雪消失效果 (Gradient Fade-Out) 的精選產品介面圖卡，附一鍵複製英文/中文 LinkedIn 行銷內文！'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher Button */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => handleToggleLang('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isEn ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇺🇸 English</span>
            </button>
            <button
              onClick={() => handleToggleLang('zh')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isEn ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇹🇼 繁體中文</span>
            </button>
          </div>

          <button
            onClick={onOpenModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer border border-blue-400/30"
          >
            <span>{isEn ? 'Open Fullscreen Center' : '全螢幕檢視與複製'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of 4 LinkedIn Promo Cards with Gradient Fade-Out Effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">

        {/* Card 1: Executive AI Dashboard */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col shadow-xl group hover:border-indigo-500/60 transition-all">
          <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs text-white">
                {isEn ? 'Card 1: Executive AI Control Tower' : '圖卡 1：高階 AI 戰情室'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Preview
            </span>
          </div>

          {/* Screenshot Container with Melt Gradient Fade-Out */}
          <div className="relative bg-slate-100 text-slate-900 p-4 space-y-3 min-h-[220px] select-none">
            {/* Inner Dashboard Mockup */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[9px] text-slate-400 uppercase font-bold">{isEn ? 'Total Budget' : '全公司總預算'}</div>
                <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">{isEn ? 'USD $ 4,250,000' : 'NT$ 128,500,000'}</div>
                <div className="text-[9px] text-emerald-600 font-medium">{isEn ? 'Multi-Currency Cleared' : '多幣別清算完成'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[9px] text-slate-400 uppercase font-bold">{isEn ? 'Spent Rate' : '預算支用率'}</div>
                <div className="text-sm font-extrabold text-indigo-600 font-mono mt-0.5">42.8 %</div>
                <div className="text-[9px] text-slate-500">{isEn ? 'USD $ 1.82M Spent' : 'NT$ 5,500萬已列支'}</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-3 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] text-indigo-200 font-bold">
                <span>✨ C-Suite Strategic Memo</span>
                <span className="font-mono text-indigo-300">W24 Digest</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-snug">
                {isEn 
                  ? 'R&D and ESG Scope 3 initiatives are progressing on schedule. Semiconductor lead times remain under yellow alert.'
                  : '研發與永續 ESG 碳盤查系統符合預期；供應鏈晶片交期風險仍列黃燈警戒。'
                }
              </p>
            </div>

            {/* Gradient Fade-Out Bottom Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none flex items-end justify-center pb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-[10px] shadow-lg border border-indigo-400/40 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isEn ? 'Executive AI Control Tower' : '高階 AI 戰情室'}</span>
              </span>
            </div>
          </div>

          {/* Copy Post Text Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 mt-auto">
            <span className="text-[11px] font-mono text-slate-400 truncate">
              {isEn ? 'LinkedIn Post Template (English)' : 'LinkedIn 宣傳文案 (繁體中文)'}
            </span>
            <button
              onClick={() => handleCopy('DASHBOARD', currentCopies.DASHBOARD)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                copiedId === 'DASHBOARD'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40'
              }`}
            >
              {copiedId === 'DASHBOARD' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copied!' : '已複製！'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copy Post Text' : '一鍵複製貼文'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: 12~24 Week Trajectory Chart */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col shadow-xl group hover:border-indigo-500/60 transition-all">
          <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs text-white">
                {isEn ? 'Card 2: 12~24 Wk Trajectory Chart' : '圖卡 2：12~24週推移圖表'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
              Trajectory Engine
            </span>
          </div>

          {/* Screenshot Container with Melt Gradient Fade-Out */}
          <div className="relative bg-slate-100 text-slate-900 p-4 space-y-3 min-h-[220px] select-none">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <WeeklyTrendChart projects={projects} />
            </div>

            {/* Gradient Fade-Out Bottom Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none flex items-end justify-center pb-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-bold text-[10px] shadow-lg border border-slate-700 backdrop-blur-md flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-indigo-400" />
                <span>{isEn ? '24-Week Trajectory Analytics' : '24週動態軌跡圖'}</span>
              </span>
            </div>
          </div>

          {/* Copy Post Text Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 mt-auto">
            <span className="text-[11px] font-mono text-slate-400 truncate">
              {isEn ? 'LinkedIn Post Template (English)' : 'LinkedIn 宣傳文案 (繁體中文)'}
            </span>
            <button
              onClick={() => handleCopy('TREND', currentCopies.TREND)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                copiedId === 'TREND'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40'
              }`}
            >
              {copiedId === 'TREND' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copied!' : '已複製！'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copy Post Text' : '一鍵複製貼文'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 3: N-1 Manager Approval Gateway */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col shadow-xl group hover:border-indigo-500/60 transition-all">
          <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs text-white">
                {isEn ? 'Card 3: N-1 Approval Gateway' : '圖卡 3：N-1 主管簽核關卡'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Governance
            </span>
          </div>

          {/* Screenshot Container with Melt Gradient Fade-Out */}
          <div className="relative bg-amber-50/90 text-slate-900 p-4 space-y-3 min-h-[220px] select-none">
            <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs border-b border-amber-100 pb-1.5">
                <span className="font-bold text-slate-900">{isEn ? 'AI Smart Logistics Sorting System' : 'AI 智慧物流分揀系統'}</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                  {isEn ? 'Pending Review' : '待簽核'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 font-mono">
                {isEn ? 'Schedule Extension: 2026-09-30 → 2026-10-15' : '展延申請：2026-09-30 → 2026-10-15'}
              </p>
              <div className="flex justify-end gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{isEn ? 'Reject' : '退回'}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">{isEn ? 'Approve' : '核准'}</span>
              </div>
            </div>

            {/* Gradient Fade-Out Bottom Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none flex items-end justify-center pb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-[10px] shadow-lg border border-indigo-400/40 backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-200" />
                <span>{isEn ? 'N-1 Baseline Approval Gateway' : 'N-1 自動簽核關卡'}</span>
              </span>
            </div>
          </div>

          {/* Copy Post Text Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 mt-auto">
            <span className="text-[11px] font-mono text-slate-400 truncate">
              {isEn ? 'LinkedIn Post Template (English)' : 'LinkedIn 宣傳文案 (繁體中文)'}
            </span>
            <button
              onClick={() => handleCopy('APPROVAL', currentCopies.APPROVAL)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                copiedId === 'APPROVAL'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40'
              }`}
            >
              {copiedId === 'APPROVAL' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copied!' : '已複製！'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copy Post Text' : '一鍵複製貼文'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 4: PM Weekly Log & Live Editor */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col shadow-xl group hover:border-indigo-500/60 transition-all">
          <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-white">
                {isEn ? 'Card 4: PM Weekly Log & Live Editor' : '圖卡 4：PM 週報與編輯器'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              PM Execution
            </span>
          </div>

          {/* Screenshot Container with Melt Gradient Fade-Out */}
          <div className="relative bg-slate-100 text-slate-900 p-4 space-y-3 min-h-[220px] select-none">
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{isEn ? 'AI Medical Diagnostic Assist Platform' : '智慧醫療影像輔助診斷系統'}</span>
                <span className="font-mono text-emerald-600 font-bold">75 % (ON_TRACK)</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[10px] font-semibold text-slate-700">
                {isEn ? '☑️ Clinical TFDA Audit Regulatory Filing Complete' : '☑️ 完成臨床數據 TFDA 稽核備查'}
              </div>
            </div>

            {/* Gradient Fade-Out Bottom Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none flex items-end justify-center pb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] shadow-lg border border-emerald-400/40 backdrop-blur-md flex items-center gap-1">
                <FolderGit2 className="w-3 h-3 text-emerald-200" />
                <span>{isEn ? 'PM Weekly Reporting & Live Sync' : 'PM 週報與即時編輯器'}</span>
              </span>
            </div>
          </div>

          {/* Copy Post Text Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 mt-auto">
            <span className="text-[11px] font-mono text-slate-400 truncate">
              {isEn ? 'LinkedIn Post Template (English)' : 'LinkedIn 宣傳文案 (繁體中文)'}
            </span>
            <button
              onClick={() => handleCopy('PM_EDITOR', currentCopies.PM_EDITOR)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                copiedId === 'PM_EDITOR'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40'
              }`}
            >
              {copiedId === 'PM_EDITOR' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copied!' : '已複製！'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copy Post Text' : '一鍵複製貼文'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
