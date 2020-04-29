import qr from "qr-image";
import "style/ReceivePage.less";

class QRCode extends React.Component {
  static propTypes = {
    addr: PropTypes.string.isRequired
  };
  render() {
    const { addr, amount } = this.props;

    let uri = "decred:" + addr;
    if (!isNaN(amount) && amount > 0) {
      uri += "?amount=" + amount;
    }

    const qr_img = qr.imageSync(uri, { type: "svg", ec_level: "H" });
    return (
      <div
        className="receive-content-nest-qrimage"
        dangerouslySetInnerHTML={{ __html: qr_img }}></div>
    );
  }
}

export default QRCode;
