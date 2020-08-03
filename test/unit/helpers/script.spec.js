import { MAINNET_scriptDataTest, TESTNET_scriptDataTest } from "../../data/script";
import { extractPkScriptAddrs } from "../../../app/helpers/scripts";
import { MainNetParams, TestNetParams } from "../../../app/constants"; 

const scriptVersion = 0;

MAINNET_scriptDataTest.forEach(testData => {
  test(testData.name, () => {
    expect(extractPkScriptAddrs(scriptVersion, testData.script, MainNetParams)).toStrictEqual(testData.expected);
  });
});

TESTNET_scriptDataTest.forEach(testData => {
  test(testData.name, () => {
    expect(extractPkScriptAddrs(scriptVersion, testData.script, TestNetParams)).toStrictEqual(testData.expected);
  });
});
