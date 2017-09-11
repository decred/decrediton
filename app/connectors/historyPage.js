import { connect } from "react-redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";

const mapStateToProps = selectorMap({
  ...substruct({
    walletService: null,
    txPerPage: null,
    spendableTotalBalance: null,
    transactions: null
  }, selectors)
});

export default connect(mapStateToProps);
