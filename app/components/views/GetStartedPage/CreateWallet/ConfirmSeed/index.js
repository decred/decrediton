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
      seedError: "*Please confirm the missing words",
      seed: "",
      passPhrase: "",
      isValid: false
    };
  }

  render() {
    const { onChangeSeedWord, setPassPhrase, onCreateWallet } = this;
    const { seedWords, isValid } = this.state;
    const isEmpty = this.state.seedWords.length <= 1; // Weird errors with one word, better to count as empty
    const seedError = isEmpty ? null : this.state.seedError;
    const { sendBack } = this.props;
    return (
      <ConfirmSeedForm {...{
        seedWords, seedError, isEmpty, onChangeSeedWord, sendBack, onCreateWallet, isValid, setPassPhrase
      }} />
    );
  }

  onChangeSeedWord(seedWord, update) {
    const { seedWords, splitMnemonic } = this.state;
    const { mnemonic } = this.props;
    const updatedSeedWords = seedWords;
    updatedSeedWords[seedWord.index] = {
      word: update, show: seedWord.show, index: seedWord.index, match: splitMnemonic[seedWord.index] == update
    };
    this.setState({ seedWords: updatedSeedWords });

    const seedWordStr = seedWords.map(seedWord => seedWord.word).join(" ");
    if (seedWordStr === mnemonic) {
      this.setState({ seedWordsError: null });
      this.props
        .decodeSeed(mnemonic)
        .then(response => this.setState({ seed: response.getDecodedSeed() }, this.checkIsValid))
        .then(() => this.setState({ seedError: null }))
        .catch(e => console.log(e));
    } else {
      this.setState({ seed: "" });
      this.setState({ seedError: "*Please confirm the missing words" });
    }
  }

  onCreateWallet() {
    const {
      createWalletRequest, onSetWalletPrivatePassphrase, isNew, sendContinue
    } = this.props;
    const { seed, passPhrase } = this.state;
    const pubpass = ""; // Temporarily disabled?

    if (!(seed && passPhrase)) return;
    createWalletRequest(pubpass, passPhrase, seed, isNew);
    isNew && onSetWalletPrivatePassphrase && onSetWalletPrivatePassphrase(passPhrase);
    sendContinue();
  }

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase }, this.checkIsValid);
  }

  checkIsValid() {
    const { seed, passPhrase, seedWords } = this.state;
    const { mnemonic } = this.props;
    const seedWordStr = seedWords.map(seedWord => seedWord.word).join(" ");

    if (seed.length === 0) return this.setState({ isValid: false });
    if (passPhrase.length === 0) return this.setState({ isValid: false });;
    if (seedWordStr !== mnemonic) return this.setState({ isValid: false });;

    return this.setState({ isValid: true });;
  }
}

export default ConfirmSeed;
