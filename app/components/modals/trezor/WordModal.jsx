import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { ButtonsToolbar } from "shared";
import Select from "react-select";
import { word_list } from "constants/trezor";
import styles from "./trezor.module.css";

const input_options = word_list.map((w) => ({ word: w }));

const WordModal = ({ isGetStarted, onCancelModal, onSubmitWord }) => {
  const [word, setWord] = useState("");
  const [value, setValue] = useState(null);

  const onCancelWordModal = () => {
    setWord("");
    setValue(null);
    onCancelModal();
  };

  const onSubmit = () => {
    if (!word) return;
    onSubmitWord(word);
    setWord("");
    setValue(null);
  };

  const onWordChanged = (value) => {
    setWord(value);
    setValue({ word: value });
  };

  const onSelectKeyDown = (e) => {
    if (e.keyCode === 13 && word) {
      onSubmit();
    }
  };

  const getSeedWords = (input, callback) => {
    input = input.toLowerCase();
    const options = input_options.filter(
      (w) => w.word.toLowerCase().substr(0, input.length) === input
    );
    callback(null, {
      options: options.slice(0, 5)
    });
  };

  const className = classNames(
    "passphrase-modal",
    styles.trezorWordModal,
    isGetStarted && styles.getStarted
  );

  return (
    <Modal {...{ className, onCancelModal: onCancelWordModal }}>
      <h1>
        <T id="trezor.wordModal.title" m="Type the requested word" />
      </h1>
      <p>
        <T
          id="trezor.wordModal.description"
          m="Type the word requested in the trezor device."
        />
      </p>

      <div className={styles.trezorWordSelect}>
        <Select.Async
          ref={(n) => n && n.focus()}
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
          value={value}
          placeholder={
            <T
              id="trezor.wordModal.selectPlaceholder"
              m="Start typing word..."
            />
          }
          onInputKeyDown={onSelectKeyDown}
        />
      </div>

      <ButtonsToolbar {...{ onCancelModal: onCancelWordModal, onSubmit }} />
    </Modal>
  );
};

export default WordModal;
