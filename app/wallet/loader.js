import Promise from "promise";
import { withLog as log, logOptionNoArgs } from "./app";
import { loader as rpcLoader } from "middleware/grpc/client";
import { WalletExistsRequest, CreateWalletRequest, OpenWalletRequest,
  CloseWalletRequest, StartConsensusRpcRequest, DiscoverAddressesRequest,
  SubscribeToBlockNotificationsRequest, FetchHeadersRequest } from "middleware/walletrpc/api_pb";

export const getLoader = log(({ isTestNet, walletName, address, port }) =>
  new Promise((resolve, reject) =>
    rpcLoader(isTestNet, walletName, address, port, (loader, error) =>
      error ? reject(error) : resolve(loader))), "Get Loader");

export const startRpc = log((loader, daemonhost, rpcport, rpcuser, rpcpass, cert) =>
  new Promise((resolve, reject) => {
    const request = new StartConsensusRpcRequest();
    request.setNetworkAddress(daemonhost + ":" + rpcport);
    request.setUsername(rpcuser);
    request.setPassword(new Uint8Array(Buffer.from(rpcpass)));
    request.setCertificate(new Uint8Array(cert));
    loader.startConsensusRpc(request, error => error ? reject(error) : resolve());
  }), "Start RPC", logOptionNoArgs());

export const getWalletExists = log((loader) =>
  new Promise((resolve, reject) =>
    loader.walletExists(new WalletExistsRequest(), (error, response) =>
      error ? reject(error) : resolve(response))), "Get Wallet Exists");

export const createWallet = log((loader, pubPass, privPass, seed) =>
  new Promise((resolve, reject) => {
    const request = new CreateWalletRequest();
    request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
    request.setSeed(seed);
    loader.createWallet(request, error => error ? reject(error) : resolve());
  }), "Create Wallet", logOptionNoArgs());

export const openWallet = log((loader, pubPass) =>
  new Promise((resolve, reject) => {
    const request = new OpenWalletRequest();
    request.setPublicPassphrase(new Uint8Array(Buffer.from(pubPass)));
    loader.openWallet(request, error => error ? reject(error) : resolve());
  }), "Open Wallet", logOptionNoArgs());

export const closeWallet = log((loader) =>
  new Promise((resolve, reject) =>
    loader.closeWallet(new CloseWalletRequest(), error => error ? reject(error) : resolve())),
"Close Wallet");

export const discoverAddresses = log((loader, shouldDiscoverAccounts, privPass) =>
  new Promise((resolve, reject) => {
    const request = new DiscoverAddressesRequest();
    request.setDiscoverAccounts(!!shouldDiscoverAccounts);
    if (shouldDiscoverAccounts) {
      request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
    }
    loader.discoverAddresses(request, error => error ? reject(error) : resolve());
  }), "Discover Addresses", logOptionNoArgs());

export const subscribeToBlockNotifications = log((loader) =>
  new Promise((resolve, reject) =>
    loader.subscribeToBlockNotifications(
      new SubscribeToBlockNotificationsRequest(),
      error => error ? reject(error) : resolve()
    )
  ), "Subscribe Block Notification");

export const fetchHeaders = log((loader) =>
  new Promise((resolve, reject) =>
    loader.fetchHeaders(new FetchHeadersRequest(), (error, response) =>
      error ? reject(error) : resolve(response))), "Fetch Headers");
