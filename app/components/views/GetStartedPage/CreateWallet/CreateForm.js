import CreateWalletForm from "./CreateWalletForm";
import "style/GetStarted.less";

const CreateForm = ({
  onReturnToNewSeed,
  onReturnToWalletSelection,
  onSetWalletPrivatePassphrase,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
}) => (
  <CreateWalletForm {...{
    onReturnToNewSeed,
    onReturnToWalletSelection,
    getCurrentBlockCount,
    getNeededBlocks,
    getEstimatedTimeLeft,
    onSetWalletPrivatePassphrase
  } }/>
);

export default CreateForm;
