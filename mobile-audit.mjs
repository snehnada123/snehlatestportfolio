import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'mobile-audit-screenshots');
const BASE_URL = 'http://localhost:5173/';

const VIEWPORT = { width: 428, height: 926 };
const DEVICE = 'iPhone 13 Pro Max';

const sections = [
  { name: 'hero', selector: '#hero' },
  { name: 'header-menu-open', action: 'open-menu' },
  { name: 'experience', selector: '#experience' },
  { name: 'education', selector: '#education' },
  { name: 'skills', selector: '#skills' },
  { name: 'projects', selector: '#projects' },
  { name: 'activity', selector: '#activity' },
  { name: 'contact', selector: '#contact' },
  { name: 'footer', selector: 'footer' },
  { name: 'full-page', action: 'full-page' },
];

async function auditLayout(page) {
  const results = await page.evaluate(() => {
    const issues = [];
    const vw = window.innerWidth;

    const overflowX = document.documentElement.scrollWidth > vw + 1;
    if (overflowX) {
      issues.push({
        type: 'horizontal-overflow',
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: vw,
      });
    }

    const checkOverflow = (el, label) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > vw + 1) {
        issues.push({
          type: 'element-overflow-right',
          label,
          right: rect.right,
          viewportWidth: vw,
        });
      }
      if (rect.left < -1) {
        issues.push({
          type: 'element-overflow-left',
          label,
          left: rect.left,
        });
      }
    };

    document.querySelectorAll('section, header, footer').forEach((el) => {
      const id = el.id || el.tagName.toLowerCase();
      checkOverflow(el, id);
    });

    const heroLinks = document.querySelector('#hero .flex.flex-wrap');
    if (heroLinks) {
      const children = [...heroLinks.children];
      const rows = new Set(children.map((c) => Math.round(c.getBoundingClientRect().top)));
      issues.push({
        type: 'hero-social-wrap-rows',
        rowCount: rows.size,
        childCount: children.length,
      });
    }

    const quote = document.querySelector('#hero p.max-w-xl');
    if (quote) {
      const rect = quote.getBoundingClientRect();
      issues.push({
        type: 'hero-quote',
        height: rect.height,
        minHeight: getComputedStyle(quote).minHeight,
        scrollHeight: quote.scrollHeight,
        clientHeight: quote.clientHeight,
        overflow: quote.scrollHeight > quote.clientHeight + 2,
      });
    }

    const expTags = document.querySelector('#experience ul[aria-label="Technologies"]');
    if (expTags) {
      issues.push({
        type: 'experience-tags-visible',
        display: getComputedStyle(expTags).display,
        visible: expTags.offsetParent !== null,
      });
    }

    const projectTags = document.querySelectorAll('#projects .tag-pill');
    issues.push({
      type: 'project-tags-count',
      count: projectTags.length,
    });

    const heatmap = document.querySelector('.github-heatmap');
    if (heatmap) {
      const container = heatmap.closest('.overflow-x-auto');
      const rect = heatmap.getBoundingClientRect();
      issues.push({
        type: 'heatmap',
        heatmapWidth: rect.width,
        containerScrollWidth: container?.scrollWidth,
        containerClientWidth: container?.clientWidth,
        needsScroll: container ? container.scrollWidth > container.clientWidth + 1 : null,
      });
    }

    const contactGrid = document.querySelector('.contact-direct-grid');
    if (contactGrid) {
      issues.push({
        type: 'contact-direct-grid',
        display: getComputedStyle(contactGrid).display,
        gridTemplateColumns: getComputedStyle(contactGrid).gridTemplateColumns,
        childRects: [...contactGrid.children].map((li) => {
          const a = li.querySelector('a');
          const rect = a.getBoundingClientRect();
          return { label: a?.textContent?.trim(), width: rect.width, height: rect.height };
        }),
      });
    }

    const eduSchools = [...document.querySelectorAll('#education h3')].map((h) => {
      const style = getComputedStyle(h);
      return {
        text: h.textContent?.trim(),
        height: h.getBoundingClientRect().height,
        lineCount: Math.round(h.getBoundingClientRect().height / parseFloat(style.lineHeight || '24')),
      };
    });
    issues.push({ type: 'education-schools', schools: eduSchools });

    const footerNav = document.querySelector('footer nav');
    if (footerNav) {
      issues.push({
        type: 'footer-nav-visible',
        display: getComputedStyle(footerNav).display,
      });
    }

    const blessing = document.querySelector('.footer-blessing');
    if (blessing) {
      issues.push({
        type: 'footer-blessing',
        textAlign: getComputedStyle(blessing).textAlign,
        maxWidth: getComputedStyle(blessing).maxWidth,
        rect: blessing.getBoundingClientRect(),
      });
    }

    const mobileMenu = document.getElementById('mobile-nav');
    if (mobileMenu) {
      const dropdown = mobileMenu.querySelector('.nav-dropdown');
      issues.push({
        type: 'mobile-menu-closed',
        dropdownDisplay: dropdown ? getComputedStyle(dropdown).display : null,
      });
    }

    return issues;
  });

  return results;
}

async function auditMenuOpen(page) {
  await page.locator('#mobile-nav summary').click();
  await page.waitForTimeout(300);

  const shot = path.join(OUT_DIR, 'header-menu-open.png');
  await page.screenshot({ path: shot, fullPage: false });

  const menuAudit = await page.evaluate(() => {
    const menu = document.getElementById('mobile-nav');
    const dropdown = menu?.querySelector('.nav-dropdown');
    const header = document.querySelector('.site-header');
    const issues = [];

    if (!dropdown) return { issues: [{ type: 'no-dropdown' }] };

    const dRect = dropdown.getBoundingClientRect();
    const hRect = header?.getBoundingClientRect();
    const vw = window.innerWidth;

    issues.push({
      type: 'menu-dropdown-position',
      top: dRect.top,
      right: vw - dRect.right,
      width: dRect.width,
      height: dRect.height,
      zIndex: getComputedStyle(dropdown).zIndex,
      headerBottom: hRect?.bottom,
      clippedRight: dRect.right > vw + 1,
      clippedLeft: dRect.left < 0,
      clippedTop: dRect.top < (hRect?.bottom ?? 0) - 1,
    });

    const links = [...dropdown.querySelectorAll('a')].map((a) => ({
      text: a.textContent?.trim(),
      height: a.getBoundingClientRect().height,
      width: a.getBoundingClientRect().width,
    }));
    issues.push({ type: 'menu-links', links });

    const openSummary = menu?.querySelector('summary');
    if (openSummary) {
      issues.push({
        type: 'menu-button-open-style',
        bg: getComputedStyle(openSummary).backgroundColor,
        color: getComputedStyle(openSummary).color,
      });
    }

    return { issues };
  });

  await page.locator('#mobile-nav summary').click();
  return { screenshot: shot, menuAudit };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  const hasPreviewShell = await page.locator('.mobile-preview-shell').count();
  const layoutAudit = await auditLayout(page);

  const screenshots = {};

  for (const section of sections) {
    if (section.action === 'open-menu') {
      const menuResult = await auditMenuOpen(page);
      screenshots[section.name] = menuResult.screenshot;
      layoutAudit.push(...menuResult.menuAudit.issues);
      continue;
    }

    if (section.action === 'full-page') {
      const shot = path.join(OUT_DIR, 'full-page.png');
      await page.screenshot({ path: shot, fullPage: true });
      screenshots[section.name] = shot;
      continue;
    }

    const el = page.locator(section.selector);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const shot = path.join(OUT_DIR, `${section.name}.png`);
    await el.screenshot({ path: shot });
    screenshots[section.name] = shot;
  }

  const report = {
    device: DEVICE,
    viewport: VIEWPORT,
    url: BASE_URL,
    hasPreviewShell: hasPreviewShell > 0,
    screenshots,
    layoutAudit,
  };

  const reportPath = path.join(OUT_DIR, 'audit-report.json');
  await import('fs/promises').then((fs) =>
    fs.writeFile(reportPath, JSON.stringify(report, null, 2)),
  );

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});