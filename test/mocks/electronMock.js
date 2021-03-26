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
