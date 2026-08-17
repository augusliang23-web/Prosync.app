import React from 'react';
import { UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LogoVariant } from './BrandLogo';
import { 
  Menu,
  Plus, 
  FileText,
  Globe,
  FileCheck2,
  Share2,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAddProject: () => void;
  onOpenQA: () => void;
  onOpenReportModal: () => void;
  onOpenMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
  logoVariant: LogoVariant;
  onOpenLogoSelector: () => void;
  pendingApprovalsCount?: number;
  onOpenApprovalGateway?: () => void;
  onOpenDemoTour?: () => void;
  onOpenLinkedInModal?: () => void;
  onOpenSystemOfRecord?: () => void;
  decisionsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenAddProject,
  onOpenQA,
  onOpenReportModal,
  onOpenMobileSidebar,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
  logoVariant,
  onOpenLogoSelector,
  pendingApprovalsCount = 0,
  onOpenApprovalGateway,
  onOpenDemoTour,
  onOpenLinkedInModal,
  onOpenSystemOfRecord,
  decisionsCount = 0,
}) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-30 shadow-2xs">
      
      {/* Left Title & Mobile Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button (Only shown on small screens) */}
        <button
          onClick={onOpenMobileSidebar}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
          title="開啟選單"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {currentRole === 'EXECUTIVE' ? t('header.execTitle') : t('header.pmTitle')}
          </h1>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2 sm:gap-2.5">

        {/* System of Record Quick Access Button */}
        {onOpenSystemOfRecord && (
          <button
            onClick={onOpenSystemOfRecord}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all cursor-pointer border border-indigo-500/30"
            title="查看高層決策歷程與行動履歷中心"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">
              {language === 'en' ? 'Decision Record' : '高層決策履歷'}
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-extrabold">
              {decisionsCount}
            </span>
          </button>
        )}
        

        {/* Prominent High-Level C-Suite Approval Notification Button */}
        {pendingApprovalsCount > 0 && onOpenApprovalGateway && (
          <button
            onClick={onOpenApprovalGateway}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-slate-950 shadow-md hover:shadow-lg transition-all animate-pulse cursor-pointer border border-amber-300 ring-2 ring-amber-400/30"
            title="查看待高層簽核之專案里程碑申請"
          >
            <FileCheck2 className="w-4 h-4 text-slate-950 shrink-0" />
            <span className="hidden md:inline font-bold">
              {language === 'en' ? 'Approvals' : '高層簽核關卡'}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[11px] font-mono font-black">
              {pendingApprovalsCount}
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-white animate-ping" />
          </button>
        )}

        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200 transition-all shadow-2xs cursor-pointer"
          title="Language Switcher / 中英文切換"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <span>{language === 'zh' ? 'EN' : '繁中'}</span>
        </button>

        {/* Perspective Toggle Pills */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300/80 text-xs font-bold shadow-2xs">
          <button
            onClick={() => onRoleChange('EXECUTIVE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentRole === 'EXECUTIVE'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            <span>👑</span>
            <span>{t('header.executive')}</span>
          </button>
          <button
            onClick={() => onRoleChange('PM')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentRole === 'PM'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            <span>✍️</span>
            <span>{t('header.pmView')}</span>
          </button>
        </div>

        {/* Meeting Memo Modal */}
        {currentRole === 'EXECUTIVE' && (
          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors border border-slate-200/80 cursor-pointer"
            title={t('header.memoExport')}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">{t('header.memoExport')}</span>
          </button>
        )}

        {/* Primary Action Button */}
        <button
          onClick={onOpenAddProject}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('header.addProject')}</span>
        </button>

      </div>

    </header>
  );
};

