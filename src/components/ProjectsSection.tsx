import React, { useState } from 'react';
import { FolderGit2, Calendar, ArrowUpRight, Filter } from 'lucide-react';
import { ProjectItem } from '../types';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  // Extract unique categories
  const categories = ['全部', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects =
    activeCategory === '全部'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const getGradientForProject = (category?: string, index = 0) => {
    const cat = category || '';
    if (cat.includes('AI') || cat.includes('人工智慧')) return 'from-blue-400 to-blue-600';
    if (cat.includes('機器人') || cat.includes('Robot') || cat.includes('硬體')) return 'from-teal-400 to-teal-600';
    if (cat.includes('自主') || cat.includes('反思') || cat.includes('學習')) return 'from-indigo-400 to-indigo-600';
    if (index % 3 === 0) return 'from-blue-400 to-blue-600';
    if (index % 3 === 1) return 'from-teal-400 to-teal-600';
    return 'from-indigo-400 to-indigo-600';
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100/60">
            <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
            <span>MY PROJECTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            精選專案作品
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            點擊卡片可展開完整專案歷程、遭遇難題、解決方法與成果反思。
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            <div className="flex items-center gap-1 text-xs text-slate-500 mr-2 font-medium">
              <Filter className="w-3.5 h-3.5 text-blue-500" />
              <span>分類篩選：</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                id={`filter-cat-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                    : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 text-slate-500 text-sm shadow-sm">
            目前此分類尚無作品資料
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => {
              const gradientClass = getGradientForProject(project.category, idx);
              return (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
                >
                  {/* Cover Image or Thematic Vibrant Gradient */}
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradientClass} opacity-90 p-6 flex flex-col justify-end text-white relative`}>
                        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                          {project.category || '專案作品'}
                        </span>
                        <h4 className="text-base font-bold text-white line-clamp-1 mt-0.5">
                          {project.title}
                        </h4>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold shadow-xs">
                        {project.category || '專案作品'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs text-slate-700 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-xs">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{project.date || '2025'}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                        {project.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-500 group-hover:text-blue-600">
                      <span>查看完整作品與心得</span>
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};
