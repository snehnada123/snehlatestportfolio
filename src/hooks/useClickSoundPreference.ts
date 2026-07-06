import { useEffect, useState } from 'react'

const STORAGE_KEY = 'click-sound-enabled'

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

function readStoredPreference(): boolean | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return null
}

function getInitialEnabled(): boolean {
  if (typeof window === 'undefined') return true
  if (!isTouchDevice()) return true

  const stored = readStoredPreference()
  return stored ?? false
}

let clickSoundEnabled = getInitialEnabled()
const listeners = new Set<() => void>()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

export function isClickSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true
  if (!isTouchDevice()) return true
  return clickSoundEnabled
}

export function setClickSoundEnabled(next: boolean) {
  clickSoundEnabled = next
  localStorage.setItem(STORAGE_KEY, String(next))
  notifyListeners()
}

export function useClickSoundPreference() {
  const [enabled, setEnabled] = useState(getInitialEnabled)

  useEffect(() => {
    const sync = () => setEnabled(clickSoundEnabled)
    listeners.add(sync)
    return () => {
      listeners.delete(sync)
    }
  }, [])

  const toggle = () => {
    setClickSoundEnabled(!clickSoundEnabled)
  }

  const set = (next: boolean) => {
    setClickSoundEnabled(next)
  }

  return { enabled, toggle, setEnabled: set, isTouchDevice: isTouchDevice() }
}