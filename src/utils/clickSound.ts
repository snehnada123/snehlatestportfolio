const CLICK_DURATION_SEC = 0.028
const CLICK_VOLUME = 0.35

let clickDataUri: string | null = null
let unlocked = false

function createClickSamples(sampleRate: number): Float32Array {
  const length = Math.floor(sampleRate * CLICK_DURATION_SEC)
  const samples = new Float32Array(length)

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    const envelope = Math.exp(-t * 120)
    const frequency = 880 * Math.exp(-t * 40)
    samples[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * CLICK_VOLUME
  }

  return samples
}

function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const bytesPerSample = 2
  const blockAlign = bytesPerSample
  const dataSize = samples.length * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bytesPerSample * 8, true)
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true)
    offset += 2
  }

  return buffer
}

function getClickDataUri(): string {
  if (clickDataUri) return clickDataUri

  const sampleRate = 44100
  const samples = createClickSamples(sampleRate)
  const wav = encodeWav(samples, sampleRate)
  const bytes = new Uint8Array(wav)
  let binary = ''

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  clickDataUri = `data:audio/wav;base64,${btoa(binary)}`
  return clickDataUri
}

function createClickAudio(): HTMLAudioElement {
  const audio = new Audio(getClickDataUri())
  audio.preload = 'auto'
  audio.volume = CLICK_VOLUME
  return audio
}

export function warmupClickSound(): Promise<void> {
  getClickDataUri()
  return Promise.resolve()
}

export function unlockClickSound(): void {
  if (unlocked) return

  const audio = createClickAudio()
  audio.muted = true
  const attempt = audio.play()

  if (attempt) {
    void attempt
      .then(() => {
        audio.pause()
        audio.currentTime = 0
        unlocked = true
      })
      .catch(() => {})
  }
}

export function playClickSoundFromUserGesture(): void {
  if (typeof window === 'undefined') return

  try {
    const audio = createClickAudio()
    void audio.play().catch(() => {})
  } catch {
    // Ignore playback errors when the browser blocks audio.
  }
}

export function playClickSound(): void {
  playClickSoundFromUserGesture()
}