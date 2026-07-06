import { Volume2, VolumeX } from 'lucide-react'
import {
  playClickSoundFromUserGesture,
  unlockClickSound,
} from '../utils/clickSound'
import { useClickSoundPreference } from '../hooks/useClickSoundPreference'

export function SoundToggle() {
  const { enabled, setEnabled } = useClickSoundPreference()

  const handleToggle = () => {
    const next = !enabled
    setEnabled(next)

    if (next) {
      unlockClickSound()
      playClickSoundFromUserGesture()
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border border-border text-muted transition-colors hover:border-foreground hover:text-foreground md:hidden"
      aria-label={enabled ? 'Turn click sounds off' : 'Turn click sounds on'}
      aria-pressed={enabled}
      title={enabled ? 'Sounds on' : 'Sounds off'}
    >
      {enabled ? (
        <Volume2 className="h-4 w-4" aria-hidden="true" />
      ) : (
        <VolumeX className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}