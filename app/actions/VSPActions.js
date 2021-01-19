// @flow
import Promise from "promise";
import { getWalletCfg, updateStakePoolConfig } from "config";
import { importScriptAttempt, rescanAttempt } from "./ControlActions";
import * as sel from "../selectors";
import * as wallet from "wallet";
import { TESTNET, MAINNET, VSP_FEE_PROCESS_ERRORED, VSP_FEE_PROCESS_STARTED, VSP_FEE_PROCESS_PAID } from "constants";
import { USED_VSPS } from "constants/config";
import * as cfgConstants from "constants/config";
import { reverseRawHash } from "../helpers/byteActions";
import shuffle from "lodash/fp/shuffle";

export const GETVSP_ATTEMPT = "GETVSP_ATTEMPT";
export const GETVSP_FAILED = "GETVSP_FAILED";
export const GETVSP_SUCCESS = "GETVSP_SUCCESS";

export const getVSPInfo = (host) => async (dispatch) => {
  dispatch({ type: GETVSP_ATTEMPT });
  try {
    // add https into vsp host, so we can fetch its information.
    host = "https://" + host;
    wallet.allowVSPHost(host);
    const info = await wallet.getVSPInfo(host);
    dispatch({ type: GETVSP_SUCCESS, info });
    return info.data;
  } catch (error) {
    dispatch({ type: GETVSP_FAILED, error });
    return { error };
  }
};

export const GETVSPTICKETSTATUS_ATTEMPT = "GETVSPTICKETSTATUS_ATTEMPT";
export const GETVSPTICKETSTATUS_FAILED = "GETVSPTICKETSTATUS_FAILED";
export const GETVSPTICKETSTATUS_SUCCESS = "GETVSPTICKETSTATUS_SUCCESS";
export const HASVSPTICKETSERRORED = "HASVSPTICKETSERRORED";

export const getVSPTicketsByFeeStatus = (feeStatus) => (dispatch, getState) => new Promise((resolve, reject) => {
  dispatch({ type: GETVSPTICKETSTATUS_ATTEMPT });
  wallet.getVSPTicketsByFeeStatus(getState().grpc.walletService, feeStatus)
    .then(response => {
      const hashesBytes = response.getTicketsHashesList();
      const ticketsHashes = hashesBytes.map(
        (bytesHash) => reverseRawHash(bytesHash)
      );

      // add fee status into our stake transactions map.
      const { stakeTransactions } = getState().grpc;
      ticketsHashes.forEach(ticketHash => {
        const tx = stakeTransactions[ticketHash];
        if (tx) {
          tx.feeStatus = feeStatus;
        }
      });
      // dispatch if we have tickets with error to register.
      if (feeStatus == VSP_FEE_PROCESS_ERRORED && ticketsHashes.length > 0) {
        dispatch({ type: HASVSPTICKETSERRORED, hasVSPTicketsError: true });
      }

      dispatch({ type: GETVSPTICKETSTATUS_SUCCESS, vspTickets: { [feeStatus]: ticketsHashes }, feeStatus, stakeTransactions });

      resolve(ticketsHashes);
    })
    .catch(err => {
      dispatch({ type: GETVSPTICKETSTATUS_FAILED, err });
      reject(err);
    });
});

export const SYNCVSPTICKETS_ATTEMPT = "SYNCVSPTICKETS_ATTEMPT";
export const SYNCVSPTICKETS_FAILED = "SYNCVSPTICKETS_FAILED";
export const SYNCVSPTICKETS_SUCCESS = "SYNCVSPTICKETS_SUCCESS";

export const syncVSPTicketsRequest = ({ passphrase, vspHost, vspPubkey, account }) => (dispatch, getState) => {
  dispatch({ type: SYNCVSPTICKETS_ATTEMPT });
  wallet.syncVSPTickets(getState().grpc.walletService, passphrase, vspHost, vspPubkey, account)
    .then(() => {
      dispatch({ type: SYNCVSPTICKETS_SUCCESS });
      dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_ERRORED));
    })
    .catch(error => {
      dispatch({ type: SYNCVSPTICKETS_FAILED, error });
    });
};


// getTicketSignature receives the tickethash and request and sign it using the
// ticket sstxcommitment address.
export const getTicketSignature = (tickethash, message, passphrase) => async (dispatch, getState) => {
  const walletService = sel.walletService(getState());
  const chainParams = sel.chainParams(getState());

  const sstxAddr = await wallet.getSstxCommitmentAddress(walletService, chainParams, tickethash);
  const resp = await wallet.signMessage(walletService, sstxAddr, message, passphrase);
  return resp.toObject().signature;
};

// TODO After stop supporting v1/v2 vsp's API, remove legacy code.
export const GETSTAKEPOOLSTATS_ATTEMPT = "GETSTAKEPOOLSTATS_ATTEMPT";
export const GETSTAKEPOOLSTATS_FAILED = "GETSTAKEPOOLSTATS_FAILED";
export const GETSTAKEPOOLSTATS_SUCCESS = "GETSTAKEPOOLSTATS_SUCCESS";

export const getStakepoolStats = () => (dispatch) => {
  dispatch({ type: GETSTAKEPOOLSTATS_ATTEMPT });
  wallet
    .getAllStakePoolStats()
    .then(
      (allStakePoolStats) =>
        dispatch({ type: GETSTAKEPOOLSTATS_SUCCESS, allStakePoolStats })
      // TODO: add error notification after global snackbar is merged
    )
    .catch((error) => {
      dispatch({ type: GETSTAKEPOOLSTATS_FAILED, error });
    });
};

export const UPDATESTAKEPOOLCONFIG_ATTEMPT = "UPDATESTAKEPOOLCONFIG_ATTEMPT";
export const UPDATESTAKEPOOLCONFIG_FAILED = "UPDATESTAKEPOOLCONFIG_FAILED";
export const UPDATESTAKEPOOLCONFIG_SUCCESS = "UPDATESTAKEPOOLCONFIG_SUCCESS";

const updateSavedConfig = (newPoolInfo, poolHost, apiKey, accountNum) => (
  dispatch,
  getState
) => {
  const currentStakePoolConfig = sel.currentStakePoolConfig(getState());
  const stakePoolConfigs = currentStakePoolConfig.map((config) =>
    config.Host === poolHost
      ? apiKey || accountNum
        ? { ...config, ...newPoolInfo, ApiKey: apiKey }
        : config.PoolFees !== newPoolInfo.PoolFees
        ? { ...config, PoolFees: newPoolInfo.PoolFees }
        : config
      : config
  );
  if (
    !stakePoolConfigs.find((conf, idx) => conf !== currentStakePoolConfig[idx])
  )
    return;
  const {
    daemon: { walletName }
  } = getState();
  const walletCfg = getWalletCfg(sel.isTestNet(getState()), walletName);
  walletCfg.set(cfgConstants.STAKEPOOLS, stakePoolConfigs);
  return stakePoolConfigs;
};

// setStakePoolAddressAction links the local wallet to a remote stakepool by
// deriving a new address from a given account, then requesting that the
// stakepool create the multisig script.
const setStakePoolAddressAction = (poolHost, apiKey, accountNum) => async (
  dispatch,
  getState
) => {
  const walletService = sel.walletService(getState());
  const { publicKey } = await wallet.getNextAddress(walletService, accountNum);
  wallet.allowStakePoolHost(poolHost);
  const response = await wallet.setStakePoolAddress({
    apiUrl: poolHost,
    apiToken: apiKey,
    pKAddress: publicKey
  });
  if (response.data.status == "success") {
    return response.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED =
  "REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED";

// refreshStakepoolPurchaseInformation is used during wallet startup to grab
// fresh information (eg: latest pool fee) from all configured stakepools.
export const refreshStakepoolPurchaseInformation = () => (dispatch, getState) =>
  Promise.all(
    sel.configuredStakePools(getState()).map(({ Host, ApiKey }) => {
      wallet.allowStakePoolHost(Host);
      wallet
        .getPurchaseInfo({ apiUrl: Host, apiToken: ApiKey })
        .then((response) =>
          response.data.status === "success"
            ? dispatch(updateSavedConfig(response.data.data, Host))
            : null
        )
        .catch((error) =>
          dispatch({
            error,
            host: Host,
            type: REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED
          })
        );
    })
  );

// setStakePoolInformation links a new stakepool to the wallet. This
// will contact the given stakepool, link it with an address from the wallet in
// the given account (if it hasn't already), import the multisig script and
// rescan the wallet for old transactions.
//
// This is meant to be used when setting up a new stakepool.
export const setStakePoolInformation = (
  poolHost,
  apiKey,
  rescan
) => async (dispatch) => {
  let extraErrorData;

  // we currently only support linking to new stakepools from the default
  // account for address discovery reasons.
  const accountNum = 0;

  wallet.allowStakePoolHost(poolHost);
  dispatch({ type: UPDATESTAKEPOOLCONFIG_ATTEMPT });
  try {
    let response = await wallet.getPurchaseInfo({
      apiUrl: poolHost,
      apiToken: apiKey
    });

    if (
      response.data.status == "error" &&
      response.data.message === "purchaseinfo error - no address submitted"
    ) {
      // this error happens when setting up a pool connection for the first
      // time. We need to generate and send a wallet address to the stakepool,
      // so that it will bind it with a stakepool address and create the
      // multisig voting script.
      await dispatch(setStakePoolAddressAction(poolHost, apiKey, accountNum));

      // remake the remote getPurchaseInfo call to get the newly configured
      // script
      // TODO: this should really be returned in the setStakePoolAddress call
      response = await wallet.getPurchaseInfo({
        apiUrl: poolHost,
        apiToken: apiKey
      });
      if (response.data.status !== "success") {
        // there shouldn't be any errors at this stage anymore
        throw new Error(response.data.message);
      }
    } else if (response.data.status != "success") {
      throw new Error(response.data.message);
    }

    // import the script and verify whether the imported address matches what the
    // stakepool has sent us
    const importScriptResponse = await dispatch(
      importScriptAttempt(response.data.data.Script)
    );
    if (
      importScriptResponse.getP2shAddress() !== response.data.data.TicketAddress
    ) {
      extraErrorData = {
        incongruentP2shAddress: true,
        poolP2shAddress: importScriptResponse.getP2shAddress(),
        scriptAddress: response.data.data.TicketAddress
      };
      throw new Error("Incongruent p2sh address returned by stakepool");
    }

    // All set. Update the config, dispatch the success and start a rescan.
    const currentStakePoolConfig = await dispatch(
      updateSavedConfig(response.data.data, poolHost, apiKey, accountNum)
    );
    const selectedStakePool =
      currentStakePoolConfig.filter((p) => p.Host === poolHost)[0] || null;
    dispatch({
      selectedStakePool,
      currentStakePoolConfig,
      type: UPDATESTAKEPOOLCONFIG_SUCCESS
    });
    rescan && dispatch(rescanAttempt(0));
  } catch (error) {
    dispatch({ error, ...extraErrorData, type: UPDATESTAKEPOOLCONFIG_FAILED });
    throw error;
  }
};

export const SETSTAKEPOOLVOTECHOICES_ATTEMPT =
  "SETSTAKEPOOLVOTECHOICES_ATTEMPT";
export const SETSTAKEPOOLVOTECHOICES_FAILED = "SETSTAKEPOOLVOTECHOICES_FAILED";
export const SETSTAKEPOOLVOTECHOICES_SUCCESS =
  "SETSTAKEPOOLVOTECHOICES_SUCCESS";

const updateStakePoolVoteChoicesConfig = (stakePool, voteChoices) => (
  dispatch,
  getState
) => {
  const {
    daemon: { walletName }
  } = getState();
  const config = getWalletCfg(sel.isTestNet(getState()), walletName);
  const voteChoicesConfig = voteChoices.getChoicesList().map((choice) => ({
    agendaId: choice.getAgendaId(),
    choiceId: choice.getChoiceId()
  }));
  const stakePoolConfigs = config.get(cfgConstants.STAKEPOOLS).map((config) =>
    config.Host === stakePool.Host
      ? {
          ...config,
          VoteBits: voteChoices.getVotebits(),
          VoteChoices: voteChoicesConfig
        }
      : config
  );
  const selectedStakePool = sel.selectedStakePool(getState());

  config.set(cfgConstants.STAKEPOOLS, stakePoolConfigs);
  dispatch({
    selectedStakePool,
    currentStakePoolConfig: stakePoolConfigs,
    type: UPDATESTAKEPOOLCONFIG_SUCCESS
  });
};

export const DISMISS_BACKUP_MSG_REDEEM_SCRIPT =
  "DISMISS_BACKUP_MSG_REDEEM_SCRIPT";

export const dismissBackupRedeemScript = () => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();
  const walletCfg = getWalletCfg(sel.isTestNet(getState()), walletName);
  walletCfg.set(cfgConstants.DISMISS_BACKUP_MSG_REDEEM_SCRIPT, true);
  dispatch({ type: DISMISS_BACKUP_MSG_REDEEM_SCRIPT });
};

export const setStakePoolVoteChoices = (stakePool, voteChoices) => (
  dispatch
) => {
  wallet.allowStakePoolHost(stakePool.Host);
  wallet
    .setVoteChoices({
      apiUrl: stakePool.Host,
      apiToken: stakePool.ApiKey,
      voteChoices: voteChoices.getVotebits()
    })
    .then((response) => {
      if (response.data.status == "success") {
        dispatch(updateStakePoolVoteChoicesConfig(stakePool, voteChoices));
        dispatch({ type: SETSTAKEPOOLVOTECHOICES_SUCCESS });
      } else if (response.data.status == "error") {
        dispatch({
          error: response.data.message,
          type: SETSTAKEPOOLVOTECHOICES_FAILED
        });
      } else {
        dispatch({
          error: "shouldn't be here, set vote choices:",
          type: SETSTAKEPOOLVOTECHOICES_FAILED
        });
      }
    })
    .catch((error) =>
      dispatch({ error, type: SETSTAKEPOOLVOTECHOICES_FAILED })
    );
};

export const DISCOVERAVAILABLEVSPS_ATTEMPT = "DISCOVERAVAILABLEVSPS_ATTEMPT";
export const DISCOVERAVAILABLEVSPS_SUCCESS = "DISCOVERAVAILABLEVSPS_SUCCESS";
export const DISCOVERAVAILABLEVSPS_FAILED = "DISCOVERAVAILABLEVSPS_FAILED";

export const discoverAvailableVSPs = () => async (dispatch, getState) => {
  dispatch({ type: DISCOVERAVAILABLEVSPS_ATTEMPT });
  const isTestnet = sel.isTestNet(getState());
  try {
    let availableVSPs = await wallet.getAllVSPs();
    // add label and value so we can show this values on a select input.
    availableVSPs = shuffle(availableVSPs).map(vsp => ({
      ...vsp,
      label: vsp.host,
      value: vsp.host
    })
    ).filter(({ vspData }) => {
      if(!vspData) return false;
      const vspTestnet = vspData.network === TESTNET;
      return vspTestnet === isTestnet;
    });

    dispatch({
      type: DISCOVERAVAILABLEVSPS_SUCCESS,
      availableVSPs
    });
    return availableVSPs;
  } catch (error) {
    dispatch({
      type: DISCOVERAVAILABLEVSPS_FAILED,
      error
    });
  }
};

export const CHANGESELECTEDSTAKEPOOL = "CHANGESELECTEDSTAKEPOOL";
export const changeSelectedStakePool = (selectedStakePool) => (dispatch) =>
  dispatch({ selectedStakePool, type: CHANGESELECTEDSTAKEPOOL });

export const REMOVESTAKEPOOLCONFIG = "REMOVESTAKEPOOLCONFIG";
export const removeStakePoolConfig = (host) => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();
  const config = getWalletCfg(sel.isTestNet(getState()), walletName);
  const existingPools = config.get(cfgConstants.STAKEPOOLS);
  const pool = existingPools.filter((p) => p.Host === host)[0];
  if (!pool) {
    return;
  }

  // Instead of simply deleting from exsting pools we blank all non-default
  // fields so the stakepool can be reconfigured without needing to re-fetch
  // the stakepool list from the remote api.

  const propsToMaintain = ["Host", "Network", "APIVersionsSupported"];
  const newPool = {};
  propsToMaintain.forEach((p) => (newPool[p] = pool[p])); // **not** a deep copy
  const newPools = existingPools.map((p) => (p.Host === host ? newPool : p));
  config.set(cfgConstants.STAKEPOOLS, newPools);

  let selectedStakePool = sel.selectedStakePool(getState());
  if (selectedStakePool && selectedStakePool.Host === host) {
    selectedStakePool = newPools.filter((p) => p.ApiKey)[0] || null;
  }

  dispatch({
    selectedStakePool,
    currentStakePoolConfig: newPools,
    type: REMOVESTAKEPOOLCONFIG
  });
};

export const ADDCUSTOMSTAKEPOOL_ATTEMPT = "ADDCUSTOMSTAKEPOOL_ATTEMPT";
export const ADDCUSTOMSTAKEPOOL_FAILED = "ADDCUSTOMSTAKEPOOL_FAILED";
export const ADDCUSTOMSTAKEPOOL_SUCCESS = "ADDCUSTOMSTAKEPOOL_SUCCESS";

export const addCustomStakePool = (host) => async (dispatch, getState) => {
  dispatch({ type: ADDCUSTOMSTAKEPOOL_ATTEMPT });
  try {
    await wallet.allowStakePoolHost(host);
    const resp = await wallet.getStakePoolStats(host);
    const data = resp.data.data;
    const poolInfo = {
      Host: host,
      Network: data.Network === MAINNET ? MAINNET : TESTNET, // needed because may return testnet2, testnet3, etc
      APIVersionsSupported: data.APIVersionsSupported
    };

    if (poolInfo.Network !== sel.network(getState())) {
      throw (
        "Pool configured for a network different than wallet (" +
        poolInfo.Network +
        ")"
      );
    }

    const {
      daemon: { walletName }
    } = getState();
    const config = getWalletCfg(sel.isTestNet(getState()), walletName);
    updateStakePoolConfig(config, [poolInfo]);
    const currentStakePoolConfig = config.get(cfgConstants.STAKEPOOLS);

    dispatch({
      poolInfo,
      currentStakePoolConfig,
      type: ADDCUSTOMSTAKEPOOL_SUCCESS
    });

    return poolInfo;
  } catch (error) {
    dispatch({ error, type: ADDCUSTOMSTAKEPOOL_FAILED });
  }
};

export const DISCOVERAVAILABLESTAKEPOOLS_SUCCESS =
  "DISCOVERAVAILABLESTAKEPOOLS_SUCCESS";
export const discoverAvailableStakepools = () => async (dispatch, getState) => {
  const vspInfo = await wallet.getStakePoolInfo();
  // TODO treat error and return config values in that case
  if (!vspInfo) return null;
  const { daemon: { walletName } } = getState();
  const config = getWalletCfg(sel.isTestNet(getState()), walletName);
  updateStakePoolConfig(config, vspInfo);
  dispatch({
    type: DISCOVERAVAILABLESTAKEPOOLS_SUCCESS,
    currentStakePoolConfig: config.get(cfgConstants.STAKEPOOLS)
  });

  return vspInfo;
};

export const TOGGLE_ISLEGACY = "TOGGLE_ISLEGACY";
export const toggleIsLegacy = (isLegacy) => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();
  const walletCfg = getWalletCfg(sel.isTestNet(getState()), walletName);
  walletCfg.set(cfgConstants.VSP_IS_LEGACY, isLegacy);
  dispatch({
    type: TOGGLE_ISLEGACY,
    isLegacy
  });
};

export const UPDATE_USED_VSPS = "UPDATE_USED_VSPS";
export const updateUsedVSPs = (vsp) => (dispatch, getState) => {
  const walletName = sel.getWalletName(getState());
  const isTestNet = sel.isTestNet(getState());
  const walletCfg = getWalletCfg(isTestNet, walletName);
  const usedVSPs = walletCfg.get(USED_VSPS);
  const isUsed = usedVSPs.find(usedVSP => usedVSP.host === vsp.host);
  // ignore if already added.
  if (isUsed) return;
  // update otherwise.
  usedVSPs.push(vsp);
  walletCfg.set(USED_VSPS, usedVSPs);

  dispatch({ type: SET_REMEMBERED_VSP_HOST, usedVSPs });
};

export const SET_REMEMBERED_VSP_HOST = "SET_REMEMBERED_VSP_HOST";
export const setRememberedVspHost = (rememberedVspHost) => (dispatch, getState) => {
  dispatch({ type: SET_REMEMBERED_VSP_HOST, rememberedVspHost });

  const { daemon: { walletName } } = getState();
  const walletCfg = getWalletCfg(sel.isTestNet(getState()), walletName);
  walletCfg.set(cfgConstants.REMEMBERED_VSP_HOST, rememberedVspHost);
};

export const PROCESSMANAGEDTICKETS_ATTEMPT = "PROCESSMANAGEDTICKETS_ATTEMPT";
export const PROCESSMANAGEDTICKETS_SUCCESS = "PROCESSMANAGEDTICKETS_SUCCESS";
export const PROCESSMANAGEDTICKETS_FAILED = "PROCESSMANAGEDTICKETS_FAILED";


// processManagedTickets gets all vsp and check for tickets which still not
// synced, and sync them.
export const processManagedTickets = (passphrase) => async (dispatch, getState) => {
  dispatch({ type: PROCESSMANAGEDTICKETS_ATTEMPT });
  try {
    const walletService = sel.walletService(getState());
    const availableVSPs = await dispatch(discoverAvailableVSPs());
    let feeAccount, changeAccount;
    const mixedAccount = sel.getMixedAccount(getState());
    if (mixedAccount) {
      feeAccount = mixedAccount;
      changeAccount = sel.getChangeAccount(getState());
    } else {
      feeAccount = sel.defaultSpendingAccount(getState()).value;
      changeAccount = sel.defaultSpendingAccount(getState()).value;
    }

    await wallet.unlockWallet(walletService, passphrase);

    await Promise.all(availableVSPs.map(async (vsp) => {
      const { pubkey } = await dispatch(getVSPInfo(vsp.host));
      await wallet.processManagedTickets(
        walletService, vsp.host, pubkey, feeAccount, changeAccount
      );
    }));

    await wallet.lockWallet(walletService);

    // get vsp tickets fee status errored so we can resync them
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_ERRORED));
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_STARTED));
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_PAID));
    dispatch({ type: PROCESSMANAGEDTICKETS_SUCCESS });
    return true;
  } catch(error) {
    dispatch({ type: PROCESSMANAGEDTICKETS_FAILED, error });
  }
};

export const PROCESSUNMANAGEDTICKETS_ATTEMPT = "PROCESSUNMANAGEDTICKETS_ATTEMPT";
export const PROCESSUNMANAGEDTICKETS_SUCCESS = "PROCESSUNMANAGEDTICKETS_SUCCESS";
export const PROCESSUNMANAGEDTICKETS_FAILED = "PROCESSUNMANAGEDTICKETS_FAILED";

// processUnmanagedTickets process vsp tickets which are still unprocessed.
// It is called on wallet restore.
export const processUnmanagedTickets = (passphrase, vspHost, vspPubkey) => async (dispatch, getState) => {
  dispatch({ type: PROCESSUNMANAGEDTICKETS_ATTEMPT });
  try {
    const walletService = sel.walletService(getState());
    let feeAccount, changeAccount;
    const mixedAccount = sel.getMixedAccount(getState());
    if (mixedAccount) {
      feeAccount = mixedAccount;
      changeAccount = sel.getChangeAccount(getState());
    } else {
      feeAccount = sel.defaultSpendingAccount(getState()).value;
      changeAccount = sel.defaultSpendingAccount(getState()).value;
    }

    if (passphrase) {
      await wallet.processUnmanagedTickets(walletService, passphrase, vspHost, vspPubkey, feeAccount, changeAccount);
    } else {
      await wallet.processUnmanagedTicketsStartup(walletService, vspHost, vspPubkey, feeAccount, changeAccount);
    }

    // get vsp tickets fee status errored so we can resync them
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_ERRORED));
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_STARTED));
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_PAID));
    dispatch({ type: PROCESSUNMANAGEDTICKETS_SUCCESS });
    return null;
  } catch(error) {
    dispatch({ type: PROCESSUNMANAGEDTICKETS_FAILED, error });
    return error;
  }
};
