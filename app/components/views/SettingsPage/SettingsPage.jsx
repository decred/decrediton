import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { CloseWalletModalButton } from "buttons";
import {
  TabbedPage,
  TabbedPageTab as Tab,
  TitleHeader,
  DescriptionHeader
} from "layout";
import { LinksTab } from "./LinksTab";
import { LogsTab } from "./LogsTab/LogsTab";
import { TutorialsTab } from "./TutorialsTab/TutorialsTab";
import { SettingsTab } from "./SettingsTab/SettingsTab";
import { useSettings } from "hooks";
import styles from "./SettingsPage.module.css";
import { SETTINGS_ICON } from "constants";

const closeWalletModalContent = (walletName) => (
  <T
    id="settings.closeWalletModalContent"
    m="Are you sure you want to close {walletName} and return to the launcher?"
    values={{ walletName }}
  />
);

export const SettingsTabHeader = () => {
  return (
    <DescriptionHeader
      description={
        <T
          id="settings.description"
          m="Changing network settings requires a restart"
        />
      }
    />
  );
};

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
  return (
    <TabbedPage header={<SettingsPageHeader />}>
      <Switch>
        <Redirect from="/settings" exact to="/settings/settings" />
      </Switch>
      <Tab
        path="/settings/settings"
        component={SettingsTab}
        header={SettingsTabHeader}
        link={<T id="settings.tab.settings" m="Settings" />}
      />
      <Tab
        path="/settings/links"
        component={LinksTab}
        header={SettingsTabHeader}
        link={<T id="settings.tab.sources" m="Sources" />}
      />
      <Tab
        path="/settings/tutorials"
        component={TutorialsTab}
        header={SettingsTabHeader}
        link={<T id="settings.tab.tutorials" m="Tutorials" />}
      />
      <Tab
        path="/settings/logs"
        component={LogsTab}
        header={SettingsTabHeader}
        link={<T id="settings.tab.logs" m="Logs" />}
      />
    </TabbedPage>
  );
};

export default SettingsPage;
