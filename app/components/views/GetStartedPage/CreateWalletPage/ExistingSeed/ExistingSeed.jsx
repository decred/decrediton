import { useState, useEffect, useCallback } from "react";
import ExistingSeedForm from "./Form";
import { SEED_LENGTH, SEED_WORDS } from "wallet/seed";
import { FormattedMessage as T } from "react-intl";
import { WORDS, HEX, POSITION_ERROR, MISMATCH_ERROR } from "constants";
import { usePrevious } from "hooks";

const isEqualPreviousSeed = ({ prevSeedWords, seedWords }) => {
  for (let i = 0; i < 33; i++) {
    if (prevSeedWords[i].word !== seedWords[i].word) {
      return false;
    }
  }
  return true;
};

const getEmptySeedWords = () => {
  const seedWords = [];
  for (let i = 0; i < 33; i++) {
    seedWords.push({
      word: "",
      index: i,
      error: false
    });
  }
  return seedWords;
};

const ExistingSeed = ({
  decodeSeed,
  sendContinue,
  setSeed,
  setPassPhrase,
  onCreateWallet,
  isValid,
  setError,
  error,
  sendBack
}) => {
  const [seedWords, setSeedWords] = useState(getEmptySeedWords());
  const [hexSeed, setSeedHex] = useState(null);
  const [showPasteWarning, setShowPasteWarning] = useState(false);
  const [showPasteError, setShowPasteError] = useState(false);
  const [seedType, setSeedType] = useState(WORDS);
  const prevHexSeed = usePrevious(hexSeed);
  const prevSeedWords = usePrevious(seedWords);

  const getSeedWordsStr = useCallback(
    (seedWords) =>
      seedType === HEX ? hexSeed : seedWords.map(({ word }) => word).join(" "),
    [hexSeed, seedType]
  );

  const onError = useCallback(
    (seedError, seedWord) => {
      const seedErrorStr = seedError.details || "";

      const countWords = () => {
        let count = 0;
        seedWords.forEach((wordObj) => {
          if (wordObj.word && wordObj.word.length > 0) count++;
        });
        return count;
      };
      if (countWords() <= 1) {
        // Weird errors with one word, better to avoid them.
        return;
      }
      // if user has not completed filing all words we avoid showing invalid decoding.
      if (seedErrorStr.includes(MISMATCH_ERROR) && countWords() < 33) {
        return;
      }
      if (seedErrorStr.includes(POSITION_ERROR) && seedWord) {
        // read invalid word position from the error msg
        // (e.g. `word aardvark is not valid at position 1, check for missing words`)
        const regexp = new RegExp(`${POSITION_ERROR} (\\d+)`, "g");
        const regexpArray = regexp.exec(seedErrorStr);
        if (regexpArray != null && typeof regexpArray[1] !== "undefined") {
          const updatedSeedWords = [...seedWords];
          updatedSeedWords[seedWord.index] = seedWord;
          updatedSeedWords[regexpArray[1]] = {
            ...updatedSeedWords[regexpArray[1]],
            error: true
          };
          setSeedWords(updatedSeedWords);
        }
      }
      setSeed([]);
    },
    [setSeed, seedWords]
  );

  useEffect(() => {
    // compare provided hex against previous values
    // and return if values didn't change
    if (seedType === WORDS) {
      if (
        !prevSeedWords ||
        !seedWords ||
        seedWords.length !== 33 ||
        isEqualPreviousSeed({
          prevSeedWords,
          seedWords
        })
      ) {
        return;
      }
    } else if (prevHexSeed === hexSeed) {
      return;
    }
    const seedWordStr = getSeedWordsStr(seedWords);
    decodeSeed(seedWordStr)
      // if no errors happened we set the seed at our machine state
      .then((response) => {
        setSeed(response.getDecodedSeed());
        setError("");
      })
      .catch(onError);
  }, [
    seedWords,
    seedType,
    hexSeed,
    prevSeedWords,
    prevHexSeed,
    getSeedWordsStr,
    decodeSeed,
    setError,
    setSeed,
    onError
  ]);

  const handleOnPaste = useCallback((e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text");
    pasteFromClipboard(clipboardData);
  }, []);

  const pasteFromClipboard = (wordsFromClipboard) => {
    const lowercaseSeedWords = SEED_WORDS.map((w) => w.toLowerCase());
    const words = wordsFromClipboard
      .split(/\b/)
      .filter((w) => /^[\w]+$/.test(w))
      .filter((w) => lowercaseSeedWords.indexOf(w.toLowerCase()) > -1)
      .map((w, i) => ({ index: i, word: w }));

    if (words.length === 33) {
      setSeedWords(words);
      setShowPasteWarning(true);
      setShowPasteError(false);
      return true;
    } else {
      setShowPasteWarning(false);
      setShowPasteError(true);
      return false;
    }
  };

  const handleToggle = useCallback((side) => {
    setSeedType(side === "left" ? WORDS : HEX);
  }, []);

  const validateSeed = useCallback(
    (updatedSeedWords) =>
      decodeSeed(getSeedWordsStr(updatedSeedWords))
        // if no errors happened we set the seed at our state machine
        .then((response) => {
          setSeed(response.getDecodedSeed());
          setError("");
        }),
    [decodeSeed, getSeedWordsStr, setError, setSeed]
  );

  const isHexValid = useCallback((seed) => {
    if (seed.length !== 64 && seed.length > SEED_LENGTH.HEX_MIN) {
      return false;
    }
    return /^[0-9a-fA-F]*$/.test(seed) && seed.length <= SEED_LENGTH.HEX_MAX;
  }, []);

  const onChangeSeedWord = useCallback(
    (seedWord, update) => {
      const updatedSeedWords = [...seedWords];
      updatedSeedWords[seedWord.index] = {
        word: update,
        index: seedWord.index,
        error: false
      };

      // validate seed inputed as words
      if (seedType === WORDS) {
        setSeedWords(updatedSeedWords);
        return validateSeed(updatedSeedWords).catch((err) =>
          onError(err, updatedSeedWords[seedWord.index])
        );
      } else {
        // validate seed inputed as HEX
        const trimmedSeed = seedWord.trim();
        if (isHexValid(trimmedSeed)) {
          setSeedHex(trimmedSeed);
          setShowPasteWarning(false);
          setShowPasteError(false);
        } else {
          setError(
            <T
              id="confirmSeed.errors.hexNot32Bytes"
              m="Error: seed is not 32 bytes, such comes from a non-supported software and may have unintended consequences."
            />
          );
        }
      }
    },
    [isHexValid, seedType, onError, seedWords, setError, validateSeed]
  );

  return (
    <ExistingSeedForm
      {...{
        seedWords,
        onChangeSeedWord,
        setSeedHex,
        hexSeed,
        handleOnPaste,
        pasteFromClipboard,
        handleToggle,
        showPasteWarning,
        showPasteError,
        setPassPhrase,
        seedType,
        sendBack,
        error,
        onCreateWallet,
        isValid,
        sendContinue
      }}
    />
  );
};

export default ExistingSeed;
