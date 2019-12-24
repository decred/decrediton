import CreateWalletHeader from "./CreateWalletHeader"; 
import "style/GetStarted.less";

const CreateWalletPage = ({
  sendBackEvent, StateComponent, ...props
}) => (
  <div className="getstarted content">
    <CreateWalletHeader {...{ onBack: sendBackEvent }} />
    { StateComponent && <StateComponent {...{ ...props }} /> }
  </div>
);

export default CreateWalletPage;
