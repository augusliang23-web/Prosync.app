import React, { useState, useEffect, useMemo } from 'react';
import { Project, ExecutiveBriefing, UserRole, ProjectUpdate, MilestoneChangeRequest, Employee, OrgChangeRequest, OrgChangeType, ExecutiveDecisionRecord, CriticalRiskItem, TraceableActionItem } from './types';
import { 
  getStoredProjects, 
  saveProjects, 
  getStoredExecutiveBriefing, 
  saveExecutiveBriefing, 
  getStoredEmployees,
  saveEmployees,
  getStoredOrgRequests,
  saveOrgRequests,
  getStoredExecutiveDecisions,
  saveExecutiveDecisions,
  resetToDefaults 
} from './utils/storage';
import { useLanguage } from './context/LanguageContext';
import { getLocalizedProjects, getLocalizedBriefing, getLocalizedProject } from './utils/localizeData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ExecutiveDashboard } from './components/ExecutiveView/ExecutiveDashboard';
import { ExecutiveQAChat } from './components/ExecutiveView/ExecutiveQAChat';
import { ExecutiveReportModal } from './components/ExecutiveView/ExecutiveReportModal';
import { ApprovalGatewayModal } from './components/ExecutiveView/ApprovalGatewayModal';
import { DecisionCaptureModal } from './components/ExecutiveView/DecisionCaptureModal';
import { DecisionSystemOfRecordModal } from './components/ExecutiveView/DecisionSystemOfRecordModal';
import { ProjectList } from './components/PMView/ProjectList';
import { ProjectDetailModal } from './components/PMView/ProjectDetailModal';
import { PMProjectWorkspace } from './components/PMView/PMProjectWorkspace';
import { AddProjectModal } from './components/PMView/AddProjectModal';
import { OrgStructureView } from './components/OrgView/OrgStructureView';
import { AddOrgChangeModal } from './components/OrgView/AddOrgChangeModal';
import { LogoVariant } from './components/BrandLogo';
import { LogoSelectorModal } from './components/LogoSelectorModal';
import { DemoTourModal } from './components/DemoTourModal';
import { LinkedInDMShowcaseModal } from './components/LinkedInDMShowcaseModal';
import { PersonaBanner } from './components/common/PersonaBanner';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());
  const [executiveBriefing, setExecutiveBriefing] = useState<ExecutiveBriefing>(() => getStoredExecutiveBriefing());
  const [employees, setEmployees] = useState<Employee[]>(() => getStoredEmployees());
  const [orgRequests, setOrgRequests] = useState<OrgChangeRequest[]>(() => getStoredOrgRequests());
  const [executiveDecisions, setExecutiveDecisions] = useState<ExecutiveDecisionRecord[]>(() => getStoredExecutiveDecisions());

  const [currentRole, setCurrentRole] = useState<UserRole>('EXECUTIVE');
  const [currentView, setCurrentView] = useState<'PROJECTS' | 'ORG_STRUCTURE'>('PROJECTS');

  // Departments List state
  const [departmentsList, setDepartmentsList] = useState<string[]>(() => {
    const saved = localStorage.getItem('prosync_departments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      '研發部',
      'IT資訊部',
      '行銷部',
      '營運部',
      '永續營運部',
      '產品部',
      '人力資源部',
    ];
  });

  useEffect(() => {
    localStorage.setItem('prosync_departments', JSON.stringify(departmentsList));
  }, [departmentsList]);

  const handleAddDepartment = (deptName: string) => {
    if (!departmentsList.includes(deptName)) {
      setDepartmentsList((prev) => [...prev, deptName]);
    }
  };

  const handleDeleteDepartment = (deptName: string) => {
    setDepartmentsList((prev) => prev.filter((d) => d !== deptName));
  };

  const handleAddEmployee = (empData: Partial<Employee>) => {
    const newEmp: Employee = {
      id: empData.id || `emp-${Date.now()}`,
      employeeId: empData.employeeId || `EMP-${Date.now()}`,
      name: empData.name || '新同仁',
      title: empData.title || '專案專員',
      department: empData.department || departmentsList[0] || '研發部',
      isN1Manager: empData.isN1Manager || false,
      hierarchyTier: empData.hierarchyTier || 'N-2',
      reportsToName: empData.reportsToName || '張董事長 (Marcus Chang)',
      email: empData.email || 'employee@company.com',
      phone: empData.phone || 'ext. 8000',
      assignedProjectsCount: 0,
      status: empData.status || 'ACTIVE',
      joinedDate: empData.joinedDate || new Date().toISOString().substring(0, 10),
    };
    setEmployees((prev) => [newEmp, ...prev]);
  };

  const handleUpdateEmployee = (empData: Partial<Employee>) => {
    if (!empData.id) return;
    setEmployees((prev) =>
      prev.map((e) => (e.id === empData.id ? { ...e, ...empData } : e))
    );
  };

  const handleDeleteEmployee = (empId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== empId));
  };

  // Sidebar & Collapsible state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('prosync_sidebar_collapsed') === 'true';
  });

  // Brand Logo Variant state (ProSync Ribbon P by default)
  const [logoVariant, setLogoVariant] = useState<LogoVariant>(() => {
    const saved = localStorage.getItem('prosync_logo_variant_v2');
    if (saved && ['prosync', 'mesh', 'diamond', 'pulse'].includes(saved)) {
      return saved as LogoVariant;
    }
    return 'prosync';
  });
  const [isLogoSelectorOpen, setIsLogoSelectorOpen] = useState(false);

  // Modals state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [updatingProject, setUpdatingProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  const handleSaveEditProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    if (editingProject) setEditingProject(updatedProject);
    if (updatingProject) setUpdatingProject(updatedProject);
  };
  const [isAddOrgRequestOpen, setIsAddOrgRequestOpen] = useState(false);
  const [preselectEmpId, setPreselectEmpId] = useState<string | undefined>(undefined);
  const [preselectChangeType, setPreselectChangeType] = useState<OrgChangeType | undefined>(undefined);

  const handleOpenAddOrgRequest = (empId?: string, changeType?: OrgChangeType) => {
    setPreselectEmpId(empId);
    setPreselectChangeType(changeType);
    setIsAddOrgRequestOpen(true);
  };
  const [isQAOpen, setIsQAOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isApprovalGatewayOpen, setIsApprovalGatewayOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  // Decision System of Record Modals State
  const [isDecisionCaptureOpen, setIsDecisionCaptureOpen] = useState(false);
  const [isDecisionLogOpen, setIsDecisionLogOpen] = useState(false);
  const [activeRiskForDecision, setActiveRiskForDecision] = useState<CriticalRiskItem | null>(null);

  // Sync state to local storage
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveExecutiveBriefing(executiveBriefing);
  }, [executiveBriefing]);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  useEffect(() => {
    saveOrgRequests(orgRequests);
  }, [orgRequests]);

  useEffect(() => {
    saveExecutiveDecisions(executiveDecisions);
  }, [executiveDecisions]);

  useEffect(() => {
    localStorage.setItem('prosync_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('prosync_logo_variant', logoVariant);
  }, [logoVariant]);

  // Decision Handlers
  const handleOpenCaptureDecision = (riskItem: CriticalRiskItem) => {
    setActiveRiskForDecision(riskItem);
    setIsDecisionCaptureOpen(true);
  };

  const handleConfirmDecision = (newDecision: ExecutiveDecisionRecord) => {
    setExecutiveDecisions((prev) => [newDecision, ...prev]);

    // If budget addition was approved, update the project totalBudget
    if (newDecision.approvedAmount && newDecision.approvedAmount > 0) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === newDecision.projectId) {
            return {
              ...p,
              totalBudget: p.totalBudget + (newDecision.approvedAmount || 0),
            };
          }
          return p;
        })
      );
    }
  };

  const handleUpdateActionStatus = (decisionId: string, actionId: string, newStatus: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED') => {
    setExecutiveDecisions((prev) =>
      prev.map((d) => {
        if (d.id === decisionId) {
          return {
            ...d,
            actionItems: d.actionItems.map((item) =>
              item.id === actionId ? { ...item, status: newStatus } : item
            ),
          };
        }
        return d;
      })
    );
  };

  // Handler for adding a new project
  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  // Handler for adding an Org Change Request
  const handleAddOrgRequest = (newRequest: OrgChangeRequest) => {
    setOrgRequests((prev) => [newRequest, ...prev]);
  };

  // Handler for reviewing an Org Change Request
  const handleReviewOrgRequest = (requestId: string, action: 'APPROVE' | 'REJECT', comment?: string) => {
    const targetReq = orgRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    // Update request status
    setOrgRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: action === 'APPROVE' ? ('APPROVED' as const) : ('REJECTED' as const),
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            reviewerComment: comment,
          };
        }
        return r;
      })
    );

    // Apply org changes if approved
    if (action === 'APPROVE') {
      setEmployees((prev) => {
        let updated = [...prev];

        if (targetReq.changeType === 'REASSIGN_N1') {
          // Unset existing N1 for the department and set target as N1
          updated = updated.map((emp) => {
            if (emp.department === targetReq.department) {
              if (emp.id === targetReq.targetEmployeeId) {
                return { ...emp, isN1Manager: true, title: targetReq.proposedTitle || emp.title };
              } else if (emp.isN1Manager) {
                return { ...emp, isN1Manager: false };
              }
            }
            return emp;
          });
        } else if (targetReq.changeType === 'ADD_MEMBER') {
          // Add new employee
          const newEmp: Employee = {
            id: targetReq.targetEmployeeId || `emp-${Date.now()}`,
            employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: targetReq.targetEmployeeName,
            title: targetReq.proposedTitle || '專案專員',
            department: targetReq.department,
            isN1Manager: false,
            reportsToName: updated.find((e) => e.department === targetReq.department && e.isN1Manager)?.name || '部門主管',
            email: `${targetReq.targetEmployeeName.toLowerCase()}@company.com`,
            assignedProjectsCount: 0,
            status: 'ACTIVE',
            joinedDate: new Date().toISOString().substring(0, 10),
          };
          updated.push(newEmp);
        } else if (targetReq.changeType === 'TRANSFER_MEMBER') {
          // Transfer member to new department
          const targetDept = targetReq.proposedDepartment || targetReq.department;
          const newN1 = updated.find((e) => e.department === targetDept && e.isN1Manager)?.name || '部門主管';
          updated = updated.map((emp) => {
            if (emp.id === targetReq.targetEmployeeId) {
              return {
                ...emp,
                department: targetDept,
                title: targetReq.proposedTitle || emp.title,
                reportsToName: newN1,
              };
            }
            return emp;
          });
        } else if (targetReq.changeType === 'UPDATE_TITLE') {
          updated = updated.map((emp) => {
            if (emp.id === targetReq.targetEmployeeId) {
              return {
                ...emp,
                title: targetReq.proposedTitle || emp.title,
              };
            }
            return emp;
          });
        } else if (targetReq.changeType === 'OFFBOARD_MEMBER') {
          // Offboard employee: set status to RESIGNED and revoke N1 manager flag if any
          updated = updated.map((emp) => {
            if (emp.id === targetReq.targetEmployeeId) {
              return {
                ...emp,
                status: 'RESIGNED' as const,
                isN1Manager: false,
              };
            }
            return emp;
          });
        }

        return updated;
      });
    }
  };

  // Handler for submitting PM update
  const handleSubmitPMUpdate = (projectId: string, update: ProjectUpdate) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedUpdates = [update, ...p.updates];
          return {
            ...p,
            currentProgress: update.progress,
            health: update.status,
            updates: updatedUpdates,
            updatedAt: update.date,
          };
        }
        return p;
      })
    );
  };

  // Handler for toggling deliverable completion
  const handleToggleDeliverable = (projectId: string, deliverableId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedDeliverables = p.keyDeliverables.map((d) =>
            d.id === deliverableId ? { ...d, completed: !d.completed } : d
          );
          return { ...p, keyDeliverables: updatedDeliverables };
        }
        return p;
      })
    );
  };

  // Request a Milestone Change (CR)
  const handleRequestMilestoneChange = (projectId: string, request: MilestoneChangeRequest) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const milestoneRequests = p.milestoneRequests || [];
          return { ...p, milestoneRequests: [request, ...milestoneRequests] };
        }
        return p;
      })
    );
  };

  // Review (Approve / Reject) Milestone Change Request
  const handleReviewMilestoneRequest = (
    projectId: string,
    requestId: string,
    action: 'APPROVE' | 'REJECT',
    comment?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        const requests = p.milestoneRequests || [];
        const reqToReview = requests.find((r) => r.id === requestId);
        if (!reqToReview) return p;

        const updatedRequests = requests.map((r) => {
          if (r.id === requestId) {
            return {
              ...r,
              status: action === 'APPROVE' ? ('APPROVED' as const) : ('REJECTED' as const),
              reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              reviewerComment: comment,
            };
          }
          return r;
        });

        let updatedDeliverables = [...p.keyDeliverables];

        if (action === 'APPROVE') {
          if (reqToReview.changeType === 'ADD') {
            updatedDeliverables.push({
              id: `del-${Date.now()}`,
              title: reqToReview.newTitle,
              dueDate: reqToReview.newDueDate,
              completed: false,
            });
          } else if (reqToReview.changeType === 'MODIFY_DATE' && reqToReview.deliverableId) {
            updatedDeliverables = updatedDeliverables.map((d) => {
              if (d.id === reqToReview.deliverableId) {
                return {
                  ...d,
                  title: reqToReview.newTitle,
                  originalDueDate: d.originalDueDate || d.dueDate,
                  dueDate: reqToReview.newDueDate,
                };
              }
              return d;
            });
          } else if (reqToReview.changeType === 'DELETE' && reqToReview.deliverableId) {
            updatedDeliverables = updatedDeliverables.filter((d) => d.id !== reqToReview.deliverableId);
          }
        }

        return {
          ...p,
          keyDeliverables: updatedDeliverables,
          milestoneRequests: updatedRequests,
        };
      })
    );
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('確定要將專案與組織架構數據恢復為系統預設資料嗎？')) {
      const res = resetToDefaults();
      setProjects(res.projects);
      setExecutiveBriefing(res.briefing);
      setEmployees(res.employees);
      setOrgRequests(res.orgRequests);
    }
  };

  const { language } = useLanguage();

  const displayProjects = useMemo(() => getLocalizedProjects(projects, language), [projects, language]);
  const displayBriefing = useMemo(() => getLocalizedBriefing(executiveBriefing, language), [executiveBriefing, language]);

  const rawSelectedProject = projects.find((p) => p.id === selectedProjectId) || null;
  const selectedProject = rawSelectedProject ? getLocalizedProject(rawSelectedProject, language) : null;

  const atRiskCount = displayProjects.filter((p) => p.health === 'AT_RISK').length;
  const delayedCount = displayProjects.filter((p) => p.health === 'DELAYED').length;

  // Calculate total pending change requests (Milestone + Org)
  const pendingMilestonesCount = projects.reduce((acc, project) => {
    const pending = (project.milestoneRequests || []).filter((r) => r.status === 'PENDING').length;
    return acc + pending;
  }, 0);
  const pendingOrgCount = orgRequests.filter((r) => r.status === 'PENDING').length;
  const pendingApprovalsCount = pendingMilestonesCount + pendingOrgCount;

  // Unfiled count for PM
  const todayStr = new Date().toISOString().split('T')[0];
  const unfiledCount = projects.filter(
    (p) => !p.updates || p.updates.length === 0 || p.updates[0].date !== todayStr
  ).length;

  // 1. IMMERSIVE FULL-SCREEN FOCUS STUDIO MODE
  if (editingProject || updatingProject) {
    return (
      <PMProjectWorkspace
        project={(editingProject || updatingProject)!}
        onBack={() => {
          setEditingProject(null);
          setUpdatingProject(null);
        }}
        onSaveProject={handleSaveEditProject}
        onSubmitPMUpdate={(projectId, update) => {
          handleSubmitPMUpdate(projectId, update);
        }}
        departmentsList={departmentsList}
        initialTab={updatingProject ? 'WEEKLY_UPDATE' : 'CORE_SETTINGS'}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden selection:bg-indigo-600 selection:text-white">
      
      {/* High Density Left Sidebar with Collapse Support */}
      <Sidebar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAddProject={() => setIsAddProjectOpen(true)}
        onOpenQA={() => setIsQAOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onResetData={handleResetData}
        atRiskCount={atRiskCount}
        delayedCount={delayedCount}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        logoVariant={logoVariant}
        onOpenLogoSelector={() => setIsLogoSelectorOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        onOpenApprovalGateway={() => setIsApprovalGatewayOpen(true)}
        onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
        onOpenSystemOfRecord={() => setIsDecisionLogOpen(true)}
        decisionsCount={executiveDecisions.length}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onOpenAddProject={() => setIsAddProjectOpen(true)}
          onOpenQA={() => setIsQAOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          logoVariant={logoVariant}
          onOpenLogoSelector={() => setIsLogoSelectorOpen(true)}
          pendingApprovalsCount={pendingApprovalsCount}
          onOpenApprovalGateway={() => setIsApprovalGatewayOpen(true)}
          onOpenDemoTour={() => setIsDemoTourOpen(true)}
          onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
          onOpenSystemOfRecord={() => setIsDecisionLogOpen(true)}
          decisionsCount={executiveDecisions.length}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto bg-slate-50/60">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            
            {/* Global Persona Identity & Target Audience Banner */}
            {currentView !== 'ORG_STRUCTURE' && (
              <PersonaBanner
                currentRole={currentRole}
                onRoleChange={setCurrentRole}
                pendingApprovalsCount={pendingApprovalsCount}
                unfiledCount={unfiledCount}
              />
            )}

            {currentView === 'ORG_STRUCTURE' ? (
              <OrgStructureView
                currentRole={currentRole}
                employees={employees}
                orgRequests={orgRequests}
                onOpenAddOrgRequest={handleOpenAddOrgRequest}
                onOpenApprovalGateway={() => setIsApprovalGatewayOpen(true)}
                onRoleChange={setCurrentRole}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                departmentsList={departmentsList}
                onAddDepartment={handleAddDepartment}
                onDeleteDepartment={handleDeleteDepartment}
              />
            ) : currentRole === 'EXECUTIVE' ? (
              <ExecutiveDashboard
                projects={displayProjects}
                briefing={displayBriefing}
                decisions={executiveDecisions}
                onUpdateBriefing={setExecutiveBriefing}
                onSelectProject={(id) => setSelectedProjectId(id)}
                onOpenLogUpdate={(p) => setUpdatingProject(p)}
                onOpenEditProject={(p) => setEditingProject(p)}
                onReviewMilestoneRequest={handleReviewMilestoneRequest}
                onOpenApprovalGateway={() => setIsApprovalGatewayOpen(true)}
                onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
                onOpenCaptureDecision={handleOpenCaptureDecision}
                onOpenSystemOfRecord={() => setIsDecisionLogOpen(true)}
                onOpenAIQA={() => setIsQAOpen(true)}
              />
            ) : (
              <ProjectList
                currentRole={currentRole}
                projects={displayProjects}
                onSelectProject={(id) => setSelectedProjectId(id)}
                onOpenLogUpdate={(p) => setUpdatingProject(p)}
                onOpenAddProject={() => setIsAddProjectOpen(true)}
                onOpenEditProject={(p) => setEditingProject(p)}
                pendingApprovalsCount={pendingApprovalsCount}
                onOpenApprovalGateway={() => setIsApprovalGatewayOpen(true)}
              />
            )}
          </div>
        </main>

        {/* High Density Footer */}
        <footer className="h-10 bg-white border-t border-slate-200/80 px-6 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-6 font-medium tracking-wide uppercase text-[10px]">
            <span className="font-bold text-slate-700">&copy; 2026 PROSYNC EXECUTIVE PM</span>
            <span className="hidden sm:inline">Enterprise C-Suite Security &amp; Live AI Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>System Status: All Nodes Operational • Org Governance Active</span>
          </div>
        </footer>

      </div>

      {/* Logo Selector Modal */}
      <LogoSelectorModal
        isOpen={isLogoSelectorOpen}
        onClose={() => setIsLogoSelectorOpen(false)}
        currentVariant={logoVariant}
        onSelectVariant={(variant) => {
          setLogoVariant(variant);
          localStorage.setItem('prosync_logo_variant_v2', variant);
          setIsLogoSelectorOpen(false);
        }}
      />

      {/* Modals & Slide-over Drawers */}
      <ProjectDetailModal
        project={selectedProject}
        currentRole={currentRole}
        onClose={() => setSelectedProjectId(null)}
        onOpenLogUpdate={(p) => setUpdatingProject(p)}
        onOpenEditProject={(p) => setEditingProject(p)}
        onToggleDeliverable={handleToggleDeliverable}
        onRequestMilestoneChange={handleRequestMilestoneChange}
        onReviewMilestoneRequest={handleReviewMilestoneRequest}
      />

      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onAddProject={handleAddProject}
      />

      <AddOrgChangeModal
        isOpen={isAddOrgRequestOpen}
        onClose={() => {
          setIsAddOrgRequestOpen(false);
          setPreselectEmpId(undefined);
          setPreselectChangeType(undefined);
        }}
        employees={employees}
        onSubmitOrgRequest={handleAddOrgRequest}
        preselectedEmpId={preselectEmpId}
        preselectedChangeType={preselectChangeType}
      />

      <ExecutiveQAChat
        isOpen={isQAOpen}
        onClose={() => setIsQAOpen(false)}
        projects={displayProjects}
        briefing={displayBriefing}
      />

      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        briefing={displayBriefing}
        projects={displayProjects}
      />

      <ApprovalGatewayModal
        isOpen={isApprovalGatewayOpen}
        projects={displayProjects}
        orgRequests={orgRequests}
        onClose={() => setIsApprovalGatewayOpen(false)}
        onReviewMilestoneRequest={handleReviewMilestoneRequest}
        onReviewOrgRequest={handleReviewOrgRequest}
        onSelectProject={(id) => setSelectedProjectId(id)}
      />

      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        setCurrentRole={setCurrentRole}
        setCurrentView={setCurrentView}
        onOpenApprovalGateway={() => setIsApprovalGatewayOpen(true)}
        onCloseApprovalGateway={() => setIsApprovalGatewayOpen(false)}
        onOpenQA={() => setIsQAOpen(true)}
        onCloseQA={() => setIsQAOpen(false)}
      />

      <LinkedInDMShowcaseModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        projects={projects}
        briefing={executiveBriefing}
      />

      <DecisionCaptureModal
        isOpen={isDecisionCaptureOpen}
        riskItem={activeRiskForDecision}
        onClose={() => setIsDecisionCaptureOpen(false)}
        onConfirmDecision={handleConfirmDecision}
      />

      <DecisionSystemOfRecordModal
        isOpen={isDecisionLogOpen}
        decisions={executiveDecisions}
        onClose={() => setIsDecisionLogOpen(false)}
        onUpdateActionStatus={handleUpdateActionStatus}
      />

    </div>
  );
}

