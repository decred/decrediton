import GetStartedWrapper from "./GetStarted";
import { injectIntl } from "react-intl";
import { useGetStarted } from "./hooks";

const GetStarted = () => {
  const {
    onShowLogs,
    onShowSettings,
    updateAvailable,
    isTestNet,
    PageComponent
  } = useGetStarted();

  return (
    <GetStartedWrapper
      PageComponent={PageComponent}
      {...{ onShowLogs, onShowSettings, updateAvailable, isTestNet }}
    />
  );
};

export default injectIntl(GetStarted);
