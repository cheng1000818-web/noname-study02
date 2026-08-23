import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, User, FolderGit2, History, Award } from 'lucide-react';
import { SiteProfile } from '../types';

interface NavbarProps {
  profile: SiteProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['skills', 'timeline', 'projects', 'about', 'hero'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首頁', href: '#hero', sectionId: 'hero', icon: BookOpen },
    { name: '關於我', href: '#about', sectionId: 'about', icon: User },
    { name: '專題作品', href: '#projects', sectionId: 'projects', icon: FolderGit2 },
    { name: '學習歷程', href: '#timeline', sectionId: 'timeline', icon: History },
    { name: '我的技能', href: '#skills', sectionId: 'skills', icon: Award },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100 py-3'
          : 'bg-white/80 backdrop-blur-xs border-b border-blue-50/70 py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          id="nav-brand-link"
          href="#hero"
          onClick={(e) => handleScrollTo(e, '#hero')}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold italic shadow-md shadow-blue-200 group-hover:bg-blue-600 transition-all">
            PC
          </div>
          <div>
            <div className="font-bold text-slate-800 text-base leading-tight tracking-tight">
              {profile.name || '黃品澄'}{' '}
              <span className="text-blue-500 font-semibold text-sm">Portfolio</span>
            </div>
            <div className="text-[11px] text-blue-600 font-medium">
              {profile.school || '家齊高中'} • 學生學習歷程
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav id="desktop-nav-menu" className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <a
                  key={link.name}
                  id={`nav-link-${link.name}`}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`py-1 transition-all ${
                    isActive
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                      : 'hover:text-blue-600 text-slate-600'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          <a
            id="nav-cta-explore-projects"
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300"
          >
            瀏覽作品
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          id="mobile-menu-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-white border-b border-blue-100 px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.sectionId;
              return (
                <a
                  key={link.name}
                  id={`mobile-nav-link-${link.name}`}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-blue-400'}`} />
                  {link.name}
                </a>
              );
            })}
            <a
              id="mobile-nav-cta-projects"
              href="#projects"
              onClick={(e) => handleScrollTo(e, '#projects')}
              className="mt-3 text-center w-full py-3 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-md shadow-blue-200"
            >
              瀏覽全部作品
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
