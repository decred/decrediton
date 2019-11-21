import { showCheck, eventOutsideElement } from "helpers";
import ReactDOM from "react-dom";
import { modal } from "connectors";
import EventListener from "react-event-listener";
import "style/Modals.less";
import Draggable from "react-draggable";
import cx from "classnames";

@autobind
class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    this.props.modalShown();
  }

  componentWillUnmount() {
    this.props.modalHidden();
  }

  mouseUp(event) {
    const el = this.modalRef.current;
    if (eventOutsideElement(el, event.target)) {
      this.props.onCancelModal && this.props.onCancelModal();
    }
  }

  onKeyDown(event) {
    // 27: ESC key
    if (event.keyCode === 27) {
      this.props.onCancelModal && this.props.onCancelModal();
    }
  }

  render() {
    const { children, className, expandSideBar, showingSidebarMenu, draggable } = this.props;
    const domNode = document.getElementById("modal-portal");

    const innerView = <div ref={this.modalRef} className={cx((showingSidebarMenu ? expandSideBar ? "app-modal " : "app-modal-reduced-bar " : "app-modal-standalone "), className && className, draggable && " draggable-modal ")}>
      {children}
    </div>;

    return ReactDOM.createPortal(
      <EventListener target="document" onMouseUp={this.mouseUp} onKeyDown={this.onKeyDown}>
        <div className={showingSidebarMenu ? expandSideBar ? "app-modal-overlay" : "app-modal-overlay-reduced-bar" : "app-modal-overlay-standalone"}>
          {draggable ? <Draggable bounds="parent" cancel=".cancel-dragging">{innerView}</Draggable> : innerView  }
        </div>
      </EventListener>
      , domNode);
  }
}

export default showCheck(modal(Modal));
