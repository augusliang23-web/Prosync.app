import { Project, HealthStatus } from '../types';

export interface WeeklyDataPoint {
  weekNum: number;
  weekLabel: string; // e.g. "W12 (05/18)"
  dateStr: string;   // e.g. "2026-05-18"
  onTrack: number;
  atRisk: number;
  delayed: number;
  completed: number;
  totalProjects: number;
  avgProgress: number; // 0-100
  totalSpentBudgetM: number; // in Millions TWD
  totalBudgetM: number;
  events: string[];
  statusChanges: {
    projectCode: string;
    projectName: string;
    from: HealthStatus;
    to: HealthStatus;
    note: string;
  }[];
}

/**
 * Generates 24 weeks of historical trend data from the project set
 */
export function generateWeeklyTrendData(projects: Project[], weeksCount: 12 | 24 = 24): WeeklyDataPoint[] {
  const points: WeeklyDataPoint[] = [];

  // Base date anchor: 2026-08-03 as W24
  const endDate = new Date('2026-08-03');

  for (let w = 1; w <= weeksCount; w++) {
    // Reverse index: for 24 weeks, w=1 is 23 weeks ago, w=24 is current
    const offsetWeeks = weeksCount - w;
    const weekDate = new Date(endDate);
    weekDate.setDate(endDate.getDate() - offsetWeeks * 7);

    const monthStr = String(weekDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(weekDate.getDate()).padStart(2, '0');
    const dateStr = `${weekDate.getFullYear()}-${monthStr}-${dayStr}`;
    const weekLabel = `W${w} (${monthStr}/${dayStr})`;

    // Simulate realistic historical trajectory leading to current state
    const progressFactor = w / weeksCount; // 0.04 to 1.0

    // Realistic health distribution shifting over time
    let onTrack = 0;
    let atRisk = 0;
    let delayed = 0;
    let completed = 0;

    const events: string[] = [];
    const statusChanges: WeeklyDataPoint['statusChanges'] = [];

    projects.forEach((prj) => {
      // Calculate historical simulated progress at this week
      const currentProg = prj.currentProgress;
      const weekProg = Math.max(5, Math.min(100, Math.round(currentProg * (0.15 + 0.85 * (w / weeksCount)))));

      // Simulate historical health status transitions
      if (w < 6) {
        // Early weeks: mostly on track as projects started
        onTrack++;
      } else if (w >= 6 && w <= 10) {
        // Mid-term bottlenecks before W11
        if (prj.code === 'PRJ-2026-02' || prj.code === 'PRJ-2026-04') {
          atRisk++;
        } else if (prj.code === 'PRJ-2026-03') {
          delayed++;
        } else {
          onTrack++;
        }
      } else if (w >= 11) {
        // From W11 onwards, 2 projects (PRJ-2026-05 & PRJ-2026-06) are COMPLETED!
        if (prj.code === 'PRJ-2026-05' || prj.code === 'PRJ-2026-06') {
          completed++;
        } else if (prj.code === 'PRJ-2026-02' || prj.code === 'PRJ-2026-04') {
          atRisk++;
        } else if (prj.code === 'PRJ-2026-03') {
          delayed++;
        } else {
          onTrack++;
        }
      }
    });

    // Specific milestones and key events in company history
    if (w === 4) {
      events.push('Q1 專案開工啟動會與預算審核完成');
    } else if (w === 8) {
      events.push('PRJ-2026-02 供應商晶片交期延遲，觸發黃燈預警');
      statusChanges.push({
        projectCode: 'PRJ-2026-02',
        projectName: '新一代智慧物聯網 Edge Gateway',
        from: 'ON_TRACK',
        to: 'AT_RISK',
        note: '晶片供應鏈短缺導致第 2 階段硬體樣品測試延遲'
      });
    } else if (w === 11) {
      events.push('🎉【專案完工捷報】PRJ-2026-05與 PRJ-2026-06 兩大專案於 W11 提前完成驗收，雙雙順利完工結案！');
      statusChanges.push({
        projectCode: 'PRJ-2026-05',
        projectName: '綠能永續與碳盤查系統',
        from: 'ON_TRACK',
        to: 'COMPLETED',
        note: '提前完成 UAT 客戶端驗收與 ISO 數據對齊，於 W11 順利完工結案！'
      });
      statusChanges.push({
        projectCode: 'PRJ-2026-06',
        projectName: '客服 AI 語音機器人專案',
        from: 'ON_TRACK',
        to: 'COMPLETED',
        note: '語音辨識模型準確率達 98%，提前於 W11 正式上線完工！'
      });
    } else if (w === 12) {
      events.push('年中 C-Suite 專案基線檢討與資源調配會議');
    } else if (w === 16) {
      events.push('PRJ-2026-03 行銷影音製作展延申請單 (CR) 提報');
      statusChanges.push({
        projectCode: 'PRJ-2026-03',
        projectName: 'Q3 全球品牌形象與線上行銷活動',
        from: 'AT_RISK',
        to: 'DELAYED',
        note: '影音團隊隔離延期，高層審核核准 10 天展延'
      });
    } else if (w === 20) {
      events.push('PRJ-2026-01 完成 ISO 27001 資安紅隊測試');
    } else if (w === 24) {
      events.push('當前最新週報彙整完成，高層簽核關卡防護生效中');
    }

    const totalPrjs = projects.length;
    const avgProg = Math.round(
      projects.reduce((acc, p) => acc + Math.round(p.currentProgress * (0.2 + 0.8 * (w / weeksCount))), 0) / totalPrjs
    );

    const totalBudgetSum = projects.reduce((acc, p) => acc + p.totalBudget, 0) / 1000000;
    const totalSpentSum = (projects.reduce((acc, p) => acc + p.spentBudget, 0) * (0.15 + 0.85 * (w / weeksCount))) / 1000000;

    points.push({
      weekNum: w,
      weekLabel,
      dateStr,
      onTrack,
      atRisk,
      delayed,
      completed,
      totalProjects: totalPrjs,
      avgProgress: Math.min(100, avgProg),
      totalSpentBudgetM: Number(totalSpentSum.toFixed(2)),
      totalBudgetM: Number(totalBudgetSum.toFixed(2)),
      events,
      statusChanges,
    });
  }

  return points;
}
