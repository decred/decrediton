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
    (seedError) => {
      const seedErrorStr = seedError.details || "";

      const populatedSeedWords = seedWords.filter(
        (seedWord) => seedWord.word && seedWord.word.length > 0
      );

      // hide all error messages and indicators
      const hideError = () => {
        setError("");
        if (seedWords.filter((seedWord) => seedWord.error).length > 0) {
          setSeedWords(
            seedWords.map((seedWord) => {
              return {
                ...seedWord,
                error: false
              };
            })
          );
        }
      };

      if (populatedSeedWords.length <= 1) {
        // Weird errors with one word, better to avoid them.
        return;
      }

      if (seedErrorStr.includes(MISMATCH_ERROR)) {
        if (populatedSeedWords.length == 33) {
          setError(
            <T
              id="existingSeed.errors.seedError"
              m="Error: seed is not valid."
            />
          );
        } else {
          hideError();
        }
        return;
      }

      if (seedErrorStr.includes(POSITION_ERROR)) {
        // read invalid word position from the error msg
        // (e.g. `word aardvark is not valid at position 1, check for missing words`)
        const regexp = new RegExp(`${POSITION_ERROR} (\\d+)`, "g");
        const regexpArray = regexp.exec(seedErrorStr);
        if (regexpArray != null) {
          const position = regexpArray[1];

          // The position index in the position error message
          // does not take count of empty inputs.
          const fixedPosition = populatedSeedWords[position].index;

          const updatedSeedWords = [...seedWords];
          updatedSeedWords[fixedPosition] = {
            ...updatedSeedWords[fixedPosition],
            error: true
          };
          setSeedWords(updatedSeedWords);

          setError(
            <T
              id="existingSeed.errors.positionError"
              m="Error: word on position {position} is not valid."
              values={{ position: fixedPosition + 1 }}
            />
          );
        }
      }
      setSeed([]);
    },
    [setSeed, seedWords, setError]
  );

  useEffect(() => {
    const validateSeed = (updatedSeedWords) =>
      decodeSeed(getSeedWordsStr(updatedSeedWords))
        // if no errors happened we set the seed at our state machine
        .then((response) => {
          setSeed(response.getDecodedSeed());
          setError("");
        });

    // compare provided hex against previous values
    // and return if values didn't change
    if (seedType === WORDS) {
      if (
        !prevSeedWords ||
        !seedWords ||
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
    validateSeed(seedWords).catch((err) => {
      setSeed([]);
      return onError(err);
    });
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

  const handleOnPaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text");
    pasteFromClipboard(clipboardData);
  };

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

  const handleToggle = (side) => {
    setSeedType(side === "left" ? WORDS : HEX);
  };

  const isHexValid = (seed) => {
    if (seed.length !== 64 && seed.length > SEED_LENGTH.HEX_MIN) {
      return false;
    }
    return /^[0-9a-fA-F]*$/.test(seed) && seed.length <= SEED_LENGTH.HEX_MAX;
  };

  const onChangeSeedWord = useCallback(
    (seedWord, update) => {
      // validate seed inputed as words
      if (seedType === WORDS) {
        // only need update the seedWords if there was a change
        if (seedWords[seedWord.index].word != update) {
          const updatedSeedWords = [...seedWords];
          updatedSeedWords[seedWord.index] = {
            word: update,
            index: seedWord.index,
            error: false
          };
          setSeedWords(updatedSeedWords);
        }
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
    [seedType, seedWords, setError]
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
