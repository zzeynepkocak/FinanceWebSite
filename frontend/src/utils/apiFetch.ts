import { getAuthHeaders } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

export interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export class ApiError extends Error {
  public status: number;
  public data?: any;

  constructor(
    message: string,
    status: number,
    data?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiFetch = async <T = any>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> => {
  const { skipAuth = false, ...fetchOptions } = options;
  
  try {
    // Headers oluştur
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Authentication ekle (skipAuth false ise)
    if (!skipAuth) {
      const authHeaders = await getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    // URL'i birleştir
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${API_BASE_URL}${endpoint}`;

    // Fetch isteği
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Response handling
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData: any;

      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // JSON parse edilemezse default mesaj kullan
      }

      // Specific error handling
      switch (response.status) {
        case 401:
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          // Token'ı temizle
          localStorage.removeItem('token');
          // Mock modda yönlendirme yapma; gerçek modda /giris'e yönlendir
          if (import.meta.env.VITE_MOCK_AUTH !== 'true') {
            window.location.href = '/giris';
          }
          break;
        case 403:
          errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
          break;
        case 404:
          errorMessage = 'İstenen kaynak bulunamadı.';
          break;
        case 422:
          errorMessage = 'Girdiğiniz bilgiler geçersiz.';
          break;
        case 500:
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
          break;
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    // Response'ı parse et
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // JSON değilse text olarak dön
    return (await response.text()) as unknown as T;

  } catch (error) {
    // Network error veya ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.',
        0
      );
    }

    // Diğer hatalar
    throw new ApiError(
      error instanceof Error ? error.message : 'Bilinmeyen hata',
      0
    );
  }
};

// HTTP method helper'ları
export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: any, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }),

  put: <T>(endpoint: string, data?: any, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }),

  delete: <T>(endpoint: string, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
