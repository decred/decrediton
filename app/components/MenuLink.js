// @flow
import React from "react";
import { Link } from "react-router";

class MenuLink extends React.Component {
  render() {
    return (
      <Link to={this.props.to} className="menu-navigation-link" activeClassName="menu-navigation-link-active">
        {this.props.children}
      </Link>
    );
  }
}

export default MenuLink;
