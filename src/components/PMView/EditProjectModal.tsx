import React, { useState, useEffect } from 'react';
import { Project, Department, StrategicPriority, HealthStatus, Currency, KeyDeliverable } from '../../types';
import { CURRENCY_LIST, CURRENCIES, formatCurrency } from '../../utils/currencyUtils';
import { 
  X, 
  Save, 
  Building2, 
  Calendar, 
  User, 
  DollarSign, 
  Target, 
  Trash2, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle,
  FileEdit,
  Clock
} from 'lucide-react';

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (updatedProject: Project) => void;
  departmentsList: string[];
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaveProject,
  departmentsList,
}) => {
  if (!isOpen || !project) return null;

  const [name, setName] = useState(project.name);
  const [code, setCode] = useState(project.code);
  const [department, setDepartment] = useState<Department>(project.department);
  const [leadPm, setLeadPm] = useState(project.leadPm);
  const [strategicPriority, setStrategicPriority] = useState<StrategicPriority>(project.strategicPriority);
  const [currency, setCurrency] = useState<Currency>(project.currency || 'TWD');
  const [totalBudget, setTotalBudget] = useState<number>(project.totalBudget);
  const [spentBudget, setSpentBudget] = useState<number>(project.spentBudget);
  const [health, setHealth] = useState<HealthStatus>(project.health);
  const [currentProgress, setCurrentProgress] = useState<number>(project.currentProgress);
  const [targetCompletionDate, setTargetCompletionDate] = useState(project.targetCompletionDate);
  const [description, setDescription] = useState(project.description);
  const [deliverables, setDeliverables] = useState<KeyDeliverable[]>(project.keyDeliverables || []);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setCode(project.code);
      setDepartment(project.department);
      setLeadPm(project.leadPm);
      setStrategicPriority(project.strategicPriority);
      setCurrency(project.currency || 'TWD');
      setTotalBudget(project.totalBudget);
      setSpentBudget(project.spentBudget);
      setHealth(project.health);
      setCurrentProgress(project.currentProgress);
      setTargetCompletionDate(project.targetCompletionDate);
      setDescription(project.description);
      setDeliverables(project.keyDeliverables || []);
    }
  }, [project]);

  const handleAddDeliverable = () => {
    const newDel: KeyDeliverable = {
      id: `del-${Date.now()}`,
      title: '新里程碑交付項目',
      dueDate: targetCompletionDate || new Date().toISOString().split('T')[0],
      completed: false,
    };
    setDeliverables((prev) => [...prev, newDel]);
  };

  const handleUpdateDeliverable = (id: string, field: keyof KeyDeliverable, value: any) => {
    setDeliverables((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleRemoveDeliverable = (id: string) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !leadPm.trim()) {
      alert('請完整填寫專案名稱與主責 PM！');
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
      health,
      currentProgress: Number(currentProgress),
      targetCompletionDate,
      description: description.trim(),
      keyDeliverables: deliverables,
    };

    onSaveProject(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                <span>編輯專案資訊模組</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs border border-indigo-500/30">
                  {code}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">修改專案核心資料、預算、進度與里程碑交付項目</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>專案基本設定</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">專案名稱 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="請輸入專案完整名稱"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">專案代碼 (Project Code)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">主責部門 (Department)</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {(departmentsList || ['研發部', 'IT資訊部', '行銷部', '營運部', '永續營運部', '產品部']).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">專案經理 (Lead PM) <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={leadPm}
                  onChange={(e) => setLeadPm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="PM 姓名"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Health, Progress & Target Date */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>健康度與進度狀態</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">健康狀態 (Health Status)</label>
                <select
                  value={health}
                  onChange={(e) => setHealth(e.target.value as HealthStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ON_TRACK">🟢 正常推進 (ON_TRACK)</option>
                  <option value="AT_RISK">🟡 存在風險 (AT_RISK)</option>
                  <option value="DELAYED">🔴 已延宕 (DELAYED)</option>
                  <option value="COMPLETED">🔵 已完工 (COMPLETED)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">完成進度 ({currentProgress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentProgress}
                  onChange={(e) => setCurrentProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">預定完工日 Target Date</label>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial Budget */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
              <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
              <span>財務預算與幣別設定</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">計價幣別 (Currency)</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {CURRENCY_LIST.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol}) - {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">總預算 (Total Budget)</label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">已支用預算 (Spent Budget)</label>
                <input
                  type="number"
                  value={spentBudget}
                  onChange={(e) => setSpentBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Strategic Description */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-700">專案摘要與範疇說明</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              placeholder="請簡述本專案之範疇與目標..."
            />
          </div>

          {/* Section 5: Key Deliverables & Milestones */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b pb-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>核心里程碑交付項目 ({deliverables.length})</span>
              </div>
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增里程碑</span>
              </button>
            </div>

            <div className="space-y-2">
              {deliverables.map((del) => (
                <div key={del.id} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={del.completed}
                    onChange={(e) => handleUpdateDeliverable(del.id, 'completed', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={del.title}
                    onChange={(e) => handleUpdateDeliverable(del.id, 'title', e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none bg-white"
                    placeholder="里程碑名稱"
                  />
                  <input
                    type="date"
                    value={del.dueDate}
                    onChange={(e) => handleUpdateDeliverable(del.id, 'dueDate', e.target.value)}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-700 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(del.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>儲存變更並更新專案</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
