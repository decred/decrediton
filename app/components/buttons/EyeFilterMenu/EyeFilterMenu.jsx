import { useState, useRef } from "react";
import { classNames } from "pi-ui";
import InvisibleButton from "../InvisibleButton";
import { useClickOutside } from "hooks";

import "style/EyeFilterMenu.less";
import "style/MiscComponents.less";

const EyeFilterMenu = ({
  onChange,
  unmountMenu,
  options,
  selected,
  getOpenedMenu,
  className
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  // Call custom hook to fire a callback on click outside component
  useClickOutside(wrapperRef, () => {
    setMenuOpen(false);
    unmountMenu && unmountMenu();
  });

  const onMenuChanged = (event, value) => {
    if (onChange) {
      onChange(value);
    }
    setMenuOpen(false);
  };

  const toggleMenuOpen = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) {
      unmountMenu && unmountMenu();
    }
  };

  const openedMenu = () => {
    const belowMenu = getOpenedMenu && getOpenedMenu();
    return (
      <div className="eye-filter-menu-items">
        <div className={"arrow-up"} />
        {options.map((option, i) => (
          <div
            key={i}
            className={classNames(
              "context-menu-item",
              selected === option.key && "selected"
            )}
            onClick={(e) =>
              onMenuChanged(e, { value: option.value, key: option.key })
            }>
            {option.label}
          </div>
        ))}
        {belowMenu}
      </div>
    );
  };

  return (
    <div
      className={classNames(
        "eye-filter-menu",
        className,
        menuOpen && "menu-open"
      )}
      ref={wrapperRef}>
      <div className="eye-filter-menu-button">
        <InvisibleButton
          className="eye-filter-menu-button-icon"
          onClick={toggleMenuOpen}
        />
      </div>
      {menuOpen && openedMenu()}
    </div>
  );
};

export default EyeFilterMenu;
