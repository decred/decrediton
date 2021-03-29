import styles from "./PiUiButton.module.css";
import { classNames, Button } from "pi-ui";

const PiUiButton = ({ className, kind, disabled, onClick, children }) => (
  <Button
    kind={disabled ? "disabled" : kind}
    className={classNames(styles.button, styles[kind], className)}
    {...{
      onClick,
      children
    }}
  />
);

export default PiUiButton;
