import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./KeyBlueButton.module.css";

const KeyBlueButton = (props) => (
  <Button
    {...props}
    className={classNames(styles.keyBlueButton, props.className)}
  />
);

export default KeyBlueButton;
