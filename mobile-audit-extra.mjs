import { chromium } from 'playwright';

const VIEWPORT = { width: 428, height: 926 };

async function runAudit(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const findings = [];

    // Page-level overflow
    const docScroll = document.documentElement.scrollWidth;
    if (docScroll > vw + 1) {
      findings.push({ issue: 'page-horizontal-overflow', scrollWidth: docScroll, vw });
    }

    // Hero links detailed layout
    const heroWrap = document.querySelector('#hero .flex.flex-wrap');
    if (heroWrap) {
      const items = [...heroWrap.children].map((el) => ({
        text: el.textContent?.trim().slice(0, 40),
        top: Math.round(el.getBoundingClientRect().top),
        width: Math.round(el.getBoundingClientRect().width),
      }));
      findings.push({ issue: 'hero-link-positions', items });
    }

    // Quote min-height jump risk
    const quote = document.querySelector('#hero p.max-w-xl');
    if (quote) {
      findings.push({
        issue: 'hero-quote-box',
        minHeight: getComputedStyle(quote).minHeight,
        lineHeight: getComputedStyle(quote).lineHeight,
      });
    }

    // Project title wrapping
    document.querySelectorAll('#projects h3').forEach((h3) => {
      const rect = h3.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(h3).lineHeight) || 24;
      findings.push({
        issue: 'project-title-wrap',
        title: h3.textContent?.trim(),
        lines: Math.round(rect.height / lh),
        height: rect.height,
      });
    });

    // Education layout
    document.querySelectorAll('#education article').forEach((article, i) => {
      const h3 = article.querySelector('h3');
      const period = article.querySelector('span.text-mono');
      findings.push({
        issue: 'education-entry-layout',
        index: i,
        schoolLines: Math.round(h3.getBoundingClientRect().height / (parseFloat(getComputedStyle(h3).lineHeight) || 24)),
        periodBelowSchool: period.getBoundingClientRect().top > h3.getBoundingClientRect().bottom - 2,
        periodTop: period.getBoundingClientRect().top,
        schoolBottom: h3.getBoundingClientRect().bottom,
      });
    });

    // Heatmap container and months
    const heatmapContainer = document.querySelector('#activity .overflow-x-auto');
    const months = document.querySelector('.github-heatmap__months');
    const grid = document.querySelector('.github-heatmap__grid');
    if (heatmapContainer && months && grid) {
      findings.push({
        issue: 'heatmap-metrics',
        containerClientWidth: heatmapContainer.clientWidth,
        containerScrollWidth: heatmapContainer.scrollWidth,
        heatmapWidth: document.querySelector('.github-heatmap').getBoundingClientRect().width,
        monthsWidth: months.getBoundingClientRect().width,
        gridWidth: grid.getBoundingClientRect().width,
        monthPaddingLeft: getComputedStyle(months).paddingLeft,
        weekdaysDisplay: getComputedStyle(document.querySelector('.github-heatmap__weekdays')).display,
        legendLessMoreHidden: [...document.querySelectorAll('#activity .flex.items-center.gap-1\\.5 span')].map((s) => ({
          text: s.textContent,
          display: getComputedStyle(s).display,
        })),
      });
    }

    // Contact grid tight fit
    const shell = document.querySelector('.contact-form-shell');
    const gridEl = document.querySelector('.contact-direct-grid');
    if (shell && gridEl) {
      const shellRect = shell.getBoundingClientRect();
      const gridRect = gridEl.getBoundingClientRect();
      findings.push({
        issue: 'contact-layout',
        formShellWidth: shellRect.width,
        directGridWidth: gridRect.width,
        gridCols: getComputedStyle(gridEl).gridTemplateColumns,
        gridOverflow: gridRect.right > vw,
        inputs: [...document.querySelectorAll('.contact-input')].map((i) => ({
          id: i.id,
          width: i.getBoundingClientRect().width,
          overflowsParent: i.getBoundingClientRect().right > shellRect.right + 1,
        })),
      });
    }

    // Footer blessing alignment vs copyright
    const blessing = document.querySelector('.footer-blessing');
    const copyright = document.querySelector('footer .border-t p');
    if (blessing && copyright) {
      findings.push({
        issue: 'footer-alignment',
        blessingAlign: getComputedStyle(blessing).textAlign,
        blessingMaxWidth: getComputedStyle(blessing).maxWidth,
        copyrightAlign: getComputedStyle(copyright).textAlign,
        sameRow: Math.abs(blessing.getBoundingClientRect().top - copyright.getBoundingClientRect().top) < 5,
      });
    }

    // Mobile menu z-index stacking
    const header = document.querySelector('.site-header');
    const menuBtn = document.querySelector('#mobile-nav summary');
    findings.push({
      issue: 'header-stacking',
      headerZ: getComputedStyle(header).zIndex,
      menuBtnHeight: menuBtn?.getBoundingClientRect().height,
      themeToggle: document.querySelector('button[aria-label*="theme"]')?.getBoundingClientRect(),
    });

    // Skills orphan pill
    const skillPills = [...document.querySelectorAll('.skill-list .tag-pill')];
    const rows = new Set(skillPills.map((p) => Math.round(p.getBoundingClientRect().top)));
    const lastPill = skillPills[skillPills.length - 1];
    findings.push({
      issue: 'skills-wrap',
      rowCount: rows.size,
      lastPillAlone: skillPills.filter((p) => Math.round(p.getBoundingClientRect().top) === Math.round(lastPill.getBoundingClientRect().top)).length === 1,
      lastPill: lastPill?.textContent,
    });

    return findings;
  });
}

async function auditMenu(page) {
  await page.locator('#mobile-nav summary').click();
  await page.waitForTimeout(200);
  const open = await page.evaluate(() => {
    const dropdown = document.querySelector('#mobile-nav .nav-dropdown');
    const hero = document.querySelector('#hero h1');
    const d = dropdown.getBoundingClientRect();
    const h = hero.getBoundingClientRect();
    return {
      issue: 'menu-overlap',
      dropdownCoversHero: !(d.right < h.left || d.left > h.right || d.bottom < h.top || d.top > h.bottom),
      dropdownRect: { top: d.top, left: d.left, right: d.right, bottom: d.bottom },
      heroRect: { top: h.top, left: h.left, right: h.right, bottom: h.bottom },
      dropdownBehindHeader: d.top < document.querySelector('.site-header').getBoundingClientRect().bottom,
      noBackdrop: !document.querySelector('.mobile-menu-backdrop'),
    };
  });
  await page.locator('#mobile-nav summary').click();
  return open;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const findings = await runAudit(page);
  const menu = await auditMenu(page);
  findings.push(menu);

  // 320px narrow check
  await page.setViewportSize({ width: 320, height: 568 });
  await page.waitForTimeout(300);
  const narrow = await page.evaluate(() => ({
    issue: 'narrow-320px',
    pageOverflow: document.documentElement.scrollWidth > window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    contactGridOverflow: (() => {
      const g = document.querySelector('.contact-direct-grid');
      return g ? g.getBoundingClientRect().right > window.innerWidth : null;
    })(),
    heroRows: (() => {
      const children = [...document.querySelector('#hero .flex.flex-wrap').children];
      return new Set(children.map((c) => Math.round(c.getBoundingClientRect().top))).size;
    })(),
  }));
  findings.push(narrow);

  console.log(JSON.stringify(findings, null, 2));
  await browser.close();
}

main();