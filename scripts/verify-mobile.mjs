import { chromium, devices } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'mobile-preview')
const baseUrl = 'http://localhost:5173/'

const browser = await chromium.launch()
const errors = []

async function checkMobile() {
  const context = await browser.newContext({
    ...devices['iPhone 13 Pro Max'],
    colorScheme: 'dark',
  })
  const page = await context.newPage()

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    return doc.scrollWidth > doc.clientWidth + 1
  })
  if (overflow) errors.push('Mobile: page-level horizontal overflow detected')

  const heatmapPadding = await page.evaluate(() => {
    const el = document.querySelector('.github-heatmap__months')
    return el ? getComputedStyle(el).paddingLeft : null
  })

  await page.goto(`${baseUrl}#activity`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)

  const heatmapWidth = await page.evaluate(() => {
    const el = document.querySelector('.github-heatmap')
    const container = document.querySelector('.github-heatmap-scroll')
    return {
      heatmap: el?.scrollWidth ?? 0,
      container: container?.clientWidth ?? 0,
      paddingLeft: getComputedStyle(document.querySelector('.github-heatmap__months')).paddingLeft,
      weekdaysDisplay: getComputedStyle(document.querySelector('.github-heatmap__weekdays')).display,
    }
  })

  if (heatmapWidth.paddingLeft !== '0px') {
    errors.push(`Mobile heatmap months padding-left should be 0, got ${heatmapWidth.paddingLeft}`)
  }
  if (heatmapWidth.weekdaysDisplay !== 'none') {
    errors.push(`Mobile heatmap weekdays should be hidden, got ${heatmapWidth.weekdaysDisplay}`)
  }

  const projectTags = await page.evaluate(() => {
    return document.querySelectorAll('#projects .tag-pill').length
  })
  if (projectTags < 3) errors.push(`Mobile projects should show tags, found ${projectTags}`)

  const expTags = await page.evaluate(() => {
    return document.querySelectorAll('#experience .tag-pill').length
  })
  if (expTags < 1) errors.push(`Mobile experience should show tags, found ${expTags}`)

  const footerNav = await page.evaluate(() => {
    return document.querySelectorAll('footer nav').length
  })
  if (footerNav > 0) errors.push('Footer should not include navigation links')

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.locator('#mobile-nav summary').click()
  await page.waitForTimeout(300)

  const menuItems = await page.locator('#mobile-nav nav a').count()
  if (menuItems < 7) errors.push(`Mobile menu should list 7 items, found ${menuItems}`)

  const backdropVisible = await page.evaluate(() => {
    const el = document.querySelector('.mobile-nav-backdrop')
    return el ? getComputedStyle(el).opacity : '0'
  })
  if (backdropVisible !== '1') errors.push(`Mobile menu backdrop should be visible when open`)

  const shots = [
    { name: '01-hero', path: '/' },
    { name: '02-projects', path: '/#projects' },
    { name: '03-contact', path: '/#contact' },
  ]

  for (const shot of shots) {
    await page.goto(`${baseUrl}${shot.path.replace(/^\//, '')}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2500)
    await page.screenshot({ path: path.join(outDir, `${shot.name}.png`), fullPage: false })
  }

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.locator('#mobile-nav summary').click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(outDir, '04-menu-open.png'), fullPage: false })

  await context.close()
}

async function checkDesktop() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' })
  const page = await context.newPage()
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const desktopChecks = await page.evaluate(() => {
    const themeBtn = document.querySelector('button[aria-label*="theme"]')
    const footerNav = document.querySelector('footer nav')
    const projectTagsHidden = document.querySelector('#projects .tag-pill') !== null
    const heatmapWeekdays = document.querySelector('.github-heatmap__weekdays')
    return {
      themeSize: themeBtn ? getComputedStyle(themeBtn).width : '',
      footerNavDisplay: footerNav ? getComputedStyle(footerNav).display : '',
      projectTags: projectTagsHidden,
      weekdaysDisplay: heatmapWeekdays ? getComputedStyle(heatmapWeekdays).display : '',
      heroBorder: document.querySelector('#hero .border-t') !== null,
    }
  })

  if (desktopChecks.themeSize !== '32px') {
    errors.push(`Desktop theme toggle should be 32px, got ${desktopChecks.themeSize}`)
  }
  if (desktopChecks.weekdaysDisplay !== 'grid') {
    errors.push(`Desktop heatmap weekdays should be grid, got ${desktopChecks.weekdaysDisplay}`)
  }

  await page.screenshot({ path: path.join(root, 'mobile-preview', '05-desktop-check.png'), fullPage: false })
  await context.close()
}

await checkMobile()
await checkDesktop()
await browser.close()

if (errors.length) {
  console.error('FAILED:\n' + errors.map((e) => `- ${e}`).join('\n'))
  process.exit(1)
}

console.log('All mobile/desktop checks passed. Screenshots updated in mobile-preview/')