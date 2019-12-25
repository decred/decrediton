import qr from "qr-image";
import "style/ReceivePage.less";

class QRCode extends React.Component {
  static propTypes = {
    addr: PropTypes.string.isRequired
  };
  render() {
    const qr_img = qr.imageSync("decred:"+this.props.addr, { type: "svg", ec_level: "H" });
    return (<div className="receive-content-nest-qrimage" dangerouslySetInnerHTML={{ __html:qr_img }}></div>);
  }
}

export default QRCode;
