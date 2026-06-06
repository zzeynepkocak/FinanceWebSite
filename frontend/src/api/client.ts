const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8081'

declare global {
  interface Window {
    keycloak?: Record<string, unknown>
    __getKeycloakToken?: () => Promise<string | null>
  }
}

/** Backend sarmalı — tüm API endpoint'leri bu yapıyla döner */
interface ApiResponse<T> {
  success: boolean
  message?: string | null
  data: T
}

/** ApiResponse sarmalını açar; ham veri dönüyorsa olduğu gibi döner */
function unwrap<T>(json: unknown): T {
  if (
    json !== null &&
    typeof json === 'object' &&
    'success' in json &&
    'data' in json
  ) {
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
  let token: string | null = null

  try {
    const kc = window.keycloak
    if (kc && kc['authenticated']) {
      // Süresi dolmuşsa yenile
      if (typeof kc['isTokenExpired'] === 'function' && (kc['isTokenExpired'] as (n: number) => boolean)(5)) {
        await (kc['updateToken'] as (n: number) => Promise<boolean>)(30)
      }
      token = (kc['token'] as string) ?? null
    }

    if (!token) {
      token = (await window.__getKeycloakToken?.()) ?? null
    }
  } catch {
    // token alınamazsa devam et — backend local profilde auth istemez
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    if (res.status === 401 && window.keycloak) {
      const login = window.keycloak['login'] as (() => void) | undefined
      login?.()
    }
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  const ct = res.headers.get('content-type')
  if (!ct?.includes('application/json')) return undefined as T
  return unwrap<T>(await res.json())
}

export { API_BASE }
