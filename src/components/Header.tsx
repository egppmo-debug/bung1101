import React from 'react';
import { FileSpreadsheet, Printer, BookOpen, ShieldCheck, Sparkles, FolderOpen, RotateCcw, Save } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenPrint: () => void;
  onOpenGuide: () => void;
  onReset: () => void;
  onSave: () => void;
  onOpenSavedList?: () => void;
  savedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrint,
  onOpenGuide,
  onReset,
  onSave,
  onOpenSavedList,
  savedCount = 0,
}) => {
  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 mb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
      {/* Title and Branding with Hanwha People Life Purple Logo */}
      <div className="flex items-center gap-3.5">
        <CompanyLogo size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2.5 py-0.5 rounded-md">
              한화피플라이프 대전글로리사업단
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            임원 퇴직금 계산기
          </h1>
        </div>
      </div>

      {/* Header Badges & Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
        {/* Branch affiliation badge */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-purple-800 dark:text-purple-300 rounded-lg hidden sm:flex items-center gap-1.5 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          대전글로리사업단 전용
        </div>

        {/* Data Actions: [리셋], [저장], [저장함] */}
        <div className="flex items-center gap-1.5">
          {/* 리셋 버튼 */}
          <button
            type="button"
            onClick={onReset}
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            title="모든 입력란 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            리셋
          </button>

          {/* 저장 버튼 */}
          <button
            type="button"
            onClick={onSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            title="현재 계산 데이터 저장"
          >
            <Save className="w-3.5 h-3.5" />
            저장
          </button>

          {/* 저장함 버튼 */}
          {onOpenSavedList && (
            <button
              type="button"
              onClick={onOpenSavedList}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="저장된 계산 목록 확인"
            >
              <FolderOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              저장함
              {savedCount > 0 && (
                <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                  {savedCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Guide button */}
        <button
          type="button"
          onClick={onOpenGuide}
          className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          세무 가이드
        </button>

        {/* Dark Mode Toggle */}
        <ThemeToggle />

        {/* Print report button */}
        <button
          type="button"
          onClick={onOpenPrint}
          className="btn-primary px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          상세 리포트 PDF
        </button>
      </div>
    </header>
  );
};
