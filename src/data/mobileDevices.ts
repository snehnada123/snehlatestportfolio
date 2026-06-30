import devices from './mobileDevices.json'

export interface MobileDevice {
  id: string
  name: string
  platform: 'ios' | 'android'
  width: number
  height: number
  radius: number
}

export const mobileDevices = devices as MobileDevice[]

export const defaultMobileDeviceId = 'iphone-14-pro-max'

export function getMobileDevice(id: string): MobileDevice {
  return (
    mobileDevices.find((device) => device.id === id) ??
    mobileDevices.find((device) => device.id === defaultMobileDeviceId) ??
    mobileDevices[0]
  )
}