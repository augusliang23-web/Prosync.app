import React, { useState } from 'react';
import { ExecutiveDecisionRecord, TraceableActionItem, Department } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Building2, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  DollarSign, 
  Clock, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';

interface DecisionSystemOfRecordModalProps {
  isOpen: boolean;
  decisions: ExecutiveDecisionRecord[];
  onClose: () => void;
  onUpdateActionStatus: (decisionId: string, actionId: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED') => void;
  onSelectProject?: (projectId: string) => void;
}

export const DecisionSystemOfRecordModal: React.FC<DecisionSystemOfRecordModalProps> = ({
  isOpen,
  decisions,
  onClose,
  onUpdateActionStatus,
  onSelectProject
}) => {
  if (!isOpen) return null;

  const { language } = useLanguage();
  const isEn = language === 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  // Filter decisions
  const filteredDecisions = decisions.filter((dec) => {
    const matchesSearch = 
      dec.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dec.decisionMakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dec.decisionReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dec.issueTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'ALL' || dec.department === selectedDept;
    const matchesOutcome = selectedOutcome === 'ALL' || dec.outcome === selectedOutcome;

    return matchesSearch && matchesDept && matchesOutcome;
  });

  // Calculate totals
  const totalApprovedCount = decisions.filter((d) => d.outcome === 'APPROVED').length;
  
  let totalApprovedAmountTWD = 0;
  decisions.forEach((d) => {
    if (d.outcome === 'APPROVED' && d.approvedAmount) {
      if (d.approvedCurrency === 'USD') totalApprovedAmountTWD += d.approvedAmount * 32.5;
      else if (d.approvedCurrency === 'EUR') totalApprovedAmountTWD += d.approvedAmount * 35;
      else if (d.approvedCurrency === 'JPY') totalApprovedAmountTWD += d.approvedAmount * 0.22;
      else totalApprovedAmountTWD += d.approvedAmount;
    }
  });

  let totalActions = 0;
  let completedActions = 0;
  decisions.forEach((d) => {
    d.actionItems.forEach((a) => {
      totalActions++;
      if (a.status === 'COMPLETED') completedActions++;
    });
  });

  const completionPercent = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  const handleCopyAuditTrail = () => {
    const text = `【高層決策與行動履歷系統 (Decision System of Record)】
生成時間：${new Date().toISOString().replace('T', ' ').substring(0, 16)}

${decisions.map((d, i) => `---
[決策紀錄 #${i + 1}]
專案：[${d.department}] ${d.projectName} (PM: ${d.leadPm})
裁決主管：${d.decisionMakerName} (${d.decisionMakerRole})
裁決時間：${d.timestamp}
裁決結果：${d.outcome} ${d.approvedAmount ? `(金額: ${d.approvedCurrency || 'TWD'} ${d.approvedAmount.toLocaleString()})` : ''}
週報瓶頸：${d.issueTitle}
PM 申請：${d.pmAssistanceRequested}
高層決策理由：${d.decisionReason}

可追蹤行動項目 (${d.actionItems.filter(a => a.status === 'COMPLETED').length}/${d.actionItems.length} 完成)：
${d.actionItems.map(a => ` - [${a.status === 'COMPLETED' ? 'V' : ' '}] ${a.title} (負責人: ${a.assignee}, 到期日: ${a.dueDate})`).join('\n')}
`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl relative">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {isEn ? 'Executive Decision System of Record' : '高層決策履歷與行動追蹤中心 (System of Record)'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono font-bold text-xs">
                  {decisions.length} {isEn ? 'Records' : '筆決策紀錄'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEn ? 'Immutable, traceable repository of all executive approvals and post-decision action items' : '具備追蹤與履歷功能之企業級高層拍板資料庫，自動銜接專案週報與執行進度'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAuditTrail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors cursor-pointer border border-indigo-400/30"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isEn ? 'Copied' : '已複製') : (isEn ? 'Export Audit Log' : '複製決策稽核履歷')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6-Step Visual Closed Loop Pipeline */}
        <div className="bg-slate-900 text-slate-300 px-4 py-2 border-b border-indigo-900/50 flex items-center justify-between text-[11px] overflow-x-auto shrink-0 font-mono">
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">1</span>
            <span>① PM 週報</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">2</span>
            <span>② Risk 偵測</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">3</span>
            <span>③ AI Brief</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">4</span>
            <span>④ AI Q&A</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1 text-amber-400 font-bold shrink-0">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">5</span>
            <span>⑤ 高層決策</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1 text-emerald-400 font-bold shrink-0 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/40">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">6</span>
            <span>⑥ 可追蹤行動庫 (Active)</span>
          </div>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="bg-slate-100 p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">{isEn ? 'Captured Decisions' : '已拍板決策總數'}</div>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                {decisions.length} <span className="text-xs text-emerald-600">({totalApprovedCount} 核准)</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">{isEn ? 'Approved Budget Allocations' : '累計核准追加預算'}</div>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                NT$ {(totalApprovedAmountTWD / 10000).toFixed(1)} 萬
              </div>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">{isEn ? 'Action Items Progress' : '衍生行動項完成率'}</div>
              <div className="text-base font-extrabold text-indigo-900 font-mono mt-0.5">
                {completionPercent}% <span className="text-xs text-slate-500">({completedActions}/{totalActions})</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isEn ? 'Search project, decision maker...' : '搜尋專案、決策主管或關鍵字...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
            >
              <option value="ALL">{isEn ? 'All Outcomes' : '全部決策狀態'}</option>
              <option value="APPROVED">{isEn ? 'Approved' : '核准 (APPROVED)'}</option>
              <option value="REJECTED">{isEn ? 'Rejected' : '否決 (REJECTED)'}</option>
              <option value="NEED_MORE_INFO">{isEn ? 'Need Info' : '需補件 (NEED INFO)'}</option>
            </select>
          </div>
        </div>

        {/* Decisions List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60 flex-1">
          {filteredDecisions.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">未找到符合條件的高層決策紀錄</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                可調整上方搜尋條件，或從 AI 簡報卡片點選【高層拍板】新增第一筆決策。
              </p>
            </div>
          ) : (
            filteredDecisions.map((dec) => {
              const isApproved = dec.outcome === 'APPROVED';
              const isRejected = dec.outcome === 'REJECTED';

              const decCompletedActions = dec.actionItems.filter(a => a.status === 'COMPLETED').length;
              const decTotalActions = dec.actionItems.length;

              return (
                <div 
                  key={dec.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3 hover:border-slate-300 transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-200">
                        {dec.department}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          if (onSelectProject) onSelectProject(dec.projectId);
                        }}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors text-left"
                      >
                        {dec.projectName}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isRejected
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        {!isApproved && !isRejected && <HelpCircle className="w-3.5 h-3.5 text-amber-600" />}
                        <span>{dec.outcome}</span>
                        {dec.approvedAmount && (
                          <span className="font-mono ml-1 font-extrabold">
                            +{dec.approvedCurrency || 'TWD'} {dec.approvedAmount.toLocaleString()}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Decision Maker & Timestamp Banner */}
                  <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        VP
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? 'Decision Maker' : '裁決主管與職稱'}</span>
                        <span className="font-bold text-white">{dec.decisionMakerName} ({dec.decisionMakerRole})</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{dec.timestamp}</span>
                    </div>
                  </div>

                  {/* Issue & PM Request */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
                    <div className="text-slate-800">
                      <strong className="text-slate-900 font-bold">{isEn ? 'PM Blocker:' : '週報偵測瓶頸：'}</strong> {dec.issueTitle}
                    </div>
                    <div className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                      <strong className="text-indigo-900 font-bold">{isEn ? 'PM Request:' : 'PM 提報協助：'}</strong> {dec.pmAssistanceRequested}
                    </div>
                  </div>

                  {/* Executive Reason / Justification */}
                  <div className="bg-indigo-50/70 border border-indigo-200/80 p-3 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>高層裁決理由與批註指示 (Decision Justification)：</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {dec.decisionReason}
                    </p>
                  </div>

                  {/* Traceable Action Items Section */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        <span>可追蹤衍生行動項 (Traceable Actions)</span>
                      </span>
                      <span className="text-[11px] font-mono font-normal text-slate-500">
                        {decCompletedActions} / {decTotalActions} 已完成 ({decTotalActions > 0 ? Math.round((decCompletedActions/decTotalActions)*100) : 0}%)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {dec.actionItems.map((act) => {
                        const isDone = act.status === 'COMPLETED';
                        return (
                          <div 
                            key={act.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                              isDone
                                ? 'bg-emerald-50/60 border-emerald-200/80 text-slate-600'
                                : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                            }`}
                          >
                            <button
                              onClick={() => onUpdateActionStatus(dec.id, act.id, isDone ? 'IN_PROGRESS' : 'COMPLETED')}
                              className="flex items-start gap-2 text-left flex-1 cursor-pointer"
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 hover:text-indigo-600" />
                              )}
                              <span className={isDone ? 'line-through text-slate-500 font-medium' : 'font-semibold'}>
                                {act.title}
                              </span>
                            </button>

                            <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
                              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                                {act.assignee}
                              </span>
                              <span className="text-slate-400">
                                {act.dueDate}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px]">
            {isEn ? 'All logged decisions are stored as permanent audit trails.' : '提示：所有高層裁決紀錄均包含時間戳記與執行人脈絡，並可供 C-Suite 會議檢視。'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : '關閉'}
          </button>
        </div>

      </div>
    </div>
  );
};
