import { NavLink as Link } from "react-router-dom";

const MenuLink = ({ icon, linkRef, hasNotification, ...props }) => (
  <div ref={ linkRef }>
    { hasNotification ? <span className="sidebar-menu-link-notification-icon"></span> : null}
    <Link className={"menu-link " +icon+"Icon"} activeClassName={"menu-link-active "+icon+"Icon"} { ...props } />
  </div>
);

export default MenuLink;
