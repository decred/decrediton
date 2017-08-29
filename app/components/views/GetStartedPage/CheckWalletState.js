import React from "react";
import Header from "../../Header";
import ShowError from "../../ShowError";
import "../../../style/GetStarted.less";

export const CheckWalletStateHeader = () => (
  <Header getStarted headerTitleOverview="Setting up Decrediton" headerMetaOverview="Checking wallet state" />
);

export const CheckWalletStateBody = ({
  isProcessing,
  getLoaderError,
  getVersionServiceError
}) => (
  isProcessing ? null : (
    <div className="get-started-content-nest">
      <ShowError error={getLoaderError} />
      <ShowError error={getVersionServiceError}/>
    </div>
  )
);
