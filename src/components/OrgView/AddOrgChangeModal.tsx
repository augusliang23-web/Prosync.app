import React, { useState, useEffect } from 'react';
import { Department, Employee, OrgChangeType, OrgChangeRequest } from '../../types';
import { getN1Approver } from '../../utils/approverUtils';
import { 
  X, 
  UserPlus, 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Info,
  CheckCircle2,
  ArrowRightLeft,
  Crown,
  UserMinus,
  AlertTriangle
} from 'lucide-react';

interface AddOrgChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSubmitOrgRequest: (request: OrgChangeRequest) => void;
  preselectedEmpId?: string;
  preselectedChangeType?: OrgChangeType;
}

export const AddOrgChangeModal: React.FC<AddOrgChangeModalProps> = ({
  isOpen,
  onClose,
  employees,
  onSubmitOrgRequest,
  preselectedEmpId,
  preselectedChangeType,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [changeType, setChangeType] = useState<OrgChangeType>('TRANSFER_MEMBER');
  const [selectedDept, setSelectedDept] = useState<Department>('研發部');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [newMemberName, setNewMemberName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState<Department>('研發部');
  const [handoverToName, setHandoverToName] = useState('');
  const [lastWorkingDay, setLastWorkingDay] = useState(today);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (preselectedChangeType) {
        setChangeType(preselectedChangeType);
      }
      if (preselectedEmpId) {
        setSelectedEmpId(preselectedEmpId);
        const target = employees.find((e) => e.id === preselectedEmpId);
        if (target) {
          setSelectedDept(target.department as Department);
          setNewDepartment(target.department as Department);
        }
      } else if (employees.length > 0) {
        setSelectedEmpId(employees[0].id);
      }
    }
  }, [isOpen, preselectedEmpId, preselectedChangeType, employees]);

  if (!isOpen) return null;

  const approver = getN1Approver(selectedDept, employees);

  // Filter employees for selection
  const selectedEmp = employees.find((e) => e.id === selectedEmpId);
  const otherEmployees = employees.filter((e) => e.id !== selectedEmpId && e.status !== 'RESIGNED');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetName = newMemberName;
    if (changeType !== 'ADD_MEMBER' && selectedEmp) {
      targetName = selectedEmp.name;
    }

    if (!targetName.trim()) {
      alert('請輸入或選擇目標員工！');
      return;
    }

    let changeTypeLabel = '人員部門調動';
    if (changeType === 'ADD_MEMBER') changeTypeLabel = '新進人員組織指派';
    else if (changeType === 'REASSIGN_N1') changeTypeLabel = '變更 N-1 部門主管';
    else if (changeType === 'UPDATE_TITLE') changeTypeLabel = '職務與職稱晉升/調整';
    else if (changeType === 'OFFBOARD_MEMBER') changeTypeLabel = '離職辦退與業務交接';

    let desc = `【HR 組織變更提案：${changeTypeLabel}】目標人員：${targetName} (${selectedEmp?.department || selectedDept})。`;
    if (changeType === 'OFFBOARD_MEMBER') {
      desc += `最後工作日：${lastWorkingDay}。業務交接指定：${handoverToName || '部門主管權限接管'}。`;
    }
    desc += `${reason ? `原因/說明：${reason}` : ''}。送交 ${approver.title} (${approver.name}) 執行 N-1 層級審核。`;

    const req: OrgChangeRequest = {
      id: `org-req-${Date.now()}`,
      applicantName: '廖美玲 (HR 人資總監)',
      department: selectedEmp ? (selectedEmp.department as Department) : selectedDept,
      changeType,
      targetEmployeeId: selectedEmpId,
      targetEmployeeName: targetName,
      description: desc,
      proposedTitle: newTitle || (selectedEmp ? selectedEmp.title : '專業人員'),
      proposedDepartment: newDepartment,
      proposedIsN1Manager: changeType === 'REASSIGN_N1',
      handoverToName: handoverToName || undefined,
      lastWorkingDay: lastWorkingDay || undefined,
      status: 'PENDING',
      requestedAt: today,
    };

    onSubmitOrgRequest(req);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white text-slate-900 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                HR 組織架構變更與人員派任提案
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                此提案將送交該部門 N-1 主管進行關卡審核，核准後正式於組織圖生效
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">變更類型 (Change Action)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'TRANSFER_MEMBER', label: '跨部門調動 / 歸屬變更', icon: ArrowRightLeft },
                { id: 'REASSIGN_N1', label: '指派/變更 N-1 部門主管', icon: Crown },
                { id: 'ADD_MEMBER', label: '新增組織成員入職', icon: UserPlus },
                { id: 'UPDATE_TITLE', label: '調整職務職稱 / 彙報線', icon: UserCheck },
                { id: 'OFFBOARD_MEMBER', label: '離職辦退 / 業務交接', icon: UserMinus },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = changeType === item.id;
                const isOffboard = item.id === 'OFFBOARD_MEMBER';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setChangeType(item.id as OrgChangeType)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? isOffboard
                          ? 'border-rose-600 bg-rose-50/90 text-rose-900 ring-1 ring-rose-500'
                          : 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? (isOffboard ? 'text-rose-600' : 'text-indigo-600') : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">目標主管部門</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value as Department)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="研發部">研發部</option>
                <option value="IT資訊部">IT資訊部</option>
                <option value="行銷部">行銷部</option>
                <option value="營運部">營運部</option>
                <option value="永續營運部">永續營運部</option>
                <option value="產品部">產品部</option>
                <option value="人力資源部">人力資源部</option>
              </select>
            </div>

            {changeType !== 'ADD_MEMBER' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {changeType === 'OFFBOARD_MEMBER' ? '選擇辦理離職同仁' : '選擇組織現有成員'}
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => {
                    setSelectedEmpId(e.target.value);
                    const emp = employees.find((x) => x.id === e.target.value);
                    if (emp) setSelectedDept(emp.department as Department);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department} - {emp.title} {emp.status === 'RESIGNED' ? '• 已離職' : ''})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">新進員工姓名</label>
                <input
                  type="text"
                  required
                  placeholder="例如：周文彬 (Wayne Chou)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {changeType === 'OFFBOARD_MEMBER' ? (
            <div className="space-y-3 bg-rose-50/70 p-4 rounded-xl border border-rose-200 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>人員離職與業務交接指派設定 (Offboarding Details)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">離職生效日 / 最後工作日</label>
                  <input
                    type="date"
                    required
                    value={lastWorkingDay}
                    onChange={(e) => setLastWorkingDay(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-rose-200 text-xs text-slate-800 bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">指定業務交接同仁 (Handover To)</label>
                  <select
                    value={handoverToName}
                    onChange={(e) => setHandoverToName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-rose-200 text-xs text-slate-800 bg-white focus:outline-none font-medium"
                  >
                    <option value="">由 N-1 部門主管直接接管權責</option>
                    {otherEmployees.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name} ({e.department} - {e.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-rose-800 leading-relaxed font-medium pt-1">
                註：核准此單據後，同仁【{selectedEmp?.name || '目標人員'}】將轉為已離職狀態，解除主管審核權限，並自組織架構主樹隱藏，移至 HR 歷史檔案庫。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">擬派任目標部門</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value as Department)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="研發部">研發部</option>
                  <option value="IT資訊部">IT資訊部</option>
                  <option value="行銷部">行銷部</option>
                  <option value="營運部">營運部</option>
                  <option value="永續營運部">永續營運部</option>
                  <option value="產品部">產品部</option>
                  <option value="人力資源部">人力資源部</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">擬調整/派任職稱</label>
                <input
                  type="text"
                  placeholder="例如：Senior Tech Lead / PM"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">組織變更與派任原由說明</label>
            <textarea
              rows={3}
              required
              placeholder="請簡要敘述本次組織調整、業務對接與權責安排原由..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* N-1 Approver Banner */}
          <div className="bg-amber-50/90 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>依組織權責規章，本案將送交以下 N-1 層級主管簽核：</span>
            </div>
            <div className="text-amber-800 font-semibold pl-5">
              • 【{selectedDept}】簽核主管：<strong>{approver.title} ({approver.name})</strong>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> 提出 HR 組織變更核准單
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
