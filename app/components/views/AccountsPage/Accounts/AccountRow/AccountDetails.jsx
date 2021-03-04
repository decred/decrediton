import { FormattedMessage as T } from "react-intl";
import { Tooltip, classNames } from "pi-ui";
import { Balance, CopyToClipboard } from "shared";
import { SlateGrayButton } from "buttons";
import style from "../Accounts.module.css";
import {
  IMPORTED_ACCOUNT,
  DEFAULT_ACCOUNT,
  MIXED_ACCOUNT,
  CHANGE_ACCOUNT
} from "constants";

function isHidable(account, allowSendFromUnmixed) {
  return (
    account.accountName !== IMPORTED_ACCOUNT &&
    account.accountName !== DEFAULT_ACCOUNT &&
    !account.total &&
    !(
      !allowSendFromUnmixed &&
      (account.accountName === MIXED_ACCOUNT ||
        account.accountName === CHANGE_ACCOUNT)
    )
  );
}

const DataLine = ({ children }) => (
  <div className={style.detailsBottomSpec}>
    <div className={style.detailsBottomSpecName}>{children[0]}</div>
    <div className={style.detailsBottomSpecValue}>{children[1]}</div>
  </div>
);

const AccountsDetails = ({
  account,
  showRenameAccount,
  hidden,
  hideAccount,
  showAccount,
  showPubKey,
  onTogglePubkey,
  accountExtendedKey,
  allowSendFromUnmixed
}) => (
  <div key={`details${account.accountNumber}`}>
    <div className={style.detailsBottomColumns}>
      <div className={style.detailsBottomColumnLeft}>
        <div className={style.detailsBottomTitle}>
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
          <T id="accounts.immatureStake" m="Immature Stake Gen" />
          <Balance flat amount={account.immatureStakeGeneration} />
        </DataLine>
        <DataLine>
          <T id="accounts.unconfirmed" m="Unconfirmed" />
          <Balance flat amount={account.unconfirmed} />
        </DataLine>
      </div>
      <div className={style.detailsBottomColumnRight}>
        <div className={style.detailsBottomTitle}>
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
    <div className={classNames(style.actions, style.isRow)}>
      {account.accountName !== IMPORTED_ACCOUNT && (
        <div className={style.actionsPubkey}>
          <div className={style.actionsPubkeyLabel}>
            <T id="account.pubKey" m="Extended Public Key" />
          </div>
          {showPubKey && accountExtendedKey ? (
            <>
              <div className={style.actionsPubkeyArea}>
                {accountExtendedKey}
              </div>
              <CopyToClipboard
                textToCopy={accountExtendedKey}
                className={style.actionsPubkeyClipboard}
              />
            </>
          ) : (
            <SlateGrayButton className={style.actionsPubkeyButton}>
              <T id="account.Hidden" m="Hidden" />
            </SlateGrayButton>
          )}
        </div>
      )}
      <div className={classNames(style.actionsButtons, style.isRow)}>
        {account.accountName !== IMPORTED_ACCOUNT && (
          <Tooltip content={<T id="accounts.rename.tip" m="Rename Account" />}>
            <div className={style.renameButton} onClick={showRenameAccount} />
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
                style.revealPubkeyButton,
                showPubKey
                  ? style.revealPubkeyButtonHide
                  : style.revealPubkeyButtonShow
              )}
              onClick={onTogglePubkey}
            />
          </Tooltip>
        )}
        {isHidable(account, allowSendFromUnmixed) && !hidden && (
          <Tooltip text={<T id="accounts.hide.tip" m="Hide" />}>
            <div className={style.hideButton} onClick={hideAccount} />
          </Tooltip>
        )}
        {hidden && (
          <Tooltip content={<T id="accounts.show.tip" m="Show" />}>
            <div className={style.showButton} onClick={showAccount} />
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
