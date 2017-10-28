import {versionCheckAction} from "./WalletLoaderActions";
import * as daemon from "../wallet/daemon";

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
export const DAEMONSTARTED_ERROR_ON_START_WALLET = "DAEMONSTARTED_ERROR_ON_START_WALLET";
export const LOADER_ADVANCED_SUCCESS = "LOADER_ADVANCED_SUCCESS";
export const SAVE_START_ADVANCED_DAEMON_CREDENTIALS = "SAVE_START_ADVANCED_DAEMON_CREDENTIALS";
export const SKIPPED_START_ADVANCED_LOGIN = "SKIPPED_START_ADVANCED_LOGIN";

export const startDaemon = () => (dispatch) => {
  daemon.startDaemon()
  .then(res => {
    const {pid, advancedDaemon} = res;
    dispatch({type: DAEMONSTARTED, pid});
    const next = advancedDaemon ? {type: DAEMONSTARTED_ADVANCED, advancedDaemon} : syncDaemon();
    dispatch(next);
  })
  .catch(() => dispatch({type: DAEMONSTARTED_ERROR}));
};

/*
 * startType can be 1 for connecting to a remote rpc or 2 for connecting to a different appData directory
 */
export const startDaemonAdvanced = (args, startType) => (dispatch) => {
  if(startType === 1){
    dispatch(syncDaemon(startType, args));
    dispatch({
      type: SAVE_START_ADVANCED_DAEMON_CREDENTIALS,
      credentials: args,
      startType: startType
    });
    dispatch({type: LOADER_ADVANCED_SUCCESS});
    return;
  }

  if(!args)
    dispatch({ type: SKIPPED_START_ADVANCED_LOGIN });

  daemon.startDaemonAdvanced(args, startType)
  .then( () => {
    dispatch(syncDaemon(startType, args));
    dispatch({
      type: SAVE_START_ADVANCED_DAEMON_CREDENTIALS,
      credentials: args,
      startType: startType
    });
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

export const startWallet = (walletCredentials) => (dispatch) => {
  let username, password;
  if(walletCredentials){
    username = walletCredentials.username;
    password = walletCredentials.password;
  }
  daemon.startWallet(username, password)
  .then(pid => {
    dispatch({type: WALLETREADY, pid});
    setTimeout(()=>dispatch(versionCheckAction()), 1000);
  })
  .catch((err) => {
    console.log(err);
    dispatch({type: DAEMONSTARTED_ERROR_ON_START_WALLET});
  });
};

export const syncDaemon = (startType, credentials) =>
  (dispatch, getState) => {
    const updateBlockCount = () => {
      const { walletLoader: { neededBlocks }} = getState();
      const { daemon: { daemonSynced, timeStart, blockStart } } = getState();
      // check to see if user skipped;
      if (daemonSynced) return;
      return daemon
        .getBlockCount(startType, credentials)
        .then(updateCurrentBlockCount => {
          if (updateCurrentBlockCount >= neededBlocks) {
            dispatch({type: DAEMONSYNCED});
            dispatch(startWallet());
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
