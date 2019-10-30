import CreateWalletForm from "./CreateWalletForm";
import "style/GetStarted.less";
import cx from "classnames";

const CreateWallet = ({
  onReturnToNewSeed,
  onReturnToWalletSelection,
  onSetWalletPrivatePassphrase,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  isTestNet
}) => (
  <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
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
