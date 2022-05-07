import {
  importScriptAttempt,
  rescanAttempt,
  unlockAllAcctAndExecFn,
  signMessageAttempt
} from "./ControlActions";
import { SETVOTECHOICES_SUCCESS } from "./ClientActions";
import * as sel from "../selectors";
import { wallet } from "wallet-preload-shim";
import {
  TESTNET,
  MAINNET,
  VSP_FEE_PROCESS_ERRORED,
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID,
  VSP_FEE_PROCESS_CONFIRMED
} from "constants";
import { USED_VSPS } from "constants/config";
import * as cfgConstants from "constants/config";
import { shuffle } from "helpers";
import { mapArray } from "fp";
import { isArray } from "lodash";
import semver from "semver";
import { MIN_VSP_VERSION, LIVE, UNMINED, IMMATURE } from "constants";

export const GETVSP_ATTEMPT = "GETVSP_ATTEMPT";
export const GETVSP_FAILED = "GETVSP_FAILED";
export const GETVSP_SUCCESS = "GETVSP_SUCCESS";

export const getVSPInfo = (host) => async (dispatch) => {
  // 5 seconds for timeout.
  const timeout_time = sel.getVSPInfoTimeoutTime();
  dispatch({ type: GETVSP_ATTEMPT });

  try {
    // Check if user allows access to this VSP. This might trigger a confirmation
    // dialog.
    host = `https://${host}`;
    await wallet.allowVSPHost(host);

    const timeout = new Promise((resolve, reject) =>
      setTimeout(() => reject({ isTimeout: true, vspHost: host }), timeout_time)
    );
    const getInfo = wallet.getVSPInfo(host);

    const info = await Promise.race([timeout, getInfo]);
    dispatch({ type: GETVSP_SUCCESS, info });
    return info.data;
  } catch (error) {
    dispatch({ type: GETVSP_FAILED, error });
    throw error;
  }
};

export const GETVSPTICKETSTATUS_ATTEMPT = "GETVSPTICKETSTATUS_ATTEMPT";
export const GETVSPTICKETSTATUS_FAILED = "GETVSPTICKETSTATUS_FAILED";
export const GETVSPTICKETSTATUS_SUCCESS = "GETVSPTICKETSTATUS_SUCCESS";
export const HASVSPTICKETSERRORED = "HASVSPTICKETSERRORED";

export const getVSPTicketsByFeeStatus = (feeStatus) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch({ type: GETVSPTICKETSTATUS_ATTEMPT });
    wallet
      .getVSPTicketsByFeeStatus(getState().grpc.walletService, feeStatus)
      .then((response) => {
        const ticketsHashes = response.ticketHashes;

        // add fee status into our stake transactions map.
        const { stakeTransactions } = getState().grpc;
        ticketsHashes.forEach((ticketHash) => {
          const tx = stakeTransactions[ticketHash];
          if (tx) {
            tx.feeStatus = feeStatus;
          }
        });
        // dispatch if we have tickets with error to register.
        if (feeStatus == VSP_FEE_PROCESS_ERRORED && ticketsHashes.length > 0) {
          dispatch({ type: HASVSPTICKETSERRORED, hasVSPTicketsError: true });
        }

        dispatch({
          type: GETVSPTICKETSTATUS_SUCCESS,
          vspTickets: { [feeStatus]: ticketsHashes },
          feeStatus,
          stakeTransactions
        });

        resolve(ticketsHashes);
      })
      .catch((err) => {
        dispatch({ type: GETVSPTICKETSTATUS_FAILED, err });
        reject(err);
      });
  });

export const GETVSPTRACKEDTICKETS_ATTEMPT = "GETVSPTRACKEDTICKETS_ATTEMPT";
export const GETVSPTRACKEDTICKETS_SUCCESS = "GETVSPTRACKEDTICKETS_SUCCESS";
export const GETVSPTRACKEDTICKETS_FAILED = "GETVSPTRACKEDTICKETS_FAILED";

export const getVSPTrackedTickets = () => async (dispatch, getState) => {
  dispatch({ type: GETVSPTRACKEDTICKETS_ATTEMPT });
  try {
    const walletService = sel.walletService(getState());
    const res = await wallet.getVSPTrackedTickets(walletService);
    const trackedTickets = mapArray(res, "host");

    // Determine the account of the voting address for each tracked ticket. As
    // an optimization, we check older versions of the trackedTickets map, and
    // if we already determined the account, we reuse it instead of querying the
    // wallet again.
    const oldTrackedTickets = sel.getVSPTrackedTickets(getState());
    for (const vspHost of Object.keys(trackedTickets)) {
      const vspInfo = trackedTickets[vspHost];
      const oldTickets = oldTrackedTickets[vspHost]
        ? mapArray(oldTrackedTickets[vspHost]?.tickets, "ticketHash")
        : {};
      for (const ticket of vspInfo.tickets) {
        const oldTicket = oldTickets ? oldTickets[ticket.ticketHash] : null;
        if (oldTicket) {
          ticket.votingAccount = oldTicket.votingAccount;
          ticket.commitmentAccount = oldTicket.commitmentAccount;
          continue;
        }

        // Discover the corresponding account from the wallet.
        const voteAddrResp = await wallet.validateAddress(
          walletService,
          ticket.votingAddress
        );
        ticket.votingAccount = voteAddrResp.accountNumber;
        const commitAddrResp = await wallet.validateAddress(
          walletService,
          ticket.commitmentAddress
        );
        ticket.commitmentAccount = commitAddrResp.accountNumber;
      }
    }

    dispatch({ trackedTickets, type: GETVSPTRACKEDTICKETS_SUCCESS });
  } catch (error) {
    console.error(error);
    dispatch({ error, type: GETVSPTRACKEDTICKETS_FAILED });
  }
};

export const SYNCVSPTICKETS_ATTEMPT = "SYNCVSPTICKETS_ATTEMPT";
export const SYNCVSPTICKETS_FAILED = "SYNCVSPTICKETS_FAILED";
export const SYNCVSPTICKETS_SUCCESS = "SYNCVSPTICKETS_SUCCESS";

export const syncVSPTicketsRequest = ({
  passphrase,
  vspHost,
  vspPubkey,
  account
}) => async (dispatch, getState) => {
  dispatch({ type: SYNCVSPTICKETS_ATTEMPT });
  try {
    let feeAcct = account;
    let changeAcct = account;
    const mixedAccount = sel.getMixedAccount(getState());
    const changeAccount = sel.getChangeAccount(getState());
    if (mixedAccount) {
      feeAcct = mixedAccount;
    }
    if (changeAccount) {
      changeAcct = changeAccount;
    }

    await dispatch(
      unlockAllAcctAndExecFn(passphrase, () =>
        wallet.syncVSPTickets(
          getState().grpc.walletService,
          vspHost,
          vspPubkey,
          feeAcct,
          changeAcct
        )
      )
    );
    dispatch({ type: SYNCVSPTICKETS_SUCCESS });
    dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_ERRORED));
  } catch (error) {
    dispatch({ type: SYNCVSPTICKETS_FAILED, error });
  }

  // Finally, ask the wallet to reprocess existing tickets. We do this via a
  // setTimeout to avoid stalling the return of this function.
  setTimeout(() => dispatch(processManagedTickets(passphrase), 500));
};

// getTicketSignature receives the tickethash and request and sign it using the
// ticket sstxcommitment address.
export const getTicketSignature = (tickethash, message, passphrase) => async (
  dispatch,
  getState
) => {
  const walletService = sel.walletService(getState());
  const chainParams = sel.chainParams(getState());

  const sstxAddr = await wallet.getSstxCommitmentAddress(
    walletService,
    chainParams,
    tickethash
  );
  const resp = await wallet.signMessage(
    walletService,
    sstxAddr,
    message,
    passphrase
  );
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
  const walletCfg = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
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
export const refreshStakepoolPurchaseInformation = () => (
  dispatch,
  getState
) => {
  const isLegacy = sel.getIsLegacy(getState());
  return Promise.all(
    sel.configuredStakePools(getState()).map(({ Host, ApiKey }) => {
      wallet.allowStakePoolHost(Host);
      wallet
        .getPurchaseInfo({ apiUrl: Host, apiToken: ApiKey })
        .then((response) =>
          response.data.status === "success"
            ? dispatch(updateSavedConfig(response.data.data, Host))
            : null
        )
        .catch((error) => {
          // not give an error in legacy mode
          if (isLegacy) {
            dispatch({
              error,
              host: Host,
              type: REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED
            });
          }
        });
    })
  );
};

// setStakePoolInformation links a new stakepool to the wallet. This
// will contact the given stakepool, link it with an address from the wallet in
// the given account (if it hasn't already), import the multisig script and
// rescan the wallet for old transactions.
//
// This is meant to be used when setting up a new stakepool.
export const setStakePoolInformation = (poolHost, apiKey, rescan) => async (
  dispatch
) => {
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
    if (importScriptResponse.p2shAddress !== response.data.data.TicketAddress) {
      extraErrorData = {
        incongruentP2shAddress: true,
        poolP2shAddress: importScriptResponse.p2shAddress,
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
    dispatch({
      error,
      ...extraErrorData,
      type: UPDATESTAKEPOOLCONFIG_FAILED
    });
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
  const config = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
  const voteChoicesConfig = voteChoices.choicesList.map((choice) => ({
    agendaId: choice.agendaId,
    choiceId: choice.choiceId
  }));
  const stakePoolConfigs = config.get(cfgConstants.STAKEPOOLS).map((config) =>
    config.Host === stakePool.Host
      ? {
          ...config,
          VoteBits: voteChoices.votebits,
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
  const walletCfg = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
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
      voteChoices: voteChoices.votebits
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
    availableVSPs = shuffle(availableVSPs)
      .map((vsp) => ({
        ...vsp,
        label: vsp.host,
        value: vsp.host,
        outdated: isVSPOutdated(vsp.vspData?.vspdversion, MIN_VSP_VERSION)
      }))
      .filter(({ vspData }) => {
        if (!vspData) return false;
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

// returns true if version < minVersion or version is not
// defined, so VSP is out of date
export const isVSPOutdated = (version, minVersion) => {
  return !version || semver.lt(version, minVersion);
};

export const CHANGESELECTEDSTAKEPOOL = "CHANGESELECTEDSTAKEPOOL";
export const changeSelectedStakePool = (selectedStakePool) => (dispatch) =>
  dispatch({ selectedStakePool, type: CHANGESELECTEDSTAKEPOOL });

export const REMOVESTAKEPOOLCONFIG = "REMOVESTAKEPOOLCONFIG";
export const removeStakePoolConfig = (host) => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();
  const config = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
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
    const config = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
    wallet.updateStakePoolConfig(config, [poolInfo]);
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
  const {
    daemon: { walletName }
  } = getState();
  const config = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
  wallet.updateStakePoolConfig(config, vspInfo);
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
  const walletCfg = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
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
  const walletCfg = wallet.getWalletCfg(isTestNet, walletName);
  const usedVSPs = walletCfg.get(USED_VSPS);
  const isUsed = usedVSPs.find((usedVSP) => usedVSP.host === vsp.host);
  // ignore if already added.
  if (isUsed) return;
  // update otherwise.
  usedVSPs.push(vsp);
  walletCfg.set(USED_VSPS, usedVSPs);

  dispatch({ type: SET_REMEMBERED_VSP_HOST, usedVSPs });
};

export const SET_REMEMBERED_VSP_HOST = "SET_REMEMBERED_VSP_HOST";
export const setRememberedVspHost = (rememberedVspHost) => (
  dispatch,
  getState
) => {
  dispatch({ type: SET_REMEMBERED_VSP_HOST, rememberedVspHost });

  const {
    daemon: { walletName }
  } = getState();
  const walletCfg = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
  walletCfg.set(cfgConstants.REMEMBERED_VSP_HOST, rememberedVspHost);
};

export const GETVSPSPUBKEYS_ATTEMPT = "GETAVAILABLEVSP_ATTEMPT";
export const GETVSPSPUBKEYS_SUCCESS = "GETVSPSPUBKEYS_SUCCESS";
export const GETVSPSPUBKEYS_FAILED = "GETVSPSPUBKEYS_FAILED";

// getVSPsPubkeys gets all available vsps and its pubkeys, so we can store it.
export const getVSPsPubkeys = () => async (dispatch) => {
  try {
    dispatch({ type: GETVSPSPUBKEYS_ATTEMPT });
    const vsps = await dispatch(discoverAvailableVSPs());
    if (!isArray(vsps)) {
      throw new Error("INVALID_VSPS");
    }
    await Promise.all(
      vsps.map((vsp) => {
        return new Promise((resolve) =>
          dispatch(getVSPInfo(vsp.host))
            .then(({ pubkey }) => {
              if (pubkey) {
                vsp.pubkey = pubkey;
                resolve(vsp);
              } else {
                resolve(null);
              }
            })
            .catch(() => {
              resolve(null);
              // Skip to the next vsp.
            })
        );
      })
    ).then((result) => {
      const availableVSPsPubkeys = result.filter((vsp) => !!vsp?.pubkey);
      dispatch({
        type: GETVSPSPUBKEYS_SUCCESS,
        availableVSPsPubkeys
      });
      return availableVSPsPubkeys;
    });
  } catch (error) {
    dispatch({ type: GETVSPSPUBKEYS_FAILED, error });
  }
};

export const PROCESSMANAGEDTICKETS_ATTEMPT = "PROCESSMANAGEDTICKETS_ATTEMPT";
export const PROCESSMANAGEDTICKETS_SUCCESS = "PROCESSMANAGEDTICKETS_SUCCESS";
export const PROCESSMANAGEDTICKETS_FAILED = "PROCESSMANAGEDTICKETS_FAILED";

// processManagedTickets gets all vsp and check for tickets which still not
// synced, and sync them.
export const processManagedTickets = (passphrase) => async (
  dispatch,
  getState
) => {
  const walletService = sel.walletService(getState());
  let availableVSPsPubkeys = sel.getAvailableVSPsPubkeys(getState());

  if (!availableVSPsPubkeys) {
    availableVSPsPubkeys = await dispatch(getVSPsPubkeys());
  }
  try {
    dispatch({ type: PROCESSMANAGEDTICKETS_ATTEMPT });
    let feeAccount, changeAccount;
    const mixedAccount = sel.getMixedAccount(getState());
    if (mixedAccount) {
      feeAccount = mixedAccount;
      changeAccount = sel.getChangeAccount(getState());
    } else {
      feeAccount = sel.defaultSpendingAccount(getState()).value;
      changeAccount = sel.defaultSpendingAccount(getState()).value;
    }
    await dispatch(
      unlockAllAcctAndExecFn(passphrase, async () => {
        // Process all managed tickets on all VSPs.
        await Promise.all(
          availableVSPsPubkeys.map((vsp) =>
            wallet.processManagedTickets(
              walletService,
              vsp.host,
              vsp.pubkey,
              feeAccount,
              changeAccount
            )
          )
        );

        // Update the list of dcrwallet tracked VSP tickets. This figures out
        // which accounts need to be left unlocked.
        await dispatch(getVSPTrackedTickets());
      })
    );

    // get vsp tickets fee status errored so we can resync them
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_ERRORED));
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_STARTED));
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_PAID));
    await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_CONFIRMED));
    dispatch({ type: PROCESSMANAGEDTICKETS_SUCCESS });
  } catch (error) {
    dispatch({ type: PROCESSMANAGEDTICKETS_FAILED, error });
    if (
      String(error).indexOf(
        "wallet.Unlock: invalid passphrase:: secretkey.DeriveKey"
      ) > 0
    ) {
      throw "Invalid private passphrase, please try again.";
    }
    throw error;
  }
};

export const PROCESSUNMANAGEDTICKETS_ATTEMPT =
  "PROCESSUNMANAGEDTICKETS_ATTEMPT";
export const PROCESSUNMANAGEDTICKETS_SUCCESS =
  "PROCESSUNMANAGEDTICKETS_SUCCESS";
export const PROCESSUNMANAGEDTICKETS_FAILED = "PROCESSUNMANAGEDTICKETS_FAILED";

// processUnmanagedTickets process vsp tickets which are still unprocessed.
// It is called on wallet restore.
export const processUnmanagedTickets = (passphrase, vspHost, vspPubkey) => (
  dispatch,
  getState
) =>
  new Promise((resolve, reject) => {
    const asyncProcess = async () => {
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
          await dispatch(
            unlockAllAcctAndExecFn(passphrase, () =>
              wallet.processUnmanagedTicketsStartup(
                walletService,
                vspHost,
                vspPubkey,
                feeAccount,
                changeAccount
              )
            )
          );
        } else {
          await wallet.processUnmanagedTicketsStartup(
            walletService,
            vspHost,
            vspPubkey,
            feeAccount,
            changeAccount
          );
        }

        // get vsp tickets fee status errored so we can resync them
        await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_ERRORED));
        await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_STARTED));
        await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_PAID));
        await dispatch(getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_CONFIRMED));
        dispatch({ type: PROCESSUNMANAGEDTICKETS_SUCCESS });
        return null;
      } catch (error) {
        dispatch({ type: PROCESSUNMANAGEDTICKETS_FAILED, error });
        return error;
      }
    };
    asyncProcess()
      .then((r) => resolve(r))
      .catch((error) => reject(error));
  });

export const SETVSPDVOTECHOICE_ATTEMPT = "SETVSPDVOTECHOICE_ATTEMPT";
export const SETVSPDVOTECHOICE_SUCCESS = "SETVSPDVOTECHOICE_SUCCESS";
export const SETVSPDVOTECHOICE_FAILED = "SETVSPDVOTECHOICE_FAILED";

// setVSPDVoteChoices gets all vsps and updates the set vote choices to
// whatever the wallet has.
export const setVSPDVoteChoices = (passphrase) => async (
  dispatch,
  getState
) => {
  const availableVSPs = await dispatch(discoverAvailableVSPs());
  for (const vsp of availableVSPs) {
    try {
      const { pubkey } = await dispatch(getVSPInfo(vsp.host));
      vsp.pubkey = pubkey;
    } catch (error) {
      // Ignore fetching info (won't set the vote choice for this vspd).
      // TODO: this should be tracked so that users know this VSP isn't voting
      // according to their wishes.
    }
  }
  try {
    dispatch({ type: SETVSPDVOTECHOICE_ATTEMPT });
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

    await dispatch(
      unlockAllAcctAndExecFn(passphrase, () =>
        Promise.all(
          availableVSPs.map(async (vsp) => {
            if (vsp.pubkey) {
              await wallet.setVspdAgendaChoices(
                walletService,
                vsp.host,
                vsp.pubkey,
                feeAccount,
                changeAccount
              );
            }
          })
        )
      )
    );

    dispatch({ type: SETVOTECHOICES_SUCCESS });
    dispatch({ type: SETVSPDVOTECHOICE_SUCCESS });
    return true;
  } catch (error) {
    dispatch({ type: SETVSPDVOTECHOICE_FAILED, error });
  }
};

export const SET_AUTOBUYER_SETTINGS = "SET_AUTOBUYER_SETTINGS";
export const saveAutoBuyerSettings = (
  balanceToMaintain,
  account,
  maxFeePercentage
) => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();
  const walletCfg = wallet.getWalletCfg(sel.isTestNet(getState()), walletName);
  const autobuyerSettings = {
    balanceToMaintain: parseInt(balanceToMaintain.atomValue),
    account: account.name,
    maxFeePercentage: parseInt(maxFeePercentage)
  };
  walletCfg.set(cfgConstants.AUTOBUYER_SETTINGS, autobuyerSettings);
  dispatch({
    type: SET_AUTOBUYER_SETTINGS,
    autobuyerSettings
  });
};

export const SET_CANDISABLEPROCESSMANAGED = "SET_CANDISABLEPROCESSMANAGED";
export const setCanDisableProcessManaged = (value) => (dispatch) => {
  dispatch({ type: SET_CANDISABLEPROCESSMANAGED, value });
};

export const getRandomVSP = (maxFeePercentage) => async (
  dispatch,
  getState
) => {
  const availableVSPs = sel.getAvailableVSPs(getState());
  if (availableVSPs.length == 0) {
    throw new Error("The available VSPs list is empty.");
  }
  const filteredVSPs = availableVSPs.filter(
    (vsp) =>
      vsp.vspData.feepercentage <= parseFloat(maxFeePercentage) && !vsp.outdated
  );
  if (filteredVSPs.length == 0) {
    const minFee = availableVSPs.reduce((acc, vsp) => {
      if (vsp.outdated || !vsp.vspData.feepercentage) {
        return acc;
      }
      return acc < vsp.vspData.feepercentage ? acc : vsp.vspData.feepercentage;
    }, undefined);
    throw new Error(
      `No VSPs available for that fee rate. (Minimum is currently ${minFee}%)`
    );
  }

  const shuffledArray = shuffle(filteredVSPs);
  let randomVSP;
  do {
    randomVSP = shuffledArray.pop();
    if (randomVSP?.pubkey == null) {
      try {
        const { pubkey } = await dispatch(getVSPInfo(randomVSP.host));
        randomVSP.pubkey = pubkey;
      } catch (error) {
        // Skip to the next vsp.
      }
    }
  } while (randomVSP?.pubkey == null && shuffledArray.length > 0);

  if (randomVSP?.pubkey == null) {
    throw new Error("Fetching VSP info failed.");
  }
  return randomVSP;
};

export const GETUNSPENTUNEXPIREDVSPTICKETS_ATTEMPT =
  "GETUNSPENTUNEXPIREDVSPTICKETS_ATTEMPT";
export const GETUNSPENTUNEXPIREDVSPTICKETS_FAILED =
  "GETUNSPENTUNEXPIREDVSPTICKETS_FAILED";
export const GETUNSPENTUNEXPIREDVSPTICKETS_SUCCESS =
  "GETUNSPENTUNEXPIREDVSPTICKETS_SUCCESS";
export const getUnspentUnexpiredVspTickets = () => async (
  dispatch,
  getState
) => {
  const { currentBlockHeight, walletService } = getState().grpc;
  let vsps = [];
  dispatch({ type: GETUNSPENTUNEXPIREDVSPTICKETS_ATTEMPT });

  try {
    const tickets = await wallet.getTickets(
      walletService,
      0,
      currentBlockHeight
    );
    tickets.forEach(({ ticket: { vspHost, txHash }, status }) => {
      if (
        vspHost &&
        vspHost != "" &&
        (status === LIVE || status === IMMATURE || status === UNMINED)
      ) {
        let foundVsp = false;
        vsps = vsps.map((v) => {
          if (v.host === vspHost) {
            foundVsp = true;
            return { ...v, tickets: [...v.tickets, txHash] };
          }
          return v;
        });
        if (!foundVsp) {
          vsps.push({ host: vspHost, tickets: [txHash] });
        }
      }
    });
    dispatch({
      type: GETUNSPENTUNEXPIREDVSPTICKETS_SUCCESS,
      vsps
    });
  } catch (error) {
    dispatch({
      type: GETUNSPENTUNEXPIREDVSPTICKETS_FAILED,
      error
    });
  }
};

export const GETVSP_TICKET_STATUS_ATTEMPT = "GETVSP_TICKET_STATUS_ATTEMPT";
export const GETVSP_TICKET_STATUS_SUCCESS = "GETVSP_TICKET_STATUS_SUCCESS";
export const GETVSP_TICKET_STATUS_FAILED = "GETVSP_TICKET_STATUS_FAILED";

export const getVSPTicketStatus = (passphrase, tx, decodedTx) => async (
  dispatch,
  getState
) => {
  dispatch({ type: GETVSP_TICKET_STATUS_ATTEMPT });

  try {
    if (!tx || !tx.ticketTx || !tx.ticketTx.vspHost || !tx.txHash) {
      throw new Error("Invalid tx parameter");
    }

    if (
      !decodedTx ||
      !decodedTx.outputs ||
      decodedTx.outputs.length < 2 ||
      !decodedTx.outputs[1].decodedScript ||
      !decodedTx.outputs[1].decodedScript.address
    ) {
      throw new Error("Invalid decodedTx parameter");
    }

    const txURLBuilder = sel.txURLBuilder(getState());
    // This only considers the first commitment address which is the first odd output
    const commitmentAddress = decodedTx.outputs[1].decodedScript.address;

    const json = {
      tickethash: tx.txHash
    };
    const sig = await dispatch(
      signMessageAttempt(commitmentAddress, JSON.stringify(json), passphrase)
    );

    if (!sig) {
      throw new Error("Invalid signature");
    }

    // Check if user allows access to this VSP. This might trigger a confirmation
    // dialog.
    await wallet.allowVSPHost(tx.ticketTx.vspHost);
    const info = await wallet.getVSPTicketStatus({
      host: tx.ticketTx.vspHost,
      sig,
      json
    });

    if (!info || !info.data) {
      throw new Error("Invalid response from the VSP");
    }

    if (info.data.code) {
      throw new Error(`${info.data.message} (code: ${info.data.code})`);
    }

    if (
      (tx.status === LIVE || tx.status === IMMATURE) &&
      info.data.feetxstatus === "confirmed" &&
      tx.feeStatus != VSP_FEE_PROCESS_CONFIRMED
    ) {
      dispatch(processManagedTickets(passphrase));
    }

    dispatch({ type: GETVSP_TICKET_STATUS_SUCCESS });
    info.data.feetxUrl = txURLBuilder(info.data.feetxhash);
    return info.data;
  } catch (error) {
    dispatch({ type: GETVSP_TICKET_STATUS_FAILED, error });
  }
};
