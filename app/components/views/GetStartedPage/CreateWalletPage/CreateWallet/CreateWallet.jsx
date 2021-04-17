import styles from "./CreateWallet.module.css";

const CreateWalletPage = ({ StateComponent }) => (
  <div className={styles.content}>
    {StateComponent &&
      (React.isValidElement(StateComponent) ? (
        StateComponent
      ) : (
        <StateComponent />
      ))}
  </div>
);

export default CreateWalletPage;
