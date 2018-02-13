import { routing } from "connectors";
import { spring, Motion } from "react-motion";
import { NavLink as Link } from "react-router-dom";
import { getTabs, getTab, getPage } from "helpers";
import messages from "messages";
import theme from "theme";

@autobind
class Tabs extends React.Component {

  _nodes = new Map();
  state = { caretLeft: null, caretWidth: null, selectedTab: null };

  constructor(props) {
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
    if (caretPosition) this.setState({...caretPosition, selectedTab});
  }

  neededCaretPosition(path) {
    const tabForRoute = this._nodes.get(path);
    if (!tabForRoute) return null;
    const tabRect = tabForRoute.getBoundingClientRect();
    const caretLeft = tabForRoute.offsetLeft;
    const caretWidth = tabRect.width;
    return {caretLeft, caretWidth};
  }

  render() {
    const { tabs } = this.props;

    const tabLinks = tabs.map(c =>
      <span className="tab" key={c.props.path} ref={ref => this._nodes.set(c.props.path, ref)}>
        <Link to={c.props.path}>
          {c.props.link}
        </Link>
      </span>
    );

    const caretStyle = {
      left: this.state.caretLeft,
      width: this.state.caretWidth,
    };

    return (
      <div className="tabs">
        {tabLinks}
        <div className="tabs-caret"><div className="active" style={caretStyle}></div></div>
      </div>
    );
  }

  render2 () {
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

export default routing(Tabs);
