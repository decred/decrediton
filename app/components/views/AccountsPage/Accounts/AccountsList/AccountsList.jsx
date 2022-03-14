import AccountRow from "../AccountRow";
import { DecredLoading } from "indicators";
import { Subtitle } from "shared";
import SubtitleInfoIcon from "../SubtitleInfoIcon";
import SubtitleWalletName from "../SubtitleWalletName";
import styles from "./AccountsList.module.css";

const AccountsList = ({
  accounts,
  mixedAccount,
  dexAccount,
  changeAccount,
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
          className="flex-row"
          children={<SubtitleInfoIcon />}
        />
        <div className={styles.contentNest}>
          {accounts.map((account) => (
            <AccountRow
              {...{
                hasTickets,
                account,
                mixedAccount,
                dexAccount,
                changeAccount,
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
