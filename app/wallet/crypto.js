let createBlakeHash;
if (process.env.NODE_ENV === "test") {
  // Node 10.x errors when trying to import the native blake-hash during unit
  // test. As far as I (matheusd) can see, this only happens during test, and
  // isn't triggered in runtime, even if the native module does run. So for the
  // moment, I'm resorting to running the js version during tests. Ideally, this
  // needs to be solved in the upstream blake-hash so that we can also use the
  // native version in tests.
  createBlakeHash = require("blake-hash/js");
} else {
  createBlakeHash = require("blake-hash");
}

export const blake256 = (buffer) => {
  let b = buffer;
  if (buffer instanceof Uint8Array) {
    // This case happens when this function runs in the preload script with
    // renderer provided data.
    b = Buffer.from(buffer);
  }
  return createBlakeHash("blake256").update(b).digest();
};
