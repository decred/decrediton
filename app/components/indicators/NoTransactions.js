import { FormattedMessage as T } from "react-intl";

export default () => (
  <div className="no-transactions-indicator">
    <T id="noTransactions.description" m="No Transactions Found" />
    <br />
    <div className="no-transactions-indicator-img">
    </div>
  </div>
);
