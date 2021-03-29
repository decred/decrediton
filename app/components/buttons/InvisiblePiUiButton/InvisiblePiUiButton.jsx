import styles from "./InvisiblePiUiButton.module.css";
import { classNames } from "pi-ui";
import { PiUiButton } from "buttons";

const InvisiblePiUiButton = ({ className, ...props }) => (
  <PiUiButton className={classNames(styles.button, className)} {...props} />
);

export default InvisiblePiUiButton;
