import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import "style/EyeFilterMenu.less";
import "style/MiscComponents.less";

@autobind
class EyeFilterMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = { menuOpen: false };
  }

  onMenuChanged(event, value) {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  onMenuRequestChange(opening) {
    this.setState({ menuOpen: opening });
  }

  render() {
    //<span className="eye-filter-menu-button-icon-arrow" />
    const options = this.props.options;
    const labelKey = this.props.labelKey || "label";
    const keyField = this.props.keyField || labelKey;
    const { menuOpen } = this.state;
    const extraClassName = " " + this.props.className || "";
    const selected = this.props.selected;

    return (
      <IconMenu
        className={"eye-filter-menu " + (menuOpen ? "menu-open" : "") + extraClassName}
        onChange={this.onMenuChanged}
        onRequestChange={this.onMenuRequestChange}
        open={menuOpen}
        iconButtonElement={
          <IconButton
            className="eye-filter-menu-button"
            iconClassName="eye-filter-menu-button-icon"
            style={{ padding: null, height: null, width: null }}/> }
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        targetOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {options.map(opt => (
          <MenuItem
            className={"context-menu-item " + (selected === opt[keyField] ? "selected" : "")}
            key={opt[keyField]}
            value={opt}
            style={{ fontSize: null, lineHeight: null, minHeight: null, padding: null }}
            primaryText={opt[labelKey]} />
        ))}
      </IconMenu>
    );
  }
}

export default EyeFilterMenu;
