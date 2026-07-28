import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react'
import { useNavigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import {
  isTokenExpired,
  clearStaleAuthTokens,
  clearAuthData,
  withTimeout,
  fetchUserProfileWithRetry,
  installAuthInterceptor,
} from '@/lib/pocketbase/auth-utils'
import type { Role, UserProfile } from '@/types'

const REFRESH_TIMEOUT_MS = 3000
const TOKEN_CHECK_INTERVAL_MS = 10000
const SESSION_EXPIRY_REDIRECT_MS = 500

interface AuthContextType {
  user: any
  profile: UserProfile | null
  role: Role
  profileMissing: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWith: (provider: string) => Promise<{ error: any }>
  signOut: () => void
  refreshProfile: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

const getInitialUser = () => {
  try {
    return pb.authStore.isValid ? pb.authStore.record : null
  } catch {
    return null
  }
}

const getInitialAuth = () => {
  try {
    return pb.authStore.isValid
  } catch {
    return false
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(getInitialUser)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<Role>('leitura')
  const [profileMissing, setProfileMissing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuth)
  const [loading, setLoading] = useState(true)
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAuthState = useCallback(() => {
    clearAuthData()
    setUser(null)
    setProfile(null)
    setProfileMissing(false)
    setIsAuthenticated(false)
    setRole('leitura')
  }, [])

  const redirectToLogin = useCallback(() => {
    clearAuthState()
    navigate('/login', { replace: true })
  }, [navigate, clearAuthState])

  useEffect(() => {
    installAuthInterceptor(() => {
      if (redirectTimerRef.current) return
      redirectTimerRef.current = setTimeout(() => {
        redirectTimerRef.current = null
        redirectToLogin()
      }, SESSION_EXPIRY_REDIRECT_MS)
    })
  }, [redirectToLogin])

  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => {
      if (isTokenExpired()) redirectToLogin()
    }, TOKEN_CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isAuthenticated, redirectToLogin])

  const loadProfile = useCallback(async (userId: string) => {
    const r = await fetchUserProfileWithRetry(userId)
    setProfile(r.profile)
    setRole(r.role)
    setProfileMissing(r.profileMissing)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user?.id) await loadProfile(user.id)
  }, [user?.id, loadProfile])

  useRealtime<UserProfile>(
    'user_profiles',
    (e) => {
      if (user?.id && e.record && e.record.user_id === user.id) {
        if (e.action === 'delete') {
          setProfile(null)
          setRole('leitura')
          setProfileMissing(true)
        } else {
          setProfile(e.record as unknown as UserProfile)
          setRole((e.record.role || 'leitura') as Role)
          setProfileMissing(false)
        }
      }
    },
    !!user?.id,
  )

  useEffect(() => {
    let cancelled = false
    clearStaleAuthTokens()

    const handleAuthFailure = () => {
      if (cancelled) return
      clearAuthState()
      setLoading(false)
    }

    if (pb.authStore.isValid && isTokenExpired()) {
      handleAuthFailure()
      return () => {
        cancelled = true
      }
    }

    if (!pb.authStore.isValid) {
      setUser(null)
      setProfile(null)
      setProfileMissing(false)
      setIsAuthenticated(false)
      setRole('leitura')
    }

    const unsubscribe = pb.authStore.onChange((_token, record) => {
      if (cancelled) return
      const valid = pb.authStore.isValid
      setUser(valid ? record : null)
      setIsAuthenticated(valid)
      if (!valid) {
        setProfile(null)
        setProfileMissing(false)
        setRole('leitura')
      } else if (record?.id) {
        loadProfile(record.id)
      }
    })

    if (pb.authStore.isValid) {
      withTimeout(pb.collection('users').authRefresh(), REFRESH_TIMEOUT_MS)
        .then(async () => {
          if (cancelled) return
          if (pb.authStore.record?.get('ativo') === false) {
            handleAuthFailure()
            return
          }
          setUser(pb.authStore.record)
          setIsAuthenticated(pb.authStore.isValid)
          if (pb.authStore.record?.id) await loadProfile(pb.authStore.record.id)
        })
        .catch(() => handleAuthFailure())
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    } else {
      try {
        if (pb.authStore.record) pb.authStore.clear()
      } catch {
        // ignore
      }
      setUser(null)
      setProfile(null)
      setProfileMissing(false)
      setIsAuthenticated(false)
      setRole('leitura')
      setLoading(false)
    }

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [loadProfile, clearAuthState])

  const signUp = async (email: string, password: string) => {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name: email.split('@')[0],
        ativo: true,
      })
      await pb.collection('users').authWithPassword(email, password)
      if (pb.authStore.record?.id) {
        setUser(pb.authStore.record)
        setIsAuthenticated(true)
        await loadProfile(pb.authStore.record.id)
      }
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      if (pb.authStore.record?.get('ativo') === false) {
        clearAuthData()
        return { error: { message: 'Usuário inativo' } }
      }
      if (pb.authStore.record?.id) {
        setUser(pb.authStore.record)
        setIsAuthenticated(true)
        await loadProfile(pb.authStore.record.id)
      }
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signInWith = async (provider: string) => {
    try {
      await pb.collection('users').authWithOAuth2({ provider })
      if (pb.authStore.record?.id) {
        setUser(pb.authStore.record)
        setIsAuthenticated(true)
        await loadProfile(pb.authStore.record.id)
      }
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = () => clearAuthState()

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        profileMissing,
        isAuthenticated,
        signUp,
        signIn,
        signInWith,
        signOut,
        refreshProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
