import type { News } from '../types'
import { publicFetch, apiFetch } from './client'

export const newsApi = {
  /** Tüm aktif haberleri getir */
  async getAllNews(): Promise<News[]> {
    try {
      return await publicFetch<News[]>('/api/v1/news')
    } catch {
      return []
    }
  },

  /** Son 5 haberi getir (dashboard) */
  async getLatestNews(): Promise<News[]> {
    try {
      return await publicFetch<News[]>('/api/v1/news/latest')
    } catch {
      return []
    }
  },

  /** ID'ye göre haber */
  async getNewsById(id: number): Promise<News> {
    return publicFetch<News>(`/api/v1/news/${id}`)
  },

  /** Kategoriye göre haber */
  async getNewsByCategory(category: string): Promise<News[]> {
    try {
      return await publicFetch<News[]>(`/api/v1/news/category/${category}`)
    } catch {
      return []
    }
  },

  /** Yeni haber oluştur (auth gerekli) */
  async createNews(news: Omit<News, 'id' | 'publishedDate' | 'isActive' | 'userId'>): Promise<News> {
    return apiFetch<News>('/api/v1/news', { method: 'POST', body: JSON.stringify(news) })
  },

  /** Haber güncelle (auth gerekli) */
  async updateNews(id: number, news: Omit<News, 'id' | 'publishedDate' | 'isActive' | 'userId'>): Promise<News> {
    return apiFetch<News>(`/api/v1/news/${id}`, { method: 'PUT', body: JSON.stringify(news) })
  },

  /** Haber sil — soft delete (auth gerekli) */
  async deleteNews(id: number): Promise<void> {
    return apiFetch<void>(`/api/v1/news/${id}`, { method: 'DELETE' })
  },
}
