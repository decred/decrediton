import { Link } from "react-router";

class MenuLink extends React.Component {
  constructor(props) { super(props); }
  render() {
    return <Link className="menu-link" activeClassName="menu-link-active" { ...this.props }/>;
  }
}

export default MenuLink;
