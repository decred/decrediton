import { expect } from "@jest/globals";
import { encodeMnemonic } from "helpers/seed";

const TEST_DATA = [
  {
    hex: "",
    seed: ["exceed"]
  },
  {
    hex: "00",
    seed: ["aardvark", "belowground"]
  },
  {
    hex: "ff",
    seed: ["Zulu", "recipe"]
  },
  {
    hex: "0000",
    seed: ["aardvark", "adroitness", "crackdown"]
  },
  {
    hex: "ffff",
    seed: ["Zulu", "Yucatan", "watchword"]
  },
  {
    hex: "e58294f2e9a227486e8b061b31cc528fd7fa3f19",
    seed: [
      "topmost",
      "Istanbul",
      "Pluto",
      "vagabond",
      "treadmill",
      "Pacific",
      "brackish",
      "dictator",
      "goldfish",
      "Medusa",
      "afflict",
      "bravado",
      "chatter",
      "revolver",
      "Dupont",
      "midsummer",
      "stopwatch",
      "whimsical",
      "cowbell",
      "bottomless",
      "fracture"
    ]
  },
  {
    hex: "d1d464c004f00fb5c9a4c8d8e433e7fb7ff56256",
    seed: [
      "stairway",
      "souvenir",
      "flytrap",
      "recipe",
      "adrift",
      "upcoming",
      "artist",
      "positive",
      "spearhead",
      "Pandora",
      "spaniel",
      "stupendous",
      "tonic",
      "concurrent",
      "transit",
      "Wichita",
      "lockup",
      "visitor",
      "flagpole",
      "escapade",
      "merit"
    ]
  },
  {
    hex: "e34cd132128c1929ec96865ced5c4d0bf40a5d021fcef58d27dbfee371d210",
    seed: [
      "tissue",
      "disbelief",
      "stairway",
      "component",
      "atlas",
      "megaton",
      "bedlamp",
      "certify",
      "tumor",
      "monument",
      "necklace",
      "fascinate",
      "tunnel",
      "fascinate",
      "dreadful",
      "armistice",
      "upshot",
      "Apollo",
      "exceed",
      "aftermath",
      "billiard",
      "sardonic",
      "vapor",
      "microscope",
      "brackish",
      "suspicious",
      "woodlark",
      "torpedo",
      "hamlet",
      "sensation",
      "assume",
      "recipe"
    ]
  },
  {
    hex: "00000000000000000000000000000000000000000000000000000000000000",
    seed: [
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "adroitness",
      "aardvark",
      "insurgent"
    ]
  }
];

TEST_DATA.forEach((tc) =>
  test("hex seed " + tc.hex, async () =>
    expect(await encodeMnemonic(tc.hex)).toStrictEqual(tc.seed)
  )
);
