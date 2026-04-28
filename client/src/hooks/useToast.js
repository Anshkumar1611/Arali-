import { useCallback, useRef, useState } from 'react'

export function useToast(duration = 3500) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const showToast = useCallback((msg, type = 'success') => {
    clearTimeout(timer.current)
    setToast({ msg, type })
    timer.current = setTimeout(() => setToast(null), duration)
  }, [duration])

  const dismissToast = useCallback(() => {
    clearTimeout(timer.current)
    setToast(null)
  }, [])

  return { toast, showToast, dismissToast }
}
