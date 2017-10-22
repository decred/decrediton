// @flow
import React, {Component} from "react";
import Header from "../Header";
import { FormattedMessage as T } from "react-intl";
import PropTypes from "prop-types";
import invalidRPCVersion from "../../connectors/invalidRPCVersion";
import "../../style/Layout.less";

const propTypes = {
  showSidebar: PropTypes.func.isRequired,
  hideSidebarMenu: PropTypes.func.isRequired,
  requiredWalletRPCVersion: PropTypes.string.isRequired,
  walletRPCVersion: PropTypes.string.isRequired
};

class InvalidRPCVersion extends Component{

  render() {
    const { walletRPCVersion, requiredWalletRPCVersion } = this.props;
    return (
      <div className="page-view">
        <Header
          headerTitleOverview={<T id="invalidRPCVersion.title" m="Invalid RPC Version" />}
        />
        <div className="page-content">
          <div className="invalid-rpc-info">
            <T
              id="invalidRPCVersion.info"
              m={`The API of the currently running wallet ({walletRPCVersion}) is not compatible with Decrediton (required version {requiredWalletRPCVersion}).

              Please update the daemon (dcrd) and wallet (dcrwallet) to the latest version, then try again.

              See the "Help ⮕ About" menu for the current version of the executables.`}
              values={{ walletRPCVersion, requiredWalletRPCVersion }}
            />
          </div>
        </div>
      </div>
    );
  }
}

InvalidRPCVersion.propTypes = propTypes;

export default invalidRPCVersion(InvalidRPCVersion);
