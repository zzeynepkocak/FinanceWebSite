// Keycloak tabanlı auth — geriye dönük uyumluluk için tutuldu

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await window.__getKeycloakToken?.()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export const isKeycloakInitialized = (): boolean =>
  !!(window.keycloak && window.keycloak['authenticated'])

export const getCurrentUserId = (): string | null => {
  if (!isKeycloakInitialized()) return null
  const kc = window.keycloak as Record<string, unknown>
  const parsed = kc['tokenParsed'] as Record<string, unknown> | undefined
  return (kc['subject'] as string) ?? (parsed?.['sub'] as string) ?? null
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem('fallback_token', token)
}

export const removeAuthToken = (): void => {
  localStorage.removeItem('fallback_token')
}

export const isAuthenticated = (): boolean =>
  isKeycloakInitialized() || !!localStorage.getItem('fallback_token')
