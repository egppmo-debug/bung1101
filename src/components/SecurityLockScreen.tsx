import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Delete,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { AppLockConfig } from '../types';

interface SecurityLockScreenProps {
  lockConfig: AppLockConfig | null;
  onUnlock: (pin: string) => boolean;
  onOpenAdminModal: () => void;
  isLoading: boolean;
}

export const SecurityLockScreen: React.FC<SecurityLockScreenProps> = ({
  lockConfig,
  onUnlock,
  onOpenAdminModal,
  isLoading,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear error when user types
  useEffect(() => {
    if (errorMsg) setErrorMsg(null);
  }, [pin]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('비밀번호를 입력해 주십시오.');
      return;
    }

    const success = onUnlock(pin.trim());
    if (!success) {
      setErrorMsg('비밀번호가 일치하지 않습니다. 사업단장님께 문의하세요.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'clear') {
      setPin('');
    } else if (val === 'backspace') {
      setPin((prev) => prev.slice(0, -1));
    } else {
      if (pin.length < 16) {
        const next = pin + val;
        setPin(next);
        // Auto unlock if matches accessPin
        if (lockConfig && next === lockConfig.accessPin) {
          setTimeout(() => {
            onUnlock(next);
          }, 80);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#0a0f1d] overflow-y-auto min-h-screen selection:bg-orange-500 selection:text-white">
      {/* Top Banner outside card */}
      <div className="mb-4 flex items-center gap-2 text-slate-400 text-xs tracking-wider uppercase font-semibold">
        <Shield className="w-4 h-4 text-orange-500 shrink-0" />
        <span>HANWHA PEOPLELIFE CORPORATE CONSULTING SECURITY</span>
      </div>

      {/* Main Dark Navy Card */}
      <div
        className={`w-full max-w-[430px] bg-[#121c2e] rounded-2xl shadow-2xl border border-[#1e2d42] p-6 sm:p-7 space-y-5 transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Card Header with Hanwha Orange Logo */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-3.5 mb-3">
            {/* Hanwha Flame Icon */}
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-none stroke-white" strokeWidth="6">
                <circle cx="50" cy="50" r="32" strokeDasharray="140 30" strokeLinecap="round" />
                <circle cx="46" cy="46" r="22" strokeDasharray="100 20" strokeLinecap="round" />
                <circle cx="43" cy="43" r="12" strokeDasharray="60 15" strokeLinecap="round" />
              </svg>
            </div>

            {/* Hanwha People Life & Daejeon Glory Badge */}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white tracking-tight">
                  한화피플라이프
                </span>
                <span className="text-[11px] font-bold text-orange-400 border border-orange-500/70 bg-orange-950/40 px-2 py-0.5 rounded-md">
                  대전글로리사업단
                </span>
              </div>
              <div className="text-sm font-bold text-slate-300 mt-0.5">
                임원 퇴직금 계산기
              </div>
            </div>
          </div>

          {/* Subtitle Notice */}
          <div className="text-xs text-slate-400 leading-relaxed max-w-xs mt-1">
            <p>본 시스템은 사업단 내부 전용 솔루션입니다.</p>
            <p>접근을 위해 보안 비밀번호(PIN)를 입력해 주세요.</p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-3 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Input Box */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-200">보안 비밀번호</span>
              <span className="text-[11px] text-slate-400 font-normal">
                숫자 또는 문자 입력 가능
              </span>
            </div>

            <div className="relative flex items-center bg-[#0b1320] border border-[#1e2d42] focus-within:border-orange-500 rounded-xl px-3.5 py-2.5 transition-colors">
              <KeyRound className="w-4 h-4 text-orange-500 shrink-0 mr-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="비밀번호 입력"
                autoFocus
                className="w-full bg-transparent text-white placeholder:text-slate-500 font-mono tracking-wider text-sm outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                title={showPassword ? '비밀번호 숨김' : '비밀번호 표시'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Virtual Touch Keypad for Mobile FA */}
          <div>
            <div className="text-xs text-slate-400 font-medium mb-2">
              간편 터치 키패드 (스마트폰용)
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '취소(C)', '0', 'delete'].map((k) => {
                const isCancel = k === '취소(C)';
                const isDelete = k === 'delete';
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      if (isCancel) handleKeypadPress('clear');
                      else if (isDelete) handleKeypadPress('backspace');
                      else handleKeypadPress(k);
                    }}
                    className="h-12 bg-[#223047] hover:bg-[#2c3d59] active:bg-[#1a2638] text-white font-bold text-base rounded-xl transition-all flex items-center justify-center shadow-xs cursor-pointer border border-[#2c3d59]/40 active:scale-95"
                  >
                    {isDelete ? (
                      <Delete className="w-5 h-5 text-slate-300" />
                    ) : isCancel ? (
                      <span className="text-xs text-slate-300 font-medium">취소(C)</span>
                    ) : (
                      k
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Big Orange Unlock Button */}
          <button
            type="submit"
            disabled={isLoading || !pin.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Unlock className="w-4 h-4" />
            <span>솔루션 잠금 해제</span>
          </button>
        </form>

        {/* Discreet Admin Entrance */}
        <div className="pt-2 border-t border-[#1a2638] flex items-center justify-between text-[11px] text-slate-500">
          <span>대전글로리사업단 중앙 클라우드 실시간 연동</span>
          <button
            type="button"
            onClick={onOpenAdminModal}
            className="text-slate-400 hover:text-orange-400 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>관리자 통제 센터</span>
          </button>
        </div>
      </div>

      {/* Bottom Copyright matching Image 1 */}
      <div className="mt-4 text-center text-[11px] text-slate-500">
        © Hanwha PeopleLife Daejeon Glory. Authorized Personnel Only.
      </div>
    </div>
  );
};
