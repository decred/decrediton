import { AnimatedLinearProgressFull } from "indicators";
import { SlateGrayButton } from "buttons";
import { LearnBasicsMsg, WhatsNewLink, LoaderTitleMsg } from "./messages";
import "style/GetStarted.less";

const DaemonLoadingBody = ({
  Component, getDaemonSynced, error, text, getCurrentBlockCount, animationType,
  getNeededBlocks, syncFetchHeadersLastHeaderTime, lastDcrwalletLogLine, ...props
}) => (
  <>
    <div className="content-title">
      <LoaderTitleMsg />
    </div>
    <div className="loader-buttons">
      <SlateGrayButton className="tutorial-button" >
        <LearnBasicsMsg />
      </SlateGrayButton>
      <WhatsNewLink />
    </div>
    <div className="loader-bar">
      <AnimatedLinearProgressFull {...{ getDaemonSynced, text, value: getCurrentBlockCount, animationType, min: 0,
        max: getNeededBlocks, disabled: false, syncFetchHeadersLastHeaderTime, lastDcrwalletLogLine }} />
    </div>
    {
      error &&
      <div className="error launch-error">
        {error}
      </div>
    }
    { Component &&
      (React.isValidElement(Component) ?
        Component : <Component {...{ ...props, getDaemonSynced }} />)
    }
  </>
);

export default DaemonLoadingBody;
