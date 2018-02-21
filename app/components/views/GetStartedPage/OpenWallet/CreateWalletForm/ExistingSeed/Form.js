import SingleSeedWordEntry from "../SingleSeedWordEntry";
import SeedHexEntry from "./SeedHexEntry";
import { TextToggle } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/CreateWalletForm.less";
import { InfoModalButton } from "buttons";
import { SeedInfoModalContent } from "modals";
import { SEED_LENGTH, SEED_WORDS } from "wallet/seed";

const getRemaining = (seedWords, seedType) => {
  const populatedWords = seedWords.filter(word => word.word != "");
  return (seedType === "words" ? SEED_LENGTH.WORDS - populatedWords.length : seedWords.length);
};

const shoudShowNonSupportSeedSize = (seedWords, seedType) =>
  seedType === "hex" && seedWords.length !== 64 && seedWords.length > SEED_LENGTH.HEX_MIN;

class ExistingSeedForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showPasteWarning : false,
      seedType: "words",
    };
  }

  handleOnPaste = (e) => {
    e.preventDefault();
    const lowercaseSeedWords = SEED_WORDS.map(w => w.toLowerCase());
    const clipboardData = e.clipboardData.getData("text");
    const words = clipboardData
      .split(/\b/)
      .filter(w => /^[\w]+$/.test(w))
      .filter(w => lowercaseSeedWords.indexOf(w.toLowerCase()) > -1)
      .map((w, i) => ({ index: i, word: w }));
    this.props.setSeedWords(words);

    this.setState({
      showPasteWarning : true
    });
  }

  handleToggle = (side) => {
    this.setState({ seedType: side === "left" ? "words" : "hex" });
  }

  mountSeedErrors = () => {
    const errors = [];
    if(this.props.seedError) {
      errors.push(
        <div key={this.props.seedError}>
          {this.props.seedError}
        </div>
      );
    }
    if(shoudShowNonSupportSeedSize(this.props.seedWords, this.state.seedType)) {
      errors.push(
        <div key='confirmSeed.errors.hexNot32Bytes'>
          <T id="confirmSeed.errors.hexNot32Bytes" m="Error: seed is not 32 bytes, such comes from a non-supported software and may have unintended consequences." />
        </div>
      );
    }
    return errors;
  }

  render(){
    const { isMatch, isEmpty, onChangeSeedWord, seedWords } = this.props;
    const { seedType } = this.state;
    const remaining = getRemaining(seedWords, seedType);
    const errors = this.mountSeedErrors();
    return (
      <Aux>
        <div className="content-title">
          <T id="createWallet.restore.title" m={"Restore existing wallet"}/>
        </div>
        <div className="confirm-seed-row seed">
          <div className="confirm-seed-label-text seed">
            <InfoModalButton
              modalTitle={<h1><T id="confirmSeed.seedInformation" m="Seed information" /></h1>    }
              modalContent={<SeedInfoModalContent />}
            />
            <T id="confirmSeed.label" m="Confirm Seed" />
          </div>
          <div className="confirm-seed-label-remaining-words">
            {seedType === "words" ?
              <T id="confirmSeed.wordsRemaining" m="{remaining, plural, one {one word remaining} other {# words remaining} }"
                values={{ remaining: remaining }} />
              :
              <T id="confirmSeed.hexSymbolsRemaining"
                m="{remaining, plural, one {one hex symbol: your key must have between {hexMin} and {hexMax} symbols} other {# hex symbols: your key must have between {hexMin} and {hexMax} symbols} }"
                values={{
                  remaining: remaining,
                  hexMax: SEED_LENGTH.HEX_MAX,
                  hexMin: SEED_LENGTH.HEX_MIN,
                }} />
            }
          </div>
          <div className="seed-type-label">
            <T id="seedType.label" m="Seed type" />
            <TextToggle
              activeButton={"left"}
              leftText={"words"}
              rightText={"hex"}
              type={"small"}
              toggleAction={this.handleToggle}
            />
          </div>
          {seedType == "words" ?
            <div className="seedArea">
              {!this.state.showPasteWarning ? null : <div className="orange-warning">
                <T id="confirmSeed.warnings.pasteExistingSeed" m="*Please make sure you also have a physical, written down copy of your seed." />
              </div>}
              {seedWords.map((seedWord) => {
                const className = seedWord.word ? "seedWord populated" : "seedWord restore";
                return (
                  <SingleSeedWordEntry
                    className={className}
                    onChange={onChangeSeedWord}
                    onPaste={this.handleOnPaste}
                    seedWord={seedWord}
                    value={{ name: seedWord.word }}
                    key={seedWord.index}
                  />);
              })}
            </div> :
            <div className="seedArea hex">
              <SeedHexEntry
                onChange={onChangeSeedWord}
              />
            </div>}
          <div className="input-form-error">
            {errors.length
              ? <div>
                {errors}
              </div>
              : isMatch || isEmpty
                ? null
                : <T id="confirmSeed.errors.seedsDontMatch" m="*Seeds do not match" /> }
          </div>
        </div>
      </Aux>
    );
  }
}

export default ExistingSeedForm;
