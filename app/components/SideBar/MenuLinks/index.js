import MenuLink from "./MenuLink";
import { routing, theming, newProposalCounts } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { spring, Motion } from "react-motion";
import theme from "theme";
import navAccountsLoop from "style/animations/navAccountsLoop.json";
import navGovernanceLoop from "style/animations/navGovernanceLoop.json";
import navHelpLoop from "style/animations/navHelpLoop.json";
import navOverviewLoop from "style/animations/navOverviewLoop.json";
import navSecurityLoop from "style/animations/navSecurityLoop.json";
import navSettingsLoop from "style/animations/navSettingsLoop.json";
import navTicketsLoop from "style/animations/navTicketsLoop.json";
import navTransactionsLoop from "style/animations/navTransactionsLoop.json";

const linkList = [
  { path: "/home",          link: <T id="sidebar.link.home" m="Overview" />,             animationData: navOverviewLoop,     icon:"overview" },
  { path: "/transactions",  link: <T id="sidebar.link.transactions" m="Transactions" />, animationData: navTransactionsLoop, icon:"transactions" },
  { path: "/governance",    link: <T id="sidebar.link.governance" m="Governance" />,     animationData: navGovernanceLoop,   icon:"governance",      notifProp: "newProposalsStartedVoting" },
  { path: "/tickets",       link: <T id="sidebar.link.tickets" m="Tickets" /> ,          animationData: navTicketsLoop,      icon:"tickets" },
  { path: "/accounts",      link: <T id="sidebar.link.accounts" m="Accounts" />,         animationData: navAccountsLoop,     icon:"accounts" },
  { path: "/security",      link: <T id="activesidebar.link.security" m="Security" />,   animationData: navSecurityLoop,     icon:"securitycntr" },
  { path: "/help",          link: <T id="sidebar.link.help" m="Help" />,                 animationData: navHelpLoop,         icon:"help" },
  { path: "/settings",      link: <T id="sidebar.link.settings" m="Settings" />,         animationData: navSettingsLoop,     icon:"settings" },
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
    const { path, link, icon, notifProp, animationData } = linkItem;
    const hasNotif = notifProp ? this.props[notifProp] : false;
    const { selectedTab } = this.state;

    return (
      <MenuLink
        icon={ icon }
        to={ path }
        key={ path }
        active={ path === selectedTab }
        hasNotification={ hasNotif }
        linkRef={ ref => this._nodes.set(path, ref) }
        animationData={animationData}
        link={link}
      />
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
