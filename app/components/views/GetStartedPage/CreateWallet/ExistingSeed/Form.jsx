import SingleSeedWordEntry from "../SingleSeedWordEntry";
import SeedHexEntry from "inputs/SeedHexEntry";
import { TextToggle, KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import {
  ConfirmSeedMsg,
  BackBtnMsg,
  GoBackMsg,
  CreateWalletMsg
} from "../../messages";
import "style/CreateWalletForm.less";
import { WORDS, HEX } from "constants";
import { Tooltip, CreatePassPhrase } from "shared";

const ExistingSeedForm = ({
  onChangeSeedWord,
  seedWords,
  handleOnPaste,
  hexSeed,
  isCreatingWallet,
  seedType,
  pasteFromClipboard,
  handleToggle,
  showPasteWarning,
  showPasteError,
  isValid,
  onCreateWallet,
  sendBack,
  setPassPhrase,
  error
}) => (
  <>
    <div className="is-row content-title-wrapper">
      <div className="content-title">
        <T id="createWallet.restore.title" m={"Restore existing wallet"} />
      </div>
      <TextToggle
        activeButton={"left"}
        leftText={WORDS}
        rightText={HEX}
        toggleAction={handleToggle}
      />
      {sendBack && (
        <Tooltip text={<GoBackMsg />}>
          <div className="go-back-screen-button" onClick={sendBack} />
        </Tooltip>
      )}
    </div>
    <div className="is-row seed">
      <div className="confirm-seed-label-text seed">
        <ConfirmSeedMsg />
      </div>
      {seedType === WORDS && Array.isArray(seedWords) ? (
        <div className="seedArea">
          {seedWords.map((seedWord, index) => {
            const className = seedWord.word
              ? seedWord.error
                ? "seedWord error"
                : "seedWord populated"
              : "seedWord restore";
            return (
              <div key={index} className={className}>
                <span className="number">{index + 1}.</span>
                <span className="word">
                  <SingleSeedWordEntry
                    onChange={onChangeSeedWord}
                    onPaste={handleOnPaste}
                    seedWord={seedWord}
                    value={{ name: seedWord.word }}
                    key={index}
                    className="Select-menu-with-arrow"
                    onPasteFromClipboard={pasteFromClipboard}
                  />
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="seedArea hex">
          <SeedHexEntry
            onChange={(e) => onChangeSeedWord(e.target.value)}
            seed={hexSeed}
          />
        </div>
      )}
    </div>
    {showPasteError && (
      <div className="seedError">
        <T
          id="confirmSeed.warnings.pasteExistingError"
          m="* Please paste a valid 33 word seed."
        />
      </div>
    )}
    {showPasteWarning && (
      <div className="warning seed-warning-message">
        <T
          id="confirmSeed.warnings.pasteExistingSeed"
          m="*Please make sure you also have a physical, written down copy of your seed."
        />
      </div>
    )}
    {error && <div className="warning">{error}</div>}
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />
    <div className="create-wallet-button-container">
      <KeyBlueButton
        className="wallet-key-blue-button"
        disabled={!isValid}
        loading={isCreatingWallet}
        onClick={onCreateWallet}>
        <CreateWalletMsg />
      </KeyBlueButton>
      <InvisibleButton className="go-back-button" onClick={sendBack}>
        <BackBtnMsg />
      </InvisibleButton>
    </div>
  </>
);

export default ExistingSeedForm;
