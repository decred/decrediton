import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./InvisibleButton.module.css";

const InvisibleButton = (props) => (
  <Button
    {...props}
    className={classNames(
      styles.invisibleButton,
      props.className && props.className
    )}
  />
);

export default InvisibleButton;
