import { withLog as log, withLogNoData, logOptionNoArgs } from "./app";
import { loader as rpcLoader } from "middleware/grpc/client";
import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { getDcrdCert } from "./config";
import { shimStreamedResponse } from "helpers/electronRenderer";
import { trackClient, getClient } from "middleware/grpc/clientTracking";

const {
  CreateWalletRequest,
  OpenWalletRequest,
  CloseWalletRequest,
  StartConsensusRpcRequest,
  DiscoverAddressesRequest,
  SubscribeToBlockNotificationsRequest,
  FetchHeadersRequest,
  CreateWatchingOnlyWalletRequest,
  SpvSyncRequest,
  FetchMissingCFiltersRequest,
  RescanPointRequest,
  RpcSyncRequest
} = api;

export const getLoader = withLogNoData(
  ({ isTestNet, walletName, address, port, cert, key }) =>
    new Promise((resolve, reject) =>
      rpcLoader(
        isTestNet,
        walletName,
        address,
        port,
        cert,
        key,
        (loader, error) => (error ? reject(error) : resolve(trackClient(loader)))
      )
    ),
  "Get Loader"
);

export const startRpc = log(
  (loader, daemonhost, rpcport, rpcuser, rpcpass, cert) =>
    new Promise((resolve, reject) => {
      const request = new StartConsensusRpcRequest();
      request.setNetworkAddress(daemonhost + ":" + rpcport);
      request.setUsername(rpcuser);
      request.setPassword(new Uint8Array(Buffer.from(rpcpass)));
      request.setCertificate(new Uint8Array(cert));
      getClient(loader).startConsensusRpc(request, (error) =>
        error ? reject(error) : resolve()
      );
    }),
  "Start RPC",
  logOptionNoArgs()
);

export const createWallet = log(
  (loader, pubPass, privPass, seed) =>
    new Promise((resolve, reject) => {
      const request = new CreateWalletRequest();
      request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
      request.setSeed(seed);
      getClient(loader).createWallet(request, (error) =>
        error ? reject(error) : resolve()
      );
    }),
  "Create Wallet",
  logOptionNoArgs()
);

export const createWatchingOnlyWallet = log(
  (loader, extendedPubKey) =>
    new Promise((resolve, reject) => {
      const request = new CreateWatchingOnlyWalletRequest();
      request.setExtendedPubKey(extendedPubKey);
      getClient(loader).createWatchingOnlyWallet(request, (error) =>
        error ? reject(error) : resolve()
      );
    }),
  "Create Watch Only Wallet",
  logOptionNoArgs()
);

export const openWallet = log(
  (loader, pubPass) =>
    new Promise((resolve, reject) => {
      const request = new OpenWalletRequest();
      request.setPublicPassphrase(new Uint8Array(Buffer.from(pubPass)));
      getClient(loader).openWallet(request, (error, response) =>
        error ? reject(error) : resolve(response)
      );
    }),
  "Open Wallet",
  logOptionNoArgs()
);

export const closeWallet = log(
  (loader) =>
    new Promise((resolve, reject) =>
      getClient(loader).closeWallet(new CloseWalletRequest(), (error) =>
        error ? reject(error) : resolve()
      )
    ),
  "Close Wallet"
);

export const discoverAddresses = log(
  (loader, shouldDiscoverAccounts, privPass, startingBlockHash) =>
    new Promise((resolve, reject) => {
      const request = new DiscoverAddressesRequest();
      request.setDiscoverAccounts(!!shouldDiscoverAccounts);
      if (shouldDiscoverAccounts) {
        request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
      }
      if (startingBlockHash) {
        request.setStartingBlockHash(
          new Uint8Array(Buffer.from(startingBlockHash))
        );
      }
      getClient(loader).discoverAddresses(request, (error) =>
        error ? reject(error) : resolve()
      );
    }),
  "Discover Addresses",
  logOptionNoArgs()
);

export const subscribeToBlockNotifications = log(
  (loader) =>
    new Promise((resolve, reject) =>
      getClient(loader).subscribeToBlockNotifications(
        new SubscribeToBlockNotificationsRequest(),
        (error) => (error ? reject(error) : resolve())
      )
    ),
  "Subscribe Block Notification"
);

export const fetchHeaders = log(
  (loader) =>
    new Promise((resolve, reject) =>
      getClient(loader).fetchHeaders(new FetchHeadersRequest(), (error, response) =>
        error ? reject(error) : resolve(response)
      )
    ),
  "Fetch Headers"
);

export const spvSync = log(
  async (loader, spvConnect, discoverAccts, setPrivPass) => {
    const request = new SpvSyncRequest();
    for (let i = 0; spvConnect && i < spvConnect.length; i++) {
      request.addSpvConnect(spvConnect[i]);
    }
    request.setDiscoverAccounts(discoverAccts);
    if (setPrivPass) {
      request.setPrivatePassphrase(new Uint8Array(Buffer.from(setPrivPass)));
    }
    const call = await getClient(loader).spvSync(request);
    return shimStreamedResponse(call);
  },
  "Start SPV Sync"
);

export const rpcSync = log(
  async (loader, rpcCreds, discoverAccts, setPrivPass) => {
    const { rpc_user, rpc_cert, rpc_pass, rpc_host, rpc_port } = rpcCreds;
    const request = new RpcSyncRequest();
    const cert = getDcrdCert(rpc_cert);
    request.setNetworkAddress(rpc_host + ":" + rpc_port);
    request.setUsername(rpc_user);
    request.setPassword(new Uint8Array(Buffer.from(rpc_pass)));
    request.setCertificate(new Uint8Array(cert));
    request.setDiscoverAccounts(discoverAccts);
    if (setPrivPass) {
      request.setPrivatePassphrase(new Uint8Array(Buffer.from(setPrivPass)));
    }
    const call = await getClient(loader).rpcSync(request);
    return shimStreamedResponse(call);
  },
  "Start RPC Sync"
);

export const fetchMissingCFilters = log(
  (loader) =>
    new Promise((resolve, reject) => {
      const request = new FetchMissingCFiltersRequest();
      getClient(loader).fetchMissingCFilters(request, (error, response) =>
        error ? reject(error) : resolve(response)
      );
    }),
  "Fetch Missing CFilters"
);

export const rescanPoint = log(
  (loader) =>
    new Promise((resolve, reject) => {
      const request = new RescanPointRequest();
      getClient(loader).rescanPoint(request, (error, response) =>
        error ? reject(error) : resolve(response)
      );
    }),
  "Get Rescan Point"
);
