// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as da from "actions/DaemonActions";
import * as cla from "actions/ClientActions";
import * as ca from "actions/ControlActions";
import * as sba from "actions/SidebarActions";

const mapStateToProps = selectorMap({
  locale: sel.locale,
  window: sel.mainWindow,
  daemonStopped: sel.daemonStopped,
  shutdownRequested: sel.shutdownRequested,
  aboutModalMacOSVisible: sel.aboutModalMacOSVisible,
  modalVisible: sel.modalVisible,
  canClose: sel.getCanClose,
  theme: sel.theme
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      decreditonInit: da.decreditonInit,
      shutdownApp: da.shutdownApp,
      listenForAppReloadRequest: cla.listenForAppReloadRequest,
      showAboutModalMacOS: ca.showAboutModalMacOS,
      hideAboutModalMacOS: ca.hideAboutModalMacOS,
      showCantCloseModal: ca.showCantCloseModal,
      onExpandSideBar: sba.expandSideBar,
      onReduceSideBar: sba.reduceSideBar,
      onSidebarToBottom: sba.sidebarToBottom,
      onSidebarLeaveBottom: sba.onSidebarLeaveBottom
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
