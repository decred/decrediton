import { KeyBlueButton } from "buttons";
import styles from "./VoteButton.module.css";

const VoteButton = ({ onClick, children }) => (
  <KeyBlueButton className={styles.voteButton} onClick={onClick}>
    {children}
  </KeyBlueButton>
);

export default VoteButton;
