import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

const CreateWalletPage = ({ StateComponent, ...props }) => (
  <div className={classNames(styles.getstarted, styles.content)}>
    {
      console.log(props)
    }
    {
      console.log(StateComponent)
    }
    {StateComponent &&
      (React.isValidElement(StateComponent) ? StateComponent : (
          <StateComponent />
        ))}
  </div>
);

export default CreateWalletPage;
