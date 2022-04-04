import { decodeVoteScript, hexToBytes } from "helpers";

test("test decodeVoteScript", () => {
  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06150004000000"))
  ).toStrictEqual({
    voteChoices: {
      sdiffalgorithm: "yes",
      lnsupport: "yes"
    },
    version: 4,
    bits: "0x0015",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06130004000000"))
  ).toStrictEqual({
    voteChoices: {
      sdiffalgorithm: "no",
      lnsupport: "yes"
    },
    version: 4,
    bits: "0x0013",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06050005000000"))
  ).toStrictEqual({
    voteChoices: {
      lnfeatures: "yes"
    },
    version: 5,
    bits: "0x0005",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06030005000000"))
  ).toStrictEqual({
    voteChoices: {
      lnfeatures: "no"
    },
    version: 5,
    bits: "0x0003",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06050006000000"))
  ).toStrictEqual({
    voteChoices: {
      fixlnseqlocks: "yes"
    },
    version: 6,
    bits: "0x0005",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06030006000000"))
  ).toStrictEqual({
    voteChoices: {
      fixlnseqlocks: "no"
    },
    version: 6,
    bits: "0x0003",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06050007000000"))
  ).toStrictEqual({
    voteChoices: {
      headercommitments: "yes"
    },
    version: 7,
    bits: "0x0005",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06030007000000"))
  ).toStrictEqual({
    voteChoices: {
      headercommitments: "no"
    },
    version: 7,
    bits: "0x0003",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06050008000000"))
  ).toStrictEqual({
    voteChoices: {
      treasury: "yes"
    },
    version: 8,
    bits: "0x0005",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06550109000000"))
  ).toStrictEqual({
    voteChoices: {
      reverttreasurypolicy: "yes",
      explicitverupgrades: "yes",
      autorevocations: "yes",
      changesubsidysplit: "yes"
    },
    version: 9,
    bits: "0x0155",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06d50009000000"))
  ).toStrictEqual({
    voteChoices: {
      reverttreasurypolicy: "yes",
      explicitverupgrades: "yes",
      autorevocations: "yes",
      changesubsidysplit: "no"
    },
    version: 9,
    bits: "0x00d5",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06010009000000"))
  ).toStrictEqual({
    voteChoices: {
      reverttreasurypolicy: "abstain",
      explicitverupgrades: "abstain",
      autorevocations: "abstain",
      changesubsidysplit: "abstain"
    },
    version: 9,
    bits: "0x0001",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("mainnet", hexToBytes("6a06540109000000"))
  ).toStrictEqual({
    voteChoices: {
      reverttreasurypolicy: "yes",
      explicitverupgrades: "yes",
      autorevocations: "yes",
      changesubsidysplit: "yes"
    },
    version: 9,
    bits: "0x0154",
    isLastBlockValid: 0
  });

  expect(
    decodeVoteScript("testnet", hexToBytes("6a0655010a000000"))
  ).toStrictEqual({
    voteChoices: {
      reverttreasurypolicy: "yes",
      explicitverupgrades: "yes",
      autorevocations: "yes",
      changesubsidysplit: "yes"
    },
    version: 10,
    bits: "0x0155",
    isLastBlockValid: 1
  });

  expect(
    decodeVoteScript("testnet", hexToBytes("6a0601000a000000"))
  ).toStrictEqual({
    voteChoices: {
      reverttreasurypolicy: "abstain",
      explicitverupgrades: "abstain",
      autorevocations: "abstain",
      changesubsidysplit: "abstain"
    },
    version: 10,
    bits: "0x0001",
    isLastBlockValid: 1
  });
});
