import React from 'react';
import { HealthStatus } from '../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, CheckCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HealthBadgeProps {
  status: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5 font-medium',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-semibold',
  };

  const config = {
    ON_TRACK: {
      labelKey: 'health.ON_TRACK',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
    },
    AT_RISK: {
      labelKey: 'health.AT_RISK',
      bg: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
      icon: AlertTriangle,
      dotColor: 'bg-amber-500',
    },
    DELAYED: {
      labelKey: 'health.DELAYED',
      bg: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
      icon: AlertOctagon,
      dotColor: 'bg-rose-500',
    },
    COMPLETED: {
      labelKey: 'health.COMPLETED',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
      icon: CheckCheck,
      dotColor: 'bg-indigo-500',
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors shadow-2xs ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{t(config.labelKey)}</span>
    </span>
  );
};
