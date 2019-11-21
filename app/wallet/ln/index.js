import * as client from "middleware/ln/client";
import * as pb from "middleware/ln/rpc_pb";
import { strHashToRaw } from "helpers/byteActions";

export const getLightningClient = client.getLightningClient;
export const getWalletUnlockerClient = client.getWalletUnlockerClient;

export const getInfo = client => {
  const request = new pb.GetInfoRequest();
  return new Promise((resolve, reject) => client.getInfo(request,
    (err, resp) => err ? reject(err) : resolve(resp.toObject())));
};

export const getWalletBalance = (client) => {
  const request = new pb.WalletBalanceRequest();
  return new Promise((resolve, reject) => client.walletBalance(request,
    (err, resp) => err ? reject(err) : resolve(resp)));
};

export const getChannelBalance = client => {
  const request = new pb.ChannelBalanceRequest();
  return new Promise((resolve, reject) => client.channelBalance(request,
    (err, resp) => err ? reject(err) : resolve(resp)));
};

export const listChannels = (client) => {
  const request = new pb.ListChannelsRequest();
  return new Promise((resolve, reject) => client.listChannels(request,
    (err, resp) => err ? reject(err) : resolve(resp)));
};

export const listPendingChannels = client => {
  const request = new pb.PendingChannelsRequest();
  return new Promise((resolve, reject) => client.pendingChannels(request,
    (err, resp) => err ? reject(err) : resolve(resp)));
};

export const listClosedChannels = client => {
  const request = new pb.ClosedChannelsRequest();
  return new Promise((resolve, reject) => client.closedChannels(request,
    (err, resp) => err ? reject(err) : resolve(resp)));
};

export const INVOICE_STATUS_OPEN = "open";
export const INVOICE_STATUS_SETTLED = "settled";
export const INVOICE_STATUS_EXPIRED = "expired";

export const formatInvoice = invoiceData => {
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
  return new Promise((resolve, reject) => client.listInvoices(request,
    (err, resp) => {
      if (err) {
        reject(err);
        return;
      }

      const invoices = resp.getInvoicesList().map(formatInvoice).filter(v => !!v);

      if (reversed) {
        invoices.reverse();
      }

      const res = {
        lastIndexOffset: resp.getLastIndexOffset(),
        firstIndexOffset: resp.getFirstIndexOffset(),
        invoices: invoices
      };

      resolve(res);
    }));
};

export const listPayments = (client) => {
  const request = new pb.ListPaymentsRequest();
  return new Promise((resolve, reject) => client.listPayments(request,
    (err, resp) => {
      if (err) {
        reject(err);
        return;
      }

      const payments = resp.getPaymentsList().map(p => p.toObject());
      payments.reverse();
      resolve(payments);
    }));
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
  return client.subscribeInvoices(request);
};

export const subscribeChannelEvents= (client) => {
  const request = new pb.ChannelEventSubscription();
  return client.subscribeChannelEvents(request);
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

export const createPayStream = client => {
  return client.sendPayment(null);
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

  return new Promise((resolve, reject) => client.connectPeer(request,
    (err, resp) => err ? reject(err) : resolve(resp)));
};

export const openChannel = (client, node, localAmt, pushAmt) => {
  const request = new pb.OpenChannelRequest();
  request.setNodePubkey(new Uint8Array(Buffer.from(node, "hex")));
  request.setLocalFundingAmount(localAmt);
  request.setPushAtoms(pushAmt);
  return client.openChannel(request);
};

export const closeChannel = (client, txid, outputIdx, force) => {
  const chanPoint = new pb.ChannelPoint();
  chanPoint.setFundingTxidBytes(strHashToRaw(txid));
  chanPoint.setOutputIndex(outputIdx);

  const request = new pb.CloseChannelRequest();
  request.setChannelPoint(chanPoint);
  request.setForce(force);

  return client.closeChannel(request);
};

export const newAddress = (client) => {
  const request = new pb.NewAddressRequest();
  request.setType(pb.AddressType.PUBKEY_HASH);
  return new Promise((resolve, reject) => client.newAddress(request,
    (err, resp) => err ? reject(err) : resolve(resp.getAddress())));
};

export const sendCoins = (client, address, amount) => {
  const request = new pb.SendCoinsRequest();
  request.setAddr(address);
  request.setAmount(amount);
  return new Promise((resolve, reject) => client.sendCoins(request,
    (err, resp) => err ? reject(err) : resolve(resp.getTxid())));
};

export const unlockWallet = (wuClient, passphrase) => {
  const request = new pb.UnlockWalletRequest();
  const bytesPassphrase = new Uint8Array(Buffer.from(passphrase));
  request.setWalletPassword(bytesPassphrase);
  return new Promise((resolve, reject) => wuClient.unlockWallet(request,
    (err, resp) => err ? reject(err) : resolve(resp)));
};

export const stopDaemon = (client) => {
  const request = new pb.StopRequest();
  return new Promise((resolve, reject) => client.stopDaemon(request,
    (err, resp) => err ? reject(err) : resolve(resp)));
};
