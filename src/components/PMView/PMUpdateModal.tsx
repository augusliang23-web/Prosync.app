import React, { useState } from 'react';
import { Project, HealthStatus, ProjectUpdate } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  Sparkles, 
  Send, 
  Loader2, 
  AlertTriangle, 
  Trophy, 
  HelpCircle, 
  FileEdit,
  Check
} from 'lucide-react';

interface PMUpdateModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitUpdate: (projectId: string, update: ProjectUpdate) => void;
}

export const PMUpdateModal: React.FC<PMUpdateModalProps> = ({
  project,
  isOpen,
  onClose,
  onSubmitUpdate,
}) => {
  if (!isOpen || !project) return null;

  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const [progress, setProgress] = useState<number>(project.currentProgress);
  const [status, setStatus] = useState<HealthStatus>(project.health);
  const [achievementsText, setAchievementsText] = useState<string>('');
  const [risksText, setRisksText] = useState<string>('');
  const [assistanceText, setAssistanceText] = useState<string>('');
  const [nextMilestonesText, setNextMilestonesText] = useState<string>('');
  
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);
  const [polishedSuccess, setPolishedSuccess] = useState(false);

  const handlePolishWithAI = async () => {
    setIsPolishing(true);
    setPolishError(null);
    setPolishedSuccess(false);

    try {
      const res = await fetch('/api/ai/polish-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawAchievements: achievementsText,
          rawBlockers: risksText,
          rawAssistance: assistanceText,
        }),
      });

      if (!res.ok) {
        throw new Error(isEn ? 'AI polish service is temporarily unavailable' : 'AI 潤飾服務暫時無法連線');
      }

      const data = await res.json();
      if (data.polishedAchievements && Array.isArray(data.polishedAchievements)) {
        setAchievementsText(data.polishedAchievements.map((item: string) => `• ${item}`).join('\n'));
      }
      if (data.polishedBlockers) {
        setRisksText(data.polishedBlockers);
      }
      if (data.polishedAssistance) {
        setAssistanceText(data.polishedAssistance);
      }

      setPolishedSuccess(true);
      setTimeout(() => setPolishedSuccess(false), 3000);
    } catch (err: any) {
      console.error('AI Polish Error:', err);
      setPolishError(err.message || (isEn ? 'Polish failed' : '潤飾失敗'));
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const achievementsList = achievementsText
      .split('\n')
      .map((line) => line.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter((line) => line.length > 0);

    const milestonesList = nextMilestonesText
      .split('\n')
      .map((line) => line.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter((line) => line.length > 0);

    const newUpdate: ProjectUpdate = {
      id: `upd-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      pmName: project.leadPm,
      progress: Number(progress),
      status,
      keyAchievements: achievementsList.length > 0 ? achievementsList : [isEn ? 'Project progressing' : '專案推進中'],
      risksAndBlockers: risksText.trim(),
      managementAssistanceNeeded: assistanceText.trim(),
      nextMilestones: milestonesList,
    };

    onSubmitUpdate(project.id, newUpdate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-xl flex flex-col border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Low-Saturation Light Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-100/90 text-slate-800 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-slate-700" />
              {t('updateModal.title')} - {project.name}
            </h3>
            <p className="text-xs text-slate-500">{isEn ? `Code: ${project.code} | Lead PM: ${project.leadPm}` : `專案編號：${project.code} | PM：${project.leadPm}`}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800">
          
          {/* Progress Slider & Status Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('updateModal.progress')}: <span className="text-slate-800 text-sm font-extrabold">{progress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('updateModal.healthStatus')}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as HealthStatus)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200/80 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="ON_TRACK">{t('health.ON_TRACK')}</option>
                <option value="AT_RISK">{t('health.AT_RISK')}</option>
                <option value="DELAYED">{t('health.DELAYED')}</option>
                <option value="COMPLETED">{t('health.COMPLETED')}</option>
              </select>
            </div>
          </div>

          {/* AI Polish Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="text-xs text-slate-700 font-medium">
                {isEn ? 'Have rough notes? Click AI to polish into a C-suite ready briefing' : '口語化草稿？點擊 AI 幫您一鍵精煉成專業高層簡報文案'}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePolishWithAI}
              disabled={isPolishing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-2xs transition-all disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isPolishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-slate-300" />}
              <span>{isPolishing ? t('updateModal.aiPolishing') : `✨ ${t('updateModal.aiPolish')}`}</span>
            </button>
          </div>

          {polishedSuccess && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200/80 flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-600" /> {isEn ? 'Successfully polished notes with AI!' : '已成功將草稿文字精煉整理完成！'}
            </div>
          )}

          {polishError && (
            <div className="p-2.5 bg-rose-50 text-rose-800 text-xs rounded-lg border border-rose-200">
              {polishError}
            </div>
          )}

          {/* Key Achievements Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" /> {t('updateModal.achievements')}
            </label>
            <textarea
              rows={3}
              placeholder={t('updateModal.achievementsPlaceholder')}
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200/80 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
            />
          </div>

          {/* Risks and Blockers Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> {t('updateModal.blockers')}
            </label>
            <textarea
              rows={2}
              placeholder={t('updateModal.blockersPlaceholder')}
              value={risksText}
              onChange={(e) => setRisksText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200/80 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
            />
          </div>

          {/* Assistance Needed Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" /> {t('updateModal.assistance')}
            </label>
            <textarea
              rows={2}
              placeholder={t('updateModal.assistancePlaceholder')}
              value={assistanceText}
              onChange={(e) => setAssistanceText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200/80 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
            />
          </div>

          {/* Next Milestones Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isEn ? 'Next Milestones / Target Goals (1 per line)' : '下週預計推進里程碑 (一行一項)'}
            </label>
            <textarea
              rows={2}
              placeholder={isEn ? 'e.g., Begin cross-departmental UAT testing...' : '例如：展開跨部門 UAT 測試...'}
              value={nextMilestonesText}
              onChange={(e) => setNextMilestonesText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200/80 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('updateModal.cancel')}
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-2xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> {t('updateModal.submit')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
