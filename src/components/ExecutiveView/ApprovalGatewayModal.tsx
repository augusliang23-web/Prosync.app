import React, { useState } from 'react';
import { Project, MilestoneChangeRequest, OrgChangeRequest } from '../../types';
import { getN1Approver } from '../../utils/approverUtils';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  FileCheck2, 
  Check, 
  Ban, 
  Lock, 
  Calendar, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
  Clock,
  Sparkles,
  Shield,
  Users,
  UserPlus
} from 'lucide-react';

interface ApprovalGatewayModalProps {
  isOpen: boolean;
  projects: Project[];
  orgRequests?: OrgChangeRequest[];
  onClose: () => void;
  onReviewMilestoneRequest: (projectId: string, requestId: string, action: 'APPROVE' | 'REJECT', comment?: string) => void;
  onReviewOrgRequest?: (requestId: string, action: 'APPROVE' | 'REJECT', comment?: string) => void;
  onSelectProject?: (projectId: string) => void;
}

export const ApprovalGatewayModal: React.FC<ApprovalGatewayModalProps> = ({
  isOpen,
  projects,
  orgRequests = [],
  onClose,
  onReviewMilestoneRequest,
  onReviewOrgRequest,
  onSelectProject
}) => {
  if (!isOpen) return null;

  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'ORG'>('PROJECTS');
  const [comments, setComments] = useState<{ [reqId: string]: string }>({});
  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  // Gather all pending milestone requests across all projects
  const pendingItems: { project: Project; req: MilestoneChangeRequest }[] = [];
  projects.forEach((p) => {
    (p.milestoneRequests || []).forEach((r) => {
      if (r.status === 'PENDING') {
        pendingItems.push({ project: p, req: r });
      }
    });
  });

  const pendingOrgItems = orgRequests.filter((r) => r.status === 'PENDING');

  const handleCommentChange = (reqId: string, val: string) => {
    setComments((prev) => ({ ...prev, [reqId]: val }));
  };

  const handleAction = (projectId: string, requestId: string, action: 'APPROVE' | 'REJECT', projectName: string) => {
    const comment = comments[requestId] || (action === 'APPROVE' ? 'N-1 主管/高層核准變更' : 'N-1 主管/高層退回變更');
    onReviewMilestoneRequest(projectId, requestId, action, comment);
    
    setLastActionMsg(`已成功${action === 'APPROVE' ? '核准' : '退回'}【${projectName}】之里程碑異動申請！`);
    setTimeout(() => setLastActionMsg(null), 3000);
  };

  const handleOrgAction = (requestId: string, action: 'APPROVE' | 'REJECT', targetName: string) => {
    if (!onReviewOrgRequest) return;
    const comment = comments[requestId] || (action === 'APPROVE' ? 'N-1 主管/高層核准 HR 組織異動' : 'N-1 主管/高層退回 HR 組織異動');
    onReviewOrgRequest(requestId, action, comment);

    setLastActionMsg(`已成功${action === 'APPROVE' ? '核准' : '退回'}【${targetName}】之 HR 組織架構變更申請！`);
    setTimeout(() => setLastActionMsg(null), 3000);
  };

  const handleBatchApproveAll = () => {
    if (activeTab === 'PROJECTS') {
      if (window.confirm(`確定要一次【一鍵全數核准】共 ${pendingItems.length} 筆待簽核之里程碑變更申請嗎？`)) {
        pendingItems.forEach(({ project, req }) => {
          onReviewMilestoneRequest(project.id, req.id, 'APPROVE', 'N-1 主管批量核准');
        });
        setLastActionMsg(`已成功完成共 ${pendingItems.length} 筆里程碑的批量簽核與基線更新！`);
        setTimeout(() => setLastActionMsg(null), 3500);
      }
    } else {
      if (window.confirm(`確定要一次【一鍵全數核准】共 ${pendingOrgItems.length} 筆待簽核之 HR 組織異動單嗎？`)) {
        pendingOrgItems.forEach((req) => {
          if (onReviewOrgRequest) onReviewOrgRequest(req.id, 'APPROVE', 'N-1 主管批量核准 HR 組織異動');
        });
        setLastActionMsg(`已成功完成共 ${pendingOrgItems.length} 筆 HR 組織異動單的簽核與組織圖生效！`);
        setTimeout(() => setLastActionMsg(null), 3500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl relative">
              <FileCheck2 className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {isEn ? 'Department N-1 / Executive Approval Gateway' : '部門 N-1 / 高層簽核中心 (Approval Gateway)'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs shadow-xs">
                  {pendingItems.length + pendingOrgItems.length} {isEn ? 'Pending' : '筆待簽核'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>{isEn ? 'Org Governance & Authorization Guard: Two-stage review by N-1 executives' : '組織架構與專案授權防護：依 N-1 層級主管權責進行二階審核'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(activeTab === 'PROJECTS' ? pendingItems.length : pendingOrgItems.length) > 1 && (
              <button
                onClick={handleBatchApproveAll}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEn ? 'Approve All' : '一鍵全部核准'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 pt-2 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('PROJECTS')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'PROJECTS'
                ? 'bg-white text-indigo-900 border-slate-200 shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            <span>{isEn ? `Milestones & Project Approvals (${pendingItems.length})` : `專案與里程碑異動審核 (${pendingItems.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('ORG')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'ORG'
                ? 'bg-white text-indigo-900 border-slate-200 shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? `HR Org Change Approvals (${pendingOrgItems.length})` : `HR 組織架構變更簽核 (${pendingOrgItems.length})`}</span>
            {pendingOrgItems.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Action Toast Notification */}
        {lastActionMsg && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2.5 font-bold flex items-center justify-between animate-in slide-in-from-top duration-200 shrink-0">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>{lastActionMsg}</span>
            </span>
            <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-mono">基線與組織數據同步完成</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60 flex-1">
          
          {activeTab === 'PROJECTS' ? (
            pendingItems.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">目前尚無待審核的里程碑變更申請</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  所有 PM 提報之里程碑與專案基線皆已完成核准或在預定軌道上進行。
                </p>
              </div>
            ) : (
              pendingItems.map(({ project, req }) => (
                <div 
                  key={req.id} 
                  className="bg-white rounded-2xl border border-amber-200/90 shadow-xs hover:border-amber-300 transition-all p-4 sm:p-5 space-y-3.5"
                >
                  {/* Item Top Badge & Info */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700 border border-slate-200">
                        {project.code}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          if (onSelectProject) onSelectProject(project.id);
                        }}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors text-left"
                      >
                        {project.name}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Building2 className="w-3 h-3 text-slate-400" /> {project.department}
                      </span>
                      <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        <Shield className="w-3 h-3 text-indigo-500" /> N-1 主管: {getN1Approver(project.department).title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        req.changeType === 'ADD' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : req.changeType === 'MODIFY_DATE'
                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {req.changeType === 'ADD' ? '新增里程碑' : req.changeType === 'MODIFY_DATE' ? '展延/改期' : '刪除申請'}
                      </span>
                    </div>
                  </div>

                  {/* Target Deliverable Comparison Box */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
                    <div className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>申請標的：{req.newTitle}</span>
                    </div>

                    {req.originalDueDate ? (
                      <div className="flex items-center gap-2 text-xs font-mono bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 line-through">原基線交期：{req.originalDueDate}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-amber-700 font-bold">新申請展延至：{req.newDueDate}</span>
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-indigo-800 bg-indigo-50/60 p-2 rounded-lg border border-indigo-200/60">
                        擬新增預定交期：<strong className="text-indigo-900">{req.newDueDate}</strong>
                      </div>
                    )}

                    {/* Justification Reason */}
                    <div className="pt-1 text-slate-700">
                      <strong className="text-slate-900 font-bold block mb-0.5">PM 變更理由說明 (Justification)：</strong>
                      <p className="text-xs leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80 text-slate-800">
                        {req.reason}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> 提報 PM：<strong>{req.pmName}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> 提報時間：{req.requestedAt}
                      </span>
                    </div>
                  </div>

                  {/* Review Action Controls */}
                  <div className="pt-1 space-y-2">
                    <input
                      type="text"
                      placeholder="可選輸入 N-1 簽核意見或指示..."
                      value={comments[req.id] || ''}
                      onChange={(e) => handleCommentChange(req.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400"
                    />

                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleAction(project.id, req.id, 'REJECT', project.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5 text-rose-500" />
                        <span>退回申請</span>
                      </button>

                      <button
                        onClick={() => handleAction(project.id, req.id, 'APPROVE', project.name)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>核准簽核並更新基線</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )
          ) : (
            pendingOrgItems.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">目前尚無待審核的 HR 組織架構異動單</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  HR 提案之人員調動與 N-1 主管指派均已處理完畢，最新組織名冊正常運作中。
                </p>
              </div>
            ) : (
              pendingOrgItems.map((orgReq) => {
                const isOffboard = orgReq.changeType === 'OFFBOARD_MEMBER';
                return (
                  <div 
                    key={orgReq.id}
                    className={`bg-white rounded-2xl border shadow-xs transition-all p-4 sm:p-5 space-y-3.5 ${
                      isOffboard 
                        ? 'border-rose-300 hover:border-rose-400 bg-rose-50/20' 
                        : 'border-emerald-200/90 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                          isOffboard
                            ? 'bg-rose-100 text-rose-900 border-rose-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {isOffboard ? '離職辦退與業務交接單' : 'HR 組織變更單'}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{orgReq.targetEmployeeName}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {orgReq.department}
                        </span>
                        <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          N-1 審核主管: {getN1Approver(orgReq.department).title}
                        </span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border text-xs space-y-2 ${
                      isOffboard
                        ? 'bg-rose-50/80 border-rose-200/90 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      <p className="font-medium leading-relaxed">
                        {orgReq.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                        <span>提案人：{orgReq.applicantName}</span>
                        <span>申請日期：{orgReq.requestedAt}</span>
                      </div>
                    </div>

                    {/* Review controls */}
                    <div className="pt-1 space-y-2">
                      <input
                        type="text"
                        placeholder="可選輸入 N-1 審核批註..."
                        value={comments[orgReq.id] || ''}
                        onChange={(e) => handleCommentChange(orgReq.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400"
                      />

                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleOrgAction(orgReq.id, 'REJECT', orgReq.targetEmployeeName)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-500" />
                          <span>退回單據</span>
                        </button>

                        <button
                          onClick={() => handleOrgAction(orgReq.id, 'APPROVE', orgReq.targetEmployeeName)}
                          className={`px-4 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                            isOffboard 
                              ? 'bg-rose-600 hover:bg-rose-700' 
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{isOffboard ? '核准辦退並更新狀態' : '核准變更單並更新架構'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px]">
            提示：核准後，專案簽核與人員權責將自動連動至最新組織架構。
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            關閉
          </button>
        </div>

      </div>
    </div>
  );
};

