import { spring, Motion } from "react-motion";
import { Link, withRouter } from "react-router";
import { injectIntl, intlShape } from "react-intl";
import { header } from "connectors";
import messages from "messages";
import Description from "./Description";
import theme from "theme";
import "style/Header.less";

@autobind
class TabbedHeader extends React.Component {
  constructor(props) { super(props); }
  _nodes = new Map();
  state = { caretLeft: null, caretWidth: null, selectedTab: null };

  componentDidMount() { this.updateCaretPosition(this.getPathname(this.props)); }

  componentDidUpdate() {
    const pathname = this.getPathname(this.props);
    if (this.state.selectedTab != pathname) {
      const caretPosition = this.neededCaretPosition(pathname);
      this.setState({ selectedTab: pathname, ...caretPosition });
    }
  }
  updateCaretPosition(tab) {
    const caretPosition = this.neededCaretPosition(tab);
    if (caretPosition) this.setState(caretPosition);
  }
  neededCaretPosition(tab) {
    const tabForRoute = this._nodes.get(tab);
    if (!tabForRoute) return null;
    const tabRect = tabForRoute.getBoundingClientRect();
    const caretLeft = tabForRoute.offsetLeft;
    const caretWidth = tabRect.width;
    return {caretLeft, caretWidth};
  }
  getTabs(props) { return props.routes[1].childRoutes.map( route => route.path ); }
  getPage(props) { return props.routes[1].path; }
  getPathname(props) { return props.routes[2].path; }

  render () {
    const { intl, children } = this.props;
    const tabs = this.getTabs(this.props);
    const page = this.getPage(this.props);
    const { caretLeft, caretWidth } = this.state;
    const headerIcon = ["header-icon", page].join("-");
    const title = [page, "title"].join(".");
    return (
      <div className="header">
        <div className="header-top"></div>

        <div className="tabbedheader-title">
          <span className={ "tabbedheader-icon " + headerIcon } />
          { intl.formatMessage(messages[title]) }
        </div>

        <Description>
          { children }
        </Description>

        <div className="tabbedheader-tabs">
          { tabs.map((tab) => {
            const title = [page, "tab", tab].join(".");
            const route = ["", page, tab].join("/");
            return (
              <div className="tabbedheader-ref" ref={ ref => this._nodes.set(tab, ref) } key={ tab }>
                <Link to={ route } className="tabbedheader-tab" >
                  { intl.formatMessage(messages[title]) }
                </Link>
              </div>
            );
          })}
          <Motion style={{ left: spring(caretLeft, theme("springs.tab")), width: spring(caretWidth, theme("springs.tab")) }}>
            { style => <div className="tabbedheader-active-tab-caret" style={ style }/> }
          </Motion>
        </div>
      </div>
    );
  }
}

TabbedHeader.propTypes = {
  routes: PropTypes.array,
  intl: intlShape
};

export default injectIntl(header(withRouter(TabbedHeader)));
