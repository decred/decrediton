import React from "react";
import { Link } from "react-router";

const MenuLink = ({ to, children }) => (
  <Link to={to} className="menu-navigation-link" activeClassName="menu-navigation-link-active">
    {children}
  </Link>
);

export default MenuLink;
