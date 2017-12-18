import Header from "./DefaultHeader";
import { ShowError } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

export const CheckWalletStateHeader = () => (
  <Header
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
