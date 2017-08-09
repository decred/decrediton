// @flow
import React from "react";
import "../style/MiscComponents.less";

class ManagePoolsButton extends React.Component {
  render() {
    return (
      <a className="manage-pools-button" onClick={this.props.onClick} />
    );

  }
}

export default ManagePoolsButton;
