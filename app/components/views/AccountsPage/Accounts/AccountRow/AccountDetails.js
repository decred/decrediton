import { FormattedMessage as T } from "react-intl";
import Balance from "Balance";
import { Tooltip } from "shared";

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
              <T id="accounts.keys.external" m="{keys} external" values={{ keys: account.externalKeys }} />
              <T id="accounts.keys.internal" m="{keys} internal" values={{ keys: account.internalKeys }} />
              <T id="accounts.keys.imported" m="{keys} imported" values={{ keys: account.importedKeys }} />
            </div>
          </div>
        </div>
      </div>
      <div className="account-actions">
        {account.accountName !== "imported" ?
          <Tooltip text={<T id="accounts.rename.tip" m="Rename Account" />}>
            <div className="rename-account-button" onClick={showRenameAccount} />
          </Tooltip> :
          <div></div>
        }
        {account.accountName !== "imported" && account.accountName !== "default" && account.total == 0 && !hidden ?
          <Tooltip text={<T id="accounts.show.tip" m="Show" />}>
            <div className="hide-account-button" onClick={hideAccount} />
          </Tooltip> :
          account.accountName !== "imported" && account.accountName !== "default" && hidden ?
            <Tooltip text={<T id="accounts.hide.tip" m="Hide" />}>
              <div className="show-account-button" onClick={showAccount} />
            </Tooltip> :
            <div></div>
        }
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
