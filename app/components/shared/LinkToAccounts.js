import { Tooltip } from "pi-ui";
import { Link } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import "style/MiscComponents.less";

const LinkToAccounts = () => (
  <Tooltip content={<T id="accountsButton.tip" m="Accounts" />}>
    <Link to="/accounts" className="accounts-button-icon" />
  </Tooltip>
);

export default LinkToAccounts;
