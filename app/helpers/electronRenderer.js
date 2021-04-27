import { ipcRenderer } from "electron";

export const invoke = async (...args) => {
  const res = await ipcRenderer.invoke(...args);
  if (res instanceof Error) {
    throw res;
  }
  return res;
};

// Invocable generates a function that calls invoke for the given channel,
// passing all args.
export const invocable = (channel) => (...args) => invoke(channel, ...args);
