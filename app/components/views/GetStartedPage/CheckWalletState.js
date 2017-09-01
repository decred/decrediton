import React from "react";
import Header from "../../Header";
import ShowError from "../../ShowError";
import "../../../style/GetStarted.less";

export const CheckWalletStateHeader = () => (
  <Header
    getStarted
    headerTitleOverview="Setting up Decrediton"
    headerMetaOverview="Checking wallet state" />
);

export const CheckWalletStateBody = ({
  startupError
}) => (
  startupError ? (
    <div className="get-started-content-new-seed">
      <ShowError className="get-started-error" error={startupError} />
    </div>
  ) : null
);
