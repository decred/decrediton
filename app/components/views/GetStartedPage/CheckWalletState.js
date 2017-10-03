import React from "react";
import Header from "../../Header";
import ShowError from "../../ShowError";
import { FormattedMessage } from "react-intl";
import "../../../style/GetStarted.less";

export const CheckWalletStateHeader = () => (
  <Header
    getStarted
    headerTitleOverview={<FormattedMessage id="getStarted.header.title" defaultMessage="Setting up Decrediton" />}
    headerMetaOverview={<FormattedMessage id="getStarted.header.checkingWalletState.meta" defaultMessage="Checking wallet state" />} />
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
