import { useCallback } from 'react'
import { fetchJson } from '../lib/http'
import { usePolling } from './usePolling'

export function useGlances<T>(endpoint: string, intervalMs = 5000) {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchJson<T>(`/api/4/${endpoint}`, signal),
    [endpoint],
  )
  return usePolling(fetcher, intervalMs)
}
