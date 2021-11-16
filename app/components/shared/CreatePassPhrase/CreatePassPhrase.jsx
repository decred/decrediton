import PassPhraseInputs from "./PassPhraseInputs";
import { useState, useEffect, useCallback } from "react";
import { useIntl } from "react-intl";

const CreatePassPhrase = ({ onChange, onSubmit, ...props }) => {
  const intl = useIntl();
  const [passPhrase, setPassPhrase] = useState("");
  const [passPhraseVerification, setPassPhraseVerification] = useState("");
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);

  const isValid = useCallback(() => {
    return !!passPhrase && passPhrase === passPhraseVerification;
  }, [passPhrase, passPhraseVerification]);

  useEffect(() => {
    onChange?.(isValid() ? passPhrase : "");
  }, [passPhrase, passPhraseVerification, isValid, onChange]);

  const onKeyDown = (e) => {
    // Enter key
    if (e.keyCode == 13) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  const setPassPhraseAndHasFailedAttempt = (passPhrase) => {
    setHasFailedAttempt(true);
    setPassPhrase(passPhrase);
  };

  return (
    <PassPhraseInputs
      {...{
        ...props,
        intl,
        hasFailedAttempt,
        passPhrase,
        passPhraseVerification,
        isValid: !!isValid(),
        setPassPhrase: setPassPhraseAndHasFailedAttempt,
        setPassPhraseVerification,
        onKeyDown
      }}
    />
  );
};

CreatePassPhrase.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default CreatePassPhrase;
