const fs = require('node:fs')

function loadPlaywright() {
  try {
    return require('playwright')
  } catch {
    return require('C:/Users/김용우/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
  }
}

function findChromePath() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROME_PATH,
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ].filter(Boolean)

  return candidates.find((candidate) => fs.existsSync(candidate))
}

const { chromium } = loadPlaywright()

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: findChromePath(),
  })
  const results = {}

  for (const [name, viewport] of Object.entries({
    desktop: { width: 1440, height: 1100 },
    mobile: { width: 390, height: 900 },
  })) {
    const page = await browser.newPage({ viewport })
    const errors = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })

    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
    const text = await page.locator('body').innerText()
    const layout = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }))
    await page.screenshot({
      path: `C:/Users/김용우/Documents/New project/screenshot-${name}.png`,
      fullPage: true,
    })

    results[name] = {
      title: await page.title(),
      hasCoreMessage: text.includes('우리는 배송을 더 빠르게'),
      hasBrokenReplacement: text.includes('�'),
      hasMojibakeHints: /諛|湲|援|願|吏|꾪|꾩/.test(text),
      layout,
      consoleErrors: errors,
      textSample: text.slice(0, 500),
    }

    await page.close()
  }

  await browser.close()
  console.log(JSON.stringify(results, null, 2))
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
