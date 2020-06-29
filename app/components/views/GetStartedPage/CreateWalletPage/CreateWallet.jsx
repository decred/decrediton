import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";
// SeedWordSelect.css includes custom styling for seed word select which need to be loaded *after*
// ReactSelectGlobal.less, both imports should be deleted when migrating to pi-ui's Select componentt!
import "./SeedWordSelect.css";

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
