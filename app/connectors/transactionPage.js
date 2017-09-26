import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = () => {
  return selectorMap({
    walletService: sel.walletService,
    transactions: sel.transactions,
  });
};

export default connect(mapStateToProps);
