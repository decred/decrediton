import { injectIntl } from "react-intl";
import { spring, Motion } from "react-motion";
import { withRouter } from "react-router";
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
    const activeLink = getPage(nextProps.routes);
    const newTop = this._nodes.get(activeLink).offsetTop;
    this.setState({ top: spring(newTop, theme("springs.sideBar")) });
  }

  render () {
    return (
      <Aux>
        { linkList.map(link =>
          <MenuLink to={ "/" + link } ref={ ref => this._nodes.set(link, ref) }>
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
