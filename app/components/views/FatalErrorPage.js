import { FormattedMessage as T } from "react-intl";
import { fatalErrorPage } from "connectors";
import { KeyBlueButton, RemoveDaemonButton } from "buttons";
import "style/Layout.less";

const resourcesUnavailableError = "resource temporarily unavailable";

const corruptedError = "corrupted";

const checkSumError = "checksum does not match";
class FatalErrorPage extends React.Component {

  render() {
    const { daemonError, walletError, shutdownApp, deleteDaemonData } = this.props;
    return (
      <div className="page-body getstarted">
        <div className="fatal-error-page">
          <div className="fatal-error-title"><T id="fatal.header.title" m="Fatal error" />:</div>
          <div className="fatal-error-area">
            { daemonError &&
              <div className="fatal-error"><T id="fatal.daemon.title" m="Daemon Error" /> {daemonError}</div>
            }
            { walletError &&
              <div className="fatal-error"><T id="fatal.wallet.title" m="Wallet Error" /> {walletError}</div>
            }
          </div>
          <div className="fatal-error-title"><T id="fatal.suggestion.title" m="Suggested action to resolve error" />:</div>
          <div className="fatal-error-suggestion">
            {daemonError.indexOf(resourcesUnavailableError) > 0 ?
              <T id="fatal.suggestion.resources" m="This error typically means you have another instance of daemon running.  You should check your taskmanager or profiler to shutdown any still running daemon and then try again." /> :
              daemonError.indexOf(corruptedError) > 0  || daemonError.indexOf(checkSumError) ?
                <Aux>
                  <div className="fatal-error-reset-blockchain">
                    <T id="fatal.suggestion.corrupted" m="This error means your blockchain data has somehow become corrupted.  Typically, this is caused by a sector on the HDD/SDD that went bad and its built-in SMART didn't repair it, or the more likely case, there was a memory issue which corrupted the data.  To resolve, you must delete your blockchain data and re-download.  Press the button below to complete the process. When you restart Decrediton, it will automatically begin your blockchain download. Please come to our support channel on slack/matrix/discord/rocketchat to get advice about running disk utilities. " />
                  </div>
                  <RemoveDaemonButton
                    className="fatal-remove-button"
                    modalTitle={<T id="fatal.removeConfirmModal.title" m="Remove daemon data"/>}
                    modalContent={<T id="fatal.removeConfirmModal.content" m="Warning this action is permanent! Please make sure you want to remove your blockchain data before proceeding. Decrediton will automatically shutdown after deleting the folder. Please manually restart it afterwards."/>}
                    onSubmit={deleteDaemonData}
                    buttonLabel={ <T id="fatal.button.delete" m="Delete and Shutdown"/>}/>
                </Aux> :
                <T id="fatal.suggestion.fallthrough" m="Please note the error above and go to the support channel on slack/matrix/rockchat for help resolving the issue." />
            }
          </div>
          <div className="fatal-error-toolbar">
            <KeyBlueButton onClick={shutdownApp}>
              <T id="fatal.button" m="Close Wallet"/>
            </KeyBlueButton>
          </div>
        </div>
      </div>
    );
  }
}

export default fatalErrorPage(FatalErrorPage);
