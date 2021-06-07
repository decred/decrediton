// This is a pseudo-module that just re-exports the preload-exported functions.
// This is needed so that the webpack config can select between this and the
// native module that has the actual implementation. On the preload and main
// electron process layers, the wallet/crypto module is used, while in the
// renderer process layer this is used.
import { walletCrypto } from "wallet-preload-shim";
export const blake256 = walletCrypto.blake256;
