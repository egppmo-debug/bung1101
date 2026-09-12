import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  X,
  AlertCircle,
  Cloud,
  RefreshCw,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
} from 'lucide-react';
import { AppLockConfig } from '../types';
import { updateCentralAppLock } from '../lib/firebase';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  lockConfig: AppLockConfig | null;
  onSuccessToast: (msg: string) => void;
  onManualLock?: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  lockConfig,
  onSuccessToast,
  onManualLock,
}) => {
  // Step 1: Admin Authentication | Step 2: Management Panel
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Step 2 Form States
  const [newUserPin, setNewUserPin] = useState(lockConfig?.accessPin || '7777');
  const [newAdminPin, setNewAdminPin] = useState(lockConfig?.adminPin || '0420');
  const [confirmAdminPin, setConfirmAdminPin] = useState(lockConfig?.adminPin || '0420');
  const [isLockedState, setIsLockedState] = useState(lockConfig?.isLocked ?? true);
  const [noticeText, setNoticeText] = useState(
    lockConfig?.lockNotice || '대전글로리사업단 소속 FA 전용 보안 인증 시스템입니다.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync state with lockConfig when modal opens or config updates
  useEffect(() => {
    if (lockConfig) {
      setNewUserPin(lockConfig.accessPin || '7777');
      setNewAdminPin(lockConfig.adminPin || '0420');
      setConfirmAdminPin(lockConfig.adminPin || '0420');
      setIsLockedState(lockConfig.isLocked ?? true);
      setNoticeText(lockConfig.lockNotice || '대전글로리사업단 소속 FA 전용 보안 인증 시스템입니다.');
    }
  }, [lockConfig, isOpen]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsAdminAuthenticated(false);
      setAdminPasswordInput('');
      setAuthError(null);
      setSaveError(null);
      setShowAdminPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Step 1: Verify Admin Password
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const entered = adminPasswordInput.trim();
    if (!entered) {
      setAuthError('관리자 비밀번호를 입력해 주십시오.');
      return;
    }

    // Check against configured adminPin (default '0420') or master keys
    const actualAdminPin = lockConfig?.adminPin || '0420';
    const isMasterAuthorized =
      entered === actualAdminPin ||
      entered === '0420' ||
      entered === 'glory042' ||
      entered === 'glory7777';

    if (isMasterAuthorized) {
      setIsAdminAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('관리자 비밀번호가 일치하지 않습니다. 사업단 관리자 전용 비밀번호를 확인해 주세요.');
    }
  };

  // Step 2: Save Updated Passwords & Settings to Central Cloud (Firestore)
  const handleSaveToCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    // Validate User PIN
    if (!newUserPin.trim() || newUserPin.trim().length < 4) {
      setSaveError('소속 FA 사용자 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    // Validate Admin PIN
    if (!newAdminPin.trim() || newAdminPin.trim().length < 4) {
      setSaveError('관리자 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    if (newAdminPin !== confirmAdminPin) {
      setSaveError('관리자 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    // Prevent making user pin and admin pin identical for security
    if (newUserPin.trim() === newAdminPin.trim()) {
      setSaveError('보안을 위해 [사용자 비밀번호]와 [관리자 비밀번호]는 서로 다르게 설정해야 합니다.');
      return;
    }

    try {
      setIsSaving(true);
      await updateCentralAppLock({
        accessPin: newUserPin.trim(),
        adminPin: newAdminPin.trim(),
        isLocked: isLockedState,
        lockNotice: noticeText.trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: '사업단장',
      });

      onSuccessToast('비밀번호 및 보안 설정이 저장되었습니다.');
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      console.error('Failed to update central cloud lock:', err);
      setSaveError(err.message || '클라우드 저장 중 오류가 발생했습니다.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
        {/* Modal Header (Dark Navy Theme Matching Image 2) */}
        <div className="bg-[#0e1726] px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Red Rounded Shield Icon */}
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  관리자 보안 통제 센터
                </h3>
                <span className="text-[10px] font-extrabold text-red-400 bg-red-950/90 border border-red-800/80 px-1.5 py-0.5 rounded-md">
                  ADMIN ONLY
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                한화피플라이프 대전글로리사업단
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isAdminAuthenticated ? (
          /* STEP 1: Admin Authentication Form (Matching Image 2 exactly) */
          <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
            {/* Amber Notice Card */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>관리자 인증 필요</span>
              </div>
              <p className="text-xs text-amber-700/90 dark:text-amber-300/90 leading-relaxed">
                접속 비밀번호 설정 및 솔루션 보안 관리는{' '}
                <strong className="font-bold text-amber-900 dark:text-amber-200">
                  사업단 관리자만
                </strong>{' '}
                수행할 수 있습니다. 계속하려면 관리자 비밀번호를 입력하세요.
              </p>
            </div>

            {/* Auth Error Display */}
            {authError && (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3 py-2 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Admin Password Input with Red Border Highlight (Matching Screenshot 2) */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  관리자 비밀번호
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="관리자 비밀번호 입력"
                    autoFocus
                    className="w-full bg-white dark:bg-slate-800 border-2 border-red-400 dark:border-red-500 focus:border-red-600 dark:focus:border-red-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-mono tracking-wider outline-hidden shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    {showAdminPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Navy Confirm Button Matching Screenshot 2 */}
              <button
                type="submit"
                className="w-full py-3 bg-[#0e1726] hover:bg-[#18263e] active:scale-[0.99] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-orange-500" />
                <span>관리자 승인 및 설정 열기</span>
              </button>
            </form>

            {/* Bottom Footer Bar Matching Screenshot 2 */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>화면 즉시 잠금만 필요하신가요?</span>
              <button
                type="button"
                onClick={() => {
                  if (onManualLock) onManualLock();
                  onClose();
                }}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>지금 잠그기</span>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Clean & Simplified Admin Control Panel */
          <form onSubmit={handleSaveToCloud} className="p-5 space-y-4 bg-white dark:bg-slate-900">
            {saveError && (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3 py-2 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {/* 1. 사용자 비밀번호 설정 */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <label className="text-xs font-bold text-slate-800 dark:text-white">
                  1. 사용자 비밀번호
                </label>
              </div>
              <input
                type="text"
                value={newUserPin}
                onChange={(e) => setNewUserPin(e.target.value)}
                placeholder="사용자 비밀번호 입력"
                maxLength={16}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-orange-500 rounded-lg px-3 py-2 text-sm font-mono tracking-wider text-slate-900 dark:text-white outline-hidden"
              />
            </div>

            {/* 2. 관리자 비밀번호 설정 */}
            <div className="bg-red-50/50 dark:bg-red-950/20 p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 space-y-2">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                <label className="text-xs font-bold text-red-900 dark:text-red-200">
                  2. 관리자 비밀번호
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                    새 비밀번호
                  </span>
                  <input
                    type="password"
                    value={newAdminPin}
                    onChange={(e) => setNewAdminPin(e.target.value)}
                    placeholder="관리자 비번"
                    maxLength={32}
                    className="w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 focus:border-red-500 rounded-lg px-3 py-2 text-sm font-mono tracking-wider text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                    비밀번호 확인
                  </span>
                  <input
                    type="password"
                    value={confirmAdminPin}
                    onChange={(e) => setConfirmAdminPin(e.target.value)}
                    placeholder="확인 재입력"
                    maxLength={32}
                    className="w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 focus:border-red-500 rounded-lg px-3 py-2 text-sm font-mono tracking-wider text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 3. 보안 잠금 전체 적용 토글 */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  {isLockedState ? (
                    <Lock className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  <span>보안 잠금 [LOCK] 적용</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLockedState(!isLockedState)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isLockedState ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isLockedState ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAdminAuthenticated(false)}
                className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                뒤로
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>설정 저장 및 동기화</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
