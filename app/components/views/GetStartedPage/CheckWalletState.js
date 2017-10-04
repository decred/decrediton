import React from "react";
import Header from "../../Header";
import ShowError from "../../ShowError";
import { FormattedMessage as T } from "react-intl";
import "../../../style/GetStarted.less";

export const CheckWalletStateHeader = () => (
  <Header
    getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerMetaOverview={<T id="getStarted.header.checkingWalletState.meta" m="Checking wallet state" />} />
);

export const CheckWalletStateBody = ({
  startupError
}) => (
  startupError ? (
    <div className="get-started-content-new-seed page-content">
      <ShowError className="get-started-error" error={startupError} />
    </div>
  ) : null
);
