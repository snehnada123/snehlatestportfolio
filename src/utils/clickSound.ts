let audioContext: AudioContext | null = null
let clickBuffer: AudioBuffer | null = null
let warmupPromise: Promise<void> | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext

    if (!AudioCtx) return null
    audioContext = new AudioCtx()
  }

  return audioContext
}

function createClickBuffer(ctx: AudioContext): AudioBuffer {
  const duration = 0.028
  const sampleRate = ctx.sampleRate
  const length = Math.floor(sampleRate * duration)
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    const envelope = Math.exp(-t * 120)
    const frequency = 880 * Math.exp(-t * 40)
    data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.35
  }

  return buffer
}

export function warmupClickSound(): Promise<void> {
  if (warmupPromise) return warmupPromise

  warmupPromise = (async () => {
    const ctx = getAudioContext()
    if (!ctx) return

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    if (!clickBuffer) {
      clickBuffer = createClickBuffer(ctx)
    }
  })()

  return warmupPromise
}

export function playClickSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  if (ctx.state !== 'running') {
    void warmupClickSound().then(() => playClickSound())
    return
  }

  if (!clickBuffer) {
    clickBuffer = createClickBuffer(ctx)
  }

  const source = ctx.createBufferSource()
  source.buffer = clickBuffer
  source.connect(ctx.destination)
  source.start(0)
}