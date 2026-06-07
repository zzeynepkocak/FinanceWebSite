/**
 * Auth yardımcıları — KeycloakProvider üzerinden token alır.
 * window.keycloak JS adaptörü artık kullanılmıyor.
 */

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = (await window.__getKeycloakToken?.()) ?? null
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem('fallback_token', token)
}

export const removeAuthToken = (): void => {
  localStorage.removeItem('fallback_token')
}

export const isAuthenticated = (): boolean =>
  !!window.__getKeycloakToken || !!localStorage.getItem('fallback_token')
