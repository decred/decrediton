import { FormattedMessage as T } from "react-intl";
import AccountRow from "./AccountRow/AccountRow";
import { DecredLoading } from "indicators";
import { InfoDocModalButton } from "buttons";
import { Subtitle } from "shared";
import style from "./Accounts.module.css";

const SubtitleInfoIcon = React.memo(() => (
  <div className={style.accountContentTitleButtonsArea}>
    <InfoDocModalButton
      document="BalanceOverviewInfo"
      modalClassName={style.infoFields}
      double
      draggable
    />
  </div>
));

const SubtitleWalletName = React.memo(({ walletName }) => (
  <span>
    <span className={style.walletName}>{walletName}</span>
    <T id="accounts.subtitle" m="Accounts" />
  </span>
));

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
          title={<SubtitleWalletName {...{ walletName }} />}
          className={style.isRow}
          children={<SubtitleInfoIcon />}
        />
        <div className={style.accountContentNest}>
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
