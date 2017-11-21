import React from "react";
import { autobind } from "core-decorators";
import ConfirmSeedForm from "./Form";
import { SEED_LENGTH } from "../../../wallet/seed";

@autobind
class ConfirmSeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return { seedWords: [], seedError: null, isShowingSeedInformation: false };
  }

  componentWillUnmount() {
    this.state = this.getInitialState();
  }

  render() {
    const { setSeedWords, showSeedInformation, hideSeedInformation } = this;
    const remainingSeedWords = this.getRemainingSeedWords();
    const isMatch = this.isMatch();
    const isEmpty = this.state.seedWords.length <= 1; // Weird errors with one word, better to count as empty
    const seedError = isEmpty ? null : this.state.seedError;
    const { isShowingSeedInformation } = this.state;
    return (
      <ConfirmSeedForm {...{ remainingSeedWords, setSeedWords, isMatch, seedError, isEmpty, showSeedInformation, hideSeedInformation, isShowingSeedInformation }} />
    );
  }
  showSeedInformation() {
    this.setState({isShowingSeedInformation: true});
  }
  hideSeedInformation() {
    this.setState({isShowingSeedInformation: false});
  }
  getRemainingSeedWords() {
    return SEED_LENGTH - this.state.seedWords.length;
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

  getSeedWordsStr() {
    return this.state.seedWords.map(({ name }) => name).join(" ");
  }

  isMatch() {
    const mnemonic = this.state.mnemonic || this.props.mnemonic;
    return !!(mnemonic && (this.getSeedWordsStr() === mnemonic));
  }
}

export default ConfirmSeed;
