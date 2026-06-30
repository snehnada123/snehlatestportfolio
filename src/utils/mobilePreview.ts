import {
  defaultMobileDeviceId,
  getMobileDevice,
  mobileDevices,
  type MobileDevice,
} from '../data/mobileDevices'

export function isMobilePreview(): boolean {
  return new URLSearchParams(window.location.search).get('mobile') === 'preview'
}

export function getPreviewDeviceId(): string {
  const requested = new URLSearchParams(window.location.search).get('device')
  if (requested && mobileDevices.some((device) => device.id === requested)) {
    return requested
  }
  return defaultMobileDeviceId
}

export function getPreviewDevice(): MobileDevice {
  return getMobileDevice(getPreviewDeviceId())
}

export function buildMobilePreviewUrl(deviceId: string, hash = ''): string {
  const url = new URL(window.location.href)
  url.searchParams.set('mobile', 'preview')
  url.searchParams.set('device', deviceId)
  url.hash = hash
  return `${url.pathname}${url.search}${url.hash}`
}