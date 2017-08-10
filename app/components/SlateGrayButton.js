// @flow
import React from "react";

class SlateGrayButton extends React.Component {
  render() {
    let style = {};
    Object.assign(style, this.props.style);
    if(this.props.block) {
      style.display = "block";
    }

    return (
      <div
        className={"slate-gray-button" + (this.props.className ? (" " + this.props.className) : "")}
        style={style}
        type={this.props.type}
        disabled={this.props.disabled}
        onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}

export default SlateGrayButton;
