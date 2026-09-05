import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, AlertOctagon, HelpCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export const ChecklistGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    item1: true,
    item2: true,
    item3: false,
    item4: true,
    item5: false,
  });

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklist = [
    {
      id: 'item1',
      title: '정관 본문 또는 정관의 위임에 따른 임원 퇴직금 지급규정 구비',
      law: '법인세법 시행령 제44조 제4항 제1호',
      desc: '정관에 직접 배수를 규정하거나, 주주총회 결의로 정한 임원 퇴직급여 지급규정을 반드시 갖추어야 손금산입됩니다. (이사회 결의만으로는 무효)',
    },
    {
      id: 'item2',
      title: '주주총회 정당한 소집절차 및 결의 의사록 공증 비치',
      law: '상법 제388조 및 판례',
      desc: '주주총회 결의 요건(의결권 정족수)을 충족하고 결의서를 보관하여 국세청 세무조사 시 소명 자료로 제출할 수 있어야 합니다.',
    },
    {
      id: 'item3',
      title: '특정 임원에게만 유리한 자의적 배수 차등 지급 배제',
      law: '법인세법 제52조(부당행위계산부인)',
      desc: '특정 대주주나 대표이사 1인에게만 높은 배수를 적용하고 타 임원에게 차별 적용하는 경우 부당행위계산 부인 대상이 될 수 있습니다.',
    },
    {
      id: 'item4',
      title: '퇴직 직전 비정상적 급여 급인상(퇴직금 부풀리기) 회피',
      law: '국심 2007서2963 및 국세청 예규',
      desc: '퇴직 직전 급여를 합리적 근거 없이 2~3배 인상하여 퇴직금을 인위적으로 늘리는 행위는 실질과세 원칙에 따라 부인될 위험이 높습니다.',
    },
    {
      id: 'item5',
      title: '원천징수 신고 시 퇴직소득과 근로소득(상여) 분리 신고',
      law: '소득세법 제127조 및 제164조',
      desc: '2.0배 초과액 발생 시 반드시 퇴직소득 원천징수와 근로소득(상여) 지급명세서를 구분 발행하여 원천징수 불이행 가산세를 예방해야 합니다.',
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <section>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        {/* Header */}
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              기업 세무 필수 체크리스트 & 손금 인정 요건
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-md px-2.5 py-0.5">
              {completedCount} / {checklist.length} 점검 완료
            </span>
            <button
              type="button"
              className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Checklist"
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        {isOpen && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {checklist.map((item) => {
              const isChecked = checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer select-none flex items-start gap-2.5 border ${
                    isChecked
                      ? 'bg-purple-50/30 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/80'
                      : 'bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-purple-600 text-white'
                          : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-transparent'
                      }`}
                    >
                      <CheckSquare className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-xs font-bold ${
                          isChecked ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                        {item.law}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}

            {/* Tax expert advice note */}
            <div className="mt-3 p-3 bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <AlertOctagon className="w-4 h-4 text-purple-700 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-950 dark:text-purple-200 font-bold">세무 파트너 종합 소견:</strong>
                <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300">
                  임원 퇴직금은 세무조사 시 국세청의 핵심 검토 대상입니다. 정관 결의 부재 시 지급액 전체가 손금불산입되어 법인세가 추징되고 대표자
                  상여 처분 위험이 따르므로, 퇴직 전 정관 및 주총 의사록의 유효성을 반드시 사전 검토하십시오.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
