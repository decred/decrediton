import { useMemo, useCallback } from "react";
import { NavLink as Link } from "react-router-dom";
import { spring, Motion } from "react-motion";
import { useRoutedTabsHeader } from "./hooks";
import theme from "theme";
import styles from "./RoutedTabsHeader.module.css";

export const RoutedTab = (path, link) => ({ path, link });

const RoutedTabsHeader = ({ tabs, caret }) => {
  const { uiAnimations, caretLeft, caretWidth, nodes } = useRoutedTabsHeader();

  const getAnimatedCaret = useCallback(() => {
    const caretStyle = {
      left: spring(caretLeft, theme("springs.tab")),
      width: spring(caretWidth, theme("springs.tab"))
    };

    return (
      <Motion style={caretStyle}>
        {(style) => (
          <div className={styles.tabCaret}>
            <div className={styles.active} style={style} />
          </div>
        )}
      </Motion>
    );
  }, [caretLeft, caretWidth]);

  const getStaticCaret = useCallback(() => {
    const style = {
      left: caretLeft,
      width: caretWidth
    };

    return (
      <div className={styles.tabCaret}>
        <div className={styles.active} style={style}></div>
      </div>
    );
  }, [caretLeft, caretWidth]);

  const tabLinks = useMemo(
    () =>
      tabs.map(({ path, link }) => (
        <span
          className={styles.tab}
          key={path}
          ref={(ref) => nodes.current.set(path, ref)}>
          <Link to={path} activeClassName={styles.active}>
            {link}
          </Link>
        </span>
      )),
    [tabs, nodes]
  );

  const localCaret = useMemo(
    () => (uiAnimations ? getAnimatedCaret() : getStaticCaret()),
    [uiAnimations, getAnimatedCaret, getStaticCaret]
  );

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
