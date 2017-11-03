import { kidCheck } from "helpers";

const Message = ({ error, onClick, children }) =>
  <div className={ ["account-view-notification", error ? "error" : "success"].join("-") }>
    <div className="account-nest-address-delete-icon" onClick={ onClick } />
    { children }
  </div>;

export default kidCheck(Message);
