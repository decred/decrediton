import { useState, useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import Select from "react-select";
import Modal from "../Modal";
import { ButtonsToolbar } from "shared";
import { WORD_LIST } from "constants/trezor";
import { classNames } from "pi-ui";
import styles from "./TrezorModals.module.css";

const inputOptions = WORD_LIST.map((w) => ({ word: w }));

const getSeedWords = (input, callback) => {
  input = input.toLowerCase();
  const options = inputOptions.filter(
    (w) => w.word.toLowerCase().substr(0, input.length) === input
  );
  callback(null, {
    options: options.slice(0, 5)
  });
};

const TrezorWordModal = ({ isGetStarted, onCancelModal, onSubmitWord }) => {
  const [word, setWord] = useState("");
  const [value, setValue] = useState(null);

  const onCancelWordModal = useCallback(() => {
    setWord("");
    setValue(null);
    onCancelModal();
  }, [onCancelModal]);

  const onSubmit = useCallback(() => {
    if (!word) return;
    onSubmitWord(word);
    setWord("");
    setValue(null);
  }, [word, onSubmitWord]);

  const onWordChanged = useCallback((value) => {
    setWord(value);
    setValue({ word: value });
  }, []);

  const onSelectKeyDown = useCallback(
    (e) => {
      if (e.keyCode === 13 && word) {
        onSubmit();
      }
    },
    [word, onSubmit]
  );

  const className = classNames(
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
          valueKey={"word"}
          labelKey={"word"}
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

export default TrezorWordModal;
