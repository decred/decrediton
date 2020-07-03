import { FormattedMessage as T } from "react-intl";
import AccountRow from "./AccountRow";
import { DecredLoading } from "indicators";
import { InfoDocModalButton } from "buttons";
import { Subtitle } from "shared";
<<<<<<< HEAD
import style from "../AccountsPage.module.css";
=======
import style from "./Accounts.module.css";
>>>>>>> a5142a4d... Create Accounts.module.css

const subtitleInfoIcon = () => (
  <div className={style["account-content-title-buttons-area"]}>
    <InfoDocModalButton
      document="BalanceOverviewInfo"
      modalClassName={style.infoFields}
      double
      draggable
    />
  </div>
);

const subtitleWalletName = ({ walletName }) => (
  <span>
    <span className={style["wallet-name"]}>{walletName}</span>
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
        <div className={style["account-content-nest"]}>
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
