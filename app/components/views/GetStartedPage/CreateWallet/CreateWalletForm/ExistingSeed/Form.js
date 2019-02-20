import SingleSeedWordEntry from "../SingleSeedWordEntry";
import SeedHexEntry from "inputs/SeedHexEntry";
import { TextToggle } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/CreateWalletForm.less";
import { ConfirmSeedMsg } from "../../../messages";
import { WORDS, HEX } from "./constants";

const ExistingSeedForm = ({
  onChangeSeedWord, seedWords, setSeedHex, mountSeedErrors, handleOnPaste, hexSeed,
  seedType, pasteFromClipboard, handleToggle, showPasteWarning, showPasteError,
}) => {
  const errors = mountSeedErrors();
  return (
    <Aux>
      <div className="content-title">
        <T id="createWallet.restore.title" m={"Restore existing wallet"}/>
      </div>
      <div className="seed-type-label">
        <TextToggle
          activeButton={"left"}
          leftText={WORDS}
          rightText={HEX}
          toggleAction={handleToggle}
        />
      </div>
      <div className="confirm-seed-row seed">
        <div className="confirm-seed-label-text seed">
          <ConfirmSeedMsg />
        </div>
        {seedType === WORDS && Array.isArray(seedWords) ?
          <div className="seedArea">
            {showPasteWarning &&
            <div className="orange-warning">
              <T id="confirmSeed.warnings.pasteExistingSeed" m="*Please make sure you also have a physical, written down copy of your seed." />
            </div>}
            {showPasteError &&
            <div className="seedError">
              <T id="confirmSeed.warnings.pasteExistingError" m="* Please paste a valid 33 word seed."/>
            </div>}
            {seedWords.map((seedWord) => {
              const className = seedWord.word ? seedWord.error ? "seedWord error" : "seedWord populated" : "seedWord restore";
              return (
                <SingleSeedWordEntry
                  className={className}
                  onChange={onChangeSeedWord}
                  onPaste={handleOnPaste}
                  seedWord={seedWord}
                  value={{ name: seedWord.word }}
                  key={seedWord.index}
                  onPasteFromClipboard={pasteFromClipboard}
                />);
            })}
          </div> :
          <div className="seedArea hex">
            <SeedHexEntry
              onChange={(e) => setSeedHex(e.target.value)}
              seed={hexSeed}
            />
          </div>}
        <div className="input-form-error">
          {errors.length > 0 && <div>{errors}</div>}
        </div>
      </div>
    </Aux>
  );
};

export default ExistingSeedForm;
