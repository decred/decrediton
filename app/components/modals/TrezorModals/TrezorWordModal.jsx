import { useState, useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import { Select } from "inputs";
import Modal from "../Modal";
import { ButtonsToolbar } from "shared";
import { WORD_LIST } from "constants/trezor";
import { classNames } from "pi-ui";
import styles from "./TrezorModals.module.css";

const inputOptions = WORD_LIST.map((w) => ({ value: w, label: w }));

const getSeedWords = (input, callback) => {
  const inputValue = input.toLowerCase();
  const options = inputOptions.filter(
    (w) => w.value.toLowerCase().substr(0, inputValue.length) === inputValue
  );
  callback(options.slice(0, 5));
};

const TrezorWordModal = ({
  isGetStarted,
  onCancelModal,
  onSubmitWord,
  waitingForWord
}) => {
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

  const onWordChanged = (value) => {
    setWord(value.value);
    setValue(value);
  };

  const onSelectKeyDown = useCallback(
    (e) => {
      if (e.keyCode === 13 && word) {
        onSubmit();
      }
    },
    [word, onSubmit]
  );

  return (
    <Modal
      className={classNames(
        styles.wordModal,
        isGetStarted && styles.getStarted
      )}
      onCancelModal={onCancelWordModal}>
      <h1>
        <T id="trezor.wordModal.title" m="Type the requested word" />
      </h1>
      <p>
        <T
          id="trezor.wordModal.description"
          m="Type the word requested in the trezor device."
        />
      </p>

      <div className={styles.wordSelect}>
        <Select
          isAsync
          isSearchable
          defaultOptions
          autoFocus
          loadOptions={getSeedWords}
          onChange={onWordChanged}
          value={value}
          placeholder={
            <T
              id="trezor.wordModal.selectPlaceholder"
              m="Start typing word..."
            />
          }
          onKeyDown={onSelectKeyDown}
          isDisabled={!waitingForWord}
        />
      </div>

      <ButtonsToolbar
        {...{
          onCancelModal: onCancelWordModal,
          onSubmit,
          loading: !waitingForWord
        }}
        className={styles.buttons}
      />
    </Modal>
  );
};

export default TrezorWordModal;
