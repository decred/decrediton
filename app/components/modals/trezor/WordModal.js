import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { ButtonsToolbar } from "../PassphraseModal";
import Select from "react-select";
import { word_list } from "helpers/trezor";

const input_options = word_list.map(w => ({ word: w }));

@autobind
class WordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { word: "", value: null };
  }

  onCancelModal() {
    this.setState({ word: "", value: null });
    this.props.onCancelModal();
  }

  onSubmit() {
    if (!this.state.word) return;
    this.props.submitWord(this.state.word);
    this.setState({ word: "", value: null });
  }

  onWordChanged(value) {
    this.setState({ word: value, value: { word: value } });
  }

  onSelectKeyDown(e) {
    if (e.keyCode === 13 && this.state.word) {
      this.onSubmit();
    }
  }

  getSeedWords (input, callback) {
    input = input.toLowerCase();
    const options = input_options
      .filter(w => w.word.toLowerCase().substr(0, input.length) === input);
    callback(null, {
      options: options.slice(0, 5)
    });
  }

  render() {
    const { onCancelModal, onSubmit, onWordChanged, onSelectKeyDown, getSeedWords } = this;

    const className = [
      "passphrase-modal",
      "trezor-word-modal",
      this.props.isGetStarted ? "get-started" : ""
    ].join(" ");

    return (
      <Modal {...{ className, onCancelModal }}>
        <h1><T id="trezor.wordModal.title" m="Type the requested word" /></h1>
        <p><T id="trezor.wordModal.description" m="Type the word requested in the trezor device." /></p>

        <div className="trezor-word-select">
          <Select.Async
            ref={n => n && n.focus()}
            autoFocus
            simpleValue
            multi={false}
            clearable={false}
            multi={false}
            filterOptions={false}
            valueKey="word"
            labelKey="word"
            loadOptions={getSeedWords}
            onChange={onWordChanged}
            value={this.state.value}
            placeholder={<T id="trezor.wordModal.selectPlaceholder" m="Start typing word..." />}
            onInputKeyDown={onSelectKeyDown}
          />
        </div>

        <ButtonsToolbar {... { onCancelModal, onSubmit }} />
      </Modal>
    );
  }
}

export default WordModal;
