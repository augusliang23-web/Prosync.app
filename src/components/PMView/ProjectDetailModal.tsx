import React, { useState } from 'react';
import { Project, UserRole, MilestoneChangeRequest, MilestoneChangeType } from '../../types';
import { HealthBadge } from '../common/HealthBadge';
import { ProgressBar } from '../common/ProgressBar';
import { formatCurrency } from '../../utils/currencyUtils';
import { 
  X, 
  Calendar, 
  FileEdit, 
  CheckSquare, 
  Square, 
  Clock, 
  AlertTriangle, 
  Trophy, 
  HelpCircle,
  Plus,
  ShieldCheck,
  Check,
  Ban,
  FileCheck2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  currentRole: UserRole;
  onClose: () => void;
  onOpenLogUpdate: (project: Project) => void;
  onOpenEditProject?: (project: Project) => void;
  onToggleDeliverable: (projectId: string, deliverableId: string) => void;
  onRequestMilestoneChange: (projectId: string, request: MilestoneChangeRequest) => void;
  onReviewMilestoneRequest: (projectId: string, requestId: string, action: 'APPROVE' | 'REJECT', comment?: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  currentRole,
  onClose,
  onOpenLogUpdate,
  onOpenEditProject,
  onToggleDeliverable,
  onRequestMilestoneChange,
  onReviewMilestoneRequest,
}) => {
  if (!project) return null;

  // Form state for creating a new Change Request (CR)
  const [isCrModalOpen, setIsCrModalOpen] = useState(false);
  const [changeType, setChangeType] = useState<MilestoneChangeType>('ADD');
  const [targetDeliverableId, setTargetDeliverableId] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [reason, setReason] = useState('');
  const [crSubmittedMsg, setCrSubmittedMsg] = useState(false);

  const pendingRequests = (project.milestoneRequests || []).filter(r => r.status === 'PENDING');
  const pastRequests = (project.milestoneRequests || []).filter(r => r.status !== 'PENDING');

  const formatMoneyTWD = (amount: number) => {
    return `NT$ ${amount.toLocaleString()}`;
  };

  const budgetRatio = project.totalBudget > 0 ? Math.round((project.spentBudget / project.totalBudget) * 100) : 0;

  // Pre-fill target deliverable when choosing MODIFY_DATE or DELETE
  const handleSelectTargetDeliverable = (delId: string) => {
    setTargetDeliverableId(delId);
    const target = project.keyDeliverables.find(d => d.id === delId);
    if (target) {
      setNewTitle(target.title);
      setNewDueDate(target.dueDate);
    }
  };

  const handleSubmitCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate || !reason.trim()) {
      alert('請完整填寫里程碑名稱、日期與變更理由說明！');
      return;
    }

    const selectedDel = project.keyDeliverables.find(d => d.id === targetDeliverableId);

    const newRequest: MilestoneChangeRequest = {
      id: `cr-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      pmName: project.leadPm,
      changeType,
      deliverableId: changeType !== 'ADD' ? targetDeliverableId : undefined,
      originalTitle: selectedDel?.title,
      originalDueDate: selectedDel?.dueDate,
      newTitle: newTitle.trim(),
      newDueDate,
      reason: reason.trim(),
      status: 'PENDING',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onRequestMilestoneChange(project.id, newRequest);
    setIsCrModalOpen(false);
    setCrSubmittedMsg(true);
    setTimeout(() => setCrSubmittedMsg(false), 4000);

    // Reset form
    setNewTitle('');
    setNewDueDate('');
    setReason('');
    setTargetDeliverableId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-xl flex flex-col border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-100/90 text-slate-800 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white rounded text-slate-700 border border-slate-200/80">
              {project.code}
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-800 line-clamp-1">{project.name}</h3>
              <p className="text-xs text-slate-500">部門：{project.department} | PM：{project.leadPm}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEditProject && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEditProject(project);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5" /> 編輯專案資訊
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenLogUpdate(project);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-2xs transition-all cursor-pointer"
            >
              <FileEdit className="w-3.5 h-3.5" /> 填寫週報
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* CR Success Toast Notification */}
          {crSubmittedMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>已成功提交里程碑變更申請單 (CR)！正在等待高層管理者 (Executive) 審核核准。</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono">基線防護保護中</span>
            </div>
          )}

          {/* Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 block mb-1 font-medium">健康狀態</span>
              <HealthBadge status={project.health} size="md" />
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1 font-medium">整體完成率</span>
              <ProgressBar progress={project.currentProgress} health={project.health} size="md" />
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1 font-medium">預算使用狀況 ({project.currency || 'TWD'})</span>
              <div className="flex items-baseline justify-between text-xs font-medium">
                <span className="text-slate-800 font-mono font-bold">
                  {formatCurrency(project.spentBudget, project.currency || 'TWD')} / {formatCurrency(project.totalBudget, project.currency || 'TWD')}
                </span>
                <span className="text-slate-700 font-bold">{budgetRatio}%</span>
              </div>
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-slate-600 rounded-full"
                  style={{ width: `${Math.min(100, budgetRatio)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">專案簡介與戰略定位</h4>
            <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded inline-block mb-2 border border-slate-200/60">
              戰略優先級：{project.strategicPriority}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{project.description}</p>
          </div>

          {/* Key Deliverables & Milestone Governance Section */}
          <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200/80">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  <span>核心功能 #6：專案主里程碑與基線管報 (Master Milestone Governance)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  里程碑代表向 C-Suite 承諾之基線 (Baseline)。調整或新增項目須提交「變更申請單 (CR)」並經高層審核。
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                  完成率：{project.keyDeliverables.filter((d) => d.completed).length} / {project.keyDeliverables.length}
                </span>

                <button
                  onClick={() => setIsCrModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>申請里程碑異動 (CR)</span>
                </button>
              </div>
            </div>

            {/* Pending Change Requests (if any) */}
            {pendingRequests.length > 0 && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> 待審核之里程碑變更申請 ({pendingRequests.length} 件)
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                    審核關卡中
                  </span>
                </div>

                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-2.5 bg-white rounded-lg border border-amber-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 text-[10px] bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                          {req.changeType === 'ADD' ? '新增項目' : req.changeType === 'MODIFY_DATE' ? '展延/改期' : '刪除申請'}
                        </span>
                        {req.newTitle}
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">預計：{req.newDueDate}</span>
                    </div>

                    <p className="text-slate-600 text-[11px]">
                      <strong className="text-slate-700">變更理由：</strong> {req.reason}
                    </p>

                    {/* Executive Approval Quick Actions inside modal */}
                    {currentRole === 'EXECUTIVE' && (
                      <div className="pt-1.5 flex items-center justify-end gap-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">您具備高層審核權限：</span>
                        <button
                          onClick={() => onReviewMilestoneRequest(project.id, req.id, 'REJECT', '高層退回需求')}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3 text-rose-500" /> 退回
                        </button>
                        <button
                          onClick={() => onReviewMilestoneRequest(project.id, req.id, 'APPROVE', '高層核准通過')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3 h-3" /> 核准變更並更新基線
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Current Deliverables List */}
            <div className="space-y-2">
              {project.keyDeliverables.map((del) => (
                <div
                  key={del.id}
                  onClick={() => onToggleDeliverable(project.id, del.id)}
                  className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    {del.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${del.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {del.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {del.originalDueDate && del.originalDueDate !== del.dueDate && (
                      <span className="text-[10px] text-slate-400 line-through font-mono">
                        原定 {del.originalDueDate}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-600 font-mono flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                      <Calendar className="w-3 h-3 text-slate-500" /> {del.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Past Change History Log */}
            {pastRequests.length > 0 && (
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">里程碑歷史審核變更軌跡 (Audit Log)</span>
                <div className="space-y-1">
                  {pastRequests.map((req) => (
                    <div key={req.id} className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200/60 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                          req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {req.status === 'APPROVED' ? '已核准' : '退回'}
                        </span>
                        <span>{req.newTitle}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{req.requestedAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Weekly PM Updates History Timeline */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" /> PM 週報歷史紀錄 (Updates Timeline)
            </h4>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {project.updates.map((update) => (
                <div key={update.id} className="relative pl-7">
                  <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-white" />

                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{update.date} 週報</span>
                        <span className="text-slate-500">PM: {update.pmName}</span>
                      </div>
                      <HealthBadge status={update.status} size="sm" />
                    </div>

                    {update.keyAchievements.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-0.5">
                          <Trophy className="w-3 h-3 text-emerald-600" /> 本週成果
                        </span>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                          {update.keyAchievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {update.risksAndBlockers && (
                      <div className="p-2 rounded bg-rose-50/60 border border-rose-200/60 text-xs">
                        <span className="font-bold text-rose-800 flex items-center gap-1 mb-0.5">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> 當前阻礙
                        </span>
                        <p className="text-slate-700">{update.risksAndBlockers}</p>
                      </div>
                    )}

                    {update.managementAssistanceNeeded && (
                      <div className="p-2 rounded bg-slate-100 border border-slate-200/80 text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1 mb-0.5">
                          <HelpCircle className="w-3 h-3 text-slate-600" /> 高層協助請求
                        </span>
                        <p className="text-slate-800 font-medium">{update.managementAssistanceNeeded}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Sub-Modal for Creating Milestone Change Request */}
      {isCrModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                提報里程碑變更申請單 (Milestone Change Request)
              </h3>
              <button onClick={() => setIsCrModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCR} className="space-y-3.5 text-xs">
              {/* Change Type Tabs */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">變更類型</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setChangeType('ADD');
                      setNewTitle('');
                      setNewDueDate('');
                    }}
                    className={`py-1.5 rounded-lg text-center transition-all ${
                      changeType === 'ADD' ? 'bg-white text-indigo-600 font-bold shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    新增里程碑
                  </button>
                  <button
                    type="button"
                    onClick={() => setChangeType('MODIFY_DATE')}
                    className={`py-1.5 rounded-lg text-center transition-all ${
                      changeType === 'MODIFY_DATE' ? 'bg-white text-indigo-600 font-bold shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    展延/改期
                  </button>
                  <button
                    type="button"
                    onClick={() => setChangeType('DELETE')}
                    className={`py-1.5 rounded-lg text-center transition-all ${
                      changeType === 'DELETE' ? 'bg-white text-rose-600 font-bold shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    申請刪除
                  </button>
                </div>
              </div>

              {/* Target deliverable selector for MODIFY/DELETE */}
              {changeType !== 'ADD' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">選擇欲異動之既有里程碑</label>
                  <select
                    value={targetDeliverableId}
                    onChange={(e) => handleSelectTargetDeliverable(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white"
                  >
                    <option value="">-- 請選擇里程碑 --</option>
                    {project.keyDeliverables.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title} (目前：{d.dueDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title & Date */}
              {changeType !== 'DELETE' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">里程碑名稱</label>
                    <input
                      type="text"
                      placeholder="例如：完成第二階段安全認證與測試"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">預計完成日期 (Target Due Date)</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </>
              )}

              {/* Mandatory Reason */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>變更理由說明 (Mandatory Justification)</span>
                  <span className="text-[10px] text-rose-500 font-normal">* 高層審核依據</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="例如：外部第三方金流 API 端點規格更新，經評估需額外追加 2 週聯調壓力測試..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCrModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
                >
                  送出變更申請單 (CR)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
