import React, { useState, useMemo } from 'react';
import { Project, ExecutiveBriefing, Department, HealthStatus, MilestoneChangeRequest, Currency, ExecutiveDecisionRecord, CriticalRiskItem } from '../../types';
import { HealthBadge } from '../common/HealthBadge';
import { ProgressBar } from '../common/ProgressBar';
import { ExecutiveBriefingCard } from './ExecutiveBriefingCard';
import { WeeklyTrendChart } from './WeeklyTrendChart';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CURRENCY_LIST, 
  CURRENCIES, 
  formatCurrency, 
  convertCurrency, 
  calculateExecutivePortfolioBudget 
} from '../../utils/currencyUtils';
import { 
  Building2, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ArrowUpRight,
  Briefcase,
  Layers,
  Sparkles,
  FileCheck2,
  Check,
  Ban,
  Lock,
  Clock,
  Coins,
  Globe
} from 'lucide-react';

interface ExecutiveDashboardProps {
  projects: Project[];
  briefing: ExecutiveBriefing;
  decisions?: ExecutiveDecisionRecord[];
  onUpdateBriefing: (briefing: ExecutiveBriefing) => void;
  onSelectProject: (projectId: string) => void;
  onOpenLogUpdate: (project: Project) => void;
  onOpenEditProject?: (project: Project) => void;
  onReviewMilestoneRequest?: (projectId: string, requestId: string, action: 'APPROVE' | 'REJECT', comment?: string) => void;
  onOpenApprovalGateway?: () => void;
  onOpenLinkedInModal?: () => void;
  onOpenCaptureDecision?: (riskItem: CriticalRiskItem) => void;
  onOpenSystemOfRecord?: () => void;
  onOpenAIQA?: (question: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  projects,
  briefing,
  decisions = [],
  onUpdateBriefing,
  onSelectProject,
  onOpenLogUpdate,
  onOpenEditProject,
  onReviewMilestoneRequest,
  onOpenApprovalGateway,
  onOpenLinkedInModal,
  onOpenCaptureDecision,
  onOpenSystemOfRecord,
  onOpenAIQA
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [executiveCurrency, setExecutiveCurrency] = useState<Currency>('TWD');

  // Metrics calculation
  const totalProjects = projects.length;
  const onTrackProjects = projects.filter((p) => p.health === 'ON_TRACK');
  const atRiskProjects = projects.filter((p) => p.health === 'AT_RISK');
  const delayedProjects = projects.filter((p) => p.health === 'DELAYED');

  const onTrackPercent = totalProjects > 0 ? Math.round((onTrackProjects.length / totalProjects) * 100) : 0;

  // Executive budget calculation converted to executiveCurrency
  const budgetSummary = useMemo(() => {
    return calculateExecutivePortfolioBudget(projects, executiveCurrency);
  }, [projects, executiveCurrency]);

  // Department aggregates converted to executiveCurrency
  const departmentStats = useMemo(() => {
    const map = new Map<Department, { count: number; onTrack: number; atRisk: number; delayed: number; totalBudgetInTarget: number; totalSpentInTarget: number }>();

    projects.forEach((p) => {
      const current = map.get(p.department) || { count: 0, onTrack: 0, atRisk: 0, delayed: 0, totalBudgetInTarget: 0, totalSpentInTarget: 0 };
      current.count += 1;
      if (p.health === 'ON_TRACK') current.onTrack += 1;
      if (p.health === 'AT_RISK') current.atRisk += 1;
      if (p.health === 'DELAYED') current.delayed += 1;
      
      const pCurrency = p.currency || 'TWD';
      current.totalBudgetInTarget += convertCurrency(p.totalBudget, pCurrency, executiveCurrency);
      current.totalSpentInTarget += convertCurrency(p.spentBudget, pCurrency, executiveCurrency);
      map.set(p.department, current);
    });

    return Array.from(map.entries()).map(([dept, data]) => ({
      department: dept,
      ...data,
      healthPercent: data.count > 0 ? Math.round(((data.onTrack + data.count - data.delayed - data.atRisk * 0.5) / data.count) * 100) : 0,
    }));
  }, [projects, executiveCurrency]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedDepartment !== 'ALL' && p.department !== selectedDepartment) return false;
      if (selectedStatus !== 'ALL' && p.health !== selectedStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.leadPm.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, selectedDepartment, selectedStatus, searchQuery]);

  // All pending milestone change requests across projects
  const allPendingRequests = useMemo(() => {
    const list: { project: Project; req: MilestoneChangeRequest }[] = [];
    projects.forEach((p) => {
      (p.milestoneRequests || []).forEach((r) => {
        if (r.status === 'PENDING') {
          list.push({ project: p, req: r });
        }
      });
    });
    return list;
  }, [projects]);

  return (
    <div className="space-y-6">
      
      {/* 1. Portfolio KPI Scorecards & Executive Currency Control */}
      <section className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2 px-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t('dashboard.kpiHeader')}
          </div>

          {/* Executive Currency Switcher */}
          <div className="flex items-center gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 pl-2">
              <Globe className="w-3.5 h-3.5 text-slate-500" /> {isEn ? 'Executive Currency:' : '主管檢討匯率幣別：'}
            </span>
            <div className="flex items-center gap-1">
              {CURRENCY_LIST.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setExecutiveCurrency(c.code as Currency)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    executiveCurrency === c.code
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`${c.name} (${c.symbol})`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1: Active Projects */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center justify-between">
              <span>{t('dashboard.activeProjects')}</span>
              <Briefcase className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{totalProjects}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {t('dashboard.coveringDepts')}
            </div>
          </div>

          {/* KPI 2: On Schedule Rate */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center justify-between">
              <span>{t('dashboard.onScheduleRate')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{onTrackPercent}%</div>
            <div className="flex h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-600/80 rounded-full" style={{ width: `${onTrackPercent}%` }} />
            </div>
          </div>

          {/* KPI 3: Total Budget Spent (Converts across multi-currencies) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center justify-between">
              <span>{t('dashboard.actualSpent')} ({CURRENCIES[executiveCurrency].symbol})</span>
              <Coins className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-800">
              {formatCurrency(budgetSummary.totalSpentInTargetCurrency, executiveCurrency)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 font-mono">
              {isEn ? 'Budget:' : '總預算:'} {formatCurrency(budgetSummary.totalBudgetInTargetCurrency, executiveCurrency)} ({budgetSummary.overallBudgetRatio}%)
            </div>
          </div>

          {/* KPI 4: Active Risks */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs text-rose-700 font-bold uppercase mb-1 flex items-center justify-between">
              <span>{t('dashboard.risksManaged')}</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-800">
              {atRiskProjects.length + delayedProjects.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {atRiskProjects.length} {t('dashboard.atRiskCount')} • {delayedProjects.length} {t('dashboard.delayedCount')}
            </div>
          </div>

        </div>
      </section>

      {/* 2. Department Pulse Overview */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" /> {t('dashboard.deptPulse')}
          </h2>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">
            {isEn ? 'Currency:' : '換算幣別：'}{CURRENCIES[executiveCurrency].name} ({executiveCurrency})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {departmentStats.map((dept) => (
            <div 
              key={dept.department}
              onClick={() => setSelectedDepartment(dept.department === selectedDepartment ? 'ALL' : dept.department)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedDepartment === dept.department
                  ? 'border-slate-400 bg-slate-100/60 font-semibold'
                  : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-800 text-xs">{dept.department}</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-white text-slate-600 border border-slate-200">
                  {dept.count} {t('dashboard.projectsSuffix')}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{t('dashboard.healthScore')}</span>
                  <span className={`font-bold ${dept.healthPercent >= 80 ? 'text-emerald-700' : dept.healthPercent >= 60 ? 'text-amber-700' : 'text-rose-700'}`}>
                    {dept.healthPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${dept.healthPercent >= 80 ? 'bg-emerald-600/80' : dept.healthPercent >= 60 ? 'bg-amber-600/80' : 'bg-rose-600/80'}`}
                    style={{ width: `${Math.max(5, dept.healthPercent)}%` }}
                  />
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{isEn ? 'Spent:' : '實支:'} {formatCurrency(dept.totalSpentInTarget, executiveCurrency, true)}</span>
                <span>{isEn ? 'Budget:' : '總預算:'} {formatCurrency(dept.totalBudgetInTarget, executiveCurrency, true)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 12~24 Weeks Historical Trend Chart for C-Suite Executives */}
      <WeeklyTrendChart
        projects={projects}
        onSelectProject={onSelectProject}
      />

      {/* 4. C-Suite Milestone Approval Gate (If pending requests exist) */}
      {allPendingRequests.length > 0 && (
        <section className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-600 text-white">
                <FileCheck2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span>{isEn ? 'Department N-1 / Approval Gateway: Pending Baseline & Milestone Changes' : '部門 N-1 / 高層簽核關卡：待核准專案立項與里程碑變更 (Approval Gateway)'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-mono font-bold">
                    {allPendingRequests.length} {isEn ? 'Pending' : '筆待簽核'}
                  </span>
                </h3>
                <p className="text-xs text-amber-800">
                  {isEn ? 'Authorized by org structure, project baseline and milestone changes auto-route to N-1 Dept Heads for approval.' : '依據組織架構授權，專案立項與里程碑異動均自動陳核至 N-1 部門主管關卡，經核准後方可更動。'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-800 font-mono hidden lg:flex items-center gap-1 font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-600" /> {isEn ? 'Baseline Protection Active' : '基線防護機制生效中'}
              </span>

              {onOpenApprovalGateway && (
                <button
                  onClick={onOpenApprovalGateway}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer animate-pulse"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isEn ? 'Open Approval Gateway' : '進入高層專用簽核關卡'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allPendingRequests.map(({ project, req }) => (
              <div key={req.id} className="bg-white p-3.5 rounded-xl border border-amber-200/90 shadow-2xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs hover:text-indigo-600 cursor-pointer" onClick={() => onSelectProject(project.id)}>
                    {project.name} ({project.code})
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {req.changeType === 'ADD' 
                      ? (isEn ? 'Add Milestone' : '新增里程碑') 
                      : req.changeType === 'MODIFY_DATE' 
                      ? (isEn ? 'Extend Date' : '展延/改期') 
                      : (isEn ? 'Delete Request' : '申請刪除')}
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded border border-slate-200/80 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {isEn ? 'Target:' : '標的：'}{req.newTitle}
                  </div>
                  {req.originalDueDate && req.originalDueDate !== req.newDueDate && (
                    <div className="text-[11px] text-slate-500 font-mono">
                      {isEn ? 'Date Shift:' : '日期調整：'}<span className="line-through">{req.originalDueDate}</span> &rarr; <span className="text-amber-700 font-bold">{req.newDueDate}</span>
                    </div>
                  )}
                  {req.changeType === 'ADD' && (
                    <div className="text-[11px] text-slate-500 font-mono">
                      {isEn ? 'Target Date:' : '預定完成日：'}<span className="text-indigo-700 font-bold">{req.newDueDate}</span>
                    </div>
                  )}
                  <div className="text-slate-600 text-[11px] pt-1">
                    <strong className="text-slate-700">{isEn ? 'Reason:' : '變更理由：'}</strong> {req.reason}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-0.5 font-mono flex items-center justify-between">
                    <span>{isEn ? 'Submitted by:' : '提報 PM：'}{req.pmName}</span>
                    <span>{isEn ? 'Time:' : '時間：'}{req.requestedAt}</span>
                  </div>
                </div>

                {onReviewMilestoneRequest && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onReviewMilestoneRequest(project.id, req.id, 'REJECT', isEn ? 'Rejected by Executive' : '高層審核退回')}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-500" /> {isEn ? 'Reject' : '退回申請'}
                    </button>
                    <button
                      onClick={() => onReviewMilestoneRequest(project.id, req.id, 'APPROVE', isEn ? 'Approved by Executive' : '高層審核核准')}
                      className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> {isEn ? 'Approve & Update Baseline' : '核准並更新基線'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Executive Briefing Card & Closed-Loop System of Record Trigger */}
      <ExecutiveBriefingCard
        briefing={briefing}
        projects={projects}
        decisions={decisions}
        onUpdateBriefing={onUpdateBriefing}
        onSelectProject={onSelectProject}
        onOpenCaptureDecision={onOpenCaptureDecision}
        onOpenSystemOfRecord={onOpenSystemOfRecord}
        onOpenAIQA={onOpenAIQA}
      />

      {/* Portfolio Grid Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" /> {t('dashboard.portfolioOverview')}
            </h2>
          </div>

          {/* Search & Filter Inputs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('dashboard.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-lg border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 w-44 sm:w-52 bg-slate-50/50"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200/80 text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="ALL">{t('dashboard.allDepts')}</option>
              <option value="研發部">{isEn ? 'R&D Dept' : '研發部'}</option>
              <option value="IT資訊部">{isEn ? 'IT & Infra Dept' : 'IT資訊部'}</option>
              <option value="行銷部">{isEn ? 'Marketing Dept' : '行銷部'}</option>
              <option value="營運部">{isEn ? 'Operations Dept' : '營運部'}</option>
              <option value="永續營運部">{isEn ? 'Sustainability Dept' : '永續營運部'}</option>
              <option value="產品部">{isEn ? 'Product Dept' : '產品部'}</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200/80 text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="ALL">{t('dashboard.allStatus')}</option>
              <option value="ON_TRACK">{t('health.ON_TRACK')}</option>
              <option value="AT_RISK">{t('health.AT_RISK')}</option>
              <option value="DELAYED">{t('health.DELAYED')}</option>
              <option value="COMPLETED">{t('health.COMPLETED')}</option>
            </select>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProjects.map((project) => {
            const latestUpdate = project.updates[0];
            return (
              <div
                key={project.id}
                className="p-3.5 border border-slate-200/80 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-slate-50/30 hover:bg-white flex flex-col justify-between"
                onClick={() => onSelectProject(project.id)}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {project.code}
                      </span>
                      <span className="text-[10px] font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        {project.department}
                      </span>
                    </div>
                    <HealthBadge status={project.health} size="sm" />
                  </div>

                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm hover:text-indigo-600 transition-colors line-clamp-1">
                    {project.name}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-2.5">
                    <ProgressBar progress={project.currentProgress} health={project.health} size="sm" />
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>PM: {project.leadPm}</span>
                    <span className="font-mono font-bold text-slate-700">
                      {t('dashboard.budget')}: {formatCurrency(project.spentBudget, project.currency || 'TWD')}
                    </span>
                  </div>

                  {latestUpdate && (
                    <div className="mt-2 p-2 rounded bg-slate-100/60 border border-slate-200/60 text-[10px] text-slate-600">
                      <span className="font-semibold text-slate-800">{t('dashboard.latestWeekly')}: </span>
                      <span className="line-clamp-1">{latestUpdate.keyAchievements[0] || t('dashboard.progressingNormally')}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLogUpdate(project);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-300/80 transition-all cursor-pointer shadow-2xs"
                    title={isEn ? "Open full-screen PM Studio for weekly filing & AI polish" : "進入全螢幕 PM Studio 填報週報與 AI 潤飾"}
                  >
                    <span>⚡ PM Studio</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project.id);
                    }}
                    className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{isEn ? 'Milestones' : '里程碑查核'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            {t('dashboard.noMatchingProjects')}
          </div>
        )}

      </div>

    </div>
  );
};
