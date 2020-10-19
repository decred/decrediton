import { useState, useEffect, useCallback } from "react";
import { NavLink as Link } from "react-router-dom";
import { spring, Motion } from "react-motion";
import { useRoutedTabsHeader } from "./hooks";
import theme from "theme";

export const RoutedTab = (path, link) => ({ path, link });

const RoutedTabsHeader = ({ tabs, caret, styles }) => {
  const nodes = new Map();

  const [caretLeft, setCaretLeft] = useState(null);
  const [caretWidth, setCaretWidth] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [localSidebarOnBottom, setLocalSidebarOnBottom] = useState(null);

  const { location, uiAnimations, sidebarOnBottom } = useRoutedTabsHeader();

  const getAnimatedCaret = () => {
    const caretStyle = {
      left: spring(caretLeft, theme("springs.tab")),
      width: spring(caretWidth, theme("springs.tab"))
    };

    return (
      <Motion style={caretStyle}>
        {(style) => (
          <div className={styles.tabsCaret}>
            <div className={styles.active} style={style}></div>
          </div>
        )}
      </Motion>
    );
  };

  const getStaticCaret = () => {
    const style = {
      left: caretLeft,
      width: caretWidth
    };

    return (
      <div className={styles.tabsCaret}>
        <div className={styles.active} style={style}></div>
      </div>
    );
  };

  const tabLinks = tabs.map((t) => (
    <span
      className={styles.tab}
      key={t.path}
      ref={(ref) => nodes.set(t.path, ref)}>
      <Link to={t.path} activeClassName={styles.active}>
        {t.link}
      </Link>
    </span>
  ));

  const localCaret = uiAnimations ? getAnimatedCaret() : getStaticCaret();

  const updateCaretPosition = useCallback(() => {
    const selectedTab = location.pathname;
    const tabForRoute = nodes.get(selectedTab);
    if (!tabForRoute) return null;
    const tabRect = tabForRoute.getBoundingClientRect();
    const caretLeft = tabForRoute.offsetLeft;
    const caretWidth = tabRect.width;
    setCaretLeft(caretLeft);
    setCaretWidth(caretWidth);
    setSelectedTab(selectedTab);
  }, [location, nodes]);

  useEffect(() => {
    setLocalSidebarOnBottom(sidebarOnBottom);
    updateCaretPosition();
  }, [setLocalSidebarOnBottom, sidebarOnBottom, updateCaretPosition]);

  useEffect(() => {
    if (
      selectedTab != location.pathname ||
      localSidebarOnBottom != sidebarOnBottom
    ) {
      updateCaretPosition();
    }
  }, [
    location,
    selectedTab,
    sidebarOnBottom,
    localSidebarOnBottom,
    localCaret,
    updateCaretPosition
  ]);

  return (
    <div className={styles.tabs}>
      {tabLinks}
      {caret ? caret : localCaret}
    </div>
  );
};

RoutedTabsHeader.propTypes = {
  tabs: PropTypes.array.isRequired
};

export default RoutedTabsHeader;
