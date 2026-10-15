import { useEffect, useState } from 'react'

export function useGlances<T>(endpoint: string, intervalMs = 5000) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let controller: AbortController | null = null

    async function load() {
      controller?.abort()
      controller = new AbortController()
      try {
        const res = await fetch(`/api/4/${endpoint}`, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setData((await res.json()) as T)
        setError(null)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setError(err as Error)
      }
    }

    load()
    const id = setInterval(load, intervalMs)
    return () => {
      clearInterval(id)
      controller?.abort()
    }
  }, [endpoint, intervalMs])

  return { data, error }
}
