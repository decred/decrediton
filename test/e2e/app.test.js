const assert = require('assert')
const electron = require('electron')
const path = require('path')
const webdriverio = require('webdriverio')

let app, started, crashed

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

function launch(t) {
  if (!started) {
    started = new Promise(async resolve => {
      const options = {
        host: 'localhost',
        port: 9515,
        desiredCapabilities: {
          browserName: 'chrome',
          chromeOptions: {
            binary: electron,
            args: ['app='+path.join(__dirname, '..', '..', 'app', 'main.js')]
          }
        }
      }
      app = webdriverio.remote(options)

      let initialElement = ".page-body"
      await startApp(app, initialElement)
      resolve(app)

    })
  }

  return started
}

async function startApp(app, awaitingSelector) {
    await app.init()
    const isStarted = await app.getHTML(awaitingSelector)
    assert.ok(isStarted)
}

describe('Application launch', async () => {
  beforeAll(async () => {
    await launch();
  })

  // afterAll(() => app.end())

  it('Sync Decrediton', async () => {
    await sleep(5000);
    await app.click('//*[@id="root"]/div[1]/div/div/div/div/div[5]/div/div/div[1]/div[5]/span')
    await sleep(10000);
    const isLoaded = await app.getHTML('.overview-header');
    assert.ok(isLoaded);
  }, 20000)

})
