'use strict'

const puppeteer = require('puppeteer')
const { selectors, languages } = require('./deluoode.json')

class Deluooder {
  constructor () {
    this.browser = null
    this.page = null
  }

  async init ({ headless = true, slowMo = 0 }) {
    this.browser = await puppeteer.launch({ headless, slowMo })
    this.page = await this.browser.newPage()

    await this.page.goto('https://translate.google.fr/')

    // Set screen size
    await this.page.setViewport({ width: 1080, height: 1024 })

    // Accepter CGU :
    await this.page.click(selectors.accept)
    await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  };

  async setLanguageFrom (language) {
    await this.page.click(selectors.sourceLang)
    await this.page.waitForSelector(selectors.searchLang)
    await this.page.keyboard.type(languages[language])
    await this.page.keyboard.press('Enter')
  }

  async setLanguageTo (language) {
    await this.page.click(selectors.targetLang)
    await this.page.waitForSelector(selectors.searchLang)
    await this.page.keyboard.type(languages[language])
    await this.page.keyboard.press('Enter')
  }

  async setSentence (text) {
    await this.page.type(selectors.input, text)
  }

  async getTranslation () {
    await this.page.waitForSelector(selectors.output)
    const element = await this.page.$(selectors.output)
    const value = await this.page.evaluate(el => el.textContent, element)
    return value
  }

  close () {
    this.browser.close()
  }
}

async function main () {
  const deluooder = new Deluooder()
  await deluooder.init({ headless: false, slowMo: 20 })

  await deluooder.setLanguageFrom('en')
  await deluooder.setLanguageTo('fr')
  await deluooder.setSentence('Hello Deluoode!')

  const translation = await deluooder.getTranslation()
  console.log(translation)
  await deluooder.close()
}

if (require.main === module) {
  main()
}

module.exports = Deluooder
