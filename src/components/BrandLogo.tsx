import React from 'react';

export type LogoVariant = 'prosync' | 'mesh' | 'diamond' | 'pulse';

interface BrandLogoProps {
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'prosync',
  size = 'md',
  showText = true,
  textClassName = '',
}) => {
  const dimensionClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textContainerClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';

  const renderIcon = () => {
    switch (variant) {
      case 'prosync':
      default:
        // Clean, standard modern letter P logo
        return (
          <div className={`${dimensionClass} rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 flex items-center justify-center shadow-sm shrink-0 font-bold text-white tracking-tight text-lg select-none`}>
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <path
                d="M8 6H18C22.4183 6 26 9.58172 26 14C26 18.4183 22.4183 22 18 22H13V26C13 27.1046 12.1046 28 11 28C9.89543 28 9 27.1046 9 26V8C9 6.89543 8 6 8 6Z"
                fill="currentColor"
              />
              <path
                d="M13 11H18C19.6569 11 21 12.3431 21 14C21 15.6569 19.6569 17 18 17H13V11Z"
                fill="#818CF8"
              />
            </svg>
          </div>
        );

      case 'mesh':
        return (
          <div className={`${dimensionClass} rounded-lg bg-slate-900 p-1 flex items-center justify-center shadow-xs border border-slate-700/50 shrink-0 group`}>
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="meshGrad1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="meshGrad2" x1="32" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
              <polygon points="16,4 28,11 28,21 16,28 4,21 4,11" stroke="url(#meshGrad1)" strokeWidth="2.5" strokeLinejoin="round" />
              <polygon points="16,9 23,13 23,19 16,23 9,19 9,13" fill="url(#meshGrad2)" fillOpacity="0.85" />
              <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
            </svg>
          </div>
        );

      case 'diamond':
        return (
          <div className={`${dimensionClass} rounded-lg bg-indigo-950 p-1 flex items-center justify-center shadow-xs border border-indigo-800/60 shrink-0 group`}>
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="diaGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <path d="M16 3L23 10L16 17L9 10Z" fill="url(#diaGrad)" />
              <path d="M23 10L30 17L23 24L16 17Z" fill="#38bdf8" fillOpacity="0.9" />
              <path d="M16 17L23 24L16 31L9 24Z" fill="#3b82f6" />
              <path d="M9 10L16 17L9 24L2 17Z" fill="#a5b4fc" opacity="0.8" />
            </svg>
          </div>
        );

      case 'pulse':
        return (
          <div className={`${dimensionClass} rounded-lg bg-slate-900 p-1 flex items-center justify-center shadow-xs border border-slate-700/60 shrink-0 group`}>
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="pulseGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="11" stroke="url(#pulseGrad)" strokeWidth="3" strokeDasharray="50 18" strokeLinecap="round" />
              <circle cx="16" cy="16" r="5" fill="#6366f1" />
              <circle cx="16" cy="16" r="2" fill="#ffffff" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center gap-2.5 shrink-0 select-none">
      {renderIcon()}
      {showText && (
        <div className="leading-none">
          <span className={`font-black tracking-tight block ${textContainerClass} ${textClassName || 'text-slate-900'}`}>
            Pro<span className={textClassName?.includes('text-white') ? 'text-indigo-400' : 'text-indigo-600'}>Sync</span>
          </span>
          <span className={`text-[9px] font-bold tracking-widest uppercase block mt-0.5 ${textClassName?.includes('text-white') ? 'text-slate-400' : 'text-slate-500'}`}>
            AI Project Platform
          </span>
        </div>
      )}
    </div>
  );
};
