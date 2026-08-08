/**
 * Types for Executive Project Management Hub
 */

export type HealthStatus = 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'COMPLETED';

export type Department = 
  | '研發部' 
  | '行銷部' 
  | 'IT資訊部' 
  | '營運部' 
  | '永續營運部' 
  | '產品部' 
  | '人力資源部'
  | 'R&D Dept'
  | 'IT & Infra Dept'
  | 'Marketing Dept'
  | 'Operations Dept'
  | 'Sustainability Dept'
  | 'Product Dept'
  | 'HR Dept'
  | 'Executive C-Suite'
  | string;

export type StrategicPriority = 
  | '核心產品升級' 
  | '營運效率與自動化' 
  | '市場拓展與品牌' 
  | '資安與基建' 
  | '永續與合規'
  | 'Core Product Upgrade'
  | 'Operational Efficiency'
  | 'Market Expansion'
  | 'Security & Infrastructure'
  | 'Sustainability & Compliance'
  | string;

export interface KeyDeliverable {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  originalDueDate?: string; // If date was changed via approved CR
}

export type MilestoneChangeType = 'ADD' | 'MODIFY_DATE' | 'DELETE';
export type MilestoneRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MilestoneChangeRequest {
  id: string;
  projectId: string;
  projectName: string;
  pmName: string;
  changeType: MilestoneChangeType;
  deliverableId?: string;
  originalTitle?: string;
  originalDueDate?: string;
  newTitle: string;
  newDueDate: string;
  reason: string;
  status: MilestoneRequestStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewerComment?: string;
}

export interface ProjectUpdate {
  id: string;
  date: string; // YYYY-MM-DD
  pmName: string;
  progress: number; // 0-100
  status: HealthStatus;
  keyAchievements: string[];
  risksAndBlockers: string;
  managementAssistanceNeeded: string;
  nextMilestones: string[];
  budgetVarianceNote?: string;
}

export type Currency = 'TWD' | 'USD' | 'EUR' | 'JPY' | 'CNY';

export interface Project {
  id: string;
  code: string; // e.g. "PRJ-2026-01"
  name: string;
  department: Department;
  leadPm: string;
  strategicPriority: StrategicPriority;
  targetCompletionDate: string;
  currentProgress: number; // 0-100
  health: HealthStatus;
  currency?: Currency; // Project currency (defaults to 'TWD')
  totalBudget: number; // In project currency
  spentBudget: number; // In project currency
  description: string;
  updates: ProjectUpdate[];
  keyDeliverables: KeyDeliverable[];
  milestoneRequests?: MilestoneChangeRequest[];
  createdAt: string;
  updatedAt: string;
}

export interface CriticalRiskItem {
  projectId: string;
  projectName: string;
  department: string;
  leadPm: string;
  issue: string;
  pmAssistanceRequested: string;
  aiRecommendedAction: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TopWinItem {
  projectId: string;
  projectName: string;
  department: string;
  achievement: string;
}

export interface DepartmentSummaryItem {
  department: Department;
  statusSummary: string;
  healthScore: number; // 0 to 100
  activeProjectCount: number;
}

export interface ExecutiveBriefing {
  generatedAt: string;
  overallExecutiveSummary: string;
  portfolioHealthOverview: {
    totalProjects: number;
    onTrackCount: number;
    atRiskCount: number;
    delayedCount: number;
    completedCount: number;
    totalBudgetAllocated: number;
    totalSpentBudget: number;
  };
  criticalRisksAndDecisions: CriticalRiskItem[];
  topWinsAndProgress: TopWinItem[];
  departmentalStatus: DepartmentSummaryItem[];
  strategicRecommendations: string[];
}

export type UserRole = 'EXECUTIVE' | 'N1_MANAGER' | 'HR_MANAGER' | 'PM';

export interface HierarchyLevelConfig {
  levelId: string; // e.g. 'CEO', 'N-1', 'N-2', 'N-3', 'N-4', 'N-5'
  levelName: string; // e.g. 'CEO / 總經理', 'N-1 處長/副總', 'N-2 經理/隊長', 'N-3 主任/資深專員', 'N-4 執行專員'
  order: number; // 0, 1, 2, 3, 4, 5
  description?: string;
}

export type HierarchyTier = 'CEO' | 'N-1' | 'N-2' | 'N-3' | 'N-4' | 'N-5' | string;

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  title: string;
  department: Department | string;
  isN1Manager: boolean;
  hierarchyTier?: HierarchyTier; // Level in hierarchy e.g. 'CEO', 'N-1', 'N-2', 'N-3', 'N-4'
  reportsToName: string;
  email: string;
  phone?: string;
  assignedProjectsCount: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED';
  joinedDate: string;
}

export type OrgChangeType = 'REASSIGN_N1' | 'ADD_MEMBER' | 'TRANSFER_MEMBER' | 'UPDATE_TITLE' | 'OFFBOARD_MEMBER';
export type OrgRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OrgChangeRequest {
  id: string;
  applicantName: string;
  department: Department;
  changeType: OrgChangeType;
  targetEmployeeId?: string;
  targetEmployeeName: string;
  description: string;
  proposedTitle?: string;
  proposedDepartment?: Department;
  proposedIsN1Manager?: boolean;
  handoverToName?: string;
  lastWorkingDay?: string;
  status: OrgRequestStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewerComment?: string;
}

export interface QAMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}
