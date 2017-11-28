import { showCheck } from "helpers";
import "style/Modals.less";

const Modal = ({children, className}) => (<Aux>
  <div className="app-modal-overlay"></div>
  <div className={"app-modal " + (className||"")}>
    {children}
  </div>
</Aux>);

export default showCheck(Modal);
