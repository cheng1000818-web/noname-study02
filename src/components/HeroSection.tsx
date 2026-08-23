import React from 'react';
import { ArrowRight, Sparkles, GraduationCap, Heart, Terminal } from 'lucide-react';
import { SiteProfile } from '../types';

interface HeroProps {
  profile: SiteProfile;
}

export const HeroSection: React.FC<HeroProps> = ({ profile }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 overflow-hidden"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-blue-200/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Badges / School & Grade */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-semibold mb-6 border border-blue-100 shadow-xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>{profile.school || '家齊高中'}</span>
          <span className="text-blue-300">•</span>
          <span>{profile.grade || '高一'}</span>
        </div>

        {/* Avatar / Photo Container */}
        <div className="relative mb-5 group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-blue-100 border-4 border-white shadow-lg shadow-blue-100/70 flex items-center justify-center overflow-hidden">
            {profile.avatarUrl ? (
              <img
                id="hero-avatar-image"
                src={profile.avatarUrl}
                alt={profile.name || '黃品澄'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full bg-white"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-50 flex flex-col items-center justify-center text-blue-500">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {profile.name ? profile.name.charAt(0) : '澄'}
                </span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wider mt-0.5">STUDENT</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-md border-2 border-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Greeting & Name */}
        <h1
          id="hero-main-title"
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2"
        >
          {profile.name || '黃品澄'}
        </h1>
        <p className="text-blue-600 font-medium text-base sm:text-lg mb-4">
          {profile.school || '家齊高中'} · {profile.grade || '高一'}
        </p>

        {/* Slogan */}
        <div className="relative max-w-xl mx-auto mb-6">
          <blockquote
            id="hero-slogan-quote"
            className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium tracking-tight italic"
          >
            「{profile.slogan || '運用科技融入生活'}」
          </blockquote>
        </div>

        {/* Interests & Mini Tags */}
        {profile.interests && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>{profile.interests}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium shadow-2xs">
              <Terminal className="w-3.5 h-3.5 text-blue-600" />
              <span>科技探究 & AI 實作</span>
            </span>
          </div>
        )}

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <a
            id="hero-cta-view-projects"
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300"
          >
            <span>查看我的作品</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            id="hero-cta-about-me"
            href="#about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
          >
            <span>關於我</span>
          </a>
        </div>
      </div>
    </section>
  );
};
