import React from 'react';
import { ExecutiveInfo, ServicePeriod, SalaryHistory, ArticlesRegulation } from '../types';
import { formatCurrency, formatKoreanWon } from '../utils/taxCalculator';
import { User, Calendar, DollarSign, Scale, HelpCircle, Check } from 'lucide-react';

interface ExecutiveFormProps {
  executiveInfo: ExecutiveInfo;
  setExecutiveInfo: React.Dispatch<React.SetStateAction<ExecutiveInfo>>;
  servicePeriod: ServicePeriod;
  setServicePeriod: React.Dispatch<React.SetStateAction<ServicePeriod>>;
  salaryHistory: SalaryHistory;
  setSalaryHistory: React.Dispatch<React.SetStateAction<SalaryHistory>>;
  articlesRegulation: ArticlesRegulation;
  setArticlesRegulation: React.Dispatch<React.SetStateAction<ArticlesRegulation>>;
  serviceDurationDisplay: string;
  totalMonths: number;
  averageAnnualSalary: number;
}

export const ExecutiveForm: React.FC<ExecutiveFormProps> = ({
  executiveInfo,
  setExecutiveInfo,
  servicePeriod,
  setServicePeriod,
  salaryHistory,
  setSalaryHistory,
  articlesRegulation,
  setArticlesRegulation,
  serviceDurationDisplay,
  totalMonths,
  averageAnnualSalary,
}) => {
  // Input unit multiplier: 1 for KRW, 10000 for MANWON
  const isManwon = salaryHistory.inputUnit === 'MANWON';
  const unitMultiplier = isManwon ? 10000 : 1;

  const handleSalaryChange = (key: 'year1' | 'year2' | 'year3', rawValue: string) => {
    // strip commas and non-digits
    const cleanNum = parseInt(rawValue.replace(/[^0-9]/g, ''), 10) || 0;
    const actualWon = cleanNum * unitMultiplier;
    setSalaryHistory((prev) => ({
      ...prev,
      [key]: actualWon,
    }));
  };

  const setUnit = (unit: 'KRW' | 'MANWON') => {
    setSalaryHistory((prev) => ({
      ...prev,
      inputUnit: unit,
    }));
  };

  const getDisplayValue = (amountInWon: number) => {
    if (!amountInWon) return '';
    const displayNum = isManwon ? Math.round(amountInWon / 10000) : amountInWon;
    return displayNum.toLocaleString('ko-KR');
  };

  // Quick preset for service period
  const setQuickPeriodYears = (years: number) => {
    const end = new Date();
    const start = new Date(end);
    start.setFullYear(end.getFullYear() - years);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    setServicePeriod({
      startDate: startStr,
      endDate: endStr,
    });
  };

  // Quick preset for multiples
  const multiplePresets = [1.0, 2.0, 2.5, 3.0, 4.0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
      {/* 1. 임원 기본 정보 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            임원 기본 정보
          </label>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">성명 / 직위</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/60 hover:border-amber-300 dark:hover:border-amber-600 focus-within:bg-amber-50 dark:focus-within:bg-amber-950/40 focus-within:border-amber-500 dark:focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 rounded-lg px-3 py-2 flex items-center transition-all">
            <input
              type="text"
              value={executiveInfo.name}
              onChange={(e) =>
                setExecutiveInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="임원 성명 (예: 김민수)"
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-amber-100 font-semibold outline-none placeholder:text-amber-800/40 dark:placeholder:text-amber-300/40"
            />
          </div>

          <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/60 hover:border-amber-300 dark:hover:border-amber-600 focus-within:bg-amber-50 dark:focus-within:bg-amber-950/40 focus-within:border-amber-500 dark:focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 rounded-lg px-3 py-2 flex items-center transition-all">
            <input
              type="text"
              value={executiveInfo.position}
              onChange={(e) =>
                setExecutiveInfo((prev) => ({ ...prev, position: e.target.value }))
              }
              placeholder="직위 (예: 대표이사)"
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-amber-100 font-semibold outline-none placeholder:text-amber-800/40 dark:placeholder:text-amber-300/40"
            />
          </div>
        </div>

        {/* Company name input */}
        <div className="pt-0.5">
          <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/60 hover:border-amber-300 dark:hover:border-amber-600 focus-within:bg-amber-50 dark:focus-within:bg-amber-950/40 focus-within:border-amber-500 dark:focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 rounded-lg px-3 py-2 flex items-center gap-1.5 transition-all">
            <input
              type="text"
              value={executiveInfo.companyName}
              onChange={(e) =>
                setExecutiveInfo((prev) => ({ ...prev, companyName: e.target.value }))
              }
              placeholder="회사명 (예: 한화피플라이프 대전글로리사업단)"
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-amber-100 outline-none font-semibold placeholder:text-amber-800/40 dark:placeholder:text-amber-300/40"
            />
            {executiveInfo.companyName !== '한화피플라이프 대전글로리사업단' && (
              <button
                type="button"
                onClick={() =>
                  setExecutiveInfo((prev) => ({
                    ...prev,
                    companyName: '한화피플라이프 대전글로리사업단',
                  }))
                }
                className="text-[10px] font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 whitespace-nowrap px-2 py-1 rounded bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                title="한화피플라이프 대전글로리사업단 자동 입력"
              >
                기본사업단
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. 근속 기간 설정 */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            근속 기간 설정
          </label>
          <span className="bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 text-xs font-bold rounded-full">
            {serviceDurationDisplay}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 ml-0.5">취임일</span>
            <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/60 hover:border-amber-300 dark:hover:border-amber-600 focus-within:bg-amber-50 dark:focus-within:bg-amber-950/40 focus-within:border-amber-500 dark:focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 rounded-lg px-3 py-2 transition-all">
              <input
                type="date"
                value={servicePeriod.startDate}
                onChange={(e) =>
                  setServicePeriod((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-amber-100 outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 ml-0.5">퇴임일</span>
            <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/60 hover:border-amber-300 dark:hover:border-amber-600 focus-within:bg-amber-50 dark:focus-within:bg-amber-950/40 focus-within:border-amber-500 dark:focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 rounded-lg px-3 py-2 transition-all">
              <input
                type="date"
                value={servicePeriod.endDate}
                onChange={(e) =>
                  setServicePeriod((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-amber-100 outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Quick presets & law footnote */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">빠른 설정:</span>
            {[3, 5, 7, 10, 15].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setQuickPeriodYears(yr)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-0.5 text-xs font-medium rounded-md transition-colors"
              >
                {yr}년
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            *1개월 미만 1개월 절상 (소득령 §40)
          </span>
        </div>
      </div>

      {/* 3. 최근 3개년 급여 내역 */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            최근 3개년 급여 내역
          </label>

          {/* Unit Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <button
              type="button"
              onClick={() => setUnit('KRW')}
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all ${
                !isManwon
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              원 단위
            </button>
            <button
              type="button"
              onClick={() => setUnit('MANWON')}
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all ${
                isManwon
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              만원 단위
            </button>
          </div>
        </div>

        {/* 3 Years Rows */}
        <div className="space-y-2">
          {/* Year 1 */}
          <div className="bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2.5 flex justify-between px-3 sm:px-4 items-center">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">직전 1년차</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={getDisplayValue(salaryHistory.year1)}
                onChange={(e) => handleSalaryChange('year1', e.target.value)}
                placeholder="0"
                className="w-28 sm:w-36 text-right bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/70 hover:border-amber-400 dark:hover:border-amber-500 rounded px-2.5 py-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-amber-100 outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:bg-amber-50 dark:focus:bg-amber-950/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {isManwon ? '만원' : '원'}
              </span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 hidden sm:inline-block w-24 text-right">
                {formatKoreanWon(salaryHistory.year1)}
              </span>
            </div>
          </div>

          {/* Year 2 */}
          <div className="bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2.5 flex justify-between px-3 sm:px-4 items-center">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">직전 2년차</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={getDisplayValue(salaryHistory.year2)}
                onChange={(e) => handleSalaryChange('year2', e.target.value)}
                placeholder="0"
                className="w-28 sm:w-36 text-right bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/70 hover:border-amber-400 dark:hover:border-amber-500 rounded px-2.5 py-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-amber-100 outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:bg-amber-50 dark:focus:bg-amber-950/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {isManwon ? '만원' : '원'}
              </span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 hidden sm:inline-block w-24 text-right">
                {formatKoreanWon(salaryHistory.year2)}
              </span>
            </div>
          </div>

          {/* Year 3 */}
          <div className="bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2.5 flex justify-between px-3 sm:px-4 items-center">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">직전 3년차</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={getDisplayValue(salaryHistory.year3)}
                onChange={(e) => handleSalaryChange('year3', e.target.value)}
                placeholder="0"
                className="w-28 sm:w-36 text-right bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/70 hover:border-amber-400 dark:hover:border-amber-500 rounded px-2.5 py-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-amber-100 outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:bg-amber-50 dark:focus:bg-amber-950/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {isManwon ? '만원' : '원'}
              </span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 hidden sm:inline-block w-24 text-right">
                {formatKoreanWon(salaryHistory.year3)}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time average box */}
        <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg p-2.5 flex justify-between items-center text-xs px-3">
          <span className="text-xs font-medium text-purple-900 dark:text-purple-200">3개년 연평균 급여액:</span>
          <span className="font-extrabold text-purple-900 dark:text-purple-100 text-sm">
            {formatCurrency(averageAnnualSalary)}
            <span className="text-xs text-purple-700 dark:text-purple-300 ml-1 font-semibold">
              ({formatKoreanWon(averageAnnualSalary)})
            </span>
          </span>
        </div>
      </div>

      {/* 4. 정관 지급 배수 & 세무 요건 */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            정관 지급 배수
          </label>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            현재: <span className="text-purple-700 dark:text-purple-300 font-bold">{articlesRegulation.multiple.toFixed(1)}배</span>
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={articlesRegulation.multiple}
              onChange={(e) =>
                setArticlesRegulation((prev) => ({
                  ...prev,
                  multiple: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-20 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/70 hover:border-amber-400 dark:hover:border-amber-500 rounded px-2.5 py-1 text-sm font-black text-slate-900 dark:text-amber-100 outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:bg-amber-50 dark:focus:bg-amber-950/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
            />
            <span className="text-sm font-bold text-purple-700 dark:text-purple-300">배</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            * 소득세법 법령 한도: 2.0배
          </span>
        </div>

        {/* Multiple preset buttons */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {multiplePresets.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() =>
                setArticlesRegulation((prev) => ({ ...prev, multiple: m }))
              }
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                articlesRegulation.multiple === m
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {m.toFixed(1)}배
            </button>
          ))}
        </div>

        {/* Corporate Tax compliance checklist toggles */}
        <div className="space-y-1.5 pt-2">
          <label
            onClick={() =>
              setArticlesRegulation((prev) => ({
                ...prev,
                hasArticlesRule: !prev.hasArticlesRule,
              }))
            }
            className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all select-none rounded-lg"
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                articlesRegulation.hasArticlesRule
                  ? 'bg-purple-600 text-white'
                  : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-transparent'
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-tight">
              정관 또는 주총 위임 임원 퇴직급여 규정 구비 (손금산입 요건)
            </span>
          </label>

          <label
            onClick={() =>
              setArticlesRegulation((prev) => ({
                ...prev,
                hasShareholderApproval: !prev.hasShareholderApproval,
              }))
            }
            className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all select-none rounded-lg"
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                articlesRegulation.hasShareholderApproval
                  ? 'bg-purple-600 text-white'
                  : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-transparent'
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-tight">
              주주총회 적법 결의 및 의사록 공증 비치 (세무조사 대비)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
