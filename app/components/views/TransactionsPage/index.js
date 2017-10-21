// @flow
import Header from "./Header";
import { RouteTransition } from "shared";

const enterLeft = { atEnter: { offset: -100 }, atActive: { offset: 0 }, atLeave: { offset: 100 }, mapStyles: (styles) => ({ transform: `translateX(${styles.offset}%)` })};
const enterRight = { atEnter: { offset: 100 }, atActive: { offset: 0 }, atLeave: { offset: -100 }, mapStyles: (styles) => ({ transform: `translateX(${styles.offset}%)` })};
const opts = { stiffness: 150, damping: 20 };

const Transactions = ({ children, location }) => {
  const tabs = ["send", "receive"];
  const page = "transactions";
  // this will be removed w/ react router 4
  const pathname = location.pathname.split("/")[2];
  const effect = pathname === "send" ? enterLeft : enterRight;
  return (
    <div className="page-view">
      <Header {...{ tabs, page, pathname }}/>
      <div className="tabbedpage-content">
      <RouteTransition {...{ opts, pathname, ...effect }}>
        { children }
      </RouteTransition>
      </div>
    </div>
  );
};

Transactions.propTypes = { location: PropTypes.object.isRequired };

export default Transactions;
