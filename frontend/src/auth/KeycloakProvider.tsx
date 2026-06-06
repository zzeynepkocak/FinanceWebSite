import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { keycloak } from './keycloak'

/* ── Context tipi ─────────────────────────────────────────────── */
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
  login: (username?: string, password?: string) => void
  logout: () => void
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/* ── Mock kullanıcı ───────────────────────────────────────────── */
const MOCK_SESSION_KEY      = 'fp_mock_auth'
const MOCK_SESSION_USER_KEY = 'fp_mock_user'
const isMockMode = import.meta.env.VITE_MOCK_AUTH === 'true'

/** Kullanıcı adından User nesnesi üretir */
function mockUserFromUsername(username: string): User {
  const parts = username.trim().split(/\s+/)
  const firstName = parts[0]
    ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
    : 'Kullanıcı'
  const lastName = parts[1]
    ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase()
    : ''
  const slug = username.toLowerCase().replace(/\s+/g, '.')
  return {
    id:        `mock-${slug}-001`,
    username:  slug || 'kullanici',
    email:     `${slug || 'kullanici'}@toyota-finans.com.tr`,
    firstName,
    lastName,
    roles: ['user'],
  }
}

/* ── JWT'den kullanıcı oku ────────────────────────────────────── */
function parseUser(): User | null {
  if (!keycloak.authenticated || !keycloak.tokenParsed) return null
  const tp = keycloak.tokenParsed as Record<string, unknown>
  return {
    id: (tp['sub'] as string) ?? '',
    username: (tp['preferred_username'] as string) ?? '',
    email: (tp['email'] as string) ?? '',
    firstName: (tp['given_name'] as string) ?? '',
    lastName: (tp['family_name'] as string) ?? '',
    roles: ((tp['realm_access'] as { roles?: string[] })?.roles ?? []),
  }
}

/* ═══════════════════════════════════════════════════════════════ */

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  /* ── Init ── */
  useEffect(() => {
    if (isMockMode) {
      const saved = sessionStorage.getItem(MOCK_SESSION_KEY)
      if (saved === '1') {
        const savedUser = sessionStorage.getItem(MOCK_SESSION_USER_KEY)
        const parsedUser: User = savedUser
          ? JSON.parse(savedUser)
          : mockUserFromUsername('kullanici')
        setIsAuthenticated(true)
        setToken('mock-token-dev')
        setUser(parsedUser)
      }
      setIsLoading(false)
      return
    }

    ;(async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
          checkLoginIframe: false,
        })
        setIsAuthenticated(authenticated)
        if (authenticated && keycloak.token) {
          setToken(keycloak.token)
          setUser(parseUser())
        }
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).then((refreshed) => {
            if (refreshed && keycloak.token) {
              setToken(keycloak.token)
              setUser(parseUser())
            }
          })
        }
      } catch (e) {
        console.error('Keycloak init error', e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  /* ── Login ── */
  const login = useCallback((username?: string, _p?: string) => {
    if (isMockMode) {
      const mockUser = mockUserFromUsername(username || 'kullanici')
      sessionStorage.setItem(MOCK_SESSION_KEY, '1')
      sessionStorage.setItem(MOCK_SESSION_USER_KEY, JSON.stringify(mockUser))
      setToken('mock-token-dev')
      setUser(mockUser)
      setIsAuthenticated(true)
      return
    }
    keycloak.login({
      redirectUri: window.location.origin + '/',
    })
  }, [])

  /* ── Logout ── */
  const logout = useCallback(() => {
    if (isMockMode) {
      sessionStorage.removeItem(MOCK_SESSION_KEY)
      sessionStorage.removeItem(MOCK_SESSION_USER_KEY)
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      return
    }
    keycloak.logout({ redirectUri: window.location.origin + '/login' })
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  /* ── Get token (API çağrılarından önce) ── */
  const getToken = useCallback(async (): Promise<string | null> => {
    if (isMockMode) return token
    if (keycloak.authenticated) {
      try {
        await keycloak.updateToken(30)
        return keycloak.token ?? null
      } catch {
        return keycloak.token ?? null
      }
    }
    return null
  }, [token])

  /* ── Window helper (api.ts için) ── */
  useEffect(() => {
    ;(
      window as unknown as {
        __getKeycloakToken?: () => Promise<string | null>
      }
    ).__getKeycloakToken = getToken
    return () => {
      delete (
        window as unknown as {
          __getKeycloakToken?: () => Promise<string | null>
        }
      ).__getKeycloakToken
    }
  }, [getToken])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, token, user, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within KeycloakProvider')
  return ctx
}
