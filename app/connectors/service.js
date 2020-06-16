import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

// custom hook already used in some places src/hooks/useService
// TODO: delete when fully migrated

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  ticketBuyerService: sel.ticketBuyerService,
  isMainNet: sel.isMainNet,
  isTestNet: sel.isTestNet
});

export default connect(mapStateToProps);
