import { FormattedMessage as T } from "react-intl";
import { spring, Motion } from "react-motion";
import MenuLink from "./MenuLink";
import theme from "theme";

@autobind
class MenuLinks extends React.Component {
  constructor (props) { super(props); }

  state = { top: spring(0) };

  onClick (e) { this.setState({ top: spring(e.currentTarget.offsetTop, theme("springs.sideBar"))}); }

  render () {
    return (
      <div className="sidebar-scroll">
        <MenuLink onClick={ this.onClick } to="/home"        ><T id="menu.overview"       m="Overview"       /></MenuLink>
        <MenuLink onClick={ this.onClick } to="/accounts"    ><T id="menu.accounts"       m="Accounts"       /></MenuLink>
        <MenuLink onClick={ this.onClick } to="/transactions"><T id="menu.transactions"   m="Transactions"   /></MenuLink>
        <MenuLink onClick={ this.onClick } to="/tickets"     ><T id="menu.tickets"        m="Tickets"        /></MenuLink>
        <MenuLink onClick={ this.onClick } to="/security"    ><T id="menu.securitycenter" m="Security Center"/></MenuLink>
        <MenuLink onClick={ this.onClick } to="/settings"    ><T id="menu.settings"       m="Settings"       /></MenuLink>
        <MenuLink onClick={ this.onClick } to="/help"        ><T id="menu.help"           m="Help"           /></MenuLink>
        <Motion style={ this.state }>
          { style => <div className="menu-caret" {...{ style }}/> }
        </Motion>
      </div>
    );
  }
}

export default MenuLinks;
