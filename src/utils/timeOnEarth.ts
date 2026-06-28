export interface TimeOnEarth {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function parseBirthDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getTimeOnEarth(birthDate: Date, now = new Date()): TimeOnEarth {
  const ms = now.getTime() - birthDate.getTime()
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86_400)

  let years = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()
  const dayDiff = now.getDate() - birthDate.getDate()
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) years--

  const secondsInDay = totalSeconds % 86_400
  const hours = Math.floor(secondsInDay / 3600)
  const minutes = Math.floor((secondsInDay % 3600) / 60)
  const seconds = secondsInDay % 60

  return { years, days, hours, minutes, seconds }
}

export function padTimeUnit(value: number): string {
  return value.toString().padStart(2, '0')
}

export function isBirthday(birthDateIso: string, now = new Date()): boolean {
  const birth = parseBirthDate(birthDateIso)
  return (
    now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate()
  )
}