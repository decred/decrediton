// @flow
import { FormattedMessage as T } from "react-intl";
import { invalidRPCVersion } from "connectors";
import { TabbedHeader } from "shared";

const InvalidRPCVersion = ({ requiredWalletRPCVersion, walletRPCVersion, routes }) => (
  <div className="page-view">
    <TabbedHeader {...{ routes }}/>
    <div className="page-content">
      <div className="invalid-rpc-info">
        <T
          id="invalidRPCVersion.info"
          m={`The API of the currently running wallet ({walletRPCVersion}) is not compatible with Hxify (required version {requiredWalletRPCVersion}).

          Please update the daemon (Hxd) and wallet (Hxwallet) to the latest version, then try again.

          See the "Help ⮕ About" menu for the current version of the executables.`}
          values={{ walletRPCVersion, requiredWalletRPCVersion }}
        />
      </div>
    </div>
  </div>
);

InvalidRPCVersion.propTypes = {
  requiredWalletRPCVersion: PropTypes.string.isRequired,
  walletRPCVersion: PropTypes.string.isRequired
};

export default invalidRPCVersion(InvalidRPCVersion);
