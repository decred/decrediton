// @flow
import React from "react";
import { autobind } from "core-decorators";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import "../../style/EyeFilterMenu.less";
import "../../style/MiscComponents.less";

@autobind
class EyeFilterMenu extends React.Component {

  onMenuChanged(event, value) {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    //<span className="eye-filter-menu-button-icon-arrow" />
    const options = this.props.options;
    const labelKey = this.props.labelKey || "label";
    return (
      <IconMenu
        className="eye-filter-menu"
        onChange={this.onMenuChanged}
        iconButtonElement={
          <IconButton
            className="eye-filter-menu-button"
            iconClassName="eye-filter-menu-button-icon"
            style={{padding: null, height: null, width: null}}/> }
        anchorOrigin={{horizontal: "right", vertical: "bottom"}}
        targetOrigin={{horizontal: "right", vertical: "top"}}
      >
        {options.map(opt => (
          <MenuItem
            className="context-menu-item"
            key={opt[labelKey]}
            value={opt}
            style={{fontSize: null, lineHeight: null, minHeight: null}}
            primaryText={opt[labelKey]} />
        ))}
      </IconMenu>
    );
  }
}

export default EyeFilterMenu;
