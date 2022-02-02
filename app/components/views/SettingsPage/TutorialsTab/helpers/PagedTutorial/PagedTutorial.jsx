import styles from "./PagedTutorial.module.css";
import { Documentation } from "shared";
import { createRef } from "react";
import { Tabs, Tab, classNames } from "pi-ui";
import CrossfadingImages from "./CrossfadingImages";
import TabLabel from "./TabLabel";
import { uniq } from "lodash";
import { useMountEffect } from "hooks";

const PagedTutorial = ({
  slides,
  visitedTabs,
  setVisitedTabs,
  activeTabIndex,
  setActiveTabIndex,
  className,
  tabContentWrapperClassName
  onFinish
}) => {
  useMountEffect(() => {
    if (slides.length === 1) {
      setActiveTabIndex(null);
      onTabVisited([0]);
    }
    if (activeTabIndex === slides.length - 1) {
      setActiveTabIndex(0);
    }
  });

  const onTabVisited = (indexes) =>
    setVisitedTabs(uniq([...visitedTabs, ...indexes], true));

  const tabRefs = React.useRef([]);

  if (tabRefs.current.length !== slides.length) {
    tabRefs.current = Array(slides.length)
      .fill()
      .map((_, i) => tabRefs.current[i] || createRef());
  }

  const onSelectTab = (index) => {
    if (onFinish && index == slides.length) {
      onFinish();
      return;
    }
    if (index < 0 || index > slides.length - 1) {
      return;
    }
    onTabVisited([activeTabIndex]);
    setActiveTabIndex(index);
    if (tabRefs.current[index].current.scrollIntoView) {
      tabRefs.current[index].current.scrollIntoView({
        behavior: "smooth"
      });
    }
    if (index === slides.length - 1) {
      onTabVisited([activeTabIndex, index]);
    }
  };
  const onNextTab = () => onSelectTab(activeTabIndex + 1);
  const onPreviousTab = () => onSelectTab(activeTabIndex - 1);
  const onSelectTabs = () => {};

  const nextArrowDisabled =
    activeTabIndex >= (onFinish ? slides.length : slides.length - 1);
  const previousArrowDisabled = activeTabIndex <= 0;
  const spaceEvenly = slides.length < 4;

  return (
    <div className={classNames(styles.tabsContainer, className)}>
      <button
        aria-label="Previous"
        className={classNames(
          styles.tabButton,
          "flex-centralize",
          styles.previous,
          previousArrowDisabled && styles.disabled
        )}
        onClick={onPreviousTab}>
        <div className={styles.icon} />
      </button>
      <Tabs
        className={classNames(styles.tabs, spaceEvenly && styles.spaceEvenly)}
        activeTabIndex={activeTabIndex}
        onSelectTab={onSelectTabs}>
        {slides.map((slide, i) => (
          <Tab
            key={i}
            label={
              <TabLabel
                className={styles.tabLabel}
                slides={slides}
                tabRef={tabRefs.current[i]}
                index={i}
                activeTabIndex={activeTabIndex}
                visited={visitedTabs.includes(i)}
              />
            }
            className={styles.tab}>
            <div className={styles.tabContent}>
              <div
                className={classNames(
                  styles.tabContentWrapper,
                  tabContentWrapperClassName
                )}>
                <div className={styles.stepIndicator}>{`${parseInt(i) + 1}/${
                  slides.length
                }`}</div>
                <div className={styles.tabTitle}>{slide.title}</div>
                <Documentation
                  name={slide.doc}
                  className={styles.tabDesc}
                  unavailableAlertClassName={styles.unavailableAlert}
                />
                <div className={styles.bottomGrid}>
                  <button
                    aria-label="Previous arrow"
                    className={classNames(
                      styles.arrow,
                      previousArrowDisabled && styles.disabled
                    )}
                    onClick={onPreviousTab}
                  />
                  <CrossfadingImages images={slide.images} />
                  <button
                    aria-label="Next arrow"
                    className={classNames(
                      styles.arrow,
                      styles.next,
                      nextArrowDisabled && styles.disabled
                    )}
                    onClick={onNextTab}
                  />
                </div>
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
      <button
        aria-label="Next"
        className={classNames(
          styles.tabButton,
          "flex-centralize",
          styles.next,
          nextArrowDisabled && styles.disabled
        )}
        onClick={onNextTab}>
        <div className={styles.icon} />
      </button>
    </div>
  );
};

PagedTutorial.propTypes = {
  slides: PropTypes.array.isRequired,
  visitedTabs: PropTypes.array,
  setVisitedTabs: PropTypes.func.isRequired,
  activeTabIndex: PropTypes.number,
  setActiveTabIndex: PropTypes.func.isRequired,
  className: PropTypes.string,
  tabContentWrapperClassName: PropTypes.string
  onFinish: PropTypes.func
};

PagedTutorial.defaultProps = {
  visitedTabs: [],
  activeTabIndex: 0
};

export default PagedTutorial;
