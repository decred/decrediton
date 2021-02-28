import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./CloseButton.module.css";

const CloseButton = (props) => (
  <Button
    {...props}
    className={classNames(
      styles.closeButton,
      props.className && props.className
    )}
  />
);

export default CloseButton;
