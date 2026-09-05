import React from 'react';
import { CalculationResult, SalaryHistory, ArticlesRegulation } from '../types';
import { formatCurrency, formatKoreanWon } from '../utils/taxCalculator';
import { Calculator, ArrowDown, FileCheck, AlertTriangle, ShieldCheck, Scale, BarChart3 } from 'lucide-react';

interface CalculationBreakdownProps {
  result: CalculationResult;
  salaryHistory: SalaryHistory;
  articlesRegulation: ArticlesRegulation;
}

export const CalculationBreakdown: React.FC<CalculationBreakdownProps> = ({
  result,
  salaryHistory,
  articlesRegulation,
}) => {
  return (
    <section>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              세부 산출 공식 검토
            </h3>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-md px-2.5 py-0.5">
              소득세법 제22조 적용
            </span>
          </div>

          <div className="space-y-3.5">
            {/* 1. 퇴직소득세 한도 계산 공식 */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">1. 퇴직소득세 법정한도 계산 공식</div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">2020년 이후 귀속분 (2.0배)</span>
              </div>
              <div className="text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-md text-slate-800 dark:text-slate-200 font-semibold">
                (퇴직 전 3개년 평균급여 × 10%) × (근속년수) × 2.0배
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 pl-1 font-mono leading-relaxed">
                = ({formatCurrency(result.averageAnnualSalary)} × 10%) × {result.serviceYears.toFixed(2)}년 × 2.0 ={' '}
                <span className="font-bold text-purple-700 dark:text-purple-300">{formatCurrency(result.taxLawLimitPay)}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">({formatKoreanWon(result.taxLawLimitPay)})</span>
              </div>
            </div>

            {/* 2. 한도 초과 및 소득 전환 */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">2. 지급액 구성 및 세무 귀속 구분</div>
              
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">사내 규정 총액 ({articlesRegulation.multiple.toFixed(1)}배)</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(result.companySeverancePay)}</span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">소득세법 인정 한도액 (2.0배 분류과세)</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">{formatCurrency(result.retirementIncomeApproved)}</span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className={result.isExceeded ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-300'}>
                  근로소득(상여) 합산 전환액
                </span>
                <span className={`font-bold ${result.isExceeded ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {result.isExceeded ? formatCurrency(result.earnedIncomeConverted) : '0원 (한도 내)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <span>법인세 손금산입 적격 금액</span>
                <span>{formatCurrency(result.corporateTaxDeductible)}</span>
              </div>
            </div>

            {/* Visual Portfolio Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
                <span>과세 포트폴리오 비중</span>
                <span>
                  퇴직소득 {Math.round((result.retirementIncomeApproved / (result.companySeverancePay || 1)) * 100)}%
                  {result.isExceeded && ` · 근로소득 ${Math.round((result.earnedIncomeConverted / (result.companySeverancePay || 1)) * 100)}%`}
                </span>
              </div>
              <div className="w-full h-5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 flex items-center overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, Math.round((result.retirementIncomeApproved / (result.companySeverancePay || 1)) * 100))}%`,
                  }}
                  className="h-full bg-purple-600 rounded transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold"
                >
                  퇴직소득 ({Math.min(100, Math.round((result.retirementIncomeApproved / (result.companySeverancePay || 1)) * 100))}%)
                </div>
                {result.isExceeded && (
                  <div
                    style={{
                      width: `${Math.max(0, 100 - Math.round((result.retirementIncomeApproved / (result.companySeverancePay || 1)) * 100))}%`,
                    }}
                    className="h-full bg-rose-500 rounded transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold"
                  >
                    근로소득
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>근속기간: {result.serviceYearsDisplay}</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">소득세법 제22조 및 시행령 제40조 준수</span>
        </div>
      </div>
    </section>
  );
};
