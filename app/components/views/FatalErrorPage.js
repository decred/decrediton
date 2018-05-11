import { FormattedMessage as T } from "react-intl";
import { fatalErrorPage } from "connectors";
import { KeyBlueButton } from "buttons";
import "style/Layout.less";

class FatalErrorPage extends React.Component {

  render() {
    const { daemonError, walletError, shutdownApp } = this.props;
    return (
      <div className="page-body getstarted">
        <div className="getstarted loader">
          <T id="fatal.header.title" m="Fatal error" />:
          { daemonError &&
            <div className="shutdown-text"><T id="fatal.daemon.title" m="Daemon Error" /> {daemonError}</div>
          }
          { walletError &&
            <div className="shutdown-text"><T id="fatal.wallet.title" m="Wallet Error" /> {walletError}</div>
          }
          <KeyBlueButton onClick={shutdownApp}>
            <T id="fatal.button" m="Close Wallet"/>
          </KeyBlueButton>
        </div>
      </div>
    );
  }
}

export default fatalErrorPage(FatalErrorPage);
