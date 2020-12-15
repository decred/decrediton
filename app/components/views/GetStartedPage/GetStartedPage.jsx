import GetStartedWrapper from "./GetStarted";
import { injectIntl } from "react-intl";
import { useGetStarted } from "./hooks";

const GetStarted = () => {
  const {
    onShowLogs,
    onShowSettings,
    updateAvailable,
    isTestNet,
    PageComponent,
    showNavLinks
  } = useGetStarted();

  return (
    <GetStartedWrapper
      PageComponent={PageComponent}
      {...{
        onShowLogs,
        onShowSettings,
        showNavLinks,
        updateAvailable,
        isTestNet
      }}
    />
  );
};

export default injectIntl(GetStarted);
