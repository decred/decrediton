import styles from "./SmallButton.module.css";
import { Button, classNames } from "pi-ui";

const SmallButton = ({ className, ...props }) => (
  <Button className={classNames(styles.button, className)} {...props}>
    <div />
  </Button>
);

export default SmallButton;
