import React from "react";
import ShowError from "../../ShowError";
import Page from "./Page";
import { CheckWalletStateHeader, CheckWalletStateBody } from "./CheckWalletState";
import { OpenWalletHeader, OpenWalletBody } from "./OpenWallet";
import { StartRPCHeader, StartRPCBody } from "./StartRPC";
import { DiscoverAddressesHeader, DiscoverAddressesBody } from "./DiscoverAddresses";
import { FetchBlockHeadersHeader, FetchBlockHeadersBody } from "./FetchBlockHeaders";
import { FinalStartUpHeader, FinalStartUpBody } from "./FinalStartUp";

const GetStartedPage = ({
  startStepIndex,
  versionInvalidError,
  ...props
}) => {
  let Header, Body;
  switch(startStepIndex) {
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

  return versionInvalidError
    ? <ShowError error={versionInvalidError} />
    : <Page Header={Header} Body={Body} {...props} />;
};

export default GetStartedPage;
