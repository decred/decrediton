import { LinearProgressSmall } from "indicators";
import { FormattedMessage as T } from "react-intl";
import { useRescan } from "hooks";

const RescanWalletFormBody = () => {
  const { rescanEndBlock, rescanStartBlock, rescanCurrentBlock } = useRescan();
  return (
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
};

export default RescanWalletFormBody;
