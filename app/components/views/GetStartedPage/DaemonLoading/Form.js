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
  showLongWaitMessage,
  finishDateEstimation,
  onShowSettings,
  onShowLogs,
  onShowTutorial,
  ...props,
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader">
      {getDaemonStarted ? getCurrentBlockCount == null ?
        showLongWaitMessage ?
          <Aux>
            <div className="get-started-fetch-headers-message">
              <T id="getStarted.chainLoading" m="The Decred chain is currently loading and may take a few minutes." />
            </div>
            <div className="get-started-bottom-buttons">
              <SlateGrayButton onClick={onShowLogs}>
                <T id="getStarted.btnLogs" m="Logs" />
              </SlateGrayButton>
            </div>
          </Aux> :
          <div></div> :
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
          <DecredLoading
            hidden={props.startupError || props.isInputRequest || props.showSettings || props.showLogs}
            className="get-started-loading"
          />
          <Form {...props}/>
        </Aux> :
        <div></div> }
    </div>
  </div>
);
