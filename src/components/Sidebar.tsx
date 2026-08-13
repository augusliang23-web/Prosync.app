import React from 'react';
import { UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LogoVariant, BrandLogo } from './BrandLogo';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Plus, 
  RotateCcw, 
  MessageSquare, 
  FileText,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Users,
  Shield,
  UserCheck,
  HeartHandshake,
  Share2,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentView: 'PROJECTS' | 'ORG_STRUCTURE';
  onViewChange: (view: 'PROJECTS' | 'ORG_STRUCTURE') => void;
  onOpenAddProject: () => void;
  onOpenQA: () => void;
  onOpenReportModal: () => void;
  onResetData: () => void;
  atRiskCount: number;
  delayedCount: number;
  isOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  logoVariant: LogoVariant;
  onOpenLogoSelector: () => void;
  pendingApprovalsCount?: number;
  onOpenApprovalGateway?: () => void;
  onOpenLinkedInModal?: () => void;
  onOpenSystemOfRecord?: () => void;
  decisionsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  onRoleChange,
  currentView,
  onViewChange,
  onOpenAddProject,
  onOpenQA,
  onOpenReportModal,
  onResetData,
  atRiskCount,
  delayedCount,
  isOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  logoVariant,
  onOpenLogoSelector,
  pendingApprovalsCount = 0,
  onOpenApprovalGateway,
  onOpenLinkedInModal,
  onOpenSystemOfRecord,
  decisionsCount = 0,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const totalAlerts = atRiskCount + delayedCount;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:relative top-0 bottom-0 left-0 z-40 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800/80 transition-all duration-300 shrink-0 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'}`}
      >
        {/* Floating Edge Seam Collapse Control */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3.5 top-5 z-50 w-7 h-7 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 shadow-md hover:shadow-lg items-center justify-center transition-all group hover:scale-110 cursor-pointer ring-2 ring-slate-900/20"
          title={isCollapsed ? "展開側邊欄" : "收折側邊欄"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
          )}
        </button>

        {/* Brand Header */}
        <div className={`p-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 ${isCollapsed ? 'lg:justify-center' : ''}`}>
          
          <div className="flex items-center gap-2">
            <BrandLogo variant={logoVariant} size="md" showText={!isCollapsed} textClassName="text-white" />
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7 Core Features Banner */}
        {!isCollapsed && (
          <div className="mx-3.5 mt-3.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white block truncate">{t('sidebar.7featuresTitle')}</span>
                <p className="text-[10px] text-slate-400 truncate">{t('sidebar.7featuresSub')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleLanguage}
                className="px-1.5 py-1 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-colors"
                title="Switch Language / 中英文切換"
              >
                {language === 'zh' ? 'EN' : '繁中'}
              </button>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-5 text-xs overflow-y-auto">
          
          {/* Section 1: Core System Modules */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-1.5 px-2">
                {language === 'en' ? 'System Views' : '核心模組 (System Views)'}
              </div>
            )}

            <div className="space-y-1">
              {/* Projects & Portfolio View */}
              <button
                onClick={() => {
                  onViewChange('PROJECTS');
                  onCloseMobile();
                }}
                title={isCollapsed ? (language === 'en' ? 'Projects Portfolio' : '專案管理總覽') : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  currentView === 'PROJECTS'
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${currentView === 'PROJECTS' ? 'text-white' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{language === 'en' ? 'Projects & Portfolio' : '專案管理與儀表板'}</span>}
                </div>
                {!isCollapsed && totalAlerts > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {/* Org Architecture View */}
              <button
                onClick={() => {
                  onViewChange('ORG_STRUCTURE');
                  onCloseMobile();
                }}
                title={isCollapsed ? (language === 'en' ? 'Org Architecture & HR' : '組織架構與人員管理') : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  currentView === 'ORG_STRUCTURE'
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className={`w-4 h-4 ${currentView === 'ORG_STRUCTURE' ? 'text-white' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{language === 'en' ? 'Org Architecture & HR' : '組織架構與人員管理'}</span>}
                </div>
                {!isCollapsed && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 text-[9px] font-mono font-bold">
                    N-1/HR
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Role Switcher */}
          {!isCollapsed && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-1.5 px-2">
                {language === 'en' ? 'Role Perspective' : '當前角色身份 (Role Perspective)'}
              </div>

              <div className="space-y-1 bg-slate-800/40 p-1.5 rounded-xl border border-slate-800">
                {[
                  { id: 'EXECUTIVE', label: language === 'en' ? 'C-Suite Executive' : 'C-Suite 高層主管', icon: HeartHandshake, badge: language === 'en' ? 'Full Review' : '全覽審核' },
                  { id: 'N1_MANAGER', label: language === 'en' ? 'N-1 Dept Manager' : 'N-1 部門主管', icon: Shield, badge: language === 'en' ? 'Dept Review' : '部門審核' },
                  { id: 'HR_MANAGER', label: language === 'en' ? 'HR Manager' : 'HR 人力資源主管', icon: UserCheck, badge: language === 'en' ? 'Org Admin' : '組織維護' },
                  { id: 'PM', label: language === 'en' ? 'Project Manager (PM)' : '專案經理 (PM)', icon: FolderGit2, badge: language === 'en' ? 'Execution' : '專案執行' },
                ].map((role) => {
                  const Icon = role.icon;
                  const isSelected = currentRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => onRoleChange(role.id as UserRole)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40' 
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span>{role.label}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal">
                        {role.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: AI & Executive Gateway */}
          <div>
            {!isCollapsed && (
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-1.5 px-2">
                {t('sidebar.sectionAiTools')}
              </div>
            )}

            <div className="space-y-1">

              {/* System of Record (高層決策履歷與行動庫) */}
              {onOpenSystemOfRecord && (
                <button
                  onClick={() => {
                    onOpenSystemOfRecord();
                    onCloseMobile();
                  }}
                  title={isCollapsed ? "高層決策履歷" : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-xl transition-all cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    {!isCollapsed && <span>{language === 'en' ? 'Decision Record' : '高層決策履歷 (Record)'}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 font-mono">
                      {decisionsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Milestone & Org Approval Gateway */}
              {onOpenApprovalGateway && (
                <button
                  onClick={() => {
                    onOpenApprovalGateway();
                    onCloseMobile();
                  }}
                  title={isCollapsed ? "簽核中心" : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-xl transition-all cursor-pointer ${
                    (pendingApprovalsCount || 0) > 0
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 hover:bg-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 className={`w-4 h-4 ${(pendingApprovalsCount || 0) > 0 ? 'text-amber-400' : 'text-indigo-400'}`} />
                    {!isCollapsed && <span>簽核中心 (Approval Gateway)</span>}
                  </div>
                  {!isCollapsed && (pendingApprovalsCount || 0) > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 font-mono animate-pulse">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </button>
              )}

              {/* AI Executive QA */}
              <button
                onClick={() => {
                  onOpenQA();
                  onCloseMobile();
                }}
                title={isCollapsed ? t('sidebar.aiQAAssistant') : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'} rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 transition-colors cursor-pointer`}
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                {!isCollapsed && <span>{t('sidebar.aiQAAssistant')}</span>}
              </button>

              {/* Briefing Memo */}
              <button
                onClick={() => {
                  onOpenReportModal();
                  onCloseMobile();
                }}
                title={isCollapsed ? t('sidebar.memoExportModal') : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'} rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 transition-colors cursor-pointer`}
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                {!isCollapsed && <span>{t('sidebar.memoExportModal')}</span>}
              </button>

              {/* Add Project */}
              <button
                onClick={() => {
                  onOpenAddProject();
                  onCloseMobile();
                }}
                title={isCollapsed ? t('sidebar.createProject') : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'} rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 transition-colors cursor-pointer`}
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                {!isCollapsed && <span>{t('sidebar.createProject')}</span>}
              </button>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                onResetData();
                onCloseMobile();
              }}
              title={isCollapsed ? t('sidebar.resetData') : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'} rounded-xl text-slate-500 hover:bg-slate-800/80 hover:text-slate-300 transition-colors text-left cursor-pointer`}
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>{t('sidebar.resetData')}</span>}
            </button>
          </div>

        </nav>

        {/* User Info Bottom Bar */}
        <div className={`p-3.5 border-t border-slate-800/80 bg-slate-950/40 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              MC
            </div>
            {!isCollapsed && (
              <div className="text-xs overflow-hidden">
                <p className="text-white font-semibold truncate leading-tight">Marcus Chen</p>
                <p className="text-slate-400 text-[10px] truncate mt-0.5">
                  {currentRole === 'EXECUTIVE' ? 'C-Suite 高層主管' : currentRole === 'N1_MANAGER' ? 'N-1 部門主管' : currentRole === 'HR_MANAGER' ? 'HR 人力資源主管' : '專案經理 (PM)'}
                </p>
              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
};

