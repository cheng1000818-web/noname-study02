import { SiteProfile, ProjectItem, TimelineItem, SkillItem } from '../types';

export const ADMIN_EMAIL = 'cheng1000818@gmail.com';

export const INITIAL_PROFILE: SiteProfile = {
  name: '黃品澄',
  school: '家齊高中',
  grade: '高一',
  interests: '打棒球、科技探索與程式創作',
  slogan: '運用科技融入生活',
  avatarUrl: '',
  bio: '你好！我是黃品澄，目前就讀於家齊高中高一年級。我熱愛打棒球與探索科技，秉持「運用科技融入生活」的理念，喜歡把課堂所學的程式、AI 與工程思維，轉化為能夠解決日常生活實際問題的創意專案。',
  learningDirection: '專注於人工智慧應用、硬體與微控制器整合（如 Arduino / 機器人）以及網頁前端開發，培養跨領域解決問題的實作能力。',
  currentLearning: '深入學習 Python 程式設計、機器學習基礎演算法，以及利用 React 與 Modern Web 技術建構互動式應用。同時在學校參與科技研究社團與棒球隊訓練。',
  futureGoals: '期許未來能結合運動科學與 AI 影像辨識技術，開發棒球投打姿勢分析輔助工具，並持續累積高中的自主學習專案與科學競賽成果。',
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'sample-project-1',
    title: '我的第一個 AI 專題：生活智慧助理',
    date: '2026-03',
    category: 'AI 專題',
    summary: '運用生成式 AI 與自然語言處理技術，打造一個能協助高中生規劃複習進度與自主學習目標的智慧助理。',
    content: '在這個專題中，我嘗試將 Google Gemini AI 串接到互動網頁中，讓高中生輸入自己的考試日程與學習弱項，自動生成客製化的週計畫與學習建議。\n\n透過這個專題，我不僅學會了 Prompt Engineering 的結構化技巧，也了解了 API 資料傳輸與狀態管理的運作機制。',
    challenge: '在初期開發時，AI 經常給出過於籠長且不符合高中生活作息的排程，且回應速度偶爾會因提示詞過長而延遲。',
    solution: '我重新設計了 System Prompt，加入嚴格的輸出格式規範（JSON 與條列式），並在前端實作流式傳輸（Streaming）介面，大幅提升使用者體驗與排程實用性。',
    reflection: '這是我第一次獨立完成完整的 AI 整合專題。我深刻體會到「科技的價值在於解決真實需求」，當同學實際使用並給予正面回饋時，讓我對科技應用充滿了更大的熱忱。',
    images: [],
    videoUrl: '',
    order: 1,
  },
  {
    id: 'sample-project-2',
    title: '機器人挑戰：自主避障與循線車',
    date: '2025-11',
    category: '機器人與創客',
    summary: '結合 Arduino 微控制器、超音波感測器與紅外線模組，設計並製作具備自主路徑規劃與防撞機制的智慧小車。',
    content: '此專案為高一科技領域自主學習的重要成果。我從零開始學習電路焊接、麵包板接線、C/C++ 邏輯撰寫與馬達驅動控制（L298N），最終成功組裝完成雙模式（循線追蹤 + 自動避障）的機器人小車。\n\n在小車測試場地上，機器人能穩定辨識黑線路徑，並在遇到障礙物時自動減速、轉向繞行。',
    challenge: '馬達左右轉速存在微小物理誤差，導致小車直線行駛時容易偏離軌道；且超音波在斜向障礙物表面容易產生回波散射誤判。',
    solution: '在軟體端加入了簡易的 PID 速度補償校正邏輯，並透過多次取樣中位數濾波器消除超音波感測的突波噪訊，成功讓行駛穩定度提升超過 80%。',
    reflection: '軟硬體整合的除錯過程雖然繁瑣，但當看到程式碼真正驅動實體機構動起來的那一刻，獲得了難以言喻的成就感，也鍛鍊了我縝密的邏輯分析能力。',
    images: [],
    videoUrl: '',
    order: 2,
  },
  {
    id: 'sample-project-3',
    title: '我的學習反思：棒球隊訓練與自主學習的平衡',
    date: '2026-05',
    category: '學習反思',
    summary: '探討身為高中運動員與科技自學者的自我管理哲學，以及如何將棒球場上的專注與團隊合作延伸至程式開發。',
    content: '在高中生活中，我同時熱衷於棒球運動與程式自學。看似截然不同的兩個領域，其實有著驚人的共通點——都需要高度的紀律、反覆的基礎刻意練習，以及面對挫折時迅速調整心態的韌性。\n\n這篇學習反思記錄了我在課業、社團練球與專案研發之間的時間分配策略，以及運用數位工具建立個人知識庫（PKM）的實踐歷程。',
    challenge: '在比賽期與期末專案交期重疊時，容易感到時間不足與體能負荷過大。',
    solution: '我運用蕃茄工作法與時間塊規劃（Time Blocking），將大型專案拆解為每日 30 分鐘可執行的小任務，並在球隊練習後進行高效的微學習。',
    reflection: '棒球教會我「每一次揮棒都要全心全意，失敗了就調整站姿準備下一球」；寫程式教會我「Bug 是成長的必經之路」。這兩項熱情互相滋養，讓我成為更成熟自律的學習者。',
    images: [],
    videoUrl: '',
    order: 3,
  },
];

export const INITIAL_TIMELINE: TimelineItem[] = [
  {
    id: 'timeline-1',
    year: '2024',
    title: '第一次學習程式設計',
    description: '國中畢業暑假開始自學 Python 基礎語法與演算法邏輯，完成簡單文字冒險小遊戲，開啟對資訊科技的濃厚興趣。',
    category: '啟蒙探索',
    order: 1,
  },
  {
    id: 'timeline-2',
    year: '2025',
    title: '第一次完成專題（機器人競賽挑戰）',
    description: '進入家齊高中後加入科技社團，參與 Arduino 機器人自製與避障循線專案，親身體驗軟硬體整合的樂趣。',
    category: '實作競賽',
    order: 2,
  },
  {
    id: 'timeline-3',
    year: '2026',
    title: '第一次使用 AI 解決生活問題',
    description: '探討生成式 AI 與大型語言模型應用，開發「高中生自主學習進度助理」，嘗試運用現代科技輔助學習。',
    category: 'AI 應用',
    order: 3,
  },
  {
    id: 'timeline-4',
    year: '2026',
    title: '完成我的學習歷程個人網站',
    description: '使用 React、Tailwind 與 Firebase 建置個人學習歷程 Portfolio，建立屬於自己的數位學習資產庫與公開作品集。',
    category: '個人里程碑',
    order: 4,
  },
  {
    id: 'timeline-5',
    year: '未來',
    title: '下一個學習目標：運動科學與 AI 影像辨識',
    description: '計畫深入研究 Computer Vision 與 MediaPipe 姿勢辨識，探索將棒球打擊動作影像數位化分析的跨領域專案。',
    category: '未來願景',
    order: 5,
  },
];

export const INITIAL_SKILLS: SkillItem[] = [
  { id: 'skill-1', name: 'AI 與智慧應用', category: '核心技術', description: 'Prompt Engineering、Gemini API 應用、基礎機器學習概念', order: 1 },
  { id: 'skill-2', name: '程式設計', category: '核心技術', description: 'Python、JavaScript / TypeScript、React 前端基礎', order: 2 },
  { id: 'skill-3', name: '機器人與創客', category: '實作專長', description: 'Arduino、感測器模組整合、電路麵包板實作', order: 3 },
  { id: 'skill-4', name: '棒球運動與團隊領導', category: '個人特質', description: '高中棒球隊員、團隊協作溝通、運動員自律精神', order: 4 },
  { id: 'skill-5', name: '簡報與表達', category: '軟實力', description: '專案成果發表、視覺化簡報設計、學習心得反思撰寫', order: 5 },
  { id: 'skill-6', name: '自主學習與問題解決', category: '軟實力', description: '跨領域自學規劃、文獻與開源資源蒐集、邏輯除錯分析', order: 6 },
];
