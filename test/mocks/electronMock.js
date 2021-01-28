export default {};

export const remote = {
  dialog: {},
  getCurrentWindow() {}
};

export const ipcRenderer = {
  sendSync: jest.fn(channel => {
    return {};
  }),
  send: jest.fn(() => {})
};

export const clipboard = {
  readText: jest.fn(() => "")
};
