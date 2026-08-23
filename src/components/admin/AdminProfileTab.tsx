import React, { useState, useRef } from 'react';
import {
  Save,
  Upload,
  Trash2,
  User,
  GraduationCap,
  Sparkles,
  Compass,
  BookOpen,
  Target,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { SiteProfile } from '../../types';
import { updateProfile } from '../../lib/firebase';
import { compressImageFile } from '../../lib/imageCompressor';

interface AdminProfileTabProps {
  profile: SiteProfile;
  onProfileUpdated: (newProfile: SiteProfile) => void;
  showToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const AdminProfileTab: React.FC<AdminProfileTabProps> = ({
  profile,
  onProfileUpdated,
  showToast,
}) => {
  const [formData, setFormData] = useState<SiteProfile>(profile);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const result = await compressImageFile(file);
      setFormData((prev) => ({ ...prev, avatarUrl: result.dataUrl }));
      showToast('success', `圖片已成功優化處理 (${result.sizeInKB} KB)`);
    } catch (err: unknown) {
      showToast('error', (err as Error).message || '圖片壓縮失敗');
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      onProfileUpdated(formData);
      showToast('success', '個人基本資料已成功儲存至 Firestore！');
    } catch (err: unknown) {
      console.error('Save profile error:', err);
      showToast('error', '儲存失敗，請確認管理員權限與網路連線。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">基本資料與自我介紹</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            修改後點擊儲存，前台網站將同步即時更新。
          </p>
        </div>
        <button
          type="submit"
          id="admin-save-profile-btn"
          disabled={saving || compressing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>儲存基本資料</span>
        </button>
      </div>

      {/* Avatar / Photo Upload */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-sky-600" />
          <span>個人照片 (限 1 張，瀏覽器端自動壓縮 WebP)</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Preview */}
          <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative shrink-0">
            {formData.avatarUrl ? (
              <img
                src={formData.avatarUrl}
                alt="個人照片預覽"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
            {compressing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="space-y-2 text-center sm:text-left">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
              id="avatar-file-input"
            />
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                id="admin-upload-avatar-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={compressing}
                className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>選擇照片上傳</span>
              </button>
              {formData.avatarUrl && (
                <button
                  type="button"
                  id="admin-remove-avatar-btn"
                  onClick={handleRemoveAvatar}
                  className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>移除照片</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              自動優化至 1200px 內，壓縮控制於 400KB 內安全儲存於 Firestore。
            </p>
          </div>
        </div>
      </div>

      {/* Basic Identity Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-sky-600" />
          <span>核心身分資訊</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              姓名 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="input-profile-name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：黃品澄"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              學校 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="school"
              id="input-profile-school"
              required
              value={formData.school}
              onChange={handleChange}
              placeholder="例如：家齊高中"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              年級 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="grade"
              id="input-profile-grade"
              required
              value={formData.grade}
              onChange={handleChange}
              placeholder="例如：高一"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              一句自我介紹 (Hero Slogan) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="slogan"
              id="input-profile-slogan"
              required
              value={formData.slogan}
              onChange={handleChange}
              placeholder="例如：運用科技融入生活"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              我的興趣
            </label>
            <input
              type="text"
              name="interests"
              id="input-profile-interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="例如：打棒球、科技探索"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Detailed Bio & Learning Statements */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>「關於我」詳細內容</span>
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            完整自我介紹 (Bio)
          </label>
          <textarea
            name="bio"
            id="input-profile-bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="請輸入關於您的完整自我介紹..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>學習方向</span>
          </label>
          <textarea
            name="learningDirection"
            id="input-profile-learning-direction"
            rows={3}
            value={formData.learningDirection}
            onChange={handleChange}
            placeholder="例如：專注於人工智慧應用、硬體控制與現代 Web 開發..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>目前正在學習的內容</span>
          </label>
          <textarea
            name="currentLearning"
            id="input-profile-current-learning"
            rows={3}
            value={formData.currentLearning}
            onChange={handleChange}
            placeholder="例如：深入學習 Python 程式設計、機器學習基礎演算法..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-sky-600" />
            <span>未來想挑戰的事情</span>
          </label>
          <textarea
            name="futureGoals"
            id="input-profile-future-goals"
            rows={3}
            value={formData.futureGoals}
            onChange={handleChange}
            placeholder="例如：結合運動科學與 AI 影像辨識技術進行專題研究..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>
      </div>
    </form>
  );
};
