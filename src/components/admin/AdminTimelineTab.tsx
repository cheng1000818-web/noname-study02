import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown, History, Loader2 } from 'lucide-react';
import { TimelineItem } from '../../types';
import { saveTimelineItem, deleteTimelineItem } from '../../lib/firebase';
import { ConfirmDialog } from './ConfirmDialog';

interface AdminTimelineTabProps {
  timeline: TimelineItem[];
  onTimelineUpdated: (newTimeline: TimelineItem[]) => void;
  showToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const AdminTimelineTab: React.FC<AdminTimelineTabProps> = ({
  timeline,
  onTimelineUpdated,
  showToast,
}) => {
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleStartCreate = () => {
    const nextOrder = timeline.length > 0 ? Math.max(...timeline.map((t) => t.order || 0)) + 1 : 1;
    setEditingItem({
      id: `timeline_${Date.now()}`,
      year: '2026',
      title: '',
      description: '',
      category: '學習里程碑',
      order: nextOrder,
    });
    setIsNew(true);
  };

  const handleStartEdit = (item: TimelineItem) => {
    setEditingItem({ ...item });
    setIsNew(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) {
      showToast('error', '請輸入時間軸事件標題');
      return;
    }

    setSaving(true);
    try {
      await saveTimelineItem(editingItem);
      let updated: TimelineItem[];
      if (isNew) {
        updated = [...timeline, editingItem];
      } else {
        updated = timeline.map((t) => (t.id === editingItem.id ? editingItem : t));
      }
      updated.sort((a, b) => (a.order || 0) - (b.order || 0));
      onTimelineUpdated(updated);
      showToast('success', '學習歷程時間軸已更新');
      setEditingItem(null);
      setIsNew(false);
    } catch (err) {
      console.error('Save timeline error:', err);
      showToast('error', '儲存時間軸失敗');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteTimelineItem(deleteTargetId);
      const updated = timeline.filter((t) => t.id !== deleteTargetId);
      onTimelineUpdated(updated);
      showToast('success', '已刪除該時間軸節點');
      if (editingItem?.id === deleteTargetId) {
        setEditingItem(null);
      }
    } catch (err) {
      showToast('error', '刪除失敗');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= timeline.length) return;

    const newTimeline = [...timeline];
    const temp = newTimeline[index];
    newTimeline[index] = newTimeline[targetIndex];
    newTimeline[targetIndex] = temp;

    newTimeline.forEach((t, idx) => {
      t.order = idx + 1;
    });

    onTimelineUpdated(newTimeline);

    try {
      await Promise.all([
        saveTimelineItem(newTimeline[index]),
        saveTimelineItem(newTimeline[targetIndex]),
      ]);
    } catch (err) {
      console.warn('Reorder save error:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">學習歷程時間軸管理</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            記錄從入門到進階的重要事件、競賽、專案與未來目標。
          </p>
        </div>
        {!editingItem && (
          <button
            type="button"
            id="admin-add-timeline-btn"
            onClick={handleStartCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新增時間軸事件</span>
          </button>
        )}
      </div>

      {/* Editing Form */}
      {editingItem && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-6 border border-sky-200 shadow-md space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              {isNew ? '新增時間軸事件' : '編輯時間軸事件'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                年份 / 時間標籤 (如: 2026 或 未來) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="year"
                required
                value={editingItem.year}
                onChange={handleChange}
                placeholder="2026"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                分類標籤
              </label>
              <input
                type="text"
                name="category"
                value={editingItem.category || ''}
                onChange={handleChange}
                placeholder="例如：AI 應用、實作競賽"
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
                value={editingItem.order}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              事件名稱 (Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={editingItem.title}
              onChange={handleChange}
              placeholder="例如：第一次學習程式設計"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              事件詳情說明 (Description)
            </label>
            <textarea
              name="description"
              rows={3}
              value={editingItem.description}
              onChange={handleChange}
              placeholder="簡要描述此時期的學習動機、成果或心境變化..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
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
              <span>儲存時間軸</span>
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {timeline.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 font-bold text-xs shrink-0 mt-0.5">
                {item.year}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  {item.category && (
                    <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200 mr-2">
                <button
                  type="button"
                  onClick={() => handleMoveOrder(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveOrder(idx, 'down')}
                  disabled={idx === timeline.length - 1}
                  className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleStartEdit(item)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 inline-flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3 text-sky-600" />
                <span>編輯</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteTargetId(item.id)}
                className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 inline-flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>刪除</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="確定要刪除這個時間軸事件嗎？"
        message="刪除後將從 Firestore 永久移除。"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
