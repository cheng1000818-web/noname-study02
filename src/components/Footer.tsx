import React from 'react';
import { SiteProfile } from '../types';

interface FooterProps {
  profile: SiteProfile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-public-footer" className="bg-white border-t border-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="font-bold text-slate-800 text-sm">
            {profile.name || '黃品澄'} <span className="text-blue-500 font-semibold">•</span> 學生學習歷程檔案
          </p>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {profile.school || '家齊高中'} {profile.grade || '高一'}
          </p>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Designed by {profile.name || '黃品澄'} © {currentYear} Student Portfolio System
        </div>
      </div>
    </footer>
  );
};
