import React, { useState } from 'react';
import { Project, Department, StrategicPriority, MilestoneChangeRequest, Currency } from '../../types';
import { getN1Approver } from '../../utils/approverUtils';
import { CURRENCY_LIST, CURRENCIES, formatCurrency } from '../../utils/currencyUtils';
import { 
  X, 
  Plus, 
  Building2, 
  Calendar, 
  User, 
  DollarSign, 
  Target, 
  Trash2, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: Project) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const [code, setCode] = useState(`PRJ-2026-0${Math.floor(Math.random() * 90) + 10}`);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department>('研發部');
  const [leadPm, setLeadPm] = useState('');
  const [strategicPriority, setStrategicPriority] = useState<StrategicPriority>('核心產品升級');
  const [currency, setCurrency] = useState<Currency>('TWD');
  const [totalBudget, setTotalBudget] = useState<number>(3000000);
  const [targetCompletionDate, setTargetCompletionDate] = useState('2026-11-30');
  const [description, setDescription] = useState('');

  // Dynamic initial milestones state
  const [initialDeliverables, setInitialDeliverables] = useState<Array<{ id: string; title: string; dueDate: string }>>([
    { id: 'del-init-1', title: '專案啟動會議與需求架構簽核', dueDate: today },
    { id: 'del-init-2', title: '第一階段 UAT 測試與上線準備', dueDate: '2026-11-30' },
  ]);

  const approver = getN1Approver(department);

  const handleAddMilestoneField = () => {
    setInitialDeliverables((prev) => [
      ...prev,
      { id: `del-init-${Date.now()}`, title: '', dueDate: targetCompletionDate }
    ]);
  };

  const handleRemoveMilestoneField = (id: string) => {
    if (initialDeliverables.length <= 1) {
      alert('立項新專案請至少保留一個核心里程碑！');
      return;
    }
    setInitialDeliverables((prev) => prev.filter((d) => d.id !== id));
  };

  const handleMilestoneChange = (id: string, field: 'title' | 'dueDate', value: string) => {
    setInitialDeliverables((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !leadPm.trim()) return;

    const projectId = `prj-${Date.now()}`;

    // Filter valid initial deliverables
    const validDeliverables = initialDeliverables
      .filter((d) => d.title.trim() !== '')
      .map((d, index) => ({
        id: `del-${projectId}-${index + 1}`,
        title: d.title.trim(),
        dueDate: d.dueDate || targetCompletionDate,
        completed: false,
      }));

    // Generate automatic Project Inception Approval Request for N-1 level manager
    const inceptionRequest: MilestoneChangeRequest = {
      id: `req-inception-${Date.now()}`,
      projectId,
      projectName: name.trim(),
      pmName: leadPm.trim(),
      changeType: 'ADD',
      newTitle: `【新專案立項簽核】${name.trim()} (${code.trim()})`,
      newDueDate: targetCompletionDate,
      reason: `主辦部門【${department}】提報新專案立項。戰略優先級：${strategicPriority}，總預算：${formatCurrency(Number(totalBudget), currency)} (${currency})。送交 ${approver.title} (${approver.name}) 執行 N-1 層級關卡簽核。`,
      status: 'PENDING',
      requestedAt: today,
    };

    const createdProject: Project = {
      id: projectId,
      code: code.trim(),
      name: name.trim(),
      department,
      leadPm: leadPm.trim(),
      strategicPriority,
      targetCompletionDate,
      currentProgress: 0,
      health: 'ON_TRACK',
      currency,
      totalBudget: Number(totalBudget),
      spentBudget: 0,
      description: description.trim() || '新專案立項推動中',
      updates: [
        {
          id: `upd-${Date.now()}`,
          date: today,
          pmName: leadPm.trim(),
          progress: 0,
          status: 'ON_TRACK',
          keyAchievements: ['新專案已建立並提報 N-1 主管立項審核關卡'],
          risksAndBlockers: '等待 N-1 層級主管簽核核准中。',
          managementAssistanceNeeded: `請 ${approver.title} (${approver.name}) 於簽核中心審閱與核准立項。`,
          nextMilestones: validDeliverables.map((d) => d.title),
        },
      ],
      keyDeliverables: validDeliverables.length > 0 ? validDeliverables : [
        { id: `del-${projectId}-1`, title: '專案啟動與範疇確認', dueDate: today, completed: false },
        { id: `del-${projectId}-2`, title: '主要功能開發生產線', dueDate: targetCompletionDate, completed: false }
      ],
      milestoneRequests: [inceptionRequest],
      createdAt: today,
      updatedAt: today,
    };

    onAddProject(createdProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-t-2xl shrink-0">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" /> 立項建立新專案 (Project Inception)
            </h3>
            <p className="text-xs text-slate-200 mt-0.5">輸入專案基礎資料、制定初期里程碑與 N-1 層級簽核流程</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>1. 專案基本資料 (Basic Profile)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">專案代碼 (Project Code)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">主責 PM 姓名與稱謂</label>
                <input
                  type="text"
                  required
                  placeholder="例如：陳雅婷 (Sarah Chen)"
                  value={leadPm}
                  onChange={(e) => setLeadPm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">專案全稱 (Project Name)</label>
              <input
                type="text"
                required
                placeholder="例如：新一代跨平台 CRM 顧客管理系統"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">主辦部門 (Department)</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">戰略優先級 (Strategic Priority)</label>
                <select
                  value={strategicPriority}
                  onChange={(e) => setStrategicPriority(e.target.value as StrategicPriority)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="核心產品升級">核心產品升級</option>
                  <option value="營運效率與自動化">營運效率與自動化</option>
                  <option value="市場拓展與品牌">市場拓展與品牌</option>
                  <option value="資安與基建">資安與基建</option>
                  <option value="永續與合規">永續與合規</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">預算幣別 (Currency)</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
                >
                  {CURRENCY_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  總預算金額 ({CURRENCIES[currency].symbol})
                </label>
                <input
                  type="number"
                  step={currency === 'USD' || currency === 'EUR' ? '1000' : '10000'}
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">預計完成日期</label>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">專案目標與範疇簡述</label>
              <textarea
                rows={2}
                placeholder="請簡要敘述專案商業目標、關鍵交付物與預期效益..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Section 2: Initial Milestones Setup */}
          <div className="space-y-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>2. 設定初期關鍵里程碑 (Initial Milestones)</span>
                </h4>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  📌 專案立項時可直接自訂預計里程碑；啟動後若有變動，須送交 N-1 主管關卡異動簽核。
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMilestoneField}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> 增加里程碑
              </button>
            </div>

            <div className="space-y-2">
              {initialDeliverables.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-xs font-mono font-bold text-indigo-600 w-6 text-center">
                    M{index + 1}
                  </span>
                  
                  <input
                    type="text"
                    required
                    placeholder="里程碑名稱（如：架構簽核、UAT驗收）"
                    value={item.title}
                    onChange={(e) => handleMilestoneChange(item.id, 'title', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />

                  <input
                    type="date"
                    required
                    value={item.dueDate}
                    onChange={(e) => handleMilestoneChange(item.id, 'dueDate', e.target.value)}
                    className="w-36 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveMilestoneField(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Organizational N-1 Approval Gateway Notice */}
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>3. 組織架構簽核關卡 (N-1 Approval Hierarchy)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-mono font-bold">
                {approver.level}
              </span>
            </div>

            <p className="text-xs text-amber-800">
              根據公司組織架構授權規定，新專案立項與後續里程碑變更將自動陳核至主辦部門 **{approver.title}**（無需直簽至 CEO）：
            </p>

            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200/80 text-xs">
              <div className="flex items-center gap-2 text-slate-800">
                <User className="w-4 h-4 text-indigo-600" />
                <span>指定的 N-1 簽核主管：<strong>{approver.title} ({approver.name})</strong></span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                自動發送簽核關卡通知
              </span>
            </div>
          </div>

          {/* Submit */}
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
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> 送出立項申請並開啟簽核
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
