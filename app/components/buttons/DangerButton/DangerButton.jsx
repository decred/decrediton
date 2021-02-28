import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./DangerButton.module.css";

const DangerButton = (props) => (
  <Button
    {...props}
    className={classNames(
      styles.dangerButton,
      props.className && props.className
    )}
  />
);

export default DangerButton;
