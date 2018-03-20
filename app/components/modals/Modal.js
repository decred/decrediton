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
    console.log("component will mount");
    this.props.modalShown();
  }

  componentWillUnmount() {
    console.log("component will unount");
    this.props.modalHidden();
  }

  render() {
    const { children, className } = this.props;
    const domNode = document.getElementById("modal-portal");

    return ReactDOM.createPortal(
      <Aux>
        <div className="app-modal-overlay"></div>
        <div className={"app-modal " + (className||"")}>
          {children}
        </div>
      </Aux>

      , domNode);
  }
}

export default showCheck(modal(Modal));
