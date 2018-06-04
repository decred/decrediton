import { InvisibleButton } from "buttons";

const propTypes = {
  value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
  disabled: PropTypes.bool,
  isCurrent: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

@autobind
class PageButton extends React.Component {
  onClick() {
    this.props.onClick(this.props.value);
  }

  render() {
    const { value, isCurrent, disabled } = this.props;
    return (
      <InvisibleButton
        className={[ "paginator-page-button", isCurrent ? "active" : "" ].join(" ")}
        disabled={disabled}
        onClick={this.onClick}
      >
        {isFinite(value) ? value+1 : value}
      </InvisibleButton>
    );
  }
}

PageButton.propTypes = propTypes;

export default PageButton;
