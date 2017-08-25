import React, { Component } from "react";
import { PropTypes } from "prop-types";
import qr from "qr-image";
import { ReceiveStyles } from "../ViewStyles";

class QRCode extends Component {
  static propTypes = {
    addr: PropTypes.string.isRequired
  };
  render() {
    const qr_img = qr.imageSync("decred:"+this.props.addr, {type: "svg"});
    return (<div style={ReceiveStyles.contentNestQRImage} dangerouslySetInnerHTML={{__html:qr_img}}></div>);
  }
}

export default QRCode;
