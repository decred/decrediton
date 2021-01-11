import { classNames } from "pi-ui";
import { Switch, Route, matchPath } from "react-router-dom";
import { RoutedTabsHeader, RoutedTab } from "shared";
import { TransitionMotion, spring } from "react-motion";
import theme from "theme";
import {
  createElement as h,
  cloneElement as k,
  useEffect,
  useState,
  useReducer
} from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { usePrevious } from "hooks";

export const TabbedPageTab = ({ children }) => children;
TabbedPageTab.propTypes = {
  path: PropTypes.string.isRequired,
  link: PropTypes.node.isRequired
};

function getTabs(children) {
  if (!Array.isArray(children)) children = [children];
  return children
    .filter((c) => c.type === TabbedPageTab)
    .map((c, i) => ({ index: i, tab: c }));
}

function getMatchedTab(location, children) {
  const tabs = getTabs(children);
  return tabs.find(
    (t) => !!matchPath(location.pathname, { path: t.tab.props.path })
  );
}

function getStyles(matchedTab) {
  if (!matchedTab) {
    return [];
  }

  const element = React.isValidElement(matchedTab.tab.props.component)
    ? k(matchedTab.tab.props.component, {
        ...matchedTab.tab.props,
        ...matchedTab.tab.props.component.props
      })
    : // If the component props are needed, it is needed to make it a valid react element
      // before send, otherwise they will be undfined.
      h(matchedTab.tab.props.component, { ...matchedTab.tab.props }, null);
  return [
    {
      key: matchedTab.tab.props.path,
      data: { matchedTab, element },
      style: { left: spring(0, theme("springs.tab")), opacity: 1 }
    }
  ];
}

function willLeave(dir) {
  const pos = dir === "l2r" ? -1000 : +1000;
  return {
    left: spring(pos, { stiffness: 180, damping: 20 }),
    opacity: spring(0)
  };
}

function willEnter(dir) {
  const pos = dir === "l2r" ? +1000 : -1000;
  return { left: pos, opacity: 1 };
}

// returns the state.styles in a static container, without animations.
function staticStyles(styles) {
  return (
    <>
      {styles.map((s) => (
        <div className="tab-content visible" key={s.key}>
          {s.data.element}
        </div>
      ))}
    </>
  );
}

// returns the state.styles wrapped in a TransitionMotion, to show the animations
function animatedStyles(styles, dir) {
  return (
    <TransitionMotion
      styles={styles}
      willLeave={() => willLeave(dir)}
      willEnter={() => willEnter(dir)}>
      {(interpolatedStyles) => {
        return (
          <>
            {interpolatedStyles.map((s) => {
              return (
                <div
                  className={[
                    "tab-content",
                    Math.abs(s.style.left) < 0.1 ? "visible" : ""
                  ].join(" ")}
                  style={{
                    left: s.style.left,
                    right: -s.style.left,
                    opacity: s.style.opacity,
                    visibility: Math.abs(s.style.left) > 990 ? "hidden" : ""
                  }}
                  key={s.key}>
                  {s.data.element}
                </div>
              );
            })}
          </>
        );
      }}
    </TransitionMotion>
  );
}

function TabbedPage({ children, header, className, onChange, caret }) {
  const location = useSelector(sel.location);
  const uiAnimations = useSelector(sel.uiAnimations);
  const [matchedTab, setMatchedTab] = useReducer(() =>
    getMatchedTab(location, children)
  );

  const previous = usePrevious({ matchedTab, location });
  const [dir, setDir] = useState("l2r");
  useEffect(() => {
    setMatchedTab(getMatchedTab(location, children));
  }, [children, location]);
  useEffect(() => {
    if (previous && previous.location.pathname === location.pathname) return;
    if (typeof onChange === "function") onChange();
    const matchedTab = getMatchedTab(location, children);
    if (!matchedTab) return;
    // if (previous && previous.matchedTab) is false, it probably means it is the first time rendering
    // therefore we use "l2r", as it is probably the first tab.
    const dir =
      previous && previous.matchedTab
        ? previous.matchedTab.index > matchedTab.index
          ? "r2l"
          : "l2r"
        : "l2r";
    setDir(dir);
    setMatchedTab(matchedTab);
  }, [location, previous, children, onChange]);
  if (!Array.isArray(children)) children = [children];

  const tabs = children.filter(
    (c) => c.type === TabbedPageTab && !c.props.disabled
  );
  const nonTabs = children.filter((c) => c.type !== TabbedPageTab);

  const tabHeaders = tabs.map((c) => RoutedTab(c.props.path, c.props.link));

  const headers = tabs.map((c) => (
    <Route key={c.props.path} path={c.props.path} component={c.props.header} />
  ));

  const styles = getStyles(matchedTab);

  const tabContents = uiAnimations
    ? animatedStyles(styles, dir)
    : staticStyles(styles);

  return (
    <div className="tabbed-page">
      <div className="tabbed-page-header">
        {header}
        <Switch>{headers}</Switch>
        <RoutedTabsHeader tabs={tabHeaders} caret={caret} />
      </div>

      <div className={classNames("tabbed-page-body", className)}>
        {tabContents}
        {nonTabs}
      </div>
    </div>
  );
}

export default TabbedPage;
