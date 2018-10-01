const assert = require('assert')
const electron = require('electron')
const path = require('path')
const webdriverio = require('webdriverio')
import {
  WALLET_LAUNCH_BUTTON, WALLET_OVERVIEW_HEADER, WALLET_LAUNCH_PAGE, TRANSACTIONS_MENU_TAB,
  SEND_TRANSACTION_ADDRESS_INPUT, TESTNET_ADDRESS, SEND_TRANSACTION_AMOUNT_INPUT, AMOUNT_TO_SEND,
  SNACKBAR_SEND, PASSPHRASE_MODAL_INPUT, SEND_TRANSACTION_SEND_BUTTON, PASSPHRASE_TEST_ACCOUNT,
  PASSPHRASE_MODAL_CONTINUE_BUTTON,
} from "./pathConsts";

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

      let initialElement = WALLET_LAUNCH_PAGE;
      await startApp(app, initialElement);
      resolve(app);

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
    app.click(WALLET_LAUNCH_BUTTON)
    await sleep(15000);
    const isLoaded = await app.getHTML(WALLET_OVERVIEW_HEADER);
    assert.ok(isLoaded);
  }, 21000)
})

describe("Send Transaction" , async () => {
  it('Send Transaction', async () => {
    await sleep(1000);
    await app.click(TRANSACTIONS_MENU_TAB);
    await sleep(1000);
    app.setValue(SEND_TRANSACTION_ADDRESS_INPUT, TESTNET_ADDRESS);
    app.setValue(SEND_TRANSACTION_AMOUNT_INPUT, AMOUNT_TO_SEND);
    await sleep(1000);
    app.click(SEND_TRANSACTION_SEND_BUTTON);
    await sleep(1000);
    app.setValue(PASSPHRASE_MODAL_INPUT, PASSPHRASE_TEST_ACCOUNT);
    await sleep(1000);
    app.click(PASSPHRASE_MODAL_CONTINUE_BUTTON);
    await sleep(3000);
    const isSent = await app.getHTML(SNACKBAR_SEND);
    assert.ok(isSent);
  }, 10000)
})

describe("Shutdown" , async () => {
  it('Shutdown', async () => {
    app.close();
  })
})
