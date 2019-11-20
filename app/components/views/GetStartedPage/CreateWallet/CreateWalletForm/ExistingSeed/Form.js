import SingleSeedWordEntry from "../SingleSeedWordEntry";
import SeedHexEntry from "inputs/SeedHexEntry";
import { TextToggle } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { ConfirmSeedMsg } from "../../../messages";
import "style/CreateWalletForm.less";
import { WORDS, HEX } from "constants";

const ExistingSeedForm = ({
  onChangeSeedWord, seedWords, setSeedHex, mountSeedErrors, handleOnPaste, hexSeed,
  seedType, pasteFromClipboard, handleToggle, showPasteWarning, showPasteError
}) => {
  const errors = mountSeedErrors();
  return (
    <>
      <div className="is-row content-title-wrapper">
        <div className="content-title">
          <T id="createWallet.restore.title" m={"Restore existing wallet"}/>
        </div>
        <TextToggle
          activeButton={"left"}
          leftText={WORDS}
          rightText={HEX}
          toggleAction={handleToggle}
        />
      </div>
      <div className="is-row seed">
        <div className="confirm-seed-label-text seed">
          <ConfirmSeedMsg />
        </div>
        {seedType === WORDS && Array.isArray(seedWords) ?
          <div className="seedArea">
            {seedWords.map((seedWord) => {
              const className = seedWord.word ? seedWord.error ? "seedWord error" : "seedWord populated" : "seedWord restore";
              return (
                <div key={seedWord.index} className={className}>
                  <span className="number">{seedWord.index + 1}.</span>
                  <span className="word">
                    <SingleSeedWordEntry
                      onChange={onChangeSeedWord}
                      onPaste={handleOnPaste}
                      seedWord={seedWord}
                      value={{ name: seedWord.word }}
                      key={seedWord.index}
                      className="Select-menu-with-arrow"
                      onPasteFromClipboard={pasteFromClipboard}
                    />
                  </span>
                </div>);
            })}
          </div> :
          <div className="seedArea hex">
            <SeedHexEntry
              onChange={(e) => setSeedHex(e.target.value)}
              seed={hexSeed}
            />
          </div>}
      </div>
      {showPasteError &&
        <div className="seedError">
          <T id="confirmSeed.warnings.pasteExistingError" m="* Please paste a valid 33 word seed."/>
        </div>}
      {errors.length > 0 &&
        <div className="warning">
          <div>{errors}</div>
        </div>}
      {showPasteWarning &&
        <div className="warning seed-warning-message">
          <T id="confirmSeed.warnings.pasteExistingSeed" m="*Please make sure you also have a physical, written down copy of your seed." />
        </div>}
    </>
  );
};

export default ExistingSeedForm;
