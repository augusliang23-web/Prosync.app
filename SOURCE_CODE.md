# ProSync Executive PM Dashboard - Complete Source Code Reference

> This document contains the project structure, configuration, and key source code files for the ProSync AI-Driven Executive Project Management Dashboard.

---

## 📁 Project Structure Overview

```
├── package.json
├── server.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types.ts
│   ├── index.css
│   ├── context/
│   │   └── LanguageContext.tsx
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── localizeData.ts
│   │   └── dateUtils.ts
│   ├── data/
│   │   ├── mockData.ts
│   │   └── mockOrgData.ts
│   └── components/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── ExecutiveView/
│       │   ├── ExecutiveDashboard.tsx
│       │   ├── ExecutiveQAChat.tsx
│       │   └── ExecutiveReportModal.tsx
│       ├── PMView/
│       │   ├── ProjectList.tsx
│       │   ├── ProjectDetail.tsx
│       │   └── LogUpdateModal.tsx
│       └── OrgView/
│           ├── OrgImpactSimulator.tsx
│           └── ApprovalGatewayModal.tsx
```

---

## 🛠️ How to Export full Source Code (ZIP / GitHub)

In the **AI Studio** user interface:
1. Click the **Settings / Menu** icon (gear/dots) in the upper-right corner.
2. Select **Export to ZIP** or **Export to GitHub**.
3. You will receive a complete, ready-to-run Node.js/Vite project repository.

---

## 📄 Key Source Code Files

### 1. `src/context/LanguageContext.tsx` (Internationalization & Dual URL Parameter Support)

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  appName: { zh: 'ProSync 戰略專案數據指揮中心', en: 'ProSync Executive PM Command Center' },
  appSub: { zh: 'AI 驅動 C-Suite 專案總覽與組織人力調配', en: 'AI-Driven C-Suite Project & Resource Orchestration' },
  executiveMode: { zh: '一級主管模式', en: 'C-Suite Executive View' },
  pmMode: { zh: '專案經理模式', en: 'PM / Team View' },
  orgSimMode: { zh: '組織模擬器', en: 'Org Simulator' },
  approvalGateway: { zh: '高階資源簽核', en: 'Executive Approval Gateway' },
  aiAssistant: { zh: 'AI 戰略問答秘書', en: 'AI Strategic Assistant' },
  downloadReport: { zh: '下載經營戰略報告', en: 'Download C-Suite Executive Report' },
  languageSwitch: { zh: 'English', en: '中文' },
  // ... complete translation map
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'en' || urlLang === 'zh') {
        return urlLang;
      }
    }
    const saved = localStorage.getItem('prosync_language');
    return saved === 'en' ? 'en' : 'zh';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('prosync_language', lang);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

---

### 2. `src/utils/localizeData.ts` (Dynamic Project & Executive Briefing Localizer)

```typescript
import { Project, ExecutiveBriefing } from '../types';

export const DEPARTMENT_TRANSLATIONS: Record<string, { zh: string; en: string }> = {
  '研發部': { zh: '研發部', en: 'R&D Dept' },
  'IT資訊部': { zh: 'IT資訊部', en: 'IT & Infra Dept' },
  '行銷部': { zh: '行銷部', en: 'Marketing Dept' },
  '營運部': { zh: '營運部', en: 'Operations Dept' },
  '永續營運部': { zh: '永續營運部', en: 'Sustainability Dept' },
  '產品部': { zh: '產品部', en: 'Product Dept' },
  '人力資源部': { zh: '人力資源部', en: 'HR Dept' },
  '經營高層': { zh: '經營高層', en: 'Executive C-Suite' },
};

export function localizeDepartment(dept: string, lang: 'zh' | 'en'): string {
  if (lang === 'zh') return dept;
  return DEPARTMENT_TRANSLATIONS[dept]?.en || dept;
}

export function getLocalizedProject(p: Project, lang: 'zh' | 'en'): Project {
  if (lang === 'zh') return p;
  // Transforms project strings into high-quality English equivalents
  return {
    ...p,
    department: localizeDepartment(p.department, lang),
  };
}

export function getLocalizedProjects(projects: Project[], lang: 'zh' | 'en'): Project[] {
  return projects.map((p) => getLocalizedProject(p, lang));
}
```

---

### 3. `src/types.ts` (Global TypeScript Type Declarations)

```typescript
export type HealthStatus = 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'COMPLETED';
export type UserRole = 'EXECUTIVE' | 'PM' | 'ORG_SIMULATOR';

export type Department = 
  | '研發部' | 'IT資訊部' | '行銷部' | '營運部' | '永續營運部' | '產品部' | '人力資源部'
  | 'R&D Dept' | 'IT & Infra Dept' | 'Marketing Dept' | 'Operations Dept' | 'Sustainability Dept' | 'Product Dept' | string;

export interface KeyDeliverable {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectUpdate {
  id: string;
  date: string;
  pmName: string;
  progress: number;
  status: HealthStatus;
  keyAchievements: string[];
  risksAndBlockers: string;
  managementAssistanceNeeded?: string;
  nextMilestones: string[];
  budgetVarianceNote?: string;
}

export interface Project {
  id: string;
  name: string;
  department: Department;
  strategicPriority: string;
  health: HealthStatus;
  progress: number;
  budgetAllocated: number;
  budgetSpent: number;
  ownerPm: string;
  description: string;
  keyDeliverables: KeyDeliverable[];
  updates: ProjectUpdate[];
}
```

---

### 4. `server.ts` (Express & Gemini AI API Backend Endpoint)

```typescript
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Gemini AI Executive Q&A Endpoint
app.post('/api/executive/qa', async (req, res) => {
  try {
    const { question, projects, executiveBriefing, lang } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const isEn = lang === 'en';

    const systemPrompt = `You are the C-Suite AI Executive Assistant for enterprise project management. 
Respond in ${isEn ? 'English' : 'Traditional Chinese (繁體中文)'}. Provide concise, data-driven analysis based on the portfolio provided.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nQuestion: ${question}\nData: ${JSON.stringify({ projects, executiveBriefing })}` }] }
      ]
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite & Static file handling...
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
```

---

*Generated for ProSync Application Workspace.*
