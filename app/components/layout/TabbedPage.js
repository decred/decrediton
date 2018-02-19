import { Switch, Route, matchPath } from "react-router-dom";
import { isArray } from "util";
import { RoutedTabsHeader, RoutedTab } from "shared";
import { routing } from "connectors";
import { TransitionMotion, spring } from "react-motion";
import theme from "theme";
import { createElement } from "react";

export const TabbedPageTab = ({ children }) => children;
TabbedPageTab.propTypes = {
  path: PropTypes.string.isRequired,
  link: PropTypes.node.isRequired,
};

function getTabs(children) {
  if (!isArray(children)) children = [ children ];
  return children.filter(c => c.type === TabbedPageTab).map((c, i) => ({ index: i, tab: c }));
}

@autobind
class TabbedPage extends React.Component {

  constructor(props) {
    super(props);
    this._tabs = getTabs(props.children);
    const matchedTab = this.matchedTab(props.location);
    const styles = this.getStyles(matchedTab);
    this.state = { matchedTab, dir: "l2r", styles };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this._tabs = getTabs(nextProps.children);
    }

    if (nextProps.location !== this.props.location) {
      const matchedTab = this.matchedTab(nextProps.location);
      const dir =
        this.state.matchedTab && matchedTab && this.state.matchedTab.index > matchedTab.index
          ? "r2l" : "l2r";
      const styles = this.getStyles(matchedTab);
      this.setState({ matchedTab, dir, styles });
    }
  }

  matchedTab(location) {
    return this._tabs.find(t => !!matchPath(location.pathname, { path: t.tab.props.path }));
  }

  getStyles(matchedTab) {
    if (!matchedTab) {
      return [];
    }

    const element = createElement(matchedTab.tab.props.component, matchedTab.tab.props, null);
    return [ {
      key: matchedTab.tab.props.path,
      data: { matchedTab, element },
      style: { left: spring(0, theme("springs.tab")) }
    } ];
  }

  willLeave() {
    const pos = this.state.dir === "l2r" ? -1000 : +1000;
    return { left: spring(pos, spring(theme("springs.tab"))) };
  }

  willEnter() {
    const pos = this.state.dir === "l2r" ? +1000 : -1000;
    return { left: pos };
  }

  render() {
    let { children, header } = this.props;
    if (!isArray(children)) children = [ children ];

    const tabs = children.filter(c => c.type === TabbedPageTab);
    const nonTabs = children.filter(c => c.type !== TabbedPageTab);

    const tabHeaders = tabs.map(c => (RoutedTab(c.props.path, c.props.link)));

    const headers = tabs.map(c =>
      <Route key={c.props.path} path={c.props.path} component={c.props.header} />
    );

    return (
      <div className="tabbed-page">
        <div className="tabbed-page-header">
          {header}
          <Switch>{headers}</Switch>
          <RoutedTabsHeader tabs={tabHeaders} />
        </div>

        <div className="tabbed-page-body">
          <TransitionMotion
            styles={this.state.styles}
            willLeave={this.willLeave}
            willEnter={this.willEnter}
          >
            {interpolatedStyles => <Aux>
              {interpolatedStyles.map(s =>
                <div className="tab-content" style={{ left: s.style.left, right: -s.style.left }} key={s.key}>
                  {s.data.element}
                </div>
              )}
            </Aux>}
          </TransitionMotion>

          {nonTabs}
        </div>
      </div>
    );
  }
}

export default routing(TabbedPage);
