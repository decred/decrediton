import React from "react";
import Header from "../../Header";
import { FormattedMessage } from "react-intl";
import "../../../style/GetStarted.less";

const FinalStartUpHeader = () => (
  <Header
    getStarted
    headerTitleOverview={<FormattedMessage id="getStarted.header.title" defaultMessage="Setting up Decrediton" />}
    headerMetaOverview={<FormattedMessage id="getStarted.header.finalizingSetup.meta" defaultMessage="Finalizing setup" />} />
);

const FinalStartUpBody = () => (
  null
);

export { FinalStartUpHeader, FinalStartUpBody };
