import { unlockAllAcctAndExecFn, signMessageAttempt } from "./ControlActions";
import { SETVOTECHOICES_SUCCESS } from "./ClientActions";
import * as sel from "../selectors";
import { wallet } from "wallet-preload-shim";
import {
  TESTNET,
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

// updateUsedVSPs adds a new vsp to wallet config (used_vsps) or
// updates its data if it exists. The saved data is expanded
// with the MIN_VSP_VERSION.
export const UPDATE_USED_VSPS = "UPDATE_USED_VSPS";
export const updateUsedVSPs = (vsp) => (dispatch, getState) => {
  const walletName = sel.getWalletName(getState());
  const isTestNet = sel.isTestNet(getState());
  const walletCfg = wallet.getWalletCfg(isTestNet, walletName);
  const usedVSPs = walletCfg.get(USED_VSPS);
  let isVspFound = false;
  const updatedVsp = { ...vsp, minVspVersion: MIN_VSP_VERSION };
  let updatedUsedVSPs = usedVSPs?.map((usedVSP) => {
    if (usedVSP.host === vsp.host) {
      isVspFound = true;
      return { ...usedVSP, ...updatedVsp };
    } else {
      return usedVSP;
    }
  });
  if (!isVspFound) {
    updatedUsedVSPs = usedVSPs ? [...usedVSPs, updatedVsp] : [updatedVsp];
  }
  walletCfg.set(USED_VSPS, updatedUsedVSPs);
  dispatch({ type: UPDATE_USED_VSPS, usedVSPs: updatedUsedVSPs });
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
export const setVSPDVoteChoices = (passphrase, vsps) => async (
  dispatch,
  getState
) => {
  const availableVSPs = vsps ? vsps : await dispatch(discoverAvailableVSPs());
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
              dispatch(
                updateUsedVSPs({
                  host: vsp.host,
                  vspdversion: vsp.vspData?.vspdversion
                })
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
    throw error;
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
    return vsps;
  } catch (error) {
    dispatch({
      type: GETUNSPENTUNEXPIREDVSPTICKETS_FAILED,
      error
    });
  }
};

// getNotAbstainVotes returns all saved votes which are not
// abstaining and related to an in-progress agenda.
export const getNotAbstainVotes = () => (_, getState) => {
  const voteChoices = sel.voteChoices(getState());
  const allAgendas = sel.allAgendas(getState());

  return voteChoices?.filter((vote) => {
    const agendaDetails = allAgendas.find(
      (agenda) => agenda.name === vote.agendaId
    );
    return (
      agendaDetails && !agendaDetails.finished && vote.choiceId !== "abstain"
    );
  });
};

// getRecentlyUpdatedUsedVSPs returns all recently updated VSPs
// which have > 0 unspent tickets.
// A vsp is considered as recently updated if it is not outdated now,
// and it was outdated when the last vote took place
// (vsp_version_current >= min_vsp_version &&
// vsp_version_saved < min_vsp_version_saved, where vsp_version_current
// and min_vsp_version are the fresh and current values)
export const getRecentlyUpdatedUsedVSPs = () => async (dispatch, getState) => {
  const walletName = sel.getWalletName(getState());
  const isTestNet = sel.isTestNet(getState());
  const walletCfg = wallet.getWalletCfg(isTestNet, walletName);
  const usedVSPs = walletCfg.get(USED_VSPS);
  if (!usedVSPs) {
    return null;
  }

  const availableVSPs = await dispatch(discoverAvailableVSPs());
  if (!availableVSPs) {
    return null;
  }

  const recentlyUpdatedUsedVSPs = usedVSPs.filter((v) => {
    if (!v.vspdversion || !v.minVspVersion) {
      return false;
    }

    const currentVSPData = availableVSPs.find((av) => av.host === v.host);
    if (!currentVSPData) {
      return false;
    }

    return (
      isVSPOutdated(v.vspdversion, v.minVspVersion) && !currentVSPData.outdated
    );
  });

  if (recentlyUpdatedUsedVSPs.length === 0) {
    return [];
  }

  const unspentTickets = await dispatch(getUnspentUnexpiredVspTickets());
  if (!unspentTickets) {
    return null;
  }
  return unspentTickets.filter(
    (v) =>
      v.tickets.length > 0 &&
      recentlyUpdatedUsedVSPs.find((av) => `https://${av.host}` === v.host)
  );
};

export const RESENDVSPDVOTECHOICES_ATTEMPT = "RESENDVSPDVOTECHOICES_ATTEMPT";
export const RESENDVSPDVOTECHOICES_FAILED = "RESENDVSPDVOTECHOICES_FAILED";
export const RESENDVSPDVOTECHOICES_SUCCESS = "RESENDVSPDVOTECHOICES_SUCCESS";
export const resendVSPDVoteChoices = (vsps, passphrase) => async (dispatch) => {
  dispatch({
    type: RESENDVSPDVOTECHOICES_ATTEMPT
  });
  try {
    if (!vsps) {
      throw new Error("Invalid VSPs parameter");
    }
    const availableVSPs = await dispatch(discoverAvailableVSPs());
    if (!availableVSPs) {
      throw new Error("Invalid fetching available VSPs");
    }

    const detailedVSPs = vsps?.reduce((acc, v) => {
      const detailedVSP = availableVSPs.find(
        (av) => `https://${av.host}` === v.host
      );
      return detailedVSP ? [...acc, detailedVSP] : acc;
    }, []);

    if (!detailedVSPs || detailedVSPs.length === 0) {
      throw new Error("Unknown vsps");
    }

    await dispatch(setVSPDVoteChoices(passphrase, detailedVSPs));
    dispatch({
      type: RESENDVSPDVOTECHOICES_SUCCESS
    });
  } catch (error) {
    dispatch({
      type: RESENDVSPDVOTECHOICES_FAILED,
      error
    });
    throw error;
  }
};

export const GETVSP_TICKET_STATUS_ATTEMPT = "GETVSP_TICKET_STATUS_ATTEMPT";
export const GETVSP_TICKET_STATUS_SUCCESS = "GETVSP_TICKET_STATUS_SUCCESS";
export const GETVSP_TICKET_STATUS_FAILED = "GETVSP_TICKET_STATUS_FAILED";

export const getVSPTicketStatus = (passphrase, tx, decodedTx) => async (
  dispatch,
  getState
) => {
  let commitmentAddress;
  let json;
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

    // This only considers the first commitment address which is the first odd output
    commitmentAddress = decodedTx.outputs[1].decodedScript.address;

    json = {
      tickethash: tx.txHash
    };
  } catch (error) {
    dispatch({ type: GETVSP_TICKET_STATUS_FAILED, error });
    return;
  }

  const sig = await dispatch(
    signMessageAttempt(commitmentAddress, JSON.stringify(json), passphrase)
  );

  if (!sig) {
    return;
  }

  dispatch({ type: GETVSP_TICKET_STATUS_ATTEMPT });
  try {
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
    const txURLBuilder = sel.txURLBuilder(getState());
    info.data.feetxUrl = txURLBuilder(info.data.feetxhash);
    return info.data;
  } catch (error) {
    dispatch({ type: GETVSP_TICKET_STATUS_FAILED, error });
  }
};

export const SET_ACCOUNT_FOR_TICKET_PURCHASE = "SET_ACCOUNT_FOR_TICKET_PURCHASE";
export const SET_SELECTED_VSP = "SET_SELECTED_VSP";
export const SET_NUM_TICKETS_TO_BUY = "SET_NUM_TICKETS_TO_BUY";
