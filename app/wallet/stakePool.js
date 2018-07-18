import Promise from "promise";
import * as api from "../middleware/stakepoolapi";
import { withLog as log, logOptionNoArgs, withLogNoData } from "./index";

const promisifyReq = (fnName, Req) => log( (...args) => new Promise((ok, fail) =>
  Req(...args, (res, err) => err ? fail(err) : ok(res))
), fnName);

const promisifyReqLogNoData = (fnName, Req) => withLogNoData((service, ...args) => new Promise((ok, fail) =>
  service[fnName](new Req(), ...args, (err, res) => err ? fail(err) : ok(res))), fnName);

export const getStakePoolInfo = withLogNoData(() =>
  new Promise((resolve, reject) =>
    api.stakePoolInfo((response, error) => !response ? reject(error) : resolve(response))),
"Get Stakepool Info");

export const getPurchaseInfo = promisifyReq("getPurchaseInfo", api.getPurchaseInfo);
export const setStakePoolAddress = promisifyReq("setStakePoolAddress", api.setStakePoolAddress);

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
