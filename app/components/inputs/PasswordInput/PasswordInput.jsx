import Input from "../Input";
import styles from "./PasswordInput.module.css";
import { classNames, Button } from "pi-ui";
import { usePasswordInput } from "./hooks";

const PasswordInput = ({ ...props }) => {
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordInput();
  return (
    <Input {...{ ...props, type: isPasswordVisible ? "text" : "password" }}>
      <Button
        aria-label="Toggle Passsword Visibility"
        kind="secondary"
        className={classNames(
          styles.showPasswordButton,
          !isPasswordVisible && styles.hide
        )}
        onClick={(e) => {
          e.preventDefault();
          togglePasswordVisibility();
        }}>
        <div />
      </Button>
    </Input>
  );
};

export default PasswordInput;
