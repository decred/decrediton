import { InvisibleButton } from "buttons";

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
      <InvisibleButton
        className={classNames[direction]}
        onClick={this.onClick}
      >
        {labels[direction]}
      </InvisibleButton>
    );
  }
}

ActionButton.propTypes = propTypes;

export default ActionButton;
