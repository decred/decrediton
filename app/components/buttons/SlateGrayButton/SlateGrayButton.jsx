import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./SlateGrayButton.module.css";

const SlateGrayButton = ({ className, ...props }) => (
  <Button
    {...props}
    className={classNames(styles.slateGrayButton, className)}
  />
);

export default SlateGrayButton;
