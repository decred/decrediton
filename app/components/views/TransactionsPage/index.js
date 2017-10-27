// @flow
import Header from "./Header";
import { RouteTransition, Aux } from "shared";

const mapStyles = styles => ({ left: styles.left + "%" });

const enterLeft = { atEnter: { left: -100 }, atActive: { left: 0 }, atLeave: { left: 100 }, mapStyles };
const enterRight = { atEnter: { left: 100 }, atActive: { left: 0 }, atLeave: { left: -100 }, mapStyles };
const opts = { stiffness: 150, damping: 20 };

const wrapperComponent = props => <div className="tab-content" { ...props } />;

const Transactions = ({ children, location }) => {
  const tabs = ["send", "receive"];
  const page = "transactions";
  // this will be removed w/ react router 4
  const pathname = location.pathname.split("/")[2];
  const effect = pathname === "send" ? enterLeft : enterRight;
  return (
    <Aux>
      <Header {...{ tabs, page, pathname }}/>
      <RouteTransition className="tabbed-page" {...{ wrapperComponent, opts, pathname, ...effect }}>
        { children }
      </RouteTransition>
    </Aux>
  );
};

Transactions.propTypes = { location: PropTypes.object.isRequired };

export default Transactions;
