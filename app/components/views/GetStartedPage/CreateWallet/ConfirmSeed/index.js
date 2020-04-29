import ConfirmSeedForm from "./Form";

@autobind
class ConfirmSeed extends React.Component {
  constructor(props) {
    super(props);
    const splitMnemonic = this.props.mnemonic.split(" ");
    // 0.3
    const randomThreshold = 0.3;
    const seedWords = splitMnemonic.map((word, index) => {
      const shouldShow = Math.random() > randomThreshold;
      return {
        word: shouldShow ? word : "",
        show: shouldShow,
        index,
        match: shouldShow
      };
    });
    this.state = {
      seedWords,
      splitMnemonic
    };
  }

  render() {
    const { onChangeSeedWord } = this;
    const { seedWords } = this.state;
    const {
      sendBack,
      setPassPhrase,
      onCreateWallet,
      isValid,
      isCreatingWallet
    } = this.props;
    return (
      <ConfirmSeedForm
        {...{
          isCreatingWallet,
          seedWords,
          onChangeSeedWord,
          sendBack,
          onCreateWallet,
          isValid,
          setPassPhrase
        }}
      />
    );
  }

  onChangeSeedWord(seedWord, update) {
    const { seedWords, splitMnemonic } = this.state;
    const { mnemonic } = this.props;
    const updatedSeedWords = seedWords;
    updatedSeedWords[seedWord.index] = {
      word: update,
      show: seedWord.show,
      index: seedWord.index,
      match: splitMnemonic[seedWord.index] == update
    };
    this.setState({ seedWords: updatedSeedWords }, () => {
      const seedWordStr = seedWords.map((seedWord) => seedWord.word).join(" ");
      if (seedWordStr === mnemonic) {
        this.setState({ seedWordsError: null });
        this.props
          .decodeSeed(mnemonic)
          // if no errors happened we set the seed at our machine state
          .then((response) => {
            this.props.setSeed(response.getDecodedSeed());
            this.props.setError("");
          })
          .catch((e) => {
            this.props.setError(e);
            this.props.setSeed([]);
          });
      } else {
        this.props.setSeed([]);
        this.props.setError("*Please confirm the missing words");
      }
    });
  }
}

export default ConfirmSeed;
