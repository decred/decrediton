import InvisibleButton from "../InvisibleButton";
import { eventOutsideComponent } from "helpers";
import EventListener from "react-event-listener";
import "style/EyeFilterMenu.less";
import "style/MiscComponents.less";

const MenuItem = ({ primaryText, className, value, onClick }) => (
  <div
    className={className}
    onClick={e => onClick(e, value)}
  >
    {primaryText}
  </div>
);

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
    this.setState({ menuOpen: false });
  }

  toggleMenuOpen() {
    this.setState({ menuOpen: !this.state.menuOpen });
    if (this.state.menuOpen) {
      this.props.unmountMenu && this.props.unmountMenu();
    }
  }

  mouseUp(event) {
    if (eventOutsideComponent(this, event.target)) {
      this.setState({ menuOpen: false });
      this.props.unmountMenu && this.props.unmountMenu();
    }
  }

  getOpenedMenu() {
    const options = this.props.options;
    const labelKey = this.props.labelKey || "label";
    const keyField = this.props.keyField || labelKey;
    const selected = this.props.selected;
    const belowMenu = this.props.getOpenedMenu && this.props.getOpenedMenu();

    return (
      <div className="eye-filter-menu-items">
        <div className={"arrow-up"}/>
        {options.map(opt => (
          <MenuItem
            className={"context-menu-item " + (selected === opt[keyField] ? "selected" : "")}
            key={opt[keyField]}
            value={opt}
            onClick={this.onMenuChanged}
            primaryText={opt[labelKey]} />
        ))}
        {belowMenu}
      </div>
    );
  }

  render() {
    const className = [ "eye-filter-menu", this.props.className || "",
      (menuOpen ? "menu-open" : "") ].join(" ");
    const { menuOpen } = this.state;

    const menu = menuOpen ? this.getOpenedMenu() : null;

    return (
      <EventListener target="document" onMouseUp={this.mouseUp}>
        <div className={className}>
          <div className="eye-filter-menu-button">
            <InvisibleButton
              className="eye-filter-menu-button-icon"
              onClick={this.toggleMenuOpen}
            />
          </div>
          {menu}
        </div>
      </EventListener>
    );
  }
}

export default EyeFilterMenu;
