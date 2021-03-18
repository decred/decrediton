import { classNames } from "pi-ui";
import { Switch, Route } from "react-router-dom";
import { TransitionMotion } from "react-motion";
import {
  useEffect,
  useState,
  useReducer
} from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { usePrevious } from "hooks";
import { RoutedTabsHeader, RoutedTab } from "shared";
import { getStyles, getMatchedTab, willEnter, willLeave } from "./helpers";
import TabbedPageTab from "./TabbedPageTab";

// returns the state.styles in a static container, without animations.
const staticStyles = (styles) => (
  <>
    {styles.map(({ key, data: { element } }) => (
      <div className="tab-content visible" key={key}>
        {element}
      </div>
    ))}
  </>
);

// returns the state.styles wrapped in a TransitionMotion, to show the
// animations.
const animatedStyles = (styles, dir) => (
  <TransitionMotion
    styles={styles}
    willLeave={() => willLeave(dir)}
    willEnter={() => willEnter(dir)}>
    {(interpolatedStyles) => (
      <>
        {interpolatedStyles.map(
          ({ key, data: { element }, style: { left, opacity } }) => (
            <div
              className={classNames(
                "tab-content",
                Math.abs(left) < 0.1 && "visible"
              )}
              style={{
                left,
                right: -left,
                opacity: opacity,
                visibility: Math.abs(left) > 990 ? "hidden" : ""
              }}
              key={key}>
              {element}
            </div>
          )
        )}
      </>
    )}
  </TransitionMotion>
);

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
    // if (previous && previous.matchedTab) is false, it probably means it is
    // the first time rendering therefore we use "l2r", as it is probably the
    // first tab.
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
    ({ type, props: { disabled } }) => type === TabbedPageTab && !disabled
  );

  const nonTabs = children.filter(({ type }) => type !== TabbedPageTab);

  const tabHeaders = tabs.map(({ props: { path, link } }) =>
    RoutedTab(path, link)
  );

  const headers = tabs.map(({ props: { path, header } }) => (
    <Route key={path} path={path} component={header} />
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
