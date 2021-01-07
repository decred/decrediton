// @flow
import * as wallet from "wallet";
import { onAppReloadRequested, getDcrwalletGrpcKeyCert } from "wallet";
import * as sel from "selectors";
import eq from "lodash/fp/eq";
import isUndefined from "lodash/fp/isUndefined";
import {
  getNextAddressAttempt,
  getPeerInfo,
  publishUnminedTransactionsAttempt
} from "./ControlActions";
import {
  transactionNtfnsStart,
  accountNtfnsStart
} from "./NotificationActions";
import {
  refreshStakepoolPurchaseInformation,
  setStakePoolVoteChoices,
  getStakepoolStats,
  getVSPTicketsByFeeStatus
} from "./VSPActions";
import { getStartupTransactions } from "./TransactionActions";
import { getAccountMixerServiceAttempt } from "./AccountMixerActions";
import { checkLnWallet } from "./LNActions";
import { push as pushHistory, goBack } from "connected-react-router";
import { getWalletCfg, getGlobalCfg } from "config";
import { clipboard } from "electron";
import { getStartupStats } from "./StatisticsActions";
import { getTokenAndInitialBatch } from "./GovernanceActions";
import { discoverAvailableVSPs } from "./VSPActions";
import * as da from "../middleware/dcrdataapi";
import {
  EXTERNALREQUEST_DCRDATA,
  EXTERNALREQUEST_POLITEIA
} from "main_dev/externalRequests";
import {
  TESTNET,
  MAINNET,
  VSP_FEE_PROCESS_ERRORED,
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID
} from "constants";
import * as cfgConstants from "constants/config";

export const goToTransactionHistory = () => (dispatch) => {
  dispatch(pushHistory("/transactions/history"));
};

export const goToMyTickets = () => (dispatch) => {
  dispatch(pushHistory("/tickets/mytickets"));
};

export const goToError = () => (dispatch) => {
  dispatch(pushHistory("/error"));
};

export const GETWALLETSERVICE_ATTEMPT = "GETWALLETSERVICE_ATTEMPT";
export const GETWALLETSERVICE_FAILED = "GETWALLETSERVICE_FAILED";
export const GETWALLETSERVICE_SUCCESS = "GETWALLETSERVICE_SUCCESS";

export const STARTWALLETSERVICE_ATTEMPT = "STARTWALLETSERVICE_ATTEMPT";
export const STARTWALLETSERVICE_FAILED = "STARTWALLETSERVICE_FAILED";
export const STARTWALLETSERVICE_SUCCESS = "STARTWALLETSERVICE_SUCCESS";

const startWalletServicesTrigger = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const startServicesAsync = async () => {
      const { spvSynced, privacyEnabled } = getState().walletLoader;
      if (!spvSynced) {
        dispatch(getTicketBuyerServiceAttempt());
      }
      if (privacyEnabled) {
        dispatch(getAccountMixerServiceAttempt());
      }
      dispatch(discoverAvailableVSPs());
      await dispatch(getNextAddressAttempt(0));
      await dispatch(getPeerInfo());
      await dispatch(getTicketPriceAttempt());
      await dispatch(getNetworkAttempt());
      await dispatch(refreshStakepoolPurchaseInformation());
      await dispatch(getVotingServiceAttempt());
      await dispatch(getAgendaServiceAttempt());
      await dispatch(getStakepoolStats());
      await dispatch(getStartupWalletInfo());
      await dispatch(transactionNtfnsStart());
      await dispatch(accountNtfnsStart());

      // get vsp tickets fee status errored so we can resync them
      await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_ERRORED));
      await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_STARTED));
      await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_PAID));
    };

    startServicesAsync()
      .then(() => resolve())
      .catch((error) => reject(error));
  });

// TODO move startWalletServices to WalletLoaderActions, as it is not related
// to ClientActions.
export const startWalletServices = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const { startWalletServiceAttempt } = getState().grpc;
    if (startWalletServiceAttempt) {
      return;
    }
    dispatch({ type: STARTWALLETSERVICE_ATTEMPT });
    dispatch(startWalletServicesTrigger())
      .then(() => {
        dispatch({ type: STARTWALLETSERVICE_SUCCESS });
        resolve();
      })
      .catch((error) => {
        dispatch({ type: STARTWALLETSERVICE_FAILED, error });
        reject({ error });
      });
  });

export const GETSTARTUPWALLETINFO_ATTEMPT = "GETSTARTUPWALLETINFO_ATTEMPT";
export const GETSTARTUPWALLETINFO_SUCCESS = "GETSTARTUPWALLETINFO_SUCCESS";
export const GETSTARTUPWALLETINFO_FAILED = "GETSTARTUPWALLETINFO_FAILED";

export const getStartupWalletInfo = () => (dispatch) => {
  dispatch({ type: GETSTARTUPWALLETINFO_ATTEMPT });
  const config = getGlobalCfg();
  const dcrdataEnabled =
    config.get("allowed_external_requests").indexOf(EXTERNALREQUEST_DCRDATA) >
    -1;
  const politeiaEnabled =
    config.get("allowed_external_requests").indexOf(EXTERNALREQUEST_POLITEIA) >
    -1;

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        await dispatch(getStakeInfoAttempt());
        await dispatch(getAccountsAttempt(true));
        await dispatch(getStartupTransactions());
        await dispatch(getStartupStats());
        await dispatch(publishUnminedTransactionsAttempt());
        if (dcrdataEnabled) {
          dispatch(getTreasuryBalance());
          dispatch(getAllAgendasAttempt());
        }
        if (politeiaEnabled) {
          dispatch(getTokenAndInitialBatch());
        }
        dispatch(checkLnWallet());
        dispatch({ type: GETSTARTUPWALLETINFO_SUCCESS });
        resolve();
      } catch (error) {
        dispatch({ error, type: GETSTARTUPWALLETINFO_FAILED });
        reject(error);
      }
    }, 1000);
  });
};

export const getWalletServiceAttempt = () => (dispatch, getState) => {
  const {
    grpc: { address, port }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();
  dispatch({ type: GETWALLETSERVICE_ATTEMPT });
  const grpcCertAndKey = getDcrwalletGrpcKeyCert();
  wallet
    .getWalletService(
      sel.isTestNet(getState()),
      walletName,
      address,
      port,
      grpcCertAndKey,
      grpcCertAndKey
    )
    .then((walletService) =>
      dispatch({ walletService, type: GETWALLETSERVICE_SUCCESS })
    )
    .catch((error) => dispatch({ error, type: GETWALLETSERVICE_FAILED }));
};

export const GETTICKETBUYERSERVICE_ATTEMPT = "GETTICKETBUYERSERVICE_ATTEMPT";
export const GETTICKETBUYERSERVICE_FAILED = "GETTICKETBUYERSERVICE_FAILED";
export const GETTICKETBUYERSERVICE_SUCCESS = "GETTICKETBUYERSERVICE_SUCCESS";

export const getTicketBuyerServiceAttempt = () => (dispatch, getState) => {
  const {
    grpc: { address, port }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();
  dispatch({ type: GETTICKETBUYERSERVICE_ATTEMPT });
  const grpcCertAndKey = getDcrwalletGrpcKeyCert();
  wallet
    .getTicketBuyerService(
      sel.isTestNet(getState()),
      walletName,
      address,
      port,
      grpcCertAndKey,
      grpcCertAndKey
    )
    .then((ticketBuyerService) => {
      dispatch({ ticketBuyerService, type: GETTICKETBUYERSERVICE_SUCCESS });
    })
    .catch((error) => dispatch({ error, type: GETTICKETBUYERSERVICE_FAILED }));
};

export const getAccountNumbersBalances = (accountNumbers) => (dispatch) => {
  accountNumbers.forEach((a) => dispatch(getBalanceUpdateAttempt(a, 0)));
};

const getAccountsBalances = (accounts) => (dispatch, getState) => {
  const walletService = sel.walletService(getState());
  const chainParams = sel.chainParams(getState());
  const hiddenAccounts = sel.hiddenAccounts(getState());

  const promises = accounts.map(async (account) => {
    const resp = await wallet.getBalance(
      walletService,
      account.getAccountNumber(),
      0
    );
    return {
      accountNumber: account.getAccountNumber(),
      accountName: account.getAccountName(),
      externalKeys: account.getExternalKeyCount(),
      internalKeys: account.getInternalKeyCount(),
      importedKeys: account.getImportedKeyCount(),
      hidden: !!hiddenAccounts.find(eq(account.getAccountNumber())),
      HDPath:
        "m / 44' / " +
        chainParams.HDCoinType +
        "' / " +
        account.getAccountNumber() +
        "'",
      total: resp.getTotal(),
      spendable: resp.getSpendable(),
      immatureReward: resp.getImmatureReward(),
      immatureStakeGeneration: resp.getImmatureStakeGeneration(),
      lockedByTickets: resp.getLockedByTickets(),
      votingAuthority: resp.getVotingAuthority()
    };
  });

  return Promise.all(promises)
    .then((balances) => dispatch({ balances, type: GETBALANCE_SUCCESS }))
    .catch((error) => dispatch({ error, type: GETBALANCE_FAILED }));
};

export const GETBALANCE_ATTEMPT = "GETBALANCE_ATTEMPT";
export const GETBALANCE_FAILED = "GETBALANCE_FAILED";
export const GETBALANCE_SUCCESS = "GETBALANCE_SUCCESS";

const getBalanceUpdateSuccess = (accountNumber, getBalanceResponse) => (
  dispatch
) => {
  const updatedBalance = {
    accountNumber,
    total: getBalanceResponse.getTotal(),
    spendable: getBalanceResponse.getSpendable(),
    immatureReward: getBalanceResponse.getImmatureReward(),
    immatureStakeGeneration: getBalanceResponse.getImmatureStakeGeneration(),
    lockedByTickets: getBalanceResponse.getLockedByTickets(),
    votingAuthority: getBalanceResponse.getVotingAuthority()
  };

  dispatch(updateAccount(updatedBalance));

  return updatedBalance;
};

export const getBalanceUpdateAttempt = (accountNumber, requiredConfs) => (
  dispatch,
  getState
) =>
  wallet
    .getBalance(sel.walletService(getState()), accountNumber, requiredConfs)
    .then((resp) => dispatch(getBalanceUpdateSuccess(accountNumber, resp)))
    .catch((error) => dispatch({ error, type: GETBALANCE_FAILED }));

export const GETACCOUNTNUMBER_ATTEMPT = "GETACCOUNTNUMBER_ATTEMPT";
export const GETACCOUNTNUMBER_FAILED = "GETACCOUNTNUMBER_FAILED";
export const GETACCOUNTNUMBER_SUCCESS = "GETACCOUNTNUMBER_SUCCESS";

export const getAccountNumberAttempt = (accountName) => (
  dispatch,
  getState
) => {
  dispatch({ type: GETACCOUNTNUMBER_ATTEMPT });
  wallet
    .getAccountNumber(sel.walletService(getState()), accountName)
    .then((resp) =>
      dispatch({
        getAccountNumberResponse: resp,
        type: GETACCOUNTNUMBER_SUCCESS
      })
    )
    .catch((error) => dispatch({ error, type: GETACCOUNTNUMBER_FAILED }));
};

export const GETBESTBLOCK_ATTEMPT = "GETBESTBLOCK_ATTEMPT";
export const GETBESTBLOCK_FAILED = "GETBESTBLOCK_FAILED";
export const GETBESTBLOCK_SUCCESS = "GETBESTBLOCK_SUCCESS";

export const getBestBlockHeightAttempt = (cb) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch({ type: GETBESTBLOCK_ATTEMPT });
    wallet
      .bestBlock(sel.walletService(getState()))
      .then(async (resp) => {
        dispatch({ height: resp.getHeight(), type: GETBESTBLOCK_SUCCESS });
        if (cb) {
          await dispatch(cb());
          return resolve();
        }
        return resolve();
      })
      .catch((error) => {
        dispatch({ error, type: GETBESTBLOCK_FAILED });
        reject({ error });
        throw error;
      });
  });

export const GETNETWORK_ATTEMPT = "GETNETWORK_ATTEMPT";
export const GETNETWORK_FAILED = "GETNETWORK_FAILED";
export const GETNETWORK_SUCCESS = "GETNETWORK_SUCCESS";

function getNetworkSuccess(getNetworkResponse) {
  return (dispatch, getState) => {
    const { testnet, mainnet } = getState().grpc;
    const { currentSettings } = getState().settings;
    const network = currentSettings.network;
    const currentNetwork = getNetworkResponse.getActiveNetwork();
    // XXX remove network magic numbers here
    let networkStr = "";
    if (
      (currentNetwork == testnet && network == TESTNET) ||
      (currentNetwork == mainnet && network == MAINNET)
    ) {
      networkStr = network;
      getNetworkResponse.networkStr = networkStr;
      dispatch({
        getNetworkResponse: getNetworkResponse,
        type: GETNETWORK_SUCCESS
      });
    } else {
      dispatch({ error: "Invalid network detected", type: GETNETWORK_FAILED });
      setTimeout(() => {
        dispatch(pushHistory("/walletError"));
      }, 1000);
    }
  };
}

export const getNetworkAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETNETWORK_ATTEMPT });
  wallet
    .getNetwork(sel.walletService(getState()))
    .then((resp) => dispatch(getNetworkSuccess(resp)))
    .catch((error) => {
      dispatch({ error, type: GETNETWORK_FAILED });
      setTimeout(() => {
        dispatch(pushHistory("/walletError"));
      }, 1000);
    });
};

export const GETSTAKEINFO_ATTEMPT = "GETSTAKEINFO_ATTEMPT";
export const GETSTAKEINFO_FAILED = "GETSTAKEINFO_FAILED";
export const GETSTAKEINFO_SUCCESS = "GETSTAKEINFO_SUCCESS";

export const getStakeInfoAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETSTAKEINFO_ATTEMPT });
  wallet
    .getStakeInfo(sel.walletService(getState()))
    .then((resp) =>
      dispatch({ getStakeInfoResponse: resp, type: GETSTAKEINFO_SUCCESS })
    )
    .catch((error) => dispatch({ error, type: GETSTAKEINFO_FAILED }));
};

export const GETTICKETPRICE_ATTEMPT = "GETTICKETPRICE_ATTEMPT";
export const GETTICKETPRICE_FAILED = "GETTICKETPRICE_FAILED";
export const GETTICKETPRICE_SUCCESS = "GETTICKETPRICE_SUCCESS";

export const getTicketPriceAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETTICKETPRICE_ATTEMPT });
  wallet
    .getTicketPrice(sel.walletService(getState()))
    .then((res) =>
      dispatch({ getTicketPriceResponse: res, type: GETTICKETPRICE_SUCCESS })
    )
    .catch((error) => dispatch({ error, type: GETTICKETPRICE_FAILED }));
};

export const GETACCOUNTS_ATTEMPT = "GETACCOUNTS_ATTEMPT";
export const GETACCOUNTS_FAILED = "GETACCOUNTS_FAILED";
export const GETACCOUNTS_SUCCESS = "GETACCOUNTS_SUCCESS";

export const getAccountsAttempt = (startup) => async (dispatch, getState) => {
  dispatch({ type: GETACCOUNTS_ATTEMPT });
  try {
    const response = await wallet.getAccounts(sel.walletService(getState()));
    if (startup)
      await dispatch(getAccountsBalances(response.getAccountsList()));
    dispatch({
      accounts: response.getAccountsList(),
      response,
      type: GETACCOUNTS_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: GETACCOUNTS_FAILED });
  }
};

export const UPDATEHIDDENACCOUNTS = "UPDATEHIDDENACCOUNTS";
export const UPDATEACCOUNT_SUCCESS = "UPDATEACCOUNT_SUCCESS";

export function updateAccount(account) {
  return (dispatch, getState) => {
    const {
      grpc: { balances }
    } = getState();
    const existingAccount = balances.find(
      (a) => a.accountNumber === account.accountNumber
    );
    let updatedBalances;
    if (!existingAccount) {
      const chainParams = sel.chainParams(getState());
      const newAccount = {
        immatureReward: 0,
        immatureStakeGeneration: 0,
        lockedByTickets: 0,
        spendable: 0,
        total: 0,
        votingAuthority: 0,
        HDPath:
          "m / 44' / " +
          chainParams.HDCoinType +
          "' / " +
          account.accountNumber +
          "'",
        ...account
      };
      updatedBalances = [...balances, newAccount];
    } else {
      const updatedAccount = { ...existingAccount, ...account };
      updatedBalances = balances.map((a) =>
        a.accountNumber === account.accountNumber ? updatedAccount : a
      );
    }

    dispatch({ balances: updatedBalances, type: GETBALANCE_SUCCESS });
  };
}

export function hideAccount(accountNumber) {
  return (dispatch, getState) => {
    const {
      daemon: { walletName, hiddenAccounts }
    } = getState();
    const updatedHiddenAccounts = [...hiddenAccounts];
    if (updatedHiddenAccounts.indexOf(accountNumber) === -1) {
      updatedHiddenAccounts.push(accountNumber);
    }
    const cfg = getWalletCfg(sel.isTestNet(getState()), walletName);
    cfg.set(cfgConstants.HIDDEN_ACCOUNTS, updatedHiddenAccounts);
    dispatch({
      hiddenAccounts: updatedHiddenAccounts,
      type: UPDATEHIDDENACCOUNTS
    });
    dispatch(updateAccount({ accountNumber, hidden: true }));
  };
}

export function showAccount(accountNumber) {
  return (dispatch, getState) => {
    const {
      daemon: { walletName, hiddenAccounts }
    } = getState();
    const updatedHiddenAccounts = Array();
    for (let i = 0; i < hiddenAccounts.length; i++) {
      if (hiddenAccounts[i] !== accountNumber) {
        updatedHiddenAccounts.push(hiddenAccounts[i]);
      }
    }
    const cfg = getWalletCfg(sel.isTestNet(getState()), walletName);
    cfg.set(cfgConstants.HIDDEN_ACCOUNTS, updatedHiddenAccounts);
    dispatch({
      hiddenAccounts: updatedHiddenAccounts,
      type: UPDATEHIDDENACCOUNTS
    });
    dispatch(updateAccount({ accountNumber, hidden: false }));
  };
}

export const UPDATETIMESINCEBLOCK = "UPDATETIMESINCEBLOCK";
export function updateBlockTimeSince() {
  return (dispatch, getState) => {
    const { transactionNtfnsResponse } = getState().notifications;
    const { recentBlockTimestamp } = getState().grpc;
    if (
      transactionNtfnsResponse !== null &&
      transactionNtfnsResponse.getAttachedBlocksList().length > 0
    ) {
      const attachedBlocks = transactionNtfnsResponse.getAttachedBlocksList();
      const lastBlockTimestamp = attachedBlocks[0].getTimestamp();
      if (recentBlockTimestamp != lastBlockTimestamp) {
        dispatch({
          recentBlockTimestamp: lastBlockTimestamp,
          type: UPDATETIMESINCEBLOCK
        });
      }
    }
  };
}

export const GETAGENDASERVICE_ATTEMPT = "GETAGENDASERVICE_ATTEMPT";
export const GETAGENDASERVICE_FAILED = "GETAGENDASERVICE_FAILED";
export const GETAGENDASERVICE_SUCCESS = "GETAGENDASERVICE_SUCCESS";

export const getAgendaServiceAttempt = () => (dispatch, getState) => {
  const {
    grpc: { address, port }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();
  dispatch({ type: GETAGENDASERVICE_ATTEMPT });
  const grpcCertAndKey = getDcrwalletGrpcKeyCert();
  wallet
    .getAgendaService(
      sel.isTestNet(getState()),
      walletName,
      address,
      port,
      grpcCertAndKey,
      grpcCertAndKey
    )
    .then((agendaService) => {
      dispatch({ agendaService, type: GETAGENDASERVICE_SUCCESS });
      setTimeout(() => {
        dispatch(getAgendasAttempt());
      }, 10);
    })
    .catch((error) => dispatch({ error, type: GETAGENDASERVICE_FAILED }));
};

export const GETVOTINGSERVICE_ATTEMPT = "GETVOTINGSERVICE_ATTEMPT";
export const GETVOTINGSERVICE_FAILED = "GETVOTINGSERVICE_FAILED";
export const GETVOTINGSERVICE_SUCCESS = "GETVOTINGSERVICE_SUCCESS";

export const getVotingServiceAttempt = () => (dispatch, getState) => {
  const {
    grpc: { address, port }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();
  dispatch({ type: GETVOTINGSERVICE_ATTEMPT });
  const grpcCertAndKey = getDcrwalletGrpcKeyCert();
  wallet
    .getVotingService(
      sel.isTestNet(getState()),
      walletName,
      address,
      port,
      grpcCertAndKey,
      grpcCertAndKey
    )
    .then((votingService) =>
      dispatch({ votingService, type: GETVOTINGSERVICE_SUCCESS })
    )
    .catch((error) => dispatch({ error, type: GETVOTINGSERVICE_FAILED }));
};

export const GETAGENDAS_ATTEMPT = "GETAGENDAS_ATTEMPT";
export const GETAGENDAS_FAILED = "GETAGENDAS_FAILED";
export const GETAGENDAS_SUCCESS = "GETAGENDAS_SUCCESS";

// getAgendasAttempt gets the current agenda.
export const getAgendasAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETAGENDAS_ATTEMPT });
  wallet
    .getAgendas(sel.agendaService(getState()))
    .then((agendas) => dispatch({ agendas, type: GETAGENDAS_SUCCESS }))
    .catch((error) => dispatch({ error, type: GETAGENDAS_FAILED }));
};

export const GETALLAGENDAS_ATTEMPT = "GETALLAGENDAS_ATTEMPT";
export const GETALLAGENDAS_FAILED = "GETALLAGENDAS_FAILED";
export const GETALLAGENDAS_SUCCESS = "GETALLAGENDAS_SUCCESS";

// getAllAgendasAttempt gets all agendas.
export const getAllAgendasAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETALLAGENDAS_ATTEMPT });
  const dURL = sel.dcrdataURL(getState());
  da.getAdendasInfo(dURL)
    .then((response) => {
      const { data } = response;
      dispatch({ allAgendas: data, type: GETALLAGENDAS_SUCCESS });
    })
    .catch((error) => dispatch({ error, type: GETALLAGENDAS_FAILED }));
};

export const GETVOTECHOICES_ATTEMPT = "GETVOTECHOICES_ATTEMPT";
export const GETVOTECHOICES_FAILED = "GETVOTECHOICES_FAILED";
export const GETVOTECHOICES_SUCCESS = "GETVOTECHOICES_SUCCESS";

export const getVoteChoicesAttempt = (stakePool) => (dispatch, getState) => {
  dispatch({ type: GETVOTECHOICES_ATTEMPT });
  wallet
    .getVoteChoices(sel.votingService(getState()))
    .then((voteChoices) => {
      dispatch({ voteChoices, type: GETVOTECHOICES_SUCCESS });
      dispatch(setStakePoolVoteChoices(stakePool, voteChoices));
    })
    .catch((error) => dispatch({ error, type: GETVOTECHOICES_FAILED }));
};

export const SETVOTECHOICES_ATTEMPT = "SETVOTECHOICES_ATTEMPT";
export const SETVOTECHOICES_FAILED = "SETVOTECHOICES_FAILED";
export const SETVOTECHOICES_SUCCESS = "SETVOTECHOICES_SUCCESS";

export const setVoteChoicesAttempt = (agendaId, choiceId) => (
  dispatch,
  getState
) => {
  dispatch({ payload: { agendaId, choiceId }, type: SETVOTECHOICES_ATTEMPT });
  const stakePools = sel.configuredStakePools(getState());
  wallet
    .setAgendaVote(sel.votingService(getState()), agendaId, choiceId)
    .then((response) => {
      dispatch({ response, type: SETVOTECHOICES_SUCCESS });
      for (let i = 0; i < stakePools.length; i++) {
        dispatch(getVoteChoicesAttempt(stakePools[i]));
      }
    })
    .catch((error) => dispatch({ error, type: SETVOTECHOICES_FAILED }));
};

export const GETMESSAGEVERIFICATIONSERVICE_ATTEMPT =
  "GETMESSAGEVERIFICATIONSERVICE_ATTEMPT";
export const GETMESSAGEVERIFICATIONSERVICE_FAILED =
  "GETMESSAGEVERIFICATIONSERVICE_FAILED";
export const GETMESSAGEVERIFICATIONSERVICE_SUCCESS =
  "GETMESSAGEVERIFICATIONSERVICE_SUCCESS";

export const getMessageVerificationServiceAttempt = (dispatch, getState) => {
  const {
    grpc: { address, port }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();
  const grpcCertAndKey = getDcrwalletGrpcKeyCert();
  dispatch({ type: GETMESSAGEVERIFICATIONSERVICE_ATTEMPT });
  wallet
    .getMessageVerificationService(
      sel.isTestNet(getState()),
      walletName,
      address,
      port,
      grpcCertAndKey,
      grpcCertAndKey
    )
    .then((messageVerificationService) =>
      dispatch({
        messageVerificationService,
        type: GETMESSAGEVERIFICATIONSERVICE_SUCCESS
      })
    )
    .catch((error) =>
      dispatch({ error, type: GETMESSAGEVERIFICATIONSERVICE_FAILED })
    );
};

export const listenForAppReloadRequest = (cb) => () => onAppReloadRequested(cb);

export const showTicketList = (status) => (dispatch) =>
  dispatch(pushHistory("/tickets/mytickets/" + status));

export const showPurchaseTicketsPage = () => (dispatch) =>
  dispatch(pushHistory("/tickets/purchase"));

export const showListUtxo = () => (dispatch) =>
  dispatch(pushHistory("/listUtxo"));

export const goBackHistory = () => (dispatch) => dispatch(goBack());

export const SEEDCOPIEDTOCLIPBOARD = "SEEDCOPIEDTOCLIPBOARD";
export const copySeedToClipboard = (mnemonic) => (dispatch) => {
  clipboard.clear();
  clipboard.writeText(mnemonic);
  dispatch({ type: SEEDCOPIEDTOCLIPBOARD });
};

export const GETTREASURY_BALANCE_SUCCESS = "GETTREASURY_BALANCE_SUCCESS";
export const getTreasuryBalance = () => (dispatch, getState) => {
  const treasuryAddress = sel.chainParams(getState()).TreasuryAddress;
  const dURL = sel.dcrdataURL(getState());
  da.getTreasuryInfo(dURL, treasuryAddress).then((treasuryInfo) => {
    // Manually convert DCR to atom amounts to avoid floating point multiplication errors (eg. 589926.57667882*1e8 => 58992657667881.99)
    const unspentTreasury = treasuryInfo["data"]["dcr_unspent"];
    if (!unspentTreasury) return;
    const splitedTreasuryInfo = unspentTreasury.toString().split(".");
    const integerPart = splitedTreasuryInfo[0];
    // dcrdata can send numbers with its decimal part less than 8 decimals, so we manually add it.
    let decimalPart = splitedTreasuryInfo[1];
    decimalPart += "0".repeat(8 - decimalPart.length);
    const treasuryBalance = integerPart + decimalPart;
    dispatch({ treasuryBalance, type: GETTREASURY_BALANCE_SUCCESS });
  });
};

export const RESET_TREASURY_BALANCE = "RESET_TREASURY_BALANCE";
export const resetTreasuryBalance = () => (dispatch) => {
  dispatch({ type: RESET_TREASURY_BALANCE });
};

export const ABANDONTRANSACTION_ATTEMPT = "ABANDONTRANSACTION_ATTEMPT";
export const ABANDONTRANSACTION_SUCCESS = "ABANDONTRANSACTION_SUCCESS";
export const ABANDONTRANSACTION_FAILED = "ABANDONTRANSACTION_FAILED";

export const abandonTransactionAttempt = (txid) => (dispatch, getState) => {
  dispatch({ type: ABANDONTRANSACTION_ATTEMPT });
  const state = getState();
  wallet
    .abandonTransaction(sel.walletService(state), txid)
    .then(() => {
      const { regularTransactions, recentRegularTransactions } = state.grpc;
      // remove from transactions
      delete regularTransactions[txid];
      const newRecentRegularTransactions = recentRegularTransactions.filter(
        (t) => t.txHash !== txid
      );
      dispatch({
        type: ABANDONTRANSACTION_SUCCESS,
        regularTransactions,
        recentRegularTransactions: newRecentRegularTransactions
      });
      dispatch(goBack());
    })
    .catch((error) => dispatch({ error, type: ABANDONTRANSACTION_FAILED }));
};

export const getAcctSpendableBalance = (acctId) => async (
  dispatch,
  getState
) => {
  const acct = await wallet.getBalance(
    sel.walletService(getState()),
    acctId,
    0
  );
  return acct.getSpendable();
};

export const MIXERACCOUNTS_SPENDABLE_BALANCE =
  "MIXERACCOUNTS_SPENDABLE_BALANCE";
export const getMixerAcctsSpendableBalances = () => async (
  dispatch,
  getState
) => {
  const mixedAccount = sel.getMixedAccount(getState());
  const changeAccount = sel.getChangeAccount(getState());
  const balances = {};
  if (!isUndefined(mixedAccount)) {
    balances.mixedAccountSpendableBalance = await dispatch(
      getAcctSpendableBalance(mixedAccount)
    );
  }
  if (!isUndefined(changeAccount)) {
    balances.changeAccountSpendableBalance = await dispatch(
      getAcctSpendableBalance(changeAccount)
    );
  }
  dispatch({
    balances,
    type: MIXERACCOUNTS_SPENDABLE_BALANCE
  });
};

export const goToHomePage = () => (dispatch) => dispatch(pushHistory("/home"));
