import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'mobile-audit-screenshots', 'desktop');

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const compare = await page.evaluate(() => ({
    expTagsVisible: getComputedStyle(document.querySelector('#experience ul[aria-label="Technologies"]')).display,
    projectTagsVisible: getComputedStyle(document.querySelector('#projects .mt-auto')).display,
    footerNavVisible: getComputedStyle(document.querySelector('footer nav')).display,
    heatmapWidth: document.querySelector('.github-heatmap')?.getBoundingClientRect().width,
    heatmapNeedsScroll: (() => {
      const c = document.querySelector('.overflow-x-auto');
      return c ? c.scrollWidth > c.clientWidth : false;
    })(),
    heroLinkRows: (() => {
      const children = [...document.querySelector('#hero .flex.flex-wrap').children];
      return new Set(children.map((c) => Math.round(c.getBoundingClientRect().top))).size;
    })(),
    contactGridCols: getComputedStyle(document.querySelector('.contact-direct-grid')).gridTemplateColumns,
  }));

  await page.screenshot({ path: path.join(OUT_DIR, 'desktop-hero.png'), clip: { x: 0, y: 0, width: 1440, height: 700 } });
  console.log(JSON.stringify(compare, null, 2));
  await browser.close();
}

main();