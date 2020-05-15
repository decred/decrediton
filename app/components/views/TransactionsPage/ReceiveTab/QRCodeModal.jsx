import QRCode from "./QRCode";
import { FormattedMessage as T } from "react-intl";
import style from "./ReceiveTab.module.css";

const QRCodeModal = ({ nextAddress, amount, setModal }) => (
  <div className={style.root}>
    <div className={style.modal}>
      <div className={style.decredLogo} />
      <div className={style.modalMain}>
        <div className={style.modalLabel}>
          <T
            id="receive.modalLabel"
            m="{value}"
            values={{ value: "This is My Decred (DCR) Address" }}
          />
        </div>
        <div className={style.modalAddress}>{nextAddress}</div>
        <div className={style.modalQR}>
          <QRCode addr={nextAddress} amount={amount} />
        </div>
      </div>
      <div className={style.modalSecond}>
        <div className={style.modalClose} onClick={() => setModal(false)}>
          <T id="receive.modalClose" m="Close" />
        </div>
        {/* <div className={style.modalShare} /> */}
      </div>
    </div>
  </div>
);

export default QRCodeModal;
