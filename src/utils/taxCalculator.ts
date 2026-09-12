import { CalculationResult } from '../types';

/**
 * Calculates total service months and years according to Korean tax law.
 * 소득세법 시행령 제40조: 1년 미만의 기간은 월수로 계산하되, 1개월 미만은 1개월로 절상.
 */
export function calculateServiceDuration(startDateStr: string, endDateStr: string): {
  totalMonths: number;
  years: number;
  months: number;
  days: number;
  serviceYearsDecimal: number;
  displayStr: string;
} {
  if (!startDateStr || !endDateStr) {
    return {
      totalMonths: 0,
      years: 0,
      months: 0,
      days: 0,
      serviceYearsDecimal: 0,
      displayStr: '0년 0개월',
    };
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return {
      totalMonths: 0,
      years: 0,
      months: 0,
      days: 0,
      serviceYearsDecimal: 0,
      displayStr: '기간 오류',
    };
  }

  let startYear = start.getFullYear();
  let startMonth = start.getMonth();
  let startDay = start.getDate();

  let endYear = end.getFullYear();
  let endMonth = end.getMonth();
  let endDay = end.getDate();

  let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
  let dayDiff = endDay - startDay + 1; // inclusive of end date

  if (dayDiff > 0) {
    // 1개월 미만의 일수는 1개월로 절상 (소득세법 시행령 제40조)
    totalMonths += 1;
  } else if (dayDiff < 0) {
    // Days didn't reach a full month, but remaining days still count as 1 month under tax law
    // So months remain totalMonths (which had 1 less full month + 1 rounded up)
    // totalMonths is already correct
  }

  totalMonths = Math.max(1, totalMonths);
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  const serviceYearsDecimal = totalMonths / 12;

  const displayStr = `${years}년 ${remainingMonths}개월`;

  return {
    totalMonths,
    years,
    months: remainingMonths,
    days: Math.max(0, dayDiff),
    serviceYearsDecimal,
    displayStr,
  };
}

/**
 * Format numbers with comma and Korean currency notation
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '0원';
  return Math.round(amount).toLocaleString('ko-KR') + '원';
}

/**
 * Convert number to natural Korean reading (예: 3억 9,900만 원)
 */
export function formatKoreanWon(amount: number): string {
  if (isNaN(amount) || amount === 0) return '0원';
  const isNegative = amount < 0;
  const absAmount = Math.round(Math.abs(amount));

  const eok = Math.floor(absAmount / 100000000);
  const man = Math.floor((absAmount % 100000000) / 10000);
  const won = absAmount % 10000;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString()}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (won > 0 && eok === 0 && man === 0) parts.push(`${won.toLocaleString()}`);

  const formatted = parts.join(' ') + ' 원';
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Main Executive Severance Pay & Tax Calculation Engine
 */
export function calculateExecutiveSeverancePay(params: {
  startDate: string;
  endDate: string;
  salaryYear1: number;
  salaryYear2: number;
  salaryYear3: number;
  multiple: number;
  hasArticlesRule: boolean;
  hasShareholderApproval: boolean;
}): CalculationResult {
  const {
    startDate,
    endDate,
    salaryYear1,
    salaryYear2,
    salaryYear3,
    multiple,
    hasArticlesRule,
  } = params;

  // 1. 근속 기간 계산
  const duration = calculateServiceDuration(startDate, endDate);
  const serviceYears = duration.serviceYearsDecimal;

  // 2. 최근 3개년 연평균 급여액 = (1년차 + 2년차 + 3년차) / 3
  const total3YearSalary = (salaryYear1 || 0) + (salaryYear2 || 0) + (salaryYear3 || 0);
  const averageAnnualSalary = Math.round(total3YearSalary / 3);
  const oneTenthAverageSalary = averageAnnualSalary * 0.1;

  // 3. 사내 규정 퇴직금 총액 = 연평균 급여액 × 10% × 근속년수 × 정관 지급 배수
  const safeMultiple = Math.max(0, multiple || 0);
  const companySeverancePay = Math.round(
    averageAnnualSalary * 0.1 * serviceYears * safeMultiple
  );

  // 4. 소득세법상 임원 퇴직소득 한도액 (제22조 제3항, 2020년 이후 2.0배 기준)
  const TAX_LAW_MULTIPLE = 2.0;
  const taxLawLimitPay = Math.round(
    averageAnnualSalary * 0.1 * serviceYears * TAX_LAW_MULTIPLE
  );

  // 5. 과세 구분 및 손금 판정
  // 퇴직소득 인정액 (분류과세 대상) = Min(사내 규정 퇴직금, 소득세법 한도액)
  const retirementIncomeApproved = Math.min(companySeverancePay, taxLawLimitPay);

  // 근로소득 전환액 (상여/종합과세 대상) = Max(0, 사내 규정 퇴직금 - 소득세법 한도액)
  const excessAmount = Math.max(0, companySeverancePay - taxLawLimitPay);
  const earnedIncomeConverted = excessAmount;

  const isExceeded = excessAmount > 0;
  const excessRate =
    taxLawLimitPay > 0
      ? Math.round((excessAmount / taxLawLimitPay) * 1000) / 10
      : 0;

  // 법인세 손금 인정액
  // 정관 또는 주총 결의 규정에 근거한 금액이면 전액 손금산입 (법인세법 시행령 제44조)
  // 단, 정관 규정이 부존재하면 법정 기본한도(1.0배 등) 초과분 손금불산입
  let corporateTaxDeductible = 0;
  let corporateTaxNonDeductible = 0;

  if (hasArticlesRule) {
    corporateTaxDeductible = companySeverancePay;
    corporateTaxNonDeductible = 0;
  } else {
    // 정관 규정이 없는 경우 법인세법상 임원 퇴직금 한도는 연평균급여 × 10% × 근속연수 (즉 1.0배)
    const statutoryCorporateLimit = Math.round(averageAnnualSalary * 0.1 * serviceYears * 1.0);
    corporateTaxDeductible = Math.min(companySeverancePay, statutoryCorporateLimit);
    corporateTaxNonDeductible = Math.max(0, companySeverancePay - statutoryCorporateLimit);
  }

  // 세액 효과 추정치 (퇴직소득 분류과세 실효세율 ~14% vs 종합근로소득 최고구간 실효세율 ~42%)
  const estimatedRetirementTaxRate = 0.14;
  const estimatedEarnedIncomeTaxRate = 0.418; // 38% 누진세율 + 지방소득세 10%
  const taxBurdenIncreaseEstimate = Math.round(
    excessAmount * (estimatedEarnedIncomeTaxRate - estimatedRetirementTaxRate)
  );

  return {
    totalMonths: duration.totalMonths,
    serviceYears,
    serviceYearsDisplay: duration.displayStr,
    averageAnnualSalary,
    oneTenthAverageSalary,
    companySeverancePay,
    taxLawLimitPay,
    retirementIncomeApproved,
    earnedIncomeConverted,
    corporateTaxDeductible,
    corporateTaxNonDeductible,
    isExceeded,
    excessAmount,
    excessRate,
    estimatedRetirementTaxRate,
    estimatedEarnedIncomeTaxRate,
    taxBurdenIncreaseEstimate,
  };
}

/**
 * 대한민국 법인세율 계산 함수 (지방소득세 10% 포함)
 * 2023년 세법 개정 기준:
 * - 2억원 이하: 9.0% (지방소득세 0.9% 가산시 9.9%)
 * - 2억원 초과 ~ 200억원 이하: 19.0% (지방소득세 1.9% 가산시 20.9%)
 * - 200억원 초과 ~ 3,000억원 이하: 21.0% (지방소득세 2.1% 가산시 23.1%)
 */
export function calculateCorporateTax(taxBase: number): {
  taxBase: number;
  nationalTax: number;
  localTax: number;
  totalTax: number;
  effectiveRate: number;
} {
  const base = Math.max(0, Math.round(taxBase));
  if (base === 0) {
    return { taxBase: 0, nationalTax: 0, localTax: 0, totalTax: 0, effectiveRate: 0 };
  }

  let nationalTax = 0;
  if (base <= 200000000) {
    nationalTax = base * 0.09;
  } else if (base <= 20000000000) {
    nationalTax = 200000000 * 0.09 + (base - 200000000) * 0.19;
  } else {
    nationalTax =
      200000000 * 0.09 +
      (20000000000 - 200000000) * 0.19 +
      (base - 20000000000) * 0.21;
  }

  nationalTax = Math.round(nationalTax);
  const localTax = Math.round(nationalTax * 0.1);
  const totalTax = nationalTax + localTax;
  const effectiveRate = base > 0 ? (totalTax / base) * 100 : 0;

  return { taxBase: base, nationalTax, localTax, totalTax, effectiveRate };
}

export interface CorporateTaxSavingsResult {
  profitBefore: number;
  profitAfter: number;
  deductibleSeverance: number;
  taxBaseReduction: number;
  taxBefore: ReturnType<typeof calculateCorporateTax>;
  taxAfter: ReturnType<typeof calculateCorporateTax>;
  taxSaving: number;
  effectiveSavingRate: number;
}

/**
 * 퇴직금 손금산입에 따른 연간 영업이익 대비 법인세 절감액 추정
 */
export function calculateCorporateTaxSavings(
  operatingProfit: number,
  deductibleSeverance: number
): CorporateTaxSavingsResult {
  const profitBefore = Math.max(0, Math.round(operatingProfit));
  const safeDeductible = Math.max(0, Math.round(deductibleSeverance));
  const profitAfter = Math.max(0, profitBefore - safeDeductible);

  const taxBefore = calculateCorporateTax(profitBefore);
  const taxAfter = calculateCorporateTax(profitAfter);

  const taxSaving = Math.max(0, taxBefore.totalTax - taxAfter.totalTax);
  const taxBaseReduction = profitBefore - profitAfter;
  const effectiveSavingRate =
    taxBaseReduction > 0 ? (taxSaving / taxBaseReduction) * 100 : 0;

  return {
    profitBefore,
    profitAfter,
    deductibleSeverance: safeDeductible,
    taxBaseReduction,
    taxBefore,
    taxAfter,
    taxSaving,
    effectiveSavingRate,
  };
}

