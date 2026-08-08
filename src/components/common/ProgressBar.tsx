import React from 'react';
import { HealthStatus } from '../../types';

interface ProgressBarProps {
  progress: number; // 0 to 100
  health?: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  health = 'ON_TRACK',
  size = 'md',
  showLabel = true,
}) => {
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  const colorClass = {
    ON_TRACK: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    AT_RISK: 'bg-gradient-to-r from-amber-500 to-orange-500',
    DELAYED: 'bg-gradient-to-r from-rose-500 to-red-600',
    COMPLETED: 'bg-gradient-to-r from-indigo-500 to-blue-600',
  }[health];

  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-slate-600">
          <span>進度完成率</span>
          <span className="font-semibold text-slate-800">{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden shadow-inner ${heightClass}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${colorClass}`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
