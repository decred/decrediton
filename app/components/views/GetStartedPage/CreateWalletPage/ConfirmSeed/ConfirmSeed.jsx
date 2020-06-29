import { useState, useMemo } from "react";
import ConfirmSeedForm from "./Form";

const ConfirmSeed = ({
  mnemonic,
  sendBack,
  setPassPhrase,
  onCreateWallet,
  isValid,
  isCreatingWallet,
  setSeed,
  setError,
  decodeSeed
}) => {
  const splitMnemonicArr = mnemonic.split(" ");
  const [splitMnemonic] = useState(splitMnemonicArr);
  const randomThreshold = 0.3;
  const seedWordsArr = useMemo(
    () =>
      splitMnemonic.map((word, index) => {
        const shouldShow = Math.random() > randomThreshold;
        return {
          word: shouldShow ? word : "",
          show: shouldShow,
          index,
          match: shouldShow
        };
      }),
    [splitMnemonic]
  );
  const [seedWords, setSeedWords] = useState(seedWordsArr);

  const validateSeed = (updatedSeedWords) => {
    // this logic compares state's updated seed word array(seedWords)
    // against mnemonic props
    const seedWordStr = updatedSeedWords
      .map((seedWord) => seedWord.word)
      .join(" ");
    if (seedWordStr === mnemonic) {
      decodeSeed(mnemonic)
        // if no errors happened we set the seed at our machine state
        .then((response) => {
          setSeed(response.getDecodedSeed());
          setError("");
        })
        .catch((e) => {
          setError(e);
          setSeed([]);
        });
    } else {
      setSeed([]);
      setError("*Please confirm the missing words");
    }
  };

  const onChangeSeedWord = (seedWord, update) => {
    const updatedSeedWords = [...seedWords];
    updatedSeedWords[seedWord.index] = {
      word: update,
      show: seedWord.show,
      index: seedWord.index,
      match: splitMnemonic[seedWord.index] === update
    };
    setSeedWords(updatedSeedWords);
    validateSeed(updatedSeedWords);
  };

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
};

export default ConfirmSeed;
