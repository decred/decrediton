import { classNames } from "pi-ui";
import { InvisibleButton } from "buttons";

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  disabled: PropTypes.bool,
  isCurrent: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

const PageButton = ({ value, disabled, isCurrent, onClick }) => (
  <InvisibleButton
    className={classNames("paginator-page-button", isCurrent && "active")}
    disabled={disabled}
    onClick={() => onClick(value)}>
    {isFinite(value) ? value + 1 : value}
  </InvisibleButton>
);

PageButton.propTypes = propTypes;

export default PageButton;
