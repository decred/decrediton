import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { walletService, ticketBuyerService, isMainNet, isTestNet } from "../selectors";

const mapStateToProps = selectorMap({
  walletService,
  ticketBuyerService,
  isMainNet,
  isTestNet
});

export default connect(mapStateToProps);
