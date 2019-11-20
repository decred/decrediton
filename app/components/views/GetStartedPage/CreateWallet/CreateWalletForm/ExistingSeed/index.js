import ExistingSeedForm from "./Form";
import { SEED_LENGTH, SEED_WORDS } from "wallet/seed";
import { FormattedMessage as T } from "react-intl";
import { WORDS, HEX, POSITION_ERROR, MISMATCH_ERROR } from "constants";

const shouldShowNonSupportSeedSize = (hexSeed, seedType) =>
  hexSeed && seedType === HEX && hexSeed.length !== 64 && hexSeed.length > SEED_LENGTH.HEX_MIN;

@autobind
class ExistingSeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seedWords: this.getEmptySeedWords(),
      hexSeed: null,
      mnemonic: null,
      seedError: null,
      showPasteWarning: false,
      showPasteError: false,
      seedType: WORDS
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { seedType, hexSeed, seedWords } = this.state;
    const isEqual = (prevSeedWords, seedWords) => {
      if (seedType === WORDS) {
        for(let i = 0; i < 33; i++) {
          if (prevSeedWords[i].word !== seedWords[i].word) {
            return false;
          }
        }
        return true;
      } else {
        if (prevState.hexSeed === hexSeed) {
          return true;
        }
        return false;
      }
    };
    if (isEqual(prevState.seedWords, seedWords)) {
      return;
    }

    const mnemonic = this.getSeedWordsStr();
    this.props
      .decodeSeed(mnemonic)
      .then(response => {
        this.setState({ mnemonic, seedError: null });
        this.props.onChange(response.getDecodedSeed());
      })
      .catch(error => {
        this.setState({ mnemonic: "", seedError: error+"" });
        this.props.onChange(null);
      });
  }

  getEmptySeedWords() {
    const seedWords = [];
    for (let i = 0; i < 33; i++) {
      seedWords.push({
        word: "",
        index: i,
        error: false
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
    this.setState({ seedError: null });
    this.setState({ seedType: side === "left" ? WORDS : HEX });
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
    if(shouldShowNonSupportSeedSize(this.state.hexSeed, this.state.seedType)) {
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
    const countWords = () => {
      let count = 0;
      seedWords.forEach((wordObj) => {
        if(wordObj.word.length > 0) {
          count++;
        }
      });

      return count;
    };
    const fixPositionError = (errorStr) => {
      const index = errorStr.indexOf(POSITION_ERROR);
      const numberPosition = index + POSITION_ERROR.length + 1;
      const endErrorStr = errorStr.slice(numberPosition + 1);
      const beginErrorStr = errorStr.slice(0, numberPosition);
      return beginErrorStr + (seedWord.index + 1) + endErrorStr;
    };
    const onError = (seedError) => {
      const seedErrorStr = seedError + "";
      if (countWords() <= 1) { // Weird errors with one word, better to avoid them.
        return;
      }
      if (seedErrorStr.includes(MISMATCH_ERROR) && countWords() < 33) {
        return;
      }
      this.setState({ seedError: seedErrorStr });
      this.props.onChange(null);
      if (seedErrorStr.includes(POSITION_ERROR)) {
        const positionErr = fixPositionError(seedErrorStr);

        updatedSeedWords[seedWord.index] = { word: update, index: seedWord.index, error: true };
        this.setState({ seedWords: updatedSeedWords, seedError: positionErr });
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

  setSeedHex(seed) {
    const trimmedSeed = seed.trim();
    if (this.isHexValid(trimmedSeed)) {
      this.setState({
        hexSeed: trimmedSeed, showPasteError: false, showPasteWarning: false
      });
    } else {
      this.setState({
        seedError: <T id="confirmSeed.errors.invalidHex" m="Please paste a valid hex seed" />
      });
    }
  }

  getSeedWordsStr() {
    const { seedWords, hexSeed, seedType } = this.state;
    return seedType === HEX ? hexSeed : seedWords.map(({ word }) => word).join(" ");
  }

  isMatch() {
    const mnemonic = this.state.mnemonic || this.props.mnemonic;
    return !!(mnemonic && (this.getSeedWordsStr() === mnemonic));
  }

  isHexValid(seed) {
    return /^[0-9a-fA-F]*$/.test(seed) && seed.length <= SEED_LENGTH.HEX_MAX;
  }

  render() {
    const {
      onChangeSeedWord, resetSeedWords, handleOnPaste, handleToggle, mountSeedErrors, pasteFromClipboard, setSeedHex
    } = this;
    const { seedWords, seedError, hexSeed } = this.state;
    return (
      <ExistingSeedForm {...{
        ...this.state, seedWords, onChangeSeedWord, resetSeedWords, seedError, setSeedHex,
        hexSeed, handleOnPaste, mountSeedErrors, pasteFromClipboard, handleToggle
      }} />
    );
  }
}

export default ExistingSeed;
