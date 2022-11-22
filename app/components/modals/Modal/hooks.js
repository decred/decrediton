import { useMountEffect } from "hooks";
import { eventOutsideElement } from "helpers";
import { useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import { modalVisible, modalHidden } from "actions/ControlActions";

export function useModal(onCancelModal) {
  const expandSideBar = useSelector(sel.expandSideBar);
  const showingSidebarMenu = useSelector(sel.showingSidebarMenu);
  const modalRef = useRef(null);

  const dispatch = useDispatch();
  const onModalVisible = useCallback(
    () => dispatch(modalVisible()),
    [dispatch]
  );
  const onModalHidden = useCallback(() => dispatch(modalHidden()), [dispatch]);

  // This switches modalVisible redux switch on when modal mount
  // and switches it off when modal is unmounted.
  useMountEffect(() => {
    onModalVisible();

    return () => onModalHidden();
  });

  const mouseUp = useCallback(
    (event) => {
      event.stopImmediatePropagation();
      const el = modalRef.current;
      if (eventOutsideElement(el, event.target)) {
        onCancelModal?.();
      }
    },
    [onCancelModal]
  );

  const onKeyDown = useCallback(
    (event) => {
      // 27: ESC key
      if (event.keyCode === 27) {
        onCancelModal?.();
      }
    },
    [onCancelModal]
  );

  return {
    showingSidebarMenu,
    expandSideBar,
    mouseUp,
    onKeyDown,
    modalRef
  };
}
