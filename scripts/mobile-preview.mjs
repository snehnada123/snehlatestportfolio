import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'mobile-preview')
const baseUrl = 'http://localhost:5173/'
const devices = JSON.parse(
  readFileSync(path.join(root, 'src/data/mobileDevices.json'), 'utf8'),
)

const requested = process.argv[2] ?? 'iphone-14-pro-max'
const device = devices.find((item) => item.id === requested) ?? devices[2]

const shots = [
  { name: '01-hero', path: '/' },
  { name: '02-projects', path: '/#projects' },
  { name: '03-contact', path: '/#contact' },
]

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: device.width, height: device.height },
  isMobile: true,
  hasTouch: true,
  colorScheme: 'dark',
})
const page = await context.newPage()
const previewUrl = `${baseUrl}?mobile=preview&device=${device.id}`

for (const shot of shots) {
  await page.goto(`${previewUrl}${shot.path.replace(/^\//, '')}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  await page.screenshot({
    path: path.join(outDir, `${shot.name}.png`),
    fullPage: false,
  })
}

await page.goto(previewUrl, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.locator('#mobile-nav summary').click()
await page.waitForTimeout(400)
await page.screenshot({
  path: path.join(outDir, '04-menu-open.png'),
  fullPage: false,
})

await browser.close()
console.log(`Saved ${device.name} (${device.width}x${device.height}) previews to ${outDir}`)