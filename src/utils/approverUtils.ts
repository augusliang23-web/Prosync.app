import { Department, Employee } from '../types';

export interface ApproverInfo {
  department: Department | string;
  title: string;
  name: string;
  level: string;
}

export const DEPARTMENT_APPROVERS: Record<Department, ApproverInfo> = {
  '研發部': {
    department: '研發部',
    title: '研發處長 / N-1 研發副總',
    name: '林建宏 (Dr. Lin)',
    level: 'N-1 層級主管'
  },
  'IT資訊部': {
    department: 'IT資訊部',
    title: '資訊處長 / N-1 資訊總監',
    name: '黃智勝 (Jason Huang)',
    level: 'N-1 層級主管'
  },
  '行銷部': {
    department: '行銷部',
    title: '行銷處長 / N-1 行銷總監',
    name: '張雅雯 (Amanda Chang)',
    level: 'N-1 層級主管'
  },
  '營運部': {
    department: '營運部',
    title: '營運處長 / N-1 營運總監',
    name: '劉志豪 (David Liu)',
    level: 'N-1 層級主管'
  },
  '永續營運部': {
    department: '永續營運部',
    title: '永續處長 / N-1 永續總監',
    name: '蔡佩芬 (Flora Tsai)',
    level: 'N-1 層級主管'
  },
  '產品部': {
    department: '產品部',
    title: '產品處長 / N-1 產品總監',
    name: '鄭家豪 (Eric Cheng)',
    level: 'N-1 層級主管'
  },
  '人力資源部': {
    department: '人力資源部',
    title: '人資處長 / N-1 人資總監',
    name: '廖美玲 (May Liao)',
    level: 'N-1 層級主管'
  }
};

export function getN1Approver(department: Department | string, employees?: Employee[]): ApproverInfo {
  if (employees && employees.length > 0) {
    const activeN1 = employees.find((e) => e.department === department && (e.isN1Manager || e.hierarchyTier === 'N-1') && e.status === 'ACTIVE');
    if (activeN1) {
      return {
        department: activeN1.department,
        title: activeN1.title,
        name: activeN1.name,
        level: 'N-1 層級主管',
      };
    }
  }

  return (DEPARTMENT_APPROVERS as Record<string, ApproverInfo>)[department] || {
    department,
    title: `${department} N-1 部門主管`,
    name: '主管幹部',
    level: 'N-1 層級主管',
  };
}
