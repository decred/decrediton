import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { CloseWalletModalButton } from "buttons";
import { TabbedPage, TabbedPageTab as Tab, StandaloneHeader } from "layout";
import { LinksTab } from "./LinksTab";
import { LogsTab } from "./LogsTab/LogsTab";
import { TutorialsTab } from "./TutorialsTab/TutorialsTab";
import { SettingsTab } from "./SettingsTab/SettingsTab";
import { useSettings } from "hooks";
import styles from "./SettingsPage.module.css";

const closeWalletModalContent = (walletName) => (
  <T
    id="settings.closeWalletModalContent"
    m="Are you sure you want to close {walletName} and return to the launcher?"
    values={{ walletName }}
  />
);

const closeWalletWithAutobuyerModal = (walletName) => (
  <T
    id="settings.closeWalletModalWithAutobuyerModal"
    m="Are you sure you want to close {walletName} and return to the launcher? The auto ticket buyer is still running. If you proceed, it will be closed and no more tickets will be purchased."
    values={{ walletName }}
  />
);

const closeWalletWithUnpaidFeeModal = (walletName) => (
  <T
    id="settings.closeWalletModalWithUnpaidFeeModal"
    m="Are you sure you want to close {walletName} and return to the launcher? You still have unpaid tickets fee. If you proceed and they are chosen to vote, they will be missed."
    values={{ walletName }}
  />
);

const SettingsPageHeader = ({
  onCloseWallet,
  walletName,
  isTicketAutoBuyerEnabled,
  hasUnpaidFee
}) => (
  <StandaloneHeader
    title={<T id="settings.title" m="Settings" />}
    iconClassName="settings"
    description={
      <T
        id="settings.description"
        m="Changing network settings requires a restart"
      />
    }
    actionButton={
      <CloseWalletModalButton
        modalTitle={
          <T id="settings.closeWalletModalTitle" m="Confirmation Required" />
        }
        buttonLabel={<T id="settings.closeWalletModalOk" m="Close Wallet" />}
        modalContent={
          isTicketAutoBuyerEnabled
            ? closeWalletWithAutobuyerModal(walletName)
            : hasUnpaidFee
            ? closeWalletWithUnpaidFeeModal(walletName)
            : closeWalletModalContent(walletName)
        }
        className={styles.closeModalButton}
        onSubmit={onCloseWallet}
      />
    }
  />
);

const SettingsPage = () => {
  const { onCloseWallet, isTicketAutoBuyerEnabled, walletName, hasUnpaidFee } = useSettings();

  return (
    <TabbedPage
      header={
        <SettingsPageHeader
          {...{ onCloseWallet, walletName, isTicketAutoBuyerEnabled, hasUnpaidFee }}
        />
      }>
      <Switch>
        <Redirect from="/settings" exact to="/settings/settings" />
      </Switch>
      <Tab
        path="/settings/settings"
        component={SettingsTab}
        link={<T id="settings.tab.settings" m="Settings" />}
      />
      <Tab
        path="/settings/links"
        component={LinksTab}
        link={<T id="settings.tab.sources" m="Sources" />}
      />
      <Tab
        path="/settings/tutorials"
        component={TutorialsTab}
        link={<T id="settings.tab.tutorials" m="Tutorials" />}
      />
      <Tab
        path="/settings/logs"
        component={LogsTab}
        link={<T id="settings.tab.logs" m="Logs" />}
      />
    </TabbedPage>
  );
};

export default SettingsPage;
