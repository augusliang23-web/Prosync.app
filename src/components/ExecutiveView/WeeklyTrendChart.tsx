import React, { useState, useMemo } from 'react';
import { Project, HealthStatus } from '../../types';
import { generateWeeklyTrendData, WeeklyDataPoint } from '../../utils/trendDataGenerator';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Info,
  DollarSign,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface WeeklyTrendChartProps {
  projects: Project[];
  onSelectProject?: (projectId: string) => void;
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ projects, onSelectProject }) => {
  const [timeframe, setTimeframe] = useState<12 | 24>(24);
  const [chartType, setChartType] = useState<'HEALTH' | 'PROGRESS_BUDGET'>('HEALTH');
  const [selectedWeek, setSelectedWeek] = useState<WeeklyDataPoint | null>(null);

  const trendData = useMemo(() => {
    return generateWeeklyTrendData(projects, timeframe);
  }, [projects, timeframe]);

  // Default selected week is current latest week
  const activeWeek = selectedWeek || trendData[trendData.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-5">
      
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>高層專案推移圖表：過去 {timeframe} 週狀態與進度軌跡</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-semibold border border-indigo-200">
                12~24 Weeks Trend
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              動態追蹤全公司專案健康狀態分佈 (On Track / At Risk / Delayed)、平均達成率與預算消耗趨勢
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Chart Type Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setChartType('HEALTH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartType === 'HEALTH'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              健康狀態分佈
            </button>
            <button
              onClick={() => setChartType('PROGRESS_BUDGET')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartType === 'PROGRESS_BUDGET'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              進度與預算速率
            </button>
          </div>

          {/* Timeframe Selector (12 vs 24 weeks) */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 border border-slate-200/60">
            <button
              onClick={() => {
                setTimeframe(12);
                setSelectedWeek(null);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                timeframe === 12 ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              12 週
            </button>
            <button
              onClick={() => {
                setTimeframe(24);
                setSelectedWeek(null);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                timeframe === 24 ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              24 週
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'HEALTH' ? (
            <AreaChart
              data={trendData}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setSelectedWeek(e.activePayload[0].payload as WeeklyDataPoint);
                }
              }}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOnTrack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="weekLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="onTrack" name="🟢 綠燈正常" stackId="1" stroke="#10b981" fill="url(#colorOnTrack)" />
              <Area type="monotone" dataKey="atRisk" name="🟡 黃燈注意" stackId="1" stroke="#f59e0b" fill="url(#colorAtRisk)" />
              <Area type="monotone" dataKey="delayed" name="🔴 紅燈延遲" stackId="1" stroke="#ef4444" fill="url(#colorDelayed)" />
              <Area type="monotone" dataKey="completed" name="🔵 順利完工" stackId="1" stroke="#3b82f6" fill="url(#colorCompleted)" />
            </AreaChart>
          ) : (
            <ComposedChart
              data={trendData}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setSelectedWeek(e.activePayload[0].payload as WeeklyDataPoint);
                }
              }}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="weekLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} unit="%" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} unit="M" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="right" dataKey="totalSpentBudgetM" name="預算累計消耗 ($M TWD)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="avgProgress" name="全公司平均完成率 (%)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Selected Week Inspection Panel */}
      {activeWeek && (
        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs">
                {activeWeek.weekLabel}
              </span>
              <span className="text-xs font-bold text-slate-800">
                對應日期：{activeWeek.dateStr} 週報時間點
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                正常: <strong>{activeWeek.onTrack}</strong>
              </span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                注意: <strong>{activeWeek.atRisk}</strong>
              </span>
              <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                延遲: <strong>{activeWeek.delayed}</strong>
              </span>
              <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                完成率: <strong>{activeWeek.avgProgress}%</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Status Transitions */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="font-bold text-slate-700 block text-xs flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>該週專案狀態轉變紀錄 (Status Shifts)</span>
              </span>

              {activeWeek.statusChanges.length === 0 ? (
                <p className="text-slate-400 text-xs italic pt-1">該週無重大狀態升降級變化，各專案健康狀況平穩運作。</p>
              ) : (
                activeWeek.statusChanges.map((sc, i) => (
                  <div key={i} className="p-2 rounded bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{sc.projectName} ({sc.projectCode})</span>
                      <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        {sc.from} &rarr; {sc.to}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{sc.note}</p>
                  </div>
                ))
              )}
            </div>

            {/* Critical Milestones & Governance Events */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="font-bold text-slate-700 block text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>關鍵里程碑與高層管理事件 (Milestone Events)</span>
              </span>

              {activeWeek.events.length === 0 ? (
                <p className="text-slate-400 text-xs italic pt-1">該週按原定基線進度執行，無高層特准變更案。</p>
              ) : (
                activeWeek.events.map((evt, i) => (
                  <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">{evt}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
