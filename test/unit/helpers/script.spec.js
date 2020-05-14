import { scriptDataTest } from "../../data/script";
import { extractPkScriptAddrs } from "../../../app/helpers/scripts";
import { MainNetParams } from "../../../app/constants";

const scriptVersion = 0;
scriptDataTest.forEach(testData => {
  test(testData.name, () => {
    expect(extractPkScriptAddrs(scriptVersion, testData.script, MainNetParams)).toStrictEqual(testData.expected);
  });
});
