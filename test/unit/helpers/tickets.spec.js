import { decodeVoteScript, hexToBytes } from "helpers";

test("test decodeVoteScript", () => {
  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06150004000000"))
  ).toStrictEqual({
    sdiffalgorithm: "yes",
    lnsupport: "yes"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06130004000000"))
  ).toStrictEqual({
    sdiffalgorithm: "no",
    lnsupport: "yes"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06050005000000"))
  ).toStrictEqual({
    lnfeatures: "yes"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06030005000000"))
  ).toStrictEqual({
    lnfeatures: "no"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06050006000000"))
  ).toStrictEqual({
    fixlnseqlocks: "yes"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06030006000000"))
  ).toStrictEqual({
    fixlnseqlocks: "no"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06050007000000"))
  ).toStrictEqual({
    headercommitments: "yes"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06030007000000"))
  ).toStrictEqual({
    headercommitments: "no"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06050008000000"))
  ).toStrictEqual({
    treasury: "yes"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06550109000000"))
  ).toStrictEqual({
    reverttreasurypolicy: "yes",
    explicitverupgrades: "yes",
    autorevocations: "yes",
    changesubsidysplit: "yes"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06d50009000000"))
  ).toStrictEqual({
    reverttreasurypolicy: "yes",
    explicitverupgrades: "yes",
    autorevocations: "yes",
    changesubsidysplit: "no"
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06010009000000"))
  ).toStrictEqual({
    reverttreasurypolicy: "abstain",
    explicitverupgrades: "abstain",
    autorevocations: "abstain",
    changesubsidysplit: "abstain"
  });

  expect(
    decodeVoteScript("testnet", hexToBytes("6a0655010a000000"))
  ).toStrictEqual({
    reverttreasurypolicy: "yes",
    explicitverupgrades: "yes",
    autorevocations: "yes",
    changesubsidysplit: "yes"
  });

  expect(
    decodeVoteScript("testnet", hexToBytes("6a0601000a000000"))
  ).toStrictEqual({
    reverttreasurypolicy: "abstain",
    explicitverupgrades: "abstain",
    autorevocations: "abstain",
    changesubsidysplit: "abstain"
  });
});
