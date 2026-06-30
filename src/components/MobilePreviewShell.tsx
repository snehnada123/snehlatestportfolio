import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { getMobileDevice, mobileDevices } from '../data/mobileDevices'
import {
  buildMobilePreviewUrl,
  getPreviewDeviceId,
  isMobilePreview,
} from '../utils/mobilePreview'

interface MobilePreviewShellProps {
  children: ReactNode
}

export function MobilePreviewShell({ children }: MobilePreviewShellProps) {
  const [deviceId, setDeviceId] = useState(getPreviewDeviceId)

  useEffect(() => {
    if (!isMobilePreview()) return

    document.documentElement.classList.add('mobile-preview-active')
    document.documentElement.dataset.mobilePreview = 'true'

    return () => {
      document.documentElement.classList.remove('mobile-preview-active')
      delete document.documentElement.dataset.mobilePreview
    }
  }, [])

  if (!isMobilePreview()) return <>{children}</>

  const device = getMobileDevice(deviceId)
  const frameStyle = {
    '--preview-width': `${device.width}px`,
    '--preview-height': `${device.height}px`,
    '--preview-radius': `${device.radius}px`,
  } as CSSProperties

  const handleDeviceChange = (nextDeviceId: string) => {
    setDeviceId(nextDeviceId)
    const nextUrl = buildMobilePreviewUrl(nextDeviceId, window.location.hash)
    window.history.replaceState(null, '', nextUrl)
  }

  return (
    <div className="mobile-preview-shell">
      <div className="mobile-preview-shell__toolbar">
        <p className="mobile-preview-shell__label" aria-live="polite">
          Mobile preview — {device.name} ({device.width}×{device.height}) ·{' '}
          <span className="mobile-preview-shell__platform">
            {device.platform === 'ios' ? 'iOS' : 'Android'}
          </span>
        </p>

        <label className="mobile-preview-shell__picker">
          <span className="sr-only">Choose smartphone</span>
          <select
            value={deviceId}
            onChange={(event) => handleDeviceChange(event.target.value)}
            className="mobile-preview-shell__select"
            aria-label="Choose smartphone to preview"
          >
            <optgroup label="iPhone">
              {mobileDevices
                .filter((item) => item.platform === 'ios')
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.width}px)
                  </option>
                ))}
            </optgroup>
            <optgroup label="Android">
              {mobileDevices
                .filter((item) => item.platform === 'android')
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.width}px)
                  </option>
                ))}
            </optgroup>
          </select>
        </label>

        <p className="mobile-preview-shell__hint">
          Remove <code className="mobile-preview-shell__code">?mobile=preview</code> from the URL
          for desktop view.
        </p>
      </div>

      <div
        className="mobile-preview-shell__device"
        style={frameStyle}
        aria-label={`${device.name} preview frame`}
        data-platform={device.platform}
      >
        <div className="mobile-preview-shell__screen">{children}</div>
      </div>
    </div>
  )
}