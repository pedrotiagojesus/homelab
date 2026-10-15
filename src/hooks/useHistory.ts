import { useState } from 'react'

// Guarda os últimos `max` valores de `select(data)`, um por cada novo `data` recebido.
export function useHistory<T>(data: T | null, select: (data: T) => number, max = 60) {
  const [history, setHistory] = useState<number[]>([])
  const [last, setLast] = useState<T | null>(null)

  if (data !== last) {
    setLast(data)
    if (data != null) setHistory((h) => [...h, select(data)].slice(-max))
  }

  return history
}
