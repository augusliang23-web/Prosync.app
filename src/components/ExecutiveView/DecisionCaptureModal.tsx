import React, { useState } from 'react';
import { Project, CriticalRiskItem, ExecutiveDecisionRecord, TraceableActionItem, ExecutiveDecisionOutcome } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  MessageSquareText, 
  Plus, 
  Trash2, 
  User, 
  Building2,
  Calendar,
  FileCheck2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface DecisionCaptureModalProps {
  isOpen: boolean;
  riskItem: CriticalRiskItem | null;
  project?: Project | null;
  onClose: () => void;
  onConfirmDecision: (newRecord: ExecutiveDecisionRecord, updatedBudget?: { projectId: string; addedAmount: number }) => void;
  onOpenAIQA?: (question: string) => void;
}

export const DecisionCaptureModal: React.FC<DecisionCaptureModalProps> = ({
  isOpen,
  riskItem,
  project,
  onClose,
  onConfirmDecision,
  onOpenAIQA
}) => {
  if (!isOpen || !riskItem) return null;

  const { language } = useLanguage();
  const isEn = language === 'en';

  const [outcome, setOutcome] = useState<ExecutiveDecisionOutcome>('APPROVED');
  const [decisionMakerRole, setDecisionMakerRole] = useState('VP of Technology & Operations');
  const [decisionMakerName, setDecisionMakerName] = useState('張董事長 (Marcus Chang)');
  
  // Extract numerical budget request if present
  const defaultAmount = riskItem.pmAssistanceRequested.includes('30萬') ? 300000 : 
                        riskItem.pmAssistanceRequested.includes('80k') || riskItem.pmAssistanceRequested.includes('80,000') ? 80000 : 0;
  
  const [approvedAmount, setApprovedAmount] = useState<number>(defaultAmount);
  const [approvedCurrency, setApprovedCurrency] = useState(project?.currency || 'TWD');
  const [decisionReason, setDecisionReason] = useState<string>(
    riskItem.aiRecommendedAction.replace(/^【.*?】/, '').trim() ||
    (isEn ? 'Approved for critical schedule recovery and risk mitigation.' : '核准執行以確保關鍵里程碑時程與風險掌控。')
  );

  // Default Action Items
  const [actionItems, setActionItems] = useState<TraceableActionItem[]>([
    {
      id: `act-${Date.now()}-1`,
      title: isEn ? `Adjust project budget/resources for ${riskItem.projectName}` : `核撥追加資源並更新 ${riskItem.projectName} 之財務與專案基線`,
      assignee: riskItem.leadPm || 'Lead PM',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
      status: 'IN_PROGRESS'
    },
    {
      id: `act-${Date.now()}-2`,
      title: isEn ? `Execute vendor/contract adjustments and notify cross-dept leads` : `執行外包/廠商合規調整，並通知跨部門主管進行第二階段對焦`,
      assignee: `${riskItem.department} PM Team`,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
      status: 'OPEN'
    }
  ]);

  const handleAddActionItem = () => {
    setActionItems((prev) => [
      ...prev,
      {
        id: `act-${Date.now()}-${prev.length + 1}`,
        title: isEn ? 'New action item' : '新追蹤行動項目',
        assignee: riskItem.leadPm || 'PM',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
        status: 'OPEN'
      }
    ]);
  };

  const handleRemoveActionItem = (id: string) => {
    setActionItems((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateActionItem = (id: string, field: keyof TraceableActionItem, val: any) => {
    setActionItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: val } : a))
    );
  };

  const handleAskAIFirst = () => {
    if (onOpenAIQA) {
      const q = isEn
        ? `What is the strategic impact and ROI if we approve the request for ${riskItem.projectName}? (${riskItem.pmAssistanceRequested})`
        : `針對【${riskItem.projectName}】提出的協助需求：「${riskItem.pmAssistanceRequested}」，請分析高層核准與否對全公司營運、時程與預算的利弊影響？`;
      onOpenAIQA(q);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newRecord: ExecutiveDecisionRecord = {
      id: `dec-${Date.now()}`,
      projectId: riskItem.projectId,
      projectName: riskItem.projectName,
      department: riskItem.department,
      leadPm: riskItem.leadPm,
      decisionMakerRole,
      decisionMakerName,
      timestamp: timestampStr,
      issueTitle: riskItem.issue,
      pmAssistanceRequested: riskItem.pmAssistanceRequested,
      outcome,
      approvedAmount: outcome === 'APPROVED' && approvedAmount > 0 ? approvedAmount : undefined,
      approvedCurrency,
      decisionReason,
      actionItems
    };

    const budgetUpdate = (outcome === 'APPROVED' && approvedAmount > 0) ? {
      projectId: riskItem.projectId,
      addedAmount: approvedAmount
    } : undefined;

    onConfirmDecision(newRecord, budgetUpdate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-xl relative">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {isEn ? 'Capture Executive Decision (Step ⑤ & ⑥)' : '高層決策拍板與行動追蹤 (Decision Capture)'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-indigo-500 text-slate-950 font-mono font-bold text-[10px]">
                  System of Record
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {isEn ? 'Convert AI Risk Detection into a permanent, traceable executive decision' : '將 AI 週報風險偵測轉化為具備法律與審計效力的永續高層決策紀錄'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6-Step Visual Progress Bar */}
        <div className="bg-slate-900 text-slate-300 px-4 py-2 border-b border-indigo-900/50 flex items-center justify-between text-[10px] sm:text-xs overflow-x-auto shrink-0 font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold">1</span>
            <span>PM 週報</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold">2</span>
            <span>AI 偵測</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold">3</span>
            <span>簡報摘要</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">4</span>
            <span>AI 問答</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">5</span>
            <span>高層決策</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold shrink-0">
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">6</span>
            <span>行動歷程庫</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50 flex-1">

          {/* Context Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                [{riskItem.department}] {riskItem.projectName}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {isEn ? 'Lead PM:' : '主責 PM：'} <strong>{riskItem.leadPm}</strong>
              </span>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-bold text-rose-800 flex items-start gap-1">
                <span className="shrink-0">🔴 {isEn ? 'Detected Risk/Blocker:' : '週報瓶頸：'}</span>
                <span>{riskItem.issue}</span>
              </div>
              <div className="font-semibold text-slate-700 flex items-start gap-1 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 mt-1">
                <span className="shrink-0 text-amber-800">🙋‍♂️ {isEn ? 'PM Assistance Needed:' : 'PM 申請協助：'}</span>
                <span className="text-slate-900">{riskItem.pmAssistanceRequested}</span>
              </div>
            </div>

            <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI 智慧戰略建議 (AI Recommendation)：</span>
              </div>
              <p className="text-slate-600 leading-snug">{riskItem.aiRecommendedAction}</p>
            </div>
          </div>

          {/* Ask AI First Banner */}
          {onOpenAIQA && (
            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-900">
                <MessageSquareText className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{isEn ? 'Not sure yet? Ask AI to simulate decision impact & ROI first.' : '尚不確定決策影響？可先向 AI 諮詢此項核准的全盤 ROI 與風險預估。'}</span>
              </div>
              <button
                type="button"
                onClick={handleAskAIFirst}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <span>{isEn ? 'Ask AI QA' : '詢問 AI 評估'}</span>
              </button>
            </div>
          )}

          {/* Outcome Selection Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isEn ? '1. Select Executive Decision Outcome' : '1. 請選擇高層裁決結果 (Decision Outcome)'}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setOutcome('APPROVED')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                  outcome === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isEn ? 'APPROVED (核准)' : '核准 (APPROVED)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('REJECTED')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                  outcome === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-5 h-5" />
                <span>{isEn ? 'REJECTED (否決)' : '否決 (REJECTED)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('NEED_MORE_INFO')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                  outcome === 'NEED_MORE_INFO'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span>{isEn ? 'NEED MORE INFO' : '需補件說明 (NEED INFO)'}</span>
              </button>
            </div>
          </div>

          {/* Decision Maker Role & Name Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Decision Maker Role/Title' : '裁決主管職稱 (Role/Title)'}
              </label>
              <input
                type="text"
                value={decisionMakerRole}
                onChange={(e) => setDecisionMakerRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-indigo-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Decision Maker Name' : '裁決主管姓名 (Name)'}
              </label>
              <input
                type="text"
                value={decisionMakerName}
                onChange={(e) => setDecisionMakerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-indigo-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Budget Allocation Input (if Approved) */}
          {outcome === 'APPROVED' && (
            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? 'Approved Budget Amount (Auto-Updates Project Total Budget)' : '核可追加/調整之金額 (系統將自動同步累加至專案總預算)'}</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-700">Currency: {approvedCurrency}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(Number(e.target.value))}
                  className="flex-1 px-3 py-2 rounded-lg border border-emerald-300 text-xs font-mono font-bold text-emerald-900 bg-white focus:ring-1 focus:ring-emerald-500"
                  placeholder="0"
                />
                <span className="font-mono text-xs font-bold text-emerald-800">{approvedCurrency}</span>
              </div>
            </div>
          )}

          {/* Decision Reason / Justification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isEn ? '2. Executive Decision Reason & Justification' : '2. 高層裁決原因與批註指示 (Decision Justification)'}
            </label>
            <textarea
              rows={3}
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400"
              placeholder="請輸入裁決之商業理由、核准條件或交辦指示..."
              required
            />
          </div>

          {/* Step 6: Generated Traceable Action Items */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>{isEn ? '3. Traceable Action Items (Step ⑥)' : '3. 自動衍生之可追蹤行動項目 (Traceable Actions)'}</span>
              </label>
              <button
                type="button"
                onClick={handleAddActionItem}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors flex items-center gap-1 border border-indigo-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? 'Add Action' : '新增行動項'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {actionItems.map((act, idx) => (
                <div key={act.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
                  <div className="flex-1 w-full space-y-1">
                    <input
                      type="text"
                      value={act.title}
                      onChange={(e) => handleUpdateActionItem(act.id, 'title', e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                      placeholder="行動項目名稱..."
                    />
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <input
                          type="text"
                          value={act.assignee}
                          onChange={(e) => handleUpdateActionItem(act.id, 'assignee', e.target.value)}
                          className="px-1.5 py-0.5 rounded border border-slate-200 text-[11px] font-medium bg-white w-28"
                          placeholder="執行人"
                        />
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <input
                          type="date"
                          value={act.dueDate}
                          onChange={(e) => handleUpdateActionItem(act.id, 'dueDate', e.target.value)}
                          className="px-1.5 py-0.5 rounded border border-slate-200 text-[11px] font-mono bg-white"
                        />
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveActionItem(act.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                    title="刪除此項"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              {isEn ? 'Cancel' : '取消'}
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 hover:from-indigo-800 hover:to-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 border border-indigo-700/50"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? 'Lock & Log Decision Record' : '拍板並正式寫入高層決策庫 (Log Decision)'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
