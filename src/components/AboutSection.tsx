import React from 'react';
import { User, Compass, BookOpen, Target, Sparkles, Activity } from 'lucide-react';
import { SiteProfile } from '../types';

interface AboutProps {
  profile: SiteProfile;
}

export const AboutSection: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-blue-50/80">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100/60">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>ABOUT ME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            關於我
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            透過跨領域的學習與科技實作，將熱情轉化為解決生活問題的力量。
          </p>
        </div>

        {/* Top Bio Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100/70 shadow-md shadow-blue-50/50 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-60 pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-xs shrink-0 border border-blue-100 hidden sm:block">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                  個人自我介紹
                </h3>
                <span className="text-xs font-semibold text-blue-700 px-2.5 py-0.5 bg-blue-50 rounded-full border border-blue-100">
                  {profile.school || '家齊高中'} {profile.grade || '高一'}
                </span>
              </div>
              <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                {profile.bio ||
                  '你好！我是黃品澄，目前就讀家齊高中高一。我熱愛科技探索與運動，致力於將所學知識應用於生活實務。'}
              </p>
              {profile.interests && (
                <div className="pt-2 flex items-center gap-2 text-sm text-slate-600">
                  <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-800">課外興趣：</span>
                  <span>{profile.interests}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3 Structured Columns: 學習方向, 目前正在學習, 未來想挑戰 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Learning Direction */}
          <div
            id="about-card-direction"
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">學習方向</h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line flex-1">
              {profile.learningDirection || '專注於人工智慧應用、硬體控制與現代 Web 開發實作。'}
            </p>
          </div>

          {/* Current Learning */}
          <div
            id="about-card-current"
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">目前正在學習</h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line flex-1">
              {profile.currentLearning || '深化 Python 演算法、AI 應用及高中自然科學各項探究實作。'}
            </p>
          </div>

          {/* Future Goals */}
          <div
            id="about-card-goals"
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">未來想挑戰的事</h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line flex-1">
              {profile.futureGoals || '結合運動與 AI 影像辨識進行專題研究，並持續累積高中自主學習資產。'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
