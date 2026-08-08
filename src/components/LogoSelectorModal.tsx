import React from 'react';
import { LogoVariant, BrandLogo } from './BrandLogo';
import { X, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface LogoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVariant: LogoVariant;
  onSelectVariant: (variant: LogoVariant) => void;
}

export const LogoSelectorModal: React.FC<LogoSelectorModalProps> = ({
  isOpen,
  onClose,
  currentVariant,
  onSelectVariant,
}) => {
  if (!isOpen) return null;

  const options: { id: LogoVariant; name: string; titleEn: string; desc: string; highlights: string[] }[] = [
    {
      id: 'mesh',
      name: '戰略節點網格 (Prism Mesh)',
      titleEn: 'Enterprise Strategic Prism Mesh',
      desc: '雙色重疊多邊形與數據節點，象徵跨部門專案高度交織、即時共振與全方位掌控。',
      highlights: ['Linear / Vercel 極簡科技感', '高階極簡 Slate-900 暗色底襯', '精準幾何邊線與中心焦點'],
    },
    {
      id: 'diamond',
      name: '決策立體方陣 (Diamond Matrix)',
      titleEn: 'Executive Faceted Diamond Matrix',
      desc: '四向斜角旋轉鑽石切面，代表 PM、部門、高層與 AI 戰略四維度的強效交會。',
      highlights: ['Monday / ClickUp 旗艦企業風', 'Indigo 經典企業藍調色盤', '強烈高階品牌辯識度'],
    },
    {
      id: 'pulse',
      name: '動態速匯光環 (Velocity Pulse)',
      titleEn: 'Dynamic Real-time Velocity Orbit',
      desc: '動態雙弧軌道與核心脈衝星芒，代表全公司數據即時滾動與高層秒級決策能見度。',
      highlights: ['頂級 C-Suite AI 戰略工具質感', '動態軌道與漸變 Neon Accent', '高流暢度與專業創新感'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                PROSYNC 專屬品牌 Icon 視覺視覺提案
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  3 款設計任選
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                切換專屬圖標風格，即時套用至全站 Header、Sidebar 與匯出報告
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-4 sm:p-6 space-y-4">
          {options.map((opt) => {
            const isSelected = currentVariant === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  onSelectVariant(opt.id);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Brand Logo Preview */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
                    <BrandLogo variant={opt.id} size="lg" showText={false} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{opt.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">({opt.titleEn})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{opt.desc}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {opt.highlights.map((hl, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selection Radio Indicator */}
                <div className="self-end sm:self-center shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVariant(opt.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已選用</span>
                      </>
                    ) : (
                      <span>選用此風格</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <span>選擇後將即時套用並儲存於瀏覽器設定</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-2xs transition-colors"
          >
            完成設定
          </button>
        </div>

      </div>
    </div>
  );
};
