import { makeRandomString } from "helpers/strings";
import { shimStreamedResponse } from "helpers/electronRenderer";

// This map tracks gRPC clients in the preload layer via a random ID.
const clients = {};

export const trackClient = (client) => {
  const id = makeRandomString(32);
  clients[id] = client;
  return id;
};

export const getClient = (id) => clients[id];

export const delClient = (id) => delete clients[id];

// shimError mocks the given gRPC error as a standard object that can be
// converted to a js string via String(error). This is needed due to standard
// Error instances not copying the error code across the preload -> ipcRenderer
// boundary.
export const shimError = (err) => ({ toString: () => err.message, code: err.code });

// mappedRequest returns a promise that executes the given fn gRPC call and maps
// the result using mapFn.
export const mappedRequest = (client, fn, req, mapFn) =>
  new Promise((resolve, reject) => {
    getClient(client)[fn](req, (err, resp) => {
      if (err) return reject(shimError(err));
      resolve(mapFn(resp));
    });
  });

// simpleRequest executes the given fn gRPC call and maps the result using the
// standard res.toObject().
export const simpleRequest = (client, fn, req) =>
  mappedRequest(client, fn, req, (res) => res.toObject());

// streamedRequest returns a promise that executes the given streamed response
// and (optionally) maps individual data event objects using the given mapFn.
// If mapFn is not specified, the standard response.toObject() mapping is done.
export const streamedRequest = (client, fn, req, mapFn) =>
  new Promise((resolve, reject) => {
    try {
      resolve(shimStreamedResponse(getClient(client)[fn](req), mapFn));
    } catch (error) {
      reject(shimError(error));
    }
  });
