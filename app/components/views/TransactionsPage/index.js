// @flow
import { RouteTransition, TabbedHeader } from "shared";
import { injectIntl } from "react-intl";
import { transactions } from "connectors";
import theme from "theme";
import messages from "messages";

const mapStyles = styles => ({ left: styles.left + "%" });

const enterLeft = { atEnter: { left: -100 }, atActive: { left: 0 }, atLeave: { left: 100 }, mapStyles };
const enterRight = { atEnter: { left: 100 }, atActive: { left: 0 }, atLeave: { left: -100 }, mapStyles };

const wrapperComponent = props => <div className="tab-content" { ...props } />;

const Transactions = ({ children, location, intl, isTestNet }) => {
  // this will be removed w/ react router 4
  const pathname = location.pathname.split("/")[2];
  const effect = pathname === "send" ? enterLeft : enterRight;
  const description = ["transactions", "description", isTestNet ? "testnet" : "mainnet"].join(".");
  return (
    <Aux>
      <TabbedHeader>
        { intl.formatMessage(messages[description]) }
      </TabbedHeader>
      <RouteTransition className="tabbed-page" opts={ theme("springs.tab") } {...{ wrapperComponent, pathname, ...effect }}>
        { children }
      </RouteTransition>
    </Aux>
  );
};

Transactions.propTypes = { location: PropTypes.object.isRequired };

export default transactions(injectIntl(Transactions));
