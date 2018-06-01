import { showCheck } from "helpers";
import ReactDOM from "react-dom";
import { modal } from "connectors";
import EventListener from "react-event-listener";
import ownerDocument from "dom-helpers/ownerDocument";
import "style/Modals.less";

const isDescendant = (el, target) => {
  if (target !== null && target.parentNode) {
    return el === target || isDescendant(el, target.parentNode);
  }
  return false;
};

@autobind
class Modal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.modalShown();
  }

  componentWillUnmount() {
    this.props.modalHidden();
  }
  mouseUp(event) {
    console.log("mouse up");

    const el = document.getElementById("modal-portal");
    const doc = ownerDocument(el);

    if (
      doc.documentElement &&
      doc.documentElement.contains(event.target) &&
      !isDescendant(el, event.target)
    ) {
      console.log("gonna cancel due to click");
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
