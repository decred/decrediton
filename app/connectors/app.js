// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as da from "actions/DaemonActions";
import * as cla from "actions/ClientActions";
import * as ca from "actions/ControlActions";

const mapStateToProps = selectorMap({
  locale: sel.locale,
  window: sel.mainWindow,
  daemonStopped: sel.daemonStopped,
  shutdownRequested: sel.shutdownRequested,
  aboutModalMacOSVisible: sel.aboutModalMacOSVisible,
  modalVisible: sel.modalVisible,
  theme: sel.theme,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  shutdownApp: da.shutdownApp,
  listenForAppReloadRequest: cla.listenForAppReloadRequest,
  showAboutModalMacOS: ca.showAboutModalMacOS,
  hideAboutModalMacOS: ca.hideAboutModalMacOS
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
