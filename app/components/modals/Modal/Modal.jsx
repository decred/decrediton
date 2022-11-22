import { showCheck } from "helpers";
import ReactDOM from "react-dom";
import EventListener from "react-event-listener";
import Draggable from "react-draggable";
import { classNames } from "pi-ui";
import styles from "./Modal.module.css";
import { useModal } from "./hooks";

const Modal = showCheck(({ children, className, draggable, onCancelModal }) => {
  const { showingSidebarMenu, expandSideBar, mouseUp, onKeyDown, modalRef } =
    useModal(onCancelModal);

  const domNode = document.getElementById("modal-portal");
  if (!domNode) return null; // modal-portal not mounted yet.

  const innerView = (
    <div
      ref={modalRef}
      className={classNames(
        showingSidebarMenu
          ? expandSideBar
            ? styles.modal
            : styles.reducedBar
          : styles.standalone,
        className,
        draggable && styles.draggable
      )}>
      {children}
    </div>
  );

  return ReactDOM.createPortal(
    <EventListener target="document" onMouseUp={mouseUp} onKeyDown={onKeyDown}>
      <div
        className={
          showingSidebarMenu
            ? expandSideBar
              ? styles.overlay
              : styles.overlayReducedBar
            : styles.overlayStandalone
        }>
        {draggable ? (
          <Draggable bounds="parent" cancel=".cancel-dragging">
            {innerView}
          </Draggable>
        ) : (
          innerView
        )}
      </div>
    </EventListener>,
    domNode
  );
});

export default Modal;
