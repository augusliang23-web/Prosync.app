import React, { useState } from 'react';
import { Project, Department, HealthStatus, UserRole } from '../../types';
import { HealthBadge } from '../common/HealthBadge';
import { ProgressBar } from '../common/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/currencyUtils';
import { 
  LayoutGrid, 
  List, 
  Columns, 
  Search, 
  Plus, 
  ArrowUpRight, 
  FileEdit, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Users,
  Briefcase
} from 'lucide-react';

interface ProjectListProps {
  currentRole?: UserRole;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onOpenLogUpdate: (project: Project) => void;
  onOpenAddProject: () => void;
  onOpenEditProject?: (project: Project) => void;
  pendingApprovalsCount?: number;
  onOpenApprovalGateway?: () => void;
}

type ViewMode = 'GRID' | 'TABLE' | 'KANBAN';

export const ProjectList: React.FC<ProjectListProps> = ({
  currentRole = 'PM',
  projects,
  onSelectProject,
  onOpenLogUpdate,
  onOpenAddProject,
  onOpenEditProject,
  pendingApprovalsCount = 0,
  onOpenApprovalGateway,
}) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const isN1Manager = currentRole === 'N1_MANAGER';

  const filteredProjects = projects.filter((p) => {
    if (selectedDept !== 'ALL' && p.department !== selectedDept) return false;
    if (selectedStatus !== 'ALL' && p.health !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.leadPm.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalDeptBudget = filteredProjects.reduce((acc, p) => acc + p.totalBudget, 0);
  const totalDeptSpent = filteredProjects.reduce((acc, p) => acc + p.spentBudget, 0);
  const atRiskDeptCount = filteredProjects.filter((p) => p.health === 'AT_RISK' || p.health === 'DELAYED').length;

  const formatMoneyTWD = (amount: number) => {
    if (amount >= 1000000) {
      return `NT$ ${(amount / 1000000).toFixed(2)}M`;
    }
    return `NT$ ${amount.toLocaleString()}`;
  };

  const kanbanColumns: { status: HealthStatus; title: string; color: string }[] = [
    { status: 'ON_TRACK', title: `${t('health.ON_TRACK')} (On Track)`, color: 'border-slate-300 bg-slate-50/60' },
    { status: 'AT_RISK', title: `${t('health.AT_RISK')} (At Risk)`, color: 'border-amber-300 bg-amber-50/30' },
    { status: 'DELAYED', title: `${t('health.DELAYED')} (Delayed)`, color: 'border-rose-300 bg-rose-50/30' },
    { status: 'COMPLETED', title: `${t('health.COMPLETED')} (Completed)`, color: 'border-slate-300 bg-slate-100/60' },
  ];

  return (
    <div className="space-y-5">
      
      {/* Role-Specific Mode Banner */}
      {isN1Manager ? (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 text-white shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    {isEn ? 'N-1 Department Manager Governance Center' : 'N-1 部門主管治理與簽核中心'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    Dept Manager View
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isEn ? 'Oversee departmental projects, approve milestone CRs, and monitor team resource allocation.' : '掌控部門跨專案健康度、審核 PM 變更簽呈 (CR) 與調配團隊人力資源。'}
                </p>
              </div>
            </div>

            {onOpenApprovalGateway && (
              <button
                onClick={onOpenApprovalGateway}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-indigo-200" />
                <span>{isEn ? 'Approval Gateway' : '主管簽核閘道'}</span>
                {pendingApprovalsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500 text-white animate-pulse">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Quick Metrics for N-1 Manager */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-indigo-500/20 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">{isEn ? 'Managed Projects' : '部門總專案數'}</span>
              <div className="text-lg font-bold font-mono text-white mt-0.5">{filteredProjects.length} 個</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">{isEn ? 'Dept Total Budget' : '部門總預算 (TWD)'}</span>
              <div className="text-lg font-bold font-mono text-indigo-300 mt-0.5">{formatMoneyTWD(totalDeptBudget)}</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">{isEn ? 'Pending CR Approvals' : '待審核變更簽呈'}</span>
              <div className={`text-lg font-bold font-mono mt-0.5 ${pendingApprovalsCount > 0 ? 'text-amber-400 font-black' : 'text-slate-300'}`}>
                {pendingApprovalsCount} 件
              </div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">{isEn ? 'Risk Projects' : '需要預警支援'}</span>
              <div className={`text-lg font-bold font-mono mt-0.5 ${atRiskDeptCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {atRiskDeptCount} 個
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 border border-teal-500/30 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
              <UserCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  {isEn ? 'PM Execution & Status Update Workspace' : 'PM 專案經理執行與週報填寫工作區'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  PM View
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn ? 'Manage project deliverables, log weekly PM updates, and submit milestone change requests to N-1 managers.' : '維護專案交付里程碑、填寫每週 PM Update 與向主管通報協助或申請 CR 變更。'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAddProject}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-200" />
            <span>{isEn ? 'Create New Project' : '建立新專案'}</span>
          </button>
        </div>
      )}

      {/* Top Action & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-600" />
              {t('projectList.title')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('projectList.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/80 text-xs">
              <button
                onClick={() => setViewMode('GRID')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'GRID' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> {t('projectList.cardView')}
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'TABLE' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" /> {t('projectList.tableView')}
              </button>
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'KANBAN' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Columns className="w-3.5 h-3.5" /> {t('projectList.kanbanView')}
              </button>
            </div>

            <button
              onClick={onOpenAddProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> {t('header.addProject')}
            </button>
          </div>

        </div>

        {/* Filter Inputs Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('projectList.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
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
              className="px-2.5 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="ALL">{t('dashboard.allStatus')}</option>
              <option value="ON_TRACK">{t('health.ON_TRACK')}</option>
              <option value="AT_RISK">{t('health.AT_RISK')}</option>
              <option value="DELAYED">{t('health.DELAYED')}</option>
              <option value="COMPLETED">{t('health.COMPLETED')}</option>
            </select>
          </div>
        </div>

      </div>

      {/* VIEW MODE 1: GRID VIEW */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProjects.map((p) => {
            const latestUpdate = p.updates[0];
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {p.code}
                    </span>
                    <HealthBadge status={p.health} size="sm" />
                  </div>

                  <h3 
                    onClick={() => onSelectProject(p.id)}
                    className="font-bold text-slate-800 text-sm hover:text-slate-700 transition-colors cursor-pointer line-clamp-1"
                  >
                    {p.name}
                  </h3>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                      {p.department}
                    </span>
                    <span className="text-slate-500 font-medium">PM: {p.leadPm}</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-3">
                    <ProgressBar progress={p.currentProgress} health={p.health} size="sm" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs p-2 bg-slate-50/70 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] block">{isEn ? 'Total Budget' : '劃算總預算'}</span>
                      <span className="font-semibold font-mono text-slate-800">
                        {formatCurrency(p.totalBudget, p.currency || 'TWD')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">{isEn ? 'Last Updated' : '最後更新'}</span>
                      <span className="font-semibold text-slate-800">{p.updatedAt}</span>
                    </div>
                  </div>

                  {latestUpdate && (
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-100/70 border border-slate-200/60 text-xs">
                      <div className="font-semibold text-slate-800 mb-0.5">{isEn ? 'Latest Update:' : '最新週報重點：'}</div>
                      <p className="text-slate-600 line-clamp-2">{latestUpdate.risksAndBlockers || latestUpdate.keyAchievements[0]}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {onOpenEditProject && (
                      <button
                        onClick={() => onOpenEditProject(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
                        title={isEn ? "Edit project details, budget, progress, and milestones" : "編輯專案名稱、預算、進度與里程碑"}
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Edit' : '編輯專案'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenLogUpdate(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-2xs transition-all cursor-pointer"
                    >
                      <span>{isEn ? 'Log Update' : '填寫週報'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectProject(p.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    {isEn ? 'Details & Milestones' : '里程碑查核'} <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">{isEn ? 'Code / Name' : '專案編號/名稱'}</th>
                  <th className="p-3">{isEn ? 'Department' : '部門'}</th>
                  <th className="p-3">{isEn ? 'Lead PM' : '負責 PM'}</th>
                  <th className="p-3">{isEn ? 'Health' : '健康狀態'}</th>
                  <th className="p-3">{isEn ? 'Progress %' : '進度 %'}</th>
                  <th className="p-3">{isEn ? 'Spent / Budget' : '實支 / 總預算'}</th>
                  <th className="p-3">{isEn ? 'Target Date' : '預計完工日'}</th>
                  <th className="p-3 text-right">{isEn ? 'Actions' : '操作'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-800 hover:text-slate-600 cursor-pointer" onClick={() => onSelectProject(p.id)}>
                        {p.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">{p.code}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{p.department}</td>
                    <td className="p-3 text-slate-700">{p.leadPm}</td>
                    <td className="p-3">
                      <HealthBadge status={p.health} size="sm" />
                    </td>
                    <td className="p-3 w-32">
                      <ProgressBar progress={p.currentProgress} health={p.health} size="sm" />
                    </td>
                    <td className="p-3 font-mono text-slate-700">
                      {formatCurrency(p.spentBudget, p.currency || 'TWD')} / {formatCurrency(p.totalBudget, p.currency || 'TWD')}
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{p.targetCompletionDate}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenEditProject && (
                          <button
                            onClick={() => onOpenEditProject(p)}
                            className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                          >
                            {isEn ? 'Edit' : '編輯專案'}
                          </button>
                        )}
                        <button
                          onClick={() => onOpenLogUpdate(p)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100"
                        >
                          {isEn ? 'Log' : '週報'}
                        </button>
                        <button
                          onClick={() => onSelectProject(p.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          {isEn ? 'Milestones' : '里程碑'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: KANBAN BOARD */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {kanbanColumns.map((col) => {
            const colProjects = filteredProjects.filter((p) => p.health === col.status);
            return (
              <div key={col.status} className={`p-3.5 rounded-xl border ${col.color}`}>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">{col.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {colProjects.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colProjects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      onClick={() => onSelectProject(p.id)}
                    >
                      <div className="flex items-center justify-between gap-1 text-[10px] font-mono font-bold text-slate-400 mb-1">
                        <span>{p.code}</span>
                        <span className="text-slate-600 font-medium">{p.department}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{p.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>

                      <div className="mt-2.5">
                        <ProgressBar progress={p.currentProgress} health={p.health} size="sm" showLabel={false} />
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span>PM: {p.leadPm.split(' ')[0]}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenLogUpdate(p);
                          }}
                          className="text-slate-700 font-bold hover:underline"
                        >
                          + {isEn ? 'Log Update' : '填寫週報'}
                        </button>
                      </div>
                    </div>
                  ))}

                  {colProjects.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg">
                      {isEn ? 'No projects in this status' : '此狀態尚無專案'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
