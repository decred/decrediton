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
      seedError: "*Please confirm the missing words",
      splitMnemoic: splitMnemonic
    };
  }

  render() {
    const { onChangeSeedWord } = this;
    const { seedWords } = this.state;
    const isEmpty = this.state.seedWords.length <= 1; // Weird errors with one word, better to count as empty
    const seedError = isEmpty ? null : this.state.seedError;
    const { onReturnToNewSeed } = this.props;
    return (
      <ConfirmSeedForm {...{ seedWords, seedError, isEmpty, onChangeSeedWord, onReturnToNewSeed }} />
    );
  }

  onChangeSeedWord(seedWord, update) {
    const { seedWords, splitMnemoic } = this.state;
    const { mnemonic } = this.props;
    var updatedSeedWords = seedWords;
    updatedSeedWords[seedWord.index] = { word: update, show: seedWord.show, index: seedWord.index, match: splitMnemoic[seedWord.index] == update };
    this.setState({ seedWords: updatedSeedWords });

    const seedWordStr = seedWords.map(seedWord => seedWord.word).join(" ");
    if (seedWordStr == mnemonic) {
      this.setState({ seedWordsError: null });
      this.props
        .decodeSeed(mnemonic)
        .then(response => this.props.onChange(response.getDecodedSeed()))
        .then(() => this.setState({ seedError: null }))
        .catch(e => console.log(e));
    } else {
      this.setState({ seedError: "*Please confirm the missing words" });
    }
  }
}

export default ConfirmSeed;
