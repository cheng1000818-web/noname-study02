import React from 'react';
import { Award, CheckCircle2, Code2, Cpu, Users, BookOpen, Sparkles } from 'lucide-react';
import { SkillItem } from '../types';

interface SkillsSectionProps {
  skills: SkillItem[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // Group skills by category
  const groupedSkills: Record<string, SkillItem[]> = {};
  skills.forEach((skill) => {
    const cat = skill.category || '其他領域';
    if (!groupedSkills[cat]) {
      groupedSkills[cat] = [];
    }
    groupedSkills[cat].push(skill);
  });

  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.includes('技術') || categoryName.includes('程式') || categoryName.includes('AI')) return Code2;
    if (categoryName.includes('創客') || categoryName.includes('機器人') || categoryName.includes('實作')) return Cpu;
    if (categoryName.includes('特質') || categoryName.includes('運動') || categoryName.includes('領導')) return Users;
    return BookOpen;
  };

  const categories = Object.entries(groupedSkills);

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100/60">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>SKILLS & ABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            我的技能與專長
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            結合科技軟硬體實作能力、運動家自律精神與團隊協作溝通。
          </p>
        </div>

        {/* Grouped Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(([category, items], idx) => {
            const Icon = getCategoryIcon(category);
            const isFeatured = idx === 0;

            if (isFeatured) {
              return (
                <div
                  key={category}
                  className="bg-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Vibrant Ambient Glow Decorator */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full opacity-30 blur-xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-teal-400 rounded-full opacity-20 blur-xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/15 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{category}</h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>核心專長</span>
                      </span>
                    </div>

                    <div className="space-y-3 relative z-10">
                      {items.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md hover:bg-white/25 transition-all border border-white/15"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                            <span className="font-bold text-white text-sm">{skill.name}</span>
                          </div>
                          {skill.description && (
                            <p className="text-xs text-blue-100 pl-6 leading-relaxed">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/15 text-xs text-blue-100 italic relative z-10">
                    專注於人工智慧與生活自動化應用的深入探究與整合。
                  </div>
                </div>
              );
            }

            return (
              <div
                key={category}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">{category}</h3>
                  </div>

                  <div className="space-y-3 flex-1">
                    {items.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 transition-colors border border-slate-100"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-bold text-slate-800 text-sm">{skill.name}</span>
                        </div>
                        {skill.description && (
                          <p className="text-xs text-slate-500 pl-6 leading-relaxed">
                            {skill.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
