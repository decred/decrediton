import { SEED_WORDS } from "constants/seed";
import { shuffle } from "helpers";

export const getSeedWordsArr = (mnemonic) => {
  const splitMnemonicArr = mnemonic.split(" ");
  const seedWordsArr = splitMnemonicArr.map((word) => {
    const fakeWords = shuffle(SEED_WORDS.filter((w) => word != w)).slice(-2);
    const wordsToShow = shuffle([...fakeWords, word]);
    return {
      word,
      wordsToShow
    };
  });
  return seedWordsArr;
};

export const verifySeedWordsArr = (mnemonic, seedWordsArr) =>
  seedWordsArr
    .map((wordObj) => wordObj.wordsToShow[wordObj.selected])
    .join(" ") === mnemonic;

export const selectedSeedWordsCount = (seedWordsArr) =>
  seedWordsArr.filter((wordObj) => wordObj.selected >= 0).length;
