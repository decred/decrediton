import MenuLink from "./MenuLink";
import { routing, theming, newProposalCounts } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { spring, Motion } from "react-motion";
import theme from "theme";

const linkList = [
  { path: "/home",          link: <T id="sidebar.link.home" m="Overview" />,             icon:"overview" },
  { path: "/transactions",  link: <T id="sidebar.link.transactions" m="Transactions" />, icon:"transactions" },
  { path: "/governance",    link: <T id="sidebar.link.governance" m="Governance" />,     icon:"governance",      notifProp: "newProposalsStartedVoting" },
  { path: "/tickets",       link: <T id="sidebar.link.tickets" m="Tickets" /> ,          icon:"tickets" },
  { path: "/accounts",      link: <T id="sidebar.link.accounts" m="Accounts" />,         icon:"accounts" },
  { path: "/security",      link: <T id="activesidebar.link.security" m="Security" />,   icon:"securitycntr" },
  { path: "/help",          link: <T id="sidebar.link.help" m="Help" />,                 icon:"help" },
  { path: "/settings",      link: <T id="sidebar.link.settings" m="Settings" />,         icon:"settings" },
];

@autobind
class MenuLinks extends React.Component {

  _nodes = new Map();
  state = { top: 0, selectedTab: null };

  constructor (props) {
    super(props);

    this.links = [ ...linkList ];
    if (props.isTrezor) {
      this.links.push({ path: "/trezor", link: <T id="sidebar.link.trezor" m="Trezor Setup" />, icon:"trezor" });
    }
  }

  componentDidMount() {
    this.updateCaretPosition();
  }

  componentDidUpdate() {
    const { location } = this.props;
    const tabbedPageCheck = location.pathname.indexOf("/", 1);
    const selectedTab = tabbedPageCheck > 0 ? location.pathname.substring(0, tabbedPageCheck) : location.pathname;
    if (this.state.selectedTab != selectedTab) {
      this.updateCaretPosition();
    }
  }

  updateCaretPosition() {
    const { location } = this.props;
    const tabbedPageCheck = location.pathname.indexOf("/", 1);
    const selectedTab = tabbedPageCheck > 0 ? location.pathname.substring(0, tabbedPageCheck) : location.pathname;
    const caretPosition = this.neededCaretPosition(selectedTab);
    if (caretPosition) this.setState({ ...caretPosition, selectedTab });
  }

  neededCaretPosition(path) {
    const tabForRoute = this._nodes.get(path);
    if (!tabForRoute) return null;
    const newTop = tabForRoute.offsetTop;
    return { top: spring(newTop, theme("springs.sideBar")) };
  }

  getAnimatedCaret() {
    return (
      <Motion style={ { top: this.state.top } }>
        { style => <div className="menu-caret" {...{ style }}/> }
      </Motion>
    );
  }

  getStaticCaret() {
    return <div className="menu-caret" style={ { top: this.state.top.val } } />;
  }

  getMenuLink(linkItem) {
    const { path, link, icon, notifProp } = linkItem;
    const hasNotif = notifProp ? this.props[notifProp] : false;

    return (
      <MenuLink
        icon={ icon }
        to={ path }
        key={ path }
        hasNotification={ hasNotif }
        linkRef={ ref => this._nodes.set(path, ref) }
      >
        {link}
      </MenuLink>
    );
  }

  render () {
    const caret = this.props.uiAnimations ? this.getAnimatedCaret() : this.getStaticCaret();

    return (
      <Aux>
        {this.links.map(link => this.getMenuLink(link))}
        {caret}
      </Aux>
    );
  }
}

export default routing(theming(newProposalCounts(MenuLinks)));
