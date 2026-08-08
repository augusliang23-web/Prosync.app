import { Currency, Project } from '../types';

export interface CurrencyConfig {
  code: Currency;
  name: string;
  symbol: string;
  rateToTWD: number; // 1 unit of specified currency = X TWD
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  TWD: { code: 'TWD', name: '新台幣 (TWD)', symbol: 'NT$', rateToTWD: 1 },
  USD: { code: 'USD', name: '美元 (USD)', symbol: '$', rateToTWD: 32.5 },
  EUR: { code: 'EUR', name: '歐元 (EUR)', symbol: '€', rateToTWD: 35.0 },
  JPY: { code: 'JPY', name: '日圓 (JPY)', symbol: '¥', rateToTWD: 0.215 },
  CNY: { code: 'CNY', name: '人民幣 (CNY)', symbol: '¥', rateToTWD: 4.5 },
};

export const CURRENCY_LIST: CurrencyConfig[] = [
  CURRENCIES.TWD,
  CURRENCIES.USD,
  CURRENCIES.EUR,
  CURRENCIES.JPY,
  CURRENCIES.CNY,
];

/**
 * Convert an amount from one currency to another target currency.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency = 'TWD',
  toCurrency: Currency = 'TWD'
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = CURRENCIES[fromCurrency]?.rateToTWD || 1;
  const toRate = CURRENCIES[toCurrency]?.rateToTWD || 1;
  const amountInTWD = amount * fromRate;
  return amountInTWD / toRate;
}

/**
 * Format currency with proper symbol and formatting options.
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'TWD',
  compact: boolean = false
): string {
  const config = CURRENCIES[currency] || CURRENCIES.TWD;
  
  if (compact) {
    if (amount >= 100000000) {
      return `${config.symbol} ${(amount / 100000000).toFixed(2)}億`;
    }
    if (amount >= 1000000) {
      if (currency === 'USD' || currency === 'EUR') {
        return `${config.symbol} ${(amount / 1000000).toFixed(2)}M`;
      }
      return `${config.symbol} ${(amount / 10000).toFixed(0)}萬`;
    }
    if (amount >= 10000) {
      return `${config.symbol} ${(amount / 10000).toFixed(1)}萬`;
    }
  }

  // Standard formatting
  return `${config.symbol} ${Math.round(amount).toLocaleString()}`;
}

/**
 * Aggregate portfolio budget figures converted to executive's chosen currency
 */
export function calculateExecutivePortfolioBudget(
  projects: Project[],
  targetCurrency: Currency = 'TWD'
) {
  let totalAllocatedInTarget = 0;
  let totalSpentInTarget = 0;

  projects.forEach((p) => {
    const pCurrency = p.currency || 'TWD';
    const totalInTarget = convertCurrency(p.totalBudget, pCurrency, targetCurrency);
    const spentInTarget = convertCurrency(p.spentBudget, pCurrency, targetCurrency);

    totalAllocatedInTarget += totalInTarget;
    totalSpentInTarget += spentInTarget;
  });

  const remainingInTarget = totalAllocatedInTarget - totalSpentInTarget;
  const spentRatio = totalAllocatedInTarget > 0 ? (totalSpentInTarget / totalAllocatedInTarget) * 100 : 0;

  return {
    totalAllocatedInTarget,
    totalSpentInTarget,
    remainingInTarget,
    spentRatio: Math.round(spentRatio),
    targetCurrency,
    currencyConfig: CURRENCIES[targetCurrency] || CURRENCIES.TWD,
  };
}
