import React, { useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { SiteProfile, ProjectItem, TimelineItem, SkillItem, ToastMessage } from './types';
import {
  getProfile,
  getProjects,
  getTimeline,
  getSkills,
  subscribeAuthState,
} from './lib/firebase';
import { ADMIN_EMAIL, INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_TIMELINE, INITIAL_SKILLS } from './lib/initialData';

// Public Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TimelineSection } from './components/TimelineSection';
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';

// Admin Components
import { AdminAuth } from './components/admin/AdminAuth';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/Toast';

export default function App() {
  // Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Data State
  const [profile, setProfile] = useState<SiteProfile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [timeline, setTimeline] = useState<TimelineItem[]>(INITIAL_TIMELINE);
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (type: 'success' | 'error' | 'info', text: string) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, text }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync Path changes with browser history
  const navigate = useCallback((newPath: string) => {
    window.history.pushState({}, '', newPath);
    setCurrentPath(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeAuthState((user) => {
      setCurrentUser(user);
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore Data on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [profileData, projectsData, timelineData, skillsData] =
          await Promise.all([
            getProfile(),
            getProjects(),
            getTimeline(),
            getSkills(),
          ]);

        if (isMounted) {
          if (profileData) setProfile(profileData);
          if (projectsData && projectsData.length > 0) setProjects(projectsData);
          if (timelineData && timelineData.length > 0) setTimeline(timelineData);
          if (skillsData && skillsData.length > 0) setSkills(skillsData);
          setDataLoaded(true);
        }
      } catch (err) {
        console.warn('Initial data load warning:', err);
        if (isMounted) setDataLoaded(true);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Is Admin Check
  const isAdmin = Boolean(
    currentUser &&
      currentUser.email &&
      currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/');

  // Initial Data Loading Screen
  if (!dataLoaded || !authInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">載入個人學習歷程中...</p>
        </div>
      </div>
    );
  }

  // ================= ADMIN VIEW (/admin) =================
  if (isAdminRoute) {
    return (
      <div id="admin-root-container">
        {isAdmin && currentUser?.email ? (
          <AdminDashboard
            profile={profile}
            projects={projects}
            timeline={timeline}
            skills={skills}
            currentUserEmail={currentUser.email}
            onProfileUpdated={(p) => setProfile(p)}
            onProjectsUpdated={(list) => setProjects(list)}
            onTimelineUpdated={(list) => setTimeline(list)}
            onSkillsUpdated={(list) => setSkills(list)}
            onNavigateHome={() => navigate('/')}
            showToast={showToast}
          />
        ) : (
          <AdminAuth
            onNavigateHome={() => navigate('/')}
            currentUserEmail={currentUser?.email || null}
            isAdmin={isAdmin}
            onLoginSuccess={() => {
              showToast('success', '管理員驗證成功！');
            }}
          />
        )}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // ================= PUBLIC VIEW (/) =================
  // Notice: Absolutely clean visitor portfolio view with ZERO admin UI
  return (
    <div id="public-portfolio-root" className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <Navbar profile={profile} />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <ProjectsSection projects={projects} />
        <TimelineSection timeline={timeline} />
        <SkillsSection skills={skills} />
      </main>

      {/* Footer */}
      <Footer profile={profile} />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
