import { NavLink as Link } from "react-router-dom";

const MenuLinkIcon = ({ icon, linkRef, ...props }) => (
  <div ref={ linkRef }>
    <Link className={"menu-link-icon "+icon} activeClassName={"menu-link-icon active "+icon} { ...props } />
  </div>
);

export default MenuLinkIcon;
