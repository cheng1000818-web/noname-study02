import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Tag,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Video,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';
import { ProjectItem, ProjectImage } from '../types';
import { parseGoogleDriveUrl } from '../lib/driveParser';
import { getProjectImages } from '../lib/firebase';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;

    let isMounted = true;
    setLoadingImages(true);

    getProjectImages(project.id)
      .then((imgs) => {
        if (isMounted) {
          setProjectImages(imgs);
          setLoadingImages(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingImages(false);
      });

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeImagePreview) {
          setActiveImagePreview(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, activeImagePreview, onClose]);

  if (!project) return null;

  const driveVideo = parseGoogleDriveUrl(project.videoUrl);

  // Combine cover image and project images if available
  const allImages = [
    ...(project.coverImage ? [{ dataUrl: project.coverImage, caption: '封面照片', id: 'cover' }] : []),
    ...projectImages,
  ];

  return (
    <div
      id="project-detail-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id={`project-detail-modal-${project.id}`}
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-4 border-b border-slate-100 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
              {project.category || '專案作品'}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              {project.date || '2025'}
            </span>
          </div>
          <button
            type="button"
            id="close-project-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title & Summary */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
              {project.title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-blue-50/40 p-5 rounded-2xl border border-blue-50">
              {project.summary}
            </p>
          </div>

          {/* Google Drive Video Section */}
          {project.videoUrl && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Video className="w-4 h-4 text-blue-600" />
                <span>專案展示影片</span>
              </div>
              {driveVideo.isValid && driveVideo.embedUrl ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
                  <iframe
                    id="project-drive-video-iframe"
                    src={driveVideo.embedUrl}
                    title={`${project.title} 影片展示`}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">無法載入影片預覽</p>
                    <p className="text-xs text-amber-700 mt-1">
                      {driveVideo.errorMessage || '請確認分享連結是否已開啟權限'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Project Images Gallery (Max 3 + cover) */}
          {allImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>成果展示相簿 ({allImages.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {allImages.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 cursor-pointer shadow-xs"
                    onClick={() => setActiveImagePreview(img.dataUrl)}
                  >
                    <img
                      src={img.dataUrl}
                      alt={`成果展示 ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 text-white bg-slate-900/80 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>放大預覽</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Project Content */}
          {project.content && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>完整作品內容</span>
              </div>
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-white p-5 rounded-2xl border border-slate-200">
                {project.content}
              </div>
            </div>
          )}

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Challenge */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>製作過程遭遇問題</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {project.challenge || '在整合過程中克服各項技術困難與邏輯盲點。'}
              </p>
            </div>

            {/* Solution */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>我是如何解決問題</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {project.solution || '透過查閱文獻、反覆除錯測試與向師長同儕請益解決。'}
              </p>
            </div>
          </div>

          {/* Reflection */}
          {project.reflection && (
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>學習反思與總結</span>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.reflection}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            id="modal-bottom-close-btn"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-200 transition-all cursor-pointer"
          >
            關閉詳細內容
          </button>
        </div>
      </div>

      {/* Lightbox / Zoomed Image Overlay */}
      {activeImagePreview && (
        <div
          id="image-lightbox-overlay"
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveImagePreview(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImagePreview(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImagePreview}
            alt="放大預覽"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
