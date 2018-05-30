import { showCheck } from "helpers";
import ReactDOM from "react-dom";
import { modal } from "connectors";
import "style/Modals.less";

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

  render() {
    const { children, className, expandSideBar, showingSidebarMenu } = this.props;
    const domNode = document.getElementById("modal-portal");

    return ReactDOM.createPortal(
      <Aux>
        <div className={showingSidebarMenu ? expandSideBar ? "app-modal-overlay" : "app-modal-overlay-reduced-bar" : "app-modal-overlay-standalone"}></div>
        <div className={(showingSidebarMenu ? expandSideBar ? "app-modal " : "app-modal-reduced-bar " : "app-modal-standalone ") + (className||"")}>
          {children}
        </div>
      </Aux>

      , domNode);
  }
}

export default showCheck(modal(Modal));
