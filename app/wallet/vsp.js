import Promise from "promise";
import * as api from "../middleware/vspapi";
import { withLog as log, withLogNoData } from "./index";
import { ipcRenderer } from "electron";

const promisifyReq = (fnName, Req) =>
  log(
    (...args) =>
      new Promise((ok, fail) =>
        Req(...args, (res, err) => (err ? fail(err) : ok(res)))
      ),
    fnName
  );

const promisifyReqLogNoData = (fnName, Req) =>
  withLogNoData(
    (...args) =>
      new Promise((ok, fail) =>
        Req(...args, (res, err) => (err ? fail(err) : ok(res)))
      ),
    fnName
  );

export const getPurchaseInfo = promisifyReq(
  "getPurchaseInfo",
  api.getPurchaseInfo
);
export const setStakePoolAddress = promisifyReq(
  "setStakePoolAddress",
  api.setStakePoolAddress
);
export const setVoteChoices = promisifyReq(
  "setVoteChoices",
  api.setVoteChoices
);
export const getAllStakePoolStats = promisifyReqLogNoData(
  "getAllStakePoolStats",
  api.allStakePoolStats
);
export const getStakePoolStats = promisifyReqLogNoData(
  "getStakePoolStats",
  api.statsFromStakePool
);
export const getStakePoolInfo = promisifyReqLogNoData(
  "getStakePoolInfo",
  api.stakePoolInfo
);
export const getVSPInfo = promisifyReqLogNoData(
  "getVSPInfo",
  api.getVSPInfo
);

export const getAllVSPs = promisifyReqLogNoData(
  "getAllVspsInfo",
  api.getAllVspsInfo
);

// allowVSPHost enables the external request to a specif VSP host.
export const allowVSPHost = log(
  (host) => Promise.resolve(ipcRenderer.sendSync("allow-vsp-host", host)),
  "Allow StakePool Host"
);
