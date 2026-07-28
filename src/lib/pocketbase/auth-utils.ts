import pb from '@/lib/pocketbase/client'
import type { Role, UserProfile } from '@/types'

const AUTH_STORAGE_KEY = 'pocketbase_auth'
const PB_URL_TRACKER_KEY = 'pb_last_known_url'

export function isTokenExpired(): boolean {
  try {
    const token = pb.authStore.token
    if (!token) return true
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1]))
    return !payload.exp || payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function clearStaleAuthTokens() {
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
      // ignore
    }
  }
}

export function clearAuthData() {
  try {
    pb.authStore.clear()
    localStorage.clear()
  } catch {
    // ignore
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('authRefresh timeout')), ms)),
  ])
}

const PROFILE_RETRY_DELAY_MS = 1000
const PROFILE_MAX_RETRIES = 2

export async function fetchUserProfileWithRetry(
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
        await new Promise((r) => setTimeout(r, PROFILE_RETRY_DELAY_MS))
      }
    }
  }

  return { profile: null, role: 'leitura', profileMissing: true }
}

const AUTH_PATTERNS = [
  'auth-with-password',
  'auth-with-oauth2',
  'auth-refresh',
  'auth-reset',
  'auth-request',
  'auth-verification',
  'auth-methods',
]

function isAuthEndpoint(url: string): boolean {
  return AUTH_PATTERNS.some((p) => url.includes(p))
}

let interceptorInstalled = false

export function installAuthInterceptor(on401: () => void) {
  if (interceptorInstalled) return
  interceptorInstalled = true

  const originalSend = pb.send.bind(pb)
  pb.send = (async (url: string, options?: any) => {
    try {
      return await originalSend(url, options)
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'status' in err &&
        (err as { status: number }).status === 401 &&
        !isAuthEndpoint(url)
      ) {
        on401()
      }
      throw err
    }
  }) as typeof pb.send
}
