import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import "style/CreateWalletForm.less";

const ExistingOrNewScreen = ({
  onSetCreateWalletFromExisting,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getDaemonSynced
}) => (
  <div className="getstarted content">
    <div className="createwallet-button-area">
      <div className="createwallet-button new" onClick={()=> onSetCreateWalletFromExisting(false)}>
        <div className="createwallet-button-label">
          <T id="getStarted.newSeedTab" m="Create a New Wallet"/>
        </div>
      </div>
      <div className="createwallet-button restore" onClick={()=> onSetCreateWalletFromExisting(true)}>
        <div className="createwallet-button-label">
          <T id="getStarted.existingSeedTab" m="Restore Existing Wallet"/>
        </div>
      </div>
    </div>
    <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, getDaemonSynced }}  />
  </div>
);

export default ExistingOrNewScreen;
