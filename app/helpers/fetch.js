let fetch = globalThis?.fetch;

if (!fetch) {
  // When running on the ipc-main context, use the node-fetch module since node
  // does not provide a global fetch().
  fetch = require("electron-fetch").default;
}

export class FetchError extends Error {
  constructor(origURL, origConfig, res) {
    const msg = `error status ${res.status} when fetching '${origURL}'`;
    super(msg);

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.origURL = origURL;
    this.origConfig = origConfig;
    this.response = res;
  }
}

// Fetch the given URL with the given config or throw a FetchError if the
// endpoint returned a non-200 response.
const fetchOrThrow = async (url, config) => {
  const res = await fetch(url, config);
  if (res.status != 200) {
    throw new FetchError(url, config, res);
  }
  return res;
};

export const getJSON = async (url, config) => {
  const res = await fetchOrThrow(url, config);
  res.data = await res.json();
  return res;
};

export const postJSON = async (url, data, config) => {
  const jsonConfig = config || {};
  jsonConfig.method = "POST";
  jsonConfig.headers = jsonConfig.headers || {};
  jsonConfig.headers["Content-Type"] = "application/json";
  jsonConfig.body = JSON.stringify(data);
  const res = await fetchOrThrow(url, jsonConfig);
  res.data = await res.json();
  return res;
};
