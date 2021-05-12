import { FormattedMessage as T } from "react-intl";
import * as wallet from "wallet";
import style from "./QRCodeModal.module.css";

const QRCode = ({ addr, amount }) => {
  let uri = "decred:" + addr;
  if (!isNaN(amount) && amount > 0) {
    uri += "?amount=" + amount;
  }
  const qr_img = wallet.genQRCodeSVG(uri);
  return (
    <div
      className={style.qrCode}
      dangerouslySetInnerHTML={{ __html: qr_img }}></div>
  );
};

const QRCodeModal = ({ nextAddress, amount, setModal }) => (
  <div className={style.root}>
    <div className={style.modal}>
      <div className={style.decredLogo} />
      <div className={style.modalMain}>
        <div className={style.modalLabel}>
          <T id="receive.modalLabel" m="This is My Decred (DCR) Address" />
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
      </div>
    </div>
  </div>
);

export default QRCodeModal;
