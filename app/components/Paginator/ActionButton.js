// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import FlatButton from "material-ui/FlatButton";

const propTypes = {
  direction: PropTypes.oneOf(["next", "previous"]).isRequired,
  onClick: PropTypes.func.isRequired
};

@autobind
class ActionButton extends React.Component {
  onClick() {
    this.props.onClick(this.props.direction);
  }

  render() {
    const labels = {
      next: "→",
      previous: "←"
    };
    const classNames = {
      next: "paginator-action-button-next",
      previous: "paginator-action-button-previous"
    };
    const {direction} = this.props;

    return (
      <FlatButton
        className={classNames[direction]}
        style={{fontSize: null, minWidth: null, height: null, buttonHeight: null, margin: null}}
        label={labels[direction]}
        onClick={this.onClick}
        hoverColor={"#e9f8ff"}
      />
    );
  }
}

ActionButton.propTypes = propTypes;

export default ActionButton;
