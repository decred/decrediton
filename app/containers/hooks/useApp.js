import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";
import * as cla from "actions/ClientActions";
import * as ca from "actions/ControlActions";
import * as sba from "actions/SidebarActions";

const useApp = () => {
  const dispatch = useDispatch();

  const decreditonInit = () => dispatch(da.decreditonInit());
  const shutdownApp = () => dispatch(da.shutdownApp());
  const listenForAppReloadRequest = (cb) =>
    dispatch(cla.listenForAppReloadRequest(cb));
  const showAboutModalMacOS = () => dispatch(ca.showAboutModalMacOS());
  const hideAboutModalMacOS = () => dispatch(ca.hideAboutModalMacOS());
  const showCantCloseModal = () => dispatch(ca.showCantCloseModal());
  const onExpandSideBar = () => dispatch(sba.expandSideBar());
  const onReduceSideBar = () => dispatch(sba.reduceSideBar());
  const onSidebarToBottom = () => dispatch(sba.sidebarToBottom());
  const onSidebarLeaveBottom = () => dispatch(sba.onSidebarLeaveBottom());

  const locale = useSelector(sel.locale);
  const window = useSelector(sel.mainWindow);
  const aboutModalMacOSVisible = useSelector(sel.aboutModalMacOSVisible);
  const modalVisible = useSelector(sel.modalVisible);
  const canClose = useSelector(sel.getCanClose);
  const theme = useSelector(sel.theme);

  return {
    decreditonInit,
    shutdownApp,
    listenForAppReloadRequest,
    showAboutModalMacOS,
    hideAboutModalMacOS,
    showCantCloseModal,
    onExpandSideBar,
    onReduceSideBar,
    onSidebarToBottom,
    onSidebarLeaveBottom,
    locale,
    window,
    aboutModalMacOSVisible,
    modalVisible,
    canClose,
    theme
  };
};

export default useApp;
