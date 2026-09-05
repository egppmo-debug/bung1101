import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency, formatKoreanWon } from '../utils/taxCalculator';
import { Coins, CheckCircle2, AlertTriangle, Building2, TrendingUp, Info } from 'lucide-react';

interface SummaryDashboardProps {
  result: CalculationResult;
  multiple: number;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ result, multiple }) => {
  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Card 1: 사내 지급 총액 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">사내 지급 총액</span>
          <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(result.companySeverancePay)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {formatKoreanWon(result.companySeverancePay)}
          </span>
        </div>

        {/* Card 2: 퇴직소득 인정액 */}
        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/70 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs bg-gradient-to-b from-purple-50/40 dark:from-purple-950/30 to-white dark:to-slate-900">
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">퇴직소득 인정액</span>
          <span className="text-lg sm:text-2xl font-black text-purple-700 dark:text-purple-300 tracking-tight">
            {formatCurrency(result.retirementIncomeApproved)}
          </span>
          <span className="text-[11px] text-purple-600/80 dark:text-purple-400 mt-1 font-medium">
            세법 한도 내 인정 (2.0배)
          </span>
        </div>

        {/* Card 3: 근로소득 전환액 */}
        <div className={`bg-white dark:bg-slate-900 border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs ${
          result.isExceeded
            ? 'border-rose-200 dark:border-rose-800/70 bg-gradient-to-b from-rose-50/40 dark:from-rose-950/30 to-white dark:to-slate-900'
            : 'border-slate-200 dark:border-slate-800'
        }`}>
          <span className={`text-xs font-semibold mb-1 ${result.isExceeded ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
            근로소득 전환액
          </span>
          <span className={`text-lg sm:text-2xl font-black tracking-tight ${result.isExceeded ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
            {formatCurrency(result.earnedIncomeConverted)}
          </span>
          <span className={`text-[11px] mt-1 font-medium ${result.isExceeded ? 'text-rose-500 dark:text-rose-400/90 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
            {result.isExceeded ? `한도 초과액 (+${result.excessRate}%)` : '한도 내 (초과 없음)'}
          </span>
        </div>

        {/* Card 4: 법인세 손금 인정액 */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/70 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs bg-gradient-to-b from-emerald-50/30 dark:from-emerald-950/30 to-white dark:to-slate-900">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">법인세 손금인정액</span>
          <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(result.corporateTaxDeductible)}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {result.corporateTaxNonDeductible === 0 ? '100% 손금산입 적격' : '일부 손금불산입'}
          </span>
        </div>
      </div>
    </section>
  );
};
