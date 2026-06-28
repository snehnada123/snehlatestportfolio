import { useEffect, useState } from 'react'
import {
  getTimeOnEarth,
  parseBirthDate,
  type TimeOnEarth,
} from '../utils/timeOnEarth'

export function useTimeOnEarth(birthDateIso: string): TimeOnEarth {
  const [time, setTime] = useState(() =>
    getTimeOnEarth(parseBirthDate(birthDateIso)),
  )

  useEffect(() => {
    const birthDate = parseBirthDate(birthDateIso)
    const tick = () => setTime(getTimeOnEarth(birthDate))

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [birthDateIso])

  return time
}