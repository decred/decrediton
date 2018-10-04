import { FormattedMessage as T } from "react-intl";
import { Balance, Tooltip, CopyToClipboard } from "shared";
import { SlateGrayButton } from "buttons";

function isHidable(account) {
  return (
    account.accountName !== "imported" &&
    account.accountName !== "default" &&
    !account.total
  );
}

const HideAccountBtn = ({ hideAccount }) => (
  <Tooltip text={<T id="accounts.hide.tip" m="Hide" />}>
    <div className="hide-account-button" onClick={hideAccount} />
  </Tooltip>
);

const ShowAccountBtn = ({ showAccount }) => (
  <Tooltip text={<T id="accounts.show.tip" m="Show" />}>
    <div className="show-account-button" onClick={showAccount} />
  </Tooltip>
);

const RenameAccountBtn = ({ showRenameAccount }) => (
  <Tooltip text={<T id="accounts.rename.tip" m="Rename Account" />}>
    <div className="rename-account-button" onClick={showRenameAccount} />
  </Tooltip>
);

const DataLine = ({ children }) => (
  <div className="account-row-details-bottom-spec">
    <div className="account-row-details-bottom-spec-name">
      {children[0]}
    </div>
    <div className="account-row-details-bottom-spec-value">
      {children[1]}
    </div>
  </div>
);

const AccountsList = ({
  account,
  showRenameAccount,
  hidden,
  hideAccount,
  showAccount,
  showPubKey,
  onShowPubKey,
  accountExtendedKey
}) => (
  <div key={"details" + account.accountNumber}>
    <div className="account-row-details-bottom-columns">
      <div className="account-row-details-bottom-column-left">
        <div className="account-row-details-bottom-title">
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
      </div>

      <div className="account-row-details-bottom-column-right">
        <div className="account-row-details-bottom-title">
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
          <T id="accounts.keys.counts" m="{external} external, {internal} internal, {imported} imported"
            values={{
              external: account.externalKeys,
              internal: account.internalKeys,
              imported: account.importedKeys }} />
        </DataLine>
      </div>
    </div>

    <div className="account-actions">
      {account.accountName !== "imported" &&
        <div className="account-actions-pubkey">
          <div className="account-actions-pubkey-label">
            <T id="account.pubKey" m="Extended Public Key"/>
          </div>
          {showPubKey && accountExtendedKey?
            <Aux>
              <div className="account-actions-pubkey-area">
                {accountExtendedKey}
              </div>
              <CopyToClipboard textToCopy={accountExtendedKey} className="account-actions-pubkey-clipboard" />
            </Aux> :
            <SlateGrayButton className="account-actions-pubkey-button" onClick={onShowPubKey}><T id="account.reveal" m="Reveal"/></SlateGrayButton>
          }
        </div>
      }
      <div className="account-actions-buttons">
        {account.accountName !== "imported" && <RenameAccountBtn {...{ showRenameAccount }} /> }
        {isHidable(account) && !hidden && <HideAccountBtn {...{ hideAccount }} /> }
        {hidden && <ShowAccountBtn {...{ showAccount }} /> }
      </div>
    </div>
  </div>
);

AccountsList.propTypes = {
  account: PropTypes.object.isRequired,
  showRenameAccount: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  hideAccount: PropTypes.func.isRequired,
  showAccount: PropTypes.func.isRequired,
};

export default AccountsList;
