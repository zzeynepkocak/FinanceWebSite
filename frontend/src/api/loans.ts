import type { LoanRequest } from '../types';
import { apiFetch } from '../api/client';

export const loansApi = {
  // Kullanıcının tüm kredi başvurularını getir
  async getMyLoans(): Promise<LoanRequest[]> {
    return apiFetch<LoanRequest[]>('/api/v1/loans');
  },

  // ID'ye göre kredi başvurusu getir
  async getLoanById(id: number): Promise<LoanRequest> {
    return apiFetch<LoanRequest>(`/api/v1/loans/${id}`);
  },

  // Yeni kredi başvurusu oluştur
  async createLoan(loan: Omit<LoanRequest, 'id'>): Promise<LoanRequest> {
    return apiFetch<LoanRequest>('/api/v1/loans', {
      method: 'POST',
      body: JSON.stringify(loan),
    });
  },

  // Kredi başvurusu güncelle
  async updateLoan(id: number, loan: Omit<LoanRequest, 'id'>): Promise<LoanRequest> {
    return apiFetch<LoanRequest>(`/api/v1/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(loan),
    });
  },

  // Kredi başvurusu sil
  async deleteLoan(id: number): Promise<void> {
    return apiFetch<void>(`/api/v1/loans/${id}`, {
      method: 'DELETE',
    });
  },
};
