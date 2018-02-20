// @flow
import copy from "clipboard-copy";
import { FormattedMessage as T } from "react-intl";
import "style/MiscComponents.less";

@autobind
class CopyToClipboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { success: "hidden" };
  }

  onClick() {
    if (copy(this.props.textToCopy)) this.setState({ success: "" });
  }

  onMouseLeave() {
    if (this.state.success === "") this.setState({ success: "hidden" });
  }

  render() {
    const successBanner = [ "copy-to-clipboard-success", this.state.success ].join(" ");
    const button = [ "clipboard-box", this.props.className ].join(" ");
    return (
      <div className={ button }>
        <div className={ successBanner }>
          <T id="clipboard.copied" m="Copied" />
        </div>
        <a className="copy-to-clipboard-icon" onClick={this.onClick} onMouseLeave={this.onMouseLeave} />
      </div>
    );
  }
}

CopyToClipboard.propTypes = { textToCopy: PropTypes.string.isRequired };

export default CopyToClipboard;
