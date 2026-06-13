export type SupportedLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
};

export type SupportedCurrency = {
  code: string;
  label: string;
  symbol: string;
  locale: string;
  usdRate: number;
};

export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_CURRENCY = 'USD';
export const IDR_PER_USD = 15500;

export const supportedLanguages: SupportedLanguage[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'nl', label: 'Dutch', nativeLabel: 'Nederlands' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'th', label: 'Thai', nativeLabel: 'ไทย' },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt' },
];

export const supportedCurrencies: SupportedCurrency[] = [
  { code: 'USD', label: 'United States Dollar', symbol: '$', locale: 'en-US', usdRate: 1 },
  { code: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp', locale: 'id-ID', usdRate: IDR_PER_USD },
  { code: 'EUR', label: 'Euro', symbol: '€', locale: 'de-DE', usdRate: 0.92 },
  { code: 'GBP', label: 'British Pound', symbol: '£', locale: 'en-GB', usdRate: 0.79 },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', usdRate: 1.52 },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA', usdRate: 1.37 },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG', usdRate: 1.34 },
  { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM', locale: 'ms-MY', usdRate: 4.72 },
  { code: 'PHP', label: 'Philippine Peso', symbol: '₱', locale: 'en-PH', usdRate: 56.8 },
  { code: 'THB', label: 'Thai Baht', symbol: '฿', locale: 'th-TH', usdRate: 36.4 },
  { code: 'VND', label: 'Vietnamese Dong', symbol: '₫', locale: 'vi-VN', usdRate: 25400 },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥', locale: 'ja-JP', usdRate: 157 },
  { code: 'KRW', label: 'South Korean Won', symbol: '₩', locale: 'ko-KR', usdRate: 1380 },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹', locale: 'en-IN', usdRate: 83.5 },
  { code: 'CNY', label: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN', usdRate: 7.25 },
  { code: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$', locale: 'zh-HK', usdRate: 7.81 },
  { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ', locale: 'ar-AE', usdRate: 3.67 },
  { code: 'SAR', label: 'Saudi Riyal', symbol: '﷼', locale: 'ar-SA', usdRate: 3.75 },
  { code: 'ZAR', label: 'South African Rand', symbol: 'R', locale: 'en-ZA', usdRate: 18.4 },
  { code: 'BRL', label: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR', usdRate: 5.2 },
  { code: 'MXN', label: 'Mexican Peso', symbol: 'MX$', locale: 'es-MX', usdRate: 18.1 },
];

const translationMap: Record<string, Record<string, string>> = {
  en: {
    marketplace: 'Marketplace',
    discover: 'Discover digital products, services, and goods from verified creators.',
    search: 'Search products, services...',
    showing: 'Showing',
    products: 'products',
    buyNow: 'Buy Now',
    priceEstimate: 'Currency preview',
    globalReady: 'Global-ready language and currency layer enabled.',
  },
  id: {
    marketplace: 'Marketplace',
    discover: 'Temukan produk digital, jasa, dan barang dari kreator terverifikasi.',
    search: 'Cari produk, jasa...',
    showing: 'Menampilkan',
    products: 'produk',
    buyNow: 'Beli Sekarang',
    priceEstimate: 'Pratinjau mata uang',
    globalReady: 'Lapisan bahasa dan mata uang global sudah aktif.',
  },
  es: {
    marketplace: 'Mercado',
    discover: 'Descubre productos digitales, servicios y bienes de creadores verificados.',
    search: 'Buscar productos, servicios...',
    showing: 'Mostrando',
    products: 'productos',
    buyNow: 'Comprar ahora',
    priceEstimate: 'Vista de moneda',
    globalReady: 'Capa global de idioma y moneda activada.',
  },
  fr: {
    marketplace: 'Marché',
    discover: 'Découvrez des produits numériques, services et biens de créateurs vérifiés.',
    search: 'Rechercher des produits, services...',
    showing: 'Affichage',
    products: 'produits',
    buyNow: 'Acheter',
    priceEstimate: 'Aperçu devise',
    globalReady: 'Couche globale langue et devise activée.',
  },
};

export function getCurrency(code: string) {
  return supportedCurrencies.find((currency) => currency.code === code) || supportedCurrencies[0];
}

export function getLanguage(code: string) {
  return supportedLanguages.find((language) => language.code === code) || supportedLanguages[0];
}

export function translate(languageCode: string, key: string) {
  return translationMap[languageCode]?.[key] || translationMap.en[key] || key;
}

export function convertMoney(amount: number, fromCurrencyCode = 'IDR', toCurrencyCode = DEFAULT_CURRENCY) {
  const fromCurrency = getCurrency(fromCurrencyCode);
  const toCurrency = getCurrency(toCurrencyCode);
  const amountInUsd = fromCurrency.code === 'USD' ? amount : amount / fromCurrency.usdRate;
  return amountInUsd * toCurrency.usdRate;
}

export function formatMoney(amount: number, currencyCode = DEFAULT_CURRENCY) {
  const currency = getCurrency(currencyCode);
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: ['IDR', 'VND', 'JPY', 'KRW'].includes(currency.code) ? 0 : 2,
  }).format(amount);
}

export function loadGlobalPreference(key: 'omnihub_language' | 'omnihub_currency', fallback: string) {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(key) || fallback;
}

export function saveGlobalPreference(key: 'omnihub_language' | 'omnihub_currency', value: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
}
