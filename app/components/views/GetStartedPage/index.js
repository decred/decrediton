import React from "react";
import ShowError from "../../ShowError";
import Page from "./Page";
import DaemonLoading from "./DaemonLoading";
import CheckWalletState from "./CheckWalletState";
import OpenWallet from "./OpenWallet";
import StartRPC from "./StartRPC";
import DiscoverAddresses from "./DiscoverAddresses";
import FetchBlockHeaders from "./FetchBlockHeaders";
import FinalStartUp from "./FinalStartUp";

const GetStartedPage = ({
  startStepIndex,
  versionInvalidError,
  daemonStarted,
  daemonSyncing,
  daemonSynced,
  walletReady,
  ...props
}) => {
  const Step =
    (!daemonStarted || !daemonSyncing || !daemonSynced || !walletReady)
     ? DaemonLoading :
    (startStepIndex <= 1)
      ? CheckWalletState :
    (startStepIndex === 2)
      ? OpenWallet :
    (startStepIndex === 3 || startStepIndex === 4)
      ? StartRPC :
    (startStepIndex === 5)
      ? DiscoverAddresses :
    (startStepIndex === 6)
      ? FetchBlockHeaders :
    (startStepIndex >= 7)
      ? FinalStartUp
      : () => <div>something went wrong</div>;

  return versionInvalidError
    ? <ShowError error={versionInvalidError} />
    : <Page><Step {...props} /></Page>;
};

export default GetStartedPage;
