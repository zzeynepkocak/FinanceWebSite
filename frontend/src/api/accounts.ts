import type { Account } from '../types';
import { apiFetch } from '../api/client';
import { mockAccountsApi } from '../utils/mockApi';

export const accountsApi = {
  // Kullanıcının tüm hesaplarını getir
  async getMyAccounts(): Promise<Account[]> {
    try {
      return await apiFetch<Account[]>('/api/v1/accounts');
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      return await mockAccountsApi.getMyAccounts();
    }
  },

  // ID'ye göre hesap getir
  async getAccountById(id: number): Promise<Account> {
    try {
      return await apiFetch<Account>(`/api/v1/accounts/${id}`);
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      return await mockAccountsApi.getAccountById(id);
    }
  },

  // Yeni hesap oluştur
  async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
    return apiFetch<Account>('/api/v1/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  },
};
