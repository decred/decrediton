import { useState, useRef } from "react";
import { classNames } from "pi-ui";
import InvisibleButton from "../InvisibleButton";
import { useClickOutside } from "hooks";
import styles from "./EyeFilterMenu.module.css";

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
      <div className={styles.menuItems}>
        <div className={styles.arrowUp} />
        {options.map((option, i) => (
          <div
            key={i}
            className={classNames(
              styles.contextMenuItem,
              selected === option.key && styles.selected
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
        styles.menu,
        styles[className],
        menuOpen && styles.open
      )}
      ref={wrapperRef}>
      <div className={styles.menuButton}>
        <InvisibleButton
          className={styles.buttonIcon}
          onClick={toggleMenuOpen}
        />
      </div>
      {menuOpen && openedMenu()}
    </div>
  );
};

export default EyeFilterMenu;
