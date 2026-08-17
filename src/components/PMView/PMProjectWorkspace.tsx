import React, { useState, useEffect } from 'react';
import { Project, Department, StrategicPriority, HealthStatus, Currency, KeyDeliverable, ProjectUpdate } from '../../types';
import { CURRENCY_LIST, formatCurrency } from '../../utils/currencyUtils';
import { HealthBadge } from '../common/HealthBadge';
import { ProgressBar } from '../common/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  Sparkles,
  Save,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Target,
  DollarSign,
  User,
  Building2,
  Calendar,
  Plus,
  Trash2,
  Clock,
  Check,
  FileText,
  Sliders,
  Eye,
  History,
  Layers,
  ShieldCheck,
  Zap,
  HelpCircle,
  Briefcase,
  X,
  FileCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

interface PMProjectWorkspaceProps {
  project: Project;
  onBack: () => void;
  onSaveProject: (updatedProject: Project) => void;
  onSubmitPMUpdate: (projectId: string, update: ProjectUpdate) => void;
  departmentsList: string[];
  initialTab?: 'WEEKLY_UPDATE' | 'CORE_SETTINGS' | 'DELIVERABLES' | 'HISTORY';
}

export const PMProjectWorkspace: React.FC<PMProjectWorkspaceProps> = ({
  project,
  onBack,
  onSaveProject,
  onSubmitPMUpdate,
  departmentsList,
  initialTab = 'WEEKLY_UPDATE'
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'WEEKLY_UPDATE' | 'CORE_SETTINGS' | 'DELIVERABLES' | 'HISTORY'>(initialTab);

  // Tab 1: Weekly Update State
  const [progress, setProgress] = useState<number>(project.currentProgress);
  const [status, setStatus] = useState<HealthStatus>(project.health);
  const [achievementsText, setAchievementsText] = useState<string>(() => {
    if (project.updates && project.updates.length > 0) {
      return project.updates[0].keyAchievements.map((item) => `• ${item}`).join('\n');
    }
    return isEn ? '• Completed core sprint deliverables\n• Conducted preliminary integration testing' : '• 完成本週核心衝刺交付物\n• 進行跨模組整合測試與驗收';
  });
  const [risksText, setRisksText] = useState<string>(() => {
    if (project.updates && project.updates.length > 0) {
      return project.updates[0].risksAndBlockers;
    }
    return '';
  });
  const [assistanceText, setAssistanceText] = useState<string>(() => {
    if (project.updates && project.updates.length > 0) {
      return project.updates[0].managementAssistanceNeeded;
    }
    return '';
  });
  const [nextMilestonesText, setNextMilestonesText] = useState<string>(() => {
    if (project.updates && project.updates.length > 0 && project.updates[0].nextMilestones) {
      return project.updates[0].nextMilestones.map((item) => `• ${item}`).join('\n');
    }
    return isEn ? '• Release beta candidate for stakeholder review\n• Finalize security audit report' : '• 交付 Beta 候選版本予利害關係人審閱\n• 完成安全性評估與合規審計清冊';
  });

  // AI Polish State
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);
  const [polishedSuccess, setPolishedSuccess] = useState(false);
  const [updateSavedSuccess, setUpdateSavedSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  // Tab 2: Core Settings State
  const [name, setName] = useState(project.name);
  const [code, setCode] = useState(project.code);
  const [department, setDepartment] = useState<Department>(project.department);
  const [leadPm, setLeadPm] = useState(project.leadPm);
  const [strategicPriority, setStrategicPriority] = useState<StrategicPriority>(project.strategicPriority);
  const [currency, setCurrency] = useState<Currency>(project.currency || 'TWD');
  const [totalBudget, setTotalBudget] = useState<number>(project.totalBudget);
  const [spentBudget, setSpentBudget] = useState<number>(project.spentBudget);
  const [targetCompletionDate, setTargetCompletionDate] = useState(project.targetCompletionDate);
  const [description, setDescription] = useState(project.description);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Tab 3: Key Deliverables State
  const [deliverables, setDeliverables] = useState<KeyDeliverable[]>(project.keyDeliverables || []);

  useEffect(() => {
    setName(project.name);
    setCode(project.code);
    setDepartment(project.department);
    setLeadPm(project.leadPm);
    setStrategicPriority(project.strategicPriority);
    setCurrency(project.currency || 'TWD');
    setTotalBudget(project.totalBudget);
    setSpentBudget(project.spentBudget);
    setTargetCompletionDate(project.targetCompletionDate);
    setDescription(project.description);
    setDeliverables(project.keyDeliverables || []);
  }, [project]);

  // AI Polish Handler
  const handlePolishWithAI = async () => {
    setIsPolishing(true);
    setPolishError(null);
    setPolishedSuccess(false);

    try {
      const res = await fetch('/api/ai/polish-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawAchievements: achievementsText,
          rawBlockers: risksText,
          rawAssistance: assistanceText,
        }),
      });

      if (!res.ok) {
        throw new Error(isEn ? 'AI polish service is temporarily unavailable' : 'AI 潤飾服務暫時無法連線');
      }

      const data = await res.json();
      if (data.polishedAchievements && Array.isArray(data.polishedAchievements)) {
        setAchievementsText(data.polishedAchievements.map((item: string) => `• ${item}`).join('\n'));
      }
      if (data.polishedBlockers) {
        setRisksText(data.polishedBlockers);
      }
      if (data.polishedAssistance) {
        setAssistanceText(data.polishedAssistance);
      }

      setPolishedSuccess(true);
      setTimeout(() => setPolishedSuccess(false), 3500);
    } catch (err: any) {
      console.error('AI Polish Error:', err);
      setPolishError(err.message || (isEn ? 'Polish failed' : '潤飾失敗'));
    } finally {
      setIsPolishing(false);
    }
  };

  // Submit Weekly Update Handler
  const handleWeeklyUpdateSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const achievementsList = achievementsText
      .split('\n')
      .map((line) => line.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter((line) => line.length > 0);

    const milestonesList = nextMilestonesText
      .split('\n')
      .map((line) => line.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter((line) => line.length > 0);

    const newUpdate: ProjectUpdate = {
      id: `upd-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      pmName: leadPm || project.leadPm,
      progress: Number(progress),
      status,
      keyAchievements: achievementsList.length > 0 ? achievementsList : [isEn ? 'Project progressing' : '專案推進中'],
      risksAndBlockers: risksText.trim(),
      managementAssistanceNeeded: assistanceText.trim(),
      nextMilestones: milestonesList,
    };

    onSubmitPMUpdate(project.id, newUpdate);
    setUpdateSavedSuccess(true);
    const now = new Date();
    setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    setTimeout(() => setUpdateSavedSuccess(false), 3500);
  };

  // Deliverables Handlers
  const handleAddDeliverable = () => {
    const newDel: KeyDeliverable = {
      id: `del-${Date.now()}`,
      title: isEn ? 'New key deliverable item' : '新里程碑交付項目',
      dueDate: targetCompletionDate || new Date().toISOString().split('T')[0],
      completed: false,
    };
    const nextList = [...deliverables, newDel];
    setDeliverables(nextList);

    const updated: Project = {
      ...project,
      keyDeliverables: nextList,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onSaveProject(updated);
  };

  const handleToggleDeliverable = (id: string) => {
    const nextList = deliverables.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d));
    setDeliverables(nextList);

    const updated: Project = {
      ...project,
      keyDeliverables: nextList,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onSaveProject(updated);
  };

  const handleUpdateDeliverable = (id: string, field: keyof KeyDeliverable, value: any) => {
    const nextList = deliverables.map((d) => (d.id === id ? { ...d, [field]: value } : d));
    setDeliverables(nextList);

    const updated: Project = {
      ...project,
      keyDeliverables: nextList,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onSaveProject(updated);
  };

  const handleRemoveDeliverable = (id: string) => {
    const nextList = deliverables.filter((d) => d.id !== id);
    setDeliverables(nextList);

    const updated: Project = {
      ...project,
      keyDeliverables: nextList,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onSaveProject(updated);
  };

  // Save Core Settings Handler
  const handleSaveCoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !leadPm.trim()) {
      alert(isEn ? 'Please fill in Project Name and Lead PM!' : '請完整填寫專案名稱與主責 PM！');
      return;
    }

    const updated: Project = {
      ...project,
      name: name.trim(),
      code: code.trim(),
      department,
      leadPm: leadPm.trim(),
      strategicPriority,
      currency,
      totalBudget: Number(totalBudget),
      spentBudget: Number(spentBudget),
      targetCompletionDate,
      description: description.trim(),
      keyDeliverables: deliverables,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveProject(updated);
    setSettingsSavedSuccess(true);
    const now = new Date();
    setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  // Parse achievements for live preview
  const parsedAchievements = achievementsText
    .split('\n')
    .map((line) => line.replace(/^[•\-\*\d\.]+\s*/, '').trim())
    .filter((line) => line.length > 0);

  const parsedMilestones = nextMilestonesText
    .split('\n')
    .map((line) => line.replace(/^[•\-\*\d\.]+\s*/, '').trim())
    .filter((line) => line.length > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-24 font-sans animate-in fade-in duration-200">
      
      {/* 1. IMMERSIVE STUDIO TOP BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Studio Identity & Back button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer border border-slate-700/80 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-teal-400" />
              <span>{isEn ? 'Exit Studio' : '退出工作台'}</span>
            </button>

            <div className="h-5 w-px bg-slate-700 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                  {project.code}
                </span>
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight truncate max-w-[240px] sm:max-w-md">
                  {project.name}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  <Zap className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />
                  Studio Focus
                </span>
              </div>
            </div>
          </div>

          {/* Center: Stage Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto text-xs scrollbar-none">
            <button
              onClick={() => setActiveTab('WEEKLY_UPDATE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'WEEKLY_UPDATE'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? '1. Weekly Update & AI' : '1. 週報填報 & AI 潤飾'}</span>
            </button>

            <button
              onClick={() => setActiveTab('CORE_SETTINGS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'CORE_SETTINGS'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEn ? '2. Settings & Budget' : '2. 基礎與預算'}</span>
            </button>

            <button
              onClick={() => setActiveTab('DELIVERABLES')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'DELIVERABLES'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{isEn ? '3. Milestones' : '3. 里程碑交付物'}</span>
            </button>

            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'HISTORY'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{isEn ? '4. History' : '4. 歷史週報'}</span>
            </button>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">
              {isEn ? `Saved: ${lastSavedTime}` : `最後同步: ${lastSavedTime}`}
            </span>

            <button
              type="button"
              onClick={handlePolishWithAI}
              disabled={isPolishing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isPolishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isEn ? 'Polishing...' : 'AI 潤飾中...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isEn ? 'AI Polish' : '✨ AI 高管潤飾'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleWeeklyUpdateSubmit()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEn ? 'Publish Update' : '發佈週報'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN WORKBENCH CANVAS */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* TAB 1: SPLIT SCREEN (LEFT PM WORKBENCH + RIGHT EXECUTIVE BRIEFING PAPER) */}
        {activeTab === 'WEEKLY_UPDATE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: THE PM WRITING WORKBENCH (7 COLS) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-xs">
                    ✍️
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      {isEn ? 'PM Weekly Status Entry' : '第一線 PM 週報填報區'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isEn ? 'Input project status. Real-time rendering preview on the right.' : '請如實填寫執行成果與現場卡點，右側將即時渲染成高管簡報紙。'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAchievementsText(
                        isEn
                          ? '• Completed Phase 2 architecture deployment\n• Cleared 100% of high priority bugs\n• Conducted end-user pilot onboarding'
                          : '• 完成第二階段雲端架構部署與連線\n• 清零所有一級阻礙性缺陷 (Severity-1 Bugs)\n• 啟動第一批核心使用者上線試行培訓'
                      );
                      setRisksText(
                        isEn
                          ? 'Vendor SDK upgrade delayed by 3 business days; requires fallback mitigation.'
                          : '第三方供應商 SDK 釋出延遲 3 個工作天，已啟動備援相容套件降級運行。'
                      );
                      setAssistanceText(
                        isEn
                          ? 'Request VP approval to sign addendum for supplementary cloud hosting credits.'
                          : '請求處長/副總協助簽核追加雲端主機測試額度 (NT$ 60,000)。'
                      );
                    }}
                    className="text-[11px] text-teal-400 hover:text-teal-300 underline cursor-pointer"
                  >
                    {isEn ? 'Insert PM Sample' : '帶入範例草稿'}
                  </button>
                </div>
              </div>

              {/* Polish Alert Banners */}
              {polishedSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Gemini AI has polished your input into executive tone!' : '✨ AI 已成功潤飾！語句已轉化為高管戰略與具體行動導向格式。'}</span>
                </div>
              )}

              {polishError && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{polishError}</span>
                </div>
              )}

              <form onSubmit={handleWeeklyUpdateSubmit} className="space-y-4 text-xs">
                
                {/* Progress & Health Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                      <span>{isEn ? 'Current Progress' : '本週最新進度達成率'}</span>
                      <span className="font-mono text-teal-400 text-sm font-bold">{progress}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>0% (Kickoff)</span>
                      <span>50%</span>
                      <span>100% (Completed)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      {isEn ? 'Health Assessment' : '專案燈號評估'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['ON_TRACK', 'AT_RISK', 'DELAYED'] as HealthStatus[]).map((hs) => (
                        <button
                          key={hs}
                          type="button"
                          onClick={() => setStatus(hs)}
                          className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer ${
                            status === hs
                              ? hs === 'ON_TRACK'
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                                : hs === 'AT_RISK'
                                ? 'bg-amber-500 text-white border-amber-400 shadow-xs'
                                : 'bg-rose-600 text-white border-rose-500 shadow-xs'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {hs === 'ON_TRACK' ? (isEn ? 'On Track' : '🟢 正常') : hs === 'AT_RISK' ? (isEn ? 'At Risk' : '🟡 預警') : (isEn ? 'Delayed' : '🔴 落後')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {isEn ? 'Key Achievements This Week' : '本週關鍵進展與成果 (Key Achievements)'}
                    </label>
                    <span className="text-[10px] text-slate-500">{isEn ? 'One bullet per line' : '一行一項'}</span>
                  </div>
                  <textarea
                    rows={4}
                    value={achievementsText}
                    onChange={(e) => setAchievementsText(e.target.value)}
                    placeholder={isEn ? '• Delivered core APIs\n• Closed sprint issues' : '• 完成系統架構驗收\n• 與供應商簽署服務協定'}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono text-xs leading-relaxed"
                  />
                </div>

                {/* Risks & Blockers */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    {isEn ? 'Risks, Blockers & Bottlenecks' : '遭遇瓶頸、卡點與潛在風險 (Blockers & Risks)'}
                  </label>
                  <textarea
                    rows={3}
                    value={risksText}
                    onChange={(e) => setRisksText(e.target.value)}
                    placeholder={isEn ? 'Describe obstacles, vendor delays, or resource constraints...' : '填寫現場遭遇的瓶頸（如晶片交期延後、跨單位資源衝突等）...'}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-400 text-xs leading-relaxed"
                  />
                </div>

                {/* Management Assistance */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                    {isEn ? 'Management Assistance Needed' : '需要管理層/處長/C-Suite 支援事項 (Executive Support Requested)'}
                  </label>
                  <textarea
                    rows={2}
                    value={assistanceText}
                    onChange={(e) => setAssistanceText(e.target.value)}
                    placeholder={isEn ? 'e.g. Need executive alignment, supplementary budget...' : '例如：需要副總協調研發處人力支援、追加 NT$ 50 萬外包預算...'}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-400 text-xs leading-relaxed"
                  />
                </div>

                {/* Next Milestones */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-teal-400" />
                    {isEn ? 'Next Week Key Milestones' : '下週預計交付里程碑 (Next Key Deliverables)'}
                  </label>
                  <textarea
                    rows={3}
                    value={nextMilestonesText}
                    onChange={(e) => setNextMilestonesText(e.target.value)}
                    placeholder={isEn ? '• Release beta candidate\n• Deploy to staging' : '• 完成主伺服器驗證\n• 提交變更審核報告'}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono text-xs leading-relaxed"
                  />
                </div>

              </form>
            </div>

            {/* RIGHT COLUMN: THE REALISTIC "EXECUTIVE BRIEFING PAPER" SIMULATION (5 COLS) */}
            <div className="lg:col-span-5 space-y-3">
              
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    {isEn ? 'Live C-Suite Briefing Paper' : '📄 高管決策剪報即時渲染'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  CEO / GM View
                </span>
              </div>

              {/* The Physical Paper Effect Card */}
              <div className="bg-[#FAF9F6] text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border-4 border-amber-900/10 relative overflow-hidden space-y-5">
                
                {/* Paper Header & Stamp */}
                <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-black tracking-widest text-slate-500 uppercase">
                      PROSYNC EXECUTIVE DISPATCH
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight mt-0.5">
                      {project.name}
                    </h3>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">
                      {project.department} • Ref: {project.code}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <HealthBadge status={status} size="sm" />
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {new Date().toISOString().split('T')[0]}
                    </div>
                  </div>
                </div>

                {/* PM Signoff & Progress Gauge */}
                <div className="grid grid-cols-2 gap-3 py-2 bg-slate-100/80 rounded-xl px-3 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">{isEn ? 'Reporting Lead PM' : '彙報主責 PM'}</span>
                    <span className="font-bold text-slate-900">{leadPm || project.leadPm}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">{isEn ? 'Progress Rate' : '進度達成率'}</span>
                    <span className="font-mono font-black text-slate-950 text-sm">{progress}%</span>
                  </div>
                </div>

                {/* Progress Bar in Paper */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        status === 'ON_TRACK' ? 'bg-emerald-600' : status === 'AT_RISK' ? 'bg-amber-500' : 'bg-rose-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Achievements / Key Wins Section */}
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 border-b border-emerald-200 pb-1">
                    <Trophy className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEn ? 'Key Breakthroughs & Wins' : '本週關鍵進展與成果'}</span>
                  </div>
                  {parsedAchievements.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-800 pl-1">
                      {parsedAchievements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">{isEn ? 'No key achievements logged yet' : '尚未填寫本週成果'}</p>
                  )}
                </div>

                {/* Risk Alert Box */}
                {risksText.trim() && (
                  <div className="p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-950 space-y-1 rounded-r-xl">
                    <div className="text-[11px] font-black uppercase text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{isEn ? 'Executive Risk Notice' : '高管風險示警'}</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed">{risksText}</p>
                  </div>
                )}

                {/* Assistance Request Box */}
                {assistanceText.trim() && (
                  <div className="p-3 bg-indigo-50 border-l-4 border-indigo-600 text-indigo-950 space-y-1 rounded-r-xl">
                    <div className="text-[11px] font-black uppercase text-indigo-800 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isEn ? 'Executive Action Required' : '請求總經理 / 處長批示'}</span>
                    </div>
                    <p className="text-xs text-indigo-900 leading-relaxed">{assistanceText}</p>
                  </div>
                )}

                {/* Next Milestones Section */}
                {parsedMilestones.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                      {isEn ? 'Next Delivery Checkpoints' : '下週預計交付檢查點'}
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {parsedMilestones.map((m, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-teal-700 font-bold">›</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Paper Footer Seal */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>PROSYNC GOVERNANCE SYSTEM</span>
                  <span className="font-bold text-slate-700">VERIFIED STATUS</span>
                </div>

              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span>
                  {isEn
                    ? 'This real-time rendering shows exactly what the Executive Board will see during their weekly alignment review.'
                    : '右側紙張排版將 100% 忠實對應週一總經理與各處長在高管儀表板上看到的彙報樣式。'}
                </span>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CORE SETTINGS & BUDGET */}
        {activeTab === 'CORE_SETTINGS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  {isEn ? 'Project Metadata & Budget Configuration' : '專案基礎資料與財務預算維護'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn ? 'Configure project codes, departments, lead PM, and financial limits.' : '維護專案基礎設定、主責單位、主責 PM 與預算池上限。'}
                </p>
              </div>
            </div>

            {settingsSavedSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isEn ? 'Project settings updated successfully!' : '專案基礎設定已成功儲存並同步！'}</span>
              </div>
            )}

            <form onSubmit={handleSaveCoreSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    {isEn ? 'Project Code' : '專案代號'}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono font-bold text-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-300 block mb-1">
                    {isEn ? 'Project Name' : '專案名稱'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {isEn ? 'Department' : '負責部門'}
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {isEn ? 'Lead PM' : '主責 PM'}
                  </label>
                  <input
                    type="text"
                    value={leadPm}
                    onChange={(e) => setLeadPm(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {isEn ? 'Target Completion' : '預計結案日期'}
                  </label>
                  <input
                    type="date"
                    value={targetCompletionDate}
                    onChange={(e) => setTargetCompletionDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>
              </div>

              {/* Financial Budget */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {isEn ? 'Financial & Budget Pool' : '專案預算與財務額度'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isEn ? 'Currency' : '幣別'}</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                      className="w-full p-2 rounded-lg border border-slate-800 bg-slate-900 text-xs font-mono text-slate-200"
                    >
                      {CURRENCY_LIST.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isEn ? 'Total Budget' : '總預算額度'}</label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-800 bg-slate-900 text-xs font-mono font-bold text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isEn ? 'Spent Budget' : '已累計消耗'}</label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={spentBudget}
                      onChange={(e) => setSpentBudget(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-800 bg-slate-900 text-xs font-mono font-bold text-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  {isEn ? 'Project Scope & Purpose' : '專案目標與範疇說明'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Save Project Settings' : '儲存專案設定'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: KEY DELIVERABLES & MILESTONES */}
        {activeTab === 'DELIVERABLES' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-400" />
                  {isEn ? 'Key Deliverables & Milestones Schedule' : '關鍵里程碑與階段交付物清冊'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn ? 'Maintain key delivery checkpoints. Check off as items complete.' : '維護專案各階段里程碑，即時勾選完成進度並更新完成率。'}
                </p>
              </div>

              <button
                onClick={handleAddDeliverable}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? 'Add Deliverable' : '新增里程碑交付物'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {deliverables.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <Target className="w-8 h-8 mx-auto mb-2 text-slate-600 stroke-1" />
                  {isEn ? 'No deliverables configured. Click above to add.' : '目前無里程碑，請點擊上方按鈕新增交付物。'}
                </div>
              ) : (
                deliverables.map((del) => (
                  <div
                    key={del.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      del.completed
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => handleToggleDeliverable(del.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                          del.completed
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1">
                        <input
                          type="text"
                          value={del.title}
                          onChange={(e) => handleUpdateDeliverable(del.id, 'title', e.target.value)}
                          className={`w-full bg-transparent font-medium text-xs focus:outline-none focus:bg-slate-900 focus:p-1 focus:rounded ${
                            del.completed ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <input
                          type="date"
                          value={del.dueDate}
                          onChange={(e) => handleUpdateDeliverable(del.id, 'dueDate', e.target.value)}
                          className="bg-transparent text-xs text-slate-200 focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveDeliverable(del.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title={isEn ? 'Delete item' : '刪除此項目'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: UPDATE HISTORY TIMELINE */}
        {activeTab === 'HISTORY' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-teal-400" />
                {isEn ? 'Historical PM Update Log & Audit Trail' : '歷史週報履歷與變更紀錄'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? 'Full chronology of status submissions for executive auditing.' : '完整保留歷次週報回報之進度、關鍵亮點與卡點履歷。'}
              </p>
            </div>

            <div className="space-y-4">
              {(!project.updates || project.updates.length === 0) ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  {isEn ? 'No previous weekly updates logged for this project.' : '目前尚無歷史週報紀錄。'}
                </div>
              ) : (
                project.updates.map((upd, idx) => (
                  <div key={upd.id || idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{upd.date}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">PM: {upd.pmName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/60">
                          {upd.progress}%
                        </span>
                        <HealthBadge status={upd.status} size="sm" />
                      </div>
                    </div>

                    {/* Achievements */}
                    {upd.keyAchievements && upd.keyAchievements.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">{isEn ? 'Key Achievements:' : '關鍵成果：'}</span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                          {upd.keyAchievements.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Blockers */}
                    {upd.risksAndBlockers && (
                      <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-lg text-rose-200">
                        <span className="font-bold text-[10px] uppercase block mb-0.5 text-rose-300">{isEn ? 'Blockers / Risks:' : '瓶頸與風險：'}</span>
                        <p>{upd.risksAndBlockers}</p>
                      </div>
                    )}

                    {/* Assistance */}
                    {upd.managementAssistanceNeeded && (
                      <div className="p-2.5 bg-indigo-950/40 border border-indigo-800/40 rounded-lg text-indigo-200">
                        <span className="font-bold text-[10px] uppercase block mb-0.5 text-indigo-300">{isEn ? 'Assistance Needed:' : '需要主管支援：'}</span>
                        <p>{upd.managementAssistanceNeeded}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* 3. STICKY BOTTOM FLOATING ACTION BAR */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-slate-300 font-medium hidden sm:inline">
              {updateSavedSuccess ? (
                <span className="text-emerald-400 font-bold">{isEn ? 'Published & Synced!' : '已成功同步至全公司大盤！'}</span>
              ) : (
                isEn ? `Live draft ready (${lastSavedTime})` : `草稿準備就緒 (${lastSavedTime})`
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
            >
              {isEn ? 'Discard' : '放棄並退出'}
            </button>

            <button
              onClick={handlePolishWithAI}
              disabled={isPolishing}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEn ? 'AI Polish' : 'AI 潤飾'}</span>
            </button>

            <button
              onClick={() => handleWeeklyUpdateSubmit()}
              className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEn ? 'Publish to Board' : '🚀 發佈至全公司大盤'}</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
