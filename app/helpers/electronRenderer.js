import { ipcRenderer } from "electron";
import EventEmitter from "events";

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

// This shims a streamed response returned by a gRPC call by using an EventEmitter
// instance to proxy events. This is needed to avoid some serialization issues
// when the call is performed in the preload script while the response will be
// used in the ipc renderer process.
export const shimStreamedResponse = (call) => {
  const emitter = new EventEmitter();
  call.on("data", (...args) => emitter.emit("data", ...args));
  call.on("end", (...args) => emitter.emit("end", ...args));
  call.on("error", (...args) => emitter.emit("error", ...args));
  emitter.write = (...args) => call.write(...args);
  emitter.cancel = () => call.cancel();
  return emitter;
};
