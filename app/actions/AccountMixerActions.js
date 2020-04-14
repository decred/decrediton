import { getAccountMixerService } from "wallet";
import Promise from "promise";
import * as sel from "selectors";
import * as wallet from "wallet";
import { getWalletCfg } from "config";
import { getNextAccountAttempt } from "./ControlActions";

export const GETACCOUNTMIXERSERVICE_ATTEMPT = "GETACCOUNTMIXERSERVICE_ATTEMPT";
export const GETACCOUNTMIXERSERVICE_SUCCESS = "GETACCOUNTMIXERSERVICE_SUCCESS";
export const GETACCOUNTMIXERSERVICE_FAILED = "GETACCOUNTMIXERSERVICE_FAILED";

export const getAccountMixerServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: GETACCOUNTMIXERSERVICE_ATTEMPT });
  return getAccountMixerService(sel.isTestNet(getState()), walletName, address, port)
    .then(accountMixerService =>
      dispatch({ accountMixerService, type: GETACCOUNTMIXERSERVICE_SUCCESS }))
    .catch(error => dispatch({ error, type: GETACCOUNTMIXERSERVICE_FAILED }));
};

export const RUNACCOUNTMIXER_ATTEMPT = "RUNACCOUNTMIXER_ATTEMPT";
export const RUNACCOUNTMIXER_FAILED = "RUNACCOUNTMIXER_FAILED";
export const RUNACCOUNTMIXER_SUCCESS = "RUNACCOUNTMIXER_SUCCESS";

export const runAccountMixer = ({
  passphrase, mixedAccount, mixedAccountBranch, changeAccount, csppServer
}) => (dispatch, getState) => new Promise((resolve, reject) => {
  dispatch({ type: RUNACCOUNTMIXER_ATTEMPT });
  wallet.runAccountMixerRequest(sel.accountMixerService(getState()), {
    passphrase, mixedAccount, mixedAccountBranch, changeAccount, csppServer })
    .then(mixerStreamer => {
      mixerStreamer.on("data", () => resolve());
      mixerStreamer.on("error", error => reject(error + ""));
      mixerStreamer.on("end", data => {
        console.log(data);
      });
      dispatch({ type: RUNACCOUNTMIXER_SUCCESS, mixerStreamer });
    })
    .catch(error => dispatch({ error, type: RUNACCOUNTMIXER_FAILED }));
});

export const STOPMIXER_ATTEMPT = "STOPMIXER_ATTEMPT";
export const STOPMIXER_FAILED = "STOPMIXER_FAILED";
export const STOPMIXER_SUCCESS = "STOPMIXER_SUCCESS";

export const stopAccountMixer = () => {
  return (dispatch, getState) => {
    const { mixerStreamer } = getState().grpc;
    if (!mixerStreamer) return;
    dispatch({ type: STOPMIXER_ATTEMPT });
    try {
      mixerStreamer.cancel();
      dispatch({ type: STOPMIXER_SUCCESS });
    } catch (error) {
      dispatch({ type: STOPMIXER_FAILED, error });
    }
  };
};

export const CREATEMIXERACCOUNTS_ATTEMPT = "CREATEMIXERACCOUNTS_ATTEMPT";
export const CREATEMIXERACCOUNTS_FAILED = "CREATEMIXERACCOUNTS_FAILED";
export const CREATEMIXERACCOUNTS_SUCCESS = "CREATEMIXERACCOUNTS_SUCCESS";

export const createNeededAccounts = (passphrase, mixingAccountName, changeAccountName) => (dispatch, getState) => {
  try {
    dispatch(getNextAccountAttempt(passphrase, mixingAccountName));
    dispatch(getNextAccountAttempt(passphrase, changeAccountName));
  } catch (error) {
    dispatch({ type: CREATEMIXERACCOUNTS_FAILED, error });
  }
}

// firstSettingMixer is responsible for first setting the mixer configuration.
export const firstSettingMixer = (mixingAccount, changeAccount) => (dispatch, getState) => {
  const isTestnet = sel.isTestNet(getState());
  // TODO use constants here
  // MAINNET DOOR?
  const port = isTestnet ? "15760" : "";
  const server = "cspp.decred.org";
  const walletName = sel.getWalletName(getState);
  const cfg = getWalletCfg(isTestnet, walletName);
  cfg.set("csppserver", server);
  cfg.set("csppport", port);
  cfg.set("mixingacount", mixingAccount);
  cfg.set("changeaccount", changeAccount);
}
