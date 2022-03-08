import styles from "./CreationWarning.module.css";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { KeyBlueButton } from "buttons";
import { Subtitle } from "shared";
import { useState, createRef } from "react";
import { Tabs, Tab, classNames } from "pi-ui";

const tabLabels = [
  <T id="ln.creationWarning.tab.label1" m="Backup" />,
  <T id="ln.creationWarning.tab.label6" m="LN is a 2nd layer network" />,
  <T id="ln.creationWarning.tab.label2" m="Staying Online" />,
  <T id="ln.creationWarning.tab.label3" m="Watchtower Service" />,
  <T id="ln.creationWarning.tab.label4" m="Channels and Confirmations" />,
  <T id="ln.creationWarning.tab.label5" m="Unlocked During Operations" />
];

const tabDocs = [
  "LNWalletCreationWarningPage01",
  "LNWalletCreationWarningPage06",
  "LNWalletCreationWarningPage02",
  "LNWalletCreationWarningPage03",
  "LNWalletCreationWarningPage04",
  "LNWalletCreationWarningPage05"
];

const tabTitles = [
  <T
    id="ln.creationWarning.tab.title1"
    m="Backup data is needed in addition to seed key"
  />,
  <T
    id="ln.creationWarning.tab.title6"
    m="LN is a 2nd layer network on top of the DCR blockchain, designed to facilitate micropayments more efficiently"
  />,
  <T
    id="ln.creationWarning.tab.title2"
    m="Its preferred to keep wallet online most of the time"
  />,
  <T
    id="ln.creationWarning.tab.title3"
    m="Episodic wallets should use watchtower service for safety"
  />,
  <T
    id="ln.creationWarning.tab.title4"
    m="Sending and Receiving amounts are limited to what is available in your published channels"
  />,
  <T
    id="ln.creationWarning.tab.title5"
    m="Minimize risk by using a seperate wallet for LN"
  />
];

const tabImages = [
  styles.slideImage1,
  styles.slideImage2,
  styles.slideImage3,
  styles.slideImage4,
  styles.slideImage5,
  styles.slideImage6
];

const TabLabelContent = ({ index, activeTabIndex, checked, tabRef }) => (
  <div
    ref={tabRef}
    className={classNames(
      styles.tabLabelContent,
      activeTabIndex === parseInt(index) && styles.active,
      checked && styles.checked
    )}>
    <strong>
      {parseInt(index) + 1}/{tabLabels.length}
    </strong>
    <div className={styles.label}>{tabLabels[index]}</div>
  </div>
);

const CreationWarning = ({ onAcceptCreationWarning }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [checkedTabs, setCheckedTabs] = useState({ 0: true });
  const tabRefs = React.useRef([]);

  if (tabRefs.current.length !== tabLabels.length) {
    tabRefs.current = Array(tabLabels.length)
      .fill()
      .map((_, i) => tabRefs.current[i] || createRef());
  }

  const onSelectTab = (index) => {
    if (index < 0 || index > tabLabels.length - 1) {
      return;
    }
    setActiveTabIndex(index);
    setCheckedTabs((tabs) => {
      tabs[index] = true;
      return tabs;
    });
    if (tabRefs.current[index].current.scrollIntoView) {
      tabRefs.current[index].current.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  const onNextTab = () => onSelectTab(activeTabIndex + 1);
  const onPreviousTab = () => onSelectTab(activeTabIndex - 1);
  const onSelectTabs = () => {};

  const nextArrowDisabled = activeTabIndex >= tabLabels.length - 1;
  const previousArrowDisabled = activeTabIndex <= 0;
  const isAcceptCreationWarningButtonEnabled = tabLabels.reduce(
    (acc, _, i) => (acc &= checkedTabs[i]),
    true
  );

  return (
    <div className={styles.container}>
      <Subtitle
        className={styles.header}
        title={<T id="ln.creationWarning.title" m="Before You continue..." />}>
        <KeyBlueButton
          onClick={onAcceptCreationWarning}
          disabled={!isAcceptCreationWarningButtonEnabled}>
          <T
            id="ln.createWalletWarning.okBtn"
            m="I understand and accept the risks"
          />
        </KeyBlueButton>
      </Subtitle>
      <div className={styles.desc}>
        <T
          id="ln.creationWarning.desc"
          m="Please understand that Lightning Network is still work in progress and should be used with caution. In particular:"
        />
      </div>
      <div className={styles.tabsContainer}>
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
          className={styles.tabs}
          activeTabIndex={activeTabIndex}
          onSelectTab={onSelectTabs}>
          {tabLabels.map((_, i) => (
            <Tab
              key={i}
              label={
                <TabLabelContent
                  tabRef={tabRefs.current[i]}
                  index={i}
                  activeTabIndex={activeTabIndex}
                  checked={checkedTabs[i]}
                />
              }
              className={styles.tab}>
              <div className={styles.tabContent}>
                <div className={styles.tabContentWrapper}>
                  <div className={styles.stepIndicator}>{`${parseInt(i) + 1}/${
                    tabLabels.length
                  }`}</div>
                  <div className={styles.tabTitle}>{tabTitles[i]}</div>
                  <Documentation
                    name={tabDocs[i]}
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
                    <div className={classNames(styles.image, tabImages[i])} />
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
    </div>
  );
};

export default CreationWarning;
