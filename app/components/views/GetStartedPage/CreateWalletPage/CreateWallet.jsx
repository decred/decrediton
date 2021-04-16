import { classNames } from "pi-ui";
/* XXX this import should be fixed XXX */
import styles from "../GetStarted.module.css";

const CreateWalletPage = ({ StateComponent }) => (
  <div className={classNames(styles.getstarted, styles.content)}>
    {StateComponent &&
      (React.isValidElement(StateComponent) ? (
        StateComponent
      ) : (
        <StateComponent />
      ))}
  </div>
);

export default CreateWalletPage;
