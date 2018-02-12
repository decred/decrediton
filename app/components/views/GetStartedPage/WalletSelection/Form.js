import Header from "Header";
import CreateWalletForm from "./CreateWalletForm";
import SelectAvailableWalletsForm from "./SelectAvailableWalletsForm";
import { FormattedMessage as T, injectIntl } from "react-intl";
import "style/LoginForm.less";

export const WalletSelectionFormHeader = () => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.walletSelect.title" m="Select the Wallet to Load" />}
    headerMetaOverview={<T id="getStarted.walletSelect.meta" m="Please select which wallet you would like to load for usage." />} />
);

const WalletSelectionBodyBase = ({
  availableWallets,
  sideActive,
  onShowCreateWallet,
  onShowSelectWallet,
  intl,
  ...props,
}) => {
  return (
    availableWallets && availableWallets.length > 0 ?
      <div className="advanced-page">
        <div className="advanced-page-toggle">
          <div className="text-toggle">
            <div className={"text-toggle-button-left " + (!sideActive && "text-toggle-button-active")} onClick={sideActive ? onShowCreateWallet : null}>
              <T id="advancedDaemon.toggle.remote" m="Select Available Wallet" />
            </div>
            <div className={"text-toggle-button-right " + (sideActive && "text-toggle-button-active")} onClick={!sideActive ? onShowSelectWallet : null}>
              <T id="advancedDaemon.toggle.appdata" m="Create New Wallet" />
            </div>
          </div>
        </div>
        <div className="advanced-page-form">
          {sideActive ? <CreateWalletForm {...{ ...props, intl }} />:<SelectAvailableWalletsForm {...{ ...props, intl, availableWallets }} />}
        </div>
      </div> :
      <div className="advanced-page">
        <div className="advanced-page-form">
          <CreateWalletForm {...{ ...props, intl }} />
        </div>
      </div>
  );
};

export const WalletSelectionFormBody = injectIntl(WalletSelectionBodyBase);
