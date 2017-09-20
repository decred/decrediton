import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  ticketBuyerService: sel.ticketBuyerService,
  isMainNet: sel.isMainNet,
  isTestNet: sel.isTestNet
});

export default connect(mapStateToProps);
