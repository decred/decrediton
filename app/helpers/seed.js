import wordlist from "./wordlist";

const seedWord = (b, index) => {
  let bb = b * 2;
  if (index % 2 !== 0) {
    bb++;
  }
  return wordlist[bb];
};

export const encodeMnemonic = async (hexSeed) => {
  const seed = new Uint8Array(Buffer.from(hexSeed, "hex"));
  const words = [];
  seed.forEach((b, index) => words.push(seedWord(b, index)));
  const sha256 = async (data) =>
    new Uint8Array(await crypto.subtle.digest("SHA-256", data));
  const checksumByte = (await sha256(await sha256(seed)))[0];
  const checksumWord = seedWord(checksumByte, seed.length);
  words.push(checksumWord);
  return words;
};
