import { useEffect } from 'react'
import { playClickSoundFromUserGesture } from '../utils/clickSound'

export function useClickSound() {
  useEffect(() => {
    let lastPlayedAt = 0

    const handleUserGesture = (event: Event) => {
      if (
        event instanceof PointerEvent &&
        event.pointerType === 'mouse' &&
        event.button !== 0
      ) {
        return
      }

      const now = Date.now()
      if (now - lastPlayedAt < 40) return
      lastPlayedAt = now

      playClickSoundFromUserGesture()
    }

    document.addEventListener('pointerdown', handleUserGesture, {
      capture: true,
      passive: true,
    })
    document.addEventListener('touchstart', handleUserGesture, {
      capture: true,
      passive: true,
    })

    return () => {
      document.removeEventListener('pointerdown', handleUserGesture, {
        capture: true,
      })
      document.removeEventListener('touchstart', handleUserGesture, {
        capture: true,
      })
    }
  }, [])
}