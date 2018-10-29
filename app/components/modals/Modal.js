import { showCheck, eventOutsideElement } from "helpers";
import ReactDOM from "react-dom";
import { modal } from "connectors";
import EventListener from "react-event-listener";
import "style/Modals.less";

@autobind
class Modal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.modalShown();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown, false);
  }

  onKeyDown(event) {
    if (event.keyCode === 27) { // ESC
      this.props.onCancelModal && this.props.onCancelModal();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
    this.props.modalHidden();
  }

  mouseUp(event) {
    const el = document.getElementById("modal-portal");
    if (eventOutsideElement(el, event.target)) {
      this.props.onCancelModal && this.props.onCancelModal();
    }
  }

  render() {
    const { children, className, expandSideBar, showingSidebarMenu } = this.props;
    const domNode = document.getElementById("modal-portal");

    return ReactDOM.createPortal(
      <EventListener target="document" onMouseUp={this.mouseUp}>
        <div className={showingSidebarMenu ? expandSideBar ? "app-modal-overlay" : "app-modal-overlay-reduced-bar" : "app-modal-overlay-standalone"}></div>
        <div className={(showingSidebarMenu ? expandSideBar ? "app-modal " : "app-modal-reduced-bar " : "app-modal-standalone ") + (className||"")}>
          {children}
        </div>
      </EventListener>
      , domNode);
  }
}

export default showCheck(modal(Modal));
