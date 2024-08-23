import { addressPath, fixPubKeyChecksum, signArg, writeUint64LE } from "helpers/ledger";
import toBuffer from "typedarray-to-buffer";

test("test ledger address path", () => {
  expect(addressPath(1, 2)).toStrictEqual("44'/42'/0'/1/2");
});

test("test ledger pubkey to hd key", () => {
  // testnet
  expect(fixPubKeyChecksum("tpubVpeRVBDM14ydoJ7jCzTayDHiP6CU4NcbKEW6bWQGSghmi14BfNx3omc6GjV3AxbtkTYcPAedw48XywVgSyY8H9ef73zWWtoZ6MCMLLJiUyq", true)).toStrictEqual("tpubVpeRVBDM14ydoJ7jCzTayDHiP6CU4NcbKEW6bWQGSghmi14BfNx3omc6GjV3AxbtkTYcPAedw48XywVgSyY8H9ef73zWWtoZ6MCMLGM6GV3");
  // mainet
  expect(fixPubKeyChecksum("dpubZFs9f5ex4qxoiqCHVEnotAaYpZhCgwDAndMyLicfcXJysBmNxMyx7X3QHW2NiUN14KnekWcMQt4XwyF5wAqDPzbLcv59mQTRhL6foyvvqLK", false)).toStrictEqual("dpubZFs9f5ex4qxoiqCHVEnotAaYpZhCgwDAndMyLicfcXJysBmNxMyx7X3QHW2NiUN14KnekWcMQt4XwyF5wAqDPzbLcv59mQTRhL6fp1csmnS");
});

function dispatchFn (inputs) {
  return function () {
    return inputs;
  };
}

test("test ledger constructing arg to sign", async () => {
  const txHex = "010000000189ce17f618249cee2e03fa8625731119f62995dbdd501b5fca26f77817709ed20000000000ffffffff02fadf47060000000000001976a914bd677e7a95242c2d54227e3928ced889cc3aaea788acb0c412000000000000001976a914d251921c9857791815e97750afcea48fbd30568a88ac0000000000000000018cae5a060000000000000000ffffffff00";
  const mockDispatch = dispatchFn([{ "version": 1, "serType": 0, "numInputs": 1, "inputs": [{ "prevTxId": "9874aacfe5b9179092f260882807e7088e7fca96fbce908999f31f42c37158be", "outputIndex": 0, "outputTree": 0, "sequence": 4294967295, "index": 0, "valueIn": 0, "blockHeight": 0, "blockIndex": 4294967295, "sigScript": { "0": 71, "1": 48, "2": 68, "3": 2, "4": 32, "5": 91, "6": 228, "7": 127, "8": 22, "9": 156, "10": 231, "11": 152, "12": 180, "13": 69, "14": 163, "15": 217, "16": 181, "17": 246, "18": 76, "19": 150, "20": 237, "21": 250, "22": 47, "23": 87, "24": 202, "25": 47, "26": 129, "27": 182, "28": 234, "29": 133, "30": 42, "31": 191, "32": 188, "33": 219, "34": 16, "35": 99, "36": 68, "37": 2, "38": 32, "39": 104, "40": 94, "41": 54, "42": 96, "43": 225, "44": 218, "45": 133, "46": 125, "47": 122, "48": 238, "49": 201, "50": 207, "51": 102, "52": 34, "53": 30, "54": 199, "55": 128, "56": 204, "57": 74, "58": 161, "59": 142, "60": 18, "61": 14, "62": 185, "63": 194, "64": 34, "65": 150, "66": 21, "67": 130, "68": 145, "69": 244, "70": 114, "71": 1, "72": 33, "73": 3, "74": 51, "75": 241, "76": 244, "77": 132, "78": 192, "79": 73, "80": 61, "81": 162, "82": 82, "83": 113, "84": 188, "85": 186, "86": 229, "87": 98, "88": 168, "89": 15, "90": 128, "91": 182, "92": 75, "93": 174, "94": 184, "95": 118, "96": 235, "97": 168, "98": 34, "99": 43, "100": 42, "101": 98, "102": 50, "103": 181, "104": 90, "105": 163 } }], "numOutputs": 2, "outputs": [{ "value": 106606220, "version": 0, "script": Buffer.from([118, 169, 20, 48, 70, 200, 250, 47, 33, 119, 236, 175, 143, 189, 11, 151, 85, 235, 112, 233, 41, 210, 151, 136, 172]), "index": 0, "decodedScript": { "scriptClass": 2, "address": "TsVRPhzyuvCuxPipBx2YeLarrTPPEAsv4Bh", "requiredSig": 1, "asm": "OP_DUP OP_HASH160 OP_DATA_20 3046c8fa2f2177ecaf8fbd0b9755eb70e929d297 OP_EQUALVERIFY OP_CHECKSIG" } }, { "value": 1230000, "version": 0, "script": Buffer.from([118, 169, 20, 210, 81, 146, 28, 152, 87, 121, 24, 21, 233, 119, 80, 175, 206, 164, 143, 189, 48, 86, 138, 136, 172]), "index": 1, "decodedScript": { "scriptClass": 2, "address": "TskCC6UkcKfBRsrJVPhSjwGjn7ptD34HA4T", "requiredSig": 1, "asm": "OP_DUP OP_HASH160 OP_DATA_20 d251921c9857791815e97750afcea48fbd30568a OP_EQUALVERIFY OP_CHECKSIG" } }], "lockTime": 0, "expiry": 0, "hash": "d29e701778f726ca5f1b50dddb9529f61911732586fa032eee9c2418f617ce89" }]);
  const want = { "inputs": [[{ "version": { "type": "Buffer", "data": [1, 0, 0, 0] }, "inputs": [{ "prevout": { "type": "Buffer", "data": [190, 88, 113, 195, 66, 31, 243, 153, 137, 144, 206, 251, 150, 202, 127, 142, 8, 231, 7, 40, 136, 96, 242, 146, 144, 23, 185, 229, 207, 170, 116, 152, 0, 0, 0, 0] }, "script": { "type": "Buffer", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, "sequence": { "type": "Buffer", "data": [255, 255, 255, 255] }, "tree": { "type": "Buffer", "data": [0] } }], "outputs": [{ "amount": { "type": "Buffer", "data": [140, 174, 90, 6, 0, 0, 0, 0] }, "script": { "type": "Buffer", "data": [118, 169, 20, 48, 70, 200, 250, 47, 33, 119, 236, 175, 143, 189, 11, 151, 85, 235, 112, 233, 41, 210, 151, 136, 172] } }, { "amount": { "type": "Buffer", "data": [176, 196, 18, 0, 0, 0, 0, 0] }, "script": { "type": "Buffer", "data": [118, 169, 20, 210, 81, 146, 28, 152, 87, 121, 24, 21, 233, 119, 80, 175, 206, 164, 143, 189, 48, 86, 138, 136, 172] } }], "locktime": { "type": "Buffer", "data": [0, 0, 0, 0] }, "nExpiryHeight": { "type": "Buffer", "data": [0, 0, 0, 0] } }, 0]], "associatedKeysets": ["44'/42'/0'/1/71"], "changePath": "44'/42'/0'/1/72", "outputScriptHex": { "type": "Buffer", "data": [2, 250, 223, 71, 6, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 189, 103, 126, 122, 149, 36, 44, 45, 84, 34, 126, 57, 40, 206, 216, 137, 204, 58, 174, 167, 136, 172, 176, 196, 18, 0, 0, 0, 0, 0, 0, 0, 25, 118, 169, 20, 210, 81, 146, 28, 152, 87, 121, 24, 21, 233, 119, 80, 175, 206, 164, 143, 189, 48, 86, 138, 136, 172] }, "lockTime": 0, "sigHashType": 1, "segwit": false, "expiryHeight": { "type": "Buffer", "data": [0, 0, 0, 0] }, "useTrustedInputForSegwit": false, "additionals": ["decred"] };
  const data = await signArg(txHex, null, null, mockDispatch);
  expect(JSON.stringify(data)).toStrictEqual(JSON.stringify(want));
});

test("test writeUint64LE", () => {
  expect(writeUint64LE(0)).toStrictEqual(toBuffer([0, 0, 0, 0, 0, 0, 0, 0]));
  expect(writeUint64LE(1)).toStrictEqual(toBuffer([1, 0, 0, 0, 0, 0, 0, 0]));
  expect(writeUint64LE(0xffffffff)).toStrictEqual(toBuffer([255, 255, 255, 255, 0, 0, 0, 0]));
  expect(writeUint64LE(0x100000000)).toStrictEqual(toBuffer([0, 0, 0, 0, 1, 0, 0, 0]));
  // Numbers somewhere over ~2^48 lose precision and do not work.
  expect(writeUint64LE(0xffffffff0000)).toStrictEqual(toBuffer([0, 0, 255, 255, 255, 255, 0, 0]));
  expect(writeUint64LE(0xffffffffffff)).toStrictEqual(toBuffer([255, 255, 255, 255, 255, 255, 0, 0]));
  expect(writeUint64LE(6300978765321)).toStrictEqual(toBuffer([9, 222, 153, 15, 187, 5, 0, 0]));
});
