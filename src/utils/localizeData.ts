import { Project, ExecutiveBriefing, Employee, OrgChangeRequest } from '../types';

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
  if (DEPARTMENT_TRANSLATIONS[dept]) {
    return DEPARTMENT_TRANSLATIONS[dept].en;
  }
  return dept;
}

// English version of default projects
export const INITIAL_PROJECTS_EN: Record<string, Partial<Project>> = {
  'prj-001': {
    name: 'AI Smart Customer Support & Knowledge Agent',
    department: 'R&D Dept',
    strategicPriority: 'Core Product Upgrade',
    description: 'Integrating LLM with enterprise Knowledge Base to build first-line customer support bots and internal expert search engines, aiming for a 40% reduction in support workload.',
    keyDeliverables: [
      { id: 'del-101', title: 'Vector Database Schema Design & Benchmark Retrieval Testing', dueDate: '2026-05-15', completed: true },
      { id: 'del-102', title: 'Internal Expert Knowledge Agent Beta Testing', dueDate: '2026-07-10', completed: true },
      { id: 'del-103', title: 'External AI Customer Portal & LINE Official Bot Integration', dueDate: '2026-08-20', completed: false },
      { id: 'del-104', title: 'Company-wide Operational Training & Official Go-Live', dueDate: '2026-09-30', completed: false }
    ],
    updates: [
      {
        id: 'upd-102',
        date: '2026-07-28',
        pmName: 'Sarah Chen',
        progress: 78,
        status: 'ON_TRACK',
        keyAchievements: [
          'Completed Phase 2 internal expert Agent closed beta with a 4.6/5.0 satisfaction score',
          'Reduced model inference latency from 1.8s down to 0.65s',
          'Passed Red Team security penetration testing conforming to ISO 27001'
        ],
        risksAndBlockers: 'No major risks. Need to monitor vendor Token usage rates.',
        managementAssistanceNeeded: 'None required currently; team is progressing smoothly.',
        nextMilestones: [
          'Launch cross-department testing (Support & Marketing)',
          'Perform high-concurrency load testing on LINE Bot Webhook'
        ],
        budgetVarianceNote: 'Expenses are well within budget limits, 70% consumed.'
      },
      {
        id: 'upd-101',
        date: '2026-07-14',
        pmName: 'Sarah Chen',
        progress: 68,
        status: 'ON_TRACK',
        keyAchievements: [
          'Cleaned and embedded 12,000 historical FAQ documents',
          'Established automated RAG Evaluation Benchmark'
        ],
        risksAndBlockers: 'Parsing precision for legacy PDFs insufficient; OCR fine-tuning in progress.',
        managementAssistanceNeeded: 'Request Operations team review and finalize FAQ dataset.',
        nextMilestones: ['Complete Customer UI/UX v2 revisions']
      }
    ]
  },
  'prj-002': {
    name: 'Core ERP & Microservices Refactoring',
    department: 'IT & Infra Dept',
    strategicPriority: 'Security & Infrastructure',
    description: 'Decomposing legacy monolith ERP into Docker/K8s microservices, upgrading database engines, and deploying a real-time ETL pipeline.',
    keyDeliverables: [
      { id: 'del-201', title: 'Cloud K8s Infrastructure & CI/CD Pipeline Setup', dueDate: '2026-05-30', completed: true },
      { id: 'del-202', title: 'Legacy Oracle DB Migration to Cloud SQL PostgreSQL', dueDate: '2026-07-15', completed: false },
      { id: 'del-203', title: 'Finance & Inventory Microservices Development', dueDate: '2026-09-10', completed: false },
      { id: 'del-204', title: 'System-wide Parallel Run Verification', dueDate: '2026-11-01', completed: false }
    ],
    updates: [
      {
        id: 'upd-202',
        date: '2026-07-29',
        pmName: 'David Wang',
        progress: 32,
        status: 'DELAYED',
        keyAchievements: [
          'Validated data cleanup for 15 years of legacy relational records',
          'Passed security vulnerability scans on core K8s clusters'
        ],
        risksAndBlockers: 'Legacy Oracle Stored Procedures logic is highly complex; vendor data migration is delayed by 3 weeks with data consistency gaps.',
        managementAssistanceNeeded: 'Requires executive approval for 2 Senior PostgreSQL DBAs on-site support and an additional contingency budget of NT$300,000.',
        nextMilestones: [
          'Resolve transaction ledger reconciliation logic gaps',
          'Reset DB stress testing schedule'
        ],
        budgetVarianceNote: 'Due to additional vendor hours, final budget may exceed by 8-10%.'
      }
    ]
  },
  'prj-003': {
    name: 'Q3 Global Brand Campaign & Digital Marketing',
    department: 'Marketing Dept',
    strategicPriority: 'Market Expansion',
    description: 'Driving digital advertising, influencer partnerships, global video production, and social media campaigns for Q3 product launches.',
    keyDeliverables: [
      { id: 'del-301', title: 'Finalize Key Visual & Design Brand Guidelines', dueDate: '2026-06-15', completed: true },
      { id: 'del-302', title: 'Shoot 3 Brand Videos & Sign Core Influencers', dueDate: '2026-07-20', completed: false },
      { id: 'del-303', title: 'Pre-order Landing Page Development & SEO Deployment', dueDate: '2026-08-05', completed: true },
      { id: 'del-304', title: 'Global Online Launch Stream & Media PR', dueDate: '2026-08-25', completed: false }
    ],
    updates: [
      {
        id: 'upd-302',
        date: '2026-07-30',
        pmName: 'Alex Lin',
        progress: 55,
        status: 'AT_RISK',
        keyAchievements: [
          'Pre-order landing page attracted 32,000+ views and 1,200 leads within 5 days',
          'Signed 5 key influencers across North America and SEA'
        ],
        risksAndBlockers: 'Main production house delayed brand video delivery by 10 days due to director quarantine and script revisions.',
        managementAssistanceNeeded: 'Request VP of Marketing approval to release B-roll Shorts / Reels ahead of full video release.',
        nextMilestones: [
          'Complete media PR press release sign-offs',
          'Final acceptance check on video assets'
        ],
        budgetVarianceNote: 'Ad spend is progressing within normal scope.'
      }
    ]
  },
  'prj-004': {
    name: 'APAC Smart Warehouse & Logistics Automation',
    department: 'Operations Dept',
    strategicPriority: 'Operational Efficiency',
    description: 'Deploying WMS smart warehouse management, AGV autonomous robots, and automated cross-border customs API to boost fulfillment speed by 50%.',
    keyDeliverables: [
      { id: 'del-401', title: 'Logistics Hub Network Infrastructure & Cabling', dueDate: '2026-04-30', completed: true },
      { id: 'del-402', title: 'AGV Robot Fleet Calibration & Staff Training', dueDate: '2026-06-30', completed: true },
      { id: 'del-403', title: 'WMS & 3PL Express Courier API Integration', dueDate: '2026-07-25', completed: true },
      { id: 'del-404', title: 'Taoyuan Hub Soft Launch & Live Order Cutover', dueDate: '2026-09-15', completed: false }
    ],
    updates: [
      {
        id: 'upd-402',
        date: '2026-07-27',
        pmName: 'Emily Huang',
        progress: 88,
        status: 'ON_TRACK',
        keyAchievements: [
          'Successfully stress-tested 100,000 order scenarios with zero dropped items',
          '100% warehouse staff certified on new AGV system',
          'Average order fulfillment time reduced from 14 mins down to 4.2 mins'
        ],
        risksAndBlockers: 'Minor batch timeouts during weekend customs processing; coordinating dedicated line upgrade.',
        managementAssistanceNeeded: 'None required; schedule is 2 weeks ahead of target.',
        nextMilestones: [
          'Launch Phase 1 live traffic test on August 15',
          'Simulate failover switch for dual-warehouse backup'
        ]
      }
    ]
  },
  'prj-005': {
    name: 'ESG Carbon Accounting & Sustainability Hub',
    department: 'Sustainability Dept',
    strategicPriority: 'Sustainability & Compliance',
    description: 'Establishing Scope 1, 2, and 3 carbon automated calculation engine connected with 3rd-party audit databases (SGS/BSI).',
    keyDeliverables: [
      { id: 'del-501', title: 'Scope 1 & 2 Energy Boundaries & Inventory Completion', dueDate: '2026-05-31', completed: true },
      { id: 'del-502', title: 'Cross-factory IoT Power Meter Module & Auto-ingestion', dueDate: '2026-07-30', completed: true },
      { id: 'del-503', title: 'Scope 3 Supply Chain Survey & Footprint Factor DB', dueDate: '2026-10-15', completed: false },
      { id: 'del-504', title: 'ISO 14064-1 3rd-party Audit Statement Verification', dueDate: '2026-12-01', completed: false }
    ],
    updates: [
      {
        id: 'upd-501',
        date: '2026-07-25',
        pmName: 'Ken Chang',
        progress: 65,
        status: 'ON_TRACK',
        keyAchievements: [
          '100% IoT meter deployment across 4 manufacturing sites with daily emission syncing',
          'Completed ISO 14064-1 boundary draft and internal audit'
        ],
        risksAndBlockers: 'Low response rate (35%) on Scope 3 carbon survey from overseas Tier-2 suppliers.',
        managementAssistanceNeeded: 'Request Procurement Head emphasize carbon reporting compliance at upcoming vendor summit.',
        nextMilestones: [
          'Host 2nd supplier ESG briefing session',
          'Draft Sustainability Report'
        ]
      }
    ]
  },
  'prj-006': {
    name: 'Next-Gen Mobile App 2.0 Redesign',
    department: 'Product Dept',
    strategicPriority: 'Core Product Upgrade',
    description: 'Complete React Native refactor of dual-platform mobile app, featuring minimalist UI, biometric login, and personalized recommendation feeds.',
    keyDeliverables: [
      { id: 'del-601', title: 'Design System & 60+ UI Component Library', dueDate: '2026-05-20', completed: true },
      { id: 'del-602', title: 'Checkout & Loyalty Member Microservices APIs', dueDate: '2026-07-15', completed: true },
      { id: 'del-603', title: 'iOS/Android Closed Beta & Crashlytics Optimization', dueDate: '2026-08-30', completed: false },
      { id: 'del-604', title: 'Store Submissions (App Store & Google Play)', dueDate: '2026-10-01', completed: false }
    ],
    updates: [
      {
        id: 'upd-601',
        date: '2026-07-31',
        pmName: 'Jessica Wu',
        progress: 42,
        status: 'AT_RISK',
        keyAchievements: [
          'Completed Member Hub, Feed Recommendation, and Checkout modules',
          'Frontend performance improved by 35% compared to native legacy app'
        ],
        risksAndBlockers: 'Apple App Store privacy policy review tightened; biometric login module requires additional legal disclosures.',
        managementAssistanceNeeded: 'Request Legal and Cyber Security review iOS privacy disclosures this week to prevent submission delays.',
        nextMilestones: [
          'Resolve Android foldable screen layout bug',
          'Launch 200-user internal Alpha test'
        ]
      }
    ]
  }
};

export const INITIAL_EXECUTIVE_BRIEFING_EN: ExecutiveBriefing = {
  generatedAt: '2026-07-31 08:00',
  overallExecutiveSummary: 'Portfolio health is overall Moderate-Good. Across 6 core strategic projects: 3 are On Track, 2 are At Risk, and 1 is Delayed. Total allocated budget is NT$23.8M with NT$13.95M spent (58.6% execution rate). Key bottlenecks focus on IT ERP database migration staffing and vendor compliance/delays in Marketing and Product. Immediate executive recommendation is to approve contingency DBA staffing for ERP and expedite Legal reviews for iOS App privacy disclosures.',
  portfolioHealthOverview: {
    totalProjects: 6,
    onTrackCount: 3,
    atRiskCount: 2,
    delayedCount: 1,
    completedCount: 0,
    totalBudgetAllocated: 23800000,
    totalSpentBudget: 13950000
  },
  criticalRisksAndDecisions: [
    {
      projectId: 'prj-002',
      projectName: 'Core ERP & Microservices Refactoring',
      department: 'IT & Infra Dept',
      leadPm: 'David Wang',
      issue: '15-year legacy Oracle DB logic is complex; migration is 3 weeks behind with vendor bottleneck.',
      pmAssistanceRequested: 'Request NT$300,000 contingency fund for 2 Senior DBA experts on-site.',
      aiRecommendedAction: '[RECOMMEND APPROVAL] ERP is core business infrastructure. 300k is within 8% variance threshold and prevents downstream accounting delays.',
      priority: 'HIGH'
    },
    {
      projectId: 'prj-003',
      projectName: 'Q3 Global Brand Campaign & Digital Marketing',
      department: 'Marketing Dept',
      leadPm: 'Alex Lin',
      issue: 'Video production vendor delayed by 10 days due to quarantine and script edits.',
      pmAssistanceRequested: 'Request approval to launch B-roll Reels first for pre-order momentum.',
      aiRecommendedAction: '[APPROVE FLEXIBLE SCHEDULING] Authorize marketing to leverage short video Reels to capture Q3 pre-order traffic.',
      priority: 'MEDIUM'
    },
    {
      projectId: 'prj-006',
      projectName: 'Next-Gen Mobile App 2.0 Redesign',
      department: 'Product Dept',
      leadPm: 'Jessica Wu',
      issue: 'Apple App Store privacy rules tightened; biometric module requires legal disclosure.',
      pmAssistanceRequested: 'Requires Legal & Security team approval within 2 business days.',
      aiRecommendedAction: '[ASSIGN CROSS-DEPT FAST-TRACK] Direct Legal to finalize disclosure in 48 hrs to prevent missing August beta target.',
      priority: 'MEDIUM'
    }
  ],
  topWinsAndProgress: [
    {
      projectId: 'prj-004',
      projectName: 'APAC Smart Warehouse & Logistics Automation',
      department: 'Operations Dept',
      achievement: 'Successfully passed 100k shipping stress test; fulfillment time cut by 70%, 2 weeks ahead of schedule!'
    },
    {
      projectId: 'prj-001',
      projectName: 'AI Smart Customer Support & Knowledge Agent',
      department: 'R&D Dept',
      achievement: 'Internal Agent scored 4.6/5.0 in satisfaction; inference latency cut to 0.65s; passed ISO 27001 Red Team test.'
    },
    {
      projectId: 'prj-005',
      projectName: 'ESG Carbon Accounting & Sustainability Hub',
      department: 'Sustainability Dept',
      achievement: '100% IoT power meter auto-tracking active across 4 manufacturing plants.'
    }
  ],
  departmentalStatus: [
    { department: 'R&D Dept', statusSummary: 'Excellent performance; AI project results outstanding with no blockers.', healthScore: 92, activeProjectCount: 1 },
    { department: 'Operations Dept', statusSummary: 'Logistics automation ahead of schedule; cross-border tests completed smoothly.', healthScore: 95, activeProjectCount: 1 },
    { department: 'Sustainability Dept', statusSummary: 'IoT onboarding complete; initiating Scope 3 supplier survey phase.', healthScore: 88, activeProjectCount: 1 },
    { department: 'Marketing Dept', statusSummary: 'Pre-order traffic strong, but video vendor delay requires schedule adjustment.', healthScore: 72, activeProjectCount: 1 },
    { department: 'Product Dept', statusSummary: 'App 2.0 UI speed improved significantly; addressing privacy compliance and foldable screen bugs.', healthScore: 70, activeProjectCount: 1 },
    { department: 'IT & Infra Dept', statusSummary: 'ERP DB migration blocked by complex legacy logic; technical reinforcement needed.', healthScore: 52, activeProjectCount: 1 }
  ],
  strategicRecommendations: [
    '[RESOURCE ALLOCATION]: Prioritize contingency budget release for IT Dept ERP database migration.',
    '[PROCESS ACCELERATION]: Establish a legal and cyber security fast-track review channel for App/Marketing releases.',
    '[SUPPLIER MANAGEMENT]: Tie procurement vendor evaluations directly to ESG carbon data submission compliance.'
  ]
};

export function getLocalizedProject(p: Project, lang: 'zh' | 'en'): Project {
  if (lang === 'zh') return p;
  
  const enOverride = INITIAL_PROJECTS_EN[p.id];
  const localizedDept = localizeDepartment(p.department, lang);

  if (enOverride) {
    return {
      ...p,
      name: enOverride.name || p.name,
      department: localizedDept,
      strategicPriority: enOverride.strategicPriority || p.strategicPriority,
      description: enOverride.description || p.description,
      keyDeliverables: enOverride.keyDeliverables || p.keyDeliverables,
      updates: enOverride.updates || p.updates,
    };
  }

  // If user created a project, localize department name
  return {
    ...p,
    department: localizedDept,
  };
}

export function getLocalizedProjects(projects: Project[], lang: 'zh' | 'en'): Project[] {
  return projects.map((p) => getLocalizedProject(p, lang));
}

export function getLocalizedBriefing(briefing: ExecutiveBriefing, lang: 'zh' | 'en'): ExecutiveBriefing {
  if (lang === 'zh') return briefing;
  
  // Return localized executive briefing
  return {
    ...INITIAL_EXECUTIVE_BRIEFING_EN,
    // Keep total counts if modified dynamically
    portfolioHealthOverview: briefing.portfolioHealthOverview || INITIAL_EXECUTIVE_BRIEFING_EN.portfolioHealthOverview,
  };
}
