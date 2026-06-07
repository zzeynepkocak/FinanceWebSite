const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8081'

declare global {
  interface Window {
    __getKeycloakToken?: () => Promise<string | null>
  }
}

/** Backend sarmalı — tüm API endpoint'leri bu yapıyla döner */
interface ApiResponse<T> {
  success: boolean
  message?: string | null
  data: T
}

function unwrap<T>(json: unknown): T {
  if (json !== null && typeof json === 'object' && 'success' in json && 'data' in json) {
    const resp = json as ApiResponse<T>
    if (!resp.success) throw new Error(resp.message ?? 'API hatası')
    return resp.data
  }
  return json as T
}

/** Auth token'ı olmadan backend'e istek atar (public endpoint'ler için) */
export async function publicFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  })
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`)
  const ct = res.headers.get('content-type')
  if (!ct?.includes('application/json')) return undefined as T
  return unwrap<T>(await res.json())
}

/** Auth token gerektiren backend isteği */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = (await window.__getKeycloakToken?.()) ?? null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    // Mock modda yönlendirme yapma; gerçek modda /giris'e yönlendir
    if (res.status === 401 && import.meta.env.VITE_MOCK_AUTH !== 'true') {
      window.location.href = '/giris'
    }
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  const ct = res.headers.get('content-type')
  if (!ct?.includes('application/json')) return undefined as T
  return unwrap<T>(await res.json())
}

export { API_BASE }
