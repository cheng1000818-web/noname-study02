import React from 'react';
import { History } from 'lucide-react';
import { TimelineItem } from '../types';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  return (
    <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-blue-50/80">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100/60">
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>LEARNING JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            學習歷程時間軸
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            記錄從自學探索、競賽實作到專題反思的重要成長足跡。
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 space-y-8 ml-3 sm:ml-6">
          {timeline.map((item, index) => {
            const isFuture = item.year.includes('未來') || item.year.toLowerCase().includes('future');
            return (
              <div key={item.id || index} className="relative group">
                {/* Node Marker */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full transition-all duration-300 ${
                    isFuture
                      ? 'bg-amber-400 ring-4 ring-amber-100 shadow-sm'
                      : 'bg-blue-500 ring-4 ring-blue-100 shadow-sm group-hover:scale-125'
                  }`}
                />

                {/* Content Box */}
                <div className="bg-white hover:bg-blue-50/30 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        isFuture
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.year}
                    </span>
                    {item.category && (
                      <span className="text-xs text-slate-500 font-semibold px-2.5 py-0.5 bg-slate-100 rounded-lg">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
