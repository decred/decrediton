// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  walletReady: sel.getWalletReady,
  isDaemonRemote: sel.isDaemonRemote,
  isDaemonStarted: sel.getDaemonStarted,
  lnActive: sel.lnActive,
  lnStartAttempt: sel.lnStartAttempt
});

export default connect(mapStateToProps);
