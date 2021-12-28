import { FormattedMessage as T } from "react-intl";
import ConnectivitySettingsTab from "views/SettingsPage/ConnectivitySettingsTab";
import GeneralSettingsTab from "views/SettingsPage/GeneralSettingsTab";
import PrivacyandSecuritySettingsTab from "views/SettingsPage/PrivacyandSecuritySettingsTab";
import { InvisibleButton } from "buttons";
import { GoBackMsg } from "../messages";
import styles from "./Settings.module.css";
import { TabbedPage, TitleHeader } from "layout";

const ContentWithGoBackButton = ({ onSendBack, children }) => (
  <>
    <InvisibleButton className={styles.goBack} onClick={onSendBack}>
      <GoBackMsg />
    </InvisibleButton>
    {children}
  </>
);

const Setttings = ({ onSendBack }) => {
  const tabs = [
    {
      key: "connectivity",
      content: (
        <ContentWithGoBackButton onSendBack={onSendBack}>
          <ConnectivitySettingsTab
            wrapperClassName={styles.connectionWrapper}
          />
        </ContentWithGoBackButton>
      ),
      label: <T id="getstarted.settings.tab.connectivity" m="Connectivity" />
    },
    {
      key: "general",
      content: (
        <ContentWithGoBackButton onSendBack={onSendBack}>
          <GeneralSettingsTab
            wrapperClassName={styles.generalWrapper}
            uiBoxClassName={styles.uiBox}
            uiGroupClassName={styles.uiGroup}
            timezoneBoxClassName={styles.timezoneBox}
          />
          ,
        </ContentWithGoBackButton>
      ),
      label: <T id="getstarted.settings.tab.general" m="General" />
    },
    {
      key: "privacyandsecurity",
      content: (
        <ContentWithGoBackButton onSendBack={onSendBack}>
          <PrivacyandSecuritySettingsTab
            wrapperClassName={styles.privacyAndSecurityWrapper}
            boxClassName={styles.privacyAndSecurityBox}
          />
        </ContentWithGoBackButton>
      ),
      label: (
        <T
          id="getstarted.settings.tab.privacyandsecurity"
          m="Privacy and Security"
        />
      )
    }
  ];
  return (
    <div className={styles.tabsContainer}>
      <TabbedPage
        header={
          <TitleHeader title={<T id="settings.subtitle" m="Settings" />} />
        }
        tabs={tabs}
        tabsClassName={styles.tabs}
        tabContentClassName={styles.tabsContent}
        headerClassName={styles.tabHeader}
      />
    </div>
  );
};

export default Setttings;
