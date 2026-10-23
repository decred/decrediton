import { wallet } from "wallet-preload-shim";
import { strHashToRaw } from "helpers";
import { default as blake } from "blake-hash";
import * as bs58 from "bs58";
import toBuffer from "typedarray-to-buffer";
import { getTxFromInputs } from "../actions/TransactionActions";

const ONE_OVER_MAX_UINT32 = 0x100000000;

export function addressPath(branch, index) {
  const prefix = "44'/42'/0'/";
  const i = (index || 0).toString();
  const b = (branch || 0).toString();
  return prefix + b + "/" + i;
}

// fixPubKeyChecksum replaces the sha256 checksum, or last four bytes, of a
// pubkey with a blake256 checksum.
export function fixPubKeyChecksum(pubKey, isTestnet) {
  const mainnetPubPrefix = "dpub";
  const testnetPubPrefix = "tpub";
  if (isTestnet) {
    if (pubKey.slice(0, 4) !== testnetPubPrefix) {
      throw "pubkey is not for testnet";
    }
  } else if (pubKey.slice(0, 4) !== mainnetPubPrefix) {
    throw "pubkey is not for mainnet";
  }
  const buff = bs58.decode(pubKey).slice(0, -4);
  const firstPass = blake("blake256").update(Buffer.from(buff)).digest();
  const secondPass = blake("blake256").update(firstPass).digest();
  const fullSerialize = Buffer.concat([
    Buffer.from(buff),
    secondPass.slice(0, 4)
  ]);
  return bs58.encode(fullSerialize);
}

function writeUint16LE(n) {
  const buff = new Buffer(2);
  buff.writeUInt16LE(n, 0);
  return buff;
}

function writeUint32LE(n) {
  const buff = new Buffer(4);
  buff.writeUInt32LE(n, 0);
  return buff;
}

// Exported for testing.
//
// TODO: Electron cannot handle a uint64 with full precision so one cannot be
// passed to this function. Maybe we should find a better way to pass this value.
export function writeUint64LE(n) {
  const buff = new Buffer(8);
  // bitshift right (>>>) does not seem to throw away the lower half, so
  // dividing and throwing away the remainder.
  const upper = Math.floor(n / ONE_OVER_MAX_UINT32);
  const lower = n % ONE_OVER_MAX_UINT32;
  buff.writeUInt32LE(lower, 0);
  buff.writeUInt32LE(upper, 4);
  return buff;
}

function inputToTx(tx) {
  const inputs = [];
  for (const inp of tx.inputs) {
    const sequence = writeUint32LE(inp.sequence);
    const tree = new Uint8Array(1);
    tree[0] = inp.outputTree;
    const prevout = new Uint8Array(36);
    prevout.set(strHashToRaw(inp.prevTxId), 0);
    prevout.set(writeUint32LE(inp.outputIndex), 32);
    const input = {
      prevout: toBuffer(prevout),
      script: toBuffer(new Uint8Array(25)),
      sequence: sequence,
      tree: toBuffer(tree)
    };
    inputs.push(input);
  }
  const outputs = [];
  for (const out of tx.outputs) {
    const output = {
      amount: writeUint64LE(out.value),
      script: out.script
    };
    outputs.push(output);
  }
  return {
    version: writeUint32LE(tx.version), // Pretty sure this is a uint16 but ledger does not want that.
    inputs: inputs,
    outputs: outputs,
    locktime: writeUint32LE(tx.lockTime),
    nExpiryHeight: writeUint32LE(tx.expiry)
  };
}

function createPrefix(tx) {
  const numOuts = tx.outputs.length;
  // TODO: Allow more outputs if possible.
  if (numOuts > 2) {
    throw "more than two outputs is not expected";
  }
  let buffLen = 1;
  for (const out of tx.outputs) {
    buffLen += 11 + out.script.length;
  }
  const buff = new Uint8Array(buffLen); // 1 varInt + ( 8 value + 2 tx version + 1 varInt + (23/25?) variable script length) * number of outputs
  let i = 0;
  buff[i] = numOuts;
  i += 1;
  for (const out of tx.outputs) {
    buff.set(writeUint64LE(out.value), i);
    i += 8;
    buff.set(writeUint16LE(out.version), i);
    i += 2;
    // TODO: Clean this up for production? Should use smarter logic to get varInts?
    buff[i] = out.script.length; // varInt for 23/25 bytes
    i += 1;
    buff.set(out.script, i);
    i += out.script.length;
  }
  return toBuffer(buff);
}

export async function signArg(txHex, chainParams, walletService, dispatch) {
  const tx = await wallet.decodeTransactionLocal(txHex, chainParams);
  const inputTxs = await dispatch(getTxFromInputs(tx));
  const inputs = [];
  const paths = [];
  for (const inp of tx.inputs) {
    let verboseInp;
    for (const it of inputTxs) {
      if (it.hash === inp.prevTxId) {
        verboseInp = it;
        break;
      }
    }
    if (!verboseInp) {
      throw "could not find input";
    }
    const prevOut = inputToTx(verboseInp);
    const idx = inp.outputIndex;
    inputs.push([prevOut, idx]);
    const addr = verboseInp.outputs[idx].decodedScript.address;
    const val = await wallet.validateAddress(walletService, addr);
    const acct = val.accountNumber.toString();
    const branch = val.isInternal ? "1" : "0";
    const index = val.index.toString();
    paths.push("44'/42'/" + acct + "'/" + branch + "/" + index);
  }
  let changePath = null;
  for (const out of tx.outputs) {
    const addr = out.decodedScript.address;
    const val = await wallet.validateAddress(walletService, addr);
    if (!val.isInternal) {
      continue;
    } // assume the internal address is change
    const acct = val.accountNumber.toString();
    const index = val.index.toString();
    changePath = "44'/42'/" + acct + "'/1/" + index;
    break;
  }

  return {
    inputs: inputs,
    associatedKeysets: paths,
    changePath: changePath,
    outputScriptHex: createPrefix(tx),
    lockTime: tx.lockTime,
    sigHashType: 1, // SIGHASH_ALL
    segwit: false,
    expiryHeight: writeUint32LE(tx.expiry),
    useTrustedInputForSegwit: false,
    additionals: ["decred"]
  };
}
