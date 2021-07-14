import {
  rawToHex,
  reverseHash,
  putUint8,
  putUint16,
  putUint32,
  putUint64,
  hexToBytes
} from "./byteActions";
import { Uint64LE } from "int64-buffer";

// const SERTYPE_FULL = 0
const SERTYPE_NOWITNESS = 1;
const SERTYPE_ONLYWITNESS = 2;

// selializeNoWitnessEncode gets a decoded tx and serialize it.
// it returns its bytes buffer.

// code based at the method btc.Encode from dcrd.
// source: https://github.com/decred/dcrd/blob/b60c60ffe98bcea5becc4e9e4d2a4fe6152401f6/wire/msgtx.go
export const selializeNoWitnessEncode = (decodedTx) => {
  const { inputs, outputs } = decodedTx;
  const neededSize = calculateSerializeSize(decodedTx);
  const rawEncodedTx = new Uint8Array(neededSize);
  let position = 0;
  const version = decodedTx.version | (1 << 16);
  rawEncodedTx.set(putUint32(version), position);
  position += 4;
  const inputCount = inputs.length;
  let { value, n } = writeVarInt(inputCount);
  rawEncodedTx.set(value, position);
  position += n;

  inputs.forEach((input) => {
    position = writeTxInPrefix(input, rawEncodedTx, position);
  });

  const outputCount = outputs.length;
  const newValues = writeVarInt(outputCount);
  value = newValues.value;
  n = newValues.n;
  rawEncodedTx.set(value, position);
  position += n;

  outputs.forEach((output) => {
    position = writeTxOut(output, rawEncodedTx, position);
  });

  rawEncodedTx.set(putUint32(decodedTx.lockTime), position);
  position += 4;
  rawEncodedTx.set(putUint32(decodedTx.expiry), position);

  return Buffer.from(rawEncodedTx);
};

export function calculateSerializeSize(decodedTx) {
  const { inputs, outputs } = decodedTx;
  // Version 4 bytes + LockTime 4 bytes + Expiry 4 bytes +
  // Serialized varint size for the number of transaction
  // inputs and outputs.
  let n =
    12 +
    VarIntSerializeSize(inputs.length) +
    VarIntSerializeSize(outputs.length);

  inputs.forEach(() => {
    n += serializeSizePrefix();
  });

  outputs.forEach((o) => {
    n += serializeSize(o);
  });

  return n;
}

const MaxUint16 = 1 << (16 - 1);
const MaxUint32 = 1 << (32 - 1);

// writeVarInt serializes val to w using a variable number of bytes depending
// on its value.
function writeVarInt(val) {
  if (val < 0xfd) {
    return { value: putUint8(val), n: 1 };
  }

  if (val <= MaxUint16) {
    putUint8(0xfd);
    return { value: putUint16(val), n: 2 + 1 };
  }

  if (val <= MaxUint32) {
    putUint8(0xfe);
    return { value: putUint32(val), n: 4 + 1 };
  }
  putUint8(0xff);
  return { value: putUint64(val), n: 8 + 1 };
}

// VarIntSerializeSize returns the number of bytes it would take to serialize
// val as a variable length integer.
function VarIntSerializeSize(val) {
  // The value is small enough to be represented by itself, so it's
  // just 1 byte.
  if (val < 0xfd) {
    return 1;
  }

  // Discriminant 1 byte plus 2 bytes for the uint16.
  if (val <= MaxUint16) {
    return 3;
  }

  // Discriminant 1 byte plus 4 bytes for the uint32.
  if (val <= MaxUint32) {
    return 5;
  }

  // Discriminant 1 byte plus 8 bytes for the uint64.
  return 9;
}

// SerializeSizePrefix returns the number of bytes it would take to serialize
// the transaction input for a prefix.
function serializeSizePrefix() {
  // Outpoint Hash 32 bytes + Outpoint Index 4 bytes + Outpoint Tree 1 byte +
  // Sequence 4 bytes.
  return 41;
}

// serializeSize returns the number of bytes it would take to serialize the
// the transaction output.
function serializeSize(output) {
  // Value 8 bytes + Version 2 bytes + serialized varint size for
  // the length of PkScript + PkScript bytes.
  return (
    8 + 2 + VarIntSerializeSize(output.script.length) + output.script.length
  );
}

// writeOutPoint encodes op to the Decred protocol encoding for an OutPoint
// to w.
function writeOutPoint(input, arr8, position) {
  const opRawHash = hexToBytes(input.prevTxId);
  arr8.set(opRawHash, position);
  position += opRawHash.length;
  arr8.set(putUint32(input.outputIndex), position);
  position += 4;
  arr8.set(putUint8(input.outputTree), position);
  return position + 1;
}

// writeTxInPrefixs encodes ti to the Decred protocol encoding for a transaction
// input (TxIn) prefix to w.
function writeTxInPrefix(input, arr8, position) {
  position = writeOutPoint(input, arr8, position);
  arr8.set(putUint32(input.sequence), position);
  return position + 4;
}

// writeTxOut encodes to into the Decred protocol encoding for a transaction
// output (TxOut) to w.
function writeTxOut(output, arr8, position) {
  arr8.set(putUint64(output.value), position);
  position += 8;

  arr8.set(putUint16(output.version), position);
  position += 2;

  const { n, value } = writeVarInt(output.script.length);

  arr8.set(value, position);
  position += n;

  arr8.set(output.script, position);
  return position + output.script.length;
}

// decodeRawTransaction decodes a raw transaction into a human readable
// object.
export function decodeRawTransaction(rawTx) {
  let position = 0;

  const tx = {};
  const version = rawTx.readUInt32LE(position);
  tx.version = version & 0xffff;
  tx.serType = version >> 16;
  position += 4;

  if (tx.serType !== SERTYPE_ONLYWITNESS) {
    // Equivalent to decodePrefix().
    let first = rawTx.readUInt8(position);
    position += 1;
    switch (first) {
      case 0xfd:
        tx.numInputs = rawTx.readUInt16LE(position);
        position += 2;
        break;
      case 0xfe:
        tx.numInputs = rawTx.readUInt32LE(position);
        position += 4;
        break;
      default:
        tx.numInputs = first;
    }
    tx.inputs = [];
    for (let i = 0; i < tx.numInputs; i++) {
      const input = {};
      const opRawHash = rawTx.slice(position, position + 32);
      input.prevTxId = reverseHash(rawToHex(opRawHash));
      position += 32;
      input.outputIndex = rawTx.readUInt32LE(position);
      position += 4;
      input.outputTree = rawTx.readUInt8(position);
      position += 1;
      input.sequence = rawTx.readUInt32LE(position);
      position += 4;
      input.index = i;
      tx.inputs.push(input);
    }

    first = rawTx.readUInt8(position);
    position += 1;
    switch (first) {
      case 0xfd:
        tx.numOutputs = rawTx.readUInt16LE(position);
        position += 2;
        break;
      case 0xfe:
        tx.numOutputs = rawTx.readUInt32LE(position);
        position += 4;
        break;
      default:
        tx.numOutputs = first;
    }

    tx.outputs = [];
    for (let j = 0; j < tx.numOutputs; j++) {
      const output = {};
      output.value = Uint64LE(rawTx.slice(position, position + 8)).toNumber();
      position += 8;
      output.version = rawTx.readUInt16LE(position);
      position += 2;
      // check length of scripts
      let scriptLen;
      first = rawTx.readUInt8(position);
      position += 1;
      switch (first) {
        case 0xfd:
          scriptLen = rawTx.readUInt16LE(position);
          position += 2;
          break;
        case 0xfe:
          scriptLen = rawTx.readUInt32LE(position);
          position += 4;
          break;
        default:
          scriptLen = first;
      }
      output.script = rawTx.slice(position, position + scriptLen);
      output.index = j;

      position += scriptLen;
      tx.outputs.push(output);
    }

    tx.lockTime = rawTx.readUInt32LE(position);
    position += 4;
    tx.expiry = rawTx.readUInt32LE(position);
    position += 4;
    tx.prefixOffset = position;
  }

  if (tx.serType !== SERTYPE_NOWITNESS) {
    // Equivalent to decodeWitness().
    let first = rawTx.readUInt8(position);
    position += 1;
    let numWitness;
    switch (first) {
      case 0xfd:
        numWitness = rawTx.readUInt16LE(position);
        position += 2;
        break;
      case 0xfe:
        numWitness = rawTx.readUInt32LE(position);
        position += 4;
        break;
      default:
        numWitness = first;
    }

    for (let i = 0; i < numWitness; i++) {
      const inp = tx.inputs[i];
      inp.valueIn = Uint64LE(rawTx.slice(position, position + 8)).toNumber();
      position += 8;
      inp.blockHeight = rawTx.readUInt32LE(position);
      position += 4;
      inp.blockIndex = rawTx.readUInt32LE(position);
      position += 4;

      first = rawTx.readUInt8(position);
      position += 1;
      let scriptLen;
      switch (first) {
        case 0xfd:
          scriptLen = rawTx.readUInt16LE(position);
          position += 2;
          break;
        case 0xfe:
          scriptLen = rawTx.readUInt32LE(position);
          position += 4;
          break;
        default:
          scriptLen = first;
      }
      inp.sigScript = rawTx.slice(position, position + scriptLen);
      position += scriptLen;
    }
  }

  return tx;
}
