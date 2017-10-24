// @flow
import Promise from "promise";
import { getPurchaseInfo, setStakePoolAddress, setVoteChoices } from "../wallet/stakePool";
import { getNextAddress } from "../wallet/service";
import { getCfg, updateStakePoolConfig } from "../config.js";
import { importScriptAttempt } from "./ControlActions";
import { getStakePoolInfo } from "wallet/config";
import * as sel from "../selectors";

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
    getCfg().set("stakepools", stakePoolConfigs);
    dispatch({
      successMessage: `You have successfully configured ${poolHost}`,
      currentStakePoolConfig: stakePoolConfigs,
      type: UPDATESTAKEPOOLCONFIG_SUCCESS
    });
  };

const setStakePoolAddressAction = (privpass, poolHost, apiKey, accountNum) =>
  (dispatch, getState) => {
    const walletService = sel.walletService(getState());
    getNextAddress(walletService, accountNum)
      .then(({ publicKey }) =>
        setStakePoolAddress(poolHost, apiKey, publicKey)
          .then(response => {
            if (response.data.status == "success") {
              dispatch(setStakePoolInformation(privpass, poolHost, apiKey, accountNum, true));
            } else if (response.data.status == "error") {
              dispatch({ error: response.data.message, type: UPDATESTAKEPOOLCONFIG_FAILED });
            } else {
              dispatch({ error:"shouldn't be here set address:", type: UPDATESTAKEPOOLCONFIG_FAILED });
            }
          })
          .catch(error => dispatch({ error, type: UPDATESTAKEPOOLCONFIG_FAILED }))
      )
      .catch(error => dispatch({
        error: `${error}. Error setting stakepool address, please try again later.`,
        type: UPDATESTAKEPOOLCONFIG_FAILED
      }));
  };

export const updateStakepoolPurchaseInformation = () => (dispatch, getState) =>
  Promise.all(sel.configuredStakePools(getState()).map(
    ({ Host, ApiKey }) =>
      getPurchaseInfo(Host, ApiKey)
        .then(({ response: { data: { status, data }}, poolHost }) =>
          (status === "success")
            ? dispatch(updateSavedConfig(data, poolHost))
            : null)
        .catch(error => dispatch({
          error: `Unable to contact stakepool: ${error} please try again later`,
          type: UPDATESTAKEPOOLCONFIG_FAILED
        }))
  ));

export const setStakePoolInformation = (privpass, poolHost, apiKey, accountNum, internal) =>
  (dispatch) => {
    if (!internal) dispatch({ type: UPDATESTAKEPOOLCONFIG_ATTEMPT });
    getPurchaseInfo(poolHost, apiKey)
      .then(({ response: { data: { message, status, data } }, poolHost }) => {
        if (status === "success") {
          dispatch(
            importScriptAttempt(
              privpass, data.Script, true, 0, data.TicketAddress,
              (error) => error
                ? dispatch({ error, type: UPDATESTAKEPOOLCONFIG_FAILED })
                : dispatch(updateSavedConfig(data, poolHost, apiKey, accountNum))
            )
          );
        } else if (status === "error") {
          if (message == "purchaseinfo error - no address submitted") {
            dispatch(setStakePoolAddressAction(privpass, poolHost, apiKey, accountNum));
          } else {
            dispatch({ error: message, type: UPDATESTAKEPOOLCONFIG_FAILED });
          }
        }
      })
      .catch(error =>
        dispatch({
          error: `Unable to contact stakepool: ${error} please try again later`,
          type: UPDATESTAKEPOOLCONFIG_FAILED
        })
      );
  };

export const SETSTAKEPOOLVOTECHOICES_ATTEMPT = "SETSTAKEPOOLVOTECHOICES_ATTEMPT";
export const SETSTAKEPOOLVOTECHOICES_FAILED = "SETSTAKEPOOLVOTECHOICES_FAILED";
export const SETSTAKEPOOLVOTECHOICES_SUCCESS = "SETSTAKEPOOLVOTECHOICES_SUCCESS";

const updateStakePoolVoteChoicesConfig = (stakePool, voteChoices) => (dispatch) => {
  const config = getCfg();
  const voteChoicesConfig = voteChoices.getChoicesList().map(choice => ({
    agendaId: choice.getAgendaId(),
    choiceId: choice.getChoiceId()
  }));
  const stakePoolConfigs = config.get("stakepools").map(config =>
    (config.Host === stakePool.Host)
      ? ({ ...config, VoteBits: voteChoices.getVotebits(), VoteChoices: voteChoicesConfig })
      : config
  );

  config.set("stakepools", stakePoolConfigs);
  dispatch({
    successMessage: "You have successfully updated your vote choices.",
    currentStakePoolConfig: stakePoolConfigs,
    type: UPDATESTAKEPOOLCONFIG_SUCCESS
  });
};

export const setStakePoolVoteChoices = (stakePool, voteChoices) => (dispatch) =>
  setVoteChoices(stakePool.Host, stakePool.ApiKey, voteChoices.getVotebits())
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

export const DISCOVERAVAILABLESTAKEPOOLS_SUCCESS = "DISCOVERAVAILABLESTAKEPOOLS_SUCCESS";
export const discoverAvailableStakepools = () => (dispatch) =>
  getStakePoolInfo()
    .then((foundStakepoolConfigs) => {
      if (foundStakepoolConfigs) {
        let config = getCfg();
        updateStakePoolConfig(config, foundStakepoolConfigs);
        dispatch({ type: DISCOVERAVAILABLESTAKEPOOLS_SUCCESS, currentStakePoolConfig: config.get("stakepools")});
      } // TODO: add error notification after global snackbar is merged
    });
