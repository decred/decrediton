import { LinearProgressSmall } from "indicators";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

const RescanWalletFormBody = ({
  rescanEndBlock,
  rescanStartBlock,
  rescanCurrentBlock,
  showLongWaitMessage,
  isSPV
}) => (
  rescanCurrentBlock && rescanCurrentBlock > 0 ?
    (!isSPV ?
      showLongWaitMessage &&
      <>
        <LinearProgressSmall
          min={rescanStartBlock}
          max={rescanEndBlock}
          value={rescanCurrentBlock}
        />
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
      </> :
      <>
        <T
          id="getStarted.walletRescanSPV.progress"
          m="Scanned through {rescanCurrentBlock}"
          values={{
            rescanCurrentBlock: rescanCurrentBlock
          }}
        />
      </>) :
    <div/>
);

export { RescanWalletFormBody };
