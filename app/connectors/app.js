// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as da from "actions/DaemonActions";
import * as ca from "actions/ClientActions";

const mapStateToProps = selectorMap({
  locale: sel.locale,
  window: sel.mainWindow,
  daemonStopped: sel.daemonStopped,
  shutdownRequested: sel.shutdownRequested,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  shutdownApp: da.shutdownApp,
  listenForAppReloadRequest: ca.listenForAppReloadRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
