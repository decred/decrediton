import * as client from "middleware/ln/client";
import fs from "fs";
import { lnrpc as pb } from "middleware/ln/lightning_pb";
import { lnrpc as wupb } from "middleware/ln/walletunlocker_pb";
import { invoicesrpc as inpb } from "middleware/ln/invoices_pb";
import { autopilotrpc as appb } from "middleware/ln/autopilot_pb";
import { strHashToRaw } from "helpers/byteActions";
import { ipcRenderer } from "electron";
import { invoke, shimStreamedResponse } from "helpers/electronRenderer";
import {
  getClient,
  simpleRequest,
  mappedRequest,
  shimError
} from "middleware/grpc/clientTracking";
import { sendLNPayment as confPayment } from "../confirmationDialog";

import {
  INVOICE_STATUS_OPEN,
  INVOICE_STATUS_SETTLED,
  INVOICE_STATUS_EXPIRED,
  INVOICE_STATUS_CANCELED
} from "constants";

export const getLightningClient = client.getLightningClient;
export const getWatchtowerClient = client.getWatchtowerClient;
export const getWalletUnlockerClient = client.getWalletUnlockerClient;
export const getLNInvoiceClient = client.getLNInvoiceClient;
export const getLNAutopilotClient = client.getLNAutopilotClient;

export * from "./watchtower";

export const startDcrlnd = (...args) => invoke("start-dcrlnd", ...args);

export const stopDcrlnd = () => invoke("stop-dcrlnd");

export const dcrlndCreds = () => invoke("dcrlnd-creds");

export const getInfo = (client) =>
  simpleRequest(client, "getInfo", new pb.GetInfoRequest());

export const getNetworkInfo = (client) =>
  simpleRequest(client, "getNetworkInfo", new pb.NetworkInfoRequest());

export const getNodeInfo = (client, nodeID) => {
  const request = new pb.NodeInfoRequest();
  request.setPubKey(nodeID);
  request.setIncludeChannels(true);
  return simpleRequest(client, "getNodeInfo", request);
};

export const getRoutes = (client, nodeID, amt) => {
  const request = new pb.QueryRoutesRequest();
  request.setPubKey(nodeID);
  request.setAmt(amt);
  return simpleRequest(client, "queryRoutes", request);
};

export const getWalletBalance = (client) =>
  simpleRequest(client, "walletBalance", new pb.WalletBalanceRequest());

export const getChannelBalance = (client) =>
  simpleRequest(client, "channelBalance", new pb.ChannelBalanceRequest());

export const listChannels = (client) =>
  mappedRequest(
    client,
    "listChannels",
    new pb.ListChannelsRequest(),
    (resp) => ({
      channels: resp.getChannelsList().map((v) => v.toObject())
    })
  );

export const listPendingChannels = (client) =>
  mappedRequest(
    client,
    "pendingChannels",
    new pb.PendingChannelsRequest(),
    (resp) => ({
      totalLimboBalance: resp.getTotalLimboBalance(),
      pendingOpenChannels: resp
        .getPendingOpenChannelsList()
        .map((v) => v.toObject()),
      pendingClosingChannels: resp
        .getPendingClosingChannelsList()
        .map((v) => v.toObject()),
      pendingForceClosingChannels: resp
        .getPendingForceClosingChannelsList()
        .map((v) => v.toObject()),
      waitingCloseChannels: resp
        .getWaitingCloseChannelsList()
        .map((v) => v.toObject())
    })
  );

export const listClosedChannels = (client) =>
  mappedRequest(
    client,
    "closedChannels",
    new pb.ClosedChannelsRequest(),
    (resp) => ({
      channels: resp.getChannelsList().map((v) => v.toObject())
    })
  );

const formatInvoice = (invoiceData) => {
  const inv = invoiceData.toObject();
  if (inv.paymentRequest.indexOf("[ERROR]") === 0) return null;
  let status = "";
  const expiryTS = inv.creationDate + inv.expiry;
  const isExpired = new Date().getTime() / 1000 > expiryTS;

  if (inv.state === pb.Invoice.InvoiceState.SETTLED) {
    status = INVOICE_STATUS_SETTLED;
  } else if (inv.state === pb.Invoice.InvoiceState.CANCELED) {
    // Show temporarily canceled status until the expiry time.
    // (status is canceled and it has not expired yet).
    // After the expiry time, it become expired.
    status = isExpired ? INVOICE_STATUS_EXPIRED : INVOICE_STATUS_CANCELED;
  } else if (inv.state === pb.Invoice.InvoiceState.EXPIRED) {
    status = INVOICE_STATUS_EXPIRED;
  } else if (inv.state === pb.Invoice.InvoiceState.OPEN) {
    status = isExpired ? INVOICE_STATUS_EXPIRED : INVOICE_STATUS_OPEN;
  }

  const rHashHex = Buffer.from(inv.rHash, "base64").toString("hex");

  return {
    ...inv,
    status,
    rHashHex
  };
};

export const listInvoices = (client, reversed) => {
  const request = new pb.ListInvoiceRequest();
  request.setReversed(reversed);
  return new Promise((resolve, reject) =>
    getClient(client).listInvoices(request, (err, resp) => {
      if (err) {
        reject(shimError(err));
        return;
      }

      const invoices = resp
        .getInvoicesList()
        .map(formatInvoice)
        .filter((v) => !!v);

      if (reversed) {
        invoices.reverse();
      }

      const res = {
        lastIndexOffset: resp.getLastIndexOffset(),
        firstIndexOffset: resp.getFirstIndexOffset(),
        invoices: invoices
      };

      resolve(res);
    })
  );
};

export const listPayments = (client) => {
  const request = new pb.ListPaymentsRequest();
  return new Promise((resolve, reject) =>
    getClient(client).listPayments(request, (err, resp) => {
      if (err) {
        reject(shimError(err));
        return;
      }

      const payments = resp.getPaymentsList().map((p) => p.toObject());
      payments.reverse();
      resolve(payments);
    })
  );
};

export const addInvoice = (client, memo, value) => {
  const request = new pb.Invoice();
  request.setMemo(memo);
  request.setValue(value);
  return simpleRequest(client, "addInvoice", request);
};

export const cancelInvoice = (inClient, paymentHash) => {
  const request = new inpb.CancelInvoiceMsg();
  request.setPaymentHash(paymentHash);
  return simpleRequest(inClient, "cancelInvoice", request);
};

export const subscribeToInvoices = (client) => {
  const request = new pb.InvoiceSubscription();
  return shimStreamedResponse(
    getClient(client).subscribeInvoices(request),
    formatInvoice
  );
};

export const subscribeChannelEvents = (client) => {
  const request = new pb.ChannelEventSubscription();
  return shimStreamedResponse(
    getClient(client).subscribeChannelEvents(request)
  );
};

export const decodePayReq = (client, payReq) => {
  const request = new pb.PayReqString();
  request.setPayReq(payReq);
  return simpleRequest(client, "decodePayReq", request);
};

export const sendPayment = async (client, payRequest, value) => {
  const invoice = await decodePayReq(client, payRequest);
  await confPayment(
    invoice.numAtoms,
    invoice.paymentHash,
    invoice.description,
    invoice.destination
  );

  const req = new pb.SendRequest();
  req.setPaymentRequest(payRequest);
  if (value) {
    req.setAmt(value);
  }
  const payStream = getClient(client).sendPayment(null);
  // We use a setTimeout here so that the payment initiation is async.
  setTimeout(() => payStream.write(req), 200);
  return shimStreamedResponse(payStream);
};

export const connectPeer = (client, node, address) => {
  const request = new pb.ConnectPeerRequest();
  const addr = new pb.LightningAddress();
  addr.setPubkey(node);
  addr.setHost(address);
  request.setAddr(addr);
  request.setPerm(false);
  return simpleRequest(client, "connectPeer", request);
};

export const openChannel = (client, node, localAmt, pushAmt) => {
  const request = new pb.OpenChannelRequest();
  request.setNodePubkey(new Uint8Array(Buffer.from(node, "hex")));
  request.setLocalFundingAmount(localAmt);
  request.setPushAtoms(pushAmt);
  return shimStreamedResponse(getClient(client).openChannel(request));
};

export const closeChannel = (client, txid, outputIdx, force) => {
  const chanPoint = new pb.ChannelPoint();
  chanPoint.setFundingTxidBytes(strHashToRaw(txid));
  chanPoint.setOutputIndex(outputIdx);

  const request = new pb.CloseChannelRequest();
  request.setChannelPoint(chanPoint);
  request.setForce(force);

  return shimStreamedResponse(getClient(client).closeChannel(request));
};

export const newAddress = (client) => {
  const request = new pb.NewAddressRequest();
  request.setType(pb.AddressType.PUBKEY_HASH);
  return mappedRequest(client, "newAddress", request, (resp) =>
    resp.getAddress()
  );
};

export const sendCoins = (client, address, amount) => {
  const request = new pb.SendCoinsRequest();
  request.setAddr(address);
  request.setAmount(amount);
  return simpleRequest(client, "sendCoins", request);
};

export const unlockWallet = (wuClient, passphrase, dcrwClientKeyCert) => {
  const request = new wupb.UnlockWalletRequest();
  const bytesPassphrase = new Uint8Array(Buffer.from(passphrase));
  request.setWalletPassword(bytesPassphrase);
  request.setDcrwClientKeyCert(dcrwClientKeyCert);
  return simpleRequest(wuClient, "unlockWallet", request);
};

export const stopDaemon = (client) =>
  simpleRequest(client, "stopDaemon", new pb.StopRequest());

export const removeDcrlnd = (walletName, testnet) =>
  invoke("ln-remove-dir", walletName, testnet);

export const scbInfo = (walletPath, testnet) =>
  invoke("ln-scb-info", walletPath, testnet);

export const exportBackup = (client, destPath) =>
  new Promise((resolve, reject) => {
    const req = new pb.ChanBackupExportRequest();
    getClient(client).exportAllChannelBackups(req, (err, resp) => {
      if (err) {
        reject(err);
        return;
      }

      // If this file already exists, show the confirmation modal.
      if (fs.existsSync(destPath)) {
        const confirmOverwrite = ipcRenderer.sendSync(
          "confirm-file-overwrite",
          destPath
        );
        if (!confirmOverwrite) {
          reject("User canceled file overwrite");
          return;
        }
      }

      const data = resp.getMultiChanBackup().getMultiChanBackup();
      try {
        fs.writeFileSync(destPath, data);
        resolve();
      } catch (error) {
        reject(shimError(error));
      }
    });
  });

export const verifyBackup = (client, srcPath) =>
  new Promise((resolve, reject) => {
    let data;
    try {
      data = fs.readFileSync(srcPath);
    } catch (error) {
      reject(error);
    }

    const req = new pb.ChanBackupSnapshot();
    const multi = new pb.MultiChanBackup();
    multi.setMultiChanBackup(data);
    req.setMultiChanBackup(multi);

    getClient(client).verifyChanBackup(req, (err, resp) =>
      err ? reject(shimError(err)) : resolve(resp.toObject())
    );
  });

export const restoreBackup = (client, scbFile) =>
  new Promise((resolve, reject) => {
    let data;
    try {
      data = fs.readFileSync(scbFile);
    } catch (error) {
      reject(error);
      return;
    }
    const req = new pb.RestoreChanBackupRequest();
    req.setMultiChanBackup(data);
    getClient(client).restoreChannelBackups(req, (err, resp) =>
      err ? reject(shimError(err)) : resolve(resp.toObject())
    );
  });

export const describeGraph = (client) => {
  const request = new pb.ChannelGraphRequest();
  return new Promise((resolve, reject) =>
    getClient(client).describeGraph(request, (err, resp) => {
      if (err) {
        reject(shimError(err));
        return;
      }
      resolve({ nodeList: resp.getNodesList().map((p) => p.toObject()) });
    })
  );
};

export const modifyAutopilotStatus = (client, enable) => {
  const request = new appb.ModifyStatusRequest();
  request.setEnable(enable);
  return simpleRequest(client, "modifyStatus", request);
};

export const getAutopilotStatus = (client) => {
  const request = new appb.StatusRequest();

  return new Promise((resolve, reject) =>
    getClient(client).status(request, (err, resp) => {
      if (err) {
        reject(shimError(err));
        return;
      }
      resolve({ active: resp.getActive() });
    })
  );
};

export const getTransactions = (client, startHeight, endHeight) => {
  const request = new pb.GetTransactionsRequest();
  request.setStartHeight(startHeight);
  request.setEndHeight(endHeight);
  return new Promise((resolve, reject) =>
    getClient(client).getTransactions(request, (err, resp) => {
      if (err) {
        reject(shimError(err));
        return;
      }
      resolve(resp.getTransactionsList().map((p) => p.toObject()));
    })
  );
};
