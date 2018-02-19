import FlatButton from "material-ui/FlatButton";

const propTypes = {
  direction: PropTypes.oneOf([ "next", "previous" ]).isRequired,
  onClick: PropTypes.func.isRequired
};

@autobind
class ActionButton extends React.Component {
  onClick() {
    this.props.onClick(this.props.direction);
  }

  render() {
    const labels = {
      next: "▶",
      previous: "◀"
    };
    const classNames = {
      next: "paginator-action-button-next",
      previous: "paginator-action-button-previous"
    };
    const { direction } = this.props;

    return (
      <FlatButton
        className={classNames[direction]}
        style={{ fontSize: null, minWidth: null,
          height: null, buttonHeight: null, margin: null, color: null }}
        label={labels[direction]}
        onClick={this.onClick}
        hoverColor={"#fff"}
      />
    );
  }
}

ActionButton.propTypes = propTypes;

export default ActionButton;
