import React from 'react';
import { SavedCalculation } from '../types';
import { formatCurrency, formatKoreanWon } from '../utils/taxCalculator';
import { X, FolderOpen, Trash2, ArrowRightCircle, Calendar, Briefcase, Calculator, Building2 } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface SavedCalculationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedCalculation[];
  onLoad: (item: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const SavedCalculationsModal: React.FC<SavedCalculationsModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onLoad,
  onDelete,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative my-8 shadow-xl flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
          <CompanyLogo size="md" />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded">
                저장함 ({savedList.length}건)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FolderOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              보관된 임원 퇴직금 계산 내역
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              저장해둔 시뮬레이션 데이터를 언제든 다시 불러와 검토하거나 인쇄할 수 있습니다.
            </p>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
          {savedList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <Calculator className="w-10 h-10 mx-auto opacity-40 text-purple-500" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                저장된 계산 데이터가 없습니다.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                입력란에서 데이터를 입력하고 상단의 <strong>[저장]</strong> 버튼을 누르면 이곳에 안전하게 보관됩니다.
              </p>
            </div>
          ) : (
            savedList.map((item) => {
              const isExceeded = (item.summary.earnedIncomeConverted || 0) > 0;
              return (
                <div
                  key={item.id}
                  className="bg-slate-50/80 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl p-4 transition-all hover:border-purple-300 dark:hover:border-purple-700 space-y-2.5"
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.executiveInfo.name || '미지정 임원'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          ({item.executiveInfo.position || '직위 미지정'})
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {item.articlesRegulation.multiple.toFixed(1)}배
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {item.executiveInfo.companyName || '회사명 없음'}
                        </span>
                        <span>·</span>
                        <span className="text-[11px]">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onLoad(item);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                      >
                        <ArrowRightCircle className="w-3.5 h-3.5" />
                        불러오기
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="삭제"
                        aria-label="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metrics summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">근속기간</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.summary.serviceYearsDisplay || '0년 0개월'}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">사내 지급 총액</div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.summary.companySeverancePay)}
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg">
                      <div className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">퇴직소득 인정액</div>
                      <div className="font-bold text-purple-700 dark:text-purple-300">
                        {formatCurrency(item.summary.retirementIncomeApproved)}
                      </div>
                    </div>
                  </div>

                  {isExceeded && (
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center justify-between px-1">
                      <span>소득세법 2.0배 한도 초과</span>
                      <span>근로소득 전환: {formatCurrency(item.summary.earnedIncomeConverted)}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {savedList.length > 0 ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-600 transition-colors"
            >
              전체 내역 비우기
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
