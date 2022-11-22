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
export const invocable =
  (channel) =>
  (...args) =>
    invoke(channel, ...args);

// This shims a streamed response returned by a gRPC call by using an EventEmitter
// instance to proxy events. This is needed to avoid some serialization issues
// when the call is performed in the preload script while the response will be
// used in the ipc renderer process.
export const shimStreamedResponse = (call, mapFn) => {
  // emitter is a pseudo-copy of EventEmitter, written so that it's proxiable
  // across the preload script boundary.
  const handlers = {};
  const emitter = {};

  if (!mapFn) mapFn = (res) => res.toObject();

  call.on("data", (res) => emitter.emit("data", mapFn(res)));
  call.on("end", (...args) => emitter.emit("end", ...args));
  call.on("error", (...args) => emitter.emit("error", ...args));
  emitter.on = (channel, cb) => (handlers[channel] = cb);
  emitter.emit = (channel, ...args) =>
    handlers[channel] ? handlers[channel](...args) : null;
  emitter.write = (...args) => call.write(...args);
  emitter.cancel = () => call.cancel();
  return emitter;
};
