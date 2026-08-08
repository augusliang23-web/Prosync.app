import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini SDK safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') });
});

// API Endpoint 1: Generate C-Suite Executive Briefing
app.post('/api/ai/executive-summary', async (req, res) => {
  try {
    const { projects, lang = 'zh' } = req.body;
    if (!projects || !Array.isArray(projects)) {
      return res.status(400).json({ error: 'Projects array is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API Key is not configured. Please add GEMINI_API_KEY in Secrets.',
      });
    }

    const isEn = lang === 'en';
    const prompt = isEn ? `
You are an experienced COO and senior executive project management consultant.
Review the following company project update data and generate an Executive Briefing for C-suite leaders (CEO, Board).

Projects and PM updates:
${JSON.stringify(projects, null, 2)}

Analyze and output JSON according to the schema:
1. overallExecutiveSummary: 200-300 word executive summary covering overall portfolio health, budget utilization, key bottlenecks, and strategic solutions.
2. criticalRisksAndDecisions: Array of delayed/at-risk projects requiring management decisions (projectId, projectName, department, leadPm, issue, pmAssistanceRequested, aiRecommendedAction, priority: 'HIGH'|'MEDIUM'|'LOW').
3. topWinsAndProgress: Array of major breakthroughs this week (projectId, projectName, department, achievement).
4. departmentalStatus: Array summarizing status per department (department, statusSummary, healthScore: 0-100, activeProjectCount).
5. strategicRecommendations: 3-4 cross-department strategic recommendations for leadership.
` : `
你是一位擁有豐富經驗的企業資深營運長 (COO) 兼高階專案管理顧問。
請審閱以下最新的全公司各專案進度更新資料，為高階一級主管 (CEO / 總經理 / 董事會) 生成一份精準、客觀、高戰略含金量的【一級主管專案綜合簡報 (Executive Briefing)】。

專案清單與最新 PM 週報紀錄如下：
${JSON.stringify(projects, null, 2)}

請分析並輸出 JSON 格式，必須符合以下 JSON Schema 結構：
1. overallExecutiveSummary: 200~300字的整體總結，包含專案整體健康度評估、資金使用與進度綜合解析、最大瓶頸與關鍵對策。
2. criticalRisksAndDecisions: 陣列，抽出所有處於 DELAYED 或 AT_RISK 的專案，或是需要主管協助的重大阻礙事項。包含 projectId, projectName, department, leadPm, issue, pmAssistanceRequested, aiRecommendedAction (給高層主管的具體決策建議), priority ('HIGH' | 'MEDIUM' | 'LOW')。
3. topWinsAndProgress: 陣列，抽出本週最顯著的成果亮點 (例如超前進度、關鍵測試通過、績效指標大升)。包含 projectId, projectName, department, achievement。
4. departmentalStatus: 陣列，針對各個部門進行彙整 (例如 研發部, IT資訊部, 行銷部, 營運部, 永續營運部, 產品部)，包含 department, statusSummary, healthScore (0-100分), activeProjectCount。
5. strategicRecommendations: 3~4點給一級主管的跨部門戰略建議與資源整合方向。
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: isEn 
          ? 'You are a C-suite executive briefing consultant. Respond in clear, professional English.'
          : '你是一位精明且嚴謹的企業高階主管簡報顧問。請使用繁體中文（台灣）輸出結構化的 JSON Executive Briefing。',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallExecutiveSummary: { type: Type.STRING },
            criticalRisksAndDecisions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  projectId: { type: Type.STRING },
                  projectName: { type: Type.STRING },
                  department: { type: Type.STRING },
                  leadPm: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  pmAssistanceRequested: { type: Type.STRING },
                  aiRecommendedAction: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
                },
                required: ['projectId', 'projectName', 'department', 'leadPm', 'issue', 'pmAssistanceRequested', 'aiRecommendedAction', 'priority'],
              },
            },
            topWinsAndProgress: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  projectId: { type: Type.STRING },
                  projectName: { type: Type.STRING },
                  department: { type: Type.STRING },
                  achievement: { type: Type.STRING },
                },
                required: ['projectId', 'projectName', 'department', 'achievement'],
              },
            },
            departmentalStatus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  department: { type: Type.STRING },
                  statusSummary: { type: Type.STRING },
                  healthScore: { type: Type.NUMBER },
                  activeProjectCount: { type: Type.NUMBER },
                },
                required: ['department', 'statusSummary', 'healthScore', 'activeProjectCount'],
              },
            },
            strategicRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['overallExecutiveSummary', 'criticalRisksAndDecisions', 'topWinsAndProgress', 'departmentalStatus', 'strategicRecommendations'],
        },
      },
    });

    const resultText = response.text || '';
    const parsedData = JSON.parse(resultText);

    // Calculate portfolio overview numbers from actual projects
    const totalProjects = projects.length;
    const onTrackCount = projects.filter((p: any) => p.health === 'ON_TRACK').length;
    const atRiskCount = projects.filter((p: any) => p.health === 'AT_RISK').length;
    const delayedCount = projects.filter((p: any) => p.health === 'DELAYED').length;
    const completedCount = projects.filter((p: any) => p.health === 'COMPLETED').length;
    const totalBudgetAllocated = projects.reduce((acc: number, p: any) => acc + (p.totalBudget || 0), 0);
    const totalSpentBudget = projects.reduce((acc: number, p: any) => acc + (p.spentBudget || 0), 0);

    const fullBriefing = {
      generatedAt: new Date().toLocaleString(isEn ? 'en-US' : 'zh-TW', { hour12: false }),
      ...parsedData,
      portfolioHealthOverview: {
        totalProjects,
        onTrackCount,
        atRiskCount,
        delayedCount,
        completedCount,
        totalBudgetAllocated,
        totalSpentBudget,
      },
    };

    return res.json(fullBriefing);
  } catch (err: any) {
    console.error('Error in /api/ai/executive-summary:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate executive summary' });
  }
});

// API Endpoint 2: Executive Q&A Assistant
app.post('/api/ai/qa', async (req, res) => {
  try {
    const { question, projects, executiveBriefing, lang = 'zh' } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is missing' });
    }

    const isEn = lang === 'en';
    const prompt = isEn ? `
You are an AI Executive Secretary with full visibility into all company project data.
An executive asked: "${question}"

Company Projects & Updates:
${JSON.stringify(projects, null, 2)}

Latest Executive Briefing:
${JSON.stringify(executiveBriefing, null, 2)}

Provide a clear, strategic, well-structured answer in English.
1. Reference specific project names, amounts, PMs, or completion percentages.
2. Give the direct conclusion first, followed by root causes, and recommended executive action items.
` : `
你是一位掌握全公司專案數據的高階 AI 專案秘書。一級主管詢問了以下問題：
【主管問題】："${question}"

【目前全公司的專案清單與進度數據】：
${JSON.stringify(projects, null, 2)}

【目前最新的 Executive Briefing 摘要】：
${JSON.stringify(executiveBriefing, null, 2)}

請以專業、精練、條理分明的繁體中文回答主管問題。
要求：
1. 引用具體的專案名稱、金額、負責 PM、進度百分比或落後原因說明。
2. 答案先給結論，再說明原因，最後列出主管可採取的對策或觀察重點。
3. 可適度使用 Markdown 條列式或粗體重點，讓閱讀體驗極佳。
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: isEn 
          ? 'You are an efficient executive secretary providing precise, actionable project insights in English.'
          : '你是一位精準、高效率的高階專案簡報秘書，回答語氣專業且直接切中要害。',
      },
    });

    return res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Error in /api/ai/qa:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate QA response' });
  }
});

// API Endpoint 3: PM Polish Weekly Update text
app.post('/api/ai/polish-update', async (req, res) => {
  try {
    const { rawAchievements, rawBlockers, rawAssistance, lang = 'zh' } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is missing' });
    }

    const isEn = lang === 'en';
    const prompt = isEn ? `
You are a PM copy polishing assistant. Polish the informal PM weekly update draft into crisp, professional text for C-suite executive reading.

[Draft Achievements]: ${rawAchievements || 'None'}
[Draft Blockers]: ${rawBlockers || 'None'}
[Draft Assistance Requested]: ${rawAssistance || 'None'}

Output JSON:
1. polishedAchievements: Array of concise bullet points (max 3, data-driven)
2. polishedBlockers: Precise root cause and impact
3. polishedAssistance: Clear resource / decision request to management
` : `
你是專案經理 (PM) 的簡報潤飾助手。請將 PM 輸入的粗糙、口語化週報內容，整理潤飾為能直接呈現給一級主管閱讀的專業、精確、條理分明的文字。

【草稿 - 本週成就】：${rawAchievements || '無'}
【草稿 - 當前阻礙/風險】：${rawBlockers || '無'}
【草稿 - 需要主管協助事項】：${rawAssistance || '無'}

請輸出 JSON：
1. polishedAchievements: 3點以內的精簡列點 (字字精鍊，包含數據或量化結果)
2. polishedBlockers: 精確敘述問題根因與可能影響
3. polishedAssistance: 明確向主管提出的請求 (包含所需資源、跨部門交辦或資金核可)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            polishedAchievements: { type: Type.ARRAY, items: { type: Type.STRING } },
            polishedBlockers: { type: Type.STRING },
            polishedAssistance: { type: Type.STRING },
          },
          required: ['polishedAchievements', 'polishedBlockers', 'polishedAssistance'],
        },
      },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Error in /api/ai/polish-update:', err);
    return res.status(500).json({ error: err.message || 'Failed to polish update' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
