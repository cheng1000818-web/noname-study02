import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Award, Loader2 } from 'lucide-react';
import { SkillItem } from '../../types';
import { saveSkillItem, deleteSkillItem } from '../../lib/firebase';
import { ConfirmDialog } from './ConfirmDialog';

interface AdminSkillsTabProps {
  skills: SkillItem[];
  onSkillsUpdated: (newSkills: SkillItem[]) => void;
  showToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const AdminSkillsTab: React.FC<AdminSkillsTabProps> = ({
  skills,
  onSkillsUpdated,
  showToast,
}) => {
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleStartCreate = () => {
    const nextOrder = skills.length > 0 ? Math.max(...skills.map((s) => s.order || 0)) + 1 : 1;
    setEditingSkill({
      id: `skill_${Date.now()}`,
      name: '',
      category: '核心技術',
      description: '',
      order: nextOrder,
    });
    setIsNew(true);
  };

  const handleStartEdit = (skill: SkillItem) => {
    setEditingSkill({ ...skill });
    setIsNew(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingSkill) return;
    const { name, value } = e.target;
    setEditingSkill((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) {
      showToast('error', '請輸入技能名稱');
      return;
    }

    setSaving(true);
    try {
      await saveSkillItem(editingSkill);
      let updated: SkillItem[];
      if (isNew) {
        updated = [...skills, editingSkill];
      } else {
        updated = skills.map((s) => (s.id === editingSkill.id ? editingSkill : s));
      }
      updated.sort((a, b) => (a.order || 0) - (b.order || 0));
      onSkillsUpdated(updated);
      showToast('success', '技能專長已更新');
      setEditingSkill(null);
      setIsNew(false);
    } catch (err) {
      console.error('Save skill error:', err);
      showToast('error', '儲存技能失敗');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteSkillItem(deleteTargetId);
      const updated = skills.filter((s) => s.id !== deleteTargetId);
      onSkillsUpdated(updated);
      showToast('success', '已刪除該技能標籤');
      if (editingSkill?.id === deleteTargetId) {
        setEditingSkill(null);
      }
    } catch (err) {
      showToast('error', '刪除技能失敗');
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">技能專長標籤管理</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            分類管理核心技術、實作專長、運動與個人特質等技能。
          </p>
        </div>
        {!editingSkill && (
          <button
            type="button"
            id="admin-add-skill-btn"
            onClick={handleStartCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新增技能專長</span>
          </button>
        )}
      </div>

      {/* Editing Form */}
      {editingSkill && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-6 border border-sky-200 shadow-md space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              {isNew ? '新增技能' : '編輯技能'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                技能名稱 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={editingSkill.name}
                onChange={handleChange}
                placeholder="例如：AI 與智慧應用"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                技能類別
              </label>
              <input
                type="text"
                name="category"
                value={editingSkill.category}
                onChange={handleChange}
                placeholder="例如：核心技術、實作專長、軟實力"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                排序 (Order)
              </label>
              <input
                type="number"
                name="order"
                value={editingSkill.order}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              補充說明 / 具體範疇
            </label>
            <input
              type="text"
              name="description"
              value={editingSkill.description || ''}
              onChange={handleChange}
              placeholder="例如：Prompt Engineering、Gemini API 應用、基礎機器學習概念"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-xl shadow-xs inline-flex items-center gap-1.5"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>儲存技能</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid of skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 text-sm">{skill.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-medium">
                  {skill.category}
                </span>
              </div>
              {skill.description && (
                <p className="text-xs text-slate-500 line-clamp-1">{skill.description}</p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleStartEdit(skill)}
                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTargetId(skill.id)}
                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="確定要刪除這個技能嗎？"
        message="刪除後將從前台技能專長列表中移除。"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
