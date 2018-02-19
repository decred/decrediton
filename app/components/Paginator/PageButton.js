import FlatButton from "material-ui/FlatButton";

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
      <FlatButton
        className="paginator-page-button"
        primary={isCurrent}
        disabled={disabled}
        label={isFinite(value) ? value+1 : value}
        onClick={this.onClick}
        style={{ minWidth: null, height: null, buttonHeight: null, padding: null }}
        hoverColor={"#e9f8ff"}
      />
    );
  }
}

PageButton.propTypes = propTypes;

export default PageButton;
