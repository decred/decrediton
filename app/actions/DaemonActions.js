import {versionCheckAction} from "./WalletLoaderActions";
import * as daemon from "../wallet/daemon";
import { RPCDaemonHost} from "config";

export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONSTARTED_ADVANCED = "DAEMONSTARTED_ADVANCED";
export const DAEMONSTARTED_ADVANCED_ERROR = "DAEMONSTARTED_ADVANCED_ERROR";
export const DAEMONSTARTED_ERROR = "DAEMONSTARTED_ERROR";
export const DAEMONSTOPPED = "DAEMONSTOPPED";
export const DAEMONSTOPPED_ERROR = "DAEMONSTOPPED_ERROR";
export const DAEMONSYNCING_START = "DAEMONSYNCING_START";
export const DAEMONSYNCING_PROGRESS = "DAEMONSYNCING_PROGRESS";
export const DAEMONSYNCED = "DAEMONSYNCED";
export const WALLETREADY = "WALLETREADY";
export const LOADER_ADVANCED_SUCCESS = "LOADER_ADVANCED_SUCCESS";

export const startDaemon = () => (dispatch) => {
  daemon.startDaemon()
  .then(res => {
    const {pid, advancedDaemon} = res;
    dispatch({type: DAEMONSTARTED, pid});
    const next = advancedDaemon ? {type: DAEMONSTARTED_ADVANCED, advancedDaemon} : syncDaemon();
    dispatch(next);rpcappdataFilled
  })
  .catch(() => dispatch({type: DAEMONSTARTED_ERROR}));
};

export const startDaemonAdvanced = ({rpcuser, rpcpassword, rpccert}) => (dispatch) => {
  const rpchost = RPCDaemonHost();
  const credentials = {
    rpcuser: rpcuser,
    rpcpassword: rpcpassword,
    rpccert: rpccert
  };
  daemon.startDaemonAdvanced(rpcuser, rpcpassword, rpccert)
  .then( () => {
    dispatch(syncDaemon(credentials, rpchost));
    dispatch({type: LOADER_ADVANCED_SUCCESS});
  })
  .catch( () => {
    dispatch({type: DAEMONSTARTED_ADVANCED_ERROR});
  });
};

export const stopDaemon = () => (dispatch) => daemon
  .stopDaemon()
  .then(() => dispatch({type: DAEMONSTOPPED}))
  .catch(() => dispatch({type: DAEMONSTOPPED_ERROR}));

export const startWallet = (rpcCredentials, walletCredentials) => (dispatch) => {
  let username, password;
  if(walletCredentials){
    username = walletCredentials.username;
    password = walletCredentials.password;
  }
  daemon.startWallet(username, password)
  .then(pid => {
    dispatch({type: WALLETREADY, pid});
    setTimeout(()=>dispatch(versionCheckAction(rpcCredentials)), 1000);
  })
  .catch((err) => {
    console.log(err);
    dispatch({type: "DAEMONSTARTED_ERROR_ON_START_WALLET"});
  });
};

export const syncDaemon = (credentials, host) =>
  (dispatch, getState) => {
    let rpcuser, rpcpassword, rpccert;
    if(credentials){
      rpcuser = credentials.rpcuser;
      rpcpassword = credentials.rpcpassword;
      rpccert = credentials.rpccert;
    }
    const updateBlockCount = () => {
      const { walletLoader: { neededBlocks }} = getState();
      const { daemon: { daemonSynced, timeStart, blockStart } } = getState();
      // check to see if user skipped;
      if (daemonSynced) return;
      return daemon
        .getBlockCount(rpcuser, rpcpassword, host, rpccert)
        .then(updateCurrentBlockCount => {
          if (updateCurrentBlockCount >= neededBlocks) {
            dispatch({type: DAEMONSYNCED});
            dispatch(startWallet(credentials));
            return;
          } else if (updateCurrentBlockCount !== 0) {
            const blocksLeft = neededBlocks - updateCurrentBlockCount;
            const blocksDiff = updateCurrentBlockCount - blockStart;
            if (timeStart !== 0 && blockStart !== 0 && blocksDiff !== 0) {
              const currentTime = new Date();
              const timeSyncing = (currentTime - timeStart) / 1000;
              const secondsLeft = Math.round(blocksLeft / blocksDiff * timeSyncing);
              dispatch({
                currentBlockCount: parseInt(updateCurrentBlockCount),
                timeLeftEstimate: secondsLeft,
                type: DAEMONSYNCING_PROGRESS});
            } else if (updateCurrentBlockCount !== 0) {
              const time = new Date();
              dispatch({currentBlockCount: parseInt(updateCurrentBlockCount), timeStart: time, blockStart: parseInt(updateCurrentBlockCount), type: DAEMONSYNCING_START});
            }
          }
          setTimeout(updateBlockCount, 1000);
        }).catch(err=>console.log(err));
    };
    updateBlockCount();
  };
