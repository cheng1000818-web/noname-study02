import React, { useState } from 'react';
import {
  User,
  FolderGit2,
  History,
  Award,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { SiteProfile, ProjectItem, TimelineItem, SkillItem, ActiveTab } from '../../types';
import { logoutUser } from '../../lib/firebase';
import { AdminProfileTab } from './AdminProfileTab';
import { AdminProjectsTab } from './AdminProjectsTab';
import { AdminTimelineTab } from './AdminTimelineTab';
import { AdminSkillsTab } from './AdminSkillsTab';

interface AdminDashboardProps {
  profile: SiteProfile;
  projects: ProjectItem[];
  timeline: TimelineItem[];
  skills: SkillItem[];
  currentUserEmail: string;
  onProfileUpdated: (p: SiteProfile) => void;
  onProjectsUpdated: (list: ProjectItem[]) => void;
  onTimelineUpdated: (list: TimelineItem[]) => void;
  onSkillsUpdated: (list: SkillItem[]) => void;
  onNavigateHome: () => void;
  showToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profile,
  projects,
  timeline,
  skills,
  currentUserEmail,
  onProfileUpdated,
  onProjectsUpdated,
  onTimelineUpdated,
  onSkillsUpdated,
  onNavigateHome,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('info', '已成功登出管理員帳號');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navTabs = [
    { id: 'profile', label: '基本資料', icon: User },
    { id: 'projects', label: '專題作品', icon: FolderGit2, badge: projects.length },
    { id: 'timeline', label: '學習歷程', icon: History, badge: timeline.length },
    { id: 'skills', label: '技能專長', icon: Award, badge: skills.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                學習歷程管理後台
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentUserEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              id="admin-preview-site-btn"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>瀏覽公開網站</span>
            </button>

            <button
              type="button"
              id="admin-logout-btn"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200/80"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">登出</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`admin-nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 bg-white md:bg-transparent rounded-2xl md:rounded-none p-4 sm:p-6 md:p-0">
          {activeTab === 'profile' && (
            <AdminProfileTab
              profile={profile}
              onProfileUpdated={onProfileUpdated}
              showToast={showToast}
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjectsTab
              projects={projects}
              onProjectsUpdated={onProjectsUpdated}
              showToast={showToast}
            />
          )}

          {activeTab === 'timeline' && (
            <AdminTimelineTab
              timeline={timeline}
              onTimelineUpdated={onTimelineUpdated}
              showToast={showToast}
            />
          )}

          {activeTab === 'skills' && (
            <AdminSkillsTab
              skills={skills}
              onSkillsUpdated={onSkillsUpdated}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};
