import qr from "qr-image";
import style from "./ReceiveTab.module.css";

const QRCode = ({ addr, amount }) => {

    let uri = "decred:" + addr;
    if (!isNaN(amount) && amount > 0) {
      uri += "?amount=" + amount;
    }

    const qr_img = qr.imageSync(uri, { type: "svg", ec_level: "H" });
    return (<div className={style.qrCode} dangerouslySetInnerHTML={{ __html:qr_img }}></div>);
}

export default QRCode;
