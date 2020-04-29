import { LoaderBarBottom } from "indicators";
import "style/GetStarted.less";

const CreateWalletPage = ({
  StateComponent,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getDaemonSynced
}) => (
  <div className="getstarted content">
    {StateComponent &&
      (React.isValidElement(StateComponent) ? (
        StateComponent
      ) : (
        <StateComponent />
      ))}
    <LoaderBarBottom
      {...{
        getCurrentBlockCount,
        getNeededBlocks,
        getEstimatedTimeLeft,
        getDaemonSynced
      }}
    />
  </div>
);

export default CreateWalletPage;
