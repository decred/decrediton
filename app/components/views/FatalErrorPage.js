import { FormattedMessage as T } from "react-intl";
import { fatalErrorPage } from "connectors";
import { KeyBlueButton } from "buttons";
import "style/Layout.less";

class FatalErrorPage extends React.Component {

  render() {
    const { daemonError, walletError, shutdownApp } = this.props;
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
          <div className="fatal-error-area">
            <div className="fatal-error-suggestion">
              {daemonError.indexOf("resource temp") > 0 ?
                <T id="fatal.suggestion.resources" m="This error typically means you have another instance of daemon running.  You should check your taskmanager or profiler to shutdown any still running daemon and then try again." /> :
                <T id="fatal.suggestion.fallthrough" m="Please note the error above and go to the support channel on slack/matrix/rockchat for help resolving the issue." />
              }
            </div>
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
