import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { createTransaction } from "@ledgerhq/hw-app-btc/lib/createTransaction";
import Btc from "@ledgerhq/hw-app-btc";
import * as ledgerHelpers from "../helpers/ledger";
import { wallet } from "wallet-preload-shim";
import { publishTransactionAttempt } from "./ControlActions";
import { hexToBytes } from "helpers";
import {
  SIGNTX_ATTEMPT,
  SIGNTX_FAILED,
  SIGNTX_SUCCESS
} from "./ControlActions";

const coin = "decred";

// This error will happen when ledger is on the home screen, but it is called
// "UNKNOWN_ERROR" so may be something else.
const wrongScreenStatus = 25873;
// This error indicates the wrong app, like the btc app, is open and will say
// CLA_NOT_SUPPORTED
const wrongAppStatus = 28160;

import * as selectors from "selectors";

export const LDG_LEDGER_ENABLED = "LDG_LEDGER_ENABLED";
export const LDG_WALLET_CLOSED = "LDG_WALLET_CLOSED";

// This is an error's message when an app is open but we are trying to get
// device info.
// const DEVICE_ON_DASHBOARD_EXPECTED = "DeviceOnDashboardExpected";

// enableLedger only sets a value in the config. Ledger connections are made
// per action then dropped.
export const enableLedger = () => (dispatch, getState) => {
  dispatch({ type: LDG_LEDGER_ENABLED });
  connect()(dispatch, getState);
};

export const LDG_CONNECT_ATTEMPT = "LDG_CONNECT_ATTEMPT";
export const LDG_CONNECT_FAILED = "LDG_CONNECT_FAILED";
export const LDG_CONNECT_SUCCESS = "LDG_CONNECT_SUCCESS";

// connect only checks that a connection does not error, so a device exists and
// is plugged in.
export const connect = () => async (dispatch /*, getState*/) => {
  dispatch({ type: LDG_CONNECT_ATTEMPT });
  try {
    await doWithTransport(async () => {});
  } catch (error) {
    dispatch({ type: LDG_CONNECT_FAILED });
    throw error;
  }
  dispatch({ type: LDG_CONNECT_SUCCESS });
};

export const LDG_LEDGER_DISABLED = "LDG_LEDGER_DISABLED";

// disableLedger disables ledger integration for the current wallet. Note
// that it does **not** disable in the config, so the wallet will restart as a
// ledger wallet next time it's opened.
export const disableLedger = () => (dispatch) => {
  dispatch({ type: LDG_LEDGER_DISABLED });
};

export const LDG_NOCONNECTEDDEVICE = "LDG_NOCONNECTEDDEVICE";

export const alertNoConnectedDevice = () => (dispatch) => {
  dispatch({ type: LDG_NOCONNECTEDDEVICE });
};

// checkLedgerIsDcrwallet verifies whether the wallet currently running on
// dcrwallet (presumably a watch only wallet created from a ledger provided
// xpub) is the same wallet as the one of the currently connected ledger. This
// function throws an error if they are not the same.
// This is useful for making sure, prior to performing some wallet related
// function such as transaction signing, that ledger will correctly perform the
// operation.
// Note that this might trigger pin/passphrase modals, depending on the current
// ledger configuration.
// The way the check is performed is by generating the first address from the
// ledger wallet and then validating this address agains dcrwallet, ensuring
// this is an owned address at the appropriate branch/index.
// This check is only valid for a single session (ie, a single execution of
// `deviceRun`) as the physical device might change between sessions.
const checkLedgerIsDcrwallet = () => async (dispatch, getState) => {
  const {
    grpc: { walletService }
  } = getState();

  const path = ledgerHelpers.addressPath(0, 0);
  const payload = await getAddress(path);
  const addr = payload.bitcoinAddress;

  const addrValidResp = await wallet.validateAddress(walletService, addr);
  if (!addrValidResp.isValid)
    throw "Ledger provided an invalid address " + addr;

  if (!addrValidResp.isMine)
    throw "Ledger and dcrwallet not running from the same extended public key";

  if (addrValidResp.index !== 0) throw "Wallet replied with wrong index.";
};

export const signTransactionAttemptLedger =
  (rawUnsigTx) => async (dispatch, getState) => {
    dispatch({ type: SIGNTX_ATTEMPT });
    const {
      grpc: { walletService }
    } = getState();
    const chainParams = selectors.chainParams(getState());

    try {
      const arg = await ledgerHelpers.signArg(
        rawUnsigTx,
        chainParams,
        walletService,
        dispatch
      );

      await dispatch(checkLedgerIsDcrwallet());
      const signedRaw = await createTx(arg);
      if (signedRaw.message) {
        throw signedRaw.message;
      }

      dispatch({ type: SIGNTX_SUCCESS });
      dispatch(publishTransactionAttempt(hexToBytes(signedRaw)));
    } catch (error) {
      dispatch({ error, type: SIGNTX_FAILED });
    }
  };

export const LDG_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT =
  "LDG_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT";
export const LDG_GETWALLETCREATIONMASTERPUBKEY_FAILED =
  "LDG_GETWALLETCREATIONMASTERPUBKEY_FAILED";
export const LDG_GETWALLETCREATIONMASTERPUBKEY_SUCCESS =
  "LDG_GETWALLETCREATIONMASTERPUBKEY_SUCCESS";

export const getWalletCreationMasterPubKey =
  () => async (dispatch, getState) => {
    dispatch({ type: LDG_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT });
    const isTestnet = selectors.isTestNet(getState());
    try {
      const payload = await getPubKey(isTestnet);
      const hdpk = ledgerHelpers.fixPubKeyChecksum(payload, isTestnet);
      dispatch({ type: LDG_GETWALLETCREATIONMASTERPUBKEY_SUCCESS });
      return hdpk;
    } catch (error) {
      dispatch({ error, type: LDG_GETWALLETCREATIONMASTERPUBKEY_FAILED });
      throw error;
    }
  };

function doWithTransport(fn) {
  return TransportWebUSB.create()
    .then((transport) => {
      return fn(transport).then((r) =>
        transport
          .close()
          .catch((e) => {
            throw e;
          })
          .then(() => r)
      );
    })
    .catch((e) => {
      const notDecred = "the decred ledger app is not open on the device";
      if (e.statusCode && e.message) {
        switch (e.statusCode) {
          case wrongScreenStatus:
            e.message = notDecred;
            throw e;
          case wrongAppStatus:
            e.message = notDecred;
            throw e;
        }
      }
      throw e;
    });
}

function getAddress(path) {
  const fn = async (transport) => {
    const btc = new Btc({ transport, currency: coin });
    return await btc.getWalletPublicKey(path, {
      verify: false
    });
  };
  return doWithTransport(fn);
}

function getPubKey(isTestnet) {
  const fn = async (transport) => {
    const btc = new Btc({ transport, currency: coin });
    let hdPublicKeyID = 0x02fda926; // dpub
    if (isTestnet) {
      hdPublicKeyID = 0x043587d1; // tpub
    }
    return await btc.getWalletXpub({
      path: "44'/42'/0'",
      xpubVersion: hdPublicKeyID
    });
  };
  return doWithTransport(fn);
}

function createTx(arg) {
  return doWithTransport((transport) => {
    return createTransaction(transport, arg);
  });
}
