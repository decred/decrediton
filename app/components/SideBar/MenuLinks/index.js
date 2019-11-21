import MenuLink from "./MenuLink";
import { routing, theming, newProposalCounts } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { spring, Motion } from "react-motion";
import theme from "theme";
import { createElement as h } from "react";

const linkList = [
  { path: "/home",          link: <T id="sidebar.link.home" m="Overview" />,             icon:"overview" },
  { path: "/transactions",  link: <T id="sidebar.link.transactions" m="Transactions" />, icon:"transactions" },
  { path: "/governance",    link: <T id="sidebar.link.governance" m="Governance" />,     icon:"governance",      notifProp: "newProposalsStartedVoting" },
  { path: "/tickets",       link: <T id="sidebar.link.tickets" m="Tickets" /> ,          icon:"tickets" },
  { path: "/accounts",      link: <T id="sidebar.link.accounts" m="Accounts" />,         icon:"accounts" },
  { path: "/security",      link: <T id="activesidebar.link.security" m="Security" />,   icon:"securitycntr" },
  { path: "/help",          link: <T id="sidebar.link.help" m="Help" />,                 icon:"help" },
  { path: "/settings",      link: <T id="sidebar.link.settings" m="Settings" />,         icon:"settings" }
];


// number of link in a row when sidebar is at bottom.
const LINK_PER_ROW = 4;

@autobind
class MenuLinks extends React.Component {

  _nodes = new Map();
  state = { top: 0, left: 0, selectedTab: null };

  constructor (props) {
    super(props);

    this.links = [ ...linkList ];
    if (props.isTrezor) {
      this.links.push({ path: "/trezor", link: <T id="sidebar.link.trezor" m="Trezor Setup" />, icon:"trezor" });
    }

    if (props.lnEnabled) {
      this.links.push({ path: "/ln", link: <T id="sidebar.link.ln" m="Lightning Network"/>, icon: "ln" } );
    }
  }

  componentDidMount() {
    this.updateCaretPosition();
  }

  componentDidUpdate(prevProps) {
    const { location, sidebarOnBottom } = this.props;
    const tabbedPageCheck = location.pathname.indexOf("/", 1);
    const selectedTab = tabbedPageCheck > 0 ? location.pathname.substring(0, tabbedPageCheck) : location.pathname;
    if (this.state.selectedTab !== selectedTab || sidebarOnBottom !== prevProps.sidebarOnBottom) {
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
    if (this.props.sidebarOnBottom) {
      const newLeft = tabForRoute.offsetLeft;
      const newTop = tabForRoute.offsetTop;
      return { left: spring(newLeft, theme("springs.sideBar")), top: newTop };
    }
    const newTop = tabForRoute.offsetTop;
    return { top: spring(newTop, theme("springs.sideBar")), left: 0 };
  }

  getAnimatedCaret() {
    const style = this.props.sidebarOnBottom ? { left: this.state.left, top: this.state.top } : { top: this.state.top };
    return (
      <Motion style={ style }>
        { style => <div className="menu-caret" {...{ style }}/> }
      </Motion>
    );
  }

  getStaticCaret() {
    const style = this.props.sidebarOnBottom ? { left: this.state.left.val, top: this.state.top.val } : { top: this.state.top.val };
    return <div className="menu-caret" style={ style } />;
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
        {!this.props.sidebarOnBottom && link}
      </MenuLink>
    );
  }

  getLinks() {
    const { sidebarOnBottom } = this.props;

    let linksComponent = [];
    if (sidebarOnBottom) {
      const numberOfRows = this.links.length / LINK_PER_ROW;
      let n = 0;
      const totalLinks = this.links.length;
      for (let i = 0; (i < numberOfRows) && (n < totalLinks); i++) {
        linksComponent[i] = [];
        for (let j = 0; (j < LINK_PER_ROW) && (n < totalLinks); j++) {
          linksComponent[i].push(this.getMenuLink(this.links[n]));
          n++;
        }
        linksComponent[i] = h("div", { className: "is-row", key: i }, linksComponent[i]);
      }
      return linksComponent;
    }

    return linksComponent = this.links.map(link => this.getMenuLink(link));
  }

  render () {
    const caret = this.props.uiAnimations ? this.getAnimatedCaret() : this.getStaticCaret();

    return (
      <>
        {this.getLinks()}
        {caret}
      </>
    );
  }
}

export default routing(theming(newProposalCounts(MenuLinks)));
