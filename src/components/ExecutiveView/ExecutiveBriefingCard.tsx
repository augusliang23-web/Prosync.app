import React, { useState } from 'react';
import { ExecutiveBriefing, Project } from '../../types';
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
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WeeklyTrendChart } from './WeeklyTrendChart';

interface ExecutiveBriefingCardProps {
  briefing: ExecutiveBriefing;
  projects: Project[];
  onUpdateBriefing: (newBriefing: ExecutiveBriefing) => void;
  onSelectProject: (projectId: string) => void;
}

export const ExecutiveBriefingCard: React.FC<ExecutiveBriefingCardProps> = ({
  briefing,
  projects,
  onUpdateBriefing,
  onSelectProject,
}) => {
  const { language, t } = useLanguage();
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
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col overflow-hidden">
      
      {/* Low-Saturation Header Bar */}
      <div className="p-4 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-100 font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {t('briefing.cardTitle')}
              </h2>
              <span className="px-2 py-0.5 bg-slate-200/60 text-slate-700 text-[10px] font-semibold rounded uppercase border border-slate-300/40">
                AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('briefing.cardSub')} ({t('briefing.updateTime')}: {briefing.generatedAt})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? t('briefing.copied') : t('briefing.copyMemo')}</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-2xs transition-colors disabled:opacity-50"
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
      <div className="p-5 space-y-5">
        
        {/* Key Takeaway Banner */}
        <div className="bg-slate-100/80 border-l-3 border-slate-600 p-3.5 rounded-r-lg">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-normal">
            <strong className="font-bold text-slate-800">{t('briefing.takeaway')}: </strong>
            {briefing.overallExecutiveSummary}
          </p>
        </div>

        {/* Grid Section: Critical Risks vs Top Gains */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
          
          {/* Feature 3: Critical Blockers & Risks Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                {t('briefing.riskTitle')} ({briefing.criticalRisksAndDecisions.length})
              </h3>
              <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                Decision Required
              </span>
            </div>

            <div className="space-y-3">
              {briefing.criticalRisksAndDecisions.map((risk, idx) => (
                <div 
                  key={idx}
                  onClick={() => onSelectProject(risk.projectId)}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100/80 text-rose-800 border border-rose-200/60">
                        {risk.priority === 'HIGH' ? t('briefing.highRisk') : t('briefing.medRisk')}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        [{risk.department}]
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition-colors flex items-center gap-0.5">
                      {t('briefing.projectDetails')} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-700 transition-colors">
                    {risk.projectName}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1">
                    <strong className="text-rose-700">{t('briefing.blocker')}: </strong>{risk.issue}
                  </p>

                  <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs space-y-1">
                    <div className="text-slate-600">
                      <strong>{t('briefing.pmRequest')}: </strong>{risk.pmAssistanceRequested}
                    </div>
                    <div className="text-slate-800 font-medium">
                      💡 <strong>{t('briefing.aiRecommend')}: </strong>{risk.aiRecommendedAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gains & Strategic Recommendations Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                {t('briefing.winsTitle')}
              </h3>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                On Track Progress
              </span>
            </div>

            <div className="space-y-2">
              {briefing.topWinsAndProgress.map((win, idx) => (
                <div 
                  key={idx}
                  onClick={() => onSelectProject(win.projectId)}
                  className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/30 hover:bg-white transition-all cursor-pointer group flex items-start gap-2.5 text-xs"
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
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> {t('briefing.strategicRecs')}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {briefing.strategicRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                    <span>{rec}</span>
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
