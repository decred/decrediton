import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

const CreateWalletPage = ({ StateComponent }) => (
  <div className={classNames(styles.getstarted, styles.content)}>
    {StateComponent &&
      (React.isValidElement(StateComponent) ? StateComponent : (
          <StateComponent />
        ))}
  </div>
);

export default CreateWalletPage;
