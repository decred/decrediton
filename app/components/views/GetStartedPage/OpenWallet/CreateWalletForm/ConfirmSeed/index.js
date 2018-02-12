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
        matches:  hideWord > randomThreshold
      });
    }
    return {
      seedWords: seedWords,
      seedError: null,
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
    console.log(splitMnemoic[seedWord.index] == update);
    var updatedSeedWords = seedWords;
    updatedSeedWords[seedWord.index] = {word: update, show: seedWord.show, index: seedWord.index, matches: splitMnemoic[seedWord.index] == update };
    this.setState(seedWords: updatedSeedWords);

    const seedWordStr = seedWords.map(seedWord => seedWord.word).join(" ");
    console.log(seedWordStr, seedWordStr == mnemonic);
    if (seedWordStr == mnemonic) {
      this.props
        .decode(mnemonic)
        .then(response => this.props.onChange(response.getDecodedSeed()))
        .then(() => this.setState({ seedError: null }))
        .catch(e => console.log(e));
    }
  }
}

export default ConfirmSeed;
