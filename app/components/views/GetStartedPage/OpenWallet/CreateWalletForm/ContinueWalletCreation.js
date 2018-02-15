import ExistingSeed from "./ExistingSeed";
import ConfirmSeed from "./ConfirmSeed";
import CreatePassPhrase from "./CreatePassPhrase";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import "style/CreateWalletForm.less";

const ContinueWalletCreation = ({
  isValid,
  setSeed,
  setPassPhrase,
  onCreateWallet,
  createWalletExisting,
  ...props
}) => (
  <div className="page-content new-seed">
    {createWalletExisting ?
      <ExistingSeed {...props} onChange={setSeed} /> :
      <ConfirmSeed  {...props} onChange={setSeed} /> }
    <CreatePassPhrase passPhraseLabel={
      <T id="createWallet.encryptWallet" m="Create wallet private passphrase" />}
    onChange={setPassPhrase} onSubmit={onCreateWallet} />

    <div className="create-wallet-button-container">
      <div className="create-wallet-label"></div>
      <div className="create-wallet-field">
        <KeyBlueButton
          className="wallet-key-blue-button"
          disabled={!isValid}
          onClick={onCreateWallet}
        >
          <T id="createWallet.createWalletBtn" m="Create Wallet" />
        </KeyBlueButton>
      </div>
    </div>
  </div>
);

export default ContinueWalletCreation;
