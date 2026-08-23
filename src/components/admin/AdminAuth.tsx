import React, { useState } from 'react';
import { ShieldCheck, LogIn, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { loginWithGoogle, logoutUser } from '../../lib/firebase';
import { ADMIN_EMAIL } from '../../lib/initialData';

interface AdminAuthProps {
  onNavigateHome: () => void;
  currentUserEmail: string | null;
  isAdmin: boolean;
  onLoginSuccess: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  onNavigateHome,
  currentUserEmail,
  isAdmin,
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithGoogle();
      if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setErrorMsg(`此帳號 (${user.email}) 沒有網站管理權限。請使用管理員 Google 帳號 (${ADMIN_EMAIL}) 登入。`);
      } else {
        onLoginSuccess();
      }
    } catch (err: unknown) {
      console.error('Google Sign-in error:', err);
      setErrorMsg((err as Error).message || 'Google 登入失敗，請確認網路連線或稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    await logoutUser();
    setErrorMsg(null);
  };

  // Case 1: User is logged in but is NOT an admin
  if (currentUserEmail && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            沒有管理權限
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            目前登入的帳號為：
            <span className="font-semibold text-slate-800 block mt-1 break-all">
              {currentUserEmail}
            </span>
            <span className="text-rose-600 block mt-2 text-xs">
              此帳號沒有網站管理權限。僅限管理員帳號 ({ADMIN_EMAIL}) 可進行修改。
            </span>
          </p>

          <div className="space-y-3">
            <button
              type="button"
              id="admin-switch-account-btn"
              onClick={handleSwitchAccount}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-200 cursor-pointer"
            >
              切換其他 Google 帳號
            </button>
            <button
              type="button"
              id="admin-unauth-back-home-btn"
              onClick={onNavigateHome}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors cursor-pointer"
            >
              返回公開首頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Not logged in
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 border border-blue-100 shadow-2xs">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
          學習歷程管理後台
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          請使用指定的 Google 管理員帳號登入，以管理與更新個人學習歷程資料。
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs text-left flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <button
          type="button"
          id="admin-google-login-btn"
          onClick={handleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {/* Google G Logo Vector */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>使用 Google 帳號登入</span>
            </>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
          <button
            type="button"
            id="admin-back-to-home-link"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回公開首頁</span>
          </button>
        </div>
      </div>
    </div>
  );
};
