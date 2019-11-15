
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";

const createWalletHeader = ({ onBack }) => (
  <div className="content-title-wrapper is-row">
    <div className="content-title">
      <T id="createWallet.title" m={"Create a new wallet"}/>
    </div>
    {onBack && <Tooltip text={<T id="createWallet.goBack" m="Go back" />}><div className="go-back-screen-button" onClick={ onBack } /></Tooltip>}
  </div>);

export default createWalletHeader;
