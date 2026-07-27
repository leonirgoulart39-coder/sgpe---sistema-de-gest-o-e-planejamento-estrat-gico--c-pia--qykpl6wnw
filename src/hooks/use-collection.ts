import { useState, useEffect, useCallback } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import type { RecordModel } from 'pocketbase'

export function useCollection<T extends RecordModel = RecordModel>(
  collectionName: string,
  sort?: string,
  filter?: string,
) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!pb.authStore.isValid) {
      setLoading(false)
      setItems([])
      return
    }
    try {
      setLoading(true)
      const records = await pb.collection(collectionName).getFullList<T>({
        sort,
        filter,
      })
      setItems(records || [])
      setError(null)
    } catch (err: any) {
      console.warn(`Failed to fetch collection "${collectionName}":`, err?.message || err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [collectionName, sort, filter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useRealtime<T>(collectionName, () => {
    if (pb.authStore.isValid) {
      fetchData()
    }
  })

  return { items, loading, error, refetch: fetchData }
}
