import { routing } from "connectors";
import { NavLink as Link } from "react-router-dom";
import { spring, Motion } from "react-motion";
import theme from "theme";

export const RoutedTab = (path, link) => ({ path, link });

@autobind
class RoutedTabsHeader extends React.Component {

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
    if (caretPosition) this.setState({ ...caretPosition, selectedTab });
  }

  neededCaretPosition(path) {
    const tabForRoute = this._nodes.get(path);
    if (!tabForRoute) return null;
    const tabRect = tabForRoute.getBoundingClientRect();
    const caretLeft = tabForRoute.offsetLeft;
    const caretWidth = tabRect.width;
    return { caretLeft, caretWidth };
  }

  render() {
    const { tabs } = this.props;

    const tabLinks = tabs.map(t =>
      <span className="tab" key={t.path} ref={ref => this._nodes.set(t.path, ref)}>
        <Link to={t.path}>
          {t.link}
        </Link>
      </span>
    );

    const caretStyle = {
      left: spring(this.state.caretLeft, theme("springs.tab")),
      width: spring(this.state.caretWidth, theme("springs.tab")),
    };

    return (
      <div className="tabs">
        {tabLinks}
        <Motion style={caretStyle}>
          { style => <div className="tabs-caret"><div className="active" style={style}></div></div> }
        </Motion>
      </div>
    );
  }
}

RoutedTabsHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
};

export default routing(RoutedTabsHeader);
