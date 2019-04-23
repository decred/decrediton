import CreateWalletForm from "./CreateWalletForm";
import "style/GetStarted.less";

const CreateWallet = ({
  onReturnToNewSeed,
  onReturnToWalletSelection,
  onSetWalletPrivatePassphrase,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
}) => (
  <div className="page-body getstarted">
    <CreateWalletForm {...{
      onReturnToNewSeed,
      onReturnToWalletSelection,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft,
      onSetWalletPrivatePassphrase
    } }/>
  </div>
);

export default CreateWallet;
