import { Link } from "react-router";

const MenuLink = ({ linkRef, ...props }) => (
  <div ref={ linkRef }>
    <Link className="menu-link" activeClassName="menu-link-active" { ...props } />
  </div>
);

export default MenuLink;
