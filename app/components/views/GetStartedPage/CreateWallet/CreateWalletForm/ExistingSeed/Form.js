import SingleSeedWordEntry from "../SingleSeedWordEntry";
import SeedHexEntry from "./SeedHexEntry";
import { TextToggle } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/CreateWalletForm.less";
import { SEED_LENGTH, SEED_WORDS } from "wallet/seed";

const shoudShowNonSupportSeedSize = (seedWords, seedType) =>
  seedType === "hex" && seedWords.length !== 64 && seedWords.length > SEED_LENGTH.HEX_MIN;

class ExistingSeedForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showPasteWarning : false,
      showPasteError: false,
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
    if (words.length == 33) {
      this.props.setSeedWords(words);
      this.setState({
        showPasteWarning : true,
        showPasteError: false
      });
    } else {
      this.setState({
        showPasteWarning : false,
        showPasteError : true
      });

    }
  }

  handleToggle = (side) => {
    this.props.resetSeedWords();
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
    const { onChangeSeedWord, seedWords, setSeedWords } = this.props;
    const { seedType } = this.state;
    const errors = this.mountSeedErrors();
    return (
      <Aux>
        <div className="content-title">
          <T id="createWallet.restore.title" m={"Restore existing wallet"}/>
        </div>
        <div className="seed-type-label">
          <TextToggle
            activeButton={"left"}
            leftText={"words"}
            rightText={"hex"}
            toggleAction={this.handleToggle}
          />
        </div>
        <div className="confirm-seed-row seed">
          <div className="confirm-seed-label-text seed">
            <T id="confirmSeed.label" m="Confirm Seed" />
          </div>
          {seedType == "words" && Array.isArray(seedWords) ?
            <div className="seedArea">
              {this.state.showPasteWarning &&
              <div className="orange-warning">
                <T id="confirmSeed.warnings.pasteExistingSeed" m="*Please make sure you also have a physical, written down copy of your seed." />
              </div>}
              {this.state.showPasteError &&
              <div className="error">
                <T id="confirmSeed.warnings.pasteExistingError" m="* Please paste a valid 33 word seed."/>
              </div>}
              {seedWords.map((seedWord) => {
                const className = seedWord.word ? seedWord.error ? "seedWord error" : "seedWord populated" : "seedWord restore";
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
                onChange={setSeedWords}
              />
            </div>}
          <div className="input-form-error">
            {errors.length > 0 && <div>{errors}</div>}
          </div>
        </div>
      </Aux>
    );
  }
}

export default ExistingSeedForm;
