import ExistingSeedForm from "./Form";
import { SEED_LENGTH, SEED_WORDS } from "wallet/seed";
import { FormattedMessage as T } from "react-intl";

const shouldShowNonSupportSeedSize = (seedWords, seedType) =>
  seedType === "hex" && seedWords.length !== 64 && seedWords.length > SEED_LENGTH.HEX_MIN;

const POSITION_ERROR = "not valid at position";

@autobind
class ExistingSeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seedWords: this.getEmptySeedWords(),
      mnemonic: null,
      seedError: null,
      showPasteWarning: false,
      showPasteError: false,
      seedType: "words",
    }
  }

  getEmptySeedWords() {
    const seedWords = [];
    for (var i = 0; i < 33; i++) {
      seedWords.push({
        word: "",
        index: i,
        error: false,
      });
    }
    return seedWords;
  }

  handleOnPaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text");
    this.pasteFromClipboard(clipboardData);
  }

  pasteFromClipboard = (wordsFromClipboard) => {
    const lowercaseSeedWords = SEED_WORDS.map(w => w.toLowerCase());
    const words = wordsFromClipboard.split(/\b/)
      .filter(w => /^[\w]+$/.test(w))
      .filter(w => lowercaseSeedWords.indexOf(w.toLowerCase()) > -1)
      .map((w, i) => ({ index: i, word: w }));

    if (words.length === 33) {
      this.setState({
        seedWords: words,
        showPasteWarning : true,
        showPasteError: false
      });
      return true;
    } else {
      this.setState({
        showPasteWarning : false,
        showPasteError : true
      });
      return false;
    }
  }

  handleToggle = (side) => {
    this.resetSeedWords();
    this.setState({ seedType: side === "left" ? "words" : "hex" });
  }

  mountSeedErrors = () => {
    const errors = [];
    if(this.state.seedError) {
      errors.push(
        <div key={this.state.seedError}>
          {this.state.seedError}
        </div>
      );
    }
    if(shouldShowNonSupportSeedSize(this.state.seedWords, this.state.seedType)) {
      errors.push(
        <div key='confirmSeed.errors.hexNot32Bytes'>
          <T id="confirmSeed.errors.hexNot32Bytes" m="Error: seed is not 32 bytes, such comes from a non-supported software and may have unintended consequences." />
        </div>
      );
    }
    return errors;
  }

  resetSeedWords() {
    this.setState({ seedWords: this.getEmptySeedWords() });
  }

  onChangeSeedWord(seedWord, update) {
    const { seedWords } = this.state;
    const updatedSeedWords = seedWords;
    updatedSeedWords[seedWord.index] = { word: update, index: seedWord.index, error: false };

    const onError = (seedError) => {
      this.setState({ mnemonic: "", seedError: seedError+"" });
      this.props.onChange(null);

      const seedErrorStr = seedError + "";
      if (seedErrorStr.includes(POSITION_ERROR)) {
        updatedSeedWords[seedWord.index] = { word: update, index: seedWord.index, error: true };
        this.setState({ seedWords: updatedSeedWords });
      }
    };
    this.setState({ seedWords: updatedSeedWords }, () => {
      const mnemonic = this.getSeedWordsStr();
      if (this.props.mnemonic && this.isMatch()) {
        this.props
          .decodeSeed(mnemonic)
          .then(response => this.props.onChange(response.getDecodedSeed()))
          .then(() => this.setState({ seedError: null }))
          .catch(onError);
      } else {
        this.props.onChange(null);
        this.props
          .decodeSeed(mnemonic)
          .then(response => {
            this.setState({ mnemonic, seedError: null });
            this.props.onChange(response.getDecodedSeed());
          })
          .catch(onError);
      }
    });
  }

  getSeedWordsStr() {
    const { seedWords } = this.state;
    return Array.isArray(seedWords) ? seedWords.map(({ word }) => word).join(" ") : seedWords;
  }

  isMatch() {
    const mnemonic = this.state.mnemonic || this.props.mnemonic;
    return !!(mnemonic && (this.getSeedWordsStr() === mnemonic));
  }

  render() {
    const { onChangeSeedWord, resetSeedWords, handleOnPaste, handleToggle, mountSeedErrors, pasteFromClipboard } = this;
    const { seedWords, seedError } = this.state;
    return (
      <ExistingSeedForm {...{
        ...this.state,
        seedWords, onChangeSeedWord, resetSeedWords, seedError,
        handleOnPaste, mountSeedErrors, pasteFromClipboard, handleToggle
      }} />
    );
  }

}

export default ExistingSeed;
