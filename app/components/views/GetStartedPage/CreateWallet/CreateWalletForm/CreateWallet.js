import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { SeedCopyConfirmModal } from "modals";
import { LoaderBarBottom } from "indicators";
import { Documentation } from "shared";
import WalletHeader from "./createWalletHeader";
import { BackBtnMsg } from "../../messages";
import "style/CreateWalletForm.less";

const CreateWallet = ({
  mnemonic,
  createWalletConfirmNewSeed,
  handleCopySeed,
  showCopySeedConfirm,
  onCancelCopySeedConfirm,
  onSubmitCopySeedConfirm,
  onReturnToWalletSelection,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getDaemonSynced
}) => (
  <>
    <div className="getstarted content">
      <WalletHeader {...{ onBack: onReturnToWalletSelection }} />
      <Documentation name="WalletCreationWarning" className="create-wallet-warning" />
      <div className="seedArea">
        {mnemonic.split(" ").map((word, i) => {
          return (
            <div key={i} className="seedWord filled">
              <span className="number">{i+1}.</span>
              <span className="word">{word}</span>
            </div>
          );
        })}
        <div className="copy" onClick={handleCopySeed}>
          <T id="createWallet.copy" m="Copy seed words to clipboard" />
        </div>
      </div>
      <div className="toolbar">
        <KeyBlueButton className="wallet-key-blue-button" onClick={createWalletConfirmNewSeed}>
          <T id="createWallet.continueBtn" m="Continue" />
        </KeyBlueButton>
        <InvisibleButton
          className="go-back-button"
          onClick={onReturnToWalletSelection}>
          <BackBtnMsg />
        </InvisibleButton>
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, getDaemonSynced }}  />
    </div>
    <SeedCopyConfirmModal
      show={showCopySeedConfirm}
      onSubmit={onSubmitCopySeedConfirm}
      onCancelModal={onCancelCopySeedConfirm}
    />
  </>
);

export default CreateWallet;
