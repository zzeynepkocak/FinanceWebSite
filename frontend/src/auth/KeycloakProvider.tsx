import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

/* ─── Keycloak endpoint (Direct Access Grant) ─────────────────────── */
const KEYCLOAK_URL    = import.meta.env.VITE_KEYCLOAK_URL    ?? 'http://localhost:8080'
const KEYCLOAK_REALM  = import.meta.env.VITE_KEYCLOAK_REALM  ?? 'toyota-finance'
const KEYCLOAK_CLIENT = import.meta.env.VITE_KEYCLOAK_CLIENT ?? 'finance-portal-app'
const TOKEN_ENDPOINT  = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`

const isMockMode = import.meta.env.VITE_MOCK_AUTH === 'true'

/* ─── SessionStorage keys ─────────────────────────────────────────── */
const SK_MOCK_AUTH = 'fp_mock_auth'
const SK_MOCK_USER = 'fp_mock_user'
const SK_TOKEN     = 'fp_access_token'
const SK_REFRESH   = 'fp_refresh_token'
const SK_USER      = 'fp_user'

/* ─── Types ───────────────────────────────────────────────────────── */
type User = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

type AuthContextValue = {
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  user: User | null
  login: (username?: string, password?: string) => Promise<void>
  logout: () => void
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/* ─── Mock kullanıcı üretici ──────────────────────────────────────── */
function mockUserFromUsername(username: string): User {
  const parts     = username.trim().split(/\s+/)
  const firstName = parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1).toLowerCase() : 'Kullanıcı'
  const lastName  = parts[1] ? parts[1][0].toUpperCase() + parts[1].slice(1).toLowerCase() : ''
  const slug      = username.toLowerCase().replace(/\s+/g, '.')
  return {
    id:        `mock-${slug}-001`,
    username:  slug || 'kullanici',
    email:     `${slug || 'kullanici'}@toyota-finans.com.tr`,
    firstName,
    lastName,
    roles: ['user'],
  }
}

/* ─── JWT → User ──────────────────────────────────────────────────── */
function parseJwt(token: string): Record<string, unknown> {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(b64))
  } catch {
    return {}
  }
}

function userFromToken(token: string): User {
  const tp = parseJwt(token)
  return {
    id:        (tp['sub']                as string) ?? '',
    username:  (tp['preferred_username'] as string) ?? '',
    email:     (tp['email']              as string) ?? '',
    firstName: (tp['given_name']         as string) ?? '',
    lastName:  (tp['family_name']        as string) ?? '',
    roles:     ((tp['realm_access'] as { roles?: string[] })?.roles ?? []),
  }
}

/* ══════════════════════════════════════════════════════════════════════
   Provider
   ══════════════════════════════════════════════════════════════════════ */
export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading]             = useState(true)
  const [token, setToken]                     = useState<string | null>(null)
  const [user, setUser]                       = useState<User | null>(null)

  /* ── Init: sessionStorage'dan oturumu geri yükle ── */
  useEffect(() => {
    if (isMockMode) {
      const saved = sessionStorage.getItem(SK_MOCK_AUTH)
      if (saved === '1') {
        const raw = sessionStorage.getItem(SK_MOCK_USER)
        const parsedUser: User = raw ? JSON.parse(raw) : mockUserFromUsername('kullanici')
        setIsAuthenticated(true)
        setToken('mock-token-dev')
        setUser(parsedUser)
      }
      setIsLoading(false)
      return
    }

    // Gerçek mod: kayıtlı token varsa oturumu canlandır
    const savedToken = sessionStorage.getItem(SK_TOKEN)
    const savedUser  = sessionStorage.getItem(SK_USER)
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser) as User)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  /* ── Login ── */
  const login = useCallback(async (username?: string, password?: string): Promise<void> => {
    /* Mock mod */
    if (isMockMode) {
      const mockUser = mockUserFromUsername(username || 'kullanici')
      sessionStorage.setItem(SK_MOCK_AUTH, '1')
      sessionStorage.setItem(SK_MOCK_USER, JSON.stringify(mockUser))
      setToken('mock-token-dev')
      setUser(mockUser)
      setIsAuthenticated(true)
      return
    }

    /* Gerçek mod — Direct Access Grant (sayfayı 8080'e fırlatmaz) */
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id:  KEYCLOAK_CLIENT,
      username:   username ?? '',
      password:   password ?? '',
    })

    const res = await fetch(TOKEN_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error_description?: string }
      throw new Error(err.error_description ?? 'Kullanıcı adı veya şifre hatalı')
    }

    const data = await res.json() as {
      access_token: string
      refresh_token?: string
      expires_in: number
    }

    const parsedUser = userFromToken(data.access_token)
    sessionStorage.setItem(SK_TOKEN, data.access_token)
    if (data.refresh_token) sessionStorage.setItem(SK_REFRESH, data.refresh_token)
    sessionStorage.setItem(SK_USER, JSON.stringify(parsedUser))

    setToken(data.access_token)
    setUser(parsedUser)
    setIsAuthenticated(true)
  }, [])

  /* ── Logout ── */
  const logout = useCallback(() => {
    sessionStorage.removeItem(SK_MOCK_AUTH)
    sessionStorage.removeItem(SK_MOCK_USER)
    sessionStorage.removeItem(SK_TOKEN)
    sessionStorage.removeItem(SK_REFRESH)
    sessionStorage.removeItem(SK_USER)
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  /* ── Get token (api client tarafından kullanılır) ── */
  const getToken = useCallback(async (): Promise<string | null> => token, [token])

  /* ── Window helper — api/client.ts ve utils/apiFetch.ts için ── */
  useEffect(() => {
    ;(window as unknown as { __getKeycloakToken?: () => Promise<string | null> }).__getKeycloakToken = getToken
    return () => {
      delete (window as unknown as { __getKeycloakToken?: () => Promise<string | null> }).__getKeycloakToken
    }
  }, [getToken])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, token, user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within KeycloakProvider')
  return ctx
}
