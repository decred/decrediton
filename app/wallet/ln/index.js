import * as client from "middleware/ln/client";
import fs from "fs";
import { lnrpc as pb } from "middleware/ln/rpc_pb";
import { lnrpc as wupb } from "middleware/ln/walletunlocker_pb";
import { strHashToRaw } from "helpers/byteActions";
import { ipcRenderer } from "electron";
import { invoke, shimStreamedResponse } from "helpers/electronRenderer";

export const getLightningClient = client.getLightningClient;
export const getWatchtowerClient = client.getWatchtowerClient;
export const getWalletUnlockerClient = client.getWalletUnlockerClient;

export * from "./watchtower";

export const startDcrlnd = (...args) => invoke("start-dcrlnd", ...args);

export const stopDcrlnd = () => invoke("stop-dcrlnd");

export const dcrlndCreds = () => invoke("dcrlnd-creds");

export const getInfo = (client) => {
  const request = new pb.GetInfoRequest();
  return new Promise((resolve, reject) =>
    client.getInfo(request, (err, resp) =>
      err ? reject(err) : resolve(resp.toObject())
    )
  );
};

export const getNetworkInfo = (client) => {
  const request = new pb.NetworkInfoRequest();
  return new Promise((resolve, reject) =>
    client.getNetworkInfo(request, (err, resp) =>
      err ? reject(err) : resolve(resp.toObject())
    )
  );
};

export const getNodeInfo = (client, nodeID) => {
  const request = new pb.NodeInfoRequest();
  request.setPubKey(nodeID);
  request.setIncludeChannels(true);
  return new Promise((resolve, reject) =>
    client.getNodeInfo(request, (err, resp) =>
      err ? reject(err) : resolve(resp.toObject())
    )
  );
};

export const getRoutes = (client, nodeID, amt) => {
  const request = new pb.QueryRoutesRequest();
  request.setPubKey(nodeID);
  request.setAmt(amt);
  return new Promise((resolve, reject) =>
    client.queryRoutes(request, (err, resp) =>
      err ? reject(err) : resolve(resp.toObject())
    )
  );
};

export const getWalletBalance = (client) => {
  const request = new pb.WalletBalanceRequest();
  return new Promise((resolve, reject) =>
    client.walletBalance(request, (err, resp) =>
      err ? reject(err) : resolve(resp)
    )
  );
};

export const getChannelBalance = (client) => {
  const request = new pb.ChannelBalanceRequest();
  return new Promise((resolve, reject) =>
    client.channelBalance(request, (err, resp) =>
      err ? reject(err) : resolve(resp)
    )
  );
};

export const listChannels = (client) => {
  const request = new pb.ListChannelsRequest();
  return new Promise((resolve, reject) =>
    client.listChannels(request, (err, resp) =>
      err ? reject(err) : resolve(resp)
    )
  );
};

export const listPendingChannels = (client) => {
  const request = new pb.PendingChannelsRequest();
  return new Promise((resolve, reject) =>
    client.pendingChannels(request, (err, resp) =>
      err ? reject(err) : resolve(resp)
    )
  );
};

export const listClosedChannels = (client) => {
  const request = new pb.ClosedChannelsRequest();
  return new Promise((resolve, reject) =>
    client.closedChannels(request, (err, resp) =>
      err ? reject(err) : resolve(resp)
    )
  );
};

export const INVOICE_STATUS_OPEN = "open";
export const INVOICE_STATUS_SETTLED = "settled";
export const INVOICE_STATUS_EXPIRED = "expired";

export const formatInvoice = (invoiceData) => {
  const inv = invoiceData.toObject();
  if (inv.paymentRequest.indexOf("[ERROR]") === 0) return null;
  let status = "";

  if (inv.state === pb.Invoice.InvoiceState.SETTLED) {
    status = INVOICE_STATUS_SETTLED;
  } else if (inv.state === pb.Invoice.InvoiceState.OPEN) {
    const expiryTS = inv.creationDate + inv.expiry;
    if (new Date().getTime() / 1000 > expiryTS) {
      status = INVOICE_STATUS_EXPIRED;
    } else {
      status = INVOICE_STATUS_OPEN;
    }
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
    client.listInvoices(request, (err, resp) => {
      if (err) {
        reject(err);
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
    client.listPayments(request, (err, resp) => {
      if (err) {
        reject(err);
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
  return new Promise((resolve, reject) => {
    client.addInvoice(request, (err, resp) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(resp.toObject());
    });
  });
};

export const subscribeToInvoices = (client) => {
  const request = new pb.InvoiceSubscription();
  return shimStreamedResponse(client.subscribeInvoices(request));
};

export const subscribeChannelEvents = (client) => {
  const request = new pb.ChannelEventSubscription();
  return shimStreamedResponse(client.subscribeChannelEvents(request));
};

export const decodePayReq = (client, payReq) => {
  const request = new pb.PayReqString();
  request.setPayReq(payReq);
  return new Promise((resolve, reject) => {
    client.decodePayReq(request, (err, resp) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(resp.toObject());
    });
  });
};

export const createPayStream = (client) => {
  return shimStreamedResponse(client.sendPayment(null));
};

export const sendPayment = (payStream, payRequest, value) => {
  const req = new pb.SendRequest();
  req.setPaymentRequest(payRequest);
  if (value) {
    req.setAmt(value);
  }
  payStream.write(req);
};

export const connectPeer = (client, node, address) => {
  const request = new pb.ConnectPeerRequest();
  const addr = new pb.LightningAddress();
  addr.setPubkey(node);
  addr.setHost(address);
  request.setAddr(addr);
  request.setPerm(false);

  return new Promise((resolve, reject) =>
    client.connectPeer(request, (err, resp) =>
      err ? reject(err) : resolve(resp)
    )
  );
};

export const openChannel = (client, node, localAmt, pushAmt) => {
  const request = new pb.OpenChannelRequest();
  request.setNodePubkey(new Uint8Array(Buffer.from(node, "hex")));
  request.setLocalFundingAmount(localAmt);
  request.setPushAtoms(pushAmt);
  return shimStreamedResponse(client.openChannel(request));
};

export const closeChannel = (client, txid, outputIdx, force) => {
  const chanPoint = new pb.ChannelPoint();
  chanPoint.setFundingTxidBytes(strHashToRaw(txid));
  chanPoint.setOutputIndex(outputIdx);

  const request = new pb.CloseChannelRequest();
  request.setChannelPoint(chanPoint);
  request.setForce(force);

  return shimStreamedResponse(client.closeChannel(request));
};

export const newAddress = (client) => {
  const request = new pb.NewAddressRequest();
  request.setType(pb.AddressType.PUBKEY_HASH);
  return new Promise((resolve, reject) =>
    client.newAddress(request, (err, resp) =>
      err ? reject(err) : resolve(resp.getAddress())
    )
  );
};

export const sendCoins = (client, address, amount) => {
  const request = new pb.SendCoinsRequest();
  request.setAddr(address);
  request.setAmount(amount);
  return new Promise((resolve, reject) =>
    client.sendCoins(request, (err, resp) =>
      err ? reject(err) : resolve(resp.getTxid())
    )
  );
};

export const unlockWallet = (wuClient, passphrase, dcrwClientKeyCert) => {
  const request = new wupb.UnlockWalletRequest();
  const bytesPassphrase = new Uint8Array(Buffer.from(passphrase));
  request.setWalletPassword(bytesPassphrase);
  request.setDcrwClientKeyCert(dcrwClientKeyCert);

  return new Promise((resolve, reject) =>
    wuClient.unlockWallet(request, (err, resp) =>
      err ? reject(err) : resolve(resp)
    )
  );
};

export const stopDaemon = (client) => {
  const request = new pb.StopRequest();
  return new Promise((resolve, reject) =>
    client.stopDaemon(request, (err, resp) =>
      err ? reject(err) : resolve(resp)
    )
  );
};

export const removeDcrlnd = (walletName, testnet) =>
  invoke("ln-remove-dir", walletName, testnet);

export const scbInfo = (walletPath, testnet) =>
  invoke("ln-scb-info", walletPath, testnet);

export const exportBackup = (client, destPath) =>
  new Promise((resolve, reject) => {
    const req = new pb.ChanBackupExportRequest();
    client.exportAllChannelBackups(req, (err, resp) => {
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
        reject(error);
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

    client.verifyChanBackup(req, (err, resp) =>
      err ? reject(err) : resolve(resp)
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
    client.restoreChannelBackups(req, (err, resp) =>
      err ? reject(err) : resolve(resp)
    );
  });
