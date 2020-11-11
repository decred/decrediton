import { spring } from "react-motion";
import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { ReceiveAccountsSelect, PathBrowseInput } from "inputs";
import { PassphraseModalButton, TextToggle, InfoDocModalButton, KeyBlueButton } from "buttons";
import { TransitionMotionWrapper, Documentation } from "shared";
import { lnPage } from "connectors";
import { Checkbox } from "pi-ui";
import {
  CREATE_LN_ACCOUNT,
  LNWALLET_STARTUPSTAGE_STARTDCRLND,
  LNWALLET_STARTUPSTAGE_CONNECT,
  LNWALLET_STARTUPSTAGE_UNLOCK,
  LNWALLET_STARTUPSTAGE_STARTUPSYNC,
  LNWALLET_STARTUPSTAGE_SCBRESTORE
} from "actions/LNActions";
import "style/ConnectPage.css";

const ConnectPageHeader = () => (
  <StandaloneHeader
    title={<T id="ln.connectPage.title" m="Start LN Wallet" />}
    description={
      <T
        id="ln.connectPage.description"
        m={"Start, unlock and connect to the dcrlnd wallet."}
      />
    }
    iconClassName="accounts"
  />
);

const CreateLNWalletPageHeader = () => (
  <StandaloneHeader
    title={<T id="ln.createLNWalletPage.title" m="Create Lightning Wallet" />}
    description={
      <T
        id="ln.createLNWalletPage.description"
        m={"Create a new Lightning Network wallet backed by the Decrediton wallet."}
      />
    }
    iconClassName="accounts"
  />
);

const stageMsgs = {
  [LNWALLET_STARTUPSTAGE_STARTDCRLND]: (
    <T id="ln.startupStage.startDcrlnd" m="Starting dcrlnd" />
  ),
  [LNWALLET_STARTUPSTAGE_CONNECT]: (
    <T id="ln.startupStage.connect" m="Connecting to dcrlnd" />
  ),
  [LNWALLET_STARTUPSTAGE_UNLOCK]: (
    <T id="ln.startupStage.unlock" m="Unlocking LN wallet" />
  ),
  [LNWALLET_STARTUPSTAGE_STARTUPSYNC]: (
    <T id="ln.startupStage.startupSync" m="Syncing LN wallet to network" />
  ),
  [LNWALLET_STARTUPSTAGE_SCBRESTORE]: (
    <T id="ln.startupStage.scbRestore" m="Restoring backup" />
  )
};

const LNStartupStage = ({ stage }) => (
  <div className="ln-startup-stage">
    {stageMsgs[stage] ? stageMsgs[stage] : null}
  </div>
);

const LNCreationWarning = ({ onAcceptCreationWarning }) => (
  <div className="documentation">
    <Documentation name="LNWalletCreationWarning" />
    <KeyBlueButton onClick={onAcceptCreationWarning}>
      <T id="ln.createWalletWarning.okBtn" m="I understand and accept the risks"/>
    </KeyBlueButton>
  </div>
);

const wrapperComponent = (props) => <div className="accountList" {...props} />;

// The below constant MUST match what TextToggle expects/uses.
const NEW_ACCOUNT = "left";

@autobind
class ConnectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autopilotEnabled: false,
      account: this.props.defaultAccount,
      accountOption: NEW_ACCOUNT,
      scbFile: "",
      displayCreationWarning: !props.lightningWalletExists
    };
  }

  setScbFile(scbFile) {
    this.setState({ scbFile });
  }

  onChangeAccount(account) {
    this.setState({ account });
  }

  onLaunch(passphrase) {
    let account = null;
    if (!this.props.lightningWalletExists) {
      if (this.state.accountOption === NEW_ACCOUNT) {
        account = CREATE_LN_ACCOUNT;
      } else {
        account = this.state.account.value;
      }
    }

    this.props.startDcrlnd(
      passphrase,
      this.state.autopilotEnabled,
      account,
      this.state.scbFile
    );
  }

  onChangeEnableAutopilot() {
    this.setState({ autopilotEnabled: !this.state.autopilotEnabled });
  }

  onAccountOptionClick(value) {
    this.setState({ accountOption: value });
  }

  onAcceptCreationWarning() {
    this.setState({ displayCreationWarning: false });
  }

  getAccountsListComponent() {
    const { onChangeAccount } = this;
    const { account } = this.state;

    return [
      {
        data: (
          <>
            <ReceiveAccountsSelect
              account={account}
              onChange={onChangeAccount}
              showAccountsButton={false}
              hideSpendable={false}
            />
            <div className="existingAccountWarning">
              <T
                id="ln.connectPage.useExistingAccountWarning"
                m={`Attention: note that a running LN wallet maintains unencrypted keys
          in memory while it's running and also takes control of all funds of the
          given account. It's recommended to have an account dedicated to LN
          operations and only transfer the funds you intend to use in LN to it.`}
              />
            </div>
          </>
        ),
        key: "output_0",
        style: {
          height: spring(140, { stiffness: 100, damping: 14 }),
          opacity: spring(1, { stiffness: 100, damping: 20 })
        }
      }
    ];
  }

  getNullStyles() {
    return [
      {
        data: null,
        key: "output_0",
        style: {
          height: spring(0, { stiffness: 100, damping: 14 }),
          opacity: spring(0, { stiffness: 100, damping: 20 })
        }
      }
    ];
  }

  renderSelectLNAccount() {
    const {
      onAccountOptionClick,
      getNullStyles,
      getAccountsListComponent
    } = this;
    const { accountOption } = this.state;

    return (
      <div className="connectOpt">
        <div className="label">
          <T id="ln.connectPage.account" m="Wallet account to use" />
        </div>
        <div className="accountSelection">
          <div>
            {/* XXX: Can we use here pi-iu's toggle? */}
            <TextToggle
              leftText={<T id="ln.connectPage.createAccount" m="Create new" />}
              rightText={<T id="ln.connectPage.useAccount" m="Use existing" />}
              activeButton={accountOption}
              toggleAction={onAccountOptionClick}
            />
          </div>
          <TransitionMotionWrapper
            {...{
              styles:
                accountOption === NEW_ACCOUNT
                  ? getNullStyles()
                  : getAccountsListComponent(),
              wrapperComponent
            }}
          />
        </div>
      </div>
    );
  }

  renderCreateLNWallet() {
    return (
      <>
        {this.renderSelectLNAccount()}
        <div className="connectOpt">
          <div className="label">
            <T id="ln.connectPage.backupFile" m="Restore SCB backup" />
          </div>
          <div className="fileInput">
            <PathBrowseInput
              open
              type="file"
              value={this.state.scbFile}
              onChange={(value) => this.setScbFile(value)}
            />
          </div>

          <InfoDocModalButton
            document="LNBackupInfo"
            modalClassName="info-modal-fields"
            double
            draggable
          />
        </div>
      </>
    );
  }

  render() {
    const { onLaunch, onChangeEnableAutopilot, onAcceptCreationWarning } = this;
    const { autopilotEnabled, displayCreationWarning } = this.state;
    const { lightningWalletExists, startAttempt, startupStage } = this.props;

    if (displayCreationWarning) {
      return (
        <StandalonePage header={<CreateLNWalletPageHeader />}>
          <LNCreationWarning onAcceptCreationWarning={onAcceptCreationWarning}/>
        </StandalonePage>
      );
    }

    const header = lightningWalletExists
      ? <ConnectPageHeader />
      : <CreateLNWalletPageHeader />;

    return (
      <StandalonePage header={header}>
        <div>
          <div className="connectOpts">
            {!lightningWalletExists ? this.renderCreateLNWallet() : null}
            <div className="connectOpt checkbox">
              <Checkbox
                label={
                  <T
                  id="ln.connectPage.enableAutopilot"
                  m="Enable Automatic Channel Creation"
                />
                }
                description={
                <T
                  id="ln.connectPage.enableAutopilotDescr"
                  m="This enables the 'autopilot' feature, which tries to automatically open channels using up to 60% of the account's spendable funds."
                />
                }
                checked={autopilotEnabled}
                onChange={onChangeEnableAutopilot}
              />
            </div>

          </div>

          <PassphraseModalButton
            modalTitle={
              <T id="ln.connectPage.unlockWalletModal" m="Unlock LN Wallet" />
            }
            disabled={startAttempt}
            onSubmit={onLaunch}
            loading={startAttempt}
            buttonLabel={
              <T id="ln.connectPage.launchBtn" m="Start and Unlock LN Wallet" />
            }
          />

          <LNStartupStage stage={startupStage} />
        </div>
      </StandalonePage>
    );
  }
}

export default lnPage(ConnectPage);
