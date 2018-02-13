import { injectIntl } from "react-intl";
import { spring, Motion } from "react-motion";
import { withRouter } from "react-router-dom";
import { getPage } from "helpers";
import MenuLink from "./MenuLink";
import messages from "messages";
import theme from "theme";

const linkList = [
  "home",
  "accounts",
  "transactions",
  "tickets",
  "security",
  "settings",
  "help"
];

@autobind
class MenuLinks extends React.Component {
  constructor (props) { super(props); }
  _nodes = new Map();
  state = { top: 0 };

  componentWillReceiveProps(nextProps) {
    // const activeLink = getPage(nextProps.routes);
    // const basePage = activeLink.split("/")[0];
    // const newTop = this._nodes.get(basePage).offsetTop;
    // this.setState({ top: spring(newTop, theme("springs.sideBar")) });
  }

  render () {
    return (
      <Aux>
        { linkList.map(link =>
          <MenuLink to={ "/" + link } linkRef={ ref => this._nodes.set(link, ref) } key={ link }>
            { this.props.intl.formatMessage(messages["menu." + link]) }
          </MenuLink> )}
        <Motion style={ this.state }>
          { style => <div className="menu-caret" {...{ style }}/> }
        </Motion>
      </Aux>
    );
  }
}

export default withRouter(injectIntl(MenuLinks));
