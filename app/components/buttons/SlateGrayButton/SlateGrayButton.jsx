import Button from "../Button/Button";
import { classNames } from "pi-ui";
import styles from "./SlateGrayButton.module.css";

const SlateGrayButton = (props) => (
  <Button
    {...props}
    className={classNames(
      styles.slateGrayButton,
      props.className && props.className
    )}
  />
);

export default SlateGrayButton;
