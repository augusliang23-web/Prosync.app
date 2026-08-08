import React, { useState } from 'react';
import { Employee, HierarchyLevelConfig } from '../../types';
import { 
  Building2, 
  Users, 
  UserCheck, 
  HeartHandshake, 
  ShieldCheck,
  ChevronDown, 
  ChevronRight, 
  Mail, 
  FolderKanban,
  Sparkles,
  Layers
} from 'lucide-react';

interface OrgTreeViewProps {
  employees: Employee[];
  departments: string[];
  hierarchyLevels: HierarchyLevelConfig[];
  onEditEmployee?: (emp: Employee) => void;
}

export const OrgTreeView: React.FC<OrgTreeViewProps> = ({
  employees,
  departments,
  hierarchyLevels,
  onEditEmployee,
}) => {
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    departments.forEach((d) => (map[d] = true));
    return map;
  });

  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');

  const toggleDept = (dept: string) => {
    setExpandedDepts((prev) => ({ ...prev, [dept]: !prev[dept] }));
  };

  // Find CEO
  const ceo = employees.find((e) => e.hierarchyTier === 'CEO' || e.title.includes('CEO') || e.title.includes('董事長'));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Tier Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800">層級速篩 (Hierarchy Tier Filter):</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedTierFilter('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTierFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            在職階層 ({employees.filter(e => e.status !== 'RESIGNED').length} 人)
          </button>

          {hierarchyLevels.map((lvl) => {
            const count = employees.filter((e) => e.status !== 'RESIGNED' && (e.hierarchyTier || (e.isN1Manager ? 'N-1' : 'N-2')) === lvl.levelId).length;
            const isSelected = selectedTierFilter === lvl.levelId;

            return (
              <button
                key={lvl.levelId}
                onClick={() => setSelectedTierFilter(lvl.levelId)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl.levelId} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Level 0: CEO / Executive Leadership Node */}
      {ceo && (selectedTierFilter === 'ALL' || selectedTierFilter === 'CEO') && (
        <div className="relative flex flex-col items-center">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-indigo-500/40 shadow-xl max-w-md w-full relative group">
            
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono text-[10px] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> [Level 0] CEO 經營高層
              </span>
              <span className="text-[10px] font-mono text-slate-400">{ceo.employeeId}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center shadow-md shrink-0">
                CEO
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">{ceo.name}</h3>
                <p className="text-xs text-indigo-200 mt-0.5 font-medium">{ceo.title}</p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {ceo.email}
              </span>
              <span className="font-semibold text-indigo-300">督導專案：{ceo.assignedProjectsCount} 個</span>
            </div>

            {onEditEmployee && (
              <button
                onClick={() => onEditEmployee(ceo)}
                className="absolute top-3 right-3 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                編輯資料
              </button>
            )}
          </div>

          {/* Visual Vertical Connector Line */}
          <div className="w-0.5 h-8 bg-indigo-300 my-1"></div>
        </div>
      )}

      {/* Level 1..N: Department Hierarchy Trees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map((dept) => {
          const deptEmployees = employees.filter((e) => e.department === dept && e.status !== 'RESIGNED');
          if (deptEmployees.length === 0) return null;

          const filteredDeptEmps = deptEmployees.filter((e) => {
            if (selectedTierFilter === 'ALL') return true;
            const tier = e.hierarchyTier || (e.isN1Manager ? 'N-1' : 'N-2');
            return tier === selectedTierFilter;
          });

          if (filteredDeptEmps.length === 0 && selectedTierFilter !== 'ALL') return null;

          const n1Head = deptEmployees.find((e) => e.isN1Manager || e.hierarchyTier === 'N-1');
          const n2Members = deptEmployees.filter((e) => (e.hierarchyTier || 'N-2') === 'N-2' && !e.isN1Manager);
          const n3Members = deptEmployees.filter((e) => e.hierarchyTier === 'N-3');
          const n4Members = deptEmployees.filter((e) => e.hierarchyTier === 'N-4' || e.hierarchyTier === 'N-5');

          const isExpanded = expandedDepts[dept] !== false;

          return (
            <div key={dept} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
              
              {/* Department Header - High Contrast Light Theme */}
              <div 
                onClick={() => toggleDept(dept)}
                className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{dept}</h3>
                    <p className="text-[10px] text-slate-500">
                      階層數：{n3Members.length > 0 ? '3 層 (N-1 ~ N-3)' : '2 層 (N-1 ~ N-2)'} • {deptEmployees.length} 名成員
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-mono font-bold">
                    {deptEmployees.length} 人
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Department Hierarchy Tree Content */}
              {isExpanded && (
                <div className="p-4 space-y-4 flex-1 bg-slate-50/30">
                  
                  {/* Tier N-1: Servant Leader Spotlight */}
                  {n1Head && (
                    <div className="relative pl-3 border-l-2 border-amber-400">
                      <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-white to-white rounded-xl border border-amber-300/80 shadow-2xs relative group">
                        
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-extrabold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-700" /> N-1 主管
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{n1Head.employeeId}</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            N-1
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs">{n1Head.name}</h4>
                            <p className="text-[11px] text-slate-600 font-medium">{n1Head.title}</p>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <span>直屬：{n1Head.reportsToName}</span>
                          <span className="font-semibold text-slate-700">專案：{n1Head.assignedProjectsCount} 個</span>
                        </div>

                        {onEditEmployee && (
                          <button
                            onClick={() => onEditEmployee(n1Head)}
                            className="absolute top-2 right-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            編輯
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tier N-2: Team Leads / Senior Staff */}
                  {n2Members.length > 0 && (
                    <div className="pl-6 space-y-2 relative border-l-2 border-indigo-200 ml-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Tier N-2 團隊主管 / 高級專員 ({n2Members.length} 人)
                      </div>

                      {n2Members.map((emp) => (
                        <div key={emp.id} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5 relative group hover:border-indigo-300 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-mono font-bold text-[10px] flex items-center justify-center">
                                N-2
                              </span>
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">{emp.name}</h5>
                                <p className="text-[10px] text-slate-500 font-mono">{emp.employeeId} • {emp.title}</p>
                              </div>
                            </div>

                            <span className="text-[10px] text-slate-500 font-mono px-1.5 py-0.5 rounded bg-slate-100">
                              直屬：{emp.reportsToName}
                            </span>
                          </div>

                          {onEditEmployee && (
                            <button
                              onClick={() => onEditEmployee(emp)}
                              className="absolute top-2 right-2 text-[10px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-2 py-0.5 rounded transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              編輯
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tier N-3 & Below: Staff */}
                  {n3Members.length > 0 && (
                    <div className="pl-12 space-y-2 relative border-l-2 border-slate-200 ml-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Tier N-3 專案與技術專員 ({n3Members.length} 人)
                      </div>

                      {n3Members.map((emp) => (
                        <div key={emp.id} className="p-2.5 bg-white/80 rounded-xl border border-slate-200/70 shadow-2xs flex items-center justify-between gap-2 relative group">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-mono font-bold text-[9px] flex items-center justify-center">
                              N-3
                            </span>
                            <div>
                              <h6 className="text-xs font-bold text-slate-800">{emp.name}</h6>
                              <p className="text-[10px] text-slate-500">{emp.title}</p>
                            </div>
                          </div>

                          {onEditEmployee && (
                            <button
                              onClick={() => onEditEmployee(emp)}
                              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              編輯
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
