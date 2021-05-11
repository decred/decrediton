import * as fs from "wallet/fs";
import * as wallet from "wallet";
import * as walletCrypto from "wallet/crypto";
import { contextBridge } from "electron";

// Elements in this object define the public API exported by the preload script.
const api = {
  fs: fs,
  wallet: wallet,
  walletCrypto: walletCrypto
};

try {
  Object.keys(api).forEach((key) =>
    contextBridge.exposeInMainWorld(key, api[key])
  );
} catch (error) {
  // This happens when contextIsolation == false. Expose directly in the global
  // window object.
  Object.keys(api).forEach((key) => (window[key] = api[key]));
}
