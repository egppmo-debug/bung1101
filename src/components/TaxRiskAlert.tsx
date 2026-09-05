import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency, formatKoreanWon } from '../utils/taxCalculator';
import { AlertCircle, CheckCircle2, FileText, ArrowRight, ShieldAlert } from 'lucide-react';

interface TaxRiskAlertProps {
  result: CalculationResult;
  multiple: number;
  hasArticlesRule: boolean;
}

export const TaxRiskAlert: React.FC<TaxRiskAlertProps> = ({
  result,
  multiple,
  hasArticlesRule,
}) => {
  if (result.isExceeded) {
    return (
      <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/70 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-600 dark:bg-rose-500 text-white font-black flex-shrink-0 text-sm">
          !
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
              세무 준수 경고 (소득세법 제22조 한도 초과)
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              +{result.excessRate}% 초과
            </span>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
            소득세법 제22조 한도 초과액 <strong className="text-rose-700 dark:text-rose-400">{formatCurrency(result.excessAmount)}</strong> ({formatKoreanWon(result.excessAmount)}) 발생.
            지급액의 {result.excessRate}%가 퇴직소득이 아닌 <strong className="text-slate-900 dark:text-slate-100">근로소득(상여)</strong>으로 보아 종합소득세가 과세되며 원천징수 분리 신고가 필요합니다.
          </div>
        </div>
        <div className="flex-shrink-0 self-end sm:self-center">
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/80 rounded-lg px-3 py-1.5 text-center">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">추가 세부담 추정</div>
            <div className="text-xs font-black text-rose-600 dark:text-rose-400">
              약 +{formatKoreanWon(result.taxBurdenIncreaseEstimate)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safe case (no excess)
  return (
    <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600 dark:bg-emerald-500 text-white font-black flex-shrink-0 text-sm">
        ✓
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
            세무 적격 안전 상태 (한도 준수)
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            100% 퇴직소득 인정
          </span>
        </div>
        <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
          정관 지급 배수({multiple.toFixed(1)}배)가 법정한도(2.0배) 이하이므로 초과액이 없으며,
          전액 저율 분리과세(퇴직소득세)가 적용되어 세부담이 최적화됩니다.
        </div>
      </div>
      <div className="flex-shrink-0 self-end sm:self-center">
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 rounded-lg px-3 py-1.5 text-center">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">과세 적격성</div>
          <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">전액 손금산입</div>
        </div>
      </div>
    </div>
  );
};
