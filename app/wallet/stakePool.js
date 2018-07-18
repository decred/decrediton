import Promise from "promise";
import * as api from "../middleware/stakepoolapi";
import { withLog as log, logOptionNoArgs, withLogNoData } from "./index";

const promisifyReq = (fnName, Req) => log( (...args) => new Promise((ok, fail) =>
  Req(...args, (res, err) => err ? fail(err) : ok(res))
), fnName);

const promisifyReqLogNoData = (fnName, Req) => withLogNoData( (...args) => new Promise((ok, fail) =>
  Req(...args, (res, err) => err ? fail(err) : ok(res))
), fnName);

export const getStakePoolInfo = withLogNoData(() =>
  new Promise((resolve, reject) =>
    api.stakePoolInfo((response, error) => !response ? reject(error) : resolve(response))),
"Get Stakepool Info");

export const getPurchaseInfo = promisifyReq("getPurchaseInfo", api.getPurchaseInfo);
export const setStakePoolAddress = promisifyReq("setStakePoolAddress", api.setStakePoolAddress);
export const setVoteChoices = promisifyReq("setVoteChoices", api.setVoteChoices)
export const getAllStakePoolStats = promisifyReqLogNoData("getAllStakePoolStats", api.allStakePoolStats)
export const getStakePoolStats = promisifyReqLogNoData("getStakePoolStats", api.statsFromStakePool)
