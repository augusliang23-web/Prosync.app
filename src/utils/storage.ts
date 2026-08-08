import { Project, ExecutiveBriefing, Employee, OrgChangeRequest } from '../types';
import { INITIAL_PROJECTS, INITIAL_EXECUTIVE_BRIEFING } from '../data/mockData';
import { INITIAL_EMPLOYEES, INITIAL_ORG_REQUESTS } from '../data/mockOrgData';

const PROJECTS_STORAGE_KEY = 'exec_pm_hub_projects_v1';
const BRIEFING_STORAGE_KEY = 'exec_pm_hub_briefing_v1';
const EMPLOYEES_STORAGE_KEY = 'exec_pm_hub_employees_v1';
const ORG_REQUESTS_STORAGE_KEY = 'exec_pm_hub_org_requests_v1';

export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored projects:', err);
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects:', err);
  }
}

export function getStoredEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored employees:', err);
    return INITIAL_EMPLOYEES;
  }
}

export function saveEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.error('Failed to save employees:', err);
  }
}

export function getStoredOrgRequests(): OrgChangeRequest[] {
  try {
    const raw = localStorage.getItem(ORG_REQUESTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORG_REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_ORG_REQUESTS));
      return INITIAL_ORG_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored org requests:', err);
    return INITIAL_ORG_REQUESTS;
  }
}

export function saveOrgRequests(requests: OrgChangeRequest[]): void {
  try {
    localStorage.setItem(ORG_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save org requests:', err);
  }
}

export function getStoredExecutiveBriefing(): ExecutiveBriefing {
  try {
    const raw = localStorage.getItem(BRIEFING_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BRIEFING_STORAGE_KEY, JSON.stringify(INITIAL_EXECUTIVE_BRIEFING));
      return INITIAL_EXECUTIVE_BRIEFING;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse executive briefing:', err);
    return INITIAL_EXECUTIVE_BRIEFING;
  }
}

export function saveExecutiveBriefing(briefing: ExecutiveBriefing): void {
  try {
    localStorage.setItem(BRIEFING_STORAGE_KEY, JSON.stringify(briefing));
  } catch (err) {
    console.error('Failed to save executive briefing:', err);
  }
}

export function resetToDefaults(): { projects: Project[]; briefing: ExecutiveBriefing; employees: Employee[]; orgRequests: OrgChangeRequest[] } {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
  localStorage.setItem(BRIEFING_STORAGE_KEY, JSON.stringify(INITIAL_EXECUTIVE_BRIEFING));
  localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
  localStorage.setItem(ORG_REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_ORG_REQUESTS));
  return { 
    projects: INITIAL_PROJECTS, 
    briefing: INITIAL_EXECUTIVE_BRIEFING,
    employees: INITIAL_EMPLOYEES,
    orgRequests: INITIAL_ORG_REQUESTS
  };
}
