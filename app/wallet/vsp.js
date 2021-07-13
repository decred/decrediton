import * as api from "../middleware/vspapi";
import { withLog as log, withLogNoData } from "./index";
import * as cfg from "../config";
import * as cfgConstants from "constants/config";
import { ipcRenderer } from "electron";
import { reloadAllowedExternalRequests } from "./daemon";
import { allowVSPHost as confDialogAllowVSPHost } from "./confirmationDialog";

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
export const getVSPInfo = promisifyReqLogNoData("getVSPInfo", api.getVSPInfo);
export const getVSPFeeAddress = promisifyReqLogNoData(
  "getFeeAddress",
  api.getFeeAddress
);
export const payVSPFee = promisifyReqLogNoData("getFeeAddress", api.payFee);
export const getVSPTicketStatus = promisifyReqLogNoData(
  "getVSPTicketStatus",
  api.getVSPTicketStatus
);
export const setAltSig = promisifyReq("setAltSig", api.setAltSig);

// addAllowedVSPsInCfg modifies the config file to allow the given VSP hosts
// to be accessed. Returns true if the list of allowed hosts changed.
const addAllowedVSPsInCfg = (hosts) => {
  const c = cfg.getGlobalCfg();
  const newHosts = c.get(cfgConstants.ALLOWED_VSP_HOSTS);
  const oldHostsLen = newHosts.length;
  hosts.forEach((vsp) => newHosts.indexOf(vsp) === -1 && newHosts.push(vsp));
  if (oldHostsLen !== newHosts.length) {
    c.set(cfgConstants.ALLOWED_VSP_HOSTS, newHosts);
    return true;
  }

  return false;
};

export const getAllVSPs = withLogNoData(async () => {
  const res = await new Promise((ok, fail) =>
    api.getAllVspsInfo((res, err) => (err ? fail(err) : ok(res)))
  );

  // Allow access to all VSPs returned by the official VSP listing endpoint.
  // This is less then ideal because this endpoint might eventually return
  // domains that switched owners or that are otherwise available for hijack,
  // but is needed due to Decrediton (currently) having to iterate over all
  // existing VSPs to discover their pubkey and sync tickets.
  //
  // Eventually this can be further locked down once that iteration isn't
  // performed any more and VSPs are only accessed when attempting to purchase
  // a ticket.
  const hosts = res.map((vsp) => "https://" + vsp.host);
  if (addAllowedVSPsInCfg(hosts)) {
    await reloadAllowedExternalRequests();
  }

  return res;
}, "getAllVspsInfo");

// allowVSPHost enables the external request to a specific VSP host.
export const allowVSPHost = log(async (host) => {
  // Ask for confirmation if VSP host is not yet allowed.
  const c = cfg.getGlobalCfg();
  const allowedHosts = c.get(cfgConstants.ALLOWED_VSP_HOSTS);
  if (allowedHosts.indexOf(host) === -1) {
    await confDialogAllowVSPHost(host);

    // Store that the user allowed access to this VSP and enable access in the
    // main process.
    addAllowedVSPsInCfg([host]);
  }

  ipcRenderer.sendSync("allow-vsp-host", host);
}, "Allow VSP Host");
