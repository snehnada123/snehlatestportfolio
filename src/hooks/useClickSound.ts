import { useEffect } from 'react'
import { playClickSound, warmupClickSound } from '../utils/clickSound'

export function useClickSound() {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return

      void warmupClickSound()
      playClickSound()
    }

    document.addEventListener('pointerdown', handlePointerDown, {
      capture: true,
      passive: true,
    })

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, {
        capture: true,
      })
    }
  }, [])
}