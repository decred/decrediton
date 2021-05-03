import { createElement as h, cloneElement as k } from "react";
import { matchPath } from "react-router-dom";
import { isArray } from "lodash";
import { spring } from "react-motion";
import theme from "theme";
import TabbedPageTab from "./TabbedPageTab";

const getTabs = (children) => {
  if (!isArray(children)) children = [children];
  return children
    .filter((c) => c.type === TabbedPageTab)
    .map((c, i) => ({ index: i, tab: c }));
};

export const getMatchedTab = (location, children) => {
  const tabs = getTabs(children);
  return tabs.find(
    (t) => !!matchPath(location.pathname, { path: t.tab.props.path })
  );
};

export const getStyles = (matchedTab) => {
  if (!matchedTab) {
    return [];
  }

  const element = React.isValidElement(matchedTab.tab.props.component)
    ? k(matchedTab.tab.props.component, {
        ...matchedTab.tab.props,
        ...matchedTab.tab.props.component.props
      })
    : // If the component props are needed, make a valid react element
      // before send, otherwise they will be undfined.
      h(matchedTab.tab.props.component, { ...matchedTab.tab.props }, null);
  return [
    {
      key: matchedTab.tab.props.path,
      data: { matchedTab, element },
      style: { left: spring(0, theme("springs.tab")), opacity: 1 }
    }
  ];
};

export const willLeave = (dir) => {
  const pos = dir === "l2r" ? -1000 : +1000;
  return {
    left: spring(pos, { stiffness: 180, damping: 20 }),
    opacity: spring(0)
  };
};

export const willEnter = (dir) => {
  const pos = dir === "l2r" ? +1000 : -1000;
  return { left: pos, opacity: 1 };
};
