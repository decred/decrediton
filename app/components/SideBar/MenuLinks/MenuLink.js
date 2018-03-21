import { NavLink as Link } from "react-router-dom";

const MenuLink = ({ icon, linkRef, ...props }) => (
  <div ref={ linkRef }>
    <Link className={"menu-link " +icon+"Icon"} activeClassName={"menu-link-active "+icon+"Icon"} { ...props } />
  </div>
);

export default MenuLink;
