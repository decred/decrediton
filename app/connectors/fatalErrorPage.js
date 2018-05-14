import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as da from "../actions/DaemonActions";

const mapStateToProps = selectorMap({
  daemonError: sel.daemonError,
  walletError: sel.walletError,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  shutdownApp: da.shutdownApp,
  deleteDaemonData: da.deleteDaemonData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
