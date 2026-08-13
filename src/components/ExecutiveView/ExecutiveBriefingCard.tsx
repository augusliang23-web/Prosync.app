import React, { useState } from 'react';
import { ExecutiveBriefing, Project, CriticalRiskItem, ExecutiveDecisionRecord } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  AlertTriangle, 
  Trophy, 
  Lightbulb, 
  RefreshCw, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  MessageSquareText,
  Lock,
  ChevronRight
} from 'lucide-react';

interface ExecutiveBriefingCardProps {
  briefing: ExecutiveBriefing;
  projects: Project[];
  decisions?: ExecutiveDecisionRecord[];
  onUpdateBriefing: (newBriefing: ExecutiveBriefing) => void;
  onSelectProject: (projectId: string) => void;
  onOpenCaptureDecision?: (riskItem: CriticalRiskItem) => void;
  onOpenSystemOfRecord?: () => void;
  onOpenAIQA?: (question: string) => void;
}

export const ExecutiveBriefingCard: React.FC<ExecutiveBriefingCardProps> = ({
  briefing,
  projects,
  decisions = [],
  onUpdateBriefing,
  onSelectProject,
  onOpenCaptureDecision,
  onOpenSystemOfRecord,
  onOpenAIQA
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects, lang: language }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || t('briefing.failedError'));
      }

      const data: ExecutiveBriefing = await res.json();
      onUpdateBriefing(data);
    } catch (err: any) {
      console.error('Briefing generation error:', err);
      setErrorMsg(err.message || t('briefing.failedError'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMemo = () => {
    const text = `【${t('briefing.memoTitle')}】
${t('briefing.updateTime')}: ${briefing.generatedAt}

1. ${t('briefing.takeaway')}
${briefing.overallExecutiveSummary}

2. ${t('briefing.riskTitle')}
${briefing.criticalRisksAndDecisions.map((r, i) => `${i + 1}. [${r.department}] ${r.projectName} (${r.leadPm})
- ${t('briefing.blocker')}: ${r.issue}
- ${t('briefing.pmRequest')}: ${r.pmAssistanceRequested}
- ${t('briefing.aiRecommend')}: ${r.aiRecommendedAction}`).join('\n\n')}

3. ${t('briefing.winsTitle')}
${briefing.topWinsAndProgress.map((w, i) => `${i + 1}. [${w.department}] ${w.projectName}: ${w.achievement}`).join('\n')}

4. ${t('briefing.strategicRecs')}
${briefing.strategicRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
      
      {/* Executive Header Bar */}
      <div className="p-4 sm:p-4.5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold shadow-2xs">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {t('briefing.cardTitle')}
              </h2>
              <span className="px-2 py-0.5 bg-indigo-500 text-slate-950 text-[10px] font-mono font-bold rounded">
                AI System of Record
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              {t('briefing.cardSub')} ({t('briefing.updateTime')}: {briefing.generatedAt})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenSystemOfRecord && (
            <button
              onClick={onOpenSystemOfRecord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/40 shadow-xs transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? 'System of Record Log' : '高層決策歷程標竿庫'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-mono text-[10px]">
                {decisions.length}
              </span>
            </button>
          )}

          <button
            onClick={handleCopyMemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span>{copied ? t('briefing.copied') : t('briefing.copyMemo')}</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? t('briefing.generating') : t('briefing.regenerate')}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="m-4 p-3 bg-rose-50/80 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Briefing Body */}
      <div className="p-4 sm:p-5 space-y-5">
        
        {/* Key Takeaway Banner */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-2xs">
          <p className="text-xs sm:text-sm leading-relaxed font-normal">
            <strong className="font-bold text-amber-400">⚡ {t('briefing.takeaway')}: </strong>
            {briefing.overallExecutiveSummary}
          </p>
        </div>

        {/* Grid Section: Critical Risks vs Top Gains */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
          
          {/* Column 1: Critical Blockers & Executive Decisions Required */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t('briefing.riskTitle')} ({briefing.criticalRisksAndDecisions.length})</span>
              </h3>
              <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300 animate-pulse">
                🔴 Decision System Trigger
              </span>
            </div>

            <div className="space-y-3">
              {briefing.criticalRisksAndDecisions.map((risk, idx) => {
                const existingDecision = decisions.find((d) => d.projectId === risk.projectId);

                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          {risk.priority === 'HIGH' ? t('briefing.highRisk') : t('briefing.medRisk')}
                        </span>
                        <span className="text-xs font-bold text-indigo-900">
                          [{risk.department}]
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {risk.projectName}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectProject(risk.projectId)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-0.5 cursor-pointer"
                      >
                        {t('briefing.projectDetails')} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-rose-700">{t('briefing.blocker')}: </strong>{risk.issue}
                    </p>

                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                      <div className="text-slate-800">
                        <strong className="text-amber-900">🙋‍♂️ {t('briefing.pmRequest')}: </strong>{risk.pmAssistanceRequested}
                      </div>
                      <div className="text-slate-900 font-medium">
                        💡 <strong>{t('briefing.aiRecommend')}: </strong>{risk.aiRecommendedAction}
                      </div>
                    </div>

                    {/* Decision Action Bar (Closed Loop Step ⑤) */}
                    {existingDecision ? (
                      <div className="bg-emerald-50 border border-emerald-200/80 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-medium">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>{isEn ? 'Logged:' : '高層已拍板：'}</strong> {existingDecision.outcome}
                            {existingDecision.approvedAmount ? ` (+${existingDecision.approvedCurrency || 'TWD'} ${existingDecision.approvedAmount.toLocaleString()})` : ''}
                            <span className="text-[10px] text-emerald-700 ml-1">({existingDecision.decisionMakerName})</span>
                          </span>
                        </div>

                        {onOpenSystemOfRecord && (
                          <button
                            onClick={onOpenSystemOfRecord}
                            className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>{isEn ? 'View Log' : '查看履歷'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="pt-1 flex items-center gap-2 flex-wrap">
                        {onOpenCaptureDecision && (
                          <button
                            type="button"
                            onClick={() => onOpenCaptureDecision(risk)}
                            className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-500/30"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-200" />
                            <span>{isEn ? 'Approve / Capture Decision' : '進行高層拍板與授權 (Capture)'}</span>
                          </button>
                        )}

                        {onOpenAIQA && (
                          <button
                            type="button"
                            onClick={() => {
                              const q = isEn
                                ? `Evaluate ROI and risk for approving ${risk.projectName} request: ${risk.pmAssistanceRequested}`
                                : `針對【${risk.projectName}】提出的協助需求：「${risk.pmAssistanceRequested}」，請分析高層核准與否對全公司營運、時程與預算的利弊影響？`;
                              onOpenAIQA(q);
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <MessageSquareText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{isEn ? 'Ask AI' : '諮詢 AI'}</span>
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Top Gains & Strategic Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>{t('briefing.winsTitle')}</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                On Track Progress
              </span>
            </div>

            <div className="space-y-2">
              {briefing.topWinsAndProgress.map((win, idx) => (
                <div 
                  key={idx}
                  onClick={() => onSelectProject(win.projectId)}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group flex items-start gap-2.5 text-xs shadow-2xs"
                >
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">[{win.department}] {win.projectName}: </span>
                    <span className="text-slate-600">{win.achievement}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Recommendations */}
            <div className="pt-3 mt-3 border-t border-slate-200/60">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> {t('briefing.strategicRecs')}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {briefing.strategicRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                    <span className="font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

