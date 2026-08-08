import React, { useState } from 'react';
import { Department, Employee, OrgChangeRequest, UserRole, HierarchyLevelConfig } from '../../types';
import { getN1Approver } from '../../utils/approverUtils';
import { DEFAULT_HIERARCHY_LEVELS } from '../../data/mockOrgData';
import { OrgTreeView } from './OrgTreeView';
import { AddDepartmentModal } from './AddDepartmentModal';
import { EmployeeFormModal } from './EmployeeFormModal';
import { HierarchyConfigModal } from './HierarchyConfigModal';
import { 
  Building2, 
  Users, 
  UserCheck, 
  ShieldAlert, 
  ShieldCheck, 
  HeartHandshake, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  FolderKanban, 
  Lock, 
  ArrowRight,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Layers,
  Sparkles,
  List,
  GitFork,
  UserMinus,
  LogOut,
  UserX
} from 'lucide-react';

interface OrgStructureViewProps {
  currentRole: UserRole;
  employees: Employee[];
  orgRequests: OrgChangeRequest[];
  onOpenAddOrgRequest: (preselectEmpId?: string, preselectChangeType?: any) => void;
  onOpenApprovalGateway: () => void;
  onRoleChange: (role: UserRole) => void;
  onAddEmployee: (emp: Partial<Employee>) => void;
  onUpdateEmployee: (emp: Partial<Employee>) => void;
  onDeleteEmployee: (empId: string) => void;
  departmentsList: string[];
  onAddDepartment: (deptName: string) => void;
  onDeleteDepartment: (deptName: string) => void;
}

export const OrgStructureView: React.FC<OrgStructureViewProps> = ({
  currentRole,
  employees,
  orgRequests,
  onOpenAddOrgRequest,
  onOpenApprovalGateway,
  onRoleChange,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  departmentsList,
  onAddDepartment,
  onDeleteDepartment,
}) => {
  const [activeTab, setActiveTab] = useState<'TREE' | 'ROSTER'>('TREE');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'ALL' | 'RESIGNED'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [isEmpFormModalOpen, setIsEmpFormModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevelConfig[]>(DEFAULT_HIERARCHY_LEVELS);

  // Permission Guard Check
  const hasAccess = currentRole === 'EXECUTIVE' || currentRole === 'N1_MANAGER' || currentRole === 'HR_MANAGER';
  const isHR = currentRole === 'HR_MANAGER' || currentRole === 'EXECUTIVE';

  if (!hasAccess) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-3xl mx-auto my-12 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">🔒 組織架構與人員名冊存取管制 (Access Restricted)</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            依據企業資安與組織審核授權規範，【組織設計與人員管理】頁面僅開放 <strong className="text-slate-900">N-1 部門主管</strong>、<strong className="text-slate-900">高層管理者 (C-Suite)</strong> 以及 <strong className="text-slate-900">HR 人資主管</strong> 權限存取。
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-left max-w-md mx-auto space-y-2 text-xs text-amber-900">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>切換使用者權限進行體驗：</span>
          </div>
          <p className="text-slate-700">
            請點擊下方按鈕切換身份至【N-1 部門主管】或【HR 人力資源主管】，以檢視與操做組織設計及簽核流程：
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onRoleChange('N1_MANAGER')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all cursor-pointer shadow-2xs"
            >
              切換至 N-1 部門主管
            </button>
            <button
              onClick={() => onRoleChange('HR_MANAGER')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all cursor-pointer shadow-2xs"
            >
              切換至 HR 人資主管
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = selectedDeptFilter === 'ALL' || emp.department === selectedDeptFilter;
    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && emp.status !== 'RESIGNED') ||
      (statusFilter === 'RESIGNED' && emp.status === 'RESIGNED');
    const matchesQuery = searchQuery === '' || 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesQuery;
  });

  const pendingOrgRequests = orgRequests.filter((r) => r.status === 'PENDING');

  const handleSaveEmp = (empData: Partial<Employee>) => {
    if (editingEmp) {
      onUpdateEmployee(empData);
    } else {
      onAddEmployee(empData);
    }
    setEditingEmp(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner - High Contrast Light Design */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <span>企業組織架構與人員派任管理 (Org Architecture &amp; Staffing)</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold">
              Servant Leadership • N-1 / HR
            </span>
          </div>
          <p className="text-xs text-slate-600">
            維護全公司 {departmentsList.length} 大核心部門階層架構、N-1 主管派任與專案同仁名冊。支援階層數定制與即時編輯。
          </p>
        </div>

        {/* Action Controls for Department and Employee Management */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsHierarchyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
            title="設定全公司 N-1, N-2, N-3 階層規則"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>自訂階層規則</span>
          </button>

          <button
            onClick={() => setIsAddDeptModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>＋ 新增部門</span>
          </button>

          <button
            onClick={() => {
              setEditingEmp(null);
              setIsEmpFormModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>＋ 新增人員</span>
          </button>

          {isHR && (
            <button
              onClick={onOpenAddOrgRequest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>HR 異動單</span>
            </button>
          )}
        </div>
      </div>

      {/* Pending Org Requests Alert Banner */}
      {pendingOrgRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="p-2 bg-amber-200/80 text-amber-900 rounded-xl shrink-0">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>待簽核之 HR 組織架構變更申請單 ({pendingOrgRequests.length} 筆)</span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-mono font-bold">
                  N-1 層級審核
                </span>
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                {pendingOrgRequests[0]?.description}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApprovalGateway}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>開啟簽核中心審核</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* View Mode Switcher & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('TREE')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'TREE'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-4 h-4 text-indigo-600" />
            <span>階層架構圖 (Tree Chart)</span>
          </button>

          <button
            onClick={() => setActiveTab('ROSTER')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ROSTER'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4 text-indigo-600" />
            <span>部門名冊與設定 (Roster View)</span>
          </button>
        </div>

        {/* Department & Status Filter & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
          >
            <option value="ACTIVE">在職同仁名冊 ({employees.filter(e => e.status !== 'RESIGNED').length} 人)</option>
            <option value="RESIGNED">已離職檔案歸檔 ({employees.filter(e => e.status === 'RESIGNED').length} 人)</option>
            <option value="ALL">包含全部狀態 ({employees.length} 人)</option>
          </select>

          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
          >
            <option value="ALL">全部部門 ({employees.length} 人)</option>
            {departmentsList.map((d) => (
              <option key={d} value={d}>
                {d} ({employees.filter((e) => e.department === d).length} 人)
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜尋姓名、工號、職稱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

      </div>

      {/* Main View Tab Content */}
      {activeTab === 'TREE' ? (
        <OrgTreeView
          employees={employees}
          departments={departmentsList}
          hierarchyLevels={hierarchyLevels}
          onEditEmployee={(emp) => {
            setEditingEmp(emp);
            setIsEmpFormModalOpen(true);
          }}
        />
      ) : (
        /* Roster View with Full CRUD */
        <div className="space-y-6">
          {departmentsList
            .filter((d) => selectedDeptFilter === 'ALL' || selectedDeptFilter === d)
            .map((dept) => {
              const deptEmployees = filteredEmployees.filter((e) => e.department === dept);
              const n1Head = employees.find((e) => e.department === dept && (e.isN1Manager || e.hierarchyTier === 'N-1') && e.status === 'ACTIVE');
              const approverInfo = getN1Approver(dept as Department, employees);

              return (
                <div key={dept} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  
                  {/* High Contrast Department Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                        <Building2 className="w-4 h-4" />
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900">{dept}</h3>
                      <span className="text-[11px] font-mono text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-full font-bold">
                        {deptEmployees.length} 名成員
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-indigo-900 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                        <HeartHandshake className="w-4 h-4 text-amber-600" />
                        <span>N-1 服務領導：<strong>{approverInfo.name}</strong> ({approverInfo.title})</span>
                      </div>

                      {/* Delete Department Button */}
                      {deptEmployees.length === 0 && (
                        <button
                          onClick={() => {
                            if (confirm(`確定要刪除空白部門【${dept}】嗎？`)) {
                              onDeleteDepartment(dept);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="刪除空部門"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Staffing List */}
                  <div className="p-4 sm:p-5 space-y-4">
                    
                    {/* N-1 Servant Leader Card */}
                    {n1Head && (
                      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-50/20 to-transparent p-4 rounded-xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative group">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-amber-500 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-xs shrink-0">
                            N-1
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm">{n1Head.name}</h4>
                              <span className="px-2 py-0.5 rounded bg-amber-200/90 text-amber-950 font-mono text-[10px] font-extrabold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-amber-800" /> N-1 主管
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-600 mt-0.5">{n1Head.title} • 工號：{n1Head.employeeId}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{n1Head.email}</span>
                          </div>

                          <button
                            onClick={() => {
                              setEditingEmp(n1Head);
                              setIsEmpFormModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-bold transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>編輯</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Employee Cards Grid */}
                    {deptEmployees.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        該部門暫無人員資料，點擊頂部「＋ 新增人員」開始指派同仁。
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {deptEmployees.map((emp) => {
                          if (emp.isN1Manager || emp.hierarchyTier === 'N-1') return null;

                          const isResigned = emp.status === 'RESIGNED';

                          return (
                            <div 
                              key={emp.id} 
                              className={`p-3.5 rounded-xl border transition-all space-y-2 relative group hover:shadow-2xs ${
                                isResigned 
                                  ? 'bg-slate-100/80 border-slate-300 opacity-75' 
                                  : 'bg-slate-50/80 hover:bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center ${
                                    isResigned ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-700'
                                  }`}>
                                    {emp.hierarchyTier || 'N-2'}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <h5 className="text-xs font-bold text-slate-900">{emp.name}</h5>
                                      {isResigned && (
                                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                                          已辦退
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-mono">{emp.employeeId}</p>
                                  </div>
                                </div>

                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold">
                                  {emp.title}
                                </span>
                              </div>

                              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                                <span>直屬：{emp.reportsToName}</span>

                                <div className="flex items-center gap-1">
                                  {!isResigned && isHR && (
                                    <button
                                      onClick={() => onOpenAddOrgRequest(emp.id, 'OFFBOARD_MEMBER')}
                                      className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                                      title="發起離職交接與辦退提案"
                                    >
                                      <UserMinus className="w-3.5 h-3.5 text-rose-500" />
                                      <span>辦理離職</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setEditingEmp(emp);
                                      setIsEmpFormModalOpen(true);
                                    }}
                                    className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                                    title="編輯資料"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`確定要刪除同仁【${emp.name}】的資料嗎？`)) {
                                        onDeleteEmployee(emp.id);
                                      }
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                    title="刪除人員"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
        </div>
      )}

      {/* Modals */}
      <AddDepartmentModal
        isOpen={isAddDeptModalOpen}
        onClose={() => setIsAddDeptModalOpen(false)}
        onAddDepartment={onAddDepartment}
        existingDepartments={departmentsList}
      />

      <EmployeeFormModal
        isOpen={isEmpFormModalOpen}
        onClose={() => {
          setIsEmpFormModalOpen(false);
          setEditingEmp(null);
        }}
        onSubmit={handleSaveEmp}
        onRequestOffboard={(empId) => onOpenAddOrgRequest(empId, 'OFFBOARD_MEMBER')}
        editingEmployee={editingEmp}
        departments={departmentsList}
        hierarchyLevels={hierarchyLevels}
        allEmployees={employees}
      />

      <HierarchyConfigModal
        isOpen={isHierarchyModalOpen}
        onClose={() => setIsHierarchyModalOpen(false)}
        hierarchyLevels={hierarchyLevels}
        onSaveLevels={(newLevels) => setHierarchyLevels(newLevels)}
      />

    </div>
  );
};
