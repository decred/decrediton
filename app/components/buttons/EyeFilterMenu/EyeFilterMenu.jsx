import { useState, useRef } from "react";
import { classNames } from "pi-ui";
import InvisibleButton from "../InvisibleButton/InvisibleButton";
import { useClickOutside } from "hooks";
import styles from "./EyeFilterMenu.module.css";

const EyeFilterMenu = ({
  onChange,
  unmountMenu,
  options,
  selected,
  children,
  type
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  // Call custom hook to fire a callback on click outside component
  useClickOutside(wrapperRef, () => {
    setMenuOpen(false);
    unmountMenu && unmountMenu();
  });

  const onMenuChanged = (event, value) => {
    onChange && onChange(value);
    setMenuOpen(false);
  };

  const toggleMenuOpen = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) {
      unmountMenu && unmountMenu();
    }
  };

  const openedMenu = (type) => {
    return (
      <div className={classNames(styles.menuItems, styles[type])}>
        <div className={styles.arrowUp} />
        {options.map((option, i) => (
          <div
            key={i}
            className={classNames(
              styles.contextMenuItem,
              (Array.isArray(selected)
                ? selected.includes(option.key)
                : selected === option.key) && styles.selected
            )}
            onClick={(e) =>
              onMenuChanged(e, { value: option.value, key: option.key })
            }>
            {option.label}
          </div>
        ))}
        {children}
      </div>
    );
  };

  return (
    <div
      className={classNames(styles.menu, menuOpen && styles.open)}
      ref={wrapperRef}>
      <div className={styles.menuButton}>
        <InvisibleButton
          className={classNames(styles.buttonIcon, styles[type])}
          onClick={toggleMenuOpen}
        />
      </div>
      {menuOpen && openedMenu(type)}
    </div>
  );
};

export default EyeFilterMenu;
