import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { AccountsSelect } from "inputs";
import { PassphraseModalButton } from "buttons";
import { lnPage } from "connectors";

const ConnectPageHeader = () => <StandaloneHeader
  title={<T id="ln.connectPage.title" m="Connect" />}
  description={<T id="ln.connectPage.description" m={"Connect to an unlocked DCRLND wallet."} />}
  iconClassName="accounts"
/>;

@autobind
class ConnectPage extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      connecting: false,
      launching: false,
      autopilotEnabled: false,
      account: this.props.account,
      ...props.getWalletConfig()
    };
  }

  onChangeAccount(account) {
    this.setState({ account });
  }

  onLaunch(passphrase) {
    this.setState({ launching: true });
    const account = !this.props.lightningWalletExists
      ? this.state.account.value
      : null;
    this.props.startDcrlnd(passphrase, this.state.autopilotEnabled, account)
      .then(() => this.setState({ launching: false }))
      .catch(() => this.setState({ launching: false }));
  }

  onChangeEnableAutopilot() {
    this.setState({ autopilotEnabled: !this.state.autopilotEnabled });
  }

  render() {
    const { onLaunch, onChangeEnableAutopilot, onChangeAccount } = this;
    const { launching, autopilotEnabled, account } = this.state;
    const { lightningWalletExists } = this.props;

    return (
      <StandalonePage header={<ConnectPageHeader />}>
        <div>
          <div className="ln-connect-opts">
            <div className="ln-connect-opt">
              <div className="label">
                <T id="ln.connectPage.enableAutopilot" m="Enable Automatic Channel Creation" />
              </div>
              <div className="checkbox">
                <input type="checkbox" checked={autopilotEnabled} onChange={onChangeEnableAutopilot}/>
              </div>
              <div className="description">
                <T id="ln.connectPage.enableAutopilotDescr" m="This enables the 'autopilot' feature, which tries to automatically open channels for up to 60% of the account's spendable amounts." />
              </div>
            </div>

            { !lightningWalletExists
              ? <div className="ln-connect-opt">
                <div className="label">
                  <T id="ln.connectPage.account" m="Account to use" />
                </div>
                <div className="account-list">
                  <AccountsSelect
                    account={account}
                    onChange={onChangeAccount}
                    showAccountsButton={false}
                    hideSpendable={false}
                  />
                </div>
                <div className="description">
                  <T id="ln.connectPage.accountDescr" m="The account to use for LN operations." />
                </div>
              </div>
              : null
            }

          </div>

          <PassphraseModalButton
            modalTitle={<T id="ln.connectPage.unlockWalletModal" m="Unlock LN Wallet" />}
            disabled={launching}
            onSubmit={onLaunch}
            loading={launching}
            buttonLabel={<T id="ln.connectPage.launchBtn" m="Start and Unlock LN Wallet" />}
          />
        </div>
      </StandalonePage>
    );
  }
}

export default lnPage(ConnectPage);
