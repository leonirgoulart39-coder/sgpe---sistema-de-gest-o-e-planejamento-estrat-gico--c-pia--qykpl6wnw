import { ClientResponseError } from 'pocketbase'
import pb from '@/lib/pocketbase/client'
import type { Role, UserProfile } from '@/types'

export const AUTH_STORAGE_KEY = 'pocketbase_auth'
export const PB_URL_TRACKER_KEY = 'pb_last_known_url'
export const REFRESH_TIMEOUT_MS = 3000
const PROFILE_RETRY_DELAY_MS = 1000
const PROFILE_MAX_RETRIES = 2

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
      /* intentionally ignored */
    }
  }
  if (currentUrl) {
    try {
      localStorage.setItem(PB_URL_TRACKER_KEY, currentUrl)
    } catch {
      /* intentionally ignored */
    }
  }
}

export function isTokenExpired(): boolean {
  try {
    const token = pb.authStore.token
    if (!token) return true
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

export function isAuthError(err: unknown): boolean {
  if (err instanceof ClientResponseError) return err.status === 401 || err.status === 403
  return false
}

export function isNetworkError(err: unknown): boolean {
  if (err instanceof ClientResponseError) return err.status === 0
  if (err instanceof Error) {
    const m = err.message.toLowerCase()
    return m.includes('timeout') || m.includes('fetch') || m.includes('network')
  }
  return false
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])
}

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
      if (attempt < PROFILE_MAX_RETRIES)
        await new Promise((r) => setTimeout(r, PROFILE_RETRY_DELAY_MS))
    }
  }
  return { profile: null, role: 'leitura', profileMissing: true }
}
