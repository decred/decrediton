// @flow
import Promise from "promise";
import { getWalletCfg, updateStakePoolConfig } from "../config";
import { importScriptAttempt, rescanAttempt } from "./ControlActions";
import * as sel from "../selectors";
import * as wallet from "wallet";

export const GETSTAKEPOOLSTATS_ATTEMPT = "GETSTAKEPOOLSTATS_ATTEMPT";
export const GETSTAKEPOOLSTATS_FAILED = "GETSTAKEPOOLSTATS_FAILED";
export const GETSTAKEPOOLSTATS_SUCCESS = "GETSTAKEPOOLSTATS_SUCCESS";

export const getStakepoolStats = () => (dispatch) => {
  dispatch({ type: GETSTAKEPOOLSTATS_ATTEMPT });
  wallet.getAllStakePoolStats()
    .then((allStakePoolStats) =>
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

const updateSavedConfig = (newPoolInfo, poolHost, apiKey, accountNum) =>
  (dispatch, getState) => {
    const currentStakePoolConfig = sel.currentStakePoolConfig(getState());
    const stakePoolConfigs = currentStakePoolConfig.map(config =>
      (config.Host === poolHost)
        ? (apiKey || accountNum)
          ? { ...config, ...newPoolInfo, ApiKey: apiKey }
          : (config.PoolFees !== newPoolInfo.PoolFees)
            ? { ...config, PoolFees: newPoolInfo.PoolFees }
            : config
        : config);
    if (!stakePoolConfigs.find((conf, idx) => conf !== currentStakePoolConfig[idx])) return;
    const { daemon: { walletName } } = getState();
    const walletCfg = getWalletCfg(sel.isTestNet(getState()), walletName);
    walletCfg.set("stakepools", stakePoolConfigs);
    return stakePoolConfigs;
  };

// setStakePoolAddressAction links the local wallet to a remote stakepool by
// deriving a new address from a given account, then requesting that the
// stakepool create the multisig script.
const setStakePoolAddressAction = (poolHost, apiKey, accountNum) =>
  async (dispatch, getState) => {
    const walletService = sel.walletService(getState());
    const { publicKey } = await wallet.getNextAddress(walletService, accountNum);
    wallet.allowStakePoolHost(poolHost);
    const response = await wallet.setStakePoolAddress({ apiUrl: poolHost, apiToken: apiKey, pKAddress: publicKey });
    if (response.data.status == "success") {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  };

export const REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED = "REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED";

// refreshStakepoolPurchaseInformation is used during wallet startup to grab
// fresh information (eg: latest pool fee) from all configured stakepools.
export const refreshStakepoolPurchaseInformation = () => (dispatch, getState) =>
  Promise.all(sel.configuredStakePools(getState()).map(
    ({ Host, ApiKey }) => {
      wallet.allowStakePoolHost(Host);
      wallet.getPurchaseInfo({ apiUrl: Host, apiToken: ApiKey })
        .then( response =>
          response.data.status === "success"
            ? dispatch(updateSavedConfig(response.data.data, Host))
            : null)
        .catch(error => dispatch({
          error, host: Host, type: REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED
        }));
    }
  ));

// setStakePoolInformation links a new stakepool to the wallet. This
// will contact the given stakepool, link it with an address from the wallet in
// the given account (if it hasn't already), import the multisig script and
// rescan the wallet for old transactions.
//
// This is meant to be used when setting up a new stakepool.
export const setStakePoolInformation = (privpass, poolHost, apiKey, rescan) =>
  async (dispatch) => {
    let extraErrorData;

    // we currently only support linking to new stakepools from the default
    // account for address discovery reasons.
    const accountNum = 0;

    wallet.allowStakePoolHost(poolHost);
    dispatch({ type: UPDATESTAKEPOOLCONFIG_ATTEMPT });
    try {
      let response = await wallet.getPurchaseInfo({ apiUrl: poolHost, apiToken: apiKey });

      if (response.data.status == "error" && response.data.message === "purchaseinfo error - no address submitted") {
        // this error happens when setting up a pool connection for the first
        // time. We need to generate and send a wallet address to the stakepool,
        // so that it will bind it with a stakepool address and create the
        // multisig voting script.
        await dispatch(setStakePoolAddressAction(poolHost, apiKey, accountNum));

        // remake the remote getPurchaseInfo call to get the newly configured
        // script
        // TODO: this should really be returned in the setStakePoolAddress call
        response = await wallet.getPurchaseInfo({ apiUrl: poolHost, apiToken: apiKey });
        if (response.data.status !== "success") {
          // there shouldn't be any errors at this stage anymore
          throw new Error(response.data.message);
        }
      } else if (response.data.status != "success") {
        throw new Error(response.data.message);
      }

      // import the script and verify whether the imported address matches what the
      // stakepool has sent us
      const importScriptResponse = await dispatch(importScriptAttempt(privpass, response.data.data.Script));
      if (importScriptResponse.getP2shAddress() !== response.data.data.TicketAddress) {
        extraErrorData = { incongruentP2shAddress: true,
          poolP2shAddress: importScriptResponse.getP2shAddress(),
          scriptAddress: response.data.data.TicketAddress };
        throw new Error("Incongruent p2sh address returned by stakepool");
      }

      // All set. Update the config, dispatch the success and start a rescan.
      const currentStakePoolConfig = await dispatch(updateSavedConfig(response.data.data, poolHost, apiKey, accountNum));
      let selectedStakePool = currentStakePoolConfig.filter(p => p.Host === poolHost)[0] || null;
      dispatch({ selectedStakePool, currentStakePoolConfig, type: UPDATESTAKEPOOLCONFIG_SUCCESS });
      rescan && dispatch(rescanAttempt(0));
    } catch (error) {
      dispatch({ error, ...extraErrorData, type: UPDATESTAKEPOOLCONFIG_FAILED });
      throw (error);
    }
  };

export const SETSTAKEPOOLVOTECHOICES_ATTEMPT = "SETSTAKEPOOLVOTECHOICES_ATTEMPT";
export const SETSTAKEPOOLVOTECHOICES_FAILED = "SETSTAKEPOOLVOTECHOICES_FAILED";
export const SETSTAKEPOOLVOTECHOICES_SUCCESS = "SETSTAKEPOOLVOTECHOICES_SUCCESS";

const updateStakePoolVoteChoicesConfig = (stakePool, voteChoices) => (dispatch, getState) => {
  const { daemon: { walletName } } = getState();
  const config = getWalletCfg(sel.isTestNet(getState()), walletName);
  const voteChoicesConfig = voteChoices.getChoicesList().map(choice => ({
    agendaId: choice.getAgendaId(),
    choiceId: choice.getChoiceId()
  }));
  const stakePoolConfigs = config.get("stakepools").map(config =>
    (config.Host === stakePool.Host)
      ? ({ ...config, VoteBits: voteChoices.getVotebits(), VoteChoices: voteChoicesConfig })
      : config
  );
  const selectedStakePool = sel.selectedStakePool(getState());

  config.set("stakepools", stakePoolConfigs);
  dispatch({
    selectedStakePool,
    currentStakePoolConfig: stakePoolConfigs,
    type: UPDATESTAKEPOOLCONFIG_SUCCESS
  });
};

export const setStakePoolVoteChoices = (stakePool, voteChoices) => (dispatch) => {
  wallet.allowStakePoolHost(stakePool.Host);
  wallet.setVoteChoices({
    apiUrl: stakePool.Host, apiToken: stakePool.ApiKey, voteChoices: voteChoices.getVotebits(),
  })
    .then(response => {
      if (response.data.status == "success") {
        dispatch(updateStakePoolVoteChoicesConfig(stakePool, voteChoices));
        dispatch({ type: SETSTAKEPOOLVOTECHOICES_SUCCESS });
      } else if (response.data.status == "error") {
        dispatch({ error: response.data.message, type: SETSTAKEPOOLVOTECHOICES_FAILED });
      } else {
        dispatch({ error: "shouldn't be here, set vote choices:", type: SETSTAKEPOOLVOTECHOICES_FAILED });
      }
    })
    .catch(error => dispatch({ error, type: SETSTAKEPOOLVOTECHOICES_FAILED }));
};

export const DISCOVERAVAILABLESTAKEPOOLS_SUCCESS = "DISCOVERAVAILABLESTAKEPOOLS_SUCCESS";
export const discoverAvailableStakepools = () => (dispatch, getState) =>
  wallet.getStakePoolInfo()
    .then((foundStakepoolConfigs) => {
      if (foundStakepoolConfigs) {
        const { daemon: { walletName } } = getState();
        let config = getWalletCfg(sel.isTestNet(getState()), walletName);
        updateStakePoolConfig(config, foundStakepoolConfigs);
        dispatch({ type: DISCOVERAVAILABLESTAKEPOOLS_SUCCESS, currentStakePoolConfig: config.get("stakepools") });
      }
    });

export const CHANGESELECTEDSTAKEPOOL = "CHANGESELECTEDSTAKEPOOL";
export const changeSelectedStakePool = (selectedStakePool) => (dispatch) =>
  dispatch({ selectedStakePool, type: CHANGESELECTEDSTAKEPOOL });

export const REMOVESTAKEPOOLCONFIG = "REMOVESTAKEPOOLCONFIG";
export const removeStakePoolConfig = (host) => (dispatch, getState) => {
  const { daemon: { walletName } } = getState();
  let config = getWalletCfg(sel.isTestNet(getState()), walletName);
  let existingPools = config.get("stakepools");
  let pool = existingPools.filter(p => p.Host === host)[0];
  if (!pool) { return; }

  // Instead of simply deleting from exsting pools we blank all non-default
  // fields so the stakepool can be reconfigured without needing to re-fetch
  // the stakepool list from the remote api.

  const propsToMaintain = [ "Host", "Network", "APIVersionsSupported" ];
  let newPool = {};
  propsToMaintain.forEach(p => newPool[p] = pool[p]); // **not** a deep copy
  let newPools = existingPools.map(p => p.Host === host ? newPool : p);
  config.set("stakepools", newPools);

  let selectedStakePool = sel.selectedStakePool(getState());
  if (selectedStakePool && selectedStakePool.Host === host) {
    selectedStakePool = newPools.filter(p => p.ApiKey)[0] || null;
  }

  dispatch({
    selectedStakePool,
    currentStakePoolConfig: newPools,
    type: REMOVESTAKEPOOLCONFIG });
};

export const ADDCUSTOMSTAKEPOOL_ATTEMPT = "ADDCUSTOMSTAKEPOOL_ATTEMPT";
export const ADDCUSTOMSTAKEPOOL_FAILED = "ADDCUSTOMSTAKEPOOL_FAILED";
export const ADDCUSTOMSTAKEPOOL_SUCCESS = "ADDCUSTOMSTAKEPOOL_SUCCESS";

export const addCustomStakePool = host => async (dispatch, getState) => {
  dispatch({ type: ADDCUSTOMSTAKEPOOL_ATTEMPT });
  try {
    await wallet.allowStakePoolHost(host);
    const resp = await wallet.getStakePoolStats(host);
    const data = resp.data.data;
    const poolInfo = {
      Host: host,
      Network: data.Network === "mainnet" ? "mainnet" : "testnet", // needed because may return testnet2, testnet3, etc
      APIVersionsSupported: data.APIVersionsSupported
    };

    if (poolInfo.Network !== sel.network(getState())) {
      throw "Pool configured for a network different than wallet (" + poolInfo.Network + ")";
    }

    const { daemon: { walletName } } = getState();
    let config = getWalletCfg(sel.isTestNet(getState()), walletName);
    updateStakePoolConfig(config, [ poolInfo ]);
    const currentStakePoolConfig = config.get("stakepools");

    dispatch({ poolInfo, currentStakePoolConfig, type: ADDCUSTOMSTAKEPOOL_SUCCESS });

    return poolInfo;
  } catch (error) {
    dispatch({ error, type: ADDCUSTOMSTAKEPOOL_FAILED });
  }
};
