import MenuLink from "./MenuLink";
import { routing } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { spring, Motion } from "react-motion";
import theme from "theme";

const linkList = [
  { path: "/home/balance",       link: <T id="sidebar.link.home" m="Overview" />,             icon:"overview" },
  { path: "/accounts",           link: <T id="sidebar.link.accounts" m="Accounts" />,         icon:"accounts" },
  { path: "/transactions/send",  link: <T id="sidebar.link.transactions" m="Transactions" />, icon:"transactions" },
  { path: "/tickets/purchase",   link: <T id="sidebar.link.tickets" m="Tickets" /> ,          icon:"tickets" },
  { path: "/security/sign",      link: <T id="activesidebar.link.security" m="Security" />,   icon:"securitycntr" },
  { path: "/settings",           link: <T id="sidebar.link.settings" m="Settings" />,         icon:"settings" },
  { path: "/help/links",         link: <T id="sidebar.link.help" m="Help" />,                 icon:"help" },
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
    if (caretPosition) this.setState({ ...caretPosition, selectedTab });
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
        { linkList.map(({ path, link, icon }) =>
          <MenuLink icon={icon} to={ path } linkRef={ ref => this._nodes.set(path, ref) } key={ path }>
            {link}
          </MenuLink>
        )}
        <Motion style={ { top: this.state.top } }>
          { style => <div className="menu-caret" {...{ style }}/> }
        </Motion>
      </Aux>
    );
  }
}

export default routing(MenuLinks);
