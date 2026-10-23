import * as fs from "wallet/fs";
import * as wallet from "wallet";
import * as walletCrypto from "wallet/crypto";
import * as dex from "wallet/dex";
import * as ln from "wallet/ln";
import * as trezord from "wallet/trezord";
import * as politeia from "wallet/politeia";
import { contextBridge } from "electron";

// Elements in this object define the public API exported by the preload script.
const api = {
  fs: fs,
  wallet: wallet,
  walletCrypto: walletCrypto,
  dex: dex,
  ln: ln,
  politeia: politeia,
  trezord: trezord
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
