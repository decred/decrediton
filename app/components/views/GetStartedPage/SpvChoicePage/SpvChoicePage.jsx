import { useDaemonStartup } from "hooks";
import Page from "./Page";

const SpvChoicePage = () => {
  const { isTestNet, toggleSpv } = useDaemonStartup();
  return <Page {...{ isTestNet, toggleSpv }} />;
};

export default SpvChoicePage;
