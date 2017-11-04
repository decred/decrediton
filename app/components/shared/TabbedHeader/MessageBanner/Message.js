import { kidCheck } from "helpers";
import "style/MessageBanner.less";

const Message = ({ error, onClick, children }) =>
  <div className={ ["notification", error ? "error" : "success"].join("-") }>
    <div className="address-delete-icon" onClick={ onClick } />
    { children }
  </div>;

export default kidCheck(Message);
