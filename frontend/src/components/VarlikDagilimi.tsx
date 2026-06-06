import React, { useState, useEffect } from 'react';
import type { Asset } from '../types';
import { api } from '../utils/apiFetch';

const VarlikDagilimi: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const userAssets = await api.get<Asset[]>('/api/assets');
        setAssets(userAssets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Varlıklar yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Varlık bazında toplam değer hesapla
  const assetDistribution = assets.map(asset => ({
    id: asset.id,
    name: asset.assetName,
    symbol: asset.assetSymbol,
    quantity: asset.quantity,
    purchasePrice: asset.purchasePrice,
    totalValue: asset.quantity * asset.purchasePrice
  }));

  // Toplam portföy değeri
  const totalPortfolioValue = assetDistribution.reduce((sum, asset) => sum + asset.totalValue, 0);

  // Yüzde dağılımı hesapla
  const distributionWithPercentage = assetDistribution.map(asset => ({
    ...asset,
    percentage: totalPortfolioValue > 0 ? (asset.totalValue / totalPortfolioValue) * 100 : 0
  }));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Varlık Dağılımı</h3>
      
      {assets.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Henüz varlık eklenmemiş.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Toplam Değer */}
          <div className="border-b pb-3">
            <p className="text-sm text-gray-600 mb-1">Toplam Varlık Değeri</p>
            <p className="text-xl font-bold text-gray-900">
              ₺{totalPortfolioValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Varlık Listesi */}
          <div className="space-y-3">
            {distributionWithPercentage.map((asset) => (
              <div key={asset.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{asset.name}</p>
                    <p className="text-sm text-gray-500">{asset.symbol} • {asset.quantity} adet</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₺{asset.totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">%{asset.percentage.toFixed(1)}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${asset.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Özet */}
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Varlık Sayısı</span>
              <span className="font-medium text-gray-900">{assets.length} farklı varlık</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VarlikDagilimi;
