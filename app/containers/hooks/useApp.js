import { useState, useEffect, useCallback } from "react";
import { useMountEffect } from "hooks";
import { useSelector, useDispatch } from "react-redux";
import { wallet } from "wallet-preload-shim";
import { useVSP } from "hooks";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";
import * as cla from "actions/ClientActions";
import * as ca from "actions/ControlActions";
import * as sba from "actions/SidebarActions";

// minimum size to reduce the sidebar in px.
const MINIMUM_SIZE_TO_REDUCE_SIDEBAR = 1179;
// minimum size to sidebar goes to bottom in px.
const MINIMUM_SIZE_BOTTOM_SIDEBAR = 768;

const useApp = () => {
  const dispatch = useDispatch();

  const decreditonInit = () => dispatch(da.decreditonInit());
  const shutdownApp = useCallback(() => dispatch(da.shutdownApp()), [dispatch]);
  const listenForAppReloadRequest = (cb) =>
    dispatch(cla.listenForAppReloadRequest(cb));
  const showAboutModalMacOS = useCallback(
    () => dispatch(ca.showAboutModalMacOS()),
    [dispatch]
  );
  const hideAboutModalMacOS = () => dispatch(ca.hideAboutModalMacOS());
  const showCantCloseModal = useCallback(
    () => dispatch(ca.showCantCloseModal()),
    [dispatch]
  );
  const onExpandSideBar = () => dispatch(sba.expandSideBar());
  const onReduceSideBar = () => dispatch(sba.reduceSideBar());
  const onSidebarToBottom = () => dispatch(sba.sidebarToBottom());
  const onSidebarLeaveBottom = () => dispatch(sba.onSidebarLeaveBottom());

  const locale = useSelector(sel.locale);
  const window = useSelector(sel.mainWindow);
  const aboutModalMacOSVisible = useSelector(sel.aboutModalMacOSVisible);
  const modalVisible = useSelector(sel.modalVisible);
  const { hasTicketFeeError } = useVSP();
  const runningIndicator = useSelector(sel.getRunningIndicator);
  const canClose = !(runningIndicator || hasTicketFeeError);
  const theme = useSelector(sel.theme);

  const [isWaiting, setIsWaiting] = useState(false);
  const [stateCanClose, setCanClose] = useState(canClose);
  const [stateModalVisible, setModalVisible] = useState(modalVisible);

  const onClick = (event) => {
    const target = event.target;
    if (target.localName !== "a") return;
    const href = target.attributes.href ? target.attributes.href.value : "";
    if (href === "") {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  };

  // Prevent middle click from opening new electron window
  const onAuxClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    return false;
  };

  const updateWindowDimensions = () => {
    if (isWaiting) {
      return;
    }
    const updateWindow = () => {
      setIsWaiting(false);
      if (window.innerWidth <= MINIMUM_SIZE_BOTTOM_SIDEBAR) {
        onSidebarToBottom();
      } else if (window.innerWidth <= MINIMUM_SIZE_TO_REDUCE_SIDEBAR) {
        onSidebarLeaveBottom();
        onReduceSideBar();
      } else {
        onSidebarLeaveBottom();
        onExpandSideBar();
      }
    };
    setIsWaiting(true);
    setTimeout(updateWindow, 200);
  };

  const onReloadRequested = () => {
    wallet.log("info", "Main app received reload UI request");
    wallet.requestUIReload();
  };

  const setCanCloseCheck = useCallback(
    (canClose) => {
      wallet.onCheckCanClose(() => {
        if (canClose) {
          shutdownApp();
        } else {
          wallet.log("warn", "A process is still running, preventing shutdown");
          showCantCloseModal();
        }
      });
    },
    [shutdownApp, showCantCloseModal]
  );

  const setModalVisibleCheck = useCallback(
    (modalVisible) => {
      wallet.onShowAboutModal(() => {
        // Ignore click if a modal is already shown
        if (modalVisible == false) {
          showAboutModalMacOS();
        }
      });
    },
    [showAboutModalMacOS]
  );

  useMountEffect(() => {
    window.addEventListener("click", onClick);
    window.addEventListener("auxclick", onAuxClick);
    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();
    decreditonInit();
    listenForAppReloadRequest(onReloadRequested);
    setCanCloseCheck(stateCanClose);
    setModalVisibleCheck(stateModalVisible);
    wallet.log("info", "Main app container mounted");
  });

  // Updates can close check if given canClose value updated.
  useEffect(() => {
    if (canClose !== stateCanClose) {
      setCanCloseCheck(canClose);
      setCanClose(canClose);
    }
  }, [canClose, stateCanClose, setCanCloseCheck, setCanClose, shutdownApp]);

  // Updates modal visible check if given modalVisible updated.
  useEffect(() => {
    if (modalVisible !== stateModalVisible) {
      setModalVisibleCheck(modalVisible);
      setModalVisible(modalVisible);
    }
  }, [modalVisible, stateModalVisible, setModalVisibleCheck, setModalVisible]);

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
