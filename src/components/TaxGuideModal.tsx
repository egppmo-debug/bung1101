import React from 'react';
import { X, BookOpen, Scale, History, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface TaxGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaxGuideModal: React.FC<TaxGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative my-8 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <CompanyLogo size="md" />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded">
                한화피플라이프 대전글로리사업단
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">기업 세무 가이드</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              임원 퇴직금 세무 가이드 & 법령 해설집
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              소득세법 제22조 및 법인세법 시행령 제44조 핵심 법률 가이드
            </p>
          </div>
        </div>

        {/* Section 1: History of Income Tax Article 22 */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                1. 소득세법 제22조(퇴직소득) 한도 배수 변천사
              </h3>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">~ 2011. 12. 31</div>
                  <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold mb-1">배수 한도 없음</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    정관 규정 전액을 퇴직소득으로 인정 (과세한도 미존재)
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">2012. 1. 1 ~ 2019. 12. 31</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">3.0배수 한도 적용</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    연평균 급여액 × 10% × 근속연수 × 3배수 초과분 근로소득 전환
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 border-2 border-purple-500 rounded-lg">
                  <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">2020. 1. 1 이후 현재</div>
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-bold mb-1">2.0배수 한도 (현행)</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    소득세법 개정으로 한도 배수가 2.0배로 대폭 축소 강화
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                * 과세당국은 2020년 1월 1일 이후 근무기간에 대하여는 2배수 한도를 엄격 적용하며,
                한도 초과액은 임원에게 상여(근로소득)로 지급된 것으로 보아 종합과세합니다.
              </p>
            </div>
          </div>

          {/* Section 2: Severance vs Earned Income Tax Comparison */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                2. 퇴직소득세 vs 근로소득세 과세체계 비교
              </h3>
            </div>
            <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 bg-slate-50/80 dark:bg-slate-800">
                    <th className="py-2.5 px-3">구분</th>
                    <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400">퇴직소득 (한도 내)</th>
                    <th className="py-2.5 px-3 text-rose-600 dark:text-rose-400">근로소득 전환분 (한도 초과)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">과세 방식</td>
                    <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-medium">분류과세 (타 소득과 합산 X)</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-medium">종합과세 (타 소득과 누진 합산)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">소득 공제</td>
                    <td className="py-2.5 px-3">근속연수공제 + 환산급여공제</td>
                    <td className="py-2.5 px-3">근로소득공제 (최대 2,000만원 한도)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">적용 세율</td>
                    <td className="py-2.5 px-3">12배 연분연승법 적용으로 실효세율 낮음 (~12-16%)</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">6% ~ 45% 초과누진세율 (최고 49.5% 부담)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">건강보험료</td>
                    <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">비부과 대상 (보험료 없음)</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-semibold">보수외 소득 가산 등 건보료 부과 위험</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Corporate Tax Deductibility */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                3. 법인세 손금산입(비용 인정) 핵심 요건
              </h3>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-900 dark:text-white">법인세법 시행령 제44조 제4항 제1호:</strong> 법인이 임원에게 지급한 퇴직급여 중
                정관이나 주주총회 결의에 의하여 위임된 임원 퇴직급여 지급규정에 정하여진 금액의 범위
                내인 것은 전액 법인의 손금(비용)으로 인정됩니다.
              </p>
              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded text-amber-900 dark:text-amber-200">
                <strong>주의:</strong> 정관에 위임 규정 없이 이사회 결의만으로 임원 퇴직금을 지급하거나,
                사내 규정 배수를 초과하여 지급한 경우, 초과액 전액이 손금불산입되어 법인세가 추징되고
                해당 임원에게 <strong>상여(Bonus)</strong>로 소득처분됩니다.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
