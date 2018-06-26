import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { SeedCopyConfirmModal } from "modals";
import { Tooltip } from "shared";
import { LoaderBarBottom } from "indicators";
import { Documentation } from "shared";
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
  getDaemonSynced,
}) => (
  <Aux>
    <div className="getstarted content">
      <div className="go-back-screen-button-area">
        <Tooltip text={ <T id="createWallet.goBack" m="Go back" /> }><div className="go-back-screen-button" onClick={onReturnToWalletSelection}/></Tooltip>
      </div>
      <div className="content-title">
        <T id="createWallet.title" m={"Create a new wallet"}/>
      </div>
      <Documentation name="WalletCreationWarning" className="create-wallet-warning" />
      <div className="seedArea">
        {mnemonic.split(" ").map((word, i) => {
          return (
            <div key={i} className="seedWord">
              {word}
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
          <T id="getStarted.backBtn" m="Cancel" />
        </InvisibleButton>
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, getDaemonSynced }}  />
    </div>
    <SeedCopyConfirmModal
      show={showCopySeedConfirm}
      onSubmit={onSubmitCopySeedConfirm}
      onCancelModal={onCancelCopySeedConfirm}
    />
  </Aux>
);

export default CreateWallet;
