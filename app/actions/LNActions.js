import * as ln from "wallet/ln";
import * as sel from "selectors";
import * as wallet from "wallet";
import { ipcRenderer } from "electron";
import { getWalletCfg } from "../config";
import { getWalletPath } from "main_dev/paths";
import { getNextAccountAttempt } from "./ControlActions";
import * as cfgConstants from "constants/config";

export const CLOSETYPE_COOPERATIVE_CLOSE = 0;
export const CLOSETYPE_LOCAL_FORCE_CLOSE = 1;
export const CLOSETYPE_REMOTE_FORCE_CLOSE = 2;
export const CLOSETYPE_BREACH_CLOSE = 3;
export const CLOSETYPE_FUNDING_CANCELED = 4;
export const CLOSETYPE_ABANDONED = 5;

export const LNWALLET_STARTUP_ATTEMPT = "LNWALLET_STARTUP_ATTEMPT";
export const LNWALLET_STARTUP_FAILED = "LNWALLET_STARTUP_FAILED";
export const LNWALLET_STARTUP_SUCCESS = "LNWALLET_STARTUP_SUCCESS";
export const LNWALLET_CREATEACCOUNT_FAILED = "LNWALLET_CREATEACCOUNT_FAILED";
export const LNWALLET_STARTDCRLND_FAILED = "LNWALLET_STARTDCRLND_FAILED";
export const LNWALLET_CONNECT_FAILED = "LNWALLET_CONNECT_FAILED";
export const LNWALLET_UNLOCK_FAILED = "LNWALLET_UNLOCK_FAILED";
export const LNWALLET_STARTUPSYNC_FAILED = "LNWALLET_STARTUPSYNC_FAILED";
export const LNWALLET_SCBRESTORE_FAILED = "LNWALLET_SCBRESTORE_FAILED";
export const LNWALLET_SCBRESTOREUNPACK_FAILED =
  "LNWALLET_SCBRESTOREUNPACK_FAILED";

export const LNWALLET_STARTUP_CHANGEDSTAGE = "LNWALLET_STARTUP_CHANGEDSTAGE";
export const LNWALLET_STARTUPSTAGE_STARTDCRLND =
  "LNWALLET_STARTUPSTAGE_STARTDCRLND";
export const LNWALLET_STARTUPSTAGE_CONNECT = "LNWALLET_STARTUPSTAGE_CONNECT";
export const LNWALLET_STARTUPSTAGE_UNLOCK = "LNWALLET_STARTUPSTAGE_UNLOCK";
export const LNWALLET_STARTUPSTAGE_STARTUPSYNC =
  "LNWALLET_STARTUPSTAGE_STARTUPSYNC";
export const LNWALLET_STARTUPSTAGE_SCBRESTORE =
  "LNWALLET_STARTUPSTAGE_SCBRESTORE";

// Meant to be used in the walletAccount parameter as a guard to signal we should
// create a new wallet account for LN operations.
export const CREATE_LN_ACCOUNT = "**create ln account**";

export const startDcrlnd = (
  passphrase,
  autopilotEnabled,
  walletAccount,
  scbFile
) => async (dispatch, getState) => {
  dispatch({ type: LNWALLET_STARTUP_ATTEMPT });

  const {
    grpc: { port }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();
  const isTestnet = sel.isTestNet(getState());
  const walletPath = getWalletPath(isTestnet, walletName);
  const walletPort = port;
  const lnCfg = dispatch(getLNWalletConfig());

  // Use the stored account if it exists, the specified account if it's a number
  // or create an account specifically for LN usage.
  let lnAccount = lnCfg.account;
  let creating = false;
  if (walletAccount === CREATE_LN_ACCOUNT) {
    try {
      const acctResp = await dispatch(
        getNextAccountAttempt(passphrase, "LN Account")
      );
      if (acctResp instanceof Error) {
        throw acctResp;
      } else if (acctResp.error) {
        throw acctResp.error;
      }
      lnAccount = acctResp.getNextAccountResponse.getAccountNumber();
      creating = true;
    } catch (error) {
      dispatch({ error, type: LNWALLET_CREATEACCOUNT_FAILED });
      dispatch({ type: LNWALLET_STARTUP_FAILED });
      throw error;
    }
  } else if (typeof walletAccount === "number") {
    lnAccount = walletAccount;
    creating = true;
  }

  const rpcCreds = ipcRenderer.sendSync("get-dcrd-rpc-credentials");
  const walletClientKeyCert = wallet.getDcrwalletGrpcKeyCert();

  let dcrlndCreds;
  let wuClient;

  try {
    dispatch({
      stage: LNWALLET_STARTUPSTAGE_STARTDCRLND,
      type: LNWALLET_STARTUP_CHANGEDSTAGE
    });
    const res = ipcRenderer.sendSync(
      "start-dcrlnd",
      lnAccount,
      walletPort,
      rpcCreds,
      walletPath,
      isTestnet,
      autopilotEnabled
    );
    if (typeof res === "string" || res instanceof Error) {
      throw res;
    }
    dcrlndCreds = res;
  } catch (error) {
    dispatch({ type: LNWALLET_STARTUP_FAILED });
    dispatch({ error, type: LNWALLET_STARTDCRLND_FAILED });
    return;
  }

  // Cleanup function for when the next few operations fail. At this point,
  // dcrlnd is already running so if some error occurs we need to shut it down.
  const cleanup = () => {
    // Force dcrlnd to stop.
    ipcRenderer.send("stop-dcrlnd");
    dispatch({ type: LNWALLET_STARTUP_FAILED });

    if (creating) {
      // When the error happens during ln wallet creation, remove the dir so
      // that the next attempt can try to create the wallet again. We do it
      // after a timeout to ensure the previous shutdown has completed.
      setTimeout(() => ln.removeDcrlnd(walletName, isTestnet), 2000);
    }
  };

  try {
    wuClient = await ln.getWalletUnlockerClient(
      dcrlndCreds.address,
      dcrlndCreds.port,
      dcrlndCreds.certPath,
      null
    );

    dispatch({
      stage: LNWALLET_STARTUPSTAGE_UNLOCK,
      type: LNWALLET_STARTUP_CHANGEDSTAGE
    });
    await ln.unlockWallet(wuClient, passphrase, walletClientKeyCert);
  } catch (error) {
    // An unimplemented error here probably means dcrlnd was already running,
    // so just continue with the connection attempt.
    if (error.code !== 12) {
      // 12 === UNIMPLEMENTED.
      // Otherwise, throw the error.
      cleanup();
      dispatch({ error, type: LNWALLET_UNLOCK_FAILED });
      return;
    }
  }

  let lnClient;
  try {
    dispatch({
      stage: LNWALLET_STARTUPSTAGE_CONNECT,
      type: LNWALLET_STARTUP_CHANGEDSTAGE
    });
    const { client } = await dispatch(
      connectToLNWallet(
        dcrlndCreds.address,
        dcrlndCreds.port,
        dcrlndCreds.certPath,
        dcrlndCreds.macaroonPath,
        lnAccount
      )
    );
    lnClient = client;
  } catch (error) {
    cleanup();
    dispatch({ error, type: LNWALLET_CONNECT_FAILED });
    return;
  }

  try {
    dispatch({
      stage: LNWALLET_STARTUPSTAGE_STARTUPSYNC,
      type: LNWALLET_STARTUP_CHANGEDSTAGE
    });
    await dispatch(waitForDcrlndSynced(lnClient));
  } catch (error) {
    cleanup();
    dispatch({ error, type: LNWALLET_STARTUPSYNC_FAILED });
    return;
  }

  try {
    dispatch({
      stage: LNWALLET_STARTUPSTAGE_SCBRESTORE,
      type: LNWALLET_STARTUP_CHANGEDSTAGE
    });
    scbFile && (await ln.restoreBackup(lnClient, scbFile));
  } catch (error) {
    cleanup();
    if (String(error).indexOf("unable to unpack chan backup") > -1) {
      // This error means the restore itself failed due to a MAC check error,
      // so either the SCB file is damaged or the user is attempting to restore
      // it on the wrong wallet/account.
      dispatch({ error, type: LNWALLET_SCBRESTOREUNPACK_FAILED });
    } else {
      // This is a generic error in case something else goes wrong.
      dispatch({ error, type: LNWALLET_SCBRESTORE_FAILED });
    }
    return;
  }

  // Startup only succeeded if we reached this point.
  dispatch(setLNWalletConfig(lnAccount));
  dispatch(loadLNStartupInfo());
  dispatch({ type: LNWALLET_STARTUP_SUCCESS });
};

export const LNWALLET_DCRLND_STOPPED = "LNWALLET_DCRLND_STOPPED";

export const stopDcrlnd = () => (dispatch, getState) => {
  if (!sel.lnActive(getState())) {
    return;
  }

  ipcRenderer.send("stop-dcrlnd");
  dispatch({ type: LNWALLET_DCRLND_STOPPED });
};

export const LNWALLET_CHECKED = "LNWALLET_CHECKED";

// checkLnWallet is called during wallet startup/reload to verify if the
// lnwallet is already running.
export const checkLnWallet = () => async (dispatch) => {
  const cfg = dispatch(getLNWalletConfig());
  dispatch({ exists: cfg.walletExists, type: LNWALLET_CHECKED });

  if (!cfg.walletExists) {
    return;
  }

  // Check whether the app knows of a previously running dcrlnd instance.
  const creds = ipcRenderer.sendSync("dcrlnd-creds");
  if (!creds) {
    return;
  }

  // Try to connect to it.
  try {
    dispatch({ type: LNWALLET_STARTUP_ATTEMPT });

    const { client } = await dispatch(
      connectToLNWallet(
        creds.address,
        creds.port,
        creds.certPath,
        creds.macaroonPath,
        cfg.account
      )
    );

    // Wait until the dcrlnd daemon is synced to the wallet.
    await dispatch(waitForDcrlndSynced(client));

    dispatch(loadLNStartupInfo());
    dispatch({ type: LNWALLET_STARTUP_SUCCESS });
  } catch (error) {
    // Ignore the errors since this is just an early attempt done at wallet
    // reload/startup. Specific errors are thrown in startDcrlnd().
    dispatch({ type: LNWALLET_STARTUP_FAILED });
  }
};

export const LNWALLET_CONNECT_SUCCESS = "LNWALLET_CONNECT_SUCCESS";

const connectToLNWallet = (
  address,
  port,
  certPath,
  macaroonPath,
  account
) => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (client) {
    // Already active and with a setup client.
    return { client };
  }

  const sleepMs = 3000;
  const sleepCount = 60 / (sleepMs / 1000);
  const sleep = () => new Promise((resolve) => setTimeout(resolve, sleepMs));

  // Attempt to connect to the lnrpc service of the wallet. Since the underlying
  // gRPC service of the dcrlnd node is restarted after it's unlocked, we might
  // need to try a few times until we get a proper connection.
  let lnClient, wtClient;
  let lastError;
  for (let i = 0; i < sleepCount; i++) {
    try {
      lnClient = await ln.getLightningClient(
        address,
        port,
        certPath,
        macaroonPath
      );
      wtClient = await ln.getWatchtowerClient(
        address,
        port,
        certPath,
        macaroonPath
      );

      // Force a getInfo call to ensure we're connected and the server provides
      // the Lightning service.
      await ln.getInfo(lnClient);
      lastError = null;
      break;
    } catch (error) {
        // An unimplemented error here probably means dcrlnd was just unlocked
        // and is currently starting up the services. Wait a bit and try again.
        if (error.code !== 12) { // 12 === UNIMPLEMENTED.
          throw error;
        }
        lastError = error;
        await sleep();
    }
  }
  if (lastError) throw lastError;

  // Ensure the dcrlnd instance and decrediton are connected to the same(ish)
  // wallet. For this test to fail the user would have had to manually change a
  // lot of config files and it should only happen when reconnecting to a
  // running instance, but we'll err on the side of being safe. We generate an
  // address on the lnwallet and check if this is also an address owned by the
  // wallet. This can still not completely ensure they are the same wallet
  // (since this would also pass in the case of different running wallets using
  // the same seed) but is good enough for our purposes.
  const lnWalletAddr = await ln.newAddress(lnClient);
  const validResp = await wallet.validateAddress(
    sel.walletService(getState()),
    lnWalletAddr
  );
  if (!validResp.getIsValid()) {
    throw new Error("Invalid address returned by lnwallet: " + lnWalletAddr);
  }
  if (!validResp.getIsMine()) {
    throw new Error("Wallet returned that address from lnwallet is not owned");
  }
  const addrAccount = validResp.getAccountNumber();
  if (addrAccount != account) {
    throw new Error(
      `Wallet returned that address is not from the ln account; account=
      ${addrAccount}`
    );
  }

  dispatch({ lnClient, wtClient, type: LNWALLET_CONNECT_SUCCESS });

  return { client: lnClient, wtClient };
};

const waitForDcrlndSynced = (lnClient) => async () => {
  const sleepMs = 3000;
  const sleepCount = 60 / (sleepMs / 1000);
  const sleep = () => new Promise((resolve) => setTimeout(resolve, sleepMs));

  for (let i = 0; i < sleepCount; i++) {
    const info = await ln.getInfo(lnClient);
    if (info.serverActive) {
      await sleep(); // Final sleep to let subsystems catch up.
      return;
    }
    await sleep();
  }

  throw new Error("dcrlnd wallet not synced after 60 seconds");
};

const loadLNStartupInfo = () => (dispatch) => {
  dispatch(updateLNWalletInfo());
  dispatch(updateLNWalletBalances());
  dispatch(updateLNChannelBalances());
  dispatch(subscribeChannelEvents());
  dispatch(updateChannelList());
  dispatch(listLatestPayments());
  dispatch(listLatestInvoices());
  dispatch(subscribeToInvoices());
  dispatch(createPaymentStream());
  dispatch(getScbInfo());
};

export const LNWALLET_INFO_UPDATED = "LNWALLET_INFO_UDPATED";

const updateLNWalletInfo = () => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) {
    return;
  }

  const info = await ln.getInfo(client);
  dispatch({ ...info, type: LNWALLET_INFO_UPDATED });
};

export const LNWALLET_BALANCE_UPDATED = "LNWALLET_BALANCE_UPDATED";

export const updateLNWalletBalances = () => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) {
    return;
  }

  const resp = await ln.getWalletBalance(client);
  const balances = resp.toObject();
  dispatch({ balances, type: LNWALLET_BALANCE_UPDATED });
};

export const LNWALLET_CHANNELBALANCE_UPDATED =
  "LNWALLET_CHANNELBALANCE_UPDATED";

export const updateLNChannelBalances = () => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) {
    return;
  }

  const resp = await ln.getChannelBalance(client);
  const channelBalances = resp.toObject();
  dispatch({ channelBalances, type: LNWALLET_CHANNELBALANCE_UPDATED });
};

export const LNWALLET_CHANNELLIST_UPDATED = "LNWALLET_CHANNELLIST_UPDATED ";

export const updateChannelList = () => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) return;

  const txURLBuilder = sel.txURLBuilder(getState());
  const txOutURLBuilder = sel.txOutURLBuilder(getState());
  const chanpointURL = (chanPoint) => {
    const split = chanPoint.split(":");
    if (split.length !== 2) {
      return "";
    }
    return txOutURLBuilder(split[0], split[1]);
  };

  const results = await Promise.all([
    ln.listChannels(client),
    ln.listPendingChannels(client),
    ln.listClosedChannels(client)
  ]);

  const channels = results[0].getChannelsList().map((c) => {
    const channel = c.toObject();
    return {
      ...channel,
      channelPointURL: chanpointURL(channel.channelPoint)
    };
  });

  const pendingOpen = results[1].getPendingOpenChannelsList().map((pc) => {
    const extra = pc.toObject();
    return {
      ...extra,
      ...extra.channel,
      pendingStatus: "open",
      remotePubkey: extra.channel.remoteNodePub,
      channelPointURL: chanpointURL(extra.channel.channelPoint)
    };
  });
  const pendingClose = results[1].getPendingClosingChannelsList().map((pc) => {
    const extra = pc.toObject();
    return {
      ...extra,
      ...extra.channel,
      pendingStatus: "close",
      remotePubkey: extra.channel.remoteNodePub,
      channelPointURL: chanpointURL(extra.channel.channelPoint)
    };
  });
  const pendingForceClose = results[1]
    .getPendingForceClosingChannelsList()
    .map((pc) => {
      const extra = pc.toObject();
      return {
        ...extra,
        ...extra.channel,
        pendingStatus: "forceclose",
        remotePubkey: extra.channel.remoteNodePub,
        channelPointURL: chanpointURL(extra.channel.channelPoint),
        closingTxidURL: txURLBuilder(extra.closingTxid)
      };
    });
  const pendingWaitClose = results[1]
    .getWaitingCloseChannelsList()
    .map((pc) => {
      const extra = pc.toObject();
      return {
        ...extra,
        ...extra.channel,
        pendingStatus: "waitclose",
        remotePubkey: extra.channel.remoteNodePub,
        channelPointURL: chanpointURL(extra.channel.channelPoint)
      };
    });

  const closedChannels = results[2].getChannelsList().map((c) => {
    const channel = c.toObject();
    return {
      ...channel,
      channelPointURL: chanpointURL(channel.channelPoint),
      closingTxidURL: txURLBuilder(channel.closingTxHash)
    };
  });

  const pendingChannels = [
    ...pendingOpen,
    ...pendingClose,
    ...pendingForceClose,
    ...pendingWaitClose
  ];

  dispatch({
    channels,
    pendingChannels,
    closedChannels,
    type: LNWALLET_CHANNELLIST_UPDATED
  });
};

export const LNWALLET_LATESTINVOICES_UPDATED =
  "LNWALLET_LATESTINVOICES_UPDATED";
export const listLatestInvoices = () => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) return;

  const reversed = true;
  const resp = await ln.listInvoices(client, reversed);
  dispatch({ invoices: resp.invoices, type: LNWALLET_LATESTINVOICES_UPDATED });
};

export const LNWALLET_LATESTPAYMENTS_UPDATED =
  "LNWALLET_LATESTPAYMENTS_UPDATED";
export const listLatestPayments = () => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) return;

  const payments = await ln.listPayments(client);
  dispatch({ payments, type: LNWALLET_LATESTPAYMENTS_UPDATED });
};

export const LNWALLET_ADDINVOICE_ATTEMPT = "LNWALLET_ADDINVOICE_ATTEMPT";
export const LNWALLET_ADDINVOICE_SUCCESS = "LNWALLET_ADDINVOICE_SUCCESS";
export const LNWALLET_ADDINVOICE_FAILED = "LNWALLET_ADDINVOICE_FAILED";

export const addInvoice = (memo, value) => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) {
    throw new Error("not connected to a ln wallet");
  }

  dispatch({ memo, value, type: LNWALLET_ADDINVOICE_ATTEMPT });
  try {
    const paymentRequest = await ln.addInvoice(client, memo, value);
    dispatch({ paymentRequest, type: LNWALLET_ADDINVOICE_SUCCESS });
    return paymentRequest;
  } catch (error) {
    dispatch({ error, type: LNWALLET_ADDINVOICE_FAILED });
    throw error;
  }
};

export const LNWALLET_INVOICE_SETTLED = "LNWALLET_INVOICE_SETTLED";
export const LNWALLET_INVOICE_OPENED = "LNWALLET_INVOICE_OPENED";
export const LNWALLET_INVOICE_EXPIRED = "LNWALLET_INVOICE_EXPIRED";

const subscribeToInvoices = () => (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) return;

  const sub = ln.subscribeToInvoices(client);
  sub.on("data", (invoiceData) => {
    const inv = ln.formatInvoice(invoiceData);
    const oldInvoices = getState().ln.invoices;
    const oldIdx = oldInvoices.findIndex((i) => i.addIndex === inv.addIndex);
    const newInvoices = [...oldInvoices];
    if (oldIdx > -1) {
      newInvoices[oldIdx] = inv;
    } else {
      newInvoices.unshift(inv);
    }

    let type = LNWALLET_INVOICE_OPENED;
    if (inv.status === ln.INVOICE_STATUS_SETTLED) {
      type = LNWALLET_INVOICE_SETTLED;
    } else if (inv.status === ln.INVOICE_STATUS_EXPIRED) {
      // This doesn't really work. on STATUS_OPEN we need to setup a
      // timer to change the status to EXPIRED.
      type = LNWALLET_INVOICE_EXPIRED;
    }

    dispatch({ invoice: inv, invoices: newInvoices, type });
    dispatch(updateLNChannelBalances());

    // These updates are less than ideal if the list of channels starts to grow,
    // but it's enough for the moment.
    setTimeout(() => dispatch(updateLNChannelBalances()), 1000);
    setTimeout(() => dispatch(updateChannelList()), 1000);
  });

  sub.on("close", () => {
    // TODO: implement this to attempt and re-open the subscription.
  });
};

export const LNWALLET_CHANNEL_EVENT = "LNWALLET_CHANNEL_EVENT";

export const subscribeChannelEvents = () => (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) return;

  const sub = ln.subscribeChannelEvents(client);
  sub.on("data", (eventData) => {
    const event = eventData.toObject();

    dispatch({ event, type: LNWALLET_CHANNEL_EVENT });

    // TODO: Ideally just modify the data instead of re-requesting the entire
    // list, as that is more efficient.
    dispatch(updateChannelList());
    dispatch(updateLNWalletBalances());
    dispatch(getScbInfo());
  });
};

export const decodePayRequest = (payReq) => async (dispatch, getState) => {
  const client = getState().ln.client;
  if (!client) {
    throw new Error("not connected to a ln wallet");
  }

  return await ln.decodePayReq(client, payReq);
};

export const LNWALLET_PAYSTREAM_CREATED = "LNWALLET_PAYSTREAM_CREATED";
export const LNWALLET_SENDPAYMENT_ATTEMPT = "LNWALLET_SENDPAYMENT_ATTEMPT";
export const LNWALLET_SENDPAYMENT_SUCCESS = "LNWALLET_SENDPAYMENT_SUCCESS";
export const LNWALLET_SENDPAYMENT_FAILED = "LNWALLET_SENDPAYMENT_FAILED";

const createPaymentStream = () => (dispatch, getState) => {
  const { client } = getState().ln;
  let { payStream } = getState().ln;
  if (!client) {
    throw new Error("not connected to a ln wallet");
  }

  if (payStream) {
    payStream.close();
  }

  payStream = ln.createPayStream(client);
  payStream.on("data", (payData) => {
    const pay = payData.toObject();

    // Look for outstanding payment requests send in the current wallet
    // session. If there are, notify waiting instances whether this payment
    // was completed or errored.
    const outPayments = getState().ln.outstandingPayments;
    const rhashHex = Buffer.from(pay.paymentHash, "base64").toString("hex");
    const prevOutPayment = outPayments[rhashHex];
    if (prevOutPayment) {
      const { resolve, reject } = prevOutPayment;
      if (pay.paymentError) {
        reject(new Error(pay.paymentError));
      } else {
        resolve(pay);
      }
    }

    if (pay.paymentError) {
      dispatch({
        error: pay.paymentError,
        rhashHex,
        payData: { paymentError: pay.paymentError, ...prevOutPayment },
        type: LNWALLET_SENDPAYMENT_FAILED
      });
    } else {
      dispatch({ rhashHex, type: LNWALLET_SENDPAYMENT_SUCCESS });
      dispatch(listLatestPayments());
      setTimeout(() => dispatch(updateLNChannelBalances()), 1000);
      setTimeout(() => dispatch(updateChannelList()), 1000);
    }
  });
  // TODO: Listen for onClose, etc

  dispatch({ payStream, type: LNWALLET_PAYSTREAM_CREATED });
};

export const sendPayment = (payReq, value) => (dispatch, getState) => {
  const { payStream, client } = getState().ln;
  if (!payStream) {
    throw new Error("payment stream not created");
  }

  return new Promise((resolve, reject) => {
    ln.decodePayReq(client, payReq)
      .then((decoded) => {
        const payData = { resolve, reject, decoded };
        const rhashHex = decoded.paymentHash;

        dispatch({
          payReq,
          payData,
          rhashHex,
          type: LNWALLET_SENDPAYMENT_ATTEMPT
        });
        ln.sendPayment(payStream, payReq, value);
      })
      .catch((error) => {
        dispatch({ error, rhashHex: null, type: LNWALLET_SENDPAYMENT_FAILED });
        reject(error);
      });
  });
};

export const LNWALLET_OPENCHANNEL_CHANPENDING =
  "LNWALLET_OPENCHANNEL_CHANPENDING";
export const LNWALLET_OPENCHANNEL_CHANOPEN = "LNWALLET_OPENCHANNEL_CHANOPEN";
export const LNWALLET_OPENCHANNEL_FAILED = "LNWALLET_OPENCHANNEL_FAILED";

export const openChannel = (node, localAmt, pushAmt) => async (
  dispatch,
  getState
) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  // Split the node string into a node pubkey and (optional) network address.
  // If the network address is specified, then try to connect first.

  const split = node.split("@");
  if (split.length > 2)
    throw new Error("remote than one @ in the node address");

  let nodePubKey;

  if (split.length == 2) {
    // Try to connect first.
    try {
      await ln.connectPeer(client, split[0], split[1]);
    } catch (error) {
      const errorStr = "" + error;
      if (errorStr.indexOf("already connected") === -1) {
        // Any errors except "already connected to peer" are fatal failures.
        dispatch({ error, type: LNWALLET_OPENCHANNEL_FAILED });
        throw error;
      }
    }
    nodePubKey = split[0];
  } else {
    nodePubKey = node;
  }

  const dispatchUpdates = () => {
    setTimeout(() => dispatch(updateLNChannelBalances()), 1000);
    setTimeout(() => dispatch(updateChannelList()), 1000);
    setTimeout(() => dispatch(updateLNWalletBalances()), 1000);
  };

  try {
    await new Promise((resolve, reject) => {
      const chanStream = ln.openChannel(client, nodePubKey, localAmt, pushAmt);
      chanStream.on("data", (updateData) => {
        const update = updateData.toObject();
        if (update.chanPending) {
          resolve();
          dispatch({ type: LNWALLET_OPENCHANNEL_CHANPENDING });
          dispatchUpdates();
        }
        if (update.chanOpen) {
          dispatch({ type: LNWALLET_OPENCHANNEL_CHANOPEN });
          dispatchUpdates();
        }
      });

      chanStream.on("error", (error) => {
        reject(error);
      });
    });

    dispatchUpdates();
  } catch (error) {
    dispatch({ error, type: LNWALLET_OPENCHANNEL_FAILED });
    throw error;
  }
};

export const LNWALLET_CLOSECHANNEL_CLOSEPENDING =
  "LNWALLET_CLOSECHANNEL_CLOSEPENDING";
export const LNWALLET_CLOSECHANNEL_CHANCLOSE =
  "LNWALLET_CLOSECHANNEL_CHANCLOSE";
export const LNWALLET_CLOSECHANNEL_FAILED = "LNWALLET_CLOSECHANNEL_FAILED";

export const closeChannel = (channelPoint, force) => (dispatch, getState) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  const split = channelPoint.split(":");
  if (split.length !== 2)
    throw new Error("channelpoint must be in format txid:output_index");

  const txid = split[0];
  const outputIdx = split[1];

  const dispatchUpdates = () => {
    setTimeout(() => dispatch(updateLNChannelBalances()), 1000);
    setTimeout(() => dispatch(updateChannelList()), 1000);
    setTimeout(() => dispatch(updateLNWalletBalances()), 1000);
  };

  const closeStream = ln.closeChannel(client, txid, outputIdx, force);
  closeStream.on("data", (data) => {
    const closeData = data.toObject();
    if (closeData.closePending) {
      dispatch({ type: LNWALLET_CLOSECHANNEL_CLOSEPENDING });
      dispatchUpdates();
    }
    if (closeData.chanClose) {
      dispatch({ type: LNWALLET_CLOSECHANNEL_CHANCLOSE });
      dispatchUpdates();
    }
  });

  closeStream.on("error", (error) => {
    dispatch({ error, type: LNWALLET_CLOSECHANNEL_FAILED });
  });
};

export const LNWALLET_FUNDWALLET_FAILED = "LNWALLET_FUNDWALLET_FAILED";
export const LNWALLET_FUNDWALLET_SUCCESS = "LNWALLET_FUNDWALLET_SUCCESS";

export const fundWallet = (amount, accountNb, passphrase) => async (
  dispatch,
  getState
) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  try {
    const walletService = sel.walletService(getState());
    const lnWalletAddr = await ln.newAddress(client);
    const outputs = [{ destination: lnWalletAddr, amount }];
    const txResp = await wallet.constructTransaction(
      walletService,
      accountNb,
      0,
      outputs
    );
    const unsignedTx = txResp.getUnsignedTransaction();
    const signResp = await wallet.signTransaction(
      walletService,
      passphrase,
      unsignedTx
    );
    const signedTx = signResp.getTransaction();
    await wallet.publishTransaction(walletService, signedTx);
    dispatch({ type: LNWALLET_FUNDWALLET_SUCCESS });
    setTimeout(() => dispatch(updateLNWalletBalances(), 3000));
  } catch (error) {
    dispatch({ error, type: LNWALLET_FUNDWALLET_FAILED });
    throw error;
  }
};

export const LNWALLET_WITHDRAWWALLET_FAILED = "LNWALLET_WITHDRAWWALLET_FAILED";
export const LNWALLET_WITHDRAWWALLET_SUCCESS =
  "LNWALLET_WITHDRAWWALLET_SUCCESS";

export const withdrawWallet = (amount, accountNb) => async (
  dispatch,
  getState
) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  try {
    const walletService = sel.walletService(getState());
    const walletAddr = await wallet.getNextAddress(walletService, accountNb);
    await ln.sendCoins(client, walletAddr.address, amount);
    dispatch({ type: LNWALLET_WITHDRAWWALLET_SUCCESS });
    setTimeout(() => dispatch(updateLNWalletBalances(), 3000));
  } catch (error) {
    dispatch({ error, type: LNWALLET_WITHDRAWWALLET_FAILED });
    throw error;
  }
};

const getLNWalletConfig = () => (dispatch, getState) => {
  // This (and setWalletConfig) are less than ideal for dealing with config
  // options, but sufficient for now.
  const {
    daemon: { walletName }
  } = getState();
  const cfg = getWalletCfg(sel.isTestNet(getState()), walletName);
  return {
    walletExists: cfg.get(cfgConstants.LN_WALLET_EXISTS),
    account: cfg.get(cfgConstants.LN_ACCOUNT)
  };
};

const setLNWalletConfig = (account) => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();
  const cfg = getWalletCfg(sel.isTestNet(getState()), walletName);
  cfg.set(cfgConstants.LN_WALLET_EXISTS, true);
  cfg.set(cfgConstants.LN_ACCOUNT, account);
};

export const LNWALLET_SCBINFO_UPDATED = "LNWALLET_SCBINFO_UPDATED";
const getScbInfo = () => async (dispatch, getState) => {
  const isTestnet = sel.isTestNet(getState());
  const {
    daemon: { walletName }
  } = getState();
  const walletPath = getWalletPath(isTestnet, walletName);
  const scbInfo = await ln.scbInfo(walletPath, isTestnet);
  dispatch({
    scbPath: scbInfo.channelBackupPath,
    scbUpdatedTime: scbInfo.channelBackupMTime,
    type: LNWALLET_SCBINFO_UPDATED
  });
};

export const LNWALLET_EXPORTBACKUP_SUCCESS = "LNWALLET_EXPORTBACKUP_SUCCESS";
export const LNWALLET_EXPORTBACKUP_FAILED = "LNWALLET_EXPORTBACKUP_FAILED";

export const exportBackup = (destPath) => async (dispatch, getState) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  try {
    await ln.exportBackup(client, destPath);
    dispatch({ destPath, type: LNWALLET_EXPORTBACKUP_SUCCESS });
  } catch (error) {
    dispatch({ error, type: LNWALLET_EXPORTBACKUP_FAILED });
  }
};

export const LNWALLET_VERIFYBACKUP_SUCCESS = "LNWALLET_VERIFYBACKUP_SUCCESS";
export const LNWALLET_VERIFYBACKUP_FAILED = "LNWALLET_VERIFYBACKUP_FAILED";

export const verifyBackup = (destPath) => async (dispatch, getState) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  try {
    await ln.verifyBackup(client, destPath);
    dispatch({ type: LNWALLET_VERIFYBACKUP_SUCCESS });
  } catch (error) {
    dispatch({ error, type: LNWALLET_VERIFYBACKUP_FAILED });
  }
};

export const LNWALLET_GETNETWORKINFO_ATTEMPT =
  "LNWALLET_GETNETWORKINFO_ATTEMPT";
export const LNWALLET_GETNETWORKINFO_SUCCESS =
  "LNWALLET_GETNETWORKINFO_SUCCESS";
export const LNWALLET_GETNETWORKINFO_FAILED = "LNWALLET_GETNETWORKINFO_FAILED";

export const getNetworkInfo = () => async (dispatch, getState) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  dispatch({ type: LNWALLET_GETNETWORKINFO_ATTEMPT });
  try {
    const network = await ln.getNetworkInfo(client);
    dispatch({ network, type: LNWALLET_GETNETWORKINFO_SUCCESS });
  } catch (error) {
    dispatch({ error, type: LNWALLET_GETNETWORKINFO_FAILED });
  }
};

export const LNWALLET_GETNODEINFO_ATTEMPT = "LNWALLET_GETNODEINFO_ATTEMPT";
export const LNWALLET_GETNODEINFO_SUCCESS = "LNWALLET_GETNODEINFO_SUCCESS";
export const LNWALLET_GETNODEINFO_FAILED = "LNWALLET_GETNODEINFO_FAILED";

export const getNodeInfo = (nodeID) => async (dispatch, getState) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  dispatch({ type: LNWALLET_GETNODEINFO_ATTEMPT });
  try {
    const nodeInfo = await ln.getNodeInfo(client, nodeID);
    dispatch({ nodeInfo, type: LNWALLET_GETNODEINFO_SUCCESS });
  } catch (error) {
    dispatch({ error, type: LNWALLET_GETNODEINFO_FAILED });
  }
};

export const LNWALLET_GETROUTESINFO_ATTEMPT = "LNWALLET_GETROUTESINFO_ATTEMPT";
export const LNWALLET_GETROUTESINFO_SUCCESS = "LNWALLET_GETROUTESINFO_SUCCESS";
export const LNWALLET_GETROUTESINFO_FAILED = "LNWALLET_GETROUTESINFO_FAILED";

export const getRoutesInfo = (nodeID, amt) => async (dispatch, getState) => {
  const { client } = getState().ln;
  if (!client) throw new Error("unconnected to ln wallet");

  dispatch({ type: LNWALLET_GETROUTESINFO_ATTEMPT });
  try {
    const routes = await ln.getRoutes(client, nodeID, amt);
    dispatch({ routes, type: LNWALLET_GETROUTESINFO_SUCCESS });
  } catch (error) {
    dispatch({ error, type: LNWALLET_GETROUTESINFO_FAILED });
  }
};

export const LNWALLET_ADDWATCHTOWER_ATTEMPT = "LNWALLET_ADDWATCHTOWER_ATTEMPT";
export const LNWALLET_ADDWATCHTOWER_SUCCESS = "LNWALLET_ADDWATCHTOWER_SUCCESS";
export const LNWALLET_ADDWATCHTOWER_FAILED = "LNWALLET_ADDWATCHTOWER_FAILED";

export const addWatchtower = (wtPubKey, addr) => async (
  dispatch,
  getState
) => {
  const { wtClient } = getState().ln;
  if (!wtClient) throw new Error("unconnected to ln wallet");

  dispatch({ type: LNWALLET_ADDWATCHTOWER_ATTEMPT });
  try {
    await ln.addTower(wtClient, wtPubKey, addr);
    dispatch({ type: LNWALLET_ADDWATCHTOWER_SUCCESS });
  } catch (error) {
    dispatch({ error, type: LNWALLET_ADDWATCHTOWER_FAILED });
  }
};

export const LNWALLET_LISTWATCHTOWERS_ATTEMPT = "LNWALLET_LISTWATCHTOWERS_ATTEMPT";
export const LNWALLET_LISTWATCHTOWERS_SUCCESS = "LNWALLET_LISTWATCHTOWERS_SUCCESS";
export const LNWALLET_LISTWATCHTOWERS_FAILED = "LNWALLET_LISTWATCHTOWERS_FAILED";

export const listWatchtowers = () => async (
  dispatch,
  getState
) => {
  const { wtClient } = getState().ln;
  if (!wtClient) throw new Error("unconnected to ln wallet");

  dispatch({ type: LNWALLET_LISTWATCHTOWERS_ATTEMPT });
  try {
    const towersList = await ln.listWatchtowers(wtClient);
    dispatch({ towersList, type: LNWALLET_LISTWATCHTOWERS_SUCCESS });
  } catch (error) {
    dispatch({ error, type: LNWALLET_LISTWATCHTOWERS_FAILED });
  }
};

export const LNWALLET_REMOVEWATCHTOWER_ATTEMPT = "LNWALLET_REMOVEWATCHTOWER_ATTEMPT";
export const LNWALLET_REMOVEWATCHTOWER_SUCCESS = "LNWALLET_REMOVEWATCHTOWER_SUCCESS";
export const LNWALLET_REMOVEWATCHTOWER_FAILED = "LNWALLET_REMOVEWATCHTOWER_FAILED";

export const removeWatchtower = wtPubKey => async (
  dispatch,
  getState
) => {
  const { wtClient } = getState().ln;
  if (!wtClient) throw new Error("unconnected to ln wallet");

  dispatch({ type: LNWALLET_REMOVEWATCHTOWER_ATTEMPT });
  try {
    await ln.removeTower(wtClient, wtPubKey);
    dispatch({ type: LNWALLET_REMOVEWATCHTOWER_SUCCESS });
  } catch (error) {
    dispatch({ error, type: LNWALLET_REMOVEWATCHTOWER_FAILED });
  }
};
