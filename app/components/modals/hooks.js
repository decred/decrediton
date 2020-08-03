import { eventOutsideElement } from "helpers";
import { useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useModal(onCancelModal) {
  const expandSideBar = useSelector(sel.expandSideBar);
  const showingSidebarMenu = useSelector(sel.showingSidebarMenu);
  const modalRef = useRef(null);

  const mouseUp = useCallback((event) => {
    const el = modalRef.current;
    if (eventOutsideElement(el, event.target)) {
      onCancelModal && onCancelModal();
    }
  }, [onCancelModal]);

  const onKeyDown = useCallback((event) => {
    // 27: ESC key
    if (event.keyCode === 27) {
      onCancelModal && onCancelModal();
    }
  }, [onCancelModal]);

  return {
    showingSidebarMenu,
    expandSideBar,
    mouseUp,
    onKeyDown,
    modalRef
  };
}

export function useAddMixerAccountsModal(show, setMixedAccountName, setChangeAccountName) {
  useEffect(() => {
    setMixedAccountName("");
    setChangeAccountName("");
  }, [show, setMixedAccountName, setChangeAccountName]);
}
