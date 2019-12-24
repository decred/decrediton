import { AnimatedLinearProgressFull } from "indicators";
import { SlateGrayButton, InvisibleButton } from "buttons";
import CreateWalletHeader from "./CreateWalletHeader"; 
import "style/GetStarted.less";
const DaemonLoadingBody = ({
  sendBackEvent, StateComponent, ...props
}) => (
  <div className="getstarted content">
    <CreateWalletHeader {...{ onBack: sendBackEvent }} />
    { StateComponent && <StateComponent {...{ ...props }} /> }
  </div>
);
export default DaemonLoadingBody;
