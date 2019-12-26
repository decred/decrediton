import CreateWalletHeader from "./CreateWalletHeader"; 
import { LoaderBarBottom } from "indicators";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

const CreateWalletPage = ({
  sendBackEvent, StateComponent, getCurrentBlockCount, getNeededBlocks,
  getEstimatedTimeLeft, getDaemonSynced
}) => (
  <div className="getstarted content">
    <CreateWalletHeader {...{ onBack: sendBackEvent }} />
    { StateComponent && (React.isValidElement(StateComponent) ? StateComponent : <StateComponent /> )}
    <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, getDaemonSynced }}  />
  </div>
);

export default CreateWalletPage;
