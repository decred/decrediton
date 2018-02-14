import MenuLink from "./MenuLink";
import { routing } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { spring, Motion } from "react-motion";
import theme from "theme";

const linkList = [
  {path: "/home",           link: <T id="sidebar.link.home" m="Overview" /> },
  {path: "/accounts",       link: <T id="sidebar.link.accounts" m="Accounts" />},
  {path: "/transactions",   link: <T id="sidebar.link.transactions" m="Transactions" />},
  {path: "/tickets",        link: <T id="sidebar.link.tickets" m="Tickets" />},
  {path: "/security",       link: <T id="sidebar.link.security" m="Security" />},
  {path: "/settings",       link: <T id="sidebar.link.settings" m="Settings" />},
  {path: "/help",           link: <T id="sidebar.link.help" m="Help" />}
];

@autobind
class MenuLinks extends React.Component {

  _nodes = new Map();
  state = { top: 0, selectedTab: null };

  constructor (props) {
    super(props);
  }

  componentDidMount() {
    this.updateCaretPosition();
  }

  componentDidUpdate() {
    const { location } = this.props;
    const selectedTab = location.pathname;
    if (this.state.selectedTab != selectedTab) {
      this.updateCaretPosition();
    }
  }

  updateCaretPosition() {
    const { location } = this.props;
    const selectedTab = location.pathname;
    const caretPosition = this.neededCaretPosition(selectedTab);
    if (caretPosition) this.setState({...caretPosition, selectedTab});
  }

  neededCaretPosition(path) {
    const tabForRoute = this._nodes.get(path);
    if (!tabForRoute) return null;
    const newTop = tabForRoute.offsetTop;
    return { top: spring(newTop, theme("springs.sideBar")) };
  }

  render () {
    return (
      <Aux>
        { linkList.map(({path, link}) =>
          <MenuLink to={ path } linkRef={ ref => this._nodes.set(path, ref) } key={ path }>
            {link}
          </MenuLink> )}
        <Motion style={ {top: this.state.top} }>
          { style => <div className="menu-caret" {...{ style }}/> }
        </Motion>
      </Aux>
    );
  }
}

export default routing(MenuLinks);
