import React from 'react';
import { FileSpreadsheet, Printer, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onLoadScenario: (scenario: 'standard3x' | 'safe2x' | 'high4x') => void;
  onOpenPrint: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadScenario,
  onOpenPrint,
  onOpenGuide,
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

        {/* Preset scenario toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> 시나리오:
          </span>
          <button
            type="button"
            onClick={() => onLoadScenario('standard3x')}
            className="neu-btn px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300"
            title="대표이사 3.0배수 (한도 초과 검토 사례)"
          >
            표준 3.0배
          </button>
          <button
            type="button"
            onClick={() => onLoadScenario('safe2x')}
            className="neu-btn px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400"
            title="소득세법 한도 준수 2.0배 (전액 퇴직소득 인정)"
          >
            한도내 2.0배
          </button>
          <button
            type="button"
            onClick={() => onLoadScenario('high4x')}
            className="neu-btn px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400"
            title="장기근속 4.0배수 (고율 초과 사례)"
          >
            고율 4.0배
          </button>
        </div>

        {/* Guide button */}
        <button
          type="button"
          onClick={onOpenGuide}
          className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
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
