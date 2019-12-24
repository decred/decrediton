import ConfirmSeedForm from "./Form";

@autobind
class ConfirmSeed extends React.Component {
  constructor(props) {
    super(props);
    const splitMnemonic = this.props.mnemonic.split(" ");
    // 0.3
    const randomThreshold = 0.3;
    const seedWords = splitMnemonic.map((word, index) => {
      const hideWord = Math.random();
      const shouldShow = hideWord > randomThreshold;
      return {
        word: shouldShow ? word : "",
        show: shouldShow,
        index,
        match:  shouldShow
      };
    });
    this.state = {
      seedWords,
      splitMnemonic,
      seedError: "*Please confirm the missing words"
    };
  }

  render() {
    const { onChangeSeedWord, setSeed } = this;
    const { seedWords } = this.state;
    const isEmpty = this.state.seedWords.length <= 1; // Weird errors with one word, better to count as empty
    const seedError = isEmpty ? null : this.state.seedError;
    const { sendBack, isValid, setPassPhrase, onCreateWallet } = this.props;
    return (
      <ConfirmSeedForm {...{
        seedWords, seedError, isEmpty, onChangeSeedWord, sendBack, onCreateWallet, setSeed, isValid, setPassPhrase
      }} />
    );
  }

  onChangeSeedWord(seedWord, update) {
    const { seedWords, splitMnemonic } = this.state;
    const { mnemonic } = this.props;
    var updatedSeedWords = seedWords;
    updatedSeedWords[seedWord.index] = { word: update, show: seedWord.show, index: seedWord.index, match: splitMnemonic[seedWord.index] == update };
    this.setState({ seedWords: updatedSeedWords });

    const seedWordStr = seedWords.map(seedWord => seedWord.word).join(" ");
    if (seedWordStr == mnemonic) {
      this.setState({ seedWordsError: null });
      this.props
        .decodeSeed(mnemonic)
        .then(response => this.props.setSeed(response.getDecodedSeed()))
        .then(() => this.setState({ seedError: null }))
        .catch(e => console.log(e));
    } else {
      this.setState({ seedError: "*Please confirm the missing words" });
    }
  }
}

export default ConfirmSeed;
