// Finnhub API integration for real-time market data

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

interface Quote {
  current: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
}

interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  market_capitalization: number;
  name: string;
  phone: string;
  share_outstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

interface MarketNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface CandleData {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  t: number[]; // Timestamps
  s: string;   // Status
}

export const finnhubApi = {
  // Get real-time quote for a symbol
  async getQuote(symbol: string): Promise<Quote> {
    const response = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch quote for ${symbol}: ${response.statusText}`);
    }
    return response.json();
  },

  // Get company profile
  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const response = await fetch(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch company profile for ${symbol}: ${response.statusText}`);
    }
    return response.json();
  },

  // Get market news
  async getMarketNews(category = 'general', minId = 0): Promise<MarketNews[]> {
    const response = await fetch(`${FINNHUB_BASE_URL}/news?category=${category}&minId=${minId}&token=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch market news: ${response.statusText}`);
    }
    return response.json();
  },

  // Get candle data for charting
  async getCandleData(symbol: string, resolution = 'D', from: number, to: number): Promise<CandleData> {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch candle data for ${symbol}: ${response.statusText}`);
    }
    return response.json();
  },

  // Get multiple symbols data (batch request)
  async getBatchQuotes(symbols: string[]): Promise<Record<string, Quote>> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    const quotes = await Promise.all(promises);
    
    return symbols.reduce((acc, symbol, index) => {
      acc[symbol] = quotes[index];
      return acc;
    }, {} as Record<string, Quote>);
  },

  // Get forex rates
  async getForexRates(symbol: string): Promise<Quote> {
    return this.getQuote(symbol);
  },

  // Get crypto prices
  async getCryptoPrice(symbol: string): Promise<Quote> {
    return this.getQuote(symbol);
  }
};

// Helper functions for common use cases
export const finnhubHelpers = {
  // Format currency
  formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format percentage
  formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  },

  // Calculate price change
  calculatePriceChange(current: number, previous: number): { amount: number; percentage: number } {
    const amount = current - previous;
    const percentage = (amount / previous) * 100;
    return { amount, percentage };
  },

  // Get Turkish market symbols
  getTurkishSymbols(): Record<string, string> {
    return {
      'USD/TRY': 'FX:USDTRY',
      'EUR/TRY': 'FX:EURTRY',
      'GBP/TRY': 'FX:GBPTRY',
      'BIST 100': 'XU100.IS',
      'GARAN': 'GARAN.IS',
      'AKBNK': 'AKBNK.IS',
      'THYAO': 'THYAO.IS',
      'KCHOL': 'KCHOL.IS',
      'SAHOL': 'SAHOL.IS',
    };
  },

  // Convert Turkish symbol to Finnhub symbol
  toFinnhubSymbol(turkishSymbol: string): string {
    const symbolMap = this.getTurkishSymbols();
    return symbolMap[turkishSymbol] || turkishSymbol;
  }
};
