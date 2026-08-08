import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Video, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Film,
  Bot,
  TrendingUp,
  Sparkle
} from 'lucide-react';
import { UserRole } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentRole: (role: UserRole) => void;
  setCurrentView: (view: 'PROJECTS' | 'ORG_STRUCTURE') => void;
  onOpenApprovalGateway: () => void;
  onCloseApprovalGateway: () => void;
  onOpenQA: () => void;
  onCloseQA: () => void;
}

interface TourStep {
  id: number;
  timeRange: string;
  durationSec: number;
  title: string;
  subTitle: string;
  targetRole: UserRole;
  targetView: 'PROJECTS' | 'ORG_STRUCTURE';
  actionNeeded?: 'OPEN_GATEWAY' | 'OPEN_QA' | 'NONE';
  description: string;
  voiceoverScript: string;
  caption: string;
  highlightPoints: string[];
  mockGraphic: {
    badge: string;
    headline: string;
    metric: string;
    submetric: string;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    timeRange: '00:00 - 00:08',
    durationSec: 8,
    title: '高階策略總覽 (C-Suite Dashboard)',
    subTitle: '即時掌握全公司專案組合、AI 戰情簡報與預算風險',
    targetRole: 'EXECUTIVE',
    targetView: 'PROJECTS',
    actionNeeded: 'NONE',
    description: '展示 AI 彙整的高階戰情簡報、高風險專案警訊（紅燈/黃燈），以及總預算 $2.8B 與執行進度。',
    voiceoverScript: '作為 C-Suite 高階主管，ProSync 的 AI 戰情室幫我即時監控跨國多專案健康度，自動摘要重大風險與預算異常，零時差掌握全局。',
    caption: '⚡ C-Suite 策略戰情室：即時監控跨國 $2.8B 專案健康度與 AI 週報',
    highlightPoints: [
      'AI 自動生成的高階決策週報摘要',
      '總預算、預估 ROI 與紅/黃燈風險燈號',
      '跨部門營運指標與執行效率'
    ],
    mockGraphic: {
      badge: 'C-SUITE STRATEGY',
      headline: 'Executive AI Portfolio War Room',
      metric: '$2.8B Portfolio',
      submetric: '18 Active Programs | 3 Critical Risk Alerts'
    }
  },
  {
    id: 2,
    timeRange: '00:08 - 00:16',
    durationSec: 8,
    title: 'Program 專案組合管理 (Program Management)',
    subTitle: '跨專案里程碑追蹤、預算消耗與進度管控',
    targetRole: 'PM',
    targetView: 'PROJECTS',
    actionNeeded: 'NONE',
    description: '切換至 Program Manager 視角，精準控管多個大型專案的甘特里程碑、人力分配與週報狀態。',
    voiceoverScript: '對於 Program Manager 而言，清晰的里程碑時程與風險排查能讓團隊不再被突發狀況卡住，確保各主計畫如期交付。',
    caption: '🎯 Program Manager 主控台：即時追蹤里程碑變更、資源消耗與預警機制',
    highlightPoints: [
      '專案卡片直觀視覺化與進度條',
      '里程碑變更申請（Milestone Change Requests）',
      '週報填報與範疇變更紀錄'
    ],
    mockGraphic: {
      badge: 'PROGRAM CONTROL',
      headline: 'Multi-Project Delivery Engine',
      metric: '87% On-Track',
      submetric: 'Milestone Change Requests & Resource Heatmap'
    }
  },
  {
    id: 3,
    timeRange: '00:16 - 00:24',
    durationSec: 8,
    title: '高階與 N-1 主管簽核關卡 (Approval Gateway)',
    subTitle: '里程碑延期、預算追加與 HR 離職交接單雙重審核',
    targetRole: 'EXECUTIVE',
    targetView: 'PROJECTS',
    actionNeeded: 'OPEN_GATEWAY',
    description: '開啟高層簽核關卡，展現專案範疇異動與 HR 人員離職交接單的嚴密治理機制。',
    voiceoverScript: '當專案發生重大里程碑變更或人力離職時，由 N-1 部門主管與 CEO 進行雙簽核，確保責任對齊與治理合規。',
    caption: '🔐 雙重簽核關卡 (Approval Gateway)：N-1 VP 與 CEO 權責覆核',
    highlightPoints: [
      '一鍵通過/退回專案里程碑變更提案',
      'N-1 主管簽核與批註功能',
      'HR 離職辦退與業務交接單控管'
    ],
    mockGraphic: {
      badge: 'EXECUTIVE GOVERNANCE',
      headline: 'Dual-Signoff Approval Gate',
      metric: 'CEO & N-1 VP Approved',
      submetric: 'Scope Changes & Talent Handover Protocols'
    }
  },
  {
    id: 4,
    timeRange: '00:24 - 00:32',
    durationSec: 8,
    title: '組織階層與人才資源治理 (Org & Talent Alignment)',
    subTitle: 'N-1 主管階層、部門架構與專案人力配置',
    targetRole: 'EXECUTIVE',
    targetView: 'ORG_STRUCTURE',
    actionNeeded: 'NONE',
    description: '展示動態組織圖、N-1 主管標章、專案人力派任與階層定制能力。',
    voiceoverScript: '結合組織架構與專案人力分派，讓主管能隨時檢視各部門 N-1 人才防線與資源調配，打造高彈性組織生態。',
    caption: '🌐 動態組織與人才對齊：N-1 梯隊防線與跨部門資源分配',
    highlightPoints: [
      'N-1 部門主管防線與層級標籤',
      '同仁專案參與數量與在職狀態',
      '可客製化的公司組織樹與階層數'
    ],
    mockGraphic: {
      badge: 'ORGANIZATION ALIGNMENT',
      headline: 'N-1 Talent & Resource Structure',
      metric: '100% Team Coverage',
      submetric: 'Dynamic Org Tree & Project Member Mapping'
    }
  }
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  setCurrentRole,
  setCurrentView,
  onOpenApprovalGateway,
  onCloseApprovalGateway,
  onOpenQA,
  onCloseQA
}) => {
  const [activeTab, setActiveTab] = useState<'CINEMA' | 'SCRIPT'>('CINEMA');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSoundEffectEnabled, setIsSoundEffectEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progressSec, setProgressSec] = useState(0);

  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedLinkedinPost, setCopiedLinkedinPost] = useState(false);

  const currentStep = TOUR_STEPS[currentStepIndex];
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle futuristic beep using Web Audio API
  const playBeepSound = (freq = 600, duration = 0.08) => {
    if (!isSoundEffectEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  };

  // Text-To-Speech (TTS) Voiceover
  const speakVoiceover = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Execute Step switching and background updates
  const executeStep = (stepIdx: number, triggerAudio = true) => {
    setCurrentStepIndex(stepIdx);
    setProgressSec(0);
    const step = TOUR_STEPS[stepIdx];

    // Close popups
    onCloseApprovalGateway();
    onCloseQA();

    // Set Role and View
    setCurrentRole(step.targetRole);
    setCurrentView(step.targetView);

    // Perform specific action
    if (step.actionNeeded === 'OPEN_GATEWAY') {
      setTimeout(() => {
        onOpenApprovalGateway();
      }, 400);
    }

    if (triggerAudio) {
      playBeepSound(800, 0.1);
      speakVoiceover(step.voiceoverScript);
    }
  };

  // Timer loop when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= currentStep.durationSec - 1) {
            if (currentStepIndex < TOUR_STEPS.length - 1) {
              executeStep(currentStepIndex + 1);
              return 0;
            } else {
              setIsPlaying(false);
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              return currentStep.durationSec;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, isOpen, isVoiceEnabled]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      executeStep(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      executeStep(currentStepIndex - 1);
    }
  };

  const handleRestart = () => {
    executeStep(0);
    setIsPlaying(true);
  };

  const copyVoiceover = () => {
    navigator.clipboard.writeText(currentStep.voiceoverScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const linkedinPostText = `🚀 【高階主管與 Program Manager 專屬的 AI 專案治理與策略決策平台】

在管理多個跨國大型計畫（Program Portfolio）時，高階主管（C-Suite）與 Program Manager 常常面臨資訊破碎、風險發酵延遲與變更簽核流程繁瑣的痛點。

我們打造了這款整合「AI 策略戰情室」與「組織與專案治理」的系統：

✨ 核心亮點功能：
1️⃣ C-Suite AI 戰情室：自動摘要專案健康度、財務預算與重大營運風險。
2️⃣ Program Manager 里程碑控管：即時追蹤專案進度、範疇變更與資源燒耗。
3️⃣ 高階與 N-1 簽核關卡 (Approval Gateway)：涵蓋里程碑變更、預算調整與 HR 人力交接單雙重核准機制。
4️⃣ 組織架構與人才對齊：動態 N-1 主管階層與專案人力派任分析。

💡 專為 Executive & PM 設計，打破溝通壁壘，提升企業級營運敏捷度！
歡迎體驗與給予建議！👇

#ProjectManagement #ProgramManagement #ExecutiveDashboard #Governance #Leadership #AITools`;

  const copyLinkedinPost = () => {
    navigator.clipboard.writeText(linkedinPostText);
    setCopiedLinkedinPost(true);
    setTimeout(() => setCopiedLinkedinPost(false), 2000);
  };

  return (
    <div className={`fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 ${
      isFullscreen ? 'p-0' : ''
    }`}>
      
      <div className={`bg-slate-950 text-white border border-slate-800/90 shadow-2xl overflow-hidden flex flex-col transition-all ${
        isFullscreen 
          ? 'w-screen h-screen rounded-none' 
          : 'w-full max-w-4xl rounded-3xl max-h-[92vh]'
      }`}>
        
        {/* Top Video Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-md">
              <Film className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">30s 影院級產品宣傳片展演 (Cinema Trailer Mode)</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> REC & TTS AUDIO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                沉浸式 30 秒高階主管與 PM 平台動態影片，配備 AI 語音朗讀、影院字幕與重點導覽
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-bold">
              <button
                onClick={() => setActiveTab('CINEMA')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'CINEMA' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>影院播放器</span>
              </button>
              <button
                onClick={() => setActiveTab('SCRIPT')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'SCRIPT' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>腳本與貼文</span>
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:flex cursor-pointer"
              title="切換全螢幕劇院模式"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onCloseApprovalGateway();
                onCloseQA();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          
          {activeTab === 'CINEMA' ? (
            /* CINEMA VIEW: Ultra High-Impact Video Simulator Canvas */
            <div className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Virtual Video Canvas Display */}
              <div className="relative w-full aspect-video bg-slate-900 rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/70 via-slate-900 to-slate-950 group">
                
                {/* Background Ambient Glow FX */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top overlay metadata */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-bold tracking-wider">
                      SCENE 0{currentStep.id} / 04
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-xs font-mono font-semibold">
                      {currentStep.timeRange}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LIVE SYNCing
                    </span>
                  </div>
                </div>

                {/* Center Dynamic Video Graphic */}
                <div className="relative z-10 my-auto text-center space-y-3 max-w-2xl mx-auto">
                  <span className="inline-block px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-mono font-extrabold tracking-widest uppercase border border-indigo-500/30">
                    {currentStep.mockGraphic.badge}
                  </span>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {currentStep.mockGraphic.headline}
                  </h2>

                  {/* High Impact Key Metric Banner */}
                  <div className="inline-flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-indigo-500/40 shadow-xl">
                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">
                      {currentStep.mockGraphic.metric}
                    </span>
                    <span className="text-xs text-indigo-200 border-l border-slate-700 pl-3">
                      {currentStep.mockGraphic.submetric}
                    </span>
                  </div>
                </div>

                {/* Bottom Subtitle / Voiceover Banner */}
                <div className="relative z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-xl text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    <Sparkle className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>AI Voiceover & Subtitles</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white tracking-wide leading-relaxed">
                    "{currentStep.caption}"
                  </p>
                </div>

              </div>

              {/* Timeline Progress Control Bar */}
              <div className="bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="font-bold text-indigo-400">{currentStep.title}</span>
                  <span>
                    00:0{currentStepIndex * 8 + progressSec} / 00:32 (30s Trailer)
                  </span>
                </div>

                {/* Animated Segment Progress Bar */}
                <div className="grid grid-cols-4 gap-2">
                  {TOUR_STEPS.map((step, idx) => {
                    const isActive = idx === currentStepIndex;
                    const isCompleted = idx < currentStepIndex;
                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          setIsPlaying(false);
                          executeStep(idx);
                        }}
                        className="relative h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer"
                        title={`切換至 Scene ${step.id}: ${step.title}`}
                      >
                        <div 
                          className={`absolute inset-y-0 left-0 transition-all ${
                            isCompleted 
                              ? 'w-full bg-indigo-500' 
                              : isActive 
                              ? 'bg-gradient-to-r from-indigo-500 to-amber-400' 
                              : 'w-0'
                          }`}
                          style={{
                            width: isActive ? `${(progressSec / step.durationSec) * 100}%` : isCompleted ? '100%' : '0%'
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* SCRIPT VIEW: Complete Storyboard & LinkedIn Copywriting */
            <div className="p-5 sm:p-6 space-y-5">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-400" /> 30 秒精華影片 4 大分鏡腳本 (Storyboard)
                  </h4>
                  <button
                    onClick={copyVoiceover}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? '已複製當前旁白' : '複製當前旁白'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {TOUR_STEPS.map((step) => (
                    <div 
                      key={step.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                        step.id === currentStep.id 
                          ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-400/30' 
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-indigo-400">Scene {step.id} ({step.timeRange})</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{step.targetRole}</span>
                      </div>
                      <div className="font-bold text-white text-sm">{step.title}</div>
                      <p className="text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        "{step.voiceoverScript}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LinkedIn Copywriting Box */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-sm text-white">專為 LinkedIn / 高階主管發布的社群貼文文案</h4>
                  </div>
                  <button
                    onClick={copyLinkedinPost}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    {copiedLinkedinPost ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLinkedinPost ? '已複製貼文' : '一鍵複製文案'}</span>
                  </button>
                </div>
                <pre className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {linkedinPostText}
                </pre>
              </div>

            </div>
          )}

        </div>

        {/* Modal Player Controls Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/90 flex items-center justify-between flex-wrap gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新播放 (00:00)</span>
            </button>

            <button
              onClick={() => {
                const nextPlaying = !isPlaying;
                setIsPlaying(nextPlaying);
                if (nextPlaying) {
                  speakVoiceover(currentStep.voiceoverScript);
                } else {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                }
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? '暫停展示影片' : '播放 30s 宣傳片 (Autoplay & TTS)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Voice Toggle */}
            <button
              onClick={() => {
                const nextVal = !isVoiceEnabled;
                setIsVoiceEnabled(nextVal);
                if (!nextVal && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isVoiceEnabled ? 'bg-indigo-950/60 border-indigo-700 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="切換 AI 語音朗讀 (TTS Voice)"
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isVoiceEnabled ? 'AI 語音開啟' : '靜音'}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-800"
                title="上一景"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIndex === TOUR_STEPS.length - 1}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="下一景"
              >
                <span>下一景</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
