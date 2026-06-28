import { chromium, devices } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'mobile-preview')
const baseUrl = 'http://localhost:5173/'

const shots = [
  { name: '01-hero', path: '/' },
  { name: '02-projects', path: '/#projects' },
  { name: '03-contact', path: '/#contact' },
]

const browser = await chromium.launch()
const context = await browser.newContext({
  ...devices['iPhone 13 Pro Max'],
  colorScheme: 'dark',
})
const page = await context.newPage()

for (const shot of shots) {
  await page.goto(`${baseUrl}${shot.path.replace(/^\//, '')}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  await page.screenshot({
    path: path.join(outDir, `${shot.name}.png`),
    fullPage: false,
  })
}

await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.locator('summary', { hasText: 'Menu' }).click()
await page.waitForTimeout(400)
await page.screenshot({
  path: path.join(outDir, '04-menu-open.png'),
  fullPage: false,
})

await browser.close()
console.log(`Saved mobile previews to ${outDir}`)