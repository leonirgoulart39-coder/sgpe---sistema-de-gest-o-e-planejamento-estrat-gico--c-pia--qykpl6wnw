import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import type { Role, UserProfile } from '@/types'

const AUTH_STORAGE_KEY = 'pocketbase_auth'
const PB_URL_TRACKER_KEY = 'pb_last_known_url'
const REFRESH_TIMEOUT_MS = 8000
const PROFILE_RETRY_DELAY_MS = 1000
const PROFILE_MAX_RETRIES = 2

function clearStaleAuthTokens() {
  const currentUrl = import.meta.env.VITE_POCKETBASE_URL || ''
  const lastKnownUrl = (() => {
    try {
      return localStorage.getItem(PB_URL_TRACKER_KEY) || ''
    } catch {
      return ''
    }
  })()

  if (currentUrl && lastKnownUrl && lastKnownUrl !== currentUrl) {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      pb.authStore.clear()
    } catch {
      // ignore
    }
  }

  if (currentUrl) {
    try {
      localStorage.setItem(PB_URL_TRACKER_KEY, currentUrl)
    } catch {
      /* ignore */
    }
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('authRefresh timeout')), ms)),
  ])
}

async function fetchUserProfileWithRetry(
  userId: string,
): Promise<{ profile: UserProfile | null; role: Role; profileMissing: boolean }> {
  if (!userId) return { profile: null, role: 'leitura', profileMissing: false }

  for (let attempt = 0; attempt <= PROFILE_MAX_RETRIES; attempt++) {
    try {
      const profile = await pb
        .collection('user_profiles')
        .getFirstListItem<UserProfile>(`user_id = "${userId}"`)
      return {
        profile: profile || null,
        role: (profile?.role || 'leitura') as Role,
        profileMissing: false,
      }
    } catch {
      if (attempt < PROFILE_MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, PROFILE_RETRY_DELAY_MS))
      }
    }
  }

  return { profile: null, role: 'leitura', profileMissing: true }
}

interface AuthContextType {
  user: any
  profile: UserProfile | null
  role: Role
  profileMissing: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => void
  refreshProfile: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

function getInitialUser(): any {
  try {
    return pb.authStore.isValid ? pb.authStore.record : null
  } catch {
    return null
  }
}

function getInitialAuth(): boolean {
  try {
    return pb.authStore.isValid
  } catch {
    return false
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(getInitialUser)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<Role>('leitura')
  const [profileMissing, setProfileMissing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuth)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    const result = await fetchUserProfileWithRetry(userId)
    setProfile(result.profile)
    setRole(result.role)
    setProfileMissing(result.profileMissing)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await loadProfile(user.id)
    }
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
          const ativoRaw = pb.authStore.record?.get('ativo')
          const isAtivo = ativoRaw !== false
          if (!isAtivo) {
            pb.authStore.clear()
            localStorage.removeItem(AUTH_STORAGE_KEY)
            setUser(null)
            setProfile(null)
            setProfileMissing(false)
            setIsAuthenticated(false)
            setRole('leitura')
            return
          }
          setUser(pb.authStore.record)
          setIsAuthenticated(pb.authStore.isValid)
          if (pb.authStore.record?.id) {
            await loadProfile(pb.authStore.record.id)
          }
        })
        .catch(() => {
          if (cancelled) return
          try {
            pb.authStore.clear()
            localStorage.removeItem(AUTH_STORAGE_KEY)
          } catch {
            // ignore
          }
          setUser(null)
          setProfile(null)
          setProfileMissing(false)
          setIsAuthenticated(false)
          setRole('leitura')
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    } else {
      try {
        if (pb.authStore.record) {
          pb.authStore.clear()
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
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
  }, [loadProfile])

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
      const ativoRaw = pb.authStore.record?.get('ativo')
      const isAtivo = ativoRaw !== false
      if (!isAtivo) {
        pb.authStore.clear()
        localStorage.removeItem(AUTH_STORAGE_KEY)
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

  const signOut = () => {
    try {
      pb.authStore.clear()
    } catch {
      // ignore
    }
    setUser(null)
    setProfile(null)
    setProfileMissing(false)
    setIsAuthenticated(false)
    setRole('leitura')
  }

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
        signOut,
        refreshProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
