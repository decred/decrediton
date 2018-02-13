import Header from "../DefaultHeader";
import LinearProgress from "material-ui/LinearProgress";
import { FormattedMessage as T } from "react-intl";
import { SlateGrayButton } from "buttons";
import "style/GetStarted.less";

const RescanWalletFormHeader = ({
  startupError,
}) => (
  <Header
    headerMetaOverview={<T id="getStarted.header.rescanWallet.meta" m="Scanning blocks for transactions" />}
    headerTop={startupError
      ? <div key="pubError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="pubError" ></div>}
  />
);

const RescanWalletFormBody = ({
  onShowLogs,
  rescanEndBlock,
  rescanStartBlock,
  rescanCurrentBlock,
  showLongWaitMessage
}) => (
  showLongWaitMessage &&
    <div className="get-started-content-new-seed">
      <div className="get-started-content-instructions">
        <LinearProgress
          mode="determinate"
          min={rescanStartBlock}
          max={rescanEndBlock}
          value={rescanCurrentBlock}
        />

        <p>
          <T
            id="getStarted.walletRescan.progress"
            m="Rescan Progress ({rescanCurrentBlock} / {rescanEndBlock})"
            values={{
              rescanCurrentBlock: rescanCurrentBlock > rescanStartBlock
                ? rescanCurrentBlock
                : rescanStartBlock,
              rescanEndBlock: rescanEndBlock
            }}
          />
        </p>
      </div>

      <div className="get-started-bottom-buttons">
        <SlateGrayButton onClick={onShowLogs}>
          <T id="getStarted.btnLogs" m="Logs" />
        </SlateGrayButton>
      </div>
    </div>
);

export { RescanWalletFormHeader, RescanWalletFormBody };
