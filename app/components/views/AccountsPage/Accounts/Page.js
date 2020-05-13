import { FormattedMessage as T } from "react-intl";
import AccountRow from "./AccountRow";
import { DecredLoading } from "indicators";
import { InfoDocModalButton } from "buttons";
import { Subtitle } from "shared";

const subtitleInfoIcon = () => (
  <div className="account-content-title-buttons-area">
    <InfoDocModalButton
      document="BalanceOverviewInfo"
      modalClassName="info-modal-fields"
      double
      draggable
    />
  </div>
);

const subtitleWalletName = ({ walletName }) => (
  <span>
    <span className="wallet-name">{walletName}</span>
    <T id="accounts.subtitle" m="Accounts" />
  </span>
);

const AccountsList = ({
  accounts,
  isLoading,
  onGetAccountExtendedKey,
  accountExtendedKey,
  onShowAccount,
  onHideAccount,
  onRenameAccount,
  accountNumDetailsShown,
  walletName,
  hasTickets
}) => (
  <>
    {isLoading ? (
      <DecredLoading />
    ) : (
      <>
        <Subtitle
          title={subtitleWalletName({ walletName })}
          className={"is-row"}
          children={subtitleInfoIcon()}
        />
        <div className="account-content-nest">
          {accounts.map((account) => (
            <AccountRow
              {...{
                hasTickets,
                account,
                accountNumDetailsShown,
                onGetAccountExtendedKey,
                accountExtendedKey
              }}
              key={account.accountName}
              renameAccount={onRenameAccount}
              hideAccount={onHideAccount}
              showAccount={onShowAccount}
            />
          ))}
        </div>
      </>
    )}
  </>
);

AccountsList.propTypes = {
  accounts: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onShowAccount: PropTypes.func.isRequired,
  onHideAccount: PropTypes.func.isRequired,
  onRenameAccount: PropTypes.func.isRequired,
  accountNumDetailsShown: PropTypes.number
};

export default AccountsList;
