import Promise from "promise";
import * as api from "../middleware/stakepoolapi";
import { withLog as log, logOptionNoArgs, withLogNoData } from "./index";

export const getStakePoolInfo = withLogNoData(() =>
  new Promise((resolve, reject) =>
    api.stakePoolInfo((response, error) => !response ? reject(error) : resolve(response))),
"Get Stakepool Info");

export const getPurchaseInfo = (poolHost, apiKey) =>
  new Promise((resolve, reject) =>
    api.getPurchaseInfo(poolHost, apiKey, (response, error, poolHost) =>
      error ? reject(error) : resolve({ response, poolHost })));

export const setStakePoolAddress = log((poolHost, apiKey, addressPubKey) =>
  new Promise((resolve, reject) =>
    api.setStakePoolAddress(
      poolHost, apiKey, addressPubKey,
      (response, error) => error ? reject(error) : resolve(response)
    )), "Set Stakepool Address", logOptionNoArgs());

export const setVoteChoices = log((poolHost, apiKey, voteBits) =>
  new Promise((resolve, reject) =>
    api.setVoteChoices(
      poolHost, apiKey, voteBits,
      (response, error) => error ? reject(error) : resolve(response)
    )), "Set Vote Choices", logOptionNoArgs());

export const getAllStakePoolStats = withLogNoData(() =>
  new Promise((resolve, reject) =>
    api.allStakePoolStats((response, error) => !response ? reject(error) : resolve(response))), "Get All Stakepool Stats");

export const getStakePoolStats = withLogNoData(host =>
  new Promise((resolve, reject) =>
    api.statsFromStakePool(host, (response, error) => !response ? reject(error) : resolve(response))), "Get Single Stakepool Stats");
