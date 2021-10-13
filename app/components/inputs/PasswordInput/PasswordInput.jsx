import Input from "../Input";
import styles from "./PasswordInput.module.css";
import { classNames, Button } from "pi-ui";
import { usePasswordInput } from "./hooks";

const PasswordInput = ({ hideToggleButton, children, ...props }) => {
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordInput();
  return (
    <Input {...{ ...props, type: isPasswordVisible ? "text" : "password" }}>
      {!hideToggleButton && (
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
      )}
      {children}
    </Input>
  );
};

export default PasswordInput;
