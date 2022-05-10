import { FormattedMessage as T } from "react-intl";
import { CloseWalletModalButton } from "buttons";
import { TabbedPage, TitleHeader, DescriptionHeader } from "layout";
import LinksTab from "./LinksTab";
import LogsTab from "./LogsTab";
// import TutorialsTab from "./TutorialsTab";
import ConnectivitySettingsTab from "./ConnectivitySettingsTab";
import GeneralSettingsTab from "./GeneralSettingsTab";
import PrivacyandSecuritySettingsTab from "./PrivacyandSecuritySettingsTab";
import { useSettings, useService } from "hooks";
import styles from "./SettingsPage.module.css";
import { SETTINGS_ICON } from "constants";
import ErrorScreen from "ErrorScreen";
import { useTheme } from "pi-ui";

const closeWalletModalContent = (walletName) => (
  <T
    id="settings.closeWalletModalContent"
    m="Are you sure you want to close {walletName} and return to the launcher?"
    values={{ walletName }}
  />
);

export const SettingsTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="settings.description"
        m="Changing network settings requires a restart"
      />
    }
  />
);

const SettingsPageHeader = () => {
  const { onCloseWallet, walletName } = useSettings();
  return (
    <TitleHeader
      title={<T id="settings.title" m="Settings" />}
      iconType={SETTINGS_ICON}
      optionalButton={
        <CloseWalletModalButton
          modalTitle={
            <T id="settings.closeWalletModalTitle" m="Confirmation Required" />
          }
          buttonLabel={<T id="settings.closeWalletModalOk" m="Close Wallet" />}
          modalContent={closeWalletModalContent(walletName)}
          className={styles.closeModalButton}
          onSubmit={onCloseWallet}
        />
      }
    />
  );
};

const SettingsPage = () => {
  const { walletService } = useService();
  const { setThemeName } = useTheme();
  const tabs = [
    {
      path: "/settings/connectivity",
      content: ConnectivitySettingsTab,
      header: SettingsTabHeader,
      label: <T id="settings.tab.connectivity" m="Connectivity" />
    },
    {
      path: "/settings/general",
      content: <GeneralSettingsTab setThemeName={setThemeName} />,
      header: SettingsTabHeader,
      label: <T id="settings.tab.general" m="General" />
    },
    {
      path: "/settings/privacyandsecurity",
      content: PrivacyandSecuritySettingsTab,
      header: SettingsTabHeader,
      label: <T id="settings.tab.privacyandsecurity" m="Privacy and Security" />
    },
    {
      path: "/settings/links",
      content: LinksTab,
      header: SettingsTabHeader,
      label: <T id="settings.tab.sources" m="Sources" />
    },
    /*
    {
      path: "/settings/tutorials",
      content: TutorialsTab,
      header: SettingsTabHeader,
      label: <T id="settings.tab.tutorials" m="Tutorials" />
    },
    */
    {
      path: "/settings/logs",
      content: LogsTab,
      header: SettingsTabHeader,
      label: <T id="settings.tab.logs" m="Logs" />
    }
  ];
  return !walletService ? (
    <ErrorScreen />
  ) : (
    <TabbedPage header={<SettingsPageHeader />} tabs={tabs} />
  );
};

export default SettingsPage;
