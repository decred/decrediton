import ConfirmSeedForm from "./Form";

@autobind
class ConfirmSeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    var seedWords = [];
    var randomThreshold = 0.3;
    var splitMnemonic = this.props.mnemonic.split(" ");
    for (var i = 0; i < splitMnemonic.length; i++) {
      var hideWord = Math.random();
      seedWords.push({
        word: hideWord > randomThreshold ? splitMnemonic[i] : "",
        show: hideWord > randomThreshold,
        index: i,
        match:  hideWord > randomThreshold
      });
    }
    return {
      seedWords: seedWords,
      seedError: "*Please confirm the missing words",
      splitMnemoic: splitMnemonic,
    };
  }

  componentWillUnmount() {
    this.state = this.getInitialState();
  }

  render() {
    const { onChangeSeedWord } = this;
    const { seedWords } = this.state;
    const isEmpty = this.state.seedWords.length <= 1; // Weird errors with one word, better to count as empty
    const seedError = isEmpty ? null : this.state.seedError;
    return (
      <ConfirmSeedForm {...{ seedWords, seedError, isEmpty, onChangeSeedWord }} />
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
        .decode(mnemonic)
        .then(response => this.props.onChange(response.getDecodedSeed()))
        .then(() => this.setState({ seedError: null }))
        .catch(e => console.log(e));
    } else {
      this.setState({ seedError: "*Please confirm the missing words" });
    }
  }
}

export default ConfirmSeed;
