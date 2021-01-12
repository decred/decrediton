import PassPhraseInputs from "./PassPhraseInputs";
import { useState, useEffect, useCallback } from "react";

const CreatePassPhrase = ({ onChange, onSubmit, ...props }) => {
  const [passPhrase, setPassPhrase] = useState("");
  const [passPhraseVerification, setPassPhraseVerification] = useState("");
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);

  const isValid = useCallback(() => {
    return !!passPhrase && passPhrase === passPhraseVerification;
  }, [passPhrase, passPhraseVerification]);

  function onKeyDown(e) {
    // Enter key
    if (e.keyCode == 13) {
      e.preventDefault();
      onSubmit?.();
    }
  }

  function setPassPhraseAndHasFailedAttempt(passPhrase) {
    setHasFailedAttempt(true);
    setPassPhrase(passPhrase);
  }

  useEffect(() => {
    onChange?.(isValid() ? passPhrase : "");
  }, [passPhrase, passPhraseVerification, isValid, onChange]);

  return (
    <PassPhraseInputs
      {...{
        ...props,
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
