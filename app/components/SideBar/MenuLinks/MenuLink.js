import { NavLink as Link } from "react-router-dom";

const MenuLink = ({ linkRef, ...props }) => (
  <div ref={ linkRef }>
    <Link className="menu-link" activeClassName="menu-link-active" { ...props } />
  </div>
);

export default MenuLink;
