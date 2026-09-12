import React, { useState } from 'react';
import { CalculationResult, SalaryHistory, ArticlesRegulation } from '../types';
import {
  formatCurrency,
  formatKoreanWon,
  calculateCorporateTax,
  calculateCorporateTaxSavings,
} from '../utils/taxCalculator';
import {
  Calculator,
  ArrowDown,
  FileCheck,
  AlertTriangle,
  ShieldCheck,
  Scale,
  BarChart3,
  TrendingDown,
  Building2,
  Coins,
  CheckCircle2,
  Percent,
} from 'lucide-react';

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
  // 연간 영업이익 기본값 (10억원)
  const [operatingProfit, setOperatingProfit] = useState<number>(1000000000);
  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('visual');

  // 영업이익 프리셋 (억 원 단위)
  const profitPresets = [
    { label: '3억', value: 300000000 },
    { label: '5억', value: 500000000 },
    { label: '10억', value: 1000000000 },
    { label: '15억', value: 1500000000 },
    { label: '20억', value: 2000000000 },
    { label: '30억', value: 3000000000 },
  ];

  // 법인세 절감액 계산
  const savings = calculateCorporateTaxSavings(
    operatingProfit,
    result.corporateTaxDeductible
  );

  // 시뮬레이션 표용 시나리오 목록
  const scenarioProfits = [300000000, 500000000, 1000000000, 1500000000, 2000000000];

  // 시각화 바 비율 계산
  const maxProfit = Math.max(operatingProfit, 1);
  const afterProfitPercent = Math.min(
    100,
    Math.max(0, Math.round((savings.profitAfter / maxProfit) * 100))
  );
  const reductionPercent = Math.min(
    100,
    Math.max(0, 100 - afterProfitPercent)
  );

  const maxTax = Math.max(savings.taxBefore.totalTax, 1);
  const afterTaxPercent = Math.min(
    100,
    Math.max(0, Math.round((savings.taxAfter.totalTax / maxTax) * 100))
  );
  const taxSavedPercent = Math.min(
    100,
    Math.max(0, 100 - afterTaxPercent)
  );

  return (
    <section>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              세부 산출 공식 검토 & 법인세 절감 분석
            </h3>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-md px-2.5 py-0.5">
              소득세법 제22조 & 법인세법 제19조
            </span>
          </div>

          <div className="space-y-4">
            {/* 1. 퇴직소득세 한도 계산 공식 */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  1. 퇴직소득세 법정한도 계산 공식
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  2020년 이후 귀속분 (2.0배)
                </span>
              </div>
              <div className="text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-md text-slate-800 dark:text-slate-200 font-semibold">
                (퇴직 전 3개년 평균급여 × 10%) × (근속년수) × 2.0배
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 pl-1 font-mono leading-relaxed">
                = ({formatCurrency(result.averageAnnualSalary)} × 10%) × {result.serviceYears.toFixed(2)}년 × 2.0 ={' '}
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {formatCurrency(result.taxLawLimitPay)}
                </span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">
                  ({formatKoreanWon(result.taxLawLimitPay)})
                </span>
              </div>
            </div>

            {/* 2. 한도 초과 및 소득 전환 */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                2. 지급액 구성 및 세무 귀속 구분
              </div>
              
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">
                  사내 규정 총액 ({articlesRegulation.multiple.toFixed(1)}배)
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(result.companySeverancePay)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">
                  소득세법 인정 한도액 (2.0배 분류과세)
                </span>
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {formatCurrency(result.retirementIncomeApproved)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span
                  className={
                    result.isExceeded
                      ? 'text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300'
                  }
                >
                  근로소득(상여) 합산 전환액
                </span>
                <span
                  className={`font-bold ${
                    result.isExceeded
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {result.isExceeded ? formatCurrency(result.earnedIncomeConverted) : '0원 (한도 내)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <span>법인세 손금산입 적격 금액</span>
                <span>{formatCurrency(result.corporateTaxDeductible)}</span>
              </div>
            </div>

            {/* Visual Portfolio Bar */}
            <div className="pt-1">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
                <span>과세 포트폴리오 비중</span>
                <span>
                  퇴직소득 {Math.round((result.retirementIncomeApproved / (result.companySeverancePay || 1)) * 100)}%
                  {result.isExceeded &&
                    ` · 근로소득 ${Math.round(
                      (result.earnedIncomeConverted / (result.companySeverancePay || 1)) * 100
                    )}%`}
                </span>
              </div>
              <div className="w-full h-5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 flex items-center overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (result.retirementIncomeApproved / (result.companySeverancePay || 1)) * 100
                      )
                    )}%`,
                  }}
                  className="h-full bg-purple-600 rounded transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold"
                >
                  퇴직소득 ({Math.min(
                    100,
                    Math.round(
                      (result.retirementIncomeApproved / (result.companySeverancePay || 1)) * 100
                    )
                  )}%)
                </div>
                {result.isExceeded && (
                  <div
                    style={{
                      width: `${Math.max(
                        0,
                        100 -
                          Math.round(
                            (result.retirementIncomeApproved / (result.companySeverancePay || 1)) * 100
                          )
                      )}%`,
                    }}
                    className="h-full bg-rose-500 rounded transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold"
                  >
                    근로소득
                  </div>
                )}
              </div>
            </div>

            {/* 3. 법인세 과세표준 감소 및 세액 절감 효과 시뮬레이션 */}
            <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/70 rounded-xl p-4 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-200/80 dark:border-emerald-800/60">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-100 flex items-center gap-1.5">
                      3. 법인세 과세표준 감소 & 절감 효과 분석
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">
                      퇴직금 손금산입(비용인정)에 따른 당해 사업연도 법인세 절세액
                    </p>
                  </div>
                </div>

                {/* Tab Switcher (Visual vs Table) */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 p-0.5 rounded-lg text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('visual')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeTab === 'visual'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                    }`}
                  >
                    차트 비교
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('table')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeTab === 'table'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                    }`}
                  >
                    구간별 비교표
                  </button>
                </div>
              </div>

              {/* Operating Profit Selector / Input */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    연간 영업이익 (과세표준 가정치):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={Math.round((operatingProfit / 100000000) * 10) / 10}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setOperatingProfit(isNaN(val) ? 0 : Math.round(val * 100000000));
                      }}
                      className="w-20 px-2 py-1 text-xs font-bold text-right bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-md outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">억 원</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1">
                      ({formatKoreanWon(operatingProfit)})
                    </span>
                  </div>
                </div>

                {/* Profit Preset Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">빠른 선택:</span>
                  {profitPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setOperatingProfit(preset.value)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        operatingProfit === preset.value
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Key Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* 1. 과세표준 감소 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                    과세표준 감소액 (손금)
                  </span>
                  <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {formatCurrency(savings.taxBaseReduction)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatKoreanWon(savings.taxBaseReduction)}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                    반영 후: {formatCurrency(savings.profitAfter)}
                  </div>
                </div>

                {/* 2. 당초 예상 법인세 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                    퇴직금 지급 전 법인세
                  </span>
                  <div className="text-sm sm:text-base font-black text-slate-700 dark:text-slate-200">
                    {formatCurrency(savings.taxBefore.totalTax)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    실효세율 {savings.taxBefore.effectiveRate.toFixed(1)}% (지방세 포함)
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                    지급 후: {formatCurrency(savings.taxAfter.totalTax)}
                  </div>
                </div>

                {/* 3. 법인세 순 절감액 */}
                <div className="bg-emerald-600 text-white rounded-lg p-3 space-y-1 shadow-xs">
                  <span className="text-[11px] font-bold text-emerald-100 flex items-center justify-between">
                    <span>법인세 순 절감액</span>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-200" />
                  </span>
                  <div className="text-base sm:text-lg font-black tracking-tight text-white">
                    {formatCurrency(savings.taxSaving)}
                  </div>
                  <div className="text-[11px] text-emerald-100 font-medium">
                    {formatKoreanWon(savings.taxSaving)}
                  </div>
                  <div className="text-[10px] text-emerald-200 font-semibold pt-0.5">
                    손금 대비 절세율 약 {savings.effectiveSavingRate.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* View 1: Graphical Visual Bars */}
              {activeTab === 'visual' && (
                <div className="space-y-3 pt-1">
                  {/* Visual Bar 1: 과세표준 변화 */}
                  <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        과세표준(영업이익) 감축 시각화
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ▼ {formatKoreanWon(savings.taxBaseReduction)} 감소 ({reductionPercent}%)
                      </span>
                    </div>

                    {/* Comparative Stacked Bar */}
                    <div className="w-full h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex border border-slate-200 dark:border-slate-700">
                      <div
                        style={{ width: `${afterProfitPercent}%` }}
                        className="bg-slate-600 dark:bg-slate-500 h-full flex items-center justify-center text-white text-[10px] font-bold px-2 truncate transition-all duration-300"
                        title={`퇴직금 지급 후 잔여 과세표준: ${formatCurrency(savings.profitAfter)}`}
                      >
                        {afterProfitPercent > 18 ? `차감 후 과세표준 (${formatKoreanWon(savings.profitAfter)})` : ''}
                      </div>
                      <div
                        style={{ width: `${reductionPercent}%` }}
                        className="bg-emerald-500 h-full flex items-center justify-center text-white text-[10px] font-bold px-2 truncate transition-all duration-300"
                        title={`퇴직금 손금산입 과세표준 차감액: ${formatCurrency(savings.taxBaseReduction)}`}
                      >
                        {reductionPercent > 18 ? `손금 차감액 (-${formatKoreanWon(savings.taxBaseReduction)})` : '손금차감'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 font-medium">
                      <span>당초 과세표준: {formatKoreanWon(savings.profitBefore)}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        차감 후 과세표준: {formatKoreanWon(savings.profitAfter)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar 2: 법인세 부담 변화 */}
                  <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        실제 납부할 법인세 비교 (지방소득세 포함)
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        ▼ {formatKoreanWon(savings.taxSaving)} 절감 (
                        {savings.taxBefore.totalTax > 0
                          ? Math.round((savings.taxSaving / savings.taxBefore.totalTax) * 100)
                          : 0}
                        %)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {/* Before Tax Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                          <span>지급 전 예상 법인세</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            {formatCurrency(savings.taxBefore.totalTax)}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full w-full" />
                        </div>
                      </div>

                      {/* After Tax Bar with Savings Highlight */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                            지급 후 확정 법인세
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(savings.taxAfter.totalTax)}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${afterTaxPercent}%` }}
                            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                          />
                          <div
                            style={{ width: `${taxSavedPercent}%` }}
                            className="h-full bg-emerald-200 dark:bg-emerald-800/60 rounded-full transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                      <span>실효세율 경감: {savings.taxBefore.effectiveRate.toFixed(1)}% ➔ {savings.taxAfter.effectiveRate.toFixed(1)}%</span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                        순 절감액: {formatCurrency(savings.taxSaving)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Multi-scenario Comparison Table */}
              {activeTab === 'table' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[540px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                        <th className="py-2.5 px-3">연간 영업이익</th>
                        <th className="py-2.5 px-3">지급 전 법인세</th>
                        <th className="py-2.5 px-3">손금 반영 후 과표</th>
                        <th className="py-2.5 px-3">지급 후 법인세</th>
                        <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 text-right">
                          법인세 절감액
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {scenarioProfits.map((profitVal) => {
                        const rowCalc = calculateCorporateTaxSavings(
                          profitVal,
                          result.corporateTaxDeductible
                        );
                        const isSelected = profitVal === operatingProfit;
                        return (
                          <tr
                            key={profitVal}
                            onClick={() => setOperatingProfit(profitVal)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-semibold'
                                : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-1.5">
                                {isSelected && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                )}
                                <span className={isSelected ? 'text-emerald-900 dark:text-emerald-200 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                                  {formatKoreanWon(profitVal)}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                              {formatCurrency(rowCalc.taxBefore.totalTax)}
                            </td>
                            <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                              {formatCurrency(rowCalc.profitAfter)}
                            </td>
                            <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                              {formatCurrency(rowCalc.taxAfter.totalTax)}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                              ▼ {formatCurrency(rowCalc.taxSaving)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tax Law Consulting Tip */}
              <div className="bg-white/80 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-2.5 text-[11px] text-slate-600 dark:text-emerald-200/90 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>법인세 절세 효과 핵심:</strong> 법인세법 시행령 제44조에 따라 정관 규정을 구비한 임원 퇴직금({formatCurrency(result.corporateTaxDeductible)})은 전액 손금산입(비용 인정)되어 당해 사업연도 법인세 과세표준을 직접 감축합니다. 과세표준 2억원 초과 구간 기준{' '}
                  <strong className="text-emerald-700 dark:text-emerald-300">20.9%(지방소득세 포함)</strong>의 법인세 절감 효과가 발생합니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>근속기간: {result.serviceYearsDisplay}</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">
            소득세법 제22조 및 법인세법 시행령 제44조 준수
          </span>
        </div>
      </div>
    </section>
  );
};

