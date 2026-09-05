export interface ExecutiveInfo {
  name: string;
  position: string;
  companyName: string;
}

export interface ServicePeriod {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface SalaryHistory {
  year1: number; // 직전 1년차 (원)
  year2: number; // 직전 2년차 (원)
  year3: number; // 직전 3년차 (원)
  inputUnit: 'KRW' | 'MANWON'; // 원 vs 만원 입력 단위
}

export interface ArticlesRegulation {
  multiple: number; // 지급 배수 (예: 3.0)
  hasArticlesRule: boolean; // 정관 또는 정관위임 규정 구비 여부
  hasShareholderApproval: boolean; // 주주총회 결의 구비 여부
}

export interface CalculationResult {
  // 근속 계산
  totalMonths: number;
  serviceYears: number; // totalMonths / 12
  serviceYearsDisplay: string; // "7년 6개월"
  
  // 급여 계산
  averageAnnualSalary: number; // 최근 3개년 연평균 급여액
  oneTenthAverageSalary: number; // 연평균 급여액의 10%
  
  // 지급액 및 한도액
  companySeverancePay: number; // 사내 규정 퇴직금 총액
  taxLawLimitPay: number; // 소득세법상 한도액 (2.0배 기준)
  
  // 과세 구분
  retirementIncomeApproved: number; // 퇴직소득 인정액 (분류과세)
  earnedIncomeConverted: number; // 근로소득 전환액 (종합과세/상여)
  corporateTaxDeductible: number; // 법인세 손금 인정액
  corporateTaxNonDeductible: number; // 법인세 손금불산입액 (정관 미비 시)
  
  // 진단 및 상태
  isExceeded: boolean;
  excessAmount: number;
  excessRate: number; // 초과 비율 (%)
  
  // 예상 세액 영향 시뮬레이션
  estimatedRetirementTaxRate: number; // 대략적 퇴직소득 실효세율 (~12-15%)
  estimatedEarnedIncomeTaxRate: number; // 대략적 근로소득 실효세율 (38~45% 누진)
  taxBurdenIncreaseEstimate: number; // 근로소득 전환에 따른 추가 세부담 추정액
}
