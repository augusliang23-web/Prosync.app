import React, { useState, useEffect } from 'react';
import { Employee, HierarchyLevelConfig } from '../../types';
import { DEPARTMENT_TITLE_PRESETS } from '../../data/mockOrgData';
import { X, UserPlus, UserCheck, Check, Sparkles, Building2, Crown, ShieldCheck, AlertTriangle, UserMinus } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Partial<Employee>) => void;
  onRequestOffboard?: (empId: string) => void;
  editingEmployee?: Employee | null;
  departments: string[];
  hierarchyLevels: HierarchyLevelConfig[];
  allEmployees: Employee[];
}

const getTierOrder = (tier?: string, isN1?: boolean): number => {
  if (isN1 || tier === 'N-1') return 1;
  if (tier === 'CEO') return 0;
  if (tier === 'N-2') return 2;
  if (tier === 'N-3') return 3;
  if (tier === 'N-4') return 4;
  if (tier === 'N-5') return 5;
  return 2;
};

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onRequestOffboard,
  editingEmployee,
  departments,
  hierarchyLevels,
  allEmployees,
}) => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [hierarchyTier, setHierarchyTier] = useState<string>('N-2');
  const [isN1Manager, setIsN1Manager] = useState(false);
  const [reportsToName, setReportsToName] = useState('張董事長 (Marcus Chang)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'ON_LEAVE' | 'RESIGNED'>('ACTIVE');

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name || '');
      setEmployeeId(editingEmployee.employeeId || '');
      setTitle(editingEmployee.title || '');
      setDepartment(editingEmployee.department || departments[0] || '研發部');
      setHierarchyTier(editingEmployee.hierarchyTier || (editingEmployee.isN1Manager ? 'N-1' : 'N-2'));
      setIsN1Manager(editingEmployee.isN1Manager || false);
      setReportsToName(editingEmployee.reportsToName || '張董事長 (Marcus Chang)');
      setEmail(editingEmployee.email || '');
      setPhone(editingEmployee.phone || '');
      setStatus(editingEmployee.status || 'ACTIVE');
    } else {
      const defaultDept = departments[0] || '研發部';
      const defaultTitle = DEPARTMENT_TITLE_PRESETS[defaultDept]?.[2] || '專案與技術專員';
      setName('');
      setEmployeeId(`EMP-2026-${Math.floor(100 + Math.random() * 900)}`);
      setTitle(defaultTitle);
      setDepartment(defaultDept);
      setHierarchyTier('N-2');
      setIsN1Manager(false);
      setReportsToName('張董事長 (Marcus Chang)');
      setEmail('');
      setPhone('');
      setStatus('ACTIVE');
    }
  }, [editingEmployee, isOpen, departments]);

  const currentTierOrder = getTierOrder(hierarchyTier, isN1Manager);

  // Filter valid managers in the same department who have a strictly higher rank (lower tier order number)
  const validSameDeptManagers = allEmployees.filter((emp) => {
    if (emp.id === editingEmployee?.id) return false;
    if (emp.department !== department) return false;
    const empTierOrder = getTierOrder(emp.hierarchyTier, emp.isN1Manager);
    return empTierOrder < currentTierOrder;
  });

  // Ensure direct manager stays valid whenever tier or department changes
  useEffect(() => {
    if (!isOpen) return;
    if (currentTierOrder === 1) {
      // N-1 Manager MUST report to CEO
      setReportsToName('張董事長 (Marcus Chang)');
    } else {
      const validNames = validSameDeptManagers.map((m) => m.name);
      if (reportsToName !== '張董事長 (Marcus Chang)' && !validNames.includes(reportsToName)) {
        // Default to higher tier manager if available, else CEO
        setReportsToName(validSameDeptManagers[0]?.name || '張董事長 (Marcus Chang)');
      }
    }
  }, [hierarchyTier, isN1Manager, department, isOpen]);

  // When department changes, update direct manager list and default title if empty
  const handleDepartmentChange = (newDept: string) => {
    setDepartment(newDept);

    if (!editingEmployee && DEPARTMENT_TITLE_PRESETS[newDept]?.[0]) {
      setTitle(DEPARTMENT_TITLE_PRESETS[newDept][2] || DEPARTMENT_TITLE_PRESETS[newDept][0]);
    }
  };

  if (!isOpen) return null;

  const availableTitlePresets = DEPARTMENT_TITLE_PRESETS[department] || [
    '專案經理', '高級工程師', '專案資深專員', '業務組長'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !department) return;

    if (status === 'RESIGNED') {
      if (editingEmployee && onRequestOffboard) {
        onRequestOffboard(editingEmployee.id);
        onClose();
        return;
      }
    }

    const autoEmail = email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@company.com`;
    const finalIsN1 = hierarchyTier === 'N-1' || isN1Manager;
    const finalReportsTo = finalIsN1 ? '張董事長 (Marcus Chang)' : reportsToName;

    onSubmit({
      id: editingEmployee ? editingEmployee.id : `emp-${Date.now()}`,
      employeeId: employeeId.trim() || `EMP-${Date.now()}`,
      name: name.trim(),
      title: title.trim(),
      department,
      hierarchyTier,
      isN1Manager: finalIsN1,
      reportsToName: finalReportsTo,
      email: autoEmail,
      phone: phone.trim() || 'ext. 8000',
      assignedProjectsCount: editingEmployee ? editingEmployee.assignedProjectsCount : 0,
      status,
      joinedDate: editingEmployee ? editingEmployee.joinedDate : new Date().toISOString().substring(0, 10),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header - High Contrast Light Theme (Issue #1 fix) */}
        <div className="p-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              {editingEmployee ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {editingEmployee ? `編輯人員資料：${editingEmployee.name}` : '＋ 新增人員派任 (Add Personnel)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                維護同仁職稱、歸屬部門、組織階層 Tier 與直屬主管
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-slate-800">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                姓名 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="例如: 王小明 (Alex Wang)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                工號 (Employee ID)
              </label>
              <input
                type="text"
                placeholder="EMP-2026-001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                歸屬部門 <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                組織階層層級 (Hierarchy Tier)
              </label>
              <select
                value={hierarchyTier}
                onChange={(e) => {
                  const val = e.target.value;
                  setHierarchyTier(val);
                  if (val === 'N-1') {
                    setIsN1Manager(true);
                  } else {
                    setIsN1Manager(false);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-indigo-50/50"
              >
                {hierarchyLevels.map((lvl) => (
                  <option key={lvl.levelId} value={lvl.levelId}>
                    {lvl.levelId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Title Input with Department-Specific Title Presets (Issue #3 fix) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                職稱 (Job Title) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />【{department}】常用職稱快速帶入
              </span>
            </div>

            <input
              type="text"
              placeholder="例如: 高級研發 PM, 資深系統架構師..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 mb-2"
            />

            {/* Title Preset Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableTitlePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTitle(preset)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                    title === preset
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Manager Input strictly filtered by Hierarchy Level */}
          {currentTierOrder === 1 ? (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs shadow-2xs">
              <div className="flex items-center gap-2 font-extrabold text-amber-950 mb-0.5">
                <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                <span>直屬匯報主管：張董事長 (Marcus Chang - CEO)</span>
              </div>
              <p className="text-[11px] text-amber-800 font-medium pl-6">
                依組織層級規範，部門 N-1 主管統一由 CEO / 經營高層直接督導與簽核，無法指派下級同仁為主管。
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  直屬匯報主管 (Direct Manager)
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  限本部門更高層級主管 ({validSameDeptManagers.length} 人)
                </span>
              </div>

              <select
                value={reportsToName}
                onChange={(e) => setReportsToName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              >
                <option value="張董事長 (Marcus Chang)">張董事長 (Marcus Chang - CEO)</option>
                {validSameDeptManagers.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.title} • {emp.hierarchyTier || (emp.isN1Manager ? 'N-1' : 'N-2')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Servant Leadership N-1 Toggle */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-950 block">設為部門 N-1 主管</span>
              <p className="text-[10px] text-slate-600 mt-0.5">
                擔當該部門之一級簽核與專案資源支援責任
              </p>
            </div>
            <input
              type="checkbox"
              checked={isN1Manager}
              onChange={(e) => {
                setIsN1Manager(e.target.checked);
                if (e.target.checked) setHierarchyTier('N-1');
              }}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email 電子郵件</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">在職狀態</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              >
                <option value="ACTIVE">在職中 (Active)</option>
                <option value="ON_LEAVE">留職停薪 / 休假中 (On Leave)</option>
                <option value="RESIGNED">離職辦退與交接 (Requires N-1 Approval)</option>
              </select>
            </div>
          </div>

          {status === 'RESIGNED' && (
            <div className="p-3 bg-rose-50/90 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>人員辦退簽核制度規範提醒</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-800 font-medium">
                將同仁設為離職涉及專案權限與組織架構調整，依公司治理規範，點擊下方「轉入發起離職簽核提案」後，系統將自動建立「HR 組織異動單」，並送交 N-1 部門主管與 CEO 審核核准後始正式生效。
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                status === 'RESIGNED'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {status === 'RESIGNED' ? (
                <>
                  <UserMinus className="w-4 h-4" />
                  <span>轉入發起離職簽核提案</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingEmployee ? '儲存變更' : '確定新增同仁'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

