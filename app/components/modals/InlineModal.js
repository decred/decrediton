import { showCheck, eventOutsideElement } from "helpers";
import { modal } from "connectors";
import EventListener from "react-event-listener";
import "style/Modals.less";

@autobind
class InlineModal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.modalShown();
  }

  componentWillUnmount() {
    this.props.modalHidden();
  }

  mouseUp(event) {
    const el = document.getElementById("modal-portal");
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
    const { children, className, expandSideBar, showingSidebarMenu } = this.props;
    return (
      <EventListener target="document" onMouseUp={this.mouseUp} onKeyDown={this.onKeyDown}>
        <div className={showingSidebarMenu ? expandSideBar ? "app-modal-overlay" : "app-modal-overlay-reduced-bar" : "app-modal-overlay-standalone"}></div>
        <div className={(showingSidebarMenu ? expandSideBar ? "app-modal " : "app-modal-reduced-bar " : "app-modal-standalone ") + (className||"")}>
          {children}
        </div>
      </EventListener>
    );
  }
}

export default showCheck(modal(Modal));
