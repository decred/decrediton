import { Switch, Route, matchPath } from "react-router-dom";
import { isArray } from "util";
import { RoutedTabsHeader, RoutedTab } from "shared";
import { routing, theming } from "connectors";
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.pathname === prevProps.location.pathname) {
      return;
    }

    const matchedTab = this.matchedTab(this.props.location);
    const dir = prevState.matchedTab && matchedTab &&
      prevState.matchedTab.index > matchedTab.index ? "r2l" : "l2r";
    const styles = this.getStyles(matchedTab);
    this.setState({ matchedTab, dir, styles });
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
      style: { left: spring(0, theme("springs.tab")), opacity: 1 }
    } ];
  }

  willLeave() {
    const pos = this.state.dir === "l2r" ? -1000 : +1000;
    return { left: spring(pos, { stiffness: 180, damping: 20 }), opacity: spring(0)  };
  }

  willEnter() {
    const pos = this.state.dir === "l2r" ? +1000 : -1000;
    return { left: pos, opacity: 1 };
  }

  // returns the state.styles in a static container, without animations.
  staticStyles() {
    return (
      <Aux>
        {this.state.styles.map(s =>
          <div className="tab-content visible" key={s.key}>
            {s.data.element}
          </div>
        )}
      </Aux>
    );
  }

  // returns the state.styles wrapped in a TransitionMotion, to show the animations
  animatedStyles() {
    return (
      <TransitionMotion
        styles={this.state.styles}
        willLeave={this.willLeave}
        willEnter={this.willEnter}
      >
        {interpolatedStyles => {
          return (<Aux>
            {interpolatedStyles.map(s => {
              return (
                <div
                  className={[ "tab-content", Math.abs(s.style.left) < 0.1 ? "visible" : "" ].join(" ")}
                  style={{ left: s.style.left, right: -s.style.left,
                    opacity: s.style.opacity,
                    visibility: Math.abs(s.style.left) > 990 ? "hidden" : "" }}
                  key={s.key}
                >
                  {s.data.element}
                </div>
              );
            })}
          </Aux>);
        }}
      </TransitionMotion>
    );
  }

  render() {
    let { children, header, className } = this.props;
    if (!isArray(children)) children = [ children ];

    const tabs = children.filter(c => c.type === TabbedPageTab);
    const nonTabs = children.filter(c => c.type !== TabbedPageTab);

    const tabHeaders = tabs.map(c => (RoutedTab(c.props.path, c.props.link)));

    const headers = tabs.map(c =>
      <Route key={c.props.path} path={c.props.path} component={c.props.header} />
    );

    const tabContents = this.props.uiAnimations ? this.animatedStyles() : this.staticStyles();
    return (
      <div className="tabbed-page">
        <div className="tabbed-page-header">
          {header}
          <Switch>{headers}</Switch>
          <RoutedTabsHeader tabs={tabHeaders} caret={this.props.caret}/>
        </div>

        <div className={"tabbed-page-body" + (className ? (" " + className) : "")}>
          {tabContents}
          {nonTabs}
        </div>
      </div>
    );
  }
}

export default routing(theming(TabbedPage));
