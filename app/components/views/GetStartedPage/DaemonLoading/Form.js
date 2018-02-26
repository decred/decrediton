import { LinearProgressFull, DecredLoading } from "indicators";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { SlateGrayButton, InvisibleButton } from "buttons";
import "style/GetStarted.less";

export default ({
  Form,
  text,
  getCurrentBlockCount,
  getDaemonStarted,
  getNeededBlocks,
  finishDateEstimation,
  onShowSettings,
  onShowLogs,
  onShowTutorial,
  startupError,
  ...props,
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader">
      <Aux>
        <div className="content-title">
          <div className="loader-settings-logs">
            <InvisibleButton onClick={onShowSettings}>
              <T id="getStarted.btnSettings" m="Settings" />
            </InvisibleButton>
            <InvisibleButton onClick={onShowLogs}>
              <T id="getStarted.btnLogs" m="Logs" />
            </InvisibleButton>
          </div>
          <T id="loader.title" m={"Welcome to Decrediton Wallet"}/>
        </div>
        <div className="loader-buttons">
          <SlateGrayButton onClick={onShowTutorial}>
            <T id="getStarted.learnBasics" m="Learn the Basics" />
          </SlateGrayButton>
        </div>
        <div className="loader-bar">
          <LinearProgressFull
            error={startupError}
            disabled={!getDaemonStarted || getCurrentBlockCount == null}
            barText={text}
            min={0}
            max={getNeededBlocks}
            value={getCurrentBlockCount}
          />
          <div className="loader-bar-estimation">
            <T id="getStarted.chainLoading.syncEstimation" m="Estimated time left"/>
            <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : "--"} ({getCurrentBlockCount} / {getNeededBlocks})</span>
          </div>
        </div>
        <div className="loader-bar-icon">
          <DecredLoading hidden={startupError || props.isInputRequest} />
        </div>
        { Form && <Form {...{ ...props, startupError }}/> }
      </Aux>
    </div>
  </div>
);
