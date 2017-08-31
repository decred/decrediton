import React from "react";
import Page from "./Page";
import { CheckWalletStateHeader, CheckWalletStateBody } from "./CheckWalletState";
import { OpenWalletHeader, OpenWalletBody } from "./OpenWallet";
import { StartRPCHeader, StartRPCBody } from "./StartRPC";
import { DiscoverAddressesHeader, DiscoverAddressesBody } from "./DiscoverAddresses";
import { FetchBlockHeadersHeader, FetchBlockHeadersBody } from "./FetchBlockHeaders";
import { FinalStartUpHeader, FinalStartUpBody } from "./FinalStartUp";
import { DaemonLoadingHeader, DaemonLoadingBody } from "./DaemonLoading";

const GetStartedPage = ({
  startStepIndex,
  walletReady,
  daemonStarted,
  daemonSynced,
  ...props
}) => {
  let Header, Body;
  if (daemonStarted && daemonSynced && walletReady) {
    switch(startStepIndex || 0) {
    case 0:
    case 1:
      Header = CheckWalletStateHeader;
      Body = CheckWalletStateBody;
      break;
    case 2:
      Header = OpenWalletHeader;
      Body = OpenWalletBody;
      break;
    case 3:
    case 4:
      Header = StartRPCHeader;
      Body = StartRPCBody;
      break;
    case 5:
      Header = DiscoverAddressesHeader;
      Body = DiscoverAddressesBody;
      break;
    case 6:
      Header = FetchBlockHeadersHeader;
      Body = FetchBlockHeadersBody;
      break;
    default:
      Header = FinalStartUpHeader;
      Body = FinalStartUpBody;
    }
  } else {
    Header = DaemonLoadingHeader;
    Body = DaemonLoadingBody;
  }

  return <Page Header={Header} Body={Body} {...props} />;
};

export default GetStartedPage;
