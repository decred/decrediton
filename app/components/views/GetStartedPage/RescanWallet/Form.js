import { LinearProgressSmall } from "indicators";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

const RescanWalletFormBody = ({
  rescanEndBlock,
  rescanStartBlock,
  rescanCurrentBlock,
  showLongWaitMessage,
  isSPV,
}) => (
  rescanCurrentBlock && rescanCurrentBlock > 0 ?
    (!isSPV ?
      showLongWaitMessage &&
      <Aux>
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
      </Aux> :
      <Aux>
        <T
          id="getStarted.walletRescanSPV.progress"
          m="Scanned through {rescanCurrentBlock}"
          values={{
            rescanCurrentBlock: rescanCurrentBlock
          }}
        />
      </Aux>) :
    <div/>
);

export { RescanWalletFormBody };
