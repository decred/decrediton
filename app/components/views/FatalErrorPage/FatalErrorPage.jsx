import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, RemoveDaemonButton } from "buttons";
import { CopyToClipboard, ExternalLink } from "shared";
import { DIFF_CONNECTION_ERROR } from "constants";
import { getAppDataDirectory } from "main_dev/paths.js";
import { useFatalErrorPage } from "./hooks";
import styles from "./FatalErrorPage.module.css";

// right now we need to add logs by hand. It would be good having a better way
// of recognizing errors.
const resourcesUnavailableError = "resource temporarily unavailable";

const corruptedError = "corrupted";

const checkSumError = "checksum does not match";

function FatalErrorPage() {
  const {
    daemonError,
    walletError,
    isAdvancedDaemon,
    shutdownApp,
    backToCredentials,
    deleteDaemonData
  } = useFatalErrorPage();

  const getErrorAction = () => {
    let errorMessage;

    switch (true) {
      case daemonError.indexOf(resourcesUnavailableError) !== -1:
        errorMessage = (
          <T
            id="fatal.suggestion.resources"
            m="This error typically means you have another instance of daemon running.  You should check your taskmanager or profiler to shutdown any still running daemon and then try again."
          />
        );
        break;
      case daemonError.indexOf(DIFF_CONNECTION_ERROR) !== -1:
        errorMessage = (
          <>
            <T
              id="fatal.suggestion.diffConnection"
              m="This error typically means you have the testnet flag in your dcrd.conf file. You should check your dcrd.conf file and remove the testnet=1."
            />
            <div>config files path:{getAppDataDirectory()}</div>
          </>
        );
        break;
      case daemonError.indexOf(corruptedError) !== -1 ||
        daemonError.indexOf(checkSumError) !== -1:
        errorMessage = (
          <>
            <div className={styles.reset}>
              <T
                id="fatal.suggestion.corrupted"
                m="This error means your blockchain data has somehow become corrupted.  Typically, this is caused by a sector on the HDD/SDD that went bad and its built-in SMART didn't repair it, or the more likely case, there was a memory issue which corrupted the data.  To resolve, you must delete your blockchain data and re-download.  Press the button below to complete the process. When you restart Decrediton, it will automatically begin your blockchain download. Please come to our support channel on slack/matrix/discord to get advice about running disk utilities. "
              />
            </div>
            <RemoveDaemonButton
              className={styles.removeButton}
              modalTitle={
                <T id="fatal.removeConfirmModal.title" m="Remove daemon data" />
              }
              modalContent={
                <T
                  id="fatal.removeConfirmModal.content"
                  m="Warning this action is permanent! Please make sure you want to remove your blockchain data before proceeding. Decrediton will automatically shutdown after deleting the folder. Please manually restart it afterwards."
                />
              }
              onSubmit={deleteDaemonData}
              buttonLabel={
                <T id="fatal.button.delete" m="Delete and Shutdown" />
              }
            />
          </>
        );
        break;
      default:
        errorMessage = (
          <T
            id="fatal.suggestion.fallthrough"
            m="Please note the error above and go to the support channel on matrix or some other preferred
            chat channel for help resolving the issue. {link}"
            values={{
              link: (
                <ExternalLink href="https://decred.org/community">
                  https://decred.org/community
                </ExternalLink>
              )
            }}
          />
        );
        break;
    }

    return errorMessage;
  };

  return (
    <div className={styles.pageBody}>
      <div className={styles.errorPage}>
        <div className={styles.title}>
          <T id="fatal.header.title" m="Fatal error" />:
        </div>
        <div>
          <div>
            {daemonError && (
              <>
                <div className={styles.error}>
                  <T id="fatal.daemon.title" m="Daemon Error" />
                </div>
                <textarea rows="10" value={daemonError} disabled />
                <CopyToClipboard textToCopy={daemonError} />
              </>
            )}
            {walletError && (
              <>
                <div className={styles.error}>
                  <T id="fatal.wallet.title" m="Wallet Error" />
                </div>
                <CopyToClipboard textToCopy={walletError} />
                <textarea rows="10" value={walletError} disabled />
              </>
            )}
          </div>
        </div>
        <div className={styles.title}>
          <T
            id="fatal.suggestion.title"
            m="Suggested action to resolve the error"
          />
          :
        </div>
        <div className={styles.suggestion}>
          {daemonError && getErrorAction()}
        </div>
        <div className={styles.toolbar}>
          {isAdvancedDaemon && (
            <KeyBlueButton
              className={styles.button}
              onClick={backToCredentials}>
              <T
                id="fatal.retry.connection.button"
                m="Return to Daemon Connection"
              />
            </KeyBlueButton>
          )}
          <KeyBlueButton className={styles.button} onClick={shutdownApp}>
            <T id="fatal.button" m="Close Decrediton" />
          </KeyBlueButton>
        </div>
      </div>
    </div>
  );
}

export default FatalErrorPage;
