import React from 'react';
import { ExecutiveBriefing, Project, Department } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { X, Printer, Copy, Check, FileText, TrendingUp, Target, PieChart, BarChart3, Award } from 'lucide-react';
import { WeeklyTrendChart } from './WeeklyTrendChart';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: ExecutiveBriefing;
  projects: Project[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  briefing,
  projects,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Compute precise real-time analytics
  const totalProjects = projects.length || briefing.portfolioHealthOverview.totalProjects;
  const avgProgress = totalProjects > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.currentProgress, 0) / totalProjects)
    : 0;

  const onTrackCount = briefing.portfolioHealthOverview.onTrackCount;
  const atRiskCount = briefing.portfolioHealthOverview.atRiskCount;
  const delayedCount = briefing.portfolioHealthOverview.delayedCount;
  const completedCount = briefing.portfolioHealthOverview.completedCount || 0;

  const onTrackRate = totalProjects > 0 ? Math.round((onTrackCount / totalProjects) * 100) : 0;
  
  const totalBudgetAllocated = briefing.portfolioHealthOverview.totalBudgetAllocated;
  const totalSpentBudget = briefing.portfolioHealthOverview.totalSpentBudget;
  const budgetExecutionRate = totalBudgetAllocated > 0
    ? Math.round((totalSpentBudget / totalBudgetAllocated) * 100)
    : 0;

  // Deliverables analytics
  let totalDeliverables = 0;
  let completedDeliverables = 0;
  projects.forEach((p) => {
    if (p.keyDeliverables) {
      totalDeliverables += p.keyDeliverables.length;
      completedDeliverables += p.keyDeliverables.filter((d) => d.completed).length;
    }
  });
  const deliverablesCompletionRate = totalDeliverables > 0
    ? Math.round((completedDeliverables / totalDeliverables) * 100)
    : 0;

  // Department analytics calculation
  const deptMap: Record<string, {
    name: Department;
    count: number;
    totalProgress: number;
    budget: number;
    spent: number;
    onTrack: number;
    atRisk: number;
    delayed: number;
  }> = {};

  projects.forEach((p) => {
    if (!deptMap[p.department]) {
      deptMap[p.department] = {
        name: p.department,
        count: 0,
        totalProgress: 0,
        budget: 0,
        spent: 0,
        onTrack: 0,
        atRisk: 0,
        delayed: 0,
      };
    }
    const d = deptMap[p.department];
    d.count += 1;
    d.totalProgress += p.currentProgress;
    d.budget += p.totalBudget;
    d.spent += p.spentBudget;
    if (p.health === 'ON_TRACK') d.onTrack += 1;
    else if (p.health === 'AT_RISK') d.atRisk += 1;
    else if (p.health === 'DELAYED') d.delayed += 1;
  });

  const departmentList = Object.values(deptMap).map((d) => ({
    ...d,
    avgProgress: d.count > 0 ? Math.round(d.totalProgress / d.count) : 0,
    spentRate: d.budget > 0 ? Math.round((d.spent / d.budget) * 100) : 0,
  })).sort((a, b) => b.avgProgress - a.avgProgress);

  const handleCopyText = () => {
    const text = `==============================================
【${t('reportModal.headerTitle')}】
${t('briefing.updateTime')}：${briefing.generatedAt}
==============================================

${t('reportModal.section1')}
${briefing.overallExecutiveSummary}

${t('reportModal.kpiChartTitle')}
- ${t('reportModal.avgCompletionRate')}：${avgProgress}%
- ${t('reportModal.scheduleOnTrackRate')}：${onTrackRate}% (${t('reportModal.targetBenchmark')})
- ${t('reportModal.budgetExecutionRate')}：${budgetExecutionRate}% (NT$ ${(totalSpentBudget / 1000000).toFixed(2)}M / NT$ ${(totalBudgetAllocated / 1000000).toFixed(2)}M)
- ${t('reportModal.deliverablesCompletionRate')}：${deliverablesCompletionRate}% (${completedDeliverables}/${totalDeliverables} ${t('reportModal.completedDeliverables')})

${t('reportModal.deptCompletionBreakdown')}：
${departmentList.map(d => `- [${d.name}] ${t('reportModal.avgCompletionRate')}: ${d.avgProgress}% (${d.count} ${t('reportModal.projectsCount')})`).join('\n')}

${t('reportModal.section3')}
${briefing.criticalRisksAndDecisions.map((r, i) => `${i + 1}. [${r.department}] ${r.projectName} (${r.leadPm})
   - ${t('briefing.blocker')}：${r.issue}
   - ${t('briefing.pmRequest')}：${r.pmAssistanceRequested}
   - ${t('briefing.aiRecommend')}：${r.aiRecommendedAction}`).join('\n\n')}

${t('reportModal.section4')}
${briefing.topWinsAndProgress.map((w, i) => `${i + 1}. [${w.department}] ${w.projectName}: ${w.achievement}`).join('\n')}

${t('reportModal.section5')}
${briefing.strategicRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] shadow-xl flex flex-col border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Low-Saturation Light Top Bar */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-100/90 text-slate-800 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-slate-100 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">{t('reportModal.title')}</h3>
              <p className="text-xs text-slate-500">{t('briefing.updateTime')}：{briefing.generatedAt} | {t('reportModal.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? t('reportModal.copied') : t('reportModal.copyText')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('reportModal.printPdf')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Header Banner */}
          <div className="border-b border-slate-300/80 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t('reportModal.headerTitle')}</h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{t('reportModal.headerSub')}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div className="font-bold text-slate-800">{t('reportModal.confidential')}</div>
              <div>{t('briefing.updateTime')}：{briefing.generatedAt}</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              {t('reportModal.section1')}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{briefing.overallExecutiveSummary}</p>
          </div>

          {/* Section 2: Visual KPI & Completion Rate Charts */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-200/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-slate-700" />
                {t('reportModal.kpiChartTitle')}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                KPI Performance Radar
              </span>
            </h2>

            {/* Top 4 Metric Rings / Gauges Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Card 1: Average Completion Rate */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-medium">{t('reportModal.avgCompletionRate')}</span>
                  <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                </div>
                
                <div className="flex items-center justify-between my-1">
                  <div className="text-xl font-bold text-slate-900">{avgProgress}%</div>
                  
                  {/* Gauge Ring */}
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg className="w-11 h-11 transform -rotate-90">
                      <circle cx="22" cy="22" r="18" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                      <circle
                        cx="22" cy="22" r="18"
                        stroke="#334155"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (113 * avgProgress) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-slate-700 h-full rounded-full" style={{ width: `${avgProgress}%` }} />
                </div>
              </div>

              {/* Card 2: Schedule On-Track Rate */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-medium">{t('reportModal.scheduleOnTrackRate')}</span>
                  <Target className="w-3.5 h-3.5 text-slate-600" />
                </div>

                <div className="flex items-center justify-between my-1">
                  <div>
                    <div className="text-xl font-bold text-slate-900">{onTrackRate}%</div>
                    <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{t('reportModal.targetBenchmark')}</div>
                  </div>

                  {/* Gauge Ring */}
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg className="w-11 h-11 transform -rotate-90">
                      <circle cx="22" cy="22" r="18" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                      <circle
                        cx="22" cy="22" r="18"
                        stroke={onTrackRate >= 70 ? '#059669' : '#d97706'}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (113 * onTrackRate) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${onTrackRate >= 70 ? 'bg-emerald-600' : 'bg-amber-600'}`}
                    style={{ width: `${onTrackRate}%` }}
                  />
                </div>
              </div>

              {/* Card 3: Budget Execution Rate */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-medium">{t('reportModal.budgetExecutionRate')}</span>
                  <PieChart className="w-3.5 h-3.5 text-slate-600" />
                </div>

                <div className="flex items-center justify-between my-1">
                  <div>
                    <div className="text-xl font-bold text-slate-900">{budgetExecutionRate}%</div>
                    <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                      NT$ {(totalSpentBudget / 1000000).toFixed(1)}M / {(totalBudgetAllocated / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-slate-700 h-full rounded-full" style={{ width: `${Math.min(budgetExecutionRate, 100)}%` }} />
                </div>
              </div>

              {/* Card 4: Key Deliverables Rate */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-medium">{t('reportModal.deliverablesCompletionRate')}</span>
                  <Award className="w-3.5 h-3.5 text-slate-600" />
                </div>

                <div className="flex items-center justify-between my-1">
                  <div>
                    <div className="text-xl font-bold text-slate-900">{deliverablesCompletionRate}%</div>
                    <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                      {completedDeliverables} / {totalDeliverables} {t('reportModal.completedDeliverables')}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${deliverablesCompletionRate}%` }} />
                </div>
              </div>

            </div>

            {/* Health & Risk Distribution Bar */}
            <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{t('reportModal.riskDistribution')}</span>
                <span className="text-[11px] font-normal text-slate-500">
                  {totalProjects} {t('reportModal.projectsCount')} (On Track {onTrackCount} / At Risk {atRiskCount} / Delayed {delayedCount})
                </span>
              </div>

              {/* Stacked Percentage Bar */}
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-full transition-all"
                  style={{ width: `${(onTrackCount / totalProjects) * 100}%` }}
                  title={`On Track: ${onTrackCount}`}
                />
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${(atRiskCount / totalProjects) * 100}%` }}
                  title={`At Risk: ${atRiskCount}`}
                />
                <div
                  className="bg-rose-600 h-full transition-all"
                  style={{ width: `${(delayedCount / totalProjects) * 100}%` }}
                  title={`Delayed: ${delayedCount}`}
                />
                {completedCount > 0 && (
                  <div
                    className="bg-slate-400 h-full transition-all"
                    style={{ width: `${(completedCount / totalProjects) * 100}%` }}
                    title={`Completed: ${completedCount}`}
                  />
                )}
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-slate-700 font-medium">{t('health.ON_TRACK')}: {onTrackCount} ({Math.round((onTrackCount / totalProjects) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{t('health.AT_RISK')}: {atRiskCount} ({Math.round((atRiskCount / totalProjects) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
                  <span className="text-slate-700 font-medium">{t('health.DELAYED')}: {delayedCount} ({Math.round((delayedCount / totalProjects) * 100)}%)</span>
                </div>
              </div>
            </div>

            {/* Department Achievement & Completion Rate Horizontal Bar Chart */}
            <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t('reportModal.deptCompletionBreakdown')}
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">Target Benchmark: 85%</span>
              </div>

              <div className="space-y-3 text-xs">
                {departmentList.map((d) => (
                  <div key={d.name} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{d.name}</span>
                        <span className="text-[10px] font-normal text-slate-500">
                          ({d.count} {t('reportModal.projectsCount')} | Spent {d.spentRate}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{d.avgProgress}%</span>
                      </div>
                    </div>

                    {/* Progress Bar Container with Target Benchmark Marker */}
                    <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          d.avgProgress >= 80 ? 'bg-slate-800' : d.avgProgress >= 65 ? 'bg-amber-600' : 'bg-rose-600'
                        }`}
                        style={{ width: `${d.avgProgress}%` }}
                      />
                      {/* Target 85% line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                        style={{ left: '85%' }}
                        title="Target Benchmark 85%"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section 2.5: 12~24 Weeks Historical Trend Chart in Executive Memo */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-200/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                全公司專案 12~24 週歷史狀態與進度推移趨勢分析
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                W11 捷報：PRJ-2026-05 & 06 雙專案完工
              </span>
            </h2>

            <WeeklyTrendChart projects={projects} />
          </div>

          {/* Section 3: Critical Risks */}
          <div>
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200/60 flex items-center justify-between">
              <span>{t('reportModal.section3')}</span>
              <span className="text-[10px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {briefing.criticalRisksAndDecisions.length} ITEMS
              </span>
            </h2>

            <div className="space-y-3">
              {briefing.criticalRisksAndDecisions.map((risk, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 text-xs sm:text-sm">
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span>{i + 1}. [{risk.department}] {risk.projectName} (PM: {risk.leadPm})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100/80 text-rose-800 border border-rose-200/60">
                      {risk.priority} PRIORITY
                    </span>
                  </div>
                  <div className="mt-1.5 text-slate-700">
                    <strong>{t('briefing.blocker')}：</strong>{risk.issue}
                  </div>
                  <div className="mt-1 text-slate-700">
                    <strong>{t('briefing.pmRequest')}：</strong>{risk.pmAssistanceRequested}
                  </div>
                  <div className="mt-2 p-2 rounded bg-white border border-slate-200/80 font-medium text-slate-800">
                    💡 {t('briefing.aiRecommend')}：{risk.aiRecommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Top Wins */}
          <div>
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200/60">
              {t('reportModal.section4')}
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              {briefing.topWinsAndProgress.map((win, i) => (
                <li key={i} className="p-3 bg-slate-50/50 rounded-lg border border-slate-200/80 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <div>
                    <strong className="text-slate-800">[{win.department}] {win.projectName}：</strong>
                    <span className="text-slate-700">{win.achievement}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Recommendations */}
          <div>
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200/60">
              {t('reportModal.section5')}
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-700">
              {briefing.strategicRecommendations.map((rec, i) => (
                <li key={i} className="leading-relaxed">{rec}</li>
              ))}
            </ol>
          </div>

        </div>

      </div>
    </div>
  );
};

