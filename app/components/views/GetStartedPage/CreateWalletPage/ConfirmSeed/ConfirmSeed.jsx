import { useState, useMemo } from "react";
import ConfirmSeedForm from "./ConfirmSeedForm";
import {
  getSeedWordsArr,
  verifySeedWordsArr,
  selectedSeedWordsCount
} from "./utils";
import { useMountEffect } from "hooks";
import { messages } from "../../messages";
import { useIntl } from "react-intl";

const ConfirmSeed = ({
  mnemonic,
  sendBack,
  setPassPhrase,
  onCreateWallet,
  isValid,
  setSeed,
  decodeSeed,
  setError,
  setPageBodyScrollHandler,
  pageBodyTopRef,
  error
}) => {
  const [seedWords, setSeedWords] = useState(() => getSeedWordsArr(mnemonic));
  const [posBtBarToBottom, setPosBtBarToBottom] = useState(true);
  const intl = useIntl();
  const allWordsHaveBeenSelected = useMemo(
    () => selectedSeedWordsCount(seedWords) === seedWords.length,
    [seedWords]
  );
  const [topError, setTopError] = useState(null);

  useMountEffect(() => {
    setPageBodyScrollHandler((e) =>
      setPosBtBarToBottom(
        e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) >=
          80
      )
    );
  });

  const onSeedButtonClick = (index, selected) => {
    const updatedSeedWords = [...seedWords];
    updatedSeedWords[index].selected = selected;
    setSeedWords(updatedSeedWords);
    validateSeed(updatedSeedWords);
  };

  const validateSeed = (updatedSeedWords) => {
    if (verifySeedWordsArr(mnemonic, updatedSeedWords)) {
      decodeSeed(mnemonic)
        // if successfully decoded, update the state machine's seed.
        .then((response) => {
          setSeed(response.decodedSeed);
          setError("");
        })
        .catch((e) => {
          setError(e.toString());
          setSeed([]);
        });
    } else {
      setSeed([]);
      if (selectedSeedWordsCount(updatedSeedWords) === seedWords.length) {
        setTopError(intl.formatMessage(messages.confirmSeedWrongWordError));
        setError("");
        if (pageBodyTopRef.current.scrollIntoView) {
          pageBodyTopRef.current.scrollIntoView();
        }
      } else {
        setError(intl.formatMessage(messages.confirmSeedEnterAllWordsError));
        setTopError("");
      }
    }
  };

  return (
    <ConfirmSeedForm
      {...{
        seedWords,
        onSeedButtonClick,
        sendBack,
        onCreateWallet,
        isValid,
        setPassPhrase,
        posBtBarToBottom,
        error,
        allWordsHaveBeenSelected,
        topError
      }}
    />
  );
};

ConfirmSeed.propTypes = {
  mnemonic: PropTypes.string.isRequired,
  sendBack: PropTypes.func.isRequired,
  setPassPhrase: PropTypes.func.isRequired,
  onCreateWallet: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setSeed: PropTypes.func.isRequired,
  decodeSeed: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setPageBodyScrollHandler: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default ConfirmSeed;
