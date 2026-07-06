import { useEffect } from 'react'
import {
  playClickSoundFromUserGesture,
  unlockClickSound,
} from '../utils/clickSound'

function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function useClickSound() {
  useEffect(() => {
    let lastPlayedAt = 0
    let hasUnlocked = false
    const touchDevice = isTouchDevice()

    const handleUserGesture = (event: Event) => {
      if (
        !touchDevice &&
        event instanceof PointerEvent &&
        event.pointerType === 'mouse' &&
        event.button !== 0
      ) {
        return
      }

      const now = Date.now()
      if (now - lastPlayedAt < 50) return
      lastPlayedAt = now

      if (touchDevice && !hasUnlocked) {
        hasUnlocked = true
        unlockClickSound()
      }

      playClickSoundFromUserGesture()
    }

    const eventName = touchDevice ? 'touchstart' : 'pointerdown'

    document.addEventListener(eventName, handleUserGesture, {
      capture: true,
      passive: true,
    })

    return () => {
      document.removeEventListener(eventName, handleUserGesture, {
        capture: true,
      })
    }
  }, [])
}