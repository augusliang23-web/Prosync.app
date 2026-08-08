import React, { useState } from 'react';
import { HierarchyLevelConfig } from '../../types';
import { X, Plus, Trash2, Layers, Check, ShieldCheck } from 'lucide-react';

interface HierarchyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  hierarchyLevels: HierarchyLevelConfig[];
  onSaveLevels: (levels: HierarchyLevelConfig[]) => void;
}

export const HierarchyConfigModal: React.FC<HierarchyConfigModalProps> = ({
  isOpen,
  onClose,
  hierarchyLevels,
  onSaveLevels,
}) => {
  const [levels, setLevels] = useState<HierarchyLevelConfig[]>(hierarchyLevels);
  const [newLevelId, setNewLevelId] = useState('');
  const [newLevelName, setNewLevelName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  if (!isOpen) return null;

  const handleAddLevel = () => {
    if (!newLevelId.trim() || !newLevelName.trim()) return;
    const levelIdFormatted = newLevelId.trim().toUpperCase();
    
    // Check if duplicate
    if (levels.some((l) => l.levelId === levelIdFormatted)) {
      alert('該層級代碼已存在！');
      return;
    }

    const newLevelObj: HierarchyLevelConfig = {
      levelId: levelIdFormatted,
      levelName: newLevelName.trim(),
      order: levels.length,
      description: newDescription.trim() || `${levelIdFormatted} 層級組織架構`,
    };

    setLevels([...levels, newLevelObj]);
    setNewLevelId('');
    setNewLevelName('');
    setNewDescription('');
  };

  const handleDeleteLevel = (levelId: string) => {
    if (levelId === 'CEO' || levelId === 'N-1') {
      alert('CEO 及 N-1 一級主管屬核心組織基準，不允許刪除！');
      return;
    }
    setLevels(levels.filter((l) => l.levelId !== levelId));
  };

  const handleSave = () => {
    onSaveLevels(levels);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">自訂組織階層架構規範 (Hierarchy Tiers)</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                制定全公司及各部門可用之 N-1, N-2, N-3 階層數與名稱權責
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

        {/* Content */}
        <div className="p-5 space-y-5">
          
          {/* Current Levels List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              已定義之組織階層 ({levels.length} 層級)
            </label>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {levels.map((lvl, index) => (
                <div
                  key={lvl.levelId}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-mono font-extrabold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {lvl.levelId}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{lvl.levelName}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{lvl.description}</p>
                    </div>
                  </div>

                  {lvl.levelId !== 'CEO' && lvl.levelId !== 'N-1' ? (
                    <button
                      onClick={() => handleDeleteLevel(lvl.levelId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="刪除此層級"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-1 bg-slate-200/60 rounded">
                      核心層級
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Level Tier Form */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
            <h3 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>新增自訂組織層級 (例如: N-4, N-5, Advisor)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">層級代碼 (Code)</label>
                <input
                  type="text"
                  placeholder="例如: N-4"
                  value={newLevelId}
                  onChange={(e) => setNewLevelId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">層級名稱 (Name)</label>
                <input
                  type="text"
                  placeholder="例如: N-4 第一線助理"
                  value={newLevelName}
                  onChange={(e) => setNewLevelName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">說明與權責</label>
              <input
                type="text"
                placeholder="說明該層級在組織中的職能範疇..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
              />
            </div>

            <button
              onClick={handleAddLevel}
              disabled={!newLevelId.trim() || !newLevelName.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>加入組織層級清單</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>儲存層級架構設定</span>
          </button>
        </div>

      </div>
    </div>
  );
};
