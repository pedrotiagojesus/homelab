import { useCallback, useEffect, useState } from 'react'

// Chama `fetcher` ao montar e depois a cada `intervalMs`, mas só com o separador visível;
// ao voltar ao separador faz logo uma leitura. `fetcher` tem de ser estável (useCallback).
export function usePolling<T>(fetcher: (signal: AbortSignal) => Promise<T>, intervalMs: number) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let controller: AbortController | null = null

    async function load() {
      if (document.hidden) return
      controller?.abort()
      controller = new AbortController()
      try {
        setData(await fetcher(controller.signal))
        setError(null)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setError(err as Error)
      }
    }

    function onVisibilityChange() {
      if (!document.hidden) load()
    }

    load()
    const id = setInterval(load, intervalMs)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      controller?.abort()
    }
  }, [fetcher, intervalMs, tick])

  return { data, error, refresh }
}
