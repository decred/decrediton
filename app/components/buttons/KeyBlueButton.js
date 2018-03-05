import { SimpleLoading } from "indicators";
import "style/MiscComponents.less";

@autobind
class KeyBlueButton extends React.Component {
  render() {
    let className = "button ";
    className += !this.props.disabled ? "key-blue-button"
      : "key-blue-button-disabled";
    let style = {};
    Object.assign(style, this.props.style);
    if(!this.props.disabled && this.props.block) {
      style.display = "block";
    }

    if(this.props.className) {
      className += " " + this.props.className;
    }

    return (
      <div
        className={className}
        style={style}
        type={this.props.type}
        disabled={this.props.disabled}
        onClick = {this.onClick}
        hidden={this.props.hidden}>
        {this.props.loading ? <SimpleLoading {...{ disabled: this.props.disabled }}/> : this.props.children}
      </div>
    );
  }

  onClick (e) {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(e);
    }
  }
}

export default KeyBlueButton;
