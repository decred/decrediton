import ExistingSeed from "./ExistingSeed";
import ConfirmSeed from "./ConfirmSeed";
import CreatePassPhrase from "./CreatePassPhrase";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, InvisibleButton } from "buttons";
import "style/CreateWalletForm.less";

const ContinueWalletCreation = ({
  isValid,
  isCreatingWallet,
  setSeed,
  setPassPhrase,
  onCreateWallet,
  createWalletExisting,
  onReturnToNewSeed,
  onReturnToExistingOrNewScreen,
  ...props
}) => (
  <div className="getstarted content">
    {createWalletExisting ?
      <ExistingSeed {...props} onChange={setSeed} /> :
      <ConfirmSeed  {...props} onChange={setSeed} /> }
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />

    <div className="create-wallet-button-container">
      <div className="create-wallet-label"></div>
      <div className="create-wallet-field">
        <KeyBlueButton
          className="wallet-key-blue-button"
          disabled={!isValid}
          loading={isCreatingWallet}
          onClick={onCreateWallet}
        >
          <T id="createWallet.createWalletBtn" m="Create Wallet" />
        </KeyBlueButton>
        <InvisibleButton
          className="go-back-button"
          onClick={createWalletExisting ? onReturnToExistingOrNewScreen : onReturnToNewSeed}
        ><T id="getStarted.backBtn" m="Cancel" /> </InvisibleButton>
      </div>
    </div>
  </div>
);

export default ContinueWalletCreation;
