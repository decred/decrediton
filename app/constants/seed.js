export const SEED_WORDS = require("../helpers/wordlist.js");
SEED_WORDS.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export const SEED_LENGTH = {
  WORDS: 33,
  HEX_MAX: 128,
  HEX_MIN: 32
};
