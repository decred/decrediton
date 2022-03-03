import { FormattedMessage as T } from "react-intl";
import { Tooltip, classNames } from "pi-ui";
import { Balance } from "shared";
import { SlateGrayButton, CopyToClipboardButton } from "buttons";
import { IMPORTED_ACCOUNT, DEFAULT_ACCOUNT } from "constants";
import DataLine from "./DataLine";
import styles from "./AccountDetails.module.css";

const isHidable = (account) =>
  account.accountName !== IMPORTED_ACCOUNT &&
  account.accountName !== DEFAULT_ACCOUNT &&
  !account.total;

const AccountsDetails = ({
  account,
  showRenameAccount,
  hidden,
  dexAccount,
  hideAccount,
  showAccount,
  showPubKey,
  onTogglePubkey,
  accountExtendedKey
}) => (
  <div key={`details${account.accountNumber}`}>
    <div className={styles.columns}>
      <div className={styles.columnLeft}>
        <div className={styles.title}>
          <T id="accounts.balances" m="Balances" />
        </div>
        <DataLine>
          <T id="accounts.total" m="Total" />
          <Balance flat amount={account.total} />
        </DataLine>
        <DataLine>
          <T id="accounts.details.spendable" m="Spendable" />
          <Balance flat amount={account.spendable} />
        </DataLine>
        <DataLine>
          <T id="accounts.immatureRewards" m="Immature Rewards" />
          <Balance flat amount={account.immatureReward} />
        </DataLine>
        <DataLine>
          <T id="accounts.lockedByTickets" m="Locked By Tickets" />
          <Balance flat amount={account.lockedByTickets} />
        </DataLine>
        <DataLine>
          <T id="accounts.votingAuthority" m="Voting Authority" />
          <Balance flat amount={account.votingAuthority} />
        </DataLine>
        <DataLine>
          <T
            id="accounts.immatureStakingRewards"
            m="Immature Staking Rewards"
          />
          <Balance flat amount={account.immatureStakeGeneration} />
        </DataLine>
        <DataLine>
          <T id="accounts.unconfirmed" m="Unconfirmed" />
          <Balance flat amount={account.unconfirmed} />
        </DataLine>
      </div>
      <div className={styles.columnRight}>
        <div className={styles.title}>
          <T id="accounts.properties" m="Properties" />
        </div>
        <DataLine>
          <T id="accounts.number" m="Account number" />
          {account.accountNumber}
        </DataLine>
        <DataLine>
          <T id="accounts.hdPath" m="HD Path" />
          {account.HDPath}
        </DataLine>
        <DataLine>
          <T id="accounts.keys" m="Keys" />
          <T
            id="accounts.keys.counts"
            m="{external} external, {internal} internal, {imported} imported"
            values={{
              external: account.externalKeys,
              internal: account.internalKeys,
              imported: account.importedKeys
            }}
          />
        </DataLine>
      </div>
    </div>
    <div className={classNames(styles.actions, styles.isRow)}>
      {account.accountName !== IMPORTED_ACCOUNT && (
        <div className={styles.pubkey}>
          <div className={styles.pubkeyLabel}>
            <T id="account.pubKey" m="Extended Public Key" />
          </div>
          {showPubKey && accountExtendedKey ? (
            <>
              <div className={styles.pubkeyArea}>{accountExtendedKey}</div>
              <CopyToClipboardButton
                textToCopy={accountExtendedKey}
                className={styles.pubkeyClipboard}
              />
            </>
          ) : (
            <SlateGrayButton className={styles.pubkeyButton}>
              <T id="account.Hidden" m="Hidden" />
            </SlateGrayButton>
          )}
        </div>
      )}
      <div className={classNames(styles.buttons, "flex-row")}>
        {account.accountName !== IMPORTED_ACCOUNT &&
          account.accountName !== dexAccount && (
            <Tooltip
              content={<T id="accounts.rename.tip" m="Rename Account" />}>
              <div
                className={styles.renameButton}
                onClick={showRenameAccount}
              />
            </Tooltip>
          )}
        {account.accountName !== IMPORTED_ACCOUNT && (
          <Tooltip
            content={
              showPubKey ? (
                <T id="accounts.hide.pubkey" m="Hide Pubkey" />
              ) : (
                <T id="accounts.reveal.pubkey" m="Reveal Pubkey" />
              )
            }>
            <div
              className={classNames(
                styles.revealPubkeyButton,
                showPubKey
                  ? styles.revealPubkeyButtonHide
                  : styles.revealPubkeyButtonShow
              )}
              onClick={onTogglePubkey}
            />
          </Tooltip>
        )}
        {isHidable(account) && !hidden && (
          <Tooltip content={<T id="accounts.hide.tip" m="Hide" />}>
            <div className={styles.hideButton} onClick={hideAccount} />
          </Tooltip>
        )}
        {hidden && (
          <Tooltip content={<T id="accounts.show.tip" m="Show" />}>
            <div className={styles.showButton} onClick={showAccount} />
          </Tooltip>
        )}
      </div>
    </div>
  </div>
);

AccountsDetails.propTypes = {
  account: PropTypes.object.isRequired,
  showRenameAccount: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  hideAccount: PropTypes.func.isRequired,
  showAccount: PropTypes.func.isRequired
};

export default AccountsDetails;
