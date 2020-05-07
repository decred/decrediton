import { LinearProgressSmall } from "indicators";
import { FormattedMessage as T } from "react-intl";
import { rescan } from "connectors";
import "style/GetStarted.less";

const RescanWalletFormBody = ({
  rescanEndBlock,
  rescanStartBlock,
  rescanCurrentBlock
}) => (
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
        rescanCurrentBlock:
          rescanCurrentBlock > rescanStartBlock
            ? rescanCurrentBlock
            : rescanStartBlock,
        rescanEndBlock: rescanEndBlock
      }}
    />
  </>
);

export default rescan(RescanWalletFormBody);
