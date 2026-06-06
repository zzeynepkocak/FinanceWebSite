// Mock API responses for testing when backend is not available
import type { News, Account, Asset, LoanRequest } from '../types';

// Mock data
const mockNews: News[] = [
  {
    id: 1,
    title: "Merkez Bankası faiz kararı açıklandı",
    summary: "TCMB politika faizini 50 baz puan düşürdü",
    content: "Türkiye Cumhuriyet Merkez Bankası politika faizini 50 baz puan düşürerek yüzde 8.5'e indirdi. Karar enflasyon görünümündeki iyileşmeyle alakalı olarak alındı.",
    authorName: "TCMB",
    publishedDate: "2026-03-26T10:00:00Z",
    category: "Ekonomi",
    isActive: true,
    userId: "admin"
  },
  {
    id: 2,
    title: "Borsa günü yükselişle kapattı",
    summary: "BIST 100 endeksi yüzde 2.1 artışla kapandı",
    content: "Borsa İstanbul'da BIST 100 endeksi günü yüzde 2.1 artışla 9.500 puandan kapattı. Bankacılık ve teknoloji hisseleri öncülük etti.",
    authorName: "Borsa İstanbul",
    publishedDate: "2026-03-26T15:30:00Z",
    category: "Finans",
    isActive: true,
    userId: "admin"
  },
  {
    id: 3,
    title: "Dolar/TL'de düşüş devam ediyor",
    summary: "Dolar/TL 32.50 seviyesinde işlem görüyor",
    content: "Dolar/TL kuru haftanın son işlem gününde 32.50 seviyesinde işlem görüyor. Geçen hafta aynı seviyelerde 33.00 seviyesindeydi.",
    authorName: "Reuters",
    publishedDate: "2026-03-26T16:45:00Z",
    category: "Döviz",
    isActive: true,
    userId: "admin"
  }
];

const mockAccounts: Account[] = [
  {
    id: 1,
    accountName: "Vadesiz Hesap",
    balance: 15000.50,
    currencyType: "TRY",
    userId: "user1"
  },
  {
    id: 2,
    accountName: "Dolar Hesabı",
    balance: 2500.00,
    currencyType: "USD",
    userId: "user1"
  },
  {
    id: 3,
    accountName: "Euro Hesabı",
    balance: 1200.75,
    currencyType: "EUR",
    userId: "user1"
  }
];

const mockAssets: Asset[] = [
  {
    id: 1,
    assetName: "Garanti Bankası",
    assetSymbol: "GARAN",
    quantity: 100,
    purchasePrice: 45.50,
    userId: "user1"
  },
  {
    id: 2,
    assetName: "Türk Telekom",
    assetSymbol: "TTKOM",
    quantity: 500,
    purchasePrice: 8.25,
    userId: "user1"
  },
  {
    id: 3,
    assetName: "Aselsan",
    assetSymbol: "ASELS",
    quantity: 50,
    purchasePrice: 125.00,
    userId: "user1"
  }
];

const mockLoans: LoanRequest[] = [
  {
    id: 1,
    customerName: "Ahmet Yılmaz",
    loanAmount: 100000,
    userId: "user1"
  },
  {
    id: 2,
    customerName: "Mehmet Kaya",
    loanAmount: 75000,
    userId: "user1"
  }
];

// Mock API functions
export const mockNewsApi = {
  getAllNews: async (): Promise<News[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockNews;
  },
  getLatestNews: async (): Promise<News[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNews.slice(0, 5);
  },
  getNewsById: async (id: number): Promise<News> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const news = mockNews.find(n => n.id === id);
    if (!news) throw new Error('Haber bulunamadı');
    return news;
  },
  getNewsByCategory: async (category: string): Promise<News[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockNews.filter(n => n.category === category);
  }
};

export const mockAccountsApi = {
  getMyAccounts: async (): Promise<Account[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAccounts;
  },
  getAccountById: async (id: number): Promise<Account> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const account = mockAccounts.find(a => a.id === id);
    if (!account) throw new Error('Hesap bulunamadı');
    return account;
  }
};

export const mockAssetsApi = {
  getMyAssets: async (): Promise<Asset[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAssets;
  },
  getAssetById: async (id: number): Promise<Asset> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const asset = mockAssets.find(a => a.id === id);
    if (!asset) throw new Error('Varlık bulunamadı');
    return asset;
  },
  createAsset: async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAsset: Asset = {
      ...asset,
      id: mockAssets.length + 1
    };
    mockAssets.push(newAsset);
    return newAsset;
  }
};

export const mockLoansApi = {
  getMyLoans: async (): Promise<LoanRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLoans;
  },
  getLoanById: async (id: number): Promise<LoanRequest> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const loan = mockLoans.find(l => l.id === id);
    if (!loan) throw new Error('Kredi başvurusu bulunamadı');
    return loan;
  }
};
