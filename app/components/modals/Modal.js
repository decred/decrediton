import { showCheck, eventOutsideElement } from "helpers";
import ReactDOM from "react-dom";
import EventListener from "react-event-listener";
import "style/Modals.less";
import Draggable from "react-draggable";
import cx from "classnames";
import { useRef } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";

function Modal(props) {
  const expandSideBar = useSelector(sel.expandSideBar);
  const showingSidebarMenu = useSelector(sel.showingSidebarMenu);
  const { children, className, draggable } = props;
  const domNode = document.getElementById("modal-portal");
  const modalRef = useRef(null)

  function mouseUp(event) {
    const el = modalRef.current;
    if (eventOutsideElement(el, event.target)) {
      props.onCancelModal && props.onCancelModal();
    }
  }
  
  function onKeyDown(event) {
    // 27: ESC key
    if (event.keyCode === 27) {
      props.onCancelModal && props.onCancelModal();
    }
  }


  const innerView = <div ref={modalRef} className={cx((showingSidebarMenu ? expandSideBar ? "app-modal " : "app-modal-reduced-bar " : "app-modal-standalone "), className && className, draggable && " draggable-modal ")}>
    {children}
  </div>;

  return ReactDOM.createPortal(
    <EventListener target="document" onMouseUp={mouseUp} onKeyDown={onKeyDown}>
      <div className={showingSidebarMenu ? expandSideBar ? "app-modal-overlay" : "app-modal-overlay-reduced-bar" : "app-modal-overlay-standalone"}>
        {draggable ? <Draggable bounds="parent" cancel=".cancel-dragging">{innerView}</Draggable> : innerView  }
      </div>
    </EventListener>
    , domNode);
}

export default showCheck(Modal);
