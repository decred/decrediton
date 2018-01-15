import { spring, Motion } from "react-motion";
import { Link } from "react-router";
import { injectIntl, intlShape } from "react-intl";
import { getTabs, getTab, getPage } from "helpers";
import messages from "messages";
import theme from "theme";

@autobind
class Tabs extends React.Component {
  constructor(props) { super(props); }
  _nodes = new Map();
  state = { caretLeft: null, caretWidth: null, selectedTab: null };

  componentDidMount() { this.updateCaretPosition(getTab(this.props.routes)); }

  componentDidUpdate() {
    const pathname = getTab(this.props.routes);
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

  render () {
    const { intl, routes, className } = this.props;
    const tabs = getTabs(routes);
    const page = getPage(routes);
    const { caretLeft, caretWidth } = this.state;
    return (
      <div className={className}>
        { tabs.map((tab) => {
          const title = [page, "tab", tab].join(".");
          const route = ["", page, tab].join("/");
          return (
            <div className="tabbedheader-ref" ref={ ref => this._nodes.set(tab, ref) } key={ tab }>
              <Link to={ route } className="tabbedheader-tab" activeClassName="tabbedheader-tab-active">
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
  routes: PropTypes.array.isRequired,
  intl: intlShape
};

export default injectIntl(Tabs);
