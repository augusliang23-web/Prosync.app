import React, { useState, useEffect } from 'react';
import { Project, ExecutiveBriefing, QAMessage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  X, 
  HelpCircle, 
  Loader2
} from 'lucide-react';

interface ExecutiveQAChatProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  briefing: ExecutiveBriefing;
}

const PRESET_QUESTIONS_ZH = [
  '哪些專案目前處於落後 (Delayed) 或高風險 (At Risk) 狀態？',
  '請整理需要一級主管本週核准的資源或預備金項目。',
  '研發部與 IT 資訊部目前遭遇的最大技術瓶頸是什麼？',
  '請分析全公司專案的總預算執行進度與異常項目。',
  '有哪些專案預計在未來一個月內完成重要上線？',
];

const PRESET_QUESTIONS_EN = [
  'Which projects are currently Delayed or At Risk?',
  'List resource or contingency budget items requiring executive approval this week.',
  'What are the primary technical bottlenecks in R&D and IT?',
  'Analyze overall portfolio budget execution and any variance.',
  'Which projects are scheduled for major go-live within the next month?',
];

export const ExecutiveQAChat: React.FC<ExecutiveQAChatProps> = ({
  isOpen,
  onClose,
  projects,
  briefing,
}) => {
  const { language, t } = useLanguage();
  const presetQuestions = language === 'en' ? PRESET_QUESTIONS_EN : PRESET_QUESTIONS_ZH;

  const [messages, setMessages] = useState<QAMessage[]>([]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: language === 'en'
            ? 'Hello! I am your AI Strategic Executive Assistant. Ask me anything about project status, budget execution, bottlenecks, or cross-department resource allocation.'
            : '您好！我是全公司專案數據的 AI 簡報戰略秘書 (核心功能 #7)。您可以問我任何關於專案進度、預算執行、瓶頸阻礙或跨部門資源調配的問題。',
          timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'zh-TW', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: QAMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'zh-TW', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          projects,
          executiveBriefing: briefing,
          lang: language,
        }),
      });

      if (!res.ok) {
        throw new Error(language === 'en' ? 'Failed to get AI response' : '無法取得 AI 回覆');
      }

      const data = await res.json();

      const aiMsg: QAMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.answer || (language === 'en' ? 'Sorry, unable to analyze this question.' : '抱歉，暫時無法分析此問題。'),
        timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'zh-TW', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('QA Error:', err);
      const errorMsg: QAMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: language === 'en' 
          ? `Analysis error: ${err.message || 'Connection timeout'}. Please try again.`
          : `分析發生錯誤：${err.message || '連線逾時'}。請稍後再試。`,
        timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'zh-TW', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white text-slate-800 h-full shadow-2xl flex flex-col border-l border-slate-200/80 animate-in slide-in-from-right duration-300">
        
        {/* Chat Drawer Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-slate-100 shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                {language === 'en' ? 'C-Suite AI Strategic Assistant' : '核心功能 #7：一級主管 AI 戰略問答助理'}
                <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded border border-slate-300/50">
                  AI Assistant
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en' 
                  ? `Real-time analysis across ${projects.length} company-wide project datasets`
                  : `即時交叉比對 ${projects.length} 個全公司專案進度與預算數據`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Chips */}
        <div className="px-4 py-2.5 bg-slate-50/50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-600 font-semibold shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> {language === 'en' ? 'Presets:' : '常用問答:'}
          </span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80 whitespace-nowrap shrink-0 transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-slate-100 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[84%] rounded-xl p-3.5 ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-slate-100 rounded-tr-none shadow-2xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                  {msg.content}
                </div>
                <div
                  className={`text-[10px] mt-1.5 ${
                    msg.role === 'user' ? 'text-slate-300 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-slate-500 text-xs py-2">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-100">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>
                {language === 'en'
                  ? 'AI Assistant analyzing project datasets...'
                  : 'AI 秘書正比對專案數據並整理分析中...'}
              </span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                language === 'en'
                  ? 'Ask any C-suite project management or strategic question...'
                  : '請輸入欲向 AI 詢問的高階戰略問題...'
              }
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-100 rounded-xl shadow-2xs transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
