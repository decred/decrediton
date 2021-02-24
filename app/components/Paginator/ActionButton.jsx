import { InvisibleButton } from "buttons";

const propTypes = {
  direction: PropTypes.oneOf(["next", "previous"]).isRequired,
  onClick: PropTypes.func.isRequired
};

const ActionButton = ({ direction, onClick }) => {
  const labels = {
    next: "▶",
    previous: "◀"
  };

  const classNames = {
    next: "paginator-action-button-next",
    previous: "paginator-action-button-previous"
  };

  return (
    <InvisibleButton
      className={classNames[direction]}
      onClick={() => onClick(direction)}>
      {labels[direction]}
    </InvisibleButton>
  );
};

ActionButton.propTypes = propTypes;

export default ActionButton;
