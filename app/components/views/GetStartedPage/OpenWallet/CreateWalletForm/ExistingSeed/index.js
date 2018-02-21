import ExistingSeedForm from "./Form";

@autobind
class ExistingSeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    var seedWords = [];
    for (var i = 0; i < 33; i++) {
      seedWords.push({
        word: "",
        index: i,
      });
    }
    return { seedWords: seedWords, seedError: null };
  }

  componentWillUnmount() {
    this.state = this.getInitialState();
  }

  render() {
    const { onChangeSeedWord, setSeedWords, resetSeedWords } = this;
    const isMatch = this.isMatch();
    const { seedWords } = this.state;
    const isEmpty = this.state.seedWords.length <= 1; // Weird errors with one word, better to count as empty
    const seedError = isEmpty ? null : this.state.seedError;
    return (
      <ExistingSeedForm {...{ seedWords, setSeedWords, onChangeSeedWord, resetSeedWords, isMatch, seedError, isEmpty }} />
    );
  }

  resetSeedWords() {
    this.setState(this.getInitialState());
  }

  setSeedWords(seedWords) {
    const onError = (seedError) => {
      this.setState({ mnemonic: "", seedError: seedError+"" });
      this.props.onChange(null);
    };
    this.setState({ seedWords }, () => {
      const mnemonic = this.getSeedWordsStr();
      if (this.props.mnemonic && this.isMatch()) {
        this.props
          .decode(mnemonic)
          .then(response => this.props.onChange(response.getDecodedSeed()))
          .then(() => this.setState({ seedError: null }))
          .catch(onError);
      } else {
        this.props.onChange(null);
        this.props
          .decode(mnemonic)
          .then(response => {
            this.setState({ mnemonic, seedError: null });
            this.props.onChange(response.getDecodedSeed());
          })
          .catch(onError);
      }
    });
  }

  onChangeSeedWord(seedWord, update) {
    const { seedWords } = this.state;
    var updatedSeedWords = seedWords;
    updatedSeedWords[seedWord.index] = { word: update, index: seedWord.index };

    const onError = (seedError) => {
      this.setState({ mnemonic: "", seedError: seedError+"" });
      this.props.onChange(null);
    };
    this.setState({ seedWords: updatedSeedWords }, () => {
      const mnemonic = this.getSeedWordsStr();
      if (this.props.mnemonic && this.isMatch()) {
        this.props
          .decode(mnemonic)
          .then(response => this.props.onChange(response.getDecodedSeed()))
          .then(() => this.setState({ seedError: null }))
          .catch(onError);
      } else {
        this.props.onChange(null);
        this.props
          .decode(mnemonic)
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
}

export default ExistingSeed;
