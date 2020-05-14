import * as wallet from "wallet";
import { sprintf } from "sprintf-js";
import { rawToHex } from "helpers";

const hardeningConstant = 0x80000000;

// Right now (2018-07-06) dcrwallet only supports a single account on watch only
// wallets. Therefore we are limited to using this single account when signing
// transactions via trezor.
export const WALLET_ACCOUNT = 0;

export const accountPath = (account, coinType) => {
  return [
    (44 | hardeningConstant) >>> 0, // purpose
    ((coinType || 0) | hardeningConstant) >>> 0, // coin type
    ((account || 0) | hardeningConstant) >>> 0 // account
  ];
};

export const addressPath = (index, branch, account, coinType) => {
  return [
    (44 | hardeningConstant) >>> 0, // purpose
    ((coinType || 0) | hardeningConstant) >>> 0, // coin type
    ((account || 0) | hardeningConstant) >>> 0, // account
    (branch || 0) >>> 0, // branch
    index >>> 0 // index
  ];
};

// walletTxToBtcjsTx is a aux function to convert a tx decoded by the decred wallet (ie,
// returned from wallet.decoreRawTransaction call) into a bitcoinjs-compatible
// transaction (to be used in trezor).
export const walletTxToBtcjsTx = async (
  walletService,
  chainParams,
  tx,
  inputTxs,
  changeIndex
) => {
  const inputs = tx.inputs.map(async (inp) => {
    const addr = inp.outpointAddress;
    if (!addr)
      throw sprintf(`Outpoint ${inp.outpoint} does not have addresses.`);

    const addrValidResp = await wallet.validateAddress(walletService, addr);
    if (!addrValidResp.getIsValid())
      throw "Input has an invalid address " + addr;

    // Trezor firmware (mcu) currently (2018-06-25) only support signing
    // when all inputs of the transaction are from the wallet. This happens
    // due to the fact that trezor firmware re-calculates the source
    // pkscript given the address_n of the input, instead of using it (the
    // pkscript) directly when hashing the tx prior to signing. This needs
    // to be changed so that we can perform more advanced types of
    // transactions.
    if (!addrValidResp.getIsMine())
      throw "Trezor only supports signing when all inputs are from the wallet.";

    const addrIndex = addrValidResp.getIndex();
    const addrBranch = addrValidResp.getIsInternal() ? 1 : 0;
    return {
      prev_hash: inp.prevTxId,
      prev_index: inp.outputIndex,
      amount: inp.amountIn,
      sequence: inp.sequence,
      address_n: addressPath(
        addrIndex,
        addrBranch,
        WALLET_ACCOUNT,
        chainParams.HDCoinType
      ),
      decred_tree: inp.outputTree
    };
  });

  const outputs = tx.outputs.map(async (outp, i) => {
    if (outp.addresses.length !== 1) {
      // TODO: this will be true on OP_RETURNs. Support those.
      throw new Error("Output has different number of addresses than expected");
    }
    let addr = outp.addresses[0].address;
    const addrValidResp = await wallet.validateAddress(walletService, addr);
    if (!addrValidResp.getIsValid()) throw "Not a valid address: " + addr;
    let address_n = null;

    if (i === changeIndex && addrValidResp.getIsMine()) {
      const addrIndex = addrValidResp.getIndex();
      const addrBranch = addrValidResp.getIsInternal() ? 1 : 0;
      address_n = addressPath(
        addrIndex,
        addrBranch,
        WALLET_ACCOUNT,
        chainParams.HDCoinType
      );
      addr = null;
    }
    return {
      amount: outp.value,
      script_type: "PAYTOADDRESS", // needs to change on OP_RETURNs
      address: addr,
      address_n: address_n,
      decred_script_version: outp.version
    };
  });

  return {
    inputs: await Promise.all(inputs),
    outputs: await Promise.all(outputs)
  };
};

// walletTxToRefTx converts a tx decoded by the decred wallet (ie,
// returned from wallet.decoreRawTransaction call) into a trezor
// RefTransaction object to aux when SignTx.
export const walletTxToRefTx = async (walletService, tx) => {
  const inputs = tx.inputs.map(async (inp) => {
    const addr = inp.outpointAddress;
    if (!addr)
      throw sprintf(`Outpoint ${inp.outpoint} does not have addresses.`);

    const addrValidResp = await wallet.validateAddress(walletService, addr);
    if (!addrValidResp.getIsValid())
      throw "Input has an invalid address " + addr;

    // Trezor firmware (mcu) currently (2018-06-25) only support signing
    // when all inputs of the transaction are from the wallet. This happens
    // due to the fact that trezor firmware re-calculates the source
    // pkscript given the address_n of the input, instead of using it (the
    // pkscript) directly when hashing the tx prior to signing. This needs
    // to be changed so that we can perform more advanced types of
    // transactions.
    if (!addrValidResp.getIsMine())
      throw "Trezor only supports signing when all inputs are from the wallet.";

    return {
      prev_hash: inp.prevTxId,
      prev_index: inp.outputIndex,
      amount: inp.amountIn,
      sequence: inp.sequence,
      decred_tree: inp.outputTree
    };
  });

  const outputs = tx.outputs.map(async (outp) => {
    const addr = outp.addresses[0].address;
    const addrValidResp = await wallet.validateAddress(walletService, addr);
    if (!addrValidResp.getIsValid())
      throw new Error("Not a valid address: " + addr);
    return {
      amount: outp.value,
      script_pubkey: rawToHex(outp.script),
      decred_script_version: outp.version
    };
  });

  const txInfo = {
    hash: wallet.calculateHashFromDecodedTx(tx),
    lock_time: tx.lockTime,
    version: tx.version,
    expiry: tx.expiry,
    inputs: await Promise.all(inputs),
    bin_outputs: await Promise.all(outputs)
  };

  return txInfo;
};
