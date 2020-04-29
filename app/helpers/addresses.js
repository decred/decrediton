import { TESTNET, MAINNET } from "constants";

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
const bs58checkBase = require("bs58check/base");

export const ERR_INVALID_ADDR_EMPTY = "ERR_INVALID_ADDR_EMPTY";
export const ERR_INVALID_ADDR_TOOSHORT = "ERR_INVALID_ADDR_TOOSHORT";
export const ERR_INVALID_ADDR_TOOLONG = "ERR_INVALID_ADDR_TOOLONG";
export const ERR_INVALID_ADDR_NETWORKPREFIX = "ERR_INVALID_ADDR_NETWORKPREFIX";
export const ERR_INVALID_ADDR_CHECKSUM = "ERR_INVALID_ADDR_CHECKSUM";

// isValidAddress performs a simple set of validations for a given address in
// the given network (either testnet or mainnet).
//
// Returns an error identifier or null if the address is valid.
//
// Validations Performed:
// 1) Length - Too short, too long, or empty
// 2) Network - Either mainnet or testnet
// 3) Checksum - https://github.com/bitcoinjs/bs58check/blob/master/test/base.js

// Injected checksum function
function _blake256x2(buffer) {
  buffer = createBlakeHash("blake256").update(buffer).digest();
  return createBlakeHash("blake256").update(buffer).digest();
}

export function isValidAddress(addr, network) {
  if (!addr || !addr.trim().length) return ERR_INVALID_ADDR_EMPTY;
  if (addr.length < 25) return ERR_INVALID_ADDR_TOOSHORT;
  if (addr.length > 36) return ERR_INVALID_ADDR_TOOLONG;

  if (network === TESTNET && addr[0] !== "T")
    return ERR_INVALID_ADDR_NETWORKPREFIX;
  if (network === MAINNET && addr[0] !== "D")
    return ERR_INVALID_ADDR_NETWORKPREFIX;

  try {
    const bs58check = bs58checkBase(_blake256x2);
    bs58check.decode(addr, _blake256x2);
  } catch (error) {
    return ERR_INVALID_ADDR_CHECKSUM;
  }

  return null;
}

const ERR_INVALID_MASTER_PUB_KEY = "ERR_INVALID_MASTER_PUB_KEY";
const ERR_INVALID_MASTERPUB_CHECKSUM = "ERR_INVALID_MASTERPUB_CHECKSUM";

export function isValidMasterPubKey(masterPubKey) {
  if (!masterPubKey || !masterPubKey.trim().length)
    return ERR_INVALID_MASTER_PUB_KEY;
  try {
    const bs58check = bs58checkBase(_blake256x2);
    bs58check.decode(masterPubKey, _blake256x2);
  } catch (error) {
    return ERR_INVALID_MASTERPUB_CHECKSUM;
  }

  return null;
}
