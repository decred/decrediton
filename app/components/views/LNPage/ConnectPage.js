import { spring } from "react-motion";
import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { ReceiveAccountsSelect } from "inputs";
import { PassphraseModalButton, TextToggle } from "buttons";
import { TransitionMotionWrapper } from "shared";
import { lnPage } from "connectors";
import { CREATE_LN_ACCOUNT } from "actions/LNActions";

const ConnectPageHeader = () => <StandaloneHeader
  title={<T id="ln.connectPage.title" m="Connect" />}
  description={<T id="ln.connectPage.description" m={"Connect to an unlocked DCRLND wallet."} />}
  iconClassName="accounts"
/>;

const wrapperComponent = props => <div className="account-list" { ...props } />;

// The below constant MUST match what TextToggle expects/uses.
const NEW_ACCOUNT = "left";

@autobind
class ConnectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      launching: this.props.connectAttempt || this.props.startAttempt,
      autopilotEnabled: false,
      account: this.props.defaultAccount,
      accountOption: NEW_ACCOUNT
    };
  }

  onChangeAccount(account) {
    this.setState({ account });
  }

  onLaunch(passphrase) {
    this.setState({ launching: true });
    let account = null;
    if (!this.props.lightningWalletExists) {
      if (this.state.accountOption === NEW_ACCOUNT) {
        account = CREATE_LN_ACCOUNT;
      } else {
        account = this.state.account.value;
      }
    }

    this.props.startDcrlnd(passphrase, this.state.autopilotEnabled, account)
      .catch(() => this.setState({ launching: false }));
  }

  onChangeEnableAutopilot() {
    this.setState({ autopilotEnabled: !this.state.autopilotEnabled });
  }

  onAccountOptionClick(value) {
    this.setState({ accountOption: value });
  }

  getAccountsListComponent() {
    const { onChangeAccount } = this;
    const { account } = this.state;

    return [ {
      data: <>
        <ReceiveAccountsSelect
          account={account}
          onChange={onChangeAccount}
          showAccountsButton={false}
          hideSpendable={false}
        />
        <div className="existing-account-warning"><T id="ln.connectPage.useExistingAccountWarning"
          m={`Attention: note that a running LN wallet maintains unencrypted keys
          in memory while it's running and also takes control of all funds of the
          given account. It's recommended to have an account dedicated to LN
          operations and only transfer the funds you intend to use in LN to it.`} />
        </div>
      </>,
      key: "output_0",
      style: {
        height: spring(140, { stiffness: 100, damping: 14 }),
        opacity: spring(1, { stiffness: 100, damping: 20 })
      }
    } ];
  }

  getNullStyles() {
    return [ {
      data: null,
      key: "output_0",
      style: {
        height: spring(0, { stiffness: 100, damping: 14 }),
        opacity: spring(0, { stiffness: 100, damping: 20 })
      }
    } ];
  }

  renderSelectLNAccount() {
    const { onAccountOptionClick, getNullStyles, getAccountsListComponent } = this;
    const { accountOption } = this.state;

    return (
      <div className="ln-connect-opt">
        <div className="label">
          <T id="ln.connectPage.account" m="Account to use" />
        </div>
        <div className="account-selection">
          <div>
            <TextToggle
              leftText={<T id="ln.connectPage.createAccount" m="Create new" />}
              rightText={<T id="ln.connectPage.useAccount" m="Use existing" />}
              activeButton={accountOption}
              toggleAction={onAccountOptionClick}
            />
          </div>
          <TransitionMotionWrapper {...{
            styles: accountOption === NEW_ACCOUNT ? getNullStyles() : getAccountsListComponent(),
            wrapperComponent
          }} />
        </div>
        <div className="description">
          <T id="ln.connectPage.accountDescr" m="The wallet account to use for LN operations." />
        </div>
      </div>
    );
  }

  render() {
    const { onLaunch, onChangeEnableAutopilot } = this;
    const { launching, autopilotEnabled } = this.state;
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
                <input type="checkbox" checked={autopilotEnabled} onChange={onChangeEnableAutopilot} />
              </div>
              <div className="description">
                <T id="ln.connectPage.enableAutopilotDescr" m="This enables the 'autopilot' feature, which tries to automatically open channels for up to 60% of the account's spendable amounts." />
              </div>
            </div>

            {!lightningWalletExists ? this.renderSelectLNAccount() : null}
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
