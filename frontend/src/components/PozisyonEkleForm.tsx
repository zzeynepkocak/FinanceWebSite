import React, { useState } from 'react';
import type { Asset } from '../types';
import { api } from '../utils/apiFetch';

interface PozisyonEkleFormProps {
  onAssetAdded?: (asset: Asset) => void;
}

const PozisyonEkleForm: React.FC<PozisyonEkleFormProps> = ({ onAssetAdded }) => {
  const [formData, setFormData] = useState({
    assetName: '',
    assetSymbol: '',
    quantity: '',
    purchasePrice: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Form değiştiğinde hata ve success mesajlarını temizle
    setError(null);
    setSuccess(null);
  };

  const validateForm = (): boolean => {
    if (!formData.assetName.trim()) {
      setError('Varlık adı zorunludur');
      return false;
    }
    if (!formData.assetSymbol.trim()) {
      setError('Varlık sembolü zorunludur');
      return false;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setError('Adet 0\'dan büyük olmalıdır');
      return false;
    }
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      setError('Alış fiyatı 0\'dan büyük olmalıdır');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newAsset: Omit<Asset, 'id'> = {
        assetName: formData.assetName.trim(),
        assetSymbol: formData.assetSymbol.trim().toUpperCase(),
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        userId: '' // Backend tarafından doldurulacak
      };

      const createdAsset = await api.post<Asset>('/api/assets', newAsset);
      
      setSuccess('Varlık başarıyla eklendi!');
      
      // Form'u sıfırla
      setFormData({
        assetName: '',
        assetSymbol: '',
        quantity: '',
        purchasePrice: ''
      });

      // Parent component'i bilgilendir
      if (onAssetAdded) {
        onAssetAdded(createdAsset);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Varlık eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Varlık Ekle</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Varlık Adı */}
        <div>
          <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 mb-1">
            Varlık Adı
          </label>
          <input
            type="text"
            id="assetName"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            placeholder="Örn: Toyota Hisse"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Varlık Sembolü */}
        <div>
          <label htmlFor="assetSymbol" className="block text-sm font-medium text-gray-700 mb-1">
            Varlık Sembolü
          </label>
          <input
            type="text"
            id="assetSymbol"
            name="assetSymbol"
            value={formData.assetSymbol}
            onChange={handleChange}
            placeholder="Örn: TM"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            disabled={loading}
          />
        </div>

        {/* Adet */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Adet
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Örn: 100"
            step="0.01"
            min="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Alış Fiyatı */}
        <div>
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
            Alış Fiyatı (₺)
          </label>
          <input
            type="number"
            id="purchasePrice"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            placeholder="Örn: 150.50"
            step="0.01"
            min="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Başarı Mesajı */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {/* Submit Butonu */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Ekleniyor...' : 'Varlık Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PozisyonEkleForm;
