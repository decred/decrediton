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
    const seedWordStr = this.getSeedWordsStr();
    this.props.decodeSeed(seedWordStr)
      // if no errors happened we set the seed at our machine state
      .then(response => {
        this.props.setSeed(response.getDecodedSeed());
        this.props.setError("")
      })
      .catch(this.onError);
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
    if(shouldShowNonSupportSeedSize(this.state.hexSeed, this.state.seedType)) {
      errors.push(
        <div key='confirmSeed.errors.hexNot32Bytes'>
          <T id="confirmSeed.errors.hexNot32Bytes" m="Error: seed is not 32 bytes, such comes from a non-supported software and may have unintended consequences." />
        </div>
      );
    }
    return errors;
  }

  async onError(seedError, seedWord) {
    const { seedWords } = this.state;
    let seedErrorStr = seedError + "";

    const countWords = () => {
      let count = 0;
      seedWords.forEach( wordObj => {
        if(wordObj.word && wordObj.word.length > 0) count++;
      });
      return count;
    };
    if (countWords() <= 1) { // Weird errors with one word, better to avoid them.
      return;
    }
    // if user has not completed filing all words we avoid showing invalid decoding.
    if (seedErrorStr.includes(MISMATCH_ERROR) && countWords() < 33) {
      return;
    }
    const fixPositionError = (errorStr, seedWord) => {
      if (!seedWord) return;
      const index = errorStr.indexOf(POSITION_ERROR);
      const numberPosition = index + POSITION_ERROR.length + 1;
      const endErrorStr = errorStr.slice(numberPosition + 1);
      const beginErrorStr = errorStr.slice(0, numberPosition);
      return beginErrorStr + (seedWord.index + 1) + endErrorStr;
    };
    if (seedErrorStr.includes(POSITION_ERROR)) {
      seedErrorStr = fixPositionError(seedErrorStr, seedWord);
    }
    this.props.setSeed([]);
    this.props.setError(seedErrorStr);
  };

  onChangeSeedWord(seedWord, update) {
    const { seedWords } = this.state;
    const updatedSeedWords = seedWords;
    updatedSeedWords[seedWord.index] = { word: update, index: seedWord.index, error: false };
    
    const seedWordStr = this.getSeedWordsStr();
    this.setState({ seedWords: updatedSeedWords }, () => {
      this.props.decodeSeed(seedWordStr)
        // if no errors happened we set the seed at our state machine
        .then(response => {
          this.props.setSeed(response.getDecodedSeed());
          this.props.setError("")
        })
        .catch(err => this.onError(err, seedWord));
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

  isHexValid(seed) {
    return /^[0-9a-fA-F]*$/.test(seed) && seed.length <= SEED_LENGTH.HEX_MAX;
  }

  render() {
    const {
      onChangeSeedWord, handleOnPaste, handleToggle, mountSeedErrors, pasteFromClipboard, setSeedHex
    } = this;
    const { seedWords, seedError, hexSeed } = this.state;
    return (
      <ExistingSeedForm {...{
        ...this.props, ...this.state, seedWords, onChangeSeedWord, seedError, setSeedHex,
        hexSeed, handleOnPaste, mountSeedErrors, pasteFromClipboard, handleToggle
      }} />
    );
  }
}

export default ExistingSeed;
