import Promise from "promise";
import { withLog } from "./app";
import { loader as rpcLoader } from "middleware/grpc/client";
import { WalletExistsRequest, CreateWalletRequest, OpenWalletRequest,
  CloseWalletRequest, StartConsensusRpcRequest, DiscoverAddressesRequest,
  SubscribeToBlockNotificationsRequest, FetchHeadersRequest } from "middleware/walletrpc/api_pb";

export const getLoader = ({ address, port }) =>
  new Promise((resolve, reject) =>
    rpcLoader(address, port, (loader, error) =>
      error ? reject(error) : resolve(loader)));

export const startRpc = (loader, daemonhost, rpcport, rpcuser, rpcpass, cert) =>
  new Promise((resolve, reject) => {
    const request = new StartConsensusRpcRequest();
    request.setNetworkAddress(daemonhost + ":" + rpcport);
    request.setUsername(rpcuser);
    request.setPassword(new Uint8Array(Buffer.from(rpcpass)));
    request.setCertificate(new Uint8Array(cert));
    loader.startConsensusRpc(request, error => error ? reject(error) : resolve());
  });

export const getWalletExists = (loader) =>
  new Promise((resolve, reject) =>
    loader.walletExists(new WalletExistsRequest(), (error, response) =>
      error ? reject(error) : resolve(response)));

export const createWallet = withLog("Create Wallet", (loader, pubPass, privPass, seed) =>
  new Promise((resolve, reject) => {
    const request = new CreateWalletRequest();
    request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
    request.setSeed(seed);
    loader.createWallet(request, error => error ? reject(error) : resolve());
  }));

export const openWallet = withLog("Open Wallet", (loader, pubPass) =>
  new Promise((resolve, reject) => {
    const request = new OpenWalletRequest();
    request.setPublicPassphrase(new Uint8Array(Buffer.from(pubPass)));
    loader.openWallet(request, error => error ? reject(error) : resolve());
  }));

export const closeWallet = (loader) =>
  new Promise((resolve, reject) =>
    loader.closeWallet(new CloseWalletRequest(), error => error ? reject(error) : resolve()));

export const discoverAddresses = withLog("Discover Addresses", (loader, shouldDiscoverAccounts, privPass) =>
  new Promise((resolve, reject) => {
    const request = new DiscoverAddressesRequest();
    request.setDiscoverAccounts(!!shouldDiscoverAccounts);
    if (shouldDiscoverAccounts) {
      request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
    }
    loader.discoverAddresses(request, error => error ? reject(error) : resolve());
  }));

export const subscribeToBlockNotifications = withLog("Subscribe Block Notification", (loader) =>
  new Promise((resolve, reject) =>
    loader.subscribeToBlockNotifications(
      new SubscribeToBlockNotificationsRequest(),
      error => error ? reject(error) : resolve()
    )
  ));

export const fetchHeaders = withLog("Fetching Headers", (loader) =>
  new Promise((resolve, reject) =>
    loader.fetchHeaders(new FetchHeadersRequest(), (error, response) =>
      error ? reject(error) : resolve(response))));
