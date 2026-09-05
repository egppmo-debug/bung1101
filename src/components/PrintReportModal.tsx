import React from 'react';
import { ExecutiveInfo, ServicePeriod, SalaryHistory, ArticlesRegulation, CalculationResult } from '../types';
import { formatCurrency, formatKoreanWon } from '../utils/taxCalculator';
import { X, Printer, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  executiveInfo: ExecutiveInfo;
  servicePeriod: ServicePeriod;
  salaryHistory: SalaryHistory;
  articlesRegulation: ArticlesRegulation;
  result: CalculationResult;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  executiveInfo,
  servicePeriod,
  salaryHistory,
  articlesRegulation,
  result,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-800 rounded-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-xl relative my-8 p-6 sm:p-10 print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full">
        {/* Action Controls (Hidden when printing) */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            인쇄 미리보기 모드 (A4 정규 세무 검토서 규격)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              인쇄 및 PDF 저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-all"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="print-content space-y-6">
          {/* Top Brand Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <CompanyLogo size="md" />
              <div>
                <div className="text-sm font-black text-slate-900 tracking-tight">
                  한화피플라이프 대전글로리사업단
                </div>
                <div className="text-xs text-purple-700 font-semibold">
                  기업 임원 세무 리스크 컨설팅 사업본부
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>검토 번호: HPL-DGLORY-{new Date().getFullYear()}-{result.totalMonths}</div>
              <div>작성 일자: {todayStr}</div>
            </div>
          </div>

          {/* Document Header */}
          <div className="text-center pb-4 border-b-2 border-slate-800">
            <div className="text-xs uppercase tracking-widest text-purple-800 font-bold mb-1">
              한화피플라이프 대전글로리사업단 · 기업 세무 법정 검토서
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              임원 퇴직금 산정 및 세무 리스크 검토 의견서
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              근거법령: 소득세법 제22조(퇴직소득) 제3항 및 법인세법 시행령 제44조(퇴직급여의 손금불산입)
            </p>
          </div>

          {/* 1. 기본 인적사항 및 근속내역 */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 border-l-4 border-purple-600 pl-2.5 mb-2.5">
              1. 대상 임원 및 근속기간 현황
            </h2>
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2 px-3 w-1/4 font-semibold text-slate-700">회사명(법인)</th>
                    <td className="py-2 px-3 w-1/4">{executiveInfo.companyName || '미지정'}</td>
                    <th className="py-2 px-3 w-1/4 font-semibold text-slate-700">성명 / 직위</th>
                    <td className="py-2 px-3 w-1/4 font-bold">
                      {executiveInfo.name || '홍길동'} / {executiveInfo.position || '대표이사'}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 font-semibold text-slate-700">취임일(입사일)</th>
                    <td className="py-2 px-3">{servicePeriod.startDate}</td>
                    <th className="py-2 px-3 font-semibold text-slate-700">퇴임일(퇴사일)</th>
                    <td className="py-2 px-3">{servicePeriod.endDate}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <th className="py-2 px-3 font-semibold text-slate-700">총 근속기간</th>
                    <td className="py-2 px-3 font-semibold text-purple-700">
                      {result.serviceYearsDisplay}
                    </td>
                    <th className="py-2 px-3 font-semibold text-slate-700">사내 정관 배수</th>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {articlesRegulation.multiple.toFixed(1)}배수
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. 퇴직 직전 3개년 급여 내역 */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 border-l-4 border-purple-600 pl-2.5 mb-2.5">
              2. 퇴직 직전 3개년 급여 내역 및 연평균 급여액
            </h2>
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-2 px-3 text-center">구분</th>
                    <th className="py-2 px-3 text-right">총급여액 (원)</th>
                    <th className="py-2 px-3 text-right">한글 표기</th>
                    <th className="py-2 px-3 text-center">비고</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2 px-3 text-center font-medium">직전 1년차 (최근 1년)</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(salaryHistory.year1)}</td>
                    <td className="py-2 px-3 text-right text-slate-600">{formatKoreanWon(salaryHistory.year1)}</td>
                    <td className="py-2 px-3 text-center text-slate-400">기준 급여</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center font-medium">직전 2년차</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(salaryHistory.year2)}</td>
                    <td className="py-2 px-3 text-right text-slate-600">{formatKoreanWon(salaryHistory.year2)}</td>
                    <td className="py-2 px-3 text-center text-slate-400">기준 급여</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center font-medium">직전 3년차</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(salaryHistory.year3)}</td>
                    <td className="py-2 px-3 text-right text-slate-600">{formatKoreanWon(salaryHistory.year3)}</td>
                    <td className="py-2 px-3 text-center text-slate-400">기준 급여</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold">
                    <td className="py-2 px-3 text-center text-slate-800">3개년 연평균 급여액</td>
                    <td className="py-2 px-3 text-right font-mono text-purple-700">
                      {formatCurrency(result.averageAnnualSalary)}
                    </td>
                    <td className="py-2 px-3 text-right text-purple-700">
                      {formatKoreanWon(result.averageAnnualSalary)}
                    </td>
                    <td className="py-2 px-3 text-center text-slate-600">3개년 합계 ÷ 3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. 퇴직금 산출 및 소득세법 한도 검토 결과 */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 border-l-4 border-purple-600 pl-2.5 mb-2.5">
              3. 퇴직금 산정 및 세무 과세구분 판정표
            </h2>
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">항목</th>
                    <th className="py-2.5 px-3">산출 근거 수식</th>
                    <th className="py-2.5 px-3 text-right">금액</th>
                    <th className="py-2.5 px-3 text-center">세무 적용</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      ① 사내 규정 지급 총액
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">
                      연평균급여 × 10% × {result.serviceYears.toFixed(2)}년 × {articlesRegulation.multiple.toFixed(1)}배
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(result.companySeverancePay)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium text-purple-700">
                      정관 규정 지급액
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-800">
                      ② 퇴직소득 인정액 (한도 내)
                    </td>
                    <td className="py-2.5 px-3 text-emerald-700 font-mono">
                      연평균급여 × 10% × {result.serviceYears.toFixed(2)}년 × 2.0배
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(result.retirementIncomeApproved)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                      퇴직소득 분류과세 (저율)
                    </td>
                  </tr>
                  <tr className={result.isExceeded ? 'bg-rose-50/60' : ''}>
                    <td className={`py-2.5 px-3 font-bold ${result.isExceeded ? 'text-rose-600' : 'text-slate-600'}`}>
                      ③ 근로소득 전환액 (한도 초과)
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">
                      사내지급액 - 소득세법 한도액 (초과분)
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono font-bold ${result.isExceeded ? 'text-rose-600' : 'text-slate-700'}`}>
                      {formatCurrency(result.earnedIncomeConverted)}
                    </td>
                    <td className={`py-2.5 px-3 text-center font-bold ${result.isExceeded ? 'text-rose-600' : 'text-slate-500'}`}>
                      {result.isExceeded ? '종합과세(상여) 대상' : '해당 없음 (0원)'}
                    </td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      ④ 법인세 손금 인정액
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      정관 규정 부합 시 전액 손금산입
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(result.corporateTaxDeductible)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                      전액 손금(비용) 산입
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. 세무 파트너 종합 검토 의견 */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 text-xs leading-relaxed space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              세무 파트너 종합 검토 및 처리 가이드
            </h3>
            {result.isExceeded ? (
              <p className="text-slate-700">
                1. <strong>임원 개인 종합소득세:</strong> 본 검토 대상 임원의 경우 정관 지급 배수({articlesRegulation.multiple.toFixed(1)}배)가
                소득세법 제22조 한도(2.0배)를 초과하여 <strong>{formatCurrency(result.earnedIncomeConverted)}</strong>이 근로소득(상여)으로
                전환됩니다. 퇴직소득 원천징수영수증과 근로소득 원천징수영수증을 구분 발행하여 익년 5월 종합소득세 신고 시 합산 과세되도록
                조치해야 합니다.
                <br />
                2. <strong>법인세 손금산입:</strong> 사내 정관 규정 및 주주총회 결의가 정당하게 구비된 경우, 근로소득 전환분 역시 인건비(상여)로
                법인세법상 전액 손금산입되므로 법인의 과세표준 차감 효과는 유효합니다.
              </p>
            ) : (
              <p className="text-slate-700">
                1. <strong>세무 안전성 충족:</strong> 사내 규정 퇴직금({formatCurrency(result.companySeverancePay)})이 소득세법상
                법정 한도(2.0배)를 초과하지 않으므로, 전액 퇴직소득 분류과세가 적용되어 종합소득세 가산 부담 없이 합법적 절세 혜택이 적용됩니다.
                <br />
                2. <strong>법인세 손금산입:</strong> 정관 규정 요건을 완비하였으므로 전액 손금산입되어 법인세 비용으로 적격 인정됩니다.
              </p>
            )}
          </div>

          {/* Signatures and Date */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <div>검토일자: {todayStr}</div>
            <div className="flex items-center gap-8">
              <div>
                작성 및 자문: <strong className="text-slate-900">한화피플라이프 대전글로리사업단</strong> (인)
              </div>
              <div>
                확인(대상 임원): <strong>{executiveInfo.name || '홍길동'} {executiveInfo.position || '대표이사'}</strong> (인)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
