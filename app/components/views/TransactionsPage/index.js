// @flow
import { RouteTransition, TabbedHeader } from "shared";
import { transactions } from "connectors";
import theme from "theme";

const mapStyles = styles => ({ left: styles.left + "%" });

const enterLeft = { atEnter: { left: -100 }, atActive: { left: 0 }, atLeave: { left: 100 }, mapStyles };
const enterRight = { atEnter: { left: 100 }, atActive: { left: 0 }, atLeave: { left: -100 }, mapStyles };

const wrapperComponent = props => <div className="tab-content" { ...props } />;

const Transactions = ({ children, location, isTestNet }) => {
  // this will be removed w/ react router 4
  const pathname = location.pathname.split("/")[2];
  const effect = pathname === "send" ? enterLeft : enterRight;
  return (
    <Aux>
      <TabbedHeader testNet {...{ isTestNet }}/>
      <RouteTransition className="tabbed-page" opts={ theme("springs.tab") } {...{ wrapperComponent, pathname, ...effect }}>
        { children }
      </RouteTransition>
    </Aux>
  );
};

Transactions.propTypes = { location: PropTypes.object.isRequired };

export default transactions(Transactions);
