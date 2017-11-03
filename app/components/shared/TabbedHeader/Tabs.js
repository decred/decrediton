import { spring, Motion } from "react-motion";
import { Link, withRouter } from "react-router";
import { injectIntl, intlShape } from "react-intl";
import messages from "messages";
import theme from "theme";

@autobind
class Tabs extends React.Component {
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
  getPathname(props) { return props.routes[2] && props.routes[2].path; }
  getPage(routes) { return routes[1].path; }
  getTabs(routes) { return routes[1].childRoutes && routes[1].childRoutes.map( route => route.path ); }

  render () {
    const { intl, routes } = this.props;
    const tabs = this.getTabs(routes);
    const page = this.getPage(routes);
    const { caretLeft, caretWidth } = this.state;
    return (
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
    );
  }
}

Tabs.propTypes = {
  routes: PropTypes.array,
  intl: intlShape
};

export default injectIntl(withRouter(Tabs));
