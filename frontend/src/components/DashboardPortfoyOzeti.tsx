import React, { useState, useEffect } from 'react';
import type { Account } from '../types';
import { api } from '../utils/apiFetch';

const DashboardPortfoyOzeti: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const userAccounts = await api.get<Account[]>('/api/accounts');
        setAccounts(userAccounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Hesaplar yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Toplam bakiye hesapla
  const totalBalance = accounts.reduce((sum, account) => {
    return sum + account.balance;
  }, 0);

  // Kur bazında grupla
  const balanceByCurrency = accounts.reduce((acc, account) => {
    const currency = account.currencyType || 'TL';
    acc[currency] = (acc[currency] || 0) + account.balance;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Portföy Özeti</h3>
      
      <div className="space-y-4">
        {/* Toplam Bakiye */}
        <div className="border-b pb-4">
          <p className="text-sm text-gray-600 mb-1">Toplam Bakiye</p>
          <p className="text-2xl font-bold text-gray-900">
            ₺{totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Kur Bazında Dağılım */}
        <div>
          <p className="text-sm text-gray-600 mb-3">Kur Bazında Dağılım</p>
          <div className="space-y-2">
            {Object.entries(balanceByCurrency).map(([currency, amount]) => (
              <div key={currency} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{currency}</span>
                <span className="text-sm text-gray-900">
                  {currency === 'TL' ? '₺' : currency}{amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hesap Sayısı */}
        <div className="pt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Toplam Hesap</span>
            <span className="text-sm font-semibold text-gray-900">{accounts.length} hesap</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPortfoyOzeti;
