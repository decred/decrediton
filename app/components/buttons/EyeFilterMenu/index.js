import InvisibleButton from "../InvisibleButton";
import { eventOutsideComponent } from "helpers";
import EventListener from "react-event-listener";
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
    const selected = this.props.selected;
    const belowMenu = this.props.getOpenedMenu && this.props.getOpenedMenu();

    return (
      <div className="eye-filter-menu-items">
        <div className={"arrow-up"} />
        {options.map((option, i) => (
          <div
            key={i}
            className={"context-menu-item " + (selected === option.key ? "selected" : "")}
            onClick={(e) => this.onMenuChanged(e, { value: option.value, key: option.key })}
          >
            {option.label}
          </div>
        ))}
        {belowMenu}
      </div>
    );
  }

  render() {
    const { menuOpen } = this.state;
    const className = [
      "eye-filter-menu",
      this.props.className || "",
      menuOpen ? "menu-open" : ""
    ].join(" ");

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
