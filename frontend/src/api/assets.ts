import type { Asset } from '../types';
import { apiFetch } from '../api/client';
import { mockAssetsApi } from '../utils/mockApi';

export const assetsApi = {
  // Kullanıcının tüm varlıklarını getir
  async getMyAssets(): Promise<Asset[]> {
    try {
      return await apiFetch<Asset[]>('/api/v1/assets');
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      return await mockAssetsApi.getMyAssets();
    }
  },

  // ID'ye göre varlık getir
  async getAssetById(id: number): Promise<Asset> {
    try {
      return await apiFetch<Asset>(`/api/v1/assets/${id}`);
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      return await mockAssetsApi.getAssetById(id);
    }
  },

  // Yeni varlık oluştur
  async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
    try {
      return await apiFetch<Asset>('/api/v1/assets', {
        method: 'POST',
        body: JSON.stringify(asset),
      });
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      return await mockAssetsApi.createAsset(asset);
    }
  },
};
