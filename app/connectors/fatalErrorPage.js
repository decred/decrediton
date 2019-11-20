import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as da from "../actions/DaemonActions";

const mapStateToProps = selectorMap({
  daemonError: sel.daemonError,
  walletError: sel.walletError,
  isAdvancedDaemon: sel.isAdvancedDaemon
});

const mapDispatchToProps = dispatch => bindActionCreators({
  shutdownApp: da.shutdownApp,
  deleteDaemonData: da.deleteDaemonData,
  backToCredentials: da.backToCredentials
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
