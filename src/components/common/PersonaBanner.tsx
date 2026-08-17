import React from 'react';
import { UserRole } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Crown, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, HelpCircle, Layers } from 'lucide-react';

interface PersonaBannerProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pendingApprovalsCount?: number;
  unfiledCount?: number;
}

export const PersonaBanner: React.FC<PersonaBannerProps> = ({
  currentRole,
  onRoleChange,
  pendingApprovalsCount = 0,
  unfiledCount = 0,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isExec = currentRole === 'EXECUTIVE';

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${
        isExec
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 text-white'
          : 'bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border-teal-500/30 text-white'
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Persona Identity & Audience Description */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
              isExec
                ? 'bg-indigo-500/20 border-indigo-400/40 text-amber-300'
                : 'bg-teal-500/20 border-teal-400/40 text-teal-300'
            }`}
          >
            {isExec ? <Crown className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black uppercase tracking-wider border ${
                  isExec
                    ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                    : 'bg-teal-400/10 text-teal-300 border-teal-400/30'
                }`}
              >
                {isExec
                  ? isEn ? '👑 Target Audience: CEO / GM / Directors' : '👑 適用對象：總經理 / 處長 / 高階主管'
                  : isEn ? '✍️ Target Audience: Project Managers & Leads' : '✍️ 適用對象：專案經理 (PM) / 執行團隊'}
              </span>

              <span className="text-[11px] font-mono text-slate-400">
                {isExec
                  ? isEn ? '• Executive Cockpit View' : '• 高層決策戰情室模式'
                  : isEn ? '• Execution & Weekly Filing Studio' : '• 專案交付與週報填報模式'}
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              {isExec
                ? isEn ? 'Strategic Portfolio & Health Command Center' : '全公司專案大盤戰略與財務健康總覽'
                : isEn ? 'PM Project Delivery & Weekly Status Workbench' : '第一線 PM 專案交付進度與週報填寫中心'}
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {isExec
                ? isEn
                  ? 'High-level macro view: Monitor multi-department budgets, health status alerts (Red/Yellow/Green), and sign off on milestone approvals.'
                  : '專為高層設計：全域掌握各處預算消耗、紅黃燈風險卡點、AI 決策簡報與重大里程碑變更簽核（以審閱決策為主）。'
                : isEn
                  ? 'First-line operational view: Log weekly breakthroughs, request management assistance, run AI executive polish, and update milestones in full focus studio.'
                  : '專為 PM 團隊設計：填寫每週成果進展、向高管提出支援申請、一鍵 AI 潤飾並更新里程碑交付清單（以執行填報為主）。'}
            </p>
          </div>
        </div>

        {/* Right: Quick Role Switch Pill & Status Chips */}
        <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onRoleChange('EXECUTIVE')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isExec
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>👑</span>
              <span>{isEn ? 'Executive View' : '高管決策視角'}</span>
              {pendingApprovalsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full font-mono text-[10px] font-black">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onRoleChange('PM')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isExec
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>✍️</span>
              <span>{isEn ? 'PM Workbench' : 'PM 執行視角'}</span>
              {unfiledCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full font-mono text-[10px] font-black">
                  {unfiledCount}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
