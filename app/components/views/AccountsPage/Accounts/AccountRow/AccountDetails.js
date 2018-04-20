import { FormattedMessage as T } from "react-intl";
import { Balance, Tooltip } from "shared";

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

const AccountsList = ({
  account,
  showRenameAccount,
  hidden,
  hideAccount,
  showAccount,
}) => (
  <div className="account-row-details-bottom" key={"details" + account.accountNumber}>
    <div className="account-row-details-bottom-columns">
      <div className="account-row-details-bottom-column-left">
        <div className="account-row-details-bottom-title">
          <div className="account-row-details-bottom-title-name">
            <T id="accounts.balances" m="Balances" />
          </div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name">
            <T id="accounts.total" m="Total" />
          </div>
          <div className="account-row-details-bottom-spec-value"><Balance amount={account.total} /></div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name">
            <T id="accounts.details.spendable" m="Spendable" />
          </div>
          <div className="account-row-details-bottom-spec-value"><Balance amount={account.spendable} /></div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name">
            <T id="accounts.immatureRewards" m="Immature Rewards" />
          </div>
          <div className="account-row-details-bottom-spec-value"><Balance amount={account.immatureReward} /></div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name">
            <T id="accounts.lockedByTickets" m="Locked By Tickets" />
          </div>
          <div className="account-row-details-bottom-spec-value"><Balance amount={account.lockedByTickets} /></div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name">
            <T id="accounts.votingAuthority" m="Voting Authority" />
          </div>
          <div className="account-row-details-bottom-spec-value"><Balance amount={account.votingAuthority} /></div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name">
            <T id="accounts.immatureStake" m="Immature Stake Generation" />
          </div>
          <div className="account-row-details-bottom-spec-value"><Balance amount={account.immatureStakeGeneration} /></div>
        </div>
      </div>
      <div className="account-row-details-bottom-column-right">
        <div className="account-row-details-bottom-title">
          <div className="account-row-details-bottom-title-name"><T id="accounts.properties" m="Properties" /></div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name"><T id="accounts.number" m="Account number" /></div>
          <div className="account-row-details-bottom-spec-value">{account.accountNumber}</div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name"><T id="accounts.hdPath" m="HD Path" /></div>
          <div className="account-row-details-bottom-spec-value">{account.HDPath}</div>
        </div>
        <div className="account-row-details-bottom-spec">
          <div className="account-row-details-bottom-spec-name"><T id="accounts.keys" m="Keys" /></div>
          <div className="account-row-details-bottom-spec-value">
            <T id="accounts.keys.counts" m="{external} external, {internal} internal, {imported} imported"
              values={{
                external: account.externalKeys,
                internal: account.internalKeys,
                imported: account.importedKeys }} />
          </div>
        </div>
      </div>
    </div>
    <div className="account-actions">
      {account.accountName !== "imported" ? <RenameAccountBtn {...{ showRenameAccount }} /> : null }
      {isHidable(account) && !hidden ? <HideAccountBtn {...{ hideAccount }} /> : null }
      {hidden ? <ShowAccountBtn {...{ showAccount }} /> : null }
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
