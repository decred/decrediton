export default {};

export const remote = {
  dialog: {},
  getCurrentWindow() {}
};

export const ipcRenderer = {
  sendSync: jest.fn(() => {
    return {};
  }),
  send: jest.fn(() => {}),
  once: jest.fn(),
  invoke: jest.fn()
};

export const clipboard = {
  readText: jest.fn(() => "")
};

export let onBeforeSendHeadersListener;
export let onHeadersReceivedListener;

export const session = {
  defaultSession: {
    setProxy: jest.fn(() => Promise.resolve()),
    webRequest: {
      onBeforeSendHeaders: jest.fn((_, cb) => {
        onBeforeSendHeadersListener = cb;
      }),
      onHeadersReceived: jest.fn((cb) => {
        onHeadersReceivedListener = cb;
      })
    }
  }
};

export const app = {
  name: "testAppName",
  getVersion: () => "testVersion"
};
