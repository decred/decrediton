import { showCheck } from "helpers";
import ReactDOM from "react-dom";
import EventListener from "react-event-listener";
import Draggable from "react-draggable";
import { classNames } from "pi-ui";
import style from "./Modals.module.css";
import { useModal } from "./hooks";

const Modal = showCheck(({ children, className, draggable, onCancelModal }) => {
  const {
    showingSidebarMenu,
    expandSideBar,
    mouseUp,
    onKeyDown,
    modalRef
  } = useModal(onCancelModal);

  const domNode = document.getElementById("modal-portal");

  const innerView = (
    <div
      ref={modalRef}
      className={classNames(
        showingSidebarMenu
          ? expandSideBar
            ? style.modal
            : style.reducedBar
          : style.standalone,
        className,
        draggable && style.draggable
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
              ? style.overlay
              : style.overlayReducedBar
            : style.overlayStandalone
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
