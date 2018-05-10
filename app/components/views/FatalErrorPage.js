import { FormattedMessage as T } from "react-intl";
import { fatalErrorPage } from "connectors";
import "style/Layout.less";

class FatalErrorPage extends React.Component {

  render() {
    const { daemonError, walletError } = this.props;
    return (
      <div className="page-body getstarted">
        <T id="fatal.header.title" m="Fatal error" />:
        { daemonError &&
          <div className="shutdown-text"><T id="fatal.daemon.title" m="Daemon Error" /> {daemonError}</div>
        }
        { walletError &&
          <div className="shutdown-text"><T id="fatal.wallet.title" m="Wallet Error" /> {walletError}</div>
        }
      </div>
    );
  }
}

export default fatalErrorPage(FatalErrorPage);
