import React, { useState, useMemo, useRef } from 'react';
import {
  ExecutiveInfo,
  ServicePeriod,
  SalaryHistory,
  ArticlesRegulation,
  SavedCalculation,
} from './types';
import { calculateExecutiveSeverancePay } from './utils/taxCalculator';
import {
  getSavedCalculations,
  saveCalculation,
  deleteSavedCalculation,
  clearAllSavedCalculations,
} from './utils/storage';
import { Header } from './components/Header';
import { SummaryDashboard } from './components/SummaryDashboard';
import { TaxRiskAlert } from './components/TaxRiskAlert';
import { ExecutiveForm } from './components/ExecutiveForm';
import { CalculationBreakdown } from './components/CalculationBreakdown';
import { ChecklistGuide } from './components/ChecklistGuide';
import { TaxGuideModal } from './components/TaxGuideModal';
import { PrintReportModal } from './components/PrintReportModal';
import { SavedCalculationsModal } from './components/SavedCalculationsModal';
import { CompanyLogo } from './components/CompanyLogo';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Default values configured with Hanwha People Life Daejeon Glory Business Division
  const [executiveInfo, setExecutiveInfo] = useState<ExecutiveInfo>({
    name: '김대표',
    position: '대표이사',
    companyName: '한화피플라이프 대전글로리사업단',
  });

  const [servicePeriod, setServicePeriod] = useState<ServicePeriod>({
    startDate: '2019-03-01',
    endDate: '2026-02-28',
  });

  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory>({
    year1: 200000000, // 2억 원
    year2: 190000000, // 1억 9천만 원
    year3: 180000000, // 1억 8천만 원
    inputUnit: 'KRW',
  });

  const [articlesRegulation, setArticlesRegulation] = useState<ArticlesRegulation>({
    multiple: 3.0,
    hasArticlesRule: true,
    hasShareholderApproval: true,
  });

  // Saved calculations state
  const [savedList, setSavedList] = useState<SavedCalculation[]>(() => getSavedCalculations());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Real-time calculation engine
  const calculationResult = useMemo(() => {
    return calculateExecutiveSeverancePay({
      startDate: servicePeriod.startDate,
      endDate: servicePeriod.endDate,
      salaryYear1: salaryHistory.year1,
      salaryYear2: salaryHistory.year2,
      salaryYear3: salaryHistory.year3,
      multiple: articlesRegulation.multiple,
      hasArticlesRule: articlesRegulation.hasArticlesRule,
      hasShareholderApproval: articlesRegulation.hasShareholderApproval,
    });
  }, [servicePeriod, salaryHistory, articlesRegulation]);

  // Reset form to blank/clean state
  const handleReset = () => {
    setExecutiveInfo({
      name: '',
      position: '대표이사',
      companyName: '',
    });
    setServicePeriod({
      startDate: '',
      endDate: '',
    });
    setSalaryHistory({
      year1: 0,
      year2: 0,
      year3: 0,
      inputUnit: 'KRW',
    });
    setArticlesRegulation({
      multiple: 2.0,
      hasArticlesRule: true,
      hasShareholderApproval: true,
    });
    showToast('모든 입력란이 초기화되었습니다.');
  };

  // Save current calculation
  const handleSave = () => {
    const comp = executiveInfo.companyName.trim() || '미지정 회사';
    const name = executiveInfo.name.trim() || '임원';
    const title = `${comp} ${name} (${articlesRegulation.multiple.toFixed(1)}배)`;

    saveCalculation({
      title,
      executiveInfo: { ...executiveInfo },
      servicePeriod: { ...servicePeriod },
      salaryHistory: { ...salaryHistory },
      articlesRegulation: { ...articlesRegulation },
      summary: {
        serviceYearsDisplay: calculationResult.serviceYearsDisplay,
        companySeverancePay: calculationResult.companySeverancePay,
        retirementIncomeApproved: calculationResult.retirementIncomeApproved,
        earnedIncomeConverted: calculationResult.earnedIncomeConverted,
        multiple: articlesRegulation.multiple,
      },
    });

    const updated = getSavedCalculations();
    setSavedList(updated);
    showToast(`"${title}" 데이터가 보관함에 저장되었습니다.`);
  };

  // Load saved item
  const handleLoadSaved = (item: SavedCalculation) => {
    setExecutiveInfo(item.executiveInfo);
    setServicePeriod(item.servicePeriod);
    setSalaryHistory(item.salaryHistory);
    setArticlesRegulation(item.articlesRegulation);
    showToast(`"${item.title}" 데이터를 불러왔습니다.`);
  };

  // Delete saved item
  const handleDeleteSaved = (id: string) => {
    const updated = deleteSavedCalculation(id);
    setSavedList(updated);
    showToast('저장 데이터가 삭제되었습니다.');
  };

  // Clear all saved
  const handleClearAllSaved = () => {
    if (window.confirm('저장된 모든 계산 내역을 삭제하시겠습니까?')) {
      clearAllSavedCalculations();
      setSavedList([]);
      showToast('모든 저장 데이터가 삭제되었습니다.');
    }
  };

  // Scenario presets
  const handleLoadScenario = (scenario: 'standard3x' | 'safe2x' | 'high4x') => {
    if (scenario === 'standard3x') {
      // 3.0배수 표준 시나리오 (총 3.99억 원 산출)
      setArticlesRegulation((prev) => ({ ...prev, multiple: 3.0 }));
      setSalaryHistory({
        year1: 200000000,
        year2: 190000000,
        year3: 180000000,
        inputUnit: 'KRW',
      });
      setServicePeriod({
        startDate: '2019-03-01',
        endDate: '2026-02-28',
      });
      setExecutiveInfo({
        name: '김대표',
        position: '대표이사',
        companyName: '(주)한국글로벌테크',
      });
    } else if (scenario === 'safe2x') {
      // 2.0배수 한도내 안전 시나리오 (초과액 0원, 전액 퇴직소득 인정)
      setArticlesRegulation((prev) => ({ ...prev, multiple: 2.0 }));
      setSalaryHistory({
        year1: 150000000,
        year2: 150000000,
        year3: 150000000,
        inputUnit: 'KRW',
      });
      setServicePeriod({
        startDate: '2021-01-01',
        endDate: '2026-12-31',
      });
      setExecutiveInfo({
        name: '박상무',
        position: '상무이사',
        companyName: '(주)세무안전솔루션',
      });
    } else if (scenario === 'high4x') {
      // 4.0배수 고율 시나리오 (창업공로 대표이사 10년 근속)
      setArticlesRegulation((prev) => ({ ...prev, multiple: 4.0 }));
      setSalaryHistory({
        year1: 250000000,
        year2: 240000000,
        year3: 230000000,
        inputUnit: 'KRW',
      });
      setServicePeriod({
        startDate: '2016-03-01',
        endDate: '2026-02-28',
      });
      setExecutiveInfo({
        name: '이창업',
        position: '대표이사',
        companyName: '(주)대한이노베이션',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-purple-100 dark:selection:bg-purple-900/50 selection:text-purple-700 dark:selection:text-purple-300 flex flex-col transition-colors duration-200 relative">
      {/* 1. Header & Actions */}
      <Header
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
        onSave={handleSave}
        onOpenSavedList={() => setIsSavedModalOpen(true)}
        savedCount={savedList.length}
      />

      {/* Main High Density 2-Column Grid (5 : 7) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Input Parameters (col-span-5) */}
        <section className="lg:col-span-5 space-y-3">
          <ExecutiveForm
            executiveInfo={executiveInfo}
            setExecutiveInfo={setExecutiveInfo}
            servicePeriod={servicePeriod}
            setServicePeriod={setServicePeriod}
            salaryHistory={salaryHistory}
            setSalaryHistory={setSalaryHistory}
            articlesRegulation={articlesRegulation}
            setArticlesRegulation={setArticlesRegulation}
            serviceDurationDisplay={calculationResult.serviceYearsDisplay}
            totalMonths={calculationResult.totalMonths}
            averageAnnualSalary={calculationResult.averageAnnualSalary}
          />
        </section>

        {/* Right Column: Analysis & Results (col-span-7) */}
        <section className="lg:col-span-7 flex flex-col space-y-4">
          {/* 1. Top Key Result Metrics (사내 지급 총액, 퇴직소득 인정액, 근로소득 전환액, 법인세 손금한도) */}
          <SummaryDashboard
            result={calculationResult}
            multiple={articlesRegulation.multiple}
          />

          {/* 2. Compliance & Tax Risk Alert */}
          <TaxRiskAlert
            result={calculationResult}
            multiple={articlesRegulation.multiple}
            hasArticlesRule={articlesRegulation.hasArticlesRule}
          />

          {/* 3. Detailed Formula Calculation & Portfolio Breakdown */}
          <CalculationBreakdown
            result={calculationResult}
            salaryHistory={salaryHistory}
            articlesRegulation={articlesRegulation}
          />

          {/* 4. Corporate Tax & Articles Compliance Checklist */}
          <ChecklistGuide />
        </section>
      </main>

      {/* Footer & Legal Disclaimer */}
      <footer className="mt-8 pt-4 border-t border-slate-300/60 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
          <CompanyLogo size="sm" />
          <span className="font-bold text-slate-800 dark:text-slate-100">한화피플라이프 대전글로리사업단</span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span>기업 임원 세무 컨설팅 솔루션 (소득세법 제22조 및 법인세법 시행령 제44조 정밀 적용)</span>
        </div>
        <p className="max-w-2xl mx-auto text-slate-400 dark:text-slate-500 text-[10px] leading-relaxed">
          본 계산기는 세법 기준에 따른 모의 산출 시뮬레이션이며, 실제 퇴직소득세 원천징수세액 산정 시에는
          개인별 근속연수공제, 환산급여공제 및 타 퇴직금 합산 여부에 따라 정밀 세액이 달라질 수 있습니다.
        </p>
      </footer>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 dark:border-slate-300 text-xs font-semibold flex items-center gap-2 transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <TaxGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <PrintReportModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        executiveInfo={executiveInfo}
        servicePeriod={servicePeriod}
        salaryHistory={salaryHistory}
        articlesRegulation={articlesRegulation}
        result={calculationResult}
      />

      <SavedCalculationsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedList={savedList}
        onLoad={handleLoadSaved}
        onDelete={handleDeleteSaved}
        onClearAll={handleClearAllSaved}
      />
    </div>
  );
}
