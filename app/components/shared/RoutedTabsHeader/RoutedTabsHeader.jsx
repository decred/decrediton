import { useMemo, useCallback } from "react";
import { NavLink as Link } from "react-router-dom";
import { spring, Motion } from "react-motion";
import { classNames } from "pi-ui";
import { useRoutedTabsHeader } from "./hooks";
import theme from "theme";
import styles from "./RoutedTabsHeader.module.css";

export const RoutedTab = (path, link, className, activeClassName) => ({
  path,
  link,
  className,
  activeClassName
});

const RoutedTabsHeader = ({ tabs, tabsClassName, caret, activeCaretClassName }) => {
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
            <div className={classNames(styles.active, activeCaretClassName)} style={style} />
          </div>
        )}
      </Motion>
    );
  }, [caretLeft, caretWidth, activeCaretClassName]);

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
      tabs.map(({ path, link, className, activeClassName }) => (
        <span
          className={classNames(styles.tab, className)}
          key={path}
          ref={(ref) => nodes.current.set(path, ref)}>
          <Link
            to={path}
            activeClassName={classNames(styles.active, activeClassName)}>
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
    <div className={classNames(styles.tabs, tabsClassName)}>
      {tabLinks}
      {caret ? caret : localCaret}
    </div>
  );
};

RoutedTabsHeader.propTypes = {
  tabs: PropTypes.array.isRequired
};

export default RoutedTabsHeader;
