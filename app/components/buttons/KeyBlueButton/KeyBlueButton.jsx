import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./KeyBlueButton.module.css";

const KeyBlueButton = ({ className, ...props }) => (
  <Button {...props} className={classNames(styles.keyBlueButton, className)} />
);

export default KeyBlueButton;
