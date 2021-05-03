import { classNames } from "pi-ui";
import { Switch, Route } from "react-router-dom";
import { TransitionMotion } from "react-motion";
import { useEffect, useState, useReducer } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { usePrevious } from "hooks";
import { RoutedTabsHeader, RoutedTab } from "shared";
import { getStyles, getMatchedTab, willEnter, willLeave } from "./helpers";
import TabbedPageTab from "./TabbedPageTab";
import styles from "./TabbedPage.module.css";
import { isFunction, isArray } from "lodash";

// returns the state.styles in a static container, without animations.
const staticStyles = (stylesObj, contentClassName) => (
  <>
    {stylesObj.map(({ key, data: { element } }) => (
      <div
        className={classNames(
          styles.tabContent,
          styles.visible,
          contentClassName
        )}
        key={key}>
        {element}
      </div>
    ))}
  </>
);

// returns the state.styles wrapped in a TransitionMotion, to show the
// animations.
const animatedStyles = (stylesObj, dir, contentClassName) => (
  <TransitionMotion
    styles={stylesObj}
    willLeave={() => willLeave(dir)}
    willEnter={() => willEnter(dir)}>
    {(interpolatedStyles) => (
      <>
        {interpolatedStyles.map(
          ({ key, data: { element }, style: { left, opacity } }) => (
            <div
              className={classNames(
                styles.tabContent,
                Math.abs(left) < 0.1 && styles.visible,
                contentClassName
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

const TabbedPage = ({
  children,
  className,
  header,
  headerClassName,
  tabsClassName,
  tabContentClassName,
  onChange,
  caret
}) => {
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
    if (isFunction(onChange)) onChange();
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

  if (!isArray(children)) children = [children];

  const tabs = children.filter(
    ({ type, props: { disabled } }) => type === TabbedPageTab && !disabled
  );

  const nonTabs = children.filter(({ type }) => type !== TabbedPageTab);

  const tabHeaders = tabs.map(
    ({ props: { path, link, className, activeClassName } }) =>
      RoutedTab(path, link, className, activeClassName)
  );

  const headers = tabs.map(({ props: { path, header } }) => (
    <Route key={path} path={path} component={header} />
  ));

  const tabStyles = getStyles(matchedTab);

  const tabContents = uiAnimations
    ? animatedStyles(tabStyles, dir, tabContentClassName)
    : staticStyles(tabStyles, tabContentClassName);

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles.tabbedPageHeader, headerClassName)}>
        {header}
        <Switch>{headers}</Switch>
        <RoutedTabsHeader
          tabs={tabHeaders}
          tabsClassName={tabsClassName}
          caret={caret}
        />
      </div>

      <div className={classNames(styles.tabbedPageBody, className)}>
        {tabContents}
        {nonTabs}
      </div>
    </div>
  );
};

export default TabbedPage;
