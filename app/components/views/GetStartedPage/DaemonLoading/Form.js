import { LinearProgressFull, DecredLoading } from "indicators";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { SlateGrayButton, InvisibleButton } from "buttons";
import "style/GetStarted.less";

export default ({
  Form,
  text,
  barText,
  isInputRequest,
  getCurrentBlockCount,
  getDaemonStarted,
  getDaemonSynced,
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
          <SlateGrayButton className="tutorial-button" onClick={onShowTutorial}>
            <T id="getStarted.learnBasics" m="Learn the Basics" />
          </SlateGrayButton>
        </div>
        <div className="loader-bar">
          <LinearProgressFull
            error={startupError}
            getDaemonSynced={getDaemonSynced}
            disabled={!getDaemonStarted || getCurrentBlockCount == null}
            barText={barText}
            min={0}
            max={getNeededBlocks}
            value={getCurrentBlockCount}
          />
          {!getDaemonStarted || getCurrentBlockCount == null || getDaemonSynced ? <div></div> :
            <div className="loader-bar-estimation">
              <T id="getStarted.chainLoading.syncEstimation" m="Estimated time left"/>
              <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : "--"} ({getCurrentBlockCount} / {getNeededBlocks})</span>
            </div>
          }
        </div>
        <div className="loader-bar-icon">
          {text && !startupError &&
            <div className="loader-bar-icon-text">
              {text}...
            </div>
          }
          {startupError &&
            <div className="loader-bar-icon-text error">
              {startupError}
            </div>
          }
          <DecredLoading hidden={startupError || isInputRequest} />
        </div>
        { Form && <Form {...{ ...props, isInputRequest, startupError }}/> }
      </Aux>
    </div>
  </div>
);
