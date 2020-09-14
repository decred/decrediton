import { getAccountMixerService } from "wallet";
import Promise from "promise";
import * as sel from "selectors";
import * as wallet from "wallet";
import { getWalletCfg } from "config";
import { getAcctSpendableBalance } from "./ClientActions";
import { MIN_RELAY_FEE_ATOMS } from "constants";

export const GETACCOUNTMIXERSERVICE_ATTEMPT = "GETACCOUNTMIXERSERVICE_ATTEMPT";
export const GETACCOUNTMIXERSERVICE_SUCCESS = "GETACCOUNTMIXERSERVICE_SUCCESS";
export const GETACCOUNTMIXERSERVICE_FAILED = "GETACCOUNTMIXERSERVICE_FAILED";

export const getAccountMixerServiceAttempt = () => (dispatch, getState) => {
  const {
    grpc: { address, port }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();
  dispatch({ type: GETACCOUNTMIXERSERVICE_ATTEMPT });
  return getAccountMixerService(
    sel.isTestNet(getState()),
    walletName,
    address,
    port
  )
    .then((accountMixerService) =>
      dispatch({ accountMixerService, type: GETACCOUNTMIXERSERVICE_SUCCESS })
    )
    .catch((error) => dispatch({ error, type: GETACCOUNTMIXERSERVICE_FAILED }));
};

export const RUNACCOUNTMIXER_ATTEMPT = "RUNACCOUNTMIXER_ATTEMPT";
export const RUNACCOUNTMIXER_FAILED = "RUNACCOUNTMIXER_FAILED";
export const RUNACCOUNTMIXER_SUCCESS = "RUNACCOUNTMIXER_SUCCESS";

export const runAccountMixer = ({
  passphrase,
  mixedAccount,
  mixedAccountBranch,
  changeAccount,
  csppServer
}) => (dispatch, getState) =>
    new Promise((resolve) => {
      dispatch({ type: RUNACCOUNTMIXER_ATTEMPT });
      const runMixerAsync = async () => {
        // no start mixer if account balance is less than minimum possible fee.
        const spendableBal = await dispatch(getAcctSpendableBalance(changeAccount));
        if (spendableBal < MIN_RELAY_FEE_ATOMS) {
          return { error: "Account Balance Too Small" };
        }
        const mixerStreamer = await wallet
        .runAccountMixerRequest(sel.accountMixerService(getState()), {
          passphrase,
          mixedAccount,
          mixedAccountBranch,
          changeAccount,
          csppServer
        });
        return { mixerStreamer };
      };

      runMixerAsync().then((resp) => {
        const { mixerStreamer, error } = resp;
        // we can throw errors, like when the account has a small balance,
        // so this check is necessary.
        if (error) {
          dispatch({ error: error + "", type: RUNACCOUNTMIXER_FAILED });
          return;
        }
        mixerStreamer.on("data", () => resolve());
        mixerStreamer.on("error", (error) => {
          dispatch({ error: error + "", type: RUNACCOUNTMIXER_FAILED });
        });
        mixerStreamer.on("end", (data) => {
          // not supposed to get here, but if it does, we log to see.
          console.log(data);
        });
        dispatch({ type: RUNACCOUNTMIXER_SUCCESS, mixerStreamer });
      })
      .catch((error) => dispatch({ error: error + "", type: RUNACCOUNTMIXER_FAILED }));
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

export const createNeededAccounts = (
  passphrase,
  mixedAccountName,
  changeAccountName
) => async (dispatch, getState) => {
  dispatch({ type: CREATEMIXERACCOUNTS_ATTEMPT });

  const walletService = sel.walletService(getState());

  const createAccount = (pass, name) =>
    wallet.getNextAccount(walletService, pass, name);

  try {
    const mixedAccount = await createAccount(passphrase, mixedAccountName);
    const changeAccount = await createAccount(passphrase, changeAccountName);

    const mixedNumber = mixedAccount.getAccountNumber();
    const changeNumber = changeAccount.getAccountNumber();

    dispatch(setCoinjoinCfg(
      mixedNumber,
      changeNumber
    ));
  } catch (error) {
    dispatch({ type: CREATEMIXERACCOUNTS_FAILED, error });
  }
};

export const setCoinjoinCfg = ({ mixedNumber, changeNumber }) =>
  (dispatch, getState) => {
    const isTestnet = sel.isTestNet(getState());
    const walletName = sel.getWalletName(getState());
    const cfg = getWalletCfg(isTestnet, walletName);

    // TODO use constants here
    // On this first moment we are hard coding the cspp decred's server.
    // the idea is to allow more server on upcoming releases, but we decided
    // to go with this approach on this first integration.
    const csppServer = "cspp.decred.org";
    const csppPort = isTestnet ? "15760" : "5760";

    cfg.set("csppserver", csppServer);
    cfg.set("csppport", csppPort);
    cfg.set("mixedaccount", mixedNumber);
    cfg.set("changeaccount", changeNumber);
    cfg.set("mixedaccbranch", 0);

    dispatch({
      type: CREATEMIXERACCOUNTS_SUCCESS,
      mixedAccount: mixedNumber,
      changeAccount: changeNumber,
      csppPort,
      csppServer,
      mixedAccountBranch: 0
    });
};

// getCoinjoinOutputspByAcct get all possible coinjoin outputs which an account
// may have. This is used so we can recover privacy wallets and don't miss
// spend outputs. It returns all accounts, so the user also can choose the
// change account.
export const getCoinjoinOutputspByAcct = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const { balances, walletService } = getState().grpc;

    wallet
      .getCoinjoinOutputspByAcct(walletService)
      .then((response) => {
        const coinjoinSumByAcctResp = response.wrappers_[1];
        const coinjoinSumByAcct = balances.reduce((allAccts, { accountNumber }) => {
          // if account number is equals imported account, we ignore it.
          if (accountNumber === Math.pow(2, 31) - 1) {
            return allAccts;
          }
          const coinjoinAcct = coinjoinSumByAcctResp.find((a) => a.getAccountNumber() === accountNumber);
          if (coinjoinAcct === undefined) {
            allAccts.push({
              acctIdx: accountNumber,
              coinjoinSum: 0
            });
          } else {
            allAccts.push({
              acctIdx: accountNumber,
              coinjoinSum: coinjoinAcct.getCoinjoinTxsSum()
            });
          }
          return allAccts;
        }, []);

        resolve(coinjoinSumByAcct);
      })
      .catch((error) =>
        reject(error)
      );
  });
