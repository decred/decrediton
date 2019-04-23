
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";

const createWalletHeader = ({ onReturnToWalletSelection }) => (
  <div className="content-tittle-wrapper">
    <Tooltip text={<T id="createWallet.goBack" m="Go back" />}><div className="go-back-screen-button" onClick={onReturnToWalletSelection} /></Tooltip>
    <div className="content-title">
      <T id="createWallet.title" m={"Create a new wallet"}/>
    </div>
  </div>);

export default createWalletHeader;
