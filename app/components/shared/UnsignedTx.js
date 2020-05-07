import { CopyToClipboard } from "shared";

export default ({ tx, title }) => (
  <div className="unsigned-raw-tx-area">
    <div className="unsigned-raw-tx-title">{title}</div>
    <div className="unsigned-raw-tx">{tx}</div>
    <CopyToClipboard
      textToCopy={tx}
      className="unsigned-raw-tx-copy-to-clipboard-icon"
    />
  </div>
);
