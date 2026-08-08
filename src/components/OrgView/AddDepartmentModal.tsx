import React, { useState } from 'react';
import { Department } from '../../types';
import { X, Building2, Plus, Check } from 'lucide-react';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (deptName: string) => void;
  existingDepartments: string[];
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onAddDepartment,
  existingDepartments,
}) => {
  const [deptName, setDeptName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = deptName.trim();
    if (!trimmed) return;

    if (existingDepartments.includes(trimmed)) {
      alert(`【${trimmed}】部門已經存在！`);
      return;
    }

    onAddDepartment(trimmed);
    setDeptName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
              <Building2 className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-extrabold text-slate-900">新增企業部門 (Add New Department)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              部門名稱 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例如: 數據分析部, 採購部..."
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
            <span className="font-bold block">💡 提示：</span>
            <p className="text-slate-600">
              新增部門後，系統將自動將其加入全公司組織架構圖與專案分配清單中，您可接著為該部門指派 N-1 簽核主管與團隊成員。
            </p>
          </div>

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
              disabled={!deptName.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>確定建立部門</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
