import { ipcRenderer } from "electron";

export const invoke = async (...args) => {
  const res = await ipcRenderer.invoke(...args);
  if (res instanceof Error) {
    throw res;
  }
  return res;
};
