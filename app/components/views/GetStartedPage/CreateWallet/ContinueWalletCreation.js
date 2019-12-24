import ExistingSeed from "./ExistingSeed";
import ConfirmSeed from "./ConfirmSeed";
import { CreatePassPhrase } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { BackBtnMsg } from "../messages";
import "style/CreateWalletForm.less";

const ContinueWalletCreation = ({
  isValid,
  isCreatingWallet,
  setSeed,
  setPassPhrase,
  onCreateWallet,
  createWalletExisting,
  onReturnToNewSeed,
  onReturnToWalletSelection,
  onReturnToExistingOrNewScreen,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getDaemonSynced,
  createNewWallet,
  ...props
}) => (
  <>
    {createWalletExisting ?
      <ExistingSeed {...props} onChange={setSeed} /> :
      <ConfirmSeed  {...{ ...props, onReturnToNewSeed }} onChange={setSeed} /> }
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />

    <div className="create-wallet-button-container">
      <KeyBlueButton
        className="wallet-key-blue-button"
        disabled={!isValid || isCreatingWallet}
        loading={isCreatingWallet}
        onClick={onCreateWallet}
      >
        <T id="createWallet.createWalletBtn" m="Create Wallet" />
      </KeyBlueButton>
      <InvisibleButton
        className="go-back-button"
        onClick={createWalletExisting ? !createNewWallet ? onReturnToWalletSelection : onReturnToExistingOrNewScreen : onReturnToNewSeed}
      ><BackBtnMsg /></InvisibleButton>
    </div>
    <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, getDaemonSynced }}  />
  </>
);

export default ContinueWalletCreation;
