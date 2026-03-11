export type LiquidityType = 'D+0' | 'D+1' | 'D+30' | 'no_vencimento';
export type InvestmentType = 'CDB' | 'LCI' | 'LCA' | 'RDB';
export type RiskLevel = 'baixo' | 'medio' | 'alto';

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  cdiRate: number;
  investmentType: InvestmentType;
  liquidity: LiquidityType;
  minimumAmount: number;
  fgcCovered: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendationScore: number;
  isRecommended: boolean;
  hasTax: boolean;
  description: string;
  rateHistory: number[];
  affiliateUrl: string;
}

export const LIQUIDITY_LABELS: Record<LiquidityType, { label: string; color: 'brand' | 'neutral' | 'warning' }> = {
  'D+0': { label: 'Saque quando quiser', color: 'brand' },
  'D+1': { label: 'Disponível amanhã', color: 'neutral' },
  'D+30': { label: 'Disponível em 30 dias', color: 'neutral' },
  'no_vencimento': { label: 'Só no vencimento', color: 'warning' },
};

export const INVESTMENT_LABELS: Record<InvestmentType, string> = {
  'CDB': 'CDB',
  'LCI': 'LCI — sem imposto',
  'LCA': 'LCA — sem imposto',
  'RDB': 'RDB',
};

export const BANKS: Bank[] = [
  {
    id: 'xp',
    name: 'XP Investimentos',
    shortName: 'XP',
    logo: 'XP',
    color: '#000000',
    cdiRate: 118.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 1000,
    fgcCovered: true,
    riskScore: 85,
    riskLevel: 'baixo',
    recommendationScore: 95,
    isRecommended: true,
    hasTax: true,
    description: 'Uma das maiores corretoras do Brasil, com portfólio completo de investimentos e alta segurança.',
    rateHistory: [115, 116, 115, 117, 118, 118],
    affiliateUrl: 'https://www.xp.com.br',
  },
  {
    id: 'btg',
    name: 'BTG Pactual',
    shortName: 'BTG',
    logo: 'BTG',
    color: '#1A1A6E',
    cdiRate: 115.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 5000,
    fgcCovered: true,
    riskScore: 90,
    riskLevel: 'baixo',
    recommendationScore: 88,
    isRecommended: false,
    hasTax: true,
    description: 'Maior banco de investimentos da América Latina. Sólido, confiável e com grandes rendimentos.',
    rateHistory: [112, 113, 114, 115, 115, 115],
    affiliateUrl: 'https://www.btgpactual.com',
  },
  {
    id: 'inter',
    name: 'Banco Inter',
    shortName: 'Inter',
    logo: 'IN',
    color: '#FF6900',
    cdiRate: 112.5,
    investmentType: 'CDB',
    liquidity: 'D+1',
    minimumAmount: 100,
    fgcCovered: true,
    riskScore: 78,
    riskLevel: 'baixo',
    recommendationScore: 82,
    isRecommended: false,
    hasTax: true,
    description: 'Banco digital com conta gratuita e investimentos acessíveis para qualquer valor.',
    rateHistory: [110, 111, 111, 112, 112, 112.5],
    affiliateUrl: 'https://www.bancointer.com.br',
  },
  {
    id: 'c6',
    name: 'C6 Bank',
    shortName: 'C6',
    logo: 'C6',
    color: '#242424',
    cdiRate: 110.0,
    investmentType: 'CDB',
    liquidity: 'D+0',
    minimumAmount: 0,
    fgcCovered: true,
    riskScore: 75,
    riskLevel: 'baixo',
    recommendationScore: 78,
    isRecommended: false,
    hasTax: true,
    description: 'Banco digital completo com investimentos a partir de R$ 0 e conta com cashback.',
    rateHistory: [108, 109, 109, 110, 110, 110],
    affiliateUrl: 'https://www.c6bank.com.br',
  },
  {
    id: 'rico',
    name: 'Rico Investimentos',
    shortName: 'Rico',
    logo: 'RC',
    color: '#00C2A8',
    cdiRate: 116.5,
    investmentType: 'LCI',
    liquidity: 'D+30',
    minimumAmount: 1000,
    fgcCovered: true,
    riskScore: 80,
    riskLevel: 'baixo',
    recommendationScore: 85,
    isRecommended: false,
    hasTax: false,
    description: 'Corretora com ótima variedade de CDBs, LCIs e LCAs sem imposto de renda.',
    rateHistory: [114, 115, 115, 116, 116.5, 116.5],
    affiliateUrl: 'https://www.rico.com.vc',
  },
  {
    id: 'nubank',
    name: 'Nubank',
    shortName: 'Nu',
    logo: 'NU',
    color: '#820AD1',
    cdiRate: 100.0,
    investmentType: 'RDB',
    liquidity: 'D+0',
    minimumAmount: 1,
    fgcCovered: true,
    riskScore: 82,
    riskLevel: 'baixo',
    recommendationScore: 72,
    isRecommended: false,
    hasTax: true,
    description: 'O banco roxo que todo mundo conhece. Fácil de usar, mas a taxa não é a melhor do mercado.',
    rateHistory: [100, 100, 100, 100, 100, 100],
    affiliateUrl: 'https://nubank.com.br',
  },
];

export const CURRENT_CDI_RATE = 10.75;

export function calculateReturn(
  principal: number,
  cdiPercent: number,
  months: number,
  hasTax: boolean
): { gross: number; net: number; monthly: number } {
  const annualRate = (CURRENT_CDI_RATE * cdiPercent) / 100 / 100;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const total = principal * Math.pow(1 + monthlyRate, months);
  const gross = total - principal;

  let taxRate = 0;
  if (hasTax) {
    if (months <= 6) taxRate = 0.225;
    else if (months <= 12) taxRate = 0.20;
    else if (months <= 24) taxRate = 0.175;
    else taxRate = 0.15;
  }

  const net = gross * (1 - taxRate);
  const monthly = net / months;

  return { gross, net, monthly };
}

export function calculateSavingsReturn(principal: number, months: number): number {
  const savingsRate = 0.005;
  return principal * Math.pow(1 + savingsRate, months) - principal;
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'baixo': return '#16A34A';
    case 'medio': return '#D97706';
    case 'alto': return '#DC2626';
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'baixo': return 'Baixo risco';
    case 'medio': return 'Médio risco';
    case 'alto': return 'Alto risco';
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}
