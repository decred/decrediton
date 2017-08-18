import React from "react";
import ShowError from "../../ShowError";
import Page from "./Page";
import CheckWalletState from "./CheckWalletState";
import OpenWallet from "./OpenWallet";
import StartRPC from "./StartRPC";
import DiscoverAddresses from "./DiscoverAddresses";
import FetchBlockHeaders from "./FetchBlockHeaders";
import FinalStartUp from "./FinalStartUp";

const GetStartedPage = ({
  startStepIndex,
  versionInvalidError,
  ...props
}) => {
  const Step =
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
