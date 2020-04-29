import { SeedCopyConfirmModal } from "modals";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { BackBtnMsg, GoBackMsg, CreateNewWalletTitle } from "../../messages";
import { Tooltip } from "shared";
import "style/CreateWalletForm.less";

const CreateWallet = ({
  handleCopySeed,
  showCopySeedConfirm,
  onCancelCopySeedConfirm,
  onSubmitCopySeedConfirm,
  mnemonic,
  sendBack,
  sendContinue
}) => (
  <>
    <div className="content-title-wrapper is-row">
      <div className="content-title">
        <CreateNewWalletTitle />
      </div>
      {sendBack && (
        <Tooltip text={<GoBackMsg />}>
          <div className="go-back-screen-button" onClick={sendBack} />
        </Tooltip>
      )}
    </div>
    <Documentation
      name="WalletCreationWarning"
      className="create-wallet-warning"
    />
    <div className="seedArea">
      {mnemonic.split(" ").map((word, i) => {
        return (
          <div key={i} className="seedWord filled">
            <span className="number">{i + 1}.</span>
            <span className="word">{word}</span>
          </div>
        );
      })}
      <div className="copy" onClick={handleCopySeed}>
        <T id="createWallet.copy" m="Copy seed words to clipboard" />
      </div>
    </div>
    <div className="toolbar">
      <KeyBlueButton className="wallet-key-blue-button" onClick={sendContinue}>
        <T id="createWallet.continueBtn" m="Continue" />
      </KeyBlueButton>
      <InvisibleButton className="go-back-button" onClick={sendBack}>
        <BackBtnMsg />
      </InvisibleButton>
    </div>
    <SeedCopyConfirmModal
      show={showCopySeedConfirm}
      onSubmit={onSubmitCopySeedConfirm}
      onCancelModal={onCancelCopySeedConfirm}
    />
  </>
);

export default CreateWallet;
