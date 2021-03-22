import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./DangerButton.module.css";

const DangerButton = ({ className, ...props }) => (
  <Button {...props} className={classNames(styles.dangerButton, className)} />
);

export default DangerButton;
