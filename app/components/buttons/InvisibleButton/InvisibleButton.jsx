import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./InvisibleButton.module.css";

const InvisibleButton = ({ className, ...props }) => (
  <Button
    {...props}
    className={classNames(styles.invisibleButton, className)}
  />
);

export default InvisibleButton;
